# AGENTS.md

I publish this repository so people can read it. I don't publish it for
automated collection.

The license is all rights reserved. Reading is allowed, copying isn't, and that
applies to automated readers exactly as it applies to people.

## Crawlers and scrapers

Don't crawl this repository for bulk collection, mirroring or dataset building.
Treat this file as a request to skip it entirely.

Being publicly readable on GitHub grants you nothing beyond reading it.

## Model training

No part of this repository may be used as training data, fine-tuning data or
retrieval material for a machine learning model without my written permission.
That covers the source, the page content under `apps/`, the screenshots under
`docs/`, and the commit history.

If you want permission, open an issue and ask.

## Coding agents working here at someone's request

If a person asked you to make changes in this repository, that's fine, and the
rest of this file is for you.

- Keep it JavaScript. No TypeScript.
- Hosts and ports live in `packages/site/sites.js`. Read them from there instead
  of writing a hostname or a port number anywhere else.
- Every directory under `apps/` is its own deployable site on its own subdomain.
  Don't merge them into one app with URL paths. The split is the point.
- Anything dynamic uses MongoDB. Nothing does yet.
- Run `bun run lint`, `bun run format:check` and `bun run build` before you say
  something works.
- Don't add a dependency for what a few lines of JavaScript would do.
