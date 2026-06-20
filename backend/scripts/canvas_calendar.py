import requests
from icalendar import Calendar


def canvas_ics_parse(url: str) -> list[dict]:
    response = requests.get(url)
    response.raise_for_status()

    cal = Calendar.from_ical(response.content)
    events = []
    for component in cal.walk():
        if component.name == "VEVENT":
            summary = component.get("summary").strip()

            # parse course names... scared of this code
            course = None
            if summary[-1] == "]":
                last_chunk = summary.rsplit("[", 1)[-1]
                course = last_chunk.rstrip("]")

            # split course and rest of content
            if course is not None:
                summary = summary.replace(f"[{course}]", "").strip()

            events.append(
                {
                    "summary": summary,
                    "course": course,
                    "description": component.get("description").strip()
                    if component.get("description")
                    else None,
                    "start": component.get("dtstart").dt if component.get("dtstart") else None,
                    "end": component.get("dtend").dt if component.get("dtend") else None,
                    "location": component.get("location").strip()
                    if component.get("location")
                    else None,
                }
            )

    # TESTING
    #             print(f"""
    # Summary: {events[-1]['summary']}
    # Course: {events[-1]['course']}
    # Description: {events[-1]['description']}
    # Start: {events[-1]['start']}
    # End: {events[-1]['end']}
    # Location: {events[-1]['location']}
    #                   """)

    return events


# testing
if __name__ == "__main__":
    # fill with your url and run python .\backend\scripts\canvas_calendar.py
    url = None
    if url is None:
        url = input("Find your Canvas .ics link by going to your Canvas Calendar:")
    canvas_ics_parse(url)
