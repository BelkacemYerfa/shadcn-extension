"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCallback, useEffect, useState } from "react";
import { cn, isMacOs } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Pages, docsConfig } from "@/config/docs-config";
import { FileIcon, Search } from "lucide-react";
import { Credenza, CredenzaContent } from "./ui/credenza";
import { ModeToggle } from "./toggle-theme";

export const SearchPopOver = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isMac = isMacOs();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  const handleSearch = (query: string) => {
    setQuery(query);
  };
  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 flex md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Search className="size-4" />
      </Button>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 justify-start w-full hidden md:flex rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setIsOpen(true)}
      >
        <span className="truncate inline-flex ">Search docs</span>

        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 flex ">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaContent className="overflow-hidden p-0">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput
              placeholder="Search docs..."
              value={query}
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty className={cn("py-6 text-center text-sm")}>
                No products found.
              </CommandEmpty>
              <CommandGroup
                className="capitalize block md:hidden"
                heading="Pages"
              >
                {Pages.map(
                  (page) =>
                    page.path && (
                      <CommandItem
                        key={page.path}
                        onSelect={() =>
                          handleSelect(() => router.push(`${page.path}`))
                        }
                        className=" text-sm rounded-lg cursor-pointer h-9 "
                      >
                        <FileIcon className="w-4 h-4" />
                        <span className="ml-2">{page.title}</span>
                      </CommandItem>
                    )
                )}
              </CommandGroup>
              {docsConfig.map((group) => (
                <CommandGroup
                  key={group.title}
                  className="capitalize"
                  heading={group.title}
                >
                  {group.pages &&
                    group.pages.map((item) => (
                      <CommandItem
                        key={item.path}
                        onSelect={() =>
                          handleSelect(() => router.push(`${item.path}`))
                        }
                        className=" text-sm rounded-lg cursor-pointer h-9 "
                      >
                        <FileIcon className="w-4 h-4" />
                        <span className="ml-2">{item.title}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
              <CommandGroup className="block md:hidden" heading="Theme">
                <CommandItem className="rounded-lg cursor-pointer h-9">
                  <ModeToggle isDesktop={false} />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CredenzaContent>
      </Credenza>
    </>
  );
};
