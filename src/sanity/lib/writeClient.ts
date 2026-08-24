import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "../env";

// Server-only client for writes (used by the magazine submission form).
// Never import this from a Client Component — the token would leak.
const token = process.env.SANITY_WRITE_TOKEN;

export const writeClient =
  isSanityConfigured && token
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
      })
    : null;
