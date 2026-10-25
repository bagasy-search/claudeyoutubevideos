import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { rnd } from "../soot/lib";
import { C, FPS } from "./kit";
import { Key } from "./barco";
import { Escenario } from "./mundo";
import { K0, A0, M0, O0 } from "./S0";
import { K1, A1, M1, O1, Me1 } from "./S1";
import { K2, A2, O2 } from "./S2";
import { K3, A3, M3, O3 } from "./S3";
import { K4, A4, M4, O4 } from "./S4";
import { K5, A5, O5 } from "./S5";
import { K6, A6, M6, O6 } from "./S6";
import { K7, A7, M7, O7 } from "./S7";
import { K8, A8, M8, O8 } from "./S8";

// soot10 completo: UN mundo y UNA cámara. Cada sección aporta llaves de cámara (K), gente/objetos a bordo (A),
// cosas en el mundo (M) y textos de pantalla (O), todo con tiempo absoluto.
export const DUR_S = 923;
export const COMPLETO_DUR = Math.ceil(DUR_S * FPS);
type F = React.FC<{ t: number }>;
const Nada: F = () => null;
const SECC: { K: Key[]; A: F; M: F; O: F; Me?: F }[] = [
  { K: K0, A: A0, M: M0, O: O0 },
  { K: K1, A: A1, M: M1, O: O1, Me: Me1 },
  { K: K2, A: A2, M: Nada, O: O2 },
  { K: K3, A: A3, M: M3, O: O3 },
  { K: K4, A: A4, M: M4, O: O4 },
  { K: K5, A: A5, M: Nada, O: O5 },
  { K: K6, A: A6, M: M6, O: O6 },
  { K: K7, A: A7, M: M7, O: O7 },
  { K: K8, A: A8, M: M8, O: O8 },
];
const KEYS: Key[] = SECC.flatMap((s) => s.K).sort((a, b) => a[0] - b[0]);
// sacudidas de cámara (impactos)
export const SACUDIDAS = [2.2, 88.3, 168.1, 240.2, 252.5, 307.0, 342.4, 391.9, 440.6, 480.1, 615.8, 644.7, 702.3, 713.4, 736.2, 743.5, 771.6, 852.7, 883.9, 886.7];
const sacude = (t: number) => {
  let x = 0, y = 0;
  for (const s of SACUDIDAS) {
    const d = t - s;
    if (d < 0 || d > 0.6) continue;
    const r = rnd(Math.floor(t * 30) + 7);
    const k = Math.exp(-d * 7) * 26;
    x += (r() - 0.5) * k; y += (r() - 0.5) * k;
  }
  return { x, y };
};

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const sc = sacude(t);
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.7}>
        <AbsoluteFill style={{ transform: `translate(${sc.x}px, ${sc.y}px)` }}>
          <Escenario t={t} keys={KEYS} abordo={<>{SECC.map((s, i) => <s.A key={i} t={t} />)}</>} mundo={<>{SECC.map((s, i) => <s.M key={i} t={t} />)}</>} mercante={<>{SECC.map((s, i) => (s.Me ? <s.Me key={i} t={t} /> : null))}</>} />
        </AbsoluteFill>
      </CamaraMano>
      {SECC.map((s, i) => <s.O key={i} t={t} />)}
    </AbsoluteFill>
  );
};
