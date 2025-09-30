from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Users

# Create your views here.

@api_view(['GET',])
def ping(request):
    if request.method == 'GET':
        print(type(User))
        return Response(b"pong")