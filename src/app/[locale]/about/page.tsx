import Image from "next/image";
import { getSiteSettings } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return { title: getDictionary(locale).about.metaTitle };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{dict.about.heading}</h1>

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
