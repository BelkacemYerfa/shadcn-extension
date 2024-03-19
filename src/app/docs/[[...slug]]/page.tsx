import { Metadata } from "next";
import { allDocs as docs } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-component";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/pager";
import { Toc } from "@/components/layouts/toc";
import { getTableOfContents } from "@/lib/toc";

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
  const toc = await getTableOfContents(currentDoc.body.raw);
  if (!toc.children) return <p>issue</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <article className="col-span-1 md:col-span-3 lg:col-span-2 prose prose-neutral dark:prose-invert pt-2 pb-3 ">
        <h1>{currentDoc.title}</h1>
        <Mdx code={currentDoc.body.code} />
        <DocsPager doc={currentDoc} />
      </article>
      <div className="col-span-1 fixed top-14 z-30 ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:hidden lg:sticky lg:block py-2 space-y-4">
        <Toc toc={toc.children} slug={currentDoc.slug} />
      </div>
    </div>
  );
}
