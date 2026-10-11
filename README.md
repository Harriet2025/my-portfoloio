# Harriet Ama-Adubea Ayim: Portfolio

A single-page developer portfolio (React, Tailwind CSS and Framer Motion loaded from CDNs, no build step).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole site |
| `headshot.jpg`, `shot-*.jpg` | Portrait and project screenshots |
| `Harriet_Ayim_CV.pdf` | File behind the Download CV buttons |
| `Dockerfile`, `nginx.conf` | Container setup (nginx) for Coolify or any Docker host |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
docker build -t my-portfolio . && docker run -p 8080:80 my-portfolio
```

## Deploy on Coolify

1. **New Resource** > **Public/Private Repository** and pick `Harriet2025/my-portfoloio` (branch `main`).
2. **Build Pack**: `Dockerfile`.
3. **Ports Exposes**: `80`.
4. Add your domain under **Domains** (for example `https://portfolio.example.com`), then **Deploy**.
5. Turn on **Auto Deploy** (or add the webhook shown in Coolify to the GitHub repo) so every push redeploys.

Alternative without Docker: choose the **Static** build pack, set **Publish Directory** to `/`, and leave the build command empty.

The container exposes a `/healthz` endpoint that Coolify's health check can use.

## Updating content

- Links, handles and email: edit the `PROFILE` block near the top of the script in `index.html`.
- Project tiles, screenshots and live links: edit `PROJECTS`, `SHOTS` and `PROJECT_LINKS`.
- n8n workflow links: edit `PROJECT_ARTIFACTS`.
- New CV: replace `Harriet_Ayim_CV.pdf` (keep the same filename).
