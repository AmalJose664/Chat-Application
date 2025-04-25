from os import name
from django.db.models.signals import post_delete,post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from core.redis import pymongo_connect

from account.models import User_mongo,User_data_mongo

User = get_user_model()
db = pymongo_connect()
@receiver(post_delete, sender=User)
def delete_mongo_user(sender, instance, **kwargs):


	collection = db['user_data_mongo']
	try:
		mongo_user = User_mongo.objects(email=instance.email).first()
		print(mongo_user.id,"<<<<<<<<<<<<<<<<<<<<<<<")
		mongo_user_data = User_data_mongo.objects(user = mongo_user.id).first()
		if mongo_user and mongo_user_data:

			result = collection.update_many({}, {'$pull':{'friends':{'$in':[mongo_user.id] } } })
			mongo_user_data.delete()
			mongo_user.delete()
			print(f"Deleted {instance.email}, {instance.id} from MongoDB Result = {result}")
	except Exception as e:
		print("Server error ",str(e))




@receiver(post_save, sender=User)
def modify_user_mongo(sender, instance, created, **kwargs):
	print("tryiign to save user data......")

	collection = db['user_mongo']
	

	if created:
		print("Creating new MongoDB user document...\n")
		from .views import create_mongo_db_user
		if not create_mongo_db_user(instance):
			instance.delete()
			return
		print("New user inserted into MongoDB")
	elif not created:
		
		print(instance.id)
		print(instance.email)
		print(instance.name)
		result = collection.update_one({'sqlite_id':str(instance.id)},{'$set':{ 
			'email':instance.email,
			'user_name':instance.name,
		 }})
		print(result.modified_count," Rows updated")
