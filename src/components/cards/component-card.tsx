"use client";

import { Index } from "@/__registry__";
import { styles } from "@/registry/styles";
import { Card, CardContent, CardTitle } from "@ui/card";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useMemo } from "react";

type ComponentCardProps = {
  name: string;
};

export const ComponentCard = ({ name }: ComponentCardProps) => {
  const Preview = useMemo(() => {
    const Component = Index[styles[0].name][name]?.component;

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            button
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component />;
  }, [name]);

  const componentName = name.replace("demo", "").split("-").join(" ");

  return (
    <Card className="space-y-2 border-0 shadow-none">
      <CardTitle>
        <Link
          href={`/docs/${componentName
            .trim()
            .toLowerCase()
            .split(" ")
            .join("-")}`}
          className="group text-muted-foreground group hover:text-foreground/90 duration-200 transition-colors flex items-center gap-2"
        >
          <span className="capitalize ">{componentName}</span>
          <MoveRight className="size-4 group-hover:translate-x-1 duration-200 transition-transform" />
        </Link>
      </CardTitle>
      <CardContent className="relative h-60 dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] rounded-md p-3 flex items-center justify-center ring-1 ring-border overflow-hidden w-full">
        <FocusArea />
        <div className="mx-auto scale-75 w-full ">{Preview}</div>
      </CardContent>
    </Card>
  );
};

const FocusArea = () => {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
  );
};
