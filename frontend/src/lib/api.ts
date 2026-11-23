/* Browser-side calls. Everything goes to /api/* on this site, which Next.js proxies to the Python backend. */

export type RunStep = { node: string; label: string; log: string; duration_ms: number };
export type RunResult = { run_id: string; workflow: string; simulated: boolean; steps: RunStep[]; output: Record<string, unknown>; offline?: boolean };

export async function runWorkflow(id: string, inputs: Record<string, string | boolean>): Promise<RunResult> {
  const res = await fetch(`/api/workflows/${id}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs }),
  });
  if (!res.ok) throw new Error(`Workflow API returned ${res.status}`);
  return res.json();
}

export type ContactPayload = { name: string; email: string; topic: string; message: string; website: string };

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) return;
  let detail = "Something went wrong. Please email me directly instead.";
  try {
    const data = await res.json();
    if (typeof data.detail === "string") detail = data.detail;
    else if (Array.isArray(data.detail)) {
      const field = data.detail[0]?.loc?.at(-1);
      detail = field ? `Please check the ${field} field.` : detail;
    }
  } catch {}
  throw new Error(detail);
}
