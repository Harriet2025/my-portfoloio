"use client";

import { useRef } from "react";
import { TIMELINE } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-spine]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 60%", end: "bottom 60%", scrub: 0.5 } });
        gsap.fromTo("[data-bigword]", { xPercent: 5 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });

        gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((el) => {
          const fromLeft = el.dataset.side === "left";
          gsap.from(el.querySelector("[data-card]"), {
            x: window.innerWidth < 768 ? 30 : fromLeft ? -60 : 60,
            rotate: fromLeft ? -2 : 2,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          });
          gsap.fromTo(el.querySelector("[data-dot]"), { scale: 0.5, backgroundColor: "#f7f2ea" }, { scale: 1, backgroundColor: "#7b2d43", duration: 0.5, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="relative overflow-hidden py-28 sm:py-36">
      <p data-bigword aria-hidden="true" className="soft-italic pointer-events-none absolute top-16 whitespace-nowrap font-serif text-[18vw] font-light leading-none text-wine/[.05]">
        my story, so far
      </p>
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <SectionLabel index="V">Experience & education</SectionLabel>
        <h2 className="mt-6 max-w-[18ch] font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
          <SplitText text="From the classroom" /> <SplitText text="to the codebase" className="soft-italic text-wine" delay={0.1} />
        </h2>

        <ol data-timeline className="relative mt-20">
          <span aria-hidden="true" className="absolute bottom-0 left-[15px] top-0 w-px bg-line md:left-1/2" />
          <span data-spine aria-hidden="true" className="absolute bottom-0 left-[15px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-wine via-rose to-gold md:left-1/2" />

          {TIMELINE.map((item, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li key={item.title} data-entry data-side={side} className="relative grid pb-14 pl-12 last:pb-0 md:grid-cols-2 md:pl-0">
                <span data-dot aria-hidden="true" className="absolute left-[6px] top-8 z-10 h-5 w-5 rounded-full border-2 border-wine bg-paper md:left-1/2 md:-translate-x-1/2">
                  {item.live && <span className="absolute inset-0 animate-ping rounded-full bg-wine/40" />}
                </span>
                <div className={side === "left" ? "md:pr-16" : "md:col-start-2 md:pl-16"}>
                  <article data-card className="group relative rounded-lg border border-paper-3 bg-[#fffdf8] p-6 shadow-[0_20px_50px_-30px_rgba(42,32,36,.45)] transition-transform duration-500 hover:-translate-y-1 sm:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="soft-italic font-serif text-5xl font-light leading-none text-wine/80">{ROMAN[i]}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[.16em] ${item.live ? "bg-sage text-paper" : "border border-line text-ink-soft"}`}>{item.tag.startsWith("Chapter") ? item.place : item.tag}</span>
                    </div>
                    <h3 className="mt-5 font-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight">{item.title}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[.14em] text-ink-soft">{item.tag.startsWith("Chapter") ? "Earlier chapter" : item.place}</p>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
                    <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 font-serif text-[17px] italic leading-snug text-wine">
                      <Icon name="arrow" size={16} className="mt-1 shrink-0" />
                      {item.carry}
                    </p>
                  </article>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
