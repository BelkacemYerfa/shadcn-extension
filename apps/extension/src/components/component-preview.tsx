"use client";

import * as React from "react";
import { Index } from "@/__registry__";
import { cn } from "@/lib/utils";
import { CopyButton, CopyWithClassNames } from "@/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  extractClassname?: boolean;
  extractedClassNames?: string;
  align?: "center" | "start" | "end";
}

export function ComponentPreview({
  name,
  children,
  className,
  extractClassname,
  extractedClassNames,
  align = "center",
  ...props
}: ComponentPreviewProps) {
  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[0];

  const Preview = React.useMemo(() => {
    const Component = Index["default"][name]?.component;

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component />;
  }, [name]);

  const codeString = React.useMemo(() => {
    if (typeof Code?.props["data-rehype-pretty-code-figure"] !== "undefined") {
      const [, Button] = React.Children.toArray(
        Code.props.children
      ) as React.ReactElement[];
      return Button?.props?.value || Button?.props?.__rawString__ || null;
    }
  }, [Code]);

  return (
    <div
      className={cn(
        "group relative my-4 flex flex-col space-y-2 not-prose",
        className
      )}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="preview"
          className="relative rounded-md border bg-muted/50 p-2 data-[state=active]:flex flex-col items-center justify-center w-full min-h-[20rem]"
        >
          {codeString && <CopyButton value={codeString} />}
          <React.Suspense fallback={<div className="h-full">Loading...</div>}>
            <div className="w-full max-w-sm flex items-center justify-center">
              {Preview}
            </div>
          </React.Suspense>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto overflow-hidden relative">
              {Code}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
