// Mercado.tsx — kit de hue14b (naranjas dulces). Puro CSS y DOM con materiales de la frutería:
// cajas de pino para fruta, etiqueta litografiada, pizarrón de banqueta con gis, papel de seda, engomados de fruta, sello de goma.
// Sin SVG, sin grano, sin viñeta, sin blur grande.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS, hash } from "./Piezas";

const { SERIF, SANS } = FONTS;
export const M = { pine: "#D8B783", pineD: "#B48D57", ink: "#2A1F17", orange: "#E2792A", chalk: "#F1EEE4", board: "#2E3A33", stamp: "#B5352A", paper: "#F4E9D2" };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const eo = Easing.out(Easing.cubic);
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sp = (f: number, d = 14, m = 0.8) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const outF = (f: number, dur: number, len = 10) => interpolate(f, [dur - len, dur], [1, 0], CL);
const seg = (f: number, a: number, b: number, e = io) => interpolate(f, [a, b], [0, 1], { ...CL, easing: e });

// ---------- materiales
const PINE: React.CSSProperties = {
  backgroundColor: M.pine,
  backgroundImage: "repeating-linear-gradient(90deg, rgba(120,80,35,0.13) 0 1px, transparent 1px 13px, rgba(255,240,205,0.12) 13px 15px, transparent 15px 31px), linear-gradient(180deg, rgba(255,235,195,0.25), rgba(90,60,25,0.18))",
};
const BOARD: React.CSSProperties = {
  backgroundColor: M.board,
  backgroundImage: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.07), transparent 55%), repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 11px), radial-gradient(ellipse at 75% 80%, rgba(255,255,255,0.05), transparent 50%)",
};
const PAPER: React.CSSProperties = {
  backgroundColor: M.paper,
  backgroundImage: "repeating-linear-gradient(0deg, rgba(120,90,50,0.05) 0 1px, transparent 1px 4px), radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.5), transparent 60%)",
};
const SEDA: React.CSSProperties = {
  backgroundColor: M.orange,
  backgroundImage: "linear-gradient(103deg, rgba(255,255,255,0.18) 0 8%, transparent 8% 22%, rgba(120,40,0,0.14) 22% 27%, transparent 27% 48%, rgba(255,255,255,0.12) 48% 51%, transparent 51% 72%, rgba(120,40,0,0.12) 72% 76%, transparent 76%), linear-gradient(12deg, rgba(255,230,190,0.16) 0 30%, transparent 30% 62%, rgba(110,35,0,0.1) 62%)",
};
const CHALK = "0 0 1px rgba(241,238,228,0.9), 0 0 6px rgba(241,238,228,0.25)";
const TXTSH = "0 2px 12px rgba(0,0,0,0.65)";

// texto de gis que se escribe de izquierda a derecha (máscara que avanza)
const Gis: React.FC<{ t: string; f0: number; len?: number; size: number; font?: string; w?: number; color?: string; style?: React.CSSProperties }> = ({ t, f0, len = 14, size, font = SANS, color = M.chalk, style }) => {
  const f = useCurrentFrame(); const p = seg(f, f0, f0 + len, Easing.linear);
  if (p <= 0) return null;
  return (
    <div style={{ position: "relative", fontFamily: font, fontSize: size, color, textShadow: CHALK, whiteSpace: "nowrap", WebkitMaskImage: `linear-gradient(90deg, #000 ${p * 100}%, transparent ${p * 100 + 4}%)`, maskImage: `linear-gradient(90deg, #000 ${p * 100}%, transparent ${p * 100 + 4}%)`, ...style }}>{t}</div>
  );
};

// ---------- foto con cámara lenta y balanceo de mano (sin temblor)
export const Foto: React.FC<{ src: string; seed: number; dur: number; zoom?: [number, number]; o?: [number, number] }> = ({ src, seed, dur, zoom, o }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const inn = hash(seed) % 2 === 0;
  const [z0, z1] = zoom ?? (inn ? [1.04, 1.13] : [1.13, 1.04]);
  const z = lerp(z0, z1, Easing.inOut(Easing.sin)(t));
  const sx = Math.sin(f / 61 + seed) * 6, sy = Math.cos(f / 77 + seed * 2) * 4, r = Math.sin(f / 95 + seed) * 0.25;
  const ox = o ? o[0] : 35 + (hash(seed + 5) % 30), oy = o ? o[1] : 35 + (hash(seed + 7) % 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: M.ink }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${sx}px, ${sy}px) rotate(${r}deg) scale(${z})`, transformOrigin: `${ox}% ${oy}%` }} />
    </AbsoluteFill>
  );
};
export const Video: React.FC<{ src: string; seed: number; dur: number; clipDur?: number; volume?: number; minRate?: number }> = ({ src, seed, dur, clipDur, volume = 0, minRate = 0.75 }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const rate = clipDur && clipDur < dur / 30 + 0.1 ? Math.max(minRate, (clipDur - 0.15) / (dur / 30)) : 1;
  const z = hash(seed) % 2 ? lerp(1.03, 1.08, t) : lerp(1.08, 1.03, t);
  const sx = Math.sin(f / 61 + seed) * 5, sy = Math.cos(f / 77 + seed) * 3;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: M.ink }}>
      <OffthreadVideo src={staticFile(src)} muted={volume === 0} volume={volume} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${sx}px, ${sy}px) scale(${z})` }} />
    </AbsoluteFill>
  );
};

// ---------- (4) avatar: punch-in hacia la cara y corrimiento a la izquierda para el 50/50
export const AvatarM: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[] }> = ({ src, seed, dur, mods = [] }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  let z = hash(seed + 99) % 3 !== 0 ? 1.03 + 0.05 * t : 1.08 - 0.05 * t, tx = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: io });
    if (m.k === "punch") z *= 1 + 0.13 * w;
    if (m.k === "split") { z *= 1 + 0.1 * w; tx += -14 * w; }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: M.ink }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "43% 28%" }} />
    </AbsoluteFill>
  );
};
// 50/50: la foto sube desde abajo dentro del hueco de una caja de pino (tablas arriba y abajo)
export const SplitCaja: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 16, dur - 12, dur], [0, 1, 1, 0], { ...CL, easing: io });
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 900, transform: `translateY(${(1 - p) * 110}%)` }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><Foto src={src} seed={seed} dur={dur} /></div>
      <div style={{ position: "absolute", left: -30, top: 0, bottom: 0, width: 30, ...PINE, boxShadow: "-12px 0 30px rgba(0,0,0,0.45)" }} />
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: -30, right: 0, [k ? "bottom" : "top"]: 0, height: 26, ...PINE, boxShadow: "0 4px 10px rgba(0,0,0,0.35)" } as React.CSSProperties} />)}
    </div>
  );
};
// foto del recuerdo pegada con dos tiras de cinta de papel sobre el vidrio, junto al avatar
const Cinta: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 150, height: 40, background: "rgba(236,222,190,0.86)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", clipPath: "polygon(2% 8%, 98% 0, 100% 92%, 0 100%)", ...style }} />
);
export const FotoCinta: React.FC<{ src: string; caption: string; dur: number; seed?: number }> = ({ src, caption, dur, seed = 1 }) => {
  const f = useCurrentFrame(); const o = outF(f, dur, 10);
  const press = seg(f, 0, 10, eo); const r = (hash(seed) % 2 ? 1 : -1) * 2.5;
  const z = lerp(1.22, 1, press), sh = lerp(70, 22, press);
  return (
    <AbsoluteFill style={{ opacity: o * cl(f / 4, 0, 1) }}>
      <div style={{ position: "absolute", left: 1270, top: 130, width: 540, transform: `rotate(${r}deg) scale(${z})`, transformOrigin: "50% 40%" }}>
        <div style={{ background: "#FBF6EA", padding: 18, boxShadow: `0 ${sh * 0.5}px ${sh}px rgba(0,0,0,0.45)` }}>
          <Img src={staticFile(src)} style={{ width: 504, height: 400, objectFit: "cover", display: "block" }} />
          <div style={{ fontFamily: SERIF, fontSize: 42, color: M.ink, textAlign: "center", paddingTop: 14 }}>{caption}</div>
        </div>
        <Cinta style={{ left: -40, top: -12, transform: "rotate(-28deg)" }} />
        <Cinta style={{ right: -40, top: -12, transform: "rotate(26deg)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- (5) transición de capítulo: una hoja de papel de seda naranja cruza en diagonal, como al envolver la fruta
export const Seda: React.FC<{ dir?: number; len?: number }> = ({ dir = 1, len = 20 }) => {
  const f = useCurrentFrame();
  if (f > len) return null;
  const p = interpolate(f, [0, len], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
  const x = lerp(0, -160, p) * dir, rot = lerp(-4, -14, p) * dir;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-30%", top: "-30%", width: "160%", height: "160%", transform: `translateX(${x}%) rotate(${rot}deg)`, ...SEDA, opacity: 0.97, boxShadow: "0 0 60px rgba(90,30,0,0.4)" }} />
    </AbsoluteFill>
  );
};

// ---------- caja de fruta con etiqueta litografiada (muro, recap, CTA)
const Caja: React.FC<{ n: number; title: string; src: string; w: number; pegada?: number; dim?: number; kicker?: string }> = ({ n, title, src, w, pegada = 1, dim = 0, kicker }) => {
  const h = w * 0.62;
  const lw = w * 0.74, lh = h * 0.74;
  return (
    <div style={{ width: w, height: h, position: "relative", boxShadow: "0 22px 40px rgba(0,0,0,0.5)" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: k * h * 0.34, height: h * 0.3, ...PINE, borderRadius: 2, boxShadow: "inset 0 -3px 0 rgba(90,60,25,0.25)" }} />)}
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", top: -h * 0.03, bottom: -h * 0.03, [k ? "right" : "left"]: -w * 0.02, width: w * 0.06, ...PINE, filter: "brightness(0.88)", boxShadow: "0 3px 8px rgba(0,0,0,0.35)" } as React.CSSProperties} />)}
      <div style={{ position: "absolute", left: (w - lw) / 2, top: (h - lh) / 2, width: lw, height: lh, ...PAPER, border: `${w * 0.008}px solid ${M.stamp}`, outline: `${w * 0.004}px solid ${M.stamp}`, outlineOffset: -w * 0.018, display: "flex", padding: w * 0.03, gap: w * 0.03, boxSizing: "border-box",
        opacity: pegada, transform: `scale(${lerp(1.18, 1, pegada)}) rotate(${lerp(-5, ((hash(n) % 5) - 2) * 0.6, pegada)}deg)`, filter: dim ? `saturate(${1 - 0.7 * dim}) brightness(${1 - 0.35 * dim})` : undefined }}>
        <div style={{ width: lh - w * 0.06, height: lh - w * 0.06, overflow: "hidden", flexShrink: 0, borderRadius: "50%", border: `${w * 0.006}px solid ${M.stamp}` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.04, letterSpacing: w * 0.008, color: M.stamp }}>{kicker ?? `COSA ${n}`}</div>
          <div style={{ fontFamily: SERIF, fontSize: w * 0.062, lineHeight: 1.04, color: M.ink, marginTop: w * 0.01 }}>{title}</div>
        </div>
      </div>
    </div>
  );
};
export type Card = { title: string; src: string };
const WALL = { W: 330, gx: 350, gy: 222, x0: 960 - 350 * 2 - 165, y0: 300 };
const wallXY = (i: number) => ({ x: WALL.x0 + (i % 5) * WALL.gx, y: WALL.y0 + Math.floor(i / 5) * WALL.gy });
const Bodega: React.CSSProperties = { backgroundColor: "#3a2a1e", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 3px, transparent 3px 180px), linear-gradient(180deg, #4a3526, #2c2017)" };

// (1) carrusel: la cámara arranca pegada a la caja 1 y se aleja por el muro de cajas; cada etiqueta se pega cuando entra en cuadro
export const MuroCajas: React.FC<{ cards: Card[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame();
  const p = seg(f, 4, dur - 14, Easing.inOut(Easing.quad));
  const c1 = wallXY(0); const cx0 = c1.x + WALL.W / 2, cy0 = c1.y + WALL.W * 0.31;
  const z = lerp(3.1, 1, p), cx = lerp(cx0, 960, p), cy = lerp(cy0, 520, p);
  const o = outF(f, dur, 10);
  return (
    <AbsoluteFill style={{ ...Bodega, overflow: "hidden", opacity: o }}>
      <AbsoluteFill style={{ transform: `translate(${960 - cx}px, ${540 - cy}px) scale(${z})`, transformOrigin: `${cx}px ${cy}px` }}>
        {cards.map((c, i) => {
          const { x, y } = wallXY(i);
          const vis = (Math.abs(x + WALL.W / 2 - cx) * z < 1100) && (Math.abs(y - cy) * z < 700);
          const pf = Math.round(4 + (dur - 18) * Math.min(1, (i / 9) * 0.85)); // momento en que entra en cuadro
          const peg = i === 0 ? sp(f - 2, 13) : vis || f > pf ? sp(f - pf, 13) : 0;
          return <div key={i} style={{ position: "absolute", left: x, top: y }}><Caja n={i + 1} title={c.title} src={c.src} w={WALL.W} pegada={peg} /></div>;
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", opacity: seg(f, dur * 0.55, dur * 0.55 + 12) }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 12, color: M.chalk, textShadow: TXTSH }}>LAS 10 COSAS</span>
      </div>
    </AbsoluteFill>
  );
};

// (10) recap: el muro de cajas; la caja del número dicho sale del muro hacia la cámara y al lado se escribe con gis en un pizarrón
export const RecapCajas: React.FC<{ n: number; cards: Card[]; lines: string[]; dur: number }> = ({ n, cards, lines, dur }) => {
  const f = useCurrentFrame();
  const sel = n > 0 ? sp(f - 3, 16) : 0;
  return (
    <AbsoluteFill style={{ ...Bodega, overflow: "hidden" }}>
      {cards.map((c, i) => {
        const k = i + 1; const { x, y } = wallXY(i); const isSel = k === n;
        const enter = n === 0 ? sp(f - i * 2, 15) : 1;
        const tx = isSel ? lerp(x, 90, sel) : x, ty = isSel ? lerp(y, 330, sel) : y, sc = isSel ? lerp(1, 2.0, sel) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", zIndex: isSel ? 5 : 1, transform: `translate(${tx}px, ${ty}px) scale(${sc})` }}>
            <Caja n={k} title={c.title} src={c.src} w={WALL.W} pegada={enter} dim={n > 0 && !isSel ? 0.75 * sel : 0} />
          </div>
        );
      })}
      {n > 0 && (
        <div style={{ position: "absolute", zIndex: 20, left: 800, top: 140, width: 1040, height: 800, ...BOARD, border: "22px solid", borderColor: M.pineD, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", padding: "50px 60px", boxSizing: "border-box", transform: `translateX(${(1 - sp(f - 8, 16)) * 1300}px)` }}>
          <Gis t={`${n} DE 10`} f0={16} len={8} size={34} style={{ letterSpacing: 8, fontWeight: 600, color: M.orange }} />
          <Gis t={cards[n - 1]?.title ?? ""} f0={22} len={16} size={82} font={SERIF} style={{ marginTop: 10, whiteSpace: "normal" }} />
          <div style={{ height: 3, margin: "26px 0 8px", background: "rgba(241,238,228,0.35)", width: `${seg(f, 36, 46) * 100}%` }} />
          {lines.map((l, i) => <Gis key={i} t={"— " + l} f0={44 + i * 18} len={16} size={42} style={{ marginTop: 22, whiteSpace: "normal" }} />)}
        </div>
      )}
      {n === 0 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: SERIF, fontSize: 70, color: M.chalk, textShadow: TXTSH, opacity: seg(f, 26, 38) }}>las diez, en orden</div>}
    </AbsoluteFill>
  );
};

// (3) apertura de cada cosa: pizarrón de banqueta (de dos patas) que se asienta en el piso de la foto meciéndose y se escribe con gis
export const Caballete: React.FC<{ n: number; title: string; img: string; dur: number }> = ({ n, title, img, dur }) => {
  const f = useCurrentFrame();
  const slide = sp(f - 1, 15, 0.9);
  const rock = f < 8 ? 0 : 3.2 * Math.exp(-(f - 8) / 9) * Math.sin((f - 8) / 3.2);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={n * 11 + 3} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,14,8,0.5) 0%, rgba(20,14,8,0.12) 45%, transparent 65%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: -20, width: 760, height: 900, transformOrigin: "50% 100%", transform: `translateX(${(1 - slide) * -1000}px) rotate(${rock}deg)` }}>
        {/* patas */}
        <div style={{ position: "absolute", left: 40, bottom: 0, width: 34, height: 860, ...PINE, transform: "rotate(-4deg)", transformOrigin: "50% 100%" }} />
        <div style={{ position: "absolute", right: 40, bottom: 0, width: 34, height: 860, ...PINE, transform: "rotate(4deg)", transformOrigin: "50% 100%" }} />
        <div style={{ position: "absolute", left: 0, top: 70, width: 760, height: 560, ...BOARD, border: "24px solid", borderColor: M.pineD, boxSizing: "border-box", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", padding: "58px 54px" }}>
          <Gis t={`COSA ${n} DE 10`} f0={10} len={10} size={40} style={{ letterSpacing: 9, fontWeight: 600, color: M.orange }} />
          <Gis t={title} f0={18} len={20} size={88} font={SERIF} style={{ marginTop: 18, whiteSpace: "normal", lineHeight: 1.04 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// (2) progreso: etiqueta de precio de cartulina naranja que baja abatiéndose desde arriba a la derecha, con las 10 naranjitas
export const Etiqueta: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame(); const o = outF(f, dur, 12);
  const flip = sp(f, 13, 0.8);
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1200 }}>
      <div style={{ position: "absolute", right: 70, top: 0, width: 440, transformOrigin: "50% 0", transform: `rotateX(${lerp(-95, 0, flip)}deg)` }}>
        <div style={{ position: "absolute", left: 219, top: 0, width: 2, height: 40, background: "#3b2a1c" }} />
        <div style={{ marginTop: 40, background: M.orange, backgroundImage: SEDA.backgroundImage as string, padding: "20px 28px 22px", boxShadow: "0 18px 30px rgba(0,0,0,0.4)", clipPath: "polygon(8% 0, 92% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)" }}>
          <div style={{ position: "absolute", left: 210, top: 10, width: 20, height: 20, borderRadius: "50%", background: "rgba(40,20,5,0.55)" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
            <span style={{ fontFamily: SERIF, fontSize: 74, color: M.paper, lineHeight: 1 }}>{n}</span>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "rgba(244,233,210,0.85)" }}>/ 10</span>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: M.paper, marginTop: 4 }}>{title}</div>
          <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
            {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: i < n ? M.paper : "rgba(60,25,5,0.35)", transform: `scale(${i === n - 1 ? 0.6 + 0.4 * sp(f - 14, 9) : 1})` }} />)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// libro: el libro sobre la tapa de una caja; separadores de papel de seda naranja salen del canto con la página
export const LibroCaja: React.FC<{ src: string; tabs: { p: string; t: string; f: number }[]; dur: number }> = ({ src, tabs, dur }) => {
  const f = useCurrentFrame(); const o = outF(f, dur, 10);
  const enter = sp(f - 2, 15); const z = lerp(1.0, 1.06, f / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ ...PINE, overflow: "hidden", opacity: o }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(70,45,15,0.35) 0 4px, transparent 4px 270px)" }} />
      <div style={{ position: "absolute", left: 300, top: 120, width: 600, transform: `translateY(${(1 - enter) * 900}px) rotate(-3deg) scale(${z})` }}>
        {tabs.map((b, i) => {
          const p = sp(f - b.f, 13);
          return (
            <div key={i} style={{ position: "absolute", right: -300 * p + 40, top: 110 + i * 190, width: 340, height: 120, background: M.orange, backgroundImage: SEDA.backgroundImage as string, boxShadow: "0 8px 16px rgba(0,0,0,0.3)", padding: "16px 22px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: M.paper, letterSpacing: 3 }}>PÁG. {b.p}</div>
            </div>
          );
        })}
        <Img src={staticFile(src)} style={{ width: 600, display: "block", position: "relative", boxShadow: "0 40px 70px rgba(0,0,0,0.5)" }} />
      </div>
      {tabs.map((b, i) => {
        const p = seg(f, b.f + 6, b.f + 16);
        return p > 0 && <div key={i} style={{ position: "absolute", left: 1260, top: 250 + i * 190, width: 600, fontFamily: SERIF, fontSize: 52, lineHeight: 1.08, color: M.ink, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>{b.t}</div>;
      })}
    </AbsoluteFill>
  );
};

// mapa: hilo rojo de un alfiler al otro sobre el mapa real de la foto
export const MapaHilo: React.FC<{ img: string; a: { x: number; y: number; t: string }; b: { x: number; y: number; t: string }; fA: number; fB: number; dur: number }> = ({ img, a, b, fA, fB, dur }) => {
  const f = useCurrentFrame();
  const L = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  const pA = sp(f - fA, 10), pB = sp(f - fB - 4, 10), line = seg(f, fA + 6, fB + 4);
  const camZ = lerp(1.0, 1.14, seg(f, 0, dur)), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
  const Pin = ({ x, y, p, t }: { x: number; y: number; p: number; t: string }) => (
    <>
      <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #f08a7e, ${M.stamp} 60%, #6d1a12)`, boxShadow: `0 ${lerp(30, 4, p)}px ${lerp(20, 4, p)}px rgba(0,0,0,0.45)`, transform: `translateY(${(1 - p) * -60}px) scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 3, 0, 1) }} />
      <div style={{ position: "absolute", left: x + 30, top: y - 34, fontFamily: SERIF, fontSize: 48, color: M.ink, opacity: cl(p * 2 - 0.6, 0, 1), background: "rgba(244,233,210,0.92)", padding: "4px 16px", boxShadow: "0 6px 14px rgba(0,0,0,0.25)" }}>{t}</div>
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${camZ})`, transformOrigin: `${cx}px ${cy}px` }}>
        <Img src={staticFile(img)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        <div style={{ position: "absolute", left: a.x, top: a.y - 2, width: L * line, height: 4, background: M.stamp, transformOrigin: "0 50%", transform: `rotate(${ang}deg)`, boxShadow: "0 3px 3px rgba(0,0,0,0.3)" }} />
        <Pin x={a.x} y={a.y} p={pA} t={a.t} />
        <Pin x={b.x} y={b.y} p={pB} t={b.t} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (8) recuerdo: la foto del recuerdo y una etiqueta de caja antigua que se desenrolla hacia abajo con la frase
export const Recuerdo: React.FC<{ img: string; head: string; quote?: string; who?: string; fQuote?: number; dur: number }> = ({ img, head, quote, who, fQuote = 12, dur }) => {
  const f = useCurrentFrame();
  const un = seg(f, fQuote, fQuote + 16, eo);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={7} dur={dur} zoom={[1.02, 1.1]} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(20,14,8,0.55), transparent 45%)" }} />
      <div style={{ position: "absolute", left: 80, bottom: 70, fontFamily: SERIF, fontSize: 56, color: M.paper, textShadow: TXTSH, opacity: seg(f, 4, 14) }}>{head}</div>
      {quote && (
        <div style={{ position: "absolute", right: 110, top: 0, width: 720, height: 560 * un, overflow: "hidden", transformOrigin: "50% 0" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 560, ...PAPER, border: `6px solid ${M.stamp}`, outline: `2px solid ${M.stamp}`, outlineOffset: -18, boxSizing: "border-box", padding: "70px 60px", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
            <div style={{ fontFamily: SERIF, fontSize: 60, lineHeight: 1.12, color: M.ink }}>«{quote}»</div>
            {who && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 5, color: M.stamp, marginTop: 30 }}>{who}</div>}
          </div>
          {/* el rollo que todavía no se desenrolló */}
          <div style={{ position: "absolute", left: -6, right: -6, bottom: 0, height: 34, borderRadius: 17, ...PAPER, boxShadow: "0 8px 14px rgba(0,0,0,0.4), inset 0 -6px 8px rgba(120,90,50,0.35)", opacity: un < 0.98 ? 1 : 0 }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// engomados de fruta que se pegan sobre la foto, en el lugar exacto de lo que se nombra
export type Peg = { x: number; y: number; t: string; sub?: string; f: number; r?: number };
export const Engomados: React.FC<{ img: string; items: Peg[]; seed: number; dur: number; zoom?: [number, number]; o?: [number, number] }> = ({ img, items, seed, dur, zoom, o }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={seed} dur={dur} zoom={zoom ?? [1.0, 1.05]} o={o} />
      {items.map((m, i) => {
        const p = seg(f, m.f, m.f + 7, eo); if (p <= 0) return null;
        const r = m.r ?? ((hash(seed + i) % 13) - 6);
        const d = 210 + (m.t.length > 9 ? 30 : 0);
        return (
          <div key={i} style={{ position: "absolute", left: m.x - d / 2, top: m.y - d / 2, width: d, height: d, borderRadius: "50%", background: M.paper, border: `8px solid ${M.orange}`, boxSizing: "border-box",
            boxShadow: `0 ${lerp(26, 5, p)}px ${lerp(30, 8, p)}px rgba(0,0,0,${lerp(0.25, 0.45, p)})`, transform: `scale(${lerp(1.35, 1, p)}) rotate(${r + (1 - p) * 20}deg)`, opacity: cl(p * 2.5, 0, 1),
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 18 }}>
            <div style={{ fontFamily: SERIF, fontSize: m.t.length > 9 ? 36 : 46, lineHeight: 1.0, color: M.ink }}>{m.t}</div>
            {m.sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: 2, color: M.orange, marginTop: 8 }}>{m.sub}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// pizarrón de banqueta al costado de la foto: los renglones se escriben con gis sobre la palabra
export const Pizarron: React.FC<{ img: string; head: string; lines: { t: string; f: number }[]; seed: number; dur: number; foot?: string }> = ({ img, head, lines, seed, dur, foot }) => {
  const f = useCurrentFrame();
  const in_ = sp(f - 2, 16); const o = outF(f, dur, 8);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${in_ * 300}px)` }}><Foto src={img} seed={seed} dur={dur} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 880, transform: `translateX(${(1 - in_) * -900}px)`, ...BOARD, borderRight: `26px solid ${M.pineD}`, boxShadow: "16px 0 40px rgba(0,0,0,0.5)", padding: "110px 70px", boxSizing: "border-box", opacity: o }}>
        <Gis t={head} f0={8} len={10} size={36} style={{ letterSpacing: 8, fontWeight: 600, color: M.orange }} />
        <div style={{ height: 3, margin: "22px 0 16px", background: "rgba(241,238,228,0.3)", width: `${seg(f, 16, 26) * 100}%` }} />
        {lines.map((l, i) => <Gis key={i} t={l.t} f0={l.f} len={Math.min(18, 6 + l.t.length * 0.5)} size={l.t.length > 26 ? 50 : 60} font={SERIF} style={{ marginTop: 26, whiteSpace: "normal", lineHeight: 1.1 }} />)}
        {foot && <Gis t={foot} f0={Math.max(20, (lines[lines.length - 1]?.f ?? 20) + 20)} len={12} size={28} style={{ position: "absolute", left: 70, bottom: 80, color: "rgba(241,238,228,0.75)" }} />}
      </div>
    </AbsoluteFill>
  );
};

// calendario: los 12 meses escritos con gis en un pizarrón cuadriculado, el pizarrón colgado sobre la foto del patio
export const PizarronMeses: React.FC<{ img: string; foot: string; dur: number }> = ({ img, foot, dur }) => {
  const f = useCurrentFrame();
  const MES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const drop = sp(f - 1, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={23} dur={dur} />
      <div style={{ position: "absolute", left: 160, top: 120, width: 1000, height: 760, ...BOARD, border: `24px solid ${M.pineD}`, boxSizing: "border-box", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transform: `translateY(${(1 - drop) * -1000}px)`, padding: "50px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: 150, borderLeft: "2px solid rgba(241,238,228,0.3)", borderTop: "2px solid rgba(241,238,228,0.3)" }}>
          {MES.map((m, i) => (
            <div key={i} style={{ borderRight: "2px solid rgba(241,238,228,0.3)", borderBottom: "2px solid rgba(241,238,228,0.3)", padding: 16 }}>
              <Gis t={m} f0={8 + i * 3} len={6} size={40} style={{ fontWeight: 600, letterSpacing: 4, color: i % 3 === 0 ? M.orange : M.chalk }} />
            </div>
          ))}
        </div>
        <Gis t={foot} f0={48} len={14} size={40} font={SERIF} style={{ marginTop: 30 }} />
      </div>
    </AbsoluteFill>
  );
};

// mitos: cada remedio que no sirve recibe un golpe de sello de goma sobre la foto, en el lugar del objeto
export type Sello = { x: number; y: number; t: string; f: number; r?: number };
export const Sellos: React.FC<{ img: string; items: Sello[]; dur: number; zoomTo?: { x: number; y: number } }> = ({ img, items, dur, zoomTo }) => {
  const f = useCurrentFrame();
  const z = zoomTo ? lerp(1.0, 1.18, seg(f, 0, dur)) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: zoomTo ? `${zoomTo.x}px ${zoomTo.y}px` : "50% 50%" }}>
        <Img src={staticFile(img)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        {items.map((s, i) => {
          if (f < s.f) return null;
          const hit = seg(f, s.f, s.f + 4, Easing.in(Easing.quad));
          const r = s.r ?? (i % 2 ? 7 : -8);
          return (
            <div key={i} style={{ position: "absolute", left: s.x, top: s.y, transform: `translate(-50%, -50%) rotate(${r}deg) scale(${lerp(1.5, 1, hit)})`, opacity: lerp(0, 0.92, hit),
              border: `7px solid ${M.stamp}`, padding: "10px 26px", fontFamily: SANS, fontWeight: 600, fontSize: 56, letterSpacing: 6, color: M.stamp, whiteSpace: "nowrap",
              WebkitMaskImage: "repeating-linear-gradient(37deg, #000 0 9px, rgba(0,0,0,0.72) 9px 12px), repeating-linear-gradient(-61deg, #000 0 15px, rgba(0,0,0,0.8) 15px 17px)", mixBlendMode: "multiply" }}>{s.t}</div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// dato con fuente: tabla de caja estarcida (letras de plantilla) que entra de costado, con la fuente abajo
export const Estarcido: React.FC<{ img: string; quote: string; source: string; dur: number }> = ({ img, quote, source, dur }) => {
  const f = useCurrentFrame();
  const in_ = sp(f - 2, 15); const spray = seg(f, 10, 30, Easing.linear);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={31} dur={dur} />
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 80, height: 330, ...PINE, boxShadow: "0 24px 50px rgba(0,0,0,0.5)", transform: `translateX(${(1 - in_) * -2000}px)`, padding: "44px 60px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.1, color: M.ink, opacity: 0.88, WebkitMaskImage: `linear-gradient(90deg, #000 ${spray * 100}%, transparent ${spray * 100 + 6}%)` }}>{quote}</div>
        <div style={{ position: "absolute", left: 60, bottom: 36, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: M.stamp, opacity: seg(f, 32, 42) }}>{source}</div>
      </div>
    </AbsoluteFill>
  );
};

// pregunta de los comentarios: una bolsa de papel de estraza de la frutería entra y la pregunta está escrita en ella
export const Bolsa: React.FC<{ img: string; n: number; text: string; dur: number }> = ({ img, n, text, dur }) => {
  const f = useCurrentFrame();
  const up = sp(f - 2, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={41 + n} dur={dur} />
      <AbsoluteFill style={{ background: "rgba(20,14,8,0.25)" }} />
      <div style={{ position: "absolute", left: 560, top: 150, width: 800, height: 760, transform: `translateY(${(1 - up) * 1000}px) rotate(${n % 2 ? 2 : -2}deg)` }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#B88E5C", backgroundImage: "repeating-linear-gradient(90deg, rgba(90,60,25,0.12) 0 2px, transparent 2px 60px), linear-gradient(180deg, rgba(255,230,190,0.15), rgba(80,50,20,0.15))", clipPath: "polygon(0 4%, 6% 0, 12% 4%, 18% 0, 24% 4%, 30% 0, 36% 4%, 42% 0, 48% 4%, 54% 0, 60% 4%, 66% 0, 72% 4%, 78% 0, 84% 4%, 90% 0, 96% 4%, 100% 0, 100% 100%, 0 100%)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 70, right: 70, top: 110 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 7, color: M.stamp }}>{n ? `ME PREGUNTARON · ${n}` : "DÉJAME EN LOS COMENTARIOS"}</div>
          <div style={{ fontFamily: SERIF, fontSize: text.length > 60 ? 60 : 72, lineHeight: 1.1, color: M.ink, marginTop: 26, opacity: seg(f, 12, 22) }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA: la caja del próximo video llega al frente y el pizarrón de banqueta dice SUSCRÍBETE
export const CTACaja: React.FC<{ img: string; next: string; nextImg: string; dur: number }> = ({ img, next, nextImg, dur }) => {
  const f = useCurrentFrame();
  const c = sp(f - 4, 15), b = sp(f - 20, 15);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={51} dur={dur} />
      <div style={{ position: "absolute", left: 1000, top: 300, transform: `translateX(${(1 - c) * 1100}px) rotate(-2deg)` }}>
        <Caja n={0} title={next} src={nextImg} w={780} kicker="EL QUE SIGUE" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 180, width: 640, height: 300, ...BOARD, border: `22px solid ${M.pineD}`, boxSizing: "border-box", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", transform: `translateY(${(1 - b) * -700}px)`, padding: "64px 50px" }}>
        <Gis t="SUSCRÍBETE" f0={30} len={14} size={90} font={SERIF} />
      </div>
    </AbsoluteFill>
  );
};
