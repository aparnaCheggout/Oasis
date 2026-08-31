import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getComments, getMagazineIssue } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamDate } from "@/lib/date";
import { articleCategoryBadge, badgeFallback } from "@/lib/badgeColors";
import { getTitleStyleClass } from "@/lib/titleStyles";
import ArticleBody from "@/components/ArticleBody";
import CommentsSection from "@/components/CommentsSection";

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

  const comments = await getComments(article.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href={`/${locale}/magazine/${issueSlug}`} className="text-sm text-accent hover:underline">
        &larr; {dict.magazine.backToIssue}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
        <span
          className={`rounded-full px-2.5 py-1 font-malayalam font-medium ${
            articleCategoryBadge[article.category] ?? badgeFallback
          }`}
        >
          {article.category}
        </span>
        <span className="text-muted-foreground">{formatMalayalamDate(article.publishedAt)}</span>
      </div>

      <h1 className={`mt-3 ${getTitleStyleClass(article.titleStyle)}`}>{article.title}</h1>

      <div className="mt-4 flex items-center gap-3">
        {article.authorPhotoUrl && (
          <Image
            src={article.authorPhotoUrl}
            alt={article.authorName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        )}
        <span className="font-malayalam text-muted-foreground">
          {dict.magazine.by} {article.authorName}
        </span>
      </div>

      <div className="mt-8">
        <ArticleBody body={article.body} />
      </div>

      <CommentsSection
        articleId={article.id}
        initialComments={comments}
        dict={dict.magazine.comments}
      />
    </div>
  );
}
