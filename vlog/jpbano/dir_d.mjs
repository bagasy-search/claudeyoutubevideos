// DIRECTOR D — jpbano: cortes extra del minuto 1 (≥33).
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
import { HBATH } from "./dir_a.mjs";
export const SHOTS = [
  S(0, "encerrado", "bi", "b_aerosolmist", { p: BI(`A fine mist of aerosol spray hanging in the air of ${BATH} in the light of a small window.`) }),
  S(2, "el que más cerramos", "bi", "b_lockdoor", { q: "door lock", p: BI("Close view of a hand turning the lock of a bathroom door from inside.") }),
  S(3, "que usamos todos los días", "bi", "b_counterclutter", { q: "bathroom counter products", p: BI(`A bathroom counter in ${BATH} crowded with sprays, an air freshener, wet wipes and bottles with blank labels.`) }),
  S(4, "Quince años de conserje", "bi", "b_cartcorridor", { q: "hotel housekeeping cart", p: BI(`A housekeeping cart with folded white towels in a corridor of ${HOTEL}, early morning.`) }),
  S(1, "en el hotel de Tokio", "bi", "b_tokyoeve", { q: "tokyo street morning", p: BI("A quiet Tokyo side street at dawn with a small business hotel, no readable signs.") }),
  S(1, "Y lo que me dijo", "bi", "b_satoface", { p: BI(`${SATO} at the door of ${HBATH}, about to speak with a calm, strict face.`) }),
  S(1, "con los aerosoles en la mano", "bi", "b_canshand", { q: "aerosol spray can", p: BI("A woman's hands in navy uniform sleeves holding two aerosol cans with blank labels.") }),
  S(2, "el cuarto más chico de la casa", "bi", "b_tinybath", { q: "small bathroom interior", p: BI(`A tiny bathroom of a Latin American apartment seen from the door: toilet, sink and shower almost touching.`) }),
  S(2, "los productos más fuertes", "bi", "b_bleachrow", { q: "bleach bottles shelf", p: BI("A row of strong cleaning products with blank labels, bleach and toilet cleaners, on a bathroom shelf.") }),
  S(3, "y que los japoneses reemplazaron", "bi", "b_jpshelfbath", { q: "minimalist bathroom shelf", p: BI("A nearly empty bathroom shelf in a Japanese home with one bar of soap, a squeegee and a folded cloth.") }),
  S(3, "es la que casi todos rompemos", "bi", "b_mixpour", { p: BI(`Two cleaning bottles with blank labels held over a toilet bowl in ${BATH}, one already pouring.`) }),
  S(4, "ni a limpio", "bi", "b_nospray", { p: BI(`A hotel housekeeping cart with folded cloths, a squeegee and plain refill bottles, no air freshener anywhere.`) }),
];
