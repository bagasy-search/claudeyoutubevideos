// len29d · EL MUNDO: el inodoro de vidrio EN CORTE de lenny02 (tazón, sifón con su cresta, tanque, válvula, cera, caño).
// Mismo contrato que el sink3d de la tanda (parts.tsx importa SinkWorld y camSpeed): las paradas de cámara y los efectos
// salen de world.json (anclados a frases). Entre paradas la cámara viaja en arco y nunca queda quieta (deriva lenta).
// Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { CAM } from "../lenny02/cams";
import { FX, K, ToiletWorld, camSpeed as camSpeedK } from "../lenny02/toilet3d";
import WJ from "./world.json";

type Stop = [number, string];
type FXK = [number, Record<string, number>];
const ST = (WJ as unknown as { cams: Stop[] }).cams ?? [[0, "wide"]];
const FK = (WJ as unknown as { fx: FXK[] }).fx ?? [];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };

// keyframes: en cada parada viaja (arco) de la cámara anterior a la nueva en ~1,2-2,6 s y después deriva 1-2 cm hasta la próxima
const drift = (c: { p: number[]; l: number[]; fov: number }, i: number) => ({ ...c, p: [c.p[0] + 0.018 * (i % 2 ? 1 : -1), c.p[1] + 0.01, c.p[2] - 0.02], fov: c.fov - 1 });
export const KF: K[] = (() => {
  const out: K[] = [];
  ST.forEach(([a, name], i) => {
    const cur = CAM[name] ?? CAM.wide, next = ST[i + 1]?.[0] ?? a + 30;
    if (i === 0) { out.push({ t: a, ...cur }); out.push({ t: next - 0.01, ...drift(cur, i) }); return; }
    const D = Math.min(2.6, Math.max(1.2, (next - a) * 0.45));
    const dist = Math.hypot(cur.p[0] - out[out.length - 1].p[0], cur.p[1] - out[out.length - 1].p[1], cur.p[2] - out[out.length - 1].p[2]);
    out.push({ ...out[out.length - 1], t: a, arc: undefined });
    out.push({ t: a + D, ...cur, arc: Math.min(0.12, dist * 0.25) });
    out.push({ t: Math.max(a + D + 0.01, next - 0.01), ...drift(cur, i) });
  });
  return out;
})();

// efectos: cada clave se funde en 1 s desde su valor anterior
export const fxAt = (t: number): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const [a, kv] of FK) {
    if (a > t) break;
    for (const [k, v] of Object.entries(kv)) { const from = out[k] ?? 0; out[k] = from + (v - from) * ease((t - a) / 1.0); }
  }
  return out;
};
export const camSpeed = (t: number) => camSpeedK(t, KF);
export const SinkWorld: React.FC<{ t: number; fx?: Record<string, number>; post?: boolean }> = ({ t, fx, post = true }) =>
  <ToiletWorld t={t} kf={KF} fx={(fx ?? fxAt(t)) as FX} post={post} />;
