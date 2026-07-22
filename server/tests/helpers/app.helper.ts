import request, { type Agent } from "supertest";

import { createApp } from "../../src/app.js";

export function createTestAgent(): Agent {
  return request(createApp());
}
