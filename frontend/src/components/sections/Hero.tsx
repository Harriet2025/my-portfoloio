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
import { SOCIAL_BG, SocialMark } from "@/components/ui/Logo";

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

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-12 px-5 pb-20 sm:px-8 md:grid-cols-[1.3fr_.7fr] md:gap-8 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[1.1fr_.9fr]">
        {/* Words */}
        <div data-copy className="order-2 md:order-1">
          <motion.p {...show(0)} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold uppercase tracking-[.18em] text-ink/80 sm:text-[13px]">
            <span>{PROFILE.role}</span>
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            {/* A live location pin: it bobs while a signal ring pulses underneath */}
            <span className="flex items-center gap-2">
              <span className="relative grid h-5 w-5 place-items-center" aria-hidden="true">
                <span className="absolute bottom-0 h-1.5 w-3 rounded-[50%] bg-wine/30" />
                <span className="absolute bottom-[-2px] h-3 w-5 animate-ping rounded-[50%] border border-wine/60" />
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} className="relative -mt-1 text-wine">
                  <Icon name="pin" size={15} strokeWidth={2.2} />
                </motion.span>
              </span>
              {PROFILE.location}
              <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[10px] tracking-[.16em] text-sage">Now</span>
            </span>
          </motion.p>

          <h1 className="mt-6 font-serif text-[clamp(2.3rem,4.3vw,4.1rem)] font-light leading-[1.08] tracking-[-.02em] text-ink">
            <span className="block">
              <SplitText text="Hi, I'm" play={ready} stagger={0.07} /> <SplitText text="Harriet." play={ready} delay={0.15} className="soft-italic text-wine" />
            </span>
            {/* "I ___": every phrase is laid in the same grid cell so the line keeps the height of the longest one. */}
            <span className="flex items-baseline gap-[.25em]">
              <SplitText text="I" play={ready} delay={0.3} />
              <span className="relative grid min-w-0 flex-1 overflow-hidden pb-[0.1em]">
                {HERO_WORDS.map((w) => (
                  <span key={w} aria-hidden="true" className="soft-italic invisible col-start-1 row-start-1">
                    {w}
                  </span>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={HERO_WORDS[word]}
                    initial={{ y: "100%" }}
                    animate={ready ? { y: "0%" } : {}}
                    exit={{ y: "-100%", transition: { duration: 0.35, ease: [0.64, 0, 0.78, 0] } }}
                    transition={{ duration: 0.55, ease: EASE, delay: word === 0 ? 0.45 : 0 }}
                    className="soft-italic col-start-1 row-start-1 text-wine"
                  >
                    {HERO_WORDS[word]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            <SplitText text="from Accra, for the world." play={ready} delay={0.5} stagger={0.05} className="block" />
          </h1>

          <motion.p {...show(0.85)} className="mt-6 max-w-[46ch] text-[16px] font-medium leading-relaxed text-ink/85 sm:text-[17px]">
            Computer Science student at Accra Technical University. I build full-stack web apps and n8n AI workflows, and I create student-life and tech content for my own channel and for brands.
          </motion.p>

          <motion.div {...show(1)} className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => scrollToId(lenis, "work")} className="group inline-flex items-center gap-3 rounded-full bg-wine px-7 py-3.5 font-semibold text-paper shadow-[0_10px_30px_-12px_rgba(123,45,67,.6)] transition-colors hover:bg-ink">
              Browse my work
              <Icon name="arrow" size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} href={PROFILE.cv} download className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[#fffdf8] px-6 py-3.5 font-semibold text-ink transition-colors hover:border-wine hover:text-wine">
              <Icon name="download" size={17} /> Download CV
            </motion.a>
          </motion.div>

          {/* Social links: just the icons */}
          <motion.div {...show(1.15)} className="mt-6 flex items-center gap-3">
            {PROFILE.socials.map((s) => (
              <motion.a
                key={s.label}
                whileHover={{ y: -4, rotate: -8, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label}: ${s.handle}`}
                title={s.label}
                className={`grid h-12 w-12 place-items-center rounded-full ${SOCIAL_BG[s.icon]} shadow-[0_10px_22px_-10px_rgba(42,32,36,.7)] ring-2 ring-paper transition-shadow hover:shadow-[0_14px_26px_-8px_rgba(42,32,36,.75)]`}
              >
                <SocialMark name={s.icon} size={20} />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Portrait in an arch */}
        <div className="relative order-1 mx-auto w-full max-w-[380px] sm:max-w-[440px] md:order-2 md:max-w-none">
          <div data-arch-outline aria-hidden="true" className="absolute inset-0 translate-x-5 translate-y-5 rounded-t-full border border-gold/70" />
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" }}
            animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-paper-3 shadow-[0_40px_80px_-40px_rgba(42,32,36,.45)]"
          >
            <div data-photo className="absolute inset-0">
              <Image src={PROFILE.headshot} alt={`Portrait of ${PROFILE.name}`} fill priority sizes="(min-width:768px) 45vw, 90vw" className="object-cover object-[50%_22%]" />
            </div>
          </motion.div>

          {/* Rotating ring of words */}
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1, delay: 1, ease: EASE }} className="absolute -bottom-10 -left-4 h-32 w-32 sm:-left-10 sm:h-36 sm:w-36 lg:-left-12 lg:h-40 lg:w-40">
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
          <motion.div data-note initial={{ opacity: 0, y: 30, rotate: 0 }} animate={ready ? { opacity: 1, y: 0, rotate: -4 } : {}} transition={{ duration: 1, delay: 1.2, ease: EASE }} className="absolute -right-2 top-[3%] w-40 rounded-xl border border-line bg-paper/95 p-3.5 sm:p-4 shadow-[0_18px_40px_-20px_rgba(42,32,36,.45)] backdrop-blur sm:-right-6 sm:w-48 md:hidden lg:block lg:-right-4 lg:top-[12%] lg:w-56 xl:-right-8">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-sage">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-sage/60" />
                <span className="relative h-2 w-2 rounded-full bg-sage" />
              </span>
              Currently
            </p>
            <p className="mt-2 font-serif text-[16px] leading-snug sm:text-[17px]">Open to internships, freelance builds, automations &amp; brand collabs.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
