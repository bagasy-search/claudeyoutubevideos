// OleChalkboard — la pizarra del menú del día (serie olworld). Pizarra de pizarra real en marco de madera, colgada del muro de troncos
// junto al farol: el título y cada renglón se escriben con tiza (revelado de trazo), con polvo de tiza y una tiza en la bandeja.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, HAND, SLAB, woodBg, rnd } from "../olsup/OleSupTheme";
import { Bed, CL, easeOut, fadeOut, flicker, clipR } from "../olsup/OleBits";

const Dust: React.FC<{ seed: number; f: number }> = ({ seed, f }) => (
  <>
    {Array.from({ length: 26 }).map((_, i) => {
      const x = 80 + rnd(seed + i * 13) * 1120, y = 120 + rnd(seed + i * 29) * 560;
      const a = 0.05 + rnd(seed + i * 7) * 0.12, r = 20 + rnd(seed + i * 3) * 90;
      return <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin((f + i * 9) * 0.02) * 2, width: r, height: r * 0.45, borderRadius: "50%", background: `rgba(235,235,225,${a})`, filter: "blur(10px)" }} />;
    })}
  </>
);

export const OleChalkboard: React.FC<{ title: string; lines: string[]; strike?: number[]; footer?: string; bed?: string }> = ({ title, lines, strike = [], footer, bed }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const D = durationInFrames;
  const inP = interpolate(f, [0, 16], [0, 1], { ...CL, easing: easeOut });
  const out = fadeOut(f, D, 8);
  const L = lines.slice(0, 8);
  const t0 = Math.round(fps * 0.9), tEnd = Math.max(t0 + L.length * 10, Math.round(D * 0.72));
  const per = (tEnd - t0) / Math.max(1, L.length);
  const p = (i: number) => interpolate(f, [t0 + i * per, t0 + (i + 0.9) * per], [0, 100], CL);
  const glow = flicker(f, 5);
  const fs = L.length > 6 ? 50 : L.length > 4 ? 58 : 70;
  const lh = Math.round(fs * 1.24);
  const writing = L.findIndex((_, i) => p(i) > 0 && p(i) < 100);
  const z = 1.0 + 0.05 * interpolate(f, [0, D], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: out, backgroundColor: OLE.wood0 }}>
      <Bed src={bed} dim={0.45} blur={10} />
      {!bed ? <AbsoluteFill style={{ ...woodBg(OLE.wood1, 2) }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 85% 30%, rgba(255,185,95,${0.32 * glow}), transparent 55%)` }} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        {/* marco + pizarra */}
        <div style={{ position: "absolute", left: 300, top: 110 + (1 - inP) * 50, width: 1320, height: 820, rotate: "-1.4deg", opacity: inP, filter: "drop-shadow(22px 30px 36px rgba(0,0,0,0.6))" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 10, ...woodBg(OLE.wood3, 6), boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.45), inset 0 4px 0 rgba(255,225,170,0.25)" }} />
          <div style={{ position: "absolute", left: 40, top: 40, right: 40, bottom: 70, borderRadius: 4, background: "radial-gradient(ellipse at 40% 35%, #3b4440 0%, #262c2a 55%, #1b201e 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)", overflow: "hidden" }}>
            <Dust seed={title.length * 31} f={f} />
            <div style={{ position: "absolute", left: 70, top: 40, right: 60, fontFamily: HAND, fontWeight: 700, fontSize: 92, lineHeight: "104px", color: "rgba(246,244,232,0.94)", textShadow: "0 0 2px rgba(255,255,255,0.6), 0 0 14px rgba(255,255,255,0.12)", whiteSpace: "nowrap", clipPath: clipR(interpolate(f, [4, t0], [0, 100], CL)) }}>{title}</div>
            <div style={{ position: "absolute", left: 70, top: 152, width: interpolate(f, [t0 - 6, t0 + 6], [0, 560], CL), height: 5, borderRadius: 3, background: "rgba(240,220,160,0.75)", rotate: "-0.6deg" }} />
            {L.map((l, i) => (
              <div key={i} style={{ position: "absolute", left: 80, top: 196 + i * lh, right: 60, fontFamily: HAND, fontWeight: 600, fontSize: fs, lineHeight: `${lh}px`, color: "rgba(240,238,226,0.9)", textShadow: "0 0 2px rgba(255,255,255,0.45)", whiteSpace: "nowrap", clipPath: clipR(p(i)) }}>
                {l}
                {strike.includes(i) && p(i) >= 99 ? <div style={{ position: "absolute", left: -6, right: 40, top: lh / 2, height: 5, background: "rgba(230,120,90,0.85)", rotate: "-1deg", width: interpolate(f, [t0 + (i + 1) * per, t0 + (i + 1) * per + 8], [0, 900], CL) }} /> : null}
              </div>
            ))}
            {footer ? <div style={{ position: "absolute", right: 60, bottom: 26, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "rgba(240,200,120,0.9)", rotate: "-2deg", opacity: interpolate(f, [tEnd, tEnd + 12], [0, 1], CL) }}>{footer}</div> : null}
          </div>
          {/* bandeja con tiza */}
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 26, height: 30, borderRadius: 4, ...woodBg(OLE.wood2, 9), boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 980 + (writing >= 0 ? -900 : 0), bottom: 40, width: 90, height: 18, borderRadius: 8, background: "linear-gradient(180deg,#fbfaf2,#d8d5c6)", opacity: writing >= 0 ? 0 : 1, boxShadow: "0 3px 4px rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 640, top: -38, width: 18, height: 18, borderRadius: 9, background: "radial-gradient(circle at 35% 35%, #9a948c, #2c2a27)" }} />
          <div style={{ position: "absolute", left: 646, top: -24, width: 2, height: 60, background: "rgba(40,30,20,0.8)", rotate: "35deg", transformOrigin: "top" }} />
          <div style={{ position: "absolute", left: 650, top: -24, width: 2, height: 60, background: "rgba(40,30,20,0.8)", rotate: "-35deg", transformOrigin: "top" }} />
        </div>
        {/* la tiza en la mano mientras escribe */}
        {writing >= 0 ? (
          <div style={{ position: "absolute", left: 300 + 80 + (p(writing) / 100) * 900, top: 110 + 40 + 196 + writing * lh + lh * 0.55, width: 70, height: 16, borderRadius: 7, background: "linear-gradient(180deg,#fbfaf2,#d8d5c6)", rotate: "-28deg", boxShadow: "4px 6px 8px rgba(0,0,0,0.5)" }} />
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(10,5,2,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 60, top: 40, fontFamily: SLAB, fontSize: 26, letterSpacing: 6, color: "rgba(255,230,190,0.55)", opacity: inP }}>COOKHOUSE MENU</div>
    </AbsoluteFill>
  );
};
