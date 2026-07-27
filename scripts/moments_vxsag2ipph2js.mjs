// Chunkea las captions de vxsag2ipph2js en MOMENTOS y arma el capdump para los directores.
// Salida: _v3/vxsag2ipph2js_clipbeats.json  +  _v3/vxsag2ipph2js_capdump.txt
import fs from "node:fs";

const SLUG = "vxsag2ipph2js";
const raw = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const caps = Array.isArray(raw) ? raw : raw.captions || raw.words;

// Un momento arranca cuando: se acumularon >= TARGET ms, o hay un silencio >= GAP,
// o la palabra anterior terminaba en signo fuerte de puntuacion.
const TARGET = 3050;
const MAXMS = 6600;
const GAP = 260;

const moments = [];
let cur = null;
for (let i = 0; i < caps.length; i++) {
  const w = caps[i];
  const prev = caps[i - 1];
  if (!cur) {
    cur = { startMs: w.startMs, endMs: w.endMs, words: [w.text.trim()] };
    continue;
  }
  const dur = w.endMs - cur.startMs;
  const gap = prev ? w.startMs - prev.endMs : 0;
  const hardStop = prev && /[.?!]$/.test(prev.text.trim());
  const softStop = prev && /[,;:]$/.test(prev.text.trim());
  const shouldCut =
    dur > MAXMS ||
    (dur >= TARGET && (hardStop || gap >= GAP)) ||
    (dur >= TARGET * 1.1 && softStop) ||
    (dur >= 2300 && gap >= 700);
  if (shouldCut) {
    moments.push(cur);
    cur = { startMs: w.startMs, endMs: w.endMs, words: [w.text.trim()] };
  } else {
    cur.endMs = w.endMs;
    cur.words.push(w.text.trim());
  }
}
if (cur) moments.push(cur);

// Fusiona los momentos ridiculamente cortos (<1600ms) con el vecino mas corto.
for (let i = 0; i < moments.length; i++) {
  if (moments[i].endMs - moments[i].startMs < 1600 && moments.length > 1) {
    const prev = moments[i - 1];
    const next = moments[i + 1];
    const target =
      !prev ? next : !next ? prev : (prev.endMs - prev.startMs) <= (next.endMs - next.startMs) ? prev : next;
    target.startMs = Math.min(target.startMs, moments[i].startMs);
    target.endMs = Math.max(target.endMs, moments[i].endMs);
    target.words = target === prev ? [...target.words, ...moments[i].words] : [...moments[i].words, ...target.words];
    moments.splice(i, 1);
    i--;
  }
}

const beats = moments.map((m, i) => ({
  name: `${SLUG}_s_${String(i).padStart(3, "0")}`,
  idx: i,
  startMs: m.startMs,
  endMs: m.endMs,
  durSec: +((m.endMs - m.startMs) / 1000).toFixed(2),
  phrase: m.words.join(" ").replace(/\s+/g, " ").trim(),
}));

fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_clipbeats.json`, JSON.stringify(beats, null, 1));
fs.writeFileSync(
  `_v3/${SLUG}_capdump.txt`,
  beats.map((b) => `[${b.idx}] ${(b.startMs / 1000).toFixed(2)}s (+${b.durSec}s) ${b.phrase}`).join("\n")
);

const durs = beats.map((b) => b.durSec).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
console.log(
  `momentos: ${beats.length} | total ${(beats[beats.length - 1].endMs / 1000).toFixed(1)}s` +
    ` | mediana ${q(0.5)}s | p10 ${q(0.1)}s | p90 ${q(0.9)}s | max ${durs[durs.length - 1]}s` +
    ` | >=5s: ${durs.filter((d) => d >= 5).length} (${((durs.filter((d) => d >= 5).length / durs.length) * 100).toFixed(0)}%)`
);
