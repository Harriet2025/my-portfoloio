# Static portfolio served by nginx. Works with Coolify's "Dockerfile" build pack.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Only the public site files go into the web root
COPY index.html headshot.jpg shot-*.jpg Harriet_Ayim_CV.pdf /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1