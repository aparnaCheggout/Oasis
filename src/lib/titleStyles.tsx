import type { ArticleTitleStyle } from "./types";
import type { RichTitle } from "./portableText";

export const titleStyleClasses: Record<ArticleTitleStyle, string> = {
  default: "font-malayalam text-3xl font-semibold text-foreground",
  large: "font-malayalam text-4xl sm:text-5xl font-bold text-foreground",
  elegant: "font-malayalam text-4xl font-semibold text-foreground text-center italic",
  colorful: "font-malayalam text-4xl font-extrabold text-accent",
};

export const titleStyleLabels: Record<ArticleTitleStyle, string> = {
  default: "സാധാരണ",
  large: "വലുത്",
  elegant: "അലങ്കാരം",
  colorful: "നിറമുള്ളത്",
};

export function getTitleStyleClass(style: ArticleTitleStyle | undefined): string {
  return titleStyleClasses[style ?? "default"];
}

// Renders a rich title's bold/italic marks. The overall look (size,
// color, alignment) still comes from titleStyleClasses on the wrapping
// element — this only handles the editor's inline emphasis.
export function RichTitleText({ title }: { title: RichTitle | undefined }) {
  const block = title?.[0];
  if (!block || block._type !== "block") return null;

  return (
    <>
      {block.children.map((span) => {
        let node: React.ReactNode = span.text;
        if (span.marks.includes("em")) node = <em>{node}</em>;
        if (span.marks.includes("strong")) node = <strong>{node}</strong>;
        return <span key={span._key}>{node}</span>;
      })}
    </>
  );
}
