// plan_prep_vucm3bvd4u3k.mjs — une los 7 planes de dirección, los valida contra el
// esqueleto de beats (que está anclado al ms de Whisper) y saca las dos listas de
// encargo de assets: b-roll real (match_v3) e imágenes gpt-image-2.
//
//   node scripts/plan_prep_vucm3bvd4u3k.mjs
import fs from "fs";

const SLUG = "vucm3bvd4u3k";
const skel = JSON.parse(fs.readFileSync(`_v3/${SLUG}_skel.json`, "utf8"));
const byName = new Map(skel.map((b) => [b.name, b]));

const plan = [];
const problemas = [];
for (let i = 1; i <= 7; i++) {
  const f = `_v3/plan_${i}.json`;
  if (!fs.existsSync(f)) { problemas.push(`FALTA ${f}`); continue; }
  let arr;
  try { arr = JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, "")); }
  catch (e) { problemas.push(`${f}: JSON inválido — ${e.message}`); continue; }
  if (!Array.isArray(arr)) { problemas.push(`${f}: no es un array`); continue; }
  for (const it of arr) {
    const sk = byName.get(it.name);
    if (!sk) { problemas.push(`${f}: beat desconocido ${it.name}`); continue; }
    plan.push({ ...it, sec: sk.sec, dur: +sk.dur.toFixed(2), phrase: sk.phrase });
  }
}
plan.sort((a, b) => a.sec - b.sec);

// beats que ningún director cubrió → avatar full (nunca un hueco negro)
const cubiertos = new Set(plan.map((p) => p.name));
for (const sk of skel) {
  if (cubiertos.has(sk.name)) continue;
  problemas.push(`beat sin dirección: ${sk.name} (${sk.sec}s) → relleno con avatar full`);
  plan.push({ name: sk.name, mode: "avatar", kicker: null, sec: sk.sec, dur: +sk.dur.toFixed(2), phrase: sk.phrase });
}
plan.sort((a, b) => a.sec - b.sec);

// ── REGLA DURA: los primeros 2 s son avatar full, sin excepción ────────────────
for (const p of plan) {
  if (p.sec < 2.0 && p.mode !== "avatar") {
    problemas.push(`ARRANQUE corregido: ${p.name} (${p.sec}s) era ${p.mode} → avatar`);
    p.mode = "avatar";
  }
}

// ── listas de encargo ─────────────────────────────────────────────────────────
const beatsYt = [];
const imgs = [];
const vistos = new Set();
for (const p of plan) {
  if (p.mode !== "shot") continue;
  if (p.asset === "yt") {
    beatsYt.push({
      name: p.name, section: "s", ms: Math.round(p.sec * 1000), phrase: p.phrase,
      dur: p.dur, desc: p.desc || p.phrase, queries: (p.queries || []).slice(0, 3),
      shot: p.shot || "medium", src: "youtube",
    });
  } else {
    const nm = `${SLUG}_${p.name}`;
    if (vistos.has(nm)) { problemas.push(`imagen duplicada ${nm}`); continue; }
    vistos.add(nm);
    const it = { name: nm, prompt: p.prompt || p.desc || p.phrase };
    if (p.ref) it.ref = `public/ref_${SLUG}.png`;
    imgs.push(it);
    p.img = nm;
  }
}

fs.writeFileSync(`_v3/plan_${SLUG}.json`, JSON.stringify(plan, null, 1));
fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(beatsYt, null, 1));
fs.writeFileSync(`_v3/imgs_${SLUG}.json`, JSON.stringify(imgs, null, 1));

const cnt = (f) => plan.filter(f).length;
const comps = [...new Set(plan.filter((p) => p.mode === "comp").map((p) => p.comp))];
const NB = 5, fin = 1800;
const tramos = Array.from({ length: NB }, () => new Set());
for (const p of plan) if (p.mode === "comp") tramos[Math.min(NB - 1, Math.floor((p.sec / fin) * NB))].add(p.comp);

console.log(`── PLAN ${SLUG} ──`);
console.log(`  beats            : ${plan.length} / ${skel.length}`);
console.log(`  avatar full      : ${cnt((p) => p.mode === "avatar")}`);
console.log(`  shot · b-roll yt : ${beatsYt.length}`);
console.log(`  shot · imagen IA : ${imgs.length}   (con cara de ref: ${imgs.filter((i) => i.ref).length})`);
console.log(`  comp del kit     : ${cnt((p) => p.mode === "comp")}   → ${comps.length} distintos: ${comps.join(", ")}`);
console.log(`  comps por tramo  : ${tramos.map((t) => t.size).join(" · ")}   (mínimo 5 por tramo)`);
const seco = cnt((p) => p.variant === null || p.variant === undefined && p.mode !== "avatar");
console.log(`  cortes secos     : ${cnt((p) => p.mode !== "avatar" && !p.variant)} de ${cnt((p) => p.mode !== "avatar")} visuales`);
if (problemas.length) {
  console.log(`\n⚠ ${problemas.length} avisos:`);
  problemas.slice(0, 25).forEach((x) => console.log("  · " + x));
}
console.log(`\n→ _v3/plan_${SLUG}.json · _v3/${SLUG}_beats.json · _v3/imgs_${SLUG}.json`);
