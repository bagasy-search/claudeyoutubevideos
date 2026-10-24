// plo30olor · el video entero (≈33 min) en UNA escena: la casa en corte (casa3d) es el mapa; la cámara vuela de desagüe en
// desagüe, las fotos de cada frase entran con barridos, el avatar entra por portales y sale con barridos. El guion visual
// (beats) y las piezas (fx) los arma vlog/plo30olor/mkplan.py desde la voz (words.json) → plan.json: cada cosa en el
// segundo en que se DICE. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, DR, PT, makeCam, type DK, type Key, type WorldState } from "./casa3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import WORDS from "./words.json";
import PLAN from "./plan.json";
import { BigNum, COL, FONT, P, Portal, Tag, Vid, e, ei, extrude, s, spr } from "./lib";
import { CamaraMano } from "../kits/camara/CamaraMano";

// ---------------- reloj de la voz ----------------
const norm = (x: string) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
const WN = (WORDS as { w: string; s: number }[]).map((x) => ({ w: norm(x.w), s: x.s }));
export const at = (ph: string, after = 0): number => {
  const q = norm(ph).split(" ").filter(Boolean);
  for (let i = 0; i < WN.length; i++) {
    if (WN[i].s < after) continue;
    if (q.every((w, j) => WN[i + j]?.w === w)) return WN[i].s;
  }
  throw new Error("at(): no encuentro «" + ph + "» en words.json");
};

type Sec = { k: string; a: number; b: number; dk?: DK; n?: number; name?: string };
type Fx = { type: string; a: number; out: number; [k: string]: any };
const PL = PLAN as unknown as { end: number; secs: Sec[]; beats: { a: number; v: string }[]; fx: Fx[]; ev: Record<string, number> };
export const END = PL.end;
const B = PL.beats, EV = PL.ev;
const ev = (k: string) => EV[k] ?? 1e9;

// ---------------- AVATAR (reel de RunPod; si todavía no está, el still) ----------------
const AV = AVAIL as { reel: boolean; reelLen?: number; ltx: string[] };
const LTX = new Set(AV.ltx);
export const clip = (k: string) => (LTX.has(k) ? "ltx_" + k : "img_" + k);
const REEL_LEN = AV.reelLen ?? 600;
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
const winAt = (t: number) => WIN.findIndex((w) => t >= w.ms && t < w.me);
export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.4 && t < w.me + 0.8);
  // sólo se montan las ventanas cercanas (33 min × 90 ventanas: montar todas mata el render)
  const face = AV.reel ? <>{WIN.map((w, i) => Math.abs(i - Math.max(0, vis)) > 1 ? null : (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(REEL_LEN) - Math.max(0, s(w.off) - 10)} active={(f) => f > s(REEL_LEN) - Math.max(0, s(w.off) - 10)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.015 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// foto/clip a cuadro completo con empuje lento
const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number; dur?: number }> = ({ k, t, a, z = [1.03, 1.12], ox = 0, oy = 0, dur = 8 }) => {
  const q = e(t, a, a + dur), sc = z[0] + (z[1] - z[0]) * q, id = clip(k);
  return <AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}><Vid id={id} at={id.startsWith("ltx_") ? a : undefined} vol={id.startsWith("ltx_") ? 0.18 : 0} /></AbsoluteFill>;
};
const Swipe: React.FC<{ t: number; a: number; b: number; from: React.ReactNode; to: React.ReactNode; dir?: number; vert?: boolean }> = ({ t, a, b, from, to, dir = 1, vert }) => {
  const k = ei(t, a, b), ax = vert ? "Y" : "X", D = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      {k < 1 && <AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * D}px)` }}>{from}</AbsoluteFill>}
      {k > 0 && <AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * D}px)` }}>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------------- CÁMARA: poses por desagüe ----------------
type Pose = { p: [number, number, number]; l: [number, number, number]; fov: number };
const near = (k: DK, d = 1, dy = 0): Pose => { const m = DR[k].mouth, tr = DR[k].trap; return { p: [m[0] + 0.55 * d, m[1] + 0.75 * d + dy, m[2] + 2.3 * d], l: [m[0], (m[1] + tr[1]) / 2, m[2]], fov: 34 }; };
const trapV = (k: DK): Pose => { const tr = DR[k].trap; return { p: [tr[0] + 0.25, tr[1] + 0.25, tr[2] + 1.35], l: [tr[0], tr[1] + 0.05, tr[2]], fov: 30 }; };
const over = (x: number, h = 4.4): Pose => ({ p: [x, h, h * 0.75], l: [x, 0.2, -1.4], fov: 46 });
const POSE: Record<string, Pose> = {
  house: { p: [-0.6, 5.2, 11.5], l: [-0.6, 0.4, -1.2], fov: 50 },
  under: { p: [-0.5, -0.2, 7.5], l: [-0.5, -0.4, -1.4], fov: 48 },
  roof: { p: [5.2, 4.0, 1.4], l: [6.15, 3.0, -2.15], fov: 36 },
  ventall: { p: [4.6, 1.6, 6.0], l: [5.6, 1.0, -2.0], fov: 46 },
  street: { p: [-9.0, 0.6, 3.0], l: [-10.2, -0.8, -1.2], fov: 42 },
  overL: over(-5.5), overC: over(-1.5), overB: over(2.6), overR: over(6.2),
  bano: { p: [2.6, 2.4, 3.6], l: [2.6, 0.5, -1.6], fov: 50 },
};
const DKS: DK[] = ["patio", "washer", "kitchen", "dish", "lav", "over", "toilet", "floor", "shower", "tub", "guest", "vent"];
DKS.forEach((k) => { POSE[k] = near(k); POSE[k + "T"] = trapV(k); POSE[k + "W"] = near(k, 1.7, 0.3); });
const push = (q: Pose, k = 0.12): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as Pose["p"], l: q.l, fov: q.fov - 2 });
const KEYS: Key[] = [{ t: 0, ...POSE.house }];
{
  let prev: Pose | null = null;
  B.forEach((b, i) => {
    const end = i < B.length - 1 ? B[i + 1].a : END;
    if (!b.v.startsWith("w")) { prev = null; return; }
    const q = POSE[b.v.split(":")[1]] ?? POSE.house;
    const fly = prev && end - b.a > 2.4 ? Math.min(1.6, (end - b.a) * 0.3) : 0;
    if (prev) KEYS.push({ t: b.a, ...prev });
    KEYS.push({ t: b.a + fly, ...q, arc: 0.04 });
    prev = push(q, 0.08 + Math.min(0.14, (end - b.a) * 0.012));
    KEYS.push({ t: end - 0.01, ...prev });
  });
}
KEYS.sort((x, y) => x.t - y.t);
const CAM = makeCam(KEYS);
const { screenOf, camSpeed } = CAM;

// ---------------- estado del mundo: lo que pasa en cada desagüe según la voz ----------------
const on = (t: number, x: number, y = 1e9, f = 0.4) => e(t, x, x + f) * (1 - e(t, y, y + f));
const secAt = (t: number) => PL.secs.find((q) => t >= q.a && t < q.b);
const stAt = (t: number): WorldState => {
  const sc = secAt(t), dk = sc?.dk;
  const ring: Partial<Record<DK, number>> = {}, gas: Partial<Record<DK, number>> = {}, trap: WorldState["trap"] = {}, lift: WorldState["lift"] = {};
  if (dk && sc) ring[dk] = on(t, sc.a + 0.3, sc.b - 0.3);
  // gancho: todo el baño echa gas
  const hook = on(t, 0, ev("promise"));
  (["lav", "floor", "shower", "toilet"] as DK[]).forEach((k) => (gas[k] = Math.max(gas[k] ?? 0, hook)));
  // la causa: el sifón con su agua (tapón) → la baba que fabrica el gas
  const slime = on(t, ev("baba"), ev("receta"));
  trap.kitchen = { slime: Math.max(slime, on(t, ev("d1"), ev("d1fix"))), foam: on(t, ev("espuma"), ev("receta_fin")) };
  gas.kitchen = Math.max(gas.kitchen ?? 0, on(t, ev("gasfab"), ev("receta")), on(t, ev("d1"), ev("d1fix")));
  // receta en la cocina
  trap.kitchen.foam = Math.max(trap.kitchen.foam ?? 0, on(t, ev("d1fix"), ev("d2"), 0.6) * 0.8);
  // seco: coladera del piso y patio
  const dryF = on(t, ev("d5seco"), ev("d5vaso"));
  trap.floor = { water: 1 - 0.95 * dryF, oil: on(t, ev("d5aceite"), ev("d6"), 0.6) };
  gas.floor = Math.max(gas.floor ?? 0, dryF);
  const dryP = on(t, ev("d6seco"), ev("d6fix"));
  trap.patio = { water: 1 - 0.95 * dryP, oil: on(t, ev("d6aceite"), ev("regancho2"), 0.6) };
  gas.patio = dryP;
  // lavadora: la manguera chupa el sifón
  const chupa = on(t, ev("d7chupa"), ev("d7fix"));
  trap.washer = { water: 1 - 0.85 * chupa * (0.5 + 0.5 * Math.sin(t * 2)) };
  gas.washer = chupa;
  // lavabo y rebosadero (baba escondida)
  trap.lav = { slime: on(t, ev("d2"), ev("d2fix")) + on(t, ev("d11"), ev("d11fix")) };
  gas.lav = on(t, ev("d2"), ev("d2fix"));
  gas.over = on(t, ev("d11canal"), ev("d11fix"));
  trap.shower = { slime: on(t, ev("d3"), ev("d3fix")) }; gas.shower = Math.max(gas.shower ?? 0, on(t, ev("d3"), ev("d3fix")));
  trap.tub = { slime: on(t, ev("d4"), ev("d4fix")) };
  // baño de visitas: todos secos → vaso + aceite
  const dryG = on(t, ev("d10"), ev("d10fix"));
  trap.guest = { water: 1 - 0.95 * dryG, oil: on(t, ev("d10fix"), ev("errores"), 0.6) }; gas.guest = dryG;
  // las tres pruebas: rejillas que se levantan
  lift.floor = on(t, ev("linterna"), ev("d1")); lift.shower = on(t, ev("d3fix"), ev("d4"));
  lift.patio = on(t, ev("d6fix"), ev("regancho2"));
  return {
    lamps: 1, xray: Math.max(on(t, ev("causa"), ev("diagnostico")), on(t, ev("rutina"), END)) * 0.6 + 0.4, doors: 1,
    hose: on(t, ev("d7fix"), END), tapon: on(t, ev("d2"), ev("d2fix")), nest: on(t, ev("nido"), ev("variantes")), dust: on(t, ev("d10"), ev("d10fix")) * 0.8,
    lift, trap, gas, ring, ringCol: COL.amber,
  };
};

const WorldR: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(4, v0.bx * 0.35), by: Math.min(3, v0.by * 0.35) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: [v.bx + v.by > 0.6 ? `url(#${id})` : "", dim > 0 ? `brightness(${1 - dim})` : ""].join(" ").trim() || undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const beatAt = (t: number) => { let lo = 0, hi = B.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (B[m].a <= t) lo = m; else hi = m - 1; } return lo; };
const Visual: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const b = B[i], end = i < B.length - 1 ? B[i + 1].a : END, [kind, k] = b.v.split(":");
  if (kind === "img" || kind === "imgd") { const zin = i % 2 === 0; const sh = <Shot k={k} t={t} a={b.a} dur={end - b.a + 0.6} z={zin ? [1.03, 1.13] : [1.13, 1.03]} ox={(i % 3 - 1) * 24} oy={zin ? -10 : 10} />; return kind === "imgd" ? <AbsoluteFill style={{ filter: "brightness(0.5)" }}>{sh}</AbsoluteFill> : sh; }
  return <WorldR t={t} dim={kind === "wd" ? 0.55 : 0} />;
};

// =====================================================================================================================
// PIEZAS (todas entran con su frase y se van con la siguiente)
// =====================================================================================================================
const panel = "linear-gradient(180deg, rgba(14,22,36,.94), rgba(8,12,20,.94))";

// título del desagüe: número gigante extruido + nombre que se escribe + el icono del lugar
const DrainTitle: React.FC<{ t: number; a: number; out: number; n: number; name: string; sub?: string }> = ({ t, a, out, n, name, sub }) => {
  const k = Math.min(1.12, spr(t, a, 0.85)), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 96, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70}deg)`, transformOrigin: "0 50%" }}>
        <div style={{ fontWeight: 900, fontSize: 38, color: COL.ice, letterSpacing: 10, textShadow: "0 3px 12px #000" }}>DESAGÜE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontWeight: 900, fontSize: 200, lineHeight: 0.95, color: COL.amber, textShadow: extrude(10, "#4a2a05") }}>{n}</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: "#fff", maxWidth: 820, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.7)"), clipPath: `inset(0 ${100 - 100 * e(t, a + 0.25, a + 0.7)}% 0 0)` }}>{name}</div>
            {sub && <div style={{ fontWeight: 800, fontSize: 30, color: COL.dim, letterSpacing: 4, marginTop: 6, opacity: e(t, a + 0.6, a + 0.9) }}>{sub}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// barra de progreso de los 11 desagües (abajo), el actual se enciende
const Progress: React.FC<{ t: number }> = ({ t }) => {
  const ds = PL.secs.filter((q) => q.n);
  const first = ds[0]?.a ?? 1e9, last = PL.secs.find((q) => q.k === "RUTINA")?.a ?? 1e9;
  const o = e(t, first, first + 0.5) * (1 - e(t, last, last + 0.5));
  if (o <= 0.01) return null;
  const nums = Array.from(new Set(ds.map((q) => q.n!)));
  const cur = secAt(t)?.n;
  return (
    <div style={{ position: "absolute", right: 46, top: 40, display: "flex", gap: 8, opacity: o * 0.92, fontFamily: FONT }}>
      {nums.map((n) => {
        const done = ds.filter((q) => q.n === n).every((q) => q.b <= t), c = n === cur;
        return <div key={n} style={{ width: c ? 54 : 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20,
          color: c ? "#1a1205" : done ? "#bfe9ff" : "rgba(255,255,255,.55)", background: c ? COL.amber : done ? "rgba(40,90,130,.85)" : "rgba(10,14,22,.7)", boxShadow: c ? `0 0 20px ${COL.amber}` : "0 6px 14px rgba(0,0,0,.4)" }}>{n === 11 ? "★" : n}</div>;
      })}
    </div>
  );
};

// corte del sifón (SVG): la U con el agua-tapón, el aire de la cloaca que empuja y no pasa; seco = pasa; baba = burbujas de gas
const TrapDia: React.FC<{ t: number; a: number; out: number; mode: string; x?: number; y?: number }> = ({ t, a, out, mode, x = 1240, y = 300 }) => {
  const o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const dry = mode === "dry" ? e(t, a + 0.8, a + 2.6) : 0, oil = mode === "oil" ? e(t, a + 0.6, a + 1.4) : 0;
  const lvl = 1 - dry, wy = 300 - 120 * lvl;
  const k = spr(t, a, 0.8);
  const arrows = Array.from({ length: 4 }, (_, i) => { const ph = ((t * 0.6 + i / 4) % 1); return ph; });
  const label = mode === "dry" ? "SIFÓN SECO = CAÑO ABIERTO" : mode === "slime" ? "LA BABA FABRICA EL GAS" : mode === "oil" ? "AGUA + TAPITA DE ACEITE" : "EL AGUA ES EL TAPÓN";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.7 + 0.3 * Math.min(1, k)})`, transformOrigin: "50% 0" }}>
      <div style={{ padding: "22px 26px 18px", borderRadius: 26, background: panel, boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15)" }}>
        <svg width={520} height={420} viewBox="0 0 520 420">
          <defs><clipPath id="tu"><path d="M150 20 L150 300 A110 110 0 0 0 370 300 L370 20 L310 20 L310 300 A50 50 0 0 1 210 300 L210 20 Z" /></clipPath></defs>
          <path d="M150 20 L150 300 A110 110 0 0 0 370 300 L370 20 L310 20 L310 300 A50 50 0 0 1 210 300 L210 20 Z" fill="rgba(220,240,255,.08)" stroke="#cfe6f5" strokeWidth={6} />
          <g clipPath="url(#tu)">
            <rect x={140} y={wy} width={240} height={420} fill="#3d9be0" opacity={0.85} />
            {mode === "slime" && <rect x={140} y={0} width={240} height={420} fill="none" stroke="#6b7a4f" strokeWidth={34} opacity={0.75} />}
            {oil > 0 && <rect x={140} y={wy - 14 * oil} width={240} height={14 * oil} fill="#f2c13a" />}
            {mode === "slime" && Array.from({ length: 8 }, (_, i) => { const ph = (t * 0.5 + i / 8) % 1; return <circle key={i} cx={180 + (i % 2) * 160 + Math.sin(t * 3 + i) * 8} cy={330 - ph * 320} r={6 + 4 * ph} fill="#a6e05c" opacity={0.8 * (1 - ph)} />; })}
          </g>
          {/* el aire de la cloaca empuja por el brazo derecho */}
          {arrows.map((ph, i) => {
            const pass = lvl < 0.3, yy = pass ? 400 - ph * 400 : 400 - ph * Math.min(90 + (1 - lvl) * 200, 400);
            return <text key={i} x={pass ? 260 + Math.sin(ph * 6) * 60 : 470} y={yy} fontSize={34} fill={pass ? "#a6e05c" : "#9fd65a"} opacity={(1 - ph) * 0.9} textAnchor="middle">☁</text>;
          })}
          {lvl >= 0.3 && <text x={470} y={300 - 60} fontSize={44} fill="#ff6b5e" textAnchor="middle" opacity={0.6 + 0.4 * Math.sin(t * 6)}>✋</text>}
          <text x={260} y={410} fontSize={22} fill="rgba(255,255,255,.6)" textAnchor="middle" fontFamily={FONT} fontWeight={800} letterSpacing={3}>A LA RED DE CLOACAS →</text>
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: mode === "dry" || mode === "slime" ? "#ff8a7a" : "#7dffb4", letterSpacing: 2, textAlign: "center", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
};

// la receta: tarjeta con 4 pasos que se encienden con su frase (+ cronómetro cuando dice minutos)
const Recipe: React.FC<{ t: number; a: number; out: number; steps: { at: number; ic: string; tx: string }[]; title?: string; x?: number; y?: number }> = ({ t, a, out, steps, title = "LA TAZA", x = 1180, y = 150 }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = spr(t, a, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ transform: `rotateY(${-14 + (1 - Math.min(1, k)) * -60}deg) rotateX(4deg)`, width: 640, padding: "26px 32px", borderRadius: 26, background: "linear-gradient(180deg,#fbfaf6,#efe9dc)", boxShadow: "0 50px 90px rgba(0,0,0,.65)", fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: "#b0661a", letterSpacing: 6 }}>{title}</div>
        {steps.map((st, i) => {
          const lit = e(t, st.at, st.at + 0.2), kk = Math.min(1.1, spr(t, st.at));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16, opacity: 0.28 + 0.72 * lit, transform: `translateX(${(1 - Math.min(1, kk)) * 40}px)` }}>
              <div style={{ width: 70, height: 70, borderRadius: 18, background: lit > 0.5 ? "#1d2733" : "#c9c1b0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{st.ic}</div>
              <div style={{ fontWeight: 900, fontSize: 40, color: "#1d2733", lineHeight: 1.1 }}>{st.tx}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// cronómetro redondo que corre (comprime los minutos en ~2,5 s)
const Timer: React.FC<{ t: number; a: number; out: number; mins: number; x?: number; y?: number; label?: string }> = ({ t, a, out, mins, x = 360, y = 560, label }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = ei(t, a + 0.3, a + 2.8), v = Math.round(mins * q), R = 120, C = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, spr(t, a))})`, opacity: o, textAlign: "center", fontFamily: FONT }}>
      <svg width={300} height={300}><circle cx={150} cy={150} r={R + 20} fill="rgba(10,14,22,.88)" /><circle cx={150} cy={150} r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={18} />
        <circle cx={150} cy={150} r={R} fill="none" stroke={COL.amber} strokeWidth={18} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - q)} transform="rotate(-90 150 150)" style={{ filter: `drop-shadow(0 0 10px ${COL.amber})` }} />
        <text x={150} y={168} textAnchor="middle" fontSize={78} fontWeight={900} fill="#fff" fontFamily={FONT}>{v}</text><text x={150} y={210} textAnchor="middle" fontSize={24} fontWeight={800} fill={COL.dim} fontFamily={FONT} letterSpacing={4}>{mins >= 60 ? "MIN" : "MINUTOS"}</text></svg>
      {label && <div style={{ fontWeight: 900, fontSize: 34, color: "#fff", letterSpacing: 3, textShadow: extrude(4, "#000"), marginTop: -6 }}>{label}</div>}
    </div>
  );
};

// la anécdota: pin en el mapa de México + ciudad + "hace N años"
const MX = "M60 40 L200 30 L250 80 L330 120 L380 200 L420 230 L470 240 L520 300 L560 290 L600 330 L560 360 L500 350 L440 330 L380 300 L330 260 L280 210 L230 160 L170 120 L120 90 Z";
const CITY: Record<string, [number, number]> = { GUADALAJARA: [300, 270], MONTERREY: [390, 160], PUEBLA: [450, 300], QUERÉTARO: [380, 260], CUERNAVACA: [420, 315], LEÓN: [360, 245], CDMX: [420, 295] };
const City: React.FC<{ t: number; a: number; out: number; city: string; sub?: string }> = ({ t, a, out, city, sub }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const [cx, cy] = CITY[city] ?? [400, 280], drop = spr(t, a + 0.4, 1.1);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, opacity: o, perspective: 1200, fontFamily: FONT }}>
      <div style={{ transform: `rotateX(${(1 - Math.min(1, spr(t, a, 0.8))) * 70 + 12}deg)`, transformOrigin: "50% 100%", padding: "18px 26px", borderRadius: 24, background: panel, boxShadow: "0 40px 80px rgba(0,0,0,.6)", display: "flex", gap: 22, alignItems: "center" }}>
        <svg width={330} height={210} viewBox="40 20 580 360"><path d={MX} fill="#2b4a63" stroke="#8fd6ff" strokeWidth={4} />
          <circle cx={cx} cy={cy} r={14 + 30 * e(t, a + 0.6, a + 1.4)} fill="none" stroke={COL.amber} strokeWidth={4} opacity={1 - e(t, a + 0.6, a + 1.4)} />
          <g transform={`translate(${cx},${cy - 60 * (1 - Math.min(1, drop))})`}><path d="M0 0 C-22 -30 -22 -56 0 -56 C22 -56 22 -30 0 0 Z" fill={COL.amber} /><circle cx={0} cy={-38} r={8} fill="#1a1205" /></g></svg>
        <div><div style={{ fontWeight: 900, fontSize: 56, color: "#fff", letterSpacing: 3, textShadow: extrude(5, "#000") }}>{city}</div>
          {sub && <div style={{ fontWeight: 800, fontSize: 30, color: COL.amber, letterSpacing: 4 }}>{sub}</div>}</div>
      </div>
    </div>
  );
};

// sello (golpe)
const Stamp: React.FC<{ t: number; a: number; out: number; text: string; x?: number; y?: number; rot?: number; size?: number; col?: string }> = ({ t, a, out, text, x = 960, y = 540, rot = -8, size = 96, col = COL.red }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.3)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// filas ✓ / ✗
const Rows: React.FC<{ t: number; out: number; y?: number; items: { at: number; tx: string; ok: boolean }[] }> = ({ t, out, y = 300, items }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, fontFamily: FONT }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px)`, display: "flex", alignItems: "center", gap: 24, padding: "14px 40px", borderRadius: 22, background: "rgba(10,14,22,.88)", boxShadow: `0 0 0 4px ${it.ok ? "#3fe08a" : COL.red}, 0 30px 60px rgba(0,0,0,.55)` }}>
          <span style={{ fontWeight: 900, fontSize: 64, color: it.ok ? "#7dffb4" : "#ff6b5e" }}>{it.ok ? "✓" : "✗"}</span>
          <span style={{ fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: 2 }}>{it.tx}</span>
        </div>
      );
    })}
  </div>
);

// fichas numeradas que caen (pruebas, errores, partes)
const Chips: React.FC<{ t: number; out: number; items: { at: number; tx: string; ic?: string }[]; y?: number; red?: boolean }> = ({ t, out, items, y = 800, red }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 26, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at)), o = e(t, it.at, it.at + 0.1) * (1 - e(t, out + i * 0.05, out + i * 0.05 + 0.25));
      const c = red ? "#ff8a7a" : COL.ice;
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, minWidth: 220, padding: "16px 20px 12px", borderRadius: 18,
          background: red ? "linear-gradient(180deg, rgba(60,10,12,.95), rgba(26,6,8,.95))" : panel, boxShadow: `0 26px 50px rgba(0,0,0,.6), 0 0 0 2px ${c}66`, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 64, color: c, lineHeight: 1, textShadow: extrude(5, "#06121e") }}>{it.ic ?? i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: COL.ink, letterSpacing: 3, marginTop: 6 }}>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// frase grande palabra por palabra
const Quote: React.FC<{ t: number; a: number; out: number; text: string; col?: string; y?: number; size?: number }> = ({ t, a, out, text, col = "#fff", y = 400, size = 92 }) => {
  const w = text.split(" "), o = 1 - e(t, out, out + 0.3);
  if (t < a || o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: col, letterSpacing: 2, opacity: o }}>
      {w.map((x, i) => { const ai = a + i * 0.11, k = Math.min(1.1, spr(t, ai)); return <span key={i} style={{ display: "inline-block", margin: "0 13px", opacity: e(t, ai, ai + 0.08), transform: `translateY(${(1 - Math.min(1, k)) * 60}px)`, textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{x}</span>; })}
    </div>
  );
};

// la cuenta (recibo que se imprime)
const Receipt: React.FC<{ t: number; out: number; rows: { at: number; item: string; v: string }[]; total?: { at: number; item: string; v: string }; x?: number; y?: number; title?: string }> = ({ t, out, rows, total, x = 1240, y = 170, title = "LA CUENTA" }) => {
  const o = e(t, rows[0].at - 0.25, rows[0].at) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at), tot = total && t >= total.at;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ transform: "rotateY(-16deg) rotateX(4deg) rotateZ(1.5deg)", width: 520, background: "linear-gradient(180deg,#fbfaf6,#efece3)", borderRadius: 4, boxShadow: "0 40px 80px rgba(0,0,0,.65)", padding: "28px 30px", fontFamily: "'Courier New', monospace", color: "#1c1c1c" }}>
        <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 3, textAlign: "center", borderBottom: "2px dashed #999", paddingBottom: 10, marginBottom: 12 }}>{title}</div>
        {shown.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, lineHeight: "50px", opacity: e(t, r.at, r.at + 0.15) }}><span>{r.item}</span><span>{r.v}</span></div>)}
        {tot && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, fontWeight: 900, borderTop: "2px dashed #999", marginTop: 10, paddingTop: 12, color: "#b3261e", transform: `scale(${Math.min(1.08, spr(t, total!.at))})`, transformOrigin: "100% 50%" }}><span>{total!.item}</span><span>{total!.v}</span></div>}
      </div>
    </div>
  );
};

// la rutina en un calendario de pared: semana / mes / 3 meses
const Calendar: React.FC<{ t: number; out: number; items: { at: number; when: string; tx: string; ic: string }[] }> = ({ t, out, items }) => {
  const o = e(t, items[0].at - 0.3, items[0].at) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1080, top: 120, opacity: o, perspective: 1400, fontFamily: FONT }}>
      <div style={{ transform: `rotateY(-12deg) rotateX(3deg)`, width: 720, borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.65)", background: "#fbfaf6" }}>
        <div style={{ background: "#b3261e", color: "#fff", fontWeight: 900, fontSize: 36, letterSpacing: 6, padding: "16px 28px" }}>LA RUTINA DE CLAUDIO</div>
        {items.map((it, i) => {
          const k = Math.min(1.1, spr(t, it.at)), lit = e(t, it.at, it.at + 0.2);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 28px", borderTop: i ? "2px solid #e6dfd0" : undefined, opacity: 0.25 + 0.75 * lit, transform: `translateX(${(1 - Math.min(1, k)) * 50}px)` }}>
              <div style={{ fontSize: 52 }}>{it.ic}</div>
              <div><div style={{ fontWeight: 900, fontSize: 26, color: "#b3261e", letterSpacing: 4 }}>{it.when}</div><div style={{ fontWeight: 900, fontSize: 36, color: "#1d2733" }}>{it.tx}</div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ⭐ CTA: la GUÍA en 3D: la tapa entra girando, se abre, la cámara se acerca a la PÁGINA 14 REAL y subraya el "haz esto";
// al costado el QR (escanea con la cámara) y la 1ª línea de la descripción. En pantalla NUNCA la URL.
const Guide: React.FC<{ t: number; a: number; out: number; open: number; qr: number; desc?: number }> = ({ t, a, out, open, qr, desc }) => {
  const o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const k = Math.min(1.08, spr(t, a, 0.7)), op = ei(t, open, open + 1.1), zoom = ei(t, open + 1.0, open + 3.6), mark = e(t, open + 2.4, open + 3.3);
  const q = spr(t, qr, 0.8), qo = e(t, qr, qr + 0.2);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1900, background: `radial-gradient(ellipse at 40% 50%, rgba(10,20,34,${0.55 * o}), rgba(4,8,14,${0.85 * o}))` }}>
      <div style={{ position: "absolute", left: 420, top: 80, width: 640, height: 905, transformStyle: "preserve-3d", transformOrigin: "50% 25%",
        transform: `translateX(${-120 * zoom}px) rotateY(${(1 - Math.min(1, k)) * -80 + 10 - 10 * zoom}deg) rotateX(${6 - 6 * zoom}deg) scale(${1 + 0.9 * zoom}) translateY(${150 * zoom}px)` }}>
        {/* página 14 (debajo) */}
        <Img src={staticFile(P + "pag14.png")} style={{ position: "absolute", inset: 0, width: 640, height: 905, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: 58, top: 905 * 0.34, height: 905 * 0.056, width: 524 * mark, background: "rgba(255,214,10,.4)", mixBlendMode: "multiply", borderRadius: 6 }} />
        {/* la tapa que se abre como una puerta */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `rotateY(${-165 * op}deg)`, backfaceVisibility: "hidden" }}>
          <Img src={staticFile(P + "portada.png")} style={{ width: 640, height: 905, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1240, top: 120, fontFamily: FONT, opacity: e(t, a + 0.4, a + 0.8) }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 5, textShadow: "0 3px 10px #000" }}>LA COLECCIÓN DE CLAUDIO</div>
        <div style={{ fontWeight: 900, fontSize: 70, color: "#fff", lineHeight: 1.02, letterSpacing: 1, textShadow: extrude(6, "rgba(0,0,0,.7)") }}>PLOMERÍA<br />CASERA</div>
        <div style={{ fontWeight: 800, fontSize: 34, color: COL.ice, letterSpacing: 3, marginTop: 6 }}>50 ARREGLOS · PÁG. 14 = OLOR A CLOACA</div>
      </div>
      {qo > 0.01 && <div style={{ position: "absolute", left: 1300, top: 430, opacity: qo, transform: `scale(${0.6 + 0.4 * Math.min(1, q)}) rotate(${(1 - Math.min(1, q)) * 12}deg)`, transformOrigin: "50% 50%", textAlign: "center", fontFamily: FONT }}>
        <div style={{ padding: 18, background: "#fff", borderRadius: 22, boxShadow: "0 40px 80px rgba(0,0,0,.6)", display: "inline-block" }}><Img src={staticFile(P + "qr.png")} style={{ width: 300, height: 300, display: "block" }} /></div>
        <div style={{ fontWeight: 900, fontSize: 36, color: "#fff", letterSpacing: 2, marginTop: 16, textShadow: extrude(4, "#000") }}>📷 ESCANEA CON LA CÁMARA</div>
      </div>}
      {desc !== undefined && <div style={{ position: "absolute", left: 1240, bottom: 70, opacity: e(t, desc, desc + 0.3), fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#ffd60a", textShadow: extrude(5, "#5a4500"), transform: `translateX(${8 * Math.sin(t * 6)}px)` }}>O EN LA 1ª LÍNEA DE LA DESCRIPCIÓN ⬇</div>}
    </AbsoluteFill>
  );
};

// suscribirse + campanita
const Subscribe: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = Math.min(1.1, spr(t, a - 0.3, 0.9)), o = e(t, a - 0.3, a - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const click = e(t, a + 0.35, a + 0.5), done = t > a + 0.5, ring = t > a + 1.0 ? Math.sin((t - a) * 22) * 18 * (1 - e(t, a + 1.0, a + 2.2)) : 0;
  const cx = 1180 - 200 * e(t, a - 0.2, a + 0.35), cy = 700 - 120 * e(t, a - 0.2, a + 0.35);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, display: "flex", gap: 26, alignItems: "center", fontFamily: FONT }}>
        <div style={{ padding: "26px 60px", borderRadius: 60, background: done ? "#3a3a3a" : "#e62117", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 3, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>{done ? "SUSCRITO ✓" : "SUSCRIBIRSE"}</div>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "rgba(250,248,242,.96)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, transform: `rotate(${ring}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>🔔</div>
      </div>
      <div style={{ position: "absolute", left: cx, top: cy, fontSize: 80, transform: `scale(${1 - 0.15 * click})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>👆</div>
    </AbsoluteFill>
  );
};

// la pregunta para comentar
const Comment: React.FC<{ t: number; a: number; out: number; q: string; replies: string[] }> = ({ t, a, out, q, replies }) => {
  const k = Math.min(1.1, spr(t, a, 0.8)), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = Math.round(q.length * e(t, a + 0.3, a + 2.6));
  return (
    <div style={{ position: "absolute", left: 360, top: 160, width: 1200, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, fontFamily: FONT }}>
      <div style={{ padding: "34px 44px", borderRadius: 28, background: "rgba(250,248,242,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, color: "#b03a2e", letterSpacing: 3 }}>💬 CUÉNTAMELO EN LOS COMENTARIOS</div>
        <div style={{ fontWeight: 800, fontSize: 50, color: "#1d2733", marginTop: 14, lineHeight: 1.2, minHeight: 124 }}>{q.slice(0, n)}<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
      </div>
      {replies.map((r, i) => { const ai = a + 2.8 + i * 0.6, kk = Math.min(1.1, spr(t, ai)); return <div key={i} style={{ opacity: e(t, ai, ai + 0.12), transform: `translateX(${(1 - Math.min(1, kk)) * 200}px)`, marginTop: 20, marginLeft: 80 + i * 30, display: "inline-flex", padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.9)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontWeight: 800, fontSize: 36, color: "#fff", marginRight: 1000 }}>{r}</div>; })}
    </div>
  );
};

// rótulo anclado a un desagüe del mundo (sigue a la cámara) o a un punto fijo
const DrainTag: React.FC<{ t: number; f: Fx }> = ({ t, f }) => {
  let x = f.x ?? 960, y = f.y ?? 520;
  if (f.dk) { const q = screenOf(t, (f.trap ? DR[f.dk as DK].trap : DR[f.dk as DK].mouth)); x = q.x; y = q.y; if (!q.front) return null; }
  return <Tag t={t} at={f.a} x={x} y={y} dx={f.dx ?? -330} dy={f.dy ?? -200} text={f.text} sub={f.sub} col={f.col ?? COL.amber} out={f.out} size={f.size ?? 50} />;
};

const FX: React.FC<{ t: number; f: Fx }> = ({ t, f }) => {
  switch (f.type) {
    case "title": return <DrainTitle t={t} a={f.a} out={f.out} n={f.n} name={f.name} sub={f.sub} />;
    case "tag": return <DrainTag t={t} f={f} />;
    case "big": return <BigNum t={t} at={f.a} out={f.out} text={f.text} sub={f.sub} size={f.size ?? 120} x={f.x ?? 1400} y={f.y ?? 230} col={f.col ?? "#ffd60a"} edge={f.edge ?? "#5a4500"} />;
    case "stamp": return <Stamp t={t} a={f.a} out={f.out} text={f.text} x={f.x} y={f.y} size={f.size} col={f.col} rot={f.rot} />;
    case "trapdia": return <TrapDia t={t} a={f.a} out={f.out} mode={f.mode} x={f.x} y={f.y} />;
    case "recipe": return <Recipe t={t} a={f.a} out={f.out} steps={f.steps} title={f.title} x={f.x} y={f.y} />;
    case "timer": return <Timer t={t} a={f.a} out={f.out} mins={f.mins} label={f.label} x={f.x} y={f.y} />;
    case "city": return <City t={t} a={f.a} out={f.out} city={f.city} sub={f.sub} />;
    case "rows": return <Rows t={t} out={f.out} items={f.items} y={f.y} />;
    case "chips": return <Chips t={t} out={f.out} items={f.items} y={f.y} red={f.red} />;
    case "quote": return <Quote t={t} a={f.a} out={f.out} text={f.text} col={f.col} y={f.y} size={f.size} />;
    case "receipt": return <Receipt t={t} out={f.out} rows={f.rows} total={f.total} title={f.title} />;
    case "calendar": return <Calendar t={t} out={f.out} items={f.items} />;
    case "guide": return <Guide t={t} a={f.a} out={f.out} open={f.open} qr={f.qr} desc={f.desc} />;
    case "subscribe": return <Subscribe t={t} a={f.a} out={f.out} />;
    case "comment": return <Comment t={t} a={f.a} out={f.out} q={f.q} replies={f.replies} />;
    default: return null;
  }
};

// =====================================================================================================================
export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const wi = winAt(t), bi = beatAt(t);
  // las piezas que tapan todo (guía) apagan el avatar debajo
  if (wi >= 0) {
    L.push(<Avatar key="av" t={t} />);
  } else {
    const prevW = WIN.find((w) => t >= w.me && t < w.me + 0.38);
    const b = B[bi], startedInWin = winAt(b.a) >= 0 || WIN.some((w) => Math.abs(w.me - b.a) < 0.4);
    if (prevW) L.push(<Swipe key="sx" t={t} a={prevW.me} b={prevW.me + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 3 === 0} from={<Avatar t={t} />} to={<Visual i={bi} t={t} />} />);
    else if (bi > 0 && t < b.a + 0.38 && !startedInWin && !(B[bi - 1].v.startsWith("w") && b.v.startsWith("w")))
      L.push(<Swipe key={"sb" + bi} t={t} a={b.a} b={b.a + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 4 === 1} from={<Visual i={bi - 1} t={t} />} to={<Visual i={bi} t={t} />} />);
    else L.push(<Visual key={"v" + bi} i={bi} t={t} />);
    const nextW = WIN.find((w) => t >= w.ms - 0.35 && t < w.ms);
    if (nextW) L.push(<Portal key="pw" x={960} y={540} r={ei(t, nextW.ms - 0.35, nextW.ms)}><Avatar t={t} /></Portal>);
  }
  // sobre el avatar sólo van las piezas marcadas "av" (títulos, ciudad, suscribirse); el resto vive fuera de sus ventanas
  PL.fx.forEach((f, i) => {
    if (t < f.a - 0.5 || t > f.out + 0.6) return;
    if (wi >= 0 && !f.av && f.type !== "guide") return;
    L.push(<FX key={"fx" + i} t={t} f={f} />);
  });
  L.push(<Progress key="pg" t={t} />);
  return <AbsoluteFill style={{ background: "#0b1220" }}><CamaraMano intensidad={wi >= 0 ? 0.35 : 0.7}>{L}</CamaraMano></AbsoluteFill>;
};
