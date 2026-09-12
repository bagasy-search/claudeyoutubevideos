// lint_prompts_cmeciclo.mjs — COMPUERTA de prompts, antes de gastar en imágenes.
//
// Chequear el TEXTO de los prompts cuesta ~0. Auditar 178 imágenes con visión y regenerar los
// fallos cuesta plata y un turno entero. Por eso esto corre PRIMERO.
//
// ⛔ Toda compuerta arranca diciendo CUÁNTOS elementos evaluó: un comando que no imprime no es un OK.
import fs from "node:fs";

const SLUG = "cmeciclo";
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
const MOM = rd(`_v3/${SLUG}_moments.json`).moments;

const GRUPOS = ["G0", "G1", "G2", "G3", "G4", "G5", "G6"];
const items = [];
for (const g of GRUPOS) {
  const p = `_v3/${SLUG}_prompts_${g}.json`;
  if (!fs.existsSync(p)) { console.error(`⛔ falta ${p}`); process.exit(1); }
  const arr = rd(p);
  if (!Array.isArray(arr)) { console.error(`⛔ ${p} no es un array`); process.exit(1); }
  items.push(...arr.map((it) => ({ ...it, grupo: g })));
}

const byId = new Map(items.map((it) => [it.id, it]));
const fallas = [];
const push = (tipo, id, det) => fallas.push({ tipo, id, det });

// 1 · cobertura exacta de los momentos
for (const m of MOM) if (!byId.has(m.id) && !m.id.startsWith("n")) push("falta", m.id, `${m.sec} · "${m.text.slice(0, 60)}…"`);
for (const it of items) if (!MOM.find((m) => m.id === it.id) && !it.id.startsWith("n")) push("sobra", it.id, it.grupo);
const dupIds = items.map((i) => i.id).filter((v, i, a) => a.indexOf(v) !== i);
for (const d of new Set(dupIds)) push("id_repetido", d, "");

// 2 · tokens prohibidos (jerga de foto Y look lavado/vintage — el creador rechazó los dos)
const PROHIBIDOS = [
  "cinematic", "35mm", "50mm", "85mm", "bokeh", "8k", "4k", "highly detailed", "hyperrealistic",
  "golden hour", "depth of field", "shallow depth", "professional photograph", "studio lighting",
  "dramatic lighting", "documentary style", "national geographic", "award winning", "octane",
  "unreal engine", "hdr", "lens flare", "film still", "movie still", "cinematography",
  "grainy", "muted colors", "muted color", "low saturation", "desaturated", "vintage", "faded film",
  "washed out", "retro filter", "film grain", "nothing polished, dull",
];
// 3 · el prompt tiene que traer AL MENOS un sustantivo de SU frase (coherencia plano↔frase)
const ES_EN = {
  batería: ["battery", "batteries"], baterías: ["battery", "batteries"],
  auto: ["car"], coche: ["car"], arranque: ["starting", "cranking", "start"],
  "ciclo profundo": ["deep-cycle", "deep cycle"], placa: ["plate"], placas: ["plate"],
  plomo: ["lead"], ácido: ["acid"], sulfato: ["sulfate", "sulphate"], escamas: ["flake", "flakes"],
  inversor: ["inverter"], pinza: ["clamp meter", "clamp"], amperimétrica: ["clamp meter", "clamp"],
  refrigerador: ["fridge", "refrigerator"], heladera: ["fridge", "refrigerator"],
  nevera: ["fridge", "refrigerator"], compresor: ["compressor"], puerta: ["door"],
  cable: ["cable", "wire"], cables: ["cable", "wire"], fusible: ["fuse"], borne: ["post", "terminal"],
  bornes: ["post", "terminal"], llave: ["wrench", "spanner", "key"], cargador: ["charger"],
  voltios: ["volt", "voltage", "meter", "screen", "display"], voltaje: ["volt", "voltage"],
  vatios: ["watt", "meter", "screen", "display"], amperios: ["amp", "ampere"],
  etiqueta: ["label", "sticker"], caja: ["box", "carton"], cajas: ["box", "carton"],
  garaje: ["garage"], mesa: ["table", "workbench", "bench"], banco: ["workbench", "bench"],
  cronómetro: ["stopwatch", "timer", "phone"], reloj: ["clock", "watch"],
  hidrógeno: ["hydrogen", "gas"], manta: ["blanket"], placard: ["closet", "cupboard"],
  alfombra: ["carpet", "rug"], balde: ["bucket", "pail"], barro: ["mud"],
  papel: ["paper", "notebook", "notepad"], dinero: ["money", "bill", "cash", "banknote"],
  dólares: ["money", "bill", "cash", "banknote", "price"], mostrador: ["counter", "shelf", "store"],
  vendedor: ["salesman", "clerk", "shop"], góndola: ["shelf", "aisle"], barco: ["boat", "ship"],
  gel: ["gel"], tapones: ["cap", "caps"], agua: ["water"], linterna: ["flashlight", "torch"],
  apagón: ["blackout", "dark", "power cut", "flashlight", "candle"],
  tormenta: ["storm", "rain"], luz: ["light", "lamp", "bulb"], casa: ["house", "home"],
  motor: ["motor", "engine"], comida: ["food"], guía: ["guide", "book", "notebook"],
  celular: ["phone"], teléfono: ["phone"], pantalla: ["screen", "display"],
  polvo: ["dust", "dusty"], peso: ["weight", "heavy", "lift"], kilos: ["weight", "heavy", "lift"],
};

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
let conCobertura = 0, sinMapa = 0;
const presenter = items.filter((i) => i.kind === "presenter").length;
const cards = items.filter((i) => i.kind === "card");
// ⛔ los planos `card` son tarjetas YA dibujadas (comentario real, QR): no tienen prompt y no
//    se generan. Se validan por otro lado: que el archivo exista en disco.
for (const c of cards) if (!fs.existsSync(`public/${c.asset || ""}`)) push("card_sin_archivo", c.id, String(c.asset));

for (const it of items) {
  if (it.kind === "card") continue;
  const m = byId.has(it.id) ? MOM.find((x) => x.id === it.id) : null;
  const p = String(it.prompt || "");
  const pl = norm(p);

  if (!p) { push("prompt_vacio", it.id, ""); continue; }
  if (p.length < 180) push("prompt_corto", it.id, `${p.length} chars — genérico, falta escena/props/luz`);
  if (!["presenter", "object"].includes(it.kind)) push("kind_invalido", it.id, String(it.kind));

  for (const t of PROHIBIDOS) if (pl.includes(norm(t))) push("token_prohibido", it.id, t);

  // ⛔⛔ CLAUSULA DE PROFUNDIDAD — la que separa "foto real" de "foto de stock".
  // `sharp focus` le pide nitidez AL SUJETO y el modelo rellena el fondo con su default cremoso.
  // Prohibir `bokeh` no alcanza: va en POSITIVO y en TODOS los prompts. Y ojo con el falso
  // positivo: la propia clausula dice "nothing blurred out", asi que se saca antes de buscar blur.
  if (!/deep depth of field/i.test(p)) push("sin_clausula_de_profundidad", it.id, "el fondo va a salir cremoso = look de stock");
  const sinClausula = p.replace(/deep depth of field[^.]*nothing blurred out\.?/i, "");
  for (const t of ["out of focus", "blurred", "blurry", "soft focus", "shallow depth", "subject isolation", "stock photo"]) {
    if (norm(sinClausula).includes(norm(t))) push("desenfoque_escrito", it.id, t);
  }

  // presenter tiene que traer la identidad; si no, gpt-image devuelve a cualquiera
  if (it.kind === "presenter" && !/reference photo/i.test(p)) push("sin_identidad", it.id, "falta 'the man in the reference photo'");

  // coherencia con SU frase
  const nouns = (it.nouns || []).map(norm);
  const delTexto = m ? norm(m.text) : "";
  const fueraDeFrase = nouns.filter((n) => n && !delTexto.includes(n.split(" ")[0].slice(0, Math.max(4, n.length - 2))));
  if (m && fueraDeFrase.length === nouns.length && nouns.length) push("nouns_ajenos", it.id, `${nouns.join("/")} no están en la frase`);

  const mapeables = nouns.flatMap((n) => ES_EN[n] || ES_EN[n.replace(/s$/, "")] || []);
  if (!mapeables.length) sinMapa += 1;
  else if (mapeables.some((en) => pl.includes(norm(en)))) conCobertura += 1;
  else push("plano_no_pega", it.id, `nouns ${nouns.join("/")} → ninguno aparece en el prompt`);
}

// 4 · repetidos y consecutivos iguales
const vistos = new Map();
for (const it of items) {
  if (it.kind === "card") continue;
  const k = norm(String(it.prompt)).replace(/[^a-z0-9 ]/g, "").slice(0, 220);
  if (vistos.has(k)) push("prompt_repetido", it.id, `igual que ${vistos.get(k)}`);
  else vistos.set(k, it.id);
}
const orden = MOM.map((m) => byId.get(m.id)).filter((x) => x && x.kind !== "card");
for (let i = 1; i < orden.length; i += 1) {
  const a = norm(String(orden[i - 1].prompt)).split(/\W+/).filter((w) => w.length > 4);
  const b = norm(String(orden[i].prompt)).split(/\W+/).filter((w) => w.length > 4);
  const inter = a.filter((w) => b.includes(w)).length;
  const jac = inter / new Set([...a, ...b]).size;
  if (jac > 0.72) push("consecutivos_iguales", orden[i].id, `${(jac * 100).toFixed(0)}% de palabras compartidas con ${orden[i - 1].id}`);
}

// ── reporte ────────────────────────────────────────────────────────────────────
console.log(`evaluados: ${items.length} prompts contra ${MOM.length} momentos · ${GRUPOS.length} grupos`);
console.log(`presenter ${presenter} (${((presenter / items.length) * 100).toFixed(0)}%) · object ${items.length - presenter - cards.length} · tarjetas dibujadas ${cards.length}`);
console.log(`coherencia plano↔frase: ${conCobertura} pegan · ${sinMapa} sin sustantivo mapeable (no se juzgan)`);
const largos = items.filter((i) => i.kind !== "card").map((i) => String(i.prompt).length).sort((a, b) => a - b);
console.log(`largo de prompt: mediana ${largos[Math.floor(largos.length / 2)]} · min ${largos[0]} · max ${largos.at(-1)}`);

// `plano_no_pega` / `nouns_ajenos` los decide un diccionario ES->EN corto y da falsos positivos
// (un prompt que muestra la pinza marcando 110 no dice "watt"). Van como AVISO para mirarlos a
// mano. Todo lo demas es objetivo y BLOQUEA.
const AVISO = new Set(["plano_no_pega", "nouns_ajenos"]);
const fatal = fallas.filter((f) => !AVISO.has(f.tipo));
const avisos = fallas.filter((f) => AVISO.has(f.tipo));
const dump = (arr, marca) => {
  const porTipo = {};
  for (const f of arr) (porTipo[f.tipo] = porTipo[f.tipo] || []).push(f);
  for (const [t, a] of Object.entries(porTipo)) {
    console.log(`${marca} ${t} (${a.length})`);
    for (const f of a.slice(0, 12)) console.log(`   ${f.id}  ${f.det}`);
    if (a.length > 12) console.log(`   ... y ${a.length - 12} mas`);
  }
};
console.log("");
if (avisos.length) dump(avisos, "AVISO");
if (fatal.length) dump(fatal, "BLOQUEA");
fs.writeFileSync(`_v3/${SLUG}_lint.json`, JSON.stringify(fallas, null, 1));
console.log(fatal.length ? `
${fatal.length} fallas que BLOQUEAN` : `
OK: 0 fallas que bloquean (${avisos.length} avisos para mirar a mano)`);
process.exit(fatal.length ? 1 : 0);
