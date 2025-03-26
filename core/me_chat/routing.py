from django.urls import path 
from . import chat_consumers
from groups_chat import group_consumers


websockets_urlpatterns = {
	path('ts/<str:room_name>/' ,chat_consumers.ChatConsumer.as_asgi()),
}

websockets_urlpatterns.update({
    path('group-chat/<str:group_id>/<str:join_key>/', group_consumers.GrConsumer.as_asgi()): None,
})