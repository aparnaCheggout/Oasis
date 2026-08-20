import Image from "next/image";
import type { Metadata } from "next";
import { getShowcaseItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Showcase",
};

const workTypeLabels: Record<string, string> = {
  translation: "Translation",
  layout: "Layout & design",
  both: "Translation + layout",
};

export default async function ShowcasePage() {
  const items = await getShowcaseItems();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">Showcase</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Translated books and layout projects, gathered in one place.
      </p>

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
                <span className="text-sm text-muted-foreground px-4 text-center">No cover yet</span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-gold">
                {workTypeLabels[item.workType] ?? item.workType}
              </p>
              <h2 className="mt-1 font-serif text-lg font-semibold text-foreground">{item.title}</h2>
              {item.originalAuthor && (
                <p className="mt-1 text-sm text-muted-foreground">Original by {item.originalAuthor}</p>
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
                  Where to find it &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
