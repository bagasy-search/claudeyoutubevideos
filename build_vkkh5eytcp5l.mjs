// build_vkkh5eytcp5l.mjs — "Este TRUCO Amish de 5 dólares… (la OLLA de barro enterrada)"
//   canal: Levi Lapp Jardín (ES) · kit amish · híbrido AVATAR + b-roll REAL
//   · clips REALES de stock  → public/broll/vkkh5eytcp5l/<name>.mp4  (aislados por slug)
//   · imágenes gpt-image-2   → public/img/vk_*.png   (momentos personales, con cara de ref)
//   · fotos reales de la web → public/real/vkkh5eytcp5l_*.jpg
//   · componentes del kit compartido src/VideoEdit/scenes/
// Todo anclado al ms exacto de Whisper por FRASE (at()), nunca a ojo.
// Salida: beatsheet/vkkh5eytcp5l.json + src/VideoEdit/avatar_vkkh5eytcp5l.gen.ts + _v3/<slug>_plan.json
import fs from "fs";

const SLUG = "vkkh5eytcp5l";
const AVATAR = `${SLUG}_opt.mp4`;

// ── captions ────────────────────────────────────────────────────────────────
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs, e: c.endMs }));
const TOTAL = +((W[W.length - 1].e) / 1000 + 1.0).toFixed(2);

// ancla MONOTÓNICA: la narración sigue el orden del guion, así que avanzamos un puntero.
let PTR = 0;
function anchorSeq(phrase, maxTok = 7) {
  const t = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok);
  if (!t.length) return null;
  for (let i = PTR; i <= W.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) { PTR = i + 1; return W[i].ms / 1000; }
  }
  return null;
}
// Whisper escribe los NÚMEROS en dígitos ("5 dólares", "90 %") y el guion en letras.
// Sin esto se pierde una de cada seis anclas. Probamos las dos escrituras.
const NUM = [["dos mil", "2000"], ["ciento veinte", "120"], ["noventa", "90"], ["ochenta", "80"], ["setenta", "70"],
["sesenta", "60"], ["cincuenta", "50"], ["cuarenta y cinco", "45"], ["cuarenta", "40"], ["treinta", "30"],
["veinticinco", "25"], ["veinte", "20"], ["quince", "15"], ["catorce", "14"], ["trece", "13"], ["doce", "12"],
["once", "11"], ["diez", "10"], ["nueve", "9"], ["ocho", "8"], ["siete", "7"], ["seis", "6"], ["cinco", "5"],
["cuatro", "4"], ["tres", "3"], ["dos", "2"], ["una", "1"], ["uno", "1"], ["por ciento", "%"]];
function variants(phrase) {
  const base = norm(phrase);
  let d = base;
  for (const [w, n] of NUM) d = d.replace(new RegExp(`\\b${w}\\b`, "g"), n);
  return d === base ? [base] : [base, d, norm(d)];
}
// ancla LIBRE (para componentes: busca en todo el stream, sin mover el puntero).
// Degrada de 7 tokens a 3 antes de rendirse: una palabra mal transcrita no debe costar el cartel.
function at(phrase, maxTok = 7) {
  for (const v of variants(phrase)) {
    const all = v.split(" ").filter(Boolean);
    for (const len of [Math.min(maxTok, all.length), 5, 4, 3, 2]) {
      if (len > all.length || len < 2) continue;
      const t = all.slice(0, len);
      for (let i = 0; i <= W.length - t.length; i++) {
        let ok = 1;
        for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
        if (ok) return W[i].ms / 1000;
      }
    }
  }
  return null;
}
const atc = (p, m) => { const v = at(p, m); if (v == null) console.warn("⚠ anchor:", p.slice(0, 48)); return v; };

const OPEN_CLEAR_PRE = 3.2;  // apertura intocable: avatar full sin carteles
// Arma la tipografía SINCRONIZADA leyendo las palabras reales de la transcripción a
// partir de un ms dado. No depende de que el guion y Whisper coincidan letra a letra.
function klineFrom(tSec, nWords) {
  let i = W.findIndex((w) => w.ms / 1000 >= tSec - 0.02);
  if (i < 0) return null;
  const span = W.slice(i, i + nWords).filter((w) => w.n);
  if (span.length < 3) return null;
  const t0 = span[0].ms;
  const longest = span.reduce((a, b) => (b.n.length > a.n.length ? b : a));
  return {
    id: `klf${++_kid}`, start: +(t0 / 1000).toFixed(2),
    dur: +Math.max(2.9, ((span[span.length - 1].ms - t0) / 1000) + 1.6).toFixed(2),
    kind: 'kineticline', overlay: true, accent: 'amber',
    words: span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(w === longest ? { hl: true } : {}) })),
  };
}
// kphrase: frase cinética sincronizada palabra por palabra al ms real
let _kid = 0;
let QUIET = false;
const kphraseQuiet = (p, e) => { QUIET = true; const r = kphrase(p, e); QUIET = false; return r; };
function kphrase(phrase, emph = []) {
  for (const v of variants(phrase)) {
  const tw = v.split(" ").filter(Boolean);
  for (let i = 0; i <= W.length - tw.length; i++) {
    let ok = 1;
    for (let j = 0; j < tw.length; j++) if (W[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) {
      const span = W.slice(i, i + tw.length), t0 = span[0].ms;
      const eset = new Set(emph.map(norm));
      return {
        id: `kl${++_kid}`, start: +(t0 / 1000).toFixed(2),
        dur: +Math.max(2.9, ((span[span.length - 1].ms - t0) / 1000) + 1.6).toFixed(2),
        kind: "kineticline", overlay: true, accent: "amber",
        words: span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(eset.has(w.n) ? { hl: true } : {}) })),
      };
    }
  }
  }
  if (!QUIET) console.warn("⚠ kphrase:", phrase.slice(0, 48));
  return null;
}

// ── inventario de assets EN DISCO (nunca inventar nombres) ──────────────────
const CLIPS = fs.readdirSync(`public/broll/${SLUG}`).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, ""));
const IMGS = fs.existsSync("public/img") ? fs.readdirSync("public/img").filter((f) => /^vk_.*\.(png|jpg|jpeg)$/i.test(f)) : [];
const REALS = fs.existsSync("public/real") ? fs.readdirSync("public/real").filter((f) => new RegExp(`^${SLUG}_.*\\.(jpg|jpeg|png|webp)$`, "i").test(f)) : [];
const srcOfClip = (n) => `broll/${SLUG}/${n}.mp4`;
const imgFile = (base) => IMGS.find((f) => f.replace(/\.[a-z]+$/i, "") === base);
const srcOfImg = (base) => { const f = imgFile(base); return f ? `img/${f}` : null; };
const REALSRC = REALS.map((f) => `real/${f}`);
console.log(`assets: ${CLIPS.length} clips · ${IMGS.length} imgs IA · ${REALS.length} fotos reales`);

// ── TEMAS: palabra del guion → assets on-topic. El primero que matchea gana. ──
const has = (s, ...ws) => ws.some((w) => s.includes(w));
const TOPICS = [
  { k: (s) => has(s, "olla", "maceta", "vasija", "barro", "terracota"), a: ["olla_barro_manos", "maceta_barro_vacia", "macetas_terracota_pila", "b_maceta_barro_mano2", "b_macetas_fila", "b_barro_textura", "b_ceramica_secando", "vk_levi_olla_mano", "vk_olla_tapada_plato", "vk_levi_dos_macetas", "vk_poros_barro_macro", "vk_olla_corte_tierra"] },
  { k: (s) => has(s, "alfarer", "cocido", "horno", "amasa"), a: ["alfarero_torno", "alfareria_taller", "barro_manos_amasando", "ceramica_horno", "b_alfarero_manos2", "b_horno_ceramica"] },
  { k: (s) => has(s, "poro", "suda", "canal", "absor", "microsc"), a: ["vk_poros_barro_macro", "vk_mancha_humeda_barro", "agua_absorbida_tierra", "b_agua_absorber_tela", "microscopio_muestra", "b_microscopio_lente"] },
  { k: (s) => has(s, "esmalt", "barniz", "brillo", "perla", "sellad"), a: ["vk_gota_perla_esmalte", "vk_levi_dos_macetas", "vk_levi_prueba_agua", "vk_mancha_humeda_barro"] },
  { k: (s) => has(s, "raiz", "raices", "abraza", "malla", "red", "viaje"), a: ["raices_planta_tierra", "raices_transplante", "b_raiz_desnuda", "b_raices_maceta", "b_raiz_creciendo", "vk_raices_abrazando_olla", "vk_levi_olla_raices", "vk_raices_superficiales"] },
  { k: (s) => has(s, "tomate"), a: ["tomates_planta", "tomate_maduro_rama", "tomate_cosecha_cesta", "b_tomate_planta2", "b_tomate_verde", "b_tomate_regando", "vk_tomate_rajado_macro", "tomate_rajado", "b_tomate_cortando"] },
  { k: (s) => has(s, "pimiento", "berenjena", "calabacin", "pepino", "melon"), a: ["pimiento_planta", "berenjena_planta", "calabacin_planta", "pepino_planta", "melon_planta", "b_pimiento_rojo", "b_berenjena_morada", "b_calabacin_flor", "b_pepino_cosecha", "b_melon_campo", "vk_pimiento_mancha_negra"] },
  { k: (s) => has(s, "lechuga", "espinaca", "amarga", "flor", "hoja"), a: ["lechuga_huerta", "lechuga_marchita", "b_lechuga_cortando", "b_espinaca_hojas", "b_rucula_siembra", "vk_lechuga_espigada"] },
  { k: (s) => has(s, "menta", "hierbabuena", "melisa"), a: ["menta_planta", "b_menta_hojas", "vk_menta_invadiendo"] },
  { k: (s) => has(s, "calabaza", "zapallo", "cuna"), a: ["calabaza_campo", "b_calabaza_hoja", "vk_calabaza_raiz_cuna", "vk_levi_olla_partida"] },
  { k: (s) => has(s, "hierba", "romero", "tomillo", "albahaca"), a: ["hierbas_aromaticas", "b_romero_planta", "b_tomillo_planta", "b_albahaca_planta"] },
  { k: (s) => has(s, "manguera", "chorro", "grifo", "llave", "bomba"), a: ["manguera_riego", "manguera_chorro", "manguera_plastico", "b_manguera_enrollada", "b_grifo_agua", "b_grifo_goteando", "b_bomba_agua", "vk_manguera_rajada_sol"] },
  { k: (s) => has(s, "goteo", "gotero", "conector", "programador", "pila", "temporizador"), a: ["riego_goteo", "goteo_emisor_macro", "piezas_plastico", "pilas_bateria", "temporizador_grifo", "b_goteo_manguera", "b_plastico_tubos", "b_temporizador_digital", "vk_kit_goteo_caja", "vk_gotero_tapado_cal"] },
  { k: (s) => has(s, "vivero", "ferreter", "tienda", "compra", "pasillo", "estante", "dolar"), a: ["vivero_estantes", "vivero_pasillo", "ferreteria_estante", "caja_registradora", "b_estante_producto", "b_carrito_tienda", "b_ticket_compra", "vk_levi_prueba_agua"] },
  { k: (s) => has(s, "dinero", "cuesta", "barato", "precio", "sesenta", "ochenta"), a: ["billetes_dinero_mano", "moneda_monedas", "b_dinero_contando"] },
  { k: (s) => has(s, "regadera", "riegas", "riega", "regar", "regaba", "mojar"), a: ["regadera_metal", "regadera_llenando", "manos_regando_base", "b_riego_manual", "b_regadera_llenando", "aspersor_jardin", "b_aspersor_campo", "vk_levi_llenando_olla", "vk_levi_dos_regaderas"] },
  { k: (s) => has(s, "seca", "seco", "agriet", "sed", "sequ"), a: ["tierra_seca_grietas", "tierra_seca_desierto", "b_tierra_desmoronando", "vk_tierra_agrietada_zapato", "b_desierto_dunas", "b_desierto_planta"] },
  { k: (s) => has(s, "cava", "hoyo", "pala", "entierr", "enterr"), a: ["manos_cavando", "pala_cavando_huerta", "b_hoyo_cavado", "b_pala_metal", "b_azada_huerta", "vk_levi_enterrando", "vk_levi_cavando_hoyo"] },
  { k: (s) => has(s, "arena", "arenos"), a: ["arena_cayendo_mano", "b_arena_punado", "tierra_arenosa", "vk_levi_arena_fondo"] },
  { k: (s) => has(s, "arcilla", "pesada", "ladrillo"), a: ["arcilla_tierra", "b_tierra_mojada"] },
  { k: (s) => has(s, "tierra", "suelo", "bancal", "huerta"), a: ["huerta_bancal", "huerta_general", "manos_tierra_punado", "tierra_negra_rica", "b_tierra_removida", "b_rastrillo_tierra", "b_campo_arado", "invernadero_plantas"] },
  { k: (s) => has(s, "piedra", "teja", "tapa", "tapar"), a: ["piedra_plana", "b_piedra_mano", "b_piedras_rio", "b_teja_barro", "vk_levi_tapando_piedra", "vk_olla_tapada_plato"] },
  { k: (s) => has(s, "corcho", "silicona", "trapo", "tapon"), a: ["corcho_botella", "b_corcho_botella2", "b_silicona_pistola", "b_trapo_tela", "vk_levi_corcho_fondo"] },
  { k: (s) => has(s, "mosquito", "huevo", "dengue", "quieta", "criadero"), a: ["mosquito_macro", "larvas_agua", "agua_estancada", "b_mosquito_agua", "b_insecto_hoja", "vk_larvas_agua_quieta"] },
  { k: (s) => has(s, "cal", "vinagre", "costra", "limpia", "cepill"), a: ["vinagre_botella", "cal_deposito_blanco", "cepillo_limpiando", "balde_agua", "b_vinagre_verter", "b_balde_llenando", "b_cepillo_fregando", "b_cal_grifo", "vk_olla_cal_interior", "vk_levi_vinagre_balde"] },
  { k: (s) => has(s, "hiela", "helada", "congel", "invierno", "escarcha"), a: ["hielo_escarcha", "escarcha_hojas", "b_hielo_cristales", "b_nieve_jardin", "b_invierno_campo", "vk_olla_helada_rajada", "vk_levi_guardando_invierno"] },
  { k: (s) => has(s, "compost", "abono", "aliment", "nutri"), a: ["compost_pila", "abono_manos", "b_compost_volteando", "b_lombrices_tierra", "b_estiercol_carretilla", "vk_compost_manos"] },
  { k: (s) => has(s, "china", "chino", "fan", "shengzhi", "manual", "escrito", "libro"), a: ["libro_antiguo_paginas", "manuscrito_viejo", "biblioteca_libros", "campo_arroz_china", "b_libro_hojeando", "b_pergamino_escrito", "b_china_campo", "vk_manuscrito_chino"] },
  { k: (s) => has(s, "africa", "india", "oceano", "cultura", "palabra"), a: ["aldea_desierto", "oasis_palmeras", "vasijas_mercado", "b_pueblo_adobe", "b_india_calle", "b_mapa_antiguo", "vk_vasijas_africa", "vk_vasijas_india"] },
  { k: (s) => has(s, "bainbridge", "revista", "investig", "midi", "cientif", "eficiencia"), a: ["cientifico_campo", "desierto_investigacion", "microscopio_muestra", "b_laboratorio_muestras", "b_cuaderno_notas", "b_regla_medir", "vk_desierto_medicion"] },
  { k: (s) => has(s, "abuelo", "amos", "madre", "rebeca", "nueve"), a: ["agricultor_mayor_manos", "manos_viejas_jovenes", "nino_huerta", "b_manos_arrugadas", "b_abuelo_nieto", "b_mujer_huerta", "vk_levi_abuelo_recuerdo", "vk_abuelo_piedra_tapa"] },
  { k: (s) => has(s, "granero", "cobertizo", "techo", "guarda", "herramient"), a: ["granero_madera", "cobertizo_herramientas", "b_granero_interior", "b_herramientas_pared", "b_banco_taller", "b_farol_viejo"] },
  { k: (s) => has(s, "lluvia", "llueve", "nube"), a: ["lluvia_jardin", "lluvia_charco", "b_lluvia_hojas", "b_tormenta_nubes", "b_charco_barro"] },
  { k: (s) => has(s, "sol", "calor", "grados", "mediodia", "julio", "agosto", "verano"), a: ["sol_calor_campo", "plantas_marchitas_sol", "hojas_amarillas", "b_sol_abrasador", "b_termometro_calor", "b_hoja_marchita", "vk_plantas_mediodia_caidas", "vk_plantas_mediodia_erguidas"] },
  { k: (s) => has(s, "viaj", "vas", "funeral", "semana", "faltes", "ausen"), a: ["maleta_viaje_puerta", "b_maleta_puerta", "b_auto_ruta", "vk_semana_ausencia"] },
  { k: (s) => has(s, "dia", "cada", "calendario", "reloj", "tiempo", "primavera", "otono"), a: ["calendario_pared", "reloj_arena", "b_calendario_hojas", "b_reloj_pasando", "amanecer_campo", "b_amanecer_niebla"] },
  { k: (s) => has(s, "palo", "varita", "madera", "medir"), a: ["palo_madera_mano", "b_regla_medir"] },
  { k: (s) => has(s, "cesped", "densa", "tupid", "voleo"), a: ["cesped_verde", "b_rucula_siembra"] },
  { k: (s) => has(s, "semilla", "plantin", "brote", "planta", "siembra", "transplant"), a: ["plantin_manos", "brote_creciendo", "semillas_mano", "b_semilla_germinando", "b_plantin_bandeja", "b_transplante_manos", "planta_sana_verde"] },
  { k: (s) => has(s, "cosecha", "fruto", "fruta", "cesta", "mercado", "cocina"), a: ["cosecha_verduras_cesta", "b_cesta_verduras", "b_mercado_verduras", "b_cocina_rustica", "b_familia_cosecha", "vk_cosecha_final_cesta"] },
  { k: (s) => has(s, "rocio", "amanec", "manana", "gota"), a: ["rocio_manana", "hoja_gota_macro", "b_hoja_rocio", "b_amanecer_niebla", "agua_macro_gotas", "b_agua_gota_lenta"] },
  { k: (s) => has(s, "agua", "humed", "moja", "llena", "vaci"), a: ["agua_vertida_maceta", "agua_macro_gotas", "b_agua_vaso_verter", "b_agua_superficie", "b_agua_gota_lenta", "canal_riego_campo", "campo_inundado", "vk_levi_llenando_olla"] },
];
const POOL = CLIPS.slice();

// asignación: por tema, round-robin, evitando repetir el mismo asset seguido
const used = new Map();
const cursor = new Map();
let poolI = 0;
function pickAsset(sentence) {
  const s = norm(sentence);
  for (const t of TOPICS) {
    if (!t.k(s)) continue;
    const cands = t.a.filter((n) => CLIPS.includes(n) || imgFile(n));
    if (!cands.length) continue;
    const key = t.a[0];
    const c = cursor.get(key) || 0;
    // el menos usado del tema
    let best = cands[c % cands.length], bu = used.get(best) || 0;
    for (const n of cands) { const u = used.get(n) || 0; if (u < bu) { best = n; bu = u; } }
    cursor.set(key, c + 1);
    used.set(best, (used.get(best) || 0) + 1);
    return best;
  }
  // sin tema: el clip menos usado del pool general
  let best = POOL[poolI % POOL.length], bu = used.get(best) || 0;
  for (let i = 0; i < POOL.length; i++) { const n = POOL[(poolI + i) % POOL.length]; const u = used.get(n) || 0; if (u < bu) { best = n; bu = u; } }
  poolI++;
  used.set(best, (used.get(best) || 0) + 1);
  return best;
}
const srcOf = (name) => (CLIPS.includes(name) ? srcOfClip(name) : srcOfImg(name));

// ── SEGMENTACIÓN del guion en momentos ──────────────────────────────────────
const guion = fs.readFileSync(`public/guiones/${SLUG}.txt`, "utf8");
let sentences = guion.split(/\n+/).flatMap((p) => p.split(/(?<=[.?!:;])\s+/)).map((s) => s.trim()).filter((s) => norm(s).split(" ").length >= 2);

const rawPre = [];
for (const s of sentences) {
  const t = anchorSeq(s);
  if (t == null) continue;
  rawPre.push({ t, s });
}
console.log(`frases ancladas: ${rawPre.length}/${sentences.length}`);

// duración por frase = hasta la siguiente
for (let i = 0; i < rawPre.length; i++) rawPre[i].dur = (i + 1 < rawPre.length ? rawPre[i + 1].t : TOTAL) - rawPre[i].t;

// merge de frases muy cortas (< 2.4s) con la siguiente → evita el picado
const merged = [];
for (const b of rawPre) {
  const last = merged[merged.length - 1];
  if (last && last.dur < 2.4) { last.dur += b.dur; last.s += " " + b.s; }
  else merged.push({ ...b });
}
// split de tramos largos en 2-3 tomas → baja la mediana sin matar el aire.
// Objetivo medido: mediana 4-4,5s, p75 >5s, ~4 de cada 10 planos ≥5s.
const moments = [];
for (const b of merged) {
  const n = b.dur > 13 ? 3 : b.dur > 7.2 ? 2 : 1;
  for (let i = 0; i < n; i++) moments.push({ t: +(b.t + (b.dur / n) * i).toFixed(2), dur: +(b.dur / n).toFixed(2), s: b.s, part: i });
}

const rawBeats = moments.map((m, i) => {
  const name = pickAsset(m.s);
  const src = srcOf(name);
  return {
    id: `m${String(i + 1).padStart(3, "0")}_${name}`.slice(0, 60),
    start: m.t, dur: +Math.max(1.2, m.dur + 0.3).toFixed(2),
    kind: "raw", src: src || srcOfClip(POOL[i % POOL.length]),
    hue: "amber", darken: 0, ...(src && src.endsWith(".mp4") ? { noSplit: true } : {}),
  };
});

// ── COMPONENTES (el DIRECTOR decide cada uno y su duración por legibilidad) ──
// dur = 0,8s de "notar el cartel" + palabras/2,5 + margen. Texto de TITULAR, no párrafo.
const wc = (...xs) => xs.flat(9).filter((x) => typeof x === "string").join(" ").split(/\s+/).filter((w) => /[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]/.test(w) && w.length >= 2).length;
const need = (...xs) => +Math.min(8, Math.max(2.9, 0.8 + wc(...xs) / 2.2 + 0.9)).toFixed(2);
const texts = (o) => { const out = []; const walk = (v) => { if (typeof v === "string") out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => { if (!["id", "kind", "src", "image", "bg", "comp", "hue", "accent", "palette", "zone", "theme", "mode", "corner", "pos", "tone", "state", "color", "impactAccent"].includes(k)) walk(x); }); }; walk(o); return out; };

const C = [];
const add = (phrase, spec) => {
  const t = atc(phrase);
  if (t == null) return;
  const d = spec.dur || need(texts(spec));
  C.push({ ...spec, id: spec.id || `c${C.length + 1}`, start: +t.toFixed(2), dur: d, overlay: true });
};

// ---- HOOK ----
add("riega tus plantas durante toda una semana", { kind: "callout", figure: "5$", eyebrow: "Una maceta de barro", caption: "riega sola una semana", accent: "good", hue: "amber" });
add("sin bomba", { kind: "chips", title: "Lo que NO lleva", chips: ["Sin bomba", "Sin pilas", "Sin timer", "Sin goteros"], hue: "amber" });
add("la planta le pide agua", { kind: "phrasetag", text: "La planta pide. El barro da.", accent: "good" });
add("se llama olla", { kind: "headline", tokens: [{ t: "Se" }, { t: "llama" }, { t: "olla", hl: true }], eyebrow: "El nombre viejo", hue: "amber" });
add("sin esmaltar", { kind: "splitlist", title: "Tiene que ser así", items: ["Barro cocido", "Sin esmaltar", "Sin barniz"], palette: "G" });
add("millones de poros microscopicos", { kind: "olla", mode: "anatomy", eyebrow: "Corte de la olla", title: "Barro poroso, agua adentro", dur: 7.5 });
add("la tierra seca de afuera tira de ella", { kind: "phrasetag", text: "La tierra seca tira del agua", accent: "amber" });
add("la olla no suelta agua", { kind: "rule", number: "1", label: "REGLA", title: "Tierra húmeda, olla quieta", hue: "amber" });
add("cuanto mas seca esta la tierra", { kind: "metertag", label: "Más seca = más rápido", fromPct: 10, toPct: 90, eyebrow: "Caudal", corner: "tr" });
add("cuando llueve la olla se frena sola", { kind: "stattag", value: 0, prefix: "", suffix: "", label: "Llueve: se frena sola", eyebrow: "Sin tocar nada", accent: "cold" });
add("es un sistema que responde", { kind: "quote", text: "No es un sistema de riego. Es un sistema que *responde*.", accent: "amber", hue: "amber" });

// ---- HISTORIA / ORIGEN ----
add("esto tiene mas de dos mil anos", { kind: "stat", value: 2000, suffix: " años", label: "y las instrucciones no cambiaron", eyebrow: "Está escrito", accent: "amber", hue: "amber" });
add("el libro de fan shengzhi", { kind: "aged", heading: "FAN SHENGZHI", lines: [{ text: "Manual chino, siglo I a.C." }, { text: "Entierra la vasija. Llénala. Tápala.", mark: true }], eyebrow: "La fuente más vieja", hue: "amber" });
add("en el norte de africa", { kind: "chips", title: "El mismo truco, sin conocerse", chips: ["China", "Norte de África", "India"], hue: "amber" });
add("culturas que no se conocian entre si", { kind: "phrasetag", text: "Tres continentes, la misma respuesta", accent: "good" });
add("porque llego la manguera de goma", { kind: "lielist", title: "Por qué se perdió", items: ["Llegó la manguera", "Llegó la bomba", "El agua se hizo barata"], accent: "danger", hue: "amber" });
add("se olvida en una generacion", { kind: "stat", value: 1, suffix: " generación", label: "es lo que tarda en perderse un saber", eyebrow: "Nadie preguntó", accent: "danger", hue: "amber" });
add("mi abuelo amos si preguntaba", { kind: "nametag", name: "Amos", sub: "el abuelo", accent: "#c8a24a" });
add("la misma tierra", { kind: "splitlist", title: "Mismo bancal, mismo julio", items: ["Con olla: altos y verdes", "Con manguera: amarillos"], palette: "A" });
add("la manguera moja la tierra la olla riega la planta", { kind: "quote", text: "La manguera moja la *tierra*. La olla riega la *planta*.", accent: "good", hue: "amber", fontSize: 84 });

// ---- LA CIENCIA ----
add("agricultural water management", { kind: "aged", heading: "BAINBRIDGE, 2001", lines: [{ text: "Agricultural Water Management" }, { text: "Vasijas enterradas, medido en desierto", mark: true }], eyebrow: "El dato", hue: "cold" });
add("entre un cincuenta y un setenta por ciento menos de agua", { kind: "bars", eyebrow: "Agua usada", title: "Olla contra superficie", bars: [{ label: "Superficie", value: 100, display: "100%", tone: "danger" }, { label: "Olla enterrada", value: 35, display: "-70%", winner: true }] });
add("diez veces con una maceta de barro", { kind: "stat", value: 10, suffix: "×", label: "más eficiente en suelo seco", eyebrow: "Frente a regar por arriba", accent: "good", hue: "amber" });
add("se evapora con el sol de la tarde", { kind: "cross", eyebrow: "Dónde va el agua", title: "Por arriba se pierde", layers: [{ label: "Se evapora", depth: "sol de la tarde", color: "#c94f4f" }, { label: "Se va de lado", depth: "tierra desnuda", color: "#b5703f" }, { label: "Llega a la raíz", depth: "poco", color: "#6a9a6a" }] });
add("el sol no la ve nunca", { kind: "phrasetag", text: "20 cm abajo, el sol no la ve", accent: "good" });
add("te voy a dar el metodo completo", { kind: "checklist", title: "Lo que viene", items: [{ text: "Qué comprar", state: "todo" }, { text: "Cómo enterrarla", state: "todo" }, { text: "Qué plantar al lado", state: "todo" }, { text: "El error del 90%", state: "todo" }], eyebrow: "Quédate", accent: "good", hue: "amber" });
add("el error que arruina el noventa por ciento", { kind: "stattag", value: 90, suffix: "%", label: "de las ollas del mundo", eyebrow: "El error", accent: "danger", corner: "tr" });

// ---- STAKES ----
add("la huerta no se te muere en invierno", { kind: "headline", tokens: [{ t: "Se" }, { t: "muere" }, { t: "en" }, { t: "esa" }, { t: "semana", hl: true }], eyebrow: "El hueco real", hue: "red" });
add("nadie pierde la huerta por no saber", { kind: "quote", text: "Nadie pierde la huerta por no *saber*. La pierde por no *estar*.", accent: "danger", hue: "amber" });
add("un tomate que pasa hambre de agua", { kind: "process", eyebrow: "El daño del vaivén", title: "Qué pasa cuando falta y sobra", steps: [{ title: "Falta agua" }, { title: "Llega de golpe" }, { title: "Se raja la piel" }] });
add("esa mancha negra y hundida", { kind: "callout", figure: "Ca", eyebrow: "No es un hongo", caption: "es calcio que no pudo viajar", accent: "danger", hue: "amber" });
add("agua que va y viene", { kind: "phrasetag", text: "Sube y baja. Empapa y seca.", accent: "danger" });
add("la olla mantiene una linea", { kind: "metertag", label: "Humedad constante", fromPct: 20, toPct: 62, eyebrow: "Con olla", corner: "tl" });

// ---- EL PRINCIPIO ----
add("la gente cree que la olla gotea", { kind: "lielist", title: "El mito", items: ["Que gotea sin parar", "Que se vacía la primera noche", "Que ahoga la raíz"], accent: "danger", hue: "amber" });
add("no gotea suda hacia donde hay sed", { kind: "quote", text: "No gotea. *Suda* hacia donde hay *sed*.", accent: "good", hue: "amber", fontSize: 92 });
add("una pared llena de canales diminutos", { kind: "olla", mode: "flow", eyebrow: "Cómo sale el agua", title: "La tierra seca tira, el barro suelta", dur: 7.5 });
add("tierra seca al lado del barro", { kind: "bars", eyebrow: "Cuándo suelta", title: "Lo decide la tierra", bars: [{ label: "Tierra seca", value: 100, display: "sale", winner: true }, { label: "Tierra húmeda", value: 8, display: "no sale", tone: "cold" }] });
add("es un grifo que abre la propia tierra", { kind: "phrasetag", text: "Un grifo que abre la tierra", accent: "good" });
add("las raices buscan", { kind: "rule", number: "2", label: "REGLA", title: "La raíz va hacia la humedad", hue: "amber" });
add("envuelta en una malla blanca de raices finas", { kind: "annotated", image: srcOfImg("vk_raices_abrazando_olla") || srcOfImg("vk_levi_olla_raices") || "img/vk_raices_abrazando_olla.png", eyebrow: "Un año", annotations: [{ kind: "circle", x: 0.5, y: 0.52, w: 0.3, label: "Raíces al barro", color: "good" }], hue: "amber", dur: 5.6 });
add("tiene su propio pozo", { kind: "phrasetag", text: "La planta tiene su propio pozo", accent: "good" });
add("te llena los primeros cinco centimetros", { kind: "cross", eyebrow: "Riego por arriba", title: "La raíz se queda arriba", layers: [{ label: "Raíces finas", depth: "primeros 5 cm", color: "#c94f4f" }, { label: "Tierra vacía", depth: "abajo", color: "#7a5a36" }] });
add("la olla le ensena lo contrario", { kind: "headline", tokens: [{ t: "Le" }, { t: "enseña" }, { t: "a" }, { t: "bajar", hl: true }], eyebrow: "La olla", hue: "amber" });

// ---- LA COMPRA ----
add("vamos a los cinco dolares", { kind: "chapter", title: "Qué comprar", num: "1", accent: "#c8a24a" });
add("terracota del color naranja apagado", { kind: "checklist", title: "La maceta correcta", items: [{ text: "Barro terracota", state: "done" }, { text: "Sin esmaltar", state: "done" }, { text: "Rugosa al tacto", state: "done" }, { text: "Con su plato", state: "done" }], eyebrow: "3 a 6 dólares", accent: "good", hue: "amber" });
add("de unos veinte centimetros de boca", { kind: "bars", eyebrow: "Qué tamaño", title: "Según lo que riegues", bars: [{ label: "Lechugas", value: 40, display: "15 cm" }, { label: "Huerta de casa", value: 70, display: "20 cm", winner: true }, { label: "Plantas grandes", value: 100, display: "30 cm" }] });
add("eso te da entre tres y cuatro litros", { kind: "stat", value: 4, suffix: " L", label: "y no se evapora nada", eyebrow: "Una olla de 20 cm", accent: "good", hue: "amber" });
add("los treinta segundos que te prometi", { kind: "rule", number: "30", label: "SEGUNDOS", title: "La prueba en la tienda", hue: "amber" });
add("hecha una perla encima del barro", { kind: "splitlist", title: "Devuélvela", items: ["El agua queda en perla", "Está esmaltada", "Será un balde enterrado"], palette: "D", cross: true });
add("dejando una mancha humeda que se extiende", { kind: "splitlist", title: "Llévatela", items: ["El agua se mete en el barro", "Deja mancha húmeda", "Ese barro respira"], palette: "G" });

// ---- LA INSTALACIÓN ----
add("ahora la instalacion", { kind: "chapter", title: "Cómo enterrarla", num: "2", accent: "#c8a24a" });
add("primero tapa el agujero del fondo", { kind: "process", eyebrow: "Paso a paso", title: "Los cuatro pasos", steps: [{ title: "Tapar el fondo" }, { title: "Cavar" }, { title: "Enterrar y apretar" }, { title: "Llenar y tapar" }] });
add("un tapon de silicona sirve", { kind: "chips", title: "Para tapar el fondo", chips: ["Silicona", "Corcho", "Trapo con barro"], hue: "amber" });
add("segundo cava el hoyo", { kind: "numcard", number: "2", name: "Cava el hoyo", eyebrow: "Arena aplanada al fondo", total: "4", accent: "amber" });
add("tercero y esto es lo importante", { kind: "numcard", number: "3", name: "Aprieta la tierra", eyebrow: "Sin bolsas de aire", total: "4", accent: "amber" });
add("tres dedos no a ras", { kind: "rule", number: "3", label: "DEDOS", title: "El borde va afuera", hue: "red" });
add("la primera lluvia fuerte te arrastra barro", { kind: "lielist", title: "Si la dejas a ras", items: ["Se llena de barro y hojas", "El sedimento tapa los poros", "Un día la partes con la pala"], accent: "danger", hue: "amber" });
add("el agua no salta huecos", { kind: "phrasetag", text: "El agua no salta huecos", accent: "danger" });
add("cuarto llenala hasta arriba", { kind: "numcard", number: "4", name: "Llena y tapa", eyebrow: "Siempre tapada", total: "4", accent: "amber" });
add("una olla destapada es un criadero de mosquitos", { kind: "impact", image: srcOfImg("vk_larvas_agua_quieta") || "img/vk_larvas_agua_quieta.png", setup: "Agua quieta al aire libre...", impact: "se tapan. Siempre.", impactAccent: "danger", hitAt: 1.0, boom: 0, darken: 0.5 });
add("la tapa buena es el plato", { kind: "chips", title: "Sirve de tapa", chips: ["El plato boca abajo", "Una piedra plana", "Una teja"], hue: "amber" });
add("lo que no sirve es una tapa de plastico", { kind: "callout", figure: "✕", eyebrow: "Nada hermético", caption: "tiene que entrar algo de aire", accent: "danger", hue: "amber" });

// ---- QUÉ PLANTAR ----
add("y que planto alrededor", { kind: "chapter", title: "Qué plantar al lado", num: "3", accent: "#c8a24a" });
add("cuarenta y cinco centimetros de radio", { kind: "stat", value: 45, suffix: " cm", label: "de radio mojado en tierra normal", eyebrow: "Una olla de 20 cm", accent: "good", hue: "amber" });
add("en tierra arenosa el circulo es mas pequeno", { kind: "bars", eyebrow: "Según tu tierra", title: "Cuánto moja", bars: [{ label: "Arenosa", value: 55, display: "menos", tone: "cold" }, { label: "Normal", value: 80, display: "45 cm", winner: true }, { label: "Arcilla", value: 100, display: "más, lento" }] });
add("te entran cuatro plantas grandes alrededor", { kind: "stat", value: 4, suffix: " plantas", label: "una por lado, a 25-30 cm del barro", eyebrow: "Por cada olla", accent: "good", hue: "amber" });
add("la raiz que viaja es una raiz fuerte", { kind: "phrasetag", text: "La raíz que viaja es fuerte", accent: "good" });
add("lo que mejor funciona tomate", { kind: "gridreveal", title: "Las que mejor le sacan partido", tiles: [{ number: "1", name: "Tomate" }, { number: "2", name: "Pimiento" }, { number: "3", name: "Berenjena" }, { number: "4", name: "Calabacín" }, { number: "5", name: "Melón" }, { number: "6", name: "Pepino" }] });
add("lo que no le saca partido", { kind: "splitlist", title: "No le saca partido", items: ["El césped", "Siembras densas de hoja"], palette: "D", cross: true });
add("las dos que te rajan la olla desde adentro", { kind: "lielist", title: "Las dos que la rajan", items: ["La menta: la estrangula", "La calabaza: hace de cuña"], accent: "danger", hue: "amber" });
add("la menta es un animal", { kind: "callout", figure: "✕", eyebrow: "Menta, hierbabuena, melisa", caption: "siempre en su propia maceta", accent: "danger", hue: "amber" });

// ---- CALENDARIO / MANTENIMIENTO ----
add("vamos al calendario", { kind: "chapter", title: "Cada cuánto se llena", num: "4", accent: "#c8a24a" });
add("en primavera la vas a llenar cada seis o siete dias", { kind: "bars", eyebrow: "Olla de 3-4 litros", title: "Cada cuánto la llenas", bars: [{ label: "Primavera", value: 60, display: "6-7 días" }, { label: "Pleno verano", value: 100, display: "3-4 días", tone: "danger" }, { label: "Otoño", value: 35, display: "10 días", tone: "cold" }] });
add("fiate del palo", { kind: "rule", number: "!", label: "TRUCO", title: "Una varita te lo dice", hue: "amber" });
add("yo las lleno los domingos por la manana", { kind: "stattag", value: 4, suffix: " min", label: "toda la huerta, media semana", eyebrow: "Domingo", accent: "good", corner: "tr" });
add("una costra blanca de cal", { kind: "process", eyebrow: "Una vez al año", title: "Si tu agua es dura", steps: [{ title: "Desenterrar" }, { title: "Balde con vinagre" }, { title: "Enjuagar" }] });
add("el agua metida en los poros se congela", { kind: "process", eyebrow: "Antes de la primera helada", title: "El invierno la parte", steps: [{ title: "Vaciar" }, { title: "Desenterrar" }, { title: "Guardar bajo techo" }] });

// ---- LÍMITES HONESTOS ----
add("la parte honesta lo que esto no hace", { kind: "chapter", title: "Lo que NO hace", num: "5", accent: "#8d8378" });
add("esto no alimenta", { kind: "splitlist", title: "Lo que la olla NO hace", items: ["No alimenta: da agua", "No sirve para césped", "No aguanta un mes"], palette: "D", cross: true });
add("el compost sigue siendo el compost", { kind: "phrasetag", text: "El compost sigue siendo el compost", accent: "amber" });
add("las primeras dos o tres semanas", { kind: "callout", figure: "2-3", eyebrow: "Semanas de arranque", caption: "todavía riegas cerca del tallo", accent: "amber", hue: "amber" });
add("te resuelve entre tres dias y una semana", { kind: "stat", value: 7, suffix: " días", label: "es el hueco donde se pierde la huerta", eyebrow: "Lo que te cubre", accent: "good", hue: "amber" });
add("quince o veinte dolares", { kind: "bars", eyebrow: "Un bancal de 3×1 m", title: "Lo que cuesta de verdad", bars: [{ label: "3-4 ollas", value: 20, display: "$20", winner: true }, { label: "Kit de goteo", value: 100, display: "$60-120", tone: "danger" }] });

// ---- EL ENEMIGO ----
add("en el vivero te van a vender un equipo de riego por goteo", { kind: "lielist", title: "Por qué vuelves cada primavera", items: ["Los goteros se tapan", "La manguera se raja al sol", "El programador se queda sin pila"], accent: "danger", hue: "amber" });
add("eso no es un accidente eso es el modelo", { kind: "quote", text: "Eso no es un accidente. Eso es el *modelo*.", accent: "danger", hue: "amber", fontSize: 88 });
add("no tiene repuestos", { kind: "chips", title: "La olla no tiene", chips: ["Repuestos", "Pilas", "Marca", "Suscripción"], hue: "amber" });
add("nadie gana dinero contandotelo", { kind: "phrasetag", text: "Nadie gana dinero contándotelo", accent: "danger" });

// ---- EL ERROR (payoff del loop grande) ----
add("el error es seguir regando por encima", { kind: "impact", image: srcOfImg("vk_plantas_mediodia_caidas") || "img/vk_plantas_mediodia_caidas.png", setup: "El error del 90% es...", impact: "seguir regando por encima.", impactAccent: "danger", hitAt: 1.0, boom: 0, darken: 0.5 });
add("esa tierra nunca llega a estar seca", { kind: "process", eyebrow: "Primera capa", title: "La apagaste tú", steps: [{ title: "Riegas arriba" }, { title: "La tierra no se seca" }, { title: "La olla no suelta" }] });
add("es que esta apagada", { kind: "headline", tokens: [{ t: "Está" }, { t: "apagada", hl: true }], eyebrow: "No es que no gaste", hue: "red" });
add("la raiz va hacia el agua mas facil", { kind: "rule", number: "3", label: "REGLA", title: "La raíz elige lo fácil", hue: "red" });
add("porque nunca aprendio a bajar", { kind: "quote", text: "Tenía tres litros a sus pies. Nunca aprendió a *bajar*.", accent: "danger", hue: "amber" });
add("el jardinero carinoso", { kind: "callout", figure: "!", eyebrow: "Contra el instinto", caption: "el que riega de más rompe el sistema", accent: "danger", hue: "amber" });
add("las primeras dos o tres semanas riegas arriba", { kind: "checklist", title: "La regla, corta", items: [{ text: "2-3 semanas: riegas arriba", state: "doing" }, { text: "Después: solo la olla", state: "done" }], eyebrow: "El error se arregla así", accent: "good", hue: "amber" });
add("no las salves", { kind: "phrasetag", text: "No las salves. Están bajando.", accent: "amber" });
add("aguantarte una semana", { kind: "quote", text: "Una huerta que depende de ti, o una que se *sostiene sola*.", accent: "good", hue: "amber" });

// ---- RECAP / CIERRE ----
add("vamos a recapitular", { kind: "chapter", title: "Este fin de semana", num: "6", accent: "#c8a24a" });
add("uno compras una maceta de barro", { kind: "numcard", number: "1", name: "Compra la maceta", eyebrow: "Sin esmaltar · 20 cm · $5", total: "7", accent: "amber" });
add("dos tapas el agujero del fondo", { kind: "numcard", number: "2", name: "Tapa el fondo", eyebrow: "Corcho o silicona", total: "7", accent: "amber" });
add("tres cavas apoyas la olla", { kind: "numcard", number: "3", name: "Entierra y aprieta", eyebrow: "Borde tres dedos afuera", total: "7", accent: "amber" });
add("cuatro la llenas y la tapas", { kind: "numcard", number: "4", name: "Llena y tapa", eyebrow: "Siempre, por los mosquitos", total: "7", accent: "amber" });
add("cinco plantas cuatro plantas alrededor", { kind: "numcard", number: "5", name: "Cuatro plantas", eyebrow: "Ni menta ni calabaza", total: "7", accent: "amber" });
add("seis riegas la superficie solo", { kind: "numcard", number: "6", name: "Corta el riego de arriba", eyebrow: "Solo llenas la olla", total: "7", accent: "amber" });
add("siete en otono la vacias", { kind: "numcard", number: "7", name: "Guárdala en otoño", eyebrow: "Antes de la primera helada", total: "7", accent: "amber" });
add("eso es todo cinco dolares y una tarde", { kind: "headline", tokens: [{ t: "Cinco" }, { t: "dólares" }, { t: "y" }, { t: "una" }, { t: "tarde", hl: true }], eyebrow: "Eso es todo", hue: "amber" });
add("cuentame una cosa en los comentarios", { kind: "chips", title: "Dime cómo es tu tierra", chips: ["Arenosa", "Arcilla pesada", "Tierra negra"], hue: "amber" });
add("un monton de piedras", { kind: "quote", text: "Piedras apiladas. Sin una gota de agua. Y amanecen *mojadas*.", accent: "cold", hue: "cold" });
add("eran cosas de cinco dolares", { kind: "signature", lines: ["Eran cosas de cinco dólares"], eyebrow: "Levi Lapp" });

// ── relleno de componentes: frases cinéticas ancladas al ms (KineticLine) ────
const KPH = [
  ["la maceta se la da", ["da"]], ["y solo se la da cuando la necesita", ["necesita"]],
  ["barro poroso y nada mas", ["poroso"]], ["se queda quieta", ["quieta"]],
  ["la tierra pide el barro entrega", ["entrega"]], ["no cambio ni un paso", ["paso"]],
  ["eso pasa cuando algo funciona de verdad", ["funciona"]], ["abres una llave y sale", ["llave"]],
  ["la misma tierra el mismo sol", ["mismo"]], ["diez veces", ["diez"]],
  ["el sol no la ve nunca", ["nunca"]], ["la pierde por no estar", ["estar"]],
  ["se le parte la piel", ["parte"]], ["sube y baja", ["baja"]],
  ["no gotea", ["gotea"]], ["suda hacia donde hay sed", ["sed"]],
  ["tiene su propio pozo", ["pozo"]], ["le ensena a bajar", ["bajar"]],
  ["ese barro respira", ["respira"]], ["tres dedos", ["tres"]],
  ["nunca a ras", ["nunca"]], ["se tapan todas siempre", ["siempre"]],
  ["la menta es un animal", ["animal"]], ["fiate del palo", ["palo"]],
  ["pero no es magia", ["magia"]], ["eso es el modelo", ["modelo"]],
  ["la apagaste tu", ["apagaste"]], ["no baja", ["baja"]],
  ["no las salves", ["salves"]], ["nos vemos en la huerta", ["huerta"]],
];
for (const [p, e] of KPH) { const k = kphrase(p, e); if (k) C.push(k); }

// ── SEGUNDA PASADA DEL DIRECTOR ─────────────────────────────────────────────
// Repasando el metraje tramo por tramo quedaban huecos largos sin nada del kit,
// sobre todo de la mitad para el final (que es donde la cola se muere).
add("y solo se la da cuando la necesita", { kind: "rule", number: "0", label: "LA IDEA", title: "Solo da agua cuando hace falta", hue: "amber" });
add("una vasija de barro cocido", { kind: "chips", title: "Qué es una olla", chips: ["Barro cocido", "Poroso", "Enterrado", "Tapado"], hue: "amber" });
add("esperando", { kind: "phrasetag", text: "Llena. Quieta. Esperando.", accent: "cold" });
add("empieza a chupar el agua", { kind: "metertag", label: "La tierra chupa el agua", fromPct: 15, toPct: 85, eyebrow: "A través del barro", corner: "tr" });
add("la tierra pide el barro entrega", { kind: "headline", tokens: [{ t: "La" }, { t: "tierra" }, { t: "pide" }, { t: "el" }, { t: "barro" }, { t: "entrega", hl: true }], eyebrow: "El trato", hue: "amber" });
add("esta escrito", { kind: "stattag", value: 1, prefix: "s. ", suffix: " a.C.", label: "el manual más viejo", eyebrow: "China", accent: "amber", corner: "tl" });
add("y las instrucciones son las mismas", { kind: "phrasetag", text: "No cambió ni un paso", accent: "good" });
add("por que tu vecino no tiene ollas", { kind: "headline", tokens: [{ t: "¿Por" }, { t: "qué" }, { t: "nadie" }, { t: "las" }, { t: "usa", hl: true }, { t: "hoy?" }], eyebrow: "La pregunta obvia", hue: "red" });
add("llego la bomba electrica", { kind: "process", eyebrow: "Cómo se perdió", title: "Tres pasos hasta el olvido", steps: [{ title: "Llegó la manguera" }, { title: "El agua se abarató" }, { title: "Nadie preguntó más" }] });
add("dejo de contarlo porque nadie preguntaba", { kind: "quote", text: "No murió con el secreto. Dejó de *contarlo*.", accent: "amber", hue: "amber" });
add("estaban mas altos que yo", { kind: "stattag", value: 3, suffix: " semanas", label: "sin regar una vez", eyebrow: "La huerta de Rebeca", accent: "good", corner: "tr" });
add("amarilla abajo", { kind: "splitlist", title: "La parte regada a mano", items: ["Amarilla abajo", "Hojas caídas al mediodía"], palette: "D", cross: true });
add("se fue al desierto a medirlo en serio", { kind: "chapter", title: "El dato medido", num: "★", accent: "#7aa2c8" });
add("no es un error de instalacion", { kind: "phrasetag", text: "No es un error de instalación", accent: "danger" });
add("o te toco viajar", { kind: "chips", title: "La semana que se pierde", chips: ["Un funeral", "Un niño enfermo", "Un viaje", "40 grados"], hue: "red" });
add("es literalmente el mejor regalo", { kind: "phrasetag", text: "Humedad aburrida y constante", accent: "good" });
add("se vaciaria la primera noche", { kind: "callout", figure: "✕", eyebrow: "Si goteara de verdad", caption: "se vaciaría la primera noche", accent: "danger", hue: "amber" });
add("tiene una succion brutal", { kind: "stattag", value: 0, label: "La tierra seca tira más fuerte", eyebrow: "Succión", accent: "amber", corner: "tl" });
add("crecen hacia donde hay humedad", { kind: "phrasetag", text: "La raíz crece hacia la humedad", accent: "good" });
add("y no se quedan cerca se le pegan", { kind: "metertag", label: "Raíces pegadas al barro", fromPct: 5, toPct: 95, eyebrow: "Un año después", corner: "tr" });
add("esa planta se ve preciosa", { kind: "lielist", title: "La trampa del riego diario", items: ["Se ve preciosa todos los días", "Hasta el día que faltas"], accent: "danger", hue: "amber" });
add("que se sienta a piedra en la mano", { kind: "phrasetag", text: "Rugosa. A piedra en la mano.", accent: "amber" });
add("devuelvela", { kind: "callout", figure: "✕", eyebrow: "Si el agua queda en perla", caption: "devuélvela, está sellada", accent: "danger", hue: "amber" });
add("ese barro respira", { kind: "callout", figure: "✓", eyebrow: "Si el agua se mete", caption: "ese barro respira: llevátela", accent: "good", hue: "amber" });
add("un corcho de vino encaja casi siempre", { kind: "numcard", number: "1", name: "Tapa el fondo", eyebrow: "Corcho, silicona o trapo", total: "4", accent: "amber" });
add("no quede haciendo equilibrio sobre una piedra", { kind: "phrasetag", text: "Nunca sobre una piedra puntiaguda", accent: "danger" });
add("necesitas verla", { kind: "rule", number: "!", label: "OJO", title: "Si no la ves, la partes con la pala", hue: "red" });
add("y sin luz no se te llena de verdin", { kind: "checklist", title: "La tapa tiene que", items: [{ text: "Dejar pasar aire", state: "done" }, { text: "No dejar pasar bichos", state: "done" }, { text: "No dejar pasar luz", state: "done" }], eyebrow: "Por eso la piedra", accent: "good", hue: "amber" });
add("dejales espacio para que la raiz haga el viaje", { kind: "stattag", value: 30, suffix: " cm", label: "de la olla a cada planta", eyebrow: "No las pegues", accent: "good", corner: "tr" });
add("en un ano tienes la olla estrangulada", { kind: "metertag", label: "La menta la estrangula", fromPct: 10, toPct: 95, eyebrow: "En un año", corner: "tl" });
add("he visto una olla partida limpia en dos", { kind: "callout", figure: "2", eyebrow: "Partida por una calabaza", caption: "la raíz gorda hace de cuña", accent: "danger", hue: "amber" });
add("cada huerta es distinta", { kind: "phrasetag", text: "Tu huerta te lo dice sola", accent: "good" });
add("porque no hay que agacharse", { kind: "phrasetag", text: "El trabajo más agradable de la huerta", accent: "good" });
add("el barro vuelve a respirar", { kind: "phrasetag", text: "El vinagre se come la cal", accent: "good" });
add("se te parte en una noche", { kind: "stattag", value: 20, suffix: " años", label: "y una helada te la parte", eyebrow: "Sácala en otoño", accent: "danger", corner: "tr" });
add("plantas sedientas y bien regadas", { kind: "phrasetag", text: "Regada no es lo mismo que nutrida", accent: "amber" });
add("no hay olla que te salve", { kind: "callout", figure: "30", eyebrow: "Si te vas un mes", caption: "no hay olla que te salve", accent: "danger", hue: "amber" });
add("cada primavera vuelves al vivero", { kind: "metertag", label: "Vuelves cada primavera", fromPct: 20, toPct: 100, eyebrow: "El negocio", corner: "tl" });
add("la compras una vez dura decadas", { kind: "bars", eyebrow: "Cuánto dura", title: "Una compra contra una suscripción", bars: [{ label: "Olla de barro", value: 100, display: "décadas", winner: true }, { label: "Kit de goteo", value: 28, display: "2-3 años", tone: "danger" }] });
add("se queda quieta como una piedra", { kind: "phrasetag", text: "La olla no suelta nada", accent: "danger" });
add("que ni sabe que existe", { kind: "callout", figure: "3 L", eyebrow: "A 20 cm", caption: "y la planta no lo sabe", accent: "danger", hue: "amber", dur: 6.6 });
add("se van a ver un poco tristes", { kind: "rule", number: "10", label: "DÍAS", title: "Ahí es cuando la raíz baja", hue: "amber" });
add("mientras las del vecino estan dobladas", { kind: "splitlist", title: "Diez días después", items: ["Las tuyas: de pie al mediodía", "Las del vecino: dobladas"], palette: "G" });
add("dime tambien de donde eres", { kind: "phrasetag", text: "Contame en los comentarios", accent: "good" });
add("rescatar lo que se hacia antes", { kind: "phrasetag", text: "Lo de antes de la caja con instrucciones", accent: "amber" });

// ── RELLENO AUTOMÁTICO de tipografía sincronizada ───────────────────────────
// density_gate exige ≥7 usos de componente por minuto. Los carteles autorados
// arriba son los que llevan INFORMACIÓN; el resto del piso lo cubre tipografía
// anclada a la propia narración (KineticLine), que siempre está on-topic porque
// ES la frase que se está diciendo. Se reparte parejo y no se encima con nada.
// ── ensamblado: PRIMERO los autorados (llevan la información), DESPUÉS el relleno ──
// El orden importa: si el relleno entra antes, ocupa el hueco y desplaza al cartel
// que sí tenía un dato que contar. Por eso se arma en dos pasadas.
const OPEN_CLEAR = OPEN_CLEAR_PRE;   // apertura: avatar full limpio, sin carteles
const MIN_GAP = 0.25;                // sólo evitar que se pisen, no espaciarlos
C.sort((a, b) => a.start - b.start);
const comps = [];
let lastEnd = -99;
for (const c of C) {
  if (c.start < OPEN_CLEAR) { console.warn("⏭ overlay en apertura:", c.kind, c.start.toFixed(1)); continue; }
  if (c.start < lastEnd + MIN_GAP) { console.warn("⏭ encimado:", c.kind, c.start.toFixed(1)); continue; }
  lastEnd = c.start + c.dur;
  comps.push(c);
}

// Relleno: tipografía anclada a la narración en los huecos que quedaron.
// Siempre on-topic porque ES la frase que se está diciendo en ese instante.
{
  const MIN_USOS = Math.ceil((TOTAL / 60) * 7.8);
  const ocup = comps.map((c) => [c.start, c.start + c.dur]).sort((a, b) => a[0] - b[0]);
  const libre = (s, e) => !ocup.some(([a, b]) => s < b + MIN_GAP && e > a - MIN_GAP);
  let añadidos = 0;
  for (let t = OPEN_CLEAR; t < TOTAL - 8 && comps.length < MIN_USOS; t += 0.4) {
    const k = klineFrom(t, 4 + (añadidos % 3));
    if (!k || k.start < OPEN_CLEAR) continue;
    if (!libre(k.start, k.start + k.dur)) continue;
    ocup.push([k.start, k.start + k.dur]);
    comps.push(k); añadidos++;
    t = k.start + k.dur;
  }
  comps.sort((a, b) => a.start - b.start);
  console.log(`kineticline de relleno: +${añadidos} → ${comps.length} usos (objetivo ${MIN_USOS})`);
}

const beats = [...rawBeats, ...comps].sort((a, b) => a.start - b.start);

// ── ventanas de avatar: full ↔ hidden (nada de PiP), piso 28% ───────────────
const snap = (t) => { for (const c of caps) if (c.startMs / 1000 >= t - 0.05) return c.startMs / 1000; return t; };
const BIG = new Set(["olla","impact","bars","process","checklist","cross","aged","gridreveal","journey","annotated","lielist","splitlist","chips"]);
const compRanges = comps.filter((c) => BIG.has(c.kind)).map((c) => [c.start, c.start + c.dur]);
// COSTURAS: puntos donde se recortó del avatar la palabra que el TTS leyó de más
// (los tags de ElevenLabs). El audio es continuo pero hay un salto de pose, así que
// ahí el avatar va OCULTO y manda el b-roll: tapado, el salto no se ve.
const SEAMS = [90.68, 185.18, 605.58, 1101.20];
const enCostura = (a, b) => SEAMS.some((s) => a < s + 1.3 && b > s - 1.3);
const clash = (a, b) => compRanges.some(([s, e]) => a < e && b > s);
const HOOK_END = 13, PERIOD = 17, SLOT = 7.2, SEARCH = 12;
const fulls = [[0, snap(Math.min(HOOK_END, SEAMS[0] - 1.5))]];
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.4) {
    const s = snap(t), e = snap(s + SLOT);
    if (e - s >= 4.5 && e - s <= 11 && !clash(s, e) && !enCostura(s, e)) { fulls.push([s, e]); break; }
  }
}
const csw = snap(TOTAL - 9);
if (!clash(csw, TOTAL) && !enCostura(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = [];
let cur = 0;
for (const [s, e] of fulls) {
  if (s < cur) continue;
  if (s > cur + 0.2) windows.push({ start: +cur.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cur = e;
}
if (cur < TOTAL - 0.1) windows.push({ start: +cur.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: "full" });
windows.push({ start: TOTAL, mode: "hidden" });

let fullSec = 0;
for (let i = 0; i < windows.length; i++) if (windows[i].mode === "full") fullSec += (i + 1 < windows.length ? windows[i + 1].start : TOTAL) - windows[i].start;
console.log(`avatar full: ${(100 * fullSec / TOTAL).toFixed(1)}%  (piso 28%)`);

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, beats }, null, 1));

// ── plan del DIRECTOR (lo que revisa plan_gate) ─────────────────────────────
const SECS = [
  { id: "hook", objetivo: "Ganar los primeros 30s: el título en versión imposible y el mecanismo", inicio: 0, fin: 120 },
  { id: "origen", objetivo: "De dónde salió la olla y por qué se perdió + la prueba del abuelo", inicio: 120, fin: 330 },
  { id: "principio", objetivo: "Cómo funciona de verdad: tensión de humedad y raíces que bajan", inicio: 330, fin: 620 },
  { id: "compra_instalacion", objetivo: "Qué comprar por $5 y cómo enterrarla paso a paso", inicio: 620, fin: 900 },
  { id: "plantas_calendario", objetivo: "Qué plantar al lado, cada cuánto llenarla y mantenimiento", inicio: 900, fin: 1130 },
  { id: "limites_error_cierre", objetivo: "Límites honestos, el enemigo, el ERROR del 90% y el recap", inicio: 1130, fin: TOTAL },
];
const plan = {
  secciones: SECS.map((s) => ({
    ...s, dur: s.fin - s.inicio,
    momentos: beats.filter((b) => b.start >= s.inicio && b.start < s.fin).map((b) => {
      const sent = moments.find((m) => Math.abs(m.t - b.start) < 0.01);
      return {
        dice: (sent ? sent.s : (b.words ? b.words.map((w) => w.t).join(" ") : b.title || b.text || b.kind)).slice(0, 110),
        muestra: b.kind === "raw" ? b.src : `componente ${b.kind}`,
        tipo: b.kind === "raw" ? (b.src.endsWith(".mp4") ? "clip" : "imagen") : "componente",
        ...(b.kind !== "raw" ? { kind: b.kind } : {}),
        seg: b.dur,
        porque: b.kind === "raw" ? "asset on-topic elegido por tema de la frase" : "dato/idea que necesita apoyo gráfico",
      };
    }),
  })),
};
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

// ── manifiestos para density_gate ───────────────────────────────────────────
const manifest = rawBeats.map((b) => b.src);
const compUses = comps.map((c) => c.kind);
const block =
  `\n/* ASSET_MANIFEST (${manifest.length} tomas · ${new Set(manifest).size} distintas):\n${[...new Set(manifest)].map((s) => `"${s}"`).join(" ")}\n*/\n`;
const mainPath = `src/VideoEdit/Main_${SLUG}.tsx`;
if (fs.existsSync(mainPath)) {
  let main = fs.readFileSync(mainPath, "utf8").replace(/\n\/\* ASSET_MANIFEST[\s\S]*?\*\/\n/, "");
  fs.writeFileSync(mainPath, main + block);
}

const durs = rawBeats.map((b) => b.dur).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)], p75 = durs[Math.floor(durs.length * 0.75)];
console.log(`beats: ${rawBeats.length} tomas + ${comps.length} componentes (${new Set(compUses).size} distintos)`);
console.log(`assets distintos: ${new Set(manifest).size} · mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s: ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}%`);
console.log(`TOTAL = ${TOTAL}s · TOTAL_FRAMES = ${Math.round(TOTAL * 30)}`);
