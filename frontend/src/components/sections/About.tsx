"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ABOUT_ROLES, ABOUT_TEXT, STATS, STRENGTHS } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

const TONE = { wine: "bg-wine", sage: "bg-sage", night: "bg-night-2" } as const;
const HIGHLIGHT = "linear-gradient(transparent 58%, rgba(212,161,156,.6) 58%, rgba(212,161,156,.6) 92%, transparent 92%)";

export default function About() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  // "[phrase]" in the text becomes a highlighted phrase
  const parts = ABOUT_TEXT.split(/\[(.+?)\]/);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // A highlighter pen sweeps across each key phrase.
        gsap.utils.toArray<HTMLElement>("[data-hl]").forEach((el, i) => {
          gsap.fromTo(el, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.9, delay: i * 0.25, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 82%" } });
        });
        // The arches rise into view like the portrait at the top of the page.
        gsap.fromTo("[data-arch]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: 0.18, ease: "expo.out", scrollTrigger: { trigger: "[data-arches]", start: "top 82%" } });
        gsap.from("[data-arch-inner]", { y: 40, opacity: 0, duration: 1, stagger: 0.18, delay: 0.35, ease: "power3.out", scrollTrigger: { trigger: "[data-arches]", start: "top 82%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative overflow-x-clip pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionLabel index="I">About me</SectionLabel>
            <h2 className="mt-8 font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] font-light leading-[1.08] tracking-[-.01em]">
              <SplitText text="Part developer," className="block" />
              <SplitText text="part automator," className="block" delay={0.1} />
              <span className="block">
                <SplitText text="part" delay={0.2} /> <SplitText text="storyteller." className="soft-italic text-wine" delay={0.25} />
              </span>
            </h2>
          </div>
          <p className="max-w-[48ch] text-[18px] font-medium leading-[1.75] text-ink/85 sm:text-[19px] lg:pb-2">
            {parts.map((part, i) =>
              i % 2 ? (
                <span key={i} data-hl className="font-semibold text-ink" style={{ backgroundImage: HIGHLIGHT, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        </div>

        {/* Three arches, one for each side of my work. Swipe sideways on phones. */}
        <ul data-arches className="-mx-5 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 lg:mt-20 lg:gap-8">
          {ABOUT_ROLES.map((r) => (
            <li key={r.title} className="w-[78%] shrink-0 snap-center sm:w-[46%] md:w-auto">
              <button type="button" onClick={() => scrollToId(lenis, r.to)} className="group block h-full w-full text-left" aria-label={`${r.title}: ${r.text} Open this chapter.`}>
                <div data-arch className="relative h-full overflow-hidden rounded-t-[999px] border border-paper-3 bg-[#fffdf8] shadow-[0_30px_60px_-36px_rgba(42,32,36,.5)]">
                  {/* colour rises from the floor on hover */}
                  <span aria-hidden="true" className={`absolute inset-0 translate-y-full ${TONE[r.tone]} transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0`} />
                  <div data-arch-inner className="relative flex h-full min-h-[380px] flex-col items-center px-6 pb-7 pt-16 text-center sm:min-h-[420px] lg:min-h-[460px] lg:px-8 lg:pt-20">
                    <span className="soft-italic font-serif text-xl text-gold transition-colors duration-500 group-hover:text-paper/70">{r.numeral}.</span>
                    <span className={`mt-4 grid h-14 w-14 place-items-center rounded-full ${TONE[r.tone]} text-paper transition-colors duration-500 group-hover:bg-paper group-hover:text-ink`}>
                      <Icon name={r.icon} size={22} />
                    </span>
                    <h3 className="mt-6 font-serif text-[clamp(1.8rem,2.6vw,2.3rem)] font-light leading-none text-ink transition-colors duration-500 group-hover:text-paper">
                      {r.title.split(" ")[0]} <span className="soft-italic text-wine transition-colors duration-500 group-hover:text-rose">{r.title.split(" ").slice(1).join(" ")}</span>
                    </h3>
                    <p className="mt-4 max-w-[26ch] text-[15px] font-medium leading-relaxed text-ink/75 transition-colors duration-500 group-hover:text-paper/90">{r.text}</p>
                    <ul className="mt-auto flex flex-wrap justify-center gap-1.5 pt-6">
                      {r.tags.map((t) => (
                        <li key={t} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink/70 transition-colors duration-500 group-hover:border-paper/30 group-hover:text-paper">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-wine transition-colors duration-500 group-hover:text-paper">
                      See it <Icon name="arrow" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
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
