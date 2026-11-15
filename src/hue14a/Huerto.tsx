// Huerto.tsx — kit de hue14a (El Huerto de Claudio). Puro CSS y DOM con materiales del huerto:
// papel kraft, madera de estaca, hilo de cáñamo, arpillera, barro, bambú, pinzas de ropa. Sin SVG, sin grano, sin viñeta.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONTS, hash } from "./Piezas";

const { SERIF, SANS } = FONTS;
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
// 50/50: la foto entra como una tabla de madera que se desliza desde la derecha
export const SplitTabla: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 14, dur - 12, dur], [0, 1, 1, 0], { ...CL, easing: io });
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 900, transform: `translateX(${(1 - p) * 105}%)` }}>
      <div style={{ position: "absolute", left: -26, top: 0, bottom: 0, width: 26, ...WOOD, boxShadow: "-10px 0 30px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><Foto src={src} seed={seed} dur={dur} /></div>
    </div>
  );
};
// polaroid colgada con pinza de ropa de un hilo, junto al avatar
export const Pinza: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 34, height: 92, ...WOOD, backgroundImage: "linear-gradient(90deg, #b88a5a, #d9b07c 50%, #b2824f)", borderRadius: 4, boxShadow: "0 4px 8px rgba(0,0,0,0.4)", ...style }}>
    <div style={{ position: "absolute", left: 6, right: 6, top: 38, height: 10, background: "#8d8f92", borderRadius: 3 }} />
  </div>
);
export const PolaroidH: React.FC<{ src: string; caption: string; dur: number; seed?: number }> = ({ src, caption, dur, seed = 1 }) => {
  const f = useCurrentFrame(); const o = outF(f, dur, 10);
  const drop = sp(f, 12, 0.9); const r = (hash(seed) % 2 ? 1 : -1) * 3 + swing(f - 10, 6, 30, 26);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 1180, right: -20, top: 92, height: 5, ...TWINE, transform: "rotate(-1.5deg)" }} />
      <div style={{ position: "absolute", left: 1290, top: 96, width: 500, transformOrigin: "250px 0px", transform: `translateY(${(1 - drop) * -700}px) rotate(${r}deg)` }}>
        <div style={{ background: "#FBF7EE", padding: "22px 22px 92px", boxShadow: "0 26px 50px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile(src)} style={{ width: 456, height: 380, objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontSize: 46, color: H.ink }}>{caption}</div>
        </div>
        <Pinza style={{ left: 233, top: -46 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- (5) transición de capítulo: cortina de arpillera que cruza el cuadro
export const Arpillera: React.FC<{ dir?: number; len?: number }> = ({ dir = 1, len = 18 }) => {
  const f = useCurrentFrame();
  if (f > len) return null;
  const x = interpolate(f, [0, len], [0, -125], { ...CL, easing: Easing.in(Easing.cubic) }) * dir;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%)`, pointerEvents: "none" }}>
      <AbsoluteFill style={{ ...BURLAP }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, [dir > 0 ? "right" : "left"]: -14, width: 28, background: "repeating-linear-gradient(0deg, rgba(168,134,83,1) 0 5px, transparent 5px 9px)" } as React.CSSProperties} />
    </AbsoluteFill>
  );
};

// ---------- paquete de semillas (carrusel, recap, CTA)
const Paquete: React.FC<{ n: number; title: string; src: string; w: number; done?: number; big?: boolean }> = ({ n, title, src, w, done = 0, big }) => {
  const h = w * 1.42;
  return (
    <div style={{ width: w, height: h, position: "relative", ...KRAFT, boxShadow: "0 18px 36px rgba(0,0,0,0.45)", borderRadius: 3 }}>
      {/* solapa de arriba con el doblez */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.1, background: "rgba(80,50,20,0.16)", borderBottom: "2px dashed rgba(70,45,20,0.35)" }} />
      <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: h * 0.14, height: w * 0.62, overflow: "hidden", border: `${Math.max(2, w * 0.012)}px solid rgba(60,38,15,0.55)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: done ? `saturate(${1 - 0.6 * done}) brightness(${1 - 0.2 * done})` : undefined }} />
      </div>
      <div style={{ position: "absolute", left: w * 0.08, top: h * 0.14 + w * 0.66, fontFamily: SANS, fontWeight: 600, fontSize: w * 0.065, letterSpacing: w * 0.012, color: H.leaf }}>RAZÓN {n}</div>
      <div style={{ position: "absolute", left: w * 0.08, right: w * 0.06, top: h * 0.14 + w * 0.76, fontFamily: SERIF, fontSize: w * (big ? 0.11 : 0.098), lineHeight: 1.05, color: H.ink }}>{title}</div>
      <div style={{ position: "absolute", right: w * 0.06, top: h * 0.025, fontFamily: SERIF, fontSize: w * 0.11, color: "rgba(43,33,24,0.7)" }}>{n}</div>
      {done > 0 && <div style={{ position: "absolute", left: -w * 0.04, right: -w * 0.04, top: h * 0.46, height: w * 0.05, ...TWINE, transform: `scaleX(${done}) rotate(-8deg)`, transformOrigin: "0 50%" }} />}
    </div>
  );
};
export type Card = { title: string; src: string };

// (1) carrusel: los 10 paquetes en fila sobre la mesa de trasplante, la mesa se corre y cada paquete se levanta al pasar por el centro
export const Carrusel: React.FC<{ cards: Card[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame();
  const W = 330, GAP = 70, step = W + GAP, total = step * (cards.length - 1);
  const pan = interpolate(f, [6, dur - 16], [0, total], { ...CL, easing: io });
  const o = outF(f, dur, 10);
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden", opacity: o }}>
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 250, transformStyle: "preserve-3d", transform: `rotateX(18deg) translateX(${-pan}px)` }}>
          {cards.map((c, i) => {
            const d = (i * step - pan) / step; const lift = Math.max(0, 1 - Math.abs(d));
            const enter = sp(f - i * 2, 16);
            return (
              <div key={i} style={{ position: "absolute", left: i * step, top: 0, transform: `translateY(${(1 - enter) * 500 - lift * 40}px) translateZ(${lift * 160}px) rotateZ(${(hash(i + 3) % 7) - 3}deg)` }}>
                <Paquete n={i + 1} title={c.title} src={c.src} w={W} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 10, color: H.cream, textShadow: TXTSH }}>LAS 10 RAZONES</div>
    </AbsoluteFill>
  );
};

// (10) recap: los 10 paquetes ordenados en la mesa; el del número dicho se adelanta y su ficha se escribe al lado
export const RecapPaquetes: React.FC<{ n: number; cards: Card[]; lines: string[]; dur: number }> = ({ n, cards, lines, dur }) => {
  const f = useCurrentFrame();
  const W = 210, gx = 250, gy = 330, x0 = 960 - gx * 2 - W / 2, y0 = 120;
  const sel = n > 0 ? sp(f - 4, 16) : 0;
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden" }}>
      {cards.map((c, i) => {
        const k = i + 1; const col = i % 5, row = Math.floor(i / 5);
        const enter = n === 0 ? sp(f - i * 3, 15) : 1;
        const isSel = k === n; const done = n > 0 && k < n ? 1 : 0;
        const x = x0 + col * gx, y = y0 + row * gy + (1 - enter) * -900;
        const tx = isSel ? lerp(x, 170, sel) : x, ty = isSel ? lerp(y, 190, sel) : y, sc = isSel ? lerp(1, 2.05, sel) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", zIndex: isSel ? 5 : 1, opacity: isSel || n === 0 ? 1 : 1 - 0.55 * sel,
            transform: `translate(${tx}px, ${ty}px) scale(${sc}) rotate(${isSel ? lerp((hash(k) % 7) - 3, -2, sel) : (hash(k) % 7) - 3}deg)` }}>
            <Paquete n={k} title={c.title} src={c.src} w={W} done={done} />
          </div>
        );
      })}
      {n > 0 && (
        <div style={{ position: "absolute", left: 720, top: 230, width: 1060, padding: "46px 56px", ...KRAFT, boxShadow: "0 24px 50px rgba(0,0,0,0.5)", transform: `translateX(${(1 - sp(f - 10, 16)) * 1300}px) rotate(1deg)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: H.leaf }}>RAZÓN {n} DE 10</div>
          <div style={{ fontFamily: SERIF, fontSize: 88, lineHeight: 1.02, color: H.ink, marginTop: 12 }}>{cards[n - 1]?.title}</div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 42, lineHeight: 1.25, color: H.ink, marginTop: 18, display: "flex", gap: 18,
              opacity: cl((f - 22 - i * 14) / 8, 0, 1), transform: `translateX(${(1 - cl((f - 22 - i * 14) / 8, 0, 1)) * 30}px)` }}>
              <span style={{ width: 16, height: 16, marginTop: 18, borderRadius: "50% 0 50% 0", background: H.leaf, flexShrink: 0 }} />{l}
            </div>
          ))}
        </div>
      )}
      {n === 0 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: SERIF, fontSize: 70, color: H.cream, textShadow: TXTSH, opacity: cl((f - 30) / 10, 0, 1) }}>las diez, en orden</div>}
    </AbsoluteFill>
  );
};

// (3) apertura de cada razón: estaca de madera que se clava desde abajo y una etiqueta kraft que gira colgada de su hilo
export const Estaca: React.FC<{ n: number; title: string; img: string; dur: number }> = ({ n, title, img, dur }) => {
  const f = useCurrentFrame();
  const st = sp(f - 2, 13, 0.9), lab = sp(f - 10, 9, 0.8);
  const rotY = lerp(-88, 0, lab) + swing(f - 18, 10, 34, 20), rotZ = swing(f - 14, 4, 28, 24);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={n * 7 + 1} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,14,8,0.55) 0%, rgba(20,14,8,0.15) 45%, transparent 70%)" }} />
      <div style={{ position: "absolute", left: 150, top: 300, width: 48, height: 900, transform: `translateY(${(1 - st) * 820}px)`, ...WOOD, clipPath: "polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)", boxShadow: "6px 0 14px rgba(0,0,0,0.4)" }} />
      <AbsoluteFill style={{ perspective: 1300 }}>
        <div style={{ position: "absolute", left: 196, top: 330, transformOrigin: "0 40px", transform: `translateY(${(1 - st) * 820}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)` }}>
          <div style={{ position: "absolute", left: -10, top: 36, width: 60, height: 6, ...TWINE }} />
          <div style={{ marginLeft: 46, width: 820, padding: "34px 46px 40px 70px", ...KRAFT, clipPath: "polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 0 50%)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <div style={{ position: "absolute", left: 26, top: "50%", width: 22, height: 22, marginTop: -11, borderRadius: "50%", background: "rgba(40,25,10,0.55)", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)" }} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 9, color: H.leaf }}>RAZÓN {n} DE 10</div>
            <div style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1.02, color: H.ink, marginTop: 8 }}>{title}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (2) progreso: tablita de madera colgada de dos hilos arriba a la derecha, con las 10 semillas
export const Progreso: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame(); const o = outF(f, dur, 12);
  const d = sp(f, 12, 0.8); const r = swing(f - 6, 5, 32, 24);
  return (
    <div style={{ position: "absolute", right: 70, top: 0, width: 420, opacity: o, transformOrigin: "210px -200px", transform: `translateY(${(1 - d) * -320}px) rotate(${r}deg)` }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 5, height: 60, ...TWINE }} />
      <div style={{ position: "absolute", right: 60, top: 0, width: 5, height: 60, ...TWINE }} />
      <div style={{ marginTop: 56, padding: "16px 26px 18px", ...WOOD, borderRadius: 6, boxShadow: "0 14px 28px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontFamily: SERIF, fontSize: 64, color: H.cream, lineHeight: 1 }}>{n}</span>
          <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: "rgba(245,237,220,0.75)" }}>/ 10</span>
          <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: H.cream, marginLeft: 6, lineHeight: 1.1 }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ width: 24, height: 15, borderRadius: "50%", background: i < n ? H.leafL : "rgba(245,237,220,0.25)", transform: `scale(${i === n - 1 ? 1 + 0.5 * swing(f - 14, 1, 20, 10) ** 2 : 1})` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// libro: la portada como libro de verdad sobre la mesa, con banderitas de papel que salen en las páginas dichas
export const Libro: React.FC<{ src: string; tabs: { p: string; t: string; f: number }[]; dur: number }> = ({ src, tabs, dur }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur);
  const e = sp(f, 15, 0.9);
  const COLS = [H.leafL, "#E3B25C", "#D9785A"];
  return (
    <AbsoluteFill style={{ ...TABLE, overflow: "hidden", perspective: 1800 }}>
      <div style={{ position: "absolute", left: 250, top: 120, width: 560, height: 840, transformStyle: "preserve-3d",
        transform: `translateY(${(1 - e) * 900}px) rotateX(${lerp(14, 8, t)}deg) rotateY(${lerp(-24, -12, t)}deg) rotateZ(-3deg)` }}>
        {/* hojas (canto) */}
        <div style={{ position: "absolute", right: -34, top: 10, width: 34, height: 820, background: "repeating-linear-gradient(90deg, #f3ecd9 0 2px, #d9cfb7 2px 3px)", transform: "rotateY(90deg)", transformOrigin: "0 50%" }} />
        {tabs.map((b, i) => {
          const k = sp(f - b.f, 13);
          return (
            <div key={i} style={{ position: "absolute", left: 520, top: 140 + i * 170, width: 300, height: 74, background: COLS[i % 3], boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
              transform: `translateX(${(1 - k) * -260}px)`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 22, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: H.ink }}>pág. {b.p}</div>
          );
        })}
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: 560, height: 840, objectFit: "cover", boxShadow: "20px 30px 60px rgba(0,0,0,0.55)", borderRadius: "2px 8px 8px 2px" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 26, background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }} />
      </div>
      {tabs.map((b, i) => {
        const k = cl((f - b.f - 8) / 10, 0, 1);
        return (
          <div key={i} style={{ position: "absolute", left: 1010, top: 250 + i * 190, width: 800, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: COLS[i % 3] }}>PÁGINA {b.p}</div>
            <div style={{ fontFamily: SERIF, fontSize: 62, lineHeight: 1.05, color: H.cream, marginTop: 6 }}>{b.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// (7) mapa: chinche que cae sobre el mapa de papel y etiqueta kraft atada con hilo
export const Mapa: React.FC<{ img: string; pins: { x: number; y: number; t: string; sub?: string; f: number }[]; dur: number }> = ({ img, pins, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={25} dur={dur} zoom={[1.02, 1.12]} o={[pins[0].x / 19.2, pins[0].y / 10.8]} />
      {pins.map((p, i) => {
        const d = sp(f - p.f, 10, 0.7), l = sp(f - p.f - 10, 13);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: p.x - 5, top: p.y - 6, width: 18, height: 10, borderRadius: "50%", background: "rgba(0,0,0,0.35)", opacity: d }} />
            <div style={{ position: "absolute", left: p.x - 2, top: p.y - 54, width: 4, height: 54, background: "linear-gradient(90deg,#999,#eee,#888)", transform: `translateY(${(1 - d) * -500}px)` }} />
            <div style={{ position: "absolute", left: p.x - 22, top: p.y - 92, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a73, #b4321c 60%, #6e1a0c)", boxShadow: "0 6px 10px rgba(0,0,0,0.4)", transform: `translateY(${(1 - d) * -500}px)` }} />
            <div style={{ position: "absolute", left: p.x + 20, top: p.y - 70, width: 120 * l, height: 4, ...TWINE, transform: "rotate(12deg)", transformOrigin: "0 50%" }} />
            <div style={{ position: "absolute", left: p.x + 130, top: p.y - 60, padding: "16px 30px 20px", ...KRAFT, boxShadow: "0 12px 24px rgba(0,0,0,0.4)", transform: `scale(${l}) rotate(${-2 + swing(f - p.f - 14, 4)}deg)`, transformOrigin: "0 30%" }}>
              <div style={{ fontFamily: SERIF, fontSize: 64, color: H.ink, lineHeight: 1 }}>{p.t}</div>
              {p.sub && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: H.leaf, marginTop: 6 }}>{p.sub}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// marcadores de bambú clavados en la foto con banderita (casos, mezcla)
export const Marcadores: React.FC<{ img: string; seed: number; items: { x: number; y: number; t: string; f: number; h?: number }[]; dur: number }> = ({ img, seed, items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={seed} dur={dur} zoom={[1.02, 1.06]} />
      {items.map((m, i) => {
        const k = sp(f - m.f, 11, 0.7), fl = sp(f - m.f - 7, 9);
        const h = m.h ?? 360;
        return (
          <div key={i} style={{ position: "absolute", left: m.x - 9, top: m.y - h, transform: `translateY(${(1 - k) * -700}px)`, opacity: cl(k * 3, 0, 1) }}>
            <div style={{ width: 18, height: h, borderRadius: 9, background: "repeating-linear-gradient(180deg, #c9b56a 0 86px, #8f7c37 86px 92px)", boxShadow: "4px 0 8px rgba(0,0,0,0.4)" }} />
            <div style={{ position: "absolute", left: 18, top: 10, padding: "12px 26px 14px 22px", ...KRAFT, whiteSpace: "nowrap", clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)",
              boxShadow: "0 8px 14px rgba(0,0,0,0.35)", transformOrigin: "0 50%", transform: `rotateY(${(1 - fl) * 80}deg) rotate(${swing(f - m.f - 10, 3)}deg)` }}>
              <span style={{ fontFamily: SERIF, fontSize: 52, color: H.ink }}>{m.t}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// hilo con pinzas: tarjetas colgadas (reloj de las tres horas)
export const Tendedero: React.FC<{ img: string; items: { t: string; sub?: string; f: number }[]; dur: number; sweep?: boolean }> = ({ img, items, dur, sweep }) => {
  const f = useCurrentFrame();
  const sx = interpolate(f, [items[0].f, items[items.length - 1].f + 20], [-30, 110], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={65} dur={dur} zoom={[1.03, 1.08]} />
      {sweep && <AbsoluteFill style={{ background: `linear-gradient(100deg, transparent ${sx - 25}%, rgba(255,226,150,0.28) ${sx}%, transparent ${sx + 25}%)` }} />}
      <div style={{ position: "absolute", left: -20, right: -20, top: 118, height: 5, ...TWINE, transform: "rotate(1.2deg)" }} />
      {items.map((it, i) => {
        const x = 380 + i * (1160 / Math.max(1, items.length - 1)); const k = sp(f - it.f, 10, 0.8);
        return (
          <div key={i} style={{ position: "absolute", left: x - 140, top: 120 + i * 8, width: 280, transformOrigin: "140px 0", transform: `translateY(${(1 - k) * -400}px) rotate(${swing(f - it.f - 4, 9, 30, 22)}deg)` }}>
            <div style={{ marginTop: 40, padding: "26px 10px 24px", textAlign: "center", ...KRAFT, boxShadow: "0 14px 26px rgba(0,0,0,0.45)" }}>
              <div style={{ fontFamily: SERIF, fontSize: 76, color: H.ink, lineHeight: 1 }}>{it.t}</div>
              {it.sub && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: H.leaf, marginTop: 8 }}>{it.sub}</div>}
            </div>
            <Pinza style={{ left: 123, top: -14 }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// (8) recuerdo: la foto vieja es el objeto; una hoja de libreta arrancada trae la frase o el lugar
export const Recuerdo: React.FC<{ img: string; head: string; quote?: string; fQuote?: number; dur: number }> = ({ img, head, quote, fQuote = 0, dur }) => {
  const f = useCurrentFrame();
  const k = sp(f - 6, 14), q = quote ? sp(f - fQuote, 14) : 0;
  const torn = "polygon(0 4%, 4% 0, 9% 3%, 14% 0, 19% 4%, 25% 1%, 31% 4%, 37% 0, 43% 3%, 50% 0, 56% 4%, 62% 1%, 68% 4%, 74% 0, 80% 3%, 86% 0, 92% 4%, 100% 1%, 100% 100%, 0 100%)";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={145} dur={dur} zoom={[1.0, 1.12]} />
      <div style={{ position: "absolute", left: 90, bottom: 90, padding: "14px 30px 18px", ...KRAFT, boxShadow: "0 12px 24px rgba(0,0,0,0.45)", transform: `translateX(${(1 - k) * -700}px) rotate(-2deg)` }}>
        <span style={{ fontFamily: SERIF, fontSize: 58, color: H.ink }}>{head}</span>
      </div>
      {quote && (
        <div style={{ position: "absolute", right: 110, top: 150, width: 720, padding: "56px 54px 50px 90px", background: "#FBF8F0",
          backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(70,110,170,0.28) 62px 64px), linear-gradient(90deg, transparent 64px, rgba(200,60,50,0.45) 64px 67px, transparent 67px)",
          clipPath: torn, boxShadow: "0 20px 40px rgba(0,0,0,0.45)", transform: `translateY(${(1 - q) * 900}px) rotate(${2 - q}deg)` }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 60, lineHeight: 1.08, color: H.ink }}>«{quote}»</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: H.leaf, marginTop: 20 }}>— Don Tomás</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// calendario de 12 baldosas de barro, una por mes, sobre la pared del patio
export const Baldosas: React.FC<{ img: string; foot: string; marks?: { m: number; t: string; f: number }[]; dur: number }> = ({ img, foot, marks = [], dur }) => {
  const f = useCurrentFrame();
  const M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={154} dur={dur} zoom={[1.02, 1.07]} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 110, top: 300, width: 760, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, transform: "rotateY(14deg)", transformOrigin: "0 50%" }}>
          {M.map((m, i) => {
            const k = sp(f - 4 - i * 3, 12); const mk = marks.find((x) => x.m === i); const on = mk ? cl((f - mk.f) / 8, 0, 1) : 0;
            return (
              <div key={i} style={{ height: 150, borderRadius: 6, background: `radial-gradient(ellipse at 40% 35%, #d77850, ${H.terra} 60%, #8d3d1e)`, boxShadow: "0 10px 18px rgba(0,0,0,0.4), inset 0 -4px 0 rgba(0,0,0,0.18)",
                transform: `translateZ(${(1 - k) * 400}px) rotateX(${(1 - k) * 70}deg)`, opacity: cl(k * 2, 0, 1), position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: 12, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: "#F7DFC8" }}>{m}</div>
                {mk && <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, padding: "6px 8px", borderRadius: 4, background: H.leaf, color: H.cream, fontFamily: SANS, fontWeight: 600, fontSize: 22, textAlign: "center", opacity: on, transform: `scale(${0.6 + 0.4 * on})` }}>{mk.t}</div>}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 150, padding: "14px 30px 18px", ...KRAFT, boxShadow: "0 12px 24px rgba(0,0,0,0.45)", transform: `rotate(-2deg) scale(${sp(f - 10, 13)})`, transformOrigin: "0 50%" }}>
        <span style={{ fontFamily: SERIF, fontSize: 58, color: H.ink }}>{foot}</span>
      </div>
    </AbsoluteFill>
  );
};

// etiquetas kraft colgadas de hilo sobre cosas de la foto (macetas)
export const Colgantes: React.FC<{ img: string; seed: number; items: { x: number; y: number; head: string; lines: string[]; f: number }[]; dur: number }> = ({ img, seed, items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={seed} dur={dur} zoom={[1.02, 1.06]} />
      {items.map((it, i) => {
        const k = sp(f - it.f, 10, 0.8);
        return (
          <div key={i} style={{ position: "absolute", left: it.x, top: 0, width: 470, transformOrigin: "235px 0", transform: `translateY(${(1 - k) * -900}px) rotate(${swing(f - it.f - 4, 7, 32, 24)}deg)` }}>
            <div style={{ marginLeft: 233, width: 4, height: it.y, ...TWINE }} />
            <div style={{ padding: "26px 34px 30px", ...KRAFT, borderRadius: 10, boxShadow: "0 16px 30px rgba(0,0,0,0.45)", position: "relative" }}>
              <div style={{ position: "absolute", left: 223, top: 12, width: 24, height: 24, borderRadius: "50%", background: "rgba(40,25,10,0.5)" }} />
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 5, color: H.leaf, marginTop: 22 }}>{it.head}</div>
              {it.lines.map((l, j) => <div key={j} style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.05, color: H.ink, marginTop: 6 }}>{l}</div>)}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// (9) dato con fuente: ficha de cartulina clavada con chinche sobre la foto
export const Ficha: React.FC<{ img: string; quote: string; source: string; dur: number }> = ({ img, quote, source, dur }) => {
  const f = useCurrentFrame();
  const k = sp(f - 4, 13, 0.9), s2 = cl((f - 26) / 10, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={224} dur={dur} zoom={[1.05, 1.12]} />
      <AbsoluteFill style={{ background: "rgba(20,14,8,0.25)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 360, top: 230, width: 1200, padding: "70px 80px 56px", background: "#FFFDF6",
          backgroundImage: "linear-gradient(180deg, transparent 54px, rgba(200,60,50,0.55) 54px 57px, transparent 57px), repeating-linear-gradient(180deg, transparent 0 70px, rgba(70,110,170,0.22) 70px 72px)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transform: `translateY(${(1 - k) * 900}px) rotateX(${(1 - k) * 30}deg) rotate(-1.5deg)` }}>
          <div style={{ position: "absolute", left: 588, top: -14, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9fd27a, #3f6b35 65%, #24401d)", boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
          <div style={{ fontFamily: SERIF, fontSize: 78, lineHeight: 1.08, color: H.ink }}>{quote}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 32, color: "#5a4a38", marginTop: 34, opacity: s2 }}>{source}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// receta: el dorso de un sobre de semillas con las instrucciones, cada renglón en su palabra
export const Sobre: React.FC<{ img: string; head: string; lines: { t: string; f: number }[]; dur: number }> = ({ img, head, lines, dur }) => {
  const f = useCurrentFrame(); const k = sp(f - 4, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={250} dur={dur} zoom={[1.03, 1.1]} o={[34, 45]} />
      <div style={{ position: "absolute", left: 1050, top: 110, width: 780, height: 860, ...KRAFT, boxShadow: "0 26px 50px rgba(0,0,0,0.5)", transform: `translateX(${(1 - k) * 1000}px) rotate(2deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, background: "rgba(80,50,20,0.16)", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        <div style={{ position: "absolute", left: 60, right: 50, top: 130 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: H.leaf }}>{head}</div>
          {lines.map((l, i) => {
            const a = cl((f - l.f) / 9, 0, 1);
            return <div key={i} style={{ fontFamily: SERIF, fontSize: 54, lineHeight: 1.1, color: H.ink, marginTop: 26, opacity: a, transform: `translateY(${(1 - a) * 14}px)`, borderBottom: "2px dashed rgba(70,45,20,0.3)", paddingBottom: 14 }}>{l.t}</div>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// preguntas de los comentarios: papelito kraft rasgado que se suelta de debajo de una piedrita
export const Papelito: React.FC<{ img: string; n: number; text: string; dur: number }> = ({ img, n, text, dur }) => {
  const f = useCurrentFrame(); const k = sp(f - 4, 13);
  const torn = "polygon(0 6%, 5% 0, 12% 4%, 20% 0, 28% 5%, 36% 1%, 45% 4%, 54% 0, 63% 5%, 72% 1%, 81% 4%, 90% 0, 100% 5%, 98% 94%, 90% 100%, 80% 96%, 70% 100%, 60% 95%, 50% 100%, 40% 96%, 30% 100%, 20% 95%, 10% 100%, 2% 96%)";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={285 + n} dur={dur} zoom={[1.04, 1.1]} />
      <AbsoluteFill style={{ background: "rgba(20,14,8,0.3)" }} />
      <div style={{ position: "absolute", left: 300, top: n ? 300 : 360, width: 1320, padding: "64px 80px 70px", ...KRAFT, clipPath: torn, boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
        transform: `translateY(${(1 - k) * 800}px) rotate(${(n % 2 ? -1 : 1) * 1.6}deg)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 8, color: H.leaf }}>{n ? `PREGUNTA ${n}` : "DE LOS COMENTARIOS"}</div>
        <div style={{ fontFamily: SERIF, fontSize: n ? 76 : 84, lineHeight: 1.06, color: H.ink, marginTop: 14 }}>{text}</div>
      </div>
      <div style={{ position: "absolute", left: 1500, top: n ? 270 : 330, width: 120, height: 86, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(ellipse at 35% 30%, #b9b4aa, #7d786f 60%, #4f4b45)", boxShadow: "0 10px 14px rgba(0,0,0,0.45)", transform: `scale(${sp(f, 10)})` }} />
    </AbsoluteFill>
  );
};

// CTA: el sobre de semillas del próximo video se clava en una estaca del patio
export const CTAsobre: React.FC<{ img: string; next: string; nextImg: string; dur: number }> = ({ img, next, nextImg, dur }) => {
  const f = useCurrentFrame(); const k = sp(f - 8, 12, 0.9), s = sp(f - 40, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Foto src={img} seed={384} dur={dur} zoom={[1.02, 1.1]} o={[40, 55]} />
      <div style={{ position: "absolute", left: 1420, top: 360, width: 44, height: 760, ...WOOD, clipPath: "polygon(0 0, 100% 0, 100% 94%, 50% 100%, 0 94%)", transform: `translateY(${(1 - k) * 800}px)` }} />
      <div style={{ position: "absolute", left: 1210, top: 170, transform: `translateY(${(1 - k) * 800}px) rotate(${3 + swing(f - 20, 4)}deg)` }}>
        <div style={{ width: 460, height: 640, ...KRAFT, boxShadow: "0 24px 46px rgba(0,0,0,0.5)", position: "relative", borderRadius: 3 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "rgba(80,50,20,0.16)", borderBottom: "2px dashed rgba(70,45,20,0.35)" }} />
          <div style={{ position: "absolute", left: 34, right: 34, top: 84, height: 300, overflow: "hidden", border: "3px solid rgba(60,38,15,0.55)" }}>
            <Img src={staticFile(nextImg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", left: 34, top: 404, fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 6, color: H.leaf }}>EL QUE SIGUE</div>
          <div style={{ position: "absolute", left: 34, right: 30, top: 446, fontFamily: SERIF, fontSize: 52, lineHeight: 1.04, color: H.ink }}>{next}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 120, padding: "18px 40px 22px", ...WOOD, borderRadius: 6, boxShadow: "0 14px 28px rgba(0,0,0,0.45)", transform: `scale(${s}) rotate(-2deg)`, transformOrigin: "0 50%" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 8, color: H.cream }}>SUSCRÍBETE</span>
      </div>
    </AbsoluteFill>
  );
};
