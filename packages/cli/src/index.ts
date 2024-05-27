#! /usr/bin/env node
import { helloWorldCommand } from "./commands/hello-world.js";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { packageJSON } from "@/utils/package-json.js";
import { Command } from "commander";

(async () => {
  const program = new Command();

  program
    .name(">")
    .description("⚡️ transparency/ui.")
    .version(
      packageJSON.version,
      "-v, --version",
      "display the version number"
    );

  program
    .addCommand(init)
    .addCommand(add)
    .addCommand(helloWorldCommand);
  program.parse();
})();
