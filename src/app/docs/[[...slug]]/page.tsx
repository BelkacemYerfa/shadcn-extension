import { docs } from "../../../../.velite";
import { MDXContent } from "@/components/mdx-component";

export default function Post({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  if (slug === "docs" || "") slug = "tree-view";
  const currentDoc = docs.find((i) => i.slug === "docs/" + slug);
  if (!currentDoc) return <div>404 , doc named {slug} not found </div>;
  return (
    <article className="prose prose-neutral dark:prose-invert py-3">
      <h1>{currentDoc.title}</h1>
      <MDXContent code={currentDoc.body} />
    </article>
  );
}
