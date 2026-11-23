/** Book-style chapter label: "Chapter II — Skills". */
export default function SectionLabel({ index, children, className = "", tone = "light" }: { index: string; children: React.ReactNode; className?: string; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-paper/60" : "text-ink-soft";
  return (
    <p className={`flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[.2em] ${muted} ${className}`}>
      <span className={`soft-italic font-serif text-lg normal-case tracking-normal ${tone === "dark" ? "text-rose" : "text-wine"}`}>Chapter {index}</span>
      <span className={`h-px w-10 ${tone === "dark" ? "bg-paper/20" : "bg-gold/60"}`} aria-hidden="true" />
      {children}
    </p>
  );
}
