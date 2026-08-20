import Link from "next/link";
import Image from "next/image";
import { getServices, getShowcaseItems, getSiteSettings } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";
import { badgeFallback, workTypeBadge } from "@/lib/badgeColors";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);

  const [settings, services, showcaseItems] = await Promise.all([
    getSiteSettings(locale),
    getServices(locale),
    getShowcaseItems(locale),
  ]);

  const featured = showcaseItems.filter((item) => item.featured).slice(0, 3);
  const cardAccents = ["border-t-accent", "border-t-teal", "border-t-gold"];

  return (
    <div>
      <section className="relative overflow-hidden text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%), radial-gradient(55% 45% at 85% 15%, color-mix(in oklab, var(--teal) 14%, transparent) 0%, transparent 70%), radial-gradient(50% 40% at 60% 90%, color-mix(in oklab, var(--gold) 12%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-6 py-20">
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
        </div>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            {dict.home.servicesHeading}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/${locale}/services#${service.slug}`}
                className={`rounded-lg border border-t-4 border-border bg-surface p-6 transition-transform hover:-translate-y-0.5 ${cardAccents[index % cardAccents.length]}`}
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
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${
                      workTypeBadge[item.workType] ?? badgeFallback
                    }`}
                  >
                    {item.workType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
