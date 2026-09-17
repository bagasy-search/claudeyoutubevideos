// RedFlags.tsx — "cuándo ir al médico" como escena de profundidad: la FOTO hero (el examen de la piel)
// flota a la izquierda en vidrio con un anillo ÁMBAR que late; a la derecha caen placas de vidrio
// numeradas, una por señal, cuando el doctor la dice; al final el SELLO "see your doctor" golpea
// (temblor de cámara) y las placas se apagan un punto para que el sello mande.
import React from "react";
import { VAL } from "../valeria/theme";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./ValDepth";

export const RedFlags: React.FC<{
  kicker?: string;
  img?: string;
  bed?: string;
  flags?: { text: string; at: number }[];
  stamp?: string;
  stampAt?: number;
  durationInFrames?: number;
}> = ({ kicker = "", img, bed, flags = [], stamp = "", stampAt = 99999, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [stampAt, ...flags.map((f) => f.at)], 0.05, durationInFrames);
  const heroIn = spr(frame, fps, 0, 120, 0.9);
  const pulse = (frame % 45) / 45;
  const stampK = spr(frame, fps, stampAt, 90, 0.6);
  const after = ramp(frame, stampAt, stampAt + 10);
  const out = ramp(frame, durationInFrames - 9, durationInFrames);

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed ?? img} blur={20} dim={0.64} bokeh={10} seed={51} tint={V.amber} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "40% 50%" }}>
        {/* anillo ámbar que late detrás de la foto (plano medio) */}
        <Plane depth={0.45} camX={cam.camX} camY={cam.camY} z={1}>
          {[0, 0.5].map((o, k) => {
            const p = (pulse + o) % 1;
            return <div key={k} style={{
              position: "absolute", left: 520, top: 560, width: 560, height: 560, borderRadius: "50%",
              border: `4px solid ${rgba(V.amber, (1 - p) * 0.55)}`, transform: `translate(-50%,-50%) scale(${(0.8 + p * 0.7).toFixed(3)})`,
              boxShadow: `0 0 40px ${rgba(V.amber, (1 - p) * 0.35)}`, opacity: heroIn,
            }} />;
          })}
        </Plane>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 150, top: 250, opacity: heroIn, transform: `translateY(${interpolate(heroIn, [0, 1], [80, 0]).toFixed(1)}px) perspective(1600px) rotateY(9deg) rotateZ(-2deg)` }}>
            <GlassPhoto img={img} w={740} h={600} push={frame * 0.0003} dim={after * 0.35} />
          </div>
        </Plane>
        <Plane depth={0.85} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 990, top: 150, width: 800 }}>
            <KickerRule text={kicker} a={ramp(frame, 4, 18)} color={V.amber} />
            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 30 }}>
              {flags.map((f, i) => {
                const k = spr(frame, fps, f.at, 120, 0.8);
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 24, padding: "24px 30px", borderRadius: 22,
                    background: `linear-gradient(135deg, ${rgba(VAL.card, 0.98)}, ${rgba(VAL.paperWarm, 0.98)})`,
                    border: `1px solid ${rgba(VAL.terracotta, 0.45)}`,
                    boxShadow: `0 26px 50px ${rgba(VAL.ink, 0.22)}, inset 0 1px 0 ${rgba("#fff", 0.07)}`,
                    opacity: k * (1 - after * 0.35), transform: `translateX(${((1 - k) * 90).toFixed(1)}px) perspective(1400px) rotateY(${((1 - k) * -18).toFixed(2)}deg)`,
                  }}>
                    <div style={{ width: 64, height: 64, flex: "0 0 64px", borderRadius: "50%", background: VAL.terracotta, color: VAL.onAccent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_BODY, fontWeight: 800, fontSize: 34, boxShadow: `0 0 26px ${rgba(V.amber, 0.5)}` }}>{i + 1}</div>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 1.05, color: V.white }}>{f.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Plane>
        {stamp ? (
          <Plane depth={1} camX={cam.camX} camY={cam.camY} z={5}>
            <div style={{ position: "absolute", left: 1390, top: 880, transform: `translate(-50%,-50%) rotate(-4deg) scale(${interpolate(stampK, [0, 1], [2.2, 1]).toFixed(3)})`, opacity: Math.min(1, stampK * 1.5) }}>
              <div style={{ padding: "18px 44px", borderRadius: 16, background: V.danger, border: `3px solid ${rgba("#fff", 0.75)}`, boxShadow: `0 24px 60px ${rgba(VAL.ink, 0.25)}, 0 0 50px ${rgba(V.danger, 0.5)}` }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: 4, color: VAL.onAccent, textTransform: "uppercase", whiteSpace: "nowrap" }}>{stamp}</div>
              </div>
            </div>
          </Plane>
        ) : null}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={53} />
    </AbsoluteFill>
  );
};
