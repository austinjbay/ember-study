import { readFile, writeFile } from "node:fs/promises";

const indexPath = new URL("../index.html", import.meta.url);
const stamp = process.argv[2] || new Date().toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 12);

const html = await readFile(indexPath, "utf8");
const stamped = html
  .replace(/href="styles\.css(?:\?v=[^"]*)?"/, `href="styles.css?v=${stamp}"`)
  .replace(/src="app\.js(?:\?v=[^"]*)?"/, `src="app.js?v=${stamp}"`);

if (html === stamped) {
  console.error("Could not find styles.css or app.js references in index.html.");
  process.exit(1);
}

await writeFile(indexPath, stamped);
console.log(`Stamped production assets with v=${stamp}`);
