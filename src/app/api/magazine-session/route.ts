import { cookies } from "next/headers";

const COOKIE_NAME = "magazine_session";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  const correctPin = process.env.MAGAZINE_SUBMIT_PIN;
  return Response.json({ authenticated: Boolean(correctPin) && session === correctPin });
}
