"use client";

import { useRef } from "react";
import { MARQUEE } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** An endless ribbon that speeds up with scroll velocity and flips direction with scroll direction. */
export default function Marquee({ items = MARQUEE, tilt = -2 }: { items?: readonly string[]; tilt?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
        loop.totalTime(loop.duration() * 100); // room to play backwards
        const skew = gsap.quickTo(track.current, "skewX", { duration: 0.4, ease: "power3" });
        const st = ScrollTrigger.create({
          onUpdate(self) {
            const v = self.getVelocity();
            const speed = Math.min(6, 1 + Math.abs(v) / 400);
            gsap.to(loop, { timeScale: self.direction * speed, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.2 });
            skew(gsap.utils.clamp(-8, 8, v / -300));
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
    <div className="relative z-10 -my-10 overflow-x-clip py-10">
    <div ref={root} className="overflow-hidden border-y border-line bg-ember py-5 text-ink" style={{ transform: `rotate(${tilt}deg) scale(1.04)` }} aria-hidden="true">
      <div ref={track} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={`${copy}-${i}`} className="flex items-center font-display text-[clamp(1.6rem,4vw,3.2rem)] font-extrabold uppercase tracking-tight">
                <span className="px-6">{t}</span>
                <span className="text-[0.6em]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
