import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/locale";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header({
  businessName,
  dict,
  locale,
}: {
  businessName: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const navLinks = [
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/showcase`, label: dict.nav.showcase },
    { href: `/${locale}/magazine`, label: dict.nav.magazine },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href={`/${locale}`} className="font-serif text-xl font-semibold tracking-tight text-foreground">
          {businessName}
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
