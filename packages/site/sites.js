/**
 * The network. One deployable Astro app per host: subdomains, not paths.
 * This is the only place ports and hostnames are written down.
 */
// prettier-ignore
export const sites = [
  { key: "me",          cluster: "lenzj.me",  host: "lenzj.me",              port: 3001, root: true , title: "LENZJ.ME",    blurb: "Network root and directory." },
  { key: "scuba",       cluster: "lenzj.me",  host: "scuba.lenzj.me",        port: 3002, root: false, title: "SCUBA",       blurb: "Dive logs, gear, underwater work." },
  { key: "safety",      cluster: "lenzj.me",  host: "safety.lenzj.me",       port: 3003, root: false, title: "SAFETY",      blurb: "Safety practice and process." },
  { key: "theatre",     cluster: "lenzj.me",  host: "theatre.lenzj.me",      port: 3004, root: false, title: "THEATRE",     blurb: "Stage management and production work." },

  { key: "dev",         cluster: "lenzj.dev", host: "lenzj.dev",             port: 3005, root: true , title: "LENZJ.DEV",   blurb: "Technical root." },
  { key: "software",    cluster: "lenzj.dev", host: "software.lenzj.dev",    port: 3006, root: false, title: "SOFTWARE",    blurb: "Software projects and writing." },
  { key: "robotics",    cluster: "lenzj.dev", host: "robotics.lenzj.dev",    port: 3007, root: false, title: "ROBOTICS",    blurb: "Robotics and embedded work." },
  { key: "engineering", cluster: "lenzj.dev", host: "engineering.lenzj.dev", port: 3008, root: false, title: "ENGINEERING", blurb: "Engineering notes and builds." },

  { key: "photography", cluster: "lenzj.art", host: "lenzj.art",             port: 3009, root: true , title: "PHOTOGRAPHY", blurb: "Photographic work. The practice this all started from." },
];

export const bySite = Object.fromEntries(sites.map((s) => [s.key, s]));

/** Clusters in declaration order, each with its sites. */
export const clusters = sites.reduce((acc, s) => {
  (acc[s.cluster] ??= []).push(s);
  return acc;
}, {});

/**
 * Dev gives each site its own port; production gives each its own subdomain.
 * `import.meta.env` is undefined outside Vite, such as in astro.config.mjs,
 * which is why this reads it defensively.
 */
export const urlFor = (key) =>
  import.meta.env?.DEV
    ? `http://localhost:${bySite[key].port}`
    : `https://${bySite[key].host}`;
