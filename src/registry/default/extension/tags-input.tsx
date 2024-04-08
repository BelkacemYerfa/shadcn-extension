"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X as RemoveIcon } from "lucide-react";
import React, { forwardRef, useCallback, useState } from "react";

interface TagsInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
}

interface TagsInputContextProps {
  value: string[];
  onValueChange: (value: any) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TagInputContext = React.createContext<TagsInputContextProps | null>(null);

// TODO : add the on paste support function
// TODO : expose primitive functions for tag controlling

export const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(
  (
    { children, value, onValueChange, placeholder, className, dir, ...props },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const [inputValue, setInputValue] = useState("");

    const onValueChangeHandler = React.useCallback(
      (val: string) => {
        if (value.includes(val)) {
          onValueChange(value.filter((item) => item !== val));
        } else {
          onValueChange([...value, val]);
        }
      },
      [value]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const moveNext = () => {
          const nextIndex =
            activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1;
          setActiveIndex(nextIndex);
        };

        const movePrev = () => {
          const prevIndex =
            activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1;
          setActiveIndex(prevIndex);
        };

        const moveCurrent = () => {
          const newIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;
          setActiveIndex(newIndex);
        };

        switch (e.key) {
          case "ArrowLeft":
            if (dir === "rtl") {
              moveNext();
            } else {
              movePrev();
            }
            break;
          case "ArrowRight":
            if (dir === "rtl") {
              movePrev();
            } else {
              moveNext();
            }
            break;

          case "Backspace":
            if (value.length - 1 > 0 && inputValue.length === 0) {
              if (activeIndex !== -1 && activeIndex < value.length) {
                onValueChangeHandler(value[activeIndex]);
                moveCurrent();
              } else {
                onValueChangeHandler(value[value.length - 1]);
              }
            } else if (value.length - 1 === 0) {
              onValueChangeHandler(value[value.length - 1]);
              moveNext();
            }
            break;

          case "Delete":
            if (value.length - 1 > 0 && inputValue.length === 0) {
              if (activeIndex !== -1 && activeIndex < value.length) {
                onValueChangeHandler(value[activeIndex]);
                moveCurrent();
              } else {
                onValueChangeHandler(value[value.length - 1]);
              }
            } else if (value.length - 1 === 0) {
              console.log(value.length);
              onValueChangeHandler(value[value.length - 1]);
              moveNext();
            }
            break;

          case "Escape":
            setActiveIndex(-1);
            break;

          case "Enter":
            if (e.currentTarget.value.trim() !== "") {
              onValueChangeHandler(e.currentTarget.value);
              setInputValue("");
            }
            break;
        }
      },
      [activeIndex, value, inputValue]
    );

    const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <TagInputContext.Provider
        value={{
          value,
          onValueChange,
          inputValue,
          setInputValue,
          activeIndex,
          setActiveIndex,
        }}
      >
        <div
          {...props}
          ref={ref}
          className={cn(
            "flex flex-wrap gap-1 p-1 border border-muted rounded-lg bg-background",
            className
          )}
        >
          {value.map((item, index) => (
            <Badge
              key={item}
              className={cn(
                "px-1 rounded-xl flex items-center gap-1",
                activeIndex === index && "ring-2 ring-muted-foreground "
              )}
              variant={"secondary"}
            >
              <span className="text-xs">{item}</span>
              <button
                aria-label={`Remove ${item} option`}
                aria-roledescription="button to remove option"
                type="button"
                onMouseDown={mousePreventDefault}
                onClick={() => onValueChangeHandler(item)}
              >
                <span className="sr-only">Remove {item} option</span>
                <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
              </button>
            </Badge>
          ))}
          <Input
            onKeyDown={handleKeyDown}
            aria-label="input tag"
            value={inputValue}
            onChange={
              activeIndex === -1
                ? (e) => setInputValue(e.currentTarget.value)
                : undefined
            }
            placeholder={placeholder}
            className={cn(
              "outline-0 border-none w-fit focus-visible:outline-0 focus-visible:border-0 placeholder:text-muted-foreground ",
              activeIndex !== -1 && "caret-transparent"
            )}
          />
        </div>
      </TagInputContext.Provider>
    );
  }
);

TagsInput.displayName = "TagsInput";
