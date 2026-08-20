import { defineField } from "sanity";

export function localeStringField(name: string, title: string, required = false) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "string" }),
      defineField({ name: "ml", title: "Malayalam", type: "string" }),
    ],
    validation: required ? (Rule) => Rule.required() : undefined,
  });
}

export function localeTextField(name: string, title: string, rows = 3, required = false) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "text", rows }),
      defineField({ name: "ml", title: "Malayalam", type: "text", rows }),
    ],
    validation: required ? (Rule) => Rule.required() : undefined,
  });
}
