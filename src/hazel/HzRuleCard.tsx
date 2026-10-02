// HzRuleCard — la regla de oro de Hazel, tipeada en una ficha clavada al tablero del taller con chinche roja; las
// líneas se tachan/marcan y la regla se estampa. Props: bed, rule, lines[], stamp.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HZ, LABEL, SERIF, paperBg } from "./HzTheme";
import { HzBed, Stamp, Typed, ease, useIn } from "./HzParts";

export const HzRuleCard: React.FC<{ bed?: string; eyebrow?: string; rule: string; lines?: string[]; stamp?: string; every?: number; seed?: number }> = ({ bed, eyebrow = "Hazel's rule", rule, lines = [], stamp = "", every = 30, seed = 91 }) => {
  const f = useCurrentFrame();
  const inn = useIn(0, 14, 110);
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.25} blur={2} />
      <div style={{ position: "absolute", left: 300, top: 90, width: 1320, minHeight: 860, ...paperBg(), boxShadow: `0 34px 70px ${HZ.shadow}`, transform: `rotate(${interpolate(inn, [0, 1], [-6, -1.2])}deg) scale(${interpolate(inn, [0, 1], [0.85, 1])})`, padding: "90px 110px" }}>
        <div style={{ position: "absolute", left: "50%", top: 22, width: 46, height: 46, borderRadius: 23, background: HZ.red, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: HZ.red, textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ fontFamily: SERIF, fontSize: 116, color: HZ.ink, lineHeight: 1.02, marginTop: 14 }}>{rule}</div>
        <div style={{ marginTop: 40 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18, opacity: interpolate(f, [20 + i * every, 26 + i * every], [0, 1], ease) }}>
              <div style={{ width: 44, height: 44, border: `4px solid ${HZ.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontSize: 40, color: HZ.green }}>{f > 30 + i * every ? "✓" : ""}</div>
              <Typed text={l} at={20 + i * every} size={48} cps={34} />
            </div>
          ))}
        </div>
        {stamp ? <div style={{ position: "absolute", right: 70, bottom: 60 }}><Stamp text={stamp} at={20 + lines.length * every} size={80} rot={-9} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};
