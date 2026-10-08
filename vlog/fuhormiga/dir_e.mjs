// DIRECTOR E — fuhormiga: planos de stock extra (metraje real ≥25 %): parten tomas largas de imagen con objetos/hormigas genéricas (nunca personajes).
import { S, BI } from "../claudio/lib.mjs";
const X = (p, at, name, q, scene) => S(p, at, "bi", name, { q, p: BI(scene) });
export const SHOTS = [
  X(8, "la cruzaba toda", "st_x_ants8", "ants walking", "Tiny black ants walking in a line."),
  X(9, "esto pasa todos los años cuando empieza el calor", "st_x_summer9", "summer sun window", "Hot summer sun through a window."),
  X(10, "colgada al lado de la ventana", "st_x_bag10", "school backpack", "A school backpack hanging on a hook."),
  X(11, "y la barra", "st_x_spray11", "spraying insecticide", "An insecticide spray mist."),
  X(19, "borra parte del camino", "st_x_ants19", "ants trail", "A trail of ants."),
  X(21, "o tapitas de plástico", "st_x_caps21", "plastic bottle caps", "Small plastic caps."),
  X(22, "Que diga bórax, o borato de sodio", "st_x_powder22", "white powder", "White powder in a bowl."),
  X(27, "y se llevan sólo agua dulce", "st_x_water27", "glass of water", "A glass of water."),
  X(28, "O lo prueba, no le gusta", "st_x_ant28", "ant macro", "An ant close up."),
  X(30, "en el frasco cerrado", "st_x_jar30", "glass jar lid", "A closed glass jar."),
  X(34, "Mojado, no chorreando", "st_x_cotton34", "cotton balls", "Cotton balls."),
  X(39, "Frasco con tapa de rosca", "st_x_jar39", "screwing jar lid", "Hands screwing a jar lid."),
  X(44, "Ni aerosol, ni limpiador, ni vinagre", "st_x_cleaner44", "cleaning spray bottle", "A cleaning spray bottle."),
  X(45, "Seco no les sirve", "st_x_cotton45", "cotton ball", "A cotton ball."),
  X(49, "Salimos al patio", "st_x_patio49", "backyard night", "A backyard at night."),
  X(54, "El tercer día", "st_x_ants54", "few ants", "A few ants."),
  X(58, "eso sí", "st_x_sugarjar58", "sugar jar", "A jar of sugar."),
  X(60, "se tiran cerradas a la basura", "st_x_trash60", "trash can kitchen", "A kitchen trash can."),
  X(68, "Pasa mucho a principios de la primavera", "st_x_spring68", "spring garden", "A spring garden."),
  X(73, "Las hormigas también van al plato de Bruno", "st_x_bowl73", "dog bowl", "A dog food bowl."),
  X(78, "que no haya comida más rica cerca", "st_x_crumbs78", "crumbs on table", "Crumbs on a table."),
];
