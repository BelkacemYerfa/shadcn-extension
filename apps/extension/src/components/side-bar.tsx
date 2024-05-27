"use client";

import { docsConfig } from "@/config/docs-config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

interface SideBarProps {
  setOpen?: (open: boolean) => void;
}

export const SideBar = ({ setOpen }: SideBarProps) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col py-2 gap-5 ">
      {docsConfig.map((section, _) => (
        <div key={section.title} className="flex items-start flex-col gap-1  ">
          <h2 className="text-base px-2">{section.title}</h2>
          <div className="flex flex-col items-start w-full">
            {section.pages &&
              section.pages.map((page, _) => (
                <Link
                  href={page?.path || "/"}
                  key={page.title}
                  onClick={() => setOpen?.(false)}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "w-full justify-start px-2 h-8 transition-all",
                    {
                      "text-accent-foreground bg-accent":
                        pathname === page.path,
                      "text-muted-foreground": pathname !== page.path,
                    }
                  )}
                >
                  {page.title}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
