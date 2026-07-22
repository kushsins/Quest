import { afterAll, beforeEach } from "vitest";

import {
  disconnectTestDatabase,
  resetTestDatabase,
  type SeededTestData,
} from "./db.js";

let seededData!: SeededTestData;

beforeEach(async () => {
  seededData = await resetTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

export function getSeededTestData(): SeededTestData {
  return seededData;
}
