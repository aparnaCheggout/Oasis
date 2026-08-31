"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatMalayalamDate } from "@/lib/date";
import { hasInlineImages, portableTextToPlainText, type ArticleBodyValue } from "@/lib/portableText";
import { titleStyleLabels } from "@/lib/titleStyles";
import type { ArticleTitleStyle } from "@/lib/types";

type Category = "കവിത" | "കഥ" | "ലേഖനം" | "കുറിപ്പ്";
const CATEGORIES: Category[] = ["കവിത", "കഥ", "ലേഖനം", "കുറിപ്പ്"];
const TITLE_STYLES = Object.keys(titleStyleLabels) as ArticleTitleStyle[];
const AUTHOR_STORAGE_KEY = "magazine_author_name";

type ArticleSummary = {
  _id: string;
  title: string;
  titleStyle?: ArticleTitleStyle;
  authorName: string;
  authorPhotoUrl?: string;
  category: string;
  body: ArticleBodyValue;
  publishedAt: string;
  slug: string;
  issueSlug: string;
};

type Screen = "checking" | "pin" | "list" | "form";

export default function MagazineSubmitPage() {
  const [screen, setScreen] = useState<Screen>("checking");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [banner, setBanner] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(AUTHOR_STORAGE_KEY) ?? ""
  );
  const [category, setCategory] = useState<Category | null>(null);
  const [titleStyle, setTitleStyle] = useState<ArticleTitleStyle>("default");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoAssetId, setPhotoAssetId] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  function startNew() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setCategory(null);
    setTitleStyle("default");
    setPhotoPreviewUrl(null);
    setPhotoAssetId(null);
    setPhotoError("");
    setFormError("");
    setScreen("form");
  }

  function startEdit(article: ArticleSummary) {
    if (hasInlineImages(article.body)) {
      setBanner("ഈ രചനയിൽ ചിത്രങ്ങൾ ഉണ്ട് — ഇത് സ്റ്റുഡിയോയിൽ മാത്രമേ തിരുത്താനാകൂ.");
      return;
    }
    setEditingId(article._id);
    setTitle(article.title);
    setBody(portableTextToPlainText(article.body));
    setCategory(article.category as Category);
    setTitleStyle(article.titleStyle ?? "default");
    setAuthorName(article.authorName);
    setPhotoPreviewUrl(article.authorPhotoUrl ?? null);
    setPhotoAssetId(null);
    setPhotoError("");
    setFormError("");
    setScreen("form");
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError("");

    if (file.type !== "image/jpeg") {
      setPhotoError("JPEG ചിത്രം മാത്രം അപ്‌ലോഡ് ചെയ്യുക");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("ചിത്രം വളരെ വലുതാണ് (5MB വരെ മാത്രം)");
      return;
    }

    setPhotoPreviewUrl(URL.createObjectURL(file));
    setPhotoUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/magazine-upload-photo", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setPhotoError(data.error ?? "അപ്‌ലോഡ് പരാജയപ്പെട്ടു");
        setPhotoAssetId(null);
        return;
      }

      setPhotoAssetId(data.assetId);
    } catch {
      setPhotoError("അപ്‌ലോഡ് പരാജയപ്പെട്ടു");
      setPhotoAssetId(null);
    } finally {
      setPhotoUploading(false);
    }
  }

  useEffect(() => {
    fetch("/api/magazine-session")
      .then((res) => res.json())
      .then((data) => setScreen(data.authenticated ? "list" : "pin"))
      .catch(() => setScreen("pin"));
  }, []);

  async function loadArticles() {
    setListLoading(true);
    setListError("");
    try {
      const res = await fetch("/api/magazine-list");
      const data = await res.json();
      if (!res.ok) {
        setListError(data.error ?? "എന്തോ പിശക്");
        return;
      }
      setArticles(data.articles);
    } catch {
      setListError("എന്തോ പിശക്. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    // Standard fetch-on-mount pattern: loadArticles sets loading/error state
    // as part of the fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (screen === "list") loadArticles();
  }, [screen]);

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
      setScreen("list");
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

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      authorName,
      category,
      titleStyle,
      title,
      body,
      ...(photoAssetId ? { authorPhotoAssetId: photoAssetId } : {}),
    };

    try {
      const res = await fetch(editingId ? "/api/magazine-edit" : "/api/magazine-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "എന്തോ പിശക്");
        return;
      }

      setTitle("");
      setBody("");
      setCategory(null);
      setBanner(editingId ? "മാറ്റങ്ങൾ സേവ് ചെയ്തു!" : "പ്രസിദ്ധീകരിച്ചു!");
      setEditingId(null);
      setScreen("list");
    } catch {
      setFormError("എന്തോ പിശക്. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(article: ArticleSummary) {
    setArticles((prev) => prev.filter((a) => a._id !== article._id));
    setConfirmingId(null);
    try {
      const res = await fetch("/api/magazine-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article._id }),
      });
      if (!res.ok) {
        setBanner("ഇല്ലാതാക്കാൻ കഴിഞ്ഞില്ല");
        loadArticles();
      }
    } catch {
      setBanner("ഇല്ലാതാക്കാൻ കഴിഞ്ഞില്ല");
      loadArticles();
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

  if (screen === "form") {
    return (
      <div className="mx-auto max-w-lg px-6 py-12">
        <button
          onClick={() => {
            setEditingId(null);
            setScreen("list");
          }}
          className="font-malayalam text-lg text-accent hover:underline"
        >
          &larr; തിരികെ
        </button>

        <h1 className="mt-4 font-malayalam text-3xl font-semibold text-foreground">
          {editingId ? "രചന തിരുത്തുക" : "പുതിയ രചന"}
        </h1>

        <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block font-malayalam text-xl text-foreground">നിങ്ങളുടെ പേര്</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={100}
              className="mt-2 w-full rounded-lg border-2 border-border bg-surface px-4 py-4 font-malayalam text-xl text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-malayalam text-xl text-foreground">നിങ്ങളുടെ ഫോട്ടോ (JPEG)</label>
            <div className="mt-2 flex items-center gap-4">
              {photoPreviewUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not a Sanity/remote URL next/image can handle
                <img
                  src={photoPreviewUrl}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <label className="cursor-pointer rounded-full border-2 border-border bg-surface px-4 py-2 font-malayalam text-sm text-foreground">
                {photoUploading ? "അപ്‌ലോഡ് ചെയ്യുന്നു…" : "ഫോട്ടോ തിരഞ്ഞെടുക്കുക"}
                <input
                  type="file"
                  accept="image/jpeg"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            {photoError && <p className="mt-2 font-malayalam text-sm text-accent">{photoError}</p>}
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
            <label className="block font-malayalam text-xl text-foreground">തലക്കെട്ടിന്റെ രൂപം</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {TITLE_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTitleStyle(style)}
                  className={`rounded-lg border-2 py-3 font-malayalam text-lg transition-colors ${
                    titleStyle === style
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-surface text-foreground"
                  }`}
                >
                  {titleStyleLabels[style]}
                </button>
              ))}
            </div>
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
            disabled={submitting || photoUploading}
            className="w-full rounded-full bg-accent py-4 font-malayalam text-xl font-medium text-accent-foreground disabled:opacity-60"
          >
            {submitting
              ? "അയക്കുന്നു…"
              : editingId
                ? "സേവ് ചെയ്യുക"
                : "പ്രസിദ്ധീകരിക്കുക"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-malayalam text-3xl font-semibold text-foreground">രചനകൾ</h1>

      {banner && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-teal/10 px-4 py-3 font-malayalam text-teal">
          <span>{banner}</span>
          <button onClick={() => setBanner("")} className="text-sm underline">
            അടയ്ക്കുക
          </button>
        </div>
      )}

      <button
        onClick={startNew}
        className="mt-6 w-full rounded-full bg-accent py-4 font-malayalam text-xl font-medium text-accent-foreground"
      >
        + പുതിയ രചന ചേർക്കുക
      </button>

      <div className="mt-8 space-y-4">
        {listLoading && <p className="font-malayalam text-muted-foreground">തിരയുന്നു…</p>}
        {listError && <p className="font-malayalam text-accent">{listError}</p>}
        {!listLoading && !listError && articles.length === 0 && (
          <p className="font-malayalam text-muted-foreground">ഇതുവരെ രചനകളൊന്നും ചേർത്തിട്ടില്ല.</p>
        )}
        {articles.map((article) => (
          <div
            key={article._id}
            className="rounded-lg border-2 border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                {article.authorPhotoUrl && (
                  <Image
                    src={article.authorPhotoUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-malayalam text-xs text-gold">{article.category}</p>
                  <h2 className="mt-1 font-malayalam text-lg font-semibold text-foreground">
                    {article.title}
                  </h2>
                  <p className="mt-1 font-malayalam text-sm text-muted-foreground">
                    {article.authorName} · {formatMalayalamDate(article.publishedAt)}
                  </p>
                </div>
              </div>
              {confirmingId === article._id ? (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleDelete(article)}
                    className="rounded-full bg-accent px-3 py-2 font-malayalam text-sm text-accent-foreground"
                  >
                    ഉറപ്പാണോ?
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="rounded-full border-2 border-border px-3 py-2 font-malayalam text-sm text-foreground"
                  >
                    വേണ്ട
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingId(article._id)}
                  className="shrink-0 rounded-full border-2 border-border px-3 py-2 font-malayalam text-sm text-accent"
                >
                  ഇല്ലാതാക്കുക
                </button>
              )}
            </div>
            <div className="mt-2 flex gap-4">
              <Link
                href={`/ml/magazine/${article.issueSlug}/${article.slug}`}
                className="font-malayalam text-sm text-accent hover:underline"
              >
                കാണുക
              </Link>
              <button
                onClick={() => startEdit(article)}
                className="font-malayalam text-sm text-accent hover:underline"
              >
                തിരുത്തുക
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
