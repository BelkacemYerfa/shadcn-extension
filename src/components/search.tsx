"use client";

import {
  CommandDialog,
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
import { docsConfig } from "@/config/docs-config";
import { FileIcon } from "lucide-react";

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
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setIsOpen(true)}
      >
        <span className="inline-flex truncate">Search docs</span>

        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search docs..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty className={cn("py-6 text-center text-sm")}>
            No products found.
          </CommandEmpty>
          {docsConfig.map((group) => (
            <CommandGroup
              key={group.title}
              className="capitalize"
              heading={group.title}
            >
              {group.pages.map((item) => (
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
        </CommandList>
      </CommandDialog>
    </>
  );
};
