import { defineField, defineType } from "sanity";

export default defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "article",
      title: "Article",
      type: "reference",
      to: [{ type: "article" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "text",
      title: "Comment",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(1000),
    }),
    defineField({
      name: "approved",
      title: "Approved",
      description: "Comments are hidden from the site until approved here.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Submitted at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "authorName", subtitle: "text", approved: "approved" },
    prepare({ title, subtitle, approved }) {
      return {
        title: `${approved ? "✓" : "…"} ${title}`,
        subtitle,
      };
    },
  },
});
