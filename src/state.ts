import { createInterface, type Interface } from "node:readline";
import { type Commands, getCommands } from "./commands.js";
import { PokeAPI, type Pokemon } from "./pokeapi.js";

export type State = {
  readline: Interface;
  commands: Commands;
  pokeAPI: PokeAPI;
  nextLocationsURL: string;
  prevLocationsURL: string;
  pokedex: Record<string, Pokemon>;
};

export function initState(): State {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  return {
    readline: rl,
    commands: getCommands(),
    pokeAPI: new PokeAPI(),
    nextLocationsURL: "",
    prevLocationsURL: "",
    pokedex: {},
  };
}
