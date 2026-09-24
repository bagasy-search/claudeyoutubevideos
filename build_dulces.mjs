// build_dulces.mjs — canal Abuela Rosa · "20 Dulces de la Abuela Que Ya No Se Hacen".
// FACELESS (100% voz en off + b-roll real, SIN avatar). Motor de densidad estilo barcos/abono:
//   PHRASE_BOUNDS (corte en cada límite de frase de Whisper) + pickClip (pool con cycling
//   anti-repetición) + PACE por sección. Cada frase de Whisper = un beat raw con footage real;
//   componentes lindos (rule / teasecards / quote / stat / checklist / annotated) van ENCIMA.
//
//   node build_dulces.mjs  → beatsheet/dulces.json
import fs from "fs";

const SLUG = "dulces";
const TOTAL = 1605;
const OPEN = 0.13;

// ── captions word-level (startMs/endMs) ──────────────────────────────────────
const caps = JSON.parse(fs.readFileSync("public/captions_dulces.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function atc(phrase) {
  const t = norm(phrase).split(" ").filter(Boolean);
  for (let i = 0; i <= W.length - t.length; i++) {
    let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return W[i].ms / 1000;
  }
  console.warn("⚠ anchor no encontrada:", phrase);
  return null;
}
// wordSpan: dado un texto EXACTO de la transcript, devuelve { start, words:[{t,at}] }
// con el ms REAL de cada palabra (at = seg relativos al inicio de la frase) — para
// citaabuela palabra-por-palabra sincronizada a la voz. Si no matchea → null.
const capW = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs }));
function wordSpan(phrase) {
  const tw = norm(phrase).split(" ").filter(Boolean);
  for (let i = 0; i <= capW.length - tw.length; i++) {
    let ok = 1; for (let j = 0; j < tw.length; j++) if (capW[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) {
      const span = capW.slice(i, i + tw.length);
      const t0 = span[0].ms;
      const words = span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2) }));
      return { start: +(t0 / 1000).toFixed(2), words };
    }
  }
  console.warn("⚠ wordSpan no encontrada:", phrase);
  return null;
}
// atWordIn: busca UNA palabra dentro de una ventana [from,to] seg y devuelve su ms.
// Sirve para anclar cada chip de ingredientesflotan a la palabra exacta que la nombra.
function atWordIn(word, from, to) {
  const wn = norm(word);
  for (const c of capW) { const s = c.ms / 1000; if (s >= from && s <= to && c.n === wn) return +s.toFixed(2); }
  return null;
}
// límites de FRASE del Whisper (ms exacto): cada clip del cuerpo corta acá.
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) {
  const prev = caps[i - 1];
  const prevPunct = prev ? /[.,;:!?…]$/.test(prev.text.trim()) : true;
  const gap = prev ? caps[i].startMs - prev.endMs : 9999;
  if (i === 0 || prevPunct || gap > 320) PHRASE_BOUNDS.push(caps[i].startMs / 1000);
}

// ── secciones EN ORDEN (ms directo de _dulces_starts.json, NO re-anclar) ─────
const STARTS = JSON.parse(fs.readFileSync("beatsheet/_dulces_starts.json", "utf8"));
const SECT_ORDER = [
  "intro", "s01_alfajores", "s02_dulceleche", "s03_arrozleche", "s04_mazamorra",
  "s05_coco", "s06_turronquaker", "s07_mantecol", "s08_cascaritas", "s09_colacion",
  "s10_alfeniques", "s11_membrillo", "s12_arrope", "s13_melcocha", "s14_caramelosleche",
  "s15_ambrosia", "s16_bombones", "s17_chupetines", "s18_frutasabrillantadas",
  "s19_conitos", "s20_quesillo", "extras", "cierre",
];
const SECT = SECT_ORDER.map((k) => [k, STARTS[k]]);
const SECSTART = Object.fromEntries(SECT);
const secEnd = (k) => { const i = SECT_ORDER.indexOf(k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };

// ── ASSETS reales en disco ───────────────────────────────────────────────────
const BROLL = fs.readdirSync("public/broll").filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, ""));
const REAL_EXT = ["jpg", "jpeg", "png", "webp"];
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
// resuelve la primera variante de foto real que exista (índices + extensiones)
const realImg = (nm) => {
  for (const suf of ["_1", "_2", "_3", "_4", ""]) for (const e of REAL_EXT) {
    const p = `real/${nm}${suf}.${e}`; if (fs.existsSync(`public/${p}`)) return p;
  }
  return null;
};

// pool GLOBAL de ambiente nostálgico (disponible en TODA sección)
const AMB = BROLL.filter((n) => n.startsWith("amb_"));
// fotos por dulce (base name real/<foto>_N)
const PHOTO = {
  s01_alfajores: "alfajores_maicena", s02_dulceleche: "dulce_de_leche", s03_arrozleche: "arroz_con_leche",
  s04_mazamorra: "mazamorra", s05_coco: "bocaditos_coco", s06_turronquaker: "turron_quaker",
  s07_mantecol: "mantecol", s08_cascaritas: "cascaritas_naranja", s09_colacion: "colacion",
  s10_alfeniques: "alfeniques", s11_membrillo: "dulce_membrillo", s12_arrope: "arrope",
  s13_melcocha: "melcocha", s14_caramelosleche: "caramelos_leche", s15_ambrosia: "ambrosia",
  s16_bombones: "bombones_caseros", s17_chupetines: "chupetines", s18_frutasabrillantadas: "frutas_abrillantadas",
  s19_conitos: "conitos_ddl", s20_quesillo: "quesillo_arrope",
};
// clips por dulce = los broll que empiezan con dNN_ (s01→d01_, … s20→d20_)
const dulceClips = (key) => {
  const m = key.match(/^s(\d\d)_/);
  if (!m) return [];
  return BROLL.filter((n) => n.startsWith(`d${m[1]}_`));
};
// fotos vintage para intro / extras / cierre
const VINTAGE = ["vintage_cocina1", "vintage_cocina2", "vintage_abuela", "vintage_familia1", "vintage_manos"];

// POOL por sección: nombres de asset (clip o foto). En intro/extras/cierre = ambiente + firma.
const buildPool = (key) => {
  if (key === "intro") return [...AMB, "intro_caramelo", ...VINTAGE];
  if (key === "extras") return [...AMB, "bonus_cayote", "bonus_rapadura", "bonus_mieldecana", ...VINTAGE];
  if (key === "cierre") return [...AMB, "cierre_familia", ...VINTAGE];
  const clips = dulceClips(key);
  const photo = PHOTO[key];
  return [...clips, ...(photo ? [photo] : [])];
};

// ── densidad por sección (seg/clip) ─────────────────────────────────────────
// intro/hook = ráfaga · cuerpo de cada dulce ~3s · cierres reflexivos ~4s
const PACE = { intro: 1.6, extras: 3.4, cierre: 4.0 };
const paceOf = (key) => PACE[key] ?? 3.0;

// resolver src de un asset (clip primero, luego foto)
const srcOf = (nm) => {
  if (have(nm)) return `broll/${nm}.mp4`;
  const ri = realImg(nm);
  return ri || null;
};

// ── pickClip: cycling anti-repetición dentro del pool de la sección (+global) ─
const usage = {}; let lastClip = null; const lastN = [];
const pickClip = (pool, global) => {
  const recent = (nm) => lastN.includes(nm);
  const take = (nm) => { usage[nm] = (usage[nm] || 0) + 1; lastClip = nm; lastN.push(nm); if (lastN.length > 5) lastN.shift(); return nm; };
  const cand = pool.filter((nm) => srcOf(nm));
  const wide = cand.length >= 3 ? cand : [...new Set([...cand, ...global.filter((nm) => srcOf(nm))])];
  let best = null, bu = Infinity;
  for (const nm of wide) { const u = usage[nm] || 0; if (!recent(nm) && u < bu) { bu = u; best = nm; } }
  if (!best) { for (const nm of wide) { const u = usage[nm] || 0; if (nm !== lastClip && u < bu) { bu = u; best = nm; } } }
  if (!best) best = wide[0] || cand[0] || global[0];
  return take(best);
};

// ── CUERPO: un beat raw por cada frase de Whisper, lleno con pickClip ─────────
const CLIPS = [];
let _bid = 0;
for (const [key] of SECT) {
  let s0 = SECSTART[key], e0 = secEnd(key);
  if (s0 < OPEN) s0 = OPEN;
  const pace = paceOf(key);
  const pool = buildPool(key);
  const minGap = Math.max(0.9, pace * 0.6);
  const bounds = []; let lastB = -99;
  for (const t of PHRASE_BOUNDS) { if (t >= s0 - 1e-6 && t < e0 && t - lastB >= minGap) { bounds.push(t); lastB = t; } }
  if (bounds.length === 0) bounds.push(s0);
  for (let i = 0; i < bounds.length; i++) {
    const t = +bounds[i].toFixed(2);
    const nm = pickClip(pool, AMB);
    const src = srcOf(nm);
    if (!src) continue;
    CLIPS.push([t, `b${++_bid}_${nm}`, nm, src]);
  }
}
CLIPS.sort((a, b) => a[0] - b[0]);

// ── bounds para durar cada beat hasta el próximo ─────────────────────────────
const allBounds = [...CLIPS.map((c) => c[0]), TOTAL].sort((a, b) => a - b);
const nextBound = (t) => allBounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
let beats = CLIPS.map(([t, id, , src]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  return { id, start: t, dur, kind: "raw", src, darken: 0 };
});

// ── COMPONENTES ENCIMA (overlay del b-roll, no lo reemplazan del todo) ───────
const ck = (text) => ({ text, state: "done" });
const photoSrc = (key) => { const p = PHOTO[key]; return p ? realImg(p) : null; };
const clipBg = (key) => { const c = dulceClips(key)[0]; return c && have(c) ? `broll/${c}.mp4` : null; };
// FOTO LIMPIA nítida por dulce = frame del clip (sNN → real/card_dNN.jpg), SIN
// texto/banner quemado. Usar SIEMPRE que la foto se muestre nítida (teasecards,
// fichadulce). Las Bing (photoSrc) quedan solo para fondos MUY blureados.
const cardImg = (key) => { const m = key.match(/^s(\d\d)_/); if (!m) return photoSrc(key); const p = `real/card_d${m[1]}.jpg`; return fs.existsSync(`public/${p}`) ? p : photoSrc(key); };
// variante específica de foto real por base name (ej "dulce_de_leche", 2) → busca _2
const photoV = (base, n) => { for (const e of REAL_EXT) { const p = `real/${base}_${n}.${e}`; if (fs.existsSync(`public/${p}`)) return p; } return realImg(base); };
// 2º clip del dulce (para bg alternativo y no repetir el del topdulce)
const clipBg2 = (key) => { const cs = dulceClips(key).filter(have); const c = cs[1] || cs[0]; return c ? `broll/${c}.mp4` : null; };

// ── TOP DULCE (medalla de ranking vintage) — anclado al ms del ORDINAL exacto ──
// Reemplaza los `rule` planos. `ord` = frase ordinal como la transcribió Whisper
// (nºs ≥13 los escribió en dígitos). `bg` = clip del dulce blureado detrás.
const TOP = [
  { key: "s01_alfajores", index: 1, title: "Alfajores de maicena", ord: "el primero es el rey" },
  { key: "s02_dulceleche", index: 2, title: "Dulce de leche", ord: "el segundo es la madre" },
  { key: "s03_arrozleche", index: 3, title: "Arroz con leche", ord: "el tercero era el consuelo" },
  { key: "s04_mazamorra", index: 4, title: "Mazamorra", ord: "el cuarto es el mas antiguo" },
  { key: "s05_coco", index: 5, title: "Bocaditos de coco", ord: "el quinto hacia felices" },
  { key: "s06_turronquaker", index: 6, title: "Turrón de quaker", ord: "el sexto era el dulce" },
  { key: "s07_mantecol", index: 7, title: "Mantecol", ord: "el septimo era un lujo" },
  { key: "s08_cascaritas", index: 8, title: "Cascaritas de naranja", ord: "el octavo ensenaba a no tirar nada" },
  { key: "s09_colacion", index: 9, title: "Colación", ord: "el noveno aparecia" },
  { key: "s10_alfeniques", index: 10, title: "Alfeñiques", ord: "el decimo era pura magia" },
  { key: "s11_membrillo", index: 11, title: "Dulce de membrillo", ord: "el numero once" },
  { key: "s12_arrope", index: 12, title: "Arrope", ord: "el doce es de los abuelos" },
  { key: "s13_melcocha", index: 13, title: "Melcocha", ord: "el 13" },
  { key: "s14_caramelosleche", index: 14, title: "Caramelos de leche", ord: "el catorce se derretia" },
  { key: "s15_ambrosia", index: 15, title: "Ambrosía", ord: "el quince era finisimo" },
  { key: "s16_bombones", index: 16, title: "Bombones caseros", ord: "el 16" },
  { key: "s17_chupetines", index: 17, title: "Chupetines", ord: "el 17" },
  { key: "s18_frutasabrillantadas", index: 18, title: "Frutas abrillantadas", ord: "el 18" },
  { key: "s19_conitos", index: 19, title: "Conitos de dulce de leche", ord: "el 19" },
  { key: "s20_quesillo", index: 20, title: "Quesillo con arrope", ord: "y el 20" },
];
const RULES = TOP.map(({ key, index, title, ord }) => {
  const t = atc(ord);
  return t == null ? null : { t, id: `top_${key}`, kind: "topdulce", index, total: 20, title, image: clipBg(key), dur: 3.4 };
}).filter(Boolean);

// ── helpers de armado de componentes BESPOKE, todo anclado al ms real ─────────
// fichadulce: la foto+panel entra en el ms EXACTO en que se nombra el dulce.
const ficha = (anchor, key, title, notes, side, eyebrow, o = 0) => {
  const t = atc(anchor); if (t == null) return null;
  return { t, o, id: `ficha_${key}`, kind: "fichadulce", dur: 4.6, image: cardImg(key), bg: clipBg2(key) || clipBg(key), title, notes, side, eyebrow };
};
// citaabuela: cita textual PALABRA POR PALABRA con el ms real de cada palabra.
const cita = (exact, key, image, fontSize = 76) => {
  const sp = wordSpan(exact); if (!sp) return null;
  const lastAt = sp.words[sp.words.length - 1].at;
  return { t: sp.start, id: `cita_${key}`, kind: "citaabuela", dur: +(lastAt + 2.4).toFixed(2), words: sp.words, text: exact, image, fontSize };
};
// antesahora: partido ANTES/AHORA anclado a la frase "se perdió…".
const antes = (anchor, key, beforeLabel, afterLabel) => {
  const t = atc(anchor); if (t == null) return null;
  const base = PHOTO[key];
  return { t, id: `antes_${key}`, kind: "antesahora", dur: 4.4, beforeImage: photoV(base, 1), afterImage: photoV(base, 2), beforeLabel, afterLabel };
};
// ingredientesflotan: cada chip entra en el ms EXACTO de SU palabra en la ventana.
const ingr = (key, from, to, pairs, title) => {
  const items = []; const anchoredIds = [];
  for (const [label, word] of pairs) {
    const t = atWordIn(word, from, to);
    if (t != null) { items.push({ label, t }); anchoredIds.push(label); }
  }
  if (items.length < 2) { console.warn("⚠ ingr pocos anclados:", key, anchoredIds); return null; }
  items.sort((a, b) => a.t - b.t);
  const t0 = items[0].t;
  // mantené solo los chips cuya palabra cae dentro de ~7s del primero → escena
  // compacta (si un ingrediente se nombra mucho después, no estira toda la escena).
  const kept = items.filter((x) => x.t - t0 <= 7.0);
  if (kept.length < 2) { console.warn("⚠ ingr ventana corta:", key); return null; }
  const perAt = kept.map((x) => +(x.t - t0).toFixed(2)); // offsets reales por chip
  const dur = +(Math.max(...perAt) + 2.8).toFixed(2);
  return { t: t0, id: `ingr_${key}`, kind: "ingredientesflotan", dur, image: clipBg(key), title, items: kept.map((x) => x.label), atsec: perAt };
};

const COMPONENTS = [
  // ── INTRO — enganche visual TEMPRANO (carrusel + medalla-conteo) ──
  // teasecards MUCHO antes: apenas dice "los dulces" (≈16s), como abre Postres.
  { t: atc("hoy quiero hablarte de unos dulces"), id: "cmp_tease", kind: "teasecards", dur: 8.0,
    eyebrow: "Algunos merecen volver…", title: "¿Cuántos probaste?", cards: [
      { src: cardImg("s01_alfajores"), label: "Alfajor de maicena" },
      { src: cardImg("s02_dulceleche"), label: "Dulce de leche" },
      { src: cardImg("s03_arrozleche"), label: "Arroz con leche" },
      { src: cardImg("s05_coco"), label: "Bocaditos de coco" },
      { src: cardImg("s11_membrillo"), label: "Dulce de membrillo" },
      { src: cardImg("s10_alfeniques"), label: "Alfeñiques" },
      { src: cardImg("s16_bombones"), label: "Bombones caseros" },
    ] },
  // "¿lo sentís?" — número grande texturado con vapor/aroma (gancho sensorial)
  { t: atc("lo sentis"), id: "cmp_aroma", kind: "numerodulce", dur: 3.2,
    number: "20", name: "dulces que se perdieron", total: "recetas", eyebrow: "¿Sentís ese olor?", image: "broll/intro_caramelo.mp4" },
  // al nombrar los 20 — carrusel/tease de cierre de intro
  { t: atc("te voy a contar veinte dulces"), id: "cmp_stat20", kind: "numerodulce", dur: 3.2,
    number: "20", name: "hechos con las manos", total: "20", eyebrow: "Hoy te cuento", image: "broll/intro_caramelo.mp4" },

  // ═══ POR DULCE — VARIADO: ficha / ingredientesflotan / antesahora / citaabuela ═══
  // 01 alfajores — ficha al nombrarlo + cita emotiva del remate
  ficha("dos tapitas blancas", "s01_alfajores", "Alfajor de maicena", ["Maicena y muy poca harina", "Dulce de leche generoso", "Todo el borde en coco"], "left", "El rey de la merienda"),
  cita("y eso mi amor no se compra en ningun quiosco", "s01_alfajores", photoSrc("s01_alfajores"), 74),
  // 02 dulce de leche — ingredientes flotan + antes/ahora
  ingr("s02_dulceleche", 148, 156, [["Leche", "leche"], ["Azúcar", "azucar"], ["Bicarbonato", "bicarbonato"]], "El dulce de leche casero"),
  antes("se perdio porque lleva tiempo", "s02_dulceleche", "Casero", "En pote"),
  // 03 arroz con leche — ficha + cita "abrazo en un plato"
  ficha("arroz cocinado despacito", "s03_arrozleche", "Arroz con leche", ["Canela y cáscara de limón", "Revolver sin que se pegue", "Cremoso, en su punto"], "right", "El consuelo del invierno"),
  cita("era un abrazo en un plato", "s03_arrozleche", photoSrc("s03_arrozleche"), 92),
  // 04 mazamorra — ingredientes flotan
  ingr("s04_mazamorra", 287, 300, [["Maíz blanco", "maiz"], ["Remojado", "remojado"], ["Miel de caña", "miel"]], "El dulce de la tierra"),
  cita("perdimos un pedacito de quienes eramos", "s04_mazamorra", photoSrc("s04_mazamorra"), 78),
  // 05 bocaditos coco — ficha + cita "eran feos... perfectos"
  ficha("coco rallado mezclado con dulce de leche", "s05_coco", "Bocaditos de coco", ["Coco y dulce de leche", "Bolitas con las manos", "Algunos con chocolate"], "left", "Se hacían con los nietos"),
  cita("eran feos disparejos cada uno de un tamano distinto y eran perfectos", "s05_coco", photoSrc("s05_coco"), 70),
  // 06 turrón quaker — ingredientes flotan (de la alacena)
  ingr("s06_turronquaker", 406, 416, [["Avena", "avena"], ["Azúcar quemada", "azucar"], ["Manteca", "manteca"]], "Con lo de la alacena"),
  // 07 mantecol — ficha + cita "sin sabores"
  ficha("mani tostado y molido", "s07_mantecol", "Mantecol casero", ["Maní tostado y molido", "Azúcar y clara batida", "Cortado en barritas"], "right", "Un lujo de monedas"),
  cita("de tanto ganar ratos nos quedamos sin sabores", "s07_mantecol", photoSrc("s07_mantecol"), 80),
  // 08 cascaritas — antes/ahora (no tirar nada)
  antes("se perdio porque hoy tiramos las cascaras", "s08_cascaritas", "Se aprovechaba", "A la basura"),
  // 09 colación — ficha + cita "forma callada de amor"
  ficha("esas bolitas blancas", "s09_colacion", "Colación", ["Cascarita dura de azúcar", "Relleno de dulce de leche", "Bañadas en glasé"], "left", "De casamientos y fiestas"),
  cita("era una forma callada de amor", "s09_colacion", photoSrc("s09_colacion"), 82),
  // 10 alfeñiques — cita "ver nacer la magia"
  cita("y ver nacer la magia era la mitad de la felicidad", "s10_alfeniques", photoSrc("s10_alfeniques"), 78),
  // 11 membrillo — ficha + antes/ahora
  ficha("membrillos hervidos", "s11_membrillo", "Dulce de membrillo", ["Membrillos hervidos", "Horas revolviendo", "En cajones de madera"], "right", "El del vigilante"),
  // 12 arrope — cita "memoria más vieja del dulce"
  cita("perder el arrope es perder la memoria mas vieja del dulce", "s12_arrope", photoSrc("s12_arrope"), 74),
  // 13 melcocha — ficha (el oficio de feria)
  ficha("un caramelo hecho con miel o con azucar", "s13_melcocha", "Melcocha", ["Miel o azúcar", "Estirada a mano", "El dulce de las ferias"], "left", "Un arte de circo"),
  // 14 caramelos de leche — ingredientes flotan + cita "amor puro en un papelito"
  ingr("s14_caramelosleche", 912, 920, [["Leche", "leche"], ["Azúcar", "azucar"], ["Manteca", "manteca"]], "Los del delantal"),
  cita("era amor puro escondido en un papelito", "s14_caramelosleche", photoSrc("s14_caramelosleche"), 82),
  // 15 ambrosía — ingredientes flotan (yemas huérfanas)
  ingr("s15_ambrosia", 976, 986, [["Yemas de huevo", "yemas"], ["Almíbar", "almibar"], ["Limón o vainilla", "limon"]], "Con lo que sobraba"),
  // 16 bombones — antes/ahora + cita "Pascua menos Pascua"
  antes("se perdio la ceremonia de armarlos", "s16_bombones", "Caseros", "Comprados"),
  cita("la pascua es un poco menos pascua", "s16_bombones", photoSrc("s16_bombones"), 84),
  // 17 chupetines — ficha (trofeo por la calle)
  ficha("caramelo de azucar con colorante", "s17_chupetines", "Chupetines caseros", ["Caramelo con colorante", "Sobre papel manteca", "Un palito en el borde"], "right", "Las tardes de lluvia"),
  // 18 frutas abrillantadas — cita "se podía volver joya"
  cita("se podia volver joya", "s18_frutasabrillantadas", photoSrc("s18_frutasabrillantadas"), 84),
  // 19 conitos — ficha + cita "de lo que más extraño"
  ficha("un merenguito seco o una masita", "s19_conitos", "Conitos de dulce de leche", ["Cucurucho de merengue", "Relleno bien firme", "Puntita en chocolate"], "left", "El mimo de los cumpleaños"),
  cita("es de lo que mas extrano", "s19_conitos", photoSrc("s19_conitos"), 80),
  // 20 quesillo — antes/ahora + cita "del propio patio"
  antes("se perdio porque ya casi nadie hace quesillo", "s20_quesillo", "Del patio", "De fábrica"),
  cita("sino del propio patio", "s20_quesillo", photoSrc("s20_quesillo"), 80),

  // ── EXTRAS — ingredientes/chips flotan de los "casi nadie nombra" ──
  ingr("extras", 1357, 1420, [["Pastillas de menta", "pastillas"], ["Dulce de cayote", "cayote"], ["Rapadura", "rapadura"]], "Los que casi nadie nombra"),

  // ── CIERRE — la cita más emotiva de todas, palabra por palabra ──
  cita("lo dificil de recuperar es el gesto", "cierre", realImg("vintage_familia1"), 88),
  { t: atc("quedate en la cadena"), id: "aged_cierre", kind: "aged", hue: "amber", dur: 6.0,
    heading: "Quedate en la cadena", lines: [{ text: "Ya te conté las meriendas y los postres de antes." }, { text: "Pronto, los domingos y la cocina de antes." }] },
].filter(Boolean);

// ── insertar RULES + COMPONENTS: reemplazan el/los beats que cubren ─────────
const bounds2 = [...CLIPS.map((c) => c[0]), TOTAL].sort((a, b) => a - b);
const placedC = new Set();
let nComp = 0;
// exact=true → el componente conserva su ms EXACTO como start (para citaabuela /
// ingredientesflotan cuyo timing por-palabra se calculó relativo a ese ms). Si el
// beat crudo previo arranca antes, lo recortamos para que termine justo en `t`.
const insertAt = (t, dur, obj, exact = false) => {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) return false;
  const start = exact ? +t.toFixed(2) : beats[idx].start;
  const ab = { ...obj, start, dur };
  if (exact && beats[idx].start < start - 1e-6) {
    // recortar el raw previo para que llegue hasta `t`, e insertar DESPUÉS de él
    beats[idx].dur = +Math.max(0.2, start - beats[idx].start).toFixed(2);
    idx += 1;
    beats.splice(idx, 0, ab);
  } else {
    let rm = 1;
    while (idx + rm < beats.length && beats[idx + rm].start < start + dur - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
    beats.splice(idx, rm, ab);
  }
  // borrar cualquier raw que quede tapado por la ventana del componente
  let k = idx + 1;
  while (k < beats.length && beats[k].start < start + dur - 0.05 && !placedC.has(beats[k].id) && beats[k].kind === "raw") { beats.splice(k, 1); }
  placedC.add(ab.id);
  const next = beats[idx + 1];
  ab.dur = +(Math.min(next ? next.start : TOTAL, start + dur + 1) - start).toFixed(2);
  nComp++;
  return true;
};

// RULES primero (clavados al inicio exacto de cada dulce)
for (const rr of RULES.sort((a, b) => a.t - b.t)) {
  const { t, dur, ...rest } = rr;
  insertAt(t, dur, rest);
}
// luego COMPONENTS. citaabuela/ingredientesflotan = EXACT (timing por-palabra al ms).
const EXACT_KINDS = new Set(["citaabuela", "ingredientesflotan"]);
for (const c of [...COMPONENTS].filter((c) => c.t != null).sort((a, b) => (a.t + (a.o || 0)) - (b.t + (b.o || 0)))) {
  const { t, dur, o, image, ...rest } = c;
  const D = dur || 4.5;
  const obj = { ...rest };
  if (image) obj.image = image;
  insertAt(+(t + (o || 0)).toFixed(2), D, obj, EXACT_KINDS.has(c.kind));
}

// ── rellenar huecos: si un COMPONENTE quedaría estirado mucho más allá de su
// dur intencional (porque borró raws), meté un raw fresco después para que no
// haya una tarjeta congelada 10-15s ni pantalla vacía. Mantiene la densidad. ──
beats.sort((a, b) => a.start - b.start);
const INTENDED = new Map(); // id → dur intencional del componente
for (const c of COMPONENTS) if (c && c.id && c.dur) INTENDED.set(c.id, c.dur);
for (const r of RULES) if (r && r.id && r.dur) INTENDED.set(r.id, r.dur);
const fillers = [];
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  if (b.kind === "raw") continue;
  const want = INTENDED.get(b.id);
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  if (want && nextStart - b.start > want + 1.2) {
    // sección a la que pertenece este tiempo → pool para el filler
    let sec0 = "intro";
    for (const [k] of SECT) if (SECSTART[k] <= b.start) sec0 = k;
    const pool = buildPool(sec0);
    let cur = +(b.start + want).toFixed(2);
    while (nextStart - cur > 1.4) {
      const nm = pickClip(pool, AMB); const src = srcOf(nm);
      const d = Math.min(paceOf(sec0), nextStart - cur);
      if (src) fillers.push({ id: `fill_${b.id}_${cur.toFixed(1)}`, start: cur, dur: +d.toFixed(2), kind: "raw", src, darken: 0 });
      cur = +(cur + d).toFixed(2);
    }
  }
}
beats.push(...fillers);

// ── tiling final: cero pantallas vacías ─────────────────────────────────────
beats.sort((a, b) => a.start - b.start);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const end = Math.min(nextStart, TOTAL);
  // los COMPONENTES no se estiran más allá de su dur intencional (+cola chica);
  // el hueco lo cubren los raws de relleno. Los raws sí tilean hasta el próximo.
  const want = b.kind !== "raw" ? INTENDED.get(b.id) : null;
  const cap = want ? Math.min(end, b.start + want + 0.6) : end;
  const ov = b.kind === "raw" ? Math.min(OV, (cap - b.start) * 0.25) : 0;
  b.dur = +Math.max(0.2, Math.min(cap + ov, TOTAL) - b.start).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, clipsfirst: true, beats }, null, 1));

const nRaw = beats.filter((b) => b.kind === "raw").length;
const uniq = new Set(beats.filter((b) => b.kind === "raw").map((b) => b.src)).size;
const dur = (beats[beats.length - 1].start + beats[beats.length - 1].dur).toFixed(0);
console.log(`=== build_dulces ===`);
console.log(`beats: ${beats.length} · raw: ${nRaw} (${(100 * nRaw / beats.length).toFixed(0)}%) · componentes: ${nComp} · clips/fotos únicos: ${uniq} · dur: ${dur}s`);
