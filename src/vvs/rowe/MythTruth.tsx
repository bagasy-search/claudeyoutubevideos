// MythTruth.tsx — MITO vs VERDAD como escena 2.5D (v2): dos tarjetas de vidrio con FOTO en planos
// distintos. El MITO entra adelante, el tachado rojo lo cruza con golpe de cámara, y el mito RETROCEDE
// (se achica, se desenfoca, se apaga) mientras la VERDAD avanza desde la derecha con halo teal.
// Rojo SÓLO en el tachado y el chip MYTH.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

const Chip: React.FC<{ text: string; color: string; ink: string }> = ({ text, color, ink }) => (
  <div style={{ display: "inline-block", padding: "8px 22px", borderRadius: 999, background: color, color: ink, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4, boxShadow: `0 10px 24px ${rgba(color, 0.45)}` }}>{text}</div>
);

export const MythTruth: React.FC<{
  myth?: string;
  truth?: string;
  kicker?: string;
  bed?: string;
  mythImg?: string;
  truthImg?: string;
  hitAt?: number;
  truthAt?: number;
  durationInFrames?: number;
}> = ({ kicker = "", myth = "", truth = "", bed, mythImg, truthImg, hitAt = 22, truthAt = 46, durationInFrames = 210 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [hitAt], 0.05, durationInFrames);
  const mIn = spr(frame, fps, 2, 120, 0.9);
  const slash = ramp(frame, hitAt, hitAt + 9);
  const back = ramp(frame, truthAt, truthAt + 18);
  const tIn = spr(frame, fps, truthAt, 115, 0.9);
  const out = ramp(frame, durationInFrames - 9, durationInFrames);
  const MW = 820, MH = 640;

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed ?? mythImg} blur={18} dim={0.62} bokeh={9} seed={71} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.3} camX={cam.camX} camY={cam.camY} z={1}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, opacity: ramp(frame, 0, 12) }}>
            <KickerRule text={kicker} a={ramp(frame, 0, 12)} center />
          </div>
        </Plane>
        {/* MITO: adelante → atrás */}
        <Plane depth={interpolate(back, [0, 1], [0.8, 0.45])} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{
            position: "absolute", left: interpolate(back, [0, 1], [550, 110]), top: interpolate(back, [0, 1], [180, 250]),
            opacity: mIn * interpolate(back, [0, 1], [1, 0.72]),
            transform: `perspective(1600px) rotateY(${interpolate(back, [0, 1], [0, 12]).toFixed(2)}deg) scale(${(interpolate(mIn, [0, 1], [0.9, 1]) * interpolate(back, [0, 1], [1, 0.82])).toFixed(4)})`,
            transformOrigin: "50% 50%",
          }}>
            <GlassPhoto img={mythImg} w={MW} h={MH} blur={back * 2.6} desat={ramp(frame, hitAt + 4, hitAt + 16) * 0.9} dim={back * 0.5}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "80px 34px 30px", background: `linear-gradient(transparent, ${rgba(V.card, 0.97)} 38%)` }}>
                <Chip text="MITO" color={V.danger} ink={V.onAccent} />
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, lineHeight: 1.06, color: V.white, marginTop: 14 }}>{myth}</div>
              </div>
            </GlassPhoto>
            <div style={{ position: "absolute", inset: -40 }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox={`0 0 ${MW + 80} ${MH + 80}`} preserveAspectRatio="none">
                <path d={`M10 ${Math.round(MH * 0.66)} L${MW + 70} 40`} fill="none" stroke={V.danger} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - slash}
                  style={{ filter: `drop-shadow(0 4px 8px rgba(58,42,26,0.35))` }} />
              </svg>
            </div>
          </div>
        </Plane>
        {/* VERDAD: entra desde la derecha, adelante */}
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{
            position: "absolute", left: 890, top: 190, opacity: tIn,
            transform: `translateX(${((1 - tIn) * 260).toFixed(1)}px) perspective(1600px) rotateY(${((1 - tIn) * -22 - 4).toFixed(2)}deg) scale(${interpolate(tIn, [0, 1], [0.86, 1]).toFixed(4)})`,
          }}>
            <GlassPhoto img={truthImg} w={MW + 60} h={MH + 60} glow={V.ok} glowK={ramp(frame, truthAt + 8, truthAt + 24)} push={Math.max(0, frame - truthAt) * 0.0003}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "90px 36px 32px", background: `linear-gradient(transparent, ${rgba(V.card, 0.97)} 36%)` }}>
                <Chip text="VERDAD" color={V.ok} ink={V.onAccent} />
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, lineHeight: 1.05, color: V.white, marginTop: 14 }}>{truth}</div>
              </div>
            </GlassPhoto>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={73} />
    </AbsoluteFill>
  );
};
