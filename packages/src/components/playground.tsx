"use client";

import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Monitor, Tablet } from "lucide-react";
import { MobileIcon } from "@radix-ui/react-icons";
import { EditorLoader } from "./loaders/editor-loader";
import { MultiSelectTest } from "./extension/model";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "./extension/fancy-multi-select/multi-select-api";

type PlaygroundProps = {
  defaultCode?: string;
};

const Playground = ({ defaultCode }: PlaygroundProps) => {
  const { theme } = useTheme();
  const mediaQuery = useMediaQuery("(min-width: 640px)");
  const [code, setCode] = useState(defaultCode || "//Type your code here");
  const [viewSize, setViewSize] = useState(40);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length === 0) setCode("");

    if (debouncedQuery.length > 0) {
      setCode(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleEditorChange = useCallback((value?: string) => {
    setQuery(value || "");
  }, []);

  const changeViewSize = (view: "phone" | "tablet" | "desktop") => {
    switch (view) {
      case "phone":
        setViewSize(30);
        console.log(viewSize);
        break;
      case "tablet":
        setViewSize(50);
        break;
      case "desktop":
        setViewSize(75);
        break;
      default:
        break;
    }
  };
  return (
    <ResizablePanelGroup
      direction={mediaQuery ? "horizontal" : "vertical"}
      className="h-full grid grid-cols-1 md:grid-cols-2 gap-1"
    >
      <ResizablePanel
        className="rounded-lg p-1 basis-[50%] md:basis-[60%]"
        minSize={25}
        defaultSize={100 - viewSize}
      >
        <div className="rounded-lg h-full ring-1 ring-border overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto ">
          <Editor
            className="h-full "
            defaultLanguage="javascript"
            defaultValue={code.trim()}
            loading={<EditorLoader />}
            theme={theme === "light" ? "light" : "vs-dark"}
            onChange={handleEditorChange}
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
              renderLineHighlight: "all",
              minimap: {
                enabled: false,
              },
              contextmenu: false,
              smoothScrolling: true,
            }}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={cn("rounded-lg", mediaQuery ? "w-4 " : "!h-4 ")}
      />
      <ResizablePanel
        minSize={25}
        defaultSize={viewSize}
        className="rounded-lg p-1 basis-[50%] md:basis-[40%]"
      >
        <div className="rounded-lg ring-1 ring-border h-full overflow-hidden bg-background relative size-full ">
          <div className="flex items-center justify-between gap-2 p-2 h-10 border-b border-border ">
            <div className="flex items-center gap-2">
              <Button variant={"outline"} className="h-7 text-sm">
                Share
              </Button>
              <Button variant={"outline"} className="h-7 text-sm">
                Reset
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size={"icon"}
                variant={"outline"}
                className="size-7"
                onClick={() => setViewSize(70)}
              >
                <MobileIcon className="size-4" />
                <span className="sr-only">phone view</span>
              </Button>
              <Button
                size={"icon"}
                variant={"outline"}
                className="size-7"
                onClick={() => changeViewSize("tablet")}
              >
                <Tablet className="size-4" />
                <span className="sr-only">phone view</span>
              </Button>
              <Button
                size={"icon"}
                variant={"outline"}
                className="size-7"
                onClick={() => changeViewSize("desktop")}
              >
                <Monitor className="size-4" />
                <span className="sr-only">phone view</span>
              </Button>
            </div>
          </div>
          <div className="relative max-h-[calc(100vh-7rem)] overflow-y-auto size-full p-5">
            <LiveProvider
              code={code}
              scope={{
                MultiSelectTest,
              }}
            >
              <div className="text-destructive text-center font-bold">
                <LiveError />
              </div>
              <LivePreview />
            </LiveProvider>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const Test = () => {
  return <MultiSelectTest />;
};

export default Playground;
