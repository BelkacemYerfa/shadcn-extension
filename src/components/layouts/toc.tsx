"use client";

import { siteConfig } from "@/config/site-config";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import {
  TreeViewElement,
  Tree,
  Folder,
  File,
  CollapseButton,
} from "@/registry/default/extension/tree-view-api";
import { ChevronDown, ChevronRight, Circle, MoveRight } from "lucide-react";
import Link from "next/link";
import React, { forwardRef } from "react";

type TocProps = {
  toc: TreeViewElement[];
  slug: string;
};

export const DocMainTOC = ({ toc, slug }: TocProps) => {
  return (
    <div className="flex flex-col space-y-2 ml-4 ">
      <Toc toc={toc} />
      <div className="h-px w-full bg-border" />
      <div className="flex flex-col space-y-1.5 px-3">
        <h2 className="text-sm text-foreground sm:text-base font-semibold ">
          Github
        </h2>
        <div className="flex flex-col space-y-1">
          <Link
            target="_blank"
            href={`${siteConfig.links.github.toString()}/issues/new?title=Feedback`}
            className="text-sm group text-muted-foreground group hover:text-foreground/90 duration-200 transition-colors flex items-center gap-2"
          >
            <span>Questions? Give us feedback</span>
            <MoveRight className="size-4 group-hover:translate-x-1 duration-200 transition-transform" />
          </Link>
          <Link
            target="_blank"
            href={`${siteConfig.links.github.toString()}/tree/master/content${slug}.mdx`}
            className="text-sm text-muted-foreground hover:text-foreground/90 duration-200 transition-colors "
          >
            Edit this page
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Toc = ({ toc }: { toc: TreeViewElement[] }) => {
  const items = React.useMemo(
    () =>
      toc
        .flatMap((item) => [item.id, item?.children?.map((item) => item.id)])
        .flat()
        .filter(Boolean)
        .map((id) => id?.split("#")[1])
        .filter((value): value is string => typeof value === "string"),
    [toc]
  );

  const activeId = useActiveSection(items);

  return (
    <div className="flex-1 space-y-2">
      <h2 className="text-sm text-foreground sm:text-base font-semibold px-2">
        Table of Content
      </h2>
      <Tree
        className="h-full p-0"
        indicator={false}
        elements={toc}
        openIcon={<ChevronDown className="size-4" />}
        closeIcon={<ChevronRight className="size-4" />}
      >
        {toc.map((item) => (
          <TreeItem key={item.id} elements={[item]} activeItem={activeId} />
        ))}
        <CollapseButton elements={toc} expandAll />
      </Tree>
    </div>
  );
};

const TreeItem = forwardRef<
  HTMLUListElement,
  {
    elements: TreeViewElement[];
    activeItem?: string;
  } & React.HTMLAttributes<HTMLUListElement>
>(({ className, elements, activeItem, ...props }, ref) => {
  return (
    <ul ref={ref} className="w-full space-y-1" {...props}>
      {elements.map((element) => (
        <li key={element.id} className="w-full space-y-2">
          {element.children && element.children?.length > 0 ? (
            <Folder
              element={element.name}
              value={element.id}
              isSelectable={element.isSelectable}
              isSelect={activeItem === element.id.split("#")[1]}
              className="px-px pr-1"
            >
              <TreeItem
                key={element.id}
                aria-label={`folder ${element.name}`}
                elements={element.children}
                activeItem={activeItem}
              />
            </Folder>
          ) : (
            <File
              aria-label={`item ${element.name}`}
              key={element.id}
              value={element.id}
              isSelectable={element.isSelectable}
              isSelect={activeItem === element.id.split("#")[1]}
              className={"px-1"}
              fileIcon={<Circle className="size-2" />}
            >
              <a href={element.id} className="ml-1">
                {element?.name}
              </a>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
});

TreeItem.displayName = "TreeItem";
