// rk5na · un componente ÚNICO por toma C. t014 y t234 = la CTA de la tapa (Body), sin componente encima.
import React from "react";
import { ARQ } from "./arq";
type F = React.FC<{ t: number; h: any }>;
const D: Record<string, [string, Record<string, any>]> = {
  t001: ["Versus", { labels: ["THE CAR HE TAKES", "THE CAR HE SKIPS"], win: 1 }],
  t011: ["Contador", { n: 11, label: "THINGS THAT MAKE A CAR NOT WORTH IT" }],
  t018: ["Grilla", { caps: ["1 in 50", "", "", ""], pick: 0, col: "#ff5a4a" }],
  t021: ["Caen", { words: ["TIME.", "NOISE.", "SEEN."] }],
  t025: ["Caja", { items: ["TIME", "NOISE", "SEEN"] }],
  t031: ["Balanza", { l: "$300 WINDOW", r: "$3 IN QUARTERS", right: false }],
  t036: ["Cortina", { labels: ["SOMETHING TO LOOK AT", "NOTHING TO LOOK AT"] }],
  t044: ["Aro", { x: 0.5, y: 0.55, label: "THE CABLE SAYS: PHONE NEARBY" }],
  t052: ["Cronometro", { from: 0, to: 0.5, label: "Half a second to try a handle" }],
  t058: ["Regla", { frac: 0.08, val: "1 INCH", label: "Cracked an inch = open" }],
  t062: ["DosLugares", { a: "KEY ON THE HOOK", b: "THE CAR", label: "Ten feet from the door" }],
  t071: ["Pasos", { steps: ["Fob in the box", "Walk to the car", "Pull the handle"] }],
  t076: ["Ranking", { n: 5, cur: 3, label: "NOT EVERY FOB SLEEPS THE SAME" }],
  t084: ["Semaforo", { luz: 1, word: "LIGHT THAT CHANGES", label: "He can't learn its shadows" }],
  t089: ["Recorrido", { stops: ["THE STREET", "THE DRIVEWAY", "THE CAR"] }],
  t094: ["Escudo", { threats: ["DARK", "QUIET", "UNSEEN"], label: "LIGHT ON UNTIL SUNRISE" }],
  t097: ["Bateria", { from: 0.1, to: 1, label: "30 seconds becomes 5 minutes" }],
  t104: ["Nota", { note: "There are just locks that take longer than the man wants to spend." }],
  t110: ["Candado", { label: "THE CHIP AND THE CAR TALK" }],
  t114: ["Sobre", { note: "Ask your dealer about the anti-theft software upgrade." }],
  t121: ["Escalera", { steps: ["Time ✓", "Seen ✓", "Noise"] }],
  t127: ["Manometro", { v: 0.75, lo: "STILL", hi: "TILTED", label: "SHOCK + TILT SENSOR" }],
  t137: ["Llave", { a: "ON THE STREET", b: "IN THE GARAGE" }],
  t142: ["Lupa", { x: 0.5, y: 0.65, label: "WHEELS INTO THE CURB" }],
  t146: ["Bolsa", { items: ["CONVERTER", "WHEELS", "TAILGATE"], label: "SOMETIMES IT ISN'T THE CAR" }],
  t152: ["Sello", { word: "ETCHED" }],
  t157: ["Almanaque", { n: 7, head: "NIGHT", label: "Same car, same spot, every night" }],
  t167: ["Tachar", { items: ["DARK CORNER", "SAME SPOT", "NOSE OUT", "CRACKED WINDOW", "STUFF ON THE SEAT"] }],
  t169: ["Polaroids", { caps: ["Ford", "Toyota", "Honda"] }],
  t180: ["Carta", { a: "Registration in the glove box", b: "A copy in your wallet" }],
  t187: ["Reloj", { min: 1, unit: "MIN", label: "Every night, before bed" }],
  t198: ["Foco", { word: "ORANGE = HE CARES" }],
  t201: ["Linea", { items: [{ y: "1989", l: "what Walt said" }, { y: "TODAY", l: "what the men say" }] }],
  t212: ["Embudo", { top: "ALL THE CARS ON THE STREET", bottom: "THE ONE HE SKIPS", keep: 9 }],
  t225: ["Capas", { layers: ["LOCK ON THE WHEEL", "LIGHT ON THE CAR", "KEY IN THE MIDDLE"] }],
  t226: ["Pegotes", { notes: ["Nothing to see", "Fob asleep", "Light", "Lock", "Wheels in", "Garage"] }],
};
export const HEROES: Record<string, F> = Object.fromEntries(Object.entries(D).map(([k, [a, d]]) => {
  const A = ARQ[a];
  const C: F = ({ t, h }) => <A t={t} h={{ ...h, ...d }} />;
  return [k, C];
}));
