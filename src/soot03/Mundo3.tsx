import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { camara, paleta, Fondo, Capa, Clima, destello, K, Pal, Cam } from "./mundo";
import { PARTES } from "./partes";

// Soot 03 completo: UN mundo, una cámara. Cada parte aporta llaves de cámara, ambiente y sus capas (mundo, norte, pantalla).
export const DUR3 = Math.ceil(919.6 * FPS);
type FC = React.FC<{ t: number; c: Cam }>;
export type Parte = { keys: K[]; amb: [number, Pal][]; lluvia?: [number, number][]; nieve?: [number, number][]; niebla?: [number, number][]; rayos?: number[]; sol?: [number, number, number, boolean?][]; W?: FC; N?: FC; L?: FC; S?: FC; obra?: (t: number) => [number, number, number] | null };
const KEYS = PARTES.flatMap((p) => p.keys).sort((a, b) => a[0] - b[0]);
const AMB = PARTES.flatMap((p) => p.amb).sort((a, b) => a[0] - b[0]);
const lin = (ks: [number, number][]) => (t: number) => (ks.length === 1 ? ks[0][1] : ks.length ? interpolate(t, ks.map((k) => k[0]), ks.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0);
const srt = (k: [number, number][]) => [...k].sort((a, b) => a[0] - b[0]).filter((x, i, arr) => i === 0 || x[0] > arr[i - 1][0]);
const LL = lin(srt(PARTES.flatMap((p) => p.lluvia ?? [])));
const NI = lin(srt(PARTES.flatMap((p) => p.nieve ?? [])));
const NB = lin(srt(PARTES.flatMap((p) => p.niebla ?? [])));
const RAYOS = PARTES.flatMap((p) => p.rayos ?? []);
// sol/luna: [t, x, y, luna?] — el último cuya t ya pasó
const SOLES = PARTES.flatMap((p) => p.sol ?? []).sort((a, b) => a[0] - b[0]);

export const Mundo3: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const t = useCurrentFrame() / FPS + desde;
  // respiración suave del zoom: la cámara nunca queda clavada (el QC marca congelado a los 2 s de cuadro quieto)
  const c0 = camara(t, KEYS);
  const c = { ...c0, z: c0.z * (1 + 0.012 * Math.sin(t * 0.7)), x: c0.x + Math.sin(t * 0.45) * 14 / c0.z };
  const so = [...SOLES].reverse().find((s) => s[0] <= t);
  const a = { pal: paleta(t, AMB), lluvia: LL(t), nieve: NI(t), niebla: NB(t), rayo: destello(t, RAYOS), sol: so && so[1] > -900 ? ([so[1], so[2]] as [number, number]) : undefined, luna: !!so?.[3], obra: PARTES.map((p) => p.obra?.(t)).find((o) => !!o) ?? null };
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.7}>
        <Fondo t={t} c={c} a={a}
          lejos={<>{PARTES.map((p, i) => (p.L ? <p.L key={i} t={t} c={c} /> : null))}</>}
          norte={<>{PARTES.map((p, i) => (p.N ? <p.N key={i} t={t} c={c} /> : null))}</>} />
        <Capa c={c} f={1}>{PARTES.map((p, i) => (p.W ? <p.W key={i} t={t} c={c} /> : null))}</Capa>
        <Clima t={t} a={a} />
      </CamaraMano>
      <AbsoluteFill>{PARTES.map((p, i) => (p.S ? <p.S key={i} t={t} c={c} /> : null))}</AbsoluteFill>
    </AbsoluteFill>
  );
};
