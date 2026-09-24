// build_techocalor.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Constructor Libre").
// Tema: LA BARRERA RADIANTE — un papel de aluminio de $7 que rebota el calor del techo
// (mismo principio que usan la NASA en satélites y los viejos con cal/ventilación).
// Avatar Tomás + b-roll clips-first: 173 beats YA matcheados/generados desde
// _v3/techocalor_assetmap.json (74 clips + 91 stock en public/broll/*.mp4, 8 imágenes
// en public/real/*.png). CADA asset anclado al ms EXACTO de public/captions_techocalor.json.
// Componentes: KIT PREMIUM themeable (THEME_EARTH) — ~18 momentos fuertes como overlays
// transparentes en zona segura (PremiumOverlay: topLeft/left/top/full), b-roll contiguo
// debajo, avatar PiP abajo-derecha SIN tapar.
// Salida: beatsheet/techocalor.json → node beatsheet.mjs beatsheet/techocalor.json
import fs from "fs";

const SLUG = "techocalor";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
// ancla por PREFIJO de hasta 8 tokens (evita frases largas del assetmap que a veces
// tienen fill words que no calzan palabra-por-palabra completo).
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase); return v; };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

// ── 1) B-ROLL DENSO — 173 beats del assetmap, anclados a su `phrase` real ────────
// ancla a la N-ésima ocurrencia de la frase (por defecto la 1ª): el guión repite
// literalmente la frase "podés llenar el entretecho..." en la explicación del mito
// (~4:19) Y en el recap (~11:48) — s_149 pertenece al recap → ocurrencia 2.
const OCC_OVERRIDE = { s_149: 2 };
const atNth = (phrase, maxTok, nth) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  let count = 0;
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) { count++; if (count === nth) return Wc[i].ms / 1000; }
  }
  return null;
};
const assetmap = JSON.parse(fs.readFileSync(`_v3/${SLUG}_assetmap.json`, "utf8"));
const rawBeats = [];
const seenAsset = new Set();
for (const a of assetmap) {
  if (seenAsset.has(a.name)) continue; // 1 uso por asset
  seenAsset.add(a.name);
  const nth = OCC_OVERRIDE[a.name];
  const t = nth ? atNth(a.phrase, 8, nth) : atc(a.phrase);
  if (t == null) continue;
  const src = a.use === "image" ? `real/${a.name}.png` : `broll/${a.name}.mp4`;
  rawBeats.push({ id: a.name, start: +t.toFixed(2), kind: "raw", src, hue: "amber", darken: 0 });
}
rawBeats.sort((x, y) => x.start - y.start);
// B-ROLL CONTIGUO — 0 huecos: cada dur llega hasta el próximo start (+overlap chico anti-flash)
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── 2) COMPONENTES PREMIUM (THEME_EARTH) — ~18 momentos fuertes, OVERLAYS ────────
// overlay:true → beatsheet.mjs los emite en OVERLAYS (por encima del b-roll+avatar,
// no roba slot de b-roll). `zone` los ubica en zona segura (izq/arriba), el avatar
// PiP queda abajo-derecha SIN taparse. Todos con theme:"earth" (Constructor Libre).
const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

const PREMIUM = [
  // ── HOOK — el precio ($7) contra el problema, pantalla completa (sin avatar compitiendo) ──
  P("HookCaption", "un papel reflectivo de siete dolares bien puesto", 4.4, "full", {
    words: [{ text: "SIETE" }, { text: "DÓLARES", boxed: true }, { text: "de" }, { text: "papel" }, { text: "que" }, { text: "rebota" }, { text: "el", }, { text: "calor" }],
    sub: "y tu casa baja varios grados sin gastar un peso de luz",
  }),
  // ── LO QUE VAS A APRENDER — checklist ──
  P("ChecklistReveal", "hoy te lo paso completo", 8.2, "topLeft", {
    title: "Hoy te paso el truco completo",
    items: [
      "Por qué el calor te cae del techo, no de las paredes",
      "Por qué el aislante común no lo frena",
      "El truco de $7 que rebota el calor antes de que entre",
      "Cómo lo hacían los viejos con cal y ventilación",
      "El error de 30 segundos que lo deja inútil",
    ],
    stamp: "TODO LISTO",
  }, 5),
  // ── EL ENEMIGO — techo como plancha, 60-70° ──
  P("BigStatReveal", "puede estar a 60 70 grados", 6.0, "topLeft", {
    eyebrow: "Un techo oscuro, siesta de verano",
    value: 70, prefix: "", suffix: "°C",
    support: "el techo se calienta como una plancha y guarda ese calor todo el día",
  }, 5),
  // ── MECANISMO — sol → techo → irradia → cielo raso ──
  P("FlowSteps", "el sol pega en el techo", 8.6, "left", {
    title: "Así te llega el calor de noche",
    nodes: [
      { label: "El sol pega en el techo" },
      { label: "El material se calienta y guarda ese calor" },
      { label: "Irradia calor hacia abajo, en rayos" },
      { label: "El cielo raso se calienta y te lo tira a la pieza" },
    ],
  }, 5),
  // ── LA TRAMPA DE LA NOCHE — el techo sigue caliente horas después ──
  P("BigStatReveal", "diez quince grados mas", 6.4, "topLeft", {
    eyebrow: "Termómetro en el entretecho",
    value: 15, prefix: "+", suffix: "°C",
    support: "más que en la pieza: ese horno arriba te tira el calor toda la tarde-noche",
  }, 4),
  // ── EL MITO — el aislante común no frena la radiación ──
  P("MythTruth", "y si le pongo aislante no lo frena", 6.6, "topLeft", {
    myth: "“Si le pongo lana de vidrio, se frena el calor”",
    truth: "El aislante absorbe la radiación y la vuelve a irradiar del otro lado",
  }, 8),
  // ── LOS VIEJOS — color + ventilación ──
  P("BulletCascade", "las dos geniales y de amonedas", 8.0, "topLeft", {
    eyebrow: "Lo que los viejos ya sabían",
    bullets: [
      { pre: "Techos ", key: "blancos", post: " a la cal: rebotan el sol" },
      { pre: "Entretecho ", key: "ventilado", post: ": el aire caliente se escapa solo" },
    ],
  }, 5),
  // ── VS DUEL — absorber (aislante) vs rebotar (barrera radiante) ──
  P("VsDuel", "necesitas algo que la rebote", 7.4, "topLeft", {
    eyebrow: "Frenar la radiación, de verdad",
    title: "Absorber no es lo mismo que rebotar",
    left: { label: "Aislante común", sub: "absorbe y vuelve a irradiar", good: false },
    right: { label: "Barrera radiante", sub: "papel de $7, rebota el calor", good: true },
  }, 5),
  // ── EL 95% ──
  P("DonutPercent", "rebota como el 95", 6.2, "topLeft", {
    value: 95,
    title: "De la radiación que le llega",
    support: "el aluminio la rebota en vez de dejarla pasar",
  }, 4),
  // ── LA NASA — misma física de los satélites ──
  P("PullQuote", "la nasa envuelve los satelites", 5.6, "topLeft", {
    quote: "El mismo material con el que la NASA envuelve los satélites para que no se cocinen en el espacio",
  }, 4),
  // ── PASO A PASO — caso 1: techo con entretecho ──
  P("NumberedSteps", "grapas o clavas el papel reflectivo", 9.6, "left", {
    eyebrow: "Si tenés entretecho",
    title: "Se hace en un par de horas",
    steps: [
      { title: "Entrás al entretecho" },
      { title: "Grapás o clavás el papel", sub: "cara brillante mirando hacia abajo" },
      { title: "Dejás la cámara de aire", sub: "nunca pegado a la madera" },
      { title: "Le sacás el polvo cada tanto" },
    ],
  }, 5),
  // ── PASO A PASO — caso 2: losa plana ──
  P("NumberedSteps", "le pintas la losa de blanco", 9.0, "left", {
    eyebrow: "Si tenés losa plana de hormigón",
    title: "La atacás por arriba",
    steps: [
      { title: "Pintás la losa de blanco", sub: "pintura reflectiva o lechada de cal" },
      { title: "La losa deja de cargarse de calor" },
      { title: "Rematás con el reflectivo por dentro" },
    ],
  }, 5),
  // ── LOS 20 GRADOS DE DIFERENCIA ──
  P("BigStatReveal", "20 grados de diferencia en la superficie", 6.2, "topLeft", {
    eyebrow: "Losa negra vs. losa blanca",
    value: 20, prefix: "", suffix: "°C",
    support: "de diferencia en la superficie, solo por el color",
  }, 5),
  // ── EL ERROR DE 30 SEGUNDOS — pegado sin cámara de aire ──
  P("MythTruth", "lo pegaste y lo arruinaste", 6.4, "topLeft", {
    myth: "Papel pegado contra la madera o la losa, sin aire",
    truth: "Deja de rebotar y conduce el calor directo",
  }, 4),
  // ── NO SELLAR LA VENTILACIÓN ──
  P("BulletCascade", "le sacas la mitad de la eficiencia", 7.0, "topLeft", {
    eyebrow: "El otro error de la misma familia",
    bullets: [
      { pre: "Sellar el entretecho ", key: "encierra", post: " el calor que igual entra" },
      { pre: "La barrera y la ventilación ", key: "trabajan juntas", post: "" },
    ],
  }, 5),
  // ── VERANO/INVIERNO — funciona en las dos direcciones ──
  P("FlowSteps", "te enfria en verano y te ayuda a calentar en invierno", 8.2, "left", {
    title: "El mismo papel, las 4 estaciones",
    nodes: [
      { label: "Verano", sub: "rebota el calor del techo hacia arriba" },
      { label: "Invierno", sub: "rebota el calor de tu estufa hacia abajo" },
    ],
  }, 8),
  // ── EL MITO FINAL — no es un AC más grande ──
  P("MythTruth", "no es un aire acondicionado mas grande", 6.8, "topLeft", {
    myth: "“Necesito un aire acondicionado más grande”",
    truth: "Primero tapás el agujero (el techo); recién ahí el aire que ya tenés alcanza de sobra",
  }, 6),
  // ── RECAP — 6 puntos ──
  P("BulletCascade", "hicimos bastante camino", 11.5, "topLeft", {
    eyebrow: "Repaso rápido",
    bullets: [
      { key: "El calor cae del techo", post: ", no de las paredes" },
      { pre: "El aislante común ", key: "no lo frena" },
      { pre: "Los viejos: ", key: "blanco y ventilado" },
      { pre: "El truco de $7: ", key: "barrera radiante" },
      { pre: "Los tres juntos: ", key: "blanco, ventilado, espejado" },
      { pre: "La barrera necesita ", key: "cámara de aire" },
    ],
  }, 4),
  // ── CIERRE — el manual ──
  P("CtaCard", "el manual del constructor libre", 8.6, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos",
    title: "Manual del Constructor Libre",
    bullet: "techo, cemento, cal, humedad, óxido, madera — con medidas exactas",
    price: 5,
    cta: "LINK EN LA DESCRIPCIÓN",
  }, 5),
];

const beats = [...rawBeats];
let nOv = 0;
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  beats.push({
    id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`,
    start: +s.toFixed(2),
    dur: p.dur,
    kind: "premium",
    overlay: true,
    comp: p.comp,
    theme: "earth",
    zone: p.zone,
    ...p.props,
  });
  nOv++;
}
beats.sort((a, b) => a.start - b.start);

// ── SEGURIDAD: 1 uso por asset raw — abortar si se repite ──
{
  const used = new Map();
  for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); }
  const dups = [...used.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ ASSETS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, clipsfirst: true, beats }, null, 1));

// ── AVATAR WINDOWS — full al abrir, PiP cornerBR quieto sobre b-roll, se esconde
// bajo overlays "full" (hook inicial + CTA final), PiP normal bajo los demás premium.
const OPEN = 1.6;
const firstClip = rawBeats.length ? rawBeats[0].start : OPEN;
const premiumPlaced = beats.filter((b) => b.kind === "premium");
const FULLHIDE = premiumPlaced.filter((b) => b.zone === "full").map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const inFullHide = (t) => FULLHIDE.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const pts = [...new Set([0, firstClip, ...FULLHIDE.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const mode = t < firstClip - 1e-6 ? "full" : inFullHide(t) ? "hidden" : "cornerBR";
  if (mode !== cur) { windows.push({ start: +t.toFixed(2), mode }); cur = mode; }
}
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);

// ── resumen ──────────────────────────────────────────────────────────────────
const rawN = beats.filter((b) => b.kind === "raw").length;
const clipN = rawBeats.filter((b) => b.src.startsWith("broll/") && assetmap.find((a) => a.name === b.id)?.use === "clip").length;
const stockN = rawBeats.filter((b) => assetmap.find((a) => a.name === b.id)?.use === "stock").length;
const imgN = rawBeats.filter((b) => b.src.startsWith("real/")).length;
const dur = beats.length ? Math.max(...beats.map((b) => b.start + b.dur)) : 0;
console.log(`=== build_techocalor BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN} = clip ${clipN} + stock ${stockN} + img ${imgN}) · premium overlays ${nOv} · dur ${(dur / 60).toFixed(1)}min`);
console.log(`avatar windows ${windows.length}`);
console.log(`→ beatsheet/${SLUG}.json`);
console.log(`→ src/VideoEdit/avatar_${SLUG}.gen.ts`);
