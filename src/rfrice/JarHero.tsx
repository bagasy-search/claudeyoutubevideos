// JarHero.tsx — EL OBJETO DEL TÍTULO en 2.5D: la foto real del frasco de agua de arroz en una tarjeta de vidrio
// que flota con inclinación y halo, anotaciones de expediente (etiqueta manila con línea que se dibuja) que
// aparecen en el cuadro exacto en que se nombran (`at`), y un rótulo de cinta de papel arriba.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

export type JarNote = { text: string; at: number; side?: "l" | "r"; y?: number; tone?: "ok" | "danger" };

export const JarHero: React.FC<{
  kicker?: string;
  title?: string;
  img?: string;
  bed?: string;
  tape?: string;
  notes?: JarNote[];
  durationInFrames?: number;
}> = ({ kicker = "", title = "", img, bed, tape = "", notes = [], durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, notes.map((n) => n.at), 0.06, dur);
  const inK = spr(frame, fps, 2, 130, 0.9);
  const out = ramp(frame, dur - 9, dur);
  const float = Math.sin(frame / 34) * 10;
  const tilt = Math.sin(frame / 90) * 4;
  const headA = ramp(frame, 6, 20);
  const CW = 800, CH = 450, CX = 960, CY = 590;

  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 12).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed || img} blur={24} dim={0.62} bokeh={12} seed={51} camX={cam.camX} />
      <AbsoluteFill style={{ background: `radial-gradient(38% 42% at 50% 56%, ${rgba("#F6EEDC", 0.16)} 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", top: 58, left: 0, right: 0, textAlign: "center", zIndex: 20, opacity: headA }}>
        <KickerRule text={kicker} a={headA} center />
        <div style={{ fontFamily: F_DISPLAY, fontSize: 64, fontWeight: 700, color: V.white, marginTop: 6, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
      </div>
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 56%" }}>
        <Plane depth={0.85} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{
            position: "absolute", left: CX - CW / 2, top: CY - CH / 2 + float,
            transform: `perspective(1800px) rotateY(${(tilt + interpolate(inK, [0, 1], [-24, 0])).toFixed(2)}deg) scale(${interpolate(inK, [0, 1], [0.7, 1]).toFixed(3)})`,
            opacity: inK,
          }}>
            <GlassPhoto img={img} w={CW} h={CH} glow={V.brass} glowK={0.35 + 0.15 * Math.sin(frame / 20)} push={frame * 0.0002} />
            {tape ? (
              <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%) rotate(-2deg)", padding: "8px 34px", background: rgba("#EFE3C2", 0.94), boxShadow: "0 6px 14px rgba(0,0,0,0.35)", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 32, color: "#3A3326", letterSpacing: 2 }}>{tape}</div>
            ) : null}
          </div>
        </Plane>
        <Plane depth={1} camX={cam.camX} camY={cam.camY} z={4}>
          {notes.map((n, i) => {
            const u = ramp(frame, n.at, n.at + 10);
            const line = ramp(frame, n.at, n.at + 8);
            const left = (n.side || (i % 2 ? "r" : "l")) === "l";
            const y = n.y ?? 380 + i * 150;
            const ax = left ? CX - CW / 2 + 60 : CX + CW / 2 - 60;
            const bx = left ? CX - CW / 2 - 40 : CX + CW / 2 + 40;
            const col = n.tone === "danger" ? V.danger : n.tone === "ok" ? V.ok : V.brass;
            const L = Math.abs(ax - bx);
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", top: y + float * 0.6, left: Math.min(ax, bx), width: L * line, marginLeft: left ? L * (1 - line) : 0, height: 3, background: col, boxShadow: `0 0 10px ${rgba(col, 0.7)}`, opacity: u > 0 ? 1 : 0 }} />
                <div style={{ position: "absolute", top: y - 5 + float * 0.6, left: ax - 7, width: 14, height: 14, borderRadius: "50%", background: col, opacity: line }} />
                <div style={{
                  position: "absolute", top: y - 42,
                  ...(left ? { right: 1920 - bx + 8 } : { left: bx + 8 }),
                  width: 420, padding: "14px 22px", borderRadius: 8, background: rgba("#F3EAD6", 0.97), borderLeft: `8px solid ${col}`,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.55)", opacity: u, transform: `translateY(${((1 - u) * 18).toFixed(1)}px) rotate(${left ? -1.2 : 1.2}deg)`,
                  fontFamily: F_BODY, fontWeight: 700, fontSize: 36, lineHeight: 1.12, color: "#2B2A28",
                } as React.CSSProperties}>{n.text}</div>
              </React.Fragment>
            );
          })}
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={53} />
    </AbsoluteFill>
  );
};
