// Main_cmeurgente.tsx — GENERADO por build_cmeurgente.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEURGENTE } from "./cues_cmeurgente.gen";

export const TOTAL_FRAMES_CMEURGENTE = 44456;
const AVATAR_FRAMES = 21366;
const LOOP_START = 21369;

/** VA CON OffthreadVideo, NUNCA CON el Video del navegador: en el render Remotion le pide un
 *  cuadro y el navegador devuelve EL MAS CERCANO QUE TENGA LISTO. Sobre un mp4 de 21.366
 *  cuadros, con 60 chunks que arrancan cada uno en un punto distinto, eso da repeticiones y
 *  saltos IRREGULARES: el avatar se ve perfecto en el preview y LAGEADO en el render.
 *  OffthreadVideo extrae el cuadro exacto con ffmpeg, fuera del navegador.
 *  El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  Después de AVATAR_END el lipsync no vale -> arriba siempre hay contenido tapándolo.
 *  ⛔ NUNCA ESTÁTICO: un avatar full quieto se lee como una videollamada. Lleva un push lento
 *  y cíclico (período 30 s) que nunca recorta al sujeto y que hace que los tramos en los que se
 *  lo ve solo —el hook de los primeros 14 s, el escudo de honestidad, la confesión— respiren. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("cmeurgente_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={21369} durationInFrames={21366}>
        <OffthreadVideo src={staticFile("cmeurgente_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={42735} durationInFrames={1721}>
        <OffthreadVideo src={staticFile("cmeurgente_opt.mp4")} muted style={est} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MainCmeurgente: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMEURGENTE.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEURGENTE.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("cmeurgente.wav")} />
    </AbsoluteFill>
  );
};
