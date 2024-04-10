"use client";
import React from "react";
import { DateType, useTimescape } from "timescape/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// @source: https://github.com/dan-lee/timescape?tab=readme-ov-file

const timePickerInputBase =
  "p-1 inline tabular-nums h-fit border-none outline-none select-none content-box caret-transparent rounded-sm min-w-8 text-center focus:bg-foreground/20 focus-visible:ring-0 focus-visible:outline-none";
const timePickerSeparatorBase = "text-xs text-gray-400";

type ConfigDates = "days" | "months" | "years";
type ConfigTime = "hours" | "minutes" | "seconds" | "am/pm";

type DateTimeArray<T extends ConfigDates | ConfigTime> = T[];
type DateTimeConfigDefaults = [
  DateTimeArray<ConfigDates>,
  DateTimeArray<ConfigTime>
];

const DEFAULTS = [
  ["months", "days", "years"],
  ["hours", "minutes", "seconds", "am/pm"],
] as DateTimeConfigDefaults;

const DatetimeInputs = ({
  date,
  inputs,
  className,
  onChange,
}: {
  inputs: DateTimeConfigDefaults;
  className?: string;
  date?: Date;
  onChange?: (date: Date) => void;
}) => {
  const { getRootProps, getInputProps } = useTimescape({
    date,
    onChangeDate: (nextDate) => {
      if (onChange && nextDate) onChange(nextDate);
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
      {!!inputs?.length
        ? inputs.map((group, i) => (
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
              {inputs && inputs.length > 1 && !i && (
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

export const DatetimePicker = (props: {
  config?: DateTimeConfigDefaults;
  className?: string;
}) => {
  const [datetime, setDatetime] = React.useState<Date | undefined>();
  const _config = props.config ?? DEFAULTS;
  return (
    <DatetimeInputs
      inputs={_config}
      className={props.className}
      date={datetime}
      onChange={setDatetime}
    />
  );
};
