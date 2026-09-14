import { writeFileSync } from "node:fs";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { bySite } from "./sites.js";

// The pages are static HTML with one external stylesheet: no scripts, no inline
// styles, no images. That lets the policy default to 'none' and open only what
// is really used.
const HEADERS = `/*
  Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;

// People and search engines are welcome, bulk collection and model training
// are not. robots.txt is the only place that stance is stated.
// prettier-ignore
const AI_AGENTS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-Web",
  "anthropic-ai", "Google-Extended", "Applebot-Extended", "PerplexityBot",
  "CCBot", "Bytespider", "Amazonbot", "Meta-ExternalAgent", "FacebookBot",
  "cohere-ai", "Diffbot", "ImagesiftBot", "omgili", "Timpibot", "YouBot",
  "Scrapy", "magpie-crawler", "peer39_crawler", "TurnitinBot",
];

const robots = (host) =>
  `User-agent: *\nAllow: /\n\nSitemap: https://${host}/sitemap-index.xml\n\n` +
  `# All rights reserved. Not available for model training or bulk collection.\n` +
  AI_AGENTS.map((a) => `User-agent: ${a}\nDisallow: /`).join("\n\n") +
  "\n";

// Written into dist at build time rather than committed into each app's
// public/, so the sitemap host can't drift and public/ stays free for the
// assets a site actually owns.
const emitStaticFiles = (host) => ({
  name: "lenzj-static-files",
  hooks: {
    "astro:build:done": ({ dir }) => {
      writeFileSync(new URL("_headers", dir), HEADERS);
      writeFileSync(new URL("robots.txt", dir), robots(host));
    },
  },
});

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
    integrations: [sitemap(), emitStaticFiles(site.host)],
    vite: { plugins: [tailwindcss()] },
  };
}
