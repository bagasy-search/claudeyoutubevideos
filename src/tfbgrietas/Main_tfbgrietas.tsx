// Main_tfbgrietas.tsx — montaje VLOG: los mp4 continuos por escena (agnes-video-2.5-flash) como base,
// la lámina a pantalla completa con zoom punto por punto, QR + portada REALES encima, SFX, audio máster.
// ⛔ OffthreadVideo siempre (nunca <Video>). ⛔ El QR va SIN Ken-Burns, sobre blanco, en la capa de arriba.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { SEGS, LAMINA, CTAS, SFX, TOTAL_FRAMES_TFBGRIETAS } from "./timeline.gen";
export { TOTAL_FRAMES_TFBGRIETAS };

const Lamina: React.FC<{ src: string; dur: number; puntos: { f: number; x: number; y: number; z: number }[] }> = ({ src, dur, puntos }) => {
  const f = useCurrentFrame();
  const keys = puntos.map((p) => p.f);
  const at = (k: "x" | "y" | "z") => (keys.length > 1 ? interpolate(f, keys, puntos.map((p) => p[k]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : puntos[0][k]);
  const z = at("z"), x = at("x"), y = at("y");
  const op = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#E9DABB", opacity: op, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: `${x.toFixed(2)}% ${y.toFixed(2)}%` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ dur: number; qr: string; portada: string }> = ({ dur, qr, portada }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.min(inn, out);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: "0 70px 70px 0", opacity: o }}>
      <div style={{ display: "flex", gap: 26, alignItems: "center", backgroundColor: "#F6EFDD", borderRadius: 26, padding: 22,
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)", transform: `translateY(${(1 - inn) * 40}px)` }}>
        <Img src={staticFile(portada)} style={{ height: 330, borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: 16, borderRadius: 12 }}>
            <Img src={staticFile(qr)} style={{ width: 300, height: 300, display: "block", imageRendering: "pixelated" }} />
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#3A2A1C", fontWeight: 700 }}>Escanea con tu teléfono</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MainTfbgrietas: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    {SEGS.map((s) => (
      <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none">
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    ))}
    <Sequence from={LAMINA.from} durationInFrames={LAMINA.dur} layout="none">
      <Lamina src={LAMINA.src} dur={LAMINA.dur} puntos={LAMINA.puntos} />
    </Sequence>
    {CTAS.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={c.dur} layout="none">
        <Cta dur={c.dur} qr={c.qr} portada={c.portada} />
      </Sequence>
    ))}
    {SFX.map((s) => (
      <Sequence key={s.key} from={s.from} durationInFrames={s.dur} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
    <Audio src={staticFile("tfbgrietas.m4a")} />
  </AbsoluteFill>
);
