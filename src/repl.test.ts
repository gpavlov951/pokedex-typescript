import { describe, expect, test } from "vitest";
import { cleanInput } from "./repl";

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "pokemon search pikachu",
    expected: ["pokemon", "search", "pikachu"],
  },
  {
    input: "help",
    expected: ["help"],
  },
  {
    input: "",
    expected: [],
  },
  {
    input: "   multiple    spaces    between    words   ",
    expected: ["multiple", "spaces", "between", "words"],
  },
  {
    input: "special@chars!here",
    expected: ["special@chars!here"],
  },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);

    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
