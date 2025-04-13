import { z } from "zod";

export const registryItemTypeSchema = z.enum([
  "components:extension",
  "components:demo",
  "components:example",
]);

export const registryItemFileSchema = z.discriminatedUnion("type", [
  // Target is required for registry:file and registry:page
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: z.enum(["registry:file", "registry:page"]),
    target: z.string(),
  }),
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema,
    target: z.string().optional(),
  }),
]);

export const registrySchema = z.array(
  z.object({
    name: z.string(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    uiDependencies: z.array(z.string()).optional(),
    files: z.array(registryItemFileSchema),
    type: registryItemTypeSchema,
    meta: z.record(z.string(), z.any()).optional(),
    docs: z.string().optional(),
    categories: z.array(z.string()).optional(),
  }),
);

export type Registry = z.infer<typeof registrySchema>;

export const registryItemTailwindSchema = z.object({
  config: z
    .object({
      content: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
      plugins: z.array(z.string()).optional(),
    })
    .optional(),
});
