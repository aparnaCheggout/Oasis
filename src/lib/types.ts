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

export type ArticleCategory = "ലേഖനം" | "കവിത" | "കഥ" | "കുറിപ്പ്";

export type MagazineEditor = {
  name: string;
  role: string;
};

export type MagazineIssue = {
  slug: string;
  title: string;
  issueDate: string;
  coverImageUrl?: string;
  description?: string;
  editors?: MagazineEditor[];
};

export type Article = {
  slug: string;
  title: string;
  authorName: string;
  category: ArticleCategory;
  excerpt?: string;
  body: string;
  publishedAt: string;
  issueSlug: string;
};
