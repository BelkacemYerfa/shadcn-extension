"use client";

import { TagsInput } from "@/registry/default/extension/tags-input";
import { DateTimePicker } from "@/registry/default/extension/time-picker";
import { useState } from "react";

export default function ExamplePage() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <main className="py-28 max-w-md w-full mx-auto">
      <TagsInput
        value={values}
        onValueChange={setValues}
        placeholder="enter your used tech"
      />

      <DateTimePicker date={new Date()} onChange={console.log} />
    </main>
  );
}
