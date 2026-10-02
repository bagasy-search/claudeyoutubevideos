// OpMiteTest — la prueba de la toalla de papel blanca: de noche, el haz de la linterna barre la percha y la toalla se
// pasa por debajo; al darla vuelta aparecen (o no) las manchitas rojas. `found` = con ácaros (rojo) o limpio (verde).
// Props: bed (foto de la percha de noche), found, verdict, steps.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OP, LABEL, rnd } from "./OpTheme";
import { OpBed, Stamp, Written, ease, useIn } from "./OpParts";

export const OpMiteTest: React.FC<{ bed?: string; found?: boolean; verdict?: string; steps?: string[]; seed?: number }> = ({ bed, found = false, verdict, steps = ["after dark", "wipe under the roost", "look with the flashlight"], seed = 12 }) => {
  const f = useCurrentFrame();
  const k = useIn(6, 12, 110);
  const wipe = interpolate(f, [14, 40], [0, 1], ease);
  const flip = interpolate(f, [44, 56], [0, 180], ease);
  const beam = interpolate(f, [0, 60], [-20, 20], ease);
  const v = verdict || (found ? "mites" : "clean");
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0e10" }}>
      <OpBed src={bed} seed={seed} dim={0.55} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 520px 380px at ${50 + beam}% 46%, rgba(255,240,200,0.35), transparent 70%)`, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 120, top: 120, display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => <Written key={i} text={`${i + 1}. ${s}`} at={4 + i * 10} size={58} color={OP.white} />)}
      </div>
      <div style={{ position: "absolute", left: "58%", top: 260, perspective: 1600, transform: `translateX(${(1 - k) * 700}px) translateX(${interpolate(wipe, [0, 1], [-160, 160])}px)` }}>
        <div style={{ position: "relative", width: 560, height: 560, transform: `rotateY(${flip}deg)`, transformStyle: "preserve-3d" }}>
          {[0, 1].map((side) => (
            <div key={side} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: side ? "rotateY(180deg)" : undefined, background: "#FBFBF7",
              backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 2px, transparent 2px 14px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 14px)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", borderRadius: 6 }}>
              {side && found ? Array.from({ length: 34 }).map((_, i) => {
                const x = 60 + rnd(seed + i) * 440, y = 220 + rnd(seed + 99 + i) * 120, w = 10 + rnd(seed + 7 * i) * 40;
                return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: 6 + rnd(i + 3) * 8, borderRadius: 6, background: i % 3 ? "#8E2A1E" : "#5c2a1a", opacity: 0.8, transform: `rotate(${(rnd(i) - 0.5) * 20}deg)` }} />;
              }) : null}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: 140, bottom: 110, opacity: interpolate(f, [58, 62], [0, 1], ease) }}>
        <Stamp text={v} at={58} size={100} color={found ? OP.red : OP.green} rot={-8} style={{ background: "rgba(255,253,247,0.9)" }} />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 110, fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 7, color: OP.yolk, textTransform: "uppercase", opacity: k }}>the paper towel test</div>
    </AbsoluteFill>
  );
};
