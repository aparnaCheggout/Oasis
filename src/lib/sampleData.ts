// Placeholder content shown when Sanity isn't configured yet (see README).
// Once you connect a real Sanity project and add content in the Studio,
// these are never used. Shape matches what Sanity returns (bilingual
// {en, ml} objects for translatable fields) so the same resolver in
// content.ts works for both.

import type { RawService, RawShowcaseItem, RawSiteSettings, RawTestimonial } from "./content";
import type { Article, MagazineIssue } from "./types";

export const sampleSiteSettings: RawSiteSettings = {
  businessName: "Oasis Publishing House",
  tagline: {
    en: "English to Malayalam translation and book layout, done with care.",
    ml: "ഇംഗ്ലീഷിൽ നിന്ന് മലയാളത്തിലേക്കുള്ള വിവർത്തനവും പുസ്തക ലേഔട്ടും, ശ്രദ്ധയോടെ.",
  },
  founderName: "Your Father's Name",
  founderPhotoUrl: undefined,
  bio: {
    en: "Add a bio in the Studio (/studio) once Sanity is connected — a few lines on experience, the kinds of books you've worked on, and what makes your approach to translation and layout distinct.",
    ml: "സാനിറ്റി (Sanity) ബന്ധിപ്പിച്ചു കഴിഞ്ഞാൽ /studio-യിൽ ഒരു ബയോ ചേർക്കുക — അനുഭവം, ഇതുവരെ ചെയ്ത പുസ്തകങ്ങൾ, വിവർത്തനത്തിലും ലേഔട്ടിലും നിങ്ങളുടെ സമീപനത്തെ വ്യത്യസ്തമാക്കുന്നത് എന്താണെന്ന് ഏതാനും വരികളിൽ.",
  },
  contactEmail: "hello@example.com",
  contactPhone: undefined,
};

export const sampleServices: RawService[] = [
  {
    slug: "translation",
    title: { en: "Translation", ml: "വിവർത്തനം" },
    summary: {
      en: "English to Malayalam translation that preserves voice, not just meaning.",
      ml: "അർത്ഥം മാത്രമല്ല, ശൈലിയും നിലനിർത്തുന്ന ഇംഗ്ലീഷ്-മലയാളം വിവർത്തനം.",
    },
    whatsIncluded: [
      { en: "Full manuscript translation", ml: "പൂർണ്ണ കൈയെഴുത്തുപ്രതി വിവർത്തനം" },
      { en: "One round of revisions", ml: "ഒരു തവണ പുനരവലോകനം" },
      {
        en: "Consistent terminology and tone throughout",
        ml: "സ്ഥിരതയുള്ള പദപ്രയോഗവും ശൈലിയും",
      },
    ],
    turnaround: {
      en: "Typically 4-8 weeks depending on manuscript length",
      ml: "കൈയെഴുത്തുപ്രതിയുടെ ദൈർഘ്യം അനുസരിച്ച് സാധാരണയായി 4-8 ആഴ്ച",
    },
    order: 1,
  },
  {
    slug: "layout",
    title: { en: "Book Layout & Design", ml: "പുസ്തക ലേഔട്ടും ഡിസൈനും" },
    summary: {
      en: "Print- and ebook-ready formatting for your manuscript.",
      ml: "പ്രിന്റിനും ഇ-ബുക്കിനും തയ്യാറായ ഫോർമാറ്റിംഗ്.",
    },
    whatsIncluded: [
      { en: "Interior layout and typesetting", ml: "അകത്തെ ലേഔട്ടും ടൈപ്പ്സെറ്റിംഗും" },
      { en: "Malayalam and bilingual typesetting", ml: "മലയാളം, ദ്വിഭാഷാ ടൈപ്പ്സെറ്റിംഗ്" },
      { en: "Print-ready and ebook file formats", ml: "പ്രിന്റ്, ഇ-ബുക്ക് ഫയൽ ഫോർമാറ്റുകൾ" },
    ],
    turnaround: {
      en: "Typically 2-4 weeks depending on page count",
      ml: "പേജുകളുടെ എണ്ണം അനുസരിച്ച് സാധാരണയായി 2-4 ആഴ്ച",
    },
    order: 2,
  },
  {
    slug: "translation-and-layout",
    title: { en: "Translation + Layout Bundle", ml: "വിവർത്തനവും ലേഔട്ടും ഒരുമിച്ച്" },
    summary: {
      en: "End to end: from an English manuscript to a finished Malayalam book, ready to publish.",
      ml: "തുടക്കം മുതൽ ഒടുക്കം വരെ: ഇംഗ്ലീഷ് കൈയെഴുത്തുപ്രതിയിൽ നിന്ന് പ്രസിദ്ധീകരണത്തിന് തയ്യാറായ മലയാളം പുസ്തകത്തിലേക്ക്.",
    },
    whatsIncluded: [
      { en: "Everything in Translation", ml: "വിവർത്തന സേവനത്തിലെ എല്ലാം" },
      { en: "Everything in Layout & Design", ml: "ലേഔട്ട് & ഡിസൈൻ സേവനത്തിലെ എല്ലാം" },
      {
        en: "One combined timeline and single point of contact",
        ml: "ഒറ്റ സമയക്രമവും ഒറ്റ ബന്ധപ്പെടേണ്ട വ്യക്തിയും",
      },
    ],
    turnaround: {
      en: "Typically 8-12 weeks depending on scope",
      ml: "വ്യാപ്തി അനുസരിച്ച് സാധാരണയായി 8-12 ആഴ്ച",
    },
    order: 3,
  },
];

export const sampleShowcaseItems: RawShowcaseItem[] = [
  {
    slug: "sample-translation-one",
    title: { en: "Add your first translated book", ml: "നിങ്ങളുടെ ആദ്യ വിവർത്തന പുസ്തകം ചേർക്കുക" },
    workType: "translation",
    coverImageUrl: undefined,
    description: {
      en: "Once Sanity is connected, add your published translations here with cover images, the original author, and a link to where readers can find it.",
      ml: "സാനിറ്റി ബന്ധിപ്പിച്ചു കഴിഞ്ഞാൽ, കവർ ചിത്രം, മൂലകൃതിയുടെ രചയിതാവ്, വായനക്കാർക്ക് ലഭിക്കുന്ന ലിങ്ക് എന്നിവയോടെ പ്രസിദ്ധീകരിച്ച വിവർത്തനങ്ങൾ ഇവിടെ ചേർക്കുക.",
    },
    originalAuthor: undefined,
    yearCompleted: undefined,
    externalLink: undefined,
    featured: true,
    order: 1,
  },
  {
    slug: "sample-layout-one",
    title: { en: "Add your first layout project", ml: "നിങ്ങളുടെ ആദ്യ ലേഔട്ട് പ്രോജക്ട് ചേർക്കുക" },
    workType: "layout",
    coverImageUrl: undefined,
    description: {
      en: "Showcase a layout and design project here — the more visual, the better.",
      ml: "ഒരു ലേഔട്ട്, ഡിസൈൻ പ്രോജക്ട് ഇവിടെ പ്രദർശിപ്പിക്കുക — ചിത്രങ്ങൾ കൂടുതലുള്ളത് നല്ലത്.",
    },
    originalAuthor: undefined,
    yearCompleted: undefined,
    externalLink: undefined,
    featured: true,
    order: 2,
  },
];

export const sampleTestimonials: RawTestimonial[] = [];

export const sampleMagazineIssues: MagazineIssue[] = [
  {
    slug: "sample-issue",
    title: "ആദ്യ ലക്കം ചേർക്കുക",
    issueDate: "2026-08-01",
    coverImageUrl: undefined,
    description:
      "സ്റ്റുഡിയോയിൽ ഓരോ മാസത്തെയും ലക്കം ഇവിടെ ഉണ്ടാക്കാം — പേര്, തീയതി, കവർ ചിത്രം എന്നിവ ചേർത്ത് തുടങ്ങുക.",
    editors: [{ name: "എഡിറ്ററുടെ പേര്", role: "മുഖ്യ പത്രാധിപർ" }],
  },
];

export const sampleArticles: Article[] = [
  {
    slug: "sample-article",
    title: "ആദ്യ ലേഖനം ചേർക്കുക",
    authorName: "എഴുത്തുകാരന്റെ പേര്",
    category: "കുറിപ്പ്",
    excerpt: "ഓരോ രചനയും ഒരു ലക്കത്തിനോട് ബന്ധിപ്പിക്കുക.",
    body: "സ്റ്റുഡിയോയിൽ Article എന്ന വിഭാഗത്തിൽ പോയി ഒരു പുതിയ രേഖ ഉണ്ടാക്കുക. തലക്കെട്ട്, എഴുത്തുകാരന്റെ പേര്, വിഭാഗം (ലേഖനം / കവിത / കഥ / കുറിപ്പ്), ഏത് ലക്കത്തിലാണ് എന്നത്, പിന്നെ മുഴുവൻ എഴുത്തും ചേർക്കുക.",
    publishedAt: "2026-08-20T00:00:00.000Z",
    issueSlug: "sample-issue",
  },
];
