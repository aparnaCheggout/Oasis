import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role",
      type: "string",
      description: 'e.g. "Self-published author" or "Publisher, XYZ Books"',
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "relatedShowcaseItem",
      title: "Related showcase item",
      type: "reference",
      to: [{ type: "showcaseItem" }],
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote" },
  },
});
