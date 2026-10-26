// The Last Census: paleta del canal (la del banner: noche índigo → magenta → ámbar) y looks FIJOS del elenco.
// Todos los episodios usan ESTOS looks (D:/rtmp/census/MUNDO.md). Colores de la biblia §2.
import { Look } from "../anikit/personaje";
import { Paleta } from "../anikit/paletas";

export const AMBAR = "#ffcf6e"; // contador POPULATION, la ventana con luz, el acento de la serie
export const CAPSULA = "#120f18";
export const ROJO_CENSO = "#c0352c"; // el cuaderno rojo

export const PAL: Paleta = {
  nombre: "census", cielo: ["#1d2440", "#3b2e42", "#7a3f52"], fachada: ["#3b2e42", "#3a2a3c", "#2b2f3a", "#45324a"], ladrillo: "#2a2030",
  piso: "#2b2533", vereda: "#3a3242", calle: "#221d2a", luz: "#ffd27a", luzFria: "#9bb7ff", ventana: AMBAR, ventanaApagada: "#241c2e",
  acento: AMBAR, texto: "#f6ecd2", sombra: "#120f18",
};

export const THEO: Look = {
  estilo: "palo", camisa: "#c8582b", manga: "larga", pantalon: "#3b4a5c", zapatos: "#1a1410",
  accesorios: [{ t: "gorroLana", color: "#b2342a", vuelta: "#efe3c8" }],
};
export const JUNE: Look = {
  estilo: "palo", camisa: "#2f7f86", manga: "larga", pantalon: "#2b2f3a", zapatos: "#1a1410",
  accesorios: [{ t: "pelo", forma: "cola", color: "#17110d" }],
};
export const GUS: Look = {
  estilo: "palo", camisa: "#8a6b3e", manga: "larga", pantalon: "#3a3530", zapatos: "#1a1410",
  accesorios: [{ t: "pelo", forma: "corto", color: "#cfcac2" }, { t: "bigote", color: "#cfcac2" }],
};
// variantes de abrigo (invierno): bufanda y mochila sobre el mismo look
export const conAcc = (l: Look, ...a: NonNullable<Look["accesorios"]>): Look => ({ ...l, accesorios: [...(l.accesorios ?? []), ...a] });
export const THEO_INV = conAcc(THEO, { t: "bufanda", color: "#efe3c8" });
export const JUNE_INV = conAcc(JUNE, { t: "bufanda", color: "#d9cdb2" });
export const THEO_MOCHI = conAcc(THEO, { t: "mochila", color: "#4a4a3a" });
export const JUNE_MOCHI = conAcc(JUNE, { t: "mochila", color: "#2a2a2e" });
// sin gorro (adentro)
export const THEO_CASA: Look = { ...THEO, accesorios: [{ t: "pelo", forma: "corto", color: "#5a3a22" }] };

// luz de borde por defecto (cálida desde la ventana / fría desde la noche)
export const BORDE_CALIDO = { lado: 1 as const, color: "#ffcf6e", fuerza: 0.85 };
export const BORDE_FRIO = { lado: -1 as const, color: "#9bb7ff", fuerza: 0.7 };
