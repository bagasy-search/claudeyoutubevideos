// t30colmies — "Una Manada de Leones Atacó a un Hipopótamo" (La Ley del Colmillo, ES). Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble/DiagSplit siguen el patrón de src/btgm1/M1.tsx
// (allá no se exportan: acá van copiados, sin tocar btgm1). Todo lo ilustrado es SVG/CSS + siluetas rembg de fotos reales; lo real = Commons PD/CC + fotos agnes sin cara.
// Pieza ancla: el MARCADOR DE COMBATE león ×14 vs hipopótamo, que se llena arma por arma y termina en el veredicto.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, Person, SunsetStage, Beast, ease } from "../kits/btg/kit";

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
        <div key={li} style={{ fontSize: li && l.startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 0 8px rgba(0,0,0,.85), 0 4px 18px rgba(0,0,0,.7)" }}>
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

// brasas que suben lentas: que ninguna tarjeta quede quieta (el QC del farm marca congelado)
export const Embers: React.FC<{ n?: number; c?: string }> = ({ n = 34, c = "255,170,90" }) => {
  const f = useCurrentFrame();
  return <>{Array.from({ length: n }).map((_, i) => { const ph = (f / (240 + rnd(i, 11) * 200) + rnd(i, 12)) % 1; const x = rnd(i, 13) * 1920 + Math.sin(f / 40 + i) * 30; const r = 3 + rnd(i, 14) * 5;
    return <div key={i} style={{ position: "absolute", left: x, top: 1100 - ph * 1200, width: r, height: r, borderRadius: r, background: `rgba(${c},${0.55 * Math.sin(ph * Math.PI)})`, boxShadow: `0 0 ${r * 3}px rgba(${c},.5)` }} />; })}</>;
};
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
      <AbsoluteFill style={{ filter: "blur(28px) brightness(.36) saturate(.8)", transform: "scale(1.15)" }}><Img src={sf(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      {cards.map((c, i) => {
        const t = spring({ frame: f - 3 - i * 12, fps: 30, config: { damping: 15, mass: 0.8 } });
        const tilt = (rnd(i, 7) - 0.5) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 540 - H / 2 + 40 + (1 - t) * 90, width: W, height: H, opacity: t, transform: `rotate(${tilt * (1 - t * 0.6)}deg)`, borderRadius: 12, overflow: "hidden", border: "6px solid rgba(255,255,255,.93)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
            <Img src={sf(c)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - 0.08 * ease(f, i * 12, i * 12 + 90)})` }} />
          </div>
        );
      })}
      <Overlays o={{ ...o, big: o.big ? { x: 90, y: 440, size: 170, color: ORA, ...o.big } : undefined }} />
    </AbsoluteFill>
  );
};
// ───────────────────────── escenarios ilustrados (siempre algo se mueve) ─────────────────────────
const Push: React.FC<{ d: number; k?: number; ox?: string; children: React.ReactNode }> = ({ d, k = 0.05, ox = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1 + k], clamp)})`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
const Sky: React.FC<{ night?: number; h?: number }> = ({ night = 0, h = 620 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, ${C.navy} 38%, ${C.dusk} 62%, ${C.ember} 86%, ${C.glow} 100%)`, height: h + 20, opacity: 1 - night * 0.75 }} />
      {night > 0 && Array.from({ length: 60 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 1920, top: rnd(i, 4) * h * 0.7, width: 2, height: 2, borderRadius: 1, background: "#fff", opacity: night * (0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i))) }} />)}
    </>
  );
};
// 15. electrocardiograma que se corta (con respeto: sólo la línea)
export const EcgScene: React.FC<{ d: number; cut?: number; o?: Ov; dim?: boolean }> = ({ d, cut = 0.6, o = {}, dim }) => {
  const f = useCurrentFrame();
  const W = 1920, prog = interpolate(f, [0, d], [0, 1], clamp), head = (0.15 + prog) * W * 1.15;
  const pts: string[] = [];
  for (let x = 0; x <= Math.min(head, W); x += 6) {
    const flat = x > W * cut;
    const ph = (x % 300) / 300;
    const y = flat ? 0 : ph > 0.4 && ph < 0.44 ? -170 : ph > 0.44 && ph < 0.48 ? 110 : ph > 0.6 && ph < 0.7 ? -30 * Math.sin((ph - 0.6) * 31) : 0;
    pts.push(`${x},${560 + y}`);
  }
  const col = dim ? "#8aa" : "#5dff8a";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #08140e 0%, #020604 80%)" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(93,255,138,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(93,255,138,.07) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// fondo oscuro + texto (BigWord / Build) para las frases que pegan
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6a1a10 0%, #1c0606 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #14263a 0%, #05090f 75%)";
  return <AbsoluteFill style={{ background: bg, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.06], clamp)})` }}><Embers c={tone === "dark" ? "140,190,255" : "255,150,90"} /><Overlays o={o} /></AbsoluteFill>;
};
// pantalla partida en diagonal: BUENA NOTICIA. / MALA NOTICIA.
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
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.06], clamp)})` }}>
      <Embers />
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 160, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 200, right: 200, top: 480, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 72, color: INK, lineHeight: 1.15, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ═════════════════════════ t30colmies: siluetas, escenas y gráficos nuevos ═════════════════════════
import CUTS from "./cuts.json";
const cut = (k: string) => (CUTS as any)[k] as { img: string; ar: number };
// silueta "de afiche" del kit (Beast) por nombre de recorte (rembg de fotos reales de Commons)
const Sil: React.FC<{ k: string; x: number; y: number; w: number; flip?: boolean; rim?: string; eye?: [number, number]; bob?: number; op?: number }> = ({ k, x, y, w, flip = false, rim, eye, bob, op = 1 }) => {
  const c = cut(k); if (!c) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, opacity: op }}><Beast img={c.img} ar={c.ar} x={x} y={y} w={w} flip={flip} rim={rim} eye={eye} bob={bob} /></div>;
};
const Grass: React.FC<{ y: number; n?: number; c?: string; h?: number; seed?: number }> = ({ y, n = 90, c = "#1a140c", h = 120, seed = 1 }) => {
  const f = useCurrentFrame();
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: n }).map((_, i) => { const x = (i / n) * 2000 - 40 + rnd(i, seed) * 20, hh = h * (0.5 + rnd(i, seed + 1) * 0.7), sw = Math.sin(f / 22 + i * 0.7) * 8;
    return <path key={i} d={`M${x},${y} q${4 + sw / 2},${-hh * 0.5} ${sw + 10 * (rnd(i, seed + 2) - 0.5)},${-hh}`} stroke={c} strokeWidth={5} fill="none" strokeLinecap="round" />; })}</svg>;
};
// banda de río marrón con brillos que corren
const RiverBand: React.FC<{ y0: number; y1: number; c1?: string; c2?: string }> = ({ y0, y1, c1 = "#4a3b2a", c2 = "#2b2418" }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: y0, height: y1 - y0, background: `linear-gradient(180deg, ${c1}, ${c2})` }} />
      {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 240 + f * (1.2 + (i % 3) * 0.4)) % 2200) - 150, top: y0 + 12 + i * ((y1 - y0 - 20) / 10), width: 90 + rnd(i, 8) * 160, height: 3, borderRadius: 2, background: "rgba(255,200,140,.16)" }} />)}
    </>
  );
};
const Splash: React.FC<{ x: number; y: number; t: number; w?: number }> = ({ x, y, t, w = 520 }) => (
  <>{Array.from({ length: 46 }).map((_, i) => { const a = (rnd(i, 31) - 0.5) * Math.PI * 0.9 - Math.PI / 2, sp = 0.4 + rnd(i, 32), r = t * w * sp; const px = x + Math.cos(a) * r * 0.9, py = y + Math.sin(a) * r * 0.75 + t * t * 260 * sp; const s = 10 + rnd(i, 33) * 26;
    return <div key={i} style={{ position: "absolute", left: px - s / 2, top: py - s / 2, width: s, height: s, borderRadius: s, background: "rgba(225,235,235,.85)", opacity: Math.max(0, 1 - t * 0.9) }} />; })}</>
);

// ── 1. LA ORILLA (escena ancla ilustrada): vos agachado en el pasto, 14 leones echados, 1 hipopótamo en el agua baja.
// modos: hook · stand (la leona vieja se levanta) · gape (se da vuelta y abre la boca) · charge (embiste: pared de agua) ·
// slow (la misma embestida en cámara lenta) · lie (se vuelven a echar) · night · drought · end (atardecer, ojos en el agua)
export const RiverScene: React.FC<{ d: number; mode?: string; o?: Ov }> = ({ d, mode = "hook", o = {} }) => {
  const f = useCurrentFrame();
  const night = mode === "night" ? 1 : mode === "end" ? 0.35 : 0;
  const hz = 520, ry0 = 600, ry1 = 800;
  const sl = mode === "slow" ? 0.3 : 1;
  const ch = mode === "charge" || mode === "slow" ? ease(f, 12 / sl, 34 / sl) : 0;
  const stand = mode === "stand" ? ease(f, 10, 40) : mode === "charge" || mode === "slow" || mode === "gape" ? 1 : 0;
  const lieBack = mode === "lie" ? f / Math.max(d, 1) : 0;
  const gape = mode === "gape" ? ease(f, d * 0.35, d * 0.6) : mode === "charge" || mode === "slow" ? 1 : 0;
  const turn = mode === "gape" ? ease(f, 0, d * 0.35) : 1;
  if (mode === "drought") {
    return (
      <Push d={d} k={0.06}>
        <SunsetStage tree="acacia" horizon={hz} sunX={1500} pan={0.25}>
          <AbsoluteFill style={{ top: hz + 8, background: "repeating-linear-gradient(115deg,#5a4430 0 60px,#4e3a28 60px 64px,#5a4430 64px 140px)" }} />
          {[[420, 760, 260], [1000, 680, 380], [1560, 820, 200]].map(([x, y, r], i) => {
            const sh = 1 - ease(f, 0, d) * 0.18;
            return <div key={i} style={{ position: "absolute", left: x - r * sh, top: y - r * 0.32 * sh, width: r * 2 * sh, height: r * 0.64 * sh, borderRadius: "50%", background: "radial-gradient(ellipse,#5b4a35 0%,#3c3022 70%)", border: "4px solid #2a2016" }} />;
          })}
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 760 + (i % 5) * 92 + Math.sin(f / 15 + i) * 3, top: 650 + Math.floor(i / 5) * 46, width: 120, height: 46, borderRadius: "50%", background: "#151515", boxShadow: "0 -3px 0 #e8833a88" }} />)}
          <Sil k="lion_walk" x={150 + ease(f, 0, d) * 160} y={660} w={260} flip />
          <Sil k="lion_walk" x={60 + ease(f, 0, d) * 140} y={700} w={240} flip />
          <Sil k="lion_male" x={-40 + ease(f, 0, d) * 150} y={760} w={320} flip />
        </SunsetStage>
        <Overlays o={o} />
      </Push>
    );
  }
  return (
    <Push d={d} k={mode === "hook" ? 0.07 : 0.05} ox={mode === "gape" || mode === "charge" ? "70% 60%" : "50% 60%"}>
      <SunsetStage tree="acacia" horizon={hz} night={night} sunX={mode === "end" ? 1150 : 1500} pan={0.2}>
        {mode !== "night" && <RiverBand y0={ry0} y1={ry1} />}
        {mode === "night" && <AbsoluteFill style={{ top: hz + 8, background: "linear-gradient(180deg,#26303a,#141a20)" }} />}
        {mode === "night" && <Grass y={hz + 70} n={120} c="#8a94a0" h={60} seed={4} />}
        {mode === "night" ? (
          <Sil k="hippo_side" x={1180 + ease(f, 0, d) * 40} y={720} w={520} flip rim="#9fb4c8" bob={1} />
        ) : mode === "end" ? (
          <>
            <div style={{ position: "absolute", left: 1180, top: ry0 + 70, width: 230, height: 46, borderRadius: "50% 50% 20% 20%", background: "#101010", boxShadow: "0 -3px 0 #e8833aaa", transform: `translateY(${Math.sin(f / 18) * 3}px)` }} />
            {[1205, 1345].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: ry0 + 52 + Math.sin(f / 18) * 3, width: 44, height: 30, borderRadius: "50%", background: "#101010" }}><div style={{ position: "absolute", left: 15, top: 9, width: 13, height: 13, borderRadius: 7, background: "#ffb030", boxShadow: "0 0 16px 6px #ff9a1a", opacity: 0.4 + 0.6 * ease(f, d * 0.3, d * 0.6) }} /></div>)}
          </>
        ) : (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${-ch * 260}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(0 0 ${1080 - ry0 - 75}px 0)` }}>
              {gape > 0.5 ? <Sil k="hippo_gape" x={1240} y={ry0 + 110} w={460} flip={false} rim="#ff9a4a" />
                : <Sil k="hippo_side" x={1260} y={ry0 + 90} w={520} flip={turn < 0.5} bob={1.5} />}
            </div>
            <div style={{ position: "absolute", left: 1220, top: ry0 + 66, width: 560, height: 14, borderRadius: 8, background: "rgba(255,210,160,.22)" }} />
          </div>
        )}
        {ch > 0 && <Splash x={1120} y={ry0 + 60} t={ch} />}
        {mode !== "night" && Array.from({ length: 14 }).map((_, i) => {
          const x = 60 + (i % 7) * 150 + (i > 6 ? 70 : 0), y = ry1 + 70 + (i > 6 ? 90 : 0) + rnd(i, 5) * 20;
          if (i === 3 && stand > 0 && mode !== "lie") {
            const back = ch * 260;
            return <Sil key={i} k="lion_walk" x={x + 260 * stand - back} y={y - 10} w={250} flip bob={mode === "stand" ? 0 : 1} />;
          }
          const up = mode === "lie" ? (rnd(i, 9) > lieBack ? 1 : 0) : 0;
          return up ? <Sil key={i} k="lion_walk" x={x} y={y} w={210} flip /> : <Sil key={i} k={i % 3 ? "lion_lie" : "lion_lie2"} x={x} y={y} w={200} flip={i % 2 === 0} />;
        })}
        {mode === "night" && Array.from({ length: 5 }).map((_, i) => <Sil key={i} k="lion_walk" x={60 + i * 170 + ease(f, 0, d) * 120} y={880 + (i % 2) * 50} w={230} flip rim="#9fb4c8" />)}
        {mode === "hook" && <Person x={1720} y={1130} s={1.15} arms="down" flip />}
        <Grass y={1090} n={70} c={night ? "#0e1216" : "#20170d"} h={mode === "hook" ? 230 : 120} seed={2} />
        {mode === "slow" && <div style={{ position: "absolute", right: 60, top: 60, fontFamily: F, fontWeight: 900, fontSize: 40, color: INK, letterSpacing: 4, opacity: 0.6 + 0.4 * Math.sin(f / 6) }}>● CÁMARA LENTA</div>}
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ── 2. EL MARCADOR DE COMBATE (pieza ancla): León ×14 vs Hipopótamo. Se llena arma por arma; n = filas a la vista, hot = la nueva.
export const ROWS = [
  { k: "PESO", l: "≈ 2 t entre los 14", r: "1,5 – 3 t, él solo" },
  { k: "1 · LA BOCA", l: "mordida a la garganta", r: "150° · colmillo ≈ 50 cm" },
  { k: "2 · LA PIEL", l: "garras de 3-4 cm", r: "cuero de 5-6 cm" },
  { k: "3 · EL AGUA", l: "odia el agua honda", r: "su fortaleza" },
  { k: "4 · VELOCIDAD", l: "más rápido… por poco", r: "30 km/h · gira al instante" },
  { k: "5 · EL GRUPO", l: "la manada", r: "pozas de 10, 20 o más" },
  { k: "6 · ESCUDO ROJO", l: "herida = hambre", r: "protector solar + antibacteriano" },
];
export const Marcador: React.FC<{ d: number; n?: number; hot?: number; verdict?: boolean; o?: Ov; va?: number }> = ({ d, n = 1, hot = -1, verdict = false, o = {}, va = 30 }) => {
  const f = useCurrentFrame();
  const rows = ROWS.slice(0, n), RH = 84, Y0 = 300;
  const score = rows.slice(1).filter((_, i) => i + 1 !== hot || f > 26).length;
  const v = verdict ? ease(f, va, va + 10) : 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3a2414 0%, #0c0805 78%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.045], clamp)})` }}>
      <Embers n={24} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 34, letterSpacing: 8, color: "rgba(240,235,229,.6)" }}>MARCADOR DE COMBATE</div>
      <Sil k="lion_walk" x={120} y={270} w={260} flip rim={ORA} />
      <Sil k="hippo_side" x={1500} y={270} w={300} rim={ORA} />
      <div style={{ position: "absolute", left: 420, top: 110, fontFamily: F, fontWeight: 900, fontSize: 70, color: INK }}>LEÓN <span style={{ color: ORA }}>×14</span></div>
      <div style={{ position: "absolute", right: 430, top: 110, fontFamily: F, fontWeight: 900, fontSize: 70, color: INK, textAlign: "right" }}>HIPOPÓTAMO</div>
      <div style={{ position: "absolute", left: 420, top: 190, fontFamily: F, fontWeight: 900, fontSize: 64, color: score ? "rgba(240,235,229,.4)" : INK }}>0</div>
      <div style={{ position: "absolute", right: 430, top: 190, fontFamily: F, fontWeight: 900, fontSize: 64, color: RED, textAlign: "right", textShadow: `0 0 24px ${RED}66` }}>{score}</div>
      {rows.map((r, i) => {
        const isHot = i === hot, t = isHot ? ease(f, 4, 16) : 1, lit = isHot ? 0.5 + 0.5 * Math.sin(f / 7) : 0;
        const win = i > 0 && (!isHot || f > 26);
        return (
          <div key={i} style={{ position: "absolute", left: 150, right: 150, top: Y0 + i * RH, height: RH - 10, opacity: t * (verdict ? 0.5 : 1), transform: `translateY(${(1 - t) * 30}px)`, display: "flex", alignItems: "center", fontFamily: F,
            background: isHot ? `rgba(237,178,105,${0.12 + lit * 0.1})` : "rgba(255,255,255,.04)", border: `2px solid ${isHot ? ORA : "rgba(240,235,229,.12)"}`, borderRadius: 10 }}>
            <div style={{ width: 560, paddingLeft: 26, fontSize: 32, fontWeight: 700, color: "rgba(240,235,229,.82)" }}>{r.l}</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 30, fontWeight: 900, letterSpacing: 2, color: isHot ? ORA : INK }}>{r.k}</div>
            <div style={{ width: 560, paddingRight: 26, textAlign: "right", fontSize: 32, fontWeight: 800, color: INK }}>{r.r}{win && <span style={{ color: RED, marginLeft: 14, display: "inline-block", transform: `scale(${isHot ? 1.4 - 0.4 * ease(f, 26, 34) : 1})` }}>✓</span>}</div>
          </div>
        );
      })}
      {verdict && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: F, opacity: v, transform: `scale(${1.25 - 0.25 * v}) rotate(-3deg)` }}>
          <div style={{ display: "inline-block", padding: "18px 50px", border: `8px solid ${RED}`, borderRadius: 14, background: "rgba(12,6,4,.9)" }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 10, color: INK }}>VEREDICTO</div>
            <div style={{ fontSize: 150, fontWeight: 900, color: RED, lineHeight: 1 }}>HIPOPÓTAMO</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: ORA, marginTop: 8 }}>de día · sano · en su río</div>
          </div>
        </div>
      )}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 3. LA BALANZA: 14 leonas se suben de a una (≈ 2 t) contra un solo hipopótamo
export const WeighScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const nL = Math.min(14, Math.floor(interpolate(f, [8, Math.max(20, Math.min(d * 0.5, 140))], [0, 14.99], clamp)));
  const hip = ease(f, d * 0.55, d * 0.55 + 12);
  const tip = interpolate(nL, [0, 14], [0, -7]) + hip * 14;
  const ang = interpolate(spring({ frame: f - 2, fps: 30, config: { damping: 12 } }), [0, 1], [0, 1]) * tip;
  return (
    <Push d={d} k={0.04}>
      <SunsetStage tree="acacia" night={0.5} pan={0.15}>
        <div style={{ position: "absolute", left: 910, top: 800, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "100px solid #2a1c14" }} />
        <div style={{ position: "absolute", left: 260, top: 790, width: 1400, height: 18, borderRadius: 9, background: "#8a5a32", transform: `rotate(${ang}deg)`, transformOrigin: "700px 9px" }}>
          {Array.from({ length: nL }).map((_, i) => <div key={i} style={{ position: "absolute", left: 10 + (i % 5) * 100, bottom: 18 + Math.floor(i / 5) * 64, width: 120, height: 80 }}><Sil k="lion_walk" x={0} y={80} w={120} flip rim={ORA} /></div>)}
          <div style={{ position: "absolute", right: 40, bottom: 18, width: 480, height: 300, opacity: hip, transform: `translateY(${(1 - hip) * -200}px)` }}><Sil k="hippo_side" x={0} y={300} w={480} rim={ORA} /></div>
        </div>
        <div style={{ position: "absolute", left: 280, top: 240, fontFamily: F, fontWeight: 900, fontSize: 120, color: INK, fontVariantNumeric: "tabular-nums" }}>{nL}<span style={{ fontSize: 50, color: ORA }}> leones</span></div>
        <div style={{ position: "absolute", left: 286, top: 380, fontFamily: F, fontWeight: 800, fontSize: 60, color: ORA, opacity: ease(f, 20, 30) }}>≈ {(nL * 0.14).toFixed(1).replace(".", ",")} t</div>
        <div style={{ position: "absolute", right: 260, top: 250, fontFamily: F, fontWeight: 900, fontSize: 110, color: RED, opacity: hip, textAlign: "right" }}>1<div style={{ fontSize: 50, color: INK }}>hasta 3 t</div></div>
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ── 4. RANGO DE PRESAS: el punto justo (190-550 kg) y el hipopótamo 3-5 veces más allá
export const PreyRange: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const X0 = 160, W = 1600, MAX = 3000, px = (kg: number) => X0 + (kg / MAX) * W;
  const band = ease(f, 10, 30), hip = ease(f, d * 0.45, d * 0.45 + 14), mult = Math.min(5, Math.floor(interpolate(f, [d * 0.55, d * 0.9], [3, 5.99], clamp)));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#150d08,#080504)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      <Embers n={20} />
      <div style={{ position: "absolute", left: X0, top: 640, width: W, height: 8, background: "rgba(240,235,229,.25)", borderRadius: 4 }} />
      {[0, 500, 1000, 1500, 2000, 2500, 3000].map((k) => <div key={k} style={{ position: "absolute", left: px(k) - 70, top: 670, width: 140, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: 28, color: C.dim }}>{k.toLocaleString("es-AR")} kg</div>)}
      <div style={{ position: "absolute", left: px(190), top: 560, width: (px(550) - px(190)) * band, height: 170, background: "rgba(157,255,122,.18)", border: `3px solid ${GLOW}`, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: px(190) - 40, top: 490, fontFamily: F, fontWeight: 900, fontSize: 44, color: GLOW, opacity: band }}>190 – 550 kg</div>
      <div style={{ position: "absolute", left: px(190) - 40, top: 760, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: GOLD, opacity: ease(f, 24, 34), transform: "rotate(-4deg)" }}>su punto justo</div>
      <div style={{ position: "absolute", left: px(1500), top: 580, width: (px(3000) - px(1500)) * hip, height: 130, background: "rgba(241,69,54,.25)", border: `3px solid ${RED}`, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: px(1500) + 40, top: 320, width: 440, height: 240, opacity: hip }}><Sil k="hippo_side" x={0} y={240} w={440} rim={RED} /></div>
      <div style={{ position: "absolute", left: px(2050), top: 760, fontFamily: F, fontWeight: 900, fontSize: 110, color: RED, opacity: ease(f, d * 0.55, d * 0.6), fontVariantNumeric: "tabular-nums" }}>×{mult}</div>
      <div style={{ position: "absolute", left: px(200), top: 190, width: 260, height: 220, opacity: band }}><Sil k="zebra" x={0} y={220} w={240} rim={GLOW} /></div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 5. RAYOS X DE LA MANDÍBULA: se abre a 150°, colmillo ≈ 50 cm (con la parte escondida), se afilan solos, mordida > 1 t
export const JawXray: React.FC<{ d: number; mode?: "open" | "tusk" | "grind" | "bite"; o?: Ov }> = ({ d, mode = "open", o = {} }) => {
  const f = useCurrentFrame();
  const open = mode === "open" ? ease(f, 10, Math.max(20, d * 0.7)) : mode === "grind" ? 0.05 + 0.05 * Math.abs(Math.sin(f / 5)) : mode === "bite" ? (f < d * 0.5 ? ease(f, 0, d * 0.3) * 0.8 : 0.8 - 0.8 * ease(f, d * 0.5, d * 0.5 + 5)) : 0.55;
  const ang = open * 150;
  const cx = 700, cy = 560, r = 320;
  const upper = `M0,0 L420,-40 Q520,-60 560,-10 L560,20 Q400,10 0,30 Z`;
  const lower = `M0,0 L520,10 Q560,30 540,70 Q420,90 0,60 Z`;
  const a1 = (-ang * 0.5) * Math.PI / 180, a2 = (ang * 0.5) * Math.PI / 180;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, #06202c 0%, #01070b 80%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(79,227,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,227,255,.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 10px ${CYAN})` }}>
        <g transform={`translate(${cx - 200},${cy})`}>
          <g transform={`rotate(${-ang * 0.5})`}><path d={upper} fill="rgba(79,227,255,.10)" stroke={CYAN} strokeWidth={5} />
            {[120, 220, 320, 420].map((x) => <path key={x} d={`M${x},20 l14,22 l14,-22`} fill="none" stroke={CYAN} strokeWidth={4} />)}
            <path d="M500,10 Q530,70 505,110" fill="none" stroke={mode === "grind" ? GOLD : CYAN} strokeWidth={10} strokeLinecap="round" /></g>
          <g transform={`rotate(${ang * 0.5})`}><path d={lower} fill="rgba(79,227,255,.10)" stroke={CYAN} strokeWidth={5} />
            {[140, 240, 340].map((x) => <path key={x} d={`M${x},10 l14,-20 l14,20`} fill="none" stroke={CYAN} strokeWidth={4} />)}
            <path d="M470,40 Q560,-60 520,-170" fill="none" stroke={mode === "tusk" ? ORA : "#ffffff"} strokeWidth={22} strokeLinecap="round" />
            <path d="M470,40 Q420,70 360,70" fill="none" stroke={mode === "tusk" ? ORA : "#cfefff"} strokeWidth={18} strokeDasharray="14 12" strokeLinecap="round" />
          </g>
          {mode === "open" && ang > 4 && <path d={`M${Math.cos(a1) * r},${Math.sin(a1) * r} A${r},${r} 0 0,1 ${Math.cos(a2) * r},${Math.sin(a2) * r}`} fill="none" stroke={ORA} strokeWidth={6} strokeDasharray="10 10" />}
          {mode === "grind" && Array.from({ length: 12 }).map((_, i) => { const t = ((f / 12 + i / 12) % 1); return <circle key={i} cx={505 + Math.cos(i) * t * 90} cy={40 - t * 100 + Math.sin(i * 3) * 20} r={5} fill={GOLD} opacity={1 - t} />; })}
        </g>
      </svg>
      {mode === "open" && <div style={{ position: "absolute", left: 1240, top: 380, fontFamily: F, fontWeight: 900, fontSize: 220, color: ORA, fontVariantNumeric: "tabular-nums", textShadow: `0 0 40px ${ORA}55` }}>{Math.round(ang)}°</div>}
      {mode === "tusk" && <><div style={{ position: "absolute", left: 1250, top: 300, width: 8, height: 420 * ease(f, 8, 30), background: ORA }} />
        <div style={{ position: "absolute", left: 1290, top: 400, fontFamily: F, fontWeight: 900, fontSize: 170, color: ORA, opacity: ease(f, 20, 30) }}>≈ 50 cm</div>
        <div style={{ position: "absolute", left: 1296, top: 600, width: 560, fontFamily: F, fontWeight: 700, fontSize: 40, color: INK, opacity: ease(f, 34, 44) }}>contando la parte escondida en la encía</div></>}
      {mode === "grind" && <div style={{ position: "absolute", left: 1240, top: 420, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: GOLD, transform: "rotate(-5deg)", opacity: ease(f, 10, 20) }}>se afilan solos</div>}
      {mode === "bite" && <div style={{ position: "absolute", left: 1220, top: 360, fontFamily: F, fontWeight: 900, fontSize: 150, color: RED, opacity: ease(f, d * 0.5, d * 0.5 + 6), transform: `scale(${1.3 - 0.3 * ease(f, d * 0.5, d * 0.5 + 6)})`, transformOrigin: "left center" }}>&gt; 1 t<div style={{ fontSize: 44, color: INK }}>de presión (estimada)</div></div>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 6. CORTE DE LA PIEL: garra de 3-4 cm contra cuero de 5-6 cm (grasa y músculo debajo) · modo neck: cuello de cebra vs columna del hipopótamo
export const SkinCut: React.FC<{ d: number; mode?: "claw" | "neck"; o?: Ov }> = ({ d, mode = "claw", o = {} }) => {
  const f = useCurrentFrame();
  const CM = 70, top = 420;
  if (mode === "neck") {
    const t = ease(f, 8, 30), t2 = ease(f, d * 0.35, d * 0.35 + 20);
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1a10 0%, #0a0806 75%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
        <Embers n={18} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(520,600)" opacity={t}><circle r={110} fill="#6a5040" stroke={INK} strokeWidth={4} /><circle r={24} cx={0} cy={-46} fill="#0a0806" stroke={GLOW} strokeWidth={4} /><circle r={150 + Math.sin(f / 8) * 6} fill="none" stroke={GLOW} strokeWidth={4} strokeDasharray="12 10" /></g>
          <g transform="translate(1320,600)" opacity={t2}><circle r={320 * t2 + 1} fill="#5a4a44" stroke={INK} strokeWidth={4} /><circle r={290 * t2 + 1} fill="#6e4038" /><circle r={240 * t2 + 1} fill="#7e5048" /><circle r={30} cx={0} cy={-90} fill="#0a0806" /></g>
        </svg>
        <div style={{ position: "absolute", left: 380, top: 790, width: 280, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 40, color: GLOW, opacity: t }}>cuello de cebra</div>
        <div style={{ position: "absolute", left: 1120, top: 960, width: 400, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 40, color: RED, opacity: t2 }}>cuello de hipopótamo</div>
        <Overlays o={o} />
      </AbsoluteFill>
    );
  }
  const clawY = interpolate(f, [10, Math.max(20, d * 0.5)], [-4 * CM, 3.5 * CM], clamp);
  const stop = clawY >= 3.4 * CM;
  return (
    <AbsoluteFill style={{ background: "#0a0806", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: top, background: "linear-gradient(180deg,#1a2430,#2a3550)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top, height: 5.5 * CM, background: "repeating-linear-gradient(90deg,#6e6a68 0 40px,#64605e 40px 44px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 5.5 * CM, height: 120, background: "#c9b48a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: top + 5.5 * CM + 120, bottom: 0, background: "#7a3e36" }} />
      {([["PIEL", top + 2.4 * CM], ["GRASA", top + 5.5 * CM + 40], ["MÚSCULO", top + 5.5 * CM + 150]] as [string, number][]).map(([t, y]) => <div key={t} style={{ position: "absolute", left: 60, top: y, fontFamily: F, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: "rgba(255,255,255,.8)" }}>{t}</div>)}
      <div style={{ position: "absolute", left: 1500, top, width: 6, height: 5.5 * CM, background: ORA }} />
      {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1500, top: top + i * CM, width: 30, height: 4, background: ORA }} />)}
      <div style={{ position: "absolute", left: 1550, top: top + 2 * CM, fontFamily: F, fontWeight: 900, fontSize: 90, color: ORA }}>5-6 cm</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M860,${top + clawY - 3.5 * CM - 200} Q980,${top + clawY - 3.5 * CM} 990,${top + clawY} Q960,${top + clawY - 1.2 * CM} 920,${top + clawY - 3.5 * CM - 200} Z`} fill="#e9e1d0" stroke="#fff" strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: 1040, top: 150, fontFamily: F, fontWeight: 900, fontSize: 80, color: INK, opacity: ease(f, 6, 16) }}>garra: 3-4 cm</div>
      {stop && <div style={{ position: "absolute", left: 960, top: top + 3.5 * CM - 30, width: 60, height: 60, borderRadius: 30, border: `5px solid ${RED}`, opacity: ease(f, d * 0.5, d * 0.5 + 6) }} />}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 7. CORTE DEL RÍO (lo que hay bajo el agua): el hipopótamo camina por el fondo (5 min sin respirar); modo lion: león con el agua al pecho + cocodrilos
export const RiverCut: React.FC<{ d: number; mode?: "bottom" | "lion"; o?: Ov }> = ({ d, mode = "bottom", o = {} }) => {
  const f = useCurrentFrame();
  const wl = 380, bed = 920;
  const hx = 300 + ease(f, 0, d) * 700;
  const secs = Math.max(0, 300 - Math.floor(f * 2.2));
  return (
    <Push d={d} k={0.04} ox="50% 60%">
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, ${C.dusk} 60%, ${C.ember} 100%)`, height: wl }} />
      <AbsoluteFill style={{ top: wl, background: "linear-gradient(180deg,#2c4a44 0%,#16302c 60%,#0c1c1a 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M0,${bed} Q480,${bed - 30} 960,${bed} T1920,${bed - 20} L1920,1080 L0,1080 Z`} fill="#3a2c1e" />
        {mode === "lion" && <path d={`M0,${wl - 10} L300,${wl - 10} Q380,${wl + 60} 420,1080 L0,1080 Z`} fill="#4a3426" />}
        {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={hx + 300 + Math.sin(i * 2 + f / 10) * 20} cy={bed - 200 - ((f * 3 + i * 50) % 500)} r={4 + (i % 3) * 3} fill="rgba(220,255,250,.35)" />)}
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={((i * 260 + f * 1.5) % 2100) - 100} x2={((i * 260 + f * 1.5) % 2100) + 60} y1={wl + 4} y2={wl + 4} stroke="rgba(255,220,170,.4)" strokeWidth={3} />)}
      </svg>
      {mode === "bottom" && <>
        <div style={{ position: "absolute", left: 0, top: -Math.abs(Math.sin(f / 12)) * 40, width: 1920, height: 1080 }}><Sil k="hippo_side" x={hx} y={bed + 10} w={560} flip rim={CYAN} /></div>
        <div style={{ position: "absolute", right: 120, top: 460, fontFamily: F, fontWeight: 900, fontSize: 130, color: CYAN, fontVariantNumeric: "tabular-nums" }}>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</div>
        <div style={{ position: "absolute", right: 120, top: 610, fontFamily: F, fontWeight: 700, fontSize: 40, color: INK }}>sin respirar</div>
      </>}
      {mode === "lion" && <>
        <Sil k="lion_walk" x={330 + ease(f, 0, d) * 60} y={wl + 170} w={380} flip bob={2} />
        <AbsoluteFill style={{ top: wl + 80, background: "rgba(22,48,44,.6)" }} />
        {[0, 1].map((i) => <Sil key={i} k="croc" x={1500 - i * 420 - ease(f, 0, d) * 260} y={bed - 60 - i * 140} w={440} flip={false} rim="#6fa" />)}
        <Sil k="hippo_side" x={1250} y={bed + 10} w={560} flip rim={ORA} />
      </>}
      <Overlays o={o} />
    </Push>
  );
};

// ── 8. VELOCIDAD: barras que corren (persona · hipopótamo 30 km/h · leona) + modo turn (< 1 s para girar la cabeza)
export const SpeedBars: React.FC<{ d: number; mode?: "race" | "turn"; o?: Ov }> = ({ d, mode = "race", o = {} }) => {
  const f = useCurrentFrame();
  if (mode === "turn") {
    const t = ease(f, d * 0.3, d * 0.3 + 10);
    const ms = Math.min(0.99, (f / 30) * 0.5);
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a1a10 0%, #0a0806 75%)" }}>
        <Embers n={16} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(1060,620)">
            <ellipse rx={300} ry={170} fill="#111" stroke={ORA} strokeWidth={4} />
            <g transform={`rotate(${-70 * t})`}><ellipse cx={300} cy={0} rx={130} ry={95} fill="#161616" stroke={ORA} strokeWidth={4} /><circle cx={360} cy={-50} r={10} fill="#ffb030" /></g>
            <circle cx={240} cy={-330} r={34} fill={GOLD} opacity={1 - t * 0.6} />
            <text x={290} y={-380} fill={GOLD} fontFamily={F} fontWeight={800} fontSize={34}>leona</text>
          </g>
        </svg>
        <div style={{ position: "absolute", left: 110, top: 150, fontFamily: F, fontWeight: 900, fontSize: 200, color: RED }}>&lt; 1 s</div>
        <div style={{ position: "absolute", left: 120, top: 380, fontFamily: F, fontWeight: 900, fontSize: 70, color: INK, fontVariantNumeric: "tabular-nums", opacity: 0.6 }}>{ms.toFixed(2).replace(".", ",")} s</div>
        <Overlays o={o} />
      </AbsoluteFill>
    );
  }
  const rows: [string, number, string, string][] = [["casi cualquier persona", 0.5, "más lenta", "#9aa6b2"], ["hipopótamo", 0.68, "≈ 30 km/h", RED], ["leona", 0.9, "más rápida… por poco", GOLD]];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#150d08,#080504)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.04], clamp)})` }}>
      <Embers n={18} />
      {rows.map(([n, v, lab, col], i) => {
        const p = ease(f, 10 + i * 14, 50 + i * 14) * v;
        return (
          <div key={i} style={{ position: "absolute", left: 160, top: 300 + i * 200, width: 1600, fontFamily: F }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: INK, marginBottom: 12 }}>{n}</div>
            <div style={{ width: 1300 * p, height: 64, borderRadius: 32, background: col, boxShadow: `0 0 26px ${col}66` }} />
            <div style={{ position: "absolute", left: 1300 * p + 30, top: 62, fontSize: 44, fontWeight: 900, color: col, opacity: ease(f, 40 + i * 14, 50 + i * 14), whiteSpace: "nowrap" }}>{lab}</div>
          </div>
        );
      })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 9. LA POZA vista desde arriba: los lomos aparecen de a uno (10, 20, más) + el tramo del macho dominante
export const PodTop: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const n = Math.min(24, Math.floor(interpolate(f, [6, Math.max(20, d * 0.7)], [1, 24.99], clamp)));
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2e4a40 0%, #1a2e28 55%, #4a3a26 56%, #3a2a1c 100%)" }} />
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 190 + f * 0.8) % 2100) - 100, top: 200 + (i % 6) * 120, width: 120, height: 3, background: "rgba(255,230,190,.14)" }} />)}
      {Array.from({ length: n }).map((_, i) => { const a = i * 2.4, r = 40 + Math.sqrt(i) * 70; const x = 960 + Math.cos(a) * r * 1.5, y = 540 + Math.sin(a) * r * 0.8; const big = i === 0;
        return <div key={i} style={{ position: "absolute", left: x - (big ? 85 : 60), top: y - (big ? 40 : 28), width: big ? 170 : 120, height: big ? 80 : 56, borderRadius: "50%", background: "#141414", boxShadow: `0 -3px 0 ${big ? RED : "#e8833a88"}`, transform: `rotate(${(rnd(i, 5) - 0.5) * 60}deg) translateY(${Math.sin(f / 14 + i) * 3}px)` }} />; })}
      <div style={{ position: "absolute", left: 960 - 330, top: 540 - 200, width: 660, height: 400, borderRadius: "50%", border: `5px dashed ${RED}`, opacity: ease(f, d * 0.6, d * 0.7) * (0.6 + 0.4 * Math.sin(f / 8)) }} />
      <div style={{ position: "absolute", right: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 180, color: ORA, fontVariantNumeric: "tabular-nums" }}>{n >= 21 ? "20+" : n}</div>
      <Overlays o={o} />
    </Push>
  );
};

// ── 10. EL "SUDOR DE SANGRE": la gota sale transparente → roja → marrón con el sol; modo shield: el sol rebota y las bacterias se apagan
export const SweatScene: React.FC<{ d: number; mode?: "drop" | "shield"; o?: Ov }> = ({ d, mode = "drop", o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 10, Math.max(20, d * 0.85));
  const col = p < 0.5 ? `rgba(${200 + p * 60},${230 - p * 340},${235 - p * 380},.9)` : `rgba(${230 - (p - 0.5) * 220},${60 + (p - 0.5) * 40},45,.95)`;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #6a3a1a 0%, #1a0e08 75%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      <div style={{ position: "absolute", left: 1500, top: 90, width: 180, height: 180, borderRadius: 90, background: C.sun, boxShadow: `0 0 120px 40px ${C.glow}` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, bottom: 0, background: "repeating-linear-gradient(170deg,#6e6460 0 50px,#625855 50px 56px)" }} />
      {mode === "drop" && <>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M960,${420 + p * 120} q-90,140 0,200 q90,-60 0,-200 z`} fill={col} stroke="rgba(255,255,255,.6)" strokeWidth={3} /></svg>
        {([["transparente", 0], ["rojo", 0.5], ["marrón", 0.95]] as [string, number][]).map(([t, at], i) => <div key={i} style={{ position: "absolute", left: 300 + i * 480, top: 900, width: 360, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 46, color: p >= at ? (i === 1 ? RED : i === 2 ? ORA : INK) : "rgba(240,235,229,.3)" }}>{t}</div>)}
      </>}
      {mode === "shield" && <>
        {Array.from({ length: 8 }).map((_, i) => { const t = ((f / 30 + i / 8) % 1); return <div key={i} style={{ position: "absolute", left: 1560 - t * 700 + i * 30, top: 180 + t * 500, width: 90, height: 6, background: GOLD, transform: `rotate(${t > 0.95 ? -40 : 35}deg)`, opacity: 1 - t * 0.4 }} />; })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 14, background: RED, boxShadow: `0 0 30px ${RED}` }} />
        {Array.from({ length: 22 }).map((_, i) => { const x = 160 + rnd(i, 3) * 1600, y = 760 + rnd(i, 4) * 260; const dead = ease(f, 20 + i * 3, 30 + i * 3);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 34, height: 18, borderRadius: 9, background: dead > 0.5 ? "#444" : GLOW, opacity: 1 - dead * 0.7, transform: `rotate(${i * 40 + f}deg) scale(${1 - dead * 0.4})` }} />; })}
      </>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 11. EL COCODRILO SE ACERCA, EL MACHO CARGA, EL COCODRILO SE HUNDE
export const CrocScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const wl = 520;
  const come = ease(f, 0, d * 0.35), charge = ease(f, d * 0.35, d * 0.55), dive = ease(f, d * 0.55, d * 0.85);
  return (
    <Push d={d} k={0.05}>
      <SunsetStage tree="acacia" horizon={wl} water pan={0.25}>
        {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1150 + i * 120 - charge * (i === 0 ? 300 : 40), top: wl + 40 + (i % 2) * 40, width: i === 0 ? 210 : 160, height: i === 0 ? 70 : 54, borderRadius: "50% 50% 25% 25%", background: "#121212", boxShadow: "0 -3px 0 #e8833aaa", transform: `translateY(${Math.sin(f / 10 + i) * 3}px)` }} />)}
        {charge > 0 && charge < 1 && <Splash x={1150 - charge * 300} y={wl + 60} t={charge} w={300} />}
        <div style={{ position: "absolute", left: 0, top: dive * 140, width: 1920, height: 1080, opacity: 1 - dive * 0.9 }}><Sil k="croc" x={200 + come * 560 - dive * 200} y={wl + 110} w={520} flip={false} rim="#8fd" /></div>
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ── 12. LA CACERÍA COMO PRESUPUESTO: 4 intentos, 1 sale · modo ledger: cebra = buen negocio, hipopótamo = negocio pésimo
export const HuntOdds: React.FC<{ d: number; mode?: "odds" | "ledger"; o?: Ov }> = ({ d, mode = "odds", o = {} }) => {
  const f = useCurrentFrame();
  if (mode === "ledger") {
    const r1 = ease(f, 8, 18), r2 = ease(f, d * 0.45, d * 0.45 + 10);
    const row = (t: number, name: string, k: string, rows: [string, string][], ok: boolean, y: number) => (
      <div style={{ position: "absolute", left: 220, right: 220, top: y, height: 280, opacity: t, transform: `translateY(${(1 - t) * 30}px)`, borderRadius: 16, border: `3px solid ${ok ? GLOW : RED}`, background: "rgba(255,255,255,.04)", fontFamily: F }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 60, fontWeight: 900, color: INK }}>{name}</div>
        <div style={{ position: "absolute", left: 30, top: 0, width: 400, height: 270 }}><Sil k={k} x={0} y={260} w={k === "zebra" ? 260 : 340} rim={ok ? GLOW : RED} /></div>
        {rows.map(([a, b], i) => <div key={i} style={{ position: "absolute", left: 560, top: 50 + i * 60, fontSize: 38, fontWeight: 700, color: "rgba(240,235,229,.8)" }}>{a}: <b style={{ color: INK }}>{b}</b></div>)}
        <div style={{ position: "absolute", right: 30, top: 190, fontSize: 52, fontWeight: 900, color: ok ? GLOW : RED }}>{ok ? "BUEN NEGOCIO" : "NEGOCIO PÉSIMO"}</div>
      </div>
    );
    return (
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#150d08,#080504)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.04], clamp)})` }}>
        <Embers n={16} />
        <div style={{ position: "absolute", left: 220, top: 70, fontFamily: F, fontWeight: 900, fontSize: 50, letterSpacing: 6, color: "rgba(240,235,229,.6)" }}>CADA CACERÍA ES UN PRESUPUESTO</div>
        {row(r1, "Cebra", "zebra", [["energía", "poca"], ["riesgo", "bajo"]], true, 170)}
        {r2 > 0 && row(r2, "Hipopótamo", "hippo_side", [["energía", "enorme"], ["riesgo", "perder cazadores"]], false, 500)}
        <Overlays o={o} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1a10 0%, #0a0806 75%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      <Embers n={18} />
      {[0, 1, 2, 3].map((i) => { const t = spring({ frame: f - 6 - i * 8, fps: 30, config: { damping: 15 } }), win = i === 2, res = ease(f, 40 + i * 8, 48 + i * 8);
        return <div key={i} style={{ position: "absolute", left: 250 + i * 370, top: 400 + (1 - t) * 60, width: 320, height: 320, borderRadius: 14, opacity: t, border: `3px solid ${res && win ? GLOW : "rgba(255,170,90,.35)"}`, background: "linear-gradient(180deg,#24180f,#4a3020)" }}>
          <Sil k="lion_walk" x={20} y={250} w={280} flip rim={res && win ? GLOW : ORA} op={res && !win ? 0.35 : 1} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 40, color: win ? GLOW : RED, opacity: res }}>{win ? "COME" : "FALLA"}</div>
        </div>; })}
      <BigWord a={Math.round(d * 0.5)} w="1 de cada 4" color={ORA} size={150} y={150} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 13. CUÁNDO GANAN LOS LEONES: fichero de 4 (crías · noche · sequía · enfermos y viejos); active = la actual, los vistos quedan tachados
const WINS = [{ t: "LAS CRÍAS", i: "hippo_calf" }, { t: "LA NOCHE", i: "moon" }, { t: "LA SEQUÍA", i: "sun" }, { t: "ENFERMOS Y VIEJOS", i: "hippo_side" }];
export const WinRoster: React.FC<{ d: number; active?: number; caption?: string; o?: Ov }> = ({ d, active = -1, caption, o = {} }) => {
  const f = useCurrentFrame();
  const W = 360, H = 400, G = 40, X0 = (1920 - (4 * W + 3 * G)) / 2;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 58%, #4a2d18 0%, #140c07 78%)", transform: `scale(${1 + Math.min(f, 600) * 0.00008}) translateX(${Math.sin(f / 70) * 6}px)` }}>
      <Embers />
      {WINS.map((w, i) => {
        const t = spring({ frame: f - i * 4, fps: 30, config: { damping: 16 } });
        const on = i === active, done = active >= 0 && i < active, lit = on ? ease(f, 14, 26) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 380 + (1 - t) * 60, width: W, height: H, opacity: t * (on || active < 0 ? 1 : done ? 0.45 : 0.7), borderRadius: 12, fontFamily: F, textAlign: "center",
            background: "linear-gradient(180deg,#24180f 0%,#4a3020 100%)", border: `3px solid rgba(255,170,90,${0.4 + lit * 0.6})`, boxShadow: `0 0 ${lit * 50}px rgba(255,150,60,${lit * 0.6})`, transform: `scale(${1 + lit * 0.08})` }}>
            <div style={{ marginTop: 26, fontSize: 40, fontWeight: 900, color: on ? ORA : INK }}>{["PRIMERO", "SEGUNDO", "TERCERO", "CUARTO"][i]}</div>
            <div style={{ height: 180, position: "relative", marginTop: 10 }}>
              {w.i === "moon" ? <div style={{ position: "absolute", left: W / 2 - 80, top: 30, width: 120, height: 120, borderRadius: 60, boxShadow: `30px -10px 0 0 ${on ? ORA : "#c9b9a0"}` }} />
                : w.i === "sun" ? <div style={{ position: "absolute", left: W / 2 - 60, top: 30, width: 120, height: 120, borderRadius: 60, background: on ? RED : "#c9a080", boxShadow: `0 0 40px ${on ? RED : "transparent"}` }} />
                  : <Sil k={w.i} x={W / 2 - (w.i === "hippo_calf" ? 110 : 140)} y={170} w={w.i === "hippo_calf" ? 220 : 280} rim={on ? ORA : "#a07050"} />}
            </div>
            <div style={{ marginTop: 20, fontSize: w.t.length > 10 ? 30 : 38, fontWeight: 900, color: INK, padding: "0 10px" }}>{on || done || active < 0 ? w.t : "?"}</div>
            {done && <div style={{ position: "absolute", left: 20, right: 20, top: 150, height: 8, background: RED, transform: "rotate(-12deg)", borderRadius: 4 }} />}
          </div>
        );
      })}
      {caption && <Build a={20} lines={[caption]} y={130} size={90} />}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 14. MAPA DE ÁFRICA (tierra ocre plana) con pin que late y el nombre del lugar
const AF = { L: -22, R: 58, T: 38, B: -36, W: 1167, H: 1080 };
export const AfricaPin: React.FC<{ d: number; at: [number, number]; name: string; sub?: string; o?: Ov }> = ({ d, at, name, sub, o = {} }) => {
  const f = useCurrentFrame();
  const X = 160, x = X + (at[0] - AF.L) / (AF.R - AF.L) * AF.W, y = (AF.T - at[1]) / (AF.T - AF.B) * AF.H;
  const z = interpolate(f, [0, Math.max(d, 2)], [1, 1.12], clamp), pin = ease(f, 10, 20);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #12304a 0%, #07131f 75%)" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${x}px ${y}px` }}>
        <Img src={sf("img/t30colmies/map_africa.png")} style={{ position: "absolute", left: X, top: 0, width: AF.W, height: AF.H }} />
        {[0, 1, 2].map((k) => { const t = ((f / 30 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: x - 20 - t * 70, top: y - 20 - t * 70, width: 40 + t * 140, height: 40 + t * 140, borderRadius: "50%", border: `4px solid ${RED}`, opacity: (1 - t) * pin }} />; })}
        <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: RED, opacity: pin, boxShadow: `0 0 30px ${RED}` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1360, top: 420, fontFamily: F, fontWeight: 900, fontSize: 84, color: INK, opacity: ease(f, 14, 24), lineHeight: 1.05, width: 520 }}>{name}</div>
      {sub && <div style={{ position: "absolute", left: 1364, top: 640, fontFamily: F, fontWeight: 700, fontSize: 40, color: ORA, opacity: ease(f, 24, 34), width: 520 }}>{sub}</div>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// ── 15. LA HERIDA = HAMBRE (versión gris "apagada"): el león renguea; burbuja sobre la cabeza tachada (comer / cazar / hospital)
const BubbleIcon: React.FC<{ k: string }> = ({ k }) => {
  const st = { fill: "none", stroke: "#1b1d22", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (k === "jaw") return <svg width={110} height={90} viewBox="0 0 110 90"><path d="M10,30 L90,20 Q104,20 100,34 L20,44 Z" {...st} /><path d="M14,52 L96,52 Q104,64 92,72 L22,72 Z" {...st} /><path d="M40,40 l4,10 M60,38 l4,12" {...st} /></svg>;
  if (k === "paw") return <svg width={110} height={90} viewBox="0 0 110 90"><ellipse cx={55} cy={60} rx={24} ry={18} {...st} />{[[24, 30], [44, 18], [66, 18], [86, 30]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={11} {...st} />)}</svg>;
  return <svg width={110} height={90} viewBox="0 0 110 90"><rect x={14} y={14} width={82} height={62} rx={10} {...st} /><path d="M55,28 L55,62 M38,45 L72,45" {...st} stroke={RED} /></svg>;
};
export const HurtScene: React.FC<{ d: number; mode?: "jaw" | "paw" | "hospital"; o?: Ov }> = ({ d, mode = "jaw", o = {} }) => {
  const f = useCurrentFrame();
  const b = ease(f, 10, 20), mx = ease(f, 0, d) * 220;
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ filter: "grayscale(.85) brightness(.75)" }}>
        <SunsetStage tree="acacia" night={0.3} pan={0.15}>
          <Sil k="lion_walk" x={560 + mx} y={840} w={520} flip bob={4} />
        </SunsetStage>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 + mx, top: 330, width: 200, height: 160, borderRadius: 80, background: "rgba(250,248,244,.95)", opacity: b, transform: `scale(${0.7 + 0.3 * b})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BubbleIcon k={mode} />
        <svg width={200} height={160} style={{ position: "absolute", inset: 0 }}><line x1={40} y1={130} x2={160} y2={30} stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={ease(f, 22, 30)} /></svg>
        <div style={{ position: "absolute", left: 30, bottom: -26, width: 30, height: 30, borderRadius: 15, background: "rgba(250,248,244,.95)" }} />
        <div style={{ position: "absolute", left: 6, bottom: -50, width: 16, height: 16, borderRadius: 8, background: "rgba(250,248,244,.95)" }} />
      </div>
      <Overlays o={o} />
    </Push>
  );
};

// ── 16. PERSONAS POR AÑO: la grilla se llena de figuritas (cientos)
export const PeopleGrid: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const N = 120, on = Math.floor(interpolate(f, [10, Math.max(20, d * 0.75)], [0, N], clamp));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1a1210 0%, #070505 75%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>
      {Array.from({ length: N }).map((_, i) => { const r = Math.floor(i / 20), c = i % 20, lit = i < on;
        return <svg key={i} width={50} height={80} viewBox="0 0 70 110" style={{ position: "absolute", left: 400 + c * 56, top: 440 + r * 90, opacity: lit ? 1 : 0.25 }}><circle cx={35} cy={22} r={16} fill={lit ? RED : "#d9cfc0"} /><rect x={17} y={42} width={36} height={60} rx={14} fill={lit ? RED : "#d9cfc0"} /></svg>; })}
      <BigWord a={20} w="CIENTOS" color={RED} size={170} y={130} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 44, color: INK, opacity: ease(f, 30, 40) }}>de personas por año (estimación)</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
