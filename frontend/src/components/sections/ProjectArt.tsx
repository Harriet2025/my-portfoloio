import { WORKFLOWS } from "@/content/site";

/** Cover art for automation projects (no screenshot): their real node graph, drawn like a botanical plate. */
export default function ProjectArt({ workflow }: { workflow: keyof typeof WORKFLOWS }) {
  const wf = WORKFLOWS[workflow];
  const pos = Object.fromEntries(wf.nodes.map((n) => [n.id, n]));
  const maxY = Math.max(...wf.nodes.map((n) => n.y)) + 70;
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(212,161,156,.35),transparent_55%),linear-gradient(160deg,#33242a,#261a1f)]">
      <svg viewBox={`0 0 500 ${maxY}`} className="absolute inset-0 h-full w-full p-[10%]" aria-hidden="true" preserveAspectRatio="xMidYMin meet">
        {wf.edges.map(([a, b]) => (
          <line key={a + b} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke="#d4a19c" strokeWidth="2" strokeDasharray={pos[b].kind === "error" ? "6 5" : undefined} />
        ))}
        {wf.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <rect x="-58" y="-22" width="116" height="44" rx="22" fill={n.kind === "error" ? "#33242a" : "#f7f2ea"} stroke="#d4a19c" strokeOpacity={n.kind === "error" ? 1 : 0} />
            <text y="5" textAnchor="middle" fontSize="14" fill={n.kind === "error" ? "#f7f2ea" : "#2a2024"} fontFamily="var(--font-fraunces), serif">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
