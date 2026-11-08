import React from "react";
import { BR, cl, DIM, eio, H, HAND, lerp, MZ, RED, rnd, Stage, Tag, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const e1 = (tt: number, a: number, d = 0.4) => cl((tt - a) / d);
const AZ = "#5fc4ff", OXI = "#c8662a", PIEL = "linear-gradient(160deg,#c99a74,#94643f)", ACERO = "linear-gradient(180deg,#e7ebee,#8b9298 55%,#c9ced3)";
const SVG: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>;
const Txt: React.FC<{ x: number; y: number; w?: number; size?: number; col?: string; o?: number; children: React.ReactNode; weight?: number }> = ({ x, y, w = 700, size = 56, col = TX, o = 1, children, weight = 900 }) => (
  <div style={ab(x - w / 2, y, { width: w, textAlign: "center", fontSize: size, fontWeight: weight, color: col, opacity: o, lineHeight: 1.08, textShadow: "0 5px 18px rgba(0,0,0,.7)" })}>{children}</div>
);
// lavadora de frente, de verdad: panel, perilla, puerta redonda, tapita del filtro y patas
const Lav: React.FC<{ x: number; y: number; w?: number; rot?: number; inner?: React.ReactNode }> = ({ x, y, w = 440, rot = 0, inner }) => {
  const k = w / 440, d = 300 * k;
  return <div style={ab(x, y, { width: w, height: 590 * k, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%" })}>
    {[46, 356].map((l) => <div key={l} style={ab(l * k, 566 * k, { width: 38 * k, height: 30 * k, borderRadius: 4, background: "#3a3d42" })} />)}
    <div style={ab(0, 0, { width: w, height: 570 * k, borderRadius: 18 * k, background: "linear-gradient(120deg,#fbfcfc,#d9dee1 70%,#b9c0c5)", boxShadow: "0 34px 70px rgba(0,0,0,.6)" })} />
    <div style={ab(16 * k, 14 * k, { width: 408 * k, height: 84 * k, borderRadius: 10 * k, background: "linear-gradient(#e9edef,#c9d0d4)" })} />
    <div style={ab(320 * k, 26 * k, { width: 60 * k, height: 60 * k, borderRadius: "50%", background: ACERO, boxShadow: "0 3px 8px rgba(0,0,0,.4)" })} />
    <div style={ab(40 * k, 32 * k, { width: 110 * k, height: 44 * k, borderRadius: 6 * k, background: "#9aa3a9" })} />
    <div style={ab(70 * k, 122 * k, { width: d, height: d, borderRadius: "50%", background: "#8b9298", boxShadow: "inset 0 0 0 10px #aeb6bb" })}>
      <div style={ab(26 * k, 26 * k, { width: 248 * k, height: 248 * k, borderRadius: "50%", background: "radial-gradient(circle at 40% 34%,#3f4a54,#14191f 72%)", overflow: "hidden" })}>{inner}</div>
    </div>
    <div style={ab(320 * k, 486 * k, { width: 90 * k, height: 60 * k, borderRadius: 6 * k, border: "2px solid #a9b1b6" })} />
  </div>;
};
// tambor en corte: agujeros que giran
const Tambor: React.FC<{ x: number; y: number; r: number; ang?: number; children?: React.ReactNode }> = ({ x, y, r, ang = 0, children }) => <div style={ab(x - r, y - r, { width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle,#39424b,#1a2026 72%)", boxShadow: "0 0 0 14px #9aa3a9, 0 0 0 20px #6a7278" })}>
  {Array.from({ length: 34 }, (_, i) => { const a = (i * 360) / 34 + ang, R = r - 18; return <div key={i} style={ab(r + Math.cos((a * Math.PI) / 180) * R - 5, r + Math.sin((a * Math.PI) / 180) * R - 5, { width: 10, height: 10, borderRadius: "50%", background: "#07090b" })} />; })}
  {children}
</div>;
const Mano: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => <div style={ab(x, y, { width: 150, height: 240, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})` })}>
  {[0, 1, 2, 3].map((i) => <div key={i} style={ab(8 + i * 34, 10 - [6, 0, 2, 12][i], { width: 30, height: 120, borderRadius: 15, background: PIEL })} />)}
  <div style={ab(4, 92, { width: 142, height: 130, borderRadius: 34, background: PIEL })} />
  <div style={ab(-34, 130, { width: 62, height: 34, borderRadius: 17, background: PIEL, transform: "rotate(-34deg)" })} />
</div>;
const Puno: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => <div style={ab(x, y, { width: 170, height: 150, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})` })}>
  <div style={ab(0, 20, { width: 170, height: 130, borderRadius: 40, background: PIEL, boxShadow: "0 14px 26px rgba(0,0,0,.45)" })} />
  {[0, 1, 2, 3].map((i) => <div key={i} style={ab(14 + i * 38, 0, { width: 36, height: 64, borderRadius: 18, background: PIEL, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.12)" })} />)}
  <div style={ab(-20, 70, { width: 70, height: 44, borderRadius: 22, background: PIEL, transform: "rotate(-20deg)" })} />
</div>;
const Muelle: React.FC<{ x: number; y1: number; y2: number; col?: string; w?: number }> = ({ x, y1, y2, col = "#c9ced3", w = 34 }) => { const n = 12, st = (y2 - y1) / n; let d = `M${x} ${y1}`; for (let i = 1; i <= n; i++) d += ` L${x + (i === n ? 0 : i % 2 ? w : -w)} ${y1 + st * i}`; return <path d={d} fill="none" stroke={col} strokeWidth={8} strokeLinejoin="round" />; };


// helpers propios de tec5nd
const Bidon: React.FC<{ x: number; y: number; s?: number; rot?: number; lvl?: number }> = ({ x, y, s = 1, rot = 0, lvl = 0.8 }) => <div style={ab(x, y, { width: 260 * s, height: 380 * s, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%" })}>
  <div style={ab(150 * s, 0, { width: 70 * s, height: 50 * s, borderRadius: 8 * s, background: "#e9edf0", border: "3px solid #b9c2c8" })} />
  <div style={ab(40 * s, 30 * s, { width: 120 * s, height: 70 * s, borderRadius: `${40 * s}px ${40 * s}px 0 0`, border: `${14 * s}px solid rgba(240,244,246,.85)`, borderBottom: "none" })} />
  <div style={ab(0, 80 * s, { width: 260 * s, height: 300 * s, borderRadius: 26 * s, background: "rgba(236,241,244,.55)", border: "4px solid rgba(255,255,255,.75)", overflow: "hidden", boxShadow: "0 24px 50px rgba(0,0,0,.5)" })}>
    <div style={ab(0, 300 * s * (1 - lvl), { width: 260 * s, height: 300 * s * lvl, background: "linear-gradient(rgba(250,246,226,.75),rgba(230,224,196,.85))" })} />
  </div>
</div>;
const Gota: React.FC<{ x: number; y: number; s?: number; col?: string; o?: number }> = ({ x, y, s = 1, col = "#e9e2bf", o = 1 }) => <div style={ab(x - 14 * s, y - 20 * s, { width: 28 * s, height: 40 * s, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: col, opacity: o, boxShadow: "inset -4px -6px 0 rgba(0,0,0,.12)" })} />;
const GOMA = "#3d4247", GOMA_T = "#6b6258";
// el fuelle en corte: un arco de goma con su pliegue de abajo
const Fuelle: React.FC<{ x: number; y: number; r?: number; col?: string; cracks?: number; tt?: number }> = ({ x, y, r = 300, col = GOMA, cracks = 0, tt = 0 }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
  <circle cx={x} cy={y} r={r} fill="none" stroke={col} strokeWidth={78} />
  <circle cx={x} cy={y} r={r - 30} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={6} />
  <circle cx={x} cy={y} r={r + 30} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={5} />
  {Array.from({ length: 9 }, (_, i) => { const a = (60 + i * 7) * Math.PI / 180, k = cl(cracks * 9 - i); const x1 = x + Math.cos(a) * (r - 34), y1 = y + Math.sin(a) * (r - 34), x2 = x + Math.cos(a + 0.03) * (r - 34 + 68 * k), y2 = y + Math.sin(a + 0.03) * (r - 34 + 68 * k);
    return <path key={i} d={`M${x1} ${y1} L${(x1 + x2) / 2 + 6} ${(y1 + y2) / 2} L${x2} ${y2}`} stroke="#0d0f11" strokeWidth={5} fill="none" opacity={k > 0 ? 1 : 0} />; })}
</svg>;
const Taza: React.FC<{ x: number; y: number; lvl: number; w?: number; marks?: boolean }> = ({ x, y, lvl, w = 300, marks = true }) => <div style={ab(x, y, { width: w, height: w * 1.1 })}>
  <div style={ab(0, 0, { width: w, height: w * 1.1, borderRadius: `8px 8px ${w * 0.12}px ${w * 0.12}px`, background: "rgba(220,235,245,.22)", border: "5px solid rgba(235,245,250,.85)", overflow: "hidden" })}>
    <div style={ab(0, w * 1.1 * (1 - lvl), { width: w, height: w * 1.1 * lvl, background: "linear-gradient(rgba(250,244,214,.85),rgba(226,214,170,.9))" })} />
    {marks && [0.25, 0.5, 0.75].map((m) => <div key={m} style={ab(0, w * 1.1 * (1 - m), { width: w * 0.3, height: 4, background: "#e64a3b" })} />)}
  </div>
  <div style={ab(w - 6, w * 0.22, { width: w * 0.3, height: w * 0.55, borderRadius: `0 ${w}px ${w}px 0`, border: "16px solid rgba(235,245,250,.75)", borderLeft: "none" })} />
</div>;
const Check: React.FC<{ x: number; y: number; ok: boolean; o?: number; s?: number }> = ({ x, y, ok, o = 1, s = 1 }) => <div style={ab(x - 60 * s, y - 60 * s, { width: 120 * s, height: 120 * s, borderRadius: "50%", background: ok ? VER : RED, opacity: o, color: "#fff", fontSize: 84 * s, fontWeight: 900, textAlign: "center", lineHeight: `${118 * s}px`, boxShadow: "0 10px 26px rgba(0,0,0,.5)" })}>{ok ? "✓" : "✕"}</div>;
const Barra: React.FC<{ x: number; y: number; w: number; k: number; col: string; h?: number }> = ({ x, y, w, k, col, h = 56 }) => <div style={ab(x, y, { width: w, height: h, borderRadius: h / 2, background: "rgba(0,0,0,.45)", border: "3px solid rgba(255,255,255,.18)", overflow: "hidden" })}><div style={ab(0, 0, { width: w * k, height: h, background: col })} /></div>;

// 1 · el bidón en el cajón: cada lavado cae una taza y el contador del año sube
const Cajon: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1b2026" mesa={false}>{(tt) => {
  const p = eio(tt, 0.2, 1.0), drops = Math.floor(cl((tt - 1.0) / 2.6) * 7), n = Math.round(cl((tt - 1.0) / 2.6) * 208);
  return <>
    <div style={ab(280, 520, { width: 620, height: 260, borderRadius: 14, background: "linear-gradient(#f1f4f5,#cfd6da)", boxShadow: "0 26px 60px rgba(0,0,0,.6)" })}>
      {[0, 1, 2].map((i) => <div key={i} style={ab(30 + i * 196, 40, { width: 170, height: 180, borderRadius: 10, background: "#b9c2c8", boxShadow: "inset 0 8px 18px rgba(0,0,0,.25)" })} />)}
    </div>
    <Bidon x={380} y={80} s={0.85} rot={-115 * p} lvl={0.85 - 0.3 * cl((tt - 1) / 3)} />
    {Array.from({ length: drops }, (_, i) => <Gota key={i} x={420 + (i % 2) * 40} y={460 + ((tt * 420 + i * 70) % 90)} s={1.2} />)}
    <Txt x={1380} y={250} w={760} size={64} col={DIM}>TAZAS EN UN AÑO</Txt>
    <div style={ab(1000, 340, { width: 760, textAlign: "center", fontSize: 300, fontWeight: 900, color: MZ, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: "0 16px 40px rgba(0,0,0,.6)" })}>{n}</div>
    <Tag tt={tt} at={3.4} x={1380} y={720} txt="EN EL MISMO PLIEGUE" col={RED} size={58} />
  </>;
}}</Stage>;

// 2 · la goma de la puerta un año después: las grietas se dibujan en el pliegue de abajo
const Grieta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#15191d" mesa={false}>{(tt) => {
  const c = eio(tt, 0.6, 2.6), ti = eio(tt, 0.2, 1.4);
  return <>
    <Fuelle x={960} y={580} r={360} col={`rgb(${61 + 50 * c},${66 + 32 * c},${71 + 17 * c})`} cracks={c} tt={tt} />
    <div style={ab(460, 70, { width: 1000, opacity: ti, textAlign: "center", fontSize: 92, fontWeight: 900, color: TX, textShadow: "0 6px 20px rgba(0,0,0,.8)" })}>1 AÑO DESPUÉS</div>
    <Tag tt={tt} at={2.3} x={420} y={960} txt="GRIETA" col={RED} size={64} />
    <Tag tt={tt} at={2.9} x={1500} y={960} txt="DURA COMO PLÁSTICO" col={MZ} size={58} />
  </>;
}}</Stage>;

// 3 · qué es el vinagre: un vaso que se separa en 95 de agua y 5 de ácido
const Cinco: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#151d24" mesa={false}>{(tt) => {
  const s = eio(tt, 0.8, 2.0);
  return <>
    <div style={ab(560, 140, { width: 360, height: 760, borderRadius: "10px 10px 46px 46px", border: "6px solid rgba(235,245,250,.85)", overflow: "hidden", background: "rgba(220,235,245,.08)" })}>
      <div style={ab(0, 40, { width: 360, height: 720 - 36 * s - 4, background: "rgba(140,195,235,.55)" })} />
      <div style={ab(0, 720 - 36 * s + 40, { width: 360, height: 36 * s + 4 + 20 * (1 - s), background: s > 0.05 ? "#e8b23a" : "rgba(140,195,235,.55)" })} />
    </div>
    <div style={{ opacity: s }}>
      <div style={ab(980, 330, { fontSize: 210, fontWeight: 900, color: "#8cc3eb", lineHeight: 1 })}>95%</div>
      <div style={ab(990, 540, { fontSize: 64, fontWeight: 900, color: TX })}>AGUA</div>
      <div style={ab(980, 700, { fontSize: 120, fontWeight: 900, color: "#e8b23a", lineHeight: 1 })}>5%</div>
      <div style={ab(1240, 720, { fontSize: 58, fontWeight: 900, color: TX })}>ÁCIDO ACÉTICO</div>
    </div>
    <Tag tt={tt} at={2.8} x={960} y={70} txt="UN ÁCIDO SUAVE, PERO ÁCIDO" col={MZ} size={60} />
  </>;
}}</Stage>;

// 4 · sarro contra grasa: la costra blanca se deshace, la mancha grasosa no se mueve
const SarroGrasa: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1f24" mesa={false}>{(tt) => {
  const d = eio(tt, 0.8, 2.6);
  return <>
    <Txt x={500} y={110} w={760} size={72} col={TX}>SARRO</Txt>
    <Txt x={1420} y={110} w={760} size={72} col={TX}>GRASA</Txt>
    <div style={ab(959, 120, { width: 3, height: 860, background: "rgba(255,255,255,.2)" })} />
    <div style={ab(220, 320, { width: 560, height: 420, borderRadius: 30, background: "linear-gradient(135deg,#8b9298,#5a6168)" })}>
      {Array.from({ length: 26 }, (_, i) => <div key={i} style={ab(30 + rnd(i) * 470, 30 + rnd(i + 9) * 330, { width: 50 + rnd(i + 3) * 40, height: 36 + rnd(i + 5) * 30, borderRadius: "40%", background: "#eceae2", opacity: 1 - d * (0.7 + rnd(i + 2) * 0.3), transform: `scale(${1 - d * 0.6})` })} />)}
    </div>
    <div style={ab(1140, 320, { width: 560, height: 420, borderRadius: 30, background: "linear-gradient(135deg,#8b9298,#5a6168)" })}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={ab(60 + rnd(i + 30) * 380, 50 + rnd(i + 40) * 260, { width: 120 + rnd(i) * 90, height: 80 + rnd(i + 1) * 60, borderRadius: "50%", background: "radial-gradient(#5a4a2a,#3a2f1a)", opacity: 0.85 })} />)}
    </div>
    {[[500, 520], [1420, 520]].map(([x, y], i) => <div key={i} style={{ opacity: e1(tt, 0.4) }}>{Array.from({ length: 5 }, (_, j) => <Gota key={j} x={x - 200 + j * 100} y={260 + ((tt * 300 + j * 60) % 70)} s={1} />)}</div>)}
    <Check x={500} y={860} ok o={e1(tt, 2.8)} />
    <Check x={1420} y={860} ok={false} o={e1(tt, 3.2)} />
  </>;
}}</Stage>;

// 5 · el lodo detrás del tambor: cuatro capas que se apilan donde no ves
const Lodo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#171a1d" mesa={false}>{(tt) => {
  const L = [{ l: "GRASA DE LA PIEL", c: "#8a6a3e" }, { l: "DETERGENTE", c: "#6f7f8c" }, { l: "SUAVIZANTE", c: "#7b6a8e" }, { l: "PELUSA", c: "#9a948a" }];
  return <>
    <div style={ab(200, 140, { width: 760, height: 760, borderRadius: "50%", background: "#2b3036", boxShadow: "inset 0 0 0 30px #4a5158" })}>
      <div style={ab(90, 90, { width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#9aa2a8,#5c646b)" })} />
    </div>
    {L.map((a, i) => { const k = eio(tt, 0.4 + i * 0.7, 1.0 + i * 0.7); return <div key={i}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><circle cx={580} cy={520} r={395 + i * 16} fill="none" stroke={a.c} strokeWidth={16} strokeDasharray={`${2480 * k} 9999`} transform="rotate(90 580 520)" opacity={0.95} /></svg>
      <div style={ab(1100, 230 + i * 150, { width: 720, opacity: k, fontSize: 60, fontWeight: 900, color: a.c, textShadow: "0 4px 12px rgba(0,0,0,.6)" })}>+ {a.l}</div>
    </div>; })}
    <Tag tt={tt} at={3.4} x={1460} y={880} txt="= EL OLOR" col={RED} size={74} />
  </>;
}}</Stage>;

// 6 · el olor vuelve: termómetro de olor día por día
const OlorVuelve: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a1d22" mesa={false}>{(tt) => {
  const D = [{ d: "DÍA 1", v: 0.2, l: "huele a vinagre" }, { d: "DÍA 2", v: 0.45, l: "" }, { d: "DÍA 3", v: 0.8, l: "humedad otra vez" }];
  return <>
    <Txt x={960} y={90} w={1400} size={66} col={TX}>EL OLOR A HUMEDAD</Txt>
    {D.map((a, i) => { const k = eio(tt, 0.5 + i * 0.9, 1.2 + i * 0.9); return <div key={i}>
      <div style={ab(330 + i * 470, 820 - 560 * a.v * k, { width: 240, height: 560 * a.v * k, borderRadius: "18px 18px 0 0", background: i === 0 ? VER : i === 1 ? MZ : RED })} />
      <div style={ab(300 + i * 470, 850, { width: 300, textAlign: "center", fontSize: 60, fontWeight: 900, color: TX })}>{a.d}</div>
      {a.l && <div style={ab(250 + i * 470, 760 - 560 * a.v * k, { width: 400, textAlign: "center", fontSize: 40, fontWeight: 800, color: DIM, opacity: k })}>{a.l}</div>}
    </div>; })}
    <div style={ab(250, 822, { width: 1420, height: 4, background: DIM })} />
  </>;
}}</Stage>;

// 7 · tiempo de contacto: 5 minutos de enjuague contra una noche de remojo
const Contacto: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#141a20" mesa={false}>{(tt) => {
  const a = eio(tt, 0.4, 1.2), b = eio(tt, 1.4, 3.4);
  return <>
    <Txt x={960} y={90} w={1500} size={70} col={MZ}>TIEMPO DE CONTACTO</Txt>
    <div style={ab(160, 330, { fontSize: 54, fontWeight: 900, color: TX })}>ENJUAGUE · 5 MIN</div>
    <Barra x={160} y={410} w={1600} k={0.007 + 0.003 * a} col={VER} h={80} />
    <div style={ab(160, 600, { fontSize: 54, fontWeight: 900, color: TX })}>REMOJO · TODA LA NOCHE</div>
    <Barra x={160} y={680} w={1600} k={b} col={RED} h={80} />
    <div style={ab(1440, 790, { fontSize: 120, fontWeight: 900, color: RED, opacity: b, fontVariantNumeric: "tabular-nums" })}>{Math.round(b * 12)} h</div>
    <Tag tt={tt} at={3.6} x={600} y={880} txt="×144 MÁS TIEMPO" col={RED} size={60} />
  </>;
}}</Stage>;

// 8 · las cuatro gomas: la lavadora transparente y cada sello que se enciende
const CuatroGomas: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#161b21" mesa={false}>{(tt) => {
  const P = [{ x: 560, y: 470, l: "1 · FUELLE DE LA PUERTA" }, { x: 820, y: 260, l: "2 · MANGUERAS" }, { x: 860, y: 860, l: "3 · SELLO DE LA BOMBA" }, { x: 730, y: 560, l: "4 · RETÉN DEL TAMBOR" }];
  return <>
    <div style={ab(380, 160, { width: 700, height: 800, borderRadius: 30, border: "5px solid rgba(235,245,250,.5)", background: "rgba(200,220,235,.06)" })} />
    <div style={ab(470, 300, { width: 520, height: 520, borderRadius: "50%", border: "4px dashed rgba(235,245,250,.35)" })} />
    <div style={ab(760, 230, { width: 300, height: 14, background: "rgba(235,245,250,.35)", borderRadius: 7 })} />
    <div style={ab(800, 860, { width: 140, height: 70, borderRadius: 20, border: "4px solid rgba(235,245,250,.35)" })} />
    {P.map((p, i) => { const k = e1(tt, 0.4 + i * 0.75), pul = 1 + 0.15 * Math.sin(tt * 7 + i); return <div key={i}>
      <div style={ab(p.x - 38, p.y - 38, { width: 76, height: 76, borderRadius: "50%", background: i === 3 ? RED : MZ, opacity: k, transform: `scale(${k * pul})`, boxShadow: `0 0 30px ${i === 3 ? RED : MZ}` })} />
      <div style={ab(1140, 250 + i * 170, { width: 760, fontSize: 50, whiteSpace: "nowrap", fontWeight: 900, color: i === 3 ? RED : TX, opacity: k })}>{p.l}</div>
    </div>; })}
  </>;
}}</Stage>;

// 9 · el retén: entra agua al rodamiento, el óxido avanza y el precio sube
const Reten: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#191a1d" mesa={false}>{(tt) => {
  const w = eio(tt, 0.6, 1.8), o = eio(tt, 1.6, 3.2), p = Math.round(eio(tt, 2.2, 3.8) * 90);
  return <>
    <div style={ab(200, 470, { width: 1000, height: 90, background: ACERO, borderRadius: 12 })} />
    <div style={ab(520, 380, { width: 70, height: 270, borderRadius: 14, background: GOMA, boxShadow: "0 0 0 4px #20252a" })} />
    {[700, 900].map((x) => <div key={x} style={ab(x, 360, { width: 150, height: 310, borderRadius: 30, background: `linear-gradient(${o > 0.3 ? OXI : "#b8bfc5"},#6c737a)`, border: "4px solid #2b3036" })}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={ab(45, 20 + i * 56, { width: 60, height: 50, borderRadius: "50%", background: `rgb(${200 - 20 * o + 0},${200 - 110 * o},${205 - 160 * o})` })} />)}
    </div>)}
    {Array.from({ length: 6 }, (_, i) => <Gota key={i} x={600 + ((tt * 160 + i * 40) % 260)} y={420 + (i % 3) * 70} s={0.9} col="#8cc3eb" o={w} />)}
    <Txt x={1560} y={250} w={600} size={56} col={DIM}>LA REPARACIÓN</Txt>
    <div style={ab(1260, 350, { width: 600, textAlign: "center", fontSize: 220, fontWeight: 900, color: RED, lineHeight: 1 })}>{p}%</div>
    <Txt x={1560} y={620} w={600} size={52} col={TX}>DE UNA LAVADORA NUEVA</Txt>
    <Tag tt={tt} at={1.0} x={555} y={300} txt="RETÉN" col={MZ} size={50} />
  </>;
}}</Stage>;

// 10 · la prueba del taller: misma máquina, dos tratamientos, dos resultados
const PruebaTaller: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1e23" mesa={false}>{(tt) => {
  const a = eio(tt, 0.4, 1.6), b = eio(tt, 1.8, 3.2);
  return <>
    <Txt x={500} y={90} w={800} size={56} col={TX}>2 L DE VINAGRE</Txt>
    <Txt x={1420} y={90} w={800} size={56} col={TX}>BLANQUEADOR DE OXÍGENO</Txt>
    <Lav x={300} y={230} w={400} inner={<div style={ab(0, 0, { width: 300, height: 300, background: `rgba(230,220,170,${0.5 * a})` })} />} />
    <Lav x={1220} y={230} w={400} inner={<div style={ab(0, 0, { width: 300, height: 300, background: `rgba(120,120,110,${0.85 * b})` })}>{Array.from({ length: 14 }, (_, i) => <div key={i} style={ab(30 + rnd(i) * 200, 30 + ((tt * 80 + rnd(i + 4) * 200) % 220), { width: 14, height: 10, borderRadius: 4, background: "#111", opacity: b })} />)}</div>} />
    <div style={ab(250, 860, { width: 500, textAlign: "center", fontSize: 50, fontWeight: 900, color: RED, opacity: e1(tt, 2.0) })}>A LOS 2 DÍAS: EL OLOR VOLVIÓ</div>
    <div style={ab(1170, 860, { width: 500, textAlign: "center", fontSize: 50, fontWeight: 900, color: VER, opacity: e1(tt, 3.3) })}>SALIÓ EL AGUA GRIS</div>
  </>;
}}</Stage>;

// 11 · herramienta equivocada: el martillo golpea el tornillo y no entra
const Martillo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1c1a" mesa={false}>{(tt) => {
  const sw = Math.max(0, Math.sin(tt * 4.2)), hits = Math.floor(tt * 4.2 / Math.PI);
  return <>
    <div style={ab(860, 700, { width: 200, height: 260, background: "linear-gradient(90deg,#8a6a43,#6b5033)", borderRadius: 8 })} />
    <div style={ab(925, 560, { width: 70, height: 150, background: ACERO, borderRadius: "6px 6px 0 0" })}>{[0, 1, 2, 3].map((i) => <div key={i} style={ab(0, 20 + i * 32, { width: 70, height: 6, background: "rgba(0,0,0,.3)", transform: "skewY(-10deg)" })} />)}</div>
    <div style={ab(900, 530, { width: 120, height: 40, borderRadius: "50%", background: "#c9ced3", border: "3px solid #8b9298" })} />
    <div style={ab(960, 440, { width: 520, height: 40, transform: `rotate(${38 * (1 - sw)}deg)`, transformOrigin: "100% 50%" })}>
      <div style={ab(40, 0, { width: 480, height: 40, borderRadius: 12, background: "linear-gradient(#a37a4c,#7a5634)" })} />
      <div style={ab(-50, -50, { width: 110, height: 140, borderRadius: 14, background: "linear-gradient(90deg,#5d6369,#2f3438)" })} />
    </div>
    {sw > 0.96 && <Tag tt={1} at={0} x={1180} y={520} txt="¡TAC!" col={MZ} size={80} />}
    <Txt x={420} y={300} w={600} size={60} col={TX}>ALGO HACE…</Txt>
    <div style={ab(1180, 700, { width: 640, textAlign: "center", fontSize: 60, fontWeight: 900, color: RED, opacity: e1(tt, 2.4) })}>PERO NO ES PARA ESO</div>
    <div style={ab(200, 860, { width: 500, fontSize: 40, color: DIM, opacity: hits > 0 ? 1 : 0 })}>golpes: {hits}</div>
  </>;
}}</Stage>;

// 12 · media taza: la taza llega a la raya de 120 ml y va al compartimento del suavizante
const MediaTaza: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#18202a" mesa={false}>{(tt) => {
  const f = eio(tt, 0.3, 1.6) * 0.5, g = eio(tt, 2.0, 3.2);
  return <>
    <div style={ab(360, 300, { width: 330, height: 363, transform: `translate(${g * 600}px,${-g * 40}px) rotate(${g * 80}deg)`, transformOrigin: "50% 50%" })}><Taza x={0} y={0} lvl={f * (1 - g * 0.8)} w={330} /></div>
    <div style={ab(1080, 560, { width: 640, height: 300, borderRadius: 14, background: "linear-gradient(#f1f4f5,#cfd6da)", boxShadow: "0 24px 50px rgba(0,0,0,.6)" })}>
      {["DETERGENTE", "SUAVIZANTE", "PRELAVADO"].map((l, i) => <div key={i} style={ab(24 + i * 205, 40, { width: 185, height: 220, borderRadius: 10, background: i === 1 ? `rgba(232,178,58,${0.25 + 0.6 * g})` : "#b9c2c8", border: i === 1 ? `5px solid ${MZ}` : "none" })}><div style={ab(0, 180, { width: 185, textAlign: "center", fontSize: 24, fontWeight: 900, color: "#28313a" })}>{l}</div></div>)}
    </div>
    <div style={ab(330, 140, { width: 400, textAlign: "center", fontSize: 110, fontWeight: 900, color: MZ, opacity: e1(tt, 1.4) })}>120 ml</div>
    <Tag tt={tt} at={3.1} x={1400} y={420} txt="EN EL SUAVIZANTE" col={VER} size={58} />
  </>;
}}</Stage>;

// 13 · el chorrito en la cubeta: media taza perdida en 20 litros
const Cubeta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#14202a" mesa={false}>{(tt) => {
  const L = Math.round(eio(tt, 0.3, 2.4) * 20), g = eio(tt, 2.6, 3.2);
  return <>
    <div style={ab(560, 260, { width: 800, height: 680, borderRadius: "20px 20px 120px 120px", border: "8px solid #aab4bb", background: "rgba(140,195,235,.12)", overflow: "hidden" })}>
      <div style={ab(0, 680 - 34 * L, { width: 800, height: 34 * L, background: "linear-gradient(rgba(140,195,235,.55),rgba(90,150,200,.75))" })} />
      <div style={ab(390, 680 - 34 * L + 20, { width: 18, height: 18, borderRadius: "50%", background: "#e8b23a", opacity: g, transform: `scale(${1 - 0.6 * g + 1})` })} />
    </div>
    <div style={ab(1420, 360, { fontSize: 170, fontWeight: 900, color: "#8cc3eb", lineHeight: 1, fontVariantNumeric: "tabular-nums" })}>{L} L</div>
    <div style={ab(1420, 560, { width: 450, fontSize: 52, fontWeight: 900, color: MZ, opacity: g })}>+ 120 ml de vinagre</div>
    <Tag tt={tt} at={3.4} x={960} y={150} txt="UN CHORRITO PERDIDO" col={TX} size={64} />
  </>;
}}</Stage>;

// 14 · cada tres meses: el año en cuatro estaciones, no 52 semanas tachadas
const Trimestre: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1d22" mesa={false}>{(tt) => {
  const k = eio(tt, 0.3, 2.0);
  return <>
    <Txt x={960} y={90} w={1500} size={66} col={TX}>CONTRA EL SARRO</Txt>
    {Array.from({ length: 52 }, (_, i) => { const x = 210 + (i % 13) * 116, y = 240 + Math.floor(i / 13) * 150, on = i % 13 === 0; return <div key={i} style={ab(x, y, { width: 96, height: 120, borderRadius: 10, background: on ? VER : "rgba(255,255,255,.08)", border: on ? `3px solid ${VER}` : "2px solid rgba(255,255,255,.15)", opacity: e1(tt, 0.1 + i * 0.03) })}>
      {!on && <div style={ab(10, 55, { width: 76, height: 6, background: RED, opacity: k > 0.5 ? 0 : 0, transform: "rotate(-30deg)" })} />}
      {on && <div style={ab(0, 30, { width: 96, textAlign: "center", fontSize: 48, fontWeight: 900, color: "#fff" })}>✓</div>}
    </div>; })}
    <Tag tt={tt} at={2.2} x={960} y={900} txt="4 VECES AL AÑO · NO CADA SEMANA" col={MZ} size={58} />
  </>;
}}</Stage>;

// 15 · el atomizador mitad y mitad: agua y vinagre, y un trapo que limpia el vidrio
const MitadMitad: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#18202a" mesa={false}>{(tt) => {
  const a = eio(tt, 0.3, 1.3), b = eio(tt, 1.3, 2.3), w = eio(tt, 2.4, 3.8);
  return <>
    <div style={ab(330, 200, { width: 260, height: 620, borderRadius: "40px 40px 30px 30px", border: "6px solid rgba(235,245,250,.85)", overflow: "hidden" })}>
      <div style={ab(0, 620 - 300 * a, { width: 260, height: 300 * a, background: "rgba(140,195,235,.7)" })} />
      <div style={ab(0, 620 - 300 * a - 300 * b, { width: 260, height: 300 * b, background: "rgba(232,210,150,.75)" })} />
    </div>
    <div style={ab(400, 110, { width: 120, height: 110, background: "#e64a3b", borderRadius: "16px 16px 0 0" })} />
    <div style={ab(640, 600, { fontSize: 60, fontWeight: 900, color: "#8cc3eb", opacity: a })}>AGUA</div>
    <div style={ab(640, 300, { fontSize: 60, fontWeight: 900, color: MZ, opacity: b })}>VINAGRE</div>
    <div style={ab(1080, 240, { width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,rgba(200,215,225,.5),rgba(80,95,110,.6))", border: "18px solid #c9ced3", overflow: "hidden" })}>
      <div style={ab(0, 0, { width: 600 * w, height: 600, background: "rgba(230,245,255,.35)" })} />
      {Array.from({ length: 20 }, (_, i) => <div key={i} style={ab(rnd(i) * 540, rnd(i + 7) * 540, { width: 40, height: 30, borderRadius: "50%", background: "#eceae2", opacity: rnd(i) * 540 < 600 * w ? 0 : 0.8 })} />)}
    </div>
    <div style={ab(1020 + 600 * w, 420, { width: 180, height: 140, borderRadius: 30, background: "#3b78c6", transform: "rotate(-12deg)" })} />
    <Tag tt={tt} at={3.6} x={1380} y={920} txt="POR FUERA · CON TRAPO" col={VER} size={56} />
  </>;
}}</Stage>;

// 16 · la noche del remojo: el reloj da vueltas y la goma cambia de color
const Remojo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#0f141c" mesa={false}>{(tt) => {
  const k = eio(tt, 0.3, 3.6), hrs = k * 12;
  return <>
    <div style={ab(1500, 90, { width: 180, height: 180, borderRadius: "50%", background: "#f2ecd0", boxShadow: "0 0 60px rgba(242,236,208,.5)" })} />
    <Lav x={260} y={250} w={520} inner={<div style={ab(0, 0, { width: 400, height: 400, background: "rgba(232,200,120,.55)" })}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={ab(30 + rnd(i) * 200, 220 - ((tt * 40 + i * 30) % 200), { width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.6)" })} />)}</div>} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={1220} cy={560} r={230} fill="rgba(0,0,0,.4)" stroke={TX} strokeWidth={8} />
      <line x1={1220} y1={560} x2={1220 + Math.sin(hrs / 12 * 2 * Math.PI) * 130} y2={560 - Math.cos(hrs / 12 * 2 * Math.PI) * 130} stroke={TX} strokeWidth={14} strokeLinecap="round" />
      <line x1={1220} y1={560} x2={1220 + Math.sin(hrs * 2 * Math.PI) * 190} y2={560 - Math.cos(hrs * 2 * Math.PI) * 190} stroke={MZ} strokeWidth={8} strokeLinecap="round" />
    </svg>
    <div style={ab(1040, 820, { width: 360, textAlign: "center", fontSize: 72, fontWeight: 900, color: RED })}>{Math.round(hrs)} HORAS</div>
    <div style={ab(300, 880, { width: 440, height: 40, borderRadius: 20, background: `rgb(${61 + 60 * k},${66 + 30 * k},${71 + 10 * k})` })} />
    <div style={ab(300, 930, { width: 440, textAlign: "center", fontSize: 36, color: DIM })}>la goma, sumergida</div>
  </>;
}}</Stage>;

// 17 · ácido contra alcalino: la escala de pH y dos flechas que se anulan en el 7
const SeAnulan: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#191c22" mesa={false}>{(tt) => {
  const m = eio(tt, 1.0, 2.6), x = (p: number) => 160 + (p / 14) * 1600;
  return <>
    <div style={ab(160, 480, { width: 1600, height: 90, borderRadius: 45, background: "linear-gradient(90deg,#e0412f,#e88a2a,#e8c23a,#8fc04a,#3aa36a,#3a7fc0,#5a4aa8)" })} />
    {Array.from({ length: 15 }, (_, i) => <div key={i} style={ab(x(i) - 30, 590, { width: 60, textAlign: "center", fontSize: 34, fontWeight: 800, color: DIM })}>{i}</div>)}
    <div style={ab(lerp(x(2.5), x(6.6), m) - 20, 400, { width: 40, textAlign: "center", fontSize: 50, color: "#e88a2a" })}>▼</div>
    <div style={ab(lerp(x(10), x(7.4), m) - 20, 400, { width: 40, textAlign: "center", fontSize: 50, color: "#3a7fc0" })}>▼</div>
    <div style={ab(lerp(x(2.5), x(6.6), m) - 330, 330, { width: 340, textAlign: "right", fontSize: 50, fontWeight: 900, color: "#e88a2a" })}>VINAGRE</div>
    <div style={ab(lerp(x(10), x(7.4), m) - 10, 330, { width: 380, textAlign: "left", fontSize: 50, fontWeight: 900, color: "#3a7fc0" })}>DETERGENTE</div>
    <div style={ab(x(7) - 400, 720, { width: 800, textAlign: "center", fontSize: 90, fontWeight: 900, color: RED, opacity: e1(tt, 2.7) })}>SE ANULAN</div>
    <Tag tt={tt} at={3.3} x={960} y={880} txt="tu ropa sale menos limpia" col={TX} size={46} />
  </>;
}}</Stage>;

// 18 · el volcán de bicarbonato: espuma y al final sólo agua con sal
const Volcan: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1d21" mesa={false}>{(tt) => {
  const f = eio(tt, 0.4, 1.6) * (1 - eio(tt, 2.4, 3.4));
  return <>
    <div style={ab(660, 420, { width: 600, height: 480, borderRadius: "20px 20px 80px 80px", border: "6px solid rgba(235,245,250,.8)", background: "rgba(220,235,245,.1)", overflow: "hidden" })}>
      <div style={ab(0, 200, { width: 600, height: 280, background: "rgba(200,220,230,.4)" })} />
    </div>
    {Array.from({ length: 40 }, (_, i) => { const a = rnd(i) * Math.PI, r = 60 + rnd(i + 3) * 420 * f; return <div key={i} style={ab(960 + Math.cos(a) * r - 40, 440 - Math.sin(a) * r * 0.9 - 40, { width: 80, height: 80, borderRadius: "50%", background: "rgba(250,250,245,.85)", opacity: f, transform: `scale(${0.5 + rnd(i + 5)})` })} />; })}
    {tt < 2.6 && <Tag tt={tt} at={0.6} x={460} y={220} txt="¡ESPUMA!" col={MZ} size={72} />}
    <div style={ab(560, 140, { width: 800, textAlign: "center", fontSize: 74, fontWeight: 900, color: TX, opacity: e1(tt, 3.2) })}>= AGUA CON UN POCO DE SAL</div>
    <Tag tt={tt} at={3.6} x={1560} y={600} txt="PURO ESPECTÁCULO" col={RED} size={54} />
  </>;
}}</Stage>;

// 19 · gas cloro: un lavadero cerrado se llena de nube verde-amarilla y suena la alarma
const GasCloro: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#121518" mesa={false}>{(tt) => {
  const g = eio(tt, 0.4, 2.8), bl = 0.5 + 0.5 * Math.sin(tt * 10);
  return <>
    <div style={ab(160, 180, { width: 1280, height: 760, borderRadius: 16, border: "6px solid #6b737a", background: "#1c2126", overflow: "hidden" })}>
      <Lav x={180} y={260} w={360} />
      {Array.from({ length: 22 }, (_, i) => { const r = 120 + rnd(i) * 220; return <div key={i} style={ab(300 + rnd(i + 2) * 900 - r / 2, 600 - g * (200 + rnd(i + 8) * 520) - r / 2, { width: r, height: r, borderRadius: "50%", background: "radial-gradient(rgba(196,214,82,.55),rgba(196,214,82,0))", opacity: g })} />; })}
    </div>
    <div style={ab(570, 60, { width: 460, height: 90, borderRadius: 14, background: `rgba(214,58,47,${0.5 + 0.5 * bl})`, color: "#fff", fontSize: 54, fontWeight: 900, textAlign: "center", lineHeight: "90px" })}>GAS TÓXICO</div>
    <Tag tt={tt} at={1.6} x={1640} y={420} txt="OJOS" col={MZ} size={50} />
    <Tag tt={tt} at={2.2} x={1640} y={540} txt="GARGANTA" col={MZ} size={50} />
    <Tag tt={tt} at={2.8} x={1640} y={660} txt="PULMONES" col={RED} size={50} />
  </>;
}}</Stage>;

// 20 · el día del cloro no hay vinagre: la semana con un enjuague de agua sola en medio
const DiaCloro: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191d22" mesa={false}>{(tt) => {
  const D = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"], X = [{ i: 1, l: "CLORO", c: "#9fc7e6" }, { i: 2, l: "ENJUAGUE\nAGUA SOLA", c: VER }, { i: 4, l: "VINAGRE", c: MZ }];
  return <>
    {D.map((d, i) => <div key={i} style={ab(130 + i * 240, 300, { width: 220, height: 420, borderRadius: 18, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", opacity: e1(tt, 0.1 + i * 0.08) })}><div style={ab(0, 20, { width: 220, textAlign: "center", fontSize: 44, fontWeight: 900, color: DIM })}>{d}</div></div>)}
    {X.map((x, j) => <div key={j} style={ab(140 + x.i * 240, 420, { width: 200, height: 260, borderRadius: 16, background: x.c, opacity: e1(tt, 0.9 + j * 0.8), color: "#13202a", fontSize: 29, fontWeight: 900, textAlign: "center", paddingTop: 90, whiteSpace: "pre-line", lineHeight: 1.1 })}>{x.l}</div>)}
    <Tag tt={tt} at={3.2} x={960} y={830} txt="NUNCA LOS DOS EL MISMO DÍA" col={RED} size={60} />
  </>;
}}</Stage>;

// 21 · si lo oliste: tres pasos para salir del lavadero
const Salir: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1c1a1a" mesa={false}>{(tt) => {
  const S = ["SAL DEL LAVADERO", "ABRE LAS VENTANAS", "¿TE CUESTA RESPIRAR? AL MÉDICO"];
  return <>
    {S.map((s, i) => { const k = e1(tt, 0.4 + i * 0.9); return <div key={i} style={ab(260, 230 + i * 220, { width: 1400, height: 170, borderRadius: 24, background: i === 2 ? "rgba(214,58,47,.85)" : "rgba(255,255,255,.08)", border: "3px solid rgba(255,255,255,.2)", opacity: k, transform: `translateX(${(1 - k) * -60}px)` })}>
      <div style={ab(30, 30, { width: 110, height: 110, borderRadius: "50%", background: MZ, color: "#1a1a1a", fontSize: 72, fontWeight: 900, textAlign: "center", lineHeight: "110px" })}>{i + 1}</div>
      <div style={ab(180, 52, { fontSize: 56, fontWeight: 900, color: TX, whiteSpace: "nowrap" })}>{s}</div>
    </div>; })}
  </>;
}}</Stage>;

// 22 · puerta entreabierta: el medidor de humedad baja y los puntos de moho se van
const Entreabierta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#172026" mesa={false}>{(tt) => {
  const o = eio(tt, 0.4, 1.6), hum = 1 - 0.75 * eio(tt, 1.4, 3.6);
  return <>
    <Lav x={300} y={200} w={520} />
    <div style={ab(370, 300, { width: 360, height: 360, borderRadius: "50%", border: "16px solid #c9ced3", background: "rgba(200,220,235,.15)", transform: `perspective(900px) rotateY(${-55 * o}deg)`, transformOrigin: "0% 50%" })} />
    {Array.from({ length: 16 }, (_, i) => <div key={i} style={ab(420 + rnd(i) * 280, 560 + rnd(i + 3) * 60, { width: 12, height: 12, borderRadius: "50%", background: "#111", opacity: hum - 0.25 })} />)}
    <Txt x={1380} y={180} w={700} size={58} col={DIM}>HUMEDAD ADENTRO</Txt>
    <div style={ab(1300, 280, { width: 160, height: 600, borderRadius: 80, background: "rgba(0,0,0,.45)", border: "4px solid rgba(255,255,255,.2)", overflow: "hidden" })}><div style={ab(0, 600 * (1 - hum), { width: 160, height: 600 * hum, background: hum > 0.5 ? "#4a8cc0" : VER })} /></div>
    <div style={ab(1500, 520, { fontSize: 110, fontWeight: 900, color: TX })}>{Math.round(hum * 100)}%</div>
    <Tag tt={tt} at={3.4} x={1380} y={940} txt="GRATIS" col={VER} size={60} />
  </>;
}}</Stage>;

// 23 · el cepillo de dientes en el pliegue: pasadas que limpian franja por franja
const Cepillo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#191e23" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 3.4), x = 300 + 1300 * k + Math.sin(tt * 18) * 30;
  return <>
    <div style={ab(200, 420, { width: 1520, height: 240, borderRadius: 120, background: "linear-gradient(#4a5056,#2c3136 60%,#4a5056)" })}>
      {Array.from({ length: 60 }, (_, i) => { const px = 30 + rnd(i) * 1460; return <div key={i} style={ab(px, 70 + rnd(i + 4) * 100, { width: 16, height: 16, borderRadius: "50%", background: "#0b0b0b", opacity: px + 200 < x ? 0 : 0.9 })} />; })}
    </div>
    <div style={ab(x - 60, 300, { width: 120, height: 460, transform: "rotate(18deg)" })}>
      <div style={ab(20, 0, { width: 80, height: 360, borderRadius: 30, background: "linear-gradient(90deg,#4fb3e8,#2f7fb8)" })} />
      <div style={ab(0, 330, { width: 120, height: 90, borderRadius: 10, background: "repeating-linear-gradient(90deg,#f1f1f1 0 8px,#cfd6da 8px 12px)" })} />
    </div>
    <Tag tt={tt} at={0.5} x={500} y={200} txt="AGUA TIBIA + JABÓN DE TRASTES" col={TX} size={50} />
    <Tag tt={tt} at={3.4} x={1460} y={860} txt="Y SECAR" col={VER} size={60} />
  </>;
}}</Stage>;

// 24 · la receta de casa: tres tarjetas de dosis que se apilan
const Receta: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1d1b18" mesa={false}>{(tt) => {
  const R = [{ l: "ENJUAGUE", v: "½ TAZA", d: "en el suavizante · no en todas las cargas", c: VER }, { l: "SARRO", v: "2 TAZAS", d: "cada 3 meses · agua tibia · sin remojo", c: MZ }, { l: "LODO Y OLOR", v: "SIN VINAGRE", d: "oxígeno · ciclo caliente · 1 vez al mes", c: "#9fc7e6" }];
  return <>
    {R.map((r, i) => { const k = eio(tt, 0.3 + i * 0.9, 0.9 + i * 0.9); return <div key={i} style={ab(180 + i * 540, 230 + (1 - k) * 80, { width: 500, height: 600, borderRadius: 26, background: "#f4efe2", opacity: k, transform: `rotate(${(i - 1) * 3}deg)`, boxShadow: "0 24px 60px rgba(0,0,0,.6)" })}>
      <div style={ab(0, 0, { width: 500, height: 120, borderRadius: "26px 26px 0 0", background: r.c, fontSize: 52, fontWeight: 900, color: "#1a1a1a", textAlign: "center", lineHeight: "120px" })}>{r.l}</div>
      <div style={ab(0, 190, { width: 500, textAlign: "center", fontSize: 60, fontWeight: 900, color: "#1d1d1d", whiteSpace: "nowrap" })}>{r.v}</div>
      <div style={ab(40, 340, { width: 420, textAlign: "center", fontSize: 40, fontWeight: 700, color: "#3a3a3a", lineHeight: 1.2 })}>{r.d}</div>
    </div>; })}
  </>;
}}</Stage>;

// 25 · lo que NO está en la lista: cuatro cosas tachadas una por una
const NoEsta: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1b1a1d" mesa={false}>{(tt) => {
  const L = ["VINAGRE EN CADA LAVADO", "REMOJO DE TODA LA NOCHE", "VINAGRE PURO EN LA GOMA", "VINAGRE + CLORO"];
  return <>
    {L.map((l, i) => { const k = e1(tt, 0.3 + i * 0.7), x = eio(tt, 0.7 + i * 0.7, 1.1 + i * 0.7); return <div key={i} style={ab(300, 200 + i * 180, { width: 1320, opacity: k })}>
      <div style={{ fontSize: 70, fontWeight: 900, color: i === 3 ? RED : TX, textAlign: "center" }}>{l}</div>
      <div style={ab(660 - 640 * x, 40, { width: 1280 * x, height: 12, background: RED, borderRadius: 6 })} />
    </div>; })}
  </>;
}}</Stage>;

// 26 · las seis de la tarde: la carátula del reloj sobre la puerta y el pliegue de abajo marcado
const SeisTarde: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#121820" mesa={false}>{(tt) => {
  const a = eio(tt, 0.3, 1.6), b = eio(tt, 1.8, 2.8);
  return <>
    <Fuelle x={960} y={520} r={330} />
    {Array.from({ length: 12 }, (_, i) => { const an = (i / 12) * 2 * Math.PI; return <div key={i} style={ab(960 + Math.sin(an) * 440 - 40, 520 - Math.cos(an) * 440 - 30, { width: 80, textAlign: "center", fontSize: 50, fontWeight: 900, color: i === 6 ? MZ : DIM, opacity: e1(tt, i * 0.06) })}>{i === 0 ? 12 : i}</div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={960} y1={520} x2={960} y2={520 + 260 * a} stroke={MZ} strokeWidth={16} strokeLinecap="round" />
      <circle cx={960} cy={520} r={330} fill="none" stroke={MZ} strokeWidth={84} strokeDasharray={`${345 * b} 9999`} transform="rotate(60 960 520)" opacity={0.55} />
      <path d={`M ${1500} ${180} L ${1060} ${820} L ${860} ${820} Z`} fill="rgba(255,240,180,.18)" opacity={b} />
    </svg>
    <div style={ab(1460, 120, { width: 120, height: 70, borderRadius: 14, background: "#2e3338", opacity: b, transform: "rotate(-35deg)" })} />
    <Tag tt={tt} at={2.6} x={960} y={1000} txt="EL PLIEGUE DE ABAJO" col={MZ} size={54} />
  </>;
}}</Stage>;

// 27 · el pellizco: goma sana regresa, goma castigada se queda marcada
const Pellizco: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#191d21" mesa={false}>{(tt) => {
  const p = Math.max(0, Math.sin(Math.min(tt, 3.2) * 2)), sana = p, mala = Math.max(p, cl((tt - 0.8) / 0.4) * 0.7);
  return <>
    {[{ x: 480, l: "SANA", c: VER, d: sana, col: "#3d4247" }, { x: 1440, l: "CASTIGADA", c: RED, d: mala, col: "#6b6258" }].map((s, i) => <div key={i}>
      <div style={ab(s.x - 300, 470, { width: 600, height: 150, borderRadius: 40, background: s.col, transform: `scaleY(${1 - 0.45 * s.d})` })}>{i === 1 && tt > 2 && [0, 1, 2].map((j) => <div key={j} style={ab(200 + j * 90, 20, { width: 4, height: 100, background: "#111", transform: "rotate(14deg)" })} />)}</div>
      <Puno x={s.x} y={420 + 50 * s.d} rot={180} s={0.8} />
      <Puno x={s.x} y={670 - 50 * s.d} s={0.8} />
      <Txt x={s.x} y={150} w={600} size={70} col={s.c}>{s.l}</Txt>
    </div>)}
    <div style={ab(959, 120, { width: 3, height: 860, background: "rgba(255,255,255,.2)" })} />
    <Tag tt={tt} at={2.4} x={1440} y={930} txt="TIESA COMO CARTÓN" col={MZ} size={50} />
  </>;
}}</Stage>;

// 28 · la yema del dedo: una huella limpia y una huella negra
const Yema: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1b1e22" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 2.0);
  return <>
    {[{ x: 560, sucio: false }, { x: 1360, sucio: true }].map((s, i) => <div key={i}>
      <div style={ab(s.x - 170, 260, { width: 340, height: 460, borderRadius: "170px 170px 80px 80px", background: PIEL, boxShadow: "0 24px 50px rgba(0,0,0,.5)" })}>
        <svg width={340} height={460} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 9 }, (_, j) => <ellipse key={j} cx={170} cy={200} rx={30 + j * 15} ry={40 + j * 18} fill="none" stroke="rgba(90,50,30,.35)" strokeWidth={3} />)}</svg>
        {s.sucio && <div style={ab(40, 80, { width: 260, height: 220, borderRadius: "50%", background: "radial-gradient(rgba(10,10,10,.95),rgba(10,10,10,.6) 60%,rgba(10,10,10,0))", opacity: k })} />}
      </div>
      <Check x={s.x} y={850} ok={!s.sucio} o={e1(tt, 2.2 + i * 0.4)} />
    </div>)}
    <Tag tt={tt} at={2.8} x={1360} y={160} txt="ES LA GOMA MISMA" col={RED} size={56} />
  </>;
}}</Stage>;

// 29 · el semáforo de la prueba: cuántas fallas y qué hacer
const Semaforo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16191d" mesa={false}>{(tt) => {
  const R = [{ c: VER, n: "0 FALLAS", d: "sana · media taza en el enjuague" }, { c: MZ, n: "1 FALLA", d: "deja el vinagre en el tambor · revísala cada mes" }, { c: RED, n: "2 O 3", d: "busca agua en el piso · pide la goma" }];
  return <>
    <div style={ab(220, 140, { width: 300, height: 820, borderRadius: 60, background: "#23272b", border: "6px solid #3a3f45" })}>
      {R.map((r, i) => <div key={i} style={ab(40, 40 + i * 260, { width: 220, height: 220, borderRadius: "50%", background: r.c, opacity: 0.2 + 0.8 * e1(tt, 0.4 + i * 0.9), boxShadow: e1(tt, 0.4 + i * 0.9) > 0.5 ? `0 0 50px ${r.c}` : "none" })} />)}
    </div>
    {R.map((r, i) => <div key={i} style={ab(620, 210 + i * 260, { width: 1180, opacity: e1(tt, 0.5 + i * 0.9) })}>
      <div style={{ fontSize: 72, fontWeight: 900, color: r.c }}>{r.n}</div>
      <div style={{ fontSize: 46, fontWeight: 700, color: TX }}>{r.d}</div>
    </div>)}
  </>;
}}</Stage>;

// 30 · la toalla bajo la puerta: después del centrifugado, seca o mojada
const Toalla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a1f24" mesa={false}>{(tt) => {
  const spin = eio(tt, 0.3, 2.0), wet = eio(tt, 2.0, 3.2);
  return <>
    <Lav x={420} y={120} w={480} inner={<Tambor x={150} y={150} r={130} ang={tt * 900 * (1 - spin * 0.9)} />} />
    <div style={ab(330, 800, { width: 660, height: 120, borderRadius: 16, background: `linear-gradient(90deg,#e7e2d6,#d8d1c2)`, boxShadow: "0 10px 26px rgba(0,0,0,.4)" })}>
      <div style={ab(180, 20, { width: 300 * wet, height: 80, borderRadius: "50%", background: "rgba(70,110,150,.55)" })} />
    </div>
    {Array.from({ length: 4 }, (_, i) => <Gota key={i} x={640 + i * 12} y={720 + ((tt * 200 + i * 30) % 70)} col="#8cc3eb" o={wet} s={0.8} />)}
    <div style={ab(1180, 330, { width: 620, opacity: e1(tt, 2.2) })}>
      <div style={{ fontSize: 66, fontWeight: 900, color: VER }}>SECA → TIENES TIEMPO</div>
      <div style={{ fontSize: 66, fontWeight: 900, color: RED, marginTop: 50 }}>MOJADA → NO ESPERES</div>
    </div>
    <Tag tt={tt} at={0.6} x={1480} y={200} txt="DESPUÉS DEL CENTRIFUGADO" col={DIM} size={44} />
  </>;
}}</Stage>;

// 31 · el número de parte: la etiqueta del modelo dentro de la puerta, con lupa
const NumParte: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#181c21" mesa={false}>{(tt) => {
  const z = eio(tt, 0.6, 2.0);
  return <>
    <div style={ab(360, 260, { width: 760, height: 520, borderRadius: 18, background: "#f3f3ef", boxShadow: "0 24px 60px rgba(0,0,0,.6)", transform: `scale(${1 + 0.15 * z})` })}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={ab(50, 50 + i * 62, { width: 300 + rnd(i) * 320, height: 22, borderRadius: 6, background: i === 4 ? "transparent" : "#c9c9c2" })} />)}
      <div style={ab(46, 290, { width: 560, height: 58, borderRadius: 8, border: `6px solid ${RED}`, opacity: z })} />
      <div style={ab(60, 298, { fontSize: 38, fontWeight: 900, color: "#1d1d1d", letterSpacing: 4, opacity: z })}>PIEZA · FUELLE</div>
    </div>
    <div style={ab(820 + 200 * (1 - z), 460, { width: 300, height: 300, borderRadius: "50%", border: "18px solid #2b3036", background: "rgba(200,230,255,.12)", boxShadow: "0 18px 40px rgba(0,0,0,.5)" })} />
    <div style={ab(1060 + 200 * (1 - z), 720, { width: 50, height: 200, borderRadius: 25, background: "#2b3036", transform: "rotate(-40deg)" })} />
    <div style={ab(1260, 300, { width: 560, opacity: e1(tt, 2.4), fontSize: 62, fontWeight: 900, color: TX, lineHeight: 1.15 })}>LA EXACTA.<br /><span style={{ color: RED }}>NO UNA QUE SE PAREZCA.</span></div>
  </>;
}}</Stage>;

export const TEC: Record<string, C> = {
  cajon: Cajon, grieta: Grieta, cinco: Cinco, sarrograsa: SarroGrasa, lodo: Lodo, olorvuelve: OlorVuelve, contacto: Contacto, cuatrogomas: CuatroGomas, reten: Reten,
  pruebataller: PruebaTaller, martillo: Martillo, mediataza: MediaTaza, cubeta: Cubeta, trimestre: Trimestre, mitadmitad: MitadMitad, remojo: Remojo, seanulan: SeAnulan,
  volcan: Volcan, gascloro: GasCloro, diacloro: DiaCloro, salir: Salir, entreabierta: Entreabierta, cepillo: Cepillo, receta: Receta, noesta: NoEsta, seistarde: SeisTarde,
  pellizco: Pellizco, yema: Yema, semaforo: Semaforo, toalla: Toalla, numparte: NumParte,
};
