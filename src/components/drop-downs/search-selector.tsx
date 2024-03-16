"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ThemeComboboxProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  noneResult?: string;
  createQuery: (params: Record<string, string | number | null>) => string;
} & ({ comp: true; theme?: undefined } | { comp?: undefined; theme: true });

export const PlaygroundSearchSelector = ({
  value,
  onValueChange,
  options,
  placeholder = "Select ...",
  noneResult = "Doesn't exist.",
  createQuery,
  comp,
}: ThemeComboboxProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-vs_code-foreground dark:bg-vs_code"
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command className="bg-vs_code-foreground dark:bg-vs_code">
          <CommandInput placeholder={placeholder} className="h-9 " />
          <CommandEmpty>{noneResult}</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value}
                onSelect={() => {
                  onValueChange(opt.value);
                  router.push(
                    `?${createQuery({
                      [comp ? "comp" : "theme"]: opt.value,
                    })}`
                  );
                  setOpen(false);
                }}
              >
                {opt.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === opt.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
