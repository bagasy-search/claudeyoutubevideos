// TfbFreeze — CONGELADO + ANOTACIÓN: la imagen se detiene en un cuadro (flash de obturador), se inclina apenas como
// una foto sobre la mesa con borde blanco, y encima se dibujan los hijos (flechas, círculos, rótulos). La base debajo
// sigue corriendo oscurecida. `src`+`frame` = cuadro exacto del video a congelar.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, TFB, clamp, outro, pop } from "./theme";

export const TfbFreeze: React.FC<{ src: string; frame: number; image?: boolean; dur: number; tag?: string; tilt?: number; children?: React.ReactNode }> = ({
  src, frame, image = false, dur, tag, tilt = -2.2, children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, fps, 2, 15, 0.8), o = outro(f, dur, 8);
  const flash = interpolate(f, [0, 5], [0.9, 0], clamp);
  const sc = interpolate(p, [0, 1], [1, 0.86]), rot = interpolate(p, [0, 1], [0, tilt]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * p})` }} />
      <AbsoluteFill style={{ transform: `scale(${sc}) rotate(${rot}deg)` }}>
        <AbsoluteFill style={{ border: `${14 * p}px solid ${TFB.white}`, boxShadow: `0 30px 80px rgba(0,0,0,${0.6 * p})`, overflow: "hidden", backgroundColor: "#000" }}>
          {image ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Freeze frame={frame}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>}
          <AbsoluteFill>{children}</AbsoluteFill>
        </AbsoluteFill>
        {tag && <div style={{ position: "absolute", top: -34, left: 60, background: TFB.red, color: TFB.white, fontFamily: ANTON, fontSize: 46, padding: "2px 22px 6px", borderRadius: 10,
          transform: `scale(${p})`, transformOrigin: "left bottom", boxShadow: "0 8px 0 rgba(0,0,0,0.3)" }}>{tag}</div>}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />
    </AbsoluteFill>
  );
};
