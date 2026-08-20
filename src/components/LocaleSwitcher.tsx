"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";

const labels: Record<Locale, string> = {
  en: "English",
  ml: "മലയാളം",
};

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-2 text-sm">
      {(["en", "ml"] as const).map((code) => (
        <Link
          key={code}
          href={`/${code}${rest ? `/${rest}` : ""}`}
          className={
            code === locale
              ? "font-medium text-accent"
              : "text-muted-foreground hover:text-accent"
          }
        >
          {labels[code]}
        </Link>
      ))}
    </div>
  );
}
