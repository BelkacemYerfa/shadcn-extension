// @ts-nocheck
// TODO: I'll fix this later.

import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { TreeViewElement } from "@/registry/default/extension/tree-view-api";

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

function flattenNode(node) {
  const p = [];
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return;
    p.push(node.value);
  });
  return p.join(``);
}

function getItems(node, current): TreeViewElement[] {
  if (!node) {
    return {};
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        current.id = item.url;
        current.name = flattenNode(node);
        current.isSelectable = true;
      }

      if (item.type === "text") {
        current.name = flattenNode(node);
        current.isSelectable = true;
      }
    });

    return current;
  }

  if (node.type === "list") {
    current.children = node.children.map((i) => getItems(i, {}));

    return current;
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], {});

    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node, file) => {
  const table = toc(node);
  const items = getItems(table.map, {});

  file.data = items;
};

export type TableOfContents = TreeViewElement;

export async function getTableOfContents(
  content: string
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);

  return result.data;
}
