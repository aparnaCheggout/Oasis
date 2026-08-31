// The rich Sanity/Studio editor stores article bodies as Portable Text
// (an array of blocks, which can include inline images). The simple
// /magazine-submit form only handles plain paragraphs, so these convert
// between that plain-text world and Portable Text at the boundary.

export type PortableTextSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type PortableTextBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: unknown[];
  children: PortableTextSpan[];
};

export type PortableTextImage = {
  _type: "image";
  _key: string;
  asset: { _ref: string; _type: "reference" };
  caption?: string;
};

export type ArticleBodyValue = (PortableTextBlock | PortableTextImage)[];

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function plainTextToPortableText(text: string): PortableTextBlock[] {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return paragraphs.map((paragraph) => ({
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text: paragraph, marks: [] }],
  }));
}

export function portableTextToPlainText(blocks: ArticleBodyValue | undefined): string {
  if (!blocks) return "";
  return blocks
    .filter((block): block is PortableTextBlock => block._type === "block")
    .map((block) => block.children.map((span) => span.text).join(""))
    .join("\n\n");
}

export function hasInlineImages(blocks: ArticleBodyValue | undefined): boolean {
  return (blocks ?? []).some((block) => block._type === "image");
}
