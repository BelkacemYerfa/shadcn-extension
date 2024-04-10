"use client";
import React, { useCallback, useState } from "react";
import { useTimescape, type Options } from "timescape/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// @source: https://github.com/dan-lee/timescape?tab=readme-ov-file

const timePickerInputBase =
  "p-1 inline tabular-nums h-fit border-none outline-none select-none content-box caret-transparent rounded-sm min-w-8 text-center focus:bg-foreground/20 focus-visible:ring-0 focus-visible:outline-none";
const timePickerSeparatorBase = "text-xs text-gray-400";

type DateFormat = "days" | "months" | "years";
type TimeFormat = "hours" | "minutes" | "seconds" | "am/pm";

type DateTimeArray<T extends DateFormat | TimeFormat> = T[];
type DateTimeFormatDefaults = [
  DateTimeArray<DateFormat>,
  DateTimeArray<TimeFormat>
];

const DEFAULTS = [
  ["months", "days", "years"],
  ["hours", "minutes", "seconds", "am/pm"],
] as DateTimeFormatDefaults;

type TimescapeReturn = ReturnType<typeof useTimescape>;

const DatetimeGrid = ({
  date,
  format,
  className,
  timescape,
}: {
  format: DateTimeFormatDefaults;
  className?: string;
  date?: Date;
  timescape: Pick<TimescapeReturn, "getRootProps" | "getInputProps">;
}) => {
  return (
    <div
      className={cn(
        "flex items-center w-fit p-1 border-2",
        className,
        "border-input rounded-md gap-1 selection:bg-transparent selection:text-foreground"
      )}
      {...timescape.getRootProps()}
    >
      {!!format?.length
        ? format.map((group, i) => (
            <React.Fragment key={i === 0 ? "dates" : "times"}>
              {!!group?.length
                ? group.map((unit, j) => (
                    <React.Fragment key={unit}>
                      <Input
                        className={cn(timePickerInputBase, "min-w-8", {
                          "min-w-12": unit === "years",
                          "bg-foreground/15": unit === "am/pm",
                        })}
                        {...timescape.getInputProps(unit)}
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
              {format?.length > 1 && !i && (
                // date-time separator - only if both date and time are present
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

interface DateTimeInput {
  initialDate: Date;
  format: DateTimeFormatDefaults;
  className?: string;
  onChange?: (date: Date | undefined) => void;
  dtOptions?: Options;
}

const DEFAULT_TS_OPTIONS = {
  date: new Date(),
  hour12: true,
};
export const DatetimePicker = ({
  initialDate = new Date(),
  onChange,
  format = DEFAULTS,
  dtOptions = DEFAULT_TS_OPTIONS,
  className,
}: DateTimeInput & { className?: string }) => {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const handleDateChange = useCallback(
    (nextDate: Date | undefined) => {
      setDate(nextDate);
      onChange ? onChange(nextDate) : console.log(nextDate);
    },
    [onChange]
  );
  const timescape = useTimescape({
    onChangeDate: handleDateChange,
    ...dtOptions,
  });
  return (
    <DatetimeGrid
      format={format}
      className={className}
      date={date}
      timescape={timescape}
    />
  );
};
