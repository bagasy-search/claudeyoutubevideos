// DIRECTOR E — furatas: planos de stock extra (metraje real ≥25 %): parten tomas largas de imagen con objetos/animales genéricos.
import { S, BI } from "../claudio/lib.mjs";
const X = (p, at, name, q, scene) => S(p, at, "bi", name, { q, p: BI(scene) });
export const SHOTS = [
  X(25, "Casi nunca cruzan por el medio", "st_x_mouse25", "mouse running", "A small gray mouse running along a wall."),
  X(34, "con tapa que cierra", "st_x_lid34", "plastic container lid", "Hands closing the lid of a plastic food container."),
  X(36, "Ni una croqueta en el piso", "st_x_bowl36", "empty dog bowl", "An empty steel dog bowl on a floor."),
  X(40, "Cinco gotas de aceite por bolita", "st_x_drop40", "dropper drops", "Close view of drops falling from a glass dropper."),
  X(42, "para que el aceite no manche", "st_x_saucer42", "small white saucer", "A small white saucer on a wooden shelf."),
  X(61, "Siempre con guantes", "st_x_gloves61", "putting on rubber gloves", "Hands pulling on rubber gloves."),
  X(88, "Si hay bolitas, hay ratón", "st_x_mouse88", "mouse kitchen", "A mouse on a kitchen counter at night."),
  X(90, "buscas huecos de una moneda para arriba", "st_x_coin90", "coin closeup", "A coin on a floor close up."),
];
