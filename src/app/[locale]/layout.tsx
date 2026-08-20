import type { Metadata } from "next";
import { Geist, Playfair_Display, Noto_Sans_Malayalam } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";
import { getDictionary, isLocale, locales, defaultLocale } from "@/lib/locale";
import "../globals.css";

const bodyFont = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const malayalamFont = Noto_Sans_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Oasis Publishing House",
  description: "English to Malayalam book translation and layout services.",
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings(locale);

  return (
    <html
      lang={locale}
      className={`${bodyFont.variable} ${headingFont.variable} ${malayalamFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header businessName={settings.businessName} dict={dict} locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer businessName={settings.businessName} contactEmail={settings.contactEmail} />
      </body>
    </html>
  );
}
