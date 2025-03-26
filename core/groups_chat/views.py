
from groups_chat.models import ChatGroups_mongo
from django.http import JsonResponse
import mongoengine
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class Get_Groups(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request):
		try:
			groups = ChatGroups_mongo.objects().as_pymongo()[:30]
			new_array = []
			for group in groups:
				group['_id'] = str(group['_id'])
				group.pop('join_key')
				group.pop('group_key')
				new_array.append(group)
			print(new_array)
			return JsonResponse({'Data':'Success','groups':new_array},status=status.HTTP_200_OK)
		except Exception as e:
			print('Exception ', str(e))
			return JsonResponse({'Error':'Server Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	
class Create_Group(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request, group_name):
		import uuid
		from me_chat.templatetags.chatextras import random_text

		try:
			group_join_key = str(uuid.uuid4())[:8]
			group_id  = f"{group_name.lower()}__{random_text(8)}"

			existing_group = ChatGroups_mongo(name=group_name, group_key=group_id, join_key=group_join_key).save()
			return JsonResponse({'Data':'Success','group_data':{
			'name':group_name,
			'join':group_join_key,
			'group_id':group_id
		}},status=status.HTTP_200_OK)

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
				return JsonResponse({'Data': 'Success', 'group_data': group_data}, status=status.HTTP_200_OK)
			
			else:
				return JsonResponse({'Error': 'Invalid join key'}, status=status.HTTP_403_FORBIDDEN)

		except mongoengine.errors.DoesNotExist as e:
			print("Error No group found ",str(e))
			return JsonResponse({'Error':'error','reason': f'No group Found with id {object_id}' } ,status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			print("Error server error ",str(e))
			return JsonResponse({'Error':'error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)