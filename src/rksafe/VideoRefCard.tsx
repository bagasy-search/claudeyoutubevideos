// VideoRefCard.tsx — "YA HICE UN VIDEO SOBRE ESO" (canal Ray Kessler).
//
// Una tarjeta de otro video del canal que ENTRA empujando desde la derecha: un llavero de auto dibujado
// en SVG emite ondas en bucle (la llave "hablando" toda la noche), el título del otro video se escribe
// y una flecha latón apunta a la esquina donde YouTube pone la tarjeta. Sirve para cualquier referencia
// cruzada del canal (llave del auto, caja fuerte, botella) cambiando `icon`.
// ⛔ Tiempos como FRACCIÓN de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const Fob: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={360} height={360} viewBox="0 0 360 360" style={{ overflow: "visible" }}>
    {[0, 1, 2].map((k) => {
      const p = ((frame / 30) * 0.8 + k / 3) % 1;
      return <path key={k} d={`M ${230 + p * 90} ${120 - p * 40} Q ${260 + p * 120} ${180} ${230 + p * 90} ${240 + p * 40}`} stroke={rgba(V.brassSoft, 1 - p)} strokeWidth={8} fill="none" />;
    })}
    <rect x="70" y="80" width="150" height="220" rx="60" fill="#1E1E22" stroke="#55555C" strokeWidth="5" />
    <circle cx="145" cy="140" r="24" fill="#3A3A40" />
    <circle cx="145" cy="210" r="24" fill="#3A3A40" />
    <circle cx="145" cy="265" r="10" fill={frame % 40 < 10 ? V.danger : "#4A2A28"} />
    <rect x="125" y="40" width="40" height="50" rx="12" fill="none" stroke={V.brass} strokeWidth="8" />
  </svg>
);

export const VideoRefCard: React.FC<{
  kicker?: string;
  title?: string;
  sub?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "ALSO ON THIS CHANNEL",
  title = "Your Car Key Is Talking All Night",
  sub = "Same idea, different door",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const ease = (a: number, b: number, e = Easing.bezier(0.25, 0.1, 0.1, 1)) =>
    clamp01(interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e }));
  const card = ease(0, 0.16);
  const chars = Math.round(ease(0.12, 0.5, Easing.linear) * title.length);
  const subA = ease(0.48, 0.58);
  const flecha = ease(0.58, 0.72);
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.72} />
      <div style={{
        position: "absolute", left: 200, top: 220, width: 1520, height: 560, borderRadius: 26,
        background: `linear-gradient(135deg, ${rgba(V.ink2, 0.97)}, ${rgba(V.ink0, 0.97)})`, border: `3px solid ${rgba(V.brass, 0.8)}`,
        boxShadow: "0 30px 90px rgba(0,0,0,.7)", transform: `translateX(${(1 - card) * 1400}px) rotate(${(1 - card) * 4}deg)`,
        display: "flex", alignItems: "center", gap: 40, padding: "0 70px",
      }}>
        <Fob frame={frame} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 1.04, color: V.white, marginTop: 12, minHeight: 180 }}>
            {title.slice(0, chars)}<span style={{ opacity: chars < title.length && frame % 16 < 8 ? 1 : 0, color: V.brass }}>|</span>
          </div>
          <div style={{ fontFamily: F_BODY, fontSize: 36, color: V.bone, marginTop: 18, opacity: subA }}>{sub}</div>
        </div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <path d="M 1500 820 C 1620 860, 1700 760, 1760 620" stroke={V.brass} strokeWidth={8} fill="none" strokeLinecap="round"
          strokeDasharray="420" strokeDashoffset={420 * (1 - flecha)} />
        <path d="M 1732 640 L 1760 610 L 1776 650" stroke={V.brass} strokeWidth={8} fill="none" strokeLinecap="round" opacity={flecha > 0.95 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
