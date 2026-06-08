from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import StudyUser # remove, should be serializer
from .serializers import TaskSerializer, StudyUserSerializer

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_task(request):
    username = request.query_params.get("username")
    if not username:
        return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    # look up user and react accordingly if they don't exist
    try:
        user = StudyUser.objects.get(username=username)
        serializer = StudyUserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except StudyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)