"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { SKILLS, SKILL_TABS, type SkillCategory } from "@/content/site";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

export default function Skills() {
  const [tab, setTab] = useState<"all" | SkillCategory>("all");
  const list = SKILLS.filter((s) => tab === "all" || s.category === tab);

  return (
    <section id="skills" className="relative overflow-hidden bg-ink-2 py-28 sm:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(168,198,159,.12),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="02">Skills & technologies</SectionLabel>
            <SplitText as="h2" text="Tools I build with" className="mt-6 block font-display text-[clamp(2.6rem,7vw,6rem)] font-extrabold uppercase leading-[.9] tracking-tight" />
          </div>
          <div role="tablist" aria-label="Skill category" className="flex flex-wrap gap-2">
            {SKILL_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id ? "border-transparent text-ink" : "border-line text-cream/80 hover:border-cream hover:text-cream"}`}
              >
                {tab === t.id && <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-full bg-cream" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((s, i) => (
              <motion.li
                layout
                key={s.name}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <SkillCard skill={s} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

/** Tilts toward the pointer with a spotlight; the ring indicator fills when the card scrolls into view. */
function SkillCard({ skill }: { skill: (typeof SKILLS)[number] }) {
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}% ${my}%, rgba(242,100,58,.18), transparent 65%)`;
  const [open, setOpen] = useState(false);

  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        mx.set(px * 100);
        my.set(py * 100);
        if (e.pointerType === "mouse") {
          ry.set((px - 0.5) * 14);
          rx.set((0.5 - py) * 14);
        }
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileTap={{ scale: 0.98 }}
      data-cursor={open ? "Less" : "More"}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-ink p-6 text-left transition-colors duration-300 hover:border-ember/60"
    >
      <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />

      <div className="relative flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream/5 text-ember transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
          <Icon name={skill.icon} size={24} />
        </span>
        <span className="relative grid h-16 w-16 place-items-center">
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(243,236,226,.1)" strokeWidth="4" />
            <motion.circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="var(--color-ember)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              whileInView={{ strokeDashoffset: C * (1 - skill.level / 100) }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </svg>
          <span className="font-mono text-xs font-medium tabular-nums" aria-label={`${skill.level} percent`}>
            {skill.level}%
          </span>
        </span>
      </div>

      <h3 className="relative mt-8 font-display text-2xl font-bold">{skill.name}</h3>
      <p className="relative mt-2 text-[15px] leading-relaxed text-mute">{skill.text}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative flex flex-wrap gap-1.5 overflow-hidden">
            {skill.tools.map((t, i) => (
              <motion.li key={t} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i }} className="mt-4 rounded-full border border-line px-3 py-1 font-mono text-xs">
                {t}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <span className="relative mt-auto flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[.18em] text-mute">
        <span className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span> {open ? "Hide tools" : "Show tools"}
      </span>
    </motion.button>
  );
}
