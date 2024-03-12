"use client";

import {
  Tree,
  Folder,
  File,
  CollapseButton,
} from "@/registry/default/extension/tree-view/tree-view-api";

export const TreeFileTest = () => {
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
};
