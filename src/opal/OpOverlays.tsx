// Overlays del canal Opal (van ENCIMA de la toma, nunca solos) + la carta del espectador (pregunta de la semana).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OP, LABEL, SLAB, HAND } from "./OpTheme";
import { FeedTag, OpBed, Written, ease, useIn } from "./OpParts";

const useInOut = (n = 10) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  return Math.min(interpolate(f, [0, n], [0, 1], ease), interpolate(f, [durationInFrames - n, durationInFrames], [1, 0], ease));
};

export const OpNameTag: React.FC<{ name?: string; line?: string }> = ({ name = "Opal", line = "50 years of hens · Indiana" }) => {
  const k = useInOut(12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, bottom: 100, transform: `translateX(${(1 - k) * -80}px) rotate(-2deg)`, opacity: k }}>
        <FeedTag w={640} h={190}>
          <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 84, color: OP.red, lineHeight: 1 }}>{name}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: OP.pencil }}>{line}</div>
        </FeedTag>
      </div>
    </AbsoluteFill>
  );
};

export const OpAsk: React.FC<{ question: string; eyebrow?: string }> = ({ question, eyebrow = "tell me in the comments" }) => {
  const k = useInOut(12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", right: 90, top: 90, width: 760, transform: `translateY(${(1 - k) * -60}px) rotate(1.5deg)`, opacity: k, background: OP.paper, padding: "26px 34px", borderTop: `12px solid ${OP.red}`, boxShadow: `0 20px 40px ${OP.shadow}` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: OP.red, textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 68, color: OP.pencil, lineHeight: 1.0, marginTop: 6 }}>{question}</div>
      </div>
    </AbsoluteFill>
  );
};

export const OpSubscribe: React.FC<{ text?: string; line?: string }> = ({ text = "Subscribe", line = "catch it before it costs you a hen" }) => {
  const k = useInOut(10); const f = useCurrentFrame();
  const press = interpolate(f, [26, 30, 36], [1, 0.92, 1], ease);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", bottom: 90, transform: `translateX(-50%) translateY(${(1 - k) * 60}px)`, opacity: k, display: "flex", alignItems: "center", gap: 24, background: OP.paper, padding: "18px 30px", boxShadow: `0 20px 40px ${OP.shadow}` }}>
        <div style={{ background: f > 30 ? OP.pencilSoft : OP.red, color: OP.white, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, padding: "10px 30px", textTransform: "uppercase", transform: `scale(${press})` }}>{f > 30 ? "Subscribed" : text}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: OP.pencil, whiteSpace: "nowrap" }}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};

// la carta de la semana: sobre que se abre sobre la foto, con nombre, lugar, cuántas gallinas y la pregunta a lápiz
export const OpViewerQ: React.FC<{ bed?: string; name: string; place: string; hens?: string; question: string; seed?: number }> = ({ bed, name, place, hens, question, seed = 14 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 12, 100);
  const open = interpolate(f, [12, 24], [0, 1], ease);
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.3} />
      <div style={{ position: "absolute", left: "50%", top: 120, width: 1180, marginLeft: -590, transform: `translateY(${(1 - k) * 900}px) rotate(-1deg)` }}>
        <div style={{ position: "relative", height: 820, background: "#E9DDBF", boxShadow: `0 30px 60px ${OP.shadow}` }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 60 - 300 * open, height: 700, background: OP.paper, boxShadow: "0 6px 14px rgba(0,0,0,0.2)", padding: "50px 60px", opacity: open }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 7, color: OP.red, textTransform: "uppercase" }}>question of the week</div>
            <Written text={`${name} · ${place}${hens ? ` · ${hens}` : ""}`} at={22} size={56} color={OP.pencilSoft} />
            <Written text={question} at={34} size={74} style={{ marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "#E2D3B0", clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
