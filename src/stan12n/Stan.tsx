// Kit de Stan the Butcher (stan12) · look "papel de carnicero y pizarra de precios". PURO CSS y DOM: sin SVG, sin texturas PNG, sin blur grande.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";

const { fontFamily: SLAB } = loadSlab("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
export const F = { SLAB, SANS, HAND, SERIF };

export const K = { kraft: "#C9A26B", kraft2: "#B98E55", kraftD: "#8A653A", paper: "#F4EBDD", ink: "#231710", red: "#B3261E", redD: "#7E1712", slate: "#22292A", slate2: "#2E3738", chalk: "#F3EFE4", steel: "#C9CED1", tile: "#F2F0EA", twine: "#E9DFC8", gold: "#E8B64C" };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => Easing.inOut(Easing.cubic)(cl(t, 0, 1));
const eout = (t: number) => Easing.out(Easing.cubic)(cl(t, 0, 1));
export const hash = (n: number) => { let x = Math.imul(n + 1, 2654435761) >>> 0; x ^= x >>> 16; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; x = Math.imul(x, 3266489909) >>> 0; x ^= x >>> 16; return x >>> 0; };
const useSp = (delay = 0, damping = 16, mass = 0.7) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass } }); };
const fadeOut = (f: number, dur: number, len = 9) => interpolate(f, [dur - len, dur], [1, 0], CL);
const SH = "0 3px 0 rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.55)";

// ---------- materiales (CSS)
// papel kraft: fibras con gradientes repetidos + borde rasgado con clip-path
export const kraftBg = (seed = 0): React.CSSProperties => ({
  backgroundColor: K.kraft,
  backgroundImage: `repeating-linear-gradient(${88 + (seed % 5)}deg, rgba(90,58,24,0.10) 0 1px, transparent 1px 7px), repeating-linear-gradient(${2 + (seed % 3)}deg, rgba(255,240,205,0.10) 0 2px, transparent 2px 13px), linear-gradient(180deg, rgba(255,235,190,0.25), rgba(110,70,30,0.18))`,
});
const torn = (seed: number, n = 26, amp = 1.3) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${(hash(seed + i) % 100) / 100 * amp}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - (hash(seed + 99 + i) % 100) / 100 * amp}%`);
  return `polygon(${pts.join(",")})`;
};
// pizarra: verde-gris con polvo de tiza
export const slateBg: React.CSSProperties = {
  backgroundColor: K.slate,
  backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.07), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(255,255,255,0.05), transparent 50%), repeating-linear-gradient(8deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 11px)`,
};
const chalkTxt: React.CSSProperties = { fontFamily: HAND, fontWeight: 700, color: K.chalk, textShadow: "0 0 2px rgba(243,239,228,0.6), 1px 1px 0 rgba(0,0,0,0.25)" };
// cuerda de atar
const Twine: React.FC<{ w: number; y: number; x?: number; rot?: number }> = ({ w, y, x = 0, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 7, borderRadius: 4, transform: `rotate(${rot}deg)`,
    backgroundImage: `repeating-linear-gradient(60deg, ${K.twine} 0 5px, #CDBF9F 5px 9px)`, boxShadow: "0 2px 3px rgba(0,0,0,0.35)" }} />
);
// sello de la casa
export const Seal: React.FC<{ s?: number; rot?: number; op?: number }> = ({ s = 1, rot = -7, op = 0.85 }) => (
  <div style={{ border: `${3 * s}px solid ${K.red}`, outline: `${1.5 * s}px solid ${K.red}`, outlineOffset: 3 * s, borderRadius: 6 * s, padding: `${7 * s}px ${16 * s}px`, color: K.red, fontFamily: SANS, fontWeight: 700,
    fontSize: 17 * s, letterSpacing: 3 * s, transform: `rotate(${rot}deg)`, opacity: op, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.25 }}>
    STAN'S MEATS · CHICAGO<br />SINCE 1961
  </div>
);
// foto de fondo oscurecida con deriva (sin blur)
export const DarkPhoto: React.FC<{ src: string; dur: number; seed?: number; dark?: number }> = ({ src, dur, seed = 0, dark = 0.6 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.1, 1.2]); const x = interpolate(f, [0, dur], [seed % 2 ? -22 : 22, seed % 2 ? 22 : -22]);
  const st: React.CSSProperties = { width: 1920, height: 1080, objectFit: "cover", filter: `brightness(${1 - dark}) saturate(0.8)`, transform: `translateX(${x}px) scale(${s})` };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      {src.endsWith(".mp4") ? <OffthreadVideo src={staticFile(src)} muted playbackRate={0.5} style={st} /> : <Img src={staticFile(src)} style={st} />}
    </AbsoluteFill>
  );
};

// ---------- OVERLAYS (van sobre foto o clip; nunca arriba a la izquierda)
// etiqueta de precio manuscrita, colgada de su cuerda (abajo a la derecha)
export const PriceTag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const p = useSp(0, 11, 0.8);
  const sw = Math.sin(f / 9) * 2.2 * Math.max(0, 1 - f / 70);
  const parts = text.split(" · ");
  return (
    <div style={{ position: "absolute", right: 110, bottom: 120, opacity: fadeOut(f, dur), transformOrigin: "88% -30%", transform: `rotate(${lerp(-38, -4, p) + sw}deg)` }}>
      <div style={{ position: "absolute", right: 46, top: -150, width: 5, height: 170, background: K.twine, transform: "rotate(9deg)", boxShadow: "1px 0 2px rgba(0,0,0,0.4)" }} />
      <div style={{ ...kraftBg(3), background: K.paper, padding: "30px 84px 32px 52px", clipPath: "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)", boxShadow: SH, minWidth: 300 }}>
        {parts.map((t, i) => (
          <div key={i} style={{ fontFamily: i ? SANS : HAND, fontWeight: 700, fontSize: i ? 34 : (text.length > 26 ? 68 : 88), letterSpacing: i ? 4 : 0, color: i ? K.red : K.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 30, top: "50%", width: 16, height: 16, marginTop: -8, borderRadius: "50%", background: "#3a2a1a", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.6)" }} />
    </div>
  );
};
// palabras en tiza, grandes, que se escriben una por una (centro-abajo)
export const Chalk: React.FC<{ lines: string[]; dur: number }> = ({ lines, dur }) => {
  const f = useCurrentFrame(); let k = 0; const cfs = Math.min(lines.length > 1 ? 104 : 124, Math.floor(1640 / (Math.max(...lines.map((l) => l.length), 6) * 0.62)));
  return (
    <AbsoluteFill style={{ opacity: fadeOut(f, dur), justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(14,10,7,0.78) 0%, rgba(14,10,7,0.35) 38%, rgba(14,10,7,0) 60%)" }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        {lines.map((ln, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center", flexWrap: "nowrap", whiteSpace: "nowrap", columnGap: Math.round(cfs * 0.24) }}>
            {ln.split(" ").map((w, j) => { const d = 3 + (k++) * 4; const p = interpolate(f, [d, d + 7], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
              return <span key={j} style={{ ...chalkTxt, fontFamily: SLAB, fontWeight: 400, fontSize: cfs, lineHeight: 1.08, color: i === lines.length - 1 && lines.length > 1 ? K.gold : K.chalk, textShadow: SH, display: "inline-block", clipPath: `inset(0 ${100 - p * 100}% 0 0)`, transform: `translateY(${(1 - p) * 10}px)` }}>{w}</span>; })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
// cinta de papel de carnicero con lo que hay que decir en el mostrador
export const Tape: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const p = eout(f / 14);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, display: "flex", justifyContent: "center", opacity: fadeOut(f, dur) }}>
      <div style={{ ...kraftBg(7), clipPath: `inset(0 ${50 - p * 50}% 0 ${50 - p * 50}%)`, padding: "22px 70px 26px", boxShadow: SH, transform: "rotate(-1.2deg)", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: K.redD }}>{sub}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: K.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{title}</div>
      </div>
    </div>
  );
};
// termómetro de carnicero de aguja (dial de acero) — CSS
export const Dial: React.FC<{ deg: number; dur: number; label?: string }> = ({ deg, dur, label }) => {
  const f = useCurrentFrame(); const p = useSp(0, 14);
  const t = interpolate(f, [8, 44], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const v = Math.round(lerp(Math.min(deg, 40), deg, t));
  const ang = (x: number) => -130 + ((x - 0) / 220) * 260;   // escala 0-220 °F
  const hot = deg >= 145;
  return (
    <div style={{ position: "absolute", right: 130, top: 120, opacity: p * fadeOut(f, dur), transform: `scale(${(0.75 + 0.25 * p) * 1.4})`, transformOrigin: "100% 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 330, height: 330, borderRadius: "50%", background: `radial-gradient(circle at 35% 28%, #FFFFFF, ${K.steel} 62%, #8E969A 100%)`, boxShadow: "0 18px 40px rgba(0,0,0,0.55), inset 0 0 0 10px #A9B0B4, inset 0 0 0 14px #6E777B", position: "relative" }}>
        <div style={{ position: "absolute", inset: 26, borderRadius: "50%", background: K.paper, boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3)" }} />
        {Array.from({ length: 23 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 165 - (i % 2 ? 1.5 : 2.5), top: 36, width: i % 2 ? 3 : 5, height: i % 2 ? 14 : 24, background: i * 10 === 140 || i * 10 === 150 ? K.red : K.ink, transformOrigin: `50% 129px`, transform: `rotate(${ang(i * 10)}deg)` }} />
        ))}
        {/* zona segura 145+ */}
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: `conic-gradient(from ${ang(145)}deg, rgba(179,38,30,0.22) 0deg ${ang(220) - ang(145)}deg, transparent 0deg)` }} />
        <div style={{ position: "absolute", left: 160, top: 52, width: 10, height: 130, background: K.red, borderRadius: 5, transformOrigin: "50% 113px", transform: `rotate(${ang(lerp(Math.min(deg, 40), deg, t))}deg)`, boxShadow: "2px 2px 4px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 145, top: 145, width: 40, height: 40, borderRadius: "50%", background: "#5B6468", boxShadow: "inset 0 3px 5px rgba(255,255,255,0.4)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: K.ink }}>°F</div>
      </div>
      <div style={{ fontFamily: SLAB, fontSize: 120, lineHeight: 0.95, color: hot ? K.chalk : K.chalk, textShadow: SH, marginTop: 10 }}>{v}°F</div>
      {label ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: K.gold, textShadow: SH }}>{label}</div> : null}
    </div>
  );
};
// reloj de cuerda de la cocina (CSS): la perilla gira hasta el tiempo y hace tic
export const WindUp: React.FC<{ min: number; label?: string; dur: number }> = ({ min, label, dur }) => {
  const f = useCurrentFrame(); const p = useSp(0, 13);
  const secs = min < 1;
  const top = secs ? 60 : 60;
  const val = secs ? min * 60 : min;
  const set = interpolate(f, [4, 30], [0, val], { ...CL, easing: Easing.out(Easing.back(1.3)) });
  const tick = f > 34 ? Math.floor((f - 34) / 15) * (secs ? 1 : 0.2) : 0;
  const a = -((set - Math.min(val * 0.3, tick)) / top) * 360;
  const big = secs ? `${Math.round(val)} seconds` : val >= 60 ? `${val / 60} hour${val > 60 ? "s" : ""}` : `${String(val).replace(".5", "½")} minute${val === 1 ? "" : "s"}`;
  return (
    <div style={{ position: "absolute", right: 130, top: 130, opacity: p * fadeOut(f, dur), transform: `scale(${(0.75 + 0.25 * p) * 1.4})`, transformOrigin: "100% 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 35% 28%, #FFFDF4, #EDE3C8 65%, #C9BB96 100%)", boxShadow: "0 18px 40px rgba(0,0,0,0.55), inset 0 0 0 8px #D9CDAA", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${a}deg)` }}>
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 150 - (i % 5 ? 1 : 2), top: 16, width: i % 5 ? 2 : 4, height: i % 5 ? 10 : 20, background: K.ink, transformOrigin: "50% 134px", transform: `rotate(${i * 6}deg)` }} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 120, top: 40, width: 60, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: K.ink, transformOrigin: "50% 110px", transform: `rotate(${i * 30}deg)` }}>{i * 5}</div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 138, top: -6, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: `26px solid ${K.red}` }} />
        <div style={{ position: "absolute", left: 96, top: 96, width: 108, height: 108, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #D8473E, ${K.redD})`, boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
      </div>
      <div style={{ fontFamily: SLAB, fontSize: 64, color: K.chalk, textShadow: SH, marginTop: 14, whiteSpace: "nowrap" }}>{big}</div>
      {label ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: K.gold, textShadow: SH, whiteSpace: "nowrap" }}>{label}</div> : null}
    </div>
  );
};
// lectura de balanza: número que sube (°F, $, etc.)
export const Scale: React.FC<{ to: number; suffix: string; label: string; dur: number }> = ({ to, suffix, label, dur }) => {
  const f = useCurrentFrame(); const p = useSp(0, 14);
  const v = Math.round(to * interpolate(f, [6, 36], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }));
  return (
    <div style={{ position: "absolute", right: 120, top: 130, opacity: p * fadeOut(f, dur), transform: `translateY(${(1 - p) * -60}px) scale(1.3)`, transformOrigin: "100% 0" }}>
      <div style={{ background: "linear-gradient(180deg, #DDE1E3, #A9B0B4)", padding: 16, borderRadius: 14, boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
        <div style={{ background: "#141a14", borderRadius: 8, padding: "10px 34px", minWidth: 330, textAlign: "right", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)" }}>
          <span style={{ fontFamily: SLAB, fontSize: 130, color: "#F6E7B0", lineHeight: 1 }}>{v}</span>
          <span style={{ fontFamily: SLAB, fontSize: 62, color: "#F6E7B0", marginLeft: 8 }}>{suffix}</span>
        </div>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: K.gold, textShadow: SH, marginTop: 12, textAlign: "right" }}>{label}</div>
    </div>
  );
};
// barra de progreso: riel de ganchos; los hechos llevan su chapa roja
export const Rail: React.FC<{ n: number; total: number; title: string; dur: number; word?: string; asc?: boolean }> = ({ n, total, title, dur, word = "TECHNIQUE", asc }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  const done = asc ? n - 1 : total - n; // cuenta regresiva (n=10 es el primero) o ascendente
  return (
    <div style={{ position: "absolute", right: 60, top: 46, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", transform: "scale(1.35)", transformOrigin: "100% 0" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 21, letterSpacing: 4, color: K.chalk, textShadow: SH }}>
        {word} <span style={{ color: K.gold }}>{done + 1}</span> OF {total} · {title.toUpperCase()}
      </div>
      <div style={{ position: "relative", height: 46, width: total * 44 + 10, marginTop: 8 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 4, height: 6, borderRadius: 3, background: "linear-gradient(180deg, #E3E7E9, #7B8488)", boxShadow: "0 2px 5px rgba(0,0,0,0.5)" }} />
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 14 + i * 44, top: 6, width: 4, height: 16, background: "#AEB5B8" }}>
            <div style={{ position: "absolute", left: -8, top: 14, width: 20, height: 22, borderRadius: 3, background: i <= done ? (i === done ? K.gold : K.red) : "rgba(244,235,221,0.4)", boxShadow: "0 2px 4px rgba(0,0,0,0.45)", transform: i === done ? `rotate(${Math.sin(f / 6) * 7}deg)` : undefined, transformOrigin: "50% 0" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- PLANOS PROPIOS (pantalla completa)
// hoja de papel kraft que cruza la pantalla (transición de capítulo)
export const KraftWipe: React.FC<{ dir: number; len?: number }> = ({ dir, len = 20 }) => {
  const f = useCurrentFrame(); const t = f / len; if (t < 0 || t > 1) return null;
  const pos = lerp(-135, 135, Easing.inOut(Easing.quad)(t)) * (dir % 2 ? -1 : 1);
  const vert = dir === 2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: vert ? "-10%" : "-15%", top: vert ? "-20%" : "-15%", width: vert ? "120%" : "130%", height: vert ? "140%" : "130%", ...kraftBg(dir),
        transform: vert ? `translateY(${pos}%)` : `translateX(${pos}%) rotate(${dir === 3 ? 9 : -4}deg)`, clipPath: torn(dir * 7 + 3, 30, 2.2), boxShadow: "0 0 60px rgba(0,0,0,0.5)" }} />
    </AbsoluteFill>
  );
};
// apertura de cada técnica: el papel pasa, la foto del corte llena la pantalla, el número se sella y el título se escribe
export const TechScene: React.FC<{ n: number; label: string; title: string; src: string; dur: number; total?: number; num?: string }> = ({ n, label, title, src, dur, total = 10, num }) => {
  const f = useCurrentFrame();
  const v = n, right = v % 2 === 1, mode = v % 3;
  const k = cl((f - 10) / (dur - 10), 0, 1);
  const z = mode === 0 ? lerp(1.26, 1.08, eout(k)) : mode === 1 ? lerp(1.05, 1.2, k) : 1.14;
  const px = mode === 2 ? lerp(right ? 3.5 : -3.5, right ? -3.5 : 3.5, k) : 0;
  const q = dur < 100 ? 0.55 : 1;   // planos cortos: todo entra antes
  const st = spring({ frame: f - 16 * q, fps: 30, config: { damping: 9, mass: 0.7 } });
  const words = title.split(" ");
  const side: React.CSSProperties = right ? { right: 110, alignItems: "flex-end", textAlign: "right" } : { left: 110, alignItems: "flex-start" };
  return (
    <AbsoluteFill>
      {f >= 10 && (
        <AbsoluteFill style={{ opacity: fadeOut(f, dur, 8) }}>
          <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${px}%) scale(${z})` }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(16,11,8,0.88) 0%, rgba(16,11,8,0.45) 42%, rgba(16,11,8,0) 68%)` }} />
          <div style={{ position: "absolute", top: 210, width: 900, display: "flex", flexDirection: "column", ...side }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: 9, color: K.gold, textShadow: SH, opacity: cl((f - 12) / 8, 0, 1) }}>{label}</div>
            <div style={{ fontFamily: SLAB, fontSize: 330, lineHeight: 0.92, color: K.chalk, textShadow: SH, opacity: cl(st * 1.6, 0, 1), transform: `scale(${lerp(2.1, 1, st)}) rotate(${lerp(-12, -3, st)}deg)`, transformOrigin: right ? "100% 60%" : "0% 60%" }}>{num ?? (n > total ? "+" : String(n))}</div>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 4 }}>
              {words.map((w, i) => { const p = spring({ frame: f - (30 + i * 5) * q, fps: 30, config: { damping: 15, mass: 0.6 } });
                return <span key={i} style={{ fontFamily: SERIF, fontSize: 96, color: K.chalk, textShadow: SH, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>; })}
            </div>
            <div style={{ height: 7, marginTop: 20, width: 300 * interpolate(f, [44, 62], [0, 1], CL), backgroundImage: `repeating-linear-gradient(60deg, ${K.twine} 0 5px, #CDBF9F 5px 9px)`, borderRadius: 4 }} />
          </div>
        </AbsoluteFill>
      )}
      <KraftWipe dir={v % 4} len={20} />
    </AbsoluteFill>
  );
};
// tarjeta del carrusel / recap: paquete de papel kraft atado, con la foto
export type TCard = { n: number; title: string; src: string };
const Parcel: React.FC<{ c: TCard; w: number; dim?: number; check?: number }> = ({ c, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, ...kraftBg(c.n), padding: w * 0.04, paddingBottom: w * 0.035, boxShadow: "0 22px 50px rgba(0,0,0,0.5)", borderRadius: 3, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.6, overflow: "hidden", position: "relative", boxShadow: "inset 0 0 0 2px rgba(60,35,10,0.35)" }}>
      <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.4})` }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.66, height: 6, backgroundImage: `repeating-linear-gradient(60deg, ${K.twine} 0 5px, #CDBF9F 5px 9px)`, boxShadow: "0 2px 3px rgba(0,0,0,0.35)" }} />
    <div style={{ display: "flex", alignItems: "center", gap: w * 0.035, marginTop: w * 0.06, height: w * 0.2 }}>
      <span style={{ fontFamily: SLAB, fontSize: w * 0.15, color: K.red, lineHeight: 1 }}>{c.n}</span>
      <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: w * 0.092, color: K.ink, lineHeight: 0.98, opacity: 1 - dim * 0.4 }}>{c.title}</span>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.04, top: -w * 0.05, transform: `scale(${lerp(2.2, 1, check)}) rotate(${lerp(-30, -9, check)}deg)`, opacity: cl(check * 2, 0, 1) }}>
        <div style={{ width: w * 0.22, height: w * 0.22, borderRadius: "50%", background: K.red, border: `${w * 0.012}px solid ${K.paper}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.4)", fontFamily: SANS, fontWeight: 700, fontSize: w * 0.13, color: K.paper }}>✓</div>
      </div>
    )}
  </div>
);
// carrusel 3D de las N técnicas sobre la foto real oscurecida → termina en abanico
export const Carousel: React.FC<{ cards: TCard[]; bg: string; head: string; sub: string; subAt: number; dur: number }> = ({ cards, bg, head, sub, subAt, dur }) => {
  const f = useCurrentFrame(); const pIn = useSp(0, 20);
  const fanT = eio((f - dur * 0.6) / 34); const rot = -f * 0.6; const R = 860, PR = 2000; const N = cards.length;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(f, dur, 12) }}>
      <DarkPhoto src={bg} dur={dur} dark={0.62} />
      <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center", opacity: pIn, transform: `translateY(${(1 - pIn) * -40}px)` }}>
        <div style={{ fontFamily: SLAB, fontSize: 86, color: K.chalk, textShadow: SH, lineHeight: 1 }}><span style={{ color: K.gold }}>{N}</span> {head}</div>
        <div style={{ ...chalkTxt, fontSize: 54, marginTop: 6, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>{sub}</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%", transformOrigin: "50% 52%", transform: `scale(${lerp(1.3, 0.8, fanT)})` }}>
        {cards.map((c, i) => {
          const appear = spring({ frame: f - 4 - i * 4, fps: 30, config: { damping: 16, mass: 0.6 } });
          const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180; const rad = (th * Math.PI) / 180;
          const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
          const phi = -30 + i * (60 / Math.max(1, N - 1)), pr = (phi * Math.PI) / 180;
          const fx = PR * Math.sin(pr), fy = PR * (1 - Math.cos(pr));
          const x = lerp(rx, fx, fanT), y = lerp(40, fy, fanT), zz = lerp(rz, i * 2, fanT);
          const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.1, 1), 1, fanT);
          return (
            <div key={i} style={{ position: "absolute", left: 960 - 260, top: 330, zIndex: Math.round(2000 + zz), opacity: vis * appear,
              transform: `translate3d(${x}px, ${y}px, ${zz}px) rotateY(${lerp(th, 0, fanT)}deg) rotateZ(${lerp(0, phi, fanT)}deg) scale(${lerp(1, 0.78, fanT) * appear})` }}>
              <Parcel c={c} w={520} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// recap: las N en dos filas, se sellan una por una sobre su palabra; a la derecha se escribe el dato clave en tiza
export const Recap: React.FC<{ cards: TCard[]; items: { f: number; lines: string[] }[]; bg: string; dur: number }> = ({ cards, items, bg, dur }) => {
  const f = useCurrentFrame(); let cur = -1; items.forEach((it, i) => { if (f >= it.f) cur = i; });
  const per = Math.ceil(cards.length / 2);
  return (
    <AbsoluteFill>
      <DarkPhoto src={bg} dur={dur} dark={0.72} />
      <div style={{ position: "absolute", left: 60, top: 40, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 7, color: K.gold, textShadow: SH, opacity: 0 }}> </div>
      {cards.map((c, i) => {
        const row = Math.floor(i / per), col = i % per; const it = items[i];
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } }); const lit = f >= it.f; const isCur = i === cur;
        return (
          <div key={i} style={{ position: "absolute", left: 70 + col * 360, top: 36 + row * 292, opacity: e, zIndex: isCur ? 5 : 1,
            transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.7}deg) scale(${isCur ? 1.1 : lit ? 1 : 0.94})` }}>
            <Parcel c={c} w={300} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
          </div>
        );
      })}
      {/* pizarra con el dato de la técnica en curso */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 650, height: 384, ...slateBg, borderRadius: 6, border: "14px solid #6B4A2B", boxShadow: "0 24px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.5)", padding: "26px 50px", overflow: "hidden" }}>
        {cur >= 0 && (() => { const it = items[cur]; const c = cards[cur];
          return (
            <div key={cur} style={{ display: "flex", gap: 44, alignItems: "center", height: "100%" }}>
              <div style={{ fontFamily: SLAB, fontSize: 250, color: K.gold, lineHeight: 0.9, minWidth: 250, textAlign: "center", opacity: cl((f - it.f) / 6, 0, 1) }}>{c.n}</div>
              <div>
                <div style={{ ...chalkTxt, fontSize: 84, lineHeight: 1, clipPath: `inset(0 ${100 - cl((f - it.f) / 10, 0, 1) * 100}% 0 0)` }}>{c.title}</div>
                {it.lines.map((l, j) => <div key={j} style={{ ...chalkTxt, fontSize: 62, lineHeight: 1.15, opacity: 0.92, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - cl((f - it.f - 12 - j * 14) / 14, 0, 1) * 100}% 0 0)` }}>{l}</div>)}
              </div>
            </div>
          ); })()}
      </div>
    </AbsoluteFill>
  );
};
// ticket de papel de carnicero con la receta escrita a lápiz graso: renglones que aparecen sobre su palabra
export type Line = { t: string; f: number };
export const Ticket: React.FC<{ kicker: string; title: string; lines: Line[]; img: string; dur: number; seed: number }> = ({ kicker, title, lines, img, dur, seed }) => {
  const f = useCurrentFrame(); const pin = useSp(0, 17, 0.8);
  let cur = -1; lines.forEach((l, i) => { if (f >= l.f) cur = i; });
  const fs = Math.min(lines.length > 7 ? 50 : lines.length > 5 ? 62 : 76, Math.floor(900 / (Math.max(...lines.map((l: any) => String(l.t ?? l).length), 8) * 0.43)));
  const kb = interpolate(f, [0, dur], [1.04, 1.14]);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(f, dur, 10), background: K.ink }}>
      {/* foto real del plato/paso, a la izquierda, entera */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 60%, rgba(20,12,6,0.75) 100%)" }} />
      </div>
      <div style={{ position: "absolute", left: 800, top: 56, width: 1060, height: 968, ...kraftBg(seed), clipPath: torn(seed, 34, 1.1), transform: `translateX(${(1 - pin) * 500}px) rotate(${lerp(4, ((seed % 3) - 1) * 0.5, pin)}deg)`, boxShadow: "0 30px 70px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 70, top: 56, right: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: K.redD }}>{kicker}</div>
            <div style={{ fontFamily: SLAB, fontSize: title.length > 16 ? 56 : 76, color: K.ink, lineHeight: 1.02, marginTop: 8, maxWidth: 720, whiteSpace: "nowrap" }}>{title}</div>
          </div>
          <Seal s={0.95} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 232, height: 7, backgroundImage: `repeating-linear-gradient(60deg, ${K.twine} 0 5px, #CDBF9F 5px 9px)`, boxShadow: "0 2px 3px rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 70, right: 50, top: 270 }}>
          {lines.map((l, i) => { const p = interpolate(f, [l.f, l.f + 12], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) }); const now = i === cur;
            return (
              <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: fs, color: K.ink, lineHeight: 1.32, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - p * 100}% 0 0)`, position: "relative" }}>
                <span style={{ color: K.red, marginRight: 14 }}>—</span>{l.t}
                {now && <span style={{ position: "absolute", left: 40, right: 0, bottom: fs * 0.14, height: fs * 0.3, background: "rgba(255,244,200,0.45)", zIndex: -1 }} />}
              </div>
            ); })}
        </div>
        <div style={{ position: "absolute", right: 70, bottom: 44, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: K.redD, opacity: interpolate(f, [20, 35], [0, 0.9], CL) }}>— Stan</div>
      </div>
    </AbsoluteFill>
  );
};
// cartel de capítulo "FROM THE COUNTER": la campanilla del mostrador y el pincho de tickets (CSS) sobre la foto del local
export const Counter: React.FC<{ kicker: string; title: string; bg: string; dur: number; seed: number }> = ({ kicker, title, bg, dur, seed }) => {
  const f = useCurrentFrame(); const p = useSp(4, 12); const ring = Math.sin(f / 1.6) * 5 * Math.max(0, 1 - Math.abs(f - 12) / 14);
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], CL) }}>
      <DarkPhoto src={bg} dur={dur} seed={seed} dark={0.55} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          {/* campanilla */}
          <div style={{ position: "relative", width: 240, height: 200, transform: `translateX(${ring}px) scale(${p})` }}>
            <div style={{ position: "absolute", left: 20, top: 40, width: 200, height: 120, borderRadius: "100px 100px 12px 12px", background: `radial-gradient(circle at 35% 25%, #FFF6C9, ${K.gold} 55%, #9A7420 100%)`, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }} />
            <div style={{ position: "absolute", left: 104, top: 10, width: 32, height: 40, borderRadius: 16, background: "linear-gradient(180deg,#F1F3F4,#8E969A)" }} />
            <div style={{ position: "absolute", left: 0, top: 156, width: 240, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#3A2A1C,#1C130C)" }} />
          </div>
          <div style={{ ...kraftBg(seed), padding: "40px 80px", clipPath: torn(seed, 24, 2.4), transform: `rotate(${lerp(-5, -1.2, p)}deg) scale(${0.85 + 0.15 * p})`, opacity: p, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: K.redD }}>{kicker}</div>
            <div style={{ fontFamily: SLAB, fontSize: 104, color: K.ink, marginTop: 6, lineHeight: 1 }}>{title}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// pregunta para los comentarios sobre la foto del mostrador (CTA): tira de papel + botón de suscripción de la casa
export const Ask: React.FC<{ text: string; bg: string; dur: number; seed: number }> = ({ text, bg, dur, seed }) => {
  const f = useCurrentFrame(); const p = useSp(4, 15); const b = useSp(26, 10);
  const press = interpolate(f, [70, 76, 84], [1, 0.9, 1], CL); const on = f > 76;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(f, dur, 10) }}>
      <AbsoluteFill style={{ overflow: "hidden" }}><Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, dur], [1.05, 1.15])})`, filter: "brightness(0.62)" }} /></AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 70, flexDirection: "column", gap: 36 }}>
        <div style={{ ...kraftBg(seed), padding: "44px 90px 50px", clipPath: torn(seed + 5, 30, 1.8), maxWidth: 1500, textAlign: "center", transform: `translateY(${(1 - p) * 80}px) rotate(-1deg)`, opacity: p }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 7, color: K.redD }}>TELL ME IN THE COMMENTS</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: K.ink, lineHeight: 1.05, marginTop: 8 }}>{text}</div>
        </div>
        <div style={{ transform: `scale(${b * press})`, background: on ? K.slate2 : K.red, color: K.paper, fontFamily: SANS, fontWeight: 700, fontSize: 44, letterSpacing: 3, padding: "20px 60px", borderRadius: 50, boxShadow: SH }}>{on ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// avatar con encuadres: push lento siempre + punch-in en golpes
export const Avatar: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[] }> = ({ src, seed, dur, mods = [] }) => {
  const f = useCurrentFrame(); const inn = hash(seed + 99) % 3 !== 0; const t = f / Math.max(1, dur);
  let z = inn ? 1.03 + 0.05 * t : 1.08 - 0.05 * t; let tx = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
    if (m.k === "punch") z *= 1 + 0.12 * w;
    if (m.k === "split") { z *= 1 + 0.14 * w; tx += -3 * w; }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "50% 30%" }} />
    </AbsoluteFill>
  );
};
// foto de época como objeto: hoja de álbum con esquineros (CSS), sin grano
export const Album: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame(); const t = f / Math.max(1, dur); const r = (hash(seed) % 2 ? 1 : -1) * (1.2 + (hash(seed + 1) % 3) * 0.7);
  const p = spring({ frame: f + 6, fps: 30, config: { damping: 15, mass: 0.9 } });
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 0, height: 0, borderStyle: "solid", ...s }} />;
  const cw = 86, cc = "#2B1E14";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #4A3828 0%, #2A1F17 70%, #1A130D 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.35, backgroundImage: "repeating-linear-gradient(94deg, rgba(255,230,190,0.05) 0 1px, transparent 1px 9px)" }} />
      <AbsoluteFill style={{ transform: `scale(${1.02 + 0.07 * t}) translateY(${-12 * t}px) rotate(${-0.5 * t}deg)` }}>
        <div style={{ position: "absolute", left: 300, top: 78, width: 1320, padding: "34px 34px 40px", background: "#F3EBDA", transform: `translateY(${(1 - p) * 140}px) rotate(${r + (1 - p) * 6}deg)`, opacity: p, boxShadow: "0 36px 80px rgba(0,0,0,0.65)" }}>
          <div style={{ width: 1252, height: 804, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.18) contrast(1.02)" }} />
            <AbsoluteFill style={{ boxShadow: "inset 0 0 110px rgba(40,25,10,0.4)" }} />
          </div>
          {corner({ left: 14, top: 14, borderWidth: `${cw}px ${cw}px 0 0`, borderColor: `${cc} transparent transparent transparent` })}
          {corner({ right: 14, top: 14, borderWidth: `0 ${cw}px ${cw}px 0`, borderColor: `transparent ${cc} transparent transparent` })}
          {corner({ left: 14, bottom: 20, borderWidth: `${cw}px 0 0 ${cw}px`, borderColor: `transparent transparent transparent ${cc}` })}
          {corner({ right: 14, bottom: 20, borderWidth: `0 0 ${cw}px ${cw}px`, borderColor: `transparent transparent ${cc} transparent` })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// ficha de dato con fuente real (papel oficial pinchado en el pincho de tickets)
export const Source: React.FC<{ head: string; big: string; lines: string[]; foot: string; bg: string; dur: number; seed: number; strike?: string }> = ({ head, big, lines, foot, bg, dur, seed, strike }) => {
  const f = useCurrentFrame(); const p = useSp(2, 15, 0.9); const sk = interpolate(f, [34, 48], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(f, dur, 9) }}>
      <DarkPhoto src={bg} dur={dur} seed={seed} dark={0.6} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1180, background: "#FBFAF4", padding: "58px 80px 46px", boxShadow: "0 34px 80px rgba(0,0,0,0.65)", transform: `translateY(${(1 - p) * 300}px) rotate(${lerp(6, -1.2, p)}deg)`, position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: -64, width: 10, height: 120, marginLeft: -5, background: "linear-gradient(90deg,#F1F3F4,#7B8488)", borderRadius: 5, boxShadow: "2px 2px 5px rgba(0,0,0,0.4)" }} />
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: "#3C4A57" }}>{head}</div>
          <div style={{ height: 3, background: "#3C4A57", margin: "14px 0 26px" }} />
          {strike ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 50 }}>
              <span style={{ position: "relative", fontFamily: SLAB, fontSize: 150, color: "#9AA0A6", lineHeight: 1 }}>{strike}
                <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 12, background: K.red, transform: "rotate(-7deg)", transformOrigin: "0 50%", width: `${sk * 108}%` }} /></span>
              <span style={{ fontFamily: SLAB, fontSize: 210, color: K.red, lineHeight: 1, opacity: cl((f - 44) / 8, 0, 1), transform: `scale(${lerp(1.5, 1, eout((f - 44) / 12))})`, transformOrigin: "0 80%", display: "inline-block" }}>{big}</span>
            </div>
          ) : <div style={{ fontFamily: SLAB, fontSize: big.length > 12 ? 120 : 190, color: K.red, lineHeight: 1 }}>{big}</div>}
          {lines.map((l, i) => <div key={i} style={{ fontFamily: SERIF, fontSize: 52, color: K.ink, lineHeight: 1.2, marginTop: i ? 2 : 22, opacity: cl((f - 20 - i * 12) / 10, 0, 1) }}>{l}</div>)}
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: "#5F6B76", marginTop: 30, letterSpacing: 1 }}>Source: {foot}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
