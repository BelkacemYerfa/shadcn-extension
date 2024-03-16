import { Metadata } from "next";
import { docs } from "../../../../.velite";
import { MDXContent } from "@/components/mdx-component";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/pager";

type DocsPageProps = {
  params: {
    slug: string;
  };
};

const getDocSlug = (slug: string) => {
  return docs.find((i) => i.slug === "docs/" + slug);
};

export function generateMetadata({ params }: DocsPageProps): Metadata {
  const currentDoc = getDocSlug(params.slug);
  if (currentDoc == null) return {};
  return { title: currentDoc.title, description: currentDoc.description };
}
export default function CurrentSlugPage({ params: { slug } }: DocsPageProps) {
  const currentDoc = getDocSlug(slug);
  console.log(slug);
  if (!currentDoc) notFound();
  return (
    <article className="prose prose-neutral dark:prose-invert py-3 ">
      <h1>{currentDoc.title}</h1>
      <MDXContent code={currentDoc.body} />
      <DocsPager doc={currentDoc} />
    </article>
  );
}
