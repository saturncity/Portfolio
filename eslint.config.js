import js from "@eslint/js";
import astro from "eslint-plugin-astro";

export default [
  { ignores: ["**/dist/**", "**/.astro/**", "reference/**"] },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    // Build-time code runs in node, not the browser.
    files: ["scripts/**/*.mjs", "packages/site/config.js"],
    languageOptions: { globals: { console: "readonly", URL: "readonly" } },
  },
];
