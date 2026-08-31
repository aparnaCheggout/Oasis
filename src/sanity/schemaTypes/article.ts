import { defineField, defineType } from "sanity";

// Extracts plain text from a rich title (array of Portable Text blocks) —
// used for slug generation and the document list preview, since neither
// can work with rich content directly.
function titlePlainText(title: unknown): string {
  if (!Array.isArray(title)) return "";
  return title
    .filter((block) => block?._type === "block")
    .map((block) => (block.children ?? []).map((span: { text?: string }) => span.text ?? "").join(""))
    .join(" ");
}

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Select text and use the toolbar to bold or italicize parts of the title.",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().custom((value) => (titlePlainText(value).trim() ? true : "Title is required")),
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
      options: {
        source: (doc) => titlePlainText((doc as { title?: unknown }).title),
      },
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
    prepare({ title, subtitle, media }) {
      return { title: titlePlainText(title) || "(untitled)", subtitle, media };
    },
  },
});
