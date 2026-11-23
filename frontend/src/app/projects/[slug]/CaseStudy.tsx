"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { usePageTransition } from "@/components/providers/Transition";
import SplitText from "@/components/ui/SplitText";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";
import Icon from "@/components/ui/Icon";
import ProjectArt from "@/components/sections/ProjectArt";
import TypeCover from "@/components/sections/TypeCover";
import { InProgress } from "@/components/sections/Projects";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CaseStudy({ project: p, index, next }: { project: Project; index: number; next: Project }) {
  const root = useRef<HTMLElement>(null);
  const { ready } = usePageTransition();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to("[data-cover-img]", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: { trigger: "[data-cover]", start: "top top+=100", end: "bottom top", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-block]").forEach((el) => {
          gsap.from(el, { y: 80, opacity: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const story = [
    { label: "The problem", text: p.problem },
    { label: "How I built it", text: p.architecture },
    { label: "The result", text: p.result },
  ];

  return (
    <main ref={root} className="pb-10 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <TransitionLink href="/#work" label="Work" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-ink-soft hover:text-ink">
          <Icon name="arrow" size={14} className="rotate-180" /> All projects
        </TransitionLink>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} className="text-xs font-semibold uppercase tracking-[.2em] text-wine">
              {String(index + 1).padStart(2, "0")} · {p.category} · {p.year}
            </motion.p>
            <SplitText as="h1" text={p.title} by="char" stagger={0.03} play={ready} className="mt-4 block max-w-[14ch] font-serif text-[clamp(2.8rem,6.5vw,6rem)] font-light leading-[.86] tracking-tight" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="flex flex-wrap items-center gap-3">
            {p.status === "in-progress" && <span className="soft-italic font-serif text-lg text-ink-soft">Not live yet, coming soon.</span>}
            {p.live && (
              <Magnetic>
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3.5 font-semibold text-paper transition-colors hover:bg-ink">
                  Visit live site <Icon name="up" size={16} />
                </a>
              </Magnetic>
            )}
            {p.workflow && (
              <Magnetic>
                <TransitionLink href="/#automation" label="Automation lab" className="inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3.5 font-semibold text-paper transition-colors hover:bg-ink">
                  Try the live demo <Icon name="play" size={15} />
                </TransitionLink>
              </Magnetic>
            )}
            {p.repo && (
              <Magnetic>
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition-colors hover:border-wine hover:text-wine">
                  <Icon name="github" size={17} /> Source code
                </a>
              </Magnetic>
            )}
          </motion.div>
        </div>

        <motion.div
          data-cover
          initial={{ clipPath: "inset(30% 10% 30% 10% round 2rem)" }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 2rem)" } : {}}
          transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
          className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem] border border-line bg-paper-2"
        >
          <div data-cover-img className="absolute inset-0">
            {p.image ? (
              <Image src={p.image} alt={`${p.title} screenshot`} fill priority sizes="(min-width:1280px) 1216px, 100vw" className="object-cover object-top" />
            ) : p.workflow ? (
              <ProjectArt workflow={p.workflow} />
            ) : (
              <TypeCover project={p} />
            )}
          </div>
          {p.liveLabel && <span className="absolute bottom-5 left-5 rounded-full bg-paper/90 px-4 py-2 font-mono text-xs backdrop-blur">{p.liveLabel}</span>}
          {p.status === "in-progress" && <InProgress className="right-5 top-5" />}
        </motion.div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <aside data-block className="lg:sticky lg:top-32 lg:self-start">
            <p className="font-serif text-2xl leading-snug">{p.summary}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-soft">Type</dt>
                <dd className="mt-1">{p.category}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-soft">Year</dt>
                <dd className="mt-1">{p.year}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-soft">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="flex flex-col gap-14">
            {story.map((s, i) => (
              <section key={s.label} data-block>
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em] text-wine">
                  0{i + 1} <span className="h-px w-10 bg-line" /> {s.label}
                </p>
                <p className="mt-4 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-snug">{s.text}</p>
              </section>
            ))}
            <ul data-block className="grid gap-3 sm:grid-cols-3">
              {p.highlights.map((h) => (
                <li key={h} className="rounded-3xl border border-line bg-paper-2 p-5">
                  <Icon name="spark" size={18} className="text-wine" />
                  <p className="mt-4 font-serif text-lg leading-tight">{h}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next project: a giant link that fills on hover */}
      <TransitionLink href={`/projects/${next.slug}`} label={next.title} className="group relative mt-32 block overflow-hidden border-y border-line">
        <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-wine transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100" />
        <div className="relative mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-ink-soft transition-colors group-hover:text-paper">Next project</p>
          <p className="mt-3 flex items-center justify-between gap-6 font-serif text-[clamp(2.2rem,5.5vw,5rem)] font-light leading-[.9] tracking-tight transition-colors group-hover:text-paper">
            {next.title}
            <Icon name="arrow" size={64} className="hidden shrink-0 transition-transform duration-500 group-hover:translate-x-3 sm:block" />
          </p>
        </div>
      </TransitionLink>
    </main>
  );
}
