// Elenco fijo de «Owen Upgraded» (biblia D:/rtmp/canalB/BIBLIA.md). Todas las sesiones usan ESTOS looks.
import { Look, LuzP } from "../anikit/personaje";
import { PALETAS } from "../anikit/paletas";

export const PAL = PALETAS.whatif;
export const VERDE = "#7dff6a"; // el cartel sobre las cabezas

export const OWEN: Look = { estilo: "palo", camisa: "#a8d4f0", pantalon: "#2a3448", zapatos: "#1d1d22", accesorios: [{ t: "chaleco", color: "#22305a" }, { t: "gorra", color: "#22305a", placa: "#e8c24a" }] };
export const OWEN_CASA: Look = { estilo: "palo", camisa: "#d9d2c4", manga: "corta", pantalon: "#4a4f5e", zapatos: "#2a2a30", accesorios: [{ t: "pelo", forma: "corto", color: "#17100d" }] };
export const ROSA: Look = { estilo: "palo", camisa: "#b8463c", manga: "larga", pantalon: "#5a4a4a", zapatos: "#3a2a24", alto: 0.9, accesorios: [{ t: "pelo", forma: "bob", color: "#dcd6cc" }, { t: "lentes", color: "#c9a85a" }, { t: "delantal", color: "#efe4cf" }] };
export const DEE: Look = { estilo: "palo", camisa: "#3fa39a", manga: "corta", pantalon: "#3fa39a", zapatos: "#f2f0ea", accesorios: [{ t: "pelo", forma: "cola", color: "#17100d" }] };
export const ABERNATHY: Look = { estilo: "palo", camisa: "#7a5236", manga: "larga", pantalon: "#4a4038", zapatos: "#2a1f18", accesorios: [{ t: "pelo", forma: "calvo", color: "#d9d4cb" }, { t: "barba", color: "#d9d4cb" }, { t: "sombrero", color: "#4a3a2c" }] };
export const LENA: Look = { estilo: "palo", camisa: "#f1ece2", manga: "corta", pantalon: "#3a3550", zapatos: "#e2483a", accesorios: [{ t: "pelo", forma: "cola", color: "#2a1a12" }, { t: "delantal", color: "#2f6b4a" }] };
export const TINY: Look = { estilo: "palo", camisa: "#e9893a", manga: "corta", pantalon: "#34384a", zapatos: "#1d1d22", accesorios: [{ t: "chaleco", color: "#e8d33a" }, { t: "barba", color: "#17100d" }, { t: "pelo", forma: "calvo", color: "#000" }] };
export const HALE: Look = { estilo: "palo", camisa: "#e9eef2", manga: "larga", pantalon: "#3a4050", zapatos: "#1d1d22", accesorios: [{ t: "bata", color: "#ffffff" }, { t: "pelo", forma: "bob", color: "#1a1210" }, { t: "lentes", color: "#2a2a2a" }] };
export const ABRIGO: Look = { estilo: "palo", camisa: "#8a8d92", manga: "larga", pantalon: "#55585e", zapatos: "#1d1d22", accesorios: [{ t: "sombrero", color: "#5d6066" }, { t: "bufanda", color: "#6e7176" }] };
// pasajeros que vuelven en el bus
export const TEEN: Look = { estilo: "palo", camisa: "#f08a24", manga: "larga", pantalon: "#2e3a52", zapatos: "#f2f0ea", accesorios: [{ t: "capucha", color: "#e07a1c" }, { t: "auriculares", color: "#1d1d22" }] };
export const SCRUBS: Look = { estilo: "palo", camisa: "#6f8fd0", manga: "corta", pantalon: "#6f8fd0", zapatos: "#f2f0ea", accesorios: [{ t: "pelo", forma: "bob", color: "#3a2416" }] };
export const RUNNER: Look = { estilo: "palo", camisa: "#2fb36b", manga: "larga", pantalon: "#1f2430", zapatos: "#f05a1f", accesorios: [{ t: "vincha", color: "#f2f0ea" }] };
export const FUMADOR: Look = { estilo: "palo", camisa: "#5a5f3a", manga: "larga", pantalon: "#3a3a40", zapatos: "#2a2a2a", accesorios: [{ t: "gorra", color: "#2a2a2a", atras: true }] };
export const OFICINISTA: Look = { estilo: "palo", camisa: "#2c3e6a", manga: "larga", pantalon: "#2c3e6a", accesorios: [{ t: "corbata", color: "#c23a2e" }, { t: "pelo", forma: "corto", color: "#3a2a1e" }] };
export const ESTUDIANTE: Look = { estilo: "palo", camisa: "#c94f8a", manga: "larga", pantalon: "#3a3550", accesorios: [{ t: "pelo", forma: "punta", color: "#17100d" }, { t: "mochila", color: "#3f6fb0" }] };
export const SENORA: Look = { estilo: "palo", camisa: "#8a6bd1", manga: "larga", pantalon: "#4a3a5a", alto: 0.92, accesorios: [{ t: "pelo", forma: "bob", color: "#9a8a7a" }, { t: "bufanda", color: "#e9a92c" }] };
export const OBRERO: Look = { estilo: "palo", camisa: "#3f5b7a", manga: "larga", pantalon: "#5a4a3a", accesorios: [{ t: "gorra", color: "#c23a2e" }, { t: "barba", color: "#2a1a12" }] };
export const NENE: Look = { estilo: "palo", camisa: "#f2c230", pantalon: "#3a4a5a", zapatos: "#e2483a", alto: 0.74, accesorios: [{ t: "pelo", forma: "punta", color: "#17100d" }] };

// luz de borde de cada lugar (SIEMPRE poner una)
export const RIM = {
  tubo: { lado: 1, color: "#d8fff2", fuerza: 0.75 } as LuzP,
  alba: { lado: -1, color: "#ffb0a0", fuerza: 0.8 } as LuzP,
  sol: { lado: -1, color: "#ffd27a", fuerza: 0.95 } as LuzP,
  cocina: { lado: 1, color: "#ffd88a", fuerza: 0.9 } as LuzP,
  noche: { lado: 1, color: "#9fc4ff", fuerza: 0.7 } as LuzP,
  clinica: { lado: -1, color: "#e8fbff", fuerza: 0.8 } as LuzP,
  verde: { lado: 1, color: "#7dff6a", fuerza: 0.7 } as LuzP,
};
