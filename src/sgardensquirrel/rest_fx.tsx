// sgardensquirrel · piezas NUEVAS del minuto 2 al final (una o más por minuto), todas en el idioma de la casa: washi, sumi, bermellón, oro.
import React from "react";
import { Img, staticFile } from "remotion";
import { BRUSH, COL, FONT, P, e, ei, extrude, rnd, spr } from "./lib";
import { BrushStrike } from "./ink";

const vis = (t: number, at: number, out: number, fi = 0.15, fo = 0.3) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
const PAPER: React.CSSProperties = { background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", borderRadius: 4 };
const TORN = "polygon(0% 6%, 3% 0%, 12% 4%, 25% 0%, 41% 5%, 58% 1%, 74% 5%, 88% 0%, 100% 4%, 98% 52%, 100% 96%, 86% 100%, 70% 95%, 52% 100%, 33% 96%, 18% 100%, 4% 95%, 0% 100%, 2% 50%)";
const SH = "drop-shadow(0 6px 14px rgba(0,0,0,.75))";
const Abs: React.FC<{ x: number; y: number; o: number; children: React.ReactNode; tr?: string; z?: number }> = ({ x, y, o, children, tr = "", z }) =>
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr}`, zIndex: z }}>{children}</div>;
const reveal = (t: number, a: number, d = 0.6) => `inset(-20% ${100 - 100 * ei(t, a, a + d)}% -20% -5%)`;

// ---------- min 2 · la casa de 6 tatamis: los tatamis caen uno por uno y aparece la gente que siempre estaba ----------
export const TatamiPlan: React.FC<{ t: number; at: number; out: number; who: { at: number; text: string; u: number; v: number }[]; gardenAt: number; x?: number; y?: number }> = ({ t, at, out, who, gardenAt, x = 1340, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const U = 120, mats = [[0, 0, 2, 1], [2, 0, 2, 1], [0, 1, 1, 2], [1, 1, 2, 1], [1, 2, 2, 1], [3, 1, 1, 2]];
  const k0 = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o} tr={`perspective(1600px) rotateX(${38 - 6 * Math.min(1, k0)}deg) rotateZ(-8deg) scale(${0.7 + 0.3 * Math.min(1, k0)})`}>
    <div style={{ position: "relative", width: U * 4 + 30 + U * 1.6, height: U * 3 + 30 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: U * 4 + 30, height: U * 3 + 30, background: "#5a3d26", borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }} />
      {mats.map(([mx, my, w, h], i) => {
        const a = at + 0.25 + i * 0.16, k = spr(t, a, 1.2); if (t < a) return null;
        return <div key={i} style={{ position: "absolute", left: 15 + mx * U + 3, top: 15 + my * U + 3, width: w * U - 6, height: h * U - 6, background: "linear-gradient(135deg,#d9c78a,#c4b06e)", border: "5px solid #2d3a26", borderLeftWidth: w > h ? 5 : 2, borderRightWidth: w > h ? 5 : 2, transform: `translateY(${(1 - Math.min(1, k)) * -60}px)`, opacity: Math.min(1, k * 2) }} />;
      })}
      <div style={{ position: "absolute", left: U * 4 + 50, top: U * 0.9, width: U * 1.5, height: U * 1.1, background: "linear-gradient(135deg,#4f7a3a,#3a5e2a)", border: `4px dashed ${COL.cream}`, opacity: e(t, gardenAt, gardenAt + 0.3), borderRadius: 4 }}>
        <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: BRUSH, fontSize: 40, color: COL.cream, filter: SH }}>a bed sheet</div>
      </div>
      {who.map((w, i) => {
        const k = spr(t, w.at, 1.1); if (t < w.at) return null;
        return <div key={i} style={{ position: "absolute", left: 15 + w.u * U * 4, top: 15 + w.v * U * 3, transform: `translate(-50%,-50%) scale(${Math.min(1.1, k)})` }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: COL.red, border: `5px solid ${COL.cream}`, margin: "0 auto" }} />
          <div style={{ marginTop: 4, padding: "4px 12px", background: COL.cream, fontFamily: FONT, fontWeight: 800, fontSize: 24, whiteSpace: "nowrap", color: COL.ink, borderRadius: 3 }}>{w.text}</div>
        </div>;
      })}
    </div>
    <div style={{ textAlign: "center", marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 6, color: COL.cream, textShadow: extrude(4, "#000") }}>6 TATAMI MATS</div>
  </Abs>;
};

// ---------- min 2 · la balanza: sus palabras dejaban a la gente MÁS LIVIANA ----------
export const Balance: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 960, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const tip = (0.5 - ei(t, at + 0.6, at + 1.6)) * 2 * 0.22 + Math.sin(t * 2) * 0.01 * e(t, at + 1.6, at + 2);
  const L = 330, a = -tip; const lx = -L * Math.cos(a), ly = -L * Math.sin(a), rx = L * Math.cos(a), ry = L * Math.sin(a);
  const Pan = ({ px, py, label, col }: { px: number; py: number; label: string; col: string }) => <g transform={`translate(${px} ${py})`}>
    <line x1={0} y1={0} x2={-90} y2={130} stroke={COL.cream} strokeWidth={3} /><line x1={0} y1={0} x2={90} y2={130} stroke={COL.cream} strokeWidth={3} />
    <path d="M -120 130 Q 0 200 120 130 Z" fill={col} stroke={COL.cream} strokeWidth={4} />
    <text x={0} y={250} textAnchor="middle" fontFamily={BRUSH} fontSize={70} fill={COL.cream} style={{ filter: SH }}>{label}</text>
  </g>;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y - 140})`}>
      <rect x={-10} y={0} width={20} height={420} fill="#4a3220" /><rect x={-110} y={410} width={220} height={26} rx={8} fill="#4a3220" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#d9a441" strokeWidth={14} strokeLinecap="round" />
      <circle r={22} fill="#d9a441" />
      <Pan px={lx} py={ly} label="lighter" col={COL.gold} />
      <Pan px={rx} py={ry} label="heavier" col="#6b5a48" />
    </g>
    {t > at + 1.7 && <g transform={`translate(${x + rx} ${y - 140 + ry + 160})`}><BrushX t={t} at={at + 1.7} /></g>}
  </svg>;
};
const BrushX: React.FC<{ t: number; at: number; s?: number }> = ({ t, at, s = 1 }) => {
  const k1 = ei(t, at, at + 0.2), k2 = ei(t, at + 0.15, at + 0.35);
  return <g transform={`scale(${s})`}><line x1={-110} y1={-50} x2={-110 + 220 * k1} y2={-50 + 110 * k1} stroke={COL.red} strokeWidth={20} strokeLinecap="round" />
    {k2 > 0 && <line x1={110} y1={-50} x2={110 - 220 * k2} y2={-50 + 110 * k2} stroke={COL.red} strokeWidth={20} strokeLinecap="round" />}</g>;
};

// ---------- min 2 · "la oían desde la estación": la voz viaja de la casa a la estación de tren ----------
export const Distance: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 820 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const x0 = 330, x1 = 1590, g = ei(t, at + 0.2, at + 1.2);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      <path d={`M ${x0 - 70} ${y} l 70 -70 l 70 70 v 70 h -140 z`} fill={COL.cream} /><rect x={x0 - 20} y={y + 25} width={40} height={45} fill={COL.ink} />
      <line x1={x0 + 100} y1={y + 35} x2={x0 + 100 + (x1 - x0 - 230) * g} y2={y + 35} stroke={COL.cream} strokeWidth={6} strokeDasharray="22 16" />
      <g transform={`translate(${x1} ${y})`} opacity={e(t, at + 1.0, at + 1.3)}>
        <rect x={-110} y={-20} width={220} height={90} rx={6} fill={COL.indigo} /><rect x={-130} y={-40} width={260} height={24} fill={COL.ink} />
        <rect x={-90} y={0} width={50} height={40} fill={COL.cream} /><rect x={-25} y={0} width={50} height={40} fill={COL.cream} /><rect x={40} y={0} width={50} height={40} fill={COL.cream} />
        <text x={0} y={140} textAnchor="middle" fontFamily={BRUSH} fontSize={52} fill={COL.cream}>the train station</text>
      </g>
      {Array.from({ length: 5 }, (_, i) => { const ph = ((t - at) * 0.55 + i / 5) % 1; if (t < at + 0.4) return null; const px = x0 + 90 + ph * (x1 - x0 - 230);
        return <path key={i} d={`M ${px} ${y - 10} q 22 45 0 90`} fill="none" stroke={COL.red} strokeWidth={8} strokeLinecap="round" opacity={Math.sin(Math.PI * ph)} />; })}
    </g>
  </svg>;
};

// ---------- min 2 · las palabras son agua en un balde: el balde se vuelca y no se puede juntar ----------
export const Bucket: React.FC<{ t: number; at: number; tip: number; out: number; x?: number; y?: number }> = ({ t, at, tip, out, x = 1420, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9), r = ei(t, tip, tip + 0.6) * 78, sp = e(t, tip + 0.35, tip + 1.6);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y}) scale(${0.9 + 0.6 * Math.min(1, k)})`} style={{ filter: SH }}>
      {sp > 0 && <path d={`M 60 70 C ${140 + 200 * sp} ${80 + 40 * sp}, ${180 + 260 * sp} ${200 + 20 * sp}, ${-120 + 460 * sp} ${250}`} fill="none" stroke="#7fb2d6" strokeWidth={36 * (1 - 0.3 * sp)} strokeLinecap="round" opacity={0.9} />}
      {sp > 0 && Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={40 + rnd(i, 2) * 420 * sp} cy={250 + rnd(i, 3) * 30} rx={12 + rnd(i, 4) * 30} ry={6 + rnd(i, 5) * 8} fill="#7fb2d6" opacity={0.85 * sp} />)}
      <g transform={`rotate(${r} 60 60)`}>
        <path d="M -90 -60 L 90 -60 L 70 130 L -70 130 Z" fill="#b08657" stroke="#4a3220" strokeWidth={6} />
        {[-30, 30, 90].map((yy) => <line key={yy} x1={-85} y1={yy} x2={85} y2={yy} stroke="#2a2a2a" strokeWidth={8} />)}
        <ellipse cx={0} cy={-60} rx={90} ry={16} fill={r < 30 ? "#7fb2d6" : "#4a3220"} stroke="#4a3220" strokeWidth={5} />
        <path d="M -90 -60 Q 0 -190 90 -60" fill="none" stroke="#4a3220" strokeWidth={6} />
      </g>
      <text x={0} y={-150} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.cream}>words = water</text>
    </g>
  </svg>;
};

// ---------- cada número: LA FRASE QUE DEJÓ DE DECIR (tira de washi con comillas; el sumi la tacha) ----------
export const Said: React.FC<{ t: number; at: number; out: number; text: string; strike?: number; x?: number; y?: number; n?: number }> = ({ t, at, out, text, strike = 1e9, x = 960, y = 840, n }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9);
  return <>
    <Abs x={x} y={y} o={o} tr={`rotate(-1.5deg) scaleX(${0.75 + 0.25 * Math.min(1, k)})`}>
      <div style={{ ...PAPER, clipPath: TORN, padding: "18px 60px 30px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 7, color: COL.red }}>{n ? `NUMBER ${n} · ` : ""}SHE STOPPED SAYING</div>
        <div style={{ fontFamily: BRUSH, fontSize: 92, color: COL.ink, whiteSpace: "nowrap", clipPath: reveal(t, at + 0.1, 0.7) }}>“{text}”</div>
      </div>
    </Abs>
    <BrushStrike t={t} at={strike} out={out} x={x} y={y + 18} w={Math.min(1500, text.length * 44 + 120)} rot={-3} th={30} col={COL.red} />
  </>;
};

// ---------- cada número: EL CAMBIO (la vieja tachada arriba, la nueva escrita en bermellón abajo) ----------
export const Swap: React.FC<{ t: number; at: number; out: number; old: string; neu: string; neuAt: number; x?: number; y?: number }> = ({ t, at, out, old, neu, neuAt, x = 960, y = 760 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9), k2 = spr(t, neuAt, 0.9);
  return <>
    <Abs x={x} y={y} o={o} tr={`rotate(-1deg) scale(${0.85 + 0.15 * Math.min(1, k)})`}>
      <div style={{ ...PAPER, padding: "22px 64px 30px", textAlign: "center", borderTop: `12px solid ${COL.ink}` }}>
        <div style={{ fontFamily: BRUSH, fontSize: 66, color: "#7a6a58", whiteSpace: "nowrap", position: "relative" }}>“{old}”</div>
        <div style={{ height: 6, width: 120, background: COL.gold, margin: "10px auto", opacity: e(t, neuAt - 0.2, neuAt) }} />
        <div style={{ fontFamily: BRUSH, fontSize: 96, color: COL.red, whiteSpace: "nowrap", clipPath: reveal(t, neuAt, 0.8), transform: `scale(${0.9 + 0.1 * Math.min(1, k2)})` }}>“{neu}”</div>
      </div>
    </Abs>
    <BrushStrike t={t} at={at + 0.5} out={out} x={x} y={y - 52} w={Math.min(1400, old.length * 32 + 80)} rot={-2} th={18} col={COL.ink} />
  </>;
};

// ---------- números de pincel que CUENTAN (31 años, 50 veces...) ----------
export const Counter: React.FC<{ t: number; at: number; out: number; from?: number; to: number; dur?: number; label?: string; x?: number; y?: number; size?: number; col?: string; pre?: string }> = ({ t, at, out, from = 0, to, dur = 1.4, label, x = 960, y = 470, size = 300, col = COL.cream, pre = "" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const v = Math.round(from + (to - from) * ei(t, at, at + dur)), k = spr(t, at + dur, 1.2);
  return <Abs x={x} y={y} o={o}>
    <div style={{ textAlign: "center", transform: `scale(${1 + 0.08 * Math.max(0, 1 - Math.abs(1 - k)) * (t > at + dur ? 1 : 0)})` }}>
      <div style={{ fontFamily: BRUSH, fontSize: size, lineHeight: 0.95, color: col, textShadow: extrude(7, "#2a2018") + ", 0 30px 60px rgba(0,0,0,.6)" }}>{pre}{v}</div>
      {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.17, letterSpacing: 8, color: COL.cream, textShadow: extrude(3, "#000") }}>{label}</div>}
    </div>
  </Abs>;
};

// ---------- min 3 · "como si un gato hubiera caminado por la tinta": huellas de tinta cruzando ----------
export const Paws: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 760 }) => {
  const o = vis(t, at, out, 0.1, 0.4); if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    {Array.from({ length: 12 }, (_, i) => {
      const a = at + i * 0.17; if (t < a) return null;
      const px = 120 + i * 150, py = y + (i % 2 ? -45 : 45) - i * 18, k = Math.min(1, spr(t, a, 1.5));
      return <g key={i} transform={`translate(${px} ${py}) rotate(${-12 + rnd(i, 1) * 10}) scale(${k})`} fill={COL.ink} opacity={0.9}>
        <ellipse cx={0} cy={14} rx={22} ry={18} />{[-22, -8, 8, 22].map((dx, j) => <ellipse key={j} cx={dx} cy={-14 - (Math.abs(dx) < 10 ? 8 : 0)} rx={8} ry={10} />)}
      </g>;
    })}
  </svg>;
};

// ---------- min 4 · "primero la agujita, después el hola" ----------
export const Needle: React.FC<{ t: number; at: number; hello: number; out: number; x?: number; y?: number }> = ({ t, at, hello, out, x = 1300, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = ei(t, at, at + 0.5), pr = e(t, at + 0.45, at + 0.6), hk = spr(t, hello, 1);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y})`} style={{ filter: SH }}>
      <ellipse cx={0} cy={0} rx={250} ry={140} fill={COL.cream} /><path d="M -60 120 L -120 210 L 10 132 Z" fill={COL.cream} />
      <text x={0} y={30} textAnchor="middle" fontFamily={BRUSH} fontSize={110} fill={COL.ink} opacity={e(t, hello, hello + 0.2)} transform={`scale(${Math.min(1.08, hk)})`}>hello</text>
      <g transform={`translate(${-560 + 330 * n} ${-40 + 20 * n}) rotate(8)`}><line x1={-260} y1={0} x2={0} y2={0} stroke="#cfd3d6" strokeWidth={9} strokeLinecap="round" /><ellipse cx={-235} cy={0} rx={14} ry={5} fill="none" stroke="#7a7f84" strokeWidth={3} /><line x1={-300} y1={0} x2={-235} y2={0} stroke={COL.red} strokeWidth={4} /></g>
      {pr > 0 && <circle cx={-232} cy={-20} r={12 + 30 * pr} fill="none" stroke={COL.red} strokeWidth={8 * (1 - pr) + 2} />}
      <text x={-240} y={-180} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.cream} opacity={pr}>the needle first…</text>
    </g>
  </svg>;
};

// ---------- min 4 · el orden de su regla: 1 feliz, 2 enojada (después) ----------
export const Order: React.FC<{ t: number; out: number; items: { at: number; n: string; text: string; dim?: boolean }[]; x?: number; y?: number }> = ({ t, out, items, x = 1380, y = 520 }) => {
  const o = vis(t, items[0].at, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    {items.map((it, i) => { const k = spr(t, it.at, 1); if (t < it.at) return null;
      return <div key={i} style={{ ...PAPER, display: "flex", alignItems: "center", gap: 24, padding: "14px 40px 18px 18px", marginBottom: 26, transform: `translateX(${(1 - Math.min(1, k)) * 200}px) rotate(${i ? 2 : -2}deg)`, opacity: it.dim ? 0.82 : 1 }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: it.dim ? "#7a6a58" : COL.red, color: COL.cream, fontFamily: BRUSH, fontSize: 70, textAlign: "center", lineHeight: "92px" }}>{it.n}</div>
        <div style={{ fontFamily: BRUSH, fontSize: it.dim ? 64 : 90, color: it.dim ? "#7a6a58" : COL.ink, whiteSpace: "nowrap" }}>{it.text}</div>
      </div>; })}
  </Abs>;
};

// ---------- min 5 · "la llamábamos más": barras de llamadas que suben ----------
export const CallsUp: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1360, y = 760 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const H = [40, 52, 46, 70, 95, 130, 170, 215, 260];
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x - 300} ${y})`} style={{ filter: SH }}>
      <line x1={-20} y1={0} x2={640} y2={0} stroke={COL.cream} strokeWidth={5} />
      {H.map((h, i) => { const k = ei(t, at + 0.2 + i * 0.12, at + 0.6 + i * 0.12); return <rect key={i} x={i * 70} y={-h * k * 1.3} width={48} height={h * k * 1.3} rx={4} fill={i > 3 ? COL.red : "#7a6a58"} />; })}
      <path d={`M 20 -60 Q 300 -120 ${600} -360`} fill="none" stroke={COL.gold} strokeWidth={8} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - ei(t, at + 0.8, at + 1.8))} />
      <text x={300} y={70} textAnchor="middle" fontFamily={BRUSH} fontSize={60} fill={COL.cream}>we called her more</text>
    </g>
  </svg>;
};

// ---------- min 5 · 20 años de domingos a las 7: 1040 puntitos que se llenan ----------
export const SundayGrid: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1340, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const n = Math.floor(1040 * ei(t, at + 0.3, at + 3.2)), C = 52, cs = 11;
  return <Abs x={x} y={y} o={o} tr={`rotate(-2deg) scale(${0.85 + 0.15 * Math.min(1, spr(t, at, 0.8))})`}>
    <div style={{ ...PAPER, padding: "22px 30px 26px", borderTop: `14px solid ${COL.indigo}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: COL.indigo, marginBottom: 12 }}>EVERY SUNDAY · 7:00 PM</div>
      <svg width={C * cs} height={20 * cs}>{Array.from({ length: 1040 }, (_, i) => <circle key={i} cx={(i % C) * cs + cs / 2} cy={Math.floor(i / C) * cs + cs / 2} r={4} fill={i < n ? COL.red : "#ddd0b6"} />)}</svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BRUSH, fontSize: 50, color: COL.ink, marginTop: 8 }}><span>20 years</span><span style={{ color: COL.red }}>{n} calls</span></div>
    </div>
  </Abs>;
};

// ---------- min 6 · los SÍ que se apilan (y la pila tambalea) ----------
export const YesPile: React.FC<{ t: number; out: number; items: { at: number; text: string }[]; x?: number; y?: number }> = ({ t, out, items, x = 1380, y = 880 }) => {
  const o = vis(t, items[0].at, out); if (o <= 0.01) return null;
  const nOn = items.filter((it) => t >= it.at).length, wob = Math.sin(t * 3.2) * (nOn - 1) * 1.1;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `rotate(${wob}deg)`, transformOrigin: "50% 100%" }}>
    {items.map((it, i) => { const k = spr(t, it.at, 1.1); if (t < it.at) return null;
      return <div key={i} style={{ position: "absolute", left: 0, top: -110 * (i + 1), transform: `translate(-50%, ${(1 - Math.min(1, k)) * -500}px) rotate(${(rnd(i, 3) - 0.5) * 7}deg)`, ...PAPER, padding: "12px 34px 16px", whiteSpace: "nowrap", borderLeft: `12px solid ${COL.red}` }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.red, marginRight: 16 }}>YES,</span><span style={{ fontFamily: BRUSH, fontSize: 56, color: COL.ink }}>{it.text}</span>
      </div>; })}
  </div>;
};

// ---------- min 6 · el NO amable: el sello duro se envuelve en un furoshiki ----------
export const KindNo: React.FC<{ t: number; at: number; wrap: number; out: number; x?: number; y?: number }> = ({ t, at, wrap, out, x = 1360, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 1.1), w = ei(t, wrap, wrap + 0.8);
  return <Abs x={x} y={y} o={o} tr={`scale(${2 - Math.min(1, k)}) rotate(-6deg)`}>
    <div style={{ position: "relative", width: 460, height: 300 }}>
      <div style={{ position: "absolute", inset: 0, border: `14px solid ${COL.red}`, borderRadius: 14, background: COL.cream, fontFamily: FONT, fontWeight: 800, fontSize: 200, color: COL.red, textAlign: "center", lineHeight: "270px", opacity: 1 - w }}>NO</div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: i % 2 ? "50%" : "-12%", top: i < 2 ? "-16%" : "52%", width: "62%", height: "64%", background: "linear-gradient(135deg,#2b3f63,#3b5585)", opacity: 0.94, clipPath: ["polygon(0 0,100% 0,0 100%)", "polygon(0 0,100% 0,100% 100%)", "polygon(0 0,0 100%,100% 100%)", "polygon(100% 0,100% 100%,0 100%)"][i], transform: `scale(${w})`, transformOrigin: ["0 0", "100% 0", "0 100%", "100% 100%"][i] }} />)}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) scale(${w})`, fontFamily: BRUSH, fontSize: 92, color: COL.cream, whiteSpace: "nowrap" }}>kindly</div>
    </div>
  </Abs>;
};

// ---------- min 6 · sus tres frases listas, en tiras tanzaku que cuelgan ----------
export const Tanzaku: React.FC<{ t: number; out: number; items: { at: number; text: string; sub: string }[]; x?: number; y?: number }> = ({ t, out, items, x = 1250, y = 140 }) => {
  const o = vis(t, items[0].at, out); if (o <= 0.01) return null;
  const cols = [COL.indigo, COL.red, "#3b7a57"];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 34 }}>
    {items.map((it, i) => { const k = spr(t, it.at, 1), sw = Math.sin((t - it.at) * 3) * 6 * Math.exp(-(t - it.at) * 0.9); if (t < it.at) return <div key={i} style={{ width: 170 }} />;
      return <div key={i} style={{ width: 170, transformOrigin: "50% -60px", transform: `translateY(${(1 - Math.min(1, k)) * -700}px) rotate(${sw}deg)` }}>
        <div style={{ width: 4, height: 60, background: COL.red, margin: "0 auto" }} />
        <div style={{ height: 600, background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, borderTop: `14px solid ${cols[i]}`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: BRUSH, fontSize: 80, color: cols[i] }}>{i + 1}</div>
          <div style={{ fontFamily: BRUSH, fontSize: 46, lineHeight: 1.1, color: COL.ink, textAlign: "center", marginTop: 10 }}>{it.text}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: "#7a6a58", textAlign: "center", marginTop: "auto" }}>{it.sub}</div>
        </div>
      </div>; })}
  </div>;
};

// ---------- min 7 · un perdón es amable; dos perdones... ----------
export const Sorry2: React.FC<{ t: number; at: number; at2: number; out: number; x?: number; y?: number }> = ({ t, at, at2, out, x = 960, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const Slip = ({ a, stamp, good }: { a: number; stamp: string; good: boolean }) => { const k = spr(t, a, 1); if (t < a) return <div style={{ width: 520 }} />;
    return <div style={{ position: "relative", width: 520, transform: `translateY(${(1 - Math.min(1, k)) * 300}px) rotate(${good ? -3 : 3}deg)` }}>
      <div style={{ ...PAPER, padding: "26px 0 34px", textAlign: "center", fontFamily: BRUSH, fontSize: 120, color: COL.ink }}>sorry</div>
      <div style={{ position: "absolute", left: "50%", top: "100%", transform: `translate(-50%,-30%) rotate(${good ? -8 : 8}deg) scale(${2 - Math.min(1, spr(t, a + 0.6, 1.2))})`, opacity: e(t, a + 0.6, a + 0.65), border: `8px solid ${good ? "#3b7a57" : COL.red}`, color: good ? "#3b7a57" : COL.red, background: COL.cream, padding: "6px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 44, whiteSpace: "nowrap", borderRadius: 8 }}>{stamp}</div>
    </div>; };
  return <Abs x={x} y={y} o={o}><div style={{ display: "flex", gap: 120 }}><Slip a={at} stamp="KIND" good /><Slip a={at2} stamp="TOO MUCH" good={false} /></div></Abs>;
};

// ---------- min 7 · "se sacaban una bolsa pesada de la espalda" ----------
export const BagOff: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1400, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const up = ei(t, at + 0.6, at + 2.2);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y - 420 * up}) rotate(${-8 + 16 * up})`} style={{ filter: SH }}>
      <path d="M -150 -40 Q -170 160 0 170 Q 170 160 150 -40 Q 0 -70 -150 -40 Z" fill="#6b4a2e" stroke="#2a1f17" strokeWidth={6} />
      <path d="M -60 -55 Q 0 -150 60 -55" fill="none" stroke="#2a1f17" strokeWidth={14} /><text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill={COL.cream}>10 kg</text>
      {up > 0.05 && [-110, 0, 110].map((dx) => <line key={dx} x1={dx} y1={200} x2={dx} y2={200 + 160 * up} stroke={COL.cream} strokeWidth={6} strokeLinecap="round" opacity={0.7} />)}
    </g>
    <text x={x} y={y + 300} textAnchor="middle" fontFamily={BRUSH} fontSize={88} fill={COL.cream} opacity={e(t, at + 1.4, at + 1.8)} style={{ filter: SH }}>lighter.</text>
  </svg>;
};

// ---------- min 7 · los perdones que llueven (cada uno con su motivo) ----------
export const SorryFall: React.FC<{ t: number; out: number; items: { at: number; text: string }[] }> = ({ t, out, items }) => {
  const o = vis(t, items[0].at, out); if (o <= 0.01) return null;
  const pos = [[1300, 300], [1500, 520], [1260, 700], [1560, 860]];
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    {items.map((it, i) => { const k = spr(t, it.at, 1); if (t < it.at) return null; const [px, py] = pos[i % 4];
      return <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -500}px) rotate(${(rnd(i, 9) - 0.5) * 14}deg)`, ...PAPER, padding: "10px 30px 14px", whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: BRUSH, fontSize: 70, color: COL.red }}>Sorry </span><span style={{ fontFamily: BRUSH, fontSize: 52, color: COL.ink }}>{it.text}</span>
      </div>; })}
  </div>;
};

// ---------- min 7 · sumimasen: una palabra, tres sentidos ----------
export const WordFan: React.FC<{ t: number; at: number; out: number; word: string; means: { at: number; text: string }[]; x?: number; y?: number }> = ({ t, at, out, word, means, x = 960, y = 360 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      <text x={x} y={y} textAnchor="middle" fontFamily={BRUSH} fontSize={180} fill={COL.cream} transform={`translate(${x} ${y}) scale(${Math.min(1.05, k)}) translate(${-x} ${-y})`}>{word}</text>
      {means.map((m, i) => { const a = e(t, m.at, m.at + 0.35); if (a <= 0) return null; const tx = x + (i - 1) * 520, ty = y + 300;
        return <g key={i} opacity={a}><line x1={x + (i - 1) * 120} y1={y + 50} x2={x + (i - 1) * 120 + (tx - x - (i - 1) * 120) * a} y2={y + 50 + 170 * a} stroke={COL.gold} strokeWidth={7} strokeLinecap="round" />
          <rect x={tx - 210} y={ty - 60} width={420} height={110} rx={8} fill={COL.cream} /><text x={tx} y={ty + 18} textAnchor="middle" fontFamily={BRUSH} fontSize={66} fill={i === 0 ? COL.red : COL.ink}>{m.text}</text></g>; })}
    </g>
  </svg>;
};

// ---------- min 7 · 50 veces por día: palotes de tinta ----------
export const Tally: React.FC<{ t: number; at: number; out: number; n?: number; x?: number; y?: number; label?: string }> = ({ t, at, out, n = 50, x = 1300, y = 300, label = "50 times a day" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const shown = Math.floor(n * ei(t, at + 0.2, at + 2.4));
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x - 400} ${y})`} style={{ filter: SH }}>
      <rect x={-40} y={-60} width={880} height={520} rx={8} fill={COL.cream} opacity={0.94} />
      {Array.from({ length: shown }, (_, i) => { const g = Math.floor(i / 5), j = i % 5, gx = (g % 5) * 165, gy = Math.floor(g / 5) * 190;
        return j < 4 ? <line key={i} x1={gx + j * 26} y1={gy} x2={gx + j * 26 + 3} y2={gy + 120} stroke={COL.ink} strokeWidth={10} strokeLinecap="round" /> : <line key={i} x1={gx - 14} y1={gy + 100} x2={gx + 104} y2={gy + 18} stroke={COL.red} strokeWidth={10} strokeLinecap="round" />; })}
      <text x={400} y={430} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.red}>{label}</text>
    </g>
  </svg>;
};

// ---------- min 7-8 · "te hacés más chiquita": la silueta se achica hasta desaparecer ----------
export const Shrink: React.FC<{ t: number; at: number; gone: number; out: number; x?: number; y?: number }> = ({ t, at, gone, out, x = 1420, y = 820 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const steps = Math.floor((t - at) / 0.9), s0 = Math.max(0.05, 1 - 0.18 * Math.max(0, steps)) * (1 - e(t, gone, gone + 0.8)), sc = s0 + 0.04 * Math.sin(t * 8) * (t < gone ? 1 : 0);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <ellipse cx={x} cy={y + 6} rx={150} ry={20} fill="rgba(0,0,0,.35)" />
    <g transform={`translate(${x} ${y}) scale(${Math.max(0.001, sc)})`} style={{ filter: SH }}>
      <circle cx={0} cy={-420} r={70} fill={COL.ink} /><path d="M -60 -350 Q -150 -150 -130 0 L 130 0 Q 150 -150 60 -350 Z" fill={COL.ink} />
      {[0, 1, 2].map((i) => <text key={i} x={-230 + i * 230} y={-560 - i * 30} textAnchor="middle" fontFamily={BRUSH} fontSize={60} fill={COL.red} opacity={e(t, at + i * 0.9, at + i * 0.9 + 0.2)}>sorry</text>)}
    </g>
    <text x={x} y={y + 110} textAnchor="middle" fontFamily={BRUSH} fontSize={72} fill={COL.cream} opacity={e(t, gone, gone + 0.4)} style={{ filter: SH }}>nobody will see you</text>
  </svg>;
};

// ---------- min 8 · el mismo momento, dos caminos ----------
export const TwoWays: React.FC<{ t: number; at: number; at2: number; out: number; y?: number }> = ({ t, at, at2, out, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k1 = ei(t, at + 0.2, at + 0.9), k2 = ei(t, at2, at2 + 0.8);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      <circle cx={960} cy={y} r={70} fill={COL.gold} /><text x={960} y={y - 100} textAnchor="middle" fontFamily={BRUSH} fontSize={56} fill={COL.cream}>the same moment</text>
      <path d={`M 890 ${y} L ${890 - 420 * k1} ${y + 120 * k1}`} stroke="#7a6a58" strokeWidth={16} strokeLinecap="round" />
      <path d={`M 1030 ${y} L ${1030 + 420 * k2} ${y + 120 * k2}`} stroke={COL.red} strokeWidth={16} strokeLinecap="round" />
      <g opacity={k1}><rect x={250} y={y + 130} width={460} height={130} rx={8} fill={COL.cream} /><text x={480} y={y + 210} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill="#7a6a58">“sorry” · smaller</text></g>
      <g opacity={k2}><rect x={1210} y={y + 130} width={460} height={130} rx={8} fill={COL.cream} /><text x={1440} y={y + 210} textAnchor="middle" fontFamily={BRUSH} fontSize={60} fill={COL.red}>“thank you” · warm</text></g>
    </g>
  </svg>;
};

// ---------- min 8 · "como un gato que te sigue a todos lados": el gato de sumi camina detrás de las frases ----------
export const CatWalk: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 950 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const x = -200 + (t - at) * 260, st = Math.sin((t - at) * 9);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y})`} fill={COL.ink} style={{ filter: "drop-shadow(0 4px 8px rgba(251,246,234,.6))" }}>
      <ellipse cx={0} cy={-60} rx={110} ry={46} /><circle cx={110} cy={-110} r={42} /><path d="M 85 -145 L 92 -185 L 112 -150 Z M 118 -150 L 140 -184 L 142 -140 Z" />
      <path d={`M -100 -70 Q -200 ${-160 + 20 * st} -160 -230`} fill="none" stroke={COL.ink} strokeWidth={16} strokeLinecap="round" />
      {[-70, -30, 40, 80].map((lx, i) => <rect key={i} x={lx + (i % 2 ? st : -st) * 12} y={-30} width={16} height={60} rx={8} />)}
    </g>
  </svg>;
};

// ---------- min 8 · etiqueta de precio ----------
export const PriceTag: React.FC<{ t: number; at: number; out: number; top: string; big: string; x?: number; y?: number }> = ({ t, at, out, top, big, x = 1420, y = 420 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 1), sw = Math.sin((t - at) * 4) * 8 * Math.exp(-(t - at));
  return <Abs x={x} y={y} o={o} tr={`rotate(${-10 + sw}deg) scale(${Math.min(1.05, k)})`}>
    <div style={{ position: "relative", padding: "30px 60px 34px 90px", background: COL.cream, clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", textAlign: "center" }}>
      <div style={{ position: "absolute", left: 40, top: "50%", width: 26, height: 26, borderRadius: 13, background: COL.ink, transform: "translateY(-50%)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: "#7a6a58" }}>{top}</div>
      <div style={{ fontFamily: BRUSH, fontSize: 150, color: COL.red, lineHeight: 1 }}>{big}</div>
    </div>
  </Abs>;
};

// ---------- min 8 · la canción de los nietos: "in my day ♪" en notas ----------
export const Song: React.FC<{ t: number; at: number; out: number; text: string; x?: number; y?: number }> = ({ t, at, out, text, x = 1380, y = 400 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={x - 420} y1={y + i * 26} x2={x + 420} y2={y + i * 26 + Math.sin(t * 2 + i) * 6} stroke={COL.cream} strokeWidth={3} opacity={0.8} />)}
      {Array.from({ length: 7 }, (_, i) => { const a = at + i * 0.32; if (t < a) return null; const ph = (t - a); const nx = x - 380 + i * 125, ny = y + 90 - (i % 3) * 30 - ph * 40;
        return <g key={i} transform={`translate(${nx} ${ny})`} opacity={Math.max(0, 1 - ph * 0.25)}><ellipse cx={0} cy={0} rx={22} ry={16} fill={i % 2 ? COL.red : COL.cream} transform="rotate(-20)" /><line x1={20} y1={-4} x2={20} y2={-90} stroke={i % 2 ? COL.red : COL.cream} strokeWidth={6} /></g>; })}
      <text x={x} y={y + 220} textAnchor="middle" fontFamily={BRUSH} fontSize={80} fill={COL.cream}>{text}</text>
    </g>
  </svg>;
};

// ---------- min 8 · la queja se vuelve REGALO (la hoja gris se envuelve en furoshiki con moño) ----------
export const Gift: React.FC<{ t: number; at: number; wrap: number; out: number; x?: number; y?: number }> = ({ t, at, wrap, out, x = 1420, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const w = ei(t, wrap, wrap + 0.9), k = spr(t, at, 1);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y}) scale(${Math.min(1, k)})`} style={{ filter: SH }}>
      <g opacity={1 - w}><rect x={-170} y={-120} width={340} height={240} fill="#9a9488" transform="rotate(-4)" />{[-60, -10, 40].map((yy) => <line key={yy} x1={-130} y1={yy} x2={130} y2={yy} stroke="#5f5a52" strokeWidth={8} />)}
        <text x={0} y={180} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.cream}>a complaint</text></g>
      <g opacity={w} transform={`scale(${0.6 + 0.4 * w})`}>
        <rect x={-170} y={-130} width={340} height={260} rx={30} fill={COL.red} /><path d="M -170 0 L 170 0 M 0 -130 L 0 130" stroke={COL.gold} strokeWidth={18} />
        <path d="M 0 -130 C -90 -250 -150 -150 0 -130 C 90 -250 150 -150 0 -130" fill={COL.gold} />
        <text x={0} y={210} textAnchor="middle" fontFamily={BRUSH} fontSize={80} fill={COL.cream}>a gift</text></g>
    </g>
  </svg>;
};

// ---------- min 8 · "a la mitad": los 9 ema en una barra de avance ----------
export const Halfway: React.FC<{ t: number; at: number; out: number; done: number; y?: number }> = ({ t, at, out, done, y = 930 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = ei(t, at + 0.2, at + 1.0) * (done / 9);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      <line x1={260} y1={y} x2={1660} y2={y} stroke="rgba(251,246,234,.5)" strokeWidth={10} strokeLinecap="round" />
      <line x1={260} y1={y} x2={260 + 1400 * g} y2={y} stroke={COL.red} strokeWidth={14} strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => { const px = 260 + 1400 * (i + 0.5) / 9, on = (i + 0.5) / 9 <= g; return <g key={i}><circle cx={px} cy={y} r={34} fill={on ? COL.red : COL.cream} /><text x={px} y={y + 16} textAnchor="middle" fontFamily={BRUSH} fontSize={44} fill={on ? COL.cream : COL.ink}>{i + 1}</text></g>; })}
      <text x={960} y={y - 70} textAnchor="middle" fontFamily={BRUSH} fontSize={76} fill={COL.cream} opacity={e(t, at + 0.9, at + 1.2)}>halfway</text>
    </g>
  </svg>;
};

// ---------- min 9 / 13 · LA PALABRA JAPONESA de su casa (romaji grande + lo que significa) ----------
export const WordCard: React.FC<{ t: number; at: number; mean: number; out: number; word: string; en: string; x?: number; y?: number }> = ({ t, at, mean, out, word, en, x = 960, y = 420 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8), m = e(t, mean, mean + 0.4);
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotateX(${(1 - Math.min(1, k)) * 60}deg)`}>
    <div style={{ ...PAPER, padding: "26px 80px 34px", textAlign: "center", borderTop: `16px solid ${COL.red}`, borderBottom: `16px solid ${COL.red}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 8, color: "#7a6a58" }}>A WORD FROM HER HOUSE</div>
      <div style={{ fontFamily: BRUSH, fontSize: 150, color: COL.ink, whiteSpace: "nowrap", clipPath: reveal(t, at + 0.15, 0.9) }}>{word}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: COL.red, opacity: m, transform: `translateY(${(1 - m) * 20}px)`, whiteSpace: "nowrap" }}>{en}</div>
    </div>
  </Abs>;
};

// ---------- min 9 · el botón de suscribirse en washi, con el sello rojo que lo marca ----------
export const Subscribe: React.FC<{ t: number; at: number; press: number; out: number; x?: number; y?: number }> = ({ t, at, press, out, x = 1400, y = 800 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 1), p = e(t, press, press + 0.15), done = t >= press + 0.15;
  return <Abs x={x} y={y} o={o} tr={`scale(${Math.min(1.04, k) * (1 - 0.06 * p * (1 - e(t, press + 0.15, press + 0.3)))})`}>
    <div style={{ position: "relative", padding: "24px 64px 28px", borderRadius: 12, background: done ? "#7a6a58" : COL.red, boxShadow: "0 24px 50px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 800, fontSize: 60, letterSpacing: 6, color: COL.cream }}>
      {done ? "SUBSCRIBED" : "SUBSCRIBE"}
      <div style={{ position: "absolute", right: -70, top: -60, width: 130, height: 130, borderRadius: 65, border: `8px solid ${COL.red}`, background: COL.cream, color: COL.red, fontFamily: BRUSH, fontSize: 40, lineHeight: "114px", textAlign: "center", opacity: e(t, press + 0.2, press + 0.25), transform: `rotate(-12deg) scale(${2 - Math.min(1, spr(t, press + 0.2, 1.3))})` }}>thank you</div>
    </div>
  </Abs>;
};

// ---------- min 10 · 30 años en el armario: los años pasan como hojas de almanaque ----------
export const YearFlip: React.FC<{ t: number; at: number; out: number; from: number; to: number; label: string; x?: number; y?: number }> = ({ t, at, out, from, to, label, x = 1440, y = 440 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const v = Math.round(from + (to - from) * ei(t, at + 0.2, at + 2.6)), fl = ((t - at) * 8) % 1;
  return <Abs x={x} y={y} o={o} tr="rotate(3deg)">
    <div style={{ width: 380, ...PAPER, borderTop: `40px solid ${COL.red}`, textAlign: "center", padding: "10px 0 20px", position: "relative" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, color: COL.ink, transform: v < to ? `rotateX(${fl * 60}deg)` : undefined }}>{v}</div>
      <div style={{ fontFamily: BRUSH, fontSize: 50, color: COL.red }}>{label}</div>
    </div>
  </Abs>;
};

// ---------- min 10 · un invierno: nieve de tinta blanca ----------
export const Snow: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = vis(t, at, out, 0.6, 0.6); if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
    {Array.from({ length: 90 }, (_, i) => { const sp = 40 + rnd(i, 1) * 70, y = ((rnd(i, 2) * 1180 + (t - at) * sp) % 1180) - 50, x = rnd(i, 3) * 1920 + Math.sin(t * 0.8 + i) * 20;
      return <circle key={i} cx={x} cy={y} r={2 + rnd(i, 4) * 6} fill="#ffffff" opacity={0.55 + rnd(i, 5) * 0.4} />; })}
  </svg>;
};

// ---------- min 10 · "cada día que me despierto es el día especial": todos los días se marcan ----------
export const EveryDay: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1400, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8), cell = 70;
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotateY(-12deg) translateZ(${(1 - Math.min(1, k)) * -600}px)`}>
    <div style={{ ...PAPER, padding: "20px 26px 26px", borderTop: `16px solid ${COL.gold}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: COL.ink, marginBottom: 10, textAlign: "center" }}>SPECIAL DAYS</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 4 }}>
        {Array.from({ length: 28 }, (_, i) => { const a = at + 0.6 + i * 0.07, c = ei(t, a, a + 0.25);
          return <div key={i} style={{ width: cell, height: cell, background: "#efe6d2", position: "relative", fontFamily: FONT, fontWeight: 600, fontSize: 26, color: "#6b5a48", textAlign: "center", lineHeight: `${cell}px` }}>{i + 1}
            <svg width={cell} height={cell} style={{ position: "absolute", inset: 0 }}><circle cx={cell / 2} cy={cell / 2} r={28} fill="none" stroke={COL.red} strokeWidth={5} strokeDasharray={176} strokeDashoffset={176 * (1 - c)} transform={`rotate(-90 ${cell / 2} ${cell / 2})`} /></svg></div>; })}
      </div>
    </div>
  </Abs>;
};

// ---------- min 10-11 · lista de HOY (cada ítem se tilda con pincel) ----------
export const CheckList: React.FC<{ t: number; out: number; title: string; items: { at: number; text: string }[]; x?: number; y?: number; col?: string }> = ({ t, out, title, items, x = 1380, y = 500, col = COL.red }) => {
  const o = vis(t, items[0].at - 0.3, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o} tr="rotate(-2deg)">
    <div style={{ ...PAPER, padding: "26px 46px 30px", minWidth: 640, borderLeft: `14px solid ${col}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: col, marginBottom: 10 }}>{title}</div>
      {items.map((it, i) => { const k = e(t, it.at, it.at + 0.3), c = ei(t, it.at + 0.2, it.at + 0.45);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.25 + 0.75 * k, margin: "6px 0" }}>
          <svg width={54} height={54}><rect x={4} y={4} width={46} height={46} rx={6} fill="none" stroke={COL.ink} strokeWidth={4} /><path d="M 12 28 L 24 42 L 50 6" fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - c)} /></svg>
          <div style={{ fontFamily: BRUSH, fontSize: 58, color: COL.ink, whiteSpace: "nowrap" }}>{it.text}</div>
        </div>; })}
    </div>
  </Abs>;
};

// ---------- min 11 · el chisme viaja de casa en casa (y vuelve con SUS historias) ----------
export const Gossip: React.FC<{ t: number; at: number; back: number; out: number; y?: number }> = ({ t, at, back, out, y = 860 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const xs = [300, 740, 1180, 1620], rev = t >= back;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      {xs.map((x, i) => <g key={i} transform={`translate(${x} ${y})`} opacity={e(t, at + i * 0.12, at + i * 0.12 + 0.2)}><path d="M -80 0 L 0 -70 L 80 0 V 80 H -80 Z" fill={i === 1 ? COL.red : COL.cream} /><rect x={-18} y={30} width={36} height={50} fill={COL.ink} />{i === 1 && <text x={0} y={130} textAnchor="middle" fontFamily={BRUSH} fontSize={44} fill={COL.cream}>mother</text>}</g>)}
      {Array.from({ length: 4 }, (_, i) => { const st = rev ? back : at + 0.6; if (t < st + i * 0.35) return null; const ph = ((t - st - i * 0.35) * 0.45) % 1;
        const from = rev ? 740 : 300, dir = rev ? 1 : 1; const px = from + dir * ph * (rev ? 880 : 440 + 880 * 0) + (rev ? 0 : 0); const bx = rev ? 740 + ph * 880 : 300 + ph * 440, by = y - 150 - Math.sin(Math.PI * ph) * 80;
        void px; return <g key={i} transform={`translate(${bx} ${by})`} opacity={Math.sin(Math.PI * ph)}><ellipse rx={90} ry={44} fill={rev ? COL.red : COL.cream} /><path d="M -20 36 L -40 70 L 10 40 Z" fill={rev ? COL.red : COL.cream} /><text x={0} y={14} textAnchor="middle" fontFamily={BRUSH} fontSize={36} fill={rev ? COL.cream : COL.ink}>{rev ? "her story" : "did you hear…"}</text></g>; })}
    </g>
  </svg>;
};

// ---------- min 11 · cambiaba de tema: el jardín, el clima, el precio del pescado ----------
export const Topics: React.FC<{ t: number; out: number; items: { at: number; text: string; icon: "leaf" | "cloud" | "fish" }[]; y?: number }> = ({ t, out, items, y = 230 }) => {
  const o = vis(t, items[0].at, out); if (o <= 0.01) return null;
  const Icon = ({ k }: { k: string }) => k === "leaf" ? <path d="M -30 20 Q -30 -40 30 -30 Q 30 30 -30 20 Z M -30 20 L 20 -20" fill="#4f7a3a" stroke="#2d4a20" strokeWidth={4} />
    : k === "cloud" ? <path d="M -40 20 Q -50 -10 -20 -15 Q -10 -45 20 -30 Q 50 -30 45 0 Q 60 20 30 25 Z" fill="#9fb4d6" />
    : <path d="M -45 0 Q -10 -35 30 0 Q -10 35 -45 0 Z M 30 0 L 50 -20 L 50 20 Z" fill="#7f9aaa" />;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 40, opacity: o }}>
    {items.map((it, i) => { const k = spr(t, it.at, 1.1); if (t < it.at) return <div key={i} style={{ width: 360 }} />;
      return <div key={i} style={{ width: 360, ...PAPER, padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateY(${(1 - Math.min(1, k)) * -200}px) rotate(${(i - 1) * 3}deg)` }}>
        <svg width={110} height={80} viewBox="-55 -40 110 80"><Icon k={it.icon} /></svg><div style={{ fontFamily: BRUSH, fontSize: 54, color: COL.ink, whiteSpace: "nowrap" }}>{it.text}</div>
      </div>; })}
  </div>;
};

// ---------- min 12 · "no levantaba la pelota": la pelota rebota y pasa de largo ----------
export const Ball: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 900 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const u = (t - at) / 2.8, x = -100 + u * 2100, b = Math.abs(Math.sin(u * Math.PI * 4)) * 260 * Math.exp(-u * 1.4);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <ellipse cx={x} cy={y + 50} rx={60 - b * 0.08} ry={12} fill="rgba(0,0,0,.35)" />
    <g transform={`translate(${x} ${y - b}) rotate(${u * 900})`} style={{ filter: SH }}><circle r={50} fill={COL.red} /><path d="M -50 0 Q 0 -30 50 0 M -50 0 Q 0 30 50 0" stroke={COL.cream} strokeWidth={7} fill="none" /></g>
    <g transform={`translate(1000 ${y - 90})`} opacity={e(t, at + 0.6, at + 0.9)} style={{ filter: SH }}><path d="M -50 60 Q -60 -10 -20 -20 L 30 -20 Q 60 -10 50 60" fill="none" stroke={COL.cream} strokeWidth={10} strokeLinecap="round" />
      <text x={0} y={-60} textAnchor="middle" fontFamily={BRUSH} fontSize={60} fill={COL.cream}>…she let it go by</text></g>
  </svg>;
};

// ---------- min 12 · makeru ga kachi: lo que perdió / lo que ganó ----------
export const LoseWin: React.FC<{ t: number; out: number; lost: { at: number; text: string }[]; won: { at: number; text: string } }> = ({ t, out, lost, won }) => {
  const o = vis(t, lost[0].at, out); if (o <= 0.01) return null;
  const wk = spr(t, won.at, 0.9);
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <div style={{ position: "absolute", left: 160, top: 220, width: 620 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: COL.cream, textShadow: extrude(3, "#000") }}>SHE LOST</div>
      {lost.map((l, i) => { const k = e(t, l.at, l.at + 0.3); return <div key={i} style={{ ...PAPER, marginTop: 20, padding: "12px 30px", fontFamily: BRUSH, fontSize: 60, color: "#7a6a58", opacity: k, transform: `translateX(${(1 - k) * -100}px) rotate(-2deg)` }}>{l.text}</div>; })}
    </div>
    {t >= won.at && <div style={{ position: "absolute", right: 170, top: 300, transform: `scale(${Math.min(1.05, wk)}) rotate(3deg)`, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: COL.cream, textShadow: extrude(3, "#000") }}>SHE WON</div>
      <div style={{ marginTop: 16, padding: "28px 70px", background: COL.red, borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.55)", fontFamily: BRUSH, fontSize: 130, color: COL.cream }}>{won.text}</div>
    </div>}
  </div>;
};

// ---------- min 12-13 · los "deberías" llueven (y todos se mojan) ----------
export const ShouldRain: React.FC<{ t: number; at: number; out: number; umb?: number }> = ({ t, at, out, umb = 1e9 }) => {
  const o = vis(t, at, out, 0.4, 0.5); if (o <= 0.01) return null;
  const words = ["you should", "you should…", "you should!", "should", "you should"];
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
    {Array.from({ length: 34 }, (_, i) => { const sp = 300 + rnd(i, 1) * 250, y = ((rnd(i, 2) * 1300 + (t - at) * sp) % 1300) - 120, x = rnd(i, 3) * 1920;
      return <g key={i} transform={`translate(${x} ${y}) rotate(12)`}><line x1={0} y1={-60} x2={0} y2={-10} stroke="#9fb4d6" strokeWidth={3} opacity={0.6} /><text x={0} y={20} textAnchor="middle" fontFamily={BRUSH} fontSize={30 + rnd(i, 4) * 26} fill="#cfe0f2" opacity={0.85}>{words[i % 5]}</text></g>; })}
    {t > umb && <g transform={`translate(960 ${640}) scale(${Math.min(1, spr(t, umb, 1))})`} style={{ filter: SH }}><path d="M -260 0 Q 0 -260 260 0 Q 200 -30 130 0 Q 65 -30 0 0 Q -65 -30 -130 0 Q -200 -30 -260 0 Z" fill={COL.red} /><path d="M 0 0 V 200 Q 0 240 -40 230" stroke={COL.ink} strokeWidth={12} fill="none" strokeLinecap="round" /></g>}
  </svg>;
};

// ---------- min 13 · el año más largo: un círculo de 12 meses que se cierra ----------
export const YearDial: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1420, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = ei(t, at + 0.3, at + 3.0), R = 190;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y})`} style={{ filter: SH }}>
      <circle r={R + 40} fill={COL.cream} opacity={0.95} />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2, on = i / 12 < g; return <circle key={i} cx={Math.cos(a) * R} cy={Math.sin(a) * R} r={20} fill={on ? COL.indigo : "#ddd0b6"} />; })}
      <circle r={R} fill="none" stroke={COL.indigo} strokeWidth={10} strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - g)} transform="rotate(-90)" />
      <text x={0} y={20} textAnchor="middle" fontFamily={BRUSH} fontSize={86} fill={COL.ink}>no visits</text>
      <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} letterSpacing={4} fill={COL.indigo}>{Math.max(1, Math.round(12 * g))} MONTHS</text>
    </g>
  </svg>;
};

// ---------- min 13 · "y después esperaba": reloj de arena ----------
export const Hourglass: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; label?: string }> = ({ t, at, out, x = 1500, y = 480, label = "she waited" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = e(t, at + 0.2, at + 3.5);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y})`} style={{ filter: SH }}>
      <rect x={-110} y={-190} width={220} height={22} rx={6} fill="#4a3220" /><rect x={-110} y={168} width={220} height={22} rx={6} fill="#4a3220" />
      <path d="M -90 -168 L 90 -168 L 10 0 L 90 168 L -90 168 L -10 0 Z" fill="rgba(251,246,234,.85)" stroke="#4a3220" strokeWidth={5} />
      <path d={`M ${-80 * (1 - g)} ${-150 + 140 * g} L ${80 * (1 - g)} ${-150 + 140 * g} L 0 -6 Z`} fill={COL.gold} />
      <path d={`M -80 160 L 80 160 L ${80 - 70 * g} ${160 - 130 * g} L ${-80 + 70 * g} ${160 - 130 * g} Z`} fill={COL.gold} opacity={g > 0.02 ? 1 : 0} />
      <line x1={0} y1={0} x2={0} y2={150} stroke={COL.gold} strokeWidth={4} opacity={g < 0.98 && g > 0.01 ? 1 : 0} />
      <text x={0} y={270} textAnchor="middle" fontFamily={BRUSH} fontSize={70} fill={COL.cream}>{label}</text>
    </g>
  </svg>;
};

// ---------- min 14 · "¿cómo estás?" / "I'm fine": la charla en globos ----------
export const Dialogue: React.FC<{ t: number; out: number; lines: { at: number; text: string; me?: boolean }[] }> = ({ t, out, lines }) => {
  const o = vis(t, lines[0].at, out); if (o <= 0.01) return null;
  const shown = lines.filter((l) => t >= l.at).slice(-4);
  return <div style={{ position: "absolute", left: 1000, top: 140, width: 820, opacity: o, display: "flex", flexDirection: "column", gap: 18 }}>
    {shown.map((l, i) => { const k = spr(t, l.at, 1.2);
      return <div key={l.at} style={{ alignSelf: l.me ? "flex-end" : "flex-start", transform: `scale(${Math.min(1, k)})`, transformOrigin: l.me ? "100% 50%" : "0 50%", padding: "14px 34px 18px", borderRadius: 30, background: l.me ? COL.red : COL.cream, color: l.me ? COL.cream : COL.ink, fontFamily: BRUSH, fontSize: l.me ? 66 : 52, boxShadow: "0 20px 40px rgba(0,0,0,.45)", opacity: i < shown.length - 3 ? 0.55 : 1 }}>{l.text}</div>; })}
  </div>;
};

// ---------- min 14 · I'M FINE = una armadura (que al final se raja) ----------
export const Armor: React.FC<{ t: number; at: number; crack: number; out: number; x?: number; y?: number }> = ({ t, at, crack, out, x = 1420, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9), c = ei(t, crack, crack + 0.5), sp = e(t, crack + 0.4, crack + 1.2);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y}) scale(${Math.min(1.04, k)})`} style={{ filter: SH }}>
      {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 30 * sp} ${20 * sp}) rotate(${sd * 6 * sp})`}>
        <path d={sd < 0 ? "M 0 -230 L -190 -170 Q -200 60 0 240 L 0 -230 Z" : "M 0 -230 L 190 -170 Q 200 60 0 240 L 0 -230 Z"} fill="#6f7a84" stroke="#2a2f34" strokeWidth={8} />
        <path d={sd < 0 ? "M -30 -190 L -160 -145 Q -165 40 -30 180 Z" : "M 30 -190 L 160 -145 Q 165 40 30 180 Z"} fill="#8b97a2" />
      </g>)}
      <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={74} fill={COL.cream} opacity={1 - sp}>I'M FINE</text>
      {c > 0 && <path d="M 0 -230 L -20 -120 L 25 -60 L -15 20 L 20 90 L 0 240" fill="none" stroke={COL.ink} strokeWidth={10} strokeDasharray={520} strokeDashoffset={520 * (1 - c)} />}
      <text x={0} y={330} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.cream}>{t < crack ? "60 years of armor" : "the last time"}</text>
    </g>
  </svg>;
};

// ---------- min 14 · casi una hora en el escalón helado: el reloj frío ----------
export const ColdHour: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1460, y = 430 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = ei(t, at + 0.2, at + 3.4), R = 160;
  const a = g * Math.PI * 2 - Math.PI / 2;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y})`} style={{ filter: SH }}>
      <circle r={R + 18} fill="#dfe8f0" stroke="#5a7a9a" strokeWidth={10} />
      <path d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 ${g > 0.5 ? 1 : 0} 1 ${Math.cos(a) * R} ${Math.sin(a) * R} Z`} fill="rgba(90,122,154,.45)" />
      {Array.from({ length: 12 }, (_, i) => { const b = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.cos(b) * (R - 18)} y1={Math.sin(b) * (R - 18)} x2={Math.cos(b) * R} y2={Math.sin(b) * R} stroke="#2a3a4a" strokeWidth={6} />; })}
      <line x1={0} y1={0} x2={Math.cos(a) * (R - 26)} y2={Math.sin(a) * (R - 26)} stroke="#1b2633" strokeWidth={10} strokeLinecap="round" />
      <text x={0} y={R + 90} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.cream}>{Math.round(55 * g)} minutes on the cold step</text>
    </g>
  </svg>;
};

// ---------- min 14-15 · la verdad, en chiquito: notitas que pega en la heladera ----------
export const Notes: React.FC<{ t: number; out: number; items: { at: number; text: string }[] }> = ({ t, out, items }) => {
  const o = vis(t, items[0].at, out); if (o <= 0.01) return null;
  const pos = [[1320, 300, -4], [1580, 520, 5], [1300, 740, -2]], cols = ["#f6e7a8", "#f3cfc4", "#d6e6c8"];
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    {items.map((it, i) => { const k = spr(t, it.at, 1); if (t < it.at) return null; const [px, py, r] = pos[i % 3];
      return <div key={i} style={{ position: "absolute", left: px, top: py, width: 380, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${2 - Math.min(1, k)})`, opacity: Math.min(1, k * 2), background: cols[i % 3], padding: "34px 26px 30px", boxShadow: "0 20px 40px rgba(0,0,0,.45)", fontFamily: BRUSH, fontSize: 50, lineHeight: 1.1, color: COL.ink, textAlign: "center" }}>
        <div style={{ position: "absolute", left: "50%", top: -14, width: 34, height: 34, borderRadius: 17, background: COL.red, transform: "translateX(-50%)" }} />{it.text}
      </div>; })}
  </div>;
};

// ---------- min 15 · otagai-sama: el círculo de pedir y devolver ayuda ----------
export const HelpLoop: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1420, y = 480 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = ei(t, at + 0.2, at + 1.4), R = 200, rot = (t - at) * 20;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y})`} style={{ filter: SH }}>
      <g transform={`rotate(${rot})`}>
        <path d={`M ${R} 0 A ${R} ${R} 0 0 1 ${-R} 0`} fill="none" stroke={COL.red} strokeWidth={22} strokeDasharray={Math.PI * R} strokeDashoffset={Math.PI * R * (1 - g)} />
        <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`} fill="none" stroke={COL.gold} strokeWidth={22} strokeDasharray={Math.PI * R} strokeDashoffset={Math.PI * R * (1 - g)} />
        <path d={`M ${-R - 34} -10 L ${-R} 40 L ${-R + 34} -10 Z`} fill={COL.red} opacity={g} /><path d={`M ${R - 34} 10 L ${R} -40 L ${R + 34} 10 Z`} fill={COL.gold} opacity={g} />
      </g>
      <text x={0} y={-30} textAnchor="middle" fontFamily={BRUSH} fontSize={70} fill={COL.cream}>you ask</text>
      <text x={0} y={60} textAnchor="middle" fontFamily={BRUSH} fontSize={70} fill={COL.cream}>you help back</text>
    </g>
  </svg>;
};

// ---------- min 16 · el repaso: las 9 frases NUEVAS que van entrando en un pergamino ----------
export const NineList: React.FC<{ t: number; out: number; items: { at: number; text: string }[]; x?: number; y?: number }> = ({ t, out, items, x = 70, y = 70 }) => {
  const o = vis(t, items[0].at - 0.4, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, width: 720, ...PAPER, padding: "22px 34px 26px", borderTop: `14px solid ${COL.red}` }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: COL.red, marginBottom: 6 }}>WHAT SHE SAID INSTEAD</div>
    {items.map((it, i) => { const k = e(t, it.at, it.at + 0.3);
      return <div key={i} style={{ display: "flex", gap: 16, alignItems: "baseline", opacity: 0.18 + 0.82 * k, transform: `translateX(${(1 - k) * -30}px)` }}>
        <div style={{ fontFamily: BRUSH, fontSize: 40, color: COL.red, width: 34 }}>{i + 1}</div><div style={{ fontFamily: BRUSH, fontSize: 42, color: COL.ink, lineHeight: 1.18 }}>{it.text}</div>
      </div>; })}
  </div>;
};

// ---------- min 16 · "como sacarse piedras de los bolsillos" ----------
export const Stones: React.FC<{ t: number; at: number; out: number; n?: number; x?: number; y?: number }> = ({ t, at, out, n = 9, x = 1420, y = 300 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      <path d={`M ${x - 170} ${y - 40} L ${x + 170} ${y - 40} L ${x + 150} ${y + 190} Q ${x} ${y + 260} ${x - 150} ${y + 190} Z`} fill="#4f5a6a" stroke="#2a2f34" strokeWidth={6} />
      <path d={`M ${x - 170} ${y - 40} Q ${x} ${y + 40} ${x + 170} ${y - 40}`} fill="none" stroke="#2a2f34" strokeWidth={8} />
      {Array.from({ length: n }, (_, i) => { const a = at + 0.5 + i * 0.75; if (t < a) return null; const ph = Math.min(1, (t - a) / 0.9), sx = x - 80 + (i % 3) * 70, sy = y + 10;
        const fx = sx + (rnd(i, 3) - 0.5) * 300, fy = 980 - (i % 3) * 18; const px = sx + (fx - sx) * ph, py = sy + (fy - sy) * ph * ph;
        return <g key={i}><ellipse cx={px} cy={py} rx={34 + rnd(i, 1) * 14} ry={24 + rnd(i, 2) * 8} fill={["#8d8a80", "#77756c", "#a29d90"][i % 3]} />{ph >= 1 && <text x={px} y={py + 10} textAnchor="middle" fontFamily={BRUSH} fontSize={30} fill={COL.cream}>{i + 1}</text>}</g>; })}
    </g>
  </svg>;
};

// ---------- min 16 · el comentario (como en YouTube, pero en washi) ----------
export const CommentBox: React.FC<{ t: number; at: number; typeAt: number; out: number; text: string; x?: number; y?: number }> = ({ t, at, typeAt, out, text, x = 1360, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9), n = Math.round(text.length * ei(t, typeAt, typeAt + 2.2)), cur = Math.floor(t * 2) % 2;
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotateY(-10deg) translateZ(${(1 - Math.min(1, k)) * -500}px)`}>
    <div style={{ ...PAPER, width: 860, padding: "28px 36px", borderTop: `14px solid ${COL.indigo}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: COL.indigo }}>COMMENTS</div>
      <div style={{ display: "flex", gap: 22, marginTop: 18 }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: COL.gold, flex: "none" }} />
        <div style={{ flex: 1, borderBottom: `4px solid ${COL.ink}`, fontFamily: BRUSH, fontSize: 52, color: COL.ink, minHeight: 70, lineHeight: 1.2 }}>{text.slice(0, n)}<span style={{ opacity: cur }}>|</span></div>
      </div>
      <div style={{ textAlign: "right", marginTop: 18 }}><span style={{ padding: "10px 30px", borderRadius: 30, background: COL.indigo, color: COL.cream, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4 }}>COMMENT</span></div>
    </div>
  </Abs>;
};

// ---------- min 17 · el próximo video: una tarjeta de noche con la luna ----------
export const NextUp: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1340, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o} tr={`rotate(-2deg) scale(${0.8 + 0.2 * Math.min(1, k)})`}>
    <div style={{ width: 760, padding: "34px 44px 40px", borderRadius: 10, background: "linear-gradient(180deg,#1b2440,#2b3f63)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 40, top: 30, width: 120, height: 120, borderRadius: 60, background: "#f6e7a8", boxShadow: "-30px 0 0 0 #1b2440 inset" }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: COL.gold }}>NEXT VIDEO</div>
      <div style={{ fontFamily: BRUSH, fontSize: 84, lineHeight: 1.05, color: COL.cream, marginTop: 14, width: 560 }}>9 things she stopped <span style={{ color: COL.gold }}>worrying</span> about</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cfd9f0", marginTop: 16, opacity: e(t, at + 1.2, at + 1.6) }}>#1 keeps most of us up at night</div>
    </div>
  </Abs>;
};

// ---------- el final · un ensō que se dibuja (el círculo zen de su pergamino) ----------
export const Enso: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; R?: number; text?: string }> = ({ t, at, out, x = 960, y = 470, R = 230, text }) => {
  const o = vis(t, at, out, 0.1, 0.6); if (o <= 0.01) return null;
  const g = ei(t, at, at + 1.6), N = 90, a0 = -1.9;
  const pts = Array.from({ length: Math.max(2, Math.round(N * g)) }, (_, i) => { const a = a0 + (i / N) * Math.PI * 1.88; const rr = R * (1 + 0.03 * Math.sin(i * 0.7)); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; });
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    {pts.slice(1).map((p, i) => { const w = 34 * Math.sin(Math.PI * Math.min(1, (i / N) * 1.05 + 0.1)) + 6; return <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} stroke={COL.ink} strokeWidth={w} strokeLinecap="round" />; })}
    {text && <text x={x} y={y + R + 120} textAnchor="middle" fontFamily={BRUSH} fontSize={90} fill={COL.ink} opacity={e(t, at + 1.4, at + 1.9)}>{text}</text>}
  </svg>;
};

// la foto a cuadro completo (cuando todavía no llegó el LTX): zoom lento, sin filtros
export const Photo: React.FC<{ id: string; t: number; a: number; z?: [number, number] }> = ({ id, t, a, z = [1.03, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}><Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc})` }} /></div>;
};
