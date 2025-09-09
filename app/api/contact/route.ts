import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

// Minimal shape we read from Resend
type ResendSendResult = {
  error?: { message?: string } | null;
};

export async function POST(req: Request) {
  try {
    const { name, email, subject, message }: ContactPayload = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Email and message are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY on server." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const from = process.env.MAIL_FROM || "Portfolio <onboarding@resend.dev>";
    const to = process.env.MAIL_TO || "mohanreddy.k@protectmymails.com";

    const result = (await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: subject ? `Portfolio Contact: ${subject}` : "New portfolio message",
      text: `Name: ${name || "N/A"}\nEmail: ${email}\n\n${message}`,
    })) as ResendSendResult;

    if (result.error) {
      return NextResponse.json(
        { ok: false, error: result.error.message || "Email provider error." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
