// t30monees — "Las 7 Reglas de Babilonia que Nadie Te Enseñó Sobre el Dinero". Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble siguen el patrón de src/btgm1/M1.tsx (copiados, sin tocar btgm1).
// Todo lo ilustrado es SVG/CSS; lo real = archivo PD/CC (Commons, Met CC0, LOC) + fotos/clips agnes sin cara.
// Pieza ancla: la BOLSA que engorda regla por regla y la TABLILLA de arcilla con las 7 reglas; el árbol de monedas; las joyas que eran vidrio.
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
  label?: string; scrib?: { a?: number; cx: number; cy: number; rx: number; ry: number; text: string; tx: number; ty: number }; aside?: { t: string; a?: number; x: number; y: number }; credit?: string; stamp?: { lines: string[]; hot: number; a?: number; x?: number; y?: number; size?: number } };
export const Overlays: React.FC<{ o: Ov }> = ({ o }) => (
  <>
    {o.label && <Label t={o.label} />}
    {o.scrib && <Scribble a={o.scrib.a ?? 10} {...o.scrib} />}
    {o.build && <Build {...o.build} />}
    {o.big && <BigWord a={o.big.a ?? 6} {...o.big} />}
    {o.aside && <Aside a={o.aside.a ?? 14} {...o.aside} />}
    {o.stamp && <Stamp a={o.stamp.a ?? 6} {...o.stamp} />}
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

const Push: React.FC<{ d: number; k?: number; ox?: string; children: React.ReactNode }> = ({ d, k = 0.05, ox = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1 + k], clamp)})`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6e1a10 0%, #2a0806 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)";
  // polvo dorado que sube lento + zoom: el cartel nunca queda congelado (QC farm: freezedetect 146 s)
  return <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
    {Array.from({ length: 34 }).map((_, i) => { const y = (1180 - ((f * (0.9 + rnd(i) * 1.6) + rnd(i + 50) * 1200) % 1300)); return <div key={i} style={{ position: "absolute", left: rnd(i + 9) * 1920 + Math.sin(f / 23 + i) * 18, top: y, width: 4 + rnd(i + 3) * 7, height: 4 + rnd(i + 3) * 7, borderRadius: 9, background: "rgba(237,178,105,.55)", filter: "blur(1px)" }} />; })}
    <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.09], clamp)})` }}><Overlays o={o} /></AbsoluteFill>
  </AbsoluteFill>;
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
// campana + pregunta para los comentarios (CTA sin link, sin URL)

// ═════════════════════════ t30monees: lo nuevo (Babilonia) ═════════════════════════
const Grey: React.FC<{ on?: boolean; children: React.ReactNode }> = ({ on, children }) => <AbsoluteFill style={on ? { filter: "grayscale(1) brightness(.62) contrast(1.05)" } : undefined}>{children}</AbsoluteFill>;
const MUD = "#9a7650", MUD2 = "#6f5236", LEATHER = "#7a4a26", CLAY = "#b98a5a";

// moneda dorada (o plateada)
export const Coin: React.FC<{ x: number; y: number; r?: number; o?: number; silver?: boolean; grey?: boolean; rot?: number }> = ({ x, y, r = 30, o = 1, silver, grey, rot = 0 }) => {
  const c1 = grey ? "#8a8a86" : silver ? "#d9dde0" : "#f2cf63", c2 = grey ? "#5e5e5a" : silver ? "#9aa3a8" : "#b8892a";
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", opacity: o, transform: `rotateY(${rot}deg)`,
      background: `radial-gradient(circle at 35% 30%, #fff8d6 0%, ${c1} 32%, ${c2} 100%)`, boxShadow: `inset 0 0 0 ${r * 0.12}px ${c2}, inset 0 0 0 ${r * 0.22}px ${c1}, 0 ${r * 0.15}px ${r * 0.4}px rgba(0,0,0,.45)` }}>
      <div style={{ position: "absolute", inset: r * 0.42, borderRadius: "50%", border: `${Math.max(2, r * 0.08)}px solid ${c2}`, opacity: 0.7 }} />
    </div>
  );
};

// cielo + ciudad de Babilonia (zigurat, muralla con almenas, palmeras) con parallax; night 0-1
const palm = (x: number, b: number, h: number) => `M${x - 5},${b} Q${x + 12},${b - h * 0.55} ${x + 4},${b - h} L${x - h * 0.42},${b - h * 0.86} L${x + 2},${b - h * 0.97} L${x - h * 0.3},${b - h * 1.12} L${x + 6},${b - h * 1.01} L${x + h * 0.08},${b - h * 1.2} L${x + 10},${b - h * 1.01} L${x + h * 0.44},${b - h * 1.1} L${x + 12},${b - h * 0.97} L${x + h * 0.46},${b - h * 0.82} L${x + 12},${b - h * 0.94} Q${x + 22},${b - h * 0.55} ${x + 6},${b} Z`;
export const Bab: React.FC<{ night?: number; h?: number; drift?: number; lit?: number; children?: React.ReactNode; day?: boolean }> = ({ night = 0, h = 640, drift = 0.35, lit = 0, children, day }) => {
  const f = useCurrentFrame();
  const d = f * drift;
  const sky = day ? `linear-gradient(180deg, #1d3550 0%, #3d5f80 40%, #b07a4e 85%, #e3a35c 100%)` : `linear-gradient(180deg, ${C.night} 0%, ${C.navy} 38%, ${C.dusk} 62%, ${C.ember} 86%, ${C.glow} 100%)`;
  const tow: React.ReactNode[] = [];
  for (let i = 0, x = -100; x < 2400; i++) {
    const w = 120 + rnd(i, 21) * 90, hh = 70 + rnd(i, 22) * 60;
    tow.push(<rect key={"b" + i} x={x} y={h - hh} width={w} height={hh + 30} fill="#2a1f1c" />);
    for (let k = 0; k < Math.floor(w / 26); k++) tow.push(<rect key={`m${i}_${k}`} x={x + k * 26 + 4} y={h - hh - 14} width={16} height={16} fill="#2a1f1c" />);
    if (lit) for (let k = 0; k < 3; k++) if (rnd(i * 5 + k, 23) < lit) tow.push(<rect key={`w${i}_${k}`} x={x + 18 + k * (w - 36) / 3} y={h - hh * 0.6} width={12} height={18} fill="#ffc46b" opacity={0.6 + 0.3 * Math.sin(f / 9 + i + k)} />);
    x += w + 40 + rnd(i, 24) * 60;
  }
  const palms: string[] = []; for (let i = 0, x = -60; x < 2400; i++) { palms.push(palm(x, h + 30, 150 + rnd(i, 31) * 110)); x += 160 + rnd(i, 32) * 260; }
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: sky, height: h + 40, opacity: 1 - night * 0.72 }} />
      <div style={{ position: "absolute", left: 1380 - 280, top: h - 330, width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.sun}cc 0%, ${C.glow}55 30%, transparent 68%)`, opacity: (1 - night) * (day ? 0.5 : 1) }} />
      <div style={{ position: "absolute", left: 1380 - 36, top: h - 70, width: 72, height: 72, borderRadius: "50%", background: C.sun, opacity: (1 - night) * 0.95 }} />
      {night > 0 && Array.from({ length: 70 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 1920, top: rnd(i, 4) * h * 0.7, width: 2, height: 2, borderRadius: 1, background: "#fff", opacity: night * (0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i))) }} />)}
      {/* zigurat lejos */}
      <svg width={2400} height={1080} style={{ position: "absolute", left: -200 - d * 0.15, top: 0 }}>
        <path d={`M1180,${h} L1220,${h - 90} L1260,${h - 90} L1285,${h - 160} L1325,${h - 160} L1345,${h - 220} L1395,${h - 220} L1415,${h - 160} L1455,${h - 160} L1480,${h - 90} L1520,${h - 90} L1560,${h} Z`} fill="#3a2a2a" opacity={0.9} />
        <path d={`M300,${h} L330,${h - 60} L420,${h - 60} L450,${h} Z M1900,${h} L1920,${h - 50} L2010,${h - 50} L2040,${h} Z`} fill="#3a2a2a" opacity={0.7} />
      </svg>
      <svg width={2600} height={1080} style={{ position: "absolute", left: -200 - d * 0.4, top: 0 }}>{tow}</svg>
      <svg width={2800} height={1080} style={{ position: "absolute", left: -240 - d * 0.8, top: 0 }}><path d={palms.join(" ")} fill="#120c0a" /></svg>
      <AbsoluteFill style={{ top: h + 28, background: `linear-gradient(180deg, ${C.ground2} 0%, ${C.ground} 100%)` }} />
      <AbsoluteFill style={{ background: `rgba(5,10,20,${night * 0.45})` }} />
      {children}
    </AbsoluteFill>
  );
};

// figura de relieve babilónico (perfil, ojo grande, barba cuadrada, túnica con flecos). Ancla = pies (x,y)
type Who = "bansir" | "kobbi" | "arkad" | "arkadj" | "algamish" | "azmur" | "baker" | "jeweler" | "man";
const WHO: Record<Who, { robe: string; band: string; beard: string | null; cap: string; skin?: string; long?: boolean }> = {
  bansir: { robe: "#8a5a32", band: "#c4522a", beard: "#1a120c", cap: "#4a2e1a" },
  kobbi: { robe: "#2f5d8a", band: "#e9c762", beard: "#1a120c", cap: "#1f3550" },
  arkad: { robe: "#6a2c70", band: "#e9c762", beard: "#1a120c", cap: "#e9c762", long: true },
  arkadj: { robe: "#b9a27a", band: "#7a5a3a", beard: null, cap: "#4a2e1a" },
  algamish: { robe: "#7a2a1e", band: "#e9c762", beard: "#ece6da", cap: "#ece6da", long: true },
  azmur: { robe: "#a0703a", band: "#5a3a22", beard: "#1a120c", cap: "#5a3a22" },
  baker: { robe: "#d8cbb0", band: "#a0703a", beard: "#2a1a10", cap: "#f0ebe5" },
  jeweler: { robe: "#2f6b5a", band: "#e9c762", beard: "#2a1a10", cap: "#e9c762" },
  man: { robe: "#6b5a48", band: "#3a2a1f", beard: "#1a120c", cap: "#3a2a1f" },
};
type Pose = "stand" | "walk" | "sit" | "point" | "give" | "raise" | "write" | "think";
export const Fig: React.FC<{ who: Who; x: number; y: number; s?: number; pose?: Pose; flip?: boolean; prop?: "wheel" | "lyre" | "tablet" | "purse" | "brick" | "bread" | "gem" | "stylus"; name?: string; nameA?: number; age?: number; ph?: number; dark?: boolean }> = ({ who, x, y, s = 1, pose = "stand", flip, prop, name, nameA = 6, age = 0, ph = 0, dark }) => {
  const f = useCurrentFrame() + ph;
  const w = WHO[who];
  const sw = pose === "walk" ? Math.sin(f / 4.5) * 16 : 0;
  const breathe = Math.sin(f / 14) * 1.5;
  const sit = pose === "sit";
  const beard = age > 0.6 ? "#ece6da" : age > 0.3 ? "#8a8580" : w.beard;
  const ink = dark ? "#0d0907" : "#1a120c", skin = dark ? "#0d0907" : "#c98b5a";
  const robe = dark ? "#0d0907" : w.robe, band = dark ? "#0d0907" : w.band;
  // brazo de adelante: ángulo (0 = colgando; -90 = hacia adelante)
  const fa = pose === "point" ? -95 + Math.sin(f / 10) * 4 : pose === "give" ? -70 + Math.sin(f / 8) * 8 : pose === "raise" ? -150 + Math.sin(f / 6) * 10 : pose === "write" ? -55 + Math.sin(f / 3) * 7 : pose === "think" ? -140 : sit ? -40 + Math.sin(f / 16) * 4 : 8 + sw * 0.8;
  const ba = sit ? -20 : pose === "walk" ? -sw * 0.8 : 12;
  const hx = 70 + Math.sin((-fa * Math.PI) / 180) * 62, hy = 100 + Math.cos((-fa * Math.PI) / 180) * 62;
  const stoop = age > 0.6 ? 8 : 0;
  return (
    <div style={{ position: "absolute", left: x - 70 * s, top: y - 280 * s, width: 140 * s, height: 280 * s, transform: flip ? "scaleX(-1)" : undefined }}>
      <svg width={140 * s} height={280 * s} viewBox="0 0 140 280" style={{ overflow: "visible", filter: dark ? `drop-shadow(0 -2px 0 ${C.glow}) drop-shadow(0 0 10px ${C.glow}55)` : "drop-shadow(0 6px 8px rgba(0,0,0,.45))" }}>
        <g transform={`rotate(${stoop} 70 230)`}>
          {/* piernas */}
          {sit ? (<><rect x={58} y={196} width={62} height={14} rx={7} fill={skin} /><rect x={108} y={196} width={12} height={58} rx={6} fill={skin} /><rect x={104} y={250} width={24} height={8} rx={3} fill={ink} /></>)
            : (<><g transform={`rotate(${sw} 68 200)`}><rect x={60} y={196} width={13} height={74} rx={6} fill={skin} /><rect x={58} y={265} width={26} height={9} rx={3} fill={ink} /></g>
              <g transform={`rotate(${-sw} 72 200)`}><rect x={66} y={196} width={13} height={74} rx={6} fill={skin} /><rect x={64} y={265} width={26} height={9} rx={3} fill={ink} /></g></>)}
          {/* brazo de atrás */}
          <g transform={`rotate(${ba} 66 102)`}><rect x={59} y={98} width={13} height={64} rx={6} fill={skin} opacity={0.85} /></g>
          {/* túnica */}
          <path d={sit ? `M46,${96 + breathe} Q70,${86 + breathe} 92,${96 + breathe} L104,206 L40,206 Z` : `M46,${96 + breathe} Q70,${86 + breathe} 92,${96 + breathe} L${w.long ? 100 : 98},${w.long ? 262 : 214} L${w.long ? 40 : 42},${w.long ? 262 : 214} Z`} fill={robe} stroke={ink} strokeWidth={2.5} />
          <path d={`M48,${104 + breathe} L94,${150} L94,${162} L46,${118 + breathe} Z`} fill={band} opacity={0.9} />
          {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={44 + i * 6.6} y1={sit ? 200 : w.long ? 254 : 206} x2={44 + i * 6.6} y2={sit ? 212 : w.long ? 268 : 220} stroke={band} strokeWidth={3} />)}
          {/* cabeza de perfil */}
          <g transform={`translate(0 ${breathe})`}>
            <rect x={63} y={74} width={14} height={18} fill={skin} />
            <path d="M58,62 Q58,34 76,34 Q94,34 96,56 L102,64 L96,67 Q96,80 82,84 L66,84 Q58,78 58,62 Z" fill={skin} stroke={ink} strokeWidth={2} />
            <path d="M84,52 Q90,48 95,53 Q90,57 84,52 Z" fill="#fff" /><circle cx={90} cy={52.5} r={2.4} fill={ink} />
            <path d="M82,46 Q89,42 96,47" stroke={ink} strokeWidth={2.4} fill="none" />
            {/* pelo / gorro */}
            <path d="M56,60 Q52,30 78,28 Q98,28 98,44 L60,46 Q58,52 60,66 Z" fill={w.cap} stroke={ink} strokeWidth={2} />
            <path d="M54,58 Q46,70 52,84 Q60,88 64,78 Q60,70 60,60 Z" fill={beard ?? "#1a120c"} />
            {beard && <path d="M66,72 Q70,84 80,82 L96,70 L98,92 Q92,104 76,104 Q64,100 62,86 Z" fill={beard} stroke={ink} strokeWidth={1.5} />}
            {beard && [0, 1, 2].map((i) => <path key={i} d={`M${70 + i * 8},${88} q3,4 0,8`} stroke={ink} strokeWidth={1.4} fill="none" opacity={0.5} />)}
          </g>
          {/* brazo de adelante + objeto */}
          <g transform={`rotate(${fa} 70 100)`}><rect x={63} y={96} width={14} height={66} rx={7} fill={skin} stroke={ink} strokeWidth={1.5} /></g>
          {prop === "wheel" && <g transform={`translate(${hx} ${hy}) rotate(${f * 2})`}><circle r={30} fill="none" stroke="#6b4a2a" strokeWidth={7} />{[0, 45, 90, 135].map((a) => <line key={a} x1={-28 * Math.cos(a * Math.PI / 180)} y1={-28 * Math.sin(a * Math.PI / 180)} x2={28 * Math.cos(a * Math.PI / 180)} y2={28 * Math.sin(a * Math.PI / 180)} stroke="#6b4a2a" strokeWidth={4} />)}<circle r={6} fill="#4a2e1a" /></g>}
          {prop === "lyre" && <g transform={`translate(${hx - 6} ${hy - 40})`}><path d="M0,0 L-10,60 L30,60 L22,0" fill="none" stroke="#8a5a32" strokeWidth={6} /><line x1={-6} y1={52} x2={26} y2={52} stroke="#8a5a32" strokeWidth={6} />{[0, 1, 2, 3].map((i) => <line key={i} x1={2 + i * 6} y1={6} x2={-2 + i * 7} y2={52} stroke="#f0e2b0" strokeWidth={1.5} transform={`translate(${Math.sin(f / 2 + i) * 0.8} 0)`} />)}<circle cx={11} cy={-4} r={7} fill="#e9c762" /></g>}
          {prop === "tablet" && <rect x={hx - 4} y={hy - 30} width={34} height={44} rx={5} fill={CLAY} stroke={ink} strokeWidth={2} />}
          {prop === "purse" && <g transform={`translate(${hx} ${hy + 6})`}><path d="M-16,0 Q-26,30 0,34 Q26,30 16,0 Q0,-6 -16,0 Z" fill={LEATHER} stroke={ink} strokeWidth={2} /><rect x={-8} y={-8} width={16} height={8} rx={3} fill="#5a3418" /></g>}
          {prop === "brick" && <rect x={hx - 26} y={hy - 18} width={52} height={24} fill="#8a5a3a" stroke={ink} strokeWidth={2} />}
          {prop === "bread" && <ellipse cx={hx + 6} cy={hy} rx={24} ry={12} fill="#d9a35a" stroke={ink} strokeWidth={2} />}
          {prop === "gem" && <path d={`M${hx},${hy - 18} l14,12 l-14,18 l-14,-18 Z`} fill="#3fc4a0" stroke="#e9fff6" strokeWidth={2} />}
          {prop === "stylus" && <line x1={hx} y1={hy} x2={hx + 26} y2={hy + 14} stroke="#c9a46a" strokeWidth={4} strokeLinecap="round" />}
        </g>
      </svg>
      {name && <div style={{ position: "absolute", left: "50%", top: -64 * s, transform: `translateX(-50%) ${flip ? "scaleX(-1)" : ""}`, fontFamily: F, fontWeight: 800, fontSize: 40, color: INK, whiteSpace: "nowrap", opacity: ease(f - ph, nameA, nameA + 8), textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>{name}</div>}
    </div>
  );
};

// LA BOLSA (pieza ancla): engorda con fill 0-1
export const Purse: React.FC<{ x: number; y: number; s?: number; fill: number; glow?: number; grey?: boolean }> = ({ x, y, s = 1, fill, glow = 0, grey }) => {
  const f = useCurrentFrame();
  const W = 120 + fill * 150, H = 120 + fill * 110, wob = Math.sin(f / 12) * 2;
  const lea = grey ? "#6a6560" : LEATHER, dk = grey ? "#3a3734" : "#4a2a12";
  return (
    <div style={{ position: "absolute", left: x - 160 * s, top: y - 300 * s, width: 320 * s, height: 300 * s }}>
      <svg width={320 * s} height={300 * s} viewBox="0 0 320 300" style={{ overflow: "visible", filter: `drop-shadow(0 18px 24px rgba(0,0,0,.55)) drop-shadow(0 0 ${glow * 50}px rgba(233,199,98,${glow * 0.8}))` }}>
        <ellipse cx={160} cy={292} rx={W * 0.55} ry={10} fill="rgba(0,0,0,.4)" />
        <path d={`M${160 - 24},${300 - H - 10} Q${160 - W * 0.62},${300 - H * 0.55} ${160 - W * 0.5 + wob},${286} Q160,${300} ${160 + W * 0.5 + wob},${286} Q${160 + W * 0.62},${300 - H * 0.55} ${160 + 24},${300 - H - 10} Z`} fill={lea} stroke={dk} strokeWidth={4} />
        <path d={`M${160 - W * 0.3},${300 - H * 0.45} Q160,${300 - H * 0.36} ${160 + W * 0.3},${300 - H * 0.45}`} stroke={dk} strokeWidth={3} fill="none" strokeDasharray="8 7" opacity={0.7} />
        <path d={`M${160 - 30},${300 - H - 12} Q160,${300 - H - 2} ${160 + 30},${300 - H - 12} L${160 + 22},${300 - H - 30} Q160,${300 - H - 22} ${160 - 22},${300 - H - 30} Z`} fill={dk} />
        <path d={`M${160 - 26},${300 - H - 26} Q${160 - 60},${300 - H - 50} ${160 - 48},${300 - H - 4}`} stroke="#c9a46a" strokeWidth={4} fill="none" />
        {fill > 0.35 && [0, 1, 2].map((i) => <ellipse key={i} cx={160 - 14 + i * 14} cy={300 - H - 30 - (i % 2) * 6} rx={11} ry={5} fill={grey ? "#999" : "#f2cf63"} stroke="#b8892a" strokeWidth={2} />)}
      </svg>
    </div>
  );
};

// LA TABLILLA (roster): 7 reglas grabadas en arcilla + la bolsa que engorda al lado
export const RULES = ["Guarde 1 de cada 10", "Controle sus gastos", "Ponga su oro a trabajar", "Proteja su tesoro", "Su casa, una inversión", "Ingresos para el futuro", "Aumente su habilidad"];
const NUM = ["I", "II", "III", "IV", "V", "VI", "VII"];
export const Tablilla: React.FC<{ d: number; active?: number; final?: number[]; intro?: boolean; o?: Ov }> = ({ d, active = -1, final, intro, o = {} }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const done = (i: number) => final ? f >= final[i] + 10 : i < active;
  const on = (i: number) => final ? (f >= final[i] && f < (final[i + 1] ?? 99999)) : i === active;
  const prog = (i: number) => final ? ease(f, final[i], final[i] + 18) : i === active ? ease(f, 10, 34) : done(i) ? 1 : 0;
  const nDone = final ? final.filter((x) => f >= x).length : active + ease(f, 26, 40);
  const cur = final ? Math.max(0, final.filter((x) => f >= x).length - 1) : active;
  const push = interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 55%, #3a2414 0%, #0c0805 75%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 150, top: 120 + (1 - t) * 80, width: 1000, height: 840, opacity: t, borderRadius: 60, transform: `rotate(${-1.5 + (1 - t) * -3}deg)`,
          background: `radial-gradient(ellipse at 30% 25%, #d6a873 0%, ${CLAY} 45%, #8f6236 100%)`, boxShadow: "inset 0 0 50px rgba(60,30,10,.55), 0 40px 80px rgba(0,0,0,.7)" }}>
          {Array.from({ length: 40 }).map((_, k) => <div key={k} style={{ position: "absolute", left: rnd(k, 41) * 960, top: rnd(k, 42) * 800, width: 3 + rnd(k, 43) * 6, height: 3 + rnd(k, 43) * 6, borderRadius: "50%", background: "rgba(80,45,20,.35)" }} />)}
          {RULES.map((r, i) => {
            const y = 60 + i * 108, p = prog(i), lit = on(i);
            return (
              <div key={i} style={{ position: "absolute", left: 50, top: y, width: 900, height: 92, borderBottom: "3px solid rgba(90,50,22,.35)" }}>
                <div style={{ position: "absolute", left: 0, top: 6, width: 110, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 56, color: lit ? "#5a1d08" : "rgba(70,38,16,.75)", textShadow: "1px 1px 0 rgba(255,220,170,.5)" }}>{NUM[i]}</div>
                {!intro && <div style={{ position: "absolute", left: 120, top: 10, fontFamily: F, fontWeight: 800, fontSize: 54, color: lit ? "#4a1606" : "rgba(64,34,14,.8)", whiteSpace: "nowrap", clipPath: `inset(0 ${100 - p * 100}% 0 0)`, textShadow: "1px 2px 0 rgba(255,225,180,.55), -1px -1px 0 rgba(60,30,10,.4)" }}>{r}</div>}
                {intro && <div style={{ position: "absolute", left: 120, top: 34, width: 600 * ease(f, 8 + i * 5, 20 + i * 5), height: 10, borderRadius: 5, background: "rgba(70,38,16,.3)" }} />}
                {lit && p < 1 && <div style={{ position: "absolute", left: 120 + p * 760, top: -30, width: 12, height: 110, borderRadius: 6, background: "linear-gradient(180deg,#e2c58c,#8a6a3a)", transform: `rotate(28deg) translateY(${Math.sin(f) * 3}px)`, boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />}
                {lit && <div style={{ position: "absolute", left: -30, top: -6, right: -30, bottom: -6, borderRadius: 14, boxShadow: `0 0 0 4px rgba(241,69,54,${0.55 * ease(f - (final ? final[i] : 0), 0, 8)})` }} />}
              </div>
            );
          })}
        </div>
        <Purse x={1530} y={860} s={1.25} fill={Math.min(1, Math.max(0, nDone) / 7)} glow={final ? 0.5 : 0.25} />
        {!intro && cur >= 0 && <div style={{ position: "absolute", left: 1240, top: 150, width: 580, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 110, color: GOLD, opacity: ease(f, 4, 12), textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>{final ? `${cur + 1}` : `REGLA ${active + 1}`}</div>}
        {intro && <div style={{ position: "absolute", left: 1240, top: 170, width: 580, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 200, color: RED, opacity: ease(f, 14, 22), transform: `scale(${1.2 - 0.2 * ease(f, 14, 22)})` }}>7</div>}
      </AbsoluteFill>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// camello en silueta (caravana)
const CAMEL = "M10,70 L14,45 Q12,35 22,30 Q30,12 44,22 Q54,8 66,24 L74,28 Q80,12 88,8 L98,12 L96,18 L89,19 Q86,32 82,42 L80,70 L76,70 L74,48 L66,48 L64,70 L60,70 L58,48 L30,48 L28,70 L24,70 L22,50 L18,50 L16,70 Z";
const Caravan: React.FC<{ y: number; s?: number; n?: number; speed?: number; color?: string }> = ({ y, s = 1, n = 9, speed = 2.2, color = "#1a1210" }) => {
  const f = useCurrentFrame();
  return (<>{Array.from({ length: n }).map((_, i) => {
    const x = 2000 - f * speed + i * 150 * s;
    return <svg key={i} width={110 * s} height={80 * s} viewBox="0 0 110 80" style={{ position: "absolute", left: x, top: y - 80 * s + Math.abs(Math.sin(f / 5 + i)) * -3 }}><path d={CAMEL} fill={color} transform="scale(-1 1) translate(-110 0)" />{i % 3 === 0 && <rect x={40} y={10} width={26} height={16} rx={4} fill={color} />}</svg>;
  })}</>);
};
const Bubble: React.FC<{ x: number; y: number; a: number; w?: number; h?: number; children: React.ReactNode }> = ({ x, y, a, w = 170, h = 150, children }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - a, fps: 30, config: { damping: 12 } });
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h, transform: `scale(${t}) translateY(${Math.sin(f / 12) * 4}px)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "rgba(250,246,238,.95)", boxShadow: "0 10px 26px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 90, color: "#2a1a10" }}>{children}</div>
      <div style={{ position: "absolute", left: w / 2 - 14, bottom: -22, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "24px solid rgba(250,246,238,.95)" }} />
    </div>
  );
};
const MiniPurse: React.FC<{ fill?: number }> = ({ fill = 0 }) => <svg width={90} height={90} viewBox="0 0 90 90"><path d={`M32,18 Q${6 - fill * 8},50 ${16 - fill * 6},80 Q45,88 ${74 + fill * 6},80 Q${84 + fill * 8},50 58,18 Z`} fill={LEATHER} stroke="#4a2a12" strokeWidth={3} /><rect x={34} y={10} width={22} height={10} rx={4} fill="#4a2a12" /></svg>;

// 1. el muro: Bansir y Kobbi sentados mirando pasar la caravana del rey
export const WallScene: React.FC<{ d: number; mode?: "hook" | "empty" | "ask" | "grey"; names?: boolean; o?: Ov }> = ({ d, mode = "hook", names, o = {} }) => {
  return (
    <Grey on={mode === "grey"}>
      <Push d={d} k={0.05} ox="50% 70%">
        <Bab night={0.15} h={600}>
          <Caravan y={700} s={1.1} />
          <div style={{ position: "absolute", left: -20, right: -20, top: 760, bottom: 0, background: `repeating-linear-gradient(0deg, ${MUD2} 0 4px, transparent 4px 46px), repeating-linear-gradient(90deg, ${MUD2} 0 4px, transparent 4px 92px), ${MUD}`, boxShadow: "inset 0 14px 0 #b08a60" }} />
          <Fig who="bansir" x={800} y={796} s={1.25} pose="sit" prop={mode === "hook" ? "wheel" : undefined} name={names ? "Bansir" : undefined} nameA={6} />
          <Fig who="kobbi" x={1010} y={796} s={1.25} pose={mode === "ask" ? "raise" : "sit"} prop={mode === "hook" ? "lyre" : undefined} name={names ? "Kobbi" : undefined} nameA={30} ph={20} />
          {mode === "empty" && <><Bubble x={820} y={430} a={8}><MiniPurse /></Bubble><Bubble x={1040} y={430} a={18}><MiniPurse /></Bubble></>}
          {mode === "ask" && <Bubble x={1060} y={420} a={6} w={150} h={150}>?</Bubble>}
        </Bab>
      </Push>
      <Overlays o={o} />
    </Grey>
  );
};

// 2. el librito de 1926 que regalaban los bancos
export const BookScene: React.FC<{ d: number; mode?: "book" | "pamph"; o?: Ov }> = ({ d, mode = "book", o = {} }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - 2, fps: 30, config: { damping: 16 } });
  const Book = ({ x, y, s, r }: { x: number; y: number; s: number; r: number }) => (
    <div style={{ position: "absolute", left: x, top: y, width: 420 * s, height: 600 * s, transform: `rotate(${r}deg)`, borderRadius: 8 * s, background: "linear-gradient(135deg,#7a2a1e,#4a160e)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 6px 0 0 rgba(0,0,0,.35)", border: `${3 * s}px solid #c9a46a`, fontFamily: "Georgia, serif", color: "#e9c762", textAlign: "center" }}>
      <div style={{ marginTop: 90 * s, fontSize: 40 * s, fontWeight: 700, lineHeight: 1.15, padding: `0 ${30 * s}px` }}>EL HOMBRE MÁS RICO DE BABILONIA</div>
      <svg width={120 * s} height={90 * s} viewBox="0 0 120 90" style={{ marginTop: 40 * s }}><path d="M10,80 L30,60 L45,60 L55,40 L65,40 L75,20 L90,20 L100,80 Z" fill="#e9c762" opacity={0.8} /></svg>
      <div style={{ marginTop: 50 * s, fontSize: 28 * s }}>George S. Clason</div>
    </div>
  );
  if (mode === "pamph") return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #3a2a1c 0%, #0c0805 80%)", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M560,380 L960,250 L1360,380 Z" fill="#cfc6b4" /><rect x={580} y={380} width={760} height={40} fill="#b8ae9b" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={620 + i * 128} y={430} width={40} height={360} fill="#d8d0bf" />)}
        <rect x={560} y={790} width={800} height={50} fill="#b8ae9b" />
        <text x={960} y={410} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={34} fill="#3a2a1c">BANCO</text>
      </svg>
      {Array.from({ length: 16 }).map((_, i) => {
        const p = ease(f, 6 + i * 4, 40 + i * 4);
        const tx = (rnd(i, 51) - 0.5) * 1800, ty = 200 + rnd(i, 52) * 600;
        return <div key={i} style={{ position: "absolute", left: 930 + tx * p, top: 600 - 300 * Math.sin(p * Math.PI) + (ty - 600) * p * 0.6, width: 70, height: 100, opacity: p > 0 ? 1 : 0, transform: `rotate(${p * (rnd(i, 53) * 720 - 360)}deg)`, background: "linear-gradient(135deg,#7a2a1e,#4a160e)", border: "2px solid #c9a46a", borderRadius: 4, boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} />;
      })}
      <Label t="1926" />
      <Overlays o={o} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a3020 0%, #120b06 80%)", overflow: "hidden" }}>
      <Push d={d} k={0.06}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(180deg,#3a2414,#1a0f08)" }} />
        <div style={{ opacity: t, transform: `translateY(${(1 - t) * 80}px)` }}><Book x={760} y={230} s={1} r={-4 + Math.sin(f / 40) * 1.5} /></div>
      </Push>
      <Label t="1926" />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 3. la calle de la infancia (kids) / Arkad rico en su terraza mientras los dos miran desde abajo (rich)
export const StreetScene: React.FC<{ d: number; mode?: "kids" | "rich" | "door"; o?: Ov }> = ({ d, mode = "kids", o = {} }) => {
  const f = useCurrentFrame();
  const houses = (base: number) => Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 300 - 60, top: base - 260 - rnd(i, 61) * 120, width: 270, height: 400, background: i % 2 ? "#7a5a3c" : "#8a6644", borderTop: "14px solid #5a4028", boxShadow: "inset -20px 0 0 rgba(0,0,0,.15)" }}><div style={{ position: "absolute", left: 100, bottom: 60, width: 70, height: 120, borderRadius: "35px 35px 0 0", background: "#2a1a10" }} /></div>);
  if (mode === "door") {
    const open = ease(f, 20, 60);
    return (
      <AbsoluteFill>
        <Push d={d} k={0.08} ox="62% 60%">
          <Bab night={0.3} h={560}>
            <div style={{ position: "absolute", left: 880, top: 300, width: 900, height: 600, background: "#8a6644", borderTop: "24px solid #5a4028" }} />
            <div style={{ position: "absolute", left: 1200, top: 480, width: 220, height: 400, background: `radial-gradient(ellipse at 50% 60%, #ffd48a 0%, #e8833a 60%, #5a2a10 100%)`, opacity: open }} />
            <div style={{ position: "absolute", left: 1200, top: 480, width: 220, height: 400, background: "linear-gradient(90deg,#5a3418,#7a4a26)", border: "6px solid #3a2010", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-open * 75}deg)` }} />
            <div style={{ position: "absolute", left: 1100, top: 840, width: 420, height: 120, background: `radial-gradient(ellipse at 50% 0%, rgba(255,200,120,${0.5 * open}) 0%, transparent 70%)` }} />
            <Fig who="bansir" x={380 + f * 2.2} y={900} s={1.15} pose="walk" />
            <Fig who="kobbi" x={230 + f * 2.2} y={905} s={1.15} pose="walk" ph={9} />
          </Bab>
        </Push>
        <Overlays o={o} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Push d={d} k={0.05}>
        <Bab day={mode === "kids"} night={mode === "kids" ? 0 : 0.2} h={520}>
          {houses(900)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, bottom: 0, background: "linear-gradient(180deg,#a07a52,#6f5236)" }} />
          {mode === "kids" ? (<>
            <Fig who="arkadj" x={760 + Math.sin(f / 18) * 60} y={960} s={0.75} pose="walk" ph={5} />
            <Fig who="bansir" x={980 + Math.sin(f / 15) * 80} y={960} s={0.72} pose="walk" ph={2} />
            <Fig who="kobbi" x={1200 - Math.sin(f / 17) * 70} y={960} s={0.72} pose="raise" flip ph={7} />
            <div style={{ position: "absolute", left: 1080 + Math.sin(f / 9) * 140, top: 880 - Math.abs(Math.sin(f / 7)) * 160, width: 36, height: 36, borderRadius: 18, background: "#c4522a", boxShadow: "inset -6px -6px 0 rgba(0,0,0,.25)" }} />
          </>) : (<>
            <div style={{ position: "absolute", left: 1100, top: 470, width: 640, height: 40, background: "#5a4028" }} />
            <div style={{ position: "absolute", left: 1150, top: 120, width: 540, height: 380, borderRadius: "50%", background: `radial-gradient(circle, rgba(233,199,98,${0.35 + 0.1 * Math.sin(f / 8)}) 0%, transparent 70%)` }} />
            <Fig who="arkad" x={1420} y={472} s={1.25} pose="raise" prop="purse" name="Arkad" nameA={10} />
            {Array.from({ length: 10 }).map((_, i) => <Coin key={i} x={1180 + rnd(i, 71) * 480} y={((f * 6 + rnd(i, 72) * 500) % 520) - 40} r={14} rot={f * 9 + i * 40} />)}
            <Fig who="bansir" x={520} y={970} s={1.05} pose="think" />
            <Fig who="kobbi" x={700} y={975} s={1.05} pose="stand" ph={11} />
          </>)}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 4. el escriba: Arkad copia tablillas toda la noche (night) → amanece (dawn) → se la entrega a Algamish (give)
export const ScribeScene: React.FC<{ d: number; mode?: "night" | "dawn" | "give"; o?: Ov }> = ({ d, mode = "night", o = {} }) => {
  const f = useCurrentFrame();
  const dawn = mode === "night" ? 0 : mode === "dawn" ? ease(f, 0, d) : 1;
  const fl = 1 + Math.sin(f / 2.3) * 0.06 + Math.sin(f / 5.1) * 0.04;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.05} ox="45% 60%">
        <AbsoluteFill style={{ background: `linear-gradient(180deg, #2a1c14 0%, #1a110b 100%)` }} />
        <div style={{ position: "absolute", left: 1240, top: 170, width: 360, height: 300, borderRadius: "180px 180px 0 0", overflow: "hidden", border: "18px solid #3a2618" }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${dawn > 0.3 ? "#3d5f80" : C.night} 0%, ${dawn > 0.3 ? "#e8a35a" : C.navy} 100%)` }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg,#f6c27a,#e8833a)", opacity: dawn * 0.8 }} />
          {dawn < 0.5 && <div style={{ position: "absolute", left: 60 + f * 0.6, top: 70, width: 50, height: 50, borderRadius: 25, background: "#f4efe6", boxShadow: "0 0 30px #f4efe6", opacity: 1 - dawn * 2 }} />}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "#120c0a", clipPath: "polygon(0 60%,15% 40%,30% 55%,45% 20%,55% 20%,70% 50%,100% 35%,100% 100%,0 100%)" }} />
        </div>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 760px 560px, rgba(255,170,80,${0.28 * fl * (1 - dawn * 0.5)}) 0%, transparent 40%)` }} />
        <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent 50%, rgba(255,200,130,${dawn * 0.25}) 70%, transparent 85%)` }} />
        <div style={{ position: "absolute", left: 420, top: 700, width: 900, height: 34, borderRadius: 6, background: "#5a3418" }} />
        <div style={{ position: "absolute", left: 470, top: 734, width: 30, height: 260, background: "#4a2a12" }} /><div style={{ position: "absolute", left: 1240, top: 734, width: 30, height: 260, background: "#4a2a12" }} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1000 + i * 52, top: 640 - (i % 2) * 6, width: 46, height: 60, borderRadius: 6, background: CLAY, boxShadow: "inset 0 0 8px rgba(80,40,10,.5)", opacity: mode === "night" ? (f > i * 25 ? 1 : 0.2) : 1 }} />)}
        <div style={{ position: "absolute", left: 640, top: 640, width: 110, height: 60, borderRadius: "0 0 50px 50px", background: "#8a5a32" }} />
        <div style={{ position: "absolute", left: 690, top: 590 - 18 * fl, width: 22, height: 54 * fl, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 70%, #fff3c4 0%, #ffb340 50%, #e8603a 100%)", boxShadow: "0 0 40px 14px rgba(255,160,60,.45)" }} />
        <Fig who="arkadj" x={880} y={900} s={1.5} pose={mode === "give" ? "give" : "write"} prop={mode === "give" ? "tablet" : "stylus"} />
        {mode === "give" && <Fig who="algamish" x={1500} y={905} s={1.55} pose="stand" flip name="Algamish" nameA={10} />}
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 5. le pagás a todos menos a vos: monedas que salen de la bolsa hacia el panadero, el sastre y el de las sandalias
const Stall: React.FC<{ x: number; icon: "bread" | "cloth" | "sandal"; t: string; got: number }> = ({ x, icon, t, got }) => (
  <div style={{ position: "absolute", left: x - 150, top: 330, width: 300, height: 380 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 70, background: `repeating-linear-gradient(90deg, #c4522a 0 40px, #e8d7b0 40px 80px)`, borderRadius: "10px 10px 0 0" }} />
    <div style={{ position: "absolute", left: 20, top: 70, width: 260, height: 220, background: "rgba(40,24,14,.65)" }} />
    <svg width={300} height={200} viewBox="0 0 300 200" style={{ position: "absolute", left: 0, top: 80 }}>
      {icon === "bread" && <><ellipse cx={150} cy={110} rx={80} ry={36} fill="#d9a35a" stroke="#6b3e16" strokeWidth={4} /><path d="M100,100 q10,-14 20,0 M140,96 q10,-14 20,0 M180,100 q10,-14 20,0" stroke="#6b3e16" strokeWidth={4} fill="none" /></>}
      {icon === "cloth" && <>{[0, 1, 2].map((i) => <rect key={i} x={80} y={60 + i * 34} width={140} height={30} rx={6} fill={["#c4522a", "#2f5d8a", "#e9c762"][i]} />)}</>}
      {icon === "sandal" && <><path d="M90,150 q-10,-80 30,-90 q40,10 30,90 Z" fill="#8a5a32" stroke="#4a2a12" strokeWidth={4} /><path d="M170,150 q-10,-80 30,-90 q40,10 30,90 Z" fill="#8a5a32" stroke="#4a2a12" strokeWidth={4} /></>}
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 40, color: INK }}>{t}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 34, color: GOLD }}>{"●".repeat(Math.min(6, got))}</div>
  </div>
);
export const PayAll: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const P = 26, k = Math.floor(f / P), ph = (f % P) / P, tgt = [360, 960, 1560][k % 3];
  const left = Math.max(0, 1 - k / 9);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.04}>
        <Bab night={0.25} h={560}>
          <Stall x={360} icon="bread" t="panadero" got={Math.ceil(k / 3 + (k % 3 > 0 ? 1 : 0))} />
          <Stall x={960} icon="cloth" t="sastre" got={Math.ceil(k / 3 + (k % 3 > 1 ? 1 : 0))} />
          <Stall x={1560} icon="sandal" t="sandalias" got={Math.floor(k / 3)} />
          <Purse x={960} y={1050} s={0.9} fill={left * 0.5} />
          {k < 12 && <Coin x={960 + (tgt - 960) * ph} y={830 - Math.sin(ph * Math.PI) * 420 - ph * 120} r={26} rot={f * 20} />}
          {f > d * 0.7 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M880,820 L1040,980 M1040,820 L880,980" stroke={RED} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, d * 0.7, d * 0.7 + 10)} /></svg>}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 6. una de cada diez: caen 10 monedas, 9 se van a "vivir", 1 a la bolsa; la bolsa engorda ciclo a ciclo
export const TenCoins: React.FC<{ d: number; cyc?: number; o?: Ov; fill0?: number }> = ({ d, cyc = 75, o = {}, fill0 = 0 }) => {
  const f = useCurrentFrame();
  const c = Math.floor(f / cyc), g = f % cyc;
  const fill = Math.min(1, fill0 + (c + ease(g, 50, 64)) * 0.14);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a2414 0%, #0c0805 78%)", overflow: "hidden" }}>
      <Push d={d} k={0.04}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 30, background: "#4a2a12" }} />
        {Array.from({ length: 10 }).map((_, i) => {
          const drop = spring({ frame: g - i * 2, fps: 30, config: { damping: 11 } });
          const out = ease(g, 38, 58);
          const is1 = i === 9;
          const x0 = 330 + i * 140, y0 = 560;
          const x = is1 ? x0 + (1560 - x0) * ease(g, 34, 52) : x0 - out * (x0 - 420) * 0.9;
          const y = is1 ? y0 + 220 * ease(g, 34, 52) - Math.sin(ease(g, 34, 52) * Math.PI) * 200 : y0 + out * 300;
          return <Coin key={i} x={x} y={y - (1 - drop) * 500} r={52} o={is1 ? 1 : 1 - out * 0.7} rot={is1 ? g * 6 : 0} />;
        })}
        <div style={{ position: "absolute", left: 160, top: 300, width: 620, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 130, color: INK, opacity: ease(g, 40, 50) }}>9<span style={{ fontSize: 46, marginLeft: 16, color: "rgba(240,235,229,.7)" }}>para vivir</span></div>
        <Purse x={1560} y={1010} s={1.1} fill={fill} glow={ease(g, 50, 58) * (1 - ease(g, 62, 74))} />
        <div style={{ position: "absolute", left: 1640, top: 560, fontFamily: F, fontWeight: 900, fontSize: 130, color: GOLD, opacity: ease(g, 46, 54) }}>1</div>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 7. "los gastos necesarios crecen hasta igualar lo que ganamos"
export const CreepChart: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 6, Math.max(20, d - 4));
  const X0 = 260, X1 = 1680, Y0 = 900;
  const inc = (x: number) => x < 0.45 ? 620 : 420;
  const exp = (x: number) => { const lag = x < 0.45 ? 620 + (1 - Math.exp(-x * 9)) * 0 : 420; const base = x < 0.45 ? 760 - (760 - 640) * (x / 0.45) : 640 - (640 - 440) * Math.min(1, (x - 0.45) / 0.35); return Math.max(lag + 18, base); };
  const pts = (fn: (x: number) => number) => Array.from({ length: 61 }).map((_, i) => { const x = i / 60; return `${X0 + x * (X1 - X0)},${fn(x)}`; }).join(" ");
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1f2a38 0%, #0a0d12 80%)", transform: `scale(${1 + f * 0.0004})` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="cc"><rect x={0} y={0} width={X0 + p * (X1 - X0)} height={1080} /></clipPath></defs>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="rgba(240,235,229,.4)" strokeWidth={4} /><line x1={X0} y1={Y0} x2={X0} y2={300} stroke="rgba(240,235,229,.4)" strokeWidth={4} />
        <g clipPath="url(#cc)">
          <polyline points={pts(inc)} fill="none" stroke={GOLD} strokeWidth={12} strokeLinejoin="round" />
          <polyline points={pts(exp)} fill="none" stroke={RED} strokeWidth={12} strokeLinejoin="round" />
        </g>
        <circle cx={X0 + p * (X1 - X0)} cy={exp(p)} r={16} fill={RED} />
      </svg>
      <div style={{ position: "absolute", left: 1300, top: 330, fontFamily: F, fontWeight: 800, fontSize: 44, color: GOLD, opacity: ease(f, 20, 30) }}>lo que gana</div>
      <div style={{ position: "absolute", left: 300, top: 780, fontFamily: F, fontWeight: 800, fontSize: 44, color: RED, opacity: ease(f, 10, 20) }}>gastos "necesarios"</div>
      <div style={{ position: "absolute", left: 560, top: 540, fontFamily: F, fontWeight: 800, fontSize: 36, color: "rgba(240,235,229,.8)", opacity: ease(f, d * 0.4, d * 0.4 + 10) }}>▲ aumento de sueldo</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 8. deseos sin fin: vos en el mercado y las burbujas de antojos que no paran
export const Ico: React.FC<{ k: number; s?: number }> = ({ k, s = 80 }) => (
  <svg width={s} height={s} viewBox="0 0 80 80">
    {k === 0 && <><circle cx={40} cy={50} r={20} fill="none" stroke="#e9c762" strokeWidth={8} /><path d="M30,26 L40,10 L50,26 Z" fill="#3fc4a0" /></>}
    {k === 1 && <><rect x={28} y={30} width={24} height={40} rx={8} fill="#b02ad0" /><rect x={34} y={16} width={12} height={16} fill="#e9c762" /></>}
    {k === 2 && <>{[0, 1, 2].map((i) => <rect key={i} x={14} y={18 + i * 16} width={52} height={13} rx={4} fill={["#c4522a", "#2f5d8a", "#e9c762"][i]} />)}</>}
    {k === 3 && <><path d="M24,14 L56,14 Q56,44 40,46 Q24,44 24,14 Z" fill="#8a1a2a" /><rect x={37} y={46} width={6} height={16} fill="#c9c2b6" /><rect x={28} y={62} width={24} height={5} fill="#c9c2b6" /></>}
    {k === 4 && <path d="M26,70 q-8,-50 14,-56 q22,6 14,56 Z" fill="#8a5a32" stroke="#4a2a12" strokeWidth={3} />}
    {k === 5 && <path d="M30,12 L50,12 L48,22 Q66,36 56,62 Q50,72 40,72 Q30,72 24,62 Q14,36 32,22 Z" fill="#c4522a" stroke="#6b2a12" strokeWidth={3} />}
    {k === 6 && <><ellipse cx={40} cy={44} rx={28} ry={14} fill="#d9a35a" stroke="#6b3e16" strokeWidth={3} /><path d="M24,40 q6,-8 12,0 M44,40 q6,-8 12,0" stroke="#6b3e16" strokeWidth={3} fill="none" /></>}
    {k === 7 && <><path d="M40,10 L64,30 L40,70 L16,30 Z" fill="#3fc4a0" stroke="#e9fff6" strokeWidth={3} /><path d="M16,30 L64,30 M28,30 L40,70 L52,30" stroke="#e9fff6" strokeWidth={2} fill="none" /></>}
  </svg>
);
const WANT = [0, 1, 2, 3, 4, 5, 0, 1];
export const WantsScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.05} ox="50% 60%">
        <Bab day h={560}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: i * 420 - 40, top: 520, width: 360, height: 60, background: `repeating-linear-gradient(90deg, ${i % 2 ? "#2f5d8a" : "#c4522a"} 0 36px, #e8d7b0 36px 72px)`, transform: `skewX(-8deg) translateY(${Math.sin(f / 10 + i) * 3}px)` }} />)}
          {[0, 1, 2, 3, 4].map((i) => <div key={"t" + i} style={{ position: "absolute", left: i * 420, top: 700, width: 300, height: 90, background: "#5a3418", borderRadius: 8 }} />)}
          <Person x={960} y={980} s={1.5} walk />
          {Array.from({ length: 9 }).map((_, i) => {
            const a = 6 + i * 14, t = spring({ frame: f - a, fps: 30, config: { damping: 12 } });
            const ang = -160 + (i % 5) * 35 + Math.floor(i / 5) * 18, R = 300 + Math.floor(i / 5) * 140;
            return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang * Math.PI / 180) * R - 60, top: 520 + Math.sin(ang * Math.PI / 180) * R * 0.75 - 60 + Math.sin(f / 9 + i) * 6, width: 120, height: 120, borderRadius: 60, background: "rgba(250,246,238,.95)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t})`, boxShadow: "0 8px 20px rgba(0,0,0,.4)" }}><Ico k={WANT[i % WANT.length]} /></div>;
          })}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 9. la lista: cada gasto cae en NECESARIO o DESEO
const ITEMS: [string, 0 | 1][] = [["pan", 0], ["perfume", 1], ["alquiler", 0], ["joyas", 1], ["aceite", 0], ["sandalias nuevas", 1], ["leña", 0], ["vino fino", 1]];
export const ListScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3a2414 0%, #0c0805 78%)" }}>
      <Push d={d} k={0.04}>
        {[0, 1].map((c) => <div key={c} style={{ position: "absolute", left: c ? 1060 : 260, top: 300, width: 600, height: 680, borderRadius: 30, background: `radial-gradient(ellipse at 30% 25%, #d6a873 0%, ${CLAY} 50%, #8f6236 100%)`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          <div style={{ marginTop: 26, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 56, color: c ? "#7a1a0a" : "#3a2410" }}>{c ? "DESEO" : "NECESARIO"}</div>
        </div>)}
        {ITEMS.map(([t, c], i) => {
          const a = 8 + i * Math.max(8, (d - 30) / ITEMS.length), p = ease(f, a, a + 14);
          const row = ITEMS.slice(0, i).filter((x) => x[1] === c).length;
          return <div key={i} style={{ position: "absolute", left: 960 + ((c ? 1360 : 560) - 960) * p - 220, top: 160 + (420 + row * 120 - 160) * p, width: 440, textAlign: "center", whiteSpace: "nowrap", fontFamily: F, fontWeight: 800, fontSize: 46, color: c ? "#7a1a0a" : "#2a1a0a", opacity: f > a ? 1 : 0, transform: `scale(${1.3 - 0.3 * p})` }}>{t}</div>;
        })}
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 10. el montón quieto en el cajón: polvo, telaraña, nada crece
export const StillCoins: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #2a2018 0%, #080605 78%)", overflow: "hidden" }}>
      <Push d={d} k={0.06} ox="50% 65%">
        <div style={{ position: "absolute", left: 460, top: 560, width: 1000, height: 380, background: "linear-gradient(180deg,#4a2a12,#2a160a)", border: "10px solid #5a3418", borderRadius: 10 }} />
        {Array.from({ length: 40 }).map((_, i) => <Coin key={i} x={540 + rnd(i, 81) * 840} y={640 + rnd(i, 82) * 120 - Math.floor(i / 14) * 18} r={34} grey />)}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><g stroke="rgba(230,225,215,.35)" strokeWidth={2} fill="none">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M460,${560 + i * 26} Q${480 + i * 20},${580 + i * 20} ${460 + (i + 1) * 30},560`} />)}<line x1={460} y1={560} x2={620} y2={720} /><line x1={460} y1={560} x2={580} y2={560 + 190} /></g></svg>
        {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 400 + rnd(i, 83) * 1100 + Math.sin(f / 30 + i) * 20, top: 200 + ((rnd(i, 84) * 700 + f * 0.6) % 700), width: 4, height: 4, borderRadius: 2, background: "rgba(255,230,190,.5)" }} />)}
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 11. el ejército de monedas: salen a trabajar al campo y vuelven cargando otras
const CoinMan: React.FC<{ x: number; y: number; carry?: number; ph: number }> = ({ x, y, carry = 0, ph }) => {
  const f = useCurrentFrame() + ph;
  const sw = Math.sin(f / 3) * 18;
  return (
    <div style={{ position: "absolute", left: x - 40, top: y - 120, width: 80, height: 120 }}>
      <svg width={80} height={120} viewBox="0 0 80 120" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`rotate(${sw} 40 80)`}><rect x={30} y={78} width={8} height={40} rx={4} fill="#2a1a10" /></g>
        <g transform={`rotate(${-sw} 40 80)`}><rect x={42} y={78} width={8} height={40} rx={4} fill="#2a1a10" /></g>
      </svg>
      <Coin x={40} y={52} r={36} rot={0} />
      {Array.from({ length: carry }).map((_, k) => <Coin key={k} x={40 + (k % 2) * 10 - 5} y={6 - k * 14} r={18} />)}
    </div>
  );
};
export const CoinArmy: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.04}>
        <Bab day h={600}>
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 650 + i * 30, height: 3, background: "rgba(200,160,90,.25)" }} />)}
          <Purse x={240} y={980} s={1.1} fill={Math.min(1, 0.25 + f / Math.max(d, 1) * 0.7)} glow={0.3} />
          {Array.from({ length: 6 }).map((_, i) => { const x = 380 + ((f * 5 + i * 260) % 1500); return <CoinMan key={"g" + i} x={x} y={820} ph={i * 7} />; })}
          {Array.from({ length: 6 }).map((_, i) => { const x = 1880 - ((f * 5 + i * 260) % 1500); return <div key={"b" + i} style={{ position: "absolute", left: 0, top: 0, transform: "scaleX(-1)", transformOrigin: `${x}px 0` }}><CoinMan x={x} y={960} carry={2 + (i % 2)} ph={i * 5} /></div>; })}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 12. EL ÁRBOL DE MONEDAS (pieza ancla): la moneda tiene hijos, y los hijos tienen hijos
export const CoinTree: React.FC<{ d: number; o?: Ov; gens?: number }> = ({ d, o = {}, gens = 5 }) => {
  const f = useCurrentFrame();
  const step = Math.max(14, (d - 30) / gens);
  const nodes: { x: number; y: number; g: number; px: number; py: number }[] = [];
  const grow = (x: number, y: number, g: number, ang: number, len: number) => {
    if (g > gens) return;
    for (const s of [-1, 1]) { const a = ang + s * (32 - g * 3); const nx = x + Math.sin(a * Math.PI / 180) * len, ny = y - Math.cos(a * Math.PI / 180) * len; nodes.push({ x: nx, y: ny, g, px: x, py: y }); grow(nx, ny, g + 1, a, len * 0.72); }
  };
  grow(960, 860, 1, 0, 240);
  const sway = Math.sin(f / 30) * 1.2;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, #3a2a14 0%, #0a0805 78%)", overflow: "hidden" }}>
      <Push d={d} k={0.06} ox="50% 80%">
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0, background: "linear-gradient(180deg,#3a2a1f,#1a120c)" }} />
        <AbsoluteFill style={{ transform: `rotate(${sway}deg)`, transformOrigin: "960px 900px" }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={960} y1={900} x2={960} y2={860} stroke="#6b4a2a" strokeWidth={30} />
            {nodes.map((n, i) => { const p = ease(f, 6 + (n.g - 1) * step, 6 + (n.g - 1) * step + 14); return <line key={i} x1={n.px} y1={n.py} x2={n.px + (n.x - n.px) * p} y2={n.py + (n.y - n.py) * p} stroke="#6b4a2a" strokeWidth={Math.max(3, 24 - n.g * 4)} strokeLinecap="round" />; })}
          </svg>
          <Coin x={960} y={880} r={48} />
          {nodes.map((n, i) => { const t = spring({ frame: f - (6 + (n.g - 1) * step + 12), fps: 30, config: { damping: 10 } }); return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `scale(1)` }}><Coin x={n.x} y={n.y} r={Math.max(12, 40 - n.g * 6) * t} o={t} /></div>; })}
        </AbsoluteFill>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 13. el día que las monedas ganan más que las manos (cruce de curvas)
export const CrossChart: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 6, Math.max(20, d - 24));
  const X0 = 260, X1 = 1680;
  const hands = (x: number) => 640 - x * 40, coins = (x: number) => 880 - (Math.exp(x * 3.2) - 1) / (Math.exp(3.2) - 1) * 620;
  const pts = (fn: (x: number) => number) => Array.from({ length: 61 }).map((_, i) => `${X0 + (i / 60) * (X1 - X0)},${fn(i / 60)}`).join(" ");
  let cx = 0; for (let i = 0; i <= 200; i++) { if (coins(i / 200) < hands(i / 200)) { cx = i / 200; break; } }
  const hit = p >= cx;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1f2a38 0%, #0a0d12 80%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="xc"><rect x={0} y={0} width={X0 + p * (X1 - X0)} height={1080} /></clipPath></defs>
        <line x1={X0} y1={900} x2={X1} y2={900} stroke="rgba(240,235,229,.4)" strokeWidth={4} />
        <g clipPath="url(#xc)"><polyline points={pts(hands)} fill="none" stroke={ORA} strokeWidth={12} /><polyline points={pts(coins)} fill="none" stroke={GOLD} strokeWidth={14} /></g>
        {hit && <circle cx={X0 + cx * (X1 - X0)} cy={hands(cx)} r={22 + Math.sin(f / 4) * 6} fill="none" stroke={RED} strokeWidth={7} />}
      </svg>
      <div style={{ position: "absolute", left: 300, top: 540, fontFamily: F, fontWeight: 800, fontSize: 44, color: ORA, opacity: ease(f, 8, 18) }}>lo que ganan sus manos</div>
      <div style={{ position: "absolute", left: 1200, top: 230, fontFamily: F, fontWeight: 800, fontSize: 44, color: GOLD, opacity: ease(f, d * 0.55, d * 0.55 + 10) }}>lo que traen sus monedas</div>
      <div style={{ position: "absolute", left: 300, top: 960, fontFamily: F, fontWeight: 700, fontSize: 34, color: "rgba(240,235,229,.6)" }}>año tras año →</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 14. mapa: de Babilonia a la tierra de los fenicios (ruta que se dibuja + barco)
const ML = 28, MR = 50, MT = 39, MB = 28;
const gp = (lon: number, lat: number) => [((lon - ML) / (MR - ML)) * 1920, ((MT - lat) / (MT - MB)) * 1080];
const poly = (a: number[][]) => a.map(([lo, la], i) => { const [x, y] = gp(lo, la); return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
const SEA = [[28, 36.8], [30.5, 36.6], [33, 36.1], [35, 36.8], [36.2, 36.6], [35.9, 35.5], [35.8, 34.9], [35.6, 34.2], [35.2, 33.3], [34.9, 32.8], [34.4, 31.5], [32.3, 31.2], [30, 31.3], [28, 31], [28, 36.8]];
const CYP = [[32.3, 35.1], [33.2, 35.4], [34.6, 35.7], [34, 35.1], [33, 34.6], [32.4, 34.8]];
const EUPH = [[38.3, 37.0], [38.8, 36.0], [40.1, 35.1], [41.0, 34.4], [42.3, 33.6], [44.0, 32.8], [44.4, 32.5], [45.5, 31.6], [46.5, 31.0], [47.8, 30.5]];
const TIGR = [[40.0, 38.0], [42.2, 37.0], [43.1, 36.3], [43.6, 35.2], [44.4, 33.3], [45.8, 32.4], [47.0, 31.2], [47.8, 30.5]];
const GULF = [[48, 30], [50, 29.4], [50, 28], [47.6, 28], [48, 29.5]];
const ROUTE = [[44.42, 32.54], [42.3, 33.6], [41.0, 34.4], [40.1, 35.1], [38.5, 36.0], [37.2, 36.2], [36.3, 34.8], [35.2, 33.27]];
export const VoyageMap: React.FC<{ d: number; o?: Ov; ship?: boolean }> = ({ d, o = {}, ship = true }) => {
  const f = useCurrentFrame();
  const p = ease(f, 10, Math.min(d - 30, 120));
  const [bx, by] = gp(44.42, 32.54), [tx, ty] = gp(35.2, 33.27);
  const sp = ease(f, Math.min(d - 30, 120), d);
  return (
    <AbsoluteFill style={{ background: "#c79a5c", overflow: "hidden" }}>
      <Push d={d} k={0.07} ox="60% 45%">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 50%, #d8ae6c 0%, #a87a44 80%)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={poly(SEA) + " Z"} fill="#1d4a5a" stroke="#0f2f37" strokeWidth={4} />
          <path d={poly(CYP) + " Z"} fill="#c79a5c" stroke="#0f2f37" strokeWidth={3} />
          <path d={poly(GULF) + " Z"} fill="#1d4a5a" />
          <path d={poly(EUPH)} fill="none" stroke="#2c6a7a" strokeWidth={6} strokeLinecap="round" />
          <path d={poly(TIGR)} fill="none" stroke="#2c6a7a" strokeWidth={5} strokeLinecap="round" />
          <path d={poly(ROUTE)} fill="none" stroke={RED} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round" pathLength={1000} style={{ strokeDashoffset: 0 }} clipPath="url(#rv)" />
          <defs><clipPath id="rv"><path d={poly(ROUTE)} fill="none" /></clipPath></defs>
        </svg>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={poly(ROUTE)} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
        {[[bx, by, "BABILONIA"], [tx, ty, "FENICIA"]].map(([x, y, n], i) => (
          <div key={i}>
            <div style={{ position: "absolute", left: (x as number) - 16, top: (y as number) - 16, width: 32, height: 32, borderRadius: 16, background: i ? (p > 0.95 ? GOLD : "#6b4a2a") : GOLD, boxShadow: `0 0 0 ${8 + Math.sin(f / 5) * 5}px rgba(233,199,98,.35)` }} />
            <div style={{ position: "absolute", left: (x as number) + (i ? -330 : 30), top: (y as number) - 80, fontFamily: F, fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: 2, textShadow: "0 3px 10px rgba(0,0,0,.6)", opacity: i ? ease(f, 60, 72) : ease(f, 4, 12) }}>{n}</div>
          </div>
        ))}
        {ship && sp > 0 && <svg width={140} height={120} viewBox="0 0 140 120" style={{ position: "absolute", left: tx - 120 - sp * 380, top: ty - 60 + Math.sin(f / 6) * 4 + sp * 60 }}><path d="M10,80 L130,80 L110,105 L30,105 Z" fill="#4a2a12" /><rect x={66} y={10} width={6} height={72} fill="#3a2010" /><path d="M30,20 L110,20 L104,70 L36,70 Z" fill="repeating-linear-gradient(0)" /><path d="M30,20 L110,20 L104,70 L36,70 Z" fill="#e8d7b0" stroke="#c4522a" strokeWidth={6} /></svg>}
        <Fig who="azmur" x={bx + (tx - bx) * p} y={by + (ty - by) * p - Math.sin(p * Math.PI) * 120 + 30} s={0.55} pose="walk" flip prop="brick" />
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 15. LAS JOYAS QUE ERAN VIDRIO (revelación): brillan, se rajan y quedan grises
export const GlassReveal: React.FC<{ d: number; crack: number; o?: Ov }> = ({ d, crack, o = {} }) => {
  const f = useCurrentFrame();
  const c = ease(f, crack, crack + 10), g = ease(f, crack + 6, crack + 24);
  const COL = ["#e0283c", "#20a86a", "#2f6fe0", "#e9c762", "#b02ad0"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a2414 0%, #0a0604 78%)", overflow: "hidden", transform: f >= crack && f < crack + 6 ? `translate(${Math.sin(f * 7) * 8}px, 0)` : undefined }}>
      <Push d={d} k={0.07}>
        <div style={{ position: "absolute", left: 480, top: 380, width: 960, height: 520, background: "linear-gradient(180deg,#6b3a18,#3a1e0a)", borderRadius: 20, boxShadow: "0 30px 70px rgba(0,0,0,.7)" }}><div style={{ position: "absolute", inset: 30, background: "#4a0e18", borderRadius: 10 }} /></div>
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 560 + (i % 6) * 140 + (Math.floor(i / 6) % 2) * 60, y = 470 + Math.floor(i / 6) * 110, col = COL[i % 5];
          const fall = g * (rnd(i, 91) > 0.6 ? 1 : 0) * 40;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y + fall, width: 100, height: 80, transform: `rotate(${rnd(i, 92) * 40 - 20}deg)`, filter: `saturate(${1 - g}) brightness(${1 - g * 0.3})`, opacity: 1 - g * 0.15 }}>
              <svg width={100} height={80} viewBox="0 0 100 80"><path d="M20,0 L80,0 L100,25 L50,80 L0,25 Z" fill={col} /><path d="M20,0 L35,25 L50,0 L65,25 L80,0 M0,25 L100,25 M35,25 L50,80 L65,25" stroke="rgba(255,255,255,.55)" strokeWidth={2} fill="none" />{g > 0.3 && <path d={`M${20 + rnd(i, 93) * 50},5 l8,18 l-10,14 l9,20`} stroke="#fff" strokeWidth={2} fill="none" opacity={g} />}</svg>
              {g < 0.5 && <div style={{ position: "absolute", left: 30 + Math.sin(f / 5 + i) * 20, top: 10, width: 14, height: 14, background: "#fff", clipPath: "polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)", opacity: (1 - g * 2) * Math.abs(Math.sin(f / 6 + i * 1.7)) }} />}
            </div>
          );
        })}
        {Array.from({ length: 30 }).map((_, i) => <div key={"fl" + i} style={{ position: "absolute", left: 520 + rnd(i, 94) * 880, top: 460 + g * (300 + rnd(i, 95) * 300) + Math.sin(f / 6 + i) * 6, width: 10, height: 6, background: COL[i % 5], opacity: g > 0 ? 0.8 - g * 0.3 : 0, transform: `rotate(${f * 6 + i * 30}deg)` }} />)}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M480,560 L700,600 L760,520 L980,680 L1100,600 L1300,700 L1440,640" stroke="#fff" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c} opacity={0.85} /></svg>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 16. ¿a quién le preguntás? el ladrillero de joyas ✗ · el panadero de pan ✓ · el joyero de joyas ✓
export const AskWho: React.FC<{ d: number; o?: Ov; at?: number[] }> = ({ d, o = {}, at = [6, 40, 70] }) => {
  const f = useCurrentFrame();
  const mark = (a: number, ok: boolean, x: number) => { const t = ease(f, a + 16, a + 24); return <svg width={140} height={140} style={{ position: "absolute", left: x - 70, top: 230 }}>{ok ? <path d="M20,75 L58,112 L124,30" stroke="#5fd06a" strokeWidth={18} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} /> : <path d="M25,25 L115,115 M115,25 L25,115" stroke={RED} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />}</svg>; };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.04}>
        <Bab night={0.35} h={600}>
          {[["azmur", "brick", "gem", 400, "ladrillero", false], ["baker", "bread", "bread", 960, "panadero", true], ["jeweler", "gem", "gem", 1520, "joyero", true]].map(([w, pr, bub, x, n, ok], i) => {
            const a = at[i] ?? 6 + i * 30, t = spring({ frame: f - a, fps: 30, config: { damping: 14 } });
            return (
              <div key={i} style={{ opacity: t }}>
                <Fig who={w as Who} x={x as number} y={960} s={1.25} pose="stand" prop={pr as any} ph={i * 9} />
                <Bubble x={(x as number) + 40} y={520} a={a + 6} w={160} h={140}><Ico k={bub === "bread" ? 6 : 7} s={100} /></Bubble>
                {mark(a, ok as boolean, (x as number) + 40)}
                <div style={{ position: "absolute", left: (x as number) - 200, width: 400, top: 975, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 40, color: INK }}>{n as string}</div>
              </div>
            );
          })}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 17. balanza: lo seguro (montón de monedas) pesa más que la promesa que brilla
export const SafeScale: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const tip = interpolate(spring({ frame: f - 20, fps: 30, config: { damping: 8, mass: 1.3 } }), [0, 1], [0, -12]);
  return (
    <SunsetStage night={0.6} pan={0.25} tree="palm">
      <div style={{ position: "absolute", left: 910, top: 760, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "100px solid #2a1c14" }} />
      <div style={{ position: "absolute", left: 360, top: 750, width: 1200, height: 18, borderRadius: 9, background: "#b8892a", transform: `rotate(${tip}deg)`, transformOrigin: "600px 9px" }}>
        <div style={{ position: "absolute", left: 40, bottom: 18, width: 260, height: 200 }}>{Array.from({ length: 9 }).map((_, i) => <Coin key={i} x={60 + (i % 3) * 70} y={170 - Math.floor(i / 3) * 40} r={34} />)}</div>
        <div style={{ position: "absolute", right: 60, bottom: 18, width: 200, height: 200 }}><div style={{ position: "absolute", left: 40, top: 40, width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle at 35% 30%, #fff 0%, rgba(160,220,255,.5) 30%, rgba(160,120,255,.25) 70%, transparent 100%)`, border: "2px solid rgba(255,255,255,.6)", transform: `scale(${1 + Math.sin(f / 6) * 0.05})` }} /></div>
      </div>
      <div style={{ position: "absolute", left: 330, top: 470, fontFamily: F, fontWeight: 900, fontSize: 60, color: GOLD, opacity: ease(f, 10, 20) }}>LO SEGURO</div>
      <div style={{ position: "absolute", left: 1250, top: 380, fontFamily: F, fontWeight: 900, fontSize: 52, color: "#bfe4ff", opacity: ease(f, 22, 32) }}>LA PROMESA</div>
      <Overlays o={o} />
    </SunsetStage>
  );
};

// 18. la casa: alquilada (las monedas se van por la puerta) / propia (flores que crecen, chicos que juegan, monedas que se quedan)
export const HouseScene: React.FC<{ d: number; mode?: "rent" | "own"; o?: Ov }> = ({ d, mode = "rent", o = {} }) => {
  const f = useCurrentFrame();
  if (mode === "rent") {
    const k = f % 40, ph = k / 40;
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Push d={d} k={0.05}>
          <AbsoluteFill style={{ background: "linear-gradient(180deg,#3a2618,#22160e)" }} />
          <div style={{ position: "absolute", left: 360, top: 260, width: 900, height: 640, background: "#7a5a3c", boxShadow: "inset 0 0 80px rgba(0,0,0,.6)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M700,260 l20,80 l-30,60 l25,90" stroke="#3a2618" strokeWidth={5} fill="none" /></svg>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 70, top: 780 - (i % 2) * 40, width: 80, height: 110, borderRadius: "40% 40% 20% 20%", background: "#8a5a32", border: "3px solid #4a2a12" }} />)}
          <Fig who="man" x={820} y={900} s={1.1} pose="sit" />
          <Fig who="man" x={980} y={900} s={0.7} pose="stand" ph={5} />
          <div style={{ position: "absolute", left: 1260, top: 520, width: 150, height: 380, background: "#140c08" }} />
          <Fig who="man" x={1560} y={900} s={1.2} pose="give" flip dark />
          <Coin x={1000 + ph * 480} y={700 - Math.sin(ph * Math.PI) * 160} r={26} rot={f * 20} />
          <div style={{ position: "absolute", left: 1460, top: 380, fontFamily: F, fontWeight: 900, fontSize: 44, color: RED }}>alquiler</div>
        </Push>
        <Overlays o={o} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.05} ox="50% 70%">
        <Bab day h={540}>
          <div style={{ position: "absolute", left: 260, top: 400, width: 700, height: 520, background: "#9a7650", borderTop: "22px solid #6f5236" }}><div style={{ position: "absolute", left: 270, bottom: 0, width: 150, height: 240, borderRadius: "75px 75px 0 0", background: "#3a2010" }} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 920, bottom: 0, background: "#a07a52" }} />
          {Array.from({ length: 9 }).map((_, i) => { const g = ease(f, 6 + i * 6, 40 + i * 6), x = 1000 + i * 90; return (
            <svg key={i} width={80} height={240} style={{ position: "absolute", left: x - 40, top: 680 }}><line x1={40} y1={240} x2={40 + Math.sin(f / 15 + i) * 6} y2={240 - g * 170} stroke="#3f7a3a" strokeWidth={6} /><circle cx={40 + Math.sin(f / 15 + i) * 6} cy={240 - g * 170} r={g * 22} fill={i % 2 ? "#e0283c" : "#e9c762"} /></svg>); })}
          <Fig who="man" x={1300 + Math.sin(f / 14) * 120} y={960} s={0.62} pose="walk" ph={3} />
          <Fig who="man" x={1580 - Math.sin(f / 16) * 100} y={960} s={0.6} pose="raise" flip ph={8} />
          <div style={{ position: "absolute", left: 1430 + Math.sin(f / 8) * 150, top: 880 - Math.abs(Math.sin(f / 6)) * 150, width: 32, height: 32, borderRadius: 16, background: "#c4522a" }} />
          <Purse x={620} y={1010} s={0.8} fill={Math.min(1, 0.2 + f / Math.max(d, 1) * 0.6)} glow={0.3} />
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 19. la vida en un camino: el mismo hombre envejece; cuando se sienta, las monedas siguen trabajando para él
export const LifeRoad: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 0, d * 0.7);
  const x = 200 + p * 1240, sat = p > 0.98;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.04}>
        <Bab night={0.1 + p * 0.5} h={620}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, height: 70, background: "#b08a60" }} />
          <div style={{ position: "absolute", left: 1460, top: 830, width: 220, height: 30, background: "#5a3418" }} />
          <Fig who="man" x={sat ? 1560 : x} y={sat ? 880 : 910} s={1.1} pose={sat ? "sit" : "walk"} age={p} />
          {sat && Array.from({ length: 3 }).map((_, i) => { const xx = 1900 - ((f * 4 + i * 160) % 420); return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: "scaleX(-1)", transformOrigin: `${xx}px 0` }}><CoinMan x={xx} y={960} carry={2} ph={i * 6} /></div>; })}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 20. la escalera de la habilidad: vos subís y la paga crece en cada escalón
export const SkillStairs: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const L = ["aprender", "practicar", "cuidar el detalle", "ser mejor"];
  const p = ease(f, 10, d - 10) * 4, s = Math.min(3, Math.floor(p)), fr = p - s;
  const sx = (i: number) => 300 + i * 340, sy = (i: number) => 900 - i * 140;
  const px = sx(s) + 170 + fr * 340 * (s < 3 ? 1 : 0), py = sy(s) - (s < 3 ? Math.sin(fr * Math.PI) * 40 + fr * 140 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.04}>
        <Bab night={0.3} h={500}>
          {L.map((t, i) => <div key={i} style={{ position: "absolute", left: sx(i), top: sy(i), width: 340, height: 1080 - sy(i), background: `linear-gradient(180deg, #9a7650, #5a4028)`, borderTop: "10px solid #c4a274" }}><div style={{ marginTop: 18, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 34, color: INK }}>{t}</div></div>)}
          {L.map((_, i) => <div key={"c" + i} style={{ opacity: ease(f, 10 + i * (d - 20) / 4, 20 + i * (d - 20) / 4) }}>{Array.from({ length: i + 1 }).map((__, k) => <Coin key={k} x={sx(i) + 170} y={sy(i) - 230 - k * 22} r={30} />)}</div>)}
          <Person x={px} y={py} s={1} walk />
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 21. cuatro tarjetas: deudas · familia · testamento · respeto
const CardIcon: React.FC<{ i: number }> = ({ i }) => (
  <svg width={160} height={140} viewBox="0 0 160 140">
    {i === 0 && <><circle cx={50} cy={70} r={34} fill="none" stroke={GOLD} strokeWidth={10} /><circle cx={110} cy={70} r={34} fill="none" stroke={GOLD} strokeWidth={10} strokeDasharray="160 60" /></>}
    {i === 1 && <>{[40, 80, 120].map((x, k) => <g key={k}><circle cx={x} cy={k === 1 ? 50 : 40} r={k === 1 ? 14 : 18} fill={GOLD} /><rect x={x - (k === 1 ? 14 : 20)} y={k === 1 ? 70 : 64} width={k === 1 ? 28 : 40} height={k === 1 ? 50 : 66} rx={12} fill={GOLD} /></g>)}</>}
    {i === 2 && <><rect x={40} y={14} width={80} height={110} rx={12} fill={CLAY} />{[0, 1, 2, 3].map((k) => <line key={k} x1={54} y1={36 + k * 18} x2={106} y2={36 + k * 18} stroke="#6b3e16" strokeWidth={5} />)}<circle cx={104} cy={108} r={18} fill={RED} /></>}
    {i === 3 && <><ellipse cx={70} cy={74} rx={44} ry={22} fill="#d9a35a" /><path d="M110,80 q30,-6 40,10 l-34,18 Z" fill={GOLD} /></>}
  </svg>
);
export const FourCards: React.FC<{ d: number; at: number[]; o?: Ov }> = ({ d, at, o = {} }) => {
  const f = useCurrentFrame();
  const T = ["pague sus deudas", "cuide a su familia", "haga su testamento", "trate con respeto"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3a2414 0%, #0c0805 78%)" }}>
      <Push d={d} k={0.04}>
        {T.map((t, i) => { const s = spring({ frame: f - at[i], fps: 30, config: { damping: 14 } }); const on = f >= at[i] && (at[i + 1] === undefined || f < at[i + 1]);
          return <div key={i} style={{ position: "absolute", left: 150 + i * 420, top: 330 + (1 - s) * 80, width: 360, height: 440, opacity: s, borderRadius: 18, background: "linear-gradient(180deg,#24180f,#4a3020)", border: `4px solid ${on ? GOLD : "rgba(255,170,90,.35)"}`, boxShadow: on ? `0 0 40px rgba(233,199,98,.35)` : "0 20px 40px rgba(0,0,0,.5)", transform: `scale(${on ? 1.05 : 1})`, textAlign: "center", fontFamily: F }}>
            <div style={{ marginTop: 60 }}><CardIcon i={i} /></div>
            <div style={{ marginTop: 40, fontSize: 42, fontWeight: 800, color: INK, padding: "0 20px", lineHeight: 1.15 }}>{t}</div>
          </div>; })}
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 22. de vuelta a casa al anochecer: Bansir y Kobbi caminando hacia la ciudad
export const WalkHome: React.FC<{ d: number; o?: Ov; b1?: string; b2?: string }> = ({ d, o = {}, b1, b2 }) => {
  const f = useCurrentFrame();
  const Say: React.FC<{ x: number; a: number; t: string; y: number; z?: number }> = ({ x, a, t, y, z = 99999 }) => { const s = spring({ frame: f - a, fps: 30, config: { damping: 14 } }); return <div style={{ position: "absolute", left: x, top: y, opacity: 1 - ease(f, z, z + 10), padding: "14px 24px", borderRadius: 20, background: "rgba(250,246,238,.95)", fontFamily: F, fontWeight: 800, fontSize: 40, color: "#2a1a10", transform: `scale(${s})`, transformOrigin: "20% 100%", whiteSpace: "nowrap" }}>{t}</div>; };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Push d={d} k={0.05}>
        <Bab night={0.55} h={620} lit={0.6}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 900, height: 60, background: "#8a6a48" }} />
          <Fig who="bansir" x={1200 - f * 1.6} y={930} s={1.2} pose="walk" flip />
          <Fig who="kobbi" x={1400 - f * 1.6} y={935} s={1.2} pose="walk" flip ph={8} />
          {b1 && <Say x={900 - f * 1.6} a={10} t={b1} y={360} z={Math.round(d * 0.5) - 4} />}
          {b2 && <Say x={1200 - f * 1.6} a={Math.round(d * 0.5)} t={b2} y={470} />}
        </Bab>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 23. el cierre: UNA moneda que cae en la bolsa vacía
export const OneCoin: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const drop = ease(f, 20, 44), land = f > 44;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #3a2414 0%, #070504 75%)", overflow: "hidden" }}>
      <Push d={d} k={0.08} ox="50% 70%">
        <Purse x={960} y={980} s={1.4} fill={land ? 0.12 : 0.02} glow={land ? 0.6 * (1 - ease(f, 50, 90)) + 0.15 : 0} />
        {!land && <Coin x={960} y={-80 + drop * 760} r={44} rot={f * 14} />}
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 24. la pregunta para los comentarios + campanita (sin link, sin URL)
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 800, left: 0, display: "flex", gap: 22, opacity: 0.45, transform: `translateX(${-((f * 2.2) % (7 * 402))}px)` }}>
        {[...RULES, ...RULES, ...RULES].map((r, i) => <div key={i} style={{ width: 380, height: 120, flex: "none", borderRadius: 16, background: `radial-gradient(ellipse at 30% 25%, #d6a873 0%, ${CLAY} 50%, #8f6236 100%)`, fontFamily: F, fontWeight: 800, fontSize: 30, color: "#3a2410", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 14px" }}>{NUM[i % 7]} · {r}</div>)}
      </div>
      {bell && <svg width={200} height={220} viewBox="0 0 100 110" style={{ position: "absolute", left: 860, top: 120, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 180, right: 180, top: 420, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 74, color: INK, lineHeight: 1.15, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
