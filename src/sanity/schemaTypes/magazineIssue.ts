import { defineField, defineType } from "sanity";

export default defineType({
  name: "magazineIssue",
  title: "Magazine Issue",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: 'e.g. "ഓഗസ്റ്റ് 2026 ലക്കം"',
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
      name: "issueDate",
      title: "Issue month",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
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
      title: "Editor's note",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Issue date, new to old",
      name: "issueDateDesc",
      by: [{ field: "issueDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "issueDate", media: "coverImage" },
  },
});
