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
      name: "titleStyle",
      title: "Title style",
      description: "Visual style for the title on the article page.",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Large", value: "large" },
          { title: "Elegant (centered)", value: "elegant" },
          { title: "Colorful", value: "colorful" },
        ],
        layout: "radio",
      },
      initialValue: "default",
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
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "authorPhoto",
      title: "Author photo",
      description: "JPEG photo of the contributor, shown alongside their name.",
      type: "image",
      options: { hotspot: true },
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
      description: "The full piece. Add images (e.g. caricatures) inline using the image button in the toolbar.",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
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
    select: { title: "title", subtitle: "authorName", media: "authorPhoto" },
  },
});
