import { type Command } from "./commands.js";
import { State } from "./state.js";

export function cleanInput(input: string): string[] {
  return input.toLowerCase().trim().split(" ").filter(Boolean);
}

export async function startREPL(state: State) {
  state.readline.prompt();

  state.readline.on("line", async (input) => {
    const parseInput = cleanInput(input);
    if (parseInput.length === 0) {
      state.readline.prompt();
      return;
    }

    const command = parseInput[0];
    const cmd = state.commands[command as Command];

    if (!cmd) {
      console.log(
        `Unknown command: "${command}". Type "help" for a list of commands.`
      );
      state.readline.prompt();
      return;
    }

    try {
      await cmd.callback(state);
    } catch (e) {
      console.log((e as Error).message);
    }

    state.readline.prompt();
  });
}
