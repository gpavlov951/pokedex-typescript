import { createInterface, type Interface } from "node:readline";
import { Commands, getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";

export type State = {
  readline: Interface;
  commands: Commands;
  pokeAPI: PokeAPI;
  nextLocationsURL: string;
  prevLocationsURL: string;
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
  };
}
