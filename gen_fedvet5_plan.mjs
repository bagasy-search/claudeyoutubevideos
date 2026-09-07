// gen_fedvet5_plan.mjs — DIRECTOR → _v3/fedvet5_plan.json  (canal Federer Veterinario, NARRADOR PURO)
//
//   node gen_fedvet5_plan.mjs        # momentos + assets en disco -> plan
//   node build_fedvet5.mjs           # plan -> cues + Main + index + _fedvet5_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ Un componente NO puede comerse el ancla de OTRO componente: la compuerta aborta.
// ⛔ En este video NO hay CTA de producto: el canal todavía no vende nada, así que no existe
//    ninguna tarjeta con URL. El cierre es una PullQuote y la suscripción va sólo en la voz.
// ⭐ METRAJE REAL: _v3/fedvet5_real.json mapea momentos -> clips de Pexels ya auditados con visión.
//    Tienen prioridad sobre la foto generada (un video 100 % IA "se siente vacío").
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fedvet5";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);
const REAL = fs.existsSync(`_v3/${SLUG}_real.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_real.json`, "utf8")) : {};
// ⛔⛔ COMPUERTA DE LUMINANCIA (scripts/check_luma_assets.mjs): el juez de VISION del pool
//    aprueba por CONTENIDO y deja pasar clips con un TRAMO casi negro adentro. En fedvet5,
//    `f5pool_boca_06` (racha oscura de 1,70 s) metio 1,63 s de PANTALLA NEGRA que blackdetect
//    cazo recien sobre el mp4 de entrega, con el farm ya gastado. Los de esa lista NO se usan.
const OSCUROS = new Set(fs.existsSync(`_v3/${SLUG}_oscuros.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_oscuros.json`, "utf8")) : []);

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};
const COMPS = [
  // ── HOOK ───────────────────────────────────────────────────────────────────────────────────────
  { frag: "Uno de esos dos perros tenía la tráquea", comp: "SplitVs",
    props: { leftLabel: "CHISPA · 9 AÑOS · CALLE DE TIERRA", leftValue: "LA TRÁQUEA UN POCO FLOJA",
      rightLabel: "TRUENO · 13 AÑOS · MESTIZO GRANDE", rightValue: "EL CORAZÓN, OCHO MESES ANTES",
      verdict: "La misma tos, el mismo barrio, nueve días de diferencia." } },
  { frag: "Ocho meses tosiendo delante", comp: "BigStat",
    props: { value: "8 MESES", unit: "TOSIENDO DELANTE DE TODOS",
      caption: "Nadie lo llevó. Tosía poquito, tosía de noche, y siempre había una explicación mejor a mano.", tone: "danger" } },
  { frag: "Me dijo: doctor, se tropezó", comp: "PullQuote",
    props: { quote: "Doctor, se tropezó. Pero me quedé preocupado.",
      attrib: "Aníbal, por teléfono. No se tropezó: se le fue la sangre de la cabeza dos segundos." } },
  // ── DECODIFICADOR ──────────────────────────────────────────────────────────────────────────────
  { frag: "Necesita que te fijes en cuatro cosas", comp: "RayChecklist",
    props: { kicker: "SEPARAR LAS DOS TOSES · SIN NINGÚN APARATO", title: "Las cuatro cosas en las que fijarte", items: [
      { text: "Cómo suena: seca y hueca, o blanda y húmeda" },
      { text: "Cuándo aparece: con la emoción, o de madrugada" },
      { text: "En qué posición estaba: de pie, o acostado" },
      { text: "Cómo queda después: sigue igual, o se queda quieto respirando" }] } },
  { frag: "La tos del corazón aparece con el perro acostado", comp: "PullQuote",
    props: { quote: "La tos del corazón aparece con el perro acostado. Y aparece de noche.",
      attrib: "Ese es el detalle que separa las dos. Todo lo demás se puede confundir." } },
  { frag: "Te lo resumo en una frase", comp: "SplitVs",
    props: { leftLabel: "TOSE CUANDO SE EMOCIONA", leftValue: "Y SIGUE COMO SI NADA · MIRA LA GARGANTA",
      rightLabel: "TOSE CUANDO SE ACUESTA", rightValue: "Y SE QUEDA QUIETO RESPIRANDO · MIRA EL CORAZÓN",
      verdict: "Hay perros que tienen las dos cosas. Esto es para llegar con información, no para decidir tú solo." } },
  // ── SEÑAL 1 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Un perro sano, dormido, respira menos", comp: "BigStat",
    props: { value: "30", unit: "RESPIRACIONES POR MINUTO, DORMIDO",
      caption: "Por debajo de treinta es normal, y casi siempre da entre quince y veinticinco. Es la alarma más temprana que existe, y es gratis.", tone: "brass" } },
  { frag: "Miras las costillas", comp: "ProcessChips",
    props: { kicker: "DORMIDO Y QUIETO · SIN TOCARLO", title: "La cuenta de los quince segundos", steps: [
      { title: "Mira las costillas" }, { title: "Sube y baja es una" },
      { title: "Cuenta quince segundos" }, { title: "Multiplica por cuatro" }] } },
  { frag: "Si te da más de treinta", comp: "CheckCard",
    props: { kicker: "QUÉ HACER CON EL NÚMERO", title: "El número, traducido", items: [
      { text: "Menos de 30 · normal. Anótalo igual: es la base de tu perro" },
      { text: "Más de 30 dos noches seguidas, sin calor y sin correr · consultar" },
      { text: "Más de 40 · eso no espera al lunes" },
      { text: "Un número por semana alcanza para ver la tendencia" }] } },
  { frag: "Esto de anotar los números tiene una hoja", comp: "RayCta", overlay: true,
    props: { eyebrow: "Federer Veterinario", title: "La hoja de los siete días",
      sub: "Los casilleros para anotar el número, dentro del método del perro mayor.",
      domain: "drfederer.com/veterinario", qr: "img/fedvet5_qrcard.png", showQr: true } },
  // ── SEÑAL 3 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "La misma vuelta a la manzana", comp: "RayChecklist",
    props: { kicker: "NO APARECE DE GOLPE · APARECE ENCOGIÉNDOSE", title: "El paseo que se acortó solo", items: [
      { text: "La vuelta a la manzana ahora se hace media" },
      { text: "Se para en el descanso de la escalera" },
      { text: "Iba primero a la esquina y ahora va atrás" },
      { text: "Se sienta a mitad de cuadra sin nada que oler" }] } },
  // ── SEÑAL 4 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Se acuesta con el pecho apoyado", comp: "WorstSpots",
    props: { kicker: "ASÍ LE ENTRA MÁS AIRE · ESTÁ ABRIENDO LA CAJA DEL PECHO", title: "La postura de esfinge", spots: [
      { label: "El pecho apoyado, nunca de costado" },
      { label: "Los codos separados del cuerpo, hacia afuera" },
      { label: "El cuello estirado y la cabeza levantada" },
      { label: "Y ahí se queda: no cambia de postura" }] } },
  { frag: "Y todo el mundo dice, ay, tiene calor", comp: "MythTruth",
    props: { kicker: "EL MOSAICO FRÍO DEL BAÑO",
      myth: "Se fue al piso frío porque tiene calor.",
      truth: "Está buscando aire. En enero pasa. En julio, con la casa fresca, ya no es calor: es un perro eligiendo el sitio donde mejor respira." } },
  // ── SEÑAL 5 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "apoya el dedo sobre la encía", comp: "ProcessChips",
    props: { kicker: "HAZLO HOY, CON EL PERRO SANO, PARA SABER CÓMO ES LA DE ÉL", title: "La prueba del dedo", steps: [
      { title: "Aprieta un segundo" }, { title: "Se pone blanca" },
      { title: "Suelta y cuenta" }, { title: "El rosa vuelve antes de dos" }] } },
  { frag: "envuélvelo tranquilo y anda al veterinario", comp: "CheckCard",
    props: { kicker: "LENGUA GRIS, VIOLÁCEA O AZULADA · ESO ES AHORA", title: "Si lo ves así, qué NO hacer", items: [
      { text: "No lo bañes" },
      { text: "No le des de comer ni de beber" },
      { text: "No lo hagas caminar hasta el auto" },
      { text: "No lo abraces fuerte ni le sujetes el pecho" }] } },
  // ── SEÑAL 6 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Toma un pedazo de piolín", comp: "RouteFlow",
    props: { kicker: "UN CORDÓN DE ZAPATO Y UNA BIROME", title: "La prueba del piolín, en este orden", steps: [
      { label: "Pásalo por la panza, detrás de las últimas costillas" },
      { label: "Apoya, no aprietes. Marca dónde llega" },
      { label: "Escribe la fecha al lado" },
      { label: "El mismo día de la semana que viene, otra vez" }] } },
  { frag: "Esa hoja de los siete días", comp: "RayCta", overlay: true,
    props: { eyebrow: "Federer Veterinario", title: "Los casilleros de la panza",
      sub: "Están en la misma hoja. Y un papel pegado en la heladera hace el mismo trabajo.",
      domain: "drfederer.com/veterinario", qr: "img/fedvet5_qrcard.png", showQr: true } },
  // ── SEÑAL 7 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Y todo el mundo lo cuenta igual", comp: "MythTruth",
    props: { kicker: "LA SEÑAL QUE MÁS VECES ME DESCRIBIERON SIN SABERLO",
      myth: "Se tropezó. Se resbaló. Se le durmió la pata.",
      truth: "Se llama síncope. Se afloja, se cae un segundo con los ojos abiertos, se levanta solo y sigue caminando. A veces mueve la cola enseguida, como pidiendo disculpas." } },
  { frag: "Un perro mayor que se cae un segundo", comp: "RayChecklist",
    props: { kicker: "SIEMPRE HAY UN ESFUERZO JUSTO ANTES", title: "Los cuatro momentos", items: [
      { text: "Al terminar de subir la escalera" },
      { text: "Cuando llega alguien y se emociona" },
      { text: "Cuando se levanta rápido" },
      { text: "Al final de un ataque de tos" }] } },
  { frag: "La primera: dejar de sacarlo a pasear", comp: "CheckCard",
    props: { kicker: "TRES COSAS QUE SE HACEN CON BUENA INTENCIÓN", title: "Lo que empeora las cosas", items: [
      { text: "Dejar de pasearlo: pierde músculo, y el músculo no vuelve" },
      { text: "La sal de la mesa: fiambre, queso, pan, caldo, paté" },
      { text: "Esperar a ver si se le pasa: la tos del corazón no se pasa" }] } },
  // ── QUÉ HACER ──────────────────────────────────────────────────────────────────────────────────
  { frag: "Anda con tres cosas escritas", comp: "RouteFlow",
    props: { kicker: "NO VAYAS A DECIR TOSE", title: "Lo que llevas escrito en un papel", steps: [
      { label: "El número de respiraciones dormido, dos noches distintas" },
      { label: "La hora de las últimas cinco toses" },
      { label: "Si hubo caída: cuándo y qué estaba haciendo antes" },
      { label: "Y pides dos cosas: auscultación en silencio y radiografía de tórax" }] } },
  { frag: "Un soplo es un ruido", comp: "PullQuote",
    props: { quote: "Un soplo es un ruido, no es una sentencia. Lo que cambia el pronóstico no es el ruido: es cuándo empezaste.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
  // ── NO ES CORAZÓN ──────────────────────────────────────────────────────────────────────────────
  { frag: "Hay perros que tosen por la tráquea", comp: "RayChecklist",
    props: { kicker: "NO TODA TOS ES EL CORAZÓN · NI CERCA", title: "Las otras cinco toses", items: [
      { text: "La tráquea floja: con arnés en vez de collar, se vive perfecto" },
      { text: "La tos de perrera: de golpe, tras estar con otros perros, se va en dos semanas" },
      { text: "La alergia: con estornudos y ojos llorosos, sube y baja con las estaciones" },
      { text: "La boca infectada: se arregla con una limpieza" },
      { text: "El que se atragantó con un hueso: dos días y ya está" }] } },
  // ── RESUMEN ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Cuatro cosas, todas gratis", comp: "CheckCard",
    props: { kicker: "CUATRO PAPELITOS · TODO GRATIS · TODO EN TU CASA", title: "Para esta semana", items: [
      { text: "Esta noche: quince segundos, dormido, por cuatro. El número y la fecha" },
      { text: "Siete días: la hora de cada tos" },
      { text: "Hoy y el domingo que viene: el piolín en la panza, con la fecha" },
      { text: "Si se afloja un segundo, no lo llames tropezón. Anótalo" }] } },
  // ── CIERRE ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "Por eso esto no lo va a encontrar un análisis", comp: "PullQuote",
    props: { quote: "Esto no lo va a encontrar un análisis. Lo vas a encontrar tú, una noche cualquiera, sentado al lado de tu perro, contando quince segundos.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
  { frag: "están en el método del perro mayor", comp: "RayCta", overlay: true,
    props: { eyebrow: "El Método del Perro Mayor", title: "Las 33 señales, ordenadas",
      sub: "Tres guías y las hojas para anotar. Apunta el código con la cámara del teléfono.",
      domain: "drfederer.com/veterinario", qr: "img/fedvet5_qrcard.png", showQr: true } },
];


// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
// ⛔⛔ AGNES REDIBUJA LA ESCENA, Y LO HACE ANTES DEL PRIMER SEGUNDO. En los clips fallados SOLO el
//    frame 0 es fiel a la foto; a los 0,3 s ya es otro lugar u otra persona. Por eso NO alcanza con
//    recortar la duración: el clip entero se descarta y el momento vuelve a la FOTO con Ken-Burns.
const REDIBUJADO = new Set(fs.existsSync(`_v3/${SLUG}_redibujados.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_redibujados.json`, "utf8")) : []);
const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla COLISIONADA`); process.exit(1); }

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const overlaysOut = [];
let absorbidos = 0, reales = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const img = `img/${SLUG}_${String(m.i).padStart(3, "0")}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${String(m.i).padStart(3, "0")}.mp4`;
  const real = REAL[String(m.i)];                        // "fedvet5_pool/f5pool_xxx"
  const c = compAt.get(i);

  if (c && c.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
  }
  if (c && !c.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    const comidos = [];
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      if (anclas.has(j)) { console.error(`⛔ el componente ${c.comp} (momento ${i}) absorbe el ancla del componente en el momento ${j}. Movelo de frase.`); process.exit(1); }
      MOM[j].__skip = true; comidos.push(j);
    }
    // ⛔⛔ EL ESTIRÓN HASTA EL PRÓXIMO BEAT PUEDE DEJAR LA TARJETA 18 s EN PANTALLA. Medido acá:
    //    dos componentes llegaban a 18,5 s y el total en pantalla trepaba al 22 % del video, que es
    //    el terreno del "32 % tapado por carteles" que el creador ya rechazó una vez. Si el último
    //    momento comido tiene COLA más allá del piso de lectura, esa cola RECUPERA su propio plano
    //    (arranca en `out`, no en su `t`): la tarjeta se queda en su piso y el b-roll vuelve antes.
    const ult = comidos[comidos.length - 1];
    let colaDe = null;
    if (ult !== undefined && MOM[ult].t + MOM[ult].dur > out + 2) { colaDe = ult; MOM[ult].__skip = false; MOM[ult].__desde = out; }
    if (colaDe === null) {
      const sig = MOM.find((x) => x.t >= out && !x.__skip);
      if (sig) out = Math.max(out, sig.t);   // ESTIRA hasta el próximo beat real (recortar deja hueco)
    }
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: c.comp, props: { ...c.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  const ms_in = Math.round((m.__desde ?? m.t) * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);

  // 1) METRAJE REAL primero (auditado con visión): es lo que evita que el video "se sienta vacío"
  if (real && !OSCUROS.has(real) && existe(`broll/${real}.mp4`)) {
    const rd = durDe(`broll/${real}.mp4`);
    const usable = rd - 0.15;
    reales++;
    if (m.dur <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: real });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / m.dur)), clip: real });
    continue;
  }

  // 2) el clip animado con agnes, si no salió redibujado
  const cd = (existe(clip) && !REDIBUJADO.has(m.i)) ? durDe(clip) : 0;
  if (cd > 0.8) {
    const usable = cd - 0.15;
    if (m.dur <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / m.dur)),
      clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
  } else {
    // 3) foto con Ken-Burns (se ve MÁS fluida que el movimiento horneado)
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: `${SLUG}_${String(m.i).padStart(3, "0")}` });
  }
}

// ── COMPUERTA DE COBERTURA: sin avatar, todo hueco es pantalla plana. Estirar el vecino de la izquierda.
beats.sort((a, b) => a.ms_in - b.ms_in);
const FIN = Math.round((TOTAL_S + 1.2) * 1000);
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : FIN;
  if (beats[i].ms_out < sig) beats[i].ms_out = sig;               // cero huecos por construcción
}
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysOut };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`metraje REAL en ${reales} beats (${(100 * reales / beats.length).toFixed(0)} % del video)`);
console.log(`overlays: ${overlaysOut.length}`);
console.log(`componentes distintos: ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
