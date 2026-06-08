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
    """Creates a StudyUser for testing."""
    return StudyUser.objects.create_user(
        username="andres", 
        password="password123",
        money=500
    )

@pytest.fixture
def test_task(db):
    return Task.objects.create(
        name="Test",
        reward=50,
        description="Make sure this works",
        due_date="2026-12-31"
    )

@pytest.mark.django_db
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
            "due_date": "2026-12-31"
        }
        
        # 3. Request
        response = api_client.post(url, data, format='json')
        
        # 4. Assertions
        assert response.status_code == status.HTTP_201_CREATED
        
        # Verify DB entry
        task = Task.objects.get(name="Math Homework")
        assert task.user == test_user
        assert task.user.money == 500

    def test_create_task_unauthenticated(self, api_client):
        """Ensure logged-out users can't create tasks."""
        url = "/api/create_task/"
        data = {"name": "Ghost Task"}
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
@pytest.mark.parametrize("test_username", ["andres"])
class TestTaskRetrieval:
    def test_get_task_authenticated(self, api_client, test_user, test_username):
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
        

# Create your tests here.
