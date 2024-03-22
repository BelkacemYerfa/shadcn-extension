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

type PlaygroundProps = {
  defaultCode?: string;
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

const highlighter = async () => {
  return await getHighlighter({
    themes: AVA_THEMES,
    langs: ["javascript", "typescript"],
  });
};

const Playground = memo(({ defaultCode }: PlaygroundProps) => {
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

  const dependencies = useMemo(() => {
    const comp = Components.find((comp) => comp.title === component);
    setCode(comp?.example ?? "");
    return comp;
  }, [component]);

  return (
    <ResizablePanelGroup
      direction={mediaQuery ? "horizontal" : "vertical"}
      className="h-full grid grid-cols-1 md:grid-cols-2 gap-1"
    >
      <ResizablePanel
        className="rounded-lg col-span-1 md:col-span-2 h-full p-1 "
        minSize={MIN_SIZE}
        defaultSize={100 - VIEW_SIZE}
      >
        <div className="rounded-lg dark:bg-vs_code bg-vs_code-foreground overflow-hidden ring-1 ring-border h-full flex flex-col">
          <div className="flex items-center justify-end gap-2 p-2 h-12 border-b border-border">
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
          <div className="flex-1">
            {isPending ? (
              <EditorLoader />
            ) : (
              <Editor
                className="h-full outline-0"
                defaultLanguage="javascript"
                defaultValue={defaultCode}
                value={dependencies?.example?.trim() ?? code.trim()}
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
              dependencies={dependencies?.dependencies}
            />
            {/*  <pre>{defaultCode}</pre> */}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});

Playground.displayName = "Playground";

export default Playground;
