// skhpapers · posiciones del mundo (aparte para que tl.ts no importe papers3d: evita la importación circular)
export type V = [number, number, number];
export const PILES: { p: V; n: number; kind: "news" | "paper" | "box" | "cards" | "books" }[] = [
  { p: [2.25, 0.08, 1.25], n: 16, kind: "news" },   // 1 revistas/diarios (al lado del engawa)
  { p: [-1.05, 0.08, 0.15], n: 10, kind: "paper" }, // 2 el correo sin abrir
  { p: [-1.45, 0.08, -0.7], n: 12, kind: "books" }, // 3 manuales
  { p: [-1.95, 0.08, 0.05], n: 3, kind: "box" },    // 4 cajas de zapatos con recibos
  { p: [1.3, 0.08, -1.25], n: 14, kind: "cards" },  // 5 tarjetas de año nuevo atadas
  { p: [-0.25, 0.08, -1.25], n: 9, kind: "paper" }, // 6 papeles sueltos "importantes"
  { p: [1.65, 0.08, 0.55], n: 12, kind: "cards" },  // 7 cartas
  { p: [-0.95, 0.08, 1.15], n: 2, kind: "box" },    // 8 la caja de los chicos
  { p: [2.15, 0.08, -0.55], n: 10, kind: "books" }, // 9 cuadernos/diarios
  { p: [-2.0, 0.08, 1.35], n: 3, kind: "box" },     // 10 el "algún día"
  { p: [0.95, 0.08, 1.3], n: 11, kind: "paper" },   // 11 todo lo demás
];
export const FOLDER: V = [-0.68, 0.302, -1.6];
export const ENVELOPE: V = [-2.27, 0.99, 0.32];
export const KIRI: V = [0.42, 0.335, 0.1];
export const DRUM: V = [4.65, 0, 0.95];
export const BASKET: V = [3.35, 0.28, 1.45];
