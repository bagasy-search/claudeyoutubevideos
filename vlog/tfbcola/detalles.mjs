// detalles.mjs — planos de DETALLE (keyframe first→last, sin habla, con foley) del video tfbcola.
//   node vlog/tfbcola/detalles.mjs anclas          → D1 por /generations y D2 = /edits desde D1 (Batch, low, 1088x608)
//   node vlog/tfbcola/detalles.mjs clips [ids…]     → agnes-video-2.5-flash `keyframe` (con ids: regenera con sufijo r)
// Entrada: vlog/tfbcola/details.json [{id, scene, cl, T, own, p1, p2}] (lo arma build_plans.py).
// Salida: <cl>/../anc/D_<id>_1.png, D_<id>_2.png · clip en <cl>/<id>.mp4 · <cl>/state_det.json {id:{file,T,own}}
import fs from "node:fs"; import path from "node:path"; import { execFileSync as _efs } from "node:child_process"; const execFileSync = (c, a, o) => _efs(c, a, { windowsHide: true, ...(o || {}) });
import { submitBatch, pollBatch, fetchBatch } from "../../factory/lib/openai_batch.mjs";
const HERE = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, "$1");
const env = Object.fromEntries(fs.readFileSync(path.join(HERE, "../../.env"), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = (env.AGNES_KEYS || env.AGNES_KEY).split(",").map(s => s.trim()).filter(Boolean); let k = Math.floor(Math.random() * KS.length); const key = () => KS[(k++) % KS.length];
const B = "https://apihub.agnes-ai.com/v1", ROOT = "https://apihub.agnes-ai.com", MODEL = "agnes-video-2.5-flash";
const [, , fase, ...ids] = process.argv;
const D = JSON.parse(fs.readFileSync(path.join(HERE, "details.json"), "utf8"));
const sleep = ms => new Promise(r => setTimeout(r, ms)); const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const anc = d => d.cl.replace(/clips\/?$/, "anc/");
const OUT = path.join(HERE, "_det_anc/"); fs.mkdirSync(OUT, { recursive: true });

async function ronda(items, outDir) {
  if (!items.length) return;
  const s = await submitBatch({ items, outDir });
  if (!s.batchId) return;
  log("batch", s.batchId, s.endpoint, s.n);
  for (;;) { const p = await pollBatch(s.batchId); if (p.status === "completed") break;
    if (["failed", "expired", "cancelled"].includes(p.status)) throw new Error("batch " + p.status + " " + JSON.stringify(p.errors || {}).slice(0, 200));
    await sleep(20000); }
  const f = await fetchBatch({ batchId: s.batchId, outDir, onLog: log }); log("bajadas", f.ok, "fallas", f.fail);
  if (!f.ok) throw new Error("batch completed con 0 ok");
}
if (fase === "anclas") {
  const sel = D.filter(d => !ids.length || ids.includes(d.id));
  await ronda(sel.map(d => ({ name: `D_${d.id}_1`, prompt: d.p1 })), OUT);
  for (const d of sel) { const f = OUT + `D_${d.id}_1.png`; if (fs.existsSync(f)) { const s = OUT + `D_${d.id}_1_s.jpg`; if (!fs.existsSync(s)) ff("-i", f, "-vf", "scale=384:216", "-q:v", "3", s); } }
  await ronda(sel.filter(d => fs.existsSync(OUT + `D_${d.id}_1.png`)).map(d => ({ name: `D_${d.id}_2`, prompt: d.p2, ref: OUT + `D_${d.id}_1_s.jpg` })), OUT);
  for (const d of sel) for (const n of [1, 2]) { const s = OUT + `D_${d.id}_${n}.png`; if (fs.existsSync(s)) { fs.mkdirSync(anc(d), { recursive: true }); fs.copyFileSync(s, anc(d) + `D_${d.id}_${n}.png`); } }
  log("anclas de detalle listas:", sel.filter(d => fs.existsSync(anc(d) + `D_${d.id}_2.png`)).length, "/", sel.length);
}
const uri = f => `data:image/png;base64,` + fs.readFileSync(f).toString("base64");
async function gen(cl, id, body) {
  let vid, kk; // consulta con la MISMA clave que creó el job (las claves no comparten jobs)
  for (let t = 0; t < 400 && !vid; t++) {
    const j = await (await fetch(B + "/videos", { method: "POST", headers: { Authorization: "Bearer " + (kk = key()), "Content-Type": "application/json" }, body: JSON.stringify({ model: MODEL, size: "720P", aspect_ratio: "16:9", ...body }) })).json().catch(() => ({}));
    vid = j.video_id || j.id;
    if (!vid) { const m = JSON.stringify(j); if (!/queue|rate|limit|busy/i.test(m)) { log("REJECT", id, m.slice(0, 200)); return; } await sleep(25000 + Math.random() * 10000); }
  }
  if (!vid) return log("GAVE UP", id); log("en cola", id); const t0 = Date.now();
  while (Date.now() - t0 < 60 * 60e3) {
    await sleep(20000);
    const g = await (await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}&model_name=${MODEL}`, { headers: { Authorization: "Bearer " + kk } })).json().catch(() => ({}));
    if (g.status === "completed" && g.url) { fs.writeFileSync(cl + id + ".mp4", Buffer.from(await (await fetch(g.url)).arrayBuffer())); return log("OK", id, Math.round((Date.now() - t0) / 1000) + "s"); }
    if (/fail|error|cancel/i.test(g.status || "")) return log("FAIL", id, JSON.stringify(g).slice(0, 200));
  }
  log("TIMEOUT", id);
}
if (fase === "clips") {
  const sel = D.filter(d => !ids.length || ids.includes(d.id) || ids.includes(d.scene));
  const regen = ids.some(i => D.some(d => d.id === i));
  await Promise.all(sel.map((d, i) => sleep(i * 4000).then(async () => {
    const a1 = anc(d) + `D_${d.id}_1.png`, a2 = anc(d) + `D_${d.id}_2.png`;
    if (!fs.existsSync(a1) || !fs.existsSync(a2)) return log("sin anclas", d.id);
    const SF = d.cl + "state_det.json", st0 = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, "utf8")) : {};
    if (!regen && st0[d.id]) return;
    const out = regen ? d.id + "r" + Date.now().toString(36).slice(-3) : d.id;
    await gen(d.cl, out, { mode: "keyframe", seconds: String(d.T), first_frame: uri(a1), last_frame: uri(a2), prompt: d.kprompt });
    if (fs.existsSync(d.cl + out + ".mp4")) { const s = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, "utf8")) : {}; s[d.id] = { file: out + ".mp4", T: d.T, own: !!d.own }; fs.writeFileSync(SF, JSON.stringify(s, null, 1)); }
  })));
  log("detalles listos");
}
