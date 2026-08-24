import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/writeClient";
import { getCurrentIssueInfo } from "@/lib/date";
import type { ArticleCategory } from "@/lib/types";

const COOKIE_NAME = "magazine_session";
const VALID_CATEGORIES: ArticleCategory[] = ["ലേഖനം", "കവിത", "കഥ", "കുറിപ്പ്"];

function randomSlug(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  const correctPin = process.env.MAGAZINE_SUBMIT_PIN;

  if (!correctPin || session !== correctPin) {
    return Response.json({ error: "വീണ്ടും ലോഗിൻ ചെയ്യുക" }, { status: 401 });
  }

  if (!writeClient) {
    return Response.json({ error: "Submission form isn't set up yet." }, { status: 500 });
  }

  const { title, authorName, category, body } = (await request.json()) as {
    title?: string;
    authorName?: string;
    category?: string;
    body?: string;
  };

  if (!title?.trim() || !authorName?.trim() || !body?.trim()) {
    return Response.json({ error: "എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക" }, { status: 400 });
  }

  if (!category || !VALID_CATEGORIES.includes(category as ArticleCategory)) {
    return Response.json({ error: "വിഭാഗം തിരഞ്ഞെടുക്കുക" }, { status: 400 });
  }

  const issueInfo = getCurrentIssueInfo();
  let issueId: string;

  const existingIssue = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "magazineIssue" && slug.current == $slug][0]{ _id }`,
    { slug: issueInfo.slug }
  );

  if (existingIssue) {
    issueId = existingIssue._id;
  } else {
    const created = await writeClient.create({
      _type: "magazineIssue",
      title: issueInfo.title,
      slug: { _type: "slug", current: issueInfo.slug },
      issueDate: issueInfo.issueDate,
    });
    issueId = created._id;
  }

  const article = await writeClient.create({
    _type: "article",
    title: title.trim(),
    slug: { _type: "slug", current: randomSlug("piece") },
    authorName: authorName.trim(),
    category,
    issue: { _type: "reference", _ref: issueId },
    body: body.trim(),
    publishedAt: new Date().toISOString(),
  });

  return Response.json({
    ok: true,
    issueSlug: issueInfo.slug,
    articleSlug: article.slug.current,
  });
}
