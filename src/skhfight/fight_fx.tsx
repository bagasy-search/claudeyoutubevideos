// skhfight · piezas NUEVAS de este video (las 11 reglas): washi, sumi, bermellón, oro — el mismo idioma de la casa.
import React from "react";
import { BRUSH, COL, FONT, e, ei, extrude, rnd, spr } from "./lib";

const vis = (t: number, at: number, out: number, fi = 0.15, fo = 0.3) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
const PAPER: React.CSSProperties = { background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", borderRadius: 4 };
const SH = "drop-shadow(0 6px 14px rgba(0,0,0,.75))";
const Abs: React.FC<{ x: number; y: number; o: number; children: React.ReactNode; tr?: string }> = ({ x, y, o, children, tr = "" }) =>
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr}` }}>{children}</div>;
const reveal = (t: number, a: number, d = 0.6) => `inset(-20% ${100 - 100 * ei(t, a, a + d)}% -20% -5%)`;

// ---------- cada regla entra con su tarjeta: "RULE 4" en sumi + el título en pincel, con el hilo rojo de la story tag ----------
export const RuleCard: React.FC<{ t: number; at: number; out: number; n: number; title: string; x?: number; y?: number }> = ({ t, at, out, n, title, x = 960, y = 200 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.85);
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotate(-1deg)`}>
    <div style={{ ...PAPER, padding: "18px 70px 26px", textAlign: "center", borderTop: `14px solid ${COL.red}`, position: "relative" }}>
      <div style={{ position: "absolute", left: 26, top: 22, width: 22, height: 22, borderRadius: 11, border: `5px solid ${COL.ink}` }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 10, color: COL.red }}>RULE {n} OF 11</div>
      <div style={{ fontFamily: BRUSH, fontSize: 88, color: COL.ink, whiteSpace: "nowrap", clipPath: reveal(t, at + 0.2, 0.8) }}>{title}</div>
    </div>
  </Abs>;
};

// ---------- la STORY TAG: tarjetita de washi con cordón, que se escribe sola (de quién · cuándo · la historia) ----------
export const StoryTag: React.FC<{ t: number; at: number; out: number; who: string; when: string; story: string; x?: number; y?: number; rot?: number }> = ({ t, at, out, who, when, story, x = 1450, y = 520, rot = 5 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9), sw = Math.sin((t - at) * 2.2) * 3 * Math.exp(-(t - at) * 0.6);
  const L = (txt: string, a: number, size: number, col: string) => <div style={{ fontFamily: BRUSH, fontSize: size, color: col, lineHeight: 1.12, clipPath: reveal(t, a, 0.7) }}>{txt}</div>;
  return <Abs x={x} y={y} o={o} tr={`rotate(${rot + sw}deg) scale(${Math.min(1, k)})`}>
    <svg width={40} height={160} style={{ position: "absolute", left: "50%", top: -150, transform: "translateX(-50%)" }}><path d="M 20 0 Q 30 80 20 160" stroke={COL.red} strokeWidth={5} fill="none" /></svg>
    <div style={{ width: 460, padding: "44px 34px 30px", background: "linear-gradient(180deg,#f6eedd,#e9dcc0)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", clipPath: "polygon(18% 0, 82% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)", position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: 14, width: 22, height: 22, marginLeft: -11, borderRadius: 11, background: "#3a2f24" }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 6, color: "#7a6a58" }}>STORY TAG</div>
      {L(who, at + 0.3, 50, COL.ink)}{L(when, at + 0.9, 40, COL.indigo)}
      <div style={{ height: 3, background: "rgba(27,23,18,.2)", margin: "10px 0" }} />
      {L(story, at + 1.5, 40, COL.red)}
    </div>
  </Abs>;
};

// ---------- 100 cosas de la casa: 90 se apagan, quedan 10 encendidas (el 10 %) ----------
export const TenPercent: React.FC<{ t: number; at: number; dim: number; out: number; x?: number; y?: number; label?: string; label2?: string }> = ({ t, at, dim, out, x = 1420, y = 520, label = "10% · the small things with a story", label2 = "90% · nobody will fight over it" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const S = 50, G = 8, hot = new Set([3, 17, 22, 38, 41, 56, 64, 79, 85, 92]);
  return <Abs x={x} y={y} o={o}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${S}px)`, gap: G, filter: SH }}>
      {Array.from({ length: 100 }, (_, i) => { const a = at + (i % 10) * 0.03 + Math.floor(i / 10) * 0.05, k = e(t, a, a + 0.25), d = hot.has(i) ? 0 : e(t, dim + rnd(i, 4) * 0.6, dim + 0.3 + rnd(i, 4) * 0.6);
        const glow = hot.has(i) ? e(t, dim + 0.6, dim + 1.0) : 0;
        return <div key={i} style={{ width: S, height: S, borderRadius: 8, transform: `scale(${k * (1 + 0.12 * glow)})`, background: hot.has(i) ? `rgb(${251 - 51 * glow},${246 - 196 * glow},${234 - 204 * glow})` : `rgba(251,246,234,${0.9 - 0.75 * d})`, boxShadow: glow > 0.1 ? `0 0 ${24 * glow}px rgba(200,50,30,.9)` : undefined }} />; })}
    </div>
    <div style={{ marginTop: 26, fontFamily: BRUSH, fontSize: 56, color: COL.cream, textShadow: extrude(3, "#000"), opacity: e(t, dim + 0.8, dim + 1.2), whiteSpace: "nowrap", textAlign: "center" }}><span style={{ color: "#ff8f75" }}>{label}</span></div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: "rgba(251,246,234,.75)", textShadow: extrude(2, "#000"), opacity: e(t, dim + 1.2, dim + 1.6), whiteSpace: "nowrap", textAlign: "center" }}>{label2}</div>
  </Abs>;
};

// ---------- el cuaderno escrito a mano: renglones que se escriben (qué · dónde · para quién · por qué) ----------
export const Notebook: React.FC<{ t: number; out: number; title?: string; rows: { at: number; what: string; where: string; who: string; why: string }[]; x?: number; y?: number }> = ({ t, out, title = "MY ENDING NOTE · THE 10%", rows, x = 1240, y = 560 }) => {
  const o = vis(t, rows[0].at - 0.4, out); if (o <= 0.01) return null;
  const k = spr(t, rows[0].at - 0.4, 0.8);
  return <Abs x={x} y={y} o={o} tr={`perspective(1600px) rotateX(${14 - 6 * Math.min(1, k)}deg) rotateY(-8deg) rotate(-2deg)`}>
    <div style={{ width: 1060, padding: "26px 48px 34px 96px", borderRadius: 6, background: "repeating-linear-gradient(180deg, #f7f1e3 0 62px, #c9d6e8 62px 64px)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", position: "relative", borderLeft: `18px solid ${COL.indigo}` }}>
      <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 3, background: "rgba(200,50,30,.5)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: COL.indigo, height: 50 }}>{title}</div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", gap: 22, alignItems: "baseline", height: 128, flexWrap: "wrap", alignContent: "flex-start" }}>
        <span style={{ fontFamily: BRUSH, fontSize: 56, color: COL.ink, clipPath: reveal(t, r.at, 0.5) }}>{r.what}</span>
        <span style={{ fontFamily: BRUSH, fontSize: 40, color: "#7a6a58", clipPath: reveal(t, r.at + 0.6, 0.5) }}>· {r.where}</span>
        <span style={{ fontFamily: BRUSH, fontSize: 48, color: COL.red, clipPath: reveal(t, r.at + 1.2, 0.5) }}>→ {r.who}</span>
        <span style={{ fontFamily: BRUSH, fontSize: 40, color: COL.indigo, clipPath: reveal(t, r.at + 1.8, 0.7), width: "100%" }}>because {r.why}</span>
      </div>)}
    </div>
  </Abs>;
};

// ---------- manos frías / manos tibias (azul → naranja), el refrán ----------
export const WarmHands: React.FC<{ t: number; at: number; warm: number; out: number; x?: number; y?: number }> = ({ t, at, warm, out, x = 1400, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const w = ei(t, warm, warm + 0.8), k = spr(t, at, 0.9);
  const Hand = ({ dx, col, lab, on }: { dx: number; col: string; lab: string; on: number }) => <g transform={`translate(${dx} 0)`} opacity={0.35 + 0.65 * on}>
    <path d="M -70 120 L -70 -10 Q -70 -40 -50 -40 L -50 -110 Q -50 -130 -32 -130 Q -14 -130 -14 -110 L -14 -140 Q -14 -160 4 -160 Q 22 -160 22 -140 L 22 -120 Q 22 -138 40 -138 Q 58 -138 58 -118 L 58 -90 Q 58 -106 74 -106 Q 90 -106 90 -86 L 90 40 Q 90 120 20 140 L -40 140 Z" fill={col} stroke={COL.cream} strokeWidth={6} />
    {on > 0.5 && col !== "#7f9ccf" && Array.from({ length: 3 }, (_, i) => <path key={i} d={`M ${-30 + i * 40} ${-190 - ((t * 40 + i * 20) % 60)} q 12 -16 0 -32 q -12 -16 0 -32`} stroke="#ffcf8a" strokeWidth={6} fill="none" opacity={0.8} />)}
    <text x={10} y={220} textAnchor="middle" fontFamily={BRUSH} fontSize={64} fill={COL.cream}>{lab}</text>
  </g>;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y}) scale(${Math.min(1, k)})`} style={{ filter: SH }}>
      <Hand dx={-180} col="#7f9ccf" lab="cold hands" on={1 - 0.6 * w} />
      <Hand dx={180} col="#e08a4a" lab="warm hands" on={0.4 + 0.6 * w} />
      <text x={180} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing={6} fill={COL.gold} opacity={w}>NOW · WHILE YOU SEE THEIR FACE</text>
      <text x={-180} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing={6} fill="#b9c7e6" opacity={e(t, at + 0.6, at + 1)}>AFTER YOU ARE GONE</text>
    </g>
  </svg>;
};

// ---------- la balanza con rótulos (mismo precio NO · mismo peso en el corazón SÍ) ----------
export const Scale: React.FC<{ t: number; at: number; out: number; left: string; right: string; even?: boolean; x?: number; y?: number; title?: string }> = ({ t, at, out, left, right, even = true, x = 1400, y = 520, title }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const tip = even ? 0.22 * (1 - ei(t, at + 0.6, at + 1.8)) * Math.cos((t - at) * 3) : 0.22 * ei(t, at + 0.6, at + 1.6);
  const L = 300, lx = -L * Math.cos(tip), ly = -L * Math.sin(tip), rx = L * Math.cos(tip), ry = L * Math.sin(tip);
  const Pan = ({ px, py, label, col }: { px: number; py: number; label: string; col: string }) => <g transform={`translate(${px} ${py})`}>
    <line x1={0} y1={0} x2={-80} y2={120} stroke={COL.cream} strokeWidth={3} /><line x1={0} y1={0} x2={80} y2={120} stroke={COL.cream} strokeWidth={3} />
    <path d="M -110 120 Q 0 185 110 120 Z" fill={col} stroke={COL.cream} strokeWidth={4} />
    <text x={0} y={235} textAnchor="middle" fontFamily={BRUSH} fontSize={58} fill={COL.cream}>{label}</text>
  </g>;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g transform={`translate(${x} ${y - 140})`} style={{ filter: SH }}>
      {title && <text x={0} y={-70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} letterSpacing={7} fill={COL.gold}>{title}</text>}
      <rect x={-10} y={0} width={20} height={400} fill="#4a3220" /><rect x={-110} y={390} width={220} height={26} rx={8} fill="#4a3220" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#d9a441" strokeWidth={14} strokeLinecap="round" /><circle r={22} fill="#d9a441" />
      <Pan px={lx} py={ly} label={left} col={COL.red} /><Pan px={rx} py={ry} label={right} col={COL.indigo} />
    </g>
  </svg>;
};

// ---------- el juego de 5 tazas en 2D: cinco → tres grupos (2 · 2 · 1 + tetera) = "the family puzzle" ----------
export const CupSplit: React.FC<{ t: number; at: number; split: number; out: number; y?: number; names?: string[] }> = ({ t, at, split, out, y = 820, names = ["my older son", "my daughter", "my younger son"] }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, split, split + 1.1);
  const row = [-2, -1, 0, 1, 2].map((i) => 960 + i * 150), grp = [600, 740, 1080, 1220, 1500];
  const Cup = ({ cx, i }: { cx: number; i: number }) => <g transform={`translate(${cx} ${y - Math.sin(Math.PI * k) * 60 * (i % 2 ? 1 : 0.6)})`}>
    <path d="M -50 -40 L 50 -40 L 38 40 Q 0 56 -38 40 Z" fill="#f4f1ea" stroke="#2b3f63" strokeWidth={5} />
    <path d="M -44 -14 Q 0 0 44 -14" stroke="#2b3f63" strokeWidth={8} fill="none" /><circle cx={0} cy={14} r={9} fill="#2b3f63" />
  </g>;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      {row.map((cx, i) => <Cup key={i} i={i} cx={cx + (grp[i] - cx) * k} />)}
      {k > 0.6 && <g transform={`translate(1600 ${y})`} opacity={e(t, split + 0.7, split + 1.1)}><ellipse cx={0} cy={0} rx={56} ry={44} fill="#f4f1ea" stroke="#2b3f63" strokeWidth={5} /><path d="M 50 -10 Q 90 -20 96 -50" stroke="#2b3f63" strokeWidth={8} fill="none" /></g>}
      {names.map((nm, i) => <text key={i} x={[670, 1150, 1550][i]} y={y + 130} textAnchor="middle" fontFamily={BRUSH} fontSize={50} fill={COL.cream} opacity={e(t, split + 1.1 + i * 0.25, split + 1.4 + i * 0.25)}>{nm}</text>)}
    </g>
  </svg>;
};

// ---------- la semana: 7 días que se tachan con pincel, cada uno con su tarea ----------
export const WeekPlan: React.FC<{ t: number; out: number; days: { at: number; text: string }[]; x?: number; y?: number }> = ({ t, out, days, x = 960, y = 560 }) => {
  const o = vis(t, days[0].at - 0.4, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    <div style={{ display: "flex", gap: 14 }}>
      {days.map((d, i) => { const k = spr(t, d.at, 1), on = t >= d.at, c = ei(t, d.at + 0.3, d.at + 0.6), cur = on && (i === days.length - 1 || t < days[i + 1].at);
        return <div key={i} style={{ width: 236, height: 330, ...PAPER, borderTop: `16px solid ${cur ? COL.red : COL.indigo}`, padding: "16px 16px", transform: `translateY(${on ? -20 * Math.min(1, k) : 0}px) scale(${cur ? 1.04 : 1})`, opacity: on ? 1 : 0.45, position: "relative" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "#7a6a58" }}>DAY</div>
          <div style={{ fontFamily: BRUSH, fontSize: 90, lineHeight: 0.9, color: cur ? COL.red : COL.ink }}>{i + 1}</div>
          <div style={{ fontFamily: BRUSH, fontSize: 38, lineHeight: 1.08, color: COL.ink, marginTop: 8, clipPath: reveal(t, d.at + 0.1, 0.6) }}>{d.text}</div>
          {on && !cur && <svg width={236} height={330} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 40 290 L 90 320 L 210 180" stroke={COL.red} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - c)} /></svg>}
        </div>; })}
    </div>
  </Abs>;
};

// ---------- el repaso de las 11 (o cualquier lista numerada larga) en un pergamino ----------
export const RuleList: React.FC<{ t: number; out: number; title: string; items: { at: number; text: string }[]; x?: number; y?: number; size?: number }> = ({ t, out, title, items, x = 70, y = 50, size = 36 }) => {
  const o = vis(t, items[0].at - 0.4, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, width: 760, ...PAPER, padding: "20px 34px 24px", borderTop: `14px solid ${COL.red}` }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: COL.red, marginBottom: 4 }}>{title}</div>
    {items.map((it, i) => { const k = e(t, it.at, it.at + 0.3), cur = t >= it.at && (i === items.length - 1 || t < items[i + 1].at);
      return <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", opacity: 0.18 + 0.82 * k, transform: `translateX(${(1 - k) * -30 + (cur ? 12 : 0)}px)` }}>
        <div style={{ fontFamily: BRUSH, fontSize: size, color: COL.red, width: 40 }}>{i + 1}</div><div style={{ fontFamily: BRUSH, fontSize: size, color: cur ? COL.red : COL.ink, lineHeight: 1.16 }}>{it.text}</div>
      </div>; })}
  </div>;
};

// ---------- barra de avance de las 11 reglas (los re-ganchos) ----------
export const Progress11: React.FC<{ t: number; at: number; out: number; done: number; label: string; y?: number }> = ({ t, at, out, done, label, y = 930 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = ei(t, at + 0.2, at + 1.0) * (done / 11);
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      <line x1={220} y1={y} x2={1700} y2={y} stroke="rgba(251,246,234,.5)" strokeWidth={10} strokeLinecap="round" />
      <line x1={220} y1={y} x2={220 + 1480 * g} y2={y} stroke={COL.red} strokeWidth={14} strokeLinecap="round" />
      {Array.from({ length: 11 }, (_, i) => { const px = 220 + 1480 * (i + 0.5) / 11, on = (i + 0.5) / 11 <= g, hot = i === 10 || i === 3 || i === 6;
        return <g key={i}><circle cx={px} cy={y} r={32} fill={on ? COL.red : COL.cream} stroke={hot && !on ? COL.gold : "none"} strokeWidth={6} /><text x={px} y={y + 14} textAnchor="middle" fontFamily={BRUSH} fontSize={40} fill={on ? COL.cream : COL.ink}>{i + 1}</text></g>; })}
      <text x={960} y={y - 66} textAnchor="middle" fontFamily={BRUSH} fontSize={70} fill={COL.cream} opacity={e(t, at + 0.9, at + 1.2)}>{label}</text>
    </g>
  </svg>;
};

// ---------- la llamada a través del océano: dos teléfonos y un arco de tinta (Osaka ↔ acá) ----------
export const OceanCall: React.FC<{ t: number; at: number; out: number; left?: string; right?: string; y?: number }> = ({ t, at, out, left = "my brother", right = "me", y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const g = ei(t, at + 0.3, at + 1.8);
  const pts = Array.from({ length: 60 }, (_, i) => { const u = i / 59; return [380 + 1160 * u, y - Math.sin(Math.PI * u) * 260]; }).slice(0, Math.max(2, Math.round(60 * g)));
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
    <g style={{ filter: SH }}>
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M 420 ${y + 120 + i * 26} ${Array.from({ length: 12 }, (_, j) => `q 45 ${(j + i) % 2 ? -14 : 14} 90 0`).join(" ")}`} stroke="rgba(143,170,214,.55)" strokeWidth={5} fill="none" transform={`translate(${((t * 30 + i * 17) % 90) - 45} 0)`} />)}
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={COL.red} strokeWidth={9} strokeDasharray="2 18" strokeLinecap="round" />
      {[[380, left], [1540, right]].map(([px, lab], i) => <g key={i} transform={`translate(${px} ${y})`}>
        <circle r={70} fill={COL.cream} /><path d="M -34 -14 Q -34 -40 0 -40 Q 34 -40 34 -14 L 22 -6 L 14 -22 L -14 -22 L -22 -6 Z" fill={COL.ink} /><rect x={-26} y={-6} width={52} height={34} rx={6} fill={COL.ink} />
        <text x={0} y={130} textAnchor="middle" fontFamily={BRUSH} fontSize={56} fill={COL.cream}>{lab as string}</text></g>)}
    </g>
  </svg>;
};

// ---------- el próximo video (texto propio) ----------
export const NextCard: React.FC<{ t: number; at: number; out: number; title: React.ReactNode; sub: string; x?: number; y?: number }> = ({ t, at, out, title, sub, x = 1340, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o} tr={`rotate(-2deg) scale(${0.8 + 0.2 * Math.min(1, k)})`}>
    <div style={{ width: 760, padding: "34px 44px 40px", borderRadius: 10, background: "linear-gradient(180deg,#1b2440,#2b3f63)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 40, top: 30, width: 120, height: 120, borderRadius: 60, background: "#f6e7a8", boxShadow: "-30px 0 0 0 #1b2440 inset" }} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: COL.gold }}>NEXT VIDEO</div>
      <div style={{ fontFamily: BRUSH, fontSize: 80, lineHeight: 1.05, color: COL.cream, marginTop: 14, width: 560 }}>{title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cfd9f0", marginTop: 16, opacity: e(t, at + 1.2, at + 1.6) }}>{sub}</div>
    </div>
  </Abs>;
};

// ---------- la otra casa: Sachiko's Kitchen (el canal hermano), tarjeta con olla humeante ----------
export const KitchenCard: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1400, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9);
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotateY(${(1 - Math.min(1, k)) * -50}deg)`}>
    <div style={{ ...PAPER, width: 700, padding: "26px 40px 30px", borderTop: `14px solid ${COL.gold}`, display: "flex", gap: 30, alignItems: "center" }}>
      <svg width={170} height={170}><ellipse cx={85} cy={120} rx={70} ry={30} fill={COL.ink} /><rect x={15} y={70} width={140} height={50} fill={COL.ink} /><ellipse cx={85} cy={70} rx={70} ry={20} fill="#3a2f24" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${55 + i * 30} ${50 - ((t * 30 + i * 15) % 30)} q 10 -14 0 -28 q -10 -14 0 -28`} stroke="#b9b2a4" strokeWidth={6} fill="none" />)}</svg>
      <div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: "#7a6a58" }}>MY KITCHEN CHANNEL</div>
        <div style={{ fontFamily: BRUSH, fontSize: 76, color: COL.ink, lineHeight: 1 }}>Sachiko's Kitchen</div>
        <div style={{ fontFamily: BRUSH, fontSize: 40, color: COL.red }}>the old ways, at the stove</div></div>
    </div>
  </Abs>;
};

// ---------- la pregunta del espectador (tarjetita tipo comentario) ----------
export const Question: React.FC<{ t: number; at: number; out: number; n: number; text: string; x?: number; y?: number }> = ({ t, at, out, n, text, x = 1300, y = 300 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 1);
  return <Abs x={x} y={y} o={o} tr={`scale(${Math.min(1, k)}) rotate(-1.5deg)`}>
    <div style={{ ...PAPER, width: 860, padding: "22px 36px 26px", borderLeft: `14px solid ${COL.indigo}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: COL.indigo }}>YOUR QUESTION #{n}</div>
      <div style={{ fontFamily: BRUSH, fontSize: 54, color: COL.ink, lineHeight: 1.12, clipPath: reveal(t, at + 0.2, 0.9) }}>“{text}”</div>
    </div>
  </Abs>;
};

// ---------- años en silencio: tarjetas de Año Nuevo, cortas y educadas, que se apilan ----------
export const NewYearCards: React.FC<{ t: number; at: number; out: number; n?: number; x?: number; y?: number }> = ({ t, at, out, n = 2, x = 1420, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    <div style={{ position: "relative", width: 520, height: 400 }}>
      {Array.from({ length: n }, (_, i) => { const a = at + 0.3 + i * 0.9, k = spr(t, a, 1); if (t < a) return null;
        return <div key={i} style={{ position: "absolute", left: 60 + i * 40, top: 40 + i * 30, width: 380, height: 260, ...PAPER, borderTop: `12px solid ${COL.red}`, transform: `rotate(${-6 + i * 7}deg) translateY(${(1 - Math.min(1, k)) * -200}px)`, padding: 24 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: COL.red }}>HAPPY NEW YEAR</div>
          <div style={{ fontFamily: BRUSH, fontSize: 48, color: "#7a6a58", marginTop: 16 }}>Best wishes. Kenji.</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#a0907c", marginTop: 26 }}>YEAR {i + 1} · SHORT AND POLITE</div>
        </div>; })}
    </div>
  </Abs>;
};
