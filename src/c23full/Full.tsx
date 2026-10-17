// c23 FULL · "23 Arreglos de $2" — el video entero (2518 s) con la edición aprobada del minuto 1 (V2.tsx).
// Minuto 1 = SHOTS de v2data (idénticos); del 62,75 s en adelante = plan.json (D:/c23/full/plan/*.txt → plan2json.py).
// Tipos de plano: foto (agnes 2K) · clip (agnes multishot, cae a la foto si no llegó) · stock (Pexels) · av (reel de
// Claudio ya keyeado sobre el taller) · book (el manual abierto sobre el banco, página del arreglo con círculo dorado).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile as SF, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { SHOTS as M1, PTS23 } from "./v2data";
import planJ from "./plan.json";
import haveJ from "./have.json";

const { fontFamily: SANS } = loadFont("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] });
const FPS = 30, W = 1920, H = 1080;
const PRE = "c23full/"; // el port al farm lo cambia por "c23full/"
const sf = (p: string) => SF(PRE + p);
export const FULL_FRAMES = Math.round(2518.45 * FPS);
const GOLD = "#E8B64C", RED = "#E2483D", CREAM = "#F6EFDD";
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const pop = (f: number, t0: number, d = 14) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping: d, stiffness: 160, mass: 0.7 } });

type Out = { type: "zoom" | "pull" | "whip"; d: number; fx?: number; fy?: number; vx?: number; vy?: number };
type S = { id: string; t0: number; t1: number; kb: number[]; keys?: number[][]; out: Out; z?: number;
  img?: string; vid?: string; rate?: number; vStart?: number; av?: boolean; book?: number; m1?: boolean };
type Have = { clips: Record<string, number>; stock: Record<string, number>; m1vid: Record<string, number>; reel: boolean; win: { ms: number; me: number; off: number }[] };
const HAVE = haveJ as unknown as Have;
const P = planJ as unknown as {
  shots: { id: string; t0: number; t1: number; kb: number[]; out: Out; img?: string; vid?: string; stock?: boolean; av?: boolean; book?: number; lamina?: boolean }[];
  notes: { t0: number; t1: number; at: number[]; off: number[]; kicker?: string; big?: string; sub?: string; color?: string | null }[];
  words: { t0: number; t1: number; text: string }[];
  tags: { t0: number; t1: number; at: number[]; text: string; color?: string | null }[];
  money: number[][]; qr: number[][]; heads: { t0: number; t1: number; n: string; title: string }[];
};

// ───────── todos los planos ─────────
const fitRate = (dur: number, span: number) => Math.min(1, Math.max(0.35, (dur - 0.15) / Math.max(0.1, span)));
const ALL: S[] = [
  ...M1.map((s): S => {
    const o: S = { ...s, m1: true };
    if (s.id === "claudio_a" && HAVE.reel) { o.av = true; o.img = undefined; }
    if (s.id === "telefono" && HAVE.reel) o.t1 = 37.18;
    if (s.id === "claudio_b2" && HAVE.reel) { o.av = true; o.img = undefined; o.t0 = 37.18; }
    return o;
  }),
  ...P.shots.map((p): S => {
    const s: S = { id: p.id, t0: p.t0, t1: p.t1, kb: p.kb, out: p.out };
    const span = p.t1 - p.t0 + 0.8;
    if (p.av) s.av = true;
    else if (p.book) s.book = p.book;
    else if (p.stock) { const d = HAVE.stock[p.vid!]; if (d) { s.vid = `c23/stock/${p.vid}.mp4`; s.vStart = d > span + 1.2 ? 1 : 0; s.rate = fitRate(d - s.vStart, span); } }
    else {
      s.img = `c23/img/${p.img}.jpg`;
      const d = p.vid ? HAVE.clips[p.vid] : 0;
      if (d) { s.vid = `c23/clips/${p.vid}.mp4`; s.rate = fitRate(d, span); }
    }
    return s;
  }),
];
const LAM = new Set(P.shots.filter((p) => p.img === "lam_a").map((p) => p.id));
const shotAt = (t: number) => { let lo = 0, hi = ALL.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ALL[m].t0 <= t) lo = m; else hi = m - 1; } return lo; };

// ───────── cámara (igual que V2) ─────────
type X = { z: number; fx: number; fy: number; dx: number; dy: number; op: number; bx: number; by: number };
function xform(i: number, t: number): X | null {
  const s = ALL[i], prev = ALL[i - 1], next = ALL[i + 1];
  const dIn = prev ? prev.out.d : 0, dOut = next ? s.out.d : 0;
  if (t < s.t0 - dIn / 2 - 0.02 || t > s.t1 + dOut / 2 + 0.02) return null;
  let z: number, fx: number, fy: number;
  if (s.keys) {
    const K = s.keys; let j = 0;
    while (j < K.length - 2 && t > K[j + 1][0]) j++;
    const a = K[j], b = K[j + 1], q = ease(k01(t, a[0], b[0]));
    z = Math.exp(lerp(Math.log(a[1]), Math.log(b[1]), q)); fx = lerp(a[2], b[2], q); fy = lerp(a[3], b[3], q);
  } else {
    const k = ease(k01(t, s.t0, s.t1));
    z = Math.exp(lerp(Math.log(s.kb[0]), Math.log(s.kb[3]), k)); fx = lerp(s.kb[1], s.kb[4], k); fy = lerp(s.kb[2], s.kb[5], k);
  }
  let dx = 0, dy = 0, op = 1, bx = 0, by = 0;
  if (next && t > s.t1 - dOut / 2) {
    const e = k01(t, s.t1 - dOut / 2, s.t1 + dOut / 2), o = s.out;
    if (o.type === "zoom") {
      const m = 1 + 3.2 * Math.pow(e, 2.4);
      fx = lerp(fx, o.fx ?? fx, ease(Math.min(1, e * 1.6))); fy = lerp(fy, o.fy ?? fy, ease(Math.min(1, e * 1.6)));
      z *= m; const b = 22 * Math.pow(e, 1.5); bx = b; by = b; op = 1 - k01(e, 0.45, 0.85);
    } else if (o.type === "pull") {
      z *= 1 - 0.18 * Math.pow(e, 2); const b = 14 * e * e; bx = b; by = b; op = 1 - k01(e, 0.4, 0.8);
    } else {
      const p = Math.pow(e, 2.2); dx = -(o.vx ?? 0) * W * 1.1 * p; dy = -(o.vy ?? 0) * H * 1.1 * p;
      bx = Math.abs(o.vx ?? 0) * 60 * Math.sin(Math.PI * e); by = Math.abs(o.vy ?? 0) * 60 * Math.sin(Math.PI * e);
    }
  }
  if (prev && t < s.t0 + dIn / 2) {
    const e = k01(t, s.t0 - dIn / 2, s.t0 + dIn / 2), o = prev.out;
    if (o.type === "zoom") { z *= 1 + 0.5 * Math.pow(1 - e, 2); const b = 18 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); }
    else if (o.type === "pull") { z *= 1 + 0.9 * Math.pow(1 - e, 2.2); const b = 16 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); op = k01(e, 0.05, 0.5); }
    else { const p = Math.pow(1 - e, 2.2); dx += (o.vx ?? 0) * W * 1.1 * p; dy += (o.vy ?? 0) * H * 1.1 * p; bx = Math.max(bx, Math.abs(o.vx ?? 0) * 60 * Math.sin(Math.PI * e)); by = Math.max(by, Math.abs(o.vy ?? 0) * 60 * Math.sin(Math.PI * e)); }
  }
  z = Math.max(1, z);
  const hx = 0.5 / z, hy = 0.5 / z;
  fx = Math.min(1 - hx, Math.max(hx, fx)); fy = Math.min(1 - hy, Math.max(hy, fy));
  return { z, fx, fy, dx, dy, op, bx, by };
}
const proj = (x: X, ix: number, iy: number): [number, number] => [W / 2 + (ix - x.fx) * W * x.z + x.dx, H / 2 + (iy - x.fy) * H * x.z + x.dy];

// ───────── contenido de cada plano ─────────
const cover: React.CSSProperties = { width: W, height: H, objectFit: "cover" };
const AvVideo: React.FC<{ s: S; i: number }> = ({ s, i }) => {
  const seq = s.t0 - (ALL[i - 1]?.out.d ?? 0) / 2 - 0.05;
  const w = HAVE.win.find((w) => s.t0 >= w.ms - 0.4 && s.t0 <= w.me) ?? HAVE.win.reduce((a, b) => (Math.abs(b.ms - s.t0) < Math.abs(a.ms - s.t0) ? b : a));
  const wi = String(HAVE.win.indexOf(w)).padStart(2, "0");  // un mp4 corto por ventana (el reel entero no carga)
  const start = Math.max(0, Math.round((seq - w.ms) * FPS));
  return (
    <Sequence from={Math.round(seq * FPS)} layout="none">
      <OffthreadVideo src={sf(`c23/av/w${wi}.mp4`)} startFrom={start} muted style={cover} />
    </Sequence>
  );
};
const ShotLayer: React.FC<{ i: number; t: number; f: number }> = ({ i, t, f }) => {
  const s = ALL[i], x = xform(i, t);
  if (!x) return null;
  const id = `b${i}`;
  const seq = Math.round((s.t0 - (ALL[i - 1]?.out.d ?? 0) / 2 - 0.05) * FPS);
  let body: React.ReactNode;
  if (s.av) body = HAVE.reel ? <AvVideo s={s} i={i} /> : <Img src={sf("v2/claudio_b2.jpg")} style={cover} />;
  else if (s.book) body = <><Img src={sf("v2/banco.jpg")} style={cover} /><BookPage t={t} s={s} /></>;
  else if (s.vid) body = (
    <Sequence from={seq} layout="none">
      <OffthreadVideo src={sf(s.m1 ? `v2/${s.vid}.mp4` : s.vid)} startFrom={Math.round((s.vStart ?? 0) * FPS)} playbackRate={s.rate ?? 1} muted style={cover} />
    </Sequence>
  );
  else body = <Img src={sf(s.m1 ? `v2/${s.img}.jpg` : s.img!)} style={cover} />;
  return (
    <AbsoluteFill style={{ opacity: x.op, zIndex: s.z ?? i }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${x.bx.toFixed(2)} ${x.by.toFixed(2)}`} /></filter></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", filter: x.bx + x.by > 0.4 ? `url(#${id})` : undefined,
        transform: `translate(${W / 2 + x.dx}px,${H / 2 + x.dy}px) scale(${x.z}) translate(${-x.fx * W}px,${-x.fy * H}px)` }}>
        {body}
        {s.id === "banco1" && <Book t={t} mode="open" />}
        {s.id === "banco2" && <Book t={t} mode="p32" />}
        {LAM.has(s.id) && <Lamina t={t} />}
      </div>
    </AbsoluteFill>
  );
};

// ───────── el manual sobre el banco ─────────
const BW = 450, BH = 780;
const FL = ["p010", "p014", "p022", "p035", "p037", "p048"], FT = [50.0, 50.5, 51.0, 51.5, 52.0];
const pgImg = (src: string) => <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#F6EFDF", display: "block" }} />;
const sheet: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: BW, height: BH, background: "#F6EFDF", backfaceVisibility: "hidden" };
const Book: React.FC<{ t: number; mode: "open" | "p32" }> = ({ t, mode }) => {
  const pg = (n: string) => pgImg(`v2/pages/${n}.jpg`);
  const open = mode === "p32" ? 1 : ease(k01(t, 49.3, 49.95));
  const fk = FT.map((a) => ease(k01(t, a, a + 0.42)));
  const done = mode === "p32" ? 0 : fk.filter((k) => k >= 1).length;
  const leftSrc = mode === "p32" ? "p022" : done > 0 ? FL[done - 1] : "p011";
  const rightSrc = mode === "p32" ? "p034" : FL[Math.min(FL.length - 1, done + (fk[done] > 0 ? 1 : 0))];
  const shine = interpolate(t, [47.2, 48.4], [-40, 140], clamp);
  const L = 960 - BW * (1.5 - 0.5 * open);
  return (
    <div style={{ position: "absolute", left: L, top: 540 - BH / 2, width: BW * 2, height: BH, perspective: 2600, perspectiveOrigin: `${BW}px 50%` }}>
      <div style={{ position: "absolute", left: BW * (1 - open), top: 18, width: BW * (1 + open), height: BH, background: "rgba(0,0,0,.55)", filter: "blur(22px)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: BW, top: 0, width: BW, height: BH, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: 4, top: 6, width: BW, height: BH, background: "repeating-linear-gradient(90deg,#e9dfc8 0 2px,#d6c9ad 2px 3px)", borderRadius: "0 6px 6px 0" }} />
        <div style={{ ...sheet, boxShadow: "inset 18px 0 26px -10px rgba(0,0,0,.35)" }}>{pg(rightSrc)}</div>
        {done < FT.length && mode === "open" && fk[done] > 0 && (
          <div style={{ ...sheet, transformOrigin: "0 50%", transform: `rotateY(${-180 * fk[done]}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ ...sheet }}>{pg(FL[done])}</div>
            <div style={{ ...sheet, transform: "rotateY(180deg)" }}>{pg(FL[done])}</div>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, transformOrigin: "0 50%", transform: `rotateY(${-180 * open}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "3px 8px 8px 3px", overflow: "hidden", boxShadow: "inset 6px 0 10px rgba(0,0,0,.35)" }}>
            <Img src={sf("v2/cover76.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${shine - 12}%, rgba(255,255,255,.38) ${shine}%, transparent ${shine + 12}%)` }} />
          </div>
          <div style={{ ...sheet, transform: "rotateY(180deg)", boxShadow: "inset -18px 0 26px -10px rgba(0,0,0,.35)" }}>{pg(leftSrc)}</div>
        </div>
      </div>
      {mode === "p32" && <PageCircle a={k01(t, 60.3, 60.9)} b={k01(t, 60.75, 61.3)} />}
    </div>
  );
};
const PageCircle: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const L = 1500;
  return (
    <svg width={BW * 2} height={BH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M ${BW + 30} 150 C ${BW + 120} 95, ${BW + 420} 92, ${BW + 440} 140 C ${BW + 455} 185, ${BW + 140} 200, ${BW + 40} 178 C ${BW + 10} 170, ${BW + 20} 140, ${BW + 70} 118`} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - a)} />
      <ellipse cx={BW + BW / 2} cy={BH - 52} rx={40} ry={26} fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray={300} strokeDashoffset={300 * (1 - b)} />
    </svg>
  );
};
// página del arreglo N: el manual abierto, la hoja nueva cae sobre la derecha y se marca el título
const BookPage: React.FC<{ t: number; s: S }> = ({ t, s }) => {
  const n = s.book!, nn = String(n).padStart(2, "0"), pp = String(Math.max(1, n - 1)).padStart(2, "0");
  const flip = ease(k01(t, s.t0 + 0.05, s.t0 + 0.5));
  return (
    <div style={{ position: "absolute", left: 960 - BW, top: 540 - BH / 2, width: BW * 2, height: BH, perspective: 2600, perspectiveOrigin: `${BW}px 50%` }}>
      <div style={{ position: "absolute", left: 0, top: 18, width: BW * 2, height: BH, background: "rgba(0,0,0,.55)", filter: "blur(22px)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, boxShadow: "inset -18px 0 26px -10px rgba(0,0,0,.35)", overflow: "hidden" }}>{pgImg(n === 1 ? "v2/pages/p011.jpg" : `c23/pages/a${pp}.jpg`)}</div>
      <div style={{ position: "absolute", left: BW, top: 0, width: BW, height: BH, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: 4, top: 6, width: BW, height: BH, background: "repeating-linear-gradient(90deg,#e9dfc8 0 2px,#d6c9ad 2px 3px)", borderRadius: "0 6px 6px 0" }} />
        <div style={{ ...sheet, boxShadow: "inset 18px 0 26px -10px rgba(0,0,0,.35)" }}>{pgImg(`c23/pages/a${nn}.jpg`)}</div>
        {flip < 1 && (
          <div style={{ ...sheet, transformOrigin: "0 50%", transform: `rotateY(${-180 * flip}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ ...sheet }}>{pgImg(n === 1 ? "v2/pages/p011.jpg" : `c23/pages/a${pp}.jpg`)}</div>
            <div style={{ ...sheet, transform: "rotateY(180deg)" }}>{pgImg(`c23/pages/a${nn}.jpg`)}</div>
          </div>
        )}
      </div>
      <PageCircle a={k01(t, s.t0 + 0.55, s.t0 + 1.1)} b={k01(t, s.t0 + 0.9, s.t0 + 1.35)} />
    </div>
  );
};

// ───────── la lámina del arreglo 12 (la ilustración es de agnes; el texto, nuestro) ─────────
// coordenadas en px de la imagen 1920x1080 (dentro del plano, se mueven con la cámara)
const LAMX = { title: [1060, 140], steps: [1060, 360], ribbon: [1060, 950], holes: [[470, 735], [560, 965], [640, 790]], band: [470, 540] };
const Lamina: React.FC<{ t: number }> = ({ t }) => {
  const a = (t0: number) => interpolate(t, [t0, t0 + 0.35], [0, 1], clamp);
  const ink = "#2b2419";
  const lab = (x: number, y: number, t0: number, txt: string, c = RED) => (
    <div style={{ position: "absolute", left: x, top: y, opacity: a(t0), transform: `translateY(${(1 - a(t0)) * 8}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: c, background: "rgba(246,239,221,.92)", padding: "4px 12px", borderRadius: 6, border: `2px solid ${c}`, whiteSpace: "nowrap" }}>{txt}</div>
  );
  const STEPS = [["1", "Marca la línea de agujeros", 1303.3], ["2", "Perfora en ángulo", 1310.2], ["3", "Inyecta la crema", 1321.4], ["4", "Tapa y espera semanas", 1327.6]] as const;
  return (
    <>
      <div style={{ position: "absolute", left: LAMX.title[0], top: LAMX.title[1] - 50, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: "#8a7a5c", opacity: a(1292.8) }}>MÓDULO III · EL CONSTRUCTOR LIBRE</div>
      <div style={{ position: "absolute", left: LAMX.title[0], top: LAMX.title[1], width: 780, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 64, lineHeight: 1.05, color: ink, opacity: a(1293.0) }}>Cortar la humedad que sube por la pared</div>
      {STEPS.map(([n, txt, t0], k) => (
        <div key={n} style={{ position: "absolute", left: LAMX.steps[0], top: LAMX.steps[1] + k * 120, display: "flex", alignItems: "center", gap: 22, opacity: a(t0), transform: `translateX(${(1 - a(t0)) * 20}px)` }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: n === "4" ? RED : GOLD, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: ink }}>{txt}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: LAMX.ribbon[0], top: LAMX.ribbon[1] - 60, padding: "10px 26px", background: ink, color: GOLD, fontFamily: SANS, fontWeight: 800, fontSize: 36, borderRadius: 6, opacity: a(1330.0) }}>Varios metros por menos de US$5</div>
      <div style={{ position: "absolute", right: 60, bottom: 40, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: "#8a7a5c", opacity: a(1292.8) }}>35</div>
      {lab(LAMX.holes[0][0], LAMX.holes[0][1], 1303.6, "cada 10-12 cm")}
      {lab(LAMX.holes[1][0], LAMX.holes[1][1], 1310.5, "ángulo levemente hacia abajo")}
      {lab(LAMX.holes[2][0], LAMX.holes[2][1], 1315.8, "2/3 del espesor")}
      {lab(LAMX.band[0], LAMX.band[1], 1328.0, "barrera hidrofugante", "#a87a14")}
    </>
  );
};

// ───────── gráficos ─────────
const Note: React.FC<{ t: number; f: number; n: (typeof P.notes)[number]; si: number }> = ({ t, f, n, si }) => {
  if (t < n.t0 - 0.02 || t > n.t1 + 0.02) return null;
  const x = xform(si, t); if (!x) return null;
  const color = n.color || "#fff";
  const [px, py] = proj(x, n.at[0], n.at[1]);
  const align = n.off[0] < 0 ? "right" : "left";
  // el número grande se achica si es largo y la nota nunca se sale de cuadro
  const bigSize = n.big ? Math.max(54, Math.min(92, 92 * 8 / Math.max(8, n.big.length))) : 0;
  const wEst = Math.max((n.kicker?.length ?? 0) * 18, (n.big?.length ?? 0) * bigSize * 0.62, (n.sub?.length ?? 0) * 17) + 40;
  let lx = px + n.off[0], ly = py + n.off[1];
  if (align === "left") lx = Math.min(lx, W - 70 - wEst); else lx = Math.max(lx, 70 + wEst);
  ly = Math.min(H - 150, Math.max(150, ly));
  const a = pop(f, n.t0) * interpolate(t, [n.t1 - 0.25, n.t1], [1, 0], clamp) * x.op;
  const line = k01(t, n.t0, n.t0 + 0.35);
  const ex = lerp(px, lx, ease(line)), ey = lerp(py, ly, ease(line));
  // sobre Claudio: sin punto ni línea, texto limpio a su derecha
  const onAv = !!ALL[si].av;
  if (onAv) { lx = 1230; ly = 400; }
  const noLine = onAv || Math.abs(n.off[0]) + Math.abs(n.off[1]) < 1;
  return (
    <>
      {!noLine && (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: a, overflow: "visible" }}>
          <circle cx={px} cy={py} r={10 + 6 * (1 - line)} fill="none" stroke={color} strokeWidth={2.5} />
          <circle cx={px} cy={py} r={3.5} fill={color} />
          <line x1={px} y1={py} x2={ex} y2={ey} stroke={color} strokeWidth={2} />
        </svg>
      )}
      <div style={{ position: "absolute", left: lx, top: ly, transform: onAv ? "translate(0,-50%)" : noLine ? "translate(-50%,-50%)" : `translate(${align === "left" ? "14px" : "calc(-100% - 14px)"},-50%)`, opacity: a * k01(t, n.t0 + 0.2, n.t0 + 0.45), textAlign: onAv ? "left" : noLine ? "center" : align, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,.75), 0 1px 3px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>
        {n.kicker && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, opacity: 0.92 }}>{n.kicker}</div>}
        {n.big && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: bigSize, lineHeight: 1, letterSpacing: -1, color, margin: "2px 0" }}>{n.big}</div>}
        {n.sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 36 }}>{n.sub}</div>}
      </div>
    </>
  );
};
const Word: React.FC<{ t: number; t0: number; t1: number; text: string }> = ({ t, t0, t1, text }) => {
  if (t < t0 || t > t1) return null;
  const a = interpolate(t, [t0, t0 + 0.12, t1 - 0.1, t1], [0, 1, 1, 0], clamp);
  const end = /[?¿!¡]$/.test(text);
  return <div style={{ position: "absolute", left: 120, top: 900, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: 2, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.8)" }}>{text}{!end && <span style={{ color: GOLD }}>.</span>}</div>;
};
const Label: React.FC<{ t: number; f: number; g: (typeof P.tags)[number]; si: number }> = ({ t, f, g, si }) => {
  if (t < g.t0 || t > g.t1 + 0.02) return null;
  const x = xform(si, t); if (!x) return null;
  const [px, py] = proj(x, g.at[0], g.at[1]);
  const c = g.color || GOLD;
  const s = pop(f, g.t0, 12) * x.op * interpolate(t, [g.t1 - 0.2, g.t1], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) scale(${s})`, display: "flex", alignItems: "center", gap: 12, padding: "8px 20px 10px 14px", borderRadius: 40, background: "rgba(14,12,10,.62)", backdropFilter: "blur(8px)", border: `1.5px solid ${c}`, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 34, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,.4)" }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />{g.text}
    </div>
  );
};
const Head: React.FC<{ t: number; h: (typeof P.heads)[number] }> = ({ t, h }) => {
  if (t < h.t0 || t > h.t1) return null;
  const a = interpolate(t, [h.t0, h.t0 + 0.35, h.t1 - 0.35, h.t1], [0, 1, 1, 0], clamp);
  const ln = ease(k01(t, h.t0 + 0.1, h.t0 + 0.8));
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, opacity: a, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.85)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: GOLD, letterSpacing: 3 }}>ARREGLO {h.n}<span style={{ opacity: 0.6 }}> / 23</span></span>
        <span style={{ height: 2, width: 220 * ln, background: GOLD }} />
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: -1, maxWidth: 1400, transform: `translateX(${(1 - a) * -20}px)` }}>{h.title}</div>
    </div>
  );
};

// ───────── minuto 1 (idéntico a V2) ─────────
const Tag: React.FC<{ t: number; f: number; at: [number, number]; t0: number; text: string; color?: string }> = ({ t, f, at, t0, text, color = GOLD }) => {
  if (t < t0 || t > 20.15) return null;
  const i = ALL.findIndex((s) => s.id === "baratos"); const x = xform(i, t); if (!x) return null;
  const [px, py] = proj(x, at[0], at[1]);
  const s = pop(f, t0, 11) * x.op;
  return (
    <div style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-120%) scale(${s}) rotate(-4deg)`, fontFamily: SANS, fontWeight: 800, fontSize: 76, color: "#1a140c", background: color, padding: "2px 22px 6px", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
      {text}<div style={{ position: "absolute", left: "50%", bottom: -14, width: 2, height: 16, background: color }} />
    </div>
  );
};
const NoteM1: React.FC<{ t: number; f: number; shot: string; at: [number, number]; off: [number, number]; t0: number; t1: number; kicker?: string; big?: string; sub?: string; color?: string }> = (p) => {
  const si = ALL.findIndex((s) => s.id === p.shot);
  return <Note t={p.t} f={p.f} si={si} n={{ t0: p.t0, t1: p.t1, at: p.at, off: p.off, kicker: p.kicker, big: p.big, sub: p.sub, color: p.color }} />;
};
const Pins23: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < 20.6 || t > 27.7) return null;
  const i = ALL.findIndex((s) => s.id === "casa"); const x = xform(i, t); if (!x) return null;
  const sweep = interpolate(t, [22.8, 25.4], [0, 23], clamp);
  return (
    <>
      {PTS23.map(([ix, iy], n) => {
        const t0 = 20.68 + n * 0.06; if (t < t0) return null;
        const [px, py] = proj(x, ix, iy);
        const on = Math.max(0, 1 - Math.abs(sweep - (n + 1)) / 1.6);
        const s = pop(f, t0, 12) * x.op * interpolate(t, [27.3, 27.7], [1, 0], clamp);
        return <div key={n} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) scale(${s * (1 + 0.25 * on)})`, width: 44, height: 44, borderRadius: "50%", border: `2.5px solid ${on > 0.05 ? GOLD : "#fff"}`, background: on > 0.05 ? `rgba(232,182,76,${0.35 + 0.5 * on})` : "rgba(0,0,0,.35)", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,.5)" }}>{n + 1}</div>;
      })}
    </>
  );
};
const Title23: React.FC<{ t: number }> = ({ t }) => {
  if (t < 20.6 || t > 22.9) return null;
  const a = interpolate(t, [20.6, 20.85, 22.6, 22.9], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: a, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,.7)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 120, letterSpacing: -2, lineHeight: 1 }}><span style={{ color: GOLD }}>23</span> arreglos</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, marginTop: 6 }}>uno por uno, de toda la casa</div>
    </div>
  );
};
const Source: React.FC<{ t: number; t0: number; t1: number; n: string; text: string }> = ({ t, t0, t1, n, text }) => {
  if (t < t0 || t > t1) return null;
  const a = interpolate(t, [t0, t0 + 0.2, t1 - 0.2, t1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, opacity: a, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.85)" }}>
      <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, color: GOLD, letterSpacing: 3 }}>{n}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, letterSpacing: -1, transform: `translateX(${(1 - a) * -20}px)` }}>{text}</div>
    </div>
  );
};
const Credit: React.FC<{ t: number; t0: number; t1: number; text: string; sub: string }> = ({ t, t0, t1, text, sub }) => {
  if (t < t0 || t > t1) return null;
  const a = interpolate(t, [t0, t0 + 0.3, t1 - 0.3, t1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", right: 110, bottom: 120, opacity: a, textAlign: "right", color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,.85)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46 }}>{text}</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: GOLD }}>{sub}</div>
    </div>
  );
};

// ───────── contador de ahorro ─────────
const MONEY = P.money.map(([t, v]) => [t, v]).sort((a, b) => a[0] - b[0]);
const CUM = MONEY.reduce<number[]>((acc, [, v]) => [...acc, (acc[acc.length - 1] ?? 0) + v], []);
const TOTAL = CUM[CUM.length - 1] ?? 0;
const fmt = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const REVEAL = [2407.65, 2418.33];
const Saver: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  // minuto 1: 0 → giro → ?.???
  if (t >= 27.7 && t < 44.8) {
    const a = interpolate(t, [27.7, 28.2, 44.3, 44.8], [0, 1, 1, 0], clamp);
    const spin = t > 32.75 && t < 35.4, myst = t >= 35.4;
    const hl = interpolate(t, [28.2, 28.6, 30.0], [0, 1, 0], clamp);
    const v = spin ? fmt(1000 + ((f * 7919) % 8999)) : myst ? "?.???" : "0";
    return <SaverBox a={a} hl={hl} v={v} blur={spin} />;
  }
  if (t >= REVEAL[0] - 0.4) return null;
  const k = MONEY.findIndex(([m]) => t >= m - 0.25 && t <= m + 4.2);
  if (k < 0) return null;
  const m = MONEY[k][0];
  const a = interpolate(t, [m - 0.25, m + 0.1, m + 3.8, m + 4.2], [0, 1, 1, 0], clamp);
  const from = k ? CUM[k - 1] : 0, to = CUM[k];
  const v = lerp(from, to, ease(k01(t, m + 0.15, m + 1.25)));
  const hl = interpolate(t, [m + 1.1, m + 1.4, m + 2.4], [0, 1, 0], clamp);
  return <SaverBox a={a} hl={hl} v={fmt(v)} plus={`+${MONEY[k][1]}`} pa={k01(t, m + 0.1, m + 0.4) * interpolate(t, [m + 2.6, m + 3.2], [1, 0], clamp)} />;
};
const SaverBox: React.FC<{ a: number; hl: number; v: string; blur?: boolean; plus?: string; pa?: number }> = ({ a, hl, v, blur, plus, pa = 0 }) => (
  <div style={{ position: "absolute", left: "50%", top: 54, transform: `translate(-50%, ${(1 - a) * -30}px)`, opacity: a, display: "flex", alignItems: "baseline", gap: 18, padding: "10px 26px", borderRadius: 14, background: "rgba(14,12,10,.55)", backdropFilter: "blur(10px)", border: `1.5px solid rgba(232,182,76,${0.35 + 0.65 * hl})`, boxShadow: `0 10px 30px rgba(0,0,0,.35), 0 0 ${30 * hl}px rgba(232,182,76,.6)` }}>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: "#efe6d4" }}>TE AHORRASTE</span>
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 52, color: GOLD, minWidth: 260, textAlign: "right", filter: blur ? "blur(1.2px)" : undefined }}>US$ {v}</span>
    {plus && <span style={{ position: "absolute", right: -110, top: 14, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#9FD9A0", opacity: pa, transform: `translateY(${(1 - pa) * 10}px)` }}>{plus}</span>}
  </div>
);
// "Ahora mira el número de arriba" → el total grande
const Reveal: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < REVEAL[0] - 0.1 || t > REVEAL[1]) return null;
  const a = interpolate(t, [REVEAL[0], REVEAL[0] + 0.4, REVEAL[1] - 0.4, REVEAL[1]], [0, 1, 1, 0], clamp);
  const v = TOTAL * ease(k01(t, REVEAL[0] + 0.3, REVEAL[0] + 2.4));
  const s = pop(f, REVEAL[0], 13);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: a }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,6,.45)" }} />
      <div style={{ transform: `scale(${0.85 + 0.15 * s})`, textAlign: "center", color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,.7)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: "#efe6d4" }}>TE AHORRASTE</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 200, color: GOLD, lineHeight: 1.05 }}>US$ {fmt(v)}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 50, opacity: k01(t, 2410.5, 2411.0) }}>en 23 arreglos, sin llamar a nadie</div>
      </div>
    </AbsoluteFill>
  );
};
// QR flotando al lado de Claudio
const QrFloat: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const w = P.qr.find(([a, b]) => t >= a - 0.1 && t <= b + 0.4);
  if (!w) return null;
  const s = pop(f, w[0], 13) * interpolate(t, [w[1], w[1] + 0.4], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", right: 110, top: 540, transform: `translateY(-50%) translateX(${(1 - s) * 80}px) scale(${0.9 + 0.1 * s})`, opacity: s, width: 620, padding: 28, borderRadius: 30, background: CREAM, boxShadow: "0 30px 70px rgba(0,0,0,.5)", display: "flex", gap: 26, alignItems: "center" }}>
      <Img src={sf("portada-coleccion.jpg")} style={{ width: 190, borderRadius: 8, boxShadow: "0 10px 24px rgba(0,0,0,.35)" }} />
      <div style={{ flex: 1, textAlign: "center" }}>
        <Img src={sf("c23/qr.png")} style={{ width: 300, height: 300, display: "block", margin: "0 auto" }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#2b2419", marginTop: 10 }}>Escanea con tu celular</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: "#8a6a1c" }}>o el primer enlace de la descripción</div>
      </div>
    </div>
  );
};

const NOTE_SHOT = P.notes.map((n) => shotAt(n.t0 + 0.01));
const TAG_SHOT = P.tags.map((g) => shotAt(g.t0 + 0.01));

export const Full: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const c = shotAt(t), lo = Math.max(0, c - 2), hi = Math.min(ALL.length - 1, c + 2);
  const idx: number[] = []; for (let i = lo; i <= hi; i++) idx.push(i);
  return (
    <AbsoluteFill style={{ background: "#0d0b09", overflow: "hidden" }}>
      {idx.map((i) => <ShotLayer key={ALL[i].id} i={i} t={t} f={f} />)}
      <AbsoluteFill style={{ zIndex: 1000 }}>
        {t < 63 && (
          <>
            <NoteM1 t={t} f={f} shot="gota" at={[0.52, 0.3]} off={[230, -40]} t0={2.0} t1={5.0} kicker="ALBAÑIL" big="US$100" sub="sólo por mirar" />
            <NoteM1 t={t} f={f} shot="cano" at={[0.54, 0.55]} off={[-260, -150]} t0={6.45} t1={8.95} kicker="PLOMERO" big="US$70" sub="sólo por venir" />
            <Word t={t} t0={9.05} t1={10.1} text="Hormigas" />
            <Word t={t} t0={10.12} t1={10.6} text="Moho" />
            <Word t={t} t0={10.6} t1={11.38} text="Óxido" />
            <Word t={t} t0={11.4} t1={13.4} text="Una grieta" />
            <NoteM1 t={t} f={f} shot="grieta" at={[0.24, 0.41]} off={[170, -120]} t0={11.6} t1={13.4} kicker="VUELVE A ABRIRSE" />
            <NoteM1 t={t} f={f} shot="grieta" at={[0.8, 0.55]} off={[-120, 230]} t0={12.6} t1={13.4} sub="cada invierno" color="#bfe3ff" />
            <Tag t={t} f={f} at={[0.25, 0.27]} t0={16.2} text="$2" />
            <Tag t={t} f={f} at={[0.48, 0.2]} t0={17.56} text="$1" />
            <Tag t={t} f={f} at={[0.78, 0.6]} t0={18.7} text="$0" color="#9FD9A0" />
            <Pins23 t={t} f={f} />
            <Title23 t={t} />
            <NoteM1 t={t} f={f} shot="casa" at={[0.45, 0.24]} off={[60, -170]} t0={25.9} t1={26.75} kicker="DESDE EL TECHO" />
            <NoteM1 t={t} f={f} shot="casa" at={[0.83, 0.6]} off={[-60, -230]} t0={26.82} t1={27.6} kicker="HASTA EL GARAJE" />
            <NoteM1 t={t} f={f} shot="telefono" at={[0.5, 0.6]} off={[260, -160]} t0={31.36} t1={32.6} kicker="NO LLAMAS A NADIE" color={RED} />
            <Credit t={t} t0={41.2} t1={44.4} text="No son inventados." sub="salen todos del manual" />
            <Source t={t} t0={53.0} t1={55.45} n="01 · LA CALLE" text="Albañiles viejos" />
            <Source t={t} t0={55.55} t1={57.25} n="02 · EL OFICIO" text="Plomeros de toda la vida" />
            <Source t={t} t0={57.3} t1={58.2} n="03 · LA PRÁCTICA" text="Mi propio taller" />
            <NoteM1 t={t} f={f} shot="banco2" at={[0.62, 0.86]} off={[240, 10]} t0={60.8} t1={62.73} kicker="PÁGINA 32" sub="la gotera del techo" color={GOLD} />
          </>
        )}
        {P.notes.map((n, k) => (t >= n.t0 - 0.05 && t <= n.t1 + 0.05 ? <Note key={k} t={t} f={f} n={n} si={NOTE_SHOT[k]} /> : null))}
        {P.tags.map((g, k) => (t >= g.t0 - 0.05 && t <= g.t1 + 0.05 ? <Label key={k} t={t} f={f} g={g} si={TAG_SHOT[k]} /> : null))}
        {P.words.map((w, k) => <Word key={k} t={t} t0={w.t0} t1={w.t1} text={w.text} />)}
        {P.heads.map((h, k) => <Head key={k} t={t} h={h} />)}
        <Saver t={t} f={f} />
        <Reveal t={t} f={f} />
        <QrFloat t={t} f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
