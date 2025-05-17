import { type Command } from "./commands.js";
import { State } from "./state.js";

export function cleanInput(input: string): string[] {
  return input.toLowerCase().trim().split(" ").filter(Boolean);
}

export function startREPL({ readline: rl, commands }: State) {
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
        `Unknown command: "${command}". Type "help" for a list of commands.`
      );
      rl.prompt();
      return;
    }

    cmd.callback({ readline: rl, commands: commands });
    rl.prompt();
  });
}
