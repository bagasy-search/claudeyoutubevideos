// build_peroxido.mjs — Levi Lapp Jardín (ES) · "7 trucos con agua oxigenada en la huerta".
// CLIPS-FIRST + imágenes bespoke (abuelo/Levi/vecino) + PeroxidoDiagram (molécula H2O2→O2).
//   node build_peroxido.mjs match  → public/broll/match_peroxido.json
//   node build_peroxido.mjs        → beatsheet/peroxido.json + avatar_peroxido.gen.ts
// AVATAR-SAFE: PiP fijo en UNA esquina (cornerBR) + OCULTO durante todo componente/overlay.
import fs from "fs";
import { SHOTS } from "./shots_peroxido.mjs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const TOTAL = 1081.20;
const SLUG = "peroxido", AVATAR = "peroxido_opt.mp4";
const OPEN = 2.0;
const IMG_STYLE = ", real documentary photo, natural daylight, sharp focus, shallow depth of field, rustic home garden, no text, no captions, no watermark, no logo";

const caps = JSON.parse(fs.readFileSync("public/captions_peroxido_aligned.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) {
  const t = norm(phrase).split(" ");
  for (let i = 0; i <= W.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; } if (ok) return W[i].ms / 1000; }
  throw new Error("ANCHOR NOT FOUND: " + phrase);
}
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) {
  const prev = caps[i - 1];
  const prevPunct = prev ? /[.,;:!?…]$/.test(prev.text.trim()) : true;
  const gap = prev ? caps[i].startMs - prev.endMs : 9999;
  if (i === 0 || prevPunct || gap > 320) PHRASE_BOUNDS.push(caps[i].startMs / 1000);
}
const capW = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs }));
let _kid = 0;
function kphrase(phrase, emph = []) {
  const tw = norm(phrase).split(" ");
  for (let i = 0; i <= capW.length - tw.length; i++) {
    let ok = 1; for (let j = 0; j < tw.length; j++) if (capW[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) {
      const span = capW.slice(i, i + tw.length), t0 = span[0].ms, eset = new Set(emph.map((e) => norm(e)));
      const words = span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(eset.has(w.n) ? { hl: true } : {}) }));
      const dur = +(((span[span.length - 1].ms - t0) / 1000) + 1.7).toFixed(2);
      return { id: `kl${++_kid}`, start: +(t0 / 1000).toFixed(2), dur, kind: "kineticline", overlay: true, accent: "amber", words };
    }
  }
  console.warn("⚠ kphrase no encontrada:", phrase); return null;
}

const SECT = [
  ["hook1", at("7 trucos con agua oxigenada")],
  ["hook2", at("quedate hasta el final")],
  ["abuelo", at("vi a mi abuelo")],
  ["vecino", at("teniamos un vecino")],
  ["science", at("el agua comun la que tomas")],
  ["t1_soil", at("oxigenar la tierra")],
  ["t2_seeds", at("despertar semillas dormidas")],
  ["t3_rot", at("salvar una planta con la raiz podrida")],
  ["t4_fungus", at("frenar los hongos en las hojas")],
  ["t5_tools", at("desinfectar las herramientas y las macetas")],
  ["t6_gnats", at("esos mosquitos chiquitos")],
  ["t7_water", at("agua de riego mas viva")],
  ["yapa", at("dos yapas")],
  ["plants", at("en los tomates es una bendicion")],
  ["story", at("mi primera planta de tomate")],
  ["error", at("ahora si el error")],
  ["myths", at("no es un fertilizante")],
  ["recap", at("un repaso bien rapido")],
  ["cta", at("cascara de banana")],
  ["outro", at("cuidate cuida tu huerta")],
];
const SECSTART = Object.fromEntries(SECT.map(([k, s]) => [k, s]));
const secEnd = (k) => { const i = SECT.findIndex((x) => x[0] === k); return i + 1 < SECT.length ? SECT[i + 1][1] : TOTAL; };
const POOLKEY = { hook2: "hook1", vecino: "abuelo", science: "hook1", yapa: "t7_water", plants: "t1_soil", story: "abuelo", recap: "t1_soil", outro: "cta" };

const AV_FULL = [[0, OPEN], [SECSTART.abuelo, SECSTART.vecino], [SECSTART.story, SECSTART.error], [SECSTART.cta, SECSTART.outro], [SECSTART.outro, TOTAL]];
const S = SHOTS;
const PACE = {
  hook1: 0.95, hook2: 1.6, abuelo: 3.6, vecino: 2.8, science: 2.6,
  t1_soil: 2.8, t2_seeds: 2.8, t3_rot: 2.8, t4_fungus: 2.8, t5_tools: 2.8, t6_gnats: 2.8, t7_water: 2.8,
  yapa: 3.0, plants: 3.0, story: 3.4, error: 2.6, myths: 2.8, recap: 3.0, cta: 3.2, outro: 3.6,
};

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
const REAL_EXT = ["jpg", "jpeg", "png", "webp"];
const realImg = (nm) => { for (const suf of ["", "_1", "_2"]) for (const e of REAL_EXT) { const p = `real/${nm}${suf}.${e}`; if (fs.existsSync(`public/${p}`)) return p; } return null; };
const allMatched = MODE === "build" ? [...new Set(Object.values(S).flatMap((ls) => ls.map((s) => s[0])).filter(have))] : [];
const usage = {}; let lastClip = null; const lastN = [];
const pickClip = (own, secMatched) => {
  if (MODE !== "build") return own;
  const recent = (nm) => lastN.includes(nm);
  const take = (nm) => { usage[nm] = (usage[nm] || 0) + 1; lastClip = nm; lastN.push(nm); if (lastN.length > 5) lastN.shift(); return nm; };
  if (have(own) && !recent(own) && (usage[own] || 0) < 2) return take(own);
  const pool = secMatched.length >= 3 ? secMatched : [...new Set([...secMatched, ...allMatched])];
  let best = null, bu = Infinity;
  for (const nm of pool) { const u = usage[nm] || 0; if (!recent(nm) && u < bu) { bu = u; best = nm; } }
  if (!best) { for (const nm of pool) { const u = usage[nm] || 0; if (nm !== lastClip && u < bu) { bu = u; best = nm; } } }
  if (!best) best = pool[0] || (have(own) ? own : allMatched[0]) || own;
  return take(best);
};
const pickSrc = (own, secMatched) => {
  if (MODE !== "build") return { name: own, src: null };
  if (have(own)) return { name: own, src: `broll/${own}.mp4` };
  const ri = realImg(own); if (ri) return { name: own, src: ri };
  const nm = pickClip(own, secMatched); return { name: nm, src: have(nm) ? `broll/${nm}.mp4` : null };
};
const fileFor = (...nms) => { for (const nm of nms) { if (have(nm)) return `broll/${nm}.mp4`; const ri = realImg(nm); if (ri) return ri; } return null; };
const imgFor = (...nms) => { for (const nm of nms) { const ri = realImg(nm); if (ri) return ri; } return null; };

const CLIPS = []; let _bid = 0;
for (const [key] of SECT) {
  if (MODE === "build" && key === "hook1") continue;
  const list = S[key] || S[POOLKEY[key]] || [];
  if (!list.length) continue;
  let s0 = SECSTART[key], e0 = secEnd(key); if (s0 < OPEN) s0 = OPEN;
  const span = e0 - s0, pace = PACE[key] || 4.5;
  const secMatched = [...new Set(list.map((s) => s[0]).filter(have))];
  if (MODE === "match") {
    for (let i = 0; i < list.length; i++) { const t = +(s0 + (i + 0.5) * (span / list.length)).toFixed(2); const [own, query, concept] = list[i]; CLIPS.push([t, `b${++_bid}_${own}`, own, Array.isArray(query) ? query : [query], concept]); }
    continue;
  }
  const minGap = Math.max(0.9, pace * 0.6); const bounds = []; let lastB = -99;
  for (const t of PHRASE_BOUNDS) { if (t >= s0 - 1e-6 && t < e0 && t - lastB >= minGap) { bounds.push(t); lastB = t; } }
  if (bounds.length === 0) bounds.push(s0);
  for (let i = 0; i < bounds.length; i++) { const t = +bounds[i].toFixed(2); if (inFull(t)) continue; const [own, query, concept] = list[i % list.length]; const { name, src } = pickSrc(own, secMatched); CLIPS.push([t, `b${++_bid}_${name}`, name, Array.isArray(query) ? query : [query], concept, src]); }
}

if (MODE === "build") {
  const _at = (p) => { try { return at(p); } catch { return null; } };
  const hpick = (cands, used) => { for (const c of cands) if (have(c) && !used.has(c)) return c; for (const c of cands) if (have(c)) return c; return null; };
  const HOOKSEQ = [
    ["7 trucos con agua oxigenada", ["px_h_bottle_hand"]],
    ["esa botellita de dos pesos", ["px_h_bottle_hand", "px_m_dark_bottle"]],
    ["despertar semillas viejas", ["px_h_seedling_sprout"]],
    ["salvar de la muerte", ["px_h_wilting_plant"]],
    ["quedate hasta el final", ["px_h2_question_garden"]],
    ["esa espuma blanca", ["px_h2_fizz_hand"]],
  ];
  const placed = HOOKSEQ.map(([ph, cands]) => ({ t: _at(ph), cands })).filter((x) => x.t != null).sort((a, b) => a.t - b.t);
  let hid = 0; const usedH = new Set();
  for (let i = 0; i < placed.length; i++) {
    const t = i === 0 ? OPEN : placed[i].t; let nm = hpick(placed[i].cands, usedH); if (!nm) nm = pickClip(allMatched[0], allMatched); if (!nm) continue; usedH.add(nm);
    CLIPS.push([+(t + 0.05).toFixed(2), `bh${++hid}_${nm}`, nm, [""], "hook"]);
    const nt = i + 1 < placed.length ? placed[i + 1].t : t + 4; const gap = nt - t;
    if (gap > 2.6) { const slots = Math.min(3, Math.floor(gap / 2.4)); for (let k = 1; k <= slots; k++) { const alt = pickClip(placed[i].cands.find((c) => have(c)) || placed[i].cands[0], allMatched); if (alt) CLIPS.push([+(t + (gap * k) / (slots + 1)).toFixed(2), `bh${++hid}_${alt}`, alt, [""], "hook"]); } }
  }
  console.log(`hook1 anclado: ${placed.length}/${HOOKSEQ.length} · ${hid} clips`);
}
CLIPS.sort((a, b) => a[0] - b[0]);

if (MODE === "match") {
  const seen = new Set(); const M = [];
  for (const [, , name, query, concept] of CLIPS) { if (seen.has(name)) continue; seen.add(name); M.push({ name, query, concept, dur: 6 }); }
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(M, null, 2));
  console.log(`match_${SLUG}.json: ${M.length}`); process.exit(0);
}

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...CLIPS.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
const OV = 0.5;
let beats = CLIPS.map(([t, id, name, , concept, src]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  const s = src || (have(name) ? `broll/${name}.mp4` : realImg(name));
  if (s) return { id, start: t, dur, kind: "raw", src: s, darken: 0 };
  return { id, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: concept + IMG_STYLE } };
});

// ── ANECSEQ: imágenes BESPOKE del abuelo/Levi/vecino en el ms EXACTO ──
const ANECSEQ = [
  ["vi a mi abuelo", "px_gf_amos_tomatoes"],
  ["teniamos un vecino", "px_gf_neighbor_store"],
  ["su huerta era un desastre", "px_gf_neighbor_deadgarden"],
  ["mi primera planta de tomate", "px_gf_levi_young"],
  ["metio el dedo en la tierra", "px_gf_amos_finger_soil"],
  ["esa planta levanto las hojas", "px_gf_tomato_saved"],
];
{
  let n = 0;
  for (const [ph, img] of ANECSEQ) {
    if (!fs.existsSync(`public/img/${img}.png`)) continue;
    let t; try { t = at(ph); } catch { continue; }
    if (inFull(t)) { /* durante avatar full no; buscar beat raw fuera */ }
    let idx = -1; for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) idx = i; else break; }
    if (idx < 0 || beats[idx].kind !== "raw") continue;
    beats[idx] = { id: beats[idx].id, start: beats[idx].start, dur: beats[idx].dur, kind: "raw", src: `img/${img}.png`, darken: 0, anec: true }; n++;
  }
  console.log(`anecseq: ${n}/${ANECSEQ.length} imágenes bespoke`);
}

const ck = (text) => ({ text, state: "done" });
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ comp anchor missing:", p); return null; } };
const _firstClip = (key) => { for (const [nm] of (SHOTS[key] || [])) if (fs.existsSync(`public/broll/${nm}.mp4`)) return nm; return null; };

// ═══ COMPONENTES A MEDIDA (baseline; el agente de componentes puede enriquecer) ═══
const COMPONENTS = [
  // HOOK — open loop: el error
  { t: atc("el error que comete casi todo el mundo"), id: "cmp_loop", kind: "mistake", number: "!", eyebrow: "EN ESTE VIDEO",
    title: "El error que quema las plantas", desc: "Casi todos lo cometen creyendo que ayudan. Mirá hasta el final.",
    bg: "a scorched wilted plant leaf with burn marks close up in a garden" },
  // VECINO — la cuenta (bars)
  { t: atc("la diferencia nunca fue la plata"), id: "cmp_cost_bars", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 8.0,
    title: "El vecino vs el abuelo", eyebrow: "La diferencia no era la plata",
    bars: [{ label: "Vivero: un frasco caro por problema", value: 100, display: "Camioneta llena", tone: "danger" }, { label: "Una botellita de agua oxigenada", value: 4, display: "$2, resuelve 7 cosas", winner: true }] },
  // CIENCIA — PeroxidoDiagram: la molécula con el O de más
  { t: atc("un oxigeno de mas"), id: "cmp_molecule", kind: "perox", dur: 9.0, mode: "molecule",
    title: "Por qué funciona: un oxígeno de más" },
  { t: atc("es oxigeno puro saliendo"), id: "cmp_fizz", kind: "callout", hue: "amber", accent: "good",
    figure: "O₂", eyebrow: "La espuma que ves", caption: "es oxígeno puro liberándose, justo donde hace falta" },
  { t: atc("la del tres por ciento"), id: "cmp_dose_which", kind: "callout", hue: "amber", accent: "good",
    figure: "3%", eyebrow: "La que se usa", caption: "la de farmacia, la de las heridas — nunca la industrial" },
  // TRUCO 1 — raíces respiran + dosis
  { t: atc("las raices tambien respiran"), id: "cmp_perox_roots", kind: "perox", dur: 8.0, mode: "roots",
    title: "Las raíces respiran" },
  { t: atc("una cucharada de agua oxigenada del 3 en un litro"), id: "cmp_dose1", kind: "callout", hue: "amber", accent: "good",
    figure: "1 cda / 1 L", eyebrow: "Truco 1 · oxigenar la tierra", caption: "regás como siempre, cada 1 o 2 semanas" },
  { t: atc("una planta ahogada muestra los mismos sintomas"), id: "cmp_ahogada", kind: "splitlist", palette: "D", cross: true, dur: 7.0,
    title: "Ahogada se ve igual que con sed", items: ["Hojas caídas y mustias", "Le echás más agua", "Y la terminás de hundir"] },
  // TRUCO 2 — semillas
  { t: atc("ni un minuto mas pone una alarma"), id: "cmp_dose2", kind: "callout", hue: "amber", accent: "good",
    figure: "30 min", eyebrow: "Truco 2 · despertar semillas", caption: "remojo en pura, del 3%, y ni un minuto más" },
  { t: atc("ablanda esa cascara"), id: "cmp_seeds_two", kind: "process", hue: "amber", accent: "good", dur: 8.0,
    title: "Dos cosas a la vez", eyebrow: "Por qué germinan mejor",
    steps: [{ title: "Ablanda la cáscara dura" }, { title: "Mata los hongos que trae pegados" }, { title: "Brotan parejas y días antes" }] },
  // TRUCO 3 — raíz podrida
  { t: atc("una cucharada y media por litro"), id: "cmp_dose3", kind: "callout", hue: "amber", accent: "danger",
    figure: "1½ cda / 1 L", eyebrow: "Truco 3 · raíz podrida", caption: "empapá la tierra alrededor del tallo y dejá de regar" },
  { t: atc("aparece una hojita nueva"), id: "cmp_rescue_check", kind: "checklist", hue: "amber", accent: "good", dur: 7.0,
    title: "¿Se salvó?", eyebrow: "Qué mirar",
    items: [ck("Día 1-3: sigue caída, es normal"), ck("A la semana: frena la caída"), ck("Aparece una hoja nueva = ganaste"), ck("Ahora regá menos y mejor")] },
  // TRUCO 4 — hongos hojas
  { t: atc("una cucharada por litro en un rociador"), id: "cmp_dose4", kind: "callout", hue: "amber", accent: "good",
    figure: "1 cda / 1 L", eyebrow: "Truco 4 · hongos en hojas", caption: "en rociador, arriba y abajo de la hoja" },
  { t: atc("nunca rocies con el sol pegando fuerte"), id: "cmp_sun_warn", kind: "impact", dur: 4.6, hitAt: 1.1, boom: 0, darken: 0.5,
    setup: "¿Rociás al mediodía?", impact: "El sol lo vuelve veneno. Quema la hoja.", impactAccent: "danger",
    bg: "harsh midday sun scorching garden plant leaves close up" },
  // TRUCO 5 — herramientas
  { t: atc("le pasaste la enfermedad"), id: "cmp_tools_impact", kind: "impact", dur: 4.4, hitAt: 1.1, boom: 0, darken: 0.45,
    setup: "Podás enferma y después sana...", impact: "Vos mismo contagiás la huerta.", impactAccent: "danger",
    bg: "pruning shears cutting a diseased plant stem close up" },
  { t: atc("agua oxigenada pura sin diluir"), id: "cmp_tools_how", kind: "checklist", hue: "amber", accent: "good", dur: 7.0,
    title: "Desinfectar en 2 segundos", eyebrow: "Truco 5 · con pura",
    items: [ck("Trapito con pura en la tijera"), ck("Entre planta y planta"), ck("Macetas viejas en remojo"), ck("Cepillás y enjuagás")] },
  // TRUCO 6 — mosquitos
  { t: atc("el problema real no esta arriba"), id: "cmp_gnats_split", kind: "splitlist", palette: "D", cross: true, dur: 7.0,
    title: "Por qué no se terminan nunca", items: ["Matás los que vuelan", "Abajo nacen las larvas", "Que se comen las raíces finas"] },
  { t: atc("sin larvas nuevas no hay adultos nuevos"), id: "cmp_dose6", kind: "callout", hue: "amber", accent: "good",
    figure: "1 cda / 1 L", eyebrow: "Truco 6 · mosca del sustrato", caption: "empapás la tierra, repetís 1-2 semanas, se corta de raíz" },
  // TRUCO 7 — agua viva
  { t: atc("le tiraba un chorrito de agua oxigenada"), id: "cmp_dose7", kind: "callout", hue: "amber", accent: "good",
    figure: "1 cda / 4 L", eyebrow: "Truco 7 · agua de riego viva", caption: "un chorrito siempre: reoxigena el agua estancada" },
  { t: atc("mas fuertes mas blancas mas sanas"), id: "cmp_water_bars", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 8.0,
    title: "Agua muerta vs agua viva", eyebrow: "Lo que cambia en la raíz",
    bars: [{ label: "Agua estancada del balde", value: 100, display: "Raíces débiles", tone: "danger" }, { label: "Agua reoxigenada", value: 100, display: "Raíces fuertes y blancas", winner: true }] },
  // ERROR — el grande
  { t: atc("si le pones de mas"), id: "cmp_error_impact", kind: "impact", dur: 4.8, hitAt: 1.1, boom: 0, darken: 0.5,
    setup: "¿Más es mejor?", impact: "De más, quema los pelitos de la raíz.", impactAccent: "danger",
    bg: "delicate white root hairs on a plant root macro close up" },
  { t: atc("son bajas a proposito"), id: "cmp_dose_rule", kind: "callout", hue: "amber", accent: "danger",
    figure: "1 cda / 1 L", eyebrow: "La regla de oro", caption: "las dosis son bajas a propósito: es una medicina, respetá la dosis" },
  // MITOS
  { t: atc("no es un fertilizante"), id: "cmp_myths", kind: "lielist", accent: "danger",
    title: "3 mitos del agua oxigenada", items: ["No es un fertilizante (es el botiquín)", "No sirve la industrial fuerte", "No dura para siempre: se degrada con la luz"] },
  { t: atc("echale un chorrito en la bacha"), id: "cmp_fizztest", kind: "focuscard", accent: "good", imageSide: "right",
    imgFileBg: "img/cmp_fizztest_bg.png", imgFile: "img/cmp_fizztest_bg.png", bgGen: "hydrogen peroxide fizzing bubbling on a metal kitchen sink close up",
    eyebrow: "¿Todavía sirve?", title: "La prueba del burbujeo", desc: "Un chorrito en la bacha: si burbujea, está viva; si queda quieta, está muerta." },
  // CUENTA final — todo de una botella
  { t: atc("una botellita de dos pesos"), id: "cmp_free", kind: "callout", hue: "amber", accent: "good",
    figure: "$2", eyebrow: "Todo esto salió de", caption: "una botellita que ya tenías tirada en el baño — cero vivero" },
  // RECAP — los 7 (checklist)
  { t: atc("un repaso bien rapido"), id: "cmp_recap", kind: "checklist", hue: "amber", accent: "good", dur: 9.0,
    title: "Los 7, redonditos", eyebrow: "Guardá el video",
    items: [ck("1 · Oxigenar la tierra encharcada"), ck("2 · Despertar semillas (remojo 30 min)"), ck("3 · Salvar la raíz podrida"), ck("4 · Hongos en hojas (jamás al sol)"), ck("5 · Desinfectar tijeras y macetas"), ck("6 · Larvas de mosquitos del sustrato"), ck("7 · Agua de riego más viva")] },

  // STORY — annotated: el dedo en la tierra (6º tipo estructurado)
  { t: atc("metio el dedo en la tierra"), id: "cmp_anno_finger", kind: "annotated", hue: "amber", eyebrow: "La prueba del abuelo", dur: 7.0,
    imgFile: (fs.existsSync("public/img/px_gf_amos_finger_soil.png") ? "img/px_gf_amos_finger_soil.png" : null),
    annotations: [
      { kind: "circle", x: 0.5, y: 0.55, w: 0.26, label: "Meté el dedo hasta abajo", color: "amber" },
      { kind: "arrow", x: 0.5, y: 0.6, fromX: 0.82, fromY: 0.12, label: "Si está mojada, no tiene sed: se ahoga", color: "good" },
    ] },
  // composites bespoke
  { t: atc("su huerta era un desastre"), id: "cmp_half_neighbor", kind: "half", side: "left", hue: "amber",
    srcFile: fileFor("px_gf_neighbor_deadgarden", "px_v_dead_garden"), kicker: "El vecino compró\ntodo — y su huerta\nera un desastre" },
  { t: atc("esa planta levanto las hojas"), id: "cmp_focus_saved", kind: "focuscard", accent: "good", imageSide: "right",
    imgFileBg: (fs.existsSync("public/img/px_gf_tomato_saved.png") ? "img/px_gf_tomato_saved.png" : null), imgFile: (fs.existsSync("public/img/px_gf_tomato_saved.png") ? "img/px_gf_tomato_saved.png" : null),
    eyebrow: "Mi primer tomate salvado", title: "Volvió a los 4 días", desc: "No tenía sed: se estaba ahogando. La tierra también se cura." },
];

// ── insertar componentes ──
let nComp = 0; const placedC = new Set(); const overlayComps = [];
for (const c of [...COMPONENTS].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
  if (c.t == null) continue;
  const { t, bg, bgGen, leftBg, rightBg, clipBg, kind, overlay, ...rest } = c;
  if (["half", "loupe", "splitexplain", "focuscard", "termcard"].includes(kind) && !rest.srcFile && !rest.imgFile) { console.warn("⚠ composite sin archivo:", c.id); continue; }
  if (rest.srcFile) { rest.src = rest.srcFile; delete rest.srcFile; }
  if (rest.imgFile) { rest.image = rest.imgFile; delete rest.imgFile; }
  if (rest.imgFileBg || (kind === "focuscard" || kind === "splitexplain")) { rest.bg = rest.imgFileBg || rest.image; delete rest.imgFileBg; }
  if (overlay) { const ab = { id: c.id, start: +t.toFixed(2), dur: c.dur || 3.0, kind, overlay: true }; delete rest.id; delete rest.dur; Object.assign(ab, rest); overlayComps.push(ab); nComp++; continue; }
  let idx = -1; for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start, D = c.dur || 6.0;
  const ab = { id: c.id, start, dur: D, kind }; delete rest.id; Object.assign(ab, rest);
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  if (bgGen && !ab.image) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bgGen + IMG_STYLE }; }
  if (clipBg) ab.image = `broll/${clipBg}.mp4`;
  if (c.image && !bg && !clipBg) ab.image = c.image;
  let rm = 1; while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab); placedC.add(c.id);
  const next = beats[idx + 1], nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2); nComp++;
}
console.log(`componentes: ${nComp}`);

// ── HOOK BURST + tiling ──
beats.sort((a, b) => a.start - b.start);
{
  const fillers = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i]; if (b.start >= 40 || b.overlay || b.kind === "raw") continue;
    const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL; if (nextStart - b.start <= 5.5) continue;
    let t = +(b.start + 4.2).toFixed(2);
    while (nextStart - t > 1.6) { const nm = pickClip(allMatched[0], allMatched); if (!nm || !have(nm)) break; fillers.push({ id: `bf_${nm}_${Math.round(t * 10)}`, start: t, dur: 2.4, kind: "raw", src: `broll/${nm}.mp4`, darken: 0 }); t = +(t + 2.6).toFixed(2); }
  }
  beats.push(...fillers); beats.sort((a, b) => a.start - b.start);
}
for (let i = 0; i < beats.length; i++) {
  const b = beats[i], nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const gap = end - b.start, ov = b.kind === "raw" ? Math.min(OV, gap * 0.25) : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

// ── overlays SOLO sobre clips, nunca sobre componentes ──
const KPHRASES = [
  kphrase("un oxigeno de mas", ["mas"]),
  kphrase("las raices tambien respiran", ["respiran"]),
  kphrase("mas es mejor", ["mejor"]),
  kphrase("nunca al sol fuerte", ["nunca"]),
  kphrase("una botellita de dos pesos", ["dos"]),
].filter(Boolean);
{
  const comps = beats.filter((b) => !b.overlay && b.kind !== "raw");
  const overComp = (o) => comps.some((c) => o.start < c.start + c.dur - 0.2 && o.start + o.dur > c.start + 0.2);
  const all = [...KPHRASES, ...overlayComps].sort((a, b) => a.start - b.start); const kept = [];
  for (const o of all) { if (overComp(o) || kept.some((k) => o.start < k.start + k.dur && o.start + o.dur > k.start)) continue; kept.push(o); }
  beats.push(...kept); console.log(`overlays: ${kept.length} sobre clips`);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

// ═══ AVATAR-SAFE: UNA esquina fija + OCULTO durante TODO componente/overlay ═══
const CORNER = "cornerBR";
const compZones = beats.filter((b) => b.kind !== "raw").map((b) => [b.start, b.start + b.dur]);
const inComp = (t) => compZones.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw").sort((a, b) => a.start - b.start);
const pip = [];
for (let i = 0; i < _bw.length; i++) {
  const b = _bw[i];
  if (i % 4 !== 2) continue;                          // solo algunos → desaparece por tramos
  if (inFull(b.start) || inComp(b.start)) continue;   // nunca en full ni sobre componente
  let end = b.start + Math.min(b.dur, 5);
  const nextComp = compZones.map((z) => z[0]).filter((s) => s > b.start + 0.05).sort((a, b) => a - b)[0] ?? Infinity;
  const nextAv = avStarts.filter((s) => s > b.start + 0.05).sort((a, b) => a - b)[0] ?? Infinity;
  end = Math.min(end, nextComp, nextAv);
  if (end - b.start < 1.4) continue;
  pip.push([+(b.start + 0.12).toFixed(2), +end.toFixed(2), CORNER]);
}
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden";
};
const pts = [...new Set([0, OPEN, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_peroxido.gen.ts", `// avatar_peroxido.gen.ts — GENERADO por build_peroxido.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_PEROXIDO = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);
console.log(`avatar windows: ${windows.length} · PiP (${CORNER}): ${pip.length} · beats: ${beats.length}`);
console.log(`=== build_peroxido === beats:${beats.length} comps:${nComp}`);
