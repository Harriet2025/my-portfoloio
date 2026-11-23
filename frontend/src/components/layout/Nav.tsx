"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, PROFILE } from "@/content/site";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import { usePageTransition } from "@/components/providers/Transition";
import Icon from "@/components/ui/Icon";

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

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 500 && !open);
    setSolid(y > 40);
    if (y < window.innerHeight * 0.6) setActive("");
  });

  useEffect(() => {
    if (pathname !== "/") return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
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
      <motion.header className="fixed inset-x-0 top-0 z-50" animate={{ y: hidden ? "-110%" : "0%" }} transition={{ duration: 0.45, ease: EASE }}>
        <div className={`border-b transition-colors duration-500 ${solid || open ? "border-line bg-paper/85 backdrop-blur-lg" : "border-transparent"}`}>
          <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
            <button type="button" onClick={() => (pathname === "/" ? scrollToId(lenis, "top") : navigate("/", "Home"))} className="group flex items-baseline gap-2 text-left" aria-label="Back to top">
              <span className="soft-italic font-serif text-2xl leading-none text-ink">Harriet</span>
              <span className="font-serif text-2xl leading-none text-wine">Ayim</span>
              <span className="ml-2 hidden items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[.16em] text-ink-soft xl:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {PROFILE.status}
              </span>
            </button>

            <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
              {NAV.map(({ id, label }) => (
                <button key={id} type="button" onClick={() => goTo(id)} aria-current={active === id ? "true" : undefined} className={`relative px-3.5 py-2 text-[15px] font-medium transition-colors ${active === id ? "text-wine" : "text-ink-soft hover:text-ink"}`}>
                  {label}
                  {active === id && <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-wine" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href={PROFILE.cv} download className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-wine hover:text-wine sm:inline-flex">
                <Icon name="download" size={16} /> CV
              </a>
              <button type="button" onClick={() => goTo("contact")} className="whitespace-nowrap rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink">
                Work with me
              </button>
              <button type="button" onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
                <Icon name={open ? "x" : "menu"} size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu: a table of contents */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-paper-2 px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="soft-italic font-serif text-lg text-wine">Contents</p>
            <ul className="mt-4 flex flex-col border-t border-line">
              {NAV.map(({ id, label }, i) => (
                <li key={id} className="overflow-hidden border-b border-line">
                  <motion.button
                    type="button"
                    onClick={() => goTo(id)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.5, delay: 0.12 + i * 0.05, ease: EASE }}
                    className="flex w-full items-baseline justify-between py-3 text-left font-serif text-4xl"
                  >
                    {label}
                    <span className="soft-italic text-base text-ink-soft">{["I", "II", "III", "IV", "V", "VI", "VII"][i]}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
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
