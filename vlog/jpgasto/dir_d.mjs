// DIRECTOR D — jpgasto: cortes extra del minuto 1 (≥33).
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { KITCHEN } from "./dir_a.mjs";
export const SHOTS = [
  S(0, "todos los meses", "bi", "b_receiptlong", { q: "long supermarket receipt", p: BI("A long supermarket receipt hanging from a hand over a kitchen counter full of shopping bags, numbers unreadable.") }),
  S(1, "y empezó a contar en voz alta", "cl", "c_embarrassed", { p: CLP(`He stands in the hallway of ${HOUSE} rubbing the back of his neck with an embarrassed half smile, looking away.`) }),
  S(1, "Y lo que me dijo después", "bi", "b_satoturn", { p: BI(`${SATO.replace("a dark navy hotel housekeeping supervisor uniform with a white collar and a small name badge with no readable text", "a beige cardigan and dark trousers")}, turning around from an open bathroom cabinet with a calm, serious face.`) }),
  S(2, "ni que ganen más", "bi", "b_tokyocommute", { q: "tokyo commuters train", p: BI("Japanese office workers walking out of a Tokyo train station in the morning, ordinary clothes.") }),
  S(2, "ahorra mucho más que la nuestra", "bi", "b_piggy", { p: BI("A hand dropping a coin into a simple ceramic savings jar on a light-wood shelf.") }),
  S(2, "de cosas que allá nunca se compran", "bi", "b_jpshelf", { q: "japanese minimalist kitchen", p: BI("A small Japanese kitchen with almost nothing on the counter: a kettle, a cutting board and one bottle of dish soap.") }),
  S(3, "esas nueve cosas", "bi", "b_ninebasket", { p: BI("A shopping basket on a kitchen table holding air fresheners, paper towels, cleaning sprays, a storage box, a candle and fabric softener with blank labels.") }),
  S(3, "es la que casi todos pagamos sin darnos cuenta", "bi", "b_phonecharges", { p: BI("A smartphone on a kitchen table lighting up with a payment notification, screen text unreadable, a cup of coffee beside it.") }),
  S(4, "en un hotel de Tokio", "bi", "b_hotelfront", { q: "tokyo hotel entrance", p: BI("The entrance of a modest business hotel on a quiet Tokyo street in the morning, no readable signs.") }),
  S(4, "para saber a qué huele tu casa", "bi", "b_sniffair", { p: BI(`A Latin American woman stepping into the living room of ${HOUSE} and sniffing the air with a curious face.`) }),
  S(5, "porque la regla del perfume encima vuelve hoy", "bi", "b_spraysofa", { p: BI(`A hand spraying an air freshener with a blank label over a fabric sofa in ${HOUSE}.`) }),
  S(5, "pero en tu casa", "bi", "b_homewide", { q: "living room home", p: BI(`The living room of ${HOUSE} in the afternoon, a window, a sofa, a few plants.`) }),
  S(3, "todos los meses", "bi", "b_calendarmonths", { p: BI("A wall calendar with the same day circled in red on several months, pages flipped up, no readable text.") }),
  S(1, "vino a mi casa", "bi", "b_doorbell", { p: BI(`A hand ringing the doorbell at the front door of ${HOUSE}, a small gift bag in the other hand.`) }),
  S(4, "de cinco minutos", "bi", "b_timer5", { q: "kitchen timer", p: BI("A simple white kitchen timer set to five minutes on a light-wood table next to a pillow and a folded towel.") }),
];
