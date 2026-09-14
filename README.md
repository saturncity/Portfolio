```
  ____   ___  ____ _____ _____ ___  _     ___ ___
 |  _ \ / _ \|  _ \_   _|  ___/ _ \| |   |_ _/ _ \
 | |_) | | | | |_) || | | |_ | | | | |    | | | | |
 |  __/| |_| |  _ < | | |  _|| |_| | |___ | | |_| |
 |_|    \___/|_| \_\|_| |_|   \___/|_____|___\___/
```

My personal sites, built as one deployable app per subdomain instead of one site with paths.

> [!WARNING]
> This is early. One of the nine sites has real content, the other eight are
> scaffolds that render a heading and a status line. Nothing is deployed yet, so
> every `lenzj.*` URL below points at a domain I haven't pushed to.

<p align="center">
  <img src="https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Bun-FBF0DF?style=for-the-badge&logo=bun&logoColor=black" alt="Bun">
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

## About

I'm splitting my personal sites across three domains and nine hosts. Rather than
one site serving `/scuba` and `/theatre`, each one is its own Astro app with its
own build, its own sitemap and its own hostname. They share a single file that
lists every host and every dev port.

That file is the whole trick. `packages/site/sites.js` holds the table, and both
the dev server ports and the production URLs are read from it, so a port can't
drift out of sync with the hostname it belongs to.

- Nine independently deployable sites across `lenzj.com`, `lenzj.dev` and `lenzj.art`
- Hosts and ports written down once, in `packages/site/sites.js`
- `urlFor()` returns a `localhost` port in dev and an `https://` subdomain in production, so cross-site links work in both without an edit
- Each site generates a sitemap scoped to its own origin, because nine origins can't share one
- Static output, no server to run

## Tech stack

| Layer | Technology | Why it's here |
| --- | --- | --- |
| Package manager and runtime | Bun 1.4 | Installs the workspace and runs the scripts. Its isolated installs give each app only what it declares. |
| Task runner | Turborepo 2.10 | Builds nine apps in one command and caches the ones that didn't change. |
| Framework | Astro 7 | Static HTML per site with no client JavaScript shipped by default. |
| Styling | Tailwind CSS 4 | Loaded through `@tailwindcss/vite`. The old `@astrojs/tailwind` integration is deprecated and its peers stop at Astro 5. |
| Sitemaps | `@astrojs/sitemap` 3.7 | One sitemap per site, built from the `site` URL that `defineSite()` sets. |
| Language | JavaScript, ESM | No TypeScript here. The config files are `.mjs`, everything else is `.js` or `.astro`. |
| Linting | ESLint 9 with `eslint-plugin-astro` 1.7 | Version 1 is the last line that doesn't require the typescript-eslint packages as peers. |
| Formatting | Prettier 3.9 with `prettier-plugin-astro` 1.0 | Without the plugin, Prettier skips `.astro` files. |
| Bundler | Vite, via Astro | Where the Tailwind plugin attaches. |

## Screenshots

![The lenzj.com directory page](docs/assets/directory.png)

The root site at `lenzj.com`. Every hostname in those three columns comes from
the registry, and this is a production build, which is why they read as
`scuba.lenzj.com` rather than `localhost:3002`. Run `bun run dev` and the same
markup renders the localhost ports instead.

![A scaffolded site](docs/assets/site-scaffold.png)

What the other eight look like today. The title and the description come from
the registry row, and the link at the top right resolves to whichever cluster
root the site belongs to.

## Getting started

### Prerequisites

- **Bun 1.2 or later.** I'm on 1.4.2.
- **Node 20 or later.** Bun runs the scripts, but Astro's CLI starts with `#!/usr/bin/env node`, so Node executes the actual build.

### Installation

```sh
git clone https://github.com/saturncity/portfolio.git
cd portfolio
bun install
```

### Running

```sh
bun run dev
```

That starts all nine dev servers at once. The root site comes up on
<http://localhost:3001>, and the ports run through to 3009 in the order listed
in the registry. To work on one site on its own:

```sh
bun run dev --filter=@lenzj/scuba
```

### Building

```sh
bun run build
```

Each site writes to its own `apps/<name>/dist`. There are no environment
variables to set.

### Checks

```sh
bun run lint
bun run format:check
```

There's no test suite. For nine static pages I didn't think one earned its keep.

## Project structure

```
.
├── apps/                   one Astro app per host, nine of them
│   ├── me/                 lenzj.com, the directory page, the only real content
│   ├── scuba/              scuba.lenzj.com
│   ├── safety/             safety.lenzj.com
│   ├── dev/                lenzj.dev
│   ├── software/           software.lenzj.dev
│   ├── robotics/           robotics.lenzj.dev
│   ├── engineering/        engineering.lenzj.dev
│   ├── art/                lenzj.art
│   └── theatre/            theatre.lenzj.art
├── packages/
│   └── site/               shared across every app
│       ├── sites.js        the registry: hosts, ports, clusters, titles
│       ├── config.js       defineSite(), builds each app's Astro config
│       └── global.css      one line, imports Tailwind
├── docs/assets/            README screenshots
├── eslint.config.js
└── turbo.json
```

Each app holds three files: a `package.json`, an `astro.config.mjs` that's a
one-line call to `defineSite()`, and a page.

## Known issues

**Cross-site view transitions don't fire.** `apps/me/src/pages/index.astro` sets
`<meta name="view-transition" content="same-origin">`, and the footer claims
`TRANSITIONS: ACTIVE`. Cross-document view transitions only run between
same-origin documents, and `lenzj.com` to `scuba.lenzj.com` crosses origins, so
nothing animates. It's the cost of picking subdomains over paths. I need to
either drop the meta tag and fix the footer, or accept plain navigation between
sites.

**Eight of nine sites are empty.** They render a title, a one-line description
and the word `SCAFFOLD`. I'll fill them in one at a time.

**Nothing is deployed.** There's no host config in this repo and no DNS pointing
anywhere. Each app is a static build, so it needs one project per site pointed at
`apps/<name>` with output `apps/<name>/dist`, then the subdomain bound to it.

**No shared layout.** All nine pages repeat the same HTML shell. That's fine for
nine near-identical scaffolds and it'll stop being fine as soon as two of them
have real content, at which point the chrome moves into `packages/site`.

## Contributing

This is my personal site, so I'm not looking for feature work. If you spot
something broken, open an issue. If you want to borrow the registry pattern for
your own multi-domain setup, take it.

## License

There's no license file in this repo yet, so default copyright applies and I
haven't granted any reuse rights. I'll add one.
