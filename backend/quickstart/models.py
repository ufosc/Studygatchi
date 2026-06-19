from django.contrib.auth.models import AbstractUser
from django.db import models


class StudyUser(AbstractUser):
    # inherits: username, password, email, ...
    money = models.IntegerField(default=100)


class Pet(models.Model):
    # ID automatically created by Django
    type = models.TextField(default="pet")
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    happiness = models.DecimalField(default=0.5, decimal_places=2, max_digits=3)
    equipped_clothes = models.IntegerField(null=True)
    image_url = models.URLField(null=True)  # Change in the future
    owner = models.ForeignKey(StudyUser, on_delete=models.CASCADE)


class Task(models.Model):
    # task_id will be automatically created by Django
    reward = models.IntegerField(default=0)
    name = models.TextField()
    category = models.TextField(null=True)
    due_date = models.DateTimeField()
    description = models.TextField(default="No description given")
    user = models.ForeignKey(StudyUser, on_delete=models.CASCADE)
