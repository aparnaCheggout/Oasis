import ContactForm from "@/components/ContactForm";
import { getServices } from "@/lib/content";
import { getDictionary, isLocale, defaultLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return { title: getDictionary(locale).contact.metaTitle };
}

export default async function ContactPage({
  params,
  searchParams,
}: PageProps<"/[locale]/contact">) {
  const [{ locale: rawLocale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const services = await getServices(locale);
  const serviceParam = resolvedSearchParams.service;
  const initialServiceSlug = Array.isArray(serviceParam) ? serviceParam[0] : serviceParam;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-foreground">{dict.contact.heading}</h1>
      <p className="mt-3 text-muted-foreground">{dict.contact.intro}</p>

      <div className="mt-10">
        <ContactForm
          services={services}
          initialServiceSlug={initialServiceSlug}
          locale={locale}
          dict={dict.contact.form}
        />
      </div>
    </div>
  );
}
