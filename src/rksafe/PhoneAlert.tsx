// PhoneAlert.tsx — LA ALERTA DEL TELÉFONO, DENTRO DE LA ESCENA (rktracker, oct-2026).
//
// Sobre la foto real (`bg`, el auto / la cocina) sube un teléfono genérico (sin marca) a un costado; en su
// pantalla cae una notificación (`title`/`body`), late, y aparece un botón (`action`, p. ej. "Play sound")
// que se "toca" (anillo). Opcional `minutes`: contador "with you for 3 h 12 min" que sube.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, clamp01, rgba } from "./RayStage";
import { WorldBed, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const PhoneAlert: React.FC<{
  bg?: string;
  kicker?: string;
  title?: string;
  body?: string;
  action?: string;
  minutes?: number;
  side?: "left" | "right";
  durationInFrames?: number;
}> = ({ bg, kicker = "", title = "Unknown tracker detected", body = "A tracker is moving with you.", action = "Play sound", minutes = 0, side = "right", durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seq);
  const t = frame / D;
  const up = interpolate(t, [0.02, 0.16], [0, 1], ease);
  const note = interpolate(t, [0.2, 0.3], [0, 1], ease);
  const btn = clamp01((t - 0.45) / 0.08);
  const tap = clamp01((t - 0.62) / 0.12);
  const PW = 470, PH = 940;
  const px = side === "right" ? 1920 - PW - 170 : 170;
  const py = 70 + (1 - up) * 700;
  const mins = Math.round(minutes * interpolate(t, [0.3, 0.8], [0.2, 1], ease));
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.08} fx={side === "right" ? 35 : 65} dim={0.3} durationInFrames={D} />
      <div style={{ position: "absolute", left: px, top: py, width: PW, height: PH, borderRadius: 64, background: "#111", boxShadow: "0 40px 100px rgba(0,0,0,.7)", padding: 16 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: "linear-gradient(180deg,#2b3440,#151a20)", position: "relative" }}>
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: F_BODY, fontWeight: 300, fontSize: 96, color: "rgba(255,255,255,.85)" }}>9:41</div>
          <div style={{ position: "absolute", left: 22, right: 22, top: 250 - (1 - note) * 40, opacity: note, borderRadius: 30, background: "rgba(245,245,245,.95)", padding: "22px 24px", transform: `scale(${1 + 0.03 * Math.sin(frame / 5) * note * (1 - tap)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: V.danger, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: F_DISPLAY, fontSize: 28, fontWeight: 700 }}>!</div>
              <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 30, color: "#111", lineHeight: 1.1 }}>{title}</div>
            </div>
            <div style={{ fontFamily: F_BODY, fontSize: 26, color: "#333", marginTop: 12, lineHeight: 1.25 }}>{body}</div>
            {minutes ? <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 26, color: V.danger, marginTop: 10 }}>With you for {Math.floor(mins / 60)} h {mins % 60} min</div> : null}
          </div>
          {action ? (
            <div style={{ position: "absolute", left: 60, right: 60, top: 560, opacity: btn, transform: `scale(${1 - 0.06 * tap * (1 - tap) * 4})`, borderRadius: 40, background: V.brass, padding: "22px 0", textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 38, color: "#111", letterSpacing: 1 }}>{action}</div>
          ) : null}
          {tap > 0 && tap < 1 ? <div style={{ position: "absolute", left: "50%", top: 600, width: 60 + tap * 260, height: 60 + tap * 260, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `6px solid ${rgba(V.brassSoft, 1 - tap)}` }} /> : null}
        </div>
      </div>
      <Tag kicker={kicker} a={interpolate(t, [0, 0.07], [0, 1], ease)} />
    </AbsoluteFill>
  );
};
