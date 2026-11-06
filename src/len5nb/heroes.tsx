// len5nb · un componente ÚNICO por toma C. t011 y t150 = la CTA de las tapas (Body), sin componente encima.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Aro", { x: 0.5, y: 0.5, label: "THE RING OF PUTTY UNDER IT" }],
  t007: ["Grilla", { caps: ["Too thin", "Old putty", "Turned it", "Wet surface"], pick: 0, col: "#ff5a4a" }],
  t008: ["Ranking", { n: 7, cur: 7, label: "7 MISTAKES" }],
  t010: ["Cronometro", { from: 0, to: 30, label: "The last 30 seconds" }],
  t014: ["Capas", { layers: ["LINSEED OIL", "POWDERED CHALK", "TODAY: OILS + CLAY"] }],
  t016: ["Tachar", { items: ["GLUE", "CAULK", "SILICONE"] }],
  t019: ["Carta", { ka: "THE PUTTY", a: "Fills the gap", kb: "THE NUT", b: "Holds it tight" }],
  t025: ["Almanaque", { n: 6, head: "YEARS", label: "The oil dries out of the tub" }],
  t030: ["Versus", { labels: ["CRACKS = TRASH", "BENDS = GOOD"], win: 1 }],
  t032: ["Caen", { words: ["THE", "ROPE", "IS", "TOO", "THIN"] }],
  t035: ["Lupa", { x: 0.45, y: 0.5, label: "THE LIP ISN'T FLAT" }],
  t038: ["Regla", { frac: 0.5, val: "1/2 INCH", label: "A rope as thick as a pencil" }],
  t046: ["Tildes", { rows: ["Squeeze-out all around", "That's a good sign"] }],
  t049: ["Cano", { a: "OLD CRUST = CHANNELS", b: "CLEAN METAL = SEAL", label: "Water follows the channels out", plugCol: "#8a7a5a" }],
  t055: ["Escalera", { steps: ["Threads", "Granite", "Last 30 s"] }],
  t057: ["Semaforo", { luz: 0, word: "NOT HERE", label: "Putty is for one kind of joint" }],
  t059: ["Manometro", { v: 0.6, lo: "0 PSI", hi: "100 PSI", label: "60 POUNDS IN A WATER LINE" }],
  t067: ["Foco", { word: "ONLY THE FLAT LIP OF A DRAIN" }],
  t072: ["Cortina", { labels: ["PUTTY ON GRANITE", "A DARK OIL RING"] }],
  t077: ["Bateria", { from: 1, to: 0.3, label: "Plastic softens over time" }],
  t079: ["Caja", { items: ["PUTTY", "SILICONE", "GASKET"] }],
  t086: ["Balanza", { l: "GASKET + PUTTY", r: "GASKET ALONE", right: true }],
  t087: ["Recorrido", { stops: ["METAL DRAIN: PUTTY", "STONE: SILICONE", "PLASTIC: THE BOX"] }],
  t088: ["Contador", { n: 30, unit: " SEC", label: "NUMBER 7", col: "#ff5a4a" }],
  t093: ["Embudo", { top: "EVERY TURN WIPES PUTTY", bottom: "A THIN SPOT LEAKS", keep: 6 }],
  t096: ["Llave", { a: "TURN IT", b: "NEVER TURNS" }],
  t103: ["Torta", { pct: 25, label: "A quarter turn at a time" }],
  t106: ["Pasos", { steps: ["Thick rope", "Clean", "Straight down", "No turning", "Slow nut"] }],
  t121: ["Nivel", { from: 0.2, to: 0.92, mark: 0.9, markLabel: "FULL", label: "Fill it. Wait 10 minutes." }],
  t128: ["Postal", { city: "TOLEDO", year: "GUS" }],
  t134: ["Reloj", { min: 10, unit: "MIN", label: "Waiting for the drip" }],
  t137: ["Lluvia", { a: "STONE + PUTTY: STAINS", b: "STONE + SILICONE" }],
  t140: ["Sello", { word: "NOT THE PUTTY" }],
  t145: ["Nota", { note: "Run the faucet and watch where the first drop shows up." }],
  t147: ["Pegotes", { notes: ["Test the putty", "Half an inch", "Clean + dry"] }],
  t152: ["Linea", { items: [{ y: "1", l: "test the putty" }, { y: "4", l: "no threads" }, { y: "7", l: "never turn it" }] }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
