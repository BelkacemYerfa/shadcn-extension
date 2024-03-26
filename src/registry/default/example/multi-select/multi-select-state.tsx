"use client";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/registry/default/extension/multi-select";
import { useState } from "react";

const MultiSelectState = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <MultiSelector value={value} onValueChange={setValue}>
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select items" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          <MultiSelectorItem value="1">Item 1</MultiSelectorItem>
          <MultiSelectorItem value="2">Item 2</MultiSelectorItem>
          <MultiSelectorItem value="3">Item 3</MultiSelectorItem>
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};

export default MultiSelectState;
