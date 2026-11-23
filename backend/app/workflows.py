"""Simulated runs of the two n8n automation projects.

Nothing is actually searched, generated or sent: each run replays the real workflow's
node order with sample data built from the visitor's inputs, so the demo is safe and free.
The node ids match the ones the frontend draws on its workflow canvas.
"""

import hashlib
import random
import uuid
from typing import Callable

COMPANIES = ["Northwind Labs", "Kente Digital", "Volta Systems", "Osu Tech Hub", "Coastline Apps", "Adinkra Cloud"]
JOB_REQUIREMENTS = {
    "web": ["HTML, CSS and JavaScript", "PHP or Laravel", "MySQL", "Git"],
    "data": ["SQL", "Python", "Excel or Sheets", "Dashboards"],
    "automation": ["n8n or Zapier", "REST APIs and webhooks", "JSON", "Basic scripting"],
    "default": ["Problem solving", "Git", "Clear communication", "Willingness to learn"],
}
BENEFITS = ["Hybrid work", "Mentorship programme", "Health cover", "Learning budget", "Flexible hours", "Laptop provided"]


def _rng(*parts: str) -> random.Random:
    """Same inputs give the same sample output, so repeated runs look consistent."""
    seed = hashlib.sha256("|".join(p.lower().strip() for p in parts).encode()).hexdigest()
    return random.Random(int(seed[:12], 16))


def _clean(value: object, default: str, max_len: int = 60) -> str:
    text = str(value or "").strip()[:max_len]
    return text or default


def _job_family(role: str) -> str:
    r = role.lower()
    if any(k in r for k in ("automation", "n8n", "integration", "workflow")):
        return "automation"
    if any(k in r for k in ("data", "analyst", "sql")):
        return "data"
    if any(k in r for k in ("web", "frontend", "front-end", "backend", "full", "php", "developer")):
        return "web"
    return "default"


def run_job_search(inputs: dict) -> dict:
    role = _clean(inputs.get("role"), "Junior Web Developer")
    location = _clean(inputs.get("location"), "Accra")
    rng = _rng(role, location)

    found = rng.randint(14, 32)
    matched = rng.randint(3, min(8, found))
    reqs = JOB_REQUIREMENTS[_job_family(role)]
    listings = [
        {
            "title": role,
            "company": rng.choice(COMPANIES),
            "location": location,
            "requirements": rng.sample(reqs, k=3),
            "benefits": rng.sample(BENEFITS, k=2),
            "match": rng.randint(72, 97),
        }
        for _ in range(min(matched, 3))
    ]
    listings.sort(key=lambda l: l["match"], reverse=True)
    top = listings[0]

    steps = [
        ("webhook", "Webhook received", f'role="{role}", location="{location}"'),
        ("serpapi", "SerpAPI search", f"{found} listings returned"),
        ("filter", "Filter listings", f"{matched} kept after role, location and keyword rules"),
        ("groq", "Groq LLM summary", f"requirements and benefits extracted for {matched} listings"),
        ("parse", "JSON parse", "model output structured into clean fields"),
        ("telegram", "Telegram alert", f'top match "{top["title"]} at {top["company"]}" sent to chat'),
    ]
    telegram = (
        f"New match ({top['match']}%)\n{top['title']} · {top['company']} · {top['location']}\n"
        f"Needs: {', '.join(top['requirements'])}\nPerks: {', '.join(top['benefits'])}"
    )
    output = {"listings_found": found, "matched": matched, "top_matches": listings, "telegram_preview": telegram}
    return {"steps": steps, "output": output}


def run_email_outreach(inputs: dict) -> dict:
    name = _clean(inputs.get("name"), "Ama Mensah", 40)
    company = _clean(inputs.get("company"), "Sunrise Bakery", 60)
    goal = _clean(inputs.get("goal"), "automate their order follow-ups", 120)
    has_email = bool(str(inputs.get("has_email", True)).lower() not in ("false", "0", "no"))
    first = name.split()[0]

    if not has_email:
        steps = [
            ("sheets", "Read lead row", f"{name} · {company}"),
            ("condition", "IF: has address?", "no email address on this row"),
            ("error", "Error lane", "row skipped, nothing sent"),
            ("log", "Log + flag row", 'row flagged "needs email" for follow-up'),
        ]
        return {"steps": steps, "output": {"status": "skipped", "reason": "missing email address", "row_flagged": True}}

    subject = f"A quick idea for {company}"
    body = (
        f"Hi {first},\n\n"
        f"I came across {company} and had an idea: a small automation that could help you {goal}. "
        "It runs in the background, so your team spends less time on repeat tasks.\n\n"
        "Would a 15-minute call next week be useful?\n\nBest,\nHarriet"
    )
    steps = [
        ("sheets", "Read lead row", f"{name} · {company}"),
        ("condition", "IF: has address?", "address present, not contacted before"),
        ("groq", "Groq LLM draft", f"personalised email written for {first}"),
        ("gmail", "Gmail send", "sent (simulated) through the Gmail API"),
        ("update", "Update row", 'row marked "sent" so it is never emailed twice'),
    ]
    output = {"status": "sent", "email": {"subject": subject, "body": body}, "row_updated": True}
    return {"steps": steps, "output": output}


RUNNERS: dict[str, Callable[[dict], dict]] = {
    "job-search": run_job_search,
    "email-outreach": run_email_outreach,
}


def run(workflow_id: str, inputs: dict) -> dict:
    result = RUNNERS[workflow_id](inputs)
    rng = _rng(workflow_id, str(sorted(inputs.items())))
    return {
        "run_id": uuid.uuid4().hex[:12],
        "workflow": workflow_id,
        "simulated": True,
        "steps": [
            {"node": node, "label": label, "log": log_line, "duration_ms": rng.randint(180, 900)}
            for node, label, log_line in result["steps"]
        ],
        "output": result["output"],
    }
