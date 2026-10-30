// ssl29e · las poses de los 9 movimientos de la mañana (Radio Taiso a la manera de la madre), armadas sobre el rig del kit.
// Cada función devuelve una Pose para un k ∈ [0,1] (0 = reposo, 1 = el movimiento completo); se mezclan con resorte en el componente.
import React from "react";
import { useCurrentFrame } from "remotion";
import { pose } from "./s3d/acciones";
import { mano, pie, Pose, POSE_BASE } from "./s3d/rig";
import { PROPORCIONES as PR } from "./s3d/proporciones";
import { Set3D, Sachi } from "./set3d";

const AT = PR.pie.tobilloAlto;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
type V3 = [number, number, number];
const L3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const HD0: V3 = [-0.42, -1.27, 0.05], HI0: V3 = [0.42, -1.27, 0.05];
const mir = (p: V3): V3 => [-p[0], p[1], p[2]];
const hands = (d: V3, i: V3, ab = 0) => ({ manoD: mano(d, [-0.6, 0.2, -1], { miton: 1 - ab, abierta: ab }), manoI: mano(i, [0.6, 0.2, -1], { miton: 1 - ab, abierta: ab }) });

// brazos arriba (k) + puntas de pie (toe)
export const armsUp = (k: number, toe = 0): Pose => pose({ raiz: [0, 0.07 * toe, 0], cabeza: { x: -18 * k },
  ...hands(L3(HD0, [-0.2, 0.95, 0.12], k), L3(HI0, [0.2, 0.95, 0.12], k), k),
  pieD: pie([-0.2, AT + 0.07 * toe, -0.02], -12, { polo: [-0.2, 0, 1], pitch: -32 * toe }), pieI: pie([0.2, AT + 0.07 * toe, -0.02], 12, { polo: [0.2, 0, 1], pitch: -32 * toe }) } as any);
// balanceo de brazos (s = -1 atrás … 1 adelante) + rodillas que se doblan (b)
export const swing = (s: number, b: number): Pose => pose({ raiz: [0, -0.1 * b, 0], torso: { x: 4 * b },
  ...hands([-0.4, -1.12 + 0.12 * Math.abs(s), 0.05 + 0.55 * s], [0.4, -1.12 + 0.12 * Math.abs(s), 0.05 - 0.55 * s]) } as any);
// flexión lateral (lado: 1 = hacia su izquierda): una mano en la cadera, la otra por arriba de la cabeza
export const sideBend = (k: number, lado = 1): Pose => { const up: V3 = [-0.12, 0.85, 0.05], hip: V3 = [0.36, -0.75, 0.05];
  return pose({ torso: { z: 24 * k * lado }, cabeza: { z: 6 * k * lado },
    ...(lado > 0 ? hands(L3(HD0, up, k), L3(HI0, hip, k), k) : hands(L3(HD0, mir(hip), k), L3(HI0, mir(up), k), k)),
    pieD: pie([-0.3, AT, -0.02], -14, { polo: [-0.2, 0, 1] }), pieI: pie([0.3, AT, -0.02], 14, { polo: [0.2, 0, 1] }) } as any); };
// pecho abierto (alas atrás) k=1 · abrazo h=1
export const wings = (k: number, hug = 0): Pose => pose({ torso: { x: lerp(-8 * k, 22, hug), curva: 0.12 * hug }, cabeza: { x: lerp(-14 * k, 18, hug) },
  ...hands(L3(L3(HD0, [-1.0, -0.05, -0.25], k), [0.32, -0.42, 0.42], hug), L3(L3(HI0, [1.0, -0.05, -0.25], k), [-0.32, -0.36, 0.44], hug), k * (1 - hug)) } as any);
// flexión adelante con las manos que bajan por los muslos (k = cuánto baja)
export const fold = (k: number): Pose => pose({ torso: { x: 72 * k, curva: 0.16 * k }, cabeza: { x: 28 * k }, raiz: [0, -0.03 * k, -0.06 * k],
  ...hands(L3([-0.22, -0.95, 0.3], [-0.2, -0.9, 0.42], k), L3([0.22, -0.95, 0.3], [0.2, -0.9, 0.42], k)) } as any);
// sentada en la silla girando (lado 1 = su izquierda)
export const sitTwist = (k: number, lado = 1): Pose => pose({ raiz: [0, -0.62, -0.3], torso: { x: 4, y: 34 * k * lado }, cabeza: { x: -3, y: 32 * k * lado },
  ...hands(L3([-0.3, -0.85, 0.45], [0.2, -0.9, 0.45], k * (lado > 0 ? 1 : 0)), L3([0.3, -0.85, 0.45], [-0.2, -0.9, 0.45], k * (lado < 0 ? 1 : 0))),
  pieD: pie([-0.2, AT, 0.38], -8, { polo: [-0.2, 0, 1] }), pieI: pie([0.2, AT, 0.38], 8, { polo: [0.2, 0, 1] }) } as any);
// sentada derecha (sin giro)
export const sit = (): Pose => sitTwist(0);
// cabeza: sí (n ∈ -1..1 baja/sube) y no (g ∈ -1..1)
export const head = (n: number, g: number, base: Pose = POSE_BASE): Pose => pose({ cabeza: { x: 22 * n, y: 38 * g } } as any, base);
// el gran círculo: 0 = muñecas cruzadas abajo, 0.5 = brazos a los costados, 1 = arriba
export const circle = (k: number): Pose => { const a = Math.PI * k; const r = 1.0;
  const d: V3 = k < 0.04 ? [0.12, -1.05, 0.38] : [-Math.sin(a) * r * 0.95, -Math.cos(a) * 1.05 + 0.02, lerp(0.38, 0.05, Math.min(1, k * 2))];
  return pose({ torso: { x: -6 * Math.sin(a / 2) }, cabeza: { x: -20 * k }, ...hands(k < 0.04 ? d : d, k < 0.04 ? [-0.12, -1.05, 0.38] : mir(d), k) } as any); };
// acostada estirada: brazos sobre la cabeza y puntas de pie (k)
export const lieLong = (k: number, base: Pose): Pose => pose({ ...hands(L3(base.manoD.p as V3, [-0.18, 0.95, 0.05], k), L3(base.manoI.p as V3, [0.18, 0.95, 0.05], k), k) } as any, base);

// ---- lámina de prueba (sólo stills) ----
const PROBE: [string, Pose][] = [["up", armsUp(1, 1)], ["swingF", swing(1, 1)], ["side", sideBend(1, 1)], ["wings", wings(1)], ["hug", wings(1, 1)], ["fold", fold(1)], ["twist", sitTwist(1, 1)], ["circle.5", circle(0.5)], ["circle0", circle(0)], ["nod", head(1, 0)]];
export const Probe: React.FC = () => { const f = useCurrentFrame(); const [, p] = PROBE[f % PROBE.length]; const lado = f >= PROBE.length;
  return <Set3D cam={{ p: lado ? [3.2, 1.2, 0.2] : [0, 1.1, 3.4], l: [0, 0.75, 0], fov: 32 }} floor="wood"><Sachi p={p} t={0} s={0.42} /></Set3D>; };
