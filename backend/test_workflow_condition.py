import re
from pathlib import Path

import pytest

UPSTREAM_REPOSITORY = "ufosc/Studygatchi"
WORKFLOW_PATH = Path(__file__).resolve().parents[1] / ".github/workflows/python-app.yml"


def _build_addtl_condition() -> dict[str, str]:
    workflow = WORKFLOW_PATH.read_text()
    job = re.search(
        r"(?ms)^  build-addtl:\s*\n(?P<body>.*?)(?=^  [A-Za-z0-9_-]+:|\Z)",
        workflow,
    )
    assert job is not None, "build-addtl job not found in workflow"

    condition = re.search(r"(?m)^    if:\s*(.*?)\s*$", job.group("body"))
    assert condition is not None, "build-addtl job condition not found"

    comparisons: dict[str, str] = {}
    for clause in condition.group(1).split("&&"):
        comparison = re.fullmatch(
            r"\s*github\.(event_name|repository)\s*!=\s*'([^']+)'\s*",
            clause,
        )
        assert comparison is not None, f"unsupported build-addtl condition clause: {clause}"
        comparisons[comparison.group(1)] = comparison.group(2)

    assert comparisons.get("event_name") == "pull_request"
    assert comparisons.get("repository") == UPSTREAM_REPOSITORY
    return comparisons


@pytest.mark.required
@pytest.mark.parametrize(
    ("event_name", "repository", "expected_to_run"),
    [
        ("push", UPSTREAM_REPOSITORY, False),
        ("push", "kayleed10/Studygatchi", True),
        ("pull_request", UPSTREAM_REPOSITORY, False),
        ("pull_request", "kayleed10/Studygatchi", False),
        ("workflow_dispatch", UPSTREAM_REPOSITORY, False),
        ("workflow_dispatch", "kayleed10/Studygatchi", True),
    ],
)
def test_build_addtl_runs_only_for_fork_push_and_dispatch(
    event_name: str,
    repository: str,
    expected_to_run: bool,
) -> None:
    comparisons = _build_addtl_condition()
    context = {"event_name": event_name, "repository": repository}

    should_run = all(
        context[field] != excluded_value for field, excluded_value in comparisons.items()
    )

    assert should_run is expected_to_run
