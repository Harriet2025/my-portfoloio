"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ABOUT_CARD, ABOUT_INTRO, PROFILE, STATS, STRENGTHS } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

const INK = { wine: "#7b2d43", sage: "#5f6f4d", gold: "#97743f" } as const;
const STAMP_TILT = [-7, 4, -3, 6, -5, 3];

export default function About() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-libcard]", { y: 80, rotate: 6, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: "[data-libcard]", start: "top 85%" } });
        // Each stamp slams down onto its line as the line scrolls into view.
        gsap.utils.toArray<HTMLElement>("[data-libline]").forEach((line) => {
          const stamp = line.querySelector("[data-stamp]");
          const text = line.querySelector("[data-entry]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: line, start: "top 82%", toggleActions: "play none none reverse" } });
          tl.from(stamp, { scale: 2.4, opacity: 0, rotate: "+=25", duration: 0.32, ease: "power4.in" })
            .to(line, { y: 3, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" })
            .from(text, { x: -16, opacity: 0, duration: 0.5, ease: "power2.out" }, "<");
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative overflow-x-clip pt-28 sm:pt-36">
      <div className="mx-auto grid w-full max-w-[1240px] items-start gap-14 px-5 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
        <div className="lg:sticky lg:top-32">
          <SectionLabel index="I">About me</SectionLabel>
          <h2 className="mt-8 font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] font-light leading-[1.08] tracking-[-.01em]">
            <SplitText text="Part developer," className="block" />
            <SplitText text="part automator," className="block" delay={0.1} />
            <span className="block">
              <SplitText text="part" delay={0.2} /> <SplitText text="storyteller." className="soft-italic text-wine" delay={0.25} />
            </span>
          </h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-7 max-w-[42ch] text-[17px] leading-relaxed text-ink-soft">
            {ABOUT_INTRO}
          </motion.p>
          <p className="soft-italic mt-8 hidden max-w-[34ch] border-l-2 border-rose pl-4 font-serif text-lg leading-snug text-ink/80 lg:block">
            Teaching and customer service taught me how people really work, so I build tools that take the repetitive parts away.
          </p>
        </div>

        {/* A library borrower's card: one stamped line for each thing I do */}
        <div data-libcard className="relative mx-auto w-full max-w-[640px] lg:mt-6">
          <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2deg] rounded-[6px] bg-paper-3" />
          <div className="relative rotate-[-1deg] overflow-hidden rounded-[6px] border border-[#e3d3bb] bg-[#fbf4e6] shadow-[0_40px_70px_-40px_rgba(42,32,36,.55)]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-wine/70 bg-[#f4e7d2] px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-ink-soft sm:px-7 sm:text-[11px]">
              <span>ATU Library · Borrower&apos;s card</span>
              <span>No. 0300</span>
            </div>
            <div className="flex items-end justify-between gap-4 px-5 pb-4 pt-5 sm:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-ink-soft">Name of borrower</p>
                <p className="soft-italic mt-1 font-serif text-[clamp(1.6rem,3.2vw,2.2rem)] leading-none text-ink">{PROFILE.name}</p>
              </div>
              <p className="hidden text-right text-[10px] font-semibold uppercase tracking-[.2em] text-ink-soft sm:block">
                {PROFILE.location}
                <br />
                Valid: always learning
              </p>
            </div>

            <ol>
              {ABOUT_CARD.map((row, i) => (
                <li key={row.stamp} data-libline className="border-t border-dashed border-[#d9c6a8]">
                  <button
                    type="button"
                    onClick={() => scrollToId(lenis, row.to)}
                    className="group grid w-full grid-cols-[92px_1fr_auto] items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-blush/60 sm:grid-cols-[124px_1fr_auto] sm:gap-5 sm:px-7 sm:py-4"
                  >
                    <span className="flex justify-center">
                      <span
                        data-stamp
                        className="inline-block rounded-[4px] border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[.14em] mix-blend-multiply [box-shadow:inset_0_0_0_2px_#fbf4e6,inset_0_0_0_3px_currentColor] sm:px-2.5 sm:text-[12px]"
                        style={{ color: INK[row.tone], borderColor: INK[row.tone], rotate: `${STAMP_TILT[i % STAMP_TILT.length]}deg`, opacity: 0.88 }}
                      >
                        {row.stamp}
                      </span>
                    </span>
                    <span data-entry className="block border-l border-rose/70 pl-3 sm:pl-5">
                      <span className="block font-serif text-[17px] leading-snug text-ink sm:text-[19px]">{row.title}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft sm:text-sm">{row.text}</span>
                    </span>
                    <Icon name="arrow" size={16} className="text-wine opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ol>
            <p className="border-t border-dashed border-[#d9c6a8] px-5 py-3 text-center font-mono text-[10px] uppercase tracking-[.2em] text-ink-soft/80 sm:px-7">Tap a line to open that chapter</p>
          </div>
        </div>
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
