// TfbLamina — la ficha/lámina a pantalla completa con recorrido de cámara punto por punto (zoom suave entre
// keyframes) y marcas de resaltador que se pintan SOBRE el papel (se mueven con el zoom). Papel de fondo con
// sombra, entrada con leve caída. Todo por props (imagen, puntos, marcas).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, clamp, inOut } from "./theme";

export type LamPoint = { f: number; x: number; y: number; z: number };
export type LamMark = { f: number; dur: number; x: number; y: number; w: number; h: number; color?: string };
export const TfbLamina: React.FC<{ dur: number; src: string; puntos: LamPoint[]; marks?: LamMark[]; bg?: string; aspect?: number }> = ({ dur, src, puntos, marks = [], bg = "#E9DABB", aspect = 1.5 }) => {
  const f = useCurrentFrame();
  const ks = puntos.map((p) => p.f);
  const at = (k: "x" | "y" | "z") => (puntos.length > 1 ? interpolate(f, ks, puntos.map((p) => p[k]), { ...clamp, easing: Easing.inOut(Easing.cubic) }) : puntos[0][k]);
  const o = inOut(f, dur, 8, 8), drop = interpolate(f, [0, 12], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // caja de la lámina (contain en 1920x1080)
  const H = 1080 * 0.94, W = Math.min(1920 * 0.96, H * aspect), h = W / aspect;
  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: o, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(at("z") * drop).toFixed(4)})`, transformOrigin: `${at("x").toFixed(2)}% ${at("y").toFixed(2)}%` }}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", width: W, height: h, boxShadow: "0 30px 80px rgba(60,40,20,0.35)" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
            {marks.map((m, i) => {
              const p = interpolate(f, [m.f, m.f + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) * interpolate(f, [m.f + m.dur - 8, m.f + m.dur], [1, 0], clamp);
              return <div key={i} style={{ position: "absolute", left: `${m.x}%`, top: `${m.y}%`, width: `${m.w * Math.min(1, p * 1.2)}%`, height: `${m.h}%`,
                background: m.color ?? "rgba(255,210,31,0.38)", mixBlendMode: "multiply", borderRadius: 6, opacity: p > 0 ? 1 : 0, transform: "rotate(-0.6deg)" }} />;
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 160px rgba(90,60,30,0.25)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, border: `0px solid ${C.gold}` }} />
    </AbsoluteFill>
  );
};
