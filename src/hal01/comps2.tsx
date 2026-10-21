// hal01 · COMPONENTES NUEVOS de los minutos 2-15 (cada llamada trae los suyos; nada reciclado del minuto 1 salvo lo base).
// Todos reciben t (segundo global) y sus tiempos salen de at("frase") en Rest.tsx. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { COL, FONT, e, ei, extrude, spr } from "./lib";

const pop = (t: number, a: number, out = 1e9, k = 1) => ({ k: Math.min(1.06, spr(t, a, k)), o: e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25)) });
const S = (n: number) => Math.min(1, n);
const H1: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.65)") };

// ===================== tarjeta de llamada entrante: 7 caras distintas (una por tipo de estafador) =====================
export type CallKind = "lcd" | "robot" | "angry" | "badge" | "utility" | "tech" | "win" | "bank";
const KIND: Record<CallKind, { bg: string; fg: string; head: string; font: string }> = {
  lcd: { bg: "linear-gradient(180deg,#9fb98a,#86a372)", fg: "#1d2a14", head: "☎ INCOMING CALL", font: "'Courier New',monospace" },
  robot: { bg: "linear-gradient(180deg,#0e1a24,#05090d)", fg: "#6fe3ff", head: "◉ AUTOMATED MESSAGE", font: "'Courier New',monospace" },
  angry: { bg: "linear-gradient(180deg,#3a0d0b,#1a0504)", fg: "#ff6b5e", head: "⚠ URGENT · FEDERAL", font: "Georgia,serif" },
  badge: { bg: "linear-gradient(180deg,#14233d,#0a1222)", fg: "#ffd37a", head: "★ SHERIFF'S OFFICE", font: "Georgia,serif" },
  utility: { bg: "linear-gradient(180deg,#2b2a12,#141307)", fg: "#ffe25a", head: "⚡ ELECTRIC COMPANY", font: "Arial,sans-serif" },
  tech: { bg: "linear-gradient(180deg,#0b2a4a,#061527)", fg: "#9fd2ff", head: "🖥 TECHNICAL SUPPORT", font: "Consolas,monospace" },
  win: { bg: "linear-gradient(135deg,#ffcf3f,#ff7ab6)", fg: "#2a0a2a", head: "★ CONGRATULATIONS ★", font: "Arial Black,Arial,sans-serif" },
  bank: { bg: "linear-gradient(180deg,#e9eef5,#cfd8e4)", fg: "#16243a", head: "FRAUD DEPARTMENT", font: "Arial,sans-serif" },
};
export const CallCard: React.FC<{ t: number; at: number; out: number; kind: CallKind; who: string; line: string; x?: number; y?: number; cps?: number }> = ({ t, at: a, out, kind, who, line, x = 960, y = 470, cps = 22 }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const K = KIND[kind], n = Math.min(line.length, Math.floor(Math.max(0, t - a - 0.35) * cps));
  const shake = kind === "angry" ? Math.sin(t * 60) * 3 * (1 - e(t, a, a + 1)) : 0;
  return (
    <div style={{ position: "absolute", left: x + shake, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateX(${(1 - S(k)) * 60 + 6}deg) rotateY(-6deg) scale(${0.8 + 0.2 * S(k)})` }}>
      <div style={{ width: 1180, borderRadius: 28, overflow: "hidden", background: K.bg, boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,255,255,.25)", fontFamily: K.font, color: K.fg }}>
        <div style={{ padding: "18px 36px", fontSize: 30, letterSpacing: 6, fontWeight: 900, background: "rgba(0,0,0,.18)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: Math.sin(t * 12) > -0.3 ? 1 : 0.4 }}>{K.head}</span><span>{who}</span>
        </div>
        <div style={{ padding: "28px 40px 34px", fontSize: 56, fontWeight: 800, lineHeight: 1.18, minHeight: 150 }}>
          {kind === "robot" && <Bars t={t} col={K.fg} />}
          “{line.slice(0, n)}<span style={{ opacity: n < line.length ? 1 : 0 }}>▌</span>{n >= line.length ? "”" : ""}
        </div>
      </div>
    </div>
  );
};
const Bars: React.FC<{ t: number; col: string }> = ({ t, col }) => (
  <div style={{ display: "flex", gap: 6, height: 50, alignItems: "center", marginBottom: 12 }}>
    {Array.from({ length: 48 }, (_, i) => <div key={i} style={{ width: 9, height: 8 + Math.abs(Math.sin(t * 9 + i * 0.7) * Math.cos(i * 0.31)) * 42, background: col, borderRadius: 4, opacity: 0.8 }} />)}
  </div>
);

// ===================== #N gigante que entra girando (número de la llamada) =====================
export const CallNo: React.FC<{ t: number; at: number; out: number; n: number; title: string }> = ({ t, at: a, out, n, title }) => {
  const { k, o } = pop(t, a, out, 0.8);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1480, top: 300, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - S(k)) * -90 - 8}deg)`, textAlign: "center" }}>
      <div style={{ ...H1, fontSize: 260, lineHeight: 0.9, color: "#ffe066", textShadow: extrude(18, "#6b4e00") }}>#{n}</div>
      <div style={{ ...H1, fontSize: 54, letterSpacing: 6, marginTop: 10 }}>{title}</div>
    </div>
  );
};

// ===================== ficha "LO QUE YO DIGO": tarjeta de índice escrita a mano por Hal =====================
export const Reply: React.FC<{ t: number; at: number; out: number; text: string; x?: number; y?: number; rot?: number }> = ({ t, at: a, out, text, x = 960, y = 560, rot = -3 }) => {
  const { k, o } = pop(t, a, out, 1);
  if (o <= 0.01) return null;
  const n = Math.min(text.length, Math.floor(Math.max(0, t - a - 0.25) * 20));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) translateY(${(1 - S(k)) * 300}px)` }}>
      <div style={{ width: 900, padding: "26px 44px 40px", background: "repeating-linear-gradient(180deg,#fffef8 0 52px,#9ec3e6 52px 54px)", borderTop: "8px solid #d9534f", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 6, color: "#b3261e" }}>WHAT I SAY</div>
        <div style={{ fontFamily: "'Segoe Print','Bradley Hand','Comic Sans MS',cursive", fontSize: 76, color: "#1d2c63", lineHeight: 1.15, marginTop: 6 }}>{text.slice(0, n)}</div>
      </div>
    </div>
  );
};

// ===================== tachar una palabra y escribir otra (FOOLISH → POLITE) =====================
export const SwapWord: React.FC<{ t: number; a: number; b: number; out: number; from: string; to: string; y?: number }> = ({ t, a, b, out, from, to, y = 380 }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const cut = e(t, a + 0.5, a + 0.8), nw = spr(t, b, 1);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o }}>
      <span style={{ ...H1, fontSize: 130, position: "relative", opacity: 1 - 0.55 * e(t, b, b + 0.3) }}>{from}
        <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 16, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${cut}) rotate(-3deg)`, boxShadow: "0 0 18px rgba(255,74,61,.8)" }} /></span>
      <div style={{ ...H1, fontSize: 150, color: "#6fe39a", textShadow: extrude(12, "#0f4a26"), transform: `scale(${S(nw)})`, opacity: e(t, b, b + 0.1) }}>{to}</div>
    </div>
  );
};

// ===================== EL SCAMMER SIEMPRE TIENE APURO: cartel con líneas de velocidad =====================
export const Hurry: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const x = (1 - ei(t, a, a + 0.45)) * 1400;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a0f0c, #0b0202)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 40 }, (_, i) => { const y = 80 + ((i * 97) % 920), L = 200 + ((i * 53) % 500), sp = ((t * 2600 + i * 211) % 2600) - 400; return <rect key={i} x={1920 - sp} y={y} width={L} height={4 + (i % 3) * 2} fill="rgba(255,190,150,.35)" />; })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", transform: `translateX(${x}px) skewX(-12deg)` }}>
        <div style={{ ...H1, fontSize: 92, letterSpacing: 4 }}>THE SCAMMER IS</div>
        <div style={{ ...H1, fontSize: 230, color: COL.red, textShadow: extrude(18, "#4a0e0a"), lineHeight: 1 }}>ALWAYS IN A HURRY</div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== REAL vs SCAMMER: dos relojes (el real espera 10 min, el falso se rompe) =====================
export const WaitSplit: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const clock = (x: number, col: string, mins: number, broken: boolean, lab: string, sub: string, at: number) => {
    const k = spr(t, at, 0.9), ang = mins * 36;
    return (
      <div style={{ position: "absolute", left: x, top: 520, transform: `translate(-50%,-50%) scale(${S(k)})`, opacity: e(t, at, at + 0.1), textAlign: "center" }}>
        <svg width={420} height={420} viewBox="-210 -210 420 420">
          <circle r={190} fill="#f7f2e6" stroke={col} strokeWidth={16} />
          <path d={`M0 0 L0 -170 A170 170 0 ${ang > 180 ? 1 : 0} 1 ${170 * Math.sin((ang * Math.PI) / 180)} ${-170 * Math.cos((ang * Math.PI) / 180)} Z`} fill={col} opacity={0.25} />
          <line x1={0} y1={0} x2={150 * Math.sin((ang * Math.PI) / 180)} y2={-150 * Math.cos((ang * Math.PI) / 180)} stroke="#1b1b1b" strokeWidth={10} strokeLinecap="round" />
          {broken && <path d="M-120 -150 L-30 -40 L-80 20 L10 90 L-20 180" stroke="#1b1b1b" strokeWidth={8} fill="none" opacity={e(t, at + 0.9, at + 1.1)} />}
        </svg>
        <div style={{ ...H1, fontSize: 66, color: col }}>{lab}</div>
        <div style={{ ...H1, fontSize: 36, letterSpacing: 5 }}>{sub}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg,#0d2a1c 0%,#0d2a1c 50%,#2a0d0d 50%,#2a0d0d 100%)" }} />
      {clock(500, "#6fe39a", Math.min(10, (t - a) * 4), false, "REAL", "CAN WAIT 10 MIN", a)}
      {clock(1420, COL.red, 0.4 + Math.sin(t * 30) * 0.2, true, "SCAMMER", "“NO TIME!”", b)}
    </AbsoluteFill>
  );
};

// ===================== el hueco del nombre: él NO lo dice, VOS lo completás =====================
export const NameSlot: React.FC<{ t: number; a: number; you: number; out: number }> = ({ t, a, you, out }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const nm = "TOMMY", n = Math.min(nm.length, Math.floor(Math.max(0, t - you) * 9));
  return (
    <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%)", opacity: o, textAlign: "center" }}>
      <div style={{ ...H1, fontSize: 54, letterSpacing: 6, color: COL.dim }}>“GRANDPA, IT'S ME, ...”</div>
      <div style={{ marginTop: 26, display: "inline-block", minWidth: 620, padding: "18px 40px", borderBottom: `10px dashed ${n ? COL.red : "#cfd6df"}`, ...H1, fontSize: 140, color: n ? COL.red : "rgba(244,239,230,.25)" }}>{n ? nm.slice(0, n) : "?????"}</div>
      <div style={{ ...H1, fontSize: 44, letterSpacing: 6, marginTop: 20, color: n ? COL.red : COL.amber }}>{n ? "← YOU GAVE IT TO HIM" : "HE NEVER SAYS HIS NAME"}</div>
    </div>
  );
};

// ===================== AMOR vs LÓGICA: carrera de dos barras =====================
export const LoveLogic: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const L = ei(t, a + 0.2, a + 1.2), G = ei(t, a + 0.2, a + 3.5) * 0.45;
  const bar = (y: number, lab: string, v: number, col: string, ico: string) => (
    <div style={{ position: "absolute", left: 200, top: y, width: 1520 }}>
      <div style={{ ...H1, fontSize: 56, marginBottom: 10 }}>{ico} {lab}</div>
      <div style={{ height: 70, borderRadius: 35, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 35, background: col, boxShadow: `0 0 30px ${col}` }} /></div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: "rgba(8,10,16,.6)" }}>
      {bar(330, "LOVE", L, "#ff6b8b", "♥")}
      {bar(560, "LOGIC", G, "#7fb2ff", "⚙")}
      <div style={{ position: "absolute", right: 200, top: 760, ...H1, fontSize: 60, color: "#ff6b8b", opacity: e(t, a + 1.2, a + 1.5) }}>LOVE WINS. EVERY TIME.</div>
    </AbsoluteFill>
  );
};

// ===================== clonar la voz: video corto → muestra de 3 s → copia exacta =====================
export const VoiceClone: React.FC<{ t: number; a: number; copy: number; out: number }> = ({ t, a, copy, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const wave = (x: number, col: string, rev: number, lab: string) => (
    <div style={{ position: "absolute", left: x, top: 470, width: 700, transform: "translateX(-50%)", opacity: rev }}>
      <svg width={700} height={220}>{Array.from({ length: 70 }, (_, i) => { const h = 20 + Math.abs(Math.sin(i * 0.53) * Math.cos(i * 0.17)) * 180; return <rect key={i} x={i * 10} y={110 - h / 2} width={6} height={h * rev} rx={3} fill={col} />; })}</svg>
      <div style={{ ...H1, fontSize: 42, textAlign: "center", color: col, letterSpacing: 4 }}>{lab}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 40%,rgba(18,26,42,.62),rgba(5,7,12,.62))" }}>
      <div style={{ position: "absolute", left: 480, top: 230, transform: "translateX(-50%)", width: 420, height: 230, borderRadius: 22, border: "6px solid #2b3446", background: "#0b0f17", display: "flex", alignItems: "center", justifyContent: "center", ...H1, fontSize: 40 }}>▶ GRANDSON · 0:03</div>
      {wave(480, "#7fb2ff", e(t, a + 0.3, a + 0.8), "HIS REAL VOICE")}
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${S(spr(t, copy))})`, ...H1, fontSize: 120, color: COL.amber, opacity: e(t, copy, copy + 0.1) }}>→</div>
      {wave(1440, COL.red, e(t, copy + 0.2, copy + 0.8), "COMPUTER COPY")}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", ...H1, fontSize: 50, color: COL.ink, opacity: e(t, copy + 1, copy + 1.3) }}>GOOD ENOUGH FOR A BAD PHONE LINE</div>
    </AbsoluteFill>
  );
};

// ===================== agenda de teléfonos de papel (el número que YA tenés) =====================
export const AddressBook: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const rows = [["SUSAN (daughter)", "773 · · · · 18"], ["TOMMY (grandson)", "312 · · · · 40"], ["DR. KAPLAN", "773 · · · · 02"], ["CHURCH OFFICE", "773 · · · · 77"]];
  return (
    <div style={{ position: "absolute", left: 1350, top: 540, opacity: o, transform: `translate(-50%,-50%) perspective(1100px) rotateY(${(1 - S(k)) * 70 - 14}deg) rotateZ(3deg)` }}>
      <div style={{ width: 640, padding: "30px 36px", background: "#f4ecd8", borderLeft: "26px solid #7a2e2e", boxShadow: "0 40px 70px rgba(0,0,0,.55)", fontFamily: "'Segoe Print','Comic Sans MS',cursive", color: "#1d2c63" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 6, color: "#7a2e2e" }}>PHONE BOOK</div>
        {rows.map(([n, p], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 38, padding: "10px 6px", borderBottom: "2px solid #c9bfa6", background: i === 1 ? `rgba(255,224,102,${0.8 * e(t, a + 0.8, a + 1.1)})` : undefined }}><span>{n}</span><span>{p}</span></div>
        ))}
      </div>
    </div>
  );
};

// ===================== telón: ACTO II (entra el "abogado") =====================
export const Curtain: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a || o <= 0.01) return null;
  const op = ei(t, a + 0.6, a + 1.6);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%,#3b2a14,#0b0703)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", ...H1, fontSize: 200, color: "#ffd37a", textShadow: extrude(14, "#4a3000") }}>ACT II</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", ...H1, fontSize: 56, letterSpacing: 8 }}>“THE LAWYER”</div>
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", top: 0, bottom: 0, width: 980, [s ? "right" : "left"]: -op * 900, background: "repeating-linear-gradient(90deg,#7a0f16 0 60px,#5c0a10 60px 120px)", boxShadow: "0 0 60px rgba(0,0,0,.8)" } as React.CSSProperties} />)}
    </AbsoluteFill>
  );
};

// ===================== mapa: el auto del "mensajero" llega a TU puerta =====================
export const CourierMap: React.FC<{ t: number; a: number; know: number; out: number }> = ({ t, a, know, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const u = ei(t, a + 0.3, a + 3.2);
  const path = [[260, 860], [260, 560], [760, 560], [760, 300], [1380, 300], [1380, 520]];
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])), tot = seg.reduce((x, y) => x + y, 0);
  let d = u * tot, cx = path[0][0], cy = path[0][1];
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { cx = path[i][0] + (path[i + 1][0] - path[i][0]) * d / seg[i]; cy = path[i][1] + (path[i + 1][1] - path[i][1]) * d / seg[i]; break; } d -= seg[i]; cx = path[i + 1][0]; cy = path[i + 1][1]; }
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "#e8e4da" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 9 }, (_, i) => <rect key={"h" + i} x={0} y={60 + i * 120} width={1920} height={34} fill="#cfc9bb" />)}
        {Array.from({ length: 12 }, (_, i) => <rect key={"v" + i} x={20 + i * 170} y={0} width={34} height={1080} fill="#cfc9bb" />)}
        <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke={COL.red} strokeWidth={12} strokeDasharray="30 18" strokeLinecap="round" opacity={0.8} />
        <g transform={`translate(1380 560)`}><rect x={-70} y={-40} width={140} height={100} fill="#a0522d" /><polygon points="-90,-40 0,-110 90,-40" fill="#5a2d1a" /><rect x={-16} y={10} width={32} height={50} fill="#3a2416" /></g>
        <g transform={`translate(${cx} ${cy})`}><rect x={-34} y={-20} width={68} height={40} rx={10} fill="#555c66" /><circle cx={-20} cy={22} r={9} fill="#111" /><circle cx={20} cy={22} r={9} fill="#111" /></g>
      </svg>
      <div style={{ position: "absolute", left: 1380, top: 640, transform: "translateX(-50%)", ...H1, fontSize: 40, color: "#2a1a10", textShadow: "none" }}>YOUR HOUSE</div>
      {[["YOUR FACE", 1080, 760], ["YOUR ADDRESS", 1620, 760]].map(([l, x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x as number, top: y as number, transform: `translate(-50%,-50%) scale(${S(spr(t, know + i * 0.35))})`, opacity: e(t, know + i * 0.35, know + i * 0.35 + 0.1), padding: "12px 26px", borderRadius: 40, background: COL.red, ...H1, fontSize: 40, textShadow: "none" }}>📍 THEY KNOW {l}</div>
      ))}
      <div style={{ position: "absolute", left: 260, top: 920, transform: "translateX(-50%)", ...H1, fontSize: 34, color: "#2a1a10", textShadow: "none" }}>“COURIER”</div>
    </AbsoluteFill>
  );
};

// ===================== factura falsa de Medicare: renglones que se cobran a tu nombre =====================
export const FakeBill: React.FC<{ t: number; a: number; times: number[]; out: number }> = ({ t, a, times, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const rows: [string, number][] = [["POWER WHEELCHAIR", 3850], ["BACK BRACE", 1120], ["GENETIC LAB TEST", 9400]];
  const tot = rows.reduce((s, r, i) => s + (t > times[i] ? r[1] : 0), 0);
  return (
    <div style={{ position: "absolute", left: 1240, top: 540, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - S(k)) * 70 - 10}deg) rotateX(4deg)` }}>
      <div style={{ width: 760, padding: "34px 44px", background: "#fbfbf7", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: "'Courier New',monospace", color: "#222" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4 }}>CLAIMS BILLED UNDER YOUR NUMBER</div>
        {rows.map(([n, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 38, fontWeight: 700, padding: "16px 0", borderBottom: "2px dashed #bbb", opacity: e(t, times[i], times[i] + 0.15), transform: `translateX(${(1 - e(t, times[i], times[i] + 0.25)) * 60}px)` }}><span>{n}</span><span>${v.toLocaleString("en-US")}</span></div>)}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 46, fontWeight: 900, paddingTop: 18, color: COL.red }}><span>YOU NEVER SAW IT</span><span>${tot.toLocaleString("en-US")}</span></div>
      </div>
    </div>
  );
};

// ===================== filtración: carpetas con tus datos que vuelan a un "mercado" =====================
export const DataLeak: React.FC<{ t: number; a: number; times: number[]; sold: number; out: number }> = ({ t, a, times, sold, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const labs = ["NAME", "ADDRESS", "BIRTHDAY", "DOCTOR"];
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 30% 50%,rgba(17,26,40,.62),rgba(4,6,10,.62))" }}>
      <div style={{ position: "absolute", left: 300, top: 540, transform: "translate(-50%,-50%)", width: 260, height: 380, borderRadius: 18, background: "linear-gradient(180deg,#2a3242,#141922)", boxShadow: "0 0 0 4px #3b4558", display: "flex", flexDirection: "column", justifyContent: "space-around", padding: 24 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: 34, borderRadius: 6, background: "#0b0f15", boxShadow: `inset 0 0 0 2px #3b4558, 14px 0 0 -8px ${Math.sin(t * 9 + i) > 0 ? "#6fe39a" : "#2a3"}` }} />)}
      </div>
      <div style={{ position: "absolute", left: 300, top: 790, transform: "translateX(-50%)", ...H1, fontSize: 34, color: COL.red }}>COMPANY HACKED</div>
      {labs.map((l, i) => { const u = ei(t, times[i], times[i] + 1.0); return (
        <div key={i} style={{ position: "absolute", left: 420 + u * 1050, top: 300 + i * 140 - Math.sin(u * Math.PI) * 120, opacity: e(t, times[i], times[i] + 0.1), transform: `translate(-50%,-50%) rotate(${(1 - u) * -12}deg)`, padding: "14px 30px", background: "#ecd59e", borderRadius: "6px 6px 6px 6px", boxShadow: "0 16px 30px rgba(0,0,0,.6)", ...H1, fontSize: 40, color: "#3a2a12", textShadow: "none" }}>📁 {l}</div>
      ); })}
      <div style={{ position: "absolute", left: 1560, top: 540, transform: `translate(-50%,-50%) scale(${S(spr(t, sold))})`, opacity: e(t, sold, sold + 0.1), textAlign: "center" }}>
        <div style={{ ...H1, fontSize: 90, color: COL.amber }}>SOLD</div>
        <div style={{ ...H1, fontSize: 44 }}>ONLINE · BY THE 1,000s</div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== tarjeta 3D que se da vuelta: el número está ATRÁS =====================
export const CardFlip: React.FC<{ t: number; a: number; out: number; front: string; back: string; col?: string }> = ({ t, a, out, front, back, col = "#26415e" }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const f = ei(t, a + 0.7, a + 1.4) * 180;
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) translateY(${(1 - S(k)) * 500}px)` }}>
      <div style={{ position: "relative", width: 860, height: 540, transformStyle: "preserve-3d", transform: `rotateY(${f}deg) rotateX(8deg)` }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 34, background: `linear-gradient(135deg,${col},#0e1a2b)`, boxShadow: "0 50px 90px rgba(0,0,0,.6)", padding: 50, fontFamily: FONT, color: "#fff" }}>
          <div style={{ width: 120, height: 90, borderRadius: 14, background: "linear-gradient(135deg,#e8c66a,#a8842e)" }} />
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 8, marginTop: 120 }}>•••• •••• •••• 4471</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, marginTop: 20, opacity: 0.85 }}>{front}</div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 34, background: "linear-gradient(180deg,#e9edf2,#cfd6df)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", overflow: "hidden", fontFamily: FONT }}>
          <div style={{ height: 110, background: "#111", marginTop: 50 }} />
          <div style={{ margin: "60px 50px 0", padding: "20px 28px", borderRadius: 14, background: "#fff8d0", boxShadow: `0 0 0 6px ${COL.amber}`, fontSize: 50, fontWeight: 900, color: "#1b1b1b" }}>{back}</div>
          <div style={{ margin: "26px 50px", fontSize: 30, fontWeight: 800, color: "#5a6372", letterSpacing: 4 }}>THE ONLY NUMBER YOU CALL</div>
        </div>
      </div>
    </div>
  );
};

// ===================== resumen con un renglón resaltado (estado de cuenta) =====================
export const Statement: React.FC<{ t: number; at: number; hi: number; out: number }> = ({ t, at: a, hi, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const rows = [["OFFICE VISIT · DR. KAPLAN", "$140"], ["FLU SHOT", "$0"], ["KNEE BRACE · DME SUPPLIER", "$1,280"], ["BLOOD PANEL", "$62"]];
  return (
    <div style={{ position: "absolute", left: 1300, top: 560, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - S(k)) * -70 - 8}deg) rotateZ(-2deg)` }}>
      <div style={{ width: 780, padding: "30px 40px", background: "#fbfbf7", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: "'Courier New',monospace", color: "#222" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: 5 }}>SUMMARY NOTICE · 3 MONTHS</div>
        {rows.map(([n, v], i) => (
          <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 700, padding: "14px 0", borderBottom: "2px dashed #bbb" }}>
            {i === 2 && <div style={{ position: "absolute", left: -10, top: 6, bottom: 6, width: `${e(t, hi, hi + 0.5) * 104}%`, background: "rgba(255,224,60,.7)" }} />}
            <span style={{ position: "relative" }}>{n}</span><span style={{ position: "relative" }}>{v}</span>
          </div>
        ))}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.red, marginTop: 16, opacity: e(t, hi + 0.5, hi + 0.8) }}>NEVER ORDERED IT →  CALL</div>
      </div>
    </div>
  );
};

// ===================== robollamada: teclado con el "1" que late =====================
export const PressOne: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a, out, x = 1560, y = 640 }) => {
  const { k, o } = pop(t, a, out, 1);
  if (o <= 0.01) return null;
  const beat = 1 + 0.08 * Math.max(0, Math.sin(t * 8));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateX(24deg) scale(${S(k)})` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,110px)", gap: 16, padding: 26, borderRadius: 26, background: "#e9dcc0", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
        {"123456789*0#".split("").map((c, i) => <div key={i} style={{ height: 90, borderRadius: 14, background: c === "1" ? COL.red : "#f6f0e2", color: c === "1" ? "#fff" : "#333", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, transform: c === "1" ? `scale(${beat})` : undefined, boxShadow: c === "1" ? "0 0 30px rgba(255,74,61,.9)" : "0 4px 0 #cbbf9f" }}>{c}</div>)}
      </div>
      <div style={{ ...H1, fontSize: 44, textAlign: "center", marginTop: 16, color: COL.red }}>DON'T.</div>
    </div>
  );
};

// ===================== torta de cumpleaños con sello CANCELLED (el chiste del SSN) =====================
export const Cake: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1450, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})` }}>
      <svg width={520} height={460} viewBox="0 0 520 460">
        <ellipse cx={260} cy={420} rx={240} ry={30} fill="rgba(0,0,0,.35)" />
        <rect x={60} y={250} width={400} height={160} rx={20} fill="#f6c9d6" /><rect x={60} y={250} width={400} height={40} rx={20} fill="#fff" />
        <rect x={120} y={140} width={280} height={120} rx={16} fill="#f9dbe4" /><rect x={120} y={140} width={280} height={30} rx={14} fill="#fff" />
        {[170, 230, 290, 350].map((x) => <g key={x}><rect x={x - 8} y={80} width={16} height={60} fill="#7fb2ff" /><ellipse cx={x} cy={70 + Math.sin(t * 14 + x) * 3} rx={9} ry={16} fill="#ffcf5a" /></g>)}
      </svg>
      <div style={{ position: "absolute", left: 260, top: 280, transform: `translate(-50%,-50%) rotate(-14deg) scale(${2.2 - 1.2 * S(spr(t, a + 0.6, 1.3))})`, opacity: e(t, a + 0.6, a + 0.66), border: `10px solid ${COL.red}`, borderRadius: 14, padding: "4px 24px", ...H1, fontSize: 80, color: COL.red, textShadow: "none", background: "rgba(255,255,255,.6)" }}>CANCELLED?</div>
    </div>
  );
};

// ===================== cadena de la estafa: ROBOT → APRETÁS 1 → "OFICIAL" → MOVÉ TU PLATA =====================
export const Chain: React.FC<{ t: number; steps: [string, number][]; out: number; col?: string }> = ({ t, steps, out, col = COL.amber }) => {
  const o = e(t, steps[0][1], steps[0][1] + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "center", gap: 0, opacity: o }}>
      {steps.map(([lab, at], i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ width: 120 * e(t, at - 0.25, at), height: 10, background: col, boxShadow: `0 0 16px ${col}` }} />}
          <div style={{ transform: `scale(${S(spr(t, at))})`, opacity: e(t, at, at + 0.1), padding: "26px 30px", borderRadius: 24, background: i === steps.length - 1 ? COL.red : "rgba(16,22,34,.92)", border: `4px solid ${col}`, ...H1, fontSize: 42, textAlign: "center", maxWidth: 330, textShadow: "none" }}>{lab}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

// ===================== contador que se queda en 0 (veces suspendido) =====================
export const Tally: React.FC<{ t: number; at: number; out: number; lab: string; to: number; x?: number; y?: number; col?: string }> = ({ t, at: a, out, lab, to, x = 1450, y = 330, col = "#6fe39a" }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const v = Math.round(to * ei(t, a + 0.2, a + 1.6));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})`, textAlign: "center", padding: "24px 44px", borderRadius: 26, background: "rgba(10,14,22,.9)", boxShadow: `0 0 0 4px ${col}, 0 30px 60px rgba(0,0,0,.6)` }}>
      <div style={{ ...H1, fontSize: 30, letterSpacing: 6, color: col, textShadow: "none" }}>{lab}</div>
      <div style={{ ...H1, fontSize: 170, lineHeight: 1, color: col, fontVariantNumeric: "tabular-nums" }}>{v.toLocaleString("en-US")}</div>
    </div>
  );
};

// ===================== identificador FALSIFICADO: la máscara se despega =====================
export const Spoof: React.FC<{ t: number; a: number; peel: number; out: number }> = ({ t, a, peel, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const p = ei(t, peel, peel + 0.9);
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - S(k)) * 50 + 8}deg)` }}>
      <div style={{ position: "relative", width: 1000, height: 330, borderRadius: 26, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.6), 0 0 0 16px #e9dcc0" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#3a0f0c,#1a0504)", padding: "40px 50px", fontFamily: "'Courier New',monospace", color: COL.red, fontWeight: 900 }}>
          <div style={{ fontSize: 34, letterSpacing: 4 }}>REAL ORIGIN</div>
          <div style={{ fontSize: 80 }}>CALL CENTER · OVERSEAS</div>
          <div style={{ fontSize: 40 }}>+?? ??? ??? ????</div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#9fb98a,#86a372)", padding: "40px 50px", fontFamily: "'Courier New',monospace", color: "#1d2a14", fontWeight: 900, transformOrigin: "0% 0%", transform: `rotate(${p * 28}deg) translate(${p * 700}px, ${p * 260}px)`, boxShadow: p > 0 ? "20px 20px 40px rgba(0,0,0,.5)" : undefined }}>
          <div style={{ fontSize: 34, letterSpacing: 4 }}>☎ INCOMING CALL</div>
          <div style={{ fontSize: 80 }}>YOUR BANK</div>
          <div style={{ fontSize: 40 }}>1-800-···-0199 ✓</div>
        </div>
      </div>
      <div style={{ ...H1, fontSize: 52, textAlign: "center", marginTop: 34, opacity: e(t, peel + 0.6, peel + 0.9), color: COL.amber }}>FAKING CALLER ID TAKES ABOUT A MINUTE</div>
    </div>
  );
};

// ===================== el código por SMS que se convierte en LLAVE =====================
export const CodeKey: React.FC<{ t: number; a: number; key_: number; out: number }> = ({ t, a, key_, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const code = "482917", n = Math.min(6, Math.floor(Math.max(0, t - a - 0.5) * 8)), kk = ei(t, key_, key_ + 0.8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 620, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - S(k)) * 600}px) rotate(-4deg)`, width: 420, height: 800, borderRadius: 56, background: "#111", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 0 10px #2a2a2a", padding: 34 }}>
        <div style={{ borderRadius: 30, background: "#f1f3f6", height: "100%", padding: 26, fontFamily: FONT }}>
          <div style={{ fontWeight: 800, fontSize: 24, color: "#666" }}>Messages · now</div>
          <div style={{ marginTop: 30, padding: "22px 24px", borderRadius: 26, background: "#e2e5ea", fontSize: 30, fontWeight: 700, color: "#222" }}>Your verification code is
            <div style={{ fontSize: 76, fontWeight: 900, letterSpacing: 8, color: "#16243a" }}>{code.slice(0, n)}</div>Do not share this code with anyone.</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1360, top: 330, transform: "translate(-50%,-50%)", ...H1, fontSize: 64, color: COL.amber, opacity: e(t, a + 1.2, a + 1.5) * (1 - kk) }}>“JUST READ IT BACK…”</div>
      <div style={{ position: "absolute", left: 1360, top: 600, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * kk}) rotate(${(1 - kk) * -40}deg)`, opacity: kk }}>
        <svg width={620} height={260} viewBox="0 0 620 260"><circle cx={130} cy={130} r={100} fill="none" stroke="#ffd37a" strokeWidth={44} /><rect x={220} y={108} width={380} height={44} fill="#ffd37a" /><rect x={480} y={150} width={40} height={70} fill="#ffd37a" /><rect x={550} y={150} width={40} height={50} fill="#ffd37a" /></svg>
        <div style={{ ...H1, fontSize: 56, textAlign: "center", color: "#ffd37a" }}>THE KEY TO YOUR ACCOUNT</div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== "cuenta segura": la plata se muda y la etiqueta se da vuelta =====================
export const SafeAcct: React.FC<{ t: number; a: number; flip: number; out: number }> = ({ t, a, flip, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const u = ei(t, a + 0.4, flip - 0.2), f = ei(t, flip, flip + 0.6);
  const box = (x: number, lab: string, amt: number, col: string, y = 560) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: 520, padding: "34px 30px", borderRadius: 30, background: "rgba(14,20,32,.94)", boxShadow: `0 0 0 5px ${col}, 0 40px 70px rgba(0,0,0,.6)`, textAlign: "center" }}>
      <div style={{ ...H1, fontSize: 40, letterSpacing: 4, color: col, textShadow: "none" }}>{lab}</div>
      <div style={{ ...H1, fontSize: 100, fontVariantNumeric: "tabular-nums" }}>${Math.round(amt).toLocaleString("en-US")}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 50%,rgba(18,26,40,.62),rgba(4,6,10,.62))" }}>
      {box(470, "YOUR SAVINGS", 412650 * (1 - u), "#7fb2ff")}
      <div style={{ position: "absolute", left: 1450, top: 560, transform: "translate(-50%,-50%)", perspective: 1000 }}>
        <div style={{ transform: `rotateX(${f * 180}deg)`, transformStyle: "preserve-3d", position: "relative", width: 520, height: 260 }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>{box(260, "NEW “SAFE ACCOUNT”", 412650 * u, "#6fe39a", 130)}</div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>{box(260, "THEIR ACCOUNT", 412650 * u, COL.red, 130)}</div>
        </div>
      </div>
      {Array.from({ length: 8 }, (_, i) => { const p = ((t - a) * 0.9 + i / 8) % 1; return u > 0.02 && u < 0.98 ? <div key={i} style={{ position: "absolute", left: 740 + p * 440, top: 540 - Math.sin(p * Math.PI) * 120, fontSize: 60, opacity: 0.9 }}>💵</div> : null; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", ...H1, fontSize: 70, color: COL.red, opacity: e(t, flip - 1.6, flip - 1.3) }}>THERE IS NO SAFE ACCOUNT</div>
    </AbsoluteFill>
  );
};

// ===================== reloj de 4 horas (el ingeniero al teléfono) =====================
export const Hours4: React.FC<{ t: number; a: number; out: number; x?: number; y?: number }> = ({ t, a, out, x = 1520, y = 330 }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const hrs = 4 * ei(t, a + 0.2, a + 3.0), ang = (hrs / 12) * 360 + 90, mang = (hrs % 1) * 360;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})`, textAlign: "center" }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300"><circle r={140} fill="#f7f2e6" stroke="#26415e" strokeWidth={12} />
        <path d={`M0 0 L0 -126 A126 126 0 ${hrs > 6 ? 1 : 0} 1 ${126 * Math.sin((((hrs / 12) * 360) * Math.PI) / 180)} ${-126 * Math.cos((((hrs / 12) * 360) * Math.PI) / 180)} Z`} fill="rgba(255,74,61,.35)" />
        <line x1={0} y1={0} x2={70 * Math.sin((ang * Math.PI) / 180)} y2={-70 * Math.cos((ang * Math.PI) / 180)} stroke="#111" strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={0} x2={105 * Math.sin((mang * Math.PI) / 180)} y2={-105 * Math.cos((mang * Math.PI) / 180)} stroke="#111" strokeWidth={6} strokeLinecap="round" /></svg>
      <div style={{ ...H1, fontSize: 60 }}>{hrs.toFixed(1)} HOURS</div>
    </div>
  );
};

// ===================== la línea que sigue abierta: el cable brilla en rojo hasta la sala =====================
export const RuleCard: React.FC<{ t: number; at: number; out: number; title: string; rows: string[]; times: number[] }> = ({ t, at: a, out, title, rows, times }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - S(k)) * 60 + 4}deg) rotate(-1.5deg)` }}>
      <div style={{ width: 1200, padding: "40px 56px", background: "#f6e27a", boxShadow: "0 50px 90px rgba(0,0,0,.6)", borderTop: "30px solid #8a2f2f" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#8a2f2f", letterSpacing: 4 }}>{title}</div>
        {rows.map((r, i) => <div key={i} style={{ fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 58, color: "#1d2c63", marginTop: 18, opacity: e(t, times[i], times[i] + 0.15), transform: `translateX(${(1 - e(t, times[i], times[i] + 0.3)) * -40}px)` }}>✗ {r}</div>)}
      </div>
    </div>
  );
};

// ===================== palabras de miedo que llueven (FEDERAL, IMMEDIATELY…) =====================
export const ScareWords: React.FC<{ t: number; a: number; out: number; words: string[] }> = ({ t, a, out, words }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      {words.map((w, i) => { const at = a + i * 0.28, k = spr(t, at, 1.2); const x = 260 + ((i * 523) % 1400), y = 200 + ((i * 331) % 640); return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${(i % 2 ? 1 : -1) * (6 + i)}deg) scale(${2 - S(k)})`, opacity: e(t, at, at + 0.06), ...H1, fontSize: 70 + (i % 3) * 20, color: i % 2 ? COL.red : "#ffd37a" }}>{w}</div>; })}
    </AbsoluteFill>
  );
};

// ===================== las 4 formas raras de pagar: fichas que se tachan juntas =====================
export const PayWall: React.FC<{ t: number; times: number[]; none: number; out: number }> = ({ t, times, none, out }) => {
  const o = e(t, times[0], times[0] + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const tiles = [["🎁", "GIFT CARDS"], ["🏦", "A WIRE"], ["🚗", "CASH COURIER"], ["₿", "CRYPTO MACHINE"]];
  return (
    <AbsoluteFill style={{ opacity: o, background: "rgba(6,8,12,.6)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 40 }}>
        {tiles.map(([ic, lab], i) => (
          <div key={i} style={{ position: "relative", width: 360, height: 400, borderRadius: 28, background: "linear-gradient(180deg,#1d2534,#0e131c)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 3px #39445a", transform: `translateY(${(1 - S(spr(t, times[i]))) * 500}px)`, opacity: e(t, times[i], times[i] + 0.1), textAlign: "center" }}>
            <div style={{ fontSize: 150, marginTop: 60 }}>{ic}</div>
            <div style={{ ...H1, fontSize: 40, marginTop: 20 }}>{lab}</div>
            <svg width={360} height={400} style={{ position: "absolute", inset: 0 }}><line x1={40} y1={40} x2={320} y2={360} stroke={COL.red} strokeWidth={18} strokeLinecap="round" strokeDasharray={430} strokeDashoffset={430 * (1 - e(t, none + i * 0.08, none + i * 0.08 + 0.2))} /><line x1={320} y1={40} x2={40} y2={360} stroke={COL.red} strokeWidth={18} strokeLinecap="round" strokeDasharray={430} strokeDashoffset={430 * (1 - e(t, none + i * 0.08 + 0.1, none + i * 0.08 + 0.3))} /></svg>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", ...H1, fontSize: 70, color: COL.red, opacity: e(t, none, none + 0.2) }}>NO REAL OFFICE TAKES ANY OF THESE</div>
    </AbsoluteFill>
  );
};

// ===================== lista de lo que la policía NO hace =====================
export const NeverList: React.FC<{ t: number; title: string; rows: [string, number][]; out: number; x?: number }> = ({ t, title, rows, out, x = 1300 }) => {
  const o = e(t, rows[0][1] - 0.2, rows[0][1]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 540, transform: "translate(-50%,-50%)", opacity: o, width: 900, padding: "36px 48px", borderRadius: 26, background: "rgba(12,18,30,.93)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px #3a4a66" }}>
      <div style={{ ...H1, fontSize: 40, letterSpacing: 6, color: "#ffd37a", textShadow: "none" }}>{title}</div>
      {rows.map(([r, at], i) => <div key={i} style={{ ...H1, fontSize: 52, marginTop: 20, opacity: e(t, at, at + 0.12), transform: `translateX(${(1 - e(t, at, at + 0.3)) * 60}px)`, textShadow: "none" }}><span style={{ color: COL.red }}>✗</span> {r}</div>)}
    </div>
  );
};

// ===================== cuenta regresiva de 45:00 (la luz te la cortan) =====================
export const Countdown: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a, out, x = 1460, y = 300 }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const left = Math.max(0, 45 * 60 - (t - a) * 60 * 3);
  const mm = Math.floor(left / 60), ss = Math.floor(left % 60);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})`, padding: "20px 40px", borderRadius: 24, background: "#0b0b0b", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 4px #333" }}>
      <div style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 150, color: "#ffe25a", textShadow: "0 0 26px rgba(255,226,90,.8)", letterSpacing: 6 }}>{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}</div>
      <div style={{ ...H1, fontSize: 34, letterSpacing: 6, textAlign: "center", color: "#ffe25a", textShadow: "none" }}>UNTIL SHUT-OFF</div>
    </div>
  );
};

// ===================== línea de tiempo de avisos reales (en papel, durante semanas) =====================
export const Notices: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const items = [["WEEK 1", "NOTICE"], ["WEEK 3", "2nd NOTICE"], ["WEEK 6", "FINAL NOTICE"]];
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 50%,rgba(26,31,43,.62),rgba(6,8,12,.62))" }}>
      <div style={{ position: "absolute", left: 220, right: 220, top: 640, height: 10, background: "#3b4558" }}><div style={{ width: `${e(t, a, a + 2.2) * 100}%`, height: "100%", background: "#6fe39a" }} /></div>
      {items.map(([w, l], i) => { const at = a + 0.3 + i * 0.6; return (
        <div key={i} style={{ position: "absolute", left: 360 + i * 600, top: 470, transform: `translate(-50%,-50%) translateY(${(1 - S(spr(t, at))) * -300}px) rotate(${(i - 1) * 4}deg)`, opacity: e(t, at, at + 0.1), width: 360, padding: "26px 24px", background: "#fbfbf7", boxShadow: "0 30px 60px rgba(0,0,0,.6)", textAlign: "center", fontFamily: "'Courier New',monospace", fontWeight: 900, color: "#222" }}>
          <div style={{ fontSize: 30 }}>✉ {w}</div><div style={{ fontSize: 44, marginTop: 10, color: i === 2 ? COL.red : "#222" }}>{l}</div>
        </div>); })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", ...H1, fontSize: 60 }}>ON PAPER · OVER WEEKS · NEVER 45 MINUTES</div>
    </AbsoluteFill>
  );
};

// ===================== termómetro de Chicago en enero =====================
export const ColdTemp: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const v = Math.round(30 - 34 * ei(t, a + 0.2, a + 1.6));
  return (
    <div style={{ position: "absolute", left: 1600, top: 470, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})`, textAlign: "center" }}>
      <div style={{ ...H1, fontSize: 170, color: "#bfe6ff", textShadow: extrude(12, "#0a2a40") }}>{v}°F</div>
      <div style={{ ...H1, fontSize: 40, letterSpacing: 6 }}>CHICAGO · JANUARY</div>
    </div>
  );
};

// ===================== ventana emergente de "virus" falsa (no tiene texto legible de marcas) =====================
export const Popup: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const { k, o } = pop(t, a, out, 1.2);
  if (o <= 0.01) return null;
  const fl = Math.sin(t * 18) > 0;
  return (
    <div style={{ position: "absolute", left: 960, top: 500, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})` }}>
      <div style={{ width: 1000, borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.7)", fontFamily: "Arial,sans-serif" }}>
        <div style={{ background: fl ? "#d81e1e" : "#a51010", color: "#fff", fontWeight: 900, fontSize: 40, padding: "16px 30px" }}>⚠ SECURITY ALERT ⚠</div>
        <div style={{ background: "#fff", padding: "30px 40px", fontSize: 44, fontWeight: 800, color: "#111" }}>Your computer is infected!<br />DO NOT TURN OFF.<div style={{ marginTop: 18, fontSize: 64, color: "#d81e1e" }}>CALL NOW: 1-8••-•••-••••</div></div>
      </div>
      <div style={{ ...H1, fontSize: 60, textAlign: "center", marginTop: 26, color: COL.amber }}>SAME SCAM</div>
    </div>
  );
};

// ===================== acceso remoto: el puntero se mueve solo y abre tus carpetas =====================
export const Remote: React.FC<{ t: number; a: number; times: number[]; fee: number; out: number }> = ({ t, a, times, fee, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const F = [["🏦", "BANK", 560], ["✉", "EMAIL", 960], ["🖼", "PICTURES", 1360]];
  let cx = 300, cy = 800;
  F.forEach(([, , x], i) => { const u = ei(t, times[i] - 0.5, times[i]); cx = cx + ((x as number) - cx) * u; cy = cy + (470 - cy) * u; });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#1f4f8f,#0d2c55)" }} />
      <div style={{ position: "absolute", left: 40, top: 30, ...H1, fontSize: 34, color: COL.red, textShadow: "none", opacity: Math.sin(t * 6) > 0 ? 1 : 0.4 }}>● REMOTE SESSION ACTIVE</div>
      {F.map(([ic, lab, x], i) => { const op = e(t, times[i], times[i] + 0.2); return (
        <div key={i} style={{ position: "absolute", left: x as number, top: 470, transform: `translate(-50%,-50%) scale(${1 + 0.15 * op})`, textAlign: "center" }}>
          <div style={{ fontSize: 140, filter: op > 0.5 ? "drop-shadow(0 0 20px #ffe066)" : undefined }}>{op > 0.5 ? "📂" : "📁"}</div>
          <div style={{ ...H1, fontSize: 40 }}>{ic} {lab}</div>
        </div>); })}
      <svg width={60} height={80} style={{ position: "absolute", left: cx, top: cy }}><path d="M2 2 L2 62 L18 46 L30 74 L40 70 L28 42 L50 42 Z" fill="#fff" stroke="#000" strokeWidth={3} /></svg>
      <div style={{ position: "absolute", left: 960, top: 820, transform: `translate(-50%,-50%) scale(${S(spr(t, fee))})`, opacity: e(t, fee, fee + 0.1), padding: "20px 40px", borderRadius: 18, background: "#fff", ...H1, fontSize: 56, color: "#111", textShadow: "none", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>“FIX” FEE: <span style={{ color: COL.red }}>$399.99</span></div>
    </AbsoluteFill>
  );
};

// ===================== premios que llueven (sorteo, lotería, auto, cheque) + la "tasa" =====================
export const Prizes: React.FC<{ t: number; times: number[]; out: number }> = ({ t, times, out }) => {
  const o = e(t, times[0], times[0] + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const P = [["🎟", "SWEEPSTAKES"], ["🎱", "LOTTERY"], ["🚙", "NEW CAR"], ["💰", "BIG CHECK"]];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {Array.from({ length: 60 }, (_, i) => { const y = ((t - times[0]) * (220 + (i % 7) * 40) + i * 47) % 1200 - 100; return <div key={i} style={{ position: "absolute", left: (i * 131) % 1920, top: y, width: 18, height: 30, background: ["#ffcf3f", "#ff7ab6", "#7fb2ff", "#6fe39a"][i % 4], transform: `rotate(${t * 200 + i * 40}deg)` }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", gap: 36 }}>
        {P.map(([ic, l], i) => <div key={i} style={{ width: 330, padding: "30px 0", borderRadius: 26, background: "linear-gradient(135deg,#ffcf3f,#ff9a3f)", textAlign: "center", transform: `scale(${S(spr(t, times[i]))}) rotate(${(i - 1.5) * 4}deg)`, opacity: e(t, times[i], times[i] + 0.1), boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}><div style={{ fontSize: 120 }}>{ic}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#2a0a2a" }}>{l}</div></div>)}
      </div>
    </AbsoluteFill>
  );
};

// ===================== pagar para ganar = pagar (ecuación) =====================
export const PayToWin: React.FC<{ t: number; a: number; eq: number; out: number }> = ({ t, a, eq, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 45%,rgba(28,26,16,.62),rgba(6,5,3,.62))" }}>
      <div style={{ position: "absolute", left: 160, right: 160, top: 200, textAlign: "center", ...H1, fontSize: 60, lineHeight: 1.15, color: "#ffd37a", opacity: e(t, a, a + 0.3) }}>⚖ IT'S AGAINST THE LAW<br />TO MAKE YOU PAY FOR A REAL PRIZE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: e(t, eq, eq + 0.2) }}>
        <div style={{ ...H1, fontSize: 110 }}>PAY</div><div style={{ ...H1, fontSize: 110, color: COL.amber }}>+</div><div style={{ ...H1, fontSize: 110 }}>“WIN”</div><div style={{ ...H1, fontSize: 110, color: COL.amber }}>=</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", ...H1, fontSize: 140, color: COL.red, transform: `scale(${S(spr(t, eq + 0.8))})`, opacity: e(t, eq + 0.8, eq + 0.9) }}>YOU'RE PAYING</div>
    </AbsoluteFill>
  );
};

// ===================== la "lista de los que pagan": nombres que se multiplican =====================
export const PayList: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const names = ["M. OKAFOR · 74 · PAID $1,200", "R. DELUCA · 81 · PAID $450", "J. PATEL · 69 · PAID $2,000", "D. NOWAK · 77 · PAID $800", "E. RIVERA · 72 · PAID $3,100", "H. SCHULTZ · 80 · PAID $600", "L. KIM · 75 · PAID $950"];
  const n = Math.min(names.length, Math.floor((t - a) * 3.2));
  return (
    <div style={{ position: "absolute", left: 1320, top: 540, transform: "translate(-50%,-50%)", opacity: o, width: 900, padding: "30px 40px", borderRadius: 18, background: "rgba(10,14,20,.94)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px #39445a" }}>
      <div style={{ ...H1, fontSize: 40, letterSpacing: 6, color: COL.red, textShadow: "none" }}>LIST: PEOPLE WHO PAY · CALL AGAIN</div>
      {names.slice(0, n).map((x, i) => <div key={i} style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 38, color: "#cfd6df", marginTop: 12, background: i === n - 1 ? "rgba(255,224,60,.25)" : undefined }}>{x}</div>)}
    </div>
  );
};

// ===================== el truco del reembolso: tu propia plata pasa de AHORRO a CORRIENTE =====================
export const Refund: React.FC<{ t: number; a: number; oops: number; reveal: number; out: number }> = ({ t, a, oops, reveal, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const mv = ei(t, oops, oops + 1.0);
  const sav = 26000 - 8000 * mv, chk = 1450 + 8000 * mv, rv = e(t, reveal, reveal + 0.4);
  const row = (lab: string, v: number, col: string, hi: boolean) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "26px 0", borderBottom: "2px solid #dde3ea", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#16243a" }}>
      <span>{lab}</span><span style={{ color: hi ? col : "#16243a", fontVariantNumeric: "tabular-nums" }}>${Math.round(v).toLocaleString("en-US")}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 40%,rgba(24,32,44,.62),rgba(6,8,12,.62))" }}>
      <div style={{ position: "absolute", left: 960, top: 500, transform: "translate(-50%,-50%)", width: 1100, padding: "34px 54px", borderRadius: 30, background: "#fff", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: 5, color: "#5a6372" }}>YOUR ACCOUNTS</div>
        {row("SAVINGS", sav, COL.red, rv > 0.5)}
        {row("CHECKING", chk, "#1f8a3a", mv > 0.1)}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, marginTop: 20, color: rv > 0.5 ? COL.red : "#1f8a3a" }}>{rv > 0.5 ? "IT WAS YOUR OWN MONEY. JUST MOVED." : mv > 0.1 ? "“REFUND”  +$8,000.00  (oops!)" : "PENDING REFUND  +$800.00"}</div>
      </div>
      {mv > 0.05 && mv < 0.98 && <div style={{ position: "absolute", left: 1380, top: 450 + mv * 120, fontSize: 70 }}>💵</div>}
    </AbsoluteFill>
  );
};

// ===================== "YES" grabado: la onda se guarda como archivo =====================
export const YesRec: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const s = ei(t, a + 1.4, a + 2.4);
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 45%,rgba(20,27,40,.62),rgba(4,6,10,.62))" }}>
      <div style={{ position: "absolute", left: 60, top: 50, ...H1, fontSize: 40, color: COL.red, textShadow: "none", opacity: Math.sin(t * 6) > 0 ? 1 : 0.3 }}>● REC</div>
      <div style={{ position: "absolute", left: 960 - s * 520, top: 480 - s * 120, transform: `translate(-50%,-50%) scale(${1 - s * 0.6})`, textAlign: "center" }}>
        <svg width={900} height={260}>{Array.from({ length: 90 }, (_, i) => { const env = Math.exp(-Math.pow((i - 45) / 18, 2)); const h = 10 + env * 220 * Math.abs(Math.sin(i * 0.9)); return <rect key={i} x={i * 10} y={130 - h / 2} width={6} height={h * e(t, a, a + 0.5)} rx={3} fill="#6fe3ff" />; })}</svg>
        <div style={{ ...H1, fontSize: 120, color: "#6fe3ff" }}>“YES.”</div>
      </div>
      <div style={{ position: "absolute", left: 1450, top: 560, transform: `translate(-50%,-50%) scale(${S(spr(t, a + 2.2))})`, opacity: e(t, a + 2.2, a + 2.3), width: 300, height: 360, borderRadius: 20, background: "#f1f3f6", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 120 }}>🎙</div><div style={{ fontSize: 40, color: "#16243a" }}>yes_0042.wav</div><div style={{ fontSize: 26, color: COL.red, marginTop: 8 }}>SAVED FOR LATER</div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== tu número sube de precio (verificado, persona real) =====================
export const NumValue: React.FC<{ t: number; a: number; lists: number; out: number }> = ({ t, a, lists, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = 0.02 + 2.98 * ei(t, a + 0.4, a + 2.4);
  return (
    <AbsoluteFill style={{ opacity: o, background: "rgba(6,8,12,.6)" }}>
      <div style={{ position: "absolute", left: 620, top: 520, transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 80, color: COL.ink }}>(773) ···-4418</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>{["✓ REAL NUMBER", "✓ LIVE PERSON"].map((s, i) => <div key={i} style={{ padding: "10px 22px", borderRadius: 30, background: "#1f8a3a", ...H1, fontSize: 32, textShadow: "none", opacity: e(t, a + 0.5 + i * 0.6, a + 0.6 + i * 0.6) }}>{s}</div>)}</div>
      </div>
      <div style={{ position: "absolute", left: 1400, top: 470, transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ ...H1, fontSize: 36, letterSpacing: 6, color: COL.dim }}>VALUE ON A LIST</div>
        <div style={{ ...H1, fontSize: 180, color: "#9df0b4", fontVariantNumeric: "tabular-nums" }}>${v.toFixed(2)}</div>
      </div>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1150 + (i % 3) * 170, top: 700 + Math.floor(i / 3) * 110, width: 150, height: 90, borderRadius: 10, background: "#fbfbf7", boxShadow: "0 10px 20px rgba(0,0,0,.5)", transform: `scale(${S(spr(t, lists + i * 0.15))}) rotate(${(i - 3) * 3}deg)`, opacity: e(t, lists + i * 0.15, lists + i * 0.15 + 0.1), fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 20, color: "#333", padding: 10 }}>LIST #{i + 1}<br />+ your #</div>)}
    </AbsoluteFill>
  );
};

// ===================== llamada perdida + taxímetro internacional =====================
export const OneRing: React.FC<{ t: number; a: number; call: number; out: number }> = ({ t, a, call, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const m = Math.max(0, t - call) * 1.6, cost = m * 9.99;
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 40% 50%,rgba(20,26,38,.62),rgba(5,7,11,.62))" }}>
      <div style={{ position: "absolute", left: 560, top: 540, transform: "translate(-50%,-50%)", width: 440, height: 820, borderRadius: 60, background: "#111", boxShadow: "inset 0 0 0 10px #2a2a2a, 0 40px 80px rgba(0,0,0,.6)", padding: 36 }}>
        <div style={{ borderRadius: 34, background: "#f1f3f6", height: "100%", padding: 30, fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 30, color: "#666" }}>Recents</div>
          <div style={{ marginTop: 30, padding: 20, borderRadius: 20, background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,.1)" }}>
            <div style={{ fontWeight: 900, fontSize: 40, color: COL.red }}>+232 76 ··· ···</div>
            <div style={{ fontWeight: 700, fontSize: 28, color: "#666" }}>Missed · 1 ring · 0:01</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1350, top: 300, transform: "translate(-50%,-50%)", ...H1, fontSize: 80, color: COL.amber, opacity: e(t, a + 0.6, a + 0.9) * (1 - e(t, call, call + 0.3)) }}>WHO WAS THAT?</div>
      <div style={{ position: "absolute", left: 1350, top: 560, transform: "translate(-50%,-50%)", opacity: e(t, call, call + 0.2), textAlign: "center", padding: "30px 50px", borderRadius: 26, background: "#0b0b0b", boxShadow: "inset 0 0 0 4px #333" }}>
        <div style={{ ...H1, fontSize: 32, letterSpacing: 6, color: COL.red, textShadow: "none" }}>CALLING BACK · INTERNATIONAL · ON HOLD</div>
        <div style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 150, color: COL.red, fontVariantNumeric: "tabular-nums" }}>${cost.toFixed(2)}</div>
        <div style={{ ...H1, fontSize: 36, textShadow: "none" }}>{Math.floor(m)}:{String(Math.floor((m % 1) * 60)).padStart(2, "0")} MIN</div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== anzuelo con un teléfono de carnada (IT'S BAIT) =====================
export const Bait: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const dy = (1 - ei(t, a, a + 0.7)) * -700 + Math.sin(t * 2) * 12;
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(180deg,rgba(13,53,80,.62),rgba(4,20,34,.62))" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={960} y1={0} x2={960} y2={420 + dy} stroke="#ddd" strokeWidth={3} />
        <path d={`M960 ${420 + dy} L960 ${560 + dy} A60 60 0 1 1 840 ${560 + dy}`} fill="none" stroke="#c9ccd2" strokeWidth={14} strokeLinecap="round" /></svg>
      <div style={{ position: "absolute", left: 960, top: 600 + dy, transform: "translate(-50%,-50%) rotate(-12deg)", fontSize: 200 }}>📞</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", ...H1, fontSize: 120, color: COL.amber }}>IT'S BAIT.</div>
    </AbsoluteFill>
  );
};

// ===================== reloj de LA PRIMERA HORA =====================
export const FirstHour: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const left = Math.max(0, 3600 - (t - a) * 120);
  return (
    <div style={{ position: "absolute", left: 960, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${S(k)})`, textAlign: "center" }}>
      <div style={{ ...H1, fontSize: 50, letterSpacing: 8, color: COL.amber }}>THE FIRST HOUR</div>
      <div style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 230, color: COL.ink, textShadow: "0 0 30px rgba(255,255,255,.3)" }}>{String(Math.floor(left / 60)).padStart(2, "0")}:{String(Math.floor(left % 60)).padStart(2, "0")}</div>
      <div style={{ ...H1, fontSize: 46 }}>MATTERS MORE THAN ANYTHING</div>
    </div>
  );
};

// ===================== lista de qué hacer si ya te agarraron (se marca renglón a renglón) =====================
export const FixList: React.FC<{ t: number; rows: [string, string, number][]; out: number; hi?: number }> = ({ t, rows, out, hi = -1 }) => {
  const o = e(t, rows[0][2] - 0.3, rows[0][2]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1260, top: 540, transform: "translate(-50%,-50%)", opacity: o, width: 1060, padding: "34px 46px", borderRadius: 26, background: "rgba(250,250,246,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 6, color: "#b3261e" }}>IF IT ALREADY GOT YOU</div>
      {rows.map(([a, b, at], i) => (
        <div key={i} style={{ display: "flex", gap: 24, alignItems: "baseline", padding: "16px 0", borderBottom: "2px solid #e3e6ea", opacity: e(t, at, at + 0.15), background: i === hi ? "rgba(255,224,60,.35)" : undefined }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#5a6372", minWidth: 330 }}>{a}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#16243a" }}>→ {b}</div>
        </div>
      ))}
    </div>
  );
};

// ===================== dorso de la gift card + ticket: GUARDÁ LOS DOS =====================
export const GiftBack: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 50%,rgba(26,31,43,.62),rgba(6,8,12,.62))" }}>
      <div style={{ position: "absolute", left: 700, top: 520, transform: `translate(-50%,-50%) rotate(-8deg) scale(${S(k)})`, width: 640, height: 400, borderRadius: 30, background: "linear-gradient(180deg,#f2f4f7,#d9dee6)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 40, fontFamily: FONT }}>
        <div style={{ height: 60, background: "#c9ced6", borderRadius: 8 }} />
        <div style={{ marginTop: 40, fontWeight: 900, fontSize: 34, color: "#5a6372" }}>CUSTOMER SERVICE</div>
        <div style={{ fontWeight: 900, fontSize: 56, color: "#16243a", padding: "6px 14px", boxShadow: `0 0 0 6px ${COL.amber}`, display: "inline-block", marginTop: 10 }}>1-8••-•••-••••</div>
        <div style={{ marginTop: 30, fontWeight: 800, fontSize: 30, color: "#5a6372", letterSpacing: 6 }}>CARD # •••• •••• 2210</div>
      </div>
      <div style={{ position: "absolute", left: 1350, top: 540, transform: `translate(-50%,-50%) rotate(6deg) translateY(${(1 - S(spr(t, a + 0.6))) * 600}px)`, width: 340, padding: "30px 26px", background: "#fbfbf7", boxShadow: "0 30px 60px rgba(0,0,0,.5)", fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 26, color: "#333", lineHeight: 1.5 }}>
        RECEIPT<br />────────────<br />GIFT CARD x4<br />$500.00 x4<br />────────────<br />TOTAL $2,000.00<br />10:58 AM
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", ...H1, fontSize: 70, color: "#6fe39a", opacity: e(t, a + 1.2, a + 1.5) }}>KEEP BOTH. CALL FAST.</div>
    </AbsoluteFill>
  );
};

// ===================== tarjeta del navegador con la dirección para denunciar =====================
export const ReportSite: React.FC<{ t: number; at: number; url: string; lab: string; out: number; x?: number; y?: number }> = ({ t, at: a, url, lab, out, x = 960, y = 470 }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const n = Math.min(url.length, Math.floor(Math.max(0, t - a - 0.3) * 22));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - S(k)) * 60 + 4}deg)` }}>
      <div style={{ width: 1100, borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.6)", background: "#fff" }}>
        <div style={{ display: "flex", gap: 12, padding: "18px 24px", background: "#e9ecf0", alignItems: "center" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
          <div style={{ flex: 1, marginLeft: 20, padding: "12px 24px", borderRadius: 30, background: "#fff", fontFamily: "Arial,sans-serif", fontSize: 44, color: "#222" }}>🔒 {url.slice(0, n)}<span style={{ opacity: n < url.length ? 1 : 0 }}>|</span></div>
        </div>
        <div style={{ padding: "34px 40px", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#16243a" }}>{lab}</div>
      </div>
    </div>
  );
};

// ===================== la pila de denuncias que arma un caso (tablero con hilo rojo) =====================
export const CaseBoard: React.FC<{ t: number; a: number; lady: number; out: number }> = ({ t, a, lady, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const N = 9, pts = Array.from({ length: N }, (_, i) => [380 + (i % 3) * 580 + ((i * 37) % 60), 190 + Math.floor(i / 3) * 270 + ((i * 53) % 40)]);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#8a6a45" }}>
      <AbsoluteFill style={{ background: "repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,.06) 0 2px, transparent 2px 6px)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {pts.map((p, i) => i > 0 && <line key={i} x1={pts[i - 1][0]} y1={pts[i - 1][1]} x2={p[0]} y2={p[1]} stroke={COL.red} strokeWidth={5} opacity={e(t, lady + i * 0.08, lady + i * 0.08 + 0.2)} />)}
      </svg>
      {pts.map((p, i) => { const at = a + i * 0.22, me = i === 4; return (
        <div key={i} style={{ position: "absolute", left: p[0], top: p[1], transform: `translate(-50%,-50%) rotate(${((i * 29) % 12) - 6}deg) scale(${S(spr(t, at))})`, opacity: e(t, at, at + 0.1), width: 400, padding: "26px 28px", background: me ? "#fff8c4" : "#fbfbf7", boxShadow: me && t > lady ? `0 0 0 6px ${COL.amber}, 0 20px 40px rgba(0,0,0,.5)` : "0 14px 30px rgba(0,0,0,.45)", fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 34, color: "#333" }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: COL.red, margin: "-40px auto 10px" }} />REPORT #{1040 + i * 7}<br />{me ? "RETIRED · 78 · SHE CALLED" : "VICTIM STATEMENT"}
        </div>); })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", ...H1, fontSize: 56, opacity: e(t, lady, lady + 0.3) }}>ONE REPORT TIED THE WHOLE CASE TOGETHER</div>
    </AbsoluteFill>
  );
};

// ===================== tres círculos: CONFIANZA · APURO · PAGO RARO =====================
export const Triad: React.FC<{ t: number; times: number[]; all: number; out: number }> = ({ t, times, all, out }) => {
  const o = e(t, times[0], times[0] + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const C = [["TRUST", "#7fb2ff", 800, 420], ["HURRY", "#ffb257", 1120, 420], ["WEIRD PAYMENT", "#ff6b8b", 960, 680]];
  const join = ei(t, all, all + 0.8);
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 50%,rgba(18,24,38,.62),rgba(4,6,10,.62))" }}>
      {C.map(([l, c, x, y], i) => { const k = spr(t, times[i], 0.9); const cx = (x as number) + (960 - (x as number)) * join * 0.35, cy = (y as number) + (540 - (y as number)) * join * 0.35; return (
        <div key={i} style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${S(k)})`, opacity: e(t, times[i], times[i] + 0.1), width: 520, height: 520, borderRadius: "50%", background: `${c}33`, boxShadow: `inset 0 0 0 8px ${c}`, display: "flex", alignItems: i === 2 ? "flex-end" : "flex-start", justifyContent: i === 0 ? "flex-start" : i === 1 ? "flex-end" : "center", padding: 70 }}>
          <div style={{ ...H1, fontSize: 52, color: c as string }}>{l}</div>
        </div>); })}
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${S(spr(t, all + 0.6))})`, opacity: e(t, all + 0.6, all + 0.7), padding: "16px 34px", borderRadius: 20, background: COL.red, ...H1, fontSize: 60, textShadow: "none", textAlign: "center" }}>SCAM<br /><span style={{ fontSize: 36 }}>100 / 100</span></div>
    </AbsoluteFill>
  );
};

// ===================== burbujas de comentarios que suben =====================
export const Comments: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const C = [["Linda, 71", "Number 3 called me TWICE this month 😤"], ["Frank, 68", "Got #4. Hung up and called the back of my card. Thank you Hal"], ["Rosa, 75", "My grandson and I picked our code word today!"], ["Walt, 80", "The 'can you hear me' one... every week"]];
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(180deg,#f4f5f7,#e3e6ea)" }}>
      <div style={{ position: "absolute", left: 120, top: 90, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#16243a" }}>WHICH ONE CALLED YOUR HOUSE?</div>
      {C.map(([n, m], i) => { const at = a + 0.5 + i * 0.7, y = 260 + i * 190 - ei(t, at, at + 0.5) * 30; return (
        <div key={i} style={{ position: "absolute", left: 120 + (i % 2) * 120, top: y, opacity: e(t, at, at + 0.2), display: "flex", gap: 26, alignItems: "center", width: 1500, padding: "24px 30px", borderRadius: 26, background: "#fff", boxShadow: "0 16px 30px rgba(0,0,0,.12)", fontFamily: FONT }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: ["#7fb2ff", "#ffb257", "#6fe39a", "#ff6b8b"][i], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, color: "#fff" }}>{n[0]}</div>
          <div><div style={{ fontWeight: 900, fontSize: 30, color: "#5a6372" }}>{n}</div><div style={{ fontWeight: 800, fontSize: 44, color: "#16243a" }}>{m}</div></div>
        </div>); })}
    </AbsoluteFill>
  );
};

// ===================== CTA · LA GUÍA EN 3D: libro sobre la mesa → zoom → se abre en una página real =====================
// Parametrizada: el canal todavía no tiene producto. En PANTALLA nunca va link/URL: sólo el nombre + "link en la 1ª línea".
// `url` no se dibuja (queda para la descripción); `page` = página a la que se abre.
export const CTA_GUIDE = { name: "THE HANG-UP HANDBOOK", sub: "12 PHONE SCAMS · WHAT TO SAY BACK", url: "", page: 23 };
export const GuideCTA: React.FC<{ t: number; a: number; open: number; out: number; name?: string; sub?: string; url?: string; page?: number; lines?: string[] }> = ({ t, a, open, out, name = CTA_GUIDE.name, sub = CTA_GUIDE.sub, page = CTA_GUIDE.page, lines }) => {
  const o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const z = ei(t, a, open), op = ei(t, open, open + 1.1);           // acercarse · abrir la tapa
  const L = lines ?? ["“Grandpa, it's me.”", "“I'm calling from Medicare…”", "“Your number has been suspended.”", "“This is the fraud department…”", "“This is the IRS.”", "“You missed jury duty.”"];
  const n = Math.floor(Math.max(0, t - open - 0.8) * 3.2);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1600, overflow: "hidden" }}>
      {/* la mesa de la cocina (madera) */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(92deg,#6b4a2e 0 38px,#5e4027 38px 80px,#70502f 80px 130px)", transform: `rotateX(${58 - 26 * z}deg) scale(${1.6 + 0.9 * z})`, transformOrigin: "50% 60%", filter: `brightness(${0.75 + 0.15 * z})` }} />
      <div style={{ position: "absolute", left: 960, top: 560, transformStyle: "preserve-3d", transform: `translate(-50%,-50%) rotateX(${50 * (1 - z)}deg) rotateZ(${-14 * (1 - z) - 2}deg) scale(${0.5 + 0.55 * z})` }}>
        <div style={{ position: "relative", width: 1360, height: 860, transformStyle: "preserve-3d" }}>
          {/* página derecha (la que queda abierta) */}
          <div style={{ position: "absolute", left: 680, top: 0, width: 680, height: 860, background: "#fbf8ef", boxShadow: "inset 18px 0 30px rgba(0,0,0,.18), 0 40px 80px rgba(0,0,0,.55)", padding: "50px 54px", boxSizing: "border-box", fontFamily: "Georgia,serif", color: "#1d2433" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 5, color: "#b3261e" }}>CHAPTER 2 · THE FIRST SENTENCE</div>
            <div style={{ fontWeight: 700, fontSize: 40, marginTop: 14, lineHeight: 1.15 }}>If you hear this line, hang up:</div>
            {L.map((x, i) => <div key={i} style={{ fontSize: 31, marginTop: 16, opacity: i < n ? 1 : 0, transform: `translateX(${i < n ? 0 : 20}px)`, borderBottom: "1px solid #ddd5c2", paddingBottom: 8 }}><b style={{ color: "#b3261e" }}>{i + 1}.</b> {x}</div>)}
            <div style={{ position: "absolute", right: 46, bottom: 30, fontSize: 26, color: "#8a8170" }}>— {page} —</div>
          </div>
          {/* página izquierda */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 680, height: 860, background: "#f6f1e3", boxShadow: "inset -18px 0 30px rgba(0,0,0,.18)", padding: "60px 54px", boxSizing: "border-box", fontFamily: "Georgia,serif", color: "#3a3428", opacity: op }}>
            <div style={{ fontSize: 30, lineHeight: 1.5 }}>Every one of these calls starts with a sentence built to get your heart pounding. Learn the sentence, and you hear the scam coming before it starts.</div>
            <div style={{ marginTop: 40, padding: "24px 28px", background: "#fff3b0", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#1d2433", transform: "rotate(-2deg)" }}>“I'LL CALL YOU BACK.”</div>
            <div style={{ position: "absolute", left: 46, bottom: 30, fontSize: 26, color: "#8a8170" }}>— {page - 1} —</div>
          </div>
          {/* tapa: gira sobre el lomo y se abre */}
          <div style={{ position: "absolute", left: 680, top: 0, width: 680, height: 860, transformOrigin: "0% 50%", transform: `rotateY(${-178 * op}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(150deg,#ff9ec7,#ffd36e 55%,#8fe3ff)", boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 0 0 10px rgba(255,255,255,.35)", padding: "70px 56px", boxSizing: "border-box", textAlign: "center" }}>
              <div style={{ fontSize: 150 }}>☎</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1.02, color: "#24123a", marginTop: 20 }}>{name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: "#24123a", marginTop: 26 }}>{sub}</div>
              <div style={{ margin: "40px auto 0", width: 230, height: 230, borderRadius: "50%", background: "#24123a", color: "#ffd36e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, lineHeight: 1.05, transform: "rotate(-10deg)" }}>BY A<br />RETIRED<br />DETECTIVE</div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#efe8d6" }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", opacity: e(t, open + 0.6, open + 1.0) }}>
        <span style={{ padding: "16px 40px", borderRadius: 40, background: "rgba(10,14,22,.88)", ...H1, fontSize: 44, textShadow: "none" }}>LINK IN THE 1ST LINE OF THE DESCRIPTION ↓</span>
      </div>
    </AbsoluteFill>
  );
};

// ===================== CTA de la ola: SUSCRIBIRSE + CAMPANITA (sin guía, sin link) =====================
// un botón grande que el dedo aprieta (se pone gris "SUBSCRIBED") y la campana que se sacude con ondas
export const SubBell: React.FC<{ t: number; a: number; press: number; bell: number; out: number }> = ({ t, a, press, bell, out }) => {
  const { k, o } = pop(t, a, out, 0.9);
  if (o <= 0.01) return null;
  const pr = t >= press, dip = e(t, press - 0.12, press) * (1 - e(t, press, press + 0.15));
  const fx = 1180 + (1 - ei(t, a + 0.2, press)) * 420, fy = 640 + (1 - ei(t, a + 0.2, press)) * 260 + dip * 14;
  const sw = t > bell ? Math.sin((t - bell) * 22) * 24 * Math.exp(-(t - bell) * 1.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(5,7,11,.55)" }} />
      <div style={{ position: "absolute", left: 860, top: 560, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - S(k)) * 60 + 8}deg) scale(${(0.7 + 0.3 * S(k)) * (1 - 0.05 * dip)})` }}>
        <div style={{ padding: "40px 90px", borderRadius: 26, background: pr ? "linear-gradient(180deg,#4b5160,#30343e)" : "linear-gradient(180deg,#ff3b30,#c81e16)", boxShadow: `0 ${pr ? 10 : 26}px 0 ${pr ? "#1d2027" : "#7d0f0a"}, 0 50px 90px rgba(0,0,0,.6)`, ...H1, fontSize: 104, letterSpacing: 4, textShadow: "none", color: pr ? "#cfd6df" : "#fff" }}>{pr ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      </div>
      <div style={{ position: "absolute", left: 1440, top: 540, transform: `translate(-50%,-50%) scale(${S(spr(t, bell - 0.2))})`, opacity: e(t, bell - 0.2, bell - 0.1) }}>
        <svg width={300} height={300} viewBox="-150 -150 300 300">
          {[0, 1, 2].map((i) => { const ph = ((t - bell) * 1.4 + i / 3) % 1; return t > bell ? <circle key={i} r={70 + ph * 80} fill="none" stroke="#ffd37a" strokeWidth={6 * (1 - ph)} opacity={1 - ph} /> : null; })}
          <g transform={`rotate(${sw})`}><path d="M0 -92 C 52 -92 64 -40 64 4 L 64 40 L 84 64 L -84 64 L -64 40 L -64 4 C -64 -40 -52 -92 0 -92 Z" fill="#ffd37a" stroke="#6b4e00" strokeWidth={6} /><circle cx={0} cy={82} r={18} fill="#ffd37a" stroke="#6b4e00" strokeWidth={6} /></g>
        </svg>
      </div>
      <svg width={120} height={140} style={{ position: "absolute", left: fx, top: fy }} viewBox="0 0 120 140"><path d="M40 10 C 40 0 58 0 58 10 L 58 62 L 70 60 C 80 58 84 66 84 72 L 96 70 C 106 70 108 80 108 84 L 108 112 C 108 128 96 138 80 138 L 54 138 C 40 138 32 130 26 120 L 8 90 C 2 80 14 70 24 78 L 40 92 Z" fill="#f2d2b6" stroke="#5a3b28" strokeWidth={5} /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", ...H1, fontSize: 54, opacity: e(t, bell, bell + 0.3) }}>DON'T MISS NEXT WEEK</div>
    </AbsoluteFill>
  );
};
