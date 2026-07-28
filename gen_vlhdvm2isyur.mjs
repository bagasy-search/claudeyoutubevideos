// gen_vlhdvm2isyur.mjs — arma los BEATS del video (componentes + diagramas + fotos) anclando cada
// momento al ms EXACTO de la palabra en el caption de Whisper. Emite:
//   src/_fed6/VideoEdit/federer_vlhdvm2isyur_beats.ts   (FEDZ_BEATS)
//   src/_fed6/VideoEdit/federer_vlhdvm2isyur_hooks.ts   (TALKSZ — tramos de avatar full)
//   public/_gen_report_vlhdvm2isyur.json                (qué ancló y qué no)
// Entradas: public/captions_vlhdvm2isyur.json + public/comp_plan_vlhdvm2isyur.json
import fs from "fs";

const SLUG = "vlhdvm2isyur";
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs ?? x.start ?? 0) / 1000 }));
const VEND = (CW[CW.length - 1]?.s || 1340) + 2;

const tryRun = (words, after) => {
  for (let i = 0; i < CW.length - words.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < words.length; j++) if (CW[i + j].t !== words[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  for (const n of [6, 5, 4, 3]) {
    if (p.length < n) continue;
    for (let off = 0; off + n <= Math.min(p.length, n + 3); off++) {
      const hit = tryRun(p.slice(off, off + n), after);
      if (hit != null) return hit;
    }
  }
  return null;
};

const plan = JSON.parse(fs.readFileSync(`public/comp_plan_${SLUG}.json`, "utf8"));

// sección a la que pertenece cada beat (para los FULL breves del avatar en Main.buildWindows)
const SECTIONS = [
  { key: "hook", at: null },
  { key: "sujeto", at: "El romero no es un condimento que alguien decidió" },
  { key: "enemigo", at: "¿Y por qué se dejó de usar?" },
  { key: "story", at: "Dejame contarte de Hugo" },
  { key: "principio", at: "Empecemos por lo que casi todos entienden mal" },
  { key: "porque", at: "¿Y por qué el romero?" },
  { key: "seguridad", at: "El aceite esencial de romero NO se usa puro" },
  { key: "rutina", at: "la rutina de Hugo era ridícula de simple" },
  { key: "masaje", at: "Y acá tenés otro dato que se estudió solo" },
  { key: "senal", at: "Pero hay una señal temprana" },
  { key: "error", at: "Y ahora sí, lo que te prometí al principio" },
  { key: "honesto", at: "Hay casos en los que nada de esto es tu respuesta" },
  { key: "recap", at: "Entonces, resumiendo, esta semana" },
  { key: "cierre", at: "Y quedate atento al próximo" },
];
const secMarks = [];
for (const s of SECTIONS) {
  const t = s.at ? findMs(s.at) : 1.3;
  if (t != null) secMarks.push({ key: s.key, t });
}
secMarks.sort((a, b) => a.t - b.t);
const keyAt = (t) => {
  let k = "hook";
  for (const m of secMarks) { if (m.t <= t + 1e-6) k = m.key; else break; }
  return k;
};

// ── anclar el plan de componentes ────────────────────────────────────────────
const beats = [];
const missed = [];
let cursor = 0;
let n = 0;
for (const c of plan) {
  // sin cursor: los planes vienen de varias fuentes y no están en orden de guion. Las frases `at`
  // son largas y únicas, así que la 1ª ocurrencia es la correcta.
  const t = findMs(c.at, 0);
  if (t == null) { missed.push(c.at); continue; }
  cursor = Math.max(cursor, t);
  const { at, dur, ...props } = c;
  const key = keyAt(t);
  // FocusCards: cada tarjeta se ENFOCA cuando el avatar dice su número → atPhrase → frames relativos
  if (props.items && props.items.some((it) => it.atPhrase)) {
    props.items = props.items.map((it) => {
      const { atPhrase, ...rest } = it;
      const ms = atPhrase ? findMs(atPhrase, t - 0.5) : null;
      if (atPhrase && ms == null) missed.push(`item:${atPhrase}`);
      return { ...rest, at: ms == null ? 0 : Math.max(0, Math.round((ms - t) * 30)) };
    });
  }
  beats.push({ id: `${key}_${n}_0`, start: +t.toFixed(2), dur: +(dur || 5), key, ...props });
  n++;
}

// ── TALKS: el avatar a cámara, full, al arrancar cada sección ────────────────
// Se calcula el hueco real hasta el próximo beat para no pisar un componente.
const sorted = [...beats].sort((a, b) => a.start - b.start);
const talks = [];
for (const m of secMarks) {
  const next = sorted.find((b) => b.start > m.t + 0.2);
  const room = next ? next.start - m.t - 0.2 : 3;
  const dur = Math.max(0.8, Math.min(3.4, room));
  if (dur >= 0.8) talks.push({ start: +m.t.toFixed(2), dur: +dur.toFixed(2) });
}

// el primer beat de cada sección tiene que terminar en _0 para que Main lo tome como FULL_AT:
// re-etiquetamos los ids para que SOLO el primero de cada key lleve el sufijo _0.
const seenKey = new Set();
for (const b of sorted) {
  if (!seenKey.has(b.key)) { b.id = `${b.key}_${b.id.split("_")[1]}_0`; seenKey.add(b.key); }
  else b.id = `${b.key}_${b.id.split("_")[1]}_1`;
}

fs.writeFileSync(
  `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — beats anclados al ms del caption.\n` +
    `export const FEDZ_BEATS: any[] = ${JSON.stringify(sorted)};\n`
);
fs.writeFileSync(
  `src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — rangos talk (avatar full a cámara).\n` +
    `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`
);
fs.writeFileSync(`public/_gen_report_${SLUG}.json`, JSON.stringify({ total: plan.length, anclados: beats.length, missed }, null, 1));

const kinds = {};
for (const b of sorted) kinds[b.kind] = (kinds[b.kind] || 0) + 1;
console.log(`beats: ${sorted.length}/${plan.length} anclados · no ancladas ${missed.length}`);
console.log(`secciones: ${secMarks.map((m) => `${m.key}@${m.t.toFixed(0)}s`).join(" ")}`);
console.log(`kinds:`, kinds);
console.log(`talks: ${talks.length} · fin del audio ${VEND.toFixed(1)}s`);
if (missed.length) console.log("NO ANCLADAS:\n - " + missed.join("\n - "));
