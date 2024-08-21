import { Skeleton } from "../ui/skeleton";

export const ViewLoader = () => {
  return (
    <div className="rounded-lg ring-1 ring-border overflow-hidden bg-background relative size-full">
      <div className="flex items-center justify-start gap-2 p-2 h-10 border-b border-border ">
        <Skeleton className="w-16 h-7" />
        <Skeleton className="w-16 h-7" />
      </div>
      <div className="p-3 flex items-center justify-center size-full">
        <Skeleton className="bg-muted h-72 w-72" />
      </div>
    </div>
  );
};
