export type WorkType = "translation" | "layout" | "both";

export type Service = {
  slug: string;
  title: string;
  summary: string;
  whatsIncluded: string[];
  turnaround?: string;
  order: number;
};

export type ShowcaseItem = {
  slug: string;
  title: string;
  workType: WorkType;
  coverImageUrl?: string;
  description?: string;
  originalAuthor?: string;
  yearCompleted?: number;
  externalLink?: string;
  featured: boolean;
  order: number;
};

export type Testimonial = {
  authorName: string;
  authorRole?: string;
  quote: string;
};

export type SiteSettings = {
  businessName: string;
  tagline?: string;
  founderName?: string;
  founderPhotoUrl?: string;
  bio?: string;
  contactEmail: string;
  contactPhone?: string;
};
