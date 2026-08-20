import Image from "next/image";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">About</h1>

      <div className="mt-10 flex flex-col gap-8 sm:flex-row">
        {settings.founderPhotoUrl && (
          <Image
            src={settings.founderPhotoUrl}
            alt={settings.founderName ?? settings.businessName}
            width={200}
            height={200}
            className="h-40 w-40 shrink-0 rounded-full object-cover"
          />
        )}
        <div>
          {settings.founderName && (
            <h2 className="font-serif text-xl font-semibold text-foreground">{settings.founderName}</h2>
          )}
          {settings.bio && (
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{settings.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
