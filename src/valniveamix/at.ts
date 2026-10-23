// at("frase", desde): segundo en que EMPIEZA la frase en la voz (ASR Groq), buscando desde `desde`.
// Así cada pieza queda clavada a la palabra que se dice, no a un número suelto.
import CAPS from "./caps.json";
import AVW from "./avwin.json";

const norm = (x: string) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, "").trim();
const W: { w: string; t: number }[] = (CAPS as [string, number][]).map(([w, ms]) => ({ w: norm(w), t: ms / 1000 })).filter((x) => x.w);

export const at = (frase: string, desde = 0): number => {
  const q = norm(frase).split(/\s+/).filter(Boolean);
  for (let i = 0; i < W.length; i++) {
    if (W[i].t < desde - 0.01) continue;
    let ok = true;
    for (let k = 0; k < q.length; k++) if (!W[i + k] || W[i + k].w !== q[k]) { ok = false; break; }
    if (ok) return W[i].t;
  }
  throw new Error(`at(): no encuentro "${frase}" desde ${desde}`);
};
// fin de la frase (para que una pieza se vaya justo cuando termina de decirse)
export const fin = (frase: string, desde = 0): number => {
  const a = at(frase, desde), n = norm(frase).split(/\s+/).filter(Boolean).length;
  const i = W.findIndex((x) => x.t >= a - 0.001);
  return W[Math.min(W.length - 1, i + n)]?.t ?? a + 1;
};
// ventanas del avatar (el reel pagado): [ms, me]
export const AVWIN: [number, number][] = (AVW as { win: { ms: number; me: number }[] }).win.map((w) => [w.ms, w.me]);
