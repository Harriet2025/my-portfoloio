"use client";

import { motion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Animated heading text. Each word (or letter) rises out of a mask when it scrolls into view,
 * or when `play` turns true if a parent controls the timing.
 */
export default function SplitText({
  text,
  as = "span",
  by = "word",
  className = "",
  delay = 0,
  stagger = 0.06,
  play,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  by?: "word" | "char";
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
}) {
  const Tag = motion[as];
  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const child: Variants = {
    hidden: { y: "110%", rotate: by === "char" ? 8 : 3 },
    show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const words = text.split(" ");
  const controlled = play !== undefined;

  return (
    <Tag
      className={className}
      variants={parent}
      initial="hidden"
      {...(controlled ? { animate: play ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, amount: 0.5 } })}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {(by === "char" ? word.split("") : [word]).map((piece, pi) => (
            <span key={pi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="inline-block origin-bottom-left" variants={child}>
                {piece}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
