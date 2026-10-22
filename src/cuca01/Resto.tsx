// cuca01 · del minuto 2 al final. UN mundo + UNA cámara (plan.ts) + tomas reales + el avatar en sus ventanas pagadas.
// Cada pieza nace en la FRASE que la nombra (at). Piezas nuevas por truco; Sello/Tabla/Tag son la letra de la casa.
// Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, CU, DrawX, Flash, FONT, P, Portal, Tag, Thermo, at, e, ei, extrude, s, spr } from "./lib";
import { PT, screenOf } from "./cocina3d";
import { AVP, Anos, Fichas, Pensamiento, Pleito, Sello, Shot, Tabla, Whip, World, ZoomThru } from "./Min1";
import { BEATS, REST0, TR, T_CHAYO, T_COMENT, T_CTA1, T_CTA2, T_CUENTA, T_FIX, T_GRACIAS, T_SEMANA } from "./plan";
import WORDS from "./words.json";

export const END = (WORDS as [string, number, number][]).slice(-1)[0][2] + 1.2;
export const FULL_FRAMES = s(END);
const REEL = (AVAIL as { reel: boolean }).reel;

// ---------- ventanas del avatar del resto (las del CTA viejo y la del truco 8 recortada: los labios dicen otra cosa) ----------
const CUBRE: [number, number][] = [[REST0, T_CTA1 + 33], [T_CTA2 - 1, T_SEMANA - 0.3]];
const AW = (AVW as { win: { ms: number; me: number; off: number }[] }).win
  .filter((w) => w.ms >= REST0 - 0.5 && !CUBRE.some(([a, b]) => w.ms < b && w.me > a))
  .map((w) => (Math.abs(w.ms - 345.87) < 0.5 ? { ...w, ms: 346.3, off: w.off + (346.3 - w.ms) } : w));
const AvatarR: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {REEL ? AW.map((w, i) => (
      <Sequence key={i} from={s(w.ms) - 15} durationInFrames={s(w.me - w.ms) + 32} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.48 && t < w.me + 0.5 ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 15)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>))
      : <AbsoluteFill style={{ backgroundImage: `url(${staticFile(P + "av_still.png")})`, backgroundSize: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />}
  </AbsoluteFill>
);

// ---------- capa de planos (mundo / toma) con su transición propia ----------
const beatAt = (t: number) => { let i = -1; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++; return Math.max(0, i); };
const plano = (i: number, t: number): React.ReactNode => {
  const b = BEATS[i], nx = BEATS[i + 1]?.a ?? b.a + 8;
  return b.kind === "w" ? <World t={t} /> : <Shot k={b.arg} t={t} a={b.a} dur={Math.max(3, nx - b.a)} z={i % 2 ? [1.03, 1.13] : [1.12, 1.03]} ox={i % 3 === 0 ? -30 : 20} />;
};
const Planos: React.FC<{ t: number }> = ({ t }) => {
  const i = beatAt(t), b = BEATS[i];
  if (i === 0 || t - b.a > 0.6) return <>{plano(i, t)}</>;
  const pv = BEATS[i - 1];
  if (b.kind === "w" && pv.kind === "w") return <>{plano(i, t)}</>; // la cámara vuela: no hay corte
  const c = screenOf(Math.max(t, b.a), PT.comal);
  if (b.kind === "i" && pv.kind === "w") // iris desde el comal hacia la toma
    return <>{plano(i - 1, t)}<Portal x={c.x} y={c.y} r={ei(t, b.a - 0.05, b.a + 0.5)} ring={0.5}>{plano(i, t)}</Portal></>;
  if (b.kind === "w" && pv.kind === "i") // latigazo de la toma al mundo
    return <Whip t={t} a={b.a - 0.2} b={b.a + 0.25} from={plano(i - 1, t)} to={plano(i, t)} dir={i % 2 ? 1 : -1} />;
  return <ZoomThru t={t} a={b.a - 0.3} b={b.a + 0.35} x={i % 2 ? 1280 : 640} y={500} k={4} top={plano(i - 1, t)} under={plano(i, t)} />;
};

// ---------- el avatar entra y sale con portal / latigazo / zoom (alterna) ----------
const Capa: React.FC<{ t: number }> = ({ t }) => {
  const k = AW.findIndex((w) => t >= w.ms - 0.35 && t < w.me + 0.45);
  if (k < 0) return <Planos t={t} />;
  const w = AW[k], st = k % 3;
  const under = <Planos t={t} />, av = <AvatarR t={t} />;
  if (t < w.ms + 0.3) { // entrada
    const c = screenOf(t, PT.comal);
    if (st === 0) return <>{under}<Portal x={c.x} y={c.y} r={ei(t, w.ms - 0.3, w.ms + 0.3)}>{av}</Portal></>;
    if (st === 1) return <Whip t={t} a={w.ms - 0.25} b={w.ms + 0.2} from={under} to={av} dir={-1} />;
    return <ZoomThru t={t} a={w.ms - 0.35} b={w.ms + 0.3} x={960} y={540} k={5} top={under} under={av} />;
  }
  if (t > w.me - 0.4) { // salida hacia el plano que sigue
    if (st === 0) return <ZoomThru t={t} a={w.me - 0.4} b={w.me + 0.4} x={AVP.comal.x} y={AVP.comal.y} k={6} top={av} under={under} />;
    if (st === 1) return <>{av}<Portal x={AVP.fuego.x} y={AVP.fuego.y} r={ei(t, w.me - 0.4, w.me + 0.4)} ring={0.4}>{under}</Portal></>;
    return <Whip t={t} a={w.me - 0.25} b={w.me + 0.2} from={av} to={under} dir={1} />;
  }
  return av;
};

// =====================================================================================
// PIEZAS NUEVAS (minuto 2 en adelante)
// =====================================================================================
const vis = (t: number, a: number, out: number, fi = 0.12) => e(t, a, a + fi) * (1 - e(t, out, out + 0.25));
const caja: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: CU.cal, whiteSpace: "nowrap" };

// sello del truco: un comalito de barro que cae girando con el número en cal + cinta con el nombre + 25 puntitos de avance
const NumTruco: React.FC<{ t: number; at: number; n: number; title: string }> = ({ t, at: a, n, title }) => {
  const o = vis(t, a, a + 2.8), k = spr(t, a, 1.1);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 300, top: 300, opacity: o, perspective: 1000 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateZ(${(1 - Math.min(1, k)) * -200}deg) scale(${Math.min(1.04, k)})`, width: 300, height: 300, borderRadius: "50%",
      background: "radial-gradient(circle at 40% 35%,#3a2c24,#141010 70%)", border: "14px solid #5b3a22", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 40px rgba(0,0,0,.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...caja, fontSize: 150, color: CU.cal, textShadow: "0 0 18px rgba(246,241,228,.35)", fontFamily: "'Segoe Print','Comic Sans MS',cursive" }}>{n}</div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 40, transformOrigin: "0 50%", transform: `scaleX(${e(t, a + 0.35, a + 0.7)})`, padding: "14px 34px 14px 60px", background: CU.barro, borderRadius: "0 16px 16px 0", boxShadow: "0 20px 40px rgba(0,0,0,.5)", ...caja, fontSize: 54, textShadow: extrude(4, "#5a2a10") }}>{title}</div>
    <div style={{ position: "absolute", left: 150, top: 125, display: "flex", gap: 7, opacity: e(t, a + 0.6, a + 0.8) }}>
      {Array.from({ length: 25 }, (_, i) => <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: i < n ? CU.maiz : "rgba(246,241,228,.25)", transform: `scale(${i === n - 1 ? 1 + 0.5 * Math.max(0, Math.sin((t - a) * 5)) : 1})` }} />)}
    </div>
  </div>;
};
// botón rojo de suscribirse + campanita que suena + el cursor que hace clic
const SubBtn: React.FC<{ t: number; at: number; bell: number; out: number }> = ({ t, at: a, bell, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const click = e(t, a + 0.9, a + 1.05) * (1 - e(t, a + 1.05, a + 1.25)), on = t > a + 1.05;
  const sw = t > bell ? 22 * Math.exp(-(t - bell) * 1.5) * Math.sin((t - bell) * 18) : 0;
  return <div style={{ position: "absolute", left: 960, top: 820, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, a))})`, display: "flex", alignItems: "center", gap: 30 }}>
    <div style={{ padding: "26px 60px", borderRadius: 18, background: on ? "#5a5550" : "#e2231a", ...caja, fontSize: 64, letterSpacing: 2, boxShadow: `0 ${18 - click * 12}px 0 ${on ? "#2e2b28" : "#8a120c"}, 0 30px 50px rgba(0,0,0,.5)`, transform: `translateY(${click * 12}px)` }}>{on ? "SUSCRITA ✓" : "SUSCRÍBASE"}</div>
    <div style={{ fontSize: 110, transform: `rotate(${sw}deg)`, transformOrigin: "50% 10%", filter: t > bell ? "drop-shadow(0 0 24px #ffd34a)" : undefined, opacity: e(t, bell - 0.4, bell - 0.1) }}>🔔</div>
    <svg width={70} height={90} style={{ position: "absolute", left: 300 - 60 * (1 - e(t, a + 0.3, a + 0.9)), top: 60 + 80 * (1 - e(t, a + 0.3, a + 0.9)), opacity: e(t, a + 0.2, a + 0.4) * (1 - e(t, a + 1.6, a + 1.9)) }}><path d="M5 5 L5 70 L22 55 L34 85 L46 80 L34 50 L58 50 Z" fill="#fff" stroke="#000" strokeWidth={4} /></svg>
  </div>;
};
// la pregunta para comentar: tarjeta con 3 opciones que se encienden cuando ella las dice
const Pregunta: React.FC<{ t: number; at: number; q: string; ops: { tx: string; at: number; ic: string }[]; out: number; x?: number; y?: number }> = ({ t, at: a, q, ops, out, x = 1340, y = 470 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, spr(t, a))) * -40 - 6}deg)`, width: 760, padding: 34, borderRadius: 26, background: "rgba(250,246,236,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", fontFamily: FONT }}>
    <div style={{ fontWeight: 900, fontSize: 52, color: CU.tinta, marginBottom: 22, whiteSpace: "normal", lineHeight: 1.05 }}>{q}</div>
    {ops.map((op, i) => { const on = t >= op.at, k = Math.min(1, spr(t, op.at));
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", marginTop: 12, borderRadius: 16, border: `4px solid ${on ? CU.barro : "rgba(42,26,16,.18)"}`, background: on ? "rgba(196,103,58,.14)" : "transparent", transform: `scale(${on ? 0.96 + 0.04 * k : 0.96})`, fontWeight: 900, fontSize: 44, color: on ? CU.tinta : "rgba(42,26,16,.35)" }}>
        <span style={{ fontSize: 44 }}>{op.ic}</span>{op.tx}</div>; })}
  </div>;
};
// caja de comentario que se escribe sola (con flecha hacia abajo: "aquí abajo")
const Comentario: React.FC<{ t: number; at: number; text: string; out: number; y?: number }> = ({ t, at: a, text, out, y = 900 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, a + 0.3, a + 0.3 + text.length * 0.045)), cur = Math.floor(t * 2.5) % 2 ? "|" : " ";
  return <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - e(t, a, a + 0.35)) * 120}px)`, display: "flex", alignItems: "center", gap: 22 }}>
    <div style={{ width: 86, height: 86, borderRadius: "50%", background: CU.barro, border: "5px solid #fff", ...caja, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>U</div>
    <div style={{ width: 1000, padding: "22px 30px", borderRadius: 14, background: "rgba(20,14,10,.9)", border: "3px solid rgba(246,241,228,.4)", fontFamily: FONT, fontWeight: 700, fontSize: 42, color: CU.cal }}>{text.slice(0, n)}<span style={{ color: CU.maiz }}>{cur}</span></div>
    <div style={{ ...caja, fontSize: 90, color: CU.maiz, transform: `translateY(${10 * Math.sin(t * 6)}px)`, textShadow: extrude(5, "#5a3a00") }}>↓</div>
  </div>;
};
// corte del barro: poros, el jabón entra… y con el calor sube a la tortilla
const Poros: React.FC<{ t: number; at: number; sale: number; out: number }> = ({ t, at: a, sale, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const inK = e(t, a + 0.4, a + 2.0), outK = e(t, sale, sale + 2.2);
  return <div style={{ position: "absolute", left: 1350, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})` }}>
    <svg width={860} height={560} viewBox="0 0 860 560">
      <rect x={0} y={260} width={860} height={200} rx={30} fill="#7a4a2e" stroke="#3a2214" strokeWidth={6} />
      <ellipse cx={430} cy={200 - outK * 30} rx={330} ry={34} fill="#efe0b0" stroke="#b58b4c" strokeWidth={4} opacity={0.4 + 0.6 * e(t, sale, sale + 0.4)} />
      {Array.from({ length: 22 }, (_, i) => { const x = 40 + i * 37 + (i % 3) * 6, d = 60 + (i % 4) * 30;
        return <g key={i}><rect x={x} y={262} width={12} height={d} rx={6} fill="#2a170c" />
          <circle cx={x + 6} cy={262 + d * inK * (1 - outK) - outK * 90 * ((i % 5) / 4 + 0.4)} r={7 + (i % 3) * 2} fill="rgba(220,240,255,.9)" stroke="#fff" strokeWidth={2} opacity={inK} /></g>; })}
      {Array.from({ length: 12 }, (_, i) => <circle key={"b" + i} cx={80 + i * 62} cy={240 - (((t * 60 + i * 40) % 160) * (1 - outK))} r={10 + (i % 3) * 4} fill="none" stroke="rgba(255,255,255,.8)" strokeWidth={3} opacity={(1 - inK) * e(t, a, a + 0.3) * 0.9} />)}
    </svg>
    <div style={{ position: "absolute", left: 30, top: 470, ...caja, fontSize: 44, color: CU.cal, textShadow: extrude(4, "#000") }}>{outK > 0.1 ? "…Y SALE EN LA TORTILLA" : "EL JABÓN SE METE EN LOS PORITOS"}</div>
  </div>;
};
// la lechada de cal: el agua se vuelve "leche espesa" en una jícara
const Lechada: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k = e(t, a, a + 2.4);
  return <div style={{ position: "absolute", left: 1460, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, textAlign: "center" }}>
    <svg width={460} height={300} viewBox="0 0 460 300">
      <path d="M20 60 Q230 330 440 60 Z" fill="#8a4a24" stroke="#4a2410" strokeWidth={8} />
      <ellipse cx={230} cy={64} rx={206} ry={34} fill={`rgb(${Math.round(140 + 110 * k)},${Math.round(170 + 75 * k)},${Math.round(190 + 50 * k)})`} />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={80 + i * 42} cy={64 + Math.sin(t * 3 + i) * 8} r={6} fill="#fff" opacity={0.6 * (1 - k)} />)}
    </svg>
    <div style={{ ...caja, fontSize: 56, color: CU.cal, textShadow: extrude(5, "#3a2a20"), marginTop: -20 }}>AGUA + CAL</div>
    <div style={{ ...caja, fontSize: 46, color: CU.maiz, opacity: k }}>= LECHE ESPESA</div>
  </div>;
};
// dos columnas: la que gana queda con ✓ y la otra se tacha
const Versus: React.FC<{ t: number; at: number; out: number; l: [string, string]; r: [string, string]; win: "l" | "r"; at2?: number; y?: number }> = ({ t, at: a, out, l, r, win, at2, y = 520 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k2 = at2 ?? a + 1.0;
  const col = (c: [string, string], ok: boolean, i: number) => <div style={{ width: 520, padding: "30px 20px", borderRadius: 24, textAlign: "center", background: ok ? "rgba(70,120,40,.92)" : "rgba(40,26,18,.92)", border: `5px solid ${ok ? CU.verde : "rgba(246,241,228,.3)"}`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `translateY(${(1 - Math.min(1, spr(t, a + i * 0.2))) * 300}px) scale(${t > k2 && ok ? 1.06 : 1})`, position: "relative" }}>
    <div style={{ ...caja, fontSize: 40, color: COL.dim }}>{c[0]}</div><div style={{ ...caja, fontSize: 72 }}>{c[1]}</div>
    <div style={{ position: "absolute", right: 18, top: -40, ...caja, fontSize: 90, color: ok ? CU.verde : COL.red, opacity: e(t, k2, k2 + 0.15), textShadow: extrude(4, "#000") }}>{ok ? "✓" : "✗"}</div>
  </div>;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, display: "flex", justifyContent: "center", gap: 60, transform: "translateY(-50%)" }}>{col(l, win === "l", 0)}{col(r, win === "r", 1)}</div>;
};
// medidor horizontal que baja o sube (cal que se gasta, tortilla dura → suave…)
const Medidor: React.FC<{ t: number; at: number; out: number; label: string; from: number; to: number; at2?: number; to2?: number; lo: string; hi: string; x?: number; y?: number }> = ({ t, at: a, out, label, from, to, at2, to2, lo, hi, x = 1400, y = 300 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  let v = from + (to - from) * ei(t, a + 0.3, a + 2.2); if (at2 !== undefined && to2 !== undefined) v += (to2 - v) * ei(t, at2, at2 + 1.0);
  const c = v < 0.3 ? COL.red : v < 0.6 ? COL.amber : CU.verde;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, width: 620, padding: 26, borderRadius: 22, background: "rgba(20,14,10,.88)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
    <div style={{ ...caja, fontSize: 46, marginBottom: 16 }}>{label}</div>
    <div style={{ height: 46, borderRadius: 23, background: "rgba(246,241,228,.15)", overflow: "hidden" }}><div style={{ width: `${v * 100}%`, height: "100%", background: c, borderRadius: 23, boxShadow: `0 0 20px ${c}` }} /></div>
    <div style={{ display: "flex", justifyContent: "space-between", ...caja, fontSize: 30, color: COL.dim, marginTop: 10 }}><span>{lo}</span><span>{hi}</span></div>
  </div>;
};
// globo de diálogo que le sale al comal (el comal "habla")
const Globo: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at: a, out, x, y, text }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const sh = 3 * Math.sin(t * 20) * Math.exp(-(t - a) * 2.5);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-20%,-120%) scale(${Math.min(1.08, spr(t, a, 1.2))}) rotate(${-4 + sh}deg)`, transformOrigin: "20% 120%" }}>
    <div style={{ padding: "24px 44px", borderRadius: 40, background: "#fffaf0", border: "6px solid #2a1a10", ...caja, fontSize: 64, color: CU.tinta, boxShadow: "10px 12px 0 #2a1a10" }}>{text}</div>
    <svg width={80} height={70} style={{ position: "absolute", left: 50, top: "100%", marginTop: -6 }}><path d="M0 0 L60 0 L10 64 Z" fill="#fffaf0" stroke="#2a1a10" strokeWidth={6} /></svg>
  </div>;
};
// curva de calor: "despacito" (sube suave) contra "de golpe" (se dispara y se truena)
const Rampa: React.FC<{ t: number; at: number; out: number; golpe: number }> = ({ t, at: a, out, golpe }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k = e(t, a + 0.2, a + 2.5), g = e(t, golpe, golpe + 0.6);
  const pts = (f: (x: number) => number, kk: number) => Array.from({ length: 41 }, (_, i) => i / 40).filter((x) => x <= kk).map((x) => `${40 + x * 560},${320 - f(x) * 260}`).join(" ");
  return <div style={{ position: "absolute", left: 1380, top: 470, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, padding: 20, borderRadius: 22, background: "rgba(20,14,10,.88)" }}>
    <svg width={640} height={360}>
      <line x1={40} y1={320} x2={620} y2={320} stroke={COL.dim} strokeWidth={3} /><line x1={40} y1={320} x2={40} y2={30} stroke={COL.dim} strokeWidth={3} />
      <polyline points={pts((x) => x * 0.85, k)} fill="none" stroke={CU.verde} strokeWidth={9} strokeLinecap="round" />
      <polyline points={pts((x) => Math.min(1, x * 6), g)} fill="none" stroke={COL.red} strokeWidth={9} strokeLinecap="round" />
      {g > 0.95 && <text x={180} y={70} fontFamily={FONT} fontWeight={900} fontSize={70} fill={COL.red} transform={`rotate(-8 180 70)`}>¡CRAC!</text>}
    </svg>
    <div style={{ display: "flex", gap: 40, ...caja, fontSize: 36 }}><span style={{ color: CU.verde }}>— DESPACITO</span><span style={{ color: COL.red, opacity: g }}>— DE GOLPE</span></div>
  </div>;
};
// calendario de pared que pasa hojas: día 1, día 2… día 3: ¡CRAC!
const Calendario: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const d = t < a + 0.5 ? 1 : t < a + 1.0 ? 2 : 3, flip = ((t - a) % 0.5) / 0.5;
  return <div style={{ position: "absolute", left: 420, top: 470, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, perspective: 900 }}>
    <div style={{ width: 340, height: 380, borderRadius: 18, background: "#fffaf0", boxShadow: "0 30px 60px rgba(0,0,0,.55)", overflow: "hidden", textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
      <div style={{ background: CU.chile, color: "#fff", fontSize: 44, padding: 14 }}>DÍA</div>
      <div style={{ fontSize: 210, color: CU.tinta, lineHeight: 1.2, transform: d < 3 ? `rotateX(${flip * 40}deg)` : undefined }}>{d}</div>
    </div>
    {d === 3 && <div style={{ position: "absolute", left: 200, top: 40, ...caja, fontSize: 110, color: COL.red, transform: `rotate(-10deg) scale(${Math.min(1.1, spr(t, a + 1.0, 1.3))})`, textShadow: extrude(6, "#3a0505") }}>¡CRAC!</div>}
  </div>;
};
// escalera de la gota: 3 estados que se prenden con la voz
const Escalera: React.FC<{ t: number; ats: number[]; out: number }> = ({ t, ats, out }) => {
  const o = vis(t, ats[0], out); if (o <= 0.01) return null;
  const R = [["💧", "QUIETECITA", "LE FALTA", "#8fd6ff"], ["💦", "CHISPORROTEA", "VA BIEN", CU.maiz], ["🔥", "BRINCA Y BAILA", "¡A TATEMAR!", COL.red]];
  return <div style={{ position: "absolute", left: 60, top: 230, opacity: o, display: "flex", flexDirection: "column", gap: 18 }}>
    {R.map(([ic, a1, b1, c], i) => { const on = t >= ats[i], live = on && (i === 2 || t < ats[i + 1]);
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 26px", borderRadius: 18, width: 560, background: live ? "rgba(30,20,14,.95)" : "rgba(30,20,14,.6)", border: `4px solid ${on ? c : "transparent"}`, opacity: on ? 1 : 0.35, transform: `translateX(${(1 - Math.min(1, spr(t, ats[i]))) * -200}px) scale(${live ? 1.05 : 0.95})`, fontFamily: FONT, fontWeight: 900 }}>
        <span style={{ fontSize: 60, transform: `translateY(${live && i === 2 ? -Math.abs(Math.sin(t * 10)) * 14 : 0}px)` }}>{ic}</span>
        <div><div style={{ fontSize: 40, color: CU.cal }}>{a1}</div><div style={{ fontSize: 32, color: c as string }}>= {b1}</div></div></div>; })}
  </div>;
};
// las tres zonas vistas desde arriba: se pintan anillo por anillo
const Zonas2D: React.FC<{ t: number; ats: number[]; out: number }> = ({ t, ats, out }) => {
  const o = vis(t, ats[0], out); if (o <= 0.01) return null;
  const Z = [[300, "#ffe9a8", "ESPERAN CALIENTITAS"], [205, "#ffb23a", "TORTILLAS · GORDITAS"], [105, "#ff4a2a", "SE TATEMA"]];
  return <div style={{ position: "absolute", left: 1460, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${0.62 * Math.min(1.04, spr(t, ats[0]))})` }}>
    <svg width={700} height={700} viewBox="-350 -350 700 700">
      <circle r={330} fill="#141010" stroke="#5b3a22" strokeWidth={18} />
      {Z.map(([r, c], i) => { const k = e(t, ats[3 - i - (i === 0 ? 0 : 0)] ?? ats[0], (ats[3 - i] ?? ats[0]) + 0.5); return <circle key={i} r={(r as number) * k} fill="none" stroke={c as string} strokeWidth={i === 2 ? 210 : 90} opacity={0.5} />; })}
    </svg>
    {Z.map(([r, c, tx], i) => { const at0 = ats[3 - i] ?? ats[0]; return <div key={i} style={{ position: "absolute", left: 360 + (r as number) * 0.7 + 330, top: 350 - (r as number) * 0.7, opacity: e(t, at0, at0 + 0.2), ...caja, fontSize: 66, color: c as string, textShadow: extrude(5, "#000"), transform: "translateY(-50%)" }}>← {tx}</div>; })}
  </div>;
};
// tortilla que da vueltas: contador 1 · 2 · 3 con lo que pasa en cada vuelta
const Vueltas: React.FC<{ t: number; ats: number[]; out: number }> = ({ t, ats, out }) => {
  const o = vis(t, ats[0], out); if (o <= 0.01) return null;
  const L = ["SE DESPEGA LA ORILLITA", "LE SALEN MANCHITAS", "¡SE INFLA!"];
  const n = ats.filter((x) => t >= x).length, fl = Math.max(0, 1 - (t - ats[n - 1]) / 0.6);
  return <div style={{ position: "absolute", left: 1450, top: 330, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 30 }}>
    <div style={{ width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f6e7bb,#dcc287)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", transform: `rotateX(${fl * 360}deg) scale(${n === 3 ? 1 + 0.12 * Math.sin(Math.min(1, (t - ats[2]) * 2) * Math.PI / 2) : 1})`, position: "relative" }}>
      {n >= 2 && Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i * 53) % 140, top: 40 + (i * 37) % 140, width: 22, height: 16, borderRadius: "50%", background: "#8a5a26", opacity: 0.7 }} />)}
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 900 }}>
      <div style={{ fontSize: 150, color: CU.maiz, lineHeight: 1, textShadow: extrude(7, "#5a3a00") }}>{n}<span style={{ fontSize: 60, color: COL.dim }}> / 3</span></div>
      <div style={{ fontSize: 44, color: CU.cal, textShadow: extrude(4, "#000") }}>{L[n - 1]}</div>
    </div>
  </div>;
};
// corte de la tortilla inflada: dos capitas que se separan con el vapor
const Capitas: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at: a, out, x = 1380, y = 430 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k = ei(t, a + 0.2, a + 1.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, textAlign: "center" }}>
    <svg width={680} height={300} viewBox="0 0 680 300">
      <path d={`M40 200 Q340 ${200 - 170 * k} 640 200`} fill="none" stroke="#e7cf92" strokeWidth={22} strokeLinecap="round" />
      <path d="M40 200 Q340 220 640 200" fill="none" stroke="#d9bb76" strokeWidth={22} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${150 + i * 65} 190 q10 -${40 * k} 0 -${70 * k}`} stroke="rgba(255,255,255,.7)" strokeWidth={6} fill="none" opacity={k * (0.5 + 0.5 * Math.sin(t * 4 + i))} />)}
    </svg>
    <div style={{ display: "flex", justifyContent: "center", gap: 40, ...caja, fontSize: 46, opacity: e(t, a + 0.9, a + 1.1), textShadow: extrude(4, "#000") }}><span>CAPITA 1</span><span style={{ color: CU.maiz }}>+ VAPOR +</span><span>CAPITA 2</span></div>
  </div>;
};
// ecuación que se corrige: MÁS LUMBRE = MÁS RÁPIDO  →  tachada  →  = TORTILLA QUEMADA
const Ecuacion: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at: a, at2, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const sw = e(t, at2, at2 + 0.35);
  return <div style={{ position: "absolute", left: 960, top: 820, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, padding: "26px 48px", borderRadius: 24, background: "rgba(20,14,10,.9)", ...caja, fontSize: 70, display: "flex", gap: 26, alignItems: "center" }}>
    <span>🔥 MÁS LUMBRE =</span>
    <span style={{ position: "relative", display: "inline-block", minWidth: 560 }}>
      <span style={{ opacity: 1 - sw, color: CU.verde }}>MÁS RÁPIDO</span>
      <span style={{ position: "absolute", left: 0, top: 0, opacity: sw, color: COL.red, transform: `scale(${0.6 + 0.4 * sw})`, transformOrigin: "0 50%" }}>TORTILLA QUEMADA</span>
      <span style={{ position: "absolute", left: 0, top: "50%", height: 10, width: `${100 * e(t, at2 - 0.4, at2)}%`, background: COL.red, opacity: 1 - sw }} />
    </span>
  </div>;
};
// botella de aceite que se acerca y la tacha una X: "NI UNA GOTA"
const SinAceite: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1500, top: 470, opacity: o, transform: `translate(-50%,-50%) rotate(${(1 - Math.min(1, spr(t, a))) * 40 - 12}deg)` }}>
    <svg width={220} height={420} viewBox="0 0 220 420"><rect x={80} y={10} width={60} height={60} rx={10} fill="#3a6b2a" /><path d="M60 70 L160 70 L190 140 L190 400 Q110 420 30 400 L30 140 Z" fill="rgba(240,200,60,.85)" stroke="#8a6a10" strokeWidth={6} />
      <ellipse cx={110} cy={250} rx={60} ry={40} fill="rgba(255,255,255,.25)" /></svg>
    <div style={{ position: "absolute", left: -40, top: 0 }}><DrawX t={t} at={a + 0.5} x={20} y={40} w={260} h={340} /></div>
    <div style={{ position: "absolute", left: -120, top: 430, ...caja, fontSize: 56, color: CU.cal, textShadow: extrude(5, "#000") }}>NI UNA GOTA</div>
  </div>;
};
// reloj de arena / cronómetro que corre (minutos o segundos) con su letrero
const Reloj: React.FC<{ t: number; at: number; out: number; text: string; sub: string; col?: string; x?: number; y?: number; vuelta?: number }> = ({ t, at: a, out, text, sub, col = CU.maiz, x = 400, y = 330, vuelta = 2.5 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const ang = ((t - a) / vuelta) * 360;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})`, display: "flex", alignItems: "center", gap: 26 }}>
    <svg width={220} height={240} viewBox="-110 -130 220 240"><rect x={-22} y={-128} width={44} height={22} rx={6} fill={col} /><circle r={100} fill="#fffaf0" stroke={col} strokeWidth={14} />
      <path d={`M0 0 L0 -86 A86 86 0 ${ang % 360 > 180 ? 1 : 0} 1 ${86 * Math.sin((ang % 360) * Math.PI / 180)} ${-86 * Math.cos((ang % 360) * Math.PI / 180)} Z`} fill={col} opacity={0.45} />
      <line x1={0} y1={0} x2={78 * Math.sin(ang * Math.PI / 180)} y2={-78 * Math.cos(ang * Math.PI / 180)} stroke={CU.tinta} strokeWidth={8} strokeLinecap="round" /><circle r={10} fill={CU.tinta} /></svg>
    <div style={{ fontFamily: FONT, fontWeight: 900 }}><div style={{ fontSize: 88, color: col, textShadow: extrude(6, "#000"), whiteSpace: "nowrap" }}>{text}</div><div style={{ fontSize: 40, color: CU.cal, textShadow: extrude(4, "#000"), whiteSpace: "nowrap" }}>{sub}</div></div>
  </div>;
};
// el ajo con su escudo de cáscara (el calor rebota)
const Escudo: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1450, top: 480, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, a))})` }}>
    <svg width={520} height={460} viewBox="-260 -230 520 460">
      <path d="M0 -150 C110 -150 150 -20 120 80 C90 160 -90 160 -120 80 C-150 -20 -110 -150 0 -150 Z" fill="#f3ead6" stroke="#b9a37a" strokeWidth={10} />
      <path d="M0 -110 C70 -110 95 -20 75 60 C55 115 -55 115 -75 60 C-95 -20 -70 -110 0 -110 Z" fill="#f7e9a8" opacity={0.85} />
      {Array.from({ length: 6 }, (_, i) => { const ph = ((t - a) * 1.4 + i / 6) % 1, x = -230 + i * 92; return <g key={i}><path d={`M${x} 220 L${x + 20 * Math.sin(i)} ${200 - ph * 190}`} stroke="#ff6a2a" strokeWidth={10} strokeLinecap="round" opacity={1 - ph} /></g>; })}
    </svg>
    <div style={{ position: "absolute", left: 40, top: -30, ...caja, fontSize: 52, color: CU.maiz, textShadow: extrude(5, "#000"), opacity: e(t, a + 0.4, a + 0.6) }}>LA CÁSCARA LO PROTEGE</div>
  </div>;
};
// teléfono que suena y se tacha (no se distraiga)
const Telefono: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const sh = t < a + 0.9 ? 10 * Math.sin(t * 60) : 0;
  return <div style={{ position: "absolute", left: 360, top: 620, opacity: o, transform: `translate(-50%,-50%) rotate(${sh - 8}deg) scale(${Math.min(1.04, spr(t, a))})` }}>
    <div style={{ width: 200, height: 360, borderRadius: 34, background: "#1c1c1e", border: "8px solid #3a3a3c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ fontSize: 70 }}>📞</div><div style={{ ...caja, fontSize: 30, color: CU.verde }}>LLAMADA…</div></div>
    <div style={{ position: "absolute", left: -40, top: 0 }}><DrawX t={t} at={a + 0.9} x={20} y={20} w={260} h={340} /></div>
  </div>;
};
// muestrario de colores que avanza: verde clarito → amarillito → suelta su jugo
const Colores: React.FC<{ t: number; at: number; out: number; cs: string[]; labels: string[]; step?: number; y?: number }> = ({ t, at: a, out, cs, labels, step = 1.3, y = 900 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, display: "flex", justifyContent: "center", gap: 18, transform: "translateY(-50%)" }}>
    {cs.map((c, i) => { const ai = a + i * step, on = t >= ai; return <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderRadius: 40, background: "rgba(20,14,10,.9)", opacity: on ? 1 : 0.2, transform: `scale(${on ? Math.min(1.06, spr(t, ai)) : 0.9})`, border: `4px solid ${on ? c : "transparent"}` }}>
      <div style={{ width: 58, height: 58, borderRadius: "50%", background: c, boxShadow: `0 0 18px ${c}` }} /><span style={{ ...caja, fontSize: 40 }}>{labels[i]}</span>{i < cs.length - 1 && <span style={{ ...caja, fontSize: 40, color: COL.dim }}>→</span>}</div>; })}
  </div>;
};
// mecha que se quema: "1 minuto de más y se quema todo"
const Mecha: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at: a, out, text }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k = e(t, a + 0.2, a + 2.0), x = 40 + 760 * (1 - k);
  return <div style={{ position: "absolute", left: 960, top: 860, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={900} height={120}><line x1={40} y1={60} x2={x} y2={60} stroke="#d9c08a" strokeWidth={14} strokeLinecap="round" /><line x1={x} y1={60} x2={800} y2={60} stroke="#2a1a10" strokeWidth={14} strokeLinecap="round" />
      <circle cx={x} cy={60} r={18 + 6 * Math.sin(t * 30)} fill="#ffb23a" style={{ filter: "drop-shadow(0 0 16px #ff6a1a)" }} /><text x={830} y={80} fontSize={60}>💥</text></svg>
    <div style={{ ...caja, fontSize: 54, textAlign: "center", color: k > 0.98 ? COL.red : CU.cal, textShadow: extrude(5, "#000") }}>{text}</div>
  </div>;
};
// pila de tortillas que crece y el trapo que la tapa
const Pila: React.FC<{ t: number; at: number; tapa: number; out: number }> = ({ t, at: a, tapa, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const n = Math.min(8, Math.floor((t - a) * 3) + 1), k = ei(t, tapa, tapa + 0.8);
  return <div style={{ position: "absolute", left: 1480, top: 560, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={460} height={420} viewBox="0 0 460 420">
      {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={230} cy={360 - i * 22 - (i === n - 1 ? Math.max(0, 1 - ((t - a) * 3 % 1)) * 40 : 0)} rx={170} ry={44} fill={i % 2 ? "#ecd9a4" : "#e2cb8e"} stroke="#b58b4c" strokeWidth={3} />)}
      {k > 0 && <path d={`M40 ${400 - 260 * k} Q230 ${330 - 300 * k} 420 ${400 - 260 * k} L440 400 L20 400 Z`} fill="#f6f1e4" stroke="#c4673a" strokeWidth={6} opacity={k} />}
      {k > 0.5 && Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${150 + i * 40} ${130 - 30 * k} q12 -30 0 -60`} stroke="rgba(255,255,255,.75)" strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 4 + i)} />)}
    </svg>
    <div style={{ ...caja, fontSize: 50, textAlign: "center", textShadow: extrude(5, "#000") }}>{k > 0.5 ? "EL VAPOR LAS MANTIENE SUAVES" : "UNA ENCIMA DE OTRA"}</div>
  </div>;
};
// el trapo talla en circulitos (espiral que se dibuja)
const Circulitos: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k = e(t, a, a + 2.4), pts = Array.from({ length: 160 }, (_, i) => { const u = i / 159, an = u * 6.28 * 5, r = 20 + u * 150 + 12 * Math.sin(u * 40); return `${Math.cos(an) * r},${Math.sin(an) * r * 0.45}`; });
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={420} height={220} viewBox="-210 -110 420 220" style={{ overflow: "visible" }}><polyline points={pts.slice(0, Math.max(2, Math.round(160 * k))).join(" ")} fill="none" stroke="#f6f1e4" strokeWidth={8} strokeLinecap="round" strokeDasharray="2 16" style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,.8))" }} /></svg>
    <div style={{ ...caja, fontSize: 48, textAlign: "center", textShadow: extrude(5, "#000"), marginTop: -10 }}>EN CIRCULITOS</div>
  </div>;
};
// etiqueta de precio colgada: "$0 · GRATIS"
const Precio: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub: string }> = ({ t, at: a, out, x, y, text, sub }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const sw = 14 * Math.exp(-(t - a) * 1.4) * Math.sin((t - a) * 8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
    <svg width={4} height={100} style={{ position: "absolute", left: 0, top: -100 }}><line x1={2} y1={0} x2={2} y2={100} stroke="#f6f1e4" strokeWidth={3} /></svg>
    <div style={{ transform: "translateX(-50%)", padding: "24px 44px 24px 64px", background: CU.maiz, clipPath: "polygon(18% 0,100% 0,100% 100%,18% 100%,0 50%)", fontFamily: FONT, fontWeight: 900, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ fontSize: 100, color: CU.tinta, lineHeight: 1 }}>{text}</div><div style={{ fontSize: 36, color: "#6b3a00" }}>{sub}</div></div>
  </div>;
};
// libreta de cuentas escrita a mano (renglón por renglón con la voz)
const Libreta: React.FC<{ t: number; rows: { at: number; l: string; r: string }[]; out: number }> = ({ t, rows, out }) => {
  const o = vis(t, rows[0].at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1350, top: 520, opacity: o, transform: `translate(-50%,-50%) rotate(-3deg) scale(${Math.min(1.03, spr(t, rows[0].at))})`, width: 820, padding: "44px 50px", borderRadius: 10, background: "repeating-linear-gradient(0deg,#fbf6e8 0 62px,#c9d8ef 62px 64px)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", borderLeft: "14px solid #c4673a", fontFamily: "'Segoe Print','Comic Sans MS',cursive", color: "#2a2a6a" }}>
    <div style={{ fontSize: 50, fontWeight: 900, marginBottom: 10, color: CU.tinta }}>La cuenta de Cuca</div>
    {rows.map((r, i) => { const k = e(t, r.at, r.at + 0.8); return <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 42, height: 64, alignItems: "center", opacity: k > 0 ? 1 : 0 }}>
      <span style={{ clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{r.l}</span><span style={{ fontWeight: 900, color: i === rows.length - 1 ? "#1d6b2a" : "#2a2a6a", opacity: e(t, r.at + 0.6, r.at + 0.9) }}>{r.r}</span></div>; })}
  </div>;
};
// lista con palomitas (se van tachando con la voz)
const Checklist: React.FC<{ t: number; title: string; items: { at: number; tx: string }[]; out: number; x?: number; y?: number }> = ({ t, title, items, out, x = 1420, y = 500 }) => {
  const o = vis(t, items[0].at - 0.3, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.03, spr(t, items[0].at - 0.3))})`, width: 700, padding: 34, borderRadius: 24, background: "rgba(250,246,236,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900 }}>
    <div style={{ fontSize: 46, color: CU.barro, marginBottom: 14 }}>{title}</div>
    {items.map((it, i) => { const k = e(t, it.at, it.at + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 48, color: CU.tinta, margin: "14px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, border: `5px solid ${CU.tinta}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: "#2d8a2a" }}><span style={{ transform: `scale(${Math.min(1.2, spr(t, it.at, 1.4))})` }}>{k > 0 ? "✓" : ""}</span></div>
      <span style={{ opacity: 0.35 + 0.65 * k }}>{it.tx}</span></div>; })}
  </div>;
};
// encuesta de la comunidad: dos barras que se llenan
const Encuesta: React.FC<{ t: number; at: number; out: number; q: string; ops: string[] }> = ({ t, at: a, out, q, ops }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1380, top: 470, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.03, spr(t, a))})`, width: 760, padding: 36, borderRadius: 24, background: "rgba(20,14,10,.92)", boxShadow: "0 40px 80px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900 }}>
    <div style={{ fontSize: 52, color: CU.cal, marginBottom: 20 }}>{q}</div>
    {ops.map((op, i) => <div key={i} style={{ position: "relative", height: 84, borderRadius: 16, background: "rgba(246,241,228,.12)", margin: "14px 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, width: `${100 * e(t, a + 0.4 + i * 0.3, a + 1.6 + i * 0.3) * (i ? 0.45 : 0.6)}%`, background: i ? "#5a5f66" : CU.barro }} />
      <div style={{ position: "absolute", left: 24, top: 16, fontSize: 46, color: CU.cal }}>{op}</div></div>)}
    <div style={{ fontSize: 30, color: COL.dim, marginTop: 8 }}>CUÉNTEMELO EN LOS COMENTARIOS ↓</div>
  </div>;
};
// tarjeta del próximo video: la olla de barro que gira
const Proximo: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1380, top: 500, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, spr(t, a))) * 60 - 8}deg)`, width: 720, padding: 36, borderRadius: 28, background: "linear-gradient(160deg,#3a2418,#1a100a)", border: `5px solid ${CU.barro}`, boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, textAlign: "center" }}>
    <div style={{ fontSize: 36, color: CU.maiz, letterSpacing: 6 }}>EL PRÓXIMO VIDEO</div>
    <svg width={300} height={260} viewBox="-150 -130 300 260"><g transform={`scale(${Math.cos(t * 1.2) * 0.15 + 0.95},1)`}>
      <path d="M-70 -90 Q-130 -20 -110 50 Q-90 120 0 120 Q90 120 110 50 Q130 -20 70 -90 Z" fill="#a2552f" stroke="#5a2a10" strokeWidth={8} /><ellipse cy={-90} rx={74} ry={18} fill="#5a2a10" />
      <path d="M-104 0 Q0 30 104 0" stroke="#7a3b1c" strokeWidth={8} fill="none" /></g></svg>
    <div style={{ fontSize: 60, color: CU.cal }}>LA OLLA DE BARRO</div>
    <div style={{ fontSize: 34, color: COL.dim, marginTop: 6 }}>EL SECRETO DE MI ABUELA PARA CURARLA</div>
  </div>;
};
// despedida: letrero bordado que se escribe
const Final: React.FC<{ t: number; at: number; text: string }> = ({ t, at: a, text }) => {
  const o = e(t, a, a + 0.3); if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, a, a + 1.2));
  return <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: "translate(-50%,-50%)", padding: "40px 80px", borderRadius: 30, background: "rgba(250,246,236,.95)", border: `10px dashed ${CU.chile}`, boxShadow: "0 40px 80px rgba(0,0,0,.5)", fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 92, color: CU.tinta, whiteSpace: "nowrap" }}>
    {text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span></div>;
};


// los carteles nunca se salen del cuadro: el Tag se da vuelta si no entra; la Tabla se corre hacia adentro
type TagP = React.ComponentProps<typeof Tag>; type TablaP = React.ComponentProps<typeof Tabla>;
const TagS: React.FC<TagP> = (p) => { const dx = p.dx ?? 120, w = p.text.length * (p.size ?? 46) * 0.66 + 30, ex = p.x + dx;
  const flip = (dx < 0 && ex - w < 30) || (dx > 0 && ex + w > 1890); return <Tag {...p} dx={flip ? -dx : dx} />; };
const TablaS: React.FC<TablaP> = (p) => { const w = p.text.length * (p.size ?? 54) * 0.68 + 80;
  return <Tabla {...p} x={Math.max(w / 2 + 30, Math.min(1890 - w / 2, p.x))} y={Math.max(260, Math.min(1040, p.y))} />; };

// =====================================================================================
const TIT = ["SIN JABÓN", "SE CURA CON CAL", "SU LECHADITA", "FIERRO: CON MANTECA", "DESPACITO", "NADA DE AGUA FRÍA", "LA GOTA DE AGUA", "TRES ZONAS", "TRES VUELTAS", "EL GLOBITO", "MÁS LUMBRE NO", "TATEMAR SIN ACEITE", "AJO CON CÁSCARA", "CHILE SECO: SEGUNDOS", "HASTA QUE SUELTE SU JUGO", "PEPITAS EN COMAL TIBIO", "NOPAL SIN BABA", "REVIVIR LA TORTILLA", "BIEN TAPADITAS", "CENIZA", "PALO, NUNCA FIERRO", "SAL DE GRANO", "COLGADO, NUNCA ENCIMADO", "DOS COMALES", "SE CURA, NO SE LAVA"];

export const Resto: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const A = (q: string, from: number) => at(q, from - 0.5);
  const tr = (i: number) => TR[i - 1];
  const nxt = (i: number) => (TR[i] ?? T_FIX);
  L.push(<Capa key="capa" t={t} />);
  const c = screenOf(t, PT.comal);

  // ---- CTA 1: suscríbase + campanita + la pregunta (sin guía ni link) ----
  if (t < tr(1)) {
    const f = T_CTA1;
    L.push(<SubBtn key="sub" t={t} at={A("suscribase y active", f)} bell={A("la campanita", f)} out={A("y digame una cosa", f) - 0.2} />);
    L.push(<TablaS key="sem" t={t} at={A("cada semana le cuento", f)} x={c.x} y={c.y - 110} text="CADA SEMANA, UN SECRETO DEL RANCHO" out={A("y digame una cosa", f) - 0.2} size={44} />);
    L.push(<Pregunta key="pq" t={t} at={A("usted como lava su comal", f)} q="¿USTED CÓMO LAVA SU COMAL?" out={A("y si tiene una abuela", f) - 0.2}
      ops={[{ tx: "CON JABÓN", at: A("con jabon con agua", f), ic: "🧼" }, { tx: "CON AGUA NOMÁS", at: A("con agua nomas", f), ic: "💧" }, { tx: "CON CENIZA, COMO CUCA", at: A("o con ceniza como yo", f), ic: "🪵" }]} />);
    L.push(<Comentario key="cm" t={t} at={A("escribamelo aqui abajo", f)} text="Yo lo lavo con…" out={A("y si tiene una abuela", f) - 0.2} />);
    L.push(<Sello key="ab" t={t} at={A("mandele este video", f)} text="MÁNDESELO A SU ABUELA ➜" x={960} y={300} out={A("y los 25 trucos", f) - 0.2} rot={-4} size={70} />);
    L.push(<BigNum key="25b" t={t} at={A("y los 25 trucos", f)} text="25" sub="TRUCOS · ESCRITOS EN LA DESCRIPCIÓN" x={960} y={480} size={220} col={CU.maiz} edge="#6b3a00" out={A("ahora si al comal", f) - 0.2} />);
    L.push(<TablaS key="alc" t={t} at={A("ahora si al comal", f)} x={c.x} y={c.y - 90} text="¡AL COMAL!" col={CU.maiz} out={tr(1) + 0.3} size={60} />);
  }
  // ---- sello de cada truco ----
  for (let i = 1; i <= 25; i++) if (t >= tr(i) - 0.2 && t < tr(i) + 3.2) L.push(<NumTruco key={"n" + i} t={t} at={tr(i)} n={i} title={TIT[i - 1]} />);

  const sec = (i: number) => t >= tr(i) - 0.5 && t < nxt(i) + 0.5;
  // 1 · sin jabón
  if (sec(1)) { const f = tr(1);
    L.push(<Poros key="po" t={t} at={A("tiene poritos", f)} sale={A("luego con el calor", f)} out={A("por eso a veces", f) - 0.2} />);
    L.push(<Sello key="sr" t={t} at={A("la tortilla sabe rara", f)} text="¿SABE RARA? ES EL JABÓN" x={960} y={250} out={A("el barro se limpia en seco", f) - 0.2} rot={-5} size={68} />);
    L.push(<TablaS key="es" t={t} at={A("se limpia en seco", f)} x={c.x} y={c.y - 100} text="EN SECO" col={CU.maiz} out={nxt(1) - 0.3} size={64} />); }
  // 2 · curar con cal
  if (sec(2)) { const f = tr(2);
    L.push(<TagS key="cl" t={t} at={A("viene clarito", f)} x={1100} y={560} dx={260} dy={-220} text="CLARITO, SIN ESTRENAR" col={CU.maiz} out={A("se disuelve", f) - 0.2} size={50} />);
    L.push(<Lechada key="le" t={t} at={A("hasta que queda como leche", f)} out={A("se deja secar", f) - 0.3} />);
    L.push(<TagS key="lt" t={t} at={A("por el lado donde va a cocinar", f)} x={c.x} y={c.y} dx={-380} dy={-220} text="DEL LADO DE COCINAR" col={CU.cal} out={A("se deja secar", f) + 1.5} size={48} />);
    L.push(<Versus key="vs" t={t} at={A("lo que en la ciudad", f)} at2={A("lo haciamos con cal", f)} out={nxt(2) - 0.2} l={["EN LA CIUDAD", "ACEITE"]} r={["EN EL RANCHO", "CAL"]} win="r" y={780} />); }
  // 3 · su lechadita
  if (sec(3)) { const f = tr(3);
    L.push(<Medidor key="md" t={t} at={A("cuando la cal se gasta", f)} out={A("no esta echado a perder", f) + 2} label="LA CAL DEL COMAL" from={0.9} to={0.15} lo="SE PEGA" hi="NO SE PEGA" x={420} y={300} />);
    L.push(<Globo key="gl" t={t} at={A("esta pidiendo su cal", f)} out={A("mi mama le daba", f) - 0.2} x={c.x - 40} y={c.y - 60} text="¡MI CAL!" />);
    L.push(<Pensamiento key="pm" t={t} at={A("cada vez que veia", f)} text="se resiste… le toca su cal" x={960} y={220} out={A("el comal le avisa", f) - 0.2} />);
    L.push(<TablaS key="av" t={t} at={A("el comal le avisa", f)} x={c.x} y={c.y - 100} text="EL COMAL LE AVISA" col={CU.maiz} out={nxt(3) - 0.3} />); }
  // 4 · fierro con manteca
  if (sec(4)) { const f = tr(4), m = screenOf(t, [-2.3, 0.84, -0.38]);
    L.push(<Versus key="v4" t={t} at={A("se cura distinto", f)} out={A("se lava una sola vez", f) - 0.2} l={["BARRO", "CAL"]} r={["LÁMINA / FIERRO", "MANTECA"]} win="r" y={250} />);
    L.push(<TablaS key="1v" t={t} at={A("se lava una sola vez", f)} x={m.x} y={m.y - 80} text="SE LAVA 1 SOLA VEZ" out={A("se seca en la lumbre", f) - 0.2} />);
    L.push(<TagS key="hm" t={t} at={A("hasta que deja de echar humo", f)} x={960} y={420} dx={300} dy={-150} text="HASTA QUE NO HUMEE" col={CU.cal} out={A("tres veces asi", f) - 0.1} size={50} />);
    L.push(<BigNum key="x3" t={t} at={A("tres veces asi", f)} text="×3" x={430} y={420} size={240} col={CU.maiz} edge="#6b3a00" out={A("y queda negro", f) + 0.4} />);
    L.push(<TagS key="es" t={t} at={A("como un espejo oscuro", f)} x={1000} y={600} dx={-320} dy={-240} text="ESPEJO OSCURO" col={CU.maiz} out={A("ese negro no es mugre", f) - 0.2} size={54} />);
    L.push(<Sello key="nm" t={t} at={A("ese negro no es mugre", f)} text="NO ES MUGRE" x={560} y={250} out={nxt(4) - 0.2} rot={-6} size={78} bg="rgba(42,26,16,.9)" />);
    L.push(<Sello key="lc" t={t} at={A("ese negro es la cura", f)} text="ES LA CURA" x={1360} y={820} out={nxt(4) - 0.2} rot={4} size={78} />); }
  // 5 · despacito
  if (sec(5)) { const f = tr(5);
    L.push(<Rampa key="ra" t={t} at={A("se calienta despacito", f)} golpe={A("nunca de golpe", f)} out={A("se lo digo porque", f) - 0.2} />);
    L.push(<Anos key="15" t={t} at={A("a los 15 anos", f)} n={15} x={1500} y={330} out={A("primero en la orilla", f) - 0.2} label="AÑOS" />);
    L.push(<Pensamiento key="mh" t={t} at={A("mi mama no me hablo", f)} text="…y mi mamá sin hablarme" x={760} y={210} out={A("primero en la orilla", f) - 0.2} />);
    L.push(<Fichas key="oc" t={t} out={A("el barro es como la gente", f) - 0.2} y={900} items={[{ at: A("primero en la orilla", f), tx: "1 · EN LA ORILLA", ic: "↙" }, { at: A("unos minutos", f), tx: "UNOS MINUTOS", ic: "⏳" }, { at: A("y luego al centro", f), tx: "2 · AL CENTRO", ic: "🔥" }]} />);
    L.push(<TablaS key="su" t={t} at={A("no le gustan los sustos", f)} x={960} y={330} text="NO LE GUSTAN LOS SUSTOS" col={CU.maiz} out={nxt(5) - 0.2} />); }
  // 6 · nada de agua fría
  if (sec(6)) { const f = tr(6);
    L.push(<div key="x6" style={{ position: "absolute", inset: 0 }}><DrawX t={t} at={A("agua fria a un comal caliente", f)} x={560} y={240} w={800} h={600} /></div>);
    L.push(<Sello key="af" t={t} at={A("nunca le eche agua fria", f) + 0.2} text="AGUA FRÍA + COMAL CALIENTE" x={960} y={170} out={A("el cambio de temperatura", f) - 0.2} rot={-3} size={60} bg="rgba(30,70,120,.92)" />);
    L.push(<TagS key="pd" t={t} at={A("lo raja por dentro", f)} x={c.x - 80} y={c.y} dx={-360} dy={-230} text="SE RAJA POR DENTRO" col={COL.red} out={A("y al tercer dia", f) - 0.2} size={52} />);
    L.push(<Calendario key="cal" t={t} at={A("y al tercer dia", f)} out={A("se deja enfriar solito", f) + 0.5} />);
    L.push(<TablaS key="so" t={t} at={A("se deja enfriar solito", f)} x={1400} y={420} text="QUE SE ENFRÍE SOLITO" col={CU.maiz} out={nxt(6) - 0.2} />); }
  // 7 · la gota
  if (sec(7)) { const f = tr(7);
    L.push(<Escalera key="esc" t={t} ats={[A("se queda ahi quietecita", f), A("si chisporrotea", f), A("y si la gota brinca", f)]} out={A("ningun termometro", f) - 0.2} />);
    L.push(<Thermo key="th" t={t} at={A("ningun termometro", f)} x={1380} y={300} from={2} to={14} out={nxt(7) - 0.5} />);
    L.push(<div key="tx" style={{ position: "absolute", inset: 0 }}><DrawX t={t} at={A("ningun termometro", f) + 1.2} x={1340} y={300} w={420} h={380} /></div>);
    L.push(<Sello key="dd" t={t} at={A("tan clarito", f)} text="LA GOTA LE DICE" x={760} y={830} out={nxt(7) - 0.2} rot={-4} size={70} />); }
  // 8 · tres zonas
  if (sec(8)) { const f = tr(8);
    L.push(<Zonas2D key="z2" t={t} ats={[A("tiene tres zonas", f), A("en la orillita esperan", f), A("en la parte de en medio", f), A("en el centro donde pega", f)]} out={A("asi me lo enseno mi mama", f) - 0.2} />);
    L.push(<Sello key="3c" t={t} at={A("un solo comal", f)} text="1 COMAL · 3 COCINAS" x={960} y={850} out={nxt(8) - 0.2} rot={-3} size={84} />); }
  // 9 · tres vueltas
  if (sec(9)) { const f = tr(9);
    L.push(<Sello key="nd" t={t} at={A("tres veces no dos", f)} text="3 VUELTAS, NO 2" x={600} y={220} out={A("la primera vuelta", f) - 0.2} rot={-5} size={80} />);
    L.push(<Vueltas key="vu" t={t} ats={[A("la primera vuelta", f), A("la segunda cuando", f), A("y en la tercera", f)]} out={A("si usted la voltea solo una vez", f) - 0.2} />);
    L.push(<TagS key="cr" t={t} at={A("le queda cruda por dentro", f)} x={c.x} y={c.y} dx={-380} dy={-200} text="1 VUELTA = CRUDA" col={COL.red} out={A("tres vueltas", f + 10) - 0.2} size={54} />);
    L.push(<BigNum key="3v" t={t} at={A("tres vueltas", f + 10)} text="3" sub="VUELTAS" x={430} y={440} size={280} col={CU.maiz} edge="#6b3a00" out={nxt(9) - 0.2} />); }
  // 10 · el globito
  if (sec(10)) { const f = tr(10);
    L.push(<TagS key="ap" t={t} at={A("una apretadita en la orilla", f)} x={1020} y={560} dx={300} dy={-240} text="UNA APRETADITA" col={CU.maiz} out={A("ahi el vapor", f) - 0.2} size={54} />);
    L.push(<Capitas key="cp" t={t} at={A("se levanta como globito", f)} out={nxt(10) - 0.3} />);
    L.push(<TablaS key="ta" t={t} at={A("la buena para el taco", f)} x={600} y={300} text="LA BUENA PARA EL TACO" col={CU.maiz} out={nxt(10) - 0.2} />); }
  // 11 · más lumbre no
  if (sec(11)) { const f = tr(11);
    L.push(<TagS key="qf" t={t} at={A("por fuera ya se quemo", f)} x={900} y={520} dx={380} dy={-260} text="QUEMADA POR FUERA" col={COL.red} out={A("hay que bajarla", f) - 0.2} size={52} />);
    L.push(<TagS key="cd" t={t} at={A("por dentro no le dio tiempo", f)} x={900} y={560} dx={380} dy={150} text="CRUDA POR DENTRO" col={CU.masa} out={A("hay que bajarla", f) - 0.2} size={52} />);
    L.push(<TablaS key="zm" t={t} at={A("a la zona de en medio", f)} x={c.x + 120} y={c.y - 80} text="↓ A LA ZONA DE EN MEDIO" col={CU.maiz} out={A("mucha gente cree", f) - 0.2} size={50} />);
    L.push(<Ecuacion key="ec" t={t} at={A("mas lumbre es mas rapido", f)} at2={A("mas lumbre es tortilla quemada", f)} out={nxt(11) - 0.2} />); }
  // 12 · tatemar sin aceite
  if (sec(12)) { const f = tr(12);
    L.push(<SinAceite key="sa" t={t} at={A("ni una gota", f)} out={A("el jitomate la cebolla", f) + 2} />);
    L.push(<Fichas key="in" t={t} out={A("unos 10 minutos", f) - 0.2} y={150} items={[{ at: A("el jitomate", f), tx: "JITOMATE", ic: "🍅" }, { at: A("la cebolla", f), tx: "CEBOLLA", ic: "🧅" }, { at: A("el ajo y el chile", f), tx: "AJO", ic: "🧄" }, { at: A("y el chile se ponen", f), tx: "CHILE", ic: "🌶️" }]} />);
    L.push(<Reloj key="10" t={t} at={A("unos 10 minutos", f)} out={A("ese negrito", f) - 0.2} text="10 MIN" sub="HASTA QUE SE PONGAN NEGROS" x={480} y={360} vuelta={3} />);
    L.push(<TagS key="ah" t={t} at={A("sabor ahumado", f)} x={1000} y={600} dx={-380} dy={-260} text="SABOR AHUMADO" col={CU.maiz} out={A("si le echa aceite", f) - 0.2} size={54} />);
    L.push(<Versus key="tf" t={t} at={A("si le echa aceite", f)} at2={A("esta friendo", f)} out={nxt(12) - 0.2} l={["SIN ACEITE", "TATEMAR"]} r={["CON ACEITE", "FREÍR"]} win="l" y={820} />); }
  // 13 · ajo con cáscara
  if (sec(13)) { const f = tr(13);
    L.push(<Escudo key="eb" t={t} at={A("la cascara lo protege", f)} out={A("cuando ya esta", f) - 0.2} />);
    L.push(<Fichas key="sd" t={t} out={A("cuando ya esta", f) - 0.2} y={900} items={[{ at: A("se pone suavecito", f), tx: "SUAVECITO", ic: "🤲" }, { at: A("y dulce", f), tx: "DULCE", ic: "🍯" }, { at: A("y no se amarga", f), tx: "NO SE AMARGA", ic: "✓" }]} />);
    L.push(<TagS key="sl" t={t} at={A("y sale solito", f)} x={980} y={520} dx={330} dy={-230} text="¡SALE SOLITO!" col={CU.maiz} out={A("el ajo pelado", f) - 0.2} size={54} />);
    L.push(<Reloj key="1m" t={t} at={A("se quema en un minuto", f)} out={nxt(13) - 0.2} text="1 MINUTO" sub="AJO PELADO = AMARGO" col={COL.red} x={1380} y={330} vuelta={1.2} />); }
  // 14 · chile seco
  if (sec(14)) { const f = tr(14);
    L.push(<Fichas key="ch" t={t} out={A("unos segundos de cada lado", f) - 0.1} y={160} items={[{ at: A("guajillo", f), tx: "GUAJILLO", ic: "🌶️" }, { at: A("ancho", f), tx: "ANCHO", ic: "🌶️" }, { at: A("pasilla", f), tx: "PASILLA", ic: "🌶️" }]} />);
    L.push(<Reloj key="sg" t={t} at={A("unos segundos de cada lado", f)} out={A("si se le pasa", f) - 0.2} text="SEGUNDOS" sub="DE CADA LADO" x={1400} y={300} vuelta={0.8} />);
    L.push(<Sello key="tr" t={t} at={A("ese chile se tira", f)} text="SE AMARGÓ: SE TIRA" x={960} y={250} out={A("con el chile seco mija", f) - 0.2} rot={-5} size={74} bg="rgba(120,20,10,.92)" />);
    L.push(<Telefono key="tel" t={t} at={A("ni para contestar el telefono", f)} out={nxt(14) - 0.2} />); }
  // 15 · tomate verde
  if (sec(15)) { const f = tr(15);
    L.push(<Colores key="co" t={t} at={A("se pone verde clarito", f)} step={(A("cuando se le abre", f) - A("se pone verde clarito", f)) / 2} out={A("ese jugo quemadito", f) + 1.5} cs={["#a6d65a", "#d9cf5a", "#8a6a2a"]} labels={["VERDE CLARITO", "AMARILLITO", "SUELTA SU JUGO"]} />);
    L.push(<TablaS key="ns" t={t} at={A("no se tira se raspa", f)} x={c.x} y={c.y - 100} text="ESE JUGO NO SE TIRA" col={CU.maiz} out={A("se raspa con la cuchara", f) + 0.3} />);
    L.push(<TagS key="sa" t={t} at={A("y se echa a la salsa", f)} x={960} y={600} dx={-360} dy={-260} text="¡A LA SALSA!" col={CU.chile} out={nxt(15) - 0.2} size={58} />); }
  // 16 · pepitas
  if (sec(16)) { const f = tr(16);
    L.push(<Versus key="tc" t={t} at={A("en el comal tibio", f)} at2={A("nunca en el caliente", f)} out={A("se mueven todo el tiempo", f) - 0.2} l={["COMAL", "TIBIO"]} r={["COMAL", "CALIENTE"]} win="l" y={820} />);
    L.push(<TagS key="cp" t={t} at={A("con la cuchara de palo", f)} x={960} y={560} dx={330} dy={-240} text="SIN PARAR DE MOVER" col={CU.maiz} out={A("las pepitas le avisan", f) - 0.2} size={50} />);
    L.push(<Sello key="pa" t={t} at={A("a brincar y a tronar", f)} text="¡PAC! ¡PAC! YA ESTÁN" x={560} y={240} out={A("el ajonjoli cuando", f) - 0.2} rot={-6} size={72} />);
    L.push(<TagS key="nz" t={t} at={A("huele a nuez", f)} x={1000} y={560} dx={-360} dy={-240} text="DORADITO · HUELE A NUEZ" col={CU.maiz} out={A("un minuto de mas", f) - 0.2} size={50} />);
    L.push(<Mecha key="me" t={t} at={A("un minuto de mas", f)} out={nxt(16) - 0.2} text="1 MINUTO DE MÁS = TODO QUEMADO" />); }
  // 17 · nopal
  if (sec(17)) { const f = tr(17);
    L.push(<Sello key="sb" t={t} at={A("no suelta baba", f)} text="SIN BABA" x={560} y={240} out={A("se pone entero", f) - 0.2} rot={-6} size={84} />);
    L.push(<Colores key="nv" t={t} at={A("de verde brillante", f)} step={1.0} out={A("la baba se seca", f) - 0.2} cs={["#5fae3a", "#2f4f22"]} labels={["VERDE BRILLANTE", "VERDE OSCURO = LISTO"]} />);
    L.push(<TagS key="sg" t={t} at={A("sal de grano encima", f)} x={980} y={500} dx={330} dy={-220} text="+ SAL DE GRANO" col={CU.cal} out={A("mi comadre chayo dice", f) - 0.2} size={54} />);
    L.push(<TablaS key="ms" t={t} at={A("el nopal mas sabroso", f)} x={600} y={330} text="EL MÁS SABROSO DEL MUNDO" col={CU.maiz} out={nxt(17) - 0.2} />); }
  // 18 · revivir la tortilla
  if (sec(18)) { const f = tr(18);
    L.push(<TagS key="dd" t={t} at={A("la tortilla del dia anterior", f)} x={c.x} y={c.y} dx={-360} dy={-230} text="LA DE AYER" col={CU.masa} out={A("y se pone en el comal", f) - 0.2} size={54} />);
    L.push(<Medidor key="ds" t={t} at={A("el vapor la ablanda", f)} out={A("nunca se tira", f) - 0.2} label="LA TORTILLA DE AYER" from={0.1} to={0.95} lo="DURA" hi="COMO RECIÉN HECHA" x={1400} y={280} />);
    L.push(<Sello key="nt" t={t} at={A("nunca se tira una tortilla dura", f)} text="AQUÍ NO SE TIRA NADA" x={960} y={240} out={A("se moja se calienta", f) - 0.2} rot={-4} size={74} />);
    L.push(<Fichas key="mc" t={t} out={nxt(18) - 0.2} y={880} items={[{ at: A("se moja", f + 10), tx: "SE MOJA", ic: "💧" }, { at: A("se calienta y", f + 10), tx: "SE CALIENTA", ic: "🔥" }, { at: A("y a comer", f), tx: "¡A COMER!", ic: "🌮" }]} />); }
  // 19 · bien tapaditas
  if (sec(19)) { const f = tr(19);
    L.push(<Pila key="pi" t={t} at={A("una encima de otra", f)} tapa={A("bien tapaditas", f)} out={A("el vapor de unas", f) + 1.6} />);
    L.push(<Versus key="de" t={t} at={A("si las deja destapadas", f)} at2={A("se ponen tiesas", f)} out={nxt(19) - 0.2} l={["CON TRAPO", "SUAVES"]} r={["DESTAPADAS", "TIESAS"]} win="l" y={820} />); }
  // 20 · ceniza
  if (sec(20)) { const f = tr(20);
    L.push(<TagS key="fr" t={t} at={A("cuando ya esta frio", f)} x={c.x} y={c.y} dx={-360} dy={-220} text="EN FRÍO" col={"#8fd6ff"} out={A("se le echa un punito", f) - 0.2} size={56} />);
    L.push(<TagS key="fb" t={t} at={A("de la fina la blanca", f)} x={c.x + 40} y={c.y} dx={360} dy={-230} text="LA FINA, LA BLANCA" col={CU.cal} out={A("con un trapo seco", f) - 0.2} size={50} />);
    L.push(<Circulitos key="ci" t={t} at={A("se talla en circulitos", f)} out={A("la ceniza levanta", f) + 1.5} x={1400} y={260} />);
    L.push(<Sello key="sr" t={t} at={A("sin rayarlo", f)} text="LIMPIO Y SIN RAYAR" x={600} y={850} out={A("es lo que usaban", f) - 0.2} rot={-4} size={70} />);
    L.push(<TagS key="nf" t={t} at={A("ni fibra ni detergente", f)} x={960} y={540} dx={-380} dy={250} text="NI FIBRA NI DETERGENTE" col={CU.maiz} out={A("y la ceniza mija", f) - 0.2} size={50} />);
    L.push(<Precio key="pr" t={t} at={A("sale gratis", f)} out={nxt(20) - 0.2} x={1480} y={300} text="$0" sub="SALE DEL FOGÓN" />); }
  // 21 · palo, no fierro
  if (sec(21)) { const f = tr(21);
    L.push(<Versus key="pf" t={t} at={A("con algo de palo", f)} at2={A("nunca con fierro", f)} out={A("el cuchillo y la fibra", f) - 0.2} l={["PALA · CUCHARA", "DE PALO"]} r={["CUCHILLO · FIBRA", "DE FIERRO"]} win="l" y={820} />);
    L.push(<TagS key="qc" t={t} at={A("le quitan la cura", f)} x={960} y={540} dx={360} dy={-250} text="RAYAN Y LE QUITAN LA CURA" col={COL.red} out={A("luego ahi es donde", f) - 0.2} size={50} />);
    L.push(<TablaS key="pg" t={t} at={A("luego ahi es donde se pega", f)} x={c.x} y={c.y - 90} text="AHÍ SE PEGA TODO" col={COL.red} out={nxt(21) - 0.2} />); }
  // 22 · sal de grano
  if (sec(22)) { const f = tr(22), m = screenOf(t, [-2.3, 0.84, -0.38]);
    L.push(<TablaS key="sg" t={t} at={A("la sal de grano", f)} x={m.x} y={m.y - 90} text="FIERRO → SAL DE GRANO" col={CU.cal} out={A("si se le pego algo", f) + 1.5} />);
    L.push(<TagS key="pd" t={t} at={A("con un papel doblado", f)} x={980} y={560} dx={330} dy={-230} text="PAPEL DOBLADO" col={CU.maiz} out={A("la sal raspa", f) - 0.2} size={52} />);
    L.push(<Sello key="sq" t={t} at={A("sin quitarle lo negro", f)} text="RASPA SIN QUITAR LO NEGRO" x={960} y={830} out={A("luego se sacude", f) - 0.2} rot={-3} size={62} />);
    L.push(<Sello key="ox" t={t} at={A("para que no se oxide", f)} text="+ MANTECA = NO SE OXIDA" x={960} y={250} out={nxt(22) - 0.2} rot={-4} size={66} />); }
  // 23 · colgado
  if (sec(23)) { const f = tr(23), cl = screenOf(t, PT.clavo);
    L.push(<TablaS key="co" t={t} at={A("se guarda colgado", f)} x={cl.x} y={cl.y - 150} text="COLGADO ✓" col={CU.verde} out={A("si le pone ollas", f) + 3} />);
    L.push(<Versus key="ce" t={t} at={A("nunca encimado", f)} at2={A("si le pone ollas encima se raja", f)} out={A("si lo deja en el suelo", f) - 0.2} l={["EN LA PARED", "COLGADO"]} r={["OLLAS ENCIMA", "SE RAJA"]} win="l" y={830} />);
    L.push(<TagS key="hu" t={t} at={A("le cae la humedad", f)} x={960} y={900} dx={-360} dy={-200} text="EN EL SUELO: HUMEDAD" col={"#8fd6ff"} out={A("mi mama lo tenia", f) - 0.2} size={50} />);
    L.push(<Fichas key="sr" t={t} out={nxt(23) - 0.2} y={900} items={[{ at: A("ahi se seca", f), tx: "SE SECA", ic: "☀️" }, { at: A("ahi respira", f), tx: "RESPIRA", ic: "🌬️" }, { at: A("ahi espera la manana", f), tx: "ESPERA LA MAÑANA", ic: "🌄" }]} />); }
  // 24 · dos comales
  if (sec(24)) { const f = tr(24);
    L.push(<Versus key="dc" t={t} at={A("un comal para tortillas", f)} at2={A("y otro para tatemar", f)} out={A("el chile el ajo", f) - 0.2} l={["COMAL 1", "TORTILLAS"]} r={["COMAL 2", "TATEMAR"]} win="l" y={220} />);
    L.push(<TagS key="qb" t={t} at={A("se quedan en el barro", f)} x={c.x} y={c.y} dx={-380} dy={-230} text="EL SABOR SE QUEDA EN EL BARRO" col={CU.maiz} out={A("le sabe a salsa", f) + 0.2} size={48} />);
    L.push(<Sello key="ss" t={t} at={A("le sabe a salsa", f)} text="¿TORTILLA CON SABOR A SALSA?" x={960} y={850} out={A("en mi casa el comal", f) - 0.2} rot={-3} size={58} />);
    L.push(<TagS key="gr" t={t} at={A("el comal grande es para las tortillas", f)} x={760} y={560} dx={-300} dy={-240} text="EL GRANDE: TORTILLAS" col={CU.masa} out={nxt(24) - 0.2} size={48} />);
    L.push(<TagS key="vj" t={t} at={A("el viejito", f)} x={1160} y={560} dx={320} dy={-240} text="EL VIEJITO: TATEMAR" col={CU.chile} out={nxt(24) - 0.2} size={48} />); }
  // 25 · se cura, no se lava
  if (sec(25)) { const f = tr(25);
    L.push(<Pleito key="pl" t={t} at={A("su familia le discuta", f)} out={A("el comal no se lava nunca", f) - 0.2} />);
    L.push(<Checklist key="cl" t={t} title="ASÍ SE LIMPIA" out={A("y cuando alguien en su casa", f) - 0.2} items={[{ at: A("se limpia con ceniza", f), tx: "CENIZA" }, { at: A("se raspa con palo", f), tx: "SE RASPA CON PALO" }, { at: A("se le pasa un trapo seco", f), tx: "TRAPO SECO" }]} />);
    L.push(<Globo key="qc" t={t} at={A("que cochinada", f)} out={A("usted le contesta", f) - 0.1} x={1200} y={420} text="¡Qué cochinada!" />);
    L.push(<Sello key="cu" t={t} at={A("el comal se cura", f + 10)} text="EL COMAL SE CURA, NO SE LAVA" x={960} y={540} out={T_FIX - 0.3} rot={-4} size={78} />); }
  // si se sigue pegando
  if (t >= T_FIX - 0.5 && t < T_CUENTA + 0.5) { const f = T_FIX;
    L.push(<TablaS key="np" t={t} at={A("no se preocupe", f)} x={c.x} y={c.y - 100} text="NO SE PREOCUPE" col={CU.maiz} out={A("a veces el comal", f) - 0.2} />);
    L.push(<Checklist key="re" t={t} title="SI SE SIGUE PEGANDO" out={A("y si se trono", f) - 0.2} x={1400} items={[{ at: A("dele su lechada", f), tx: "SU LECHADA DE CAL" }, { at: A("calientelo despacito", f), tx: "CALIÉNTELO DESPACITO" }, { at: A("y pruebe con una tortilla", f), tx: "PRUEBE CON UNA" }]} />);
    L.push(<Sello key="nf" t={t} at={A("no fue usted", f)} text="NO FUE USTED" x={600} y={260} out={T_CUENTA - 0.2} rot={-6} size={80} bg="rgba(42,26,16,.9)" />);
    L.push(<TagS key="bc" t={t} at={A("el barro tambien se cansa", f)} x={c.x} y={c.y} dx={360} dy={-230} text="EL BARRO TAMBIÉN SE CANSA" col={CU.cal} out={T_CUENTA - 0.2} size={48} />); }
  // la cuenta
  if (t >= T_CUENTA - 0.5 && t < T_CTA2) { const f = T_CUENTA;
    L.push(<Libreta key="li" t={t} out={A("aqui no hay secretos caros", f) - 0.2} rows={[
      { at: A("un comal de barro cuesta", f), l: "1 comal de barro", r: "= 2-3 kg de tortilla" }, { at: A("un puno de cal cuesta", f), l: "1 puño de cal", r: "unos pesos · meses" },
      { at: A("la ceniza sale del fogon", f), l: "la ceniza", r: "$0" }, { at: A("le va a durar anos", f), l: "bien cuidado dura…", r: "AÑOS" }]} />);
    L.push(<Sello key="sc" t={t} at={A("aqui no hay secretos caros", f)} text="SIN SECRETOS CAROS" x={600} y={260} out={T_CTA2 - 0.3} rot={-5} size={76} />);
    L.push(<Fichas key="cp" t={t} out={T_CTA2 - 0.3} y={880} items={[{ at: A("cuentas sencillas", f), tx: "CUENTAS SENCILLAS", ic: "✍️" }, { at: A("y paciencia", f + 15), tx: "PACIENCIA", ic: "⏳" }]} />); }
  // CTA 2: la pregunta para comentar (audio nuevo, sin avatar)
  if (t >= T_CTA2 - 0.5 && t < T_SEMANA) { const f = T_CTA2;
    L.push(<TablaS key="cf" t={t} at={A("ya que estamos en confianza", f)} x={c.x} y={c.y - 100} text="EN CONFIANZA…" col={CU.maiz} out={A("de todos estos trucos", f) - 0.2} />);
    L.push(<Pregunta key="cy" t={t} at={A("de todos estos trucos", f)} q="¿CUÁL YA CONOCÍA Y CUÁL NO?" out={T_SEMANA - 0.4} x={1340} y={420}
      ops={[{ tx: "YA LO CONOCÍA", at: A("cual ya conocia", f), ic: "👵" }, { tx: "NO LO CONOCÍA", at: A("y cual no", f), ic: "😮" }]} />);
    L.push(<Sello key="nu" t={t} at={A("no mas uno", f)} text="NOMÁS UNO" x={480} y={260} out={A("escribamelo abajo", f) + 1.4} rot={-6} size={80} />);
    L.push(<Comentario key="c2" t={t} at={A("escribamelo abajo", f)} text="El truco #__ · me lo enseñó ____" out={T_SEMANA - 0.4} y={880} />);
    L.push(<Sello key="ab" t={t} at={A("todavia hay abuelas", f)} text="TODAVÍA HAY ABUELAS ENSEÑANDO" x={560} y={640} out={T_SEMANA - 0.4} rot={-3} size={50} />); }
  // esta semana: nomás dos cosas
  if (t >= T_SEMANA - 0.5 && t < T_COMENT) { const f = T_SEMANA;
    L.push(<Checklist key="sm" t={t} title="ESTA SEMANA, NOMÁS 2 COSAS" out={T_COMENT - 0.2} x={1380} y={480} items={[{ at: A("deje de lavar su comal con jabon", f), tx: "SIN JABÓN" }, { at: A("y voltee la tortilla tres veces", f), tx: "3 VUELTAS" }]} />); }
  // comentarios: barro o fierro
  if (t >= T_COMENT - 0.5 && t < T_CHAYO) { const f = T_COMENT;
    L.push(<Encuesta key="en" t={t} at={A("es de barro o de fierro", f)} out={A("quiero saber de que pueblo", f) - 0.2} q="¿SU COMAL ES DE…?" ops={["BARRO", "FIERRO"]} />);
    L.push(<TagS key="nl" t={t} at={A("le ensenaron a no lavarlo", f)} x={c.x} y={c.y} dx={-380} dy={-200} text="¿A USTED TAMBIÉN?" col={CU.maiz} out={A("quiero saber", f) - 0.2} size={52} />);
    L.push(<TablaS key="pu" t={t} at={A("de que pueblo me escribe", f)} x={960} y={360} text="¿DE QUÉ PUEBLO ME ESCRIBE?" col={CU.maiz} out={T_CHAYO - 0.2} />); }
  // Chayo + próximo video
  if (t >= T_CHAYO - 0.5 && t < T_GRACIAS) { const f = T_CHAYO, ch = screenOf(t, PT.chayo);
    L.push(<TablaS key="ch" t={t} at={A("pasese al canal", f)} x={ch.x} y={ch.y - 60} text="LA COCINA DE DOÑA CHAYO" col={CU.maiz} out={A("y en el proximo video", f) - 0.2} />);
    L.push(<TagS key="cr" t={t} at={A("su caldo de res", f)} x={ch.x} y={ch.y + 40} dx={-340} dy={160} text="SU CALDO DE RES" col={CU.cal} out={A("y en el proximo video", f) - 0.2} size={48} />);
    L.push(<Proximo key="px" t={t} at={A("y en el proximo video", f)} out={A("y que cosas nunca", f) + 2} />);
    L.push(<Anos key="30" t={t} at={A("le dure 30 anos", f)} n={30} x={420} y={330} out={T_GRACIAS - 0.2} label="AÑOS SIN AGRIETARSE" />); }
  // despedida
  if (t >= T_GRACIAS - 0.3) { const f = T_GRACIAS;
    L.push(<TagS key="lu" t={t} at={A("junto a la lumbre", f)} x={screenOf(t, PT.fuego).x} y={screenOf(t, PT.fuego).y} dx={-300} dy={-200} text="JUNTO A LA LUMBRE" col={CU.maiz} out={A("dios la bendiga", f) - 0.3} size={50} />);
    L.push(<Final key="fi" t={t} at={A("dios la bendiga", f)} text="Dios la bendiga, mija" />); }
  L.push(<Flash key="fl" t={t} at={-10} />);
  return <AbsoluteFill style={{ background: "#0d0906" }}>{L}</AbsoluteFill>;
};
export const _u = [AVP, Anos, ZoomThru];
