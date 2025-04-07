from rest_framework.viewsets import ModelViewSet
from ..models import User
from . serializers import user_serializer

class Userviewset(ModelViewSet):
	queryset = User.objects.all()
	serializer_class = user_serializer