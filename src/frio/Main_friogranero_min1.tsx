// PRIMER MINUTO de `friogranero` — canal "Archivos del Frío".
// Mezcla: clips animados + el avatar hablando + el mapa + fichas de dato + fotos de respaldo.
// El audio va pre-mezclado en un solo wav (voz del avatar + lecho + score + shutter + golpes + silencio).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Plate, Clip, Avatar, FichaDato, Grain, Mov } from "./Piezas";
import { MapaDistancia } from "./Mapa";
import BEATS from "./beats_min1.json";

export const FPS = 30;
export const TOTAL_FRAMES_MIN1 = 2424;
const AUDIO = "friogranero_m1_mix.wav";
const AVATAR = "friogranero_opt.mp4";

type Beat = {
  id: string; ms: number; dur: number; mov: Mov; archivo?: boolean;
  kind: "plate" | "clip" | "avatar" | "ficha" | "mapa";
  src?: string; fadeIn?: number; desde?: number;
  cifra?: string; unidad?: string; pie?: string; bed?: string; bedEsClip?: boolean;
  origen?: string; destino?: string;
};

const sec = (s: number) => Math.round(s * FPS);

export const MainFrioMin1: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const beats = BEATS as Beat[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090D" }}>
      <Audio src={staticFile(AUDIO)} />
      {beats.map((b, i) => {
        const f0 = sec(b.ms);
        // la duración sale del FRAME FINAL, no del largo: redondear las dos cosas por separado
        // deja huecos de 1 frame en las fronteras y se ven como destellos del fondo.
        const nxt = beats[i + 1];
        const f1 = nxt ? sec(nxt.ms) : Math.min(durationInFrames, sec(b.ms + b.dur));
        const dur = Math.max(2, f1 - f0);
        return (
          <Sequence key={b.id} from={f0} durationInFrames={dur} name={b.id}>
            {b.kind === "avatar" ? (
              <Avatar src={AVATAR} desde={b.desde ?? 0} dur={dur} />
            ) : b.kind === "mapa" ? (
              <MapaDistancia
                origen={b.origen!}
                destino={b.destino!}
                cifra={b.cifra!}
                unidad={b.unidad!}
                pie={b.pie}
                dur={dur}
              />
            ) : b.kind === "ficha" ? (
              <FichaDato
                cifra={b.cifra!}
                unidad={b.unidad}
                pie={b.pie!}
                bed={b.bed!}
                bedEsClip={b.bedEsClip}
                dur={dur}
              />
            ) : b.kind === "clip" ? (
              <Clip src={b.src!} archivo={b.archivo} fadeIn={b.fadeIn ?? 0} />
            ) : (
              <Plate src={b.src!} mov={b.mov} archivo={b.archivo} dur={dur} fadeIn={b.fadeIn ?? 0} />
            )}
          </Sequence>
        );
      })}
      {/* grano CONSTANTE por encima de todo: unifica clips, fotos, avatar y componentes */}
      <Grain opacity={0.13} />
    </AbsoluteFill>
  );
};
