/* import { MultiSelect } from "@/components/extension/fancy-multi-select/multi-select"; */
import { BreadCrumb } from "@/components/extension/breadcrumb/bread-crumb";
import {
  ImageUpload,
  Model,
  OtpTest,
  TreeViewTest,
  Commander,
  CommanderUsingUseState,
  CarouselExample,
  BreadCrumbTest,
  FileUploaderTest,
} from "@/components/extension/model";

import { ModeToggle } from "@/components/toggle-theme";

//provide the set of api to the component that allow to build the ui examples
export default function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col h-[100dvh]">
      {/* <Model /> */}
      {/* <div className="flex items-center justify-center gap-2 w-full">
        <ImageUpload />
         <CarouselExample />
      </div> */}
      {/*  <Commander /> */}
      {/* <CommanderUsingUseState /> */}
      {/* <OtpTest /> */}
      {/*  <TreeViewTest />
      <BreadCrumbTest /> */}
      <FileUploaderTest />
      <div className="absolute right-2 bottom-2">
        <ModeToggle />
      </div>
    </main>
  );
}
