// vlog_anclas_batch.mjs — ANCLAS del VLOG CONTINUO por la Batch API, en RONDAS (las 4 palancas de gpt-image-2:
// low · Batch · 1088x608 · ref de cara = crop 128x192). K(n) depende de K(n-1): cada ronda junta el ancla "lista
// para generar" de TODAS las escenas (dependencias ya en disco) en UN batch; se baja, hoja rápida, y sigue la próxima.
//
//   node scripts/vlog_anclas_batch.mjs <plan1.json,plan2.json,…> [--once] [--solo S1:K3,S2:K7]
//     --once  → una sola ronda y sale (para medir usage / mirar la hoja)
//   El plan puede traer "face_ref" (PNG 128x192). Si no, usa public/ref_<…>_face.png que se le pase en VLOG_FACE_REF.
//   usage REAL de cada imagen → <dir>/usage_gptimage.jsonl (tarifa Batch: img-in $4/M · texto $2,50/M · img-out $15/M).
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Readable } from "node:stream";

const args = process.argv.slice(2);
const plans = args[0].split(",").map(p => ({ file: p, P: JSON.parse(fs.readFileSync(p, "utf8")) }));
const ONCE = args.includes("--once");
const soloArg = args.includes("--solo") ? args[args.indexOf("--solo") + 1].split(",") : null;
const env = Object.fromEntries(fs.readFileSync(new URL("../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#"))
  .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const H = { Authorization: "Bearer " + env.OPENAI_API_KEY };
const SIZE = "1088x608";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const mime = f => f.endsWith(".png") ? "image/png" : "image/jpeg";
const cache = new Map();
const uri = f => { if (!cache.has(f)) cache.set(f, `data:${mime(f)};base64,` + fs.readFileSync(f).toString("base64")); return cache.get(f); };

const LIGHT = " BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still. Real skin with visible pores, fine lines and natural texture, not smooth, not plastic, not retouched.";
const IDENT = " IDENTITY: the presenter must have EXACTLY the face of the man/woman in the LAST input image (a small close-up of the real face): same face shape, eyes, nose, eyebrows, hair and beard, same age — copy that face, do not let it drift, do not make them younger or more attractive. The last image is only for the face; the scene comes from the first image. Do NOT add objects that are not described. Keep the same framing and the same distance from the camera as the first image unless the text asks for a close-up.";

for (const x of plans) {
  const P = x.P;
  x.DIR = P.dir.replace(/\\/g, "/").replace(/\/?$/, "/"); x.ANC = x.DIR + "anc/"; fs.mkdirSync(x.ANC, { recursive: true });
  x.S = path.basename(P.dir);
  x.face = P.face_ref || process.env.VLOG_FACE_REF;
  if (!x.face) throw new Error("falta face_ref (crop 128x192) en " + x.file);
  x.ref = n => n === "k0" ? P.k0_from : /^K\d+$/.test(n) ? x.ANC + n + ".png" : (P.extra_anc || {})[n] || (P.extra || {})[n] || n;   // extra_anc = versiones CHICAS (cara 128x192) para gpt-image
}
async function api(p, opt = {}) {
  for (let t = 0; t < 6; t++) {
    try { const r = await fetch("https://api.openai.com/v1" + p, { ...opt, headers: { ...H, ...(opt.headers || {}) }, signal: AbortSignal.timeout(300000) });
      const j = await r.json(); if (!r.ok) throw new Error(r.status + " " + JSON.stringify(j).slice(0, 300)); return j; }
    catch (e) { log("api retry", p, String(e).slice(0, 200)); await sleep(10000); }
  }
  throw new Error("api falló " + p);
}
function pendientes() {
  const out = [];
  for (const x of plans) for (const a of x.P.anchors) {
    if (soloArg && !soloArg.includes(x.S + ":" + a.id)) continue;
    const dst = x.ANC + a.id + ".png"; if (fs.existsSync(dst)) continue;
    const ins = a.from.map(x.ref);
    if (ins.every(f => fs.existsSync(f))) out.push({ x, a, dst, ins });
  }
  return out;
}
let ronda = 0;
for (;;) {
  const pend = pendientes();
  if (!pend.length) { log("no hay anclas listas para generar"); break; }
  ronda++;
  const lines = pend.map(({ x, a, ins }) => JSON.stringify({ custom_id: x.S + "__" + a.id, method: "POST", url: "/v1/images/edits",
    body: { model: "gpt-image-2", quality: "low", size: SIZE, n: 1, prompt: a.prompt + (a.id === "K0" ? "" : " Everything else identical.") + IDENT + LIGHT,
      images: [...ins, x.face].map(f => ({ image_url: uri(f) })) } }));
  const fd = new FormData(); fd.append("purpose", "batch");
  fd.append("file", new Blob([lines.join("\n") + "\n"], { type: "application/jsonl" }), `anclas_r${ronda}.jsonl`);
  const f = await api("/files", { method: "POST", body: fd });
  const b = await api("/batches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input_file_id: f.id, endpoint: "/v1/images/edits", completion_window: "24h" }) });
  log(`ronda ${ronda}: ${pend.length} anclas (${pend.map(p => p.x.S + ":" + p.a.id).join(" ")}) → batch ${b.id}`);
  let st; const t0 = Date.now();
  for (;;) { await sleep(20000); st = await api("/batches/" + b.id); if (["completed", "failed", "expired", "cancelled"].includes(st.status)) break; }
  log(`ronda ${ronda}: ${st.status} en ${Math.round((Date.now() - t0) / 1000)} s · ${JSON.stringify(st.request_counts)}`);
  const byId = Object.fromEntries(pend.map(p => [p.x.S + "__" + p.a.id, p]));
  let ok = 0, fail = 0, cost = 0;
  for (const fid of [st.output_file_id, st.error_file_id].filter(Boolean)) {
    const res = await fetch(`https://api.openai.com/v1/files/${fid}/content`, { headers: H });
    const rl = readline.createInterface({ input: Readable.fromWeb(res.body), crlfDelay: Infinity });
    for await (const ln of rl) {
      if (!ln.trim()) continue; const r = JSON.parse(ln), p = byId[r.custom_id]; if (!p) continue;
      const body = r.response?.body, d = body?.data?.[0];
      if (d?.b64_json) {
        fs.writeFileSync(p.dst, Buffer.from(d.b64_json, "base64")); ok++;
        const u = body.usage, di = u.input_tokens_details || {};
        const c = (di.image_tokens || 0) * 4e-6 + (di.text_tokens || 0) * 2.5e-6 + (u.output_tokens || 0) * 15e-6; cost += c;
        fs.appendFileSync(p.x.DIR + "usage_gptimage.jsonl", JSON.stringify({ a: p.a.id, batch: b.id, usd_batch: +c.toFixed(5), u }) + "\n");
      } else { fail++; log("FALLÓ", r.custom_id, JSON.stringify(r.response?.body || r.error).slice(0, 250)); }
    }
  }
  log(`ronda ${ronda}: MEDIDO ${ok}/${pend.length} ok · ${fail} fallidas · US$${cost.toFixed(4)} (${ok ? (cost / ok).toFixed(5) : "-"}/img, tarifa Batch)`);
  if (!ok) { log("ronda sin imágenes: paro"); process.exit(2); }
  if (ONCE) break;
}
