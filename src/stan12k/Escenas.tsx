// Escenas sobre fotos de stan12k (D:/rtmp/stan12k/ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
import React from "react";
import { FONTS } from "./Piezas";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const damp = (t: number, tau: number, per: number) => (t <= 0 ? 0 : 1 - Math.exp(-t / tau) * Math.cos((t / per) * Math.PI * 2));
const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });

// ── Escena 1 · cajones: cada franja real de la panceta (carne o grasa) se corre de costado en su palabra y después vuelven a encajar
export const EscCajones: React.FC<{ src: string; fStart: number; fHalf: number; dur: number }> = ({ src, fStart, fHalf, dur }) => {
  const f = useCurrentFrame();
  const B = [[340, 430, 1], [430, 525, -1], [525, 640, 1], [640, 792, -1]];   // carne, grasa, carne, grasa (la tapa de grasa de arriba queda quieta)
  const step = Math.max(6, (fHalf - fStart) / 4);
  const back = seg(f, fHalf + 4, fHalf + 26);
  const s = 1.06 + 0.1 * (f / dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(src)} style={{ ...FULL, filter: "brightness(0.42) saturate(0.8)" }} />
        <Img src={staticFile(src)} style={{ ...FULL, clipPath: "polygon(0px 0px, 1920px 0px, 1920px 340px, 0px 340px)" }} />
        <Img src={staticFile(src)} style={{ ...FULL, clipPath: "polygon(0px 792px, 1920px 792px, 1920px 1080px, 0px 1080px)" }} />
        {B.map(([y0, y1, dir], i) => {
          const out = damp(f - fStart - i * step, 5, 26) * (f >= fStart + i * step ? 1 : 0);
          const x = dir * 300 * out * (1 - back);
          return <Img key={i} src={staticFile(src)} style={{ ...FULL, transform: `translateX(${x}px)`, clipPath: `polygon(0px ${y0}px, 1920px ${y0}px, 1920px ${y1}px, 0px ${y1}px)` }} />;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 2 · remolino: el interior del bol gira sobre su centro (1010,500) cada vez más rápido, el segundero cuenta el minuto y todo se funde en un rosa pálido parejo
export const EscRemolino: React.FC<{ src: string; fStir: number; fPink: number; fReady: number; dur: number }> = ({ src, fStir, fPink, fReady, dur }) => {
  const f = useCurrentFrame();
  const CX = 1010, CY = 500, R = 436;
  const t = Math.max(0, f - fStir);
  const sp = Math.min(34, t * 0.22);                       // grados por cuadro: acelera y se sostiene
  const ang = t < 155 ? 0.11 * t * t : 0.11 * 155 * 155 + 34 * (t - 155);
  const mix = seg(f, fStir + 30, fReady);                  // cuánto se fundió
  const done = seg(f, fReady, fReady + 24);
  const secs = Math.round(interpolate(f, [fStir, fReady], [0, 60], CL));
  const s = lerp(1.0, 1.16, seg(f, 0, fStir + 20)) + 0.05 * (f / dur);
  const circ = `circle(${R}px at ${CX}px ${CY}px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#20201e" }}>
      <AbsoluteFill style={cam(1040, 520, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: circ }}>
          <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${ang}deg)` }} />
          <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${-ang * 0.7 + 120}deg)`, opacity: 0.5 * Math.min(1, sp / 12) }} />
          <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${ang * 1.3 + 240}deg)`, opacity: 0.34 * Math.min(1, sp / 12) }} />
          <div style={{ position: "absolute", left: CX - R, top: CY - R, width: 2 * R, height: 2 * R, borderRadius: "50%", opacity: 0.62 * mix,
            background: "radial-gradient(circle at 42% 38%, #F3D3CC 0%, #EBC3BB 45%, #D9A9A2 78%, #B98C86 100%)" }} />
          <div style={{ position: "absolute", left: CX - R, top: CY - R, width: 2 * R, height: 2 * R, borderRadius: "50%", opacity: 0.5 * mix * (1 - done),
            background: `repeating-conic-gradient(from ${ang}deg, rgba(255,255,255,0.5) 0deg, rgba(255,255,255,0) 24deg, rgba(190,120,120,0.35) 40deg, rgba(255,255,255,0) 60deg)` }} />
        </div>
        <div style={{ position: "absolute", left: 1490, top: 150, padding: "8px 30px 12px", backgroundImage: "linear-gradient(180deg, #EDC2AE 0%, #E2AE97 100%)", boxShadow: "0 10px 20px rgba(0,0,0,0.45)", fontFamily: FONTS.HAND, fontWeight: 700, fontSize: 110, lineHeight: 1, color: "#2A1A12", whiteSpace: "nowrap",
          transform: `rotate(3deg) scale(${seg(f, fStir - 4, fStir + 8)})`, transformOrigin: "0 50%" }}>{secs >= 60 ? "1:00" : `0:${String(secs).padStart(2, "0")}`}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 3 · la fecha: la cámara baja hasta la cinta blanca real de la bolsa (400,200 a 930,330) y la letra de marcador aparece renglón por renglón
export const EscFecha: React.FC<{ src: string; fIn: number; fOut: number; dur: number }> = ({ src, fIn, fOut, dur }) => {
  const f = useCurrentFrame();
  const z = seg(f, 0, Math.max(20, fIn));
  const cx = lerp(960, 690, z), cy = lerp(540, 300, z), s = lerp(1.0, 2.25, z) + 0.12 * (f / dur);
  const w = (f0: number) => `inset(-20% ${100 - seg(f, f0, f0 + 16) * 115}% -20% 0)`;
  const ln: React.CSSProperties = { position: "absolute", left: 428, fontFamily: FONTS.HAND, fontWeight: 700, fontSize: 54, lineHeight: 1, color: "#16120f", whiteSpace: "nowrap", transform: "rotate(-0.6deg)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a2a28" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ ...ln, top: 208, clipPath: w(fIn) }}>IN · Nov 20</div>
        <div style={{ ...ln, top: 268, clipPath: w(fOut) }}>OUT · Nov 27</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 4 · la vuelta: la veladura de sal baja y se frena; la panceta de la foto (300,560 a 1680,812) se da vuelta sobre su eje y la sal vuelve a bajar desde el lado nuevo
export const EscVuelta: React.FC<{ src: string; fTurn: number; dur: number }> = ({ src, fTurn, dur }) => {
  const f = useCurrentFrame();
  const AX = 695;
  const t = seg(f, fTurn, fTurn + 22);
  const sy = Math.cos(t * Math.PI);                        // 1 → −1: la pieza se da vuelta
  const v1 = interpolate(f, [0, Math.max(10, fTurn)], [0.35, 1], CL);
  const v2 = seg(f, fTurn + 22, dur - 4);
  const s = 1.22 + 0.1 * (f / dur);
  const slab = "polygon(290px 556px, 1690px 556px, 1690px 814px, 290px 814px)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1b1a18" }}>
      <AbsoluteFill style={cam(990, 640, s)}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `960px ${AX}px`, transform: `scaleY(${Math.abs(sy) < 0.03 ? 0.03 : sy})`, clipPath: slab }}>
          <Img src={staticFile(src)} style={FULL} />
          {/* la sal que ya bajó desde la cara de arriba (viaja con la pieza al darla vuelta) */}
          <div style={{ position: "absolute", left: 300, top: 640, width: 1380, height: 100 * v1, background: "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)" }} />
        </div>
        {/* después de la vuelta: la sal baja desde la cara nueva de arriba */}
        {t >= 1 && <div style={{ position: "absolute", left: 300, top: 580, width: 1380, height: 30 + 120 * v2, background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 100%)", opacity: seg(f, fTurn + 22, fTurn + 34) }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 5 · la mancha: en el centro de la cara cortada (960,560) aparece un círculo de la misma foto sin color; después se achica hasta desaparecer y la cámara recorre la cara de borde a borde
export const EscMancha: React.FC<{ src: string; fGrey: number; fLook: number; dur: number }> = ({ src, fGrey, fLook, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const grow = spring({ frame: f - fGrey, fps, config: { damping: 12, mass: 0.8 } });
  const gone = seg(f, fLook, fLook + 18);
  const r = 185 * Math.min(1.06, grow) * (1 - gone) * (f >= fGrey ? 1 : 0);
  const z = seg(f, fGrey - 10, fGrey + 20) * (1 - seg(f, fLook, fLook + 24));
  const pan = seg(f, fLook + 10, dur);
  const cx = lerp(lerp(700, 960, seg(f, 0, fGrey)), lerp(520, 1400, pan), seg(f, fLook, fLook + 24));
  const s = 1.18 + 0.38 * z + 0.3 * seg(f, fLook, fLook + 24);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, 560, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {r > 1 && <Img src={staticFile(src)} style={{ ...FULL, filter: "grayscale(1) brightness(0.86) contrast(0.9)", clipPath: `circle(${r}px at 960px 560px)` }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 6 · el fuelle: la foto se corta en sus pliegues reales (x = 370, 590, 810, 1030, 1250, 1470) y las tiras se inclinan una para cada lado y se juntan como un acordeón
export const EscFuelle: React.FC<{ src: string; fFold1: number; fFold2: number; fAcc: number; dur: number }> = ({ src, fFold1, fFold2, fAcc, dur }) => {
  const f = useCurrentFrame();
  const X = [0, 370, 590, 810, 1030, 1250, 1470, 1920];
  const th = 30 * damp(f - fFold1, 6, 30) * (f >= fFold1 ? 1 : 0) + 26 * damp(f - fFold2, 6, 30) * (f >= fFold2 ? 1 : 0) - 44 * seg(f, fAcc + 14, fAcc + 40);
  const a = Math.max(0, Math.min(62, th)), c = Math.cos((a * Math.PI) / 180);
  const total = (X[7] - X[0]) * c;
  let x = 960 - total / 2;
  const s = 1.02 + 0.06 * (f / dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3a3a38" }}>
      <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: "960px 980px", transform: "scale(3.2)", filter: "brightness(0.55)" }} />
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 60%", perspective: 2200 }}>
        {X.slice(0, 7).map((x0, i) => {
          const w = X[i + 1] - x0, left = x; x += w * c;
          const dir = i % 2 ? 1 : -1;
          return (
            <div key={i} style={{ position: "absolute", left, top: 0, width: w, height: 1080, overflow: "hidden", transformOrigin: dir < 0 ? "0% 50%" : "100% 50%", transform: `${dir > 0 ? `translateX(${-(w - w * c)}px) ` : ""}rotateY(${dir * a}deg)`, filter: `brightness(${1 - (dir > 0 ? 0.28 : 0.08) * (a / 62)})` }}>
              <Img src={staticFile(src)} style={{ position: "absolute", left: -x0, top: 0, width: 1920, height: 1080, objectFit: "fill" }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
