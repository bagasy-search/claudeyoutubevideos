// run.mjs — lanzador de las herramientas del canal Yesterday's Classroom, parametrizadas por slug.
//   node vlog/yc/run.mjs <align.py|plan.mjs|mix.py|luma.mjs|prerender.mjs> <slug> [args...]
// Las plantillas viven en vlog/yc/ con el marcador __SLUG__; se instancian en D:/rtmp/<slug>/_tools/ y se ejecutan.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const [tool, slug, ...rest] = process.argv.slice(2);
if (!tool || !/^[a-z0-9]+$/.test(slug || "")) { console.error("uso: node vlog/yc/run.mjs <herramienta> <slug> [args]"); process.exit(2); }
const src = path.join(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, "$1"), tool);
const dir = `D:/rtmp/${slug}/_tools`; fs.mkdirSync(dir, { recursive: true });
const dst = path.join(dir, tool);
fs.writeFileSync(dst, fs.readFileSync(src, "utf8").replaceAll("__SLUG__", slug));
const cmd = tool.endsWith(".py") ? "python" : "node";
const r = spawnSync(cmd, [dst, ...rest], { stdio: "inherit", cwd: "C:/Users/bauti/Downloads/video2", env: { ...process.env, PYTHONUTF8: "1" } });
process.exit(r.status ?? 1);
