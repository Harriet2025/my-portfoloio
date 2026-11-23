/**
 * Forwards /api/* to the Python backend so the browser only ever talks to this site
 * (no CORS, and the backend can stay on a private network).
 */
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
const ALLOWED = /^(health|contact|workflows(\/[a-z-]+\/run)?)$/;

async function proxy(req: NextRequest, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params;
  const subpath = path.join("/");
  if (!ALLOWED.test(subpath)) return Response.json({ detail: "Not found" }, { status: 404 });

  const headers = new Headers({ "Content-Type": "application/json" });
  // The last entry is the one added by our own reverse proxy, so visitors cannot spoof it to dodge the rate limit.
  const clientIp = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (clientIp) headers.set("X-Forwarded-For", clientIp);

  try {
    const res = await fetch(`${BACKEND_URL}/api/${subpath}`, {
      method: req.method,
      headers,
      body: req.method === "GET" ? undefined : await req.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    return new Response(res.body, { status: res.status, headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" } });
  } catch {
    return Response.json({ detail: "The API is unavailable right now. Please email me directly instead." }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
