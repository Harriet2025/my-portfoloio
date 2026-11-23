"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO_WORDS, PROFILE } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { usePageTransition } from "@/components/providers/Transition";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

const EASE = [0.22, 1, 0.36, 1] as const;
const RING = "Developer ✦ AI automation ✦ Content creator ✦ Accra ✦ ";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = usePageTransition();
  const lenis = useLenis();
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setWord((w) => (w + 1) % HERO_WORDS.length), 2600);
    return () => clearInterval(t);
  }, [ready]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.fromTo("[data-photo]", { scale: 1.18 }, { scale: 1, yPercent: 8, ease: "none", scrollTrigger: st });
        gsap.to("[data-arch-outline]", { y: -70, x: 24, ease: "none", scrollTrigger: st });
        gsap.to("[data-ring]", { rotate: 300, ease: "none", scrollTrigger: st });
        gsap.to("[data-note]", { y: -140, rotate: -8, ease: "none", scrollTrigger: st });
        gsap.to("[data-copy]", { y: 90, opacity: 0.2, ease: "none", scrollTrigger: { ...st, end: "75% top" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const show = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, delay, ease: EASE } });

  return (
    <section ref={root} id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      {/* soft blush and sage washes */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-blush/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-60 bottom-0 h-[30rem] w-[30rem] rounded-full bg-sage-soft/60 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-14 px-5 pb-20 sm:px-8 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
        {/* Words */}
        <div data-copy className="order-2 lg:order-1">
          <motion.p {...show(0)} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold uppercase tracking-[.18em] text-ink-soft">
            <span>{PROFILE.role}</span>
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            <span className="flex items-center gap-1.5">
              <Icon name="pin" size={13} /> {PROFILE.location}
            </span>
          </motion.p>

          <h1 className="mt-7 font-serif text-[clamp(2.5rem,4.6vw,4.5rem)] font-light leading-[1.06] tracking-[-.02em] text-ink">
            <SplitText text="Hi, I'm" play={ready} stagger={0.07} />{" "}
            <SplitText text="Harriet." play={ready} delay={0.15} className="soft-italic text-wine" />
            <br />
            <SplitText text="I build" play={ready} delay={0.3} />{" "}
            <span className="relative inline-flex overflow-hidden pb-[0.08em] align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={HERO_WORDS[word]}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={ready ? { y: "0%", opacity: 1 } : {}}
                  exit={{ y: "-105%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: word === 0 ? 0.55 : 0 }}
                  className="soft-italic inline-block whitespace-nowrap text-wine"
                >
                  {HERO_WORDS[word]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <SplitText text="that keep work beautifully organised." play={ready} delay={0.5} stagger={0.05} />
          </h1>

          <motion.p {...show(0.9)} className="mt-8 max-w-[48ch] text-[17px] leading-relaxed text-ink-soft">
            I&apos;m a Computer Science student at Accra Technical University. I design full-stack web applications and n8n AI workflows, and I care about the small details that make software feel calm to use.
          </motion.p>

          <motion.div {...show(1.05)} className="mt-9 flex flex-wrap items-center gap-3">
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => scrollToId(lenis, "work")} className="group inline-flex items-center gap-3 rounded-full bg-wine px-7 py-3.5 font-semibold text-paper shadow-[0_10px_30px_-12px_rgba(123,45,67,.6)] transition-colors hover:bg-ink">
              Browse my work
              <Icon name="arrow" size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} href={PROFILE.cv} download className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 font-semibold transition-colors hover:border-wine hover:text-wine">
              <Icon name="download" size={17} /> Download CV
            </motion.a>
          </motion.div>

          <motion.ul {...show(1.2)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            {PROFILE.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 transition-colors hover:text-wine">
                  <Icon name={s.icon} size={16} /> {s.label}
                  <Icon name="up" size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Portrait in an arch */}
        <div className="relative order-1 mx-auto w-full max-w-[400px] sm:max-w-[460px] lg:order-2 lg:max-w-none">
          <div data-arch-outline aria-hidden="true" className="absolute inset-0 translate-x-5 translate-y-5 rounded-t-full border border-gold/70" />
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" }}
            animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-paper-3 shadow-[0_40px_80px_-40px_rgba(42,32,36,.45)]"
          >
            <div data-photo className="absolute inset-0">
              <Image src={PROFILE.headshot} alt={`Portrait of ${PROFILE.name}`} fill priority sizes="(min-width:1024px) 520px, 90vw" className="object-cover object-[50%_22%]" />
            </div>
          </motion.div>

          {/* Rotating ring of words */}
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1, delay: 1, ease: EASE }} className="absolute -bottom-10 -left-4 h-32 w-32 sm:-left-12 sm:h-40 sm:w-40">
            <div className="absolute inset-0 rounded-full bg-paper shadow-[0_12px_30px_-14px_rgba(42,32,36,.4)]" />
            <svg data-ring viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <path id="ring-path" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
              </defs>
              <text fontSize="16.5" letterSpacing="2.4" fill="#2a2024" fontFamily="var(--font-fraunces), serif" fontStyle="italic">
                <textPath href="#ring-path">{RING}</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center">
              <span className="soft-italic grid h-12 w-12 place-items-center rounded-full bg-wine font-serif text-lg text-paper sm:h-14 sm:w-14">HA</span>
            </span>
          </motion.div>

          {/* Little note card */}
          <motion.div data-note initial={{ opacity: 0, y: 30, rotate: 0 }} animate={ready ? { opacity: 1, y: 0, rotate: -4 } : {}} transition={{ duration: 1, delay: 1.2, ease: EASE }} className="absolute -right-2 top-[12%] w-44 rounded-xl border border-line bg-paper/95 p-4 shadow-[0_18px_40px_-20px_rgba(42,32,36,.45)] backdrop-blur sm:-right-8 sm:w-56">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-sage">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-sage/60" />
                <span className="relative h-2 w-2 rounded-full bg-sage" />
              </span>
              Currently
            </p>
            <p className="mt-2 font-serif text-[16px] leading-snug sm:text-[17px]">Open to internships, freelance builds &amp; automation projects.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
