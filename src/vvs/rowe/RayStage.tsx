// RayStage.tsx (vvs) — escenario de los set-pieces portados del kit Rowe, REBRANDEADO a la Doctora Valeria:
// papel crema + tinta espresso + latón. Los nombres de token se conservan para no tocar la geometría:
//   ink0/ink1/ink2 = superficies de PAPEL · white = TINTA (texto) · bone = tinta apagada
//   brass/amber = LATÓN · danger = TERRACOTA · ok = SALVIA
import { VAL, FONT_DISPLAY, FONT_SERIF } from "../../valeria/theme";

export const V = {
  ink0: VAL.paper,
  ink1: VAL.paperWarm,
  ink2: VAL.paperDeep,
  brass: VAL.gold,
  brassSoft: VAL.goldDark,
  amber: VAL.goldDark,
  danger: VAL.terracotta,
  dangerSoft: VAL.terracotta,
  white: VAL.ink,
  bone: VAL.ink2,
  steel: VAL.inkSoft,
  ok: VAL.sage,
  onAccent: VAL.onAccent,
  card: VAL.card,
};
export const F_DISPLAY = FONT_DISPLAY;
export const F_BODY = FONT_SERIF;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const rnd = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
