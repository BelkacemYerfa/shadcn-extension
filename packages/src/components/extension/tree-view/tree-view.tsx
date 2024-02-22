"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useCallback, useRef } from "react";
import useResizeObserver from "use-resize-observer";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Tree, Folder, File, CollapseButton } from "./tree-view-api";

// TODO: Add the ability to add custom icons

export type TreeViewElement = {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type TreeViewProps = {
  initialSelectedId?: string;
  elements: TreeViewElement[];
  indicator?: boolean;
} & (
  | {
      initialExpendedItems?: string[];
      expandAll?: false;
    }
  | {
      initialExpendedItems?: undefined;
      expandAll: true;
    }
) &
  TreeViewComponentProps;

export const TreeView = ({
  elements,
  className,
  initialSelectedId,
  initialExpendedItems,
  expandAll = false,
  indicator = false,
}: TreeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: elements.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => 40, []),
    overscan: 5,
  });

  const { height = getTotalSize(), width } = useResizeObserver({
    ref: containerRef,
  });
  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-md outline h-60 w-96 outline-1 outline-muted overflow-hidden py-1 relative ",
        className
      )}
    >
      <Tree
        initialSelectedId={initialSelectedId}
        initialExpendedItems={initialExpendedItems}
        style={{ height, width }}
      >
        {getVirtualItems().map((element) => (
          <TreeItem
            aria-label="Root"
            key={element.key}
            elements={[elements[element.index]]}
            indicator={indicator}
          />
        ))}
        <CollapseButton elements={elements} expandAll={expandAll} />
      </Tree>
    </div>
  );
};

TreeView.displayName = "TreeView";

export const TreeItem = forwardRef<
  HTMLUListElement,
  {
    elements?: TreeViewElement[] | TreeViewElement;
    indicator?: boolean;
  } & React.HTMLAttributes<HTMLUListElement>
>(({ className, elements, indicator, ...props }, ref) => {
  return (
    <ul ref={ref} className="w-full" {...props}>
      {elements instanceof Array ? (
        elements.map((element) => (
          <div key={element.id} className="w-full">
            {element.children && element.children?.length > 0 ? (
              <Folder element={element.name}>
                <TreeItem
                  key={element.id}
                  aria-label={`folder ${element.name}`}
                  elements={element.children}
                  indicator={indicator}
                />
              </Folder>
            ) : (
              <File
                aria-label={`File ${element.name}`}
                key={element.id}
                element={element.name}
              >
                <span>{element?.name}</span>
              </File>
            )}
          </div>
        ))
      ) : (
        <File
          aria-label={`file ${elements?.name}`}
          element={elements?.name ?? " "}
        >
          <span>{elements?.name}</span>
        </File>
      )}
    </ul>
  );
});

TreeItem.displayName = "TreeItem";
