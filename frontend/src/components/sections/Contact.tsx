"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PROFILE } from "@/content/site";
import { sendContact } from "@/lib/api";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";

const TOPICS = ["Web project", "Automation", "Job opportunity", "Something else"] as const;
const STAMP_TONES = ["bg-blush", "bg-sage-soft", "bg-paper-3"];
const EASE = [0.22, 1, 0.36, 1] as const;
type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-x-clip bg-paper-2 pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <SectionLabel index="VI">Contact</SectionLabel>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
            <SplitText text="Write me" /> <SplitText text="a letter" className="soft-italic text-wine" delay={0.08} />
          </h2>
          <p className="flex items-center gap-2 text-sm font-semibold text-sage">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-sage/60" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-sage" />
            </span>
            Open to new projects and roles
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <Letter />
          <div className="flex flex-col gap-6">
            <p className="soft-italic font-serif text-xl text-ink-soft">Or find me here</p>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
              {PROFILE.socials.map((s, i) => (
                <motion.li key={s.label} initial={{ opacity: 0, y: 30, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: [-3, 2, -1.5][i] }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }} whileHover={{ rotate: 0, y: -6, scale: 1.03 }}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={`stamp block ${STAMP_TONES[i % STAMP_TONES.length]} shadow-[0_14px_30px_-18px_rgba(42,32,36,.5)]`}>
                    <span className="flex aspect-[4/5] flex-col justify-between border border-ink/15 p-4">
                      <span className="flex items-start justify-between">
                        <Icon name={s.icon} size={24} className="text-wine" />
                        <span className="soft-italic font-serif text-sm text-ink-soft">GH</span>
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-ink-soft">{s.label}</span>
                        <span className="mt-1 block truncate font-serif text-lg">{s.handle}</span>
                      </span>
                    </span>
                  </a>
                </motion.li>
              ))}
              <li className="col-span-2 sm:col-span-3 lg:col-span-2">
                <Postmark />
              </li>
            </ul>
            <EmailLine />
          </div>
        </div>
      </div>

      <Colophon />
    </section>
  );
}

function Letter() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Web project");
  const [today, setToday] = useState("");

  useEffect(() => {
    const t = requestAnimationFrame(() => setToday(new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date())));
    return () => cancelAnimationFrame(t);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      await sendContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        website: String(data.get("website") ?? ""),
        topic,
      });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const field = "w-full bg-transparent font-serif text-xl placeholder:text-ink/30 focus:outline-none";

  return (
    <div className="relative min-h-[560px]">
      <AnimatePresence mode="wait">
        {status !== "sent" ? (
          <motion.form
            key="letter"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            exit={{ scaleY: 0.35, scaleX: 0.7, y: 120, opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative origin-bottom rounded-sm border border-paper-3 bg-[#fffdf8] p-7 shadow-[0_30px_60px_-30px_rgba(42,32,36,.45)] sm:p-10"
          >
            <p className="text-right text-sm text-ink-soft">
              Accra, <span className="soft-italic font-serif">{today}</span>
            </p>
            <p className="soft-italic mt-4 font-serif text-3xl text-wine">Dear Harriet,</p>

            <fieldset className="mt-6">
              <legend className="text-[13px] font-semibold uppercase tracking-[.16em] text-ink-soft">I&apos;m writing about</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button key={t} type="button" onClick={() => setTopic(t)} aria-pressed={topic === t} className={`relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${topic === t ? "border-transparent text-paper" : "border-line text-ink-soft hover:border-wine hover:text-wine"}`}>
                    {topic === t && <motion.span layoutId="topic" className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block">
              <span className="sr-only">Your message</span>
              <textarea name="message" required minLength={10} maxLength={4000} rows={6} placeholder="Tell me about your project, idea or role…" className={`${field} ruled resize-none leading-8`} data-lenis-prevent />
            </label>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="soft-italic font-serif text-lg text-ink-soft">Warmly,</span>
                <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={`${field} soft-italic mt-1 border-b border-line pb-2 text-2xl focus:border-wine`} />
              </label>
              <label className="block">
                <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-ink-soft">Where can I reply?</span>
                <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={`${field} mt-2 border-b border-line pb-2 text-lg focus:border-wine`} />
              </label>
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} type="submit" disabled={status === "sending"} className="inline-flex h-13 items-center gap-3 rounded-full bg-wine px-7 py-3.5 font-semibold text-paper shadow-[0_10px_30px_-12px_rgba(123,45,67,.6)] transition-colors hover:bg-ink disabled:opacity-70">
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" /> Sealing…
                  </>
                ) : (
                  <>
                    Seal &amp; send <Icon name="send" size={17} />
                  </>
                )}
              </motion.button>
              <p role="status" aria-live="polite" className="text-sm text-wine">
                {status === "error" ? error : ""}
              </p>
            </div>
          </motion.form>
        ) : (
          <Envelope key="envelope" onAgain={() => setStatus("idle")} />
        )}
      </AnimatePresence>
    </div>
  );
}

/** The sent state: an envelope closes, a wax seal is pressed, and a thank-you note appears. */
function Envelope({ onAgain }: { onAgain: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[560px] flex-col items-center justify-center text-center" role="status">
      <motion.div initial={{ y: 60, scale: 0.9 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE }} className="relative h-[200px] w-[min(340px,85vw)] [perspective:900px]">
        {/* body */}
        <div className="absolute inset-0 rounded-md bg-paper-3 shadow-[0_30px_60px_-30px_rgba(42,32,36,.55)]" />
        <div className="absolute inset-0 overflow-hidden rounded-md">
          <div className="absolute -left-1/4 bottom-0 h-[140%] w-[75%] origin-bottom-left rotate-[-32deg] bg-[#dccdb8]" />
          <div className="absolute -right-1/4 bottom-0 h-[140%] w-[75%] origin-bottom-right rotate-[32deg] bg-[#d6c6af]" />
        </div>
        {/* flap closes */}
        <motion.div initial={{ rotateX: 180 }} animate={{ rotateX: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-x-0 top-0 h-[62%] origin-top [transform-style:preserve-3d]">
          <div className="h-full w-full bg-[#e5d9c8] [clip-path:polygon(0_0,100%_0,50%_100%)] [backface-visibility:hidden]" />
        </motion.div>
        {/* wax seal */}
        <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -8 }} transition={{ delay: 1.05, type: "spring", stiffness: 260, damping: 12 }} className="soft-italic absolute left-1/2 top-[52%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-wine font-serif text-xl text-paper shadow-[0_6px_14px_rgba(123,45,67,.5),inset_0_-4px_8px_rgba(0,0,0,.25)]">
          HA
        </motion.span>
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="soft-italic mt-10 font-serif text-3xl text-wine">
        Thank you, your letter is on its way.
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-3 text-ink-soft">
        I&apos;ll reply within two working days.
      </motion.p>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} type="button" onClick={onAgain} className="mt-8 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-wine hover:text-wine">
        Write another letter
      </motion.button>
    </motion.div>
  );
}

function EmailLine() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div className="flex items-center gap-4 border-t border-line pt-6">
      <a href={`mailto:${PROFILE.email}`} className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-ink-soft">Prefer email?</span>
        <span className="block truncate font-serif text-xl transition-colors hover:text-wine">{PROFILE.email}</span>
      </a>
      <button type="button" onClick={copy} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium transition-colors hover:border-wine hover:text-wine" aria-label="Copy email address">
        <Icon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** A postmark with the live time in Accra. */
function Postmark() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" });
    const tick = () => setTime(fmt.format(new Date()));
    const first = requestAnimationFrame(tick);
    const t = setInterval(tick, 15000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(t);
    };
  }, []);
  return (
    <div className="flex items-center gap-5 py-2">
      <div className="grid h-24 w-24 shrink-0 rotate-[-10deg] place-items-center rounded-full border-2 border-dashed border-wine/60 text-center text-wine">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.2em]">Accra</p>
          <p className="font-serif text-2xl tabular-nums leading-tight">{time || "--:--"}</p>
          <p className="text-[10px] font-semibold uppercase tracking-[.2em]">GMT</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">Local time where I am. I usually reply within two working days.</p>
    </div>
  );
}

function Colophon() {
  const lenis = useLenis();
  return (
    <footer className="mx-auto mt-28 w-full max-w-[1240px] px-5 pb-12 sm:px-8">
      <div className="flex flex-col items-center border-t border-line pt-12 text-center">
        <span className="text-gold" aria-hidden="true">❦</span>
        <p className="soft-italic mt-4 font-serif text-2xl">Colophon</p>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Set in Fraunces and Manrope. Built with Next.js, React, GSAP, Motion and Lenis, with a Python (FastAPI) backend. Designed and written by {PROFILE.fullName}, © {new Date().getFullYear()}.
        </p>
        <button type="button" onClick={() => scrollToId(lenis, "top")} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-wine hover:text-ink">
          Back to the first page <Icon name="up" size={14} className="-rotate-45" />
        </button>
      </div>
    </footer>
  );
}
