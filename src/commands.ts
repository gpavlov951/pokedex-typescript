import { State } from "./state.js";

export type Command = "exit" | "help" | "map" | "mapb" | "explore";
export type Commands = Record<Command, CLICommand<Command>>;

type CLICommand<T extends Command> = {
  name: T;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

async function commandExit({ readline }: State): Promise<void> {
  console.log("Closing the Pokedex... Goodbye!");
  readline.close();
  process.exit(0);
}

async function commandHelp({ commands }: State): Promise<void> {
  console.log();
  console.log("Welcome to the Pokedex!");
  console.log("Usage:");
  console.log();

  for (const cmd of Object.values(commands)) {
    console.log(`${cmd.name}: ${cmd.description}`);
  }

  console.log();
}

export async function commandMapForward(state: State): Promise<void> {
  const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);

  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;

  for (const loc of locations.results) {
    console.log(loc.name);
  }
}

export async function commandMapBack(state: State): Promise<void> {
  if (!state.prevLocationsURL) {
    throw new Error("You're on the first page");
  }

  const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);

  state.nextLocationsURL = locations.next;
  state.prevLocationsURL = locations.previous;

  for (const loc of locations.results) {
    console.log(loc.name);
  }
}

export async function commandExplore(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("Please provide a location area name");
  }

  const locationName = args[0];
  console.log(`Exploring ${locationName}...`);

  const location = await state.pokeAPI.fetchLocation(locationName);

  console.log("Found Pokemon:");
  for (const encounter of location.pokemon_encounters) {
    console.log(` - ${encounter.pokemon.name}`);
  }
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
    map: {
      name: "map",
      description: "Get the next page of locations",
      callback: commandMapForward,
    },
    mapb: {
      name: "mapb",
      description: "Get the previous page of locations",
      callback: commandMapBack,
    },
    explore: {
      name: "explore",
      description: "Explore a location area to find Pokemon",
      callback: commandExplore,
    },
  };
}
