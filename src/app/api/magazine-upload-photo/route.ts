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

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "ചിത്രം കണ്ടെത്താനായില്ല" }, { status: 400 });
  }

  if (file.type !== "image/jpeg") {
    return Response.json({ error: "JPEG ചിത്രം മാത്രം അപ്‌ലോഡ് ചെയ്യുക" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "ചിത്രം വളരെ വലുതാണ് (5MB വരെ മാത്രം)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await writeClient.assets.upload("image", buffer, {
    filename: file.name,
    contentType: "image/jpeg",
  });

  return Response.json({ assetId: asset._id });
}
