import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import useResizeObserver from "use-resize-observer";

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
    console.time("expand");
    const expandedSet = new Set<string>();

    const expandTree = (element: TreeViewElement) => {
      if (element.children && element.children.length > 0) {
        expandedSet.add(element.id);
        element.children.forEach(expandTree);
      }
    };

    elements.forEach(expandTree);

    setExpendedItems((prev) => [...(prev ?? []), ...Array.from(expandedSet)]);
    console.timeEnd("expand");
  }, []);

  useEffect(() => {
    if (expandAll) {
      expendAllTree(elements);
    }
  }, []);
  const { ref: treeRef, height, width } = useResizeObserver();
  return (
    <div
      ref={treeRef}
      className={cn(
        "rounded-md outline max-h-40 h-full w-96 outline-1 outline-muted overflow-hidden py-1 ",
        className
      )}
    >
      <ScrollArea style={{ width, height }}>
        <TreeItem
          aria-label="Root"
          elements={elements}
          selectedId={selectedId}
          expendedItems={expendedItems}
          handleSelect={handleExpand}
          selectItem={selectItem}
        />
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
    elements: TreeViewElement[] | TreeViewElement;
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
              aria-label={`File ${elements.name}`}
              element={elements}
              handleSelect={selectItem}
              isSelected={selectedId === elements.id}
            />
          </li>
        )}
      </ul>
    );
  }
);

TreeItem.displayName = "TreeItem";

export const Leaf = forwardRef<
  HTMLDivElement,
  {
    element: TreeViewElement;
    handleSelect: (id: string) => void;
    isSelected?: boolean;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ element, className, handleSelect, isSelected, ...props }, ref) => {
  return (
    <div ref={ref} aria-label="leaf" {...props}>
      <div
        className={cn(
          `flex items-center gap-1 px-1 cursor-pointer ${
            isSelected ? " bg-muted rounded-md" : ""
          }`,
          className
        )}
        onClick={() => handleSelect(element.id)}
      >
        <FileIcon className="h-4 w-4" />
        <span>{element?.name}</span>
      </div>
    </div>
  );
});

Leaf.displayName = "Leaf";
