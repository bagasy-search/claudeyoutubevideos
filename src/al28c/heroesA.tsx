// componentes únicos de al28c (el azulejo que suena hueco) · A: minutos 0-15. Cada uno = lo que se dice en ese segundo, dibujado en código.
import React from "react";
import { AMB, GRN, H, HAND, Head, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---------- piezas comunes ----------
export const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
// azulejo crema de 15x15 con esmalte (brillo que corre), bizcocho en el canto; glow = halo ámbar de "suena hueco"
export const Tile: React.FC<{ x: number; y: number; s: number; tt?: number; rot?: number; glow?: number; col?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, s, tt = 0, rot = 0, glow = 0, col = "#f1ead8", style, children }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, transform: `rotate(${rot}deg)`, borderRadius: s * 0.03, background: `linear-gradient(${120 + 15 * Math.sin(tt * 0.5)}deg, rgba(255,255,255,.55), transparent 32%, transparent 70%, rgba(120,100,70,.12)), ${col}`, boxShadow: `0 ${s * 0.08}px ${s * 0.2}px rgba(0,0,0,.5), inset 0 0 0 ${Math.max(2, s * 0.012)}px rgba(255,255,255,.35), inset 0 -${s * 0.02}px 0 #c9a07a${glow > 0 ? `, 0 0 ${s * 0.35 * glow}px rgba(255,170,70,${0.8 * glow})` : ""}`, ...style }}>{children}</div>
);
// dorso del azulejo: bizcocho con costillas; blobs = pelotitas de adhesivo (0-1 cuánto se ven), full = capa entera
export const TileBack: React.FC<{ x: number; y: number; s: number; blobs?: number; full?: number; ribs?: boolean; rot?: number }> = ({ x, y, s, blobs = 0, full = 0, ribs = true, rot = 0 }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s * 0.03, transform: `rotate(${rot}deg)`, background: "#d39a72", boxShadow: "0 30px 70px rgba(0,0,0,.55)", overflow: "hidden" }}>
    {ribs && Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i + 0.6) * s / 9.6, height: s * 0.025, background: "rgba(120,60,30,.35)" }} />)}
    {full > 0 && <div style={{ position: "absolute", inset: s * 0.04, borderRadius: 6, background: "repeating-linear-gradient(0deg, #9a958a 0px, #9a958a 9px, #8a857a 9px, #8a857a 14px)", clipPath: `inset(0 ${(1 - full) * 100}% 0 0)` }} />}
    {blobs > 0 && [[0.22, 0.22], [0.78, 0.22], [0.22, 0.78], [0.78, 0.78], [0.5, 0.5]].map(([a, b], i) => { const k = cl(blobs * 5 - i); return <div key={i} style={{ position: "absolute", left: a * s - s * 0.1 * k, top: b * s - s * 0.1 * k, width: s * 0.2 * k, height: s * 0.2 * k, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #b9b4a8, #7f7a6f)" }} />; })}
  </div>
);
// onda de sonido: amp alta y lenta = sordo (piedra), aguda y larga = lata
export const Wave: React.FC<{ x: number; y: number; w: number; h: number; p: number; f: number; decay: number; col: string; tt: number }> = ({ x, y, w, h, p, f, decay, col, tt }) => {
  const n = 160, pts = Array.from({ length: n }, (_, i) => { const u = i / (n - 1); if (u > p) return null; const a = Math.exp(-decay * u) * Math.sin(u * f * 6.283 - tt * 6); return `${u * w},${h / 2 + a * h * 0.45}`; }).filter(Boolean).join(" ");
  return <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}><line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="rgba(255,255,255,.12)" strokeWidth={2} /><polyline points={pts} fill="none" stroke={col} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>;
};
// flecha curva dibujada (p 0-1)
export const Arrow: React.FC<{ d: string; p: number; col?: string; w?: number; len?: number }> = ({ d, p, col = AMB, w = 8, len = 900 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}><path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - cl(p))} /></svg>
);
// ---- 0:06 · TOC vs TAC: dos azulejos, el golpe y su onda; el sordo se apaga corto, el hueco vibra largo y agudo ----
export const HSound: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = phys(tt, 0.6, 9, 0.35), b = phys(tt, 2.6, 9, 0.35);
  return <>
    <Head tt={tt} kick="ESCUCHA LA DIFERENCIA" title="TOC  ·  TAC" />
    <Tile x={420} y={420} s={300} tt={tt} style={{ transform: `translateY(${-6 * Math.sin(cl(tt - 0.6) * 30) * Math.exp(-4 * cl(tt - 0.6))}px)` }} />
    <Tile x={420} y={790} s={300} tt={tt} glow={cl(tt - 2.6)} style={{ transform: `translateY(${-10 * Math.sin(cl(tt - 2.6) * 50) * Math.exp(-1.2 * cl(tt - 2.6))}px)` }} />
    <Wave x={640} y={330} w={1100} h={180} p={cl((tt - 0.6) / 1.2)} f={5} decay={6} col={GRN} tt={0} />
    <Wave x={640} y={700} w={1100} h={180} p={cl((tt - 2.6) / 2)} f={22} decay={0.8} col={AMB} tt={tt} />
    <Tag tt={tt} at={1.2} x={1640} y={300} txt="SORDO · PIEDRA" col={GRN} size={38} />
    <Tag tt={tt} at={3.4} x={1640} y={670} txt="A LATA · HUECO" col={AMB} size={38} />
    <div style={{ position: "absolute", left: 300, top: 420, fontFamily: HAND, fontSize: 70, color: TX, opacity: a * (1 - cl(tt - 2)), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * a})` }}>toc</div>
    <div style={{ position: "absolute", left: 300, top: 790, fontFamily: HAND, fontSize: 80, color: AMB, opacity: b, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * b})` }}>tac</div>
  </>;
}}</Stage>;

// ---- 0:21 · DESDE 1979: el almanaque corre los años y el azulejo sigue en la pared "de pura costumbre" ----
export const HSince: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const y = Math.round(1979 + eio(tt, 0.8, 4.5) * 47), sh = cl((tt - 4.6) * 2);
  return <>
    <Head tt={tt} kick="LA COCINA DE DOÑA MARTA" title="PEGADO DE PURA COSTUMBRE" />
    <div style={{ position: "absolute", left: 250, top: 300, display: "grid", gridTemplateColumns: "repeat(5, 150px)", gap: 8 }}>
      {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ position: "relative", width: 150, height: 150, borderRadius: 10, boxShadow: i === 12 ? `0 0 ${40 + 20 * Math.sin(tt * 3)}px 8px ${AMB}` : undefined, outline: i === 12 ? `4px solid ${AMB}` : undefined }}><Tile x={75} y={75} s={150} tt={tt} glow={i === 12 ? 1 : 0} col={i === 12 ? "#f6dca8" : "#f1ead8"} style={i === 12 ? { transform: `rotate(${sh * 2.5 * Math.sin(tt * 9)}deg)` } : undefined} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 1250, top: 330, width: 460, height: 420, borderRadius: 22, background: "#fbf7ee", boxShadow: "0 40px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ height: 100, background: "#2f5d8a", color: TX, fontWeight: 900, fontSize: 36, letterSpacing: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>AÑO</div>
      <div style={{ fontWeight: 900, fontSize: 130, color: y > 2020 ? RED : "#2b2622", textAlign: "center", marginTop: 50, fontVariantNumeric: "tabular-nums" }}>{y}</div>
    </div>
    <Tag tt={tt} at={4.8} x={1480} y={830} txt={`${y - 1979} AÑOS COLGANDO`} col={AMB} size={46} />
  </>;
}}</Stage>;
