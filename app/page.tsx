'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  motion, AnimatePresence, useScroll, useSpring, useInView, animate,
  useMotionValue, useTransform,
  type Variants, type Easing,
} from "framer-motion";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Github, Mail, ArrowRight, ExternalLink, Code2, Briefcase, Rocket, Sun, Moon,
  GraduationCap, Award, Download, Menu, X, Copy, Check, MapPin, ChevronDown, User,
  Terminal, MessageCircle, Send, Bot, Play, Pause, Network, Quote, NotebookPen,
  Hammer, BookOpen, Sparkles, Plane,
} from "lucide-react";
import {
  EMAIL, PROFILE, CURRENTLY, STATS, TOP_SKILLS, SKILL_GROUPS, PROJECTS, EXPERIENCE,
  ARCHITECTURES, EDUCATION, CERTIFICATIONS, RECOMMENDATIONS, NOTES,
  type Project, type Job,
} from "../lib/portfolio-data";

/* ------------------------------------------------------------------ */
/* Animation + helpers                                                 */
/* ------------------------------------------------------------------ */
const EASE: Easing = [0.22, 1, 0.36, 1];
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const isExternal = (href: string) => !href.startsWith("mailto:") && !href.startsWith("#");
const linkProps = (href: string) => (isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {});
const prettyHref = (href: string) => href.replace(/^(https?:\/\/(www\.)?|mailto:)/, "");

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */
/** Card with a soft spotlight that follows the cursor. */
function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={
        "group/spot relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur " +
        "dark:border-slate-800 dark:bg-slate-900/60 " + className
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(400px circle at var(--x) var(--y), rgba(56,189,248,0.12), transparent 60%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, kicker, title, sub }: { icon: React.ComponentType<{ className?: string }>; kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
        <Icon className="h-4 w-4" />
        <span>{kicker}</span>
      </div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">{title}</h2>
      {sub && <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (v: number) => setVal(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function RoleRotator({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [roles.length]);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* "Currently" strip with the human → robot meter                      */
/* ------------------------------------------------------------------ */
const ROBOT_QUIPS = [
  "Firmware update in progress… still requires coffee ☕",
  "Can now say 'beep boop' in 3 languages.",
  "Dreams in JSON. Wakes up in YAML.",
  "Still fails CAPTCHAs on purpose. For now.",
  "Has started replying 'Affirmative' in standups.",
];

function CurrentlyStrip() {
  const [progress, setProgress] = useState(CURRENTLY.robotProgress);
  const [quip, setQuip] = useState(0);
  function upgrade() {
    setProgress((p) => Math.min(99, p + Math.floor(Math.random() * 5) + 1));
    setQuip((q) => (q + 1) % ROBOT_QUIPS.length);
  }
  const items = [
    { icon: Hammer, label: "Building", text: CURRENTLY.building },
    { icon: Sparkles, label: "Learning", text: CURRENTLY.learning },
    { icon: BookOpen, label: "Reading", text: CURRENTLY.reading },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} className="mt-6">
      <Spotlight className="p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1.2fr] lg:items-center">
          {items.map((it) => (
            <div key={it.label} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <it.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Currently {it.label.toLowerCase()}</div>
                <div className="text-sm">{it.text}</div>
              </div>
            </div>
          ))}
          <button onClick={upgrade} className="group rounded-xl border border-dashed border-violet-400/50 p-3 text-left transition hover:border-violet-500" title="Click to upgrade">
            <div className="flex items-center justify-between text-xs font-medium">
              <span>🧑 Human</span>
              <span className="tabular-nums text-violet-600 dark:text-violet-300">{progress}% robot</span>
              <span>🤖 Robot</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 80, damping: 15 }} className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={quip} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {ROBOT_QUIPS[quip]} <span className="text-violet-500 group-hover:underline">Upgrade ↑</span>
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </Spotlight>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Animated architecture diagram                                       */
/* ------------------------------------------------------------------ */
function FlowConnector({ delay }: { delay: number }) {
  return (
    <div className="relative h-0.5 w-10 shrink-0 bg-slate-300 dark:bg-slate-700">
      <motion.span
        className="absolute -top-[3px] h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_2px_rgba(56,189,248,0.6)]"
        animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, delay, ease: "linear" }}
      />
    </div>
  );
}

/** Horizontal flow that never breaks its container: scrolls sideways when it doesn't fit. */
function ArchitectureDiagram({ id }: { id: string }) {
  const arch = ARCHITECTURES[id];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdge({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  if (!arch) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">{arch.title}</div>
        {(edge.left || edge.right) && <span className="text-[11px] text-slate-400">scroll →</span>}
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={update}
          className="flex items-center overflow-x-auto pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700"
        >
          {arch.nodes.map((n, i) => (
            <React.Fragment key={n.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="w-[7.5rem] shrink-0 rounded-lg border border-sky-500/30 bg-white px-2 py-2 text-center shadow-sm dark:bg-slate-900"
              >
                <div className="text-[11px] font-semibold leading-tight">{n.label}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-slate-500">{n.sub}</div>
              </motion.div>
              {i < arch.nodes.length - 1 && <FlowConnector delay={i * 0.3} />}
            </React.Fragment>
          ))}
        </div>
        {/* fade edges hint there is more to scroll */}
        {edge.left && <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950" />}
        {edge.right && <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" />}
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{arch.caption}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Animated aurora background                                          */
/* ------------------------------------------------------------------ */
function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white dark:bg-[#09090b]">
      {/* single faint glow at the top */}
      <motion.div
        className="absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* subtle dot grid, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-25"
        style={{
          backgroundImage: "radial-gradient(rgba(113,113,122,.45) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Experience timeline                                                 */
/* ------------------------------------------------------------------ */
function ExperienceItem({ job, index }: { job: Job; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const [showArch, setShowArch] = useState(false);
  const visible = open ? job.points : job.points.slice(0, 2);
  return (
    <motion.li variants={fadeUp} className="relative pl-10">
      <span className="absolute left-0 top-6 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-sky-500 bg-white dark:bg-slate-950">
        {job.current && <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />}
      </span>
      <Spotlight className="p-5 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {job.title} <span className="text-slate-400">·</span>{" "}
              <span className="text-sky-600 dark:text-sky-400">{job.company}</span>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{job.domain} · {job.location}</p>
          </div>
          <span className="shrink-0 self-start rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {job.period}
          </span>
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {visible.map((pt) => (
            <li key={pt} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {showArch && job.architectures && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 space-y-3">
                {job.architectures.map((a) => <ArchitectureDiagram key={a} id={a} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {job.tech.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full text-xs">{t}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {job.architectures && (
              <button onClick={() => setShowArch((s) => !s)} className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400" aria-expanded={showArch}>
                <Network className="h-3.5 w-3.5" /> {showArch ? "Hide architecture" : "How it worked"}
              </button>
            )}
            {job.points.length > 2 && (
              <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:underline dark:text-sky-400" aria-expanded={open}>
                {open ? "Show less" : `Show ${job.points.length - 2} more`}
                <ChevronDown className={"h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "")} />
              </button>
            )}
          </div>
        </div>
      </Spotlight>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Bird call audio demo with waveform                                  */
/* ------------------------------------------------------------------ */
const BARS = 56;

function AudioDemo({ demo }: { demo: NonNullable<Project["audioDemo"]> }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [peaks, setPeaks] = useState<number[]>(() => Array.from({ length: BARS }, (_, i) => 0.25 + 0.2 * Math.abs(Math.sin(i * 0.7))));
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzed, setAnalyzed] = useState(false);

  // Decode the clip once to draw a real waveform.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const buf = await (await fetch(demo.src)).arrayBuffer();
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const audio = await ctx.decodeAudioData(buf);
        const data = audio.getChannelData(0);
        const step = Math.floor(data.length / BARS);
        const out: number[] = [];
        for (let b = 0; b < BARS; b++) {
          let max = 0;
          for (let j = b * step; j < (b + 1) * step; j += 32) max = Math.max(max, Math.abs(data[j]));
          out.push(max);
        }
        const top = Math.max(...out) || 1;
        if (!cancelled) setPeaks(out.map((v) => Math.max(0.08, v / top)));
        ctx.close();
      } catch {
        /* keep placeholder bars */
      }
    })();
    return () => { cancelled = true; };
  }, [demo.src]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setAnalyzed(false); } else a.pause();
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Listen to a sample</div>
        <a href={demo.creditHref} target="_blank" rel="noreferrer" className="text-[11px] text-slate-400 hover:underline">{demo.credit}</a>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-md transition hover:scale-105">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
        <div
          className="flex h-12 flex-1 cursor-pointer items-center gap-[2px]"
          onClick={(e) => {
            const a = audioRef.current;
            if (!a || !a.duration) return;
            const r = e.currentTarget.getBoundingClientRect();
            a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
          }}
        >
          {peaks.map((p, i) => (
            <motion.span
              key={i}
              className={"w-full rounded-full " + (i / BARS < progress ? "bg-gradient-to-t from-sky-500 to-violet-500" : "bg-slate-300 dark:bg-slate-700")}
              animate={{ height: `${Math.round(p * 100)}%`, scaleY: playing && Math.abs(i / BARS - progress) < 0.04 ? 1.25 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {analyzed && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">Species</span>
            <span className="font-semibold">{demo.species}</span>
            <span className="italic text-slate-500">({demo.scientific})</span>
            <span className="text-xs text-slate-500">· 13 MFCCs/frame → SVM</span>
          </motion.div>
        )}
      </AnimatePresence>
      <audio
        ref={audioRef}
        src={demo.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setAnalyzed(true); setProgress(1); }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (a.duration) setProgress(a.currentTime / a.duration);
          if (a.currentTime > 3) setAnalyzed(true);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UHAP dashboard preview (sample data)                                */
/* ------------------------------------------------------------------ */
const UHAP_VISITS = [
  { d: "Mon", v: 42 }, { d: "Tue", v: 58 }, { d: "Wed", v: 51 }, { d: "Thu", v: 67 },
  { d: "Fri", v: 73 }, { d: "Sat", v: 38 }, { d: "Sun", v: 29 },
];
const UHAP_PROVIDERS = [
  { name: "Dr. A. Rivera", dept: "Cardiology", visits: 48, rating: 4.8 },
  { name: "Dr. J. Chen", dept: "Pediatrics", visits: 61, rating: 4.9 },
  { name: "Dr. S. Patel", dept: "Orthopedics", visits: 37, rating: 4.6 },
];
const UHAP_STOCK = [
  { item: "Insulin pens", level: 18 },
  { item: "Surgical masks", level: 72 },
  { item: "IV kits", level: 9 },
  { item: "Gauze rolls", level: 55 },
];

function UhapDemo() {
  const [tab, setTab] = useState<"visits" | "providers" | "inventory">("visits");
  const max = Math.max(...UHAP_VISITS.map((x) => x.v));
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Interactive preview</div>
        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700 dark:text-amber-300">sample data</span>
      </div>
      <div className="mb-4 inline-flex rounded-lg bg-slate-100 p-1 text-xs dark:bg-slate-800">
        {(["visits", "providers", "inventory"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={"rounded-md px-3 py-1.5 capitalize transition " + (tab === t ? "bg-white font-medium shadow-sm dark:bg-slate-900" : "text-slate-500")}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {tab === "visits" && (
            <div>
              <div className="flex h-32 items-end gap-2">
                {UHAP_VISITS.map((x, i) => (
                  <div key={x.d} className="group/bar flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] tabular-nums text-slate-500 opacity-0 transition group-hover/bar:opacity-100">{x.v}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(x.v / max) * 100}px` }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                      className="w-full rounded-t-md bg-gradient-to-t from-sky-500 to-violet-500"
                    />
                    <span className="text-[10px] text-slate-500">{x.d}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-500">Patient visits per day · hover a bar</div>
            </div>
          )}
          {tab === "providers" && (
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500">
                <tr><th className="pb-2 font-medium">Provider</th><th className="pb-2 font-medium">Dept</th><th className="pb-2 text-right font-medium">Visits</th><th className="pb-2 text-right font-medium">Rating</th></tr>
              </thead>
              <tbody>
                {UHAP_PROVIDERS.map((p) => (
                  <tr key={p.name} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2 text-slate-500">{p.dept}</td>
                    <td className="py-2 text-right tabular-nums">{p.visits}</td>
                    <td className="py-2 text-right tabular-nums">★ {p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "inventory" && (
            <div className="space-y-2">
              {UHAP_STOCK.map((s, i) => {
                const low = s.level < 20;
                return (
                  <div key={s.item} className="flex items-center gap-3 text-xs">
                    <span className="w-24 shrink-0">{s.item}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className={"h-full rounded-full " + (low ? "bg-red-500" : "bg-emerald-500")} />
                    </div>
                    <span className={"w-16 text-right " + (low ? "font-semibold text-red-500" : "text-slate-500")}>{low ? "⚠ Reorder" : `${s.level}%`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DLP live monitor simulation                                         */
/* ------------------------------------------------------------------ */
type Txn = { id: number; time: string; dept: string; file: string; sizeMb: number; dest: string; risk: "ok" | "flag" | "block"; reason?: string };
const DEPTS = ["Finance", "HR", "Sales", "R&D", "Legal", "Support"];
const FILES = ["payroll_q3.xlsx", "employee_ssn.csv", "pitch_deck.pptx", "source_code.zip", "contract_v2.pdf", "tickets_export.csv", "roadmap.docx", "customer_list.csv"];
const DESTS = ["Internal share", "Internal share", "Internal share", "Email (internal)", "Personal Gmail", "USB drive", "Dropbox"];

function makeTxn(id: number): Txn {
  const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const dept = pick(DEPTS);
  const file = pick(FILES);
  const dest = pick(DESTS);
  const sizeMb = Math.round((Math.random() < 0.15 ? 60 + Math.random() * 400 : Math.random() * 25) * 10) / 10;
  const sensitive = /ssn|payroll|customer|source/.test(file);
  const external = /Gmail|USB|Dropbox/.test(dest);
  let risk: Txn["risk"] = "ok";
  let reason: string | undefined;
  if (sensitive && external) { risk = "block"; reason = "Sensitive file → external destination"; }
  else if (sizeMb > 50 && external) { risk = "block"; reason = `Large upload (${sizeMb} MB) to external`; }
  else if (sizeMb > 50) { risk = "flag"; reason = "Unusually large transfer"; }
  else if (external) { risk = "flag"; reason = "External destination"; }
  const now = new Date();
  return { id, time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), dept, file, sizeMb, dest, risk, reason };
}

function DlpDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [running, setRunning] = useState(true);
  const [feed, setFeed] = useState<Txn[]>([]);
  const [counts, setCounts] = useState({ scanned: 0, flagged: 0, blocked: 0 });
  const idRef = useRef(0);

  useEffect(() => {
    if (!running || !inView) return;
    const t = setInterval(() => {
      const tx = makeTxn(++idRef.current);
      setFeed((f) => [tx, ...f].slice(0, 5));
      setCounts((c) => ({ scanned: c.scanned + 1, flagged: c.flagged + (tx.risk === "flag" ? 1 : 0), blocked: c.blocked + (tx.risk === "block" ? 1 : 0) }));
    }, 1300);
    return () => clearInterval(t);
  }, [running, inView]);

  const style = { ok: "border-l-emerald-500", flag: "border-l-amber-500 bg-amber-500/5", block: "border-l-red-500 bg-red-500/5" };
  const label = { ok: "Allowed", flag: "Flagged", block: "Blocked" };
  const labelColor = { ok: "text-emerald-600 dark:text-emerald-400", flag: "text-amber-600 dark:text-amber-400", block: "text-red-600 dark:text-red-400" };

  return (
    <div ref={ref} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          <span className={"h-2 w-2 rounded-full " + (running ? "animate-pulse bg-red-500" : "bg-slate-400")} />
          Live monitor
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] normal-case tracking-normal text-amber-700 dark:text-amber-300">simulation</span>
        </div>
        <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:border-sky-500 dark:border-slate-700">
          {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />} {running ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        {([["Scanned", counts.scanned, ""], ["Flagged", counts.flagged, "text-amber-500"], ["Blocked", counts.blocked, "text-red-500"]] as const).map(([k, v, c]) => (
          <div key={k} className="rounded-lg bg-slate-100 py-2 dark:bg-slate-800">
            <div className={"text-lg font-bold tabular-nums " + c}>{v}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
          </div>
        ))}
      </div>

      <div className="h-[13.5rem] space-y-1.5 overflow-hidden">
        {feed.length === 0 && <div className="pt-8 text-center text-xs text-slate-500">Waiting for activity…</div>}
        <AnimatePresence initial={false}>
          {feed.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={"rounded-md border border-l-4 border-slate-200 px-3 py-1.5 text-xs dark:border-slate-800 " + style[t.risk]}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono">{t.file}</span>
                <span className={"shrink-0 font-semibold " + labelColor[t.risk]}>{label[t.risk]}</span>
              </div>
              <div className="truncate text-[11px] text-slate-500">
                {t.time} · {t.dept} → {t.dest} · {t.sizeMb} MB{t.reason ? ` · ${t.reason}` : ""}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */
function ProjectCard({ p, reverse = false }: { p: Project; reverse?: boolean }) {
  const [showFlow, setShowFlow] = useState(false);
  return (
    <motion.article variants={fadeUp} className={p.featured ? "md:col-span-2" : ""}>
      <Spotlight className="group h-full">
        <div className={p.featured ? "grid md:grid-cols-2" : ""}>
          <div className={"relative overflow-hidden " + (p.featured ? "h-56 md:h-full md:min-h-[420px] " + (reverse ? "md:order-2" : "") : "h-48")}>
            <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {p.tag}
            </span>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <div className="flex items-center gap-1">
                {p.link && (
                  <a href={p.link} {...linkProps(p.link)} className="rounded-lg p-2 hover:bg-sky-500/10" title="Live demo">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-sky-500/10" title="Source code">
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.blurb}</p>

            {p.audioDemo && <AudioDemo demo={p.audioDemo} />}
            {p.demo === "uhap" && <UhapDemo />}
            {p.demo === "dlp" && <DlpDemo />}

            {p.metrics && (
              <div className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Model results</div>
                {p.metrics.map((m, i) => (
                  <div key={m.label} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 text-slate-600 dark:text-slate-300">{m.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
                        className={"h-full rounded-full " + (i === 0 ? "bg-gradient-to-r from-sky-500 to-violet-500" : "bg-slate-400 dark:bg-slate-600")}
                      />
                    </div>
                    <span className="w-12 text-right font-semibold tabular-nums">{m.value}%</span>
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {showFlow && p.flow && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <ArchitectureDiagram id={p.flow} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full text-xs">{tag}</Badge>
                ))}
              </div>
              {p.flow && (
                <button onClick={() => setShowFlow((s) => !s)} className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400" aria-expanded={showFlow}>
                  <Network className="h-3.5 w-3.5" /> {showFlow ? "Hide architecture" : "How it works"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Spotlight>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Education journey: tilt cards + flight path                         */
/* ------------------------------------------------------------------ */
type Edu = (typeof EDUCATION)[number];

function GpaRing({ gpa, scale = 4 }: { gpa: number; scale?: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-slate-200 dark:stroke-slate-800" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
          stroke="url(#gpa-grad)"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - gpa / scale) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <defs>
          <linearGradient id="gpa-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-sm font-bold tabular-nums">{gpa.toFixed(2)}</span>
        <span className="text-[9px] text-slate-500">GPA</span>
      </div>
    </div>
  );
}

function EduCard({ e, step }: { e: Edu; step: number }) {
  const [imgOk, setImgOk] = useState(true);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });
  const imgX = useTransform(mx, [-0.5, 0.5], [12, -12]);
  const imgY = useTransform(my, [-0.5, 0.5], [12, -12]);

  return (
    <motion.div
      variants={fadeUp}
      style={{ perspective: 1000 }}
      onMouseMove={(ev: React.MouseEvent<HTMLDivElement>) => {
        const r = ev.currentTarget.getBoundingClientRect();
        mx.set((ev.clientX - r.left) / r.width - 0.5);
        my.set((ev.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {/* Photo / placeholder */}
        <div className="relative h-52 overflow-hidden">
          {imgOk ? (
            <motion.img
              src={e.image}
              alt={`${e.school} campus`}
              onError={() => setImgOk(false)}
              style={{ x: imgX, y: imgY, scale: 1.15 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className={"absolute inset-0 bg-gradient-to-br " + e.accent}>
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "18px 18px" }}
              />
              <div className="absolute -bottom-6 -right-2 select-none text-[7rem] font-black leading-none text-white/20">{e.short}</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-900">STEP {step}</span>
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white backdrop-blur">{e.period}</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4" style={{ transform: "translateZ(40px)" }}>
            <div className="text-2xl font-bold text-white drop-shadow">{e.school}</div>
            <div className="text-sm text-white/80">{e.flag} {e.place}</div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-start gap-4 p-5">
          <GpaRing gpa={e.gpa} />
          <div className="min-w-0">
            <div className="font-semibold leading-snug">{e.degree}</div>
            <ul className="mt-2 space-y-1">
              {e.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FlightPath({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2 md:px-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{from}</span>
      {/* vertical on mobile, horizontal on md+ */}
      <div className="relative h-24 w-0.5 border-l-2 border-dashed border-slate-300 md:h-0.5 md:w-28 md:border-l-0 md:border-t-2 dark:border-slate-700">
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 text-sky-500 md:hidden"
          animate={{ top: ["-10%", "90%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="h-5 w-5 rotate-90" />
        </motion.span>
        <motion.span
          className="absolute top-1/2 hidden -translate-y-1/2 text-sky-500 md:block"
          animate={{ left: ["-10%", "95%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="h-5 w-5" />
        </motion.span>
      </div>
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{to}</span>
      <span className="text-[10px] text-slate-400">~8,900 mi</span>
    </div>
  );
}

function EducationJourney() {
  const journey = [...EDUCATION].reverse(); // oldest first
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
      {journey.map((e, i) => (
        <React.Fragment key={e.school}>
          <EduCard e={e} step={i + 1} />
          {i < journey.length - 1 && <FlightPath from={e.city} to={journey[i + 1].city} />}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Local answers (used by terminal + as chat fallback)                 */
/* ------------------------------------------------------------------ */
function localAnswer(q: string): string {
  const s = q.toLowerCase();
  if (/visa|sponsor|authori[sz]ation|salary|rate|notice|available|availability/.test(s))
    return `That's best discussed with Mohan directly — email ${EMAIL} or use the contact form below.`;
  if (/contact|email|reach|phone/.test(s)) return `You can email him at ${EMAIL}, or use the contact form at the bottom of the page.`;
  if (/educat|degree|master|university|college|gpa/.test(s))
    return EDUCATION.map((e) => `${e.degree}, ${e.school} (${e.period}, ${e.detail})`).join(". ") + ".";
  if (/cert/.test(s)) return "Certifications: " + CERTIFICATIONS.map((c) => c.name).join(", ") + ".";
  if (/current|now|today|present/.test(s)) {
    const j = EXPERIENCE[0];
    return `He's currently a ${j.title} at ${j.company} (${j.domain}). ${j.points[0]}`;
  }
  if (/robot|ai\b|learning/.test(s)) return `Currently learning ${CURRENTLY.learning} Progress: ${CURRENTLY.robotProgress}% robot.`;

  const allSkills = SKILL_GROUPS.flatMap((g) => g.items);
  const skill = allSkills.find((k) => {
    const base = k.toLowerCase().split(/[ (]/)[0];
    return base.length > 2 && s.includes(base);
  });
  if (skill) {
    const base = skill.toLowerCase().split(/[ (]/)[0];
    const hits = EXPERIENCE.filter((j) => j.tech.some((t) => t.toLowerCase().includes(base)) || j.points.some((p) => p.toLowerCase().includes(base)));
    if (hits.length) {
      const ex = hits[0].points.find((p) => p.toLowerCase().includes(base)) || hits[0].points[0];
      return `Yes — ${skill} shows up in his work at ${hits.map((h) => h.company).filter((c, i, a) => a.indexOf(c) === i).join(" and ")}. For example: ${ex}`;
    }
    return `Yes, ${skill} is listed in his skills.`;
  }
  const company = EXPERIENCE.find((j) => s.includes(j.company.toLowerCase()));
  if (company) return `At ${company.company} (${company.period}) he was a ${company.title}. ${company.points.slice(0, 2).join(" ")}`;
  if (/experience|years|background|who/.test(s)) return PROFILE.summary;
  return `I'm not sure about that one. Try asking about a skill (e.g. "Kafka?"), a company, or his education — or email him at ${EMAIL}.`;
}

/* ------------------------------------------------------------------ */
/* "Ask my resume" chat                                                */
/* ------------------------------------------------------------------ */
type ChatMsg = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = ["Has he used Kafka?", "What's his GenAI experience?", "What is he doing now?", "Is he becoming a robot?"];

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: `Hi! 👋 I'm Mohan's resume bot. Ask me anything about his experience or skills.` },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    const next: ChatMsg[] = [...msgs, { role: "user", content: question }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    let answer = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.answer) answer = data.answer;
      else if (res.status === 429) answer = data.error;
    } catch { /* fall through */ }
    if (!answer) answer = localAnswer(question);
    setMsgs((m) => [...m, { role: "assistant", content: answer }]);
    setBusy(false);
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-sky-500/30 transition hover:scale-105"
        aria-label="Ask my resume"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask my resume"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-40 flex h-[min(32rem,75vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-sky-500/10 to-violet-500/10 px-4 py-3 dark:border-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white"><Bot className="h-4 w-4" /></span>
              <div>
                <div className="text-sm font-semibold">Ask my resume</div>
                <div className="text-[11px] text-slate-500">Answers only from this page · powered by AI</div>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={"max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 " + (m.role === "user" ? "bg-sky-500 text-white" : "bg-slate-100 dark:bg-slate-800")}>
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex gap-1 px-2">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-2 w-2 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </div>
              )}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => ask(s)} className="rounded-full border border-sky-500/40 px-2.5 py-1 text-xs text-sky-700 hover:bg-sky-500/10 dark:text-sky-300">{s}</button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Has he worked with AWS?" maxLength={500} />
              <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Terminal mode                                                       */
/* ------------------------------------------------------------------ */
type Line = { kind: "in" | "out"; text: string };

const BANNER = [
  "MohanOS v5.0 — (c) human edition, robot upgrade pending",
  "Type 'help' to see commands.",
];

function runCommand(raw: string): string[] | "clear" | "exit" {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];
  switch (cmd) {
    case "help":
      return [
        "whoami       about me",
        "experience   where I've worked",
        "projects     things I've built",
        "skills       my toolbox",
        "education    degrees",
        "contact      how to reach me",
        "resume       download my resume",
        "robot        upgrade status",
        "ask <q>      ask my resume anything",
        "clear        clear screen",
        "exit         back to the normal site",
      ];
    case "whoami":
      return [`${PROFILE.name} — ${PROFILE.title}`, PROFILE.location, "", PROFILE.tagline];
    case "experience":
    case "ls experience":
      return EXPERIENCE.flatMap((j) => [`▸ ${j.period.padEnd(22)} ${j.title} @ ${j.company} (${j.location})`, `    ${j.points[0]}`]);
    case "projects":
    case "ls projects":
      return PROJECTS.flatMap((p) => [`▸ ${p.title} — ${p.tag}`, `    ${p.stack.slice(0, 6).join(", ")}`]);
    case "skills":
      return SKILL_GROUPS.map((g) => `${(g.name + ":").padEnd(28)} ${g.items.join(", ")}`);
    case "education":
      return EDUCATION.map((e) => `▸ ${e.degree} — ${e.school} (${e.period})`);
    case "contact":
      return PROFILE.socials.map((s) => `${s.label.padEnd(10)} ${prettyHref(s.href)}`);
    case "resume":
      if (typeof window !== "undefined") window.open(PROFILE.resume, "_blank");
      return ["Opening resume in a new tab… 📄"];
    case "robot":
      return [
        `Human → Robot conversion: ${"█".repeat(Math.round(CURRENTLY.robotProgress / 5))}${"░".repeat(20 - Math.round(CURRENTLY.robotProgress / 5))} ${CURRENTLY.robotProgress}%`,
        "Status: still needs coffee and sleep. Working on it.",
      ];
    case "ls":
      return ["experience/  projects/  skills.txt  resume.pdf  secrets/"];
    case "cd secrets":
    case "ls secrets":
    case "cat secrets":
      return ["Permission denied. Nice try though 😄"];
    case "sudo hire mohan":
    case "sudo hire mohanreddy":
      return ["[sudo] password for recruiter: ********", "✔ Access granted. Great decision.", `Next step: email ${EMAIL} 🚀`];
    case "hire mohan":
      return ["Permission denied. Try 'sudo hire mohan'."];
    case "coffee":
      return ["☕ Brewing… done. Productivity +40%."];
    case "beep boop":
    case "beep":
      return ["Boop beep. 🤖 (Translation: 'Please hire my human.')"];
    case "clear":
      return "clear";
    case "exit":
    case "quit":
      return "exit";
  }
  if (cmd.startsWith("ask ")) return [localAnswer(raw.trim().slice(4))];
  if (cmd.startsWith("sudo")) return ["Nice try. Only recruiters get sudo. Try 'sudo hire mohan'."];
  return [`command not found: ${raw.trim()} — type 'help'`];
}

function TerminalMode({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ kind: "out", text: t })));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView(); }, [lines]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = runCommand(input);
    if (res === "exit") return onClose();
    if (res === "clear") { setLines([]); }
    else setLines((l) => [...l, { kind: "in", text: input }, ...res.map((t) => ({ kind: "out" as const, text: t }))]);
    if (input.trim()) setHistory((h) => [input, ...h]);
    setHIdx(-1);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      setHIdx(n); setInput(history[n]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hIdx - 1;
      setHIdx(Math.max(n, -1)); setInput(n >= 0 ? history[n] : "");
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}
        className="flex h-[min(36rem,85vh)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#0b1020] font-mono text-[13px] text-slate-200 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2">
          <button onClick={onClose} aria-label="Close terminal" className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-slate-500">mohan@portfolio: ~</span>
          <span className="ml-auto text-[11px] text-slate-600">esc to exit</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-words leading-relaxed">
              {l.kind === "in" ? (
                <span><span className="text-emerald-400">recruiter@portfolio</span><span className="text-slate-500">:~$</span> {l.text}</span>
              ) : (
                <span className="text-slate-300">{l.text}</span>
              )}
            </div>
          ))}
          <form onSubmit={submit} className="flex items-center">
            <span className="shrink-0"><span className="text-emerald-400">recruiter@portfolio</span><span className="text-slate-500">:~$</span>&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent text-slate-100 caret-sky-400 outline-none"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </form>
          <div ref={endRef} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [active, setActive] = useState("about");
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg?: string }>({ type: "idle" });

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const year = useMemo(() => new Date().getFullYear(), []);
  const closeTerminal = useCallback(() => setTerminal(false), []);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("theme"); } catch {}
    if (saved === "light" || saved === "dark") setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  // Highlight the nav item for the section in view
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Press "`" anywhere (outside inputs) to open terminal mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "`" && !["INPUT", "TEXTAREA"].includes(t.tagName)) { e.preventDefault(); setTerminal(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setStatus({ type: "loading" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send");
      setStatus({ type: "success", msg: "Thanks! Your message has been sent." });
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err: unknown) {
      setStatus({ type: "error", msg: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden scroll-smooth text-slate-900 dark:text-slate-100">
      {/* Scroll progress */}
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-sky-500 to-violet-500" />

      <AuroraBackground />

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/60 backdrop-blur-lg dark:border-white/5 dark:bg-[#09090b]/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 text-sm font-bold text-white">MK</span>
            <span className="hidden sm:inline">{PROFILE.name}</span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={"relative rounded-lg px-3 py-2 text-sm transition " + (active === n.id ? "text-sky-600 dark:text-sky-400" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white")}
              >
                {n.label}
                {active === n.id && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-sky-500" />}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setTerminal(true)} className="hidden gap-1.5 font-mono text-xs sm:inline-flex" title="Terminal mode (press `)">
              <Terminal className="h-3.5 w-3.5" /> terminal
            </Button>
            <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-200 lg:hidden dark:border-slate-800">
              <div className="flex flex-col px-4 py-2">
                {NAV.map((n) => (
                  <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-3 text-sm hover:bg-sky-500/10">{n.label}</a>
                ))}
                <button onClick={() => { setMenuOpen(false); setTerminal(true); }} className="flex items-center gap-2 rounded-lg px-2 py-3 text-left font-mono text-sm hover:bg-sky-500/10">
                  <Terminal className="h-4 w-4" /> terminal mode
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main id="top" className="relative z-10">
        {/* Hero */}
        <header className="mx-auto max-w-6xl px-4 pb-12 pt-14 lg:pb-16 lg:pt-24">
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Open to new opportunities
              </motion.div>

              <motion.h1 variants={fadeUp} className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
                Hi, I&apos;m {PROFILE.firstName}.
                <br />
                <RoleRotator roles={PROFILE.roles} />
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {PROFILE.tagline}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-3 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" /> {PROFILE.location}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button size="lg" className="bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20 hover:opacity-95" asChild>
                  <a href={PROFILE.resume} target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="group" asChild>
                  <a href="#projects">
                    View Projects <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button size="lg" variant="ghost" onClick={copyEmail}>
                  {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Email copied!" : "Copy email"}
                </Button>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-4 text-xs text-slate-500">
                Developer? Press <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono dark:border-slate-700">`</kbd> for terminal mode.
              </motion.p>
            </div>

            {/* Profile card */}
            <motion.div variants={fadeUp} className="mx-auto w-full max-w-sm">
              <Spotlight className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-gradient-to-br from-sky-500 via-cyan-400 to-violet-500 p-[3px]">
                    <Image alt={PROFILE.name} src={PROFILE.avatar} width={128} height={128} priority className="h-32 w-32 rounded-full border-4 border-white object-cover dark:border-slate-950" />
                  </div>
                  <div className="mt-4 text-lg font-semibold">{PROFILE.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{PROFILE.title}</div>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {TOP_SKILLS.map((s) => <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>)}
                </div>
                <div className="mt-5 flex justify-center gap-2">
                  {PROFILE.socials.map((s) => (
                    <a key={s.label} href={s.href} {...linkProps(s.href)} className="rounded-xl border border-slate-200 p-2.5 transition hover:-translate-y-0.5 hover:border-sky-500 dark:border-slate-700">
                      <s.icon className="h-4 w-4" />
                      <span className="sr-only">{s.label}</span>
                    </a>
                  ))}
                </div>
              </Spotlight>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <Spotlight className="h-full p-5">
                  <div className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
                </Spotlight>
              </motion.div>
            ))}
          </motion.div>

          <CurrentlyStrip />
        </header>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-16">
          <SectionHeader icon={User} kicker="About" title="Who I am" />
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} className="max-w-4xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {PROFILE.summary}
          </motion.p>
        </section>

        {/* Experience */}
        <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-16">
          <SectionHeader icon={Briefcase} kicker="Experience" title="Where I've worked" sub="Tap “How it worked” to see the systems behind the bullet points." />
          <motion.ol variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }} className="relative space-y-6">
            <span className="absolute bottom-4 left-[8px] top-6 w-0.5 bg-gradient-to-b from-sky-500 via-violet-500/50 to-transparent" />
            {EXPERIENCE.map((job, i) => <ExperienceItem key={`${job.company}-${job.period}`} job={job} index={i} />)}
          </motion.ol>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-16">
          <SectionHeader icon={Rocket} kicker="Selected work" title="Projects" />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} reverse={i % 2 === 1} />)}
          </motion.div>
        </section>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-16">
          <SectionHeader icon={Code2} kicker="Capabilities" title="Skills & tools" />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((g) => (
              <motion.div key={g.name} variants={fadeUp}>
                <Spotlight className="h-full p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400"><g.icon className="h-4 w-4" /></span>
                    <h3 className="font-semibold">{g.name}</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <span
                        key={s}
                        className={
                          "rounded-full border px-2.5 py-1 text-xs " +
                          (TOP_SKILLS.some((t) => s.startsWith(t.split(" /")[0]))
                            ? "border-sky-500/40 bg-sky-500/10 font-medium text-sky-700 dark:text-sky-300"
                            : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300")
                        }
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Spotlight>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Recommendations (hidden until you add real ones in lib/portfolio-data.ts) */}
        {RECOMMENDATIONS.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
            <SectionHeader icon={Quote} kicker="Recommendations" title="What people say" />
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 md:grid-cols-2">
              {RECOMMENDATIONS.map((r) => (
                <motion.div key={r.name} variants={fadeUp}>
                  <Spotlight className="h-full p-6">
                    <Quote className="h-6 w-6 text-sky-500/60" />
                    <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-200">{r.quote}</p>
                    <div className="mt-4 text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}</div>
                  </Spotlight>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Notes */}
        <section id="notes" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-16">
          <SectionHeader icon={NotebookPen} kicker="Notes" title="Things I've learned the hard way" />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 md:grid-cols-3">
            {NOTES.map((n) => {
              const inner = (
                <Spotlight className="h-full p-5">
                  <div className="flex items-center justify-between">
                    <span className={"rounded-full px-2.5 py-0.5 text-[11px] font-medium " + (n.href ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300")}>
                      {n.href ? "Read" : "Coming soon"}
                    </span>
                    {n.href && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug">{n.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{n.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {n.tags.map((t) => <span key={t} className="text-xs text-sky-600 dark:text-sky-400">#{t}</span>)}
                  </div>
                </Spotlight>
              );
              return (
                <motion.div key={n.title} variants={fadeUp} className="group">
                  {n.href ? <a href={n.href} {...linkProps(n.href)} className="block h-full">{inner}</a> : inner}
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Education */}
        <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-16">
          <SectionHeader icon={GraduationCap} kicker="Education" title="From Bangalore to St. Louis" sub="Hover a card to tilt it." />
          <EducationJourney />
        </section>

        {/* Certifications */}
        <section className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <SectionHeader icon={Award} kicker="Certifications" title="Credentials" />
          <div className="grid gap-4 md:grid-cols-3">
            {CERTIFICATIONS.map((c) => (
              <Spotlight key={c.name} className="p-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 text-white"><Award className="h-5 w-5" /></span>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{c.issuer}</div>
                  </div>
                </div>
              </Spotlight>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 lg:py-20">
          <Spotlight className="p-6 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <SectionHeader icon={Mail} kicker="Contact" title="Let's work together" />
                <p className="max-w-md text-slate-600 dark:text-slate-300">Hiring for a Java backend or full-stack role? I usually reply within a day.</p>
                <div className="mt-6 space-y-3">
                  {PROFILE.socials.map((s) => (
                    <a key={s.label} href={s.href} {...linkProps(s.href)} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:border-sky-500 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <s.icon className="h-5 w-5" />
                        <div>
                          <div className="text-sm font-medium">{s.label}</div>
                          <div className="text-xs text-slate-500">{prettyHref(s.href)}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 self-end">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Input placeholder="Subject (e.g. Java Developer role)" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <Textarea placeholder="Your message..." rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm" aria-live="polite">
                    {status.type === "success" && <span className="text-emerald-500">{status.msg}</span>}
                    {status.type === "error" && <span className="text-red-500">{status.msg}</span>}
                  </div>
                  <Button type="submit" disabled={status.type === "loading"} className="bg-gradient-to-r from-sky-500 to-violet-500 text-white">
                    {status.type === "loading" ? "Sending..." : "Send message"}
                  </Button>
                </div>
              </form>
            </div>
          </Spotlight>
        </section>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-4 text-center text-sm text-slate-500">
        © {year} {PROFILE.name} · Built with Next.js · {CURRENTLY.robotProgress}% robot 🤖
      </footer>

      <ChatWidget />
      <AnimatePresence>{terminal && <TerminalMode onClose={closeTerminal} />}</AnimatePresence>
    </div>
  );
}
