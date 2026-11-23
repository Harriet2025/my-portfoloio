"use client";

import { Fragment, useRef } from "react";
import { MARQUEE } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/* A soft wave from edge to edge; the words ride on it. */
const WAVE = "M-60,150 C 180,40 420,40 640,120 S 1080,230 1300,120 S 1560,40 1700,90";

/**
 * Words flowing along a fine gold thread. As you scroll the thread draws itself
 * across the page and the words drift along the curve.
 */
export default function Marquee({ items = MARQUEE }: { items?: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 };
        gsap.fromTo("[data-words]", { attr: { startOffset: "2%" } }, { attr: { startOffset: "-38%" }, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-thread]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { ...st, end: "center 40%" } });
        gsap.fromTo("[data-pearl]", { attr: { r: 0 } }, { attr: { r: 5 }, ease: "back.out(3)", duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: root.current, start: "top 75%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const words = [...items, ...items, ...items];
  return (
    <div ref={root} className="relative overflow-x-clip py-6 sm:py-10" aria-hidden="true">
      <svg viewBox="0 0 1440 260" className="relative left-1/2 block w-[max(100%,900px)] -translate-x-1/2">
        <defs>
          <path id="thread-wave" d={WAVE} />
        </defs>
        {/* the thread, drawn a little below the words */}
        <path data-thread d={WAVE} transform="translate(0 22)" pathLength={1} strokeDasharray="1 1" fill="none" stroke="#a8834e" strokeWidth="1.4" strokeLinecap="round" opacity=".75" />
        {[[297, 86], [640, 142], [970, 213]].map(([x, y], i) => (
          <circle key={x} data-pearl cx={x} cy={y} r="5" fill={i === 1 ? "#7b2d43" : "#d4a19c"} />
        ))}
        <text style={{ fontFamily: "var(--font-serif)" }} fontSize="46" fill="#2a2024" letterSpacing="0.5">
          <textPath data-words href="#thread-wave" startOffset="2%">
            {words.map((w, i) => (
              <Fragment key={i}>
                <tspan fontStyle={i % 2 ? "italic" : "normal"} fill={i % 2 ? "#7b2d43" : "#2a2024"} fontWeight={300}>
                  {w}
                </tspan>
                <tspan fill="#a8834e" fontSize="26" dx="18" dy="-4">
                  ✦
                </tspan>
                <tspan dx="18" dy="4">
                  {" "}
                </tspan>
              </Fragment>
            ))}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
