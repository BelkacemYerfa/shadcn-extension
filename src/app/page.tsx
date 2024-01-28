import { Model } from "@/components/extension/image-upload/model";
import { ModeToggle } from "@/components/toggle-theme";

export default function Home() {
  return (
    <main className="relative flex justify-center items-center h-[100dvh]">
      <Model />
      <div className="absolute right-2 bottom-2">
        <ModeToggle />
      </div>
    </main>
  );
}
