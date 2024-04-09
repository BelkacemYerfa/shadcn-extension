"use client";

import { SmartDatetimeInput } from "@/registry/default/extension/smart-datetime-input";
import { TagsInput } from "@/registry/default/extension/tags-input";
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

      <SmartDatetimeInput onChange={console.log} />
    </main>
  );
}
