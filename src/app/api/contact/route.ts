import { Resend } from "resend";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, projectType, message } = body as {
    name?: string;
    email?: string;
    projectType?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "[contact] RESEND_API_KEY or CONTACT_EMAIL is not set — inquiry was not emailed. See README for setup.",
      { name, email, projectType, message }
    );
    // Still report success so the form is testable before email is configured.
    return Response.json({ ok: true, delivered: false });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Website inquiry <onboarding@resend.dev>",
    to: toEmail,
    replyTo: email,
    subject: `New inquiry from ${name}${projectType ? ` — ${projectType}` : ""}`,
    text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType || "Not specified"}\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return Response.json({ error: "Something went wrong sending your message." }, { status: 500 });
  }

  return Response.json({ ok: true, delivered: true });
}
