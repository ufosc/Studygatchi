from datetime import datetime
from typing import Any

from django.utils import timezone
from rest_framework import serializers

from .models import StudyUser, Task

# TODO Add docstrings to each of these functions to help newcomers understand what they do


# serializers are cool because they allow you to skip having to deal with the model constructors
class StudyUserSerializer(serializers.HyperlinkedModelSerializer):
    # includes support for password hashing and safety
    class Meta:  # type: ignore
        # TODO Changed from User to StudyUser
        model = StudyUser
        fields = ["id", "username", "email", "password", "money"]
        extra_kwargs = {"password": {"write_only": True, "style": {"input_type": "password"}}}

    def create(self, validated_data: dict[str, Any]) -> StudyUser:
        # hashes passwords
        return StudyUser.objects.create_user(**validated_data)


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:  # type: ignore
        model = Task
        fields: list[str] = ["reward", "name", "category", "due_date", "description", "user"]

    # TODO Is the Any typing actually correct here?
    def validate_due_date(self, value: datetime) -> datetime:
        if value < timezone.now():
            raise serializers.ValidationError("Newly created task cannot be past due")
        return value

    def validate_reward(self, value: int) -> int:
        if value < 0:
            raise serializers.ValidationError("Reward cannot be negative")
        return value
