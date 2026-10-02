// HzRecap — la mesa de tasación vista desde arriba: las etiquetas de los N ítems caen una por una sobre la foto del
// taller (con su número), y la que se nombra en ese segundo se levanta. Props: bed, items[], every, hi (índice que se
// resalta; -1 ninguno), title.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF } from "./HzTheme";
import { HzBed, Tag } from "./HzParts";

export const HzRecap: React.FC<{ bed?: string; items: string[]; every?: number; start?: number; title?: string; seed?: number; ats?: number[] }> = ({ bed, items, every = 12, start = 6, title = "", seed = 81, ats }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const cols = 4;
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.3} blur={2} />
      {title ? <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: HZ.goldSoft, textTransform: "uppercase", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{title}</div> : null}
      {items.map((t, i) => {
        const a = ats?.[i] ?? start + i * every; const nx = ats?.[i + 1] ?? (i + 1 < items.length ? start + (i + 1) * every : a + every);
        const s = spring({ frame: f - a, fps, config: { damping: 12, stiffness: 140 } });
        const cur = f >= a && f < nx;
        const lift = cur ? 1 : 0.0;
        const x = 120 + (i % cols) * 430, y = 170 + Math.floor(i / cols) * 400;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [-120, 0]) - lift * 18}px) rotate(${((i * 37) % 11) - 5}deg) scale(${1 + lift * 0.06})` }}>
            <Tag w={390} h={300} hole="top" color={cur ? HZ.paper : HZ.manila}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: HZ.red, lineHeight: 1 }}>{i + 1}</div>
                <div style={{ fontFamily: SERIF, fontSize: 44, color: HZ.ink, lineHeight: 1.05, marginTop: 6 }}>{t}</div>
              </div>
            </Tag>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
