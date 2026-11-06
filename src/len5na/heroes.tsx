// len5na · un componente ÚNICO por toma C (ninguno se repite en el video). t010 = la CTA de las tapas (Body), sin componente encima.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Aro", { x: 0.55, y: 0.62, label: "TWO FINGERS OF GRAY WATER", col: "#8fd6ff" }],
  t003: ["Reloj", { min: 15, unit: "MIN", label: "No bottle. No plumber." }],
  t006: ["Versus", { labels: ["KITCHEN = GREASE", "TUB = HAIR"], win: 1 }],
  t015: ["Caen", { words: ["HAIR", "+", "SOAP", "=", "CLOG"] }],
  t020: ["Almanaque", { n: 9, head: "YEAR", label: "Each hair sticks to the last one" }],
  t025: ["Carta", { a: "The cup dissolves hair", b: "Nothing you pour dissolves hair" }],
  t028: ["Cortina", { labels: ["WET PIPE: DOES NOTHING", "DRY PIPE: IT STICKS"] }],
  t031: ["Ranking", { n: 4, cur: 2, label: "THE STOPPER", col: "#4ab8e0" }],
  t038: ["Lupa", { x: 0.7, y: 0.35, label: "THE OVERFLOW HIDES HAIR" }],
  t043: ["Precio", { price: "$3", sub: "DRAIN STRIP", label: "20 inches · little barbs" }],
  t049: ["Semaforo", { luz: 2, word: "PULL UP", label: "Never push it down the pipe" }],
  t055: ["Termo", { from: 70, to: 212, min: 0, max: 240, label: "Plastic pipe tops out near 140°F" }],
  t059: ["Torta", { pct: 50, label: "Half baking soda, half coarse salt" }],
  t061: ["Capas", { layers: ["SODA CUTS SOAP", "SALT SCRUBS", "SALT PULLS WATER"] }],
  t067: ["Tachar", { items: ["RUN THE WATER", "TAKE A SHOWER", "TOUCH IT"] }],
  t069: ["Pasos", { steps: ["Hair out", "Soften the soap", "Dry cup in"] }],
  t072: ["Ticket", { title: "PLUMBER", rows: [{ i: "Service call", p: "$150" }, { i: "Overflow cable", p: "$250" }], total: "$400" }],
  t075: ["Recorrido", { stops: ["OVERFLOW PLATE", "PIPE GOES DOWN", "JOINS THE DRAIN"] }],
  t082: ["Manometro", { v: 0.55, lo: "LOOSE", hi: "CRACKED", label: "SNUG, NOT TIGHT" }],
  t086: ["Foco", { word: "IT STARTS TO SPIN" }],
  t090: ["Embudo", { top: "RAG OVER THE OVERFLOW", bottom: "ALL THE PUSH HITS THE CLOG", keep: 3 }],
  t095: ["Sello", { word: "DANGER" }],
  t100: ["Llave", { a: "BLEACH + ANYTHING", b: "NEVER MIX" }],
  t105: ["Polaroids", { caps: ["the drain", "the catcher", "hair stays up"] }],
  t113: ["Balanza", { l: "GURGLE = CLOG", r: "SMOOTH = CLEAR", right: true }],
  t122: ["Nota", { note: "Peroxide won't hurt the tub. It won't dissolve hair either." }],
  t127: ["Linea", { items: [{ y: "SPRING", l: "overflow + smoke alarm" }, { y: "FALL", l: "same day again" }] }],
  t129: ["Contador", { n: 3, unit: " MIN", label: "ONCE A MONTH" }],
  t141: ["Caja", { items: ["TOILETS", "DRAINS", "LEAKS", "SHOWERS", "WHEN TO CALL"] }],
  t144: ["Pegotes", { notes: ["Water out", "Stopper out", "Hair out"] }],
  t147: ["Grilla", { caps: ["Dry cup", "15 min", "Hot water", "Rag + plunger"], pick: 2 }],
  t149: ["Bateria", { from: 1, to: 0, label: "15 MINUTES · NOBODY TOUCHED IT" }],
  t151: ["Tildes", { rows: ["Gray water: gone", "15 minutes", "The price of a cup"] }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
