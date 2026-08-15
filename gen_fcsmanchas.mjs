// gen_fcsmanchas.mjs — beatsheet/fcsmanchas.json (Canal "Federer Archivos" · Video MANCHAS).
// Avatar fcsmanchas_opt.mp4 (~21.4min). Kit CLÍNICO _fed6. Look = clon de federer6.
//
// RUTA SIMPLE Y ROBUSTA (la que pidió el director): se lee _v3/fcsmanchas_beats.json
// (230 beats ya namespaced con prefijo fcsmanchas_) y se convierte 1:1:
//   - src:"stock" → kind:"raw", src:"broll/fcsmanchas_s_NN.mp4"  → CAPA b-roll (FCSMANCHAS_BROLL)
//   - src:"photo" → kind:"raw", src:"img/fcsmanchas_s_NN.png"    → CAPA fotos (rawTop, Main filtra /^(img|vid)\//)
//   - sin asset  → kind:"talk" (avatar full a cámara)
// + OVERLAY de COMPONENTES premium en los rangos del §0 DIRECTOR, anclados a la FRASE real.
//
// TIMING: s_01..s_117 traen ms/dur reales → start = ms/1000. s_118..s_230 NO traen ms
// (solo `anchor`) → se anclan por frase a captions_fcsmanchas.json; los huecos se
// interpolan por índice. La duración de cada beat encadena al siguiente (chain).
//
// AVATARPIZARRA: usa el avatar COMPLETO con trimBefore (fallback del Main, robusto: no
// necesita extraer sub-clips). Igual se emite public/avatar_clips_fcsmanchas.json (KIT_CLIPS)
// por si en el farm querés extraer con split_avatar.mjs y setear beat.clip.
import fs from "fs";

const SLUG = "fcsmanchas";
const VIDEO_END = 1283.4; // duración real del wav — la comp NUNCA es menor que el audio

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

// 1) resolver el START de cada beat (monotónico) en dos pasadas:
//    A) ms directo (s_01..s_117, confiable).
//    B) anclaje por frase para s_118+ PERO con GUARDA de ventana: solo se acepta si cae
//       cerca de la expectativa lineal (evita que un anchor genérico tipo "piel madura"
//       matchee una ocurrencia MUCHO más tardía en captions y arrastre toda una sección).
const N = SRC.length;
const hard = new Array(N).fill(null);
const ANCHOR_WINDOW = 35; // s de tolerancia respecto de la expectativa lineal
// pass A — ms
let cursor = 0, lms = -1, vlms = 0;
for (let i = 0; i < N; i++) {
  if (SRC[i].ms != null) { const st = +(SRC[i].ms / 1000).toFixed(3); if (st > cursor) { hard[i] = st; cursor = st; lms = i; vlms = st; } }
}
// expectativa lineal desde el último ms confiable hasta el final del audio
const expAt = (i) => (i <= lms ? (hard[i] ?? vlms) : vlms + (VIDEO_END - vlms) * ((i - lms) / (N - lms)));
// pass B — anclaje por frase con guarda
for (let i = lms + 1; i < N; i++) {
  const b = SRC[i];
  if (!b.anchor) continue;
  const ms = findMs(b.anchor, cursor + 0.2);
  if (ms != null && ms > cursor + 0.2 && Math.abs(ms - expAt(i)) <= ANCHOR_WINDOW) { hard[i] = ms; cursor = ms; }
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

// 4) construir beats raw/talk (chain dur)
const beats = [];
for (let i = 0; i < N; i++) {
  const b = SRC[i];
  const st = start[i];
  const nx = i + 1 < N ? start[i + 1] : VIDEO_END;
  const dur = +Math.max(0.6, nx - st).toFixed(2);
  const beat = { id: b.name, start: +st.toFixed(2), dur, key: "s" };
  if (!b.asset) beat.kind = "talk";
  else if (b.src === "photo" || /\.png$/.test(b.asset)) { beat.kind = "raw"; beat.src = `img/${SLUG}_${b.name}.png`; }
  else { beat.kind = "raw"; beat.src = `broll/${SLUG}_${b.name}.mp4`; }
  beats.push(beat);
}
const startOf = (name) => { const b = beats.find((x) => x.id === name); return b ? b.start : null; };

// ── b-roll layer (stock .mp4) — CAPA 1 continua ───────────────────────────────
const FCS_BROLL = [];
for (let i = 0; i < N; i++) {
  const b = SRC[i];
  if (b.asset && /\.mp4$/.test(b.asset)) {
    const st = start[i];
    const nx = i + 1 < N ? start[i + 1] : VIDEO_END;
    FCS_BROLL.push({ name: b.name, src: `broll/${SLUG}_${b.name}.mp4`, start: +st.toFixed(2), dur: +Math.max(0.8, nx - st).toFixed(2), query: b.desc || "" });
  }
}

// ── OVERLAY de COMPONENTES premium (anclados a la frase real del beat) ─────────
// Cada uno se ancla al START del beat nombrado (start = ms de ese beat).
const CMP = [
  // MECANISMO #1 — la fábrica de melanina (s_32–s_43)
  { at: "s_34", kind: "avatarpizarra", items: [
    { card: "La fabriquita", sub: "tu piel tiene melanocitos: fábricas diminutas", atPhrase: "se llaman melanocitos" },
    { card: "Fabrica melanina", sub: "su único trabajo: el pigmento que te da color", atPhrase: "fabricar un pigmento" },
    { card: "Se vuelven locas", sub: "el sol, los años y las hormonas las aceleran", atPhrase: "empiezan a producir" },
    { card: "Ahí está la mancha", sub: "el pigmento se amontona en un solo punto", atPhrase: "ahi tienes la mancha" },
  ] },
  // MITO — "es la edad" (s_44–s_58)
  { at: "s_46", kind: "mitoverdad", myth: "Las manchas son la edad, no hay nada que hacer", truth: "Es el sol: se puede frenar y se puede aclarar", flipPhrase: "sabes que manda" },
  // Prueba del brazo / cuánto es sol (s_49)
  { at: "s_49", kind: "bars", title: "La piel envejecida de la cara", unit: "%", bars: [
    { label: "Es sol acumulado", value: 88, winner: true },
    { label: "Es solo la edad", value: 12, tone: "danger" },
  ] },
  // ENEMIGO — la industria (s_59–s_65): frasco caro vs arroz de centavos
  { at: "s_62", kind: "bars", title: "Lo mismo, dos precios", unit: "USD", bars: [
    { label: "El frasquito de la tienda", value: 80, tone: "danger", note: "y pagás cada mes" },
    { label: "Arroz de tu cocina", value: 1, winner: true, note: "centavos" },
  ] },
  // MECANISMO #2 — la LLAVE tirosinasa (s_66–s_78)
  { at: "s_67", kind: "avatarpizarra", items: [
    { card: "Una sola llave", sub: "dentro de la fábrica hay una herramienta", atPhrase: "hay una herramienta" },
    { card: "La tirosinasa", sub: "la enzima que enciende la máquina", atPhrase: "se llama tirocinaza" },
    { card: "Sin la llave", sub: "la fábrica no arranca, por más sol que reciba", atPhrase: "la fabrica no arranca" },
    { card: "El remedio", sub: "el arroz le quita la llave y la frena", atPhrase: "le quita la llave" },
  ] },
  // 3 BENEFICIOS (clímax en el nº3) (s_79–s_103)
  { at: "s_82", kind: "splitlist", title: "Lo que vas a ganar", palette: "G", items: [
    "1 · Frena la fábrica de manchas",
    "2 · Aclara y empareja el tono",
    "3 · Antioxidante: protege tu colágeno",
  ] },
  // Injerto guía suave (expectativa) (s_159)
  { at: "s_159", kind: "lowerthird", title: "El plan por semanas está en la descripción", kicker: "Para no perderte", desc: "Abrila y seguí la rutina, paso a paso.", tone: "teal" },
  // PROTECTOR SOLAR = la mitad del tratamiento (s_161–s_169)
  { at: "s_169", kind: "frasecinetica", tone: "teal", perWord: 11, words: [
    { t: "El" }, { t: "protector" }, { t: "solar" }, { t: "es" }, { t: "la" }, { t: "MITAD", hl: true }, { t: "del" }, { t: "tratamiento", hl: true },
  ] },
  // MECANISMO #3 — de noche repara / de día defiende (s_118–s_127)
  { at: "s_118", kind: "avatarpizarra", items: [
    { card: "De noche repara", sub: "sin sol, la piel se renueva: ese es su horario", atPhrase: "de noche" },
    { card: "De día defiende", sub: "el protector cuida lo que reparaste", atPhrase: "de dia" },
  ] },
  // EL ERROR — el limón (s_170–s_182)
  { at: "s_172", kind: "mitoverdad", myth: "El limón en la mancha la aclara", truth: "Limón + sol = quemadura y mancha PEOR", flipPhrase: "reaccionan con el sol" },
  // LÍMITES honestos (s_183–s_196)
  { at: "s_184", kind: "checklist", title: "Con honestidad", items: [
    { text: "Tarda semanas, no días", state: "warn" },
    { text: "Mancha que cambia de forma, color o sangra → al médico", state: "warn" },
    { text: "Prueba de alergia, siempre", state: "warn" },
  ] },
  // RECAP 3 pasos (s_197–s_205)
  { at: "s_197", kind: "checklist", title: "Los 3 pasos (guardá esto)", items: [
    { text: "1 · Agua de arroz fermentada — tónico cada noche", state: "done" },
    { text: "2 · Mascarilla de papaya o sábila — 2–3 veces por semana", state: "done" },
    { text: "3 · Protector solar — cada mañana, sin excepción", state: "done" },
  ] },
  // CTA guía (s_207–s_209) — ⛔ NUNCA link ni precio en el video
  { at: "s_209", kind: "lowerthird", title: "Las cantidades exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Ordenado por semanas, ahí abajo.", tone: "teal" },
  // Sign-off de marca → dispara el Endcard del canal
  { at: "s_229", kind: "nametag", name: "Dr. Federer", role: "Cada semana, salud real para tu piel después de los 60", image: `img/${SLUG}_s_229.png` },
];

const capOfDur = { avatarpizarra: 8, mitoverdad: 6, bars: 6, splitlist: 7, checklist: 8.5, lowerthird: 6, frasecinetica: 5.5, nametag: 6 };
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
  `export const FCSMANCHAS_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const FCSMANCHAS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(FCS_BROLL)};\n` +
  `export const FCSMANCHAS_TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n` +
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
