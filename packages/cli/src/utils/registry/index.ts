import { registryIndexSchema, Registry } from "@/registry/schema";
import { decide, hasSrcPath } from "@/utils/get-json";
import fs from "fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import path from "path";
import { z } from "zod";

const GithubUrl = "https://raw.githubusercontent.com/trnsprncy/ui/main";
const baseUrl =
  process.env.COMPONENTS_REGISTRY_URL ?? "https://trnsprncy.vercel.app";
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined;

/**
 * Responsible for fetching the bundled registry
 *
 * @export
 * @return {*}
 */

export async function fetchRegistry() {
  try {
    const response = await fetch(`${baseUrl}/registry/index.json`, {
      agent,
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch registry from ${baseUrl}.`);
  }
}

/**
 * Retrieves component information from the component registry based on the provided component names.
 *
 * @export
 * @param componentName - An array of component names to retrieve information for.
 * @returns An array of component objects matching the provided component names.
 */
export async function getComponentInfo(componentName: string[] | undefined) {

  const componentRegistry = registryIndexSchema.parse(await fetchRegistry());

  const addedComponents = new Set<string>(componentName); // Set to store added component names

  if (!componentName) {
    console.log("No components selected");
    process.exit(1);
  }

  const tree: z.infer<typeof registryIndexSchema> = [];

  for (const name of componentName) {
    const component = componentRegistry.find(
      (component: { name: string }) => component.name === name
    );

    if (!component) {
      console.log(`Component ${name} not found in registry`);
      continue;
    }

    tree.push(component);

    if (component.registryDependencies) {
      const dependencies = await getComponentInfo(
        component.registryDependencies
      );
      for (const dependency of dependencies) {
        if (addedComponents.has(dependency.name)) {
          continue;
        }
        tree.push(...dependencies);
      }
    }
  }

  return tree;
}

/**
 * gets paths from registry components
 *
 * @export
 * @param {Registry} components
 * @return {*}
 */
export function getPaths(components: Registry) {
  const pathArray: string[] = components.map((obj) => obj.files).flat();
  return pathArray;
}
/**
 *
 * fetches raw files from github using the paths provided from registry
 * @export
 * @param {string[]} paths
 * @return {*}  {Promise<{ filenames: string[], contents: string[] }>}
 */
export async function fetchFileContentFromGithub(
  paths: string[]
): Promise<{ filenames: string[]; contents: string[] }> {
  try {
    const filenames: string[] = [];
    const contents: string[] = [];

    for (const path of paths) {
      const rawUrl = `${GithubUrl}/packages/site/src/registry/alpha/${path}`;

      //getting the filename index from path
      const secondSlashIndex = path.indexOf("/", path.indexOf("/") + 1);
      //getting the filename from the above index
      const filename = path.substring(secondSlashIndex);

      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch file '${path}': ${response.statusText}`
        );
      }

      const content = await response.text();
      filenames.push(filename);
      contents.push(content);
    }
    return { filenames, contents };
  } catch (error) {
    console.error("Error fetching files from GitHub:", error);
    throw error;
  }
}
/**
 * creates files in the user project to copy the files!
 *
 * @export
 * @param {string[]} fileNames
 * @param {string[]} contents
 * @return {*}  {void}
 */
export function createFiles(fileNames: string[], contents: string[]): void {
  const srcPath = hasSrcPath() ? "true" : "false";
  const basePath = decide[srcPath];

  if (fileNames.length !== contents.length) {
    console.error("Number of file names and contents must be equal");
    return;
  }

  try {
    fileNames.forEach((fileName, index) => {
      const finalPath = path.join(basePath, fileName);
      if (!fs.existsSync(finalPath)) {
        const filePath = finalPath;
        fs.writeFileSync(filePath, contents[index], "utf8");
      }
    });
  } catch (err) {
    console.error("Error creating files:", err);
  }
}
