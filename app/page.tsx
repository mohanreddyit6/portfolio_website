'use client';
import React, { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import { motion, AnimatePresence, type Variants, type Easing } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Github, Linkedin, Mail, Sparkles, ArrowRight, ExternalLink, Code2, Briefcase, Rocket, Phone, Circle, Sun, Moon, GraduationCap, Award, Download } from "lucide-react";

const EASE: Easing = [0.22, 1, 0.36, 1];
// --- Helper animation variants ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE }, // uses typed tuple
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// --- Updated Profile Info (from latest resume) ---
const PROFILE = {
  name: "Mohanreddy Kondreddy",
  title: "Full‑Stack Software Engineer",
  location: "Open to Relocate · St. Louis, MO",
  summary:
    "An IT professional passionate about building scalable, efficient solutions and leveraging technology to solve real-world problems. Over the past 5+ years, I’ve gained valuable experience at Capital One(Current), Deloitte, and Fusion Software, building expertise in Java, React, SQL, AWS, and modern DevOps practices. I also hold a Master’s degree in Information Systems from Saint Louis University, With a strong foundation and a mindset for continuous growth, I’m eager to contribute to innovative projects that make a meaningful impact.",
  avatar:
    "/avatar.jpg",
  socials: [
    { label: "GitHub", icon: Github, href: "https://github.com/mohanreddyit6" },
    { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/mohanreddy-kondreddy-340246188" },
    
    { label: "Email", icon: Mail, href: "mailto:mohanreddy.k@protectmymails.com" },
  ],
};

// Surface key capabilities as chips
const SKILLS = [
  // Frontend
  "React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Responsive UI",
  // Backend
  "Java 17", "Spring Boot", "Spring MVC", "Hibernate", "Node.js", "Express.js", "GraphQL", "Microservices",
  // Cloud & DevOps
  "RESTful API", "AWS (EC2/S3/RDS/Lambda)", "Azure", "Docker", "Kubernetes", "CI/CD Automation", "Terraform", "CloudWatch",
  // Data & Streaming
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Apache Spark",
  // Security & Monitoring
  "Spring Security", "OAuth2", "JWT", "RBAC", "ELK Stack",
  // QA
  "JUnit", "Postman", "SOAP UI", "Drools Rule Engine",
  // Ways of working
  "Agile (Scrum/Kanban)", "Code Reviews", "Git/GitHub/GitLab/Bitbucket",
];

const PROJECTS = [
  {
    title: "Capital One – Real‑Time Banking Platform",
    blurb: "Architected Java 17/Spring Boot microservices and React TypeScript dashboards; integrated Kafka/GraphQL payment flows and event‑driven alerts; automated CI/CD on AWS (Lambda, EC2, S3).",
    stack: ["Java 17", "Spring Boot", "React", "TypeScript", "Kafka", "GraphQL", "AWS", "Docker", "Kubernetes"],
    link: "#experience",
    repo: "",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200&auto=format&fit=crop", // mobile banking app
  },
  {
    title: "Deloitte – Business Rule Automation",
    blurb: "Migrated 5000+ Oracle rules to RedHat Drools; delivered secure REST APIs and HIPAA‑compliant releases with Jenkins/Docker/K8s; ELK for observability.",
    stack: ["Java", "Drools", "Spring Boot", "PostgreSQL", "MySQL", "Jenkins", "Docker", "Kubernetes"],
    link: "#experience",
    repo: "",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Fusion Technologies – Application Development",
    blurb: "Spring Boot microservices with Kafka JMS; Eureka/Config/Ribbon for resilience; GraphQL schema to reduce over‑fetching; reusable React hooks.",
    stack: ["Spring Boot", "Kafka", "Eureka", "Spring Cloud Config", "Ribbon", "React", "GraphQL"],
    link: "#experience",
    repo: "",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", // application development
  },
  {
    title: "UHAP – Academic: Web Application",
    blurb: "Healthcare analytics dashboard integrating with Java Servlets, MySQL, and Bootstrap UI components; Real-time visualization of patientvisit trends and operational workflows; stakeholders access to patient history, provider performance, and inventory tracking. ",
    stack: ["Java 17", "Java Servlets", "MySQL", "Bootstrap", "JavaScript", "jQuery", "JUnit"],
    link: "",
    repo: "",
    image: "/index7.png", // application development
  },
  {
    title: "Detecting & Preventing Data lose Analysis – Web Application",
    blurb: "Secure data management to monitor and prevent data loss; Reporting feature allows real-time monitoring and analysis of data transactions. ",
    stack: ["Java 17", "Java Servlets", "MySQL", "PHP", "JavaScript"],
    link: "",
    repo: "",
    image: "/dl.jpg", // application development
  },
];

const EXPERIENCE = [
  {
    company: "Capital One Financial, CA",
    title: "Software Engineer",
    period: "Sep 2024 – Current",
    points: [
      "Architected Java 17/Spring Boot/Hibernate services for complex loan workflows (+25% throughput; 12k+ monthly requests).",
      "Built React + TypeScript + Tailwind dashboards for balances, transactions, analytics (−22% support queries).",
      "Integrated multi‑source payment APIs via Kafka, Node.js, and GraphQL (−1,200 failed tx/month; higher reliability).",
      "Optimized search & reporting with PostgreSQL + Elasticsearch (1.7× faster retrieval under high concurrency).",
      "Automated CI/CD with GitHub Actions, Docker, K8s across AWS (Lambda, EC2, S3) (−30% rollbacks; faster releases).",
      "Enforced security with Spring Security, OAuth2, JWT, RBAC (mitigated unauthorized access attempts).",
      "Built real‑time alerting with Kafka Streams + WebSockets (−15 min incident response times).",
      "Infra as Code + monitoring via Terraform + CloudWatch (↑ availability for 15+ services; −40% MTTR).",
    ],
  },
  {
    company: "Deloitte, India",
    title: "Analyst",
    period: "Jul 2021 – Jul 2023",
    points: [
      "Migrated 5000+ Oracle business rules to RedHat Drools using Java; improved accuracy and reliability.",
      "Delivered 10+ REST APIs with Spring Boot microservices; improved benefits workflows.",
      "Optimized MySQL/PostgreSQL for 1M+ daily records; ↑ throughput and stability.",
      "Jenkins + Docker + K8s CI/CD; HIPAA‑compliant releases; −30% rollbacks.",
      "Centralized logging & monitoring via ELK; faster incident resolution.",
      "Led code reviews and mentored juniors in Java/Drools/engineering best practices.",
    ],
  },
  {
    company: "Fusion Software Technologies, India",
    title: "Software Engineer",
    period: "Jan 2019 – Jun 2021",
    points: [
      "Reusable React hooks for DOM + events (−30% duplication across modules).",
      "Spring Boot microservices with Kafka broker; async messaging.",
      "Eureka/Config/Ribbon for discovery, centralized config, and client‑side load‑balancing.",
      "Full SDLC participation; Agile + DevOps delivery; GraphQL modeling for complex relations.",
    ],
  },
];

const EDUCATION = [
  {
    school: "Saint Louis University, St. Louis, MO, USA",
    degree: "M.S. in Information Systems (GPA: 3.84)",
    period: "Aug 2023 – May 2025",
  },
  {
    school: "Alliance University, Bangalore, India",
    degree: "B.E. in Computer Science and Engineering (GPA: 3.4)",
    period: "Aug 2016 – Aug 2020",
  },
];

const CERTIFICATIONS = [
  { name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services" },
  { name: "Docker Certified Associate (DCA)", issuer: "Docker" },
  { name: "Programming with Go", issuer: "UC Irvine" },
  { name: "Automation with Drools", issuer: "Coursera" },
  { name: "Amazon Junior Software Developer", issuer: "Amazon" },
];

// --- Fancy background ---
function AnimatedBackdrop({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-40"
           style={{ background: theme === "dark" ? "radial-gradient(600px circle at 30% 30%, #22d3ee 0%, rgba(34,211,238,0) 60%)" : "radial-gradient(600px circle at 30% 30%, #38bdf8 0%, rgba(56,189,248,0) 60%)" }}
      />
      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-40"
           style={{ background: theme === "dark" ? "radial-gradient(600px circle at 70% 70%, #a78bfa 0%, rgba(167,139,250,0) 60%)" : "radial-gradient(600px circle at 70% 70%, #c084fc 0%, rgba(192,132,252,0) 60%)" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: theme === "dark" ? "#94a3b8" : "#475569" }}
      />
    </div>
  );
}

function SectionHeader({ icon: Icon, kicker, title, right }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; kicker: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-2">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span>{kicker}</span>
        </div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export default function Portfolio() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg?: string }>({ type: "idle" });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const year = useMemo(() => new Date().getFullYear(), []);

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
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setStatus({ type: "error", msg });
    }
    
  }

  return (
    <div className={"min-h-screen w-full scroll-smooth "+(theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900") }>
      <AnimatedBackdrop theme={theme} />

      {/* Top Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">{PROFILE.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {PROFILE.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="rounded-lg p-2 transition hover:bg-primary/10">
                <s.icon className="h-5 w-5" />
                <span className="sr-only">{s.label}</span>
              </a>
            ))}
            <Button variant="outline" size="icon" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
              <AnimatePresence initial={false} mode="popLayout">
                {theme === "dark" ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <Sun className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Moon className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 py-14 lg:py-20">
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-8 lg:grid-cols-3">
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm opacity-90">
              <Circle className="h-2 w-2 fill-current" /> Available for new opportunities · {PROFILE.location}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Hi, I’m {PROFILE.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {PROFILE.summary}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
             <Button className="group w-full sm:w-auto" asChild>
              <a href="#projects"> View Projects
               <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            </Button>

            <Button variant="outline" className="group w-full sm:w-auto" asChild>
             <a href="#contact">
              <Phone className="mr-2 h-4 w-4" /> Contact Me
             </a>
           </Button>

             <Button variant="secondary" className="group w-full sm:w-auto" asChild>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                Download Resume <Download className="ml-2 h-4 w-4" />
              </a>
           </Button>
           </div>

          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Card className="border-0 bg-gradient-to-b from-primary/10 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Quick Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                <Image alt="avatar" src={PROFILE.avatar} width={56} height={56} className="h-14 w-14 rounded-2xl object-cover"/>
                  <div>
                    <div className="font-semibold">{PROFILE.name}</div>
                    <div className="text-sm text-muted-foreground">{PROFILE.title}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Java","Microservices","Spring","RESTful API","AWS","React","TypeScript","JavaScript (ES6+)",
                    "Tailwind CSS","Next.js",".NET","Responsive UI","C#","OAuth2/JWT",
                    "Git/GitLab/GitHub","Drools","CI/CD","Jenkins","Docker","Kubernetes",
                    "SQL","Databases","GraphQL"
                  ].map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </header>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
  <SectionHeader icon={Code2} kicker="Capabilities" title="Skills & Tools" />
  <ul className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2">
    {SKILLS.map((s) => (
      <li
        key={s}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm
                   dark:border-slate-800 dark:bg-slate-900"
      >
        {s}
      </li>
    ))}
  </ul>
</section>


      {/* Experience  */}
      <section id="experience" className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <SectionHeader icon={Briefcase} kicker="Background" title="Experience" />
        <div className="grid gap-6 md:grid-cols-2">
          {EXPERIENCE.map((job) => (
            <Card key={job.company}>
              <CardHeader>
                <CardTitle className="text-base">{job.title} · {job.company}</CardTitle>
                <div className="text-sm text-muted-foreground">{job.period}</div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {job.points.map((pt, idx) => <li key={idx}>{pt}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <SectionHeader icon={Rocket} kicker="Selected Work" title="Projects" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <motion.article key={p.title} variants={fadeUp} className="group overflow-hidden rounded-2xl border bg-card">
              <div className="relative h-48 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 50vw, 100vw"/>
</div>

                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <div className="flex items-center gap-2">
                    <a href={p.link} className="rounded-lg p-2 hover:bg-primary/10" title="Details">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-primary/10" title="Code">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{p.blurb}</p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map(tag => (
                    <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Education */}
      <section id="education" className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <SectionHeader icon={GraduationCap} kicker="Academics" title="Education" />
        <div className="grid gap-6 md:grid-cols-2">
          {EDUCATION.map((e) => (
            <Card key={e.school}>
              <CardHeader>
                <CardTitle className="text-base">{e.degree}</CardTitle>
                <div className="text-sm text-muted-foreground">{e.school}</div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{e.period}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section id="certs" className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <SectionHeader icon={Award} kicker="Creds" title="Certifications" />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {CERTIFICATIONS.map((c) => (
            <Card key={c.name}>
              <CardContent className="p-4">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.issuer}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <SectionHeader icon={Mail} kicker="Say Hello" title="Contact" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Send a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                    <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                  <Textarea placeholder="Type here..." rows={5} value={message} onChange={e => setMessage(e.target.value)} required />
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm">
                      {status.type === "success" && <span className="text-green-500">{status.msg}</span>}
                      {status.type === "error" && <span className="text-red-500">{status.msg}</span>}
                    </div>
                    <Button type="submit" disabled={status.type === "loading"}>{status.type === "loading" ? "Sending..." : "Send"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Links</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {PROFILE.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border p-3 hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <s.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-sm text-muted-foreground">{s.href.replace("https://", "")}</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-center text-sm text-muted-foreground">
        © {year} {PROFILE.name}. Built with React, Tailwind, and Framer Motion.
      </footer>
    </div>
  );
}
