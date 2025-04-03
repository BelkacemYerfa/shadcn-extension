import {
  Tree,
  TreeViewElement,
  File,
  Folder,
  CollapseButton,
} from "@/registry/default/extension/tree-view-api";

type TOCProps = {
  toc: TreeViewElement[];
};

const TOC = ({ toc }: TOCProps) => {
  return (
    <Tree className="w-full h-60 bg-background p-2 rounded-md" indicator={true}>
      {toc.map((element, _) => (
        <TreeItem key={element.id} elements={[element]} />
      ))}
      <CollapseButton elements={toc} expandAll={true} />
    </Tree>
  );
};

type TreeItemProps = {
  elements: TreeViewElement[];
};

export const TreeItem = ({ elements }: TreeItemProps) => {
  return (
    <ul className="w-full space-y-1">
      {elements.map((element) => (
        <li key={element.id} className="w-full space-y-2">
          {element.children && element.children?.length > 0 ? (
            <Folder
              element={element.name}
              value={element.id}
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
              key={element.id}
              value={element.id}
              isSelectable={element.isSelectable}
            >
              <span>{element?.name}</span>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
};

const TOCWrapper = () => {
  const toc = [
    {
      id: "1",
      name: "components",
      children: [
        {
          id: "2",
          name: "extension",
          children: [
            {
              id: "3",
              name: "tree-view.tsx",
            },
            {
              id: "4",
              name: "tree-view-api.tsx",
            },
          ],
        },
        {
          id: "5",
          name: "dashboard-tree.tsx",
        },
      ],
    },
    {
      id: "6",
      name: "pages",
      children: [
        {
          id: "7",
          name: "page.tsx",
        },
        {
          id: "8",
          name: "page-guide.tsx",
        },
      ],
    },
    {
      id: "18",
      name: "env.ts",
    },
  ];
  return <TOC toc={toc} />;
};

export default TOCWrapper;
