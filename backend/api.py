from django.urls import URLPattern, path

from quickstart import views

urlpatterns: list[URLPattern] = [
    path("ping/", views.ping),
    path("create_task/", views.create_task),
    path("get_task/", views.get_task),
]
