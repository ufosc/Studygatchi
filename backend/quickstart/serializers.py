from .models import Task
from rest_framework import serializers

# serializers are cool because they allow you to skip having to deal with the model constructors

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Task
        fields = ["reward", "name", "category", "due_date", "description", "user"]