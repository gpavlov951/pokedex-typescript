export type Command = "exit" | "help";
type Commands = Record<Command, CLICommand<Command>>;

type CLICommand<T extends Command> = {
  name: T;
  description: string;
  callback: (commands: Record<T, CLICommand<T>>) => void;
};

function commandExit() {
  console.log("Closing the Pokedex... Goodbye!");
  process.exit(0);
}

function commandHelp(commands: Commands) {
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
