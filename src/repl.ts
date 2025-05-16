import { createInterface } from "node:readline";
import { type Command, getCommands } from "./commands.js";

export function cleanInput(input: string): string[] {
  return input.toLowerCase().trim().split(" ").filter(Boolean);
}

export function startREPL() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  const commands = getCommands();

  rl.prompt();

  rl.on("line", (input) => {
    const parseInput = cleanInput(input);
    if (parseInput.length === 0) {
      rl.prompt();
      return;
    }

    const command = parseInput[0];
    const cmd = commands[command as Command];

    if (!cmd) {
      console.log(
        `Unknown command: ${command}. Type "help" for a list of commands.`
      );
      rl.prompt();
      return;
    }

    cmd.callback(commands);
    rl.prompt();
  });
}
