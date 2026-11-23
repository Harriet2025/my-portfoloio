"""Settings read from environment variables. Every notification setting is optional."""

import os
from dataclasses import dataclass, field
from pathlib import Path


def _list(value: str) -> list[str]:
    return [v.strip() for v in value.split(",") if v.strip()]


@dataclass(frozen=True)
class Settings:
    # On Vercel only /tmp is writable (and it is temporary), so default there.
    data_dir: Path = field(default_factory=lambda: Path(os.getenv("DATA_DIR") or ("/tmp/portfolio" if os.getenv("VERCEL") else "./data")))
    # Serverless functions can freeze right after responding, so send notifications before replying there.
    serverless: bool = field(default_factory=lambda: bool(os.getenv("VERCEL")))
    # Origins allowed to call the API directly from a browser (the Next.js proxy does not need this).
    cors_origins: list[str] = field(default_factory=lambda: _list(os.getenv("CORS_ORIGINS", "http://localhost:3000")))
    # Protects GET /api/messages. Leave empty to turn that endpoint off.
    admin_token: str = field(default_factory=lambda: os.getenv("ADMIN_TOKEN", ""))

    # Contact form rate limit: at most N messages per window per IP address.
    rate_limit_count: int = field(default_factory=lambda: int(os.getenv("RATE_LIMIT_COUNT", "5")))
    rate_limit_window_s: int = field(default_factory=lambda: int(os.getenv("RATE_LIMIT_WINDOW_S", "600")))

    # Telegram notification (optional)
    telegram_bot_token: str = field(default_factory=lambda: os.getenv("TELEGRAM_BOT_TOKEN", ""))
    telegram_chat_id: str = field(default_factory=lambda: os.getenv("TELEGRAM_CHAT_ID", ""))

    # Email notification over SMTP (optional), e.g. Gmail with an app password
    smtp_host: str = field(default_factory=lambda: os.getenv("SMTP_HOST", ""))
    smtp_port: int = field(default_factory=lambda: int(os.getenv("SMTP_PORT", "587")))
    smtp_user: str = field(default_factory=lambda: os.getenv("SMTP_USER", ""))
    smtp_password: str = field(default_factory=lambda: os.getenv("SMTP_PASSWORD", ""))
    notify_email_to: str = field(default_factory=lambda: os.getenv("NOTIFY_EMAIL_TO", ""))

    @property
    def db_path(self) -> Path:
        return self.data_dir / "portfolio.db"


def get_settings() -> Settings:
    return Settings()
