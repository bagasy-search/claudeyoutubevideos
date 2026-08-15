// gen_fcsromero.mjs — beatsheet/fcsromero.json (Canal "Federer Archivos" · Video ROMERO).
// "1 Cucharada de Aceite de Romero antes de Dormir" — MACERADO de romero para firmeza/
// luminosidad/circulación de la piel madura. Ancla histórica: Agua de la Reina de Hungría (s.XIV).
// Avatar fcsromero_opt.mp4 (~21.6min). Kit CLÍNICO _fed6. Look = clon de federer6/fcsmanchas.
//
// RUTA SIMPLE Y ROBUSTA (la que pidió el director): se lee _v3/fcsromero_beats.json
// (262 beats ya namespaced con prefijo fcsromero_) y se convierte 1:1 según mediakind:
//   - mediakind:"video" → kind:"raw", src:"broll/fcsromero_s_NN.mp4"  → CAPA b-roll (FCSROMERO_BROLL)
//   - mediakind:"image" → kind:"raw", src:"img/fcsromero_s_NN.png"    → CAPA fotos (rawTop, Main filtra /^(img|vid)\//)
//   - sin asset  → kind:"talk" (avatar full a cámara)
// + OVERLAY de COMPONENTES premium en los rangos del §0 DIRECTOR, anclados a la FRASE real.
//
// TIMING: s_01..s_66 y s_197..s_262 traen ms/dur reales. El centro s_67..s_196 NO trae ms
// (solo `anchor`) → se ancla por frase a captions_fcsromero.json cuando matchea, con guarda de
// ventana local; lo no-matcheable se interpola linealmente entre anclas conocidas por índice.
import fs from "fs";

const SLUG = "fcsromero";
const VIDEO_END = 1298; // duración real del wav — la comp NUNCA es menor que el audio

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

// pass A — ms directo (monotónico): cubre s_01..s_66 y s_197..s_262.
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
// timeline no es un kind soportado → la EXPECTATIVA semana a semana va como `process`
// (NumberedSteps). bars/splitlist/checklist/nametag → renderFederer2Comp (COMP2_KINDS).
const CMP = [
  // MECANISMO — "dos batallas" (oxidación + circulación) (s_34–s_46)
  { at: "s_35", kind: "avatarpizarra", items: [
    { card: "1 · Oxidación", sub: "como una manzana partida que se pone marrón: rompe el colágeno", atPhrase: "es contra la oxidacion" },
    { card: "2 · Circulación", sub: "los vasitos dormidos de la cara que el romero vuelve a despertar", atPhrase: "la de la circulacion" },
  ] },
  // MITO — "romero = cuento de abuela" (s_47–s_57)
  { at: "s_47", kind: "mitoverdad", myth: "El romero es puro cuento de abuela", truth: "Es de los antioxidantes más potentes, con ciencia detrás", flipPhrase: "esos mismos compuestos" },
  // ENEMIGO — la industria: suero caro vs romero de centavos (s_50–s_57)
  { at: "s_52", kind: "bars", title: "Lo mismo, dos precios", unit: "USD", bars: [
    { label: "Suero antioxidante de tienda", value: 90, tone: "danger", note: "y pagás cada mes" },
    { label: "Romero de tu maceta", value: 1, winner: true, note: "centavos" },
  ] },
  // 3 BENEFICIOS (clímax en el nº3: sueño + cabello) (s_79–s_98)
  { at: "s_82", kind: "splitlist", title: "Lo que le devuelve a tu piel", items: [
    "1 · Firmeza — la piel se siente más tersa",
    "2 · Luminosidad — el tono se empareja y se aviva",
    "3 · Sueño + Cabello — relaja de noche y nutre el cuero cabelludo",
  ] },
  // ESTUDIO — romero ≈ minoxidil para el cabello (a los 6 meses) (s_99–s_110)
  { at: "s_102", kind: "bars", title: "Pelo nuevo a los 6 meses", unit: "%", bars: [
    { label: "Minoxidil 2% (farmacia)", value: 100, tone: "danger" },
    { label: "Romero (macerado)", value: 100, winner: true, note: "y sin picazón" },
  ] },
  // EXPECTATIVA — qué esperar, semana a semana (s_161–s_186)
  { at: "s_165", kind: "process", title: "Qué vas a notar", steps: [
    { title: "Semana 1–2", desc: "la piel se ve más descansada al despertar" },
    { title: "Semana 3–4", desc: "más luminosa y suave al tacto" },
    { title: "Semana 6–8", desc: "el óvalo se ve más firme, menos apagado" },
    { title: "Con constancia", desc: "la piel madura recupera vida, de a poco" },
  ] },
  // FRASE — repara de noche, defiende de día (s_187–s_192)
  { at: "s_189", kind: "frasecinetica", tone: "teal", perWord: 12, words: [
    { t: "Repara" }, { t: "de" }, { t: "NOCHE", hl: true }, { t: "defiende" }, { t: "de" }, { t: "DÍA", hl: true },
  ] },
  // EL ERROR — aceite esencial PURO (s_193–s_204)
  { at: "s_197", kind: "mitoverdad", myth: "Si es esencial y puro, mejor", truth: "Puro irrita y hasta quema; el macerado suave es lo seguro", flipPhrase: "hacemos el macerado suave" },
  // LÍMITES honestos (s_205–s_218)
  { at: "s_206", kind: "checklist", title: "Con honestidad", items: [
    { text: "Prueba de alergia SIEMPRE, una gota detrás de la oreja", state: "warn" },
    { text: "Rodeá los ojos: nunca en el párpado, arde", state: "warn" },
    { text: "Embarazo, lactancia o presión alta → preguntá al médico", state: "warn" },
  ] },
  // RECAP 3 pasos (s_219–s_231)
  { at: "s_219", kind: "checklist", title: "Los 3 pasos (guardá esto)", items: [
    { text: "1 · Hacé el macerado — romero seco en aceite, 2–4 sem o baño María", state: "done" },
    { text: "2 · Ritual de noche — 3–4 gotas, masaje suave hacia arriba", state: "done" },
    { text: "3 · Protector solar de día — sin excepción", state: "done" },
  ] },
  // CTA guía (s_239) — ⛔ NUNCA link ni precio en el video
  { at: "s_239", kind: "lowerthird", title: "Las cantidades exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Qué aceite elegir y la rutina por semanas, ahí abajo.", tone: "teal" },
  // Sign-off de marca → dispara el Endcard del canal (portrait del doctor ya en disco)
  { at: "s_261", kind: "nametag", name: "Dr. Federer", role: "Cada semana, salud real para tu piel después de los 60", image: `img/fcsmanchas_s_229.png` },
];

const capOfDur = { avatarpizarra: 8, mitoverdad: 6, bars: 6, splitlist: 7, checklist: 8.5, lowerthird: 6, frasecinetica: 5.5, nametag: 6, process: 9 };
const missingAnchors = [];
const cmpBeats = [];
for (let k = 0; k < CMP.length; k++) {
  const spec = CMP[k];
  const st = startOf(spec.at);
  if (st == null) { missingAnchors.push(spec.at); continue; }
  const { at, ...rest } = spec;
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
  `export const FCSROMERO_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const FCSROMERO_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(FCS_BROLL)};\n` +
  `export const FCSROMERO_TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n` +
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
if (missingAnchors.length) console.log(`⚠ anchors de componente NO hallados:`, missingAnchors);
console.log(`assets referenciados: ${need.size} · faltantes en public/: ${miss.length}`);
if (miss.length) console.log(`  faltan (primeros 12):`, miss.slice(0, 12));
