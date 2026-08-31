import "server-only";
import { writeClient } from "./writeClient";
import { getCurrentIssueInfo } from "@/lib/date";

export type CurrentIssue = {
  id: string;
  slug: string;
  title: string;
  coverImageAssetId?: string;
};

// Finds the current month's Magazine Issue, creating it if it doesn't
// exist yet. Used both to auto-file new articles and to manage the
// issue's cover image from the simple submission form.
export async function getOrCreateCurrentIssue(): Promise<CurrentIssue | null> {
  if (!writeClient) return null;

  const issueInfo = getCurrentIssueInfo();

  const existing = await writeClient.fetch<{
    _id: string;
    title: string;
    coverImage?: { asset?: { _ref: string } };
  } | null>(
    `*[_type == "magazineIssue" && slug.current == $slug][0]{ _id, title, coverImage }`,
    { slug: issueInfo.slug }
  );

  if (existing) {
    return {
      id: existing._id,
      slug: issueInfo.slug,
      // Use the issue's actual stored title (may differ in wording/order
      // from a freshly computed one) rather than recomputing it.
      title: existing.title,
      coverImageAssetId: existing.coverImage?.asset?._ref,
    };
  }

  const created = await writeClient.create({
    _type: "magazineIssue",
    title: issueInfo.title,
    slug: { _type: "slug", current: issueInfo.slug },
    issueDate: issueInfo.issueDate,
  });

  return { id: created._id, slug: issueInfo.slug, title: issueInfo.title };
}
