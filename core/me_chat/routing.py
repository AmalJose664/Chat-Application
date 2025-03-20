from django.urls import path 
from . import chat_consumers


websockets_urlpatterns = {
	path('ts/<str:room_name>/' ,chat_consumers.ChatConsumer.as_asgi()),
}