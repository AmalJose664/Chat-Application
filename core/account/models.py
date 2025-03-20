
from pydoc import Doc
from django.db import models
from django.forms import IntegerField
from django.utils import timezone
from mongoengine import *
from datetime import datetime
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
import uuid


class CustomUserManager(UserManager):
    def _create_user(self, name, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not provided a valid e-mail address")
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)


        return user
    
    def create_user(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(name, email, password, **extra_fields)
    
    def create_superuser(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(name, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):	
	
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,db_index=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, default='')
    role = models.TextField(default="chat_user")
    


    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    def __str__(self):
        return self.name + "_@_" + self.email



# Create your models here.

class User_mongo(Document):
    
    sqlite_id = StringField(required=True)
    user_name = StringField(required=True)
    email = EmailField(required = True)
    password = StringField(required=True)
    profile_picture = StringField(default="https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png")
    is_online = BooleanField(default=False)
    last_seen = DateTimeField()
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)
    last_login = DateTimeField()
    
    meta = {
        'indexes': [
            'email',       
            'sqlite_id',   
        ]
    }


class User_data_mongo(Document):
    user = ReferenceField(User_mongo, primary_key=True, required=True)
    friends = ListField(ReferenceField(User_mongo))
    request = ListField(ReferenceField(User_mongo))
    notifications = ListField(StringField())
    
    meta = {
        'indexes': [
            ('friends',),
            ('request',)   
        ]
    }
    
    
    
    
