import { defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "./locale";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    localeStringField("tagline", "Tagline"),
    defineField({
      name: "founderName",
      title: "Founder name",
      type: "string",
    }),
    defineField({
      name: "founderPhoto",
      title: "Founder photo",
      type: "image",
      options: { hotspot: true },
    }),
    localeTextField("bio", "Bio", 6),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "businessName" },
  },
});
