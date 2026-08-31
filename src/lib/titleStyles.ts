import type { ArticleTitleStyle } from "./types";

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
