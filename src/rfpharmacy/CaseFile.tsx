// CaseFile.tsx — THE ROWE FILES: la carpeta clínica de la paciente se ABRE en 2.5D.
// Plano 0: foto real desenfocada (el consultorio). Plano medio: carpeta manila con pestaña
// "THE ROWE FILES" y número de caso; la tapa gira sobre el lomo y revela la hoja interior:
// polaroid de la paciente sujeta con clip + campos tipeados que aparecen cuando el doctor los dice
// (`fields[].at`, cuadros relativos al segmento) + SELLO que golpea en `stampAt`.
// ⛔ Sin Math.random, sin backdrop-filter. Sin texto por defecto con contenido.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, CL, ramp, spr, src, Atmosphere, Finish, Plane, useCam } from "./RoweDepth";

const MANILA = "#D9B878";
const MANILA_D = "#B8955A";
const PAPER = "#F3EEE2";
const INK = "#1D2733";
const MONO = "'Courier New', Courier, monospace";

export type CaseField = { k: string; v: string; at: number };

export const CaseFile: React.FC<{
  bed?: string;
  photo?: string;
  caseNo?: string;
  tab?: string;
  fields?: CaseField[];
  stamp?: string;
  stampAt?: number;
  openAt?: number;
  durationInFrames?: number;
}> = ({ bed, photo, caseNo = "", tab = "THE ROWE FILES", fields = [], stamp = "", stampAt = 99999, openAt = 14, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [stampAt], 0.05, dur);
  const folderIn = spr(frame, fps, 0, 130, 0.9);
  const open = ramp(frame, openAt, openAt + 22);
  const coverRot = interpolate(open, [0, 1], [0, -168], CL);
  const photoIn = spr(frame, fps, openAt + 16, 110, 0.9);
  const st = frame - stampAt;
  const stampK = st >= 0 ? Math.min(1, st / 6) : 0;
  const stampScale = st >= 0 ? interpolate(st, [0, 5, 9], [2.4, 0.94, 1], CL) : 2.4;
  const out = ramp(frame, dur - 9, dur);

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={16} dim={0.64} bokeh={9} seed={23} tint={V.amber} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{
            position: "absolute", left: 960, top: 570, width: 1500, height: 860,
            transform: `translate(-50%,-50%) translateY(${interpolate(folderIn, [0, 1], [140, 0]).toFixed(1)}px) perspective(2400px) rotateX(${interpolate(folderIn, [0, 1], [18, 7]).toFixed(2)}deg)`,
            opacity: folderIn,
          }}>
            {/* espalda de la carpeta + pestaña */}
            <div style={{ position: "absolute", left: 0, top: 40, width: 1500, height: 820, borderRadius: 18, background: `linear-gradient(160deg, ${MANILA} 0%, ${MANILA_D} 100%)`, boxShadow: "0 60px 120px rgba(0,0,0,0.7), 0 16px 30px rgba(0,0,0,0.45)" }} />
            <div style={{ position: "absolute", left: 90, top: 0, width: 470, height: 62, borderRadius: "14px 14px 0 0", background: MANILA, display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: INK }}>{tab}</div>
            {/* hoja interior (derecha) */}
            <div style={{ position: "absolute", left: 770, top: 70, width: 690, height: 760, background: PAPER, borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 57px, ${rgba("#5B7FA3", 0.18)} 57px 59px)` }} />
              <div style={{ position: "absolute", left: 44, top: 34, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: INK }}>PATIENT FILE {caseNo ? `· ${caseNo}` : ""}</div>
              <div style={{ position: "absolute", left: 44, right: 44, top: 82, height: 3, background: INK, opacity: 0.8 }} />
              {fields.map((f, i) => {
                const a = ramp(frame, f.at, f.at + 8);
                const chars = Math.floor(interpolate(frame, [f.at + 4, f.at + 4 + Math.max(8, f.v.length * 1.1)], [0, f.v.length], CL));
                return (
                  <div key={i} style={{ position: "absolute", left: 44, right: 40, top: 118 + i * 116, opacity: a, transform: `translateX(${((1 - a) * 18).toFixed(1)}px)` }}>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "#6A7480" }}>{f.k}</div>
                    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, lineHeight: 1.1, color: INK }}>{f.v.slice(0, chars)}</div>
                  </div>
                );
              })}
              {stamp ? (
                <div style={{
                  position: "absolute", right: 34, bottom: 46, padding: "10px 26px", border: `7px solid ${V.danger}`, borderRadius: 12,
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 58, letterSpacing: 4, color: V.danger, opacity: stampK * 0.92,
                  transform: `rotate(-9deg) scale(${stampScale.toFixed(3)})`, mixBlendMode: "multiply",
                }}>{stamp}</div>
              ) : null}
            </div>
            {/* polaroid con clip (izquierda, sobre la cara interior de la tapa) */}
            <div style={{ position: "absolute", left: 150, top: 150, width: 520, height: 600, opacity: photoIn, transform: `rotate(${interpolate(photoIn, [0, 1], [-14, -4]).toFixed(2)}deg) translateY(${interpolate(photoIn, [0, 1], [-60, 0]).toFixed(1)}px)` }}>
              <div style={{ position: "absolute", inset: 0, background: "#FAFAF6", borderRadius: 4, boxShadow: "0 24px 50px rgba(0,0,0,0.45)" }} />
              <div style={{ position: "absolute", left: 26, top: 26, right: 26, height: 470, background: V.ink1, overflow: "hidden" }}>
                {photo ? <Img src={src(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.08 - frame * 0.0002).toFixed(4)})` }} /> : null}
              </div>
              {/* clip */}
              <svg width={80} height={150} viewBox="0 0 80 150" style={{ position: "absolute", left: 220, top: -60 }}>
                <path d="M26 140 V30 a14 14 0 0 1 28 0 V120 a8 8 0 0 1 -16 0 V40" fill="none" stroke="#9AA6B2" strokeWidth={7} strokeLinecap="round" />
              </svg>
            </div>
            {/* tapa: gira sobre el lomo izquierdo del centro */}
            <div style={{
              position: "absolute", left: 750, top: 40, width: 750, height: 820, borderRadius: 18, transformOrigin: "0% 50%",
              transform: `rotateY(${coverRot.toFixed(2)}deg)`, backfaceVisibility: "hidden",
              background: `linear-gradient(170deg, ${MANILA} 0%, ${MANILA_D} 100%)`, boxShadow: open < 0.98 ? "0 20px 50px rgba(0,0,0,0.4)" : undefined,
              opacity: open > 0.55 ? 0 : 1,
            }}>
              <div style={{ position: "absolute", left: 70, top: 300, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: 6, color: INK, opacity: 0.85 }}>{tab}</div>
              <div style={{ position: "absolute", left: 72, top: 390, fontFamily: MONO, fontWeight: 700, fontSize: 38, color: INK, opacity: 0.8 }}>{caseNo}</div>
            </div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={29} />
    </AbsoluteFill>
  );
};
