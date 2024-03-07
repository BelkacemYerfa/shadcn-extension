import { Skeleton } from "../ui/skeleton";
import { EditorLoader } from "./editor-loader";
import { ViewLoader } from "./view-output-loader";

export const PlaygroundLoader = () => {
  return (
    <div className="size-full grid grid-cols-1 md:grid-cols-2 gap-1">
      <div className="basis-[60%] size-full flex flex-col gap-2">
        <EditorLoader />
      </div>
      <div className="size-full basis-[40%] flex flex-col gap-2">
        <ViewLoader />
      </div>
    </div>
  );
};
