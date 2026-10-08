// DIRECTOR D — jphigiene: entradas de Claudio a cámara (avatar) en las frases de explicación, para que la cara esté ~25 % del video.
import { S } from "../claudio/lib.mjs";
const A = [[7, "en un baño sin ventana"], [13, ""], [17, "Es una red doblada"], [18, "Si no la consigues"], [22, "Y encima de lo de ayer"], [23, "Y la mancha amarilla"],
  [28, "Y la camisa que usaste un rato"], [29, "Es eso"], [30, "Lo que ya tiene olor"], [32, "No está sucia"], [34, "que no se lava nunca"], [39, "Un zapato junta mucho sudor"],
  [41, "Todos, Sato-san también"], [46, "El pelo absorbe"], [47, "Y después salimos"], [48, "Y el pelo se lava de noche"], [51, ""], [52, "el ajo fuerte va antes"],
  [54, "Y casi siempre olía a lo mismo"], [62, "No es falta de baño"]];
export const SHOTS = A.map(([p, at]) => S(p, at, "av", ""));
