from django.urls import path

from . import views

urlpatterns = [
	path("groups/", view=views.Get_Groups.as_view()),
	path("groups/<str:group_name>", view=views.Find_group.as_view()),
	path("groups/create/<str:group_name>/<int:lock>/", view=views.Create_Group.as_view()),
	path("groups/join/<str:object_id>/<str:join_key>", view=views.Join_Group.as_view()),
	path("groups/users/<str:group_key>", view=views.Show_Group_users.as_view()),
]