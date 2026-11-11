// Escenas sobre fotos · linh01 — escritas de cero para este video (no reusan trucos de dee01: ni rompecabezas, ni franjas, ni ranura, ni almanaque).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FONTS } from "./Piezas";

const { SERIF, SANS } = FONTS;
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" };
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
const Foto: React.FC<{ src: string; clip?: string; style?: React.CSSProperties }> = ({ src, clip, style }) => (
  <Img src={staticFile(src)} style={{ ...FULL, clipPath: clip, ...style }} />
);
const salida = (f: number, dur: number) => interpolate(f, [dur - 8, dur], [1, 0], CL);
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Escena 1 · "$40 machine": la etiqueta de precio cuelga de un hilo, se balancea y un trazo de esmalte la tacha
export const EscPrecio: React.FC<{ src: string; fTag: number; fNo: number; dur: number }> = ({ src, fTag, fNo, dur }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.04, 1.12], { ...CL, easing: Easing.inOut(Easing.sin) });
  const cae = spring({ frame: f - fTag, fps: 30, config: { damping: 7, stiffness: 70, mass: 1 } });
  const swing = Math.sin((f - fTag) / 7) * 14 * Math.exp(-Math.max(0, f - fTag) / 40);
  const tacha = interpolate(f, [fNo, fNo + 9], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const gris = interpolate(f, [fNo + 4, fNo + 18], [0, 1], CL);
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden", opacity: salida(f, dur) }}>
      <Foto src={src} style={{ transform: `scale(${cam})`, filter: `saturate(${1 - 0.6 * gris}) brightness(${1 - 0.2 * gris})` }} />
      {f >= fTag - 2 && (
        <div style={{ position: "absolute", left: 1380, top: -40, transformOrigin: "60px 0px", transform: `translateY(${(cae - 1) * 520}px) rotate(${swing}deg)` }}>
          <div style={{ position: "absolute", left: 58, top: 0, width: 3, height: 230, background: C.paper2 }} />
          <div style={{ position: "absolute", left: -60, top: 222, width: 240, padding: "28px 0 22px", background: C.paper, borderRadius: "12px 12px 18px 18px", boxShadow: "0 18px 40px rgba(0,0,0,0.45)", textAlign: "center" }}>
            <div style={{ position: "absolute", left: 108, top: 12, width: 18, height: 18, borderRadius: 9, background: C.ink, opacity: 0.85 }} />
            <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 6, color: C.indigo, marginTop: 14 }}>AS SEEN ON TV</div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 118, color: C.ink, lineHeight: 1 }}>$40</div>
            <svg width="240" height="140" style={{ position: "absolute", left: 0, top: 40, overflow: "visible" }}>
              <path d="M10 95 C 70 70, 150 60, 232 30" fill="none" stroke={C.ver} strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tacha} />
            </svg>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Escena 2 · el lecho seco: las grietas se dibujan solas sobre el barro y una se pone roja por dentro
const GRIETAS: number[][][] = (() => {
  const out: number[][][] = [];
  for (let g = 0; g < 9; g++) {
    let x = 120 + rnd(g) * 1680, y = 100 + rnd(g + 40) * 880, a = rnd(g + 80) * Math.PI * 2; const pts = [[x, y]];
    for (let k = 0; k < 14; k++) { a += (rnd(g * 31 + k) - 0.5) * 1.1; x += Math.cos(a) * 46; y += Math.sin(a) * 46; pts.push([x, y]); }
    out.push(pts);
  }
  return out;
})();
const ROJA = 4;
export const EscGrietas: React.FC<{ src: string; fRed: number; dur: number }> = ({ src, fRed, dur }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.0, 1.1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const rojo = interpolate(f, [fRed, fRed + 14], [0, 1], CL);
  const pulso = rojo * (0.75 + 0.25 * Math.sin((f - fRed) / 4));
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "960px 560px" }}>
        <Foto src={src} style={{ filter: `brightness(${1 - 0.25 * rojo})` }} />
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {GRIETAS.map((p, i) => {
            const t = interpolate(f, [4 + i * 5, 26 + i * 5], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
            const d = "M" + p.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(" L");
            const r = i === ROJA;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="rgba(18,10,8,0.85)" strokeWidth={r ? 9 : 6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
                {r && rojo > 0 && <path d={d} fill="none" stroke={C.ver} strokeWidth={5} strokeLinejoin="round" opacity={pulso} style={{ filter: `drop-shadow(0 0 ${10 * pulso}px ${C.ver})` }} />}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Escena 3 · la piel blanda se estira y vuelve; la callosa intenta, tiembla y se rompe en dos como goma vieja
const RASGON = Array.from({ length: 13 }, (_, i) => [940 + (rnd(i + 7) - 0.5) * 90, i * 90]);
export const EscGoma: React.FC<{ blanda: string; dura: string; goma: string; fStretch: number; fDura: number; fBreak: number; dur: number }> = ({ blanda, dura, goma, fStretch, fDura, fBreak, dur }) => {
  const f = useCurrentFrame();
  if (f < fDura) {
    const e = spring({ frame: f - fStretch, fps: 30, config: { damping: 5, stiffness: 90 } });
    const sx = f < fStretch ? 1 : 1 + 0.14 * Math.sin(Math.min(1, e) * Math.PI) + (1 - e) * 0.02;
    return (
      <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
        <Foto src={blanda} style={{ transform: `scaleX(${sx}) scaleY(${2 - sx * 0.98})` }} />
        <Etiqueta texto="soft · stretches" f={f - fStretch} />
      </AbsoluteFill>
    );
  }
  const g = f - fDura;
  const intento = interpolate(f, [fDura + 6, fBreak], [0, 1], CL);
  const temblor = f < fBreak ? Math.sin(f * 2.3) * 5 * intento : 0;
  const rompe = interpolate(f, [fBreak, fBreak + 16], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const izq = poly([[0, 0], ...RASGON, [0, 1080]]);
  const der = poly([[1920, 0], ...RASGON, [1920, 1080]]);
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden", opacity: salida(f, dur) }}>
      {rompe > 0 && <Foto src={goma} style={{ transform: `scale(${1.08 - 0.06 * rompe})`, filter: `brightness(${0.6 + 0.4 * rompe})` }} />}
      <AbsoluteFill style={{ transform: `translateX(${temblor - rompe * 720}px) rotate(${-rompe * 7}deg) scaleX(${1 + 0.035 * intento})`, transformOrigin: "0px 540px", opacity: 1 - rompe * 0.9 }}>
        <Foto src={dura} clip={izq} style={{ transform: `scale(${1 + g * 0.0006})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-temblor + rompe * 720}px) rotate(${rompe * 7}deg) scaleX(${1 + 0.035 * intento})`, transformOrigin: "1920px 540px", opacity: 1 - rompe * 0.9 }}>
        <Foto src={dura} clip={der} style={{ transform: `scale(${1 + g * 0.0006})` }} />
      </AbsoluteFill>
      <Etiqueta texto={rompe > 0.3 ? "like an old rubber band" : "thick & dry · can't stretch"} f={rompe > 0.3 ? f - fBreak - 5 : g} />
    </AbsoluteFill>
  );
};
const Etiqueta: React.FC<{ texto: string; f: number }> = ({ texto, f }) => {
  const p = interpolate(f, [0, 10], [0, 1], CL);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, background: C.paper, padding: "14px 30px", borderLeft: `8px solid ${C.ver}`, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, color: C.ink }}>{texto}</span>
    </div>
  );
};
