import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  roots: ["<rootDir>/tests/unit"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // server-only throws outside a server bundle; use its no-op build in tests.
    "^server-only$": "<rootDir>/node_modules/server-only/empty.js",
  },
};

export default createJestConfig(config);
