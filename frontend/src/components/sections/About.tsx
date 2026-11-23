"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ABOUT_TEXT, STATS, STRENGTHS } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";

/* Words that turn wine-coloured italic as they are revealed. */
const HIGHLIGHT = new Set(["full-stack", "AI-powered", "automations.", "people", "human"]);

export default function About() {
  const root = useRef<HTMLElement>(null);
  const words = ABOUT_TEXT.split(" ");
  const [first, ...rest] = words;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        gsap.fromTo("[data-word]", { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-reveal]", start: "top 22%", end: "+=110%", scrub: 0.6, pin: true } });
      });
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.fromTo("[data-word]", { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-reveal]", start: "top 80%", end: "bottom 45%", scrub: 0.6 } });
      });
      mm.add(MOTION_OK, () => {
        gsap.from("[data-dropcap]", { scale: 0.6, opacity: 0, rotate: -8, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: "[data-reveal]", start: "top 75%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative pt-28 sm:pt-36">
      <div data-reveal className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
        <SectionLabel index="I">About me</SectionLabel>
        <p className="mt-10 font-serif text-[clamp(1.6rem,3.4vw,3rem)] font-light leading-[1.3] tracking-[-.01em]">
          <span data-dropcap className="soft-italic float-left mr-4 mt-1 font-serif text-[clamp(4.5rem,9vw,8rem)] leading-[.8] text-wine" aria-hidden="true">
            {first[0]}
          </span>
          <span data-word className="inline-block pr-[0.25em]">
            <span className="sr-only">{first[0]}</span>
            {first.slice(1)}
          </span>
          {rest.map((w, i) => (
            <span key={i} data-word className={`inline-block pr-[0.25em] ${HIGHLIGHT.has(w) ? "soft-italic text-wine" : ""}`}>
              {w}
            </span>
          ))}
        </p>
      </div>

      <div className="mx-auto mt-24 w-full max-w-[1240px] px-5 sm:mt-28 sm:px-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.li key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} className="relative pl-5">
              <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-px bg-gold/50" />
              <p className="font-serif text-[clamp(2.8rem,5.5vw,4.4rem)] font-light leading-none text-wine">
                <Counter to={s.value} />
                <span className="soft-italic">{s.suffix}</span>
              </p>
              <p className="mt-3 max-w-[22ch] text-sm leading-snug text-ink-soft">{s.label}</p>
            </motion.li>
          ))}
        </ul>

        <div className="grid gap-10 py-24 sm:py-32 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[.2em] text-ink-soft">How I work</p>
            <p className="mt-5 max-w-[16ch] font-serif text-[clamp(2rem,3.6vw,3rem)] font-light leading-[1.1]">
              Practical, organised and <span className="soft-italic text-wine">always shipping.</span>
            </p>
          </div>
          <ul className="border-t border-line">
            {STRENGTHS.map((s, i) => (
              <motion.li key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, delay: i * 0.08 }} className="group relative grid gap-2 overflow-hidden border-b border-line px-2 py-6 sm:grid-cols-[auto_1fr_1.5fr] sm:items-baseline sm:gap-8">
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-blush/70 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
                <span className="soft-italic relative font-serif text-lg text-gold">{["i", "ii", "iii", "iv"][i]}.</span>
                <h3 className="relative font-serif text-2xl transition-transform duration-500 group-hover:translate-x-2">{s.title}</h3>
                <p className="relative text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
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
