from datetime import datetime
from typing import Any
from urllib.parse import urlsplit

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import URLValidator
from django.utils import timezone
from rest_framework import serializers

from .models import ProhibitedSite, StudyUser, Task

# TODO Add docstrings to each of these functions to help newcomers understand what they do


# serializers are cool because they allow you to skip having to deal with the model constructors
User = get_user_model()


class StudyUserSerializer(serializers.HyperlinkedModelSerializer):
    # includes support for password hashing and safety
    class Meta:  # type: ignore
        # TODO Changed from User to StudyUser
        model = User
        fields = ["id", "username", "email", "password", "money"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {
                    "input_type": "password",
                },
            }
        }

    def create(self, validated_data: dict[str, Any]) -> StudyUser:
        # hashes passwords
        return StudyUser.objects.create_user(**validated_data)


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:  # type: ignore
        model = Task
        fields: list[str] = ["reward", "name", "category", "due_date", "description", "user"]

    def validate_due_date(self, value: datetime) -> datetime:
        if value < timezone.now():
            raise serializers.ValidationError("Newly created task cannot be past due")
        return value

    def validate_reward(self, value: int) -> int:
        if value < 0:
            raise serializers.ValidationError("Reward cannot be negative")

        # Reward moderation will go here, for now we can have basic moderation and set a limit (like $100)
        if value > 100:
            raise serializers.ValidationError("Reward exceeds permitted amount")

        return value


class ProhibitedSiteSerializer(serializers.ModelSerializer):
    url = serializers.CharField(allow_blank=True, max_length=2048)

    class Meta:
        model = ProhibitedSite
        fields = ["id", "url"]
        read_only_fields = ["id"]

    def validate_url(self, value: str) -> str:
        raw_url = value.strip()
        if not raw_url:
            raise serializers.ValidationError("Website URL cannot be empty.")
        if any(character.isspace() for character in raw_url):
            raise serializers.ValidationError("Enter a valid website URL.")

        if "://" in raw_url:
            candidate = raw_url
        else:
            candidate = f"https://{raw_url}"

        try:
            parsed = urlsplit(candidate)
            URLValidator(schemes=["http", "https"])(candidate)
            hostname = parsed.hostname
            port = parsed.port
            if not hostname or parsed.username or parsed.password:
                raise ValueError
            normalized_hostname = hostname.rstrip(".").encode("idna").decode("ascii").lower()
        except (DjangoValidationError, UnicodeError, ValueError):
            raise serializers.ValidationError("Enter a valid HTTP or HTTPS website URL.") from None

        if not normalized_hostname:
            raise serializers.ValidationError("Enter a valid HTTP or HTTPS website URL.")

        # A prohibited site represents a host, not a particular page on that site.
        normalized_url = f"[{normalized_hostname}]" if ":" in normalized_hostname else normalized_hostname
        default_port = 80 if parsed.scheme == "http" else 443
        if port and port != default_port:
            normalized_url = f"{normalized_url}:{port}"
        return normalized_url
