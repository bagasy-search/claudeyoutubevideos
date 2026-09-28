// TfbWipeCompare — pantalla partida ANTES/DESPUÉS (o A vs B) con una cortina que barre de lado a lado y se queda en
// el medio; cada lado con su rótulo. Los lados pueden ser video (OffthreadVideo) o imagen. Rótulos por props.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ANTON, TFB, clamp, easeInOut, outro } from "./theme";

type Side = { src: string; video?: boolean; startFrom?: number; label: string; tone?: "red" | "yellow" | "white"; focus?: { x: number; y: number; zoom: number } };
const Media: React.FC<{ s: Side }> = ({ s }) => {
  const z = s.focus?.zoom ?? 1, st = { width: "100%", height: "100%", objectFit: "cover" as const, transform: `scale(${z})`, transformOrigin: `${s.focus?.x ?? 50}% ${s.focus?.y ?? 50}%` };
  return s.video ? <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom ?? 0} muted style={st} /> : <Img src={staticFile(s.src)} style={st} />;
};
export const TfbWipeCompare: React.FC<{ left: Side; right: Side; dur: number; sweepFrames?: number }> = ({ left, right, dur, sweepFrames = 26 }) => {
  const f = useCurrentFrame();
  const o = outro(f, dur, 8);
  // la cortina entra desde la derecha, pasa de largo y vuelve al medio (sensación de barrido)
  const pos = interpolate(f, [0, sweepFrames * 0.65, sweepFrames], [100, 38, 50], { ...clamp, easing: easeInOut });
  const lab = (t: number) => interpolate(f, [sweepFrames + t, sweepFrames + t + 10], [0, 1], clamp);
  const tag = (s: Side, p: number, align: "left" | "right") => (
    <div style={{ position: "absolute", bottom: 70, [align]: 60, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, background: s.tone === "red" ? TFB.red : s.tone === "white" ? TFB.white : TFB.yellow,
      color: s.tone === "red" ? TFB.white : TFB.ink, fontFamily: ANTON, fontSize: 64, padding: "4px 26px 8px", borderRadius: 12, boxShadow: "0 10px 0 rgba(0,0,0,0.35)", whiteSpace: "nowrap" } as React.CSSProperties}>{s.label}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: "#000" }}>
      <AbsoluteFill><Media s={left} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><Media s={right} /></AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 10, transform: "translateX(-50%)", background: TFB.white, boxShadow: "0 0 30px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, width: 78, height: 78, transform: "translate(-50%,-50%)", borderRadius: 39, background: TFB.white,
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
        <svg width={50} height={30} viewBox="0 0 50 30"><path d="M16,4 L4,15 L16,26 M34,4 L46,15 L34,26" stroke={TFB.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {tag(left, lab(0), "left")}{tag(right, lab(6), "right")}
    </AbsoluteFill>
  );
};
