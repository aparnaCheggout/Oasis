import Link from "next/link";
import Image from "next/image";
import { getServices, getShowcaseItems, getSiteSettings, getWritings } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { formatMalayalamDate } from "@/lib/date";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const [settings, services, showcaseItems, writings] = await Promise.all([
    getSiteSettings(locale),
    getServices(locale),
    getShowcaseItems(locale),
    getWritings(),
  ]);

  const featured = showcaseItems.filter((item) => item.featured).slice(0, 3);
  const latestWritings = writings.slice(0, 3);

  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {settings.businessName}
        </h1>
        {settings.tagline && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {settings.tagline}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${locale}/contact`}
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {dict.home.startProject}
          </Link>
          <Link
            href={`/${locale}/showcase`}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {dict.home.seeWork}
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {dict.home.servicesHeading}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${locale}/services#${service.slug}`}
                className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="font-serif text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {dict.home.featuredWork}
            </h2>
            <Link href={`/${locale}/showcase`} className="text-sm text-accent hover:underline">
              {dict.home.viewAll}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {featured.map((item) => (
              <div key={item.slug} className="rounded-lg border border-border bg-surface overflow-hidden">
                <div className="aspect-[3/4] bg-surface-muted flex items-center justify-center">
                  {item.coverImageUrl ? (
                    <Image
                      src={item.coverImageUrl}
                      alt={item.title}
                      width={300}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground px-4 text-center">
                      {dict.common.noCover}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-gold">{item.workType}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {latestWritings.length > 0 && (
        <section className="border-t border-border bg-surface-muted">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {dict.home.latestWritings}
              </h2>
              <Link href={`/${locale}/writings`} className="text-sm text-accent hover:underline">
                {dict.home.viewAllWritings}
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {latestWritings.map((writing) => (
                <Link
                  key={writing.slug}
                  href={`/${locale}/writings/${writing.slug}`}
                  className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
                >
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 font-malayalam text-gold">
                      {writing.category}
                    </span>
                    <span className="text-muted-foreground">
                      {formatMalayalamDate(writing.publishedAt)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-malayalam text-lg font-semibold text-foreground">
                    {writing.title}
                  </h3>
                  {writing.excerpt && (
                    <p className="mt-2 font-malayalam text-sm text-muted-foreground">
                      {writing.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
