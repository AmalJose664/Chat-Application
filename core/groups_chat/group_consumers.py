
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from pymongo.errors import PyMongoError

from django.core.cache import cache

from datetime import datetime
import json
from asgiref.sync import sync_to_async
from me_chat.templatetags.chatextras import initials, random_text,get_random_rgb
from core.redis import redis_connect, pymongo_connect
redis_service = redis_connect(2)
db = pymongo_connect()
group_collection = db['chat_groups_mongo']
user_collection = db['user_mongo']

def get_temp_redis():
	return redis_service.pipeline()

class GrConsumer(AsyncJsonWebsocketConsumer):

	
	async def connect(self):
		global redis_service
	
		self.return_socket = False
		self.accept_cndtns = True

		self.user = self.scope['user']
		self.me = str(self.user.id)
		print(f"User ==={self.user  } Authenticity {self.user.is_authenticated}")
		if not self.user.is_authenticated:
			self.return_socket = True 
			print("Not Authenticated exited,==>",self.user)
			await self.close()
			return
		self.group_name = self.scope['url_route']['kwargs']['group_id']

		self.connect_group_name = f'group_chat__{self.group_name}'


		
		key = self.scope['url_route']['kwargs']['group_id']
		j_key = self.scope['url_route']['kwargs']['join_key']


		result=await self.load_group(group_id=key, join_key=j_key)
		user_result = await self.load_user()

		
		if self.me in redis_service.smembers(self.connect_group_name):
			await self.close()
			print("Already connected\nReturning user")
			self.return_socket = True
			return

		if(result and user_result):
			self.show_color=get_random_rgb(),
			await self.add_user()
			await self.accept()
			print("Connected!!!!!!!!!!!! to group", self.connect_group_name)
			await self.channel_layer.group_add(self.connect_group_name, self.channel_name)
			await self.send_join_disconnect(type="join")
			await self.send_online_users()
		else:
			print('User or Group Not found \nManually Closing')
			await self.close()
			self.return_socket = True
		

	
		
	#------------------------------------------------------------------------------------------------------------------------------------------#
	
	async def disconnect(self, close_code):
		
		
		if not self.user.is_authenticated:
			print("Not Authenticated exited , ",close_code)
			await super().disconnect(close_code)
			return
		
		
		if self.return_socket:
			await self.close()
			await super().disconnect(close_code)
			return
		
		await self.remove_user()
		await self.send_join_disconnect(type="left")
		await self.send_online_users()
		await self.channel_layer.group_discard(self.connect_group_name, self.channel_name)
		await super().disconnect(close_code)
		print("DIsconnected Manually")

	#------------------------------------------------------------------------------------------------------------------------------------------#

	async def receive(self, text_data=None, bytes_data=None, **kwargs):

		if bytes_data:
			await self.handle_images(bytes_data=bytes_data)
			return
		
		try:
			text_data_json = json.loads(text_data)
		except json.JSONDecodeError:
			print("Json Decode error\nNo Message send/received\nReturing ......\n",text_data)
			return
		except Exception as e:
			print("Exception ",str(e))
			return
		
		message_type = text_data_json.get('type')
		user_message = text_data_json.get('message',"") 
		user = text_data_json.get('name')

		

	
		if message_type == "CHAT_MESSAGE_EVENT":
			time_send = datetime.now()
			if not user_message:
				return
			

			await self.channel_layer.group_send(
					self.connect_group_name,{
						'type': "CHAT_MESSAGE_EVENT",
						'message':user_message,
						'name':f"{self.db_user['user_name']}__{self.db_user['_id']}",
						'sender':self.db_user['_id'],
						'pro_pic':self.db_user['profile_picture'],
						"status":1,
						'room':self.connect_group_name,
						'initials':initials(user),
						'show_color':self.show_color,
						'created_at': time_send.isoformat()
					}
				)
			print("Message sent")
		elif message_type == "CHAT_REMOVE_EVENT":
			target_user = text_data_json.get('target_user')
			group_creator = self.my_group['created_by'].split('__')[0]
			if group_creator != self.me: 
				print("you are not group creator")
				return
			await self.channel_layer.group_send(
				self.connect_group_name,{
					'type': "CHAT_REMOVE_EVENT",
					'issuer':self.db_user['_id'],
					'target_user': target_user,
				}
			)

		else:
			return

		
	
	#------------------------------------------------------------------------------------------------------------------------------------------#
	
	async def send_online_users(self):

		await self.channel_layer.group_send(
			self.connect_group_name,{
				'type':"CHAT_ONLINE_USERS_EVENT",
			}
		)
	async def send_join_disconnect(self,type):
		print("Join disconect sending ",type)
		await self.channel_layer.group_send(
			self.connect_group_name,{
				'type':"CHAT_JOIN_DISCONNECT",
				'user':self.db_user['user_name'],
				'fucnt':type
			}
		)
	
	# ----------------------------------Handlers--------------------------------------------------------------------------------------------------#
	async def CHAT_REMOVE_EVENT(self,event):

		if (event['target_user'] == self.db_user['_id'] ):
			await self.send_json({"type": "CHAT_REMOVE_EVENT"})
			await self.close()
		
	async def CHAT_ONLINE_USERS_EVENT(self,event):
		users = redis_service.smembers(self.connect_group_name)
		#users.discard(f"{self.me}__:__{self.db_user['profile_picture']}")

		await self.send(text_data=json.dumps({
			'type': event['type'],
			'users':list(users),
			"len":len(users),
		}))

	async def CHAT_FILE_EVENT(self, event):
		await self.send(bytes_data=event["data"])
	
	async def CHAT_JOIN_DISCONNECT(self,event):
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'user': event['user'],
			'fucnt':event['fucnt']
		}))
	async def CHAT_MESSAGE_EVENT(self, event):
		#send message to websocket (front end)
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'message': event['message'],
			'name': event['name'],
			'sender':event['sender'],
			'status':event['status'],
			'room': event['room'],
			'initials': event['initials'],
			'pro_pic':event['pro_pic'],
			'show_color':event['show_color'],
			'created_at': event['created_at'],
			
		}))
	# ----------------------------------Handlers-end--------------------------------------------------------------------------------------------------#

	@sync_to_async(thread_sensitive=False)
	def load_user(self):
		global user_collection
		try:
			user = user_collection.find_one({'sqlite_id':self.me} ,{'_id':1,'user_name':1,'profile_picture':1})
			if user:
				user['_id'] = str(user['_id'])
				print(user,"<<<Here is user")
				self.db_user = user
				return True
			return False
		
		except PyMongoError as e:
			print("Does not Exist Exception ",str(e))
			return False
		except Exception as e:
			print("Exception ",str(e))
			return False


	@sync_to_async(thread_sensitive=False)
	def load_group(self, group_id, join_key):
		global group_collection
		
		try:
			group = group_collection.find_one({'group_key':group_id,'join_key':join_key})
			if(group):
				self.my_group = group
				return True
			return False
		except PyMongoError as e:
			print("Does not Exist Exception ",str(e))
			return False
		except Exception as e:
			print("Exception ",str(e))
			return False
		

	async def add_user(self):
		global redis_service
		redis_service.sadd(self.connect_group_name, f"{self.db_user['_id']}__:__{self.db_user['profile_picture']}__:__{self.db_user['user_name']}")
		
		print(self.db_user)
		


	def get_group_users(self, group):
		data = redis_service.smembers(group)
		
		return len(data) if data else 0

	@sync_to_async(thread_sensitive=False)
	def remove_user(self):
		global redis_service
		redis_service.srem(self.connect_group_name, f"{self.db_user['_id']}__:__{self.db_user['profile_picture']}__:__{self.db_user['user_name']}")

		


	async def handle_images(self, bytes_data):
		
		delimiter = b"||META_END||"  

		delimiter_index = bytes_data.find(delimiter)
        
		if delimiter_index == -1:
			print("Delimiter not found. Invalid data format.")
			return
		metadata_bytes = bytes_data[:delimiter_index]
		file_data = bytes_data[delimiter_index + len(delimiter):]
# find the meta data and the file data



		try:
			metadata_str = metadata_bytes.decode("utf-8").strip("\x00")
			meta_data = json.loads(metadata_str)
			print(meta_data)
			file_size = meta_data['fileSize']
			max_size_mb = 80

			max_size_bytes = max_size_mb * 1024 * 1024

			if file_size > max_size_bytes:
				print("File is larger than 80MB")
				return
			
		except UnicodeDecodeError:
			print("Error decoding metadata. Invalid format.")
			return
#add new , additional values to meta data
		meta_data['name'] = f"{self.db_user['user_name']}__{self.db_user['_id']}"
		meta_data['sender'] = self.db_user['_id']
		meta_data['pro_pic'] = self.db_user['profile_picture']
		meta_data['status'] = 1
		meta_data['room'] = self.connect_group_name
		meta_data['show_color'] = self.show_color
		meta_data['created_at'] = datetime.now().isoformat()

		new_metadata_bytes = json.dumps(meta_data).encode("utf-8")

		new_bytes_data = new_metadata_bytes + delimiter + file_data
#convert it back to binary and send it

		await self.channel_layer.group_send(self.connect_group_name,{
			'type':'CHAT_FILE_EVENT',
			'data':new_bytes_data,
		})

