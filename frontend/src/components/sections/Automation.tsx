"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WORKFLOWS, type FlowNode } from "@/content/site";
import { runWorkflow, type RunResult, type RunStep } from "@/lib/api";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

type WfId = keyof typeof WORKFLOWS;
type NodeState = "idle" | "active" | "done";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const KIND_COLOR: Record<FlowNode["kind"], string> = {
  trigger: "text-sage",
  data: "text-cream",
  logic: "text-gold",
  ai: "text-ember",
  output: "text-ember",
  error: "text-[#ff9b8a]",
};

/** Used only if the Python API cannot be reached, so the demo still plays. */
function offlineRun(id: WfId, inputs: Record<string, string | boolean>): RunResult {
  const route = id === "job-search" ? ["webhook", "serpapi", "filter", "groq", "parse", "telegram"] : inputs.has_email === false ? ["sheets", "condition", "error", "log"] : ["sheets", "condition", "groq", "gmail", "update"];
  const nodes = WORKFLOWS[id].nodes;
  return {
    run_id: "offline",
    workflow: id,
    simulated: true,
    offline: true,
    steps: route.map((n) => ({ node: n, label: nodes.find((x) => x.id === n)!.label, log: "completed", duration_ms: 450 })),
    output: { status: "completed", note: "The demo API is offline, so this run used placeholder data." },
  };
}

export default function Automation() {
  const [wf, setWf] = useState<WfId>("job-search");
  return (
    <section id="automation" className="relative overflow-hidden bg-ink-2 py-28 sm:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-20%] top-0 h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle,rgba(242,100,58,.14),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <SectionLabel index="04">AI automation lab</SectionLabel>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
          <SplitText as="h2" text="Run my workflows live" className="block max-w-[14ch] font-display text-[clamp(2.6rem,7vw,6rem)] font-extrabold uppercase leading-[.9] tracking-tight" />
          <p className="max-w-[40ch] text-mute">These are the n8n systems I built, replayed by my Python API with sample data. Change the inputs, press run and watch each node fire. Nothing real is searched or sent.</p>
        </div>

        <div role="tablist" aria-label="Workflow" className="mt-12 inline-flex rounded-full border border-line p-1">
          {(Object.keys(WORKFLOWS) as WfId[]).map((id) => (
            <button key={id} type="button" role="tab" aria-selected={wf === id} onClick={() => setWf(id)} className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${wf === id ? "text-ink" : "text-cream/80 hover:text-cream"}`}>
              {wf === id && <motion.span layoutId="wf-tab" className="absolute inset-0 rounded-full bg-ember" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className="relative">{WORKFLOWS[id].title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={wf} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}>
            <Lab id={wf} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Lab({ id }: { id: WfId }) {
  const def = WORKFLOWS[id];
  const initial = Object.fromEntries(def.fields.map((f) => [f.name, f.type === "toggle" ? true : ""])) as Record<string, string | boolean>;
  const [inputs, setInputs] = useState(initial);
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [litEdges, setLitEdges] = useState<string[]>([]);
  const [packet, setPacket] = useState<{ from: FlowNode; to: FlowNode; key: number } | null>(null);
  const [logs, setLogs] = useState<{ t: string; step: RunStep }[]>([]);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const runToken = useRef(0);
  const logBox = useRef<HTMLOListElement>(null);

  useEffect(() => () => void (runToken.current += 1), []);
  useEffect(() => {
    logBox.current?.scrollTo({ top: logBox.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  const node = (nid: string) => def.nodes.find((n) => n.id === nid)!;

  const run = async () => {
    const token = ++runToken.current;
    setRunning(true);
    setStates({});
    setLitEdges([]);
    setLogs([]);
    setResult(null);

    const payload = Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]));
    let res: RunResult;
    try {
      res = await runWorkflow(id, payload);
    } catch {
      res = offlineRun(id, payload);
    }

    const start = performance.now();
    for (let i = 0; i < res.steps.length; i++) {
      if (token !== runToken.current) return;
      const step = res.steps[i];
      if (i > 0) {
        const prev = res.steps[i - 1].node;
        setPacket({ from: node(prev), to: node(step.node), key: Date.now() });
        setLitEdges((e) => [...e, `${prev}-${step.node}`]);
        await sleep(520);
        if (token !== runToken.current) return;
      }
      setStates((s) => ({ ...s, [step.node]: "active" }));
      await sleep(Math.min(900, Math.max(450, step.duration_ms)));
      if (token !== runToken.current) return;
      setStates((s) => ({ ...s, [step.node]: "done" }));
      setLogs((l) => [...l, { t: `${((performance.now() - start) / 1000).toFixed(2)}s`, step }]);
    }
    setPacket(null);
    setResult(res);
    setRunning(false);
  };

  const pos = Object.fromEntries(def.nodes.map((n) => [n.id, n]));
  const height = Math.max(...def.nodes.map((n) => n.y)) + 70;

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* Inputs */}
      <form
        className="flex flex-col gap-4 rounded-[2rem] border border-line bg-ink p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!running) run();
        }}
      >
        <p className="text-[15px] leading-relaxed text-mute">{def.blurb}</p>
        {def.fields.map((f) =>
          f.type === "toggle" ? (
            <div key={f.name} className="flex items-center justify-between gap-4 rounded-2xl border border-line px-4 py-3">
              <span className="text-sm font-medium">{f.label}</span>
              <button
                type="button"
                role="switch"
                aria-label={f.label}
                aria-checked={inputs[f.name] === true}
                onClick={() => setInputs((v) => ({ ...v, [f.name]: !v[f.name] }))}
                className={`relative h-7 w-12 rounded-full transition-colors ${inputs[f.name] ? "bg-sage" : "bg-cream/15"}`}
              >
                <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`absolute top-1 h-5 w-5 rounded-full bg-ink ${inputs[f.name] ? "right-1" : "left-1"}`} />
              </button>
            </div>
          ) : (
            <label key={f.name} className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[.18em] text-mute">{f.label}</span>
              <input
                value={String(inputs[f.name] ?? "")}
                onChange={(e) => setInputs((v) => ({ ...v, [f.name]: e.target.value }))}
                placeholder={f.placeholder}
                maxLength={100}
                className="rounded-2xl border border-line bg-transparent px-4 py-3 text-[15px] placeholder:text-cream/30 focus:border-ember focus:outline-none"
              />
            </label>
          ),
        )}
        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={running} className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-ember px-6 py-4 font-semibold text-ink transition-colors hover:bg-cream disabled:cursor-wait disabled:opacity-70" data-cursor="Run">
          {running ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" /> : <Icon name="play" size={16} />}
          {running ? "Running workflow…" : result ? "Run again" : "Execute workflow"}
        </motion.button>
        <p className="font-mono text-[11px] leading-relaxed text-mute">Empty fields use the sample values shown.</p>
      </form>

      {/* Canvas + console */}
      <div className="flex min-w-0 flex-col gap-5">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink">
          <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[.16em] text-mute">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${running ? "animate-pulse bg-ember" : result ? "bg-sage" : "bg-cream/30"}`} />
              {def.title}
            </span>
            <span>{running ? "executing" : result ? (result.offline ? "finished (offline)" : "finished") : "ready"}</span>
          </div>
          <div className="overflow-x-auto [scrollbar-width:thin]" data-lenis-prevent>
            <svg viewBox={`0 0 500 ${height}`} className="h-auto w-full min-w-[520px]" role="img" aria-label={`${def.title} workflow diagram`}>
              <defs>
                <pattern id={`grid-${id}`} width="18" height="18" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#f3ece2" opacity=".1" />
                </pattern>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="500" height={height} fill={`url(#grid-${id})`} />
              {def.edges.map(([a, b]) => {
                const lit = litEdges.includes(`${a}-${b}`);
                return (
                  <g key={a + b}>
                    <line x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke="rgba(243,236,226,.15)" strokeWidth="2" strokeDasharray={pos[b].kind === "error" ? "6 5" : undefined} />
                    <motion.line x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke="#f2643a" strokeWidth="2.5" initial={false} animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} />
                  </g>
                );
              })}
              {packet && (
                <motion.circle key={packet.key} r="7" fill="#f2643a" filter="url(#glow)" initial={{ cx: packet.from.x, cy: packet.from.y }} animate={{ cx: packet.to.x, cy: packet.to.y }} transition={{ duration: 0.5, ease: "easeInOut" }} />
              )}
              {def.nodes.map((n) => {
                const st = states[n.id] ?? "idle";
                return (
                  <motion.g key={n.id} initial={false} animate={{ scale: st === "active" ? 1.1 : 1 }} style={{ originX: `${n.x}px`, originY: `${n.y}px` }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                    {st === "active" && (
                      <motion.rect x={n.x - 64} y={n.y - 30} width="128" height="60" rx="30" fill="none" stroke="#f2643a" initial={{ opacity: 0.9, scale: 1 }} animate={{ opacity: 0, scale: 1.35 }} transition={{ duration: 0.9, repeat: Infinity }} style={{ originX: `${n.x}px`, originY: `${n.y}px` }} />
                    )}
                    <rect x={n.x - 60} y={n.y - 24} width="120" height="48" rx="24" fill={st === "done" ? "#f3ece2" : "#161210"} stroke={st === "idle" ? "rgba(243,236,226,.22)" : "#f2643a"} strokeWidth="1.5" strokeDasharray={n.kind === "error" && st === "idle" ? "5 4" : undefined} />
                    <text x={n.x + 10} y={n.y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={st === "done" ? "#0d0b0a" : "#f3ece2"} fontFamily="var(--font-syne), sans-serif">
                      {n.label}
                    </text>
                    <circle cx={n.x - 40} cy={n.y} r="11" fill={st === "idle" ? "rgba(243,236,226,.08)" : "#f2643a"} />
                    {st === "done" ? (
                      <path d={`M${n.x - 45} ${n.y} l3.5 3.5 l6.5 -7`} stroke="#0d0b0a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <text x={n.x - 40} y={n.y + 3.5} textAnchor="middle" fontSize="9" fill={st === "idle" ? "#a89c8d" : "#0d0b0a"} fontFamily="var(--font-jetbrains), monospace">
                        {n.kind === "ai" ? "AI" : n.kind[0].toUpperCase()}
                      </text>
                    )}
                  </motion.g>
                );
              })}
            </svg>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-mute">
            {(["trigger", "logic", "ai", "output", "error"] as const).map((k) => (
              <li key={k} className={KIND_COLOR[k]}>
                ● {k}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="flex min-h-[220px] flex-col rounded-[2rem] border border-line bg-[#0a0908] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-mute">Execution log</p>
            <ol ref={logBox} className="mt-3 max-h-56 flex-1 space-y-2 overflow-y-auto font-mono text-[12.5px] leading-relaxed" data-lenis-prevent aria-live="polite">
              {logs.length === 0 && <li className="text-cream/30">$ waiting for a run…</li>}
              {logs.map(({ t, step }) => (
                <motion.li key={step.node} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                  <span className="shrink-0 text-cream/30">{t}</span>
                  <span>
                    <span className="text-sage">✓ {step.label}</span> <span className="text-cream/70">{step.log}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
          <Output id={id} result={result} />
        </div>
      </div>
    </div>
  );
}

function Output({ id, result }: { id: WfId; result: RunResult | null }) {
  const o = (result?.output ?? {}) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div className="flex min-h-[220px] flex-col rounded-[2rem] border border-line bg-ink p-5">
      <p className="font-mono text-[11px] uppercase tracking-[.18em] text-mute">Output</p>
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.p key="empty" exit={{ opacity: 0 }} className="mt-3 text-sm text-cream/30">
            The result appears here when the run finishes.
          </motion.p>
        ) : result.offline ? (
          <motion.p key="offline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-mute">
            {o.note}
          </motion.p>
        ) : id === "job-search" ? (
          <motion.div key="job" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex flex-col gap-3">
            <p className="text-sm text-mute">
              {o.listings_found} listings found · {o.matched} matched
            </p>
            <div className="rounded-2xl rounded-bl-sm bg-[#2b5278] p-4 text-[13.5px] leading-relaxed text-white shadow-lg">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[.16em] text-white/60">Telegram · Job Alerts bot</p>
              <p className="whitespace-pre-line">{o.telegram_preview}</p>
            </div>
          </motion.div>
        ) : o.status === "skipped" ? (
          <motion.div key="skip" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-2xl border border-dashed border-[#ff9b8a]/50 p-4 text-sm">
            <p className="font-semibold text-[#ff9b8a]">Skipped by the error lane</p>
            <p className="mt-1 text-mute">The row had no email address, so nothing was sent. It was flagged for follow-up instead.</p>
          </motion.div>
        ) : (
          <motion.div key="email" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-2xl bg-cream p-4 text-ink">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/50">Gmail · sent (simulated)</p>
            <p className="mt-1 font-semibold">{o.email?.subject}</p>
            <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-line text-[13.5px] leading-relaxed text-ink/80" data-lenis-prevent>
              {o.email?.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
