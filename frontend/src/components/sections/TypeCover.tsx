import type { Project } from "@/content/site";

const TONES = {
  wine: { bg: "#7b2d43", ink: "#f7f2ea", accent: "#e9c9c2" },
  sage: { bg: "#56654a", ink: "#f7f2ea", accent: "#dfe5d3" },
  night: { bg: "#33242a", ink: "#f7f2ea", accent: "#d4a19c" },
  gold: { bg: "#8a6a3f", ink: "#fffaf0", accent: "#f2e2c4" },
};

/** A designed book cover for projects that are not live yet (no screenshot to show). */
export default function TypeCover({ project }: { project: Project }) {
  const t = TONES[project.cover?.tone ?? "wine"];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-8 text-center" style={{ background: t.bg, color: t.ink }}>
      {/* double rule frame, like a cloth-bound book */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 border" style={{ borderColor: `${t.accent}66` }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[18px] border" style={{ borderColor: `${t.accent}33` }} />

      <p className="relative text-[10px] font-semibold uppercase tracking-[.3em]" style={{ color: t.accent }}>
        {project.category}
      </p>
      <div className="relative">
        <p className="text-lg" style={{ color: t.accent }} aria-hidden="true">
          ❦
        </p>
        <p className="mt-3 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-none">{project.title}</p>
        {project.cover?.tagline && <p className="soft-italic mx-auto mt-4 max-w-[18ch] font-serif text-base leading-snug" style={{ color: t.accent }}>{project.cover.tagline}</p>}
      </div>
      <p className="relative text-[10px] font-semibold uppercase tracking-[.3em]" style={{ color: t.accent }}>
        Harriet Ayim · {project.year}
      </p>
    </div>
  );
}
