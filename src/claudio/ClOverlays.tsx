// Overlays del canal Claudio (van ENCIMA de la toma, dentro del plano, sin taparla):
//   ClNameTag  la plaqueta de latón de la puerta de habitación con el nombre (sin apellido ni empresa)
//   ClStampOv  sello de goma que GOLPEA sobre el plano (temblor de cámara + destello + tinta): "IT'S ALIVE"
//   ClChip     etiqueta corta que entra en una esquina (día, dato): rojo sólo si alert
//   ClAsk      la pregunta para los comentarios, en una tarjetita de "No molestar" colgada, firmada por Claudio
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, SERIF, LABEL, HAND } from "./ClTheme";
import { Plaque, Stamp, lin, pop, useOut } from "./ClParts";

export const ClNameTag: React.FC<{ name?: string; sub?: string }> = ({ name = "Claudio", sub }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8); const p = pop(f, fps, 3); const w = lin(f, 12, 30);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 96, opacity: out * Math.min(1, p * 1.4), translate: `${(1 - p) * -90}px 0`, rotate: "-1deg" }}>
        <Plaque style={{ padding: "16px 46px 12px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#2A1E0C", lineHeight: 1, textShadow: "0 2px 0 rgba(255,240,200,0.6)" }}>{name}</div>
          {sub ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 2, color: "#2A1E0C", marginTop: 4, clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap", textTransform: "uppercase" }}>{sub}</div> : null}
        </Plaque>
      </div>
    </AbsoluteFill>
  );
};

export const ClStampOv: React.FC<{ text: string; at?: number; alert?: boolean }> = ({ text, at = 2, alert = true }) => {
  const f = useCurrentFrame(); const out = useOut(4);
  const hit = f - at - 4; // el sello toca a los ~4 cuadros de entrar
  const shake = hit >= 0 && hit < 10 ? Math.sin(hit * 2.6) * (10 - hit) * 1.4 : 0;
  const flash = hit >= 0 ? interpolate(hit, [0, 6], [0.5, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", translate: `${shake}px ${shake * 0.6}px`, opacity: out }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,${flash}), rgba(255,255,255,0) 70%)` }} />
      <Stamp text={text} at={at} color={alert ? CL.red : CL.navy} x="50%" y="52%" rot={-8} size={150} />
    </AbsoluteFill>
  );
};

export const ClChip: React.FC<{ text: string; alert?: boolean; corner?: "tl" | "tr" | "bl" | "br" }> = ({ text, alert, corner = "tl" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(5); const p = pop(f, fps, 1, 11);
  const pos: React.CSSProperties = { [corner[0] === "t" ? "top" : "bottom"]: 80, [corner[1] === "l" ? "left" : "right"]: 90 } as any;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...pos, opacity: out * Math.min(1, p * 1.5), scale: String(0.6 + 0.4 * p), rotate: `${alert ? 3 : -3}deg`, background: alert ? CL.red : CL.white, color: alert ? "#fff" : CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 84, letterSpacing: 4, padding: "6px 36px", borderRadius: 12, textTransform: "uppercase", boxShadow: `0 18px 40px ${CL.shadow}`, borderBottom: `7px solid ${alert ? "#8E1F17" : CL.yellow}` }}>{text}</div>
    </AbsoluteFill>
  );
};

export const ClAsk: React.FC<{ q: string; sign?: string }> = ({ q, sign = "— Claudio" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8); const p = pop(f, fps, 6, 10);
  const swing = Math.sin(f * 0.16) * 5 * Math.exp(-f / 40);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 110, top: 40, width: 640, opacity: out * Math.min(1, p * 1.3), translate: `0 ${(1 - p) * -200}px`, rotate: `${1.5 + swing}deg`, transformOrigin: "50% 0%" }}>
        {/* colgante de puerta de hotel: agujero para el picaporte */}
        <div style={{ background: CL.navy, borderRadius: "40px 40px 18px 18px", padding: "150px 46px 40px", boxShadow: `0 22px 50px ${CL.shadow}`, position: "relative", borderBottom: `10px solid ${CL.yellow}` }}>
          <div style={{ position: "absolute", left: "50%", top: 36, translate: "-50% 0", width: 110, height: 110, borderRadius: "50%", background: "rgba(0,0,0,0.0)", boxShadow: `0 0 0 9999px transparent`, border: `10px solid ${CL.brassLight}` }} />
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: CL.yellow }}>TELL ME IN THE COMMENTS</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 68, color: "#fff", lineHeight: 1.08, marginTop: 10 }}>{q}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.yellowSoft, textAlign: "right", opacity: lin(f, 30, 44), marginTop: 6 }}>{sign}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
