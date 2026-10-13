// DIRECTOR C — fuhotel · tomas extra: (1) minuto 1 con ≥30 cortes (compuerta del canal), (2) partir las dos tomas >12 s
// (cl_lucia_talk en el párrafo 65 y cl_manual_hold en el 106). Sólo foto gpt-image low + el kit de siempre.
import { S, BI, CLP, HOUSE } from "../claudio/lib.mjs";

export const SHOTS = [
  // ── minuto 1 · más cortes
  S(3, "Hoy lo explico completo", "bi", "bi_explain_booklet", { p: BI("Close view of an open printed booklet with a small green cover, a half lemon with cloves beside it on a wooden table.") }),
  S(6, "que sea la basura", "bi", "bi_bin_lid_close", { q: "trash can lid", p: BI("A kitchen bin lid closing slowly onto a black garbage bag, the tiled floor below.") }),
  S(7, "entra el aire de la calle", "bi", "bi_street_air", { q: "restaurant back alley", p: BI("A restaurant back door opening onto a bright street, a breeze moving a paper napkin on the step.") }),
  S(8, "Eso es lo que decide", "cl", "cl_decides", { p: CLP("standing in a clean restaurant kitchen, looking at the camera and holding up one finger.") }),
  S(9, "y una puerta de servicio", "bi", "bi_service_door", { q: "restaurant service door", p: BI("A steel service door of a restaurant kitchen, slightly ajar, a crack of light from the dining room.") }),
  S(10, "con una frase que nunca olvidé", "cl", "cl_remember", { p: CLP("looking off to the side as if remembering something, a small smile, in a kitchen corner.") }),
  S(12, "Esa frase es todo el método", "bi", "bi_method_note", { q: "lemon cloves kitchen", p: BI("A folded paper note on a steel counter beside a half lemon with cloves, no writing visible.") }),
  S(12, "Lo que sigue es cómo se hace en tu casa", "bi", "bi_home_afternoon", { q: "kitchen afternoon sunlight", p: BI(`${HOUSE}, a normal weekday afternoon.`) }),
  // ── partir tomas largas
  S(65, "Le dije que no le iba a prometer", "bi", "bi_promise_week", { q: "kitchen calendar wall", p: BI("A kitchen calendar on a wall with a week circled in pen, a glass of water on the counter beside it.") }),
  S(106, "en el Manual del Fumigador", "bi", "bi_manual_book", { q: "booklet on kitchen table", p: BI("A small printed booklet with a green cover on a kitchen table, a pen lying beside it.") }),
  // ── minuto 1: 8 tomas más en los huecos de 4-5 s (gate ≥30 cortes)
  S(3, "con las medidas exactas", "bi", "bi_measure_cup", { q: "measuring spoon", p: BI("A small plastic measuring spoon and a few whole cloves on a wooden table, close view.") }),
  S(3, "en la página dieciséis", "bi", "bi_page16_hand", { p: BI("A hand turning a printed booklet page, the page edge visible, on a kitchen table.") }),
  S(4, "Treinta años de fumigador", "bi", "bi_van_shelves", { q: "pest control van", p: BI("Shelves in a pest control technician's van, neatly stacked bottles and tools, daylight from the open back door.") }),
  S(4, "esto no es magia", "cl", "cl_not_magic", { p: CLP("holding up an open empty hand toward the camera and shaking his head slightly, a kitchen behind him.") }),
  S(5, "que la mosca no soporta", "bi", "bi_window_fly", { q: "fly on window glass", p: BI("A kitchen window with a fly walking on the outside of the glass, a half lemon on the sill inside.") }),
  S(6, "quitarle lo que la llama", "bi", "bi_attract_food", { q: "flies on sugar", p: BI("A plate of cut melon and a dish of sugar left out on a counter, a few flies drawn toward them, close view.") }),
  S(7, "entran los proveedores", "bi", "bi_suppliers_door", { q: "delivery van restaurant", p: BI("A delivery van parked behind a restaurant, its rear door open, crates stacked by the kitchen door.") }),
  S(4, "en casas, restaurantes", "bi", "bi_houses_rest", { p: BI("A pest control technician's bag leaning by a kitchen door in a plain house, the kitchen light on.") }),
  S(1, "en las ventanas de la cocina", "bi", "bi_kitchen_windows", { q: "restaurant kitchen window", p: BI("A restaurant kitchen's row of tall windows, all without screens, bright daylight across the steel counters.") }),
  // minuto 1: dos tomas en los huecos de ~3 s
  S(3, "paso por paso", "bi", "bi_step_by_step", { p: BI("Close view of a hand pointing at a line on a printed booklet page, a half lemon nearby on the table.") }),
  S(5, "no mata la mosca que ya está volando", "bi", "bi_fly_ceiling", { p: BI("A fly landing on a kitchen ceiling light fixture, a bright white ceiling, the room below out of frame.") }),
];
