// TdcTitleSlam — frase grande del gancho, palabra por palabra, con golpe de escala + sacudida del bloque en
// cada palabra y "marcador" de color detrás de las palabras resaltadas (la gramática de la miniatura).
// words: [{t, at (cuadro), hl?: "yellow"|"red"}] · pos: "top" | "center" | "bottom".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, TEXT_SHADOW, clamp, ease, inOut, pop, wobble } from "./theme";

export type SlamWord = { t: string; at: number; hl?: "yellow" | "red" };
export const TdcTitleSlam: React.FC<{ dur: number; words: SlamWord[]; pos?: "top" | "center" | "bottom"; size?: number; maxWidth?: number }> = ({ dur, words, pos = "top", size = 118, maxWidth = 1500 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const o = inOut(f, dur, 1, 8);
  // sacudida: decae después de cada palabra
  const last = words.filter((w) => w.at <= f).map((w) => w.at).pop() ?? -99;
  const k = Math.max(0, 1 - (f - last) / 8);
  const sx = wobble(f, 3, 14 * k, 1.9), sy = wobble(f, 7, 10 * k, 2.3);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: pos === "top" ? "flex-start" : pos === "bottom" ? "flex-end" : "center", alignItems: "center", padding: pos === "center" ? 0 : "70px 0", pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 26px", maxWidth, transform: `translate(${sx}px, ${sy}px)` }}>
        {words.map((w, i) => {
          const s = pop(f, fps, w.at, 10), vis = f >= w.at;
          const hlw = interpolate(f, [w.at + 2, w.at + 9], [0, 1], { ...clamp, easing: ease });
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", opacity: vis ? 1 : 0, transform: `scale(${vis ? 1.9 - 0.9 * s : 0.5})`,
              fontFamily: F_DISPLAY, fontSize: size, lineHeight: 1.08, color: w.hl === "yellow" ? C.ink : C.white, textTransform: "uppercase",
              textShadow: w.hl === "yellow" ? "none" : TEXT_SHADOW, padding: "0 12px" }}>
              {w.hl && <span style={{ position: "absolute", left: 0, top: "6%", height: "90%", width: `${hlw * 100}%`, background: w.hl === "yellow" ? C.yellow : C.red,
                borderRadius: 8, zIndex: -1, boxShadow: "0 8px 22px rgba(0,0,0,0.45)", transform: "rotate(-1.2deg)" }} />}
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
