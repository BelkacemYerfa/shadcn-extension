import { Metadata } from "next";
import { allDocs as docs } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-component";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/pager";
import { Toc } from "@/components/layouts/toc";
import { getTableOfContents } from "@/lib/toc";
import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";
import { MdxIcons } from "@/components/icons";

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
  const doc = await getDocFromParams({ params });
  if (doc == null) return {};
  return { title: doc.title, description: doc.description };
}
export default async function CurrentSlugPage({ params }: DocsPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) notFound();
  const toc = await getTableOfContents(doc.body.raw);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <article className="col-span-1 md:col-span-3 lg:col-span-2 pt-2 pb-3 space-y-10">
        <div className="space-y-2 not-prose">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        <Mdx code={doc.body.code} />
        <DocsPager doc={doc} />
      </article>
      {toc.children && (
        <div className="col-span-1 fixed top-14 z-30 ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:hidden lg:sticky lg:block py-2 space-y-4">
          <Toc toc={toc.children} slug={doc.slug} />
        </div>
      )}
    </div>
  );
}
