"use client";

import { useRef } from "react";
import { TIMELINE } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The spine draws itself as you scroll, with a glowing head.
        gsap.fromTo("[data-spine]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 60%", end: "bottom 60%", scrub: 0.5 } });
        // Giant background word slides sideways.
        gsap.fromTo("[data-bigword]", { xPercent: 10 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });

        gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((el) => {
          const fromLeft = el.dataset.side === "left";
          gsap.from(el.querySelector("[data-card]"), {
            x: window.innerWidth < 768 ? 40 : fromLeft ? -90 : 90,
            rotate: fromLeft ? -3 : 3,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
          });
          gsap.fromTo(el.querySelector("[data-dot]"), { scale: 0.4, backgroundColor: "#161210" }, { scale: 1, backgroundColor: "#f2643a", duration: 0.4, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="relative overflow-hidden bg-ink py-28 sm:py-40">
      <p data-bigword aria-hidden="true" className="pointer-events-none absolute top-24 whitespace-nowrap font-display text-[22vw] font-extrabold uppercase leading-none text-cream/[.03]">
        Journey · Journey
      </p>
      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <SectionLabel index="05">Experience & education</SectionLabel>
        <SplitText as="h2" text="From the classroom to the codebase" className="mt-6 block max-w-[16ch] font-display text-[clamp(2.4rem,6vw,5.2rem)] font-extrabold uppercase leading-[.92] tracking-tight" />

        <ol data-timeline className="relative mt-20">
          <span aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-px bg-line md:left-1/2" />
          <span data-spine aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-ember via-ember to-gold md:left-1/2" />

          {TIMELINE.map((item, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li key={item.title} data-entry data-side={side} className="relative grid pb-14 pl-14 last:pb-0 md:grid-cols-2 md:pl-0">
                <span data-dot aria-hidden="true" className="absolute left-[8px] top-7 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-ember bg-ink-2 md:left-1/2 md:-translate-x-1/2">
                  {item.live && <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />}
                </span>
                <div className={side === "left" ? "md:pr-16" : "md:col-start-2 md:pl-16"}>
                  <article data-card className="group relative overflow-hidden rounded-[2rem] border border-line bg-ink-2 p-6 transition-colors duration-500 hover:border-ember/60 sm:p-8">
                    <span aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember/0 blur-2xl transition-colors duration-700 group-hover:bg-ember/20" />
                    <div className="relative flex items-center justify-between gap-4">
                      <span className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[.16em] ${item.live ? "bg-sage text-ink" : "border border-line text-mute"}`}>{item.tag}</span>
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream/5 text-ember transition-transform duration-500 group-hover:rotate-12">
                        <Icon name={item.icon} size={20} />
                      </span>
                    </div>
                    <h3 className="relative mt-6 font-display text-2xl font-bold leading-tight sm:text-3xl">{item.title}</h3>
                    <p className="relative mt-1 font-mono text-xs uppercase tracking-[.14em] text-mute">{item.place}</p>
                    <p className="relative mt-4 text-[15px] leading-relaxed text-cream/85">{item.text}</p>
                    <p className="relative mt-5 flex items-start gap-2 border-t border-line pt-4 text-[15px] font-medium leading-snug text-ember-2">
                      <Icon name="arrow" size={16} className="mt-0.5 shrink-0" />
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
