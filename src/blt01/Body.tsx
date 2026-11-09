// blt01 · EL VIDEO ENTERO. Sin gráficos: avatar con corte seco, fotos y clips por tramos (plan.json, anclados a su frase)
// y cuatro escenas hechas sobre las fotos reales (esc1, esc2). Cuadro 0 = avatar hablando. Audio en encfin.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { Vid, e } from "./lib";
import { Avatar, Clip, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { Esc1 } from "./esc1";
import { Esc2, Esc3, Esc4 } from "./esc2";

type Seg = [number, number, string, string];
const PL = PLAN as unknown as { segs: Seg[]; end: number };
export const END = PL.end;

const ESC: { C: React.FC; from: number; dur: number }[] = [
  { C: Esc1, from: Math.round(338.3 * 30), dur: 209 },
  { C: Esc3, from: Math.round(545.74 * 30), dur: 332 },
  { C: Esc4, from: Math.round(778.35 * 30), dur: 228 },
  { C: Esc2, from: Math.round(926.53 * 30), dur: 344 },
];

const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , , id] = g;
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
const Stage: React.FC<{ t: number }> = ({ t }) => (nowAv(t) ? <Avatar t={t} /> : <>{base(t)}</>);

export const Body: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  const enEscena = ESC.some((x) => f >= x.from && f < x.from + x.dur);
  return <AbsoluteFill style={{ background: "#000" }}>
    {!enEscena && <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>}
    {ESC.map(({ C, from, dur }) => <Sequence key={from} from={from} durationInFrames={dur}><C /></Sequence>)}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
