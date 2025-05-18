import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor() {
    // Cache entries will expire after 5 minutes
    this.cache = new Cache(5 * 60 * 1000);
  }

  private logRequest(url: string): void {
    console.log("Loading...");
    console.log(`Making request to: ${url}`);
    console.log();
  }

  private logResponse(url: string, startTime: number): void {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Request to ${url} completed in ${duration}ms`);
    console.log();
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;

    const cachedData = this.cache.get<ShallowLocations>(url);
    if (cachedData) {
      return cachedData;
    }

    try {
      this.logRequest(url);
      const startTime = Date.now();

      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }

      const locations: ShallowLocations = await resp.json();

      this.logResponse(url, startTime);

      this.cache.add(url, locations);

      return locations;
    } catch (e) {
      throw new Error(`Error fetching locations: ${(e as Error).message}`);
    }
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    const cachedData = this.cache.get<Location>(url);
    if (cachedData) {
      return cachedData;
    }

    try {
      this.logRequest(url);
      const startTime = Date.now();

      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }

      const location: Location = await resp.json();

      this.logResponse(url, startTime);

      this.cache.add(url, location);

      return location;
    } catch (e) {
      throw new Error(
        `Error fetching location '${locationName}': ${(e as Error).message}`
      );
    }
  }

  async fetchPokemon(name: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${name.toLowerCase()}`;

    const cachedData = this.cache.get<Pokemon>(url);
    if (cachedData) {
      return cachedData;
    }

    try {
      this.logRequest(url);
      const startTime = Date.now();

      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }

      const pokemon: Pokemon = await resp.json();

      this.logResponse(url, startTime);

      this.cache.add(url, pokemon);

      return pokemon;
    } catch (e) {
      throw new Error(
        `Error fetching Pokemon '${name}': ${(e as Error).message}`
      );
    }
  }
}

type ShallowLocations = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

type Location = {
  encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  game_index: number;
  id: number;
  location: {
    name: string;
    url: string;
  };
  name: string;
  names: {
    language: {
      name: string;
      url: string;
    };
    name: string;
  }[];
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
    version_details: {
      encounter_details: {
        chance: number;
        condition_values: any[];
        max_level: number;
        method: {
          name: string;
          url: string;
        };
        min_level: number;
      }[];
      max_chance: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
};

export type Pokemon = {
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
  forms: {
    name: string;
    url: string;
  }[];
  game_indices: {
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  held_items: any[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
  name: string;
  order: number;
  past_types: any[];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string;
    back_female: any;
    back_shiny: string;
    back_shiny_female: any;
    front_default: string;
    front_female: any;
    front_shiny: string;
    front_shiny_female: any;
    other: {
      dream_world: {
        front_default: string;
        front_female: any;
      };
      home: {
        front_default: string;
        front_female: any;
        front_shiny: string;
        front_shiny_female: any;
      };
      official_artwork: {
        front_default: string;
        front_shiny: string;
      };
    };
    versions: {
      [generation: string]: {
        [game: string]: {
          back_default: string;
          back_female?: any;
          back_shiny: string;
          back_shiny_female?: any;
          front_default: string;
          front_female?: any;
          front_shiny: string;
          front_shiny_female?: any;
        };
      };
    };
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  weight: number;
};
