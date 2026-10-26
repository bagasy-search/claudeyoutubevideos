// BIBLIOTECA DE POSES (vuelta 8 OJO) — pieza reutilizable para los personajes rig de Soot (persona.tsx).
// Cada pose es una función del tiempo local k (s): devuelve hombros/codos (grados, 0 = brazo colgando;
// codo positivo = el antebrazo sube hacia adelante) y, si hace falta, cuerpo inclinado / cabeza ladeada.
// `vida(t, seed)` encadena poses distintas con transición suave (0,45 s) para que NADIE quede posado:
// es lo que mueve las multitudes y los planos de un solo personaje sin trucos de respiración ni flotación.

export type Pose = { bI: number; bD: number; cI: number; cD: number; inclina?: number; ladea?: number; habla?: boolean; mira?: number };
type PF = (k: number) => Pose;
const s = Math.sin;

export const POSES: Record<string, PF> = {
  jarras: () => ({ bI: 38, bD: 38, cI: 78, cD: 78, ladea: 4 }),
  cruzados: () => ({ bI: 28, bD: 28, cI: 128, cD: 132, inclina: -3 }),
  saluda: (k) => ({ bI: 10, bD: 150 + s(k * 9) * 14, cI: 12, cD: 26 + s(k * 9) * 18, habla: true }),
  senala: (k) => ({ bI: 18, bD: 92 + s(k * 2) * 4, cI: 18, cD: 2, mira: 1, inclina: 4 }),
  rasca: (k) => ({ bI: 12, bD: 152, cI: 14, cD: 112 + s(k * 13) * 9, ladea: -7 }),
  encoge: (k) => ({ bI: 46 + s(k * 3) * 6, bD: 46 + s(k * 3) * 6, cI: 84, cD: 84, ladea: 8, habla: true }),
  aplaude: (k) => ({ bI: 52, bD: 52, cI: 96 + s(k * 15) * 18, cD: 96 + s(k * 15) * 18 }),
  cuenta: (k) => ({ bI: 58, bD: 70 + s(k * 4) * 6, cI: 92, cD: 104, habla: true }),
  puno: (k) => ({ bI: 22, bD: 158 + s(k * 8) * 8, cI: 28, cD: 30, habla: true }),
  explica: (k) => ({ bI: 40 + s(k * 2.6) * 14, bD: 68 + s(k * 3.1) * 20, cI: 50 + s(k * 3.3) * 18, cD: 62 + s(k * 4.1) * 24, habla: true }),
  piensa: () => ({ bI: 30, bD: 60, cI: 120, cD: 142, ladea: 9 }),
  cabeza: (k) => ({ bI: 160, bD: 160, cI: 14 + s(k * 7) * 6, cD: 14 + s(k * 7) * 6, inclina: -4 }),
  rema: (k) => ({ bI: 64 + s(k * 4.4) * 26, bD: 64 + s(k * 4.4) * 26, cI: 70 - s(k * 4.4) * 30, cD: 70 - s(k * 4.4) * 30, inclina: s(k * 4.4) * 8 }),
  tira: (k) => ({ bI: 82 + s(k * 3.2) * 18, bD: 98 + s(k * 3.2) * 18, cI: 20, cD: 20, inclina: -8 + s(k * 3.2) * 5 }),
  codazo: (k) => ({ bI: 20, bD: 70 + Math.max(0, s(k * 6)) * 24, cI: 20, cD: 120, mira: 1, habla: true }),
  susurra: () => ({ bI: 14, bD: 70, cI: 14, cD: 150, mira: 1, inclina: 7, habla: true }),
  // trabajo de fábrica (soot08): atar hilos, barrer pelusa, cargar carretes, empujar el carro
  ata: (k) => ({ bI: 70 + s(k * 7) * 8, bD: 78 + s(k * 7 + 1.4) * 10, cI: 60 + s(k * 9) * 14, cD: 56 + s(k * 9 + 2) * 14, inclina: 9 }),
  barre: (k) => ({ bI: 40 + s(k * 4) * 18, bD: 44 + s(k * 4) * 18, cI: 30, cD: 30, inclina: 14 + s(k * 4) * 4 }),
  carga: (k) => ({ bI: 96, bD: 96, cI: 70, cD: 70, inclina: -3 + s(k * 3) * 2, ladea: s(k * 3) * 4 }),
  empuja: (k) => ({ bI: 88, bD: 88, cI: 8, cD: 8, inclina: 12 + s(k * 5) * 3 }),
  seca: (k) => ({ bI: 12, bD: 150, cI: 14, cD: 130 + s(k * 6) * 10, ladea: -5 }),
};

const ORDEN: (keyof typeof POSES)[] = ["explica", "cruzados", "rasca", "senala", "encoge", "jarras", "codazo", "piensa", "aplaude", "cuenta", "susurra", "puno"];
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const suave = (u: number) => u * u * (3 - 2 * u);
const mezclaP = (A: Pose, B: Pose, u: number): Pose => ({
  bI: lerp(A.bI, B.bI, u), bD: lerp(A.bD, B.bD, u), cI: lerp(A.cI, B.cI, u), cD: lerp(A.cD, B.cD, u),
  inclina: lerp(A.inclina ?? 0, B.inclina ?? 0, u), ladea: lerp(A.ladea ?? 0, B.ladea ?? 0, u),
  habla: u < 0.5 ? A.habla : B.habla, mira: u < 0.5 ? A.mira : B.mira,
});

// pose de una sola acción, con entrada suave desde brazos colgando
export const pose = (nombre: keyof typeof POSES, t: number, t0 = -1e9): Pose => {
  const P = POSES[nombre](t - t0);
  const u = suave(Math.min(1, Math.max(0, (t - t0) / 0.4)));
  return mezclaP({ bI: 8, bD: 8, cI: 10, cD: 10 }, P, u);
};

// cadena de poses que nunca se repite pegada; `lista` restringe el repertorio (p. ej. ["rema"] o miedo)
export const vida = (t: number, seed: number, lista: (keyof typeof POSES)[] = ORDEN): Pose => {
  const L = 2.1 + (seed % 4) * 0.35;
  const T = t + seed * 1.37;
  const n = Math.floor(T / L);
  // paso coprimo con el largo de la lista: recorre todo el repertorio sin repetir pegado y es continuo entre tramos
  const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
  const paso = [3, 5, 7, 11].find((q) => gcd(q, lista.length) === 1) ?? 1;
  const pick = (m: number) => lista[(((m * paso + seed) % lista.length) + lista.length) % lista.length];
  const a = pick(n - 1), b = pick(n);
  const k = T - n * L;
  return mezclaP(POSES[a](T), POSES[b](T), suave(Math.min(1, k / 0.45)));
};

// repertorios por ánimo (para que la multitud actúe la emoción de la frase)
export const ANIMO: Record<string, (keyof typeof POSES)[]> = {
  miedo: ["encoge", "susurra", "cruzados", "codazo", "senala"],
  alegre: ["aplaude", "puno", "saluda", "explica", "codazo"],
  triste: ["cruzados", "piensa", "rasca", "encoge"],
  charla: ["explica", "codazo", "susurra", "senala", "rasca", "encoge", "cuenta"],
  trabajo: ["ata", "barre", "carga", "ata", "empuja", "seca"],
};

// aplica vida a un personaje SÓLO si la escena no le dio brazos a mano (no pisa la puesta en escena)
export const conVida = <P extends { t: number; bI?: number; bD?: number; cI?: number; cD?: number; camina?: number; expr?: unknown; inclina?: number }>(p: P, seed: number): P => {
  if (p.bI !== undefined || p.bD !== undefined || p.camina) return p;
  const lista = (p as { trabajo?: boolean }).trabajo ? ANIMO.trabajo : p.expr === "miedo" || p.expr === "sorpresa" ? ANIMO.miedo : p.expr === "feliz" || p.expr === "orgullo" ? ANIMO.alegre : p.expr === "triste" ? ANIMO.triste : ANIMO.charla;
  const v = vida(p.t, seed, lista);
  return { ...p, bI: v.bI, bD: v.bD, cI: v.cI, cD: v.cD, inclina: p.inclina ?? v.inclina, ladea: v.ladea } as P;
};
