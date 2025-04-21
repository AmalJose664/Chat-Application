from datetime import datetime
from mongoengine import  *

class ChatGroups_mongo(Document):
	name = StringField(required=True, unique=True)
	group_key = StringField(required=True)
	a_data = StringField()
	join_key = StringField( default="0000-0000", required=True)
	created_at = DateTimeField(default=datetime.now)
	created_by = StringField(default='Some User')
	is_private = BooleanField(default=False)
	
# Create your models here.
