export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// Sanity is optional until you've created a project (see README).
// When projectId/dataset are unset, the site falls back to sample content
// instead of crashing, so `npm run dev` works out of the box.
export const isSanityConfigured = Boolean(projectId && dataset);
