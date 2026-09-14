// Prints "<app key> <cloudflare pages project>" for every site CI should ship.
// The registry decides what deploys, so the workflow never holds its own list.
import { sites } from "../packages/site/sites.js";

const targets = sites.filter((s) => s.deploy);
if (targets.length === 0)
  throw new Error("No sites have deploy: true in packages/site/sites.js");

for (const s of targets) console.log(`${s.key} lenzj-${s.key}`);
