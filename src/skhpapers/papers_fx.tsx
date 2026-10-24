// skhpapers · piezas NUEVAS de este video (los papeles): washi, sumi, bermellón, índigo de la carpeta azul.
// Todas reciben segundos GLOBALES ya anclados con at("frase") desde Main.tsx.
import React from "react";
import { BRUSH, COL, FONT, e, ei, extrude, rnd, spr } from "./lib";
import { BrushStrike } from "./ink";

const vis = (t: number, at: number, out: number, fi = 0.15, fo = 0.3) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
const PAPER: React.CSSProperties = { background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", borderRadius: 4 };
const TORN = "polygon(0% 6%, 3% 0%, 12% 4%, 25% 0%, 41% 5%, 58% 1%, 74% 5%, 88% 0%, 100% 4%, 98% 52%, 100% 96%, 86% 100%, 70% 95%, 52% 100%, 33% 96%, 18% 100%, 4% 95%, 0% 100%, 2% 50%)";
const SH = "drop-shadow(0 6px 14px rgba(0,0,0,.75))";
const Abs: React.FC<{ x: number; y: number; o: number; children: React.ReactNode; tr?: string }> = ({ x, y, o, children, tr = "" }) =>
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr}` }}>{children}</div>;
const reveal = (t: number, a: number, d = 0.6) => `inset(-20% ${100 - 100 * ei(t, a, a + d)}% -20% -5%)`;
export const BLUE = "#2d5fa8";

// ---------- cada regla: la tarjeta grande "RULE N" con su nombre escrito a pincel ----------
export const RuleCard: React.FC<{ t: number; at: number; out: number; n: number; text: string; x?: number; y?: number }> = ({ t, at, out, n, text, x = 960, y = 820 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9);
  return <Abs x={x} y={y} o={o} tr={`rotate(-1.5deg) scaleX(${0.7 + 0.3 * Math.min(1, k)})`}>
    <div style={{ ...PAPER, clipPath: TORN, padding: "18px 70px 30px", textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 9, color: COL.red }}>RULE {n} OF 11</div>
      <div style={{ fontFamily: BRUSH, fontSize: 86, color: COL.ink, whiteSpace: "nowrap", clipPath: reveal(t, at + 0.15, 0.8) }}>{text}</div>
    </div>
  </Abs>;
};

// ---------- 11 casilleros arriba: cuántas reglas van (la de ahora late) ----------
export const RuleTrack: React.FC<{ t: number; at: number; out: number; cur: number }> = ({ t, at, out, cur }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", right: 70, top: 70, display: "flex", gap: 10, opacity: o, filter: SH }}>
    {Array.from({ length: 11 }, (_, i) => { const on = i < cur, now = i === cur - 1, p = now ? 1 + 0.12 * Math.max(0, Math.sin((t - at) * 5)) * (1 - e(t, at + 1.5, at + 2)) : 1;
      return <div key={i} style={{ width: 44, height: 56, borderRadius: 4, background: on ? COL.red : "rgba(251,246,234,.82)", color: on ? COL.cream : COL.ink, fontFamily: BRUSH, fontSize: 34, textAlign: "center", lineHeight: "56px", transform: `scale(${p})` }}>{i + 1}</div>; })}
  </div>;
};

// ---------- el reloj de cocina de 15 minutos (gira y suena) ----------
export const Timer15: React.FC<{ t: number; at: number; ring: number; out: number; x?: number; y?: number }> = ({ t, at, ring, out, x = 1440, y = 480 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9)), g = 1 - ei(t, at + 0.3, ring), shake = t > ring && t < ring + 1.2 ? Math.sin(t * 70) * 6 : 0;
  return <Abs x={x} y={y} o={o} tr={`scale(${k}) rotate(${shake}deg)`}>
    <svg width={420} height={460} style={{ filter: SH }}>
      <rect x={185} y={10} width={50} height={40} rx={8} fill="#ddd2bd" />
      <circle cx={210} cy={250} r={190} fill={COL.cream} stroke="#d9cdb6" strokeWidth={14} />
      <path d={`M 210 250 L 210 80 A 170 170 0 ${g > 0.5 ? 1 : 0} 1 ${210 + 170 * Math.sin(g * Math.PI * 2)} ${250 - 170 * Math.cos(g * Math.PI * 2)} Z`} fill={COL.red} opacity={0.85} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={210 + 150 * Math.sin(i * Math.PI / 6)} y1={250 - 150 * Math.cos(i * Math.PI / 6)} x2={210 + 172 * Math.sin(i * Math.PI / 6)} y2={250 - 172 * Math.cos(i * Math.PI / 6)} stroke={COL.ink} strokeWidth={6} />)}
      <circle cx={210} cy={250} r={26} fill={COL.ink} />
      <text x={210} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={COL.ink}>{Math.ceil(15 * g)} min</text>
    </svg>
    {t > ring && <div style={{ position: "absolute", left: "50%", top: -40, transform: "translateX(-50%)", fontFamily: BRUSH, fontSize: 80, color: COL.gold, textShadow: extrude(4, "#2a2018"), opacity: e(t, ring, ring + 0.1) }}>ring!</div>}
  </Abs>;
};

// ---------- bolsa de papel que se llena (con contador de bolsas) ----------
export const BagFill: React.FC<{ t: number; at: number; out: number; n?: number; label?: string; x?: number; y?: number; dur?: number }> = ({ t, at, out, n = 1, label = "", x = 1440, y = 560, dur = 2.5 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const bags = Math.min(n, Math.ceil(n * ei(t, at, at + dur)) || 1);
  return <Abs x={x} y={y} o={o}>
    <div style={{ display: "flex", gap: 14, alignItems: "flex-end", filter: SH }}>
      {Array.from({ length: Math.min(bags, 8) }, (_, i) => { const f = i < bags - 1 ? 1 : ((t - at) * n / dur) % 1 || 1;
        return <svg key={i} width={150} height={200} style={{ transform: `translateY(${(1 - Math.min(1, spr(t, at + i * dur / n, 1.2))) * 60}px)` }}>
          {Array.from({ length: 6 }, (_, j) => <rect key={j} x={22 + rnd(i * 9 + j) * 60} y={190 - 150 * Math.min(1, f) - j * 6} width={70} height={90} fill={["#f4efe2", "#e9dcc0", "#dfe7ee", "#f1e2c8"][j % 4]} transform={`rotate(${(rnd(j, i) - 0.5) * 40} 75 120)`} />)}
          <path d="M 10 40 L 140 40 L 132 196 L 18 196 Z" fill="#b98a55" />
          <path d="M 10 40 L 30 26 L 120 26 L 140 40" fill="#a37744" />
        </svg>; })}
    </div>
    <div style={{ textAlign: "center", marginTop: 10, fontFamily: BRUSH, fontSize: 70, color: COL.cream, textShadow: extrude(4, "#2a2018") }}>{n > 1 ? `${bags} ${label || "bags"}` : label}</div>
  </Abs>;
};

// ---------- la pila de papel que crece (o se achica) con una regla de altura ----------
export const PileGrow: React.FC<{ t: number; at: number; out: number; from?: number; to?: number; dur?: number; label: string; x?: number; y?: number }> = ({ t, at, out, from = 0, to = 1, dur = 2.5, label, x = 1450, y = 620 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const h = from + (to - from) * ei(t, at + 0.2, at + 0.2 + dur), N = Math.round(40 * h);
  return <Abs x={x} y={y} o={o}>
    <svg width={420} height={520} style={{ filter: SH }}>
      {Array.from({ length: N }, (_, i) => <rect key={i} x={70 + (rnd(i, 3) - 0.5) * 16} y={490 - i * 11} width={260} height={10} rx={1} fill={i % 3 ? "#efe7d6" : "#e2d5b9"} stroke="#c9b893" strokeWidth={1} />)}
      {[0.25, 0.5, 0.75, 1].map((q, i) => <g key={i}><line x1={360} y1={500 - q * 440} x2={390} y2={500 - q * 440} stroke={COL.cream} strokeWidth={4} /></g>)}
      <line x1={375} y1={500} x2={375} y2={60} stroke={COL.cream} strokeWidth={4} />
    </svg>
    <div style={{ textAlign: "center", fontFamily: BRUSH, fontSize: 62, color: COL.cream, textShadow: extrude(4, "#2a2018"), marginTop: -10 }}>{label}</div>
  </Abs>;
};

// ---------- el correo se reparte en la puerta: bolsa / canasta ----------
export const MailSort: React.FC<{ t: number; at: number; out: number; items: { at: number; text: string; to: 0 | 1 }[]; y?: number }> = ({ t, at, out, items, y = 640 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const X = [560, 1360];
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>
    {["paper bag", "basket"].map((l, i) => <Abs key={l} x={X[i]} y={y + 170} o={1}><div style={{ ...PAPER, padding: "14px 40px", fontFamily: BRUSH, fontSize: 64, color: i ? COL.indigo : COL.red, borderTop: `10px solid ${i ? COL.indigo : COL.red}` }}>{l}</div></Abs>)}
    {items.map((it, i) => { const p = ei(t, it.at, it.at + 0.7), sx = 960, ex = X[it.to], xx = sx + (ex - sx) * p, yy = y - 260 + 300 * p - 180 * Math.sin(p * Math.PI);
      return t >= it.at - 0.05 && <Abs key={i} x={xx} y={yy} o={1 - e(t, it.at + 0.9, it.at + 1.2)} tr={`rotate(${(1 - p) * -10 + p * (it.to ? 6 : -6)}deg) scale(${1 - 0.35 * p})`}>
        <div style={{ width: 330, height: 180, background: "#f6f1e4", border: "3px solid #d8ccb3", boxShadow: "0 16px 30px rgba(0,0,0,.45)", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.ink, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 14 }}>{it.text}</div>
      </Abs>; })}
  </div>;
};

// ---------- el papelito amarillo "ASK" ----------
export const Sticky: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; x?: number; y?: number; rot?: number }> = ({ t, at, out, text, sub, x = 1440, y = 420, rot = 5 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 1.1);
  return <Abs x={x} y={y} o={o} tr={`rotate(${rot}deg) scale(${1.6 - 0.6 * Math.min(1, k)})`}>
    <div style={{ width: 330, minHeight: 300, background: "linear-gradient(180deg,#fde68a,#f8d65c)", boxShadow: "0 24px 40px rgba(0,0,0,.5)", padding: "40px 26px", textAlign: "center" }}>
      <div style={{ fontFamily: BRUSH, fontSize: 120, color: "#2b2a28", lineHeight: 1 }}>{text}</div>
      {sub && <div style={{ fontFamily: BRUSH, fontSize: 40, color: "#5b4a18", marginTop: 14 }}>{sub}</div>}
    </div>
  </Abs>;
};

// ---------- papel citado: una frase manuscrita en una tarjeta (cartas, notas, la tarjeta de Michiko) ----------
export const Quote: React.FC<{ t: number; at: number; out: number; text: string; who?: string; x?: number; y?: number; w?: number; rot?: number; size?: number; vertical?: boolean }> = ({ t, at, out, text, who, x = 1360, y = 500, w = 780, rot = -3, size = 62 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotate(${rot}deg) rotateY(${(1 - Math.min(1, k)) * -50}deg)`}>
    <div style={{ width: w, ...PAPER, background: "linear-gradient(180deg,#fbf6ea,#efe4cc)", padding: "36px 46px 34px", borderLeft: `10px solid ${COL.red}`,
      backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(43,63,99,.18) 62px 64px)" }}>
      <div style={{ fontFamily: BRUSH, fontSize: size, color: COL.ink, lineHeight: 1.08, clipPath: reveal(t, at + 0.15, Math.min(2.2, 0.04 * text.length)) }}>“{text}”</div>
      {who && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: COL.red, marginTop: 18, textAlign: "right" }}>— {who}</div>}
    </div>
  </Abs>;
};

// ---------- de muchos a pocos: N papelitos que se van y quedan K (300 cartas → 10, 50 cuadernos → 3) ----------
export const Funnel: React.FC<{ t: number; at: number; cut: number; out: number; n: number; keep: number; top: string; bot: string; x?: number; y?: number; col?: string }> = ({ t, at, cut, out, n, keep, top, bot, x = 1400, y = 520, col = COL.red }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const cols = Math.ceil(Math.sqrt(n * 1.6)), cell = Math.min(36, 560 / cols), g = ei(t, cut, cut + 1.4);
  const shown = Math.round(n - (n - keep) * g);
  return <Abs x={x} y={y} o={o}>
    <div style={{ ...PAPER, padding: "24px 30px 26px", width: cols * cell + 60 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: COL.ink, textAlign: "center" }}>{top}</div>
      <div style={{ display: "flex", flexWrap: "wrap", width: cols * cell, margin: "12px auto", gap: 0 }}>
        {Array.from({ length: n }, (_, i) => { const keepIt = i % Math.max(1, Math.floor(n / keep)) === 0 && Math.floor(i / Math.max(1, Math.floor(n / keep))) < keep;
          const a = at + 0.2 + (i / n) * 0.8, gone = !keepIt ? e(t, cut + rnd(i) * 1.0, cut + rnd(i) * 1.0 + 0.4) : 0;
          return <div key={i} style={{ width: cell - 4, height: cell * 0.75, margin: 2, background: keepIt && t > cut ? col : "#d9ccb0", opacity: e(t, a, a + 0.2) * (1 - gone), transform: `translateY(${gone * 40}px)` }} />; })}
      </div>
      <div style={{ textAlign: "center", fontFamily: BRUSH, fontSize: 66, color: t > cut ? col : COL.ink }}>{t > cut + 0.2 ? `${shown} — ${bot}` : `${n}`}</div>
    </div>
  </Abs>;
};

// ---------- la carpeta AZUL con su única página (el mapa) ----------
export const BlueFolder: React.FC<{ t: number; at: number; open: number; out: number; items: { at: number; text: string }[]; x?: number; y?: number }> = ({ t, at, open, out, items, x = 1360, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8), op = ei(t, open, open + 0.7);
  return <Abs x={x} y={y} o={o} tr={`perspective(1600px) rotateX(${12 - 12 * op}deg) scale(${0.8 + 0.2 * Math.min(1, k)})`}>
    <div style={{ position: "relative", width: 820, height: 600 }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg,#3a73c4,${BLUE})`, borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,.55)" }} />
      <div style={{ position: "absolute", left: 40, top: 30, right: 40, bottom: 30, ...PAPER, padding: "30px 40px", opacity: op }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: BLUE }}>ONE PAGE · WHERE THINGS ARE</div>
        {items.map((it, i) => { const q = e(t, it.at, it.at + 0.3);
          return <div key={i} style={{ fontFamily: BRUSH, fontSize: 48, color: COL.ink, opacity: 0.15 + 0.85 * q, transform: `translateX(${(1 - q) * -20}px)`, margin: "4px 0" }}>· {it.text}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 600, background: `linear-gradient(160deg,#4a85d6,${BLUE})`, borderRadius: 10, transformOrigin: "50% 0", transform: `rotateX(${op * 100}deg)`, backfaceVisibility: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BRUSH, fontSize: 110, color: "rgba(255,255,255,.92)" }}>the blue folder</div>
    </div>
  </Abs>;
};

// ---------- calendario: 4 días buscando (cada día se tacha) ----------
export const DaysCross: React.FC<{ t: number; at: number; out: number; n: number; label: string; x?: number; y?: number }> = ({ t, at, out, n, label, x = 1420, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o} tr="rotate(-2deg)">
    <div style={{ display: "flex", gap: 16 }}>
      {Array.from({ length: n }, (_, i) => { const a = at + 0.3 + i * 0.45, c = ei(t, a, a + 0.3);
        return <div key={i} style={{ width: 150, ...PAPER, borderTop: `30px solid ${COL.red}`, textAlign: "center", padding: "10px 0 16px", position: "relative", opacity: e(t, a - 0.2, a) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: "#6b5a48" }}>DAY</div>
          <div style={{ fontFamily: BRUSH, fontSize: 96, color: COL.ink, lineHeight: 1 }}>{i + 1}</div>
          <svg width={150} height={160} style={{ position: "absolute", left: 0, top: -10 }}><path d="M 20 30 L 130 140 M 130 30 L 20 140" stroke={COL.red} strokeWidth={10} strokeLinecap="round" strokeDasharray={160} strokeDashoffset={160 * (1 - c)} /></svg>
        </div>; })}
    </div>
    <div style={{ textAlign: "center", fontFamily: BRUSH, fontSize: 62, color: COL.cream, textShadow: extrude(4, "#2a2018"), marginTop: 14 }}>{label}</div>
  </Abs>;
};

// ---------- el billete de tren de 1958 (Osaka → Kyoto) ----------
export const Ticket: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1400, y = 470 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o} tr={`rotate(${-8 + 4 * Math.sin(t * 0.6)}deg) scale(${0.6 + 0.4 * Math.min(1, k)})`}>
    <div style={{ width: 560, height: 300, background: "linear-gradient(180deg,#e9dcb8,#d9c79a)", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.6)", padding: "24px 34px", position: "relative", border: "3px dashed #8a7550" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: "#6b5a38" }}>JAPANESE NATIONAL RAILWAYS · 3RD CLASS</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <div style={{ fontFamily: BRUSH, fontSize: 84, color: COL.ink }}>Osaka</div>
        <div style={{ fontFamily: FONT, fontSize: 60, color: COL.red }}>→</div>
        <div style={{ fontFamily: BRUSH, fontSize: 84, color: COL.ink }}>Kyoto</div>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 20, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.red }}>1958</div>
      <div style={{ position: "absolute", left: 34, bottom: 22, fontFamily: BRUSH, fontSize: 40, color: "#6b5a38" }}>age 12 · alone</div>
    </div>
  </Abs>;
};

// ---------- un error: tarjeta "MISTAKE N" con la X de pincel ----------
export const Mistake: React.FC<{ t: number; at: number; out: number; n: number; text: string; fix?: string; fixAt?: number; x?: number; y?: number }> = ({ t, at, out, n, text, fix, fixAt = 1e9, x = 960, y = 800 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.9);
  return <>
    <Abs x={x} y={y} o={o} tr={`rotate(1.5deg) scale(${0.85 + 0.15 * Math.min(1, k)})`}>
      <div style={{ ...PAPER, clipPath: TORN, padding: "18px 70px 30px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 9, color: COL.red }}>{n ? `MISTAKE ${n} OF 5` : "THE COMMON MISTAKE"}</div>
        <div style={{ fontFamily: BRUSH, fontSize: 84, color: COL.ink, whiteSpace: "nowrap" }}>{text}</div>
        {fix && <div style={{ fontFamily: BRUSH, fontSize: 56, color: COL.indigo, opacity: e(t, fixAt, fixAt + 0.3), whiteSpace: "nowrap" }}>→ {fix}</div>}
      </div>
    </Abs>
    <BrushStrike t={t} at={at + 0.9} out={out} x={x} y={y - (fix ? 20 : 0)} w={Math.min(1300, text.length * 40 + 120)} rot={-3} th={22} col={COL.red} />
  </>;
};

// ---------- la semana de papel (lunes a domingo, cada día se enciende con su tarea) ----------
export const Week: React.FC<{ t: number; out: number; days: { at: number; d: string; text: string }[]; x?: number; y?: number }> = ({ t, out, days, x = 960, y = 560 }) => {
  const o = vis(t, days[0].at - 0.4, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o}>
    <div style={{ display: "flex", gap: 12 }}>
      {days.map((it, i) => { const q = e(t, it.at, it.at + 0.3), now = t >= it.at && (i === days.length - 1 || t < days[i + 1].at);
        return <div key={i} style={{ width: 236, height: 330, ...PAPER, borderTop: `34px solid ${now ? COL.red : "#8f7f6a"}`, padding: "14px 16px", opacity: 0.25 + 0.75 * q, transform: `translateY(${(1 - q) * 30 - (now ? 16 : 0)}px)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: COL.ink }}>{it.d}</div>
          <div style={{ fontFamily: BRUSH, fontSize: 40, color: COL.ink, lineHeight: 1.1, marginTop: 10 }}>{it.text}</div>
        </div>; })}
    </div>
  </Abs>;
};

// ---------- el repaso: las 11 reglas en una hoja (cada línea se enciende) ----------
export const ElevenList: React.FC<{ t: number; out: number; items: { at: number; text: string }[]; x?: number; y?: number; title?: string }> = ({ t, out, items, x = 60, y = 50, title = "THE 11 RULES" }) => {
  const o = vis(t, items[0].at - 0.4, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, width: 860, ...PAPER, padding: "20px 34px 22px", borderTop: `14px solid ${COL.red}` }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: COL.red, marginBottom: 4 }}>{title}</div>
    {items.map((it, i) => { const k = e(t, it.at, it.at + 0.3);
      return <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", opacity: 0.16 + 0.84 * k, transform: `translateX(${(1 - k) * -30}px)` }}>
        <div style={{ fontFamily: BRUSH, fontSize: 38, color: COL.red, width: 40 }}>{i + 1}</div><div style={{ fontFamily: BRUSH, fontSize: 40, color: COL.ink, lineHeight: 1.12 }}>{it.text}</div>
      </div>; })}
  </div>;
};

// ---------- la hoja de la madre: 11 renglones (cosa → para quién), dos tachados por perdidos ----------
export const MotherList: React.FC<{ t: number; at: number; out: number; lines: { at: number; text: string }[]; lost?: { at: number; i: number }[]; x?: number; y?: number }> = ({ t, at, out, lines, lost = [], x = 1380, y = 540 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.8);
  return <Abs x={x} y={y} o={o} tr={`perspective(1400px) rotateX(${(1 - k) * 60}deg) rotate(-2deg)`}>
    <div style={{ width: 760, ...PAPER, background: "linear-gradient(180deg,#f3ead2,#e6d7b4)", padding: "30px 44px", backgroundImage: "linear-gradient(90deg, transparent 0 32%, rgba(0,0,0,.06) 32% 33%, transparent 33% 66%, rgba(0,0,0,.06) 66% 67%, transparent 67%)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: COL.red }}>FUMIKO'S LIST · 11 LINES</div>
      {lines.map((it, i) => { const q = e(t, it.at, it.at + 0.3), ls = lost.find((l) => l.i === i), c = ls ? ei(t, ls.at, ls.at + 0.4) : 0;
        return <div key={i} style={{ position: "relative", fontFamily: BRUSH, fontSize: 44, color: COL.ink, opacity: 0.12 + 0.88 * q, margin: "2px 0" }}>{i + 1}. {it.text}
          {ls && <div style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${90 * c}%`, background: COL.red, borderRadius: 4 }} />}</div>; })}
    </div>
  </Abs>;
};

// ---------- sobre "OPEN THIS FIRST" que se apoya sobre la carpeta azul ----------
export const OpenFirst: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1400, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o}>
    <div style={{ position: "relative", width: 760, height: 520 }}>
      <div style={{ position: "absolute", left: 40, top: 80, width: 680, height: 420, background: `linear-gradient(160deg,#4a85d6,${BLUE})`, borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 80, top: 40, width: 600, height: 380, background: "linear-gradient(180deg,#fbf6ea,#efe4cc)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${-4 + 4 * Math.min(1, k)}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <svg width={600} height={200} style={{ position: "absolute", top: 0, left: 0 }}><path d="M 0 0 L 300 150 L 600 0" fill="none" stroke="#d6c7a6" strokeWidth={4} /></svg>
        <div style={{ fontFamily: BRUSH, fontSize: 104, color: COL.red, marginTop: 90 }}>Open this first</div>
      </div>
    </div>
  </Abs>;
};

// ---------- 41 bolsas / 1 hoja: la balanza al revés del cierre ----------
export const BagsVsLines: React.FC<{ t: number; at: number; flip: number; out: number; x?: number; y?: number }> = ({ t, at, flip, out, x = 960, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const f = ei(t, flip, flip + 0.9);
  const L = (a: string, b: string, c: string, d: string) => <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
    <div style={{ textAlign: "center" }}><div style={{ fontFamily: BRUSH, fontSize: 200, color: COL.cream, textShadow: extrude(6, "#2a2018"), lineHeight: 1 }}>{a}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: COL.cream, textShadow: extrude(3, "#000") }}>{b}</div></div>
    <div style={{ fontFamily: BRUSH, fontSize: 90, color: COL.gold }}>+</div>
    <div style={{ textAlign: "center" }}><div style={{ fontFamily: BRUSH, fontSize: 200, color: COL.cream, textShadow: extrude(6, "#2a2018"), lineHeight: 1 }}>{c}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: COL.cream, textShadow: extrude(3, "#000") }}>{d}</div></div>
  </div>;
  return <Abs x={x} y={y} o={o}>
    <div style={{ opacity: 1 - f, transform: `translateY(${-60 * f}px)` }}>{L("41", "BAGS OF PAPER", "1", "SHEET · 11 LINES")}</div>
    <div style={{ position: "absolute", left: 0, top: 0, opacity: f, transform: `translateY(${60 * (1 - f)}px)` }}>{L("41", "LINES", "1", "BAG")}</div>
  </Abs>;
};

// ---------- la próxima: tarjeta índigo ----------
export const NextVideo: React.FC<{ t: number; at: number; out: number; title: React.ReactNode; sub: string; x?: number; y?: number }> = ({ t, at, out, title, sub, x = 1340, y = 500 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = spr(t, at, 0.8);
  return <Abs x={x} y={y} o={o} tr={`rotate(-2deg) scale(${0.8 + 0.2 * Math.min(1, k)})`}>
    <div style={{ width: 780, padding: "34px 44px 40px", borderRadius: 10, background: "linear-gradient(180deg,#1b2440,#2b3f63)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: COL.gold }}>NEXT VIDEO</div>
      <div style={{ fontFamily: BRUSH, fontSize: 80, lineHeight: 1.05, color: COL.cream, marginTop: 14 }}>{title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#cfd9f0", marginTop: 16, opacity: e(t, at + 1.2, at + 1.6) }}>{sub}</div>
    </div>
  </Abs>;
};

// ---------- KEEP / GO: dos columnas, cada cosa cae en la suya ----------
export const KeepGo: React.FC<{ t: number; out: number; items: { at: number; text: string; keep: boolean }[]; x?: number; y?: number; left?: string; right?: string }> = ({ t, out, items, x = 1500, y = 520, left = "KEEP", right = "GO" }) => {
  const o = vis(t, items[0].at - 0.4, out); if (o <= 0.01) return null;
  return <Abs x={x} y={y} o={o} tr="rotate(-1.5deg)">
    <div style={{ display: "flex", gap: 20 }}>
      {[true, false].map((kp) => <div key={String(kp)} style={{ width: 400, minHeight: 420, ...PAPER, borderTop: `16px solid ${kp ? COL.indigo : COL.red}`, padding: "16px 22px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: kp ? COL.indigo : COL.red }}>{kp ? left : right}</div>
        {items.filter((it) => it.keep === kp).map((it, i) => { const q = spr(t, it.at, 1.1);
          return t >= it.at && <div key={i} style={{ fontFamily: BRUSH, fontSize: 46, color: COL.ink, lineHeight: 1.1, margin: "8px 0", transform: `translateY(${(1 - Math.min(1, q)) * -80}px)`, opacity: e(t, it.at, it.at + 0.15) }}>{it.text}</div>; })}
      </div>)}
    </div>
  </Abs>;
};
