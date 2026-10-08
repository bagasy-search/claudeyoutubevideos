// DIRECTOR D — jpcasa: cortes extra del minuto 1 (≥33).
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { KITCHEN, BEDROOM } from "./dir_a.mjs";
export const SHOTS = [
  S(1, "me hizo parar delante de todo el equipo de limpieza", "bi", "b_staffbriefing", { p: BI(`A housekeeping supervisor in a navy uniform facing a group of housekeepers at the start of the morning shift in a service corridor of ${HOTEL}, seen from behind the group.`) }),
  S(2, "el que vive en la casa no lo siente", "bi", "b_tvcouple", { q: "older couple watching tv", p: BI(`An older Latin American couple watching television on their fabric sofa in the evening, relaxed, curtains closed.`) }),
  S(2, "Y nadie te lo va a decir", "bi", "b_guestpolite", { p: BI(`A guest sitting politely on a fabric sofa in ${HOUSE} holding a cup of coffee with a slightly forced smile.`) }),
  S(3, "y lo que los japoneses pusieron en su lugar", "bi", "b_jpbalcony", { q: "japanese apartment balcony laundry", p: BI("A Japanese apartment balcony with bedding and towels drying in the sun on a clear morning.") }),
  S(3, "la usas para limpiar", "bi", "b_detergent", { q: "laundry detergent washing machine", p: BI("A hand pouring liquid detergent from a bottle with a blank label into the drawer of a washing machine.") }),
  S(4, "Quince años de conserje", "bi", "b_cartcorridor", { q: "hotel housekeeping cart", p: BI(`A housekeeping cart with folded white towels in a corridor of ${HOTEL}, early morning.`) }),
  S(5, "ya sabes lo que pienso de los aromatizantes", "bi", "b_spraysofa", { p: BI(`A hand spraying an air freshener with a blank label over a fabric sofa in ${HOUSE}.`) }),
  S(1, "que yo acababa de dejar perfecta", "cl", "c_proud", { p: CLP(`He stands proudly in the doorway of a freshly cleaned room of ${HOTEL}, wearing a navy housekeeping jacket over his red polo, a folded cloth in his hand.`) }),
  S(2, "apenas abres la puerta", "bi", "b_doorhandle", { p: BI(`Close view of a hand turning the handle of the front door of ${HOUSE} from inside, a coat rack beside it.`) }),
  S(3, "pusieron en su lugar", "bi", "b_jptowel", { q: "japanese bathroom towel drying", p: BI("A small Japanese bathroom with towels spread fully open on a rail to dry, a window slightly open, everything bare and clean.") }),
  S(2, "tiene una trampa", "bi", "b_armchair", { p: BI(`An armchair facing a television in ${HOUSE}, a cushion on it, a rug below and curtains at the window, nobody there.`) }),
  S(3, "es la que casi todos rompemos", "cl", "c_washer7", { p: CLP(`He crouches next to a front-loading washing machine in a small laundry corner of a Latin American home and points at its door with a serious face.`) }),
  S(4, "no podía oler a nada", "bi", "b_sheets", { p: BI(`A housekeeper in a navy uniform shaking out a fresh white sheet over a bed in a room of ${HOTEL}, the window open.`) }),
  S(1, "equipo de limpieza", "bi", "b_staffcloths", { p: BI(`Housekeepers in navy uniforms holding folded cloths and spray bottles with blank labels, standing shoulder to shoulder in a service corridor of ${HOTEL}.`) }),
];
