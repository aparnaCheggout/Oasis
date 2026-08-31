import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(request: Request) {
  const { articleId, authorName, text, website } = (await request.json()) as {
    articleId?: string;
    authorName?: string;
    text?: string;
    website?: string; // honeypot — real visitors never fill this in
  };

  // Silently "succeed" for bots without writing anything.
  if (website) {
    return Response.json({ ok: true });
  }

  if (!articleId || !authorName?.trim() || !text?.trim()) {
    return Response.json({ error: "Please fill in your name and comment." }, { status: 400 });
  }

  if (authorName.length > 80 || text.length > 1000) {
    return Response.json({ error: "That's too long." }, { status: 400 });
  }

  if (!writeClient) {
    return Response.json({ error: "Comments aren't set up yet." }, { status: 500 });
  }

  await writeClient.create({
    _type: "comment",
    article: { _type: "reference", _ref: articleId },
    authorName: authorName.trim(),
    text: text.trim(),
    approved: false,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
