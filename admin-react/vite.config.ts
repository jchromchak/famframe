import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const servedRoots = new Set(["assets", "config", "content"]);

function famFrameContentPlugin() {
  return {
    name: "famframe-content-dev",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const requestPath = req.url?.split("?")[0] ?? "";
        const parts = requestPath.split("/").filter(Boolean);
        const root = parts[0];

        if (!root || !servedRoots.has(root)) {
          next();
          return;
        }

        const filePath = path.resolve(repoRoot, ...parts);

        if (!filePath.startsWith(repoRoot)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }

        try {
          const body = await fs.readFile(filePath);
          const contentType = filePath.endsWith(".json")
            ? "application/json"
            : filePath.endsWith(".png")
              ? "image/png"
              : filePath.endsWith(".jpeg") || filePath.endsWith(".jpg")
                ? "image/jpeg"
                : "text/plain";
          res.setHeader("Content-Type", contentType);
          res.end(body);
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), famFrameContentPlugin()],
  base: "./",
});
