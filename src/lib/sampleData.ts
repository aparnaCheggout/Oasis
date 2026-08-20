// Placeholder content shown when Sanity isn't configured yet (see README).
// Once you connect a real Sanity project and add content in the Studio,
// these are never used.

import type { Service, ShowcaseItem, SiteSettings, Testimonial } from "./types";

export const sampleSiteSettings: SiteSettings = {
  businessName: "Oasis Publishing House",
  tagline: "English to Malayalam translation and book layout, done with care.",
  founderName: "Your Father's Name",
  founderPhotoUrl: undefined,
  bio: "Add a bio in the Studio (/studio) once Sanity is connected — a few lines on experience, the kinds of books you've worked on, and what makes your approach to translation and layout distinct.",
  contactEmail: "hello@example.com",
  contactPhone: undefined,
};

export const sampleServices: Service[] = [
  {
    slug: "translation",
    title: "Translation",
    summary: "English to Malayalam translation that preserves voice, not just meaning.",
    whatsIncluded: [
      "Full manuscript translation",
      "One round of revisions",
      "Consistent terminology and tone throughout",
    ],
    turnaround: "Typically 4-8 weeks depending on manuscript length",
    order: 1,
  },
  {
    slug: "layout",
    title: "Book Layout & Design",
    summary: "Print- and ebook-ready formatting for your manuscript.",
    whatsIncluded: [
      "Interior layout and typesetting",
      "Malayalam and bilingual typesetting",
      "Print-ready and ebook file formats",
    ],
    turnaround: "Typically 2-4 weeks depending on page count",
    order: 2,
  },
  {
    slug: "translation-and-layout",
    title: "Translation + Layout Bundle",
    summary: "End to end: from an English manuscript to a finished Malayalam book, ready to publish.",
    whatsIncluded: [
      "Everything in Translation",
      "Everything in Layout & Design",
      "One combined timeline and single point of contact",
    ],
    turnaround: "Typically 8-12 weeks depending on scope",
    order: 3,
  },
];

export const sampleShowcaseItems: ShowcaseItem[] = [
  {
    slug: "sample-translation-one",
    title: "Add your first translated book",
    workType: "translation",
    coverImageUrl: undefined,
    description:
      "Once Sanity is connected, add your published translations here with cover images, the original author, and a link to where readers can find it.",
    originalAuthor: undefined,
    yearCompleted: undefined,
    externalLink: undefined,
    featured: true,
    order: 1,
  },
  {
    slug: "sample-layout-one",
    title: "Add your first layout project",
    workType: "layout",
    coverImageUrl: undefined,
    description:
      "Showcase a layout and design project here — the more visual, the better.",
    originalAuthor: undefined,
    yearCompleted: undefined,
    externalLink: undefined,
    featured: true,
    order: 2,
  },
];

export const sampleTestimonials: Testimonial[] = [];
