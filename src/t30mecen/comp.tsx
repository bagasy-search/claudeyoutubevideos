// t30mecen — "His Kids Fought Over the House at His Funeral…" (The Rocking Chair Will). Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble siguen el patrón de src/btgm1/M1.tsx (copiados acá).
// Todo lo ilustrado es SVG/CSS; lo real = Commons PD/CC + fotos/clips agnes sin cara. Pieza ancla: la MECEDORA del porche (Rocker), que vuelve en cada momento clave.
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
export const Build: React.FC<{ a?: number; lines: string[]; out?: number; y?: number; size?: number; color?: string; step?: number }> = ({ a = 6, lines, out, y = 120, size = 96, color = RED, step = 15 }) => {
  const f = useCurrentFrame();
  const o = out ? ease(f, out, out + 9, 1, 0) : 1;
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: F, opacity: o, filter: `blur(${(1 - o) * 10}px)` }}>
      {lines.map((l, li) => (
        <div key={li} style={{ fontSize: li && l.startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 4px 18px rgba(0,0,0,.6)" }}>
          {l.split(" ").map((w, i) => {
            const t = ease(f, a + k * step, a + k++ * step + 6);
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

// ═════════════════════════ t30mecen: mundo de la historia (todo SVG/CSS, siempre algo se mueve) ═════════════════════════
const WOOD = "#8a5a32", WOOD2 = "#5e3b20", CREAM = "#efe6d4", PAPER = "#f3ead8", INKP = "#2b2420";
const DIANE = { top: C.vest, legs: "#2d3a5a", hair: "#7a5a3a", skirt: true };
const WALTER = { top: "#7d8a96", legs: "#3a3f48", hair: "#e9e6df", skin: "#efc6a4" };
const HELEN = { top: "#b0577a", legs: "#b0577a", hair: "#d8d2c8", skirt: true };
const GREY = "grayscale(1) brightness(.78) contrast(.95)";
const SEPIA = "sepia(.85) saturate(.7) brightness(.85)";
type Who = { top?: string; legs?: string; hair?: string; skin?: string; skirt?: boolean; dark?: boolean; tie?: boolean; small?: boolean };

// figura plana (misma familia que Person del kit): de pie / caminando / con bastón / encorvada; Diane = el chaleco naranja
export const Fig: React.FC<{ x: number; y: number; s?: number; w?: Who; walk?: boolean; flip?: boolean; arms?: "down" | "out" | "up" | "hold" | "hug"; cane?: boolean; bend?: number; o?: number }> = ({ x, y, s = 1, w = DIANE, walk, flip, arms = "down", cane, bend = 0, o = 1 }) => {
  const f = useCurrentFrame();
  const dk = w.dark, skin = dk ? "#0c0c10" : w.skin ?? "#f2c49b", top = dk ? "#0c0c10" : w.top ?? C.vest, legs = dk ? "#0c0c10" : w.legs ?? "#2d3a5a", hair = dk ? "#0c0c10" : w.hair ?? "#5a3a22";
  const sw = walk ? Math.sin(f / 4) * 14 : 0, br = Math.sin(f / 18) * 1.5;
  const sc = w.small ? 0.68 : 1;
  const arm = (side: number) => {
    const bx = side < 0 ? 34 : 86;
    if (arms === "up") return <rect x={bx - 5} y={20} width={11} height={75} rx={5} fill={skin} transform={`rotate(${side * 18} ${bx} 90)`} />;
    if (arms === "out" && side > 0) return <rect x={bx - 5} y={86} width={11} height={70} rx={5} fill={top} transform={`rotate(-75 ${bx} 90)`} />;
    if (arms === "hold" && side > 0) return <rect x={bx - 5} y={86} width={11} height={60} rx={5} fill={top} transform={`rotate(-50 ${bx} 90)`} />;
    if (arms === "hug") return <rect x={bx - 5} y={86} width={11} height={60} rx={5} fill={top} transform={`rotate(${-side * 40} ${bx} 90)`} />;
    return <rect x={bx - 5} y={86} width={11} height={72} rx={5} fill={side < 0 ? top : top} transform={`rotate(${side * -sw * 0.6} ${bx} 90)`} />;
  };
  return (
    <svg width={120 * s * sc} height={260 * s * sc} viewBox="0 0 120 260" style={{ position: "absolute", left: x - 60 * s * sc, top: y - 260 * s * sc, transform: flip ? "scaleX(-1)" : undefined, overflow: "visible", opacity: o }}>
      {w.skirt ? (<>
        <g transform={`rotate(${sw * 0.5} 60 200)`}><rect x={48} y={195} width={10} height={62} rx={5} fill={skin} /></g>
        <g transform={`rotate(${-sw * 0.5} 60 200)`}><rect x={62} y={195} width={10} height={62} rx={5} fill={skin} /></g>
      </>) : (<>
        <g transform={`rotate(${sw} 60 170)`}><rect x={46} y={165} width={13} height={92} rx={6} fill={legs} /></g>
        <g transform={`rotate(${-sw} 60 170)`}><rect x={61} y={165} width={13} height={92} rx={6} fill={legs} /></g>
      </>)}
      <g transform={`rotate(${bend} 60 170) translate(0 ${-br})`}>
        {w.skirt && <path d="M40,150 L80,150 L92,212 L28,212 Z" fill={top} />}
        <rect x={40} y={80} width={40} height={95} rx={14} fill={top} />
        {w.tie && !dk && <path d="M57,84 L63,84 L66,140 L60,150 L54,140 Z" fill="#8a1f1f" />}
        {arm(-1)}{arm(1)}
        <circle cx={60} cy={58} r={24} fill={skin} />
        <path d="M36,52 Q60,22 84,52 L84,44 Q60,14 36,44 Z" fill={hair} />
      </g>
      {cane && <line x1={96} y1={150} x2={104} y2={258} stroke={dk ? "#0c0c10" : "#3a2414"} strokeWidth={6} strokeLinecap="round" />}
    </svg>
  );
};

// mecedora de costado (mira a la derecha) con quien la ocupe; se mece SIEMPRE (rock = amplitud en grados)
export const Rocker: React.FC<{ x: number; y: number; s?: number; who?: Who | null; rock?: number; ph?: number; wood?: string; dark?: boolean; o?: number; lap?: Who | null }> = ({ x, y, s = 1, who, rock = 4, ph = 0, wood = WOOD, dark, o = 1, lap }) => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 20 + ph) * rock;
  const wd = dark ? "#120c08" : wood, wd2 = dark ? "#0a0705" : WOOD2;
  const sk = who?.dark ? "#0c0c10" : who?.skin ?? "#f2c49b";
  return (
    <svg width={220 * s} height={240 * s} viewBox="0 0 220 240" style={{ position: "absolute", left: x - 110 * s, top: y - 232 * s, overflow: "visible", opacity: o }}>
      <g transform={`rotate(${a} 110 228)`}>
        <line x1={58} y1={232} x2={36} y2={60} stroke={wd2} strokeWidth={9} strokeLinecap="round" />
        <path d="M14,214 Q110,246 200,212" fill="none" stroke={wd} strokeWidth={10} strokeLinecap="round" />
        <line x1={150} y1={228} x2={148} y2={150} stroke={wd} strokeWidth={9} strokeLinecap="round" />
        <line x1={70} y1={230} x2={74} y2={150} stroke={wd} strokeWidth={9} strokeLinecap="round" />
        <line x1={66} y1={232} x2={44} y2={44} stroke={wd} strokeWidth={11} strokeLinecap="round" />
        {[70, 92, 114].map((yy) => <line key={yy} x1={46 + (150 - yy) * 0.02} y1={yy} x2={62} y2={yy + 22} stroke={wd} strokeWidth={0} />)}
        {[0, 1, 2].map((i) => <line key={i} x1={50 + i * 4} y1={60 + i * 2} x2={62 + i * 4} y2={148} stroke={wd} strokeWidth={5} />)}
        <rect x={30} y={38} width={34} height={12} rx={5} fill={wd} transform="rotate(-8 47 44)" />
        <rect x={62} y={142} width={96} height={13} rx={4} fill={wd} />
        <line x1={58} y1={104} x2={146} y2={108} stroke={wd} strokeWidth={8} strokeLinecap="round" />
        <line x1={142} y1={108} x2={146} y2={146} stroke={wd} strokeWidth={6} />
        {who && (<>
          <rect x={64} y={70} width={36} height={80} rx={13} fill={who.dark ? "#0c0c10" : who.top} transform="rotate(-8 82 150)" />
          {who.tie && <path d="M84,76 L88,76 L90,118 L86,124 L82,118 Z" fill="#8a1f1f" transform="rotate(-8 82 150)" />}
          <rect x={86} y={132} width={62} height={15} rx={7} fill={who.dark ? "#0c0c10" : who.skirt ? who.top : who.legs} />
          <rect x={136} y={140} width={13} height={62} rx={6} fill={who.dark ? "#0c0c10" : who.skirt ? sk : who.legs} transform="rotate(8 142 142)" />
          <path d="M84,86 L116,112 L136,104" fill="none" stroke={who.dark ? "#0c0c10" : who.top} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={78} cy={52} r={21} fill={sk} />
          <path d="M57,47 Q78,20 99,47 L99,40 Q78,13 57,40 Z" fill={who.dark ? "#0c0c10" : who.hair} />
        </>)}
        {lap && (<>
          <rect x={98} y={96} width={26} height={44} rx={10} fill={lap.top} />
          <circle cx={112} cy={84} r={14} fill="#f2c49b" />
          <path d="M98,80 Q112,62 126,80 L126,75 Q112,57 98,75 Z" fill={lap.hair} />
          <rect x={118} y={128} width={36} height={10} rx={5} fill={lap.legs} />
        </>)}
      </g>
    </svg>
  );
};

// casa de madera de barrio con porche (luz del porche 0-1, ventanas 0-1) — de frente
export const House: React.FC<{ x: number; base: number; w?: number; h?: number; body?: string; roof?: string; porch?: number; lit?: number; rocker?: boolean; dark?: boolean; door?: number }> = ({ x, base, w = 520, h = 300, body = "#c9b79a", roof = "#3b2a22", porch = 0, lit = 0, rocker, dark, door = 0 }) => {
  const f = useCurrentFrame();
  const b = dark ? "#1c2230" : body, r = dark ? "#0e121a" : roof;
  const win = (wx: number, wy: number) => (<g key={wx + "_" + wy}><rect x={wx} y={wy} width={70} height={80} fill={lit > 0 ? `rgba(255,${200 + 20 * Math.sin(f / 40 + wx)},120,${0.25 + 0.7 * lit})` : dark ? "#0b0f18" : "#3a4552"} stroke={dark ? "#2a3040" : "#efe6d4"} strokeWidth={6} /><line x1={wx + 35} y1={wy} x2={wx + 35} y2={wy + 80} stroke={dark ? "#2a3040" : "#efe6d4"} strokeWidth={4} /></g>);
  return (
    <svg width={w + 80} height={h + 200} viewBox={`0 0 ${w + 80} ${h + 200}`} style={{ position: "absolute", left: x - 40, top: base - h - 160, overflow: "visible" }}>
      {porch > 0 && <circle cx={40 + w * 0.5} cy={h + 70} r={170} fill={`url(#pl${x})`} opacity={porch} />}
      <defs><radialGradient id={`pl${x}`}><stop offset="0%" stopColor="#ffd890" stopOpacity={0.75} /><stop offset="100%" stopColor="#ffb050" stopOpacity={0} /></radialGradient></defs>
      <path d={`M20,160 L${40 + w / 2},20 L${60 + w},160 Z`} fill={r} />
      <rect x={40} y={150} width={w} height={h + 10} fill={b} />
      {Array.from({ length: Math.floor(h / 22) }).map((_, i) => <line key={i} x1={40} x2={40 + w} y1={170 + i * 22} y2={170 + i * 22} stroke="rgba(0,0,0,.12)" strokeWidth={2} />)}
      {win(70, 190)}{win(w - 70, 190)}
      {/* porche: techito sobre postes */}
      <rect x={10} y={h + 40} width={w + 60} height={18} fill={r} />
      {[24, w * 0.35 + 40, w * 0.65 + 40, w + 52].map((px, i) => <rect key={i} x={px} y={h + 56} width={10} height={104} fill={dark ? "#2a3040" : "#e8ddc8"} />)}
      <rect x={0} y={h + 156} width={w + 80} height={14} fill={dark ? "#141824" : "#6b5440"} />
      <rect x={w / 2 + 10} y={h + 66} width={60} height={92} fill={dark ? "#121620" : "#5a3a22"} />
      {door > 0 && <rect x={w / 2 + 10} y={h + 66} width={60 * door} height={92} fill="#ffd890" opacity={0.85} />}
      {porch > 0 && <circle cx={w / 2 + 92} cy={h + 82} r={9} fill="#fff4c8" opacity={porch} />}
      {lit > 0 && win(70, h + 70)}
    </svg>
  );
};

const Maple: React.FC<{ x: number; base: number; s?: number; c?: string }> = ({ x, base, s = 1, c = "#1d2a22" }) => {
  const f = useCurrentFrame(); const sw = Math.sin(f / 35 + x) * 2;
  return <svg width={300 * s} height={420 * s} viewBox="0 0 300 420" style={{ position: "absolute", left: x - 150 * s, top: base - 420 * s }}>
    <rect x={142} y={240} width={16} height={180} fill="#15100c" />
    <g transform={`rotate(${sw} 150 260)`}><circle cx={150} cy={170} r={110} fill={c} /><circle cx={90} cy={210} r={70} fill={c} /><circle cx={215} cy={205} r={75} fill={c} /><circle cx={150} cy={95} r={70} fill={c} /></g>
  </svg>;
};
const Car: React.FC<{ x: number; y: number; c: string; s?: number; flip?: boolean; lights?: number }> = ({ x, y, c, s = 1, flip, lights = 0 }) => (
  <svg width={260 * s} height={110 * s} viewBox="0 0 260 110" style={{ position: "absolute", left: x - 130 * s, top: y - 110 * s, transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <path d="M10,80 L20,52 L70,48 L100,18 L180,18 L215,48 L250,56 L252,80 Z" fill={c} />
    <path d="M108,26 L176,26 L200,48 L92,48 Z" fill="rgba(170,200,230,.55)" />
    <circle cx={64} cy={84} r={20} fill="#111" /><circle cx={200} cy={84} r={20} fill="#111" />
    {lights > 0 && <path d="M250,60 L420,40 L420,90 Z" fill="#ffe6a0" opacity={lights * 0.35} />}
  </svg>
);

// 1. LA CALLE: la casa de Diane (izq) y la de Mr. Walter (der) frente a frente.
// mode: dusk | dark (luz del porche apagada) | cross (Diane cruza) | night (cruza en pantuflas) | cars (llegan 3 autos) | sale (cartel) | lit (hoy: la luz prendida) | tuesday (la bolsa al cordón) | notue (no sale)
export const Street: React.FC<{ d: number; mode?: string; o?: Ov; at?: number }> = ({ d, mode = "dusk", o = {}, at = 30 }) => {
  const f = useCurrentFrame();
  const night = ["dark", "night", "lit"].includes(mode) ? 1 : mode === "dusk" || mode === "sale" ? 0.25 : 0.1;
  const crossT = ease(f, 10, Math.max(30, d - 20));
  const wDark = mode === "dark" || mode === "notue" ? 1 : 0;
  return (
    <Push d={d} k={0.05} ox="60% 60%">
      <AbsoluteFill style={{ filter: mode === "grey" ? GREY : undefined }}>
        <SunsetStage tree="pine" horizon={560} night={night} sunX={1500} pan={0.25}>
          <Maple x={330} base={780} s={0.9} />
          <House x={120} base={780} w={430} h={240} body="#9fb3a8" roof="#2e3a36" lit={night > 0.5 ? 0.6 : 0.1} porch={night > 0.5 && mode !== "lit" ? 0.5 : 0} />
          <House x={1180} base={780} w={540} h={290} body="#d6c3a0" lit={wDark ? 0 : mode === "lit" ? 0.8 : 0.35} porch={mode === "lit" ? 1 : wDark ? 0 : night > 0.5 ? 0.3 : 0} dark={false} />
          <Rocker x={1300} y={950 - 18} s={0.42} rock={mode === "lit" ? 0 : 3} o={mode === "lit" || mode === "sale" ? 0 : 1} dark={night > 0.5} />
          <Maple x={1820} base={800} s={1.1} c="#18241d" />
          {/* calle */}
          <div style={{ position: "absolute", left: 0, top: 800, width: 1920, height: 280, background: night > 0.5 ? "#141820" : "#4a4a4e" }} />
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 240 + 40, top: 935, width: 120, height: 10, background: night > 0.5 ? "#5a5a40" : "#e9d98a" }} />)}
          <div style={{ position: "absolute", left: 0, top: 790, width: 1920, height: 14, background: night > 0.5 ? "#252a34" : "#8a8680" }} />
          {/* farol */}
          <div style={{ position: "absolute", left: 900, top: 470, width: 10, height: 330, background: "#1a1a1e" }} />
          <div style={{ position: "absolute", left: 880, top: 460, width: 50, height: 22, borderRadius: 6, background: night > 0.5 ? "#ffe6a0" : "#333", boxShadow: night > 0.5 ? "0 0 60px 20px rgba(255,220,140,.35)" : "none" }} />
          {night > 0.5 && <div style={{ position: "absolute", left: 700, top: 480, width: 420, height: 600, background: "radial-gradient(ellipse at 50% 0%, rgba(255,220,140,.18), transparent 70%)" }} />}
          {(mode === "cross" || mode === "night") && <Fig x={interpolate(crossT, [0, 1], [420, 1480])} y={interpolate(crossT, [0, 0.15, 0.85, 1], [800, 1000, 1000, 800])} s={0.9} walk w={DIANE} />}
          {mode === "cars" && [0, 1, 2].map((i) => <Car key={i} x={interpolate(ease(f, 6 + i * 22, 40 + i * 22), [0, 1], [2300, 1050 + i * 290])} y={900} c={["#6a2a2a", "#2a3a5a", "#5a5a5a"][i]} s={1} flip />)}
          {mode === "sale" && <div style={{ position: "absolute", left: 1640, top: 640 + (1 - ease(f, at, at + 10)) * 40, opacity: ease(f, at, at + 10) }}>
            <div style={{ width: 8, height: 160, background: "#5a3a22", margin: "0 auto" }} /><div style={{ position: "absolute", top: 20, left: -90, width: 190, height: 110, background: "#f7f3ea", border: "6px solid #8a1f1f", fontFamily: F, fontWeight: 900, fontSize: 44, color: "#8a1f1f", textAlign: "center", lineHeight: "100px" }}>SOLD?</div></div>}
          {(mode === "tuesday" || mode === "notue") && <>
            {mode === "tuesday" && <Fig x={interpolate(ease(f, 6, d - 10), [0, 1], [1450, 1250])} y={800} s={0.85} w={WALTER} walk arms="hold" />}
            <div style={{ position: "absolute", left: 1150, top: 740, width: 70, height: 60, borderRadius: "40% 40% 10% 10%", background: "#151515", opacity: mode === "tuesday" ? ease(f, d - 12, d - 6) : 0 }} />
            <div style={{ position: "absolute", left: 1240, top: 690, width: 80, height: 110, background: "#5d6a72", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 140, top: 140, width: 300, padding: "14px 0", background: CREAM, borderRadius: 10, textAlign: "center", fontFamily: F, fontWeight: 900, color: INKP, boxShadow: "0 10px 24px rgba(0,0,0,.5)" }}>
              <div style={{ fontSize: 34, color: "#8a1f1f" }}>TUESDAY</div><div style={{ fontSize: 70 }}>7:00</div><div style={{ fontSize: 26 }}>AM</div></div>
            {mode === "notue" && <div style={{ position: "absolute", left: 1330, top: 580, fontFamily: F, fontWeight: 900, fontSize: 120, color: GOLD, opacity: ease(f, at, at + 8), transform: `scale(${0.8 + 0.2 * ease(f, at, at + 8)})`, textShadow: "0 4px 18px rgba(0,0,0,.7)" }}>?</div>}
          </>}
        </SunsetStage>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 2. EL PORCHE (pieza ancla): la mecedora siempre meciéndose.
// mode: couple (Walter y Helen) | empty (sola, luz apagada) | walter (él solo en la silla de ella) | talk (Diane al lado) | andy (Helen con Andy chico) | grey (pasado/muerte) | pickup (Andy se la lleva) | today (Diane, luz prendida, el hueco) | sunset (sola al atardecer)
export const Porch: React.FC<{ d: number; mode?: string; o?: Ov; at?: number }> = ({ d, mode = "empty", o = {}, at = 30 }) => {
  const f = useCurrentFrame();
  const night = mode === "empty" || mode === "grey" ? 0.9 : mode === "today" ? 0.8 : mode === "walter" || mode === "talk" ? 0.55 : 0.2;
  const lightOn = mode === "today" ? ease(f, 8, 20) : mode === "couple" || mode === "andy" ? 1 : mode === "talk" || mode === "walter" ? 0.6 : 0;
  const pick = mode === "pickup" ? ease(f, at, at + 60) : 0;
  return (
    <Push d={d} k={0.06} ox="45% 70%">
      <AbsoluteFill style={{ filter: mode === "grey" ? GREY : mode === "andy" ? SEPIA : undefined }}>
        <SunsetStage tree="pine" horizon={600} night={night} sunX={300} pan={0.2}>
          {/* pared de la casa */}
          <div style={{ position: "absolute", left: 640, top: 120, width: 1400, height: 760, background: night > 0.6 ? "#3a3a44" : "#cdb998", boxShadow: "inset 0 -40px 60px rgba(0,0,0,.25)" }} />
          {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 640, top: 140 + i * 26, width: 1400, height: 2, background: "rgba(0,0,0,.13)" }} />)}
          <div style={{ position: "absolute", left: 980, top: 330, width: 230, height: 280, background: lightOn > 0.3 ? "rgba(255,214,140,.85)" : "#1d2430", border: "12px solid #efe6d4" }} />
          <div style={{ position: "absolute", left: 1460, top: 300, width: 170, height: 580, background: "#5a3a22", border: "10px solid #efe6d4" }} />
          {/* luz del porche */}
          <div style={{ position: "absolute", left: 1350, top: 280, width: 34, height: 48, borderRadius: 8, background: lightOn > 0.05 ? "#fff3c4" : "#555", boxShadow: lightOn > 0.05 ? `0 0 ${60 * lightOn}px ${30 * lightOn}px rgba(255,214,140,.55)` : "none" }} />
          {lightOn > 0.05 && <div style={{ position: "absolute", left: 700, top: 260, width: 1400, height: 820, background: "radial-gradient(ellipse at 52% 5%, rgba(255,214,140,.32), transparent 65%)", opacity: lightOn }} />}
          {/* techo del porche y postes */}
          <div style={{ position: "absolute", left: 0, top: 70, width: 1920, height: 60, background: "#2a1d16" }} />
          {[180, 860, 1800].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 128, width: 36, height: 760, background: night > 0.6 ? "#6d6a64" : "#ece2cf" }} />)}
          {/* baranda */}
          <div style={{ position: "absolute", left: 0, top: 700, width: 640, height: 14, background: night > 0.6 ? "#6d6a64" : "#ece2cf" }} />
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 44, top: 712, width: 10, height: 170, background: night > 0.6 ? "#5a5852" : "#ddd2bd" }} />)}
          {/* piso */}
          <div style={{ position: "absolute", left: 0, top: 880, width: 1920, height: 200, background: "#6b4a30" }} />
          {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 890 + i * 24, width: 1920, height: 2, background: "rgba(0,0,0,.22)" }} />)}
          {/* flores */}
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 64, top: 860 - (i % 2) * 14 + Math.sin(f / 25 + i) * 2, width: 30, height: 30, borderRadius: "50%", background: mode === "empty" || mode === "grey" ? "#6a5a40" : i % 2 ? "#e2483a" : "#f08aa0" }} />)}
          {/* mecedoras */}
          {mode === "couple" && <><Rocker x={760} y={900} s={1.6} who={WALTER} ph={0} /><Rocker x={1180} y={900} s={1.6} who={HELEN} ph={1.3} /></>}
          {(mode === "empty" || mode === "grey" || mode === "sunset") && <Rocker x={980} y={900} s={1.9} rock={mode === "sunset" ? 3 : 5} />}
          {mode === "walter" && <Rocker x={980} y={900} s={1.9} who={WALTER} rock={3} />}
          {mode === "talk" && <><Rocker x={820} y={900} s={1.8} who={WALTER} rock={3} /><Fig x={1260} y={900} s={1.25} w={DIANE} flip /></>}
          {mode === "andy" && <Rocker x={980} y={900} s={1.9} who={HELEN} lap={{ top: "#4a7ab0", legs: "#2d3a5a", hair: "#7a5a3a" }} rock={6} />}
          {mode === "pickup" && <><Rocker x={interpolate(pick, [0, 1], [980, -300])} y={900 - Math.sin(pick * Math.PI) * 60} s={1.9} rock={1} />
            <Fig x={interpolate(pick, [0, 1], [1180, -100])} y={900} s={1.3} w={{ top: "#3c5a7a", legs: "#2a2a30", hair: "#4a3020" }} walk={pick > 0 && pick < 1} arms="hold" flip /></>}
          {mode === "today" && <><div style={{ position: "absolute", left: 900, top: 890, width: 220, height: 14, borderRadius: 7, background: "rgba(255,240,200,.35)", opacity: ease(f, 20, 40) }} />
            <Fig x={1300} y={900} s={1.25} w={DIANE} arms="hold" flip /></>}
        </SunsetStage>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 3. LA COCINA de Mr. Walter. mode: viewing (Diane sirve café, los 3 cuchichean en el pasillo) | stories (café + burbujas de recuerdos) | cry (Diane sola en su cocina; se acuerda del sobre) | daughter (la llave pasa de mano) | wash
export const Kitchen: React.FC<{ d: number; mode?: string; o?: Ov; at?: number; ats?: number[]; bubbles?: string[] }> = ({ d, mode = "stories", o = {}, at = 40, ats, bubbles = [] }) => {
  const f = useCurrentFrame();
  const steam = (x: number, y: number, k: number) => Array.from({ length: 3 }).map((_, i) => { const t = ((f + i * 20 + k * 7) % 60) / 60; return <div key={i} style={{ position: "absolute", left: x + Math.sin(t * 6 + i) * 10, top: y - t * 80, width: 14, height: 30, borderRadius: 10, background: "rgba(255,255,255,.35)", opacity: 1 - t, filter: "blur(3px)" }} />; });
  const key = mode === "daughter" ? ease(f, at, at + 30) : 0;
  return (
    <Push d={d} k={0.05} ox="50% 60%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b2e24 0%,#2a2019 60%,#1b140f 100%)" }}>
        {/* ventana */}
        <div style={{ position: "absolute", left: 700, top: 120, width: 520, height: 360, border: "16px solid #efe6d4", background: mode === "cry" ? "linear-gradient(180deg,#2a3550,#14263a)" : "linear-gradient(180deg,#e8833a,#c4522a 60%,#2a3550)", overflow: "hidden" }}>
          {mode === "cry" && Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 500, top: ((f * (3 + rnd(i, 4) * 3) + rnd(i, 5) * 400) % 400) - 40, width: 3, height: 26, background: "rgba(200,220,255,.5)" }} />)}
          <div style={{ position: "absolute", left: 244, top: 0, width: 16, height: 360, background: "#efe6d4" }} />
        </div>
        {/* alacena y mesada */}
        <div style={{ position: "absolute", left: 0, top: 100, width: 600, height: 300, background: "#6b8a7a", borderBottom: "10px solid #4a6256" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 195, top: 120, width: 180, height: 260, border: "4px solid #4a6256" }} />)}
        <div style={{ position: "absolute", left: 0, top: 560, width: 640, height: 40, background: "#d8cdb8" }} />
        <div style={{ position: "absolute", left: 0, top: 600, width: 640, height: 480, background: "#6b8a7a" }} />
        {/* reloj de pared */}
        <svg width={140} height={140} style={{ position: "absolute", left: 1380, top: 150 }}><circle cx={70} cy={70} r={60} fill={CREAM} stroke="#8a1f1f" strokeWidth={8} /><line x1={70} y1={70} x2={70 + 40 * Math.sin(f / 30)} y2={70 - 40 * Math.cos(f / 30)} stroke={INKP} strokeWidth={5} strokeLinecap="round" /><line x1={70} y1={70} x2={100} y2={80} stroke={INKP} strokeWidth={7} strokeLinecap="round" /></svg>
        {/* mesa */}
        <div style={{ position: "absolute", left: 780, top: 760, width: 900, height: 34, background: "#8a5a32", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 800, top: 740, width: 860, height: 24, background: "repeating-linear-gradient(90deg,#c84a3a 0 40px,#efe6d4 40px 80px)", opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 820, top: 794, width: 24, height: 280, background: "#5e3b20" }} /><div style={{ position: "absolute", left: 1620, top: 794, width: 24, height: 280, background: "#5e3b20" }} />
        <div style={{ position: "absolute", left: 0, top: 1000, width: 1920, height: 80, background: "#1a120c" }} />
        {(mode === "stories" || mode === "cry") && <><div style={{ position: "absolute", left: 1080, top: 700, width: 54, height: 46, borderRadius: "0 0 14px 14px", background: CREAM }} />{steam(1096, 690, 1)}</>}
        {mode === "stories" && <><div style={{ position: "absolute", left: 1330, top: 700, width: 54, height: 46, borderRadius: "0 0 14px 14px", background: CREAM }} />{steam(1346, 690, 2)}
          <Fig x={900} y={1000} s={1.35} w={WALTER} bend={-4} /><Fig x={1560} y={1000} s={1.3} w={DIANE} flip />
          {bubbles.map((b, i) => { const t = ease(f, ats ? ats[i] : at + i * 40, (ats ? ats[i] : at + i * 40) + 12); return <div key={i} style={{ position: "absolute", left: 640 + i * 220, top: 300 + (i % 2) * 60, opacity: t, transform: `scale(${0.6 + 0.4 * t}) translateY(${Math.sin(f / 20 + i) * 6}px)`, padding: "16px 26px", borderRadius: 40, background: "rgba(250,248,244,.96)", fontFamily: F, fontWeight: 800, fontSize: 40, color: INKP, boxShadow: "0 8px 20px rgba(0,0,0,.4)", whiteSpace: "nowrap" }}>{b}</div>; })}
        </>}
        {mode === "cry" && <><Fig x={1240} y={1000} s={1.35} w={DIANE} bend={10} arms="hug" />
          <div style={{ position: "absolute", left: 1330, top: 380, opacity: ease(f, at, at + 10), transform: `scale(${0.7 + 0.3 * ease(f, at, at + 10)})` }}>
            <div style={{ width: 230, height: 150, background: "#d9b77a", borderRadius: 6, border: "4px solid #b8955a", boxShadow: "0 10px 26px rgba(0,0,0,.5)", position: "relative" }}><div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "115px solid transparent", borderRight: "115px solid transparent", borderTop: "80px solid #c9a566" }} /></div>
            <div style={{ fontFamily: HAND, fontSize: 46, color: GOLD, marginTop: 8, transform: "rotate(-5deg)", textShadow: "0 3px 8px #000" }}>the envelope!</div></div></>}
        {(mode === "viewing" || mode === "wash") && <><Fig x={400} y={1000} s={1.4} w={DIANE} arms="out" bend={4} />{steam(470, 520, 3)}
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 300 + i * 56, top: 520, width: 40, height: 48, background: "#fff", borderRadius: "0 0 8px 8px", opacity: ease(f, i * 8, i * 8 + 6) }} />)}</>}
        {mode === "viewing" && <>
          <div style={{ position: "absolute", left: 1720, top: 300, width: 200, height: 700, background: "#120d0a" }} />
          {[0, 1, 2].map((i) => <Fig key={i} x={1760 + i * 50} y={1000} s={1.2 - i * 0.08} w={{ dark: true, skirt: i === 1 }} bend={-6} />)}
          {bubbles.map((b, i) => { const t = ease(f, at + i * 30, at + i * 30 + 10); return <div key={i} style={{ position: "absolute", left: 1000 + (i % 2) * 120, top: 210 + i * 120, opacity: t, padding: "12px 22px", borderRadius: 30, background: "rgba(20,14,10,.9)", border: `3px solid ${RED}`, fontFamily: F, fontWeight: 800, fontSize: 38, color: INK, whiteSpace: "nowrap" }}>{b}</div>; })}
        </>}
        {mode === "daughter" && <>
          <Fig x={700} y={1000} s={1.4} w={DIANE} arms="out" />
          <Fig x={1300} y={1000} s={1.45} w={{ dark: true, skirt: true }} arms="out" flip />
          <svg width={90} height={50} viewBox="0 0 90 50" style={{ position: "absolute", left: interpolate(key, [0, 1], [800, 1110]), top: 760 - Math.sin(key * Math.PI) * 50, filter: `drop-shadow(0 0 ${10 + 10 * key}px ${GOLD})` }}><circle cx={18} cy={25} r={15} fill="none" stroke={GOLD} strokeWidth={8} /><rect x={30} y={21} width={52} height={9} fill={GOLD} /><rect x={66} y={28} width={8} height={12} fill={GOLD} /><rect x={76} y={28} width={6} height={9} fill={GOLD} /></svg>
        </>}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 4. LA MESA PARA CINCO (vista cenital): se ponen los 5 platos de florcitas azules; mode two = comen dos, tres vacíos grises; napkins = las 3 servilletas vuelven al cajón de a una
const Plate: React.FC<{ x: number; y: number; o?: number; grey?: boolean; food?: number }> = ({ x, y, o = 1, grey, food = 0 }) => (
  <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, opacity: o, filter: grey ? "grayscale(1) brightness(.6)" : undefined }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#f7f4ee", boxShadow: "0 8px 18px rgba(0,0,0,.45)" }} />
    {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 90 + Math.cos(i / 12 * Math.PI * 2) * 74 - 7, top: 90 + Math.sin(i / 12 * Math.PI * 2) * 74 - 7, width: 14, height: 14, borderRadius: "50%", background: "#3d6fc0" }} />)}
    <div style={{ position: "absolute", inset: 34, borderRadius: "50%", border: "2px solid #d8d2c4" }} />
    {food > 0 && <div style={{ position: "absolute", inset: 52, borderRadius: "40% 55% 45% 50%", background: "#b8763a", opacity: food }} />}
  </div>
);
export const TableFive: React.FC<{ d: number; mode?: string; o?: Ov; at?: number }> = ({ d, mode = "set", o = {}, at = 40 }) => {
  const f = useCurrentFrame();
  const P = [[960, 330], [620, 480], [1300, 480], [740, 760], [1180, 760]];
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "#2a1d14" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "repeating-linear-gradient(90deg,#3a2818 0 120px,#33231a 120px 240px)" }} />
        <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 780, borderRadius: 60, background: "#f1ece2", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 780, borderRadius: 60, background: "repeating-linear-gradient(45deg,transparent 0 30px,rgba(0,0,0,.025) 30px 60px)" }} />
        {/* vela */}
        <div style={{ position: "absolute", left: 930, top: 520, width: 60, height: 60, borderRadius: "50%", background: "#efe0b0", boxShadow: `0 0 ${50 + 10 * Math.sin(f / 4)}px ${20 + 5 * Math.sin(f / 3)}px rgba(255,190,90,.55)` }} />
        {P.map(([x, y], i) => {
          const t = mode === "set" ? ease(f, 6 + i * 14, 14 + i * 14) : 1;
          const empty = (mode === "two" || mode === "napkins") && i > 1;
          const nap = mode === "napkins" && i > 1 ? ease(f, at + (i - 2) * 40, at + (i - 2) * 40 + 30) : 0;
          return <React.Fragment key={i}>
            <Plate x={x} y={y + (1 - t) * -30} o={t} grey={empty} food={mode === "two" && i < 2 ? 1 - ease(f, 20, d) * 0.7 : 0} />
            <div style={{ position: "absolute", left: x + 100 + nap * 900 * (x > 960 ? 1 : -1), top: y - 60, width: 50, height: 120, background: "#fff", borderRadius: 6, boxShadow: "0 4px 10px rgba(0,0,0,.35)", opacity: t * (1 - nap), transform: `rotate(${nap * 30}deg)` }} />
          </React.Fragment>;
        })}
        {mode === "set" && <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 150, color: ORA, opacity: ease(f, 70, 80) }}>5</div>}
        {mode === "two" && <div style={{ position: "absolute", left: 1600, top: 140, fontFamily: F, fontWeight: 900, fontSize: 110, lineHeight: 1, color: INK, textAlign: "right", opacity: ease(f, 15, 25) }}>2<span style={{ fontSize: 50, color: "rgba(240,235,229,.6)" }}> of </span><span style={{ color: RED }}>5</span></div>}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// la espera: Mr. Walter con camisa de domingo y corbata, sentado a la cabecera, mirando por la ventana; el reloj corre
export const Waiting: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const snow = Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 2) * 560 + Math.sin(f / 30 + i) * 12, top: ((f * (0.8 + rnd(i, 3)) + rnd(i, 4) * 420) % 420), width: 6, height: 6, borderRadius: 3, background: "#fff", opacity: 0.8 }} />);
  return (
    <Push d={d} k={0.07} ox="35% 50%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#2b2430,#1a1418)" }}>
        <div style={{ position: "absolute", left: 160, top: 120, width: 560, height: 420, border: "18px solid #efe6d4", background: "linear-gradient(180deg,#8a96a8,#c8ccd4)", overflow: "hidden" }}>{snow}<div style={{ position: "absolute", left: 272, top: 0, width: 16, height: 420, background: "#efe6d4" }} /></div>
        <svg width={150} height={150} style={{ position: "absolute", left: 1480, top: 110 }}><circle cx={75} cy={75} r={64} fill={CREAM} stroke={WOOD} strokeWidth={10} /><line x1={75} y1={75} x2={75 + 46 * Math.sin(f / 12)} y2={75 - 46 * Math.cos(f / 12)} stroke={INKP} strokeWidth={5} strokeLinecap="round" /><line x1={75} y1={75} x2={75 + 30 * Math.sin(f / 140)} y2={75 - 30 * Math.cos(f / 140)} stroke={INKP} strokeWidth={8} strokeLinecap="round" /></svg>
        <div style={{ position: "absolute", left: 600, top: 740, width: 1320, height: 30, background: "#f1ece2" }} />
        <div style={{ position: "absolute", left: 600, top: 770, width: 1320, height: 200, background: "linear-gradient(180deg,#e7e0d2,#b9b0a0)" }} />
        {[900, 1200, 1500].map((x, i) => <React.Fragment key={x}><div style={{ position: "absolute", left: x - 70, top: 718, width: 140, height: 24, borderRadius: "50%", background: "#f7f4ee", border: "4px solid #3d6fc0" }} /><div style={{ position: "absolute", left: x - 60, top: 480, width: 120, height: 260, borderRadius: "16px 16px 0 0", border: "10px solid #5e3b20", borderBottom: "none" }} /></React.Fragment>)}
        <Fig x={640} y={1000} s={1.6} w={{ ...WALTER, top: "#f4f1ea", tie: true }} bend={-2} flip />
        <div style={{ position: "absolute", left: 0, top: 960, width: 1920, height: 120, background: "#120c0a" }} />
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 5. SEIS AÑOS: el almanaque se deshoja año por año y se apilan los oficios (pan, olla, auto, pastillero); contador YEAR 1→6
const ICONS: Record<string, React.ReactNode> = {
  bread: <svg viewBox="0 0 100 100"><path d="M10,60 Q10,25 50,25 Q90,25 90,60 L90,80 L10,80 Z" fill="#d89a52" /><path d="M30,40 l10,14 M50,36 l10,14 M70,40 l8,12" stroke="#a96a2a" strokeWidth={5} /></svg>,
  pot: <svg viewBox="0 0 100 100"><rect x={15} y={40} width={70} height={45} rx={8} fill="#8a96a8" /><rect x={8} y={34} width={84} height={10} rx={4} fill="#5d6a7a" /><path d="M35,28 q5,-12 0,-22 M55,28 q5,-12 0,-22" stroke="#ddd" strokeWidth={4} fill="none" /></svg>,
  car: <svg viewBox="0 0 100 100"><path d="M8,66 L14,50 L32,46 L42,32 L70,32 L82,46 L94,50 L94,66 Z" fill="#c4522a" /><circle cx={30} cy={68} r={9} fill="#111" /><circle cx={76} cy={68} r={9} fill="#111" /></svg>,
  pills: <svg viewBox="0 0 100 100"><rect x={6} y={36} width={88} height={30} rx={6} fill="#e8e2d6" />{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={10 + i * 12} y={40} width={10} height={22} rx={2} fill={["#e2483a", "#edb269", "#e9c762", "#7ac27a", "#4f9de3", "#9a7ae3", "#e37ab0"][i]} />)}</svg>,
  door: <svg viewBox="0 0 100 100"><rect x={28} y={10} width={44} height={84} fill="#5a3a22" /><circle cx={62} cy={54} r={4} fill={GOLD} /></svg>,
  plate: <svg viewBox="0 0 100 100"><circle cx={50} cy={50} r={40} fill="#f7f4ee" />{Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={50 + Math.cos(i / 10 * 6.28) * 32} cy={50 + Math.sin(i / 10 * 6.28) * 32} r={4} fill="#3d6fc0" />)}</svg>,
  cross: <svg viewBox="0 0 100 100"><rect x={38} y={12} width={24} height={76} fill="#e2483a" /><rect x={12} y={38} width={76} height={24} fill="#e2483a" /></svg>,
  slipper: <svg viewBox="0 0 100 100"><path d="M14,64 Q14,40 44,40 L80,46 Q94,50 92,64 Q90,76 70,76 L26,76 Q14,76 14,64 Z" fill="#9a7ae3" /><path d="M44,40 Q60,30 80,46" fill="#7a5ac3" /></svg>,
  curtain: <svg viewBox="0 0 100 100"><rect x={14} y={12} width={72} height={76} fill="#c8d8f0" /><path d="M14,12 Q30,50 22,88 L14,88 Z M86,12 Q70,50 78,88 L86,88 Z" fill="#f4f1ea" /></svg>,
  chair: <svg viewBox="0 0 100 100"><path d="M10,88 Q50,100 90,86" stroke={WOOD} strokeWidth={6} fill="none" /><line x1={30} y1={90} x2={22} y2={14} stroke={WOOD} strokeWidth={7} /><rect x={28} y={56} width={46} height={7} fill={WOOD} /><line x1={70} y1={90} x2={70} y2={58} stroke={WOOD} strokeWidth={6} /></svg>,
  envelope: <svg viewBox="0 0 100 100"><rect x={8} y={24} width={84} height={56} rx={4} fill="#d9b77a" /><path d="M8,24 L50,56 L92,24" stroke="#a8864a" strokeWidth={4} fill="none" /></svg>,
  bulb: <svg viewBox="0 0 100 100"><circle cx={50} cy={42} r={26} fill="#ffe6a0" /><rect x={40} y={66} width={20} height={18} fill="#999" /><circle cx={50} cy={42} r={40} fill="rgba(255,220,140,.25)" /></svg>,
  phone: <svg viewBox="0 0 100 100"><path d="M20,30 Q20,14 36,14 L64,14 Q80,14 80,30 L74,40 L60,36 L58,26 L42,26 L40,36 L26,40 Z" fill="#e8dcc0" /><rect x={30} y={44} width={40} height={40} rx={8} fill="#e8dcc0" /></svg>,
};
export const Years: React.FC<{ d: number; o?: Ov; n?: number }> = ({ d, o = {}, n = 6 }) => {
  const f = useCurrentFrame();
  const span = Math.max(60, d - 50);
  const yr = Math.min(n, 1 + Math.floor(ease(f, 10, span) * n * 0.999));
  const flip = ((f - 10) / (span / n)) % 1;
  const jobs = ["door", "bread", "pot", "car", "pills"];
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 80%)" }}>
        {/* almanaque */}
        <div style={{ position: "absolute", left: 220, top: 210, width: 520, height: 620, background: CREAM, borderRadius: 14, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
          <div style={{ height: 120, background: "#8a1f1f", borderRadius: "14px 14px 0 0", fontFamily: F, fontWeight: 900, fontSize: 64, color: INK, textAlign: "center", lineHeight: "120px", letterSpacing: 4 }}>YEAR {yr}</div>
          {Array.from({ length: 35 }).map((_, i) => { const on = i < Math.floor(((f - 10) % (span / n)) / (span / n) * 35) || yr === n && f > span; return <div key={i} style={{ position: "absolute", left: 24 + (i % 7) * 68, top: 150 + Math.floor(i / 7) * 88, width: 60, height: 76, fontFamily: F, fontWeight: 800, fontSize: 28, color: INKP, textAlign: "center", lineHeight: "76px" }}>{i + 1}{on && <span style={{ position: "absolute", left: 6, top: 6, fontFamily: HAND, fontSize: 56, color: RED, lineHeight: "60px" }}>✕</span>}</div>; })}
          {f > 10 && f < span && <div style={{ position: "absolute", left: 0, top: 120, width: 520, height: 500, background: CREAM, transformOrigin: "top", transform: `rotateX(${flip * 90}deg)`, opacity: 1 - flip, boxShadow: "0 10px 20px rgba(0,0,0,.3)" }} />}
        </div>
        {/* oficios que se apilan */}
        {jobs.map((j, i) => { const t = ease(f, 14 + i * (span / 6), 24 + i * (span / 6)); return <div key={j} style={{ position: "absolute", left: 900 + (i % 3) * 300, top: 250 + Math.floor(i / 3) * 300 + Math.sin(f / 18 + i) * 6, width: 240, height: 240, opacity: t, transform: `scale(${0.6 + 0.4 * t})`, background: "rgba(240,235,229,.08)", border: `4px solid ${ORA}`, borderRadius: 28, padding: 30 }}>{ICONS[j]}</div>; })}
        <div style={{ position: "absolute", left: 220, top: 880, fontFamily: F, fontWeight: 900, fontSize: 70, color: ORA, opacity: ease(f, span, span + 12) }}>{n} YEARS.</div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 6. 40 MINUTOS: mapa cenital, el auto hace la ruta de la ciudad a la casa en 40 min; el teléfono que no suena
export const Route40: React.FC<{ d: number; o?: Ov; mode?: string }> = ({ d, o = {}, mode = "route" }) => {
  const f = useCurrentFrame();
  const p = ease(f, 12, Math.max(40, d * 0.7));
  const path = "M300,820 C520,780 520,520 760,500 S1100,640 1240,420 S1500,260 1640,300";
  const min = Math.round(p * 40);
  return (
    <Push d={d} k={0.05} ox="70% 40%">
      <AbsoluteFill style={{ background: "#1e2a24" }}>
        {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 2) * 1800, top: rnd(i, 3) * 1000, width: 80 + rnd(i, 4) * 160, height: 60 + rnd(i, 5) * 120, borderRadius: 14, background: "#24332b" }} />)}
        {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 120 + (i % 4) * 70, top: 700 + Math.floor(i / 4) * 70, width: 56, height: 56, background: "#3a4a56" }} />)}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={path} fill="none" stroke="#3a4a42" strokeWidth={34} strokeLinecap="round" />
          <path d={path} fill="none" stroke={ORA} strokeWidth={10} strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p} />
        </svg>
        <div style={{ position: "absolute", left: 120, top: 920, fontFamily: F, fontWeight: 800, fontSize: 34, color: "rgba(240,235,229,.7)" }}>THE CITY</div>
        <div style={{ position: "absolute", left: 1600, top: 230, width: 90, height: 70 }}><svg viewBox="0 0 90 70" width={90} height={70}><path d="M5,35 L45,5 L85,35 L85,68 L5,68 Z" fill={CREAM} /><rect x={36} y={42} width={18} height={26} fill={WOOD2} /></svg></div>
        <div style={{ position: "absolute", left: 1520, top: 150, fontFamily: F, fontWeight: 800, fontSize: 34, color: INK }}>DAD'S HOUSE</div>
        <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 190, lineHeight: 1, color: ORA, fontVariantNumeric: "tabular-nums" }}>{min}<span style={{ fontSize: 80, color: INK }}> MIN</span></div>
        {mode === "phone" && <div style={{ position: "absolute", left: 1500, top: 600, width: 260, height: 260, opacity: ease(f, 20, 30), transform: `rotate(${Math.sin(f / 30) * 2}deg)` }}>{ICONS.phone}<div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 40, color: RED }}>0 CALLS</div></div>}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 7. LA CAÍDA en el baño: la noche entera en el piso; el reloj corre de la medianoche al amanecer (sin morbo: sentado contra la bañera)
export const FallNight: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 5, d - 5);
  const h = Math.floor(interpolate(p, [0, 1], [23, 29.6])) % 24, m = Math.floor((interpolate(p, [0, 1], [23, 29.6]) % 1) * 60);
  return (
    <Push d={d} k={0.06} ox="40% 60%">
      <AbsoluteFill style={{ background: "#141a22" }}>
        <div style={{ position: "absolute", left: 1220, top: 140, width: 300, height: 260, border: "14px solid #d8d2c4", background: `linear-gradient(180deg, ${p > 0.75 ? "#d88a5a" : "#0c1424"}, ${p > 0.75 ? "#e8b48a" : "#1a2a44"})`, transition: "none" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 760, background: "repeating-linear-gradient(90deg,#c8d0d4 0 58px,#b8c0c4 58px 60px), repeating-linear-gradient(0deg,transparent 0 58px,#b8c0c4 58px 60px)", opacity: 0.25 + 0.4 * p }} />
        <div style={{ position: "absolute", left: 0, top: 760, width: 1920, height: 320, background: "repeating-conic-gradient(#e8e8e4 0 25%, #d0d0cc 0 50%) 0 0/60px 60px", opacity: 0.25 + 0.5 * p }} />
        <div style={{ position: "absolute", left: 260, top: 520, width: 760, height: 280, borderRadius: "30px 30px 60px 60px", background: "#f2f0ea", opacity: 0.35 + 0.55 * p }} />
        <svg width={460} height={300} viewBox="0 0 460 300" style={{ position: "absolute", left: 900, top: 620, opacity: 0.5 + 0.5 * p, transform: `translateY(${Math.sin(f / 22) * 2}px)` }}>
          <rect x={30} y={60} width={80} height={130} rx={26} fill={WALTER.top} transform="rotate(-12 70 190)" />
          <circle cx={58} cy={40} r={34} fill={WALTER.skin} /><path d="M24,32 Q58,0 92,32 L92,24 Q58,-8 24,24 Z" fill={WALTER.hair} />
          <rect x={90} y={168} width={220} height={26} rx={13} fill={WALTER.legs} /><rect x={110} y={192} width={210} height={26} rx={13} fill={WALTER.legs} />
          <line x1={150} y1={260} x2={430} y2={232} stroke="#3a2414" strokeWidth={10} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 140, top: 130, padding: "12px 26px", borderRadius: 14, background: "#0c0c0e", border: "3px solid #333", fontFamily: F, fontWeight: 900, fontSize: 90, color: "#ff3b30", textShadow: "0 0 16px #ff3b30", fontVariantNumeric: "tabular-nums" }}>{(h % 12 || 12)}:{String(m).padStart(2, "0")} <span style={{ fontSize: 44 }}>{h < 12 ? "AM" : "PM"}</span></div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 8. LOS TRES HIJOS en silueta, con lo que dice cada uno en una burbuja sobre la cabeza
export const Kids: React.FC<{ d: number; o?: Ov; lines?: string[]; at?: number; ats?: number[]; mode?: string; hl?: number }> = ({ d, o = {}, lines = [], at = 10, ats, mode = "talk", hl = -1 }) => {
  const f = useCurrentFrame();
  const X = [520, 960, 1400], who = ["THE OLDEST", "THE DAUGHTER", "THE YOUNGEST"];
  return (
    <Push d={d} k={0.09} ox={`${50 + Math.sin(f / 70) * 8}% 45%`}>
      <AbsoluteFill style={{ background: mode === "office" ? "linear-gradient(180deg,#3a2d22,#1a130d)" : "radial-gradient(ellipse at 50% 70%, #3b2a34 0%, #0e0a10 80%)" }}>
        {mode === "office" && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "repeating-linear-gradient(90deg,#4a3828 0 140px,#3e2f22 140px 280px)", opacity: 0.6 }} />}
        {/* luz que barre despacio + polvo en el aire: la escena nunca queda quieta */}
        <div style={{ position: "absolute", left: 960 + Math.sin(f / 45) * 620 - 520, top: 120, width: 1040, height: 900, background: "radial-gradient(closest-side, rgba(255,214,160,.22) 0%, transparent 100%)" }} />
        {Array.from({ length: 46 }).map((_, i) => <div key={"p" + i} style={{ position: "absolute", left: (rnd(i, 4) * 1920 + f * (0.4 + rnd(i, 6))) % 1920, top: 1000 - ((rnd(i, 5) * 1000 + f * (0.8 + rnd(i, 7) * 1.2)) % 1000), width: 4, height: 4, borderRadius: 2, background: "rgba(255,230,200,.55)" }} />)}
        <div style={{ position: "absolute", left: 0, top: 900, width: 1920, height: 180, background: "#120c0a" }} />
        {X.map((x, i) => {
          const t = ease(f, 4 + i * 6, 14 + i * 6), sa = ats ? ats[i] ?? at : at + i * 26, say = ease(f, sa, sa + 10);
          const dim = hl >= 0 && hl !== i;
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 160, top: 930, width: 320, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.4)" }} />
            <div style={{ opacity: t * (dim ? 0.4 : 1), transform: `translate(${Math.sin(f / 26 + i * 2) * 6}px, ${Math.sin(f / 17 + i) * 3}px)` }}><Fig x={x} y={920} s={[1.75, 1.6, 1.5][i]} w={{ dark: true, skirt: i === 1 }} arms={mode === "letters" ? "hold" : mode === "phones" ? "hold" : "down"} /></div>
            {mode === "letters" && <div style={{ position: "absolute", left: x + 40, top: 600, width: 70, height: 50, background: "#f7f3ea", transform: `rotate(${-10 + Math.sin(f / 20 + i) * 3}deg)`, opacity: t }} />}
            {mode === "phones" && <div style={{ position: "absolute", left: x + 34, top: 560, width: 36, height: 64, borderRadius: 6, background: "#222", border: "3px solid #555", boxShadow: say > 0 ? `0 0 20px ${ORA}` : "none" }} />}
            <div style={{ position: "absolute", left: x - 150, top: 940, width: 300, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: dim ? "rgba(240,235,229,.35)" : "rgba(240,235,229,.85)", opacity: t }}>{who[i]}</div>
            {lines[i] && <div style={{ position: "absolute", left: x - 280, width: 560, top: 220 - (i % 2) * 50, textAlign: "center", opacity: say, transform: `translateY(${(1 - say) * 20 + Math.sin(f / 22 + i) * 4}px)` }}>
              <div style={{ display: "inline-block", padding: "16px 24px", borderRadius: 26, background: "rgba(250,248,244,.96)", fontFamily: F, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: INKP, boxShadow: "0 8px 20px rgba(0,0,0,.45)" }}>{lines[i]}</div></div>}
          </React.Fragment>;
        })}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 9. EL HOSPITAL: la cama, el monitor que late, la silla de plástico con Diane; NIGHT 1→4; arriba lo que hizo cada hijo
export const Hospital: React.FC<{ d: number; o?: Ov; mode?: string }> = ({ d, o = {}, mode = "nights" }) => {
  const f = useCurrentFrame();
  const night = Math.min(4, 1 + Math.floor(ease(f, 10, d - 10) * 4 * 0.999));
  const ecg = Array.from({ length: 60 }).map((_, i) => { const x = i * 8; const ph = (i + f * 0.8) % 30; const y = ph > 12 && ph < 14 ? -40 : ph >= 14 && ph < 16 ? 30 : ph >= 16 && ph < 17 ? -10 : 0; return `${i ? "L" : "M"}${x},${60 + y}`; }).join(" ");
  return (
    <Push d={d} k={0.05} ox="45% 55%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#1c2a33,#0e161c)" }}>
        <div style={{ position: "absolute", left: 1300, top: 140, width: 420, height: 320, border: "14px solid #9aa8b0", background: "linear-gradient(180deg,#0a1220,#1a2a44)" }}>{Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 38, width: 392, height: 16, background: "rgba(200,210,220,.45)" }} />)}</div>
        <div style={{ position: "absolute", left: 300, top: 600, width: 860, height: 60, background: "#e8eef0", borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 300, top: 520, width: 860, height: 90, background: "#c8d8e0", borderRadius: "40px 10px 0 0" }} />
        <div style={{ position: "absolute", left: 310, top: 500, width: 200, height: 80, background: "#fff", borderRadius: 30 }} />
        <div style={{ position: "absolute", left: 300, top: 660, width: 20, height: 300, background: "#8a98a0" }} /><div style={{ position: "absolute", left: 1140, top: 660, width: 20, height: 300, background: "#8a98a0" }} />
        <div style={{ position: "absolute", left: 420, top: 470, width: 70, height: 70, borderRadius: "50%", background: WALTER.skin }} />
        <div style={{ position: "absolute", left: 412, top: 462, width: 86, height: 40, borderRadius: "40px 40px 6px 6px", background: WALTER.hair }} />
        <div style={{ position: "absolute", left: mode === "kids" ? 980 : 600, top: 300, width: mode === "kids" ? 300 : 500, height: 160, background: "#05140c", border: "8px solid #3a4a52", borderRadius: 12, overflow: "hidden" }}>
          <svg width={484} height={120} style={{ position: "absolute", left: 0, top: 10 }}><path d={ecg} fill="none" stroke={GLOW} strokeWidth={4} /></svg></div>
        <div style={{ position: "absolute", left: 1200, top: 880, width: 220, height: 20, background: "#e0e0d8" }} />
        <Fig x={1310} y={960} s={1.3} w={DIANE} bend={8} arms="hug" />
        <div style={{ position: "absolute", left: 0, top: 960, width: 1920, height: 120, background: "#0a1014" }} />
        {mode === "nights" && <div style={{ position: "absolute", left: 120, top: 110, fontFamily: F, fontWeight: 900, fontSize: 120, lineHeight: 1, color: ORA }}>NIGHT {night}<span style={{ fontSize: 50, color: "rgba(240,235,229,.6)" }}> / 4</span></div>}
        {mode === "kids" && [["THE SON", "1 call"], ["THE DAUGHTER", "1 text"], ["THE YOUNGEST", "never knew"]].map(([a, b], i) => { const t = ease(f, 10 + i * 40, 20 + i * 40); return <div key={a} style={{ position: "absolute", left: 120, top: 110 + i * 110, opacity: t, transform: `translateX(${(1 - t) * -40}px)`, fontFamily: F, fontWeight: 900, fontSize: 52, color: INK }}>{a}: <span style={{ color: i === 2 ? RED : ORA }}>{b}</span></div>; })}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 10. HUELLAS en el mapa cenital: de la casa de Diane a la de Mr. Walter, en pantuflas, a las 3 de la mañana
export const Tracks: React.FC<{ d: number; o?: Ov; label?: string }> = ({ d, o = {}, label = "3:00 AM" }) => {
  const f = useCurrentFrame();
  const n = 14, p = ease(f, 8, Math.max(30, d - 15));
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "#16201a" }}>
        <div style={{ position: "absolute", left: 0, top: 400, width: 1920, height: 280, background: "#1d2228" }} />
        {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 210, top: 535, width: 110, height: 10, background: "#5a5a40" }} />)}
        <div style={{ position: "absolute", left: 300, top: 110, width: 420, height: 260, background: "#2e3a36", border: "8px solid #46524e" }}><div style={{ fontFamily: F, fontWeight: 800, fontSize: 34, color: INK, textAlign: "center", lineHeight: "240px" }}>DIANE</div></div>
        <div style={{ position: "absolute", left: 1150, top: 700, width: 480, height: 280, background: "#3b2a22", border: "8px solid #56423a" }}><div style={{ fontFamily: F, fontWeight: 800, fontSize: 34, color: INK, textAlign: "center", lineHeight: "260px" }}>MR. WALTER</div></div>
        <div style={{ position: "absolute", left: 1330, top: 690, width: 110, height: 40, background: `rgba(255,214,140,${0.4 + 0.4 * Math.sin(f / 6)})`, boxShadow: "0 0 40px rgba(255,214,140,.6)" }} />
        {Array.from({ length: n }).map((_, i) => { const t = i / n; const x = interpolate(t, [0, 1], [520, 1360]), y = interpolate(t, [0, 1], [400, 690]); const on = p > t; return <div key={i} style={{ position: "absolute", left: x + (i % 2 ? 18 : -18), top: y, width: 26, height: 44, borderRadius: "50% 50% 45% 45%", background: "#9a7ae3", opacity: on ? 0.9 : 0, transform: `rotate(${-30}deg) scale(${on ? 1 : 0.6})` }} />; })}
        <div style={{ position: "absolute", left: 120, top: 860, padding: "10px 24px", borderRadius: 14, background: "#0c0c0e", border: "3px solid #333", fontFamily: F, fontWeight: 900, fontSize: 80, color: "#ff3b30", textShadow: "0 0 14px #ff3b30" }}>{label}</div>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 11. EL SOBRE MANILA: mode drawer (sale de abajo de los manteles) | back (la dirección escrita temblorosa) | open (se abre: testamento + carta)
export const Envelope: React.FC<{ d: number; o?: Ov; mode?: string; at?: number }> = ({ d, o = {}, mode = "back", at = 20 }) => {
  const f = useCurrentFrame();
  const slide = mode === "drawer" ? ease(f, at, at + 30) : 1;
  const flip = mode === "back" ? ease(f, at, at + 14) : mode === "open" ? 1 : 0;
  const open = mode === "open" ? ease(f, at, at + 20) : 0, pull = mode === "open" ? ease(f, at + 18, at + 44) : 0;
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: mode === "open" ? "repeating-linear-gradient(90deg,#4a3020 0 160px,#43291b 160px 320px)" : "radial-gradient(ellipse at 50% 50%, #4a3424 0%, #160e08 80%)" }}>
        {mode === "drawer" && <><div style={{ position: "absolute", left: 260, top: 560, width: 1400, height: 420, background: "#5e3b20", border: "16px solid #7a4f2c" }} />
          {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 10, top: 590 + i * 34, width: 1320 - i * 20, height: 40, borderRadius: 8, background: i % 2 ? "#efe6d4" : "#e4d6bc", boxShadow: "0 3px 6px rgba(0,0,0,.3)", zIndex: 2 }} />)}</>}
        <div style={{ position: "absolute", left: 960 - 380, top: (mode === "drawer" ? interpolate(slide, [0, 1], [700, 160]) : 240), width: 760, height: 520, zIndex: mode === "drawer" && slide < 0.5 ? 1 : 3, transform: `rotateY(${flip * 180}deg) rotate(${-2 + Math.sin(f / 40)}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, background: "#d9b77a", border: "5px solid #b8955a", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.6)", backfaceVisibility: "hidden" }}>
            <div style={{ position: "absolute", left: 60, top: 180, fontFamily: HAND, fontSize: 48, color: "#3a2a1a" }}>Nobody opens this until I'm gone.</div>
            <div style={{ position: "absolute", left: 300, top: 300, width: 160, height: 60, background: "#8a1f1f", borderRadius: 30, opacity: 0.85 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "#d4b274", border: "5px solid #b8955a", borderRadius: 8, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "380px solid transparent", borderRight: "380px solid transparent", borderTop: `${260 - open * 200}px solid #c9a566` }} />
            <div style={{ position: "absolute", left: 120, top: 300, fontFamily: HAND, fontSize: 44, lineHeight: 1.25, color: "#3a2a1a", transform: `rotate(-2deg) translateX(${Math.sin(f / 3) * 0.6}px)`, opacity: mode === "open" ? 1 - pull : 1 }}>Mr. Henderson<br />Attorney at Law · Main St., downtown</div>
          </div>
        </div>
        {mode === "open" && ["LAST WILL", "LETTER"].map((t, i) => <div key={t} style={{ position: "absolute", left: 760 + i * 120 - pull * (i ? -380 : 380), top: 300 - pull * 120 + i * 30, width: 340, height: 440, background: PAPER, boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(${(i ? 6 : -5) * pull}deg)`, opacity: pull, zIndex: 4, fontFamily: i ? HAND : "Georgia, serif", fontSize: 34, fontWeight: 700, color: INKP, padding: 30, textAlign: "center" }}>{t}{Array.from({ length: 9 }).map((_, k) => <div key={k} style={{ height: 6, background: "rgba(43,36,32,.25)", margin: "22px 0", width: `${70 + rnd(k, i + 2) * 30}%` }} />)}</div>)}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 12. EL TESTAMENTO como documento (nombres de la historia, sin datos reales): la cámara baja por la hoja y un resaltador barre cada cláusula en `hl` (cuadros)
export const WillPage: React.FC<{ d: number; o?: Ov; hl?: number[]; focus?: number }> = ({ d, o = {}, hl = [], focus = 0 }) => {
  const f = useCurrentFrame();
  const CL = [
    "I, WALTER, being of sound mind, declare this to be my last will and testament.",
    "FIRST: I leave my house, and everything in it, to DIANE, my neighbor.",
    "SECOND: My savings in the bank shall be divided equally among my three children.",
    "THIRD: The rocking chair on the porch goes to my youngest son, ANDY.",
  ];
  const cur = hl.reduce((k, a, i) => (f >= a - 8 ? i : k), -1);
  const ty = cur < 0 ? 0 : interpolate(f, [hl[cur] - 8, hl[cur] + 6], [cur ? -(cur - 1) * 120 : 0, -cur * 120 + 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = 1 + 0.05 * Math.min(1, f / Math.max(d, 1)) + (cur >= 0 ? 0.12 : 0);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a2a1e 0%, #0e0905 80%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 460, top: 70, width: 1000, height: 1300, background: PAPER, boxShadow: "0 40px 90px rgba(0,0,0,.7)", transform: `translateY(${ty}px) scale(${sc}) rotate(-1deg)`, transformOrigin: "50% 30%", padding: "70px 90px", fontFamily: "Georgia, 'Times New Roman', serif", color: INKP }}>
        <div style={{ textAlign: "center", fontSize: 54, fontWeight: 700, letterSpacing: 3 }}>LAST WILL AND TESTAMENT</div>
        <div style={{ textAlign: "center", fontSize: 30, marginTop: 8, color: "#6a5a4a" }}>of Walter</div>
        <div style={{ height: 3, background: INKP, margin: "26px 0 30px" }} />
        {CL.map((c, i) => { const p = i < hl.length ? ease(f, hl[i], hl[i] + 22) : 0; return (
          <div key={i} style={{ position: "relative", fontSize: 38, lineHeight: 1.45, marginBottom: 34, opacity: ease(f, 2 + i * 4, 10 + i * 4) }}>
            <div style={{ position: "absolute", left: -8, top: 4, height: "92%", width: `${p * 104}%`, background: "rgba(242,211,58,.55)", mixBlendMode: "multiply", borderRadius: 4 }} />
            <span style={{ position: "relative" }}>{c}</span></div>); })}
        <div style={{ marginTop: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div><div style={{ fontFamily: HAND, fontSize: 64, transform: "rotate(-4deg)" }}>Walter</div><div style={{ height: 2, width: 340, background: INKP }} /><div style={{ fontSize: 24, marginTop: 6 }}>signed in the presence of witnesses</div></div>
          <div style={{ width: 170, height: 170, borderRadius: "50%", border: "6px double #8a1f1f", color: "#8a1f1f", fontSize: 24, fontWeight: 700, textAlign: "center", paddingTop: 52, transform: "rotate(-12deg)", opacity: 0.8 }}>NOTARY<br />SEAL</div>
        </div>
      </div>
      <Vig k={0.5} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 13. LA CARTA a mano: se escribe renglón por renglón; la frase clave queda en dorado (hl = índice del renglón)
export const Letter: React.FC<{ d: number; o?: Ov; lines: string[]; hl?: number[]; head?: string; at?: number; per?: number }> = ({ d, o = {}, lines, hl = [], head, at = 6, per = 40 }) => {
  const f = useCurrentFrame();
  const shown = Math.max(0, (f - at) / per);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a2a1e 0%, #0e0905 80%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 300, top: 90, width: 1320, height: 900, background: "repeating-linear-gradient(180deg, #f5ecd8 0 78px, #c9d4e4 78px 80px)", boxShadow: "0 40px 90px rgba(0,0,0,.7)", transform: `rotate(1deg) scale(${1 + 0.04 * Math.min(1, f / Math.max(d, 1))})`, padding: "60px 90px", fontFamily: HAND, color: "#2a2a4a" }}>
        {head && <div style={{ fontSize: 56, marginBottom: 14, opacity: ease(f, 0, 8) }}>{head}</div>}
        {lines.map((l, i) => { const p = Math.max(0, Math.min(1, shown - i)); const key = hl.includes(i);
          return <div key={i} style={{ fontSize: 50, lineHeight: "80px", whiteSpace: "nowrap", overflow: "hidden", width: `${p * 100}%`, color: key ? "#8a1f1f" : undefined, fontWeight: key ? 700 : 400 }}>{l}</div>; })}
      </div>
      <Vig k={0.45} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 14. EL REPARTO (gráfico grande): la casa → DIANE · los ahorros ÷3 → los tres hijos · la mecedora → ANDY
export const WillMap: React.FC<{ d: number; o?: Ov; at?: number[] }> = ({ d, o = {}, at = [10, 60, 110] }) => {
  const f = useCurrentFrame();
  const row = (i: number, icon: React.ReactNode, what: string, to: React.ReactNode, col: string) => { const t = ease(f, at[i], at[i] + 12), a = ease(f, at[i] + 8, at[i] + 24), y = 200 + i * 270;
    return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 160, top: y, width: 200, height: 200, opacity: t, transform: `scale(${0.7 + 0.3 * t})` }}>{icon}</div>
      <div style={{ position: "absolute", left: 400, top: y + 62, fontFamily: F, fontWeight: 900, fontSize: 54, color: INK, opacity: t }}>{what}</div>
      <svg width={340} height={60} style={{ position: "absolute", left: 1090, top: y + 70 }}><line x1={0} y1={30} x2={290 * a} y2={30} stroke={col} strokeWidth={10} strokeLinecap="round" />{a > 0.95 && <path d="M270,10 L310,30 L270,50" fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}</svg>
      <div style={{ position: "absolute", left: 1430, top: y + 40, opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>{to}</div>
    </React.Fragment>; };
  const name = (t: string, c: string) => <div style={{ fontFamily: F, fontWeight: 900, fontSize: 90, color: c, textShadow: `0 0 30px ${c}55` }}>{t}</div>;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a1e14 0%, #0c0805 80%)", transform: `scale(${1 + 0.03 * Math.min(1, f / Math.max(d, 1))})` }}>
      {row(0, <svg viewBox="0 0 100 100"><path d="M8,48 L50,12 L92,48 L92,92 L8,92 Z" fill={CREAM} /><rect x={40} y={60} width={20} height={32} fill={WOOD2} /></svg>, "THE HOUSE", name("DIANE", GOLD), GOLD)}
      {row(1, <svg viewBox="0 0 100 100"><rect x={10} y={30} width={80} height={50} rx={6} fill="#7ac27a" /><circle cx={50} cy={55} r={14} fill="#4a8a4a" /></svg>, "THE SAVINGS", <div style={{ display: "flex", gap: 26, alignItems: "center" }}><span style={{ fontFamily: F, fontWeight: 900, fontSize: 80, color: ORA }}>÷3</span>{[0, 1, 2].map((k) => <div key={k} style={{ position: "relative", width: 60, height: 120 }}><Fig x={30} y={120} s={0.45} w={{ dark: true, skirt: k === 1 }} /></div>)}</div>, ORA)}
      {row(2, ICONS.chair, "THE ROCKING CHAIR", name("ANDY", RED), RED)}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 15. LA OFICINA de Mr. Henderson: él detrás del escritorio, cuatro sillas (Diane + los tres). mode: four | mind (sello SOUND MIND + dos visitas) | letters (reparte las cartas)
export const Office: React.FC<{ d: number; o?: Ov; mode?: string; at?: number }> = ({ d, o = {}, mode = "four", at = 20 }) => {
  const f = useCurrentFrame();
  const X = [360, 700, 1040, 1380];
  return (
    <Push d={d} k={0.05} ox="50% 40%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3a2d22,#1a130d)" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,#4a3828 0 140px,#3e2f22 140px 280px)", opacity: 0.6 }} />
        {/* biblioteca */}
        {Array.from({ length: 4 }).map((_, r) => <div key={r} style={{ position: "absolute", left: 1200, top: 90 + r * 110, width: 620, height: 14, background: "#2a1a10" }} />)}
        {Array.from({ length: 48 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1210 + (i % 12) * 50, top: 104 + Math.floor(i / 12) * 110 - 86, width: 40, height: 86, background: ["#6a2a2a", "#2a3a5a", "#3a4a2a", "#5a4a2a"][i % 4], borderRadius: 3 }} />)}
        <div style={{ position: "absolute", left: 220, top: 110, width: 400, height: 300, border: "14px solid #5e3b20", background: "linear-gradient(180deg,#8a9aaa,#c8d0d8)" }}>{Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 40, width: 372, height: 18, background: "rgba(90,70,50,.5)" }} />)}</div>
        {/* Henderson */}
        <Fig x={960} y={640} s={1.35} w={{ top: "#2e3440", legs: "#2e3440", hair: "#e0ddd6", tie: true, skin: "#efc6a4" }} arms={mode === "letters" ? "out" : "down"} />
        <div style={{ position: "absolute", left: 1015, top: 400, width: 50, height: 70, borderRadius: 8, background: "#2a6a3a", boxShadow: "0 0 30px rgba(120,255,140,.25)" }} />
        <div style={{ position: "absolute", left: 520, top: 600, width: 880, height: 50, background: "#7a4f2c", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 540, top: 650, width: 840, height: 200, background: "#5e3b20" }} />
        {/* las cuatro sillas, de espaldas */}
        {X.map((x, i) => <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x - 90, top: 760, width: 180, height: 260, borderRadius: "30px 30px 0 0", background: "#3a2216", border: "6px solid #2a160c" }} />
          <div style={{ position: "absolute", left: x - 50, top: 690 + Math.sin(f / 24 + i) * 2, width: 100, height: 100, borderRadius: "50%", background: i === 0 ? DIANE.hair : "#0c0c10" }} />
          <div style={{ position: "absolute", left: x - 80, top: 780, width: 160, height: 120, borderRadius: "40px 40px 0 0", background: i === 0 ? C.vest : "#0c0c10" }} />
        </React.Fragment>)}
        <div style={{ position: "absolute", left: 0, top: 1000, width: 1920, height: 80, background: "#120c0a" }} />
        {mode === "letters" && [1, 2, 3].map((i) => { const t = ease(f, at + (i - 1) * 16, at + (i - 1) * 16 + 18); return <div key={i} style={{ position: "absolute", left: interpolate(t, [0, 1], [960, X[i] - 40]), top: interpolate(t, [0, 1], [560, 700]) - Math.sin(t * Math.PI) * 80, width: 80, height: 54, background: "#f7f3ea", border: "3px solid #c9bfa8", transform: `rotate(${t * 20 - 10}deg)`, boxShadow: "0 6px 12px rgba(0,0,0,.4)" }} />; })}
        {mode === "mind" && <>
          <div style={{ position: "absolute", left: 120, top: 100, width: 520, height: 420, background: PAPER, transform: `rotate(-4deg) translateY(${(1 - ease(f, 4, 16)) * 60}px)`, opacity: ease(f, 4, 16), boxShadow: "0 20px 40px rgba(0,0,0,.5)", padding: 30, fontFamily: "Georgia, serif", fontSize: 30, color: INKP }}>
            <b>DOCTOR'S LETTER</b>{Array.from({ length: 6 }).map((_, k) => <div key={k} style={{ height: 6, background: "rgba(43,36,32,.25)", margin: "24px 0", width: `${60 + rnd(k, 8) * 40}%` }} />)}
          </div>
          <div style={{ position: "absolute", left: 200, top: 300, transform: `rotate(-10deg) scale(${interpolate(ease(f, at, at + 6), [0, 1], [1.8, 1])})`, opacity: ease(f, at, at + 4), border: `10px solid ${RED}`, borderRadius: 12, padding: "8px 26px", fontFamily: F, fontWeight: 900, fontSize: 76, color: RED, background: "rgba(255,250,240,.5)" }}>SOUND MIND</div>
          {["VISIT 1", "VISIT 2"].map((v, i) => { const t = ease(f, at + 40 + i * 40, at + 52 + i * 40); return <div key={v} style={{ position: "absolute", left: 120 + i * 260, top: 560, opacity: t, transform: `scale(${0.7 + 0.3 * t})`, padding: "14px 22px", borderRadius: 12, background: "#0c0c0e", border: `4px solid ${ORA}`, fontFamily: F, fontWeight: 900, fontSize: 42, color: ORA }}>✓ {v}</div>; })}
        </>}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 16. RECUERDOS en sepia (lo que él le contaba): rail (el ferrocarril) | dance (el baile: la tercera canción) | build (construye el cuarto del fondo) | stairs (el más chico dormido en la escalera)
export const Memory: React.FC<{ d: number; o?: Ov; mode?: string; at?: number }> = ({ d, o = {}, mode = "dance", at = 20 }) => {
  const f = useCurrentFrame();
  const YOUNG = { top: "#5a6a7a", legs: "#2a2a30", hair: "#3a2414" }, YH = { ...HELEN, hair: "#6a4020", top: "#c25a6a", legs: "#c25a6a" };
  return (
    <Push d={d} k={0.06}>
      <AbsoluteFill style={{ filter: SEPIA }}>
        {mode === "rail" && <SunsetStage tree="pine" horizon={640} night={0.1} sunX={1500} pan={0.4}>
          <div style={{ position: "absolute", left: 0, top: 760, width: 1920, height: 16, background: "#2a1a10" }} />
          {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 70 - ((f * 6) % 70), top: 770, width: 30, height: 26, background: "#3a2414" }} />)}
          <svg width={900} height={360} viewBox="0 0 900 360" style={{ position: "absolute", left: interpolate(f, [0, d], [1900, -900]), top: 420 }}>
            <rect x={120} y={120} width={520} height={170} rx={20} fill="#1c1410" /><rect x={560} y={40} width={200} height={250} fill="#1c1410" /><rect x={160} y={60} width={50} height={70} fill="#1c1410" />
            {[200, 330, 460, 600, 700].map((x) => <circle key={x} cx={x} cy={300} r={44} fill="#2a1a10" stroke="#5a3a20" strokeWidth={8} />)}
            {Array.from({ length: 5 }).map((_, i) => { const t = ((f / 30 + i / 5) % 1); return <circle key={i} cx={185 + t * 160} cy={40 - t * 140} r={30 + t * 50} fill="rgba(230,220,200,.5)" opacity={1 - t} />; })}
          </svg>
          <Fig x={420} y={780} s={1.5} w={YOUNG} arms="hold" />
          <div style={{ position: "absolute", left: 470, top: 520, width: 30, height: 40, borderRadius: 6, background: "#ffd890", boxShadow: "0 0 30px #ffb050" }} />
        </SunsetStage>}
        {mode === "dance" && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #6a4a2a 0%, #1a1008 80%)" }}>
          {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 80 + i * 160, top: 80, width: 30, height: 30, borderRadius: "50%", background: "#ffe0a0", boxShadow: "0 0 30px #ffc060", opacity: 0.6 + 0.4 * Math.sin(f / 10 + i) }} />)}
          <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "#3a2414" }} />
          {[0, 1, 2].map((k) => { const t = ease(f, at + k * 45, at + k * 45 + 10); return <div key={k} style={{ position: "absolute", left: 1350, top: 160 + k * 150, opacity: t, fontFamily: F, fontWeight: 900, fontSize: 60, color: k === 2 ? RED : INK }}>♪ SONG {k + 1} {k === 2 ? "✓" : "✕"}</div>; })}
          {(() => { const yes = ease(f, at + 90, at + 110); const sp = yes * Math.sin(f / 9) * 30; return <>
            <Fig x={interpolate(yes, [0, 1], [500, 760]) + sp} y={860} s={1.7} w={YOUNG} arms={yes > 0.5 ? "hug" : "out"} />
            <Fig x={interpolate(yes, [0, 1], [1000, 860]) + sp} y={860} s={1.6} w={YH} flip arms={yes > 0.5 ? "hug" : "down"} /></>; })()}
        </AbsoluteFill>}
        {mode === "build" && <SunsetStage tree="pine" horizon={640} night={0} sunX={400} pan={0.1}>
          <svg width={900} height={520} viewBox="0 0 900 520" style={{ position: "absolute", left: 700, top: 300 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={40 + i * 150} y={120} width={16} height={380} fill="#c89a62" opacity={ease(f, i * 10, i * 10 + 8)} />)}
            <rect x={30} y={110} width={800} height={18} fill="#c89a62" opacity={ease(f, 60, 70)} />
            <path d="M20,120 L430,0 L840,120" stroke="#c89a62" strokeWidth={16} fill="none" opacity={ease(f, 70, 85)} />
          </svg>
          <Fig x={560} y={820} s={1.6} w={YOUNG} arms="up" />
          <div style={{ position: "absolute", left: 600, top: 380 + Math.abs(Math.sin(f / 5)) * 30, width: 60, height: 22, background: "#555", transform: `rotate(${Math.sin(f / 5) * 30}deg)` }} />
          <svg width={220} height={160} viewBox="0 0 220 160" style={{ position: "absolute", left: 230, top: 660, opacity: ease(f, at, at + 12), transform: `rotate(${Math.sin(f / 18) * 4}deg)`, transformOrigin: "50% 100%" }}><path d="M20,60 L200,60 L180,130 L40,130 Z" fill="#e8d8b8" /><path d="M10,140 Q110,170 210,140" stroke="#c89a62" strokeWidth={10} fill="none" /><circle cx={80} cy={58} r={22} fill="#f2c49b" /><rect x={96} y={44} width={90} height={30} rx={14} fill="#a8c8e8" /></svg>
        </SunsetStage>}
        {mode === "stairs" && <AbsoluteFill style={{ background: "linear-gradient(180deg,#1e1830,#0c0a14)" }}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 300 + i * 120, top: 900 - i * 90, width: 1500, height: 90, background: i % 2 ? "#5e3b20" : "#6b4428", borderTop: "6px solid #8a5a32" }} />)}
          <div style={{ position: "absolute", left: 1500, top: 300, width: 0, height: 0, borderLeft: "140px solid transparent", borderRight: "140px solid transparent", borderBottom: "520px solid #1d4a2a" }} />
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1460 + rnd(i, 2) * 300, top: 380 + rnd(i, 3) * 420, width: 18, height: 18, borderRadius: "50%", background: ["#ff5a4a", "#ffd060", "#6ab0ff"][i % 3], boxShadow: "0 0 18px currentColor", opacity: 0.5 + 0.5 * Math.sin(f / 8 + i) }} />)}
          <svg width={260} height={140} viewBox="0 0 260 140" style={{ position: "absolute", left: 640, top: 560 + Math.sin(f / 30) * 2 }}><rect x={40} y={60} width={150} height={50} rx={24} fill="#4a7ab0" /><circle cx={40} cy={64} r={30} fill="#f2c49b" /><path d="M12,58 Q40,30 68,58" fill="#7a5a3a" /></svg>
          <div style={{ position: "absolute", left: 720 + ((f / 40) % 1) * 30, top: 500 - ((f / 40) % 1) * 60, fontFamily: F, fontWeight: 900, fontSize: 50, color: "rgba(240,235,229,.7)", opacity: 1 - ((f / 40) % 1) }}>z</div>
        </AbsoluteFill>}
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};

// 17. LA LÍNEA DE TIEMPO (Roster de la historia): 8 paradas; la actual se prende, las vistas quedan apagadas con ✓. Entra desde negro (cambio de capítulo)
export const STOPS8 = [
  { t: "SIX YEARS", i: "door" }, { t: "THE CHRISTMAS", i: "plate" }, { t: "THE PNEUMONIA", i: "cross" }, { t: "THE LAST YEAR", i: "slipper" },
  { t: "A THURSDAY IN MARCH", i: "curtain" }, { t: "THE VIEWING", i: "chair" }, { t: "THE LAWYER", i: "envelope" }, { t: "TODAY", i: "bulb" },
];
export const Timeline: React.FC<{ d: number; idx: number; o?: Ov }> = ({ d, idx, o = {} }) => {
  const f = useCurrentFrame();
  const inn = ease(f, 0, 10), W = 200, G = 20, X0 = (1920 - (8 * W + 7 * G)) / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: inn, background: "radial-gradient(ellipse at 50% 50%, #2a1e14 0%, #0a0705 80%)", transform: `scale(${1 + 0.03 * Math.min(1, f / Math.max(d, 1))})` }}>
        <div style={{ position: "absolute", left: X0, right: X0, top: 600, height: 6, background: "rgba(240,235,229,.18)" }} />
        <div style={{ position: "absolute", left: X0, top: 600, height: 6, width: idx > 0 ? (W + G) * (idx - 1) + W / 2 + ease(f, 6, 20) * (W + G) * 0 : 0, background: RED }} />
        {STOPS8.map((s, i) => { const k = i + 1, on = k === idx, seen = k < idx, t = ease(f, 2 + i * 2, 10 + i * 2);
          return <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: on ? 360 : 380, width: W, opacity: t * (idx === 0 || on ? 1 : seen ? 0.45 : 0.7), transform: `scale(${on ? 1.12 + 0.02 * Math.sin(f / 8) : 1})` }}>
            <div style={{ height: 190, borderRadius: 18, border: `5px solid ${on ? ORA : seen ? "#6a5a4a" : "rgba(240,235,229,.35)"}`, background: on ? "rgba(237,178,105,.14)" : "rgba(255,255,255,.04)", padding: 30, boxShadow: on ? `0 0 40px ${ORA}66` : "none", position: "relative", filter: seen ? "grayscale(1)" : undefined }}>
              {ICONS[s.i]}{seen && <div style={{ position: "absolute", right: 10, top: 4, fontFamily: F, fontWeight: 900, fontSize: 50, color: RED }}>✓</div>}</div>
            <div style={{ marginTop: 50, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 26, lineHeight: 1.1, color: on ? ORA : INK }}>{s.t}</div>
          </div>; })}
        {idx > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 110, color: INK, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{STOPS8[idx - 1].t}</div>}
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 18. LA LLAVE (gráfico): la llave sale del llavero y queda en otra mano; "6 YEARS · EVERY DAY"
export const KeyCard: React.FC<{ d: number; o?: Ov; at?: number }> = ({ d, o = {}, at = 15 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 40);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a2a1e 0%, #0b0705 80%)", transform: `scale(${1 + 0.04 * Math.min(1, f / Math.max(d, 1))})` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={560} cy={460} r={120} fill="none" stroke="#9aa0a8" strokeWidth={16} />
        {[0, 1, 2].map((i) => <g key={i} transform={`rotate(${30 + i * 40 + Math.sin(f / 20 + i) * 4} 560 460)`}><rect x={660} y={450} width={160} height={20} fill="#8a9098" /><rect x={790} y={466} width={14} height={22} fill="#8a9098" /></g>)}
        <g transform={`translate(${p * 700} ${Math.sin(p * Math.PI) * -120 + p * 160}) rotate(${-20 + p * 20} 640 460)`} style={{ filter: `drop-shadow(0 0 ${16 * p}px ${GOLD})` }}>
          <circle cx={680} cy={460} r={36} fill="none" stroke={GOLD} strokeWidth={16} /><rect x={712} y={450} width={200} height={22} fill={GOLD} /><rect x={870} y={468} width={14} height={30} fill={GOLD} /><rect x={892} y={468} width={12} height={22} fill={GOLD} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1240, top: 700, width: 360, height: 150, borderRadius: "80px 80px 40px 40px", background: "#e9b98f", opacity: ease(f, at + 10, at + 30) }} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 19. EL CIERRE (gráfico): lo que no está lejos / no es mucho, renglón por renglón con tilde
export const Checklist: React.FC<{ d: number; o?: Ov; items: [string, string][]; at?: number[] }> = ({ d, o = {}, items, at = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a2618 0%, #0b0705 80%)", transform: `scale(${1 + 0.04 * Math.min(1, f / Math.max(d, 1))})` }}>
      {items.map(([a, b], i) => { const t = ease(f, at[i] ?? 8 + i * 40, (at[i] ?? 8 + i * 40) + 12), k = ease(f, (at[i] ?? 8 + i * 40) + 14, (at[i] ?? 8 + i * 40) + 24);
        return <div key={i} style={{ position: "absolute", left: 200, top: 300 + i * 220, opacity: t, transform: `translateX(${(1 - t) * -40}px)`, fontFamily: F, fontWeight: 900, fontSize: 76, color: INK, whiteSpace: "nowrap" }}>
          <span style={{ display: "inline-block", width: 90, color: GOLD, opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>✓</span>{a} <span style={{ color: ORA }}>{b}</span></div>; })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

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
// campana + pregunta para los comentarios (CTA sin link ni URL); abajo pasa la tira de la historia
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a2618 0%, #0b0705 78%)" }}>
      <div style={{ position: "absolute", top: 820, left: 0, display: "flex", gap: 22, opacity: 0.5, transform: `translateX(${-((f * 2.2) % (8 * 222))}px)` }}>
        {[...STOPS8, ...STOPS8, ...STOPS8].map((h, i) => (
          <div key={i} style={{ width: 200, height: 150, flex: "none", borderRadius: 12, background: "rgba(255,255,255,.04)", border: "3px solid rgba(237,178,105,.45)", padding: 22, boxSizing: "border-box" }}>{ICONS[h.i]}</div>
        ))}
      </div>
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 120, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 160, right: 160, top: bell ? 420 : 300, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 68, color: INK, lineHeight: 1.18, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
