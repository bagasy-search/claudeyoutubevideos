// ── modo INVIERNO del hambre: suelo nevado, cielo de noche helada, mundo desaturado y nevada.
// Vale en el gancho (mayo 1610, recién salidos del invierno) y en el hambre 1609-10.
const VENT_INV: [number, number][] = [[330.6, 342.8], [494.8, 504.6], [646, 732]];
export const invK = (t: number) => {
  let k = 0;
  for (const [a, b] of VENT_INV) k = Math.max(k, Math.min(1, (t - a) / 0.8 , (b - t) / 0.8));
  return Math.max(0, k);
};
