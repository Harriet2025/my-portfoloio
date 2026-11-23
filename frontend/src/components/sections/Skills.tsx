"use client";

import { animate, AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SKILLS, SKILL_TABS, type SkillCategory } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

/* Every tool mentioned in the skills, split across two moving rows. */
const TOOLS = Array.from(new Set(SKILLS.flatMap((s) => s.tools)));
const ROW_A = TOOLS.filter((_, i) => i % 2 === 0);
const ROW_B = TOOLS.filter((_, i) => i % 2 === 1);

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"all" | SkillCategory>("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = SKILLS.filter((s) => tab === "all" || s.category === tab);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Two rows of tools glide in opposite directions; scrolling speeds them up.
        const loops = gsap.utils.toArray<HTMLElement>("[data-tools]").map((row, i) => {
          const loop = gsap.fromTo(row, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 38, ease: "none", repeat: -1 });
          return loop;
        });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const boost = Math.min(5, 1 + Math.abs(self.getVelocity()) / 400);
            loops.forEach((l) => {
              gsap.to(l, { timeScale: boost, duration: 0.2, overwrite: true });
              gsap.to(l, { timeScale: 1, duration: 1.2, delay: 0.2 });
            });
          },
        });
        // The tool rows tilt in as the section arrives.
        gsap.fromTo("[data-toolband]", { rotate: -4, scale: 1.05 }, { rotate: 0, scale: 1, ease: "none", scrollTrigger: { trigger: "[data-toolband]", start: "top bottom", end: "center 55%", scrub: true } });
        return () => {
          loops.forEach((l) => l.kill());
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className="relative overflow-x-clip bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <SectionLabel index="II">Skills & technologies</SectionLabel>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
            <SplitText text="What's in my" /> <SplitText text="toolkit" className="soft-italic text-wine" delay={0.1} />
          </h2>
          <p className="max-w-[40ch] text-[15px] font-medium text-ink/70">The tools I reach for every day, and how confident I am with each one. Tap a skill to see more.</p>
        </div>
      </div>

      {/* Moving tool rows */}
      <div data-toolband aria-label="Tools I use" className="mt-14 space-y-3 sm:space-y-4">
        {[ROW_A, ROW_B].map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            <div data-tools className="flex w-max shrink-0">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
                  {[...row, ...row].map((t, i) => (
                    <li key={`${t}-${i}`} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-semibold sm:px-6 sm:py-3 sm:text-base ${(i + r) % 4 === 0 ? "bg-wine text-paper" : (i + r) % 4 === 2 ? "bg-ink text-paper" : "border border-ink/15 bg-[#fffdf8] text-ink"}`}>
                      <span className="mr-2 text-gold">✦</span>
                      {t}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1240px] px-5 sm:px-8">
        <div role="tablist" aria-label="Skill category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {SKILL_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                setOpen(null);
              }}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === t.id ? "text-paper" : "text-ink/70 hover:text-ink"}`}
            >
              {tab === t.id && <motion.span layoutId="skilltab" className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <motion.ul layout className="mt-8 grid gap-3 lg:grid-cols-2 lg:gap-x-6">
          <AnimatePresence mode="popLayout">
            {list.map((s, i) => (
              <motion.li
                layout
                key={s.name}
                initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <SkillRow skill={s} open={open === s.name} onToggle={() => setOpen((o) => (o === s.name ? null : s.name))} replay={tab} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function SkillRow({ skill: s, open, onToggle, replay }: { skill: (typeof SKILLS)[number]; open: boolean; onToggle: () => void; replay: string }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      whileHover={{ y: -3 }}
      className={`group block w-full rounded-2xl border p-4 text-left transition-colors duration-300 sm:p-5 ${open ? "border-wine bg-wine text-paper" : "border-paper-3 bg-[#fffdf8] hover:border-wine/40"}`}
    >
      <span className="flex items-center gap-4">
        <Ring level={s.level} icon={s.icon} open={open} replay={replay} />
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[20px] leading-tight sm:text-[22px]">{s.name}</span>
          <span className={`mt-0.5 block truncate text-[13px] font-medium ${open ? "text-paper/75" : "text-ink/60"}`}>{s.tools.join(" · ")}</span>
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg leading-none ${open ? "bg-paper text-wine" : "bg-paper-2 text-ink group-hover:bg-wine group-hover:text-paper"}`}>
          +
        </motion.span>
      </span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="block overflow-hidden">
            <span className="block pt-4 text-[15px] font-medium leading-relaxed text-paper/90">{s.text}</span>
            <span className="mt-3 flex flex-wrap gap-2">
              {s.tools.map((t, i) => (
                <motion.span key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-full bg-paper/15 px-3 py-1 text-xs font-semibold">
                  {t}
                </motion.span>
              ))}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/** A ring that fills to the skill level, with the percentage counting up beside the icon. */
function Ring({ level, icon, open, replay }: { level: number; icon: string; open: boolean; replay: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, level, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, level, replay]);
  const R = 24;
  const C = 2 * Math.PI * R;
  return (
    <span ref={ref} className="relative grid h-[60px] w-[60px] shrink-0 place-items-center" aria-label={`${level} percent`}>
      <svg viewBox="0 0 60 60" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="30" cy="30" r={R} fill="none" strokeWidth="4" className={open ? "stroke-paper/20" : "stroke-paper-3"} />
        <circle cx="30" cy="30" r={R} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - val / 100)} className={open ? "stroke-paper" : "stroke-wine"} />
      </svg>
      <span className="flex flex-col items-center leading-none">
        <Icon name={icon} size={15} className={open ? "text-paper" : "text-wine"} />
        <span className="mt-1 text-[11px] font-bold tabular-nums">{val}%</span>
      </span>
    </span>
  );
}
