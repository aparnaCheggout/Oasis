"use client";

import { useState } from "react";
import type { Comment } from "@/lib/types";
import type { Dictionary } from "@/lib/locale";
import { formatMalayalamDate } from "@/lib/date";

export default function CommentsSection({
  articleId,
  initialComments,
  dict,
}: {
  articleId: string;
  initialComments: Comment[];
  dict: Dictionary["magazine"]["comments"];
}) {
  const [comments] = useState(initialComments);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    if (!name.trim() || !text.trim()) {
      setErrorMessage(dict.requiredError);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/comment-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, authorName: name, text, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? dict.genericError);
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setText("");
    } catch {
      setErrorMessage(dict.genericError);
      setStatus("error");
    }
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-serif text-2xl font-semibold text-foreground">{dict.heading}</h2>

      <div className="mt-6 space-y-6">
        {comments.length === 0 && (
          <p className="font-malayalam text-muted-foreground">{dict.empty}</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-malayalam font-semibold text-foreground">{comment.authorName}</p>
              <p className="text-xs text-muted-foreground">{formatMalayalamDate(comment.createdAt)}</p>
            </div>
            <p className="mt-2 whitespace-pre-line font-malayalam text-foreground">{comment.text}</p>
          </div>
        ))}
      </div>

      {status === "success" ? (
        <p className="mt-8 rounded-lg bg-teal/10 px-4 py-3 font-malayalam text-teal">
          {dict.success}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div>
            <label className="block text-sm font-medium text-foreground">{dict.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-malayalam text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">{dict.text}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-malayalam text-foreground focus:border-accent focus:outline-none"
            />
          </div>
          {status === "error" && <p className="text-sm text-accent">{errorMessage}</p>}
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? dict.sending : dict.send}
          </button>
        </form>
      )}
    </section>
  );
}
