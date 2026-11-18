// Huerto.tsx — kit de hue14a (El Huerto de Claudio). Puro CSS y DOM con materiales del huerto:
// papel kraft, madera de estaca, hilo de cáñamo, arpillera, barro, bambú, pinzas de ropa. Sin SVG, sin grano, sin viñeta.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS, hash } from "./Piezas";

const { SERIF, SANS } = FONTS; const HANDF = FONTS.HAND;
export const H = { kraft: "#C9A36A", kraftD: "#A9824C", cream: "#F5EDDC", ink: "#2B2118", leaf: "#3F6B35", leafL: "#8DB255", terra: "#B4552E", wood: "#7B5132", twine: "#C7A468" };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sp = (f: number, d = 14, m = 0.8) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const outF = (f: number, dur: number, len = 10) => interpolate(f, [dur - len, dur], [1, 0], CL);
// péndulo amortiguado (para todo lo que cuelga de un hilo)
const swing = (f: number, amp: number, per = 26, tau = 22) => (f < 0 ? 0 : amp * Math.exp(-f / tau) * Math.cos((f / per) * Math.PI * 2));

// ---------- materiales
const KRAFT: React.CSSProperties = {
  backgroundColor: H.kraft,
  backgroundImage: "repeating-linear-gradient(17deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px), repeating-linear-gradient(-71deg, rgba(255,240,210,0.06) 0 1px, transparent 1px 5px), radial-gradient(ellipse at 30% 20%, rgba(255,235,195,0.35), transparent 60%)",
};
const WOOD: React.CSSProperties = {
  backgroundColor: H.wood,
  backgroundImage: "repeating-linear-gradient(90deg, rgba(40,22,10,0.22) 0 2px, transparent 2px 9px, rgba(255,210,160,0.08) 9px 11px, transparent 11px 17px), linear-gradient(90deg, #6d4529, #8a5e3a 45%, #6f4628)",
};
const TABLE: React.CSSProperties = {
  backgroundColor: "#6b4a30",
  backgroundImage: "repeating-linear-gradient(0deg, rgba(30,18,8,0.28) 0 2px, transparent 2px 120px), repeating-linear-gradient(0deg, rgba(255,220,170,0.05) 0 1px, transparent 1px 6px), linear-gradient(180deg, #74513a, #5a3d27)",
};
const BURLAP: React.CSSProperties = {
  backgroundColor: "#A88653",
  backgroundImage: "repeating-linear-gradient(0deg, rgba(60,38,15,0.38) 0 3px, transparent 3px 7px), repeating-linear-gradient(90deg, rgba(60,38,15,0.32) 0 3px, transparent 3px 8px), linear-gradient(180deg, rgba(255,230,180,0.12), rgba(0,0,0,0.12))",
};
const TWINE: React.CSSProperties = { backgroundImage: "repeating-linear-gradient(60deg, #D2B07A 0 4px, #A07B45 4px 7px)", boxShadow: "0 2px 3px rgba(0,0,0,0.35)" };
const TXTSH = "0 2px 12px rgba(0,0,0,0.65)";

// ---------- foto con cámara lenta y balanceo de mano (sin temblor)
export const Foto: React.FC<{ src: string; seed: number; dur: number; zoom?: [number, number]; o?: [number, number] }> = ({ src, seed, dur, zoom, o }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const inn = hash(seed) % 2 === 0;
  const [z0, z1] = zoom ?? (inn ? [1.04, 1.13] : [1.13, 1.04]);
  const z = lerp(z0, z1, Easing.inOut(Easing.sin)(t));
  const sx = Math.sin(f / 61 + seed) * 6, sy = Math.cos(f / 77 + seed * 2) * 4, r = Math.sin(f / 95 + seed) * 0.25;
  const ox = o ? o[0] : 35 + (hash(seed + 5) % 30), oy = o ? o[1] : 35 + (hash(seed + 7) % 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: H.ink }}>
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
    <AbsoluteFill style={{ overflow: "hidden", background: H.ink }}>
      <OffthreadVideo src={staticFile(src)} muted={volume === 0} volume={volume} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${sx}px, ${sy}px) scale(${z})` }} />
    </AbsoluteFill>
  );
};

// ---------- (4) avatar con punch-in y corrimiento para el 50/50
export const AvatarH: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[] }> = ({ src, seed, dur, mods = [] }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  let z = hash(seed + 99) % 3 !== 0 ? 1.03 + 0.05 * t : 1.08 - 0.05 * t, tx = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: io });
    if (m.k === "punch") z *= 1 + 0.13 * w;
    if (m.k === "split") { z *= 1 + 0.1 * w; tx += -14 * w; }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: H.ink }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "43% 28%" }} />
    </AbsoluteFill>
  );
};

// ---------- física de objetos (vuelta 2 del EVALUADOR): todo cuelga, cae, rebota y deja sombra
const bounce = (f: number, d = 0) => spring({ frame: f - d, fps: 30, config: { damping: 8, mass: 0.9, stiffness: 150 } });
const hit = (f: number, d: number, amp = 1) => (f < d ? 0 : amp * Math.exp(-(f - d) / 5) * Math.sin((f - d) * 1.9));
const fall = (f: number, d: number, len = 8, h = 700) => interpolate(f, [d, d + len], [-h, 0], { ...CL, easing: Easing.in(Easing.quad) });
const Rope: React.FC<{ x1: number; y1: number; x2: number; y2: number; th?: number }> = ({ x1, y1, x2, y2, th = 6 }) => {
  const L = Math.hypot(x2 - x1, y2 - y1), a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return <div style={{ position: "absolute", left: x1, top: y1 - th / 2, width: L + 1, height: th, borderRadius: th, ...TWINE, transformOrigin: `0 ${th / 2}px`, transform: `rotate(${a}deg)` }} />;
};
const sagY = (x1: number, y1: number, x2: number, y2: number, sag: number, x: number) => { const t = cl((x - x1) / (x2 - x1), 0, 1); return lerp(y1, y2, t) + sag * 4 * t * (1 - t); };
const Sag: React.FC<{ x1: number; y1: number; x2: number; y2: number; sag: number; th?: number }> = ({ x1, y1, x2, y2, sag, th = 7 }) => {
  const N = 10; const P = Array.from({ length: N + 1 }, (_, i) => { const x = lerp(x1, x2, i / N); return [x, sagY(x1, y1, x2, y2, sag, x)]; });
  return <>{P.slice(0, -1).map((p, i) => <Rope key={i} x1={p[0]} y1={p[1]} x2={P[i + 1][0]} y2={P[i + 1][1]} th={th} />)}</>;
};
const Shadow: React.FC<{ x: number; y: number; w: number; h?: number; o?: number }> = ({ x, y, w, h = w * 0.22, o = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", opacity: o, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6), rgba(0,0,0,0.28) 45%, transparent 70%)" }} />
);
const Tack: React.FC<{ x: number; y: number; c?: string; s?: number }> = ({ x, y, c = "#B4321C", s = 40 }) => (
  <>
    <div style={{ position: "absolute", left: x - s / 2 + s * 0.22, top: y - s / 2 + s * 0.3, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.45), transparent 70%)" }} />
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #fff8 0 8%, ${c} 30%, rgba(0,0,0,0.55) 100%)`, boxShadow: "inset -3px -4px 6px rgba(0,0,0,0.35)" }} />
  </>
);
const Nail: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #e8e8e8, #8a8a8a 55%, #4a4a4a)", boxShadow: "3px 4px 5px rgba(0,0,0,0.45)" }} />
);
// polvo de tierra al clavar algo: grumos que saltan y caen
const Dust: React.FC<{ x: number; y: number; f0: number; n?: number; seed?: number }> = ({ x, y, f0, n = 14, seed = 1 }) => {
  const f = useCurrentFrame(); const t = f - f0; if (t < 0 || t > 26) return null;
  return <>{Array.from({ length: n }).map((_, i) => {
    const a = Math.PI * (0.1 + 0.8 * ((hash(seed * 13 + i) % 1000) / 1000)), v = 6 + (hash(seed * 7 + i) % 9);
    const px = x + Math.cos(a) * v * t * (i % 2 ? 1 : -1), py = y - Math.sin(a) * v * t + 0.55 * t * t; const s = 5 + (hash(i + seed) % 8);
    return <div key={i} style={{ position: "absolute", left: px, top: py, width: s, height: s * 0.8, borderRadius: "45%", background: i % 3 ? "#6b4a2c" : "#8a6a48", opacity: cl(1 - t / 26, 0, 1) }} />;
  })}</>;
};

// 50/50: tabla de madera con grosor que entra con inercia y empuja al avatar (el corrimiento lo hace AvatarH con mods split)
export const SplitTabla: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = bounce(f, 0); const out = interpolate(f, [dur - 12, dur], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const x = (1 - p) * 980 + out * 980;
  return (
    <div style={{ position: "absolute", top: -10, bottom: -10, right: -10, width: 930, transform: `translateX(${x}px)` }}>
      <div style={{ position: "absolute", left: -60, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.45))" }} />
      <div style={{ position: "absolute", inset: 0, ...WOOD, boxShadow: "-24px 0 40px rgba(0,0,0,0.55)" }} />
      <div style={{ position: "absolute", left: -22, top: 0, bottom: 0, width: 22, background: "linear-gradient(90deg, #4e321d, #7b5132)" }} />
      <div style={{ position: "absolute", left: 26, top: 36, right: 36, bottom: 36, overflow: "hidden", boxShadow: "inset 0 0 0 3px rgba(40,22,10,0.6), 0 0 0 2px rgba(255,220,170,0.15)" }}>
        <Foto src={src} seed={seed} dur={dur} zoom={[1.04, 1.16]} />
      </div>
      <Nail x={14} y={60} /><Nail x={14} y={1040} />
    </div>
  );
};
// polaroid: entra deslizándose por un hilo que cruza el cuadro, se mece y al final se suelta y cae
export const Pinza: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 34, height: 92, ...WOOD, backgroundImage: "linear-gradient(90deg, #b88a5a, #d9b07c 50%, #b2824f)", borderRadius: 4, boxShadow: "0 4px 8px rgba(0,0,0,0.4)", ...style }}>
    <div style={{ position: "absolute", left: 6, right: 6, top: 38, height: 10, background: "#8d8f92", borderRadius: 3 }} />
  </div>
);
export const PolaroidH: React.FC<{ src: string; caption: string; dur: number; seed?: number }> = ({ src, caption, dur, seed = 1 }) => {
  const f = useCurrentFrame();
  const R = { x1: -20, y1: 58, x2: 1940, y2: 96, sag: 46 };
  const s = sp(f, 18, 1); const cx = lerp(2150, 1430, s); const cy = sagY(R.x1, R.y1, R.x2, R.y2, R.sag, cx);
  const r = (hash(seed) % 2 ? 1 : -1) * 2 + swing(f - 14, 7, 32, 28) + (1 - s) * -10;
  const ry = Math.sin(f / 23) * 6 * Math.exp(-f / 60);
  const rel = Math.max(0, f - (dur - 16)); const dropY = 0.9 * rel * rel * 1.6, dropR = rel * 2.2;
  const g = interpolate(f, [18, 38], [-40, 140], CL);
  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      <Sag {...R} th={6} />
      <div style={{ position: "absolute", left: cx - 300, top: cy + 28, width: 600, transformOrigin: "300px -28px", transform: `translateY(${dropY}px) rotate(${r + dropR}deg) rotateY(${ry}deg)` }}>
        <div style={{ background: "#FBF7EE", padding: "20px 20px 96px", boxShadow: "18px 30px 46px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden" }}>
          <Img src={staticFile(src)} style={{ width: 560, height: 460, objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontSize: 50, color: H.ink }}>{caption}</div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${g - 18}%, rgba(255,255,255,0.32) ${g}%, transparent ${g + 18}%)` }} />
        </div>
      </div>
      <Pinza style={{ left: cx - 17, top: cy - 22, transform: `rotate(${r * 0.3}deg)` }} />
    </AbsoluteFill>
  );
};

// transición de capítulo: corte limpio (la arpillera marrón se sacó en la vuelta 2)
export const Arpillera: React.FC<{ dir?: number; len?: number }> = () => null;

// ---------- sobre de semillas: solapa doblada, ventanita con la foto y el número grande
const Paquete: React.FC<{ n: number; title?: string; src: string; w: number; done?: number; big?: boolean }> = ({ n, src, w, done = 0 }) => {
  const h = w * 1.42;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, ...KRAFT, borderRadius: 3, boxShadow: "inset -6px 0 0 rgba(0,0,0,0.08), inset 0 -8px 0 rgba(0,0,0,0.1)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.2, ...KRAFT, backgroundColor: H.kraftD, clipPath: "polygon(0 0, 100% 0, 50% 100%)", boxShadow: "0 6px 8px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: w * 0.47, top: h * 0.19, width: w * 0.06, height: w * 0.06, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #c0503a, #7a2416)", boxShadow: "0 2px 3px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: h * 0.27, height: w * 0.62, overflow: "hidden", boxShadow: "inset 0 0 0 3px rgba(60,38,15,0.5)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: done ? `saturate(${1 - 0.6 * done}) brightness(${1 - 0.25 * done})` : undefined }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.27 + w * 0.64, textAlign: "center", fontFamily: SERIF, fontSize: w * 0.36, lineHeight: 1, color: H.ink }}>{n}</div>
      {done > 0 && <div style={{ position: "absolute", left: -w * 0.04, right: -w * 0.04, top: h * 0.5, height: w * 0.05, ...TWINE, transform: `scaleX(${done}) rotate(-8deg)`, transformOrigin: "0 50%" }} />}
    </div>
  );
};
export type Card = { title: string; src: string };

// carrusel: los 10 sobres sobre la mesa en perspectiva; la mesa corre y el que cruza el centro se levanta hacia cámara
export const Carrusel: React.FC<{ cards: Card[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame();
  const W = 330, GAP = 80, step = W + GAP, total = step * (cards.length - 1);
  const pan = interpolate(f, [6, dur - 16], [0, total], { ...CL, easing: io });
  const out = interpolate(f, [dur - 12, dur], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 230, transformStyle: "preserve-3d", transform: `rotateX(22deg) translateX(${-pan}px) translateY(${out * 900}px)` }}>
          {cards.map((c, i) => {
            const d = (i * step - pan) / step; const lift = Math.max(0, 1 - Math.abs(d)) ** 1.5;
            const enter = bounce(f, i * 2);
            return (
              <div key={i} style={{ position: "absolute", left: i * step, top: 0, transformStyle: "preserve-3d" }}>
                <Shadow x={W / 2 + lift * 30} y={W * 1.42 + 20 + lift * 40} w={W * (1.05 + lift * 0.3)} h={60 + lift * 30} o={0.8 - lift * 0.35} />
                <div style={{ transform: `translateY(${(1 - enter) * -600 - lift * 60}px) translateZ(${lift * 200}px) rotateX(${-lift * 16}deg) rotateZ(${((hash(i + 3) % 7) - 3) * (1 - lift)}deg)` }}>
                  <Paquete n={i + 1} src={c.src} w={W} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// recap: los 10 sobres caen sobre la mesa uno por uno; el del número dicho se adelanta con UNA ficha grande
export const RecapPaquetes: React.FC<{ n: number; cards: Card[]; lines: string[]; dur: number }> = ({ n, cards, lines, dur }) => {
  const f = useCurrentFrame();
  const W = 220, gx = 290, gy = 400, x0 = 960 - gx * 2 - W / 2, y0 = 90;
  const sel = n > 0 ? sp(f - 4, 16) : 0;
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden", perspective: 1800 }}>
      {cards.map((c, i) => {
        const k = i + 1; const col = i % 5, row = Math.floor(i / 5);
        const e = n === 0 ? bounce(f, i * 4) : 1; const land = n === 0 ? hit(f, i * 4 + 9, 3) : 0;
        const isSel = k === n; const done = n > 0 && k < n ? 1 : 0;
        const x = x0 + col * gx + ((hash(k) % 30) - 15), y = y0 + row * gy + ((hash(k + 9) % 24) - 12);
        const tx = isSel ? lerp(x, 150, sel) : x, ty = isSel ? lerp(y, 170, sel) : y, sc = isSel ? lerp(1, 2.1, sel) : 1;
        const rz = isSel ? lerp((hash(k) % 11) - 5, -2, sel) : (hash(k) % 11) - 5;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", zIndex: isSel ? 5 : 1, opacity: isSel || n === 0 ? 1 : 1 - 0.6 * sel,
            transform: `translate(${tx}px, ${ty}px) scale(${sc})` }}>
            <Shadow x={W / 2 + 14} y={W * 1.42 + 10} w={W * 1.15} h={46} o={e} />
            <div style={{ transform: `translateY(${(1 - e) * -700}px) rotateX(${(1 - e) * 40}deg) rotate(${rz + land}deg)`, transformOrigin: "50% 100%" }}>
              <Paquete n={k} src={c.src} w={W} done={done} />
            </div>
          </div>
        );
      })}
      {n > 0 && (
        <div style={{ position: "absolute", zIndex: 20, left: 760, top: 300, width: 1040, padding: "50px 60px 56px", ...KRAFT, boxShadow: "26px 34px 50px rgba(0,0,0,0.5)", transform: `translateX(${(1 - bounce(f, 10)) * 1300}px) rotate(1deg)` }}>
          <Tack x={520} y={10} c="#3f6b35" />
          <div style={{ fontFamily: SERIF, fontSize: 96, lineHeight: 1.02, color: H.ink }}>{cards[n - 1]?.title}</div>
          {lines[0] && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 58, lineHeight: 1.1, color: H.leaf, marginTop: 22, opacity: cl((f - 24) / 8, 0, 1) }}>{lines[0]}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};

// apertura de razón: estaca clavada al costado (polvo), brazo de madera y cartel que cuelga de dos hilos y se mece con peso
export const Estaca: React.FC<{ n: number; title: string; img: string; dur: number }> = ({ n, title, img, dur }) => {
  const f = useCurrentFrame();
  const sy = fall(f, 2, 7, 900) + hit(f, 9, 10); const arm = sp(f - 10, 12);
  const hang = bounce(f, 14); const r = swing(f - 20, 5, 36, 26);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={n * 7 + 1} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,14,8,0.45) 0%, rgba(20,14,8,0.1) 50%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: 150, top: 1030, width: 260, height: 26, transform: "skewX(-50deg)", background: "linear-gradient(90deg, rgba(0,0,0,0.45), transparent)", opacity: cl((f - 8) / 4, 0, 1) }} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 52, height: 960, transform: `translateY(${sy}px)`, ...WOOD, clipPath: "polygon(0 0, 100% 0, 100% 94%, 50% 100%, 0 94%)", boxShadow: "8px 0 14px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: 160, top: 150, width: 900 * arm, height: 34, transform: `translateY(${sy}px)`, ...WOOD, borderRadius: 4, boxShadow: "0 10px 14px rgba(0,0,0,0.4)" }} />
      <Dust x={146} y={1060} f0={9} seed={n} />
      <div style={{ position: "absolute", left: 230, top: 184, width: 820, transformOrigin: "410px -40px", transform: `translateY(${(1 - hang) * -700}px) rotate(${r}deg)`, opacity: arm > 0.95 ? 1 : 0 }}>
        <Rope x1={90} y1={-34} x2={90} y2={40} /><Rope x1={730} y1={-34} x2={730} y2={40} />
        <div style={{ marginTop: 34, padding: "36px 56px 44px", ...KRAFT, borderRadius: 6, boxShadow: "22px 30px 44px rgba(0,0,0,0.45)", position: "relative" }}>
          <Nail x={90} y={12} /><Nail x={730} y={12} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, letterSpacing: 9, color: H.leaf }}>RAZÓN {n} DE 10</div>
          <div style={{ fontFamily: SERIF, fontSize: 88, lineHeight: 1.02, color: H.ink, marginTop: 8 }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// progreso: tabla grande colgada de dos hilos que baja con peso; la semilla del número cae a su hoyo; sale subiendo
export const Progreso: React.FC<{ n: number; title: string; dur: number }> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const W = 580, X = 1920 - 70 - W, T = 80;
  const d = bounce(f, 0); const up = interpolate(f, [dur - 14, dur], [0, -640], { ...CL, easing: Easing.in(Easing.cubic) });
  const r = swing(f - 8, 4, 34, 26) + swing(f - (dur - 14), 3, 20, 30);
  const sd = fall(f, 12, 9, 300); const land = hit(f, 21, 4);
  return (
    <div style={{ position: "absolute", left: X, top: 0, width: W, height: 360, transformOrigin: `${W / 2}px -80px`, transform: `translateY(${(1 - d) * -520 + up}px) rotate(${r}deg)` }}>
      <Rope x1={W * 0.16} y1={-120} x2={W * 0.16} y2={T + 14} th={7} /><Rope x1={W * 0.84} y1={-120} x2={W * 0.84} y2={T + 14} th={7} />
      <div style={{ position: "absolute", left: 0, top: T, width: W, height: 200, ...WOOD, borderRadius: 8, boxShadow: "16px 26px 30px rgba(0,0,0,0.45), inset 0 -10px 0 rgba(0,0,0,0.25), inset 0 3px 0 rgba(255,220,170,0.25)" }}>
        <Nail x={W * 0.16} y={16} /><Nail x={W * 0.84} y={16} />
        <div style={{ position: "absolute", left: 30, top: 44, fontFamily: SERIF, fontSize: 104, color: H.cream, lineHeight: 1, textShadow: "0 3px 0 rgba(0,0,0,0.4)" }}>{n}<span style={{ fontSize: 50, opacity: 0.75 }}> /10</span></div>
        {Array.from({ length: 10 }).map((_, i) => {
          const cx = 300 + (i % 5) * 54, cy = 66 + Math.floor(i / 5) * 70;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: cx - 19, top: cy - 12, width: 38, height: 24, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 30%, #1d120a, #3a2516 70%)", boxShadow: "inset 0 3px 4px rgba(0,0,0,0.7), 0 1px 0 rgba(255,220,170,0.25)" }} />
              {i < n && (
                <div style={{ position: "absolute", left: cx - 15, top: cy - 13, width: 30, height: 22, borderRadius: "50% 50% 45% 45%",
                  background: "radial-gradient(ellipse at 35% 30%, #fff1d0, #d8b27a 45%, #8f6a3a)", boxShadow: "2px 4px 4px rgba(0,0,0,0.5)",
                  transform: i === n - 1 ? `translateY(${sd}px) scale(${1 + 0.08 * land}, ${1 - 0.08 * land})` : undefined }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// libro: el libro gira al llegar a la mesa con luz de costado; del canto asoman tiras de papel con la página escrita a mano
export const Libro: React.FC<{ src: string; tabs: { p: string; t: string; f: number }[]; dur: number }> = ({ src, tabs, dur }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const e = bounce(f, 0); const COLS = ["#F2E7C9", "#E8D7A8", "#F6EEDB"];
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden", perspective: 1800 }}>
      <AbsoluteFill style={{ background: "linear-gradient(100deg, rgba(255,226,170,0.22), transparent 45%, rgba(0,0,0,0.3))" }} />
      <Shadow x={980} y={980} w={900} h={120} o={e} />
      <div style={{ position: "absolute", left: 560, top: 110, width: 560, height: 840, transformStyle: "preserve-3d",
        transform: `translateY(${(1 - e) * 900}px) rotateX(${lerp(16, 9, t)}deg) rotateY(${lerp(-44, -20, e) + t * 6}deg) rotateZ(${lerp(-12, -3, e)}deg)` }}>
        <div style={{ position: "absolute", right: -34, top: 10, width: 34, height: 820, background: "repeating-linear-gradient(90deg, #f3ecd9 0 2px, #d9cfb7 2px 3px)", transform: "rotateY(90deg)", transformOrigin: "0 50%" }} />
        {tabs.map((b, i) => {
          const k = sp(f - b.f, 11); const fold = swing(f - b.f - 8, 8, 24, 18);
          return (
            <div key={i} style={{ position: "absolute", left: 470, top: 170 + i * 230, width: 300, height: 92, background: COLS[i % 3], boxShadow: "6px 8px 12px rgba(0,0,0,0.35)",
              transformOrigin: "0 50%", transform: `translateX(${(1 - k) * -230}px) rotateY(${-14 + fold}deg)`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24,
              fontFamily: HANDF, fontWeight: 700, fontSize: 60, color: H.ink }}>pág. {b.p}</div>
          );
        })}
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: 560, height: 840, objectFit: "cover", boxShadow: "24px 34px 60px rgba(0,0,0,0.55)", borderRadius: "2px 8px 8px 2px" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(255,240,210,0.28), transparent 40%, rgba(0,0,0,0.22))" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 26, background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }} />
      </div>
    </AbsoluteFill>
  );
};

// mapa: la cámara se acerca al punto, un círculo de tinta se traza, cae el alfiler con rebote y la etiqueta cuelga de su hilo
export const Mapa: React.FC<{ img: string; pins: { x: number; y: number; t: string; sub?: string; f: number }[]; dur: number }> = ({ img, pins, dur }) => {
  const f = useCurrentFrame();
  const p0 = pins[0]; const z = interpolate(f, [0, dur - 16, dur], [1.0, 1.22, 1.08], { ...CL, easing: io });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${p0.x}px ${p0.y}px` }}>
        <Img src={staticFile(img)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" }} />
        {pins.map((p, i) => {
          const c = interpolate(f, [p.f - 10, p.f + 6], [0, 360], CL); const d = bounce(f, p.f + 4), l = bounce(f, p.f + 14);
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: p.x - 150, top: p.y - 110, width: 300, height: 220, borderRadius: "50%", border: "8px solid rgba(150,30,20,0.85)", transform: "rotate(-8deg)",
                WebkitMaskImage: `conic-gradient(from 200deg, #000 ${c}deg, transparent ${c}deg)`, maskImage: `conic-gradient(from 200deg, #000 ${c}deg, transparent ${c}deg)` }} />
              <Shadow x={p.x + 18} y={p.y + 4} w={60} h={18} o={d} />
              <div style={{ position: "absolute", left: p.x - 2, top: p.y - 54, width: 4, height: 54, background: "linear-gradient(90deg,#999,#eee,#888)", transform: `translateY(${(1 - d) * -500}px)` }} />
              <div style={{ position: "absolute", left: p.x - 24, top: p.y - 96, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a73, #b4321c 60%, #6e1a0c)", boxShadow: "6px 8px 10px rgba(0,0,0,0.4)", transform: `translateY(${(1 - d) * -500}px)` }} />
              <div style={{ position: "absolute", left: p.x - 10, top: p.y - 70, transformOrigin: "10px 0", transform: `rotate(${-28 + swing(f - p.f - 18, 6, 30, 26)}deg) scale(${l > 0.05 ? 1 : 0})` }}>
                <div style={{ marginLeft: 8, width: 5, height: 150, ...TWINE }} />
                <div style={{ marginLeft: -170, padding: "18px 34px 22px", ...KRAFT, borderRadius: 6, boxShadow: "16px 22px 30px rgba(0,0,0,0.45)", transform: `translateY(${(1 - l) * -60}px) rotate(28deg)`, transformOrigin: "180px 0", whiteSpace: "nowrap" }}>
                  <div style={{ fontFamily: SERIF, fontSize: 70, color: H.ink, lineHeight: 1 }}>{p.t}</div>
                  {p.sub && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: H.leaf, marginTop: 8 }}>{p.sub}</div>}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// marcadores: estacas de bambú que bajan de golpe, vibran al clavarse y proyectan su sombra
export const Marcadores: React.FC<{ img: string; seed: number; items: { x: number; y: number; t: string; f: number; h?: number }[]; dur: number }> = ({ img, seed, items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={seed} dur={dur} zoom={[1.02, 1.06]} />
      {items.map((m, i) => {
        const h = m.h ?? 360; const y = fall(f, m.f, 7, 800); const vib = hit(f, m.f + 7, 5); const fl = sp(f - m.f - 9, 10);
        const on = f >= m.f + 7 ? 1 : 0;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: m.x, top: m.y - 6, width: h * 0.55, height: 14, borderRadius: 7, background: "linear-gradient(90deg, rgba(0,0,0,0.45), transparent)", transform: "rotate(14deg)", transformOrigin: "0 50%", opacity: on * 0.9 }} />
            <Dust x={m.x} y={m.y} f0={m.f + 7} n={8} seed={i + seed} />
            <div style={{ position: "absolute", left: m.x - 10, top: m.y - h, transformOrigin: `10px ${h}px`, transform: `translateY(${y}px) rotate(${vib}deg)` }}>
              <div style={{ width: 20, height: h, borderRadius: 10, background: "repeating-linear-gradient(180deg, #c9b56a 0 86px, #8f7c37 86px 92px), linear-gradient(90deg, #a8954e, #d8c47a, #9c8944)", backgroundBlendMode: "multiply", boxShadow: "6px 0 8px rgba(0,0,0,0.4)" }} />
              <div style={{ position: "absolute", left: 20, top: 8, padding: "16px 34px 18px 26px", ...KRAFT, whiteSpace: "nowrap", clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)",
                boxShadow: "0 8px 14px rgba(0,0,0,0.35)", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${(1 - fl) * 85}deg) rotate(${swing(f - m.f - 12, 4)}deg)` }}>
                <span style={{ fontFamily: SERIF, fontSize: 68, color: H.ink }}>{m.t}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// tendedero: hilo grueso en diagonal con panza; cada hora entra con su pinza, se mece y deja sombra; el sol se corre con cada tarjeta
export const Tendedero: React.FC<{ img: string; items: { t: string; sub?: string; f: number }[]; dur: number; sweep?: boolean }> = ({ img, items, dur, sweep }) => {
  const f = useCurrentFrame();
  const R = { x1: -30, y1: 120, x2: 1950, y2: 230, sag: 110 };
  const xs = items.map((_, i) => 380 + i * (1160 / Math.max(1, items.length - 1)));
  const fr = items.map((it) => it.f); const sx = fr.length > 1 ? interpolate(f, fr.flatMap((v) => [v, v + 18]), xs.flatMap((x) => [x, x]).map((x) => (x / 1920) * 100), CL) : 50;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={65} dur={dur} zoom={[1.03, 1.08]} />
      {sweep && <AbsoluteFill style={{ background: `radial-gradient(ellipse 34% 60% at ${sx}% 20%, rgba(255,226,150,0.32), transparent 70%)` }} />}
      <Sag {...R} th={9} />
      {items.map((it, i) => {
        const x = xs[i]; const y = sagY(R.x1, R.y1, R.x2, R.y2, R.sag, x); const k = bounce(f, it.f); const r = swing(f - it.f - 4, 10, 32, 24);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 150 + 40, top: y + 70, width: 300, height: 230, background: "rgba(10,20,5,0.28)", borderRadius: 6, transformOrigin: "150px -40px", transform: `translateY(${(1 - k) * -500}px) rotate(${r * 1.2}deg) skewX(-8deg)` }} />
            <div style={{ position: "absolute", left: x - 150, top: y + 4, width: 300, transformOrigin: "150px 0", transform: `translateY(${(1 - k) * -500}px) rotate(${r}deg)` }}>
              <div style={{ marginTop: 36, padding: "30px 10px 28px", textAlign: "center", ...KRAFT, borderRadius: 4, boxShadow: "10px 18px 26px rgba(0,0,0,0.45)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 92, color: H.ink, lineHeight: 1 }}>{it.t}</div>
                {it.sub && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: H.leaf, marginTop: 8 }}>{it.sub}</div>}
              </div>
              <Pinza style={{ left: 133, top: -20 }} />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// recuerdo: la foto impresa entra deslizándose sobre la mesa y se asienta; la hoja de libreta llega clavada con una tachuela
export const Recuerdo: React.FC<{ img: string; head: string; quote?: string; fQuote?: number; dur: number }> = ({ img, head, quote, fQuote = 0, dur }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const k = bounce(f, 2), q = quote ? bounce(f, fQuote) : 0, lb = bounce(f, 18);
  const torn = "polygon(0 4%, 4% 0, 9% 3%, 14% 0, 19% 4%, 25% 1%, 31% 4%, 37% 0, 43% 3%, 50% 0, 56% 4%, 62% 1%, 68% 4%, 74% 0, 80% 3%, 86% 0, 92% 4%, 100% 1%, 100% 100%, 0 100%)";
  const px = quote ? 90 : 260;
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(100deg, rgba(255,226,170,0.18), transparent 50%, rgba(0,0,0,0.3))" }} />
      <div style={{ position: "absolute", left: px, top: 120, transform: `translateX(${(1 - k) * -1500}px) rotate(${lerp(-14, -3, k)}deg) scale(${1 + t * 0.04})`, transformOrigin: "50% 50%" }}>
        <div style={{ background: "#F4EEDF", padding: 26, boxShadow: "26px 34px 50px rgba(0,0,0,0.55)" }}>
          <Img src={staticFile(img)} style={{ width: 1180, height: 664, objectFit: "cover", display: "block", filter: "sepia(0.18) saturate(0.9)" }} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 560, transformOrigin: "40px -60px", transform: `translateY(${(1 - lb) * -200}px) rotate(${-3 + swing(f - 24, 5, 30, 24)}deg)`, opacity: lb > 0.02 ? 1 : 0 }}>
          <Rope x1={40} y1={-90} x2={40} y2={6} th={5} />
          <div style={{ padding: "18px 38px 22px", ...KRAFT, borderRadius: 6, boxShadow: "14px 20px 28px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}><span style={{ fontFamily: SERIF, fontSize: 62, color: H.ink }}>{head}</span></div>
        </div>
        <Tack x={160} y={470} c="#7a5a2a" s={30} />
      </div>
      {quote && (
        <div style={{ position: "absolute", left: 1050, top: 230, width: 760, transformOrigin: "380px 20px", transform: `translateY(${(1 - q) * 1000}px) rotate(${lerp(9, 3, q) + hit(f, fQuote + 10, 1.5)}deg)` }}>
          <div style={{ padding: "64px 54px 54px 96px", background: "#FBF8F0", clipPath: torn, filter: "drop-shadow(18px 26px 22px rgba(0,0,0,0.45))",
            backgroundImage: "repeating-linear-gradient(180deg, transparent 0 66px, rgba(70,110,170,0.28) 66px 68px), linear-gradient(90deg, transparent 66px, rgba(200,60,50,0.45) 66px 69px, transparent 69px)" }}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, lineHeight: 1.04, color: H.ink }}>«{quote}»</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 36, color: H.leaf, marginTop: 20 }}>— Don Tomás</div>
          </div>
          <Tack x={380} y={26} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// calendario: 12 baldosas de barro con bisel que caen de a una y se asientan con un golpecito; al final cuelga la etiqueta de la página
export const Baldosas: React.FC<{ img: string; foot: string; marks?: { m: number; t: string; f: number }[]; dur: number }> = ({ img, foot, marks = [], dur }) => {
  const f = useCurrentFrame();
  const M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const o = outF(f, dur, 12); const lf = 4 + 12 * 5 + 4; const lb = bounce(f, lf);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={154} dur={dur} zoom={[1.02, 1.07]} />
      <div style={{ position: "absolute", left: 100, top: 290, width: 800, height: 600, opacity: o }}>
        {M.map((m, i) => {
          const d = 4 + i * 5; const col = i % 4, row = Math.floor(i / 4); const x = col * 196, y = row * 196;
          const e = bounce(f, d); const tap = hit(f, d + 6, 2); const mk = marks.find((z) => z.m === i);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 180, height: 180, opacity: f >= d ? 1 : 0, transform: `translateY(${(1 - e) * -260}px) rotate(${((hash(i + 40) % 5) - 2) + tap}deg) scale(${1 + (1 - e) * 0.25})` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: `radial-gradient(ellipse at 38% 30%, #dc8458, ${H.terra} 55%, #8a3a1c)`,
                boxShadow: "12px 16px 18px rgba(0,0,0,0.45), inset 6px 6px 0 rgba(255,200,160,0.22), inset -8px -8px 0 rgba(70,25,8,0.35)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 10, opacity: 0.5, backgroundImage: "radial-gradient(circle at 20% 30%, rgba(60,20,5,0.4) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,210,170,0.35) 0 1.5px, transparent 2.5px), radial-gradient(circle at 45% 80%, rgba(60,20,5,0.35) 0 2px, transparent 3px)", backgroundSize: "37px 41px, 29px 33px, 43px 39px" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 2, color: "#7a2f14", textShadow: "0 -2px 0 rgba(50,15,5,0.55), 0 2px 0 rgba(255,210,180,0.45)" }}>{m}</div>
              {mk && <div style={{ position: "absolute", left: 14, right: 14, bottom: 16, textAlign: "center", fontFamily: HANDF, fontWeight: 700, fontSize: 34, color: H.cream, opacity: cl((f - mk.f) / 8, 0, 1) }}>{mk.t}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 960, top: 0, width: 760, opacity: o, transformOrigin: "380px -80px", transform: `translateY(${(1 - lb) * -500}px) rotate(${swing(f - lf - 6, 4, 32, 26)}deg)` }}>
        <Rope x1={120} y1={-60} x2={120} y2={186} /><Rope x1={640} y1={-60} x2={640} y2={186} />
        <div style={{ marginTop: 180, padding: "22px 40px 26px", ...KRAFT, borderRadius: 6, boxShadow: "16px 22px 30px rgba(0,0,0,0.45)", position: "relative", textAlign: "center" }}>
          <Nail x={120} y={10} /><Nail x={640} y={10} />
          <span style={{ fontFamily: SERIF, fontSize: 62, color: H.ink }}>{foot}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// macetas: un aro de medida se traza en la boca de cada maceta, cae un tirante de madera y de él cuelga la etiqueta (2 renglones)
export const Colgantes: React.FC<{ img: string; seed: number; items: { x: number; y: number; w?: number; tx?: number; ty?: number; head: string; lines: string[]; f: number }[]; dur: number }> = ({ img, seed, items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" }} />
      {items.map((it, i) => {
        const w = it.w ?? 400; const c = interpolate(f, [it.f, it.f + 14], [0, 360], CL); const sl = bounce(f, it.f + 10); const tg = bounce(f, it.f + 18);
        const tx = it.tx ?? it.x - 220, ty = it.ty ?? it.y + 80; const hx = it.x + (tx + 220 < it.x ? -w * 0.45 : 0), hy = it.y;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: it.x - w / 2, top: it.y - w * 0.09, width: w, height: w * 0.18, borderRadius: "50%", border: "7px solid #F5EDDC", boxShadow: "0 0 0 2px rgba(0,0,0,0.25)",
              WebkitMaskImage: `conic-gradient(from 180deg, #000 ${c}deg, transparent ${c}deg)`, maskImage: `conic-gradient(from 180deg, #000 ${c}deg, transparent ${c}deg)` }} />
            <div style={{ position: "absolute", left: it.x - w * 0.55, top: it.y - 12, width: w * 1.1, height: 22, ...WOOD, borderRadius: 4, boxShadow: "0 10px 12px rgba(0,0,0,0.45)", transform: `translateY(${(1 - sl) * -500}px)`, opacity: f >= it.f + 10 ? 1 : 0 }} />
            {f >= it.f + 18 && <Rope x1={hx} y1={hy} x2={tx + 220} y2={ty + (1 - tg) * -200 + 10} th={5} />}
            <div style={{ position: "absolute", left: tx, top: ty, width: 440, padding: "22px 30px 26px", ...KRAFT, borderRadius: 10, boxShadow: "16px 22px 30px rgba(0,0,0,0.45)", textAlign: "center",
              transformOrigin: "220px 0", transform: `translateY(${(1 - tg) * -200}px) rotate(${swing(f - it.f - 22, 6, 30, 24)}deg)`, opacity: f >= it.f + 18 ? 1 : 0 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 5, color: H.leaf }}>{it.head}</div>
              {it.lines.slice(0, 1).map((l, j) => <div key={j} style={{ fontFamily: SERIF, fontSize: 72, lineHeight: 1.02, color: H.ink, marginTop: 6 }}>{l}</div>)}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// dato con fuente: ficha clavada abajo a la izquierda con tachuela, sombra larga de ventana; la fuente es una etiqueta pegada al borde
export const Ficha: React.FC<{ img: string; quote: string; source: string; dur: number }> = ({ img, quote, source, dur }) => {
  const f = useCurrentFrame();
  const k = bounce(f, 4), s2 = bounce(f, 26);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={224} dur={dur} zoom={[1.05, 1.12]} />
      <div style={{ position: "absolute", left: 90, top: 470, width: 1080, transformOrigin: "540px 20px", transform: `translateY(${(1 - k) * 800}px) rotate(${-1.5 + hit(f, 14, 1.2)}deg)` }}>
        <div style={{ padding: "64px 70px 70px", background: "#FFFDF6", boxShadow: "46px 54px 60px rgba(0,0,0,0.45)",
          backgroundImage: "linear-gradient(180deg, transparent 48px, rgba(200,60,50,0.55) 48px 51px, transparent 51px), repeating-linear-gradient(180deg, transparent 0 66px, rgba(70,110,170,0.22) 66px 68px)" }}>
          <div style={{ fontFamily: SERIF, fontSize: 70, lineHeight: 1.06, color: H.ink }}>{quote}</div>
        </div>
        <Tack x={540} y={22} c="#3f6b35" s={46} />
        <div style={{ position: "absolute", right: -30, bottom: -36, padding: "14px 30px 16px", ...KRAFT, borderRadius: 4, boxShadow: "8px 10px 14px rgba(0,0,0,0.4)", transform: `scale(${s2}) rotate(-4deg)`, transformOrigin: "100% 100%", maxWidth: 760 }}>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: H.ink }}>{source}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// receta: en la botella real se perforan los agujeros uno a uno (anillo que se abre) con su cota; el sobre entra girando desde abajo
export const Sobre: React.FC<{ img: string; head: string; lines: { t: string; f: number }[]; holes?: { x: number; y: number }[]; fHoles?: number; dur: number }> = ({ img, head, lines, holes = [], fHoles = 0, dur }) => {
  const f = useCurrentFrame(); const k = bounce(f, 4);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" }} />
      {holes.map((h, i) => {
        const d = fHoles + i * 6; const p = cl((f - d) / 3, 0, 1); const ring = cl((f - d) / 12, 0, 1);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: h.x - 11, top: h.y - 11, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle, #1a1410 40%, rgba(40,30,20,0.6) 70%, transparent)", transform: `scale(${p})` }} />
            {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: h.x - 30, top: h.y - 30, width: 60, height: 60, borderRadius: "50%", border: "4px solid rgba(255,250,235,0.9)", transform: `scale(${0.3 + ring * 1.4})`, opacity: 1 - ring }} />}
          </React.Fragment>
        );
      })}
      {holes.length > 1 && (() => { const a = holes[0], b = holes[1]; const p = cl((f - fHoles - 12) / 8, 0, 1); return (
        <>
          <div style={{ position: "absolute", left: a.x, top: a.y + 44, width: (b.x - a.x) * p, height: 3, background: "#FFF6E0", boxShadow: "0 1px 2px rgba(0,0,0,0.6)" }} />
          <div style={{ position: "absolute", left: a.x - 1, top: a.y + 34, width: 3, height: 22, background: "#FFF6E0", opacity: p }} />
          <div style={{ position: "absolute", left: b.x - 1, top: a.y + 34, width: 3, height: 22, background: "#FFF6E0", opacity: p }} />
          <div style={{ position: "absolute", left: a.x - 30, top: a.y + 56, fontFamily: HANDF, fontWeight: 700, fontSize: 46, color: "#FFF6E0", textShadow: TXTSH, opacity: p }}>½ cm</div>
        </>
      ); })()}
      <div style={{ position: "absolute", left: 1090, top: 170, width: 700, height: 760, transformOrigin: "50% 100%", transform: `translateY(${(1 - k) * 1100}px) rotate(${lerp(-24, 5, k)}deg)` }}>
        <Shadow x={380} y={770} w={720} h={70} />
        <div style={{ position: "absolute", inset: 0, ...KRAFT, borderRadius: 3, boxShadow: "20px 26px 40px rgba(0,0,0,0.45)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, ...KRAFT, backgroundColor: H.kraftD, clipPath: "polygon(0 0, 100% 0, 50% 100%)", boxShadow: "0 6px 8px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 326, top: 100, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #c0503a, #7a2416)", boxShadow: "0 3px 4px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 60, right: 50, top: 180 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: H.leaf }}>{head}</div>
          {lines.map((l, i) => {
            const a = cl((f - l.f) / 9, 0, 1);
            return <div key={i} style={{ fontFamily: SERIF, fontSize: 62, lineHeight: 1.06, color: H.ink, marginTop: 26, opacity: a, transform: `translateY(${(1 - a) * 14}px)`, borderBottom: "2px dashed rgba(70,45,20,0.3)", paddingBottom: 14 }}>{l.t}</div>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// pregunta: un papel kraft doblado se despliega sobre la foto, la piedrita cae y lo aplasta; al final se pliega y se lo lleva la brisa
export const Papelito: React.FC<{ img: string; n: number; text: string; dur: number }> = ({ img, n, text, dur }) => {
  const f = useCurrentFrame(); const u = sp(f - 4, 13);
  const torn = "polygon(0 6%, 5% 0, 12% 4%, 20% 0, 28% 5%, 36% 1%, 45% 4%, 54% 0, 63% 5%, 72% 1%, 81% 4%, 90% 0, 100% 5%, 98% 94%, 90% 100%, 80% 96%, 70% 100%, 60% 95%, 50% 100%, 40% 96%, 30% 100%, 20% 95%, 10% 100%, 2% 96%)";
  const sf = 18; const sy = fall(f, sf, 8, 520); const land = hit(f, sf + 8, 1);
  const go = interpolate(f, [dur - 16, dur], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const top = n ? 300 : 340;
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1600 }}>
      <Foto src={img} seed={285 + n} dur={dur} zoom={[1.04, 1.1]} />
      <AbsoluteFill style={{ background: "rgba(20,14,8,0.22)" }} />
      <div style={{ position: "absolute", left: 300, top, width: 1320, transformOrigin: "50% 0", transform: `translateX(${go * 1500}px) translateY(${go * -200}px) rotate(${(n % 2 ? -1 : 1) * 1.6 + go * 18}deg) rotateX(${(1 - u) * -86 + go * 70}deg) scaleY(${1 - 0.015 * Math.abs(land)})` }}>
        <div style={{ padding: "64px 80px 70px", ...KRAFT, clipPath: torn, filter: "drop-shadow(18px 26px 22px rgba(0,0,0,0.5))", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 3, background: "linear-gradient(90deg, rgba(80,50,20,0.25), rgba(255,240,210,0.25), rgba(80,50,20,0.25))" }} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: 8, color: H.leaf }}>{n ? `PREGUNTA ${n}` : "DE LOS COMENTARIOS"}</div>
          <div style={{ fontFamily: SERIF, fontSize: n ? 78 : 86, lineHeight: 1.05, color: H.ink, marginTop: 14 }}>{text}</div>
        </div>
      </div>
      <Shadow x={1540} y={top + 40} w={190} h={50} o={cl((f - sf) / 8, 0, 1) * (1 - go)} />
      <div style={{ position: "absolute", left: 1480, top: top - 40, width: 130, height: 92, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(ellipse at 35% 30%, #c4bfb5, #7d786f 60%, #4f4b45)", boxShadow: "inset -6px -8px 10px rgba(0,0,0,0.35)",
        transform: `translateY(${sy}px) rotate(${land * 4}deg)`, opacity: f >= sf ? 1 : 0 }} />
    </AbsoluteFill>
  );
};

// CTA: la estaca se clava a martillazos (polvo), el cartel SUSCRÍBETE cuelga de dos ganchos y se mece; el sobre del próximo video viene hacia cámara
export const CTAsobre: React.FC<{ img: string; next: string; nextImg: string; dur: number }> = ({ img, next, nextImg, dur }) => {
  const f = useCurrentFrame();
  const hits = [10, 19, 28]; const sink = hits.reduce((a, h) => a + (f >= h ? 22 : 0), 0) - 66; const sy = fall(f, 2, 8, 900) + sink + hits.reduce((a, h) => a + hit(f, h, 4), 0);
  const sg = bounce(f, 36); const pk = sp(f - 46, 15, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1600 }}>
      <Foto src={img} seed={384} dur={dur} zoom={[1.02, 1.1]} o={[40, 55]} />
      <div style={{ position: "absolute", left: 1470, top: 1036, width: 320, height: 30, transform: "skewX(-55deg)", background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)", opacity: cl((f - 10) / 4, 0, 1) }} />
      <div style={{ position: "absolute", left: 1440, top: 380, width: 50, height: 740, ...WOOD, clipPath: "polygon(0 0, 100% 0, 100% 94%, 50% 100%, 0 94%)", boxShadow: "8px 0 12px rgba(0,0,0,0.45)", transform: `translateY(${sy}px)` }} />
      {hits.map((h, i) => <Dust key={i} x={1465} y={1050} f0={h} n={10} seed={i + 3} />)}
      <div style={{ position: "absolute", left: 1235, top: 300, width: 460, transformOrigin: "50% 100%", transform: `translateY(${sy}px) translateZ(${(1 - pk) * -900}px) rotateX(${(1 - pk) * 40}deg) rotate(${3 + swing(f - 60, 3)}deg)`, opacity: pk > 0.02 ? 1 : 0 }}>
        <div style={{ width: 460, height: 620, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, ...KRAFT, boxShadow: "22px 30px 44px rgba(0,0,0,0.5)", borderRadius: 3 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, ...KRAFT, backgroundColor: H.kraftD, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          <div style={{ position: "absolute", left: 34, right: 34, top: 110, height: 280, overflow: "hidden", boxShadow: "inset 0 0 0 3px rgba(60,38,15,0.55)" }}>
            <Img src={staticFile(nextImg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", left: 34, top: 410, fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 6, color: H.leaf }}>EL QUE SIGUE</div>
          <div style={{ position: "absolute", left: 34, right: 30, top: 452, fontFamily: SERIF, fontSize: 54, lineHeight: 1.02, color: H.ink }}>{next}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 0, width: 820, transformOrigin: "410px -60px", transform: `translateY(${(1 - sg) * -600}px) rotate(${swing(f - 40, 5, 34, 26)}deg)`, opacity: f >= 36 ? 1 : 0 }}>
        <Rope x1={110} y1={-40} x2={110} y2={150} th={7} /><Rope x1={710} y1={-40} x2={710} y2={150} th={7} />
        <div style={{ marginTop: 140, padding: "34px 0 40px", textAlign: "center", ...WOOD, borderRadius: 10, boxShadow: "20px 30px 40px rgba(0,0,0,0.5), inset 0 -10px 0 rgba(0,0,0,0.25)", position: "relative" }}>
          <Nail x={110} y={16} /><Nail x={710} y={16} />
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 96, letterSpacing: 10, color: H.cream, textShadow: "0 4px 0 rgba(0,0,0,0.4)" }}>SUSCRÍBETE</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
