// Paleta de cada canal: base apagada + UN acento. Los sets leen de acá para que el mismo set sirva a los 4 looks.
export type Paleta = {
  nombre: string;
  cielo: [string, string, string]; // arriba, medio, horizonte
  fachada: string[]; // colores de edificios / paredes (se rotan)
  ladrillo: string; // líneas de ladrillo
  piso: string; vereda: string; calle: string;
  luz: string; // luz cálida principal (lámparas, ventanas)
  luzFria: string; // luz secundaria (luna, tubos, pantallas)
  ventana: string; ventanaApagada: string;
  acento: string; // EL color de la historia (contador, demonio, alarma)
  texto: string; // HUD
  sombra: string;
};

export const PALETAS: Record<"zombi" | "whatif" | "humanidad" | "parabola" | "awaken", Paleta> = {
  // A · serie zombie: noche fría verde-pizarra, luces de sodio apagándose, acento ROJO de emergencia
  zombi: {
    nombre: "zombi", cielo: ["#0f1a1f", "#1d2e33", "#3c4a45"], fachada: ["#2c3a3c", "#34433f", "#283234", "#3a3f3a"], ladrillo: "#20292a",
    piso: "#2a3230", vereda: "#3b4442", calle: "#1f2526", luz: "#ffc46b", luzFria: "#9fd3c7", ventana: "#e9b458", ventanaApagada: "#1a2224",
    acento: "#ff4a3d", texto: "#e6efe9", sombra: "#070b0c",
  },
  // B · What If You Could…: cálido de tarde en lo cotidiano, HUD azul noche con verde-agua cuando entra la ciencia
  whatif: {
    nombre: "whatif", cielo: ["#f6b04a", "#f7d27a", "#fff0c4"], fachada: ["#2f4a46", "#e7c08a", "#d7a86c", "#3a5550"], ladrillo: "#27403c",
    piso: "#8a5a36", vereda: "#a8754a", calle: "#3d3a3a", luz: "#ffd27a", luzFria: "#53e0c0", ventana: "#ffe39a", ventanaApagada: "#2d3b44",
    acento: "#43e0b4", texto: "#f6f0e2", sombra: "#2a1608",
  },
  // C · escenarios de humanidad: atardecer naranja-rosa (Awaken), acento AMARILLO cálido
  humanidad: {
    nombre: "humanidad", cielo: ["#3b2c5a", "#d8706a", "#ffc27a"], fachada: ["#c98a5e", "#e2a774", "#b9765a", "#f0c28c"], ladrillo: "#9b6446",
    piso: "#5c7a4a", vereda: "#c79a68", calle: "#6b5a4a", luz: "#ffd58a", luzFria: "#9bb7ff", ventana: "#ffe2a0", ventanaApagada: "#5a3f3a",
    acento: "#ffc93c", texto: "#fff4e0", sombra: "#2b1a14",
  },
  // D · parábolas antiguas vs vicios modernos: gris carbón (Monk Mode), acento ROSA NEÓN del «demonio»
  parabola: {
    nombre: "parabola", cielo: ["#141416", "#1e1e22", "#2a2a2f"], fachada: ["#2b2b30", "#33333a", "#26262b", "#3a3a40"], ladrillo: "#222226",
    piso: "#232327", vereda: "#2e2e33", calle: "#1b1b1e", luz: "#ffcf84", luzFria: "#a9b4c8", ventana: "#d8b46a", ventanaApagada: "#1e1e22",
    acento: "#ff3fa4", texto: "#e8e4dc", sombra: "#050506",
  },
  // referencia Awaken (calle violeta de noche, café cálido)
  awaken: {
    nombre: "awaken", cielo: ["#2c2f5a", "#55508a", "#9a7fb0"], fachada: ["#5a5a9a", "#6463a6", "#4f4e8a", "#6f6aa8"], ladrillo: "#4a4880",
    piso: "#4a4a78", vereda: "#6b6a9a", calle: "#3c3b5e", luz: "#ffdca0", luzFria: "#c7c3ff", ventana: "#ffd88c", ventanaApagada: "#3a3a66",
    acento: "#ff5aa0", texto: "#f4f0e6", sombra: "#15142a",
  },
};
