import { defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "./locale";

export default defineType({
  name: "showcaseItem",
  title: "Showcase Item",
  type: "document",
  fields: [
    localeStringField("title", "Book title", true),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "workType",
      title: "Type of work",
      type: "string",
      options: {
        list: [
          { title: "Translation", value: "translation" },
          { title: "Layout & design", value: "layout" },
          { title: "Translation + layout", value: "both" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    localeTextField("description", "Description", 4),
    defineField({
      name: "originalAuthor",
      title: "Original author",
      type: "string",
      description: "For translations, the author of the original work.",
    }),
    defineField({
      name: "yearCompleted",
      title: "Year completed",
      type: "number",
    }),
    defineField({
      name: "externalLink",
      title: "Where to find it (Amazon, DC Books, etc.)",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "workType", media: "coverImage" },
  },
});
