from django.urls import path

from backend.quickstart import views

urlpatterns = [
    path("ping/", views.ping),
    path("create_task/", views.create_task),
    path("get_task/", views.get_task),
]
