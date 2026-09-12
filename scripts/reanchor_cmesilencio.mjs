// Reancla el director visual a la transcripcion REAL de la voz Fish actual.
// Escribe una variante aislada: los eventos historicos quedan intactos.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CAP_PATH = path.join(ROOT, "public", "captions_cmesilencio_fish.json");
const SRC_DIR = path.join(ROOT, "_v3", "secciones_cmesilencio");
const DST_DIR = path.join(ROOT, "_v3", "secciones_cmesilencio_v2");
const DRY = process.argv.includes("--dry-run");

if (!fs.existsSync(CAP_PATH)) throw new Error(`Falta ${CAP_PATH}`);
const caps = JSON.parse(fs.readFileSync(CAP_PATH, "utf8"));

function clean(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const numberWords = new Map(Object.entries({
  cero: "0", un: "1", una: "1", dos: "2", tres: "3", cuatro: "4", cinco: "5",
  seis: "6", siete: "7", ocho: "8", nueve: "9", diez: "10", once: "11",
  doce: "12", trece: "13", catorce: "14", quince: "15", dieciseis: "16",
  diecisiete: "17", dieciocho: "18", diecinueve: "19", veinte: "20",
  treinta: "30", cuarenta: "40", cincuenta: "50", sesenta: "60",
  setenta: "70", ochenta: "80", noventa: "90", cien: "100",
}));

function token(s) { return clean(s); }
function tokens(s) { return String(s ?? "").split(/\s+/).map(token).filter(Boolean); }
function sameToken(a, b) {
  if (a === b) return true;
  if (numberWords.get(a) === b || numberWords.get(b) === a) return true;
  return false;
}

const words = caps.map((c) => token(c.text));

const sectionDefs = [
  ["S1_HOOK", "Haz una caja de 20 dolares"],
  ["S2_PORQUE_SUENA", "Primero aclaremos que estamos construyendo"],
  ["S3_HONESTIDAD", "Ahora el trato de siempre"],
  ["S4_TRES_NUMEROS", "Bien los numeros"],
  ["S5_TRES_IDEAS", "Vamos a lo que si funciona"],
  ["S6_DOS_DOLARES", "Y aqui esta la mitad de la historia"],
  ["S7_FRACASOS", "Antes de la lista de materiales"],
  ["S8_LISTA20", "Bien la lista"],
  ["S9_LABERINTO", "La medida de la pantalla"],
  ["S10_LAMINA", "No fabriques un tunel cerrado"],
  ["S11_VENTILACION", "La configuracion correcta queda asi"],
  ["S12_HORNO", "La primera version se veia muy bien"],
  ["S13_MEDICION", "Ahora si la medicion"],
  ["S14_GRATIS", "Pero hay otra prueba de ese mismo dia"],
  ["S15_LANA", "Y ahora si lo que te prometi"],
  ["S16_CIERRE", "Cerremos"],
];

function exactPhrase(phrase, lo = 0, hi = words.length - 1, hintMs = 0) {
  const target = tokens(phrase);
  if (!target.length) return null;
  const lastStart = Math.min(hi, words.length - target.length);
  let best = null;
  for (let i = Math.max(0, lo); i <= lastStart; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) {
      if (!sameToken(target[j], words[i + j])) { ok = false; break; }
    }
    if (!ok) continue;
    const distance = hintMs ? Math.abs(caps[i].startMs - hintMs) : i;
    if (!best || distance < best.distance) best = { startIndex: i, endIndex: i + target.length - 1, coverage: 1, distance };
  }
  return best;
}

// Toleramos una palabra insertada o perdida por Whisper, pero no usamos una coincidencia
// laxa para frases cortas: en ellas produciria anclajes falsos.
function fuzzyPhrase(phrase, lo, hi, hintMs) {
  const target = tokens(phrase);
  if (target.length < 6) return null;
  const maxStart = Math.min(hi, words.length - 1);
  let best = null;
  for (let i = Math.max(0, lo); i <= maxStart; i++) {
    if (!sameToken(target[0], words[i])) continue;
    let p = i;
    let matched = 0;
    let last = i;
    for (const t of target) {
      let found = -1;
      for (let j = p; j <= Math.min(maxStart, p + 2); j++) {
        if (sameToken(t, words[j])) { found = j; break; }
      }
      if (found >= 0) { matched++; last = found; p = found + 1; }
      else { p++; }
    }
    const coverage = matched / target.length;
    if (coverage < 0.78) continue;
    const hintPenalty = hintMs ? Math.abs(caps[i].startMs - hintMs) / 1000000 : i / 100000000;
    const score = coverage - hintPenalty;
    if (!best || score > best.score) best = { startIndex: i, endIndex: last, coverage, score };
  }
  return best;
}

function locate(phrase, lo = 0, hi = words.length - 1, hintMs = 0) {
  return exactPhrase(phrase, lo, hi, hintMs) || fuzzyPhrase(phrase, lo, hi, hintMs);
}

const sectionRanges = [];
for (let i = 0; i < sectionDefs.length; i++) {
  const [sec, phrase] = sectionDefs[i];
  const hit = locate(phrase, i ? sectionRanges[i - 1].startIndex + 1 : 0, words.length - 1, 0);
  if (!hit) throw new Error(`No pude localizar el inicio de ${sec}: ${phrase}`);
  sectionRanges.push({ sec, startIndex: hit.startIndex, startMs: caps[hit.startIndex].startMs });
}
for (let i = 0; i < sectionRanges.length; i++) {
  const next = sectionRanges[i + 1];
  sectionRanges[i].endIndex = next ? next.startIndex - 1 : words.length - 1;
  sectionRanges[i].endMs = next ? caps[next.startIndex].startMs : (caps.at(-1)?.endMs ?? 0);
}

const rangeFor = (sec) => sectionRanges.find((r) => r.sec === sec);
const fileForSec = new Map([
  ["S1_HOOK", "S1_HOOK_events.json"], ["S2_PORQUE_SUENA", "S2_PORQUE_SUENA_events.json"],
  ["S3_HONESTIDAD", "S3_HONESTIDAD_events.json"], ["S4_TRES_NUMEROS", "S4_TRES_NUMEROS_events.json"],
  ["S5_TRES_IDEAS", "S5_TRES_IDEAS_events.json"], ["S6_DOS_DOLARES", "S6_DOS_DOLARES_events.json"],
  ["S7_FRACASOS", "S7_FRACASOS_events.json"], ["S8_LISTA20", "S8_LISTA20_events.json"],
  ["S9_LABERINTO", "S9_events.json"], ["S10_LAMINA", "S10_events.json"],
  ["S11_VENTILACION", "S11_events.json"], ["S12_HORNO", "S12_events.json"],
  ["S13_MEDICION", "S13_events.json"], ["S14_GRATIS", "S14_events.json"],
  ["S15_LANA", "S15_events.json"], ["S16_CIERRE", "S16_events.json"],
]);
const secFromFile = (file) => [...fileForSec.entries()].find(([, f]) => f === file)?.[0] ?? file.replace(/_events\.json$/, "");
const files = sectionDefs.map(([sec]) => fileForSec.get(sec));

function obsolete(e, sec) {
  const s = `${e.dice || ""} ${e.texto || ""} ${e.escena || ""}`;
  if (e.tipo === "ESCENA" || e.tipo === "CTA") return true;
  if (/Carlos|El codigo|el enlace abajo|ESCANEA|60 aparatos|14 cosas|30 y 50 por ciento|tres veces el ancho|laberinto acustico|codo hacia adentro|codo hacia afuera/i.test(s)) return true;
  // El S10 historico era una pagina/corte de un tunel. El guion nuevo dice expresamente que
  // no se fabrique un tunel: se conserva el material, no esa direccion visual.
  if (sec === "S10_LAMINA" && (e.tipo === "LAMINA" || e.tipo === "T2V")) return true;
  // Los movimientos de horno/lana historicos muestran un gabinete cerrado; el guion nuevo
  // exige pantalla abierta y fibra encapsulada. Es mas honesto reconstruirlos con b-roll.
  if ((sec === "S12_HORNO" || sec === "S15_LANA") && e.tipo === "ESCENA") return true;
  return false;
}

function anchorEvent(e, range) {
  const hit = locate(e.dice || e.texto || "", range.startIndex, range.endIndex, Number(e.ms) || range.startMs);
  if (!hit) return null;
  const startMs = caps[hit.startIndex].startMs;
  const phraseMs = Math.max(180, (caps[hit.endIndex].endMs ?? startMs + 180) - startMs);
  const originalDur = Number(e.dur) || 0;
  // Mantenemos la intencion de sostener el plano, pero nunca dejamos que un evento historico
  // se coma la siguiente seccion del guion actualizado.
  const dur = Math.max(0.9, Math.min(originalDur > 0 ? originalDur : phraseMs / 1000 + 1.2, (range.endMs - startMs) / 1000));
  return {
    ...e,
    ms: startMs,
    dur: Number(dur.toFixed(3)),
    _anchor: { startWord: hit.startIndex, endWord: hit.endIndex, coverage: Number(hit.coverage.toFixed(3)) },
  };
}

function event(sec, id, dice, tipo, extra = {}) {
  return { id, ms: 0, dur: extra.dur ?? 3.2, tipo, dice, ...extra, _manual: true, _sec: sec };
}

// Movimientos reales del kit que siguen siendo compatibles con el guion nuevo. Los tres
// movimientos que dependian del gabinete cerrado quedan deliberadamente fuera.
const manual = [
  event("S1_HOOK", "cme_v2_s1_open_screen", "En una prueba controlada", "CLIP", { nombre: "cms_s1_patio_noche_medidor", dur: 5.4 }),
  event("S1_HOOK", "cme_v2_s1_lamina", "una pantalla acustica abierta", "CLIP", { nombre: "cms_s1_lamina_vibra_noche", dur: 5.0 }),
  event("S1_HOOK", "cme_v2_s1_safety", "monoxido de carbono", "CLIP", { nombre: "cms_s1_ventana_vecino_muro", dur: 5.2 }),
  event("S2_PORQUE_SUENA", "cme_v2_s2_sources", "Y hay un motivo por el que un generador suena tanto", "ESCENA", { dur: 50.1, mov: "MovTercios", escena: "MovTercios" }),
  event("S2_PORQUE_SUENA", "cme_v2_s2_box", "Una caja silenciadora segura", "CLIP", { nombre: "cms_s2_gira_caja_banco", dur: 5.4 }),
  event("S4_TRES_NUMEROS", "cme_v2_s4_numbers", "Bien, los numeros", "ESCENA", { dur: 20.2, mov: "MovNumeros", escena: "MovNumeros" }),
  event("S5_TRES_IDEAS", "cme_v2_s5_ideas", "Vamos a lo que si funciona", "ESCENA", { dur: 57, mov: "MovAgujero", escena: "MovAgujero" }),
  event("S5_TRES_IDEAS", "cme_v2_s5_mass", "Una hoja de madera contrachapada de 12 milimetros", "CLIP", { nombre: "cms_s5_mano_hoja_cruda", dur: 5.6 }),
  event("S6_DOS_DOLARES", "cme_v2_s6_seal", "Un detalle barato es el sellador en las juntas", "CLIP", { nombre: "cms_s6_levanta_pistola_sellador", dur: 5.2 }),
  event("S6_DOS_DOLARES", "cme_v2_s6_vibration", "El otro detalle es la vibracion", "CLIP", { nombre: "cms_s6_dos_objetos_concreto", dur: 5.4 }),
  event("S6_DOS_DOLARES", "cme_v2_s6_test", "En mi medicion, el conjunto de barrera", "CLIP", { nombre: "cms_s6_apoya_sonometro_muro", dur: 5.4 }),
  event("S8_LISTA20", "cme_v2_s8_budget", "el material llego a 20 dolares", "CLIP", { nombre: "cms_s8_billete_sobre_contrachapado", dur: 5.2 }),
  event("S8_LISTA20", "cme_v2_s8_panels", "Dos o tres paneles de contrachapado de 12 a 15 milimetros", "CLIP", { nombre: "cms_s8_canto_contrachapado_cinta", dur: 5.6 }),
  event("S8_LISTA20", "cme_v2_s8_wool", "Lana mineral o de roca", "CLIP", { nombre: "cms_s8_lana_mineral_espesor", dur: 5.2 }),
  event("S8_LISTA20", "cme_v2_s8_sealant", "Un cartucho de sellador compatible", "CLIP", { nombre: "cms_s8_cartucho_gota_punta", dur: 4.2 }),
  event("S8_LISTA20", "cme_v2_s8_foam", "La espuma arde y la manta tapa el aire", "CLIP", { nombre: "cms_s8_espuma_humo_negro", dur: 5.0 }),
  event("S9_LABERINTO", "cme_v2_s9_safe_place", "Primero colocas el generador en la posicion segura", "CLIP", { nombre: "cms_s13_espaldas_ventana_vecino", dur: 5.4 }),
  event("S9_LABERINTO", "cme_v2_s9_sightline", "La parte que hace que la pantalla funcione es la linea de vista", "CLIP", { nombre: "cms_s9_mano_recorre_pared", dur: 5.4 }),
  event("S9_LABERINTO", "cme_v2_s9_soundline", "El sonido viaja directo desde el motor hasta el oido", "CLIP", { nombre: "cms_s9_haz_recto_sonido", dur: 5.4 }),
  event("S9_LABERINTO", "cme_v2_s9_panels", "Puedes usar tres paneles en forma de U abierta", "CLIP", { nombre: "cms_s9_regla_plegable_hueco", dur: 5.4 }),
  event("S10_LAMINA", "cme_v2_s10_warning", "No fabriques un tunel cerrado", "CLIP", { nombre: "cms_s3_garaje_medio_abierto", dur: 5.6 }),
  event("S11_VENTILACION", "cme_v2_s11_config", "La configuracion correcta queda asi", "CLIP", { nombre: "cms_s11_rejilla_contraluz_mano", dur: 5.4 }),
  event("S11_VENTILACION", "cme_v2_s11_open", "El generador completamente al aire libre", "CLIP", { nombre: "cms_s13_espaldas_ventana_vecino", dur: 5.4 }),
  event("S11_VENTILACION", "cme_v2_s11_manual", "El manual del fabricante manda", "CLIP", { nombre: "cms_s11_lapiz_escuadra_rectangulo", dur: 5.4 }),
  event("S11_VENTILACION", "cme_v2_s11_check", "Antes de dejarla funcionando", "CLIP", { nombre: "cms_s12_termometro_en_mano", dur: 5.4 }),
  event("S12_HORNO", "cme_v2_s12_first", "La primera version se veia muy bien en una foto", "CLIP", { nombre: "cms_s12_deja_rejilla_banco", dur: 5.4 }),
  event("S12_HORNO", "cme_v2_s12_hot", "La temperatura subio", "CLIP", { nombre: "cms_s12_aguja_zona_roja", dur: 5.0 }),
  event("S12_HORNO", "cme_v2_s12_test", "La prueba antes de dejar el generador funcionando", "CLIP", { nombre: "cms_s12_termometro_en_mano", dur: 5.4 }),
  event("S13_MEDICION", "cme_v2_s13_base", "Sin barrera, sobre el piso de concreto", "CLIP", { nombre: "cms_s13_pantalla_setenta_ocho", dur: 5.4 }),
  event("S13_MEDICION", "cme_v2_s13_open", "Con la pantalla abierta, puesta entre la fuente y el punto de medicion", "CLIP", { nombre: "cms_s13_pantalla_setenta_dos", dur: 5.4 }),
  event("S13_MEDICION", "cme_v2_s13_joints", "Cierro las juntas entre los paneles", "CLIP", { nombre: "cms_s13_rendija_luz_junta", dur: 5.4 }),
  event("S13_MEDICION", "cme_v2_s13_69", "69, tres decibeles mas en este montaje", "FOTO", { nombre: "cms_s13_pantalla_sesenta_nueve", dur: 4.4 }),
  event("S13_MEDICION", "cme_v2_s13_66", "La lectura final de esta prueba queda en 66", "FOTO", { nombre: "cms_s13_sesenta_seis_tiza", dur: 4.4 }),
  event("S13_MEDICION", "cme_v2_s13_goma", "una base antivibracion estable evita que el soporte", "CLIP", { nombre: "cms_s13_taco_goma_pata", dur: 5.0 }),
  event("S14_GRATIS", "cme_v2_s14_intro", "Pero hay otra cosa de ese mismo dia", "CLIP", { nombre: "cms_s14_trapo_mira_patio", dur: 5.6 }),
  event("S14_GRATIS", "cme_v2_s14_zero", "Combinó tres cambios sin comprar otro equipo", "CLIP", { nombre: "cms_s14_manos_marco_pesa", dur: 5.6 }),
  event("S14_GRATIS", "cme_v2_s14_cable", "Con 20 metros de cable de calibre grueso", "CLIP", { nombre: "cms_s14_desenrolla_cable_naranja", dur: 5.4 }),
  event("S15_LANA", "cme_v2_s15_humidity", "La humedad entra por la lluvia y por la condensacion", "CLIP", { nombre: "cms_s15_tapa_luz_dia", dur: 5.4 }),
  event("S15_LANA", "cme_v2_s15_cover", "El material absorbente tiene que estar encapsulado", "CLIP", { nombre: "cms_s15_engrapa_mosquitero_lana", dur: 5.6 }),
  event("S15_LANA", "cme_v2_s15_review", "Cada cierto tiempo, con el generador apagado y frio", "CLIP", { nombre: "cms_s15_trapo_gris_malla", dur: 5.4 }),
  event("S15_LANA", "cme_v2_s15_fire", "dejar la estructura sobre pasto seco", "CLIP", { nombre: "cms_s15_caja_pasto_seco", dur: 5.4 }),
  event("S15_LANA", "cme_v2_s15_inverter", "Si tu generador es un inversor cerrado moderno", "CLIP", { nombre: "cms_s15_inversor_junto_marco", dur: 5.4 }),
  event("S15_LANA", "cme_v2_s15_battery", "Un respaldo de bateria no tiene escape ni monoxido", "CLIP", { nombre: "cms_s15_respaldo_bateria_taller", dur: 5.4 }),
  event("S14_GRATIS", "cme_v2_s14_free", "Pero hay otra prueba de ese mismo dia", "ESCENA", { dur: 57.5, mov: "MovDieciocho", escena: "MovDieciocho" }),
  event("S3_HONESTIDAD", "cme_v2_cta_luz", "Cuando se va la luz, una guia de todo medido", "CTA", { dur: 12.5, texto: "CUANDO SE VA LA LUZ\nGuía de respaldo sin compras a ciegas", icono: "CTA_QR_01", asset: "img/cmesilencio/cms_cta_qr_01_luz.png" }),
  event("S14_GRATIS", "cme_v2_cta_100w", "Promete 100W, entrega 43W", "CTA", { dur: 12.5, texto: "PROMETE 100 W. ENTREGA 43 W.\nPrueba rápida antes de pagar", icono: "CTA_QR_02", asset: "img/cmesilencio/cms_cta_qr_02_100w.png" }),
  event("S16_CIERRE", "cme_v2_cta_todo", "todo medido reune las dos guias", "CTA", { dur: 15, texto: "TODO MEDIDO\nRuido · consumo · respaldo", icono: "CTA_QR_03", asset: "img/cmesilencio/cms_cta_qr_03_todo_medido.png" }),
];

const report = [];
const all = [];
for (const file of files) {
  const sec = secFromFile(file);
  const range = rangeFor(sec);
  const input = JSON.parse(fs.readFileSync(path.join(SRC_DIR, file), "utf8").replace(/^\uFEFF/, ""));
  const out = [];
  const missing = [];
  for (const e of input) {
    if (obsolete(e, sec)) { missing.push(`${e.id}:filtered`); continue; }
    const a = anchorEvent(e, range);
    if (!a) { missing.push(`${e.id}: ${e.dice || e.texto || e.tipo}`); continue; }
    out.push(a); all.push({ ...a, _sec: sec });
  }
  report.push({ file, input: input.length, output: out.length, missing });
  if (!DRY) {
    fs.mkdirSync(DST_DIR, { recursive: true });
    fs.writeFileSync(path.join(DST_DIR, file), JSON.stringify(out, null, 2) + "\n", "utf8");
  }
}

for (const e of manual) {
  const range = rangeFor(e._sec);
  const a = anchorEvent(e, range);
  if (!a) throw new Error(`No pude anclar evento manual ${e.id}: ${e.dice}`);
  all.push(a);
  if (!DRY) {
    const file = fileForSec.get(e._sec);
    const p = path.join(DST_DIR, file);
    const current = JSON.parse(fs.readFileSync(p, "utf8"));
    current.push(a);
    current.sort((x, y) => x.ms - y.ms || String(x.id).localeCompare(String(y.id)));
    fs.writeFileSync(p, JSON.stringify(current, null, 2) + "\n", "utf8");
  }
}

const byType = {};
for (const e of all) byType[e.tipo] = (byType[e.tipo] || 0) + 1;
console.log(JSON.stringify({
  dryRun: DRY,
  captions: caps.length,
  durationMs: caps.at(-1)?.endMs ?? 0,
  sections: sectionRanges.map((r) => ({ sec: r.sec, start: r.startMs, end: r.endMs })),
  outputDir: DRY ? null : DST_DIR,
  byType,
  manual: manual.map((e) => e.id),
  report,
}, null, 2));
