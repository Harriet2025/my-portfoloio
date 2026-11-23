import TransitionLink from "@/components/ui/TransitionLink";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
      <p className="soft-italic font-serif text-[clamp(6rem,22vw,16rem)] font-light leading-none text-wine">404</p>
      <p className="mt-4 text-ink-soft">This page is missing from the shelf.</p>
      <TransitionLink href="/" label="Home" className="mt-8 rounded-full bg-wine px-6 py-3 font-semibold text-paper hover:bg-ink">
        Back home
      </TransitionLink>
    </main>
  );
}
