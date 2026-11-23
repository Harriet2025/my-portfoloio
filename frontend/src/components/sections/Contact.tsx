"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PROFILE } from "@/content/site";
import { sendContact } from "@/lib/api";
import { scrollToId, useLenis } from "@/components/providers/SmoothScroll";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import Icon from "@/components/ui/Icon";
import Marquee from "./Marquee";

const TOPICS = ["Web project", "Automation", "Job opportunity", "Something else"] as const;
type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink-2 pt-28 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-[46rem] w-[90rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(242,100,58,.25),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <SectionLabel index="06">Contact</SectionLabel>
        <div className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[.18em] text-sage">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-sage/70" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-sage" />
          </span>
          Open to new projects and roles
        </div>
        <SplitText as="h2" text="Have a project in mind?" by="char" stagger={0.025} className="mt-6 block max-w-[12ch] font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold uppercase leading-[.86] tracking-tight" />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <ContactForm />
          <div className="flex flex-col gap-3">
            <EmailCard />
            {PROFILE.socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-line px-5 py-5"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-cream transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-cream/5 transition-colors duration-500 group-hover:bg-ink group-hover:text-ember">
                  <Icon name={s.icon} size={22} />
                </span>
                <span className="relative min-w-0 flex-1">
                  <span className="block font-mono text-[11px] uppercase tracking-[.16em] text-mute transition-colors group-hover:text-ink/60">{s.label}</span>
                  <span className="block truncate font-display text-xl font-bold transition-colors group-hover:text-ink">{s.handle}</span>
                </span>
                <span className="relative grid h-10 w-10 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:text-ink">
                  <Icon name="up" size={16} />
                </span>
              </motion.a>
            ))}
            <LocalTime />
          </div>
        </div>
      </div>

      <div className="mt-28">
        <Marquee items={["Let's build", "Web apps", "Automations", "Let's talk"]} tilt={0} />
      </div>
      <Footer />
    </section>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Web project");

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

  return (
    <form onSubmit={onSubmit} className="relative rounded-[2rem] border border-line bg-ink p-6 sm:p-8" noValidate={false}>
      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[.18em] text-mute">I&apos;m reaching out about</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button key={t} type="button" onClick={() => setTopic(t)} aria-pressed={topic === t} className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${topic === t ? "border-transparent text-ink" : "border-line hover:border-cream"}`}>
              {topic === t && <motion.span layoutId="topic" className="absolute inset-0 rounded-full bg-ember" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Your name" autoComplete="name" minLength={2} maxLength={80} />
        <Field name="email" label="Email address" type="email" autoComplete="email" />
      </div>
      <div className="mt-6">
        <Field name="message" label="Tell me about it" textarea minLength={10} maxLength={4000} />
      </div>
      {/* Honeypot for bots: hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Magnetic>
          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileTap={{ scale: 0.96 }}
            className={`relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full px-8 font-semibold text-ink transition-colors ${status === "sent" ? "bg-sage" : "bg-ember hover:bg-cream"}`}
            data-cursor="Send"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={status} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.25 }} className="flex items-center gap-2">
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" /> Sending…
                  </>
                ) : status === "sent" ? (
                  <>
                    <Icon name="check" size={18} /> Message sent
                  </>
                ) : (
                  <>
                    Send message <Icon name="send" size={17} />
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </Magnetic>
        <p role="status" aria-live="polite" className={`text-sm ${status === "error" ? "text-[#ff9b8a]" : "text-mute"}`}>
          {status === "sent" ? "Thank you! I'll reply within two working days." : status === "error" ? error : ""}
        </p>
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", textarea, ...rest }: { name: string; label: string; type?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const base = "peer w-full border-b border-line bg-transparent pb-3 pt-6 text-lg placeholder-transparent transition-colors focus:border-ember focus:outline-none";
  return (
    <label className="group relative block">
      {textarea ? (
        <textarea name={name} required rows={4} placeholder={label} className={`${base} resize-none`} minLength={rest.minLength} maxLength={rest.maxLength} data-lenis-prevent />
      ) : (
        <input name={name} type={type} required placeholder={label} className={base} {...rest} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 font-mono text-[11px] uppercase tracking-[.18em] text-mute transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:font-sans peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:font-mono peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[.18em] peer-focus:text-ember">
        {label}
      </span>
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 peer-focus:scale-x-100" />
    </label>
  );
}

function EmailCard() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-line bg-ink px-5 py-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ember text-ink">
        <Icon name="mail" size={22} />
      </span>
      <a href={`mailto:${PROFILE.email}`} className="min-w-0 flex-1" data-cursor="Write">
        <span className="block font-mono text-[11px] uppercase tracking-[.16em] text-mute">Email</span>
        <span className="block truncate font-display text-lg font-bold hover:text-ember">{PROFILE.email}</span>
      </a>
      <button type="button" onClick={copy} className="relative h-10 shrink-0 overflow-hidden rounded-full border border-line px-4 font-mono text-xs transition-colors hover:border-cream" aria-label="Copy email address">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={String(copied)} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="flex items-center gap-1.5">
            <Icon name={copied ? "check" : "copy"} size={13} /> {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Africa/Accra" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-between rounded-3xl border border-line px-5 py-4 font-mono text-xs uppercase tracking-[.16em] text-mute">
      <span className="flex items-center gap-2">
        <Icon name="pin" size={14} /> {PROFILE.location}
      </span>
      <span className="tabular-nums text-cream">{time || "--:--:--"} GMT</span>
    </div>
  );
}

function Footer() {
  const lenis = useLenis();
  return (
    <footer className="relative mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-10 font-mono text-xs text-mute sm:px-8">
      <p>© {new Date().getFullYear()} {PROFILE.fullName}</p>
      <p>Built with Next.js, GSAP, Motion, Lenis and a Python API.</p>
      <button type="button" onClick={() => scrollToId(lenis, "top")} className="inline-flex items-center gap-2 uppercase tracking-[.16em] hover:text-cream">
        Back to top <Icon name="up" size={14} className="-rotate-45" />
      </button>
    </footer>
  );
}
