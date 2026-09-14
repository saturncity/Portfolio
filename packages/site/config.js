import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { bySite } from "./sites.js";

/**
 * Per-site Astro config: canonical subdomain, its dev port, Tailwind and a
 * sitemap. Every site gets its own sitemap because every site is its own
 * origin, so one shared sitemap would be invalid on all nine.
 */
export function defineSite(key) {
  const site = bySite[key];
  if (!site)
    throw new Error(`Unknown site "${key}". Add it to packages/site/sites.js`);
  return {
    site: `https://${site.host}`,
    server: { port: site.port },
    integrations: [sitemap()],
    vite: { plugins: [tailwindcss()] },
  };
}
