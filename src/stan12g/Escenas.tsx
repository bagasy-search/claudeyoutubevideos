// Escenas sobre fotos de stan12g (D:/rtmp/stan12g/ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// cámara que lleva el punto (cx,cy) de la foto al centro con escala s, sin dejar bordes vacíos
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const camT = (cx: number, cy: number, s: number, t: number) => cam(lerp(cx, 960, t), lerp(cy, 540, t), lerp(s, 1, t));

const damp = (t: number, tau: number, per: number) => (t <= 0 ? 0 : 1 - Math.exp(-t / tau) * Math.cos((t / per) * Math.PI * 2));
const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });


const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });

// ── Escena 1 · la foto se entreabre como un libro con el lomo en la línea de grasa real (de 860,110 a 880,720)
export const EscLibro: React.FC<{ src: string; fMap: number; fUnder: number; fCut: number; dur: number }> = ({ src, fMap, fUnder, fCut, dur }) => {
  const f = useCurrentFrame();
  const LX = 885;                                                  // lomo del libro
  const open = seg(f, fMap - 4, fMap + 26) * (1 - seg(f, fCut + 4, fCut + 22));
  const th = 24 * open;
  const down = seg(f, fUnder - 6, fUnder + 30) * (1 - 0.6 * seg(f, fCut + 4, fCut + 30));
  const cx = lerp(960, LX, Math.max(open, down)), cy = lerp(520, 430, down), s = lerp(1.06, 1.55, down) + 0.04 * seg(f, 0, dur);
  const stage: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`, perspective: 1500, perspectiveOrigin: `${LX}px 480px` };
  const hoja = (left: boolean): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${LX}px 540px`, transform: `rotateY(${left ? th : -th}deg)`,
    clipPath: left ? `polygon(0px 0px, ${LX}px 0px, ${LX}px 1080px, 0px 1080px)` : `polygon(${LX}px 0px, 1920px 0px, 1920px 1080px, ${LX}px 1080px)` });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3a2618" }}>
      {/* fondo: la madera del tajo de la propia foto, ampliada */}
      <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: "30px 420px", transform: "scale(5)" }} />
      <div style={stage}>
        <div style={hoja(true)}><Img src={staticFile(src)} style={FULL} /></div>
        <div style={hoja(false)}><Img src={staticFile(src)} style={FULL} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 2 · dos lupas redondas: la propia foto agrandada dentro de un círculo sobre cada hueco real (1290,350 y 1300,700)
export const EscLupas: React.FC<{ src: string; fOne: number; fEach: number; fName: number; dur: number }> = ({ src, fOne, fEach, fName, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const L = [{ x: 1290, y: 350, f0: fOne }, { x: 1300, y: 700, f0: fOne + 16 }];
  const R = 185, Z = 1.55;
  const push = seg(f, 0, fOne) * 0.5 + seg(f, fName, dur) * 0.5;
  const cx = lerp(960, 1220, seg(f, 0, fOne + 10)), cy = lerp(540, 525, seg(f, 0, fOne + 10)), s = 1.04 + 0.2 * push;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {L.map((l, i) => {
          const p = spring({ frame: f - l.f0, fps, config: { damping: 12, mass: 0.7 } });
          if (f < l.f0) return null;
          const r = R * Math.min(1.05, p) * (1 + 0.05 * seg(f, fEach, fEach + 20));
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: l.x - r - 9, top: l.y - r - 9, width: 2 * r + 18, height: 2 * r + 18, borderRadius: "50%", background: "linear-gradient(135deg, #F4F6F7 0%, #8F969C 45%, #E3E6E8 60%, #6C7378 100%)", boxShadow: "0 18px 34px rgba(0,0,0,0.5)" }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `circle(${r}px at ${l.x}px ${l.y}px)` }}>
                <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: `${l.x}px ${l.y}px`, transform: `scale(${Z})` }} />
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
