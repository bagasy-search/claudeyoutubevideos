/**
 * anchor_quesos.mjs — alineación GLOBAL guion↔ASR (SequenceMatcher-style) para el video quesosrenal.
 * Lee public/quesosrenal_guion.txt + public/captions_quesosrenal.json.
 * Resuelve el FRAME (30fps) de cada frase-ancla y escribe _v3/quesosrenal_anchors.json.
 */
import fs from 'fs';

const FPS = 30;
const norm = (s) =>
  s.toLowerCase()
    .replace(/\[[a-z ]+\]/g, ' ')
    .replace(/[^a-záéíóúñü0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const guion = fs.readFileSync('public/quesosrenal_guion.txt', 'utf8');
const caps = JSON.parse(fs.readFileSync('public/captions_quesosrenal.json', 'utf8'));
const S = norm(guion); // palabras del guion
const A = caps.map((w) => ({ t: (w.text || '').trim().toLowerCase().replace(/[^a-záéíóúñü0-9]/g, ''), ms: w.startMs }));
const AW = A.map((x) => x.t).filter(Boolean);
const AMS = A.filter((x) => x.t).map((x) => x.ms);

// LCS-based opcodes (difflib-like) — simple O(n*m) DP sobre secuencias de palabras
function opcodes(a, b) {
  const n = a.length, m = b.length;
  // DP de LCS
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  // backtrack a bloques equal/replace
  const ms = new Array(n).fill(null);
  let i = 0, j = 0;
  let lastMs = 0;
  const flushReplace = (i1, i2, j1, j2) => {
    const a0 = j1 < AMS.length ? AMS[j1] : lastMs;
    const b0 = j2 - 1 >= 0 && j2 - 1 < AMS.length ? AMS[j2 - 1] : a0;
    const span = Math.max(1, i2 - i1);
    for (let k = 0; k < i2 - i1; k++) ms[i1 + k] = a0 + ((b0 - a0) * k) / span;
  };
  let ri = i, rj = j;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      if (ri < i || rj < j) flushReplace(ri, i, rj, j);
      ms[i] = AMS[j] ?? lastMs;
      lastMs = ms[i];
      i++; j++; ri = i; rj = j;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  if (ri < n) flushReplace(ri, n, rj, m);
  // monotonía
  let cur = 0;
  for (let k = 0; k < n; k++) {
    if (ms[k] == null) ms[k] = cur;
    ms[k] = Math.max(ms[k], cur);
    cur = ms[k];
  }
  return ms;
}

const MS = opcodes(S, AW);

// buscar la posición de una frase (normalizada) en S
function findPos(phrase) {
  const p = norm(phrase);
  for (let i = 0; i + p.length <= S.length; i++) {
    let ok = true;
    for (let k = 0; k < p.length; k++) if (S[i + k] !== p[k]) { ok = false; break; }
    if (ok) return i;
  }
  return -1;
}

const anchors = JSON.parse(fs.readFileSync(process.argv[2] || 'scripts/quesos_anchor_phrases.json', 'utf8'));
const out = {};
let miss = 0;
for (const [label, phrase] of Object.entries(anchors)) {
  const pos = findPos(phrase);
  if (pos < 0) { console.log(`⛔ NO ENCONTRADA: ${label} :: "${phrase}"`); miss++; out[label] = null; continue; }
  const ms = MS[pos];
  out[label] = { frame: Math.round((ms / 1000) * FPS), ms: Math.round(ms), pos };
}
fs.writeFileSync('_v3/quesosrenal_anchors.json', JSON.stringify(out, null, 2));
const total = caps.length ? caps[caps.length - 1].endMs : 0;
console.log(`palabras guion=${S.length} · asr=${AW.length} · faltantes=${miss}`);
console.log(`TOTAL_FRAMES(audio)=${Math.round((total / 1000) * FPS)}  (${(total/1000).toFixed(1)}s)`);
console.log(JSON.stringify(out, null, 1));
