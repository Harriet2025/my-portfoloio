"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * A dot plus a trailing ring. Any element with data-cursor="Label" grows the ring and shows the label.
 * Only runs on devices with a fine pointer (mouse / trackpad).
 */
const FINE = "(hover: hover) and (pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function Cursor() {
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(FINE).matches, () => false);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button");
      setHovering(!!el);
      setLabel(el?.dataset.cursor ?? "");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const big = !!label;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember" style={{ x, y }} />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: big ? 96 : hovering ? 56 : 34,
          height: big ? 96 : hovering ? 56 : 34,
          backgroundColor: big ? "rgba(243,236,226,1)" : "rgba(243,236,226,0)",
          borderColor: "rgba(243,236,226,.7)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {big && <span className="font-mono text-[11px] font-medium uppercase tracking-[.15em] text-ink">{label}</span>}
      </motion.div>
    </div>
  );
}
