"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import exp from "constants";

type TreeViewElement = {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

type TreeContextProps = {
  selectedId: string | undefined;
  expendedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpendedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

type TreeViewComponentProps = React.HTMLAttributes<HTMLDivElement>;

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpendedItems?: string[];
} & TreeViewComponentProps;

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpendedItems,
      children,
      indicator = true,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(
      initialSelectedId
    );
    const [expendedItems, setExpendedItems] = useState<string[] | undefined>(
      initialExpendedItems
    );

    const selectItem = useCallback((id: string) => {
      setSelectedId(id);
    }, []);

    const handleExpand = useCallback((id: string) => {
      setExpendedItems((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        return [...(prev ?? []), id];
      });
    }, []);

    const expandSpecificTargetedElements = useCallback(
      (elements?: TreeViewElement[], selectId?: string) => {
        if (!elements || !selectId) return;
        const findParent = (
          currentElement: TreeViewElement,
          currentPath: string[] = []
        ) => {
          const newPath = [...currentPath, currentElement.name];
          if (currentElement.name === selectId) {
            if (currentElement.isSelectable) {
              setExpendedItems((prev) => [...(prev ?? []), ...newPath]);
            } else {
              if (newPath.includes(currentElement.name)) {
                newPath.pop();
                setExpendedItems((prev) => [...(prev ?? []), ...newPath]);
              }
            }
            return;
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

    useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId);
      }
    }, [initialSelectedId, elements]);

    const {
      ref: containerRef,
      height,
      width,
    } = useResizeObserver<HTMLDivElement>({});

    const style = props.style ?? { height, width };

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expendedItems,
          handleExpand,
          selectItem,
          setExpendedItems,
          indicator,
        }}
      >
        <div ref={containerRef} className={cn("w-full h-80", className)}>
          <ScrollArea ref={ref} style={style} className="relative px-2">
            <AccordionPrimitive.Root
              type="multiple"
              defaultValue={expendedItems}
              value={expendedItems}
              className="flex flex-col gap-1"
              onValueChange={(value) =>
                setExpendedItems((prev) => [...(prev ?? []), value[0]])
              }
            >
              {children}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = "Tree";

interface FolderComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type FolderProps = {
  expendedItems?: string[];
  indicator?: boolean;
  element: string;
  isSelectable?: boolean;
} & FolderComponentProps;

const Folder = forwardRef<
  HTMLDivElement,
  FolderProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, element, isSelectable = true, children, ...props }, ref) => {
  const { handleExpand, expendedItems, indicator, setExpendedItems } =
    useTree();

  return (
    <AccordionPrimitive.Item
      value={element}
      className="relative overflow-hidden h-full"
      {...props}
    >
      <AccordionPrimitive.Trigger
        className={`flex items-center gap-1 text-sm ${
          !isSelectable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } `}
        disabled={!isSelectable}
        onClick={() => handleExpand(element)}
      >
        {expendedItems?.includes(element) ? (
          <FolderOpenIcon className="h-4 w-4" />
        ) : (
          <FolderIcon className="h-4 w-4" />
        )}
        <span>{element}</span>
      </AccordionPrimitive.Trigger>
      <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
        {element && indicator && (
          <div className="h-full w-[1px] bg-muted absolute left-1.5 py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out " />
        )}
        <AccordionPrimitive.Root
          type="multiple"
          className="flex flex-col gap-1 py-1 ml-5"
          defaultValue={expendedItems}
          value={expendedItems}
          onValueChange={(value) => {
            setExpendedItems?.((prev) => [...(prev ?? []), value[0]]);
          }}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
});

Folder.displayName = "Folder";

const File = forwardRef<
  HTMLButtonElement,
  {
    element: string;
    handleSelect?: (id: string) => void;
    isSelectable?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(
  (
    {
      element,
      className,
      handleSelect,
      isSelectable = true,
      children,
      ...props
    },
    ref
  ) => {
    const { selectedId, selectItem } = useTree();
    const isSelected = selectedId === element;
    return (
      <AccordionPrimitive.Item value={element} className="relative">
        <AccordionPrimitive.Trigger
          ref={ref}
          {...props}
          disabled={!isSelectable}
          aria-label="File"
          className={cn(
            "flex items-center gap-1 cursor-pointer text-sm pr-1 rounded-md w-fit duration-200 ease-in-out",
            {
              "bg-muted": isSelected && isSelectable,
            },
            isSelectable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          )}
          onClick={() => selectItem(element)}
        >
          <FileIcon className="h-4 w-4" />
          {children}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Item>
    );
  }
);

File.displayName = "File";

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[];
    expandAll?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll, children, ...props }, ref) => {
  const { expendedItems, setExpendedItems } = useTree();

  const expendAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandTree = (element: TreeViewElement) => {
      if (
        element.isSelectable &&
        element.children &&
        element.children.length > 0
      ) {
        setExpendedItems?.((prev) => [...(prev ?? []), element.name]);
        element.children.forEach(expandTree);
      }
    };

    elements.forEach(expandTree);
  }, []);

  const closeAll = useCallback(() => {
    setExpendedItems?.([]);
  }, []);

  useEffect(() => {
    if (expandAll) {
      expendAllTree(elements);
    }
  }, [expandAll]);

  return (
    <Button
      variant={"ghost"}
      className="h-8 w-fit p-1 absolute bottom-1 right-2"
      onClick={
        expendedItems && expendedItems.length > 0
          ? closeAll
          : () => expendAllTree(elements)
      }
      ref={ref}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
});

CollapseButton.displayName = "CollapseButton";

export { Tree, Folder, File, CollapseButton, type TreeViewElement };
