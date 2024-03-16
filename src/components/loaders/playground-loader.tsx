import { EditorLoader } from "./editor-loader";
import { ViewLoader } from "./view-output-loader";

export const PlaygroundLoader = () => {
  return (
    <div className="size-full grid grid-cols-1 md:grid-cols-3 gap-1">
      <div className="rounded-lg col-span-1 md:col-span-2 h-full p-1 ">
        <EditorLoader />
      </div>
      <div className="rounded-lg col-span-1 md:col-span-1 h-full p-1 ">
        <ViewLoader />
      </div>
    </div>
  );
};
