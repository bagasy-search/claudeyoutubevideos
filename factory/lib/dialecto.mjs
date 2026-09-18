// dialecto.mjs — COMPUERTA DE DIALECTO. Cuatro patrones cerrados que `factory/tools/guion_gate.mjs`
// y `15_frases` miden sobre el guion cuando `style.dialecto` dice NEUTRO.
//
// Por qué existe: el clon de voz del canal está entrenado con un dialecto (freebuilder = español
// NEUTRO con "tú", verificado el 17-sep-2026 sobre tres videos publicados). Si el guion va en otro
// dialecto que la referencia, el clon DERIVA y la locución sale plana. No es una preferencia de
// estilo: es lo que hace que la voz suene como la del canal.
//
// ⛔⛔ LA LECCIÓN QUE MANDA ACÁ (está escrita en la cabecera de guion_gate.mjs y la repito porque es
//    la razón de que todo esto sea LISTA CERRADA y no una regla morfológica):
//    un detector con FALSOS POSITIVOS es PEOR que ninguno, porque manda a reescribir texto sano.
//    La 1ª versión marcaba `más`, `estás` y `después` como voseo — son neutro perfecto, "vos estás"
//    y "tú estás" se escriben igual — y cazaba `pasá` adentro de "pasándole" porque en JavaScript
//    `\b` NO funciona pegado a una vocal acentuada.
//    De ahí las dos reglas de este archivo:
//      1. LÍMITE DE PALABRA con lookarounds de \p{L} y bandera /u. NUNCA `\b`.
//      2. LISTA CERRADA. Sólo entra una forma que NO puede aparecer en español neutro sano.
//
// Formas que quedaron DELIBERADAMENTE AFUERA (cada una es un falso positivo medido o razonado):
//   · estás, más, después, quizás, jamás, atrás, detrás, además, demás, compás → neutro perfecto.
//   · tomás  → el PRESENTADOR del canal se llama Tomás. Marcarlo rompería todos los guiones.
//   · abrí, subí, salí, viví, seguí, pedí, medí, escribí, recibí, sentí, dormí, cubrí, sufrí
//     → el imperativo voseante de los verbos en -ir es IDÉNTICO al pretérito de 1ª persona:
//       "yo abrí la puerta" es neutro impecable. Ambiguo = afuera.
//   · bebé  → también es el sustantivo (un bebé). tomate → también es el tomate.
//   · vale, tío, plata, cubo, durazno, vereda → significado corriente en neutro.
//   · telgopor, unicel, icopor → el estilo PIDE nombrarlos una vez con sus variantes.
//   · decís / venís quedan ADENTRO porque su pretérito de 1ª persona es "dije" / "vine".

/** Une una lista cerrada de palabras en un patrón con límite de palabra Unicode-seguro. */
const PAL = (arr) => new RegExp(`(?<!\\p{L})(?:${arr.join("|")})(?!\\p{L})`, "giu");

// ── 1. VOSEO / VOSOTROS en presente de indicativo ────────────────────────────
// Formas cuyo acento final las vuelve imposibles en la conjugación de "tú".
const VOSEANTE = [
  // irregulares y -ir (pretérito de 1ª distinto → sin ambigüedad)
  "sos", "tenés", "venís", "decís", "querés", "podés", "sabés", "hacés", "ponés", "seguís",
  // -ar
  "agarrás", "aplicás", "apretás", "armás", "buscás", "calculás", "cargás", "cerrás", "comprás",
  "cortás", "cuidás", "dejás", "dudás", "echás", "empezás", "entrás", "esperás", "estirás",
  "fijás", "frotás", "girás", "guardás", "juntás", "levantás", "lijás", "limpiás", "llenás",
  "llevás", "manejás", "marcás", "mezclás", "mirás", "mojás", "mostrás", "necesitás", "notás",
  "olvidás", "pasás", "pegás", "pensás", "pintás", "preparás", "probás", "quedás", "rascás",
  "rayás", "rompés", "sacás", "secás", "sumás", "tapás", "tardás", "terminás", "tirás", "tocás",
  "trabajás", "tratás", "usás", "ventilás", "volcás",
  // -er
  "aprendés", "barrés", "comés", "corrés", "cosés", "creés", "debés", "entendés", "leés",
  "metés", "movés", "perdés", "prendés", "respondés", "revolvés", "vendés", "volvés",
];

const VOSOTROS = [
  "vosotros", "vosotras", "vuestro", "vuestra", "vuestros", "vuestras", "sois", "habéis",
  "estáis", "tenéis", "hacéis", "podéis", "queréis", "sabéis", "ponéis", "coméis", "miráis",
  "vais", "dais", "veis", "echáis", "dejáis", "usáis", "mezcláis", "limpiáis",
];

export const VOSEO_VERBO = PAL([...VOSEANTE, ...VOSOTROS]);

// ── 2. VOSEO / VOSOTROS en imperativo afirmativo ─────────────────────────────
const IMPERATIVO = [
  // -ar (la forma llana con tilde final no existe en neutro)
  "agarrá", "aplicá", "apretá", "armá", "bajá", "buscá", "cargá", "cerrá", "comprá", "cortá",
  "cuidá", "dejá", "echá", "empezá", "esperá", "fijá", "frotá", "girá", "guardá", "juntá",
  "levantá", "lijá", "limpiá", "llená", "llevá", "marcá", "mezclá", "mirá", "mojá", "pará",
  "pasá", "pegá", "pensá", "pintá", "prepará", "probá", "rascá", "sacá", "secá", "sumá", "tapá",
  "tirá", "tocá", "tratá", "usá", "ventilá", "andá",
  // -er / irregulares (sin choque con el pretérito de 1ª)
  "aprendé", "barré", "comé", "corré", "hacé", "leé", "meté", "perdé", "poné",
  "prendé", "respondé", "revolvé", "tené", "vendé", "volvé", "decí", "vení", "movete",
  // pronominales voseantes (la forma de "tú" lleva tilde en otra sílaba: fíjate, acuérdate)
  "fijate", "acordate", "quedate", "llevate", "sacate", "dejate", "mirate", "guardate",
  "andate", "pegate", "limpiate", "secate", "ponete", "hacete", "acercate", "asegurate",
  // vosotros
  "mirad", "haced", "poned", "tened", "echad", "dejad", "mezclad", "limpiad", "venid", "decid",
];

export const VOSEO_IMPER = PAL(IMPERATIVO);

// ── 3. Palabras MUY regionales ───────────────────────────────────────────────
// Sólo las que ningún oyente de otro país usaría, y que no tienen un segundo significado corriente.
// El estilo permite nombrar UNA vez un material con sus variantes ("telgopor, unicel o icopor"):
// esas NO entran acá.
export const REGIONAL = PAL([
  // España
  "ordenador", "coche", "patata", "patatas", "zumo", "melocotón", "fregona", "grifo", "chaval",
  "chavales", "curro", "follón", "cutre", "chulo", "guay", "cacharro", "tiquismiquis", "gilipollas",
  // Río de la Plata
  "birome", "remera", "frutilla", "palta", "choclo", "poroto", "porotos", "pileta", "heladera",
  "colectivo", "nafta", "pochoclo", "laburo", "laburar", "pibe", "guita", "quilombo", "macanudo",
  "morfar", "bondi", "changa", "boludo", "boluda",
  // México / Centroamérica fuertes
  "chamba", "chido", "padrísimo", "órale", "güey", "wey", "lana", "camión",
]);

// ── 4. Palabras SIN TILDE (aviso, no falla) ──────────────────────────────────
// En el guion hablado no se oye; pero si esa frase termina dentro de un COMPONENTE, la tilde
// faltante se ve en pantalla. Por eso guion_gate la manda a `avisos`, no a `fallas`.
const SIN_TILDE_PAL = [
  "asi", "aqui", "alli", "ahi", "tambien", "despues", "ademas", "segun", "dia", "dias",
  "estan", "sera", "seran", "haras", "frio", "rapido", "facil", "dificil", "util", "utiles",
  "numero", "numeros", "quimico", "quimica", "plastico", "electrico", "humedo", "solido",
  "liquido", "acido", "oxido", "basico", "tipico", "minimo", "maximo", "proximo", "ultimo",
  "unico", "unica", "comun", "jabon", "carton", "algodon", "limon", "presion", "metodo",
  "milimetro", "centimetro", "kilometro", "espatula", "azucar",
];
// …más la familia -ción / -sión en SINGULAR (el plural no lleva tilde: "soluciones" es correcto).
export const SIN_TILDE = new RegExp(
  `(?<!\\p{L})(?:${SIN_TILDE_PAL.join("|")}|\\p{L}{2,}(?:cion|sion))(?!\\p{L})`,
  "giu",
);

/**
 * Mide un guion contra el dialecto que pide el estilo.
 * Devuelve SIEMPRE cuánto midió por patrón — una compuerta que dice "0" sin decir sobre cuántas
 * palabras miró es un FALLO, no un verde.
 *
 * @returns {{ pide:boolean, palabras:number, fallas:string[], avisos:string[], medido:object }}
 */
export function medirDialecto(texto, style, { maxEjemplos = 8 } = {}) {
  const txt = String(texto || "").replace(/^﻿/, "");
  const palabras = (txt.match(/\p{L}+/gu) || []).length;
  const pide = /NEUTRO/i.test(style?.dialecto || "");
  const medido = { palabrasMedidas: palabras, dialectoNeutro: pide };
  if (!pide) return { pide: false, palabras, fallas: [], avisos: [], medido };

  const linea = (i) => txt.slice(0, i).split("\n").length;
  const ctx = (i, n = 46) => "…" + txt.slice(Math.max(0, i - 14), i + n).replace(/\s+/g, " ") + "…";
  const fallas = [], avisos = [];

  const medir = (re, què, dest) => {
    const hits = [...txt.matchAll(re)];
    for (const m of hits.slice(0, maxEjemplos)) dest.push(`línea ${linea(m.index)}: ${què} "${m[0].trim()}" ${ctx(m.index)}`);
    if (hits.length > maxEjemplos) dest.push(`  …y ${hits.length - maxEjemplos} más de "${què}"`);
    return hits.length;
  };

  medido.voseoVerbo = medir(VOSEO_VERBO, "voseo (verbo)", fallas);
  medido.voseoImperativo = medir(VOSEO_IMPER, "voseo (imperativo)", fallas);
  medido.regionalismos = medir(REGIONAL, "palabra muy regional", fallas);
  medido.sinTilde = medir(SIN_TILDE, "palabra sin tilde", avisos);
  return { pide: true, palabras, fallas, avisos, medido };
}
