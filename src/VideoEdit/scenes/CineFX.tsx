import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GRAIN_URI } from "./grainData";

// Global compositing texture: film grain (animated), vignette, drifting dust motes, and a slow
// light-ray sweep. Sits on top of everything (pointerEvents none). Subtle by design — it makes
// the frame feel hand-finished, not "PowerPoint clean".
const MOTES = Array.from({ length: 26 }, (_, i) => {
  const r = (s: number) => { const x = Math.sin(s * 99.7) * 9301; return x - Math.floor(x); };
  return { x: r(i * 3) * 100, y: r(i * 7) * 100, sz: 2 + r(i) * 7, o: 0.1 + r(i * 5) * 0.4, sp: 0.2 + r(i * 11) * 0.6, ph: r(i * 13) * 6.28 };
});

export const CineFX: React.FC<{ grain?: number; rays?: boolean }> = ({ grain = 0.09, rays = true }) => {
  const frame = useCurrentFrame();
  // cheap animated grain: a baked noise tile shifted each frame (feTurbulence per-frame was
  // far too slow on the farm and timed out chunks). Deterministic pseudo-random offset.
  const gx = (frame * 37) % 256;
  const gy = (frame * 53) % 256;
  const raySweep = 118 + Math.sin(frame * 0.006) * 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {rays && (
        <AbsoluteFill style={{ mixBlendMode: "screen",
          background: `linear-gradient(${raySweep}deg, transparent 32%, rgba(255,214,140,.08) 47%, rgba(255,236,196,.14) 50%, rgba(255,214,140,.08) 53%, transparent 66%)` }} />
      )}
      <AbsoluteFill>
        {MOTES.map((m, i) => {
          const drift = Math.sin(frame * 0.01 * m.sp + m.ph);
          return (
            <div key={i} style={{ position: "absolute", left: `${m.x}%`, top: `${(m.y + drift * 2) % 100}%`,
              width: m.sz, height: m.sz, borderRadius: "50%", filter: "blur(.5px)",
              opacity: m.o * (0.7 + 0.3 * Math.sin(frame * 0.04 + i)),
              background: "radial-gradient(circle, #ffe9c2, rgba(255,233,194,0))" }} />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 46%, transparent 52%, rgba(0,0,0,.26) 78%, rgba(0,0,0,.6) 100%)" }} />
      <AbsoluteFill style={{ opacity: grain, mixBlendMode: "overlay",
        backgroundImage: `url(${GRAIN_URI})`, backgroundRepeat: "repeat",
        backgroundPosition: `${gx}px ${gy}px` }} />
    </AbsoluteFill>
  );
};

export default CineFX;
