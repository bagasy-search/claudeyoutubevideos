// Escenas sobre fotos de hue14c (D:/rtmp/hue14c/ideas.md). Escritas de cero: solo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS } from "./Piezas";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const sf = (s: string) => (s.startsWith("http") || s.startsWith("/") ? s : staticFile(s));
// cámara sin bordes vacíos: el corrimiento nunca pasa de lo que sobra al escalar
const cam = (s: number, ux: number, uy: number) => `translate(${ux * (s - 1) * 960}px, ${uy * (s - 1) * 540}px) scale(${s})`;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ── Escena 1 · la prueba del puño. El terrón recortado se aprieta, se desarma en trocitos que caen a la carretilla
// y los dos fallos quedan hundidos en la mezcla de la carretilla como letras apretadas con el dedo.
const TERRON = { x: 990, y: 450, r: 150 };
const TILE = 50;
const TROZOS = (() => {
  const out: { x: number; y: number; i: number }[] = []; let i = 0;
  for (let y = TERRON.y - TERRON.r; y < TERRON.y + TERRON.r; y += TILE)
    for (let x = TERRON.x - TERRON.r; x < TERRON.x + TERRON.r; x += TILE) {
      const cx = x + TILE / 2, cy = y + TILE / 2;
      if (Math.hypot(cx - TERRON.x, cy - TERRON.y) < TERRON.r - 14) out.push({ x, y, i: i++ });
    }
  return out;
})();
const Hundida: React.FC<{ t: string; f0: number; f1: number }> = ({ t, f0, f1 }) => {
  const f = useCurrentFrame(); if (f < f0 || f > f1 + 14) return null;
  const k = interpolate(f, [f0, f0 + 16], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [f1, f1 + 14], [1, 0], CL);
  return (
    <div style={{ position: "absolute", left: 0, width: 1920, top: 975, textAlign: "center", fontFamily: FONTS.SERIF, fontSize: 92, fontWeight: 700, letterSpacing: 2,
      color: "rgba(38,22,12,0.88)", opacity: out, transform: `scale(${1.18 - 0.18 * k})`, clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`,
      textShadow: "0 -3px 2px rgba(0,0,0,0.65), 0 3px 2px rgba(255,214,170,0.28)" }}>{t}</div>
  );
};
export const EscPuno: React.FC<{ src: string; fAprieta: number; fPastel: number; fDesarma: number; fChorrea: number; fBola: number; dur: number }> = ({ src, fAprieta, fPastel, fDesarma, fChorrea, fBola, dur }) => {
  const f = useCurrentFrame(); const S = sf(src);
  const s = interpolate(f, [0, dur], [1.05, 1.14], CL);
  const uy = interpolate(f, [0, fChorrea - 8, fChorrea + 22], [0.35, 0.35, -1], { ...CL, easing: io });
  const ux = interpolate(f, [0, dur], [-0.1, 0.05], CL) + Math.sin(f / 70) * 0.05;
  const apr = spring({ frame: f - fAprieta, fps: 30, config: { damping: 11, mass: 1, stiffness: 120 } });
  const suelta = spring({ frame: f - fPastel, fps: 30, config: { damping: 14 } });
  const sq = 1 - 0.09 * apr + 0.09 * suelta;
  const rompe = f >= fDesarma;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={{ ...FULL, transform: cam(s, ux, uy) }}>
        <Img src={S} style={FULL} />
        {!rompe && (
          <div style={{ ...FULL, clipPath: `circle(${TERRON.r}px at ${TERRON.x}px ${TERRON.y}px)`, transformOrigin: `${TERRON.x}px ${TERRON.y}px`, transform: `scale(${sq})`, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.5))" }}>
            <Img src={S} style={FULL} />
          </div>
        )}
        {rompe && <div style={{ position: "absolute", left: TERRON.x - TERRON.r, top: TERRON.y - TERRON.r, width: TERRON.r * 2, height: TERRON.r * 2, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,18,10,0.55) 0%, rgba(30,18,10,0.25) 55%, rgba(30,18,10,0) 75%)", opacity: interpolate(f, [fDesarma, fDesarma + 20], [0, 1], CL) }} />}
        {rompe && TROZOS.map(({ x, y, i }) => {
          const d = Math.floor(rnd(i) * 10) + Math.floor((y - (TERRON.y - TERRON.r)) / TILE) * 2;
          const t = Math.max(0, f - fDesarma - d);
          const dy = 0.9 * t * t; const dx = (rnd(i + 7) - 0.5) * 3 * t; const rot = (rnd(i + 3) - 0.5) * 14 * t;
          const op = interpolate(y + dy, [900, 1060], [1, 0], CL);
          if (op <= 0) return null;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: TILE, height: TILE, overflow: "hidden", borderRadius: 10 + rnd(i + 1) * 12, opacity: op,
              transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${1 - Math.min(0.35, t / 60)})`, boxShadow: t > 0 ? "0 6px 8px rgba(0,0,0,0.45)" : "none" }}>
              <Img src={S} style={{ ...FULL, left: -x, top: -y }} />
            </div>
          );
        })}
        <Hundida t="muy mojada" f0={fChorrea + 6} f1={fBola - 4} />
        <Hundida t="le falta tezontle" f0={fBola + 6} f1={dur + 30} />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 2 · el vasito en lugar tibio. Una línea de barrido vuelve la cocina imagen térmica: todo frío en azul,
// la placa de arriba del refri tibia en ámbar y, en «estufa», los quemadores encendidos en blanco y rojo.
const VASOS = { x: 1365, y: 470 };
const ESTUFA = { x: 950, y: 370 };
export const EscRefri: React.FC<{ src: string; fRefri: number; fEstufa: number; fTibio: number; fCaliente: number; fCocina: number; dur: number }> = ({ src, fRefri, fEstufa, fTibio, fCaliente, fCocina, dur }) => {
  const f = useCurrentFrame(); const S = sf(src);
  const s = interpolate(f, [0, dur], [1.08, 1.16], CL);
  const ux = interpolate(f, [0, fEstufa - 6, fEstufa + 26], [-0.55, -0.55, 0.15], { ...CL, easing: io });
  const uy = interpolate(f, [0, fEstufa - 6, fEstufa + 13, fEstufa + 26], [0.2, 0.2, 0.45, 0.25], { ...CL, easing: io });
  const barre = interpolate(f, [fTibio - 6, fTibio + 26], [0, 1], { ...CL, easing: io });
  const tibio = interpolate(f, [fRefri, fRefri + 24], [0, 1], CL) * (1 + 0.15 * Math.sin(Math.max(0, f - fCaliente) / 6) * (f > fCaliente ? 1 : 0));
  const quema = interpolate(f, [fEstufa, fEstufa + 18], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }) * (1 + 0.12 * Math.sin(f / 3.2));
  const lectura = (f0: number, x: number, y: number, t: string, c: string) => {
    if (f < f0) return null; const k = spring({ frame: f - f0, fps: 30, config: { damping: 13 } });
    return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * k})`, opacity: k, fontFamily: FONTS.SANS, fontSize: 64, fontWeight: 800,
      color: c, letterSpacing: 1, textShadow: "0 0 18px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.9)" }}>{t}</div>;
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={{ ...FULL, transform: cam(s, ux, uy) }}>
        <Img src={S} style={FULL} />
        <div style={{ ...FULL, clipPath: `inset(0 ${(1 - barre) * 100}% 0 0)` }}>
          <Img src={S} style={{ ...FULL, filter: "grayscale(1) contrast(1.25) brightness(0.72)" }} />
          <div style={{ ...FULL, backgroundColor: "#1B3FB8", mixBlendMode: "color" }} />
          <div style={{ ...FULL, opacity: Math.min(1, tibio), mixBlendMode: "screen",
            background: `radial-gradient(ellipse 470px 170px at ${VASOS.x}px ${VASOS.y}px, rgba(255,176,48,${0.62 * tibio}) 0%, rgba(255,120,30,${0.35 * tibio}) 45%, rgba(255,90,20,0) 100%)` }} />
          <div style={{ ...FULL, opacity: Math.min(1, quema), mixBlendMode: "screen",
            background: `radial-gradient(ellipse 260px 120px at ${ESTUFA.x}px ${ESTUFA.y}px, rgba(255,255,235,${0.95 * quema}) 0%, rgba(255,210,60,${0.8 * quema}) 25%, rgba(240,40,20,${0.7 * quema}) 55%, rgba(200,20,40,0) 100%)` }} />
        </div>
        {barre > 0 && barre < 1 && <div style={{ position: "absolute", top: 0, height: 1080, left: barre * 1920 - 2, width: 4, backgroundColor: "#E8F4FF", boxShadow: "0 0 26px 8px rgba(160,210,255,0.8)" }} />}
        {lectura(fCaliente, VASOS.x, VASOS.y - 230, "≈ 25 °C", "#FFC35A")}
        {lectura(fCocina, ESTUFA.x, ESTUFA.y - 190, "se cocina", "#FF5A3C")}
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 3 · pinchar la punta. Lo nítido se ve por una ventana con la forma de la planta: primero una ranura del tallo,
// después brazos a la altura de los nudos reales y, en «flores», un círculo en la punta de cada brazo.
const Ventana: React.FC<{ S: string; x: number; y: number; a: number; L: number; t: number }> = ({ S, x, y, a, L, t }) => {
  if (L <= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y - t / 2, width: L, height: t, transformOrigin: `0 ${t / 2}px`, transform: `rotate(${a}deg)`, overflow: "hidden", borderRadius: t / 2,
      boxShadow: "0 0 34px 6px rgba(255,236,190,0.28)" }}>
      <div style={{ position: "absolute", left: 0, top: t / 2, width: 0, height: 0, transformOrigin: "0 0", transform: `rotate(${-a}deg)` }}>
        <Img src={S} style={{ ...FULL, left: -x, top: -y }} />
      </div>
    </div>
  );
};
const Ojo: React.FC<{ S: string; x: number; y: number; r: number }> = ({ S, x, y, r }) => r <= 1 ? null : (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 40px 10px rgba(255,240,200,0.4)" }}>
    <Img src={S} style={{ ...FULL, left: -(x - r), top: -(y - r), filter: "brightness(1.18) saturate(1.15)" }} />
  </div>
);
const NUDOS = [
  { x: 963, y: 420, tx: 600, ty: 420 }, { x: 963, y: 420, tx: 1284, ty: 470 },
  { x: 963, y: 640, tx: 740, ty: 725 }, { x: 963, y: 640, tx: 1170, ty: 620 },
];
export const EscPunta: React.FC<{ src: string; fTallo: number; fRamas: number; fFlores: number; dur: number }> = ({ src, fTallo, fRamas, fFlores, dur }) => {
  const f = useCurrentFrame(); const S = sf(src);
  const s = interpolate(f, [0, dur], [1.04, 1.11], CL);
  const ux = Math.sin(f / 55) * 0.12; const uy = interpolate(f, [0, dur], [0.15, -0.1], CL);
  const tallo = interpolate(f, [0, fTallo + 18], [0, 1], { ...CL, easing: io });
  const fondo = interpolate(f, [0, 14], [0, 1], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={{ ...FULL, transform: cam(s, ux, uy) }}>
        <Img src={S} style={FULL} />
        <Img src={S} style={{ ...FULL, opacity: fondo, filter: "blur(9px) brightness(0.42) saturate(0.6)" }} />
        <Ventana S={S} x={963} y={905} a={-90} L={610 * tallo} t={96} />
        {NUDOS.map((n, i) => {
          const k = spring({ frame: f - fRamas - i * 5, fps: 30, config: { damping: 12, mass: 1, stiffness: 110 } });
          const L = Math.hypot(n.tx - n.x, n.ty - n.y) * k; const a = (Math.atan2(n.ty - n.y, n.tx - n.x) * 180) / Math.PI;
          return <Ventana key={i} S={S} x={n.x} y={n.y} a={a} L={L} t={118} />;
        })}
        {NUDOS.map((n, i) => {
          const k = spring({ frame: f - fFlores - i * 4, fps: 30, config: { damping: 10, mass: 0.8, stiffness: 140 } });
          return <Ojo key={"o" + i} S={S} x={n.tx} y={n.ty} r={105 * k} />;
        })}
      </div>
    </AbsoluteFill>
  );
};
