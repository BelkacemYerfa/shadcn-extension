import { TreeView } from "@/registry/default/extension/tree-view";

export default function PageExample() {
  return (
    <main className="pt-14 pb-4 max-w-xl mx-auto w-full space-y-8 ">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Page Examples</h1>
        <p>Tree view examples </p>
      </div>
      <ExampleComp />
    </main>
  );
}

const ExampleComp = () => {
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
      className="bg-background h-60"
      initialExpendedItems={["2"]}
      initialSelectedId="1.1.2"
    />
  );
};
