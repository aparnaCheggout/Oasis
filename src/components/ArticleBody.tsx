import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import type { Article } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="whitespace-pre-line font-malayalam text-lg leading-relaxed text-foreground">
        {children}
      </p>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1000).url();
      if (!url) return null;
      return (
        <figure className="not-prose">
          <Image
            src={url}
            alt={value.caption ?? ""}
            width={1000}
            height={700}
            className="w-full rounded-lg object-cover"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center font-malayalam text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function ArticleBody({ body }: { body: Article["body"] }) {
  return (
    <div className="space-y-6">
      <PortableText value={body} components={components} />
    </div>
  );
}
