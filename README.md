# Harriet Ama-Adubea Ayim: Portfolio

A motion-heavy developer portfolio with a **Next.js + React** frontend and a **Python (FastAPI)** backend.

| Part | Stack | What it does |
| --- | --- | --- |
| `frontend/` | Next.js 16, React 19, Tailwind CSS 4, GSAP + ScrollTrigger, Motion, Lenis | The site, its animations and the case-study pages |
| `backend/` | Python 3.13, FastAPI, SQLite | Contact form API and the live automation demos |

## How the animation libraries are used

- **Lenis**: smooth scrolling for the whole site ([SmoothScroll.tsx](frontend/src/components/providers/SmoothScroll.tsx)), driven by GSAP's ticker so ScrollTrigger stays in sync.
- **GSAP + ScrollTrigger**: anything tied to scroll position: the hero portrait parallax, the velocity marquee, the word-by-word About reveal, the pinned horizontal bookshelf of projects, the magazine rack fanning in, the timeline spine that draws itself and the certificate frames dropping onto the wall.
- **Motion** (formerly Framer Motion): text reveals, the intro and page-transition curtain, hover/flip/magnetic effects, the swinging certificate frames, the letter-and-envelope contact form and the workflow-demo animations.
- Everything respects the visitor's "reduce motion" setting.

## Sections

Hero (large arched portrait + moving typography) → About (scroll text reveal + counters) → Skills (flip-card catalogue with ink bars) → Work (horizontal bookshelf → `/projects/[slug]` case studies) → Automation lab (run the n8n workflows live) → Content creation (magazine rack) → Journey (animated timeline + framed certificates) → Contact (write a letter + social stamps).

## Run locally

You need Node 20+ and Python 3.11+.

```bash
# 1. Backend (http://127.0.0.1:8000)
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000

# 2. Frontend (http://localhost:3000), in a second terminal
cd frontend
npm install
npm run dev
```

The frontend forwards `/api/*` to the backend through [route.ts](frontend/src/app/api/[...path]/route.ts), so the browser never calls Python directly. If the backend is offline, the automation demo still plays with placeholder data and the contact form tells visitors to email instead.

Backend tests: `cd backend && python -m pytest`

## Updating content

Everything you would normally edit is in [frontend/src/content/site.ts](frontend/src/content/site.ts): profile and social links, about text, stats, skills, projects (with live links, case-study text and an optional `status: "in-progress"`), the workflow diagrams, the timeline, content-creation roles and certificates. Images and the CV go in [frontend/public/](frontend/public/) (keep the CV filename `Harriet_Ayim_CV.pdf`).

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Save a contact message (validated, rate limited, honeypot spam check), then notify by Telegram and/or email if configured |
| GET | `/api/messages` | Read saved messages. Needs `Authorization: Bearer $ADMIN_TOKEN`; off when no token is set |
| POST | `/api/workflows/{job-search\|email-outreach}/run` | Simulated run of an n8n workflow with sample data |

Messages are stored in SQLite at `$DATA_DIR/portfolio.db`. On Vercel that disk is temporary (`/tmp`), so set up Telegram or email notifications to actually receive messages.

## Deploy on Vercel (current)

The live site is one Vercel project using **Services**, configured by the root [vercel.json](vercel.json):

- `frontend` (Next.js) is public and serves every route.
- `backend` (FastAPI, entrypoint `app.main:app`) is internal. A service binding gives the frontend its URL as `BACKEND_URL`, and the `/api/*` proxy route forwards to it.

Every push to `main` on GitHub deploys automatically. Optional environment variables (Project → Settings → Environment Variables): `ADMIN_TOKEN`, Telegram or SMTP settings from [.env.example](.env.example), and `NEXT_PUBLIC_SITE_URL` if you add a custom domain.

## Deploy on Coolify (alternative)

1. **New Resource** → your GitHub repo → **Build Pack: Docker Compose** (uses [docker-compose.yml](docker-compose.yml)).
2. Give the **frontend** service your domain (port `3000`). Leave the backend without a domain: it is only reachable by the frontend.
3. Add environment variables from [.env.example](.env.example): at least `SITE_URL`, and optionally `ADMIN_TOKEN` plus Telegram or SMTP settings to get notified of new messages.
4. Deploy. Turn on Auto Deploy so every push redeploys.

Or run the same thing anywhere with Docker: `docker compose up --build`.
