// gen_shotlist_claude.mjs — shotlist DENSO automático SIN OpenAI (usa el CLI de `claude`).
// Idéntico a gen_shotlist_llm.mjs pero cada batch/repair lo resuelve `claude -p` (Haiku por
// defecto), corriendo desde un dir neutro para NO cargar la memoria de video en cada llamada.
//   node gen_shotlist_claude.mjs <slug> "<tema del video>"
// → public/broll/match_<slug>.json + src/VideoEdit/<slug>_cues.json (cues w001.. densos)
import fs from "fs";
import os from "os";
import { execFileSync } from "child_process";
const MODEL = process.env.SHOTLIST_MODEL || "claude-haiku-4-5-20251001";
const [slug, topic = ""] = process.argv.slice(2);
if (!slug) { console.error("Uso: node gen_shotlist_claude.mjs <slug> \"<tema>\""); process.exit(1); }
const WIN = +(process.env.SHOT_WIN || 3.7); // segundos por clip

// ── claude -p → JSON (corre en /tmp = contexto liviano, sin memoria/skills de video) ──
const TMP = fs.mkdtempSync(os.tmpdir() + "/shotlist_");
function askClaudeJSON(sys, user) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const out = execFileSync("claude", ["-p", user, "--model", MODEL, "--append-system-prompt", sys,
        "--output-format", "json", "--dangerously-skip-permissions"],
        { cwd: TMP, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 300000 });
      let txt = (JSON.parse(out).result || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
      const m = txt.match(/\{[\s\S]*\}/);
      return JSON.parse(m ? m[0] : txt);
    } catch (e) { if (attempt === 3) { console.error("\nclaude batch falló:", (e.message || "").slice(0, 160)); return {}; } }
  }
  return {};
}

const wins = [];
let END;
const capPath = `public/captions_${slug}.json`;
if (fs.existsSync(capPath)) {
  const W = JSON.parse(fs.readFileSync(capPath, "utf8"))
    .map((c) => ({ t: (c.text || "").trim(), s: c.startMs / 1000, e: c.endMs / 1000 }))
    .filter((c) => c.t);
  END = W.length ? W[W.length - 1].e + 1.0 : 0;
  let cur = null;
  for (let k = 0; k < W.length; k++) {
    const w = W[k];
    if (!cur) cur = { start: w.s, end: w.e, words: [w.t] };
    else { cur.end = w.e; cur.words.push(w.t); }
    const len = cur.end - cur.start;
    const gap = k + 1 < W.length ? W[k + 1].s - w.e : 99;
    if (k === W.length - 1 || (len >= WIN * 0.55 && gap >= 0.10) || len >= WIN * 1.08) {
      wins.push({ start: cur.start, end: cur.end, text: cur.words.join(" ") });
      cur = null;
    }
  }
  console.log(`${wins.length} ventanas EXACTAS (Whisper word-level, corte en pausas, ~${WIN}s) sobre ${(END / 60).toFixed(1)} min`);
} else {
  const TM = JSON.parse(fs.readFileSync(`public/${slug}_timing.json`, "utf8"));
  END = TM[TM.length - 1].start + (TM[TM.length - 1].text.length / 14) + 1.5;
  for (let i = 0; i < TM.length; i++) {
    const start = TM[i].start;
    const next = i + 1 < TM.length ? TM[i + 1].start : END;
    const dur = Math.max(0.1, next - start);
    const text = (TM[i].text || "").trim();
    const k = Math.max(1, Math.round(dur / WIN));
    const words = text.split(/\s+/);
    for (let j = 0; j < k; j++) {
      const a = start + (dur * j) / k, b = start + (dur * (j + 1)) / k;
      const w0 = Math.floor((words.length * j) / k), w1 = Math.floor((words.length * (j + 1)) / k);
      const slice = words.slice(w0, Math.max(w1, w0 + 1)).join(" ");
      wins.push({ start: a, end: b, text: slice || text });
    }
  }
  console.log(`${wins.length} ventanas (INTERPOLADAS ~${WIN}s, sin Whisper) sobre ${(END / 60).toFixed(1)} min`);
}

const SYS = `Sos el director de fotografía de un documental de misterio/arqueología (canal "Crónicas Perdidas", español). Te doy la NARRACIÓN CONTINUA partida en fragmentos numerados, EN ORDEN. Para CADA fragmento devolvé el clip de B-ROLL REAL (de YouTube) que va JUSTO ahí.
CÓMO PENSAR (lo MÁS importante):
- Los fragmentos son UN RELATO CONTINUO, no frases sueltas. Antes de elegir, ENTENDÉ de qué se está hablando usando los fragmentos VECINOS y el CONTEXTO PREVIO: resolvé pronombres y objetos implícitos.
  · Ej: si una frase atrás se dijo "lo sellaron con mercurio" y ahora dice "ese líquido", la query es "liquid mercury", NO "water".
  · Ej: si se viene hablando de "la tumba de Qin" y ahora dice "la cámara", es "Qin Shi Huang tomb chamber", no una cámara cualquiera.
- El clip debe mostrar lo que REALMENTE está pasando en ESE punto del relato, no la palabra aislada y descontextualizada.
REGLAS:
- NUNCA uses la palabra literal del narrador; traducí la IDEA (ya resuelta en contexto) a una imagen concreta y filmable.
- Específica, visual, en INGLÉS (para buscar en YouTube), 2-5 palabras. Metraje real que exista: lugares, objetos, gente trabajando, aéreas, primeros planos.
- Coherencia con el TEMA y con la SECCIÓN que se viene narrando.
CLASIFICÁ cada fragmento con "k" (tipo de beat) — esto define si va un clip o no:
- "object" = hay un objeto/lugar/acción FILMABLE concreto → clip normal.
- "abstract" = frase emocional/retórica/de transición SIN objeto filmable ("no deberían existir", "quedate hasta el final", "algo no cierra", "y no es el único"). ⚠ NUNCA inventes una emoción como query (eso trae reacciones/deportes/stock genérico). En su lugar, el concepto DEBE ser el SUJETO CONCRETO de la sección que se está narrando (el artefacto/lugar del momento). Ej: si estamos en la sección del mecanismo de Antikythera y la frase es "no debería existir", c="Antikythera mechanism bronze gears", NO "stunned amazement".
- "data" = número/comparación/estadística ("mil cuatrocientos años", "el 90%") → va un componente gráfico; igual dá un c/q de respaldo del sujeto de la sección.
Devolvé SOLO JSON (sin markdown): {"items":[{"i":<indice>,"k":"object|abstract|data","c":"<concepto visual en inglés, resuelto en contexto>","q":["query1","query2"]}, ...]} un item por fragmento, en orden.`;

function batch(items, ctxText) {
  const user = `TEMA DEL VIDEO: ${topic}\n\n` +
    (ctxText ? `CONTEXTO PREVIO (lo que se venía narrando justo antes — NO generes para esto, es solo para entender):\n"${ctxText}"\n\n` : "") +
    `NARRACIÓN CONTINUA (un clip por fragmento; usá los vecinos como contexto):\n` + items.map((w) => `${w.i}. "${w.text.trim().slice(0, 240)}"`).join("\n");
  return askClaudeJSON(SYS, user).items || [];
}

const indexed = wins.map((w, i) => ({ ...w, i }));
const out = new Map();
const B = 30, CTX = 6;
for (let i = 0; i < indexed.length; i += B) {
  const chunk = indexed.slice(i, i + B);
  const ctxText = indexed.slice(Math.max(0, i - CTX), i).map((w) => w.text.trim()).join(" ");
  const res = batch(chunk, ctxText);
  for (const it of res) if (it && it.i != null) out.set(it.i, it);
  process.stdout.write(`\r  gen ${Math.min(i + B, indexed.length)}/${indexed.length}`);
}
console.log("");

// ── PASADA DE COHERENCIA ──
const RSYS = "Sos un editor de documentales meticuloso. Solo corregís los clips que no encajan con la narración en contexto. Devolvé SOLO JSON sin markdown.";
function repair(items) {
  const user = `TEMA: ${topic}\nAbajo va la narración EN ORDEN con el concepto de clip elegido para cada fragmento. Detectá SOLO los que NO encajan con lo que se narra EN CONTEXTO (genéricos, fuera de tema, o que ignoran un antecedente como "con aceite"/"de mercurio"/"esa cámara"). Para ESOS, devolvé un concepto+queries corregidos usando el contexto de los vecinos. Los que ya están bien, ignoralos.
${items.map((w) => `${w.i}. NARRA: "${w.text.trim().slice(0, 160)}"  →  CLIP: ${w.c}`).join("\n")}
Devolvé SOLO JSON: {"fix":[{"i":<indice>,"c":"<concepto corregido, inglés>","q":["q1","q2"]}, ...]} solo con los que hay que cambiar.`;
  return askClaudeJSON(RSYS, user).fix || [];
}
let fixed = 0;
const RB = 50;
for (let i = 0; i < indexed.length; i += RB) {
  const chunk = indexed.slice(i, i + RB).map((w) => ({ ...w, c: (out.get(w.i) || {}).c || topic }));
  const fixes = repair(chunk);
  for (const f of fixes) if (f && f.i != null && out.has(f.i) && f.c) { out.set(f.i, { ...out.get(f.i), i: f.i, c: f.c, q: Array.isArray(f.q) && f.q.length ? f.q : [f.c] }); fixed++; }
  process.stdout.write(`\r  coherencia ${Math.min(i + RB, indexed.length)}/${indexed.length} · ${fixed} corregidos`);
}
console.log("");

const cues = [], match = [];
for (let i = 0; i < wins.length; i++) {
  const w = wins[i], it = out.get(i) || {};
  const name = "w" + String(i + 1).padStart(3, "0");
  const start = +w.start.toFixed(2), dur = +Math.max(1.5, w.end - w.start).toFixed(2);
  const q = Array.isArray(it.q) && it.q.length ? it.q : [it.c || topic];
  const kind = ["object", "abstract", "data"].includes(it.k) ? it.k : "object";
  cues.push({ name, start, dur, kind });
  match.push({ name, query: q, concept: it.c || topic, dur: Math.max(4, Math.ceil(dur) + 1), kind });
}
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/broll/match_${slug}.json`, JSON.stringify(match, null, 1));
fs.writeFileSync(`src/VideoEdit/${slug}_cues.json`, JSON.stringify(cues, null, 1));
try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
console.log(`✓ ${cues.length} clips densos · ${(END / 60).toFixed(1)} min → match_${slug}.json + ${slug}_cues.json`);
