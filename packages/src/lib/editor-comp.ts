import {
  Tree,
  File,
  Folder,
  CollapseButton,
} from "@/components/extension/tree-view/tree-view-api";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/extension/fancy-multi-select/multi-select-api";
import {
  BreadCrumb,
  BreadCrumbContent,
  BreadCrumbItem,
  BreadCrumbEllipsis,
  BreadCrumbPopover,
  BreadCrumbSeparator,
  BreadCrumbTrigger,
} from "@/components/extension/breadcrumb/bread-crumb";
import "./file";

type EditorComponent = {
  title: string;
  dependencies: Record<string, any>;
  example?: string;
}[];

export const editorComponentsConfig: EditorComponent = [
  {
    title: "Tree View",
    dependencies: {
      Tree,
      File,
      Folder,
      CollapseButton,
      react: require("react"),
      elements: [
        {
          id: "1",
          isSelectable: true,
          name: "src",
          children: [
            {
              id: "2",
              isSelectable: true,
              name: "app.tsx",
            },
            {
              id: "3",
              isSelectable: true,
              name: "components",
              children: [
                {
                  id: "4",
                  isSelectable: true,
                  name: "input.tsx",
                },
                {
                  id: "5",
                  isSelectable: true,
                  name: "button.tsx",
                },
                {
                  id: "20",
                  isSelectable: true,
                  name: "pages",
                  children: [
                    {
                      id: "21",
                      isSelectable: true,
                      name: "interface.ts",
                    },
                  ],
                },
              ],
            },
            {
              id: "6",
              isSelectable: true,
              name: "ui",
              children: [
                {
                  id: "7",
                  isSelectable: true,
                  name: "carousel.tsx",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    title: "Multi Selector",
    dependencies: {
      react: require("react"),
      MultiSelector,
      MultiSelectorContent,
      MultiSelectorInput,
      MultiSelectorItem,
      MultiSelectorList,
      MultiSelectorTrigger,
    },
    example: `() => {
  const [value, setValue] = React.useState([]);
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
};`,
  },
  {
    title: "Bread Crumb",
    dependencies: {
      react: require("react"),
      BreadCrumb,
      BreadCrumbContent,
      BreadCrumbItem,
      BreadCrumbEllipsis,
      BreadCrumbPopover,
      BreadCrumbSeparator,
      BreadCrumbTrigger,
    },
  },
];
