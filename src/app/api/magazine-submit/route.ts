import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/writeClient";
import { getOrCreateCurrentIssue } from "@/sanity/lib/currentIssue";
import { buildBodyFromPlainTextAndImages, type SimpleImage } from "@/lib/portableText";
import type { ArticleCategory, ArticleTitleStyle } from "@/lib/types";

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

  const { title, authorName, category, body, titleStyle, authorPhotoAssetId, images } =
    (await request.json()) as {
      title?: string;
      authorName?: string;
      category?: string;
      body?: string;
      titleStyle?: ArticleTitleStyle;
      authorPhotoAssetId?: string;
      images?: SimpleImage[];
    };

  if (!title?.trim() || !authorName?.trim() || !body?.trim()) {
    return Response.json({ error: "എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക" }, { status: 400 });
  }

  if (authorName.length > 100) {
    return Response.json({ error: "പേര് വളരെ നീണ്ടതാണ്" }, { status: 400 });
  }

  if (!category || !VALID_CATEGORIES.includes(category as ArticleCategory)) {
    return Response.json({ error: "വിഭാഗം തിരഞ്ഞെടുക്കുക" }, { status: 400 });
  }

  const issue = await getOrCreateCurrentIssue();
  if (!issue) {
    return Response.json({ error: "Submission form isn't set up yet." }, { status: 500 });
  }

  const article = await writeClient.create({
    _type: "article",
    title: title.trim(),
    titleStyle: titleStyle ?? "default",
    slug: { _type: "slug", current: randomSlug("piece") },
    authorName: authorName.trim(),
    ...(authorPhotoAssetId
      ? { authorPhoto: { _type: "image", asset: { _type: "reference", _ref: authorPhotoAssetId } } }
      : {}),
    category,
    issue: { _type: "reference", _ref: issue.id },
    body: buildBodyFromPlainTextAndImages(body.trim(), images ?? []),
    publishedAt: new Date().toISOString(),
  });

  return Response.json({
    ok: true,
    issueSlug: issue.slug,
    articleSlug: article.slug.current,
  });
}
