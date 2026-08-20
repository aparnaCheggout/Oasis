import { defineField, defineType } from "sanity";

export default defineType({
  name: "showcaseItem",
  title: "Showcase Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Book title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
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
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
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
    select: { title: "title", subtitle: "workType", media: "coverImage" },
  },
});
