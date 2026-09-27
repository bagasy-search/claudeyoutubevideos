// TfbWipe — ANTES / DESPUÉS con cortina que barre: `before` y `after` son nodos (video o imagen). La cortina (barra
// blanca con borde amarillo y un tirador) cruza el cuadro con easing, se detiene al medio un instante y termina.
// Rótulos "ANTES"/"DESPUÉS" opcionales (props). Reusable para cualquier resultado del canal.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TFB, F_DISPLAY, EASE_IO, clamp } from "./theme";

export type TfbWipeProps = { before: React.ReactNode; after: React.ReactNode; startAt?: number; dur?: number; hold?: number; labels?: [string, string] };

export const TfbWipe: React.FC<TfbWipeProps> = ({ before, after, startAt = 12, dur = 40, hold = 14, labels }) => {
  const f = useCurrentFrame();
  const h = dur / 2;
  const p1 = interpolate(f, [startAt, startAt + h], [0, 0.5], { ...clamp, easing: EASE_IO });
  const p2 = interpolate(f, [startAt + h + hold, startAt + dur + hold], [0, 0.5], { ...clamp, easing: EASE_IO });
  const p = p1 + p2; // 0 → 1: la cortina barre de izquierda a derecha y va descubriendo el DESPUÉS
  const x = p * 100;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{before}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>{after}</AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${x}% - 5px)`, width: 10, background: "#fff", boxShadow: `0 0 0 3px ${TFB.yellow}, 0 0 30px rgba(0,0,0,.5)`, opacity: p > 0.001 && p < 0.999 ? 1 : 0 }}>
        <div style={{ position: "absolute", top: "50%", left: -28, width: 66, height: 66, marginTop: -33, borderRadius: 33, background: TFB.yellow, border: "5px solid #fff", boxShadow: TFB.shadow }} />
      </div>
      {labels && (
        <>
          <div style={{ position: "absolute", left: 60, bottom: 60, fontFamily: F_DISPLAY, fontSize: 64, color: "#fff", background: TFB.red, padding: "2px 20px 6px", borderRadius: 8, opacity: 1 - p }}>{labels[0]}</div>
          <div style={{ position: "absolute", right: 60, bottom: 60, fontFamily: F_DISPLAY, fontSize: 64, color: TFB.ink, background: TFB.yellow, padding: "2px 20px 6px", borderRadius: 8, opacity: interpolate(p, [0.4, 0.7], [0, 1], clamp) }}>{labels[1]}</div>
        </>
      )}
    </AbsoluteFill>
  );
};
