import { z } from "zod";

export const registryItemSchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  uiDependencies: z.array(z.string()).optional(),
  fileDependencies:z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  type: z.enum(["components:demo", "components:extension", "components:example" , "components:library"]),
});

export const registryIndexSchema = z.array(registryItemSchema);

export type Registry = z.infer<typeof registryIndexSchema>;

export const registryItemWithContentSchema = registryItemSchema.extend({
  files: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    })
  ),
});

export const registryWithContentSchema = z.array(registryItemWithContentSchema);
