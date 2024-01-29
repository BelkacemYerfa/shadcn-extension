import { MultiSelect } from "@/components/extension/fancy-multi-select/multi-select";

import { ModeToggle } from "@/components/toggle-theme";

export default function Home() {
  return (
    <main className="relative flex justify-center items-center h-[100dvh]">
      {/* <Model /> */}
      <MultiSelect
        options={[
          "Hello",
          "World",
          "Next.js",
          "Tailwind CSS",
          "TypeScript",
          "React",
          "Vite",
          "Remix",
          "Astro",
          "Svelte",
        ]}
      />
      <div className="absolute right-2 bottom-2">
        <ModeToggle />
      </div>
    </main>
  );
}
