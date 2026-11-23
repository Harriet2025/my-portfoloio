"use client";

import Image from "next/image";
import { animate, AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ABOUT_STORY, PROFILE, STATS, STRENGTHS } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

type Story = (typeof ABOUT_STORY)[number];

const TONES: Record<Story["tone"], { card: string; ink: string; soft: string; accent: string; line: string }> = {
  paper: { card: "bg-[#fffdf8]", ink: "text-ink", soft: "text-ink/75", accent: "text-wine", line: "border-line" },
  blush: { card: "bg-blush", ink: "text-ink", soft: "text-ink/75", accent: "text-wine", line: "border-wine/20" },
  night: { card: "bg-night-2", ink: "text-paper", soft: "text-paper/80", accent: "text-rose", line: "border-paper/15" },
  sage: { card: "bg-[#56654a]", ink: "text-paper", soft: "text-paper/85", accent: "text-[#e9dcc0]", line: "border-paper/20" },
};
/* Scroll "time" for each card: it slides in over 1 unit, then holds still for reading. */
const SLIDE = 1;
const HOLD = 0.9;
const STEP = SLIDE + HOLD;

export default function About() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const n = ABOUT_STORY.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Story cards stack on each other as you scroll, on every screen size.
      // Each card slides fully into place, then everything holds still so it can be read.
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-acard]");
        gsap.set(cards, { gridArea: "1 / 1" });
        gsap.set(cards.slice(1), { y: () => window.innerHeight });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-astack]",
            start: "top top",
            end: () => `+=${(cards.length - 1) * window.innerHeight * 1.1}`,
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // a card counts as current once it is about halfway in
              const idx = Math.max(0, Math.min(cards.length - 1, Math.floor((self.progress * tl.duration() + STEP - HOLD * 0.4 - SLIDE * 0.5) / STEP)));
              if (idx !== activeRef.current) {
                activeRef.current = idx;
                setActive(idx);
              }
            },
          },
        });
        cards.forEach((card, i) => {
          if (!i) return;
          const at = (i - 1) * STEP + HOLD * 0.4;
          tl.to(card, { y: 0, ease: "power2.out", duration: SLIDE }, at).to(cards[i - 1].querySelector("[data-shade]"), { opacity: 0.25, ease: "none", duration: SLIDE }, at);
        });
        tl.to({}, { duration: HOLD });
        tlRef.current = tl;
        // The portrait drifts gently inside its frame as the chapter arrives.
        gsap.to("[data-aphoto]", { yPercent: -8, scale: 1.06, ease: "none", scrollTrigger: { trigger: "[data-astack]", start: "top bottom", end: "top top", scrub: true } });
        return () => {
          tlRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /** Jump to the point where card k has fully arrived. */
  const goTo = (k: number) => {
    const tl = tlRef.current;
    const st = tl?.scrollTrigger;
    if (!tl || !st) {
      document.querySelectorAll("[data-acard]")[k]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const t = k === 0 ? 0 : (k - 1) * STEP + HOLD * 0.4 + SLIDE + 0.05;
    const y = st.start + (t / tl.duration()) * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={root} id="about" className="relative overflow-x-clip">
      {/* Pinned stage: the story cards stack here */}
      <div data-astack className="relative flex min-h-[100svh] flex-col pb-5 pt-[4.5rem] motion-safe:h-[100svh] motion-safe:overflow-hidden sm:pt-[5.5rem]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-8">
          <div>
            <SectionLabel index="I">About me</SectionLabel>
            <h2 className="mt-2 font-serif text-[clamp(1.6rem,min(3.4vw,5svh),2.8rem)] font-light leading-[1.05]">
              <SplitText text="A little" /> <SplitText text="about me" className="soft-italic text-wine" delay={0.08} />
            </h2>
          </div>
          {/* Which card you're on, and which one comes next. Tap a dot to jump. */}
          <div className="flex shrink-0 flex-row-reverse items-center justify-end gap-2 sm:flex-col sm:items-end sm:gap-1.5">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-ink-soft sm:text-right sm:text-[11px]" aria-live="polite">
              {active < n - 1 ? (
                <>
                  Next <span className="text-wine">· {ABOUT_STORY[active + 1].kicker}</span>
                </>
              ) : (
                "Keep scrolling"
              )}
            </p>
            <div className="-ml-1.5 flex items-center sm:ml-0">
              {ABOUT_STORY.map((st, k) => (
                <button key={st.kicker} type="button" onClick={() => goTo(k)} aria-label={`Card ${k + 1}: ${st.kicker}`} aria-current={k === active} className="group p-1.5">
                  <span className={`block h-2.5 rounded-full transition-all duration-500 ${k === active ? "w-8 bg-wine" : "w-2.5 bg-ink/20 group-hover:bg-ink/45"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 grid w-full max-w-[1240px] flex-1 items-center gap-6 px-5 motion-safe:min-h-0 sm:mt-4 sm:px-8">
          {ABOUT_STORY.map((s, i) => (
            <StoryCard key={s.kicker} story={s} index={i} total={ABOUT_STORY.length} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1240px] px-5 sm:px-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.li key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} className="relative pl-5">
              <span aria-hidden="true" className="absolute bottom-2 left-0 top-2 w-px bg-gold/50" />
              <p className="font-serif text-[clamp(2.8rem,5.5vw,4.4rem)] font-light leading-none text-wine">
                {s.steps ? <StepCounter steps={s.steps} /> : <Counter to={s.value} />}
                <span className="soft-italic">{s.suffix}</span>
              </p>
              <p className="mt-3 flex max-w-[26ch] items-center gap-2 text-sm font-medium leading-snug text-ink/70">
                {s.logo && <Logo name={s.logo} size={26} />}
                {s.label}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      <HowIWork />
    </section>
  );
}

function StoryCard({ story: s, index, total }: { story: Story; index: number; total: number }) {
  const t = TONES[s.tone];
  const lenis = useLenis();
  return (
    <article data-acard className={`relative isolate flex flex-col overflow-hidden rounded-[28px] motion-safe:h-full motion-safe:max-h-[700px] border ${t.line} ${t.card} shadow-[0_-20px_50px_-30px_rgba(42,32,36,.45),0_40px_80px_-40px_rgba(42,32,36,.55)]`}>
      <span data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-night opacity-0" />
      <div className="grid min-h-0 flex-1 content-center gap-4 p-5 sm:gap-6 sm:p-8 md:grid-cols-[1.15fr_.85fr] md:items-center md:gap-10 lg:px-14 lg:py-10">
        <div className="order-2 md:order-1">
          <p data-rise className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.22em] ${t.soft}`}>
            <span className={t.accent}>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-current opacity-40" />
            {s.kicker}
          </p>
          <h3 data-rise className={`mt-3 font-serif text-[clamp(1.7rem,min(4.2vw,6.2svh),3.6rem)] font-light leading-[1.04] tracking-[-.01em] ${t.ink}`}>
            {s.title} <span className={`soft-italic ${t.accent}`}>{s.italic}</span>
          </h3>
          <p data-rise className={`mt-3 max-w-[46ch] text-[15px] font-medium leading-relaxed sm:mt-4 sm:text-[17px] [@media(max-height:700px)]:text-[15px] ${t.soft}`}>
            {s.text}
          </p>
          {s.visual === "portrait" && (
            <p data-rise className="mt-4 inline-flex items-center gap-3 rounded-full border border-line bg-paper py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fffdf8]">
                <Logo name="ATU" size={30} />
              </span>
              Accra Technical University · Level 300
            </p>
          )}
          {s.visual === "cta" && (
            <div data-rise className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => scrollToId(lenis, "work")} className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                See my work <Icon name="arrow" size={15} />
              </button>
              <button type="button" onClick={() => scrollToId(lenis, "contact")} className="inline-flex items-center gap-2 rounded-full border border-paper/50 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10">
                Say hello
              </button>
            </div>
          )}
        </div>
        <div className="order-1 md:order-2">
          <StoryVisual story={s} />
        </div>
      </div>
    </article>
  );
}

function StoryVisual({ story: s }: { story: Story }) {
  if (s.visual === "portrait") {
    return (
      <div className="relative mx-auto aspect-[4/5] h-[clamp(110px,21svh,200px)] md:h-[min(50svh,400px)]">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-gold/70" aria-hidden="true" />
        <div className="relative h-full overflow-hidden rounded-t-full bg-paper-3">
          <div data-aphoto className="absolute inset-0">
            <Image src={PROFILE.headshot} alt={`Portrait of ${PROFILE.name}`} fill sizes="(min-width:768px) 300px, 45vw" className="object-cover object-[50%_22%]" />
          </div>
        </div>
      </div>
    );
  }
  if (s.visual === "roots") {
    return (
      <div className="relative flex flex-wrap justify-center gap-2.5 md:flex-col md:items-center md:gap-3">
        <span aria-hidden="true" className="soft-italic pointer-events-none absolute -top-16 left-1/2 hidden -translate-x-1/2 font-serif text-[9rem] leading-none text-wine/15 md:block">
          &ldquo;
        </span>
        {s.tags?.map((tag, i) => (
          <span key={tag} data-rise className="relative rounded-full border border-wine/25 bg-[#fffdf8] px-4 py-2 font-serif text-[14px] sm:px-5 sm:py-2.5 sm:text-[15px] text-ink shadow-[0_10px_24px_-14px_rgba(42,32,36,.5)] md:text-lg" style={{ rotate: `${[-3, 2, -1.5, 3][i % 4]}deg` }}>
            {tag}
          </span>
        ))}
      </div>
    );
  }
  if (s.visual === "now") {
    const tiles = [
      { icon: "layout", label: "Web apps", rot: -6, cls: "bg-[#fffdf8] text-ink" },
      { icon: "flow", label: "AI workflows", rot: 3, cls: "bg-rose text-night" },
      { icon: "play", label: "Content", rot: -2, cls: "bg-wine text-paper" },
    ];
    return (
      <div className="flex items-end justify-center gap-3 md:gap-4">
        {tiles.map((tile, i) => (
          <div key={tile.label} data-rise className={`flex w-[30%] max-w-[150px] flex-col items-center gap-2 rounded-2xl px-3 py-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)] md:gap-3 md:py-7 [@media(max-height:700px)]:py-3 ${tile.cls}`} style={{ rotate: `${tile.rot}deg`, marginBottom: i === 1 ? 24 : 0 }}>
            <Icon name={tile.icon} size={26} />
            <span className="text-center text-xs font-semibold sm:text-sm">{tile.label}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <div data-rise className="relative grid h-28 w-28 place-items-center rounded-full border border-paper/30 md:h-48 md:w-48">
        <span className="soft-italic font-serif text-4xl text-[#e9dcc0] md:text-7xl">HA</span>
        <span aria-hidden="true" className="absolute inset-3 rounded-full border border-dashed border-paper/25" />
      </div>
    </div>
  );
}

/* "How I work": a big list. Hover a row on desktop; on phones the row in the middle of the screen opens. */
function HowIWork() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const triggers = gsap.utils.toArray<HTMLElement>("[data-wrow]").map((row, i) =>
        ScrollTrigger.create({ trigger: row, start: "top 58%", end: "bottom 58%", onToggle: (self) => self.isActive && setActive(i) }),
      );
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-wrow]", { x: (i: number) => (i % 2 ? 60 : -60), opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "[data-wlist]", start: "top 80%" } });
      });
      return () => {
        triggers.forEach((t) => t.kill());
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[.2em] text-ink/70">How I work</p>
          <h3 className="mt-4 max-w-[18ch] font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.08]">
            Practical, organised and <span className="soft-italic text-wine">always shipping.</span>
          </h3>
        </div>
        <p className="max-w-[34ch] text-[15px] font-medium text-ink/70">
          <span className="hidden lg:inline">Hover a line to open it.</span>
          <span className="lg:hidden">Scroll and each line opens in turn.</span>
        </p>
      </div>

      <ul data-wlist className="mt-12 border-t border-line">
        {STRENGTHS.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.title} data-wrow onMouseEnter={() => setActive(i)} className="relative overflow-hidden border-b border-line">
              <motion.span aria-hidden="true" className="absolute inset-0 origin-bottom bg-wine" initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }} />
              <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 px-2 py-6 sm:gap-8 sm:px-6 sm:py-8">
                <span className={`font-mono text-sm transition-colors duration-500 ${on ? "text-rose" : "text-gold"}`}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <motion.h4 animate={{ x: on ? 12 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 22 }} className={`font-serif text-[clamp(1.6rem,3.6vw,3rem)] font-light leading-tight transition-colors duration-500 ${on ? "soft-italic text-paper" : "text-ink"}`}>
                    {s.title}
                  </motion.h4>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="max-w-[60ch] overflow-hidden pl-3 text-[15px] font-medium leading-relaxed text-paper/85 sm:text-base">
                        <span className="block pt-3">{s.text}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <motion.span animate={{ rotate: on ? 0 : -45, scale: on ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className={`grid h-12 w-12 place-items-center rounded-full transition-colors duration-500 sm:h-16 sm:w-16 ${on ? "bg-paper text-wine" : "border border-line text-ink"}`}>
                  <Icon name={on ? s.icon : "arrow"} size={on ? 22 : 18} />
                </motion.span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val}
    </span>
  );
}

/** Rolls through fixed values (100, 200, 300) like an odometer, then stops. */
function StepCounter({ steps }: { steps: number[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || i >= steps.length - 1) return;
    const t = setTimeout(() => setI((n) => n + 1), 650);
    return () => clearTimeout(t);
  }, [inView, i, steps.length]);
  return (
    <span ref={ref} className="relative inline-grid overflow-hidden align-bottom tabular-nums">
      <span className="invisible col-start-1 row-start-1">{steps[steps.length - 1]}</span>
      <AnimatePresence initial={false}>
        <motion.span key={steps[i]} className="col-start-1 row-start-1" initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}>
          {steps[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
