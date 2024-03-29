import { PlaygroundLoader } from "@/components/loaders/playground-loader";
import {
  getComponentContent,
  getComponentDependencies,
} from "@/lib/element-parser";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const Playground = dynamic(() => import("@/components/playground/playground"), {
  ssr: true,
  loading: () => <PlaygroundLoader />,
});

type PlaygroundPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const CheckSiteLive = () => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
};

export default async function PlaygroundPage({
  searchParams,
}: PlaygroundPageProps) {
  CheckSiteLive();

  const currentComponent = searchParams?.comp ?? "Tree View";
  const contentFile = getComponentContent(currentComponent as string);
  const contentDependencies = getComponentDependencies(
    currentComponent as string
  );
  console.log(contentFile, contentDependencies);
  return (
    <main className="flex items-center justify-center h-screen pt-14 pb-2 bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative px-4">
      <Playground defaultCode={contentFile} />
    </main>
  );
}
