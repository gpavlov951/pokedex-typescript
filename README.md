# Pokedex TypeScript

A command-line Pokedex application built with TypeScript that allows you to explore the Pokemon world, catch Pokemon, and maintain your own Pokedex.

## Features

- **Map Navigation**: Browse through different Pokemon locations
- **Exploration**: Discover Pokemon in different areas
- **Catching**: Try to catch Pokemon you encounter
- **Pokedex**: Keep track of all the Pokemon you've caught
- **Inspection**: View detailed information about caught Pokemon

## Commands

- `map`: Get the next page of locations
- `mapb`: Get the previous page of locations
- `explore <location>`: Explore a location area to find Pokemon
- `catch <pokemon>`: Try to catch a Pokemon by name
- `inspect <pokemon>`: View detailed information about a caught Pokemon
- `pokedex`: List all Pokemon you've caught
- `help`: Display available commands
- `exit`: Exit the application

## Example Usage

```bash
Pokedex > map
# Lists available locations

Pokedex > explore pallet-town
# Shows Pokemon available in Pallet Town

Pokedex > catch pikachu
Throwing a Pokeball at pikachu...
pikachu was caught!

Pokedex > inspect pikachu
Name: pikachu
Height: 4
Weight: 60
Stats:
  -hp: 35
  -attack: 55
  -defense: 40
  -special-attack: 50
  -special-defense: 50
  -speed: 90
Types:
  - electric

Pokedex > pokedex
Your Pokedex:
 - pikachu
```

## Catching Mechanics

The chance of catching a Pokemon is based on its base experience:

- Higher base experience means a lower chance of catching
- Minimum catch chance is 10%
- Maximum catch chance is 100%

## Technical Details

- Built with TypeScript
- Uses the PokeAPI (https://pokeapi.co/) for Pokemon data
- Implements caching to improve performance
- Command-line interface using Node.js readline

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run the application:
   ```bash
   npm start
   ```

## Development

- `npm run build`: Build the TypeScript code
- `npm run start`: Run the application
- `npm run dev`: Run the application in development mode with auto-reload

## License

MIT License
