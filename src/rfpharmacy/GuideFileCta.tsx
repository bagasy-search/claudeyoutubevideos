// GuideFileCta.tsx — CTA de pantalla completa con look EXPEDIENTE: a la izquierda una carpeta manila
// abierta con las TRES portadas reales de la guía en abanico y (opcional) páginas reales que pasan
// como "páginas de la guía"; a la derecha, panel BLANCO con el QR REAL grande (sin tapar, sin blur,
// estable toda la duración salvo los 6 cuadros de salida) + el dominio legible.
// ⛔ Sin QR placeholder: si no llega `qr`, el panel dice que falta (se nota en la revisión).
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, ramp, spr, src, Atmosphere, Finish, Plane, useCam } from "./RoweDepth";

const MANILA = "#D9B878";
const MANILA_D = "#B8955A";
const INK = "#1D2733";

export const GuideFileCta: React.FC<{
  covers?: string[];
  pages?: { img: string; at: number }[];
  qr?: string;
  domain?: string;
  kicker?: string;
  title?: string;
  sub?: string;
  scan?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ covers = [], pages = [], qr, domain = "", kicker = "", title = "", sub = "", scan = "SCAN THE CODE", bed, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [], 0.025, dur);
  const folderIn = spr(frame, fps, 0, 130, 0.9);
  const panelIn = spr(frame, fps, 4, 140, 0.8);
  const out = ramp(frame, dur - 6, dur);
  const active = pages.filter((p) => frame >= p.at).length - 1;

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Atmosphere frame={frame} img={bed} blur={18} dim={0.68} bokeh={10} seed={61} tint={V.amber} camX={cam.camX * 0.4} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "35% 55%" }}>
        <Plane depth={0.7} camX={cam.camX * 0.4} camY={cam.camY * 0.4} z={2}>
          <div style={{ position: "absolute", left: 90, top: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: ramp(frame, 2, 14) }}>
              <div style={{ width: 56, height: 3, background: V.amber, boxShadow: `0 0 12px ${rgba(V.amber, 0.7)}` }} />
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 5, textTransform: "uppercase", color: V.amber }}>{kicker}</div>
            </div>
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1.02, color: V.white, marginTop: 8, textShadow: "0 6px 30px rgba(0,0,0,0.9)", opacity: ramp(frame, 6, 18) }}>{title}</div>
            {sub ? <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 32, color: V.bone, marginTop: 8, maxWidth: 1000, opacity: ramp(frame, 12, 24) }}>{sub}</div> : null}
          </div>
          {/* carpeta manila */}
          <div style={{ position: "absolute", left: 90, top: 330, width: 1040, height: 700, opacity: folderIn, transform: `translateY(${interpolate(folderIn, [0, 1], [120, 0]).toFixed(1)}px) perspective(2200px) rotateX(6deg)` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `linear-gradient(160deg, ${MANILA} 0%, ${MANILA_D} 100%)`, boxShadow: "0 50px 100px rgba(0,0,0,0.65)" }} />
            <div style={{ position: "absolute", left: 60, top: -46, width: 420, height: 56, borderRadius: "14px 14px 0 0", background: MANILA, display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: INK }}>THE ROWE FILES</div>
            {covers.map((c, i) => {
              const a = spr(frame, fps, 8 + i * 6, 120, 0.9);
              const rot = (i - 1) * 9;
              const dim = active >= 0 ? 0.55 : 0;
              return (
                <div key={i} style={{ position: "absolute", left: 90 + i * 300, top: 70, width: 360, height: 540, borderRadius: 8, overflow: "hidden", opacity: a, transform: `rotate(${(rot * a).toFixed(2)}deg) translateY(${((1 - a) * 80 + (i === 1 ? -14 : 0)).toFixed(1)}px)`, boxShadow: "0 26px 50px rgba(0,0,0,0.5)", filter: `brightness(${(1 - dim).toFixed(2)})` }}>
                  <Img src={src(c)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              );
            })}
            {pages.map((p, i) => {
              const a = spr(frame, fps, p.at, 120, 0.85);
              if (frame < p.at) return null;
              const gone = i < active ? ramp(frame, pages[i + 1].at, pages[i + 1].at + 10) : 0;
              return (
                <div key={`p${i}`} style={{ position: "absolute", left: 300, top: 20 + i * 8, width: 480, height: 621, borderRadius: 6, overflow: "hidden", background: "#fff", opacity: a * (1 - gone), transform: `rotate(${(-3 + i * 3).toFixed(1)}deg) translateY(${((1 - a) * 160).toFixed(1)}px) translateX(${(gone * -120).toFixed(1)}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
                  <Img src={src(p.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                </div>
              );
            })}
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} motes={12} camX={cam.camX * 0.4} seed={63} />
      {/* panel QR — plano propio, sin blur ni parallax fuerte */}
      <div style={{ position: "absolute", right: 110, top: 150, width: 600, opacity: panelIn, transform: `translateX(${((1 - panelIn) * 120).toFixed(1)}px)` }}>
        <div style={{ background: "#FFFFFF", borderRadius: 28, padding: "40px 40px 34px", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", textAlign: "center" }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 38, letterSpacing: 4, color: INK }}>{scan}</div>
          <div style={{ width: 460, height: 460, margin: "18px auto 14px", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {qr ? <Img src={src(qr)} style={{ width: 460, height: 460, imageRendering: "pixelated" }} /> : <div style={{ fontFamily: F_BODY, fontSize: 30, color: V.danger }}>QR MISSING</div>}
          </div>
          <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 31, color: INK, letterSpacing: 0.2 }}>{domain}</div>
          <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 25, color: "#56606B", marginTop: 8 }}>or tap the link in the description</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
