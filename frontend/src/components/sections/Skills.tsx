"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SKILLS, SKILL_TABS, type SkillCategory } from "@/content/site";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

/* Library call numbers (Dewey-style) for each shelf. */
const CALL: Record<SkillCategory, string> = { frontend: "006.7", backend: "005.74", automation: "006.3", devops: "004.6" };
const TILT = [-1.6, 1.1, -0.6, 1.5, -1.2, 0.7, -1.4, 1.3, -0.8];

export default function Skills() {
  const [tab, setTab] = useState<"all" | SkillCategory>("all");
  const list = SKILLS.filter((s) => tab === "all" || s.category === tab);

  return (
    <section id="skills" className="relative bg-paper-2 py-28 sm:py-36">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="II">Skills & technologies</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
              <SplitText text="The card" /> <SplitText text="catalogue" className="soft-italic text-wine" delay={0.1} />
            </h2>
            <p className="mt-4 max-w-[46ch] text-ink-soft">Every skill is filed like a library card. Tap a card to turn it over and see the tools I use.</p>
          </div>

          {/* Drawer labels */}
          <div role="tablist" aria-label="Skill category" className="flex flex-wrap gap-2">
            {SKILL_TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`relative rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id ? "border-transparent text-paper" : "border-gold/50 bg-paper text-ink-soft hover:text-ink"}`}>
                {tab === t.id && <motion.span layoutId="drawer" className="absolute inset-0 rounded-md bg-ink" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((s, i) => (
              <motion.li
                layout
                key={s.name}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: TILT[SKILLS.indexOf(s) % TILT.length] }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                whileHover={{ rotate: 0, y: -6 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="[perspective:1200px]"
              >
                <IndexCard skill={s} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function IndexCard({ skill }: { skill: (typeof SKILLS)[number] }) {
  const [flipped, setFlipped] = useState(false);
  const face = "absolute inset-0 flex flex-col rounded-lg border border-paper-3 bg-[#fffdf8] p-6 shadow-[0_18px_40px_-24px_rgba(42,32,36,.45)] [backface-visibility:hidden]";

  return (
    <motion.button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${skill.name}: ${flipped ? "hide" : "show"} tools`}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative block h-[260px] w-full text-left [transform-style:preserve-3d]"
    >
      {/* Front */}
      <span className={face}>
        <span aria-hidden="true" className="absolute inset-x-0 top-[52px] h-px bg-wine/50" />
        <span className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-ink-soft">
            {CALL[skill.category]} · {skill.category}
          </span>
          <Icon name={skill.icon} size={20} className="text-wine" />
        </span>
        <span className="mt-7 font-serif text-[26px] leading-tight">{skill.name}</span>
        <span className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{skill.text}</span>

        {/* Ink-bar indicator */}
        <span className="mt-auto flex items-center gap-3 pt-4">
          <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
            <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose to-wine" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} />
          </span>
          <span className="soft-italic font-serif text-lg tabular-nums text-wine" aria-label={`${skill.level} percent`}>
            {skill.level}%
          </span>
        </span>
        <span aria-hidden="true" className="absolute bottom-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-paper-3 bg-paper-2" />
      </span>

      {/* Back */}
      <span className={`${face} ruled [transform:rotateY(180deg)]`}>
        <span className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-soft">Borrowed for this skill</span>
        <span className="mt-5 flex flex-wrap gap-2">
          {skill.tools.map((t, i) => (
            <span key={t} className="rounded border-2 border-wine/70 px-2.5 py-1 font-mono text-xs uppercase text-wine" style={{ transform: `rotate(${(i % 3) - 1}deg)` }}>
              {t}
            </span>
          ))}
        </span>
        <span className="soft-italic mt-auto font-serif text-sm text-ink-soft">Tap again to turn back</span>
      </span>
    </motion.button>
  );
}
