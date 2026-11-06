// len5nd · un componente ÚNICO por toma C. CTA en 87-98 s y 1190-1200 s: t135 cae en la CTA, va sin componente.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Onda", { a: "THE HISS THAT NEVER STOPS", b: "A QUIET TANK", a2: true }],
  t006: ["Aro", { x: 0.5, y: 0.45, label: "FIXED IN 60 SECONDS" }],
  t010: ["Balde", { n: 200, unit: " GAL", label: "A day, from one running toilet" }],
  t012: ["Ticket", { title: "EVERY GALLON", rows: [{ i: "Water bill", p: "once" }, { i: "Sewer bill", p: "again" }], total: "TWICE" }],
  t015: ["Capas", { layers: ["LID", "TANK", "FLAPPER"] }],
  t022: ["Caja", { items: ["FLAPPER", "FLOAT", "OVERFLOW TUBE"] }],
  t023: ["DosLugares", { a: "GETTING OUT", b: "TOO MUCH IN", label: "It's one of two things" }],
  t024: ["Almanaque", { n: 1, head: "NUMBER", label: "Listen before you touch" }],
  t028: ["Carta", { a: "A hiss: water getting out", b: "Over the top: too high" }],
  t029: ["Polaroids", { caps: ["Lid off", "On the towel"] }],
  t034: ["Tildes", { rows: ["The chain", "The water level", "The flapper"] }],
  t036: ["Lupa", { x: 0.5, y: 0.5, label: "THE CHAIN HOLDS IT OPEN" }],
  t039: ["Regla", { frac: 0.08, val: "1/2 INCH", label: "A little droop in the chain" }],
  t043: ["Nivel", { from: 0.3, to: 0.9, mark: 0.8, markLabel: "OVERFLOW", label: "Number 4: the water level" }],
  t045: ["Foco", { word: "1 INCH BELOW" }],
  t052: ["Pegotes", { notes: ["Chain", "Float", "Most of them"] }],
  t054: ["Postal", { city: "TOLEDO", year: "28 ROOMS" }],
  t058: ["Recorrido", { stops: ["ROOM 1", "ROOM 9", "ROOM 17", "ROOM 28"] }],
  t061: ["Tachar", { items: ["NEW PARTS", "A BIG BILL", "ONE MINUTE A ROOM"] }],
  t063: ["Cortina", { labels: ["A BILL THROUGH THE ROOF", "BACK TO NORMAL"] }],
  t065: ["Bolsa", { items: ["TOWEL", "FLASHLIGHT", "FOOD COLORING"], label: "EVERYTHING YOU NEED" }],
  t070: ["Manometro", { v: 0.3, lo: "STILL", hi: "SPINNING", label: "THE LITTLE TRIANGLE" }],
  t072: ["Llave", { a: "TRIANGLE TURNING", b: "TRIANGLE STOPS" }],
  t081: ["Pasos", { steps: ["Straight down", "Sit flat", "Water on", "Let it fill"] }],
  t083: ["Grilla", { caps: ["Drops in the tank", "Don't flush", "Check the bowl"], pick: 2 }],
  t087: ["Semaforo", { luz: 0, word: "BLUE = FLAPPER", label: "Clear bowl: check the level" }],
  t088: ["Precio", { price: "$5", sub: "NEW FLAPPER", label: "And about 10 minutes" }],
  t092: ["Versus", { labels: ["TABLET IN THE BOWL", "TABLET IN THE TANK"], win: 0 }],
  t099: ["Sello", { word: "10 MIN · $5" }],
  t100: ["Ranking", { n: 9, cur: 8, label: "THE ONE THAT ISN'T SMALL" }],
  t104: ["Domino", { chain: ["A CRACK", "WATER STOPS THERE", "CALL"] }],
  t107: ["Nota", { note: "Number 9: a loose handle. One more quick one." }],
  t110: ["Caen", { words: ["LEFT", "TO", "TIGHTEN."] }],
  t112: ["Embudo", { top: "A RUNNING TOILET", bottom: "5 MISTAKES", keep: 5 }],
  t119: ["Cano", { a: "FORCED: IT SNAPS", b: "GENTLE: IT TURNS", label: "Plastic parts. Go gentle.", plugCol: "#cfd6dc" }],
  t120: ["Cronometro", { from: 0, to: 5, label: "Lid off, on the towel" }],
  t121: ["Contador", { n: 15, unit: " SEC", label: "Water over the top" }],
  t123: ["Torta", { pct: 50, label: "30 seconds: the float screw" }],
  t125: ["Reloj", { min: 1, unit: " MIN", label: "Silence. Lid back on." }],
  t126: ["Linea", { items: [{ y: "SPRING", l: "clocks change" }, { y: "FALL", l: "clocks change" }] }],
  t131: ["Balanza", { l: "ONE MINUTE", r: "A SERVICE CALL", right: false }],
  t137: ["Mapa", { place: "STILL RUNNING?", year: "Check the chain and the level" }],
  t141: ["Barras", { bars: [{ l: "A GOOD TOILET", v: 0 }, { l: "A RUNNING ONE", v: 200 }], unit: " GAL" }],
  t143: ["Escalera", { steps: ["Listen", "Lid off", "Chain + float"] }],
  t145: ["Candado", { label: "TONIGHT, BEFORE BED: LISTEN" }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
