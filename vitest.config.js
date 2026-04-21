import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["server/**/*.test.js", "src/**/*.test.{js,jsx}"],
    environmentMatchGlobs: [["src/**/*.test.{js,jsx}", "jsdom"]],
    environment: "node",
  },
});
