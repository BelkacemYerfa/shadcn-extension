#!/usr/bin/env node
import {
  COMPONENTS_JSON_PATH,
  DEFAULT_TRNSPRNCY_PATH,
  componentPath,
  parseComponentsJson,
} from "@/utils/get-json.js";
import { renderTitle } from "@/utils/render-title.js";
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import ora from "ora";
import path from "path";
import prompt from "prompts";
import * as semver from "semver";

const highlights = {
  info: (text: string) => chalk.blueBright(text),
  success: (text: string) => chalk.greenBright(text),
  error: (text: string) => chalk.redBright(text),
  warning: (text: string) => chalk.yellowBright(text),
};

const ALIAS_EXAMPLE = `
  this alias will be added to your ${highlights.success("components.json")} file

    ${highlights.info(
      `"aliases": {
        "trnsprncy": "@/components/ui/trnsprncy"
      }`
    )}
`;

const prompts = {
  greet: "Hello, There! Fellow frontend Fanatic!",
  missingPackages: "This project does not meet the minimum requirements:",
  outdatedPackages: "This project does not meet the minimum requirements:",
  noDependencies: `No dependencies found in ${highlights.success(
    "package.json"
  )} file.`,
  meetsRequirements: "This project meets the minimum requirements!",
  writeConfiguration: `Adding configuration alias to ${highlights.success(
    "components.json"
  )}.${ALIAS_EXAMPLE}  Proceed?`,
  configurationWritten: `Configuration written to ${highlights.success(
    "components.json"
  )}.`,
  operationAborted: `${highlights.error(
    "Operation aborted. Configuration not saved."
  )}`,
  componentsFileNotChanged: "Components file will not be changed.",
  shadcnRequired: `shadcn ${highlights.success(
    "components.json"
  )} file in your project root is required before running this command`,
};

const isInitialized = () => {
  const componentsJson = parseComponentsJson();
  if (!componentsJson?.aliases) {
    ora(prompts.shadcnRequired).fail();
    process.exit(1);
  }
  return !!componentsJson.aliases?.trnsprncy;
};

export const init = new Command()
  .name("init")
  .description(prompts.greet)
  .action(() => {
    renderTitle("Initializing:");
    if (isInitialized()) {
      ora(
        `trnsprncy alias already exists in ${highlights.success(
          "components.json"
        )}`
      ).fail();
      process.exit(1);
    }
    checkRequiredPackages()
      .then((result: PackageCheckResult) => {
        if (
          !!result.missingPackages.length ||
          !!result.outdatedPackages.length
        ) {
          // handle missing or outdated packages and exit after printing the error
          ora(highlights.error(prompts.missingPackages)).fail();
          console.log("Minimum Requirements:");
          if (result.missingPackages.length > 0) {
            console.log("→ " + result.missingPackages.join("\n"));
          }
          if (result.outdatedPackages.length > 0) {
            result.outdatedPackages.forEach((pkg) => {
              console.log(
                "→ " +
                  `${pkg.packageName}: installed ${pkg.installedVersion}, required ${pkg.requiredVersion}`
              );
            });
          }
          process.exit(1);
        } else {
          ora(prompts.meetsRequirements).succeed();
          config();
        }
      })
      .catch((error) => {
        ora(`Error checking required packages: ${error}`).fail();
      });
  });

/**
 * Removes any non-numeric characters from the version string and returns the normalized version string.
 * For example, "1.2.3" from "^1.2.3" or "1.2.3" from "~1.2.3".
 * or "1.2.3" from ">=1.2.3" or "1.2.3" from "<=1.2.3". etc.
 *
 * @param {string} version
 * @return {*}  {string}
 */
const normalizeVersion = (version: string) => {
  // Check if the version contains only major version (e.g., '^18')
  if (/^\^\d+$/.test(version)) {
    version = version + ".0.0"; // Append '.0.0' to indicate minor and patch versions
  }
  return version.replace(/[^0-9.]/g, ""); // Replace all characters except digits and dot
};
interface PackageCheckResult {
  missingPackages: string[];
  outdatedPackages: {
    packageName: string;
    installedVersion: string;
    requiredVersion: string;
  }[];
}

const REQUIRED_PACKAGES = {
  next: "^14.0.1",
  // react: "^18.6.0",
  // tailwindcss: "^3.0.0",
};

/**
 * Loads the dependencies from the package.json file and returns them as an array of strings.
 * The dependencies are normalized to the actual version number.
 * For example, "^13.6.0" becomes "13.6.0".
 *
 * @return {*}  {Promise<string[]>}
 */
async function loadDependencies(): Promise<Record<string, string>> {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (!Object.keys(packageJson.dependencies)?.length) {
    // technically this may not be necessary as the for-in loop below will not run if the dependencies object is empty.
    // but it's better to be safe than sorry for now.
    return {};
  }
  for (const dependency in packageJson.dependencies) {
    // @NOTE: If semver is being used to check versions it is able to handle the version string normalization.
    // packageJson.dependencies[dependency] = normalizeVersion(
    //   packageJson.dependencies[dependency]
    // );
    packageJson.dependencies[dependency] = normalizeVersion(
      packageJson.dependencies[dependency]
    );
  }
  return packageJson.dependencies;
}

async function config() {
  const { confirmation } = await prompt({
    type: "toggle",
    name: "confirmation",
    message: prompts.writeConfiguration,
    initial: true,
    active: "yes",
    inactive: "no",
  });
  if (confirmation) {
    if (!fs.existsSync(COMPONENTS_JSON_PATH)) {
      // technically this may not be necessary. as the isInitialized fn will check if the file exists.
      ora(prompts.shadcnRequired).fail();
      process.exit(1);
    }
    const componentsJson = parseComponentsJson();

    // Create trnsprncy alias
    componentsJson.aliases.trnsprncy = DEFAULT_TRNSPRNCY_PATH;

    fs.writeFileSync(
      COMPONENTS_JSON_PATH,
      JSON.stringify(componentsJson, null, 2)
    );



    if (!fs.existsSync(componentPath)) {
      fs.mkdirSync(componentPath, { recursive: true });
    }

    console.log(componentPath)
    
    const filePath = path.join(componentPath, ".gitkeep");
    fs.writeFile(filePath, "", (err) => {
      if (err) {
        console.error('Error writing file:', err);
      }
    });

    ora(prompts.configurationWritten).succeed();
  } else {
    ora(prompts.operationAborted).fail();
  }
}

/**
 * Checks if the required packages are installed and up to date.
 * Returns an object with missing packages and outdated packages.
 * The missing packages are an array of strings.
 *
 * @return {*}  {Promise<PackageCheckResult>}
 */
async function checkRequiredPackages(): Promise<PackageCheckResult> {
  const dependencies = await loadDependencies();
  if (!Object.keys(dependencies)?.length) {
    ora(prompts.noDependencies).fail();
    return {
      // if there are no dependencies, then all the required packages are missing.
      missingPackages: Object.keys(REQUIRED_PACKAGES),
      outdatedPackages: [],
    };
  }

  const missingPackages: string[] = [];

  const outdatedPackages: {
    packageName: string;
    installedVersion: string;
    requiredVersion: string;
  }[] = [];

  ora("checking for required packages...").succeed();
  for (const packageName in REQUIRED_PACKAGES) {
    const dependency = dependencies[packageName];
    if (!dependency) {
      missingPackages.push(packageName);
    } else {
      // we only need to normalize this version. And not the installed version or dependency values.
      const requiredVersion: string = normalizeVersion(
        REQUIRED_PACKAGES[packageName as keyof typeof REQUIRED_PACKAGES]
      );
      const installedVersion: string | undefined = dependency;

      if (!installedVersion) {
        // @TODO: @Raphael-08 -- can we handle this error?
        // what should we do if the installed version is not found?
        // I assume that means the package is not installed.
        missingPackages.push(packageName);
      }

      if (
        !semver.satisfies(installedVersion, requiredVersion) &&
        semver.lt(installedVersion, requiredVersion)
      ) {
        outdatedPackages.push({
          packageName,
          installedVersion,
          requiredVersion,
        });
      }
    }
  }

  return { missingPackages, outdatedPackages };
}
