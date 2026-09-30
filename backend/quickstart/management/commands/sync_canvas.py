from datetime import date, datetime, time
from typing import Any

from django.core.management.base import BaseCommand
from django.utils import timezone

from quickstart.models import StudyUser, Task
from scripts.canvas_calendar import canvas_ics_parse


def to_datetime(value: date | datetime | None) -> datetime | None:
    """Convert an ICS start value into an aware datetime.

    All-day events parse as a plain `date`, but Task.due_date requires a
    datetime. An all-day assignment is due at the end of that day, so using
    midnight would mark it overdue a day early.
    """
    if value is None:
        return None

    if not isinstance(value, datetime):
        value = datetime.combine(value, time.max)

    if timezone.is_naive(value):
        value = timezone.make_aware(value, timezone.get_current_timezone())

    return value


class Command(BaseCommand):
    help = "Sync Canvas calendar events into Tasks for users with a synced account."

    def handle(self, *args: Any, **options: Any) -> None:
        users = StudyUser.objects.exclude(canvas_ics_url__isnull=True).exclude(canvas_ics_url="")

        for user in users:
            try:
                events = canvas_ics_parse(user.canvas_ics_url)
            except Exception as exc:  # noqa: BLE001
                # One unreachable or malformed feed must not abort the whole run
                self.stderr.write(f"Canvas sync failed for {user.username}: {exc}")
                continue

            created = 0
            updated = 0
            for event in events:
                due_date = to_datetime(event.get("start"))
                if due_date is None or not event.get("uid"):
                    continue

                _, was_created = Task.objects.update_or_create(
                    user=user,
                    canvas_uid=event["uid"],
                    defaults={
                        "name": event["summary"],
                        "category": event["course"],
                        "description": event["description"] or "No description given",
                        "due_date": due_date,
                    },
                )

                if was_created:
                    created += 1
                else:
                    updated += 1

            self.stdout.write(f"{user.username}: {created} created, {updated} updated")
