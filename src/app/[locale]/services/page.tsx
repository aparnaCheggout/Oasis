import Link from "next/link";
import { getServices } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return { title: getDictionary(locale).services.metaTitle };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const services = await getServices(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{dict.services.heading}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{dict.services.intro}</p>

      <div className="mt-12 space-y-10">
        {services.map((service) => (
          <div
            key={service.slug}
            id={service.slug}
            className="rounded-lg border border-border bg-surface p-8 scroll-mt-24"
          >
            <h2 className="font-serif text-2xl font-semibold text-foreground">{service.title}</h2>
            <p className="mt-2 text-muted-foreground">{service.summary}</p>

            {service.whatsIncluded?.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-foreground">
                {service.whatsIncluded.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-gold">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {service.turnaround && (
              <p className="mt-5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{dict.services.turnaround} </span>
                {service.turnaround}
              </p>
            )}

            <Link
              href={`/${locale}/contact?service=${service.slug}`}
              className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              {dict.services.requestQuote}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
