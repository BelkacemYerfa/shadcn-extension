import { defineCollection, defineConfig } from "@content-collections/core";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { codeImport } from "remark-code-import";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { rehypeComponent } from "./src/lib/rehype-component";
import { rehypeNpmCommand } from "./src/lib/rehype-installation-command";
import { z } from "zod";

const LinksProperties = z.object({
  url: z.string(),
  title: z.string(),
});

export const Doc = defineCollection({
  name: "Doc",
  directory: `content/docs`,
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string().min(1),
    description: z.string().min(1),
    published: z.boolean({}).optional(),
    links: z.array(LinksProperties).optional(),
    toc: z.boolean().default(true),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [codeImport, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeComponent,
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;
              if (codeEl.tagName !== "code") {
                return;
              }
              if (codeEl.data?.meta) {
                // Extract event from meta and pass it down the tree.
                const regex = /event="([^"]*)"/;
                const match = codeEl.data?.meta.match(regex);
                if (match) {
                  node.__event__ = match ? match[1] : null;
                  codeEl.data.meta = codeEl.data.meta.replace(regex, "");
                }
              }
              node.__rawString__ = codeEl.children?.[0].value;
              node.__src__ = node.properties?.__src__;
              node.__style__ = node.properties?.__style__;
            }
          });
        },
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "figure") {
              if (!("data-rehype-pretty-code-figure" in node.properties)) {
                return;
              }

              const preElement = node.children.at(-1);
              if (preElement.tagName !== "pre") {
                return;
              }

              preElement.properties["__withMeta__"] =
                node.children.at(0).tagName === "div";
              preElement.properties["__rawString__"] = node.__rawString__;

              if (node.__src__) {
                preElement.properties["__src__"] = node.__src__;
              }

              if (node.__event__) {
                preElement.properties["__event__"] = node.__event__;
              }

              if (node.__style__) {
                preElement.properties["__style__"] = node.__style__;
              }
            }
          });
        },
        rehypeNpmCommand,
        [
          rehypePrettyCode,
          {
            theme: "one-dark-pro",
          },
        ],
      ],
    });
    return {
      ...document,
      slug: `${document._meta.fileName}`,
      slugAsParams: document._meta.fileName,
      body: {
        raw: document.content,
        code: body,
      },
    };
  },
});

export default defineConfig({
  collections: [Doc],
});
