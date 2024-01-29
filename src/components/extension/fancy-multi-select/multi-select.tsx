"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { X as RemoveIcon } from "lucide-react";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";

interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  options: string[];
}

export const MultiSelect = ({ options }: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const selectOption = useCallback((value: string) => {
    setSelected((prev) => [...prev, value]);
  }, []);

  const removeOption = useCallback((value: string) => {
    setSelected((prev) => prev.filter((item) => item !== value));
  }, []);

  const removeOptionWithBackspace = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selected.length > 0
      ) {
        if (inputValue.length === 0) {
          setSelected((prev) => prev.slice(0, prev.length - 1));
        }
      }
    },
    [selected, inputValue]
  );

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const notSelected = options.filter((item) => !selected.includes(item));

  return (
    <Command
      onKeyDown={removeOptionWithBackspace}
      className="flex flex-col gap-2 max-w-md w-full rounded-md p-1.5 max-h-96 h-full"
    >
      <div className="flex flex-wrap gap-1 p-1 py-2 border border-muted rounded-lg">
        {selected.map((item) => (
          <Badge key={item} className="px-1 rounded-xl" variant={"secondary"}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{item}</span>
              <button
                aria-label={`Remove ${item} option`}
                aria-roledescription="button to remove option"
                type="button"
                onMouseDown={mousePreventDefault}
                onClick={() => removeOption(item)}
              >
                {" "}
                <RemoveIcon className="h-4 w-4 hover:stroke-red-600" />
              </button>
            </div>
          </Badge>
        ))}
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder="Select frameworks..."
          className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
        />
      </div>
      <div className=" ">
        {open && notSelected.length > 0 && (
          <CommandList className="p-2 flex flex-col gap-2 border-muted border rounded-lg">
            {notSelected.map((option) => (
              <CommandItem
                key={option}
                onMouseDown={mousePreventDefault}
                onSelect={() => {
                  selectOption(option);
                  setInputValue("");
                }}
              >
                {option}
              </CommandItem>
            ))}
            <CommandEmpty>
              <span className="text-muted-foreground">No results found</span>
            </CommandEmpty>
          </CommandList>
        )}
      </div>
    </Command>
  );
};
