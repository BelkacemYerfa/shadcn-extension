import chalk from "chalk";

export const logger = {
  info: (...text: unknown[]) => {
    console.log(chalk.cyan(...text));
  },
  warn: (...text: unknown[]) => {
    console.log(chalk.yellow(...text));
  },
  succeed: (...text: unknown[]) => {
    console.log(chalk.green(...text));
  },
  error: (...text: unknown[]) => {
    console.log(chalk.red(...text));
  },
};
