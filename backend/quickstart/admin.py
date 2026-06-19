from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import StudyUser

admin.site.register(StudyUser, UserAdmin)

# Register your models here.
