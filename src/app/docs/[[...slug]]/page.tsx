import { Metadata } from "next";
import { allDocs as docs } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-component";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/pager";

type DocsPageProps = {
  params: {
    slug: string[];
  };
};

async function getDocFromParams({ params }: DocsPageProps) {
  const slug = params.slug?.join("/") || "";
  const doc = docs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const currentDoc = await getDocFromParams({ params });
  if (currentDoc == null) return {};
  return { title: currentDoc.title, description: currentDoc.description };
}
export default async function CurrentSlugPage({ params }: DocsPageProps) {
  const currentDoc = await getDocFromParams({ params });
  if (!currentDoc) notFound();
  return (
    <article className="prose prose-neutral dark:prose-invert py-3 ">
      <h1>{currentDoc.title}</h1>
      <Mdx code={currentDoc.body.code} />
      <DocsPager doc={currentDoc} />
    </article>
  );
}
