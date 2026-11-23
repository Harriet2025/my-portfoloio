"""Portfolio API: contact form and simulated automation runs."""

import logging
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from typing import Literal

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

from . import db, notify, workflows
from .config import Settings, get_settings

logging.basicConfig(level=logging.INFO)
settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    db.init(settings.db_path)
    yield


app = FastAPI(title="Harriet Ayim Portfolio API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


def current_settings() -> Settings:
    return settings


# ---------------------------------------------------------------- rate limiting
_hits: dict[str, deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limited(ip: str, s: Settings) -> bool:
    now = time.monotonic()
    window = _hits[ip]
    while window and now - window[0] > s.rate_limit_window_s:
        window.popleft()
    if len(window) >= s.rate_limit_count:
        return True
    window.append(now)
    return False


# ---------------------------------------------------------------- health
@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# ---------------------------------------------------------------- contact
class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    topic: Literal["Web project", "Automation", "Job opportunity", "Content collab", "Tutoring", "Something else"] = "Something else"
    message: str = Field(min_length=10, max_length=4000)
    # Honeypot: hidden in the form, so real people leave it empty.
    website: str = ""

    @field_validator("name", "message")
    @classmethod
    def strip(cls, v: str) -> str:
        return v.strip()


@app.post("/api/contact", status_code=201)
def contact(
    body: ContactIn,
    request: Request,
    tasks: BackgroundTasks,
    s: Settings = Depends(current_settings),
) -> dict:
    if body.website:
        return {"ok": True}  # quietly drop bots
    ip = client_ip(request)
    if rate_limited(ip, s):
        raise HTTPException(429, "Too many messages. Please try again in a few minutes.")
    msg_id = db.save_message(s.db_path, name=body.name, email=body.email, topic=body.topic, message=body.message, ip=ip)
    note = dict(name=body.name, email=body.email, topic=body.topic, message=body.message)
    if s.serverless:
        notify.notify_new_message(s, **note)
    else:
        tasks.add_task(notify.notify_new_message, s, **note)
    return {"ok": True, "id": msg_id}


@app.get("/api/messages")
def messages(authorization: str = Header(default=""), s: Settings = Depends(current_settings)) -> list[dict]:
    if not s.admin_token:
        raise HTTPException(404, "Not found")
    if authorization != f"Bearer {s.admin_token}":
        raise HTTPException(401, "Unauthorized")
    return db.list_messages(s.db_path)


# ---------------------------------------------------------------- workflows
class RunIn(BaseModel):
    inputs: dict[str, str | bool] = Field(default_factory=dict)

    @field_validator("inputs")
    @classmethod
    def small(cls, v: dict) -> dict:
        if len(v) > 10:
            raise ValueError("too many inputs")
        return v


@app.get("/api/workflows")
def list_workflows() -> list[str]:
    return list(workflows.RUNNERS)


@app.post("/api/workflows/{workflow_id}/run")
def run_workflow(workflow_id: str, body: RunIn) -> dict:
    if workflow_id not in workflows.RUNNERS:
        raise HTTPException(404, "Unknown workflow")
    return workflows.run(workflow_id, body.inputs)
