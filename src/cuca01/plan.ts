// cuca01 · PLAN de planos del minuto 2 al final: cada plano arranca en la FRASE que lo pide (at("frase")).
//   "w:<vista>"  = el mundo 3D (la cámara vuela a esa vista; el comal cambia de estado con `st`)
//   "i:<id>"     = foto/toma real (LTX si ya llegó) con su empuje propio
// El avatar NO va acá: entra solo en sus ventanas pagadas (avwin.json) y tapa lo que haya debajo.
import { at } from "./lib";

export type St = { cal?: number; ash?: number; heat?: number; tatem?: number; dark?: number; gotas?: number; grieta?: number; zonas?: number;
  pepitas?: number; nopal?: number; chiles?: number; tomatillo?: number; sal?: number; comal2?: number; humo?: number; puff?: number; tort?: number };
export type Beat = { a: number; kind: "w" | "i"; arg: string; st: St };
type V3 = [number, number, number];
export const VIEW: Record<string, { p: V3; l: V3; fov: number }> = {
  top: { p: [0.75, 1.78, -1.12], l: [0.75, 0.93, -1.72], fov: 34 },
  side: { p: [1.55, 1.32, -0.95], l: [0.78, 0.93, -1.68], fov: 36 },
  low: { p: [0.15, 1.1, -0.95], l: [0.78, 0.94, -1.72], fov: 33 },
  front: { p: [0.95, 1.42, -0.62], l: [0.74, 0.93, -1.7], fov: 36 },
  left: { p: [-0.15, 1.45, -0.75], l: [0.74, 0.93, -1.7], fov: 33 },
  fogon: { p: [0.75, 0.7, 0.75], l: [0.75, 0.38, -1.3], fov: 42 },
  orilla: { p: [1.75, 0.95, -0.45], l: [0.75, 0.6, -1.5], fov: 38 },
  cocina: { p: [1.8, 1.75, 1.9], l: [-1.4, 0.85, -0.9], fov: 44 },
  mesa: { p: [-0.9, 1.55, 1.0], l: [-1.9, 0.85, -0.45], fov: 38 },
  clavo: { p: [-1.9, 1.7, 1.45], l: [-3.42, 1.68, 0.95], fov: 38 },
  patio: { p: [6.6, 2.5, 2.6], l: [15.0, 1.8, 0.6], fov: 40 },
  chayo: { p: [9.2, 2.1, 3.0], l: [15.5, 2.0, 0.5], fov: 34 },
  salida: { p: [4.2, 2.4, 4.4], l: [-0.6, 1.0, -1.4], fov: 44 },
};

// tiempos de cada truco (el "Truco número N" de la voz)
const NUM = ["uno", "dos", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
let cur = 144;
export const TR: number[] = NUM.map((n) => (cur = at("truco numero " + n, cur)));
export const T_FIX = at("si ya hizo todo esto"), T_CUENTA = at("dejeme hacerle una cuenta"), T_CTA2 = at("ya que estamos en confianza", 740);
export const T_SEMANA = at("semana no cambie todo"), T_COMENT = at("cuenteme aqui abajo en los comentarios"), T_CHAYO = at("si quiere ver lo que cocina");
export const T_GRACIAS = at("gracias por quedarse aqui conmigo"), T_CTA1 = 112.0, T_COMAL = at("ahora si al comal");

// [frase, plano, estado]; la frase se busca desde el arranque de su bloque
type Row = [string, string, St?];
const BLOQUES: [number, Row[]][] = [
  // CTA 1 (audio nuevo, sin avatar: los labios del reel dicen otra cosa) → "Ahora sí, al comal"
  [T_CTA1, [["suscribase y active", "w:cocina"], ["y digame una cosa mija", "w:top"], ["con jabon con agua nomas", "w:low"], ["y si tiene una abuela", "w:mesa"], ["y los 25 trucos", "w:cocina"], ["ahora si al comal", "w:side"]]],
  [TR[0], [["truco numero uno", "w:top"], ["ya se su suegra", "i:m2_t01"], ["pero el barro es como una esponja", "i:m2_d01"], ["por eso a veces la tortilla", "w:low"], ["el barro se limpia en seco", "w:top"]]],
  [TR[1], [["truco numero dos", "w:front"], ["usted lo compra en el mercado", "i:m2_d02"], ["se disuelve un puno de cal", "i:m2_t02"], ["con un trapo se le unta", "w:top", { cal: 1 }], ["se deja secar", "w:side", { cal: 1, heat: 0.4 }], ["en el rancho lo haciamos con cal", "w:front", { cal: 1 }]]],
  [TR[2], [["truco numero 3", "w:side", { dark: 1, tort: 0 }], ["no esta echado a perder", "w:low", { dark: 1, tort: 0 }], ["mi mama le daba su lechadita", "i:m2_t03"], ["el comal le avisa", "w:top", { cal: 0.7 }]]],
  [TR[3], [["truco numero 4", "w:mesa", { comal2: 1 }], ["se lava una sola vez", "w:mesa", { comal2: 1 }], ["se seca en la lumbre", "i:m2_t04"], ["y queda negro parejito", "i:m2_d04"], ["ese negro no es mugre", "w:mesa", { comal2: 1 }]]],
  [TR[4], [["truco numero 5", "w:orilla", { heat: 0.5 }], ["se lo digo porque a mi", "i:m2_d06"], ["primero en la orilla del fogon", "i:m2_t05"], ["el barro es como la gente grande", "w:fogon"]]],
  [TR[5], [["nunca le eche agua fria", "i:m2_t06"], ["el cambio de temperatura", "w:low", { heat: 0.6, grieta: 1, tort: 0 }]]],
  [TR[6], [["la gota de agua", "w:top", { heat: 0.5 }], ["se moja la punta de los dedos", "i:m2_t07"], ["si la gota se queda ahi quietecita", "w:low", { gotas: 0.33, heat: 0.3, tort: 0 }], ["ningun termometro", "i:m2_d07"]]],
  [TR[7], [["truco numero 8", "w:top", { zonas: 1 }], ["en el centro donde pega", "w:top", { zonas: 1, tatem: 1 }], ["en la orillita esperan", "w:top", { zonas: 1, tatem: 1 }], ["asi me lo enseno mi mama", "i:m2_t08"]]],
  [TR[8], [["la tortilla se voltea tres veces", "w:side"], ["la primera vuelta es rapidito", "i:m2_d09"], ["la segunda cuando", "i:m2_t09"], ["tres vueltas", "w:front"]]],
  [TR[9], [["truco numero 10", "w:low", { puff: 1 }], ["aprietela tantito", "i:m2_t10"], ["ahi el vapor se acomoda", "i:m2_d10"], ["esa tortilla inflada", "w:low", { puff: 1 }]]],
  [TR[10], [["por fuera ya se quemo", "i:m2_t11"], ["hay que bajarla a la zona", "w:top", { zonas: 1, heat: 0.8 }], ["mucha gente cree", "w:fogon", { heat: 0.8 }]]],
  [TR[11], [["es sin aceite", "w:top", { tatem: 1, tort: 0 }], ["el jitomate la cebolla", "i:m2_d12"], ["ese negrito le quita lo acido", "i:m2_t12"], ["si le echa aceite", "w:side", { tatem: 1, tort: 0 }]]],
  [TR[12], [["truco numero 13", "w:low", { tatem: 1, tort: 0 }], ["cuando ya esta nomas se aprieta", "i:m2_t13"], ["el ajo pelado", "w:top", { tatem: 1, tort: 0 }]]],
  [TR[13], [["truco numero 14", "w:top", { chiles: 1, tort: 0 }], ["cambia de color y suelta su olor", "i:m2_t14"], ["si se le pasa y se pone negro", "i:m2_d14"]]],
  [TR[14], [["el tomate verde se tatema", "w:top", { tomatillo: 1, tort: 0 }], ["se pone verde clarito", "i:m2_d15"], ["se raspa con la cuchara", "i:m2_t15"]]],
  [TR[15], [["truco numero 16", "w:low", { pepitas: 1, tort: 0 }], ["se mueven todo el tiempo", "i:m2_t16"], ["el ajonjoli cuando se pone doradito", "i:m2_d16"], ["un minuto de mas", "w:top", { pepitas: 1, tort: 0 }]]],
  [TR[16], [["truco numero 17", "w:top", { nopal: 1, tort: 0 }], ["la baba se seca en el comal", "i:m2_d17"], ["mi comadre chayo dice", "i:m2_t17"]]],
  [TR[17], [["truco numero 18", "w:side", { humo: 1 }], ["y se pone en el comal", "i:m2_t18"], ["el vapor la ablanda", "w:low", { humo: 1 }]]],
  [TR[18], [["una encima de otra", "i:m2_t19"], ["el vapor de unas", "i:m2_d19"]]],
  [TR[19], [["truco numero 20", "w:top"], ["se le echa un punito de ceniza", "w:top", { ash: 1, tort: 0 }], ["se talla en circulitos", "i:m2_t20"], ["es lo que usaban nuestras abuelas", "i:m2_d20"], ["y la ceniza mija", "w:fogon"]]],
  [TR[20], [["truco numero 21", "w:side", { tort: 0 }], ["el cuchillo y la fibra", "i:m2_t21"], ["luego ahi es donde se pega", "w:low", { tort: 0, dark: 0.5 }]]],
  [TR[21], [["truco numero 22", "w:mesa", { comal2: 1 }], ["se talla con un papel doblado", "i:m2_t22"], ["la sal raspa", "i:m2_d22"], ["luego se sacude", "w:mesa", { comal2: 1, sal: 1 }]]],
  [TR[22], [["truco numero 23", "w:clavo"], ["si lo deja en el suelo", "w:cocina"], ["mi mama lo tenia colgado", "i:m2_t23"], ["ahi se seca ahi respira", "w:clavo"]]],
  [TR[23], [["un comal para tortillas", "w:cocina", { comal2: 1 }], ["el chile el ajo y el humo", "w:low", { tatem: 1, tort: 0 }], ["en mi casa el comal grande", "i:m2_t24"]]],
  [TR[24], [["el comal no se lava nunca", "w:top", { ash: 1, tort: 0 }], ["y cuando alguien en su casa", "i:m2_t25"], ["el comal se cura no se lava", "w:side"]]],
  [T_FIX, [["si ya hizo todo esto", "w:top"], ["dele su lechada de cal", "i:m2_t26"], ["y si se trono", "w:side", { cal: 0.6 }]]],
  [T_CUENTA, [["dejeme hacerle una cuenta", "w:mesa"], ["un puno de cal cuesta", "i:m2_t27"], ["la ceniza sale del fogon", "w:fogon"], ["y si usted lo cuida", "w:mesa"]]],
  [T_CTA2 - 4, [["y paciencia", "w:front"], ["ya que estamos en confianza", "w:side"], ["de todos estos trucos", "w:top"], ["escribamelo abajo", "w:cocina"]]],
  [T_SEMANA - 0.4, [["semana no cambie todo", "w:top"], ["deje de lavar su comal", "w:low"], ["y voltee la tortilla", "w:side"]]],
  [T_COMENT, [["cuenteme aqui abajo", "w:cocina"], ["en su casa el comal es de barro", "w:mesa", { comal2: 1 }], ["quiero saber de que pueblo", "w:patio"]]],
  [T_CHAYO, [["si quiere ver lo que cocina", "w:chayo"], ["y en el proximo video", "w:cocina"], ["para que le dure 30 anos", "w:side"]]],
  [T_GRACIAS, [["gracias por quedarse", "w:fogon"], ["que nunca le falte", "w:salida"]]],
];
export const BEATS: Beat[] = BLOQUES.flatMap(([from, rows]) => rows.map(([q, pl, st]) => ({ a: at(q, from - 0.5), kind: pl[0] as "w" | "i", arg: pl.slice(2), st: st ?? {} })))
  .sort((x, y) => x.a - y.a);
export const REST0 = T_CTA1;

// estado del comal en el mundo: cada plano de mundo trae el suyo; entre planos se funde en 0,8 s
const WB = BEATS.filter((b) => b.kind === "w");
const KEYS_ST: (keyof St)[] = ["cal", "ash", "heat", "tatem", "dark", "gotas", "grieta", "zonas", "pepitas", "nopal", "chiles", "tomatillo", "sal", "comal2", "humo", "puff", "tort"];
const DEF: Required<St> = { cal: 0, ash: 0, heat: 0, tatem: 0, dark: 0, gotas: 0, grieta: 0, zonas: 0, pepitas: 0, nopal: 0, chiles: 0, tomatillo: 0, sal: 0, comal2: 0, humo: 0, puff: 0, tort: 1 };
export const estado = (t: number): Required<St> | null => {
  if (t < REST0) return null;
  let i = -1; while (i < WB.length - 1 && WB[i + 1].a <= t) i++;
  if (i < 0) return { ...DEF };
  const now = { ...DEF, ...WB[i].st }, prev = i > 0 ? { ...DEF, ...WB[i - 1].st } : now;
  const k = Math.max(0, Math.min(1, (t - WB[i].a) / 0.8)), r = { ...DEF };
  for (const key of KEYS_ST) r[key] = prev[key] + (now[key] - prev[key]) * k;
  return r;
};
// cámara: llega a la vista del plano en 0,9 s y después deriva despacito (órbita propia por plano)
export const KEYS2: { t: number; p: [number, number, number]; l: [number, number, number]; fov?: number; arc?: number }[] = WB.flatMap((b, i) => {
  const v = VIEW[b.arg] ?? VIEW.top, end = (WB[i + 1]?.a ?? b.a + 8) - 0.05, sgn = i % 2 ? 1 : -1;
  const d = (x: V3, k: number): V3 => [x[0] + sgn * 0.12 * k, x[1] + 0.03 * k, x[2] + 0.06 * k];
  return [{ t: b.a + 0.9, p: v.p, l: v.l, fov: v.fov }, { t: Math.max(b.a + 1.0, end), p: d(v.p, 1), l: v.l, fov: v.fov - 2 }];
});
