// len5nc · un componente ÚNICO por toma C. CTA en 82-92 s y 1257-1268 s: ninguna toma C cae ahí.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Ticket", { title: "PLUMBER'S BILL", rows: [{ i: "Aerator", p: "$95" }, { i: "Shower head", p: "$120" }, { i: "Caulk line", p: "$180" }], total: "$600+" }],
  t003: ["Balanza", { l: "$600 BILL", r: "$40 IN PARTS", right: false }],
  t007: ["Ranking", { n: 7, cur: 1, label: "SMALLEST TO BIGGEST" }],
  t012: ["Tildes", { rows: ["Find the shutoffs", "Bucket + old towel", "Close the drain"] }],
  t018: ["Almanaque", { n: 1, head: "NUMBER", label: "The faucet that sputters" }],
  t027: ["Pasos", { steps: ["Screen", "Washer", "Housing", "Same order back"] }],
  t030: ["Precio", { price: "$2", sub: "NEW AERATOR", label: "vs. a plumber coming out" }],
  t034: ["Foco", { word: "THE LAZIEST FIX" }],
  t039: ["Semaforo", { luz: 1, word: "NOT NICKEL", label: "Vinegar: plain chrome only" }],
  t043: ["Versus", { labels: ["NEW HEAD: $20-60", "A BAG OF VINEGAR"], win: 1 }],
  t047: ["Capas", { layers: ["OLD CAULK", "MILDEW", "TILE"] }],
  t049: ["Tachar", { items: ["CAULK OVER CAULK", "SCRUB AND HOPE", "ALL OUT, NEW LINE"] }],
  t054: ["Bateria", { from: 0.1, to: 1, label: "Let it dry, all the way" }],
  t060: ["Nota", { note: "Leave it alone a full day before you shower." }],
  t061: ["Barras", { bars: [{ l: "YOU ($)", v: 8 }, { l: "A PLUMBER ($)", v: 200 }], hl: 1 }],
  t065: ["Lupa", { x: 0.5, y: 0.45, label: "THE NUT BEHIND THE HANDLE" }],
  t069: ["Manometro", { v: 0.125, lo: "0", hi: "FULL TURN", label: "AN EIGHTH. THAT'S IT." }],
  t072: ["Llave", { a: "STUCK FOR 10 YEARS", b: "TURNED ONCE A YEAR" }],
  t075: ["Embudo", { top: "MORE FORCE", bottom: "MORE DRIP", keep: 2 }],
  t079: ["Aro", { x: 0.5, y: 0.45, label: "THE RING ONLY SQUEEZES SO MUCH" }],
  t082: ["Torta", { pct: 25, label: "A quarter turn, then look" }],
  t088: ["Grilla", { caps: ["Rubber hose", "Bulging", "Cracked", "Braided steel"], pick: 3 }],
  t091: ["Contador", { n: 24, unit: "/7", label: "Pressure, running or not" }],
  t095: ["Cano", { a: "RUBBER HOSE", b: "BRAIDED STEEL", label: "About $20 for the pair", plugCol: "#9aa4ad" }],
  t103: ["Cortina", { labels: ["A $20 PAIR OF HOSES", "A SOAKED FLOOR AND CEILING"] }],
  t105: ["Caja", { items: ["2 WRENCHES", "SCREWDRIVER", "OLD TOWEL", "BUCKET", "VINEGAR"] }],
  t108: ["Escalera", { steps: ["Aerator", "Hoses", "Water heater"] }],
  t111: ["Nivel", { from: 0.05, to: 0.4, mark: 0.35, markLabel: "SEDIMENT", label: "Year after year, it builds up" }],
  t113: ["Pegotes", { notes: ["Bill goes up", "Popping, rumbling", "Wears out early"] }],
  t115: ["Carta", { a: "Flush it: an afternoon", b: "New heater: $1,000+" }],
  t117: ["Termo", { from: 70, to: 140, min: 0, max: 200, unit: "°F", label: "Hot water burns" }],
  t123: ["Polaroids", { caps: ["Gloves on", "Hands clear"] }],
  t125: ["Balde", { n: 3, unit: " GAL", label: "Until it runs clear" }],
  t129: ["Escudo", { threats: ["HEAT", "PRESSURE"], label: "The relief valve" }],
  t132: ["Sobre", { note: "Don't plug it. Don't cap it. Ever." }],
  t135: ["DosLugares", { a: "THE ROD", b: "THE TANK", label: "One wears out so the other doesn't" }],
  t137: ["Sello", { word: "EVERY ONE FAILS" }],
  t142: ["Recorrido", { stops: ["KITCHEN", "BATHROOM", "LAUNDRY", "BASEMENT"] }],
  t150: ["Candado", { label: "GAS OFF. POWER OFF. GO SLOW." }],
  t153: ["Domino", { chain: ["15 YEARS", "NEVER DRAINED", "DON'T PUSH IT", "CALL"] }],
  t156: ["Lluvia", { a: "EVERYWHERE", b: "WHERE IT BELONGS" }],
  t159: ["Linea", { items: [{ y: "1", l: "aerator" }, { y: "2", l: "shower" }, { y: "3", l: "caulk" }, { y: "4", l: "valve" }, { y: "5", l: "fitting" }, { y: "6", l: "hoses" }, { y: "7", l: "heater" }] }],
  t162: ["Mapa", { place: "BEHIND THE WASHER", year: "Tonight" }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
