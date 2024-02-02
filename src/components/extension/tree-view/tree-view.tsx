import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";
import { useVirtualizer } from "@tanstack/react-virtual";

type TreeViewElement = {
  id: string;
  name: string;
  isSelectable?: boolean;
  icon?: React.ReactNode;
  children?: TreeViewElement[];
};

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type TreeViewProps = {
  initialSelectedId?: string;
  elements: TreeViewElement[];
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
      if (element.children && element.children.length > 0) {
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
          setExpendedItems((prev) => [...(prev ?? []), ...newPath]);
        }

        if (currentElement.children && currentElement.children.length > 0) {
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
        "rounded-md outline h-60 w-96 outline-1 outline-muted overflow-hidden py-1 ",
        className
      )}
    >
      <ScrollArea style={{ width, height }}>
        {getVirtualItems().map((element) => (
          <TreeItem
            aria-label="Root"
            key={element.key}
            elements={[elements[element.index]]}
            selectedId={selectedId}
            expendedItems={expendedItems}
            handleSelect={handleExpand}
            selectItem={selectItem}
          />
        ))}
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
      ...props
    },
    ref
  ) => {
    return (
      <ul ref={ref} className="w-full" {...props}>
        {elements instanceof Array ? (
          elements.map((element) => (
            <li key={element.id} className="pl-4 w-full">
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
                    className="w-full"
                  >
                    <AccordionPrimitive.Trigger
                      className={`flex items-center gap-1 w-full text-sm  ${
                        expendedItems?.includes(element.id)
                          ? "cursor-pointer"
                          : "cursor-default"
                      }  cursor-pointer `}
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
                    <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <div className="flex flex-col gap-2">
                        <TreeItem
                          key={element.id}
                          aria-label={`Folder ${element.name}`}
                          elements={element.children}
                          selectedId={selectedId}
                          handleSelect={handleSelect}
                          selectItem={selectItem}
                          expendedItems={expendedItems}
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
                />
              )}
            </li>
          ))
        ) : (
          <li>
            <Leaf
              aria-label={`File ${elements?.name}`}
              element={elements}
              handleSelect={selectItem}
              isSelected={selectedId === elements?.id}
            />
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
>(({ element, className, handleSelect, isSelected, ...props }, ref) => {
  return (
    <button
      type="button"
      disabled={!element?.isSelectable}
      ref={ref}
      aria-label="leaf"
      {...props}
    >
      <div
        className={cn(
          `flex items-center gap-1 px-1 cursor-pointer ${
            isSelected ? " bg-muted rounded-md" : ""
          } ${
            !element?.isSelectable
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`,
          className
        )}
        onClick={() => handleSelect(element?.id ?? "")}
      >
        <FileIcon className="h-4 w-4" />
        <span>{element?.name}</span>
      </div>
    </button>
  );
});

Leaf.displayName = "Leaf";
