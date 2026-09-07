// gen_fedvetdolor_plan.mjs — DIRECTOR → _v3/fedvetdolor_plan.json
//   canal Federer Veterinario · "Los Perros Nunca se Quejan: 10 Señales de Dolor…" · CON AVATAR
//
//   node gen_fedvetdolor_plan.mjs   # momentos (ya anclados al ms) + assets en disco -> plan
//   node build_fedvetdolor.mjs      # plan -> cues + Main + index + _fedvetdolor_assets.txt
//
// ⛔ DIFERENCIA CON fedvet2 (que era narrador puro): acá el AVATAR es el FONDO GARANTIZADO, así que
//    un momento SIN beat no es pantalla plana: es el presentador a cámara. Los momentos listados en
//    AVATAR_FRAGS se dejan A PROPÓSITO sin beat base para que se lo vea (apertura, la presentación,
//    cada "Señal número N" y el cierre). El resto va tapado con b-roll.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ Un componente NO puede comerse el ancla de OTRO componente: la compuerta aborta.
// ⭐ CTA: 3 tarjetas RayCta como OVERLAY (nunca como cue base: sola sobre el fondo = pantalla negra),
//    con el QR REAL de drfederer.com/veterinario. Sin precio: el precio no se dice ni se muestra.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fedvetdolor";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
if (MOM.some((m) => m.t === undefined)) {
  console.error("⛔ los momentos todavía no tienen `t`/`dur`: falta anclar al ms con el ASR del wav real");
  process.exit(1);
}
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);
const REAL = fs.existsSync(`_v3/${SLUG}_real.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_real.json`, "utf8")) : {};

const QR = "img/fedvetdolor_qrcard.png";
const DOM = "drfederer.com/veterinario";

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};

const COMPS = [
  // ── HOOK ───────────────────────────────────────────────────────────────────────────────────────
  { frag: "cuatro meses con dolor", comp: "BigStat",
    props: { value: "4 MESES", unit: "CON DOLOR, TODOS LOS DÍAS", tone: "danger",
      caption: "Y nadie en esa casa lo había notado." } },
  { frag: "nunca se quejó", comp: "PullQuote",
    props: { quote: "Pero si nunca se quejó. Nunca lloró. Nunca me mordió. Nunca me avisó.",
      attrib: "Doña Elvira, en su cocina. Es lo que me dice todo el mundo." } },
  { frag: "es un perro que se muere", comp: "MythTruth",
    props: { kicker: "LO QUE TODO EL MUNDO SUPONE",
      myth: "Si le doliera, se quejaría.",
      truth: "Un perro que se queja en libertad es un perro que se muere: anuncia que ya no puede defenderse. Miles de generaciones seleccionaron a los que aguantaban callados, y esa herencia sigue intacta." } },
  // ── AVISO ──────────────────────────────────────────────────────────────────────────────────────
  { frag: "Ni ibuprofeno", comp: "WorstSpots",
    props: { kicker: "UNA SOLA DOSIS PUEDE BASTAR", title: "Lo que NUNCA hay que darle", spots: [
      { label: "Ibuprofeno — úlceras y riñones" },
      { label: "Paracetamol — le destruye el hígado" },
      { label: "Aspirina — nunca por tu cuenta" },
      { label: "Cualquier analgésico tuyo, aunque sea poquito" }] } },
  // ── SEÑAL 1 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Primero apoya los codos", comp: "ProcessChips",
    props: { kicker: "SEÑAL 1 · CÓMO SE LEVANTA", title: "Tres movimientos donde antes había uno", steps: [
      { title: "Apoya los codos" }, { title: "Sube la parte de adelante" },
      { title: "Se queda sentado a medias" }, { title: "Empuja con las patas de atrás" }] } },
  { frag: "el arranque en frío", comp: "RayChecklist",
    props: { kicker: "SEÑAL 1 · CUÁNDO ES PEOR", title: "El arranque en frío", items: [
      { text: "Peor por la mañana, al levantarse" },
      { text: "Peor después de la siesta" },
      { text: "Peor cuando estuvo un rato largo quieto" },
      { text: "Mejora a los diez o quince minutos caminando — y por eso nadie le da importancia" }] } },
  { frag: "el escalón que dejó de subir", comp: "CheckCard",
    props: { kicker: "SEÑAL 1 · LA VERSIÓN SILENCIOSA", title: "El escalón que dejó de subir", items: [
      { text: "Ya no se sube al sofá donde dormía toda la vida" },
      { text: "Se para delante del auto y espera a que lo cargues" },
      { text: "En la escalera se detiene un segundo antes de empezar" }] } },
  // ── SEÑAL 2 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Un perro tranquilo duerme de costado", comp: "SplitVs",
    props: { leftLabel: "PERRO TRANQUILO", leftValue: "DE COSTADO, PATAS SUELTAS",
      rightLabel: "PERRO CON DOLOR", rightValue: "OVILLO APRETADO O ESFINGE",
      leftImage: "img/fedvetdolor_070.jpg", rightImage: "img/fedvetdolor_071.jpg",
      verdict: "La postura de esfinge sostenida durante horas, en un perro que antes se desparramaba, es una bandera." } },
  { frag: "la postura de plegaria", comp: "WorstSpots",
    props: { kicker: "SEÑAL 2 · TIENE NOMBRE PROPIO EN LOS LIBROS", title: "La postura de plegaria", spots: [
      { label: "Pecho y codos abajo, cadera y cola arriba" },
      { label: "Se SOSTIENE: no se levanta ni viene hacia ti" },
      { label: "No juega, no se acerca, a veces mira al suelo" },
      { label: "Es la postura que le quita presión al vientre" }] } },
  // ── SEÑAL 3 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "no siempre tiene un problema en la piel", comp: "MythTruth",
    props: { kicker: "SEÑAL 3 · SE LAME SIEMPRE EL MISMO SITIO",
      myth: "Se lame la pata, entonces es la piel.",
      truth: "Muchas veces el dolor está DEBAJO, en la articulación, y lamer le da un alivio momentáneo — igual que tú te frotas la rodilla cuando te duele." } },
  { frag: "La regla es simple", comp: "SplitVs",
    props: { leftLabel: "SE LAME POR TODOS LADOS", leftValue: "PIENSA EN PIEL",
      rightLabel: "SIEMPRE EL MISMO PUNTO", rightValue: "PIENSA EN LO QUE HAY DEBAJO",
      leftImage: "img/fedvetdolor_096.jpg", rightImage: "img/fedvetdolor_097.jpg",
      verdict: "Y si DEJÓ de acicalarse y tiene el lomo descuidado, muchas veces es que le duele girarse para llegar ahí." } },
  // ── SEÑAL 4 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Lo que no es normal es un perro que jadea", comp: "CheckCard",
    props: { kicker: "SEÑAL 4 · JADEA SIN MOTIVO", title: "Cuándo el jadeo NO es para refrescarse", items: [
      { text: "Está echado y no hizo nada" },
      { text: "La habitación está fresca" },
      { text: "Es de noche y no encuentra postura" },
      { text: "Se levanta, da vueltas, se echa y vuelve a levantarse" }] } },
  // ── SEÑAL 5 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "cuatro cosas que cambian en la cara", comp: "RayChecklist",
    props: { kicker: "SEÑAL 5 · LA MÁS ÚTIL Y ES GRATIS", title: "La cara del dolor", items: [
      { text: "Los ojos entrecerrados, la mirada a media asta" },
      { text: "Las orejas hacia los costados y quietas" },
      { text: "Una arruga entre los ojos y la boca tirante" },
      { text: "La mirada apagada, fija en un punto" }] } },
  { frag: "Busca una foto de tu perro", comp: "ProcessChips",
    props: { kicker: "HAZLO ESTA SEMANA", title: "El truco de las dos fotos", steps: [
      { title: "Una de hace 3 o 4 años" }, { title: "Una de hoy, de frente" },
      { title: "Las dos juntas" }, { title: "Se ve enseguida" }] } },
  // ── SEÑAL 6 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Pero cambia la manera", comp: "RayChecklist",
    props: { kicker: "SEÑAL 6 · NO CUÁNTO COME: CÓMO", title: "Come igual, pero distinto", items: [
      { text: "Mastica de un solo lado" },
      { text: "Se le caen trozos y los vuelve a agarrar" },
      { text: "Ladea la cabeza para masticar" },
      { text: "Come más despacio, o de repente prefiere el húmedo" }] } },
  { frag: "Levántale el labio esta noche", comp: "ProcessChips",
    props: { kicker: "SÓLO EL LABIO, UN SEGUNDO, SIN ABRIRLE LA BOCA", title: "Qué buscas ahí", steps: [
      { title: "Línea roja en la encía" }, { title: "Sarro marrón grueso" },
      { title: "Olor fuerte" }, { title: "Que se aparte: ésa ya es la respuesta" }] } },
  // ── SEÑAL 7 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "es dolor hasta que se demuestre lo contrario", comp: "PullQuote",
    props: { quote: "Un cambio de carácter en un perro mayor es dolor hasta que se demuestre lo contrario.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
  { frag: "Le llamo el recorrido de las caricias", comp: "RouteFlow",
    props: { kicker: "UNA VEZ POR SEMANA · MIRAS LA CARA, NO LA MANO", title: "El recorrido de las caricias", steps: [
      { label: "El cuello" }, { label: "Los hombros" }, { label: "El lomo" },
      { label: "La cadera" }, { label: "Cada pata" }] } },
  // ── SEÑAL 8 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Cuentas cuántas hace en quince segundos", comp: "RouteFlow",
    props: { kicker: "SEÑAL 8 · SIN TOCARLO Y SIN DESPERTARLO", title: "Cómo se mide", steps: [
      { label: "Dormido y en fresco" }, { label: "Mira el costillar" },
      { label: "Cuenta 15 segundos" }, { label: "Multiplica por 4" }] } },
  { frag: "menos de treinta veces por minuto", comp: "BigStat",
    props: { value: "30", unit: "RESPIRACIONES POR MINUTO, DORMIDO", tone: "danger",
      caption: "Por debajo de 30 está bien (la mayoría anda entre 15 y 25). Por encima de 30 repetido, se consulta. 40 o más, no esperes a la semana que viene." } },
  // ── SEÑAL 9 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Lo que sí se ve, mucho antes", comp: "WorstSpots",
    props: { kicker: "SEÑAL 9 · COJEAR ES EL FINAL, NO EL PRINCIPIO", title: "Cómo se acomoda para no doler", spots: [
      { label: "Una pata apoyada de mentira, sin peso" },
      { label: "Muslos traseros finitos, hombros y pecho macizos" },
      { label: "El lomo arqueado hacia arriba, como una gamba" },
      { label: "La cabeza baja que no sube: gira todo el cuerpo" }] } },
  // ── SEÑAL 10 ───────────────────────────────────────────────────────────────────────────────────
  { frag: "Dejó de salir a recibirte", comp: "CheckCard",
    props: { kicker: "SEÑAL 10 · LAS AUSENCIAS NO MOLESTAN A NADIE", title: "Lo que dejó de hacer", items: [
      { text: "Dejó de salir a recibirte a la puerta" },
      { text: "Dejó de estirarse cuando te ve" },
      { text: "Dejó de sacudirse el cuerpo entero al levantarse" },
      { text: "Dejó de traerte el juguete" },
      { text: "Ya no se sienta recto: se apoya sobre una nalga" }] } },
  { frag: "es un dato clínico", comp: "PullQuote",
    props: { quote: "Doctor, no me acuerdo. — Y esa respuesta, no me acuerdo, es un dato clínico.",
      attrib: "Doña Elvira, cuando le pregunté cuándo fue la última vez que Tobías se subió al sillón." } },
  // ── RESUMEN ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Uno, cómo se levanta", comp: "RayChecklist",
    props: { kicker: "LAS DIEZ · PRIMERA MITAD", title: "De la 1 a la 5", items: [
      { text: "1 · Se levanta por partes, no de una pieza" },
      { text: "2 · Cambió de sitio para dormir, o se quedó encogido" },
      { text: "3 · Se lame siempre el mismo punto y ahí el pelo está manchado" },
      { text: "4 · Jadea echado y en fresco, sobre todo de noche" },
      { text: "5 · La cara: ojos a media asta, orejas de lado, la mirada apagada" }] } },
  { frag: "Seis, come distinto", comp: "CheckCard",
    props: { kicker: "LAS DIEZ · SEGUNDA MITAD", title: "De la 6 a la 10", items: [
      { text: "6 · Come de un lado, despacio, se le cae la comida" },
      { text: "7 · Se puso gruñón, se aparta, se esconde" },
      { text: "8 · Respira dormido más de 30 veces por minuto" },
      { text: "9 · Una pata sin peso, los muslos finitos, el lomo arqueado" },
      { text: "10 · Todo lo que dejó de hacer" }] } },
  // ── CIERRE ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "una sola vida", comp: "PullQuote",
    props: { quote: "Cuídalo mucho, que tiene una sola vida y decidió pasarla contigo.",
      attrib: "— Dr. Federer · Federer Veterinario" } },

  // ── LOS 3 CTA — OVERLAY, con el QR REAL. Sin precio, en pantalla ni en la voz. ─────────────────
  { frag: "Voy a hacer una pausa acá", comp: "RayCta", overlay: true,
    props: { eyebrow: "AHÍ ABAJO, EN LA DESCRIPCIÓN", title: "El Método del Perro Mayor",
      sub: "Las señales, los cuidados caseros con las cantidades según su peso, y las hojas para imprimir.",
      domain: DOM, qr: QR, showQr: true } },
  { frag: "Y ya que hablamos de anotar", comp: "RayCta", overlay: true,
    props: { eyebrow: "LAS HOJAS PARA ANOTAR", title: "Imprímelas y pégalas en la heladera",
      sub: "Los casilleros ya hechos: sólo pones el número y la fecha.",
      domain: DOM, qr: QR, showQr: true } },
  { frag: "Si tu perro ya pasó los ocho años", comp: "RayCta", overlay: true,
    props: { eyebrow: "SI TU PERRO YA PASÓ LOS OCHO", title: "El Método del Perro Mayor",
      sub: "Ordenado por lo que le está pasando hoy. En llano y con letra grande.",
      domain: DOM, qr: QR, showQr: true } },
];

// ── MOMENTOS QUE SE DEJAN AL AVATAR (sin beat base) ──────────────────────────────────────────────
// El avatar es el fondo garantizado: acá se lo ve a él, hablando. Apertura + presentación + cada
// entrada de señal + el cierre. Sin esto el b-roll lo tapa el 100 % del video y el avatar no existe.
const AVATAR_FRAGS = [
  "El martes pasado",                       // apertura: se abre con el avatar hablando
  "Soy el doctor Federer",                  // la presentación
  "Antes de empezar con las diez",
  "Vamos con la primera",
  "Señal número uno",
  "Señal número dos",
  "Señal número tres",
  "Señal número cuatro",
  "Señal número cinco",
  "Señal número seis",
  "Señal número siete",
  "Señal número ocho: la que se mide con un número",
  "Señal número nueve",
  "Señal número diez: lo que dejó de hacer",
  "Te lo resumo para que te quede fácil",
  "Lo que hay que hacer es verlo",
  "Y si esto te sirvió, quédate por acá",
  "Una última cosa antes de irme",
  // beats fuertes del tramo 1 donde el presentador hablando gana a una foto:
  "Y ese es exactamente el problema",
  "Pero hay una buena noticia",
  "Hoy te voy a dar las diez señales",
  "Si te sirve lo que hacemos aquí, suscríbete",
  "No cuántas veces se levanta",
  "Los perros son animales de costumbre feroz",
  "Esta es de las que más me sirven",
  "Así que si hoy reconoces alguna de estas señales",
];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
// ⛔⛔ AGNES REDIBUJA LA ESCENA ANTES DEL PRIMER SEGUNDO: en los clips fallados sólo el frame 0 es
//    fiel. NO alcanza con recortar: el clip se descarta entero y el momento vuelve a la FOTO.
const REDIBUJADO = new Set(fs.existsSync(`_v3/${SLUG}_redibujados.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_redibujados.json`, "utf8")) : []);

const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla COLISIONADA`); process.exit(1); }

// ⛔ EL AVATAR SÓLO SE MUESTRA EN EL TRAMO 1. Después de la costura el video corre con la voz de
//    Fish y el avatar va en BUCLE muteado: si se lo deja a la vista, la boca no coincide con lo que
//    se oye. En la cola el b-roll cubre el 100 % y el bucle queda sólo de piso.
const COSTURA = JSON.parse(fs.readFileSync(`_v3/${SLUG}_costura.json`, "utf8"));
const AVATAR_END = COSTURA.corte_parrafo_ms / 1000;
const AVATAR_I = new Set();
let fueraDeTramo1 = 0;
for (const f of AVATAR_FRAGS) {
  const k = buscar(f);
  if (k < 0) { console.error(`⛔ ancla de avatar no encontrada: "${f}"`); process.exit(1); }
  if (anclas.has(k)) { console.error(`⛔ el momento ${k} es a la vez ancla de componente y de avatar: "${f}"`); process.exit(1); }
  if (MOM[k].t + MOM[k].dur > AVATAR_END) { fueraDeTramo1++; continue; }
  AVATAR_I.add(k);
}
console.log(`avatar a la vista: ${AVATAR_I.size} momentos dentro del tramo 1 (${AVATAR_END.toFixed(0)}s) · ${fueraDeTramo1} descartados por caer en la cola`);

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const overlaysOut = [];
let absorbidos = 0, reales = 0, avatarBeats = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const img = `img/${SLUG}_${String(m.i).padStart(3, "0")}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${String(m.i).padStart(3, "0")}.mp4`;
  const real = REAL[String(m.i)];
  const c = compAt.get(i);

  if (c && c.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
    // el momento del CTA sigue su curso normal abajo (el overlay va ENCIMA, no reemplaza la base)
  }
  const cBase = compAt.get(i);
  if (cBase && !cBase.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(cBase.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    const comidos = [];
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      if (anclas.has(j)) { console.error(`⛔ el componente ${cBase.comp} (momento ${i}) absorbe el ancla del componente en el momento ${j}. Movelo de frase.`); process.exit(1); }
      if (AVATAR_I.has(j)) { console.error(`⛔ el componente ${cBase.comp} (momento ${i}) se come el momento ${j}, que estaba reservado para el AVATAR. Movelo de frase.`); process.exit(1); }
      MOM[j].__skip = true; comidos.push(j);
    }
    // ⛔ el estirón "hasta el próximo beat" deja tarjetas de 18 s: si el último momento comido tiene
    //    COLA más allá del piso de lectura, esa cola RECUPERA su propio plano (arranca en `out`).
    const ult = comidos[comidos.length - 1];
    let colaDe = null;
    if (ult !== undefined && MOM[ult].t + MOM[ult].dur > out + 2) { colaDe = ult; MOM[ult].__skip = false; MOM[ult].__desde = out; }
    if (colaDe === null) {
      const sig = MOM.find((x) => x.t >= out && !x.__skip && !AVATAR_I.has(x.i));
      if (sig) out = Math.max(out, sig.t);
    }
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: cBase.comp, props: { ...cBase.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  // ── momento reservado al AVATAR: NO se emite beat base, se ve al presentador ───────────────────
  if (AVATAR_I.has(i)) { avatarBeats++; continue; }

  const ms_in = Math.round((m.__desde ?? m.t) * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);

  // 1) METRAJE REAL primero (auditado con visión): es lo que evita que el video "se sienta vacío"
  if (real && existe(`broll/${real}.mp4`)) {
    const rd = durDe(`broll/${real}.mp4`);
    const usable = rd - 0.15;
    const largoR = (ms_out - ms_in) / 1000;
    reales++;
    // mismo criterio anti-metrónomo: el momento largo se parte y la 2ª mitad va a la foto del momento
    if (largoR > 6.5) {
      const corte = ms_in + Math.round((ms_out - ms_in) * 0.55);
      const dC = (corte - ms_in) / 1000;
      if (dC <= usable) beats.push({ tipo: "clip", ms_in, ms_out: corte, clip: real });
      else beats.push({ tipo: "clipslow", ms_in, ms_out: corte, rate: Math.min(1, Math.max(0.45, usable / dC)), clip: real });
      beats.push({ tipo: "imagen", ms_in: corte, ms_out, imagen: `${SLUG}_${String(m.i).padStart(3, "0")}` });
      continue;
    }
    if (largoR <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: real });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / largoR)), clip: real });
    continue;
  }

  // 2) el clip animado con agnes, si no salió redibujado
  const cd = (existe(clip) && !REDIBUJADO.has(m.i)) ? durDe(clip) : 0;
  const rel = `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}`;
  const nombreImg = `${SLUG}_${String(m.i).padStart(3, "0")}`;
  const largoS = (ms_out - ms_in) / 1000;

  // ⛔⛔ EL METRÓNOMO ES ESTRUCTURAL: con UN plano por momento la mediana daba 5,2 s y el p75 7,5 s —
  //    todo largo y todo parejo. Los momentos largos se PARTEN en dos planos, y la 2ª mitad repite
  //    EL MISMO asset en la OTRA forma (clip -> foto): mismo sujeto, otra lectura. Nunca el objeto
  //    del momento vecino (ése es el desfase de `cmetemu`, 22 de 52 planos fuera de contexto).
  if (largoS > 6.5 && cd > 0.8) {
    const corte = ms_in + Math.round((ms_out - ms_in) * 0.55);
    const durClip = (corte - ms_in) / 1000;
    const usable = cd - 0.15;
    if (durClip <= usable) beats.push({ tipo: "clip", ms_in, ms_out: corte, clip: rel });
    else beats.push({ tipo: "clipslow", ms_in, ms_out: corte, rate: Math.min(1, Math.max(0.45, usable / durClip)), clip: rel });
    beats.push({ tipo: "imagen", ms_in: corte, ms_out, imagen: nombreImg });
    continue;
  }

  if (cd > 0.8) {
    const usable = cd - 0.15;
    if (largoS <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: rel });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / largoS)), clip: rel });
  } else {
    // 3) foto con Ken-Burns (se ve MÁS fluida que el movimiento horneado)
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: nombreImg });
  }
}

// ── CIERRE DE HUECOS: sólo entre beats CONTIGUOS. Los huecos de avatar se respetan (ahí se lo ve).
beats.sort((a, b) => a.ms_in - b.ms_in);
const huecosAvatar = [];
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : Math.round((TOTAL_S + 1.2) * 1000);
  const hueco = sig - beats[i].ms_out;
  if (hueco <= 0) { beats[i].ms_out = sig; continue; }
  if (hueco < 900) { beats[i].ms_out = sig; continue; }   // microhueco: lo tapa el vecino
  huecosAvatar.push(+(hueco / 1000).toFixed(2));           // hueco real = el presentador a cámara
}

const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysOut };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
const segAvatar = huecosAvatar.reduce((a, b) => a + b, 0);
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`metraje REAL en ${reales} beats (${(100 * reales / beats.length).toFixed(0)} % del video)`);
console.log(`overlays: ${overlaysOut.length} · componentes distintos: ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size}`);
console.log(`AVATAR a la vista: ${huecosAvatar.length} tramos · ${segAvatar.toFixed(0)}s (${(100 * segAvatar / TOTAL_S).toFixed(0)} % del video) · momentos reservados ${avatarBeats}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
