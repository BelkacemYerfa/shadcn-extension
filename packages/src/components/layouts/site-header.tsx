import Link from "next/link";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Balancer } from "react-wrap-balancer";
import { ModeToggle } from "../toggle-theme";
import { siteConfig } from "@/config/siteconfig";

export const SiteHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2  max-w-screen-2xl border-b border-border/40 ">
      <nav className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-5 w-5 fill-current" />
            <Balancer as={"span"} className="hidden font-bold sm:inline-block">
              {siteConfig.name}
            </Balancer>
          </div>
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 hidden md:inline-block"
          >
            Docs
          </Link>
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 hidden md:inline-block "
          >
            Components
          </Link>
        </div>
        <div className="flex items-center gap-2">
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
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};
