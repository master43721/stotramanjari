import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECTS: Record<string, string> = {
  "chanting-guidance": "Chanting & pronunciation guidance",
  "stotram-request": "New stotram / sloka request",
  "text-correction": "Textual / transliteration correction",
  "general-inquiry": "General devotional feedback",
};

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      { message: "Contact delivery has not been configured yet. Please try again later." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please submit the form again." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = text(input.name, 120);
  const email = text(input.email, 254);
  const message = text(input.message, 10_000);
  const subjectKey = text(input.subject, 64);

  if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 10 || !SUBJECTS[subjectKey]) {
    return NextResponse.json({ message: "Please check the required contact details." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Stotramani contact: ${SUBJECTS[subjectKey]}`,
        text: `From: ${name}\nEmail: ${email}\nTopic: ${SUBJECTS[subjectKey]}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error("Contact provider rejected the message", { status: response.status });
      return NextResponse.json({ message: "We could not send your note. Please try again later." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ message: "We could not send your note. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
