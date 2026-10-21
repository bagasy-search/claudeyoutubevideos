// chuy01 · escenas del MUNDO después del minuto 1 (t ≥ 72,3). Cada escena = un tramo VISIBLE del taller entre ventanas del avatar.
// La cámara sólo viaja dentro de la escena; entre escenas salta (el mundo está tapado por el avatar o por una foto).
// Estados del carro/motor por escena (rayos X, despiece, tapa, elevador…) + efectos con su ventana, todo anclado a la voz.
import { makeAt } from "./at";
import CAPS from "./caps.json";

export const at = makeAt(CAPS as [string, number][]);
type V3 = [number, number, number];
export type CK = { t: number; p: V3; l: V3; fov?: number };
// fx: nombre → [entra, sale] (segundos globales)
export type Scene = {
  a: number; b: number; keys: CK[];
  xr?: number; X?: number; cov?: number; ly?: number | [number, number, number, number]; // ly animado: [t0, t1, desde, hasta]
  fx?: Record<string, [number, number]>;
  cx?: [number, number, number, number]; // carro saliendo: [t0, t1, desde, hasta]
};

const T = {
  marca: at("ninguna marca"), aceite: at("Empecemos por donde"), turbo: at("Este es un motor turbo"), caliente: at("trabaja muy caliente"),
  vueltas: at("100,000 vueltas"), lubrica: at("se lubrica"), normal: at("no es manejo normal"), severo: at("Eso es servicio severo"),
  mil15: at("entre 15 y 25 mil"), tapa: at("Ahora sí, le"), limpios: at("árboles de levas limpios"), buzos: at("los buzos parejos"),
  c180: at("180, 179"), parejitos: at("Parejitos"), cansado: at("Un motor cansado"), esteNo: at("Este no"),
  bloque: at("bloque y la cabeza"), cadena: at("la cadena de distribución"), noBanda: at("no banda"),
  viejo: at("Si el aceite está viejo"), estira: at("la cadena se estira"), medi: at("Le medí el estiramiento"),
  costra: at("Ve esa costra"), hongos: at("parecen hongos"), porque: at("Por qué pasa"), inyecta: at("se inyecta adentro"),
  cocinan: at("cocinan y se hace costra"), todos: at("casi todos los motores"),
  electrico: at("pasamos a lo eléctrico"), cableado: at("el cableado de estos carros"), corrugado: at("tubo corrugado"), hule: at("sello de hule"), tierras: at("las tierras"),
  sulfato: at("Ninguno con sulfato"), clip: at("clip de plástico roto"),
  plasticos: at("Ahora los plásticos"), carcasa: at("La carcasa del termostato"), grieta: at("tenía una grieta"),
  frio: at("con el motor frío"), dedo: at("Pásele el dedo"),
  soldaduras: at("Las soldaduras de puntos"), parejitas: at("parejitas"), robot: at("trabajo de robot"), piso: at("El piso trae"),
  union: at("la unión del larguero"), sellador: at("el sellador estaba"), oxido: at("óxido superficial"),
  vibraba: at("el volante vibraba"), amort: at("Los amortiguadores"), soportes: at("Los soportes"),
  transm: at("la transmisión. Este"), doble: at("doble embrague"), muestra: at("Le saqué una muestra"),
  esperaba: at("Que yo esperaba encontrar"), bienHecho: at("un motor bien hecho"), soldRobot: at("con soldaduras de robot"), cableado2: at("un cableado mejor sellado"),
  arranque: at("Arránquelo en frío"), pidale: at("Pídale al vendedor"),
  casiNadie: at("La que casi nadie sabe"), negocie: at("negocie el precio"), elevador: at("Súbalo a un elevador"),
  hicimos: at("Al dueño le hicimos"), tranquilo: at("Se fue tranquilo"),
  nadaMas: at("Nada más eso"), limpia: at("verdad limpia"),
};
export const TW = T;

export const SCENES: Scene[] = [
  // 80,2 → 82,5 (aún en el tramo de "café de olla"): el taller entero desde el portón, carro arriba, cofre abierto
  { a: 80.1, b: 82.6, ly: 0.42, keys: [{ t: 80.1, p: [6.6, 2.1, 4.6], l: [-1, 1.0, 0], fov: 40 }, { t: 82.6, p: [5.6, 1.95, 3.5], l: [-1, 0.95, 0], fov: 38 }] },
  // "Empecemos por donde empieza todo" → el cárter en rayos X, el aceite negro
  { a: T.aceite - 0.4, b: 99.2, ly: 0.42, xr: 1, fx: { darkoil: [T.aceite, 120] },
    keys: [{ t: T.aceite - 0.4, p: [-2.7, 1.35, 2.7], l: [-1.42, 0.35, 0], fov: 36 }, { t: 99.2, p: [-2.25, 0.95, 1.95], l: [-1.42, 0.25, 0], fov: 32 }] },
  // el turbo: gira, se calienta, el aceite le corre por la línea dorada
  { a: 119.3, b: 132.3, ly: 0.42, xr: 0.55, fx: { spin: [T.vueltas - 0.3, 132.5], hot: [T.caliente, 132.5], oilflow: [T.lubrica - 0.2, 132.5] },
    keys: [{ t: 119.3, p: [-2.9, 2.4, -2.7], l: [-1.15, 0.65, -0.2], fov: 34 }, { t: 125.5, p: [-2.3, 1.85, -1.8], l: [-1.12, 0.6, -0.22], fov: 30 }, { t: 132.3, p: [-1.85, 1.45, -1.25], l: [-1.1, 0.55, -0.24], fov: 28 }] },
  // "eso no es manejo normal … servicio severo": desde la calle, contra el sol del portón
  { a: 136.9, b: 149.9, ly: 0.42, fx: { heat: [136.9, 150] },
    keys: [{ t: 136.9, p: [7.4, 1.4, 1.3], l: [-0.6, 1.0, 0], fov: 36 }, { t: 149.9, p: [6.1, 1.55, 0.4], l: [-0.8, 1.0, 0], fov: 32 }] },
  // precio del servicio vs turbo nuevo (el turbo de cerca, otro ángulo) → "Ahora sí, le quito la tapa" (la tapa se levanta)
  { a: 153.9, b: 165.2, ly: 0.42, fx: { hot: [153.9, 160], cover: [T.tapa + 0.25, 1e9] },
    keys: [{ t: 153.9, p: [-2.1, 1.25, -2.2], l: [-1.1, 0.55, -0.2], fov: 30 }, { t: T.tapa - 0.6, p: [-2.4, 1.6, -1.6], l: [-1.2, 0.65, -0.1], fov: 32 }, { t: 165.2, p: [-2.9, 2.05, 0.9], l: [-1.42, 0.75, 0], fov: 34 }] },
  // los árboles de levas limpios, desde arriba
  { a: 169.4, b: 182.7, ly: 0.42, cov: 1, fx: { camglow: [T.limpios, 182.7] },
    keys: [{ t: 169.4, p: [-1.95, 1.95, 1.05], l: [-1.42, 0.78, 0], fov: 32 }, { t: 176, p: [-1.7, 1.7, 0.5], l: [-1.42, 0.78, 0], fov: 28 }, { t: 182.7, p: [-1.55, 1.62, -0.55], l: [-1.42, 0.76, 0], fov: 26 }] },
  // compresión: 4 columnas sobre los cilindros
  { a: 204.3, b: 215.0, ly: 0.42, xr: 1, cov: 1, fx: { comp: [204.3, 215], tired: [T.cansado, T.esteNo + 0.2] },
    keys: [{ t: 204.3, p: [-3.1, 1.55, 1.8], l: [-1.42, 0.55, 0], fov: 34 }, { t: 215.0, p: [-3.3, 1.7, 0.9], l: [-1.42, 0.6, 0], fov: 32 }] },
  // la cadena de distribución (costado del motor)
  { a: 218.4, b: 231.4, ly: 0.42, xr: 0.7, cov: 1, fx: { chain: [T.cadena, 231.5], belt: [T.noBanda - 0.2, 231.5] },
    keys: [{ t: 218.4, p: [-2.6, 2.2, 2.3], l: [-1.42, 0.45, 0.2], fov: 34 }, { t: T.cadena + 1.5, p: [-1.6, 2.05, 1.15], l: [-1.42, 0.36, 0.33], fov: 30 }, { t: 231.4, p: [-1.5, 2.0, 1.0], l: [-1.42, 0.34, 0.33], fov: 28 }] },
  // el tensor que no empuja parejo: la cadena se afloja
  { a: 236.9, b: 243.0, ly: 0.42, xr: 0.7, cov: 1, fx: { chain: [236.9, 243], slack: [T.viejo + 0.5, 243], dirty: [236.9, 243] },
    keys: [{ t: 236.9, p: [-1.5, 1.95, 1.0], l: [-1.4, 0.36, 0.33], fov: 30 }, { t: 243.0, p: [-1.45, 1.85, 0.9], l: [-1.38, 0.34, 0.33], fov: 26 }] },
  // inyección directa: la gasolina adentro del cilindro, las válvulas de admisión con costra
  { a: 277.7, b: 284.7, ly: 0.42, xr: 1, cov: 1, fx: { carbon: [277.7, 300], spray: [T.porque + 0.6, 284.7] },
    keys: [{ t: 277.7, p: [-2.0, 2.3, 1.3], l: [-1.42, 0.5, 0], fov: 32 }, { t: 284.7, p: [-1.6, 2.05, 0.75], l: [-1.42, 0.48, 0], fov: 28 }] },
  // vapores de la ventilación del cárter que se pegan
  { a: 290.9, b: 302.1, ly: 0.42, xr: 1, cov: 1, fx: { carbon: [277.7, 302.2], pcv: [290.9, 302.2] },
    keys: [{ t: 290.9, p: [-2.8, 1.65, -1.6], l: [-1.5, 0.45, 0], fov: 34 }, { t: 302.1, p: [-3.0, 1.85, 0.4], l: [-1.5, 0.5, 0], fov: 34 }] },
  // lo eléctrico: el arnés del motor se ilumina
  { a: T.electrico - 0.3, b: 335.8, ly: 0.42, cov: 0, fx: { harness: [T.electrico, 336] },
    keys: [{ t: T.electrico - 0.3, p: [-3.1, 2.0, 1.3], l: [-1.6, 0.85, 0.1], fov: 34 }, { t: 335.8, p: [-2.3, 1.65, 0.65], l: [-1.6, 0.85, 0.1], fov: 30 }] },
  // corrugado, sello de hule, tierras
  { a: 340.7, b: 351.1, ly: 0.42, fx: { harness: [340.7, 351.1], seals: [T.hule - 0.2, 351.1] },
    keys: [{ t: 340.7, p: [-2.0, 1.55, 1.5], l: [-1.65, 0.85, 0.35], fov: 30 }, { t: 351.1, p: [-2.25, 1.6, -0.6], l: [-1.6, 0.85, -0.2], fov: 30 }] },
  // 40 y tantos conectores, ninguno con sulfato
  { a: 355.8, b: T.clip - 0.1, ly: 0.42, fx: { harness: [355.8, 362], check: [355.9, T.clip] },
    keys: [{ t: 355.8, p: [-2.7, 1.9, 0.9], l: [-1.6, 0.85, 0.1], fov: 32 }, { t: T.clip - 0.1, p: [-2.5, 1.8, 0.4], l: [-1.6, 0.85, 0.1], fov: 30 }] },
  // la carcasa del termostato con la grieta
  { a: T.plasticos - 0.2, b: 384.4, ly: 0.42, fx: { crack: [T.grieta, 385] },
    keys: [{ t: T.plasticos - 0.2, p: [-2.4, 1.6, -1.6], l: [-1.4, 0.65, -0.35], fov: 32 }, { t: 384.4, p: [-1.85, 1.2, -1.0], l: [-1.38, 0.62, -0.42], fov: 24 }] },
  // con el motor frío: el vano en azul, se pasa el dedo
  { a: 405.2, b: 412.0, ly: 0.42, fx: { cold: [405.2, 412], crack: [405.2, 412] },
    keys: [{ t: 405.2, p: [-2.9, 2.2, -0.4], l: [-1.42, 0.62, -0.2], fov: 32 }, { t: 412.0, p: [-2.4, 1.7, -0.9], l: [-1.4, 0.62, -0.38], fov: 28 }] },
  // lo subí bien alto: por debajo, las soldaduras de punto
  { a: 422.8, b: 432.5, ly: 1.55, fx: { welds: [T.soldaduras, 432.5], ruler: [T.parejitas, 432.5] },
    keys: [{ t: 422.8, p: [2.4, 0.45, 2.3], l: [0.4, -0.25, 0.7], fov: 40 }, { t: 432.5, p: [0.2, 0.5, 2.2], l: [0.6, -0.2, 0.75], fov: 36 }] },
  // el sellador incompleto: la franja con óxido (larguero trasero, lado derecho)
  { a: 436.0, b: 449.1, ly: 1.55, fx: { rust: [T.sellador, 1e9] },
    keys: [{ t: 436.0, p: [2.9, 0.55, 1.9], l: [1.35, -0.3, 0.75], fov: 34 }, { t: 449.1, p: [2.1, 0.6, 1.45], l: [1.35, -0.32, 0.78], fov: 26 }] },
  // volante que vibra, amortiguadores y soportes bien (la suspensión delantera desde abajo)
  { a: 489.7, b: 501.8, ly: 1.55, fx: { brakes: [489.7, 496], mounts: [T.soportes - 0.2, 501.8], shocks: [T.amort - 0.2, 501.8] },
    keys: [{ t: 489.7, p: [-0.9, 0.95, 2.3], l: [-1.25, 0.3, 0.6], fov: 34 }, { t: 501.8, p: [-2.4, 0.9, 1.9], l: [-1.4, 0.32, 0.3], fov: 32 }] },
  // la transmisión de doble embrague (rayos X)
  { a: 507.3, b: 518.5, ly: 1.55, xr: 1, fx: { gear: [T.transm, 518.5], dirtyatf: [T.muestra, 1e9] },
    keys: [{ t: 507.3, p: [-2.5, 0.95, -2.3], l: [-1.42, 0.42, -0.5], fov: 34 }, { t: 518.5, p: [-2.0, 0.9, -1.6], l: [-1.42, 0.42, -0.5], fov: 28 }] },
  // el veredicto: órbita grande, el carro abajo, todo armado
  { a: 539.3, b: 551.7, ly: [539.3, 541.5, 1.55, 0.42], fx: { glowok: [T.bienHecho, 551.7] },
    keys: [{ t: 539.3, p: [-4.8, 2.2, 4.2], l: [-0.6, 0.55, 0], fov: 40 }, { t: 545.5, p: [-2.4, 2.0, 5.0], l: [-0.6, 0.55, 0], fov: 38 }, { t: 551.7, p: [0.6, 1.9, 5.2], l: [-0.6, 0.55, 0], fov: 38 }] },
  // la balanza (el taller desenfocado detrás)
  { a: 556.0, b: 567.2, ly: 0.42, keys: [{ t: 556.0, p: [4.2, 1.7, 5.0], l: [-0.6, 0.7, 0], fov: 38 }, { t: 567.2, p: [3.4, 1.6, 5.4], l: [-0.6, 0.7, 0], fov: 38 }] },
  // 2. arránquelo en frío: la cadena cascabelea
  { a: 591.2, b: 602.1, ly: 0.42, xr: 0.7, cov: 1, fx: { run: [T.arranque + 0.4, 602.1], rattle: [T.arranque + 0.4, T.arranque + 3.2], chain: [591.2, 602.1] },
    keys: [{ t: 591.2, p: [-2.4, 2.2, 2.1], l: [-1.42, 0.45, 0.25], fov: 32 }, { t: 602.1, p: [-1.55, 2.0, 1.05], l: [-1.42, 0.38, 0.33], fov: 28 }] },
  // 5. el aceite de la transmisión → 6. súbalo a un elevador
  { a: 620.9, b: 634.2, ly: [T.elevador, T.elevador + 1.4, 0.42, 1.3], xr: 1, fx: { gear: [620.9, T.elevador], dirtyatf: [620.9, 1e9] },
    keys: [{ t: 620.9, p: [-2.4, 2.3, -1.9], l: [-1.42, 0.3, -0.5], fov: 32 }, { t: T.elevador - 0.3, p: [-1.6, 2.1, -1.15], l: [-1.42, 0.3, -0.5], fov: 28 }, { t: T.elevador + 0.1, p: [-4.6, 1.5, 3.9], l: [0, 0.3, 0], fov: 40 }, { t: 634.2, p: [-3.9, 1.3, 3.4], l: [0, 0.3, 0], fov: 38 }] },
  // lo que se le hizo: baja el elevador, todo cerrado, y el carro se va por el portón
  { a: 654.6, b: 666.9, ly: [654.6, 657.2, 1.3, 0], cx: [T.tranquilo, T.tranquilo + 2.6, 0, 11], fx: { repaired: [T.hicimos, 666.9], run: [T.tranquilo - 0.6, 667] },
    keys: [{ t: 654.6, p: [-4.4, 1.7, 4.4], l: [0, 0.7, 0], fov: 40 }, { t: T.tranquilo, p: [-3.6, 1.55, 3.4], l: [1.0, 0.8, 0], fov: 40 }, { t: 666.9, p: [-2.6, 1.6, 2.5], l: [8.0, 1.2, 0], fov: 42 }] },
  // la llamada final (taller vacío, el sol del portón)
  { a: T.nadaMas - 0.3, b: 683.5, ly: 0, cx: [0, 1, 11, 11], fx: { dusk: [T.nadaMas - 0.3, 704] },
    keys: [{ t: T.nadaMas - 0.3, p: [-3.2, 1.75, 3.6], l: [3, 1.1, 0], fov: 42 }, { t: 683.5, p: [-2.4, 1.6, 2.8], l: [3, 1.1, 0], fov: 40 }] },
  // cierre: la cortina del portón baja
  { a: 701.6, b: 703.4, ly: 0, cx: [0, 1, 11, 11], fx: { dusk: [690, 704], shutter: [T.limpia - 0.2, T.limpia + 1.3] },
    keys: [{ t: 701.6, p: [-3.6, 1.65, 0.6], l: [8, 1.5, 0], fov: 40 }, { t: 703.4, p: [-3.2, 1.6, 0.5], l: [8, 1.5, 0], fov: 38 }] },
];

export const sceneAt = (t: number): Scene => {
  let s = SCENES[0];
  for (const sc of SCENES) if (t >= sc.a) s = sc;
  return s;
};
