"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CERTIFICATES, type Certificate } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";
import Icon from "@/components/ui/Icon";

const TILT = [-2.5, 2];

/** Certificates hung on the wall in gilt frames; click one to see it full size. */
export default function Certificates() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Certificate | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Frames drop in on their strings; the badge rolls in as you scroll.
        gsap.from("[data-frame]", { y: -120, rotate: (i: number) => (i % 2 ? 12 : -12), opacity: 0, stagger: 0.15, ease: "back.out(1.4)", duration: 1.2, scrollTrigger: { trigger: root.current, start: "top 75%" } });
        gsap.fromTo("[data-badge]", { rotate: -120, scale: 0.4 }, { rotate: 12, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 45%", scrub: 0.8 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mt-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[.2em] text-ink-soft">Certifications</p>
          <h3 className="mt-4 font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.05]">
            Framed <span className="soft-italic text-wine">on the wall</span>
          </h3>
        </div>
        <p className="max-w-[40ch] text-ink-soft">Courses I&apos;ve completed in AI automation. Click a frame to see the certificate up close.</p>
      </div>

      <ul className="mt-16 grid gap-16 md:grid-cols-2 md:gap-12">
        {CERTIFICATES.map((c, i) => (
          <li key={c.title} className="flex flex-col items-center">
            {/* nail and string */}
            <div aria-hidden="true" className="relative h-10 w-40">
              <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_2px_3px_rgba(42,32,36,.4)]" />
              <svg viewBox="0 0 160 40" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M80 6 L14 40 M80 6 L146 40" stroke="#a8834e" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div data-frame className="w-full">
              <motion.button
                type="button"
                onClick={() => setOpen(c)}
                aria-label={`View certificate: ${c.title}, ${c.issuer}`}
                initial={{ rotate: TILT[i % TILT.length] }}
                whileHover={{ rotate: [TILT[i % TILT.length], -TILT[i % TILT.length] * 0.6, TILT[i % TILT.length] * 0.3, 0], y: -6 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                style={{ transformOrigin: "50% -40px" }}
                className="relative block w-full rounded-[6px] bg-[linear-gradient(135deg,#c9a46a,#8a6a3f_35%,#d8b878_55%,#8a6a3f_80%,#b8925a)] p-[14px] shadow-[0_30px_60px_-30px_rgba(42,32,36,.6)]"
              >
                <span className="block rounded-[2px] bg-[#fffdf8] p-[10px] shadow-[inset_0_0_0_1px_rgba(42,32,36,.15),inset_0_6px_14px_rgba(42,32,36,.12)]">
                  <span className="relative block aspect-[1.41] overflow-hidden">
                    <Image src={c.image} alt={`${c.title} certificate from ${c.issuer}`} fill sizes="(min-width:768px) 45vw, 90vw" className="object-contain" />
                  </span>
                </span>
                {c.badge && (
                  <span data-badge className="absolute -bottom-10 -left-6 block h-28 w-28 drop-shadow-[0_10px_14px_rgba(42,32,36,.35)] sm:-left-10 sm:h-32 sm:w-32">
                    <Image src={c.badge} alt={`${c.issuer} badge: ${c.title}`} fill sizes="128px" className="object-contain" />
                  </span>
                )}
              </motion.button>
            </div>

            {/* museum label */}
            <div className="mt-12 w-full max-w-[420px] rounded-sm border border-line bg-[#fffdf8] px-5 py-4 text-center shadow-[0_10px_24px_-18px_rgba(42,32,36,.5)]">
              <p className="font-serif text-xl leading-tight">{c.title}</p>
              <p className="soft-italic mt-1 font-serif text-wine">{c.issuer}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-ink-soft">{[c.level, c.date].filter(Boolean).join(" · ")}</p>
              {c.verify && (
                <a href={c.verify} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-wine">
                  <Icon name="check" size={15} /> Verify on n8n <Icon name="up" size={13} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Lightbox cert={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function Lightbox({ cert, onClose }: { cert: Certificate | null; onClose: () => void }) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cert) return;
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [cert, lenis, onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-5 sm:p-10" role="dialog" aria-modal="true" aria-label={`${cert.title} certificate`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
          <motion.figure initial={{ scale: 0.85, y: 40, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 24 }} className="relative w-full max-w-[1000px] rounded-[6px] bg-[#fffdf8] p-3 shadow-2xl sm:p-4">
            <div className="relative aspect-[1.41] w-full">
              <Image src={cert.image} alt={`${cert.title} certificate from ${cert.issuer}`} fill sizes="1000px" className="object-contain" />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <span>
                <span className="font-serif text-lg">{cert.title}</span> <span className="soft-italic font-serif text-wine">· {cert.issuer}</span>
              </span>
              <span className="flex items-center gap-2">
                {cert.verify && (
                  <a href={cert.verify} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-wine hover:text-wine">
                    Verify
                  </a>
                )}
                <button ref={closeRef} type="button" onClick={onClose} className="rounded-full bg-wine px-4 py-2 text-sm font-semibold text-paper hover:bg-ink">
                  Close
                </button>
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
