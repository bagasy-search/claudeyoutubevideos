// sg29c · «Raccoons: 3 Pantry Items» — componentes ÚNICOS de este video (uno por minuto, ninguno se repite en la tanda: D:/rtmp/sg29_COMPONENTES.md).
// R2 (evaluador): todo dentro del cuadro (zoom 1), el objeto principal vive desde el cuadro 0, los golpes caen temprano y con la palabra,
// sin carteles de papel ni emojis: objetos dibujados con volumen y sombra de contacto, y fotos reales nítidas donde la idea es real.
import React from "react";
import { Img } from "remotion";
import { BRUSH, COL, FONT, cl, e, ei, extrude, lerp, rnd, sm, spr } from "../sg29kit/k";
import { Contact } from "../sg29kit/base";

type AtF = (ph: string, after?: number) => number;
export type FxP = { t: number; a: number; b: number };
type StageT = React.FC<{ t: number; a: number; b: number; bg: string; floor?: "wood" | "paper" | "soil" | "stone"; light?: number; zoom?: number; children: React.ReactNode }>;

const ab = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h });
const center = (x: number, y: number, sc = 1, rot = 0): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})` });
const big = (size: number, col = COL.cream): React.CSSProperties => ({ fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, textShadow: extrude(10, "#3a2a1a"), lineHeight: 1, whiteSpace: "nowrap" });
const pop = (t: number, t0: number) => (t < t0 ? 0.001 : Math.min(1.06, spr(t, t0, 1.1)));
const fall = (t: number, t0: number, h = 460, k = 1.2) => (1 - Math.min(1.06, spr(t, t0, k))) * -h; // caída con rebote (offset y)
const GREEN = "#3f8a3a";
const SH = "drop-shadow(0 16px 14px rgba(0,0,0,.5))";

// ---------- física chica ----------
const Dust: React.FC<{ t: number; t0: number; x: number; y: number; n?: number; col?: string; w?: number }> = ({ t, t0, x, y, n = 14, col = "200,180,150", w = 240 }) => <>{Array.from({ length: n }, (_, i) => {
  const k = cl((t - t0) / (0.7 + rnd(i, 5) * 0.4)); if (k <= 0 || k >= 1) return null;
  return <div key={i} style={{ ...ab(x + (rnd(i) - 0.5) * w * (0.4 + k), y - rnd(i, 2) * 90 * k - 10, 24 + 50 * k, 24 + 50 * k), borderRadius: "50%", background: `rgba(${col},${0.55 * (1 - k)})`, filter: "blur(6px)", transform: "translate(-50%,-50%)" }} />; })}</>;
// foto real nítida como objeto: marco crema, cae con peso y respira en perspectiva (sin preserve-3d)
const mkPlate = (IMG: (id: string) => string): React.FC<{ id: string; x: number; y: number; w: number; h: number; t: number; t0: number; rot?: number }> => ({ id, x, y, w, h, t, t0, rot = 0 }) => {
  if (t < t0 - 0.02) return null; const q = Math.min(1.05, spr(t, t0, 1.1));
  return <><Contact x={x} y={y + h / 2 + 30} w={w * 0.9} o={0.45 * cl(q)} />
    <div style={{ ...ab(x - w / 2, y - h / 2, w, h), transform: `perspective(1400px) translateY(${(1 - q) * -340}px) rotateX(${(1 - q) * 28 + Math.sin(t * 0.7) * 2}deg) rotateY(${Math.sin(t * 0.5) * 5}deg) rotate(${rot}deg)`, background: COL.cream, padding: 16, boxSizing: "border-box", borderRadius: 6, boxShadow: "0 34px 60px rgba(0,0,0,.6)" }}>
      <Img src={IMG(id)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></>;
};

// ---------- utilería dibujada ----------
const Raccoon: React.FC<{ s?: number; glow?: number; blink?: number; ears?: number; tint?: string }> = ({ s = 1, glow = 0, blink = 0, ears = 0, tint }) => (
  <svg width={300 * s} height={260 * s} viewBox="0 0 300 260" style={{ overflow: "visible" }}>
    <defs><radialGradient id={`rcf${tint ?? ""}`} cx="50%" cy="40%"><stop offset="0" stopColor={tint ? "#c9a980" : "#b9b4ab"} /><stop offset=".7" stopColor={tint ? "#8a6a48" : "#7d786f"} /><stop offset="1" stopColor={tint ? "#5a4028" : "#4d4943"} /></radialGradient></defs>
    <g transform={`rotate(${-ears * 30} 70 60)`}><path d="M60 70 L40 10 L110 50 Z" fill="#5c5750" /><path d="M62 62 L52 26 L96 52 Z" fill="#e9e1d2" /></g>
    <g transform={`rotate(${ears * 30} 230 60)`}><path d="M240 70 L260 10 L190 50 Z" fill="#5c5750" /><path d="M238 62 L248 26 L204 52 Z" fill="#e9e1d2" /></g>
    <ellipse cx={150} cy={140} rx={125} ry={105} fill={`url(#rcf${tint ?? ""})`} />
    <path d="M30 130 Q150 70 270 130 Q240 175 190 160 Q150 150 110 160 Q60 175 30 130Z" fill="#1c1a17" />
    <path d="M70 110 Q150 85 230 110" stroke="#efe9dc" strokeWidth={10} fill="none" strokeLinecap="round" />
    {[105, 195].map((x) => <g key={x}><ellipse cx={x} cy={134} rx={16} ry={Math.max(1, 16 * (1 - blink))} fill={glow > 0 ? `rgba(255,236,120,${0.4 + 0.6 * glow})` : "#0b0a08"} />{glow > 0 && <circle cx={x} cy={134} r={34} fill={`rgba(255,230,120,${0.22 * glow})`} />}<circle cx={x + 5} cy={128} r={4} fill="#fff" /></g>)}
    <ellipse cx={150} cy={205} rx={46} ry={34} fill="#efe9dc" /><ellipse cx={150} cy={188} rx={18} ry={12} fill="#16130f" />
  </svg>
);
// la mano del mapache (cinco deditos), apunta hacia arriba
const Paw: React.FC<{ s?: number; rot?: number; col?: string }> = ({ s = 1, rot = 0, col = "#2a2622" }) => (
  <svg width={160 * s} height={200 * s} viewBox="0 0 160 200" style={{ transform: `rotate(${rot}deg)`, overflow: "visible", filter: SH }}>
    <path d="M40 200 L44 110 Q80 90 116 110 L120 200 Z" fill="#6b665e" />
    <ellipse cx={80} cy={110} rx={48} ry={34} fill={col} />
    {[[30, 70, -24], [55, 50, -8], [80, 44, 0], [105, 50, 8], [130, 70, 24]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={11} ry={24} fill={col} transform={`rotate(${r} ${x} ${y})`} />)}
  </svg>
);
const Hand: React.FC<{ s?: number; glove?: boolean; rot?: number }> = ({ s = 1, glove = false, rot = 0 }) => (
  <svg width={240 * s} height={200 * s} viewBox="0 0 240 200" style={{ transform: `rotate(${rot}deg)`, overflow: "visible", filter: SH }}>
    <rect x={0} y={70} width={90} height={70} rx={14} fill={glove ? "#b5562a" : "#d9a77f"} />
    <path d="M80 60 Q100 40 150 46 L215 48 Q232 52 215 66 L160 70 L222 78 Q236 86 220 96 L160 96 L214 108 Q226 118 210 124 L158 122 L198 136 Q206 148 190 150 L120 150 Q84 150 80 120 Z" fill={glove ? "#e0b23c" : "#efc29a"} stroke={glove ? "#9a7420" : "#c9926a"} strokeWidth={4} />
    {glove && <path d="M84 70 L84 140" stroke="#9a7420" strokeWidth={8} />}
  </svg>
);
const Can: React.FC<{ w?: number; lidUp?: number; lidRot?: number; children?: React.ReactNode }> = ({ w = 320, lidUp = 0, lidRot = 0, children }) => (
  <div style={{ position: "relative", width: w, height: w * 1.15 }}>
    <div style={{ position: "absolute", left: 0, top: w * 0.12, width: w, height: w * 1.03, borderRadius: `12px 12px ${w * 0.12}px ${w * 0.12}px`, background: "linear-gradient(90deg,#4f5457,#a8aeb1 32%,#d9dddf 42%,#7b8184 68%,#45494c)", boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: w * (0.18 + i * 0.3), height: 10, background: "rgba(0,0,0,.22)", borderTop: "2px solid rgba(255,255,255,.25)" }} />)}
    </div>
    <div style={{ position: "absolute", left: -w * 0.05, top: w * 0.02 - lidUp, width: w * 1.1, height: w * 0.2, transformOrigin: "100% 100%", transform: `rotate(${lidRot}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%, #e3e6e8, #9aa0a3 55%, #5d6265)", boxShadow: "0 10px 20px rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", left: "38%", top: -w * 0.06, width: "24%", height: w * 0.08, borderRadius: "40px 40px 0 0", border: "8px solid #6f7578", borderBottom: "none" }} />
      {children}
    </div>
  </div>
);
const Jar: React.FC<{ fill: string; label: string; w?: number; h?: number; lid?: string }> = ({ fill, label, w = 170, h = 230, lid = "#a12a1a" }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <div style={{ position: "absolute", left: w * 0.08, top: 0, width: w * 0.84, height: h * 0.14, borderRadius: 8, background: `linear-gradient(90deg, ${lid}, #e2584a 40%, ${lid})` }} />
    <div style={{ position: "absolute", left: 0, top: h * 0.12, width: w, height: h * 0.88, borderRadius: "18px 18px 24px 24px", background: `linear-gradient(90deg, rgba(255,255,255,.25), rgba(255,255,255,.05) 30%, rgba(255,255,255,.2) 60%, rgba(0,0,0,.1)), ${fill}`, boxShadow: "0 22px 40px rgba(0,0,0,.5), inset 0 0 0 3px rgba(255,255,255,.35)" }} />
    <div style={{ position: "absolute", left: w * 0.1, top: h * 0.42, width: w * 0.8, padding: "8px 0", background: COL.cream, textAlign: "center", fontFamily: BRUSH, fontSize: w * 0.2, color: COL.ink, borderRadius: 4 }}>{label}</div>
  </div>
);
const Bottle: React.FC<{ fill: string; label: string; s?: number }> = ({ fill, label, s = 1 }) => (
  <div style={{ position: "relative", width: 150 * s, height: 340 * s }}>
    <div style={{ position: "absolute", left: 55 * s, top: 0, width: 40 * s, height: 30 * s, background: "#c8321e", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 50 * s, top: 26 * s, width: 50 * s, height: 70 * s, background: "rgba(230,240,240,.55)", borderRadius: "10px 10px 0 0" }} />
    <div style={{ position: "absolute", left: 0, top: 90 * s, width: 150 * s, height: 250 * s, borderRadius: `${40 * s}px ${40 * s}px 18px 18px`, background: `linear-gradient(90deg, rgba(255,255,255,.4), rgba(255,255,255,.08) 30%, rgba(255,255,255,.3) 62%, rgba(0,0,0,.1)), ${fill}`, boxShadow: "0 24px 44px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 14 * s, top: 170 * s, width: 122 * s, padding: `${10 * s}px 0`, background: COL.cream, textAlign: "center", fontFamily: BRUSH, fontSize: 34 * s, color: COL.ink, borderRadius: 4 }}>{label}</div>
  </div>
);
const GarlicHead: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={200 * s} height={210 * s} viewBox="0 0 200 210"><defs><radialGradient id="gh3" cx="40%" cy="35%"><stop offset="0" stopColor="#fffdf6" /><stop offset=".6" stopColor="#efe6d2" /><stop offset="1" stopColor="#c4b293" /></radialGradient></defs>
    {[-50, -25, 0, 25, 50].map((dx, i) => <path key={i} d={`M100 30 C ${100 + dx * 1.6} 60, ${100 + dx * 1.7} 170, ${100 + dx * 0.5} 195 C ${100 + dx * 0.2} 202, ${100 - dx * 0.1} 202, 100 195 Z`} fill="url(#gh3)" stroke="#b39d77" strokeWidth={2} />)}
    <path d="M90 32 Q100 0 110 32" fill="#d9ccb0" /></svg>
);
const Persimmon: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={90 * s} height={90 * s} viewBox="0 0 90 90" style={{ overflow: "visible" }}><defs><radialGradient id="pm" cx="38%" cy="35%"><stop offset="0" stopColor="#ffb06a" /><stop offset=".6" stopColor="#e8722a" /><stop offset="1" stopColor="#a8481a" /></radialGradient></defs>
    <circle cx={45} cy={50} r={36} fill="url(#pm)" /><ellipse cx={33} cy={37} rx={8} ry={12} fill="rgba(255,255,255,.4)" /><path d="M45 18 l-16 -4 l12 10 l-8 10 l12 -8 l12 8 l-8 -10 l12 -10 l-16 4z" fill="#4f6f2a" /></svg>
);
const Coin: React.FC<{ x: number; y: number; o?: number; w?: number }> = ({ x, y, o = 1, w = 140 }) => (
  <div style={{ ...ab(x - w / 2, y - w * 0.12, w, w * 0.24), borderRadius: "50%", background: "linear-gradient(180deg,#f6d77a,#c99a2e 60%,#8f6a1c)", boxShadow: "0 4px 0 #6e5114, 0 8px 12px rgba(0,0,0,.35)", opacity: o }} />
);
const Beam: React.FC<{ x: number; y: number; ang: number; len?: number; spread?: number; o?: number }> = ({ x, y, ang, len = 1100, spread = 22, o = 1 }) => {
  const r = (d: number) => (d * Math.PI) / 180, a1 = r(ang - spread), a2 = r(ang + spread), id = `bm${Math.round(x)}${Math.round(y)}`;
  return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", mixBlendMode: "screen" }}>
    <defs><radialGradient id={id} cx={x} cy={y} r={len} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={`rgba(255,246,214,${0.9 * o})`} /><stop offset=".7" stopColor={`rgba(255,240,200,${0.35 * o})`} /><stop offset="1" stopColor="rgba(255,246,214,0)" /></radialGradient></defs>
    <path d={`M${x} ${y} L${x + Math.cos(a1) * len} ${y + Math.sin(a1) * len} A ${len} ${len} 0 0 1 ${x + Math.cos(a2) * len} ${y + Math.sin(a2) * len} Z`} fill={`url(#${id})`} />
  </svg>;
};
// linterna con volumen (cuerpo cilíndrico + aro de cromo)
const Torch: React.FC<{ x: number; y: number; ang: number; s?: number }> = ({ x, y, ang, s = 1 }) => (
  <div style={{ ...ab(x, y), transform: `rotate(${ang + 180}deg) scale(${s})`, transformOrigin: "0 0" }}>
    <div style={{ ...ab(0, -28, 230, 56), borderRadius: 14, background: "linear-gradient(180deg,#5a5f63,#c9cfd2 35%,#3c4043)", boxShadow: "0 18px 26px rgba(0,0,0,.5)" }} />
    <div style={{ ...ab(-40, -46, 60, 92), borderRadius: 12, background: "linear-gradient(180deg,#8c9296,#eef2f4 40%,#5a5f63)" }} />
    <div style={{ ...ab(-46, -40, 12, 80), borderRadius: 6, background: "rgba(255,250,220,.95)", boxShadow: "0 0 30px rgba(255,240,200,.9)" }} />
  </div>
);
const Corn: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={70 * s} height={180 * s} viewBox="0 0 70 180" style={{ overflow: "visible" }}><path d="M35 10 Q62 40 58 120 Q52 170 35 172 Q18 170 12 120 Q8 40 35 10Z" fill="#f2c94c" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M16 ${30 + i * 10} Q35 ${26 + i * 10} 54 ${30 + i * 10}`} stroke="#c99a2e" strokeWidth={2} fill="none" />)}
    <path d="M30 172 Q4 120 14 60 Q20 130 36 170Z" fill="#7d9a3a" /><path d="M40 172 Q66 120 56 60 Q50 130 34 170Z" fill="#5e7d2a" /></svg>
);
const Bowl: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = "#c8321e" }) => (
  <svg width={220 * s} height={100 * s} viewBox="0 0 220 100"><ellipse cx={110} cy={30} rx={100} ry={22} fill="#5a3a20" /><ellipse cx={110} cy={30} rx={84} ry={15} fill="#8a5a34" />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={50 + i * 15} cy={28 + (i % 2) * 4} r={7} fill="#6b4524" />)}
    <path d="M10 30 Q20 96 110 96 Q200 96 210 30 Q200 52 110 52 Q20 52 10 30Z" fill={col} /></svg>
);

export const mkFx = (Stage0: StageT, at: AtF, _atEnd: AtF, IMG: (id: string) => string = (id) => id) => {
  const Stage: StageT = (p) => <Stage0 {...p} zoom={p.zoom ?? 1} />;
  const Plate = mkPlate(IMG);
  // la palabra manda, pero el golpe nunca llega tarde: tope en la primera parte de la ventana
  const A = (ph: string, a: number) => { try { return Math.max(at(ph, a - 2), a + 0.3); } catch { return a + 1; } };
  // R3: todos los golpes dentro del primer ~55 % de la ventana → el remate se sostiene a la vista antes de la salida
  const As = (phs: string[], a: number, b: number) => { const n = phs.length, span = Math.max(0.8, (b - a) * 0.55); let last = a + 0.3;
    return phs.map((p, i) => { let v = Math.min(A(p, a), a + 0.35 + (span * (i + 0.5)) / n); if (v < last) v = last + (i ? 0.4 : 0); v = Math.min(v, a + (b - a) * 0.68); last = v; return v; }); };

  // 1 · el cubo volcado: tambalea, cae con rebote, la basura sale en arco por el pasto; el vasito de yogur aterriza en el techo del auto; la etiqueta de $400 se balancea del hilo
  const CanSpill: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3, t4] = As(["bones", "a yogurt cup", "400", "plus 50"], a, b);
    const tip = Math.min(1.03, spr(t, a + 0.35, 0.9)), wob = t < a + 0.35 ? Math.sin(t * 22) * 4 : 0;
    const J: [React.ReactNode, number, number][] = [
      [<svg width={150} height={60} viewBox="0 0 150 60"><path d="M20 30 h110" stroke="#efe7d6" strokeWidth={22} strokeLinecap="round" /><circle cx={18} cy={18} r={16} fill="#efe7d6" /><circle cx={18} cy={42} r={16} fill="#efe7d6" /><circle cx={132} cy={18} r={16} fill="#efe7d6" /><circle cx={132} cy={42} r={16} fill="#efe7d6" /></svg>, 700, 830],
      [<div style={{ width: 90, height: 110, borderRadius: "8px 8px 30px 30px", background: "linear-gradient(90deg,#6f777c,#e3e7e9 40%,#8a9195)", boxShadow: "inset 0 10px 0 rgba(0,0,0,.2)" }} />, 900, 870],
      [<svg width={140} height={90} viewBox="0 0 140 90"><path d="M10 70 Q70 -20 130 60 Q70 20 10 70Z" fill="#f2d24c" stroke="#a88a1a" strokeWidth={4} /></svg>, 1060, 840],
      [<div style={{ width: 150, height: 100, background: "repeating-linear-gradient(0deg,#d8d2c2 0 4px,#efe9da 4px 14px)", transform: "skewX(-12deg)", boxShadow: "0 6px 10px rgba(0,0,0,.3)" }} />, 820, 930],
    ];
    const sw = Math.sin((t - t3) * 3.2) * 16 * Math.exp(-(t - t3) * 0.7), tagY = fall(t, t3, 520, 0.9);
    return <Stage t={t} a={a} b={b} bg="c_lawn_garbage" floor="soil">
      <Contact x={500} y={900} w={460} />
      <div style={{ ...ab(250, 390), transformOrigin: "85% 100%", transform: `rotate(${-80 * tip + wob}deg)` }}><Can w={430} lidUp={140 * cl(tip)} lidRot={-40 * cl(tip)} /></div>
      {J.map(([el, x, y], i) => { const t0 = Math.min(t1, a + 0.9) + i * 0.22, k = cl((t - t0) / 0.9); if (k <= 0) return null;
        const hop = Math.abs(Math.sin(k * Math.PI * 1.6)) * 160 * (1 - k * 0.8);
        return <div key={i} style={{ ...center(lerp(560, x, sm(k)), y - hop, 1.9, (1 - k) * 280 * (i % 2 ? 1 : -1)), filter: SH }}>{el}</div>; })}
      {/* el auto entero, de perfil, con el vasito que cae en el techo */}
      <div style={{ ...ab(1180, 500, 560, 300), opacity: e(t, a, a + 0.3), transform: "scale(1.22)", transformOrigin: "50% 100%" }}>
        <div style={{ ...ab(0, 110, 560, 130), borderRadius: "60px 80px 30px 30px", background: "linear-gradient(180deg,#6d8fae,#2c4258)", boxShadow: "0 24px 40px rgba(0,0,0,.5)" }} />
        <div style={{ ...ab(110, 20, 330, 110), borderRadius: "120px 140px 0 0", background: "linear-gradient(180deg,#5d7a96,#3a5470)" }}>
          <div style={{ ...ab(30, 18, 130, 80), borderRadius: "80px 0 0 0", background: "linear-gradient(160deg,#dbeaf3,#86a4bb)" }} /><div style={{ ...ab(175, 18, 130, 80), borderRadius: "0 90px 0 0", background: "linear-gradient(200deg,#dbeaf3,#86a4bb)" }} /></div>
        {[110, 440].map((x) => <div key={x} style={{ ...ab(x - 55, 190, 110, 110), borderRadius: "50%", background: "radial-gradient(circle,#9aa0a3 0 30%,#1b1b1b 32%)" }} />)}
      </div>
      <Contact x={1460} y={828} w={600} />
      {t > t2 - 0.5 && <div style={{ ...center(1460, 440 + fall(t, t2 - 0.4, 520, 1.1), 1, Math.sin((t - t2) * 9) * 10 * Math.exp(-(t - t2) * 3)) }}>
        <div style={{ width: 180, height: 190, background: "linear-gradient(90deg,#f3efe6,#fff 45%,#d6d0c3)", clipPath: "polygon(8% 0,92% 0,100% 100%,0 100%)", borderTop: "14px solid #e6739a", filter: SH }} /></div>}
      {t > t3 - 0.02 && <div style={{ position: "absolute", left: 1000, top: 140, transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${tagY}px)` }}>
        <div style={{ ...ab(-2, 0, 4, 120), background: "#e9dcc0" }} />
        <div style={{ ...ab(-180, 120, 360, 200), background: "linear-gradient(180deg,#fbf3df,#e9dcbb)", borderRadius: "20px 20px 8px 8px", boxShadow: "0 24px 40px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...ab(160, 14, 40, 40), borderRadius: "50%", background: "#3a2a1a" }} />
          <div style={{ ...big(120, COL.red), textShadow: "0 4px 0 #6e1a10", marginTop: 20 }}>$400</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: COL.ink, opacity: e(t, t4, t4 + 0.3) }}>+ $50</div>
        </div>
      </div>}
    </Stage>;
  };

  // 2 · la alacena de mamá: tres frascos caen al estante uno por palabra, con rebote y polvo; el frasco de veneno resbala y se rompe en el piso
  const PantryThree: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3, t4] = As(["cayenne pepper", "white vinegar", "and garlic", "no poison"], a, b);
    const pz = ei(t, t4, t4 + 0.9), broke = t > t4 + 0.9;
    const items: [number, number, React.ReactNode][] = [[t1, 400, <Jar fill="#c73a1c" label="cayenne" w={290} h={380} />], [t2, 820, <Bottle fill="rgba(235,240,232,.8)" label="vinegar" s={1.45} />], [t3, 1200, <GarlicHead s={1.95} />]];
    return <Stage t={t} a={a} b={b} bg="c_kitchen_three" floor="wood">
      <div style={{ ...ab(300, 700, 1320, 46), background: "linear-gradient(180deg,#c9995f,#7b5634)", borderRadius: 6, boxShadow: "0 30px 40px rgba(0,0,0,.55)" }} />
      {[340, 1560].map((x) => <div key={x} style={{ ...ab(x, 746, 34, 120), background: "linear-gradient(90deg,#5a3e27,#8a6340)" }} />)}
      {items.map(([t0, x, el], i) => t > t0 - 0.02 ? <React.Fragment key={i}><Contact x={x + 110} y={706} w={240} o={0.5 * cl(spr(t, t0, 1.2))} />
        <div style={{ position: "absolute", left: x, bottom: 1080 - 700, transform: `translateY(${fall(t, t0, 560)}px) rotate(${(1 - cl(spr(t, t0, 1.2))) * (i - 1) * 12}deg)` }}>{el}</div>
        <Dust t={t} t0={t0 + 0.12} x={x + 110} y={700} /></React.Fragment> : null)}
      {/* el veneno: está en la punta del estante desde el principio, tiembla, resbala y se rompe */}
      {!broke && <div style={{ position: "absolute", left: lerp(1480, 1660, pz), bottom: 1080 - 700 - lerp(0, -330, pz * pz), transform: `rotate(${pz * 110 + (t < t4 ? Math.sin(t * 18) * 3 : 0)}deg)`, transformOrigin: "50% 100%" }}><Bottle fill="#3b4a2c" label="poison" s={1.05} /></div>}
      {broke && <>{Array.from({ length: 9 }, (_, i) => { const k = cl((t - t4 - 0.9) / 0.6); return <div key={i} style={{ ...center(1700 + (rnd(i) - 0.5) * 260 * sm(k), 1010 - Math.sin(k * Math.PI) * 80 * rnd(i, 2), 1, rnd(i, 3) * 360 * k), width: 40 + rnd(i, 4) * 40, height: 26, background: "#3b4a2c", clipPath: "polygon(0 0,100% 30%,70% 100%,10% 70%)" }} />; })}
        <div style={{ ...ab(1700 - 150 * ei(t, t4 + 0.9, t4 + 1.6), 990, 300 * ei(t, t4 + 0.9, t4 + 1.6), 40), borderRadius: "50%", background: "rgba(70,90,40,.7)" }} /></>}
    </Stage>;
  };

  // 3 · la tapa con la goma elástica: la pata tira de la goma toda la noche; en la madera se tallan las noches con astillas; las victorias: 0
  const TallyNights: React.FC<FxP> = ({ t, a, b }) => {
    const [, t2] = As(["every single night", "never won"], a, b);
    const n = Math.floor(lerp(1, 19, ei(t, a + 0.2, t2)));
    const tug = Math.max(0, Math.sin(t * 5)) * 115;
    const g0 = Math.floor((n - 1) / 5), j0 = (n - 1) % 5;
    return <Stage t={t} a={a} b={b} bg="n_metal_band" floor="wood">
      {/* la tapa vista en perspectiva, con la goma cruzada y la pata que tira */}
      <div style={{ ...center(560, 330, 1.05, Math.sin(t * 5) * 4) }}><Raccoon glow={0.4} ears={tug / 230} /></div>
      <div style={{ ...ab(250, 430, 620, 260), borderRadius: "50%", background: "radial-gradient(ellipse at 45% 35%, #eef0f1, #9aa0a3 55%, #4e5356)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 -18px 0 rgba(0,0,0,.25)" }} />
      <svg width={1920} height={1080} style={ab(0, 0)}><path d={`M260 560 Q 560 ${560 - tug * 2.2} 860 560`} stroke="#1f1c19" strokeWidth={22} fill="none" strokeLinecap="round" /><circle cx={262} cy={560} r={16} fill="#c8321e" /><circle cx={858} cy={560} r={16} fill="#c8321e" /></svg>
      <div style={{ ...center(560, 560 - tug * 1.1 - 80, 1, 180) }}><Paw s={1.5} /></div>
      <Contact x={560} y={720} w={640} />
      {/* la tabla: las rayitas se tallan con astillas */}
      <div style={{ ...ab(960, 250, 700, 600), background: "repeating-linear-gradient(0deg, rgba(0,0,0,.07) 0 3px, transparent 3px 30px), linear-gradient(180deg,#c9995f,#8a6340)", borderRadius: 12, boxShadow: "0 34px 54px rgba(0,0,0,.55), inset 0 0 0 6px rgba(0,0,0,.12)" }}>
        {Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), j = i % 5, x = 60 + (g % 2) * 320 + j * 50, y = 50 + Math.floor(g / 2) * 170;
          return j === 4 ? <div key={i} style={{ ...ab(x - 215, y + 70, 250, 16), background: "#2b1d10", transform: "rotate(-26deg)", borderRadius: 4, boxShadow: "inset 0 3px 0 rgba(0,0,0,.4), 0 2px 0 rgba(255,220,170,.4)" }} />
            : <div key={i} style={{ ...ab(x, y, 16, 150), background: "#2b1d10", borderRadius: 4, transform: `rotate(${(rnd(i) - 0.5) * 8}deg)`, boxShadow: "inset 3px 0 0 rgba(0,0,0,.4), 2px 0 0 rgba(255,220,170,.4)" }} />; })}
        {Array.from({ length: 6 }, (_, i) => { const k = ((t * 3 + i * 0.17) % 1); return <div key={i} style={{ ...ab(60 + (g0 % 2) * 320 + j0 * 50 + k * 90 * (rnd(i) - 0.3), 50 + Math.floor(g0 / 2) * 170 + 60 - k * 100, 14, 7), background: "#e3bf86", opacity: 1 - k, transform: `rotate(${k * 300}deg)` }} />; })}
        <div style={{ ...ab(440, 330), ...big(240, COL.red), opacity: e(t, t2, t2 + 0.15), transform: `scale(${t < t2 ? 0.001 : lerp(2.2, 1, sm(cl((t - t2) / 0.25)))}) rotate(-8deg)` }}>0</div>
      </div>
    </Stage>;
  };

  // 4 · el cartel clavado: WILD entra a martillazos; la mano con guante se acerca y retrocede; la mano desnuda se tacha con pincel rojo
  const WildSign: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, , t3] = As(["i want you safe", "wild animal", "never touch one"], a, b);
    const reach = t > a + 0.5 && t < t3 - 0.2 ? Math.max(0, Math.sin((t - a - 0.5) * 2.6)) : 0; void t1;
    const hit = Math.min(1.05, spr(t, a + 0.15, 1.3)), shake = Math.sin((t - a) * 26) * 4 * Math.exp(-Math.max(0, t - a - 0.15) * 4);
    const bare = e(t, t3 - 0.2, t3 + 0.1), slash = ei(t, t3 + 0.25, t3 + 0.7);
    return <Stage t={t} a={a} b={b} bg="c_gloves_mask" floor="soil">
      <div style={{ ...ab(948, 330, 26, 600), background: "linear-gradient(90deg,#5a3e27,#9a7650,#5a3e27)" }} />
      <Contact x={960} y={930} w={260} />
      <div style={{ ...center(960, 320 - (1 - hit) * 300, 1, -3 + (t > a + 0.15 ? shake : 0)), width: 700, height: 250, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 3px, transparent 3px 24px), linear-gradient(180deg,#c9a06a,#8f673f)", borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[40, 640].map((x) => <div key={x} style={{ ...ab(x, 110, 22, 22), borderRadius: "50%", background: "radial-gradient(circle,#ddd,#555)" }} />)}
        <div style={{ ...big(170, COL.red), textShadow: "0 6px 0 #5a160c" }}>WILD</div></div>
      <Dust t={t} t0={a + 0.2} x={960} y={330} n={10} />
      <div style={{ ...center(1380, 690, 1.3 + 0.04 * Math.sin(t * 3)) }}><Raccoon glow={0.5 + 0.5 * reach} ears={reach} /></div>
      <div style={{ ...center(lerp(380, 860, reach), 700 - 30 * reach, 1.2, 0), opacity: 1 - bare }}><Hand glove /></div>
      {bare > 0 && <div style={{ ...center(560, 720, 1.2), opacity: bare }}><Hand />
        <svg width={360} height={300} style={{ ...ab(-60, -50), overflow: "visible" }}><path d="M20 30 L330 260" stroke={COL.red} strokeWidth={38} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - slash} /><path d="M330 30 L20 260" stroke={COL.red} strokeWidth={38} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ei(t, t3 + 0.6, t3 + 1.0)} /></svg></div>}
    </Stage>;
  };

  // 5 · el tanuki de los cuentos: una hoja cae girando sobre su cabeza, ¡puf!, y se vuelve una tetera que humea
  const TanukiShift: React.FC<FxP> = ({ t, a, b }) => {
    const [, , t3] = As(["black mask", "cousin of the dog", "changes shape"], a, b);
    const land = Math.min(t3, a + 1.7), leaf = ei(t, a + 0.1, land), puff = cl((t - land) / 0.9), m = ei(t, land + 0.15, land + 0.6);
    return <Stage t={t} a={a} b={b} bg="c_tanuki_statue" floor="paper">
      <Contact x={960} y={900} w={560} />
      <div style={{ ...center(960, 590, 2.15 * (1 - m) + 0.001, Math.sin(t * 2) * 2), opacity: 1 - m }}><Raccoon tint="t" s={1} /></div>
      <div style={{ ...center(960, 620, 2.1 * m + 0.001), opacity: m }}>
        <svg width={360} height={280} viewBox="0 0 360 280"><defs><radialGradient id="tp" cx="40%" cy="35%"><stop offset="0" stopColor="#6b5444" /><stop offset="1" stopColor="#2a211b" /></radialGradient></defs><ellipse cx={180} cy={170} rx={130} ry={100} fill="url(#tp)" /><ellipse cx={140} cy={130} rx={40} ry={24} fill="rgba(255,255,255,.2)" /><path d="M300 150 Q350 120 345 80" stroke="#3b2f26" strokeWidth={26} fill="none" strokeLinecap="round" /><path d="M60 140 Q10 170 40 220" stroke="#3b2f26" strokeWidth={18} fill="none" /><rect x={150} y={56} width={60} height={20} rx={8} fill="#2a211b" /><path d="M110 70 Q180 -10 250 70" stroke="#8a6a3a" strokeWidth={10} fill="none" /><path d="M40 230 Q20 270 60 260" stroke="#5a4028" strokeWidth={16} fill="none" strokeLinecap="round" /></svg>
        {Array.from({ length: 5 }, (_, i) => { const k = ((t * 0.6 + i * 0.2) % 1); return <div key={i} style={{ ...ab(330 + k * 40, 60 - k * 160, 50, 50), borderRadius: "50%", background: `rgba(255,255,255,${0.4 * (1 - k)})`, filter: "blur(7px)" }} />; })}
      </div>
      {puff > 0 && puff < 1 && Array.from({ length: 12 }, (_, i) => { const r = 120 + 260 * sm(puff); const an = (i / 12) * Math.PI * 2; return <div key={i} style={{ ...ab(960 + Math.cos(an) * r - 80, 560 + Math.sin(an) * r * 0.7 - 80, 160, 160), borderRadius: "50%", background: `rgba(250,245,235,${0.75 * (1 - puff)})`, filter: "blur(10px)" }} />; })}
      {t < land + 0.1 && <div style={{ ...center(960 + Math.sin(leaf * 8) * 120 * (1 - leaf), lerp(150, 420, leaf), 1.4, leaf * 640) }}>
        <svg width={90} height={60} viewBox="0 0 90 60"><path d="M5 30 Q45 -10 85 30 Q45 70 5 30Z" fill="#6f9a3a" /><path d="M5 30 L85 30" stroke="#3f6a1a" strokeWidth={3} /></svg></div>}
    </Stage>;
  };

  // 6 · la guerra del ladrillo: caen dos ladrillos sobre la tapa, la pata los empuja; baja el gancho de la grúa y se lleva uno; la foto de la jaula-trampa cae como pregunta
  const BrickCrane: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3, t4] = As(["two bricks", "pushed off two bricks", "we will need a crane", "buy a trap"], a, b);
    const push = ei(t, t2 + 0.2, t2 + 1.1), hook = ei(t, t3, t3 + 1.0), lift = ei(t, t3 + 1.0, t3 + 1.9);
    const hy = lerp(0, 290, hook) * (1 - lift) + 40 * lift;
    return <Stage t={t} a={a} b={b} bg="c_brick_pushed" floor="stone">
      <div style={{ ...ab(560, 430) }}><Can w={400} /></div>
      <Contact x={760} y={905} w={520} />
      {[0, 1].map((i) => { const t0 = Math.min(t1, a + 0.4) + i * 0.45, y0 = 410 - i * 92 + fall(t, t0, 520);
        const grab = i === 1 && hook > 0.98, y = grab ? 120 + hy + 110 : y0 + (i === 0 ? push * push * 560 : 0), x = i === 1 && grab ? 800 : 650 + i * 30 + (i === 0 ? push * 640 : 0);
        return t > t0 - 0.02 ? <React.Fragment key={i}><div style={{ ...ab(x, y, 250, 96), background: "linear-gradient(180deg,#c9653f,#7f3622)", borderRadius: 6, boxShadow: "0 14px 22px rgba(0,0,0,.5), inset 0 0 0 4px rgba(0,0,0,.15)", transform: `rotate(${i === 0 ? push * 110 : 0}deg)` }}>
          {[0, 1, 2].map((h) => <div key={h} style={{ ...ab(30 + h * 72, 32, 36, 32), borderRadius: 6, background: "rgba(0,0,0,.28)" }} />)}</div>
          <Dust t={t} t0={t0 + 0.1} x={x + 125} y={y0 + 96} n={8} /></React.Fragment> : null; })}
      {t > t2 - 0.4 && <div style={{ ...center(lerp(520, 640, push), 500, 1, 70) }}><Paw s={1.6} /></div>}
      {t > t3 - 0.1 && <><div style={{ ...ab(906, 120, 14, hy + 10), background: "#3a3a3a" }} />
        <div style={{ ...ab(840, 110, 160, 26), background: "#d9a441", borderRadius: 6 }} />
        <svg width={140} height={130} viewBox="0 0 140 130" style={{ ...ab(843, 120 + hy), transform: `rotate(${Math.sin(t * 2.4) * 5}deg)`, transformOrigin: "50% 0" }}><rect x={50} y={0} width={40} height={40} rx={6} fill="#d9a441" /><path d="M70 40 L70 80 A 30 30 0 1 1 40 100" stroke="#b9bfc2" strokeWidth={16} fill="none" strokeLinecap="round" /></svg></>}
      <Plate id="c_trap_cage" x={1420} y={460} w={420} h={300} t={t} t0={t4} rot={4} />
    </Stage>;
  };

  // 7 · la nariz que olfatea: la nariz grande se mueve; de cada comida sale una cinta de olor que termina adentro de la nariz; después se iluminan tres escondites
  const ScentLines: React.FC<FxP> = ({ t, a, b }) => {
    const ts = As(["the porch", "the fallen fruit", "the bird seed", "the grease on the grill"], a, b), [tq] = As(["quiet place"], a, b);
    const NX = 960, NY = 600, sniff = 1 + 0.06 * Math.max(0, Math.sin(t * 9));
    const SRC: [number, number, React.ReactNode][] = [
      [400, 300, <Bowl s={1} />],
      [380, 780, <Persimmon s={1.9} />],
      [1540, 290, <svg width={200} height={110} viewBox="0 0 200 110"><path d="M10 100 Q100 -20 190 100Z" fill="#c9a36a" />{Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={30 + rnd(i) * 140} cy={60 + rnd(i, 2) * 38} rx={6} ry={4} fill="#7a5a2a" />)}</svg>],
      [1540, 770, <svg width={240} height={150} viewBox="0 0 240 150"><ellipse cx={120} cy={40} rx={110} ry={26} fill="#1b1b1b" />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${30 + i * 30} 26 L${30 + i * 30} 56`} stroke="#8a8a8a" strokeWidth={5} />)}<path d="M10 40 Q120 170 230 40" fill="#2a2a2a" /><ellipse cx={90} cy={40} rx={24} ry={8} fill="rgba(200,150,60,.9)" /></svg>],
    ];
    const hide = e(t, tq, tq + 0.4);
    return <Stage t={t} a={a} b={b} bg="n_raccoon_sniff" floor="soil" light={0.8}>
      <div style={{ ...center(NX, NY - 60, 2.0 * (1 - 0.15 * hide)) }}><div style={{ transform: `scale(${sniff})`, transformOrigin: "50% 75%" }}><Raccoon glow={0.3} /></div></div>
      <svg width={1920} height={1080} style={ab(0, 0)}>
        {SRC.map(([x, y], i) => { const k = ei(t, ts[i] - 0.3, ts[i] + 0.8), wv = Math.sin(t * 3 + i) * 30;
          return <path key={i} d={`M${x} ${y} C ${(x + NX) / 2 + wv} ${y + 120}, ${NX + (x < NX ? -220 : 220)} ${NY + 230}, ${NX + (x < NX ? -12 : 12)} ${NY + 50}`} stroke="rgba(255,226,160,.9)" strokeWidth={16} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} opacity={0.85} />; })}
      </svg>
      {SRC.map(([x, y, el], i) => <div key={i} style={{ ...center(x, y, pop(t, ts[i] - 0.35) * (1 - 0.3 * hide)), filter: SH, opacity: 1 - 0.6 * hide }}>{el}</div>)}
      <Plate id="n_shed_gap" x={960} y={800} w={560} h={330} t={t} t0={tq} rot={-2} />
    </Stage>;
  };

  // 8 · leer el desorden: pasto visto desde arriba; la bolsa rota se arrastra y deja el surco (perro); después los hoyitos redondos del tamaño de un puño (zorrino)
  const LawnClues: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3] = As(["drags the bag", "digs little round holes", "the size of your fist"], a, b);
    const drag = ei(t, t1 - 0.2, t1 + 1.4);
    return <Stage t={t} a={a} b={b} bg="n_lawn_flipped" floor="soil">
      <div style={{ ...ab(240, 150, 1440, 780), borderRadius: 18, background: "#3f6f2c", boxShadow: "0 30px 60px rgba(0,0,0,.5)", overflow: "hidden", transform: "perspective(1600px) rotateX(18deg)" }}>
        <Img src={IMG("n_lawn_flipped")} style={{ ...ab(0, 0, 1440, 780), objectFit: "cover", filter: "saturate(1.1)" }} />
        <svg width={1440} height={780} style={ab(0, 0)}>{Array.from({ length: 260 }, (_, i) => { const x = rnd(i) * 1440, y = rnd(i, 2) * 780, h = 14 + rnd(i, 3) * 18, l = rnd(i, 4) - 0.5; return <path key={i} d={`M${x} ${y} q ${l * 8} ${-h / 2} ${l * 14} ${-h}`} stroke={rnd(i, 5) > 0.5 ? "#7fb85a" : "#2f5a22"} strokeWidth={3} fill="none" />; })}
          <path d="M60 640 C 300 580, 420 400, 700 380" stroke="#6b4a2a" strokeWidth={60} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${drag} 1`} opacity={0.85} />
          <path d="M60 640 C 300 580, 420 400, 700 380" stroke="#3a2614" strokeWidth={16} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${drag} 1`} opacity={0.6} /></svg>
        <div style={{ ...center(lerp(230, 720, drag), lerp(600, 380, drag), 1.2, -20 + drag * 40), width: 220, height: 180, borderRadius: "30% 40% 20% 30%", background: "linear-gradient(160deg,#ffffff,#d9d9d2 55%,#a9a9a2)", boxShadow: "0 14px 22px rgba(0,0,0,.5)", clipPath: "polygon(0 10%,40% 0,100% 8%,96% 70%,80% 100%,60% 80%,40% 100%,10% 85%)" }} />
        {drag > 0.2 && Array.from({ length: 10 }, (_, i) => { const k = cl(drag * 1.2 - i * 0.09); return k > 0 ? <div key={i} style={{ ...center(lerp(60, 700, i / 10) + rnd(i) * 60, lerp(640, 380, i / 10) + (rnd(i, 2) - 0.5) * 120, 1, rnd(i, 3) * 360), width: 50, height: 30, background: ["#e9e4d6", "#c94a2a", "#f2d24c"][i % 3], clipPath: "polygon(0 0,100% 20%,80% 100%,10% 70%)", opacity: k }} /> : null; })}
        {Array.from({ length: 6 }, (_, i) => { const t0 = t2 + i * 0.22, q = Math.min(1.08, spr(t, t0, 1.4)); return t > t0 ? <div key={i} style={{ ...center(980 + (i % 3) * 150, 230 + Math.floor(i / 3) * 210 + (i % 2) * 30, q) }}>
          <div style={{ width: 140, height: 100, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%, #120c06, #3a2614 55%, #6b4a2a 72%, transparent 74%)" }} />
          {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ ...ab(70 + Math.cos(j) * 80 - 14, 50 + Math.sin(j) * 56 - 10, 28, 20), borderRadius: "50%", background: "#6b4a2a" }} />)}</div> : null; })}
        {t > t3 - 0.1 && <div style={{ ...center(1300, 650 + fall(t, t3 - 0.1, 300), 1, -10) }}>
          <svg width={180} height={170} viewBox="0 0 180 170" style={{ filter: SH }}><rect x={20} y={40} width={140} height={110} rx={40} fill="#efc29a" stroke="#c9926a" strokeWidth={4} />{[45, 78, 111, 144].map((x) => <path key={x} d={`M${x - 14} 44 Q${x} 26 ${x + 14} 44`} stroke="#c9926a" strokeWidth={4} fill="#efc29a" />)}<path d="M30 90 Q60 70 90 96" stroke="#c9926a" strokeWidth={4} fill="none" /></svg></div>}
      </div>
    </Stage>;
  };

  // 9 · la radio vieja en el maíz: la aguja barre todo el dial; en CHARLA salen globos grandes de la rejilla; en MÚSICA la nota se tacha
  const RadioDial: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, , t3, t4] = As(["talk station", "the last ten days", "people talking", "the music stations"], a, b);
    const sweep = t < t1 ? lerp(0.05, 0.95, (Math.sin((t - a) * 2.6 - 1.57) + 1) / 2) : t < t4 ? lerp(0.95, 0.8, ei(t, t1, t1 + 0.5)) : lerp(0.8, 0.15, ei(t, t4, t4 + 0.7));
    const music = t > t4 + 0.4, hum = 1 + 0.01 * Math.sin(t * 30);
    return <Stage t={t} a={a} b={b} bg="c_radio_garden" floor="soil">
      <Contact x={960} y={880} w={980} />
      <div style={{ ...center(900, 600, 1.18 * hum), width: 920, height: 520, borderRadius: 40, background: "linear-gradient(180deg,#9a6a3e,#5c3a1f)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.2)" }}>
        <div style={{ ...ab(50, 50, 480, 420), borderRadius: 30, background: "repeating-linear-gradient(90deg,#3a2614 0 10px,#5a3b20 10px 18px)", boxShadow: "inset 0 0 30px rgba(0,0,0,.6)" }} />
        <div style={{ ...ab(570, 60, 300, 160), borderRadius: 14, background: "linear-gradient(180deg,#f8ecc9,#d9c58e)", overflow: "hidden", boxShadow: "inset 0 0 20px rgba(255,200,100,.5)" }}>
          {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...ab(16 + i * 21, 20, 3, i % 2 ? 26 : 44), background: "#5c3a1f" }} />)}
          <div style={{ ...ab(14, 100), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#5c3a1f" }}>MUSIC</div><div style={{ ...ab(196, 100), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#5c3a1f" }}>TALK</div>
          <div style={{ ...ab(16 + sweep * 266, 8, 7, 150), background: COL.red, boxShadow: "0 0 10px rgba(200,50,30,.8)" }} />
        </div>
        {[0, 1].map((i) => <div key={i} style={{ ...ab(610 + i * 140, 290, 120, 120), borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #efe2c0, #8f7a52)", transform: `rotate(${i ? sweep * 320 : Math.sin(t) * 20}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.45)" }}><div style={{ ...ab(55, 8, 10, 44), background: "#3a2614", borderRadius: 4 }} /></div>)}
      </div>
      {!music && t > t3 - 0.8 && Array.from({ length: 3 }, (_, i) => { const k = ((t - t3 + 0.8 + i * 0.7) % 2.1) / 2.1; return <div key={i} style={{ ...center(500 + i * 170 + k * 60, 360 - k * 150, 0.7 + k * 0.5), opacity: Math.sin(k * Math.PI), width: 300, height: 170, borderRadius: 90, background: COL.cream, boxShadow: "0 14px 24px rgba(0,0,0,.45)" }}>
        <div style={{ ...ab(30, 104, 40, 40), background: COL.cream, clipPath: "polygon(0 0,100% 0,20% 100%)" }} />
        {[0, 1, 2].map((j) => <div key={j} style={{ ...ab(50 + j * 45, 55, 22, 22), borderRadius: "50%", background: COL.ink, opacity: (Math.floor(t * 4) + j) % 3 === 0 ? 1 : 0.4 }} />)}</div>; })}
      {music && <div style={{ ...center(1560, 470, 1.25 * pop(t, t4 + 0.4)) }}><svg width={220} height={240} viewBox="0 0 220 240" style={{ filter: SH }}><path d="M80 40 L180 20 L180 170" stroke={COL.cream} strokeWidth={18} fill="none" /><ellipse cx={60} cy={190} rx={44} ry={32} fill={COL.cream} /><ellipse cx={160} cy={170} rx={44} ry={32} fill={COL.cream} /><path d="M80 40 L80 190" stroke={COL.cream} strokeWidth={18} />
        <path d="M10 230 L210 10" stroke={COL.red} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ei(t, t4 + 0.6, t4 + 0.9)} /></svg></div>}
    </Stage>;
  };

  // 10 · la falda del árbol: la chapa brillante entra de costado y se enrolla alrededor del tronco; la pata resbala con chispas
  const MetalSkirt: React.FC<FxP> = ({ t, a, b }) => {
    const wrap = ei(t, a + 0.15, a + 1.6), slip = cl((t - a - 1.7) / 1.1), shine = ((t - a) * 0.8) % 1;
    return <Stage t={t} a={a} b={b} bg="n_tree_island" floor="soil">
      <div style={{ ...ab(800, 0, 320, 960), background: "repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 6px, transparent 6px 34px), linear-gradient(90deg,#3d2a1b,#7a5636 40%,#5a3e27 70%,#2f2015)", borderRadius: "0 0 30px 30px" }} />
      <Contact x={960} y={960} w={620} />
      <div style={{ ...ab(lerp(1500, 780, sm(cl(wrap * 1.6))), 520, lerp(380, 360, wrap), 260), borderRadius: lerp(6, 30, wrap), background: `linear-gradient(90deg,#5c6367,#d9dfe2 ${10 + shine * 70}%,#ffffff ${12 + shine * 70}%,#9aa2a6 ${30 + shine * 60}%,#4c5357)`, boxShadow: "0 24px 40px rgba(0,0,0,.55), inset 0 6px 0 rgba(255,255,255,.4), inset 0 -8px 0 rgba(0,0,0,.25)", transform: `perspective(900px) rotateY(${lerp(-50, 0, wrap)}deg)` }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...ab(30 + i * 95, 120, 12, 12), borderRadius: "50%", background: "#6f777c", opacity: e(t, a + 1.5 + i * 0.08, a + 1.6 + i * 0.08) }} />)}
      </div>
      {t > a + 1.5 && <div style={{ ...center(960, lerp(540, 830, sm(slip)), 1.55, 0) }}><Paw /></div>}
      {slip > 0 && slip < 1 && Array.from({ length: 10 }, (_, i) => { const k = ((t * 4 + i * 0.1) % 1); return <div key={i} style={{ ...ab(900 + rnd(i) * 120 + (rnd(i, 2) - 0.5) * 100 * k, lerp(520, 780, slip) + k * 60, 14, 14), borderRadius: "50%", background: "#fff6c8", boxShadow: "0 0 12px #ffe08a", opacity: 1 - k }} />; })}
    </Stage>;
  };

  // 11 · el mapa en la cabeza del mapache: la cabeza piensa un mapa; tres sellos verdes se estampan con peso; al final el cubo recibe un sello rojo
  const MemoryMap: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3, , t5] = As(["does not hurt him", "does not poison him", "it washes off", "he remembers", "this can is not nice"], a, b);
    const stamp = (t0: number) => { const k = cl((t - t0) / 0.25); return { s: k <= 0 ? 0 : k < 1 ? lerp(2.4, 1, sm(k)) : 1, o: k > 0 ? 1 : 0 }; };
    const red = stamp(t5);
    return <Stage t={t} a={a} b={b} bg="c_spray_bottle" floor="paper">
      <div style={{ ...center(420, 720, 1.75, Math.sin(t * 1.4) * 3) }}><Raccoon blink={(t * 0.7) % 1 > 0.95 ? 0.9 : 0} /></div>
      {[0, 1, 2].map((i) => <div key={i} style={{ ...center(600 + i * 70, 470 - i * 70, 1), width: 30 + i * 20, height: 30 + i * 20, borderRadius: "50%", background: "#efe2c2", boxShadow: "0 8px 14px rgba(0,0,0,.4)" }} />)}
      <div style={{ ...ab(780, 150, 900, 600), background: "#efe2c2", borderRadius: "48% 52% 46% 54% / 50% 46% 54% 50%", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `scale(${1 + 0.015 * Math.sin(t * 2)})` }}>
        <svg width={900} height={600} style={ab(0, 0)}>
          <rect x={150} y={150} width={200} height={140} fill="none" stroke="#6b5235" strokeWidth={7} /><path d="M140 155 L250 90 L360 155" fill="none" stroke="#6b5235" strokeWidth={7} />
          <path d="M350 260 C 460 380, 560 360, 640 420" stroke="#6b5235" strokeWidth={7} strokeDasharray="20 14" fill="none" />
          <g transform="translate(640,390)"><rect x={0} y={20} width={80} height={90} rx={8} fill="#8a9195" /><rect x={-8} y={8} width={96} height={18} rx={8} fill="#b9bfc2" /></g>
          <g transform="translate(560,120)"><circle cx={0} cy={0} r={50} fill="#5e8a3a" /><rect x={-8} y={40} width={16} height={50} fill="#6b4a2a" /></g>
        </svg>
        {[t1, t2, t3].map((t0, i) => { const s = stamp(t0); return s.o ? <div key={i} style={{ ...center(170 + i * 190, 470, s.s, (i - 1) * 8), width: 170, height: 170, borderRadius: "50%", border: `14px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(63,138,58,.18)", boxShadow: `0 ${18 * (s.s - 1) + 6}px ${20 * s.s}px rgba(0,0,0,.35)` }}>
          <svg width={90} height={80} viewBox="0 0 90 80"><path d="M8 44 L34 70 L84 10" stroke={GREEN} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div> : null; })}
        {red.o > 0 && <div style={{ ...center(680, 445, red.s, -12), width: 230, height: 230, borderRadius: "50%", border: `16px solid ${COL.red}`, background: "rgba(200,50,30,.15)" }}>
          <svg width={200} height={200} viewBox="0 0 200 200"><path d="M50 50 L150 150 M150 50 L50 150" stroke={COL.red} strokeWidth={22} strokeLinecap="round" /></svg></div>}
      </div>
    </Stage>;
  };

  // 12 · el polvo seco: el frasco se vuelca, el viento lleva la nube a los ojos del gato (que se cierran); con agua, la niebla cae justo en la cruz marcada
  const WindPowder: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3] = As(["throw the dry powder", "the wind blows it", "always mixed with water"], a, b);
    const water = t > t3, tip = ei(t, a + 0.1, Math.min(t1, a + 0.8)), wind = ei(t, t2 - 0.3, t2 + 0.6), squint = e(t, t2 + 0.5, t2 + 0.9);
    return <Stage t={t} a={a} b={b} bg="c_rain_porch" floor="soil">
      {!water && <>
        <div style={{ ...center(420, 560, 1.2, -110 * tip) }}><Jar fill="#c73a1c" label="cayenne" /></div>
        {wind > 0 && Array.from({ length: 6 }, (_, i) => { const k = ((t * 0.9 + i / 6) % 1); return <div key={i} style={{ ...ab(300 + k * 1300, 280 + i * 70, 220, 8), borderRadius: 8, background: `rgba(255,255,255,${0.5 * wind * Math.sin(k * Math.PI)})` }} />; })}
        {Array.from({ length: 220 }, (_, i) => { const st = a + 0.3 + rnd(i) * 1.4, k = cl((t - st) / 2.2); if (k <= 0) return null;
          const x = lerp(470, 480 + rnd(i, 2) * 320, sm(cl(k * 2))) + wind * k * (900 + rnd(i, 3) * 200), y = lerp(480, 560 + rnd(i, 4) * 200, sm(cl(k * 2))) - wind * k * (rnd(i, 5) * 260 - 40);
          return <div key={i} style={{ ...ab(x, y, 14 + rnd(i, 6) * 16, 14 + rnd(i, 6) * 16), borderRadius: "50%", background: "#d8431f", boxShadow: "0 0 10px rgba(216,67,31,.6)", opacity: 0.85 * (1 - k * 0.5) }} />; })}
        <div style={{ ...center(1420, 540, 1.4 * pop(t, t2 - 0.2)) }}><svg width={420} height={380} viewBox="0 0 420 380" style={{ filter: SH }}>
          <path d="M60 140 L80 20 L170 100 Z M360 140 L340 20 L250 100 Z" fill="#d9822b" /><ellipse cx={210} cy={210} rx={180} ry={150} fill="#e8973a" />
          {[140, 280].map((x) => <g key={x}><ellipse cx={x} cy={190} rx={36} ry={Math.max(3, 40 * (1 - squint))} fill="#f6e27a" /><ellipse cx={x} cy={190} rx={10} ry={Math.max(2, 32 * (1 - squint))} fill="#1b1712" /></g>)}
          <path d="M195 250 L225 250 L210 268 Z" fill="#c45a6a" /><path d="M210 268 Q190 290 170 280 M210 268 Q230 290 250 280" stroke="#5a3a20" strokeWidth={5} fill="none" />
          {squint > 0.5 && [110, 250].map((x) => <path key={x} d={`M${x} 160 l20 30 l20 -30`} stroke="#5a3a20" strokeWidth={6} fill="none" />)}</svg></div></>}
      {water && <>
        <div style={{ ...ab(720, 860, 480, 110), borderRadius: "50%", border: "10px dashed rgba(251,246,234,.9)", boxShadow: "0 0 30px rgba(255,240,200,.5)" }} />
        <svg width={1920} height={1080} style={ab(0, 0)}><path d="M960 915 l-70 -45 M960 915 l70 45 M960 915 l70 -45 M960 915 l-70 45" stroke={COL.cream} strokeWidth={16} strokeLinecap="round" /></svg>
        <div style={{ ...center(700, 480, pop(t, t3), -25) }}><Bottle fill="rgba(200,60,30,.7)" label="+ water" s={1.1} /></div>
        {Array.from({ length: 90 }, (_, i) => { const k = ((t - t3) * 0.8 + rnd(i)) % 1; return <div key={i} style={{ ...ab(lerp(780, 960 + (rnd(i, 2) - 0.5) * 220, k), lerp(380, 900, k * k), 10, 10), borderRadius: "50%", background: "rgba(220,90,50,.65)", opacity: 1 - k * 0.6 }} />; })}</>}
    </Stage>;
  };

  // 13 · el vinagre como grito: se destapa la botella y los anillos de onda empujan al mapache (orejas atrás) fuera del cuadro
  const ScreamRings: React.FC<FxP> = ({ t, a, b }) => {
    const [t1] = As(["like a scream"], a, b), t0 = Math.max(a + 0.3, t1 - 0.6);
    const back = ei(t, t1, t1 + 1.6);
    return <Stage t={t} a={a} b={b} bg="n_vinegar_jug" floor="wood">
      <div style={{ ...center(560, 600) }}><Bottle fill="rgba(235,240,232,.85)" label="vinegar" s={1.2} /></div>
      <Contact x={560} y={820} w={260} />
      <div style={{ ...center(590, 380 - 220 * ei(t, t0, t0 + 0.4), 1, 40 * ei(t, t0, t0 + 0.4)), width: 48, height: 36, background: COL.red, borderRadius: 6, opacity: 1 - e(t, t0 + 0.5, t0 + 0.8) }} />
      {t > t0 + 0.2 && Array.from({ length: 6 }, (_, i) => { const k = ((t - t0 - 0.2) * 0.75 + i / 6) % 1; return <div key={i} style={{ ...center(600, 380, 0.3 + k * 4.4), width: 300, height: 300, borderRadius: "50%", border: `${12 * (1 - k) + 2}px solid rgba(255,240,200,${0.85 * (1 - k)})` }} />; })}
      <div style={{ ...center(lerp(1900, 1300, ei(t, a + 0.1, a + 0.8)) + 560 * back, 560 + 20 * Math.sin(back * 8), 1.25 - 0.15 * back, 14 * back) }}><Raccoon s={1} blink={back > 0.15 ? 0.85 : 0} ears={cl(back * 3)} /></div>
      {back > 0 && Array.from({ length: 4 }, (_, i) => <div key={i} style={{ ...ab(1100 + 560 * back - 140 - i * 60, 470 + i * 50, 120 * back, 10), borderRadius: 6, background: "rgba(251,246,234,.6)" }} />)}
      {t > t1 && <div style={{ ...center(820, 300, pop(t, t1), -8), ...big(130, COL.cream) }}>AAAH!</div>}
    </Stage>;
  };

  // 14 · la prueba del diario: la hoja se hace un bollo con facetas, entra justo en el hueco; luna→sol por el cielo; a la mañana el bollo sale rodando
  const PaperPlug: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3] = As(["crumple a sheet", "into the entrance hole", "look the next morning"], a, b);
    const cr = ei(t, a + 0.1, t1 + 0.6), into = ei(t, t2, t2 + 0.7), day = ei(t, t3, t3 + 1.0), out = ei(t, t3 + 0.7, t3 + 1.7);
    const HX = 1150, HY = 645, px = lerp(lerp(560, HX, into), HX - 420, out), py = lerp(lerp(520, HY, into), 880, out) - Math.sin(out * Math.PI) * 60, sc = lerp(lerp(1.5, 1, cr), 0.62, into) * (1 + 0.2 * out);
    const sky = lerp(Math.PI, 0, day);
    return <Stage t={t} a={a} b={b} bg="c_porch_gap" floor="wood" light={0.4 + 0.8 * day}>
      <div style={{ ...ab(820, 430, 640, 400), background: "repeating-linear-gradient(0deg,#8a6340 0 58px,#5a3e27 58px 64px)", boxShadow: "0 30px 50px rgba(0,0,0,.55)", borderRadius: 6 }}>
        <div style={{ ...ab(220, 140, 220, 150), borderRadius: "110px 110px 10px 10px", background: "radial-gradient(ellipse at 50% 70%, #050403, #1a120b 70%)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.8)" }} /></div>
      <div style={{ ...center(px, py, sc, cr * 200 + out * 400) }}>
        <svg width={240} height={240} viewBox="0 0 240 240" style={{ filter: SH }}>
          {cr < 0.5 ? <rect x={20} y={20} width={200} height={200} rx={6} fill="#ece6d6" transform={`skewX(${cr * 30})`} /> : <>
            <polygon points="40,70 110,20 190,45 225,120 190,200 110,225 35,180 15,110" fill="#e4ddc9" />
            <polygon points="110,20 190,45 130,110" fill="#f6f1e4" /><polygon points="15,110 40,70 130,110 35,180" fill="#cfc6ae" /><polygon points="130,110 225,120 190,200" fill="#d9d1bb" /><polygon points="130,110 110,225 35,180" fill="#bfb69c" /></>}
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M30 ${50 + i * 28} L210 ${45 + i * 30}`} stroke="rgba(0,0,0,.18)" strokeWidth={3} opacity={1 - cr} />)}
        </svg></div>
      <div style={{ ...center(960 + Math.cos(sky) * 560, 390 - Math.sin(sky) * 160) }}>
        {day < 0.5 ? <div style={{ width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#fffbe8,#d9d2b6)", boxShadow: "0 0 40px rgba(255,250,220,.6)", opacity: 1 - day * 2 }} />
          : <div style={{ width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle,#fff3b0,#f2b33c)", boxShadow: "0 0 80px rgba(255,200,80,.8)", opacity: (day - 0.5) * 2 }} />}</div>
    </Stage>;
  };

  // 15 · la nariz mil veces mejor: la nariz enorme del mapache contra la tuya chiquita; las partículas de olor entran a la grande y el contador mecánico rueda hasta 1000
  const NoseThousand: React.FC<FxP> = ({ t, a, b }) => {
    const [, t2] = As(["it does not burn", "a thousand times better", "and it is safe"], a, b);
    const n = Math.round(lerp(1, 1000, Math.pow(ei(t, t2 - 0.4, t2 + 2.2), 1.4)));
    const digits = String(n).padStart(4, "0").split("");
    const sniff = 1 + 0.05 * Math.max(0, Math.sin(t * 10));
    return <Stage t={t} a={a} b={b} bg="c_garlic_strain" floor="paper">
      <div style={{ ...center(380, 520) }}><svg width={160} height={180} viewBox="0 0 160 180" style={{ filter: SH }}><path d="M80 10 Q70 90 40 130 Q30 160 60 160 Q80 150 100 160 Q130 160 120 130 Q90 90 80 10Z" fill="#efc29a" stroke="#c9926a" strokeWidth={4} /><ellipse cx={62} cy={148} rx={10} ry={6} fill="#8a5a3a" /><ellipse cx={98} cy={148} rx={10} ry={6} fill="#8a5a3a" /></svg></div>
      <div style={{ ...center(380 + 30 * Math.sin(t * 3), 360), width: 26, height: 26, borderRadius: "50%", background: "rgba(255,220,140,.95)", boxShadow: "0 0 18px rgba(255,220,140,.9)" }} />
      <div style={{ ...center(1080, 520, sniff) }}><svg width={620} height={420} viewBox="0 0 620 420" style={{ filter: SH }}><defs><radialGradient id="nz" cx="40%" cy="30%"><stop offset="0" stopColor="#4a4540" /><stop offset="1" stopColor="#100e0c" /></radialGradient></defs>
        <ellipse cx={310} cy={230} rx={290} ry={180} fill="#efe9dc" /><ellipse cx={310} cy={190} rx={200} ry={130} fill="url(#nz)" /><ellipse cx={240} cy={220} rx={44} ry={30} fill="#000" /><ellipse cx={380} cy={220} rx={44} ry={30} fill="#000" /><ellipse cx={260} cy={130} rx={60} ry={24} fill="rgba(255,255,255,.25)" />{[-1, 1].map((sd) => [0, 1, 2].map((j) => <path key={`${sd}${j}`} d={`M${310 + sd * 150} ${250 + j * 26} Q ${310 + sd * 260} ${236 + j * 30} ${310 + sd * 330} ${226 + j * 40}`} stroke="#3a3530" strokeWidth={5} fill="none" strokeLinecap="round" />))}</svg></div>
      {Array.from({ length: 70 }, (_, i) => { const k = ((t * 0.7 + rnd(i)) % 1), x0 = 760 + rnd(i, 2) * 700, y0 = 160 + rnd(i, 3) * 100; return t > t2 - 0.6 ? <div key={i} style={{ ...ab(lerp(x0, 1040 + (i % 2 ? 70 : -70), k * k), lerp(y0, 560, k * k), 14, 14), borderRadius: "50%", background: "rgba(255,220,140,.95)", boxShadow: "0 0 10px rgba(255,220,140,.9)", opacity: Math.sin(k * Math.PI) }} /> : null; })}
      <div style={{ ...center(1080, 830, 1.2), display: "flex", gap: 10, padding: 16, borderRadius: 14, background: "linear-gradient(180deg,#3a3a3a,#141414)", boxShadow: "0 20px 34px rgba(0,0,0,.6)" }}>
        {digits.map((d, i) => <div key={i} style={{ width: 84, height: 110, borderRadius: 8, background: "linear-gradient(180deg,#cfc9bb,#fbf6ea 45%,#fbf6ea 55%,#cfc9bb)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, color: COL.ink, boxShadow: "inset 0 6px 8px rgba(0,0,0,.3)" }}>{d}</div>)}
      </div>
    </Stage>;
  };

  // 16 · el calendario de la pizarra: caen gotas una por una en los días marcados; el borrador gigante cruza y se lleva la ruta de tiza con polvo
  const EraseRoute: React.FC<FxP> = ({ t, a, b }) => {
    const [, t2, t3, t4] = As(["one time does nothing", "every two days", "once a week", "you are erasing"], a, b);
    const days = [0, 2, 4, 6, 8, 10, 12], er = ei(t, t4 - 0.2, t4 + 1.5);
    return <Stage t={t} a={a} b={b} bg="n_garlic_fence" floor="wood">
      <div style={{ ...ab(250, 150, 1420, 780), background: "radial-gradient(ellipse at 50% 40%, #33433a, #1c2620)", borderRadius: 14, border: "22px solid #8a6340", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
        {Array.from({ length: 14 }, (_, i) => { const x = 40 + (i % 7) * 192, y = 40 + Math.floor(i / 7) * 220, on = days.indexOf(i), t0 = on < 0 ? 1e9 : on < 7 ? Math.min(t2, a + 1) + on * 0.3 : t3 + (on - 7) * 0.35, dy = fall(t, t0, 300, 1.4);
          return <div key={i} style={{ ...ab(x, y, 172, 200), border: "4px solid rgba(240,240,230,.4)", borderRadius: 8 }}>
            <div style={{ ...ab(12, 6), fontFamily: BRUSH, fontSize: 44, color: "rgba(240,240,230,.75)" }}>{i + 1}</div>
            {t > t0 - 0.02 && <svg width={80} height={110} viewBox="0 0 46 64" style={{ ...ab(46, 66 + dy), overflow: "visible" }}><path d="M23 2 Q44 34 40 44 A 18 18 0 0 1 6 44 Q2 34 23 2Z" fill="#8fd0ff" stroke="#e8f6ff" strokeWidth={3} /><ellipse cx={16} cy={40} rx={4} ry={7} fill="rgba(255,255,255,.7)" /></svg>}</div>; })}
        <svg width={1376} height={736} style={ab(0, 0)}><path d="M40 700 C 300 560, 600 640, 900 520 S 1250 560, 1320 500" stroke="rgba(245,245,235,.9)" strokeWidth={14} fill="none" strokeDasharray="30 18" />
          {[200, 520, 860, 1180].map((x, i) => <g key={i} transform={`translate(${x},${[640, 610, 540, 540][i]}) rotate(-20)`}><ellipse cx={0} cy={0} rx={10} ry={14} fill="rgba(245,245,235,.8)" />{[-12, -4, 4, 12].map((dx) => <circle key={dx} cx={dx} cy={-20} r={5} fill="rgba(245,245,235,.8)" />)}</g>)}</svg>
        {er > 0 && <><div style={{ ...ab(0, 440, 40 + er * 1376, 300), background: "radial-gradient(ellipse at 50% 40%, #33433a, #1c2620)" }} />
          {Array.from({ length: 16 }, (_, i) => { const k = ((t * 2 + rnd(i)) % 1); return <div key={i} style={{ ...ab(er * 1376 - 60 + (rnd(i, 2) - 0.5) * 140, 560 - k * 140, 30, 30), borderRadius: "50%", background: `rgba(240,240,230,${0.4 * (1 - k)})`, filter: "blur(5px)" }} />; })}
          <div style={{ ...ab(er * 1376 - 190, 470, 400, 200), borderRadius: 16, background: "linear-gradient(180deg,#c9a06a 0 45%,#2f2f2f 45%)", boxShadow: "0 20px 30px rgba(0,0,0,.55)", transform: `rotate(${Math.sin(t * 14) * 6}deg)` }} /></>}
      </div>
    </Stage>;
  };

  // 17 · la caja de los robos raros: se abre la tapa y los objetos saltan en arco, rebotan y quedan; la pregunta va en un papelito pegado a la caja
  const LostFound: React.FC<FxP> = ({ t, a, b }) => {
    const [t1] = As(["the strangest thing"], a, b);
    const open = ei(t, a + 0.15, a + 0.6);
    const IT: React.ReactNode[] = [
      <svg width={120} height={140} viewBox="0 0 120 140"><path d="M20 140 L20 50 Q20 20 40 20 L40 60 L50 10 Q60 0 66 14 L66 60 L76 16 Q86 6 92 20 L90 70 L104 40 Q116 36 112 56 L100 140Z" fill="#e0b23c" stroke="#9a7420" strokeWidth={4} /></svg>,
      <svg width={180} height={100} viewBox="0 0 180 100"><path d="M10 40 Q20 10 60 20 L120 50 Q170 56 172 80 L170 92 L12 92Z" fill="#f2f2ee" stroke="#9aa0a3" strokeWidth={4} /><path d="M12 82 L170 82" stroke="#c8321e" strokeWidth={10} /></svg>,
      <svg width={140} height={120} viewBox="0 0 140 120" style={{ overflow: "visible" }}><ellipse cx={70} cy={80} rx={60} ry={36} fill="#f2d24c" /><circle cx={44} cy={40} r={30} fill="#f2d24c" /><path d="M14 40 L-6 46 L14 52Z" fill="#e8722a" /><circle cx={38} cy={34} r={5} fill="#1b1712" /></svg>,
      <svg width={120} height={160} viewBox="0 0 120 160"><path d="M30 0 L80 0 L80 90 Q120 100 110 140 Q100 160 60 156 L20 150 Q10 140 30 110Z" fill="#5a7fb0" /><path d="M30 20 L80 20 M30 40 L80 40" stroke="#c8321e" strokeWidth={8} /></svg>,
    ];
    return <Stage t={t} a={a} b={b} bg="n_broom_porch" floor="wood">
      <Contact x={960} y={900} w={640} />
      <div style={{ ...ab(700, 570, 520, 320), background: "linear-gradient(180deg,#c9a06a,#8f673f)", borderRadius: 10, boxShadow: "0 30px 50px rgba(0,0,0,.55), inset 0 0 0 8px rgba(0,0,0,.12)" }}>
        <div style={{ ...ab(70, 90, 380, 150), background: COL.cream, transform: "rotate(-3deg)", boxShadow: "0 8px 14px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: BRUSH, fontSize: 46, color: COL.ink, lineHeight: 1.05, padding: 10, boxSizing: "border-box" }}>the strangest thing stolen?</div>
        <div style={{ ...ab(210, 76, 100, 30), background: "rgba(240,230,190,.7)", transform: "rotate(-3deg)" }} /></div>
      <div style={{ ...ab(684, 510, 552, 74), background: "linear-gradient(180deg,#b38a5c,#7a5636 70%,#5a3e27)", borderRadius: 8, transformOrigin: "0 100%", transform: `rotate(${-58 * open}deg)`, boxShadow: "0 10px 16px rgba(0,0,0,.4)" }} />
      {IT.map((el, i) => { const t0 = Math.min(t1, a + 0.5) + i * 0.4, k = cl((t - t0) / 0.8); if (k <= 0) return null; const tx = [330, 560, 1360, 1590][i], ty = 900 - (i % 2) * 30;
        const bounce = k >= 1 ? Math.abs(Math.sin((t - t0 - 0.8) * 9)) * 40 * Math.exp(-(t - t0 - 0.8) * 4) : 0;
        return <React.Fragment key={i}><Contact x={tx} y={ty + 50} w={170} o={0.5 * k} /><div style={{ ...center(lerp(960, tx, sm(k)), lerp(560, ty, k) - Math.sin(k * Math.PI) * 360 - bounce, lerp(0.4, 1.15, sm(k)), (1 - k) * 380 * (i % 2 ? 1 : -1)), filter: SH }}>{el}</div></React.Fragment>; })}
    </Stage>;
  };

  // 18 · la canasta de bambú: cada mañana cae un caqui y rebota adentro; el último se envuelve como un caramelo grande
  const PersimmonBasket: React.FC<FxP> = ({ t, a, b }) => {
    const [, , t3] = As(["picked up every persimmon", "before breakfast", "is a candy"], a, b);
    const wrap = ei(t, t3, t3 + 0.8);
    return <Stage t={t} a={a} b={b} bg="c_fallen_persimmons" floor="soil" light={0.7}>
      <div style={{ ...ab(0, 0, 1920, 1080), background: "rgba(10,8,6,.42)" }} />
      <Contact x={620} y={900} w={600} />
      <div style={{ ...ab(340, 560, 560, 90), borderRadius: "50%", background: "radial-gradient(ellipse,#3a2614 55%,#c9a36a 57%,#8a6a3a)" }} />
      {Array.from({ length: 6 }, (_, i) => { const t0 = a + 0.2 + i * Math.max(0.4, (t3 - a - 0.6) / 6), k = cl((t - t0) / 0.6); if (k <= 0) return null;
        const tx = 450 + (i % 3) * 120, ty = 610 - Math.floor(i / 3) * 50, y = k < 1 ? lerp(-60, ty, k * k) : ty - Math.abs(Math.sin((t - t0 - 0.6) * 10)) * 50 * Math.exp(-(t - t0 - 0.6) * 5);
        return <div key={i} style={{ ...center(lerp(300 + rnd(i) * 1200, tx, sm(k)), y, 2.1, k * 200), filter: SH }}><Persimmon /></div>; })}
      <div style={{ ...ab(340, 600, 560, 290), borderRadius: "10px 10px 160px 160px", background: "repeating-linear-gradient(60deg,#d9b376 0 16px,#9a7650 16px 22px), repeating-linear-gradient(-60deg, transparent 0 16px, rgba(0,0,0,.18) 16px 22px)", boxShadow: "0 30px 50px rgba(0,0,0,.55), inset 0 20px 30px rgba(0,0,0,.35)" }} />
      <div style={{ ...ab(330, 590, 580, 30), borderRadius: 16, background: "linear-gradient(180deg,#e2c08a,#8a6a3a)" }} />
      <div style={{ ...ab(1000, 260, 620, 620), borderRadius: "50%", background: `radial-gradient(circle, rgba(255,226,170,${0.45 * cl(wrap * 2)}), transparent 65%)` }} />
      <div style={{ ...center(1310, 560, 2.2 * pop(t, t3 - 0.3), Math.sin(t * 2) * 4) }}>
        <div style={{ position: "relative", width: 420, height: 200 }}>
          <div style={{ ...ab(140, 30, 140, 140) }}><Persimmon s={1.55} /></div>
          <div style={{ ...ab(130, 20, 160 * wrap, 160), borderRadius: 40, background: "linear-gradient(135deg, rgba(255,255,255,.75), rgba(255,200,210,.5))", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.6)" }} />
          {[0, 1].map((i) => <div key={i} style={{ ...ab(i ? 290 : 10, 50, 120, 100), background: "linear-gradient(135deg,rgba(255,220,225,.9),rgba(230,150,170,.8))", clipPath: i ? "polygon(0 35%,100% 0,90% 50%,100% 100%,0 65%)" : "polygon(0 0,100% 35%,100% 65%,0 100%,10% 50%)", transform: `scaleX(${sm(cl((wrap - 0.4) * 2))})`, transformOrigin: i ? "0 50%" : "100% 50%" }} />)}
        </div></div>
    </Stage>;
  };

  // 19 · la grasa como perfume: el bol del perro entra por la puerta y la puerta se cierra; de la parrilla sube humo que se vuelve un frasco de perfume con estela hacia el mapache
  const GrillPerfume: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, , t3] = As(["dog food inside", "clean the grill", "like perfume"], a, b);
    const bowl = ei(t, a + 0.2, Math.min(t1 + 0.6, a + 1.6)), door = ei(t, a + 1.6, a + 2.1), smoke = cl((t - a) / 2), bottle = pop(t, t3 - 0.2);
    return <Stage t={t} a={a} b={b} bg="c_grill_grease" floor="stone">
      <div style={{ ...ab(250, 260, 360, 620), background: "linear-gradient(180deg,#e8d2a8,#c9a06a)", borderRadius: "10px 10px 0 0", boxShadow: "0 30px 50px rgba(0,0,0,.55)" }}>
        <div style={{ ...ab(50, 70, 260, 550), background: "radial-gradient(ellipse at 50% 80%, #ffd88a, #b8742a 70%)" }} />
        <div style={{ ...ab(50, 70, 260, 550), background: "linear-gradient(90deg,#6d4a2c,#8a6340)", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-75 * (1 - door)}deg)`, boxShadow: "inset 0 0 0 10px #5a3e27" }}><div style={{ ...ab(200, 270, 22, 22), borderRadius: "50%", background: COL.gold }} /></div></div>
      <div style={{ ...center(lerp(820, 440, bowl), lerp(860, 840, bowl), 1.2 - 0.4 * bowl), opacity: 1 - e(t, a + 1.5, a + 1.7) }}><Bowl /></div>
      <Contact x={1240} y={900} w={520} />
      <svg width={1920} height={1080} style={ab(0, 0)}><path d="M1100 760 L1060 900 M1380 760 L1420 900" stroke="#1b1b1b" strokeWidth={14} strokeLinecap="round" /></svg>
      <div style={{ ...ab(990, 560, 500, 230), borderRadius: "0 0 250px 250px", background: "linear-gradient(180deg,#2a2a2a,#0a0a0a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
      <div style={{ ...ab(990, 520, 500, 80), borderRadius: "50%", background: "radial-gradient(ellipse, #ff7a2a 0 20%, #8a2a0a 45%, #1b1b1b 70%)" }} />
      <div style={{ ...ab(1000, 530, 480, 60), borderRadius: "50%", background: "repeating-linear-gradient(90deg,#b9b9b9 0 8px,transparent 8px 44px)" }} />
      {Array.from({ length: 10 }, (_, i) => { const k = ((t * 0.5 + i / 10) % 1) * smoke; return <div key={i} style={{ ...ab(1220 + Math.sin(k * 6 + i) * 60 - 40, 520 - k * 260, 80, 80), borderRadius: "50%", background: `rgba(220,210,190,${0.4 * (1 - k) * (1 - 0.7 * cl(bottle))})`, filter: "blur(10px)" }} />; })}
      <div style={{ ...center(1240, 380, 1.5 * bottle, Math.sin(t * 2) * 5) }}><svg width={200} height={260} viewBox="0 0 200 260" style={{ filter: SH }}><rect x={80} y={0} width={40} height={40} rx={6} fill={COL.gold} /><rect x={88} y={36} width={24} height={30} fill="#c9a26a" /><path d="M30 80 Q30 66 50 66 L150 66 Q170 66 170 80 L170 230 Q170 250 150 250 L50 250 Q30 250 30 230Z" fill="rgba(200,140,60,.75)" stroke="#f6e2b0" strokeWidth={5} /><rect x={50} y={90} width={30} height={130} rx={12} fill="rgba(255,255,255,.35)" /></svg></div>
      {t > t3 && <svg width={1920} height={1080} style={ab(0, 0)}><path d={`M1360 330 C 1460 220, 1560 420, 1640 ${500 + 20 * Math.sin(t * 2)}`} stroke="rgba(255,226,180,.9)" strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ei(t, t3, t3 + 0.8)} 1`} /></svg>}
      {t > t3 + 0.5 && <div style={{ ...center(1700, 600, 0.8 * pop(t, t3 + 0.5)) }}><Raccoon glow={0.8} /></div>}
    </Stage>;
  };

  // 20 · el garaje de noche: la persiana queda un poco levantada bajo la luna; amanece, el freezer del fondo tiene la tapa abierta y las mazorcas salen rodando una por una
  const GarageNight: React.FC<FxP> = ({ t, a, b }) => {
    const [, t2, t3] = As(["old freezer in the garage", "open a little", "in the morning"], a, b);
    const gap = ei(t, a + 0.2, Math.min(t2 + 0.4, a + 1.4)), day = ei(t, t3, t3 + 0.9), up = ei(t, t3 + 0.3, t3 + 1.1), lid = ei(t, t3 + 0.6, t3 + 1.0);
    const sky = `linear-gradient(180deg, ${day > 0.5 ? "#9cc4e4" : "#0e1428"}, ${day > 0.5 ? "#f2d8a8" : "#2a2440"})`;
    return <Stage t={t} a={a} b={b} bg="c_freezer_open" floor="stone" light={0.3 + 0.9 * day}>
      <div style={{ ...ab(0, 0, 1920, 1080), background: sky }} />
      <div style={{ ...center(1560, 220, 1), width: 130, height: 130, borderRadius: "50%", background: day < 0.5 ? "radial-gradient(circle at 35% 35%,#fffbe8,#cfc8aa)" : "radial-gradient(circle,#fff3b0,#f2b33c)", boxShadow: day < 0.5 ? "0 0 60px rgba(255,250,220,.5)" : "0 0 90px rgba(255,200,80,.8)" }} />
      <svg width={1920} height={1080} style={ab(0, 0)}><path d="M300 380 L960 160 L1620 380 Z" fill="#5a3e2e" /><rect x={360} y={380} width={1200} height={540} fill="#c9b48c" style={{ filter: `brightness(${0.35 + 0.65 * day})` }} /></svg>
      <div style={{ ...ab(520, 450, 880, 470), background: "#0b0a10", overflow: "hidden" }}>
        <div style={{ ...ab(140, 230, 420, 240), background: "linear-gradient(90deg,#cfcbc0,#fbfaf4 40%,#bdb8ab)", borderRadius: 14, filter: `brightness(${0.3 + 0.7 * day})`, boxShadow: "0 0 40px rgba(180,220,255,.25)" }}>
          <div style={{ ...ab(-6, -26, 432, 40), background: "#e9e6dc", borderRadius: 10, transformOrigin: "0 100%", transform: `rotate(${-60 * lid}deg)` }} /></div>
        {lid > 0.5 && Array.from({ length: 6 }, (_, i) => { const k = cl((t - t3 - 1.0 - i * 0.28) / 0.9); return k > 0 ? <div key={i} style={{ ...center(lerp(300, 540 + i * 50, k), 430 + 30 * Math.abs(Math.sin(k * 7)) * (1 - k), 1, k * 540) }}><Corn s={1.35} /></div> : null; })}
        <div style={{ ...ab(0, 0, 880, lerp(470 - 90 * gap, 120, up)), background: "repeating-linear-gradient(0deg,#d9d4c6 0 70px,#9a9589 70px 76px)", filter: `brightness(${0.35 + 0.65 * day})`, boxShadow: "0 12px 20px rgba(0,0,0,.6)" }} />
        {day < 0.6 && gap > 0 && <div style={{ ...ab(0, 470 - 90 * gap, 880, 90 * gap), background: "linear-gradient(180deg, rgba(150,170,230,.25), transparent)" }} />}
      </div>
      {day < 0.4 && gap > 0.6 && [880, 960].map((x) => <div key={x} style={{ ...ab(x, 880, 22, 22), borderRadius: "50%", background: "rgba(255,236,120,.95)", boxShadow: "0 0 20px rgba(255,236,120,.9)", opacity: (1 - day * 2.5) * ((t * 0.8) % 1 > 0.92 ? 0 : 1) }} />)}
    </Stage>;
  };

  // 21 · la cinta de las estaciones: la linterna con volumen barre la cinta y cada estación se enciende sólo cuando la toca el haz
  const SeasonBeam: React.FC<FxP> = ({ t, a, b }) => {
    const k = ei(t, a + 0.2, b - 0.8), bx = lerp(340, 1580, k);
    const G: React.ReactNode[] = [
      <svg width={140} height={140} viewBox="0 0 140 140">{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={70} cy={36} rx={22} ry={32} fill="#f6c1cf" transform={`rotate(${r} 70 70)`} />)}<circle cx={70} cy={70} r={14} fill="#e8728a" /></svg>,
      <svg width={140} height={140} viewBox="0 0 140 140"><path d="M20 120 Q20 20 120 20 Q120 120 20 120Z" fill="#6f9a3a" /><path d="M20 120 L110 30" stroke="#3f6a1a" strokeWidth={5} /></svg>,
      <svg width={150} height={150} viewBox="0 0 150 150"><circle cx={75} cy={75} r={34} fill="#f2c94c" />{Array.from({ length: 10 }, (_, i) => <path key={i} d="M75 10 L75 28" stroke="#f2c94c" strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36} 75 75)`} />)}</svg>,
      <svg width={140} height={140} viewBox="0 0 140 140"><path d="M70 10 L84 50 L124 40 L100 74 L130 100 L88 98 L70 132 L52 98 L10 100 L40 74 L16 40 L56 50Z" fill="#d9622b" /></svg>,
      <svg width={140} height={140} viewBox="0 0 140 140">{[0, 60, 120].map((r) => <g key={r} transform={`rotate(${r} 70 70)`}><path d="M70 10 L70 130" stroke="#e8f2f8" strokeWidth={9} strokeLinecap="round" /><path d="M52 26 L70 42 L88 26 M52 114 L70 98 L88 114" stroke="#e8f2f8" strokeWidth={7} fill="none" /></g>)}</svg>,
    ];
    const ang = -90 - (bx - 960) / 60;
    return <Stage t={t} a={a} b={b} bg="n_porch_lamp" floor="soil" light={0.3}>
      <div style={{ ...ab(0, 0, 1920, 1080), background: "rgba(5,6,14,.5)" }} />
      <div style={{ ...ab(lerp(-1400, 200, ei(t, a, a + 0.8)), 330, 1520, 230), background: "repeating-linear-gradient(90deg, #111 0 26px, transparent 26px 52px) top/100% 22px no-repeat, repeating-linear-gradient(90deg, #111 0 26px, transparent 26px 52px) bottom/100% 22px no-repeat, linear-gradient(90deg,#3a2a2e,#2a3324,#3a3220,#3a2618,#2a3038)", borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,.6), inset 0 0 0 22px #1b1b1b" }} />
      {G.map((g, i) => { const x = 360 + i * 300, lit = cl(1 - Math.abs(bx - x) / 260), ever = bx > x - 60;
        return <div key={i} style={{ ...center(x, 445 - 30 * lit, 1.3 + 0.4 * lit), opacity: ever ? 0.55 + 0.45 * lit : 0.2, filter: lit > 0.1 ? `drop-shadow(0 0 ${30 * lit}px rgba(255,240,200,.95))` : "grayscale(1) brightness(.5)" }}>{g}</div>; })}
      <Beam x={bx} y={900} ang={ang} len={750} spread={22} />
      <Torch x={bx} y={900} ang={ang} s={1} />
    </Stage>;
  };

  // 22 · los postes: cada error entra a martillazos con polvo y su objeto en la base; en el 2, el hueco con ojitos se tapa con tablas
  const Signposts: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3, t4, t5] = As(["feeding them without knowing", "cat food on the porch", "fruit on the grass", "open compost", "closing the hole"], a, b);
    const p1 = Math.min(t1, a + 0.1), board = ei(t, t5 + 0.3, t5 + 1.3);
    const post = (t0: number, x: number, n: string) => t > t0 - 0.02 ? <div style={{ position: "absolute", left: x - 180, top: 230 + fall(t, t0, 500, 1.4) }}>
      <div style={{ ...ab(165, 140, 30, 470), background: "linear-gradient(90deg,#5a3e27,#8a6340,#5a3e27)" }} />
      <div style={{ ...ab(0, 0, 360, 160), background: "repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 3px, transparent 3px 24px), linear-gradient(180deg,#c9a06a,#8f673f)", borderRadius: 12, boxShadow: "0 20px 34px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", ...big(110, COL.red), textShadow: "0 5px 0 #5a160c" }}>{n}</div></div> : null;
    const OBJ: [number, React.ReactNode][] = [[t2, <Bowl s={0.9} />], [t3, <svg width={110} height={110} viewBox="0 0 110 110"><circle cx={55} cy={60} r={44} fill="#c8321e" /><ellipse cx={40} cy={44} rx={10} ry={14} fill="rgba(255,255,255,.35)" /><path d="M55 18 Q60 2 72 6" stroke="#4f6f2a" strokeWidth={6} fill="none" /></svg>], [t4, <svg width={170} height={150} viewBox="0 0 170 150"><rect x={10} y={30} width={150} height={120} rx={8} fill="#3f6a2a" />{[0, 1, 2].map((i) => <path key={i} d={`M10 ${60 + i * 30} L160 ${60 + i * 30}`} stroke="#2a4a1a" strokeWidth={5} />)}<rect x={0} y={10} width={170} height={26} rx={6} fill="#4f7f34" transform="rotate(-18 10 30)" /></svg>]];
    return <Stage t={t} a={a} b={b} bg="c_catfood_porch" floor="soil">
      {post(p1, 470, "1")}<Dust t={t} t0={p1 + 0.12} x={470} y={840} />
      {OBJ.map(([t0, el], i) => t > t0 - 0.02 ? <div key={i} style={{ ...center(260 + i * 210, 870 + fall(t, t0, 300), 1.6), filter: SH }}>{el}</div> : null)}
      {post(t5, 1560, "2")}<Dust t={t} t0={t5 + 0.12} x={1560} y={840} />
      {t > t5 - 0.02 && <div style={{ ...ab(940, 600, 400, 250), background: "radial-gradient(ellipse at 50% 70%, #050403, #1a120b 70%)", borderRadius: "200px 200px 10px 10px", opacity: e(t, t5, t5 + 0.2) }}>
        {[150, 250].map((x) => <div key={x} style={{ ...ab(x - 16, 120, 32, 32), borderRadius: "50%", background: "rgba(255,236,120,.95)", boxShadow: "0 0 26px rgba(255,236,120,.9)" }} />)}
        {[0, 1, 2].map((i) => { const k = cl(board * 3 - i); return <div key={i} style={{ ...ab(-20 + (1 - k) * 300, 20 + i * 76, 440 * k, 66), background: "linear-gradient(180deg,#c9995f,#7b5634)", borderRadius: 4, boxShadow: "0 8px 12px rgba(0,0,0,.5)", transform: `rotate(${(i - 1) * 3}deg)` }} />; })}
      </div>}
    </Stage>;
  };

  // 23 · el veneno viaja: la botella se vuelca y gotea; el rastro rojo avanza gota a gota y cada animal que alcanza se pone rojo
  const PoisonPath: React.FC<FxP> = ({ t, a, b }) => {
    const [, t2] = As(["poison never stays", "where you put it"], a, b);
    const tip = ei(t, a + 0.1, a + 0.6), k = ei(t, a + 0.5, Math.max(t2 + 1.2, a + 4.5));
    const PATH = "M380 640 C 480 760, 560 760, 620 700 S 900 360, 1040 440 S 1300 800, 1460 700 S 1650 560, 1700 600";
    const AN: [number, number, number, React.ReactNode][] = [
      [620, 640, 0.18, <svg width={200} height={120} viewBox="0 0 200 120"><ellipse cx={90} cy={70} rx={70} ry={40} fill="currentColor" /><circle cx={150} cy={50} r={28} fill="currentColor" /><circle cx={148} cy={26} r={14} fill="currentColor" /><path d="M20 80 Q-10 100 10 116" stroke="currentColor" strokeWidth={6} fill="none" /></svg>],
      [1040, 360, 0.48, <svg width={170} height={200} viewBox="0 0 170 200"><ellipse cx={85} cy={120} rx={66} ry={76} fill="currentColor" /><circle cx={60} cy={90} r={22} fill="#fbf6ea" /><circle cx={110} cy={90} r={22} fill="#fbf6ea" /><circle cx={60} cy={90} r={9} fill="#1b1712" /><circle cx={110} cy={90} r={9} fill="#1b1712" /><path d="M30 50 L50 70 M140 50 L120 70" stroke="currentColor" strokeWidth={14} /></svg>],
      [1460, 620, 0.8, <svg width={200} height={180} viewBox="0 0 200 180" style={{ overflow: "visible" }}><path d="M40 70 L50 10 L90 50 Z M160 70 L150 10 L110 50 Z" fill="currentColor" /><ellipse cx={100} cy={100} rx={80} ry={66} fill="currentColor" /><path d="M180 130 Q210 160 190 176" stroke="currentColor" strokeWidth={10} fill="none" /></svg>],
    ];
    return <Stage t={t} a={a} b={b} bg="n_open_gate" floor="wood">
      <div style={{ ...ab(250, 340 + fall(t, a + 0.02, 420, 1.3)), transformOrigin: "70% 100%", transform: `rotate(${70 * tip}deg)` }}><Bottle fill="#3b4a2c" label="poison" s={0.95} /></div>
      {tip > 0.9 && Array.from({ length: 3 }, (_, i) => { const q = ((t * 1.4 + i / 3) % 1); return <div key={i} style={{ ...ab(395, 600 + q * 50, 18, 24), borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: COL.red, opacity: 1 - q }} />; })}
      <svg width={1920} height={1080} style={ab(0, 0)}>
        <defs><mask id="pm1"><path d={PATH} stroke="#fff" strokeWidth={40} fill="none" pathLength={1} strokeDasharray={`${k} 1`} /></mask></defs>
        <path d={PATH} stroke={COL.red} strokeWidth={20} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="0.008 0.03" mask="url(#pm1)" /></svg>
      {AN.map(([x, y, at0, el], i) => { const hit = cl((k - at0) / 0.06); return <div key={i} style={{ ...center(x, y, 1.55 + 0.2 * Math.sin(hit * Math.PI)), color: `rgb(${lerp(110, 200, hit)},${lerp(100, 50, hit)},${lerp(90, 30, hit)})`, filter: hit > 0 ? `drop-shadow(0 0 ${20 * hit}px rgba(200,50,30,.8))` : SH }}>{el}</div>; })}
    </Stage>;
  };

  // 24 · el techo: la teja se quiebra con polvo y cae; suena el teléfono viejo con ondas; la balanza con monedas se inclina hacia el teléfono
  const RoofPhone: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2] = As(["cost you the roof", "worth his money"], a, b);
    const T0 = Math.min(t1, a + 0.8), crack = e(t, a + 0.2, a + 0.5), fallK = ei(t, T0, T0 + 0.8), ringing = t > a + 1.2;
    const tilt = ei(t, t2 - 0.2, t2 + 0.6) * 16, ring = ringing ? Math.sin(t * 60) * 5 : 0;
    return <Stage t={t} a={a} b={b} bg="c_attic_insulation" floor="stone">
      <svg width={1920} height={1080} style={ab(0, 0)}><defs><pattern id="tj" width={70} height={44} patternUnits="userSpaceOnUse"><path d="M0 0 h70 v34 q-35 16 -70 0z" fill="#9a4428" /><path d="M0 34 q35 16 70 0" stroke="#5a2414" strokeWidth={4} fill="none" /></pattern></defs>
        <path d="M200 560 L 620 220 L 1040 560 Z" fill="url(#tj)" stroke="#4a1a0c" strokeWidth={8} /><rect x={270} y={560} width={700} height={330} fill="#d9cdb0" /><rect x={560} y={680} width={120} height={210} fill="#6b4a2a" />
        <path d="M640 360 l20 18 l-12 14 l18 16" stroke="#1b0c06" strokeWidth={5} fill="none" opacity={crack} /></svg>
      {t > T0 && <div style={{ ...ab(620, 352, 80, 48), background: "#140c08" }} />}
      {fallK < 1 && <div style={{ ...ab(620 + fallK * 80, 352 + fallK * fallK * 530, 80, 48), background: "#9a4428", borderRadius: "0 0 40px 40px", transform: `rotate(${fallK * 260}deg)`, boxShadow: "0 8px 12px rgba(0,0,0,.5)" }} />}
      <div style={{ ...center(1400, 330, 1.55, ring) }}><svg width={260} height={200} viewBox="0 0 260 200" style={{ filter: SH }}><path d="M20 70 Q130 -10 240 70 L220 100 L170 80 L170 60 Q130 46 90 60 L90 80 L40 100Z" fill="#1b1712" /><path d="M60 110 L200 110 L230 190 L30 190Z" fill="#2a2420" /><circle cx={130} cy={150} r={28} fill="#e9e1d2" /><circle cx={130} cy={150} r={10} fill="#1b1712" /></svg></div>
      {ringing && [0, 1, 2].map((i) => { const q = ((t - a) * 1.6 + i / 3) % 1; return <div key={i} style={{ ...center(1400, 330, 0.6 + q * 1.6), width: 280, height: 220, borderRadius: "50%", border: `6px solid rgba(251,246,234,${0.7 * (1 - q)})`, borderBottomColor: "transparent" }} />; })}
      <div style={{ ...ab(1388, 620, 24, 260), background: "linear-gradient(90deg,#8a6340,#c9995f,#8a6340)" }} /><Contact x={1400} y={890} w={300} />
      <div style={{ ...ab(1100, 600, 600, 18), background: "#8a6340", borderRadius: 8, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ ...ab(-10, -60, 160, 60), borderRadius: "0 0 80px 80px", background: "linear-gradient(180deg,#d9cdb0,#9a8a6a)" }}>{Array.from({ length: 1 + Math.round((4 * tilt) / 16) }, (_, i) => <Coin key={i} x={80} y={36 - i * 14} w={90} />)}</div>
        <div style={{ ...ab(450, -60, 160, 60), borderRadius: "0 0 80px 80px", background: "linear-gradient(180deg,#d9cdb0,#9a8a6a)" }}><div style={{ ...ab(40, -30, 80, 60), background: "#7f3622", clipPath: "polygon(50% 0,100% 50%,100% 100%,0 100%,0 50%)" }} /></div>
      </div>
    </Stage>;
  };

  // 25 · torres de monedas: caen de a una con rebote; la del trampero sube $400, +50 por animal y otra vez al año siguiente; la del frasco: cuatro monedas
  const CoinTowers: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3, t4] = As(["400 plus 50", "every animal", "you pay again", "a jar of cayenne"], a, b);
    const f1 = lerp(0, 8, ei(t, a + 0.2, t1 + 0.4)) + lerp(0, 2, ei(t, t2, t2 + 0.4)) + lerp(0, 8, ei(t, t3 - 0.2, t3 + 0.8)), f2 = lerp(0, 4, ei(t, t4, t4 + 0.8));
    const STEP = 24, Y0 = 820;
    const tower = (x: number, f: number) => { const n = Math.floor(f), fr = f - n;
      return <>{Array.from({ length: n }, (_, i) => <Coin key={i} x={x + (rnd(i) - 0.5) * 8} y={Y0 - i * STEP} />)}
        {fr > 0.05 && <Coin x={x} y={lerp(Y0 - n * STEP - 340, Y0 - n * STEP, fr * fr)} />}</>; };
    const n1 = Math.floor(f1);
    return <Stage t={t} a={a} b={b} bg="n_wall_phone" floor="wood">
      {[[620, "the trapper"], [1360, "the pantry"]].map(([x, w], i) => <div key={i} style={{ ...ab((x as number) - 220, 840, 440, 110), background: "linear-gradient(180deg,#d9a96f,#7b5634)", borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,.5), inset 0 0 0 5px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: "#2b1d10" }}>{w as string}</div>)}
      {tower(620, f1)}{tower(1360, f2)}
      <div style={{ ...center(1000, 250), ...big(n1 >= 18 ? 150 : 130, "#ffffff"), opacity: e(t, a + 0.2, a + 0.4) }}>${n1 >= 18 ? "900+" : n1 * 50}</div>
      {t > t4 - 0.3 && <div style={{ ...center(1600, 640, pop(t, t4 - 0.3)) }}><Jar fill="#c73a1c" label="cayenne" w={170} h={230} /></div>}
      {t > t4 && <div style={{ ...center(1360, Y0 - Math.floor(f2) * STEP - 120, pop(t, t4)), ...big(140, COL.gold) }}>$4</div>}
    </Stage>;
  };

  // 26 · la palanca de la esquina: la tapa con la bisagra a la vista; la pata empuja una esquina, la tapa pivota; el reloj de arena corre; el ladrillo cae y rebota
  const LidLever: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2, t3] = As(["one corner of the lid", "very patient", "a brick does not stop him"], a, b);
    const T1 = Math.min(t1, a + 0.5), lift = Math.max(0, Math.sin(cl((t - T1) / 2.2) * Math.PI * 2.5)) * 22 * cl((t - T1) / 0.3);
    const sand = cl((t - Math.min(t2, a + 1.5)) / 3), bk = ei(t, t3, t3 + 0.6);
    const by = bk < 1 ? bk * bk * 500 : 500 - Math.abs(Math.sin((t - t3 - 0.6) * 9)) * 50 * Math.exp(-(t - t3 - 0.6) * 4);
    return <Stage t={t} a={a} b={b} bg="c_lid_corner" floor="stone">
      <div style={{ ...ab(560, 380) }}><Can w={440} lidRot={-lift} /></div>
      <div style={{ ...ab(985, 372, 70, 90), borderRadius: 8, background: "linear-gradient(90deg,#5d6265,#e3e7e9 45%,#5d6265)", boxShadow: "0 8px 12px rgba(0,0,0,.5)" }}><div style={{ ...ab(25, -14, 20, 118), borderRadius: 10, background: "linear-gradient(90deg,#3a3e41,#c9cfd2,#3a3e41)" }} /></div>
      <Contact x={780} y={895} w={560} />
      <div style={{ ...ab(lerp(700, 380, bk), 300 + by, 220, 86), background: "linear-gradient(180deg,#c9653f,#7f3622)", borderRadius: 6, transform: `rotate(${-lift + bk * -90}deg)`, boxShadow: "0 12px 18px rgba(0,0,0,.5)" }}>{[0, 1, 2].map((h) => <div key={h} style={{ ...ab(26 + h * 64, 28, 32, 30), borderRadius: 6, background: "rgba(0,0,0,.28)" }} />)}</div>
      <div style={{ ...center(540, 430 - lift * 3, 1, 60) }}><Paw s={1.55} /></div>
      <div style={{ ...center(1460, 560, 1.4 * pop(t, a + 0.3), Math.sin(t * 0.8) * 3) }}>
        <svg width={200} height={300} viewBox="0 0 200 300" style={{ filter: SH }}><rect x={20} y={0} width={160} height={20} rx={6} fill="#8a6340" /><rect x={20} y={280} width={160} height={20} rx={6} fill="#8a6340" />
          <path d="M40 20 L160 20 L110 150 L160 280 L40 280 L90 150 Z" fill="rgba(220,240,250,.35)" stroke="#e9eef0" strokeWidth={4} />
          <path d={`M${50 + 40 * sand} ${30 + 110 * sand} L ${150 - 40 * sand} ${30 + 110 * sand} L 100 150 Z`} fill="#e2c27a" /><path d={`M100 ${280 - 110 * sand} L 55 276 L 145 276 Z`} fill="#e2c27a" /><path d="M100 150 L100 270" stroke="#e2c27a" strokeWidth={3} opacity={sand < 1 ? 1 : 0} /></svg></div>
    </Stage>;
  };

  // 27 · la tapa como regalo: vista de arriba, la niebla roja cubre la tapa y dos gomas se estiran y cruzan como cinta; nace el moño
  const GiftLid: React.FC<FxP> = ({ t, a, b }) => {
    const [t1, t2] = As(["a cross", "like a ribbon on a gift"], a, b);
    const mist = cl((t - a - 0.1) / 1.2), c1 = Math.min(1.05, spr(t, Math.min(t1 - 0.5, a + 1.0), 1.2)), c2 = Math.min(1.05, spr(t, Math.min(t1, a + 1.6), 1.2)), bow = pop(t, Math.min(t2, a + 2.6));
    return <Stage t={t} a={a} b={b} bg="c_bungee_cross" floor="stone">
      <div style={{ ...center(960, 540), width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f6f7f8, #b3b9bc 50%, #5d6265)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 22px rgba(0,0,0,.14), inset 0 0 0 40px rgba(255,255,255,.12)" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ ...ab(80 + i * 60, 80 + i * 60, 560 - i * 120, 560 - i * 120), borderRadius: "50%", border: "4px solid rgba(0,0,0,.08)" }} />)}
        <div style={{ ...ab(280, 320, 160, 80), borderRadius: 40, border: "16px solid #6f7578", boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />
        <div style={{ ...ab(-80, -80, 880, 880), borderRadius: "50%", background: "radial-gradient(circle, rgba(214,64,30,.55), rgba(214,64,30,.2) 45%, transparent 68%)", filter: "blur(18px)", opacity: Math.sin(cl((t - a) / 1.8) * Math.PI) * 0.95 }} />
        {Array.from({ length: 80 }, (_, i) => <div key={i} style={{ ...ab(80 + rnd(i) * 560, 80 + rnd(i, 2) * 560, 22, 22), borderRadius: "50%", background: "rgba(200,60,30,.5)", filter: "blur(2px)", opacity: cl(mist * 2.5 - rnd(i, 3) * 1.5) }} />)}
        <div style={{ ...ab(-30, 340, 780, 40), background: "linear-gradient(180deg,#e0453a,#8f1d14)", borderRadius: 20, transform: `scaleX(${c1})`, boxShadow: "0 10px 14px rgba(0,0,0,.45)" }} />
        <div style={{ ...ab(340, -30, 40, 780), background: "linear-gradient(90deg,#e0453a,#8f1d14)", borderRadius: 20, transform: `scaleY(${c2})`, boxShadow: "0 10px 14px rgba(0,0,0,.45)" }} />
        {[[-30, 360], [750, 360], [360, -30], [360, 750]].map(([x, y], i) => <div key={i} style={{ ...ab(x - 20, y - 20, 40, 40), borderRadius: "50%", background: "#2a2a2a", boxShadow: "0 0 0 6px #9aa0a3" }} />)}
      </div>
      <div style={{ ...center(960, 540, 1.2 * bow, Math.sin(t * 2) * 3) }}><svg width={300} height={200} viewBox="0 0 300 200" style={{ filter: SH, overflow: "visible" }}><path d="M150 100 C 60 10, 10 60, 40 120 C 70 170, 120 130, 150 100 Z" fill="#e0453a" /><path d="M150 100 C 240 10, 290 60, 260 120 C 230 170, 180 130, 150 100 Z" fill="#c8321e" /><path d="M140 110 L110 190 M160 110 L190 190" stroke="#c8321e" strokeWidth={22} strokeLinecap="round" /><circle cx={150} cy={100} r={28} fill="#8f1d14" /></svg></div>
    </Stage>;
  };

  // 28 · los faroles de piedra: cada regla hace crecer un tōrō del suelo con su ícono en la ventana; el quinto se enciende en «professional»
  const LanternRecap: React.FC<FxP> = ({ t, a, b }) => {
    const ts = As(["be safe", "never touch", "never corner", "gloves and a mask", "professional for the attic"], a, b);
    const ICON: React.ReactNode[] = [
      <path d="M35 8 L60 18 L60 40 Q60 60 35 70 Q10 60 10 40 L10 18Z" fill="#3f8a3a" />,
      <g><rect x={10} y={30} width={50} height={30} rx={8} fill="#efc29a" /><path d="M8 8 L62 62 M62 8 L8 62" stroke={COL.red} strokeWidth={10} strokeLinecap="round" /></g>,
      <g><path d="M10 10 L30 10 M10 10 L10 30 M60 60 L40 60 M60 60 L60 40" stroke="#1b1712" strokeWidth={9} strokeLinecap="round" /><path d="M20 20 L50 50" stroke={COL.red} strokeWidth={8} strokeLinecap="round" /></g>,
      <path d="M14 70 L14 30 Q14 14 24 14 L24 34 L30 6 Q36 0 40 8 L40 34 L46 10 Q52 4 56 12 L54 70Z" fill="#e0b23c" />,
      <g><path d="M8 50 Q8 14 35 14 Q62 14 62 50Z" fill="#f2c94c" /><rect x={2} y={48} width={66} height={10} rx={4} fill="#d9a441" /></g>,
    ];
    return <Stage t={t} a={a} b={b} bg="c_osaka_flashlight" floor="stone" light={0.5}>
      <div style={{ ...ab(0, 0, 1920, 1080), background: "rgba(6,8,14,.35)" }} />
      {ts.map((t0, i) => { const x = 360 + i * 300, gr = Math.min(1.04, spr(t, t0 - 0.2, 1.1)), on = i === 4 ? e(t, t0 + 0.2, t0 + 0.5) : e(t, t0, t0 + 0.3);
        return t > t0 - 0.22 ? <div key={i} style={{ position: "absolute", left: x - 110, top: 300, filter: `brightness(${1 + 0.35 * (i < 4 ? e(t, ts[4] + 0.2, ts[4] + 0.6) : 0)})`, transform: `scaleY(${Math.max(0.02, gr)})`, transformOrigin: "50% 100%" }}>
          {on > 0 && <div style={{ ...ab(-90, 60, 400, 300), borderRadius: "50%", background: `radial-gradient(circle, rgba(255,220,140,${0.5 * on}), transparent 70%)` }} />}
          <svg width={220} height={560} viewBox="0 0 220 560" style={{ overflow: "visible", filter: SH }}>
            <path d="M10 100 L110 30 L210 100 Z" fill="#8b867c" /><path d="M10 100 L110 30 L110 100Z" fill="#a19c91" /><ellipse cx={110} cy={28} rx={16} ry={14} fill="#7d786f" />
            <rect x={30} y={100} width={160} height={150} fill="#9a958a" /><rect x={30} y={100} width={30} height={150} fill="#b3aea3" />
            <rect x={55} y={125} width={110} height={100} fill={`rgba(255,${200 + 30 * on},${120 + 60 * on},${0.15 + 0.85 * on})`} />
            <g transform="translate(57,126) scale(1.5)" opacity={0.3 + 0.7 * on}>{ICON[i]}</g>
            <rect x={70} y={250} width={80} height={220} fill="#7d786f" /><rect x={70} y={250} width={20} height={220} fill="#948f85" />
            <rect x={20} y={470} width={180} height={50} fill="#6e6a61" />
            {[[40, 470], [150, 470], [80, 260]].map(([mx, my], j) => <ellipse key={j} cx={mx} cy={my} rx={26} ry={10} fill="#4f7f34" opacity={0.85} />)}
          </svg>
          {on > 0 && <div style={{ ...ab(-40, 540, 300, 60), borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,210,130,${0.5 * on}), transparent 70%)` }} />}
        </div> : null; })}
    </Stage>;
  };

  // 29 · la tarea: el haz de la linterna barre el patio oscuro desde el cuadro 0 y destapa lo escondido; el reloj de cocina corre con su aguja
  const FlashlightSweep: React.FC<FxP> = ({ t, a, b }) => {
    const [, , t3] = As(["only one thing", "with a flashlight", "five minutes"], a, b);
    const ang = -160 + 140 * ((Math.sin((t - a) * 0.9 - 1.57) + 1) / 2);
    const HID: [number, number, React.ReactNode][] = [[520, 560, <svg width={180} height={200} viewBox="0 0 180 200"><path d="M30 80 L150 80 L130 196 L50 196Z" fill="#b8562a" /><rect x={20} y={64} width={140} height={28} rx={6} fill="#d0683a" /><path d="M90 66 Q60 10 30 20 M90 66 Q100 0 130 14 M90 66 Q120 30 160 40" stroke="#4f7f34" strokeWidth={12} fill="none" strokeLinecap="round" /></svg>], [780, 330, <svg width={130} height={130} viewBox="0 0 130 130"><ellipse cx={65} cy={84} rx={30} ry={36} fill="#3a2614" />{[20, 46, 84, 110].map((x, i) => <ellipse key={i} cx={x} cy={i === 0 || i === 3 ? 50 : 30} rx={12} ry={18} fill="#3a2614" />)}</svg>], [1160, 330, <div style={{ width: 100, height: 130, borderRadius: "8px 8px 30px 30px", background: "linear-gradient(90deg,#6f777c,#e3e7e9 40%,#8a9195)" }} />], [1420, 560, <Raccoon s={0.75} glow={1} />]];
    const lit = (x: number, y: number) => { const d = (Math.atan2(y - 980, x - 960) * 180) / Math.PI; return cl(1 - (Math.abs(d - ang) - 12) / 10); };
    const hand = cl((t - a) / 9) * 360; void t3;
    return <Stage t={t} a={a} b={b} bg="c_flashlight_yard" floor="soil" light={0.2}>
      <div style={{ ...ab(0, 0, 1920, 1080), background: "rgba(4,5,10,.7)" }} />
      <Beam x={960} y={980} ang={ang} len={1000} spread={18} />
      {HID.map(([x, y, el], i) => { const l = lit(x, y); return <div key={i} style={{ ...center(x, y, 1 + 0.25 * l), opacity: 0.08 + 0.92 * l, filter: l > 0.4 ? "drop-shadow(0 0 24px rgba(255,240,200,.85))" : "brightness(.3)" }}>{el}</div>; })}
      <Torch x={960} y={980} ang={ang} s={1.1} />
      <div style={{ ...center(1650, 260, 1.25 * pop(t, a + 0.2)), width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fbf6ea,#d9cdb0)", boxShadow: "0 20px 34px rgba(0,0,0,.6), inset 0 0 0 14px #c8321e" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...ab(126, 22, 8, 22), background: COL.ink, transform: `rotate(${i * 30}deg)`, transformOrigin: "4px 108px" }} />)}
        <div style={{ ...ab(124, 40, 12, 92), background: COL.red, borderRadius: 6, transform: `rotate(${hand}deg)`, transformOrigin: "6px 90px" }} />
        <div style={{ ...ab(116, 116, 28, 28), borderRadius: "50%", background: COL.ink }} /></div>
    </Stage>;
  };

  return { CanSpill, PantryThree, TallyNights, WildSign, TanukiShift, BrickCrane, ScentLines, LawnClues, RadioDial, MetalSkirt, MemoryMap, WindPowder, ScreamRings, PaperPlug, NoseThousand, EraseRoute, LostFound, PersimmonBasket, GrillPerfume, GarageNight, SeasonBeam, Signposts, PoisonPath, RoofPhone, CoinTowers, LidLever, GiftLid, LanternRecap, FlashlightSweep };
};
