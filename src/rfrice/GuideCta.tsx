// GuideCta.tsx — CTA de THE ROWE FILES a pantalla completa (set-piece, capa HERO: nada lo tapa).
// Izquierda: las 3 portadas REALES de la guía en abanico 2.5D, sobre una carpeta manila, con un sello.
// Derecha: tarjeta BLANCA con el QR REAL (grande, sin recorte: objectFit contain, cuadrado) + dominio legible.
// ⛔ qr es obligatorio para dibujar el código: sin qr NO se inventa una grilla falsa.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, ramp, spr, src, Atmosphere, Finish, Plane, useCam, KickerRule } from "./RoweDepth";
import { Stamp, Paperclip } from "./FileOpen";

export const GuideCta: React.FC<{
  eyebrow?: string;
  title?: string;
  sub?: string;
  covers?: string[];
  qr?: string;
  domain?: string;
  scanText?: string;
  stamp?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ eyebrow = "", title = "", sub = "", covers = [], qr, domain = "", scanText = "", stamp = "", bed, durationInFrames = 180 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [], 0.03, dur);
  const out = ramp(frame, dur - 9, dur);
  const headA = ramp(frame, 4, 16);
  const qrIn = spr(frame, fps, 10, 140, 0.9);
  const float = Math.sin(frame / 40) * 6;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);

  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={20} dim={0.7} bokeh={10} seed={61} camX={cam.camX} />
      <div style={{ position: "absolute", top: 54, left: 110, right: 110, zIndex: 30, opacity: headA }}>
        <KickerRule text={eyebrow} a={headA} />
        <div style={{ fontFamily: F_DISPLAY, fontSize: 70, fontWeight: 700, color: V.white, marginTop: 4, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
        {sub ? <div style={{ fontFamily: F_BODY, fontSize: 32, fontWeight: 600, color: V.brassSoft, marginTop: 6, maxWidth: 1060, textShadow: "0 3px 14px rgba(0,0,0,0.9)" }}>{sub}</div> : null}
      </div>
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "30% 60%" }}>
        {/* abanico de portadas */}
        <Plane depth={0.8} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 120, top: 360, width: 1040, height: 640 }}>
            <div style={{ position: "absolute", left: 40, top: 60, width: 960, height: 560, borderRadius: 16, background: "linear-gradient(170deg, #E3C07C 0%, #D9B26A 60%, #C49A52 100%)", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", transform: "rotate(-2deg)" }} />
            {covers.slice(0, 3).map((c, i) => {
              const k = spr(frame, fps, 4 + i * 6, 120, 0.85);
              const rot = [-12, 0, 11][i] ?? 0;
              const x = [60, 350, 640][i] ?? 0;
              const y = [70, 20, 80][i] ?? 0;
              return (
                <div key={i} style={{
                  position: "absolute", left: x, top: y + float * (i === 1 ? 1 : 0.6), width: 330, height: 495, zIndex: i === 1 ? 3 : 2,
                  transform: `translateY(${interpolate(k, [0, 1], [500, 0]).toFixed(1)}px) rotate(${(rot * k).toFixed(2)}deg)`,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 8px 18px rgba(0,0,0,0.4)", borderRadius: 6, overflow: "hidden", background: "#fff",
                }}>
                  <Img src={src(c)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 35%)" }} />
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 470, top: -8, zIndex: 5 }}><Paperclip size={110} /></div>
            {stamp ? <div style={{ position: "absolute", left: 610, top: 520, zIndex: 6 }}><Stamp text={stamp} u={ramp(frame, 30, 37)} size={44} rot={-7} /></div> : null}
          </div>
        </Plane>
        {/* QR real, tarjeta blanca */}
        <Plane depth={0.95} camX={cam.camX * 0.2} camY={0} z={4}>
          <div style={{
            position: "absolute", left: 1230, top: 300, width: 600, borderRadius: 22, background: "#FFFFFF", padding: "34px 40px 30px",
            boxShadow: `0 40px 90px rgba(0,0,0,0.65), 0 0 0 ${(4 + pulse * 5).toFixed(1)}px ${rgba(V.brass, 0.55)}`,
            opacity: qrIn, transform: `translateX(${interpolate(qrIn, [0, 1], [160, 0]).toFixed(1)}px)`,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            {scanText ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: "#1E2A3A", textTransform: "uppercase", marginBottom: 14 }}>{scanText}</div> : null}
            {qr ? <Img src={src(qr)} style={{ width: 460, height: 460, objectFit: "contain", imageRendering: "pixelated" }} /> : <div style={{ width: 460, height: 460 }} />}
            <div style={{ marginTop: 16, fontFamily: F_BODY, fontWeight: 800, fontSize: 33, color: "#111820", letterSpacing: 0.2, whiteSpace: "nowrap" }}>{domain}</div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={63} motes={12} />
    </AbsoluteFill>
  );
};
