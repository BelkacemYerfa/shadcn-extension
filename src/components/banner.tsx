import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-[#9800ff] via-[#f62929] to-[#ffa908] z-20 text-accent-background py-2 text-center ">
      🥳 <span>New docs for shadcn extesnion are live.</span>
      <Link
        href="/docs"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({
            variant: "link",
          }),
          "px-1 text-base"
        )}
      >
        Check them out
      </Link>
    </div>
  );
};
