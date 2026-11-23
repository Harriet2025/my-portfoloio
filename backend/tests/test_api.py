import os
import tempfile

os.environ["DATA_DIR"] = tempfile.mkdtemp()
os.environ["ADMIN_TOKEN"] = "secret"
os.environ["RATE_LIMIT_COUNT"] = "3"

from fastapi.testclient import TestClient  # noqa: E402

from app import main  # noqa: E402

client = TestClient(main.app)
client.__enter__()  # run lifespan so the database table exists

GOOD = {"name": "Kofi Boateng", "email": "kofi@example.com", "topic": "Web project", "message": "I need a website for my shop."}


def setup_function():
    main._hits.clear()


def test_health():
    assert client.get("/api/health").json() == {"status": "ok"}


def test_contact_saves_and_lists():
    r = client.post("/api/contact", json=GOOD)
    assert r.status_code == 201 and r.json()["ok"]
    listed = client.get("/api/messages", headers={"Authorization": "Bearer secret"}).json()
    assert listed[0]["email"] == "kofi@example.com"


def test_messages_requires_token():
    assert client.get("/api/messages").status_code == 401


def test_contact_validation():
    assert client.post("/api/contact", json={**GOOD, "email": "not-an-email"}).status_code == 422
    assert client.post("/api/contact", json={**GOOD, "message": "short"}).status_code == 422


def test_honeypot_is_dropped():
    before = len(client.get("/api/messages", headers={"Authorization": "Bearer secret"}).json())
    assert client.post("/api/contact", json={**GOOD, "website": "spam.example"}).json() == {"ok": True}
    after = len(client.get("/api/messages", headers={"Authorization": "Bearer secret"}).json())
    assert before == after


def test_rate_limit():
    codes = [client.post("/api/contact", json=GOOD).status_code for _ in range(4)]
    assert codes == [201, 201, 201, 429]


def test_job_search_run():
    r = client.post("/api/workflows/job-search/run", json={"inputs": {"role": "Automation Engineer", "location": "Kumasi"}})
    data = r.json()
    assert r.status_code == 200 and data["simulated"] is True
    assert [s["node"] for s in data["steps"]] == ["webhook", "serpapi", "filter", "groq", "parse", "telegram"]
    assert data["output"]["top_matches"][0]["location"] == "Kumasi"


def test_email_run_error_lane():
    data = client.post("/api/workflows/email-outreach/run", json={"inputs": {"has_email": False}}).json()
    assert data["steps"][-1]["node"] == "log"
    assert data["output"]["status"] == "skipped"


def test_unknown_workflow():
    assert client.post("/api/workflows/nope/run", json={}).status_code == 404
