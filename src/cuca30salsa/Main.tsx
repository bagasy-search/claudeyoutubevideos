// cuca30 · MOTOR de los videos de 30 min de Cuca: UN mundo (cocina3d) + UNA cámara (plan.ts) + fotos/tomas reales
// + el avatar en sus ventanas pagadas (avwin.json) + piezas ancladas a la voz (plan_t.json, frases ya resueltas a segundos)
// + la GUÍA en 3D dentro de la cocina (libro en la mesa → se abre en una página real del PDF → QR). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import PLAN from "./plan_t.json";
import { BigNum, CU, COL, FONT, P, Portal, Vid, e, ei, extrude, s, spr } from "./lib";
import { PT, World as WorldRaw, camSpeed, screenOf } from "./cocina3d";
import { BEATS } from "./plan";

type Ov = { a: number; out: number; ty: string; tx?: string; sub?: string; n?: number; x?: number; y?: number; col?: string; size?: number;
  items?: { a: number; tx: string; ic?: string; r?: string }[]; l?: [string, string]; r?: [string, string]; win?: "l" | "r"; a2?: number; q?: string };
type Cta = { a: number; b: number; open: number; pag: string; cover: string; libro: string; ahorro: string };
const PL = PLAN as { end: number; ntr: number; ov: Ov[]; cta: Cta[] };
export const END = PL.end;
export const FULL_FRAMES = s(END);
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
const CDUR = ((AVAIL as { dur?: Record<string, number> }).dur ?? {}) as Record<string, number>;
const AW = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
const inCta = (t: number) => PL.cta.find((c) => t >= c.a - 0.4 && t < c.b + 0.4);

// ---------- avatar: nítido, sin halo ni borde borroso; preroll por ventana ----------
const AvatarR: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    {REEL ? AW.map((w, i) => (
      <Sequence key={i} from={Math.max(0, s(w.ms) - 15)} durationInFrames={s(w.me - w.ms) + 32} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.48 && t < w.me + 0.5 ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - Math.min(15, s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      </Sequence>))
      : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />}
  </AbsoluteFill>
);
const AVP = { a: { x: 1500, y: 760 }, b: { x: 420, y: 820 } };

// ---------- mundo 3D con desenfoque de movimiento (sale de la velocidad real de la cámara) ----------
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// toma (clip si ya está, si no la foto) con empuje lento + balanceo de cámara en mano (CamaraMano, lento)
const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.04, 1.14], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q;
  const hx = 7 * Math.sin(t * 0.43 + a), hy = 5 * Math.sin(t * 0.61 + a * 2), hr = 0.35 * Math.sin(t * 0.37 + a);
  return <AbsoluteFill style={{ transform: `scale(${sc + 0.012}) translate(${ox * q + hx}px,${oy * q + hy}px) rotate(${hr}deg)` }}><Vid id={"img_" + k} />{CLIPS.has(k) && <AbsoluteFill style={{ opacity: 1 - e(t, a + (CDUR[k] ?? 5) - 0.45, a + (CDUR[k] ?? 5) - 0.1) }}><Sequence from={s(a)} durationInFrames={Math.max(1, s((CDUR[k] ?? 5) - 0.1))} layout="none"><Vid id={k} /></Sequence></AbsoluteFill>}</AbsoluteFill>;
};
const Whip: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: 1 | -1 }> = ({ t, a, b, from, to, dir = 1 }) => {
  const k = ei(t, a, b), mb = Math.sin(k * Math.PI) * 42;
  const f = mb > 1 ? `blur(${mb}px)` : undefined;
  return <>
    {k < 1 && <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: f }}>{from}</AbsoluteFill>}
    {k > 0 && <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: f }}>{to}</AbsoluteFill>}
  </>;
};
const ZoomThru: React.FC<{ t: number; a: number; b: number; x: number; y: number; top: React.ReactNode; under: React.ReactNode; k?: number }> = ({ t, a, b, x, y, top, under, k: mag = 7 }) => {
  const z = ei(t, a, b);
  return <>
    {z > 0.35 && <AbsoluteFill style={{ opacity: (z - 0.35) / 0.65, transform: `scale(${1.25 - 0.25 * z})`, transformOrigin: `${x}px ${y}px` }}>{under}</AbsoluteFill>}
    <AbsoluteFill style={{ transformOrigin: `${x}px ${y}px`, transform: `scale(${1 + z * z * mag})`, opacity: z > 0.35 ? 1 - (z - 0.35) / 0.65 : 1, filter: z > 0.05 ? `blur(${z * 16}px)` : undefined }}>{top}</AbsoluteFill>
  </>;
};

// ---------- capa de planos (mundo / toma) con su transición propia ----------
const beatAt = (t: number) => { let i = -1; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++; return Math.max(0, i); };
const plano = (i: number, t: number): React.ReactNode => {
  const b = BEATS[i], nx = BEATS[i + 1]?.a ?? b.a + 8;
  return b.kind === "w" ? <World t={t} /> : <Shot k={b.arg} t={t} a={b.a} dur={Math.max(3, nx - b.a)} z={i % 2 ? [1.03, 1.13] : [1.12, 1.03]} ox={i % 3 === 0 ? -30 : 20} />;
};
const foco = (t: number) => { const b = BEATS[beatAt(t)]; return b.arg.startsWith("molca") ? PT.mesa : b.arg.startsWith("olla") ? PT.olla : PT.comal; };
const Planos: React.FC<{ t: number }> = ({ t }) => {
  const i = beatAt(t), b = BEATS[i];
  if (i === 0 || t - b.a > 0.6) return <>{plano(i, t)}</>;
  const pv = BEATS[i - 1];
  if (b.kind === "w" && pv.kind === "w") return <>{plano(i, t)}</>; // la cámara vuela: no hay corte
  const c = screenOf(Math.max(t, b.a), foco(b.a - 0.1));
  if (b.kind === "i" && pv.kind === "w") return <>{plano(i - 1, t)}<Portal x={c.x} y={c.y} r={ei(t, b.a - 0.05, b.a + 0.5)} ring={0.5}>{plano(i, t)}</Portal></>;
  if (b.kind === "w" && pv.kind === "i") return <Whip t={t} a={b.a - 0.2} b={b.a + 0.25} from={plano(i - 1, t)} to={plano(i, t)} dir={i % 2 ? 1 : -1} />;
  return <ZoomThru t={t} a={b.a - 0.3} b={b.a + 0.35} x={i % 2 ? 1280 : 640} y={500} k={4} top={plano(i - 1, t)} under={plano(i, t)} />;
};
// el avatar entra y sale con portal / latigazo / zoom (alterna); en la CTA queda en un cuadrito nítido
const Capa: React.FC<{ t: number }> = ({ t }) => {
  const k = AW.findIndex((w) => t >= w.ms - 0.35 && t < w.me + 0.45);
  if (k < 0) return <Planos t={t} />;
  const w = AW[k], st = k % 3;
  if (w.ms < 0.3 && t < w.me - 0.4) return <AvatarR t={t} />; // el video arranca en la cara
  const under = <Planos t={t} />, av = <AvatarR t={t} />;
  if (t < w.ms + 0.3) {
    const c = screenOf(t, foco(t));
    if (st === 0) return <>{under}<Portal x={c.x} y={c.y} r={ei(t, w.ms - 0.3, w.ms + 0.3)}>{av}</Portal></>;
    if (st === 1) return <Whip t={t} a={w.ms - 0.25} b={w.ms + 0.2} from={under} to={av} dir={-1} />;
    return <ZoomThru t={t} a={w.ms - 0.35} b={w.ms + 0.3} x={960} y={540} k={5} top={under} under={av} />;
  }
  if (t > w.me - 0.4) {
    if (st === 0) return <ZoomThru t={t} a={w.me - 0.4} b={w.me + 0.4} x={AVP.a.x} y={AVP.a.y} k={6} top={av} under={under} />;
    if (st === 1) return <>{av}<Portal x={AVP.b.x} y={AVP.b.y} r={ei(t, w.me - 0.4, w.me + 0.4)} ring={0.4}>{under}</Portal></>;
    return <Whip t={t} a={w.me - 0.25} b={w.me + 0.2} from={av} to={under} dir={1} />;
  }
  return av;
};
const AvatarPiP: React.FC<{ t: number }> = ({ t }) => {
  const w = AW.find((x) => t >= x.ms && t < x.me);
  if (!w) return null;
  const o = e(t, w.ms, w.ms + 0.3) * (1 - e(t, w.me - 0.3, w.me));
  return <div style={{ position: "absolute", left: 60, bottom: 60, width: 480, height: 270, borderRadius: 18, overflow: "hidden", border: `6px solid ${CU.cal}`, boxShadow: "0 30px 60px rgba(0,0,0,.6)", opacity: o }}><AvatarR t={t} /></div>;
};

// =====================================================================================
// PIEZAS (letra de la casa: barro, cal y maíz)
// =====================================================================================
const vis = (t: number, a: number, out: number, fi = 0.12) => e(t, a, a + fi) * (1 - e(t, out, out + 0.25));
const caja: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: CU.cal, whiteSpace: "nowrap" };
const NumTruco: React.FC<{ t: number; at: number; n: number; N: number; title: string }> = ({ t, at: a, n, N, title }) => {
  const o = vis(t, a, a + 2.8), k = spr(t, a, 1.1);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 300, top: 300, opacity: o, perspective: 1000 }}>
    <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateZ(${(1 - Math.min(1, k)) * -200}deg) scale(${Math.min(1.04, k)})`, width: 300, height: 300, borderRadius: "50%",
      background: "radial-gradient(circle at 40% 35%,#a2552f,#5a2a14 70%)", border: "14px solid #3b2014", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 40px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...caja, fontSize: 150, color: CU.cal, textShadow: "0 0 18px rgba(246,241,228,.35)", fontFamily: "'Segoe Print','Comic Sans MS',cursive" }}>{n}</div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 40, transformOrigin: "0 50%", transform: `scaleX(${e(t, a + 0.35, a + 0.7)})`, padding: "14px 34px 14px 60px", background: CU.barro, borderRadius: "0 16px 16px 0", boxShadow: "0 20px 40px rgba(0,0,0,.5)", ...caja, fontSize: 54, textShadow: extrude(4, "#5a2a10") }}>{title}</div>
    <div style={{ position: "absolute", left: 150, top: 125, display: "flex", gap: 7, opacity: e(t, a + 0.6, a + 0.8) }}>
      {Array.from({ length: N }, (_, i) => <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: i < n ? CU.maiz : "rgba(246,241,228,.25)", transform: `scale(${i === n - 1 ? 1 + 0.5 * Math.max(0, Math.sin((t - a) * 5)) : 1})` }} />)}
    </div>
  </div>;
};
const Sello: React.FC<{ t: number; at: number; text: string; x: number; y: number; out: number; rot?: number; size?: number }> = ({ t, at: a, text, x, y, out, rot = -6, size = 80 }) => {
  const k = spr(t, a, 1.3), o = vis(t, a, out, 0.06);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.3 - 1.3 * Math.min(1, k)})` }}>
    <div style={{ border: `8px solid ${CU.cal}`, borderRadius: 18, padding: "8px 34px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: CU.cal, letterSpacing: 3, background: "rgba(196,103,58,.92)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", textShadow: extrude(5, "rgba(60,20,5,.85)"), whiteSpace: "nowrap" }}>{text}</div>
  </div>;
};
const Tabla: React.FC<{ t: number; at: number; x: number; y: number; text: string; out: number; col?: string; size?: number }> = ({ t, at: a, x, y, text, out, col = CU.cal, size = 54 }) => {
  const k = spr(t, a, 1), o = vis(t, a, out, 0.1);
  if (o <= 0.01) return null;
  const w = text.length * size * 0.68 + 80, X = Math.max(w / 2 + 30, Math.min(1890 - w / 2, x));
  const sw = 6 * Math.exp(-(t - a) * 1.6) * Math.sin((t - a) * 9) + 1.2 * Math.sin(t * 1.3);
  return <div style={{ position: "absolute", left: X, top: y, opacity: o }}>
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "50% 0", transform: `translate(-50%,0) rotate(${sw}deg) scale(${Math.min(1.06, k)})`, padding: "14px 30px", borderRadius: 10, background: "repeating-linear-gradient(0deg,#6b4a30 0 18px,#5c3f28 18px 22px)", border: "4px solid #3b2a1d", boxShadow: "0 24px 40px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 2, whiteSpace: "nowrap", textShadow: extrude(4, "#2a1a10") }}>{text}</div>
  </div>;
};
const Pensamiento: React.FC<{ t: number; at: number; text: string; x: number; y: number; out: number }> = ({ t, at: a, text, x, y, out }) => {
  const o = vis(t, a - 0.15, out, 0.15);
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, a, a + 1.0));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, a - 0.15))}) rotate(-3deg)` }}>
    <div style={{ padding: "34px 54px", borderRadius: 120, background: "rgba(250,246,236,.96)", boxShadow: "0 30px 60px rgba(0,0,0,.45)", fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 60, color: "#3a2a20", whiteSpace: "nowrap" }}>“{text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>”</div>
  </div>;
};
const Checklist: React.FC<{ t: number; title: string; items: { a: number; tx: string }[]; out: number; x?: number; y?: number }> = ({ t, title, items, out, x = 1400, y = 520 }) => {
  const o = vis(t, items[0].a - 0.3, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.03, spr(t, items[0].a - 0.3))})`, width: 760, padding: 34, borderRadius: 24, background: "rgba(250,246,236,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900 }}>
    <div style={{ fontSize: 44, color: CU.barro, marginBottom: 10 }}>{title}</div>
    {items.map((it, i) => { const k = e(t, it.a, it.a + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, color: CU.tinta, margin: "12px 0" }}>
      <div style={{ width: 50, height: 50, flex: "0 0 50px", borderRadius: 12, border: `5px solid ${CU.tinta}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "#2d8a2a" }}><span style={{ transform: `scale(${Math.min(1.2, spr(t, it.a, 1.4))})` }}>{k > 0 ? "✓" : ""}</span></div>
      <span style={{ opacity: 0.35 + 0.65 * k }}>{it.tx}</span></div>; })}
  </div>;
};
const Errores: React.FC<{ t: number; title: string; items: { a: number; tx: string }[]; out: number }> = ({ t, title, items, out }) => {
  const o = vis(t, items[0].a - 0.3, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1390, top: 540, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, spr(t, items[0].a - 0.3))) * -40 - 5}deg)`, width: 800, padding: 34, borderRadius: 24, background: "rgba(24,14,10,.93)", border: `5px solid ${COL.red}`, boxShadow: "0 40px 80px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 900 }}>
    <div style={{ fontSize: 46, color: COL.red, marginBottom: 10 }}>{title}</div>
    {items.map((it, i) => { const on = t >= it.a, k = e(t, it.a, it.a + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, color: CU.cal, margin: "12px 0", opacity: 0.3 + 0.7 * k }}>
      <span style={{ fontSize: 46, color: COL.red, transform: `scale(${on ? Math.min(1.2, spr(t, it.a, 1.4)) : 0})` }}>✗</span>{it.tx}</div>; })}
  </div>;
};
const Versus: React.FC<{ t: number; at: number; out: number; l: [string, string]; r: [string, string]; win: "l" | "r"; at2?: number }> = ({ t, at: a, out, l, r, win, at2 }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const k2 = at2 ?? a + 1.2;
  const col = (c: [string, string], ok: boolean, i: number) => <div style={{ width: 540, padding: "30px 20px", borderRadius: 24, textAlign: "center", background: ok ? "rgba(70,120,40,.92)" : "rgba(40,26,18,.92)", border: `5px solid ${ok ? CU.verde : "rgba(246,241,228,.3)"}`, boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `translateY(${(1 - Math.min(1, spr(t, a + i * 0.2))) * 300}px) scale(${t > k2 && ok ? 1.06 : 1})`, position: "relative" }}>
    <div style={{ ...caja, fontSize: 38, color: COL.dim }}>{c[0]}</div><div style={{ ...caja, fontSize: 66 }}>{c[1]}</div>
    <div style={{ position: "absolute", right: 18, top: -40, ...caja, fontSize: 90, color: ok ? CU.verde : COL.red, opacity: e(t, k2, k2 + 0.15), textShadow: extrude(4, "#000") }}>{ok ? "✓" : "✗"}</div>
  </div>;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 560, opacity: o, display: "flex", justifyContent: "center", gap: 60, transform: "translateY(-50%)" }}>{col(l, win === "l", 0)}{col(r, win === "r", 1)}</div>;
};
const Libreta: React.FC<{ t: number; rows: { a: number; tx: string; r?: string }[]; out: number; title: string }> = ({ t, rows, out, title }) => {
  const o = vis(t, rows[0].a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1350, top: 540, opacity: o, transform: `translate(-50%,-50%) rotate(-3deg) scale(${Math.min(1.03, spr(t, rows[0].a))})`, width: 860, padding: "44px 50px", borderRadius: 10, background: "repeating-linear-gradient(0deg,#fbf6e8 0 62px,#c9d8ef 62px 64px)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", borderLeft: "14px solid #c4673a", fontFamily: "'Segoe Print','Comic Sans MS',cursive", color: "#2a2a6a" }}>
    <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 10, color: CU.tinta }}>{title}</div>
    {rows.map((r, i) => { const k = e(t, r.a, r.a + 0.8); return <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 40, height: 64, alignItems: "center", opacity: k > 0 ? 1 : 0 }}>
      <span style={{ clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>{r.tx}</span><span style={{ fontWeight: 900, color: i === rows.length - 1 ? "#1d6b2a" : "#2a2a6a", opacity: e(t, r.a + 0.6, r.a + 0.9) }}>{r.r}</span></div>; })}
  </div>;
};
const Pregunta: React.FC<{ t: number; at: number; q: string; ops: { a: number; tx: string; ic?: string }[]; out: number }> = ({ t, at: a, q, ops, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 1340, top: 470, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, spr(t, a))) * -40 - 6}deg)`, width: 780, padding: 34, borderRadius: 26, background: "rgba(250,246,236,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", fontFamily: FONT }}>
    <div style={{ fontWeight: 900, fontSize: 50, color: CU.tinta, marginBottom: 22, lineHeight: 1.05 }}>{q}</div>
    {ops.map((op, i) => { const on = t >= op.a, k = Math.min(1, spr(t, op.a));
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", marginTop: 12, borderRadius: 16, border: `4px solid ${on ? CU.barro : "rgba(42,26,16,.18)"}`, background: on ? "rgba(196,103,58,.14)" : "transparent", transform: `scale(${on ? 0.96 + 0.04 * k : 0.96})`, fontWeight: 900, fontSize: 42, color: on ? CU.tinta : "rgba(42,26,16,.35)" }}>
        <span>{op.ic ?? "•"}</span>{op.tx}</div>; })}
  </div>;
};
const Comentario: React.FC<{ t: number; at: number; text: string; out: number }> = ({ t, at: a, text, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, a + 0.3, a + 0.3 + text.length * 0.045)), cur = Math.floor(t * 2.5) % 2 ? "|" : " ";
  return <div style={{ position: "absolute", left: 960, top: 900, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - e(t, a, a + 0.35)) * 120}px)`, display: "flex", alignItems: "center", gap: 22 }}>
    <div style={{ width: 86, height: 86, borderRadius: "50%", background: CU.barro, border: "5px solid #fff", ...caja, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>U</div>
    <div style={{ width: 1000, padding: "22px 30px", borderRadius: 14, background: "rgba(20,14,10,.9)", border: "3px solid rgba(246,241,228,.4)", fontFamily: FONT, fontWeight: 700, fontSize: 42, color: CU.cal }}>{text.slice(0, n)}<span style={{ color: CU.maiz }}>{cur}</span></div>
    <div style={{ ...caja, fontSize: 90, color: CU.maiz, transform: `translateY(${10 * Math.sin(t * 6)}px)`, textShadow: extrude(5, "#5a3a00") }}>↓</div>
  </div>;
};
const SubBtn: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const click = e(t, a + 0.9, a + 1.05) * (1 - e(t, a + 1.05, a + 1.25)), on = t > a + 1.05, bell = a + 1.6;
  const sw = t > bell ? 22 * Math.exp(-(t - bell) * 1.5) * Math.sin((t - bell) * 18) : 0;
  return <div style={{ position: "absolute", left: 960, top: 840, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, a))})`, display: "flex", alignItems: "center", gap: 30 }}>
    <div style={{ padding: "26px 60px", borderRadius: 18, background: on ? "#5a5550" : "#e2231a", ...caja, fontSize: 64, letterSpacing: 2, boxShadow: `0 ${18 - click * 12}px 0 ${on ? "#2e2b28" : "#8a120c"}, 0 30px 50px rgba(0,0,0,.5)`, transform: `translateY(${click * 12}px)` }}>{on ? "SUSCRITA ✓" : "SUSCRÍBASE"}</div>
    <div style={{ fontSize: 110, transform: `rotate(${sw}deg)`, transformOrigin: "50% 10%", opacity: e(t, bell - 0.4, bell - 0.1) }}>🔔</div>
  </div>;
};
const Precio: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub: string }> = ({ t, at: a, out, x, y, text, sub }) => {
  const o = vis(t, a, out); if (o <= 0.01) return null;
  const sw = 14 * Math.exp(-(t - a) * 1.4) * Math.sin((t - a) * 8);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
    <div style={{ transform: "translateX(-50%)", padding: "24px 44px 24px 64px", background: CU.maiz, clipPath: "polygon(18% 0,100% 0,100% 100%,18% 100%,0 50%)", fontFamily: FONT, fontWeight: 900, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ fontSize: 96, color: CU.tinta, lineHeight: 1, whiteSpace: "nowrap" }}>{text}</div><div style={{ fontSize: 34, color: "#6b3a00", whiteSpace: "nowrap" }}>{sub}</div></div>
  </div>;
};
const Final: React.FC<{ t: number; at: number; text: string; out: number }> = ({ t, at: a, text, out }) => {
  const o = vis(t, a, out, 0.3); if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, a, a + 1.2));
  return <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: "translate(-50%,-50%)", padding: "40px 80px", borderRadius: 30, background: "rgba(250,246,236,.95)", border: `10px dashed ${CU.chile}`, boxShadow: "0 40px 80px rgba(0,0,0,.5)", fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 84, color: CU.tinta, whiteSpace: "nowrap" }}>
    {text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span></div>;
};

// =====================================================================================
// LA GUÍA EN 3D DENTRO DE LA COCINA: el libro está en la mesa → vuela a cámara → se abre en la página real → QR
// El QR nunca lleva blur ni velo encima (tiene que leer de verdad desde la tele).
// =====================================================================================
const BW = 430, BH = 610;
const Guia: React.FC<{ t: number; c: Cta }> = ({ t, c }) => {
  const o = e(t, c.a - 0.3, c.a + 0.2) * (1 - e(t, c.b - 0.1, c.b + 0.4));
  if (o <= 0.01) return null;
  const m = screenOf(t, PT.mesa);
  const fly = ei(t, c.a, c.a + 1.3), open = ei(t, c.open, c.open + 1.0), zoom = ei(t, c.open + 0.9, c.open + 2.0);
  const x = m.x + (700 - m.x) * fly, y = m.y + (540 - m.y) * fly, sc = (0.22 + 0.78 * fly) * (1 + 0.28 * zoom);
  const fl = Math.sin(t * 1.4) * 6, ry = -24 + 14 * fly + 2 * Math.sin(t * 0.7) + 24 * open;
  const qi = Math.min(1.04, spr(t, c.a + 1.2, 0.9));
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 50%, rgba(20,12,8,${0.25 * fly}) 0%, rgba(10,6,4,${0.7 * fly}) 100%)` }} />
    {/* el libro: tapa que se abre (gira sobre el lomo) y adentro la página real del PDF */}
    <div style={{ position: "absolute", left: x, top: y + fl, perspective: 1800, transform: `translate(-50%,-50%) scale(${sc})` }}>
      <div style={{ position: "relative", width: BW, height: BH, transformStyle: "preserve-3d", transform: `rotateY(${ry}deg) rotateX(${4 - 3 * fly}deg) translateX(${open * BW * 0.5}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#fffdf7", borderRadius: "4px 10px 10px 4px", boxShadow: "0 50px 100px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <Img src={staticFile(P + c.pag)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `rotateY(${-170 * open}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "4px 12px 12px 4px", overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.15)" }}>
            <Img src={staticFile(P + c.cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(102deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,.1) 9%, rgba(255,255,255,.12) 34%, rgba(255,255,255,0) 62%)" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "12px 4px 4px 12px", background: "linear-gradient(90deg,#efe2c4,#e3d2ab)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontFamily: FONT, fontWeight: 900, color: CU.barro, textAlign: "center", padding: 30 }}>
            <div style={{ fontSize: 34, letterSpacing: 4 }}>{c.libro}</div>
            <div style={{ fontSize: 26, color: "#7a5a40", marginTop: 14 }}>140 RECETAS CASERAS</div>
          </div>
        </div>
      </div>
    </div>
    {/* cinta del ahorro */}
    <div style={{ position: "absolute", left: 700, top: 110, transform: `translate(-50%,-50%) scale(${Math.min(1.04, spr(t, c.a + 0.6))})`, opacity: e(t, c.a + 0.6, c.a + 0.8), padding: "16px 40px", borderRadius: 16, background: CU.maiz, ...caja, fontSize: 50, color: CU.tinta, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{c.ahorro}</div>
    {/* el QR: tarjeta blanca limpia, sin filtros encima */}
    <div style={{ position: "absolute", left: 1560, top: 500, transform: `translate(-50%,-50%) scale(${qi})`, opacity: e(t, c.a + 1.2, c.a + 1.4), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 400, height: 400, borderRadius: 30, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 70px rgba(0,0,0,.55)", border: `8px solid ${CU.barro}` }}>
        <Img src={staticFile(P + "qr_g.png")} style={{ width: 340, height: 340, objectFit: "contain" }} />
      </div>
      <div style={{ ...caja, fontSize: 44, marginTop: 26, textShadow: extrude(4, "#000") }}>ESCANEE CON LA CÁMARA</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: CU.masa, marginTop: 10, textAlign: "center", width: 520, lineHeight: 1.25, textShadow: "0 2px 10px #000" }}>o el link está en la primera línea de la descripción</div>
    </div>
  </AbsoluteFill>;
};

// =====================================================================================
export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const cta = inCta(t);
  const L: React.ReactNode[] = [];
  L.push(cta ? <World key="w" t={t} /> : <Capa key="capa" t={t} />);
  if (!cta) for (let i = 0; i < PL.ov.length; i++) {
    const v = PL.ov[i];
    if (t < v.a - 0.6 || t > v.out + 0.6) continue;
    const k = "o" + i, x = v.x ?? 960, y = v.y ?? 250;
    switch (v.ty) {
      case "num": L.push(<NumTruco key={k} t={t} at={v.a} n={v.n ?? 1} N={PL.ntr} title={v.tx ?? ""} />); break;
      case "sello": L.push(<Sello key={k} t={t} at={v.a} out={v.out} text={v.tx ?? ""} x={x} y={y} size={v.size} />); break;
      case "tabla": L.push(<Tabla key={k} t={t} at={v.a} out={v.out} text={v.tx ?? ""} x={x} y={v.y ?? 120} col={v.col} size={v.size} />); break;
      case "big": L.push(<BigNum key={k} t={t} at={v.a} out={v.out} text={v.tx ?? ""} sub={v.sub} x={x} y={v.y ?? 500} size={v.size ?? 220} col={CU.maiz} edge="#6b3a00" />); break;
      case "pens": L.push(<Pensamiento key={k} t={t} at={v.a} out={v.out} text={v.tx ?? ""} x={x} y={v.y ?? 220} />); break;
      case "chk": L.push(<Checklist key={k} t={t} title={v.tx ?? ""} items={v.items ?? []} out={v.out} />); break;
      case "err": L.push(<Errores key={k} t={t} title={v.tx ?? ""} items={v.items ?? []} out={v.out} />); break;
      case "vs": L.push(<Versus key={k} t={t} at={v.a} out={v.out} l={v.l ?? ["", ""]} r={v.r ?? ["", ""]} win={v.win ?? "r"} at2={v.a2} />); break;
      case "libreta": L.push(<Libreta key={k} t={t} rows={v.items ?? []} out={v.out} title={v.tx ?? "La cuenta de Cuca"} />); break;
      case "preg": L.push(<Pregunta key={k} t={t} at={v.a} out={v.out} q={v.q ?? ""} ops={v.items ?? []} />); break;
      case "coment": L.push(<Comentario key={k} t={t} at={v.a} out={v.out} text={v.tx ?? ""} />); break;
      case "sub": L.push(<SubBtn key={k} t={t} at={v.a} out={v.out} />); break;
      case "precio": L.push(<Precio key={k} t={t} at={v.a} out={v.out} x={x} y={v.y ?? 300} text={v.tx ?? ""} sub={v.sub ?? ""} />); break;
      case "final": L.push(<Final key={k} t={t} at={v.a} out={v.out} text={v.tx ?? ""} />); break;
    }
  }
  if (cta) { L.push(<Guia key="guia" t={t} c={cta} />); L.push(<AvatarPiP key="pip" t={t} />); }
  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};
