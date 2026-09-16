// FileOpen.tsx — THE ROWE FILES: la CARPETA DEL CASO que se abre. Carpeta manila con pestaña sube desde abajo,
// la tapa se abre en 3D, adentro una ficha de papel con la foto de la paciente sujeta con un clip, los campos
// se tipean uno por uno en el cuadro exacto en que el doctor los dice (`at`) y un SELLO rojo golpea en `stampAt`.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { F_DISPLAY, F_BODY, rgba, CL, ramp, spr, src, Atmosphere, Finish, Plane, useCam } from "./RoweDepth";

export type FileField = { k: string; v: string; at: number };

const PAPER = "#F3EAD6";
const MANILA = "#D9B26A";
const INK = "#2B2A28";

export const Paperclip: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size * 0.42} height={size} viewBox="0 0 30 72" style={{ overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))" }}>
    <path d="M9 18 V56 a6 6 0 0 0 12 0 V10 a9 9 0 0 0 -18 0 V52" fill="none" stroke="#C9CED6" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M9 18 V56 a6 6 0 0 0 12 0 V10 a9 9 0 0 0 -18 0 V52" fill="none" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const Stamp: React.FC<{ text: string; u: number; color?: string; rot?: number; size?: number }> = ({ text, u, color = "#B8342B", rot = -9, size = 54 }) => {
  if (u <= 0) return null;
  const s = interpolate(u, [0, 0.55, 1], [2.3, 0.94, 1], CL);
  const op = interpolate(u, [0, 0.3], [0, 0.92], CL);
  return (
    <div style={{
      display: "inline-block", padding: `${size * 0.16}px ${size * 0.42}px`, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.14,
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: size * 0.08, color, textTransform: "uppercase", lineHeight: 1,
      transform: `rotate(${rot}deg) scale(${s.toFixed(3)})`, opacity: op, mixBlendMode: "multiply",
      boxShadow: `inset 0 0 0 ${size * 0.04}px ${rgba(color, 0.35)}`,
    }}>{text}</div>
  );
};

export const FileOpen: React.FC<{
  kicker?: string;
  name?: string;
  photo?: string;
  bed?: string;
  fields?: FileField[];
  caseNo?: string;
  stamp?: string;
  stampAt?: number;
  durationInFrames?: number;
}> = ({ kicker = "THE ROWE FILES", name = "", photo, bed, fields = [], caseNo = "", stamp = "", stampAt = 99999, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [stampAt], 0.05, dur);
  const rise = spr(frame, fps, 0, 140, 0.9);
  const open = ramp(frame, 12, 34);
  const clipIn = spr(frame, fps, 26, 110, 0.8);
  const out = ramp(frame, dur - 9, dur);
  const stampU = ramp(frame, stampAt, stampAt + 7);
  const t = frame - stampAt;
  const shake = t >= 0 && t < 8 ? Math.sin(t * 2.6) * 5 * (1 - t / 8) : 0;

  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 12).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed} blur={16} dim={0.66} bokeh={9} seed={41} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)}) translate(${shake.toFixed(1)}px, ${(shake * 0.5).toFixed(1)}px)`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{
            position: "absolute", left: 260, top: 150, width: 1400, height: 830,
            transform: `translateY(${interpolate(rise, [0, 1], [900, 0]).toFixed(1)}px) perspective(2200px) rotateX(${interpolate(rise, [0, 1], [22, 6]).toFixed(2)}deg)`,
            transformOrigin: "50% 100%",
          }}>
            {/* espalda de la carpeta con pestaña */}
            <div style={{ position: "absolute", left: 0, top: 40, right: 0, bottom: 0, borderRadius: 18, background: `linear-gradient(170deg, #E3C07C 0%, ${MANILA} 55%, #C49A52 100%)`, boxShadow: "0 60px 120px rgba(0,0,0,0.7), 0 14px 30px rgba(0,0,0,0.45)" }} />
            <div style={{ position: "absolute", left: 60, top: 0, width: 420, height: 70, borderRadius: "16px 16px 0 0", background: "#E3C07C", display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#5A4520" }}>{kicker}</div>
            {/* hoja de papel */}
            <div style={{ position: "absolute", left: 70, top: 80, right: 70, bottom: 40, borderRadius: 6, background: PAPER, boxShadow: "0 4px 18px rgba(0,0,0,0.25)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 57px, ${rgba("#7A9CC0", 0.22)} 57px 59px)` }} />
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: rgba("#B8342B", 0.35), marginLeft: 470 }} />
              {/* foto sujeta con clip */}
              <div style={{ position: "absolute", left: 60, top: 70, width: 360, height: 450, background: "#FFFFFF", padding: 14, boxShadow: "0 18px 34px rgba(0,0,0,0.35)", transform: `rotate(${interpolate(clipIn, [0, 1], [-14, -3]).toFixed(2)}deg) translateY(${interpolate(clipIn, [0, 1], [-60, 0]).toFixed(1)}px)`, opacity: clipIn }}>
                {photo ? <Img src={src(photo)} style={{ width: "100%", height: 370, objectFit: "cover" }} /> : null}
                <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 28, color: INK, marginTop: 10, textAlign: "center", letterSpacing: 2 }}>{name}</div>
                <div style={{ position: "absolute", top: -34, left: 150 }}><Paperclip size={96} /></div>
              </div>
              {caseNo ? <div style={{ position: "absolute", right: 50, top: 36, fontFamily: "Courier New, monospace", fontSize: 30, color: rgba(INK, 0.7), letterSpacing: 2 }}>{caseNo}</div> : null}
              {/* campos tipeados */}
              <div style={{ position: "absolute", left: 520, top: 110, right: 60 }}>
                {fields.map((f, i) => {
                  const nChars = f.v.length;
                  const typed = Math.max(0, Math.min(nChars, Math.floor((frame - f.at) * 1.6)));
                  const vis = frame >= f.at - 2 ? ramp(frame, f.at - 2, f.at + 4) : 0;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 22, height: 116, opacity: vis }}>
                      <div style={{ width: 230, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: "#8A6A30", textTransform: "uppercase" }}>{f.k}</div>
                      <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 52, color: INK, whiteSpace: "nowrap" }}>
                        {f.v.slice(0, typed)}<span style={{ opacity: typed < nChars && frame % 10 < 5 ? 1 : 0 }}>▍</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {stamp ? <div style={{ position: "absolute", right: 90, bottom: 60 }}><Stamp text={stamp} u={stampU} size={66} /></div> : null}
            </div>
            {/* tapa que se abre */}
            <div style={{
              position: "absolute", left: 0, top: 40, right: 0, bottom: 0, borderRadius: 18, transformOrigin: "50% 0%",
              transform: `perspective(2400px) rotateX(${interpolate(open, [0, 1], [0, -104]).toFixed(2)}deg)`,
              background: `linear-gradient(175deg, #E6C681 0%, ${MANILA} 100%)`, backfaceVisibility: "hidden",
              opacity: open >= 0.98 ? 0 : 1, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 110, letterSpacing: 14, color: rgba("#5A4520", 0.55) }}>{kicker}</div>
            </div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={43} />
    </AbsoluteFill>
  );
};
