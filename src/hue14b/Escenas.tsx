// Escenas sobre fotos de hue14b (D:/rtmp/hue14b/ideas.md). Escritas de cero: solo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS } from "./Piezas";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sf = (s: string) => (s.startsWith("http") || s.startsWith("/") ? s : staticFile(s));

// etiqueta kraft colgada de un hilo desde (x, y): cae con peso y se mece
const Colgada: React.FC<{ x: number; y: number; t: string; f0: number; len?: number; size?: number }> = ({ x, y, t, f0, len = 120, size = 64 }) => {
  const f = useCurrentFrame(); if (f < f0) return null;
  const k = spring({ frame: f - f0, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 150 } });
  const sw = Math.exp(-(f - f0) / 26) * Math.cos(((f - f0) / 30) * Math.PI * 2) * 7;
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: len * k, backgroundImage: "repeating-linear-gradient(60deg, #D2B07A 0 4px, #A07B45 4px 7px)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 0, top: len * k - 4, transform: "translateX(-50%)", padding: "14px 32px 18px", whiteSpace: "nowrap", borderRadius: 8, opacity: k > 0.3 ? 1 : 0,
        backgroundColor: "#C9A36A", backgroundImage: "repeating-linear-gradient(17deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px)", boxShadow: "14px 20px 26px rgba(0,0,0,0.45)",
        fontFamily: FONTS.SERIF, fontSize: size, color: "#2B2118" }}>{t}</div>
    </div>
  );
};

// ── Escena 1 · «Escogía una de adentro de la copa… si esa ya está dulce, todas las de afuera también. Esa es la que manda.»
// Idea elegida (vuelta 2): la cámara entra en curva desde la copa soleada hasta la naranja verde de adentro (764,517), que recibe
// un foco cálido suave; en «todas las de afuera» salen hilos de cáñamo gruesos, de a uno, que se anudan SOBRE cada naranja madura.
const FRUTA = { x: 764, y: 517, r: 84 };
const AFUERA = [{ x: 921, y: 568 }, { x: 1286, y: 307 }, { x: 1352, y: 782 }, { x: 1479, y: 618 }, { x: 1590, y: 829 }];
const CANAMO = "repeating-linear-gradient(65deg, #E8CB92 0 5px, #9C7440 5px 9px)";
export const EscMuestra: React.FC<{ src: string; fEsc: number; fAfuera?: number; fManda: number; dur: number }> = ({ src, fEsc, fAfuera, fManda, dur }) => {
  const f = useCurrentFrame();
  const fA = fAfuera && fAfuera > fEsc + 30 ? fAfuera : Math.round(fEsc + (fManda - fEsc) * 0.62);
  // cámara: arranca abierta sobre las de afuera y entra en curva a la de adentro; en «afuera» se abre otra vez
  const a = interpolate(f, [0, fA - 6], [0, 1], { ...CL, easing: io });
  const b = interpolate(f, [fA - 6, fA + 36], [0, 1], { ...CL, easing: io });
  const cx = lerp(lerp(1150, 790, a), 1080, b), cy = lerp(lerp(560, 520, a), 600, b) - 40 * Math.sin(a * Math.PI) * (1 - b);
  const s0 = lerp(lerp(1.08, 1.55, a), 1.12, b) + 0.01 * (f / dur);
  const s = Math.max(s0, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy));
  const foco = interpolate(f, [fEsc + 20, fEsc + 44], [0, 1], { ...CL, easing: io });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1c2414" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})` }}>
        <Img src={sf(src)} style={FULL} />
        {foco > 0 && <div style={{ position: "absolute", left: FRUTA.x - 260, top: FRUTA.y - 260, width: 520, height: 520, borderRadius: "50%", opacity: foco * 0.9,
          background: "radial-gradient(circle, rgba(255,214,140,0.42) 0%, rgba(255,200,120,0.18) 45%, rgba(255,200,120,0) 72%)", mixBlendMode: "screen" }} />}
        {AFUERA.map((p, i) => {
          const f0 = fA + i * 8; if (f < f0) return null;
          const dx = p.x - FRUTA.x, dy = p.y - FRUTA.y, L = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
          const k = interpolate(f, [f0, f0 + 12], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
          const nudo = spring({ frame: f - f0 - 12, fps: 30, config: { damping: 8, stiffness: 200, mass: 0.8 } });
          const vib = f > f0 + 12 ? Math.exp(-(f - f0 - 12) / 8) * Math.sin((f - f0) * 1.9) * 3 : 0;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: FRUTA.x, top: FRUTA.y - 5, width: L * k, height: 10, transformOrigin: "0 50%", transform: `rotate(${ang}deg) translateY(${vib}px)`,
                backgroundImage: CANAMO, borderRadius: 5, boxShadow: "0 6px 6px rgba(0,0,0,0.4)" }} />
              {f >= f0 + 12 && <div style={{ position: "absolute", left: p.x - 20, top: p.y - 16, width: 40, height: 32, borderRadius: "45% 55% 50% 50%", transform: `scale(${nudo}) rotate(${ang}deg)`,
                backgroundImage: CANAMO, boxShadow: "0 5px 6px rgba(0,0,0,0.5)" }} />}
            </React.Fragment>
          );
        })}
        {f >= fA && <div style={{ position: "absolute", left: FRUTA.x - 22, top: FRUTA.y - 18, width: 44, height: 36, borderRadius: "50%", backgroundImage: CANAMO, boxShadow: "0 5px 6px rgba(0,0,0,0.5)" }} />}
        <Colgada x={FRUTA.x} y={FRUTA.y + FRUTA.r - 6} t="la que manda" f0={fManda - 4} len={70} size={56} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 2 · «En lugar de regar cuando la tierra estaba seca a tres centímetros, esperaba a que estuviera seca unos cinco. Y entonces regaba bien, hondo…»
// Idea elegida (vuelta 2): la regla REAL de la foto (x 979-1108, y 71-768) es el medidor. La cámara se acerca en curva a la regla;
// una liga roja la abraza y sube a 3 cm y después a 5; en «hondo» la cámara se abre y la tierra se moja de arriba hacia abajo
// con un frente irregular; la regla queda encima, seca. «riego hondo» cae como etiqueta y se apoya en la tierra.
const PXCM = 23.2, BASE = 768, RX = 979, RW = 129;
const KRAFT: React.CSSProperties = { borderRadius: 8, backgroundColor: "#C9A36A", backgroundImage: "repeating-linear-gradient(17deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px)", fontFamily: FONTS.SERIF, color: "#2B2118", whiteSpace: "nowrap" };
export const EscRiego: React.FC<{ src: string; f3: number; f5: number; fHondo: number; dur: number }> = ({ src, f3, f5, fHondo, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, f3 - 4], [0, 1], { ...CL, easing: io });
  const b = interpolate(f, [fHondo - 10, fHondo + 30], [0, 1], { ...CL, easing: io });
  const cx = lerp(lerp(1000, 1060, a), 980, b), cy = lerp(lerp(560, 690, a), 560, b) + 30 * Math.sin(a * Math.PI) * (1 - b);
  const s = lerp(lerp(1.04, 1.9, a), 1.06, b) + 0.01 * (f / dur);
  const cm = f < f3 ? 0 : f < f5 ? 3 * spring({ frame: f - f3, fps: 30, config: { damping: 11, stiffness: 140 } }) : 3 + 2 * spring({ frame: f - f5, fps: 30, config: { damping: 11, stiffness: 140 } });
  const yLiga = BASE - cm * PXCM;
  const moj = interpolate(f, [fHondo, fHondo + 80], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const fr = 330 + moj * 820; // frente de humedad
  const pts = Array.from({ length: 17 }).map((_, i) => { const y = fr + 34 * Math.sin(i * 1.7 + 0.6) + 22 * Math.sin(i * 0.9 + 2); return `${i * 120}px ${Math.max(330, y)}px`; }).reverse();
  const clip = `polygon(0 330px, 1920px 330px, ${pts.join(", ")})`;
  const tag = spring({ frame: f - fHondo - 24, fps: 30, config: { damping: 10, mass: 1.1, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a2218" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})` }}>
        <Img src={sf(src)} style={FULL} />
        {moj > 0 && <div style={{ position: "absolute", inset: 0, clipPath: clip, background: "linear-gradient(180deg, rgba(70,42,20,0.62), rgba(60,36,18,0.5))", mixBlendMode: "multiply" }} />}
        {moj > 0 && <Img src={sf(src)} style={{ ...FULL, clipPath: `polygon(${RX}px 71px, ${RX + RW}px 71px, ${RX + RW}px ${BASE + 6}px, ${RX}px ${BASE + 6}px)` }} />}
        {f >= f3 - 2 && (
          <>
            <div style={{ position: "absolute", left: RX - 4, top: yLiga - 7, width: RW + 8, height: 14, borderRadius: 6, background: "linear-gradient(180deg, #E0503A, #9E2414 70%, #6E150B)", boxShadow: "0 6px 6px rgba(0,0,0,0.45)" }} />
            <div style={{ ...KRAFT, position: "absolute", left: RX + RW + 22, top: yLiga - 46, padding: "8px 24px 12px", boxShadow: "10px 14px 18px rgba(0,0,0,0.45)", fontSize: 52,
              transform: `rotate(${-3 + 3 * Math.exp(-Math.max(0, f - (f < f5 ? f3 : f5)) / 10)}deg)` }}>{f < f5 ? "3 cm" : "5 cm"}</div>
          </>
        )}
        {f >= fHondo + 24 && (
          <div style={{ ...KRAFT, position: "absolute", left: 1150, top: 700, padding: "14px 34px 18px", fontSize: 68,
            transform: `translateY(${(1 - tag) * -420}px) rotate(${-6 + 4 * (1 - tag)}deg)`, boxShadow: `${10 * tag}px ${12 * tag}px 14px rgba(0,0,0,${0.25 + 0.3 * tag})` }}>riego hondo</div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
