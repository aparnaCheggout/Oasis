import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import type { Locale } from "./locale";
import {
  sampleServices,
  sampleShowcaseItems,
  sampleSiteSettings,
  sampleTestimonials,
} from "./sampleData";
import type { Service, ShowcaseItem, SiteSettings, Testimonial } from "./types";

type LocaleValue = { en?: string; ml?: string };

export type RawService = {
  slug: string;
  title: LocaleValue;
  summary: LocaleValue;
  whatsIncluded?: LocaleValue[];
  turnaround?: LocaleValue;
  order: number;
};

export type RawShowcaseItem = {
  slug: string;
  title: LocaleValue;
  workType: ShowcaseItem["workType"];
  coverImageUrl?: string;
  description?: LocaleValue;
  originalAuthor?: string;
  yearCompleted?: number;
  externalLink?: string;
  featured: boolean;
  order: number;
};

export type RawTestimonial = {
  authorName: string;
  authorRole?: LocaleValue;
  quote: LocaleValue;
};

export type RawSiteSettings = {
  businessName: string;
  tagline?: LocaleValue;
  founderName?: string;
  founderPhotoUrl?: string;
  bio?: LocaleValue;
  contactEmail: string;
  contactPhone?: string;
};

function pick(value: LocaleValue | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] || value.en || "";
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const raw = await getRawSiteSettings();
  return {
    businessName: raw.businessName,
    tagline: pick(raw.tagline, locale),
    founderName: raw.founderName,
    founderPhotoUrl: raw.founderPhotoUrl,
    bio: pick(raw.bio, locale),
    contactEmail: raw.contactEmail,
    contactPhone: raw.contactPhone,
  };
}

async function getRawSiteSettings(): Promise<RawSiteSettings> {
  if (!client) return sampleSiteSettings;

  const data = await client.fetch(`*[_type == "siteSettings"][0]{
    businessName, tagline, founderName, founderPhoto, bio, contactEmail, contactPhone
  }`);

  if (!data) return sampleSiteSettings;

  return {
    businessName: data.businessName,
    tagline: data.tagline,
    founderName: data.founderName,
    founderPhotoUrl: urlForImage(data.founderPhoto)?.width(400).url(),
    bio: data.bio,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
  };
}

export async function getServices(locale: Locale): Promise<Service[]> {
  const raw = await getRawServices();
  return raw.map((service) => ({
    slug: service.slug,
    title: pick(service.title, locale),
    summary: pick(service.summary, locale),
    whatsIncluded: (service.whatsIncluded ?? []).map((item) => pick(item, locale)),
    turnaround: service.turnaround ? pick(service.turnaround, locale) : undefined,
    order: service.order,
  }));
}

async function getRawServices(): Promise<RawService[]> {
  if (!client) return sampleServices;

  const data = await client.fetch(`*[_type == "service"] | order(order asc){
    "slug": slug.current, title, summary, whatsIncluded, turnaround, order
  }`);

  return data?.length ? data : sampleServices;
}

export async function getShowcaseItems(locale: Locale): Promise<ShowcaseItem[]> {
  const raw = await getRawShowcaseItems();
  return raw.map((item) => ({
    slug: item.slug,
    title: pick(item.title, locale),
    workType: item.workType,
    coverImageUrl: item.coverImageUrl,
    description: item.description ? pick(item.description, locale) : undefined,
    originalAuthor: item.originalAuthor,
    yearCompleted: item.yearCompleted,
    externalLink: item.externalLink,
    featured: item.featured,
    order: item.order,
  }));
}

async function getRawShowcaseItems(): Promise<RawShowcaseItem[]> {
  if (!client) return sampleShowcaseItems;

  const data = await client.fetch(`*[_type == "showcaseItem"] | order(order asc){
    "slug": slug.current, title, workType, coverImage, description,
    originalAuthor, yearCompleted, externalLink, featured, order
  }`);

  if (!data?.length) return sampleShowcaseItems;

  return data.map((item: Record<string, unknown>) => ({
    ...item,
    coverImageUrl: urlForImage(item.coverImage as never)?.width(600).url(),
  }));
}

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  const raw = await getRawTestimonials();
  return raw.map((testimonial) => ({
    authorName: testimonial.authorName,
    authorRole: testimonial.authorRole ? pick(testimonial.authorRole, locale) : undefined,
    quote: pick(testimonial.quote, locale),
  }));
}

async function getRawTestimonials(): Promise<RawTestimonial[]> {
  if (!client) return sampleTestimonials;

  const data = await client.fetch(`*[_type == "testimonial"]{
    authorName, authorRole, quote
  }`);

  return data ?? [];
}
