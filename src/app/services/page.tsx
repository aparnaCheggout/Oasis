import Link from "next/link";
import type { Metadata } from "next";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">Services</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Whether you have a manuscript ready to translate, a document ready to lay out, or a book
        you want carried from English draft to finished Malayalam edition, here is how that
        works.
      </p>

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
                <span className="font-medium text-foreground">Turnaround: </span>
                {service.turnaround}
              </p>
            )}

            <Link
              href={`/contact?service=${service.slug}`}
              className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Request a quote
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
