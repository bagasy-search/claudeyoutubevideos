// DIRECTOR E — fufruta: planos de stock extra (metraje real ≥25 %): parten tomas largas de imagen con objetos genéricos (nunca personajes).
import { S, BI } from "../claudio/lib.mjs";
const X = (p, at, name, q, scene) => S(p, at, "bi", name, { q, p: BI(scene) });
export const SHOTS = [
  X(8, "Ahora están en todos lados", "st_x_flies8", "fruit flies", "Tiny fruit flies over fruit."),
  X(9, "Tiró toda la fruta a la basura", "st_x_trash9", "throwing food in trash", "Food being thrown into a kitchen trash can."),
  X(16, "debajo de la rejilla", "st_x_drain16", "sink drain", "A kitchen sink drain close up."),
  X(17, "una papa o una cebolla olvidada", "st_x_potato17", "potatoes onions", "Potatoes and onions in a bag."),
  X(23, "Si sólo pones el vaso", "st_x_glass23", "glass of water table", "A glass on a kitchen table."),
  X(30, "donde más vuelan", "st_x_fruit30", "fruit bowl", "A fruit bowl on a table."),
  X(32, "A la hora de dormir", "st_x_night32", "house at night", "A family house at night with lights on."),
  X(37, "temprano", "st_x_dawn37", "sunrise window", "Early morning light through a window."),
  X(40, "Debajo del fregadero, en el mueble", "st_x_cabinet40", "under sink cabinet", "The open cabinet under a kitchen sink."),
  X(42, "el trapo de la cocina", "st_x_towel42", "dish towel", "A dish towel by a sink."),
  X(45, "La que está blanda, se va", "st_x_potato45", "potatoes", "Potatoes on a table."),
  X(52, "El vinagre viejo, lleno de mosquitas", "st_x_vinegar52", "vinegar", "Vinegar in a glass."),
  X(54, "A las mosquitas les encanta", "st_x_dogbowl54", "dog bowl", "A dog food bowl on a floor."),
  X(68, "Si la bolsa queda un par de días", "st_x_trashbag68", "trash bag", "A full trash bag."),
  X(73, "en el medio de la mesa", "st_x_bananas73", "bananas", "Yellow bananas on a table."),
  X(79, "Y a la mañana, miras", "st_x_morning79", "morning kitchen", "A kitchen in morning light."),
];
