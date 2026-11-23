import { WORKFLOWS } from "@/content/site";

/** Cover art for automation projects (no screenshot): their real node graph drawn as a poster. */
export default function ProjectArt({ workflow }: { workflow: keyof typeof WORKFLOWS }) {
  const wf = WORKFLOWS[workflow];
  const pos = Object.fromEntries(wf.nodes.map((n) => [n.id, n]));
  const maxY = Math.max(...wf.nodes.map((n) => n.y)) + 70;
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(242,100,58,.35),transparent_55%),linear-gradient(160deg,#211b18,#0d0b0a)]">
      <svg viewBox={`0 0 500 ${maxY}`} className="absolute inset-0 h-full w-full p-[8%]" aria-hidden="true">
        <defs>
          <pattern id={`dots-${workflow}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#f3ece2" opacity=".12" />
          </pattern>
        </defs>
        <rect x="-100" y="-100" width="700" height={maxY + 200} fill={`url(#dots-${workflow})`} />
        {wf.edges.map(([a, b]) => (
          <line key={a + b} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke="#f2643a" strokeWidth="2" strokeDasharray={pos[b].kind === "error" ? "6 5" : undefined} />
        ))}
        {wf.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <rect x="-56" y="-22" width="112" height="44" rx="22" fill={n.kind === "error" ? "#211b18" : "#f3ece2"} stroke="#f2643a" strokeOpacity={n.kind === "error" ? 1 : 0} />
            <text y="5" textAnchor="middle" fontSize="13" fontWeight="700" fill={n.kind === "error" ? "#f3ece2" : "#0d0b0a"} fontFamily="var(--font-syne), sans-serif">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
