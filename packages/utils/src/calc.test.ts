import { test, expect } from "vitest";
import { add } from './calc';

test("add", () => {
    expect(add(10, 20)).toBe(30);
});
