// Hora y estación de Duluth: cielo, sol, tono de las ventanas y del lago. Todos los sets del mundo la leen.
export type Hora = "noche" | "alba" | "dia" | "ocaso" | "invierno" | "tormenta";
export type Luces = { cielo: [string, string, string]; sol: string; solY: number; lago: [string, string]; nieve: string; tinte: string; estrellas: number; borde: string };
export const LUCES: Record<Hora, Luces> = {
  noche: { cielo: ["#121a36", "#1d2440", "#3b2e42"], sol: "#e8ecff", solY: 160, lago: ["#1b2244", "#0f1428"], nieve: "#b9c2e0", tinte: "#1d2440", estrellas: 1, borde: "#9bb7ff" },
  alba: { cielo: ["#1d2440", "#6a3f5c", "#e9874a"], sol: "#ffd8a0", solY: 640, lago: ["#7a4a5e", "#2a2240"], nieve: "#e8c8c8", tinte: "#6a3f5c", estrellas: 0.2, borde: "#ffb08a" },
  dia: { cielo: ["#6f8fb8", "#a9bfd6", "#e6dccb"], sol: "#fff3d6", solY: 240, lago: ["#6f8fae", "#3d5a78"], nieve: "#f2f0ea", tinte: "#a9bfd6", estrellas: 0, borde: "#fff0c8" },
  ocaso: { cielo: ["#1d2440", "#7a3f52", "#f2924a"], sol: "#ffd27a", solY: 600, lago: ["#c06a4a", "#2a2240"], nieve: "#f0c6a8", tinte: "#7a3f52", estrellas: 0.1, borde: "#ffcf6e" },
  invierno: { cielo: ["#3e4f74", "#7d8fb0", "#c9d3e2"], sol: "#f4f6ff", solY: 300, lago: ["#8fa6c0", "#46607e"], nieve: "#f4f6fa", tinte: "#7d8fb0", estrellas: 0, borde: "#e6eeff" },
  tormenta: { cielo: ["#1a2236", "#2c3a56", "#4a5a78"], sol: "#c9d3e2", solY: 200, lago: ["#2c3a56", "#151c2c"], nieve: "#c6d0e2", tinte: "#2c3a56", estrellas: 0, borde: "#9bb7ff" },
};
