import js from "@eslint/js";
import astro from "eslint-plugin-astro";

export default [
  { ignores: ["**/dist/**", "**/.astro/**", "reference/**"] },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    // Build scripts run in node, not the browser.
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { console: "readonly" } },
  },
];
