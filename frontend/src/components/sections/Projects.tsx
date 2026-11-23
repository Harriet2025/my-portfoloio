"use client";

import Image from "next/image";
import { useRef } from "react";
import { PROJECTS, PROFILE, type Project } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import TransitionLink from "@/components/ui/TransitionLink";
import Icon from "@/components/ui/Icon";
import ProjectArt from "./ProjectArt";

/* Spine colours, one per book. */
const SPINES = ["#7b2d43", "#33242a", "#6f7f5c", "#8a6a3f", "#9b4560", "#4a3a40"];

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0);
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set("[data-progress]", { scaleX: self.progress }),
          },
        });
        // Books lean in, then stand upright as they slide into view.
        gsap.utils.toArray<HTMLElement>("[data-book]").forEach((book) => {
          gsap.from(book, { rotate: 6, y: 40, transformOrigin: "bottom left", ease: "none", scrollTrigger: { trigger: book, containerAnimation: tween, start: "left 105%", end: "left 65%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative">
      <div ref={pin} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 lg:h-[100svh] lg:py-0">
        <div className="mx-auto mb-6 flex w-full max-w-[1240px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8 [@media(max-height:640px)]:mb-2">
          <div>
            <SectionLabel index="III">Selected work</SectionLabel>
            <h2 className="mt-5 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
              <SplitText text="The" /> <SplitText text="bookshelf" className="soft-italic text-wine" delay={0.08} />
            </h2>
          </div>
          <p className="max-w-[36ch] text-ink-soft">
            <span className="hidden lg:inline">Keep scrolling to walk along the shelf. Hover a book to open its cover.</span>
            <span className="lg:hidden">Swipe along the shelf.</span> Each one opens into a full case study.
          </p>
        </div>

        <div className="relative">
          <div ref={track} className="flex snap-x snap-mandatory items-end gap-8 overflow-x-auto px-5 pb-6 pt-6 [scrollbar-width:none] sm:px-8 lg:w-max lg:snap-none lg:gap-12 lg:overflow-visible lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pr-[12vw]">
            {PROJECTS.map((p, i) => (
              <Book key={p.slug} project={p} index={i} />
            ))}
            <a href={PROFILE.socials[0].href} target="_blank" rel="noreferrer" data-book className="group flex h-[clamp(250px,calc(100svh-290px),520px)] w-[64vw] shrink-0 snap-start flex-col justify-end rounded-sm border border-dashed border-gold/60 p-7 transition-colors hover:bg-paper-2 sm:w-[300px]">
              <span className="soft-italic font-serif text-3xl leading-tight">More on the shelf</span>
              <span className="mt-3 text-ink-soft">Coursework, experiments and source code on GitHub.</span>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-wine">
                <Icon name="github" size={18} /> {PROFILE.socials[0].handle} <Icon name="up" size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
          {/* The shelf itself */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-[#c9b190] to-[#a88e6c] shadow-[0_18px_30px_-12px_rgba(42,32,36,.45)]" />
        </div>

        <div className="mx-auto mt-6 hidden w-full max-w-[1240px] items-center gap-4 px-8 lg:flex [@media(max-height:640px)]:hidden" aria-hidden="true">
          <span className="soft-italic font-serif text-sm text-ink-soft">Shelf</span>
          <div className="h-px flex-1 bg-line">
            <div data-progress className="h-px origin-left scale-x-0 bg-wine" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Book({ project: p, index }: { project: Project; index: number }) {
  const spine = SPINES[index % SPINES.length];
  return (
    <article data-book className="group w-[78vw] shrink-0 snap-start sm:w-[380px] lg:w-[calc(clamp(250px,calc(100svh-290px),520px)*0.82)]">
      <TransitionLink href={`/projects/${p.slug}`} label={p.title} className="block" aria-label={`${p.title}: read the case study`}>
        <div className="relative flex h-[clamp(250px,calc(100svh-290px),520px)] [perspective:1600px]">
          {/* Spine */}
          <div className="relative z-10 flex w-11 shrink-0 flex-col items-center justify-between rounded-l-sm py-5 text-paper shadow-[inset_-6px_0_10px_rgba(0,0,0,.2)]" style={{ background: spine }}>
            <span className="h-px w-6 bg-gold/80" />
            <span className="font-serif text-sm tracking-wide [writing-mode:vertical-rl] rotate-180">{p.title}</span>
            <span className="soft-italic font-serif text-xs">{String(index + 1).padStart(2, "0")}</span>
          </div>

          <div className="relative flex-1">
            {/* Inside page, revealed when the cover swings open */}
            <div className="absolute inset-0 flex flex-col justify-between rounded-r-sm border border-paper-3 bg-[#fffdf8] p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-soft">{p.category}</p>
                <p className="soft-italic mt-3 font-serif text-2xl leading-tight text-wine">{p.title}</p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">{p.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 font-semibold text-wine">
                Read the case study <Icon name="arrow" size={16} />
              </span>
            </div>

            {/* Page edges */}
            <div aria-hidden="true" className="absolute inset-y-1 -right-1.5 w-2 rounded-r-sm bg-[repeating-linear-gradient(90deg,#efe7db_0_1px,#fffdf8_1px_3px)]" />

            {/* Cover */}
            <div className="absolute inset-0 origin-left overflow-hidden rounded-r-sm shadow-[0_24px_50px_-26px_rgba(42,32,36,.6)] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] lg:group-hover:[transform:rotateY(-80deg)] group-focus-visible:[transform:rotateY(-80deg)]">
              {p.image ? <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="(min-width:1024px) 30vw, 78vw" className="object-cover object-top" /> : <ProjectArt workflow={p.workflow!} />}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 rounded-sm bg-paper/95 px-4 py-3 shadow-sm">
                <p className="font-serif text-xl leading-tight">{p.title}</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {p.category} · {p.year}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TransitionLink>
      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 pl-11 text-xs font-medium text-ink-soft">
        {p.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </article>
  );
}
