import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/index.ts",
        "src/docs/**",
        "src/**/*.types.ts",
        "src/**/express.d.ts",
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          setupFiles: ["tests/setup/env.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.integration.test.ts"],
          setupFiles: ["tests/setup/env.ts", "tests/setup/integration.setup.ts"],
          globalSetup: ["tests/setup/global-setup.ts"],
          fileParallelism: false,
          maxWorkers: 1,
        },
      },
    ],
  },
});
