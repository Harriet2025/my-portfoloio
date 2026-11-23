"use client";

import { useRef } from "react";
import { MARQUEE } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Large italic words that drift sideways, speeding up and changing direction with your scroll. */
export default function Marquee({ items = MARQUEE }: { items?: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        loop.totalTime(loop.duration() * 100);
        const st = ScrollTrigger.create({
          onUpdate(self) {
            const speed = Math.min(5, 1 + Math.abs(self.getVelocity()) / 500);
            gsap.to(loop, { timeScale: self.direction * speed, duration: 0.25, overwrite: true });
            gsap.to(loop, { timeScale: self.direction, duration: 1.4, delay: 0.25 });
          },
        });
        return () => {
          loop.kill();
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = [...items, ...items];
  return (
    <div ref={root} className="relative overflow-x-clip border-y border-line py-6" aria-hidden="true">
      <div ref={track} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={`${copy}-${i}`} className="flex items-center font-serif text-[clamp(2.2rem,5.5vw,4.6rem)] font-light leading-none">
                <span className={`px-7 ${i % 2 ? "soft-italic text-wine" : "text-ink/80"}`}>{t}</span>
                <span className="text-[0.45em] text-gold">❦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
