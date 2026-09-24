// gen_salitre2.mjs — beatsheet/salitre2.json (El Constructor Libre · humedad/salitre).
// "El Salitre Que Vuelve Siempre: El Error..." ~23 min. Clon de gen_azotea.
// ★★ REGLA DURA: CADA beat con at:"frase" → un visual por cada cosa nombrada, ms exacto.
import fs from "fs";

const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinacion de camara, luz desigual, texturas reales, manos naturales con dedos correctos, pequenas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental autentico, saturacion baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre rural de unos 45 anos, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marron";
const PAV = (d) => P(`${AV}, ${d}, en una casa con problemas de humedad`);
const DP = (d) => `Crear una infografia horizontal, RELACION DE ASPECTO EXACTA 16:9 (1792x1024), estilo lamina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, lineas marron oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJA LIBRE la esquina superior derecha. Composicion minimalista, ilustracion de tinta fina con acuarela suave, se entiende en 1 segundo. Textos en espanol, breves. Estetica vintage botanical / archival textbook.`;
const CUT = (d) => `${d}. Recorte troquelado (die-cut) sobre fondo COMPLETAMENTE TRANSPARENTE. NADA detras: sin fondo, sin piso, sin sombra, sin gradiente, transparencia total (alpha). Solo el objeto centrado, borde limpio, PNG con transparencia real.`;

const HUES = ["blue", "red", "amber"];
const r = (name, at, prompt, o = {}) => ({ t: "raw", name, at, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, at, prompt, o = {}) => ({ t: "raw", name, at, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, at, prompt, o = {}) => ({ t: "raw", name, at, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, at, props = {}) => ({ t: kind, at, ...props });
const sd = (at, panels) => ({ t: "scrolldoc", at, panels });
const DIAGRAMS = [], CUTOUTS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const cut = (name, prompt) => { CUTOUTS.push({ name, prompt, transparent: true, size: "1024x1024" }); return `img/${name}.png`; };
const pz = (at, items, o = {}) => ({ t: "avpizarra", at, items, ...o });

const W = { raw: 1.4, quote: 1.05, headline: 1.0, aged: 1.2, checklist: 1.3, splitlist: 1.1, bars: 1.25, annotated: 1.3, callout: 1.05, diagram: 2.4, scrolldoc: 6.0, avpizarra: 3.0 };

const SECTIONS = [
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", null, {}),
    rv("sa_rascaste", "rascaste el salitre", "hands scraping white salitre efflorescence off a wall with a spatula", { frames: 90, hold: true }),
    rv("sa_pintaste", "pintaste encima", "painting over a patched wall section, looking neat and clean", { frames: 75 }),
    rv("sa_volvio", "tres meses despues volvio", "white salitre stains coming back through fresh paint at the bottom of a wall, worse", { frames: 90 }),
    r("sa_sintoma", "atacaste el sintoma", "a thermometer showing fever, treating a symptom not the cause"),
    r("sa_aspirina_hook", "es como tomar una aspirina", "an aspirin pill next to a sick wall, treating fever while infection continues"),
    r("sa_cartel", "el cartel que te avisa", "white salitre on a wall like a warning sign of hidden water damage"),
    c("headline", "lo que lo produce", { tokens: ["El", "error", "que", "nadie", "te", { t: "dice" }], eyebrow: "El salitre vuelve por esto", bg: "image", image: r("sa_hook_super", null, "a wall with rising damp and salitre, hidden water rising from the ground").gen.name, _genImg: "sa_hook_super", _prompt: P("a wall with rising damp and salitre, water rising from ground") }),
    rav("sa_tomas_hook", "yo soy tomas", "pointing at a wall with salitre stains, serious and knowledgeable, looking at camera", { kicker: "La barrera de $2" }),
  ]},
  { key: "guia1", phrase: "una cosa rapida antes de arrancar", beats: [
    c("callout", "el manual del constructor libre", { image: r("sa_manual1", null, "a phone showing an open ebook home-repair manual on a workbench, warm light").gen.name, figure: "+40", caption: "arreglos de la casa, en un solo lugar", accent: "good", _genImg: "sa_manual1", _prompt: P("a phone showing an ebook home-repair manual, warm light") }),
  ]},
  // ░░ QUÉ ES EL SALITRE ░░
  { key: "quees", phrase: "sepamos contra quien peleamos", beats: [
    r("sa_no_hongo", "el salitre no es un hongo", "close macro of white salitre crystals, NOT mold, mineral salt not organic"),
    r("sa_sales", "el salitre son sales", "macro of white salt crystals on a wall surface, like table salt or sugar"),
    c("diagram", "el proceso es simple", { eyebrow: "Cómo se forma el salitre", slides: [{ image: dg("dg_sa_proceso", "Diagrama: el agua entra al ladrillo, disuelve los minerales, sube/cruza, se evapora en la superficie de la pared y deja los cristales de sal (salitre) acumulados. Flechas de agua entrando, subiendo, evaporandose; la sal se queda. Etiqueta: 'el agua se evapora, la sal se queda'."), eyebrow: "El agua se evapora, la sal se queda" }] }),
    rv("sa_empuja", "revientan la pintura", "salt crystals growing and pushing paint and render off a wall from underneath", { frames: 75 }),
    r("sa_revoque_cae", "el revoque que se cae solo", "chunks of render falling off a damp wall on their own, salt damage"),
    r("sa_ladrillo_polvo", "carcomen el propio ladrillo", "a brick crumbling to powder eaten away by salt and damp"),
    pz("si hay salitre es porque hay humedad", [{ png: cut("sa_cut_gota", CUT("una gota de agua azul brillante, simbolo de humedad")), title: "Si hay salitre, hay HUMEDAD", body: "el salitre es la punta del iceberg" }], { side: "right", eyebrow: "La regla de oro" }),
  ]},
  // ░░ POR QUÉ NO IGNORARLO ░░
  { key: "ignorar", phrase: "por que esto no se puede dejar pasar", beats: [
    r("sa_estructura", "la estructura", "a weakened damaged wall with crumbling render, structural damage from damp"),
    r("sa_moho_salud", "el moho", "black mold in a damp corner, bad for health, kids breathing it"),
    r("sa_valor_casa", "pierde valor", "a house viewing where a buyer frowns at damp stains on the wall, lost value"),
  ]},
  // ░░ LA ASPIRINA (sacar el salitre) ░░
  { key: "aspirina", phrase: "vamos por la aspirina", beats: [
    r("sa_acido", "acido muriatico", "a bottle of muriatic hydrochloric acid from a hardware store, dangerous chemical"),
    rv("sa_vapores", "larga vapores", "corrosive acid fumes rising, danger, working with a mask near an open window", { frames: 60 }),
    c("checklist", "escuchame bien la seguridad", { title: "Seguridad con el ácido", items: [
      { text: "Guantes de goma y antiparras", state: "done" },
      { text: "Barbijo + ventana abierta", state: "done" },
      { text: "Cubrir el piso con nylon", state: "done" } ] }),
    rv("sa_cepillo", "cepillo de cerdas duras", "dry-brushing loose salitre and flaking paint off a wall with a stiff brush", { frames: 75 }),
    r("sa_dilucion", "uno a tres", "measuring one part acid into three parts water in a bucket, correct dilution"),
    rv("sa_agua_primero", "primero pones las tres partes de agua", "pouring water into a bucket first, then adding acid carefully, correct order", { frames: 60, at: "recien despues le agregas" }),
    rv("sa_efervescencia", "una efervescencia", "acid fizzing and bubbling on white salitre on a wall, dissolving the salt", { frames: 90, hold: true }),
    r("sa_diez_minutos", "cinco y diez minutos", "acid left to work on a wall stain for five to ten minutes, a clock"),
    rv("sa_enjuague", "enjuaga con abundante agua tibia", "rinsing a wall with plenty of warm water and a brush after the acid", { frames: 75 }),
    r("sa_terminacion", "la terminacion", "finishing a clean dry wall with sealer and latex paint, restored"),
    r("sa_revocar", "sacar todo ese revoque", "removing loose blown render off a wall down to the brick, then re-rendering"),
    r("sa_ladrillo_visto", "el ladrillo a la vista", "white salitre stains on exposed brick, cleaned with a weaker acid dilution"),
  ]},
  { key: "bridge", phrase: "esto es solo la aspirina", beats: [
    rav("sa_tomas_bridge", "ahora viene lo que de verdad resuelve", "explaining that removing salitre is only half, the cause must be cut, to camera"),
  ]},
  // ░░ EL ANTIBIÓTICO — 3 HUMEDADES ░░
  { key: "antibiotico", phrase: "el antibiotico es encontrar la humedad", beats: [
    rav("sa_tomas_medico", "hacernos un poco los medicos", "reading the wall like a doctor reading symptoms, diagnosing the damp", { kicker: "3 humedades, 3 tratamientos" }),
  ]},
  { key: "filtracion", phrase: "la primera humedad por filtracion", beats: [
    r("sa_cano_roto", "un cano roto", "a broken leaking water pipe inside a wall, water escaping"),
    rv("sa_suda_gotitas", "suda gotitas", "an intense wet patch on a wall sweating water droplets, sharp defined edges", { frames: 75 }),
    r("sa_marca_crece", "la mancha crece", "a pencil mark on a damp stain edge that grows bigger over days"),
    r("sa_plomero", "llama a un plomero", "a plumber fixing a leaking pipe in a wall, the real fix"),
  ]},
  { key: "lluvia", phrase: "la segunda humedad de lluvia", beats: [
    r("sa_pared_exterior", "solo en las paredes exteriores", "damp and salitre only on the exterior weather-facing walls of a house"),
    rv("sa_empeora_lluvia", "empeora justo despues de que llueve", "an exterior wall getting wetter and darker right after rain", { frames: 75 }),
    r("sa_impermeable_afuera", "impermeabilizando la pared exterior", "sealing an exterior wall from outside with waterproof render or paint"),
    r("sa_latex_imper", "un latex impermeable para exteriores", "brushing waterproof exterior latex paint onto an outside wall"),
  ]},
  // ░░ CAPILARIDAD (la más común) ░░
  { key: "capilaridad", phrase: "la humedad de cimientos", beats: [
    c("diagram", "una capa aisladora", { eyebrow: "La humedad que SUBE", slides: [{ image: dg("dg_sa_capilaridad", "Diagrama: agua del suelo sube por la pared por capilaridad (como el cafe sube por un terron de azucar) porque falta la capa aisladora cerca del piso. Flecha de agua ascendiendo desde el cimiento; el salitre aparece abajo. Etiqueta: 'sube del suelo, aparece abajo'."), eyebrow: "El agua sube del suelo como el café por el azúcar" }] }),
    rv("sa_cafe_terron", "como sube el cafe por un terron", "coffee wicking up a sugar cube by capillarity, analogy for rising damp", { frames: 75 }),
    r("sa_capa_rota", "se rompio con los años", "an old failed damp-proof course near the floor, broken, letting water rise"),
    r("sa_franja_abajo", "en la parte de abajo de la pared", "a horizontal band of damp and salitre along the bottom 40cm of a wall, rising from the floor"),
    r("sa_linea_sube", "una linea de humedad que sube", "a clear tide line of damp rising from the skirting board up the wall"),
  ]},
  // ░░ LA BARRERA POR INYECCIÓN (héroe) ░░
  { key: "inyeccion", phrase: "la barrera por inyeccion", beats: [
    r("sa_taladro_mecha", "un taladro y una mecha larga", "a drill with a long 13mm bit ready to drill a wall for damp injection"),
    r("sa_dos_tercios", "dos terceras partes del espesor", "a cross-section of a wall showing angled holes drilled two thirds of its thickness"),
    rv("sa_perforaciones", "una fila de perforaciones", "drilling a row of holes every 10-15cm along the bottom of a wall, angled down", { frames: 90, at: "una al lado de la otra" }),
    rv("sa_inyectar", "por esos agujeros", "injecting liquid silicate sealer into the drilled holes at the base of a wall", { frames: 90 }),
    r("sa_tres_dias", "durante unos tres dias", "repeatedly topping up injected sealer into wall holes over three days until saturated"),
    rv("sa_cristaliza", "se cristaliza", "the injected liquid crystallizing inside the brick pores forming a continuous barrier", { frames: 75, at: "forma una barrera" }),
    rv("sa_pared_seca", "la pared se empieza a secar sola", "a damp wall drying out from the top down over weeks, the stain retreating to the floor", { frames: 90, hold: true, at: "va bajando" }),
  ]},
  { key: "guia2", phrase: "cuanto liquido por metro", beats: [
    c("callout", "el manual del constructor libre", { image: r("sa_manual2", null, "a printed injection diagram and dosage table pinned to a wall, exact quantities").gen.name, figure: "cm", caption: "cada cuánto perforar + dosis exactas", accent: "good", _genImg: "sa_manual2", _prompt: P("a printed injection diagram and dosage table on a wall") }),
  ]},
  { key: "otros", phrase: "hay otras dos maneras", beats: [
    r("sa_rehacer_capa", "rehacer la capa aisladora", "cutting a wall in sections to insert a new damp-proof course, invasive work"),
    r("sa_electroosmosis", "de electroosmosis", "a small electronic electro-osmosis box on a wall inverting rising damp"),
  ]},
  { key: "plata", phrase: "hagamos la cuenta la de la plata", beats: [
    c("bars", "te cobran una fortuna", { title: "Barrera anti-humedad", unit: "US$", bars: [{ label: "Empresa especialista", value: 100, tone: "danger" }, { label: "Inyección casera", value: 5, winner: true }] }),
    r("sa_revoque_hidrofugo", "el revoque hidrofugo", "applying a waterproof hydrofuge render base coat against brick, then normal render"),
  ]},
  // ░░ POR QUÉ LO ESCONDEN ░░
  { key: "esconden", phrase: "por que casi nadie te explica esto", beats: [
    r("sa_pintura_antihumedad", "la pintura anti-humedad", "shelves of expensive anti-damp wall paint at a store, an aspirin that peels off"),
    c("headline", "un cliente de por vida", { tokens: ["Te", "venden", "la", { t: "aspirina" }], eyebrow: "El antibiótico te lo esconden", bg: "image", image: r("sa_cliente", null, "endless cycle of repainting a damp wall that keeps failing, planned").gen.name, _genImg: "sa_cliente", _prompt: P("repainting a damp wall that keeps failing forever") }),
    r("sa_capa_vieja", "los viejos ponian una hilada", "old builders laying a course of vitrified bricks as a damp barrier, sepia"),
    r("sa_brea", "una capa de brea", "an old damp-proof course layer of tar or lead above the foundation, historical sepia"),
  ]},
  // ░░ FAQ → SCROLLDOC ░░
  { key: "faq", phrase: "las dudas que siempre me hacen", beats: [
    rav("sa_tomas_faq", "las dudas que siempre me hacen", "answering questions to camera about damp, relaxed", { kicker: "Las dudas de siempre" }),
    sd("como se cual de las tres", [
      { name: "sa_q_cual", eyebrow: "Diagnóstico", heading: "¿Cuál de las 3?", prompt: "reading where the salitre appears on a wall to diagnose the damp type", clip: true },
      { name: "sa_q_pintar", eyebrow: "Orden", heading: "¿Pinto encima?", prompt: "paint peeling off because it was applied over salitre and damp, wrong order", clip: true },
      { name: "sa_q_acido", eyebrow: "El ácido", heading: "¿Daña la pared?", prompt: "diluted rinsed acid safe on a wall vs pure acid damage", clip: true },
      { name: "sa_q_seca", eyebrow: "Paciencia", heading: "¿Cuánto tarda en secar?", prompt: "a wall slowly drying over weeks after cutting the damp, patience", clip: true },
    ]),
  ]},
  // ░░ CTA (mención 3) ░░
  { key: "cta", phrase: "esta ordenado en el manual del constructor libre", beats: [
    c("quote", "ya lo pagaste veinte veces", { image: r("sa_manual3", null, "a phone showing the home-repair manual on a workbench near a fixed wall").gen.name, text: "Con NO llamar a un especialista, *ya lo pagaste*.", accent: "good", _genImg: "sa_manual3", _prompt: P("a phone showing an ebook home-repair manual, warm light") }),
  ]},
  // ░░ CIERRE + PUENTE ░░
  { key: "cierre", phrase: "quedate con esto", beats: [
    r("sa_aliado", "el salitre es tu aliado", "white salitre on a wall reframed as a helpful warning sign, not an enemy"),
    r("sa_encontra_agua", "encontra el agua cortala", "finding the source of water in a wall and cutting it off, the smart fix"),
    rav("sa_tomas_cierre", "manchas negras del techo", "on camera closing the video pointing at black mold in a bathroom corner, warm", { kicker: "El próximo: el moho y la condensación" }),
    c("headline", "que el salitre no vuelva", { tokens: ["Curá", "la", "pared", "de", { t: "verdad" }], eyebrow: "Aspirina para hoy, antibiótico para siempre", bg: "image", image: r("sa_cierre", null, "a healed dry clean wall at golden hour, no more salitre, restored").gen.name, _genImg: "sa_cierre", _prompt: P("a healed dry clean wall at golden hour, restored") }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico a azotea, min-gap 0.9) ───────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_salitre2.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000, raw: x.text }));
const findMs = (phrase, after) => { const p = norm(phrase).split(" ").filter(Boolean).slice(0, 7); if (p.length < 2) return null; for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; } if (ok) return CW[i].s; } return null; };
const capsText = (t, win = 3.0, maxWords = 16) => { const w = []; for (const x of CW) { if (x.s < t - 0.15) continue; if (x.s > t + win) break; w.push(x.raw); if (w.length >= maxWords) break; } return w.join(" ").replace(/\s+/g, " ").trim(); };
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1364) + 1.5;

let cursorSec = 0;
for (const sec of SECTIONS) { if (sec.start != null) { cursorSec = sec.start; continue; } const ms = findMs(sec.phrase, cursorSec + 1); sec.start = ms != null ? ms : cursorSec + 5; if (ms == null) console.warn(`⚠ sin ancla SECCION: "${sec.phrase}" (${sec.key})`); cursorSec = sec.start; }
SECTIONS.sort((a, b) => a.start - b.start);

const MISS = [], beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si]; const start = sec.start; const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END; const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; return w; });
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; const ph = pinPhrase(b); if (!ph) return null; const ms = findMs(ph, start + 0.3); if (ms == null && b.at) MISS.push(`${sec.key}[${i}] "${b.at}"`); return ms != null && ms > start + 0.5 && ms < end - 1.0 ? ms : null; });
  let lastPin = start; for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 0.9) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) { const a = fixed[f], b = fixed[f + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const dur = +((i + 1 < n ? startT[i + 1] : end) - cursor).toFixed(2); const id = `${sec.key}_${i}`; const hue = HUES[(si + i) % HUES.length]; const beat = { id, start: cursor, dur };
    if (b.t === "raw") { beat.kind = "raw"; beat.src = fs.existsSync(`public/broll/${b.name}.mp4`) ? `broll/${b.name}.mp4` : fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`; beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; if (b.gen) beat.gen = b.gen; }
    else if (b.t === "scrolldoc") { beat.kind = "scrolldoc"; const np = b.panels.length, per = dur / np; beat.panels = b.panels.map((p, k) => { const pt = +(cursor + k * per).toFixed(2); const clipOk = fs.existsSync(`public/vid/${p.name}.mp4`); const pan = { eyebrow: p.eyebrow, heading: p.heading, body: capsText(pt, Math.min(per, 3.4)) }; if (clipOk) pan.media = `vid/${p.name}.mp4`; else pan.poster = `img/${p.name}.png`; return pan; }); }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; delete beat._genImg; delete beat._prompt; if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true })); if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); if (!beat.hue) beat.hue = hue; }
    beats.push(beat);
  });
}

const extraImgs = []; const scan = (o) => { if (!o || typeof o !== "object") return; if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); }; SECTIONS.forEach((s) => s.beats.forEach(scan));
const panelImgs = []; SECTIONS.forEach((s) => s.beats.forEach((b) => { if (b.t === "scrolldoc") b.panels.forEach((p) => panelImgs.push({ name: p.name, prompt: P(p.prompt) })); }));
const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o.at; for (const k of Object.keys(o)) strip(o[k]); }; beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } }; beats.forEach(fixImg);
const BG = new Set(["headline", "aged", "quote", "callout"]); for (const b of beats) { if (BG.has(b.kind) && typeof b.image === "string") { const m = b.image.match(/^img\/(.+)\.png$/); if (m && fs.existsSync(`public/vid/${m[1]}.mp4`)) b.image = `vid/${m[1]}.mp4`; } }

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/salitre2.json", JSON.stringify({ video: "salitre2", avatar: "salitre2_opt.mp4", tutorial: true, beats, extraImages: extraImgs.concat(panelImgs) }, null, 1));
fs.writeFileSync("public/img/prompts_salitre2_diag.json", JSON.stringify(DIAGRAMS, null, 2));
fs.writeFileSync("public/img/prompts_salitre2_cutouts.json", JSON.stringify(CUTOUTS, null, 2));
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${beats.filter((b) => b.kind === "raw").length} · scrolldoc: ${beats.filter((b) => b.kind === "scrolldoc").length} · avpizarra: ${beats.filter((b) => b.kind === "avpizarra").length} · diag: ${DIAGRAMS.length} · cutouts: ${CUTOUTS.length} · dur: ${(dur / 60).toFixed(1)}min`);
if (MISS.length) console.log(`⚠ anclas no encontradas (${MISS.length}): ${MISS.join(" · ")}`); else console.log("✓ TODAS las anclas at: encontradas");
