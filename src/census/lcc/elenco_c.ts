// Elenco del Ep.5-6 (lc-c) que no está en census/elenco.ts: los 10 de la granja (biblia §personajes), Abby y el Dr. Halvorsen.
import { Look } from "../../anikit/personaje";
import { conAcc } from "../elenco";

export const MARCUS: Look = { estilo: "palo", camisa: "#3f6a3a", manga: "larga", pantalon: "#3f6a3a", zapatos: "#2a1e16", accesorios: [{ t: "chaleco", color: "#4f7a44" }, { t: "gorra", color: "#5a4a32" }, { t: "barba", color: "#2a2018" }] };
export const ROSA: Look = { estilo: "palo", camisa: "#8a4a3a", manga: "larga", pantalon: "#3a3036", zapatos: "#1a1410", accesorios: [{ t: "delantal", color: "#d9a531" }, { t: "pelo", forma: "bob", color: "#2a1a14" }] };
export const PRIYA: Look = { estilo: "palo", camisa: "#7a4f9a", manga: "larga", pantalon: "#2b2f3a", zapatos: "#1a1410", accesorios: [{ t: "pelo", forma: "cola", color: "#120c0a" }] };
export const DEV: Look = { estilo: "palo", camisa: "#7d7f86", manga: "larga", pantalon: "#2f3540", zapatos: "#e6e2da", accesorios: [{ t: "capucha", color: "#6d6f76" }] };
export const NAN: Look = { estilo: "palo", camisa: "#6a5a7a", manga: "larga", pantalon: "#4a4040", zapatos: "#1a1410", accesorios: [{ t: "bufanda", color: "#b8382c" }, { t: "pelo", forma: "bob", color: "#e8e4dc" }, { t: "lentes", color: "#d8cdb8" }] };
export const BEN: Look = { estilo: "palo", camisa: "#e3b23a", manga: "larga", pantalon: "#3a4a5c", zapatos: "#2a1e16", alto: 0.7, accesorios: [{ t: "pelo", forma: "punta", color: "#7a4a22" }] };
export const LILY: Look = { estilo: "palo", camisa: "#8fc6e8", manga: "larga", pantalon: "#3a4a5c", zapatos: "#2a1e16", alto: 0.7, accesorios: [{ t: "trenzas", color: "#7a4a22", lazo: "#e3b23a" }] };
export const LILY_CAMA: Look = { ...LILY, camisa: "#cfe4f2" }; // pijama
export const ABBY: Look = { estilo: "palo", camisa: "#5f6a3a", manga: "larga", pantalon: "#3a3a30", zapatos: "#2a1e16", accesorios: [{ t: "pelo", forma: "cola", color: "#6a3a1e" }, { t: "sombrero", color: "#c9b48a" }, { t: "mochila", color: "#4a4030" }] };
export const ABBY_ADENTRO: Look = { ...ABBY, accesorios: [{ t: "pelo", forma: "cola", color: "#6a3a1e" }, { t: "sombrero", color: "#c9b48a" }] };
export const HALVORSEN: Look = { estilo: "palo", camisa: "#e6dcc8", manga: "larga", pantalon: "#4a4038", zapatos: "#1a1410", accesorios: [{ t: "chaleco", color: "#7a5a3a" }, { t: "pelo", forma: "calvo", color: "#e8e4dc" }, { t: "barba", color: "#eeeae2" }, { t: "lentes", color: "#c8bfa8" }] };
export const JUNE_GUANTES: Look = conAcc({ estilo: "palo", camisa: "#2f7f86", manga: "larga", pantalon: "#2b2f3a", zapatos: "#1a1410", accesorios: [{ t: "pelo", forma: "cola", color: "#17110d" }] }, { t: "delantal", color: "#e8eef0" });
export const JUNE_QUIRO: Look = { estilo: "palo", camisa: "#5aa6a8", manga: "larga", pantalon: "#5aa6a8", zapatos: "#e8eef0", accesorios: [{ t: "gorroPapel", color: "#5aa6a8" }, { t: "pelo", forma: "cola", color: "#17110d" }] };
export const CIRUJANO: Look = { estilo: "palo", camisa: "#3f7a8a", manga: "larga", pantalon: "#3f7a8a", zapatos: "#e8eef0", accesorios: [{ t: "gorroPapel", color: "#3f7a8a" }] };
export const LEVITA: Look = { estilo: "palo", camisa: "#2a2a30", manga: "larga", pantalon: "#2a2a30", zapatos: "#141010", accesorios: [{ t: "barba", color: "#4a3a2a" }, { t: "corbata", color: "#e8e4dc" }] };
export const LEVITA_DELANTAL: Look = conAcc(LEVITA, { t: "delantal", color: "#e8e2d2" });
export const CIENTIFICO: Look = { estilo: "palo", camisa: "#3a3a44", manga: "larga", pantalon: "#2a2a30", zapatos: "#141010", accesorios: [{ t: "bata", color: "#f2efe8" }, { t: "pelo", forma: "corto", color: "#5a4a3a" }] };
export const ISLENO = (i: number): Look => {
  const c = ["#b2342a", "#2f5a7a", "#6a7a3a", "#8a5a2a", "#5a3a6a", "#3a6a6a", "#c9a03a", "#7a3a3a"][i % 8];
  const pelo = ["#2a1a14", "#6a3a1e", "#c8b890", "#141010", "#8a8680"][i % 5];
  const acc: Look["accesorios"] = i % 3 === 0 ? [{ t: "gorroLana", color: ["#e3b23a", "#3a6a8a", "#b2342a"][i % 3 === 0 ? (i / 3) % 3 : 0] }] : [{ t: "pelo", forma: (["corto", "bob", "cola", "punta"] as const)[i % 4], color: pelo }];
  return { estilo: "palo", camisa: c, manga: "larga", pantalon: ["#2b2f3a", "#3a3530", "#3a4a5c"][i % 3], zapatos: "#1a1410", alto: i % 7 === 3 ? 0.72 : 1, accesorios: [...acc, ...(i % 2 ? [{ t: "bufanda" as const, color: "#efe3c8" }] : [])] };
};
