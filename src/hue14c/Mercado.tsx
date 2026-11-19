// Mercado.tsx — kit de hue14c (naranjas dulces). Puro CSS y DOM con materiales de la frutería:
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
// salida: el objeto se va en los últimos 14 cuadros (la foto queda)
const salir = (f: number, dur: number) => interpolate(f, [dur - 14, dur - 1], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });

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
// ---------- ayudantes físicos (vuelta 2)
const KRAFTB: React.CSSProperties = { backgroundColor: "#C9A36A", backgroundImage: "repeating-linear-gradient(17deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px)", borderRadius: 8 };
const WOODB: React.CSSProperties = { backgroundColor: "#a8794a", backgroundImage: "repeating-linear-gradient(0deg, rgba(70,40,15,0.18) 0 2px, transparent 2px 9px), linear-gradient(180deg, #c99a62, #a8794a)" };
const TWN = "repeating-linear-gradient(60deg, #D2B07A 0 4px, #A07B45 4px 7px)";
const Sombra: React.FC<{ x: number; y: number; w: number; h?: number; o?: number }> = ({ x, y, w, h = 30, o = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)", opacity: o }} />
);
const swingK = (f: number, f0: number, amp = 6, tau = 24) => (f < f0 ? 0 : Math.exp(-(f - f0) / tau) * Math.cos(((f - f0) / 30) * Math.PI * 2) * amp);
// etiqueta kraft atada con hilo al punto (x, y) de la foto: cae con peso desde ese punto y se mece
const Atada: React.FC<{ x: number; y: number; t: string; sub?: string; f0: number; fOut?: number; len?: number; size?: number }> = ({ x, y, t, sub, f0, fOut, len = 90, size = 60 }) => {
  const f = useCurrentFrame(); if (f < f0) return null;
  const k = spring({ frame: f - f0, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 150 } });
  const out = fOut !== undefined ? interpolate(f, [fOut, fOut + 12], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) }) : 0;
  if (out >= 1) return null;
  const sw = swingK(f, f0, 7, 26);
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `rotate(${sw}deg) translateY(${out * 1200}px)` }}>
      <div style={{ position: "absolute", left: -12, top: -10, width: 24, height: 20, borderRadius: "50%", backgroundImage: TWN, boxShadow: "0 3px 4px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: len * k, background: "#5a3d1e", boxShadow: "1px 0 0 rgba(255,235,200,0.6), 4px 6px 5px rgba(0,0,0,0.35)", borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 0, top: len * k - 4, transform: "translateX(-50%)", padding: "14px 34px 18px", whiteSpace: "nowrap", textAlign: "center", opacity: k > 0.3 ? 1 : 0,
        ...KRAFTB, boxShadow: "14px 20px 26px rgba(0,0,0,0.45)" }}>
        <div style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.02, color: M.ink }}>{t}</div>
        {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 3, color: M.stamp, marginTop: 6 }}>{sub}</div>}
      </div>
    </div>
  );
};
// cámara curva sobre una foto a pantalla completa: centro (cx, cy) y escala s, sin bordes vacíos
const camC = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = Math.max(s, 960 / Math.max(1, cx), 960 / Math.max(1, 1920 - cx), 540 / Math.max(1, cy), 540 / Math.max(1, 1080 - cy), 1);
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const FOTO: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// 50/50: la foto sube desde abajo y ocupa la mitad derecha completa (960-1920 × 0-1080), con un listón de pino al costado
export const SplitCaja: React.FC<{ src: string; seed: number; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 16, dur - 16, dur - 3], [0, 1, 1, 0], { ...CL, easing: io });
  if (p <= 0.001 && f > 4) return null;
  const z = lerp(1.0, 1.06, seg(f, 0, dur));
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 960, width: 960, overflow: "hidden", transform: `translateY(${(1 - p) * 105}%)` }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 24, ...PINE, boxShadow: "8px 0 18px rgba(0,0,0,0.45)" }} />
    </div>
  );
};
// foto vieja: cuelga con una pinza de madera de un hilo tendido arriba a la derecha; entra cayendo con peso y sale hacia arriba
export const FotoCinta: React.FC<{ src: string; caption: string; dur: number; seed?: number }> = ({ src, caption, dur }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 9, mass: 1.1, stiffness: 130 } });
  const out = interpolate(f, [dur - 14, dur - 1], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const sw = swingK(f, 10, 3, 26);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 1300, top: 54, width: 620, height: 6, backgroundImage: TWN, boxShadow: "0 4px 4px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", left: 1390, top: 60, width: 440, transformOrigin: "220px 0", transform: `translateY(${(1 - k) * -700 - out * 800}px) rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: 208, top: -22, width: 24, height: 64, borderRadius: 4, background: "linear-gradient(90deg, #c9a16b, #e8cc9c 50%, #a8804c)", boxShadow: "3px 4px 5px rgba(0,0,0,0.4)", zIndex: 2 }} />
        <div style={{ marginTop: 20, background: "#FBF6EA", padding: 14, boxShadow: "16px 22px 32px rgba(0,0,0,0.45)" }}>
          <Img src={staticFile(src)} style={{ width: 412, height: 400, objectFit: "cover", objectPosition: "30% 40%", display: "block" }} />
          <div style={{ fontFamily: SERIF, fontSize: 50, color: M.ink, textAlign: "center", paddingTop: 10 }}>{caption}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// transición de capítulo (ya no se usa: los componentes entran con su propio movimiento)
export const Seda: React.FC<{ dir?: number; len?: number }> = () => null;

// ---------- caja de fruta: tablas de pino con la foto grande pegada al frente y el número quemado
const Caja: React.FC<{ n: number; title?: string; src: string; w: number; big?: boolean; ts?: number; ph?: number }> = ({ n, title, src, w, big, ts, ph = 0.6 }) => {
  const h = w * 0.78;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: k * h * 0.34, height: h * 0.3, ...PINE, borderRadius: 2, boxShadow: "inset 0 -3px 0 rgba(90,60,25,0.25)" }} />)}
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", top: -h * 0.03, bottom: -h * 0.03, [k ? "right" : "left"]: -w * 0.02, width: w * 0.06, ...PINE, backgroundColor: M.pineD, boxShadow: "0 3px 8px rgba(0,0,0,0.35)" } as React.CSSProperties} />)}
      <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: h * 0.07, height: h * (title ? ph : 0.86), overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.35)", border: `${Math.max(3, w * 0.01)}px solid #F4E9D2` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {n > 0 && <div style={{ position: "absolute", left: w * 0.1, top: h * 0.1, width: w * 0.2, height: w * 0.2, borderRadius: "50%", background: M.paper, border: `${w * 0.012}px solid ${M.stamp}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SERIF, fontSize: w * 0.12, color: M.stamp, boxShadow: "0 4px 6px rgba(0,0,0,0.35)" }}>{n}</div>}
      {title && <div style={{ position: "absolute", left: w * 0.06, right: w * 0.06, top: h * (ph + 0.1), height: h * (0.87 - ph - 0.1) + h * 0.1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        fontFamily: SERIF, fontSize: ts ?? (big ? w * 0.075 : w * 0.085), lineHeight: 1.0, color: M.ink }}>{title}</div>}
    </div>
  );
};
export type Card = { title: string; src: string };
const Bodega: React.CSSProperties = { backgroundColor: "#3a2a1e", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 4px, transparent 4px 200px), linear-gradient(180deg, #5a4030, #2c2017)" };
const Piso: React.FC = () => <div style={{ position: "absolute", left: -2000, right: -2000, top: 860, height: 600, background: "linear-gradient(180deg, #4a3526, #2a1d14)", boxShadow: "0 -6px 18px rgba(0,0,0,0.5)" }} />;

const MESA = "hue14c/g/e_preg.jpg";
const MesaFoto: React.FC<{ t: number }> = ({ t }) => (
  <div style={camC(lerp(960, 1000, t), lerp(560, 540, t), lerp(1.02, 1.08, t))}><Img src={staticFile(MESA)} style={FOTO} /></div>
);
// (1) carrusel: sobre la mesa real, de a 3 cajas grandes (x 120 / 700 / 1280); cada caja nueva cae en su lugar y la que estaba ahí se va abajo
export const MuroCajas: React.FC<{ cards: Card[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame();
  const n = cards.length, W = 520, H = W * 0.78, YB = 800, SL = [120, 700, 1280];
  const step = (dur - 20) / n;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <MesaFoto t={seg(f, 0, dur)} />
      {cards.map((c, i) => {
        const g = Math.floor(i / 3), gn = Math.min(3, n - g * 3); const fi = Math.round(4 + i * step); const fo = (g + 1) * 3 < n ? Math.round(4 + (g + 1) * 3 * step) - 6 : dur + 10;
        if (f < fi || f > fo + 14) return null;
        const k = spring({ frame: f - fi, fps: 30, config: { damping: 11, mass: 1.1 } });
        const out = interpolate(f, [fo, fo + 10], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
        const sl = gn === 3 ? i % 3 : gn === 2 ? 0.5 + (i % 3) : 1; const x = SL[0] + sl * (SL[1] - SL[0]);
        return (
          <React.Fragment key={i}>
            <Sombra x={x + W / 2} y={YB + 4} w={W * 1.04} h={40} o={k * (1 - out)} />
            <div style={{ position: "absolute", left: x, top: YB - H, opacity: Math.min(1, k * 2) * (1 - out), transform: `translateY(${(1 - k) * -240}px) scale(${1 - 0.04 * out}) rotate(${((hash(i + 3) % 5) - 2) * 0.5}deg)`, transformOrigin: "50% 100%" }}>
              <Caja n={i + 1} title={c.title} src={c.src} w={W} ts={56} ph={0.56} />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// (10) recap: n=0 → dos pasadas de 5 cajas sobre la mesa real (1-5, después 6-10), en orden, con su nombre; el título entra al final.
// n>0 → la caja n apoyada a la izquierda y un pizarrón apoyado a la derecha, del alto de su texto.
export const RecapCajas: React.FC<{ n: number; cards: Card[]; lines: string[]; dur: number }> = ({ n, cards, lines, dur }) => {
  const f = useCurrentFrame();
  const t = seg(f, 0, dur);
  if (n === 0) {
    const kk = spring({ frame: f - 3, fps: 30, config: { damping: 10, mass: 1.2, stiffness: 140 } }); const oo = interpolate(f, [dur - 9, dur - 1], [0, 1], CL);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <MesaFoto t={t} />
        <Sombra x={960} y={806} w={1180 * kk} h={46} o={kk * (1 - oo)} />
        <div style={{ position: "absolute", left: 960, top: 800, opacity: Math.min(1, kk * 2) * (1 - oo), transform: `translate(-50%, -100%) translateY(${(1 - kk) * -320}px) rotate(${-1.5 + (1 - kk) * 4}deg)`, transformOrigin: "50% 100%",
          width: 1180, padding: "40px 0 48px", textAlign: "center", ...WOODB, borderRadius: 12, boxShadow: "22px 30px 44px rgba(0,0,0,0.55), inset 0 -10px 0 rgba(0,0,0,0.22)",
          fontFamily: SERIF, fontSize: 118, lineHeight: 1, color: "#FFF4DE", textShadow: "0 4px 0 rgba(0,0,0,0.35), 0 -2px 2px rgba(0,0,0,0.3)" }}>Las diez, en orden</div>
      </AbsoluteFill>
    );
    const W = 340, H = W * 0.78, YB = 790, half = Math.round(dur * 0.45);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <MesaFoto t={t} />
        {cards.map((c, i) => {
          const pas = i < 5 ? 0 : 1, j = i % 5; const fi = (pas ? half : 0) + 4 + j * 6; const fo = pas ? dur + 10 : half - 8;
          if (f < fi || f > fo + 14) return null;
          const k = spring({ frame: f - fi, fps: 30, config: { damping: 11, mass: 1 } });
          const out = interpolate(f, [fo, fo + 12], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
          const x = 90 + j * 370;
          return (
            <React.Fragment key={i}>
              <Sombra x={x + W / 2} y={YB + 4} w={W} h={30} o={k * (1 - out)} />
              <div style={{ position: "absolute", left: x, top: YB - H, transform: `translateY(${(1 - k) * -900 + out * 900}px)` }}>
                <Caja n={i + 1} title={c.title} src={c.src} w={W} ts={44} ph={0.5} />
              </div>
            </React.Fragment>
          );
        })}
        {f >= dur - 50 && <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SERIF, fontSize: 72, color: M.chalk, textShadow: TXTSH,
          transform: `translateY(${(1 - spring({ frame: f - dur + 50, fps: 30, config: { damping: 12 } })) * -300}px)` }}>las diez, en orden</div>}
      </AbsoluteFill>
    );
  }
  const c = cards[n - 1]; const k = spring({ frame: f - 2, fps: 30, config: { damping: 11, mass: 1.1 } }); const b = spring({ frame: f - 10, fps: 30, config: { damping: 12, mass: 1 } });
  const W = 560, H = W * 0.78;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <MesaFoto t={t} />
      <Sombra x={200 + W / 2} y={804} w={W} h={40} o={k} />
      <div style={{ position: "absolute", left: 160, top: 800 - H, opacity: Math.min(1, k * 2), transform: `translateY(${(1 - k) * -260}px) rotate(-1deg)` }}>
        <Caja n={n} title={c?.title} src={c?.src ?? ""} w={W} ts={56} ph={0.56} />
      </div>
      <Sombra x={1290} y={806} w={860} h={36} o={b} />
      <div style={{ position: "absolute", left: 800, bottom: 1080 - 800, width: 960, opacity: Math.min(1, b * 2), transform: `translateY(${(1 - b) * -260}px) rotate(1deg)`, transformOrigin: "50% 100%", ...BOARD, border: `20px solid ${M.pineD}`, boxSizing: "border-box", boxShadow: "0 24px 40px rgba(0,0,0,0.55)", padding: "34px 44px 40px" }}>
        {lines.map((l, i) => <Gis key={i} t={l} f0={16 + i * 22} len={16} size={62} font={SERIF} style={{ marginTop: i ? 22 : 0, whiteSpace: "normal", lineHeight: 1.08 }} />)}
      </div>
    </AbsoluteFill>
  );
};

// (3) apertura de cada cosa: estaca de madera clavada en el suelo a la derecha; el cartel cae, se clava y se mece con «n · título»
export const Caballete: React.FC<{ n: number; title: string; img: string; dur: number }> = ({ n, title, img, dur }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 2, fps: 30, config: { damping: 9, mass: 1.2, stiffness: 150 } });
  const sw = swingK(f, 12, 2.5, 18);
  const a = seg(f, 0, dur); const out = salir(f, dur);
  const pf = f - 9; // golpe contra el suelo
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(900, 980, a), lerp(600, 500, a) - 30 * Math.sin(a * Math.PI), lerp(1.04, 1.14, a))}><Img src={staticFile(img)} style={FOTO} /></div>
      <Sombra x={1530} y={1046} w={260} h={40} o={k * (1 - out)} />
      {pf > 0 && pf < 22 && [0, 1, 2, 3, 4, 5].map((i) => { const d = pf / 22; const ang = Math.PI * (0.1 + i * 0.16);
        return <div key={i} style={{ position: "absolute", left: 1480 + Math.cos(ang) * (40 + 120 * d) * (i % 2 ? 1 : -1) - 14, top: 1030 - Math.sin(ang) * 70 * d + 60 * d * d - 14, width: 28 + 30 * d, height: 20 + 18 * d, borderRadius: "50%", background: "rgba(120,92,60,0.55)", opacity: 1 - d }} />; })}
      <div style={{ position: "absolute", left: 1480, top: 1040, transformOrigin: "0 0", opacity: 1 - out, transform: `translateY(${(1 - k) * -1300}px) rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: -16, top: -560, width: 32, height: 700, borderRadius: 4, background: "linear-gradient(90deg, #8a5d35, #b07f4e 50%, #6e4626)", boxShadow: "8px 0 12px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: -360, top: -680, width: 720, padding: "34px 44px 40px", boxSizing: "border-box", ...WOODB, borderRadius: 10, boxShadow: "20px 28px 40px rgba(0,0,0,0.5), inset 0 -8px 0 rgba(0,0,0,0.22)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <div style={{ fontFamily: SERIF, fontSize: 170, lineHeight: 0.9, color: "#5a3517", textShadow: "0 2px 0 rgba(255,225,180,0.45), 0 -2px 2px rgba(0,0,0,0.45)" }}>{n}</div>
            <div style={{ fontFamily: SERIF, fontSize: title.length > 22 ? 64 : 82, lineHeight: 1.02, color: "#FFF4DE", textShadow: "0 3px 0 rgba(0,0,0,0.35)" }}>{title}</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: -62, top: -14, width: 124, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 30%, #7a5a3c, #4a3322 70%)", boxShadow: "0 6px 8px rgba(0,0,0,0.4)" }} />
      </div>
    </AbsoluteFill>
  );
};

// (2) progreso: tablita de madera que sube desde abajo a la derecha con «n de 10»; 2 s y se va
export const Etiqueta: React.FC<{ n: number; title: string; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame(); const D = Math.min(dur, 66);
  if (f > D) return null;
  const k = spring({ frame: f, fps: 30, config: { damping: 11, mass: 1 } }); const out = interpolate(f, [D - 12, D], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 1460, top: 860, transform: `translateY(${(1 - k) * 420 + out * 420}px) rotate(-2deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 180, top: 100, width: 24, height: 300, background: "linear-gradient(90deg, #8a5d35, #b07f4e 50%, #6e4626)" }} />
      <div style={{ width: 384, padding: "16px 0 22px", textAlign: "center", ...WOODB, borderRadius: 8, boxShadow: "14px 20px 26px rgba(0,0,0,0.5)", fontFamily: SERIF, fontSize: 64, color: "#FFF4DE", textShadow: "0 3px 0 rgba(0,0,0,0.35)" }}>{n} de 10</div>
    </div>
  );
};

// libro: cae sobre la mesa real (260-820 × 220-980); en la página nombrada la tapa se abre y la página escrita queda a la vista
export const LibroCaja: React.FC<{ src: string; tabs: { p: string; t: string; f: number }[]; dur: number }> = ({ src, tabs, dur }) => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f - 2, fps: 30, config: { damping: 12, mass: 1.1 } }); const t = seg(f, 0, dur);
  const t0 = [...tabs].reverse().find((b) => f >= b.f - 10) ?? tabs[0]; const op = t0 ? interpolate(f, [t0.f - 10, t0.f + 14], [0, 1], { ...CL, easing: io }) : 0;
  const BW = 560, BH = 760;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <MesaFoto t={t} />
      <Sombra x={260 + BW / 2 + 30} y={220 + BH + 4} w={BW + 80} h={50} o={enter} />
      <div style={{ position: "absolute", left: 260, top: 220, width: BW, height: BH, perspective: 2400, opacity: Math.min(1, enter * 2), transform: `translateY(${(1 - enter) * -240}px) rotate(-3deg)` }}>
        <div style={{ position: "absolute", inset: 0, ...PAPER, boxShadow: "24px 34px 44px rgba(0,0,0,0.5)", padding: "64px 56px", boxSizing: "border-box" }}>
          {t0 && <>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 4, color: M.stamp, opacity: seg(f, t0.f + 6, t0.f + 14) }}>pág. {t0.p}</div>
            <div key={t0.p} style={{ fontFamily: SERIF, fontSize: 74, lineHeight: 1.06, color: M.ink, marginTop: 22, opacity: seg(f, t0.f + 10, t0.f + 20) }}>{t0.t}</div>
            <div style={{ position: "absolute", left: 56, right: 56, bottom: 70, height: 200, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 40px, rgba(70,60,40,0.18) 40px 42px)" }} />
          </>}
        </div>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `rotateY(${-170 * op}deg)`, backfaceVisibility: "hidden", boxShadow: "24px 34px 44px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile(src)} style={{ width: BW, height: BH, objectFit: "cover", display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// mapa: hilo rojo grueso con caída curva entre dos alfileres sobre el mapa real; cámara curva
export const MapaHilo: React.FC<{ img: string; a: { x: number; y: number; t: string }; b: { x: number; y: number; t: string }; fA: number; fB: number; dur: number }> = ({ img, a, b, fA, fB, dur }) => {
  const f = useCurrentFrame();
  const pA = sp(f - fA, 10), pB = sp(f - fB - 4, 10), line = seg(f, fA + 6, fB + 4);
  const t = seg(f, 0, dur); const cx = lerp(a.x + 80, (a.x + b.x) / 2, t), cy = lerp(a.y, (a.y + b.y) / 2, t) + 30 * Math.sin(t * Math.PI);
  const N = 24, sag = 60; const pts = Array.from({ length: N + 1 }, (_, i) => { const u = i / N; return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) + sag * 4 * u * (1 - u) }; });
  const Pin = ({ x, y, p, t: tt }: { x: number; y: number; p: number; t: string }) => (
    <>
      <div style={{ position: "absolute", left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #f08a7e, ${M.stamp} 60%, #6d1a12)`, boxShadow: `${lerp(30, 6, p)}px ${lerp(30, 6, p)}px ${lerp(20, 4, p)}px rgba(0,0,0,0.45)`, transform: `translateY(${(1 - p) * -80}px) scale(${lerp(1.6, 1, p)})`, opacity: cl(p * 3, 0, 1) }} />
      <div style={{ position: "absolute", left: x - 40, top: y - 120, fontFamily: SERIF, fontSize: 56, color: M.ink, opacity: cl(p * 2 - 0.6, 0, 1), ...KRAFTB, padding: "6px 20px 10px", boxShadow: "8px 12px 16px rgba(0,0,0,0.35)" }}>{tt}</div>
    </>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(cx, cy, lerp(1.1, 1.2, t))}>
        <Img src={staticFile(img)} style={FOTO} />
        {pts.slice(0, -1).map((p, i) => {
          const q = pts[i + 1]; const u = (i + 1) / N; if (u > line + 0.001) return null;
          const L = Math.hypot(q.x - p.x, q.y - p.y) + 1.5, ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
          return <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 3, width: L, height: 6, background: "linear-gradient(180deg, #e05a4a, #9e2414)", transformOrigin: "0 50%", transform: `rotate(${ang}deg)`, boxShadow: "0 6px 4px rgba(0,0,0,0.3)" }} />;
        })}
        <Pin x={a.x} y={a.y} p={pA} t={a.t} />
        <Pin x={b.x} y={b.y} p={pB} t={b.t} />
      </div>
    </AbsoluteFill>
  );
};

// recuerdo: cámara curva sobre la foto real; la cita está escrita en una tira de papel que cae y se apoya abajo a la derecha, con su firma
export const Recuerdo: React.FC<{ img: string; head: string; quote?: string; who?: string; fQuote?: number; dur: number }> = ({ img, head, dur }) => {
  const f = useCurrentFrame();
  const t = seg(f, 0, dur); const out = salir(f, dur);
  const k = spring({ frame: f - 4, fps: 30, config: { damping: 11, mass: 1.2, stiffness: 120 } });
  const fondo = seg(f, 0, 16);
  const [quien, donde] = [head.split("·")[0].trim(), (head.split("·")[1] ?? "").trim()];
  const W = 1180, HH = 664;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div style={camC(960, 540, lerp(1.04, 1.12, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      <div style={{ ...camC(960, 540, lerp(1.1, 1.18, t)), opacity: fondo }}><Img src={staticFile(img)} style={{ ...FOTO, filter: "blur(14px) brightness(0.55) sepia(0.35)" }} /></div>
      <div style={{ position: "absolute", left: 960, top: 520, opacity: Math.min(1, k * 2) * (1 - out), transform: `translate(-50%, -50%) translateY(${(1 - k) * -180}px) rotate(${lerp(-9, -2.5, k) + Math.sin(f / 40) * 0.4}deg) scale(${lerp(1.12, 1, k) + 0.03 * t})` }}>
        <div style={{ background: "#F7F1E3", padding: "26px 26px 118px", boxShadow: "26px 36px 50px rgba(0,0,0,0.6)" }}>
          <div style={{ width: W, height: HH, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(img)} style={{ width: W, height: HH, objectFit: "cover", transform: `scale(${lerp(1.0, 1.06, t)})`, filter: "sepia(0.28) saturate(0.85) contrast(0.95)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: "#3a2a1e" }}>{quien}{donde ? `, ${donde}` : ""}</div>
        </div>
        <div style={{ position: "absolute", left: "50%", top: -26, width: 230, height: 58, transform: "translateX(-50%) rotate(-3deg)", background: "rgba(232,220,180,0.82)", boxShadow: "0 3px 6px rgba(0,0,0,0.25)" }} />
      </div>
    </AbsoluteFill>
  );
};

// engomados → etiquetas de vivero atadas con hilo al punto exacto de la foto; una por vez (la anterior cae); cámara curva hacia cada punto
export type Peg = { x: number; y: number; t: string; sub?: string; f: number; r?: number };
export type Marcas = { pts: [number, number][]; fPts: number; regla?: { a: [number, number]; b: [number, number]; t: string; f: number } };
export const Engomados: React.FC<{ img: string; items: Peg[]; seed: number; dur: number; zoom?: [number, number]; o?: [number, number]; marcas?: Marcas }> = ({ img, items, dur, marcas }) => {
  const f = useCurrentFrame(); const out = salir(f, dur);
  let cx = items[0] ? items[0].x : 960, cy = items[0] ? items[0].y + 140 : 540;
  for (let i = 1; i < items.length; i++) { const u = seg(f, items[i].f - 18, items[i].f + 6); cx = lerp(cx, items[i].x, u); cy = lerp(cy, items[i].y + 140, u); }
  cx = lerp(960, cx, 0.55); cy = lerp(540, cy, 0.55);
  const s = lerp(1.06, 1.18, seg(f, 0, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(cx, cy, s)}>
        <Img src={staticFile(img)} style={FOTO} />
        {items.map((m, i) => {
          const nx = items[i + 1]; const tx = Math.min(1700, Math.max(240, m.x)); const ty = Math.min(700, Math.max(40, m.y));
          return <Atada key={i} x={tx} y={ty} t={m.t} sub={m.sub} f0={m.f} fOut={nx ? nx.f - 10 : dur - 14} size={62} />;
        })}
        {marcas && marcas.pts.map(([x, y], i) => { const g = sp(f - marcas.fPts - i * 5, 10); if (g <= 0.01) return null;
          return <div key={i} style={{ position: "absolute", left: x - 46, top: y - 46, width: 92, height: 92, borderRadius: "50%", border: "6px solid #FFC94A", boxShadow: "0 0 18px rgba(255,190,60,0.85), inset 0 0 12px rgba(255,190,60,0.6)", transform: `scale(${lerp(1.8, 1, g)})`, opacity: cl(g, 0, 1) * (1 - out) }} />; })}
        {marcas?.regla && (() => { const R = marcas.regla; const L = Math.hypot(R.b[0] - R.a[0], R.b[1] - R.a[1]); const ang = (Math.atan2(R.b[1] - R.a[1], R.b[0] - R.a[0]) * 180) / Math.PI; const g = seg(f, R.f, R.f + 14, eo); if (g <= 0) return null;
          return (
            <div style={{ position: "absolute", left: R.a[0], top: R.a[1], transformOrigin: "0 50%", transform: `translateY(-50%) rotate(${ang}deg)`, opacity: 1 - out }}>
              <div style={{ width: L * g, height: 56, backgroundColor: "#F2C230", backgroundImage: "repeating-linear-gradient(90deg, #2A1F17 0 2px, transparent 2px 13px)", backgroundSize: "100% 12px", backgroundRepeat: "repeat-x", border: "2px solid #8a6a10", borderRadius: 3, boxShadow: "6px 10px 10px rgba(0,0,0,0.45)", overflow: "hidden" }} />
              <div style={{ position: "absolute", left: L / 2, top: 60, transform: `translateX(-50%) rotate(${-ang}deg)`, fontFamily: SERIF, fontSize: 88, color: "#FFF4DE", textShadow: "0 3px 10px rgba(0,0,0,0.85), 0 0 2px #000", whiteSpace: "nowrap", opacity: seg(f, R.f + 10, R.f + 18) }}>{R.t}</div>
            </div>
          ); })()}
      </div>
    </AbsoluteFill>
  );
};

// pizarrón: colgado con dos hilos de una rama a la derecha (1240-1860 × 120-640); entra a los 2 s con peso y se mece; renglones de a uno ≥56 px
export const Pizarron: React.FC<{ img: string; head: string; lines: { t: string; f: number }[]; seed: number; dur: number; foot?: string }> = ({ img, head, lines, dur }) => {
  const f = useCurrentFrame();
  const fIn = 20; const out = salir(f, dur);
  const k = spring({ frame: f - fIn, fps: 30, config: { damping: 9, mass: 1.1, stiffness: 140 } });
  const sw = swingK(f, fIn + 10, 2, 30);
  const t = seg(f, 0, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(900, 820, t), lerp(560, 600, t), lerp(1.04, 1.12, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      {f >= fIn && (
        <div style={{ position: "absolute", left: 1170, top: 0, width: 700, transformOrigin: "350px 0", opacity: 1 - out, transform: `perspective(1600px) translateY(${(1 - k) * -800}px) rotate(${sw + Math.sin(f / 26) * 0.5}deg) rotateY(-9deg)` }}>
          {[90, 610].map((x) => <div key={x} style={{ position: "absolute", left: x - 2, top: 0, width: 4, height: 130, background: "#5a3d1e", boxShadow: "3px 4px 4px rgba(0,0,0,0.35)" }} />)}
          <div style={{ position: "absolute", left: 0, top: 120, width: 700, ...BOARD, border: `18px solid ${M.pineD}`, boxSizing: "border-box", boxShadow: "18px 26px 40px rgba(0,0,0,0.55)", padding: "28px 36px 34px" }}>
            <Gis t={head.charAt(0) + head.slice(1).toLowerCase()} f0={fIn + 8} len={8} size={58} font={SERIF} style={{ color: "#FFD08A", whiteSpace: "normal", lineHeight: 1.05 }} />
            {lines.map((l, i) => <Gis key={i} t={l.t} f0={Math.max(fIn + 16 + i * 8, l.f)} len={8} size={i === 0 ? 88 : 66} font={SERIF} style={{ marginTop: 14, whiteSpace: "normal", lineHeight: 1.05, color: i === 0 ? "#FFF6D8" : M.chalk }} />)}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// calendario: los meses se escriben EN el calendario real de la pared; la cámara se acerca; ENE/ABR/JUL/OCT se encierran de a uno
const CAL = { x: 1112, y: 196, w: 290, h: 370 };
export const PizarronMeses: React.FC<{ img: string; foot: string; dur: number }> = ({ img, foot, dur }) => {
  const f = useCurrentFrame();
  const MES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const a = seg(f, 0, 40); const t = seg(f, 0, dur);
  const cw = CAL.w / 3, ch = (CAL.h - 70) / 4;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(900, CAL.x + CAL.w / 2, a), lerp(560, CAL.y + CAL.h / 2 + 10, a), lerp(1.04, 2.2, a) + 0.08 * t)}>
        <Img src={staticFile(img)} style={FOTO} />
        <div style={{ position: "absolute", left: CAL.x, top: CAL.y + 10, width: CAL.w, textAlign: "center", fontFamily: SERIF, fontSize: 22, whiteSpace: "nowrap", color: M.ink, opacity: seg(f, 30, 40) }}>{foot.split("·")[0].trim()}</div>
        {MES.map((m, i) => {
          const col = i % 3, row = Math.floor(i / 3); const f0 = 36 + i * 4; const key = i % 3 === 0; const fk = 36 + 12 * 4 + 10 + (i / 3) * 12;
          const x = CAL.x + col * cw, y = CAL.y + 66 + row * ch;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: cw, height: ch, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: 30, color: key && f >= fk ? M.stamp : "#3a3028", WebkitMaskImage: `linear-gradient(90deg, #000 ${seg(f, f0, f0 + 6) * 100}%, transparent ${seg(f, f0, f0 + 6) * 100 + 5}%)` }}>{m}</div>
              {key && f >= fk && <div style={{ position: "absolute", left: 10, top: 6, right: 10, bottom: 6, borderRadius: "50%", border: `3px solid ${M.stamp}`,
                WebkitMaskImage: `conic-gradient(#000 ${seg(f, fk, fk + 8) * 360}deg, transparent ${seg(f, fk, fk + 8) * 360}deg)` }} />}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: CAL.x, top: CAL.y + CAL.h - 34, width: CAL.w, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: M.stamp, opacity: seg(f, 110, 120) }}>{(foot.split("·")[1] ?? "").trim()}</div>
      </div>
    </AbsoluteFill>
  );
};

// mitos: sello de goma que golpea sobre cada remedio, en el plano de la mesa; la cámara viaja en curva del anterior al nuevo
export type Sello = { x: number; y: number; t: string; f: number; r?: number };
export const Sellos: React.FC<{ img: string; items: Sello[]; dur: number; zoomTo?: { x: number; y: number }; chico?: boolean }> = ({ img, items, dur, chico }) => {
  const f = useCurrentFrame();
  const last = items[items.length - 1], prev = items.length > 1 ? items[items.length - 2] : null;
  const u = seg(f, Math.max(0, last.f - 30), last.f);
  const xs = items.map((i) => i.x), ys = items.map((i) => i.y); const mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2;
  const cx = chico ? lerp(mx + 30, mx - 70, seg(f, 0, dur)) : prev ? lerp(prev.x, last.x, u) : lerp(960, last.x, u), cy = (chico ? my : prev ? lerp(prev.y, last.y, u) : lerp(540, last.y, u)) - 40 * Math.sin(u * Math.PI);
  const s = chico ? lerp(1.22, 1.34, seg(f, 0, dur)) : lerp(1.2, 1.32, seg(f, 0, dur)); const out = salir(f, dur);
  const golpe = items.reduce((a, it) => { const d = f - it.f - 7; return d >= 0 && d < 10 ? a + Math.exp(-d / 3) * Math.sin(d * 2.4) * 7 : a; }, 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ ...camC(cx, cy + golpe, s) }}>
        <Img src={staticFile(img)} style={FOTO} />
        {items.map((it, i) => {
          if (f < it.f) return null;
          const px = chico ? it.x : Math.min(1180, Math.max(700, it.x)), py = chico ? it.y : Math.min(620, Math.max(500, it.y));
          const hit = seg(f, it.f, it.f + 7, Easing.in(Easing.quad)); const reb = f > it.f + 4 ? Math.exp(-(f - it.f - 4) / 4) * Math.sin((f - it.f - 4) / 1.5) * 0.04 : 0;
          const r = it.r ?? (i % 2 ? 7 : -8);
          if (chico) { const [big, small] = it.t.split("|"); const ok = !/NO/.test(big); const c = ok ? "#2E7D32" : M.stamp;
            return (
              <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%, -50%) rotate(${r}deg) scale(${lerp(2.4, 1, hit) + reb * 2})`, opacity: lerp(0, 1, hit) * (1 - out), background: "rgba(246,238,220,0.95)", border: `7px solid ${c}`, borderRadius: 12, padding: "6px 18px 8px", textAlign: "center", fontFamily: SANS, fontWeight: 800, color: c, whiteSpace: "nowrap", boxShadow: `0 ${lerp(34, 8, hit)}px ${lerp(30, 10, hit)}px rgba(0,0,0,0.5)` }}>
                <div style={{ fontSize: ok ? 40 : 56, lineHeight: 1, letterSpacing: 3 }}>{big}</div>
                {small && <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, marginTop: 2 }}>{small}</div>}
              </div>
            ); }
          return (
            <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%, -50%) perspective(900px) rotateX(38deg) rotate(${r}deg) scale(${lerp(1.6, 1, hit) + reb})`, opacity: lerp(0, 0.92, hit) * (1 - out),
              border: `${chico ? 5 : 8}px solid ${M.stamp}`, borderRadius: 10, padding: chico ? "7px 14px" : "12px 30px", fontFamily: SANS, fontWeight: 600, fontSize: chico ? 30 : 58, letterSpacing: chico ? 2 : 6, color: M.stamp, whiteSpace: "nowrap",
              WebkitMaskImage: "repeating-linear-gradient(37deg, #000 0 9px, rgba(0,0,0,0.72) 9px 12px), repeating-linear-gradient(-61deg, #000 0 15px, rgba(0,0,0,0.8) 15px 17px)", mixBlendMode: "multiply" }}>{it.t}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// dato con fuente: tendedero de hilo arriba del cuadro; la tira con el dato cuelga de dos pinzas y la fuente va escrita abajo en la misma tira
export const Estarcido: React.FC<{ img: string; quote: string; source: string; dur: number }> = ({ img, quote, source, dur }) => {
  const f = useCurrentFrame();
  const t = seg(f, 0, dur); const k = spring({ frame: f - 6, fps: 30, config: { damping: 9, mass: 1, stiffness: 140 } }); const sw = swingK(f, 14, 3, 24) + Math.sin(f / 19) * 0.9; const out = salir(f, dur);
  const line = seg(f, 0, 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(960, 900, t), lerp(600, 640, t), lerp(1.04, 1.14, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      <div style={{ position: "absolute", left: 0, top: 54, width: 1920 * line, height: 7, backgroundImage: TWN, boxShadow: "0 5px 5px rgba(0,0,0,0.35)" }} />
      {f >= 6 && (
        <div style={{ position: "absolute", left: 120, top: 50, width: 1000, transformOrigin: "500px 0", opacity: 1 - out, transform: `translateY(${(1 - k) * -500}px) rotate(${sw}deg)` }}>
          {[140, 860].map((x) => <div key={x} style={{ position: "absolute", left: x - 17, top: -26, width: 34, height: 86, borderRadius: 5, background: "linear-gradient(90deg, #8a6236, #c9a16b 45%, #6e4a26)", border: "2px solid #4a3020", boxShadow: "5px 7px 7px rgba(0,0,0,0.5)", zIndex: 2 }}><div style={{ position: "absolute", left: 4, right: 4, top: 30, height: 10, background: "#9a9a9a", borderRadius: 2 }} /></div>)}
          <div style={{ marginTop: 26, padding: "26px 44px 22px", ...KRAFTB, boxShadow: "18px 26px 34px rgba(0,0,0,0.45)", textWrap: "balance" } as React.CSSProperties}>
            <div style={{ fontFamily: SERIF, fontSize: 72, lineHeight: 1.06, color: M.ink }}>{quote}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// pregunta: hoja de papel de estraza apoyada entera sobre la tabla (100-1000 × 520-960); la pregunta aparece renglón por renglón
export const Bolsa: React.FC<{ img: string; n: number; text: string; dur: number }> = ({ img, n, text, dur }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 2, fps: 30, config: { damping: 12, mass: 1.1 } }); const t = seg(f, 0, dur); const out = salir(f, dur);
  const words = text.split(" "); const per = Math.ceil(words.length / 2);
  const rows = [0, 1].map((r) => words.slice(r * per, (r + 1) * per).join(" ")).filter(Boolean);
  const pen = sp(f - 8, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(900, 820, t), lerp(560, 600, t), lerp(1.02, 1.08, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      <div style={{ position: "absolute", left: 120, top: 540, width: 820, perspective: 1600, opacity: Math.min(1, k * 2) * (1 - out), transform: `translateY(${(1 - k) * 300}px)` }}>
        <div style={{ transformOrigin: "50% 100%", transform: `rotateX(22deg) rotate(${n % 2 ? -3 : -4}deg)`, padding: "26px 40px 34px", boxSizing: "border-box", ...PAPER,
          backgroundImage: "repeating-linear-gradient(180deg, transparent 0 66px, rgba(80,110,160,0.28) 66px 68px)", boxShadow: "18px 24px 26px rgba(0,0,0,0.5)", borderRadius: "2px 2px 2px 26px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, color: M.ink, borderBottom: `3px solid ${M.stamp}`, display: "inline-block", paddingBottom: 4 }}>{n ? `Me preguntaron · ${n}` : "Cuéntame en los comentarios"}</div>
          {rows.map((r, i) => { const p = seg(f, 14 + i * 16, 28 + i * 16, Easing.linear);
            return <div key={i} style={{ fontFamily: SERIF, fontSize: 66, lineHeight: 1.12, color: "#22305A", marginTop: i ? 2 : 12, WebkitMaskImage: `linear-gradient(90deg, #000 ${p * 100}%, transparent ${p * 100 + 3}%)` }}>{r}</div>; })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 820, width: 380, height: 26, opacity: 1 - out, transform: `translateX(${(1 - pen) * 900}px) rotate(-18deg)`, borderRadius: 4, background: "linear-gradient(180deg, #F4C542, #D9A21A)", boxShadow: "8px 12px 10px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", left: -36, top: 0, width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderRight: "36px solid #E8C79A" }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: 30, height: 26, background: "#C9C9C9" }} />
      </div>
    </AbsoluteFill>
  );
};

// CTA: la caja del próximo video cae y se apoya en el piso de piedra; el cartel SUSCRÍBETE cuelga de una rama del naranjo y se mece
export const CTACaja: React.FC<{ img: string; next: string; nextImg: string; dur: number }> = ({ img, next, nextImg, dur }) => {
  const f = useCurrentFrame();
  const c = spring({ frame: f - 6, fps: 30, config: { damping: 10, mass: 1.2 } }); const t = seg(f, 0, dur); const out = salir(f, dur);
  const W = 600, H = W * 0.78, X = 90, YB = 1000;
  const fs = 33; const hit = seg(f, fs, fs + 5, Easing.in(Easing.quad)); const reb = f > fs + 5 ? Math.exp(-(f - fs - 5) / 4) * Math.sin((f - fs - 5) / 1.5) * 0.05 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(880, 840, t), lerp(560, 580, t), lerp(1.0, 1.05, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      <Sombra x={X + W / 2} y={YB + 6} w={W * 1.06} h={44} o={c * (1 - out)} />
      <div style={{ position: "absolute", left: X, top: YB - H, opacity: Math.min(1, c * 2) * (1 - out), transform: `translateY(${(1 - c) * -300}px) rotate(-1deg)` }}>
        <Caja n={0} title={next} src={nextImg} w={W} ts={50} ph={0.56} />
        <div style={{ position: "absolute", left: W * 0.08, top: -84, fontFamily: SERIF, fontSize: 66, color: "#FFF4DE", textShadow: "0 3px 10px rgba(0,0,0,0.85)" }}>El que sigue</div>
        {f >= fs && <div style={{ position: "absolute", left: W * 0.86, top: H * 0.86, transform: `translate(-50%, -50%) rotate(-9deg) scale(${lerp(2.2, 1, hit) + reb})`, opacity: hit, background: "rgba(246,238,220,0.95)", border: `8px solid ${M.stamp}`, borderRadius: 12, padding: "10px 28px", fontFamily: SANS, fontWeight: 700, fontSize: 58, letterSpacing: 4, color: M.stamp, whiteSpace: "nowrap", boxShadow: `0 ${lerp(34, 8, hit)}px ${lerp(30, 10, hit)}px rgba(0,0,0,0.5)` }}>SUSCRÍBETE</div>}
      </div>
    </AbsoluteFill>
  );
};
