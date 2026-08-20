import type { Metadata } from "next";
import { Geist, Playfair_Display, Noto_Sans_Malayalam } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Oasis Publishing House",
  description: "English to Malayalam book translation and layout services.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} ${malayalamFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header businessName={settings.businessName} />
        <main className="flex-1">{children}</main>
        <Footer businessName={settings.businessName} contactEmail={settings.contactEmail} />
      </body>
    </html>
  );
}
