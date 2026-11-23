"use client";

import { MotionConfig } from "motion/react";
import SmoothScroll from "./SmoothScroll";
import TransitionProvider from "./Transition";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <TransitionProvider>{children}</TransitionProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
