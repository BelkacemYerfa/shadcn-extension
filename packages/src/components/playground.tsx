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

const Playground = () => {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const mediaQuery = useMediaQuery("(min-width: 640px)");
  useEffect(() => {
    if (debouncedQuery.length === 0) setCode("");

    if (debouncedQuery.length > 0) {
      startTransition(async () => {
        setCode(debouncedQuery);
      });
    }
  }, [debouncedQuery]);

  const handleEditorChange = useCallback((value?: string) => {
    setQuery(value || "");
  }, []);

  return (
    <ResizablePanelGroup
      direction={mediaQuery ? "horizontal" : "vertical"}
      className="h-full grid grid-cols-1 md:grid-cols-2 gap-1"
    >
      <ResizablePanel className="rounded-lg p-1" minSize={25}>
        <div className="rounded-lg h-full overflow-hidden">
          <Editor
            className="h-full "
            defaultLanguage="javascript"
            defaultValue={code.trim()}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              cursorSmoothCaretAnimation: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              fontFamily: "iaw-mono-var, Consolas, Courier New , monospace",
              fontFeatureSettings: "liga",
              fontLigatures: true,
              lineHeight: 1.35,
              tabSize: 2,
              autoIndent: true,
              letterSpacing: 0,
              renderLineHighlight: "onlyWhenFocus",
              minimap: {
                enabled: false,
              },
              contextmenu: false,
              smoothScrolling: true,
              stickyScroll: true,
            }}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={cn("rounded-lg", mediaQuery ? "w-4" : "h-4")}
      />
      <ResizablePanel minSize={25} className="rounded-lg p-1">
        <div className="rounded-lg ring-[0.5px] ring-muted-foreground h-full overflow-hidden ">
          <LiveProvider code={code} scope={{ Test }}>
            <LivePreview />
          </LiveProvider>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const Test = () => {
  return <div>Test</div>;
};

export default Playground;
