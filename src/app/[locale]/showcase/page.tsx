import Image from "next/image";
import { getShowcaseItems } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/showcase">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return { title: getDictionary(locale).showcase.metaTitle };
}

export default async function ShowcasePage({ params }: PageProps<"/[locale]/showcase">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const items = await getShowcaseItems(locale);

  const workTypeLabels: Record<string, string> = {
    translation: dict.showcase.workType.translation,
    layout: dict.showcase.workType.layout,
    both: dict.showcase.workType.both,
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{dict.showcase.heading}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{dict.showcase.intro}</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.slug} className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="aspect-[3/4] bg-surface-muted flex items-center justify-center">
              {item.coverImageUrl ? (
                <Image
                  src={item.coverImageUrl}
                  alt={item.title}
                  width={400}
                  height={533}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground px-4 text-center">
                  {dict.common.noCover}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-gold">
                {workTypeLabels[item.workType] ?? item.workType}
              </p>
              <h2 className="mt-1 font-serif text-lg font-semibold text-foreground">{item.title}</h2>
              {item.originalAuthor && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {dict.showcase.originalBy} {item.originalAuthor}
                </p>
              )}
              {item.description && (
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              )}
              {item.externalLink && (
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-accent hover:underline"
                >
                  {dict.showcase.whereToFind} &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
