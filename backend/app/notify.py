"""Optional notifications when a contact message arrives. Failures are logged, never raised."""

import json
import logging
import smtplib
import urllib.request
from email.message import EmailMessage

from .config import Settings

log = logging.getLogger("portfolio.notify")


def _summary(name: str, email: str, topic: str, message: str) -> str:
    return f"New portfolio message\n\nFrom: {name} <{email}>\nTopic: {topic}\n\n{message}"


def send_telegram(settings: Settings, text: str) -> None:
    if not (settings.telegram_bot_token and settings.telegram_chat_id):
        return
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    body = json.dumps({"chat_id": settings.telegram_chat_id, "text": text}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=10).close()
    except Exception:  # noqa: BLE001 - a failed alert must not break the request
        log.exception("Telegram notification failed")


def send_email(settings: Settings, reply_to: str, text: str) -> None:
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password and settings.notify_email_to):
        return
    msg = EmailMessage()
    msg["Subject"] = "New message from your portfolio"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.notify_email_to
    msg["Reply-To"] = reply_to
    msg.set_content(text)
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            smtp.starttls()
            smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(msg)
    except Exception:  # noqa: BLE001
        log.exception("Email notification failed")


def notify_new_message(settings: Settings, *, name: str, email: str, topic: str, message: str) -> None:
    text = _summary(name, email, topic, message)
    send_telegram(settings, text)
    send_email(settings, email, text)
