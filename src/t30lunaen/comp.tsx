// t30lunaen — "At 3:17 AM Tonight the Moon Vanishes — Your Next 72 Hours". Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble siguen el patrón de src/btgm1/M1.tsx (copiados acá).
// Todo lo ilustrado es SVG/CSS; lo real = NASA/NOAA/Commons PD/CC + fotos/clips agnes sin cara.
// Pieza ancla: el RELOJ que arranca en 3:17 AM y salta a cada hora (ClockCard + Hud con T+), y el tablero final de 72 h (Board72).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, Person, SunsetStage, Stamp, ease } from "../kits/btg/kit";

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
export const RealShot: React.FC<{ v: string; d: number; z?: [number, number]; from?: number; pos?: string; o?: Ov; rate?: number }> = ({ v, d, z = [1.03, 1.09], from = 0, pos = "50% 50%", o = {}, rate = 1 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, Math.max(d, 2)], z, clamp);
  const vid = v.endsWith(".mp4");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, filter: "saturate(.82)" }}>
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

// ───────────────────────── piezas comunes del mundo (Tierra, Luna, cielo) ─────────────────────────
const Push: React.FC<{ d: number; k?: number; ox?: string; children: React.ReactNode }> = ({ d, k = 0.05, ox = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1 + k], clamp)})`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
// cielo de noche: estrellas que titilan (más con luna apagada) + Vía Láctea opcional
export const Stars: React.FC<{ n?: number; k?: number; h?: number; milky?: number; seed?: number }> = ({ n = 140, k = 1, h = 1080, milky = 0, seed = 3 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {milky > 0 && <div style={{ position: "absolute", left: -300, top: h * 0.1, width: 2600, height: 260, transform: "rotate(-24deg)", background: "radial-gradient(ellipse at 50% 50%, rgba(200,210,255,.32) 0%, rgba(170,150,220,.14) 40%, transparent 70%)", opacity: milky, filter: "blur(8px)" }} />}
      {Array.from({ length: n }).map((_, i) => {
        const big = rnd(i, seed + 9) > 0.93;
        return <div key={i} style={{ position: "absolute", left: rnd(i, seed) * 1920, top: rnd(i, seed + 1) * h, width: big ? 4 : 2, height: big ? 4 : 2, borderRadius: 2, background: "#fff", opacity: k * (0.25 + 0.75 * Math.abs(Math.sin(f / (14 + rnd(i, 5) * 20) + i))) }} />;
      })}
    </>
  );
};
export const MoonDisc: React.FC<{ x: number; y: number; r: number; o?: number; glow?: number }> = ({ x, y, r, o = 1, glow = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: o }}>
    <div style={{ position: "absolute", inset: -r * 0.8, borderRadius: "50%", background: `radial-gradient(circle, rgba(220,230,255,${0.32 * glow}) 0%, rgba(160,180,230,${0.1 * glow}) 45%, transparent 70%)` }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%, #fbfaf4 0%, #dcdccf 55%, #a9aa9e 100%)", boxShadow: "inset -10px -12px 30px rgba(0,0,0,.25)" }} />
    {[[0.32, 0.4, 0.16], [0.6, 0.3, 0.1], [0.55, 0.64, 0.19], [0.28, 0.7, 0.08], [0.72, 0.55, 0.07]].map(([cx, cy, cr], i) => (
      <div key={i} style={{ position: "absolute", left: (cx - cr) * r * 2, top: (cy - cr) * r * 2, width: cr * r * 4, height: cr * r * 4, borderRadius: "50%", background: "rgba(140,140,130,.38)" }} />
    ))}
  </div>
);
// la Tierra vista de arriba/de costado: océano + continentes que giran (clip circular)
export const EarthDisc: React.FC<{ x: number; y: number; r: number; spin?: number; dim?: number }> = ({ x, y, r, spin = 0.6, dim = 0 }) => {
  const f = useCurrentFrame();
  const off = ((f * spin) % 1000) / 1000;
  const blobs = [[0.05, 0.3, 0.22, 0.3], [0.32, 0.55, 0.16, 0.26], [0.5, 0.25, 0.26, 0.2], [0.7, 0.6, 0.14, 0.22], [0.85, 0.35, 0.2, 0.16]];
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 36% 32%, #3d8fd1 0%, #1d5c9a 55%, #0d2c52 100%)", boxShadow: `0 0 ${r * 0.25}px rgba(90,170,255,.35)` }}>
      {[0, 1].map((k) => blobs.map(([bx, by, bw, bh], i) => (
        <div key={k + "_" + i} style={{ position: "absolute", left: ((bx + k - off) * 2 - 0.5) * r * 2 / 1.0 * 0.5, top: by * r * 2, width: bw * r * 2, height: bh * r * 2, borderRadius: "46% 54% 40% 60%", background: "#3f8a4a", opacity: 0.9 }} />
      )))}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 70% 70%, transparent 40%, rgba(0,0,10,.55) 100%)" }} />
      {dim > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${dim})` }} />}
    </div>
  );
};
const SpaceBg: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint = "#0d1d33" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${tint} 0%, #03070e 78%)`, overflow: "hidden" }}><Stars n={120} k={0.7} />{children}</AbsoluteFill>
);
// tejados de barrio (con antenas) — el "afuera de tu ventana"
const Roofs: React.FC<{ base: number; seed?: number; color?: string; drift?: number; lit?: number }> = ({ base, seed = 1, color = "#0e161e", drift = 0, lit = 0 }) => {
  const f = useCurrentFrame();
  const els: React.ReactNode[] = [];
  for (let i = 0, x = -150; x < 2200; i++) {
    const w = 170 + rnd(i, seed) * 170, h = 80 + rnd(i, seed + 2) * 110;
    els.push(<path key={"r" + i} d={`M${x},${base} L${x},${base - h} L${x + w * 0.5},${base - h - 70} L${x + w},${base - h} L${x + w},${base} Z`} fill={color} />);
    if (rnd(i, seed + 3) > 0.45) els.push(<path key={"a" + i} d={`M${x + w * 0.62},${base - h - 40} l0,-60 m-24,14 l48,0 m-38,14 l28,0`} stroke={color} strokeWidth={4} />);
    if (lit > 0 && rnd(i, seed + 6) > 0.6) els.push(<rect key={"w" + i} x={x + w * 0.3} y={base - h * 0.6} width={24} height={30} fill="#ffcf7a" opacity={lit * (0.6 + 0.4 * Math.sin(f / 30 + i))} />);
    x += w + 10 + rnd(i, seed + 5) * 40;
  }
  return <svg width={2400} height={1080} style={{ position: "absolute", left: drift, top: 0 }}>{els}</svg>;
};

// ───────────────────────── PIEZA ANCLA: el RELOJ desde 3:17 AM ─────────────────────────
// minutos desde las 3:17 → "3:18 AM" y "T+ 00:01"
export const clockOf = (m: number) => { const t = (3 * 60 + 17 + Math.floor(m)) % 1440; const h = Math.floor(t / 60), mm = t % 60; return `${h % 12 === 0 ? 12 : h % 12}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
export const tplus = (m: number) => { m = Math.max(0, Math.floor(m)); return `T+ ${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
export const HOURS = [
  { m: 0, t: "3:17 AM", s: "MOON GONE" }, { m: 1, t: "3:18 AM", s: "you sleep" }, { m: 13, t: "3:30 AM", s: "laser" }, { m: 43, t: "4 AM", s: "wobble" },
  { m: 103, t: "5 AM", s: "tides" }, { m: 193, t: "6:30 AM", s: "sunrise" }, { m: 343, t: "9 AM", s: "high tide" }, { m: 523, t: "NOON", s: "power" },
  { m: 883, t: "6 PM", s: "first night" }, { m: 1440, t: "24 H", s: "no eclipses" }, { m: 2160, t: "36 H", s: "reefs" }, { m: 2880, t: "48 H", s: "ports" }, { m: 4320, t: "72 H", s: "3 days" },
];
// reloj grande: las agujas corren de `from` a `to` (minutos) y frenan; T+ cuenta; abajo la vía de las 13 horas (la actual se prende)
export const ClockCard: React.FC<{ d: number; from: number; to: number; idx: number; title: string; sub?: string; far?: boolean }> = ({ d, from, to, idx, title, sub, far }) => {
  const f = useCurrentFrame();
  const L0 = Math.min(40, Math.round(d * 0.45));   // en relojes cortos (1 s) la aguja y el título caen antes
  const p = ease(f, 2, L0), m = from + (to - from) * p;
  const hA = ((m + 197) / 720) * 360, mA = ((m + 17) / 60) * 360;
  const push = interpolate(f, [0, d], [1, 1.04], clamp), land = ease(f, L0, L0 + 6);
  const H = (x: number, L: number, w: number, c: string) => <line x1={0} y1={0} x2={Math.sin(x * Math.PI / 180) * L} y2={-Math.cos(x * Math.PI / 180) * L} stroke={c} strokeWidth={w} strokeLinecap="round" />;
  const yrs = Math.round(interpolate(p, [0, 1], [0, 10000000]));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 120%, #1c3a5e 0%, #0a1626 48%, #03060c 85%)", overflow: "hidden" }}>
      <Stars n={150} k={0.8} h={760} />
      {/* la Tierra asoma abajo, la luna fantasma (contorno punteado) donde estaba */}
      <div style={{ position: "absolute", left: -400, top: 940, width: 2720, height: 1400, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 0%, #2c6aa6 0%, #0f2d50 30%, #050c18 60%)", boxShadow: "0 -20px 80px rgba(80,160,255,.35)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={1610} cy={190} r={70} fill="none" stroke="rgba(240,235,229,.28)" strokeWidth={3} strokeDasharray="8 10" transform={`rotate(${f * 0.4} 1610 190)`} /></svg>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(560,500)">
            <circle r={300} fill="#f2ede4" stroke={land > 0.5 ? RED : "#c9c2b6"} strokeWidth={18} />
            <circle r={300 + land * 50} fill="none" stroke={RED} strokeWidth={5} opacity={(1 - land) * (land > 0 ? 0.9 : 0)} />
            {Array.from({ length: 60 }).map((_, i) => { const a = (i / 60) * Math.PI * 2, L = i % 5 ? 14 : 34; return <line key={i} x1={Math.sin(a) * 272} y1={-Math.cos(a) * 272} x2={Math.sin(a) * (272 - L)} y2={-Math.cos(a) * (272 - L)} stroke="#2a2420" strokeWidth={i % 5 ? 3 : 7} />; })}
            {[12, 3, 6, 9].map((n, i) => <text key={n} x={Math.sin(i * Math.PI / 2) * 200} y={-Math.cos(i * Math.PI / 2) * 200 + 22} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#2a2420">{n}</text>)}
            {H(hA, 150, 16, "#2a2420")}{H(mA, 236, 9, far ? RED : "#2a2420")}
            <circle r={18} fill={RED} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 980, top: 230, fontFamily: F, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: "rgba(240,235,229,.6)" }}>{far ? "THE FAR FUTURE" : idx === 0 ? "THE MOON VANISHES" : "SINCE THE MOON VANISHED"}</div>
        <div style={{ position: "absolute", left: 975, top: 290, fontFamily: F, fontWeight: 900, fontSize: 92, color: ORA, fontVariantNumeric: "tabular-nums" }}>{far ? `T+ ${yrs.toLocaleString("en-US")}` : tplus(m)}{far && <span style={{ fontSize: 50 }}> YRS</span>}</div>
        <div style={{ position: "absolute", left: 970, top: 400, fontFamily: F, fontWeight: 900, fontSize: title.length > 9 ? 100 : title.length > 5 ? 128 : 170, lineHeight: 1, whiteSpace: "nowrap", color: INK, opacity: land, transform: `scale(${1.15 - 0.15 * land})`, transformOrigin: "left center", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{title}</div>
        {sub && <div style={{ position: "absolute", left: 980, top: 590, width: 860, fontFamily: F, fontWeight: 700, fontSize: 50, color: INK, opacity: ease(f, L0 + 10, L0 + 20) }}>{sub}</div>}
      </AbsoluteFill>
      {/* la vía de las 72 h */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 905, height: 4, background: "rgba(240,235,229,.22)" }} />
      <div style={{ position: "absolute", left: 120, top: 905, height: 4, width: (1680 * Math.max(0, idx - 1 + (idx ? land : 0))) / 12, background: RED, boxShadow: `0 0 12px ${RED}` }} />
      {HOURS.map((h, i) => { const on = i === idx && !far, seen = i < idx || far; const x = 120 + (1680 * i) / 12;
        return <div key={i} style={{ position: "absolute", left: x - 70, top: 878, width: 140, textAlign: "center", fontFamily: F }}>
          <div style={{ margin: "0 auto", width: on ? 34 : 22, height: on ? 34 : 22, marginTop: on ? 12 : 18, borderRadius: "50%", background: on ? ORA : seen ? RED : "#2a3342", border: "3px solid #0a1626", boxShadow: on ? `0 0 ${20 + 10 * Math.sin(f / 5)}px ${ORA}` : "none" }} />
          <div style={{ marginTop: 10, fontSize: 24, fontWeight: 900, color: on ? ORA : seen ? INK : "rgba(240,235,229,.4)" }}>{h.t}</div>
        </div>; })}
    </AbsoluteFill>
  );
};
// HUD chico arriba a la derecha: la hora del mundo y T+ (corre despacio dentro de cada tramo)
export const Hud: React.FC<{ m0: number; m1: number; d: number; hide?: number[][] }> = ({ m0, m1, d, hide = [] }) => {
  const f = useCurrentFrame();
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const m = m0 + (m1 - m0) * Math.min(1, f / Math.max(d, 1)) * 0.92, inn = ease(f, 0, 10);
  return (
    <div style={{ position: "absolute", right: 44, top: 38, opacity: inn * 0.95, display: "flex", alignItems: "center", gap: 14, padding: "10px 18px 10px 14px", borderRadius: 14, background: "rgba(6,10,18,.66)", border: "2px solid rgba(240,235,229,.22)", fontFamily: F }}>
      <svg width={44} height={44} viewBox="0 0 44 44"><circle cx={22} cy={22} r={18} fill="none" stroke={INK} strokeWidth={3.5} />
        <line x1={22} y1={22} x2={22 + 10 * Math.sin(((m + 197) / 720) * Math.PI * 2)} y2={22 - 10 * Math.cos(((m + 197) / 720) * Math.PI * 2)} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={22} y1={22} x2={22 + 14 * Math.sin(((m + 17) / 60) * Math.PI * 2)} y2={22 - 14 * Math.cos(((m + 17) / 60) * Math.PI * 2)} stroke={ORA} strokeWidth={2.5} strokeLinecap="round" /></svg>
      <div>
        <div style={{ fontSize: 30, fontWeight: 900, color: INK, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{clockOf(m)}</div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: ORA, fontVariantNumeric: "tabular-nums" }}>{tplus(m)}</div>
      </div>
    </div>
  );
};

// ───────────────────────── escenas ilustradas (siempre algo se mueve) ─────────────────────────
// 1. tu cuarto en corte: ventana con la luna sobre los techos, vos en la cama, despertador 3:17. mode gone = la luna se borra en `at`
export const Bedroom: React.FC<{ d: number; mode?: "moon" | "gone" | "window"; at?: number; o?: Ov }> = ({ d, mode = "moon", at = 40, o = {} }) => {
  const f = useCurrentFrame();
  const gone = mode === "window" ? 1 : mode === "gone" ? ease(f, at, at + 2) : 0;
  const breathe = Math.sin(f / 22) * 4;
  return (
    <Push d={d} k={0.06} ox="62% 40%">
      <AbsoluteFill style={{ background: "#0d1420" }}>
        {/* la ventana */}
        <div style={{ position: "absolute", left: 980, top: 130, width: 760, height: 560, overflow: "hidden", border: "18px solid #2a2f3a", background: "linear-gradient(180deg,#0a1830 0%,#16294a 70%,#203a5e 100%)" }}>
          <Stars n={70} k={0.35 + gone * 0.65} h={420} seed={7} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 560 }}><MoonDisc x={470} y={170} r={78} o={1 - gone} /></div>
          {gone > 0 && gone < 1 && <div style={{ position: "absolute", left: 392, top: 92, width: 156, height: 156, borderRadius: "50%", boxShadow: "0 0 40px 10px rgba(255,255,255,.3)" }} />}
          <div style={{ position: "absolute", left: -980, top: -130 }}><Roofs base={690} seed={4} color="#070c14" drift={-60 - f * 0.15} lit={0.4} /></div>
          <div style={{ position: "absolute", left: 362, top: 0, width: 18, height: 560, background: "#2a2f3a" }} /><div style={{ position: "absolute", left: 0, top: 262, width: 760, height: 14, background: "#2a2f3a" }} />
        </div>
        {/* cortinas que se mueven */}
        <div style={{ position: "absolute", left: 930, top: 110, width: 150, height: 640, background: "linear-gradient(90deg,#3b3550,#2a2540)", borderRadius: "0 0 40px 0", transform: `skewX(${Math.sin(f / 26) * 3}deg)`, transformOrigin: "top" }} />
        <div style={{ position: "absolute", left: 1650, top: 110, width: 150, height: 640, background: "linear-gradient(90deg,#2a2540,#3b3550)", borderRadius: "0 0 0 40px", transform: `skewX(${-Math.sin(f / 30) * 3}deg)`, transformOrigin: "top" }} />
        {/* luz de luna en el piso (se apaga con la luna) */}
        <div style={{ position: "absolute", left: 360, top: 700, width: 1100, height: 380, background: "linear-gradient(160deg, rgba(190,210,255,.22), transparent 70%)", clipPath: "polygon(55% 0, 100% 0, 70% 100%, 0 100%)", opacity: 1 - gone }} />
        {/* la cama con vos durmiendo */}
        <div style={{ position: "absolute", left: 120, top: 700, width: 900, height: 120, background: "#4a3a5a", borderRadius: 18 }} />
        <div style={{ position: "absolute", left: 120, top: 800, width: 900, height: 160, background: "#2a2236" }} />
        <div style={{ position: "absolute", left: 150, top: 640, width: 200, height: 90, background: "#e8e2f0", borderRadius: 40 }} />
        <div style={{ position: "absolute", left: 240, top: 600, width: 90, height: 90, borderRadius: "50%", background: "#f2c49b" }} />
        <div style={{ position: "absolute", left: 230, top: 592, width: 104, height: 50, borderRadius: "50px 50px 10px 10px", background: "#5a3a22" }} />
        <div style={{ position: "absolute", left: 300, top: 650 - breathe, width: 700, height: 110 + breathe, background: C.vest, borderRadius: "60px 30px 20px 20px" }} />
        <div style={{ position: "absolute", left: 300 + ((f / 40) % 1) * 30, top: 540 - ((f / 40) % 1) * 60, fontFamily: F, fontWeight: 900, fontSize: 44, color: "rgba(240,235,229,.6)", opacity: 1 - ((f / 40) % 1) }}>z</div>
        {/* mesa de luz + despertador */}
        <div style={{ position: "absolute", left: 40, top: 760, width: 120, height: 200, background: "#3a2a1f" }} />
        <div style={{ position: "absolute", left: 46, top: 700, width: 112, height: 62, borderRadius: 10, background: "#111", border: "3px solid #333", fontFamily: F, fontWeight: 900, fontSize: 38, color: "#ff3b30", textAlign: "center", lineHeight: "56px", textShadow: "0 0 12px #ff3b30" }}>3:17</div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 2. la luna sobre los techos que desaparece "en menos que un latido": queda un parche negro con estrellas
export const MoonVanish: React.FC<{ d: number; at?: number; o?: Ov; sea?: boolean }> = ({ d, at = 30, o = {}, sea }) => {
  const f = useCurrentFrame();
  const g = ease(f, at, at + 2), flick = f >= at && f < at + 3 ? 0.25 : 0;
  return (
    <Push d={d} k={0.07} ox="60% 30%">
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #071226 0%, #0f2240 60%, ${sea ? "#0a1a2a" : "#16294a"} 100%)` }}>
        <Stars n={170} k={0.3 + g * 0.7} h={760} seed={11} />
        <MoonDisc x={1180} y={280} r={120} o={1 - g} />
        <div style={{ position: "absolute", left: 1180 - 120, top: 160, width: 240, height: 240, borderRadius: "50%", border: `3px dashed rgba(240,235,229,${g * 0.35})` }} />
        {sea ? (
          <AbsoluteFill style={{ top: 700, background: "linear-gradient(180deg,#0d2238,#050d18)" }}>
            {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 240 - f * 1.4) % 2200) - 150, top: 20 + i * 34, width: 180 + rnd(i, 2) * 200, height: 3, borderRadius: 2, background: `rgba(200,220,255,${0.22 * (1 - g) + 0.05})` }} />)}
          </AbsoluteFill>
        ) : <Roofs base={1080} seed={2} color="#05090f" drift={-40 - f * 0.2} lit={0.5} />}
        <AbsoluteFill style={{ background: `rgba(255,255,255,${flick})` }} />
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 3. "la Luna es una mano": la luna tira del océano (líneas de tirón) y en `at` suelta
export const HandPull: React.FC<{ d: number; at?: number; o?: Ov }> = ({ d, at = 9999, o = {} }) => {
  const f = useCurrentFrame();
  const let_ = ease(f, at, at + 10), pull = 1 - let_;
  const bulge = 1 + 0.18 * pull * (0.9 + 0.1 * Math.sin(f / 10));
  return (
    <SpaceBg>
      <Push d={d} k={0.04}>
        <div style={{ position: "absolute", left: 520 - 300 * bulge, top: 560 - 300, width: 600 * bulge, height: 600, borderRadius: "50%", background: "rgba(70,150,230,.45)", filter: "blur(2px)" }} />
        <EarthDisc x={520} y={560} r={270} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 9 }).map((_, i) => { const y0 = 380 + i * 45, sag = let_ * (120 + i * 15); const ph = ((f + i * 6) % 30) / 30;
            return <g key={i}><path d={`M${800 + 40 * bulge},${y0} Q1150,${560 + sag} 1440,${520 + (i - 4) * 14 + sag * 1.6}`} fill="none" stroke={`rgba(160,210,255,${0.55 * pull + 0.05})`} strokeWidth={3} strokeDasharray="10 12" strokeDashoffset={-f * 2} />
              {pull > 0.3 && <circle cx={800 + 640 * ph} cy={y0 + (520 - y0) * ph} r={5} fill="#a8d8ff" opacity={pull * (1 - ph)} />}</g>; })}
        </svg>
        <MoonDisc x={1540} y={520} r={110} o={1 - let_} />
        {let_ > 0 && <div style={{ position: "absolute", left: 1420, top: 400, width: 240, height: 240, borderRadius: "50%", border: `3px dashed rgba(240,235,229,${0.4 * let_})` }} />}
      </Push>
      <Overlays o={o} />
    </SpaceBg>
  );
};
// 4. tu peso: vos en la balanza junto a la ventana, la aguja quieta aunque la luna se vaya
export const ScaleScene: React.FC<{ d: number; at?: number; o?: Ov }> = ({ d, at = 30, o = {} }) => {
  const f = useCurrentFrame();
  const g = ease(f, at, at + 2), jit = Math.sin(f / 3) * 0.4;
  return (
    <Push d={d} k={0.05} ox="45% 60%">
      <AbsoluteFill style={{ background: "#111a26" }}>
        <div style={{ position: "absolute", left: 1220, top: 140, width: 520, height: 420, overflow: "hidden", border: "16px solid #2a2f3a", background: "linear-gradient(180deg,#0a1830,#203a5e)" }}>
          <Stars n={50} k={0.3 + g * 0.6} h={400} /><MoonDisc x={260} y={150} r={60} o={1 - g} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "repeating-linear-gradient(90deg,#2a3340 0 118px,#232b36 118px 120px)" }} />
        <div style={{ position: "absolute", left: 560, top: 830, width: 300, height: 60, borderRadius: 16, background: "#d9dde3" }} />
        <div style={{ position: "absolute", left: 650, top: 840, width: 120, height: 36, borderRadius: 8, background: "#1a1f26", fontFamily: F, fontWeight: 900, fontSize: 26, color: "#7dff9a", textAlign: "center", lineHeight: "36px" }}>{(72.4 + jit * 0.001).toFixed(1)} kg</div>
        <Person x={710} y={836} s={1.6} />
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 5. el campo de la granja: plateado con luna → negro sin luna (luz ÷100), salen las estrellas y la Vía Láctea
export const FarmSky: React.FC<{ d: number; at?: number; mode?: "moon" | "drop" | "stars"; o?: Ov }> = ({ d, at = 20, mode = "drop", o = {} }) => {
  const f = useCurrentFrame();
  const g = mode === "moon" ? 0 : mode === "stars" ? 1 : ease(f, at, at + 30);
  const lux = 1 - g * 0.97, milky = mode === "stars" ? ease(f, 6, 60) : g * 0.4;
  return (
    <Push d={d} k={0.05} ox="50% 40%">
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgb(${8 + 20 * lux},${18 + 40 * lux},${40 + 70 * lux}) 0%, rgb(${12 + 40 * lux},${24 + 60 * lux},${50 + 80 * lux}) 62%)` }}>
        <Stars n={220} k={0.15 + g * 0.85} h={640} seed={21} milky={milky} />
        <MoonDisc x={1500} y={190} r={66} o={lux > 0.05 ? lux : 0} glow={1.4} />
        {/* campo + casa + cerca + sombra que se apaga */}
        <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, background: `linear-gradient(180deg, rgb(${30 + 120 * lux},${34 + 130 * lux},${44 + 140 * lux}) 0%, rgb(${10 + 50 * lux},${12 + 56 * lux},${18 + 70 * lux}) 100%)` }} />
        {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 52 + Math.sin(f / 18 + i) * 3, top: 650 + (i % 4) * 9, width: 3, height: 40, background: `rgba(${200 * lux + 20},${200 * lux + 20},${170 * lux + 20},.6)`, transform: `rotate(${Math.sin(f / 20 + i / 3) * 6}deg)` }} />)}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M280,640 L280,470 L420,380 L560,470 L560,640 Z" fill={`rgb(${40 + 180 * lux},${42 + 180 * lux},${50 + 180 * lux})`} />
          <rect x={330} y={520} width={60} height={60} fill="#ffcf7a" opacity={0.9} /><rect x={450} y={540} width={50} height={100} fill="#2a2a30" />
          <path d="M600,700 L1900,700 M600,760 L1900,760" stroke="#3a3530" strokeWidth={6} />
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={620 + i * 92} y={680} width={10} height={110} fill="#3a3530" />)}
          {Array.from({ length: 14 }).map((_, i) => <rect key={"s" + i} x={620 + i * 92} y={790} width={12} height={170} fill="rgba(0,0,0,.4)" transform="translate(0,790) skewX(38) translate(0,-790)" opacity={lux} />)}
        </svg>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 6. el láser al retrorreflector: los pulsos suben y vuelven; mode lost = sube y no vuelve nada
export const LaserScene: React.FC<{ d: number; mode?: "echo" | "lost"; o?: Ov }> = ({ d, mode = "echo", o = {} }) => {
  const f = useCurrentFrame();
  const lost = mode === "lost";
  const P = 50, ph = (f % P) / P, cyc = Math.floor(f / P);
  const up = Math.min(1, ph * 2), dn = Math.max(0, ph * 2 - 1);
  const ox = 520, oy = 760, mx = 1560, my = 170;
  return (
    <Push d={d} k={0.05} ox="40% 70%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#040a16 0%,#0b1a30 70%,#132a44 100%)" }}>
        <Stars n={160} k={0.8} h={700} seed={5} />
        {!lost && <MoonDisc x={mx} y={my} r={95} />}
        {lost && <div style={{ position: "absolute", left: mx - 95, top: my - 95, width: 190, height: 190, borderRadius: "50%", border: "3px dashed rgba(240,235,229,.3)" }} />}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={ox} y1={oy} x2={ox + (mx - ox) * up} y2={oy + (my - oy) * up} stroke="#3dff7a" strokeWidth={5} opacity={0.85} style={{ filter: "drop-shadow(0 0 8px #3dff7a)" }} />
          {lost && up >= 1 && <line x1={mx} y1={my} x2={mx + 200} y2={my - 120} stroke="#3dff7a" strokeWidth={4} opacity={0.6} />}
          {!lost && dn > 0 && <circle cx={mx + (ox - mx) * dn} cy={my + (oy - my) * dn} r={9} fill="#c8ffd8" style={{ filter: "drop-shadow(0 0 10px #3dff7a)" }} />}
          <path d="M0,820 Q400,700 760,790 T1920,760 L1920,1080 L0,1080 Z" fill="#070d16" />
          <path d={`M${ox - 110},${oy + 60} L${ox - 110},${oy} A110,110 0 0 1 ${ox + 110},${oy} L${ox + 110},${oy + 60} Z`} fill="#c9ced6" />
          <path d={`M${ox - 18},${oy - 108} L${ox + 18},${oy - 108} L${ox + 18},${oy} L${ox - 18},${oy} Z`} fill="#0b1a30" transform={`rotate(38 ${ox} ${oy})`} />
        </svg>
        {/* lectura */}
        <div style={{ position: "absolute", left: 120, top: 120, padding: "18px 26px", borderRadius: 12, background: "rgba(5,12,22,.8)", border: `2px solid ${lost ? RED : "#3dff7a"}`, fontFamily: F, fontWeight: 900, color: lost ? RED : "#7dffa8", fontSize: 40, fontVariantNumeric: "tabular-nums" }}>
          <div style={{ fontSize: 20, letterSpacing: 4, color: "rgba(240,235,229,.6)" }}>LUNAR LASER RANGING · SHOT {1200 + cyc}</div>
          {lost ? (ph < 0.5 ? "waiting…" : "NO RETURN") : `${(384400 + Math.sin(cyc) * 3.217).toFixed(3)} km`}
        </div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 7. satélites con el tironcito de la luna (flechas) → sin luna: "recalculating"
export const Orbits: React.FC<{ d: number; at?: number; o?: Ov }> = ({ d, at = 9999, o = {} }) => {
  const f = useCurrentFrame();
  const g = ease(f, at, at + 12);
  const R = [230, 300, 380, 450];
  return (
    <SpaceBg>
      <Push d={d} k={0.04}>
        <EarthDisc x={760} y={540} r={170} spin={0.3} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {R.map((r, i) => { const a = f / (40 + i * 18) + i * 1.7, ry = r * (0.45 + i * 0.07), sx = 760 + Math.cos(a) * r, sy = 540 + Math.sin(a) * ry;
            return <g key={i}><ellipse cx={760} cy={540} rx={r} ry={ry} fill="none" stroke="rgba(240,235,229,.22)" strokeWidth={2} transform={`rotate(${i * 12 - 10} 760 540)`} />
              <g transform={`rotate(${i * 12 - 10} 760 540)`}><rect x={sx - 14} y={sy - 8} width={28} height={16} fill="#e9e4da" /><rect x={sx - 40} y={sy - 4} width={22} height={8} fill="#4fa3ff" /><rect x={sx + 18} y={sy - 4} width={22} height={8} fill="#4fa3ff" />
                {g < 1 && <path d={`M${sx + 20},${sy} l${70 * (1 - g)},0 m-14,-10 l14,10 l-14,10`} stroke={ORA} strokeWidth={4} fill="none" opacity={1 - g} />}
                {g > 0.5 && <text x={sx + 30} y={sy - 18} fontFamily={F} fontWeight={800} fontSize={20} fill={RED} opacity={g * (0.6 + 0.4 * Math.sin(f / 4 + i))}>recalculating…</text>}</g></g>; })}
        </svg>
        <MoonDisc x={1700} y={540} r={70} o={1 - g} />
      </Push>
      <Overlays o={o} />
    </SpaceBg>
  );
};
// 8. el baricentro: Tierra y Luna giran alrededor de un punto DENTRO de la Tierra (~3/4 del radio). mode stop = la luna se va y el bamboleo para
export const Barycenter: React.FC<{ d: number; mode?: "show" | "stop"; at?: number; o?: Ov }> = ({ d, mode = "show", at = 40, o = {} }) => {
  const f = useCurrentFrame();
  const R = 230, bx = 860, by = 540, off = R * 0.73;
  const stopF = mode === "stop" ? at : 99999;
  const fa = Math.min(f, stopF), a = fa / 34;
  const ex = bx - Math.cos(a) * off, ey = by - Math.sin(a) * off * 0.55;
  const mx = bx + Math.cos(a) * 760, my = by + Math.sin(a) * 760 * 0.55;
  const gone = mode === "stop" ? ease(f, at, at + 2) : 0;
  const trail: string[] = []; for (let k = 0; k <= 60; k++) { const aa = (fa - k * 2) / 34; trail.push(`${bx - Math.cos(aa) * off},${by - Math.sin(aa) * off * 0.55}`); }
  return (
    <SpaceBg>
      <Push d={d} k={0.04}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={bx} cy={by} rx={760} ry={418} fill="none" stroke="rgba(240,235,229,.15)" strokeWidth={2} strokeDasharray="6 10" opacity={1 - gone} />
          <polyline points={trail.join(" ")} fill="none" stroke={ORA} strokeWidth={4} opacity={0.6 * (1 - gone)} />
        </svg>
        <EarthDisc x={ex} y={ey} r={R} spin={0.4} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g opacity={1 - gone * 0.6}><line x1={bx - 22} y1={by - 22} x2={bx + 22} y2={by + 22} stroke={RED} strokeWidth={7} /><line x1={bx + 22} y1={by - 22} x2={bx - 22} y2={by + 22} stroke={RED} strokeWidth={7} />
            <circle cx={bx} cy={by} r={34 + 6 * Math.sin(f / 6)} fill="none" stroke={RED} strokeWidth={3} /></g>
          <text x={bx + 46} y={by + 70} fontFamily={F} fontWeight={800} fontSize={30} fill={INK} opacity={ease(f, 20, 30) * (1 - gone)}>balance point</text>
        </svg>
        <MoonDisc x={mx} y={my} r={62} o={1 - gone} />
        {mode === "stop" && f > at && <div style={{ position: "absolute", left: ex + R + 30, top: ey - 30, fontFamily: F, fontWeight: 900, fontSize: 40, color: ORA, opacity: ease(f, at + 10, at + 20) }}>→ on its own</div>}
      </Push>
      <Overlays o={o} />
    </SpaceBg>
  );
};
// 9. las dos protuberancias de marea; la Tierra gira debajo (tu costa pasa por pleamar/bajamar). mode: two | sun | vanish (se achican a ~1/3)
export const Tides: React.FC<{ d: number; mode?: "two" | "spin" | "sun" | "vanish"; at?: number; o?: Ov }> = ({ d, mode = "two", at = 30, o = {} }) => {
  const f = useCurrentFrame();
  const shrink = mode === "vanish" ? ease(f, at, at + 90) : 0, moonO = mode === "vanish" ? 1 - ease(f, at, at + 2) : mode === "sun" ? 0.85 : 1;
  const bul = (mode === "sun" ? 1 : 1 - shrink * 0.67) * (1 + 0.02 * Math.sin(f / 9));
  const cx = 820, cy = 560, R = 250, B = 95 * bul;
  const ang = f * 0.9, coast = (ang * Math.PI) / 180, kx = cx + Math.cos(coast) * (R + 4), ky = cy + Math.sin(coast) * (R + 4);
  const high = Math.abs(Math.cos(coast)) > 0.8;
  return (
    <SpaceBg>
      <Push d={d} k={0.04}>
        <div style={{ position: "absolute", left: cx - R - B, top: cy - R - B * 0.15, width: (R + B) * 2, height: (R + B * 0.15) * 2, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(80,170,255,.6) 60%, rgba(80,170,255,.15) 100%)" }} />
        <EarthDisc x={cx} y={cy} r={R} spin={0.9} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {(mode === "spin" || mode === "two") && <g><circle cx={kx} cy={ky} r={14} fill={high ? ORA : INK} stroke="#000" strokeWidth={3} /><text x={kx + (Math.cos(coast) > 0 ? 24 : -150)} y={ky - 18} fontFamily={F} fontWeight={900} fontSize={30} fill={high ? ORA : INK}>{high ? "HIGH TIDE" : "your coast"}</text></g>}
          {mode === "two" && <g opacity={ease(f, 20, 30)}><text x={cx + R + B + 20} y={cy - 40} fontFamily={F} fontWeight={900} fontSize={34} fill={INK}>bulge 1</text><text x={cx - R - B - 190} y={cy - 40} fontFamily={F} fontWeight={900} fontSize={34} fill={INK}>bulge 2</text></g>}
        </svg>
        <MoonDisc x={1640} y={560} r={80} o={moonO} />
        {mode === "sun" && <>
          <div style={{ position: "absolute", left: 1460, top: 120, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,#fff3c4 0%,#ffcb5a 40%,rgba(255,150,40,0) 72%)" }} />
          {[["MOON", 1, "#dcdccf"], ["SUN", 0.46, "#ffcb5a"]].map(([n, v, c]: any, i) => <div key={n} style={{ position: "absolute", left: 120, top: 820 + i * 80, fontFamily: F, fontWeight: 900, fontSize: 34, color: INK, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 120 }}>{n}</div><div style={{ height: 40, width: 700 * v * ease(f, 10 + i * 10, 40 + i * 10), background: c, borderRadius: 8 }} /><div style={{ color: c }}>{i ? "≈ 46%" : "100%"}</div></div>)}
        </>}
        {mode === "vanish" && <div style={{ position: "absolute", left: 120, top: 860, fontFamily: F, fontWeight: 900, fontSize: 56, color: ORA, opacity: ease(f, at + 30, at + 40) }}>tidal bulge: {Math.round(100 - shrink * 67)}%</div>}
      </Push>
      <Overlays o={o} />
    </SpaceBg>
  );
};
// 10. el vaivén: corte de una cuenca oceánica; el agua se mece de lado a lado y se calma (NO es un tsunami). mode tub = bañadera
export const Slosh: React.FC<{ d: number; mode?: "basin" | "tub" | "calm"; o?: Ov }> = ({ d, mode = "basin", o = {} }) => {
  const f = useCurrentFrame();
  const damp = mode === "calm" ? 0.15 : Math.exp(-f / 260);
  const A = (mode === "tub" ? 70 : 90) * damp, w = Math.sin(f / 22);
  const pts: string[] = []; for (let x = 0; x <= 1920; x += 20) pts.push(`${x},${520 + A * w * ((x - 960) / 960) + Math.sin(x / 90 + f / 8) * 5}`);
  const boatY = 520 + A * w * ((1320 - 960) / 960) - 6;
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: mode === "tub" ? "linear-gradient(180deg,#4a5563,#2f3742)" : "linear-gradient(180deg,#0b1a2e,#1d3a5c 60%)" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><linearGradient id="wat" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3a8fd0" /><stop offset="1" stopColor="#0c2c50" /></linearGradient></defs>
          <polygon points={`0,1080 ${pts.join(" ")} 1920,1080`} fill="url(#wat)" opacity={0.95} />
          {mode === "tub" ? <path d="M60,300 L60,880 Q60,1000 200,1000 L1720,1000 Q1860,1000 1860,880 L1860,300" fill="none" stroke="#f4f4f6" strokeWidth={60} />
            : <path d="M0,700 Q200,620 320,880 Q960,1040 1600,880 Q1720,620 1920,700 L1920,1080 L0,1080 Z" fill="#3a2a1f" />}
          {mode !== "tub" && <g transform={`translate(1320,${boatY}) rotate(${-w * damp * 6})`}><path d="M-60,0 L60,0 L40,26 L-40,26 Z" fill="#c4522a" /><rect x={-4} y={-70} width={6} height={70} fill="#ddd" /><path d="M2,-66 L44,-12 L2,-12 Z" fill="#f4efe6" /></g>}
          <path d={`M${960 - 300},${200} l600,0`} stroke={ORA} strokeWidth={6} opacity={0} />
        </svg>
        <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 40, color: mode === "tub" ? "#1b2230" : INK, opacity: 0.85 }}>{mode === "tub" ? "" : "← sloshes →"}</div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 11. el muelle a las 5: vos pescando, el agua en un lugar raro (marca de agua vieja vs la de hoy)
export const PierScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const wl = 760 + 40 * Math.sin(f / 50);
  return (
    <Push d={d} k={0.05} ox="40% 60%">
      <SunsetStage water horizon={560} night={0.55} sunX={1650} pan={0.2} tree="pine">
        <AbsoluteFill style={{ top: wl, background: "linear-gradient(180deg,#1e4a5a,#0c2630)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={600} width={1100} height={26} fill="#5a3e2a" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={40 + i * 140} y={620} width={22} height={460} fill="#4a3220" />)}
          {Array.from({ length: 8 }).map((_, i) => <rect key={"m" + i} x={40 + i * 140} y={680} width={22} height={30} fill="#2a4a2a" opacity={0.9} />)}
          <path d={`M860,430 Q1150,${380 + Math.sin(f / 20) * 6} 1400,${wl}`} stroke="#ddd" strokeWidth={2} fill="none" />
          <line x1={760} y1={600} x2={860} y2={430} stroke="#3a2a1f" strokeWidth={6} />
          <line x1={1240} y1={690} x2={1800} y2={690} stroke={GOLD} strokeWidth={4} strokeDasharray="14 10" />
          <text x={1500} y={676} fontFamily={F} fontWeight={800} fontSize={26} fill={GOLD}>usual 5 AM water</text>
        </svg>
        <Person x={720} y={604} s={1.0} arms="spear" />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};
// 12. tide gauge: la curva de marea (2 pleamares por día) y a las 3:17 cae a ~1/3
export const TideChart: React.FC<{ d: number; o?: Ov; small?: boolean }> = ({ d, o = {}, small }) => {
  const f = useCurrentFrame();
  const W = 1560, X = 180, Y = 560, cut = 0.42, prog = interpolate(f, [6, Math.max(d * 0.85, 10)], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 400 * prog; i++) { const x = i / 400; const amp = x < cut ? 1 : 0.33 + 0.67 * Math.exp(-(x - cut) * 30) * Math.abs(Math.cos((x - cut) * 40)) * 0.0 + (x < cut + 0.03 ? 0.67 * (1 - (x - cut) / 0.03) : 0);
    pts.push(`${X + x * W},${Y - Math.sin(x * Math.PI * 2 * 4) * 210 * (small ? 0.33 : amp)}`); }
  const hx = X + prog * W;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#07121f,#0b1b2e)" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(79,227,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,227,255,.08) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X} x2={X + W} y1={Y} y2={Y} stroke="rgba(240,235,229,.25)" strokeWidth={2} />
        {!small && <><line x1={X + cut * W} x2={X + cut * W} y1={260} y2={860} stroke={RED} strokeWidth={3} strokeDasharray="10 8" /><text x={X + cut * W + 14} y={290} fontFamily={F} fontWeight={900} fontSize={32} fill={RED}>3:17 AM</text></>}
        <polyline points={pts.join(" ")} fill="none" stroke={CYAN} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }} />
        <circle cx={hx} cy={pts.length ? Number(pts[pts.length - 1].split(",")[1]) : Y} r={10} fill={CYAN} />
      </svg>
      <div style={{ position: "absolute", left: X, top: 900, fontFamily: F, fontWeight: 800, fontSize: 28, color: "rgba(240,235,229,.6)", letterSpacing: 3 }}>TIDE GAUGE · WATER HEIGHT</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 13. amanecer: vos caminando, donde siempre estaba la luna pálida de la mañana hay un contorno vacío
export const Sunrise: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <Push d={d} k={0.05}>
      <SunsetStage tree="acacia" horizon={680} night={0} sunX={420} pan={0.3}>
        <div style={{ position: "absolute", left: 1390, top: 190, width: 130, height: 130, borderRadius: "50%", border: "4px dashed rgba(240,235,229,.5)", transform: `rotate(${f * 0.5}deg)` }} />
        <div style={{ position: "absolute", left: 1530, top: 170, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: GOLD, opacity: ease(f, 30, 40) }}>?</div>
        {[0, 1, 2].map((k) => <svg key={k} width={60} height={30} style={{ position: "absolute", left: 300 + ((f * (2 + k)) % 1800), top: 260 + k * 50 + Math.sin(f / 8 + k) * 10 }}><path d={`M0,15 Q15,${5 + Math.sin(f / 3 + k) * 8} 30,15 Q45,${5 + Math.sin(f / 3 + k) * 8} 60,15`} stroke="#1a1a20" strokeWidth={4} fill="none" /></svg>)}
        <Person x={700 + f * 1.6} y={760} s={1.1} walk />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};
// 14. el calendario lunar: fases sobre los días; se apagan; las fiestas que dependen de la luna quedan con "?"
export const MoonCalendar: React.FC<{ d: number; o?: Ov; at?: number }> = ({ d, o = {}, at = 60 }) => {
  const f = useCurrentFrame();
  const g = ease(f, at, at + 20);
  const fests = ["Ramadan", "Easter", "Passover", "Diwali", "Lunar New Year"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a1e14 0%, #0c0805 80%)" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0003})` }}>
        {Array.from({ length: 28 }).map((_, i) => { const c = i % 7, r = Math.floor(i / 7), ph = i / 28, t = ease(f, i * 1.5, i * 1.5 + 8);
          const sh = Math.cos(ph * Math.PI * 2); return (
          <div key={i} style={{ position: "absolute", left: 170 + c * 190, top: 290 + r * 150, width: 170, height: 130, borderRadius: 10, background: "#efe6d4", opacity: t, boxShadow: "0 6px 16px rgba(0,0,0,.4)" }}>
            <div style={{ position: "absolute", left: 10, top: 6, fontFamily: F, fontWeight: 800, fontSize: 22, color: "#3a2a1f" }}>{i + 1}</div>
            <div style={{ position: "absolute", left: 60, top: 36, width: 60, height: 60, borderRadius: "50%", background: "#2a2420", overflow: "hidden", opacity: 1 - g }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: ph < 0.5 ? 30 - 30 * sh : 0, width: ph < 0.5 ? 30 + 30 * sh : 30 - 30 * sh, background: "#f6f0dc", borderRadius: "50%" }} />
            </div>
            {g > 0 && <div style={{ position: "absolute", left: 60, top: 36, width: 60, height: 60, borderRadius: "50%", border: `3px dashed rgba(58,42,31,${g * 0.5})` }} />}
          </div>); })}
      </AbsoluteFill>
      {fests.map((n, i) => { const t = ease(f, at + 10 + i * 8, at + 18 + i * 8); return (
        <div key={n} style={{ position: "absolute", left: 1530, top: 300 + i * 110, opacity: t, transform: `translateX(${(1 - t) * 60}px)`, fontFamily: F, fontWeight: 900, fontSize: 32, color: INK, background: "rgba(10,8,6,.85)", border: `3px solid ${ORA}`, borderRadius: 10, padding: "10px 16px", whiteSpace: "nowrap" }}>{n} <span style={{ color: RED }}>?</span></div>); })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 15. la bahía de Fundy en corte: el agua sube y baja >10 m (regla), la bahía "suena" como campana; mode small = se achica
export const Fundy: React.FC<{ d: number; mode?: "big" | "small"; o?: Ov }> = ({ d, mode = "big", o = {} }) => {
  const f = useCurrentFrame();
  const A = mode === "big" ? 230 : 70, lvl = 620 - Math.sin(f / 26) * A;
  const ring = Math.sin(f / 26);
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#24384e 0%,#5d7a8e 55%,#9db0ba 100%)" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={lvl} width={1920} height={1080 - lvl} fill="#2c5468" opacity={0.92} />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={((i * 340 + f * 2) % 2100) - 100} y={lvl + 12 + i * 22} width={160} height={3} fill="rgba(255,255,255,.25)" />)}
          <path d="M0,1080 L0,860 Q500,900 900,840 Q1300,790 1500,560 L1560,250 L1920,250 L1920,1080 Z" fill="#6b4a32" />
          <path d="M1500,560 L1560,250 L1920,250 L1920,300 L1580,300 Z" fill="#4e7a3a" />
          {/* regla de 10 m */}
          <rect x={1380} y={380} width={26} height={480} fill="#f4efe6" />
          {Array.from({ length: 11 }).map((_, i) => <g key={i}><rect x={1360} y={380 + i * 48} width={20} height={4} fill="#f4efe6" /><text x={1290} y={392 + i * 48} fontFamily={F} fontWeight={800} fontSize={22} fill="#f4efe6">{10 - i}m</text></g>)}
          {/* bote que se apoya en el barro cuando baja */}
          <g transform={`translate(700,${Math.min(lvl - 8, 850)}) rotate(${lvl > 850 ? 8 : Math.sin(f / 12) * 3})`}><path d="M-80,0 L80,0 L56,34 L-56,34 Z" fill="#c4522a" /><rect x={-4} y={-90} width={7} height={90} fill="#ddd" /></g>
          {/* campana que suena al ritmo */}
          <g transform={`translate(260,230) rotate(${ring * (mode === "big" ? 22 : 6)})`}><path d="M0,0 C-40,0 -48,40 -48,70 L-48,100 L-66,120 L66,120 L48,100 L48,70 C48,40 40,0 0,0 Z" fill={GOLD} /><circle cx={ring * 10} cy={132} r={12} fill={GOLD} /></g>
        </svg>
        <div style={{ position: "absolute", left: 120, top: 400, fontFamily: F, fontWeight: 900, fontSize: 64, color: INK, textShadow: "0 4px 16px rgba(0,0,0,.5)" }}>{mode === "big" ? "+10 m" : "?"}</div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 16. la central mareomotriz en corte: el agua pasa por la turbina; la aguja de MW cae
export const TidalPlant: React.FC<{ d: number; mode?: "run" | "drop"; o?: Ov }> = ({ d, mode = "run", o = {} }) => {
  const f = useCurrentFrame();
  const k = mode === "drop" ? 1 - 0.85 * ease(f, 20, Math.max(d * 0.7, 30)) : 1;
  const rot = f * 9 * k, mw = Math.round(245 * k);
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0f2234,#0a1622)" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={420 + 120 * (1 - k)} width={760} height={660} fill="#1f5470" />
          <rect x={1160} y={560} width={760} height={520} fill="#1f5470" />
          <path d="M760,300 L1160,300 L1160,1080 L760,1080 Z" fill="#6b6f76" />
          <rect x={760} y={640} width={400} height={180} fill="#16384e" />
          {Array.from({ length: 6 }).map((_, i) => { const x = ((f * 6 * k + i * 80) % 480) + 720; return <line key={i} x1={x} y1={660 + (i % 3) * 50} x2={x + 50} y2={660 + (i % 3) * 50} stroke="rgba(160,220,255,.7)" strokeWidth={4} opacity={k} />; })}
          <g transform={`translate(960,730) rotate(${rot})`}>{[0, 90, 180, 270].map((a) => <path key={a} d="M0,0 L18,-80 L-18,-80 Z" fill="#e9c762" transform={`rotate(${a})`} />)}<circle r={20} fill="#333" /></g>
          <rect x={900} y={240} width={120} height={60} fill="#4a4e56" /><path d="M1020,260 L1300,140" stroke="#888" strokeWidth={6} /><path d="M1300,140 L1700,160" stroke="#888" strokeWidth={6} />
        </svg>
        {/* medidor */}
        <div style={{ position: "absolute", left: 1360, top: 220, width: 420, padding: "18px 24px", borderRadius: 14, background: "rgba(5,10,18,.85)", border: `2px solid ${k < 0.5 ? RED : GLOW}`, fontFamily: F }}>
          <div style={{ fontSize: 20, letterSpacing: 4, fontWeight: 800, color: "rgba(240,235,229,.6)" }}>TIDAL POWER OUTPUT</div>
          <div style={{ fontSize: 76, fontWeight: 900, color: k < 0.5 ? RED : GLOW, fontVariantNumeric: "tabular-nums" }}>{mw} MW</div>
          <div style={{ height: 14, borderRadius: 7, background: "#222" }}><div style={{ height: 14, width: `${k * 100}%`, borderRadius: 7, background: k < 0.5 ? RED : GLOW }} /></div>
        </div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 17. noche en el campo/playa/montaña: una tira de 30 noches del mes, todas oscuras ("Not one bright night")
export const DarkNights: React.FC<{ d: number; o?: Ov; tree?: "pine" | "palm" | "acacia" }> = ({ d, o = {}, tree = "pine" }) => {
  const f = useCurrentFrame();
  return (
    <Push d={d} k={0.05}>
      <SunsetStage tree={tree} horizon={720} night={1} pan={0.15}>
        <Stars n={200} k={1} h={700} seed={31} milky={0.5} />
        <div style={{ position: "absolute", left: 160, top: 250, display: "flex", gap: 12 }}>
          {Array.from({ length: 30 }).map((_, i) => { const t = ease(f, 10 + i * 2, 16 + i * 2); const bright = i === 14; return (
            <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: "#0a0f18", border: `2px solid rgba(240,235,229,${0.35 * t})`, opacity: t, position: "relative" }}>
              {bright && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#f6f0dc", opacity: 1 - ease(f, 80, 90) }} />}
            </div>); })}
        </div>
        <Person x={960} y={800} s={1.0} arms="up" dark />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};
// silueta de león (SVG plano) y cebra
const LionSil: React.FC<{ x: number; y: number; s?: number; step?: number; eye?: number }> = ({ x, y, s = 1, step = 0, eye = 0 }) => (
  <svg width={360 * s} height={200 * s} viewBox="0 0 360 200" style={{ position: "absolute", left: x, top: y - 200 * s, overflow: "visible" }}>
    <path d="M40,90 Q60,60 140,62 L250,60 Q290,40 312,58 Q340,62 346,84 Q350,104 330,110 L300,112 Q284,130 262,122 L250,118 L248,120 Q200,124 150,122 L120,124 Q80,128 60,110 Q20,120 8,86 Q4,70 18,72 Q28,96 40,90 Z" fill="#050505" stroke={C.glow} strokeWidth={3} />
    <rect x={250 + step} y={110} width={16} height={84} rx={6} fill="#050505" /><rect x={226 - step} y={112} width={16} height={82} rx={6} fill="#050505" />
    <rect x={80 - step} y={112} width={16} height={82} rx={6} fill="#050505" /><rect x={110 + step} y={112} width={16} height={82} rx={6} fill="#050505" />
    {eye > 0 && <circle cx={322} cy={78} r={6} fill="#ffb030" opacity={eye} style={{ filter: "drop-shadow(0 0 8px #ff9a1a)" }} />}
  </svg>
);
const ZebraSil: React.FC<{ x: number; y: number; s?: number; lift?: number; dark?: number }> = ({ x, y, s = 1, lift = 0, dark = 0 }) => (
  <svg width={260 * s} height={260 * s} viewBox="0 0 260 260" style={{ position: "absolute", left: x, top: y - 260 * s, overflow: "visible" }}>
    <path d={`M30,110 Q40,80 120,84 L190,84 Q206,${40 - lift} 222,${26 - lift} L240,${34 - lift} L226,${80 - lift * 0.5} L210,118 Q200,140 180,140 L60,140 Q34,140 30,110 Z`} fill={dark ? "#1a1d22" : "#e8e4dc"} />
    {!dark && Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${60 + i * 20},86 q8,24 0,52`} stroke="#111" strokeWidth={7} fill="none" />)}
    {[50, 80, 160, 186].map((lx) => <rect key={lx} x={lx} y={136} width={12} height={110} rx={5} fill={dark ? "#1a1d22" : "#e8e4dc"} />)}
  </svg>
);
// 18. sabana de noche: el león se acerca a las cebras; mode bright (con luna lo ven) / dark (no lo ven)
export const Savanna: React.FC<{ d: number; mode?: "bright" | "dark"; o?: Ov }> = ({ d, mode = "dark", o = {} }) => {
  const f = useCurrentFrame();
  const dark = mode === "dark";
  const lx = 140 + f * (dark ? 3.2 : 1.2), step = Math.sin(f / 5) * 10;
  return (
    <Push d={d} k={0.05} ox="60% 70%">
      <SunsetStage tree="acacia" horizon={700} night={1} pan={0.2}>
        {!dark && <MoonDisc x={1500} y={200} r={70} />}
        {!dark && <AbsoluteFill style={{ background: "rgba(150,170,220,.18)" }} />}
        {[0, 1, 2, 3].map((i) => <ZebraSil key={i} x={1180 + i * 150} y={900 + (i % 2) * 20} s={0.9} lift={!dark && f > 30 ? 16 : Math.sin(f / 30 + i) * 3} dark={dark ? 1 : 0} />)}
        <LionSil x={lx} y={930} s={1.2} step={step} eye={dark ? 1 : 0.4} />
        {!dark && f > 30 && <div style={{ position: "absolute", left: 1260, top: 560, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: GOLD }}>!!</div>}
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};
// 19. escarabajo pelotero bajo la Vía Láctea (línea recta) / mode lost: polillas y pájaros que se pierden (espirales)
export const BeetleScene: React.FC<{ d: number; mode?: "beetle" | "lost"; o?: Ov }> = ({ d, mode = "beetle", o = {} }) => {
  const f = useCurrentFrame();
  if (mode === "lost") {
    return (
      <Push d={d} k={0.05}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#040912,#0b1626)" }}>
          <Stars n={160} k={0.8} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 7 }).map((_, i) => { const pts: string[] = []; for (let k = 0; k < Math.min(f * 2, 220); k++) { const t = k / 20 + i; pts.push(`${200 + i * 230 + Math.cos(t * (1 + i * 0.13)) * (30 + k * 1.4)},${540 + Math.sin(t * 1.3) * (40 + k * 1.1) - k}`); }
              const last = pts[pts.length - 1]?.split(",").map(Number) || [0, 0];
              return <g key={i}><polyline points={pts.join(" ")} fill="none" stroke="rgba(233,199,98,.45)" strokeWidth={2.5} strokeDasharray="6 6" /><path d={`M${last[0] - 14},${last[1]} q7,-12 14,0 q7,-12 14,0`} stroke={INK} strokeWidth={4} fill="none" /></g>; })}
          </svg>
          <div style={{ position: "absolute", left: 1480, top: 140, width: 160, height: 160, borderRadius: "50%", border: "3px dashed rgba(240,235,229,.35)" }} />
        </AbsoluteFill>
        <Overlays o={o} />
      </Push>
    );
  }
  const bx = 300 + f * 4.2;
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#040912 0%,#101d33 70%,#3a2a1f 70%,#22180f 100%)" }}>
        <Stars n={220} k={1} h={740} milky={1} seed={41} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={300} y1={880} x2={bx} y2={880} stroke="rgba(233,199,98,.7)" strokeWidth={4} strokeDasharray="12 10" />
          <circle cx={bx + 70} cy={840} r={46} fill="#5a4030" transform={`rotate(${f * 8} ${bx + 70} 840)`} /><circle cx={bx + 56} cy={826} r={6} fill="#4a3020" />
          <g transform={`translate(${bx},860)`}><ellipse cx={0} cy={0} rx={34} ry={22} fill="#0c0c0c" stroke={C.glow} strokeWidth={2} />{[-18, 0, 18].map((lx, i) => <line key={i} x1={lx} y1={10} x2={lx + Math.sin(f / 3 + i) * 10} y2={30} stroke="#0c0c0c" strokeWidth={5} />)}
            <line x1={26} y1={-6} x2={44} y2={-24} stroke="#0c0c0c" strokeWidth={5} /></g>
        </svg>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 20. eclipses: mode solar (la luna tapa el sol), lunar (sombra de la Tierra sobre la luna), none (sol solo + lista de eclipses CANCELED)
export const Eclipse: React.FC<{ d: number; mode?: "solar" | "lunar" | "none"; o?: Ov }> = ({ d, mode = "solar", o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 6, Math.max(d * 0.7, 20));
  if (mode === "none") {
    const yrs = ["2027", "2028", "2030", "2033", "2034", "2035", "2037", "2038", "2041", "2044", "2045"];
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 50%, #2a1a10 0%, #050403 75%)" }}>
        <div style={{ position: "absolute", left: 230, top: 330, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,#fff6d0 0%,#ffcf6a 45%,rgba(255,150,40,0) 72%)", transform: `scale(${1 + Math.sin(f / 15) * 0.02})` }} />
        {yrs.map((y, i) => { const t = ease(f, 6 + i * 5, 12 + i * 5); return (
          <div key={y} style={{ position: "absolute", left: 860 + (i % 3) * 330, top: 170 + Math.floor(i / 3) * 190, width: 290, height: 150, borderRadius: 12, background: "#efe6d4", opacity: t, transform: `rotate(${(rnd(i, 3) - 0.5) * 6}deg)`, fontFamily: F, boxShadow: "0 8px 20px rgba(0,0,0,.5)" }}>
            <div style={{ padding: "14px 18px", fontSize: 22, fontWeight: 800, color: "#5a4a3a", letterSpacing: 2 }}>TOTAL ECLIPSE</div>
            <div style={{ padding: "0 18px", fontSize: 54, fontWeight: 900, color: "#2a2420" }}>{y}</div>
            <div style={{ position: "absolute", left: 40, top: 40, border: `5px solid ${RED}`, color: RED, fontSize: 40, fontWeight: 900, padding: "2px 14px", transform: `rotate(-14deg) scale(${1.4 - 0.4 * ease(f, 20 + i * 5, 26 + i * 5)})`, opacity: ease(f, 20 + i * 5, 26 + i * 5), background: "rgba(239,230,212,.7)" }}>CANCELED</div>
          </div>); })}
        <Overlays o={o} />
      </AbsoluteFill>
    );
  }
  if (mode === "lunar") {
    return (
      <SpaceBg>
        <MoonDisc x={1100} y={520} r={190} />
        <div style={{ position: "absolute", left: 1100 - 190, top: 520 - 190, width: 380, height: 380, borderRadius: "50%", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: interpolate(p, [0, 1], [-560, -60]), top: -160, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,20,10,.85) 55%, rgba(60,10,5,.55) 70%, transparent 74%)" }} />
        </div>
        <EarthDisc x={interpolate(p, [0, 1], [180, 420])} y={520} r={150} />
        <Overlays o={o} />
      </SpaceBg>
    );
  }
  const mx = interpolate(p, [0, 1], [700, 960]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgb(${30 - 20 * p},${40 - 30 * p},${60 - 40 * p}) 0%, #020306 80%)` }}>
      <div style={{ position: "absolute", left: 960 - 330, top: 540 - 330, width: 660, height: 660, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${0.2 + 0.6 * p}) 30%, rgba(200,220,255,${0.3 * p}) 40%, transparent 60%)` }} />
      <div style={{ position: "absolute", left: 960 - 200, top: 540 - 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#fff6d0 0%,#ffcf6a 60%,#ff9a3a 100%)", opacity: 1 - p * 0.2 }} />
      <div style={{ position: "absolute", left: mx - 205, top: 540 - 205, width: 410, height: 410, borderRadius: "50%", background: "#050505" }} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 21. el arrecife bajo el agua: con luna llena arriba, el coral desova a la vez (huevos que suben como nieve al revés); mode nomoon = desparejo, pocos
export const Reef: React.FC<{ d: number; mode?: "spawn" | "nomoon" | "reef"; o?: Ov }> = ({ d, mode = "spawn", o = {} }) => {
  const f = useCurrentFrame();
  const sp = mode === "spawn", nm = mode === "nomoon";
  return (
    <Push d={d} k={0.05} ox="50% 60%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b2a44 0%,#06182c 50%,#030a14 100%)" }}>
        {!nm && <div style={{ position: "absolute", left: 1400, top: 40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,240,255,.55) 0%, rgba(160,190,255,.15) 60%, transparent 72%)", filter: "blur(4px)", transform: `translateX(${Math.sin(f / 20) * 8}px)` }} />}
        {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 200 + i * 360 + Math.sin(f / 30 + i) * 30, top: 0, width: 80, height: 760, background: "linear-gradient(180deg, rgba(160,210,255,.12), transparent)", transform: `skewX(${-12 + i * 5}deg)` }} />)}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M0,900 Q300,840 600,880 T1200,870 T1920,890 L1920,1080 L0,1080 Z" fill="#2a2a24" />
          {Array.from({ length: 11 }).map((_, i) => { const x = 100 + i * 170, h = 120 + rnd(i, 4) * 120, c = ["#e86a5a", "#d9a441", "#a65dd0", "#e88aa0"][i % 4];
            return <g key={i} transform={`translate(${x},900) rotate(${Math.sin(f / 30 + i) * 2})`} opacity={nm && i % 3 === 0 ? 0.35 : 1}>
              <path d={`M0,0 L-6,${-h * 0.5} L-40,${-h} M-6,${-h * 0.5} L20,${-h * 0.9} M0,0 L10,${-h * 0.4} L46,${-h * 0.75}`} stroke={c} strokeWidth={18} strokeLinecap="round" fill="none" /></g>; })}
          {(sp || nm) && Array.from({ length: sp ? 220 : 26 }).map((_, i) => { const t0 = sp ? 10 + rnd(i, 2) * 20 : rnd(i, 2) * d; const age = (f - t0) / 30; if (age < 0) return null;
            const x = 100 + rnd(i, 5) * 1720 + Math.sin(age * 2 + i) * 20, y = 860 - age * (60 + rnd(i, 6) * 60);
            return <circle key={i} cx={x} cy={y} r={4 + rnd(i, 7) * 4} fill={i % 3 ? "#ffd2dc" : "#fff4e8"} opacity={Math.max(0, 0.9 - age * 0.06)} />; })}
        </svg>
        {mode === "reef" && Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 170 + f * (1 + i % 3)) % 2100) - 100, top: 520 + (i % 5) * 60 + Math.sin(f / 10 + i) * 10, width: 38, height: 16, borderRadius: "50% 30% 30% 50%", background: i % 2 ? GOLD : "#4fe3ff" }} />)}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 22. grunion: la playa de noche, la línea de la marea más alta y los pececitos que se tiran a la arena; mode off = la línea cambia
export const Grunion: React.FC<{ d: number; mode?: "on" | "off"; o?: Ov }> = ({ d, mode = "on", o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 24), wave = 640 + sw * 40;
  const off = mode === "off";
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#050b18 0%,#0d1a2e 45%)" }}>
        <Stars n={110} k={0.8} h={460} />
        {!off && <MoonDisc x={1500} y={160} r={60} />}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M0,480 L1920,420 L1920,1080 L0,1080 Z" fill="#0f2840" />
          <path d={`M0,${wave + 120} Q960,${wave + 40} 1920,${wave - 40} L1920,1080 L0,1080 Z`} fill="#8a7a5e" />
          <path d={`M0,${wave + 120} Q960,${wave + 40} 1920,${wave - 40}`} stroke="rgba(255,255,255,.8)" strokeWidth={8} fill="none" />
          <path d="M0,700 Q960,620 1920,540" stroke={off ? RED : GOLD} strokeWidth={4} strokeDasharray="14 10" fill="none" opacity={0.9} transform={off ? `translate(0,${80 + Math.sin(f / 30) * 40})` : undefined} />
          {!off && Array.from({ length: 14 }).map((_, i) => { const x = 160 + i * 120, y = 720 - i * 7 + Math.sin(f / 3 + i) * 6; return <path key={i} d={`M${x},${y} q20,${-10 + Math.sin(f / 2 + i) * 10} 40,0 l12,-8 l0,16 z`} fill="#c8d4e0" />; })}
        </svg>
        <div style={{ position: "absolute", left: 1460, top: 600, fontFamily: F, fontWeight: 800, fontSize: 30, color: off ? RED : GOLD }}>{off ? "new tide line?" : "highest tide line"}</div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 23. el Ártico en la noche polar: el zooplancton sube y baja siguiendo a la luna; mode gone = quedan quietos, sin rumbo
export const Arctic: React.FC<{ d: number; mode?: "follow" | "gone"; o?: Ov }> = ({ d, mode = "follow", o = {} }) => {
  const f = useCurrentFrame();
  const gone = mode === "gone";
  const ma = f / 70, mY = 140 + Math.sin(ma) * 40, depth = gone ? 0 : Math.sin(ma) * 0.5 + 0.5;
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#02060e 0%,#07111e 38%,#06192a 40%,#020a14 100%)" }}>
        <Stars n={120} k={0.8} h={400} />
        {!gone && <MoonDisc x={300 + f * 1.4} y={mY} r={52} />}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${i * 230 - 40},420 l${180 + rnd(i, 3) * 40},0 l-20,22 l-${160},0 z`} fill="#d9e6ee" opacity={0.85} />)}
          {Array.from({ length: 120 }).map((_, i) => { const x = rnd(i, 2) * 1920, base = 480 + rnd(i, 3) * 480; const y = gone ? base + Math.sin(f / 15 + i) * 6 : 470 + depth * 120 + rnd(i, 3) * 380 * (0.4 + depth * 0.6);
            return <circle key={i} cx={x + Math.sin(f / 20 + i) * 8} cy={y} r={3 + rnd(i, 4) * 2} fill="#9fe8ff" opacity={0.7} />; })}
        </svg>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 24. el puerto con marea baja: el barco espera afuera, el calado no alcanza (regla de profundidad)
export const PortScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const lvl = 600 + Math.sin(f / 60) * 14;
  return (
    <Push d={d} k={0.04}>
      <SunsetStage water horizon={480} night={0.2} sunX={300} pan={0.1} tree="palm">
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={lvl} width={1920} height={1080} fill="#123a48" opacity={0.75} />
          <path d={`M0,1080 L0,${lvl + 200} Q960,${lvl + 140} 1920,${lvl + 220} L1920,1080 Z`} fill="#3a2a1f" />
          <rect x={1300} y={420} width={620} height={240} fill="#5a5e66" />{[0, 1, 2].map((i) => <path key={i} d={`M${1380 + i * 180},420 l0,-260 l120,0`} stroke="#c4522a" strokeWidth={14} fill="none" />)}
          <g transform={`translate(${520 + Math.sin(f / 40) * 6},${lvl - 30}) rotate(${Math.sin(f / 30) * 1})`}>
            <path d="M-300,0 L300,0 L260,90 L-280,90 Z" fill="#2a3a5a" /><rect x={-250} y={-70} width={120} height={70} fill="#c4522a" /><rect x={-120} y={-70} width={120} height={70} fill="#e9c762" /><rect x={10} y={-70} width={120} height={70} fill="#4fa3c0" /><rect x={160} y={-140} width={90} height={140} fill="#e9e4da" />
          </g>
          <line x1={1100} y1={lvl} x2={1100} y2={lvl + 190} stroke={INK} strokeWidth={4} /><line x1={1080} y1={lvl + 120} x2={1120} y2={lvl + 120} stroke={RED} strokeWidth={6} />
          <text x={1130} y={lvl + 128} fontFamily={F} fontWeight={800} fontSize={26} fill={RED}>keel needs</text>
        </svg>
        <div style={{ position: "absolute", left: 1460, top: 300, padding: "10px 22px", border: `4px solid ${RED}`, color: RED, fontFamily: F, fontWeight: 900, fontSize: 54, background: "rgba(10,6,4,.7)", transform: `rotate(-6deg) scale(${1 + Math.sin(f / 8) * 0.02})` }}>WAIT</div>
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};
// 25. vos en el patio mirando el hueco del cielo; mode memory = flotan íconos (nota musical, pluma, libro) que se apagan
export const LookUp: React.FC<{ d: number; mode?: "look" | "memory"; o?: Ov }> = ({ d, mode = "look", o = {} }) => {
  const f = useCurrentFrame();
  const icons = ["♪", "✎", "♫", "❝", "☾"];
  return (
    <Push d={d} k={0.06} ox="50% 40%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#030810 0%,#0b1626 70%)" }}>
        <Stars n={200} k={1} h={760} milky={0.4} seed={13} />
        <div style={{ position: "absolute", left: 1220, top: 160, width: 200, height: 200, borderRadius: "50%", border: "4px dashed rgba(240,235,229,.45)", transform: `rotate(${f * 0.4}deg)` }} />
        {mode === "memory" && icons.map((ic, i) => { const t = ((f + i * 30) % 150) / 150; return <div key={i} style={{ position: "absolute", left: 700 + i * 120 + Math.sin(f / 20 + i) * 20, top: 700 - t * 520, fontSize: 70, color: GOLD, opacity: Math.sin(t * Math.PI) * 0.85, fontFamily: F }}>{ic}</div>; })}
        <Roofs base={1080} seed={8} color="#03060b" lit={0.6} drift={-80} />
        <div style={{ position: "absolute", left: 0, top: 900, width: 1920, height: 180, background: "#05080d" }} />
        <Person x={860} y={960} s={1.3} dark arms="down" />
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 26. la duración del día: la marea frena el giro (22 h → 24 h); sin luna la curva se aplana
export const DayLength: React.FC<{ d: number; o?: Ov; flat?: boolean }> = ({ d, o = {}, flat }) => {
  const f = useCurrentFrame();
  const W = 1400, X = 260, Y = 300, H = 420, p = ease(f, 6, Math.max(d * 0.75, 20));
  const pts: string[] = []; for (let i = 0; i <= 200 * p; i++) { const x = i / 200; pts.push(`${X + x * W * 0.75},${Y + H - x * H * 0.86}`); }
  const fp = flat ? ease(f, d * 0.5, d * 0.9) : 0;
  const hrs = (22 + 2 * p).toFixed(1);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0e0a14,#07060c)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X} y1={Y + H} x2={X + W} y2={Y + H} stroke="rgba(240,235,229,.3)" strokeWidth={2} /><line x1={X} y1={Y} x2={X} y2={Y + H} stroke="rgba(240,235,229,.3)" strokeWidth={2} />
        <polyline points={pts.join(" ")} fill="none" stroke={ORA} strokeWidth={7} strokeLinejoin="round" />
        {flat && <line x1={X + W * 0.75} y1={Y + H * 0.14} x2={X + W * 0.75 + W * 0.25 * fp} y2={Y + H * 0.14 - 4 * fp} stroke={CYAN} strokeWidth={7} strokeDasharray="14 10" />}
        <text x={X} y={Y + H + 50} fontFamily={F} fontWeight={800} fontSize={30} fill={INK}>600 million years ago</text>
        <text x={X + W * 0.75 - 40} y={Y + H + 50} fontFamily={F} fontWeight={800} fontSize={30} fill={INK}>today</text>
        {flat && <text x={X + W * 0.78} y={Y + H * 0.14 - 30} fontFamily={F} fontWeight={800} fontSize={28} fill={CYAN} opacity={fp}>no Moon: almost flat</text>}
      </svg>
      <div style={{ position: "absolute", left: 300, top: 120, fontFamily: F, fontWeight: 900, fontSize: 110, color: INK, fontVariantNumeric: "tabular-nums" }}>{hrs} <span style={{ fontSize: 50, color: ORA }}>h / day</span></div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 27. la inclinación de 23,5° como trompo; la luna "mano" la sostiene; mode wander = sin luna la inclinación deambula (studies disagree)
export const TiltTop: React.FC<{ d: number; mode?: "steady" | "wander" | "seasons"; o?: Ov }> = ({ d, mode = "steady", o = {} }) => {
  const f = useCurrentFrame();
  const wander = mode === "wander";
  const tilt = 23.5 + (wander ? Math.sin(f / 26) * 18 + Math.sin(f / 11) * 6 : Math.sin(f / 20) * 0.6);
  const cx = 820, cy = 540, R = 230;
  return (
    <SpaceBg>
      <Push d={d} k={0.04}>
        {mode === "seasons" && <div style={{ position: "absolute", left: 100, top: 360, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#fff6d0 0%,#ffcf6a 45%,rgba(255,150,40,0) 72%)" }} />}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={cx} y1={cy - 360} x2={cx} y2={cy + 360} stroke="rgba(240,235,229,.25)" strokeWidth={3} strokeDasharray="10 10" />
          <g transform={`rotate(${tilt} ${cx} ${cy})`}><line x1={cx} y1={cy - 340} x2={cx} y2={cy + 340} stroke={wander ? RED : ORA} strokeWidth={7} /></g>
          <path d={`M${cx},${cy - 300} A300,300 0 0 1 ${cx + Math.sin(tilt * Math.PI / 180) * 300},${cy - Math.cos(tilt * Math.PI / 180) * 300}`} fill="none" stroke={GOLD} strokeWidth={5} />
          <text x={cx + 70} y={cy - 310} fontFamily={F} fontWeight={900} fontSize={54} fill={wander ? RED : GOLD}>{tilt.toFixed(1)}°</text>
        </svg>
        <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, transform: `rotate(${tilt}deg)` }}><EarthDisc x={R} y={R} r={R} spin={1.4} /></div>
        {mode === "steady" && <><MoonDisc x={1560} y={420} r={70} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M1480,440 Q1260,${330 + Math.sin(f / 10) * 10} ${cx + 180},${cy - 200}`} stroke="rgba(160,210,255,.6)" strokeWidth={4} strokeDasharray="10 12" strokeDashoffset={-f * 2} fill="none" /></svg></>}
        {mode === "seasons" && <div style={{ position: "absolute", left: 1240, top: 380, fontFamily: F, fontWeight: 900, fontSize: 60, lineHeight: 1.3 }}><div style={{ color: ORA }}>SUMMER</div><div style={{ color: CYAN }}>WINTER</div></div>}
      </Push>
      <Overlays o={o} />
    </SpaceBg>
  );
};
// 28. mito: "la luna nos protege de los asteroides" — la luna chiquita y lejos, las rocas pasan igual; sello MYTH
export const AsteroidMyth: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <SpaceBg>
      <EarthDisc x={560} y={560} r={200} spin={0.4} />
      <MoonDisc x={1500} y={300} r={34} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={560} cy={560} r={940} fill="none" stroke="rgba(240,235,229,.12)" strokeWidth={2} strokeDasharray="6 10" />
        {Array.from({ length: 9 }).map((_, i) => { const t = ((f * 1.2 + i * 40) % 260) / 260; const x = 1900 - t * 1700 + rnd(i, 3) * 200, y = 80 + rnd(i, 2) * 900 + t * 120;
          return <g key={i}><line x1={x} y1={y} x2={x + 120} y2={y - 14} stroke="rgba(255,170,90,.4)" strokeWidth={3} /><circle cx={x} cy={y} r={8 + rnd(i, 5) * 8} fill="#8a7a6a" /></g>; })}
      </svg>
      <div style={{ position: "absolute", left: 1180, top: 640, border: `8px solid ${RED}`, color: RED, fontFamily: F, fontWeight: 900, fontSize: 130, padding: "0 30px", transform: `rotate(-10deg) scale(${1.3 - 0.3 * ease(f, 20, 28)})`, opacity: ease(f, 20, 28), background: "rgba(10,4,4,.6)" }}>MYTH</div>
      <Overlays o={o} />
    </SpaceBg>
  );
};
// 29. TABLERO FINAL: la línea de 72 h con lo que pasó en cada hora (cierre del ancla)
export const BOARD = [
  { m: 0, t: "Moon gone", c: RED }, { m: 13, t: "no laser echo", c: GLOW }, { m: 43, t: "wobble stops", c: ORA }, { m: 103, t: "sloshing", c: CYAN },
  { m: 193, t: "sunrise, no Moon", c: GOLD }, { m: 343, t: "tides ÷3", c: CYAN }, { m: 523, t: "tidal plants fade", c: GLOW }, { m: 883, t: "first dark night", c: INK },
  { m: 1440, t: "no more eclipses", c: RED }, { m: 2160, t: "reefs out of sync", c: "#ff8fb0" }, { m: 2880, t: "ports rewrite plans", c: ORA }, { m: 4320, t: "a different planet", c: RED },
];
export const Board72: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const X = 140, W = 1640, Y = 560, p = ease(f, 4, Math.max(d * 0.8, 20));
  const xOf = (m: number) => X + (Math.sqrt(m / 4320)) * W;   // escala raíz: las primeras horas no quedan apiladas
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #12233a 0%, #04080f 80%)", transform: `scale(${1 + f * 0.0002})` }}>
      <Stars n={80} k={0.4} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: 6, background: "rgba(240,235,229,.2)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: X, top: Y, width: W * Math.sqrt(p), height: 6, background: RED, borderRadius: 3, boxShadow: `0 0 14px ${RED}` }} />
      {BOARD.map((b, i) => { const on = Math.sqrt(p) >= Math.sqrt(b.m / 4320) - 0.001; const t = on ? 1 : 0; const up = i % 2 === 0; const x = xOf(b.m);
        return <div key={i} style={{ position: "absolute", left: x - 90, top: up ? Y - 210 : Y + 30, width: 180, textAlign: "center", fontFamily: F, opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
          {!up && <div style={{ width: 4, height: 30, background: b.c, margin: "0 auto" }} />}
          <div style={{ fontSize: 24, fontWeight: 900, color: b.c }}>{tplus(b.m).replace("T+ ", "+")}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: INK, lineHeight: 1.15, marginTop: 4 }}>{b.t}</div>
          {up && <div style={{ width: 4, height: 60, background: b.c, margin: "8px auto 0" }} />}
        </div>; })}
      <div style={{ position: "absolute", left: X - 10, top: Y - 12, width: 30, height: 30, borderRadius: 15, background: RED }} />
      <div style={{ position: "absolute", left: X - 30, top: Y + 150, fontFamily: F, fontWeight: 900, fontSize: 34, color: "rgba(240,235,229,.55)" }}>3:17 AM</div>
      <div style={{ position: "absolute", left: X + W - 100, top: Y + 150, fontFamily: F, fontWeight: 900, fontSize: 34, color: "rgba(240,235,229,.55)" }}>72 H</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// fondo oscuro + texto para las frases que pegan
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" | "space" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6e1a10 0%, #2a0806 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)";
  return <AbsoluteFill style={{ background: bg, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>{tone !== "red" && <Stars n={70} k={0.5} />}<Overlays o={o} /></AbsoluteFill>;
};
// pantalla partida en diagonal (WITH THE MOON / WITHOUT)
export const DiagSplit: React.FC<{ d: number; l: string; r: string; wl: string; wr: string; a?: number }> = ({ d, l, r, wl, wr, a = 40 }) => {
  const f = useCurrentFrame();
  const w = ease(f, a, a + 12) * 100, ph = ease(f, 0, d);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "saturate(.8) brightness(.85)" }}><Img src={sf(l)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + ph * 0.04})` }} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${108 - w * 0.56}% 0, 100% 0, 100% 100%, ${92 - w * 0.56}% 100%)` }}>
        <Img src={sf(r)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.8) brightness(.85)", transform: `scale(${1.08 - ph * 0.04})` }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={1920 * (1.08 - w * 0.0056)} y1={0} x2={1920 * (0.92 - w * 0.0056)} y2={1080} stroke={INK} strokeWidth={6} opacity={w > 2 ? 1 : 0} /></svg>
      <BigWord a={4} w={wl} color={INK} size={110} x={100} y={150} />
      <BigWord a={a + 10} w={wr} color={RED} size={110} x={1120} y={150} />
    </AbsoluteFill>
  );
};
// campana + pregunta para los comentarios (CTA sin link ni URL); abajo corre la tira de horas
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #1f3a58 0%, #060d18 78%)" }}>
      <Stars n={90} k={0.5} />
      <div style={{ position: "absolute", top: 800, left: 0, display: "flex", gap: 22, opacity: 0.55, transform: `translateX(${-((f * 2.2) % (13 * 222))}px)` }}>
        {[...HOURS, ...HOURS, ...HOURS].map((h, i) => (
          <div key={i} style={{ width: 200, height: 150, flex: "none", borderRadius: 12, background: "linear-gradient(180deg,#0d1d33,#16304e)", border: "3px solid rgba(237,178,105,.45)", fontFamily: F, textAlign: "center", color: INK }}>
            <div style={{ marginTop: 26, fontSize: 40, fontWeight: 900, color: ORA }}>{h.t}</div>
            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800, color: "rgba(240,235,229,.75)" }}>{h.s}</div>
          </div>
        ))}
      </div>
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 140, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 180, right: 180, top: bell ? 450 : 330, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 70, color: INK, lineHeight: 1.18, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
