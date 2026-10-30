// PRNG con semilla (mulberry32) y ruido 1D suave: todo determinista por cuadro, nunca Math.random().
export const mulberry32 = (semilla: number) => {
  let a = (semilla >>> 0) || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// valor pseudoaleatorio fijo para (i, k): sin estado
export const hash = (i: number, k = 0) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ruido de valor 1D suavizado (para micro-movimiento de peso): continuo en t
export const ruido1 = (t: number, k = 0) => {
  const i = Math.floor(t), f = t - i, s = f * f * (3 - 2 * f);
  return (hash(i, k) * (1 - s) + hash(i + 1, k) * s) * 2 - 1;
};

// instantes de parpadeo (segundos) para una semilla: cada 2,5–5 s
export const parpadeos = (semilla: number, hastaSeg: number) => {
  const r = mulberry32(semilla * 7919 + 13);
  const out: number[] = [];
  let t = 0.6 + r() * 1.8;
  while (t < hastaSeg) { out.push(t); t += 2.5 + r() * 2.5; }
  return out;
};
