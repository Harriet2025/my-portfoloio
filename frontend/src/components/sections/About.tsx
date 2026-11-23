"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ABOUT_TEXT, STATS, STRENGTHS } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";

/* Words that get the accent colour once revealed. */
const HIGHLIGHT = new Set(["full-stack", "AI-powered", "automations.", "people", "human"]);

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the paragraph and light words up one by one as you scroll.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-reveal]", start: "top 20%", end: "+=120%", scrub: 0.6, pin: true } },
        );
      });
      // Phones: same reveal without pinning.
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.fromTo("[data-word]", { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-reveal]", start: "top 80%", end: "bottom 45%", scrub: 0.6 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative bg-ink pt-28 sm:pt-40">
      <div data-reveal className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <SectionLabel index="01">About me</SectionLabel>
        <p className="mt-8 font-display text-[clamp(1.7rem,4.2vw,3.9rem)] font-bold leading-[1.12] tracking-tight">
          {ABOUT_TEXT.split(" ").map((w, i) => (
            <span key={i} data-word className={`inline-block pr-[0.25em] ${HIGHLIGHT.has(w) ? "text-ember" : ""}`}>
              {w}
            </span>
          ))}
        </p>
      </div>

      <div className="mx-auto mt-24 w-full max-w-[1280px] px-5 sm:mt-32 sm:px-8">
        <ul className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-line py-8 pr-4 even:pl-4 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="font-display text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-none tracking-tight">
                <Counter to={s.value} />
                <span className="text-ember">{s.suffix}</span>
              </p>
              <p className="mt-3 max-w-[22ch] text-sm leading-snug text-mute">{s.label}</p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-24 grid gap-10 pb-28 sm:pb-40 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionLabel index="—">How I work</SectionLabel>
            <p className="mt-6 max-w-[28ch] font-display text-3xl font-bold leading-tight">Practical, organised and always shipping.</p>
          </div>
          <ul className="border-t border-line">
            {STRENGTHS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group relative grid gap-2 overflow-hidden border-b border-line py-6 sm:grid-cols-[auto_1fr_1.4fr] sm:items-baseline sm:gap-8"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100" />
                <span className="relative font-mono text-xs text-ember transition-colors group-hover:text-ink">0{i + 1}</span>
                <h3 className="relative font-display text-2xl font-bold transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-ink">{s.title}</h3>
                <p className="relative text-[15px] leading-relaxed text-mute transition-colors group-hover:text-ink">{s.text}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val}
    </span>
  );
}
