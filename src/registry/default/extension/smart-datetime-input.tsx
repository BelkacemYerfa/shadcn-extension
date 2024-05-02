"use client";

import React from "react";
import { parseDate } from "chrono-node";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActiveModifiers, SelectSingleEventHandler } from "react-day-picker";
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
      new Date(datetime).getUTCHours() >= 12
        ? (new Date(datetime).getUTCHours() % 12) + 1
        : new Date(datetime).getUTCHours() + 1,
    minutes: new Date(datetime).getUTCMinutes(),
  };
};

const inputBase =
  "bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50";

// @source: https://www.perplexity.ai/search/in-javascript-how-RfI7fMtITxKr5c.V9Lv5KA#1
// use this pattern to validate the transformed date string for the natural language input
const naturalInputValidationPattern =
  "^[A-Z][a-z]{2}sd{1,2},sd{4},sd{1,2}:d{2}s[AP]M$";

const DEFAULT_SIZE = 96;

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

  const [Time, setTime] = React.useState<string>("0:00 AM");

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
            "flex gap-1 w-full p-1 items-center justify-between rounded-md border transition-all",
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
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const timestamp = 15;

  const formateSelectedTime = React.useCallback(
    (time: string, hour: number, partStamp: number) => {
      onTimeChange(time);

      const newVal = parseDateTime(value ?? new Date());

      if (!newVal) return;

      newVal.setHours(
        hour,
        partStamp === 0 ? parseInt("00") : timestamp * partStamp
      );

      // ? refactor needed check if we want to use the new date

      onValueChange(newVal);
    },
    [value]
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!document) return;

      const moveNext = () => {
        const nextIndex =
          activeIndex + 1 > DEFAULT_SIZE - 1 ? 0 : activeIndex + 1;

        const currentElm = document.getElementById(`time-${nextIndex}`);

        currentElm?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });

        setActiveIndex(nextIndex);
      };

      const movePrev = () => {
        const prevIndex =
          activeIndex - 1 < 0 ? DEFAULT_SIZE - 1 : activeIndex - 1;

        const currentElm = document.getElementById(`time-${prevIndex}`);

        currentElm?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });

        setActiveIndex(prevIndex);
      };

      const setElement = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`);

        if (!currentElm) return;

        const timeValue = currentElm.textContent ?? "";

        const timeFormat = `${timeValue.split(" ")[0].split(":")[0]}:${
          timeValue.split(" ")[0].split(":")[1]
        }`;

        onTimeChange(timeValue);

        const newVal = parseDateTime(value ?? new Date());

        if (!newVal) return;

        newVal.setHours(
          parseInt(timeFormat.split(":")[0]),
          parseInt(timeFormat.split(":")[1])
        );
        onValueChange(newVal);
      };

      switch (e.key) {
        case "ArrowUp":
          movePrev();
          break;

        case "ArrowDown":
          moveNext();
          break;

        case "Escape":
          setActiveIndex(-1);
          break;

        case "Tab":
          if (e.shiftKey) {
            movePrev();
          } else {
            moveNext();
          }
          break;

        case "Enter":
          setElement();
          break;
      }
    },
    [activeIndex, Time, value]
  );

  const currentTime = React.useMemo(() => {
    const timeVal = Time.split("")[0];
    return value
      ? getCurrentTime(value)
      : {
          hours: parseInt(timeVal.split(":")[0]),
          minutes: parseInt(timeVal.split(":")[1]),
        };
  }, [Time, value]);

  return (
    <div className="space-y-1 pr-3 py-3 relative">
      <h3 className="text-sm font-medium">Time</h3>
      <div
        tabIndex={0}
        onKeyDown={handleKeydown}
        className={cn(
          "flex items-center flex-col gap-1 h-full max-h-56 w-28 overflow-y-auto scrollbar-thin scrollbar-track-transparent transition-colors scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg px-1 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 "
        )}
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const PM_AM = i >= 12 ? "PM" : "AM";
          const formatIndex = i > 12 ? i % 12 : i === 0 || i === 12 ? 12 : i;
          return Array.from({ length: 4 }).map((_, part) => {
            const diff = Math.abs(part * timestamp - currentTime.minutes);
            const trueIndex = i * 4 + part;
            const isSelected =
              (currentTime.hours === i || currentTime.hours === formatIndex) &&
              Time.split(" ")[1] === PM_AM &&
              diff >= 0 &&
              diff < timestamp / 2;

            const currentValue = `${formatIndex}:${
              part === 0 ? "00" : timestamp * part
            } ${PM_AM}`;

            return (
              <Button
                aria-label="currentTime"
                aria-description={`button that shows current time : ${currentValue} `}
                className={cn(
                  "h-8 px-3 w-full text-sm focus-visible:outline-0 outline-0 ",
                  {
                    "ring-1 ring-ring": activeIndex === trueIndex,
                  }
                )}
                variant={isSelected ? "default" : "outline"}
                id={`time-${trueIndex}`}
                key={`time-${trueIndex}`}
                onClick={() => {
                  formateSelectedTime(
                    `${i}:${part === 0 ? "00" : timestamp * part} ${PM_AM}`,
                    i,
                    part
                  );
                  setActiveIndex(trueIndex);
                }}
              >
                {currentValue}
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

  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    setInputValue(value ? formatDateTime(value) : "");
    onTimeChange(value ? Time : "0:00 AM");
  }, [value, Time]);

  const handleParse = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // parse the date string when the input field loses focus
      const parsedDateTime = parseDateTime(e.currentTarget.value);
      if (parsedDateTime) {
        const PM_AM = parsedDateTime.getHours() >= 12 ? "PM" : "AM";
        onValueChange(parsedDateTime);
        setInputValue(formatDateTime(parsedDateTime));
        onTimeChange(
          `${parsedDateTime.getHours()}:${parsedDateTime.getMinutes()} ${PM_AM}`
        );
      }
    },
    [value]
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          const parsedDateTime = parseDateTime(e.currentTarget.value);
          if (parsedDateTime) {
            const PM_AM = parsedDateTime.getHours() >= 12 ? "PM" : "AM";
            onValueChange(parsedDateTime);
            setInputValue(formatDateTime(parsedDateTime));
            onTimeChange(
              `${parsedDateTime.getHours()}:${parsedDateTime.getMinutes()} ${PM_AM}`
            );
          }
          break;
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
      onKeyDown={handleKeydown}
      onBlur={handleParse}
      className={cn("px-2 mr-0.5 flex-1 border-none h-8 rounded", inputBase)}
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
  const { value, onValueChange, Time } = useSmartDateInput();

  const formateSelectedDate = React.useCallback(
    (
      date: Date | undefined,
      selectedDate: Date,
      m: ActiveModifiers,
      e: React.MouseEvent
    ) => {
      const parsedDateTime = parseDateTime(selectedDate);

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
            onSelect={formateSelectedDate}
            initialFocus
          />
          <TimePicker />
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateTimeLocalInput.displayName = "DateTimeLocalInput";
