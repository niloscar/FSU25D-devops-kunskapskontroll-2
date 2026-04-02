import { describe, test, expect, beforeEach } from "vitest";
import { Suggestion } from "../../src/suggestion/suggestion-model.js";

describe("suggestion-model", () => {
  let model;

  beforeEach(() => {
    model = new Suggestion(1, "Test Suggestion", "This is a test suggestion.", new Date());
  });

  test("initializes with correct properties", () => {
    expect(model.id).toBe(1);
    expect(model.name).toBe("Test Suggestion");
    expect(model.description).toBe("This is a test suggestion.");
    expect(model.suggestedAt).toBeInstanceOf(Date);
  });
});
