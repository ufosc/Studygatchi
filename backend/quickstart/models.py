from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class StudyUser(User):
    # inherits: username, password, email, ...
    money = models.IntegerField(default=100)

class Task(models.Model):
    # task_id will be automatically created by Django
    reward = models.IntegerField(default=0)
    name = models.TextField(default="task")
    category = models.TextField(null=True)
    due_date = models.DateTimeField()
    description = models.TextField()
    username = models.ForeignKey(StudyUser, on_delete=models.CASCADE)

class Goober(models.Model):
    # id will be automatically created by Django as PRIMARY KEY
    name = models.CharField(max_length=255)
    health = models.IntegerField(default=100)
    image_url = models.URLField()
    equipped_clothing = models.CharField(max_length=255, null=True, blank=True)
    owner_user = models.ForeignKey(StudyUser, on_delete=models.CASCADE)