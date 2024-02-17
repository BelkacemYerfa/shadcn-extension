"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

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
        console.log(newPath, currentElement.isSelectable, selectId);
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
        "rounded-md outline h-60 w-96 outline-1 outline-muted overflow-hidden py-1",
        className
      )}
    >
      <ScrollArea style={{ width, height }} className="relative">
        {getVirtualItems().map((element) => (
          <TreeItem
            aria-label="Root"
            key={element.key}
            elements={[elements[element.index]]}
            selectedId={selectedId}
            expendedItems={expendedItems}
            handleSelect={handleExpand}
            selectItem={selectItem}
            indicator={indicator}
          />
        ))}
        <Button
          variant={"ghost"}
          className="h-8 w-8 p-1 absolute bottom-1 right-2"
          onClick={
            expendedItems && expendedItems.length > 0
              ? closeAll
              : () => expendAllTree(elements)
          }
        >
          <CaretSortIcon />
          <span className="sr-only">Toggle</span>
        </Button>
      </ScrollArea>
    </div>
  );
};

TreeView.displayName = "TreeView";

export const TreeItem = forwardRef<
  HTMLUListElement,
  {
    expendedItems?: string[];
    selectedId?: string;
    elements?: TreeViewElement[] | TreeViewElement;
    handleSelect: (id: string) => void;
    selectItem: (id: string) => void;
    indicator?: boolean;
  } & React.HTMLAttributes<HTMLUListElement>
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
    console.log("expendedItems", expendedItems, "selectedId", selectedId);
    return (
      <ul ref={ref} className="w-full" {...props}>
        {elements instanceof Array ? (
          elements.map((element) => (
            <li key={element.id} className="pl-5 w-full">
              {element.children && element.children?.length > 0 ? (
                <AccordionPrimitive.Root
                  type="multiple"
                  defaultValue={expendedItems}
                  value={
                    expendedItems?.includes(element.id) ? [element.name] : []
                  }
                >
                  <AccordionPrimitive.Item
                    value={element.name}
                    className="relative overflow-hidden h-full"
                  >
                    <AccordionPrimitive.Trigger
                      className={` flex items-center gap-1 w-full text-sm ${
                        !element.isSelectable
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      } `}
                      disabled={!element.isSelectable}
                      onClick={() => handleSelect(element.id)}
                    >
                      {expendedItems?.includes(element.id) ? (
                        <FolderOpenIcon className="h-4 w-4" />
                      ) : (
                        <FolderIcon className="h-4 w-4" />
                      )}
                      <span>{element.name}</span>
                    </AccordionPrimitive.Trigger>
                    <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
                      {element.children && indicator && (
                        <div className="h-full w-[1px] bg-muted absolute left-1.5 py-3 rounded-md" />
                      )}
                      <div className="flex flex-col gap-2">
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
                      </div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                </AccordionPrimitive.Root>
              ) : (
                <Leaf
                  aria-label={`File ${element.name}`}
                  key={element.id}
                  element={element}
                  isSelected={selectedId === element.id}
                  handleSelect={selectItem}
                >
                  <FileIcon className="h-4 w-4" />
                  <span>{element?.name}</span>
                </Leaf>
              )}
            </li>
          ))
        ) : (
          <li className="px-1">
            <Leaf
              aria-label={`file ${elements?.name}`}
              element={elements}
              handleSelect={selectItem}
              isSelected={selectedId === elements?.id}
            >
              <FileIcon className="h-4 w-4" />
              <span>{elements?.name}</span>
            </Leaf>
          </li>
        )}
      </ul>
    );
  }
);

TreeItem.displayName = "TreeItem";

export const Leaf = forwardRef<
  HTMLButtonElement,
  {
    element?: TreeViewElement;
    handleSelect: (id: string) => void;
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
        aria-label="leaf"
        {...props}
        className={`${
          isSelected === true && element?.isSelectable
            ? " bg-muted rounded-md"
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
          onClick={() => handleSelect(element?.id ?? "")}
        >
          {children}
        </div>
      </button>
    );
  }
);

Leaf.displayName = "Leaf";
