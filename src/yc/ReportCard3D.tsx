// ReportCard3D — la libreta de calificaciones de 1962 en 3D (CSS 3D, liviana): cae sobre el pupitre, la tapa se abre
// sobre la bisagra y adentro se escriben a mano las filas (materia · nota) y una nota de la maestra en rojo.
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { Media } from "./Media";
import { SERIF, TYPE, SANS, clamp, ease } from "./theme";

const HAND = loadFont().fontFamily;

export const ReportCard3D: React.FC<{ title?: string; rows: { label: string; grade: string }[]; note?: string; bed?: string }> = ({ title = "REPORT CARD", rows, note, bed }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();
  const drop = spring({ frame: f, fps, config: { damping: 16, stiffness: 70 } });
  const open = ease(clamp((f - 22) / 26));
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 10)) / 10));
  const W = 760, H = 980;
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#1A120B" }}>
      {bed ? <AbsoluteFill style={{ filter: "blur(12px) brightness(0.4) sepia(0.3)" }}><Media src={bed} kb="in" /></AbsoluteFill> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(90,58,34,0.35), rgba(0,0,0,0.75) 80%)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 560 - H / 2, width: W, height: H, transformStyle: "preserve-3d",
          transform: `translateY(${(1 - drop) * -700}px) rotateX(${18 - open * 6}deg) rotateZ(${-3 + open * 2}deg) translateX(${open * 380}px) scale(${0.92 + open * 0.08})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#F6F0DE", boxShadow: "0 60px 120px rgba(0,0,0,0.7)", padding: "50px 56px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: SERIF, fontSize: 58, color: "#1B2A4A", borderBottom: "3px double #1B2A4A", paddingBottom: 10 }}>{title}</div>
            <div style={{ fontFamily: TYPE, fontSize: 22, color: "#4A3B2C", marginTop: 8 }}>Grade 6 · 1962–63</div>
            {rows.map((r, i) => {
              const t = clamp((f - 46 - i * 12) / 12);
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(27,42,74,0.3)", padding: "14px 0" }}>
                  <div style={{ fontFamily: TYPE, fontSize: 38, color: "#1B2A4A" }}>{r.label}</div>
                  <div style={{ fontFamily: HAND, fontSize: 74, color: "#C8102E", opacity: t, transform: `scale(${0.6 + 0.4 * ease(t)})` }}>{r.grade}</div>
                </div>
              );
            })}
            {note ? <div style={{ fontFamily: HAND, fontSize: 56, color: "#C8102E", marginTop: 30, transform: "rotate(-2deg)", opacity: ease(clamp((f - 46 - rows.length * 12 - 8) / 16)) }}>{note}</div> : null}
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0% 50%", transform: `rotateY(${-178 * open}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #3E6B4A, #2C4E37)", backfaceVisibility: "hidden", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", border: "6px solid #C9A55A", boxSizing: "border-box" }}>
              <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 10, color: "#EAD9A8" }}>PUBLIC SCHOOLS</div>
              <div style={{ fontFamily: SERIF, fontSize: 76, color: "#F3E6C0", marginTop: 20, textAlign: "center", lineHeight: 1.05 }}>Report<br />Card</div>
              <div style={{ fontFamily: TYPE, fontSize: 26, color: "#EAD9A8", marginTop: 30 }}>Pupil: ____________</div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "#E9DFC6", transform: "rotateY(180deg)", backfaceVisibility: "hidden", padding: 60, boxSizing: "border-box" }}>
              {bed ? <div style={{ width: "100%", height: 520, background: "#fff", padding: 16, boxSizing: "border-box", boxShadow: "0 8px 20px rgba(0,0,0,0.25)", transform: "rotate(-2deg)" }}>
                <div style={{ width: "100%", height: "100%", overflow: "hidden", filter: "sepia(0.35) contrast(1.05)" }}><Media src={bed} kb="none" /></div>
              </div> : null}
              <div style={{ fontFamily: HAND, fontSize: 52, color: "#1B2A4A", marginTop: 40, transform: "rotate(-2deg)" }}>Class of '62</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
