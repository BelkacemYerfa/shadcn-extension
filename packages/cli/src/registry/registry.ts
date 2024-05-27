import { Registry } from "@/registry/schema";
import { ui } from "@/registry/ui";

// Exporting the registry directly from the `ui` file
export const registry: Registry = [...ui];
