import { defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "./locale";

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
    localeStringField("authorRole", "Author role"),
    localeTextField("quote", "Quote", 3, true),
    defineField({
      name: "relatedShowcaseItem",
      title: "Related showcase item",
      type: "reference",
      to: [{ type: "showcaseItem" }],
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote.en" },
  },
});
