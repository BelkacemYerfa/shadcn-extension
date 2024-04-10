"use client";

import React from "react";
import { parseDate } from "chrono-node";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

const inputBase =
  "bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0sm:text-sm disabled:cursor-not-allowed disabled:opacity-50";

// @source: https://www.perplexity.ai/search/in-javascript-how-RfI7fMtITxKr5c.V9Lv5KA#1
// use this pattern to validate the transformed date string for the natural language input
const naturalInputValidationPattern =
  "^[A-Z][a-z]{2}sd{1,2},sd{4},sd{1,2}:d{2}s[AP]M$";

const NaturalLanguageInput = React.forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    value?: Date;
    onChange: (date: Date) => void;
    disabled?: boolean;
  }
>(({ placeholder, value, onChange }, ref) => {
  const _placeholder = placeholder ?? 'e.g. "tomorrow at 5pm" or "in 2 hours"';

  const handleParse = (e: React.ChangeEvent<HTMLInputElement>) => {
    // parse the date string when the input field loses focus
    const parsedDateTime = parseDateTime(e.target.value);
    if (parsedDateTime) {
      onChange(parsedDateTime);
      e.target.value = formatDateTime(parsedDateTime);
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={_placeholder}
      defaultValue={value ? formatDateTime(value) : ""}
      onBlur={handleParse}
      className={cn("px-2 mr-1 flex-1 border-none", inputBase)}
    />
  );
});
NaturalLanguageInput.displayName = "NaturalLanguageInput";

const DateTimeLocalInput = React.forwardRef<
  HTMLInputElement,
  {
    value?: Date;
    onChange: (date: Date) => void;
    name?: string;
    disabled?: boolean;
  }
>(({ name, value, onChange }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    // ref is either a function or a ref object
    if (ref) {
      if (typeof ref === "function") {
        // function-ref pattern to set the ref
        ref(inputRef.current);
      } else {
        // ref object pattern to set the ref
        ref.current = inputRef.current;
      }
    }

    return () => {
      // cleanup
      if (ref) {
        if (typeof ref === "function") {
          ref(null);
        } else {
          ref.current = null;
        }
      }
    };
  }, [ref]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const expiryDate = new Date(e.target.value);
    onChange(expiryDate);
    // set the formatted date string in the text input field to keep them in sync
    if (inputRef.current) {
      inputRef.current.value = formatDateTime(expiryDate);
    }
  };

  const _name = name ?? "expiresAt";
  return (
    <div className="group">
      <Input
        tabIndex={-1} // remove from tab order
        ref={ref}
        type="datetime-local"
        id={_name}
        name={_name}
        value={value ? getDateTimeLocal(value) : ""}
        onChange={handleChange}
        className={cn(
          "peer flex justify-end w-[44px] text-gray-500 z-[-1]",
          inputBase
        )}
      />
    </div>
  );
});
DateTimeLocalInput.displayName = "DateTimeLocalInput";

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  {
    name?: string;
    placeholder?: string;
    defaultValue?: Date;
    value?: Date;
    onChange: (date: Date) => void;
    className?: string;
    disabled?: boolean;
    options?: Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "ref" | "value" | "defaultValue" | "onBlur"
    >;
  }
>(
  (
    { className, name, defaultValue, value, onChange, placeholder, disabled },
    ref
  ) => {
    const [dateTime, setDateTime] = React.useState<Date | undefined>(
      defaultValue ?? value ?? undefined
    );

    const handleDateChange = (date: Date) => {
      setDateTime(date);
      onChange(date);
    };

    return (
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "flex w-full p-1 items-center justify-between rounded-md border transition-all",
            "focus-within:outline-none focus:outline-none focus:ring-0",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            className
          )}
        >
          <DateTimeLocalInput
            name={name}
            value={dateTime}
            onChange={handleDateChange}
            disabled={disabled}
            ref={ref}
          />
          <NaturalLanguageInput
            placeholder={placeholder}
            value={dateTime}
            onChange={handleDateChange}
            disabled={disabled}
            ref={ref}
          />
        </div>
      </div>
    );
  }
);
SmartDatetimeInput.displayName = "DatetimeInput";
