# lenzj-portfolios

A network of small Astro sites, **one deployable site per subdomain** — not one site
with `/scuba`-style paths. Each app in `apps/` builds and deploys independently to its
own host.

## The network

| App | Host | Dev port |
| --- | --- | --- |
| `me` | lenzj.com *(root + directory)* | 3001 |
| `scuba` | scuba.lenzj.com | 3002 |
| `safety` | safety.lenzj.com | 3003 |
| `dev` | lenzj.dev *(root)* | 3004 |
| `software` | software.lenzj.dev | 3005 |
| `robotics` | robotics.lenzj.dev | 3006 |
| `engineering` | engineering.lenzj.dev | 3007 |
| `art` | lenzj.art *(root)* | 3008 |
| `theatre` | theatre.lenzj.art | 3009 |

## Single source of truth

`packages/site/sites.js` is the **only** place hosts and ports are written down.
Everything else derives from it:

- `urlFor(key)` returns `http://localhost:<port>` in dev and `https://<host>` in
  production, so cross-site links work in both without editing anything.
- `defineSite(key)` (in `packages/site/config.js`) builds each app's Astro config —
  its dev port, its canonical `site` URL, and Tailwind — so a port can never drift
  out of sync with the table above.

Adding a site: add a row to `sites.js`, then create `apps/<key>/` with a
`package.json`, a one-line `astro.config.mjs` calling `defineSite("<key>")`, and a page.

## Commands

```sh
pnpm install
pnpm dev                      # all nine, each on its own port
pnpm build                    # all nine to apps/*/dist
pnpm dev --filter=@lenzj/scuba   # just one
```

## Deploying

Each app is a static build with its own output — point one host/project per app at
`apps/<key>` with build `pnpm build --filter=@lenzj/<key>` and output `apps/<key>/dist`,
then bind that project to its subdomain. DNS and host setup are done in your
provider's dashboard; nothing in this repo assumes a particular host.

## Stack

Astro 7, Tailwind 4 (via `@tailwindcss/vite`), Turborepo, pnpm workspaces.
