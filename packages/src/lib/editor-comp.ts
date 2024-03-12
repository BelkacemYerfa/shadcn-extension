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
import Link from "next/link";

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
    example: `() => {
  const elements = [
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
  ];
  return (
    <Tree
      className="rounded-md outline h-60 w-96 outline-1 outline-muted overflow-hidden py-1"
      initialExpendedItems={["components"]}
      initialSelectedId="carousel.tsx"
      elements={elements}
    >
      <Folder element="src">
        <File element="app.tsx">
          <p> app.tsx </p>
        </File>
        <Folder element="components">
          <File element="input.tsx">
            <p> input.tsx </p>
          </File>
          <File element="button.tsx">
            <p> button.tsx </p>
          </File>
          <Folder element="pages">
            <File element="interface.ts">
              <p>interface.ts</p>
            </File>
          </Folder>
        </Folder>
        <Folder element="ui">
          <File element="carousel.tsx">
            <p>carousel.tsx</p>
          </File>
        </Folder>
      </Folder>
      <CollapseButton elements={elements} />
    </Tree>
  );
};`,
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
      Link,
      react: require("react"),
      BreadCrumb,
      BreadCrumbContent,
      BreadCrumbItem,
      BreadCrumbEllipsis,
      BreadCrumbPopover,
      BreadCrumbSeparator,
      BreadCrumbTrigger,
    },
    example: `() => {
  return (
    <BreadCrumb orientation="vertical" variant={"ghost"} className="gap-1">
      <BreadCrumbItem className="px-2 h-8" index={0}>
        Home
      </BreadCrumbItem>
      <BreadCrumbSeparator className="" />
      <BreadCrumbItem index={1} className="px-2">
        Settings
      </BreadCrumbItem>
      <BreadCrumbSeparator />
      <BreadCrumbPopover>
        <BreadCrumbTrigger className="hover:bg-muted flex items-center justify-center size-8 rounded-md focus:outline-none">
          <BreadCrumbEllipsis
            index={2}
            className="px-2 flex items-center justify-center size-8 rounded-md"
          />
          <span className="sr-only">open rest links</span>
        </BreadCrumbTrigger>
        <BreadCrumbContent className="flex items-center flex-col p-1 max-w-40">
          <BreadCrumbItem index={3} className="px-2 size-8 w-full">
            Account
          </BreadCrumbItem>
          <BreadCrumbItem index={4} className="px-2 size-8 w-full">
            Settings
          </BreadCrumbItem>
        </BreadCrumbContent>
      </BreadCrumbPopover>
      <BreadCrumbSeparator />
      <BreadCrumbItem index={5} className="px-2">
        Account
      </BreadCrumbItem>
    </BreadCrumb>
  );
}`,
  },
];
