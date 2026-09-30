from typing import Any

import pytest
from django.core.management import call_command

from .models import StudyUser, Task

SAMPLE_ICS = b"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Instructure//Canvas//EN
BEGIN:VEVENT
UID:event-assignment-12345@instructure.com
DTSTART:20261231T235900Z
SUMMARY:Programming Assignment 3 [CEN3031]
DESCRIPTION:Submit via Canvas
END:VEVENT
BEGIN:VEVENT
UID:event-assignment-67890@instructure.com
DTSTART;VALUE=DATE:20261225
SUMMARY:Reading Quiz [CEN3031]
END:VEVENT
END:VCALENDAR
"""


class FakeResponse:
    content = SAMPLE_ICS

    def raise_for_status(self) -> None:
        return None


@pytest.fixture
def canvas_user(db: Any) -> StudyUser:
    """Creates a StudyUser with a Canvas feed URL saved."""
    return StudyUser.objects.create_user(
        username="synced",
        password="password123",
        canvas_ics_url="https://ufl.instructure.com/feeds/calendars/user_abc.ics",
    )


@pytest.fixture
def mock_canvas(monkeypatch: pytest.MonkeyPatch) -> None:
    """Stubs the Canvas HTTP fetch so tests never hit the network."""
    import scripts.canvas_calendar as cc

    monkeypatch.setattr(cc.requests, "get", lambda *args, **kwargs: FakeResponse())


@pytest.mark.tasks
def test_sync_creates_tasks(canvas_user: StudyUser, mock_canvas: None) -> None:
    call_command("sync_canvas")

    assert Task.objects.filter(user=canvas_user).count() == 2

    task = Task.objects.get(canvas_uid="event-assignment-12345@instructure.com")
    assert task.name == "Programming Assignment 3"
    assert task.category == "CEN3031"
    assert task.description == "Submit via Canvas"


@pytest.mark.tasks
def test_sync_is_idempotent(canvas_user: StudyUser, mock_canvas: None) -> None:
    """Running sync twice must not duplicate tasks - this is what makes a cron job safe."""
    call_command("sync_canvas")
    call_command("sync_canvas")

    assert Task.objects.filter(user=canvas_user).count() == 2


@pytest.mark.tasks
def test_sync_does_not_reset_reward_on_update(canvas_user: StudyUser, mock_canvas: None) -> None:
    """A re-sync must not clobber a reward the user tuned on an existing task."""
    call_command("sync_canvas")

    task = Task.objects.get(canvas_uid="event-assignment-12345@instructure.com")
    task.reward = 25
    task.save()

    call_command("sync_canvas")

    task.refresh_from_db()
    assert task.reward == 25


@pytest.mark.tasks
def test_all_day_event_becomes_end_of_day(canvas_user: StudyUser, mock_canvas: None) -> None:
    call_command("sync_canvas")

    quiz = Task.objects.get(canvas_uid="event-assignment-67890@instructure.com")
    assert (quiz.due_date.hour, quiz.due_date.minute) == (23, 59)


@pytest.mark.tasks
def test_user_without_canvas_url_is_skipped(db: Any, mock_canvas: None) -> None:
    unsynced = StudyUser.objects.create_user(username="nosync", password="password123")

    call_command("sync_canvas")

    assert Task.objects.filter(user=unsynced).count() == 0


@pytest.mark.tasks
def test_failing_feed_does_not_block_other_users(
    canvas_user: StudyUser, monkeypatch: pytest.MonkeyPatch
) -> None:
    other = StudyUser.objects.create_user(
        username="other",
        password="password123",
        canvas_ics_url="https://ufl.instructure.com/feeds/calendars/user_bad.ics",
    )

    import scripts.canvas_calendar as cc

    def flaky_get(url: str, *args: Any, **kwargs: Any) -> FakeResponse:
        if "user_bad" in url:
            raise RuntimeError("410 Gone")
        return FakeResponse()

    monkeypatch.setattr(cc.requests, "get", flaky_get)

    call_command("sync_canvas")

    assert Task.objects.filter(user=canvas_user).count() == 2
    assert Task.objects.filter(user=other).count() == 0
