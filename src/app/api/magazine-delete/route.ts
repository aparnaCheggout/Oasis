import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/writeClient";

const COOKIE_NAME = "magazine_session";

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

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await writeClient.delete(id);
  return Response.json({ ok: true });
}
