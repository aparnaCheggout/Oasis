import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/writeClient";
import { urlForImage } from "@/sanity/lib/image";

const COOKIE_NAME = "magazine_session";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  const correctPin = process.env.MAGAZINE_SUBMIT_PIN;

  if (!correctPin || session !== correctPin) {
    return Response.json({ error: "വീണ്ടും ലോഗിൻ ചെയ്യുക" }, { status: 401 });
  }

  if (!writeClient) {
    return Response.json({ error: "Submission form isn't set up yet." }, { status: 500 });
  }

  const rawArticles = await writeClient.fetch(
    `*[_type == "article"] | order(publishedAt desc)[0...30]{
      _id, title, titleStyle, authorName, authorPhoto, category, body, publishedAt,
      "slug": slug.current, "issueSlug": issue->slug.current
    }`
  );

  const articles = rawArticles.map((article: Record<string, unknown>) => ({
    ...article,
    authorPhotoUrl: urlForImage(article.authorPhoto as never)?.width(100).url(),
  }));

  return Response.json({ articles });
}
