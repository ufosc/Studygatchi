"""
URL configuration for studygatchi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import URLResolver, include, path
from quickstart import views

urlpatterns: list[URLResolver] = [
    path("api/", include("api")),
    path("admin/", admin.site.urls),
    
    # API endpoints prefixed with api/ to match test routes
    path('api/get_task/', views.get_task, name='get_task'),
    path('api/delete_task/<int:pk>/', views.delete_task, name='delete_task'),
]
