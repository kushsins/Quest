/// <reference types="vitest/config" />
import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["tests/setup/test-setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
    // Tests own their env so runs are deterministic in CI and locally,
    // independent of any real .env. Mirrors the backend tests/setup/env.ts.
    env: {
      VITE_API_BASE_URL: "http://localhost:3000/api/v1",
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/**/*.types.ts",
        "src/app/**",
      ],
    },
  },
});
