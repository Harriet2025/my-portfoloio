"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Phase = "intro" | "idle" | "cover" | "reveal";
type Ctx = { ready: boolean; navigate: (href: string, label?: string) => void };

const TransitionContext = createContext<Ctx>({ ready: true, navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Handles the first-load intro and the curtain between pages.
 * navigate() drops the curtain, swaps the route underneath, then lifts it on the new page.
 */
export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [label, setLabel] = useState("");
  const target = useRef<string | null>(null);
  const lastPath = useRef(pathname);

  const navigate = useCallback(
    (href: string, nextLabel = "") => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        router.push(href, { scroll: false });
        return;
      }
      if (reduce) {
        router.push(href);
        return;
      }
      target.current = href;
      setLabel(nextLabel);
      setPhase("cover");
    },
    [router, reduce],
  );

  // The route has changed underneath the curtain: lift it.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (phase === "cover") {
      const t = setTimeout(() => setPhase("reveal"), 150);
      return () => clearTimeout(t);
    }
  }, [pathname, phase]);

  return (
    <TransitionContext.Provider value={{ ready: phase !== "intro", navigate }}>
      {children}
      <Intro onDone={() => setPhase("idle")} active={phase === "intro"} />
      <AnimatePresence>
        {(phase === "cover" || phase === "reveal") && (
          <motion.div
            key="curtain"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ember text-ink"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={phase === "cover" ? { clipPath: "inset(0% 0 0 0)" } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: EASE }}
            onAnimationComplete={() => {
              if (phase === "cover" && target.current) {
                router.push(target.current);
                target.current = null;
              } else if (phase === "reveal") setPhase("idle");
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: phase === "cover" ? 1 : 0, y: phase === "cover" ? 0 : -30 }}
              transition={{ duration: 0.5, delay: phase === "cover" ? 0.25 : 0 }}
              className="px-6 text-center font-display text-[clamp(2.5rem,9vw,8rem)] font-extrabold uppercase leading-none tracking-tight"
            >
              {label || "Harriet Ayim"}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

/** First-visit preloader: a counter and the name, then the panel wipes up. Skipped for reduced motion and repeat visits. */
function Intro({ active, onDone }: { active: boolean; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    let raf = 0;
    if (reduce || seen) {
      raf = requestAnimationFrame(() => {
        setShow(false);
        onDone();
      });
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const DURATION = 1500;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => setShow(false), 250);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {active && show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-6 sm:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
        >
          <div className="flex justify-between font-mono text-xs uppercase tracking-[.2em] text-mute">
            <span>Portfolio</span>
            <span>Accra, GH</span>
          </div>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-[clamp(3rem,12vw,11rem)] font-extrabold uppercase leading-[.85] tracking-tight"
            >
              Harriet<span className="text-ember">.</span>
            </motion.p>
          </div>
          <div className="flex items-end justify-between">
            <div className="h-px flex-1 bg-line">
              <div className="h-px bg-ember" style={{ width: `${count}%` }} />
            </div>
            <span className="ml-6 font-display text-6xl font-extrabold tabular-nums sm:text-8xl">{count}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
