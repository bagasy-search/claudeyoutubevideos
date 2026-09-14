// gen_fcspellizco_plan.mjs — DIRECTOR → _v3/fcspellizco_plan.json
//   canal Federer Consejos Salud · "Si te PELLIZCAS el Cuello y se Queda Así…" · AVATAR PROPIO (AvatarForever FP8)
//
//   node gen_fcspellizco_plan.mjs     # momentos (ya anclados al ms) + assets en disco -> plan
//   node build_fcspellizco.mjs        # plan -> cues + Main + index + avatar_fcspellizco.gen.ts + assets
//
// ⛔ AVATAR POR VENTANAS (feedback_avatar_full_cada_30s_frases_clave): el avatar NO es fondo. Se ve SÓLO en
//    los momentos de AVATAR_FRAGS (frases clave), full-frame, y AvatarForever renderiza sólo esas ventanas.
//    Regla del creador: hueco máximo ~30 s entre dos apariciones, y en las frases MÁS importantes.
//    La compuerta de 30 s la corre el build (mide sobre frames reales).
// ⛔ Un momento sin beat base = avatar a la vista. Por eso TODO momento que no es de avatar lleva beat.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino.
// ⭐ CTA: RayCta como OVERLAY con el QR REAL de drfederer.com. Sin precio.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fcspellizco";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8", timeout: 30000 }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
if (MOM.some((m) => m.t === undefined)) {
  console.error("⛔ los momentos todavía no tienen `t`/`dur`: falta anclar al ms con el ASR del máster");
  process.exit(1);
}
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);
const REAL = fs.existsSync(`_v3/${SLUG}_real.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_real.json`, "utf8")) : {};

const QR = "img/fcspellizco_qrcard.png";
const DOM = "drfederer.com";

const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};

// ── COMPONENTES: anclados por FRASE. Contratos REALES de src/fcsclv/ (mismos que fcstaza9):
// CheckCard/RayChecklist -> items[].text · ProcessChips -> steps[].title · RouteFlow -> steps[].label ·
// WorstSpots -> spots[].label · CrossSection -> labels[].text · BigStat -> value/unit/caption/tone ·
// MythTruth -> myth/truth/kicker · SplitVs -> left/rightLabel+Value/verdict · PullQuote -> quote/attrib ·
// VetSenal -> n/title/tone · RayCta -> eyebrow/title/sub/domain/qr/showQr
const COMPS = [
  // ── HOOK ────────────────────────────────────────────────────────────────────────────────────
  { frag: "no siempre te está diciendo lo mismo", comp: "WorstSpots",
    props: { kicker: "TU PELLIZCO PUEDE DECIR TRES COSAS", title: "El pliegue que se queda parado",
      spots: [{ label: "Algo que ya no tiene regreso" }, { label: "Algo que todavía puedes frenar" },
        { label: "Algo que hay que atender hoy" }] } },
  { frag: "Tiene casi doscientos años", comp: "BigStat",
    props: { value: "~200 AÑOS", unit: "TIENE LA PRUEBA DEL PELLIZCO",
      caption: "Y después de los sesenta, en cierto sentido, esta prueba miente." } },
  { frag: "Cinco señales en el cuello", comp: "VetSenal", overlay: true,
    props: { n: "5", title: "SEÑALES DE MÉDICO · AL FINAL", tone: "danger" } },
  // ── DOÑA REBECA ─────────────────────────────────────────────────────────────────────────────
  { frag: "Mi nieta me enseñó un video", comp: "PullQuote",
    props: { quote: "Se queda así, doctor. Yo tomo agua, y me sigue quedando parada.",
      attrib: "Doña Rebeca, 68 años. Treinta años con un puesto de fruta en el tianguis." } },
  // ── EL CÓLERA Y EL NIÑO ─────────────────────────────────────────────────────────────────────
  { frag: "una enfermedad que se llamaba el cólera", comp: "BigStat",
    props: { value: "DÉCADA DE 1830", unit: "EL CÓLERA LLEGA A MÉXICO",
      caption: "Sin laboratorio ni análisis: los médicos medían el agua del cuerpo con dos dedos." } },
  { frag: "Como papel mojado que se secó arrugado", comp: "SplitVs",
    props: { leftLabel: "PIEL SANA", leftValue: "REGRESA AL INSTANTE",
      rightLabel: "PIEL SIN AGUA", rightValue: "SE QUEDA PARADA",
      verdict: "Así nació la prueba del pliegue: en los enfermos de cólera." } },
  { frag: "Pero ahora piensa en un cuello de setenta años", comp: "SplitVs",
    props: { leftLabel: "EN UN NIÑO", leftValue: "SÓLO PUEDE SER EL AGUA",
      rightLabel: "A LOS SETENTA", rightValue: "AGUA O RESORTE GASTADO",
      verdict: "La prueba no los distingue: nomás te dice que no regresó." } },
  { frag: "Miente porque la hicieron para una piel", comp: "PullQuote",
    props: { quote: "No miente porque sea mala. Miente porque la hicieron para una piel que tú ya no tienes.",
      attrib: "— Dr. Federer" } },
  // ── LA ELASTINA ─────────────────────────────────────────────────────────────────────────────
  { frag: "Se llama elastina.", comp: "BigStat",
    props: { value: "ELASTINA", unit: "EL RESORTE DE TU PIEL",
      caption: "No es el colágeno. Es su prima, la que nadie nombra." } },
  { frag: "Esas son el colágeno.", comp: "CrossSection",
    props: { title: "Debajo de la piel que ves", caption: "Dos fibras, dos trabajos distintos",
      labels: [{ text: "Colágeno: cuerdas gruesas que aguantan" }, { text: "Elastina: ligas delgadas que regresan" },
        { text: "Si no regresa, falla la liga, no la cuerda" }] } },
  { frag: "la fabricaste de chiquito", comp: "RouteFlow",
    props: { kicker: "LA FÁBRICA DE LIGAS", title: "Se hace una sola vez en la vida",
      steps: [{ label: "Bebé y niño: la fábrica a todo" }, { label: "Terminas de crecer: se apaga" },
        { label: "De adulto: lo nuevo sale chueco" }] } },
  { frag: "tarda como setenta años en renovarse", comp: "BigStat",
    props: { value: "~70 AÑOS", unit: "TARDA EN RENOVARSE LA MITAD DE TU ELASTINA",
      caption: "Las ligas de tu cuello son, casi todas, las mismas que tenías a los doce años." } },
  { frag: "ninguna pastilla, ninguna agua", comp: "MythTruth",
    props: { kicker: "LO QUE TE VAN A VENDER",
      myth: "Tómate esto y te regresa la elasticidad.",
      truth: "Lo que ya se rompió de ligas no lo regresa ningún polvo ni pastilla. Lo que sí se puede es dejar de romper lo que queda." } },
  // ── DON ANSELMO ─────────────────────────────────────────────────────────────────────────────
  { frag: "Mismo señor. Mismo cuello. Misma edad.", comp: "SplitVs",
    props: { leftLabel: "LA NUCA, AL SOL", leftValue: "DURA Y EN ROMBOS",
      rightLabel: "BAJO LA BARBILLA, EN LA SOMBRA", rightValue: "LISA Y DELGADITA",
      verdict: "Mismo señor, misma edad, setenta y cinco años. Lo único distinto: el sol." } },
  { frag: "Se llama piel romboidal de la nuca", comp: "BigStat",
    props: { value: "ROMBOS", unit: "PIEL ROMBOIDAL DE LA NUCA",
      caption: "Clásica de campesinos, marineros y albañiles: años de sol con la cabeza agachada." } },
  { frag: "elastosis solar", comp: "ProcessChips",
    props: { kicker: "LO QUE HACE EL SOL", title: "Elastosis solar",
      steps: [{ title: "El sol rompe las ligas" }, { title: "La piel intenta reponerlas" },
        { title: "Le salen chuecas, hechas bola" }, { title: "Ocupan lugar pero no regresan" }] } },
  // ── TU CUELLO Y EL SOL ──────────────────────────────────────────────────────────────────────
  { frag: "Como si ahí se acabara la persona", comp: "PullQuote",
    props: { quote: "El bloqueador se detiene en la quijada. Como si ahí se acabara la persona.",
      attrib: "Y el cuello queda afuera, de frente al sol, cada vez que volteas." } },
  { frag: "está más dañado que el derecho", comp: "SplitVs",
    props: { leftLabel: "EL LADO DE LA VENTANA", leftValue: "MÁS MANCHA Y FLACIDEZ",
      rightLabel: "EL OTRO LADO", rightValue: "MENOS DAÑO",
      verdict: "El vidrio del coche deja pasar el sol que no quema, y es el que llega más hondo." } },
  { frag: "es mucho más delgada que la de la cara", comp: "WorstSpots",
    props: { kicker: "POR QUÉ EL CUELLO SE VE PEOR QUE LA CARA", title: "Tres desventajas",
      spots: [{ label: "Piel más delgada y con menos grasa" }, { label: "Se dobla y se estira miles de veces al día" },
        { label: "No tiene hueso atrás que la sostenga" }] } },
  // ── CIGARRO Y AZÚCAR ────────────────────────────────────────────────────────────────────────
  { frag: "se llaman elastasas", comp: "CrossSection",
    props: { title: "Las tijeras del cigarro", caption: "Elastasas: enzimas que cortan elastina",
      labels: [{ text: "El humo alborota a las células de defensa" }, { text: "Sueltan tijeras de más" },
        { text: "Y apaga el freno natural del cuerpo" }, { text: "Cortan ligas en el pulmón y en la piel" }] } },
  { frag: "las tijeras se calman", comp: "PullQuote",
    props: { quote: "Lo que se cortó, se cortó. Pero dejan de cortar.",
      attrib: "Dejar el cigarro a los sesenta y cinco le sigue ahorrando ligas a tu cuello." } },
  { frag: "El azúcar en la sangre, cuando anda alta", comp: "ProcessChips",
    props: { kicker: "EL TERCER LADRÓN", title: "El azúcar alta",
      steps: [{ title: "Se pega a cuerdas y ligas" }, { title: "Las suelda" }, { title: "La liga soldada ya no estira" }] } },
  { frag: "Su cuello no estaba deshidratado", comp: "MythTruth",
    props: { kicker: "LO QUE DECÍA EL VIDEO DE LA NIETA",
      myth: "Si la piel se queda parada, estás deshidratado.",
      truth: "Doña Rebeca no estaba seca: tenía treinta años de sol de tianguis en el cuello." } },
  // ── LA PRUEBA DE LOS TRES PELLIZCOS ─────────────────────────────────────────────────────────
  { frag: "No la hagas recién salido de bañarte", comp: "RayChecklist",
    props: { kicker: "ANTES DE PELLIZCARTE", title: "Cómo se hace bien",
      items: [{ text: "Piel seca, sin crema recién puesta" }, { text: "Con la yema de los dedos, no con las uñas" },
        { text: "La levantas poquito y la sueltas de golpe" }, { text: "Cuentas despacio, y dos veces en cada lugar" }] } },
  { frag: "Lugar número uno", comp: "VetSenal", overlay: true, props: { n: "1", title: "EL LADO DEL CUELLO" } },
  { frag: "Lugar número dos", comp: "VetSenal", overlay: true, props: { n: "2", title: "ABAJO DE LA BARBILLA" } },
  { frag: "Y lugar número tres", comp: "VetSenal", overlay: true, props: { n: "3", title: "EL ESTERNÓN O LA FRENTE" } },
  { frag: "En el esternón, mide agua", comp: "SplitVs",
    props: { leftLabel: "EN EL CUELLO", leftValue: "MIDE LIGAS",
      rightLabel: "EN EL ESTERNÓN", rightValue: "MIDE AGUA",
      verdict: "Ahí la piel está pegadita al hueso y casi no se gasta con los años." } },
  { frag: "Grupo uno.", comp: "VetSenal", overlay: true, props: { n: "1", title: "EDAD PAREJA" } },
  { frag: "Grupo dos.", comp: "VetSenal", overlay: true, props: { n: "2", title: "DAÑO DE SOL" } },
  { frag: "Y grupo tres.", comp: "VetSenal", overlay: true, props: { n: "3", title: "PUEDE SER AGUA", tone: "danger" } },
  { frag: "No porque recupere", comp: "PullQuote",
    props: { quote: "No porque recupere. Porque el otro siguió perdiendo.",
      attrib: "El grupo dos es el que más puede hacer, desde mañana." } },
  { frag: "¿Tienes la boca seca?", comp: "CheckCard",
    props: { kicker: "SI EL ESTERNÓN SE QUEDÓ PARADO", title: "Revisa además",
      items: [{ text: "Boca seca de verdad" }, { text: "Axilas completamente secas" },
        { text: "Poca orina, y oscura" }, { text: "Mareo al levantarte" }, { text: "Confusión, o más dormido que de costumbre" }] } },
  { frag: "Vas al médico hoy", comp: "VetSenal", overlay: true,
    props: { n: "!", title: "CONFUSIÓN O MAREO FUERTE: AL MÉDICO HOY", tone: "danger" } },
  { frag: "Lo que llamamos insuficiencia cardiaca", comp: "WorstSpots",
    props: { kicker: "NO FUERCES EL AGUA SIN TU MÉDICO", title: "Si tienes",
      spots: [{ label: "El corazón cansado: insuficiencia cardiaca" }, { label: "Los riñones muy enfermos o diálisis" },
        { label: "Cirrosis" }] } },
  { frag: "Usted no está seca. Usted está asoleada", comp: "PullQuote",
    props: { quote: "Doña Rebeca, usted no está seca. Usted está asoleada.",
      attrib: "— Dr. Federer, en la consulta" } },
  { frag: "el sodio bajo, en una señora mayor", comp: "CheckCard",
    props: { kicker: "AGUA A LA FUERZA + PASTILLA QUE TE HACE ORINAR", title: "El sodio bajo se ve como",
      items: [{ text: "Cansancio y dolor de cabeza" }, { text: "Náusea" }, { text: "Confusión" },
        { text: "Caídas o convulsiones, en casos fuertes" }] } },
  // ── QUÉ HACER ───────────────────────────────────────────────────────────────────────────────
  { frag: "el cuello existe", comp: "BigStat",
    props: { value: "EL CUELLO", unit: "TAMBIÉN LLEVA BLOQUEADOR",
      caption: "Los lados del cuello, y la nuca si traes el pelo corto o recogido." } },
  { frag: "que diga que es de amplio espectro", comp: "RayChecklist",
    props: { kicker: "EL BLOQUEADOR", title: "Qué buscar",
      items: [{ text: "Amplio espectro: el sol que quema y el que no" }, { text: "Sencillo, de farmacia" },
        { text: "Hasta el cuello y la nuca" }, { text: "Otra vez al mediodía, si sudas" }] } },
  { frag: "El sombrero de ala ancha", comp: "CheckCard",
    props: { kicker: "LA SOMBRA ES GRATIS", title: "Sin gastar un peso",
      items: [{ text: "Sombrero de ala que da la vuelta completa" }, { text: "Paliacate, rebozo o el cuello de la camisa" },
        { text: "La banqueta de la sombra" }, { text: "Salir temprano, o ya en la tarde" }] } },
  { frag: "que se llaman retinoides", comp: "SplitVs",
    props: { leftLabel: "LO QUE SÍ HACEN", leftValue: "MENOS ARRUGA Y MANCHA",
      rightLabel: "LO QUE NO", rightValue: "NO DEVUELVEN LAS LIGAS",
      verdict: "Son de receta, irritan al principio y piden bloqueador. Se hablan con el dermatólogo." } },
  { frag: "esto no repara las ligas", comp: "MythTruth",
    props: { kicker: "LA CREMA HUMECTANTE",
      myth: "La crema me regresa la firmeza del cuello.",
      truth: "Hidrata la capa de arriba y se ve más lisa. A las ligas no llega." } },
  { frag: "La elastina de un frasco no llega", comp: "BigStat",
    props: { value: "NO LLEGA", unit: "LA ELASTINA DE UN FRASCO A TU CUELLO", tone: "danger",
      caption: "No atraviesa la piel, y comida se digiere como cualquier proteína. Gasta ese dinero en bloqueador." } },
  // ── EL ERROR: EL LIMÓN ──────────────────────────────────────────────────────────────────────
  { frag: "Sí. El limón.", comp: "VetSenal", overlay: true,
    props: { n: "!", title: "EL ERROR: LIMÓN EN EL CUELLO", tone: "danger" } },
  { frag: "Que la piel se aprieta", comp: "MythTruth",
    props: { kicker: "LO QUE SIENTES",
      myth: "Si se siente tirante, está funcionando.",
      truth: "Es el ácido resecando la capa de arriba. A la media hora se te pasa." } },
  { frag: "que se llaman furocumarinas", comp: "ProcessChips",
    props: { kicker: "LIMÓN + SOL", title: "La quemadura que no se siente",
      steps: [{ title: "El jugo se queda en la piel" }, { title: "Le da el sol que no quema" },
        { title: "Se activa y quema por dentro" }, { title: "Queda una mancha café por meses" }] } },
  { frag: "le echó sol encima con lupa", comp: "PullQuote",
    props: { quote: "Quería apretar el cuello, y le echó sol encima con lupa.",
      attrib: "— Dr. Federer" } },
  { frag: "tardaron casi siete meses en irse", comp: "BigStat",
    props: { value: "7 MESES", unit: "TARDARON EN IRSE LAS MANCHAS DE DOÑA CHAYO", tone: "danger",
      caption: "Una semana de limón en el cuello, antes de salir a regar las plantas." } },
  { frag: "lo mismo te digo de la lima", comp: "WorstSpots",
    props: { kicker: "EN LA PIEL Y AL SOL, NO", title: "Hacen lo mismo que el limón",
      spots: [{ label: "La lima" }, { label: "La naranja agria y la toronja" }, { label: "El apio y el perejil en mascarilla" }] } },
  // ── LAS CINCO SEÑALES ───────────────────────────────────────────────────────────────────────
  { frag: "Una. Una bolita", comp: "VetSenal", overlay: true, props: { n: "1", title: "UN BULTO NUEVO", tone: "danger" } },
  { frag: "Dos. Que el cuello se te haya aflojado", comp: "VetSenal", overlay: true, props: { n: "2", title: "BAJAR DE PESO SIN QUERER", tone: "danger" } },
  { frag: "Tres. Que el cuello se hinche", comp: "VetSenal", overlay: true, props: { n: "3", title: "LA TIROIDES", tone: "danger" } },
  { frag: "Cuatro. Que la piel se haya puesto delgadita", comp: "VetSenal", overlay: true, props: { n: "4", title: "PIEL DE PAPEL Y MORETONES", tone: "danger" } },
  { frag: "Y cinco. La que te dije", comp: "VetSenal", overlay: true, props: { n: "5", title: "PIEL DURA QUE NO SE DEJA PELLIZCAR", tone: "danger" } },
  { frag: "puede ser una enfermedad de las defensas", comp: "MythTruth",
    props: { kicker: "AL REVÉS DE TODO EL VIDEO",
      myth: "Piel tirante es buena noticia: tengo la piel firme.",
      truth: "Una piel que se endurece y ya no se deja pellizcar puede ser una enfermedad de las defensas. Entre más temprano la ve un reumatólogo, mejor." } },
  // ── CIERRE ──────────────────────────────────────────────────────────────────────────────────
  { frag: "El pellizco del cuello, después de los sesenta, no mide agua", comp: "ProcessChips",
    props: { kicker: "TODO EL VIDEO EN TRES COSAS", title: "Para repetirlo mañana",
      steps: [{ title: "En el cuello mide ligas; en el pecho, agua" },
        { title: "Lado del cuello contra la barbilla: esa diferencia es el sol" },
        { title: "Limón en la comida, nunca en el cuello" }] } },
  // ── CTA — OVERLAY con el QR REAL. Sin precio, ni en pantalla ni en la voz. ──────────────────
  { frag: "primer renglón de la descripción", comp: "RayCta", overlay: true,
    props: { eyebrow: "AHÍ ABAJO, EN LA DESCRIPCIÓN", title: "La prueba de los tres pellizcos y la rutina del cuello",
      sub: "Cómo leer tu pellizco, la rutina paso a paso, qué pedirle a tu médico y las señales para no dejar pasar.",
      domain: DOM, qr: QR, showQr: true } },
];

// ── MOMENTOS DEL AVATAR (sin beat base): ventanas full-frame que renderiza AvatarForever ─────────
// Frases clave: preguntas al espectador, revelaciones, advertencias, giros de historia y el cierre.
const AVATAR_FRAGS = [
  "Pellízcate el cuello. Ahorita",            // abre con el avatar hablando (regla 1.bis)
  "Y la mayoría de la gente no sabe distinguir",
  "Entonces hoy te voy a enseñar a leerlo",
  "Soy el doctor Federer",
  "Ahora. Te tengo que decir dos cosas",
  "Ese error te lo cuento al final",
  "Y te pido una sola cosa",
  "Te voy a contar de una señora",
  "Estaba midiendo otra cosa",
  "¿Por qué funciona en un niño?",
  "Por eso te digo que después de los sesenta",
  "Y te la voy a explicar con algo que tienes en tu casa",
  "Bueno. Tu piel tiene ligas",
  "¿quién está fallando?",
  "Y aquí viene la parte que a mí",
  "Te lo digo de frente",
  "Y te contesto con la otra mitad",
  "te voy a llevar al campo",
  "Y ahí conocí a don Anselmo",
  "¿Qué cambiaba de un lado al otro?",
  "Y aquí me tienes que seguir tantito",
  "fíjate por qué te conté lo de don Anselmo",
  "¿Y en el cuello?",
  "¿Tú manejas?",
  "A lo mejor te llevas una sorpresa",
  "Y eso sí es injusto",
  "No te voy a regañar",
  "Y aquí va la parte buena",
  "regresemos con doña Rebeca",
  "¿Qué hice con doña Rebeca?",
  "Vamos a hacerla juntos",
  "¿Listo? Ahí vamos",
  "¿Por qué ahí?",
  "A ver en cuál quedas tú",
  "Si tú quedaste aquí, te felicito",
  "Y a este préstale atención",
  "Y quiero que te hagas otras preguntas",
  "si tomara agua a la fuerza, se haría daño",
  "Yo no te conozco",
  "Y ella se me quedó viendo",
  "Así que ese día, a doña Rebeca",
  "Y te voy a decir lo mismo que le dije a ella",
  "Suena tonto, ya sé",
  "Nuestros abuelos del campo",
  "El mejor bloqueador es el que te pones todos los días",   // el relleno no encontraba hueco entre 2016 y 2051 s
  "Y te voy a contestar como médico",
  "Llegó el momento. El error",
  "Hay una receta que corre muchísimo",
  "Pero eso, eso es lo de menos",
  "fíjate la trampa",
  "Y te voy a contar cómo lo supe yo",
  "Así que, de corazón",
  "La gente piensa que la piel tirante es buena noticia",
  "Vamos cerrando",
  "Y te pido dos cosas",
  "Y la segunda: si mientras me oías",
  "Cuídate mucho",
];

// ── BEATS ──────────────────────────────
// ⛔ pacing medido: con 6,5 s la mediana de planos daba 7,2 s y el p75 10,9 s (regla: 3,5-4,5 / ~40 % ≥5 s).
//    Partir desde 4,8 s: la 2ª mitad repite el MISMO asset en la otra forma (clip→foto). No mueve las ventanas del avatar.
const PARTIR_S = 4.8;
const CLIP_DIR = `broll/${SLUG}`;
const REDIBUJADO = new Set(fs.existsSync(`_v3/${SLUG}_redibujados.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_redibujados.json`, "utf8")) : []);
const GENTE = new Set(fs.existsSync(`_v3/${SLUG}_haygente.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_haygente.json`, "utf8")) : []);

const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { if (anclas.has(k)) console.error(`⛔ ancla COLISIONADA en el momento ${k}: "${c.frag}"`); compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla colisionada`); process.exit(1); }

const AVATAR_I = new Set();
const avatarChoca = [];
// ⛔ sólo un componente BASE tapa al avatar: un overlay (VetSenal, RayCta) flota ENCIMA del presentador.
// Si la frase de avatar cae en el momento de un componente base, se corre al vecino libre más cercano
// (antes y después), en vez de perder la aparición: el choque costaba 7 apariciones en este guion.
const anclasBaseComp = new Set([...compAt].filter(([, c]) => !c.overlay).map(([k]) => k));
const movidas = [];
for (const f of AVATAR_FRAGS) {
  const k = buscar(f);
  if (k < 0) { console.error(`⛔ ancla de avatar no encontrada: "${f}"`); process.exit(1); }
  if (!anclasBaseComp.has(k)) { AVATAR_I.add(k); continue; }
  const libre = [k - 1, k + 1].find((j) => j > 0 && j < MOM.length && !anclasBaseComp.has(j) && !AVATAR_I.has(j));
  if (libre === undefined) { avatarChoca.push(f); continue; }
  AVATAR_I.add(libre);
  movidas.push(`${k}→${libre}`);
}
if (movidas.length) console.log(`anclas de avatar corridas al momento vecino por chocar con un componente base: ${movidas.join(" · ")}`);

// ── RELLENO DE CONEXIÓN (regla del creador: nunca >30 s sin el presentador) ─────────────────────────
// Medido en la 1ª corrida: con 56 frases a mano quedaban 31 tramos >30 s (hasta 220 s) y el avatar al 11 %.
// Se agregan momentos de avatar dentro de cada hueco hasta que ninguno pase GAP_OBJ, eligiendo la frase que
// MÁS pide la cara (arranque de sección, pregunta, hablarle al espectador) cerca de la mitad del hueco.
// No se eligen: anclas de componente, momentos con metraje real, ni momentos que un componente base absorbe.
{
  const GAP_OBJ = 26;
  const bloqueados = new Set();
  const pisoDe = (c) => Math.min(13, 2.8 + 0.28 * Math.max(0, palabrasPre(c.props) - 3));
  function palabrasPre(p) {
    return Object.values(p).flatMap((v) => typeof v === "string" ? v.split(/\s+/)
      : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;
  }
  for (const [k, c] of compAt) {
    if (c.overlay) continue;
    bloqueados.add(k);
    const fin = MOM[k].t + Math.max(MOM[k].dur, pisoDe(c));
    for (let j = k + 1; j < MOM.length && MOM[j].t < fin; j++) bloqueados.add(j);
  }
  const puntaje = (m, j) => {
    let s = 0;
    if (j > 0 && MOM[j - 1].sec !== m.sec) s += 3;
    if (m.txt.includes("?")) s += 2;
    if (/\b(tú|te|tu|ti|contigo|fíjate|mira|escúchame|ahorita)\b/i.test(m.txt)) s += 1;
    if (m.dur >= 3 && m.dur <= 8) s += 1;
    return s;
  };
  const agregados = [];
  const imposibles = new Set();   // huecos sin candidato: se anotan y se sigue con los demás (antes cortaba TODO)
  let conReal = 0;
  for (let vuelta = 0; vuelta < 600; vuelta++) {
    const marcas = [...AVATAR_I].map((i) => ({ a: MOM[i].t, z: MOM[i].t + MOM[i].dur })).sort((x, y) => x.a - y.a);
    const huecos = [];
    let prevZ = 0;
    for (const w of marcas) { if (w.a - prevZ > GAP_OBJ) huecos.push({ a: prevZ, z: w.a }); prevZ = Math.max(prevZ, w.z); }
    if (TOTAL_S - prevZ > GAP_OBJ + 12) huecos.push({ a: prevZ, z: TOTAL_S - 12 });
    const pendientes = huecos.filter((h) => !imposibles.has(h.a.toFixed(1))).sort((x, y) => (y.z - y.a) - (x.z - x.a));
    if (!pendientes.length) break;
    const peor = pendientes[0];
    const mitad = (peor.a + peor.z) / 2;
    const base = (m, j) => m.t > peor.a + 4 && m.t + m.dur < peor.z - 4 && !AVATAR_I.has(j) && !bloqueados.has(j) && !anclas.has(j);
    let cands = MOM.map((m, j) => ({ m, j })).filter(({ m, j }) => base(m, j) && !REAL[String(m.i)]);
    // sin otro remedio, la CARA gana al metraje de stock: un minuto sin el presentador pierde la conexión
    if (!cands.length) { cands = MOM.map((m, j) => ({ m, j })).filter(({ m, j }) => base(m, j)); if (cands.length) conReal++; }
    if (!cands.length) { imposibles.add(peor.a.toFixed(1)); console.log(`  ⚠ hueco ${peor.a.toFixed(0)}s→${peor.z.toFixed(0)}s sin momento libre (todo bajo componentes)`); continue; }
    cands.sort((x, y) => (puntaje(y.m, y.j) - Math.abs(y.m.t - mitad) / 6) - (puntaje(x.m, x.j) - Math.abs(x.m.t - mitad) / 6));
    AVATAR_I.add(cands[0].j);
    agregados.push(cands[0].j);
  }
  console.log(`relleno de conexión: ${agregados.length} momentos de avatar agregados (${conReal} sobre metraje real) · huecos imposibles ${imposibles.size} · objetivo ≤ ${GAP_OBJ}s · total avatar ${AVATAR_I.size}`);
}
if (!AVATAR_I.has(0)) { console.error("⛔ el momento 0 no es de avatar: el video tiene que ABRIR con el presentador hablando"); process.exit(1); }
console.log(`avatar: ${AVATAR_I.size} momentos reservados · ${avatarChoca.length} anclas cedidas a un componente${avatarChoca.length ? " (" + avatarChoca.join(" | ") + ")" : ""}`);

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const cedidos = [];
const anclasBase = new Set();
const overlaysPre = [];
for (const [k, c] of compAt) {
  if (!c.overlay) { anclasBase.add(k); continue; }
  const m = MOM[k];
  const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
  overlaysPre.push({ componente: c.comp, props: c.props,
    ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
}
for (const [k, c] of [...compAt]) if (c.overlay) compAt.delete(k);
console.log(`overlays emitidos en pasada previa: ${overlaysPre.length}`);

let absorbidos = 0, reales = 0, avatarBeats = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const n3 = String(m.i).padStart(3, "0");
  const img = `img/${SLUG}_${n3}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${n3}.mp4`;
  const real = REAL[String(m.i)];

  const cBase = compAt.get(i);
  if (cBase && !cBase.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(cBase.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    const comidos = [];
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      if (anclasBase.has(j)) { console.error(`⛔ ${cBase.comp} (momento ${i}) absorbe el ancla del componente del momento ${j}. Movelo de frase.`); process.exit(1); }
      // ⛔ con avatar por VENTANAS, el momento de avatar CORTA al componente (antes le cedía el lugar y
      //    abría un hueco de 35-50 s sin la cara por décimas de tiempo de lectura: momentos 149·261·313·404).
      if (AVATAR_I.has(j)) { cedidos.push(`${j}(corta ${(out - MOM[j].t).toFixed(1)}s)`); out = MOM[j].t; break; }
      MOM[j].__skip = true; comidos.push(j);
    }
    const ult = comidos[comidos.length - 1];
    let colaDe = null;
    if (ult !== undefined && MOM[ult].t + MOM[ult].dur > out + 2) { colaDe = ult; MOM[ult].__skip = false; MOM[ult].__desde = out; }
    if (colaDe === null) {
      // ⛔ en fcstaza9 el componente se estiraba hasta el próximo momento NO-avatar porque el avatar era
      //    FONDO. Acá el avatar son VENTANAS: estirarse por encima de un momento de avatar lo tapaba
      //    (medido: 11 huecos >30 s con las frases de avatar ya reservadas). Corta en el próximo momento, sea cual sea.
      const sig = MOM.find((x) => x.t >= out && !x.__skip);
      if (sig) out = Math.max(out, sig.t);
    }
    // cama de foto bajo todo componente (regla 2.quater)
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: cBase.comp, props: { ...cBase.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  if (AVATAR_I.has(i)) { avatarBeats++; continue; }

  const ms_in = Math.round((m.__desde ?? m.t) * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);

  // 1) METRAJE REAL primero (auditado con visión)
  if (real && existe(`broll/${real}.mp4`)) {
    const rd = durDe(`broll/${real}.mp4`);
    const usable = rd - 0.15;
    const largoR = (ms_out - ms_in) / 1000;
    reales++;
    if (largoR > PARTIR_S) {
      const corte = ms_in + Math.round((ms_out - ms_in) * 0.55);
      const dC = (corte - ms_in) / 1000;
      if (dC <= usable) beats.push({ tipo: "clip", ms_in, ms_out: corte, clip: real });
      else beats.push({ tipo: "clipslow", ms_in, ms_out: corte, rate: Math.min(1, Math.max(0.45, usable / dC)), clip: real });
      beats.push({ tipo: "imagen", ms_in: corte, ms_out, imagen: `${SLUG}_${n3}` });
      continue;
    }
    if (largoR <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: real });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / largoR)), clip: real });
    continue;
  }

  // 2) clip de agnes (salvo redibujado o con gente inventada) · 3) la foto
  const cd = (existe(clip) && !REDIBUJADO.has(m.i) && !GENTE.has(m.i)) ? durDe(clip) : 0;
  const rel = `${SLUG}/${SLUG}_${n3}`;
  const nombreImg = `${SLUG}_${n3}`;
  const largoS = (ms_out - ms_in) / 1000;

  if (largoS > PARTIR_S && cd > 0.8) {
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
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: nombreImg });
  }
}

// ── CIERRE DE HUECOS: sólo entre beats CONTIGUOS. Los huecos de avatar se respetan.
beats.sort((a, b) => a.ms_in - b.ms_in);
const huecosAvatar = [];
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : Math.round((TOTAL_S + 1.2) * 1000);
  const hueco = sig - beats[i].ms_out;
  if (hueco <= 0) { beats[i].ms_out = sig; continue; }
  if (hueco < 900) { beats[i].ms_out = sig; continue; }
  huecosAvatar.push(+(hueco / 1000).toFixed(2));
}

console.log(`anclas de AVATAR que cedieron ante un componente que las absorbió: ${cedidos.length}${cedidos.length ? " (momentos " + cedidos.join(",") + ")" : ""}`);
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysPre };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
const segAvatar = huecosAvatar.reduce((a, b) => a + b, 0);
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`metraje REAL en ${reales} beats (${(100 * reales / beats.length).toFixed(0)} % de los beats)`);
console.log(`overlays: ${overlaysPre.length} · componentes distintos: ${new Set([...beats.filter((b) => b.tipo === "componente").map((b) => b.componente), ...overlaysPre.map((o) => o.componente)]).size}`);
console.log(`AVATAR a la vista (estimado): ${huecosAvatar.length} tramos · ${segAvatar.toFixed(0)}s (${(100 * segAvatar / TOTAL_S).toFixed(0)} % del video) · momentos reservados ${avatarBeats}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
