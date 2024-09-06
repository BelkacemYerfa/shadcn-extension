import fs from "fs";
import path from "path";

export const DEFAULT_EXTENSION_PATH = "@/components/ui/extension";

export function parseComponentsJson(cwd: string) {
  const COMPONENTS_JSON_PATH = path.join(cwd, "components.json");
  if (fs.existsSync(COMPONENTS_JSON_PATH)) {
    return JSON.parse(fs.readFileSync(COMPONENTS_JSON_PATH, "utf-8"));
  } else {
    return {};
  }
}

export function parseTsconfigJson(cwd: string) {
  const TSCONFIG_JSON_PATH = path.join(cwd, "tsconfig.json");
  if (fs.existsSync(TSCONFIG_JSON_PATH)) {
    return JSON.parse(fs.readFileSync(TSCONFIG_JSON_PATH, "utf-8"));
  } else {
    return {};
  }
}

export function hasSrcPath(cwd: string): boolean {
  try {
    const tsconfig = parseTsconfigJson(cwd);
    const paths = tsconfig.compilerOptions?.paths || {};
    return !!paths["@/*"] && paths["@/*"][0] === "./src/*";
  } catch (error) {
    console.error("Error parsing tsconfig:", error);
    return false;
  }
}

export const mkdir_components = (path: string) => {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
    }
  });
};
