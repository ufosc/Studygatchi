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
    # need to check if user is active, if not return 403
    if not request.user.is_active:
        return Response({"error": "Inactive users cannot get tasks"}, status=status.HTTP_403_FORBIDDEN)

    # try to find the task and return it, if it doesn't exist return 404
    try:
        task_id = request.query_params.get("id")

        if task_id is None:
            tasks: QuerySet[Task] = Task.objects.filter(user=request.user)
            serializer = TaskSerializer(tasks, many=True)
        else:
            task: Task = Task.objects.get(id=task_id, user=request.user)
            serializer = TaskSerializer(task)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request: Request, task_id: int) -> Response:

    # Need to check if user is active, if not return 403
    if not request.user.is_active:
        return Response(
            {"error": "Inactive users cannot delete tasks"}, status=status.HTTP_403_FORBIDDEN
        )
    # Try to find the task and delete it, if it doesn't exist return 404
    try:
        task: Task = Task.objects.get(id=task_id, user=request.user)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_task(request: Request, pk: int) -> Response:
    # look up user, 403 if inactive
    if not request.user.is_active:
        return Response(status=status.HTTP_403_FORBIDDEN)

    # get task to edit on valid user or 404 on not found
    try:
        task = Task.objects.get(pk=pk, user=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=request.data, partial=True, context={"request": request})

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
