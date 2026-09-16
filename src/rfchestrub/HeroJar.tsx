// HeroJar.tsx — OBJETO HÉROE del título en 2.5D: el frasco en una tarjeta de vidrio grande al centro,
// y sus "piezas" (ingredientes) que salen como fichas conectadas con una línea que se traza, cada una
// EN su frase (`parts[].at`). tone "good" = verde (lo que sirve) · "warn" = ámbar/rojo (lo que irrita).
// ⛔ Todo por props. ⛔ Sin Math.random.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

export const HeroJar: React.FC<{
  kicker?: string;
  img?: string;
  bed?: string;
  parts?: { text: string; sub?: string; tone?: "good" | "warn"; at?: number }[];
  durationInFrames?: number;
}> = ({ kicker = "", img, bed, parts = [], durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const hits = parts.map((p, i) => p.at ?? 20 + i * 20);
  const cam = useCam(frame, fps, hits, 0.06, dur);
  const jarIn = spr(frame, fps, 0, 120, 0.9);
  const out = ramp(frame, dur - 9, dur);
  const slots = [
    { x: 90, y: 250 }, { x: 1360, y: 250 }, { x: 90, y: 620 }, { x: 1360, y: 620 }, { x: 725, y: 860 },
  ];
  const JX = 560, JY = 150, JW = 800, JH = 640;

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed ?? img} blur={20} dim={0.64} bokeh={10} seed={61} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 50%" }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={1}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 60 }}>
            <KickerRule text={kicker} a={ramp(frame, 0, 12)} center />
          </div>
        </Plane>
        <Plane depth={0.75} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{
            position: "absolute", left: JX, top: JY, opacity: jarIn,
            transform: `perspective(1800px) rotateY(${(Math.sin(frame / 70) * 4).toFixed(2)}deg) scale(${interpolate(jarIn, [0, 1], [0.86, 1]).toFixed(4)})`,
          }}>
            <GlassPhoto img={img} w={JW} h={JH} push={frame * 0.00025} />
          </div>
          {/* líneas */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 1920 1080">
            {parts.map((p, i) => {
              const s = slots[i % slots.length];
              const at = hits[i];
              const u = ramp(frame, at, at + 10);
              const col = p.tone === "good" ? V.ok : V.amber;
              const x1 = s.x + 235, y1 = s.y + 60;
              const x2 = JX + JW / 2 + (s.x < 900 ? -JW * 0.32 : s.x > 1000 ? JW * 0.32 : 0), y2 = JY + JH * (s.y > 800 ? 0.9 : s.y > 500 ? 0.62 : 0.38);
              return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={col} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} style={{ filter: `drop-shadow(0 0 8px ${rgba(col, 0.7)})` }} />;
            })}
          </svg>
        </Plane>
        <Plane depth={1} camX={cam.camX} camY={cam.camY} z={3}>
          {parts.map((p, i) => {
            const s = slots[i % slots.length];
            const at = hits[i];
            const k = spr(frame, fps, at, 120, 0.8);
            const col = p.tone === "good" ? V.ok : V.amber;
            return (
              <div key={i} style={{
                position: "absolute", left: s.x, top: s.y, width: 470, padding: "18px 24px", borderRadius: 18,
                background: `linear-gradient(150deg, ${rgba(V.ink2, 0.96)}, ${rgba(V.ink0, 0.97)})`, borderLeft: `8px solid ${col}`,
                boxShadow: `0 24px 50px rgba(0,0,0,0.6), 0 0 30px ${rgba(col, 0.25)}`,
                opacity: interpolate(k, [0, 1], [0, 1], CL), transform: `translateY(${((1 - k) * 40).toFixed(1)}px) scale(${interpolate(k, [0, 1], [0.8, 1], CL).toFixed(3)})`,
              }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 1.02, color: V.white, textTransform: "uppercase" }}>{p.text}</div>
                {p.sub ? <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 26, color: col === V.ok ? "#9FD7AE" : "#F7D08A", marginTop: 6 }}>{p.sub}</div> : null}
              </div>
            );
          })}
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={63} />
    </AbsoluteFill>
  );
};
