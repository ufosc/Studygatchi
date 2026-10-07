import logging
logger = logging.getLogger(__name__)

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
    # look up user and react accordingly if they don't exist
    try:
        if not request.user.is_active:
            return Response(status=status.HTTP_403_FORBIDDEN)

        tasks: QuerySet[Task] = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except StudyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request: Request, task_id: int) -> Response:

    # authorization check
    if not request.user.is_active:
        logger.warning(f"Unauthorized delete attempt by inactive user: {request.user.username}")
        return Response(
            {"error": "Inactive users cannot delete tasks"}, status=status.HTTP_403_FORBIDDEN
        )

    # prevent unnecessary DB queries for invalid IDs
    if task_id < 1:
        return Response(
            {"error": "Task ID must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST
        )

    # database transaction and error handling
    try:
        task: Task = Task.objects.get(id=task_id, user=request.user)
        task_name = task.name  # Store name before deletion for the log
        task.delete()
        
        # audit logging for destructive actions
        logger.info(f"User '{request.user.username}' successfully deleted task '{task_name}' (ID: {task_id})")
        return Response(status=status.HTTP_204_NO_CONTENT)

    except Task.DoesNotExist:
        logger.warning(f"Failed delete attempt: Task {task_id} not found for user '{request.user.username}'")
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        # catchall to prevent server crashes on unexpected database errors
        logger.error(f"Unexpected server error during task {task_id} deletion: {str(e)}")
        return Response({"error": "An unexpected server error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
