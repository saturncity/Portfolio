// Prints "<app key> <cloudflare pages project> <hostname>" for every site that
// should ship. The registry decides, so neither CI nor the setup wizard keeps
// a list of its own.
import { sites } from "../packages/site/sites.js";

const targets = sites.filter((s) => s.deploy);
if (targets.length === 0)
  throw new Error("No sites have deploy: true in packages/site/sites.js");

for (const s of targets) console.log(`${s.key} lenzj-${s.key} ${s.host}`);
