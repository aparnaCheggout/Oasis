import Image from "next/image";
import Link from "next/link";
import { getMagazineIssues } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamMonthYear } from "@/lib/date";

export async function generateMetadata({ params }: PageProps<"/[locale]/magazine">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return { title: getDictionary(locale).magazine.metaTitle };
}

export default async function MagazinePage({ params }: PageProps<"/[locale]/magazine">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const issues = await getMagazineIssues();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{dict.magazine.heading}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{dict.magazine.intro}</p>

      {issues.length === 0 ? (
        <p className="mt-12 text-muted-foreground">{dict.magazine.noIssuesYet}</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <Link
              key={issue.slug}
              href={`/${locale}/magazine/${issue.slug}`}
              className="rounded-lg border border-border bg-surface overflow-hidden transition-colors hover:border-accent"
            >
              <div className="aspect-[3/4] bg-surface-muted flex items-center justify-center">
                {issue.coverImageUrl ? (
                  <Image
                    src={issue.coverImageUrl}
                    alt={issue.title}
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
                  {formatMalayalamMonthYear(issue.issueDate)}
                </p>
                <h2 className="mt-1 font-malayalam text-lg font-semibold text-foreground">
                  {issue.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
