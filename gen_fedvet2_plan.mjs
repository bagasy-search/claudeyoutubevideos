// gen_fedvet2_plan.mjs — DIRECTOR → _v3/fedvet2_plan.json  (canal Federer Veterinario, NARRADOR PURO)
//
//   node gen_fedvet2_plan.mjs        # momentos + assets en disco -> plan
//   node build_fedvet2.mjs           # plan -> cues + Main + index + _fedvet2_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ Un componente NO puede comerse el ancla de OTRO componente: la compuerta aborta.
// ⛔ En este video NO hay CTA de producto: el canal todavía no vende nada, así que no existe
//    ninguna tarjeta con URL. El cierre es una PullQuote y la suscripción va sólo en la voz.
// ⭐ METRAJE REAL: _v3/fedvet2_real.json mapea momentos -> clips de Pexels ya auditados con visión.
//    Tienen prioridad sobre la foto generada (un video 100 % IA "se siente vacío").
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fedvet2";
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

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};
const COMPS = [
  // ── HOOK ───────────────────────────────────────────────────────────────────────────────────────
  { frag: "Uno de esos dos perros estaba saludando", comp: "SplitVs",
    props: { leftLabel: "NUBE · 11 AÑOS · UN LUNES", leftValue: "ESTABA SALUDANDO",
      rightLabel: "BARÓN · 13 AÑOS · MIÉRCOLES 20:20", rightValue: "CATORCE HORAS DE DOLOR",
      verdict: "El mismo gesto, la misma semana. Vi los dos con mis propios ojos." } },
  { frag: "Dijo: mamá", comp: "PullQuote",
    props: { quote: "Mamá, hace rato que está en esa posición y no se levanta.",
      attrib: "El hijo, que había ido a cenar. Esa frase le salvó la vida al perro." } },
  // ── SALUDO ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "Se le llama el estiramiento de saludo", comp: "MythTruth",
    props: { kicker: "LO QUE CREES QUE SIGNIFICA",
      myth: "Se estira porque le da pereza levantarse.",
      truth: "Se estira delante de ti porque confía. En esa postura queda con la barriga expuesta y no puede salir corriendo: ningún animal hace eso delante de alguien de quien desconfía." } },
  { frag: "Ningún animal hace eso delante", comp: "PullQuote",
    props: { quote: "No está diciendo qué pereza. Está diciendo: llegaste tú, aquí no pasa nada, puedo bajar la guardia.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
  { frag: "catorce y dieciséis horas", comp: "BigStat",
    props: { value: "14 A 16 H", unit: "AL DÍA DUERME UN PERRO ADULTO",
      caption: "Uno mayor, todavía más. Por eso el estiramiento no es opcional: le devuelve el largo al músculo y le manda sangre.", tone: "brass" } },
  // ── JUEGO ──────────────────────────────────────────────────────────────────────────────────────
  { frag: "lo que voy a hacer ahora es de mentira", comp: "MythTruth",
    props: { kicker: "LA REVERENCIA DE JUEGO",
      myth: "Se estiró otra vez.",
      truth: "Es otra cosa. Es el aviso más antiguo que tiene: te voy a morder la pata, pero es un juego. Los cachorros la hacen a las tres semanas de vida, antes de caminar bien." } },
  // ── DISTINGUIR ─────────────────────────────────────────────────────────────────────────────────
  { frag: "las tres son fáciles de ver desde la puerta", comp: "RayChecklist",
    props: { kicker: "SALUDO O JUEGO · SE VEN IGUAL", title: "Las tres diferencias, desde la puerta", items: [
      { text: "La cola: tranquila y lenta, o batidora que mueve todo el trasero" },
      { text: "La cara: ojos entrecerrados y bostezo, u ojos abiertos y orejas adelante" },
      { text: "Lo que pasa DESPUÉS: camina hacia ti, o salta y sale corriendo" }] } },
  { frag: "La tercera, y para mí la más clara", comp: "SplitVs",
    props: { leftLabel: "ESTIRAMIENTO DE SALUDO", leftValue: "TERMINA CAMINANDO HACIA TI",
      rightLabel: "REVERENCIA DE JUEGO", rightValue: "TERMINA EN UN SALTO O UNA CARRERA",
      verdict: "La reverencia nunca se queda quieta: es el principio de algo." } },
  // ── PLEGARIA ───────────────────────────────────────────────────────────────────────────────────
  { frag: "El perro apoya el pecho y los codos", comp: "WorstSpots",
    props: { kicker: "LO QUE LA DIFERENCIA DE UN ESTIRAMIENTO", title: "La postura de plegaria", spots: [
      { label: "Se queda: diez segundos, un minuto, y vuelve a repetirla" },
      { label: "No te mira: mira al suelo, a la pared, a ningún sitio" },
      { label: "Pecho y codos abajo, caderas arriba, sostenido" },
      { label: "Es la única postura que le quita presión al vientre" }] } },
  // ── PRUEBA DE 3 SEGUNDOS ───────────────────────────────────────────────────────────────────────
  { frag: "Cuando veas a tu perro en esa postura", comp: "ProcessChips",
    props: { kicker: "SIN TOCARLO Y SIN LLAMARLO", title: "La prueba de los tres segundos", steps: [
      { title: "Uno" }, { title: "Dos" }, { title: "Tres" },
      { title: "¿Sigue igual? Ya no es un estiramiento" }] } },
  // ── LAS 5 SEÑALES ──────────────────────────────────────────────────────────────────────────────
  { frag: "cinco cosas que suelen acompañarla", comp: "CheckCard",
    props: { kicker: "POSTURA MANTENIDA + CUALQUIERA DE ESTAS = ESA MISMA NOCHE",
      title: "Las cinco que acompañan", items: [
      { text: "La barriga dura, hinchada, o que no te deja tocar" },
      { text: "Respiración rápida estando quieto, sin calor y sin haber caminado" },
      { text: "Arcadas en seco, repetidas, sin que salga nada" },
      { text: "La encía blancuzca o gris en vez de rosa" },
      { text: "No encuentra sitio: se levanta, da vueltas, se echa, se vuelve a levantar" }] } },
  { frag: "Esa frase es medicina", comp: "PullQuote",
    props: { quote: "La diferencia no fue la ciencia ni el dinero. Fue una persona que dijo la frase correcta a tiempo.",
      attrib: "Barón se recuperó. Muchos no." } },
  // ── RIGIDEZ / ARTROSIS ─────────────────────────────────────────────────────────────────────────
  { frag: "Eso tiene nombre y no es la edad", comp: "MythTruth",
    props: { kicker: "LA RIGIDEZ DE LA MAÑANA",
      myth: "Está viejo, se le agarrota el cuerpo.",
      truth: "Es rigidez articular, y detrás casi siempre hay artrosis. La mañana es sólo la punta: debajo hay una articulación que lleva años perdiendo cartílago." } },
  { frag: "se levantan un poco menos", comp: "RayChecklist",
    props: { kicker: "NINGUNA DE ESTAS LLAMA A NADIE POR TELÉFONO", title: "Lo que un perro con dolor DEJA de hacer", items: [
      { text: "Sube al sillón de un salto en vez de dos, y después deja de subir" },
      { text: "Se queda en la alfombra en vez de venir a la cocina" },
      { text: "Duerme donde está más cerca de ti, no donde más le gusta" },
      { text: "Se estira un poco más y se levanta un poco menos" }] } },
  // ── EL SUELO ───────────────────────────────────────────────────────────────────────────────────
  { frag: "Le puse dos alfombras", comp: "RouteFlow",
    props: { kicker: "PASTOR MESTIZO · 11 AÑOS · PISO DE BALDOSA NUEVA", title: "Todo lo que hice, en este orden", steps: [
      { label: "Le miré las uñas de atrás: gastadas en diagonal" },
      { label: "La dueña lo llamó: se plantó en el marco y no pasó" },
      { label: "Dos alfombras de pasillo de las baratas" },
      { label: "Le corté las uñas" }] } },
  { frag: "Le devolví el suelo", comp: "PullQuote",
    props: { quote: "No le di ni un medicamento. Le devolví el suelo.",
      attrib: "A los diez días volvió a entrar a la cocina y se estiraba menos por las mañanas." } },
  // ── AUSENCIA ───────────────────────────────────────────────────────────────────────────────────
  { frag: "Cuando la respuesta es se estira y viene", comp: "RayChecklist",
    props: { kicker: "LA PREGUNTA QUE HAGO SIEMPRE: ¿QUÉ HACE CUANDO USTED LLEGA?", title: "Las tres respuestas, y lo que dice cada una", items: [
      { text: "Se estira y viene · respiro tranquilo" },
      { text: "Levanta la cabeza y me mira · ya escucho distinto" },
      { text: "Sigue echado y mueve la cola sin levantarse · hay algo que buscar" }] } },
  // ── PRÁCTICO ───────────────────────────────────────────────────────────────────────────────────
  { frag: "Cuatro cosas para esta semana", comp: "CheckCard",
    props: { kicker: "TODAS GRATIS Y TODAS EN TU CASA", title: "Cuatro cosas para esta semana", items: [
      { text: "La prueba de los tres segundos, cada vez que lo veas en esa postura" },
      { text: "Mira la mañana: los primeros treinta pasos, siete días seguidos" },
      { text: "El recorrido de las caricias, una vez por semana, mirándole la cara" },
      { text: "Mira la puerta: los diez segundos de cuando llegas" }] } },
  // ── CIERRE ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "Tu perro te habla todos los días", comp: "PullQuote",
    props: { quote: "Tu perro te habla todos los días. Solo que lo hace con el cuerpo y no con palabras, y nadie te había enseñado a mirar.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
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
  const real = REAL[String(m.i)];                        // "fedvet2_pool/fvpool_xxx"
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
  if (real && existe(`broll/${real}.mp4`)) {
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
