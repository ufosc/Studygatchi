from django.db.models import QuerySet
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import StudyUser, Task  # TODO remove, should be serializer
from .serializers import TaskSerializer


@api_view(["GET"])
def ping(_request: Request) -> Response:
    print(type(StudyUser))
    return Response("pong")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request: Request) -> Response:
    serializer = TaskSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        # save and return
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_task(request: Request) -> Response:
    username = request.query_params.get("username")
    if not username:
        return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)

    # look up user and react accordingly if they don't exist
    try:
        user: StudyUser = StudyUser.objects.get(username=username)
        tasks: QuerySet[Task] = Task.objects.filter(user=user)

        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except StudyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
