import { Skeleton } from "@/components/ui/skeleton";

export const EditorLoader = () => {
  return (
    <div className="size-full flex gap-1 bg-background ring-1 ring-border rounded-lg py-2">
      <div className="size-full flex flex-col gap-2 pl-2 pr-1 basis-[3rem] border-r border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="size-full bg-muted h-6 w-full" />
        ))}
      </div>
      <div className="size-full flex flex-col gap-2 basis-[calc(100%-3rem)] pl-px pr-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="size-full bg-muted h-6 w-full" />
        ))}
      </div>
    </div>
  );
};
