# Some tests created with aid from Gemini
import pytest
from rest_framework import status
from django.urls import reverse
from .models import StudyUser, Task

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def test_user(db):
    """Creates a StudyUser for testing"""
    return StudyUser.objects.create_user(
        username="andres", 
        password="password123",
        money=500
    )

@pytest.fixture
def other_user(db):
    """Creates another StudyUser for isolation testing"""
    return StudyUser.objects.create_user(
        username="anthony",
        password="password456",
        money=50
    )

@pytest.fixture
def test_task(db, test_user):
    """Creates a Task for testing"""
    return Task.objects.create(
        name="Test",
        reward=50,
        description="Make sure this works",
        due_date="2026-12-31",
        user=test_user
    )

@pytest.mark.required
@pytest.mark.tasks
class TestTaskCreation:
    def test_create_task_authenticated(self, api_client, test_user):
        # 1. Authenticate
        api_client.force_authenticate(user=test_user)
        
        # 2. Prepare Data (No user info in JSON, handled by CurrentUserDefault)
        url = "/api/create_task/" # Ensure this matches your urls.py
        data = {
            "name": "Math Homework",
            "reward": 50,
            "description": "Finish algebra 1",
            "due_date": "2029-12-31"
        }
        
        # 3. Request
        response = api_client.post(url, data, format='json')
        
        # 4. Assertions
        assert response.status_code == status.HTTP_201_CREATED
        
        # Verify DB entry
        task = Task.objects.get(name="Math Homework")
        assert task.user == test_user


    def test_create_task_unauthenticated(self, api_client):
        """Ensure logged-out users can't create tasks."""
        url = "/api/create_task/"
        data = {
            "name": "Ghost Task", 
            "due_date": "2029-12-31"
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


    def test_create_task_missing_due_date(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        data = {
            "name": "No Date Task", 
            "reward": 50, 
            "description": "test"
        }
        
        response = api_client.post("/api/create_task/", data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


    def test_create_task_invalid_due_date(self, api_client, test_user):
        """Malformed date should be rejected."""
        api_client.force_authenticate(user=test_user)
        data = {
            "name": "Bad Date Task", 
            "reward": 50, 
            "due_date": "not-a-date"
        }
        
        response = api_client.post("/api/create_task/", data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


    def test_create_task_negative_reward(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        data = {
            "name": "Negative Task", 
            "reward": -100,
            "due_date": "2029-12-31"
        }
        
        response = api_client.post("/api/create_task/", data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_task_positive_reward(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        data = {
            "name": "Positive Task", 
            "reward": 100,
            "due_date": "2029-12-31"
        }
        
        response = api_client.post("/api/create_task/", data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED


    def test_create_task_due_date_in_past(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        data = {
            "name": "Late Task", 
            "reward": 10, 
            "due_date": "2000-01-01"
        }
        
        response = api_client.post("/api/create_task/", data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.required
@pytest.mark.tasks
@pytest.mark.parametrize("test_username", ["andres"])
class TestTaskRetrieval:
    def test_get_task_authenticated(self, api_client, test_user, test_task, test_username):
        # Log in
        user = StudyUser.objects.get(username=test_username)
        api_client.force_authenticate(user=user)

        # Make the request
        url = "/api/get_task/"
        query_params = {"username": test_username}
        response = api_client.get(url, data=query_params)

        assert response.status_code == status.HTTP_200_OK
        assert response.data[0]["name"] == "Test"

    def test_get_task_unauthenticated(self, api_client, test_username):
        url = "/api/get_task/"
        query_params = {"username": test_username}
        response = api_client.get(url, data=query_params)

        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.tasks
class TestTaskIsolation:
    def test_task_belongs_to_requesting_user(self, api_client, test_user):
        """Task should be assigned to the authenticated user, not someone else."""
        api_client.force_authenticate(user=test_user)
        data = {"name": "My Task", "reward": 50}
        api_client.post("/api/create_task/", data, format='json')

        assert Task.objects.filter(name="My Task", user=test_user).exists()

    def test_users_cannot_see_each_others_tasks(self, api_client, test_user, other_user):
        """Tasks created by one user shouldn't appear for another."""
        api_client.force_authenticate(user=test_user)
        api_client.post("/api/create_task/", {"name": "Private Task", "reward": 10}, format='json')

        api_client.force_authenticate(user=other_user)
        response = api_client.get("/api/get_task/")
        task_names = [t["name"] for t in response.data]
        assert "Private Task" not in task_names

# Create your tests here.
