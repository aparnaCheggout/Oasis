import Link from "next/link";
import { getWritings } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamDate } from "@/lib/date";

export async function generateMetadata({ params }: PageProps<"/[locale]/writings">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return { title: getDictionary(locale).writings.metaTitle };
}

export default async function WritingsPage({ params }: PageProps<"/[locale]/writings">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const writings = await getWritings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{dict.writings.heading}</h1>
      <p className="mt-3 text-muted-foreground">{dict.writings.intro}</p>

      <div className="mt-12 space-y-8">
        {writings.map((writing) => (
          <Link
            key={writing.slug}
            href={`/${locale}/writings/${writing.slug}`}
            className="block rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full bg-surface-muted px-2.5 py-1 font-malayalam text-gold">
                {writing.category}
              </span>
              <span className="text-muted-foreground">{formatMalayalamDate(writing.publishedAt)}</span>
            </div>
            <h2 className="mt-3 font-malayalam text-xl font-semibold text-foreground">{writing.title}</h2>
            {writing.excerpt && (
              <p className="mt-2 font-malayalam text-sm text-muted-foreground">{writing.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
