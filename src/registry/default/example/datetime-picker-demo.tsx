"use client";
import React from "react";
import { DatetimePicker } from "../extension/datetime-picker";

const DatetimePickerDemo = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <DatetimePicker
      config={[
        ["days", "months", "years"],
        ["hours", "minutes", "am/pm"],
      ]}
    />
  );
};

export default DatetimePickerDemo;
