import { Registry } from "@/registry/schema";
import { registryIndexSchema } from "@/registry/schema";
import { componentPath } from "@/utils/get-json";
import { getPackageManager } from "@/utils/get-package-manager";
import {
  fetchRegistry,
  getComponentInfo,
  fetchFileContentFromGithub,
  createFiles,
} from "@/utils/registry/index";
import chalk from "chalk";
import { Command } from "commander";
import { execa } from "execa";
import fs from "fs";
import ora from "ora";
import path from "path";
import prompts from "prompts";
import { z } from "zod";

const highlights = {
  info: (text: string) => chalk.cyan.underline(text),
  success: (text: string) => chalk.greenBright(text),
  error: (text: string) => chalk.redBright(text),
  warning: (text: string) => chalk.yellowBright(text),
};

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string().optional(),
});

export const add = new Command()
  .name("add")
  .description("Prints a greeting message")
  .argument("[components...]", "the components to add")
  .option("-y, --yes", "skip confirmation prompt.", true)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available components", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .action(async (components, opts) => {
    const options = addOptionsSchema.parse({ components, ...opts });

    const cwd = path.resolve(options.cwd);

    const registryIndex: Registry = registryIndexSchema.parse(
      await fetchRegistry()
    );

    let selectedComponents = options.all
      ? registryIndex.map((entry) => entry.name)
      : options.components;

    if (!options.components?.length) {
      // validate command arguments
      const { components } = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which components would you like to add?",
        hint: "Space to select. A to toggle all. Enter to submit.",
        instructions: false,
        choices: registryIndex.map((entry) => ({
          title: entry.name,
          value: entry.name,
          selected: options.all
            ? true
            : options.components?.includes(entry.name),
        })),
      });
      selectedComponents = components;
    }

    if (!selectedComponents?.length) {
      ora(
        highlights.warning(`no component was requested!\n  exiting.....`)
      ).fail();
      process.exit(1);
    }

    const selectedComponentsInfo = await getComponentInfo(selectedComponents);

    if (!options.yes) {
      const { proceed } = await prompts({
        type: "confirm",
        name: "proceed",
        message: `Ready to install components and dependencies. Proceed?`,
        initial: true,
      });

      if (!proceed) {
        process.exit(0);
      }
    }

    if (fs.existsSync(componentPath + "/.gitkeep")) {
      // Delete the file
      fs.unlink(componentPath + "/.gitkeep", (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }

    const spinner = ora(`Installing components...`).start();
    for (const item of selectedComponentsInfo) {
      spinner.text = `Installing ${item.name}...`;

      const packageManager = await getPackageManager(cwd);

      // Install uiDependencies.
      if (item.uiDependencies?.length) {
        spinner.stop();
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `${highlights.info(
            item.name
          )} requires the following shadcn-ui components ${highlights.info(
            item.uiDependencies.join(", ")
          )} Proceed?`,
          initial: true,
        });
        if (proceed) {
          spinner.start(
            `installing ${item.uiDependencies.join(", ")} for ${item.name}...`
          );
          await execa(
            "npx",
            ["shadcn-ui@latest", "add", ...item.uiDependencies, "--overwrite"],
            {
              cwd,
            }
          );
          spinner.text = `Installing ${item.name}...`;
        } else {
          spinner.fail(
            `you need (${item.uiDependencies.join(", ")}) for ${item.name}!`
          );
          process.exit(0);
        }
      }

      // Install dependencies.
      if (item.dependencies?.length) {
        await execa(
          packageManager,
          [packageManager === "npm" ? "install" : "i", ...item.dependencies],
          {
            cwd,
          }
        );
      }

      // Install devDependencies.
      if (item.devDependencies?.length) {
        await execa(
          packageManager,
          [
            packageManager === "npm" ? "install" : "add",
            "-D",
            ...item.devDependencies,
          ],
          {
            cwd,
          }
        );
      }
      if (item.fileDependencies) {
        for (const dir of item.fileDependencies) {
          if (!fs.existsSync(path.join(componentPath, dir))) {
            fs.mkdirSync(path.join(componentPath, dir), { recursive: true });
          }
        }
      }

      const data = await fetchFileContentFromGithub(item.files);
      createFiles(data.filenames, data.contents);
      spinner.succeed(`installed ${item.name}`)
    }
    spinner.succeed("Done.");
    process.exit(0);
  });
