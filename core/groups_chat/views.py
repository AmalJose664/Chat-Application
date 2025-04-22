
from datetime import datetime
from groups_chat.models import ChatGroups_mongo
from django.http import JsonResponse
import mongoengine
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from me_chat.templatetags.chatextras import initials, get_random_rgb_in_range
from .group_consumers import get_temp_redis,group_collection
pipeline = get_temp_redis()







class Get_Groups(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request):
		time = 86400
		
		global pipeline
		

		try:
			groups = ChatGroups_mongo.objects().order_by('-created_at').as_pymongo()[:30]
			new_array = []
			grps_dlt = []
			for group in groups:
				pipeline.smembers(f"group_chat__{group['group_key']}")
			redis_result = pipeline.execute()

			for i, group in enumerate(groups):
				lenth = len(redis_result[i])
				created_time = (datetime.now()-group['created_at']).total_seconds()

				if (created_time >= time and lenth == 0) and group['name'] != 'Global Chat':
					print(f"\ndeleting group '{group['name']}' created time {created_time} Compoaring with {time} Also skipping group")

					grps_dlt.append(group['group_key'])
					continue

				group['_id'] = str(group['_id'])
				group.pop('join_key')
				group['initial'] = initials(group['name'])
				group['color'] = get_random_rgb_in_range(50,160)

				group['count'] = lenth if redis_result[i] else 0
				group.pop('group_key')

				new_array.append(group)
			print('Deleteinng groups ',grps_dlt,'\n')
			result = group_collection.delete_many({ 'group_key': { '$in': grps_dlt} })

			print(f"Deleted {result.deleted_count} documents / groups")

			
			return JsonResponse({'Data':'Success','groups':new_array},status=status.HTTP_200_OK)
		except Exception as e:
			print('Exception ', str(e))
			return JsonResponse({'Error':'Server Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		









class Find_group(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request,group_name):
		global pipeline
		try:
			import re
			pattern = re.compile(f'.*{re.escape(group_name)}.*', re.IGNORECASE)
			groups = ChatGroups_mongo.objects(name=pattern).order_by('-created_at').as_pymongo()[:30]
			
			new_array = []
			for group in groups:
				pipeline.smembers(f"group_chat__{group['group_key']}")
			redis_result = pipeline.execute()

			for i, group in enumerate(groups):
				lenth = len(redis_result[i])


				group['_id'] = str(group['_id'])
				group.pop('join_key')
				group['initial'] = initials(group['name'])
				group['color'] = get_random_rgb_in_range(50,160)

				group['count'] = lenth if redis_result[i] else 0
				group.pop('group_key')

				new_array.append(group)
			print(new_array)
			return JsonResponse({'Data':'Success','groups':new_array},status=status.HTTP_200_OK)

			
		except Exception as e:
			print('Exception ', str(e))
			return JsonResponse({'Error':'Server Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


		return JsonResponse({'Error':'Server Error'},status=status.HTTP_200_OK)
	



	
class Create_Group(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request, group_name, lock):
		import uuid
		
		from me_chat.templatetags.chatextras import random_text
		
		try:
			lock = not bool(lock)
			print('call to create ', lock)
			group_join_key = str(uuid.uuid4())[:8]
			group_id  = f"{group_name.lower().replace(' ',"")}__{random_text(8)}"

			existing_group = ChatGroups_mongo(name=group_name, group_key=group_id, join_key=group_join_key, is_private=lock, 
									 created_by=f"{str(request.user.id)}__{request.user.name}").save()
			existing_group= existing_group.to_mongo().to_dict()
			existing_group['_id'] = str(existing_group['_id'])
			existing_group['count'] = 0
			existing_group['initial'] = initials(group_name)

			return JsonResponse({'Data':'Success','group_data':existing_group},status=status.HTTP_200_OK)

		except mongoengine.errors.NotUniqueError as e:
			print('Not unique ===', str(e))
			return JsonResponse({'Error':'error','reason':'Group Name Already Taken'},status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			print('Error ===', str(e))
			return JsonResponse({'Error':'error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		





class Join_Group(APIView):
	permission_classes=[IsAuthenticated]

	def get(self, request, object_id, join_key):
		
		try:

			group = ChatGroups_mongo.objects.get(id=object_id)
			creator = group.created_by.split('__')[0] == str(request.user.id)
			if not group.is_private or (group.is_private and group.join_key == join_key) or (creator):

				group_data = group.to_mongo().to_dict()
				group_data['_id'] = str(group_data['_id'])
				group_data['initial'] = initials(group_data['name'])
				return JsonResponse({'Data': 'Success', 'group_data': group_data}, status=status.HTTP_200_OK)
			
			else:
				return JsonResponse({'Error': 'Invalid join key'}, status=status.HTTP_403_FORBIDDEN)

		except mongoengine.errors.DoesNotExist as e:
			print("Error No group found ",str(e))
			return JsonResponse({'Error':'error','reason': f'No group Found with id {object_id}' } ,status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			print("Error server error ",str(e))
			return JsonResponse({'Error':'error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		




	
class Show_Group_users(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request, group_key):
		from .group_consumers import get_temp_redis

		pipeline = get_temp_redis()
		pipeline.smembers(f'group_chat__{group_key}')
		result = pipeline.execute()
		print(group_key, result)

		users = list(result[0])
		return JsonResponse({'Data': 'Success', 'group_data': users}, status=status.HTTP_200_OK)
