from channels.generic.websocket import AsyncJsonWebsocketConsumer
from pymongo.errors import PyMongoError

from datetime import datetime
import json
from asgiref.sync import sync_to_async
from me_chat.templatetags.chatextras import initials, random_text
from core.redis import redis_connect, pymongo_connect
redis_service = redis_connect(2)
collection = pymongo_connect()['chat_groups_mongo']

def get_temp_redis():
	return redis_service.pipeline()

class GrConsumer(AsyncJsonWebsocketConsumer):

	
	async def connect(self):
	
		self.return_socket = False
		self.accept_cndtns = True
		self.ONLINE_GUEST = False

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
		if(result):
			await self.add_user()
			await self.accept()
			print("Connected!!!!!!!!!!!!")
			await self.channel_layer.group_add(self.connect_group_name, self.channel_name)
		else:
			await self.close()
			self.return_socket = True
		

	#------------------------------------------------------------------------------------------------------------------------------------------#
	async def receive(self, text_data=None, bytes_data=None, **kwargs):
		return print(text_data,"  ", bytes_data)
		#return await super().receive(text_data, bytes_data, **kwargs)
	#------------------------------------------------------------------------------------------------------------------------------------------#
	
	async def disconnect(self, close_code):
		
		
		if not self.user.is_authenticated:
			print("Not Authenticated exited , ",close_code)
			await super().disconnect(close_code)
			return
		
		if self.ONLINE_GUEST:
			# if await self.close_online_guest():
			# 	self.close()
			# 	return
			pass
		if self.return_socket:
			await self.close()
			await super().disconnect(close_code)
			return
		
		await self.remove_user()
		await self.channel_layer.group_discard(self.connect_group_name, self.channel_name)
		await super().disconnect(close_code)
		print("DIsconnected Manually")

	#------------------------------------------------------------------------------------------------------------------------------------------#

	@sync_to_async(thread_sensitive=False)
	def load_group(self, group_id, join_key):
		
		try:
			group = collection.find_one({'group_key':group_id,'join_key':join_key})
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
		

	@sync_to_async(thread_sensitive=False)
	def add_user(self):
		redis_service.sadd(self.connect_group_name, self.me)


	def get_group_users(self, group):
		data = redis_service.smembers(group)
		
		return len(data) if data else 0

	@sync_to_async(thread_sensitive=False)
	def remove_user(self):
		redis_service.srem(self.connect_group_name, self.me)
		length = self.get_group_users(self.connect_group_name)

		# if(length == 0):
		# 	try:
		# 		result = collection.delete_one({'group_key':self.group_name})
		# 		print(result)
		# 	except PyMongoError as e:
		# 		print("error in deleting ",str(e))