// Looks nuevos de tz-b (tz03 China · tz04 Japón y el 36). Lo fijo del canal (Tenzo, Leo, Mara, paletas) sale de ./elenco.
import { Look } from "../anikit/personaje";

// tz03 · el granjero viejo de la aldea china (sombrero de paja cónico, azada)
export const GRANJERO: Look = {
  estilo: "frijol", piel: "#cf9468", camisa: "#6a7a5a", miembro: "#cf9468", pantalon: "#8a7a5a", zapatos: "#5a3a22", ceja: "#f2ede2",
  accesorios: [{ t: "pelo", forma: "calvo", color: "#cf9468" }, { t: "barba", color: "#ece6da" }, { t: "sombrero", color: "#e0b860" }],
};
// tz03 · el jinete joven apurado (cara roja la pone la expresión + Halo; pelo atado)
export const JINETE: Look = {
  estilo: "frijol", piel: "#e2a476", camisa: "#a8322c", miembro: "#e2a476", pantalon: "#5a3a22", zapatos: "#3a2416",
  accesorios: [{ t: "pelo", forma: "cola", color: "#1e140e" }, { t: "vincha", color: "#e0a23a" }],
};
// tz03 · monjes jóvenes de Shōun-ji (inserto de «forgot ten thousand times»)
export const MONJE_SHOUNJI: Look = {
  estilo: "frijol", piel: "#e6b88a", camisa: "#3e3a36", miembro: "#e6b88a", pantalon: "#3e3a36", zapatos: "#e6b88a",
  accesorios: [{ t: "pelo", forma: "calvo", color: "#e6b88a" }, { t: "tunica", color: "#3e3a36", largo: 0.95 }],
};

// tz04 · TANZAN: monje viejo, calvo, túnica ocre (≠ gris de Tenzo para no confundirlos), rosario
export const TANZAN: Look = {
  estilo: "frijol", piel: "#efb98a", camisa: "#b8863e", miembro: "#efb98a", pantalon: "#b8863e", zapatos: "#6a4a2a", ceja: "#f6f1e6",
  accesorios: [{ t: "pelo", forma: "calvo", color: "#efb98a" }, { t: "barba", color: "#f4efe4" }, { t: "tunica", color: "#b8863e", largo: 0.95 }, { t: "rosario", color: "#6a3a1e" }],
  alto: 0.95,
};
// tz04 · EKIDO: monje joven, rapado, túnica gris oscura, estricto
export const EKIDO: Look = {
  estilo: "frijol", piel: "#e6b88a", camisa: "#4a4640", miembro: "#e6b88a", pantalon: "#4a4640", zapatos: "#6a4a2a",
  accesorios: [{ t: "pelo", forma: "calvo", color: "#e6b88a" }, { t: "tunica", color: "#4a4640", largo: 1 }],
  alto: 1.05,
};
// tz04 · la chica del kimono de seda (rojo-ámbar, faja dorada, pelo recogido)
export const CHICA_KIMONO: Look = {
  estilo: "frijol", piel: "#f0c69e", camisa: "#c23a2e", miembro: "#f0c69e", pantalon: "#c23a2e", zapatos: "#f0c69e",
  accesorios: [{ t: "pelo", forma: "cola", color: "#1e1410" }, { t: "tunica", color: "#c23a2e", largo: 1 }, { t: "bufanda", color: "#e8b84a" }],
  alto: 0.92,
};
// tz04 · MAYA (BIBLIA): 23, bufanda VERDE (único verde del canal), ambo de enfermería bajo el abrigo, libro de papel
export const MAYA: Look = {
  estilo: "frijol", piel: "#d9a27a", camisa: "#4a4e58", miembro: "#d9a27a", pantalon: "#7fa6b8", zapatos: "#e9e6e0",
  accesorios: [{ t: "pelo", forma: "bob", color: "#2a1a12" }, { t: "bufanda", color: "#3f9a6a" }],
};
// tz04 · Amrapali vieja (inserto del poema «now white like hemp»)
export const AMRAPALI_VIEJA: Look = {
  estilo: "frijol", piel: "#c99a74", camisa: "#e9dcc4", miembro: "#c99a74", pantalon: "#e9dcc4", zapatos: "#c99a74", ceja: "#f6f1e6",
  accesorios: [{ t: "pelo", forma: "bob", color: "#ece6da" }, { t: "tunica", color: "#e9dcc4", largo: 1 }],
  alto: 0.94,
};
