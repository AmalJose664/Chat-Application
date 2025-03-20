from django.urls import path

from . import views

app_name = 'me_chat'


urlpatterns = [
	path("",view=views.slash),
	path('other/',views.other,name='other'),
	path('messages/chat/<str:chat_to_user>/',view=views.Get_Messages.as_view()),
	path('messages/conversations/',view=views.Get_Conversations.as_view())
	
]
