"use client";

import { useRef } from "react";
import { MARQUEE } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Icon from "@/components/ui/Icon";

type Frame = { text: string; icon: string };

/**
 * A strip of film that runs sideways. Each frame is one thing I do. Scrolling
 * speeds the reel up, flips its direction and bends the frames with the motion.
 */
export default function Marquee({ items = MARQUEE }: { items?: readonly Frame[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
        loop.totalTime(loop.duration() * 100);
        const frames = root.current!.querySelectorAll("[data-frame-card]");
        const st = ScrollTrigger.create({
          onUpdate(self) {
            const v = self.getVelocity();
            const speed = Math.min(6, 1 + Math.abs(v) / 450);
            gsap.to(loop, { timeScale: self.direction * speed, duration: 0.25, overwrite: true });
            gsap.to(loop, { timeScale: self.direction, duration: 1.4, delay: 0.25 });
            gsap.to(frames, { skewX: gsap.utils.clamp(-8, 8, v / -300), duration: 0.3, overwrite: true, onComplete: () => void gsap.to(frames, { skewX: 0, duration: 0.8, ease: "power3.out" }) });
          },
        });
        // The strip tilts a little more as it passes through the screen.
        gsap.fromTo(root.current, { rotate: -3.2 }, { rotate: -1.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
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
    <div className="relative overflow-x-clip py-10 sm:py-14" aria-hidden="true">
      <div ref={root} style={{ transform: "rotate(-2deg)" }} className="relative -mx-[5vw] bg-night py-[14px] shadow-[0_30px_60px_-30px_rgba(38,26,31,.7)]">
        <Sprockets edge="top" />
        <Sprockets edge="bottom" />
        <div ref={track} className="flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-stretch">
              {row.map((f, i) => (
                <div key={`${copy}-${i}`} className="px-[6px]">
                  <div
                    data-frame-card
                    className={`relative flex h-[clamp(84px,11vw,120px)] items-center gap-4 rounded-[6px] px-[clamp(18px,2.6vw,34px)] ${i % 3 === 1 ? "bg-wine" : i % 3 === 2 ? "bg-night-2" : "bg-[#3d2c33]"}`}
                  >
                    <span className="absolute left-2 top-1.5 font-mono text-[9px] tracking-[.2em] text-paper/35">{String((i % items.length) + 1).padStart(2, "0")}A</span>
                    <span className={`grid h-[clamp(36px,4.2vw,48px)] w-[clamp(36px,4.2vw,48px)] shrink-0 place-items-center rounded-full ${i % 3 === 1 ? "bg-paper/15 text-paper" : "bg-rose/20 text-rose"}`}>
                      <Icon name={f.icon} size={20} />
                    </span>
                    <span className={`whitespace-nowrap font-serif text-[clamp(1.4rem,3vw,2.5rem)] font-light leading-none ${i % 2 ? "soft-italic" : ""} text-paper`}>{f.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A row of film sprocket holes along one edge of the strip. */
function Sprockets({ edge }: { edge: "top" | "bottom" }) {
  return (
    <span
      className={`pointer-events-none absolute inset-x-0 h-[6px] ${edge === "top" ? "top-[4px]" : "bottom-[4px]"}`}
      style={{ backgroundImage: "linear-gradient(90deg, #f7f2ea 0 10px, transparent 10px)", backgroundSize: "22px 6px", opacity: 0.55, borderRadius: 2 }}
    />
  );
}
