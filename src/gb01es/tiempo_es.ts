// gb01es · el mismo video que gb01 v2 pero con la voz en español. Las anclas siguen escritas en inglés:
// T("frase EN") busca la frase en las palabras EN y la pasa por W() = mapa EN→ES (nudos por inicio/fin de cada oración del guion).
import { makeTiempo } from "../kits/neon/base";
import EN from "../gb01/words_full.json";
import ES from "./words_full.json";
import MAPA from "./mapa.json";

const K = MAPA as [number, number][];
export const W = (t: number) => {
  let lo = 0, hi = K.length - 2;
  if (t <= K[0][0]) return K[0][1] + (t - K[0][0]);
  if (t >= K[hi + 1][0]) return K[hi + 1][1] + (t - K[hi + 1][0]);
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (K[m][0] <= t) lo = m; else hi = m - 1; }
  const a = K[lo], b = K[lo + 1];
  return a[1] + ((t - a[0]) * (b[1] - a[1])) / (b[0] - a[0]);
};
const en = makeTiempo(EN), es = makeTiempo(ES);
export const tiempo = { ...es, at: (p: string, after = 0) => W(en.at(p, after)), atEnd: (p: string, after = 0) => W(en.atEnd(p, after)) };
