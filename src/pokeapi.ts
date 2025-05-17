import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor() {
    // Cache entries will expire after 5 minutes
    this.cache = new Cache(5 * 60 * 1000);
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;

    // Check cache first
    const cachedData = this.cache.get<ShallowLocations>(url);
    if (cachedData) {
      return cachedData;
    }

    try {
      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }

      const locations: ShallowLocations = await resp.json();

      // Cache the response
      this.cache.add(url, locations);

      return locations;
    } catch (e) {
      throw new Error(`Error fetching locations: ${(e as Error).message}`);
    }
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    // Check cache first
    const cachedData = this.cache.get<Location>(url);
    if (cachedData) {
      return cachedData;
    }

    try {
      const resp = await fetch(url);

      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }

      const location: Location = await resp.json();

      // Cache the response
      this.cache.add(url, location);

      return location;
    } catch (e) {
      throw new Error(
        `Error fetching location '${locationName}': ${(e as Error).message}`
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
