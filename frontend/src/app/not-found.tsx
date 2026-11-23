import TransitionLink from "@/components/ui/TransitionLink";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-[clamp(6rem,25vw,18rem)] font-extrabold leading-none text-outline">404</p>
      <p className="mt-4 text-mute">This page does not exist.</p>
      <TransitionLink href="/" label="Home" className="mt-8 rounded-full bg-ember px-6 py-3 font-semibold text-ink hover:bg-cream">
        Back home
      </TransitionLink>
    </main>
  );
}
