"use client";

import { useState } from "react";
import { TagsInput } from "@/registry/new-york/extension/tags-input";

const TagsInputDemo = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <TagsInput
      value={value}
      onValueChange={setValue}
      placeholder="Enter anything"
      className="w-full"
    />
  );
};

export default TagsInputDemo;
