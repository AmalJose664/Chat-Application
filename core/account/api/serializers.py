from rest_framework.serializers import ModelSerializer
from ..models import User, User_mongo

class user_serializer(ModelSerializer):
	class Meta:
		model = User
		fields = ('email','name','id','password')
	def create(self, validated_data):
		""" Hash password before saving the user """
		user = User(**validated_data)
		user.set_password(validated_data['password'])  # Hash password
		user.save()
		return user
	







class UserSerializer(ModelSerializer):
	class Meta:
		model = User
		fields = ['email','name','id','is_superuser','is_staff']


class SignUpSerializer(ModelSerializer):
	class Meta:
		model = User
		fields = ['email','name','id','password']
		extra_kwargs = {
			'password' : {
				'write_only': True
			}
		}

	def create(self, validated_data):
		
		username = validated_data['name']
		email = validated_data['email']
		password = validated_data['password']
		
		new_user = User.objects.create_user(name=username, email= email,password=password)
		print(new_user.name)
		new_user.save()
		
		return new_user