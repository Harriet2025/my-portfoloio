"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO_WORDS, PROFILE } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { usePageTransition } from "@/components/providers/Transition";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import Icon from "@/components/ui/Icon";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Decorative objects that drift at different speeds while scrolling (data-speed). */
const FLOATERS = [
  { text: "<php/>", className: "left-[6%] top-[22%]", speed: -0.6 },
  { text: "n8n", className: "right-[8%] top-[16%]", speed: 0.5 },
  { text: "MySQL", className: "left-[52%] top-[13%]", speed: -0.9 },
  { text: "{ AI }", className: "right-[34%] top-[30%]", speed: 1.1 },
  { text: "webhook()", className: "left-[26%] top-[15%]", speed: 0.7 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = usePageTransition();
  const lenis = useLenis();
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setWord((w) => (w + 1) % HERO_WORDS.length), 2400);
    return () => clearInterval(t);
  }, [ready]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const trigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-line='1']", { xPercent: -18, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-line='2']", { xPercent: 14, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-portrait]", { yPercent: 22, rotate: -6, scale: 0.92, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-hero-fade]", { opacity: 0, y: -60, ease: "none", scrollTrigger: { ...trigger, end: "60% top" } });
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          gsap.to(el, { y: () => Number(el.dataset.speed) * -window.innerHeight * 0.5, rotate: Number(el.dataset.speed) * 25, ease: "none", scrollTrigger: trigger });
        });
        gsap.to("[data-orb]", { scale: 1.6, opacity: 0.25, ease: "none", scrollTrigger: trigger });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28">
      {/* Glow + grid backdrop */}
      <div data-orb aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-[10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(242,100,58,.28),transparent_60%)] blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(243,236,226,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(243,236,226,.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {FLOATERS.map((f, i) => (
        <motion.span
          key={f.text}
          data-speed={f.speed}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1 + i * 0.1, duration: 0.8, ease: EASE }}
          className={`pointer-events-none absolute hidden rounded-full border border-line bg-ink-2/60 px-4 py-2 font-mono text-xs text-mute backdrop-blur md:block ${f.className}`}
        >
          {f.text}
        </motion.span>
      ))}

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-5 sm:px-8">
        <div data-hero-fade className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[.2em] text-mute">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            {PROFILE.role}
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="flex items-center gap-2">
            <Icon name="pin" size={14} /> {PROFILE.location}
          </motion.span>
        </div>

        <div className="relative mt-8 sm:mt-10">
          <h1 className="sr-only">
            {PROFILE.name}, {PROFILE.role}
          </h1>
          <div aria-hidden="true" className="font-display font-extrabold uppercase leading-[.82] tracking-[-.04em]">
            <div data-line="1" className="text-[clamp(2.6rem,10.5vw,11.5rem)]">
              <SplitText text="Harriet" by="char" stagger={0.045} play={ready} />
            </div>
            <div data-line="2" className="flex items-end gap-3 text-[clamp(2.6rem,10.5vw,11.5rem)] sm:pl-[14%]">
              <SplitText text="Ayim" by="char" stagger={0.06} delay={0.25} play={ready} className="text-outline" />
              <motion.span initial={{ scale: 0 }} animate={ready ? { scale: 1 } : {}} transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 12 }} className="mb-[0.12em] inline-block h-[0.18em] w-[0.18em] shrink-0 rounded-full bg-ember" />
              {/* Portrait sits in the empty space after "Ayim" */}
              <motion.div
                data-portrait
                initial={{ clipPath: "inset(100% 0 0 0 round 999px)", rotate: 8 }}
                animate={ready ? { clipPath: "inset(0% 0 0 0 round 999px)", rotate: 4 } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                className="relative ml-auto aspect-[3/4] w-[clamp(60px,9vw,150px)] shrink-0 self-end overflow-hidden rounded-full border border-line"
              >
                <Image src={PROFILE.headshot} alt={`Portrait of ${PROFILE.name}`} fill priority sizes="220px" className="object-cover object-[50%_20%]" />
              </motion.div>
            </div>
          </div>
        </div>

        <div data-hero-fade className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.2fr_1fr] md:items-end">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.8, ease: EASE }} className="max-w-[34ch] font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium leading-tight">
            I build{" "}
            <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom text-ember">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={HERO_WORDS[word]} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.6, ease: EASE }} className="inline-block whitespace-nowrap">
                  {HERO_WORDS[word]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            that keep businesses organised and growing.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1, duration: 0.8, ease: EASE }} className="flex flex-wrap items-center gap-3 md:justify-end">
            <Magnetic>
              <button type="button" onClick={() => scrollToId(lenis, "work")} className="group inline-flex items-center gap-3 rounded-full bg-ember px-7 py-4 font-semibold text-ink transition-colors hover:bg-cream">
                See my work
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <Icon name="arrow" size={15} />
                </span>
              </button>
            </Magnetic>
            <Magnetic>
              <a href={PROFILE.cv} download className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-4 font-semibold transition-colors hover:border-cream">
                <Icon name="download" size={17} /> Download CV
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.4 }} data-hero-fade className="relative mx-auto mb-8 mt-10 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[.3em] text-mute">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ember" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}
