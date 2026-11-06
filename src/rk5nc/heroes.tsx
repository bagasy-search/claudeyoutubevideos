// rk5nc · un componente ÚNICO por toma C. CTA en 120-130, 1696-1707 y 1870-1880 s: ninguna toma C cae ahí.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Pegotes", { notes: ["Reading glasses", "Phone charger", "A book", "Your passport"] }],
  t007: ["Tachar", { items: ["THE TV", "THE JEWELRY", "THE PAPERS"] }],
  t011: ["Versus", { labels: ["7 WORST PLACES", "5 THINGS OF THE BEST"], win: 1 }],
  t023: ["Caja", { items: ["PASSPORT", "SOCIAL SECURITY CARD", "BIRTH CERTIFICATE"] }],
  t028: ["Tildes", { rows: ["Safe from a thief", "Safe from fire and water"] }],
  t029: ["Ranking", { n: 7, cur: 7, label: "THE NIGHTSTAND DRAWER" }],
  t039: ["Almanaque", { n: 6, head: "NUMBER", label: "The sock drawer" }],
  t045: ["Polaroids", { caps: ["Number 5", "Under the mattress"] }],
  t049: ["Linea", { items: [{ y: "GRANDPA", l: "under the mattress" }, { y: "TODAY", l: "still the first place" }] }],
  t056: ["Lupa", { x: 0.5, y: 0.3, label: "THE SHOEBOX ON THE TOP SHELF" }],
  t062: ["Nivel", { from: 0.2, to: 0.95, mark: 0.9, markLabel: "TOP SHELF", label: "Heat goes up. Smoke goes up." }],
  t065: ["Candado", { label: "NUMBER 3: THE LITTLE BOX" }],
  t068: ["Foco", { word: "HANDLE = CARRY" }],
  t075: ["Sobre", { note: "Number 2: the travel pouch." }],
  t083: ["Sello", { word: "IMPORTANT PAPERS" }],
  t087: ["Nota", { note: "You labeled it for him." }],
  t095: ["Escalera", { steps: ["Easy to reach", "Easy to carry", "Easy to read"] }],
  t100: ["Mapa", { place: "JOPLIN, MISSOURI", year: "May 2011" }],
  t107: ["Lluvia", { a: "CARDBOARD: WET PULP", b: "SLEEVE + FIRE BOX" }],
  t112: ["Aro", { x: 0.5, y: 0.45, label: "NUMBER 1: BOLTED DOWN" }],
  t118: ["Reloj", { min: 20, unit: " MIN", label: "With a drill" }],
  t125: ["Escudo", { threats: ["FIRE", "HEAT"], label: "Really fire resistant" }],
  t127: ["Contador", { n: 350, label: "CLASS 350: PAPER STAYS UNDER 350°F" }],
  t132: ["Termo", { from: 70, to: 125, min: 0, max: 200, unit: "°F", label: "Class 125: drives and disks" }],
  t136: ["Carta", { a: "Fire resistant", b: "Does NOT mean waterproof" }],
  t138: ["DosLugares", { a: "THE BOX", b: "A SECOND PLACE", label: "Never all of it in one place" }],
  t147: ["Ticket", { title: "THE LIST", rows: [{ i: "Policy numbers", p: "✓" }, { i: "Bank name", p: "✓" }, { i: "Last four", p: "✓" }], total: "ONE PAPER" }],
  t151: ["Postal", { city: "MRS. PRUITT", year: "2003" }],
  t159: ["Cortina", { labels: ["A LABEL THAT SAYS IT ALL", "A BOX THAT SAYS NOTHING"] }],
  t164: ["Balanza", { l: "10 LB BOX", r: "60 LB BOX", right: true }],
  t169: ["Capas", { layers: ["PAPER", "PLASTIC SLEEVE", "FIRE BOX"] }],
  t174: ["Semaforo", { luz: 0, word: "AT NIGHT", label: "A kitchen fire in Enid, Oklahoma" }],
  t179: ["Manometro", { v: 0.8, lo: "125°F", hi: "350°F", label: "FINE FOR PAPER, NOT A DRIVE" }],
  t182: ["Pasos", { steps: ["Gather", "Sleeves", "The list", "The box", "Bolt it"] }],
  t190: ["Grilla", { caps: ["Class 350: paper", "Class 125: digital"], pick: 1 }],
  t197: ["Bolsa", { items: ["REGISTRATION", "MAIL", "GARAGE REMOTE"], label: "NOT IN THE GLOVE BOX" }],
  t205: ["Domino", { chain: ["RENTING?", "ASK THE LANDLORD", "MOST SAY YES"] }],
  t215: ["Caen", { words: ["NIGHTSTAND.", "SOCKS.", "MATTRESS.", "SHOEBOX."] }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
