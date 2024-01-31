/* import { MultiSelect } from "@/components/extension/fancy-multi-select/multi-select"; */
import {
  ImageUpload,
  Model,
  OtpTest,
  TreeViewTest,
} from "@/components/extension/model";

import { ModeToggle } from "@/components/toggle-theme";

export default function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col h-[100dvh]">
      {/*  <Model /> */}
      {/*  <ImageUpload /> */}

      {/* <OtpTest /> */}
      <TreeViewTest />
      <div className="absolute right-2 bottom-2">
        <ModeToggle />
      </div>
    </main>
  );
}
