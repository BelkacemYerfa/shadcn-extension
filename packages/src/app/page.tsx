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
  TreeFileTest,
  MultiSelectorComp,
} from "@/components/extension/model";

import { ModeToggle } from "@/components/toggle-theme";

//provide the set of api to the component that allow to build the ui examples
export default function Home() {
  return (
    <main className="relative flex items-center py-20 flex-col h-[100dvh] space-y-3">
      {/*  <Model /> */}
      {/* <ImageUpload />
      <CarouselExample /> */}
      <Commander />

      {/* <CommanderUsingUseState />
      <OtpTest /> */}
      {/* <BreadCrumbTest /> */}
      {/*  <FileUploaderTest /> */}
      {<MultiSelectorComp />}
      {/* <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-semibold text-3xl">
            Full Built in {"<"}TreeView /{">"}{" "}
          </h2>
          <TreeViewTest />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-semibold text-3xl">
            Full Built in {"<"}Tree /{">"} Api{" "}
          </h2>
          <TreeFileTest />
        </div>
      </div> */}

      <div className="absolute right-2 bottom-2">
        <ModeToggle />
      </div>
    </main>
  );
}
