import React from "react";
import { DatetimePicker } from "../extension/datetime-picker";

export const DatetimePickerDemo = () => {
  return (
    <DatetimePicker
      format={[
        ["months", "days", "years"],
        ["hours", "minutes", "am/pm"],
      ]}
    />
  );
};

export default DatetimePickerDemo;
