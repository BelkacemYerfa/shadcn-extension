"use client";

import { useState } from "react";
import { TagsInput } from "@/registry/default/extension/tags-input";

const TagsInputSate = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <TagsInput
      value={value}
      onValueChange={setValue}
      placeholder="enter your tech"
      className="w-full"
    />
  );
};

export default TagsInputSate;
