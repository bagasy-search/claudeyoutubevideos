// BottleHero.tsx — EL OBJETO DEL TÍTULO en 2.5D: la botella de farmacia en una tarjeta de vidrio que
// flota al centro con luz de canto que gira y anillos teal que laten; alrededor, notas de expediente
// (etiqueta + línea guía que se traza hasta la botella) que entran cuando el doctor las dice.
// `notes[].at` en cuadros del segmento; `side` izquierda/derecha; `y` 0..1 de la altura útil.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, ramp, spr, Atmosphere, Finish, GlassPhoto, KickerRule, Plane, useCam } from "./RoweDepth";

export type BottleNote = { text: string; sub?: string; at: number; side: "l" | "r"; y: number };

export const BottleHero: React.FC<{
  img?: string;
  bed?: string;
  kicker?: string;
  title?: string;
  notes?: BottleNote[];
  durationInFrames?: number;
}> = ({ img, bed, kicker = "", title = "", notes = [], durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, notes.map((n) => n.at), 0.05, dur);
  const heroIn = spr(frame, fps, 2, 110, 0.9);
  const bob = Math.sin(frame / 34) * 8;
  const rim = (frame * 2.2) % 360;
  const pulse = (frame % 60) / 60;
  const out = ramp(frame, dur - 9, dur);
  const CX = 960, CY = 600, HW = 300, HH = 380;

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed ?? img} blur={20} dim={0.66} bokeh={12} seed={41} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.4} camX={cam.camX} camY={cam.camY} z={1}>
          {[0, 0.5].map((o, k) => {
            const p = (pulse + o) % 1;
            return <div key={k} style={{ position: "absolute", left: CX, top: CY, width: 760, height: 760, borderRadius: "50%", border: `3px solid ${rgba(V.brass, (1 - p) * 0.45)}`, transform: `translate(-50%,-50%) scale(${(0.75 + p * 0.6).toFixed(3)})`, opacity: heroIn }} />;
          })}
        </Plane>
        <Plane depth={0.75} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: CX, top: CY + bob, transform: `translate(-50%,-50%) translateY(${interpolate(heroIn, [0, 1], [120, 0]).toFixed(1)}px) perspective(1600px) rotateY(${(Math.sin(frame / 70) * 5).toFixed(2)}deg)`, opacity: heroIn }}>
            <div style={{ position: "absolute", inset: -6, borderRadius: 34, background: `conic-gradient(from ${rim.toFixed(1)}deg, transparent 0deg, ${rgba(V.brassSoft, 0.9)} 40deg, transparent 90deg, transparent 360deg)`, filter: "blur(2px)" }} />
            <GlassPhoto img={img} w={HW * 2} h={HH * 2} radius={30} push={frame * 0.0002} glow={V.brass} glowK={0.35} />
          </div>
        </Plane>
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={5}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center" }}>
            {kicker ? <KickerRule text={kicker} a={ramp(frame, 2, 16)} center /> : null}
            {title ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, color: V.white, marginTop: 8, textShadow: "0 6px 30px rgba(0,0,0,0.9)", opacity: ramp(frame, 8, 22) }}>{title}</div> : null}
          </div>
          <svg style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "visible" }} viewBox="0 0 1920 1080">
            {notes.map((n, i) => {
              const u = ramp(frame, n.at, n.at + 12);
              const y = 250 + n.y * 700;
              const x0 = n.side === "l" ? 560 : 1360;
              const x1 = n.side === "l" ? CX - HW + 30 : CX + HW - 30;
              const y1 = CY - HH * 0.6 + n.y * HH * 1.2;
              const xm = x0 + (x1 - x0) * u, ym = y + (y1 - y) * u;
              return <g key={i} opacity={u > 0 ? 1 : 0}>
                <line x1={x0} y1={y} x2={xm} y2={ym} stroke={V.amber} strokeWidth={4} strokeLinecap="round" />
                <circle cx={x1} cy={y1} r={10 * ramp(frame, n.at + 10, n.at + 16)} fill={V.amber} />
              </g>;
            })}
          </svg>
          {notes.map((n, i) => {
            const a = ramp(frame, n.at, n.at + 9);
            const y = 250 + n.y * 700;
            const box: React.CSSProperties = n.side === "l" ? { right: 1920 - 545 } : { left: 1375 };
            return (
              <div key={i} style={{ position: "absolute", ...box, top: y, transform: `translateY(-50%) translateX(${((1 - a) * (n.side === "l" ? -30 : 30)).toFixed(1)}px)`, opacity: a, maxWidth: 470, textAlign: n.side === "l" ? "right" : "left" }}>
                <div style={{ display: "inline-block", padding: "14px 22px", background: rgba(V.ink0, 0.82), borderRadius: 12, border: `1px solid ${rgba(V.amber, 0.45)}`, boxShadow: "0 14px 36px rgba(0,0,0,0.55)" }}>
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: V.white, textTransform: "uppercase", letterSpacing: 0.5 }}>{n.text}</div>
                  {n.sub ? <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 25, color: V.brassSoft, marginTop: 4 }}>{n.sub}</div> : null}
                </div>
              </div>
            );
          })}
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={43} />
    </AbsoluteFill>
  );
};
