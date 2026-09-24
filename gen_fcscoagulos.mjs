// gen_fcscoagulos.mjs — beatsheet/fcscoagulos.json (Canal "Federer Archivos" · Video PIÑA/COÁGULOS).
// "La Fruta que limpia los Coágulos de las Piernas" — PIÑA / bromelina para la circulación de las
// piernas +60. La fibrina que espesa la sangre = SARRO en una cañería; la bromelina = destapacaños;
// "el segundo corazón" = la pantorrilla. TEMA SERIO → banda de honestidad marcada y clara.
// Avatar fcscoagulos_opt.mp4 (~20.6min). Kit CLÍNICO _fed6. Clon EXACTO de gen_fcsromero.
//
// RUTA SIMPLE Y ROBUSTA (la que pidió el director): se lee _v3/fcscoagulos_beats.json
// (213 beats ya namespaced con prefijo fcscoagulos_) y se convierte 1:1 según mediakind:
//   - mediakind:"video" → kind:"raw", src:"broll/fcscoagulos_s_NN.mp4"  → CAPA b-roll (FCSCOAGULOS_BROLL)
//   - mediakind:"image" → kind:"raw", src:"img/fcscoagulos_s_NN.png"    → CAPA fotos (rawTop, Main filtra /^(img|vid)\//)
//   - sin asset  → kind:"talk" (avatar full a cámara)
// + OVERLAY de COMPONENTES premium en los rangos del §0 DIRECTOR, anclados a la FRASE real.
//
// TIMING: s_01..s_53 traen ms/dur reales. El centro s_54..s_213 NO trae ms (solo `anchor`) → se
// ancla por frase a captions_fcscoagulos.json cuando matchea, con guarda de ventana local; lo
// no-matcheable se interpola linealmente entre anclas conocidas por índice.
import fs from "fs";

const SLUG = "fcscoagulos";
const VIDEO_END = 1234; // duración real del wav — la comp NUNCA es menor que el audio

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
  // MECANISMO — "sarro en la cañería" (fibrina + plaquetas + bromelina) (s_30–s_40)
  { at: "s_35", kind: "avatarpizarra", items: [
    { card: "1 · La vena = cañería", sub: "el sarro pegajoso es FIBRINA, una malla que tapona la sangre", atPhrase: "se llama fibrina" },
    { card: "2 · Plaquetas apelmazadas", sub: "se apelmazan como grasa en el caño y la sangre pasa apretada", atPhrase: "se apelmazan" },
    { card: "3 · Bromelina = destapacaños", sub: "afloja y deshace ese sarro para que la sangre vuelva a fluir", atPhrase: "un poco mas de sarro" },
  ] },
  // "EL SEGUNDO CORAZÓN" — la pantorrilla bombea la sangre hacia arriba (s_87–s_99).
  // s_87 no trae ms → el start interpolado deriva ~48s; lo re-anclo por frase (guarda ±60s).
  { at: "s_87", phrase: "aprieta y exprime", kind: "avatarpizarra", items: [
    { card: "Cada paso la exprime", sub: "el músculo se aprieta y exprime las venas de la pierna", atPhrase: "aprieta y exprime" },
    { card: "Contra la gravedad, hacia arriba", sub: "empuja la sangre de regreso arriba; por eso caminar la destapa", atPhrase: "hacia arriba" },
    { card: "La pantorrilla = 2º corazón", sub: "el músculo de abajo que impulsa la sangre de vuelta al corazón", atPhrase: "el segundo corazon" },
  ] },
  // MITO — "várices y piernas hinchadas son la edad" (s_41–s_46)
  { at: "s_41", kind: "mitoverdad", myth: "Las várices y las piernas hinchadas son la edad, aguántate", truth: "Mucho se puede mejorar con movimiento, agua y alimentación", flipPhrase: "con movimiento" },
  // ENEMIGO — la industria: pastilla cara con bromelina vs piña de la esquina (s_47–s_50)
  { at: "s_47", kind: "bars", title: "Lo mismo, dos precios", unit: "USD", bars: [
    { label: "Pastilla de circulación (trae bromelina)", value: 40, tone: "danger", note: "y pagás cada mes" },
    { label: "Piña de la esquina", value: 1, winner: true, note: "centavos" },
  ] },
  // 3 BENEFICIOS (clímax en el nº3: digestión ↔ inflamación) (s_69–s_86)
  { at: "s_69", kind: "splitlist", title: "Lo que le devuelve a tus piernas", items: [
    "1 · La sangre fluye — piernas más ligeras, menos pesadas",
    "2 · Desinflama — baja el pie y el tobillo hinchados",
    "3 · Digestión ↔ menos inflamación — desde la panza calma todo el cuerpo",
  ] },
  // ALIADOS (s_129–s_143)
  { at: "s_129", phrase: "otros aliados", kind: "chips", title: "Los aliados de la piña", items: ["Jengibre", "Ajo", "Cítricos con su telita", "Agua + caminar"] },
  // EXPECTATIVA — semana a semana, medir el tobillo (s_144–s_152)
  { at: "s_144", phrase: "vas a notar", kind: "process", title: "Qué vas a notar", steps: [
    { title: "Semana 1", desc: "medí el tobillo con una cinta y anotá el número" },
    { title: "Semana 2–3", desc: "las piernas se sienten menos pesadas al caer la tarde" },
    { title: "Semana 4–6", desc: "el tobillo mide menos, el zapato entra más suelto" },
    { title: "Con constancia", desc: "la pierna desinflama y la sangre circula mejor" },
  ] },
  // EL ERROR — piña de lata/jugo (almíbar/pasteurizado = enzima muerta) (s_153–s_158)
  { at: "s_153", phrase: "piña de lata", kind: "mitoverdad", myth: "La piña de lata o el jugo de cartón sirven igual", truth: "El almíbar y el pasteurizado matan la enzima: piña FRESCA o nada" },
  // ⛔ HONESTIDAD — banda roja, SERIA y legible (s_159–s_182)
  { at: "s_159", phrase: "una sola pierna", kind: "checklist", title: "Con honestidad — leé esto", items: [
    { text: "⚠ Una pierna SOLA hinchada, caliente y dolorosa = urgencia médica HOY", state: "danger" },
    { text: "Si tomás anticoagulantes, consultá antes — NO dejes tu pastilla", state: "warn" },
    { text: "Úlcera o gastritis: cuidado con la piña en ayunas", state: "warn" },
  ] },
  // RECAP 3 pasos (s_183–s_192)
  { at: "s_183", phrase: "tres pasos", kind: "checklist", title: "Los 3 pasos (guardá esto)", items: [
    { text: "1 · Piña FRESCA, con el CORAZÓN (ahí está la bromelina)", state: "done" },
    { text: "2 · En ayunas, para que trabaje en la circulación", state: "done" },
    { text: "3 · Agua + caminar — acompaña, NO reemplaza al médico", state: "done" },
  ] },
  // CTA guía (s_195) — ⛔ NUNCA link/URL ni precio en el video
  { at: "s_195", phrase: "en la descripcion", kind: "lowerthird", title: "Las cantidades exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cuánta piña, cuándo y cómo — todo ahí abajo.", tone: "teal" },
  // Sign-off de marca → dispara el Endcard del canal (portrait del doctor ya en disco)
  { at: "s_211", kind: "nametag", name: "Dr. Federer", role: "Cada semana, salud real para tus piernas después de los 60", image: `img/fcsmanchas_s_229.png` },
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
  `export const FCSCOAGULOS_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const FCSCOAGULOS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(FCS_BROLL)};\n` +
  `export const FCSCOAGULOS_TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n` +
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
