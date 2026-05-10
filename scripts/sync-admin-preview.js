const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const distRoot = path.join(repoRoot, "admin-react", "dist");
const previewRoot = path.join(repoRoot, "admin-next");
const previewAssets = path.join(previewRoot, "assets");

function readAssetRefs(html) {
  return Array.from(html.matchAll(/(?:src|href)="\.\/assets\/([^"]+)"/g), (match) => match[1]);
}

function ensureBuilt() {
  if (!fs.existsSync(path.join(distRoot, "index.html"))) {
    throw new Error("admin-react/dist/index.html is missing. Run `npm run build` first.");
  }
}

ensureBuilt();

fs.mkdirSync(previewAssets, { recursive: true });

for (const entry of fs.readdirSync(previewAssets)) {
  if (/^index-.+\.(css|js)$/.test(entry)) {
    fs.rmSync(path.join(previewAssets, entry));
  }
}

const html = fs.readFileSync(path.join(distRoot, "index.html"), "utf8");
fs.copyFileSync(path.join(distRoot, "index.html"), path.join(previewRoot, "index.html"));

for (const asset of readAssetRefs(html)) {
  fs.copyFileSync(path.join(distRoot, "assets", asset), path.join(previewAssets, asset));
}

console.log(`Synced ${readAssetRefs(html).length} admin preview assets.`);
