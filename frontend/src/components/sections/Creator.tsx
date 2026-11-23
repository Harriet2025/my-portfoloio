"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import { CREATOR_ROLES, PROFILE, type CreatorRole } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

const TONES: Record<CreatorRole["tone"], { bg: string; ink: string; accent: string; soft: string }> = {
  blush: { bg: "#f2dfd8", ink: "#2a2024", accent: "#7b2d43", soft: "#5e5054" },
  sage: { bg: "#56654a", ink: "#f7f2ea", accent: "#e9dcc0", soft: "#dfe5d3" },
  night: { bg: "#33242a", ink: "#f7f2ea", accent: "#d4a19c", soft: "#cdbfc2" },
  gold: { bg: "#8a6a3f", ink: "#fffaf0", accent: "#f2e2c4", soft: "#efe2cb" },
};
const TILT = [-3, 2, -1.5, 3];

export default function Creator() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // The magazines fan up onto the rack as the section scrolls in.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        gsap.from("[data-mag]", {
          y: 160,
          rotate: (i: number) => (i % 2 ? 10 : -10),
          opacity: 0,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: "[data-rack]", start: "top 90%", end: "top 35%", scrub: 0.8 },
        });
      });
      // On phones each magazine swings up on its own as it scrolls into view.
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.utils.toArray<HTMLElement>("[data-mag]").forEach((mag, i) => {
          gsap.from(mag, { y: 120, rotate: i % 2 ? 9 : -9, scale: 0.9, opacity: 0, ease: "power2.out", scrollTrigger: { trigger: mag, start: "top 95%", end: "top 55%", scrub: 0.8 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="content" className="relative overflow-x-clip py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-40 h-[34rem] w-[34rem] rounded-full bg-blush/60 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="V">Content creation</SectionLabel>
            <h2 className="mt-6 max-w-[16ch] font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
              <SplitText text="Behind" /> <SplitText text="the camera" className="soft-italic text-wine" delay={0.08} />
            </h2>
          </div>
          <p className="max-w-[44ch] text-ink-soft">
            Away from the code, I create content about student lifestyle and tech, partner with brands as an influencer and creator, and teach other people how to make content of their own.
          </p>
        </div>

        <ul data-rack className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {CREATOR_ROLES.map((r, i) => (
            <li key={r.masthead} data-mag>
              <motion.div initial={{ rotate: TILT[i % TILT.length] }} whileHover={{ rotate: 0, y: -12, scale: 1.02 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                <Magazine role={r} />
              </motion.div>
              <p className="mt-5 text-center text-sm font-semibold text-ink">{r.role}</p>
              <p className="text-center text-sm text-ink-soft">{r.masthead === "Create With Me" || r.masthead === "Student & Tech" ? r.issue : r.masthead}</p>
            </li>
          ))}
        </ul>
        {/* the rack's ledge */}
        <div aria-hidden="true" className="mt-2 hidden h-3 rounded-full bg-gradient-to-b from-[#c9b190] to-[#a88e6c] shadow-[0_14px_24px_-12px_rgba(42,32,36,.45)] lg:block" />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-paper-2 p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="soft-italic font-serif text-2xl text-wine sm:text-3xl">Want to start creating content?</p>
            <p className="mt-2 max-w-[52ch] text-ink-soft">I tutor students and beginners on planning ideas, filming with just a phone, editing and posting with confidence. Brands can reach out for collaborations too.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => scrollToId(lenis, "contact")} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-wine px-6 py-3.5 font-semibold text-paper transition-colors hover:bg-ink">
              Book a lesson or collab <Icon name="arrow" size={16} />
            </motion.button>
            <a href={PROFILE.socials.find((s) => s.label === "TikTok")?.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-6 py-3.5 font-semibold transition-colors hover:border-wine hover:text-wine">
              <Icon name="tiktok" size={17} /> Watch on TikTok
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** A magazine cover: masthead, issue line, cover lines, headline and a barcode. */
function Magazine({ role: r }: { role: CreatorRole }) {
  const t = TONES[r.tone];
  const cover = (
    <div className="@container relative aspect-[3/4] overflow-hidden rounded-[4px] shadow-[0_30px_50px_-28px_rgba(42,32,36,.6)]" style={{ background: t.bg, color: t.ink }}>
      {r.portrait && (
        <>
          <Image src={PROFILE.headshot} alt={`${PROFILE.name}, content creator`} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw" className="object-cover object-[50%_25%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f2dfd8]/90 via-transparent to-[#2a2024]/80" />
        </>
      )}

      <div className="relative flex h-full flex-col p-[6cqw]">
        <div className="flex items-center justify-between text-[clamp(8px,3.2cqw,11px)] font-semibold uppercase tracking-[.18em]" style={{ color: r.portrait ? "#5e5054" : t.soft }}>
          <span>{r.issue}</span>
          <span>No. 2026</span>
        </div>
        <p className="mt-[2cqw] font-serif text-[clamp(26px,15cqw,64px)] font-light leading-[.9] tracking-[-.02em]" style={{ color: r.portrait ? "#7b2d43" : t.ink }}>
          {r.masthead}
        </p>

        {!r.portrait && (
          <p aria-hidden="true" className="soft-italic mt-auto font-serif text-[clamp(60px,38cqw,150px)] leading-none opacity-20" style={{ color: t.accent }}>
            ❦
          </p>
        )}

        <div className={`${r.portrait ? "mt-auto" : ""} text-[#f7f2ea]`}>
          <p className="soft-italic font-serif text-[clamp(16px,8.5cqw,30px)] leading-[1.05]" style={{ color: r.portrait ? "#f7f2ea" : t.accent }}>
            {r.headline}
          </p>
          <div className="mt-[4cqw] flex items-end justify-between gap-3">
            <ul className="space-y-[1cqw] text-[clamp(9px,3.6cqw,13px)] font-semibold uppercase tracking-[.12em]" style={{ color: r.portrait ? "#f7f2ea" : t.soft }}>
              {r.lines.map((l) => (
                <li key={l}>✦ {l}</li>
              ))}
            </ul>
            <Barcode />
          </div>
        </div>
      </div>
    </div>
  );

  return r.link ? (
    <a href={r.link.href} target="_blank" rel="noreferrer" aria-label={`${r.role}: ${r.link.label}`} className="block">
      {cover}
    </a>
  ) : (
    cover
  );
}

function Barcode() {
  const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2];
  let x = 0;
  return (
    <svg viewBox="0 0 44 26" className="h-[clamp(18px,9cqw,30px)] w-auto shrink-0 rounded-[2px] bg-[#fffdf8] p-[2px]" aria-hidden="true">
      {bars.map((w, i) => {
        const el = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="26" fill="#2a2024" /> : null;
        x += w + 0.6;
        return el;
      })}
    </svg>
  );
}
