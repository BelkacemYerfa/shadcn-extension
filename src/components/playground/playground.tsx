"use client";

import {
  memo,
  useTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
  lazy,
} from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditorLoader } from "../loaders/editor-loader";
import { getHighlighter } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { editorComponentsConfig as Components } from "@/lib/editor-comp";
import { LivePlaygroundPreview } from "./playground-preview";
import { PlaygroundSearchSelector } from "@/components/drop-downs/search-selector";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import {
  Tree,
  File,
  Folder,
  CollapseButton,
} from "@/registry/default/extension/tree-view-api";

type PlaygroundProps = {
  defaultCode?: string;
  dependencies?: any;
};

const VIEW_SIZE = 33;
const MIN_SIZE = 25;
const AVA_THEMES = ["one-dark-pro", "github-light", "github-dark"];
const COMPONENTS = Components.map((comp) => comp.title);

const createArrObjFromArr = (arr: string[]) => {
  return arr.map((v) => ({
    label: v,
    value: v,
  }));
};

const fileContent = [
  {
    file: "file 0",
    content: `"use client";

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
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
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
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
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
      openIcon,
      closeIcon,
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
          const newPath = [...currentPath, currentElement.id];
          if (currentElement.id === selectId) {
            if (currentElement.isSelectable) {
              setExpendedItems((prev) => [...(prev ?? []), ...newPath]);
            } else {
              if (newPath.includes(currentElement.id)) {
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
          openIcon,
          closeIcon,
        }}
      >
        <div ref={containerRef} className={cn("w-full h-80", className)}>
          <ScrollArea ref={ref} className="relative px-2">
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

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-full w-px bg-muted absolute left-1.5 py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out",
        className
      )}
      {...props}
    />
  );
});

TreeIndicator.displayName = "TreeIndicator";

interface FolderComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type FolderProps = {
  expendedItems?: string[];
  element: string;
  id: string;
  isSelectable?: boolean;
  isSelect?: boolean;
} & FolderComponentProps;

const Folder = forwardRef<
  HTMLDivElement,
  FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      element,
      id,
      isSelectable = true,
      isSelect,
      children,
      ...props
    },
    ref
  ) => {
    const {
      handleExpand,
      expendedItems,
      indicator,
      setExpendedItems,
      openIcon,
      closeIcon,
    } = useTree();

    return (
      <AccordionPrimitive.Item
        value={id}
        className="relative overflow-hidden h-full"
        {...props}
      >
        <AccordionPrimitive.Trigger
          className={cn(
            "flex items-center gap-1 text-sm rounded-md",
            className,
            {
              "bg-muted rounded-md": isSelect && isSelectable,
              "cursor-pointer": isSelectable,
              "cursor-not-allowed opacity-50": !isSelectable,
            }
          )}
          disabled={!isSelectable}
          onClick={() => handleExpand(id)}
        >
          {expendedItems?.includes(id)
            ? openIcon ?? <FolderOpenIcon className="h-4 w-4" />
            : closeIcon ?? <FolderIcon className="h-4 w-4" />}
          <span>{element}</span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
          {element && indicator && (
            <TreeIndicator className="absolute" aria-hidden="true" />
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
  }
);

Folder.displayName = "Folder";

const File = forwardRef<
  HTMLButtonElement,
  {
    element: string;
    id: string;
    handleSelect?: (id: string) => void;
    isSelectable?: boolean;
    isSelect?: boolean;
    fileIcon?: React.ReactNode;
  } & React.HTMLAttributes<HTMLButtonElement>
>(
  (
    {
      element,
      id,
      className,
      handleSelect,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      ...props
    },
    ref
  ) => {
    const { selectedId, selectItem } = useTree();
    const isSelected = isSelect ?? selectedId === id;
    return (
      <AccordionPrimitive.Item value={id} className="relative">
        <AccordionPrimitive.Trigger
          ref={ref}
          {...props}
          disabled={!isSelectable}
          aria-label="File"
          className={cn(
            "flex items-center gap-1 cursor-pointer text-sm pr-1 rounded-md  duration-200 ease-in-out",
            {
              "bg-muted": isSelected && isSelectable,
            },
            isSelectable ? "cursor-pointer" : "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => selectItem(id)}
        >
          {fileIcon ?? <FileIcon className="h-4 w-4" />}
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
        setExpendedItems?.((prev) => [...(prev ?? []), element.id]);
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
`,
  },
  {
    file: "file 1",
    content: `"use client";

import {
  Tree,
  Folder,
  File,
  CollapseButton,
} from "@/registry/default/extension/tree-view-api";

const TreeFileTest = () => {
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
      className="rounded-md h-52 max-w-96 w-full bg-background  overflow-hidden py-1"
      initialSelectedId="21"
      elements={elements}
    >
      <Folder element="src" id="1">
        <File element="app.tsx" id="2">
          <p> app.tsx </p>
        </File>
        <Folder id="3" element="components">
          <Folder id="20" element="pages">
            <File id="21" element="interface.ts">
              <p>interface.ts</p>
            </File>
          </Folder>
        </Folder>
        <Folder id="6" element="ui">
          <File element="carousel.tsx" id="7">
            <p>carousel.tsx</p>
          </File>
        </Folder>
      </Folder>
      <CollapseButton elements={elements} />
    </Tree>
  );
};

export default TreeFileTest;
`,
  },
  {
    file: "file 2",
    content: "content 2",
  },
];

const Playground = memo(({ defaultCode, dependencies }: PlaygroundProps) => {
  const mediaQuery = useMediaQuery("(min-width: 640px)");
  const searchParams = useSearchParams();
  const monaco = useMonaco();
  const comp = searchParams.get("comp");
  const theme = searchParams.get("theme");
  const [selectedTheme, setSelectedTheme] = useState("one-dark-pro");

  useEffect(() => {
    if (!comp) return;
    const isCompExist = COMPONENTS.includes(comp);
    setComp(isCompExist ? comp : "");
  }, [comp]);

  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState(defaultCode ?? "//Type your code here");
  const [chosenFile, setChosenFile] = useState<string>("file 0");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [component, setComp] = useState<string>("");

  useEffect(() => {
    if (debouncedQuery.length === 0) setCode("");

    if (debouncedQuery.length > 0) {
      setCode(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleEditorChange = useCallback((value?: string) => {
    setQuery(value || "");
  }, []);

  const handleEditorBeforeMount = useCallback(
    (monaco: Monaco) => {
      startTransition(async () => {
        const highlighterInstance = await getHighlighter({
          themes: AVA_THEMES,
          langs: ["javascript", "typescript"],
        });
        shikiToMonaco(highlighterInstance, monaco);
        if (!theme) return;
        const isThemeExist = AVA_THEMES.includes(theme);
        setSelectedTheme(isThemeExist ? theme : "one-dark-pro");
      });
    },
    [theme]
  );

  useEffect(() => {
    if (!monaco) return;
    handleEditorBeforeMount(monaco);
  }, [monaco, handleEditorBeforeMount]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  /* const dependencies = useMemo(() => {
    const comp = Components.find((comp) => comp.title === component);
    setCode(comp?.example ?? "");
    return comp;
  }, [component]); */

  return (
    <ResizablePanelGroup
      direction={mediaQuery ? "horizontal" : "vertical"}
      className="h-[calc(100vh-2rem)] grid grid-cols-1 md:grid-cols-2 gap-1"
    >
      <ResizablePanel
        className="rounded-lg col-span-1 md:col-span-2 h-full p-1 "
        minSize={MIN_SIZE}
        defaultSize={100 - VIEW_SIZE}
      >
        <div className="rounded-lg dark:bg-vs_code bg-vs_code-foreground overflow-hidden ring-1 ring-border h-full flex flex-col">
          <div className="flex items-center justify-between gap-2 p-2 h-12 border-b border-border">
            <ProjectTree
              chosenFile={chosenFile}
              setChosenFile={setChosenFile}
            />
            <div className="flex items-center justify-end gap-2">
              <PlaygroundSearchSelector
                value={component}
                onValueChange={setComp}
                options={createArrObjFromArr(COMPONENTS)}
                placeholder="Select Component"
                noneResult="No component found."
                createQuery={createQueryString}
                comp
              />
              {isPending ? (
                <Skeleton className="w-40 h-8" />
              ) : (
                <PlaygroundSearchSelector
                  value={selectedTheme}
                  onValueChange={setSelectedTheme}
                  options={createArrObjFromArr(AVA_THEMES)}
                  placeholder="Select Theme"
                  noneResult="No theme found."
                  createQuery={createQueryString}
                  theme
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            {isPending ? (
              <EditorLoader />
            ) : (
              <Editor
                className="h-full outline-0"
                defaultLanguage="typescript"
                defaultValue={defaultCode}
                value={
                  fileContent.find((file) => file.file === chosenFile)?.content
                }
                loading={<EditorLoader />}
                theme={selectedTheme}
                onChange={handleEditorChange}
                options={{
                  fontSize: 16,
                  cursorSmoothCaretAnimation: "on",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  fontFamily: "iaw-mono-var, Consolas, Courier New , monospace",
                  fontLigatures: true,
                  lineHeight: 1.35,
                  tabSize: 1,
                  autoIndent: "keep",
                  letterSpacing: 0,
                  renderLineHighlight: "none",
                  minimap: {
                    enabled: false,
                  },
                  renderLineHighlightOnlyWhenFocus: false,
                  contextmenu: false,
                  smoothScrolling: true,
                }}
              />
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={cn("rounded-lg", mediaQuery ? "w-4 " : "!h-4 ")}
      />
      <ResizablePanel
        minSize={MIN_SIZE}
        defaultSize={VIEW_SIZE}
        className="rounded-lg col-span-1 md:col-span-2 h-full p-1 "
      >
        <div className="ring-1 rounded-lg ring-border h-full overflow-hidden bg-background relative flex flex-col">
          <div className="flex items-center justify-between gap-2 p-2 h-10 border-b border-border ">
            <div className="flex items-center gap-2">
              <Button variant={"outline"} className="h-7 text-sm">
                Share
              </Button>
              <Button variant={"outline"} className="h-7 text-sm">
                Reset
              </Button>
            </div>
          </div>
          <div className="relative flex-1 overflow-y-auto p-5">
            <LivePlaygroundPreview
              code={code.trim()}
              example={dependencies?.example?.trim()}
              dependencies={{
                Tree,
                Folder,
                File,
                CollapseButton,
              }}
            />
            {/*  <pre>{defaultCode}</pre> */}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});

Playground.displayName = "Playground";

type ProjectTreeProps = {
  chosenFile: string;
  setChosenFile: (file: string) => void;
};

const ProjectTree = ({ chosenFile, setChosenFile }: ProjectTreeProps) => {
  return (
    <div className="flex items-center ">
      {Array.from({ length: 3 }).map((_, i) => (
        <Button
          variant={"ghost"}
          key={i}
          onClick={() => {
            setChosenFile(`file ${i}`);
          }}
        >
          file {i}
        </Button>
      ))}
    </div>
  );
};

export default Playground;
