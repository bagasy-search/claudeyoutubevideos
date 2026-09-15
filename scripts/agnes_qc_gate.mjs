// agnes_qc_gate.mjs — BLOQUEO del farm: no se rendea ningún clip de agnes sin control de calidad.
// Lo llama scripts/farm.mjs antes de empaquetar. También sirve suelto:
//   node scripts/agnes_qc_gate.mjs <slug> [lista_assets.txt]
//
// Exige, para cada clip de agnes que entra al render (registro `_v3/<slug>_agnes_clips.json` o listas
// `_v3/<slug>_i2v*.json`):
//   1. un sello en `_v3/<slug>_agnes_qc.json` con ok:true
//   2. que el archivo NO haya cambiado desde el sello (tamaño + fecha): un clip regenerado después
//      del control no está controlado
//   3. repetición medida y en cero: ningún plano más largo que su clip, ningún clip en dos planos
// Escape de emergencia, a la vista: AGNES_QC_OVERRIDE="<motivo>" (queda impreso en el log del farm).
import fs from "node:fs";
import path from "node:path";

export function agnesGate(slug, assets = null) {
  const info = new Set();
  const reg = `_v3/${slug}_agnes_clips.json`;
  if (fs.existsSync(reg)) Object.keys(JSON.parse(fs.readFileSync(reg, "utf8"))).forEach((n) => info.add(n));
  if (fs.existsSync("_v3")) for (const f of fs.readdirSync("_v3").filter((f) => f.startsWith(`${slug}_i2v`) && f.endsWith(".json"))) {
    try { const a = JSON.parse(fs.readFileSync(`_v3/${f}`, "utf8").replace(/^﻿/, "")); if (Array.isArray(a)) a.forEach((it) => it?.nombre && info.add(it.nombre)); } catch {}
  }
  // clips de agnes que de verdad viajan en el render
  const enRender = [...info].map((n) => `broll/${slug}/${n}.mp4`).filter((r) => fs.existsSync(path.join("public", r)))
    .filter((r) => !assets || assets.some((a) => r === a || r.startsWith(a.replace(/\/*$/, "") + "/")));
  if (!enRender.length) return { ok: true, msg: `agnes QC: 0 clips de agnes en este render (${info.size} registrados)` };

  const probs = [];
  const qcPath = `_v3/${slug}_agnes_qc.json`;
  if (!fs.existsSync(qcPath)) probs.push(`no existe ${qcPath} → corré: node scripts/agnes_qc.mjs ${slug} --fix`);
  else {
    const qc = JSON.parse(fs.readFileSync(qcPath, "utf8"));
    let sinSello = 0, conDefecto = 0, cambiados = 0; const ej = [];
    for (const r of enRender) {
      const n = path.basename(r, ".mp4"), c = qc.clips?.[n], st = fs.statSync(path.join("public", r));
      if (!c) { sinSello++; ej.push(`${n}: sin sello`); continue; }
      if (!c.ok || c.removed) { conDefecto++; ej.push(`${n}: ${c.issue} ${c.why || ""}`); continue; }
      if (c.size !== st.size || c.mtime !== Math.round(st.mtimeMs)) { cambiados++; ej.push(`${n}: cambió después del control`); }
    }
    if (sinSello || conDefecto || cambiados) probs.push(`${enRender.length} clips de agnes · sin sello ${sinSello} · con defecto ${conDefecto} · modificados después del control ${cambiados}\n      ${ej.slice(0, 10).join("\n      ")}`);
    const rep = qc.repeticion;
    if (!rep) probs.push(`repetición NO medida: el build tiene que emitir _v3/${slug}_cues.json ([{key,src,start,dur}] de la capa base) y volver a correr agnes_qc`);
    else if (rep.loops || rep.dobles) probs.push(`repetición: ${rep.loops} planos más largos que su clip (el loop repite el movimiento) · ${rep.dobles} clips usados en más de un plano\n      ${(rep.ejemplos || []).slice(0, 8).join("\n      ")}`);
  }
  if (!probs.length) return { ok: true, msg: `agnes QC ✓ (${enRender.length} clips controlados y sin cambios · repetición 0)` };
  if (process.env.AGNES_QC_OVERRIDE) return { ok: true, msg: `⚠️⚠️ agnes QC SALTEADO a mano (AGNES_QC_OVERRIDE="${process.env.AGNES_QC_OVERRIDE}"):\n    ${probs.join("\n    ")}` };
  return { ok: false, msg: `✗ PRE-VUELO AGNES QC:\n    ${probs.join("\n    ")}` };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) {
  const [slug, lista] = process.argv.slice(2);
  if (!slug) { console.error("uso: node scripts/agnes_qc_gate.mjs <slug> [lista_assets.txt]"); process.exit(1); }
  const assets = lista && fs.existsSync(lista) ? fs.readFileSync(lista, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : null;
  const r = agnesGate(slug, assets);
  (r.ok ? console.log : console.error)(r.msg);
  process.exit(r.ok ? 0 : 1);
}
