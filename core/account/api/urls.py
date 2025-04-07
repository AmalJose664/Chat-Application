from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import Userviewset


user_router = DefaultRouter()
user_router.register(r'user',Userviewset)
