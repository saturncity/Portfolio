// Writes apps/<key>/public/_headers and public/robots.txt for every site.
// Generated from the registry so the sitemap URL in robots.txt always matches
// the host the site actually serves on. Re-run after editing sites.js.
import { mkdirSync, writeFileSync } from "node:fs";
import { sites } from "../packages/site/sites.js";

// The pages are static HTML with one external stylesheet: no scripts, no inline
// styles, no images. That lets the policy default to 'none' and open only what
// is really used.
const headers = `/*
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

// Matches the stance in AGENTS.md: people and search engines are welcome,
// bulk collection and model training are not.
const aiAgents = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "omgili",
  "Timpibot",
  "YouBot",
  "Scrapy",
  "magpie-crawler",
  "peer39_crawler",
  "TurnitinBot",
];

for (const s of sites) {
  const dir = `apps/${s.key}/public`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/_headers`, headers);
  writeFileSync(
    `${dir}/robots.txt`,
    `User-agent: *\nAllow: /\n\nSitemap: https://${s.host}/sitemap-index.xml\n\n` +
      `# Not available for model training or bulk collection. See AGENTS.md.\n` +
      aiAgents.map((a) => `User-agent: ${a}\nDisallow: /`).join("\n\n") +
      "\n",
  );
}
console.log(`wrote _headers and robots.txt for ${sites.length} sites`);
