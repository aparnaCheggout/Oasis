import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "authorName",
      title: "Author name",
      description: "The contributor who wrote this piece.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Article (ലേഖനം)", value: "ലേഖനം" },
          { title: "Poem (കവിത)", value: "കവിത" },
          { title: "Story (കഥ)", value: "കഥ" },
          { title: "Write-up (കുറിപ്പ്)", value: "കുറിപ്പ്" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issue",
      title: "Magazine issue",
      type: "reference",
      to: [{ type: "magazineIssue" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "A short line shown in the issue's table of contents.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 16,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Published date, new to old",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "authorName" },
  },
});
