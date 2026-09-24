// gen_fcskiwi.mjs — beatsheet/fcskiwi.json (Canal "Federer Archivos" · Video PIÑA/COÁGULOS).
// "La Fruta que limpia los Coágulos de las Piernas" — PIÑA / bromelina para la circulación de las
// piernas +60. La fibrina que espesa la sangre = SARRO en una cañería; la bromelina = destapacaños;
// "el segundo corazón" = la pantorrilla. TEMA SERIO → banda de honestidad marcada y clara.
// Avatar fcskiwi_opt.mp4 (~20.6min). Kit CLÍNICO _fed6. Clon EXACTO de gen_fcsromero.
//
// RUTA SIMPLE Y ROBUSTA (la que pidió el director): se lee _v3/fcskiwi_beats.json
// (213 beats ya namespaced con prefijo fcskiwi_) y se convierte 1:1 según mediakind:
//   - mediakind:"video" → kind:"raw", src:"broll/fcskiwi_s_NN.mp4"  → CAPA b-roll (FCSKIWI_BROLL)
//   - mediakind:"image" → kind:"raw", src:"img/fcskiwi_s_NN.png"    → CAPA fotos (rawTop, Main filtra /^(img|vid)\//)
//   - sin asset  → kind:"talk" (avatar full a cámara)
// + OVERLAY de COMPONENTES premium en los rangos del §0 DIRECTOR, anclados a la FRASE real.
//
// TIMING: s_01..s_53 traen ms/dur reales. El centro s_54..s_213 NO trae ms (solo `anchor`) → se
// ancla por frase a captions_fcskiwi.json cuando matchea, con guarda de ventana local; lo
// no-matcheable se interpola linealmente entre anclas conocidas por índice.
import fs from "fs";

const SLUG = "fcskiwi";
const VIDEO_END = 1264; // duración real del wav — la comp NUNCA es menor que el audio

// ── captions (anclaje por frase, idéntico al template validado) ───────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

// ── beats autorados ───────────────────────────────────────────────────────────
const SRC = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const N = SRC.length;
const hard = new Array(N).fill(null);
const ANCHOR_WINDOW = 22; // s de tolerancia respecto de la expectativa lineal local

// pass A — ms directo (monotónico): cubre s_01..s_53.
let cursor = 0;
for (let i = 0; i < N; i++) {
  if (SRC[i].ms != null) { const st = +(SRC[i].ms / 1000).toFixed(3); if (st > cursor) { hard[i] = st; cursor = st; } }
}
// pass B — anclaje por frase para CUALQUIER hueco interior entre dos anclas ms conocidas,
// con guarda de ventana local (evita que un anchor genérico matchee lejísimos y arrastre).
const knownIdx = []; for (let i = 0; i < N; i++) if (hard[i] != null) knownIdx.push(i);
for (let g = 0; g < knownIdx.length - 1; g++) {
  const a = knownIdx[g], c = knownIdx[g + 1];
  if (c - a <= 1) continue;
  let lo = hard[a];
  for (let i = a + 1; i < c; i++) {
    const exp = hard[a] + (hard[c] - hard[a]) * ((i - a) / (c - a));
    const ms = findMs(SRC[i].anchor, lo + 0.3);
    if (ms != null && ms > lo + 0.3 && ms < hard[c] - 0.3 && Math.abs(ms - exp) <= ANCHOR_WINDOW) { hard[i] = ms; lo = ms; }
  }
}
// 2) rellenar huecos (nulls) por interpolación lineal entre anclas conocidas por índice
const start = new Array(N);
for (let i = 0; i < N; i++) {
  if (hard[i] != null) { start[i] = hard[i]; continue; }
  let a = i - 1; while (a >= 0 && hard[a] == null) a--;
  let c = i + 1; while (c < N && hard[c] == null) c++;
  const sA = a >= 0 ? hard[a] : 0;
  const sC = c < N && hard[c] != null ? hard[c] : VIDEO_END;
  const iA = a >= 0 ? a : -1;
  const iC = c < N && hard[c] != null ? c : N;
  start[i] = +(sA + (sC - sA) * ((i - iA) / (iC - iA))).toFixed(3);
}
// 3) monotónico con piso de separación
const MINGAP = 0.4;
for (let i = 1; i < N; i++) if (start[i] < start[i - 1] + MINGAP) start[i] = +(start[i - 1] + MINGAP).toFixed(3);

// 4) construir beats raw/talk (chain dur) — src por mediakind
const beats = [];
for (let i = 0; i < N; i++) {
  const b = SRC[i];
  const st = start[i];
  const nx = i + 1 < N ? start[i + 1] : VIDEO_END;
  const dur = +Math.max(0.6, nx - st).toFixed(2);
  const beat = { id: b.name, start: +st.toFixed(2), dur, key: "s" };
  if (!b.asset) beat.kind = "talk";
  else if (b.mediakind === "image" || /\.png$/.test(b.asset)) { beat.kind = "raw"; beat.src = `img/${SLUG}_${b.name}.png`; }
  else { beat.kind = "raw"; beat.src = `broll/${SLUG}_${b.name}.mp4`; }
  beats.push(beat);
}
const startOf = (name) => { const b = beats.find((x) => x.id === name); return b ? b.start : null; };

// ── b-roll layer (stock .mp4) — CAPA 1 continua ───────────────────────────────
const FCS_BROLL = [];
for (let i = 0; i < N; i++) {
  const b = SRC[i];
  if (b.asset && b.mediakind === "video") {
    const st = start[i];
    const nx = i + 1 < N ? start[i + 1] : VIDEO_END;
    FCS_BROLL.push({ name: b.name, src: `broll/${SLUG}_${b.name}.mp4`, start: +st.toFixed(2), dur: +Math.max(0.8, nx - st).toFixed(2), query: b.desc || "" });
  }
}

// ── OVERLAY de COMPONENTES premium (anclados a la frase real del beat) ─────────
// timeline no es un kind soportado en _fed6 → la EXPECTATIVA semana a semana va como `process`
// (NumberedSteps). bars/splitlist/checklist/chips/nametag → renderFederer2Comp (COMP2_KINDS).
const CMP = [
  // ESTUDIO real del kiwi (s_27) — qué encontraron
  { at: "s_27", phrase: "un par de kiwis", kind: "chips", title: "Lo que vio un estudio real", items: ["2 kiwis, 1 hora antes de dormir", "Se durmieron más rápido", "Menos despertares de noche", "Durmieron más horas"] },
  // MECANISMO 1 — "el taller nocturno": la hormona que repara el músculo entra en sueño profundo (s_33–s_51)
  { at: "s_49", phrase: "la mayor parte de la hormona", kind: "avatarpizarra", items: [
    { card: "1 · De noche, el cuerpo desarma músculo", sub: "llevas horas sin comer y saca energía de tu propio músculo", atPhrase: "empieza a desarmar" },
    { card: "2 · Sueño profundo = el taller", sub: "ahí se libera la hormona que repara y reconstruye el músculo", atPhrase: "la mayor parte de la hormona" },
    { card: "3 · Duermes mal → no reparas", sub: "si no llegas al sueño hondo, los 'albañiles' no entran a trabajar", atPhrase: "no entran a trabajar" },
  ] },
  // MITO — "perder músculo es la edad, resígnate" (s_89)
  { at: "s_89", phrase: "perder fuerza y musculo", kind: "mitoverdad", myth: "Perder fuerza y músculo es la edad: resígnate", truth: "Mucho se conserva y se recupera con sueño, comida y movimiento", flipPhrase: "se puede conservar" },
  // ENEMIGO — la industria: bote de proteína + gomitas caras vs kiwi de la esquina (s_94)
  { at: "s_94", phrase: "bote de proteina", kind: "bars", title: "Lo mismo, dos precios", unit: "MXN", bars: [
    { label: "Bote de proteína + gomitas de melatonina", value: 700, tone: "danger", note: "cada mes" },
    { label: "Un kiwi del mercado", value: 5, winner: true, note: "centavos" },
  ] },
  // 3 BENEFICIOS (clímax en el nº3) (s_102)
  { at: "s_102", phrase: "llegues sobre todo al numero tres", kind: "splitlist", title: "Lo que el kiwi le devuelve a tu músculo", items: [
    "1 · Duermes profundo → reparas músculo",
    "2 · Vitamina C → arma el colágeno",
    "3 · Apagas la inflamación que lo derrite",
  ] },
  // MECANISMO 2 — vitamina C = cemento del colágeno (s_116)
  { at: "s_116", phrase: "estan hechos en buena parte de colageno", kind: "avatarpizarra", items: [
    { card: "1 · Tu músculo y tendón = colágeno", sub: "la telita que sostiene tu cuerpo está hecha de colágeno", atPhrase: "hechos en buena parte de colageno" },
    { card: "2 · Sin vitamina C, no hay colágeno", sub: "es como querer levantar una pared sin cemento", atPhrase: "no puede fabricar colageno" },
    { card: "3 · Más vitamina C → más músculo", sub: "los mayores con buena vitamina C tienen más masa y fuerza", atPhrase: "mas masa muscular" },
  ] },
  // MECANISMO 3 — inflamm-aging, punch cinético (evita 3ª pizarra pesada) (s_125)
  { at: "s_125", phrase: "una candelita prendida", kind: "frasecinetica", tone: "amber", perWord: 11, words: ["La", "inflamación", "silenciosa", "derrite", "tu", "músculo.", "Los", "antioxidantes", "del", "kiwi", "la", "apagan."] },
  // HONESTIDAD — el kiwi solo no basta: proteína + movimiento (s_143)
  { at: "s_143", phrase: "la construccion necesita", kind: "checklist", title: "El kiwi no lo hace solo", items: [
    { text: "El kiwi da el material y repara de noche", state: "done" },
    { text: "Suma algo de proteína al día — es el ladrillo", state: "warn" },
    { text: "Muévete: es la orden de '¡este músculo lo necesito!'", state: "warn" },
  ] },
  // RECETA — los 3 secretos (s_157)
  { at: "s_157", phrase: "se come de noche", kind: "process", title: "Cómo comerlo (los 3 secretos)", steps: [
    { title: "El momento", desc: "un par de kiwis ~1 hora antes de dormir, no a mediodía" },
    { title: "Entero, no en jugo", desc: "masticado, con su fibra; hasta la cáscara lavada suma" },
    { title: "Con proteína lenta", desc: "una cucharada de requesón o yogurt natural sin azúcar" },
  ] },
  // ⛔ LÍMITES — banda roja honesta, SERIA y legible (s_180)
  { at: "s_180", phrase: "si tienes diabetes", kind: "checklist", title: "Con honestidad — cuándo NO es para ti", items: [
    { text: "⚠ Diabetes: uno, no tres — consúltalo con tu médico", state: "warn" },
    { text: "⚠ Riñones enfermos: el potasio se acumula — NO sin tu médico", state: "danger" },
    { text: "⚠ Alergia al kiwi/látex (comezón en la boca): para y no lo repitas", state: "warn" },
    { text: "⚠ Si la fuerza se fue de GOLPE → médico YA, no es cosa de una fruta", state: "danger" },
  ] },
  // RECAP 3 pasos (s_205)
  { at: "s_205", phrase: "en tres pasos", kind: "checklist", title: "Los 3 pasos (guárdalo)", items: [
    { text: "1 · Un par de kiwis enteros, ~1 h antes de dormir", state: "done" },
    { text: "2 · Con una cucharada de requesón o yogurt natural", state: "done" },
    { text: "3 · De día: muévete y come tu proteína", state: "done" },
  ] },
  // CTA guía (s_214) — ⛔ NUNCA link/URL ni precio en el video
  { at: "s_214", phrase: "en la guia", kind: "lowerthird", title: "Las cantidades exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cuántos kiwis, cuándo y cómo — todo ahí abajo.", tone: "teal" },
  // Sign-off de marca → Endcard del canal (portrait del doctor ya en disco)
  { at: "s_223", kind: "nametag", name: "Dr. Federer", role: "Cada semana, salud real para tus músculos después de los 60", image: `img/fcsmanchas_s_229.png` },
];

const capOfDur = { avatarpizarra: 8, mitoverdad: 6, bars: 6, splitlist: 7, checklist: 8.5, lowerthird: 6, frasecinetica: 5.5, nametag: 6, process: 9, chips: 6 };
// s_54..s_213 no traen ms → el start del componente sale de interpolación lineal y deriva.
// SNAP opcional: si el spec trae `phrase`, se re-ancla el START a la caption real SOLO si el
// match cae dentro de ±SNAP_GUARD del start interpolado (rechaza falsos matches lejanos).
const SNAP_GUARD = 60;
const missingAnchors = [];
const snapLog = [];
const cmpBeats = [];
for (let k = 0; k < CMP.length; k++) {
  const spec = CMP[k];
  let st = startOf(spec.at);
  if (st == null) { missingAnchors.push(spec.at); continue; }
  if (spec.phrase) {
    const ms = findMs(spec.phrase, Math.max(0, st - SNAP_GUARD));
    if (ms != null && Math.abs(ms - st) <= SNAP_GUARD) { snapLog.push(`${spec.at}:${(ms - st >= 0 ? "+" : "")}${(ms - st).toFixed(0)}s`); st = ms; }
  }
  const { at, phrase, ...rest } = spec;
  const beat = { id: `cmp_${spec.at}_${spec.kind}`, start: +st.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest };
  cmpBeats.push(beat);
}

// ── POST-PASS avatarpizarra (items al ms del avatar) + mitoverdad flip ─────────
const KIT_CLIPS = [];
for (const beat of cmpBeats) {
  if (beat.kind === "avatarpizarra") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...restI } = it; return { ...restI, at: atF };
    });
    const GAP = 90;
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    beat.dur = +(last / 30 + 4.2).toFixed(2);
    // clip OPCIONAL: por defecto NO se setea → el Main usa el avatar completo con trimBefore.
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
}
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

// ── merge + orden + talks ─────────────────────────────────────────────────────
const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));

// ── emit .ts (lo importa el Main) ─────────────────────────────────────────────
const tsBody =
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const FCSKIWI_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const FCSKIWI_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(FCS_BROLL)};\n` +
  `export const FCSKIWI_TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`;
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, tsBody);

// ── emit beatsheet ────────────────────────────────────────────────────────────
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA ────────────────────────────────────────────────────────────────────────
const kinds = {}; ALL.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const need = new Set();
ALL.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); });
FCS_BROLL.forEach((b) => need.add(b.src));
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
const durEnd = Math.max(...ALL.map((b) => b.start + b.dur), ...FCS_BROLL.map((b) => b.start + b.dur));
console.log(`beats: ${ALL.length} (raw ${kinds.raw || 0} · talk ${kinds.talk || 0} · comp ${ALL.length - (kinds.raw || 0) - (kinds.talk || 0)}) · broll: ${FCS_BROLL.length} · fin: ${durEnd.toFixed(0)}s (${(durEnd / 60).toFixed(1)}min) / audio ${VIDEO_END}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`componentes: ${cmpBeats.length} · pizarras KIT_CLIPS: ${KIT_CLIPS.length} · talks: ${talks.length}`);
if (snapLog.length) console.log(`snap por frase (drift corregido):`, snapLog.join(" · "));
if (missingAnchors.length) console.log(`⚠ anchors de componente NO hallados:`, missingAnchors);
console.log(`assets referenciados: ${need.size} · faltantes en public/: ${miss.length}`);
if (miss.length) console.log(`  faltan (primeros 12):`, miss.slice(0, 12));
