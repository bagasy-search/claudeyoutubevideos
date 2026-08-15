// gen_fcsjapon.mjs — beatsheet/fcsjapon.json (Canal "Federer Archivos" · Video PIÑA/COÁGULOS).
// "La Fruta que limpia los Coágulos de las Piernas" — PIÑA / bromelina para la circulación de las
// piernas +60. La fibrina que espesa la sangre = SARRO en una cañería; la bromelina = destapacaños;
// "el segundo corazón" = la pantorrilla. TEMA SERIO → banda de honestidad marcada y clara.
// Avatar fcsjapon_opt.mp4 (~20.6min). Kit CLÍNICO _fed6. Clon EXACTO de gen_fcsromero.
//
// RUTA SIMPLE Y ROBUSTA (la que pidió el director): se lee _v3/fcsjapon_beats.json
// (213 beats ya namespaced con prefijo fcsjapon_) y se convierte 1:1 según mediakind:
//   - mediakind:"video" → kind:"raw", src:"broll/fcsjapon_s_NN.mp4"  → CAPA b-roll (FCSJAPON_BROLL)
//   - mediakind:"image" → kind:"raw", src:"img/fcsjapon_s_NN.png"    → CAPA fotos (rawTop, Main filtra /^(img|vid)\//)
//   - sin asset  → kind:"talk" (avatar full a cámara)
// + OVERLAY de COMPONENTES premium en los rangos del §0 DIRECTOR, anclados a la FRASE real.
//
// TIMING: s_01..s_53 traen ms/dur reales. El centro s_54..s_213 NO trae ms (solo `anchor`) → se
// ancla por frase a captions_fcsjapon.json cuando matchea, con guarda de ventana local; lo
// no-matcheable se interpola linealmente entre anclas conocidas por índice.
import fs from "fs";

const SLUG = "fcsjapon";
const VIDEO_END = 1499; // duración real del wav fcsjapon (25:00)

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
  // ENEMIGO — mito del gimnasio caro
  { at: "enemy_02", phrase: "una mentira que nos han vendido", kind: "mitoverdad",
    myth: "Para estar fuerte de viejo necesitas gimnasio, máquinas y suplementos caros",
    truth: "Los japoneses más longevos nunca pisaron un gimnasio: la fuerza es gratis", flipPhrase: "es gratis" },
  // ENEMIGO — la fuerza no se compra
  { at: "enemy_09", phrase: "nunca en su vida piso un gimnasio", kind: "bars", title: "Tu fuerza no se compra", unit: "", bars: [
    { label: "Gimnasio + aparatos + suplementos", value: 40, tone: "danger", note: "cada mes" },
    { label: "Estos 5 movimientos en casa", value: 0, winner: true, note: "gratis" },
  ] },
  // MOV1 — el test del suelo = termómetro
  { at: "mov1_09", phrase: "sientate en el suelo y levantate", kind: "avatarpizarra", items: [
    { card: "1 · La prueba", sub: "siéntate en el suelo y levántate con el menor apoyo posible", atPhrase: "sientate en el suelo y levantate" },
    { card: "2 · Menos manos, mejor nota", sub: "cada mano o rodilla que usas para lograrlo resta puntos", atPhrase: "te iban restando puntos" },
    { card: "3 · Un termómetro de tu cuerpo", sub: "refleja tu fuerza, tu equilibrio y la flexibilidad de tus caderas", atPhrase: "es un termometro" },
  ] },
  // MOV1 — los japoneses viven en el suelo
  { at: "mov1_25", phrase: "ellos viven en el suelo", kind: "chips", title: "Viven en el suelo", items: ["Comen sentados en el piso", "Duermen en futón al ras", "Toman el té en el suelo", "Se levantan sin manos"] },
  // MOV1 — cómo recuperarlo
  { at: "mov1_33", phrase: "empieza a sentarte en el suelo", kind: "process", title: "Cómo recuperarlo", steps: [
    { title: "Hoy", desc: "siéntate en el suelo con apoyo de un mueble" },
    { title: "En unas semanas", desc: "levántate usando una sola mano" },
    { title: "Con el tiempo", desc: "sin manos, de un solo impulso" },
  ] },
  // MOV2 — mecanismo del hueso (2,75x + hueso vivo)
  { at: "mov2_13", phrase: "toda esa carga cae", kind: "avatarpizarra", items: [
    { card: "1 · Una sola pierna", sub: "toda la carga de tu cuerpo cae sobre una cadera", atPhrase: "toda esa carga cae" },
    { card: "2 · 2,75 veces tu peso", sub: "la cabeza del fémur recibe casi tres veces tu peso, en un minuto", atPhrase: "veces el peso de tu cuerpo" },
    { card: "3 · El hueso vivo responde", sub: "siente la carga y fabrica más hueso: se vuelve más fuerte", atPhrase: "fabricar mas hueso" },
  ] },
  // MOV2 — aclaración honesta: hueso, no cardio
  { at: "mov2_21", phrase: "para quemar grasa", kind: "mitoverdad",
    myth: "Un minuto en un pie reemplaza 50 minutos de caminata",
    truth: "Solo para la CARGA del hueso — para el corazón y la grasa, hay que caminar", flipPhrase: "para el hueso" },
  // MOV2 — el equilibrio se entrena
  { at: "mov2_29", phrase: "el equilibrio", kind: "frasecinetica", words: ["El", "equilibrio", "se", "entrena", "o", "se", "pierde"], tone: "teal" },
  // MOV2 — hazlo seguro
  { at: "mov2_35", phrase: "junto a la pared", kind: "checklist", title: "Hazlo seguro", items: [
    { text: "Junto a la pared o una silla firme, la mano cerca", state: "done" },
    { text: "Un pie, un minuto — luego el otro, un minuto", state: "done" },
    { text: "Nunca sin un apoyo cerca al principio", state: "warn" },
  ] },
  // MOV3 — Radio Taiso, casi 100 años
  { at: "mov3_05", kind: "frasecinetica", words: ["1928", "·", "todo", "un", "país,", "cada", "mañana"], tone: "amber" },
  // MOV3 — tres minutos que valen oro
  { at: "mov3_13", phrase: "menos discapacidad", kind: "splitlist", title: "Tres minutos que valen oro", items: [
    "Menos discapacidad física con los años",
    "Hasta menos riesgo de demencia",
    "El cuerpo despierta: circulación y equilibrio",
  ] },
  // MOV3 — tu rutina de 3 minutos
  { at: "mov3_29", phrase: "tres minutos", kind: "process", title: "Tu rutina de 3 minutos", steps: [
    { title: "Brazos al cielo", desc: "estira hacia arriba y respira" },
    { title: "Gira la cintura", desc: "despacio a un lado y al otro" },
    { title: "Hombros y cuello", desc: "rueda suave, sin forzar" },
    { title: "Puntitas y rodillas", desc: "sube en puntas y flexiona apenas" },
  ] },
  // MOV4 — el segundo corazón
  { at: "mov4_09", phrase: "el segundo corazon", kind: "avatarpizarra", items: [
    { card: "1 · La pantorrilla aprieta", sub: "cada paso exprime las venas de la pierna como una esponja", atPhrase: "exprime las venas" },
    { card: "2 · Empuja hacia arriba", sub: "manda la sangre de vuelta al corazón contra la gravedad", atPhrase: "hacia arriba" },
    { card: "3 · Tu segundo corazón", sub: "el músculo de abajo que impulsa la sangre de regreso", atPhrase: "el segundo corazon" },
  ] },
  // MOV4 — lo que gana tu pierna
  { at: "mov4_13", phrase: "menos hinchazon", kind: "splitlist", title: "Lo que gana tu pierna", items: [
    "Menos hinchazón en tobillos y pies",
    "Piernas menos pesadas y cansadas",
    "Mejor circulación y pies más calientes",
  ] },
  // MOV4 — cómo hacerlo
  { at: "mov4_25", phrase: "agarrate del respaldo", kind: "checklist", title: "Cómo hacerlo", items: [
    { text: "Agárrate de una silla o la barra de la cocina", state: "done" },
    { text: "Sube en puntitas, aguanta un segundo, baja", state: "done" },
    { text: "10 a 15 veces, varias veces al día", state: "done" },
  ] },
  // MOV5 — caminata por intervalos
  { at: "mov5_09", phrase: "caminas rapido", kind: "process", title: "Caminata por intervalos", steps: [
    { title: "3 minutos rápido", desc: "un paso al que ya te cuesta hablar cómodo" },
    { title: "3 minutos lento", desc: "recuperas el aire, sin parar" },
    { title: "Repite 5 veces", desc: "rápido y lento, alternando" },
    { title: "30 minutos", desc: "tu caminata completa" },
  ] },
  // MOV5 — intervalos vs paso parejo
  { at: "mov5_21", phrase: "bajaron mas la presion", kind: "bars", title: "Intervalos vs paso parejo", unit: "", bars: [
    { label: "Caminata por intervalos", value: 9, winner: true, note: "presión baja, piernas fuertes" },
    { label: "Paso siempre igual", value: 4, tone: "danger", note: "menos resultados" },
  ] },
  // LIMITS — banda de honestidad SERIA
  { at: "limits_02", phrase: "un medico responsable", kind: "checklist", title: "Con honestidad — leé esto", items: [
    { text: "Corazón, presión sin controlar, mareos, prótesis u osteoporosis: consultá a tu médico antes", state: "danger" },
    { text: "Dolor en el pecho, falta de aire o mareo: pará y sentate", state: "warn" },
    { text: "Todo lo de equilibrio, siempre cerca de un apoyo firme", state: "warn" },
  ] },
  // ERROR — la prisa
  { at: "error_02", phrase: "el error mas grande", kind: "mitoverdad",
    myth: "Empezar por lo más difícil y hacerlo todo de golpe funciona",
    truth: "Suave y TODOS los días gana: la constancia, no la intensidad", flipPhrase: "todos los dias" },
  // ERROR — la gotita perfora la piedra
  { at: "error_13", phrase: "perfora la piedra", kind: "frasecinetica", words: ["La", "gotita", "constante", "perfora", "la", "piedra"], tone: "teal" },
  // RECAP — los 3 pasos
  { at: "recap_02", phrase: "un resumen rapido", kind: "checklist", title: "Los 3 pasos (guardá esto)", items: [
    { text: "1 · Baja al suelo y levántate, cada día, con menos manos", state: "done" },
    { text: "2 · Párate en un pie, junto a la pared, un minuto por lado", state: "done" },
    { text: "3 · Muévete suave todos los días: estira, puntitas, camina", state: "done" },
  ] },
  // CTA guía — SIN link ni precio en el video
  { at: "recap_09", phrase: "en la descripcion", kind: "lowerthird", title: "La rutina completa está en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cómo progresar semana a semana, con seguridad, todo ahí abajo.", tone: "teal" },
  // SIGN-OFF -> Endcard del canal
  { at: "close_17", phrase: "un fuerte abrazo", kind: "nametag", name: "Dr. Federer", role: "Salud real para tu cuerpo después de los 60, cada semana", image: "img/fcsmanchas_s_229.png" },
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
  `export const FCSJAPON_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const FCSJAPON_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(FCS_BROLL)};\n` +
  `export const FCSJAPON_TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n` +
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
