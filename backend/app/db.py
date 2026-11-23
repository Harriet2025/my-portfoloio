"""Tiny SQLite store for contact messages (standard library only)."""

import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    topic      TEXT NOT NULL,
    message    TEXT NOT NULL,
    ip         TEXT
);
"""


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    # Serverless hosts may start on a fresh disk at any time, so make sure the table exists on every connection.
    conn.executescript(SCHEMA)
    return conn


def init(db_path: Path) -> None:
    with closing(connect(db_path)) as conn, conn:
        conn.executescript(SCHEMA)


def save_message(db_path: Path, *, name: str, email: str, topic: str, message: str, ip: str | None) -> int:
    with closing(connect(db_path)) as conn, conn:
        cur = conn.execute(
            "INSERT INTO messages (created_at, name, email, topic, message, ip) VALUES (?, ?, ?, ?, ?, ?)",
            (datetime.now(timezone.utc).isoformat(timespec="seconds"), name, email, topic, message, ip),
        )
        return int(cur.lastrowid)


def list_messages(db_path: Path, limit: int = 100) -> list[dict]:
    with closing(connect(db_path)) as conn:
        rows = conn.execute(
            "SELECT id, created_at, name, email, topic, message FROM messages ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]
