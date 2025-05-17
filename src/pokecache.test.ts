import { describe, expect, test } from "vitest";
import { Cache } from "./pokecache.js";

describe("Cache", () => {
  test.concurrent.each([
    {
      key: "https://example.com",
      val: "testdata",
      interval: 500, // 1/2 second
    },
    {
      key: "https://example.com/path",
      val: "moretestdata",
      interval: 1000, // 1 second
    },
  ])("Test Caching $interval ms", async ({ key, val, interval }) => {
    const cache = new Cache(interval);

    cache.add(key, val);
    const cached = cache.get(key);
    expect(cached).toBe(val);

    await new Promise((resolve) => setTimeout(resolve, interval + 100));
    const reaped = cache.get(key);
    expect(reaped).toBe(undefined);

    cache.stopReapLoop();
  });

  test("Cache should store and retrieve complex objects", () => {
    const cache = new Cache(1000);
    const testObj = { name: "Pikachu", type: "Electric" };

    cache.add("pokemon", testObj);
    const cached = cache.get<typeof testObj>("pokemon");
    expect(cached).toEqual(testObj);

    cache.stopReapLoop();
  });
});
