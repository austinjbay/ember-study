import { readFile, writeFile } from "node:fs/promises";

const indexPath = new URL("../index.html", import.meta.url);
const html = await readFile(indexPath, "utf8");
const devHtml = html
  .replace(/href="styles\.css\?v=[^"]*"/, 'href="styles.css"')
  .replace(/src="app\.js\?v=[^"]*"/, 'src="app.js"');

await writeFile(indexPath, devHtml);
console.log("Restored local development asset URLs.");
