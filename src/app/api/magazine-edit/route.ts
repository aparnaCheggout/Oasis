import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/writeClient";
import { plainTextToPortableText } from "@/lib/portableText";
import type { ArticleCategory, ArticleTitleStyle } from "@/lib/types";

const COOKIE_NAME = "magazine_session";
const VALID_CATEGORIES: ArticleCategory[] = ["ലേഖനം", "കവിത", "കഥ", "കുറിപ്പ്"];

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

  const { id, title, authorName, category, body, titleStyle, authorPhotoAssetId } =
    (await request.json()) as {
      id?: string;
      title?: string;
      authorName?: string;
      category?: string;
      body?: string;
      titleStyle?: ArticleTitleStyle;
      authorPhotoAssetId?: string;
    };

  if (!id || !title?.trim() || !authorName?.trim() || !body?.trim()) {
    return Response.json({ error: "എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക" }, { status: 400 });
  }

  if (authorName.length > 100) {
    return Response.json({ error: "പേര് വളരെ നീണ്ടതാണ്" }, { status: 400 });
  }

  if (!category || !VALID_CATEGORIES.includes(category as ArticleCategory)) {
    return Response.json({ error: "വിഭാഗം തിരഞ്ഞെടുക്കുക" }, { status: 400 });
  }

  await writeClient
    .patch(id)
    .set({
      title: title.trim(),
      titleStyle: titleStyle ?? "default",
      authorName: authorName.trim(),
      ...(authorPhotoAssetId
        ? { authorPhoto: { _type: "image", asset: { _type: "reference", _ref: authorPhotoAssetId } } }
        : {}),
      category,
      body: plainTextToPortableText(body.trim()),
    })
    .commit();

  return Response.json({ ok: true });
}
