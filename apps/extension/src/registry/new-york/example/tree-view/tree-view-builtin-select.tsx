import { TreeView } from "@/registry/new-york/extension/tree-view";

const TreeViewBuiltinSelect = () => {
  const elements = [
    {
      id: "1",
      name: "Element 1",
      children: [
        {
          id: "1.1",
          name: "Element 1.1",
          children: [
            {
              id: "1.1.1",
              name: "Element 1.1.1",
            },
            {
              id: "1.1.2",
              name: "Element 1.1.2",
            },
          ],
        },
        {
          id: "1.2",
          name: "Element 1.2",
        },
      ],
    },
    {
      id: "2",
      name: "Element 2",
      children: [
        {
          id: "2.1",
          name: "Element 2.1",
          children: [
            {
              id: "2.1.1",
              name: "Element 2.1.1",
            },
            {
              id: "2.1.2",
              name: "Element 2.1.2",
            },
          ],
        },
        {
          id: "2.2",
          name: "Element 2.2",
        },
      ],
    },
    {
      id: "3",
      name: "Element 3",
    },
  ];

  return (
    <TreeView
      elements={elements}
      initialExpendedItems={["2"]}
      initialSelectedId="1.1.2"
    />
  );
};

export default TreeViewBuiltinSelect;
