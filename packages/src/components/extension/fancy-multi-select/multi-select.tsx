"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon } from "lucide-react";
import {
  KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: string[];
}

export const MultiSelect = ({
  options,
  onValueChange,
  value,
  ...props
}: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  const selectOption = useCallback(
    (e: any) => {
      onValueChange([...value, e]);
    },
    [value]
  );

  const removeOption = useCallback(
    (e: any) => {
      onValueChange(value.filter((item) => item !== e));
    },
    [value]
  );

  const removeOptionWithBackspace = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Backspace" || e.key === "Delete") && value.length > 0) {
        if (inputValue.length === 0) {
          onValueChange(
            value.filter((item) => item !== value[value.length - 1])
          );
        }
      }
    },
    [value, inputValue]
  );

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const height = useMemo(() => {
    const container = containerRef.current;
    if (!container) return 0;

    const containerHeight = container.getBoundingClientRect().height;
    const containerOffsetTop = container.offsetTop;

    return containerHeight + containerOffsetTop + 8;
  }, [containerRef.current, value]);

  useEffect(() => {
    setOpen(false);
    console.log(open);
    setOpen(true);
    console.log(open);
  }, [height]);

  const notSelected = options.filter((item) => !value.includes(item));
  return (
    <Command
      onKeyDown={removeOptionWithBackspace}
      className="overflow-visible flex flex-col gap-2"
    >
      <div
        ref={containerRef}
        className="flex flex-wrap gap-1 p-1 py-2 border border-muted rounded-lg"
      >
        {value.map((item) => (
          <Badge
            key={item}
            className="px-1 rounded-xl flex items-center gap-1"
            variant={"secondary"}
          >
            <span className="text-xs">{item}</span>
            <button
              aria-label={`Remove ${item} option`}
              aria-roledescription="button to remove option"
              type="button"
              onMouseDown={mousePreventDefault}
              onClick={() => {
                removeOption(item);
                setOpen(true);
              }}
            >
              {" "}
              <RemoveIcon className="h-4 w-4 hover:stroke-red-600" />
            </button>
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
      <div className="relative ">
        {open && notSelected.length > 0 && (
          <CommandList
            className={`p-2 flex flex-col gap-2 rounded-md scrollbar-thin scrollbar-track-transparent  transition-colors scrollbar-thumb-muted scrollbar-thumb-rounded-lg w-full absolute bg-background shadow-md z-10 border border-muted max-w-sm top-0`}
          >
            {notSelected.map((option) => (
              <CommandItem
                key={option}
                onMouseDown={mousePreventDefault}
                onSelect={() => {
                  selectOption(option);
                  setInputValue("");
                }}
                className="rounded-md cursor-pointer px-2 py-1 transition-colors"
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
