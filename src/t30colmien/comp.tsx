// t30colmien — "A Lion Pride Tried to Take Down a Hippo — Here's Why It Never Works" (Law of the Fang). Estilo doc-ilustrado-btg.
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble/DiagSplit siguen el patrón de src/btgm1/M1.tsx
// (allá no se exportan: acá van copiados, sin tocar btgm1). Ilustrado = SVG/CSS + recortes rembg de fotos reales pintados en silueta.
// Real = video y fotos de Wikimedia Commons (PD/CC, crédito en pantalla). Pieza ancla: el MARCADOR DE COMBATE que se llena arma por arma.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, Person, SunsetStage, Stamp, ease } from "../kits/btg/kit";
import CUTS from "./cuts.json";

const { fontFamily: F } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
export const INK = "#f0ebe5", RED = "#f14536", ORA = "#edb269", GOLD = "#e9c762", CYAN = "#4fe3ff", GLOW = "#9dff7a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const sf = (p: string) => staticFile(p);
const HAND = "'Segoe Print','Comic Sans MS','Bradley Hand',cursive";

// ───────────────────────── texto (firma del estilo) ─────────────────────────
export const Build: React.FC<{ a?: number; lines: string[]; out?: number; y?: number; size?: number; color?: string }> = ({ a = 6, lines, out, y = 120, size = 96, color = RED }) => {
  const f = useCurrentFrame();
  const o = out ? ease(f, out, out + 9, 1, 0) : 1;
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: F, opacity: o, filter: `blur(${(1 - o) * 10}px)` }}>
      {lines.map((l, li) => (
        <div key={li} style={{ fontSize: li && l.startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 4px 18px rgba(0,0,0,.6)" }}>
          {l.split(" ").map((w, i) => {
            const t = ease(f, a + k * 15, a + k++ * 15 + 6);
            const key = w.startsWith("*");
            return <span key={i} style={{ display: "inline-block", marginRight: size * 0.25, opacity: t, transform: `translateY(${(1 - t) * 10}px)`, color: key ? color : undefined, fontWeight: key ? 900 : 800 }}>{w.replace(/\*/g, "")}</span>;
          })}
        </div>
      ))}
    </div>
  );
};
export const BigWord: React.FC<{ a: number; w: string; color?: string; size?: number; x?: number; y?: number }> = ({ a, w, color = RED, size = 240, x, y = 380 }) => {
  const f = useCurrentFrame();
  const t = ease(f, a, a + 7);
  return <div style={{ position: "absolute", left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, textAlign: x === undefined ? "center" : "left", fontFamily: F, fontWeight: 900, fontSize: size, lineHeight: 1, color, opacity: t, transform: `scale(${1.15 - 0.15 * t})`, textShadow: `0 0 40px ${color}55, 0 8px 30px rgba(0,0,0,.6)` }}>{w}</div>;
};
export const Label: React.FC<{ a?: number; t: string }> = ({ a = 4, t }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 8);
  return (
    <div style={{ position: "absolute", left: 96, top: 76, fontFamily: F, fontWeight: 700, fontSize: 54, color: "rgba(240,235,229,.92)", opacity: o, transform: `translateX(${(1 - o) * -20}px)`, textShadow: "0 2px 10px rgba(0,0,0,.7)" }}>
      {t}<div style={{ height: 3, width: 150 * o, background: "rgba(240,235,229,.8)", marginTop: 6 }} />
    </div>
  );
};
export const Scribble: React.FC<{ a: number; cx: number; cy: number; rx: number; ry: number; text: string; tx: number; ty: number }> = ({ a, cx, cy, rx, ry, text, tx, ty }) => {
  const f = useCurrentFrame();
  const p = ease(f, a, a + 14), q = ease(f, a + 10, a + 20), r = ease(f, a + 16, a + 24);
  const circ = `M${cx + rx},${cy} C${cx + rx},${cy - ry * 1.1} ${cx - rx * 1.05},${cy - ry} ${cx - rx},${cy + ry * 0.1} C${cx - rx * 0.95},${cy + ry * 1.1} ${cx + rx * 1.1},${cy + ry} ${cx + rx * 0.92},${cy - ry * 0.25}`;
  const ax = cx + rx * 0.7 * Math.sign(tx - cx || 1), ay = cy - ry * 0.9;
  const arrow = `M${tx + 40},${ty + 30} Q${(tx + ax) / 2 + 60},${ty + 10} ${ax},${ay} M${ax},${ay} l38,-6 M${ax},${ay} l10,34`;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.6))" }}>
        <path d={circ} fill="none" stroke={GOLD} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d={arrow} fill="none" stroke={GOLD} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} />
      </svg>
      <div style={{ position: "absolute", left: tx - 120, top: ty - 40, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: GOLD, opacity: r, transform: `rotate(-6deg) scale(${0.9 + 0.1 * r})`, textShadow: "0 3px 8px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>{text}</div>
    </AbsoluteFill>
  );
};
export const Aside: React.FC<{ a: number; t: string; x: number; y: number }> = ({ a, t, x, y }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "12px 22px", borderRadius: 18, background: "rgba(250,248,244,.96)", color: "#1b1d22", fontFamily: F, fontWeight: 700, fontSize: 44, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, transformOrigin: "0 100%", boxShadow: "0 8px 20px rgba(0,0,0,.35)", whiteSpace: "nowrap" }}>
      {t}<div style={{ position: "absolute", left: 26, bottom: -16, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "18px solid rgba(250,248,244,.96)" }} />
    </div>
  );
};
const Credit: React.FC<{ t?: string }> = ({ t }) => t ? <div style={{ position: "absolute", right: 30, bottom: 22, fontFamily: F, fontWeight: 700, fontSize: 20, color: "rgba(240,235,229,.62)", textShadow: "0 1px 4px #000" }}>{t}</div> : null;
const Vig: React.FC<{ k?: number }> = ({ k = 0.62 }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,${k}) 100%)` }} />;

// overlays comunes de un plano (texto encima del real o del dibujo)
export type Ov = { build?: { lines: string[]; a?: number; size?: number; color?: string; y?: number; out?: number }; big?: { w: string; a?: number; color?: string; size?: number; x?: number; y?: number };
  label?: string; scrib?: { a?: number; cx: number; cy: number; rx: number; ry: number; text: string; tx: number; ty: number }; aside?: { t: string; a?: number; x: number; y: number }; credit?: string };
export const Overlays: React.FC<{ o: Ov }> = ({ o }) => (
  <>
    {o.label && <Label t={o.label} />}
    {o.scrib && <Scribble a={o.scrib.a ?? 10} {...o.scrib} />}
    {o.build && <Build {...o.build} />}
    {o.big && <BigWord a={o.big.a ?? 6} {...o.big} />}
    {o.aside && <Aside a={o.aside.a ?? 14} {...o.aside} />}
    <Credit t={o.credit} />
  </>
);

// ───────────────────────── REAL ─────────────────────────
// foto o clip a pantalla completa, punch-in lento 4-8 % + viñeta, sin filtro (look documental neutro)
export const RealShot: React.FC<{ v: string; d: number; z?: [number, number]; from?: number; pos?: string; o?: Ov; rate?: number }> = ({ v, d, z, from = 0, pos = "50% 50%", o = {}, rate = 1 }) => {
  const f = useCurrentFrame();
  const vid = v.endsWith(".mp4");
  // foto: empuje + deriva lateral que crecen con el largo del plano (nunca se ve quieta); video: empuje suave
  const zz = z || (vid ? [1.03, 1.08] : [1.04, 1.06 + Math.min(0.12, d / 1800)]);
  const s = interpolate(f, [0, Math.max(d, 2)], zz, clamp);
  const dx = vid ? 0 : interpolate(f, [0, Math.max(d, 2)], [-1, 1]) * Math.min(30, d / 8) * (v.length % 2 ? 1 : -1);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${dx}px) scale(${s})`, filter: "saturate(.82)" }}>
        {vid ? <OffthreadVideo src={sf(v)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
          : <Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />}
      </AbsoluteFill>
      <Vig />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// archivo (grabado, pintura, foto vieja): entero dentro de un borde blanco, sobre la misma imagen borrosa; push lento; año + crédito
export const Arch: React.FC<{ v: string; d: number; ar: number; year?: string; o?: Ov; side?: "c" | "l" | "r" }> = ({ v, d, ar, year, o = {}, side = "c" }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f, fps: 30, config: { damping: 18, mass: 0.8 } });
  const maxW = side === "c" ? 1500 : 1000, maxH = o.build ? 640 : 860;
  let w = maxW, h = w / ar; if (h > maxH) { h = maxH; w = h * ar; }
  const cx = side === "c" ? 960 : side === "l" ? 620 : 1300, cy = o.build ? 640 : 540;
  const s = interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.32) saturate(.7)", transform: "scale(1.2)" }}><Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2 + (1 - t) * 50, width: w, height: h, opacity: t, transform: `scale(${s}) rotate(${(1 - t) * -2}deg)`, border: "7px solid rgba(250,248,242,.95)", boxShadow: "0 30px 70px rgba(0,0,0,.7)", background: "#222" }}>
        <Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.8)" }} />
      </div>
      {year && <Label t={year} />}
      <Overlays o={{ ...o, label: undefined }} />
    </AbsoluteFill>
  );
};
// 2-3 fotos con borde blanco sobre una borrosa + cifra/palabra naranja al lado
export const Cards: React.FC<{ bg: string; cards: string[]; o?: Ov }> = ({ bg, cards, o = {} }) => {
  const f = useCurrentFrame();
  const W = cards.length > 2 ? 380 : 440, H = W * 1.25, G = 46, X0 = (o.big ? 1100 : 960) - (cards.length * W + (cards.length - 1) * G) / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(.36) saturate(.8)", transform: `scale(${1.15 + f * 0.0006})` }}><Img src={sf(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0004})` }}>
      {cards.map((c, i) => {
        const t = spring({ frame: f - 3 - i * 12, fps: 30, config: { damping: 15, mass: 0.8 } });
        const tilt = (rnd(i, 7) - 0.5) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 540 - H / 2 + 40 + (1 - t) * 90, width: W, height: H, opacity: t, transform: `rotate(${tilt * (1 - t * 0.6)}deg)`, borderRadius: 12, overflow: "hidden", border: "6px solid rgba(255,255,255,.93)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
            <Img src={sf(c)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 - f * 0.0005})` }} />
          </div>
        );
      })}
      </AbsoluteFill>
      <Overlays o={{ ...o, big: o.big ? { x: 90, y: 440, size: 170, color: ORA, ...o.big } : undefined }} />
    </AbsoluteFill>
  );
};


// ───────────────────────── utilidades ─────────────────────────
const Push: React.FC<{ d: number; k?: number; ox?: string; children: React.ReactNode }> = ({ d, k = 0.05, ox = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1 + k], clamp)})`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
// 15. electrocardiograma que se corta (con respeto: sólo la línea)
export const EcgScene: React.FC<{ d: number; cut?: number; o?: Ov; dim?: boolean }> = ({ d, cut = 0.6, o = {}, dim }) => {
  const f = useCurrentFrame();
  const W = 1920, prog = interpolate(f, [0, d], [0.22, 1], clamp), head = prog * W * 1.15;
  const pts: string[] = [];
  for (let x = 0; x <= Math.min(head, W); x += 6) {
    const flat = x > W * cut;
    const ph = (x % 300) / 300;
    const y = flat ? 0 : ph > 0.4 && ph < 0.44 ? -170 : ph > 0.44 && ph < 0.48 ? 110 : ph > 0.6 && ph < 0.7 ? -30 * Math.sin((ph - 0.6) * 31) : 0;
    pts.push(`${x},${560 + y}`);
  }
  const col = dim ? "#8aa" : "#5dff8a";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #17402c 0%, #07160e 80%)" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(93,255,138,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(93,255,138,.14) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// fondo oscuro + texto (BigWord / Build) para las frases que pegan
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6e1a10 0%, #2a0806 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)";
  return <AbsoluteFill style={{ background: bg, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.04], clamp)})` }}><Overlays o={o} /></AbsoluteFill>;
};
// pantalla partida en diagonal: GOOD NEWS. / BAD NEWS.
export const DiagSplit: React.FC<{ d: number; l: string; r: string; wl: string; wr: string; a?: number }> = ({ d, l, r, wl, wr, a = 40 }) => {
  const f = useCurrentFrame();
  const w = ease(f, a, a + 12) * 100, ph = ease(f, 0, d);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "saturate(.75) brightness(.8)" }}><Img src={sf(l)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + ph * 0.04})` }} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${108 - w * 0.56}% 0, 100% 0, 100% 100%, ${92 - w * 0.56}% 100%)` }}>
        <Img src={sf(r)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.75) brightness(.8)", transform: `scale(${1.08 - ph * 0.04})` }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={1920 * (1.08 - w * 0.0056)} y1={0} x2={1920 * (0.92 - w * 0.0056)} y2={1080} stroke={INK} strokeWidth={6} opacity={w > 2 ? 1 : 0} /></svg>
      <BigWord a={4} w={wl} color={INK} size={120} x={100} y={150} />
      <BigWord a={a + 10} w={wr} color={RED} size={120} x={1180} y={150} />
    </AbsoluteFill>
  );
};

// ───────────────────────── recortes reales (rembg) pintados en silueta ─────────────────────────
type CutK = "hippo" | "hippomouth" | "lioness" | "lionlie" | "lion" | "croc" | "zebra" | "cub";
// animal en silueta con borde de luz; x,y = pie (centro abajo); w = ancho; flip = espejado
export const An: React.FC<{ k: CutK; x: number; y: number; w: number; flip?: boolean; rim?: string; eye?: boolean; bob?: number; op?: number; rot?: number; dim?: number }> = ({ k, x, y, w, flip, rim = C.glow, eye, bob = 0, op = 1, rot = 0, dim = 0 }) => {
  const f = useCurrentFrame();
  const c = (CUTS as any)[k] as { img: string; ar: number; eye?: [number, number] };
  const h = w / c.ar, dy = Math.sin(f / 7 + x) * bob;
  const e = c.eye || [0.85, 0.3];
  if (op <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h + dy, width: w, height: h, opacity: op, transform: `${flip ? "scaleX(-1) " : ""}rotate(${rot}deg)`, transformOrigin: "50% 100%" }}>
      <Img src={sf(c.img)} style={{ width: "100%", height: "100%", objectFit: "contain", filter: `brightness(${dim}) drop-shadow(0 -3px 0 ${rim}) drop-shadow(0 0 14px ${rim}66)` }} />
      {eye && <div style={{ position: "absolute", left: e[0] * w - 7, top: e[1] * h - 7, width: 14, height: 14, borderRadius: 7, background: "#ffb030", boxShadow: "0 0 18px 6px #ff9a1a", opacity: 0.6 + 0.4 * Math.abs(Math.sin(f / 9)) }} />}
    </div>
  );
};
const SV: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>{children}</svg>;
const Tag: React.FC<{ x: number; y: number; op?: number; color?: string; size?: number; children: React.ReactNode; center?: boolean }> = ({ x, y, op = 1, color = INK, size = 48, children, center }) => (
  <div style={{ position: "absolute", left: center ? x - 800 : x, width: center ? 1600 : undefined, textAlign: center ? "center" : undefined, top: y, fontFamily: F, fontWeight: 900, fontSize: size, color, opacity: op, textShadow: "0 3px 12px rgba(0,0,0,.75)", whiteSpace: "nowrap", transform: `translateY(${(1 - op) * 12}px)` }}>{children}</div>
);
// pasto seco en primer plano que se mece
const Grass: React.FC<{ y: number; n?: number; h?: number; color?: string; seed?: number }> = ({ y, n = 90, h = 170, color = "#1c140c", seed = 1 }) => {
  const f = useCurrentFrame();
  return <SV>{Array.from({ length: n }).map((_, i) => { const x = -40 + (i / n) * 2000 + rnd(i, seed) * 20, hh = h * (0.55 + rnd(i, seed + 1) * 0.6), sw = Math.sin(f / 18 + i * 0.7) * 10 * (0.5 + rnd(i, 3));
    return <path key={i} d={`M${x},${y + 40} Q${x + sw * 0.4},${y - hh * 0.5} ${x + sw + (rnd(i, 4) - 0.5) * 30},${y - hh}`} stroke={color} strokeWidth={5 + rnd(i, 5) * 5} fill="none" strokeLinecap="round" />; })}
    <rect x={-40} y={y + 30} width={2000} height={400} fill={color} /></SV>;
};
// agua por delante del animal (lo tapa de la línea para abajo) + rayas que corren
const WaterFront: React.FC<{ y: number; x0?: number; night?: number }> = ({ y, x0 = 0, night = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x0, right: 0, top: y, bottom: 0, overflow: "hidden", background: "linear-gradient(180deg, rgba(22,64,74,.94) 0%, #0b2329 100%)" }}>
      {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 240 + f * (1.2 + (i % 3) * 0.5)) % 2200) - 200, top: 6 + i * 26, width: 110 + rnd(i, 5) * 160, height: 3, borderRadius: 2, background: `rgba(255,190,120,${0.22 * (1 - night * 0.6)})` }} />)}
    </div>
  );
};
const Ripple: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => {
  const f = useCurrentFrame();
  return <SV>{[0, 1, 2].map((i) => { const ph = ((f + i * 20) % 60) / 60; return <ellipse key={i} cx={x} cy={y} rx={(60 + ph * 220) * k} ry={(10 + ph * 34) * k} fill="none" stroke="rgba(255,210,160,.5)" strokeWidth={3} opacity={1 - ph} />; })}</SV>;
};
const Splash: React.FC<{ x: number; y: number; t: number; w?: number }> = ({ x, y, t, w = 520 }) => {
  if (t <= 0 || t >= 1) return null;
  const up = Math.sin(t * Math.PI);
  return <SV>{Array.from({ length: 26 }).map((_, i) => { const a = (i / 25 - 0.5) * Math.PI * 0.9, r = (0.4 + rnd(i, 8) * 0.6) * up;
    return <ellipse key={i} cx={x + Math.sin(a) * w * 0.55 * (0.4 + t)} cy={y - Math.cos(a) * 320 * r} rx={26 + rnd(i, 2) * 30} ry={18 + rnd(i, 3) * 26} fill={`rgba(225,240,240,${0.75 * up})`} />; })}
    <ellipse cx={x} cy={y} rx={w * (0.5 + t * 0.6)} ry={50} fill={`rgba(225,240,240,${0.5 * up})`} /></SV>;
};
// vos, agachado en el pasto, de espaldas (chaleco naranja)
const Crouch: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const br = Math.sin(f / 14) * 3;
  return (
    <svg width={220 * s} height={220 * s} viewBox="0 0 220 220" style={{ position: "absolute", left: x - 110 * s, top: y - 220 * s, overflow: "visible" }}>
      <path d={`M60,210 Q50,120 110,${100 + br} Q170,120 160,210 Z`} fill={C.vest} />
      <circle cx={112} cy={70 + br} r={36} fill="#5a3a22" />
      <path d="M70,150 Q40,170 52,206" stroke="#f2c49b" strokeWidth={16} fill="none" strokeLinecap="round" />
    </svg>
  );
};

// ───────────────────────── 1. EL RÍO (escena madre) ─────────────────────────
// hook · stand · open · spread · lunge · liedown · dusk · night · drought
export const RiverScene: React.FC<{ d: number; mode?: string; o?: Ov }> = ({ d, mode = "hook", o = {} }) => {
  const f = useCurrentFrame();
  const night = mode === "night" ? 1 : mode === "dusk" ? 0.45 : 0.12;
  const wl = 700;
  const lions: [number, number][] = [[260, 0.9], [380, 0.82], [520, 1], [640, 0.86], [760, 0.95], [150, 0.75], [450, 0.7], [700, 0.72]];
  const standK = mode === "stand" ? ease(f, d * 0.25, d * 0.5) : mode === "spread" || mode === "lunge" ? 1 : mode === "liedown" ? 1 : 0;
  const open = mode === "open" ? ease(f, d * 0.35, d * 0.55) : mode === "lunge" || mode === "spread" ? 1 : 0;
  const hx = mode === "lunge" ? 1430 - ease(f, d * 0.35, d * 0.5) * 220 + ease(f, d * 0.62, d * 0.9) * 120 : mode === "open" ? 1430 + Math.sin(f / 20) * 6 : 1430;
  const jump = mode === "lunge" ? Math.sin(ease(f, d * 0.36, d * 0.6) * Math.PI) : 0;
  const splashT = mode === "lunge" ? interpolate(f, [d * 0.38, d * 0.75], [0, 1], clamp) : 0;
  const youngX = mode === "lunge" ? 880 + ease(f, d * 0.05, d * 0.35) * 230 - ease(f, d * 0.5, d * 0.62) * 420 : 0;
  return (
    <Push d={d} k={0.05} ox={mode === "open" || mode === "lunge" ? "70% 70%" : "50% 60%"}>
      <SunsetStage tree="acacia" water horizon={560} night={night} sunX={mode === "dusk" ? 1700 : 1500} pan={0.15}>
        <SV><path d={`M-20,${wl - 70} Q500,${wl - 120} 980,${wl - 40} Q1080,${wl} 1120,1080 L-20,1080 Z`} fill={mode === "drought" ? "#5a4130" : "#4a3426"} />
          {mode === "drought" && Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${100 + rnd(i, 2) * 1700},${780 + rnd(i, 3) * 280} l${30 + rnd(i, 4) * 40},10 l20,-24`} stroke="#2a1d14" strokeWidth={3} fill="none" />)}</SV>
        {mode !== "night" && mode !== "drought" && lions.map(([x, s], i) => {
          const isOld = i === 2;
          const st = mode === "stand" ? (isOld ? standK : 0) : mode === "liedown" ? 1 - ease(f, d * (0.12 + i * 0.08), d * (0.24 + i * 0.08)) : standK;
          const sx = mode === "spread" ? x + (i - 3.5) * 70 * ease(f, 0, d * 0.8) + 140 : x;
          if (mode === "lunge" && i === 4) return null;
          return <React.Fragment key={i}>
            <An k="lionlie" x={sx} y={wl - 40 + (i % 2) * 14} w={210 * s} flip={i % 3 === 0} op={1 - st} bob={1} />
            <An k="lioness" x={sx + (isOld && mode === "stand" ? ease(f, d * 0.5, d) * 90 : 0)} y={wl - 34 + (i % 2) * 14} w={230 * s * (isOld && mode === "stand" ? 1.5 : 1)} op={st} eye={isOld && mode === "stand"} rim={isOld && mode === "stand" ? "#ffd27a" : undefined} />
          </React.Fragment>;
        })}
        {mode === "lunge" && <An k="lioness" x={youngX} y={wl + 10} w={250} flip={f > d * 0.5} eye />}
        {mode !== "night" && mode !== "drought" && mode !== "dusk" && <>
          <An k="hippo" x={hx} y={wl + 80 - jump * 40} w={560} op={1 - open} bob={mode === "hook" ? 3 : 1.5} flip />
          <An k="hippomouth" x={hx} y={wl + 90 - jump * 60} w={560 * (0.95 + open * 0.08)} op={open} rim="#ffcf8a" />
        </>}
        {mode === "night" && <>
          <An k="hippo" x={interpolate(f, [0, d], [1250, 1150])} y={900} w={540} flip bob={2} rim="#9fc2ff" />
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 300 + i * 150, top: 860 + (i % 2) * 20, width: 12, height: 8, borderRadius: 6, background: "#ffc040", boxShadow: "0 0 12px 4px #ff9a1a", opacity: ease(f, d * 0.4 + i * 10, d * 0.5 + i * 10) }} />)}
        </>}
        {mode === "drought" && <>
          <div style={{ position: "absolute", left: 980, right: 0, top: 840, height: 240, background: "linear-gradient(180deg,#4a3a26,#2a2016)", borderRadius: "40% 40% 0 0" }} />
          {[0, 1, 2, 3].map((i) => <An key={i} k="hippo" x={1150 + i * 170} y={900 + (i % 2) * 20} w={320} flip={i % 2 === 0} bob={1} rim="#d9a070" />)}
          {[0, 1, 2].map((i) => <An key={"l" + i} k="lioness" x={interpolate(f, [0, d], [300 + i * 160, 420 + i * 160])} y={860} w={240} eye={i === 1} />)}
        </>}
        {mode === "dusk" && <>
          <SV><ellipse cx={1500} cy={wl + 34} rx={120} ry={22} fill="#0a1a1e" /><ellipse cx={1455} cy={wl + 22} rx={16} ry={12} fill="#0a1a1e" /><ellipse cx={1545} cy={wl + 22} rx={16} ry={12} fill="#0a1a1e" /></SV>
          {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 1470 + i * 46, top: wl + 18, width: 14, height: 10, borderRadius: 7, background: "#ffb030", boxShadow: "0 0 16px 6px #ff9a1a", opacity: ease(f, d * 0.35, d * 0.55) }} />)}
        </>}
        {mode !== "night" && mode !== "drought" && <WaterFront y={wl + 40} x0={1000} night={night} />}
        {(mode === "hook" || mode === "open" || mode === "dusk") && <Ripple x={mode === "dusk" ? 1500 : hx} y={wl + 50} k={0.8} />}
        <Splash x={hx - 220} y={wl + 50} t={splashT} />
        {(mode === "hook" || mode === "stand" || mode === "dusk") && <Crouch x={240} y={1050} s={1.4} />}
        <Grass y={mode === "night" ? 960 : 1000} h={mode === "night" ? 230 : 150} color={mode === "night" ? "#0a0d10" : "#1c140c"} />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 2. MARCADOR DE COMBATE (pieza ancla): se llena arma por arma ─────────────────────────
export const ROWS = [
  { n: "WEIGHT", l: "≈ 2 t (all 14)", r: "1.5 – 3 t + (one)" },
  { n: "1 · MOUTH", l: "throat bite", r: "150° · tusks ~½ m" },
  { n: "2 · SKIN", l: "claws 3–4 cm", r: "skin 5–6 cm" },
  { n: "3 · WATER", l: "hates deep water", r: "home fortress" },
  { n: "4 · SPEED", l: "faster… barely", r: "~30 km/h, spins" },
  { n: "5 · POD", l: "one pride", r: "10, 20, more" },
  { n: "6 · RED SWEAT", l: "wounds get infected", r: "heals clean" },
];
export const Scoreboard: React.FC<{ d: number; upto: number; active?: number; verdict?: number; o?: Ov }> = ({ d, upto, active = -1, verdict, o = {} }) => {
  const f = useCurrentFrame();
  const X = 230, W = 1460, RH = 92, Y0 = 270;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2a1a10 0%, #0a0705 78%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + Math.min(f, 600) * 0.00008})` }}>
        <div style={{ position: "absolute", left: X, top: 70, width: W, display: "flex", justifyContent: "space-between", fontFamily: F, fontWeight: 900, fontSize: 64, color: INK }}>
          <div style={{ width: 520, textAlign: "center", color: ORA }}>LION PRIDE</div><div style={{ fontSize: 44, color: "rgba(240,235,229,.5)", marginTop: 14 }}>VS</div><div style={{ width: 520, textAlign: "center", color: RED }}>HIPPO</div>
        </div>
        <An k="lioness" x={X + 260} y={258} w={190} rim={ORA} bob={1} />
        <An k="hippo" x={X + W - 260} y={258} w={210} flip rim={RED} bob={1} />
        {ROWS.map((r, i) => {
          const on = i <= upto, isA = i === active;
          const t = isA ? ease(f, 6, 22) : on ? 1 : 0;
          const glow = isA ? 0.5 + 0.5 * Math.sin(f / 6) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: X, top: Y0 + i * (RH + 10), width: W, height: RH, borderRadius: 12, background: isA ? "rgba(255,120,60,.16)" : "rgba(255,255,255,.05)", border: `2px solid rgba(255,170,90,${0.15 + glow * 0.6})`, fontFamily: F, display: "flex", alignItems: "center" }}>
              <div style={{ width: 520, textAlign: "center", fontSize: 36, fontWeight: 800, color: INK, opacity: t, transform: `translateX(${(1 - t) * -40}px)` }}>{on ? r.l : ""}</div>
              <div style={{ width: 420, textAlign: "center", fontSize: 34, fontWeight: 900, color: isA ? ORA : "rgba(240,235,229,.7)", letterSpacing: 1 }}>{r.n}</div>
              <div style={{ width: 520, textAlign: "center", fontSize: 36, fontWeight: 900, color: RED, opacity: t, transform: `translateX(${(1 - t) * 40}px)` }}>{on ? r.r : ""}</div>
              {on && i > 0 && <div style={{ position: "absolute", right: -64, top: 16, fontSize: 46, color: RED, opacity: t, fontWeight: 900 }}>◀</div>}
            </div>
          );
        })}
        {verdict !== undefined && <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", opacity: ease(f, verdict, verdict + 8) }}>
          <div style={{ display: "inline-block", padding: "16px 70px", background: "rgba(14,8,6,.94)", border: `8px solid ${RED}`, borderRadius: 14, transform: `rotate(-6deg) scale(${1.3 - 0.3 * ease(f, verdict, verdict + 8)})`, fontFamily: F, fontWeight: 900, fontSize: 170, color: RED }}>HIPPO.</div>
        </div>}
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 3. LA BALANZA: 14 leonas contra 1 hipopótamo ─────────────────────────
export const WeighScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const n = Math.min(14, Math.floor(interpolate(f, [4, d * 0.45], [0, 14.99], clamp)));
  const hip = ease(f, d * 0.5, d * 0.62);
  const tip = interpolate(f, [0, d * 0.45], [0, -7], clamp) + hip * 14 + Math.sin(f / 9) * 0.6 * hip;
  return (
    <SunsetStage tree="acacia" night={0.55} pan={0.2} horizon={600}>
      <div style={{ position: "absolute", left: 910, top: 790, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "100px solid #2a1c14" }} />
      <div style={{ position: "absolute", left: 260, top: 780, width: 1400, height: 20, borderRadius: 10, background: "#8a5a32", transform: `rotate(${tip}deg)`, transformOrigin: "700px 10px" }}>
        <div style={{ position: "absolute", left: 20, bottom: 20, width: 620, height: 300 }}>
          {Array.from({ length: n }).map((_, i) => <An key={i} k="lioness" x={70 + (i % 5) * 120} y={300 - Math.floor(i / 5) * 80} w={150} flip={i % 2 === 0} rim={ORA} />)}
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 20, width: 560, height: 300, opacity: hip }}><An k="hippo" x={280} y={300} w={540} flip /></div>
      </div>
      <Tag x={300} y={150} size={110} color={ORA}>{n} <span style={{ fontSize: 60, color: INK }}>lions</span></Tag>
      <Tag x={300} y={280} size={60} op={ease(f, d * 0.3, d * 0.4)}>≈ 2 tons</Tag>
      <Tag x={1060} y={150} size={110} color={RED} op={hip}>1 <span style={{ fontSize: 60, color: INK }}>hippo</span></Tag>
      <Tag x={1060} y={280} size={60} op={ease(f, d * 0.65, d * 0.75)}>more than all of them</Tag>
      <Overlays o={o} />
    </SunsetStage>
  );
};

// ───────────────────────── 4. RANGO DE PRESAS (franja 190-550 kg) ─────────────────────────
export const PreyRange: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const X = 160, W = 1600, MAX = 3000, px = (kg: number) => X + (kg / MAX) * W;
  const band = ease(f, 10, 34), hip = ease(f, d * 0.45, d * 0.58), mult = ease(f, d * 0.65, d * 0.75);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #1f3a58 0%, #0b1622 80%)" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0002})` }}>
        <div style={{ position: "absolute", left: X, top: 760, width: W, height: 12, background: "rgba(240,235,229,.3)", borderRadius: 6 }} />
        {[0, 500, 1000, 1500, 2000, 2500, 3000].map((k) => <div key={k} style={{ position: "absolute", left: px(k) - 60, width: 120, top: 790, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 28, color: "rgba(240,235,229,.6)" }}>{k === 0 ? "0" : k >= 1000 ? `${k / 1000} t` : `${k} kg`}</div>)}
        <div style={{ position: "absolute", left: px(190), top: 700, width: (px(550) - px(190)) * band, height: 132, background: "rgba(233,199,98,.28)", border: `4px solid ${GOLD}`, borderRadius: 10 }} />
        <Tag x={px(190) - 20} y={890} color={GOLD} size={46} op={band}>SWEET SPOT · 190–550 kg</Tag>
        <div style={{ position: "absolute", left: px(1500), top: 700, width: (px(3000) - px(1500)) * hip, height: 132, background: "rgba(241,69,54,.3)", border: `4px solid ${RED}`, borderRadius: 10 }} />
        <An k="zebra" x={px(370)} y={700} w={260} rim={GOLD} op={band} bob={1} />
        <An k="hippo" x={px(2250)} y={700} w={460} flip op={hip} bob={1} />
        <Tag x={px(1500)} y={890} color={RED} size={64} op={mult}>3 · 4 · 5 × past it</Tag>
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 5. RAYOS X: la mandíbula del hipo ─────────────────────────
export const JawXray: React.FC<{ d: number; mode?: "open" | "tusk" | "grind" | "bite"; o?: Ov }> = ({ d, mode = "open", o = {} }) => {
  const f = useCurrentFrame();
  const ang = mode === "open" ? ease(f, d * 0.12, d * 0.65) * 150 : mode === "grind" ? 18 * (0.5 + 0.5 * Math.cos(f / 7)) : mode === "bite" ? 60 * (1 - ease(f, d * 0.3, d * 0.4)) : 60;
  const hx = 560, hy = 600;   // bisagra
  const rotJ = ang * 0.62;     // la mandíbula baja; el arco muestra el ángulo total
  const glowT = mode === "tusk" ? ease(f, d * 0.2, d * 0.45) : 0;
  const spark = mode === "grind" && Math.cos(f / 7) > 0.9;
  const st = { fill: "none", stroke: CYAN, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const tuskC = glowT > 0.05 || mode === "grind" ? ORA : CYAN;
  return (
    <Push d={d} k={0.05} ox="40% 55%">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #062236 0%, #020a12 80%)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(79,227,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,227,255,.07) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <SV style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }}>
        <g transform={mode === "open" ? `translate(${hx - 60} ${hy + 220}) scale(0.72) translate(${-hx} ${-hy})` : undefined}>
        <g {...st} transform={`rotate(${-ang * 0.38} ${hx} ${hy})`}>
          <path d={`M${hx},${hy} Q${hx - 40},${hy - 220} ${hx + 180},${hy - 260} Q${hx + 520},${hy - 300} ${hx + 720},${hy - 160} Q${hx + 800},${hy - 100} ${hx + 790},${hy - 20} L${hx + 300},${hy - 10} Z`} />
          <circle cx={hx + 210} cy={hy - 170} r={46} /><ellipse cx={hx + 690} cy={hy - 150} rx={30} ry={18} />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={hx + 330 + i * 70} y={hy - 18} width={40} height={30} rx={8} />)}
          <path d={`M${hx + 740},${hy - 20} q20,50 -6,80`} strokeWidth={10} />
        </g>
        <g transform={`rotate(${rotJ} ${hx} ${hy})`} {...st}>
          <path d={`M${hx},${hy} Q${hx + 40},${hy + 150} ${hx + 300},${hy + 160} Q${hx + 640},${hy + 170} ${hx + 760},${hy + 60} L${hx + 780},${hy + 20} L${hx + 300},${hy + 20} Z`} />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={hx + 330 + i * 70} y={hy + 6} width={40} height={30} rx={8} />)}
          <path d={`M${hx + 690},${hy + 70} Q${hx + 640},${hy - 100} ${hx + 770},${hy - 230}`} stroke={tuskC} strokeWidth={18 + glowT * 6} style={{ filter: glowT > 0.05 ? `drop-shadow(0 0 ${10 + glowT * 30}px ${ORA})` : undefined }} />
          <path d={`M${hx + 690},${hy + 70} L${hx + 700},${hy + 150}`} strokeDasharray="8 10" stroke={ORA} opacity={glowT} strokeWidth={8} />
        </g>
        {mode === "open" && ang > 2 && <path d={`M${hx + 260 * Math.cos(-ang * 0.38 * Math.PI / 180)},${hy + 260 * Math.sin(-ang * 0.38 * Math.PI / 180)} A260,260 0 0,1 ${hx + 260 * Math.cos(rotJ * Math.PI / 180)},${hy + 260 * Math.sin(rotJ * Math.PI / 180)}`} fill="none" stroke={GOLD} strokeWidth={6} strokeDasharray="14 10" />}
        </g>
        {spark && Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${hx + 760},${hy - 30} l${Math.cos(i) * 50},${Math.sin(i) * 50}`} stroke={GOLD} strokeWidth={4} />)}
      </SV>
      {mode === "open" && <Tag x={1400} y={420} size={170} color={GOLD}>{Math.round(ang)}°</Tag>}
      {mode === "tusk" && <Tag x={1260} y={260} size={120} color={ORA} op={glowT}>~½ m</Tag>}
      {mode === "tusk" && <Tag x={1260} y={400} size={34} op={ease(f, d * 0.5, d * 0.6)}>counting the part in the gum</Tag>}
      {mode === "grind" && <Tag x={960} y={110} size={84} color={GOLD} center>SELF-SHARPENING</Tag>}
      {mode === "bite" && <Tag x={960} y={90} size={130} color={RED} center op={ease(f, d * 0.4, d * 0.5)}>1 TON +</Tag>}
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 6. PIEL EN CORTE: garra 3-4 cm contra piel 5-6 cm ─────────────────────────
export const SkinCut: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const cm = 95, top = 330, claw = ease(f, d * 0.2, d * 0.55) * 3.5 * cm;
  return (
    <Push d={d} k={0.05} ox="50% 45%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#14263a 0%,#0b1622 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top, height: 5.5 * cm, background: "linear-gradient(180deg,#6a4a3c 0%,#4f3328 100%)", borderTop: "6px solid #8a6250" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 5.5 * cm, height: 110, background: "#e2c27a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 5.5 * cm + 110, bottom: 0, background: "repeating-linear-gradient(80deg,#8a2a26 0 26px,#a2342e 26px 52px)" }} />
      <Tag x={1560} y={top + 200} size={44}>SKIN</Tag><Tag x={1560} y={top + 5.5 * cm + 30} size={40} color="#3a2a14">FAT</Tag><Tag x={1560} y={top + 5.5 * cm + 130} size={40}>MUSCLE</Tag>
      <SV>{Array.from({ length: 7 }).map((_, i) => <g key={i}><line x1={200} x2={250} y1={top + i * cm} y2={top + i * cm} stroke={INK} strokeWidth={4} /><text x={90} y={top + i * cm + 12} fontFamily={F} fontWeight={800} fontSize={32} fill={INK}>{i} cm</text></g>)}
        <line x1={225} x2={225} y1={top} y2={top + 6 * cm} stroke={INK} strokeWidth={4} />
        <g transform={`translate(860, ${top - 300 + claw})`}><path d="M0,0 Q120,40 150,300 Q90,180 -20,120 Z" fill="#f2ead8" stroke="#3a2a1a" strokeWidth={5} /></g>
        <line x1={760} x2={1100} y1={top + 3.5 * cm} y2={top + 3.5 * cm} stroke={GOLD} strokeWidth={5} strokeDasharray="14 10" opacity={ease(f, d * 0.55, d * 0.62)} />
        <line x1={760} x2={1100} y1={top + 5.5 * cm} y2={top + 5.5 * cm} stroke={RED} strokeWidth={5} strokeDasharray="14 10" opacity={ease(f, d * 0.6, d * 0.68)} />
      </SV>
      <Tag x={1130} y={top + 3.5 * cm - 40} size={46} color={GOLD} op={ease(f, d * 0.55, d * 0.62)}>claw: 3–4 cm</Tag>
      <Tag x={1130} y={top + 5.5 * cm - 60} size={46} color={RED} op={ease(f, d * 0.6, d * 0.68)}>skin: 5–6 cm</Tag>
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 7. EL CUELLO: cebra (fino) contra hipo (columna) ─────────────────────────
export const NeckScene: React.FC<{ d: number; mode?: "zebra" | "both"; o?: Ov }> = ({ d, mode = "both", o = {} }) => {
  const f = useCurrentFrame();
  const z = mode === "zebra";
  const a = ease(f, d * 0.12, d * 0.28), b = z ? 0 : ease(f, d * 0.45, d * 0.6);
  return (
    <Push d={d} k={0.04}>
      <SunsetStage tree="acacia" night={0.3} pan={0.2} horizon={640}>
        <An k="zebra" x={520} y={900} w={560} rim={GOLD} bob={1} dim={1} />
        <An k="hippo" x={1390} y={910} w={700} flip rim={RED} bob={1} op={z ? 0 : 1} dim={1} />
        <SV><circle cx={(CUTS as any).zebra.neck[0] * 560 + 240} cy={900 - (560 / (CUTS as any).zebra.ar) * (1 - (CUTS as any).zebra.neck[1])} r={70 * a} fill="none" stroke={GOLD} strokeWidth={7} strokeDasharray="12 8" />
          <rect x={1390 - 350 + 700 * (1 - (CUTS as any).hippo.neck[0]) - 110} y={910 - (700 / (CUTS as any).hippo.ar) * (1 - (CUTS as any).hippo.neck[1]) - 110} width={220 * b} height={220} fill="none" stroke={RED} strokeWidth={7} strokeDasharray="14 10" opacity={b} /></SV>
        <Tag x={300} y={300} color={GOLD} size={56} op={a}>a neck to close ✓</Tag>
        <Tag x={1120} y={300} color={RED} size={56} op={b}>a column of muscle ✗</Tag>
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 8. EL RÍO EN CORTE (la fortaleza) ─────────────────────────
export const RiverCut: React.FC<{ d: number; mode?: "walk" | "sink" | "surface" | "lion"; o?: Ov }> = ({ d, mode = "walk", o = {} }) => {
  const f = useCurrentFrame();
  const wl = 420, bed = 930;
  const hx = mode === "walk" ? interpolate(f, [0, d], [560, 1180]) : mode === "lion" ? interpolate(f, [0, d], [1250, 1150]) : 1050;
  const rise = mode === "surface" ? ease(f, d * 0.4, d * 0.6) : 0;
  const hy = bed - Math.abs(Math.sin(f / 9)) * 34 - rise * (bed - wl - 120);
  const secs = Math.round(interpolate(f, [0, d], [0, 300], clamp));
  return (
    <Push d={d} k={0.04}>
      <SunsetStage tree="acacia" horizon={wl - 60} night={0.2} pan={0.1}>
        <SV><path d={`M-20,${wl - 70} L520,${wl - 70} Q620,${wl + 40} 700,${wl + 4} L-20,${wl + 4} Z`} fill="#4a3426" /></SV>
        {mode === "lion" && <An k="lioness" x={330} y={wl - 66} w={280} eye />}
        <div style={{ position: "absolute", left: 0, right: 0, top: wl, bottom: 0, background: "linear-gradient(180deg,#1d5a62 0%,#123c44 55%,#0b262c 100%)" }} />
        {mode !== "surface" && Array.from({ length: 12 }).map((_, i) => { const ph = (f / 70 + rnd(i, 4)) % 1; return <div key={i} style={{ position: "absolute", left: hx + 160 + rnd(i, 5) * 80, top: hy - 220 - ph * Math.max(10, hy - wl - 240), width: 10 + rnd(i, 6) * 10, height: 10 + rnd(i, 6) * 10, borderRadius: 10, border: "2px solid rgba(220,250,255,.6)", opacity: 1 - ph }} />; })}
        <div style={{ position: "absolute", left: 0, right: 0, top: bed, bottom: 0, background: "linear-gradient(180deg,#3a2a1a,#241a10)" }} />
        {mode !== "sink" && <An k="hippo" x={hx} y={hy + 8} w={540} rim="#8fe3ff" />}
        {mode === "lion" && [0, 1].map((i) => <An key={i} k="croc" x={interpolate(f, [0, d], [1500 + i * 200, 1400 + i * 200])} y={wl + 120 + i * 140} w={420} flip rim="#9fc2ff" />)}
        {mode === "sink" && <SV><ellipse cx={1050} cy={wl + 4} rx={170} ry={18} fill="#2a1d14" /><ellipse cx={995} cy={wl - 6} rx={16} ry={11} fill="#2a1d14" /><ellipse cx={1105} cy={wl - 6} rx={16} ry={11} fill="#2a1d14" />
          <text x={1050} y={wl - 60} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={GOLD} opacity={ease(f, d * 0.4, d * 0.5)}>?</text></SV>}
        {mode === "surface" && <Splash x={hx} y={wl + 10} t={interpolate(f, [d * 0.5, d * 0.9], [0, 1], clamp)} w={420} />}
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: ((i * 700 + f * 2) % 2100) - 100, top: wl - 2, width: 200, height: 4, background: "rgba(255,220,170,.4)" }} />)}
      </SunsetStage>
      {mode === "walk" && <Tag x={1350} y={560} size={110} color={ORA}>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</Tag>}
      {mode === "walk" && <Tag x={1300} y={690} size={36}>holding its breath · ~5 min</Tag>}
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 9. LA CARRERA: vos, el hipo (~30 km/h) y la leona ─────────────────────────
export const RaceScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = (v: number) => 240 + interpolate(f, [0, d], [0, 130 * v], clamp);
  return (
    <SunsetStage tree="acacia" night={0.25} pan={1.2} horizon={480}>
      {[620, 800, 980].map((y, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: 4, background: "rgba(240,235,229,.25)" }} />)}
      <Person x={p(6)} y={612} s={0.6} walk />
      <An k="hippo" x={p(8)} y={796} w={300} bob={6} />
      <An k="lioness" x={p(9.5)} y={976} w={300} bob={4} />
      <Tag x={60} y={500} size={40}>YOU</Tag><Tag x={60} y={680} size={40} color={RED}>HIPPO · ~30 km/h</Tag><Tag x={60} y={860} size={40} color={ORA}>LIONESS</Tag>
      <Overlays o={o} />
    </SunsetStage>
  );
};

// ───────────────────────── 10. EL GRUPO (pod) / el cocodrilo que se va / las cicatrices ─────────────────────────
export const PodScene: React.FC<{ d: number; mode?: "pod" | "croc" | "scars"; o?: Ov }> = ({ d, mode = "pod", o = {} }) => {
  const f = useCurrentFrame();
  const n = mode === "pod" ? Math.min(20, 1 + Math.floor(interpolate(f, [0, d * 0.6], [0, 19.99], clamp))) : 8;
  const charge = mode === "croc" ? ease(f, d * 0.3, d * 0.6) : 0;
  const crocGo = mode === "croc" ? ease(f, d * 0.5, d * 0.85) : 0;
  return (
    <Push d={d} k={0.05} ox="55% 65%">
      <SunsetStage tree="acacia" water horizon={560} night={0.2} pan={0.12}>
        {Array.from({ length: n }).map((_, i) => <An key={i} k="hippo" x={900 + (i % 4) * 240 + rnd(i, 2) * 60} y={760 + Math.floor(i / 4) * 60} w={250 + rnd(i, 3) * 60} flip={i % 2 === 0} bob={2} />)}
        {mode !== "scars" && <An k="hippomouth" x={980 - charge * 320} y={830} w={460} flip op={mode === "croc" ? 1 : ease(f, d * 0.6, d * 0.7)} rim="#ffcf8a" />}
        {mode === "scars" && <An k="hippo" x={960} y={900} w={900} flip rim={ORA} />}
        {mode === "croc" && <An k="croc" x={460 - crocGo * 260} y={800 + crocGo * 130} w={560} flip={crocGo < 0.05} op={1 - crocGo * 0.85} rim="#9fc2ff" />}
        <WaterFront y={mode === "scars" ? 860 : 790} night={0.2} />
        {mode === "croc" && <Splash x={760 - charge * 320} y={790} t={interpolate(f, [d * 0.3, d * 0.7], [0, 1], clamp)} w={380} />}
        {mode === "scars" && <SV>{Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${700 + i * 70},${640 + (i % 3) * 30} l70,26`} stroke={RED} strokeWidth={7} strokeLinecap="round" opacity={ease(f, 10 + i * 6, 16 + i * 6)} />)}</SV>}
      </SunsetStage>
      {mode === "pod" && <Tag x={120} y={150} size={140} color={ORA}>{n}{n >= 20 ? "+" : ""}</Tag>}
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 11. EL SUDOR ROJO ─────────────────────────
export const SweatScene: React.FC<{ d: number; mode?: "color" | "shield"; o?: Ov }> = ({ d, mode = "color", o = {} }) => {
  const f = useCurrentFrame();
  const t = mode === "color" ? interpolate(f, [d * 0.15, d * 0.85], [0, 2], clamp) : 1;
  const col = t < 1 ? `rgb(${Math.round(200 + 30 * t)},${Math.round(225 - 175 * t)},${Math.round(235 - 195 * t)})` : `rgb(${Math.round(230 - 110 * (t - 1))},${Math.round(50 + 20 * (t - 1))},${Math.round(40 - 10 * (t - 1))})`;
  return (
    <Push d={d} k={0.06}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #6a4a3e 0%, #3a2620 70%, #1c1210 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(0,0,0,.18) 2px, transparent 3px)", backgroundSize: "34px 30px" }} />
      {Array.from({ length: 34 }).map((_, i) => { const ph = (f / 80 + rnd(i, 3)) % 1; return <div key={i} style={{ position: "absolute", left: rnd(i, 1) * 1880, top: rnd(i, 2) * 760 + ph * 120, width: 26 + rnd(i, 5) * 22, height: 34 + rnd(i, 5) * 28, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: col, opacity: 0.85, boxShadow: `inset -4px -6px 8px rgba(0,0,0,.3), 0 0 12px ${col}` }} />; })}
      {mode === "color" && <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", gap: 80, fontFamily: F, fontWeight: 900, fontSize: 70 }}>
        {[["CLEAR", "#d6eef2"], ["RED", RED], ["BROWN", "#c07a4a"]].map(([w, c], i) => <div key={w} style={{ color: c, opacity: ease(f, d * (0.15 + i * 0.3), d * (0.22 + i * 0.3)), textShadow: "0 3px 12px rgba(0,0,0,.8)" }}>{w}{i < 2 ? " →" : ""}</div>)}
      </div>}
      {mode === "shield" && <>
        <SV>{Array.from({ length: 9 }).map((_, i) => { const y = interpolate(f, [0, d], [-100, 300]) + i * 40; return <line key={i} x1={300 + i * 160} y1={y - 200} x2={300 + i * 160 + 60} y2={Math.min(y, 330)} stroke={GOLD} strokeWidth={8} opacity={0.6} />; })}
          <path d="M100,340 Q960,300 1820,340" stroke={GOLD} strokeWidth={10} fill="none" opacity={ease(f, 10, 20)} />
          {Array.from({ length: 5 }).map((_, i) => { const x = 360 + i * 300, y = 640 + (i % 2) * 80, k = ease(f, d * 0.5 + i * 6, d * 0.58 + i * 6); return <g key={i}><ellipse cx={x} cy={y} rx={60} ry={34} fill="#5dff8a" opacity={0.8} /><path d={`M${x - 70},${y - 50} L${x + 70},${y + 50} M${x + 70},${y - 50} L${x - 70},${y + 50}`} stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={k} /></g>; })}</SV>
        <Tag x={120} y={190} size={58} color={GOLD} op={ease(f, 10, 20)}>natural sunscreen</Tag>
        <Tag x={120} y={880} size={58} color={RED} op={ease(f, d * 0.5, d * 0.6)}>bacteria: blocked</Tag>
      </>}
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 12. EL PRESUPUESTO DE LA CAZA ─────────────────────────
export const BudgetScene: React.FC<{ d: number; mode?: "hunts" | "deal"; o?: Ov }> = ({ d, mode = "hunts", o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.00025})` }}>
        {mode === "hunts" && [0, 1, 2, 3].map((i) => { const t = ease(f, 8 + i * 14, 20 + i * 14), win = i === 2;
          return <div key={i} style={{ position: "absolute", left: 250 + i * 370, top: 420, width: 310, height: 330, borderRadius: 16, background: "linear-gradient(180deg,#24180f,#4a3020)", border: `4px solid ${win ? GOLD : "rgba(255,170,90,.35)"}`, opacity: t, transform: `translateY(${(1 - t) * 50}px)`, fontFamily: F, textAlign: "center" }}>
            <div style={{ height: 180, position: "relative" }}><An k="lioness" x={155} y={170} w={230} rim={win ? GOLD : "#8a6a50"} /></div>
            <div style={{ fontSize: 34, fontWeight: 800, color: INK }}>HUNT {i + 1}</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: win ? GOLD : RED, marginTop: 4 }}>{win ? "✓" : "✗"}</div>
          </div>; })}
        {mode === "hunts" && <Tag x={960} y={180} center size={110} color={ORA} op={ease(f, 60, 70)}>~1 in 4</Tag>}
        {mode === "deal" && ([["ZEBRA", "zebra", GOLD, "GOOD DEAL"], ["HIPPO", "hippo", RED, "TERRIBLE DEAL"]] as [string, CutK, string, string][]).map(([n, k, c, v], i) => { const t = ease(f, 6 + i * 30, 18 + i * 30);
          return <div key={n} style={{ position: "absolute", left: 220 + i * 800, top: 240, width: 680, height: 640, borderRadius: 18, background: "rgba(10,7,5,.6)", border: `4px solid ${c}`, opacity: t, fontFamily: F, textAlign: "center" }}>
            <div style={{ height: 280, position: "relative" }}><An k={k} x={340} y={270} w={k === "hippo" ? 440 : 400} flip={k === "hippo"} rim={c} /></div>
            {["ENERGY", "RISK", "MEAL"].map((b, j) => { const val = k === "hippo" ? [0.95, 1, 0.9][j] : [0.35, 0.2, 0.6][j]; return <div key={b} style={{ display: "flex", alignItems: "center", margin: "14px 40px" }}><div style={{ width: 170, textAlign: "left", fontSize: 30, fontWeight: 800, color: INK }}>{b}</div><div style={{ flex: 1, height: 28, background: "rgba(255,255,255,.1)", borderRadius: 8 }}><div style={{ width: `${val * 100 * ease(f, 20 + i * 30 + j * 6, 40 + i * 30 + j * 6)}%`, height: 28, borderRadius: 8, background: j === 2 ? GOLD : RED }} /></div></div>; })}
            <div style={{ fontSize: 54, fontWeight: 900, color: c, marginTop: 14 }}>{v}</div>
          </div>; })}
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 13. LOS QUE ESPERAN EN CASA ─────────────────────────
export const PrideHome: React.FC<{ d: number; mode?: "cubs" | "takeover" | "risk"; o?: Ov }> = ({ d, mode = "cubs", o = {} }) => {
  const f = useCurrentFrame();
  const males = mode === "takeover" ? ease(f, d * 0.15, d * 0.8) : 0;
  return (
    <Push d={d} k={0.05}>
      <SunsetStage tree="acacia" night={0.5} pan={0.15} horizon={620}>
        <SV><path d="M1200,900 Q1350,600 1600,640 Q1800,600 1960,760 L1960,1080 L1200,1080 Z" fill="#0d1a17" /></SV>
        {[0, 1, 2].map((i) => <An key={i} k="cub" x={1450 + i * 110} y={950 + (i % 2) * 20} w={68} flip={i % 2 === 0} bob={3} rim={ORA} />)}
        <An k="lioness" x={mode === "risk" ? 620 : 800} y={940} w={430} eye={mode === "risk"} bob={1} />
        {mode === "risk" && <div style={{ position: "absolute", left: 300, top: 300, width: 600, height: 280, borderRadius: 140, background: "rgba(250,248,244,.95)", opacity: ease(f, 10, 20), transform: `scale(${0.8 + 0.2 * ease(f, 10, 20)})` }}>
          {[0, 1, 2].map((i) => <An key={i} k="cub" x={130 + i * 90} y={230} w={62} rim="#fff" />)}
          <An k="lioness" x={470} y={240} w={190} rim="#fff" />
        </div>}
        {mode === "takeover" && [0, 1].map((i) => <An key={i} k="lion" x={-250 + males * 750 + i * 220} y={950 + i * 20} w={400} eye rim="#ff6a50" />)}
        {mode === "cubs" && <Tag x={1180} y={560} size={54} color={ORA} op={ease(f, 20, 30)}>waiting back home</Tag>}
        <Grass y={1010} h={110} n={70} color="#0b0f0c" />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── 14. CUÁNDO GANAN: 4 cartas ─────────────────────────
export const WINS = ["THE YOUNG", "THE NIGHT", "THE DROUGHT", "SICK & OLD"];
export const WinCards: React.FC<{ d: number; active?: number; o?: Ov }> = ({ d, active = -1, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 58%, #3a1a14 0%, #0d0605 78%)" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + Math.min(f, 600) * 0.0001})` }}>
        <Tag x={960} y={120} center size={84}>When do lions <span style={{ color: RED }}>WIN?</span></Tag>
        {WINS.map((w, i) => { const t = spring({ frame: f - i * 4, fps: 30, config: { damping: 16 } }), on = i === active, lit = on ? ease(f, 14, 26) : 0, done = i < active;
          return <div key={i} style={{ position: "absolute", left: 170 + i * 410, top: 360 + (1 - t) * 60, width: 360, height: 440, borderRadius: 16, background: "linear-gradient(180deg,#24180f,#4a3020)", border: `4px solid rgba(255,170,90,${0.3 + lit * 0.7})`, opacity: t * (on ? 1 : done ? 0.75 : 0.45), transform: `scale(${1 + lit * 0.08})`, boxShadow: `0 0 ${lit * 60}px rgba(255,150,60,${lit * 0.6})`, fontFamily: F, textAlign: "center" }}>
            <div style={{ marginTop: 26, fontSize: 40, fontWeight: 900, color: on ? ORA : INK }}>#{i + 1}</div>
            <div style={{ height: 210, position: "relative" }}>
              {i === 1 && <div style={{ position: "absolute", left: 260, top: 20, width: 46, height: 46, borderRadius: 23, background: "rgba(200,210,255,.3)" }} />}
              {i === 2 && <div style={{ position: "absolute", left: 30, right: 30, top: 186, height: 16, background: "#6a4a2a", borderRadius: 8 }} />}
              <An k="hippo" x={180} y={200} w={i === 0 ? 170 : 290} flip rim={i === 1 ? "#9fc2ff" : i === 3 ? "#8a6a50" : ORA} rot={i === 3 ? 4 : 0} />
            </div>
            <div style={{ marginTop: 20, fontSize: 38, fontWeight: 900, color: on || done ? INK : "rgba(240,235,229,.6)" }}>{on || done ? w : "?"}</div>
          </div>; })}
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 15. MAPA DE ÁFRICA con pin + sello / puntos ─────────────────────────
const AM = { L: -22, R: 58, T: 38, B: -36, W: 1167, H: 1080, X: 80 };
const ag = (lon: number, lat: number): [number, number] => [AM.X + (lon - AM.L) / (AM.R - AM.L) * AM.W, (AM.T - lat) / (AM.T - AM.B) * AM.H];
export const AfricaPin: React.FC<{ d: number; at: [number, number]; lines: string[]; name: string; hot?: number; area?: boolean }> = ({ d, at, lines, name, hot = 1, area }) => {
  const f = useCurrentFrame();
  const [px, py] = ag(...at);
  const z = 1 + ease(f, 0, d) * 0.35;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 50%, #13304a 0%, #06111c 78%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${px}px ${py}px` }}>
        <Img src={sf("img/t30colmien/map_africa.png")} style={{ position: "absolute", left: AM.X, top: 0, width: AM.W, height: AM.H, opacity: 0.92 }} />
        <SV>
          {area && <ellipse cx={px} cy={py} rx={150 * ease(f, 4, 20)} ry={90 * ease(f, 4, 20)} fill="rgba(241,69,54,.18)" stroke={RED} strokeWidth={4 / z} strokeDasharray="12 8" />}
          {[0, 1].map((k) => { const ph = ((f + k * 22) % 44) / 44; return <circle key={k} cx={px} cy={py} r={(8 + ph * 46) / z} fill="none" stroke={RED} strokeWidth={4 / z} opacity={1 - ph} />; })}
          <circle cx={px} cy={py} r={9 / z} fill={RED} stroke="#fff" strokeWidth={3 / z} opacity={ease(f, 14, 20)} />
          <text x={px + 18 / z} y={py - 16 / z} fontFamily={F} fontWeight={900} fontSize={30 / z} fill="#fff" opacity={ease(f, 18, 26)} style={{ textTransform: "uppercase" }}>{name}</text>
        </SV>
      </AbsoluteFill>
      <Stamp a={10} lines={lines} hot={hot} x={1230} y={360} size={lines.some((l) => l.length > 7) ? 80 : 110} />
    </AbsoluteFill>
  );
};
export const AfricaDots: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const fill = ease(f, 10, d * 0.7);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 50%, #13304a 0%, #06111c 78%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0002})` }}>
        <Img src={sf("img/t30colmien/map_africa.png")} style={{ position: "absolute", left: AM.X, top: 0, width: AM.W, height: AM.H, opacity: 0.92 }} />
        {Array.from({ length: 140 }).map((_, i) => { const [x, y] = ag(-8 + rnd(i, 3) * 44, 12 - rnd(i, 4) * 34); const on = rnd(i, 9) < fill;
          return <div key={i} style={{ position: "absolute", left: x - 4, top: y - 4, width: 8, height: 8, borderRadius: 4, background: "#ff5a2a", opacity: on ? 1 : 0, boxShadow: "0 0 8px #ff5a2a" }} />; })}
      </AbsoluteFill>
      <Tag x={1240} y={390} size={100} color={ORA} op={ease(f, 20, 30)}>HUNDREDS</Tag>
      <Tag x={1245} y={520} size={44} op={ease(f, 40, 50)}>of people, every year</Tag>
      <Tag x={1245} y={580} size={36} op={ease(f, 55, 65)} color="rgba(240,235,229,.7)">(estimates often cited)</Tag>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// la cuenta del león: 1 hipo contra 3 cazadoras
export const MathScale: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const tip = interpolate(spring({ frame: f - 25, fps: 30, config: { damping: 8, mass: 1.3 } }), [0, 1], [-8, 13]) + Math.sin(f / 10) * 0.5;
  return (
    <SunsetStage night={0.65} pan={0.2} tree="acacia">
      <div style={{ position: "absolute", left: 910, top: 760, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "100px solid #2a1c14" }} />
      <div style={{ position: "absolute", left: 360, top: 750, width: 1200, height: 18, borderRadius: 9, background: "#8a5a32", transform: `rotate(${tip}deg)`, transformOrigin: "600px 9px" }}>
        <div style={{ position: "absolute", left: 10, bottom: 18, width: 420, height: 220 }}><An k="hippo" x={210} y={220} w={400} flip rim={GOLD} /></div>
        <div style={{ position: "absolute", right: 10, bottom: 18, width: 480, height: 220 }}>{[0, 1, 2].map((i) => <An key={i} k="lioness" x={90 + i * 150} y={220} w={190} rim={RED} />)}</div>
      </div>
      <Tag x={420} y={300} size={70} color={GOLD}>1 MEAL</Tag><Tag x={1150} y={300} size={70} color={RED}>3 HUNTERS</Tag>
      <Overlays o={o} />
    </SunsetStage>
  );
};
// campana + pregunta (CTA sin link): siluetas que pasan atrás
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0.35 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => <An key={i} k={i % 2 ? "hippo" : "lioness"} x={((i * 420 + f * 2.4) % 2520) - 300} y={1010} w={i % 2 ? 360 : 300} flip={i % 2 === 1} />)}
      </div>
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 160, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 200, right: 200, top: bell ? 470 : 380, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 72, color: INK, lineHeight: 1.15, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
