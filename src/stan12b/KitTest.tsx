// Prueba del kit: 3 cuadros congelados (25/55/85 %) de cada componente C y 2 de cada tipo de rótulo sobre una foto. 1 cuadro = 1 muestra.
import React from "react";
import { AbsoluteFill, Freeze, Sequence } from "remotion";
import { SHOTS, OVERLAYS } from "./cues.gen";
import { ShotBody, Overlay } from "./Main";
import * as B from "./Base";

const CS = SHOTS.filter((s: any) => s.k === "C");
const seenT = new Set<string>();
const OV = OVERLAYS.filter((o: any) => { if (seenT.has(o.type + (o.type === "chalk" ? o.lines.length : ""))) return false; seenT.add(o.type + (o.type === "chalk" ? o.lines.length : "")); return true; });
const P = [0.25, 0.55, 0.85];
const BG = (SHOTS.find((s: any) => s.k === "G" && s.src) || {}).src;
export const KIT_FRAMES = CS.length * 3 + OV.length * 2;
export const KitTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#231710" }}>
    {CS.map((s: any, i: number) => P.map((p, j) => (
      <Sequence key={s.id + "_" + j} from={i * 3 + j} durationInFrames={1} layout="none">
        <AbsoluteFill><Freeze frame={Math.round(s.dur * p)}><ShotBody s={s} dur={s.dur} /></Freeze></AbsoluteFill>
      </Sequence>
    )))}
    {OV.map((o: any, i: number) => [0.35, 0.8].map((p, j) => (
      <Sequence key={"o" + i + "_" + j} from={CS.length * 3 + i * 2 + j} durationInFrames={1} layout="none">
        <AbsoluteFill><Freeze frame={Math.round(o.dur * p)}><AbsoluteFill><B.Photo src={BG} seed={i} dur={o.dur} /><Overlay o={o} /></AbsoluteFill></Freeze></AbsoluteFill>
      </Sequence>
    )))}
  </AbsoluteFill>
);
