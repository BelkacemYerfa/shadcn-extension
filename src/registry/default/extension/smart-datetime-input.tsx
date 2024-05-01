"use client";

import React from "react";
import { parseDate } from "chrono-node";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                               Inspired By:                                 */
/*                               @steventey                                   */
/* ------------------https://dub.co/blog/smart-datetime-picker--------------- */
/* -------------------------------------------------------------------------- */

/**
 * Utility function that parses dates.
 * Parses a given date string using the `chrono-node` library.
 *
 * @param str - A string representation of a date and time.
 * @returns A `Date` object representing the parsed date and time, or `null` if the string could not be parsed.
 */
export const parseDateTime = (str: Date | string) => {
  if (str instanceof Date) return str;
  return parseDate(str);
};

/**
 * Converts a given timestamp or the current date and time to a string representation in the local time zone.
 * format: `HH:mm`, adjusted for the local time zone.
 *
 * @param timestamp {Date | string}
 * @returns A string representation of the timestamp
 */
export const getDateTimeLocal = (timestamp?: Date): string => {
  const d = timestamp ? new Date(timestamp) : new Date();
  if (d.toString() === "Invalid Date") return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split(":")
    .slice(0, 2)
    .join(":");
};

/**
 * Formats a given date and time object or string into a human-readable string representation.
 * "MMM D, YYYY h:mm A" (e.g. "Jan 1, 2023 12:00 PM").
 *
 * @param datetime - {Date | string}
 * @returns A string representation of the date and time
 */
export const formatDateTime = (datetime: Date | string) => {
  return new Date(datetime).toLocaleTimeString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const getCurrentTime = (datetime: Date | string) => {
  return {
    hours:
      new Date(datetime).getHours() >= 12
        ? (new Date(datetime).getHours() % 12) + 1
        : new Date(datetime).getHours() + 1,
    minutes: new Date(datetime).getMinutes(),
  };
};

const inputBase =
  "bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0sm:text-sm disabled:cursor-not-allowed disabled:opacity-50";

// @source: https://www.perplexity.ai/search/in-javascript-how-RfI7fMtITxKr5c.V9Lv5KA#1
// use this pattern to validate the transformed date string for the natural language input
const naturalInputValidationPattern =
  "^[A-Z][a-z]{2}sd{1,2},sd{4},sd{1,2}:d{2}s[AP]M$";

/**
 * Smart time input Docs: {@link: https://shadcn-extension.vercel.app/docs/smart-time-input}
 */

interface SmartDatetimeInputProps {
  value?: Date;
  onValueChange: (date: Date) => void;
}

interface SmartDatetimeInputContextProps extends SmartDatetimeInputProps {
  Time: string;
  onTimeChange: (time: string) => void;
}

const SmartDatetimeInputContext =
  React.createContext<SmartDatetimeInputContextProps | null>(null);

const useSmartDateInput = () => {
  const context = React.useContext(SmartDatetimeInputContext);
  if (!context) {
    throw new Error(
      "useSmartDateInput must be used within SmartDateInputProvider"
    );
  }
  return context;
};

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "ref" | "value" | "defaultValue" | "onBlur"
  > &
    SmartDatetimeInputProps
>(({ className, value, onValueChange, placeholder, disabled }, ref) => {
  // ? refactor to be only used with controlled input
  /*  const [dateTime, setDateTime] = React.useState<Date | undefined>(
    value ?? undefined
  ); */

  const [Time, setTime] = React.useState<string>("00:00");

  const onTimeChange = React.useCallback((time: string) => {
    setTime(time);
  }, []);

  return (
    <SmartDatetimeInputContext.Provider
      value={{ value, onValueChange, Time, onTimeChange }}
    >
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "flex w-full p-1 items-center justify-between rounded-md border transition-all",
            "focus-within:outline-0 focus:outline-0 focus:ring-0",
            "placeholder:text-muted-foreground focus-visible:outline-0 ",
            className
          )}
        >
          <DateTimeLocalInput />
          <NaturalLanguageInput
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
          />
        </div>
      </div>
    </SmartDatetimeInputContext.Provider>
  );
});

SmartDatetimeInput.displayName = "DatetimeInput";

const TimePicker = () => {
  const { value, onValueChange, Time, onTimeChange } = useSmartDateInput();

  const timestamp = 15;

  const currentTime = React.useMemo(() => {
    return Time
      ? {
          hours: parseInt(Time.split(":")[0]),
          minutes: parseInt(Time.split(":")[1]),
        }
      : value
      ? getCurrentTime(value)
      : {
          hours: parseInt(Time.split(":")[0]),
          minutes: parseInt(Time.split(":")[1]),
        };
  }, [value, Time]);

  const formateSelectedTime = React.useCallback(
    (time: string, hour: number, partStamp: number) => {
      onTimeChange(time);

      const newVal = parseDateTime(value ?? "");

      if (!newVal) return;

      newVal.setHours(
        hour,
        partStamp === 0 ? parseInt("00") : timestamp * partStamp
      );
      onValueChange(newVal);
    },
    [value, Time]
  );

  return (
    <div className="space-y-1 pr-3 py-3 relative">
      <h3>Time </h3>
      <div className="flex items-center flex-col gap-1 h-full max-h-56 w-28 overflow-y-auto scrollbar-thin scrollbar-track-transparent transition-colors scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg pr-1">
        {Array.from({ length: 24 }).map((_, i) => {
          const formatIndex = i > 12 ? i % 12 : i === 0 || i === 12 ? 12 : i;

          return Array.from({ length: 4 }).map((_, part) => {
            const diff = Math.abs(part * timestamp - currentTime.minutes);
            const doesMatchTime =
              i + 1 === currentTime.hours && diff >= 0 && diff < timestamp / 2;

            return (
              <Button
                className="h-8 px-3 w-full text-sm"
                variant={doesMatchTime ? "default" : "outline"}
                key={`time-${formatIndex}:${timestamp * part}`}
                onClick={() =>
                  formateSelectedTime(
                    `${i + 1} : ${part === 0 ? "00" : timestamp * part}`,
                    i === 0 ? parseInt("00") : i,
                    part
                  )
                }
              >
                {formatIndex} : {part === 0 ? "00" : timestamp * part}{" "}
                {i >= 12 ? "PM" : "AM"}
              </Button>
            );
          });
        })}
      </div>
    </div>
  );
};

const NaturalLanguageInput = React.forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    disabled?: boolean;
  }
>(({ placeholder, ...props }, ref) => {
  const { value, onValueChange, Time, onTimeChange } = useSmartDateInput();

  const _placeholder = placeholder ?? 'e.g. "tomorrow at 5pm" or "in 2 hours"';

  const [inputValue, setInputValue] = React.useState<string>(
    value ? formatDateTime(value) : ""
  );

  React.useEffect(() => {
    setInputValue(value ? formatDateTime(value) : "");
    onTimeChange(value ? Time : "00:00");
  }, [value, Time]);

  const handleParse = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // parse the date string when the input field loses focus
      const parsedDateTime = parseDateTime(e.currentTarget.value);
      if (parsedDateTime) {
        onValueChange(parsedDateTime);
        setInputValue(formatDateTime(parsedDateTime));
        onTimeChange(
          `${parsedDateTime.getHours()}:${parsedDateTime.getMinutes()}`
        );
      }
    },
    [value]
  );

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={_placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget.value)}
      onBlur={handleParse}
      className={cn("px-2 mr-1 flex-1 border-none", inputBase)}
      {...props}
    />
  );
});

NaturalLanguageInput.displayName = "NaturalLanguageInput";

type DateTimeLocalInputProps = {} & CalendarProps;

const DateTimeLocalInput = ({
  className,
  ...props
}: DateTimeLocalInputProps) => {
  const {
    value,
    onValueChange,
    Time,
    onTimeChange: setTime,
  } = useSmartDateInput();

  const formateSelectedDate = React.useCallback(
    (date: Date) => {
      const parsedDateTime = parseDateTime(date);

      if (parsedDateTime) {
        parsedDateTime.setHours(
          parseInt(Time.split(":")[0]),
          parseInt(Time.split(":")[1])
        );
        onValueChange(parsedDateTime);
      }
    },
    [value, Time]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className={cn(
            "size-9 flex items-center justify-center font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-4" />
          <span className="sr-only">calender</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <div className="flex gap-2">
          <Calendar
            {...props}
            className={cn("peer flex justify-end", inputBase, className)}
            mode="single"
            selected={value}
            onSelect={formateSelectedDate as SelectSingleEventHandler}
            initialFocus
          />
          <TimePicker />
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateTimeLocalInput.displayName = "DateTimeLocalInput";
