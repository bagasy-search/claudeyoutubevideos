// gen_fcspuntos_plan.mjs — DIRECTOR → PLAN DENSO. Clon de la cadena fcsmanos10/fcsaspirina.
// Lee _v3/fcspuntos_moments.json (anclado) + _v3/fcspuntos_wordms.json.
// Escribe _v3/fcspuntos_plan.json · _v3/fcspuntos_avwindows.json · _v3/fcspuntos_i2v.json
// Reglas: avatar por ventanas cortas repartidas en TODO el video; componentes anclados por frase
// con contenido REAL del guion; el resto lo cubre la foto del momento, animada con agnes (clip).
import fs from "node:fs";

const SLUG = "fcspuntos";
const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8"));
const wordms = JSON.parse(fs.readFileSync(`_v3/${SLUG}_wordms.json`, "utf8"));
const TOTAL_MS = Math.round((moments[moments.length - 1].t + moments[moments.length - 1].dur) * 1000);

const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const norm = (s) => fold((s || "").toLowerCase()).replace(/[^a-z0-9]/g, "");
function findMs(phrase) {
  const toks = phrase.toLowerCase().split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i <= wordms.length - toks.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (!norm(wordms[i + j].w).startsWith(toks[j])) { ok = false; break; }
    if (ok) return wordms[i].ms;
  }
  return null;
}
const snap = (ms) => { for (const w of wordms) if (w.ms >= ms) return w.ms; return wordms[wordms.length - 1].ms; };

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES — anclados por frase literal del guion. k = tag REAL del kit premium.
// img:"prop" → esa prop se rellena con la imagen generada más cercana en el tiempo.
// ─────────────────────────────────────────────────────────────────────────────
const C = [
  // ── TRAMO 1 · apertura, caso, giro, virus, ancla ──────────────────────────
  { a: "ves unos puntitos negros", k: "HookCaption", d: 4.5, p: { words: [{ text: "PUNTOS" }, { text: "NEGROS" }, { text: "en la" }, { text: "PLANTA", boxed: true }], sub: "Qué significan de verdad después de los 60" } },
  { a: "hay una version de ese mismo puntito", k: "StampBadge", d: 4.0, p: { text: "OJO", sub: "una de las cinco causas no se trata en casa", x: 0.5, y: 0.46 } },
  { a: "cinco pruebas que puedes hacer", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "LO QUE VAS A APRENDER HOY", title: "Cinco pruebas caseras", stamp: "GRATIS", items: ["La prueba de las líneas de la piel", "Pellizco de lado contra presión de frente", "El limado suave", "La foto con moneda a las 4 semanas", "Las cinco banderas rojas"] } },
  { a: "carpintero toda la vida", k: "LowerThirdId", d: 5.0, p: { name: "Don Efraín, 71 años", role: "Carpintero · 38 años de pie sobre piso de cemento" }, img: "image" },
  { a: "le puedo enseñar una cosa del pie", k: "PullQuote", d: 6.0, p: { quote: "Oiga, doctor, ya que estoy aquí… ¿le puedo enseñar una cosa del pie?", author: "Don Efraín", role: "en la puerta, con la mano en la perilla" }, img: "image" },
  { a: "cuatro o cinco puntitos negros", k: "CutawayCallouts", d: 7.0, p: { eyebrow: "LO QUE VI EN LA CONSULTA", title: "La lesión de don Efraín", callouts: [{ text: "Piel gruesa amarillenta", sub: "del tamaño de una moneda", tx: 0.3, ty: 0.3 }, { text: "Centro más blando", tx: 0.55, ty: 0.55 }, { text: "Cuatro puntos negros redondos", tx: 0.42, ty: 0.78 }] }, img: "image" },
  { a: "era la raiz del callo", k: "MythTruth", d: 7.0, p: { myth: "Los puntos negros son la raíz del callo y hay que sacarla completa", truth: "Las verrugas no tienen raíz: esos puntos son capilares coagulados" } },
  { a: "don efrain no tenia un callo", k: "HighlightSweep", d: 5.5, p: { pre: "Lo que tenía no era un callo. Era una ", highlight: "verruga plantar", post: ".", note: "Y eso cambia todo el tratamiento" } },
  { a: "eran vasos sanguineos", k: "LayerStack", d: 7.0, p: { title: "Qué es en realidad un punto negro", layers: [{ label: "Capa de piel gruesa por encima" }, { label: "Capilar diminuto que subió a alimentar" }, { label: "Coágulo seco dentro del vaso = punto negro" }] } },
  { a: "de paso sembrando el virus", k: "CycleLoop", d: 7.0, p: { title: "Por qué siempre volvía", center: "Vuelve", nodes: [{ label: "Se rasura", sub: "con la navaja" }, { label: "Sangra", sub: "corta capilares" }, { label: "Siembra", sub: "virus en piel sana" }, { label: "Brotan satélites", sub: "a las dos semanas" }] } },
  { a: "mas de doscientos tipos distintos", k: "BigStatReveal", d: 6.0, p: { eyebrow: "VIRUS DEL PAPILOMA HUMANO", value: 200, prefix: "+", suffix: " tipos", support: "Solo cinco de ellos viven en la planta del pie: 1, 2, 4, 27 y 57" } },
  { a: "vive en el suelo humedo de los banos", k: "SplitPanel", d: 7.0, p: { eyebrow: "DÓNDE SE AGARRA", title: "Los cuatro pisos de siempre", bullets: ["La regadera compartida", "La orilla de la alberca", "La duela del vestidor", "El piso húmedo del baño"] }, img: "image" },
  { a: "por una grietita de medio milimetro", k: "FlowSteps", d: 7.0, p: { title: "Por dónde entra", nodes: [{ label: "Talón reseco", sub: "grieta de medio milímetro" }, { label: "Piel reblandecida", sub: "tras el remojo largo" }, { label: "Raspón de la sandalia", sub: "puerta abierta" }] } },
  { a: "corria el ano mil novecientos siete", k: "ChapterTitle", d: 5.0, p: { number: "1907", title: "Giuseppe Ciuffo, Italia", sub: "El experimento que probó que una verruga es un virus" } },
  { a: "se lo inyecto a si mismo", k: "NumberedSteps", d: 9.0, p: { eyebrow: "HISTORIA REGISTRADA", title: "El experimento de Ciuffo", steps: [{ title: "Trituró una verruga", sub: "material de la propia lesión" }, { title: "La pasó por un filtro de porcelana", sub: "ninguna bacteria conocida lo atravesaba" }, { title: "Se inyectó el líquido en el antebrazo", sub: "sin comités de ética, sin voluntarios" }, { title: "Semanas después le creció una verruga", sub: "en el sitio exacto" }] } },
  { a: "premio nobel de medicina en el ano dos mil ocho", k: "FramedPhoto", d: 5.5, p: { caption: "Harald zur Hausen · Nobel de Medicina 2008", sub: "por identificar el papel del virus del papiloma humano" }, img: "image" },

  // ── TRAMO 2 · mito, enemigo, mecanismo ────────────────────────────────────
  { a: "entendiste por que vuelve cuando lo cortas", k: "BulletCascade", d: 7.0, p: { eyebrow: "Si es un virus, entonces…", bullets: [{ pre: "Por eso ", key: "vuelve", post: " cuando lo cortas" }, { pre: "Por eso se llenó ", key: "un solo pie" }, { pre: "Por eso lo pescó ", key: "tu nieto", post: " en la misma regadera" }] } },
  { a: "no hay un tallo", k: "DuelColumns", d: 8.0, p: { title: "Lo que la gente cree contra lo que hay", leftName: "El mito", rightName: "La realidad", rows: [{ attr: "Tiene raíz", leftWins: true }, { attr: "Es piel tuya infectada", leftWins: false }, { attr: "Se saca cortando", leftWins: true }, { attr: "La echa tu sistema inmune", leftWins: false }] } },
  { a: "es el mito que hace que la gente agarre", k: "TierRanking", d: 7.5, p: { title: "Lo que la gente usa en casa (y no debe)", rows: [{ tier: "NO", items: ["Navaja de rasurar", "Cortaúñas grande", "Cúter del taller"] }, { tier: "SÍ", items: ["Lima de cartón desechable", "Remojo tibio"] }] } },
  { a: "se venden por internet en cuatrocientos", k: "RankBars", d: 7.5, p: { title: "Lo que se cobra por lo mismo", unit: "pesos", rows: [{ label: "Ácido salicílico de farmacia", value: 25 }, { label: "Parche milagroso en línea", value: 600 }, { label: "Sesión de láser en clínica", value: 8000 }] } },
  { a: "no llegaron a ninguna raiz", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "Grábate esto", phrase: "No hay raíz. Lo que cura es que tu cuerpo lo reconozca." } },
  { a: "una pared de ladrillos", k: "CutawayCallouts", d: 7.0, p: { eyebrow: "TE LO EXPLICO SENCILLO", title: "La piel, como una pared", callouts: [{ text: "Los ladrillos son tus células", tx: 0.28, ty: 0.32 }, { text: "El cemento las mantiene pegadas", tx: 0.62, ty: 0.5 }, { text: "El virus entra por la grieta", tx: 0.45, ty: 0.8 }] }, img: "image" },
  { a: "multipliquense mas rapido", k: "FedWhiteboard", d: 11.0, p: {} },
  { a: "crece hacia adentro", k: "VsDuel", d: 7.5, p: { eyebrow: "LA MISMA VERRUGA, DOS LUGARES", title: "Por qué en el pie duele", left: { label: "En la mano", sub: "crece hacia afuera, se ve en relieve", good: true }, right: { label: "En la planta", sub: "el peso la hunde: crece hacia adentro", good: false } } },
  { a: "como caminar con una piedrita", k: "PullQuote", d: 5.0, p: { quote: "Es como caminar con una piedrita en el zapato. Solo que la piedrita está dentro de tu piel." } },
  { a: "necesita el doble de alimento", k: "FlowSteps", d: 7.0, p: { title: "De dónde salen los puntos negros", nodes: [{ label: "La fábrica trabaja al doble" }, { label: "Suben capilares nuevos" }, { label: "Se rompen y se coagulan" }] } },
  { a: "punto negro igual a capilar trombosado", k: "BigStatReveal", d: 5.5, p: { eyebrow: "LA REGLA DE ORO", value: 1, prefix: "", suffix: " sola idea", support: "Punto negro = capilar trombosado. No es raíz, no es tierra." } },
  { a: "un callo comun no hace eso", k: "BeforeAfter", d: 7.0, p: { eyebrow: "AL LIMAR, SE SEPARAN SOLAS", beforeLabel: "Verruga: aparecen más puntos", afterLabel: "Callo: piel rosada pareja", caption: "La misma lima, dos respuestas distintas" }, img: "afterImage" },
  { a: "va a ser la prueba numero tres", k: "StampBadge", d: 4.0, p: { text: "PRUEBA Nº3", sub: "la más útil de las cinco, te la debo", x: 0.5, y: 0.45 } },

  // ── TRAMO 3 · las cinco causas ────────────────────────────────────────────
  { a: "vamos entonces a las cinco causas", k: "ChecklistReveal", d: 7.5, p: { eyebrow: "LAS CINCO CAUSAS", title: "Qué puede ser ese punto negro", items: ["Verruga plantar (virus)", "Callo con hematoma", "Lunar o nevo acral", "Melanoma acral lentiginoso", "Hemorragia por calzado"] } },
  { a: "causa numero uno", k: "ChapterTitle", d: 4.5, p: { number: "1", title: "Verruga plantar", sub: "la más común, con muchísima diferencia" } },
  { a: "se detienen al llegar a la lesion", k: "CutawayCallouts", d: 7.5, p: { eyebrow: "CÓMO SE VE", title: "Verruga plantar", callouts: [{ text: "Anillo de piel dura", tx: 0.26, ty: 0.3 }, { text: "Centro esponjoso con puntos", tx: 0.55, ty: 0.52 }, { text: "Las líneas de la piel se interrumpen", tx: 0.4, ty: 0.82 }] }, img: "image" },
  { a: "la principal grande y dos o tres satelites", k: "FloatingCutout", d: 5.0, p: { label: "Satélites", sub: "el virus se sembró al caminar o al rascarse" }, img: "image" },
  { a: "causa numero dos", k: "ChapterTitle", d: 4.5, p: { number: "2", title: "Callo con hematoma", sub: "el hermano confundido: se lleva la culpa y no le toca" } },
  { a: "aqui las lineas de la piel si atraviesan", k: "DuelColumns", d: 8.0, p: { title: "Verruga contra callo con hematoma", leftName: "Verruga", rightName: "Callo", rows: [{ attr: "Puntos redondos separados", leftWins: true }, { attr: "Mancha o rayita irregular", leftWins: false }, { attr: "Las líneas se interrumpen", leftWins: true }, { attr: "Duele al pellizcar de lado", leftWins: true }, { attr: "Duele al presionar de frente", leftWins: false }] } },
  { a: "es la senal exactamente contraria", k: "StampBadge", d: 4.0, p: { text: "AL REVÉS", sub: "si al limar desaparece y no vuelve, era hematoma", x: 0.5, y: 0.48 } },
  { a: "causa numero tres", k: "ChapterTitle", d: 4.5, p: { number: "3", title: "Lunar o nevo acral", sub: "sí, también salen lunares en la planta" } },
  { a: "el pigmento sigue las lineas de la piel", k: "LayerStack", d: 6.5, p: { title: "Cómo se comporta un lunar bueno", layers: [{ label: "Color café parejo, un solo tono" }, { label: "Bordes redondeados y definidos" }, { label: "El pigmento va DENTRO de los surcos" }, { label: "Lleva años igual, no cambió" }] } },
  { a: "causa numero cuatro", k: "ChapterTitle", d: 4.5, p: { number: "4", title: "Melanoma acral lentiginoso", sub: "la causa por la que grabo este video con tanto cuidado" } },
  { a: "donde el sol casi no pega", k: "SplitPanel", d: 7.0, p: { eyebrow: "DÓNDE APARECE", title: "Justo donde nadie lo busca", bullets: ["La planta del pie", "La palma de la mano", "Debajo de las uñas", "Aquí el sol no tiene nada que ver"] }, img: "image" },
  { a: "la regla de las cinco letras", k: "NumberedSteps", d: 10.0, p: { eyebrow: "LA REGLA DE LAS CINCO LETRAS", title: "A · B · C · D · E", steps: [{ title: "A — Asimetría", sub: "doblada por la mitad, las dos mitades no coinciden" }, { title: "B — Bordes", sub: "irregulares, como un mapa" }, { title: "C — Color", sub: "varios tonos en la misma mancha" }, { title: "D — Diámetro", sub: "más de 6 milímetros" }, { title: "E — Evolución", sub: "está cambiando: la letra más importante" }] } },
  { a: "el pigmento no respeta las lineas", k: "MythTruth", d: 6.5, p: { myth: "Si el color está dentro de las rayitas o fuera, da igual", truth: "En el melanoma acral el pigmento se sale de los surcos y ocupa las crestas" } },
  { a: "una banda oscura que va creciendo", k: "CutawayCallouts", d: 7.0, p: { eyebrow: "BAJO LA UÑA", title: "La banda que sí se revisa", callouts: [{ text: "Se va haciendo más ancha en la base", tx: 0.35, ty: 0.35 }, { text: "Mancha también la piel del pliegue", tx: 0.62, ty: 0.58 }, { text: "No se tapa con esmalte", tx: 0.45, ty: 0.82 }] }, img: "image" },
  { a: "dona herminia tenia setenta y dos anos", k: "LowerThirdId", d: 5.0, p: { name: "Doña Herminia, 72 años", role: "Vino por la rodilla · la mancha llevaba cinco años en el talón" }, img: "image" },
  { a: "como no me duele no le hice caso", k: "PullQuote", d: 6.0, p: { quote: "Hace como un año se puso más oscura, pero como no me duele, no le hice caso.", author: "Doña Herminia", role: "la frase que más escucho en consulta" }, img: "image" },
  { a: "el melanoma no duele", k: "HighlightSweep", d: 6.0, p: { pre: "En la piel, la regla se invierte: ", highlight: "lo que no duele", post: " es lo que hay que mirar.", note: "La ausencia de dolor no es buena noticia" } },
  { a: "causa numero cinco", k: "ChapterTitle", d: 4.5, p: { number: "5", title: "Talón negro", sub: "hemorragia por calzado: la más inofensiva de todas" } },
  { a: "por tres cosas", k: "NumberedSteps", d: 8.0, p: { eyebrow: "CÓMO RECONOCER EL TALÓN NEGRO", title: "Tres señales", steps: [{ title: "Apareció de golpe", sub: "en días, no en meses" }, { title: "Está en la zona de roce", sub: "talón o borde, no donde apoyas el peso" }, { title: "Se va sola", sub: "en tres o cuatro semanas, aunque no hagas nada" }] } },
  { a: "la astillita de madera", k: "FloatingCutout", d: 5.0, p: { label: "Cuerpo extraño", sub: "punto oscuro con un halo endurecido alrededor" }, img: "image" },
  { a: "se quita frotando con un algodon", k: "GaugeDial", d: 5.5, p: { eyebrow: "NIVEL DE ALARMA", label: "Mancha de tinte del calcetín", value: 5, suffix: "%", zones: true } },

  // ── TRAMO 4 · las cinco pruebas y la rutina ───────────────────────────────
  { a: "ahora si lo que viniste a buscar", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "SIN COMPRAR NADA", title: "Las cinco pruebas, en orden", stamp: "EN CASA", items: ["Líneas de la piel", "Pellizco contra presión", "Limado suave", "Foto con moneda a 4 semanas", "Banderas rojas"] } },
  { a: "prueba numero uno", k: "ChapterTitle", d: 4.5, p: { number: "I", title: "Las líneas de la piel", sub: "la mejor prueba casera y casi nadie la conoce" } },
  { a: "si las lineas se interrumpen", k: "DuelColumns", d: 7.5, p: { title: "Qué hacen las líneas al llegar a la mancha", leftName: "Se interrumpen", rightName: "Atraviesan", rows: [{ attr: "Verruga plantar", leftWins: true }, { attr: "Callo o hematoma", leftWins: false }, { attr: "Lunar", leftWins: false }] } },
  { a: "prueba numero dos", k: "ChapterTitle", d: 4.5, p: { number: "II", title: "Pellizco contra presión", sub: "dos segundos y mucha información" } },
  { a: "duele claramente mas el pellizco lateral", k: "VsDuel", d: 7.0, p: { eyebrow: "DÓNDE DUELE MÁS", title: "El dato que separa las dos cosas", left: { label: "Pellizco de lado", sub: "duele más → verruga", good: false }, right: { label: "Presión de frente", sub: "duele más → callo", good: true } } },
  { a: "prueba numero tres", k: "ChapterTitle", d: 4.5, p: { number: "III", title: "El limado suave", sub: "la que te prometí: le da la respuesta al 90% de la gente" } },
  { a: "con una lima de carton desechable", k: "NumberedSteps", d: 8.5, p: { eyebrow: "CÓMO SE HACE", title: "El limado de diagnóstico", steps: [{ title: "Remoja 10 minutos", sub: "nunca en seco" }, { title: "Lima en una sola dirección", sub: "pocas pasadas, sin buscar sangre" }, { title: "Mira lo que aparece", sub: "puntos rojos separados o piel pareja" }, { title: "Tira la lima", sub: "no se guarda, no se comparte" }] } },
  { a: "como pecas de sangre", k: "BeforeAfter", d: 7.0, p: { eyebrow: "LO QUE VES AL LIMAR", beforeLabel: "Puntitos rojos separados = verruga", afterLabel: "Piel rosada pareja = callo", caption: "Cada uno por su lado, como pecas de sangre" }, img: "beforeImage" },
  { a: "esa lima se tira a la basura", k: "StampBadge", d: 4.5, p: { text: "UNA VEZ", sub: "la lima que toca la verruga no toca nada más", x: 0.5, y: 0.46 } },
  { a: "prueba numero cuatro", k: "ChapterTitle", d: 4.5, p: { number: "IV", title: "El tiempo y la fotografía", sub: "convierte una duda en un dato" } },
  { a: "pon una moneda de diez pesos", k: "NumberedSteps", d: 8.0, p: { eyebrow: "LA FOTO QUE LOS MÉDICOS AMAMOS", title: "Cómo se hace bien", steps: [{ title: "Moneda al lado", sub: "referencia de tamaño" }, { title: "Buena luz y la misma distancia" }, { title: "Anota la fecha" }, { title: "Repetí la misma foto a las 4 semanas" }] } },
  { a: "los medicos amamos esas fotos", k: "PullQuote", d: 5.5, p: { quote: "Una foto con fecha vale más que veinte minutos de interrogatorio." } },
  { a: "prueba numero cinco", k: "ChapterTitle", d: 4.5, p: { number: "V", title: "Las banderas rojas", sub: "una revisión honesta, cinco preguntas" } },
  { a: "preguntate cinco cosas", k: "ChecklistReveal", d: 9.0, p: { eyebrow: "CONTESTÁ CON SINCERIDAD", title: "Las cinco banderas rojas", stamp: "2 O MÁS = MÉDICO", items: ["¿No duele nada y sin embargo sigue ahí?", "¿Tiene más de un color?", "¿Los bordes son como mapa, no como círculo?", "¿Cambió en los últimos seis meses?", "¿Sangra sin que te hayas golpeado?"] } },
  { a: "detectado temprano tiene un pronostico excelente", k: "HighlightSweep", d: 6.0, p: { pre: "La diferencia entre las dos historias son ", highlight: "unos meses y una foto", post: ".", note: "Detectado a tiempo, el pronóstico es excelente" } },
  { a: "muy bien ya sabes que es", k: "ChapterTitle", d: 5.0, p: { number: "7", title: "Qué hacer, paso a paso", sub: "de farmacia de barrio y de tianguis" } },
  { a: "siete pasos", k: "NumberedSteps", d: 10.0, p: { eyebrow: "LA RUTINA COMPLETA", title: "Siete pasos, sin saltarse ninguno", steps: [{ title: "1. Remojo tibio, 10-15 min" }, { title: "2. Secado completo, sobre todo entre los dedos" }, { title: "3. Ácido salicílico solo sobre la lesión" }, { title: "4. Oclusión: tapa y deja toda la noche" }, { title: "5. Limado de mantenimiento cada 2-3 días" }, { title: "6. Aliados de la cocina, como complemento" }, { title: "7. Constancia de 6 a 12 semanas" }] } },
  { a: "paso uno el remojo", k: "SplitPanel", d: 6.5, p: { eyebrow: "PASO 1", title: "El remojo", bullets: ["Agua tibia, ni caliente ni hirviendo", "10 a 15 minutos, todas las noches", "Un puño de sal de grano o media taza de vinagre", "Sin remojo, lo demás se desperdicia"] }, img: "image" },
  { a: "paso dos el secado", k: "SplitPanel", d: 6.5, p: { eyebrow: "PASO 2", title: "El secado", bullets: ["Toalla propia, que no comparta nadie", "Atención especial entre los dedos", "Aire frío de la secadora, 20 segundos", "Esa toalla se lava aparte, con agua caliente"] }, img: "image" },

  // ── TRAMO 5 · receta, límites, error, alertas, recap, CTA, cierre ─────────
  { a: "paso tres el acido salicilico", k: "CutawayCallouts", d: 7.5, p: { eyebrow: "PASO 3", title: "Ácido salicílico, bien aplicado", callouts: [{ text: "Solo sobre la lesión", tx: 0.4, ty: 0.34 }, { text: "Anillo de vaselina alrededor", tx: 0.66, ty: 0.55 }, { text: "O recorta el parche a medida", tx: 0.32, ty: 0.8 }] }, img: "image" },
  { a: "la quema la irrita", k: "StampBadge", d: 4.0, p: { text: "CUIDADO", sub: "si cae en piel sana, irrita y se abandona el tratamiento", x: 0.5, y: 0.47 } },
  { a: "paso cuatro la oclusion", k: "FlowSteps", d: 7.0, p: { title: "Por qué tapar funciona", nodes: [{ label: "Mantiene húmeda la zona", sub: "multiplica la penetración" }, { label: "Irrita levemente", sub: "de manera constante" }, { label: "El inmune se da cuenta", sub: "y ataca lo que no le pertenece" }] } },
  { a: "unicamente cinta adhesiva gris", k: "GaugeDial", d: 5.5, p: { eyebrow: "HONESTIDAD", label: "Evidencia de la cinta sola", value: 45, suffix: "%", zones: true } },
  { a: "paso cinco el limado de mantenimiento", k: "SplitPanel", d: 6.5, p: { eyebrow: "PASO 5", title: "El limado de mantenimiento", bullets: ["Cada dos o tres días, después del remojo", "Retira la capa blanca y blanda", "Suave: nunca hasta sangrar", "Lima nueva cada vez, a la basura"] }, img: "image" },
  { a: "paso seis los aliados de la cocina", k: "TierRanking", d: 8.0, p: { title: "Los aliados de la cocina, con honestidad", rows: [{ tier: "SIRVE", items: ["Ajo machacado de noche, tapado"] }, { tier: "AYUDA", items: ["Cáscara de plátano (oclusión + humedad)"] }, { tier: "OJO", items: ["Vinagre de manzana diluido, pocos minutos"] }] } },
  { a: "complementos del acido salicilico", k: "MythTruth", d: 6.0, p: { myth: "El ajo y la cáscara de plátano reemplazan al tratamiento", truth: "Son complementos: el que tiene respaldo real es el ácido salicílico" } },
  { a: "paso siete la constancia", k: "BigStatReveal", d: 6.0, p: { eyebrow: "CUÁNTO TARDA DE VERDAD", value: 12, prefix: "6-", suffix: " semanas", support: "De tratamiento diario. En mayores de 60, a veces más. No es que lo hagas mal." } },
  { a: "nunca camines descalzo", k: "ChecklistReveal", d: 8.0, p: { eyebrow: "MIENTRAS DURE EL TRATAMIENTO", title: "Prevención, todos los días", items: ["Sandalias de plástico en regadera y alberca", "Rota los zapatos: 24 horas de secado", "Calcetín de algodón, cambio diario", "Lávate las manos después de tocarla"] } },
  { a: "la guia completa de la salud despues", k: "CtaCard", d: 7.0, p: { eyebrow: "EN LA DESCRIPCIÓN", title: "La Guía Completa de la Salud Después de los 60", bullet: "+150 remedios ordenados por tema, con cantidades y advertencias", price: 27, cta: "archivos-federer.vercel.app" } },
  { a: "dos de cada tres verrugas se van solas", k: "DonutPercent", d: 6.5, p: { value: 66, title: "Se van solas", support: "Dos de cada tres, en un plazo de hasta dos años. El tratamiento acorta el camino." } },
  { a: "inmunosenescencia", k: "FlowSteps", d: 7.0, p: { title: "Por qué después de los 60 tarda más", nodes: [{ label: "Inmunosenescencia", sub: "las defensas reconocen más lento" }, { label: "Seis semanas en un joven" }, { label: "Cuatro o cinco meses a los 70", sub: "es lo esperado, no un fracaso" }] } },
  { a: "si tienes diabetes este video cambia", k: "ChecklistReveal", d: 9.0, p: { eyebrow: "SI TIENES DIABETES", title: "Esto NO se hace en casa", stamp: "ALTO", items: ["No te limes", "No te apliques ácido salicílico sin que un médico lo vea", "No te cortes nada", "Revisión diaria de los pies con espejo", "Tu camino es el médico o el podólogo"] } },
  { a: "puede terminar como una ulcera", k: "HighlightSweep", d: 6.0, p: { pre: "Con neuropatía no sientes la quemadura: lo que empieza como verruga ", highlight: "termina como úlcera", post: ".", note: "Por eso en diabetes no se improvisa" } },
  { a: "ahora el error mas grande", k: "ChapterTitle", d: 5.0, p: { number: "EL ERROR", title: "No es el ácido. Es la lima.", sub: "el que arruina todo lo demás" } },
  { a: "asi es como una verruga se convierte en cinco", k: "CycleLoop", d: 7.5, p: { title: "Cómo una se vuelve cinco", center: "Se siembra", nodes: [{ label: "Lima la verruga" }, { label: "Pasa por el talón" }, { label: "Pasa al otro pie" }, { label: "Pasa al esposo o al nieto" }] } },
  { a: "la regla es simple", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "La regla que salva meses", phrase: "La herramienta que toca la verruga no toca nada más. Nunca." } },
  { a: "pregunta sin pena como esterilizan", k: "StampBadge", d: 4.5, p: { text: "PREGUNTÁ", sub: "cómo esterilizan. Es tu derecho y es tu salud.", x: 0.5, y: 0.47 } },
  { a: "hay cuatro situaciones", k: "ChecklistReveal", d: 9.0, p: { eyebrow: "AQUÍ SE ACABA EL VIDEO Y EMPIEZA EL CONSULTORIO", title: "Cuatro situaciones", stamp: "MÉDICO", items: ["Dos o más banderas rojas, sobre todo si cambia", "Diabetes, mala circulación o defensas bajas", "Piel roja que se extiende, calor, pus o línea roja", "12 semanas de tratamiento bien hecho sin cambios"] } },
  { a: "dejame hacerte un recap", k: "NumberedSteps", d: 9.0, p: { eyebrow: "RECAP EN TRES PASOS", title: "Lo esencial de hoy", steps: [{ title: "Mira las líneas de tu piel", sub: "si se interrumpen, es verruga" }, { title: "Los puntos negros son capilares", sub: "cortarlos no cura y sí siembra" }, { title: "Remojo, ácido, oclusión, limado, constancia", sub: "de 6 a 12 semanas" }] } },
  { a: "si no duele si esta cambiando", k: "StampBadge", d: 5.0, p: { text: "NO EN CASA", sub: "si no duele, si está cambiando, o si tienes diabetes", x: 0.5, y: 0.46 } },
  { a: "se llama la guia completa", k: "CtaCard", d: 7.5, p: { eyebrow: "UN SOLO PAGO, TUYA PARA SIEMPRE", title: "La Guía Completa de la Salud Después de los 60", bullet: "Con un capítulo entero sobre el cuidado de los pies después de los 60", price: 27, cta: "archivos-federer.vercel.app" } },
  { a: "de que parte de mexico", k: "HookCaption", d: 5.0, p: { words: [{ text: "¿De" }, { text: "dónde" }, { text: "nos" }, { text: "ves?", boxed: true }], sub: "Contame en los comentarios de qué parte de México o de América Latina" } },
  { a: "escribe solamente interrumpen o atraviesan", k: "VsDuel", d: 6.5, p: { eyebrow: "ESCRIBÍ UNA SOLA PALABRA", title: "Hacé la prueba Nº1 ahora", left: { label: "INTERRUMPEN", sub: "las líneas se cortan en la mancha", good: false }, right: { label: "ATRAVIESAN", sub: "las líneas siguen de largo", good: true } } },
  { a: "compartelo con alguien que amas", k: "PullQuote", d: 5.5, p: { quote: "Puede ahorrarle meses de dolor a alguien que lleva un año raspándose un callo que no es un callo." } },
  { a: "los talones partidos", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "EN EL PRÓXIMO VIDEO", title: "Tres señales en un talón agrietado", items: ["Lo que dice de tu tiroides", "Lo que dice de tu circulación", "Lo que dice de tu azúcar", "Grieta horizontal o vertical: no significan lo mismo"] } },
  { a: "no es cuestion de suerte", k: "KaraokePhrase", d: 6.5, p: { eyebrow: "Hasta la próxima", phrase: "La salud después de los sesenta no es cuestión de suerte. Es cuestión de mirar a tiempo." } },

  // ── 2ª TANDA · baja el % de toma cruda del density_gate (nw:1 → se colocan en los huecos) ──
  { nw: 1, a: "luz cerca de la ventana si puedes revisa", k: "NumberedSteps", d: 7.0, p: { eyebrow: "HAZLO AHORA", title: "Cómo mirarte la planta", steps: [{ title: "Siéntate y quítate el calcetín", sub: "voltea el pie sin prisa" }, { title: "Buena luz, cerca de la ventana", sub: "o la lámpara del celular en ángulo bajo" }, { title: "Talón, almohadilla y el pedacito que nunca miras", sub: "el de abajo de los dedos" }] } },
  { nw: 1, a: "final porque eso que estas viendo tiene nombre", k: "KaraokePhrase", d: 5.5, p: { eyebrow: "Quédate conmigo", phrase: "Eso que estás viendo tiene nombre. Y tiene tratamiento." } },
  { nw: 1, a: "despedir me dijo esa frase que los medicos", k: "HighlightSweep", d: 5.5, p: { pre: "La frase que llega ", highlight: "en la puerta", post: ", con la mano ya en la perilla.", note: "Los médicos la conocemos bien" } },
  { nw: 1, a: "zona endurecida del tamano de una moneda de", k: "FramedPhoto", d: 5.5, p: { caption: "Almohadilla del pie derecho, debajo del segundo dedo", sub: "Amarillenta, la piel gruesa como suela · del tamaño de una moneda" }, img: "image" },
  { nw: 1, a: "se le quitaba un rato y a las", k: "CycleLoop", d: 7.0, p: { title: "Lo que llevaba haciendo tres veces", center: "Otra vez", nodes: [{ label: "Raspa", sub: "con la navaja de rasurar" }, { label: "Sangra", sub: "y se le quita un rato" }, { label: "Dos semanas", sub: "vuelve al mismo punto" }] } },
  { nw: 1, a: "una verruga plantar y esos puntitos negros que", k: "SplitPanel", d: 7.0, p: { eyebrow: "EL GIRO", title: "Callo o verruga", bullets: ["El callo sale donde aprieta el zapato", "La verruga vuelve al mismo punto exacto", "El callo no tiene puntitos negros", "La verruga interrumpe las líneas de la piel"] }, img: "image" },
  { nw: 1, a: "otros contextos y quiero dejarlo clarisimo para que", k: "MythTruth", d: 7.0, p: { myth: "Es el mismo virus del papiloma del que se habla en otros contextos", truth: "Los que viven en la planta del pie son los tipos 1, 2, 4, 27 y 57. No tienen nada que ver" } },
  { nw: 1, a: "pero que esta registrada en la literatura medica", k: "StampBadge", d: 4.5, p: { text: "REGISTRADO", sub: "no está en los libros de divulgación, pero sí en la literatura médica", x: 0.5, y: 0.45 } },
  { nw: 1, a: "entonces ciuffo hizo lo que hacian los investigadores", k: "HighlightSweep", d: 5.5, p: { pre: "Algo tan pequeño que ", highlight: "atravesaba los filtros de porcelana", post: " que atrapaban bacterias.", note: "Ciuffo, Italia, 1907" } },
  { nw: 1, a: "para que la ciencia le pusiera nombre y", k: "BigStatReveal", d: 6.0, p: { eyebrow: "DEL EXPERIMENTO AL NOMBRE", value: 70, suffix: " años", support: "Lo que Ciuffo probó en 1907 tardó siete décadas en tener nombre y apellido" } },
  { nw: 1, a: "porque vamos a derribar el mito mas caro", k: "ChapterTitle", d: 5.0, p: { number: "02", title: "El mito más caro", sub: "Por qué sacarlo no cura nada" } },
  { nw: 1, a: "la lesion atrajo hacia arriba para alimentarse y", k: "CutawayCallouts", d: 7.0, p: { eyebrow: "CORTE DE LA LESIÓN", title: "Qué hay debajo del punto negro", callouts: [{ text: "Piel gruesa por encima", tx: 0.32, ty: 0.28 }, { text: "Capilar que subió a alimentar", sub: "donde normalmente no hay ninguno", tx: 0.6, ty: 0.48 }, { text: "Coágulo diminuto que lo tapó", sub: "eso es el punto negro", tx: 0.4, ty: 0.7 }] }, img: "image" },
  { nw: 1, a: "cliente sin esterilizar es el mito que sostiene", k: "StampBadge", d: 4.5, p: { text: "CUIDADO", sub: "el mismo instrumento pasa al siguiente cliente sin esterilizar", x: 0.5, y: 0.46 } },
  { nw: 1, a: "pesos te voy a explicar exactamente como paso", k: "BigStatReveal", d: 6.0, p: { eyebrow: "LO QUE CUESTA EN CASA", value: 25, suffix: " pesos", support: "Ácido salicílico de farmacia. Eso es todo lo que hace falta" } },
  { nw: 1, a: "la capa que fabrica piel nueva todos los", k: "FlowSteps", d: 7.0, p: { title: "Qué hace el virus adentro", nodes: [{ label: "Entra por una grieta", sub: "medio milímetro alcanza" }, { label: "Se mete en la capa profunda", sub: "la que fabrica piel nueva todos los días" }, { label: "Da una sola orden", sub: "multiplíquense más rápido" }] } },
  { nw: 1, a: "del dia se rompen y se coagulan un", k: "LayerStack", d: 7.0, p: { title: "Por qué se ve negro y no rojo", layers: [{ label: "Capilares que llegan casi a la superficie" }, { label: "Presión del zapato y roce de todo el día" }, { label: "Se rompen y se coagulan ahí mismo" }] } },
  { nw: 1, a: "mas y si limas un poquito de mas", k: "MythTruth", d: 7.0, p: { myth: "Si limo y salen más puntitos, es que estoy llegando a la raíz", truth: "Salen más porque son capilares: estás destapando los que ya estaban ahí" } },
  { nw: 1, a: "por algo que se iba solo en dos", k: "ChapterTitle", d: 5.0, p: { number: "03", title: "Las cinco causas", sub: "Qué es cada cosa, y cuál no se trata en casa" } },
  { nw: 1, a: "puntitos negros que pueden ser uno solo o", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "CAUSA 1 · VERRUGA PLANTAR", title: "Cómo se ve", items: ["Centro como coliflor aplastada", "De uno a veinte puntitos negros", "Las líneas finas de la huella se interrumpen", "Duele más al pellizcar de lado"] } },
  { nw: 1, a: "se ve como una mancha negra o cafe", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "CAUSA 2 · CALLO CON HEMATOMA", title: "Cómo se ve", items: ["Piel engrosada por presión repetida", "Un vaso sanguíneo reventado por dentro", "Sangre seca atrapada en la capa dura", "Mancha negra o café, sin puntos sueltos"] } },
  { nw: 1, a: "se va con el polvillo y debajo aparece", k: "BeforeAfter", d: 7.0, p: { eyebrow: "AL LIMAR EL CALLO CON HEMATOMA", beforeLabel: "Mancha oscura", afterLabel: "Piel normal debajo", caption: "Se va con el polvillo y no reaparece ningún punto nuevo" }, img: "afterImage" },
  { nw: 1, a: "de la planta se ve plano o apenas", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "CAUSA 3 · LUNAR", title: "Cómo se ve un lunar bueno", items: ["Plano o apenas elevado", "Café uniforme y parejo", "Bordes definidos y redondeados", "Lleva años exactamente igual"] } },
  { nw: 1, a: "ni de forma si tu esposa tu hijo", k: "KaraokePhrase", d: 5.5, p: { eyebrow: "La pregunta que vale oro", phrase: "¿Está igual desde hace diez años?" } },
  { nw: 1, a: "este no tiene que ver con el sol", k: "MythTruth", d: 7.0, p: { myth: "Como no me asoleo los pies, ahí no me puede dar cáncer de piel", truth: "El melanoma de la planta no depende del sol. Por eso se diagnostica tarde: nadie lo busca ahí" } },
  { nw: 1, a: "o menos el ancho de la goma de", k: "BigStatReveal", d: 6.0, p: { eyebrow: "LA D ES DE DIÁMETRO", value: 6, suffix: " mm", support: "Más o menos el ancho de la goma de un lápiz" } },
  { nw: 1, a: "colores distintos y en la orilla se notaba", k: "LowerThirdId", d: 5.0, p: { name: "Doña Herminia", role: "Vino por la rodilla · el pie se revisó por otro motivo" }, img: "image" },
  { nw: 1, a: "hoja de referencia a dermatologia se la revisaron", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "En la piel la regla se invierte", phrase: "Lo que no duele es justo lo que hay que mirar." } },
  { nw: 1, a: "que dejan que el pie se resbale hacia", k: "FlowSteps", d: 7.0, p: { title: "El moretón por fricción", nodes: [{ label: "Zapato nuevo que aprieta", sub: "o tenis con el talón flojo" }, { label: "El pie se resbala hacia adelante", sub: "en cada paso" }, { label: "Frenón de la piel contra el hueso", sub: "se rompen capilares muy pequeños" }] } },
  { nw: 1, a: "no vuelve y aunque no hagas absolutamente nada", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "CAUSA 5 · HEMORRAGIA POR FRICCIÓN", title: "Cómo saber que es esto", items: ["Apareció después de caminar de más", "Las líneas de la piel siguen enteras", "Se lima superficialmente y no vuelve", "Sola se va en tres o cuatro semanas"] } },
  { nw: 1, a: "la simple mancha de tinte del calcetin nuevo", k: "FloatingCutout", d: 5.0, p: { label: "Tinte del calcetín", sub: "sobre piel reseca y agrietada · se quita frotando" }, img: "image" },
  { nw: 1, a: "lineas finas que dibujan tu planta esos surcos", k: "ChapterTitle", d: 5.0, p: { number: "PRUEBA 1", title: "Las líneas de la piel", sub: "Tu huella digital, pero del pie" } },
  { nw: 1, a: "a callo a hematoma o a lunar la", k: "DuelColumns", d: 7.5, p: { title: "Qué te dicen las líneas", leftName: "Cruzan la mancha", rightName: "Se interrumpen", rows: [{ attr: "Callo con hematoma", leftWins: true }, { attr: "Lunar", leftWins: true }, { attr: "Verruga plantar", leftWins: false }, { attr: "Arquitectura de la piel intacta", leftWins: true }] } },
  { nw: 1, a: "al diez ahora toma la zona entre el", k: "ChapterTitle", d: 5.0, p: { number: "PRUEBA 2", title: "Pellizco contra presión", sub: "Primero de frente hacia abajo, después de lado" } },
  { nw: 1, a: "es de las que mas usamos en consulta", k: "VsDuel", d: 7.5, p: { eyebrow: "LO QUE DICE EL DOLOR", title: "De frente o de lado", left: { label: "Duele de frente", sub: "la piel dura martillando el hueso: callo", good: true }, right: { label: "Duele al pellizcar", sub: "verruga plantar", good: false } } },
  { nw: 1, a: "si conforme limas aparecen mas puntitos negros o", k: "ChapterTitle", d: 5.0, p: { number: "PRUEBA 3", title: "El limado suave", sub: "Pocas pasadas, una sola dirección, sin buscar sangre" } },
  { nw: 1, a: "ningun punto nuevo eso es un callo con", k: "StampBadge", d: 4.5, p: { text: "TÍRALA", sub: "esa lima se va a la basura: no se guarda ni se comparte", x: 0.5, y: 0.46 } },
  { nw: 1, a: "si crecio si se puso mas oscura si", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "PRUEBA 4 · LA FOTO A LAS 4 SEMANAS", title: "Cuándo dejar de tratarlo en casa", items: ["Creció", "Se puso más oscura", "Le salieron colores nuevos", "Los bordes se volvieron irregulares"] } },
  { nw: 1, a: "cinco preguntas este video se termina para ti", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "Dos o más respuestas que sí", phrase: "Aquí se acaba el tratamiento en casa. Toca dermatología." } },
  { nw: 1, a: "objetivo muy concreto reblandecer la capa dura para", k: "ChapterTitle", d: 5.0, p: { number: "PASO 1", title: "El remojo", sub: "Reblandecer la capa dura para que lo de después penetre de verdad" } },
  { nw: 1, a: "el secado con el aire frio de la", k: "NumberedSteps", d: 7.0, p: { eyebrow: "PASO 2", title: "El secado", steps: [{ title: "Seca bien entre los dedos", sub: "ahí queda la humedad que el virus y los hongos aprovechan" }, { title: "Aire frío de la secadora de cabello", sub: "veinte segundos, si puedes" }] } },
  { nw: 1, a: "solo sobre la verruga y aqui viene el", k: "ChapterTitle", d: 5.0, p: { number: "PASO 3", title: "Ácido salicílico", sub: "Del 17 al 40 % · líquido con pincelito o parche recortable" } },
  { nw: 1, a: "constante que es justo el estimulo que tu", k: "LayerStack", d: 7.0, p: { title: "Por qué tapar cambia el resultado", layers: [{ label: "Mantiene húmeda la zona" }, { label: "Multiplica la penetración del ácido" }, { label: "Irrita levemente y despierta al sistema inmune" }] } },
  { nw: 1, a: "que yo te la ofrezco como complemento honesto", k: "StampBadge", d: 4.5, p: { text: "HONESTO", sub: "los estudios dan resultados mezclados: complemento, no tratamiento principal", x: 0.5, y: 0.45 } },
  { nw: 1, a: "capa por capa pero suave nunca hasta sangrar", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "Grábate esto", phrase: "Nunca hasta sangrar. Sangrar no acelera nada y sí siembra el virus." } },
  { nw: 1, a: "de todo mi consultorio no hay estudios grandes", k: "MythTruth", d: 7.0, p: { myth: "La cáscara de plátano cura la verruga por sí sola", truth: "No hay estudios grandes que lo respalden: lo que aporta es oclusión y humedad, que ya vimos que sí sirven" } },
  { nw: 1, a: "despues y aqui es un buen momento para", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "MIENTRAS DURA EL TRATAMIENTO", title: "No lo siembres", items: ["Nada de andar descalzo en casa", "Calcetín siempre, y cámbialo a diario", "No toques la verruga y luego los ojos o la nariz", "Lávate las manos siempre después"] } },
  { nw: 1, a: "no reemplaza a tu medico lo acompana y", k: "CtaCard", d: 7.0, p: { eyebrow: "EN LA DESCRIPCIÓN", title: "La Guía Completa de la Salud Después de los 60", bullet: "No reemplaza a tu médico: lo acompaña", price: 27, cta: "archivos-federer.vercel.app" } },
  { nw: 1, a: "de que se siembren mas segundo limite y", k: "ChapterTitle", d: 5.0, p: { number: "04", title: "Los límites honestos", sub: "Lo que este tratamiento no puede hacer" } },
  { nw: 1, a: "tu cuerpo necesita mas insistencia asi que si", k: "RankBars", d: 7.0, p: { title: "Cuánto tarda en irse", unit: "semanas", rows: [{ label: "Una persona joven", value: 6 }, { label: "Después de los 60", value: 20 }] } },
  { nw: 1, a: "acido o una herida por limado puede avanzar", k: "StampBadge", d: 4.5, p: { text: "DIABETES", sub: "nada de ácido ni limado en casa: puede avanzar días sin que lo sientas", x: 0.5, y: 0.46 } },
  { nw: 1, a: "la gente lima la verruga y con la", k: "CycleLoop", d: 7.0, p: { title: "El error que lo multiplica", center: "Se siembra", nodes: [{ label: "Lima la verruga" }, { label: "Misma lima, misma sesión" }, { label: "Le pasa por el talón sano" }, { label: "Brotan nuevas" }] } },
  { nw: 1, a: "en casa nada de pedicura expres donde no", k: "TierRanking", d: 7.5, p: { title: "Con qué sí y con qué no", rows: [{ tier: "NO", items: ["Piedra pómez compartida", "Metal reutilizado en casa", "Pedicura exprés sin esterilizar"] }, { tier: "SÍ", items: ["Lima de cartón desechable", "Preguntar sin pena cómo esterilizan"] }] } },
  { nw: 1, a: "o una linea roja que sube por el", k: "ChecklistReveal", d: 7.0, p: { eyebrow: "PARA Y CONSULTA", title: "Señales de infección", items: ["Piel roja que se extiende", "Calor y pus", "Mal olor", "Una línea roja que sube por el pie"] } },
  { nw: 1, a: "el virus tres remojo acido salicilico protegiendo la", k: "NumberedSteps", d: 9.0, p: { eyebrow: "RESUMEN", title: "El protocolo, en orden", steps: [{ title: "Remojo", sub: "reblandece la capa dura" }, { title: "Ácido salicílico", sub: "protegiendo la piel sana de alrededor" }, { title: "Oclusión toda la noche", sub: "cinta o parche" }, { title: "Limado suave", sub: "con lima desechable, sin sangrar" }] } },
  { nw: 1, a: "y te dejo tambien el enlace en la", k: "HighlightSweep", d: 5.5, p: { pre: "El enlace está en la ", highlight: "primera línea de la descripción", post: ".", note: "archivos-federer.vercel.app" } },
  { nw: 1, a: "la de las lineas de la piel ahorita", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "Escríbeme en los comentarios", phrase: "Haz la prueba de las líneas ahorita mismo y cuéntame qué viste." } },
  { nw: 1, a: "meses de dolor y unos cuantos miles de", k: "BulletCascade", d: 7.0, p: { eyebrow: "Compártelo con alguien que…", bullets: [{ pre: "Lleva meses ", key: "raspándose", post: " un callo que no se va" }, { pre: "Le puede ahorrar ", key: "meses de dolor" }, { pre: "Y unos cuantos ", key: "miles de pesos", post: " en tratamientos que no iban a funcionar" }] } },
  { nw: 1, a: "como se mira algo que te ha llevado", k: "KaraokePhrase", d: 6.0, p: { eyebrow: "Esta noche, una sola cosa", phrase: "Mírate los dos pies con calma. Te han llevado a todos lados." } },
];

// ── anclaje ──────────────────────────────────────────────────────────────────
// Los `nw:1` son la segunda tanda (la que baja el % de toma cruda del density_gate): se colocan
// DESPUÉS, en los huecos que dejan la primera tanda y las ventanas de avatar YA CONGELADAS.
const comps = [];
const compsNew = [];
const noAncla = [];
const noEspacio = [];
for (const c of C) {
  const ms = findMs(c.a);
  if (ms == null) { noAncla.push(c.a); continue; }
  const s = snap(ms);
  const beat = { ms_in: s, ms_out: s + Math.round(c.d * 1000), componente: c.k, props: c.p, img: c.img, d: Math.round(c.d * 1000), a: c.a };
  (c.nw ? compsNew : comps).push(beat);
}
comps.sort((a, b) => a.ms_in - b.ms_in);
compsNew.sort((a, b) => a.ms_in - b.ms_in);

// el video SIEMPRE abre con avatar: reservo [0, OPEN_END)
const OPEN_END = snap(4200);
for (const c of comps) if (c.ms_in < OPEN_END) { const sh = OPEN_END + 800 - c.ms_in; c.ms_in += sh; c.ms_out += sh; }
// separar colisiones
for (let i = 1; i < comps.length; i++) {
  if (comps[i].ms_in < comps[i - 1].ms_out + 1200) {
    const sh = comps[i - 1].ms_out + 1200 - comps[i].ms_in;
    comps[i].ms_in += sh; comps[i].ms_out += sh;
  }
}

// ── ventanas de avatar ───────────────────────────────────────────────────────
// ⛔ CONGELADAS: el reel de RunPod ya se cortó contra `_v3/fcspuntos_avwindows.json` y `win` es el
// ÍNDICE en esa lista. Si las ventanas se recalculan, cada win-NNN.mp4 queda sobre otro audio.
const AVW_FILE = `_v3/${SLUG}_avwindows.json`;
const FROZEN_AV = fs.existsSync(AVW_FILE) ? JSON.parse(fs.readFileSync(AVW_FILE, "utf8")) : null;
const N_AV = +(process.env.N_AV || 130);
const avSlots = FROZEN_AV ? FROZEN_AV.map((s) => ({ ...s })) : [];
if (!FROZEN_AV) {
  const step = TOTAL_MS / N_AV;
  for (let i = 0; i < N_AV; i++) {
    let start = snap(i * step);
    let end = snap(start + 4200);
    if (end - start < 2400) end = Math.min(TOTAL_MS, start + 3000);
    if (end - start > 6200) end = start + 6200;
    avSlots.push({ start, end });
  }
  for (let i = avSlots.length - 1; i >= 1; i--) {
    const s = avSlots[i];
    if (comps.some((c) => s.start < c.ms_out && s.end > c.ms_in)) avSlots.splice(i, 1);
  }
  avSlots[0].start = 0;
  avSlots[0].end = Math.max(OPEN_END, 3400);
  avSlots.sort((a, b) => a.start - b.start);
  for (let i = 1; i < avSlots.length; i++) {
    if (avSlots[i].start < avSlots[i - 1].end + 500) avSlots[i].start = avSlots[i - 1].end + 500;
    if (avSlots[i].end <= avSlots[i].start + 1500) avSlots[i].end = avSlots[i].start + 2800;
  }
  // descartar los que quedaron pisando un componente tras el corrimiento
  for (let i = avSlots.length - 1; i >= 1; i--) {
    const s = avSlots[i];
    if (comps.some((c) => s.start < c.ms_out && s.end > c.ms_in)) avSlots.splice(i, 1);
  }
}

// ── 2ª tanda de componentes: entran en los huecos, sin tocar avatar ni la 1ª tanda ───────────
{
  const PAD_AV = 500, PAD_C = 1200;
  const busy = [
    ...avSlots.map((s) => [s.start - PAD_AV, s.end + PAD_AV]),
    ...comps.map((c) => [c.ms_in - PAD_C, c.ms_out + PAD_C]),
  ];
  const fits = (s, e) => !busy.some(([a, b]) => s < b && e > a);
  const VENTANA = 75000;               // busca hueco hasta ±75 s del ancla (la sección dura minutos)
  const buscar = (desde, d, dir) => {  // dir +1 hacia adelante, -1 hacia atrás
    let s = desde, giros = 0;
    while (giros++ < 400 && s >= 0 && s + d <= TOTAL_MS && Math.abs(s - desde) <= VENTANA) {
      if (fits(s, s + d)) return s;
      const ch = busy.filter(([a, b]) => s < b && s + d > a);
      s = dir > 0 ? Math.max(...ch.map((x) => x[1])) + 1 : Math.min(...ch.map((x) => x[0])) - d - 1;
    }
    return null;
  };
  for (const c of compsNew) {
    const ade = buscar(c.ms_in, c.d, +1);
    const atr = buscar(c.ms_in, c.d, -1);
    const cand = [ade, atr].filter((x) => x != null).sort((x, y) => Math.abs(x - c.ms_in) - Math.abs(y - c.ms_in));
    if (!cand.length) { noEspacio.push(c.a); continue; }
    let s = cand[0];
    const sn = snap(s);                       // arrancar en palabra, pero solo si sigue entrando
    if (fits(sn, sn + c.d)) s = sn;
    c.ms_in = s; c.ms_out = s + c.d;
    busy.push([s - PAD_C, s + c.d + PAD_C]);
    comps.push(c);
  }
  comps.sort((a, b) => a.ms_in - b.ms_in);
  for (const c of comps) { delete c.d; delete c.a; }
}

// ── relleno con las fotos de los momentos ────────────────────────────────────
const pool = moments.map((m) => ({ ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + m.dur) * 1000), src: `img/${SLUG}/${m.name}.png` }));
const nearestImg = (ms) => {
  let best = pool[0].src, bd = Infinity;
  for (const p of pool) { const d = Math.abs((p.ms_in + p.ms_out) / 2 - ms); if (d < bd) { bd = d; best = p.src; } }
  return best;
};
function fillRange(a, b) {
  const out = [];
  const parts = pool.filter((p) => p.ms_out > a && p.ms_in < b).map((p) => ({ ms_in: Math.max(a, p.ms_in), ms_out: Math.min(b, p.ms_out), src: p.src }));
  let c = a;
  for (const p of parts) { if (p.ms_in > c) out.push({ ms_in: c, ms_out: p.ms_in, src: nearestImg((c + p.ms_in) / 2) }); out.push(p); c = Math.max(c, p.ms_out); }
  if (c < b) out.push({ ms_in: c, ms_out: b, src: nearestImg((c + b) / 2) });
  return out;
}
const fixed = [...avSlots.map((s) => ({ ms_in: s.start, ms_out: s.end })), ...comps.map((c) => ({ ms_in: c.ms_in, ms_out: c.ms_out }))].sort((a, b) => a.ms_in - b.ms_in);
const gaps = [];
let cur = 0;
for (const f of fixed) { if (f.ms_in > cur) gaps.push(...fillRange(cur, f.ms_in)); cur = Math.max(cur, f.ms_out); }
if (cur < TOTAL_MS) gaps.push(...fillRange(cur, TOTAL_MS));

// partir cualquier plano > 4,0 s: el clip de agnes dura 4,03 s y la compuerta de agnes_qc
// prohíbe que un plano sea MÁS LARGO que su clip (el loop repetiría el movimiento).
const MAXD = 4000, TARGET = 3400;
const planos = [];
for (const g of gaps) {
  const dur = g.ms_out - g.ms_in;
  if (dur < 700) continue;
  if (dur <= MAXD) { planos.push(g); continue; }
  const n = Math.max(Math.ceil(dur / MAXD), Math.round(dur / TARGET) || 1);
  const step = dur / n;
  for (let i = 0; i < n; i++) planos.push({ ms_in: Math.round(g.ms_in + i * step), ms_out: Math.round(g.ms_in + (i + 1) * step), src: g.src });
}
// Un clip de agnes NO se puede usar en dos planos (agnes_qc cuenta eso como `dobles`). Si la imagen
// del plano ya se usó, se toma la imagen LIBRE más cercana en el tiempo (hay 327 imágenes y 274
// clips): así no se repite la misma foto dos planos seguidos y casi todo queda animado.
const disponibles = new Map(); // name -> idx numérico
for (const f of fs.readdirSync(`public/broll/${SLUG}`)) {
  const m = f.match(/^(fcspuntos_(\d{3})(?:_[bc])?)\.mp4$/);
  if (m) disponibles.set(m[1], parseInt(m[2], 10));
}
const usado = new Set();
const tomarCercano = (idx) => {
  let best = null, bd = Infinity;
  for (const [n, i] of disponibles) { if (usado.has(n)) continue; const d = Math.abs(i - idx); if (d < bd) { bd = d; best = n; } }
  return best;
};
const clipList = [];
for (const b of planos) {
  const own = b.src.split("/").pop().replace(/\.png$/, "");
  const idx = parseInt(own.slice(-3), 10);
  const dur = b.ms_out - b.ms_in;
  let name = null;
  if (dur <= 4000) {
    for (const c of [own, own + "_b", own + "_c"]) if (!name && disponibles.has(c) && !usado.has(c)) name = c;
    if (!name) name = tomarCercano(idx);
  }
  if (name) {
    usado.add(name);
    b.tipo = "clip";
    b.clipSrc = `broll/${SLUG}/${name}.mp4`;
    b.src = `img/${SLUG}/${name}.png`;
    clipList.push({ name, srcImg: b.src });
  } else {
    b.tipo = "imagen";
  }
}

// ── plan final ───────────────────────────────────────────────────────────────
const beats = [];
avSlots.forEach((s, i) => beats.push({ tipo: "avatar", ms_in: s.start, ms_out: s.end, clip: null, win: i }));
for (const c of comps) {
  if (c.img) c.props = { ...c.props, [c.img]: nearestImg((c.ms_in + c.ms_out) / 2) };
  beats.push({ tipo: "componente", ms_in: c.ms_in, ms_out: c.ms_out, componente: c.componente, props: c.props });
}
for (const b of planos) beats.push(b.tipo === "imagen" ? { tipo: "imagen", ms_in: b.ms_in, ms_out: b.ms_out, src: b.src } : { tipo: "clip", ms_in: b.ms_in, ms_out: b.ms_out, src: b.clipSrc, srcImg: b.src });
beats.sort((a, b) => a.ms_in - b.ms_in);

// overlay CTA con QR sobre la sección CTA_GUIA
const ctaM = moments.filter((m) => m.sec === "CTA_GUIA");
const overlays = ctaM.length ? [{ componente: "RayCta", ms_in: Math.round(ctaM[0].t * 1000), ms_out: Math.round((ctaM[ctaM.length - 1].t + ctaM[ctaM.length - 1].dur) * 1000), props: { eyebrow: "EN LA DESCRIPCIÓN", title: "La Guía Completa de la Salud Después de los 60", sub: "+150 remedios como este, ordenados por tema", domain: "archivos-federer.vercel.app", qr: `img/${SLUG}_qrcard.png`, showQr: true } }] : [];

fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ totalMs: TOTAL_MS, beats, overlays }, null, 1));
fs.writeFileSync(`_v3/${SLUG}_avwindows.json`, JSON.stringify(avSlots, null, 1));
fs.writeFileSync(`_v3/${SLUG}_i2v.json`, JSON.stringify(clipList, null, 1));

const by = {}; for (const b of beats) by[b.tipo] = (by[b.tipo] || 0) + 1;
const kinds = {}; for (const b of beats) if (b.componente) kinds[b.componente] = (kinds[b.componente] || 0) + 1;
console.log(`totalMs ${TOTAL_MS} (${(TOTAL_MS / 60000).toFixed(1)} min) · beats ${beats.length} ·`, JSON.stringify(by));
console.log(`componentes ${comps.length} · tipos distintos ${Object.keys(kinds).length} · clips a animar ${clipList.length}`);
if (noAncla.length) { console.log(`⛔ ${noAncla.length} anclas NO encontradas:`); noAncla.slice(0, 8).forEach((a) => console.log("   " + a)); }
if (noEspacio.length) { console.log(`· ${noEspacio.length} de la 2a tanda sin hueco:`); noEspacio.slice(0, 30).forEach((a) => console.log("   " + a)); }
