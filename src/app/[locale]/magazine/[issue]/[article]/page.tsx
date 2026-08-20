import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getMagazineIssue } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamDate } from "@/lib/date";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/magazine/[issue]/[article]">) {
  const { issue: issueSlug, article: articleSlug } = await params;
  const article = await getArticle(issueSlug, articleSlug);
  return { title: article?.title };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[locale]/magazine/[issue]/[article]">) {
  const { locale: rawLocale, issue: issueSlug, article: articleSlug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const [issue, article] = await Promise.all([
    getMagazineIssue(issueSlug),
    getArticle(issueSlug, articleSlug),
  ]);

  if (!issue || !article) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href={`/${locale}/magazine/${issueSlug}`} className="text-sm text-accent hover:underline">
        &larr; {dict.magazine.backToIssue}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 font-malayalam text-gold">
          {article.category}
        </span>
        <span className="font-malayalam text-muted-foreground">
          {dict.magazine.by} {article.authorName}
        </span>
        <span className="text-muted-foreground">{formatMalayalamDate(article.publishedAt)}</span>
      </div>

      <h1 className="mt-3 font-malayalam text-3xl font-semibold text-foreground">{article.title}</h1>

      <div className="mt-8 whitespace-pre-line font-malayalam text-lg leading-relaxed text-foreground">
        {article.body}
      </div>
    </div>
  );
}
