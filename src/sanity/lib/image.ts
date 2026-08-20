import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const imageBuilder = projectId && dataset
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source?: SanityImageSource) {
  if (!source || !imageBuilder) return undefined;
  return imageBuilder.image(source).auto("format").fit("max");
}
