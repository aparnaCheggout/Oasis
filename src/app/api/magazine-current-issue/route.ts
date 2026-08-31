import { cookies } from "next/headers";
import { getOrCreateCurrentIssue } from "@/sanity/lib/currentIssue";
import { urlForImage } from "@/sanity/lib/image";

const COOKIE_NAME = "magazine_session";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  const correctPin = process.env.MAGAZINE_SUBMIT_PIN;

  if (!correctPin || session !== correctPin) {
    return Response.json({ error: "വീണ്ടും ലോഗിൻ ചെയ്യുക" }, { status: 401 });
  }

  const issue = await getOrCreateCurrentIssue();
  if (!issue) {
    return Response.json({ error: "Submission form isn't set up yet." }, { status: 500 });
  }

  return Response.json({
    id: issue.id,
    title: issue.title,
    coverImageUrl: issue.coverImageAssetId
      ? urlForImage({ asset: { _ref: issue.coverImageAssetId } })?.width(300).url()
      : null,
  });
}
