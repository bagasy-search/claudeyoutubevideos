// Escenas sobre fotos de stan12s (D:/rtmp/stan12s/ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
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
const GREASE = "#1b1714";

// papel blanco de carnicería con letra a mano, en coordenadas de pantalla
const Papel: React.FC<{ x: number; y: number; t: string; f0: number; size?: number; rot?: number }> = ({ x, y, t, f0, size = 110, rot = -2 }) => {
  const f = useCurrentFrame(); const p = f < f0 ? 0 : Math.min(1, damp(f - f0, 5, 22));
  return <div style={{ position: "absolute", left: x, top: y, padding: "4px 30px 12px", backgroundImage: "linear-gradient(180deg, #FFFDF4 0%, #F3EBD6 100%)", fontFamily: FONTS.HAND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: "#2A1A12", whiteSpace: "nowrap",
    boxShadow: "0 12px 22px rgba(0,0,0,0.45)", opacity: Math.min(1, p * 2), transform: `rotate(${rot}deg) scale(${p})`, transformOrigin: "0 50%" }}>{t}</div>;
};

// papel con principio y fin, en coordenadas de la foto
const PapelT: React.FC<{ x: number; y: number; t: string; f0: number; f1?: number; size?: number; rot?: number }> = ({ x, y, t, f0, f1 = 99999, size = 96, rot = -2 }) => {
  const f = useCurrentFrame(); if (f < f0 || f > f1 + 8) return null;
  const p = Math.min(1, damp(f - f0, 5, 22)) * interpolate(f, [f1, f1 + 8], [1, 0], CL);
  return <div style={{ position: "absolute", left: x, top: y, padding: "4px 28px 12px", backgroundImage: "linear-gradient(180deg, #FFFDF4 0%, #F3EBD6 100%)", fontFamily: FONTS.HAND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: "#2A1A12", whiteSpace: "nowrap",
    boxShadow: "0 12px 22px rgba(0,0,0,0.45)", opacity: Math.min(1, p * 2), transform: `rotate(${rot}deg) scale(${p})`, transformOrigin: "0 50%" }}>{t}</div>;
};

// ── Escena 1 · la cocción entra por las dos caras: dos frentes rectos avanzan a la misma velocidad; en los finos (330–440 y 632–718) se tocan, en el grueso (1305–1495) queda el centro rosado
export const EscCoccion: React.FC<{ src: string; fSame: number; fThin: number; fThick: number; dur: number }> = ({ src, fSame, fThin, fThick, dur }) => {
  const f = useCurrentFrame();
  const B = [[330, 338, 440, 835], [632, 340, 718, 835], [1305, 355, 1495, 835]];
  const d = interpolate(f, [fThin + 6, Math.min(dur - 30, fThick + 50)], [0, 58], { ...CL, easing: Easing.out(Easing.quad) });
  const a = seg(f, fThin - 14, fThin + 16), b = seg(f, fThick - 14, fThick + 18);
  const cx = lerp(lerp(960, 525, a), 1400, b), cy = lerp(540, 590, a), s = lerp(lerp(1.0, 1.5, a), 1.7, b) + 0.05 * (f / dur);
  const cooked = "grayscale(0.78) sepia(0.55) brightness(0.74) contrast(1.05)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#d9d6cf" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {B.map(([x0, y0, x1, y1], i) => { const w = Math.min(d, (x1 - x0) / 2 + 1); if (w <= 0) return null;
          return [0, 1].map((k) => { const L = k ? x1 - w : x0;
            return (
              <div key={i + "-" + k} style={{ position: "absolute", left: L, top: y0, width: w, height: y1 - y0, overflow: "hidden" }}>
                <Img src={staticFile(src)} style={{ ...FULL, left: -L, top: -y0, filter: cooked }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${k ? 270 : 90}deg, rgba(48,24,10,0.75) 0px, rgba(48,24,10,0.25) 14px, rgba(48,24,10,0) 40px)` }} />
              </div>
            ); }); })}
        <PapelT x={390} y={880} t="12 oz" f0={fSame} f1={fThin - 10} size={84} rot={-3} />
        <PapelT x={1300} y={880} t="12 oz" f0={fSame + 6} f1={fThin - 10} size={84} rot={2} />
        <PapelT x={250} y={250} t="gray all the way" f0={fThin + 44} f1={fThick - 6} size={76} rot={-2} />
        <PapelT x={880} y={300} t="still a middle" f0={fThick + 44} size={76} rot={2} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 2 · la cortina: la mitad derecha (1030–1920), espejada, corre sobre la izquierda (0–900) en el mismo lugar; a su paso la banda gris se vuelve rosada
export const EscCortina: React.FC<{ src: string; fOne: number; fMany: number; fFace: number; fBand: number; fThin: number; dur: number }> = ({ src, fOne, fMany, fFace, fBand, fThin, dur }) => {
  const f = useCurrentFrame();
  const a = seg(f, fOne - 12, fOne + 14), b = seg(f, fMany - 12, fMany + 16), c = seg(f, fFace - 10, fFace + 22);
  const cx = lerp(lerp(lerp(960, 450, a), 1470, b), 470, c), cy = lerp(540, 560, c), s = lerp(lerp(1.0, 1.32, a), 1.5, c) + 0.04 * (f / dur);
  const back = seg(f, dur - 46, dur - 12);
  const w = 900 * (seg(f, fThin - 4, fThin + 44) - 0.5 * back);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#14181c" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {w > 0 ? (
          <>
            <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 1080, overflow: "hidden" }}>
              <Img src={staticFile(src)} style={{ ...FULL, transform: "scaleX(-1)" }} />
            </div>
            <div style={{ position: "absolute", left: w - 5, top: 200, width: 10, height: 640, background: "linear-gradient(90deg, rgba(255,250,235,0), rgba(255,250,235,0.95), rgba(255,250,235,0))", boxShadow: "0 0 22px 6px rgba(0,0,0,0.5)" }} />
          </>
        ) : null}
        <PapelT x={150} y={800} t="1 flip" f0={fOne} f1={fFace - 6} size={110} rot={-3} />
        <PapelT x={1180} y={800} t="every 30 sec" f0={fMany} f1={fFace - 6} size={100} rot={2} />
        <PapelT x={60} y={790} t="thick gray band" f0={fBand + 4} f1={fThin - 8} size={84} rot={-2} />
        <PapelT x={60} y={790} t="pink to the edge" f0={fThin + 40} size={84} rot={-2} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 3 · los tajos: cortes verticales caen uno tras otro cruzando la fibra horizontal; cada tajada de 120 px se corre y las líneas largas quedan en tramitos
export const EscTajos: React.FC<{ src: string; fCut: number; fShort: number; fDone: number; dur: number }> = ({ src, fCut, fShort, fDone, dur }) => {
  const f = useCurrentFrame();
  const N = 16, W = 120;
  const z = seg(f, fShort - 12, fShort + 18) - seg(f, fDone - 10, fDone + 20);
  const loose = seg(f, fDone, Math.min(dur - 6, fDone + 40));
  const s = lerp(1.12, 2.3, z) - 0.06 * loose, cx = lerp(960, 900, z), cy = lerp(540, 500, z);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2b1a0e" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <AbsoluteFill style={{ background: "repeating-linear-gradient(92deg, rgba(20,10,4,0.5) 0px, rgba(20,10,4,0) 9px, rgba(255,220,170,0.05) 17px), linear-gradient(180deg,#5a3a20,#3d2613)" }} />
        {Array.from({ length: N }, (_, i) => {
          const c = fCut + i * 4; const g = f < c ? 0 : Math.min(1, damp(f - c, 5, 18));
          const dy = (i % 2 ? 1 : -1) * (24 * g + 30 * loose * ((i * 37) % 5) / 4);
          const dx = (i - 7.5) * (7 * g + 9 * loose);
          const rot = loose * (((i * 53) % 9) - 4) * 0.55;
          return (
            <div key={i} style={{ position: "absolute", left: i * W, top: 0, width: W, height: 1080, overflow: "hidden", transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, boxShadow: g > 0 ? "0 0 0 1px rgba(30,10,6,0.6), 6px 8px 14px rgba(0,0,0,0.55)" : "none" }}>
              <Img src={staticFile(src)} style={{ ...FULL, left: -i * W }} />
            </div>
          );
        })}
        {Array.from({ length: N - 1 }, (_, k) => { const c = fCut + (k + 1) * 4; const o = interpolate(f, [c - 2, c, c + 5], [0, 1, 0], CL);
          return o > 0 ? <div key={k} style={{ position: "absolute", left: (k + 1) * W - 4, top: -40 + (1 - o) * 60, width: 8, height: 1160, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95), rgba(255,255,255,0))", opacity: o }} /> : null; })}
      </AbsoluteFill>
      <Papel x={960} y={90} t="cut every fiber short" f0={fCut + 50} size={100} rot={2} />
      <Papel x={1280} y={230} t="⅛ inch" f0={fShort + 6} size={120} rot={-2} />
    </AbsoluteFill>
  );
};

// ── Escena 4 · el trago: la tapa salada real (260,255–1650,372) baja y desaparece detrás del borde de arriba de la cara cortada; queda el azulejo de atrás y la cara toma un rojo más hondo
export const EscTrago: React.FC<{ src: string; fDrink: number; fTime: number; fDown: number; dur: number }> = ({ src, fDrink, fTime, fDown, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [fDrink, dur - 18], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const FACE = "polygon(205px 374px, 450px 366px, 700px 362px, 1200px 365px, 1500px 378px, 1745px 398px, 1750px 660px, 1700px 700px, 235px 700px, 200px 640px)";
  const TOP = "polygon(150px 236px, 1770px 236px, 1770px 404px, 1500px 384px, 1200px 371px, 700px 368px, 450px 372px, 150px 380px)";
  const s = 1.02 + 0.2 * seg(f, 0, dur), cy = lerp(500, 440, seg(f, 0, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#cfd2d0" }}>
      <AbsoluteFill style={cam(960, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {/* azulejo de atrás donde estaba la tapa: la misma foto corrida 122 px hacia abajo */}
        <AbsoluteFill style={{ clipPath: TOP }}><Img src={staticFile(src)} style={{ ...FULL, top: 122 }} /></AbsoluteFill>
        {/* la tapa salada, que baja */}
        <AbsoluteFill style={{ clipPath: TOP, transform: `translateY(${p * 128}px)` }}><Img src={staticFile(src)} style={FULL} /></AbsoluteFill>
        {/* la cara cortada, por delante: se traga la tapa */}
        <AbsoluteFill style={{ clipPath: FACE }}><Img src={staticFile(src)} style={{ ...FULL, filter: `brightness(${1 - 0.14 * p}) saturate(${1 + 0.22 * p})` }} /></AbsoluteFill>
        <div style={{ position: "absolute", left: 215, top: 372, width: 1530, height: 16, background: "linear-gradient(180deg, rgba(40,0,0,0.45), rgba(40,0,0,0))", opacity: p * (1 - seg(f, dur - 30, dur - 10)), transform: "rotate(0.7deg)", transformOrigin: "0 0" }} />
      </AbsoluteFill>
      <Papel x={940} y={60} t="45 minutes to start" f0={fTime} size={100} rot={2} />
      <Papel x={1180} y={210} t="…then all day" f0={fDown - 18} size={100} rot={-2} />
    </AbsoluteFill>
  );
};
