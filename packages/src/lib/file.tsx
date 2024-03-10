import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/registry/default/extension/fancy-multi-select/multi-select-api";
import { useState } from "react";

() => {
  const [value, setValue] = useState<string[]>([]);
  const options = [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Angular", value: "angular" },
  ];
  return (
    <MultiSelector
      value={value}
      onValueChange={setValue}
      className="max-w-xs"
      loop={false}
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select your framework" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {options.map((option, i) => (
            <MultiSelectorItem key={i} value={option.value}>
              {option.label}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};
