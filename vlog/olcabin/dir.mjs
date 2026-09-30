// DIRECTOR olcabin — ensambla A+B+C y pega las placas de cuenta regresiva (RecipeCountdown overlay) a cada "Number …".
import { A } from "./dir_a.mjs";
import { B_ } from "./dir_b.mjs";
import { C_ } from "./dir_c.mjs";
import { CD } from "./dir_lib.mjs";
const NUM = {
  "Number twenty-five": [25, "Egg coffee"], "Number twenty-four": [24, "Fattigmann"], "Number twenty-three": [23, "Pickled herring"], "Number twenty-two": [22, "Fruit soup"],
  "Number twenty-one": [21, "Krumkake"], "Number twenty": [20, "Leipäjuusto"], "Number nineteen": [19, "Nisu"], "Number eighteen": [18, "Rice porridge"],
  "Number seventeen": [17, "Dried-apple pie"], "Number sixteen": [16, "Potato sausage"], "Number fifteen": [15, "Bannock"], "Number fourteen": [14, "Kringle"],
  "Number thirteen": [13, "Sausage & sauerkraut"], "Number twelve": [12, "Mojakka"], "Number eleven": [11, "Wild rice hotdish"], "Number ten": [10, "Swedish meatballs"],
  "Number nine": [9, "Lanttulaatikko"], "Number eight": [8, "Pannukakku"], "Number seven": [7, "Lutefisk"], "Number six": [6, "Limpa"], "Number five": [5, "Fish chowder"], "Number four": [4, "Rømmegrøt"], "Number three": [3, "The pasty"], "Number two": [2, "Booyah"],
};
const AV_INTRO = new Set(["Number twenty-two", "Number twenty-one", "Number twenty", "Number nineteen", "Number eighteen", "Number seventeen", "Number sixteen", "Number fifteen", "Number fourteen", "Number thirteen", "Number twelve", "Number eleven", "Number ten", "Number nine", "Number eight", "Number seven", "Number six", "Number five"]);
const raw = [...A, ...B_, ...C_].map((s) => (NUM[s.at] ? { ...s, ov: CD(...NUM[s.at]) } : s))
  // el primer plano de cada receta (el número y el nombre) lo dice Ole a cámara: avatar con la placa encima
  .map((s) => (AV_INTRO.has(s.at) && s.kind === "bi" ? { at: s.at, kind: "av", name: "av", ov: s.ov } : s));
// dos avatares seguidos = un solo plano continuo (sin re-zoom): se descarta el segundo
// planos que se funden con el real anterior (el archivo/stock se sostiene lo que dura la frase): sube el % de metraje REAL
const DROP = new Set(["b_coldcabin", "b_foam", "b_clock", "h_appleSack", "b_limpaherring", "b_cold", "b_herringjar", "h_cheesejam"]);
export const SHOTS = raw.filter((s, i) => !(s.kind === "av" && !s.ov && raw[i - 1]?.kind === "av")).filter((s) => !DROP.has(s.name));
