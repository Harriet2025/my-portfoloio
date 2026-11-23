import type { Project } from "@/content/site";

const TONES = {
  wine: { bg: "#7b2d43", ink: "#f7f2ea", accent: "#e9c9c2" },
  sage: { bg: "#56654a", ink: "#f7f2ea", accent: "#dfe5d3" },
  night: { bg: "#33242a", ink: "#f7f2ea", accent: "#d4a19c" },
  gold: { bg: "#8a6a3f", ink: "#fffaf0", accent: "#f2e2c4" },
};

/**
 * A designed book cover for projects with no screenshot (not live yet).
 * Text sizes use container units, so the cover reads well on a small shelf book and on a wide case-study banner.
 */
export default function TypeCover({ project }: { project: Project }) {
  const t = TONES[project.cover?.tone ?? "wine"];
  const inProgress = project.status === "in-progress";
  return (
    <div className="@container absolute inset-0" style={{ background: t.bg, color: t.ink }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-[4cqw] border" style={{ borderColor: `${t.accent}66` }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[6cqw] border" style={{ borderColor: `${t.accent}33` }} />

      <div className="relative flex h-full flex-col items-center justify-between px-[10cqw] py-[11cqw] text-center">
        {inProgress ? (
          <span className="flex items-center gap-[1.5cqw] rounded-full bg-paper px-[3.5cqw] py-[1.2cqw] text-[clamp(9px,3.6cqw,13px)] font-semibold uppercase tracking-[.14em] text-wine">
            <span className="h-[1.6cqw] max-h-2 min-h-1.5 w-[1.6cqw] min-w-1.5 max-w-2 animate-pulse rounded-full bg-gold" /> In progress
          </span>
        ) : (
          <span className="text-[clamp(9px,3.4cqw,13px)] font-semibold uppercase tracking-[.25em]" style={{ color: t.accent }}>
            {project.category}
          </span>
        )}

        <div>
          <p className="text-[clamp(14px,6cqw,26px)]" style={{ color: t.accent }} aria-hidden="true">
            ❦
          </p>
          <p className="mt-[2cqw] font-serif text-[clamp(22px,13cqw,64px)] font-light leading-none">{project.title}</p>
          {project.cover?.tagline && (
            <p className="soft-italic mx-auto mt-[3cqw] max-w-[22ch] font-serif text-[clamp(12px,6cqw,26px)] leading-snug" style={{ color: t.accent }}>
              {project.cover.tagline}
            </p>
          )}
        </div>

        <span className="text-[clamp(9px,3.2cqw,13px)] font-semibold uppercase tracking-[.25em]" style={{ color: t.accent }}>
          {inProgress ? project.category : `Harriet Ayim · ${project.year}`}
        </span>
      </div>
    </div>
  );
}
