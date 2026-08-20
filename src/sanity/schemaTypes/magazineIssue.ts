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
    defineField({
      name: "editors",
      title: "Editorial team",
      description: "Shown as a masthead on the issue page.",
      type: "array",
      of: [
        {
          type: "object",
          name: "editor",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "role",
              title: "Role",
              description: 'e.g. "മുഖ്യ പത്രാധിപർ" (Chief Editor)',
              type: "string",
            }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        },
      ],
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
