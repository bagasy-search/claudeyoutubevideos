// Overlays del canal (van ENCIMA de la toma, nunca solos): rótulo de nombre de Hazel, pregunta para comentarios,
// suscripción. Textos por props.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE } from "./HzTheme";
import { Tag, ease } from "./HzParts";

const useInOut = (n = 10) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  return Math.min(interpolate(f, [0, n], [0, 1], ease), interpolate(f, [durationInFrames - n, durationInFrames], [1, 0], ease));
};

export const HzNameTag: React.FC<{ name?: string; line?: string }> = ({ name = "Hazel", line = "40 years running estate sales" }) => {
  const k = useInOut(12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, bottom: 110, transform: `translateX(${(1 - k) * -80}px) rotate(-2deg)`, opacity: k }}>
        <Tag w={620} h={190}>
          <div><div style={{ fontFamily: SERIF, fontSize: 80, color: HZ.ink, lineHeight: 1 }}>{name}</div><div style={{ fontFamily: TYPE, fontSize: 34, color: HZ.inkSoft }}>{line}</div></div>
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

export const HzAsk: React.FC<{ question: string; eyebrow?: string }> = ({ question, eyebrow = "tell me in the comments" }) => {
  const k = useInOut(12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", right: 90, top: 90, width: 720, transform: `translateY(${(1 - k) * -60}px) rotate(1.5deg)`, opacity: k, background: HZ.paper, padding: "26px 34px", borderTop: `12px solid ${HZ.red}`, boxShadow: `0 20px 40px ${HZ.shadow}` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: HZ.red, textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ fontFamily: SERIF, fontSize: 58, color: HZ.ink, lineHeight: 1.05, marginTop: 6 }}>{question}</div>
      </div>
    </AbsoluteFill>
  );
};

export const HzSubscribe: React.FC<{ text?: string; line?: string }> = ({ text = "Subscribe", line = "so you don't get taken at the next sale" }) => {
  const k = useInOut(10); const f = useCurrentFrame();
  const press = interpolate(f, [26, 30, 36], [1, 0.92, 1], ease);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", bottom: 90, transform: `translateX(-50%) translateY(${(1 - k) * 60}px)`, opacity: k, display: "flex", alignItems: "center", gap: 24, background: HZ.paper, padding: "18px 30px", boxShadow: `0 20px 40px ${HZ.shadow}` }}>
        <div style={{ background: f > 30 ? HZ.inkSoft : HZ.red, color: HZ.white, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, padding: "10px 30px", textTransform: "uppercase", transform: `scale(${press})` }}>{f > 30 ? "Subscribed" : text}</div>
        <div style={{ fontFamily: TYPE, fontSize: 36, color: HZ.ink }}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};
