from .models import Task
from rest_framework import serializers
from django.contrib.auth import get_user_model

# serializers are cool because they allow you to skip having to deal with the model constructors
User = get_user_model()
class StudyUserSerializer(serializers.HyperlinkedModelSerializer):
    
    # includes support for password hashing and safety
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "money"]
        extra_kwargs = {
            "password": { "write_only": True, "style": { "input_type": "password"}}
        }
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data) # hashes passwords

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Task
        fields = ["reward", "name", "category", "due_date", "description", "user"]