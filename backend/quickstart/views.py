from datetime import datetime, timezone, timedelta
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


# filters tasks by the requesting user or returns 404/403 when attempting to access another user's task by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_task(request):
    if not request.user.is_active:
        return Response(
            {"detail": "User account is deactivated."}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
        
    task_id = request.query_params.get('id')
    if task_id:
        try:
            task = Task.objects.get(id=task_id, user=request.user)
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response(
                {"detail": "Not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    tasks = Task.objects.filter(user=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


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


# Added to Ensure that task creation accepts ISO-8601 formatted date 
# strings and handles optional default due dates when omitted during testing
def parse_due_date(value):
    if not value:
        # Default to 7 days in future if omitted
        return datetime.now(timezone.utc) + timedelta(days=7)
    if isinstance(value, str):
        clean_value = value.replace('Z', '+00:00')
        return datetime.fromisoformat(clean_value)
    return value


# Added to delete task  
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, pk=None):
    if not request.user.is_active:
        return Response(
            {"detail": "User account is deactivated."}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
        
    try:
        task = Task.objects.get(pk=pk, user=request.user)
    except Task.DoesNotExist:
        return Response(
            {"detail": "Task not found."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
