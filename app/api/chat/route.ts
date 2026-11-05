// "Ask my resume" endpoint. Answers only from lib/portfolio-data.ts.
// Needs ANTHROPIC_API_KEY in your environment (Vercel → Settings → Environment Variables).
// Without a key it returns 503 and the page falls back to its built-in keyword answers.
import { NextResponse } from "next/server";
import {
  PROFILE, EXPERIENCE, PROJECTS, SKILL_GROUPS, EDUCATION, CERTIFICATIONS, CURRENTLY,
} from "../../../lib/portfolio-data";

const MODEL = process.env.CHAT_MODEL || "claude-haiku-5-5";
const MAX_QUESTION_CHARS = 500;
const MAX_TURNS = 6;

const RESUME = JSON.stringify({
  name: PROFILE.name,
  title: PROFILE.title,
  location: PROFILE.location,
  summary: PROFILE.summary,
  experience: EXPERIENCE.map(({ company, location, title, domain, period, tech, points }) => ({ company, location, title, domain, period, tech, points })),
  projects: PROJECTS.map(({ title, tag, blurb, stack }) => ({ title, tag, blurb, stack })),
  skills: SKILL_GROUPS.map(({ name, items }) => ({ group: name, items })),
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  currently: CURRENTLY,
});

const SYSTEM = `You are the friendly assistant on ${PROFILE.name}'s portfolio site. Recruiters and engineers ask you about his background.
Rules:
- Answer ONLY from the resume JSON below. If something isn't there, say you don't know and suggest emailing him.
- Never invent employers, dates, numbers, or skills.
- For work authorization, visa, salary, notice period, or availability questions, say those are best discussed with Mohan directly and point to the contact section.
- Keep answers short: 2–4 sentences, plain text, no markdown headings. Speak about him in the third person.
- A little warmth or light humor is fine; stay professional.

RESUME JSON:
${RESUME}`;

// Best-effort per-instance rate limit (serverless instances don't share memory).
const hits = new Map<string, { count: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  h.count += 1;
  return h.count > 10;
}

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "Chat not configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many questions, try again in a minute." }, { status: 429 });

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: Msg) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_TURNS)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) }));
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  // The API requires the conversation to start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length) return NextResponse.json({ ok: false, error: "Ask a question" }, { status: 400 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 300, system: SYSTEM, messages }),
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const data = await res.json();
    const answer = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("")
      .trim();
    return NextResponse.json({ ok: true, answer });
  } catch {
    return NextResponse.json({ ok: false, error: "Chat unavailable" }, { status: 502 });
  }
}
