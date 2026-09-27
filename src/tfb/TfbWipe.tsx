// TfbWipe — antes / después con cortina que barre: arranca con la imagen "antes" a pantalla completa, una barra blanca
// con borde amarillo cruza en diagonal leve y deja el "después"; se detiene en `hold` (0-1) para comparar mitad y mitad
// y termina de barrer. Etiquetas ANTES/DESPUÉS (o las que se pasen) pegadas a cada lado de la cortina.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { C, EIO, EO, F_DISPLAY, lin, outline } from "./theme";

type Src = { src: string; kind?: "image" | "video"; startFrom?: number; pos?: string };
const Media: React.FC<Src & { z: number }> = ({ src, kind, startFrom, pos, z }) => (
  <AbsoluteFill style={{ transform: `scale(${z})` }}>
    {kind === "video" ? <OffthreadVideo src={staticFile(src)} startFrom={startFrom ?? 0} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />}
  </AbsoluteFill>
);

export const TfbWipe: React.FC<{ dur: number; before: Src; after: Src; beforeLabel?: string; afterLabel?: string; hold?: number }> = ({ dur, before, after, beforeLabel, afterLabel, hold = 0.5 }) => {
  const f = useCurrentFrame();
  const out = lin(f, [dur - 6, dur], [1, 0], EIO);
  const p = f < dur * 0.62 ? lin(f, [8, 26], [0, hold], EO) : lin(f, [dur * 0.62, dur * 0.62 + 16], [hold, 1], EIO);
  const X = (1 - p) * 100, skew = 6;
  const z = 1.04 + lin(f, [0, dur], [0, 0.05]);
  return (
    <AbsoluteFill style={{ opacity: out, backgroundColor: "#000" }}>
      <Media {...before} z={z} />
      <AbsoluteFill style={{ clipPath: `polygon(${X + skew}% 0, 100% 0, 100% 100%, ${X - skew}% 100%)` }}><Media {...after} z={z} /></AbsoluteFill>
      <div style={{ position: "absolute", top: -40, bottom: -40, left: `${X}%`, width: 14, backgroundColor: C.white, transform: `translateX(-50%) rotate(${skew * 0.62}deg)`, boxShadow: `0 0 0 5px ${C.yellow}, 0 0 40px rgba(0,0,0,0.6)` }} />
      {beforeLabel ? <div style={{ position: "absolute", top: 70, right: `${100 - X + 3}%`, fontFamily: F_DISPLAY, fontSize: 74, color: C.white, textShadow: outline(5), opacity: lin(p, [0.1, 0.25], [0, 1]) * lin(p, [0.85, 0.97], [1, 0]) }}>{beforeLabel}</div> : null}
      {afterLabel ? <div style={{ position: "absolute", top: 70, left: `${X + 3}%`, fontFamily: F_DISPLAY, fontSize: 74, color: C.yellow, textShadow: outline(5), opacity: lin(p, [0.1, 0.25], [0, 1]) }}>{afterLabel}</div> : null}
    </AbsoluteFill>
  );
};
