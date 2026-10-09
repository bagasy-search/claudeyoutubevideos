// Piezas compartidas del kit 2D de Ole (olsup): easing/pop, cama (Bed), remaches, cinta, chapa esmaltada.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, woodBg, hexA, rnd } from "./OleSupTheme";

export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIO = Easing.inOut(Easing.cubic);

export const pop = (f: number, fps: number, at = 0, damping = 14) =>
  spring({ frame: f - at, fps, config: { damping, stiffness: 140, mass: 0.7 } });

export const fadeOut = (f: number, dur: number, n = 10) => interpolate(f, [dur - n, dur], [1, 0], CL);

export const flicker = (f: number, seed = 0) => 1 + 0.045 * Math.sin(f * 0.33 + seed) + 0.03 * Math.sin(f * 0.91 + seed * 2.1);

/** reveal izquierda->derecha; al 100% sin recorte (no corta el voladizo de la letra manuscrita) */
export const clipR = (t: number) => (t >= 99.9 ? "none" : `inset(0 ${100 - t}% 0 0)`);

export const sourceLine = (s: string) => (/^source/i.test(s.trim()) ? s : `Source: ${s}`);

/** Cama de fondo: foto oscurecida/desenfocada suave (velo <= 0,45) o madera de cabaña. */
export const Bed: React.FC<{ src?: string; dim?: number; blur?: number }> = ({ src, dim = 0.36, blur = 7 }) => {
  const f = useCurrentFrame();
  if (!src) {
    return (
      <AbsoluteFill style={{ ...woodBg(OLE.wood2, 3) }}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,190,110,0.10), rgba(10,5,2,0.55) 100%)" }} />
      </AbsoluteFill>
    );
  }
  const s = 1.08 + f * 0.0005;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.wood0 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: `blur(${blur}px)` }} />
      <AbsoluteFill style={{ backgroundColor: `rgba(20,12,6,${Math.min(dim, 0.45)})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(10,5,2,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Rivet: React.FC<{ x: number | string; y: number | string; s?: number }> = ({ x, y, s = 14 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", translate: "-50% -50%", background: "radial-gradient(circle at 35% 30%, #8a847c, #2a2724 70%)", boxShadow: "0 2px 3px rgba(0,0,0,0.6)" }} />
);

export const Tape: React.FC<{ style?: React.CSSProperties; color?: string }> = ({ style, color = OLE.paperEdge }) => (
  <div style={{ position: "absolute", width: 150, height: 44, background: `linear-gradient(180deg, ${hexA(color, 0.92)}, ${hexA(color, 0.7)})`, boxShadow: "0 2px 6px rgba(0,0,0,0.3)", ...style }} />
);

/** Lámina de lata esmaltada azul con borde blanco y desportillados. */
export const EnamelPlate: React.FC<{ w: number | string; h: number | string; radius?: number; seed?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, radius = 26, seed = 1, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: radius, background: `linear-gradient(160deg, #3a63ad, ${OLE.enamel} 55%, #1f3a70)`, border: `7px solid ${OLE.enamelWhite}`, boxShadow: `0 0 0 4px #14264d, 0 18px 34px ${OLE.shadow}, inset 0 0 40px rgba(0,0,0,0.35)`, overflow: "hidden", ...style }}>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: `${rnd(seed * 7 + i) * 96}%`, top: `${rnd(seed * 11 + i + 4) * 96}%`, width: 6 + rnd(seed + i) * 10, height: 5 + rnd(seed + i + 2) * 8, borderRadius: "50%", background: "#1c1a18", opacity: 0.55 }} />
    ))}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.20) 0%, transparent 32%)" }} />
    {children}
  </div>
);

export const Steam: React.FC<{ f: number; x: number; y: number; n?: number }> = ({ f, x, y, n = 3 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f * 0.012 + i / n) % 1);
      return <div key={i} style={{ position: "absolute", left: x + Math.sin(t * 6 + i * 2) * 14 + (i - 1) * 22, top: y - t * 130, width: 46, height: 46, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)", opacity: Math.sin(t * Math.PI) * 0.8, filter: "blur(6px)", scale: String(0.7 + t * 1.3) }} />;
    })}
  </>
);
