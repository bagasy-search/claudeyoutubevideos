// PRIMER MINUTO de `friogranero` — canal "Archivos del Frío".
// Todo imagen fija con movimiento SUBPÍXEL de Remotion. Audio ya mezclado en un solo wav
// (voz del avatar + lecho + score + shutter de archivo + golpes + corte a silencio).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Plate, FichaDato, Grain, Mov } from "./Piezas";
import BEATS from "./beats_min1.json";

export const FPS = 30;
export const TOTAL_FRAMES_MIN1 = 2424;
const AUDIO = "friogranero_m1_mix.wav";

type Beat = {
  id: string; ms: number; dur: number; mov: Mov; archivo?: boolean;
  kind: "plate" | "ficha"; src?: string; fadeIn?: number;
  cifra?: string; unidad?: string; pie?: string; bed?: string;
};

const sec = (s: number) => Math.round(s * FPS);

export const MainFrioMin1: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const beats = BEATS as Beat[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070B" }}>
      <Audio src={staticFile(AUDIO)} />
      {beats.map((b, i) => {
        const f0 = sec(b.ms);
        // la duración se deriva del FRAME FINAL, no del largo: si no, redondear por separado
        // deja huecos de 1 frame en las fronteras (46 destellos medidos en otro video).
        const nxt = beats[i + 1];
        const f1 = nxt ? sec(nxt.ms) : Math.min(durationInFrames, sec(b.ms + b.dur));
        const dur = Math.max(2, f1 - f0);
        return (
          <Sequence key={b.id} from={f0} durationInFrames={dur} name={b.id}>
            {b.kind === "ficha" ? (
              <FichaDato cifra={b.cifra!} unidad={b.unidad} pie={b.pie!} bed={b.bed!} dur={dur} />
            ) : (
              <Plate src={b.src!} mov={b.mov} archivo={b.archivo} dur={dur} fadeIn={b.fadeIn ?? 0} />
            )}
          </Sequence>
        );
      })}
      {/* grano CONSTANTE por encima de todo: unifica material de orígenes distintos */}
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
