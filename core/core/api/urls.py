from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from account.api.urls import user_router
from django.urls import path,include
from me_chat.views import test_api_endpoint
router = DefaultRouter()
#user

router.registry.extend(user_router.registry)


urlpatterns = [
	path('',include(router.urls)),
	path('test-api' ,test_api_endpoint)
]


