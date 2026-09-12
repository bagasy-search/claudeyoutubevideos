// build_broll_extra_ns.mjs — SEGUNDA tanda de b-roll (prefijo e) para DENSIFICAR el bed.
// Genera cues en los MEDIOS de los gaps (step 12, saltando la ventana lámina), resuelve a ms,
// y descarga Pexels a public/broll/nightserum/eNNN.mp4. Escribe public/broll/extra_ns.json
// [{name,src,start,query}] para mergear luego (finalize_v2).
import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";

const caps = JSON.parse(fs.readFileSync("public/captions_nightserum.json", "utf8").replace(/^﻿/, ""));
const W = (caps.words || caps).map((x) => ({ w: x.text, s: (x.startMs || 0) / 1000 }));
const beats = JSON.parse(fs.readFileSync("beatsheet/nightserum.json", "utf8")).beats;
const VEND = W[W.length - 1].s;
const clean = (w) => /^[a-zA-Z]+$/.test((w || "").trim());
const phraseAt = (t) => { let i = W.findIndex((x) => x.s >= t); if (i < 0) return null; for (; i < W.length - 4; i++) { const run = [W[i], W[i + 1], W[i + 2], W[i + 3]]; if (run.every((x) => clean(x.w))) return { at: run.map((x) => x.w.trim()).join(" "), t: run[0].s }; } return null; };

// pools SIMPLES (los que rindieron on-topic en la 1ª tanda)
const POOLS = {
  intro: ["aloe vera plant", "fresh rosemary", "aloe vera leaf", "rosemary herb"],
  pain: ["wrinkled hands", "elderly hands", "old woman hands", "senior skin close up", "mature woman face"],
  raisin: ["grapes", "bunch of grapes", "raisins", "green grapes"],
  patient: ["senior woman thoughtful", "elderly hands", "older woman at home"],
  creamfail: ["face cream jar", "applying face cream", "cosmetic products", "skincare cream"],
  reveal: ["aloe vera plant", "fresh rosemary", "aloe vera leaf"],
  aloe: ["aloe vera gel", "aloe vera leaf", "aloe vera plant", "clear gel"],
  rosemary: ["rosemary", "rosemary oil", "essential oil bottle", "fresh rosemary"],
  night: ["night sky moon", "woman sleeping", "bedroom at night", "full moon"],
  villain: ["cosmetic products shelf", "coins savings jar", "cream jar white"],
  mistakes: ["applying face cream", "moisturizing skin", "woman skincare"],
  routine: ["aloe vera leaf", "applying face oil", "herbal oil", "skincare bottle"],
  safety: ["rosemary", "aloe vera leaf", "woman applying serum"],
  close: ["older woman smiling skin", "aloe vera plant", "healthy skin close up"],
};
const KEYMAP = [[/^hook/, "intro"], [/^(inventory|hand|crepey_term|reframe_mv)/, "pain"], [/^(grape|iron|night_teaser)/, "raisin"], [/^(ruth|paper)/, "patient"], [/^(whyfail|roof|shelf)/, "creamfail"], [/^(reveal|openloop|promise_desc|intro)/, "reveal"], [/^(aloe_reveal|aloe_water|factories|aloe_two)/, "aloe"], [/^(second_q|evaporates|rosemary_reveal|bodyguard|pair)/, "rosemary"], [/^(whynight|day_defense)/, "night"], [/^(whynone|patent)/, "villain"], [/^(mistakes|m2_order|m3_repetition)/, "mistakes"], [/^(recipe|damp|oil_heat|floodsealsleep)/, "routine"], [/^(safety|sunscreen)/, "safety"], [/^(recap|start|expect|consistency|close)/, "close"]];
const poolForKey = (key) => { for (const [re, p] of KEYMAP) if (re.test(key)) return p; return "reveal"; };
const activeKey = (t) => { let k = beats[0].key; for (const b of beats) if (b.start <= t + 0.01) k = b.key; else break; return k; };
const SKIP = [[1195, 1385]];
const skip = (t) => SKIP.some(([a, b]) => t >= a && t <= b);

const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function dl(url, dest) { for (let a = 0; a < 3; a++) { try { const r = await fetch(url); if (!r.ok) { await sleep(700); continue; } const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 20000) { await sleep(500); continue; } fs.writeFileSync(dest, buf); return true; } catch { await sleep(800); } } return false; }

// cues en t = 15, 15+STEP, ... (offset para caer en los MEDIOS respecto a la 1ª tanda que arrancó en 6 step 19)
const STEP = 12, OFF = 15;
const cues = [];
const lastByPool = {};
for (let t = OFF; t < VEND - 6; t += STEP) {
  if (skip(t)) continue;
  const ph = phraseAt(t); if (!ph) continue;
  const pool = POOLS[poolForKey(activeKey(ph.t))];
  let idx = (lastByPool[pool[0]] ?? -1) + 1; if (idx >= pool.length) idx = 0; lastByPool[pool[0]] = idx;
  cues.push({ at: ph.at, t: ph.t, query: pool[idx] });
}
// resolver contra captions ya está (ph.t). Descargar.
const outDir = "public/broll/nightserum";
const out = [];
let ok = 0;
for (let i = 0; i < cues.length; i++) {
  const name = `e${String(i).padStart(3, "0")}`;
  const dest = `${outDir}/${name}.mp4`;
  const q = cues[i].query;
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) { try { hit = await fn(q, 8, used); } catch { hit = null; } if (hit && hit.link) break; }
  if (hit && hit.link && await dl(hit.link, dest)) { if (hit.key) used.add(hit.key); out.push({ name, src: `broll/nightserum/${name}.mp4`, start: +cues[i].t.toFixed(2), query: q }); ok++; }
  await sleep(180);
}
fs.writeFileSync("public/broll/extra_ns.json", JSON.stringify(out, null, 1));
console.log(`extra cues ${cues.length} → descargados ${ok} → public/broll/extra_ns.json`);
