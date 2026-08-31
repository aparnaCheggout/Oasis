import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesForIssue, getMagazineIssue } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamMonthYear } from "@/lib/date";
import { articleCategoryBadge, badgeFallback } from "@/lib/badgeColors";
import { RichTitleText } from "@/lib/titleStyles";

export async function generateMetadata({ params }: PageProps<"/[locale]/magazine/[issue]">) {
  const { issue: issueSlug } = await params;
  const issue = await getMagazineIssue(issueSlug);
  return { title: issue?.title };
}

export default async function MagazineIssuePage({
  params,
}: PageProps<"/[locale]/magazine/[issue]">) {
  const { locale: rawLocale, issue: issueSlug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const issue = await getMagazineIssue(issueSlug);
  if (!issue) notFound();

  const articles = await getArticlesForIssue(issueSlug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href={`/${locale}/magazine`} className="text-sm text-accent hover:underline">
        &larr; {dict.magazine.backToIssues}
      </Link>

      <p className="mt-6 text-xs uppercase tracking-wide text-teal">
        {formatMalayalamMonthYear(issue.issueDate)}
      </p>
      <h1 className="mt-2 font-malayalam text-3xl font-semibold text-foreground">{issue.title}</h1>
      {issue.description && (
        <p className="mt-3 font-malayalam text-muted-foreground">{issue.description}</p>
      )}

      {issue.editors && issue.editors.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-4 font-malayalam text-sm text-muted-foreground">
          {issue.editors.map((editor) => (
            <span key={editor.name}>
              <span className="text-plum">{editor.role}</span>
              {editor.role && editor.name ? ": " : ""}
              <span className="text-foreground">{editor.name}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/magazine/${issueSlug}/${article.slug}`}
            className="block rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-3 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-malayalam font-medium ${
                  articleCategoryBadge[article.category] ?? badgeFallback
                }`}
              >
                {article.category}
              </span>
              <span className="flex items-center gap-2 font-malayalam text-muted-foreground">
                {article.authorPhotoUrl && (
                  <Image
                    src={article.authorPhotoUrl}
                    alt={article.authorName}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                )}
                {dict.magazine.by} {article.authorName}
              </span>
            </div>
            <h2 className="mt-3 font-malayalam text-xl font-semibold text-foreground">
              <RichTitleText title={article.title} />
            </h2>
            {article.excerpt && (
              <p className="mt-2 font-malayalam text-sm text-muted-foreground">{article.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
