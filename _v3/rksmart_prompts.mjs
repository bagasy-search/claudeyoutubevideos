// rksmart_prompts.mjs — une las 4 partes del DIRECTOR y expande cada plano a su PROMPT final.
//
// El `p` de cada item es SÓLO LA ESCENA. Acá se le pega la fórmula validada por el creador en A/B
// ("B sin dudas, guardalo por siempre") y se expande el token RAY a la descripción del presentador.
// ⛔ PROHIBIDO en los prompts: cinematic / 35mm / bokeh / 8k / grainy / muted / nothing polished /
//    out of focus / blurred / shallow depth of field / stock photo. La cláusula de PROFUNDIDAD no es
//    opcional: es lo que separa "foto real" de "foto de banco de imágenes".
// El ID de cada plano sale del ÍNDICE DEL MOMENTO (`m000`, `m004x`, `m004y`), nunca de un contador
// corrido: así el asset no se puede desfasar un lugar respecto de la frase que ilustra.
import { P1 } from "./rksmart_p1.mjs";
import { P2 } from "./rksmart_p2.mjs";
import { P3 } from "./rksmart_p3.mjs";
import { P4 } from "./rksmart_p4.mjs";

// ⛔ LA DESCRIPCIÓN SALE DEL PLATE REAL DEL AVATAR, no de la ficha del canal. La ficha decía
//    "barba corta blanca" y "parche ovalado rojo"; el plate (public/rkfob_opt.mp4, el avatar que ya
//    vieron en cuatro videos) muestra BARBA LLENA blanca y parche OVALADO BLANCO con ribete rojo.
//    Es la mina de ohftermite: 398 planos generados con la cara equivocada porque la referencia
//    venía de otra etapa del canal. Diez segundos de mirar el frame lo evitan.
export const RAY_DESC =
  "Ray, a heavy-set 68-year-old retired locksmith with thick white combed-back hair and a full white " +
  "beard and moustache, reading glasses pushed up on top of his head, wearing a short-sleeved navy " +
  "blue cotton work shirt with a white oval patch reading RAY stitched on the chest";

export const STYLE =
  ", bright natural daylight, true-to-life colors, sharp focus, deep depth of field with the whole " +
  "room in focus, the background cluttered with ordinary everyday objects that stay readable, " +
  "nothing blurred out, realistic, candid everyday snapshot, no filter, no ai look";

const ENC = {
  wide: "candid wide photo taken on a modern smartphone from across the room, ",
  medium: "candid photo taken on a modern smartphone, medium shot, ",
  close: "candid photo taken on a modern smartphone, close but with the whole setting still visible, ",
};

const expandir = (s) =>
  s.replace(/\bRAYS\b/g, RAY_DESC + ", his hands")
   .replace(/\bRAY\b/g, RAY_DESC);

const NEGRO = /\b(cinematic|35mm|bokeh|8k|highly detailed|grainy|muted colors|low saturation|nothing polished|out of focus|blurred|blurry|soft focus|shallow depth of field|subject isolation|stock photo)\b/i;

export const ITEMS = [];
for (const it of [...P1, ...P2, ...P3, ...P4]) {
  const base = { m: it.m, sec: it.sec, k: it.k };
  if (it.k === "av") { ITEMS.push({ ...base, id: `m${String(it.m).padStart(3, "0")}` }); continue; }
  if (it.k === "comp") { ITEMS.push({ ...base, id: `m${String(it.m).padStart(3, "0")}`, comp: it.comp, props: it.props }); continue; }
  for (const [suf, src] of [["", it], ["x", it.x], ["y", it.y]]) {
    if (!src) continue;
    const enc = src.enc || "medium";
    const prompt = ENC[enc] + expandir(src.p) + STYLE + (src.c ? "" : ", no text, no letters, no labels, no signs");
    // ⚠️ el negro se mide sobre LA ESCENA, no sobre el prompt final: la propia fórmula lleva
    //    "nothing blurred out", que es la cláusula de profundidad y dispara un falso positivo.
    if (NEGRO.test(src.p)) throw new Error(`token prohibido en la escena de m${it.m}${suf}`);
    ITEMS.push({
      ...base, k: "img",
      id: `m${String(it.m).padStart(3, "0")}${suf}`,
      part: suf === "" ? 0 : suf === "x" ? 1 : 2,
      c: src.c ? 1 : 0, q: src.q ? 1 : 0, mo: src.mo || null,
      lug: src.lug, enc, escena: src.p, prompt,
    });
  }
}

export default ITEMS;
