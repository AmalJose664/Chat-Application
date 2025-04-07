from datetime import datetime
from mongoengine import  *
from account.models import User_mongo


class Message_mongo(Document):

	s = ReferenceField(User_mongo)
	r = ReferenceField(User_mongo)
	c_id = StringField()
	c = StringField()
	ty = IntField(default=0)
	sa = IntField(default=0)
	t = DateTimeField(default=datetime.now)
	rr = ReferenceField("Message_mongo", default=None)

	meta = {
        'indexes': [
            ('s', 'r'),   
            '-t'  
        ]
    }

class Conversations_mongo(Document):
	c_id = StringField() 
	prtcpnt = ListField(ReferenceField(User_mongo), required=True)
	lst_m = StringField(default=None)
	l_s = IntField(default=0)
	t=DateTimeField(default=datetime.now)

	meta = {
        'indexes': [
            ('prtcpnt',),   
            '-t',           
        ]
    }
