import { createInterface, type Interface } from "node:readline";
import { Commands, getCommands } from "./commands.js";

export type State = {
  readline: Interface;
  commands: Commands;
};

export function initState(): State {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  const commands = getCommands();

  return {
    readline: rl,
    commands: commands,
  };
}
