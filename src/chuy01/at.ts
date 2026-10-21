// copia de makeAt de kits/yanqui3d/engine (el kit no está commiteado): frase del guion → segundo exacto en caps.json
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9$°]/g, "");
export const makeAt = (caps: [string, number][]) => {
  // un token de caps puede traer varias palabras ("about $25"): se parten con +0,3 s por palabra
  const W = caps.flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
  return (phrase: string, after = 0): number => {
    const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < W.length; i++) {
      if (W[i].t < after - 0.01) continue;
      let ok = true;
      for (let j = 0; j < ws.length; j++) if (!W[i + j] || W[i + j].w !== ws[j]) { ok = false; break; }
      if (ok) return W[i].t;
    }
    throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
  };
};
