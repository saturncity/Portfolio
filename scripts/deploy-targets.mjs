// Prints "<app key> <cloudflare pages project> <hostname>" for every site that
// should ship. The registry decides, so CI keeps no list of its own.
import { sites } from "../packages/site/sites.js";

for (const s of sites.filter((s) => s.deploy))
  console.log(`${s.key} lenzj-${s.key} ${s.host}`);
