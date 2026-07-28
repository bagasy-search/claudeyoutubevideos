#!/usr/bin/env node
// ¿Se llegan a LEER los componentes? ¿Y cuánto avatar full hay?
//
// Dos cosas que el creador marcó mirando videos entregados:
//   1. "los componentes son muy rápidos y a veces no se llegan a leer"
//   2. "usa poco al avatar full pantalla"
// Las dos son medibles, así que se miden en vez de discutirse.
//
//   node scripts/legibilidad.mjs <slug>          → informe
//   node scripts/legibilidad.mjs <slug> --gate   → exit 1 si hay tomas ilegibles
//
// LECTURA: ~2,5 palabras/seg para texto en pantalla (hay que NOTARLO antes de leerlo, por eso el
// arranque fijo). Es glanceable, no lectura de libro: el espectador está escuchando al mismo tiempo.
const PAL_SEG = 2.5;
const ARRANQUE = 0.8;   // seg hasta que el ojo va al cartel
const MIN = 2.5, MAX = 8;
const requerido = (pal) => Math.min(MAX, Math.max(MIN, ARRANQUE + pal / PAL_SEG));

// Esto VERIFICA una decision que toma el DIRECTOR, no la reemplaza. Para cada cartel el director
// elige a conciencia: recortar el texto (lo normal) o darle el tiempo que pide y compensar el ritmo
// alrededor (solo si es el dato clave del tramo). Lo que salte aca es un cartel que quedo sin
// resolver — NO se arregla subiendo todo a 8s, que aplanaria el video.
// Referencia para escribir titulares: 12 palabras entran comodas en los ~5,5s que ya suele durar.
const PAL_REF = 12;

// Piso de avatar a pantalla completa. 30% no es un numero inventado: el video que el creador marco
// como el mejor del canal (vki4lqtcboy0) tiene 32,8%, y los que le parecieron flojos 12-21%.
const AVATAR_MIN_PCT = +(process.env.AVATAR_MIN_PCT || 28);

import { readFileSync, existsSync, readdirSync } from "node:fs";

const slug = process.argv[2];
const gate = process.argv.includes("--gate");
if (!slug) { console.error("uso: node scripts/legibilidad.mjs <slug> [--gate]"); process.exit(2); }

const cuesPath = `src/VideoEdit/cues_${slug}.gen.tsx`;
if (!existsSync(cuesPath)) { console.error(`no encuentro ${cuesPath}`); process.exit(2); }
const src = readFileSync(cuesPath, "utf8");

// ── 1) legibilidad de los componentes con texto ──
const lineas = src.split("\n").filter((l) => /kind:\s*"/.test(l));
const tomas = [];
for (const l of lineas) {
  const k = l.match(/kind:\s*"([a-z]+)"/)?.[1];
  const dur = +(l.match(/dur:\s*([\d.]+)/)?.[1] || 0);
  const key = l.match(/key:\s*"([^"]+)"/)?.[1] || "?";
  if (!k || !dur) continue;
  // el texto vive en los strings del JSON de props; se ignoran rutas y claves tecnicas
  const strs = [...l.matchAll(/"([^"]{2,})"/g)].map((m) => m[1])
    .filter((s) => !/^[a-z_]+$/.test(s) && !/\.(png|jpg|jpeg|webp|mp4|webm)$/i.test(s) && !/^(img|broll|vid|real)\//.test(s));
  const pal = strs.join(" ").split(/\s+/).filter((w) => /[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9]/.test(w)).length;
  tomas.push({ key, kind: k, dur, pal });
}
const conTexto = tomas.filter((t) => t.pal >= 3);
const cortas = conTexto.filter((t) => t.dur < requerido(t.pal) - 0.15);

// ── 2) cuánto avatar a pantalla completa ──
let avatar = null;
const av = `src/VideoEdit/avatar_${slug}.gen.ts`;
if (existsSync(av)) {
  const a = readFileSync(av, "utf8");
  const total = +(a.match(/TOTAL_[A-Z0-9_]+\s*=\s*([\d.]+)/)?.[1] || 0);
  const wins = [...a.matchAll(/\{\s*"?start"?:\s*([\d.]+),\s*"?mode"?:\s*"(full|hidden)"/g)]
    .map((m) => ({ at: +m[1], mode: m[2] }));
  if (total && wins.length) {
    let full = 0;
    wins.forEach((w, i) => { if (w.mode === "full") full += (wins[i + 1]?.at ?? total) - w.at; });
    avatar = { total, full, pct: (100 * full) / total, ventanas: wins.filter((w) => w.mode === "full").length };
  }
}

// ── informe ──
console.log(`\n${slug}`);
console.log(`  tomas ${tomas.length} · con texto ${conTexto.length}`);
if (conTexto.length) {
  const d = conTexto.map((t) => t.dur).sort((a, b) => a - b);
  console.log(`  duración de las de texto: mediana ${d[Math.floor(d.length / 2)].toFixed(1)}s · mín ${d[0].toFixed(1)}s · máx ${d[d.length - 1].toFixed(1)}s`);
  console.log(`  ⛔ ILEGIBLES (más cortas de lo que tardan en leerse): ${cortas.length}/${conTexto.length} (${Math.round(100 * cortas.length / conTexto.length)}%)`);
  for (const t of cortas.slice(0, 6)) console.log(`     · ${t.key.padEnd(26)} ${t.pal} palabras en ${t.dur.toFixed(1)}s → recortá el texto (~${PAL_REF} palabras) o dale ${requerido(t.pal).toFixed(1)}s`);
  if (cortas.length > 6) console.log(`     … y ${cortas.length - 6} más`);
  const gordas = conTexto.filter((t) => t.pal > PAL_REF);
  if (gordas.length) {
    const med = gordas.map((t) => t.pal).sort((a, b) => a - b)[Math.floor(gordas.length / 2)];
    console.log(`  → ${gordas.length} pasan de ${PAL_REF} palabras (mediana ${med}). decisión del DIRECTOR para cada uno: recortar el texto, o darle el tiempo y compensar el ritmo alrededor.`);
    console.log(`     un cartel de 8s mata el ritmo; con ~${PAL_REF} palabras entra cómodo en los ~5,5s que ya tiene.`);
  }
}
let avatarBajo = false;
if (avatar) {
  avatarBajo = avatar.pct < AVATAR_MIN_PCT;
  console.log(`  avatar full: ${avatar.pct.toFixed(1)}% del video (${Math.round(avatar.full)}s de ${Math.round(avatar.total)}s, en ${avatar.ventanas} ventanas)${avatarBajo ? `  ⛔ piso ${AVATAR_MIN_PCT}%` : ""}`);
  if (avatarBajo) console.log(`     → abrí más ventanas de avatar full: los momentos donde HABLA de sí mismo, el error del final, la CTA y los remates. Referencia: el mejor video del canal tiene 32,8%.`);
} else {
  console.log(`  avatar full: (sin avatar_${slug}.gen.ts — video faceless o no generado)`);
}

if (gate && (cortas.length || avatarBajo)) {
  console.log("");
  if (cortas.length) console.log(`⛔ BLOQUEADO: ${cortas.length} componentes no se alcanzan a leer — recortá el texto o dales el tiempo que piden.`);
  if (avatarBajo) console.log(`⛔ BLOQUEADO: solo ${avatar.pct.toFixed(1)}% de avatar full (piso ${AVATAR_MIN_PCT}%).`);
  process.exit(1);
}
