from django.urls import path
from .quickstart.views import *

urlpatterns = [
    path("ping/", ping),
    path("create_task/", create_task),
    path('api/users/<str:username>/', get_task),
]
