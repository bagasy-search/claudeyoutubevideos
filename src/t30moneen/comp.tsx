// t30moneen — "The 7 Babylon Money Rules Nobody Taught You" (Ink and Coins). Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble/DiagSplit siguen el patrón de src/btgm1/M1.tsx
// (allá no se exportan: acá van copiados). Todo lo ilustrado es SVG/CSS; lo real = archivo PD/CC + fotos/clips agnes sin cara.
// Piezas ancla: la BOLSA de monedas que engorda regla por regla (Purse) y la TABLILLA de arcilla donde se graban las 7 reglas (RuleTablet).
// Personajes = figuras de relieve babilónico dibujadas por código (Fig): perfil, barba rizada, túnica con fleco.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, Person, SunsetStage, ease } from "../kits/btg/kit";

const { fontFamily: F } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
export const INK = "#f0ebe5", RED = "#f14536", ORA = "#edb269", GOLD = "#e9c762", GREEN = "#7fd47a", CLAY = "#b88a5c";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const sf = (p: string) => staticFile(p);
const HAND = "'Segoe Print','Comic Sans MS','Bradley Hand',cursive";
const lin = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], clamp);

// ───────────────────────── texto (firma del estilo) ─────────────────────────
export const Build: React.FC<{ a?: number; lines: string[]; out?: number; y?: number; size?: number; color?: string }> = ({ a = 6, lines, out, y = 110, size = 96, color = RED }) => {
  const f = useCurrentFrame();
  const o = out ? ease(f, out, out + 9, 1, 0) : 1;
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: F, opacity: o, filter: `blur(${(1 - o) * 10}px)` }}>
      {lines.map((l, li) => (
        <div key={li} style={{ fontSize: li && l.startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 4px 18px rgba(0,0,0,.65)" }}>
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
// archivo (museo, grabado, foto vieja): entero dentro de un borde blanco, sobre la misma imagen borrosa; push lento; rótulo + crédito
export const Arch: React.FC<{ v: string; d: number; ar: number; year?: string; o?: Ov; side?: "c" | "l" | "r" }> = ({ v, d, ar, year, o = {}, side = "c" }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f, fps: 30, config: { damping: 18, mass: 0.8 } });
  const maxW = side === "c" ? 1500 : 1000, maxH = o.build ? 640 : 860;
  let w = maxW, h = w / ar; if (h > maxH) { h = maxH; w = h * ar; }
  const cx = side === "c" ? 960 : side === "l" ? 620 : 1300, cy = o.build ? 640 : 540;
  const s = interpolate(f, [0, Math.max(d, 2)], [1, 1.06], clamp);
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.32) saturate(.7)", transform: `scale(${1.2 + f * 0.0005})` }}><Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2 + (1 - t) * 50, width: w, height: h, opacity: t, transform: `scale(${s}) rotate(${(1 - t) * -2}deg)`, border: "7px solid rgba(250,248,242,.95)", boxShadow: "0 30px 70px rgba(0,0,0,.7)", background: "#222" }}>
        <Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.85)" }} />
      </div>
      {year && <Label t={year} />}
      <Overlays o={{ ...o, label: undefined }} />
    </AbsoluteFill>
  );
};
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
            <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 540 - H / 2 + 60 + (1 - t) * 90, width: W, height: H, opacity: t, transform: `rotate(${tilt * (1 - t * 0.6)}deg)`, borderRadius: 12, overflow: "hidden", border: "6px solid rgba(255,255,255,.93)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
              <Img src={sf(c)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 - f * 0.0005})` }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Overlays o={{ ...o, big: o.big ? { x: 90, y: 440, size: 170, color: ORA, ...o.big } : undefined }} />
    </AbsoluteFill>
  );
};

// ───────────────────────── piezas de dibujo ─────────────────────────
const Push: React.FC<{ d: number; k?: number; ox?: string; children: React.ReactNode }> = ({ d, k = 0.05, ox = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1 + k], clamp)})`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
export const Coin: React.FC<{ x: number; y: number; r?: number; o?: number; dull?: boolean; spin?: number }> = ({ x, y, r = 26, o = 1, dull, spin = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", opacity: o, transform: `scaleX(${Math.abs(Math.cos(spin)) * 0.85 + 0.15})`,
    background: dull ? "radial-gradient(circle at 35% 30%, #9a9183, #5d564c 70%)" : "radial-gradient(circle at 35% 30%, #fff1b0, #e9c762 35%, #b8862a 80%)", boxShadow: dull ? "none" : `0 0 ${r * 0.6}px rgba(255,200,80,.35), inset 0 0 0 ${Math.max(2, r * 0.12)}px rgba(150,100,20,.55)` }} />
);
// bolsa de cuero: p = 0 (flaca, vacía, arrugada) → 1 (gorda, con monedas asomando)
export const Purse: React.FC<{ x: number; y: number; p: number; s?: number; grey?: boolean; holes?: boolean }> = ({ x, y, p, s = 1, grey, holes }) => {
  const f = useCurrentFrame();
  const w = 120 + p * 150, h = 140 + p * 80, cx = 150, top = 92;
  const body = `M${cx - 30},${top} Q${cx - w / 2 - 14},${top + h * 0.3} ${cx - w / 2},${top + h * 0.72} Q${cx - w / 2 + 16},${top + h + 18} ${cx},${top + h + 20} Q${cx + w / 2 - 16},${top + h + 18} ${cx + w / 2},${top + h * 0.72} Q${cx + w / 2 + 14},${top + h * 0.3} ${cx + 30},${top} Z`;
  const sway = Math.sin(f / 18) * 1.5;
  return (
    <svg width={300 * s} height={340 * s} viewBox="0 0 300 340" style={{ position: "absolute", left: x - 150 * s, top: y - 330 * s, overflow: "visible", filter: grey ? "grayscale(1) brightness(.8)" : undefined, transform: `rotate(${sway}deg)`, transformOrigin: "50% 100%" }}>
      <defs>
        <radialGradient id="pg" cx="40%" cy="40%" r="70%"><stop offset="0" stopColor="#b77a45" /><stop offset=".6" stopColor="#8a5530" /><stop offset="1" stopColor="#5a3418" /></radialGradient>
      </defs>
      <ellipse cx={cx} cy={top + h + 24} rx={w * 0.55} ry={14} fill="rgba(0,0,0,.35)" />
      {p > 0.55 && [0, 1, 2, 3].map((i) => <circle key={i} cx={cx - 34 + i * 22} cy={top - 6 - (i % 2) * 8} r={14} fill="#e9c762" stroke="#a87a22" strokeWidth={3} />)}
      <path d={body} fill="url(#pg)" stroke="#3e2410" strokeWidth={4} />
      <path d={`M${cx - w / 2 + 22},${top + h * 0.72} Q${cx},${top + h * 0.9} ${cx + w / 2 - 22},${top + h * 0.72}`} fill="none" stroke="#e2b07a" strokeWidth={3} strokeDasharray="10 8" opacity={0.7} />
      {p < 0.3 && [0, 1, 2].map((i) => <path key={i} d={`M${cx - 30 + i * 22},${top + 40 + i * 18} q14,${10 + i * 4} 4,${30 + i * 6}`} stroke="#4a2a12" strokeWidth={3} fill="none" opacity={0.7} />)}
      <path d={`M${cx - 30},${top + 4} L${cx - 58},${top - 30} L${cx - 40},${top - 24} L${cx - 34},${top - 44} L${cx - 18},${top - 30} L${cx - 6},${top - 48} L${cx + 6},${top - 30} L${cx + 20},${top - 46} L${cx + 32},${top - 26} L${cx + 52},${top - 38} L${cx + 32},${top + 4} Z`} fill="#a06a3c" stroke="#3e2410" strokeWidth={4} strokeLinejoin="round" />
      {[-18, -4, 10, 22].map((x0, i) => <path key={i} d={`M${cx + x0},${top + 2} L${cx + x0 + 4},${top - 26}`} stroke="#6a3e1c" strokeWidth={3} />)}
      <path d={`M${cx - 36},${top + 2} Q${cx},${top + 12} ${cx + 36},${top + 2}`} stroke="#e2c08a" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 30},${top + 4} q${16 + sway * 2},26 6,${60}`} stroke="#e2c08a" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={`M${cx + 30},${top + 4} q${30 + sway * 2},16 30,${50}`} stroke="#e2c08a" strokeWidth={5} fill="none" strokeLinecap="round" />
      <circle cx={cx + 36} cy={top + 64} r={6} fill="#c9a24a" /><circle cx={cx + 60} cy={top + 54} r={6} fill="#c9a24a" />
      {holes && [0, 1, 2].map((i) => <ellipse key={i} cx={cx - 40 + i * 40} cy={top + h + 8 - (i === 1 ? -6 : 0)} rx={8} ry={5} fill="#120a05" />)}
    </svg>
  );
};

// figura de relieve babilónico (perfil, barba rizada, túnica con fleco). Pies en (x, y). Mira a la derecha (flip = izquierda)
type Who = "bansir" | "kobbi" | "arkad" | "young" | "algamish" | "azmur" | "rodan" | "mathon" | "king" | "man" | "woman" | "kid" | "jeweler" | "baker";
const ROLE: Record<Who, { robe: string; trim: string; beard?: string; hair: string; hat?: "band" | "crown" | "cap" | "veil"; old?: boolean; small?: boolean }> = {
  bansir: { robe: "#3d6f8e", trim: "#d9b36a", beard: "#1d1410", hair: "#1d1410", hat: "band" },
  kobbi: { robe: "#8c3f5a", trim: "#e6c27a", beard: "#2a1a10", hair: "#2a1a10", hat: "band" },
  arkad: { robe: "#c9952e", trim: "#7a1f1f", beard: "#1d1410", hair: "#1d1410", hat: "cap" },
  young: { robe: "#7b6a55", trim: "#c9b48a", beard: "#1d1410", hair: "#1d1410" },
  algamish: { robe: "#5c4a7a", trim: "#e9c762", beard: "#e8e2d6", hair: "#e8e2d6", hat: "cap", old: true },
  azmur: { robe: "#8a6a4a", trim: "#c4522a", beard: "#2a1a10", hair: "#2a1a10", hat: "band" },
  rodan: { robe: "#556b3a", trim: "#d9b36a", beard: "#1d1410", hair: "#1d1410", hat: "band" },
  mathon: { robe: "#2f4a5c", trim: "#e9c762", beard: "#bdb6a8", hair: "#bdb6a8", hat: "cap", old: true },
  king: { robe: "#7a1f1f", trim: "#e9c762", beard: "#120c08", hair: "#120c08", hat: "crown" },
  man: { robe: "#5a5a46", trim: "#a89a72", beard: "#2a1a10", hair: "#2a1a10" },
  woman: { robe: "#a0522d", trim: "#e9c762", hair: "#1d1410", hat: "veil" },
  kid: { robe: "#9a8a6a", trim: "#d8c8a0", hair: "#1d1410", small: true },
  jeweler: { robe: "#2e5e5a", trim: "#e9c762", beard: "#2a1a10", hair: "#2a1a10", hat: "cap" },
  baker: { robe: "#c8b89a", trim: "#8a5a32", beard: "#3a2a1a", hair: "#3a2a1a", hat: "band" },
};
export type Pose = "down" | "out" | "up" | "think" | "point" | "work" | "hold";
export const Fig: React.FC<{ who: Who; x: number; y: number; s?: number; walk?: boolean; pose?: Pose; flip?: boolean; grey?: boolean; sit?: boolean; prop?: "wheel" | "lyre" | "staff" | "spear" | "brick" | "purse" | "tablet" | "stylus" | "box"; dim?: number; talk?: boolean }> = ({ who, x, y, s = 1, walk, pose = "down", flip, grey, sit, prop, dim = 0, talk }) => {
  const f = useCurrentFrame();
  const R = ROLE[who];
  const sc = s * 1.5 * (R.small ? 0.62 : 1);   // 1.5: las figuras de relieve tienen que llenar el cuadro (stills m1)
  const sw = walk ? Math.sin(f / 4.5) * 16 : 0, bob = walk ? Math.abs(Math.sin(f / 4.5)) * 3 : Math.sin(f / 22) * 1.2;
  const skin = "#b0764a";
  const armA = { down: 12, out: -72, up: -158, think: -138, point: -96, work: -40 + Math.sin(f / 3) * 22, hold: -58 }[pose] + (talk ? Math.sin(f / 5) * 10 : 0);
  const armL = pose === "think" ? 52 : 74;
  const robeB = sit ? 200 : 232;
  return (
    <svg width={140 * sc} height={280 * sc} viewBox="0 0 140 280" style={{ position: "absolute", left: x - 70 * sc, top: y - 280 * sc - bob, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, filter: grey ? "grayscale(1) brightness(.75)" : dim ? `brightness(${1 - dim})` : undefined }}>
      {/* brazo de atrás */}
      <rect x={58} y={102} width={11} height={70} rx={5} fill="#8a5a38" transform={`rotate(${-armA * 0.25 - 8} 63 106)`} />
      {/* piernas */}
      {sit ? (<><rect x={56} y={196} width={46} height={12} rx={6} fill={skin} /><rect x={92} y={198} width={11} height={60} rx={5} fill={skin} /><rect x={78} y={198} width={11} height={60} rx={5} fill="#9a6a44" /></>) : (<>
        <g transform={`rotate(${sw} 66 222)`}><rect x={60} y={218} width={11} height={58} rx={5} fill="#9a6a44" /><rect x={58} y={268} width={22} height={9} rx={4} fill="#3a2414" /></g>
        <g transform={`rotate(${-sw} 74 222)`}><rect x={68} y={218} width={11} height={58} rx={5} fill={skin} /><rect x={66} y={268} width={22} height={9} rx={4} fill="#4a2e18" /></g></>)}
      {/* túnica */}
      <path d={`M50,98 Q70,90 92,98 L${sit ? 104 : 102},${robeB} Q70,${robeB + 8} ${sit ? 40 : 38},${robeB} Z`} fill={R.robe} />
      <path d={`M52,108 L98,${robeB - 30}`} stroke={R.trim} strokeWidth={7} opacity={0.9} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={40 + i * 5.4} y1={robeB - 2} x2={40 + i * 5.4} y2={robeB + 9} stroke={R.trim} strokeWidth={2.4} />)}
      {/* cabeza de perfil */}
      <rect x={64} y={80} width={14} height={20} fill={skin} />
      <circle cx={74} cy={66} r={19} fill={skin} />
      <path d="M90,62 L99,72 L89,75 Z" fill={skin} />
      <ellipse cx={82} cy={62} rx={3.2} ry={2.2} fill="#140c08" />
      <path d="M78,57 L88,56" stroke="#140c08" strokeWidth={2.5} />
      {R.hat === "veil" ? <path d="M52,46 Q74,34 94,52 L92,58 Q74,46 58,58 L50,112 L42,112 Z" fill={R.trim} opacity={0.9} /> : <path d="M54,58 Q58,42 78,46 Q62,50 60,74 L56,98 L50,96 Z" fill={R.hair} />}
      {R.hat !== "veil" && <path d="M50,96 Q48,80 56,64 L64,66 Q58,82 62,98 Z" fill={R.hair} />}
      {R.beard && <g><path d={`M66,76 Q84,80 92,78 L${R.old ? 92 : 90},${R.old ? 122 : 104} Q78,${R.old ? 132 : 114} 64,${R.old ? 116 : 100} Z`} fill={R.beard} />
        {Array.from({ length: R.old ? 5 : 3 }).map((_, i) => <path key={i} d={`M68,${86 + i * 8} q6,4 10,0 q6,4 10,0`} stroke={R.old ? "#a8a090" : "#4a3020"} strokeWidth={2} fill="none" />)}
        {talk && <path d={`M86,${78 + Math.abs(Math.sin(f / 3)) * 3} l6,0`} stroke="#5a2a1a" strokeWidth={3} />}</g>}
      {R.hat === "band" && <rect x={54} y={50} width={38} height={6} rx={3} fill={R.trim} />}
      {R.hat === "cap" && <path d="M55,52 Q74,30 93,52 Z" fill={R.trim} />}
      {R.hat === "crown" && <><path d="M54,54 L57,18 L91,18 L94,54 Z" fill="#c9a24a" />{[0, 1, 2].map((i) => <circle key={i} cx={64 + i * 10} cy={34} r={3} fill="#7a1f1f" />)}</>}
      {/* brazo de adelante (+ objeto) */}
      <g transform={`rotate(${armA} 74 104)`}>
        <rect x={68} y={100} width={12} height={armL} rx={6} fill={skin} />
        <circle cx={74} cy={100 + armL} r={7} fill={skin} />
        {prop === "stylus" && <rect x={72} y={100 + armL} width={4} height={30} fill="#d8c08a" />}
        {prop === "staff" && <rect x={70} y={-10} width={7} height={300} fill="#6b4a2a" />}
        {prop === "spear" && <><rect x={71} y={-40} width={5} height={310} fill="#6b4a2a" /><path d="M66,-40 L73.5,-78 L81,-40 Z" fill="#c9a24a" /></>}
      </g>
      {prop === "wheel" && <g transform={`translate(106,170) rotate(${f * 1.5})`}><circle r={34} fill="none" stroke="#6b4a2a" strokeWidth={7} />{[0, 1, 2, 3].map((i) => <line key={i} x1={-34 * Math.cos(i * 0.785)} y1={-34 * Math.sin(i * 0.785)} x2={34 * Math.cos(i * 0.785)} y2={34 * Math.sin(i * 0.785)} stroke="#6b4a2a" strokeWidth={4} />)}<circle r={7} fill="#3a2414" /></g>}
      {prop === "lyre" && <g transform="translate(96,130)"><path d="M0,0 L6,-62 L40,-62 L46,0 Z" fill="none" stroke="#8a5a32" strokeWidth={6} />{[0, 1, 2, 3].map((i) => <line key={i} x1={10 + i * 8} y1={-58} x2={10 + i * 8 + Math.sin(f / 2 + i) * 1.2} y2={-2} stroke="#e8d8b0" strokeWidth={1.6} />)}<rect x={-2} y={-4} width={50} height={10} rx={4} fill="#6b4a2a" /><circle cx={4} cy={-66} r={8} fill="#c9a24a" /></g>}
      {prop === "brick" && <rect x={86} y={150} width={44} height={24} rx={2} fill="#a0603a" stroke="#6a3a20" strokeWidth={3} />}
      {prop === "purse" && <g transform="translate(92,150)"><path d="M10,0 Q-12,30 4,46 L36,46 Q52,30 30,0 Z" fill="#8a5530" stroke="#3e2410" strokeWidth={3} /><rect x={8} y={-4} width={24} height={7} rx={3} fill="#3e2410" /></g>}
      {prop === "tablet" && <rect x={88} y={140} width={34} height={44} rx={6} fill={CLAY} stroke="#7a5638" strokeWidth={3} />}
      {prop === "box" && <rect x={84} y={160} width={52} height={36} rx={4} fill="#6b4a2a" stroke="#3a2414" strokeWidth={3} />}
    </svg>
  );
};
// camello en silueta que camina (con carga)
export const Camel: React.FC<{ x: number; y: number; s?: number; ph?: number; color?: string; load?: string }> = ({ x, y, s = 1, ph = 0, color = "#1a1410", load = "#7a3a2a" }) => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 5 + ph) * 16;
  return (
    <svg width={230 * s} height={190 * s} viewBox="0 0 230 190" style={{ position: "absolute", left: x - 115 * s, top: y - 190 * s, overflow: "visible" }}>
      {[[60, a], [80, -a], [140, -a], [158, a]].map(([lx, r], i) => <rect key={i} x={lx} y={98} width={10} height={86} rx={4} fill={color} transform={`rotate(${r} ${lx + 5} 100)`} />)}
      <ellipse cx={110} cy={92} rx={72} ry={32} fill={color} />
      <path d="M70,80 Q100,22 130,70 Z" fill={color} />
      <path d="M170,86 Q186,74 188,40 L204,30 Q214,30 216,38 L200,48 Q198,80 180,100 Z" fill={color} />
      <path d="M40,90 q-14,10 -10,40" stroke={color} strokeWidth={5} fill="none" />
      <rect x={80} y={44} width={58} height={30} rx={6} fill={load} opacity={0.9} />
      <rect x={86} y={30} width={44} height={18} rx={5} fill="#c9a24a" opacity={0.85} />
    </svg>
  );
};
// horizonte de Babilonia: muralla almenada con torres, zigurat y la puerta azul
const City: React.FC<{ base: number; drift?: number; color?: string; gate?: boolean; zig?: number }> = ({ base, drift = 0, color = "#182230", gate = true, zig = 1300 }) => {
  const els: React.ReactNode[] = [];
  for (let x = -100; x < 2300; x += 34) els.push(<rect key={"m" + x} x={x} y={base - 112} width={20} height={16} fill={color} />);
  for (let x = -60; x < 2300; x += 260) els.push(<g key={"t" + x}><rect x={x} y={base - 150} width={70} height={150} fill={color} />{[0, 1, 2].map((k) => <rect key={k} x={x + k * 26} y={base - 166} width={18} height={18} fill={color} />)}</g>);
  return (
    <svg width={2400} height={1080} style={{ position: "absolute", left: -200 + drift, top: 0 }}>
      {[560, 420, 290, 170].map((w, i) => <rect key={i} x={zig + 200 - w / 2} y={base - 150 - (i + 1) * 62} width={w} height={64} fill={color} />)}
      <rect x={zig + 200 - 50} y={base - 150 - 4 * 62 - 50} width={100} height={52} fill={color} />
      <path d={`M${zig + 200 - 8},${base - 150} L${zig + 200 - 8},${base - 420} L${zig + 200 + 8},${base - 420} L${zig + 200 + 8},${base - 150} Z`} fill="rgba(255,190,120,.08)" />
      <rect x={-100} y={base - 100} width={2600} height={100} fill={color} />
      {els}
      {gate && <g transform={`translate(${600},${base})`}>
        <rect x={-130} y={-250} width={90} height={250} fill="#1d3a6a" /><rect x={40} y={-250} width={90} height={250} fill="#1d3a6a" />
        <rect x={-50} y={-200} width={100} height={200} fill="#1d3a6a" />
        {[-130, -100, -70, 40, 70, 100].map((x) => <rect key={x} x={x} y={-272} width={22} height={24} fill="#1d3a6a" />)}
        <path d="M-34,0 L-34,-120 Q0,-160 34,-120 L34,0 Z" fill="#0a0e14" />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-122 + (i % 2) * 170 + (i % 2 ? 0 : 0)} y={-226 + Math.floor(i / 2) * 52} width={i % 2 ? 72 : 72} height={10} fill="#d9a441" opacity={0.85} />)}
        {[-110, 60].map((x, i) => <path key={i} d={`M${x},-60 l40,0 l4,-14 l-10,-6 l-30,4 Z`} fill="#e9c762" opacity={0.85} />)}
      </g>}
    </svg>
  );
};
// escenario babilónico: el SunsetStage del kit (palmeras) + la ciudad en silueta
export const BabStage: React.FC<{ night?: number; horizon?: number; city?: boolean; water?: boolean; sunX?: number; pan?: number; zig?: number; children?: React.ReactNode }> = ({ night = 0, horizon = 640, city = true, water = false, sunX = 1450, pan = 0.25, zig = 1300, children }) => {
  const f = useCurrentFrame();
  return (
    <SunsetStage tree="palm" horizon={horizon} night={night} sunX={sunX} pan={pan} water={water}>
      {city && <City base={horizon - 2} drift={-f * pan * 0.15} zig={zig} color={night > 0.5 ? "#0f1620" : "#182230"} />}
      {children}
    </SunsetStage>
  );
};
const Bubble: React.FC<{ a: number; x: number; y: number; children: React.ReactNode; w?: number; think?: boolean; out?: number }> = ({ a, x, y, children, w = 300, think, out }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 8) * (out ? ease(f, out, out + 8, 1, 0) : 1);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, padding: "16px 18px", borderRadius: think ? 60 : 22, background: "rgba(250,246,238,.96)", color: "#1b1d22", fontFamily: F, fontWeight: 800, fontSize: 38, textAlign: "center", opacity: o, transform: `scale(${0.7 + 0.3 * o})`, transformOrigin: "50% 100%", boxShadow: "0 10px 26px rgba(0,0,0,.4)" }}>
      {children}
      {think ? <><div style={{ position: "absolute", left: w / 2 - 14, bottom: -26, width: 22, height: 22, borderRadius: 11, background: "rgba(250,246,238,.96)" }} /><div style={{ position: "absolute", left: w / 2 - 26, bottom: -48, width: 12, height: 12, borderRadius: 6, background: "rgba(250,246,238,.96)" }} /></>
        : <div style={{ position: "absolute", left: w / 2 - 14, bottom: -18, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "20px solid rgba(250,246,238,.96)" }} />}
    </div>
  );
};
const Wall: React.FC<{ x: number; y: number; w: number; h?: number }> = ({ x, y, w, h = 90 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: `repeating-linear-gradient(0deg, #5a3e28 0 3px, transparent 3px 28px), repeating-linear-gradient(90deg, #5a3e28 0 3px, transparent 3px 56px), #8a6440`, boxShadow: "inset 0 8px 0 #9c744c" }} />
);
// íconos chicos de gastos / cosas (SVG plano)
export type IconK = "bread" | "cloth" | "sandal" | "house" | "cup" | "phone" | "box" | "necklace" | "cow" | "cloud" | "jewel" | "brick" | "scroll" | "heart" | "family" | "seal" | "hands" | "coin" | "lock" | "shoe";
export const Ico: React.FC<{ k: IconK; s?: number; c?: string }> = ({ k, s = 90, c = INK }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    {k === "bread" && <><ellipse cx={50} cy={58} rx={40} ry={24} fill="#d9a35a" /><path d="M30,48 q6,-10 10,0 M48,44 q6,-10 10,0 M64,48 q6,-10 10,0" stroke="#8a5a2a" strokeWidth={4} fill="none" /></>}
    {k === "cloth" && <><path d="M14,30 L86,30 L80,80 L20,80 Z" fill="#a0402a" /><path d="M14,30 L86,30 L80,44 L20,44 Z" fill="#3d6f8e" /></>}
    {(k === "sandal" || k === "shoe") && <><path d="M18,70 Q16,40 40,36 Q62,34 80,56 Q88,66 80,74 L24,76 Z" fill="#8a5a32" /><path d="M36,40 L56,70 M48,38 L68,66" stroke="#4a2a12" strokeWidth={5} /></>}
    {k === "house" && <><path d="M14,48 L50,16 L86,48 Z" fill={c} /><rect x={22} y={46} width={56} height={40} fill={c} /><rect x={44} y={60} width={14} height={26} fill="#1b1410" /></>}
    {k === "cup" && <><path d="M26,30 L74,30 L68,88 L32,88 Z" fill="#f2eee6" /><rect x={24} y={24} width={52} height={10} rx={3} fill="#5a3a22" /><rect x={30} y={50} width={40} height={16} fill="#8a5a32" />{[0, 1, 2].map((i) => <path key={i} d={`M${38 + i * 12},18 q-6,-8 0,-14`} stroke="#ccc" strokeWidth={3} fill="none" />)}</>}
    {k === "phone" && <><rect x={30} y={10} width={40} height={80} rx={8} fill="#222" /><rect x={34} y={18} width={32} height={58} rx={3} fill="#4fa3d9" /><path d="M42,40 l14,8 l-14,8 Z" fill="#fff" /></>}
    {k === "box" && <><path d="M14,34 L50,20 L86,34 L86,76 L50,90 L14,76 Z" fill="#c49a62" /><path d="M14,34 L50,48 L86,34 M50,48 L50,90" stroke="#8a6436" strokeWidth={4} fill="none" /><rect x={40} y={24} width={20} height={10} fill="#e6d0a0" /></>}
    {k === "necklace" && <><path d="M20,24 Q50,90 80,24" stroke="#e9c762" strokeWidth={6} fill="none" />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={28 + i * 11} cy={38 + Math.sin(i / 4 * Math.PI) * 32} r={6} fill={i === 2 ? "#c4302a" : "#3a6ab0"} />)}</>}
    {k === "cow" && <><ellipse cx={50} cy={56} rx={34} ry={20} fill="#d8cbb0" /><circle cx={84} cy={44} r={12} fill="#d8cbb0" /><path d="M78,32 l-6,-10 M90,32 l6,-10" stroke="#d8cbb0" strokeWidth={5} />{[24, 36, 62, 74].map((x) => <rect key={x} x={x} y={66} width={7} height={24} fill="#d8cbb0" />)}<circle cx={46} cy={50} r={8} fill="#5a3a22" /></>}
    {k === "cloud" && <path d="M24,70 Q8,70 12,54 Q14,40 30,42 Q34,22 54,26 Q70,18 78,38 Q94,40 90,58 Q88,70 74,70 Z" fill="#c8d4e6" />}
    {k === "jewel" && <><path d="M30,30 L70,30 L86,46 L50,88 L14,46 Z" fill="#3fa0d9" /><path d="M30,30 L40,46 L50,30 L60,46 L70,30 M14,46 L86,46 M40,46 L50,88 L60,46" stroke="#bfe8ff" strokeWidth={3} fill="none" /></>}
    {k === "brick" && <><rect x={14} y={36} width={72} height={36} rx={3} fill="#a0603a" stroke="#6a3a20" strokeWidth={4} /><path d="M14,54 L86,54 M50,36 L50,54" stroke="#6a3a20" strokeWidth={3} /></>}
    {k === "scroll" && <><rect x={22} y={14} width={56} height={74} rx={8} fill={CLAY} stroke="#7a5638" strokeWidth={4} />{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M32,${30 + i * 11} l6,4 l6,-4 l6,4 l6,-4 l6,4`} stroke="#6b4a2e" strokeWidth={3} fill="none" />)}</>}
    {k === "seal" && <><rect x={18} y={20} width={64} height={60} rx={8} fill={CLAY} stroke="#7a5638" strokeWidth={4} /><circle cx={50} cy={50} r={16} fill="#8a2a1a" /><path d="M42,50 l6,6 l12,-14" stroke="#f0ebe5" strokeWidth={4} fill="none" /></>}
    {k === "heart" && <path d="M50,84 Q12,58 16,36 Q20,16 40,20 Q48,22 50,32 Q52,22 60,20 Q80,16 84,36 Q88,58 50,84 Z" fill="#e05a4a" />}
    {k === "family" && <>{[[30, 1], [54, 1], [76, 0.7]].map(([x, k2], i) => <g key={i}><circle cx={x} cy={40 + (1 - k2) * 20} r={10 * k2} fill={c} /><rect x={x - 10 * k2} y={54 + (1 - k2) * 18} width={20 * k2} height={34 * k2} rx={8} fill={c} /></g>)}</>}
    {k === "hands" && <><path d="M14,60 Q30,44 50,52 L86,52 L86,66 L48,72 Q28,76 14,70 Z" fill="#b0764a" /><ellipse cx={58} cy={40} rx={22} ry={12} fill="#d9a35a" /></>}
    {k === "coin" && <><circle cx={50} cy={50} r={36} fill="#e9c762" stroke="#a87a22" strokeWidth={6} /><circle cx={50} cy={50} r={22} fill="none" stroke="#a87a22" strokeWidth={3} /></>}
    {k === "lock" && <><rect x={24} y={44} width={52} height={42} rx={6} fill="#e9c762" /><path d="M34,46 L34,32 Q34,14 50,14 Q66,14 66,32 L66,46" stroke="#e9c762" strokeWidth={8} fill="none" /><circle cx={50} cy={62} r={6} fill="#5a3a12" /></>}
  </svg>
);
const Mark: React.FC<{ ok: boolean; s?: number }> = ({ ok, s = 70 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><circle cx={50} cy={50} r={44} fill={ok ? "#2f7a3a" : "#a8261c"} />{ok ? <path d="M28,52 l14,14 l30,-32" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M32,32 L68,68 M68,32 L32,68" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}</svg>
);

// ───────────────────────── ESCENAS (ilustradas, siempre algo se mueve) ─────────────────────────
// 1. la pared baja: los dos amigos sentados mirando la caravana del rey / preguntándose / recordando / yendo a ver a Arkad / volviendo
export const WallScene: React.FC<{ d: number; mode?: "caravan" | "ask" | "memory" | "walk" | "home"; o?: Ov; cues?: number[] }> = ({ d, mode = "caravan", o = {}, cues = [] }) => {
  const f = useCurrentFrame();
  const grey = mode === "memory";
  const night = mode === "home" ? 0.55 : 0;
  const walkX = mode === "walk" ? 700 + f * 3.2 : mode === "home" ? 1350 - f * 2.6 : 0;
  return (
    <Push d={d} k={0.05} ox="45% 70%">
      <AbsoluteFill style={{ filter: grey ? "grayscale(.9) brightness(.7) sepia(.25)" : undefined }}>
        <BabStage horizon={600} night={night} sunX={mode === "home" ? 300 : 1500} pan={0.3}>
          {(mode === "caravan" || mode === "ask") && Array.from({ length: 5 }).map((_, i) => <Camel key={i} x={((-260 + i * 330 + f * 2.4) % 2300) - 100} y={720} s={0.95} ph={i} />)}
          <AbsoluteFill style={{ top: 760, background: "linear-gradient(180deg,#5a4028,#3a2a1a)" }} />
          {mode !== "walk" && mode !== "home" && !grey && <Wall x={300} y={750} w={1000} h={130} />}
          {(mode === "caravan" || mode === "ask") && <>
            <Fig who="bansir" x={560} y={890} s={1.05} sit pose={mode === "ask" ? "think" : "down"} flip />
            <Fig who="kobbi" x={980} y={890} s={1.05} sit pose={mode === "ask" ? "out" : "hold"} prop={mode === "caravan" ? "lyre" : undefined} flip talk={mode === "ask"} />
          </>}
          {mode === "ask" && <><Bubble a={cues[0] ?? 10} x={900} y={420} w={320}>Why is it…?</Bubble>
            <div style={{ position: "absolute", left: 300, top: 470, opacity: ease(f, (cues[0] ?? 10) + 20, (cues[0] ?? 10) + 30), display: "flex", gap: 20 }}><Purse x={60} y={260} p={0} s={0.55} /><Purse x={260} y={260} p={0} s={0.55} /></div></>}
          {grey && <>{[0, 1, 2].map((i) => <Fig key={i} who="kid" x={640 + i * 240 + Math.sin(f / 9 + i * 2) * 60} y={900 - Math.abs(Math.sin(f / 7 + i)) * 20} s={1.3} walk flip={Math.cos(f / 9 + i * 2) < 0} />)}
            <div style={{ position: "absolute", left: 900 + Math.sin(f / 6) * 300, top: 760 - Math.abs(Math.sin(f / 4)) * 120, width: 34, height: 34, borderRadius: 17, background: "#ddd" }} /></>}
          {mode === "walk" && <><Fig who="bansir" x={walkX} y={900} s={1} walk /><Fig who="kobbi" x={walkX - 150} y={905} s={1} walk /></>}
          {mode === "home" && <><Fig who="bansir" x={walkX} y={900} s={1} walk flip /><Fig who="kobbi" x={walkX + 150} y={905} s={1} walk flip />
            {cues[0] !== undefined && <Bubble a={cues[0]} x={walkX + 10} y={480} w={330} think out={cues[1]}>too simple.</Bubble>}
            {cues[1] !== undefined && <Bubble a={cues[1]} x={walkX + 160} y={470} w={330} think>no secret at all.</Bubble>}</>}
        </BabStage>
      </AbsoluteFill>
      <Overlays o={o} />
    </Push>
  );
};
// 2. reparto de personajes (con su oficio); focus = el que se presenta
export const CAST: { who: Who; name: string; job: string; prop?: any }[] = [
  { who: "bansir", name: "Bansir", job: "chariot builder", prop: "wheel" }, { who: "kobbi", name: "Kobbi", job: "musician", prop: "lyre" },
  { who: "arkad", name: "Arkad", job: "richest man in Babylon", prop: "purse" }, { who: "algamish", name: "Algamish", job: "moneylender", prop: "staff" },
  { who: "azmur", name: "Azmur", job: "brickmaker", prop: "brick" }, { who: "rodan", name: "Rodan", job: "spear maker", prop: "spear" }, { who: "mathon", name: "Mathon", job: "gold lender", prop: "box" },
];
export const CastScene: React.FC<{ d: number; focus?: number; o?: Ov }> = ({ d, focus = -1, o = {} }) => {
  const f = useCurrentFrame();
  if (focus >= 0) {
    const c = CAST[focus], t = spring({ frame: f - 2, fps: 30, config: { damping: 14 } });
    return (
      <Push d={d} k={0.06} ox="40% 60%">
        <BabStage horizon={700} night={0.35} pan={0.25} sunX={1650}>
          <div style={{ position: "absolute", left: 230, top: 120, width: 700, height: 900, background: "radial-gradient(ellipse at 50% 70%, rgba(255,200,120,.32) 0%, transparent 62%)" }} />
          <div style={{ transform: `translateX(${(1 - t) * -120}px)`, opacity: t }}><Fig who={c.who} x={580} y={960} s={1.6} prop={c.prop} pose={c.prop === "spear" || c.prop === "staff" ? "hold" : "down"} talk={false} /></div>
          <div style={{ position: "absolute", left: 980, top: 400, fontFamily: F, fontWeight: 900, fontSize: 150, color: INK, opacity: ease(f, 6, 14), transform: `translateX(${(1 - ease(f, 6, 14)) * 40}px)`, textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{c.name}</div>
          <div style={{ position: "absolute", left: 990, top: 570, fontFamily: F, fontWeight: 800, fontSize: 56, color: ORA, opacity: ease(f, 14, 22) }}>{c.job}</div>
        </BabStage>
        <Overlays o={o} />
      </Push>
    );
  }
  return (
    <Push d={d} k={0.04}>
      <BabStage horizon={680} night={0.3} pan={0.2}>
        {CAST.map((c, i) => { const t = spring({ frame: f - 4 - i * 6, fps: 30, config: { damping: 15 } }); return (
          <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 60}px)` }}>
            <Fig who={c.who} x={250 + i * 240} y={900} s={1.25} prop={c.prop} pose={c.prop === "spear" || c.prop === "staff" ? "hold" : "down"} />
            <div style={{ position: "absolute", left: 150 + i * 240, top: 920, width: 200, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 34, color: INK }}>{c.name}</div>
          </div>); })}
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 3. el patio de Arkad: recibe a sus amigos / cuenta / enseña a alumnos (uno protesta)
export const HouseScene: React.FC<{ d: number; mode?: "welcome" | "tell" | "students" | "laugh"; o?: Ov; say?: string; sayAt?: number }> = ({ d, mode = "tell", o = {}, say, sayAt = 30 }) => {
  const f = useCurrentFrame();
  const inX = mode === "welcome" ? Math.min(1, f / 70) : 1;
  return (
    <Push d={d} k={0.05} ox="50% 70%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#2a3550 0%,#c4522a 60%,#e8833a 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, height: 560, background: "repeating-linear-gradient(90deg,#24508a 0 56px,#1d3f70 56px 60px)", opacity: 0.95 }} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} />)}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${120 + i * 240},300 l40,0 l6,-18 l-14,-8 l-38,6 Z`} fill="#e9c762" opacity={0.8} />)}
        {[200, 1720].map((x, i) => <g key={i}><rect x={x - 8} y={420} width={16} height={380} fill="#3a2a1a" />{Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M${x},430 q${Math.cos(k) * 90 + Math.sin(f / 20 + k) * 6},${-40 + Math.sin(k) * 30} ${Math.cos(k) * 160},${30 + Math.sin(k * 2) * 30}`} stroke="#1f4a2a" strokeWidth={16} fill="none" strokeLinecap="round" />)}</g>)}
      </svg>
      <AbsoluteFill style={{ top: 780, background: "linear-gradient(180deg,#c9a77a,#8a6a4a)" }} />
      <div style={{ position: "absolute", left: 760, top: 820, width: 400, height: 60, borderRadius: "50%", background: "#2a6a8a", boxShadow: "inset 0 6px 14px rgba(0,0,0,.4)" }}>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 200 - 30 - ((f + i * 20) % 60) * 2, top: 30 - ((f + i * 20) % 60) * 0.5, width: ((f + i * 20) % 60) * 4 + 60, height: ((f + i * 20) % 60) + 15, border: "2px solid rgba(255,255,255,.25)", borderRadius: "50%", opacity: 1 - ((f + i * 20) % 60) / 60 }} />)}</div>
      {mode === "students" ? <>
        <Fig who="arkad" x={540} y={900} s={1.4} pose="out" talk />
        {[0, 1, 2, 3].map((i) => <Fig key={i} who={i === 2 ? "woman" : "man"} x={1000 + i * 190} y={930} s={1.05} sit flip pose={i === 1 && f > sayAt ? "up" : "down"} />)}
        {say && <Bubble a={sayAt} x={1200} y={430} w={520}>{say}</Bubble>}
      </> : <>
        <Fig who="arkad" x={640} y={900} s={1.45} pose={mode === "welcome" ? "out" : mode === "laugh" ? "up" : "out"} talk={mode !== "welcome"} />
        <Fig who="bansir" x={1700 - inX * 480} y={905} s={1.3} flip walk={inX < 1} />
        <Fig who="kobbi" x={1880 - inX * 470} y={910} s={1.3} flip walk={inX < 1} />
        {mode === "tell" && <div style={{ position: "absolute", left: 620, top: 420, opacity: ease(f, 20, 30) }}><Bubble a={20} x={160} y={0} w={330}><div style={{ display: "flex", justifyContent: "center", gap: 10 }}>{[0, 1, 2].map((i) => <div key={i} style={{ transform: `translateY(${Math.sin(f / 6 + i) * 6}px)` }}><Ico k="coin" s={60} /></div>)}</div></Bubble></div>}
      </>}
      <Overlays o={o} />
    </Push>
  );
};
// 4. el joven Arkad graba la tablilla toda la noche; Algamish; el amanecer; la risa
export const ScribeScene: React.FC<{ d: number; mode?: "night" | "deal" | "dawn" | "laugh"; o?: Ov; cue?: number }> = ({ d, mode = "night", o = {}, cue = 30 }) => {
  const f = useCurrentFrame();
  const dawn = mode === "dawn" ? ease(f, 0, d * 0.6) : 0;
  const moonX = 1290 + f * 0.6;
  return (
    <Push d={d} k={0.05} ox="45% 60%">
      <AbsoluteFill style={{ background: "#2a1c14" }} />
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 3px, transparent 3px 40px), repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 3px, transparent 3px 80px)` }} />
      {/* ventana */}
      <div style={{ position: "absolute", left: 1180, top: 160, width: 420, height: 330, overflow: "hidden", border: "18px solid #3a2616", background: `linear-gradient(180deg, ${dawn > 0 ? `rgb(${30 + dawn * 160},${40 + dawn * 90},${70 + dawn * 30})` : "#0b1622"} 0%, ${dawn > 0 ? `rgb(${60 + dawn * 190},${50 + dawn * 100},${50})` : "#14263a"} 100%)` }}>
        {dawn < 0.5 && Array.from({ length: 20 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 400, top: rnd(i, 4) * 200, width: 3, height: 3, background: "#fff", opacity: (1 - dawn * 2) * (0.4 + 0.6 * Math.abs(Math.sin(f / 15 + i))) }} />)}
        {dawn < 0.5 && <div style={{ position: "absolute", left: moonX - 1180 - 60, top: 60 + f * 0.15, width: 70, height: 70, borderRadius: 35, background: "#f2ead2", boxShadow: "0 0 30px #f2ead288", opacity: 1 - dawn * 2 }} />}
        <svg width={420} height={330} style={{ position: "absolute", inset: 0 }}><path d="M0,330 L0,260 L60,260 L60,230 L120,230 L120,250 L200,250 L200,200 L240,200 L240,250 L330,250 L330,240 L420,240 L420,330 Z" fill="#0d121a" /></svg>
      </div>
      {/* mesa baja + tablillas */}
      <div style={{ position: "absolute", left: 420, top: 760, width: 900, height: 40, background: "#5a3a22", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 460, top: 800, width: 30, height: 120, background: "#4a2e18" }} /><div style={{ position: "absolute", left: 1250, top: 800, width: 30, height: 120, background: "#4a2e18" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1100 + (i % 2) * 70, top: 690 - Math.floor(i / 2) * 36, width: 64, height: 76, background: CLAY, border: "3px solid #7a5638", borderRadius: 8, transform: "rotate(-4deg)" }} />)}
      <div style={{ position: "absolute", left: 760, top: 690, width: 150, height: 74, background: "#c99a6a", border: "4px solid #7a5638", borderRadius: 10, overflow: "hidden" }}>
        {Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 10 + (i % 6) * 22, top: 10 + Math.floor(i / 6) * 20, width: 12, height: 8, background: "#7a5638", clipPath: "polygon(0 0,100% 50%,0 100%)", opacity: mode === "night" ? (f / 6 > i ? 1 : 0) : 1 }} />)}
      </div>
      {/* lámpara */}
      <div style={{ position: "absolute", left: 560, top: 700, width: 90, height: 50, background: "#8a5a32", borderRadius: "50% 50% 40% 40%" }} />
      <div style={{ position: "absolute", left: 592 + Math.sin(f / 3) * 2, top: 640 - Math.abs(Math.sin(f / 2.3)) * 8, width: 26, height: 60, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 50% 70%, #fff6c0, #ffb030 50%, #ff6a1a 90%)", opacity: mode === "dawn" ? 1 - dawn : 1 }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 31% 64%, rgba(255,170,60,${0.28 * (1 - dawn)}) 0%, transparent 40%)` }} />
      <Fig who="young" x={760} y={930} s={1.45} sit pose={mode === "laugh" ? "up" : "work"} prop="stylus" talk={mode === "deal" || mode === "laugh"} />
      {(mode === "deal" || mode === "dawn") && <Fig who="algamish" x={1450 - (mode === "dawn" ? ease(f, 0, 40) * 200 : 0)} y={930} s={1.5} flip prop="staff" pose="hold" talk={mode === "dawn" && f > cue} />}
      {mode === "deal" && <Bubble a={cue} x={760} y={340} w={420}>the secret? deal.</Bubble>}
      {mode === "laugh" && <Bubble a={cue} x={760} y={360} w={260}>ha! good one.</Bubble>}
      <Overlays o={o} />
    </Push>
  );
};
// 5. "pagás a todos menos a vos": monedas que vuelan al panadero, al sastre, al de las sandalias… y el lugar de VOS vacío
export const PayScene: React.FC<{ d: number; mode?: "everyone" | "empty"; o?: Ov; cues?: number[] }> = ({ d, mode = "everyone", o = {}, cues = [10, 40, 70] }) => {
  const f = useCurrentFrame();
  const stalls: [IconK, string][] = [["bread", "baker"], ["cloth", "tailor"], ["sandal", "sandals"]];
  return (
    <Push d={d} k={0.04} ox="50% 60%">
      <BabStage horizon={640} pan={0.2} sunX={1700}>
        <AbsoluteFill style={{ top: 760, background: "linear-gradient(180deg,#5a4028,#3a2a1a)" }} />
        {stalls.map(([k, n], i) => (
          <div key={i} style={{ position: "absolute", left: 980 + i * 300, top: 470, width: 240 }}>
            <div style={{ height: 50, background: `repeating-linear-gradient(90deg, ${["#a0402a", "#3d6f8e", "#c9952e"][i]} 0 30px, #e8dcc0 30px 60px)`, borderRadius: "8px 8px 0 0" }} />
            <div style={{ height: 240, background: "#6b4a2a", display: "flex", justifyContent: "center", paddingTop: 30 }}><Ico k={k} s={110} /></div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 34, color: INK, textAlign: "center", marginTop: 10 }}>{n}</div>
          </div>
        ))}
        <Fig who="young" x={480} y={900} s={1.4} pose={mode === "empty" ? "out" : "point"} prop={mode === "empty" ? undefined : "purse"} />
        {mode === "everyone" && cues.map((c, i) => Array.from({ length: 3 }).map((_, k) => { const t = lin(f, c + k * 5, c + k * 5 + 22); const x = 560 + (1100 + i * 300 - 560) * t, y = 700 - Math.sin(t * Math.PI) * 260; return t > 0 && t < 1 ? <Coin key={i + "_" + k} x={x} y={y} r={22} spin={f / 4} /> : null; }))}
        <div style={{ position: "absolute", left: 360, top: 280, width: 240, height: 240, borderRadius: 120, border: `6px dashed ${mode === "empty" ? RED : "rgba(240,235,229,.5)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: mode === "empty" ? 110 : 48, color: mode === "empty" ? RED : INK, opacity: ease(f, cues[2] + 20, cues[2] + 30) * (mode === "empty" ? 0.6 + 0.4 * Math.sin(f / 5) : 1) }}>{mode === "empty" ? "0" : "YOU?"}</div>
        {mode === "empty" && <Purse x={760} y={900} p={0} s={0.7} />}
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 6. la bolsa grande: engorda / gotea / pesa / años / vacía / una moneda
export const PurseScene: React.FC<{ d: number; mode?: "empty" | "drop" | "tenNine" | "heavy" | "leak" | "years" | "one" | "grey"; p0?: number; p1?: number; o?: Ov; owner?: Who }> = ({ d, mode = "drop", p0 = 0, p1 = 0.4, o = {}, owner }) => {
  const f = useCurrentFrame();
  let p = interpolate(f, [0, Math.max(d, 2)], [p0, p1], clamp);
  if (mode === "one") p = p0 + (f > d * 0.55 ? 0.04 : 0);
  const land = mode === "heavy" ? spring({ frame: f - 6, fps: 30, config: { damping: 7, mass: 1.4 } }) : 1;
  const cyc = 36, ci = Math.floor(f / cyc), cf = f % cyc;
  const yr = Math.min(10, 1 + Math.floor(f / Math.max(d / 10, 1)));
  return (
    <Push d={d} k={0.05} ox="50% 65%">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #4a2d18 0%, #160d07 72%)", filter: mode === "grey" ? "grayscale(1)" : undefined }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "linear-gradient(180deg,#5a3a22,#2a1a0e)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,190,100,.18) 0%, transparent 45%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - land) * -500}px)` }}>
        <Purse x={960} y={880} p={p} s={2.2} grey={mode === "grey"} holes={mode === "leak"} />
      </div>
      {mode === "drop" && Array.from({ length: 6 }).map((_, i) => { const t = ((f + i * 14) % 50) / 50; return <Coin key={i} x={940 + (rnd(i, 2) - 0.5) * 60} y={-60 + t * 520} r={26} spin={f / 5 + i} o={t < 0.95 ? 1 : 0} />; })}
      {mode === "tenNine" && <>{Array.from({ length: 10 }).map((_, i) => { const t = lin(cf, i * 1.5, i * 1.5 + 10); const back = i < 9 ? lin(cf, 20 + i, 30 + i) : 0; const x = 960 + (i - 4.5) * 14 + back * (i - 4) * 160, y = -60 + t * 480 - back * 80 + back * back * 900; return <Coin key={i} x={x} y={y} r={24} spin={f / 5 + i} o={t > 0 && y < 1100 ? 1 : 0} />; })}
        <div style={{ position: "absolute", left: 1330, top: 380, fontFamily: F, fontWeight: 900, fontSize: 110, color: ORA }}>10 in</div>
        <div style={{ position: "absolute", left: 1330, top: 520, fontFamily: F, fontWeight: 900, fontSize: 110, color: INK, opacity: cf > 20 ? 1 : 0.25 }}>9 out</div>
        <div style={{ position: "absolute", left: 260, top: 420, fontFamily: F, fontWeight: 900, fontSize: 64, color: GOLD }}>×{ci + 1}</div></>}
      {mode === "leak" && Array.from({ length: 9 }).map((_, i) => { const t = ((f + i * 11) % 40) / 40; return <Coin key={i} x={880 + (i % 3) * 80} y={860 + t * 220} r={14 + t * 6} o={1 - t} spin={f / 3 + i} />; })}
      {mode === "years" && <div style={{ position: "absolute", left: 1350, top: 440, fontFamily: F, fontWeight: 900, fontSize: 120, color: ORA, fontVariantNumeric: "tabular-nums" }}>year {yr}</div>}
      {mode === "one" && (() => { const t = lin(f, d * 0.3, d * 0.55); return t < 1 ? <Coin x={960} y={-40 + t * 560} r={30} spin={f / 4} /> : null; })()}
      {mode === "empty" && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={960 + Math.sin(f / 5) * 160} cy={420 + Math.sin(f / 3.3) * 60} r={6} fill="#111" /><path d={`M${960 + Math.sin(f / 5) * 160 - 10},${414 + Math.sin(f / 3.3) * 60} l-10,-10 M${960 + Math.sin(f / 5) * 160 + 10},${414 + Math.sin(f / 3.3) * 60} l10,-10`} stroke="#ddd" strokeWidth={3} opacity={0.6 + 0.4 * Math.sin(f)} /></svg>}
      {owner && <Fig who={owner} x={520} y={940} s={1.5} pose="point" />}
      <Overlays o={o} />
    </Push>
  );
};
// 7. diez monedas: guardá una / vivís con nueve / el orden / las nueve pagan los gustos y la décima no se toca
export const TenCoins: React.FC<{ d: number; mode?: "one" | "nine" | "first" | "pay9"; o?: Ov }> = ({ d, mode = "one", o = {} }) => {
  const f = useCurrentFrame();
  const X = (i: number) => 220 + i * 130;
  const up = lin(f, 30, 60);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1c10 0%, #080604 75%)", transform: `scale(${1 + lin(f, 0, d) * 0.04})` }}>
      {mode !== "first" && <>
        {Array.from({ length: 10 }).map((_, i) => { const t = spring({ frame: f - i * 2, fps: 30, config: { damping: 14 } }); const ten = i === 9;
          const x = ten && mode !== "nine" ? X(9) + up * 260 : X(i), y = 620 - (1 - t) * 200 - (ten && mode === "one" ? Math.sin(up * Math.PI) * 160 : 0);
          const gone = mode === "pay9" && !ten ? lin(f, 40 + i * 4, 60 + i * 4) : 0;
          return <Coin key={i} x={x + gone * (rnd(i, 3) - 0.5) * 300} y={y - gone * 400} r={50} o={t * (1 - gone)} spin={ten ? f / 8 : 0} />; })}
        <Purse x={X(9) + 280} y={820} p={mode === "one" ? 0.1 + up * 0.15 : 0.35} s={0.75} />
        <div style={{ position: "absolute", left: X(0) - 60, top: 720, width: X(8) - X(0) + 120, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 64, color: INK, opacity: ease(f, 40, 50), borderTop: "4px solid rgba(240,235,229,.5)", paddingTop: 18 }}>{mode === "pay9" ? "wants & needs" : "9 → you live on these"}</div>
        <div style={{ position: "absolute", left: X(9) + 120, top: 880, width: 340, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 54, color: GOLD, opacity: ease(f, 50, 60) }}>{mode === "pay9" ? "locked." : "1 → yours"}</div>
        {mode === "pay9" && <div style={{ position: "absolute", left: X(9) + 240, top: 560, opacity: ease(f, 60, 70) }}><Ico k="lock" s={110} /></div>}
      </>}
      {mode === "first" && <>
        <div style={{ position: "absolute", left: 300, top: 360, display: "flex", alignItems: "center", gap: 40, fontFamily: F, fontWeight: 900, fontSize: 70, color: "rgba(240,235,229,.5)", opacity: ease(f, 4, 12) }}>
          <span>SPEND</span><span>→</span><span>SAVE LEFTOVERS</span></div>
        <div style={{ position: "absolute", left: 280, top: 400, width: 1300 * ease(f, 30, 42), height: 10, background: RED, transform: "rotate(-1deg)" }} />
        <div style={{ position: "absolute", left: 300, top: 600, display: "flex", alignItems: "center", gap: 40, fontFamily: F, fontWeight: 900, fontSize: 84, color: INK, opacity: ease(f, 46, 56) }}>
          <span style={{ color: GOLD }}>1. SAVE</span><span>→</span><span>2. LIVE ON THE REST</span></div>
        <Coin x={360 + ease(f, 56, 90) * 160} y={800} r={40} spin={f / 6} o={ease(f, 50, 56)} />
      </>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 8. gastos que crecen hasta igualar lo que ganás (y el aumento que se evapora)
export const CreepBars: React.FC<{ d: number; mode?: "match" | "raise"; o?: Ov }> = ({ d, mode = "match", o = {} }) => {
  const f = useCurrentFrame();
  const raise = mode === "raise" ? ease(f, 20, 40) : 0;
  const earn = 0.62 + raise * 0.26;
  const spend = mode === "match" ? interpolate(f, [10, d * 0.8], [0.32, 0.62], clamp) : interpolate(f, [40, d * 0.85], [0.62, 0.88], clamp);
  const month = Math.min(6, 1 + Math.floor(lin(f, 20, d * 0.85) * 6));
  const bar = (x: number, h: number, c: string, t: string) => (<>
    <div style={{ position: "absolute", left: x, top: 900 - h * 700, width: 260, height: h * 700, background: c, borderRadius: "14px 14px 0 0", boxShadow: `0 0 40px ${c}55` }} />
    <div style={{ position: "absolute", left: x - 40, top: 920, width: 340, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 52, color: INK }}>{t}</div></>);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#160c0c,#0a0606)" }}>
      <div style={{ position: "absolute", left: 500, right: 500, top: 898, height: 4, background: "rgba(240,235,229,.3)" }} />
      {bar(640, earn, "#d9a441", "EARN")}
      {bar(1020, spend, RED, "SPEND")}
      <div style={{ position: "absolute", left: 600, top: 900 - earn * 700 - 6, width: 720, height: 0, borderTop: `4px dashed ${GOLD}` }} />
      {mode === "raise" && <div style={{ position: "absolute", left: 300, top: 900 - earn * 700 - 30, fontFamily: F, fontWeight: 900, fontSize: 60, color: GOLD, opacity: ease(f, 24, 32) }}>RAISE!</div>}
      <div style={{ position: "absolute", left: 1420, top: 520, fontFamily: F, fontWeight: 800, fontSize: 52, color: "rgba(240,235,229,.7)", fontVariantNumeric: "tabular-nums" }}>month {month}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 9. necesidad o gusto: los ítems caen en dos frascos; los gustos no se terminan nunca
export const SortScene: React.FC<{ d: number; mode?: "sort" | "more" | "decide"; o?: Ov }> = ({ d, mode = "sort", o = {} }) => {
  const f = useCurrentFrame();
  const items: [IconK, boolean][] = [["bread", true], ["cup", false], ["house", true], ["phone", false], ["box", false], ["necklace", false], ["cloth", true], ["shoe", false]];
  const jar = (x: number, t: string, c: string, n: number) => (<>
    <div style={{ position: "absolute", left: x, top: 560, width: 420, height: 400, borderRadius: "40px 40px 70px 70px", border: `8px solid ${c}`, background: "rgba(255,255,255,.06)" }} />
    <div style={{ position: "absolute", left: x, top: 470, width: 420, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 76, color: c }}>{t}</div>
    {mode === "more" && t === "WANT" && <div style={{ position: "absolute", left: x + 300, top: 980, fontFamily: F, fontWeight: 900, fontSize: 50, color: c }}>+{n}</div>}</>);
  const per = mode === "more" ? 12 : 22;
  const nMore = Math.floor(f / per);
  return (
    <Push d={d} k={0.04}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #233a52 0%, #0b1622 75%)" }} />
      {jar(330, "NEED", "#7fd47a", 0)}{jar(1170, "WANT", ORA, nMore)}
      {Array.from({ length: mode === "more" ? 40 : items.length }).map((_, i) => {
        const [k, need] = items[i % items.length]; const t0 = 10 + i * per; const t = lin(f, t0, t0 + 26);
        if (f < t0) return null;
        const tx = need && mode !== "more" ? 540 : 1380, x = 960 + (tx - 960) * ease(f, t0 + 6, t0 + 22) + (rnd(i, 4) - 0.5) * 140 * t, y = 200 + t * (mode === "more" ? 560 - Math.min(i, 12) * 22 : 640 - Math.floor(i / 2) * 50);
        return <div key={i} style={{ position: "absolute", left: x - 65, top: y - 65, transform: `rotate(${(rnd(i, 5) - 0.5) * 40 * t}deg)` }}><Ico k={mode === "more" ? items[1 + (i % 5)][0] : k} s={130} /></div>;
      })}
      {mode === "decide" && <Person x={960} y={1040} s={1.2} arms="up" />}
      <Overlays o={o} />
    </Push>
  );
};
// 10. el presupuesto no es una jaula: barras que bajan sobre la bolsa y se convierten en un mapa con rutas
export const CageMap: React.FC<{ d: number; mode?: "cage" | "map"; o?: Ov }> = ({ d, mode = "cage", o = {} }) => {
  const f = useCurrentFrame();
  const drop = mode === "cage" ? ease(f, 6, 30) : 1, morph = mode === "map" ? ease(f, 4, 40) : 0;
  const routes: [number, number, IconK, string][] = [[420, 300, "house", "home"], [1500, 280, "bread", "food"], [1560, 760, "coin", "purse"], [360, 780, "heart", "family"]];
  return (
    <AbsoluteFill style={{ background: morph ? `radial-gradient(ellipse at 50% 50%, rgb(${60 + morph * 150},${40 + morph * 120},${25 + morph * 70}) 0%, rgb(${20 + morph * 90},${14 + morph * 70},${10 + morph * 40}) 80%)` : "radial-gradient(ellipse at 50% 50%, #2a1c10 0%, #080604 75%)", transform: `scale(${1 + lin(f, 0, d) * 0.04})` }}>
      <Purse x={960} y={700} p={0.4} s={1.2} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {mode === "cage" && Array.from({ length: 9 }).map((_, i) => <line key={i} x1={700 + i * 65} y1={-600 + drop * 840} x2={700 + i * 65} y2={-600 + drop * 840 + 560} stroke="#8a8a8a" strokeWidth={14} strokeLinecap="round" />)}
        {mode === "cage" && <rect x={680} y={-620 + drop * 840} width={560} height={26} rx={10} fill="#777" />}
        {mode === "map" && routes.map(([x, y], i) => <path key={i} d={`M960,560 Q${(960 + x) / 2 + (i % 2 ? 120 : -120)},${(560 + y) / 2} ${x},${y}`} stroke="#7a4a1a" strokeWidth={8} strokeDasharray="22 16" fill="none" pathLength={1} strokeDashoffset={0} opacity={ease(f, 20 + i * 10, 30 + i * 10)} />)}
      </svg>
      {mode === "map" && routes.map(([x, y, k, t], i) => { const tt = lin(f, 30 + i * 10, 60 + i * 10); const q = (960 + x) / 2 + (i % 2 ? 120 : -120), qy = (560 + y) / 2;
        const bx = (1 - tt) ** 2 * 960 + 2 * (1 - tt) * tt * q + tt * tt * x, by = (1 - tt) ** 2 * 560 + 2 * (1 - tt) * tt * qy + tt * tt * y;
        return <React.Fragment key={i}><div style={{ position: "absolute", left: x - 60, top: y - 60, opacity: ease(f, 20 + i * 10, 30 + i * 10) }}><Ico k={k} s={120} c="#3a2414" /></div>
          <div style={{ position: "absolute", left: x - 80, top: y + 64, width: 160, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 36, color: "#3a2414", opacity: ease(f, 30 + i * 10, 40 + i * 10) }}>{t}</div>
          {tt > 0 && tt < 1 && <Coin x={bx} y={by} r={20} spin={f / 4} />}</React.Fragment>; })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 11. el ejército de monedas: salen a trabajar y vuelven con más (y el viejo sentado mientras trabajan por él)
export const CoinArmy: React.FC<{ d: number; mode?: "march" | "return" | "old"; o?: Ov }> = ({ d, mode = "march", o = {} }) => {
  const f = useCurrentFrame();
  const n = 9;
  return (
    <Push d={d} k={0.04} ox="40% 70%">
      <BabStage horizon={600} pan={0.3} sunX={1600}>
        <AbsoluteFill style={{ top: 760, background: "linear-gradient(180deg,#6a5030,#3a2a1a)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${1300 + i * 60},760 l0,-${60 + (i % 3) * 20}`} stroke="#c9a24a" strokeWidth={6} />)}</svg>
        <Purse x={260} y={930} p={mode === "march" ? 0.45 : 0.45 + lin(f, 0, d) * 0.4} s={1} />
        {mode === "old" && <Fig who="algamish" x={480} y={950} s={1.3} sit flip={false} prop="staff" pose="hold" />}
        {Array.from({ length: n }).map((_, i) => {
          const per = 120, ph = ((f + i * (per / n) * (mode === "return" ? 1 : 1)) % per) / per;
          const out = mode === "return" ? ph > 0.5 : true;
          const t = mode === "return" ? (ph < 0.5 ? ph * 2 : 2 - ph * 2) : ph;
          const x = 380 + t * 1250, y = 900 + (i % 3) * 30, leg = Math.sin(f / 3 + i) * 12;
          const kids = mode !== "march" && out ? 1 + (i % 2) : 0;
          return (
            <svg key={i} width={120} height={140} style={{ position: "absolute", left: x - 60, top: y - 120, overflow: "visible", transform: mode === "return" && out ? "scaleX(-1)" : undefined }}>
              <line x1={52} y1={88} x2={44 + leg} y2={124} stroke="#3a2414" strokeWidth={6} strokeLinecap="round" /><line x1={68} y1={88} x2={76 - leg} y2={124} stroke="#3a2414" strokeWidth={6} strokeLinecap="round" />
              <circle cx={60} cy={62} r={34} fill="#e9c762" stroke="#a87a22" strokeWidth={6} /><circle cx={50} cy={56} r={4} fill="#3a2414" /><circle cx={70} cy={56} r={4} fill="#3a2414" />
              {Array.from({ length: kids }).map((_, k) => <circle key={k} cx={20 + k * 80} cy={30} r={16} fill="#f2d47a" stroke="#a87a22" strokeWidth={4} />)}
            </svg>
          );
        })}
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 12. el árbol de las monedas: hijos y nietos del oro (interés compuesto)
export const CoinTree: React.FC<{ d: number; gens?: number; years?: boolean; o?: Ov }> = ({ d, gens = 4, years, o = {} }) => {
  const f = useCurrentFrame();
  const nodes: { x: number; y: number; g: number; px: number; py: number }[] = [];
  const rec = (x: number, y: number, g: number, spread: number, px: number, py: number) => { nodes.push({ x, y, g, px, py }); if (g < gens) { rec(x - spread, y - 170, g + 1, spread / 2, x, y); rec(x + spread, y - 170, g + 1, spread / 2, x, y); } };
  rec(960, 900, 0, 420, 960, 1000);
  const gt = (g: number) => ease(f, 10 + g * (d - 30) / (gens + 1), 30 + g * (d - 30) / (gens + 1));
  const yr = Math.round(1 + lin(f, 10, d - 10) * 19);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, #1d3a2a 0%, #07130d 75%)", transform: `scale(${1 + lin(f, 0, d) * 0.05})`, transformOrigin: "50% 90%" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => n.g > 0 && <line key={i} x1={n.px} y1={n.py} x2={n.px + (n.x - n.px) * gt(n.g)} y2={n.py + (n.y - n.py) * gt(n.g)} stroke="#6b4a2a" strokeWidth={Math.max(3, 18 - n.g * 4)} strokeLinecap="round" />)}
      </svg>
      {nodes.map((n, i) => <Coin key={i} x={n.x} y={n.y} r={Math.max(14, 46 - n.g * 8)} o={n.g === 0 ? 1 : gt(n.g)} spin={n.g ? f / 9 + i : 0} />)}
      {["", "children", "grandchildren", "and theirs", "…"].slice(1, gens + 1).map((t, g) => <div key={g} style={{ position: "absolute", left: 1500, top: 900 - (g + 1) * 170 - 26, fontFamily: F, fontWeight: 800, fontSize: 40, color: GOLD, opacity: gt(g + 1) }}>{t}</div>)}
      {years && <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 90, color: ORA, fontVariantNumeric: "tabular-nums" }}>year {yr}</div>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 13. lo que dan las monedas vs lo que ganás con las manos: las líneas se cruzan
export const CrossLines: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const W = 1300, H = 520, X = 300, Y = 330, prog = ease(f, 6, Math.max(d * 0.75, 20));
  const hands = (t: number) => 0.42 + t * 0.06, coins = (t: number) => 0.04 + Math.pow(t, 2.2) * 0.9;
  const N = 60, pts = (fn: (t: number) => number) => Array.from({ length: N + 1 }).map((_, i) => i / N).filter((t) => t <= prog).map((t) => `${X + t * W},${Y + H - fn(t) * H}`).join(" ");
  const tc = 0.72;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#120d08,#080604)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X} y1={Y + H} x2={X + W} y2={Y + H} stroke="rgba(240,235,229,.25)" strokeWidth={3} />
        <polyline points={pts(hands)} fill="none" stroke="#c9b48a" strokeWidth={8} strokeLinejoin="round" />
        <polyline points={pts(coins)} fill="none" stroke={GOLD} strokeWidth={9} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }} />
        {prog > tc && <circle cx={X + tc * W} cy={Y + H - hands(tc) * H} r={18 + Math.sin(f / 4) * 4} fill={RED} />}
      </svg>
      <div style={{ position: "absolute", left: X + W + 20, top: Y + H - hands(Math.min(prog, 1)) * H - 30, fontFamily: F, fontWeight: 800, fontSize: 40, color: "#c9b48a", opacity: ease(f, 10, 20) }}>your two hands</div>
      <div style={{ position: "absolute", left: X + W + 20, top: Y + H - coins(Math.min(prog, 1)) * H - 40, fontFamily: F, fontWeight: 900, fontSize: 44, color: GOLD, opacity: ease(f, 10, 20) }}>your coins</div>
      <div style={{ position: "absolute", left: X, top: Y + H + 20, fontFamily: F, fontWeight: 700, fontSize: 32, color: "rgba(240,235,229,.55)" }}>year after year →</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 14. mapa Babilonia → Fenicia (ruta de Azmur)
const MP = { L: 26.0, R: 56.0, T: 41.0, B: 24.5, W: 1920, H: 1056 };
const geo = (lon: number, lat: number): [number, number] => [(lon - MP.L) / (MP.R - MP.L) * MP.W, (MP.T - lat) / (MP.T - MP.B) * MP.H + 12];
export const VoyageMap: React.FC<{ d: number; mode?: "go" | "where" | "back"; o?: Ov }> = ({ d, mode = "go", o = {} }) => {
  const f = useCurrentFrame();
  const bab = geo(44.42, 32.54), tyre = geo(35.2, 33.27), mid = [ (bab[0] + tyre[0]) / 2, Math.min(bab[1], tyre[1]) - 220 ];
  const tt = mode === "where" ? 0 : ease(f, 10, Math.max(d * 0.8, 30));
  const t = mode === "back" ? 1 - tt : tt;
  const bz = (k: number) => [(1 - k) ** 2 * bab[0] + 2 * (1 - k) * k * mid[0] + k * k * tyre[0], (1 - k) ** 2 * bab[1] + 2 * (1 - k) * k * mid[1] + k * k * tyre[1]];
  const [cx, cy] = bz(t);
  const z = 1.1 + lin(f, 0, d) * 0.08;
  const pin = (p: number[], name: string, a: number, col: string) => (<>
    <div style={{ position: "absolute", left: p[0] - 16, top: p[1] - 16, width: 32, height: 32, borderRadius: 16, background: col, boxShadow: `0 0 ${20 + Math.sin(f / 5) * 10}px ${col}`, opacity: ease(f, a, a + 8) }} />
    <div style={{ position: "absolute", left: p[0] - 16 - (20 + (f % 40)), top: p[1] - 16 - (20 + (f % 40)), width: 72 + (f % 40) * 2, height: 72 + (f % 40) * 2, borderRadius: "50%", border: `3px solid ${col}`, opacity: (1 - (f % 40) / 40) * ease(f, a, a + 8) }} />
    <div style={{ position: "absolute", left: p[0] + 30, top: p[1] - 40, fontFamily: F, fontWeight: 900, fontSize: 46, color: INK, textShadow: "0 3px 10px #000", letterSpacing: 2, opacity: ease(f, a + 4, a + 12) }}>{name}</div></>);
  return (
    <AbsoluteFill style={{ background: "#12304a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${(bab[0] + tyre[0]) / 2 / 19.2}% ${bab[1] / 10.8}%` }}>
        <Img src={sf("img/t30moneen/map_ocre.png")} style={{ position: "absolute", left: 0, top: 12, width: 1920, height: 1056 }} />
        {mode !== "where" && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${bab[0]},${bab[1]} Q${mid[0]},${mid[1]} ${tyre[0]},${tyre[1]}`} stroke={RED} strokeWidth={7} strokeDasharray="20 14" fill="none" opacity={0.9} /></svg>}
        {pin(bab, "BABYLON", 2, GOLD)}
        {mode !== "where" && pin(tyre, "PHOENICIA", 16, RED)}
        {mode !== "where" && <div style={{ position: "absolute", left: cx - 50, top: cy - 70, transform: mode === "back" ? undefined : "scaleX(-1)" }}><Camel x={50} y={70} s={0.45} color="#2a1a10" /></div>}
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 15. las joyas preciosas… que eran vidrio de colores (se rajan y se apagan)
export const GlassScene: React.FC<{ d: number; mode?: "reveal" | "grey" | "brick"; at?: number; o?: Ov }> = ({ d, mode = "reveal", at = 40, o = {} }) => {
  const f = useCurrentFrame();
  const crack = mode === "reveal" ? ease(f, at, at + 14) : 1;
  const gems = [[560, 600, "#c4302a"], [800, 640, "#2f7ad9"], [1040, 590, "#2fae6a"], [1280, 630, "#8a3ad9"], [1500, 600, "#d9a12f"]] as const;
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3a2412 0%, #0e0804 75%)", filter: mode === "grey" ? "grayscale(1) brightness(.8)" : undefined }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, bottom: 0, background: "linear-gradient(180deg,#6a5236 0%,#3a2a1a 100%)", opacity: 0.95, filter: mode === "grey" ? "grayscale(1)" : undefined }} />
      {gems.map(([x, y, c], i) => {
        const sp = Math.max(0, Math.sin(f / 7 + i * 1.3)) * (1 - crack);
        return (
          <div key={i} style={{ position: "absolute", left: x - 140, top: y - 160 + Math.sin(f / 15 + i) * 4, filter: mode === "grey" ? "grayscale(1)" : undefined }}>
            <svg width={260} height={260} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `saturate(${1 - crack * 0.6}) brightness(${1 - crack * 0.25})` }}>
              <path d="M30,30 L70,30 L86,46 L50,88 L14,46 Z" fill={c} opacity={0.92 - crack * 0.35} />
              <path d="M30,30 L40,46 L50,30 L60,46 L70,30 M14,46 L86,46 M40,46 L50,88 L60,46" stroke="rgba(255,255,255,.6)" strokeWidth={2} fill="none" opacity={1 - crack} />
              <path d={`M50,32 L46,50 L56,60 L48,80 M46,50 L30,52 M56,60 L72,52`} stroke="#fff" strokeWidth={2.5} fill="none" opacity={crack} />
              <circle cx={38} cy={36} r={6 * sp} fill="#fff" />
              <path d={`M38,${24 - sp * 8} L38,${48 + sp * 8} M${26 - sp * 8},36 L${50 + sp * 8},36`} stroke="#fff" strokeWidth={2} opacity={sp} />
            </svg>
          </div>
        );
      })}
      {mode === "brick" && <div style={{ position: "absolute", left: 160, top: 500 }}><Ico k="brick" s={260} /></div>}
      <Overlays o={o} />
    </Push>
  );
};
// 16. preguntale al que sabe: pan → panadero ✓ · joyas → joyero ✓ · joyas → ladrillero ✗
export const AskExpert: React.FC<{ d: number; mode?: "scold" | "pairs" | "ask"; cues?: number[]; o?: Ov }> = ({ d, mode = "pairs", cues = [10, 50, 90], o = {} }) => {
  const f = useCurrentFrame();
  if (mode === "scold") return (
    <Push d={d} k={0.05} ox="50% 70%">
      <BabStage horizon={620} night={0.4} pan={0.2}>
        <AbsoluteFill style={{ top: 780, background: "linear-gradient(180deg,#5a4028,#3a2a1a)" }} />
        <Fig who="algamish" x={1180} y={920} s={1.6} flip prop="staff" pose="hold" talk={f > cues[0]} />
        <Fig who="arkad" x={680} y={930} s={1.45} pose="think" />
        <Bubble a={cues[0]} x={1150} y={300} w={560}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}><Ico k="brick" s={70} /> + <Ico k="jewel" s={70} /> ?!</div></Bubble>
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
  const rows: [IconK, Who, string, boolean][] = mode === "ask" ? [["coin", "jeweler", "someone who knows", true]] : [["jewel", "azmur", "brickmaker", false], ["bread", "baker", "baker", true], ["jewel", "jeweler", "jeweler", true]];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a1c10 0%, #080604 75%)", transform: `scale(${1 + lin(f, 0, d) * 0.04})` }}>
      {rows.map(([k, who, n, ok], i) => { const a = cues[i] ?? 10 + i * 40, t = ease(f, a, a + 10), y = mode === "ask" ? 520 : 300 + i * 250;
        return (
          <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}>
            <div style={{ position: "absolute", left: 360, top: y - 70 }}><Ico k={k} s={140} /></div>
            <div style={{ position: "absolute", left: 560, top: y - 30, width: 300 * ease(f, a + 6, a + 18), height: 10, background: INK, borderRadius: 5 }} />
            <div style={{ position: "absolute", left: 860, top: y - 46, width: 0, height: 0, borderTop: "28px solid transparent", borderBottom: "28px solid transparent", borderLeft: `40px solid ${INK}`, opacity: ease(f, a + 16, a + 18) }} />
            <Fig who={who} x={1040} y={y + 90} s={0.5} flip />
            <div style={{ position: "absolute", left: 1140, top: y - 40, fontFamily: F, fontWeight: 900, fontSize: 54, color: INK }}>{n}</div>
            <div style={{ position: "absolute", left: 1720, top: y - 70, opacity: ease(f, a + 20, a + 26), transform: `scale(${1.3 - 0.3 * ease(f, a + 20, a + 26)})` }}><Mark ok={ok} s={120} /></div>
          </div>); })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 17. Rodan: el rey le da 50 de oro / todos quieren un pedazo / se queda con su oro
export const RodanScene: React.FC<{ d: number; mode?: "reward" | "crowd" | "keep"; cues?: number[]; o?: Ov }> = ({ d, mode = "reward", cues = [20, 60, 100], o = {} }) => {
  const f = useCurrentFrame();
  const says = ["lend it to my husband!", "can't miss!", "a sure thing!", "just this once…"];
  return (
    <Push d={d} k={0.05} ox="50% 65%">
      <BabStage horizon={620} night={mode === "keep" ? 0.5 : 0.2} pan={0.2} zig={1500}>
        <AbsoluteFill style={{ top: 780, background: "linear-gradient(180deg,#5a4028,#3a2a1a)" }} />
        {mode === "reward" && <>
          <div style={{ position: "absolute", left: 1180, top: 600, width: 260, height: 200, background: "#6b2a1a", borderRadius: "20px 20px 0 0", border: "8px solid #c9a24a" }} />
          <Fig who="king" x={1300} y={930} s={1.6} flip pose="out" />
          <Fig who="rodan" x={720} y={930} s={1.5} pose={f > cues[0] + 20 ? "hold" : "out"} prop="spear" />
          {Array.from({ length: 50 }).map((_, i) => { const t = lin(f, cues[0] + i * 1.2, cues[0] + i * 1.2 + 20); return t > 0 && t < 1 ? <Coin key={i} x={1200 - t * 420 + (rnd(i, 2) - 0.5) * 60} y={720 - Math.sin(t * Math.PI) * 240} r={16} spin={f / 4 + i} /> : null; })}
          <div style={{ position: "absolute", left: 360, top: 330, fontFamily: F, fontWeight: 900, fontSize: 170, color: GOLD, opacity: ease(f, cues[0] + 30, cues[0] + 40), textShadow: `0 0 40px ${GOLD}66`, fontVariantNumeric: "tabular-nums" }}>{Math.round(50 * lin(f, cues[0], cues[0] + 60))}</div>
          <div style={{ position: "absolute", left: 370, top: 510, fontFamily: F, fontWeight: 800, fontSize: 46, color: INK, opacity: ease(f, cues[0] + 40, cues[0] + 50) }}>pieces of gold</div>
        </>}
        {mode !== "reward" && <>
          <Fig who="rodan" x={960} y={930} s={1.6} pose="hold" prop="purse" />
          {[0, 1, 2, 3].map((i) => { const side = i % 2 ? 1 : -1, a = cues[i] ?? 20 + i * 30, t = ease(f, a, a + 30), x = 960 + side * (900 - t * 480 - (mode === "keep" ? -ease(f, 0, 60) * 500 : 0)) - side * Math.floor(i / 2) * 120;
            return <React.Fragment key={i}><Fig who={i === 0 ? "woman" : "man"} x={x} y={940} s={1.3} flip={side > 0} walk={t < 1} pose="out" grey={mode === "keep"} />
              {mode === "crowd" && <Bubble a={a + 10} x={x} y={430 - Math.floor(i / 2) * 140} w={i === 0 ? 470 : 340}>{says[i]}</Bubble>}</React.Fragment>; })}
          {mode === "keep" && <div style={{ position: "absolute", left: 830, top: 560, width: 260, height: 260, borderRadius: 130, boxShadow: `0 0 80px ${GOLD}88`, opacity: 0.6 + 0.4 * Math.sin(f / 6) }} />}
        </>}
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 18. la caja de fichas de Mathon: se abre, las fichas suben, cada una con su historia (✓ / ✗)
export const TokenBox: React.FC<{ d: number; mode?: "open" | "stories" | "split"; cues?: number[]; o?: Ov }> = ({ d, mode = "open", cues = [10, 60, 110], o = {} }) => {
  const f = useCurrentFrame();
  const lid = mode === "open" ? ease(f, 6, 30) : 1;
  const st: [IconK, boolean, string][] = [["cow", true, "the farmer"], ["cloud", false, "the dreamer"], ["necklace", false, "the jewelry"]];
  return (
    <Push d={d} k={0.05} ox="50% 60%">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #3a2412 0%, #0e0804 75%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "linear-gradient(180deg,#5a3a22,#2a1a0e)" }} />
      <div style={{ position: "absolute", left: 660, top: 640, width: 600, height: 220, background: "linear-gradient(180deg,#6b4a2a,#4a2e18)", border: "8px solid #2a1a0e", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 660, top: 600, width: 600, height: 60, background: "#7a5634", border: "8px solid #2a1a0e", borderRadius: 10, transformOrigin: "50% 100%", transform: `perspective(900px) rotateX(${lid * 105}deg)` }} />
      {mode === "open" && Array.from({ length: 14 }).map((_, i) => { const t = lin(f, 20 + i * 3, 60 + i * 3); return <div key={i} style={{ position: "absolute", left: 720 + (i % 7) * 75, top: 650 - t * (200 + rnd(i, 3) * 160) + Math.sin(f / 8 + i) * 6, width: 40, height: 40, borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "6px" : "50% 50% 4px 4px", background: CLAY, border: "3px solid #7a5638", opacity: t }} />; })}
      {mode !== "open" && st.map(([k, ok, n], i) => { const a = cues[i] ?? 10 + i * 50, t = ease(f, a, a + 14), x = 420 + i * 540, y = mode === "split" ? (ok ? 260 : 420) : 280;
        return (
          <div key={i} style={{ position: "absolute", left: x - 140, top: y + (1 - t) * 300, width: 280, opacity: t, textAlign: "center" }}>
            <div style={{ width: 160, height: 160, margin: "0 auto", borderRadius: "50%", background: CLAY, border: "6px solid #7a5638", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${ok ? "#7fd47a55" : "#f1453655"}` }}><Ico k={k} s={110} /></div>
            <div style={{ marginTop: 10, fontFamily: F, fontWeight: 900, fontSize: 40, color: INK }}>{n}</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 8, opacity: ease(f, a + 30, a + 36) }}><Mark ok={ok} s={90} /></div>
          </div>); })}
      <Overlays o={o} />
    </Push>
  );
};
// 19. tres preguntas antes de prestar (se tildan)
export const Questions3: React.FC<{ d: number; cues?: number[]; o?: Ov }> = ({ d, cues = [10, 60, 110], o = {} }) => {
  const f = useCurrentFrame();
  const qs = ["Will this money come back to me?", "Does the person really know this business?", "Is there something solid behind the promise?"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #2a1c10 0%, #080604 75%)", transform: `scale(${1 + lin(f, 0, d) * 0.04})` }}>
      <div style={{ position: "absolute", left: 1500, top: 420, transform: `rotate(${Math.sin(f / 20) * 4}deg)` }}><Purse x={150} y={330} p={0.5} s={1.1} /></div>
      {qs.map((q, i) => { const a = cues[i], t = ease(f, a, a + 10);
        return (
          <div key={i} style={{ position: "absolute", left: 180, top: 300 + i * 200, display: "flex", alignItems: "center", gap: 36, opacity: t, transform: `translateX(${(1 - t) * -40}px)` }}>
            <div style={{ width: 90, height: 90, borderRadius: 14, border: `6px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={70} height={70}><path d="M10,36 l18,18 l34,-40" stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, a + 30, a + 40)} /></svg></div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 56, color: INK, maxWidth: 1150 }}>{q}</div>
          </div>); })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 20. balanza: crecimiento y seguridad juntos / mejor demasiado cuidadoso que arrepentido
export const Balance: React.FC<{ d: number; l: string; r: string; tip?: number; o?: Ov }> = ({ d, l, r, tip = 0, o = {} }) => {
  const f = useCurrentFrame();
  const ang = interpolate(spring({ frame: f - 20, fps: 30, config: { damping: 8, mass: 1.3 } }), [0, 1], [tip ? -tip : 8, tip]) + Math.sin(f / 15) * (tip ? 0.6 : 2.2);
  const box = (t: string, c: string) => <div style={{ minWidth: 260, padding: "36px 26px", borderRadius: 16, background: c, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 50, color: "#1b1410", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>{t}</div>;
  return (
    <BabStage night={0.65} pan={0.2} horizon={700}>
      <div style={{ position: "absolute", left: 910, top: 760, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "110px solid #2a1c14" }} />
      <div style={{ position: "absolute", left: 360, top: 750, width: 1200, height: 18, borderRadius: 9, background: "#c9a24a", transform: `rotate(${ang}deg)`, transformOrigin: "600px 9px" }}>
        <div style={{ position: "absolute", left: 20, bottom: 18 }}>{box(l, GOLD)}</div>
        <div style={{ position: "absolute", right: 20, bottom: 18 }}>{box(r, tip ? RED : "#7fd47a")}</div>
      </div>
      <Overlays o={o} />
    </BabStage>
  );
};
// 21. casa alquilada (la plata se va al dueño) vs casa propia (la plata se queda, jardín, chicos)
export const HomeScene: React.FC<{ d: number; mode?: "rent" | "own" | "build"; o?: Ov }> = ({ d, mode = "rent", o = {} }) => {
  const f = useCurrentFrame();
  const House = ({ x, w, h, c, lit }: { x: number; w: number; h: number; c: string; lit?: boolean }) => (
    <div style={{ position: "absolute", left: x, top: 880 - h, width: w, height: h, background: c, boxShadow: "inset 0 10px 0 rgba(255,255,255,.08)" }}>
      <div style={{ position: "absolute", left: w / 2 - 28, bottom: 0, width: 56, height: 90, background: "#1b1410", borderRadius: "28px 28px 0 0" }} />
      {lit && <div style={{ position: "absolute", left: 30, top: 40, width: 40, height: 40, background: "#ffc46b" }} />}
    </div>
  );
  const bricks = mode === "build" ? Math.floor(lin(f, 10, d - 10) * 24) : 0;
  return (
    <Push d={d} k={0.05} ox="50% 75%">
      <BabStage horizon={620} pan={0.2} night={0.15}>
        <AbsoluteFill style={{ top: 880, background: "linear-gradient(180deg,#5a4028,#3a2a1a)" }} />
        {mode === "rent" && <>
          <House x={300} w={420} h={300} c="#7a5a3a" lit />
          {Array.from({ length: 6 }).map((_, i) => <Fig key={i} who={i % 3 === 0 ? "woman" : i % 3 === 1 ? "man" : "kid"} x={340 + i * 62} y={880} s={0.4} />)}
          <House x={1250} w={460} h={420} c="#c9952e" />
          <Fig who="man" x={1480} y={880} s={1.05} flip pose="out" />
          {Array.from({ length: 4 }).map((_, i) => { const t = ((f + i * 22) % 88) / 88; return <Coin key={i} x={720 + t * 560} y={640 - Math.sin(t * Math.PI) * 200} r={22} spin={f / 4} />; })}
          <div style={{ position: "absolute", left: 820, top: 330, fontFamily: F, fontWeight: 900, fontSize: 64, color: RED }}>rent →</div>
        </>}
        {mode !== "rent" && <>
          <House x={560} w={560} h={mode === "build" ? 40 + bricks * 14 : 380} c="#9a7048" lit={mode === "own"} />
          {mode === "build" && Array.from({ length: bricks }).map((_, i) => <div key={i} style={{ position: "absolute", left: 560 + (i % 8) * 70, top: 880 - 14 - Math.floor(i / 8) * 46, width: 66, height: 40, background: "#a0603a", border: "3px solid #6a3a20" }} />)}
          {mode === "own" && <>{Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1180 + i * 60, top: 820 + Math.sin(f / 10 + i) * 3, width: 30, height: 30, borderRadius: 15, background: ["#e05a4a", "#e9c762", "#d96aa0"][i % 3] }} />)}
            <Fig who="kid" x={1250 + Math.sin(f / 10) * 140} y={900} s={1.2} walk flip={Math.cos(f / 10) < 0} /><Fig who="kid" x={1500 - Math.sin(f / 12) * 120} y={905} s={1.1} walk flip={Math.cos(f / 12) > 0} />
            <Fig who="woman" x={460} y={900} s={1.25} pose="hold" /></>}
          <Purse x={1700} y={900} p={0.35 + lin(f, 0, d) * 0.3} s={0.7} />
          {Array.from({ length: 3 }).map((_, i) => { const t = ((f + i * 30) % 90) / 90; return <Coin key={i} x={900 + t * 780} y={600 - Math.sin(t * Math.PI) * 120 + t * 160} r={20} spin={f / 4} />; })}
        </>}
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 22. envejecer: el mismo hombre camina, envejece, y la bolsa del futuro crece con él
export const AgeScene: React.FC<{ d: number; mode?: "age" | "family"; o?: Ov }> = ({ d, mode = "age", o = {} }) => {
  const f = useCurrentFrame();
  const t = lin(f, 0, d), x = 260 + t * 1300;
  const old = t > 0.55;
  return (
    <Push d={d} k={0.04}>
      <BabStage horizon={640} pan={0.3} night={t * 0.5} sunX={1700 - t * 1200}>
        <AbsoluteFill style={{ top: 860, background: "linear-gradient(180deg,#5a4028,#3a2a1a)" }} />
        {[0.2, 0.5, 0.8].map((k, i) => <div key={i} style={{ position: "absolute", left: 260 + k * 1300 - 60, top: 980, width: 120, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 38, color: "rgba(240,235,229,.7)" }}>{["young", "", "old"][i]}</div>)}
        <Fig who={old ? "mathon" : "bansir"} x={x} y={900} s={1.4} walk={!old || mode === "age"} prop={old ? "staff" : "purse"} pose={old ? "hold" : "down"} />
        <Purse x={x + 170} y={900} p={0.1 + t * 0.7} s={0.65} />
        {mode === "family" && <><Fig who="woman" x={x - 160} y={905} s={1.25} walk /><Fig who="kid" x={x - 270} y={910} s={1.2} walk /></>}
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 23. mejorar en lo que hacés: el artesano sube escalones y la paga crece
export const SkillStairs: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const steps = 5, k = Math.min(steps - 1, Math.floor(lin(f, 10, d - 10) * steps));
  const sub = lin(f, 10, d - 10) * steps - k;
  const sx = (i: number) => 360 + i * 260, sy = (i: number) => 900 - i * 110;
  const labels = ["learn", "practice", "care", "skill", "worth more"];
  return (
    <Push d={d} k={0.04} ox="50% 70%">
      <BabStage horizon={560} pan={0.2} night={0.3}>
        {Array.from({ length: steps }).map((_, i) => <React.Fragment key={i}>
          <div style={{ position: "absolute", left: sx(i), top: sy(i), width: 260, height: 1080 - sy(i), background: `linear-gradient(180deg,#8a6440,#5a3e28)`, borderTop: "8px solid #a07a50" }} />
          <div style={{ position: "absolute", left: sx(i), top: sy(i) + 20, width: 260, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 36, color: INK, opacity: i <= k ? 1 : 0.3 }}>{labels[i]}</div>
          <div style={{ position: "absolute", left: sx(i) + 100, top: sy(i) - 330, opacity: i <= k ? ease(f, 10 + i * (d - 20) / steps, 20 + i * (d - 20) / steps) : 0 }}>{Array.from({ length: i + 1 }).map((_, c) => <Coin key={c} x={30} y={-c * 16} r={26} />)}</div>
        </React.Fragment>)}
        <Fig who="rodan" x={sx(k) + 130 + (sub > 0.8 ? (sub - 0.8) * 5 * 130 : 0)} y={sy(k) - (sub > 0.8 ? (sub - 0.8) * 5 * 110 : 0)} s={1.1} walk pose="work" />
      </BabStage>
      <Overlays o={o} />
    </Push>
  );
};
// 24. lo que agregó Arkad: deudas, familia, testamento, respeto
export const Virtues: React.FC<{ d: number; cues?: number[]; o?: Ov }> = ({ d, cues = [10, 40, 70, 100], o = {} }) => {
  const f = useCurrentFrame();
  const v: [IconK, string][] = [["coin", "pay your debts"], ["family", "care for your family"], ["seal", "make a will"], ["hands", "respect & kindness"]];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)", transform: `scale(${1 + lin(f, 0, d) * 0.04})` }}>
      {v.map(([k, t], i) => { const a = cues[i], s = spring({ frame: f - a, fps: 30, config: { damping: 13 } });
        return (
          <div key={i} style={{ position: "absolute", left: 160 + i * 410, top: 380 + (1 - s) * 80, width: 370, height: 420, opacity: s, borderRadius: 18, background: "linear-gradient(180deg,#2a1c10,#4a3020)", border: "4px solid rgba(255,170,90,.5)", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
            <div style={{ marginTop: 60, transform: `translateY(${Math.sin(f / 10 + i) * 6}px)` }}><Ico k={k} s={150} c={INK} /></div>
            <div style={{ marginTop: 40, fontFamily: F, fontWeight: 900, fontSize: 40, color: INK, padding: "0 20px" }}>{t}</div>
          </div>); })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 25. LA TABLILLA de las 7 reglas (abre cada regla: la actual se graba y brilla; las vistas quedan grabadas y apagadas) + la bolsa al costado
export const RULES = ["Start your purse to fattening", "Control your expenses", "Make your gold multiply", "Guard your treasure from loss", "Make your home a profitable investment", "Insure a future income", "Increase your ability to earn"];
export const RuleTablet: React.FC<{ d: number; active?: number; final?: number[]; caption?: string; o?: Ov; hot?: number }> = ({ d, active = -1, final, caption, o = {}, hot }) => {
  const f = useCurrentFrame();
  const done = (i: number) => final ? f >= final[i] : i < active;
  const writing = (i: number) => final ? ease(f, final[i], final[i] + 24) : i === active ? ease(f, 14, 44) : done(i) ? 1 : 0;
  const nDone = RULES.filter((_, i) => writing(i) > 0.5).length;
  const t = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const ai = final ? RULES.reduce((m, _, i) => (f >= final[i] ? i : m), -1) : active;
  const sty = 210 + Math.max(0, ai) * 92 + 46;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, #3a2412 0%, #0d0804 75%)" }}>
      <div style={{ position: "absolute", left: 250, top: 120 + (1 - t) * 60, width: 1130, height: 840, borderRadius: 50, background: "radial-gradient(ellipse at 40% 30%, #d7a877 0%, #b88a5c 55%, #8f6640 100%)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 40px rgba(90,50,20,.5)", transform: `rotate(-1.2deg) scale(${1 + lin(f, 0, d) * 0.03})`, opacity: t }}>
        {RULES.map((r, i) => { const w = writing(i), on = i === ai, dim = !on && w > 0.5;
          return (
            <div key={i} style={{ position: "absolute", left: 60, top: 90 + i * 92, width: 1010, height: 80, display: "flex", alignItems: "center", gap: 22, opacity: hot !== undefined ? (i === hot ? 1 : 0.35) : 1 }}>
              <div style={{ width: 66, height: 66, borderRadius: 33, background: on ? GOLD : "rgba(110,70,40,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 38, color: on ? "#3a2410" : "rgba(80,50,25,.8)", boxShadow: on ? `0 0 30px ${GOLD}` : "inset 2px 2px 4px rgba(0,0,0,.35)" }}>{i + 1}</div>
              <div style={{ position: "relative", flex: 1, height: 66, borderBottom: "3px solid rgba(110,70,40,.3)" }}>
                <div style={{ position: "absolute", left: 0, top: 6, fontFamily: F, fontWeight: 900, fontSize: 39, color: on ? "#4a2a10" : dim ? "rgba(90,58,30,.6)" : "#5a3a1e", textShadow: "1px 1px 0 rgba(255,235,200,.45), -1px -1px 0 rgba(60,30,10,.45)", clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap" }}>{r}</div>
              </div>
            </div>); })}
        {ai >= 0 && writing(ai) < 1 && <div style={{ position: "absolute", left: 140 + writing(ai) * 900, top: sty - 210 - 100, width: 10, height: 120, background: "#d8c08a", transform: "rotate(30deg)", borderRadius: 4, boxShadow: "0 4px 10px rgba(0,0,0,.4)" }} />}
      </div>
      <div style={{ position: "absolute", left: 1460, top: 300 }}><Purse x={200} y={560} p={Math.min(1, nDone / 7)} s={1.2} /></div>
      <div style={{ position: "absolute", left: 1470, top: 880, width: 380, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 34, color: "rgba(240,235,229,.6)" }}>{nDone ? `${nDone} of 7` : "a lean purse"}</div>
      {caption && <Build a={28} lines={[caption]} y={30} size={70} />}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 26. la frase grabada en arcilla (la revelación del libro)
export const QuoteTablet: React.FC<{ d: number; lines: string[]; o?: Ov; a?: number }> = ({ d, lines, o = {}, a = 6 }) => {
  const f = useCurrentFrame();
  let k = 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a2412 0%, #0d0804 75%)" }}>
      <div style={{ position: "absolute", left: 210, top: 200, width: 1500, height: 680, borderRadius: 60, background: "radial-gradient(ellipse at 40% 30%, #d7a877 0%, #b88a5c 55%, #8f6640 100%)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 50px rgba(90,50,20,.5)", transform: `scale(${1 + lin(f, 0, d) * 0.05}) rotate(${-1 + lin(f, 0, d) * 1}deg)` }}>
        <div style={{ position: "absolute", left: 80, right: 80, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
          {lines.map((l, li) => <div key={li} style={{ fontFamily: F, fontWeight: 900, fontSize: 82, lineHeight: 1.15, textAlign: "center" }}>
            {l.split(" ").map((w, i) => { const t = ease(f, a + k * 9, a + k++ * 9 + 8), key = w.startsWith("*");
              return <span key={i} style={{ display: "inline-block", marginRight: 22, opacity: t, transform: `scale(${1.3 - 0.3 * t})`, color: key ? "#8a1f10" : "#5a3a1e", textShadow: "2px 2px 0 rgba(255,235,200,.45), -2px -2px 0 rgba(60,30,10,.5)" }}>{w.replace(/\*/g, "")}</span>; })}
          </div>)}
        </div>
      </div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 27. el librito: tapa, folletos que regalaban, y el reparto
export const BookCover: React.FC<{ d: number; mode?: "book" | "pamphlets" | "author"; o?: Ov }> = ({ d, mode = "book", o = {} }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - 2, fps: 30, config: { damping: 15 } });
  const Book = ({ x, y, r, s }: { x: number; y: number; r: number; s: number }) => (
    <div style={{ position: "absolute", left: x - 230 * s, top: y - 320 * s, width: 460 * s, height: 640 * s, transform: `rotate(${r}deg)`, background: "linear-gradient(135deg,#e8dcc0,#cdbb94)", border: `${6 * s}px solid #6b2a1a`, boxShadow: "0 30px 60px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: F, color: "#4a2410", textAlign: "center" }}>
      <div style={{ marginTop: 90 * s, fontSize: 30 * s, fontWeight: 800, letterSpacing: 4 * s }}>THE</div>
      <div style={{ fontSize: 64 * s, fontWeight: 900, lineHeight: 1.05, padding: `0 ${30 * s}px` }}>RICHEST MAN IN BABYLON</div>
      <div style={{ marginTop: 40 * s, width: 120 * s, height: 120 * s }}><svg viewBox="0 0 100 100" width="100%" height="100%">{[0, 1, 2, 3].map((i) => <rect key={i} x={50 - (40 - i * 9)} y={80 - i * 18} width={(40 - i * 9) * 2} height={16} fill="#6b2a1a" />)}</svg></div>
      <div style={{ marginTop: "auto", marginBottom: 50 * s, fontSize: 28 * s, fontWeight: 800 }}>GEORGE S. CLASON</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2a3550 0%, #0b1622 78%)" }}>
      {mode === "pamphlets" && Array.from({ length: 14 }).map((_, i) => { const s2 = spring({ frame: f - 10 - i * 4, fps: 30, config: { damping: 14 } }); return <Book key={i} x={960 + (rnd(i, 3) - 0.5) * 1500 * s2} y={560 + (rnd(i, 4) - 0.5) * 600 * s2 + Math.sin(f / 12 + i) * 8} r={(rnd(i, 5) - 0.5) * 40} s={0.42} />; })}
      <div style={{ opacity: t, transform: `translateY(${(1 - t) * 80}px) scale(${1 + lin(f, 0, d) * 0.05})`, transformOrigin: "50% 55%" }}><Book x={mode === "author" ? 640 : 960} y={580} r={-3 + Math.sin(f / 30) * 1.5} s={mode === "pamphlets" ? 0.8 : 1} /></div>
      {mode === "author" && <><div style={{ position: "absolute", left: 1040, top: 430, fontFamily: F, fontWeight: 900, fontSize: 90, color: INK, opacity: ease(f, 10, 18) }}>George S. Clason</div>
        <div style={{ position: "absolute", left: 1046, top: 550, fontFamily: F, fontWeight: 800, fontSize: 46, color: ORA, opacity: ease(f, 18, 26) }}>stories set in ancient Babylon</div></>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// fondo oscuro + texto
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6e1a10 0%, #2a0806 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)";
  return (
    <AbsoluteFill style={{ background: bg, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      {Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 1920, top: (rnd(i, 4) * 1180 - f * (0.6 + rnd(i, 5))) % 1180, width: 8, height: 8, borderRadius: 4, background: GOLD, opacity: 0.12 + rnd(i, 6) * 0.15 }} />)}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
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
      <BigWord a={4} w={wl} color={INK} size={130} x={110} y={150} />
      <BigWord a={a + 10} w={wr} color={RED} size={130} x={1230} y={150} />
    </AbsoluteFill>
  );
};
// campana + pregunta para los comentarios (sin link, sin URL); debajo pasan las 7 reglas como fichas
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)" }}>
      <div style={{ position: "absolute", top: 760, left: 0, display: "flex", gap: 22, opacity: 0.55, transform: `translateX(${-((f * 2.2) % (7 * 282))}px)` }}>
        {[...RULES, ...RULES, ...RULES].map((r, i) => (
          <div key={i} style={{ width: 260, height: 200, flex: "none", borderRadius: 26, background: "radial-gradient(ellipse at 40% 30%, #d7a877 0%, #b88a5c 60%, #8f6640 100%)", fontFamily: F, textAlign: "center", color: "#5a3a1e", padding: 16, boxSizing: "border-box" }}>
            <div style={{ fontSize: 54, fontWeight: 900 }}>{(i % 7) + 1}</div><div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>{r}</div>
          </div>))}
      </div>
      {bell && <svg width={170} height={170} viewBox="0 0 100 100" style={{ position: "absolute", left: 875, top: 120, transform: `rotate(${sw}deg)`, transformOrigin: "50% 10%" }}>
        <path d="M50,12 C30,12 24,30 24,46 L24,64 L14,76 L86,76 L76,64 L76,46 C76,30 70,12 50,12 Z" fill={GOLD} /><circle cx={50} cy={84} r={8} fill={GOLD} /></svg>}
      <div style={{ position: "absolute", left: 160, right: 160, top: bell ? 340 : 260, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 76, color: INK, lineHeight: 1.15, opacity: ease(f, 6, 16), transform: `translateY(${(1 - ease(f, 6, 16)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
