import { PlaygroundLoader } from "@/components/loaders/playground-loader";
import { getComponentContent } from "@/lib/element-parser";
import dynamic from "next/dynamic";

const Playground = dynamic(() => import("@/components/playground/playground"), {
  ssr: true,
  loading: () => <PlaygroundLoader />,
});

type PlaygroundPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PlaygroundPage({
  searchParams,
}: PlaygroundPageProps) {
  const currentComponent = searchParams?.comp ?? "Tree View";
  const contentFile = getComponentContent(currentComponent as string);
  console.log(contentFile);
  return (
    <main className="flex items-center justify-center size-full pt-14 pb-2 bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative px-4">
      <Playground defaultCode={contentFile} />
    </main>
  );
}
