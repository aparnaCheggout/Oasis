import { Noto_Sans_Malayalam } from "next/font/google";
import "../globals.css";

const malayalamFont = Noto_Sans_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
});

export const metadata = {
  title: "രചന അയക്കുക",
};

export default function MagazineSubmitLayout({
  children,
}: LayoutProps<"/magazine-submit">) {
  return (
    <html lang="ml" className={`${malayalamFont.variable} h-full antialiased`}>
      <body className="min-h-full bg-background">{children}</body>
    </html>
  );
}
