"use client";
import React from "react";
import { useTimescape } from "timescape/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// @source: https://github.com/dan-lee/timescape?tab=readme-ov-file

type ConfigDates = "days" | "months" | "years";
type ConfigTime = "hours" | "minutes" | "seconds" | "am/pm";

type DateTimeArray<T extends ConfigDates | ConfigTime> = T[];
type DateTimeConfigDefaults = [
  DateTimeArray<ConfigDates>,
  DateTimeArray<ConfigTime>
];

const DEFAULTS = [
  ["days", "months", "years"],
  ["hours", "minutes", "seconds", "am/pm"],
] as DateTimeConfigDefaults;

interface DateTimePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  className?: string;
  config?: DateTimeConfigDefaults;
}

const timePickerInputBase =
  "p-1 inline tabular-nums h-fit border-none outline-none select-none content-box caret-transparent rounded-sm min-w-8 text-center focus:bg-foreground/20 focus-visible:ring-0 focus-visible:outline-none";
const timePickerSeparatorBase = "text-xs text-gray-400";
export const DateTimePicker = ({
  className,
  date,
  onChange,
  config = DEFAULTS,
}: DateTimePickerProps) => {
  const { getRootProps, getInputProps, options, update } = useTimescape({
    date: date ?? new Date(),
    onChangeDate: (nextDate) => {
      nextDate && onChange(nextDate);
    },
    hour12: true,
  });
  return (
    <div
      className={cn(
        "flex items-center w-fit p-1 border-2",
        className,
        "border-input rounded-md gap-1 selection:bg-transparent selection:text-foreground"
      )}
      {...getRootProps()}
    >
      {!!config.length
        ? config.map((group, i) => (
            <React.Fragment key={i === 0 ? "dates" : "times"}>
              {!!group?.length
                ? group.map((unit, j) => (
                    <React.Fragment key={unit}>
                      <Input
                        className={cn(timePickerInputBase, "min-w-8", {
                          "min-w-12": unit === "years",
                          "bg-foreground/15": unit === "am/pm",
                        })}
                        {...getInputProps(unit)}
                      />
                      {i === 0 && j < group.length - 1 ? (
                        // date separator
                        <span className={timePickerSeparatorBase}>/</span>
                      ) : (
                        j < group.length - 2 && (
                          // time separator
                          <span className={timePickerSeparatorBase}>:</span>
                        )
                      )}
                    </React.Fragment>
                  ))
                : null}
              {config.length > 1 && !i && (
                // date-time separator
                <span
                  className={cn(timePickerSeparatorBase, "opacity-30 text-xl")}
                >
                  |
                </span>
              )}
            </React.Fragment>
          ))
        : null}
    </div>
  );
};
