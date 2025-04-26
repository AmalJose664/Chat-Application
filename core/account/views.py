from django.forms import ValidationError
from django.http import JsonResponse
from django.contrib.auth import authenticate,logout
import mongoengine
from bson import ObjectId

from .models import  User, User_mongo,User_data_mongo
from django.middleware.csrf import get_token
from datetime import datetime
from mongoengine import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .api.serializers import UserSerializer, SignUpSerializer
from rest_framework import status
# Create your views here.

def create_mongo_db_user(new_user):
	try:
		monogo_user = User_mongo(user_name=new_user.name, email=new_user.email,
						  password=new_user.password,
						  sqlite_id=str(new_user.id)
						  )
		monogo_user_data = User_data_mongo(user=monogo_user)
		monogo_user.save()
		monogo_user_data.save()
		return True
	except mongoengine.errors.ValidationError as e:
		print("User create error ,",str(e))
		print("Deelting created user")
		return False
	except Exception as e:
		print("User create error ,",str(e))
		print("Deelting created user")
		return False

def get_auth_for_user(user):
	refresh = RefreshToken.for_user(user)
	db_user=User_mongo.objects.exclude('password').get(sqlite_id=str(user.id))
	db_user = db_user.to_mongo().to_dict()
	db_user['_id'] = str(db_user['_id'])
	
	return  {
		'user': UserSerializer(user).data,
		'db_user':db_user,
		'tokens':{
        	'access': str(refresh.access_token),
    	},
	}

class Signinview(APIView):
	permission_classes = [AllowAny]

	def post(self ,request):
		try:
			print("requestss")
			email = request.data.get('email')  
			password = request.data.get('password')
			
			if not email or not password:
				return Response({'error': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
			
			user = authenticate (email=email, password=password)
			if not user:
				return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED, )
			
			user_data = get_auth_for_user(user)
			res = Response(user_data, status=status.HTTP_200_OK)
			res.set_cookie(
				key="refresh_token",
				value=str(RefreshToken.for_user(user)),
				httponly=True,
				secure=True,
				samesite="Strict",
				max_age=7 * 24 * 60 * 60,
			)
		except Exception as e:
			print("server error ",str(e))
			res = Response({"error",'Internal server error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		return res

class Signupview(APIView):
	permission_classes = [AllowAny]

	def post(self ,request):
		
		#try:
			request.data['name'] = request.data.pop('username')
		
			new_user = SignUpSerializer(data=request.data)
			new_user.is_valid(raise_exception=True)
			user = new_user.save()
			user_data = get_auth_for_user(user)
			
			res = Response(user_data, status=status.HTTP_200_OK)
			res.set_cookie(
				key="refresh_token",
				value=str(RefreshToken.for_user(user)),
				httponly=True,
				secure=True,
				samesite="Strict",
				max_age=7 * 24 * 60 * 60,
			)
			
		# except Exception as e:
		# 	print("server error at signup",str(e))
		# 	res = Response({"error",'Internal server error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			return res





def send_token(request):
	return JsonResponse({'csrf_token':get_token(request)})



def logout_user(request):

	logout(request)
	res = JsonResponse(({ "stauts":200, "message": "Logged out successfully" }))
	res.delete_cookie("refresh_token")
	return res






class Check_Auth(APIView):
	def get(self ,request):
		print(">>>",request.user,"<<<")
		if not request.user.is_authenticated:
			return Response({'error': 'Not Logged in'}, status=status.HTTP_401_UNAUTHORIZED)
		return JsonResponse(self.get_data(request.user))
			
	def get_data(self, user):
		db_user=User_mongo.objects.exclude('password').get(sqlite_id=str(user.id))
		db_user = db_user.to_mongo().to_dict()
		db_user['_id'] = str(db_user['_id'])
		 
		user = {
			'name':user.name,
			'email':user.email,
			'id':user.id
		}
		return  {
		'user':user,
		'db_user':db_user,
		
		}
	

class Add_Friend_Request(APIView):
	from mongoengine.errors import DoesNotExist, ValidationError
	permission_classes = [IsAuthenticated]
	def get(self, request,id):
		try:
			request_to_user = User_mongo.objects(id=id).first()
			request_user = User_mongo.objects(sqlite_id = str(request.user.id)).first()

			if request_to_user and request_user:
				is_friend = User_data_mongo.objects(user=request_user, friends__in=[request_to_user.id]).first()
				if is_friend:
					print("Already firends")
					return JsonResponse({"update": "Already Friends"}, status=status.HTTP_204_NO_CONTENT)

				if request_to_user.id == request_user.id:
					print('same')
					return JsonResponse({"error": "same"}, status=status.HTTP_400_BAD_REQUEST)
				
				print(f"Friend request from {request_user.user_name} to {request_to_user.user_name}")
				print(request_to_user.user_name)
				user_from_db = User_data_mongo.objects(user = request_to_user).first()

				if user_from_db:
					result = user_from_db.update(add_to_set__request=request_user, push__notifications=f"FRIEND_REQUEST__{request_user.user_name}")
					print('Data Inserted',result)
					return JsonResponse({"update":result},status=status.HTTP_200_OK)
				
				print("no user found ,Creating new.....")
				User_data_mongo(user=request_to_user, request=[request_user], notifications=[f"FRIEND_REQUEST__{request_user.user_name}"]).save()
				return JsonResponse({"update": 1}, status=status.HTTP_201_CREATED)
			
		except ValidationError as e:
			print("error Validation error===>>",str(e))
			return Response({'error': 'Invalid user ID format'}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			print("Error Type:", type(e).__name__)
			print(str(e))
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		print('received data')
		
		return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND,)




class Random_users(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request,):
		users = User_mongo.objects().aggregate([{ "$match": { "sqlite_id": { "$ne": str(request.user.id) } } },{ "$sample": { "size": 10 } }])
		
		print(users)
		if users:
			new_list = []
			for u in users:

				u.pop('password')
				u.pop('created_at')
				u.pop('email')
				u.pop('sqlite_id')
				u['_id'] = str(u['_id'])
				new_list.append(u)
			return JsonResponse({"users":new_list,})
		return JsonResponse({'users':'', })

 

class List_Given_Users(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request,new_friend,):
		
		import re
		re_new_friend = re.compile(f'.*{re.escape(new_friend)}.*', re.IGNORECASE) 
		users = User_mongo.objects(Q(sqlite_id=new_friend) | Q(email=new_friend) | Q(user_name=re_new_friend) & 
    								Q(sqlite_id__ne=str(request.user.id))).only('id','user_name','profile_picture').as_pymongo()[:20]
		
		if users:
			new_list = []
			for u in users:
				u['_id'] = str(u['_id'])
				new_list.append(u)
			return JsonResponse({"users":new_list,'keyword':new_friend})
		return JsonResponse({'users':'','keyword':new_friend})





class My_Request(APIView):
	from mongoengine.errors import  ValidationError
	permission_classes = [IsAuthenticated]
	def get(self, request):
		print("=======================================")
		try:
			user = User_mongo.objects.get(sqlite_id = str(request.user.id))
			user_requests = User_data_mongo.objects.get(user=user)
			user_request_modified = User_mongo.objects(id__in=[u.id for u in user_requests.request]).only('id', 'user_name', 'profile_picture').as_pymongo()
			new_array = []
			if user_requests:
				
				for r in user_request_modified:
					r['_id'] = str(r['_id'])
					new_array.append(r)

				return JsonResponse({"users":new_array},status=status.HTTP_200_OK)
			
		except mongoengine.errors.DoesNotExist as e:
			print("Error Reason ===>>",str(e))
			return Response({"error": "User or user requests not found"}, status=status.HTTP_404_NOT_FOUND)
		except ValidationError as e:
			print("Validation error===>>",str(e))
			return Response({"error": "Invalid user ID format"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			print("Error Type:", type(e).__name__)
			print("error ",str(e))
			return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		


class Send_Response(APIView):
	
	from mongoengine.errors import  ValidationError
	permission_classes = [IsAuthenticated]
	def get(self, request,id,action):
		
		print(id,"      ",action)
		try:
			user = User_mongo.objects.get(sqlite_id = str(request.user.id)) # request user model
			user_data = User_data_mongo.objects(user=user).only('request','notifications','friends').first()# request user data model
			print('we are ',user.user_name)

			other_user_id = ObjectId(id) if ObjectId.is_valid(id) else id #id to be confirmed or rejected
			other_user = User_mongo.objects.get(id=other_user_id) #user of that id
			
			other_user_data = User_data_mongo.objects(user = other_user).only('request','notifications','friends').first() or None
			
			if not other_user_data:
				print("User data not found\n New user creating....")
				other_user_data = User_data_mongo(user=other_user).save()
			print("He is ", other_user.user_name)

			if not any(u.id == other_user_id for u in user_data.request):
				print('user Not found ')
				return JsonResponse({"error":f"{action} user for found in requests"},status=status.HTTP_404_NOT_FOUND)
			
			if action == "CONFIRM":
				print(user_data,",,", other_user_data)
				result=user_data.update(
					pull__request=other_user_id,
					add_to_set__friends = other_user_id,
					push__notifications=f"FRIEND_ACCEPTED__{other_user.user_name}"
				)
				print("Result===>",result)
				result=other_user_data.update(
					add_to_set__friends=user.id,
					push__notifications=f"FRIEND_ACCEPTED__{user.user_name}"
				)
				print("Result===>",result)
				return JsonResponse({"update": "Friend request accepted"},status=status.HTTP_200_OK)
			elif action == 'DECLINE':
				user_data.update(
					pull__request = other_user_id,
					push__notifications=f"FRIEND_DECLINED__{other_user.user_name}"
				)
				return JsonResponse({"update": "Friend request Rejected"},status=status.HTTP_200_OK)
			
			else :
				return Response({"error": "Invalid user ID format"}, status=status.HTTP_400_BAD_REQUEST)
		except mongoengine.errors.DoesNotExist as e:
			print('some errors===>>',str(e))
			return JsonResponse({"error": "Some user not found"}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			print("Error Type:", type(e).__name__)
			print("error____" , str(e))
			return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		
		return JsonResponse({"users":action},status=status.HTTP_404_NOT_FOUND)




class Get_My_Friends(APIView):

	permission_classes = [IsAuthenticated]
	def get(self,request, id, action, *args, **kwargs):
		from mongoengine.errors import  ValidationError,DoesNotExist

		try:

			user_model = User_mongo.objects.get(sqlite_id=  str(request.user.id))
			user_data_model = User_data_mongo.objects(user=user_model).first()

			if ObjectId.is_valid(id) and action == 'REMOVE':
				return self.remove_friend(id, user_data_model, my_id=user_model.id)
			cursor = request.GET.get('cursor','')
			limit=20
			user_friends = User_mongo.objects(id__in=[u.id for u in user_data_model.friends]).only('id','sqlite_id', 'user_name', 'profile_picture').order_by('-id').limit(limit).as_pymongo()
			#print(user_friends)
			is_last = limit > len(user_friends)
			if ObjectId.is_valid(cursor):
					user_friends = user_friends.filter(id__lt=ObjectId(cursor))

			
			new_array =[]
			next_cursor=""
			
			for f in user_friends:
				
				f['_id'] = str(f['_id'])
				new_array.append(f)
				next_cursor = str(f['_id']) 

			
			return JsonResponse({"users": new_array,'next_cursor':next_cursor, 'is_last':is_last}, status=status.HTTP_200_OK)


		except DoesNotExist as e:
			print("Does not exists error===>>",str(e))
			return JsonResponse({"error": "Some user not found"}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			print("Error Type:", type(e).__name__)
			print("error____" , str(e))
			return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		return JsonResponse({"users":str(request.user.id)},status=status.HTTP_200_OK)
	
	def remove_friend(self,other_user_id, my_model, my_id):
		other_user_id = ObjectId(other_user_id) if ObjectId.is_valid(other_user_id) else other_user_id

		print(other_user_id, " ", other_user_id)

		other_user = User_mongo.objects.get(id=other_user_id)
		other_user_data = User_data_mongo.objects.get(user=other_user)
		result = my_model.update(pull__friends=other_user_id, push__notifications=f"FRIEND_REMOVED__{other_user.user_name}")
		result1 = other_user_data.update(pull__friends=my_id )
		return JsonResponse({"update":f"{result}_{result1}"}, status=status.HTTP_200_OK)





class Get_Statics(APIView):
	permission_classes = [IsAuthenticated]
	def get(self,request):
		from pymongo.errors import PyMongoError
		from .mongo_queries import get_query_for_user_data, get_query_for_message_data
		from core.redis import pymongo_connect

		try:
			collection = pymongo_connect()['message_mongo']
			user_data_collection = pymongo_connect()['user_data_mongo']
			user = User_mongo.objects(sqlite_id= str(request.user.id)).first()

			pipeline = get_query_for_message_data(user=user)
			data = list(collection.aggregate(pipeline=pipeline))
			data = data[0] if data else {}

			pipeline_user_data = get_query_for_user_data(user=user)
			user_data = list(user_data_collection.aggregate(pipeline=pipeline_user_data))
			user_data = user_data[0] if user_data else {}


			return JsonResponse({'user':str(user.id), 'message_data':data, 'friend_data':user_data },status=status.HTTP_200_OK)
		except PyMongoError as e:
			print("Errro on getting user data===>",str(e))
			return JsonResponse({'error':'Pymongo_error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		except Exception as e:
			print("Errro on getting user data===>",str(e))
			return JsonResponse({'error':'Server_error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		return JsonResponse({'error':'No_data_error'},status=status.HTTP_400_BAD_REQUEST)





class Show_notifications(APIView):
	permission_classes=[IsAuthenticated]
	def get(self,request, *args, **kwargs):
		try:
			value = request.GET.get('value',"")
			user = User_mongo.objects(sqlite_id= str(request.user.id)).first()
			data = User_data_mongo.objects(user=user).only('notifications','request').first() or None
			if value == "CLEAR":
				data.notifications = []
				data.save()
				return JsonResponse({'Data':[]}, status=status.HTTP_200_OK)
			print(data)
			data = data.to_mongo().to_dict()
			return JsonResponse({
				'Data':data['notifications'],
				
				},status=status.HTTP_200_OK)
		except Exception as e:
			print("Errro on getting user data===>",str(e))
			return JsonResponse({'error':'Server_error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class Update_Profile(APIView):
	permission_classes=[IsAuthenticated]
	def post(self,request):
		from  .forms import UploadFileForm 
		from core.cloudinary import cloudinary
		from cloudinary.exceptions import GeneralError

		user_mongo = User_mongo.objects(sqlite_id = str(request.user.id)).first()
		user_sqlite = User.objects.get(id=request.user.id)
		email = request.data.get('email','')
		username = request.data.get('username','')
		password = request.data.get('password','')

		print(request.data, password)
		if not user_sqlite.check_password(password):
			return JsonResponse({
				'error':"User not Found",},status=status.HTTP_404_NOT_FOUND)


		if (not username) or (not email) or( not password):
			print("No data provided!!!")
			return JsonResponse({
				'error':"Data  not provided",},status=status.HTTP_400_BAD_REQUEST)

		global_save=0

		if request.data.get('file',False):

			form = UploadFileForm(request.POST, request.FILES)
			if not form.is_valid():
				print("No Image or Image Validation error")
				return JsonResponse({
					'error0':"image validation error",
					'error1':form.errors.get_json_data(),
					'error2':form.errors.as_text()
					},status=status.HTTP_400_BAD_REQUEST)
			
			
			url =""
			try:
				image = form.files['file']
				old_image = user_mongo.profile_picture
				old_image_id = old_image.split('/')[len(old_image.split('/'))-1].split('.')[0]

				result = cloudinary.uploader.destroy(old_image_id)
				print("Old Image delete result", result)

				upload_result = cloudinary.uploader.upload_image(image, quality="auto", format="webp",)

				url = upload_result.url
				user_mongo.profile_picture = url
				global_save=1
				user_mongo.save()
				
			except GeneralError as e:
				print("Cloudinary error", str(e))
				return JsonResponse({'error':'Error on image upload'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			except Exception as e:
				print("Server error", str(e))
				return JsonResponse({'error':'Internal server error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			
		

		print(username,"     ", email)
		save =0
		try:
			if user_sqlite.email != email:
				save =1
				user_sqlite.email = email
				user_mongo.email = email

			if user_sqlite.name != username:
				save = save + 1
				user_sqlite.name = username
				user_mongo.user_name = username
			
			if save !=0:
				user_mongo.save()
				user_sqlite.save()

			if save or global_save:
				user = UserSerializer(user_sqlite).data
				db_user = user_mongo.to_mongo().to_dict()
				db_user['_id'] = str(db_user['_id'])
				db_user.pop("password")
				return JsonResponse({'update':global_save+save, 
						 'profile_update':global_save, 
						 'updated_user':  {
					'user':user,
					'db_user':db_user
				}},status=status.HTTP_201_CREATED)
			

		except ValidationError as e:
			print(f" Error Validation Errror ==>>{str(e)}")
			return JsonResponse({
				'error':"Data  not provided",},status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			print(f" Error  server ==>>{str(e)}")
			return JsonResponse({
				'error':"Internal server error",},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		
		
		return JsonResponse({'Data':'Success', 'update':save},status=status.HTTP_200_OK)




class Get_User_Details(APIView):
	permission_classes=[IsAuthenticated]
	def get(self, request, user_id):
		if not user_id:
			return JsonResponse({
				'error':"Data  not provided",},status=status.HTTP_400_BAD_REQUEST)
		
		try:
			user = User_mongo.objects(id=user_id).as_pymongo().first()
		
			if user:	
				user['_id'] = str(user['_id'])
				user.pop("password")
				return JsonResponse({'Data':'Success', 'user':user},status=status.HTTP_200_OK)
		except ValidationError as e:
			print(f" Error Validation Errror ==>>{str(e)}")
			return JsonResponse({
				'error':"Data  not provided",},status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			print(f" Error  server ==>>{str(e)}")
			return JsonResponse({
				'error':"Internal server error",},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		return JsonResponse({'Error':'Not found'},status=status.HTTP_404_NOT_FOUND)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interesting(request):

	print (request.user)
	print (request.COOKIES)
	return JsonResponse({"user":"Hai"})