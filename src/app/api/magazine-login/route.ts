import { NextResponse } from "next/server";

const COOKIE_NAME = "magazine_session";

export async function POST(request: Request) {
  const { pin } = (await request.json()) as { pin?: string };
  const correctPin = process.env.MAGAZINE_SUBMIT_PIN;

  if (!correctPin) {
    return Response.json({ error: "Submission form isn't set up yet." }, { status: 500 });
  }

  if (!pin || pin !== correctPin) {
    return Response.json({ error: "തെറ്റായ കോഡ്" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, correctPin, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return response;
}
