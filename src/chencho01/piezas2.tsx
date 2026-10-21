// chencho01 · PIEZAS NUEVAS del resto del video (2:28 → 12:36). Todas a medida de Chencho, en el mismo estilo del minuto 1:
// papel de cuaderno, gis, lámina, tinta a mano, colores de pueblo (barro, guinda, maíz, nopal). Ninguna se recicla del minuto 1.
import React from "react";
import { Img, staticFile } from "remotion";
import { CH, FONT, HAND, P, SERIF, e, ei, spr } from "./lib";
import { oo } from "./Min1";

const sh = "0 30px 60px rgba(0,0,0,.55)";
const pap = (extra?: React.CSSProperties): React.CSSProperties => ({ background: CH.papel, borderRadius: 14, boxShadow: sh, ...extra });
const pop = (t: number, at: number, k = 1) => Math.min(1.06, spr(t, at, k));
const cnt = (t: number, a: number, b: number, to: number) => Math.round(to * ei(t, a, b));
const fmt = (n: number) => n.toLocaleString("en-US");

// pestaña de cuaderno que entra de lado: "RENGLÓN 2 · la tortillería"
export const Pestana: React.FC<{ t: number; at: number; out: number; n: number; title: string; x?: number; y?: number }> = ({ t, at, out, n, title, x = 120, y = 150 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * -700}px) rotate(-2deg)`, display: "flex", alignItems: "stretch" }}>
    <div style={{ background: CH.guinda, color: CH.crema, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 6, padding: "18px 22px", borderRadius: "14px 0 0 14px", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>RENGLÓN</div>
    <div style={pap({ borderRadius: "0 14px 14px 0", padding: "16px 40px 16px 30px", display: "flex", alignItems: "center", gap: 26, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 46px, rgba(70,110,170,.25) 46px 48px)" })}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CH.guinda, lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: CH.tinta, clipPath: `inset(0 ${100 - 100 * e(t, at + 0.3, at + 1.0)}% 0 0)` }}>{title}</div>
    </div>
  </div>;
};

// el jitomate de la ciudad viene de lejos (camión, 2,000 km) y el de aquí del rancho de al lado
export const KmRuta: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const d1 = e(t, at + 0.2, at + 1.6), d2 = e(t, at + 2.0, at + 2.8), x = e(t, at + 1.7, at + 2.0);
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <rect x={160} y={620} width={1600} height={360} rx={26} fill="rgba(42,18,12,.82)" />
    <path d="M 260 860 C 600 700, 1100 700, 1520 820" fill="none" stroke="#9aa0a6" strokeWidth={10} strokeDasharray="22 16" opacity={0.9} pathLength={1} style={{ strokeDasharray: `${d1} 1` }} />
    <g transform={`translate(${260 + 1260 * d1}, ${860 - 120 * Math.sin(Math.PI * d1)})`}><rect x={-60} y={-40} width={90} height={50} rx={6} fill="#c9ccd0" /><rect x={30} y={-26} width={36} height={36} rx={5} fill="#9aa0a6" /><circle cx={-40} cy={14} r={12} fill="#333" /><circle cx={40} cy={14} r={12} fill="#333" /></g>
    <text x={260} y={930} fontFamily={FONT} fontWeight={900} fontSize={40} fill="#c9ccd0">2,000 km en camión</text>
    <g opacity={x}><line x1={700} y1={700} x2={1100} y2={900} stroke="#e0412c" strokeWidth={16} strokeLinecap="round" /><line x1={1100} y1={700} x2={700} y2={900} stroke="#e0412c" strokeWidth={16} strokeLinecap="round" /></g>
    <g opacity={d2} transform={`translate(${1560 - 80 * (1 - d2)}, 760)`}>
      <circle cx={0} cy={0} r={70} fill={CH.nopal} /><text x={0} y={22} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={CH.crema}>✓</text>
      <text x={0} y={140} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={58} fill={CH.maiz}>del rancho de al lado</text>
    </g>
  </svg>;
};

// el ticket del tianguis: una tira de papel que se va escribiendo renglón por renglón y suma sola
export type TRow = { at: number; item: string; v: number };
export const Ticket: React.FC<{ t: number; at: number; out: number; rows: TRow[]; totalAt: number; x: number; y: number; sc?: number }> = ({ t, at, out, rows, totalAt, x, y, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const vis = rows.filter((r) => t >= r.at - 0.05);
  const sum = vis.reduce((a, r) => a + r.v * e(t, r.at, r.at + 0.4), 0);
  const fin = e(t, totalAt, totalAt + 0.35);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc}) rotate(2deg)`, transition: "none" }}>
    <div style={{ width: 470, padding: "26px 30px 30px", background: "#fbf8ef", boxShadow: sh, clipPath: "polygon(0 0,100% 0,100% 100%,96% 98%,92% 100%,88% 98%,84% 100%,80% 98%,76% 100%,72% 98%,68% 100%,64% 98%,60% 100%,56% 98%,52% 100%,48% 98%,44% 100%,40% 98%,36% 100%,32% 98%,28% 100%,24% 98%,20% 100%,16% 98%,12% 100%,8% 98%,4% 100%,0 98%)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 6, color: CH.guinda, textAlign: "center", borderBottom: "3px dashed #c9bfa8", paddingBottom: 10 }}>TIANGUIS · DOMINGO</div>
      {vis.slice(-9).map((r, i) => <div key={r.item} style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CH.tinta, marginTop: 4, clipPath: `inset(0 ${100 - 100 * e(t, r.at, r.at + 0.35)}% 0 0)` }}><span>{r.item}</span><span>${r.v}</span></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "3px solid " + CH.tinta, marginTop: 10, paddingTop: 6, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: fin > 0.5 ? "#b3261e" : CH.tinta }}><span>TOTAL</span><span>${fmt(Math.round(sum))}</span></div>
    </div>
  </div>;
};

// cuatro domingos × $302 = $1,200 al mes (los bloques del calendario se llenan)
export const Por4: React.FC<{ t: number; at: number; out: number; x: number; y: number; totalAt: number }> = ({ t, at, out, x, y, totalAt }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 18 }}>
    {[0, 1, 2, 3].map((i) => { const k = pop(t, at + i * 0.22, 1.1); return <div key={i} style={{ width: 150, height: 170, ...pap(), transform: `scale(${Math.min(1, k)}) rotate(${(i - 1.5) * 3}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: CH.guinda }}>DOMINGO</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.tinta }}>$302</div></div>; })}
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CH.crema, textShadow: "0 6px 20px #000", margin: "0 10px" }}>=</div>
    <div style={{ padding: "18px 30px", borderRadius: 18, background: CH.maiz, boxShadow: sh, fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CH.negro, transform: `scale(${Math.min(1.05, spr(t, totalAt, 1))})` }}>${fmt(cnt(t, totalAt, totalAt + 0.8, 1200))}<span style={{ fontSize: 40 }}> /mes</span></div>
  </div>;
};

// la balanza: en el pueblo toda la semana ($302) pesa lo mismo que en la ciudad sólo el pollo y el queso
export const Balanza: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const tilt = 9 * Math.sin(t * 2.2) * Math.exp(-(t - at) * 0.9) * e(t, at + 0.3, at + 0.6);
  const pan = (lbl: string, sub: string, gray: boolean, dx: number) => <div style={{ position: "absolute", left: 960 + dx - 230, top: 470 + (dx < 0 ? -1 : 1) * tilt * 4, width: 460, textAlign: "center" }}>
    <div style={{ height: 120, borderBottom: "6px solid #6b4a2e", position: "relative" }}>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 0, height: 26, borderRadius: "0 0 200px 200px", background: "#a77a44" }} />
    </div>
    <div style={{ marginTop: 18, ...pap({ padding: "14px 18px", filter: gray ? "grayscale(1)" : undefined }) }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: gray ? "#555" : CH.nopal }}>{lbl}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.tinta }}>{sub}</div>
    </div>
  </div>;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <div style={{ position: "absolute", left: 950, top: 380, width: 20, height: 420, background: "#5a3c22", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 960 - 560, top: 470, width: 1120, height: 16, background: "#7a5232", borderRadius: 8, transform: `rotate(${tilt}deg)` }} />
    {pan("EL PUEBLO", "toda la semana · $302", false, -560)}
    {pan("LA CIUDAD", "pollo + queso · $302", true, 560)}
  </div>;
};

// el reloj del tianguis: 8 de la mañana (lo mejor) → 1 de la tarde (a la mitad)
export const RelojHora: React.FC<{ t: number; at: number; unaAt: number; out: number; x: number; y: number }> = ({ t, at, unaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const h = 8 + 5 * ei(t, unaAt - 0.4, unaAt + 0.6), ang = (h % 12) * 30, mang = (t * 400) % 360 * e(t, unaAt - 0.4, unaAt + 0.6);
  const late = h > 10.5;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, textAlign: "center" }}>
    <svg width={300} height={300} viewBox="0 0 300 300">
      <circle cx={150} cy={150} r={140} fill={CH.crema} stroke={CH.guinda} strokeWidth={14} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={150 + 112 * Math.sin(i * Math.PI / 6)} y1={150 - 112 * Math.cos(i * Math.PI / 6)} x2={150 + 126 * Math.sin(i * Math.PI / 6)} y2={150 - 126 * Math.cos(i * Math.PI / 6)} stroke={CH.tinta} strokeWidth={6} />)}
      <line x1={150} y1={150} x2={150 + 70 * Math.sin(ang * Math.PI / 180)} y2={150 - 70 * Math.cos(ang * Math.PI / 180)} stroke={CH.tinta} strokeWidth={12} strokeLinecap="round" />
      <line x1={150} y1={150} x2={150 + 105 * Math.sin(mang * Math.PI / 180)} y2={150 - 105 * Math.cos(mang * Math.PI / 180)} stroke={CH.barro} strokeWidth={7} strokeLinecap="round" />
      <circle cx={150} cy={150} r={10} fill={CH.tinta} />
    </svg>
    <div style={{ marginTop: 8, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: "0 6px 18px #000" }}>{late ? "1 de la tarde: a la mitad" : "8 de la mañana: lo mejor"}</div>
  </div>;
};

// el montón de jitomate: la etiqueta de $20 se corta a la mitad con tijera
export const Mitad: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at - 0.5, out); if (o <= 0.01) return null;
  const c = ei(t, at, at + 0.5);
  const half = (side: number) => <div style={{ position: "absolute", left: side < 0 ? 0 : 160, top: 0, width: 160, height: 150, overflow: "hidden", transform: `translate(${side * 40 * c}px, ${side < 0 ? 30 * c : -10 * c}px) rotate(${side * 8 * c}deg)` }}>
    <div style={{ position: "absolute", left: side < 0 ? 0 : -160, width: 320, height: 150, ...pap({ background: CH.maiz }), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CH.negro }}>$20</div>
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%) rotate(-4deg)" }}>
    <div style={{ position: "relative", width: 320, height: 150 }}>{half(-1)}{half(1)}</div>
    <div style={{ marginTop: 26, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: "#fff", textShadow: "0 8px 24px #000", opacity: e(t, at + 0.4, at + 0.7) }}>$10</div>
  </div>;
};

// la huevera se llena: 4-5 huevos al día de las 6 gallinas → todo el mes, $0
export const Huevera: React.FC<{ t: number; at: number; out: number; ceroAt: number; x: number; y: number }> = ({ t, at, out, ceroAt, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const n = Math.floor(30 * e(t, at + 0.3, ceroAt));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})` }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 70px)", gap: 8, padding: 22, background: "#b9a07a", borderRadius: 18, boxShadow: sh }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ width: 70, height: 70, borderRadius: "50%", background: "#8f774f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {i < n && <div style={{ width: 50, height: 62, borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%", background: "radial-gradient(circle at 35% 30%, #f6dcb8, #c98b52)" }} />}</div>)}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: "0 6px 18px #000" }}>
      <span>6 gallinas · 4-5 al día</span>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: CH.maiz, opacity: e(t, ceroAt, ceroAt + 0.3) }}>$0</span></div>
  </div>;
};

// regalos de la familia: el limón del patio y la mata de chile de Licha (dibujo a tinta)
export const Matas: React.FC<{ t: number; at: number; lichaAt: number; out: number; x: number; y: number }> = ({ t, at, lichaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const g1 = e(t, at, at + 1.0), g2 = e(t, lichaAt, lichaAt + 1.0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30 }}>
    {[["limonero", g1, "#f2d64e", "del patio"], ["mata de chile", g2, "#c8321e", "regalo de Licha"]].map(([n, g, c, s], i) => <div key={i} style={{ width: 300, ...pap({ padding: 18 }), textAlign: "center", opacity: Math.min(1, (g as number) * 2) }}>
      <svg width={260} height={220} viewBox="0 0 260 220">
        <path d="M 130 210 L 130 70" stroke="#5a3c22" strokeWidth={10} strokeDasharray="160" strokeDashoffset={160 * (1 - (g as number))} />
        {[[90, 90], [170, 80], [110, 50], [160, 130], [95, 140], [140, 30]].map(([cx, cy], k) => <ellipse key={k} cx={cx} cy={cy} rx={34 * (g as number)} ry={18 * (g as number)} fill="#4f7a2c" transform={`rotate(${k * 40} ${cx} ${cy})`} />)}
        {[[100, 110], [165, 105], [130, 60]].map(([cx, cy], k) => <ellipse key={k} cx={cx} cy={cy} rx={(i ? 9 : 16) * e(t, (i ? lichaAt : at) + 0.6 + k * 0.15, (i ? lichaAt : at) + 0.9 + k * 0.15)} ry={i ? 20 : 14} fill={c as string} />)}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: CH.guinda, letterSpacing: 2 }}>{(n as string).toUpperCase()}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: CH.tinta }}>{s as string}</div>
    </div>)}
  </div>;
};

// la semana de Chencho en un pizarrón de cocina: cada día se ilumina con su guiso
export const SemanaMenu: React.FC<{ t: number; at: number; out: number; days: [string, string, number][]; x: number; y: number; sc?: number }> = ({ t, at, out, days, x, y, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * Math.min(1, pop(t, at, 0.9))})` }}>
    <div style={{ width: 760, padding: "24px 32px", background: "radial-gradient(circle at 30% 30%,#3a2b22,#241a14)", border: "14px solid #7a5232", borderRadius: 10, boxShadow: sh }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 8, color: CH.maiz, textAlign: "center", marginBottom: 8 }}>MI SEMANA</div>
      {days.map(([d, g, a]) => { const on = e(t, a, a + 0.3); return <div key={d} style={{ display: "flex", gap: 22, alignItems: "baseline", padding: "4px 0", opacity: 0.25 + 0.75 * on }}>
        <div style={{ width: 150, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: on > 0.5 ? CH.maiz : "#a99", letterSpacing: 3 }}>{d}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#f4f1e6", clipPath: `inset(0 ${100 - 100 * on}% 0 0)` }}>{g}</div></div>; })}
    </div>
  </div>;
};

// nada de bolsas ni latas: lata y bolsa de súper que se tachan con una equis de gis
export const LatasX: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at - 0.6, out); if (o <= 0.01) return null;
  const xx = e(t, at, at + 0.35);
  return <svg width={520} height={260} viewBox="0 0 520 260" style={{ position: "absolute", left: x - 260, top: y - 130, opacity: o }}>
    <g transform="translate(70,30)"><rect x={0} y={20} width={130} height={170} rx={12} fill="#b9bcbf" /><ellipse cx={65} cy={20} rx={65} ry={16} fill="#d7d9db" /><rect x={0} y={80} width={130} height={56} fill="#c8321e" /></g>
    <g transform="translate(300,30)"><path d="M 10 40 L 150 40 L 140 200 L 20 200 Z" fill="#e7e2d6" /><path d="M 40 40 Q 40 0 80 0 Q 120 0 120 40" fill="none" stroke="#e7e2d6" strokeWidth={10} /><rect x={30} y={90} width={100} height={40} fill="#2f7fc1" /></g>
    {[[30, 20, 490, 240], [490, 20, 30, 240]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={a + (c - a) * xx} y2={b + (d - b) * xx} stroke="#fff" strokeWidth={16} strokeLinecap="round" opacity={0.92} />)}
  </svg>;
};

// la báscula de la tortillería: 1.000 kg · $22.00 en verde de display
export const Bascula22: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const kg = Math.min(1, ei(t, at + 0.2, at + 1.0) * 1.03 - 0.03 * Math.sin((t - at) * 9) * Math.exp(-(t - at) * 3));
  const d = { fontFamily: "monospace", fontWeight: 700, color: "#7dff9a", textShadow: "0 0 14px #2bdc5a" } as React.CSSProperties;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})` }}>
    <div style={{ width: 620, padding: "26px 34px", background: "linear-gradient(180deg,#d9dcdf,#a9adb2)", borderRadius: 24, boxShadow: sh }}>
      <div style={{ display: "flex", gap: 18 }}>
        <div style={{ flex: 1, background: "#0d1a10", borderRadius: 10, padding: "10px 18px" }}><div style={{ fontFamily: FONT, fontSize: 18, color: "#6a8", letterSpacing: 3 }}>PESO kg</div><div style={{ ...d, fontSize: 72 }}>{kg.toFixed(3)}</div></div>
        <div style={{ flex: 1, background: "#0d1a10", borderRadius: 10, padding: "10px 18px" }}><div style={{ fontFamily: FONT, fontSize: 18, color: "#6a8", letterSpacing: 3 }}>TOTAL $</div><div style={{ ...d, fontSize: 72 }}>{(22 * kg).toFixed(2)}</div></div>
      </div>
    </div>
  </div>;
};

// 22 aquí vs 28 en Guadalajara: dos etiquetas y la diferencia que cae
export const DosPrecios: React.FC<{ t: number; at: number; gdlAt: number; out: number; x: number; y: number }> = ({ t, at, gdlAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const tag = (lbl: string, v: string, c: string, a: number, gray?: boolean) => <div style={{ ...pap({ padding: "16px 30px", background: c, filter: gray ? "grayscale(.9)" : undefined }), transform: `scale(${Math.min(1, pop(t, a))}) rotate(${gray ? 4 : -4}deg)`, textAlign: "center", opacity: e(t, a, a + 0.15) }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 4, color: CH.negro }}>{lbl}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CH.negro }}>{v}</div></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
    {tag("EL PUEBLO", "$22", CH.maiz, at)}
    {tag("GUADALAJARA", "$28", "#d7d9db", gdlAt, true)}
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: "0 6px 18px #000", opacity: e(t, gdlAt + 0.6, gdlAt + 0.9) }}>el kilo de tortilla</div>
  </div>;
};

// huele a maíz, no a cartón: la mazorca dorada contra una caja de cartón gris
export const MaizCarton: React.FC<{ t: number; at: number; cartonAt: number; out: number }> = ({ t, at, cartonAt, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const a = pop(t, at), b = pop(t, cartonAt);
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={420} height={480} viewBox="0 0 420 480" style={{ position: "absolute", left: 300, top: 330, transform: `scale(${Math.min(1, a)}) rotate(-12deg)` }}>
      <path d="M 210 40 C 300 60 320 260 260 420 C 230 460 190 460 160 420 C 100 260 120 60 210 40 Z" fill="#f2c14e" />
      {Array.from({ length: 9 }, (_, r) => Array.from({ length: 4 }, (_, c) => <ellipse key={r + "-" + c} cx={165 + c * 30} cy={90 + r * 36} rx={13} ry={15} fill="#e8a321" />))}
      <path d="M 160 420 C 60 380 40 240 90 150 C 130 260 150 340 210 430 Z" fill="#7a9a3a" /><path d="M 260 420 C 360 380 380 240 330 150 C 290 260 270 340 210 430 Z" fill="#6b8a3a" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${170 + i * 40} 30 q -16 -26 0 -52`} stroke="rgba(255,255,255,.75)" strokeWidth={8} fill="none" opacity={0.4 + 0.5 * Math.sin(t * 3 + i)} />)}
    </svg>
    <div style={{ position: "absolute", left: 1220, top: 420, width: 380, height: 300, background: "#b49a72", borderRadius: 6, filter: "grayscale(.8)", transform: `scale(${Math.min(1, b)}) rotate(6deg)`, boxShadow: sh, opacity: e(t, cartonAt, cartonAt + 0.2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 10, background: "#8a7550" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 280, color: "#e0412c", opacity: e(t, cartonAt + 0.4, cartonAt + 0.6) }}>✗</div>
    </div>
    <div style={{ position: "absolute", left: 320, top: 860, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#fff", textShadow: "0 6px 18px #000" }}>maíz de verdad</div>
  </div>;
};

// medio kilo diario × 30 días = 15 kilos → $330 (una torre de tortillas que crece)
export const Torre: React.FC<{ t: number; at: number; amtAt: number; out: number; x: number; y: number }> = ({ t, at, amtAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const n = Math.floor(30 * e(t, at + 0.2, amtAt));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-100%)", textAlign: "center" }}>
    <div style={{ position: "relative", width: 300, height: 30 + n * 14 }}>
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + Math.sin(i * 2.1) * 8, bottom: i * 14, width: 240, height: 22, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #f3e2b4, #d9b97a)", boxShadow: "0 3px 4px rgba(0,0,0,.35)" }} />)}
    </div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: "#fff", textShadow: "0 6px 18px #000" }}>½ kilo × 30 días = 15 kilos</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CH.maiz, textShadow: "0 6px 18px #000", opacity: e(t, amtAt, amtAt + 0.3) }}>$330</div>
  </div>;
};

// la tortilla que sobra no se tira: tortilla → comal → tostada (y eso también es dinero)
export const NoSeTira: React.FC<{ t: number; at: number; tostAt: number; dineroAt: number; out: number; x: number; y: number }> = ({ t, at, tostAt, dineroAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = e(t, at, tostAt + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 30, padding: "24px 36px", background: "rgba(42,18,12,.8)", borderRadius: 24 }}>
    <div style={{ width: 190, height: 190, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${k > 0.7 ? "#e2b45e" : "#f3e2b4"}, ${k > 0.7 ? "#a86e2a" : "#d9b97a"})`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CH.crema }}>→</div>
    <div style={{ textAlign: "center", opacity: e(t, tostAt, tostAt + 0.3) }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CH.maiz }}>tostada</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CH.maiz }}>chilaquiles</div>
    </div>
    <div style={{ marginLeft: 20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff1b8, #e0b23c 45%, #9a6a12 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#6a4508", transform: `scale(${Math.min(1.05, spr(t, dineroAt, 1))})` }}>$</div>
  </div>;
};

// el anaquel de la tiendita: cada cosa con su etiqueta, el total abajo
export const Anaquel: React.FC<{ t: number; at: number; out: number; items: [string, number, number][]; totalAt: number; x: number; y: number; sc?: number }> = ({ t, at, out, items, totalAt, x, y, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const sum = items.reduce((a, [, v, w]) => a + v * e(t, w, w + 0.4), 0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc})` }}>
    <div style={{ width: 760, padding: "18px 22px 10px", background: "#6b4a2e", borderRadius: 14, boxShadow: sh }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {items.map(([n, v, w], i) => { const k = Math.min(1, pop(t, w, 1.2)); const col = ["#c9472b", "#e8d9b0", "#7a3b1e", "#3f6fa8", "#d9a62e", "#5d8a3a", "#a83a5a", "#c27a2e"][i % 8]; return <div key={n} style={{ height: 250, borderBottom: "10px solid #4a311c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", opacity: e(t, w, w + 0.1), transform: `translateY(${(1 - k) * -80}px)` }}>
          <div style={{ width: 132, height: 150, background: col, borderRadius: "18px 18px 8px 8px", boxShadow: "inset -14px 0 0 rgba(0,0,0,.18), 0 6px 12px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
            <div style={{ background: "rgba(255,248,230,.92)", borderRadius: 8, padding: "6px 6px", fontFamily: HAND, fontWeight: 700, fontSize: 34, lineHeight: 1, color: CH.negro, textAlign: "center" }}>{n}</div></div>
          <div style={{ background: CH.maiz, padding: "2px 14px", borderRadius: 6, fontFamily: SERIF, fontWeight: 900, fontSize: 42, color: CH.negro, margin: "10px 0 8px" }}>${v}</div></div>; })}
      </div>
    </div>
    <div style={{ marginTop: 14, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#fff", textShadow: "0 6px 18px #000" }}>
      ≈ ${fmt(totalAt > 0 && t > totalAt ? 400 : Math.round(sum))} <span style={{ fontFamily: HAND, fontSize: 56 }}>{t > totalAt ? "al mes" : ""}</span></div>
  </div>;
};

// del costal por kilo, no en bolsita (el costal de yute contra la bolsita de plástico)
export const Costal: React.FC<{ t: number; at: number; bolsaAt: number; out: number; x: number; y: number }> = ({ t, at, bolsaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "flex-end", gap: 60 }}>
    <div style={{ textAlign: "center", transform: `scale(${Math.min(1, pop(t, at))})` }}>
      <svg width={300} height={320} viewBox="0 0 300 320"><path d="M 40 60 Q 30 300 70 310 L 230 310 Q 270 300 260 60 Q 150 30 40 60 Z" fill="#b8925a" /><path d="M 40 60 Q 150 100 260 60" fill="#7a2b1a" />
        {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={80 + (i * 37) % 140} cy={58 + (i % 3) * 6} rx={9} ry={6} fill="#5a1d14" />)}
        <path d="M 60 100 Q 150 120 240 100 M 55 180 Q 150 200 245 180 M 60 250 Q 150 270 240 250" stroke="#9a7444" strokeWidth={4} fill="none" /></svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.maiz, textShadow: "0 6px 18px #000" }}>del costal, por kilo ✓</div>
    </div>
    <div style={{ textAlign: "center", opacity: e(t, bolsaAt, bolsaAt + 0.2), filter: "grayscale(.6)", transform: `scale(${Math.min(1, pop(t, bolsaAt))})` }}>
      <svg width={150} height={190} viewBox="0 0 150 190"><path d="M 20 20 L 130 20 L 120 180 L 30 180 Z" fill="rgba(230,235,240,.85)" stroke="#bbb" strokeWidth={4} />{Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={50 + (i * 23) % 60} cy={120 + (i % 3) * 18} rx={9} ry={6} fill="#5a1d14" />)}</svg>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#ddd", textShadow: "0 6px 18px #000", textDecoration: "line-through" }}>bolsita</div>
    </div>
  </div>;
};

// el tanque de gas: la aguja baja despacito en dos meses (calendario debajo)
export const TanqueMeses: React.FC<{ t: number; at: number; duraAt: number; out: number; x: number; y: number }> = ({ t, at, duraAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const lvl = 1 - 0.95 * e(t, duraAt, duraAt + 2.2), ang = -110 + 220 * lvl;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, textAlign: "center" }}>
    <svg width={340} height={230} viewBox="0 0 340 230">
      <path d="M 40 200 A 130 130 0 0 1 300 200" fill="none" stroke="#ddd" strokeWidth={28} />
      <path d="M 40 200 A 130 130 0 0 1 300 200" fill="none" stroke={CH.nopal} strokeWidth={28} pathLength={1} strokeDasharray={`${lvl} 1`} />
      <line x1={170} y1={200} x2={170 + 110 * Math.sin(ang * Math.PI / 180)} y2={200 - 110 * Math.cos(ang * Math.PI / 180)} stroke={CH.guinda} strokeWidth={10} strokeLinecap="round" />
      <circle cx={170} cy={200} r={16} fill={CH.guinda} />
      <text x={40} y={228} fontFamily={FONT} fontWeight={900} fontSize={24} fill="#fff">E</text><text x={290} y={228} fontFamily={FONT} fontWeight={900} fontSize={24} fill="#fff">F</text>
    </svg>
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 6 }}>{["MES 1", "MES 2"].map((m, i) => <div key={m} style={{ ...pap({ padding: "8px 18px" }), fontFamily: FONT, fontWeight: 900, fontSize: 30, color: CH.guinda, opacity: 0.3 + 0.7 * e(t, duraAt + i * 1.0, duraAt + 0.3 + i * 1.0) }}>{m}</div>)}</div>
    <div style={{ marginTop: 8, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: "#fff", textShadow: "0 6px 18px #000" }}>20 kilos · $460</div>
  </div>;
};

// el fogón no gasta gas: la llama de leña y el contador de litros que no se mueve de 0
export const CeroGas: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, display: "flex", alignItems: "center", gap: 26, padding: "20px 34px", background: "rgba(42,18,12,.82)", borderRadius: 24 }}>
    <svg width={120} height={150} viewBox="0 0 120 150">{[0, 1, 2].map((i) => <path key={i} d={`M 60 ${140 - i * 6} C ${10 + i * 8} ${100 - 6 * Math.sin(t * 9 + i)} ${40} ${40 - 10 * Math.sin(t * 7 + i)} 60 ${10 + i * 22} C 80 ${40 - 10 * Math.cos(t * 8 + i)} ${110 - i * 8} 100 60 ${140 - i * 6} Z`} fill={["#e2672e", "#f2a33a", "#ffe08a"][i]} />)}</svg>
    <div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: "#c9b" }}>GAS USADO</div>
      <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 90, color: "#7dff9a", textShadow: "0 0 14px #2bdc5a" }}>0.0 L</div></div>
  </div>;
};

// el recibo de la luz partido en dos: $146 ÷ 2 meses = $73
export const Division: React.FC<{ t: number; at: number; resAt: number; out: number; x: number; y: number }> = ({ t, at, resAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const c = ei(t, resAt - 0.6, resAt);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 24 }}>
    {[0, 1].map((i) => <div key={i} style={{ ...pap({ background: "#fbf8ef", padding: "18px 26px" }), transform: `translateX(${(i ? 1 : -1) * 40 * c}px) rotate(${(i ? 4 : -4) * c}deg)`, textAlign: "center", width: 230 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#7a7", letterSpacing: 3 }}>{i ? "MES 2" : "MES 1"}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: CH.negro }}>${c > 0.5 ? 73 : i ? "" : 146}</div></div>)}
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: "0 6px 18px #000", marginLeft: 20, opacity: e(t, resAt, resAt + 0.3) }}>al mes</div>
  </div>;
};

// en Guadalajara: el ventilador prendido todo el día y el recibo de más de $700
export const Ventilador: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, textAlign: "center", filter: "grayscale(.75)" }}>
    <svg width={280} height={320} viewBox="0 0 280 320">
      <circle cx={140} cy={130} r={120} fill="none" stroke="#999" strokeWidth={8} />
      <g transform={`rotate(${t * 900} 140 130)`}>{[0, 120, 240].map((r) => <ellipse key={r} cx={140} cy={70} rx={30} ry={58} fill="#9ab" transform={`rotate(${r} 140 130)`} />)}</g>
      <circle cx={140} cy={130} r={18} fill="#555" /><rect x={130} y={250} width={20} height={50} fill="#777" /><rect x={80} y={296} width={120} height={16} rx={8} fill="#777" />
    </svg>
    <div style={{ ...pap({ background: "#e6e6e6", padding: "10px 24px", display: "inline-block" }), fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#b3261e" }}>+$700</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#fff", textShadow: "0 6px 18px #000" }}>el bimestre en Guadalajara</div>
  </div>;
};

// el muro de adobe en corte: más de medio metro, afuera el sol y adentro fresquito
export const MuroCorte: React.FC<{ t: number; at: number; frescoAt: number; out: number }> = ({ t, at, frescoAt, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const w = ei(t, at, at + 0.9);
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <div style={{ position: "absolute", left: 760, top: 200, width: 400 * w, height: 680, background: "repeating-linear-gradient(0deg,#b88a5a 0 60px,#a77a4a 60px 64px)", boxShadow: "inset 0 0 40px rgba(0,0,0,.4), " + sh, borderRadius: 6 }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <g opacity={e(t, at + 0.5, at + 0.9)}><line x1={760} y1={920} x2={1160} y2={920} stroke="#fff" strokeWidth={5} /><line x1={760} y1={900} x2={760} y2={940} stroke="#fff" strokeWidth={5} /><line x1={1160} y1={900} x2={1160} y2={940} stroke="#fff" strokeWidth={5} />
        <text x={960} y={990} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={60} fill="#fff">más de medio metro</text></g>
      <g opacity={e(t, at + 0.3, at + 0.7)} transform="translate(420,360)">{Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={0} x2={150 * Math.cos(i * 0.628 + t)} y2={150 * Math.sin(i * 0.628 + t)} stroke="#ffcf4a" strokeWidth={10} strokeLinecap="round" />)}<circle r={80} fill="#ffb627" /></g>
      <g opacity={e(t, frescoAt, frescoAt + 0.4)}>{[0, 1, 2].map((i) => <path key={i} d={`M ${1300 + i * 80} ${380 + 30 * Math.sin(t * 2 + i)} q 40 -30 80 0 t 80 0`} stroke="#8fd6ff" strokeWidth={10} fill="none" strokeLinecap="round" />)}
        <text x={1480} y={540} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#d9f3ff">fresquito</text></g>
      <text x={420} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff" opacity={e(t, at + 0.5, at + 0.9)}>AFUERA</text>
      <text x={1480} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff" opacity={e(t, at + 0.5, at + 0.9)}>ADENTRO</text>
    </svg>
  </div>;
};

// el sol que sale con el gallo: "la luz del día no cuesta" → $0
export const SolGratis: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 1.4);
  return <div style={{ position: "absolute", left: 1440, top: 560 - 300 * k, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,#fff4c2,#ffb627 60%,rgba(255,150,40,0))", boxShadow: "0 0 120px 40px rgba(255,190,80,.6)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "#8a4a00" }}>$0</div>
    <div style={{ marginTop: 20, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#fff", textShadow: "0 6px 18px #000", opacity: e(t, at + 0.8, at + 1.2) }}>la luz del día no cuesta</div>
  </div>;
};

// el comité del agua: $70 de cuota + una faena al año (el sábado del año circulado)
export const Faena: React.FC<{ t: number; at: number; faenaAt: number; out: number; x: number; y: number }> = ({ t, at, faenaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30, alignItems: "center" }}>
    <div style={{ ...pap({ padding: "18px 30px" }), transform: `scale(${Math.min(1, pop(t, at))}) rotate(-3deg)`, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: "#2f7fc1" }}>COMITÉ DEL AGUA</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CH.negro }}>$70</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CH.tinta }}>cuota al mes</div></div>
    <div style={{ ...pap({ padding: 16 }), opacity: e(t, faenaAt, faenaAt + 0.2), transform: `scale(${Math.min(1, pop(t, faenaAt))}) rotate(3deg)` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(13, 26px)", gap: 4 }}>{Array.from({ length: 52 }, (_, i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 5, background: i === 31 ? CH.guinda : "#d6ccb4", boxShadow: i === 31 ? `0 0 0 ${4 + 4 * e(t, faenaAt + 0.4, faenaAt + 0.8)}px ${CH.maiz}` : undefined }} />)}</div>
      <div style={{ marginTop: 10, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CH.tinta, textAlign: "center" }}>1 sábado al año: la faena</div></div>
  </div>;
};

// el pueblo a pie: el círculo de 10 minutos caminando y los lugares que caen adentro
export const Radio10: React.FC<{ t: number; at: number; out: number; cx: number; cy: number; pins: [string, number, number, number][] }> = ({ t, at, out, cx, cy, pins }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const r = 380 * ei(t, at, at + 1.2);
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <circle cx={cx} cy={cy} r={r} fill="rgba(242,193,78,.16)" stroke={CH.maiz} strokeWidth={8} strokeDasharray="26 16" />
    <circle cx={cx} cy={cy} r={18} fill={CH.guinda} stroke="#fff" strokeWidth={5} />
    {pins.map(([n, x, y, a]) => { const k = Math.min(1, spr(t, a, 1.2)); return <g key={n} opacity={e(t, a, a + 0.15)} transform={`translate(${x},${y - 40 * (1 - k)})`}>
      <path d="M 0 0 C -26 -30 -26 -62 0 -62 C 26 -62 26 -30 0 0 Z" fill={CH.barro} stroke="#fff" strokeWidth={4} />
      <text x={0} y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 6 }}>{n}</text></g>; })}
    <text x={cx} y={cy + r + 70} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={66} fill="#fff" opacity={e(t, at + 1.0, at + 1.4)} style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.6)", strokeWidth: 8 }}>todo a 10 minutos a pie</text>
  </svg>;
};

// la cuenta de la combi: $24 × 4 viajes = $96 → pongamos $100
export const Combi24: React.FC<{ t: number; at: number; redAt: number; out: number; x: number; y: number }> = ({ t, at, redAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", ...pap({ padding: "22px 34px" }), textAlign: "center" }}>
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 90, height: 56, borderRadius: 10, background: "#f2f2ee", border: "4px solid #bbb", opacity: e(t, at + i * 0.25, at + 0.15 + i * 0.25), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 30 }}>$24</div>)}</div>
    <div style={{ marginTop: 10, fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.tinta }}>2 veces al mes, ida y vuelta</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CH.guinda }}>
      <span style={{ textDecoration: t > redAt ? "line-through" : undefined, opacity: t > redAt ? 0.45 : 1 }}>$96</span>
      <span style={{ marginLeft: 26, opacity: e(t, redAt, redAt + 0.3) }}>$100</span></div>
  </div>;
};

// en la ciudad sentado (camión, fábrica, sillón) → aquí una hora a pie al día
export const Sentado: React.FC<{ t: number; at: number; horaAt: number; out: number; x: number; y: number }> = ({ t, at, horaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const ic = ["camión", "fábrica", "sillón"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "flex", gap: 20, filter: "grayscale(1)", opacity: 1 - 0.6 * e(t, horaAt, horaAt + 0.4) }}>{ic.map((n, i) => <div key={n} style={{ ...pap({ padding: "14px 22px", background: "#ddd" }), fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#333", transform: `scale(${Math.min(1, pop(t, at + i * 0.35))})` }}>🪑 {n}</div>)}</div>
    <div style={{ marginTop: 24, fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: CH.maiz, textShadow: "0 8px 22px #000", transform: `scale(${Math.min(1, pop(t, horaAt))})`, opacity: e(t, horaAt, horaAt + 0.2) }}>1 hora a pie al día</div>
  </div>;
};

// la báscula del baño: −6 kilos el primer año
export const Menos6: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const n = cnt(t, at + 0.2, at + 1.2, 6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, width: 340, height: 340, borderRadius: 40, background: "linear-gradient(180deg,#f1f1ee,#c9c9c4)", boxShadow: sh, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <div style={{ padding: "10px 26px", background: "#0d1a10", borderRadius: 12, fontFamily: "monospace", fontWeight: 700, fontSize: 84, color: "#7dff9a", textShadow: "0 0 14px #2bdc5a" }}>−{n} kg</div>
    <div style={{ marginTop: 16, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta }}>el primer año</div>
  </div>;
};

// la receta: las pastillas de la presión $0 (el seguro) y la pomada o jarabe $60
export const Receta: React.FC<{ t: number; at: number; jarAt: number; out: number; x: number; y: number }> = ({ t, at, jarAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const row = (n: string, v: string, a: number, c: string) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px dashed #c9bfa8", padding: "8px 0", clipPath: `inset(0 ${100 - 100 * e(t, a, a + 0.5)}% 0 0)` }}>
    <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.tinta }}>{n}</span><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: c }}>{v}</span></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-2deg) scale(${Math.min(1, pop(t, at))})`, width: 560, ...pap({ background: "#fbfbf6", padding: "22px 32px" }) }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: "#2f7fc1" }}>℞</div>
    {row("pastillas de la presión", "$0", at + 0.3, CH.nopal)}
    {row("pomada o jarabe", "$60", jarAt, CH.guinda)}
  </div>;
};

// de noche, sin hospital: la línea de 40 minutos en combi hasta la cruz roja, con la luna encima
export const Lejos40: React.FC<{ t: number; at: number; nocheAt: number; out: number }> = ({ t, at, nocheAt, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const d = e(t, at + 0.2, at + 1.6);
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <rect x={180} y={720} width={1560} height={240} rx={26} fill="rgba(10,14,30,.78)" />
    <circle cx={330} cy={840} r={34} fill={CH.maiz} /><text x={330} y={920} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#fff">EL PUEBLO</text>
    <line x1={380} y1={840} x2={380 + 1160 * d} y2={840} stroke="#fff" strokeWidth={8} strokeDasharray="20 14" />
    <g opacity={e(t, at + 1.4, at + 1.7)}><rect x={1530} y={800} width={80} height={80} rx={10} fill="#fff" /><rect x={1562} y={810} width={16} height={60} fill="#e0412c" /><rect x={1540} y={832} width={60} height={16} fill="#e0412c" />
      <text x={1570} y={920} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#fff">CLÍNICA</text></g>
    <text x={960} y={800} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill="#fff" opacity={e(t, at + 0.8, at + 1.2)}>40 minutos en combi</text>
    <g opacity={e(t, nocheAt, nocheAt + 0.5)}><circle cx={1600} cy={190} r={70} fill="#f4f1e0" /><circle cx={1630} cy={170} r={64} fill="rgba(10,14,30,1)" />
      <text x={1560} y={330} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill="#ffd0c8">de noche, no hay hospital</text></g>
  </svg>;
};

// los números en la puerta del refri: papelitos pegados con imán (sin números reales)
export const Papelitos: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const notes: [string, string, number][] = [["el vecino", "camioneta", -5], ["la clínica", "urgencias", 4], ["Chayo", "", -2]];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", width: 420, height: 520, borderRadius: 26, background: "linear-gradient(90deg,#e9ebe9,#cfd3d1)", boxShadow: sh }}>
    {notes.map(([a, b, r], i) => { const k = Math.min(1, pop(t, at + 0.2 + i * 0.3)); return <div key={a} style={{ position: "absolute", left: 50 + (i % 2) * 70, top: 50 + i * 145, width: 270, padding: "14px 18px", background: ["#fff27a", "#ffd2e2", "#bfe7ff"][i], boxShadow: "0 10px 18px rgba(0,0,0,.3)", transform: `rotate(${r}deg) scale(${k})`, opacity: k }}>
      <div style={{ position: "absolute", left: 120, top: -14, width: 30, height: 30, borderRadius: "50%", background: CH.guinda }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#223" }}>☎ {a}</div>
      {b && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: "#445" }}>{b}</div>}</div>; })}
  </div>;
};

// la recarga del celular: tarjetita de $100 que se rasca
export const Recarga: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const sc = e(t, at + 0.5, at + 1.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-6deg) scale(${pop(t, at)})`, width: 460, height: 280, borderRadius: 22, background: "linear-gradient(135deg,#2f7fc1,#1b4f86)", boxShadow: sh, padding: 26, boxSizing: "border-box" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#cfe5ff", letterSpacing: 4 }}>RECARGA</div>
    <div style={{ position: "relative", marginTop: 20, height: 110, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "#1b4f86" }}>
      $100<div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "repeating-linear-gradient(45deg,#b9bcbf 0 10px,#d0d2d4 10px 20px)", clipPath: `inset(0 0 0 ${100 * sc}%)` }} /></div>
    <div style={{ marginTop: 10, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#fff" }}>pa' hablarle a Chayo</div>
  </div>;
};

// el predial: $320 al año partido en 12 cachitos → $27 al mes
export const Predial: React.FC<{ t: number; at: number; resAt: number; out: number; x: number; y: number }> = ({ t, at, resAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const c = ei(t, at + 0.6, resAt);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 90px)", gap: 8 * c + 2 }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ height: 70, background: CH.papel, borderRadius: 6, boxShadow: "0 8px 14px rgba(0,0,0,.4)", transform: `rotate(${(i % 3 - 1) * 4 * c}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 34, color: CH.tinta }}>{c > 0.6 ? "$27" : ""}</div>)}</div>
    <div style={{ marginTop: 16, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: "0 6px 18px #000" }}>predial: $320 al año</div>
  </div>;
};

// la sumadora de papel: la tira sale con cada renglón y al final el total
export const Sumadora: React.FC<{ t: number; at: number; out: number; rows: [string, number, number][]; totalAt: number; x: number; y: number; sc?: number }> = ({ t, at, out, rows, totalAt, x, y, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const vis = rows.filter(([, , a]) => t >= a);
  const sum = vis.reduce((s2, [, v]) => s2 + v, 0);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,0) scale(${sc})`, transformOrigin: "50% 0" }}>
    <div style={{ width: 420, background: "#fbfbf6", boxShadow: sh, padding: "14px 26px", fontFamily: "monospace", fontWeight: 700, fontSize: 34, color: "#333", maxHeight: 640, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      {vis.slice(-12).map(([n, v]) => <div key={n} style={{ display: "flex", justifyContent: "space-between" }}><span>{n}</span><span>{fmt(v)} +</span></div>)}
      {t > totalAt && <div style={{ display: "flex", justifyContent: "space-between", borderTop: "3px solid #333", marginTop: 6, color: "#b3261e", fontSize: 44 }}><span>TOTAL</span><span>{fmt(2950)} *</span></div>}
    </div>
    <div style={{ width: 520, height: 160, marginLeft: -50, borderRadius: "20px 20px 30px 30px", background: "linear-gradient(180deg,#d8d4c8,#a8a294)", boxShadow: sh, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ padding: "6px 22px", background: "#0d1a10", borderRadius: 8, fontFamily: "monospace", fontWeight: 700, fontSize: 60, color: "#7dff9a" }}>{fmt(t > totalAt ? 2950 : sum)}</div></div>
  </div>;
};

// el cochinito de barro: los $50 que sobran caen por la ranura
export const Cochinito: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at - 0.5, out); if (o <= 0.01) return null;
  const f = e(t, at, at + 0.7);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at - 0.5)})` }}>
    <svg width={340} height={300} viewBox="0 0 340 300">
      <ellipse cx={170} cy={180} rx={140} ry={100} fill="#c2552d" /><circle cx={290} cy={160} r={46} fill="#c2552d" /><ellipse cx={318} cy={165} rx={18} ry={14} fill="#a8431f" />
      <path d="M 120 90 L 140 50 L 160 90 Z" fill="#a8431f" />{[90, 150, 200, 250].map((xx) => <rect key={xx} x={xx} y={260} width={26} height={36} rx={8} fill="#a8431f" />)}
      <rect x={140} y={80} width={70} height={12} rx={6} fill="#5a1d14" />{[0, 1, 2].map((i) => <circle key={i} cx={120 + i * 50} cy={190} r={12} fill="#f2c14e" opacity={0.7} />)}
      <g transform={`translate(175, ${-40 + 120 * f})`} opacity={1 - e(t, at + 0.6, at + 0.75)}><ellipse rx={36} ry={10} fill="#e0b23c" /><text y={-16} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={34} fill="#fff" style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 5 }}>$50</text></g>
    </svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff", textShadow: "0 6px 18px #000" }}>al cochinito</div>
  </div>;
};

// la libreta de Guadalajara (gris, en rojo): renta, camión, súper, servicios → más de $13,000
export const LibretaCiudad: React.FC<{ t: number; at: number; out: number; rows: [string, string, number][]; totAt: number; x: number; y: number; sc?: number }> = ({ t, at, out, rows, totAt, x, y, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-2deg) scale(${sc * Math.min(1, pop(t, at))})`, width: 640, ...pap({ background: "#e6e6e3", padding: "22px 34px", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 58px, rgba(90,90,90,.22) 58px 60px)" }) }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: "#555" }}>GUADALAJARA · AL MES</div>
    {rows.map(([n, v, a]) => <div key={n} style={{ display: "flex", justifyContent: "space-between", clipPath: `inset(0 ${100 - 100 * e(t, a, a + 0.4)}% 0 0)`, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#333" }}><span>{n}</span><span>{v}</span></div>)}
    <div style={{ borderTop: "4px solid #b3261e", marginTop: 8, display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "#b3261e", opacity: e(t, totAt, totAt + 0.3) }}><span>+ de</span><span>$13,000</span></div>
  </div>;
};

// las pilas de monedas: el pueblo (1) contra la ciudad (más de 4)
export const Pilas: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const pile = (n: number, x: number, gray: boolean, a: number) => <div style={{ position: "absolute", left: x, bottom: 220, width: 200, filter: gray ? "grayscale(1)" : undefined }}>
    {Array.from({ length: Math.round(n * 9 * e(t, a, a + 1.4)) }, (_, i) => <div key={i} style={{ position: "absolute", left: Math.sin(i * 1.7) * 6, bottom: i * 16, width: 200, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 35%, #fff1b8, #e0b23c 50%, #9a6a12)", boxShadow: "0 3px 3px rgba(0,0,0,.4)" }} />)}
  </div>;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    {pile(1, 520, false, at)}{pile(4.4, 1200, true, at + 0.3)}
    <div style={{ position: "absolute", left: 520, bottom: 140, width: 200, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.maiz, textShadow: "0 6px 18px #000" }}>el pueblo</div>
    <div style={{ position: "absolute", left: 1200, bottom: 140, width: 200, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#ddd", textShadow: "0 6px 18px #000" }}>la ciudad</div>
    <div style={{ position: "absolute", left: 1450, top: 220, fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: "#fff", textShadow: "0 10px 30px #000", opacity: e(t, at + 1.4, at + 1.7) }}>×4</div>
  </div>;
};

// el frijol nuevo se cuece en 2 horas, el viejo en 5: dos relojitos de arena de olla
export const DosHoras: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const bar = (lbl: string, h: number, c: string, gray: boolean) => <div style={{ display: "flex", alignItems: "center", gap: 20, filter: gray ? "grayscale(1)" : undefined }}>
    <div style={{ width: 300, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#fff", textShadow: "0 4px 12px #000", textAlign: "right" }}>{lbl}</div>
    <div style={{ height: 60, width: 120 * h * ei(t, at + 0.2, at + 1.4), background: c, borderRadius: 12, boxShadow: sh }} />
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: "#fff", textShadow: "0 4px 12px #000" }}>{h} h</div></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 24 }}>
    {bar("frijol de este año", 2, CH.nopal, false)}{bar("frijol de bodega", 5, "#999", true)}
  </div>;
};

// un día de Chencho: la línea de la hora con soles chiquitos (6:00 · 8:00 · tortillas · tarde · 18:00)
export const DiaLinea: React.FC<{ t: number; at: number; out: number; marks: [string, string, number][]; y?: number }> = ({ t, at, out, marks, y = 930 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const n = marks.filter(([, , a]) => t >= a).length;
  const prog = n === 0 ? 0 : (n - 1 + e(t, marks[n - 1][2], marks[n - 1][2] + 0.6)) / (marks.length - 1);
  return <div style={{ position: "absolute", left: 160, top: y, width: 1600, opacity: o }}>
    <div style={{ position: "absolute", left: 0, top: 30, width: 1600, height: 10, borderRadius: 5, background: "rgba(255,255,255,.3)" }} />
    <div style={{ position: "absolute", left: 0, top: 30, width: 1600 * Math.min(1, prog), height: 10, borderRadius: 5, background: CH.maiz }} />
    {marks.map(([h, l, a], i) => <div key={h} style={{ position: "absolute", left: (1600 * i) / (marks.length - 1), top: 0, transform: "translateX(-50%)", textAlign: "center", opacity: 0.35 + 0.65 * e(t, a, a + 0.3) }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: t >= a ? CH.maiz : "#776", border: "6px solid #fff", margin: "0 auto" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: "#fff", textShadow: "0 4px 12px #000" }}>{h}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: "#fff", textShadow: "0 4px 12px #000", whiteSpace: "nowrap" }}>{l}</div></div>)}
  </div>;
};

// los saludos del camino: globitos que salen a los lados mientras Chencho va por las tortillas
export const Saludos: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const B: [string, number, number][] = [["¡Buenos días, don Chencho!", 300, 230], ["¿Ya supo lo de Toño?", 1340, 330], ["¡Pásele a un cafecito!", 380, 520], ["¿Cómo sigue Chayo?", 1300, 620]];
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>{B.map(([s2, x, y], i) => { const a = at + i * 0.9, k = Math.min(1, pop(t, a, 1.2)); return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: e(t, a, a + 0.12), transform: `scale(${k})`, transformOrigin: "0 100%", padding: "16px 28px", background: "#fffdf8", borderRadius: "28px 28px 28px 6px", boxShadow: sh, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.tinta }}>{s2}</div>; })}</div>;
};

// el reloj de arena: "me sobra tiempo para vivirla" (la arena casi no baja)
export const Arena: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = 0.15 * e(t, at, at + 6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, textAlign: "center" }}>
    <svg width={220} height={320} viewBox="0 0 220 320">
      <rect x={20} y={0} width={180} height={20} rx={8} fill="#6b4a2e" /><rect x={20} y={300} width={180} height={20} rx={8} fill="#6b4a2e" />
      <path d="M 40 20 L 180 20 L 115 160 L 180 300 L 40 300 L 105 160 Z" fill="rgba(220,235,245,.35)" stroke="#e9f2f7" strokeWidth={4} />
      <path d={`M ${50 + 60 * k} ${30 + 120 * k} L ${170 - 60 * k} ${30 + 120 * k} L 112 150 L 108 150 Z`} fill={CH.maiz} />
      <path d={`M 60 290 L 160 290 L ${150 - 10 * k} ${290 - 100 * k} L ${70 + 10 * k} ${290 - 100 * k} Z`} fill={CH.maiz} />
      <line x1={110} y1={152} x2={110} y2={290} stroke={CH.maiz} strokeWidth={2} />
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: "0 6px 18px #000" }}>me sobra tiempo</div>
  </div>;
};

// LO MALO, de frente: una tabla de lámina con los 4 puntos que se van marcando
export const LoMalo: React.FC<{ t: number; at: number; out: number; items: [string, number][]; x: number; y: number; sc?: number }> = ({ t, at, out, items, x, y, sc = 1 }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * Math.min(1, pop(t, at, 0.9))})`, width: 720, padding: "26px 36px", borderRadius: 16, background: "linear-gradient(160deg,#4a4f55,#2c3035)", boxShadow: sh, border: "6px solid #6d7278" }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 8, color: "#ff8a7a" }}>LO MALO</div>
    {items.map(([s2, a], i) => <div key={s2} style={{ display: "flex", gap: 20, alignItems: "baseline", marginTop: 10, opacity: 0.25 + 0.75 * e(t, a, a + 0.3) }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: "#ff8a7a", width: 50 }}>{i + 1}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#f4f1e6", clipPath: `inset(0 ${100 - 100 * e(t, a, a + 0.6)}% 0 0)` }}>{s2}</div></div>)}
  </div>;
};

// la señal "cuando quiere": rayitas que suben y se caen
export const Senal: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const lv = Math.floor(2.5 + 2.5 * Math.sin((t - at) * 3.1) * Math.sin((t - at) * 1.3));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${pop(t, at)})`, display: "flex", alignItems: "flex-end", gap: 14, padding: 30, background: "rgba(20,20,24,.75)", borderRadius: 24 }}>
    {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 40, height: 30 * i, borderRadius: 6, background: i <= lv ? "#7dff9a" : "rgba(255,255,255,.18)" }} />)}
    <div style={{ marginLeft: 20, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff" }}>{lv <= 1 ? "sin señal…" : "llega cuando quiere"}</div>
  </div>;
};

// si rentas: el renglón rojo de la renta + las dos barras (pueblo con renta vs ciudad) → la mitad
export const ConRenta: React.FC<{ t: number; at: number; mitadAt: number; out: number }> = ({ t, at, mitadAt, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const g = e(t, mitadAt - 0.4, mitadAt + 0.8);
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <div style={{ position: "absolute", left: 120, top: 140, ...pap({ padding: "16px 30px" }), transform: `rotate(-3deg) scale(${Math.min(1, pop(t, at))})` }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#b3261e" }}>+ renta de casita</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#b3261e" }}>$1,000 – $1,500</div></div>
    <div style={{ position: "absolute", left: 1150, bottom: 160, display: "flex", gap: 60, alignItems: "flex-end", opacity: e(t, mitadAt - 0.6, mitadAt - 0.3) }}>
      {[["pueblo + renta", 4450, CH.maiz], ["la ciudad", 13200, "#9aa0a6"]].map(([l, v, c]) => <div key={l as string} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: "#fff", textShadow: "0 4px 12px #000" }}>${fmt(Math.round((v as number) * g))}</div>
        <div style={{ width: 180, height: 520 * ((v as number) / 13200) * g, background: c as string, borderRadius: "12px 12px 0 0", boxShadow: sh }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#fff", textShadow: "0 4px 12px #000" }}>{l as string}</div></div>)}
    </div>
  </div>;
};

// los 3 consejos: tres tarjetas de cuaderno numeradas que se van poniendo en la mesa
export const Consejos: React.FC<{ t: number; out: number; items: [string, string, number][]; x: number; y: number; sc?: number }> = ({ t, out, items, x, y, sc = 1 }) => {
  const o = oo(t, items[0][2], out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc})`, display: "flex", gap: 28 }}>
    {items.map(([a, b, w], i) => { const k = Math.min(1, pop(t, w, 0.9)); return <div key={i} style={{ width: 400, ...pap({ padding: "20px 26px" }), opacity: e(t, w, w + 0.12), transform: `translateY(${(1 - k) * 300}px) rotate(${(i - 1) * 3}deg)` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CH.guinda, lineHeight: 1 }}>{i + 1}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.tinta, lineHeight: 1.05 }}>{a}</div>
      <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#7a6a52", letterSpacing: 1 }}>{b}</div></div>; })}
  </div>;
};

// la tarea: una hoja con los 7 días y "hasta el chicle"
export const Tarea: React.FC<{ t: number; at: number; chicleAt: number; sumaAt: number; out: number; x: number; y: number }> = ({ t, at, chicleAt, sumaAt, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const D = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(2deg) scale(${Math.min(1, pop(t, at))})`, width: 560, ...pap({ padding: "22px 30px", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 54px, rgba(70,110,170,.25) 54px 56px)" }) }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: 6, color: CH.guinda }}>TAREA · LA COMIDA</div>
    {D.map((d, i) => <div key={d} style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 700, fontSize: 42, color: CH.tinta, opacity: 0.3 + 0.7 * e(t, at + 0.3 + i * 0.25, at + 0.5 + i * 0.25) }}><span>{d}</span><span>$ ____</span></div>)}
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#b3261e", opacity: e(t, chicleAt, chicleAt + 0.3) }}>¡hasta el chicle!</div>
    <div style={{ borderTop: "3px solid " + CH.tinta, marginTop: 6, fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CH.tinta, opacity: e(t, sumaAt, sumaAt + 0.3) }}>el domingo: SUMA</div>
  </div>;
};

// ¿de qué pueblo eres? el contorno de México (vector, coordenadas reales simplificadas) y alfileres "¿$?"; el de Chencho: $22
const MX: [number, number][] = [[-117.1, 32.5], [-116.5, 31.5], [-116, 30.3], [-115.2, 29.4], [-114.2, 28], [-114.1, 27.5], [-113, 26.8], [-112.2, 25.8], [-112.1, 24.8], [-111, 24], [-110, 22.9],
  [-109.4, 23.2], [-110.3, 24.2], [-110.7, 24.8], [-111.3, 25.9], [-111.6, 26.6], [-112.4, 27.6], [-113.1, 28.8], [-113.6, 29.6], [-114.6, 30.8], [-114.8, 31.8],
  [-113, 31.3], [-112.2, 30], [-111.3, 28.8], [-110.6, 27.9], [-109.5, 26.7], [-109.2, 25.6], [-108, 25], [-107, 24], [-106, 22.8], [-105.5, 21.5], [-105.3, 20.4],
  [-104.4, 19.1], [-103.5, 18.3], [-102.2, 17.9], [-101, 17.2], [-99.8, 16.7], [-98.5, 16.2], [-97, 15.8], [-96, 15.7], [-95, 16.2], [-94.2, 16.1], [-93, 15.4], [-92.2, 14.6],
  [-92.2, 15.3], [-91.7, 16.1], [-90.4, 16.1], [-91.4, 17.3], [-91, 17.8], [-89.15, 17.8], [-88.3, 18.5], [-87.5, 19.8], [-87, 21], [-86.8, 21.5], [-87.5, 21.5], [-88.5, 21.4],
  [-90.3, 21.1], [-90.5, 20], [-91, 19], [-91.8, 18.6], [-92.8, 18.5], [-94, 18.2], [-94.8, 18.5], [-95.9, 18.8], [-96.5, 19.8], [-97.2, 20.6], [-97.7, 21.8], [-97.8, 22.8],
  [-97.7, 24.2], [-97.5, 25.4], [-97.2, 25.9], [-99, 26.4], [-99.6, 27.5], [-100.5, 28.5], [-101.4, 29.8], [-102.4, 29.8], [-103, 29], [-104, 29.4], [-104.7, 30.2],
  [-105, 30.7], [-106.4, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111.1, 31.3], [-114.8, 32.5]];
const mx = (lon: number, lat: number): [number, number] => [(lon + 118) * 44 + 420, (33 - lat) * 44 + 140];
const MXD = "M " + MX.map(([a, b]) => mx(a, b).map((v) => v.toFixed(0)).join(" ")).join(" L ") + " Z";
const PUEBLOS: [number, number][] = [[-103.3, 20.7], [-96.7, 17.1], [-98.2, 19], [-102.6, 22.8], [-106.1, 28.6], [-96.1, 19.2], [-89.6, 20.9], [-101.6, 19.5], [-101.3, 21], [-107.4, 24.8], [-92.6, 16.7], [-100.3, 25.7]];
export const MapaPueblos: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <path d={MXD} fill="rgba(242,193,78,.22)" stroke={CH.maiz} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={`${e(t, at, at + 1.2)} 1`} />
    {PUEBLOS.map(([lo, la], i) => { const [x, y] = mx(lo, la), me = i === 7, a = at + (me ? 0.9 : 1.2 + i * 0.22), k = Math.min(1, spr(t, a, 1.3)); return <g key={i} opacity={e(t, a, a + 0.1)} transform={`translate(${x},${y - 30 * (1 - k)}) scale(${me ? 1.3 : 1})`}>
      <path d="M 0 0 C -20 -24 -20 -50 0 -50 C 20 -50 20 -24 0 0 Z" fill={me ? CH.guinda : CH.barro} stroke="#fff" strokeWidth={3} />
      <text x={0} y={-60} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={34} fill={me ? CH.maiz : "#fff"} style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 5 }}>{me ? "aquí $22" : "¿$?"}</text></g>; })}
  </svg>;
};

// el billete de $500 que entra a la bolsa del mandado (el próximo video)
export const Billete500: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, pop(t, at, 0.8));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-8 + 8 * (1 - k)}deg) scale(${k})` }}>
    <div style={{ width: 520, height: 240, borderRadius: 16, background: "linear-gradient(135deg,#8fb6d6,#5a8ab0)", boxShadow: sh, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: 18, fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#123" }}>500</div>
      <div style={{ position: "absolute", right: 26, bottom: 14, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#123", letterSpacing: 4 }}>PESOS</div>
      <div style={{ position: "absolute", left: 230, top: 40, width: 140, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.25)" }} />
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(60deg, rgba(255,255,255,.08) 0 6px, transparent 6px 14px)" }} />
    </div>
    <div style={{ marginTop: 16, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#fff", textShadow: "0 6px 18px #000" }}>¿qué alcanza en el tianguis?</div>
  </div>;
};

// el cierre: la frase escrita a mano grande sobre el portón al anochecer
export const FinalFrase: React.FC<{ t: number; at: number; at2: number }> = ({ t, at, at2 }) => {
  const w1 = e(t, at, at + 1.2), w2 = e(t, at2, at2 + 0.8); if (w1 <= 0.01) return null;
  return <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%) rotate(-3deg)", textAlign: "center", fontFamily: HAND, fontWeight: 700, color: "#fff8e6", textShadow: "0 8px 26px rgba(0,0,0,.85)" }}>
    <div style={{ fontSize: 96, clipPath: `inset(-20% ${100 - 100 * w1}% -20% 0)` }}>la vida no es más barata…</div>
    <div style={{ fontSize: 150, color: CH.maiz, clipPath: `inset(-20% ${100 - 100 * w2}% -20% 0)` }}>es más de uno.</div>
  </div>;
};

// foto real dentro de un marco de lámina (para lo que se cuenta junto al avatar)
export const Marco: React.FC<{ t: number; at: number; out: number; img: string; x: number; y: number; w?: number; cap?: string }> = ({ t, at, out, img, x, y, w = 560, cap }) => {
  const o = oo(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.9));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 500}px) rotate(-3deg)` }}>
    <div style={{ padding: 14, background: "linear-gradient(160deg,#e9e4d8,#a39c8d)", borderRadius: 14, boxShadow: sh }}>
      <div style={{ width: w, height: w * 0.62, overflow: "hidden", borderRadius: 6 }}><Img src={staticFile(P + img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * e(t, at, at + 5)})` }} /></div>
    </div>
    {cap && <div style={{ marginTop: 10, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: "#fff", textShadow: "0 6px 18px #000" }}>{cap}</div>}
  </div>;
};
