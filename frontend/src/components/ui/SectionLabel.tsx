export default function SectionLabel({ index, children, className = "" }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[.22em] text-mute ${className}`}>
      <span className="text-ember">{index}</span>
      <span className="h-px w-10 bg-line" aria-hidden="true" />
      {children}
    </p>
  );
}
