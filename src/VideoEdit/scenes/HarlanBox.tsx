// HarlanBox.tsx — KIT DE LA "BLACKOUT BOX" (canal Harlan the Lineman, video hl12cheap: 12 cosas baratas).
// Segundo kit del canal, mismo mundo que HarlanLine (Ohio en invierno, liniero jubilado), pero centrado en
// OBJETOS: la caja de apagón, la etiqueta de precio colgando, baterías que se mueren de frío, la radio a
// manivela, las capas de la cama, el mapa de los calentadores de mano, la cuenta del agua, el termómetro de
// la heladera, el mito de la maceta, la caja del calefactor, la letra chica con lupa y el ticket de ferretería.
//
// Reglas de oficio (las mismas de HarlanLine / LouDiner):
//  · Todo determinista (rnd con hash entero): el farm rinde en chunks.
//  · Nada de <Video>. Sólo <Img>; el fondo usa SIEMPRE la versión _blur (la hornea 60_build).
//  · PROFUNDIDAD = 3 planos que se mueven a distinta velocidad: fondo foto blur (lento), sujeto (medio),
//    partículas/polvo/nieve desenfocadas delante (rápido). Sombras largas, nunca planas.
//  · El SONIDO no vive acá: fxpack agenda style.fx.compSfx en la mezcla, alineado a SFX_AT.
//  · Los arrays llegan como {text} aunque la firma diga string: siempre normalizar con txt().
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMono } from "@remotion/google-fonts/ShareTechMono";
import { loadFont as loadStencil } from "@remotion/google-fonts/BlackOpsOne";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const BEBAS = loadBebas("normal", { subsets: ["latin"] }).fontFamily;
const MONO = loadMono().fontFamily;
const STENCIL = loadStencil().fontFamily;
const HAND = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const OSW = loadOswald("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;

const C = {
  ink: "#0A0C0E", night: "#0E1620", steel: "#8E989F", paper: "#F3EEE2", manila: "#E3C98F", kraft: "#B8925A",
  hivis: "#F5C400", orange: "#FF6A13", red: "#E0301E", ice: "#BFE3FF", cold: "#6FB2E8", warm: "#FFB347",
  glow: "#FFD27A", green: "#58F08A", white: "#F4F6F7", tote: "#3B4148", water: "#4FA3E0",
};
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (seed: number, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
const blurOf = (src: string) => src.replace(/\.(jpe?g|png)$/i, "_blur.jpg");
const fadeIO = (f: number, D: number, i = 7, o = 10) => Math.min(interpolate(f, [0, i], [0, 1], CL), interpolate(f, [D - o, D], [1, 0], CL));
const txt = (x: unknown): string => (x && typeof x === "object" ? String((x as { text?: unknown }).text ?? "") : String(x ?? ""));
const num = (x: unknown, d: number) => { const n = Number(x); return Number.isFinite(n) ? n : d; };
const money = (n: number) => (n % 1 ? n.toFixed(2) : String(Math.round(n)));

/** Golpes de cada pieza (segundos desde el arranque): referencia para style.fx.compSfx. */
export const SFX_AT = {
  BlackoutBox: { lid: 0.2, clacks: "0.6 + i*step" },
  BoxItemCard: { whoosh: 0.0, tag: 0.45 },
  BatteryCold: { wind: 0.0, tick: 0.3 },
  CrankRadio: { tick: 0.2, beep: 1.4 },
  BedLayers: { paper: 0.4 },
  WarmerMap: { pop: 0.6, stamp: "0.72*D" },
  WaterMath: { pop: 0.9 },
  FridgeThermo: { tick: 0.3, stamp: "0.62*D" },
  FlowerPotMyth: { stamp: "0.66*D" },
  SafetyBox: { stamp: "0.7*D" },
  FinePrint: { whoosh: 0.3, stamp: "0.72*D" },
  BoxReceipt: { tick: 0.4, coin: "0.8*D" },
} as const;

// ─── capas compartidas ────────────────────────────────────────────────────────────────────────
const Fondo: React.FC<{ src?: string; dark?: number; seed?: number; warm?: boolean }> = ({ src, dark = 0.62, seed = 1, warm }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const z = interpolate(f, [0, D], [1.1, 1.2], CL);
  const dx = (rnd(seed, 3) - 0.5) * 4 * interpolate(f, [0, D], [0, 1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      {src ? <Img src={staticFile(blurOf(src))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dx}%)` }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(10,12,14,${dark * 0.5}) 0%, rgba(10,12,14,${Math.min(0.97, dark + 0.28)}) 100%)` }} />
      {warm ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,190,110,0.16), rgba(0,0,0,0) 60%)" }} /> : null}
    </AbsoluteFill>
  );
};
const Grano: React.FC<{ o?: number }> = ({ o = 0.08 }) => {
  const f = useCurrentFrame();
  const s = Math.floor(f / 2) % 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%"><filter id={`hb${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={s} /></filter><rect width="100%" height="100%" filter={`url(#hb${s})`} /></svg>
    </AbsoluteFill>
  );
};
/** Polvo/nieve DELANTE del sujeto: pocos copos grandes, muy desenfocados, más rápidos que el fondo (profundidad). */
const PolvoDelante: React.FC<{ n?: number; o?: number; snow?: boolean }> = ({ n = 16, o = 0.5, snow }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const r = 10 + rnd(i, 4) * 26;
        const sp = snow ? 2.2 + rnd(i, 2) * 2.5 : 0.35 + rnd(i, 2) * 0.5;
        const x = (rnd(i, 1) * 2100 - 90 + Math.sin((f + i * 17) / 40) * 30 + (snow ? 0 : f * 0.6)) % 2100;
        const y = snow ? ((rnd(i, 3) * 1250 + f * sp) % 1250) - 80 : rnd(i, 3) * 1080 - f * sp;
        return <div key={i} style={{ position: "absolute", left: x, top: ((y % 1180) + 1180) % 1180 - 50, width: r, height: r, borderRadius: r, background: snow ? "#fff" : C.glow, opacity: 0.18 + rnd(i, 5) * 0.3, filter: `blur(${4 + r / 5}px)` }} />;
      })}
    </AbsoluteFill>
  );
};
const Eyebrow: React.FC<{ text?: string; color?: string; op?: number; style?: React.CSSProperties }> = ({ text, color = C.hivis, op = 1, style }) =>
  text ? <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 30, letterSpacing: 8, color, opacity: op, textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.8)", ...style }}>{text}</div> : null;
const Titulo: React.FC<{ text?: string; f: number; at?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, f, at = 8, size = 104, color = C.white, style }) => {
  if (!text) return null;
  const k = interpolate(f, [at, at + 14], [0, 1], { ...CL, easing: easeOut });
  return <div style={{ fontFamily: BEBAS, fontSize: size, lineHeight: 0.95, color, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, textShadow: "0 8px 40px rgba(0,0,0,0.9)", ...style }}>{text}</div>;
};
/** Sello de goma que golpea (escala 2,2 → 1 con temblor). */
const Sello: React.FC<{ text: string; at: number; color?: string; x: number; y: number; rot?: number; size?: number }> = ({ text, at, color = C.red, x, y, rot = -8, size = 120 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: interpolate(f - at, [0, 3], [0, 0.94], CL),
      border: `10px solid ${color}`, borderRadius: 18, padding: "6px 34px", fontFamily: STENCIL, fontSize: size, color, letterSpacing: 4, whiteSpace: "nowrap",
      mixBlendMode: "screen", textShadow: `0 0 18px ${color}55`, boxShadow: `0 0 30px ${color}33` }}>{text}</div>
  );
};

// ═══ 1) BLACKOUT BOX ═════════════════════════════════════════════════════════════════════════
/** La caja de plástico vista desde arriba en perspectiva: 12 compartimentos con cinta de papel escrita a mano.
 *  Se destapa y los ítems hasta `upto` se prenden con luz de linterna, uno por uno. */
export const BlackoutBox: React.FC<{ durationInFrames: number; items?: ({ text: string } | string)[]; upto?: number; title?: string; image?: string }> =
  ({ durationInFrames, items = [], upto, title = "THE BLACKOUT BOX", image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const L = items.map(txt).slice(0, 12);
  const n = L.length || 12;
  const cols = n > 8 ? 4 : n > 4 ? 4 : n, rows = Math.ceil(n / cols);
  const hasta = Math.min(n, upto == null ? n : num(upto, n));
  const lid = interpolate(f, [4, 22], [0, 1], { ...CL, easing: easeOut });
  const t0 = 20, step = Math.max(3, Math.min(12, (D * 0.62 - t0) / Math.max(1, hasta)));
  const beamX = 960 + Math.sin(f / 26) * 360, beamY = 560 + Math.cos(f / 33) * 140;
  const W = 1320, H = 640;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.72} seed={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
        <Eyebrow text={hasta < n ? `${hasta} OF ${n}` : `${n} THINGS · UNDER $20 EACH`} />
        <Titulo text={title} f={f} at={2} size={96} />
      </div>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 290, width: W, height: H, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${interpolate(f, [0, D], [34, 28], CL)}deg)`, transformOrigin: "50% 60%" }}>
          {/* cuerpo de la caja */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: `linear-gradient(180deg, #4A5159, ${C.tote})`, boxShadow: "0 60px 90px rgba(0,0,0,0.75), inset 0 0 0 14px #2A2F35, inset 0 18px 30px rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", inset: 28, borderRadius: 20, background: "#1B1F24", boxShadow: "inset 0 26px 50px rgba(0,0,0,0.85)" }} />
          <div style={{ position: "absolute", inset: 44, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: 16 }}>
            {Array.from({ length: n }, (_, i) => {
              const on = i < hasta ? spring({ frame: f - t0 - i * step, fps, config: { damping: 14, stiffness: 160 } }) : 0;
              return (
                <div key={i} style={{ position: "relative", borderRadius: 12, background: on > 0.02 ? `rgba(255,210,122,${0.1 + on * 0.16})` : "rgba(255,255,255,0.03)",
                  boxShadow: on > 0.02 ? `inset 0 0 ${30 * on}px rgba(255,190,110,${0.5 * on}), 0 0 ${24 * on}px rgba(255,190,110,${0.25 * on})` : "inset 0 6px 14px rgba(0,0,0,0.7)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 12, top: 8, fontFamily: STENCIL, fontSize: 38, color: on > 0.5 ? C.hivis : "rgba(255,255,255,0.18)" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ position: "absolute", left: "8%", right: "8%", bottom: 12, padding: "4px 8px", background: C.manila, transform: `rotate(${(rnd(i, 7) - 0.5) * 5}deg) translateY(${(1 - on) * 60}px)`, opacity: on,
                    fontFamily: HAND, fontSize: 36, lineHeight: 1, color: "#2B2116", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>{L[i] || ""}</div>
                </div>
              );
            })}
          </div>
          {/* tapa que se corre */}
          <div style={{ position: "absolute", inset: -10, borderRadius: 38, background: `linear-gradient(160deg, #59616A, #353B42)`, transform: `translate(${lid * 1500}px, ${-lid * 180}px) rotate(${lid * 10}deg)`, opacity: 1 - lid * 0.9,
            boxShadow: "0 40px 70px rgba(0,0,0,0.7), inset 0 0 0 10px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(-3deg)", background: C.manila, padding: "10px 40px", fontFamily: HAND, fontSize: 70, color: "#2B2116" }}>BLACKOUT BOX</div>
          </div>
        </div>
      </div>
      {/* haz de linterna (luz real encima de todo) */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${beamX}px ${beamY}px, rgba(255,220,160,0.20) 0, rgba(255,220,160,0.06) 230px, rgba(0,0,0,0.35) 520px)`, mixBlendMode: "screen", opacity: lid }} />
      <PolvoDelante n={14} o={0.45} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 2) BOX ITEM CARD ════════════════════════════════════════════════════════════════════════
/** Capítulo de cada ítem: número gigante calado DETRÁS, polaroid con la foto nítida que entra girando,
 *  etiqueta de precio de cartulina colgando de un hilo que se hamaca, título que sube. 3 planos de profundidad. */
export const BoxItemCard: React.FC<{ durationInFrames: number; number: number; title: string; price?: string; sub?: string; image: string; total?: number }> =
  ({ durationInFrames, number, title, price, sub, image, total = 12 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D, 6, 10);
  const nro = num(number, 1);
  const inn = spring({ frame: f - 3, fps, config: { damping: 15, stiffness: 120 } });
  const drift = interpolate(f, [0, D], [0, 1], CL);
  // hamaca de la etiqueta: oscilación amortiguada que arranca cuando cae
  const tf = f - 12;
  const swing = tf < 0 ? -40 : 26 * Math.exp(-tf / 22) * Math.cos(tf / 4.2) + Math.sin(f / 30) * 1.5;
  const drop = spring({ frame: tf, fps, config: { damping: 9, stiffness: 140 } });
  const tw = interpolate(f, [10, 24], [0, 1], { ...CL, easing: easeOut });
  return (
    <AbsoluteFill style={{ opacity: op, overflow: "hidden" }}>
      <Fondo src={image} dark={0.66} seed={nro} warm />
      {/* plano 1: número calado gigante, se mueve lento hacia la izquierda */}
      <div style={{ position: "absolute", left: 60 - drift * 40, top: 40, fontFamily: STENCIL, fontSize: 780, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px rgba(245,196,0,${0.55 * inn})`, letterSpacing: -20 }}>{String(nro).padStart(2, "0")}</div>
      {/* plano 2: polaroid */}
      <div style={{ position: "absolute", left: 880 + drift * 18, top: 170, width: 760, height: 530, transform: `translateX(${(1 - inn) * 700}px) rotate(${interpolate(inn, [0, 1], [18, 3.5]) - drift * 1.2}deg)`, background: C.paper, padding: "22px 22px 90px", boxShadow: "0 50px 90px rgba(0,0,0,0.75), 0 8px 18px rgba(0,0,0,0.5)" }}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden", background: "#222" }}>
          <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + drift * 0.08})` }} />
        </div>
        <div style={{ position: "absolute", left: 26, bottom: 18, fontFamily: HAND, fontSize: 54, color: "#2B2116" }}>{`No. ${nro}`}</div>
        {/* cinta adhesiva arriba */}
        <div style={{ position: "absolute", left: "38%", top: -22, width: 190, height: 50, background: "rgba(235,225,190,0.78)", transform: "rotate(-4deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
      </div>
      {/* etiqueta de precio colgando (plano 3, delante del polaroid) */}
      {price ? (
        <div style={{ position: "absolute", left: 1470, top: -30, width: 4, height: 330 * drop, background: "#d9d2c2", transformOrigin: "50% 0", transform: `rotate(${swing}deg)` }}>
          <div style={{ position: "absolute", left: -110, top: "100%", width: 224, height: 132, transformOrigin: "50% 0" }}>
            <svg width="224" height="132" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.6))" }}>
              <path d="M40 0 H224 V132 H40 L0 66 Z" fill={C.manila} stroke="#8a6d3b" strokeWidth="3" />
              <circle cx="30" cy="66" r="9" fill="#1b1b1b" />
            </svg>
            <div style={{ position: "absolute", left: 44, right: 6, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 78, color: "#1f1810", transform: "rotate(-3deg)" }}>{price}</div>
          </div>
        </div>
      ) : null}
      {/* textos */}
      <div style={{ position: "absolute", left: 110, bottom: 120, maxWidth: 820 }}>
        <Eyebrow text={`No. ${nro} of ${total}`} op={tw} />
        <div style={{ fontFamily: BEBAS, fontSize: title.length > 18 ? 118 : 150, lineHeight: 0.9, color: C.white, opacity: tw, transform: `translateY(${(1 - tw) * 40}px)`, textShadow: "0 10px 40px rgba(0,0,0,0.95)" }}>{title}</div>
        {sub ? <div style={{ fontFamily: HAND, fontSize: 58, color: C.glow, marginTop: 8, opacity: interpolate(f, [D * 0.4, D * 0.5], [0, 1], CL), transform: "rotate(-2deg)" }}>{sub}</div> : null}
      </div>
      <PolvoDelante n={12} o={0.4} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 3) BATTERY COLD ═════════════════════════════════════════════════════════════════════════
/** Termómetro que baja + escarcha que entra de los bordes; la alcalina se vacía, la de litio aguanta. */
export const BatteryCold: React.FC<{ durationInFrames: number; fromF?: number; toF?: number; title?: string; left?: string; right?: string; image?: string }> =
  ({ durationInFrames, fromF = 70, toF = 0, title = "COLD KILLS CHEAP BATTERIES", left = "ALKALINE", right = "LITHIUM", image }) => {
  const f = useCurrentFrame();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const k = interpolate(f, [10, D * 0.7], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const temp = Math.round(num(fromF, 70) + (num(toF, 0) - num(fromF, 70)) * k);
  const alk = interpolate(k, [0, 1], [100, 28]), lit = interpolate(k, [0, 1], [100, 94]);
  const frost = k;
  const Bat: React.FC<{ pct: number; label: string; y: number; good: boolean }> = ({ pct, label, y, good }) => {
    const col = good ? C.green : pct < 45 ? C.red : pct < 70 ? C.warm : C.green;
    return (
      <div style={{ position: "absolute", left: 640, top: y }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: C.white, marginBottom: 10 }}>{label}</div>
        <div style={{ position: "relative", width: 900, height: 170, borderRadius: 26, border: "8px solid #cfd6da", background: "rgba(0,0,0,0.55)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ position: "absolute", right: -36, top: 50, width: 28, height: 56, borderRadius: 6, background: "#cfd6da" }} />
          <div style={{ position: "absolute", left: 10, top: 10, bottom: 10, width: `${(pct / 100) * 864}px`, borderRadius: 14, background: `linear-gradient(180deg, ${col}, ${col}aa)`, boxShadow: `0 0 30px ${col}66` }} />
          <div style={{ position: "absolute", right: 30, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 84, color: C.white, textShadow: "0 3px 10px #000" }}>{`${Math.round(pct)}%`}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.78} seed={5} />
      {/* termómetro */}
      <div style={{ position: "absolute", left: 200, top: 190, width: 120, height: 700 }}>
        <div style={{ position: "absolute", left: 30, top: 0, width: 60, height: 600, borderRadius: 30, background: "rgba(255,255,255,0.14)", border: "5px solid #dfe6ea" }} />
        <div style={{ position: "absolute", left: 44, bottom: 110, width: 32, height: interpolate(temp, [-20, 80], [20, 560], CL), borderRadius: 16, background: temp > 32 ? C.red : C.cold, boxShadow: `0 0 20px ${temp > 32 ? C.red : C.cold}` }} />
        <div style={{ position: "absolute", left: 10, bottom: 0, width: 100, height: 100, borderRadius: 50, background: temp > 32 ? C.red : C.cold, border: "5px solid #dfe6ea" }} />
        <div style={{ position: "absolute", left: -40, top: -120, width: 220, textAlign: "center", fontFamily: MONO, fontSize: 86, color: temp > 32 ? C.warm : C.ice, textShadow: "0 4px 16px #000" }}>{`${temp}°F`}</div>
      </div>
      <Bat pct={alk} label={left} y={250} good={false} />
      <Bat pct={lit} label={right} y={560} good />
      <div style={{ position: "absolute", left: 640, top: 110 }}><Titulo text={title} f={f} at={4} size={80} /></div>
      {/* escarcha que entra de los bordes */}
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: `inset 0 0 ${60 + frost * 220}px ${20 + frost * 60}px rgba(200,230,255,${0.1 + frost * 0.38})` }} />
      <PolvoDelante n={20} o={0.3 + frost * 0.4} snow />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 4) CRANK RADIO ══════════════════════════════════════════════════════════════════════════
/** Cara de la radio: la aguja barre el dial hasta la banda WX (NOAA), la manivela gira y el celular carga. */
export const CrankRadio: React.FC<{ durationInFrames: number; freq?: string; title?: string; phoneTo?: number; image?: string }> =
  ({ durationInFrames, freq = "162.550", title = "NOAA WEATHER RADIO", phoneTo = 18, image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const needle = spring({ frame: f - 8, fps, config: { damping: 12, stiffness: 60 } });
  const lock = f > 40;
  const ang = f * 9;
  const pct = Math.round(interpolate(f, [30, D * 0.8], [3, num(phoneTo, 18)], CL));
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.75} seed={7} />
      <div style={{ position: "absolute", left: 180, top: 200, width: 1080, height: 640, borderRadius: 40, background: "linear-gradient(170deg, #C7362B, #7E1C15)", boxShadow: "0 60px 100px rgba(0,0,0,0.75), inset 0 0 0 12px #3a0f0b, inset 0 20px 40px rgba(255,255,255,0.15)" }}>
        {/* rejilla del parlante */}
        <div style={{ position: "absolute", left: 60, top: 70, width: 380, height: 380, borderRadius: 190, background: "repeating-radial-gradient(circle, #1a1a1a 0 6px, #2d2d2d 6px 12px)", boxShadow: "inset 0 10px 30px #000",
          transform: `scale(${lock ? 1 + Math.abs(Math.sin(f / 2.2)) * 0.012 : 1})` }} />
        {/* dial */}
        <div style={{ position: "absolute", left: 490, top: 70, width: 520, height: 210, borderRadius: 18, background: "linear-gradient(180deg, #F4E7C4, #D9C58E)", boxShadow: "inset 0 6px 16px rgba(0,0,0,0.4)", overflow: "hidden" }}>
          {["AM", "FM", "WX"].map((b, i) => (
            <div key={b} style={{ position: "absolute", left: 20, top: 18 + i * 62, width: 480, height: 50 }}>
              <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 30, color: b === "WX" && lock ? C.red : "#3a2e18" }}>{b}</div>
              {Array.from({ length: 22 }, (_, t) => <div key={t} style={{ position: "absolute", left: 70 + t * 18, top: 6, width: 2, height: t % 5 ? 14 : 26, background: "#3a2e18" }} />)}
            </div>
          ))}
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 5, background: C.red, left: interpolate(needle, [0, 1], [70, 440]), boxShadow: "0 0 8px rgba(224,48,30,0.8)" }} />
        </div>
        <div style={{ position: "absolute", left: 490, top: 300, width: 520, fontFamily: MONO, fontSize: 52, whiteSpace: "nowrap", color: lock ? C.green : "#ffffff55", textShadow: lock ? "0 0 18px rgba(88,240,138,0.7)" : "none" }}>{`WX ${freq} MHz`}</div>
        {/* ondas */}
        <div style={{ position: "absolute", left: 490, top: 400, width: 520, height: 70, display: "flex", gap: 6, alignItems: "flex-end" }}>
          {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ flex: 1, height: lock ? 10 + Math.abs(Math.sin(f / 3 + i * 0.7) * Math.cos(f / 7 + i)) * 60 : 4, background: C.glow, borderRadius: 3, opacity: 0.85 }} />)}
        </div>
      </div>
      {/* manivela (delante, a la derecha) */}
      <svg width="360" height="360" style={{ position: "absolute", left: 1170, top: 520, filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.7))" }}>
        <circle cx="180" cy="180" r="110" fill="#2b2b2b" stroke="#555" strokeWidth="10" />
        <g transform={`rotate(${ang} 180 180)`}>
          <rect x="172" y="60" width="16" height="120" rx="8" fill="#bbb" />
          <circle cx="180" cy="60" r="30" fill="#e8e8e8" stroke="#888" strokeWidth="4" />
        </g>
        <circle cx="180" cy="180" r="22" fill="#999" />
      </svg>
      {/* celular cargando */}
      <div style={{ position: "absolute", left: 1480, top: 170, width: 260, height: 470, borderRadius: 40, background: "#111", border: "6px solid #444", boxShadow: "0 40px 70px rgba(0,0,0,0.7)" }}>
        <div style={{ position: "absolute", left: 70, top: 110, width: 110, height: 200, borderRadius: 14, border: "6px solid #ddd" }}>
          <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: `${Math.max(4, pct)}%`, background: pct < 10 ? C.red : C.green, borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 30, top: -22, width: 38, height: 14, borderRadius: 4, background: "#ddd" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", fontFamily: MONO, fontSize: 64, color: C.white }}>{`${pct}%`}</div>
      </div>
      <div style={{ position: "absolute", left: 190, top: 70 }}><Titulo text={title} f={f} at={3} size={92} /></div>
      <PolvoDelante n={10} o={0.35} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 5) BED LAYERS ═══════════════════════════════════════════════════════════════════════════
/** Corte lateral de una cama: el calor se escapa por abajo y por arriba; las capas de lana entran y lo cortan. */
const plaidOf = (c1: string, c2: string) => `repeating-linear-gradient(90deg, ${c1} 0 40px, ${c2} 40px 48px, ${c1} 48px 90px), repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 6px, transparent 6px 22px)`;
const Manta: React.FC<{ l: { y: number; lbl: string; k: number; top: boolean }; i: number }> = ({ l, i }) => (
  <div style={{ position: "absolute", left: l.top ? 530 : 360, top: l.y, width: l.top ? 930 : 1100, height: l.top ? 120 : 30, borderRadius: l.top ? "40px 14px 14px 40px" : 12,
    background: plaidOf(l.top ? "#5b6b4a" : "#7a2f2a", "#2e2a26"), transform: `translateX(${(1 - l.k) * (i % 2 ? 1900 : -1900)}px)`, boxShadow: "0 10px 18px rgba(0,0,0,0.55)" }}>
    {l.lbl ? <div style={{ position: "absolute", right: -300, top: l.top ? 30 : -22, fontFamily: HAND, fontSize: 60, color: C.glow, opacity: l.k, whiteSpace: "nowrap" }}>{`← ${l.lbl}`}</div> : null}
  </div>
);
export const BedLayers: React.FC<{ durationInFrames: number; title?: string; under?: number; over?: number }> =
  ({ durationInFrames, title = "ONE UNDER · TWO ON TOP", under = 1, over = 2 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const nU = Math.max(1, Math.min(2, num(under, 1))), nO = Math.max(1, Math.min(3, num(over, 2)));
  const cap = (i: number) => spring({ frame: f - 14 - i * Math.max(6, D * 0.1), fps, config: { damping: 13, stiffness: 110 } });
  const X0 = 360, W = 1100;
  const layers = [...Array.from({ length: nU }, (_, i) => ({ y: 700 - i * 30, lbl: i === 0 ? `${nU} UNDER` : "", k: cap(i), top: false })),
    ...Array.from({ length: nO }, (_, i) => ({ y: 578 - i * 34, lbl: i === nO - 1 ? `${nO} ON TOP` : "", k: cap(nU + i), top: true }))];
  const bloqueado = layers.reduce((a, l) => a + l.k, 0) / layers.length;
  const hat = cap(nU + nO);
  const plaid = plaidOf;
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 50% 55%, #16222e, #06090c)" }}>
      {/* piso frío */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: "linear-gradient(180deg, #1d3448, #0b1620)" }} />
      <div style={{ position: "absolute", left: 60, top: 880, fontFamily: OSW, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: C.cold }}>COLD FLOOR · 40°F</div>
      {/* colchón */}
      <div style={{ position: "absolute", left: X0, top: 736, width: W, height: 84, borderRadius: 18, background: "#d8d3c8", boxShadow: "0 20px 30px rgba(0,0,0,0.6)" }} />
      {/* frazadas de abajo */}
      {layers.filter((l) => !l.top).map((l, i) => <Manta key={`u${i}`} l={l} i={i} />)}
      {/* durmiente (silueta) */}
      <div style={{ position: "absolute", left: X0 + 190, top: 600, width: W - 240, height: 104, borderRadius: 52, background: "linear-gradient(180deg, #e7b28f, #b07a58)" }} />
      <div style={{ position: "absolute", left: X0 + 20, top: 560, width: 160, height: 160, borderRadius: 80, background: "radial-gradient(circle at 40% 40%, #f0c3a1, #b57f5d)" }} />
      {/* frazadas de arriba: tapan el cuerpo desde el cuello */}
      {layers.filter((l) => l.top).map((l, i) => <Manta key={`o${i}`} l={l} i={i + 1} />)}
      {/* gorro de lana */}
      <div style={{ position: "absolute", left: X0 - 10, top: 506, width: 190, height: 112, borderRadius: "100px 100px 20px 20px", background: plaid("#394a63", "#1f2a3a"), transform: `translateY(${(1 - hat) * -500}px) rotate(-12deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: X0 - 250, top: 420, fontFamily: HAND, fontSize: 60, color: C.glow, opacity: hat }}>WOOL HAT ↘</div>
      {/* flechas de calor que se escapan (arriba y abajo) y se cortan */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = 480 + i * 120, up = i % 2 === 0;
        const t = ((f * 2.2 + i * 23) % 90) / 90;
        const o = (1 - bloqueado) * (1 - t) * 0.9;
        return <div key={i} style={{ position: "absolute", left: x, top: up ? 420 - t * 260 : 830 + t * 200, fontFamily: BEBAS, fontSize: 90, color: C.orange, opacity: o, transform: `rotate(${up ? 0 : 180}deg)` }}>↑</div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}>
        <Eyebrow text="WOOL · STAYS WARM WHEN DAMP" />
        <Titulo text={title} f={f} at={4} size={100} />
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 6) WARMER MAP ═══════════════════════════════════════════════════════════════════════════
/** Silueta de persona con los calentadores de mano brillando donde van (pecho, bolsillos, pies) y la advertencia sellada. */
export const WarmerMap: React.FC<{ durationInFrames: number; spots?: ({ text: string } | string)[]; warn?: string; title?: string }> =
  ({ durationInFrames, spots = ["Over your chest", "Coat pockets", "On top of the toes"], warn = "NEVER ON BARE SKIN", title = "WHERE THEY GO" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const S = spots.map(txt).slice(0, 4);
  const pos = [[960, 390], [860, 560], [960, 900], [1060, 560]];
  const lbl = [[1260, 360], [300, 560], [1260, 890], [1260, 560]];
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 50% 50%, #1a2430, #06090c)" }}>
      {/* silueta */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="sil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f4152" /><stop offset="1" stopColor="#1a2632" /></linearGradient></defs>
        <circle cx="960" cy="210" r="80" fill="url(#sil)" stroke="#6FB2E8" strokeOpacity="0.4" strokeWidth="3" />
        <path d="M860 300 Q960 280 1060 300 L1110 640 L1060 650 L1045 960 L975 960 L960 700 L945 960 L875 960 L860 650 L810 640 Z" fill="url(#sil)" stroke="#6FB2E8" strokeOpacity="0.4" strokeWidth="3" />
      </svg>
      {S.map((s, i) => {
        const k = spring({ frame: f - 14 - i * Math.max(8, D * 0.12), fps, config: { damping: 12, stiffness: 150 } });
        const [x, y] = pos[i], [lx, ly] = lbl[i];
        const pul = 1 + Math.sin(f / 5 + i) * 0.08;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 70, transform: `scale(${k * pul})`, background: "radial-gradient(circle, rgba(255,200,120,0.95) 0, rgba(255,106,19,0.55) 35%, rgba(255,106,19,0) 70%)", mixBlendMode: "screen" }} />
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: k }}>
              <line x1={x} y1={y} x2={lx < x ? lx + 380 : lx - 20} y2={ly} stroke={C.glow} strokeWidth="3" strokeDasharray="10 8" />
            </svg>
            <div style={{ position: "absolute", left: lx, top: ly - 44, width: 420, fontFamily: HAND, fontSize: 60, color: C.glow, opacity: k, textAlign: lx < x ? "right" : "left" }}>{s}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 90, top: 80 }}>
        <Eyebrow text="AIR-ACTIVATED · 8-10 HOURS" />
        <Titulo text={title} f={f} at={4} size={100} />
      </div>
      {warn ? <Sello text={warn} at={Math.round(D * 0.72)} x={960} y={1000} rot={-4} size={70} /> : null}
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 7) WATER MATH ═══════════════════════════════════════════════════════════════════════════
/** La cuenta del agua escrita a mano y las garrafas que aparecen y se llenan, una por galón. */
export const WaterMath: React.FC<{ durationInFrames: number; perDay?: number; people?: number; days?: number; unit?: string; title?: string; image?: string }> =
  ({ durationInFrames, perDay = 1, people = 4, days = 3, unit = "GAL", title, image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const a = num(perDay, 1), p = num(people, 4), d = num(days, 3), tot = Math.round(a * p * d);
  const n = Math.min(24, tot);
  const cols = Math.min(12, n), rows = Math.ceil(n / cols);
  const step = Math.max(1.5, Math.min(5, (D * 0.5) / n));
  const partes = [`${a} ${unit}`, `× ${p} PEOPLE`, `× ${d} DAYS`, `= ${tot} ${unit}`];
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.8} seed={9} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", gap: 36 }}>
        {partes.map((t, i) => {
          const k = interpolate(f, [4 + i * 7, 14 + i * 7], [0, 1], { ...CL, easing: easeOut });
          return <div key={i} style={{ fontFamily: i === 3 ? STENCIL : BEBAS, fontSize: i === 3 ? 110 : 100, color: i === 3 ? C.hivis : C.white, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, textShadow: "0 8px 30px #000" }}>{t}</div>;
        })}
      </div>
      {title ? <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}><Eyebrow text={title} /></div> : null}
      <div style={{ position: "absolute", left: 960 - (cols * 130) / 2, top: rows > 1 ? 380 : 480, display: "grid", gridTemplateColumns: `repeat(${cols}, 130px)`, rowGap: 30 }}>
        {Array.from({ length: n }, (_, i) => {
          const k = spring({ frame: f - 30 - i * step, fps, config: { damping: 11, stiffness: 180 } });
          const lvl = interpolate(f - 30 - i * step, [4, 22], [0, 1], CL);
          return (
            <div key={i} style={{ position: "relative", width: 110, height: 230, transform: `scale(${k}) translateY(${(1 - k) * 40}px)`, transformOrigin: "50% 100%" }}>
              <svg width="110" height="230" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 16px 16px rgba(0,0,0,0.6))" }}>
                <defs><clipPath id={`jug${i}`}><path d="M30 30 H80 V60 Q106 72 106 100 V220 Q106 228 98 228 H12 Q4 228 4 220 V100 Q4 72 30 60 Z" /></clipPath></defs>
                <g clipPath={`url(#jug${i})`}>
                  <rect x="0" y="0" width="110" height="230" fill="rgba(255,255,255,0.12)" />
                  <rect x="0" y={228 - lvl * 160} width="110" height="230" fill={C.water} opacity="0.85" />
                  <rect x="0" y={228 - lvl * 160} width="110" height="5" fill="#bfe6ff" />
                </g>
                <path d="M30 30 H80 V60 Q106 72 106 100 V220 Q106 228 98 228 H12 Q4 228 4 220 V100 Q4 72 30 60 Z" fill="none" stroke="#dfe9ef" strokeWidth="4" />
                <rect x="36" y="12" width="38" height="20" rx="4" fill="#1d6fd1" />
              </svg>
            </div>
          );
        })}
      </div>
      <PolvoDelante n={10} o={0.3} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 8) FRIDGE THERMO ════════════════════════════════════════════════════════════════════════
/** Termómetro de aguja de heladera: la aguja se clava en `value`; ≤ límite = se queda, > límite = a la basura. */
export const FridgeThermo: React.FC<{ durationInFrames: number; value: number; limit?: number; label?: string; saved?: number; image?: string }> =
  ({ durationInFrames, value, limit = 40, label = "THE MAGIC NUMBER", saved, image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const v = num(value, 38), lim = num(limit, 40);
  const nk = spring({ frame: f - 10, fps, config: { damping: 8, stiffness: 70 } });
  const cur = interpolate(nk, [0, 1], [70, v]);
  const angOf = (t: number) => interpolate(t, [0, 80], [-130, 130], CL);
  const ok = v <= lim;
  const R = 300, cx = 700, cy = 560;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + R * Math.sin((a * Math.PI) / 180), cy - R * Math.cos((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const sv = saved != null ? Math.round(interpolate(f, [D * 0.55, D * 0.85], [0, num(saved, 0)], CL)) : null;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.78} seed={11} />
      <div style={{ position: "absolute", left: cx - 380, top: cy - 380, width: 760, height: 760, borderRadius: 380, background: "radial-gradient(circle at 40% 35%, #f5f7f8, #c9d1d6)", boxShadow: "0 50px 90px rgba(0,0,0,0.8), inset 0 0 0 22px #9aa4ab, inset 0 0 0 26px #5f686e" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d={arc(angOf(0), angOf(lim))} stroke="#2FA65A" strokeWidth="46" fill="none" />
        <path d={arc(angOf(lim), angOf(80))} stroke={C.red} strokeWidth="46" fill="none" />
        {Array.from({ length: 17 }, (_, i) => {
          const t = i * 5, a = (angOf(t) * Math.PI) / 180;
          return (
            <g key={i}>
              <line x1={cx + (R - 40) * Math.sin(a)} y1={cy - (R - 40) * Math.cos(a)} x2={cx + (R - (i % 2 ? 60 : 80)) * Math.sin(a)} y2={cy - (R - (i % 2 ? 60 : 80)) * Math.cos(a)} stroke="#222" strokeWidth={i % 2 ? 3 : 6} />
              {i % 2 === 0 ? <text x={cx + (R - 120) * Math.sin(a)} y={cy - (R - 120) * Math.cos(a) + 14} fontFamily={OSW} fontWeight={700} fontSize="38" fill="#222" textAnchor="middle">{t}</text> : null}
            </g>
          );
        })}
        <g transform={`rotate(${angOf(cur)} ${cx} ${cy})`} style={{ filter: "drop-shadow(0 8px 6px rgba(0,0,0,0.5))" }}>
          <path d={`M ${cx - 12} ${cy} L ${cx} ${cy - R + 50} L ${cx + 12} ${cy} Z`} fill={C.red} />
        </g>
        <circle cx={cx} cy={cy} r="34" fill="#333" />
        <text x={cx} y={cy + 170} fontFamily={MONO} fontSize="80" fill="#111" textAnchor="middle">{`${Math.round(cur)}°F`}</text>
      </svg>
      <div style={{ position: "absolute", left: 1150, top: 250, width: 700 }}>
        <Eyebrow text={label} />
        <div style={{ fontFamily: STENCIL, fontSize: 200, lineHeight: 1, color: C.white, textShadow: "0 10px 40px #000" }}>{`${lim}°F`}</div>
        <div style={{ fontFamily: HAND, fontSize: 60, color: C.glow, opacity: interpolate(f, [20, 32], [0, 1], CL) }}>{`above ${lim}° for 2 hours → toss it`}</div>
        {sv != null ? <div style={{ marginTop: 40, fontFamily: MONO, fontSize: 110, color: C.green, textShadow: "0 0 24px rgba(88,240,138,0.5)", opacity: interpolate(f, [D * 0.5, D * 0.58], [0, 1], CL) }}>{`$${sv} SAVED`}</div> : null}
      </div>
      <Sello text={ok ? "KEEP IT" : "TOSS IT"} color={ok ? C.green : C.red} at={Math.round(D * 0.62)} x={1450} y={900} rot={-6} size={96} />
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 160px 50px rgba(200,230,255,0.22)" }} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 9) FLOWER POT MYTH ══════════════════════════════════════════════════════════════════════
/** Maceta con velitas contra un calefactor: barras de watts a escala real, y el sello de MITO. */
export const FlowerPotMyth: React.FC<{ durationInFrames: number; a?: number; b?: number; aLabel?: string; bLabel?: string; title?: string; stamp?: string }> =
  ({ durationInFrames, a = 30, b = 1500, aLabel = "TEA LIGHT", bLabel = "SPACE HEATER", title = "THE FLOWER POT HEATER", stamp = "MYTH" }) => {
  const f = useCurrentFrame();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const A = num(a, 30), Bv = num(b, 1500);
  const k = interpolate(f, [16, D * 0.55], [0, 1], { ...CL, easing: easeOut });
  const maxW = 760;
  const wA = (A / Bv) * maxW * k, wB = maxW * k;
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 30% 60%, #2a1a10, #07080a)" }}>
      {/* maceta de barro con velitas */}
      <svg width="520" height="520" style={{ position: "absolute", left: 90, top: 330, filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.7))" }}>
        <defs><radialGradient id="fl" cx="0.5" cy="0.6" r="0.5"><stop offset="0" stopColor="#fff3c0" /><stop offset="0.5" stopColor="#ffb347" /><stop offset="1" stopColor="#ff6a13" stopOpacity="0" /></radialGradient></defs>
        <path d="M110 120 H410 L360 400 H160 Z" fill="#B5582C" stroke="#7a3719" strokeWidth="8" />
        <rect x="95" y="100" width="330" height="46" rx="10" fill="#C4673A" stroke="#7a3719" strokeWidth="6" />
        {[180, 260, 340].map((x, i) => (
          <g key={i}>
            <rect x={x - 30} y="440" width="60" height="26" rx="5" fill="#e8e8e8" />
            <ellipse cx={x} cy={420 - Math.abs(Math.sin(f / 3 + i)) * 4} rx="14" ry={26 + Math.sin(f / 2 + i) * 3} fill="url(#fl)" />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 90, top: 90 }}>
        <Eyebrow text="SEEN IT ONLINE?" />
        <Titulo text={title} f={f} at={3} size={96} />
      </div>
      {/* barras */}
      {[{ l: aLabel, v: A, w: wA, c: C.warm, y: 420 }, { l: bLabel, v: Bv, w: wB, c: C.red, y: 640 }].map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 700, top: r.y }}>
          <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 40, letterSpacing: 5, color: C.white, marginBottom: 12 }}>{r.l}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: Math.max(6, r.w), height: 110, borderRadius: 10, background: `linear-gradient(90deg, ${r.c}, ${r.c}bb)`, boxShadow: `0 0 30px ${r.c}55` }} />
            <div style={{ fontFamily: MONO, fontSize: 84, color: C.white, whiteSpace: "nowrap" }}>{`${Math.round(r.v * k)} W`}</div>
          </div>
        </div>
      ))}
      <Sello text={stamp} at={Math.round(D * 0.66)} x={1340} y={250} rot={-10} size={170} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 10) SAFETY BOX ══════════════════════════════════════════════════════════════════════════
/** La caja del calefactor en la góndola: los requisitos se tildan (o se tachan) y cae el sello del veredicto. */
export const SafetyBox: React.FC<{ durationInFrames: number; items: ({ text: string; state?: string } | string)[]; title?: string; stamp?: string; image?: string }> =
  ({ durationInFrames, items, title = "CHECK THE BOX", stamp, image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const L = (items || []).slice(0, 4).map((x) => ({ t: txt(x), ok: !(typeof x === "object" && x && (x as { state?: string }).state === "todo") }));
  const todoOk = L.every((x) => x.ok);
  const inn = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 110 } });
  const sway = Math.sin(f / 30) * 1.5;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.7} seed={13} />
      {/* caja de cartón en 3D (frente + costado + tapa) */}
      <div style={{ position: "absolute", left: 250, top: 190, width: 900, height: 720, perspective: 1800, transform: `translateY(${(1 - inn) * 500}px)` }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${-16 + sway}deg) rotateX(4deg)` }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, ${C.kraft}, #8e6a3c)`, borderRadius: 6, boxShadow: "inset 0 0 60px rgba(0,0,0,0.35)" }}>
            <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 120, background: C.red, display: "flex", alignItems: "center", paddingLeft: 30, fontFamily: BEBAS, fontSize: 100, color: C.white, letterSpacing: 3 }}>INDOOR HEATER</div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 200, display: "flex", flexDirection: "column", gap: 26 }}>
              {L.map((x, i) => {
                const at = 18 + i * Math.max(8, D * 0.12);
                const k = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(255,255,255,0.88)", padding: "14px 22px", borderRadius: 8 }}>
                    <div style={{ width: 84, height: 84, borderRadius: 10, border: "6px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OSW, fontWeight: 700, fontSize: 76, color: x.ok ? "#1f8a45" : C.red, transform: `scale(${0.4 + k * 0.6})`, opacity: k }}>{x.ok ? "✓" : "✗"}</div>
                    <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 50, color: "#1b1b1b", textDecoration: !x.ok && k > 0.9 ? "line-through" : "none" }}>{x.t}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ position: "absolute", left: "100%", top: 0, width: 220, height: "100%", transformOrigin: "0 50%", transform: "rotateY(90deg)", background: "linear-gradient(90deg, #7a5a31, #5e4526)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1230, top: 300, width: 620 }}>
        <Eyebrow text="BEFORE YOU BUY" />
        <Titulo text={title} f={f} at={6} size={110} />
      </div>
      <Sello text={stamp || (todoOk ? "BUY IT" : "PUT IT BACK")} color={todoOk ? C.green : C.red} at={Math.round(D * 0.7)} x={1470} y={760} rot={-8} size={96} />
      <PolvoDelante n={12} o={0.35} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 11) FINE PRINT ══════════════════════════════════════════════════════════════════════════
/** Etiqueta de advertencia: una lupa recorre la letra chica y, adentro del vidrio, se lee grande; al final queda subrayada. */
export const FinePrint: React.FC<{ durationInFrames: number; text: string; fine: string; title?: string; image?: string }> =
  ({ durationInFrames, text, fine, title = "READ THE FINE PRINT", image }) => {
  const f = useCurrentFrame();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const LX = 360, LY = 330, LW = 1200, LH = 440;
  const t = interpolate(f, [12, D * 0.62], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const lensR = 170, Z = 2.6;
  const fineY = LY + 330;
  const lx = LX + 200 + t * (LW - 400), ly = fineY - 6 + Math.sin(f / 9) * 6;
  const Etiqueta: React.FC = () => (
    <div style={{ position: "absolute", left: LX, top: LY, width: LW, height: LH, background: "#FBFAF6", borderRadius: 14, boxShadow: "0 40px 80px rgba(0,0,0,0.7)", overflow: "hidden" }}>
      <div style={{ height: 110, background: C.hivis, display: "flex", alignItems: "center", paddingLeft: 40, gap: 26, fontFamily: BEBAS, fontSize: 90, color: "#111" }}><span style={{ fontSize: 96 }}>⚠</span>{text}</div>
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ margin: "22px 40px 0", height: 16, width: `${80 - i * 9}%`, background: "#cfcac0", borderRadius: 4 }} />)}
      <div style={{ position: "absolute", left: 40, top: 316, fontFamily: OSW, fontWeight: 700, fontSize: 26, color: "#333", letterSpacing: 1, whiteSpace: "nowrap" }}>{fine}</div>
      <div style={{ position: "absolute", left: 40, top: 356, height: 14, width: `${60}%`, background: "#cfcac0", borderRadius: 4 }} />
    </div>
  );
  const sub = interpolate(f, [D * 0.66, D * 0.8], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.72} seed={15} />
      <Etiqueta />
      {/* subrayado rojo sobre la letra chica */}
      <div style={{ position: "absolute", left: LX + 36, top: fineY + 22, height: 8, width: 1100 * sub * 0.6, background: C.red, borderRadius: 4, transform: "rotate(-0.6deg)" }} />
      {/* lupa: copia ampliada de la etiqueta recortada en círculo */}
      <div style={{ position: "absolute", left: lx - lensR, top: ly - lensR, width: lensR * 2, height: lensR * 2, borderRadius: lensR, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.3)", border: "14px solid #2b2b2b" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${lensR - lx * Z}px, ${lensR - ly * Z}px) scale(${Z})` }}>
          <AbsoluteFill style={{ background: "#FBFAF6" }} />
          <Etiqueta />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: lensR, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 40%)" }} />
      </div>
      <div style={{ position: "absolute", left: lx + lensR * 0.62, top: ly + lensR * 0.62, width: 50, height: 260, borderRadius: 25, background: "linear-gradient(90deg, #3a2a1a, #6b4a2c)", transform: "rotate(-45deg)", transformOrigin: "25px 0", boxShadow: "0 20px 30px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}><Titulo text={title} f={f} at={3} size={96} /></div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 12) BOX RECEIPT ═════════════════════════════════════════════════════════════════════════
/** Ticket de ferretería que sale de la ranura de la impresora renglón por renglón, con el total y la nota a mano. */
export const BoxReceipt: React.FC<{ durationInFrames: number; lines: ({ label: string; amount: number } | { text: string })[]; title?: string; totalLabel?: string; footer?: string; image?: string }> =
  ({ durationInFrames, lines, title = "HARDWARE STORE", totalLabel = "TOTAL", footer, image }) => {
  const f = useCurrentFrame();
  const D = Math.max(90, durationInFrames);
  const op = fadeIO(f, D);
  const L = (lines || []).slice(0, 13).map((x) => ({ l: (x as { label?: string }).label ?? txt(x), a: num((x as { amount?: number }).amount, 0) }));
  const rowH = 52, hdr = 170, H = hdr + L.length * rowH + 190;
  const per = Math.max(2, Math.min(9, (D * 0.62 - 10) / Math.max(1, L.length)));
  const shown = Math.min(L.length, Math.floor(Math.max(0, f - 10) / per));
  const fed = Math.min(H, hdr + shown * rowH + (shown >= L.length ? 190 : 0));
  const total = L.slice(0, shown).reduce((s, x) => s + x.a, 0);
  const slotY = 900;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Fondo src={image} dark={0.76} seed={17} warm />
      {/* ticket: crece hacia arriba desde la ranura */}
      <div style={{ position: "absolute", left: 960 - 290, top: slotY - fed, width: 580, height: fed, overflow: "hidden", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 580, height: H, background: "linear-gradient(90deg, #eeeae0, #fbfaf6 20%, #fbfaf6 80%, #e6e1d6)", padding: "30px 40px", boxSizing: "border-box", fontFamily: MONO, color: "#222",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 14px)" }}>
          <div style={{ textAlign: "center", fontSize: 44 }}>{title}</div>
          <div style={{ textAlign: "center", fontSize: 26, color: "#666", marginBottom: 20 }}>MANSFIELD, OH · CASH</div>
          <div style={{ borderTop: "3px dashed #999", marginBottom: 12 }} />
          {L.map((x, i) => (
            <div key={i} style={{ display: "flex", fontSize: 32, height: rowH, alignItems: "center", opacity: i < shown ? 1 : 0 }}>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{x.l.toUpperCase()}</span>
              <span style={{ flex: 1, borderBottom: "3px dotted #bbb", margin: "0 10px", transform: "translateY(8px)" }} />
              <span>{`$${money(x.a)}`}</span>
            </div>
          ))}
          <div style={{ borderTop: "3px dashed #999", margin: "14px 0" }} />
          <div style={{ display: "flex", fontSize: 50, fontWeight: 700 }}><span>{totalLabel}</span><span style={{ flex: 1 }} /><span>{`$${money(Math.round(total * 100) / 100)}`}</span></div>
        </div>
      </div>
      {/* ranura de la impresora (delante del ticket) */}
      <div style={{ position: "absolute", left: 960 - 380, top: slotY - 10, width: 760, height: 190, borderRadius: 20, background: "linear-gradient(180deg, #2b3035, #121518)", boxShadow: "0 -6px 0 #0a0a0a inset, 0 30px 50px rgba(0,0,0,0.7)" }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 6, height: 14, borderRadius: 7, background: "#050505" }} />
        <div style={{ position: "absolute", right: 40, top: 70, width: 22, height: 22, borderRadius: 11, background: shown < L.length ? C.green : "#2a4", boxShadow: shown < L.length && f % 8 < 4 ? `0 0 16px ${C.green}` : "none" }} />
      </div>
      {footer ? (
        <div style={{ position: "absolute", left: 1320, top: 360, width: 520, fontFamily: HAND, fontSize: 72, color: C.glow, transform: "rotate(-5deg)", opacity: interpolate(f, [D * 0.72, D * 0.82], [0, 1], CL) }}>
          {footer}
          <svg width="520" height="60"><path d="M10 40 Q260 5 510 38" stroke={C.glow} strokeWidth="5" fill="none" /></svg>
        </div>
      ) : null}
      <PolvoDelante n={12} o={0.35} />
      <Grano />
    </AbsoluteFill>
  );
};
