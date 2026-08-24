"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = "കവിത" | "കഥ" | "ലേഖനം" | "കുറിപ്പ്";
const CATEGORIES: Category[] = ["കവിത", "കഥ", "ലേഖനം", "കുറിപ്പ്"];
const AUTHOR_STORAGE_KEY = "magazine_author_name";

type Screen = "checking" | "pin" | "form" | "success";

export default function MagazineSubmitPage() {
  const [screen, setScreen] = useState<Screen>("checking");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  const [authorName, setAuthorName] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(AUTHOR_STORAGE_KEY) ?? ""
  );
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successLink, setSuccessLink] = useState("");

  useEffect(() => {
    fetch("/api/magazine-session")
      .then((res) => res.json())
      .then((data) => setScreen(data.authenticated ? "form" : "pin"))
      .catch(() => setScreen("pin"));
  }, []);

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPinLoading(true);
    setPinError("");
    try {
      const res = await fetch("/api/magazine-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPinError(data.error ?? "എന്തോ പിശക്");
        return;
      }
      setScreen("form");
    } catch {
      setPinError("എന്തോ പിശക്. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setPinLoading(false);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!authorName.trim() || !category || !title.trim() || !body.trim()) {
      setFormError("എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക");
      return;
    }

    window.localStorage.setItem(AUTHOR_STORAGE_KEY, authorName.trim());
    setSubmitting(true);

    try {
      const res = await fetch("/api/magazine-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, category, title, body }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "എന്തോ പിശക്");
        return;
      }

      setSuccessLink(`/ml/magazine/${data.issueSlug}/${data.articleSlug}`);
      setScreen("success");
      setTitle("");
      setBody("");
      setCategory(null);
    } catch {
      setFormError("എന്തോ പിശക്. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setSubmitting(false);
    }
  }

  if (screen === "checking") {
    return null;
  }

  if (screen === "pin") {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <h1 className="text-center font-malayalam text-3xl font-semibold text-foreground">
          രചന അയക്കാൻ കോഡ് നൽകുക
        </h1>
        <form onSubmit={handlePinSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            autoFocus
            className="w-full rounded-lg border-2 border-border bg-surface px-4 py-4 text-center text-3xl tracking-widest text-foreground focus:border-accent focus:outline-none"
            placeholder="******"
          />
          {pinError && (
            <p className="text-center font-malayalam text-lg text-accent">{pinError}</p>
          )}
          <button
            type="submit"
            disabled={pinLoading}
            className="w-full rounded-full bg-accent py-4 font-malayalam text-xl font-medium text-accent-foreground disabled:opacity-60"
          >
            തുടരുക
          </button>
        </form>
      </div>
    );
  }

  if (screen === "success") {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
        <p className="font-malayalam text-4xl">✓</p>
        <h1 className="mt-4 font-malayalam text-3xl font-semibold text-foreground">
          പ്രസിദ്ധീകരിച്ചു!
        </h1>
        <Link
          href={successLink}
          className="mt-8 w-full rounded-full border-2 border-border px-6 py-4 font-malayalam text-xl text-foreground"
        >
          കാണുക
        </Link>
        <button
          onClick={() => setScreen("form")}
          className="mt-4 w-full rounded-full bg-accent py-4 font-malayalam text-xl font-medium text-accent-foreground"
        >
          മറ്റൊന്ന് അയക്കുക
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-malayalam text-3xl font-semibold text-foreground">പുതിയ രചന</h1>

      <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block font-malayalam text-xl text-foreground">നിങ്ങളുടെ പേര്</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-border bg-surface px-4 py-4 font-malayalam text-xl text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-malayalam text-xl text-foreground">വിഭാഗം</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-lg border-2 py-4 font-malayalam text-xl transition-colors ${
                  category === c
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-malayalam text-xl text-foreground">തലക്കെട്ട്</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-border bg-surface px-4 py-4 font-malayalam text-xl text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-malayalam text-xl text-foreground">എഴുത്ത്</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="mt-2 w-full rounded-lg border-2 border-border bg-surface px-4 py-4 font-malayalam text-xl leading-relaxed text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        {formError && <p className="font-malayalam text-lg text-accent">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-accent py-4 font-malayalam text-xl font-medium text-accent-foreground disabled:opacity-60"
        >
          {submitting ? "അയക്കുന്നു…" : "പ്രസിദ്ധീകരിക്കുക"}
        </button>
      </form>
    </div>
  );
}
