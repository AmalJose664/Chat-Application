import mongoengine
import redis 
import pymongo

from mongoengine import *
from django.conf import settings
import redis.exceptions




def redis_connect(db_no):
	#condition
	redis_service=None
	try:
		if settings.ONLINE_REDIS:
			#mode for online
			redis_service=redis.Redis(host=settings.REDIS_SETTINGS['REDIS_ONLINE_IP'],port=settings.REDIS_SETTINGS['REDIS_ONLINE_PORT'],decode_responses=True,username="default",password= settings.REDIS_SETTINGS['ONLINE_PASS'],)
		else:
			#mode for offline
			redis_service=redis.Redis(host=settings.REDIS_SETTINGS['REDIS_IP'], port=6379, db=db_no, decode_responses=True)
		
		redis_service.flushdb()
		print("\nRedis cleared")
		return redis_service
	
	except redis.exceptions.ConnectionError as e:
		print(str(e) ,"Redis Connect Error!!!!!!!!!!!!!")
		redis_service=None
		raise e
	except Exception as e:
		print(str(e) ,"Redis Connect Error!!!!!!!!!!!!!")
		redis_service=None
		raise e

def pymongo_connect():
	myclient = pymongo.MongoClient(settings.MONGODB_SETTINGS['LINK'])
	mydb = myclient[settings.MONGODB_SETTINGS['db']]
	return mydb




"""
My Free redis server
connect code 
r = redis.Redis(host='redis-13101.c8.us-east-1-3.ec2.redns.redis-cloud.com',port=13101,decode_responses=True,username="default",password="O9dAgc2IuZC2qTvXrqGBzg9R9p2gGKyI",)


connect cli = redis-cli -u redis://default:O9dAgc2IuZC2qTvXrqGBzg9R9p2gGKyI@redis-13101.c8.us-east-1-3.ec2.redns.redis-cloud.com:13101


"""