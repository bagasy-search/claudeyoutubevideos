// DIRECTOR E — fucasero: planos de stock extra (metraje real ≥25 %): parten tomas largas de imagen con objetos/cucarachas genéricas (nunca personajes).
import { S, BI } from "../claudio/lib.mjs";
const X = (p, at, name, q, scene) => S(p, at, "bi", name, { q, p: BI(scene) });
export const SHOTS = [
  X(10, "Le echaba aerosol, y listo", "st_x_spray10", "insect spray can", "An insect spray can."),
  X(11, "Un vuelito corto, cuando hace calor", "st_x_hot11", "hot summer night", "A hot summer night."),
  X(16, "para que alcancen a volver al escondite", "st_x_crack16", "dark crack wall", "A dark crack in a wall."),
  X(30, "le sabe raro, y no vuelve", "st_x_roach30", "cockroach walking", "A cockroach walking away."),
  X(36, "nunca de vuelta a la cocina", "st_x_shelf36", "cleaning supplies shelf", "A shelf of cleaning supplies."),
  X(40, "un fideo seco", "st_x_pasta40", "dry spaghetti", "Dry spaghetti."),
  X(42, "esperando", "st_x_eggs42", "cockroach egg case", "A cockroach egg case."),
  X(44, "Las cápsulas, con un papel, a la misma bolsa", "st_x_trashbag44", "black trash bag", "A black trash bag."),
  X(45, "con la ventana abierta y sin comida cerca", "st_x_window45", "open window", "An open window."),
  X(50, "Ni de limpiador fuerte", "st_x_cleaner50", "cleaning spray", "A cleaning spray bottle."),
  X(55, "esperó una hora", "st_x_clock55", "clock night", "A clock at night."),
  X(56, "Bolitas nuevas, misma estación", "st_x_dough56", "dough balls", "Small dough balls."),
  X(61, "Van al escondite", "st_x_roach61", "cockroach hiding", "A cockroach hiding."),
  X(62, "Se espantan del cebo", "st_x_spray62", "spraying aerosol", "An aerosol spraying."),
  X(63, "Partes iguales", "st_x_spoons63", "measuring spoons", "Measuring spoons."),
  X(75, "Habían comido", "st_x_crumbs75", "crumbs", "Crumbs."),
  X(76, "que se guardan en el garaje", "st_x_garage76", "garage storage bins", "Plastic storage bins in a garage."),
  X(82, "cuántos son", "st_x_roaches82", "cockroaches", "Cockroaches."),
  X(85, "los ratones aparecieron de un día para el otro", "st_x_mouse85", "mouse", "A small mouse."),
];
