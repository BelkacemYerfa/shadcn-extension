"use client";

import React from "react";
import { parseDate } from "chrono-node";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActiveModifiers } from "react-day-picker";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, LucideTextCursorInput } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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
 * Returns the earliest date (starting with today) that is not disabled by the matcher.
 * If no dates are `disabled`, we default to new Date().
 * 
 * @param disabled - A boolean disabling the entire input, or a matcher function for valid dates.
 * @returns A `Date` object representing the earliest valid date.
 */
const getValidBaseDate = (
  disabled?: boolean | ((date: Date) => boolean)
): Date => {
  if (typeof disabled !== "function") return new Date();
  let potential = new Date();
  const MAX_DAYS = 365;
  for (let i = 0; i < MAX_DAYS; i++) {
    if (!disabled(potential)) {
      return potential;
    }
    potential = new Date(potential.getTime());
    potential.setDate(potential.getDate() + 1);
  }
  return new Date();
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
  disabled?: boolean | ((date: Date) => boolean);
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
      "useSmartDateInput must be used within SmartDateInputProvider",
    );
  }
  return context;
};

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "disabled" | "type" | "ref" | "value" | "defaultValue" | "onBlur"
  > &
  SmartDatetimeInputProps
>(({ className, value, onValueChange, placeholder, disabled }, ref) => {
  // ? refactor to be only used with controlled input
  /*  const [dateTime, setDateTime] = React.useState<Date | undefined>(
    value ?? undefined
  ); */

  const [Time, setTime] = React.useState<string>("");

  const onTimeChange = React.useCallback((time: string) => {
    setTime(time);
  }, []);

  return (
    <SmartDatetimeInputContext.Provider
      value={{ value, onValueChange, Time, onTimeChange, disabled }}
    >
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "flex gap-1 w-full p-1 items-center justify-between rounded-md border transition-all",
            "focus-within:outline-0 focus:outline-0 focus:ring-0",
            "placeholder:text-muted-foreground focus-visible:outline-0 ",
            className,
          )}
        >
          <DateTimeLocalInput disabled={disabled} />
          <NaturalLanguageInput
            placeholder={placeholder}
            disabled={typeof disabled === "boolean" ? disabled : false}
            ref={ref}
          />
        </div>
      </div>
    </SmartDatetimeInputContext.Provider>
  );
});

SmartDatetimeInput.displayName = "DatetimeInput";

// Make it a standalone component

const TimePicker = () => {
  const { value, onValueChange, Time, onTimeChange, disabled } = useSmartDateInput();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const timestamp = 15;

  const formateSelectedTime = React.useCallback(
    (time: string, hour: number, partStamp: number) => {
      onTimeChange(time);

      const base = value ? new Date(value) : getValidBaseDate(disabled);
      const newVal = parseDateTime(base);

      if (!newVal) return;

      newVal.setHours(
        hour,
        partStamp === 0 ? parseInt("00") : timestamp * partStamp,
      );

      // ? refactor needed check if we want to use the new date

      onValueChange(newVal);
    },
    [value],
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!document) return;

      const moveNext = () => {
        const nextIndex =
          activeIndex + 1 > DEFAULT_SIZE - 1 ? 0 : activeIndex + 1;

        const currentElm = document.getElementById(`time-${nextIndex}`);

        currentElm?.focus();

        setActiveIndex(nextIndex);
      };

      const movePrev = () => {
        const prevIndex =
          activeIndex - 1 < 0 ? DEFAULT_SIZE - 1 : activeIndex - 1;

        const currentElm = document.getElementById(`time-${prevIndex}`);

        currentElm?.focus();

        setActiveIndex(prevIndex);
      };

      const setElement = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`);

        if (!currentElm) return;

        currentElm.focus();

        const timeValue = currentElm.textContent ?? "";

        // this should work now haha that hour is what does the trick

        const PM_AM = timeValue.split(" ")[1];
        const PM_AM_hour = parseInt(timeValue.split(" ")[0].split(":")[0]);
        const hour =
          PM_AM === "AM"
            ? PM_AM_hour === 12
              ? 0
              : PM_AM_hour
            : PM_AM_hour === 12
              ? 12
              : PM_AM_hour + 12;

        const part = Math.floor(
          parseInt(timeValue.split(" ")[0].split(":")[1]) / 15,
        );

        formateSelectedTime(timeValue, hour, part);
      };

      const reset = () => {
        const currentElm = document.getElementById(`time-${activeIndex}`);
        currentElm?.blur();
        setActiveIndex(-1);
      };

      switch (e.key) {
        case "ArrowUp":
          movePrev();
          break;

        case "ArrowDown":
          moveNext();
          break;

        case "Escape":
          reset();
          break;

        case "Enter":
          setElement();
          break;
      }
    },
    [activeIndex, formateSelectedTime],
  );

  const handleClick = React.useCallback(
    (hour: number, part: number, PM_AM: string, currentIndex: number) => {
      formateSelectedTime(
        `${hour}:${part === 0 ? "00" : timestamp * part} ${PM_AM}`,
        hour,
        part,
      );
      setActiveIndex(currentIndex);
    },
    [formateSelectedTime],
  );

  const currentTime = React.useMemo(() => {
    const timeVal = Time.split(" ")[0];
    return {
      hours: parseInt(timeVal.split(":")[0]),
      minutes: parseInt(timeVal.split(":")[1]),
    };
  }, [Time]);

  React.useEffect(() => {
    const getCurrentElementTime = () => {
      const timeVal = Time.split(" ")[0];
      const hours = parseInt(timeVal.split(":")[0]);
      const minutes = parseInt(timeVal.split(":")[1]);
      const PM_AM = Time.split(" ")[1];

      const formatIndex =
        PM_AM === "AM" ? hours : hours === 12 ? hours : hours + 12;
      const formattedHours = formatIndex;

      console.log(formatIndex);

      for (let j = 0; j <= 3; j++) {
        const diff = Math.abs(j * timestamp - minutes);
        const selected =
          PM_AM === (formattedHours >= 12 ? "PM" : "AM") &&
          (minutes <= 53 ? diff < Math.ceil(timestamp / 2) : diff < timestamp);

        if (selected) {
          const trueIndex =
            activeIndex === -1 ? formattedHours * 4 + j : activeIndex;

          setActiveIndex(trueIndex);

          const currentElm = document.getElementById(`time-${trueIndex}`);
          currentElm?.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }
      }
    };

    getCurrentElementTime();
  }, [Time, activeIndex]);

  const height = React.useMemo(() => {
    if (!document) return;
    const calendarElm = document.getElementById("calendar");
    if (!calendarElm) return;
    return calendarElm.style.height;
  }, []);

  return (
    <div className="space-y-2 pr-3 py-3 relative ">
      <h3 className="text-sm font-medium ">Time</h3>
      <ScrollArea
        onKeyDown={handleKeydown}
        className="h-[90%] w-full focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 py-0.5"
        style={{
          height,
        }}
      >
        <ul
          className={cn(
            "flex items-center flex-col gap-1 h-full max-h-56 w-28 px-1 py-0.5",
          )}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const PM_AM = i >= 12 ? "PM" : "AM";
            const formatIndex = i > 12 ? i % 12 : i === 0 || i === 12 ? 12 : i;
            return Array.from({ length: 4 }).map((_, part) => {
              // Create a candidate date using the current value's date if available or today's date.
              const baseDate = value && !disabled ? new Date(value) : getValidBaseDate(disabled);
              const candidateDate = new Date(
                baseDate.getFullYear(),
                baseDate.getMonth(),
                baseDate.getDate(),
                i,
                part === 0 ? 0 : timestamp * part,
                0,
                0,
              );
              // Use the matcher if provided to decide if this candidate should be disabled.
              let candidateDisabled = typeof disabled === "function" ? disabled(candidateDate) : false;

              // Additional check: if the candidate is for today and its time is past, disable it.
              const now = new Date();
              if (
                !candidateDisabled &&
                candidateDate.getFullYear() === now.getFullYear() &&
                candidateDate.getMonth() === now.getMonth() &&
                candidateDate.getDate() === now.getDate() &&
                candidateDate < now
              ) {
                candidateDisabled = true;
              }

              if (candidateDisabled) return null;

              const diff = Math.abs(part * timestamp - currentTime.minutes);

              const trueIndex = i * 4 + part;

              // ? refactor : add the select of the default time on the current device (H:MM)
              const isSelected =
                (currentTime.hours === i ||
                  currentTime.hours === formatIndex) &&
                Time.split(" ")[1] === PM_AM &&
                (currentTime.minutes <= 53
                  ? diff < Math.ceil(timestamp / 2)
                  : diff < timestamp);

              const isSuggested = !value && isSelected;

              const currentValue = `${formatIndex}:${
                part === 0 ? "00" : timestamp * part
              } ${PM_AM}`;

              return (
                <li
                  tabIndex={isSelected ? 0 : -1}
                  id={`time-${trueIndex}`}
                  key={`time-${trueIndex}`}
                  aria-label="currentTime"
                  className={cn(
                    buttonVariants({
                      variant: isSuggested
                        ? "secondary"
                        : isSelected
                          ? "default"
                          : "outline",
                    }),
                    "h-8 px-3 w-full text-sm focus-visible:outline-0 outline-0 focus-visible:border-0 cursor-default ring-0",
                  )}
                  onClick={() => handleClick(i, part, PM_AM, trueIndex)}
                  onFocus={() => isSuggested && setActiveIndex(trueIndex)}
                >
                  {currentValue}
                </li>
              );
            });
          })}
        </ul>
      </ScrollArea>
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
  const { value, onValueChange, Time, onTimeChange, disabled } = useSmartDateInput();

  const _placeholder = placeholder ?? 'e.g. "tomorrow at 5pm" or "in 2 hours"';

  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    const hour = new Date().getHours();
    const timeVal = `${
      hour >= 12 ? hour % 12 : hour
    }:${new Date().getMinutes()} ${hour >= 12 ? "PM" : "AM"}`;
    setInputValue(value ? formatDateTime(value) : "");
    onTimeChange(value ? Time : timeVal);
  }, [value, Time]);

  const handleParse = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // parse the date string when the input field loses focus
      const parsedDateTime = parseDateTime(e.currentTarget.value);
      if (parsedDateTime) {
        // If a matcher function was passed, prevent selecting a disabled (past) date
        if (disabled && typeof disabled != "boolean" && disabled(parsedDateTime)) {
          // Invalid input--time already passed
          return;
        }
        const PM_AM = parsedDateTime.getHours() >= 12 ? "PM" : "AM";
        //fix the time format for this value

        const PM_AM_hour = parsedDateTime.getHours();

        const hour =
          PM_AM_hour > 12
            ? PM_AM_hour % 12
            : PM_AM_hour === 0 || PM_AM_hour === 12
              ? 12
              : PM_AM_hour;

        onValueChange(parsedDateTime);
        setInputValue(formatDateTime(parsedDateTime));
        onTimeChange(`${hour}:${parsedDateTime.getMinutes()} ${PM_AM}`);
      }
    },
    [value],
  );

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          const parsedDateTime = parseDateTime(e.currentTarget.value);
          if (parsedDateTime) {
            if (disabled && typeof disabled != "boolean" && disabled(parsedDateTime)) {
              return;
            }
            const PM_AM = parsedDateTime.getHours() >= 12 ? "PM" : "AM";
            //fix the time format for this value

            const PM_AM_hour = parsedDateTime.getHours();

            const hour =
              PM_AM_hour > 12
                ? PM_AM_hour % 12
                : PM_AM_hour === 0 || PM_AM_hour === 12
                  ? 12
                  : PM_AM_hour;

            onValueChange(parsedDateTime);
            setInputValue(formatDateTime(parsedDateTime));
            onTimeChange(`${hour}:${parsedDateTime.getMinutes()} ${PM_AM}`);
          }
          break;
      }
    },
    [value],
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

type DateTimeLocalInputProps = { disabled?: boolean | ((date: Date) => boolean) } & CalendarProps;

const DateTimeLocalInput = ({
  className,
  disabled,
  ...props
}: DateTimeLocalInputProps) => {
  const { value, onValueChange, Time } = useSmartDateInput();

  const formateSelectedDate = React.useCallback(
    (
      date: Date | undefined,
      selectedDate: Date,
      m: ActiveModifiers,
      e: React.MouseEvent,
    ) => {
      // if fully disabled, do nothing
      if (typeof disabled === "boolean" && disabled) return;
      // if disabled is a matcher function and selected date should be disabled, do nothing
      if (typeof disabled === "function" && disabled(selectedDate)) return;

      const parsedDateTime = parseDateTime(selectedDate);

      if (parsedDateTime) {
        parsedDateTime.setHours(
          parseInt(Time.split(":")[0]),
          parseInt(Time.split(":")[1]),
        );
        onValueChange(parsedDateTime);
      }
    },
    [value, Time],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={typeof disabled === "boolean" ? disabled : false}
          variant={"outline"}
          size={"icon"}
          className={cn(
            "size-9 flex items-center justify-center font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4" />
          <span className="sr-only">calender</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <div className="flex gap-1">
          <Calendar
            disabled={disabled}
            {...props}
            id={"calendar"}
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
