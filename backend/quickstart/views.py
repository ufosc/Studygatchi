from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import StudyUser # remove, should be serializer
from .serializers import TaskSerializer

# Create your views here.

@api_view(['GET'])
def ping(request):
    print(type(StudyUser))
    return Response("pong")
    
@api_view(['POST']) # Some of this function was made with the help of Gemini
@permission_classes([IsAuthenticated])
def create_task(request):
    serializer = TaskSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        # save and return
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
