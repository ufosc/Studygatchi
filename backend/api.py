from django.urls import URLPattern, path

from quickstart import views

urlpatterns: list[URLPattern] = [
    path("ping/", views.ping),
    path("create_task/", views.create_task),
    path("get_task/", views.get_task),
    path("delete_task/<int:task_id>/", views.delete_task),
    path("update_task/<int:pk>/", views.update_task),
    path("get_prohibited_sites/", views.get_prohibited_sites),
    path("remove_prohibited_site/<int:site_id>/", views.remove_prohibited_site),
]
