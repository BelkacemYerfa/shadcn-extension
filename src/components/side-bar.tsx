"use client";

import { docsConfig } from "@/config/docs-config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

export const SideBar = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col px-3 py-2 gap-5">
      {docsConfig.map((section, _) => (
        <div key={section.title} className="flex items-start flex-col gap-1 ">
          <h2 className="text-base">{section.title}</h2>
          <div className="flex flex-col items-start w-fit">
            {section.pages.map((page, _) => (
              <Link
                href={page.path}
                key={page.title}
                className={cn(
                  buttonVariants({
                    variant: "link",
                  }),
                  "p-0 ",
                  {
                    "text-foreground": pathname === page.path,
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
