import { State } from "./state.js";

export type Command = "exit" | "help";
export type Commands = Record<Command, CLICommand<Command>>;

type CLICommand<T extends Command> = {
  name: T;
  description: string;
  callback: (state: State) => void;
};

function commandExit({ readline }: State) {
  console.log("Closing the Pokedex... Goodbye!");
  readline.close();
  process.exit(0);
}

function commandHelp({ commands }: State) {
  console.log();
  console.log("Welcome to the Pokedex!");
  console.log("Usage:");
  console.log();

  for (const cmd of Object.values(commands)) {
    console.log(`${cmd.name}: ${cmd.description}`);
  }

  console.log();
}

export function getCommands(): Commands {
  return {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
  };
}
