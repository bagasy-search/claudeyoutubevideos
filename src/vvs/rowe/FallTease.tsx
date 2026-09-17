// FallTease.tsx — el BUCLE ABIERTO del hook ("one of those four is where most bathroom falls begin").
// 2.5D con el lenguaje de RoweDepth: foto real de la maniobra peligrosa BORROSA y bajo CANDADO en el
// plano medio, anillos ámbar que laten detrás, dos fotos secundarias desenfocadas en el fondo, y en
// el frente el kicker + titular. En `hitAt` el candado tiembla (no se abre: se paga en la zona 4).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, CL, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

const Lock: React.FC<{ size: number; wobble: number }> = ({ size, wobble }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${wobble.toFixed(2)}deg)`, filter: `drop-shadow(0 10px 22px ${rgba("#3A2A1A", 0.35)})` }}>
    <path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke={V.brassSoft} strokeWidth={9} strokeLinecap="round" />
    <rect x="24" y="44" width="52" height="42" rx="10" fill={V.brass} />
    <rect x="24" y="44" width="52" height="42" rx="10" fill="none" stroke={rgba("#ffffff", 0.55)} strokeWidth={1.5} />
    <circle cx="50" cy="62" r="6" fill={V.white} />
    <rect x="47.5" y="64" width="5" height="12" rx="2.5" fill={V.white} />
  </svg>
);

export const FallTease: React.FC<{
  kicker?: string;
  title?: string;
  img?: string;
  sideL?: string;
  sideR?: string;
  bed?: string;
  hitAt?: number;
  durationInFrames?: number;
}> = ({ kicker = "", title = "", img, sideL, sideR, bed, hitAt = 40, durationInFrames = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [hitAt], 0.06, durationInFrames);
  const heroIn = spr(frame, fps, 4, 120, 0.9);
  const sideIn = spr(frame, fps, 0, 140, 0.9);
  const lockIn = spr(frame, fps, 14, 90, 0.7);
  const t = frame - hitAt;
  const wobble = t >= 0 && t < 18 ? Math.sin(t * 1.3) * 16 * (1 - t / 18) : 0;
  const pulse = (frame % 50) / 50;
  const out = ramp(frame, durationInFrames - 9, durationInFrames);

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed ?? img} blur={22} dim={0.66} bokeh={11} seed={91} tint={V.amber} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        {/* fondo: dos fotos secundarias desenfocadas, inclinadas */}
        <Plane depth={0.25} camX={cam.camX} camY={cam.camY} z={1}>
          {sideL ? (
            <div style={{ position: "absolute", left: 90, top: 330, opacity: sideIn * 0.8, transform: `translateX(${((1 - sideIn) * -80).toFixed(1)}px) perspective(1400px) rotateY(22deg)` }}>
              <GlassPhoto img={sideL} w={460} h={340} blur={5} dim={0.5} desat={0.4} />
            </div>
          ) : null}
          {sideR ? (
            <div style={{ position: "absolute", right: 90, top: 380, opacity: sideIn * 0.8, transform: `translateX(${((1 - sideIn) * 80).toFixed(1)}px) perspective(1400px) rotateY(-22deg)` }}>
              <GlassPhoto img={sideR} w={460} h={340} blur={5} dim={0.5} desat={0.4} />
            </div>
          ) : null}
        </Plane>
        {/* anillos ámbar */}
        <Plane depth={0.45} camX={cam.camX} camY={cam.camY} z={2}>
          {[0, 0.5].map((o, k) => {
            const p = (pulse + o) % 1;
            return <div key={k} style={{
              position: "absolute", left: 960, top: 600, width: 620, height: 620, borderRadius: "50%",
              border: `4px solid ${rgba(V.amber, (1 - p) * 0.5)}`, transform: `translate(-50%,-50%) scale(${(0.8 + p * 0.7).toFixed(3)})`,
              boxShadow: `0 0 40px ${rgba(V.amber, (1 - p) * 0.3)}`, opacity: heroIn,
            }} />;
          })}
        </Plane>
        {/* hero: la maniobra, borrosa bajo candado */}
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 960, top: 610, transform: `translate(-50%,-50%) translateY(${interpolate(heroIn, [0, 1], [90, 0]).toFixed(1)}px) perspective(1600px) rotateX(4deg)`, opacity: heroIn }}>
            <GlassPhoto img={img} w={820} h={520} blur={11} dim={0.35} glow={V.amber} glowK={0.6 + 0.4 * Math.sin(frame / 9)} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: lockIn, transform: `scale(${interpolate(lockIn, [0, 1], [1.6, 1], CL).toFixed(3)})` }}>
              <Lock size={170} wobble={wobble} />
            </div>
          </div>
        </Plane>
        {/* frente: texto */}
        <Plane depth={0.95} camX={cam.camX} camY={cam.camY} z={5}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center" }}>
            <KickerRule text={kicker} a={ramp(frame, 4, 18)} color={V.amber} center />
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, color: V.white, marginTop: 12, opacity: ramp(frame, 10, 24), transform: `translateY(${((1 - ramp(frame, 10, 24)) * 16).toFixed(1)}px)` }}>{title}</div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={93} />
    </AbsoluteFill>
  );
};
