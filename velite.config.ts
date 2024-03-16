import { defineConfig, s } from "velite";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

export default defineConfig({
  collections: {
    docs: {
      name: "docs", // collection type name
      pattern: "docs/**/*.mdx", // content files glob pattern
      schema: s
        .object({
          slug: s.path(),
          title: s.string().max(99),
          description: s.string().max(999).optional(),
          date: s.isodate(),
          published: s.boolean().default(true),
          featured: s.boolean().default(false),
          toc: s.toc(),
          body: s.mdx(),
        })
        // more additional fields (computed fields)
        .transform(computedFields),
    },
  },
});
