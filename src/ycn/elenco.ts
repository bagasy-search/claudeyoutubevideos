// Elenco fijo de «Yellow Coat Nell» (biblia D:/rtmp/zombieA/BIBLIA.md §2). Todas las sesiones usan ESTOS looks.
// Niños: alto 0,74 y escala NIÑO. Zombi «con la ropa de quien era» = zombi(LOOK).
import { Look, LuzP } from "../anikit/personaje";
import { PALETAS, Paleta } from "../anikit/paletas";

// paleta del canal: la zombi del kit, con el bowling cálido y el acento ROJO de emergencia
export const PAL: Paleta = { ...PALETAS.zombi, luz: "#ffc46b" };
export const ROJO = "#ff4a3d"; // contadores, DAY N, EXIT
export const ROSA_NEON = "#ff4fa8"; // letrero HOLLIS LANES
export const AMARILLO = "#f2c230"; // el piloto de Nell (la marca del canal)
export const TIZA = "#f4f1e8";
export const NIÑO = 0.86; // escala de Nell respecto de un adulto (además de alto 0,74)

export const NELL: Look = { estilo: "palo", camisa: AMARILLO, manga: "larga", pantalon: "#3a4a5a", zapatos: "#e2483a", alto: 0.74, accesorios: [{ t: "capucha", color: "#e6b422" }, { t: "trenzas", color: "#17100d", lazo: "#e2483a" }] };
export const CAL: Look = { estilo: "palo", camisa: "#3f6a9e", manga: "corta", pantalon: "#34384a", zapatos: "#2a1f18", accesorios: [{ t: "parche", color: "#e2483a" }, { t: "pelo", forma: "corto", color: "#17100d" }, { t: "barba", color: "#2a1a12" }] };
export const DOT: Look = { estilo: "palo", camisa: "#ff8fb8", manga: "corta", pantalon: "#5a4a6a", zapatos: "#f2f0ea", alto: 0.92, accesorios: [{ t: "pelo", forma: "bob", color: "#e9e6df" }, { t: "lentes", forma: "gato", color: "#c2185b" }] };
export const RAFI: Look = { estilo: "palo", camisa: "#e9e3d6", manga: "corta", pantalon: "#3a3550", zapatos: "#e9e3d6", accesorios: [{ t: "delantal", color: "#3f9a55" }, { t: "gorroPapel", color: "#f4f1ea" }, { t: "auriculares", color: "#2a2622" }] };
export const MARLON: Look = { estilo: "palo", camisa: "#2c3e6a", manga: "larga", pantalon: "#2c3e6a", zapatos: "#1a1410", accesorios: [{ t: "corbata", color: "#c23a2e", suelta: true }, { t: "pelo", forma: "corto", color: "#3a2a1e" }] };
// Marlon sin saco (Ep. 2: arremangado → se ve la venda)
export const MARLON_CAMISA: Look = { ...MARLON, camisa: "#dfe6ee", pantalon: "#2c3e6a" };
export const ANA: Look = { estilo: "palo", camisa: "#5f86c9", manga: "corta", pantalon: "#5f86c9", zapatos: "#f2f0ea", accesorios: [{ t: "pelo", forma: "cola", color: "#17100d" }] };
// Gus Pruitt, gerente de noche (61): chomba bordó de Hollis Lanes, pelado con barba gris (Ep. 1-2)
export const GUS: Look = { estilo: "palo", camisa: "#8a2e4a", manga: "corta", pantalon: "#3a3a40", zapatos: "#1d1d22", accesorios: [{ t: "pelo", forma: "calvo", color: "#000" }, { t: "barba", color: "#cfcac0" }] };

// gente de la liga y de la ruta (extras); de zombis van con zombi(…)
export const PINPAL: Look = { estilo: "palo", camisa: "#ff8fb8", manga: "corta", pantalon: "#4a4058", alto: 0.92, accesorios: [{ t: "pelo", forma: "bob", color: "#b9b2a6" }] };
export const LIGA: Look = { estilo: "palo", camisa: "#2f8f7a", manga: "corta", pantalon: "#2e3442", accesorios: [{ t: "pelo", forma: "corto", color: "#2a1a12" }] };
export const LIGA2: Look = { estilo: "palo", camisa: "#e9893a", manga: "corta", pantalon: "#34384a", accesorios: [{ t: "gorra", color: "#22305a" }] };
export const LIGA3: Look = { estilo: "palo", camisa: "#6a4fa8", manga: "corta", pantalon: "#2a2a30", accesorios: [{ t: "pelo", forma: "cola", color: "#3a2416" }] };
export const WAFFLE: Look = { estilo: "palo", camisa: "#f1ece2", manga: "corta", pantalon: "#2a2a30", accesorios: [{ t: "delantal", color: "#e2b23a" }, { t: "gorra", color: "#c23a2e" }] };
export const POLICIA: Look = { estilo: "palo", camisa: "#22305a", manga: "larga", pantalon: "#1d2438", accesorios: [{ t: "gorra", color: "#1d2438", placa: "#e8c24a" }] };

export const zombi = (l: Look): Look => ({ ...l, estilo: "zombi" });

// luz de borde de cada lugar (SIEMPRE poner una)
export const RIM = {
  liga: { lado: 1, color: "#ffd38a", fuerza: 0.9 } as LuzP, // la sala con las luces prendidas
  neon: { lado: -1, color: ROSA_NEON, fuerza: 0.85 } as LuzP, // el letrero rosa por la ventana / afuera
  noche: { lado: 1, color: "#9fd3c7", fuerza: 0.7 } as LuzP, // sala a oscuras, luz de emergencia
  pantalla: { lado: 1, color: "#ff9a3d", fuerza: 0.85 } as LuzP, // el marcador de la pista 8
  frio: { lado: -1, color: "#bfe8ff", fuerza: 0.85 } as LuzP, // dentro del freezer
  cocina: { lado: 1, color: "#ffcf7a", fuerza: 0.9 } as LuzP,
  linterna: { lado: 1, color: "#fff2c8", fuerza: 1 } as LuzP,
};
