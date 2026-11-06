// rk5nb · un componente ÚNICO por toma C. t124 y t219 = la CTA de la tapa (Body), sin componente encima.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Aro", { x: 0.5, y: 0.5, label: "THE DOOR YOU NEVER LOCK" }],
  t005: ["DosLugares", { a: "FRONT DOOR", b: "GARAGE DOOR", label: "The outside wall moved" }],
  t008: ["Ranking", { n: 10, cur: 10, label: "10 THINGS · #10 IS THE FIX" }],
  t010: ["Recorrido", { stops: ["KITCHEN", "BEDROOM", "GARAGE", "BACK DOOR"] }],
  t020: ["Carta", { a: "It's inside. Why lock it?", b: "It's the door to the house" }],
  t024: ["Caen", { words: ["NOBODY", "SEES.", "NO", "LOCK.", "STUFF."] }],
  t026: ["Cortina", { labels: ["THE BIG DOOR", "THE DOOR INTO THE HOUSE"] }],
  t031: ["Reloj", { min: 10, unit: "MIN", label: "A door left up" }],
  t038: ["Versus", { labels: ["MOWING OUT BACK", "THE DOOR WIDE OPEN"], win: 0 }],
  t043: ["Lupa", { x: 0.5, y: 0.35, label: "THE RED RELEASE" }],
  t049: ["Manometro", { v: 0.35, lo: "TUG", hi: "YANK", label: "A THIN ZIP TIE" }],
  t053: ["Regla", { frac: 0.75, val: "6 FEET", label: "Off the floor, not at the top" }],
  t057: ["Llave", { a: "CAR IS HOME", b: "CAR IS GONE" }],
  t063: ["Escalera", { steps: ["Bumper", "Hood", "Window"] }],
  t067: ["Capas", { layers: ["TRIM", "GAP", "STUD"] }],
  t073: ["Cano", { a: "SHORT SCREW: TRIM ONLY", b: "3-INCH SCREW: THE STUD", label: "The house holds the door now", plugCol: "#7a6a52" }],
  t078: ["Contador", { n: 1, unit: " INCH", label: "THE DEADBOLT THROW" }],
  t083: ["Onda", { a: "HOLLOW: SOUNDS LIKE A DRUM", b: "SOLID: SOUNDS LIKE A TABLE", a2: true }],
  t086: ["Escudo", { threats: ["FIRE", "SMOKE"], label: "Garage to bedrooms" }],
  t092: ["Pegotes", { notes: ["Remote", "Keypad", "Release", "Side door"] }],
  t095: ["Grilla", { caps: ["1", "4", "7", "0"], pick: 1 }],
  t101: ["Ticket", { title: "IN YOUR CAR", rows: [{ i: "Garage remote", p: "opens" }, { i: "Registration", p: "address" }], total: "YOUR HOUSE" }],
  t106: ["Tachar", { items: ["REMOTES", "KEYPAD", "CAR BUTTON"] }],
  t110: ["Candado", { label: "THE TRACK IS CLAMPED" }],
  t114: ["Tildes", { rows: ["Time", "Noise", "Seen"] }],
  t120: ["Polaroids", { caps: ["outside: a shape", "inside: a face"] }],
  t130: ["Balanza", { l: "THE PET DOOR", r: "A GROWN MAN", right: false }],
  t139: ["Bolsa", { items: ["ARM", "REACH", "DEADBOLT"], label: "CAN HE REACH THE LOCK?" }],
  t140: ["Termo", { from: 0, to: 30, min: 0, max: 40, unit: " IN", label: "From the flap to the thumb turn" }],
  t145: ["Semaforo", { luz: 0, word: "DON'T GO IN", label: "Back out, call from the street" }],
  t155: ["Cronometro", { from: 6, to: 360, label: "6 seconds becomes 6 minutes" }],
  t160: ["Sello", { word: "5 MISTAKES" }],
  t167: ["Foco", { word: "KEY = OUTSIDE" }],
  t172: ["Torta", { pct: 100, label: "60 seconds every night" }],
  t180: ["Postal", { city: "WALT'S GARAGE", year: "1980s" }],
  t182: ["Nota", { note: "DOOR" }],
  t185: ["Sobre", { note: "The key on a nail by the door? Never." }],
  t188: ["Mapa", { place: "THE DRIVEWAY", year: "He'd rather deal with me" }],
  t195: ["Precio", { price: "$3", sub: "OF SCREWS", label: "Before the $200 lock" }],
  t198: ["Almanaque", { n: 10, head: "NUMBER", label: "The 8-minute fix" }],
  t202: ["Pasos", { steps: ["Pull 2 screws", "3-inch screw", "Next hinge", "Strike plate"] }],
  t208: ["Embudo", { top: "HELD BY THE TRIM", bottom: "HELD BY THE HOUSE", keep: 2 }],
  t210: ["Nivel", { from: 0.2, to: 0.95, mark: 0.9, markLabel: "LOCKED", label: "Shield + film + strong door" }],
  t213: ["Caja", { items: ["TOP OF THE STEPS", "BIG DOOR DOWN", "RELEASE SHIELD", "FILM", "SIDE DOOR"] }],
  t216: ["Domino", { chain: ["SOLID DOOR", "KEYPAD", "VACATION", "LIGHT", "8 MIN"] }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
