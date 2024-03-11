import { PlaygroundLoader } from "@/components/loaders/playground-loader";
import dynamic from "next/dynamic";

const Playground = dynamic(() => import("@/components/playground/playground"), {
  ssr: true,
  loading: () => <PlaygroundLoader />,
});

export default async function PlaygroundPage() {
  return (
    <main className="flex items-center justify-center size-full">
      <div className="size-full bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center  px-4 py-1 ">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background[mask-image:radial-gradient(ellipse_at_center,transparent_20%,var(--background))]" />
        <Playground />
      </div>
    </main>
  );
}
