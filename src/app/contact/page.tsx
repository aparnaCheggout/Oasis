import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [services, params] = await Promise.all([getServices(), searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">Get in touch</h1>
      <p className="mt-3 text-muted-foreground">
        Share a few details about your book and we&apos;ll follow up with a quote and timeline.
      </p>

      <div className="mt-10">
        <ContactForm services={services} initialServiceSlug={params.service} />
      </div>
    </div>
  );
}
