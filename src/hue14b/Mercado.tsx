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
      <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: len * k, backgroundImage: TWN, borderRadius: 3 }} />
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

// 50/50: la foto sube desde abajo dentro del hueco de una caja de pino; la salida termina antes del corte
export const SplitCaja: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 16, dur - 16, dur - 3], [0, 1, 1, 0], { ...CL, easing: io });
  if (p <= 0.001 && f > 4) return null;
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 900, transform: `translateY(${(1 - p) * 115}%)` }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><Foto src={src} seed={seed} dur={dur} /></div>
      <div style={{ position: "absolute", left: -30, top: 0, bottom: 0, width: 30, ...PINE, boxShadow: "-12px 0 30px rgba(0,0,0,0.45)" }} />
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: -30, right: 0, [k ? "bottom" : "top"]: 0, height: 26, ...PINE, boxShadow: "0 4px 10px rgba(0,0,0,0.35)" } as React.CSSProperties} />)}
    </div>
  );
};
// foto vieja: cae desde arriba girando con peso, se asienta sobre el vidrio con dos cintas y al final cae hacia abajo
const Cinta: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 150, height: 40, background: "rgba(236,222,190,0.86)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", clipPath: "polygon(2% 8%, 98% 0, 100% 92%, 0 100%)", ...style }} />
);
export const FotoCinta: React.FC<{ src: string; caption: string; dur: number; seed?: number }> = ({ src, caption, dur, seed = 1 }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 10, mass: 1.1, stiffness: 120 } });
  const out = interpolate(f, [dur - 14, dur - 1], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const r = (hash(seed) % 2 ? 1 : -1) * 3;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 1270, top: 120, width: 540, transform: `translateY(${(1 - k) * -900 + out * 1300}px) rotate(${r + (1 - k) * -18 + out * 14}deg)`, transformOrigin: "50% 40%" }}>
        <div style={{ background: "#FBF6EA", padding: 18, boxShadow: "18px 26px 40px rgba(0,0,0,0.45)" }}>
          <Img src={staticFile(src)} style={{ width: 504, height: 400, objectFit: "cover", objectPosition: "30% 50%", display: "block" }} />
          <div style={{ fontFamily: SERIF, fontSize: 52, color: M.ink, textAlign: "center", paddingTop: 12 }}>{caption}</div>
        </div>
        <Cinta style={{ left: -40, top: -12, transform: "rotate(-28deg)" }} />
        <Cinta style={{ right: -40, top: -12, transform: "rotate(26deg)" }} />
      </div>
    </AbsoluteFill>
  );
};

// transición de capítulo (ya no se usa: los componentes entran con su propio movimiento)
export const Seda: React.FC<{ dir?: number; len?: number }> = () => null;

// ---------- caja de fruta: tablas de pino con la foto grande pegada al frente y el número quemado
const Caja: React.FC<{ n: number; title?: string; src: string; w: number; big?: boolean }> = ({ n, title, src, w, big }) => {
  const h = w * 0.78;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: k * h * 0.34, height: h * 0.3, ...PINE, borderRadius: 2, boxShadow: "inset 0 -3px 0 rgba(90,60,25,0.25)" }} />)}
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", top: -h * 0.03, bottom: -h * 0.03, [k ? "right" : "left"]: -w * 0.02, width: w * 0.06, ...PINE, backgroundColor: M.pineD, boxShadow: "0 3px 8px rgba(0,0,0,0.35)" } as React.CSSProperties} />)}
      <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: h * 0.07, height: h * (title ? 0.6 : 0.86), overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.35)", border: `${Math.max(3, w * 0.01)}px solid #F4E9D2` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: w * 0.1, top: h * 0.1, width: w * 0.2, height: w * 0.2, borderRadius: "50%", background: M.paper, border: `${w * 0.012}px solid ${M.stamp}`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SERIF, fontSize: w * 0.12, color: M.stamp, boxShadow: "0 4px 6px rgba(0,0,0,0.35)" }}>{n}</div>
      {title && <div style={{ position: "absolute", left: w * 0.06, right: w * 0.06, top: h * 0.7, height: h * 0.27, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        fontFamily: SERIF, fontSize: big ? w * 0.075 : w * 0.085, lineHeight: 1.0, color: M.ink }}>{title}</div>}
    </div>
  );
};
export type Card = { title: string; src: string };
const Bodega: React.CSSProperties = { backgroundColor: "#3a2a1e", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 4px, transparent 4px 200px), linear-gradient(180deg, #5a4030, #2c2017)" };
const Piso: React.FC = () => <div style={{ position: "absolute", left: -2000, right: -2000, top: 860, height: 600, background: "linear-gradient(180deg, #4a3526, #2a1d14)", boxShadow: "0 -6px 18px rgba(0,0,0,0.5)" }} />;

// (1) carrusel: fila de cajas grandes apoyadas en el piso; la cámara viaja en curva de una a la siguiente; cada caja cae con peso al llegar
export const MuroCajas: React.FC<{ cards: Card[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame();
  const W = 600, GX = 700, n = cards.length;
  const p = interpolate(f, [6, dur - 10], [0, 1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const camX = lerp(W / 2, (n - 1) * GX + W / 2, p), camY = 540 + 30 * Math.sin(p * Math.PI * 3);
  return (
    <AbsoluteFill style={{ ...Bodega, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${960 - camX}px, ${540 - camY}px)` }}>
        <Piso />
        {cards.map((c, i) => {
          const x = i * GX, xc = x + W / 2;
          const arrive = Math.round(6 + ((xc - W / 2 - 700) / Math.max(1, (n - 1) * GX)) * (dur - 16));
          const k = i === 0 ? spring({ frame: f, fps: 30, config: { damping: 11, mass: 1.1 } }) : spring({ frame: f - arrive, fps: 30, config: { damping: 11, mass: 1.1 } });
          if (k <= 0.001) return null;
          return (
            <React.Fragment key={i}>
              <Sombra x={xc} y={866} w={W * 1.05} h={40} o={k} />
              <div style={{ position: "absolute", left: x, top: 866 - W * 0.78, transform: `translateY(${(1 - k) * -900}px) rotate(${((hash(i + 3) % 5) - 2) * 0.6}deg)`, transformOrigin: "50% 100%" }}>
                <Caja n={i + 1} title={c.title} src={c.src} w={W} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// (10) recap: n=0 → las 10 cajas caen de a una en dos estantes con su número grande; n>0 → sólo la caja n en primer plano y un pizarrón al lado
export const RecapCajas: React.FC<{ n: number; cards: Card[]; lines: string[]; dur: number }> = ({ n, cards, lines, dur }) => {
  const f = useCurrentFrame();
  if (n === 0) {
    const W = 330, GX = 360;
    return (
      <AbsoluteFill style={{ ...Bodega, overflow: "hidden" }}>
        {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 60, right: 60, top: 470 + r * 400, height: 26, ...PINE, backgroundColor: M.pineD, boxShadow: "0 14px 20px rgba(0,0,0,0.5)" }} />)}
        {cards.map((c, i) => {
          const col = i % 5, row = Math.floor(i / 5); const k = spring({ frame: f - i * 3, fps: 30, config: { damping: 10, mass: 1 } });
          const x = 960 - GX * 2.5 + col * GX + (GX - W) / 2, yb = 470 + row * 400;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: yb - W * 0.78, transform: `translateY(${(1 - k) * -1000}px)` }}>
              <Caja n={i + 1} src={c.src} w={W} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: SERIF, fontSize: 70, color: M.chalk, textShadow: TXTSH, opacity: seg(f, 20, 32) }}>las diez, en orden</div>
      </AbsoluteFill>
    );
  }
  const c = cards[n - 1]; const k = spring({ frame: f - 2, fps: 30, config: { damping: 11, mass: 1.1 } }); const b = spring({ frame: f - 10, fps: 30, config: { damping: 12, mass: 1 } });
  const W = 720;
  return (
    <AbsoluteFill style={{ ...Bodega, overflow: "hidden" }}>
      <Piso />
      <Sombra x={110 + W / 2} y={870} w={W * 1.05} h={44} o={k} />
      <div style={{ position: "absolute", left: 110, top: 866 - W * 0.78, transform: `translateY(${(1 - k) * -1000}px) rotate(-1deg)` }}>
        <Caja n={n} title={c?.title} src={c?.src ?? ""} w={W} big />
      </div>
      <div style={{ position: "absolute", left: 930, top: 170, width: 900, transform: `translateX(${(1 - b) * 1200}px) rotate(1deg)`, ...BOARD, border: `22px solid ${M.pineD}`, boxSizing: "border-box", boxShadow: "0 30px 50px rgba(0,0,0,0.55)", padding: "40px 48px 48px" }}>
        {lines.map((l, i) => <Gis key={i} t={l} f0={16 + i * 22} len={16} size={52} font={SERIF} style={{ marginTop: i ? 30 : 0, whiteSpace: "normal", lineHeight: 1.1 }} />)}
      </div>
    </AbsoluteFill>
  );
};

// (3) apertura de cada cosa: estaca de madera clavada en el suelo a la derecha; el cartel cae, se clava y se mece con «n · título»
export const Caballete: React.FC<{ n: number; title: string; img: string; dur: number }> = ({ n, title, img, dur }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 2, fps: 30, config: { damping: 9, mass: 1.2, stiffness: 150 } });
  const sw = swingK(f, 12, 2.5, 18);
  const a = seg(f, 0, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(900, 980, a), lerp(600, 500, a) - 30 * Math.sin(a * Math.PI), lerp(1.04, 1.14, a))}><Img src={staticFile(img)} style={FOTO} /></div>
      <Sombra x={1600} y={1010} w={260} h={40} o={k} />
      <div style={{ position: "absolute", left: 1600, top: 1010, transformOrigin: "0 0", transform: `translateY(${(1 - k) * -1300}px) rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: -16, top: -560, width: 32, height: 570, borderRadius: 4, background: "linear-gradient(90deg, #8a5d35, #b07f4e 50%, #6e4626)", boxShadow: "8px 0 12px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: -380, top: -880, width: 720, padding: "34px 44px 40px", boxSizing: "border-box", ...WOODB, borderRadius: 10, boxShadow: "20px 28px 40px rgba(0,0,0,0.5), inset 0 -8px 0 rgba(0,0,0,0.22)" }}>
          <div style={{ fontFamily: SERIF, fontSize: title.length > 22 ? 70 : 92, lineHeight: 1.02, color: "#FFF4DE", textShadow: "0 3px 0 rgba(0,0,0,0.35)" }}><span style={{ color: "#FFD08A" }}>{n} · </span>{title}</div>
        </div>
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
      <div style={{ position: "absolute", left: 180, top: 100, width: 24, height: 200, background: "linear-gradient(90deg, #8a5d35, #b07f4e 50%, #6e4626)" }} />
      <div style={{ width: 384, padding: "16px 0 22px", textAlign: "center", ...WOODB, borderRadius: 8, boxShadow: "14px 20px 26px rgba(0,0,0,0.5)", fontFamily: SERIF, fontSize: 64, color: "#FFF4DE", textShadow: "0 3px 0 rgba(0,0,0,0.35)" }}>{n} de 10</div>
    </div>
  );
};

// libro: sobre la mesa de madera; en la página nombrada sale del libro una hoja grande con la ficha y queda apoyada al lado
export const LibroCaja: React.FC<{ src: string; tabs: { p: string; t: string; f: number }[]; dur: number }> = ({ src, tabs, dur }) => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f - 2, fps: 30, config: { damping: 12, mass: 1.1 } }); const a = seg(f, 0, dur);
  const t0 = tabs[0]; const pg = t0 ? spring({ frame: f - t0.f, fps: 30, config: { damping: 12, mass: 1 } }) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#5b3d25", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 3px, transparent 3px 180px), repeating-linear-gradient(90deg, rgba(255,220,170,0.05) 0 2px, transparent 2px 23px), linear-gradient(180deg, #6b4a2e, #4a3020)" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "760px 560px", transform: `scale(${lerp(1.0, 1.08, a)})` }}>
        <div style={{ position: "absolute", left: 220, top: 120, width: 560, transform: `translateY(${(1 - enter) * 1000}px) rotate(-4deg)`, boxShadow: "40px 50px 60px rgba(0,0,0,0.55)" }}>
          <Img src={staticFile(src)} style={{ width: 560, display: "block" }} />
        </div>
        {t0 && pg > 0.001 && (
          <div style={{ position: "absolute", left: lerp(520, 900, pg), top: lerp(260, 170, pg), width: 820, height: 740, transform: `rotate(${lerp(-4, 3, pg)}deg)`, ...PAPER, boxShadow: "30px 40px 50px rgba(0,0,0,0.5)", padding: "56px 64px", boxSizing: "border-box", opacity: Math.min(1, pg * 3) }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: 4, color: M.stamp }}>pág. {t0.p}</div>
            <div style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.05, color: M.ink, marginTop: 24 }}>{t0.t}</div>
            <div style={{ position: "absolute", left: 64, right: 64, bottom: 70, height: 220, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 40px, rgba(70,60,40,0.18) 40px 42px)" }} />
          </div>
        )}
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
      <div style={{ position: "absolute", left: x + 34, top: y - 40, fontFamily: SERIF, fontSize: 56, color: M.ink, opacity: cl(p * 2 - 0.6, 0, 1), ...KRAFTB, padding: "6px 20px 10px", boxShadow: "8px 12px 16px rgba(0,0,0,0.35)" }}>{tt}</div>
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
export const Recuerdo: React.FC<{ img: string; head: string; quote?: string; who?: string; fQuote?: number; dur: number }> = ({ img, head, quote, who, fQuote = 12, dur }) => {
  const f = useCurrentFrame();
  const t = seg(f, 0, dur); const f0 = quote ? fQuote : 10;
  const k = spring({ frame: f - f0, fps: 30, config: { damping: 11, mass: 1 } });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(900, 860, t), lerp(560, 520, t) - 20 * Math.sin(t * Math.PI), lerp(1.03, 1.12, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      {f >= f0 && (
        <div style={{ position: "absolute", left: 1150, top: 620, width: 680, transform: `translateY(${(1 - k) * 700}px) rotate(${lerp(10, -3, k)}deg)`, ...PAPER, boxShadow: "18px 26px 34px rgba(0,0,0,0.5)", padding: "34px 44px 34px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: SERIF, fontSize: quote ? 54 : 58, lineHeight: 1.1, color: M.ink }}>{quote ? `«${quote}»` : head}</div>
          {quote && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: M.stamp, marginTop: 14 }}>— {head}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// engomados → etiquetas de vivero atadas con hilo al punto exacto de la foto; una por vez (la anterior cae); cámara curva hacia cada punto
export type Peg = { x: number; y: number; t: string; sub?: string; f: number; r?: number };
export const Engomados: React.FC<{ img: string; items: Peg[]; seed: number; dur: number; zoom?: [number, number]; o?: [number, number] }> = ({ img, items, dur }) => {
  const f = useCurrentFrame();
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
          return <Atada key={i} x={tx} y={ty} t={m.t} sub={m.sub} f0={m.f} fOut={nx ? nx.f - 10 : undefined} size={62} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// pizarrón de banqueta apoyado a la izquierda: entra justo antes del primer renglón (nunca vacío), título grande, renglones de a uno
export const Pizarron: React.FC<{ img: string; head: string; lines: { t: string; f: number }[]; seed: number; dur: number; foot?: string }> = ({ img, head, lines, dur }) => {
  const f = useCurrentFrame();
  const fIn = Math.max(0, (lines[0]?.f ?? 20) - 24);
  const k = spring({ frame: f - fIn, fps: 30, config: { damping: 12, mass: 1.1 } });
  const t = seg(f, 0, dur);
  const on = f >= fIn;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(960, on ? 1180 : 1000, seg(f, 0, fIn + 20)), lerp(540, 520, t) - 20 * Math.sin(t * Math.PI), lerp(1.04, 1.16, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      {on && (
        <div style={{ position: "absolute", left: 50, top: 110, width: 820, transformOrigin: "50% 100%", transform: `translateY(${(1 - k) * 1100}px) rotate(-1.5deg)` }}>
          <div style={{ position: "absolute", left: 80, top: 760, width: 30, height: 260, ...PINE, backgroundColor: M.pineD, transform: "rotate(-6deg)" }} />
          <div style={{ position: "absolute", left: 710, top: 760, width: 30, height: 260, ...PINE, backgroundColor: M.pineD, transform: "rotate(6deg)" }} />
          <div style={{ width: 820, minHeight: 780, ...BOARD, border: `24px solid ${M.pineD}`, boxSizing: "border-box", boxShadow: "20px 30px 50px rgba(0,0,0,0.55)", padding: "44px 48px" }}>
            <Gis t={head.charAt(0) + head.slice(1).toLowerCase()} f0={fIn + 8} len={12} size={56} font={SERIF} style={{ color: "#FFD08A", whiteSpace: "normal", lineHeight: 1.05 }} />
            <div style={{ height: 3, margin: "20px 0 4px", background: "rgba(241,238,228,0.3)", width: `${seg(f, fIn + 14, fIn + 24) * 100}%` }} />
            {lines.map((l, i) => <Gis key={i} t={l.t} f0={l.f} len={Math.min(18, 6 + l.t.length * 0.5)} size={l.t.length > 26 ? 50 : 58} font={SERIF} style={{ marginTop: 22, whiteSpace: "normal", lineHeight: 1.1 }} />)}
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
        <div style={{ position: "absolute", left: CAL.x, top: CAL.y + 10, width: CAL.w, textAlign: "center", fontFamily: SERIF, fontSize: 30, color: M.ink, opacity: seg(f, 30, 40) }}>{foot.split("·")[0].trim()}</div>
        {MES.map((m, i) => {
          const col = i % 3, row = Math.floor(i / 3); const f0 = 36 + i * 4; const key = i % 3 === 0; const fk = 36 + 12 * 4 + 10 + (i / 3) * 12;
          const x = CAL.x + col * cw, y = CAL.y + 60 + row * ch;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: cw, height: ch, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: 30, color: key && f >= fk ? M.stamp : "#3a3028", WebkitMaskImage: `linear-gradient(90deg, #000 ${seg(f, f0, f0 + 6) * 100}%, transparent ${seg(f, f0, f0 + 6) * 100 + 5}%)` }}>{m}</div>
              {key && f >= fk && <div style={{ position: "absolute", left: 10, top: 6, right: 10, bottom: 6, borderRadius: "50%", border: `3px solid ${M.stamp}`,
                WebkitMaskImage: `conic-gradient(#000 ${seg(f, fk, fk + 8) * 360}deg, transparent ${seg(f, fk, fk + 8) * 360}deg)` }} />}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: CAL.x, top: CAL.y + CAL.h - 10, width: CAL.w, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: M.stamp, opacity: seg(f, 110, 120) }}>{(foot.split("·")[1] ?? "").trim()}</div>
      </div>
    </AbsoluteFill>
  );
};

// mitos: sello de goma que golpea sobre cada remedio, en el plano de la mesa; la cámara viaja en curva del anterior al nuevo
export type Sello = { x: number; y: number; t: string; f: number; r?: number };
export const Sellos: React.FC<{ img: string; items: Sello[]; dur: number; zoomTo?: { x: number; y: number } }> = ({ img, items, dur }) => {
  const f = useCurrentFrame();
  const last = items[items.length - 1], prev = items.length > 1 ? items[items.length - 2] : null;
  const u = seg(f, Math.max(0, last.f - 30), last.f);
  const cx = prev ? lerp(prev.x, last.x, u) : lerp(960, last.x, u), cy = (prev ? lerp(prev.y, last.y, u) : lerp(540, last.y, u)) - 40 * Math.sin(u * Math.PI);
  const s = lerp(1.3, 1.45, seg(f, 0, dur));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(cx, cy, s)}>
        <Img src={staticFile(img)} style={FOTO} />
        {items.map((it, i) => {
          if (f < it.f) return null;
          const hit = seg(f, it.f, it.f + 4, Easing.in(Easing.quad)); const reb = f > it.f + 4 ? Math.exp(-(f - it.f - 4) / 4) * Math.sin((f - it.f - 4) / 1.5) * 0.04 : 0;
          const r = it.r ?? (i % 2 ? 7 : -8);
          return (
            <div key={i} style={{ position: "absolute", left: it.x, top: it.y, transform: `translate(-50%, -50%) perspective(900px) rotateX(38deg) rotate(${r}deg) scale(${lerp(1.6, 1, hit) + reb})`, opacity: lerp(0, 0.92, hit),
              border: `8px solid ${M.stamp}`, borderRadius: 10, padding: "12px 30px", fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: 6, color: M.stamp, whiteSpace: "nowrap",
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
  const t = seg(f, 0, dur); const k = spring({ frame: f - 6, fps: 30, config: { damping: 9, mass: 1, stiffness: 140 } }); const sw = swingK(f, 14, 3, 24);
  const line = seg(f, 0, 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(960, 900, t), lerp(600, 640, t), lerp(1.04, 1.14, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      <div style={{ position: "absolute", left: 0, top: 54, width: 1920 * line, height: 7, backgroundImage: TWN, boxShadow: "0 5px 5px rgba(0,0,0,0.35)" }} />
      {f >= 6 && (
        <div style={{ position: "absolute", left: 120, top: 50, width: 1000, transformOrigin: "500px 0", transform: `translateY(${(1 - k) * -500}px) rotate(${sw}deg)` }}>
          {[140, 860].map((x) => <div key={x} style={{ position: "absolute", left: x - 12, top: -16, width: 24, height: 64, borderRadius: 4, background: "linear-gradient(90deg, #c9a16b, #e8cc9c 50%, #a8804c)", boxShadow: "3px 4px 5px rgba(0,0,0,0.4)", zIndex: 2 }} />)}
          <div style={{ marginTop: 30, padding: "30px 46px 26px", ...KRAFTB, boxShadow: "18px 26px 34px rgba(0,0,0,0.45)" }}>
            <div style={{ fontFamily: SERIF, fontSize: 58, lineHeight: 1.08, color: M.ink }}>{quote}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: M.stamp, marginTop: 14, opacity: seg(f, 30, 40) }}>{source}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// pregunta: hoja de papel de estraza acostada sobre la mesa (perspectiva), la pregunta se escribe a mano renglón a renglón
export const Bolsa: React.FC<{ img: string; n: number; text: string; dur: number }> = ({ img, n, text, dur }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 2, fps: 30, config: { damping: 12, mass: 1.1 } }); const t = seg(f, 0, dur);
  const w = seg(f, 14, 14 + Math.min(70, text.length * 1.3), Easing.linear);
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1500 }}>
      <div style={camC(lerp(900, 760, t), lerp(560, 640, t), lerp(1.04, 1.16, t))}><Img src={staticFile(img)} style={FOTO} /></div>
      <div style={{ position: "absolute", left: 110, top: 470, width: 900, transformOrigin: "50% 100%", transform: `translateX(${(1 - k) * -1300}px) rotateX(34deg) rotate(${n % 2 ? -7 : -9}deg)` }}>
        <div style={{ padding: "42px 54px 50px", backgroundColor: "#B88E5C", backgroundImage: "repeating-linear-gradient(90deg, rgba(90,60,25,0.12) 0 2px, transparent 2px 60px), linear-gradient(180deg, rgba(255,230,190,0.18), rgba(80,50,20,0.15))", boxShadow: "22px 30px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 4, color: M.stamp }}>{n ? `Me preguntaron · ${n}` : "Cuéntame en los comentarios"}</div>
          <div style={{ fontFamily: SERIF, fontSize: text.length > 50 ? 70 : 80, lineHeight: 1.08, color: M.ink, marginTop: 18, WebkitMaskImage: `linear-gradient(180deg, #000 ${w * 100}%, transparent ${w * 100 + 8}%)` }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA: la caja del próximo video cae y se apoya en el piso de piedra; el cartel SUSCRÍBETE cuelga de una rama del naranjo y se mece
export const CTACaja: React.FC<{ img: string; next: string; nextImg: string; dur: number }> = ({ img, next, nextImg, dur }) => {
  const f = useCurrentFrame();
  const c = spring({ frame: f - 6, fps: 30, config: { damping: 10, mass: 1.2 } }); const t = seg(f, 0, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={camC(lerp(980, 1060, t), lerp(560, 600, t) - 20 * Math.sin(t * Math.PI), lerp(1.04, 1.1, t))}>
        <Img src={staticFile(img)} style={FOTO} />
        <Sombra x={1440} y={990} w={640} h={50} o={c} />
        <div style={{ position: "absolute", left: 1130, top: 990 - 620 * 0.78 - 70, transform: `translateY(${(1 - c) * -1100}px) rotate(1deg)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: 5, color: "#FFF4DE", textShadow: TXTSH, marginBottom: 14, textAlign: "center", width: 620 }}>EL QUE SIGUE</div>
          <Caja n={0} title={next} src={nextImg} w={620} big />
        </div>
        <Atada x={430} y={560} t="SUSCRÍBETE" f0={34} len={150} size={84} />
      </div>
    </AbsoluteFill>
  );
};
