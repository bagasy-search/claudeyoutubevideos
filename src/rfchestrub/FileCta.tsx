// FileCta.tsx — CTA de THE ROWE FILES (expediente): las 3 guías salen de la carpeta como páginas en 2.5D
// y a la derecha una FICHA BLANCA con el QR REAL grande + el dominio legible. Pantalla completa.
// ⛔ El QR es un PNG real verificado que llega por props (`qr`). Sin QR → no dibuja ninguno falso.
// ⛔ El QR va sin transformaciones que lo deformen (sin rotación/perspectiva) y sobre blanco puro.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, CL, ramp, spr, src, Atmosphere, Finish, Plane, useCam } from "./RoweDepth";

const INK = "#1E2A36";

export const FileCta: React.FC<{
  eyebrow?: string;
  title?: string;
  sub?: string;
  domain?: string;
  qr?: string;
  covers?: string[];
  bed?: string;
  durationInFrames?: number;
}> = ({ eyebrow = "", title = "", sub = "", domain = "", qr, covers = [], bed, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [], 0.03, dur);
  const cardIn = spr(frame, fps, 6, 130, 0.9);
  const out = ramp(frame, dur - 9, dur);

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9 }}>
      <Atmosphere frame={frame} img={bed} blur={22} dim={0.66} bokeh={9} seed={91} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "30% 50%" }}>
        {/* guías en abanico */}
        <Plane depth={0.6} camX={cam.camX} camY={cam.camY} z={2}>
          {covers.map((c, i) => {
            const k = spr(frame, fps, 4 + i * 7, 120, 0.85);
            const rot = [-12, 0, 12][i % 3];
            const x = [110, 360, 610][i % 3];
            const y = [230, 170, 230][i % 3];
            return (
              <div key={i} style={{
                position: "absolute", left: x, top: y, width: 440, height: 660, borderRadius: 10, overflow: "hidden",
                boxShadow: "0 40px 80px rgba(0,0,0,0.65), 0 0 0 2px rgba(255,255,255,0.12)",
                opacity: interpolate(k, [0, 1], [0, 1], CL),
                transform: `translateY(${((1 - k) * 260).toFixed(1)}px) rotate(${(rot * k).toFixed(2)}deg) perspective(1600px) rotateY(${(Math.sin(frame / 60 + i) * 3).toFixed(2)}deg)`,
                zIndex: i === 1 ? 3 : 2,
              }}>
                <Img src={src(c)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}
        </Plane>
        {/* ficha con QR */}
        <Plane depth={0.9} camX={cam.camX * 0.2} camY={0} z={4}>
          <div style={{
            position: "absolute", left: 1100, top: 90, width: 720, height: 900, borderRadius: 22, background: "#FFFFFF",
            boxShadow: "0 50px 100px rgba(0,0,0,0.7)", opacity: cardIn, transform: `translateX(${((1 - cardIn) * 200).toFixed(1)}px)`,
            display: "flex", flexDirection: "column", alignItems: "center", padding: "34px 40px",
          }}>
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: V.steel, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1.02, color: INK, textAlign: "center", marginTop: 8 }}>{title}</div>
            <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 28, lineHeight: 1.25, color: "#4A5866", textAlign: "center", marginTop: 10 }}>{sub}</div>
            {qr ? (
              <div style={{ marginTop: 22, width: 470, height: 470, background: "#FFFFFF", padding: 10 }}>
                <Img src={src(qr)} style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }} />
              </div>
            ) : null}
            <div style={{ marginTop: 14, fontFamily: F_BODY, fontWeight: 800, fontSize: 36, color: INK, letterSpacing: 0.2 }}>{domain}</div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} motes={10} seed={93} />
    </AbsoluteFill>
  );
};
