import React from "react";
import { DatetimePicker } from "../extension/datetime-picker";

export const DatetimePickerDemo = () => {
  return (
    <DatetimePicker
      initialDate={new Date()}
      format={[["months", "days", "years"], []]}
    />
  );
};

export default DatetimePickerDemo;
