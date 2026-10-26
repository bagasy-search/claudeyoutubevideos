// Personajes que agregan ob04-ob06 (sesión B). Los fijos de la serie están en elenco.ts.
import { Look } from "../anikit/personaje";

export const DELPHINE: Look = { estilo: "palo", camisa: "#7a4a8a", manga: "larga", pantalon: "#3a2e44", alto: 0.9, accesorios: [{ t: "pelo", forma: "bob", color: "#bdb8b0" }, { t: "bufanda", color: "#d9a64a" }] };
export const TRAJE: Look = { estilo: "palo", camisa: "#24304a", manga: "larga", pantalon: "#24304a", accesorios: [{ t: "corbata", color: "#c9302c" }, { t: "pelo", forma: "corto", color: "#3a2a20" }, { t: "lentes", color: "#111111" }] };
export const ENFERMERA: Look = { estilo: "palo", camisa: "#9fd0e8", manga: "corta", pantalon: "#9fd0e8", zapatos: "#f2f2ee", accesorios: [{ t: "pelo", forma: "bob", color: "#6a3a20" }] };

// pasajeros genéricos: ropa variada pero dentro de la paleta (nunca dos iguales seguidos)
const CAMISAS = ["#e2a35a", "#5b9a8b", "#c9463a", "#4d6fa0", "#f2c14a", "#8f6bd1", "#e8603a", "#6a8a4a", "#d9a66a", "#3a5550"];
const PANTS = ["#2b2622", "#3a4458", "#4a4038", "#2a3448", "#5a4a3a"];
const PELOS = ["corto", "punta", "bob", "cola", "calvo"] as const;
export const pasajero = (i: number, extra: Partial<Look> = {}): Look => ({
  estilo: "palo", camisa: CAMISAS[i % CAMISAS.length], manga: i % 3 ? "larga" : "corta", pantalon: PANTS[(i * 3) % PANTS.length],
  accesorios: [
    { t: "pelo", forma: PELOS[(i * 7) % PELOS.length], color: ["#17100d", "#3a2016", "#6a3a20", "#d9d4cc"][(i * 5) % 4] },
    ...(i % 4 === 1 ? [{ t: "mochila" as const, color: CAMISAS[(i + 4) % CAMISAS.length] }] : []),
    ...(i % 5 === 2 ? [{ t: "auriculares" as const, color: "#2a2a30" }] : []),
    ...(i % 6 === 3 ? [{ t: "gorra" as const, color: CAMISAS[(i + 2) % CAMISAS.length] }] : []),
  ],
  ...extra,
});
