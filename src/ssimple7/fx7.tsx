// ssimple7 · piezas NUEVAS de este video (mismo idioma de la casa: washi, sumi, bermellón). Todas ancladas con at().
import React from "react";
import { BRUSH, COL, FONT, e, ei, extrude, rnd, spr } from "./lib";

const PAPER: React.CSSProperties = { background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", borderRadius: 4 };
const SH = "drop-shadow(0 6px 14px rgba(0,0,0,.75))";
const op = (t: number, a: number, out: number) => e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
const Abs: React.FC<{ x: number; y: number; o: number; tr?: string; children: React.ReactNode }> = ({ x, y, o, tr = "", children }) =>
  o <= 0.01 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr}`, perspective: 1400 }}>{children}</div>;

// ---------- la LISTA de las 3 de la mañana: renglones que se escriben solos y vuelven a empezar (flecha que gira) ----------
export const WorryList: React.FC<{ t: number; out: number; items: { at: number; text: string }[]; loop?: number; x?: number; y?: number }> = ({ t, out, items, loop = 1e9, x = 1420, y = 500 }) => {
  const a = items[0].at - 0.3, o = op(t, a, out), k = Math.min(1, spr(t, a, 0.8));
  const lp = e(t, loop, loop + 0.9);
  return <Abs x={x} y={y} o={o} tr={`rotateY(${-14 + 3 * Math.sin(t * 0.5)}deg) rotateZ(-2deg) scale(${0.7 + 0.3 * k})`}>
    <div style={{ ...PAPER, width: 620, padding: "26px 34px 30px", borderTop: `14px solid ${COL.indigo}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: "#7a6a58" }}>3:00 A.M. · THE LIST</div>
      {items.map((it, i) => { const r = e(t, it.at, it.at + 0.4), back = lp > 0 ? 1 - e(t, loop + i * 0.05, loop + 0.3 + i * 0.05) * 0.85 : 1;
        return <div key={i} style={{ fontFamily: BRUSH, fontSize: 48, color: COL.ink, opacity: r * back, clipPath: `inset(-20% ${100 - r * 100}% -20% 0)`, borderBottom: "2px solid rgba(43,63,99,.2)", padding: "4px 0" }}>{i + 1}. {it.text}</div>; })}
      {lp > 0.01 && <svg width={120} height={120} style={{ position: "absolute", right: -50, top: -40, transform: `rotate(${t * 220}deg)`, opacity: lp }}>
        <path d="M60 14 A46 46 0 1 1 18 44" fill="none" stroke={COL.red} strokeWidth={9} strokeLinecap="round" /><path d="M8 30 L18 50 L36 38" fill={COL.red} /></svg>}
    </div>
  </Abs>;
};

// ---------- el DISCO viejo: la lista "vuelve a empezar desde arriba" ----------
export const Record: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; label?: string }> = ({ t, at, out, x = 1440, y = 520, label = "THE LIST" }) => {
  const o = op(t, at, out), k = Math.min(1, spr(t, at, 0.9)); if (o <= 0.01) return null;
  const rot = (t - at) * 200;
  return <Abs x={x} y={y} o={o} tr={`rotateX(${52 - 10 * k}deg) scale(${0.6 + 0.4 * k})`}>
    <div style={{ width: 560, height: 560, borderRadius: "50%", background: "repeating-radial-gradient(circle, #151312 0 3px, #24201d 3px 6px)", boxShadow: "0 60px 90px rgba(0,0,0,.6)", transform: `rotate(${rot}deg)`, position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 200, height: 200, marginLeft: -100, marginTop: -100, borderRadius: "50%", background: COL.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.cream, letterSpacing: 3 }}>{label}</div>
      <div style={{ position: "absolute", left: "50%", top: 70, width: 70, height: 6, background: "rgba(255,255,255,.18)", transform: "translateX(-50%)" }} />
    </div>
  </Abs>;
};

// ---------- la PÁGINA del cuaderno: preocupación | próximo paso (o NOT TONIGHT) · se cierra y el lápiz cae encima ----------
export const NotePage: React.FC<{ t: number; out: number; rows: { at: number; w: string; step: string; sAt: number }[]; close?: number; x?: number; y?: number; title?: string }> = ({ t, out, rows, close = 1e9, x = 1380, y = 520, title = "TONIGHT" }) => {
  const a = rows[0].at - 0.4, o = op(t, a, out), k = Math.min(1, spr(t, a, 0.8)), c = ei(t, close, close + 0.6), pen = e(t, close + 0.6, close + 1.0);
  return <Abs x={x} y={y} o={o} tr={`rotateX(${16 - 8 * k}deg) rotateY(${-10 + 2 * Math.sin(t * 0.6)}deg) scale(${0.7 + 0.3 * k})`}>
    <div style={{ position: "relative", width: 720, transformOrigin: "0 50%", transform: `rotateY(${-c * 178}deg)`, transformStyle: "preserve-3d" }}>
      <div style={{ ...PAPER, padding: "26px 34px 34px", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 58px, rgba(43,63,99,.18) 58px 60px)", backfaceVisibility: "hidden" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: "#7a6a58", marginBottom: 6 }}>{title}</div>
        {rows.map((r, i) => { const rw = e(t, r.at, r.at + 0.35), rs = e(t, r.sAt, r.sAt + 0.35), no = r.step.toLowerCase() === "not tonight";
          return <div key={i} style={{ display: "flex", height: 60, alignItems: "center" }}>
            <div style={{ width: 360, fontFamily: BRUSH, fontSize: 46, color: COL.ink, clipPath: `inset(-20% ${100 - rw * 100}% -20% 0)` }}>{r.w}</div>
            <div style={{ width: 4, alignSelf: "stretch", background: "rgba(200,50,30,.4)", margin: "0 18px" }} />
            <div style={{ fontFamily: BRUSH, fontSize: 46, color: no ? COL.indigo : COL.red, clipPath: `inset(-20% ${100 - rs * 100}% -20% 0)`, transform: no ? `rotate(-3deg) scale(${1 + 0.15 * (1 - rs)})` : undefined }}>{no ? "→ not tonight" : "→ " + r.step}</div>
          </div>; })}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#c9b98e,#a8946a)", borderRadius: 4, transform: "rotateY(180deg)", backfaceVisibility: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    </div>
    {pen > 0.01 && <div style={{ position: "absolute", left: -380 + 40, top: -20 - 120 * (1 - pen), width: 420, height: 22, borderRadius: 11, background: "linear-gradient(90deg,#f0d9a0,#d9a441 12%,#d9a441 88%,#333 88%)", transform: "rotate(-12deg)", opacity: pen, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />}
  </Abs>;
};

// ---------- EN LA CABEZA da vueltas (perro que se persigue la cola) · EN PAPEL tiene bordes ----------
export const HeadPaper: React.FC<{ t: number; at: number; at2: number; out: number; y?: number }> = ({ t, at, at2, out, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k2 = spr(t, at2, 1);
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <Abs x={640} y={y} o={1}>
      <svg width={420} height={420} style={{ filter: SH }}>
        <circle cx={210} cy={210} r={150} fill="none" stroke={COL.cream} strokeWidth={8} strokeDasharray="30 22" style={{ transform: `rotate(${t * 140}deg)`, transformOrigin: "210px 210px" }} />
        <text x={210} y={222} textAnchor="middle" fontFamily={BRUSH} fontSize={56} fill={COL.cream}>round & round</text>
      </svg>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: COL.cream, textShadow: extrude(4, "#000") }}>IN YOUR HEAD</div>
    </Abs>
    {t > at2 && <Abs x={1300} y={y} o={e(t, at2, at2 + 0.15)} tr={`scale(${Math.min(1.05, k2)}) rotate(-3deg)`}>
      <div style={{ ...PAPER, width: 360, height: 300, display: "flex", alignItems: "center", justifyContent: "center", border: `6px solid ${COL.ink}`, fontFamily: BRUSH, fontSize: 64, color: COL.ink }}>the worry</div>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: COL.cream, textShadow: extrude(4, "#000"), marginTop: 14 }}>ON PAPER: EDGES</div>
    </Abs>}
  </div>;
};

// ---------- la semana: el JUEVES con el círculo de pincel ("se olvidan para el jueves") ----------
export const Thursday: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 960, y = 860 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const D = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"], c = ei(t, at + 0.6, at + 1.2);
  return <Abs x={x} y={y} o={o}>
    <div style={{ display: "flex", gap: 14 }}>{D.map((d, i) => { const k = spr(t, at + i * 0.06, 1.2);
      return <div key={i} style={{ ...PAPER, width: 150, height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - Math.min(1, k)) * 80}px)`, position: "relative", borderTop: `10px solid ${i === 3 ? COL.red : COL.indigo}` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: i === 3 ? COL.red : COL.ink }}>{d}</div>
        {i === 3 && <svg width={200} height={170} style={{ position: "absolute", left: -25, top: -25 }}><ellipse cx={100} cy={85} rx={92} ry={74} fill="none" stroke={COL.red} strokeWidth={8} strokeDasharray={520} strokeDashoffset={520 * (1 - c)} strokeLinecap="round" /></svg>}
      </div>; })}</div>
    <div style={{ textAlign: "center", fontFamily: BRUSH, fontSize: 70, color: COL.cream, textShadow: extrude(4, "#000"), marginTop: 16, opacity: e(t, at + 1.1, at + 1.4) }}>they will forget by Thursday</div>
  </Abs>;
};

// ---------- el ESCENARIO: todos arriba, las butacas vacías ----------
export const Stage: React.FC<{ t: number; at: number; seats: number; out: number; y?: number }> = ({ t, at, seats, out, y = 560 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const sk = e(t, seats, seats + 0.6);
  return <Abs x={960} y={y} o={o} tr="rotateX(18deg)">
    <div style={{ width: 1200, height: 160, background: "linear-gradient(180deg,#7a4a28,#4a2c18)", borderRadius: 6, position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 11 }, (_, i) => { const k = spr(t, at + 0.1 + i * 0.07, 1.1);
        return <svg key={i} width={70} height={130} style={{ position: "absolute", left: 40 + i * 104, bottom: 150 - 10, transform: `translateY(${(1 - Math.min(1, k)) * 60}px)`, opacity: Math.min(1, k) }}>
          <circle cx={35} cy={22} r={18} fill={COL.cream} /><rect x={14} y={44} width={42} height={80} rx={18} fill={i % 3 ? COL.cream : "#f3c7a8"} /></svg>; })}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 80px)", gap: 14, marginTop: 40, marginLeft: 60, opacity: sk }}>
      {Array.from({ length: 36 }, (_, i) => <div key={i} style={{ width: 80, height: 50, borderRadius: "10px 10px 4px 4px", background: "#8a2a1e", boxShadow: "inset 0 -10px 0 #5e1a12" }} />)}
    </div>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: COL.cream, textShadow: extrude(4, "#000"), marginTop: 20, opacity: sk }}>NOBODY IN THE SEATS</div>
  </Abs>;
};

// ---------- la casa en planta (6 tatamis) apagada · UN rincón limpio encendido ----------
export const OneCorner: React.FC<{ t: number; at: number; lit: number; out: number; x?: number; y?: number }> = ({ t, at, lit, out, x = 1400, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.8)), L = e(t, lit, lit + 0.6);
  const mats = [[0, 0, 2, 1], [2, 0, 1, 2], [0, 1, 1, 2], [1, 1, 1, 1], [1, 2, 2, 1], [3, 0, 1, 2]];
  return <Abs x={x} y={y} o={o} tr={`rotateX(${48 - 6 * k}deg) rotateZ(-8deg) scale(${0.7 + 0.3 * k})`}>
    <div style={{ position: "relative", width: 4 * 150 + 20, height: 3 * 150 + 20, background: "#3b2618", borderRadius: 6, boxShadow: "0 60px 100px rgba(0,0,0,.6)" }}>
      {mats.map(([c, r, w, h], i) => <div key={i} style={{ position: "absolute", left: 10 + c * 150, top: 10 + r * 150, width: w * 150 - 6, height: h * 150 - 6, background: "#c9b77e", border: "5px solid #2c2a26", filter: `brightness(${1 - 0.55 * L})` }} />)}
      <div style={{ position: "absolute", left: 10 + 3 * 150, top: 10 + 2 * 150, width: 144, height: 144, background: "#f4e3b8", boxShadow: `0 0 ${80 * L}px ${30 * L}px rgba(255,214,140,${0.7 * L})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BRUSH, fontSize: 34, color: COL.ink, textAlign: "center" }}>step · cushion · cup</div>
    </div>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 6, color: COL.cream, textShadow: extrude(4, "#000"), marginTop: 26, opacity: L }}>ONE CLEAN CORNER</div>
  </Abs>;
};

// ---------- el ESPEJO redondo y las 3 cosas en voz alta (tilde de pincel) ----------
export const MirrorCheck: React.FC<{ t: number; out: number; items: { at: number; text: string }[]; x?: number; y?: number }> = ({ t, out, items, x = 1420, y = 520 }) => {
  const a = items[0].at - 0.5, o = op(t, a, out), k = Math.min(1, spr(t, a, 0.8)); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o} tr={`rotateY(${-12 + 3 * Math.sin(t * 0.6)}deg) scale(${0.7 + 0.3 * k})`}>
    <div style={{ width: 600, height: 600, borderRadius: "50%", border: "26px solid #4a3220", background: "radial-gradient(circle at 35% 30%, #f2f6f8, #b9c6ce 70%)", boxShadow: "0 60px 100px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 90 }}>
      {items.map((it, i) => { const r = e(t, it.at, it.at + 0.3), c = ei(t, it.at + 0.2, it.at + 0.5);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: r, margin: "12px 0" }}>
          <svg width={64} height={64}><path d="M8 34 L26 52 L58 12" fill="none" stroke={COL.red} strokeWidth={10} strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - c)} /></svg>
          <div style={{ fontFamily: BRUSH, fontSize: 58, color: COL.ink }}>{it.text}</div></div>; })}
    </div>
  </Abs>;
};

// ---------- las 38 fotos de cumpleaños (la grilla se llena) ----------
export const PhotoGrid: React.FC<{ t: number; at: number; out: number; n?: number; x?: number; y?: number }> = ({ t, at, out, n = 38, x = 1360, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const shown = Math.floor(n * e(t, at, at + 2.2));
  return <Abs x={x} y={y} o={o} tr={`rotateY(${-16 + 3 * Math.sin(t * 0.5)}deg) rotateX(6deg)`}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 76px)", gap: 8, padding: 18, ...PAPER }}>
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ width: 76, height: 92, background: i < shown ? "#f4efe4" : "transparent", padding: 4, boxShadow: i < shown ? "0 4px 8px rgba(0,0,0,.3)" : undefined, transform: `rotate(${(rnd(i, 2) - 0.5) * 8}deg)` }}>
        {i < shown && <div style={{ width: "100%", height: 64, background: `linear-gradient(180deg, hsl(${30 + i}, 25%, ${70 - i * 0.6}%), hsl(${20 + i}, 20%, ${40 - i * 0.3}%))`, position: "relative" }}>
          <div style={{ position: "absolute", left: 30, top: 18 + i * 0.1, width: 14, height: 34 - i * 0.12, borderRadius: 7, background: "#2a2018" }} /></div>}
        {i < shown && <div style={{ fontFamily: FONT, fontSize: 13, color: "#6b5a48", textAlign: "center" }}>{63 + i}</div>}
      </div>)}
    </div>
    <div style={{ textAlign: "center", fontFamily: BRUSH, fontSize: 66, color: COL.cream, textShadow: extrude(4, "#000"), marginTop: 10 }}>{shown} birthdays · same door</div>
  </Abs>;
};

// ---------- el SOBRE: el monto se decide antes, se da una vez, sin hilo ----------
export const Envelope: React.FC<{ t: number; at: number; seal: number; cut: number; out: number; x?: number; y?: number }> = ({ t, at, seal, cut, out, x = 1400, y = 500 }) => {
  const o = op(t, at, out), k = Math.min(1, spr(t, at, 0.8)); if (o <= 0.01) return null;
  const sl = ei(t, seal, seal + 0.5), ct = e(t, cut, cut + 0.5);
  return <Abs x={x} y={y} o={o} tr={`rotateY(${-12 + 3 * Math.sin(t * 0.7)}deg) scale(${0.7 + 0.3 * k})`}>
    <div style={{ position: "relative", width: 560, height: 340 }}>
      <div style={{ position: "absolute", left: 60, top: -60 + 80 * sl, width: 440, height: 200, background: "#6c8f5a", borderRadius: 6, opacity: 1 - sl * 0.9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: "#eef3e6" }}>AN AMOUNT THAT DOES NOT HURT</div>
      <div style={{ position: "absolute", inset: 0, ...PAPER, background: "linear-gradient(180deg,#f6f1e4,#e9e0cc)" }} />
      <svg width={560} height={340} style={{ position: "absolute", inset: 0 }}><path d={`M0 0 L280 ${190 * sl + 10} L560 0`} fill="#efe6d2" stroke="rgba(120,100,70,.5)" strokeWidth={3} /></svg>
      {/* el hilo que se corta */}
      <svg width={760} height={340} style={{ position: "absolute", left: 540, top: 0, opacity: 1 - ct }}><path d={`M0 170 C 80 ${170 - 60 * (1 - ct)}, 140 220, ${200 - 120 * ct} 170`} fill="none" stroke={COL.red} strokeWidth={5} /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center", fontFamily: BRUSH, fontSize: 60, color: COL.cream, textShadow: extrude(4, "#000"), opacity: ct }}>a gift · no string</div>
    </div>
  </Abs>;
};

// ---------- el RELOJ de la radio: las noticias UNA vez (cuña roja de 15 min a las 7) ----------
export const NewsClock: React.FC<{ t: number; at: number; out: number; hour?: number; x?: number; y?: number; label?: string }> = ({ t, at, out, hour = 7, x = 1440, y = 500, label = "7:00 · 15 MIN" }) => {
  const o = op(t, at, out), k = Math.min(1, spr(t, at, 0.8)); if (o <= 0.01) return null;
  const w = ei(t, at + 0.4, at + 1.2), a0 = (hour / 12) * 360 - 90, a1 = a0 + 90 * 0.25 * 4 * 0.25 * w * 4;
  const R = 190, rad = (d: number) => (d * Math.PI) / 180;
  const arc = `M220 220 L${220 + R * Math.cos(rad(a0))} ${220 + R * Math.sin(rad(a0))} A${R} ${R} 0 0 1 ${220 + R * Math.cos(rad(a1))} ${220 + R * Math.sin(rad(a1))} Z`;
  return <Abs x={x} y={y} o={o} tr={`rotateY(${-14 + 3 * Math.sin(t * 0.6)}deg) scale(${0.7 + 0.3 * k})`}>
    <svg width={440} height={440} style={{ filter: SH }}>
      <circle cx={220} cy={220} r={210} fill={COL.cream} stroke="#4a3220" strokeWidth={16} />
      <path d={arc} fill={COL.red} opacity={0.85} />
      {Array.from({ length: 12 }, (_, i) => { const a = rad(i * 30 - 60); return <text key={i} x={220 + 160 * Math.cos(a)} y={232 + 160 * Math.sin(a)} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={COL.ink}>{i + 1}</text>; })}
      <circle cx={220} cy={220} r={10} fill={COL.ink} />
    </svg>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 5, color: COL.cream, textShadow: extrude(4, "#000"), marginTop: 6 }}>{label}</div>
  </Abs>;
};

// ---------- la canilla que gotea: drip, drip, drip ----------
export const Drip: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1420, y = 380 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    <svg width={500} height={560} style={{ filter: SH }}>
      <rect x={60} y={40} width={260} height={50} rx={20} fill="#9aa3a8" /><rect x={260} y={60} width={50} height={90} rx={12} fill="#9aa3a8" /><rect x={130} y={10} width={60} height={40} rx={10} fill="#7d868b" />
      {[0, 1, 2].map((i) => { const ph = ((t - at) * 0.9 + i / 3) % 1; return <ellipse key={i} cx={285} cy={160 + ph * 330} rx={12} ry={18} fill="#9fc6e0" opacity={1 - ph * 0.6} />; })}
      {[0, 1, 2].map((i) => <text key={i} x={330} y={220 + i * 110} fontFamily={BRUSH} fontSize={60} fill={COL.cream} opacity={e(t, at + 0.3 + i * 0.45, at + 0.5 + i * 0.45)}>drip</text>)}
    </svg>
  </Abs>;
};

// ---------- la RED chica: 4 hilos, un nudo por día ----------
export const NetWeek: React.FC<{ t: number; out: number; items: { at: number; day: string; text: string }[]; y?: number }> = ({ t, out, items, y = 520 }) => {
  const a = items[0].at - 0.4, o = op(t, a, out); if (o <= 0.01) return null;
  const P = [[520, 300], [1400, 300], [520, 760], [1400, 760]];
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: SH }}>
      {items.map((it, i) => { const k = e(t, it.at, it.at + 0.5), [px, py] = P[i]; return <line key={i} x1={960} y1={y} x2={960 + (px - 960) * k} y2={y + (py - y) * k} stroke={COL.cream} strokeWidth={5} />; })}
      <circle cx={960} cy={y} r={46} fill={COL.red} stroke={COL.cream} strokeWidth={5} />
      <text x={960} y={y + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={COL.cream}>HER</text>
    </svg>
    {items.map((it, i) => { const k = spr(t, it.at + 0.3, 1.1); if (t < it.at + 0.3) return null; const [px, py] = P[i];
      return <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) scale(${Math.min(1.05, k)})`, ...PAPER, padding: "14px 26px", borderLeft: `10px solid ${COL.red}`, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: COL.red, letterSpacing: 4 }}>{it.day}</div>
        <div style={{ fontFamily: BRUSH, fontSize: 46, color: COL.ink }}>{it.text}</div></div>; })}
  </div>;
};

// ---------- 95 y 31: la amiga más nueva ----------
export const AgeGap: React.FC<{ t: number; at: number; at2: number; out: number; y?: number }> = ({ t, at, at2, out, y = 470 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k1 = spr(t, at, 0.9), k2 = spr(t, at2, 0.9), L = ei(t, at2 + 0.3, at2 + 0.9);
  const N = (v: number, k: number, x: number, lab: string) => <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.05, k)})`, textAlign: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 220, color: COL.cream, textShadow: extrude(14, "#5a4632"), lineHeight: 1 }}>{v}</div>
    <div style={{ fontFamily: BRUSH, fontSize: 56, color: COL.cream, textShadow: extrude(3, "#000") }}>{lab}</div></div>;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    {N(95, k1, 620, "her")}
    {t > at2 && N(31, k2, 1300, "her newest friend")}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M780 ${y} Q 960 ${y - 160} ${780 + 360 * L} ${y}`} fill="none" stroke={COL.red} strokeWidth={8} strokeLinecap="round" /></svg>
  </div>;
};

// ---------- 9 borradores: hojas arrugadas que caen · la última, corta, queda ----------
export const Drafts: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; last?: string }> = ({ t, at, out, x = 1380, y = 520, last = "I only remember that I miss you." }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    <div style={{ position: "relative", width: 640, height: 520 }}>
      {Array.from({ length: 8 }, (_, i) => { const a = at + i * 0.16, k = e(t, a, a + 0.4); if (k <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: 60 + rnd(i, 3) * 420, top: 380 + rnd(i, 4) * 80, width: 110, height: 90, borderRadius: "40% 55% 45% 60%", background: "#efe6d2", boxShadow: "0 10px 20px rgba(0,0,0,.45)", transform: `translateY(${(1 - k) * -360}px) rotate(${rnd(i, 5) * 360}deg)`, opacity: k }} />; })}
      <div style={{ position: "absolute", left: 90, top: 30, width: 460, ...PAPER, padding: "26px 30px", opacity: e(t, at + 1.4, at + 1.7), transform: `rotate(-2deg) scale(${0.8 + 0.2 * e(t, at + 1.4, at + 1.9)})` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: COL.red }}>DRAFT 9</div>
        <div style={{ fontFamily: BRUSH, fontSize: 50, color: COL.ink, lineHeight: 1.15, marginTop: 8 }}>{last}</div>
      </div>
    </div>
  </Abs>;
};

// ---------- "gracias, me enseñaste algo, ya te podés ir": la frase se vuelve grulla y se va ----------
export const LetGo: React.FC<{ t: number; at: number; fly: number; out: number; text: string; y?: number }> = ({ t, at, fly, out, text, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const f = ei(t, fly, fly + 1.6);
  return <Abs x={960 + 700 * f} y={y - 420 * f} o={1 - f * 0.9} tr={`scale(${1 - 0.6 * f}) rotate(${-8 * f}deg)`}>
    <div style={{ ...PAPER, padding: "22px 50px 28px", clipPath: "polygon(0% 6%, 3% 0%, 25% 4%, 58% 1%, 88% 0%, 100% 4%, 98% 52%, 100% 96%, 70% 95%, 33% 96%, 4% 95%, 0% 100%, 2% 50%)" }}>
      <div style={{ fontFamily: BRUSH, fontSize: 72, color: COL.ink, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  </Abs>;
};

// ---------- UN DÍA de la madre a los 80: la esfera del día con sus marcas ----------
export const DayRing: React.FC<{ t: number; out: number; marks: { at: number; h: number; text: string }[]; x?: number; y?: number }> = ({ t, out, marks, x = 1420, y = 540 }) => {
  const a = marks[0].at - 0.5, o = op(t, a, out), k = Math.min(1, spr(t, a, 0.8)); if (o <= 0.01) return null;
  const cur = marks.filter((m) => t >= m.at - 0.2).length - 1;
  const R = 230, ang = (h: number) => ((h - 6) / 18) * 300 - 240;
  return <Abs x={x} y={y} o={o} tr={`rotateX(${10 * (1 - k)}deg) scale(${0.7 + 0.3 * k})`}>
    <svg width={620} height={620} style={{ filter: SH, overflow: "visible" }}>
      <circle cx={310} cy={310} r={R} fill="rgba(251,246,234,.92)" stroke="#4a3220" strokeWidth={12} />
      {marks.map((m, i) => { const r = (ang(m.h) * Math.PI) / 180, on = i <= cur, now = i === cur;
        return <g key={i} opacity={on ? 1 : 0.25}>
          <circle cx={310 + R * Math.cos(r)} cy={310 + R * Math.sin(r)} r={now ? 18 : 11} fill={now ? COL.red : COL.ink} />
          {(i === 0 || m.h - marks[i - 1].h >= 0.9) && <text x={310 + (R - 46) * Math.cos(r)} y={318 + (R - 46) * Math.sin(r)} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={COL.ink}>{m.h > 12.9 ? Math.floor(m.h - 12) : Math.floor(m.h)}{m.h % 1 ? ":30" : ""}</text>}
        </g>; })}
      {cur >= 0 && <text x={310} y={322} textAnchor="middle" fontFamily={BRUSH} fontSize={50} fill={COL.red}>{marks[cur].text}</text>}
    </svg>
  </Abs>;
};

// ---------- las preocupaciones en sus "cuartitos" (cada una con su lugar) ----------
export const Rooms: React.FC<{ t: number; out: number; items: { at: number; text: string }[]; y?: number }> = ({ t, out, items, y = 520 }) => {
  const a = items[0].at - 0.4, o = op(t, a, out); if (o <= 0.01) return null;
  return <Abs x={960} y={y} o={o} tr="rotateX(14deg)">
    <div style={{ display: "flex", gap: 22 }}>{items.map((it, i) => { const k = spr(t, it.at, 1.0); if (t < it.at) return <div key={i} style={{ width: 330 }} />;
      return <div key={i} style={{ width: 330, height: 260, background: "#3b2618", borderRadius: 8, padding: 14, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
        <div style={{ width: "100%", height: "100%", background: "#f4e3b8", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: BRUSH, fontSize: 50, color: COL.ink, boxShadow: "inset 0 0 40px rgba(255,190,110,.6)" }}>{it.text}</div></div>; })}</div>
  </Abs>;
};

// ---------- "WHAT IF" = puerta a un cuarto oscuro · "IF…, THEN…" = puerta con un plan detrás ----------
export const WhatIf: React.FC<{ t: number; at: number; at2: number; out: number; y?: number }> = ({ t, at, at2, out, y = 520 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k1 = spr(t, at, 0.9), k2 = spr(t, at2, 0.9), d2 = ei(t, at2 + 0.3, at2 + 1.0);
  const Door = (x: number, k: number, dark: boolean, label: string, open: number) => <Abs x={x} y={y} o={Math.min(1, k)} tr={`scale(${Math.min(1.04, k)})`}>
    <div style={{ width: 300, height: 440, background: dark ? "#07070a" : "#ffe2a8", position: "relative", boxShadow: dark ? "0 30px 60px rgba(0,0,0,.6)" : "0 0 120px rgba(255,210,140,.8)", border: "14px solid #4a3220" }}>
      {!dark && <div style={{ position: "absolute", left: 40, top: 80, fontFamily: BRUSH, fontSize: 46, color: COL.ink, lineHeight: 1.2 }}>if it rains,<br />we dance<br />in the hall</div>}
      <div style={{ position: "absolute", inset: 0, background: "#6a3f22", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-open * 75}deg)`, boxShadow: "inset 0 0 0 6px #4a2a14" }} />
    </div>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: dark ? "#ffb39a" : COL.cream, textShadow: extrude(4, "#000"), marginTop: 14 }}>{label}</div>
  </Abs>;
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    {Door(620, k1, true, "WHAT IF…?", ei(t, at + 0.3, at + 1.0))}
    {t > at2 && Door(1300, k2, false, "IF…, THEN…", d2)}
  </div>;
};
