// t30tornies — "Por Qué los Aviones Siguen Siendo Blancos: la Ingeniería que Nadie Ve". Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble siguen el patrón de src/btgm1/M1.tsx (copiados acá).
// Todo lo ilustrado es SVG/CSS; lo real = Commons PD/CC (NASA, USAF, FAA…) + fotos/clips agnes sin cara.
// Pieza ancla: el AVIÓN genérico (Jet, sin logo) + el tablero de las 7 razones que se va tildando (ReasonBoard).
import React, { useMemo } from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, Person, SunsetStage, Seesaw, ease } from "../kits/btg/kit";

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

// ═════════════════════════ AVIACIÓN (t30tornies) ═════════════════════════
const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0")).join("");
};
const DAYSKY = "linear-gradient(180deg, #2f6d98 0%, #5d97bf 40%, #a9c6d6 72%, #e6d7b8 100%)";
const DUSKSKY = `linear-gradient(180deg, ${C.night} 0%, ${C.navy} 38%, ${C.dusk} 62%, ${C.ember} 86%, ${C.glow} 100%)`;

// el avión de pasajeros genérico (sin logo): vista lateral, nariz a la derecha. viewBox 1000x300.
export type JetP = { x: number; y: number; w?: number; body?: string; tail?: string; stripe?: string; top?: string; fade?: number; heat?: number; flip?: boolean; gear?: boolean; tilt?: number; shine?: number; patch?: string; ghost?: boolean; masked?: number[]; bare?: number; primer?: number };
export const Jet: React.FC<JetP> = ({ x, y, w = 900, body = "#f4f5f2", tail = "#d8452f", stripe, top, fade = 0, heat = 0, flip, gear = true, tilt = 0, shine = 0, patch, ghost, masked = [], bare = 0, primer = 0 }) => {
  const f = useCurrentFrame();
  const id = useMemo(() => "j" + Math.round(rnd(x + y * 7 + w, 3) * 1e6), [x, y, w]);
  const tl = mix(tail, "#c9b7b4", fade * 0.85), st = stripe ? mix(stripe, "#b9b6b0", fade * 0.85) : undefined;
  const skin = bare > 0 ? mix(body, "#9aa3ab", bare) : primer > 0 ? mix(body, "#b9c46a", primer) : body;
  const fus = "M40,128 L120,118 L860,116 Q950,120 978,160 Q956,200 868,204 L170,204 Q90,198 40,150 Z";
  const h = (w * 300) / 1000;
  return (
    <svg width={w} height={h} viewBox="0 0 1000 300" style={{ position: "absolute", left: x - w / 2, top: y - h / 2, transform: `${flip ? "scaleX(-1) " : ""}rotate(${tilt}deg)`, overflow: "visible", opacity: ghost ? 0.35 : 1 }}>
      <defs>
        <linearGradient id={id + "v"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".32" /></linearGradient>
        <linearGradient id={id + "h"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff3b1a" stopOpacity={0.85 * heat} /><stop offset=".55" stopColor="#ff8a2a" stopOpacity={0.25 * heat} /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></linearGradient>
        <clipPath id={id + "c"}><path d={fus} /></clipPath>
      </defs>
      {/* ala lejana + estabilizador lejano */}
      <path d="M560,170 L640,170 L760,120 L730,118 Z" fill="#8d949c" opacity=".7" />
      {/* deriva (cola) */}
      <path d="M58,126 L18,6 L92,6 L215,120 Z" fill={tl} />
      {st && <path d="M40,70 L66,70 L160,120 L120,120 Z" fill={st} opacity=".9" />}
      {/* fuselaje */}
      <path d={fus} fill={skin} />
      {top && <rect x="0" y="100" width="1000" height="40" fill={top} clipPath={`url(#${id}c)`} />}
      {st && <rect x="150" y="168" width="760" height="9" fill={st} clipPath={`url(#${id}c)`} />}
      {patch && <rect x="470" y="128" width="90" height="56" fill={patch} clipPath={`url(#${id}c)`} />}
      <path d={fus} fill={`url(#${id}v)`} />
      <path d={fus} fill={`url(#${id}h)`} />
      {bare > 0 && <g opacity={bare} clipPath={`url(#${id}c)`} stroke="#6f7880" strokeWidth="2">{Array.from({ length: 16 }).map((_, i) => <line key={i} x1={160 + i * 46} y1="116" x2={160 + i * 46} y2="204" />)}<line x1="100" y1="186" x2="960" y2="186" /></g>}
      {shine > 0 && <rect x={-200 + ((f * 9) % 1500)} y="100" width="70" height="110" fill="#fff" opacity={0.35 * shine} transform="skewX(-20)" clipPath={`url(#${id}c)`} />}
      {/* ventanillas, puertas, cabina */}
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={208 + i * 21.5} y="140" width="9" height="13" rx="4.5" fill={masked.includes(1) ? "#b08a5a" : "#2a3442"} />)}
      <path d="M180,134 h22 v44 h-22 Z M842,134 h22 v44 h-22 Z" fill="none" stroke="#000" strokeOpacity=".22" strokeWidth="2" />
      <path d="M905,140 L948,142 L958,154 L912,152 Z" fill={masked.includes(2) ? "#b08a5a" : "#1d2733"} />
      {/* ala cercana + motor */}
      <path d="M430,178 L560,178 L400,262 L350,262 Z" fill="#a9b0b6" />
      <rect x="380" y="200" width="150" height="46" rx="22" fill={masked.includes(3) ? "#b08a5a" : mix(skin, "#c8ccd0", 0.4)} />
      <ellipse cx="528" cy="223" rx="10" ry="22" fill="#30363d" />
      {/* estabilizador cercano */}
      <path d="M70,150 L170,150 L120,182 L48,182 Z" fill="#b4bac0" />
      {gear && <g fill="#20242a"><rect x="296" y="204" width="8" height="30" /><circle cx="300" cy="240" r="14" /><rect x="586" y="204" width="8" height="34" /><circle cx="582" cy="244" r="15" /><circle cx="604" cy="244" r="15" /><rect x="906" y="200" width="6" height="34" /><circle cx="909" cy="240" r="11" /></g>}
    </svg>
  );
};

// aeropuerto: cielo (día o atardecer) + terminal y torre en silueta + pista con líneas que corren
export const Apron: React.FC<{ day?: number; pan?: number; horizon?: number; night?: number; sunY?: number; children?: React.ReactNode }> = ({ day = 0, pan = 0.6, horizon = 600, night = 0, sunY, children }) => {
  const f = useCurrentFrame();
  const d = f * pan;
  const sy = sunY ?? (day ? 150 : horizon - 60);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: day ? DAYSKY : DUSKSKY, height: horizon + 20, opacity: 1 - night * 0.7 }} />
      {night > 0 && <Stars n={60} k={night * 0.7} h={horizon * 0.7} />}
      <div style={{ position: "absolute", left: (day ? 1380 : 1450) - 260, top: sy - 260, width: 520, height: 520, borderRadius: "50%", background: day ? "radial-gradient(circle, #fff8dccc 0%, #ffe9a855 30%, transparent 68%)" : `radial-gradient(circle, ${C.sun}cc 0%, ${C.glow}55 30%, transparent 68%)`, opacity: 1 - night }} />
      <div style={{ position: "absolute", left: (day ? 1380 : 1450) - 36, top: sy - 36, width: 72, height: 72, borderRadius: "50%", background: day ? "#fffbe8" : C.sun, opacity: (1 - night) * 0.95 }} />
      <svg width={2400} height={1080} style={{ position: "absolute", left: -200 - d * 0.25, top: 0 }}>
        <g fill={day ? "#46566a" : "#16222c"}>
          <rect x="80" y={horizon - 70} width="1300" height="78" />
          <rect x="1500" y={horizon - 50} width="700" height="58" />
          <rect x="1420" y={horizon - 250} width="26" height="252" /><path d={`M1392,${horizon - 250} h82 l-12,-44 h-58 Z`} />
        </g>
        {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={100 + i * 32} y={horizon - 50} width="18" height="10" fill={day ? "#7e93a8" : "#ffcf8a"} opacity={day ? 0.6 : 0.55 + 0.3 * Math.sin(i * 3.1)} />)}
      </svg>
      <AbsoluteFill style={{ top: horizon + 8, background: day ? "linear-gradient(180deg,#77797c 0%,#55575b 100%)" : "linear-gradient(180deg,#2c2a2c 0%,#1a1818 100%)" }} />
      <svg width={1920} height={1080 - horizon} style={{ position: "absolute", left: 0, top: horizon + 8 }}>
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={((i * 180 - d * 1.4) % 2520) - 300} y={(1080 - horizon) * 0.55} width="90" height="8" fill="#e6c34a" opacity=".7" />)}
        <rect x="0" y={(1080 - horizon) * 0.2} width="1920" height="3" fill="#e6c34a" opacity=".35" />
      </svg>
      <AbsoluteFill style={{ background: `rgba(5,10,20,${night * 0.45})` }} />
      {children}
    </AbsoluteFill>
  );
};
// interior de hangar: cerchas, filas de luces, piso que refleja, portón abierto al atardecer
export const Hangar: React.FC<{ paint?: boolean; fans?: boolean; children?: React.ReactNode; d?: number }> = ({ paint, fans, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: paint ? "linear-gradient(180deg,#26313d 0%,#3b4855 55%,#55606a 100%)" : "linear-gradient(180deg,#0f1823 0%,#1b2734 60%,#2a3440 100%)", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${i * 240 - 60},40 L${i * 240 + 60},180 L${i * 240 + 180},40`} stroke="#4a5866" strokeWidth="6" fill="none" />)}
        <rect x="0" y="36" width="1920" height="8" fill="#4a5866" />
        {Array.from({ length: 8 }).map((_, i) => <g key={i}><rect x={120 + i * 240} y="200" width="110" height="10" rx="5" fill="#fff6dc" /><path d={`M${120 + i * 240},210 L${60 + i * 240},700 L${290 + i * 240},700 L${230 + i * 240},210 Z`} fill="#fff6dc" opacity=".05" /></g>)}
        {fans && Array.from({ length: 4 }).map((_, i) => (
          <g key={i} transform={`translate(${200 + i * 500},330)`}>
            <rect x="-90" y="-90" width="180" height="180" rx="10" fill="#1d252e" stroke="#6c7884" strokeWidth="5" />
            <g transform={`rotate(${f * 14 + i * 20})`}>{[0, 90, 180, 270].map((a) => <path key={a} d="M0,0 Q30,-20 70,-8 Q40,10 0,0" fill="#8e9aa6" transform={`rotate(${a})`} />)}</g>
            <circle r="10" fill="#c3ccd4" />
          </g>
        ))}
        {fans && Array.from({ length: 22 }).map((_, i) => { const y = 470 + (i % 6) * 70, x = ((i * 157 + f * 6) % 2100) - 100; return <line key={i} x1={x} y1={y} x2={x + 90} y2={y} stroke="#bfe7ff" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />; })}
      </svg>
      <AbsoluteFill style={{ top: 820, background: paint ? "linear-gradient(180deg,#8c949b,#666d74)" : "linear-gradient(180deg,#39424c,#22282f)" }} />
      {children}
    </AbsoluteFill>
  );
};
// termómetro dibujado (sin cifras): el mercurio sube hasta `lv`
export const Therm: React.FC<{ x: number; y: number; h?: number; lv: number; label?: string; hot?: boolean }> = ({ x, y, h = 420, lv, label, hot }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <svg width={110} height={h + 110} style={{ overflow: "visible" }}>
      <rect x="35" y="0" width="40" height={h} rx="20" fill="rgba(240,235,229,.16)" stroke={INK} strokeWidth="5" />
      <rect x="45" y={h - (h - 20) * lv} width="20" height={(h - 20) * lv + 10} rx="10" fill={hot ? RED : "#ff6a3a"} />
      <circle cx="55" cy={h + 38} r="44" fill={hot ? RED : "#ff6a3a"} stroke={INK} strokeWidth="5" />
      {Array.from({ length: 8 }).map((_, i) => <line key={i} x1="80" x2="98" y1={30 + i * (h - 60) / 7} y2={30 + i * (h - 60) / 7} stroke={INK} strokeWidth="4" opacity=".6" />)}
    </svg>
    {label && <div style={{ position: "absolute", top: h + 100, left: -80, width: 270, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 40, color: INK }}>{label}</div>}
  </div>
);
const SunRays: React.FC<{ x: number; y: number; to: number[][]; bounce?: number[]; f: number; a?: number }> = ({ x, y, to, bounce = [], f, a = 0 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {to.map(([tx, ty], i) => {
      const p = ((f - a) / 40 + i * 0.17) % 1, hx = x + (tx - x) * p, hy = y + (ty - y) * p;
      const b = bounce[i] ?? 0;
      return <g key={i}>
        <line x1={x} y1={y} x2={tx} y2={ty} stroke="#ffd48a" strokeOpacity=".22" strokeWidth="5" strokeDasharray="14 18" strokeDashoffset={-f * 3} />
        <circle cx={hx} cy={hy} r="9" fill="#ffe7a8" opacity={f > a ? 0.95 : 0} />
        {b > 0 && <line x1={tx} y1={ty} x2={tx + (tx - x) * 0.25} y2={ty - (ty - y) * 0.6} stroke="#fff6dc" strokeOpacity={0.5 * b} strokeWidth="6" strokeDasharray="10 14" strokeDashoffset={f * 3} />}
      </g>;
    })}
  </svg>
);
const HeatWaves: React.FC<{ x: number; y: number; w: number; k?: number; f: number }> = ({ x, y, w, k = 1, f }) => (
  <svg width={w} height={200} style={{ position: "absolute", left: x, top: y - 200, overflow: "visible" }}>
    {Array.from({ length: 6 }).map((_, i) => { const yy = 190 - ((f * 2 + i * 33) % 190); return <path key={i} d={`M${20 + i * (w - 40) / 5},${yy} q12,-14 0,-28 q-12,-14 0,-28`} stroke="#ffb27a" strokeOpacity={0.55 * k * (yy / 190)} strokeWidth="5" fill="none" strokeLinecap="round" />; })}
  </svg>
);

// 1) fila de aviones blancos en la plataforma (gancho y cierre). mode: row | old | factory | gate
export const GateRow: React.FC<{ d: number; mode?: "row" | "old" | "tails" | "end"; o?: Ov }> = ({ d, mode = "row", o = {} }) => {
  const f = useCurrentFrame();
  const tails = ["#d8452f", "#1f5aa6", "#2e8b57", "#e0a321", "#7b3fa0", "#c2185b"];
  const sl = interpolate(f, [0, Math.max(d, 2)], [0, -260], clamp);
  return (
    <Apron day={mode === "end" ? 0 : 1} pan={0.4} night={mode === "end" ? 0.25 : 0}>
      <Push d={d} k={0.04}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${sl}px)` }}>
          {tails.map((t, i) => <Jet key={i} x={260 + i * 520} y={700 - (i % 2) * 8} w={mode === "tails" ? 760 : 600} tail={t} fade={mode === "old" && i % 2 ? 0.5 : 0} flip={i % 2 === 1} />)}
        </div>
      </Push>
      {mode === "end" && <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(0,0,0,.0) 50%, rgba(0,0,0,.65) 100%)" }} />}
      {mode === "end" && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><rect x="40" y="40" width="1840" height="1000" rx="70" fill="none" stroke="#11151b" strokeWidth="90" /><line x1="960" y1="0" x2="960" y2="1080" stroke="#11151b" strokeWidth="40" /></svg>}
      <Overlays o={o} />
    </Apron>
  );
};
// 2) "alguien eligió un color y todos lo copiaron": versión gris del pasado, un muñeco pinta y los otros aviones se vuelven blancos
export const Copycat: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const cols = ["#7a5b3a", "#3b5c7a", "#6a3b4a"];
  return (
    <AbsoluteFill style={{ filter: "grayscale(.85) sepia(.25) brightness(.9)" }}>
      <Apron day={1} pan={0.2}>
        <Jet x={520} y={690} w={760} body={mix("#9a8c74", "#f4f5f2", ease(f, 20, 70))} tail="#9a8c74" />
        <Person x={330 + Math.sin(f / 9) * 10} y={820} s={0.9} arms="up" />
        {cols.map((c, i) => <Jet key={i} x={1180 + i * 230} y={640 + i * 40} w={420} body={mix(c, "#f4f5f2", ease(f, 80 + i * 25, 110 + i * 25))} tail={c} flip />)}
      </Apron>
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: F, fontWeight: 800, fontSize: 52, color: INK, opacity: 0.85 }}>hace mucho tiempo…</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 3) TABLERO de las 7 razones (pieza ancla): el avión a la izquierda, la lista que se tilda
export const RL: Record<string, string> = { HEAT: "CALOR", COMPOSITES: "COMPUESTOS", WEIGHT: "PESO", CRACKS: "GRIETAS", RESALE: "CAMBIO DE DUEÑO", FADING: "DESTEÑIDO", "TOUCH-UPS": "RETOQUES" };
export const REASONS = ["HEAT", "COMPOSITES", "WEIGHT", "CRACKS", "RESALE", "FADING", "TOUCH-UPS"];
const ICON: Record<string, string> = {
  HEAT: "M0,-30 A30,30 0 1,1 0,30 A30,30 0 1,1 0,-30 M0,-56 v14 M0,42 v14 M-56,0 h14 M42,0 h14 M-40,-40 l10,10 M30,30 l10,10 M40,-40 l-10,10 M-30,30 l-10,10",
  COMPOSITES: "M-40,-40 L40,40 M-40,0 L0,40 M0,-40 L40,0 M40,-40 L-40,40 M0,-40 L-40,0 M40,0 L0,40",
  WEIGHT: "M-36,-10 L36,-10 L46,40 L-46,40 Z M-14,-10 A14,14 0 1,1 14,-10",
  CRACKS: "M-10,-46 A30,30 0 1,1 -10,14 A30,30 0 1,1 -10,-46 M12,8 L44,44 M-22,-22 l8,10 l-6,8 l10,10",
  RESALE: "M-44,0 L0,-40 L44,0 M-30,-6 V40 H30 V-6 M-10,40 V14 H10 V40",
  FADING: "M-40,30 Q-20,-40 0,10 Q20,60 40,-30",
  "TOUCH-UPS": "M-30,40 L10,0 L30,20 L-10,60 Z M10,0 L30,-40 L50,-20 L30,20",
};
export const ReasonBoard: React.FC<{ d: number; n: number; all?: boolean; at?: number[]; o?: Ov }> = ({ d, n, all, at = [], o = {} }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 60%, #22324a 0%, #0a1018 75%)" }}>
      <Push d={d} k={0.035} ox="30% 60%">
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${Math.sin(f / 30) * 8}px)` }}><Jet x={470} y={600} w={820} tail="#d8452f" /></div>
        <div style={{ position: "absolute", left: 120, top: 760, fontFamily: F, fontWeight: 900, fontSize: 66, color: INK, opacity: ease(f, 4, 14) }}>¿POR QUÉ <span style={{ color: RED }}>BLANCO?</span></div>
      </Push>
      {REASONS.map((r, i) => {
        const lit = all ? ease(f, at[i] ?? i * 20, (at[i] ?? i * 20) + 8) : 0;
        const on = !all && i === n, done = all ? lit > 0.01 : i < n;
        const t = spring({ frame: f - 2 - i * 3, fps: 30, config: { damping: 16 } });
        const glow = on ? ease(f, 10, 20) : lit;
        return (
          <div key={i} style={{ position: "absolute", left: 1020 + (1 - t) * 80, top: 110 + i * 126, width: 780, height: 104, borderRadius: 14, opacity: t * (on || done || all ? 1 : 0.42),
            background: on ? "linear-gradient(90deg,#4a2412,#2a160c)" : "linear-gradient(90deg,#17212d,#101820)", border: `3px solid ${on ? ORA : done ? "rgba(237,178,105,.5)" : "rgba(240,235,229,.18)"}`, boxShadow: on ? `0 0 ${40 * glow}px rgba(255,150,60,.6)` : "none", transform: `scale(${1 + 0.05 * glow})`, transformOrigin: "0 50%" }}>
            <svg width={104} height={104} style={{ position: "absolute", left: 10, top: 0 }}><g transform="translate(52,52) scale(.72)" stroke={on ? ORA : INK} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round">{<path d={ICON[r]} />}</g></svg>
            <div style={{ position: "absolute", left: 128, top: 22, fontFamily: F, fontWeight: 900, fontSize: 52, color: on ? ORA : INK, letterSpacing: 1 }}>{RL[r]}</div>
            {done && <svg width={80} height={80} style={{ position: "absolute", right: 18, top: 12 }}><path d="M12,42 L32,62 L68,16" stroke="#7ee08a" strokeWidth="11" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={all ? 1 - lit : 0} /></svg>}
          </div>
        );
      })}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 4) el sol pega en el techo del avión parado en la puerta; termómetro. mode: one | duel (blanco vs negro)
export const SunRoof: React.FC<{ d: number; mode?: "one" | "duel"; at?: number; o?: Ov }> = ({ d, mode = "one", at = 30, o = {} }) => {
  const f = useCurrentFrame();
  const r = ease(f, at, at + 120);
  if (mode === "duel") return (
    <Apron day={1} pan={0.15} sunY={110}>
      <SunRays x={1380} y={110} f={f} to={[[420, 560], [620, 560], [820, 560], [1180, 760], [1380, 760], [1580, 760]]} bounce={[1, 1, 1, 0, 0, 0]} />
      <Jet x={560} y={620} w={560} heat={0.15 * r} />
      <Jet x={1340} y={820} w={560} body="#1c1f24" tail="#1c1f24" heat={0.9 * r} />
      <HeatWaves x={1120} y={780} w={460} k={r} f={f} />
      <Therm x={80} y={250} h={300} lv={0.25 + 0.12 * r} label="BLANCO" />
      <Therm x={1760} y={250} h={300} lv={0.25 + 0.62 * r} label="NEGRO" hot />
      <Overlays o={o} />
    </Apron>
  );
  return (
    <Apron day={1} pan={0.15} sunY={120}>
      <SunRays x={1380} y={120} f={f} to={[[500, 560], [700, 560], [900, 560], [1100, 560], [1300, 560]]} />
      <div style={{ position: "absolute", left: 1180, top: 470, width: 380, height: 120, background: "#3d4651", transform: "skewX(-12deg)" }} />
      <Jet x={820} y={640} w={980} heat={0.75 * r} />
      <HeatWaves x={420} y={540} w={800} k={r} f={f} />
      <Therm x={1680} y={300} h={340} lv={0.2 + 0.7 * r} hot />
      <Overlays o={o} />
    </Apron>
  );
};
// 5) el auto negro quema, el blanco no (el muñeco toca y retira la mano)
const Car: React.FC<{ x: number; y: number; c: string; heat?: number }> = ({ x, y, c, heat = 0 }) => (
  <svg width={520} height={220} viewBox="0 0 520 220" style={{ position: "absolute", left: x - 260, top: y - 220 }}>
    <path d="M30,150 L60,100 L150,92 L210,40 L360,40 L430,96 L490,108 L500,150 Z" fill={c} />
    <path d="M222,52 L350,52 L410,96 L190,96 Z" fill="#9fb4c4" opacity=".65" />
    <rect x="20" y="146" width="490" height="22" rx="8" fill={mix(c, "#000", 0.3)} />
    <circle cx="130" cy="170" r="36" fill="#15181c" /><circle cx="130" cy="170" r="14" fill="#8a9096" />
    <circle cx="400" cy="170" r="36" fill="#15181c" /><circle cx="400" cy="170" r="14" fill="#8a9096" />
    <path d="M60,100 L150,92 L210,40 L360,40 L430,96" stroke="#ff4a1a" strokeOpacity={heat} strokeWidth="10" fill="none" />
  </svg>
);
export const CarTest: React.FC<{ d: number; mode?: "black" | "white" | "both"; at?: number; o?: Ov }> = ({ d, mode = "both", at = 40, o = {} }) => {
  const f = useCurrentFrame();
  const walk = ease(f, 0, at, 0, 1), jerk = mode !== "white" ? ease(f, at, at + 6) * (1 - ease(f, at + 40, at + 60)) : 0;
  const px = mode === "white" ? 1260 : 560;
  return (
    <SunsetStage tree="palm" night={0} horizon={640} sunX={1500} pan={0.2}>
      <AbsoluteFill style={{ background: "rgba(255,230,170,.10)" }} />
      <Car x={760} y={860} c="#16181c" heat={ease(f, 0, 60) * 0.8} />
      <HeatWaves x={540} y={700} w={440} f={f} />
      <Car x={1440} y={860} c="#eef0ee" />
      <Person x={px - 260 + 170 * walk} y={900} s={0.95} walk={walk < 1} arms={walk >= 1 ? "spear" : "down"} />
      {jerk > 0.2 && <Aside a={at + 2} t="¡AY!" x={px - 160} y={480} />}
      <Overlays o={o} />
    </SunsetStage>
  );
};
// 6) cabina caliente → la refrescan: APU en la cola + manguera de aire frío + combustible que se va. mode heat|cool|money
export const CoolCabin: React.FC<{ d: number; mode?: "heat" | "cool" | "money"; o?: Ov }> = ({ d, mode = "cool", o = {} }) => {
  const f = useCurrentFrame();
  const cool = mode === "heat" ? 0 : ease(f, 20, 120);
  const hot = mode === "heat" ? ease(f, 0, 90) : 1 - cool;
  return (
    <Apron day={1} pan={0.15} sunY={120}>
      <Push d={d} k={0.04}>
        <Jet x={900} y={600} w={1300} heat={0.6 * hot} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x="430" y="555" width="980" height="60" rx="26" fill={mix("#ff5a2a", "#4fc3ff", cool)} opacity=".55" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={450 + i * 80} y="566" width="22" height="40" rx="8" fill="#20262e" opacity=".8" />)}
          {mode !== "heat" && <>
            <path d="M1700,930 C1500,930 1300,800 1000,690" stroke="#e6c34a" strokeWidth="34" fill="none" strokeLinecap="round" />
            <path d="M1700,930 C1500,930 1300,800 1000,690" stroke="#bfe9ff" strokeWidth="10" fill="none" strokeDasharray="20 30" strokeDashoffset={f * 6} strokeLinecap="round" />
            <rect x="1660" y="860" width="200" height="120" rx="12" fill="#e6c34a" /><rect x="1680" y="880" width="80" height="40" fill="#2a3036" />
            {Array.from({ length: 4 }).map((_, i) => { const t = ((f / 22 + i / 4) % 1); return <circle key={i} cx={295 - t * 140} cy={585 - t * 60} r={12 + t * 30} fill="#cfd5da" opacity={0.6 * (1 - t)} />; })}
          </>}
        </svg>
      </Push>
      {mode === "money" && Array.from({ length: 10 }).map((_, i) => { const t = ((f / 40 + i / 10) % 1); return <div key={i} style={{ position: "absolute", left: 1620 + (i % 3) * 70, top: 300 + t * 420, fontFamily: F, fontWeight: 900, fontSize: 64, color: GOLD, opacity: 1 - t }}>$</div>; })}
      <Therm x={70} y={160} h={300} lv={0.2 + 0.65 * hot} hot={hot > 0.5} />
      <Overlays o={o} />
    </Apron>
  );
};
// 7) multiplicá: 1 avión → miles; días del año que pasan; la pila de plata crece
export const Multiply: React.FC<{ d: number; at?: number; o?: Ov }> = ({ d, at = 60, o = {} }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [0, at], [1, 120], clamp));
  const day = Math.floor(interpolate(f, [at, d], [1, 365], clamp));
  const pile = ease(f, at, d);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)" }}>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + (i % 15) * 82, top: 80 + Math.floor(i / 15) * 78, width: 70, height: 30, opacity: ease(f, i * 0.5, i * 0.5 + 4) }}><svg width={70} height={30} viewBox="0 0 70 30"><path d="M4,14 L14,4 L18,12 L60,11 Q70,15 60,19 L18,19 Z" fill="#f4f5f2" /><path d="M30,15 L44,15 L34,28 L28,28 Z" fill="#a9b0b6" /></svg></div>)}
      <div style={{ position: "absolute", left: 1350, top: 140, width: 420, height: 380, borderRadius: 18, background: "#f0ebe5", boxShadow: "0 20px 50px rgba(0,0,0,.5)", opacity: ease(f, at - 10, at) }}>
        <div style={{ height: 90, borderRadius: "18px 18px 0 0", background: RED }} />
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 170, color: "#1b1d22", marginTop: 20 }}>{day}</div>
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 34, color: "#6b6f75" }}>CADA DÍA</div>
      </div>
      <svg width={600} height={420} style={{ position: "absolute", left: 1260, top: 600 }}>{Array.from({ length: Math.floor(pile * 24) }).map((_, i) => <ellipse key={i} cx={300 + ((i % 6) - 2.5) * 70} cy={390 - Math.floor(i / 6) * 34} rx="40" ry="16" fill={GOLD} stroke="#8a6a1a" strokeWidth="4" />)}</svg>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 8) RAYOS X del fuselaje: aluminio → fibra de carbono; el calor que va y vuelve debilita la resina. mode alu|cfrp|heat
export const XRayFuse: React.FC<{ d: number; mode?: "alu" | "cfrp" | "heat"; o?: Ov }> = ({ d, mode = "cfrp", o = {} }) => {
  const f = useCurrentFrame();
  const sw = mode === "alu" ? 0 : mode === "cfrp" ? ease(f, 20, 110) : 1;
  const cyc = mode === "heat" ? (Math.sin(f / 12) + 1) / 2 : 0;
  const str = mode === "heat" ? 1 - 0.5 * ease(f, 10, d) : 1;
  const panels = 12;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #0c2a3a 0%, #03080d 78%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><pattern id="weave" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#1d2a33" /><rect x="12" y="12" width="12" height="12" fill="#1d2a33" /><rect x="12" width="12" height="12" fill="#36505e" /><rect y="12" width="12" height="12" fill="#36505e" /></pattern></defs>
        <g transform={`translate(${160},${300 + Math.sin(f / 40) * 6})`}>
          {Array.from({ length: panels }).map((_, i) => {
            const on = sw * panels > i;
            return <rect key={i} x={140 + i * 110} y="40" width="106" height="240" fill={on ? "url(#weave)" : "#4fe3ff"} fillOpacity={on ? 1 : 0.12} stroke="#4fe3ff" strokeWidth="2" />;
          })}
          <path d="M140,40 L1460,40 Q1580,60 1600,160 Q1580,260 1460,280 L140,280 Q40,260 0,170 L30,120 Z" fill="none" stroke="#4fe3ff" strokeWidth="6" />
          {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={140 + i * 100} cy="160" rx="16" ry="120" fill="none" stroke="#4fe3ff" strokeOpacity=".35" strokeWidth="3" />)}
          {mode === "heat" && <rect x="140" y="30" width="1320" height="60" fill="#ff5a2a" opacity={0.5 * cyc} />}
        </g>
      </svg>
      {mode === "heat" && <div style={{ position: "absolute", left: 1400, top: 40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle,#fff3c4 0%, #ffb44a 50%, transparent 72%)", opacity: 0.4 + 0.6 * cyc }} />}
      {mode === "heat" && <div style={{ position: "absolute", left: 420, top: 760, width: 1080 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 40, color: INK, marginBottom: 12 }}>RESISTENCIA DE LA RESINA</div>
        <div style={{ height: 46, borderRadius: 23, background: "rgba(240,235,229,.15)", border: `3px solid ${INK}` }}><div style={{ width: `${str * 100}%`, height: "100%", borderRadius: 23, background: str > 0.7 ? "#4fe3ff" : ORA }} /></div>
      </div>}
      {mode !== "heat" && <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 64 }}>
        <span style={{ color: "#9fdcef", opacity: 1 - sw * 0.6 }}>ALUMINIO</span><span style={{ color: INK, margin: "0 30px" }}>→</span><span style={{ color: ORA, opacity: 0.35 + sw * 0.65 }}>FIBRA DE CARBONO</span>
      </div>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 9) la regla del fabricante: zonas del avión que pueden ir oscuras y las que no (candados)
export const ColorRules: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const sc = ease(f, 10, 50);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #22324a 0%, #0a1018 78%)" }}>
      <Push d={d} k={0.04}>
        <Jet x={960} y={520} w={1400} top={mix("#f4f5f2", "#ffffff", 1)} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x="420" y={360} width={1180 * sc} height="70" fill="none" stroke="#7ee08a" strokeWidth="6" strokeDasharray="22 12" />
          <rect x="420" y={505} width={1180 * ease(f, 40, 80)} height="80" fill="#1c1f24" opacity=".55" stroke={ORA} strokeWidth="5" strokeDasharray="22 12" />
        </svg>
        {[600, 960, 1320].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 34, top: 300, opacity: ease(f, 30 + i * 8, 40 + i * 8) }}><svg width={68} height={80}><rect x="6" y="34" width="56" height="42" rx="8" fill="#7ee08a" /><path d="M18,34 V22 A16,16 0 0,1 50,22 V34" stroke="#7ee08a" strokeWidth="8" fill="none" /></svg></div>)}
        <div style={{ position: "absolute", left: 420, top: 640, fontFamily: F, fontWeight: 800, fontSize: 38, color: ORA, opacity: ease(f, 70, 85) }}>sólo algunas zonas pueden ir oscuras</div>
        <div style={{ position: "absolute", left: 420, top: 250, fontFamily: F, fontWeight: 800, fontSize: 38, color: "#7ee08a", opacity: ease(f, 40, 55) }}>mantener claro</div>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// sello "MAINTENANCE RULE" sobre una hoja de manual
export const RuleBook: React.FC<{ d: number; at?: number; o?: Ov }> = ({ d, at = 20, o = {} }) => {
  const f = useCurrentFrame();
  const st = spring({ frame: f - at, fps: 30, config: { damping: 9, mass: 0.7 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" }}>
      <div style={{ position: "absolute", left: 560, top: 140 + Math.sin(f / 30) * 4, width: 800, height: 860, background: "#f3eee2", borderRadius: 8, transform: `rotate(-3deg) scale(${1 + f * 0.0003})`, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <svg width={800} height={860}><Jet x={400} y={190} w={560} /><g>{Array.from({ length: 13 }).map((_, i) => <rect key={i} x="80" y={360 + i * 34} width={(i % 4 === 3 ? 380 : 640) * ease(f, i * 3, i * 3 + 12)} height="12" rx="6" fill="#b7ad9a" />)}</g></svg>
      </div>
      <div style={{ position: "absolute", left: 610, top: 470, padding: "18px 36px", border: `10px solid ${RED}`, borderRadius: 14, color: RED, fontFamily: F, fontWeight: 900, fontSize: 92, transform: `rotate(-12deg) scale(${2.2 - 1.2 * st})`, opacity: st > 0.02 ? 1 : 0, background: "rgba(243,238,226,.6)" }}>REGLA DE MANTENIMIENTO</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 10) la pila de capas de pintura que suma kilos (corte lateral). mode color | white
export const PaintStack: React.FC<{ d: number; mode?: "color" | "white"; o?: Ov }> = ({ d, mode = "color", o = {} }) => {
  const f = useCurrentFrame();
  const L = mode === "color" ? [["BASE", "#b9c46a"], ["FONDO", "#e9e6dc"], ["ROJO", "#c8321e"], ["MÁS ROJO", "#e0442c"], ["DEGRADADO + FIGURAS", "#2f6db0"], ["BARNIZ", "#cfe9f5"]] : [["BASE", "#b9c46a"], ["BLANCO", "#f4f5f2"], ["BARNIZ", "#cfe9f5"]];
  const step = mode === "color" ? 22 : 30;
  const nOn = L.filter((_, i) => f > 10 + i * step).length;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #2a3550 0%, #0b1622 80%)" }}>
      <div style={{ position: "absolute", left: 200, top: 820, width: 900, height: 70, background: "linear-gradient(180deg,#b8c0c8,#7d858d)", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 230, top: 838, fontFamily: F, fontWeight: 800, fontSize: 30, color: "#2b3036" }}>PIEL DEL AVIÓN</div>
      {L.map(([n, c], i) => {
        const t = spring({ frame: f - 10 - i * step, fps: 30, config: { damping: 14 } });
        return <div key={i} style={{ position: "absolute", left: 200, top: 820 - (i + 1) * 74 - (1 - t) * 160, width: 900, height: 70, background: c, opacity: t, borderRadius: 6, boxShadow: "0 6px 14px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: 30, top: 14, fontFamily: F, fontWeight: 800, fontSize: 32, color: i === 1 && mode === "white" || n === "FONDO" || n === "BARNIZ" || n === "BASE" ? "#2b3036" : "#fff" }}>{n}</div>
        </div>;
      })}
      <div style={{ position: "absolute", left: 1260, top: 280 }}>
        <svg width={460} height={520}>
          <path d="M60,440 L400,440 L360,200 L100,200 Z" fill="#2b3a4c" stroke={INK} strokeWidth="6" />
          <circle cx="230" cy="170" r="44" fill="none" stroke={INK} strokeWidth="10" />
          {Array.from({ length: nOn * (mode === "color" ? 2 : 1) }).map((_, i) => <rect key={i} x={110 + (i % 4) * 62} y={400 - Math.floor(i / 4) * 44 - 40} width="54" height="38" rx="6" fill={ORA} />)}
        </svg>
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 56, color: mode === "color" ? RED : "#7ee08a", marginTop: -10 }}>{mode === "color" ? "+ KILOS" : "MÁS LIVIANO"}</div>
      </div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 11) balanza: la pintura de un avión grande ≈ varios pasajeros con valijas
const PaintCan: React.FC<{ s?: number }> = ({ s = 1 }) => <svg width={170 * s} height={200 * s} viewBox="0 0 170 200"><rect x="10" y="30" width="150" height="160" rx="12" fill="#e9e6dc" stroke="#555" strokeWidth="6" /><rect x="10" y="80" width="150" height="50" fill={RED} /><path d="M30,30 Q85,-20 140,30" stroke="#555" strokeWidth="8" fill="none" /></svg>;
const Suitcase: React.FC = () => <svg width={60} height={70}><rect x="4" y="16" width="52" height="50" rx="8" fill="#5b6b7c" /><rect x="20" y="4" width="20" height="14" rx="4" fill="none" stroke="#5b6b7c" strokeWidth="5" /></svg>;
export const PaintSeesaw: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => (
  <AbsoluteFill>
    <Seesaw a={8} tip={0} left={<PaintCan s={1.3} />} right={<div style={{ display: "flex", alignItems: "flex-end", gap: 4, position: "relative", height: 240, width: 460 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "relative", width: 110, height: 240 }}><Person x={55} y={240} s={0.85} /><div style={{ position: "absolute", left: 60, top: 170 }}><Suitcase /></div></div>)}</div>} />
    <Overlays o={o} />
  </AbsoluteFill>
);
// 12) cada kilo hay que levantarlo: despegue con bloques de peso + años que pasan + gotas de combustible
export const Takeoff: React.FC<{ d: number; mode?: "lift" | "years"; o?: Ov }> = ({ d, mode = "lift", o = {} }) => {
  const f = useCurrentFrame();
  const run = interpolate(f, [0, d], [0, 1], clamp);
  const lift = mode === "lift" ? ease(f, d * 0.35, d) : 0.6;
  const x = mode === "lift" ? 300 + run * 1100 : 900 + Math.sin(f / 40) * 30;
  const y = mode === "lift" ? 760 - lift * 380 : 420 + Math.sin(f / 30) * 12;
  const yrs = Math.floor(interpolate(f, [10, d - 10], [1, 30], clamp));
  return (
    <Apron day={0} pan={mode === "lift" ? 1.2 : 2.2} horizon={mode === "lift" ? 700 : 820}>
      <Jet x={x} y={y} w={760} tilt={-14 * lift} gear={mode === "lift"} />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: x - 200 + i * 80, top: y + 120 + Math.sin(f / 8 + i) * 4, width: 60, height: 44, borderRadius: 6, background: ORA, color: "#2b1a0c", fontFamily: F, fontWeight: 900, fontSize: 22, textAlign: "center", lineHeight: "44px", opacity: ease(f, 6 + i * 5, 14 + i * 5) }}>lb</div>)}
      {mode === "years" && <>
        {Array.from({ length: 8 }).map((_, i) => { const t = ((f / 30 + i / 8) % 1); return <svg key={i} width={40} height={56} style={{ position: "absolute", left: 600 + i * 70, top: 560 + t * 380, opacity: 1 - t }}><path d="M20,2 Q40,30 34,40 A16,16 0 0,1 6,40 Q0,30 20,2 Z" fill="#4fb3ff" /></svg>; })}
        <div style={{ position: "absolute", right: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 150, color: ORA, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{yrs}<span style={{ fontSize: 60, color: INK }}> AÑOS</span></div>
      </>}
      <Overlays o={o} />
    </Apron>
  );
};
// 13) avión de aluminio pelado: el muñeco lo pule (brillo que corre) y los días pasan
export const Polish: React.FC<{ d: number; mode?: "shine" | "back"; o?: Ov }> = ({ d, mode = "shine", o = {} }) => {
  const f = useCurrentFrame();
  const back = mode === "back" ? ease(f, 20, 80) : 0;
  return (
    <Hangar>
      <Push d={d} k={0.04}>
        <Jet x={960} y={600} w={1500} body={mix("#c7ced4", "#f4f5f2", back)} tail={back > 0.5 ? "#1f5aa6" : "#c7ced4"} shine={mode === "shine" ? 1 : 0} />
        <div style={{ position: "absolute", left: 640 + Math.sin(f / 20) * 160, top: 760, width: 220, height: 30, background: "#e6c34a" }} />
        <Person x={750 + Math.sin(f / 20) * 160} y={770} s={0.95} arms="up" />
        <div style={{ position: "absolute", left: 640 + Math.sin(f / 20) * 160 + 80, top: 440 + Math.sin(f / 3) * 14, width: 60, height: 60, borderRadius: "50%", background: "#e9e6dc", border: "6px solid #8a9096" }} />
      </Push>
      {mode === "shine" && <div style={{ position: "absolute", right: 90, top: 90, display: "flex", gap: 14 }}>{Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ width: 92, height: 100, borderRadius: 10, background: "#f0ebe5", opacity: ease(f, 20 + i * 18, 28 + i * 18), fontFamily: F, fontWeight: 900, fontSize: 26, color: "#1b1d22", textAlign: "center", paddingTop: 14 }}><div style={{ height: 18, background: RED, margin: "-14px 0 10px", borderRadius: "10px 10px 0 0" }} />DÍA<br />{i + 1}</div>)}</div>}
      <Overlays o={o} />
    </Hangar>
  );
};
// 14) mapa cenital: la vuelta de inspección alrededor del avión (huellas que avanzan + linterna)
const TopJet: React.FC<{ c?: string }> = ({ c = "#f4f5f2" }) => (
  <svg width={1000} height={900} viewBox="0 0 1000 900" style={{ position: "absolute", left: 460, top: 90 }}>
    <path d="M470,40 Q500,0 530,40 L540,360 L960,520 L960,580 L540,500 L530,760 L640,830 L640,870 L500,840 L360,870 L360,830 L470,760 L460,500 L40,580 L40,520 L460,360 Z" fill={c} stroke="#9aa3ab" strokeWidth="4" />
    <rect x="300" y="420" width="70" height="120" rx="30" fill="#c8ccd0" /><rect x="630" y="420" width="70" height="120" rx="30" fill="#c8ccd0" />
  </svg>
);
export const Walkaround: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const P = (t: number) => { const a = t * Math.PI * 2 - Math.PI / 2; return [960 + Math.cos(a) * 640, 540 + Math.sin(a) * 440, a]; };
  const T = interpolate(f, [0, Math.max(d, 2)], [0, 0.95], clamp);
  const [px, py, pa] = P(T);
  return (
    <AbsoluteFill style={{ background: "#3a3c40" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={i * 180} y1="0" x2={i * 180 - 200} y2="1080" stroke="#45474c" strokeWidth="4" />)}<rect x="0" y="980" width="1920" height="10" fill="#e6c34a" opacity=".6" /></svg>
      <TopJet />
      {Array.from({ length: Math.floor(T * 60) }).map((_, i) => { const [x, y, a] = P(i / 60); return <div key={i} style={{ position: "absolute", left: x - 7 + (i % 2 ? 9 : -9) * Math.cos(a), top: y - 11 + (i % 2 ? 9 : -9) * Math.sin(a), width: 14, height: 22, borderRadius: 7, background: "#ff8a2a", opacity: 0.8, transform: `rotate(${(a * 180) / Math.PI}deg)` }} />; })}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${px},${py} L${px + Math.cos(pa + 2) * 420 - 120},${py + Math.sin(pa + 2) * 420} L${px + Math.cos(pa + 2) * 420 + 120},${py + Math.sin(pa + 2) * 420 + 80} Z`} fill="#ffe7a8" opacity=".22" /></svg>
      <div style={{ position: "absolute", left: px - 26, top: py - 26, width: 52, height: 52, borderRadius: "50%", background: C.vest, border: "6px solid #2d3a5a" }} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 15) la LUPA sobre la grieta junto al remache. mode white|dark (en lo oscuro no se ve) · find: crack|dent|oil|rust
export const Magnify: React.FC<{ d: number; mode?: "white" | "dark"; find?: "crack" | "oil" | "rust" | "all"; o?: Ov }> = ({ d, mode = "white", find = "crack", o = {} }) => {
  const f = useCurrentFrame();
  const bg = mode === "white" ? "#eef0ec" : "#1b2230";
  const mk = mode === "white" ? "#2a2a2a" : "#262c38";
  const t = ease(f, 6, Math.max(30, d * 0.55));
  const lx = 420 + t * 760, ly = 560 - Math.sin(t * 3) * 120;
  const found = ease(f, d * 0.55, d * 0.55 + 10);
  const scene = (
    <svg width={1920} height={1080}>
      <rect width="1920" height="1080" fill={bg} />
      {[300, 780].map((y) => <g key={y}><line x1="0" y1={y} x2="1920" y2={y} stroke={mode === "white" ? "#c9ccc6" : "#2a3242"} strokeWidth="5" />{Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={40 + i * 80} cy={y + 30} r="11" fill={mode === "white" ? "#d7dad4" : "#283041"} stroke={mode === "white" ? "#b9bcb6" : "#323b4e"} strokeWidth="3" />)}</g>)}
      {(find === "crack" || find === "all") && <path d="M1200,810 l18,-30 l-10,-26 l22,-40 l-8,-30 l16,-34" stroke={mk} strokeWidth="4" fill="none" />}
      {(find === "oil" || find === "all") && <path d="M520,320 q10,120 -6,260 q-4,60 14,90" stroke={mode === "white" ? "#3b2a12" : "#1f2532"} strokeWidth="26" strokeLinecap="round" fill="none" opacity=".55" />}
      {(find === "rust" || find === "all") && Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={1500 + rnd(i, 2) * 160} cy={330 + rnd(i, 3) * 80} r={6 + rnd(i, 4) * 12} fill={mode === "white" ? "#8a7b66" : "#232a37"} />)}
      {find === "all" && <ellipse cx="900" cy="560" rx="120" ry="60" fill="#000" opacity={mode === "white" ? 0.08 : 0.04} />}
    </svg>
  );
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Push d={d} k={0.03}>{scene}</Push>
      <div style={{ position: "absolute", left: lx - 190, top: ly - 190, width: 380, height: 380, borderRadius: "50%", overflow: "hidden", border: "16px solid #2b2f36", boxShadow: "0 20px 60px rgba(0,0,0,.5)", background: bg }}>
        <div style={{ position: "absolute", left: 174 - 2 * lx, top: 174 - 2 * ly, width: 1920, height: 1080, transform: "scale(2)", transformOrigin: "0 0" }}>{scene}</div>
      </div>
      <div style={{ position: "absolute", left: lx + 130, top: ly + 130, width: 60, height: 230, borderRadius: 26, background: "#2b2f36", transform: "rotate(-45deg)", transformOrigin: "30px 0" }} />
      {mode === "white" && find === "crack" && <Scribble a={Math.round(d * 0.55)} cx={1210} cy={710} rx={90} ry={130} text="there it is." tx={1430} ty={980} />}
      {mode === "dark" && <div style={{ position: "absolute", left: 1300, top: 140, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: GOLD, opacity: found, transform: "rotate(-5deg)" }}>…¿algo?</div>}
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 16) LEASING: el dueño (la empresa) alquila el avión a una aerolínea, después a otra, en otro continente; la cola cambia de color
export const LeaseMap: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const hops = [[420, 360, "#d8452f"], [1100, 300, "#1f5aa6"], [1500, 700, "#2e8b57"], [700, 760, "#e0a321"]] as const;
  const seg = Math.max(30, (d - 20) / 3);
  const k = Math.min(2.999, Math.max(0, (f - 10) / seg)), i = Math.floor(k), t = ease(k - i, 0, 1);
  const [x0, y0] = hops[i], [x1, y1, c1] = hops[i + 1];
  const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 120;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1b3550 0%, #08111c 80%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g fill="#2a4560" opacity=".9"><path d="M220,240 Q380,160 560,230 Q620,330 520,420 Q400,470 300,430 Q200,360 220,240 Z" /><path d="M900,200 Q1080,150 1260,220 Q1320,330 1200,380 Q1050,400 950,340 Z" /><path d="M1360,560 Q1520,520 1660,600 Q1700,720 1560,790 Q1420,800 1360,700 Z" /><path d="M560,660 Q700,620 820,700 Q840,820 720,870 Q600,860 560,760 Z" /></g>
        {hops.slice(0, i + 2).map((h, j) => j <= i + 1 && <circle key={j} cx={h[0]} cy={h[1]} r="18" fill={h[2]} stroke={INK} strokeWidth="5" opacity={j <= i ? 1 : 0.5} />)}
        {hops.slice(0, i + 1).map((h, j) => { const n = hops[j + 1]; return <path key={j} d={`M${h[0]},${h[1]} Q${(h[0] + n[0]) / 2},${Math.min(h[1], n[1]) - 160} ${n[0]},${n[1]}`} stroke={ORA} strokeWidth="5" strokeDasharray="14 14" fill="none" opacity={j < i ? 0.7 : 0.4} />; })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 960}px, ${y - 540}px)` }}><Jet x={960} y={540} w={320} tail={t > 0.85 ? c1 : hops[i][2]} gear={false} flip={x1 < x0} /></div>
      <div style={{ position: "absolute", left: 80, top: 940, display: "flex", gap: 16 }}>{hops.map((h, j) => <div key={j} style={{ width: 120, height: 70, borderRadius: 10, background: h[2], opacity: j <= i + (t > 0.85 ? 1 : 0) ? 1 : 0.2 }} />)}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// la empresa de leasing: un edificio-dueño con aviones blancos que salen a distintas aerolíneas
export const Lessor: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const C3 = ["#d8452f", "#1f5aa6", "#2e8b57"];
  return (
    <Apron day={0} pan={0.3}>
      <div style={{ position: "absolute", left: 120, top: 330, width: 360, height: 300, background: "#1d2a38", border: `5px solid ${ORA}`, borderRadius: 8 }}>
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 44, color: ORA, marginTop: 30 }}>EMPRESA DE<br />ALQUILER</div>
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 30, color: INK, marginTop: 20 }}>es la dueña del avión</div>
      </div>
      {C3.map((c, i) => { const t = ease(f, 15 + i * 25, 60 + i * 25); return <Jet key={i} x={560 + t * (700 + i * 150)} y={560 + i * 150} w={460} tail={t > 0.6 ? c : "#f4f5f2"} gear={false} />; })}
      <Overlays o={o} />
    </Apron>
  );
};
// 17) avión parado en el hangar especial: días que pasan y la plata que NO entra
export const HangarDays: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const day = Math.min(9, 1 + Math.floor(f / Math.max(8, d / 9)));
  return (
    <Hangar paint>
      <Push d={d} k={0.04}><Jet x={860} y={620} w={1300} bare={0.6} /></Push>
      <div style={{ position: "absolute", right: 110, top: 100, width: 300, height: 300, borderRadius: 16, background: "#f0ebe5", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
        <div style={{ height: 70, background: RED, borderRadius: "16px 16px 0 0" }} />
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 130, color: "#1b1d22" }}>{day}</div>
        <div style={{ textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 30, color: "#6b6f75", marginTop: -10 }}>DÍAS PARADO</div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 440, width: 300, fontFamily: F, fontWeight: 900, fontSize: 54, color: RED, textAlign: "center" }}>$0 ganados</div>
      <Overlays o={o} />
    </Hangar>
  );
};
// 18) LA COLA que cambia de colores: el cuerpo blanco queda igual, sólo cambia la cola (vs uno de colores que hay que pintar entero)
export const TailSwap: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const T = ["#d8452f", "#1f5aa6", "#2e8b57", "#e0a321", "#7b3fa0"];
  const i = Math.floor(f / 26) % T.length, t = ease(f % 26, 0, 10);
  const tail = mix(T[i], T[(i + 1) % T.length], t);
  return (
    <Hangar paint>
      <Push d={d} k={0.05} ox="20% 50%"><Jet x={960} y={600} w={1500} tail={tail} stripe={tail} /></Push>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><ellipse cx="310" cy="420" rx="270" ry="210" fill="none" stroke={GOLD} strokeWidth="10" strokeDasharray="30 18" strokeDashoffset={-f * 3} /></svg>
      <div style={{ position: "absolute", left: 620, top: 860, fontFamily: F, fontWeight: 800, fontSize: 46, color: INK }}>el resto <span style={{ color: "#7ee08a" }}>queda como está</span></div>
      <Overlays o={o} />
    </Hangar>
  );
};
// 19) EL COLOR QUE SE DESTIÑE: arriba de casi toda la atmósfera, rayos UV; los colores se lavan con los años
export const FadeYears: React.FC<{ d: number; mode?: "sky" | "tail" | "white"; o?: Ov }> = ({ d, mode = "sky", o = {} }) => {
  const f = useCurrentFrame();
  const fd = ease(f, 15, d - 10);
  if (mode === "sky") return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#02060f 0%,#0b1d3a 35%,#2f6d98 70%,#a9c6d6 100%)" }}>
      <Stars n={80} k={0.6} h={300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 440, background: "linear-gradient(180deg, rgba(120,190,255,.0), rgba(120,190,255,.45))" }} />
      <div style={{ position: "absolute", left: 60, top: 980, fontFamily: F, fontWeight: 800, fontSize: 36, color: "#0b1d3a" }}>casi toda la atmósfera está aquí abajo</div>
      <div style={{ position: "absolute", left: 1500, top: 60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,#fff 0%,#ffe9a8 45%,transparent 72%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 7 }).map((_, i) => <line key={i} x1="1600" y1="160" x2={500 + i * 120} y2="560" stroke="#c38bff" strokeWidth="6" strokeDasharray="18 16" strokeDashoffset={-f * 4} opacity=".7" />)}</svg>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${Math.sin(f / 40) * 30}px)` }}><Jet x={860} y={560} w={900} gear={false} fade={fd * 0.5} /></div>
      <div style={{ position: "absolute", left: 1520, top: 290, fontFamily: F, fontWeight: 900, fontSize: 60, color: "#c38bff" }}>UV</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
  const yrs = Math.min(8, 1 + Math.floor(fd * 8));
  return (
    <Apron day={1} pan={0.15}>
      <Push d={d} k={0.05} ox="25% 40%"><Jet x={960} y={620} w={1500} tail={mode === "white" ? "#d8452f" : "#c8321e"} stripe={mode === "tail" ? "#1f5aa6" : undefined} body={mode === "white" ? mix("#f4f5f2", "#ebe6d6", fd) : mix("#f4f5f2", "#e2ded2", fd)} fade={mode === "tail" ? fd : fd * 0.3} /></Push>
      <div style={{ position: "absolute", right: 100, top: 90, display: "flex", gap: 10 }}>{Array.from({ length: yrs }).map((_, i) => <div key={i} style={{ width: 50, height: 60, borderRadius: 6, background: "#f0ebe5", borderTop: `12px solid ${RED}` }} />)}</div>
      <div style={{ position: "absolute", right: 100, top: 170, fontFamily: F, fontWeight: 800, fontSize: 36, color: INK, textShadow: "0 2px 8px #000" }}>años al sol</div>
      <Overlays o={o} />
    </Apron>
  );
};
// 20) el parche del color equivocado vs el blanco que se iguala fácil
export const PatchMatch: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 15, 35);
  return (
    <Hangar>
      <Jet x={520} y={480} w={820} patch={mix("#f4f5f2", "#f1f2ee", p)} />
      <Jet x={1400} y={760} w={820} body="#2f5fa8" tail="#2f5fa8" patch={mix("#2f5fa8", "#4a86c8", p)} />
      <div style={{ position: "absolute", left: 340, top: 640, fontFamily: F, fontWeight: 900, fontSize: 52, color: "#7ee08a", opacity: ease(f, 30, 40) }}>BLANCO: igual</div>
      <div style={{ position: "absolute", left: 1170, top: 920, fontFamily: F, fontWeight: 900, fontSize: 52, color: RED, opacity: ease(f, 40, 50) }}>ESPECIAL: uy</div>
      <Overlays o={o} />
    </Hangar>
  );
};
// 21) el hangar de pintura: ventiladores, filtros, aire que corre, perillas de temperatura y humedad clavadas en el verde
const Gauge: React.FC<{ x: number; y: number; label: string; v: number }> = ({ x, y, label, v }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 240, textAlign: "center" }}>
    <svg width={240} height={150}><path d="M20,130 A100,100 0 0,1 220,130" stroke="#3a4552" strokeWidth="22" fill="none" /><path d="M85,40 A100,100 0 0,1 155,40" stroke="#7ee08a" strokeWidth="22" fill="none" /><line x1="120" y1="130" x2={120 + Math.cos(Math.PI * (1 - v)) * 90} y2={130 - Math.sin(Math.PI * (1 - v)) * 90} stroke={INK} strokeWidth="8" strokeLinecap="round" /><circle cx="120" cy="130" r="12" fill={INK} /></svg>
    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 32, color: INK }}>{label}</div>
  </div>
);
export const PaintHangar: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const roll = ease(f, 0, 70);
  return (
    <Hangar paint fans>
      <Jet x={-500 + roll * 1460} y={720} w={1300} />
      <Gauge x={1580} y={560} label="TEMPERATURA" v={0.5 + Math.sin(f / 15) * 0.03} />
      <Gauge x={1580} y={790} label="HUMEDAD" v={0.5 + Math.sin(f / 19 + 1) * 0.03} />
      <Overlays o={o} />
    </Hangar>
  );
};
// 22) enmascarado a mano: muñecos en elevadores tapan ventanillas, sondas, motor con papel
export const Masking: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const m = [1, 2, 3].filter((_, i) => f > 15 + i * Math.max(18, d / 4));
  return (
    <Hangar paint>
      <Push d={d} k={0.05}><Jet x={960} y={560} w={1600} masked={m} gear />
        {[[640, 900], [1240, 900], [1660, 860]].map(([x, y], i) => <React.Fragment key={i}><div style={{ position: "absolute", left: x - 90, top: y - 30 + Math.sin(f / 25 + i) * 6, width: 180, height: 26, background: "#e6c34a" }} /><Person x={x} y={y - 30 + Math.sin(f / 25 + i) * 6} s={0.8} arms="up" walk={false} /></React.Fragment>)}
      </Push>
      <Overlays o={o} />
    </Hangar>
  );
};
// 23) la pintura vieja sale (barrido que pela) y aparece el metal con cada remache
export const Strip: React.FC<{ d: number; mode?: "strip" | "bare"; o?: Ov }> = ({ d, mode = "strip", o = {} }) => {
  const f = useCurrentFrame();
  const b = mode === "strip" ? ease(f, 10, d - 10) : 1;
  return (
    <Hangar paint>
      <Push d={d} k={0.05}>
        <Jet x={960} y={560} w={1600} body="#2f5fa8" tail="#d8452f" stripe="#e0a321" />
        <div style={{ position: "absolute", left: 0, top: 0, width: 160 + b * 1700, height: 1080, overflow: "hidden" }}><Jet x={960} y={560} w={1600} bare={1} tail="#9aa3ab" body="#f4f5f2" /></div>
        {mode === "strip" && <><div style={{ position: "absolute", left: 160 + b * 1700 - 6, top: 360, width: 12, height: 400, background: "#e6c34a", boxShadow: "0 0 30px #e6c34a" }} /><Person x={160 + b * 1700 - 60} y={900} s={0.9} arms="spear" /></>}
        {mode === "bare" && Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 500 + i * 230, top: 470 + Math.sin(i) * 20, width: 46, height: 46, borderRadius: "50%", border: `6px solid ${GOLD}`, opacity: ease(f, 10 + i * 10, 20 + i * 10), transform: `scale(${1 + 0.15 * Math.sin(f / 6 + i)})` }} />)}
      </Push>
      <Overlays o={o} />
    </Hangar>
  );
};
// 24) LOS PASOS de la pintura: imprimación → base blanca → enmascarar la cola → colores → laca. Barra de pasos abajo.
export const PaintSteps: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const S5 = ["BASE", "FONDO BLANCO", "ENMASCARAR", "COLA + NOMBRE", "BARNIZ"];
  const k = Math.min(4.99, (f / Math.max(d, 2)) * 5), i = Math.floor(k);
  const primer = i >= 0 ? 1 : 0, white = i >= 1 ? ease(k - 1, 0, 0.6) : 0;
  return (
    <Hangar paint fans>
      <Push d={d} k={0.04}>
        <Jet x={960} y={520} w={1500} body={white > 0 ? mix("#b9c46a", "#f4f5f2", white) : "#b9c46a"} primer={primer && !white ? 1 : 0} tail={i >= 3 ? "#d8452f" : i >= 2 ? "#b08a5a" : white > 0.5 ? "#f4f5f2" : "#b9c46a"} stripe={i >= 3 ? "#1f5aa6" : undefined} shine={i >= 4 ? 1 : 0} />
      </Push>
      <div style={{ position: "absolute", left: 160, right: 160, top: 860, display: "flex", gap: 16 }}>
        {S5.map((s, j) => <div key={j} style={{ flex: 1, height: 90, borderRadius: 12, background: j === i ? ORA : j < i ? "rgba(237,178,105,.35)" : "rgba(240,235,229,.1)", border: `3px solid ${j <= i ? ORA : "rgba(240,235,229,.25)"}`, fontFamily: F, fontWeight: 900, fontSize: 30, color: j === i ? "#2b1a0c" : INK, textAlign: "center", lineHeight: "90px" }}>{s}</div>)}
      </div>
      <Overlays o={o} />
    </Hangar>
  );
};
// 25) de una a tres semanas: calendario + docenas de personas + cientos de galones + 0 pasajeros
export const Weeks: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const dd = Math.floor(interpolate(f, [10, d - 10], [0, 21], clamp));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #2a3550 0%, #0b1622 80%)" }}>
      <div style={{ position: "absolute", left: 140, top: 150, width: 760, padding: 24, borderRadius: 16, background: "#f0ebe5", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 44, color: "#1b1d22", marginBottom: 12 }}>1 – 3 SEMANAS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>{Array.from({ length: 21 }).map((_, i) => <div key={i} style={{ height: 70, borderRadius: 8, background: i < dd ? (i < 7 ? ORA : "rgba(241,69,54,.75)") : "#d9d2c6", position: "relative" }}>{i < dd && <svg width={70} height={70} style={{ position: "absolute", left: 10 }}><path d="M14,14 L56,56 M56,14 L14,56" stroke="#1b1d22" strokeWidth="6" /></svg>}</div>)}</div>
      </div>
      <div style={{ position: "absolute", left: 1020, top: 160, display: "flex", flexWrap: "wrap", width: 760, gap: 4 }}>{Array.from({ length: Math.floor(ease(f, 10, 60) * 24) }).map((_, i) => <svg key={i} width={58} height={110} viewBox="0 0 120 260"><rect x="40" y="80" width="40" height="95" rx="14" fill={C.vest} /><circle cx="60" cy="58" r="24" fill="#f2c49b" /><rect x="46" y="165" width="13" height="92" rx="6" fill="#2d3a5a" /><rect x="61" y="165" width="13" height="92" rx="6" fill="#2d3a5a" /></svg>)}</div>
      <div style={{ position: "absolute", left: 1020, top: 440, fontFamily: F, fontWeight: 900, fontSize: 48, color: INK }}>DECENAS <span style={{ color: "rgba(240,235,229,.6)", fontSize: 34 }}>de personas</span></div>
      <div style={{ position: "absolute", left: 1020, top: 540, display: "flex", gap: 8 }}>{Array.from({ length: Math.floor(ease(f, 30, 80) * 9) }).map((_, i) => <PaintCan key={i} s={0.42} />)}</div>
      <div style={{ position: "absolute", left: 1020, top: 640, fontFamily: F, fontWeight: 900, fontSize: 48, color: INK }}>CIENTOS <span style={{ color: "rgba(240,235,229,.6)", fontSize: 34 }}>de litros</span></div>
      <div style={{ position: "absolute", left: 140, top: 820, fontFamily: F, fontWeight: 900, fontSize: 64, color: RED, opacity: ease(f, 60, 75) }}>0 PASAJEROS</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// 26) el avión NEGRO: al atardecer, flashes de fotos; mode photo | heat | special | top | pays
export const BlackJet: React.FC<{ d: number; mode?: "photo" | "heat" | "special" | "top" | "pays"; o?: Ov }> = ({ d, mode = "photo", o = {} }) => {
  const f = useCurrentFrame();
  const day = mode === "heat" || mode === "special";
  return (
    <Apron day={day ? 1 : 0} pan={0.3} sunY={day ? 120 : undefined}>
      {day && <SunRays x={1380} y={120} f={f} to={[[600, 560], [800, 560], [1000, 560], [1200, 560]]} bounce={mode === "special" ? [0.8, 0, 0.8, 0] : []} />}
      <Push d={d} k={0.04}>
        <Jet x={900} y={650} w={1200} body="#15171b" tail="#15171b" stripe={mode === "photo" || mode === "pays" ? "#c9a14a" : undefined} top={mode === "top" ? "#8d949c" : undefined} heat={mode === "heat" ? ease(f, 10, 60) * 0.8 : mode === "special" ? 0.35 : 0} />
        {mode === "heat" && <HeatWaves x={420} y={560} w={900} f={f} />}
      </Push>
      {mode === "photo" && [[260, 980], [520, 1000], [1500, 990], [1720, 970]].map(([x, y], i) => <React.Fragment key={i}><Person x={x} y={y} s={0.85} dark arms="spear" />{Math.sin(f / 7 + i * 2) > 0.92 && <div style={{ position: "absolute", left: x + 10, top: y - 220, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle,#fff 0%, rgba(255,255,255,.4) 40%, transparent 70%)" }} />}</React.Fragment>)}
      {mode === "pays" && <div style={{ position: "absolute", left: 120, top: 120, display: "flex", gap: 22 }}>{["COMBUSTIBLE", "MANTENIMIENTO", "PINTURA ESPECIAL"].map((t, i) => <div key={i} style={{ padding: "14px 26px", borderRadius: 12, background: "rgba(241,69,54,.9)", color: INK, fontFamily: F, fontWeight: 900, fontSize: 40, opacity: ease(f, 10 + i * 25, 18 + i * 25), transform: `translateY(${(1 - ease(f, 10 + i * 25, 18 + i * 25)) * 30}px)` }}>$ {t}</div>)}</div>}
      <Overlays o={o} />
    </Apron>
  );
};
// 27) teaser del próximo video: ventanilla cuadrada (?) vs redonda — sin accidentes
export const WindowTease: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const m = ease(f, 20, 60);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)" }}>
      <Push d={d} k={0.05}>
        <div style={{ position: "absolute", left: 520, top: 260, width: 360, height: 460, background: "#e9ebe7", borderRadius: 30, boxShadow: "inset 0 0 0 26px #c9ccc6" }}><div style={{ position: "absolute", inset: 70, borderRadius: 4, background: "linear-gradient(180deg,#5d97bf,#cfe2ec)" }} /></div>
        <div style={{ position: "absolute", left: 1040, top: 260, width: 360, height: 460, background: "#e9ebe7", borderRadius: 180, boxShadow: "inset 0 0 0 26px #c9ccc6", opacity: m }}><div style={{ position: "absolute", inset: 70, borderRadius: 120, background: "linear-gradient(180deg,#5d97bf,#cfe2ec)" }} /></div>
        <div style={{ position: "absolute", left: 640, top: 760, fontFamily: F, fontWeight: 900, fontSize: 120, color: RED }}>?</div>
      </Push>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6e1a10 0%, #2a0806 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)";
  return <AbsoluteFill style={{ background: bg, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp)})` }}>{tone !== "red" && <Stars n={50} k={0.35} />}<Overlays o={o} /></AbsoluteFill>;
};
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
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #1f3a58 0%, #060d18 78%)" }}>
      <Stars n={60} k={0.4} />
      <div style={{ position: "absolute", top: 820, left: 0, transform: `translateX(${-((f * 2.4) % 1040)}px)`, opacity: 0.5 }}>{Array.from({ length: 9 }).map((_, i) => <Jet key={i} x={260 + i * 520} y={60} w={440} tail={["#d8452f", "#1f5aa6", "#2e8b57", "#e0a321"][i % 4]} gear={false} />)}</div>
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 140, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 180, right: 180, top: bell ? 450 : 300, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 70, color: INK, lineHeight: 1.18, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
