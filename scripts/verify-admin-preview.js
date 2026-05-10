const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const distRoot = path.join(repoRoot, "admin-react", "dist");
const previewRoot = path.join(repoRoot, "admin-next");

function readAssetRefs(html) {
  return Array.from(html.matchAll(/(?:src|href)="\.\/assets\/([^"]+)"/g), (match) => match[1]);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const distIndexPath = path.join(distRoot, "index.html");
const previewIndexPath = path.join(previewRoot, "index.html");

assert(fs.existsSync(distIndexPath), "admin-react/dist/index.html is missing.");
assert(fs.existsSync(previewIndexPath), "admin-next/index.html is missing.");

const distHtml = fs.readFileSync(distIndexPath, "utf8");
const previewHtml = fs.readFileSync(previewIndexPath, "utf8");

assert(
  previewHtml === distHtml,
  "admin-next/index.html does not match the latest admin-react build. Run `npm run publish:preview` from admin-react.",
);

const distRefs = readAssetRefs(distHtml);
const previewRefs = readAssetRefs(previewHtml);

assert(distRefs.length > 0, "No built admin assets were found in dist/index.html.");
assert(
  JSON.stringify(previewRefs) === JSON.stringify(distRefs),
  "admin-next asset references do not match the latest admin-react build.",
);

for (const asset of distRefs) {
  const distAssetPath = path.join(distRoot, "assets", asset);
  const previewAssetPath = path.join(previewRoot, "assets", asset);

  assert(fs.existsSync(previewAssetPath), `Missing admin-next asset: ${asset}`);
  assert(
    fs.readFileSync(previewAssetPath).equals(fs.readFileSync(distAssetPath)),
    `admin-next asset is stale: ${asset}`,
  );
}

const previewAssetsPath = path.join(previewRoot, "assets");
const extraGeneratedAssets = fs
  .readdirSync(previewAssetsPath)
  .filter((entry) => /^index-.+\.(css|js)$/.test(entry) && !previewRefs.includes(entry));

assert(
  extraGeneratedAssets.length === 0,
  `admin-next has stale generated assets: ${extraGeneratedAssets.join(", ")}`,
);

console.log("Admin preview matches the latest React build.");
