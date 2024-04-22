import { Metadata } from "next";
import { allDocs as docs } from "contentlayer/generated";
import { Mdx } from "@/components/mdx-component";
import { notFound } from "next/navigation";
import { DocsPager } from "@/components/pager";
import { DocMainTOC, Toc } from "@/components/layouts/toc";
import { getTableOfContents } from "@/lib/toc";
import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";
import { DocsBreadcrumb } from "@/components/doc-breadcrumb";
import { siteConfig } from "@/config/site-config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrimitiveLink } from "@/components/primitive-link";

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
  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      type: "website",
      url: new URL(`/docs/${doc.slug}`, siteConfig.url).toString(),
      locale: "en_US",
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
  };
}
export default async function CurrentSlugPage({ params }: DocsPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) notFound();

  const toc = await getTableOfContents(doc.body.raw);

  return (
    <main
      id="main-content"
      className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 pb-3 h-full"
    >
      <article className="col-span-1 md:col-span-3 lg:col-span-2 space-y-10">
        <div className="space-y-2 not-prose">
          <DocsBreadcrumb slug={params.slug} />

          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
          {doc.links && (
            <div className="flex items-center space-x-2 pt-2">
              {doc.links.map((link) => (
                <PrimitiveLink key={link.url} href={link.url}>
                  {link.title}
                </PrimitiveLink>
              ))}
            </div>
          )}
        </div>
        <Mdx code={doc.body.code} />
        <DocsPager doc={doc} />
      </article>
      {toc.children && (
        <div className="hidden ml-4 text-sm lg:block">
          <div className="sticky top-10 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-10 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <DocMainTOC toc={toc.children} slug={doc.slug} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  );
}
