import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as chrono from "chrono-node";
import React, { useRef, useState } from "react";

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
  return chrono.parseDate(str);
};

/**
 * Converts a given timestamp or the current date and time to a string representation in the local time zone.
 *
 * @param timestamp {Date | string}
 * @returns A string representation of the timestamp in the format `HH:mm`, adjusted for the local time zone.
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
 *
 * @param datetime - {Date | string}
 * @returns A string representation of the date and time in the format "MMM D, YYYY h:mm A" (e.g. "Jan 1, 2023 12:00 PM").
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

const inputBase = "focus:outline-none focus:ring-0 sm:text-sm";

const NaturalLanguageInput = React.forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    value?: Date;
    onChange: (date: Date) => void;
  }
>(({ placeholder, value, onChange }, ref) => {
  const _placeholder = placeholder ?? 'e.g. "tomorrow at 5pm" or "in 2 hours"';
  return (
    <input
      ref={ref}
      type="text"
      placeholder={_placeholder}
      defaultValue={value ? formatDateTime(value) : ""}
      onBlur={(e) => {
        // parse the date string when the input field loses focus
        if (e.target.value.length > 0) {
          const parsedDateTime = parseDateTime(e.target.value);
          if (parsedDateTime) {
            onChange(parsedDateTime);
            e.target.value = formatDateTime(parsedDateTime);
          }
        }
      }}
      className={cn("px-1 flex-1 border-none bg-transparent", inputBase)}
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
  }, [ref]);

  const _name = name ?? "expiresAt";
  return (
    <>
      <Label htmlFor={_name} className="sr-only">
        Expires At
      </Label>
      <Input
        ref={ref}
        type="datetime-local"
        id={_name}
        name={_name}
        value={value ? getDateTimeLocal(value) : ""}
        onChange={(e) => {
          const expiryDate = new Date(e.target.value);
          onChange(expiryDate);
          // set the formatted date string in the text input field to keep them in sync
          if (inputRef.current) {
            inputRef.current.value = formatDateTime(expiryDate);
          }
        }}
        // this input field is hidden and the width is restricted to only show the icon.
        className={cn(
          "flex justify-end w-[40px] border-none bg-transparent text-gray-500",
          inputBase
        )}
      />
    </>
  );
});
DateTimeLocalInput.displayName = "DateTimeLocalInput";

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  {
    initialDate?: Date;
    onChange: (date: Date) => void;
    className?: string;
    options?: Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "ref" | "value" | "defaultValue" | "onBlur"
    >;
  }
>(({ className, initialDate, onChange }, ref) => {
  const [dateTime, setDateTime] = useState<Date | undefined>(
    initialDate ?? undefined
  );

  const handleDateChange = (date: Date) => {
    setDateTime(date);
    onChange(date);
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={cn(
          "flex w-full p-1 pl-3 items-center justify-between rounded-md border transition-all",
          "focus-within:border-gray-800 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-500",
          className
        )}
      >
        <NaturalLanguageInput
          value={dateTime}
          onChange={handleDateChange}
          ref={ref}
        />
        <DateTimeLocalInput
          name={"test"}
          value={dateTime}
          onChange={handleDateChange}
          ref={ref}
        />
      </div>
    </div>
  );
});
SmartDatetimeInput.displayName = "DatetimeInput";
