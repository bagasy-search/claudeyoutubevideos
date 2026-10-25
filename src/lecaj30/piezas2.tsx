// chcarnitas · PIEZAS PROPIAS de las carnitas (el resto del kit viene de piezas.tsx). Mismo lenguaje de rancho, todas con at().
import React from "react";
import { CH, HAND, SERIF, e, ei, spr } from "./lib";
import { Card, H, Ok, No } from "./piezas";

type B = { t: number; at: number; out: number };
const vis = (t: number, at: number, out: number) => ({ k: Math.min(1.1, spr(t, at, 1.1)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const hand = (s: number, c: string = CH.crema): React.CSSProperties => ({ fontFamily: HAND, fontWeight: 700, fontSize: s, color: c });

// el trozo de 6 cm junto a un huevo grande, con su regla
export const Trozo6: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const r = e(t, at + 0.2, at + 1.1);
  return <Card t={t} at={at} out={out} x={x} y={y} pad="22px 36px">
    <div style={{ display: "flex", alignItems: "flex-end", gap: 46, justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}><svg width={190} height={170} viewBox="0 0 120 108"><path d="M 14 30 L 52 10 L 104 22 L 110 70 L 70 98 L 18 84 Z" fill="#d8b4a0" /><path d="M 14 30 L 52 10 L 104 22 L 66 40 Z" fill="#f1e4d6" /><path d="M 66 40 L 104 22 L 110 70 L 70 98 Z" fill="#c8988a" /></svg><div style={hand(44)}>el trozo</div></div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CH.maiz, alignSelf: "center" }}>=</div>
      <div style={{ textAlign: "center", opacity: e(t, at + 0.5, at + 0.8) }}><svg width={130} height={170} viewBox="0 0 100 130"><path d="M 50 6 C 86 6 96 80 90 100 C 84 122 16 122 10 100 C 4 80 14 6 50 6 Z" fill="#f6ecd8" /></svg><div style={hand(44)}>un huevo grande</div></div>
    </div>
    <div style={{ position: "relative", height: 46, marginTop: 14, borderRadius: 6, background: "#e8d2a0", overflow: "hidden" }}>
      {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i / 12) * 100}%`, top: 0, width: 3, height: i % 2 ? 14 : 26, background: CH.tinta }} />)}
      <div style={{ position: "absolute", left: 0, top: 26, height: 14, width: `${r * 100}%`, background: CH.guinda }} />
    </div>
    <div style={{ textAlign: "center", marginTop: 8 }}><H s={62} c={CH.maiz}>{(6 * r).toFixed(0)} cm</H></div>
  </Card>;
};

// el ruido de la olla: burbujeo grueso (agua) → chisporroteo finito (pura grasa)
export const Ruido: React.FC<B & { x: number; y: number; swapAt: number }> = ({ t, at, out, x, y, swapAt }) => {
  const sw = ei(t, swapAt, swapAt + 0.8);
  const pts = Array.from({ length: 120 }, (_, i) => {
    const u = i / 119, a = Math.sin(u * 14 + t * 5) * 70 * (1 - sw) + Math.sin(u * 95 + t * 40) * 26 * sw * (0.6 + 0.4 * Math.sin(u * 300 + t * 70));
    return `${(u * 760).toFixed(1)},${(90 + a).toFixed(1)}`;
  }).join(" ");
  return <Card t={t} at={at} out={out} x={x} y={y} pad="20px 30px">
    <svg width={760} height={180}><polyline points={pts} fill="none" stroke={sw > 0.5 ? CH.maiz : "#d9e4ea"} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" /></svg>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 30 }}>
      <span style={{ ...hand(46, "#d9e4ea"), opacity: 1 - 0.6 * sw }}>burbujeo grueso: agua</span>
      <span style={{ ...hand(46, CH.maiz), opacity: sw }}>chisporroteo finito ✓</span>
    </div>
  </Card>;
};

// la prueba del tenedor: entra sin empujar / hay que empujarlo
export const Tenedor: React.FC<B & { x: number; y: number; badAt: number }> = ({ t, at, out, x, y, badAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const box = (ok: boolean, a: number) => {
    const d = ei(t, a, a + 0.8) * (ok ? 1 : 0.35);
    return <div key={ok ? 1 : 0} style={{ textAlign: "center", padding: "16px 24px", borderRadius: 18, background: "rgba(38,16,10,.9)", boxShadow: `0 26px 50px rgba(0,0,0,.55), inset 0 0 0 3px ${ok ? "#9ad35a" : "#ff5a3c"}88`, opacity: e(t, a - 0.1, a + 0.15) }}>
      <svg width={260} height={230} viewBox="0 0 130 115">
        <ellipse cx={65} cy={86} rx={52} ry={22} fill={ok ? "#c4844a" : "#a86a3a"} />
        <g transform={`translate(65 ${-6 + 70 * d})`}><rect x={-3} y={-60} width={6} height={52} rx={3} fill="#c8c8c8" />{[-9, -3, 3, 9].map((dx) => <rect key={dx} x={dx - 1.5} y={-10} width={3} height={22} rx={1.5} fill="#d8d8d8" />)}</g>
      </svg>
      <H s={46} c={ok ? "#bfe88a" : "#ff8a6a"}>{ok ? "ENTRA SOLITO" : "HAY QUE EMPUJAR"} {ok ? <Ok t={t} at={a + 0.6} s={50} /> : <No t={t} at={a + 0.6} s={50} />}</H>
      <div style={hand(40)}>{ok ? "ya está" : "le falta: espérala"}</div>
    </div>;
  };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>{box(true, at)}{box(false, badAt)}</div>;
};

// el color: sin naranja café opaco · con naranja dorado de cobre
export const ColorCobre: React.FC<B & { x: number; y: number; goodAt: number }> = ({ t, at, out, x, y, goodAt }) => {
  const g = ei(t, goodAt, goodAt + 0.9);
  const pz = (c: string, shine: number) => <svg width={200} height={150} viewBox="0 0 120 90">{[0, 1, 2].map((k) => <path key={k} transform={`translate(${12 + k * 32} ${20 + (k % 2) * 16})`} d="M 0 14 L 18 0 L 40 8 L 38 34 L 16 42 L 2 32 Z" fill={c} />)}{shine > 0 && [0, 1, 2].map((k) => <ellipse key={"s" + k} cx={26 + k * 32} cy={30 + (k % 2) * 16} rx={7} ry={3} fill={`rgba(255,240,200,${0.8 * shine})`} />)}</svg>;
  return <Card t={t} at={at} out={out} x={x} y={y} pad="20px 34px">
    <div style={{ display: "flex", gap: 50 }}>
      <div style={{ textAlign: "center" }}>{pz("#6a4a32", 0)}<div style={hand(46, "#c8b8a8")}>sin naranja: cafés, opacas</div></div>
      <div style={{ textAlign: "center", opacity: g }}>{pz("#b8682a", g)}<div style={hand(46, CH.maiz)}>con naranja: de cobre</div></div>
    </div>
  </Card>;
};

// el día de la fiesta: una línea de horas que se va prendiendo
export const DiaFiesta: React.FC<{ t: number; out: number; x: number; y: number; rows: { at: number; h: string; text: string }[] }> = ({ t, out, x, y, rows }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < rows[0].at - 0.2) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 22, alignItems: "flex-start" }}>
    {rows.map((r, i) => { const k = Math.min(1.1, spr(t, r.at, 1.1)); return <div key={i} style={{ width: 300, textAlign: "center", opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(1, k)) * 120}px)` }}>
      <div style={{ margin: "0 auto", width: 150, height: 150, borderRadius: "50%", background: "linear-gradient(180deg,#f6ecd4,#e6d4ab)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,.55)" }}><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CH.guinda }}>{r.h}</span></div>
      <div style={{ ...hand(44), marginTop: 12, textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>{r.text}</div></div>; })}
  </div>;
};

// cuánto duran: barras con su tiempo
export const Duran: React.FC<B & { x: number; y: number; rows: { l: string; v: string; w: number; at: number; c: string }[] }> = ({ t, at, out, x, y, rows }) => (
  <Card t={t} at={at} out={out} x={x} y={y} w={840}>
    {rows.map((r, i) => <div key={i} style={{ marginTop: i ? 18 : 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={hand(50)}>{r.l}</span><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: r.c, opacity: e(t, r.at, r.at + 0.3) }}>{r.v}</span></div>
      <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${r.w * 100 * e(t, r.at, r.at + 0.8)}%`, height: "100%", borderRadius: 15, background: r.c }} /></div></div>)}
  </Card>
);
