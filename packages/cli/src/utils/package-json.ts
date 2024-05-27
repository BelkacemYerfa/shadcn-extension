import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageJson } from "type-fest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const packageJSON = {
  getContent() {
    const packageJsonPath = path.resolve(__dirname, "../", "package.json");
    const packageJsonContent = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    ) as PackageJson;
    return packageJsonContent;
  },

  /**
   * Get package version.
   */
  get version() {
    const packageJsonContent = this.getContent();
    const { version } = packageJsonContent;
    return version || "0.0.0";
  },
};
