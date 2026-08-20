import { defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "./locale";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    localeStringField("title", "Title", true),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    }),
    localeTextField(
      "summary",
      "Short summary",
      2,
      true
    ),
    defineField({
      name: "whatsIncluded",
      title: "What's included",
      type: "array",
      of: [
        {
          type: "object",
          name: "item",
          fields: [
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "ml", title: "Malayalam", type: "string" }),
          ],
        },
      ],
    }),
    localeStringField("turnaround", "Typical turnaround"),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "summary.en" },
  },
});
