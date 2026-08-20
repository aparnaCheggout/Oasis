import Link from "next/link";
import { notFound } from "next/navigation";
import { getWriting } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamDate } from "@/lib/date";

export async function generateMetadata({ params }: PageProps<"/[locale]/writings/[slug]">) {
  const { slug } = await params;
  const writing = await getWriting(slug);
  return { title: writing?.title };
}

export default async function WritingPage({ params }: PageProps<"/[locale]/writings/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const writing = await getWriting(slug);

  if (!writing) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href={`/${locale}/writings`} className="text-sm text-accent hover:underline">
        &larr; {dict.writings.backToWritings}
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 font-malayalam text-gold">
          {writing.category}
        </span>
        <span className="text-muted-foreground">{formatMalayalamDate(writing.publishedAt)}</span>
      </div>

      <h1 className="mt-3 font-malayalam text-3xl font-semibold text-foreground">{writing.title}</h1>

      <div className="mt-8 whitespace-pre-line font-malayalam text-lg leading-relaxed text-foreground">
        {writing.body}
      </div>
    </div>
  );
}
