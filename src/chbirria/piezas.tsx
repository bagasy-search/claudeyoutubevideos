// chayo3 · PIEZAS NUEVAS del resto del video (minuto 2 en adelante). Cada minuto estrena las suyas; todas en el mismo
// lenguaje de rancho (barro, guinda, maíz, papel de cuaderno, letra a mano) y todas clavadas a la voz con at().
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CH, DrawX, FONT, HAND, P, SERIF, e, ei, extrude, spr } from "./lib";

type B = { t: number; at: number; out: number };
const vis = (t: number, at: number, out: number, k0 = 1.1) => ({ k: Math.min(k0, spr(t, at, 1.1)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const DARK = "rgba(38,16,10,.9)";
const ring = (c = CH.maiz) => `0 26px 50px rgba(0,0,0,.55), inset 0 0 0 3px ${c}88`;

// tarjeta oscura de barro que entra con resorte (base de casi todas)
export const Card: React.FC<B & { x: number; y: number; w?: number; rot?: number; pad?: string; bg?: string; col?: string; children: React.ReactNode; from?: "up" | "down" | "left" | "right" | "pop" }> = ({ t, at, out, x, y, w, rot = 0, pad = "26px 36px", bg = DARK, col = CH.maiz, children, from = "pop" }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const m = 1 - Math.min(1, k), tr = from === "pop" ? `scale(${0.6 + 0.4 * k})` : from === "up" ? `translateY(${-260 * m}px)` : from === "down" ? `translateY(${260 * m}px)` : from === "left" ? `translateX(${-360 * m}px)` : `translateX(${360 * m}px)`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr} rotate(${rot}deg)`, width: w, padding: pad, background: bg, borderRadius: 18, boxShadow: ring(col) }}>{children}</div>;
};
export const H: React.FC<{ s?: number; c?: string; children: React.ReactNode; f?: string }> = ({ s = 56, c = CH.crema, children, f = SERIF }) => <div style={{ fontFamily: f, fontWeight: 900, fontSize: s, color: c, lineHeight: 1.08, letterSpacing: f === SERIF ? 1 : 0 }}>{children}</div>;
const Ok: React.FC<{ t: number; at: number; s?: number }> = ({ t, at, s = 64 }) => <span style={{ display: "inline-block", fontFamily: HAND, fontWeight: 700, fontSize: s, color: "#9ad35a", transform: `scale(${Math.min(1.1, spr(t, at, 1.2))})` }}>✓</span>;
const No: React.FC<{ t: number; at: number; s?: number }> = ({ t, at, s = 64 }) => <span style={{ display: "inline-block", fontFamily: HAND, fontWeight: 700, fontSize: s, color: "#ff5a3c", transform: `scale(${Math.min(1.1, spr(t, at, 1.2))})` }}>✗</span>;

// ======================= minuto 2 · la promesa =======================
// rótulo que sale de cada plato con su secreto (anclado al plato en pantalla)
export const PlateLabel: React.FC<B & { x: number; y: number; n: number; text: string; up?: number }> = ({ t, at, out, x, y, n, text, up = 150 }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const L = e(t, at, at + 0.35);
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={x} y1={y} x2={x} y2={y - up * L} stroke={CH.maiz} strokeWidth={3} /><circle cx={x} cy={y} r={7 * k} fill={CH.maiz} /></svg>
    <div style={{ position: "absolute", left: x, top: y - up * L, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: "50% 100%", textAlign: "center", padding: "8px 16px", borderRadius: 12, background: DARK, boxShadow: ring(), whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: CH.maiz, lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: CH.crema, lineHeight: 1 }}>{text}</div>
    </div>
  </div>;
};
// globos de diálogo de la familia que se enoja (secreto 3)
export const Burbujas: React.FC<{ t: number; out: number; items: { at: number; x: number; y: number; text: string; rot?: number }[] }> = ({ t, out, items }) => <>{items.map((b, i) => {
  const { k, o } = vis(t, b.at, out);
  if (o <= 0.01) return null;
  return <div key={i} style={{ position: "absolute", left: b.x, top: b.y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${b.rot ?? 0}deg)` }}>
    <div style={{ position: "relative", padding: "18px 30px", borderRadius: 40, background: "#fff6e6", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CH.guinda, boxShadow: "0 20px 40px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{b.text}
      <div style={{ position: "absolute", left: 50, bottom: -26, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "30px solid #fff6e6" }} /></div>
  </div>;
})}</>;

// ======================= minuto 2-3 · quién es Chayo =======================
// Michoacán en vector con el alfiler en Pátzcuaro
const MICH = "M 120 210 L 190 150 L 300 130 L 380 80 L 470 95 L 560 60 L 640 110 L 700 100 L 760 160 L 740 230 L 790 300 L 720 360 L 640 350 L 560 420 L 470 400 L 380 450 L 300 420 L 220 380 L 150 330 L 90 280 Z";
export const MapaMich: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const d = e(t, at, at + 1.2), pin = Math.min(1.15, spr(t, at + 1.0, 1.1));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={880} height={540} viewBox="0 0 880 540" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={4} y={4} width={872} height={532} rx={26} fill="rgba(38,16,10,.92)" stroke={CH.maiz} strokeOpacity={0.55} strokeWidth={3} />
      <path d={MICH} fill={`rgba(107,138,58,${0.85 * d})`} stroke={CH.crema} strokeWidth={6} strokeDasharray={2600} strokeDashoffset={2600 * (1 - d)} strokeLinejoin="round" />
      <circle cx={455} cy={250} r={70 * pin} fill="rgba(80,140,200,.5)" />
      <g transform={`translate(430 230) scale(${pin})`}><path d="M 0 -64 C -30 -64 -40 -38 -40 -24 C -40 4 0 40 0 40 C 0 40 40 4 40 -24 C 40 -38 30 -64 0 -64 Z" fill="#d8402c" stroke="#fff" strokeWidth={5} /><circle cx={0} cy={-26} r={13} fill="#fff" /></g>
      <text x={500} y={225} fontFamily={HAND} fontWeight={700} fontSize={62} fill={CH.crema} opacity={e(t, at + 1.2, at + 1.5)}>Pátzcuaro</text>
      <text x={440} y={500} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={54} fill={CH.maiz} letterSpacing={6} opacity={d}>MICHOACÁN</text>
    </svg>
  </div>;
};
// la guía sobre la mesa: pestaña con página y título
export const GuiaPag: React.FC<B & { x: number; y: number; pag: string; text: string }> = ({ t, at, out, x, y, pag, text }) => (
  <Card t={t} at={at} out={out} x={x} y={y} bg="linear-gradient(135deg,#ff7eb0,#ffd36e)" col="#fff" rot={-3} pad="18px 34px">
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 42, color: "#5a0f3a" }}>{pag}</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#3a0f2a", lineHeight: 1 }}>{text}</div>
  </Card>
);
// la descripción del video con el renglón 1 marcado (ahí está el link)
export const DescCard: React.FC<B & { x: number; y: number; hl: number }> = ({ t, at, out, x, y, hl }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const h = e(t, hl, hl + 0.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, width: 760, padding: "26px 30px", borderRadius: 18, background: "#fbf6ee", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#333", marginBottom: 12 }}>Descripción</div>
    <div style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#1a1a1a", padding: "6px 10px" }}>
      <div style={{ position: "absolute", inset: 0, background: CH.maiz, borderRadius: 8, transform: `scaleX(${h})`, transformOrigin: "0 50%" }} />
      <span style={{ position: "relative" }}>▶ La guía de Doña Chayo — 1ª línea</span>
    </div>
    {[0.9, 0.75, 0.82].map((w, i) => <div key={i} style={{ height: 18, width: `${w * 100}%`, background: "#ddd5c8", borderRadius: 9, margin: "16px 10px 0" }} />)}
    <div style={{ position: "absolute", left: -120, top: 64, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: CH.maiz, opacity: h, transform: `translateX(${-30 * (1 - h)}px)`, textShadow: "0 4px 12px rgba(0,0,0,.8)" }}>1ª →</div>
  </div>;
};

// ======================= minuto 3-4 · la historia =======================
// foto vieja con borde blanco y cinta, cae sobre la mesa
export const FotoVieja: React.FC<B & { x: number; y: number; src: string; w?: number; rot?: number; cap?: string }> = ({ t, at, out, x, y, src, w = 760, rot = -5, cap }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const m = 1 - Math.min(1, k);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${-200 * m}px) rotate(${rot + 14 * m}deg) scale(${1 + 0.2 * m})` }}>
    <div style={{ width: w, padding: "22px 22px 70px", background: "#f1e9d8", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden" }}><Img src={staticFile(P + "img_" + src + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.35) saturate(.8)", transform: `scale(${1.04 + 0.04 * e(t, at, at + 6)})` }} /></div>
      {cap && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.tinta, textAlign: "center", marginTop: 8 }}>{cap}</div>}
    </div>
    <div style={{ position: "absolute", left: "50%", top: -16, width: 150, height: 40, transform: "translateX(-50%) rotate(3deg)", background: "rgba(240,230,200,.75)" }} />
  </div>;
};
// 120 invitados: los puntitos se van llenando
export const Gente: React.FC<B & { x: number; y: number; n: number; label: string; cols?: number }> = ({ t, at, out, x, y, n, label, cols = 20 }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const f = Math.floor(n * e(t, at + 0.1, at + 1.6));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "24px 30px", borderRadius: 18, background: DARK, boxShadow: ring() }}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 26px)`, gap: 8 }}>{Array.from({ length: n }, (_, i) => <svg key={i} width={26} height={34} viewBox="0 0 26 34" style={{ opacity: i < f ? 1 : 0.15 }}><circle cx={13} cy={8} r={7} fill={i < f ? CH.maiz : "#999"} /><path d="M 2 34 C 2 18 24 18 24 34 Z" fill={i < f ? CH.maiz : "#999"} /></svg>)}</div>
    <div style={{ textAlign: "center", marginTop: 14 }}><H s={64}>{f} <span style={{ fontFamily: HAND, color: CH.crema }}>{label}</span></H></div>
  </div>;
};
// semana: jueves → sábado
export const Semana: React.FC<B & { x: number; y: number; days: string[]; mark: number; hot: number }> = ({ t, at, out, x, y, days, mark, hot }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 18 }}>
    {days.map((d, i) => { const k = Math.min(1.1, spr(t, at + i * 0.15, 1.1)), on = i === hot ? e(t, mark, mark + 0.3) : 0; return (
      <div key={i} style={{ width: 200, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,.5)", outline: on ? `${6 * on}px solid ${CH.maiz}` : undefined }}>
        <div style={{ background: CH.guinda, color: CH.crema, fontFamily: SERIF, fontWeight: 900, fontSize: 40, textAlign: "center", padding: "8px 0" }}>{d}</div>
        <div style={{ background: "#f6ecd4", height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: i === hot ? 64 : 50, color: CH.tinta }}>{i === hot ? "¡boda!" : i === 0 ? "empezar" : "moler"}</div>
      </div>); })}
  </div>;
};
// cita grande escrita a mano entre comillas
export const Cita: React.FC<B & { x: number; y: number; text: string; who?: string; size?: number; w?: number }> = ({ t, at, out, x, y, text, who, size = 92, w = 1300 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)), r = e(t, at + 0.1, at + 1.4);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", width: w, textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 220, color: CH.maiz, lineHeight: 0.5, opacity: 0.9, transform: `scale(${Math.min(1.1, spr(t, at, 1))})` }}>“</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: CH.crema, lineHeight: 1.05, clipPath: `inset(-10% ${100 - 100 * r}% -10% 0)`, textShadow: "0 6px 24px rgba(0,0,0,.85)" }}>{text}</div>
    {who && <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 40, color: CH.maiz, marginTop: 14, opacity: e(t, at + 1.2, at + 1.5), letterSpacing: 3 }}>— {who}</div>}
  </div>;
};
// corte de tres ollas: dónde pega el calor
export const CorteOllas: React.FC<B & { x: number; y: number; n: number; badAt: number }> = ({ t, at, out, x, y, n, badAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const P3 = [{ l: "BARRO", w: 16, ok: true, c: "#a3502a" }, { l: "OLLA GRUESA", w: 14, ok: true, c: "#5a5a60" }, { l: "DELGADITA", w: 4, ok: false, c: "#9aa0a4" }];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>
    {P3.slice(0, n).map((p, i) => { const k = Math.min(1.1, spr(t, at + i * 0.4, 1)), ph = t * 3; return (
      <div key={i} style={{ textAlign: "center", transform: `scale(${k})` }}>
        <svg width={300} height={260} viewBox="0 0 300 260">
          {Array.from({ length: 7 }, (_, j) => { const hx = 50 + j * 33, hot = p.ok ? 0.55 : j === 3 ? 1 : 0.2; return <path key={j} d={`M ${hx} 250 q 8 -${20 + 10 * Math.sin(ph + j)} 0 -${44 + 10 * hot}`} stroke={hot > 0.8 ? "#ff3a1a" : "#ff9a3a"} strokeWidth={hot > 0.8 ? 9 : 5} fill="none" opacity={0.6 + 0.4 * hot} strokeLinecap="round" />; })}
          <path d={`M 30 60 L 30 180 Q 30 196 46 196 L 254 196 Q 270 196 270 180 L 270 60`} stroke={p.c} strokeWidth={p.w} fill="none" strokeLinejoin="round" />
          <rect x={30 + p.w / 2} y={110} width={240 - p.w} height={84 - p.w / 2} fill="#3a140a" />
          {!p.ok && <ellipse cx={150} cy={188} rx={36} ry={7} fill="#0a0503" opacity={e(t, badAt, badAt + 0.4)} />}
        </svg>
        <H s={40} c={CH.crema}>{p.l} {p.ok ? <Ok t={t} at={at + i * 0.4 + 0.5} s={54} /> : <No t={t} at={badAt} s={54} />}</H>
      </div>); })}
  </div>;
};

// ======================= SECRETOS: banda de título =======================
export const Banda: React.FC<B & { n: number; text: string; y?: number }> = ({ t, at, out, n, text, y = 860 }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3)), w = ei(t, at, at + 0.5);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "stretch", clipPath: `inset(0 ${50 - 50 * w}% 0 ${50 - 50 * w}%)`, boxShadow: "0 24px 50px rgba(0,0,0,.6)" }}>
      <div style={{ background: CH.maiz, padding: "10px 34px", fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: CH.guinda }}>SECRETO {n}</div>
      <div style={{ background: CH.guinda, padding: "10px 40px", fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CH.crema, letterSpacing: 1 }}>{text}</div>
    </div>
  </div>;
};

// ======================= secreto 1 · los chiles =======================
export const Anillo: React.FC<B & { x: number; y: number; pct: number; label: string; col?: string }> = ({ t, at, out, x, y, pct, label, col = "#d8402c" }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const v = pct * e(t, at + 0.1, at + 1.3), R = 150, C = 2 * Math.PI * R;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <svg width={380} height={380} viewBox="-190 -190 380 380" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }}>
      <circle r={R} fill="rgba(38,16,10,.85)" stroke="#4a2a1a" strokeWidth={34} />
      <circle r={R} fill="none" stroke={col} strokeWidth={34} strokeDasharray={C} strokeDashoffset={C * (1 - v / 100)} transform="rotate(-90)" strokeLinecap="round" />
      <text y={30} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={CH.crema}>{Math.round(v)}%</text>
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.crema, textShadow: "0 4px 14px rgba(0,0,0,.9)", maxWidth: 520 }}>{label}</div>
  </div>;
};
// ficha de chile: silueta dibujada + nombre + gramos + para qué
const CHILE_D: Record<string, string> = {
  ancho: "M 20 60 C 30 20 120 6 190 30 C 230 44 236 70 220 84 C 160 120 60 110 20 60 Z",
  mulato: "M 18 58 C 34 16 130 8 196 34 C 234 50 230 76 210 88 C 150 116 54 104 18 58 Z",
  pasilla: "M 10 50 C 60 30 180 26 270 44 C 282 48 282 58 270 62 C 180 76 60 74 10 50 Z",
  chipotle: "M 40 56 C 50 28 120 22 160 40 C 182 50 180 70 160 78 C 120 92 60 86 40 56 Z",
};
export const ChileFicha: React.FC<B & { x: number; y: number; kind: "ancho" | "mulato" | "pasilla" | "chipotle"; name: string; qty: string; what: string; col: string }> = ({ t, at, out, x, y, kind, name, qty, what, col }) => (
  <Card t={t} at={at} out={out} x={x} y={y} w={520} from="right" pad="20px 30px">
    <svg width={300} height={120} viewBox="0 0 300 120" style={{ display: "block", margin: "0 auto" }}><path d={CHILE_D[kind]} fill={col} stroke="#000" strokeOpacity={0.3} strokeWidth={3} /><path d="M 216 40 q 22 -18 40 -14" stroke="#6b5a2a" strokeWidth={8} fill="none" strokeLinecap="round" /></svg>
    <H s={58} c={CH.maiz}>{name}</H>
    <H s={78}>{qty}</H>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema, lineHeight: 1 }}>{what}</div>
  </Card>
);
// nivel de fuego: tres llamitas, se prende la del medio
export const FuegoNivel: React.FC<B & { x: number; y: number; lvl: number; label: string }> = ({ t, at, out, x, y, lvl, label }) => (
  <Card t={t} at={at} out={out} x={x} y={y} pad="20px 34px">
    <div style={{ display: "flex", gap: 26, justifyContent: "center", alignItems: "flex-end" }}>{[0, 1, 2].map((i) => { const on = i < lvl ? e(t, at + 0.2 + i * 0.2, at + 0.4 + i * 0.2) : 0, fl = 1 + 0.06 * Math.sin(t * 12 + i); return (
      <svg key={i} width={80 + i * 20} height={110 + i * 30} viewBox="0 0 100 140"><path d="M 50 4 C 70 40 96 60 90 96 C 86 124 66 136 50 136 C 34 136 14 124 10 96 C 4 60 30 40 50 4 Z" fill={on ? "#ff7a1a" : "#4a3020"} transform={`translate(50 136) scale(1 ${on ? fl : 1}) translate(-50 -136)`} /><path d="M 50 60 C 60 80 72 92 68 110 C 64 126 36 126 32 110 C 28 92 40 80 50 60 Z" fill={on ? "#ffd27a" : "#5a3a28"} /></svg>); })}</div>
    <H s={56} c={CH.maiz}>{label}</H>
  </Card>
);
// el conteo de la abuela: segundos que corren con su aro, y "¡VOLTEA!"
export const Cuenta: React.FC<B & { x: number; y: number; from: number; to: number; dur: number; flipAt: number }> = ({ t, at, out, x, y, from, to, dur, flipAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const v = from + (to - from) * Math.min(1, Math.max(0, (t - at) / dur)), n = Math.floor(v), fr = v - n, R = 140, C = 2 * Math.PI * R, fl = e(t, flipAt, flipAt + 0.2);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }}>
      <circle r={R} fill="rgba(38,16,10,.88)" stroke="#4a2a1a" strokeWidth={22} />
      <circle r={R} fill="none" stroke={CH.maiz} strokeWidth={22} strokeDasharray={C} strokeDashoffset={C * (1 - (v - from) / (to - from))} transform="rotate(-90)" />
      <text y={46 - 10 * (1 - fr) * 0} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={150} fill={CH.crema} transform={`scale(${1 + 0.12 * Math.max(0, 1 - fr * 4)})`}>{n}</text>
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#ff8a3a", opacity: fl, transform: `scale(${Math.min(1.15, spr(t, flipAt, 1.2))}) rotate(-4deg)`, textShadow: extrude(6, "#5a1a08") }}>¡VOLTÉALOS!</div>
  </div>;
};
// tres señales numeradas
export const Senales: React.FC<{ t: number; out: number; x: number; y: number; title: string; rows: { at: number; text: string }[] }> = ({ t, out, x, y, title, rows }) => (
  <Card t={t} at={rows[0].at - 0.3} out={out} x={x} y={y} w={640} from="left">
    <H s={50} c={CH.maiz}>{title}</H>
    {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>
      <div style={{ width: 66, height: 66, borderRadius: 33, background: CH.maiz, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CH.guinda }}>{i + 1}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.crema, lineHeight: 1 }}>{r.text}</div></div>; })}
  </Card>
);
// curva del tostado: el sabor sube (caramelo) y de golpe cae (quemado)
export const CurvaTostado: React.FC<B & { x: number; y: number; burnAt: number }> = ({ t, at, out, x, y, burnAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const pts = Array.from({ length: 60 }, (_, i) => { const u = i / 59, v = u < 0.62 ? Math.sin((u / 0.62) * Math.PI / 2) : 1 - Math.pow((u - 0.62) / 0.38, 0.6) * 1.15; return [60 + u * 640, 330 - v * 240]; });
  const d = e(t, at + 0.2, burnAt + 0.6), shown = Math.max(2, Math.floor(pts.length * d));
  const path = pts.slice(0, shown).map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "), last = pts[shown - 1];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: 24, borderRadius: 18, background: DARK, boxShadow: ring() }}>
    <svg width={760} height={400} viewBox="0 0 760 400">
      <rect x={60} y={60} width={397} height={280} fill="rgba(154,211,90,.12)" /><rect x={457} y={60} width={243} height={280} fill="rgba(216,64,44,.18)" />
      <line x1={60} y1={340} x2={710} y2={340} stroke={CH.crema} strokeWidth={4} /><line x1={60} y1={340} x2={60} y2={50} stroke={CH.crema} strokeWidth={4} />
      <text x={258} y={95} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill="#9ad35a">caramelo</text>
      <text x={580} y={95} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill="#ff6a4a" opacity={e(t, burnAt, burnAt + 0.3)}>quemado</text>
      <path d={path} stroke={CH.maiz} strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={14} fill={t > burnAt ? "#ff3a1a" : CH.maiz} />
      <text x={380} y={385} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={30} fill={CH.crema} letterSpacing={4}>CALOR →</text>
      <text x={40} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={30} fill={CH.crema} transform="rotate(-90 40 200)" letterSpacing={4}>SABOR</text>
    </svg>
  </div>;
};
// el chile bueno se dobla, el viejo se quiebra
export const DoblaTest: React.FC<B & { x: number; y: number; badAt: number }> = ({ t, at, out, x, y, badAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const b = ei(t, at + 0.3, at + 1.2), cr = e(t, badAt, badAt + 0.25);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 50 }}>
    {[0, 1].map((i) => <div key={i} style={{ textAlign: "center", padding: "20px 26px", borderRadius: 18, background: DARK, boxShadow: ring(i ? "#ff5a3c" : "#9ad35a") }}>
      <svg width={320} height={200} viewBox="0 0 320 200">
        {i === 0 ? <path d={`M 40 ${110 - 0} Q 160 ${110 - 80 * b} 280 110`} stroke="#5a160a" strokeWidth={46} fill="none" strokeLinecap="round" />
          : <g><path d="M 40 110 L 158 110" stroke="#3a1a10" strokeWidth={40} strokeLinecap="round" transform={`rotate(${-18 * cr} 158 110)`} /><path d="M 162 110 L 280 110" stroke="#3a1a10" strokeWidth={40} strokeLinecap="round" transform={`rotate(${18 * cr} 162 110)`} />
            {cr > 0.1 && Array.from({ length: 8 }, (_, k) => <circle key={k} cx={160 + Math.cos(k) * 40 * cr} cy={110 + Math.sin(k * 1.7) * 40 * cr} r={5} fill="#3a1a10" />)}</g>}
      </svg>
      <H s={48} c={i ? "#ff8a6a" : "#bfe88a"}>{i ? "SE QUIEBRA" : "SE DOBLA"} {i ? <No t={t} at={badAt + 0.2} s={56} /> : <Ok t={t} at={at + 1.1} s={56} />}</H>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: CH.crema }}>{i ? "no lo compres" : "huele a fruta, brilla"}</div>
    </div>)}
  </div>;
};

// ======================= secreto 2 · cada cosa por separado =======================
const ICON: Record<string, (c: string) => React.ReactNode> = {
  ajonjoli: (c) => <g>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={30 + (i % 3) * 20} cy={30 + Math.floor(i / 3) * 20} rx={7} ry={4} fill={c} transform={`rotate(${i * 40} ${30 + (i % 3) * 20} ${30 + Math.floor(i / 3) * 20})`} />)}</g>,
  cacahuate: (c) => <path d="M 30 30 C 10 50 30 70 50 60 C 70 70 90 50 70 30 C 60 15 40 15 30 30 Z" fill={c} />,
  almendra: (c) => <path d="M 50 12 C 80 30 80 70 50 88 C 20 70 20 30 50 12 Z" fill={c} />,
  pasas: (c) => <g>{[[35, 40], [62, 38], [48, 64]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={15} fill={c} />)}</g>,
  platano: (c) => <path d="M 14 30 C 30 80 80 86 90 60 C 70 70 40 60 24 24 Z" fill={c} />,
  tortilla: (c) => <g><circle cx={50} cy={50} r={36} fill={c} />{[[38, 40], [60, 56], [45, 62]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#8a5a1a" />)}</g>,
  bolillo: (c) => <g><ellipse cx={50} cy={52} rx={40} ry={24} fill={c} /><path d="M 30 44 Q 50 54 70 44" stroke="#8a4a1a" strokeWidth={5} fill="none" /></g>,
};
export const IconRow: React.FC<{ t: number; out: number; x: number; y: number; items: { k: string; label: string; at: number; c: string }[] }> = ({ t, out, x, y, items }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < items[0].at - 0.1) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 16 }}>
    {items.map((it, i) => { const k = Math.min(1.12, spr(t, it.at, 1.1)); if (k <= 0.01) return null; return (
      <div key={i} style={{ width: 200, textAlign: "center", padding: "14px 6px", borderRadius: 16, background: DARK, boxShadow: ring(), transform: `translateY(${(1 - Math.min(1, k)) * 140}px) scale(${0.7 + 0.3 * k})` }}>
        <svg width={110} height={100} viewBox="0 0 100 100">{ICON[it.k](it.c)}</svg>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CH.crema, lineHeight: 1 }}>{it.label}</div></div>); })}
  </div>;
};
// comparación de dos columnas
export const Versus: React.FC<B & { x: number; y: number; a: string; b: string; rows: [string, boolean, boolean][]; dt?: number; w?: number }> = ({ t, at, out, x, y, a, b, rows, dt = 0.45, w = 980 }) => (
  <Card t={t} at={at} out={out} x={x} y={y} w={w} pad="22px 30px">
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", alignItems: "center", rowGap: 10 }}>
      <div /><H s={52} c={CH.maiz}>{a}</H><H s={52} c="#d0b8a0">{b}</H>
      {rows.map(([l, ya, yb], i) => { const r = at + 0.4 + i * dt, k = e(t, r, r + 0.25); return <React.Fragment key={i}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.crema, opacity: k }}>{l}</div>
        <div style={{ textAlign: "center", opacity: k }}>{ya ? <Ok t={t} at={r} /> : <No t={t} at={r} />}</div>
        <div style={{ textAlign: "center", opacity: k }}>{yb ? <Ok t={t} at={r + 0.15} /> : <No t={t} at={r + 0.15} />}</div></React.Fragment>; })}
    </div>
  </Card>
);
// el orden del frito: 6 pasos que se van prendiendo
export const Orden: React.FC<{ t: number; at: number; out: number; y?: number; steps: { label: string; at: number }[]; nums?: boolean }> = ({ t, at, out, y = 930, steps, nums = true }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const cur = steps.reduce((acc, s, i) => (t >= s.at ? i : acc), -1);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, display: "flex", justifyContent: "center", alignItems: "center" }}>
    {steps.map((s, i) => { const on = i <= cur, now = i === cur; return <React.Fragment key={i}>
      {i > 0 && <div style={{ width: 50, height: 6, background: on ? CH.maiz : "rgba(246,231,200,.25)" }} />}
      <div style={{ padding: "8px 18px", borderRadius: 30, background: now ? CH.maiz : on ? "rgba(242,193,78,.25)" : "rgba(38,16,10,.8)", border: `3px solid ${on ? CH.maiz : "rgba(246,231,200,.3)"}`, transform: `scale(${now ? 1.1 + 0.05 * Math.sin(t * 6) : 1})`, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
        {nums && <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: now ? CH.guinda : CH.crema }}>{i + 1} </span>}<span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: now ? CH.guinda : CH.crema }}>{s.label}</span></div>
    </React.Fragment>; })}
  </div>;
};
// cronómetro de cocina (minutos que corren en la carátula)
export const Cronometro: React.FC<B & { x: number; y: number; mins: number; label: string; dur?: number; size?: number }> = ({ t, at, out, x, y, mins, label, dur = 2, size = 300 }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const v = mins * ei(t, at + 0.2, at + 0.2 + dur), a = (v / 60) * 360;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <svg width={size} height={size} viewBox="-150 -150 300 300" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }}>
      <rect x={-22} y={-150} width={44} height={30} rx={8} fill="#c9c9c9" /><circle r={128} fill="#f3ecdc" stroke="#c2552d" strokeWidth={18} />
      <path d={`M 0 0 L 0 -110 A 110 110 0 ${a > 180 ? 1 : 0} 1 ${110 * Math.sin(a * Math.PI / 180)} ${-110 * Math.cos(a * Math.PI / 180)} Z`} fill="rgba(216,64,44,.35)" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-112} x2={0} y2={-96} stroke={CH.tinta} strokeWidth={5} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-100} stroke={CH.guinda} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} /><circle r={10} fill={CH.tinta} />
    </svg>
    <H s={64}>{label}</H>
  </div>;
};
// las pasitas se inflan como globitos (sobre el clip)
export const Globitos: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    {Array.from({ length: 7 }, (_, i) => { const a0 = at + i * 0.25, k = Math.min(1.25, spr(t, a0, 0.5)), cx = x + Math.cos(i * 2.1) * 260, cy = y + Math.sin(i * 1.7) * 140; return <g key={i}>
      <circle cx={cx} cy={cy} r={40 + 50 * k} fill="none" stroke={CH.maiz} strokeWidth={5} opacity={0.9} /><circle cx={cx - 18 * k} cy={cy - 22 * k} r={9 * k} fill="#fff" opacity={0.7} /></g>; })}
  </svg>;
};
// onomatopeya de historieta con chispitas (¡CRAC!, ¡TSSSHH!)
export const Onoma: React.FC<B & { x: number; y: number; text: string; col?: string; size?: number; rot?: number }> = ({ t, at, out, x, y, text, col = CH.maiz, size = 150, rot = -8 }) => {
  const { k, o } = vis(t, at, out, 1.2);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${k})` }}>
    <svg width={700} height={420} viewBox="-350 -210 700 420" style={{ position: "absolute", left: -350, top: -210 }}>
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, r1 = 150, r2 = 210 + 40 * Math.sin(i * 3) ; return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1 * 0.6} x2={Math.cos(a) * r2 * Math.min(1, k)} y2={Math.sin(a) * r2 * 0.6 * Math.min(1, k)} stroke={col} strokeWidth={10} strokeLinecap="round" />; })}
    </svg>
    <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: extrude(10, "#5a1a08"), WebkitTextStroke: "4px #2a0f05" }}>{text}</div>
  </div>;
};
// la mitad del sabor (media rueda que se llena)
export const Mitad: React.FC<B & { x: number; y: number; label: string }> = ({ t, at, out, x, y, label }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const v = e(t, at + 0.2, at + 1.2) * 180;
  const pt = (a: number) => `${150 * Math.sin(a * Math.PI / 180)} ${-150 * Math.cos(a * Math.PI / 180)}`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }}>
      <circle r={150} fill="#3a1a0c" stroke={CH.crema} strokeWidth={6} />
      <path d={`M 0 0 L 0 -150 A 150 150 0 0 1 ${pt(v)} Z`} fill={CH.maiz} />
      <text y={20} x={70} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={CH.guinda} opacity={e(t, at + 1, at + 1.3)}>½</text>
    </svg>
    <H s={58}>{label}</H>
  </div>;
};

// ======================= secreto 3 · el agua del remojo =======================
// lo que hace todo mundo: el agua del remojo va a la licuadora (y se tacha)
export const FlujoMito: React.FC<B & { x: number; y: number; xAt: number }> = ({ t, at, out, x, y, xAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const f = e(t, at + 0.3, at + 1.4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "20px 30px", borderRadius: 18, background: DARK, boxShadow: ring() }}>
    <svg width={900} height={340} viewBox="0 0 900 340">
      <path d="M 60 120 L 60 260 Q 60 290 90 290 L 250 290 Q 280 290 280 260 L 280 120" fill="#9a4a26" /><rect x={70} y={150} width={200} height={130} fill="#3a1a0a" />
      <text x={170} y={100} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={48} fill={CH.crema}>agua del remojo</text>
      <path d={`M 300 200 L ${300 + 260 * f} 200`} stroke={CH.maiz} strokeWidth={12} strokeDasharray="30 18" /><polygon points={`${560 * f + 20 * (1 - f) + 0},180 ${600 * f},200 ${560 * f},220`} fill={CH.maiz} opacity={f} />
      {Array.from({ length: 6 }, (_, i) => { const p = ((t * 0.8 + i / 6) % 1) * f; return <circle key={i} cx={300 + p * 280} cy={200 + Math.sin(p * 9) * 10} r={10} fill="#5a2a12" />; })}
      <path d="M 640 60 L 820 60 L 800 260 L 660 260 Z" fill="rgba(200,220,230,.35)" stroke="#d9e4ea" strokeWidth={6} /><rect x={650} y={260} width={160} height={50} rx={10} fill="#ccc" /><rect x={665} y={150} width={140} height={108} fill="#4a1a0a" opacity={f} />
      <text x={730} y={40} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={48} fill={CH.crema}>licuadora</text>
    </svg>
    <div style={{ position: "absolute", left: 60, top: 0 }}><DrawX t={t} at={xAt} x={0} y={0} w={800} h={340} /></div>
  </div>;
};
// partículas: lo amargo sale al agua, lo dulce se queda en el chile
export const Particulas: React.FC<B & { x: number; y: number; sweetAt: number }> = ({ t, at, out, x, y, sweetAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "20px 30px", borderRadius: 18, background: DARK, boxShadow: ring() }}>
    <svg width={760} height={380} viewBox="0 0 760 380">
      <rect x={20} y={40} width={720} height={320} rx={20} fill={`rgba(90,40,14,${0.2 + 0.5 * e(t, at, at + 3)})`} />
      <path d={CHILE_D.ancho} transform="translate(250 140) scale(1.3)" fill="#7a1a0a" />
      {Array.from({ length: 26 }, (_, i) => { const ph = Math.min(1, Math.max(0, (t - at - i * 0.07) / 2.2)), a = i * 2.4, r = 40 + ph * (160 + (i % 5) * 30); return <circle key={i} cx={390 + Math.cos(a) * r * 1.4} cy={210 + Math.sin(a) * r * 0.7} r={7} fill="#3a2414" opacity={0.9} />; })}
      {Array.from({ length: 12 }, (_, i) => <circle key={"d" + i} cx={330 + (i % 6) * 26} cy={196 + Math.floor(i / 6) * 26} r={8} fill={CH.maiz} opacity={e(t, sweetAt, sweetAt + 0.4)} />)}
      <text x={110} y={90} fontFamily={HAND} fontWeight={700} fontSize={50} fill="#ffb08a">amargo → al agua</text>
      <text x={250} y={340} fontFamily={HAND} fontWeight={700} fontSize={50} fill={CH.maiz} opacity={e(t, sweetAt, sweetAt + 0.4)}>lo dulce se queda en el chile</text>
    </svg>
  </div>;
};
// báscula de mercado
export const Bascula: React.FC<B & { x: number; y: number; kg: number; label: string; sub: string }> = ({ t, at, out, x, y, kg, label, sub }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const v = kg * spr(t, at + 0.3, 0.8), a = -120 + (v / 10) * 240;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <svg width={380} height={320} viewBox="-190 -170 380 320" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }}>
      <rect x={-150} y={-150} width={300} height={30} rx={10} fill="#c9c9c9" /><rect x={-20} y={-122} width={40} height={30} fill="#999" />
      <circle cy={20} r={120} fill="#e83a62" /><circle cy={20} r={95} fill="#f6efe0" />
      {Array.from({ length: 11 }, (_, i) => { const aa = (-120 + i * 24) * Math.PI / 180; return <text key={i} x={Math.sin(aa) * 72} y={20 - Math.cos(aa) * 72 + 8} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={20} fill={CH.tinta}>{i}</text>; })}
      <line x1={0} y1={20} x2={Math.sin(a * Math.PI / 180) * 86} y2={20 - Math.cos(a * Math.PI / 180) * 86} stroke="#d8402c" strokeWidth={6} strokeLinecap="round" /><circle cy={20} r={10} fill={CH.tinta} />
    </svg>
    <H s={70}>{label}</H><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.crema }}>{sub}</div>
  </div>;
};
// el sabor plano (sin comal) contra el sabor redondo (con comal)
export const SaborPlano: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const d = e(t, at + 0.2, at + 1.6);
  const wave = (amp: number, ph: number) => Array.from({ length: 50 }, (_, i) => `${i ? "L" : "M"} ${40 + i * 13} ${170 - Math.abs(Math.sin(i * 0.33 + ph)) * amp * Math.min(1, d * 1.5)}`).join(" ");
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "20px 30px", borderRadius: 18, background: DARK, boxShadow: ring() }}>
    <svg width={740} height={260} viewBox="0 0 740 260"><path d={wave(110, 0)} stroke={CH.maiz} strokeWidth={8} fill="none" /><path d={wave(10, 1)} stroke="#9ad35a" strokeWidth={8} fill="none" strokeDasharray="14 10" />
      <text x={700} y={50} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={46} fill={CH.maiz}>con comal: redondo</text><text x={700} y={240} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={46} fill="#9ad35a">sin comal: verde, plano</text></svg>
  </div>;
};
// porciones: de 20 gentes a 4
export const Porciones: React.FC<B & { x: number; y: number; shrinkAt: number }> = ({ t, at, out, x, y, shrinkAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const s = e(t, shrinkAt, shrinkAt + 0.8), n = Math.round(20 - 16 * s);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "20px 30px", borderRadius: 18, background: DARK, boxShadow: ring(), textAlign: "center" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 46px)", gap: 10, justifyContent: "center" }}>{Array.from({ length: 20 }, (_, i) => <svg key={i} width={46} height={60} viewBox="0 0 26 34" style={{ opacity: i < n ? 1 : 0.12, transition: "none" }}><circle cx={13} cy={8} r={7} fill={i < 4 ? CH.maiz : CH.crema} /><path d="M 2 34 C 2 18 24 18 24 34 Z" fill={i < 4 ? CH.maiz : CH.crema} /></svg>)}</div>
    <H s={70}>{n} <span style={{ fontFamily: HAND, color: CH.crema }}>gentes</span>{s > 0.9 && <span style={{ fontFamily: HAND, fontSize: 50, color: CH.maiz }}> · mismo sabor</span>}</H>
  </div>;
};

// ======================= secreto 4 · las especias =======================
export const SobreViejo: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-6 + 2 * Math.sin(t)}deg) scale(${0.7 + 0.3 * k})` }}>
    <svg width={360} height={460} viewBox="0 0 360 460" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <path d="M 30 40 L 330 40 L 320 440 L 40 440 Z" fill="#c9b48a" /><path d="M 30 40 L 330 40 L 320 80 L 40 80 Z" fill="#a8946a" /><path d="M 60 40 L 90 20 L 120 44 L 160 18 L 200 44" stroke="#8a7a5a" strokeWidth={4} fill="none" />
      <rect x={70} y={150} width={220} height={120} fill="#e0d4b0" /><text x={180} y={225} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill="#8a7a5a">ESPECIAS</text>
      <text x={180} y={330} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={30} fill="#7a6a4a">EN POLVO</text>
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={300} y1={60} x2={300 - Math.cos(i * 0.3) * 120} y2={60 + Math.sin(i * 0.3) * 120} stroke="rgba(255,255,255,.6)" strokeWidth={2} />)}
      {[40, 70, 100].map((r) => <path key={r} d={`M ${300 - r} 60 Q ${300 - r * 0.7} ${60 + r * 0.5} 300 ${60 + r}`} stroke="rgba(255,255,255,.55)" strokeWidth={2} fill="none" />)}
    </svg>
    <div style={{ position: "absolute", left: 30, top: 380, padding: "8px 18px", background: "#d8402c", fontFamily: SERIF, fontWeight: 900, fontSize: 36, color: "#fff", transform: `rotate(-8deg) scale(${Math.min(1.1, spr(t, at + 0.6, 1.2))})`, whiteSpace: "nowrap" }}>ABIERTO HACE 8 MESES</div>
  </div>;
};
// barras de sabor: el chile debe mandar; el clavo de más lo tapa
export const BarrasSabor: React.FC<B & { x: number; y: number; badAt: number }> = ({ t, at, out, x, y, badAt }) => {
  const bad = e(t, badAt, badAt + 0.6);
  const rows: [string, number, number, string][] = [["chile", 0.9, 0.35, CH.barro], ["clavo", 0.2, 0.95, "#8a4a22"], ["comino", 0.15, 0.6, "#b0903a"], ["canela", 0.25, 0.3, "#c08060"]];
  return <Card t={t} at={at} out={out} x={x} y={y} w={700}>
    <H s={50} c={CH.maiz}>{bad > 0.5 ? "UN PUÑO DE TODO" : "QUIÉN MANDA"}</H>
    {rows.map(([l, a, b, c], i) => { const v = (a + (b - a) * bad) * e(t, at + 0.2 + i * 0.12, at + 0.8 + i * 0.12); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
      <div style={{ width: 150, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema }}>{l}</div>
      <div style={{ flex: 1, height: 34, borderRadius: 17, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 17, background: c }} /></div></div>; })}
  </Card>;
};
// las especias contadas con puntitos
export const Conteo: React.FC<{ t: number; out: number; x: number; y: number; rows: { label: string; n: number; at: number; c: string; r?: number }[] }> = ({ t, out, x, y, rows }) => (
  <Card t={t} at={rows[0].at - 0.3} out={out} x={x} y={y} w={760} from="left">
    {rows.map((r, i) => { const shown = Math.floor(r.n * e(t, r.at, r.at + 0.25 + r.n * 0.06)); const g = ei(t, r.at - 0.25, r.at + 0.1); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: i ? 12 * g : 0, maxHeight: 90 * g, overflow: "hidden", opacity: g }}>
      <div style={{ width: 80, fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CH.maiz, textAlign: "right" }}>{shown}</div>
      <div style={{ display: "flex", gap: 6, width: 300, flexWrap: "wrap" }}>{Array.from({ length: shown }, (_, k) => <div key={k} style={{ width: (r.r ?? 9) * 2, height: (r.r ?? 9) * 2, borderRadius: r.r ?? 9, background: r.c }} />)}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.crema }}>{r.label}</div></div>; })}
  </Card>
);
// escala de clavos: 6 = fiesta, 15 = dentista
export const EscalaClavo: React.FC<B & { x: number; y: number; badAt: number }> = ({ t, at, out, x, y, badAt }) => {
  const v = 6 + 9 * ei(t, badAt, badAt + 0.8), p = (v - 0) / 20;
  return <Card t={t} at={at} out={out} x={x} y={y} w={900}>
    <div style={{ position: "relative", height: 150 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 26, borderRadius: 13, background: "linear-gradient(90deg,#9ad35a,#f2c14e 45%,#d8402c 75%)" }} />
      <div style={{ position: "absolute", left: `${p * 100}%`, top: 40, transform: "translateX(-50%)", width: 56, height: 86, borderRadius: 14, background: CH.crema, boxShadow: "0 8px 20px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 36, color: CH.guinda }}>{Math.round(v)}</div>
      <div style={{ position: "absolute", left: "30%", top: -6, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#bfe88a" }}>huele a fiesta</div>
      <div style={{ position: "absolute", left: "75%", top: -6, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#ff8a6a", opacity: e(t, badAt + 0.6, badAt + 0.9) }}>sabe a dentista</div>
    </div>
    <H s={44} c={CH.maiz}>CLAVOS</H>
  </Card>;
};

// ======================= secreto 5 · moler y colar =======================
export const Textura: React.FC<B & { x: number; y: number; goodAt: number }> = ({ t, at, out, x, y, goodAt }) => {
  const g = e(t, goodAt, goodAt + 1);
  return <Card t={t} at={at} out={out} x={x} y={y} w={980}>
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width={260} height={160} viewBox="0 0 260 160"><rect width={260} height={160} rx={16} fill="#5a2210" />{Array.from({ length: 90 }, (_, i) => <circle key={i} cx={(i * 47) % 250 + 5} cy={(i * 31) % 150 + 5} r={3 + (i % 4)} fill="#2a0e06" opacity={1 - g} />)}<rect width={260} height={160} rx={16} fill="url(#tv)" opacity={g} /><defs><linearGradient id="tv" x1="0" x2="1"><stop offset="0" stopColor="#3a1208" /><stop offset=".5" stopColor="#7a2a12" /><stop offset="1" stopColor="#3a1208" /></linearGradient></defs></svg>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.crema }}><span>arena</span><span style={{ color: CH.maiz }}>terciopelo</span></div>
        <div style={{ position: "relative", height: 24, borderRadius: 12, background: "rgba(255,255,255,.12)", marginTop: 10 }}><div style={{ position: "absolute", left: `${5 + 88 * g}%`, top: -14, width: 52, height: 52, borderRadius: 26, background: CH.maiz, transform: "translateX(-50%)", boxShadow: "0 6px 16px rgba(0,0,0,.5)" }} /></div>
      </div>
    </div>
  </Card>;
};
// trueque con el molinero: molienda a cambio de un plato de mole
export const Trueque: React.FC<B & { x: number; y: number; who: string }> = ({ t, at, out, x, y, who }) => {
  const sw = e(t, at + 0.6, at + 1.4);
  return <Card t={t} at={at} out={out} x={x} y={y} w={760} bg="linear-gradient(180deg,#f6ecd4,#e6d4ab)" col="#7a1f2b">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
      <div style={{ textAlign: "center" }}><svg width={150} height={150} viewBox="0 0 100 100"><rect x={20} y={40} width={60} height={50} rx={6} fill="#c8261a" /><path d="M 30 40 L 40 10 L 60 10 L 70 40 Z" fill="#9a1a10" /><circle cx={50} cy={65} r={12} fill="#f2c14e" /></svg><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta }}>la molienda</div></div>
      <svg width={140} height={80} viewBox="0 0 140 80"><path d={`M 10 30 L 120 30`} stroke={CH.guinda} strokeWidth={8} /><polygon points="110,15 135,30 110,45" fill={CH.guinda} /><path d="M 130 55 L 20 55" stroke={CH.guinda} strokeWidth={8} opacity={sw} /><polygon points="30,40 5,55 30,70" fill={CH.guinda} opacity={sw} /></svg>
      <div style={{ textAlign: "center", opacity: sw }}><svg width={150} height={150} viewBox="0 0 100 100"><ellipse cx={50} cy={60} rx={42} ry={18} fill="#a3502a" /><ellipse cx={50} cy={56} rx={30} ry={11} fill="#2a0e06" /></svg><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta }}>un plato de mole</div></div>
    </div>
    <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CH.guinda }}>{who}</div>
  </Card>;
};
// licuadora en tandas chicas
export const Tandas: React.FC<{ t: number; out: number; x: number; y: number; rows: { at: number; label: string; c: string }[] }> = ({ t, out, x, y, rows }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < rows[0].at - 0.1) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30 }}>
    {rows.map((r, i) => { const k = Math.min(1.1, spr(t, r.at, 1)); if (k <= 0.01) return null; const sp = t * 8 + i; return <div key={i} style={{ width: 300, textAlign: "center", padding: "16px 10px", borderRadius: 18, background: DARK, boxShadow: ring(), transform: `scale(${0.6 + 0.4 * k})` }}>
      <svg width={170} height={220} viewBox="0 0 100 130"><path d="M 20 10 L 80 10 L 72 95 L 28 95 Z" fill="rgba(210,225,235,.3)" stroke="#d9e4ea" strokeWidth={3} /><path d={`M 24 ${40 + 3 * Math.sin(sp)} Q 50 ${32 + 6 * Math.sin(sp * 1.3)} 76 ${40 + 3 * Math.cos(sp)} L 72 95 L 28 95 Z`} fill={r.c} /><rect x={22} y={95} width={56} height={30} rx={6} fill="#bbb" /><circle cx={50} cy={110} r={6} fill="#d8402c" /></svg>
      <H s={46} c={CH.maiz}>TANDA {i + 1}</H><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CH.crema, lineHeight: 1 }}>{r.label}</div></div>; })}
  </div>;
};
// coladera ×2
export const Coladera: React.FC<B & { x: number; y: number; twoAt: number }> = ({ t, at, out, x, y, twoAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const two = Math.min(1.2, spr(t, twoAt, 1.2));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, display: "flex", alignItems: "center", gap: 20 }}>
    <svg width={300} height={240} viewBox="0 0 150 120" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}><path d="M 20 30 Q 75 120 130 30 Z" fill="rgba(200,200,200,.35)" stroke="#ddd" strokeWidth={4} />{Array.from({ length: 6 }, (_, i) => <line key={i} x1={30 + i * 18} y1={32} x2={60 + i * 6} y2={86} stroke="#ccc" strokeWidth={1.5} />)}<line x1={130} y1={30} x2={148} y2={24} stroke="#888" strokeWidth={6} />{Array.from({ length: 5 }, (_, i) => { const p = ((t * 1.2 + i / 5) % 1); return <circle key={i} cx={70 + (i - 2) * 5} cy={90 + p * 28} r={3} fill="#5a1a0a" opacity={1 - p} />; })}</svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 180, color: CH.maiz, transform: `scale(${two})`, textShadow: extrude(10, "#5a2a10") }}>×2</div>
  </div>;
};
// lupa: los pedacitos de piel de chile que se sienten en la boca
export const Lupa: React.FC<B & { x: number; y: number; cleanAt: number; label: string }> = ({ t, at, out, x, y, cleanAt, label }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const c = e(t, cleanAt, cleanAt + 0.8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, textAlign: "center" }}>
    <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <line x1={140} y1={140} x2={220} y2={220} stroke="#5a3a22" strokeWidth={34} strokeLinecap="round" />
      <circle r={170} fill="#3a1208" stroke="#d9c7a0" strokeWidth={20} />
      {Array.from({ length: 34 }, (_, i) => { const a = i * 2.39, r = Math.sqrt((i + 1) / 34) * 140; return <path key={i} d={`M ${Math.cos(a) * r} ${Math.sin(a) * r} l ${10 + (i % 3) * 6} ${4 - (i % 5) * 3} l -4 8 Z`} fill="#c8401a" opacity={(1 - c) * 0.9} />; })}
      <ellipse cx={-60} cy={-70} rx={60} ry={30} fill="#fff" opacity={0.12} transform="rotate(-30)" />
    </svg>
    <H s={50}>{label}</H>
  </div>;
};

// ======================= secreto 6 · el mole se fríe =======================
export const HervirFreir: React.FC<B & { x: number; y: number; okAt: number }> = ({ t, at, out, x, y, okAt }) => {
  const sz = (fr: boolean, i: number) => <div style={{ textAlign: "center", padding: "16px 22px", borderRadius: 18, background: DARK, boxShadow: ring(fr ? "#9ad35a" : "#ff5a3c"), opacity: fr ? e(t, okAt - 0.2, okAt + 0.1) : 1 }} key={i}>
    <svg width={300} height={200} viewBox="0 0 150 100">{fr ? Array.from({ length: 10 }, (_, k) => <circle key={k} cx={30 + (k * 37) % 90} cy={30 - ((t * 60 + k * 13) % 30)} r={2.5} fill="#ffd27a" />) : Array.from({ length: 6 }, (_, k) => <circle key={k} cx={35 + k * 16} cy={44 - ((t * 20 + k * 7) % 16)} r={5} fill="none" stroke="#d9e4ea" strokeWidth={2} />)}
      <path d="M 10 40 Q 10 92 75 92 Q 140 92 140 40 Z" fill="#7a3a1a" /><ellipse cx={75} cy={42} rx={64} ry={10} fill={fr ? "#2a0e06" : "#a8401a"} /></svg>
    <H s={50} c={fr ? "#bfe88a" : "#ff8a6a"}>{fr ? "SE FRÍE" : "SÓLO HERVIR"} {fr ? <Ok t={t} at={okAt + 0.2} s={54} /> : <No t={t} at={at + 0.6} s={54} />}</H>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: CH.crema }}>{fr ? "redondo, tostado" : "sabe a chile crudo"}</div></div>;
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>{[false, true].map((f, i) => sz(f, i))}</div>;
};
// barra del color del mole: de rojo crudo a negro brillante, con los minutos
export const ColorBarra: React.FC<B & { x: number; y: number; t0: number; t1: number; mins: number }> = ({ t, at, out, x, y, t0, t1, mins }) => {
  const p = ei(t, t0, t1);
  return <Card t={t} at={at} out={out} x={x} y={y} w={1100} pad="20px 34px">
    <div style={{ position: "relative", height: 70, borderRadius: 35, background: "linear-gradient(90deg,#b8361a,#7a2410 45%,#2a0b05 80%,#120402)", boxShadow: "inset 0 4px 12px rgba(255,255,255,.2)" }}>
      <div style={{ position: "absolute", left: `${p * 100}%`, top: -18, transform: "translateX(-50%)", width: 10, height: 106, borderRadius: 5, background: CH.crema, boxShadow: "0 0 18px rgba(255,240,200,.8)" }} />
      <div style={{ position: "absolute", right: 30, top: 14, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#fff", opacity: e(t, t1 - 0.5, t1) }}>brillante</div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#ff9a7a" }}>rojo, crudo</span><H s={52} c={CH.maiz}>{Math.round(mins * p)} min</H><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema }}>casi negro</span></div>
  </Card>;
};
// tazas de caldo, de una en una
export const Tazas: React.FC<B & { x: number; y: number; n: number; dt: number; label: string }> = ({ t, at, out, x, y, n, dt, label }) => (
  <Card t={t} at={at} out={out} x={x} y={y} pad="18px 30px">
    <div style={{ display: "flex", gap: 12 }}>{Array.from({ length: n }, (_, i) => { const k = Math.min(1.1, spr(t, at + 0.3 + i * dt, 1.2)); return <svg key={i} width={84} height={84} viewBox="0 0 60 60" style={{ transform: `scale(${k})`, opacity: Math.min(1, k * 2) }}><path d="M 8 18 L 44 18 L 40 50 Q 26 56 12 50 Z" fill="#a3502a" /><path d="M 44 24 Q 56 26 52 36 Q 48 42 42 40" stroke="#a3502a" strokeWidth={4} fill="none" /><ellipse cx={26} cy={19} rx={17} ry={4} fill="#e8b84a" /></svg>; })}</div>
    <H s={52} c={CH.maiz}>{label}</H>
  </Card>
);
// la cuchara: el mole cubre y cae en listón
export const Liston: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const d = e(t, at + 0.4, at + 2.2);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <svg width={420} height={460} viewBox="0 0 210 230" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      <rect x={150} y={10} width={18} height={110} rx={9} fill="#c09060" transform="rotate(30 159 65)" />
      <ellipse cx={95} cy={110} rx={60} ry={34} fill="#b88a58" /><ellipse cx={95} cy={108} rx={56} ry={30} fill="#2a0e06" />
      <path d={`M 70 130 C 72 ${150 + 60 * d} 64 ${170 + 50 * d} 70 ${150 + 80 * d}`} stroke="#2a0e06" strokeWidth={16 - 6 * d} fill="none" strokeLinecap="round" />
      <ellipse cx={72} cy={226} rx={30 * d} ry={5 * d} fill="#2a0e06" />
    </svg>
    <H s={54}>CAE EN LISTÓN</H>
  </div>;
};
// comparación de tamaños: el piloncillo, como un huevo
export const ComoHuevo: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => (
  <Card t={t} at={at} out={out} x={x} y={y} pad="22px 36px">
    <div style={{ display: "flex", alignItems: "flex-end", gap: 50, justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}><svg width={150} height={190} viewBox="0 0 100 130"><path d="M 50 6 L 92 124 L 8 124 Z" fill="#8a4a18" /><path d="M 50 6 L 70 124 L 30 124 Z" fill="#a85a20" /></svg><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema }}>piloncillo</div></div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CH.maiz, alignSelf: "center" }}>=</div>
      <div style={{ textAlign: "center", opacity: e(t, at + 0.5, at + 0.8) }}><svg width={130} height={170} viewBox="0 0 100 130"><path d="M 50 6 C 86 6 96 80 90 100 C 84 122 16 122 10 100 C 4 80 14 6 50 6 Z" fill="#f6ecd8" /></svg><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema }}>un huevo</div></div>
    </div>
  </Card>
);
// dos sabores que se casan (lo amarguito del pasilla + lo ácido del jitomate) con el chocolate en medio
export const SeCasan: React.FC<B & { x: number; y: number; joinAt: number }> = ({ t, at, out, x, y, joinAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const j = ei(t, joinAt, joinAt + 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={900} height={420} viewBox="-450 -210 900 420">
      <circle cx={-230 + 120 * j} r={140} fill="rgba(122,31,43,.85)" /><circle cx={230 - 120 * j} r={140} fill="rgba(200,60,30,.75)" style={{ mixBlendMode: "screen" }} />
      <text x={-260 + 120 * j} y={14} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill={CH.crema}>amarguito</text>
      <text x={260 - 120 * j} y={14} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill={CH.crema}>ácido</text>
      <g opacity={j} transform={`translate(0 -150) scale(${0.6 + 0.4 * j})`}><circle r={40} fill="none" stroke={CH.maiz} strokeWidth={10} /><circle cx={0} cy={-46} r={12} fill={CH.maiz} /></g>
      <text y={185} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={52} fill={CH.maiz} opacity={j}>EL CHOCOLATE LOS CASA</text>
    </svg>
  </div>;
};

// ======================= secreto 7 · un día antes =======================
export const Calendario: React.FC<B & { x: number; y: number; flipAt: number; a: string; b: string; la: string; lb: string }> = ({ t, at, out, x, y, flipAt, a, b, la, lb }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const f = ei(t, flipAt, flipAt + 0.7);
  const page = (d: string, l: string, extra: React.CSSProperties) => <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", backfaceVisibility: "hidden", ...extra }}>
    <div style={{ background: CH.guinda, height: 90, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 54, color: CH.crema }}>{d}</div>
    <div style={{ background: "#f6ecd4", height: 250, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CH.tinta, textAlign: "center", padding: 10 }}>{l}</div></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, width: 380, height: 340, perspective: 1400 }}>
    {page(b, lb, { boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotateX(${f * 180}deg)`, transformStyle: "preserve-3d" }}>{page(a, la, {})}</div>
  </div>;
};
// tres sabores separados que de noche se juntan en uno
export const Sabores: React.FC<B & { x: number; y: number; joinAt: number }> = ({ t, at, out, x, y, joinAt }) => {
  const { o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const j = ei(t, joinAt, joinAt + 1.4), L = [["chile", "#8a1a0a"], ["especia", "#8a5a22"], ["chocolate", "#4a2414"]];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={900} height={460} viewBox="-450 -230 900 460">
      {L.map(([n, c], i) => { const a = -Math.PI / 2 + i * (Math.PI * 2 / 3), r = 210 * (1 - j); const k = Math.min(1.1, spr(t, at + i * 0.3, 1)); return <g key={i} transform={`translate(${Math.cos(a) * r} ${Math.sin(a) * r * 0.8}) scale(${k})`}><circle r={110 + 40 * j} fill={c} opacity={0.85 - 0.3 * j} /><text y={14} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill={CH.crema} opacity={1 - j}>{n}</text></g>; })}
      <text y={20} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={CH.maiz} opacity={j}>UN SOLO SABOR</text>
    </svg>
  </div>;
};
// refri: enfriar destapado máx 2 h, luego al refri
export const Refri: React.FC<B & { x: number; y: number; inAt: number }> = ({ t, at, out, x, y, inAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const d = ei(t, inAt, inAt + 0.6);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, display: "flex", gap: 40, alignItems: "center" }}>
    <div style={{ textAlign: "center", padding: "16px 24px", borderRadius: 18, background: DARK, boxShadow: ring() }}><H s={90} c={CH.maiz}>2 h</H><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CH.crema }}>máximo, destapado</div></div>
    <svg width={240} height={340} viewBox="0 0 120 170" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}><rect x={10} y={5} width={100} height={160} rx={12} fill="#e8edf0" /><line x1={10} y1={60} x2={110} y2={60} stroke="#aab" strokeWidth={3} /><rect x={92} y={20} width={6} height={28} rx={3} fill="#99a" /><rect x={92} y={74} width={6} height={40} rx={3} fill="#99a" />
      <g transform={`translate(${60 - 80 * (1 - d)} ${110}) scale(${0.5 + 0.5 * d})`} opacity={d}><ellipse rx={30} ry={10} fill="#8a3f20" /><path d="M -30 0 Q -30 18 0 18 Q 30 18 30 0" fill="#7a3518" /></g></svg>
  </div>;
};
// cuánto dura: refri una semana · congelador tres meses
export const Dura: React.FC<B & { x: number; y: number; bAt: number }> = ({ t, at, out, x, y, bAt }) => (
  <Card t={t} at={at} out={out} x={x} y={y} w={840}>
    {[["refrigerador", "1 semana", 0.25, at + 0.2, "#8fd6ff"], ["congelador", "3 meses", 1, bAt, "#d9f3ff"]].map(([l, v, w, a, c], i) => <div key={i} style={{ marginTop: i ? 18 : 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.crema }}>{l as string}</span><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: c as string, opacity: e(t, a as number, (a as number) + 0.3) }}>{v as string}</span></div>
      <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${(w as number) * 100 * e(t, a as number, (a as number) + 0.8)}%`, height: "100%", borderRadius: 15, background: c as string }} /></div></div>)}
  </Card>
);
// corona dibujada (te ves como una reina)
export const Corona: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), d = e(t, at, at + 1);
  if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}><g transform={`translate(${x} ${y + 12 * Math.sin(t * 2)}) rotate(-8)`}>
    <path d="M -120 60 L -140 -50 L -70 0 L 0 -80 L 70 0 L 140 -50 L 120 60 Z" fill={`rgba(242,193,78,${0.9 * d})`} stroke="#fff3c4" strokeWidth={8} strokeDasharray={1200} strokeDashoffset={1200 * (1 - d)} strokeLinejoin="round" />
    {[-140, 0, 140].map((cx, i) => <circle key={i} cx={cx} cy={i === 1 ? -80 : -50} r={14 * d} fill="#d8402c" />)}</g></svg>;
};

// ======================= variantes, problemas, dinero =======================
export const Carnes: React.FC<{ t: number; out: number; x: number; y: number; rows: { at: number; n: string; s: string }[] }> = ({ t, out, x, y, rows }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (o <= 0.01 || t < rows[0].at - 0.1) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 26 }}>
    {rows.map((r, i) => { const k = Math.min(1.1, spr(t, r.at, 1.1)); if (k <= 0.01) return null; return <div key={i} style={{ width: 320, padding: "20px 16px", borderRadius: 18, textAlign: "center", background: "linear-gradient(180deg,#f6ecd4,#e6d4ab)", boxShadow: "0 24px 50px rgba(0,0,0,.55)", transform: `translateY(${(1 - Math.min(1, k)) * 160}px) rotate(${(i - 1) * 3}deg)` }}>
      <H s={58} c={CH.guinda}>{r.n}</H><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CH.tinta }}>{r.s}</div></div>; })}
  </div>;
};
// el plato visto desde arriba: cada cosa en su lugar
export const PlatoMapa: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const s = (a: number) => Math.min(1, spr(t, at + a, 1.1));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})` }}>
    <svg width={760} height={520} viewBox="-380 -260 760 520" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <circle r={220} fill="#a3502a" /><circle r={180} fill="#94461f" />
      <g transform={`scale(${s(0.3)})`}><path d="M -150 -40 Q -60 -150 60 -120 Q 120 -60 40 20 Q -60 60 -150 -40 Z" fill="#2a0e06" />{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-90 + (i * 23) % 160} cy={-90 + (i * 17) % 90} rx={4} ry={2} fill="#f0dca8" />)}</g>
      <g transform={`translate(70 90) scale(${s(0.7)})`}><ellipse rx={95} ry={60} fill="#c8441e" />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-50 + (i * 29) % 100} cy={-20 + (i * 13) % 40} r={6} fill={i % 2 ? "#6ab04c" : "#f39c12"} />)}</g>
      <g transform={`translate(290 -120) scale(${s(1.1)})`}><path d="M -45 -30 L 45 -30 L 38 50 L -38 50 Z" fill="#8a3f20" /><ellipse cy={-30} rx={45} ry={10} fill="#3a1a10" /></g>
      <text x={-60} y={-170} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill={CH.crema} opacity={s(0.4)}>mole</text>
      <text x={70} y={190} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill={CH.crema} opacity={s(0.8)}>arroz</text>
      <text x={290} y={-170} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill={CH.crema} opacity={s(1.2)}>frijoles</text>
    </svg>
  </div>;
};
// diagnóstico: "fue uno de tres" con casillas
export const Diagnostico: React.FC<{ t: number; out: number; x: number; y: number; title: string; rows: { at: number; text: string }[] }> = ({ t, out, x, y, title, rows }) => (
  <Card t={t} at={rows[0].at - 0.4} out={out} x={x} y={y} w={760} bg="linear-gradient(180deg,#f6ecd4,#e6d4ab)" col={CH.guinda}>
    <H s={56} c={CH.guinda}>{title}</H>
    {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12 }}>
      <div style={{ width: 52, height: 52, border: `5px solid ${CH.tinta}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CH.guinda }}>{k > 0.5 ? "✓" : ""}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CH.tinta, opacity: 0.4 + 0.6 * k }}>{r.text}</div></div>; })}
  </Card>
);
// problema → arreglo
export const FixCard: React.FC<B & { x: number; y: number; prob: string; fix: string[]; fixAt: number }> = ({ t, at, out, x, y, prob, fix, fixAt }) => (
  <Card t={t} at={at} out={out} x={x} y={y} w={1000} from="down">
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ padding: "10px 24px", borderRadius: 14, background: "#d8402c", fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: "#fff", whiteSpace: "nowrap" }}>{prob}</div>
      <svg width={70} height={40} viewBox="0 0 70 40" style={{ opacity: e(t, fixAt, fixAt + 0.2) }}><path d="M 0 20 L 55 20" stroke={CH.maiz} strokeWidth={8} /><polygon points="50,6 70,20 50,34" fill={CH.maiz} /></svg>
      <div>{fix.map((f, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.crema, lineHeight: 1.05, opacity: e(t, fixAt + i * 0.5, fixAt + 0.3 + i * 0.5) }}>+ {f}</div>)}</div>
    </div>
  </Card>
);
// número que cuenta hacia arriba (pesos)
export const Cifra: React.FC<B & { x: number; y: number; to: number; pre?: string; post?: string; sub?: string; col?: string; size?: number }> = ({ t, at, out, x, y, to, pre = "$", post = "", sub, col = CH.maiz, size = 200 }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const v = Math.round(to * ei(t, at, at + 1.1));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, textShadow: extrude(10, "#3a1a08"), whiteSpace: "nowrap" }}>{pre}{v.toLocaleString("en-US")}{post}</div>
    {sub && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CH.crema, textShadow: "0 4px 14px rgba(0,0,0,.9)" }}>{sub}</div>}
  </div>;
};
// 4 platos de fonda = 20 platos en casa
export const Platos4v20: React.FC<B & { x: number; y: number; bAt: number }> = ({ t, at, out, x, y, bAt }) => {
  const pl = (n: number, a: number, c: string) => <div style={{ display: "grid", gridTemplateColumns: `repeat(${n > 4 ? 5 : 2}, 70px)`, gap: 10 }}>{Array.from({ length: n }, (_, i) => <svg key={i} width={70} height={46} viewBox="0 0 70 46" style={{ transform: `scale(${Math.min(1, spr(t, a + i * 0.05, 1.3))})` }}><ellipse cx={35} cy={26} rx={33} ry={17} fill={c} /><ellipse cx={35} cy={24} rx={20} ry={9} fill="#2a0e06" /></svg>)}</div>;
  return <Card t={t} at={at} out={out} x={x} y={y} pad="24px 40px">
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ textAlign: "center" }}>{pl(4, at + 0.2, "#ddd")}<div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema, marginTop: 8 }}>4 en la fonda</div></div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CH.maiz }}>=</div>
      <div style={{ textAlign: "center", opacity: e(t, bAt, bAt + 0.2) }}>{pl(20, bAt, "#a3502a")}<div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.maiz, marginTop: 8 }}>20 en tu casa</div></div>
    </div>
  </Card>;
};
// cambio: almendra → cacahuate
export const Cambio: React.FC<B & { x: number; y: number; swapAt: number }> = ({ t, at, out, x, y, swapAt }) => {
  const s = ei(t, swapAt, swapAt + 0.7);
  return <Card t={t} at={at} out={out} x={x} y={y} pad="20px 40px">
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ position: "relative", textAlign: "center", opacity: 1 - 0.6 * s }}><svg width={130} height={120} viewBox="0 0 100 100">{ICON.almendra("#b07a4a")}</svg><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.crema }}>almendra</div>
        <div style={{ position: "absolute", left: -10, top: 0 }}><DrawX t={t} at={swapAt} x={0} y={0} w={150} h={140} /></div></div>
      <svg width={90} height={40} viewBox="0 0 90 40"><path d="M 0 20 L 70 20" stroke={CH.maiz} strokeWidth={8} /><polygon points="66,6 90,20 66,34" fill={CH.maiz} /></svg>
      <div style={{ textAlign: "center", transform: `scale(${0.4 + 0.6 * s})`, opacity: s }}><svg width={130} height={120} viewBox="0 0 100 100">{ICON.cacahuate("#c0874a")}</svg><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.maiz }}>más cacahuate</div></div>
    </div>
  </Card>;
};

// ======================= cierre =======================
export const Tarea: React.FC<{ t: number; at: number; out: number; x: number; y: number; rows: { at: number; text: string }[] }> = ({ t, at, out, x, y, rows }) => (
  <Card t={t} at={at} out={out} x={x} y={y} w={860} bg="linear-gradient(180deg,#f6ecd4,#e6d4ab)" col={CH.guinda} rot={-2} from="up">
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, color: CH.guinda }}>Tarea de la semana</div>
    {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
      <div style={{ width: 56, height: 56, border: `5px solid ${CH.tinta}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#3a8a2a" }}>{k > 0.5 ? "✓" : ""}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.tinta }}>{r.text}</div></div>; })}
  </Card>
);
export const Encuesta: React.FC<B & { x: number; y: number; q: string; a: string; b: string; pa: number }> = ({ t, at, out, x, y, q, a, b, pa }) => {
  const g = e(t, at + 0.5, at + 2);
  return <Card t={t} at={at} out={out} x={x} y={y} w={900}>
    <H s={54} c={CH.maiz}>{q}</H>
    {pa < 0 ? <div style={{ display: "flex", gap: 24, marginTop: 18 }}>{[a, b].map((l, i) => <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRadius: 14, background: i ? "rgba(122,31,43,.9)" : "rgba(242,193,78,.85)", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: i ? CH.crema : CH.negro, transform: `scale(${Math.min(1, spr(t, at + 0.4 + i * 0.25, 1.2))})` }}>{l}</div>)}</div>
    : [[a, pa], [b, 100 - pa]].map(([l, p], i) => <div key={i} style={{ position: "relative", marginTop: 16, height: 74, borderRadius: 14, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, width: `${(p as number) * g}%`, background: i ? "rgba(122,31,43,.9)" : "rgba(242,193,78,.85)" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "8px 22px", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: i ? CH.crema : CH.negro }}><span>{l as string}</span><span>{Math.round((p as number) * g)}%</span></div></div>)}
    {pa < 0 && <div style={{ marginTop: 14, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CH.maiz }}>cuéntame en los comentarios</div>}
  </Card>;
};
export const Proximo: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k}) rotate(-2deg)`, width: 900, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.65)" }}>
    <div style={{ background: CH.guinda, padding: "14px 30px", fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CH.maiz, letterSpacing: 4 }}>EL PRÓXIMO VIDEO</div>
    <div style={{ background: "linear-gradient(135deg,#f6ecd4,#e6d4ab)", padding: "24px 30px", display: "flex", alignItems: "center", gap: 26 }}>
      <svg width={200} height={170} viewBox="0 0 120 100"><path d="M 6 30 Q 6 92 60 92 Q 114 92 114 30 Z" fill="#c8441e" /><ellipse cx={60} cy={30} rx={54} ry={12} fill="#a8201a" />{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={20 + (i * 11) % 80} cy={28 + (i % 3) * 2} r={5} fill="#f3ecd8" />)}<path d="M 30 22 q 6 -12 12 0 M 70 20 q 6 -12 12 0" stroke="#6ab04c" strokeWidth={4} fill="none" /></svg>
      <div><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: CH.guinda, lineHeight: 1 }}>9 ERRORES</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CH.tinta, lineHeight: 1 }}>que arruinan tu pozole</div></div>
    </div>
  </div>;
};
export const Fondo: React.FC<{ o: number }> = ({ o }) => o > 0.01 ? <AbsoluteFill style={{ background: `rgba(12,5,3,${o})` }} /> : null;
