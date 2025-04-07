from django.urls import path

from .views import  logout_user,interesting, send_token, Signinview, Signupview, Check_Auth, Add_Friend_Request, List_Given_Users, Random_users, My_Request, Send_Response, Get_My_Friends
from .views import Get_Statics, Update_Profile,Show_notifications, Get_User_Details
urlpatterns = [
	path('auth/logout/',view=logout_user ,name="logout"),
	path('csrf_token/',view=send_token),
	path('auth/new-signin/',view=Signinview.as_view()),
	path('auth/new-signup/',view=Signupview.as_view()),
	path('auth/check-auth/',view=Check_Auth.as_view()),

	path('auth/data/',view=Get_Statics.as_view()),
	path('auth/update/',view=Update_Profile.as_view()),

	path('friends/add-friend/<str:new_friend>/',view=List_Given_Users.as_view()),
	path('friends/random-users/',view=Random_users.as_view()),
	path('friends/add-requests/<str:id>',view=Add_Friend_Request.as_view()),

	path('friends/my-requests/',view=My_Request.as_view()),
	path('friends/notifications/',view=Show_notifications.as_view()),

	path('friends/handle-requests/<str:id>/<str:action>',view=Send_Response.as_view()),
	path('friends/my-friends/<str:id>/<str:action>',view=Get_My_Friends.as_view()),

	path('friends/get-user/<str:user_id>',view=Get_User_Details.as_view()),

	

	
	path('int/',view=interesting),
]

''''
how to get a bool value form url get like this str path('add-friend/<str:new_friend>/<bol:demo>',view=Show_users.as_view()),
'''