"use client";

import Link from "next/link";
import { usePageTransition } from "@/components/providers/Transition";

/** A Next.js Link that plays the curtain transition before changing page. */
export default function TransitionLink({
  href,
  label,
  children,
  ...rest
}: { href: string; label?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, label);
      }}
    >
      {children}
    </Link>
  );
}
