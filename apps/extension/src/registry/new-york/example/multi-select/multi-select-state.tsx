"use client";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  MultiSelectValue,
} from "@/registry/new-york/extension/multi-select";
import { useState } from "react";

const MultiSelectState = () => {
  const [value, setValue] = useState<MultiSelectValue[]>([]);

  return (
    <MultiSelector values={value} onValuesChange={setValue}>
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select items" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          <MultiSelectorItem value="1" label="Item 1">
            Item 1
          </MultiSelectorItem>
          <MultiSelectorItem value="2" label="Item 2">
            Item 2
          </MultiSelectorItem>
          <MultiSelectorItem value="3" label="Item 3">
            Item 3
          </MultiSelectorItem>
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};

export default MultiSelectState;
