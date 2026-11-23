"use client";

import Image from "next/image";
import { useRef } from "react";
import { PROJECTS, type Project } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import TransitionLink from "@/components/ui/TransitionLink";
import Icon from "@/components/ui/Icon";
import ProjectArt from "./ProjectArt";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the gallery and turn vertical scroll into horizontal movement.
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
        // Parallax inside each image while the track moves.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -10 }, { xPercent: 10, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        // Cards tilt up into place as they enter from the right.
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.from(card, { rotate: 4, y: 80, opacity: 0.3, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 105%", end: "left 60%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative bg-ink">
      <div ref={pin} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 lg:h-[100svh] lg:py-0">
        <div className="mx-auto mb-10 flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 lg:mb-12">
          <div>
            <SectionLabel index="03">Selected work</SectionLabel>
            <SplitText as="h2" text="Projects built" className="mt-6 block font-display text-[clamp(2.6rem,7vw,6rem)] font-extrabold uppercase leading-[.9] tracking-tight" />
          </div>
          <p className="max-w-[34ch] text-mute">
            <span className="hidden lg:inline">Keep scrolling to move through the gallery. </span>
            <span className="lg:hidden">Swipe through the gallery. </span>Open any project for the full case study.
          </p>
        </div>

        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] lg:pr-[10vw]"
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
          <div data-card className="flex w-[80vw] shrink-0 snap-start flex-col justify-center rounded-[2rem] border border-dashed border-line p-8 sm:w-[46vw] lg:w-[34vw]">
            <p className="font-display text-[clamp(2rem,3.5vw,3rem)] font-extrabold uppercase leading-none">More on GitHub</p>
            <p className="mt-4 max-w-[30ch] text-mute">Coursework, experiments and the code behind these projects.</p>
            <a href="https://github.com/Harriet2025" target="_blank" rel="noreferrer" className="mt-8 inline-flex w-max items-center gap-2 rounded-full bg-cream px-6 py-3 font-semibold text-ink transition-colors hover:bg-ember" data-cursor="Open">
              <Icon name="github" size={18} /> Harriet2025
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 hidden w-full max-w-[1280px] px-8 lg:block" aria-hidden="true">
          <div className="h-px w-full bg-line">
            <div data-progress className="h-px origin-left scale-x-0 bg-ember" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  return (
    <article data-card className="group relative w-[84vw] shrink-0 snap-start sm:w-[60vw] lg:w-[min(46vw,calc((100svh-330px)*1.45))] xl:w-[min(42vw,calc((100svh-330px)*1.45))]">
      <TransitionLink href={`/projects/${p.slug}`} label={p.title} data-cursor="View" className="block">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] border border-line bg-ink-2">
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]">
            <div data-parallax className="absolute inset-y-0 -left-[12%] w-[124%]">
              {p.image ? <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="(min-width:1024px) 46vw, 84vw" className="object-cover object-top" /> : <ProjectArt workflow={p.workflow!} />}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

          {/* Hover reveal: summary slides up */}
          <div className="absolute inset-x-0 bottom-0 translate-y-6 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-lg:hidden">
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-cream/90">{p.summary}</p>
          </div>

          <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.16em] backdrop-blur">{p.category}</span>
          <span className="absolute right-5 top-5 grid h-12 w-12 -rotate-45 place-items-center rounded-full bg-ember text-ink opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100">
            <Icon name="arrow" size={20} />
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold uppercase leading-none tracking-tight">
              <span className="bg-[linear-gradient(var(--color-ember),var(--color-ember))] bg-[length:0%_3px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_3px]">{p.title}</span>
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-mute">
              {p.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <span className="font-display text-5xl font-extrabold leading-none text-cream/10 transition-colors duration-500 group-hover:text-ember">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </TransitionLink>
    </article>
  );
}
