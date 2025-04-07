from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from core.redis import pymongo_connect

from account.models import User_mongo,User_data_mongo

User = get_user_model()
@receiver(post_delete, sender=User)
def delete_mongo_user(sender, instance, **kwargs):

	db = pymongo_connect()
	collection = db['user_data_mongo']
	mongo_user = User_mongo.objects(email=instance.email).first()
	print(mongo_user.id,"<<<<<<<<<<<<<<<<<<<<<<<")
	mongo_user_data = User_data_mongo.objects(user = mongo_user.id).first()
	if mongo_user and mongo_user_data:

		result = collection.update_many({}, {'$pull':{'friends':{'$in':[mongo_user.id] } } })
		mongo_user_data.delete()
		mongo_user.delete()
		print(f"Deleted {instance.email}, {instance.id} from MongoDB Result = {result}")


