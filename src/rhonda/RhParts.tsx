// Piezas compartidas del kit Rhonda: cama (foto o clip real del baño DEBAJO de cada componente: los gráficos viven
// dentro del mundo, nunca sobre negro), cinta de pintor, sello, tarjeta con sombra, entrada con resorte.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RH, LABEL, rnd, hexA } from "./RhTheme";

export const pop = (f: number, fps: number, at = 0, damping = 14) => spring({ frame: f - at, fps, config: { damping, stiffness: 140, mass: 0.7 } });
export const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// cama: foto (Ken-Burns lento) o clip (OffthreadVideo, mudo). dim = cuánto se aclara para que el gráfico lea (0 = nada)
export const Bed: React.FC<{ src?: string; seed?: number; dim?: number; blur?: number }> = ({ src, seed = 1, dim = 0.12, blur = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], { extrapolateRight: "clamp" });
  const inn = rnd(seed) > 0.5, z = inn ? 1.04 + 0.05 * k : 1.09 - 0.05 * k;
  const st: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z), transformOrigin: `${30 + 40 * rnd(seed + 3)}% ${30 + 40 * rnd(seed + 5)}%`, filter: blur ? `blur(${blur}px)` : undefined };
  if (!src) return <AbsoluteFill style={{ backgroundColor: RH.white, ...tileBg() }} />;
  // "broll/x.mp4#270" = clip de 270 cuadros: si el componente dura más, la cama se RALENTIZA (nunca bucle ni cuadro congelado)
  const [file, nf] = src.split("#"); const rate = nf ? Math.max(0.35, Math.min(1, (+nf - 2) / Math.max(1, durationInFrames))) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}>
      {/\.mp4$/.test(file) ? <OffthreadVideo src={staticFile(file)} muted playbackRate={rate} style={st} /> : <Img src={staticFile(file)} style={st} />}
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: hexA(RH.white, dim) }} /> : null}
    </AbsoluteFill>
  );
};

// azulejo de subte en CSS (fondo de pared de baño, sin imágenes)
export const tileBg = (w = 150, h = 75): React.CSSProperties => ({
  backgroundColor: RH.tile,
  backgroundImage: `linear-gradient(${RH.grout} 3px, transparent 3px), linear-gradient(90deg, ${RH.grout} 3px, transparent 3px)`,
  backgroundSize: `${w}px ${h}px, ${w}px ${h * 2}px`,
  backgroundPosition: `0 0, 0 0`,
});

export const Tape: React.FC<{ x: number; y: number; rot?: number; w?: number }> = ({ x, y, rot = -6, w = 130 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 34, background: hexA(RH.yellowSoft, 0.85), rotate: `${rot}deg`, boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />
);

// sello de goma (entra con golpe): rojo SÓLO si es alerta
export const Stamp: React.FC<{ text: string; at?: number; color?: string; x?: number | string; y?: number | string; rot?: number; size?: number }> = ({ text, at = 10, color = RH.blueDeep, x = "50%", y = "50%", rot = -9, size = 56 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < at) return null;
  const p = pop(f, fps, at, 9); const s = interpolate(p, [0, 1], [2.2, 1]);
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(s), opacity: Math.min(1, p * 1.6), border: `7px solid ${color}`, borderRadius: 12, padding: "8px 26px", color, fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 4, textTransform: "uppercase", whiteSpace: "nowrap", mixBlendMode: "multiply", background: hexA("#ffffff", 0.35) }}>{text}</div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: RH.white, borderRadius: 18, boxShadow: `0 22px 50px ${RH.shadow}, 0 2px 0 rgba(255,255,255,0.8) inset`, ...style }}>{children}</div>
);

// salida suave al final de cualquier componente
export const useOut = (n = 8) => { const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); return lin(f, durationInFrames - n, durationInFrames, 1, 0); };
