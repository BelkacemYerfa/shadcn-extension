"use client";

import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { EditorLoader } from "../loaders/editor-loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getHighlighter } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { editorComponentsConfig as Components } from "@/lib/editor-comp";
import { LivePlaygroundPreview } from "./playground-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { PlaygroundSearchSelector } from "../drop-downs/search-selector";

type PlaygroundProps = {
  defaultCode?: string;
};

const VIEW_SIZE = 40;
const MIN_SIZE = 25;
const AVA_THEMES = ["one-dark-pro", "github-light", "github-dark"];
const THEMES = [...AVA_THEMES, "light", "vs-dark"];
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
  const { theme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(
    theme === "light" ? "light" : "vs-dark"
  );
  const monaco = useMonaco();
  const mediaQuery = useMediaQuery("(min-width: 640px)");
  const [code, setCode] = useState(defaultCode || "//Type your code here");
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

  const handleEditorBeforeMount = async (monaco: Monaco) => {
    const highlighterInstance = await highlighter();
    shikiToMonaco(highlighterInstance, monaco);
  };

  useEffect(() => {
    if (monaco) {
      handleEditorBeforeMount(monaco);
    }
  }, [monaco]);

  const dependencies = useMemo(() => {
    return Components.find((comp) => comp.title === component);
  }, [component]);
  console.log("dependencies", dependencies);
  return (
    <ResizablePanelGroup
      direction={mediaQuery ? "horizontal" : "vertical"}
      className="h-full grid grid-cols-1 md:grid-cols-2 gap-1"
    >
      <ResizablePanel
        className="rounded-lg basis-1/2 md:basis-[60%] h-full p-1 "
        minSize={MIN_SIZE}
        defaultSize={100 - VIEW_SIZE}
      >
        <div className="rounded-lg dark:bg-vs_code bg-vs_code-foreground overflow-hidden ring-1 ring-border h-full">
          <div className="flex items-center justify-end gap-2 p-2 h-12 border-b border-border">
            <PlaygroundSearchSelector
              value={component}
              onValueChange={setComp}
              options={createArrObjFromArr(COMPONENTS)}
              placeholder="Select Component"
              noneResult="No component found."
            />
            <PlaygroundSearchSelector
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              options={createArrObjFromArr(THEMES)}
              placeholder="Select Theme"
              noneResult="No theme found."
            />
          </div>
          <div className="h-full max-h-[calc(100vh-7rem)]">
            <Editor
              className="h-full outline-0"
              defaultLanguage="javascript"
              defaultValue={code.trim()}
              value={dependencies?.example?.trim() ?? code.trim()}
              loading={<EditorLoader />}
              theme={selectedTheme}
              onChange={handleEditorChange}
              beforeMount={handleEditorBeforeMount}
              options={{
                fontSize: 16,
                cursorSmoothCaretAnimation: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                fontFamily: "iaw-mono-var, Consolas, Courier New , monospace",
                fontLigatures: true,
                lineHeight: 1.35,
                tabSize: 2,
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
        className="rounded-lg p-1 basis-1/2 md:basis-[40%]"
      >
        <div className="ring-1 rounded-lg ring-border h-full overflow-hidden bg-background relative size-full ">
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
          <div className="relative max-h-[calc(100vh-7rem)] overflow-y-auto size-full p-5">
            <LivePlaygroundPreview
              code={code.trim()}
              example={dependencies?.example?.trim()}
              dependencies={dependencies?.dependencies}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});

Playground.displayName = "Playground";

export default Playground;
