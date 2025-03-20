from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from  account.models import User, User_data_mongo, User_mongo
from . models import Conversations_mongo, Message_mongo

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status

from core.redis import pymongo_connect
from datetime import datetime, timedelta
from mongoengine import Q

from mongoengine.errors import ValidationError, DoesNotExist
from bson import ObjectId, is_valid
db = pymongo_connect()

def slash(request):
	heo = {
        "user":"welocme",
		
		}
	return JsonResponse(heo)


class Get_Messages(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request, chat_to_user, *args, **kwargs):
		from pymongo.errors import PyMongoError
		
		print("chat to user ",chat_to_user)
		limit =80
		cursor = request.GET.get('cursor',"")

		try:
			limit = request.GET.get('limit',80) if int(request.GET.get('limit',80))<=120 else 90
			limit = int(limit)
		except Exception as e:
			print("Error in parameters",str(e))

		
		try:
			collection = db['message_mongo']
			chat_to_user = User_mongo.objects(sqlite_id=chat_to_user).only('id').first()
			user = User_mongo.objects(sqlite_id = str(request.user.id) ).only('id').first()
			
			result=0

			if chat_to_user and user:
				filter1 = str(chat_to_user.id)+"__"+str(user.id)
				filter2 = str(user.id)+"__"+ str(chat_to_user.id)
				try:
					result = self.update_reads(user=user.id, chat_to_user=chat_to_user.id, f1=filter1, f2=filter2)
				except PyMongoError as e:
					print("Error on read update", str(e))
					result = None

				
				messages = Message_mongo.objects( ( ( Q(s=user.id) & Q(r=chat_to_user.id)) | ( Q(s=chat_to_user.id) & Q(r=user.id)) ) | ( Q(c_id = filter2) | Q(c_id = filter1) )  ).order_by('-t')
				
				if ObjectId.is_valid(cursor):
					messages = messages.filter(id__lt=ObjectId(cursor))
				messages = messages.limit(limit)

				new_messages = []
				next_cursor=""
				for m in messages:
					m=m.to_mongo().to_dict()
					
					m['_id'] = str(m['_id'])
					try:
						m['s'] = str(m['s'])
						m['r'] = str(m['r'])
					except Exception as e:
						print("Key error ",str(e),e)
					next_cursor = str(m['_id']) 
					new_messages.append(m)

				collection =  collection.update_many({'t': {"$lt": datetime.now() - timedelta(days=6)}},{'$unset': {'r': '', 's': '', 'sa': ''}})
				new_messages.reverse()
				if not result:
					result=collection
				
				return JsonResponse({'messages':new_messages,"next_cursor":next_cursor,
							'value_updates':{
								'modified_count': collection.modified_count,
								'matched_count ':collection.matched_count,
								'upserted_id ':collection.upserted_id,
								'acknowledged': collection.acknowledged,
							},
							'read_updates':{
								'modified_count': result.modified_count,
								'matched_count ':result.matched_count,
								'upserted_id ':result.upserted_id,
								'acknowledged': result.acknowledged,
							},
							'values_provided':{'limit':limit, 'cursor':cursor}
							},status=status.HTTP_200_OK)
		except ValidationError as e:
			print("error on validation==>",str(e))
			return JsonResponse({'error':'Invalid user id format'}, status=status.HTTP_400_BAD_REQUEST)
		except DoesNotExist as e:
			print("Error Data not found==>>",str(e))
			return JsonResponse({'error':'Invalid user id format'}, status=status.HTTP_404_NOT_FOUND)
		# except Exception as e:
		# 	print("Error Reason ==> ",str(e))
		# 	return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		print("Error not user found >",chat_to_user)
		return JsonResponse({'error':'No user found'},status=status.HTTP_404_NOT_FOUND)
	

	def update_reads(self, user, chat_to_user, f1,f2):
		
		conv_collection = db['conversations_mongo']
		collection = db['message_mongo']
		
		result=collection.update_many({'$and':[  {'r':user, 's':chat_to_user}, {"sa": {"$in": [1, 0]}} ]}, { '$set': { "sa" : 2 }} )

		if result.modified_count <=1:
			user_conv = conv_collection.find_one({'$or':[{'c_id':f2},{'c_id':f1}]},{'lst_m':1,'l_s':1})
			lst_m = user_conv['lst_m']
			temp = lst_m.split('__')
			temp = temp[len(temp)-1]
			temp = temp.replace('_',"")

			if str(user) != temp and user_conv['l_s'] !=2 :
				#conv_collection.update_one({'_id':user_conv['_id']},{"$set": {"l_s": 2}})
				conv_collection.update_many({"$and": [{"$or": [   {"c_id": f2},   {"c_id": f1}    ]}   ,   {"l_s": {"$in": [0, 1]}} ]   },    {"$set": {"l_s": 2}})
		print(result.modified_count ,"  ", result.matched_count)

		return result


		
	


class Get_Conversations(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request, *args, **kwargs):

		from .mongo_queries import get_query_for_conv
		from pymongo.errors import PyMongoError
		collection = db['conversations_mongo']

		user = User_mongo.objects(sqlite_id = str(request.user.id) ).first()
		my_id = user.sqlite_id
		limit = 24
		try:
			limit = int(request.GET.get('limit',20)) 
		except Exception as e:
			print('error in paramters ', str(e))
			limit =24
		if limit>24:
			limit=24
		
		cursor = request.GET.get('cursor',"")
		try:
			
			pipeline = get_query_for_conv(user=user, limit=limit)

			if ObjectId.is_valid(cursor):
				print("Cursor inserted")
				pipeline.insert(1, {
					"$match": {
						"_id": {"$lt": cursor}
						}
					},
					)

			data = collection.aggregate(pipeline=pipeline)
			result = list(data)

			new_array=[]
			for r in result:
				
				r['_id'] = str(r['_id'])
				for p in r['prtcpnt']:
					
					p['_id'] = str(p['_id'])
				other_user = [  p for p in r['prtcpnt'] if p['sqlite_id'] != my_id]
				r['other_user'] = other_user[0] or None
				new_array.append(r)
			data = User_data_mongo.objects(user=user).only('request').as_pymongo().first() or None
			return  JsonResponse({'conversations':new_array,
						 'unseen_noti':len(data['request']),
						 },status=status.HTTP_200_OK)
		
		except KeyError as e:
			print('Error Key Error===>',str(e))
			return  JsonResponse({'error':'Data retrieval error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		except PyMongoError as e:
			print('Error pymongo Error===>',str(e))
			return  JsonResponse({'error':'pymongo error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		except Exception as e:
			print(' Error===>',str(e))
			return  JsonResponse({'error':'Server error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		



		

	



@login_required
def other(request):
	
    
	user = User.objects.all().exclude(email=request.user.email)

	#return JsonResponse({"users":"helo"})
	return render(request, 'chat/another.html',{"data": user})


	

# Create your views here.
