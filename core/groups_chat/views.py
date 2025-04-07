
from groups_chat.models import ChatGroups_mongo
from django.http import JsonResponse
import mongoengine
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from me_chat.templatetags.chatextras import initials, get_random_rgb_in_range


class Get_Groups(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request):
		from .group_consumers import get_temp_redis
		
		pipeline = get_temp_redis()

		try:
			groups = ChatGroups_mongo.objects().order_by('-created_at').as_pymongo()[:30]
			new_array = []
			for group in groups:
				pipeline.smembers(f"group_chat__{group['group_key']}")
			redis_result = pipeline.execute()

			for i, group in enumerate(groups):

				group['_id'] = str(group['_id'])
				group.pop('join_key')
				group['initial'] = initials(group['name'])
				group['color'] = get_random_rgb_in_range(50,160)

				group['count'] = len(redis_result[i]) if redis_result[i] else 0
				group.pop('group_key')

				new_array.append(group)
			
			return JsonResponse({'Data':'Success','groups':new_array},status=status.HTTP_200_OK)
		except Exception as e:
			print('Exception ', str(e))
			return JsonResponse({'Error':'Server Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	
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

			existing_group = ChatGroups_mongo(name=group_name, group_key=group_id, join_key=group_join_key, is_private=lock).save()
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
			if not group.is_private or (group.is_private and group.join_key == join_key):

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