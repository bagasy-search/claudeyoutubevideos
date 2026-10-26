// Elenco y paletas de Tenzo Films (canal D). Todo lo fijo del canal sale de acá: tz-b y tz-c importan esto tal cual.
// Paleta = PALETAS.parabola (gris carbón Monk Mode) con el acento ÁMBAR-ROJO #ff6a2b (Mara, su letra, la pantalla).
// Chicago: frío (azul pizarra, tubos blancos); el farol de Tenzo es la ÚNICA luz cálida. Parábolas: todo ámbar.
import { PALETAS, Paleta } from "../anikit/paletas";
import { Look } from "../anikit/personaje";

export const ACENTO = "#ff6a2b"; // Mara, letra a mano de Mara, pantalla del celular, contador cuando sube
export const ORO = "#ffc46a"; // el farol de Tenzo (única luz cálida en Chicago)
export const BLANCO_MANO = "#f4efe6"; // voz interior de Leo (texto a mano)
export const FRIO = "#8fb4e8"; // tubos, nieve, luna, neón azul

// Chicago de noche: gris pizarra azulado, ventanas apagadas o frías
export const PAL: Paleta = {
  ...PALETAS.parabola, nombre: "tenzo",
  cielo: ["#0d1017", "#161b25", "#232a36"], fachada: ["#262a32", "#2e333c", "#22262d", "#353a43"], ladrillo: "#1d2026",
  piso: "#22252b", vereda: "#2c3038", calle: "#191b20", luz: ORO, luzFria: FRIO, ventana: "#55678a", ventanaApagada: "#1a1d23",
  acento: ACENTO, texto: "#e8e4dc", sombra: "#050507",
};
// Chicago de día (Argyle al mediodía, invierno nublado): mismo gris, más claro y sin sombras duras
export const PAL_DIA: Paleta = {
  ...PAL, nombre: "tenzoDia",
  cielo: ["#8d949e", "#a9afb7", "#c4c8cd"], fachada: ["#5b5f66", "#6a6e75", "#53575e", "#73777e"], ladrillo: "#4a4d53",
  piso: "#6c7077", vereda: "#80848b", calle: "#4f5258", luz: "#e9e4d8", luzFria: "#d8dde4", ventana: "#9aa3ae", ventanaApagada: "#43464c",
};
// Mundo de las parábolas (India hace 2.500 años): todo ámbar y ocre, cálido y limpio
export const PAL_ANT: Paleta = {
  ...PALETAS.parabola, nombre: "tenzoAntiguo",
  cielo: ["#d9823e", "#f2ad5e", "#ffdc9c"], fachada: ["#e8c08a", "#d9a86e", "#f0d2a0", "#c99560"], ladrillo: "#b07c4a",
  piso: "#c9925a", vereda: "#dcac74", calle: "#b98552", luz: "#ffe2a6", luzFria: "#ffd18a", ventana: "#ffe7b0", ventanaApagada: "#8a5a34",
  acento: ACENTO, texto: "#fff4e0", sombra: "#3a2010",
};

// ---------- personajes ----------
// TENZO: 81 años, petiso, pelado piel durazno, cejas y barbita blancas, túnica gris, rosario de madera, farol de papel
export const TENZO: Look = {
  estilo: "frijol", piel: "#f2bf8f", camisa: "#8e8a82", miembro: "#f2bf8f", pantalon: "#8e8a82", zapatos: "#6a5440", ceja: "#f6f1e6",
  accesorios: [{ t: "pelo", forma: "calvo", color: "#f2bf8f" }, { t: "barba", color: "#f4efe4" }, { t: "tunica", color: "#8e8a82", largo: 0.95 }, { t: "rosario", color: "#7a4a2a" }],
  alto: 0.92,
};
// LEO MARSH: 24, pelo negro revuelto, buzo negro con capucha, auriculares blancos con cable, ojeras
export const LEO: Look = {
  estilo: "frijol", piel: "#ecc9a3", camisa: "#24242a", miembro: "#ecc9a3", pantalon: "#2c2c33", zapatos: "#bdb6aa",
  accesorios: [{ t: "capucha", color: "#1c1c21" }, { t: "pelo", forma: "punta", color: "#16141a" }, { t: "auriculares", color: "#f1ede6" }, { t: "ojeras", color: "#9a6e5c" }],
  alto: 1.08,
};
// LEO con la capucha puesta (calle con nieve)
export const LEO_CAPUCHA: Look = { ...LEO, accesorios: [{ t: "capucha", color: "#1c1c21" }, { t: "pelo", forma: "corto", color: "#16141a" }, { t: "auriculares", color: "#f1ede6" }, { t: "ojeras", color: "#9a6e5c" }] };
// MARA: sombra alta y flaca con borde neón ámbar-rojo; su ESCALA es el marcador emocional (crece si Leo cede)
export const MARA: Look = { estilo: "demonio", neon: ACENTO, alto: 1.45 };
// MARA en las parábolas (forma antigua): misma sombra, borde más dorado
export const MARA_ANT: Look = { estilo: "demonio", neon: "#ff8a3a", alto: 1.45 };

// ---------- parábolas ----------
export const MONJE_JOVEN: Look = { estilo: "frijol", piel: "#d9a273", camisa: "#e07a2c", miembro: "#d9a273", pantalon: "#e07a2c", zapatos: "#d9a273", accesorios: [{ t: "pelo", forma: "calvo", color: "#d9a273" }, { t: "tunica", color: "#e07a2c", largo: 0.9 }] };
export const BUDA: Look = { estilo: "frijol", piel: "#e2ad78", camisa: "#d8902e", miembro: "#e2ad78", pantalon: "#d8902e", zapatos: "#e2ad78", accesorios: [{ t: "pelo", forma: "corto", color: "#3a2618" }, { t: "tunica", color: "#d8902e", largo: 1 }], alto: 1.02 };
export const AMRAPALI: Look = { estilo: "frijol", piel: "#cf9468", camisa: "#b8323a", miembro: "#cf9468", pantalon: "#b8323a", zapatos: "#cf9468", accesorios: [{ t: "pelo", forma: "cola", color: "#1e1410" }, { t: "tunica", color: "#b8323a", largo: 1 }, { t: "bufanda", color: "#f2c14a" }] };
export const AMRAPALI_MONJA: Look = { ...AMRAPALI, camisa: "#e9dcc4", pantalon: "#e9dcc4", accesorios: [{ t: "pelo", forma: "bob", color: "#1e1410" }, { t: "tunica", color: "#e9dcc4", largo: 1 }] };
export const SIDDHARTHA: Look = { estilo: "frijol", piel: "#dfa877", camisa: "#f1e2c0", miembro: "#dfa877", pantalon: "#f1e2c0", zapatos: "#c9963a", accesorios: [{ t: "pelo", forma: "cola", color: "#22160e" }, { t: "tunica", color: "#f1e2c0", largo: 0.8 }, { t: "bufanda", color: "#e0a23a" }] };
export const REY: Look = { estilo: "frijol", piel: "#d9a273", camisa: "#a8322c", miembro: "#d9a273", pantalon: "#a8322c", zapatos: "#c9963a", accesorios: [{ t: "barba", color: "#2a1a10" }, { t: "pelo", forma: "corto", color: "#2a1a10" }, { t: "tunica", color: "#a8322c", largo: 1 }, { t: "corona", color: "#e0b040" }] };
export const ASITA: Look = { estilo: "frijol", piel: "#cf9a6c", camisa: "#e9dcc4", miembro: "#cf9a6c", pantalon: "#e9dcc4", zapatos: "#cf9a6c", ceja: "#f6f1e6", accesorios: [{ t: "pelo", forma: "calvo", color: "#cf9a6c" }, { t: "barba", color: "#f4efe4" }, { t: "tunica", color: "#e9dcc4", largo: 1 }] };
export const CHANNA: Look = { estilo: "frijol", piel: "#c98e5e", camisa: "#5a7a8a", miembro: "#c98e5e", pantalon: "#e9dcc4", zapatos: "#6a4a2a", accesorios: [{ t: "pelo", forma: "corto", color: "#22160e" }, { t: "vincha", color: "#e0a23a" }] };
export const VIEJO: Look = { estilo: "frijol", piel: "#c7976e", camisa: "#a89070", miembro: "#c7976e", pantalon: "#a89070", zapatos: "#c7976e", ceja: "#f6f1e6", accesorios: [{ t: "pelo", forma: "calvo", color: "#c7976e" }, { t: "barba", color: "#ece6da" }, { t: "tunica", color: "#a89070", largo: 0.9 }] };
export const ENFERMO: Look = { estilo: "frijol", piel: "#b99a7a", camisa: "#9a8a70", miembro: "#b99a7a", pantalon: "#9a8a70", zapatos: "#b99a7a", accesorios: [{ t: "pelo", forma: "corto", color: "#3a2a1a" }] };
export const ALDEANO: Look = { estilo: "frijol", piel: "#c98e5e", camisa: "#d9a86e", miembro: "#c98e5e", pantalon: "#e9dcc4", zapatos: "#6a4a2a", accesorios: [{ t: "pelo", forma: "corto", color: "#22160e" }] };
export const ALDEANA: Look = { estilo: "frijol", piel: "#cf9468", camisa: "#c8603a", miembro: "#cf9468", pantalon: "#c8603a", zapatos: "#cf9468", accesorios: [{ t: "pelo", forma: "bob", color: "#22160e" }, { t: "tunica", color: "#c8603a", largo: 1 }] };
// Chicago: el viejo de la parada del 36 (campera finita), mamá Diane (sólo voz / foto)
export const VIEJO_36: Look = { estilo: "frijol", piel: "#d9b896", camisa: "#5a5f66", miembro: "#d9b896", pantalon: "#3a3d42", zapatos: "#2a2a2e", ceja: "#e9e6e0", accesorios: [{ t: "gorra", color: "#3a3d42" }, { t: "barba", color: "#d9d6d0" }, { t: "bufanda", color: "#4a4e55" }] };

export const ESC = 1.15; // escala base de personajes en Chicago

// poses propias del canal (se pasan en `poses` del Actor)
// LOTO: sentado en el suelo con las piernas cruzadas (usar asiento 8); manos en el regazo
export const LOTO = { tronco: -2, pI: 70, rI: 150, pD: 100, rD: 160, hI: 12, cI: 70, hD: 18, cD: 75, cabeza: 0 };
// LOTO_ENSENA: igual, con la mano derecha levantada (enseña)
export const LOTO_ENSENA = { ...LOTO, hD: 70, cD: 80 };
// FAROL: brazo con el farol colgando (el objeto en la mano queda vertical)
export const FAROL = { hD: 10, cD: 10 };
