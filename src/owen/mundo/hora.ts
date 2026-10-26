// Hora del día de Chicago: cielo, luz y tono de las ventanas. Todos los sets del mundo de Owen la leen.
export type Hora = "noche" | "alba" | "manana" | "dia" | "tarde" | "ocaso";
export type Luces = { cielo: [string, string, string]; sol: string; solY: number; luz: string; ventanas: number; calle: string; sombra: number; farol: number };
export const LUCES: Record<Hora, Luces> = {
  noche: { cielo: ["#0e1430", "#1c2450", "#36345e"], sol: "#dfe6ff", solY: 140, luz: "#ffd27a", ventanas: 0.85, calle: "#24242c", sombra: 0.55, farol: 1 },
  alba: { cielo: ["#1d2a5a", "#7a5a8a", "#ffb08a"], sol: "#ffd0a0", solY: 640, luz: "#ffd8a0", ventanas: 0.6, calle: "#3a3640", sombra: 0.35, farol: 0.8 },
  manana: { cielo: ["#6aa6d8", "#a9d0e6", "#ffe8c4"], sol: "#fff3d0", solY: 380, luz: "#fff0c8", ventanas: 0.15, calle: "#44424a", sombra: 0.15, farol: 0 },
  dia: { cielo: ["#5c9ad6", "#9cc8e8", "#e6f2f4"], sol: "#ffffff", solY: 160, luz: "#fff6dc", ventanas: 0.05, calle: "#46454c", sombra: 0.1, farol: 0 },
  tarde: { cielo: ["#f6b04a", "#f7d27a", "#fff0c4"], sol: "#fff6c8", solY: 420, luz: "#ffd27a", ventanas: 0.25, calle: "#4a4040", sombra: 0.2, farol: 0 },
  ocaso: { cielo: ["#3b2c5a", "#d8706a", "#ffc27a"], sol: "#ffe2a0", solY: 600, luz: "#ffc27a", ventanas: 0.55, calle: "#3a3038", sombra: 0.3, farol: 0.6 },
};
