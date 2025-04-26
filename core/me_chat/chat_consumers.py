from datetime import datetime
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message_mongo, Conversations_mongo
from .templatetags.chatextras import initials, random_text
import re
from pymongo import errors

from core.redis import redis_connect, pymongo_connect
from .mongo_queries import get_query_for_user_friends
from django.conf import settings

redis_service = redis_connect(0)
pipeline = redis_service.pipeline() if redis_service else ""
mongo_db = pymongo_connect()
user_collection = mongo_db['user_mongo']
message_collection = mongo_db['message_mongo']

online_tracking_group = f"global____{random_text(46)}____"
print("Global Chat group for online tracking==>",online_tracking_group,"\n")

db_actions = settings.SAVE_MESSAGES





class ChatConsumer(AsyncJsonWebsocketConsumer):
	
	async def connect(self):
		
		self.return_socket = False
		self.ONLINE_GUEST = False

		self.users_online = redis_service.smembers('online_users')

		self.user = self.scope['user']
		self.me = str(self.user.id)
		
		if self.me in self.users_online:
			print("Already In...")
			await self.close()
			self.return_socket = True
			return


		print(f"User ==={self.user  } Authenticity {self.user.is_authenticated}")
		if not self.user.is_authenticated:
			self.return_socket = True 
			print("Not Authenticated exited,==>",self.user)
			await self.close()
			return
		print("\nConnect event\n====================================================================================connect >>>>>>fisrt<<<<<< ====================================================================================\n")
		
		
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.intended_user = self.room_name

		self.db_user = await self.find_db_user(self.me)
		try:
			if await self.connect_first():
				await self.accept()
				return
			
		except ValueError: 
			return
			
		#self.pymongo = 0
		#self.mongo = 0
		# print these for time tesing 

		self.db_receiver = await self.find_db_user(self.intended_user)

		try:
			await self.check_conditions()
			
		except ValueError: 
			return

		
		await self.set_user_targets(self.intended_user)
		await self.select_room()
			

		if db_actions:
			self.db_conv =  await self.load_conversations()

		#join
		
		print("bro joining to room=> ",self.room_group_name)
		await self.channel_layer.group_add(online_tracking_group, self.channel_name)
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		
		await self.redis_user_storage()
		
		if db_actions:
			self.last_message=[False]

		await self.get_user_friends()

		await self.accept()
		
		#infrom user
		
		await self.send_online_users(type='NEW_JOIN')
		print(f"\n====================================================================================conect >>>>last<<<< ============================================================================================\n")
		self.str_db_user = str(self.db_user)
		self.str_db_receiver = str(self.db_receiver)

#----------------------------------------------connect close ----------------------------------------------------------------

	async def disconnect(self, close_code):
		if not self.user.is_authenticated:
			print("Not Authenticated exited , ",close_code)
			await super().disconnect(close_code)
			return
		
		if self.ONLINE_GUEST:
			if await self.close_online_guest():
				await self.close()
				return

		if self.return_socket:
			await super().disconnect(close_code)
			return
		
		await self.del_user_targets()
		if db_actions:
			await self.update_conversations(self.last_message)
		
		await self.update_redis_user()
		await self.send_online_users(type='DISCONNECT')
		
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
		await self.channel_layer.group_discard(online_tracking_group, self.channel_name)

		await super().disconnect(close_code)
		
		print(">>>>>>>>>Disconnected<<<<<<<<<<<<=====//////////pymnogo ", " --------mongoengine ,close code ==>>",close_code)


	
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	async def receive(self, text_data):
		try:
			text_data_json = json.loads(text_data)
		except json.JSONDecodeError:
			print("Json Decode error\nNo Message send/received\nReturing ......\n",text_data)
			return
		message_type = text_data_json.get('type')
		if self.ONLINE_GUEST:
			if message_type=="CHAT_ROOM_CHANGE":
				new_room = text_data_json.get('new_chat','')
				print(">>>changing room, As Guest new Room=>",new_room)
				return await self.change_room(new_room, is_online_user=True)
			print('Guests cant send messages\n returned from receive')
			return

		
		user_message = text_data_json.get('message',"") 
		user = text_data_json.get('name')
		conv_id = text_data_json.get('conv_id',"00000")
		read=0

		notifying_user_channel = redis_service.hget('user_channel_mapping', self.intended_user)
		intented_user_target=""
		temp_online_users = redis_service.smembers('online_users')

		if self.intended_user in temp_online_users:
			
			intented_user_target = await self.retrive_user_target(self.intended_user)
		else:
			pass
		

		if message_type == "CHAT_MESSAGE_EVENT":
			time_send = datetime.now()
			if not user_message:
				return
			if intented_user_target != self.me and self.intended_user in temp_online_users:
				print(f"sending notification to {notifying_user_channel}.................")
				read=1
				
				await self.channel_layer.send(
					notifying_user_channel,{
						'type': "CHAT_NOTIFICATION_EVENT",
						'message':user_message,
						'name':user,
						'sender':self.str_db_user,
						'receiver':self.str_db_receiver,
						'room':self.room_group_name,
						'initials':initials(user),
						'cnvstn_id':conv_id,
						'created_at': time_send.isoformat()
					}
				)
				await self.channel_layer.group_send(
					self.room_group_name,{
						'type': "CHAT_MESSAGE_EVENT",
						'message':user_message,
						'name':user,
						'sender':self.str_db_user,
						'receiver':self.str_db_receiver,
						"status":read,
						'room':self.room_group_name,
						'initials':initials(user),
						'cnvstn_id':conv_id,
						'created_at': time_send.isoformat()
						#'created_at': timesince(new_message.created_at),
					}
				)
			else:
				
				my_room_count = int(redis_service.hget("active_rooms_user_count" , self.room_group_name) or 0)
				
				if my_room_count == 2:
					read = 2
				elif my_room_count == 1:
					read = 0
				print("Read value ",read)
				await self.channel_layer.group_send(
					self.room_group_name,{
						'type': "CHAT_MESSAGE_EVENT",
						'message':user_message,
						'name':user,
						'sender':self.str_db_user,
						'receiver':self.str_db_receiver,
						"status": read,
						'room':self.room_group_name,
						'initials':initials(user),
						'cnvstn_id':conv_id,
						'created_at': time_send.isoformat()
						#'created_at': timesince(new_message.created_at),
					}
				)
		elif message_type=="CHAT_ROOM_CHANGE":
			new_room = text_data_json.get('new_chat','')
			print(">>>changing room, new Room=>",new_room)
			return await self.change_room(new_room)
		
		elif message_type == "CHAT_TYPE_EVENT":
			
			type_status = text_data_json.get('type_status',"TYPE_STOP")
			print('type event received__ status',type_status)
			if self.intended_user in temp_online_users and notifying_user_channel:
				await self.user_typing(notifying_user_channel=notifying_user_channel,type_status=type_status, user=user)
			return
		elif message_type == "CHAT_DELETE_EVENT":
			m_id = text_data_json.get('m_id','')
			message_time = text_data_json.get('m_time','')
			if m_id and message_time:
				await self.delete_message(message_id=m_id, message_time=message_time)
			return
		else:
			
			print(message_type," Chat type not supported")
		#processing_start_time = time.time()
		print("received====>>>>conv id", conv_id,"==>>>>",user_message, "<<<<sent_by ",self.db_user, "received_by ",self.db_receiver)
		#pymongo_time =  time.time()
		if db_actions and user_message != "":	
			self.last_message = await self.insert_message(content=user_message,
												m_sender=self.db_user,
												m_receiver=self.db_receiver,
												content_type="text",
												conversation_id=f"{self.db_user}__{self.db_receiver}",
												m_status=read,
												r_reference=None,
												time = time_send
												)
			
		
		#pymongo_time_process =  time.time() - pymongo_time
		#mongo_time =  time.time()
		# Mongo engine data insertion // Uses more time than pymongo
		# self.last_message = await self.insert_message_mongoengine(content=user_message, m_sender=self.db_user, m_receiver=self.db_receiver, conversation_id=f"{self.db_user}__{self.db_receiver}",
		# 						  m_status=read,
		# 						  )
		# Time calculation function use only for testing
		# await self.time_calc( processing_start_time , mongo_time, pymongo_time_process)


		#----------------------end received-----------------------

		
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	async def delete_message(self, message_id , message_time):
		from bson import ObjectId
		
		is_valid = True if ObjectId.is_valid(message_id) else False
		id = ObjectId(message_id) if is_valid else ""
		time = datetime.fromisoformat(message_time)
		print(message_id,message_time, "DELETE DATA HEERE")
		deleted_doc = message_collection.find_one_and_delete({'$or': [{"_id": id}, {'t': time}]})
		
		if deleted_doc:
			print( deleted_doc)
			message_id = message_id if is_valid else ""
			await self.channel_layer.group_send(self.room_group_name,{
				'type':"CHAT_DELETE_EVENT",
				'success':'success',
				'user':self.str_db_user,
				'm_id': message_id,
				'm_time':message_time,
				'm_c':deleted_doc['c']
			})
		return

	async def user_typing(self,notifying_user_channel, type_status,user ):
		await self.channel_layer.send(
						notifying_user_channel,{
							'type': "CHAT_TYPE_EVENT",
							'type_status':type_status,
							'name':user,
							'sender':self.me,
							'receiver':self.intended_user,
						}
				)
	async def send_online_users(self, type):
		
		await self.channel_layer.group_send(
			online_tracking_group,{
				'type':"CHAT_ONLINE_USERS_EVENT",
				'event':type
			}
		)

	async def send_erros(self,error, type, location):
		await self.channel_layer.group_send(
			self.room_group_name,{
				'type':"CHAT_SERVER_ERROR_EVENT",
				'error':error,
				'e_type':type,
				'from':location
				
			}
		)
	

	async def change_room(self, new_user="0000", is_online_user=False):
		
		self.db_receiver = await self.find_db_user(new_user)
		print("COnditions=", (not self.db_receiver or (new_user == self.me or new_user == self.intended_user)))
		if not self.db_receiver or (new_user == self.me or new_user == self.intended_user):
			print("No user found to chat\n Returning from change room")
			await self.channel_layer.send(
						self.channel_name,{
							'type': "CHAT_ROOM_CHANGE",
							'status':'error',
							'code':400,
							'new_user':new_user,
						}
				)
			return

		await self.set_user_targets(new_user)
		if(is_online_user):
			self.str_db_user = str(self.db_user)
			self.last_message=[False]
			self.room_group_name = 'room'
			self.ONLINE_GUEST = False
			await self.channel_layer.group_discard(online_tracking_group, self.channel_name)
		else:
			await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

		self.str_db_receiver = str(self.db_receiver)
		self.intended_user = new_user

		await self.update_redis_user(changing_room=True)
		await self.select_room()
		if db_actions:
			if not is_online_user:
				await self.update_conversations(self.last_message)
			self.db_conv =  await self.load_conversations()
		await self.redis_user_storage(changing_room=True)

		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.channel_layer.send(
						self.channel_name,{
							'type': "CHAT_ROOM_CHANGE",
							'status':'success',
							'code':200,
							'new_user':new_user,
						}
				)
		print("Room Change Success !!")
		

#-------------------------HANDLERS-------------------------------------------------
	async def CHAT_ROOM_CHANGE(self,event):
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'status':event['status'],
			'code':event['code'],
			'new_user':event['new_user'],
			}))
		
	async def CHAT_DELETE_EVENT(self,event):
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'success':event['success'],
			'user':event['user'],
			'm_id': event['m_id'],
			'm_time':event['m_time'],
			'm_c':event['m_c']
			}))

	async def CHAT_ONLINE_USERS_EVENT(self,event):
		users_online = self.friends_set & redis_service.smembers('online_users')
		print("Sending Online Users for ", self.me," ", users_online)
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'event':event['event'],
			'users':list(users_online),
			"len":len(users_online),
		}))


	async def CHAT_NOTIFICATION_EVENT(self, event):
		await self.send(text_data=json.dumps({
				'type': event['type'],
				'message': event['message'],
				'name': event['name'],
				'sender':event['sender'],
				'receiver':event['receiver'],
				'room': event['room'],
				'initials': event['initials'],
				'cnvstn_id':event['cnvstn_id'],
				'created_at': event['created_at'],
				
			}))
	async def CHAT_TYPE_EVENT(self, event):
		await self.send(text_data=json.dumps({
				'type': event['type'],
				'type_status': event['type_status'],
				'name': event['name'],
				'sender':event['sender'],
				'receiver':event['receiver'],
				
		}))
		print("Type notification sent")

	async def CHAT_MESSAGE_EVENT(self, event):
		#send message to websocket (front end)
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'message': event['message'],
			'name': event['name'],
			'sender':event['sender'],
			'receiver':event['receiver'],
			'status':event['status'],
			'room': event['room'],
			'initials': event['initials'],
			'cnvstn_id':event['cnvstn_id'],
			'created_at': event['created_at'],
			
		}))
	async def CHAT_SERVER_ERROR_EVENT(self, event):
		await self.send(text_data=json.dumps({
			'type': event['type'],
			'error':event['error'],
			'e_type':event['e_type'],
			'from': event['from'],
		}))

	
	
#-----------------Handlers end --------------------------------------------------------------------------------------------------------------------------------------
	
	async def select_room(self):
		# critical function
		if self.intended_user in self.users_online:
			
			request_user_room = redis_service.hget('user_room_mapping', self.intended_user) or "000-000"
			
			self.room_name = random_text(16)
			self.room_group_name = f'chat_{self.room_name}'
			request_room_count = int(redis_service.hget("active_rooms_user_count" , request_user_room) or 0)


			
			intented_user_target = await self.retrive_user_target(self.intended_user)
			
			print(f"New room conditon 1) target {intented_user_target != self.me} ")
			
			if not request_user_room:
				print('Room not found')
				self.room_name = random_text(16)
				self.room_group_name = f'chat_{self.room_name}'
				
			
			elif request_room_count>=2:
				print(request_room_count,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
				self.room_name = random_text(16)
				self.room_group_name = f'chat_{self.room_name}'
			
			


			elif intented_user_target == self.me :
				print(f"Joining to intended user >>>>>{self.intended_user}")
				self.room_group_name = f'{request_user_room}'

			else:
				print("Creating new room  /❌/❌/❌/❌/❌/❌/❌/  Switched to notify mode")
		
				

		else:
			print("No found user online ", self.intended_user, )
			self.room_name = random_text(24)
			self.room_group_name = f'chat_{self.room_name}'


	@sync_to_async(thread_sensitive=False)
	def update_redis_user(self, changing_room=False):

		if not changing_room:
			pipeline.srem('online_users', self.me)
			pipeline.hdel("user_channel_mapping", self.me)
		pipeline.hdel('user_room_mapping', self.me)
			
		pipeline.hincrby("active_rooms_user_count", self.room_group_name, -1)
		pipeline.execute()
		user_count = int(redis_service.hget("active_rooms_user_count" , self.room_group_name)) or 0

		if int(user_count) <= 0:
			pipeline.hdel("active_rooms_user_count", self.room_group_name)
			pipeline.srem("all_active_rooms", str(self.room_group_name))
			pipeline.execute()
		
	

	@sync_to_async(thread_sensitive=False)
	def redis_user_storage(self, changing_room=False):
		if not changing_room:
			pipeline.sadd("online_users", self.me)
			pipeline.hset("user_channel_mapping", self.me, self.channel_name)
		pipeline.sadd("all_active_rooms", str(self.room_group_name))
		pipeline.execute()

		user_count = redis_service.hget("active_rooms_user_count" , self.room_group_name) or 0
		
		if (int (user_count) ==0):
			redis_service.hset("active_rooms_user_count", self.room_group_name, 1)
			
		else:
			redis_service.hincrby("active_rooms_user_count", self.room_group_name, 1)
			
		pipeline.hset("user_room_mapping", self.me, self.room_group_name)
		pipeline.expire("active_rooms_user_count", 1800) 
		pipeline.execute()
	

	@sync_to_async(thread_sensitive=False)
	def set_user_targets(self,target):
		redis_service.hset("user_target_user",self.me, target)
		
	
	@sync_to_async(thread_sensitive=False)
	def del_user_targets(self):
		redis_service.hdel("user_target_user", self.me)

	@sync_to_async(thread_sensitive=False)
	def retrive_user_target(self,user):
		return redis_service.hget("user_target_user",user)
	
	
	
	
#===================db functions ===========================================

	@sync_to_async(thread_sensitive=False)
	def insert_message(self,m_sender, m_receiver, content, conversation_id, content_type, m_status, r_reference, time):
		

		
		content = re.sub(r"[\$\{\}]", "", content)
		if content_type == 'text': 
			content_type = 0
		elif content_type == 'image':
			content_type =1
		
		message_doc = {
						's': m_sender,
    					'r': m_receiver,
    					'c_id': conversation_id,
    					'c': content,
    					'ty': content_type,
    					'sa': m_status,     
    					't': time,
    					'rr': r_reference,

		}
		if not r_reference:
			message_doc.pop("rr")
		need_to_update = False
		
		try:
			message_collection.insert_one(message_doc)
			need_to_update = True
		except errors.PyMongoError as e:
			print("Data insertion error", str(e))
			self.send_erros(f"The message {content} was not inserted to database","db_error","Insertion to db")
			need_to_update = False
			return [need_to_update, f'{content}__{str(self.db_user)}', m_status ,time]
		
		# print("Inserted via pymongo")
		content = [need_to_update, f'{content}__{str(self.db_user)}', m_status ,time]
		return content
	
	
	@sync_to_async(thread_sensitive=False)
	def insert_message_mongoengine(self, m_sender, m_receiver, conversation_id, content,m_status):
		import mongoengine.errors
		

		content = re.sub(r"[\$\{\}]", "", content)
		try:
			mes = Message_mongo(m_sender=m_sender, m_receiver=m_receiver, conversation_id= conversation_id ,
							content=content,
							m_status=m_status,
						).save()
		except mongoengine.errors.OperationError  as e:
			self.send_erros(f"The message {content} was not inserted to database","db_error","Insertion to db")
			print("Data insertion error", str(e))
		# print("Inserted via mongoengine")
		return mes

	
	async def find_db_user(self,id):

		try:
			user = user_collection.find_one({'sqlite_id':id})
			if user:
				user = user["_id"]
				return user
			else:
				return False
		except errors.PyMongoError as e:
			print("Pymongo Errros ==>>Reason", str(e))
		except Exception as e:
			print("Common Errros ==>>Reason", str(e))
			
	



	#time calcuation mechanisms use only for testing 
	@sync_to_async(thread_sensitive=False)
	def time_calc(self, processing_start_time, mongo_time, pymongo_time_process):
		import time

		mongoengine_time_process = time.time() - mongo_time
		server_processing_time = time.time() - processing_start_time
		print(server_processing_time*10000, "Time total")
		print(pymongo_time_process*10000, "Time pymongo ")
		print(mongoengine_time_process*10000, "Time  mongo engine")
		print("difrrence = ", mongoengine_time_process- pymongo_time_process)
		print("Pymongo is greater ", mongoengine_time_process < pymongo_time_process)
		print("mongoengine is greater ", mongoengine_time_process > pymongo_time_process)
		if mongoengine_time_process < pymongo_time_process:
			self.pymongo += 1
		else:
			self.mongo +=1



	@sync_to_async(thread_sensitive=False)
	def load_conversations(self):
		

		cnvrstn = Conversations_mongo.objects(prtcpnt__all=[self.db_user , self.db_receiver]).first()
		if not cnvrstn:
			conver_id = f"{str(self.db_user)}__{str(self.db_receiver)}"
			cnvrstn = Conversations_mongo(c_id=conver_id , prtcpnt=[self.db_user, self.db_receiver])
			
		return cnvrstn
	
	@sync_to_async(thread_sensitive=False)
	def update_conversations(self, message):
		if len(message)<2:
			print("returned from update convs")
			return
		print("TRying to update conditions ",self.db_conv.lst_m != message, " 2 ) ",message[0], "From db",self.db_conv.lst_m)
		if not message[0]:
			return
		if self.db_conv.lst_m != message[1]:
			
			self.db_conv.lst_m = message[1]
		self.db_conv.l_s = message[2]
		self.db_conv.t = message[3]
		self.db_conv.save()
		print('Conv Updated')

	@sync_to_async(thread_sensitive=False)
	def get_user_friends(self):
		pipeline = get_query_for_user_friends(self.db_user)
		user_data_collection = mongo_db['user_data_mongo']
		friends = list(user_data_collection.aggregate(pipeline=pipeline))
		friends = friends[0]['friends']
		self.friends_set = set(friends)



	async def check_conditions(self):
		if self.me == self.intended_user:
			print('Cannot send message to yourself \nDisconnecting.....')
			await self.close()
			self.return_socket = True
			raise ValueError('Cannot send message to yourself')
		if not self.db_receiver:
			
			print("Websocket closed due to no user found with id ",self.intended_user)
			await self.close()
			self.return_socket = True
			raise ValueError("Websocket closed due to no user found with id ")
			return
		
		
	
	
	async def connect_first(self):
		print("Connection received")
		print('Intented user' , self.intended_user)
		if (self.intended_user == "CONNECTION_FOR_ONLINE_STATUS"):
			self.ONLINE_GUEST = True
			redis_service.sadd("online_users", self.me)
			redis_service.hset("user_channel_mapping", self.me, self.channel_name)
			await self.get_user_friends()
			await self.channel_layer.group_add(online_tracking_group, self.channel_name)
			
			await self.send_online_users(type='NEW_JOIN')
			await self.set_user_targets('-----------------------')
			return True
		else :
			return False

	async def close_online_guest(self):
		print("Connection received for closing ")
		print('Intented user' , self.intended_user)
		if (self.intended_user == "CONNECTION_FOR_ONLINE_STATUS"):
			redis_service.srem("online_users", self.me)
			redis_service.hdel("user_channel_mapping", self.me)
			await self.channel_layer.group_discard(online_tracking_group, self.channel_name)
			await self.send_online_users(type='DISCONNECT')
			await self.del_user_targets()
			self.room_group_name = 'room'
			await self.update_redis_user()
			return True
		