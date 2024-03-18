import {
  TreeViewElement,
  Tree,
  Folder,
  File,
  CollapseButton,
} from "@/registry/default/extension/tree-view-api";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { forwardRef } from "react";

type TocProps = {
  toc: TreeViewElement[];
};

export const Toc = ({ toc }: TocProps) => {
  return (
    <Tree
      className="h-fit "
      indicator={false}
      elements={toc}
      openIcon={<ChevronDown className="size-4" />}
      closeIcon={<ChevronRight className="size-4" />}
    >
      {toc.map((item) => (
        <TreeItem key={item.id} elements={[item]} />
      ))}
      <CollapseButton elements={toc} expandAll />
    </Tree>
  );
};

const TreeItem = forwardRef<
  HTMLUListElement,
  {
    elements?: TreeViewElement[] | TreeViewElement;
  } & React.HTMLAttributes<HTMLUListElement>
>(({ className, elements, ...props }, ref) => {
  return (
    <ul ref={ref} className="w-full space-y-2" {...props}>
      {elements instanceof Array ? (
        elements.map((element) => (
          <li key={element.id} className="w-full space-y-2">
            {element.children && element.children?.length > 0 ? (
              <Folder
                element={element.name}
                isSelectable={element.isSelectable}
              >
                <TreeItem
                  key={element.id}
                  aria-label={`folder ${element.name}`}
                  elements={element.children}
                />
              </Folder>
            ) : (
              <File
                aria-label={`File ${element.name}`}
                key={element.id}
                element={element.name}
                isSelectable={element.isSelectable}
                className="px-1"
                fileIcon={<Circle className="size-2" />}
              >
                <a href={element.id} className="ml-1">
                  {element?.name}
                </a>
              </File>
            )}
          </li>
        ))
      ) : (
        <li className="px-1">
          <File
            aria-label={`file ${elements?.name}`}
            element={elements?.name ?? " "}
            isSelectable={elements?.isSelectable}
          >
            <span>{elements?.name}</span>
          </File>
        </li>
      )}
    </ul>
  );
});

TreeItem.displayName = "TreeItem";
