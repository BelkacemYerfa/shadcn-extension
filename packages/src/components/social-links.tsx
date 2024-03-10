import Link from "next/link";
import { Icons } from "./icons";
import { ModeToggle } from "./toggle-theme";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export const SocialLinks = ({ className }: { className: string }) => {
  return (
    <div className={cn("items-center gap-1 xs:gap-1.5", className)}>
      <Link
        href={siteConfig.links.twitter}
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
          })
        )}
      >
        <Icons.twitter className="h-3 w-3 fill-current" />
      </Link>
      <Link
        href={siteConfig.links.github}
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
          })
        )}
      >
        <Icons.gitHub className="h-4 w-4" />
      </Link>
      <div className="hidden xs:flex">
        <ModeToggle />
      </div>
    </div>
  );
};
