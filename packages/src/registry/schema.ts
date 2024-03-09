import { z } from "zod";

export const registrySchema = z.array(
  z.object({
    name: z.string(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    files: z.array(z.string()),
    type: z.enum(["components:extension", "components:example"]),
  })
);

export type Registry = z.infer<typeof registrySchema>;
