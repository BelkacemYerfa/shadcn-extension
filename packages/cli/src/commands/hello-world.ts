import { ascii_logo_tease } from "./ascii-logo";
import { Command } from "commander";
import chalkAnimation from "chalk-animation"

export const helloWorldCommand = new Command()
  .name("hello-world")
  .description("Prints a greeting message")
  .argument("[components...]", "the components to add")
  .action(() => {
    const animation = chalkAnimation.rainbow(ascii_logo_tease);
    setTimeout(() => {
      animation.stop();
    }, 5000);
  });
  