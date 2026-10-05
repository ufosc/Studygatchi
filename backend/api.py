from django.urls import path
from .quickstart.views import *

urlpatterns: list[URLPattern] = [
    path("ping/", views.ping),
    path("create_task/", views.create_task),
    path("get_task/", views.get_task),
    path("delete_task/<int:task_id>/", views.delete_task),
    path("update_task/<int:pk>/", views.update_task),
    path("spin/", views.spin),
]
