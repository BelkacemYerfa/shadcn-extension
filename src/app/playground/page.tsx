import { PlaygroundLoader } from "@/components/loaders/playground-loader";
import dynamic from "next/dynamic";

const Playground = dynamic(() => import("@/components/playground/playground"), {
  ssr: true,
  loading: () => <PlaygroundLoader />,
});

export default async function PlaygroundPage() {
  return (
    <main className="flex items-center justify-center size-full pt-14 pb-2 bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative px-4">
      <Playground />
    </main>
  );
}
