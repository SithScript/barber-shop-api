import { loadEnvFile } from "node:process";
import { defineConfig } from "vitest/config";
import fs from "node:fs";

if (fs.existsSync(".env")) {
    loadEnvFile(".env");
}

export default defineConfig({
    test: {
        include: ["src/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/models/**/*.ts"],
        },
    },
});
