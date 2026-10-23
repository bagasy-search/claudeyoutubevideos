// at("frase") → segundo exacto en que la voz dice la frase (words.json de Groq). Si no existe, rompe el still: se nota antes del farm.
import WORDS from "./words.json";
const W = WORDS as [number, string][];
const norm = (x: string) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ñ/g, "n").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
const find = (frase: string, after: number) => {
  const q = norm(frase);
  for (let i = 0; i + q.length <= W.length; i++) {
    if (W[i][0] < after) continue;
    let ok = true;
    for (let k = 0; k < q.length; k++) if (W[i + k][1] !== q[k]) { ok = false; break; }
    if (ok) return i;
  }
  throw new Error(`at(): no está "${frase}" después de ${after}s`);
};
export const at = (frase: string, after = 0) => W[find(frase, after)][0];
// fin de la frase = arranque de la palabra siguiente (o +0,4 s si es la última)
export const atEnd = (frase: string, after = 0) => { const i = find(frase, after) + norm(frase).length; return i < W.length ? W[i][0] : W[W.length - 1][0] + 0.4; };
export const END = W[W.length - 1][0] + 1.2;
