import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site-config";

export const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-[#9800ff] via-[#f62929] to-[#ffa908] z-20 text-accent-background py-1 md:py-2 text-center text-sm text-white">
      🥳 <span>New docs for {siteConfig.name} are live.</span>
      <Link
        href="/docs"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({
            variant: "link",
          }),
          "px-1 text-sm py-0 h-fit text-white"
        )}
      >
        Check them out
      </Link>
    </div>
  );
};
