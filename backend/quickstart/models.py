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
    description = models.TextField(default="No description given")
    user = models.ForeignKey(StudyUser, on_delete=models.CASCADE)

class CosmeticItem(models.Model):
    name = models.TextField()
    rarity = models.TextField(default="common") # higher weight = more common
    weight = models.IntegerField(default=100)
    asset_key = models.TextField()

    def __str__(self):
        return self.name

class InventoryEntry(models.Model):
    user = models.ForeignKey(StudyUser, on_delete=models.CASCADE)
    item = models.ForeignKey(CosmeticItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1) # how many duplicates exist
    acquired_at = models.DateTimeField(auto_now_add=True) # when won
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'item'], name='unique_user_item')
        ]