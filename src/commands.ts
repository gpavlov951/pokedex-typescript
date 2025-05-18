import { State } from "./state.js";

export type Command =
  | "exit"
  | "help"
  | "map"
  | "mapb"
  | "explore"
  | "catch"
  | "inspect"
  | "pokedex";
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

export async function commandCatch(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("Please provide a Pokemon name");
  }

  const pokemonName = args[0].toLowerCase();
  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  try {
    const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);

    // Calculate catch probability based on base experience
    // Higher base experience = lower catch chance
    const catchChance = Math.max(0.1, 1 - pokemon.base_experience / 255);
    const caught = Math.random() < catchChance;

    if (caught) {
      console.log(`${pokemonName} was caught!`);
      state.pokedex[pokemonName] = pokemon;
    } else {
      console.log(`${pokemonName} escaped!`);
    }
  } catch (e) {
    console.error((e as Error).message);
  }
}

export async function commandInspect(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error("Please provide a Pokemon name");
  }

  const pokemonName = args[0].toLowerCase();
  const pokemon = state.pokedex[pokemonName];

  if (!pokemon) {
    console.log("you have not caught that pokemon");
    return;
  }

  console.log(`Name: ${pokemon.name}`);
  console.log(`Height: ${pokemon.height}`);
  console.log(`Weight: ${pokemon.weight}`);

  console.log("Stats:");
  for (const stat of pokemon.stats) {
    console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
  }

  console.log("Types:");
  for (const type of pokemon.types) {
    console.log(`  - ${type.type.name}`);
  }
}

export async function commandPokedex(state: State): Promise<void> {
  const caughtPokemon = Object.keys(state.pokedex);

  if (caughtPokemon.length === 0) {
    console.log("Your Pokedex is empty. Go catch some Pokemon!");
    return;
  }

  console.log("Your Pokedex:");
  for (const name of caughtPokemon) {
    console.log(` - ${name}`);
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
    catch: {
      name: "catch",
      description: "Try to catch a Pokemon by name",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "Inspect a caught Pokemon's details",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "List all caught Pokemon",
      callback: commandPokedex,
    },
  };
}
