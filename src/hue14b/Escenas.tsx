// Escenas sobre fotos de hue14b (D:/rtmp/hue14b/ideas.md). Escritas de cero: solo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS } from "./Piezas";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const sf = (s: string) => (s.startsWith("http") || s.startsWith("/") ? s : staticFile(s));

// etiqueta kraft colgada de un hilo desde (x, y): cae con peso y se mece
const Colgada: React.FC<{ x: number; y: number; t: string; f0: number; len?: number }> = ({ x, y, t, f0, len = 120 }) => {
  const f = useCurrentFrame(); if (f < f0) return null;
  const k = spring({ frame: f - f0, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 150 } });
  const sw = Math.exp(-(f - f0) / 26) * Math.cos(((f - f0) / 30) * Math.PI * 2) * 7;
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: len * k, backgroundImage: "repeating-linear-gradient(60deg, #D2B07A 0 4px, #A07B45 4px 7px)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 0, top: len * k - 4, transform: "translateX(-50%)", padding: "14px 32px 18px", whiteSpace: "nowrap", borderRadius: 8, opacity: k > 0.3 ? 1 : 0,
        backgroundColor: "#C9A36A", backgroundImage: "repeating-linear-gradient(17deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px)", boxShadow: "14px 20px 26px rgba(0,0,0,0.45)",
        fontFamily: FONTS.SERIF, fontSize: 64, color: "#2B2118" }}>{t}</div>
    </div>
  );
};

// ── Escena 1 · «Escogía una de adentro de la copa… si esa ya está dulce, todas las de afuera también. Esa es la que manda.»
// Idea elegida: de la naranja verde de adentro (764,517) salen hilos de cáñamo tensos hacia las naranjas maduras de afuera,
// uno por uno; cada hilo, al llegar, ata a esa naranja con un nudo. Una sola fruta decide por todas.
const FRUTA = { x: 764, y: 517, r: 84 };
const AFUERA = [{ x: 1286, y: 307 }, { x: 1479, y: 618 }, { x: 1352, y: 782 }, { x: 1590, y: 829 }, { x: 921, y: 568 }, { x: 872, y: 1027 }];
export const EscMuestra: React.FC<{ src: string; fEsc: number; fAfuera?: number; fManda: number; dur: number }> = ({ src, fEsc, fAfuera, fManda, dur }) => {
  const f = useCurrentFrame();
  const fA = fAfuera && fAfuera > fEsc + 30 ? fAfuera : Math.round(fEsc + (fManda - fEsc) * 0.62);
  // cámara: entra hacia la fruta de adentro, después se abre para que entren las de afuera
  const a = interpolate(f, [0, fA - 10], [0, 1], { ...CL, easing: io });
  const b = interpolate(f, [fA - 10, fA + 40], [0, 1], { ...CL, easing: io });
  const s = 1 + 0.3 * a - 0.24 * b + 0.015 * (f / dur);
  // lazo alrededor de la fruta elegida (se dibuja con una máscara cónica)
  const lazo = interpolate(f, [fEsc + 14, fEsc + 40], [0, 360], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1c2414" }}>
      <AbsoluteFill style={{ transformOrigin: `${FRUTA.x}px ${FRUTA.y}px`, transform: `scale(${s})` }}>
        <Img src={sf(src)} style={FULL} />
        {lazo > 0 && (
          <div style={{ position: "absolute", left: FRUTA.x - FRUTA.r - 10, top: FRUTA.y - FRUTA.r - 10, width: (FRUTA.r + 10) * 2, height: (FRUTA.r + 10) * 2, borderRadius: "50%",
            border: "7px solid #C9A36A", boxShadow: "0 3px 6px rgba(0,0,0,0.45)",
            WebkitMaskImage: `conic-gradient(#000 ${lazo}deg, transparent ${lazo}deg)`, maskImage: `conic-gradient(#000 ${lazo}deg, transparent ${lazo}deg)` }} />
        )}
        {AFUERA.map((p, i) => {
          const f0 = fA + i * 7; if (f < f0) return null;
          const dx = p.x - FRUTA.x, dy = p.y - FRUTA.y, L = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
          const k = interpolate(f, [f0, f0 + 12], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
          const nudo = spring({ frame: f - f0 - 12, fps: 30, config: { damping: 7, stiffness: 220 } });
          const vib = f > f0 + 12 ? Math.exp(-(f - f0 - 12) / 8) * Math.sin((f - f0) * 1.9) * 2.5 : 0;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: FRUTA.x, top: FRUTA.y - 2, width: L * k, height: 5, transformOrigin: "0 50%", transform: `rotate(${ang}deg) translateY(${vib}px)`,
                backgroundImage: "repeating-linear-gradient(60deg, #E2C48E 0 4px, #A07B45 4px 7px)", borderRadius: 3, boxShadow: "0 4px 5px rgba(0,0,0,0.35)" }} />
              {f >= f0 + 12 && <div style={{ position: "absolute", left: p.x - 13, top: p.y - 13, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #E9CF9C, #8C6634)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.5)", transform: `scale(${nudo})` }} />}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <Colgada x={FRUTA.x} y={FRUTA.y + FRUTA.r * s} t="la que manda" f0={fManda - 4} len={150} />
    </AbsoluteFill>
  );
};

// ── Escena 2 · «En lugar de regar cuando la tierra estaba seca a tres centímetros, esperaba a que estuviera seca unos cinco. Y entonces regaba bien, hondo…»
// Idea elegida: la regla REAL de la foto (x 979-1108, y 71-768) es el medidor: una liga roja sube por la regla hasta 3 cm y después a 5;
// en «hondo» la tierra seca del montículo se oscurece de mojada de arriba hacia abajo, hasta el borde de abajo del cuadro.
const PXCM = 23.2, BASE = 768, RX = 979, RW = 129;
export const EscRiego: React.FC<{ src: string; f3: number; f5: number; fHondo: number; dur: number }> = ({ src, f3, f5, fHondo, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, f3 + 10], [0, 1], { ...CL, easing: io });
  const b = interpolate(f, [fHondo - 8, fHondo + 40], [0, 1], { ...CL, easing: io });
  const s = 1 + 0.32 * a - 0.27 * b + 0.012 * (f / dur);
  const cm = f < f3 ? 0 : f < f5 ? 3 * spring({ frame: f - f3, fps: 30, config: { damping: 11, stiffness: 140 } }) : 3 + 2 * spring({ frame: f - f5, fps: 30, config: { damping: 11, stiffness: 140 } });
  const yLiga = BASE - cm * PXCM;
  const moj = interpolate(f, [fHondo, fHondo + 75], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const frente = 300 + moj * 900; // el frente de humedad baja por el montículo
  const mask = `linear-gradient(180deg, #000 ${frente - 160}px, transparent ${frente}px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a2218" }}>
      <AbsoluteFill style={{ transformOrigin: `${RX + RW / 2}px 640px`, transform: `scale(${s})` }}>
        <Img src={sf(src)} style={FULL} />
        {moj > 0 && (
          <Img src={sf(src)} style={{ ...FULL, filter: "brightness(0.58) saturate(1.25) contrast(1.08)", WebkitMaskImage: mask, maskImage: mask,
            clipPath: "polygon(0 300px, 760px 330px, 1150px 330px, 1400px 340px, 1920px 330px, 1920px 1080px, 0 1080px)" }} />
        )}
        {f >= f3 - 2 && (
          <>
            <div style={{ position: "absolute", left: RX - 10, top: yLiga - 7, width: RW + 20, height: 14, borderRadius: 7, background: "linear-gradient(180deg, #D8452E, #8E1F12)", boxShadow: "0 5px 7px rgba(0,0,0,0.5)" }} />
            <div style={{ position: "absolute", left: RX - 14, top: yLiga, width: RW + 28, height: Math.max(0, BASE - yLiga),
              background: "rgba(216,69,46,0.16)", borderLeft: "3px solid rgba(142,31,18,0.6)" }} />
            <div style={{ position: "absolute", left: RX + RW + 26, top: yLiga - 52, padding: "10px 28px 14px", borderRadius: 8, backgroundColor: "#C9A36A",
              boxShadow: "12px 16px 22px rgba(0,0,0,0.45)", fontFamily: FONTS.SERIF, fontSize: 66, color: "#2B2118", whiteSpace: "nowrap",
              transform: `rotate(${-3 + 3 * Math.exp(-Math.max(0, f - (f < f5 ? f3 : f5)) / 10)}deg)` }}>{f < f5 ? "3 cm" : "5 cm"}</div>
          </>
        )}
      </AbsoluteFill>
      {f >= fHondo + 18 && <Colgada x={1400} y={0} t="riego hondo" f0={fHondo + 18} len={210} />}
    </AbsoluteFill>
  );
};
