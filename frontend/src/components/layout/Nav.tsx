"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, PROFILE } from "@/content/site";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import { usePageTransition } from "@/components/providers/Transition";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/ui/Magnetic";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const lenis = useLenis();
  const pathname = usePathname();
  const { navigate } = usePageTransition();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Hide while scrolling down, show again on the way up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setSolid(y > 40);
    if (y < window.innerHeight * 0.6) setActive("");
  });

  // Highlight the section currently in view.
  useEffect(() => {
    if (pathname !== "/") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const goTo = (id: string) => {
    setOpen(false);
    if (pathname === "/") scrollToId(lenis, id);
    else navigate(`/#${id}`, "Home");
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className={`mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-[1280px] items-center justify-between gap-4 rounded-full border px-3 py-2 transition-colors duration-500 sm:px-4 ${solid || open ? "border-line bg-ink/75 backdrop-blur-xl" : "border-transparent"}`}>
          <button type="button" onClick={() => (pathname === "/" ? scrollToId(lenis, "top") : navigate("/", "Home"))} className="group flex items-center gap-3" aria-label="Back to top">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ember font-display text-sm font-extrabold text-ink transition-transform duration-500 group-hover:rotate-[360deg]">HA</span>
            <span className="hidden flex-col items-start leading-none sm:flex">
              <span className="font-display text-sm font-bold">{PROFILE.name}</span>
              <span className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-mute">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
                {PROFILE.status}
              </span>
            </span>
          </button>

          <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
            {NAV.map(({ id, label }) => (
              <button key={id} type="button" onClick={() => goTo(id)} className="relative rounded-full px-4 py-2 text-sm font-medium text-cream/80 transition-colors hover:text-cream" aria-current={active === id ? "true" : undefined}>
                {active === id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-cream/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <a href={PROFILE.cv} download className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition-colors hover:border-cream" data-cursor="CV">
                <Icon name="download" size={16} /> CV
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => goTo("contact")} className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ember">
                Hire me
              </button>
            </Magnetic>
            <button type="button" onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
              <Icon name={open ? "x" : "menu"} size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink-2 px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="flex flex-col gap-1">
              {NAV.map(({ id, label }, i) => (
                <li key={id} className="overflow-hidden">
                  <motion.button
                    type="button"
                    onClick={() => goTo(id)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: EASE }}
                    className="flex w-full items-baseline gap-4 py-1 text-left font-display text-5xl font-extrabold uppercase tracking-tight sm:text-6xl"
                  >
                    <span className="font-mono text-xs text-ember">0{i + 1}</span>
                    {label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
              {PROFILE.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 text-sm">
                  {s.label}
                </a>
              ))}
              <a href={PROFILE.cv} download className="rounded-full border border-line px-4 py-2 text-sm">
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
