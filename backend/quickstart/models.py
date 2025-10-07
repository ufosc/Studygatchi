from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class StudyUser(User):
    # inherits: username, password, email, ...
    money = models.IntegerField(default=100)
