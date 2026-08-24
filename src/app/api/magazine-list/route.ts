import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/writeClient";

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

  const articles = await writeClient.fetch(
    `*[_type == "article"] | order(publishedAt desc)[0...30]{
      _id, title, authorName, category, publishedAt,
      "slug": slug.current, "issueSlug": issue->slug.current
    }`
  );

  return Response.json({ articles });
}
