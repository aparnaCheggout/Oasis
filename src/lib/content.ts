import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  sampleServices,
  sampleShowcaseItems,
  sampleSiteSettings,
  sampleTestimonials,
} from "./sampleData";
import type { Service, ShowcaseItem, SiteSettings, Testimonial } from "./types";

export async function getSiteSettings(): Promise<SiteSettings> {
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

export async function getServices(): Promise<Service[]> {
  if (!client) return sampleServices;

  const data = await client.fetch(`*[_type == "service"] | order(order asc){
    "slug": slug.current, title, summary, whatsIncluded, turnaround, order
  }`);

  return data?.length ? data : sampleServices;
}

export async function getShowcaseItems(): Promise<ShowcaseItem[]> {
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

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!client) return sampleTestimonials;

  const data = await client.fetch(`*[_type == "testimonial"]{
    authorName, authorRole, quote
  }`);

  return data ?? [];
}
