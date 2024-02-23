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
  const [selectedId, setSelectIds] = useState<string | undefined>(
    initialSelectedId
  );

  const [expendedItems, setExpendedItems] = useState<string[] | undefined>(
    initialExpendedItems
  );

  const selectItem = useCallback((id: string) => {
    setSelectIds(id);
  }, []);

  const handleExpand = useCallback((id: string) => {
    setExpendedItems((prev) => {
      if (prev?.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...(prev ?? []), id];
    });
  }, []);

  const expendAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandTree = (element: TreeViewElement) => {
      if (
        element.isSelectable &&
        element.children &&
        element.children.length > 0
      ) {
        setExpendedItems((prev) => [...(prev ?? []), element.id]);
        element.children.forEach(expandTree);
      }
    };

    elements.forEach(expandTree);
  }, []);

  const expandSpecificTargetedElements = useCallback(
    (elements: TreeViewElement[], selectId: string) => {
      const findParent = (
        currentElement: TreeViewElement,
        currentPath: string[] = []
      ) => {
        const newPath = [...currentPath, currentElement.id];
        if (currentElement.id === selectId) {
          if (currentElement.isSelectable) {
            setExpendedItems(newPath);
          } else {
            if (newPath.includes(currentElement.id)) {
              newPath.pop();
              setExpendedItems(newPath);
              return;
            }
            setExpendedItems(newPath);
          }
        }

        if (
          currentElement.isSelectable &&
          currentElement.children &&
          currentElement.children.length > 0
        ) {
          currentElement.children.forEach((child) => {
            findParent(child, newPath);
          });
        }
      };

      elements.forEach((element) => {
        findParent(element);
      });
    },
    []
  );

  const closeAll = useCallback(() => {
    setExpendedItems([]);
  }, []);

  useEffect(() => {
    if (expandAll) {
      expendAllTree(elements);
      return;
    }
    if (initialSelectedId) {
      expandSpecificTargetedElements(elements, initialSelectedId);
    }
  }, []);

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
>(
  (
    {
      className,
      elements,
      selectItem,
      handleSelect,
      expendedItems,
      selectedId,
      indicator,
      ...props
    },
    ref
  ) => {
    return (
      <ul ref={ref} className="w-full" {...props}>
        {elements instanceof Array ? (
          elements.map((element) => (
            <li key={element.id} className="pl-5 w-full">
              {element.children && element.children?.length > 0 ? (
                <Folder
                  expendedItems={expendedItems}
                  handleSelect={handleSelect}
                  element={element}
                  indicator={indicator}
                >
                  <TreeItem
                    key={element.id}
                    aria-label={`folder ${element.name}`}
                    elements={element.children}
                    selectedId={selectedId}
                    handleSelect={handleSelect}
                    selectItem={selectItem}
                    expendedItems={expendedItems}
                    indicator={indicator}
                  />
                </Folder>
              ) : (
                <File
                  aria-label={`File ${element.name}`}
                  key={element.id}
                  element={element}
                  isSelected={selectedId === element.id}
                  handleSelect={selectItem}
                >
                  <FileIcon className="h-4 w-4" />
                  <span>{element?.name}</span>
                </File>
              )}
            </li>
          ))
        ) : (
          <li className="px-1">
            <File
              aria-label={`file ${elements?.name}`}
              element={elements}
              handleSelect={selectItem}
              isSelected={selectedId === elements?.id}
            >
              <FileIcon className="h-4 w-4" />
              <span>{elements?.name}</span>
            </File>
          </li>
        )}
      </ul>
    );
  }
);

TreeItem.displayName = "TreeItem";

interface FolderComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type FolderProps = {
  expendedItems?: string[];
  handleSelect?: (id: string) => void;
  indicator?: boolean;
  element: TreeViewElement;
} & FolderComponentProps;

export const Folder = forwardRef<
  HTMLDivElement,
  FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, element, expendedItems, handleSelect, indicator, children },
    ref
  ) => {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={expendedItems}
        value={
          expendedItems?.includes(element?.id ?? "")
            ? [element.name ?? " "]
            : []
        }
        className={cn("w-full", className)}
      >
        <AccordionPrimitive.Item
          value={element.name ?? " "}
          className="relative overflow-hidden h-full"
        >
          <AccordionPrimitive.Trigger
            className={` flex items-center gap-1 w-full text-sm ${
              !element?.isSelectable
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            } `}
            disabled={!element?.isSelectable}
            onClick={() => handleSelect?.(element?.id ?? "")}
          >
            {expendedItems?.includes(element?.id ?? "") ? (
              <FolderOpenIcon className="h-4 w-4" />
            ) : (
              <FolderIcon className="h-4 w-4" />
            )}
            <span>{element.name}</span>
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
            {element?.children && indicator && (
              <div className="h-full w-[1px] bg-muted absolute left-1.5 py-3 rounded-md" />
            )}
            <div className="flex flex-col gap-2">{children}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    );
  }
);

Folder.displayName = "Folder";

export const File = forwardRef<
  HTMLButtonElement,
  {
    element?: TreeViewElement;
    handleSelect?: (id: string) => void;
    isSelected?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(
  (
    { element, className, handleSelect, isSelected, children, ...props },
    ref
  ) => {
    return (
      <button
        type="button"
        disabled={!element?.isSelectable}
        ref={ref}
        aria-label="File"
        {...props}
        className={`${
          isSelected === true && element?.isSelectable
            ? "bg-muted rounded-md"
            : ""
        } `}
      >
        <div
          className={cn(
            `flex items-center gap-1 cursor-pointer text-sm ${
              element?.isSelectable
                ? "cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`,
            className
          )}
          onClick={() => handleSelect?.(element?.id ?? "")}

        >
          <span>{elements?.name}</span>
        </File>
      )}
    </ul>
  );
});

TreeItem.displayName = "TreeItem";
