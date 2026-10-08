// DIRECTOR D — jpagua: cortes extra del minuto 1 (≥33).
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
import { KITCHEN, STAFFK } from "./dir_a.mjs";
export const SHOTS = [
  S(1, "me tocó limpiar la cocina del personal", "cl", "c_youngkitchen", { p: CLP(`He wipes a steel counter in ${STAFFK}, wearing a navy housekeeping jacket over his red polo, concentrated.`) }),
  S(2, "Es el agua oxigenada", "bi", "b_bottleclose", { q: "brown bottle hydrogen peroxide", p: BI(`Close view of ${BOTTLE} on a white bathroom shelf.`) }),
  S(3, "dieciséis usos", "bi", "b_sixteen", { p: BI(`A kitchen table with a cutting board, a sponge, kitchen cloths, a plastic food container, a toothbrush cup and ${BOTTLE} in the middle.`) }),
  S(4, "Quince años de conserje", "bi", "b_cartcorridor", { q: "hotel housekeeping cart", p: BI(`A housekeeping cart with folded white towels in a corridor of ${HOTEL}, early morning.`) }),
  S(1, "un frasco marrón", "bi", "b_steelshelf", { q: "stainless steel kitchen shelf", p: BI(`A steel shelf in ${STAFFK} with a few plain bottles and ${BOTTLE} at the front.`) }),
  S(2, "que sigue casi llena", "bi", "b_bottlefull", { p: BI(`${BOTTLE} held up against a bathroom window light, almost full.`) }),
  S(3, "es la que casi todos hacemos mal", "cl", "c_guilty7", { p: CLP(`He stands in ${KITCHEN} holding a spray bottle and a cloth, making a guilty grimace at the camera.`) }),
  S(4, "en todos los carritos", "bi", "b_cartsrow", { p: BI(`Several housekeeping carts lined up in a service corridor of ${HOTEL}, each with a brown bottle in the top tray.`) }),
  S(0, "detrás de las curitas", "bi", "b_bandages", { q: "adhesive bandages box", p: BI("A box of adhesive bandages and a roll of medical tape on a bathroom shelf, a brown bottle partly hidden behind them.") }),
  S(1, "llena de manchas", "bi", "b_boardscratch", { p: BI("Extreme close view of deep knife scratches with dark stains on a white plastic cutting board.") }),
];
