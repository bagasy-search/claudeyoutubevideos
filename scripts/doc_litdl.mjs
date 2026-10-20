// doc_litdl.mjs — baja (en un runner del farm) el shard de candidatos de metraje REAL (Dailymotion/archive.org/etc.)
// para indexarlos con doc_clipidx. Uso: node scripts/doc_litdl.mjs <lista.json> <idx> <total> <raiz>
//   lista = [{k, id, url}] → <raiz>/p360/<k>/<id>.mp4 (la peor calidad ≥240p: alcanza para CLIP, 224 px)
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const [LIST, I, N, R] = process.argv.slice(2);
const todos = JSON.parse(fs.readFileSync(LIST, "utf8"));
const mios = todos.filter((_, i) => i % +N === +I);
const MAXS = process.env.LIT_MAXS || "1500";
console.log(`shard ${I}/${N}: ${mios.length} videos`);
const dl = (v) => new Promise((ok) => {
  const dir = path.join(R, "p360", v.k); fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, v.id + ".mp4");
  const p = spawn("yt-dlp", [v.url, "-f", "b[height<=360][height>=240]/bv*[height<=360][height>=240]/worst", "-N", "6", "--no-playlist", "--quiet", "--no-warnings",
    "--socket-timeout", "20", "--retries", "3", "--remux-video", "mp4", "--download-sections", `*0-${MAXS}`, "-o", f], { stdio: "inherit" });
  const to = setTimeout(() => p.kill("SIGKILL"), 900e3);
  p.on("close", () => { clearTimeout(to); console.log(fs.existsSync(f) ? "ok" : "X", v.id); ok(); });
});
const cola = [...mios];
await Promise.all(Array.from({ length: 4 }, async () => { while (cola.length) await dl(cola.shift()); }));
