// The rich Sanity/Studio editor stores article bodies as Portable Text
// (an array of blocks, which can include inline images). The simple
// /magazine-submit form works with plain paragraphs plus a separate list
// of images (each pinned to "after paragraph N"), so these convert
// between that world and Portable Text at the boundary.

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

export type SimpleImage = {
  assetId: string;
  caption?: string;
  // Index (0-based) of the paragraph this image should appear after.
  afterParagraph: number;
};

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

function textBlock(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
  };
}

function imageBlock(image: SimpleImage): PortableTextImage {
  return {
    _type: "image",
    _key: randomKey(),
    asset: { _type: "reference", _ref: image.assetId },
    ...(image.caption ? { caption: image.caption } : {}),
  };
}

export function plainTextToPortableText(text: string): PortableTextBlock[] {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return paragraphs.map(textBlock);
}

export function portableTextToPlainText(blocks: ArticleBodyValue | undefined): string {
  if (!blocks) return "";
  return blocks
    .filter((block): block is PortableTextBlock => block._type === "block")
    .map((block) => block.children.map((span) => span.text).join(""))
    .join("\n\n");
}

// Interleaves plain-text paragraphs with images, each image placed
// immediately after the paragraph index given in `afterParagraph`.
export function buildBodyFromPlainTextAndImages(
  text: string,
  images: SimpleImage[]
): ArticleBodyValue {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  const result: ArticleBodyValue = [];

  paragraphs.forEach((paragraph, index) => {
    result.push(textBlock(paragraph));
    images
      .filter((image) => image.afterParagraph === index)
      .forEach((image) => result.push(imageBlock(image)));
  });

  // Images pinned past the last paragraph (or if there are no paragraphs
  // at all) go at the very end.
  const lastIndex = paragraphs.length - 1;
  images
    .filter((image) => image.afterParagraph > lastIndex)
    .forEach((image) => result.push(imageBlock(image)));

  return result;
}

// The inverse of buildBodyFromPlainTextAndImages: pulls the plain text
// back out plus each image's asset id, caption, and position, so the
// simple form can pre-fill from content that may include images.
export function parseBodyToPlainTextAndImages(blocks: ArticleBodyValue | undefined): {
  text: string;
  images: SimpleImage[];
} {
  if (!blocks) return { text: "", images: [] };

  const paragraphs: string[] = [];
  const images: SimpleImage[] = [];
  let paragraphIndex = -1;

  for (const block of blocks) {
    if (block._type === "block") {
      paragraphIndex += 1;
      paragraphs.push(block.children.map((span) => span.text).join(""));
    } else if (block._type === "image") {
      images.push({
        assetId: block.asset._ref,
        caption: block.caption,
        afterParagraph: paragraphIndex,
      });
    }
  }

  return { text: paragraphs.join("\n\n"), images };
}

// A title is a single Portable Text block with only bold/italic marks
// allowed (no images, no multiple paragraphs) — enough to let the editor
// decide how the title itself reads, without the full body editor.
export type RichTitle = PortableTextBlock[];

const TITLE_MARK_TAGS: Record<string, string> = { strong: "STRONG", em: "EM" };

export function titleToPlainText(title: RichTitle | undefined): string {
  return portableTextToPlainText(title as ArticleBodyValue | undefined);
}

export function plainTextToTitle(text: string): RichTitle {
  const trimmed = text.trim();
  return trimmed ? [textBlock(trimmed)] : [];
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Renders a title's marks as inline HTML, for pre-filling the simple
// form's rich text box when editing an existing piece.
export function titleToHtml(title: RichTitle | undefined): string {
  const block = title?.[0];
  if (!block || block._type !== "block") return "";

  return block.children
    .map((span) => {
      let html = escapeHtml(span.text);
      if (span.marks.includes("em")) html = `<${TITLE_MARK_TAGS.em}>${html}</${TITLE_MARK_TAGS.em}>`;
      if (span.marks.includes("strong")) {
        html = `<${TITLE_MARK_TAGS.strong}>${html}</${TITLE_MARK_TAGS.strong}>`;
      }
      return html;
    })
    .join("");
}

// The inverse of titleToHtml: walks a contentEditable element's DOM after
// editing and rebuilds a title block, tracking bold/italic from ancestor
// <strong>/<em> (and legacy <b>/<i>) tags.
export function domToTitle(container: HTMLElement): RichTitle {
  const spans: PortableTextSpan[] = [];

  function walk(node: ChildNode, marks: string[]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text.length > 0) {
        spans.push({ _type: "span", _key: randomKey(), text, marks: [...marks] });
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    if (el.tagName === "BR") {
      spans.push({ _type: "span", _key: randomKey(), text: " ", marks: [] });
      return;
    }

    let nextMarks = marks;
    if (el.tagName === "STRONG" || el.tagName === "B") nextMarks = [...marks, "strong"];
    else if (el.tagName === "EM" || el.tagName === "I") nextMarks = [...marks, "em"];

    el.childNodes.forEach((child) => walk(child, nextMarks));
  }

  container.childNodes.forEach((child) => walk(child, []));

  const nonEmpty = spans.filter((span) => span.text.length > 0);
  if (nonEmpty.length === 0) return [];

  return [
    {
      _type: "block",
      _key: randomKey(),
      style: "normal",
      markDefs: [],
      children: nonEmpty,
    },
  ];
}
