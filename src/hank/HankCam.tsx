// HankCam — plano de Hank filmándose (clip de agnes con su voz): pantalla completa, leve temblor de mano,
// y el rótulo de lugar la primera vez que aparece en cada escena.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Media } from "../yc/Media";
import { SANS, MONO, HK, clamp, ease } from "./theme";

export const HankCam: React.FC<{ src: string; place?: string; shake?: number; start?: number }> = ({ src, place, shake = 1, start = 0 }) => {
  const f = useCurrentFrame();
  const x = (Math.sin(f / 7.3) * 2.2 + Math.sin(f / 3.1) * 0.8) * shake, y = (Math.cos(f / 6.1) * 1.8 + Math.sin(f / 2.7) * 0.6) * shake;
  const r = Math.sin(f / 11) * 0.25 * shake;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.03)` }}>
        <Media src={src} start={start} kb="none" zoom={1} />
      </AbsoluteFill>
      {place ? (
        <div style={{ position: "absolute", left: 70, bottom: 70, opacity: ease(clamp((f - 6) / 12)) * (1 - clamp((f - 120) / 15)) }}>
          <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 8, color: HK.bone, background: "rgba(11,15,12,0.7)", padding: "6px 16px", borderLeft: `5px solid ${HK.orange}` }}>{place}</div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: HK.bone, opacity: 0.85, marginTop: 6, paddingLeft: 6 }}>FILMED BY HANK</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
