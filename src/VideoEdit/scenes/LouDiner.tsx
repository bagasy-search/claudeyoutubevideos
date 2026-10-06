// LouDiner.tsx — KIT DEL DINER (canal Lou's Diner Secrets). Doce piezas hechas a mano en código,
// todas del mismo mundo: ticket térmico en el riel de comandas, sello "86'd", rayos X de la papa,
// medidor de corteza, pantalla dividida con cronómetros, tablero de letras, frase quemada en la
// plancha, polaroids sobre fórmica, timer de cocina, escarcha del freezer, letrero de neón y la
// caja registradora de tambores.
//
// Reglas de oficio que respetan TODAS:
//  · Movimiento subpíxel por CSS/SVG, determinista (rnd con hash entero: el farm rinde en chunks).
//  · Nada de <Video> (tirón en render). Sólo <Img>.
//  · El SONIDO no vive acá: la entrega sale del máster de MEZCLA, así que fxpack.mjs agenda los
//    efectos de cada componente (style.fx.compSfx) en la mezcla, alineados a estos mismos cuadros.
//    Los tiempos de impacto están en SFX_AT (segundos desde el arranque del componente).
//  · Fundido de entrada 6-8 cuadros y de salida 8-10: nunca un corte seco contra el plano de abajo.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadVT } from "@remotion/google-fonts/VT323";
import { loadFont as loadAlfa } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadYellowtail } from "@remotion/google-fonts/Yellowtail";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

const BEBAS = loadBebas().fontFamily;
const MONO = loadVT().fontFamily;
const SLAB = loadAlfa().fontFamily;
const SCRIPT = loadYellowtail().fontFamily;
const HAND = loadCaveat().fontFamily;
const ANTON = loadAnton().fontFamily;

const C = {
  ink: "#120E0B", red: "#C8102E", redDeep: "#8E0B20", cream: "#F4EAD5", paper: "#F7F1E3",
  chrome: "#D9DEE2", mustard: "#E8A317", gold: "#D98E2B", teal: "#2EC4B6", pink: "#FF3EA5",
  ice: "#CFEFFF", water: "#3AA0E0", starch: "#F2EEE4",
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

/** Momentos (en segundos desde el arranque) donde cada pieza tiene su golpe: fxpack los usa para el sonido. */
export const SFX_AT = {
  OrderTicket: { printer: 0.15, bell: "end-1.2" },
  Stamp86: { stamp: 0.3, boom: 0.3 },
  PotatoXRay: { pop: 0.8 },
  CrustMeter: { sizzle: 0.2, bell: "end-1.4" },
  SplitTest: { whoosh: 0.0, tick: 0.5, stamp: "end-1.8" },
  MenuBoard: { clack: 0.35 },
  BurnedQuote: { sizzle: 0.1 },
  ReceiptTimeline: { printer: 0.2 },
  KitchenTimer: { timer_wind: 0.1, timer_ding: "end-1.4" },
  FrostTimer: { ice: 0.2, timer_ding: "end-1.4" },
  NeonSign: { neon: 0.0 },
  CashCounter: { register: "end-1.6" },
} as const;

// ─── fondos ──────────────────────────────────────────────────────────────────────────────────
/** Foto de fondo (versión blureada horneada) con empuje lento y oscurecido: el componente nunca flota en negro. */
const FondoFoto: React.FC<{ src?: string; dark?: number; seed?: number; tint?: string }> = ({ src, dark = 0.55, seed = 1, tint }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const z = interpolate(f, [0, D], [1.08, 1.16], CL);
  const dx = (rnd(seed, 3) - 0.5) * 3 * interpolate(f, [0, D], [0, 1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      {src ? <Img src={staticFile(blurOf(src))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dx}%)` }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(18,14,11,${dark * 0.55}) 0%, rgba(18,14,11,${Math.min(0.95, dark + 0.25)}) 100%)` }} />
      {tint ? <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} /> : null}
    </AbsoluteFill>
  );
};

/** Grano analógico sutil (SVG turbulence estática por cuadro-par: se "mueve" sin costo de blur). */
const Grano: React.FC<{ o?: number }> = ({ o = 0.07 }) => {
  const f = useCurrentFrame();
  const s = Math.floor(f / 2) % 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%"><filter id={`gr${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={s} /></filter><rect width="100%" height="100%" filter={`url(#gr${s})`} /></svg>
    </AbsoluteFill>
  );
};

// ═══ 1) ORDER TICKET ═════════════════════════════════════════════════════════════════════════
/** Un ticket térmico sale de la impresora línea por línea, se clava en el riel de comandas y se balancea. */
export const OrderTicket: React.FC<{
  durationInFrames: number; lines: { text: string; note?: string }[]; title?: string; eyebrow?: string;
  footer?: string; image?: string; table?: string;
}> = ({ durationInFrames, lines, title = "ORDER", eyebrow, footer, image, table = "12" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const n = lines.length;
  // la impresión ocupa el 55 % del componente; cada renglón tiene su tramo
  const printEnd = Math.min(D * 0.55, 12 + n * 16);
  const lineAt = (i: number) => 8 + (i * (printEnd - 8)) / Math.max(1, n);
  const W = 640, headH = eyebrow ? 196 : 158, rowH = 74, footH = footer ? 96 : 34;
  const H = headH + rowH * n + footH;
  const fed = interpolate(f, [4, printEnd + 6], [110, H], { ...CL, easing: Easing.out(Easing.quad) });
  const pin = spring({ frame: f - printEnd - 4, fps, config: { damping: 9, stiffness: 140 } });
  const swing = f > printEnd ? Math.sin((f - printEnd) / 7) * 2.6 * Math.exp(-(f - printEnd) / 38) : 0;
  const ty = interpolate(pin, [0, 1], [70, 0]);
  const dust = f < printEnd ? Math.sin(f * 2.1) * 0.8 : 0;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.6} />
      {/* riel de comandas de acero */}
      <div style={{ position: "absolute", top: 118, left: 0, right: 0, height: 34, background: "linear-gradient(180deg,#F4F6F7 0%,#9AA3A8 45%,#5E676C 55%,#C9CFD2 100%)", boxShadow: "0 12px 30px rgba(0,0,0,0.55)" }} />
      {[0.12, 0.28, 0.72, 0.88].map((x, i) => (
        <div key={i} style={{ position: "absolute", top: 150, left: `${x * 100}%`, width: 120, height: 150 + (i % 2) * 30, marginLeft: -60, background: C.paper, opacity: 0.55, transform: `rotate(${(rnd(i, 4) - 0.5) * 6}deg)`, transformOrigin: "50% 0", boxShadow: "0 10px 20px rgba(0,0,0,0.4)", filter: "blur(1.5px)" }} />
      ))}
      <div style={{ position: "absolute", left: "50%", top: 126, width: W, marginLeft: -W / 2, transform: `translateY(${ty}px) scale(${Math.min(1.42, 900 / (H + 40))}) rotate(${swing + dust * 0.05}deg)`, transformOrigin: "50% 0" }}>
        {/* clip del riel */}
        <div style={{ position: "absolute", top: -14, left: W / 2 - 46, width: 92, height: 40, borderRadius: 6, background: "linear-gradient(180deg,#E9EDEF,#8A949A)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", zIndex: 3 }} />
        <div style={{ position: "relative", width: W, height: fed, overflow: "hidden", filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.6))" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.paper} 0%, #EFE6D2 100%)`, clipPath: `polygon(0 0,100% 0,100% calc(100% - 14px),${Array.from({ length: 33 }, (_, i) => `${100 - (i * 100) / 32}% ${i % 2 ? "100%" : "calc(100% - 14px)"}`).join(",")})` }} />
          <div style={{ position: "absolute", inset: 0, padding: "34px 44px", fontFamily: MONO, color: "#2A2522" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, letterSpacing: 2, opacity: 0.75 }}><span>LOU'S DINER</span><span>TBL {table}</span></div>
            {eyebrow ? <div style={{ fontSize: 28, marginTop: 6, color: C.red, letterSpacing: 3 }}>{eyebrow.toUpperCase()}</div> : null}
            <div style={{ fontFamily: BEBAS, fontSize: 64, lineHeight: 1, marginTop: 6, color: "#1C1714" }}>{title}</div>
            <div style={{ borderTop: "3px dashed rgba(42,37,34,0.45)", margin: "10px 0 6px" }} />
            {lines.map((l, i) => {
              const a = lineAt(i);
              const chars = Math.floor(interpolate(f, [a, a + 12], [0, l.text.length], CL));
              const chk = spring({ frame: f - a - 12, fps, config: { damping: 12, stiffness: 200 } });
              return (
                <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", gap: 18, opacity: f >= a ? 1 : 0 }}>
                  <div style={{ width: 44, height: 44, border: "3px solid #2A2522", borderRadius: 4, position: "relative", flexShrink: 0 }}>
                    <div style={{ position: "absolute", left: 6, top: -8, fontFamily: SLAB, fontSize: 46, color: C.red, transform: `scale(${chk}) rotate(-8deg)`, lineHeight: 1 }}>✓</div>
                  </div>
                  <div style={{ fontSize: 44, lineHeight: 1 }}>
                    {l.text.slice(0, chars)}
                    {l.note && chars >= l.text.length ? <span style={{ fontSize: 30, opacity: 0.6, marginLeft: 12 }}>{l.note}</span> : null}
                  </div>
                </div>
              );
            })}
            {footer ? <div style={{ marginTop: 14, fontFamily: HAND, fontSize: 52, color: C.red, transform: `rotate(-3deg)`, opacity: interpolate(f, [printEnd, printEnd + 10], [0, 1], CL) }}>{footer}</div> : null}
          </div>
        </div>
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 2) STAMP 86 ═════════════════════════════════════════════════════════════════════════════
/** La foto del error a pantalla completa; cae el sello rojo, la pantalla tiembla, la foto se apaga. */
export const Stamp86: React.FC<{ durationInFrames: number; image: string; stamp?: string; title: string; eyebrow?: string; sub?: string }> =
  ({ durationInFrames, image, stamp = "86'D", title, eyebrow, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D, 5, 10);
  const HIT = 9;
  const drop = interpolate(f, [2, HIT], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const settle = spring({ frame: f - HIT, fps, config: { damping: 7, stiffness: 260, mass: 0.6 } });
  const sc = f < HIT ? interpolate(drop, [0, 1], [2.6, 1]) : 1 + (1 - settle) * -0.08;
  const shake = f >= HIT && f < HIT + 8 ? (rnd(f, 1) - 0.5) * 26 * (1 - (f - HIT) / 8) : 0;
  const shakeY = f >= HIT && f < HIT + 8 ? (rnd(f, 2) - 0.5) * 18 * (1 - (f - HIT) / 8) : 0;
  const dead = interpolate(f, [HIT, HIT + 10], [0, 1], CL);
  const kb = interpolate(f, [0, D], [1.06, 1.14], CL);
  const bar = spring({ frame: f - HIT - 6, fps, config: { damping: 16 } });
  const splat = Array.from({ length: 18 }, (_, i) => ({ a: rnd(i, 7) * Math.PI * 2, r: 160 + rnd(i, 8) * 260, s: 6 + rnd(i, 9) * 22 }));
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translate(${shake}px,${shakeY}px)`, backgroundColor: C.ink, overflow: "hidden" }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})`, filter: `grayscale(${dead * 0.85}) brightness(${1 - dead * 0.35}) contrast(${1 + dead * 0.1})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.35 + dead * 0.3}) 100%)` }} />
      {f >= HIT ? splat.map((s, i) => {
        const k = interpolate(f, [HIT, HIT + 5], [0.3, 1], CL);
        return <div key={i} style={{ position: "absolute", left: `calc(50% + ${Math.cos(s.a) * s.r * k}px)`, top: `calc(44% + ${Math.sin(s.a) * s.r * 0.6 * k}px)`, width: s.s, height: s.s, borderRadius: "50%", background: C.red, opacity: 0.85 * dead }} />;
      }) : null}
      <div style={{ position: "absolute", left: "50%", top: "44%", transform: `translate(-50%,-50%) scale(${sc}) rotate(-11deg)`, opacity: interpolate(f, [2, 5], [0, 1], CL) }}>
        <svg width="0" height="0"><filter id="tinta"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={3} seed={4} /><feDisplacementMap in="SourceGraphic" scale="9" /><feComposite operator="in" in2="SourceGraphic" /></filter></svg>
        <div style={{ padding: "18px 56px", border: `12px solid ${C.red}`, borderRadius: 18, color: C.red, fontFamily: SLAB, fontSize: 190, lineHeight: 1, letterSpacing: 6, filter: "url(#tinta)", textShadow: "0 0 1px rgba(0,0,0,0.3)", mixBlendMode: "normal", boxShadow: f >= HIT ? "0 0 60px rgba(200,16,46,0.35)" : undefined }}>{stamp}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", justifyContent: "center", transform: `translateY(${(1 - bar) * 160}px)`, opacity: bar }}>
        <div style={{ background: C.red, padding: "18px 46px 14px", boxShadow: "0 18px 40px rgba(0,0,0,0.55)", textAlign: "center" }}>
          {eyebrow ? <div style={{ fontFamily: BEBAS, fontSize: 36, letterSpacing: 6, color: "#FFD8DE" }}>{eyebrow}</div> : null}
          <div style={{ fontFamily: BEBAS, fontSize: 88, lineHeight: 0.95, color: "#fff" }}>{title}</div>
          {sub ? <div style={{ fontFamily: MONO, fontSize: 38, color: "#FFE6EA", marginTop: 4 }}>{sub}</div> : null}
        </div>
      </div>
      <Grano o={0.1} />
    </AbsoluteFill>
  );
};

// ═══ 3) POTATO X-RAY ═════════════════════════════════════════════════════════════════════════
/** Corte de papa en rayos X con sus células. Modos: water (se llenan de agua hasta `value` %),
 *  glue (las células revientan y el almidón se estira en hilos), set / dry / firm (los 3 efectos del truco). */
export const PotatoXRay: React.FC<{ durationInFrames: number; mode: "water" | "glue" | "set" | "dry" | "firm"; label: string; value?: number; number?: string; eyebrow?: string }> =
  ({ durationInFrames, mode, label, value = 80, number, eyebrow }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const intro = spring({ frame: f - 2, fps, config: { damping: 14 } });
  const t = interpolate(f, [10, Math.max(20, D - 25)], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const cx = 1080, cy = 560, RX = 560, RY = 380;
  // células en grilla hexagonal recortada por la elipse de la papa
  const cells: { x: number; y: number; r: number; i: number }[] = [];
  let i = 0;
  for (let yy = -RY; yy <= RY; yy += 58) for (let xx = -RX; xx <= RX; xx += 64) {
    const x = xx + ((Math.round(yy / 58) % 2) ? 32 : 0) + (rnd(i, 1) - 0.5) * 10, y = yy + (rnd(i, 2) - 0.5) * 10;
    if ((x * x) / ((RX - 40) ** 2) + (y * y) / ((RY - 40) ** 2) < 1) cells.push({ x, y, r: 25 + rnd(i, 3) * 6, i });
    i++;
  }
  const fillLevel = mode === "water" ? t * (value / 100) : mode === "dry" ? 0.8 - t * 0.35 : 0.8;
  const waterY = RY - fillLevel * 2 * RY;
  const shake = mode === "firm" ? 0 : Math.sin(f / 3) * (mode === "glue" ? 1.2 : 0.4);
  const cellCol = (c: { x: number; y: number; i: number }) => {
    if (mode === "set") return `rgba(232,163,23,${0.25 + 0.6 * interpolate(t, [c.i / cells.length * 0.7, c.i / cells.length * 0.7 + 0.3], [0, 1], CL)})`;
    if (mode === "firm") return `rgba(207,239,255,${0.2 + 0.5 * t})`;
    return "rgba(242,238,228,0.18)";
  };
  const burst = (c: { i: number }) => mode === "glue" ? interpolate(t, [rnd(c.i, 5) * 0.6, rnd(c.i, 5) * 0.6 + 0.15], [0, 1], CL) : 0;
  const pct = Math.round(fillLevel * 100);
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 50% 45%, #1E2A33 0%, #0B1116 70%)" }}>
      {/* grilla de laboratorio */}
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(120,190,230,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,190,230,0.07) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="papa"><ellipse cx={cx} cy={cy} rx={RX} ry={RY} /></clipPath>
          <radialGradient id="piel" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#F5E7C4" stopOpacity="0.16" /><stop offset="100%" stopColor="#8A5A2B" stopOpacity="0.5" /></radialGradient>
          <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6FC3F5" stopOpacity="0.85" /><stop offset="100%" stopColor="#1C6FB0" stopOpacity="0.9" /></linearGradient>
          <filter id="brillo"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <g transform={`translate(${shake},0) scale(${0.85 + 0.15 * intro}) `} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <ellipse cx={cx} cy={cy} rx={RX + 18} ry={RY + 18} fill="none" stroke="#B07A3E" strokeWidth={14} opacity={0.9} />
          <ellipse cx={cx} cy={cy} rx={RX} ry={RY} fill="url(#piel)" />
          <g clipPath="url(#papa)">
            {mode === "water" || mode === "dry" ? (
              <g>
                <rect x={cx - RX} y={cy + waterY} width={RX * 2} height={RY * 2} fill="url(#agua)" opacity={0.55} />
                <path d={`M ${cx - RX} ${cy + waterY} ${Array.from({ length: 24 }, (_, k) => `Q ${cx - RX + (k + 0.5) * (RX / 12)} ${cy + waterY + Math.sin(f / 6 + k) * 10} ${cx - RX + (k + 1) * (RX / 12)} ${cy + waterY}`).join(" ")}`} stroke="#BFE6FF" strokeWidth={4} fill="none" />
              </g>
            ) : null}
            {cells.map((c) => {
              const b = burst(c);
              const under = (mode === "water" || mode === "dry") && c.y > waterY;
              return (
                <g key={c.i} transform={`translate(${cx + c.x},${cy + c.y})`}>
                  <circle r={c.r * (1 + b * 0.35)} fill={under ? "rgba(58,160,224,0.45)" : cellCol(c)} stroke={mode === "firm" ? "#E6F7FF" : "rgba(245,231,196,0.55)"} strokeWidth={2.5} opacity={1 - b * 0.8} strokeDasharray={b > 0.2 ? "6 8" : undefined} />
                  {mode === "set" ? <circle r={c.r * 0.35} fill="rgba(255,220,140,0.55)" /> : null}
                </g>
              );
            })}
            {mode === "glue" ? Array.from({ length: 26 }, (_, k) => {
              const a = cells[Math.floor(rnd(k, 11) * cells.length)], b2 = cells[Math.floor(rnd(k, 12) * cells.length)];
              if (!a || !b2) return null;
              const s = interpolate(t, [0.3 + rnd(k, 13) * 0.4, 0.55 + rnd(k, 13) * 0.4], [0, 1], CL);
              const mx = (a.x + b2.x) / 2, my = (a.y + b2.y) / 2 + Math.sin(f / 8 + k) * 30 + 40;
              return <path key={k} d={`M ${cx + a.x} ${cy + a.y} Q ${cx + mx} ${cy + my} ${cx + a.x + (b2.x - a.x) * s} ${cy + a.y + (b2.y - a.y) * s}`} stroke={C.starch} strokeWidth={5 - s * 2} fill="none" opacity={0.9} strokeLinecap="round" />;
            }) : null}
          </g>
          {/* gotas/vapor saliendo */}
          {(mode === "water" || mode === "dry" || mode === "glue") ? Array.from({ length: 16 }, (_, k) => {
            const per = 40 + rnd(k, 21) * 30, ph = ((f + rnd(k, 22) * per) % per) / per;
            const ang = -Math.PI / 2 + (rnd(k, 23) - 0.5) * 2.2;
            const r0 = 1.02, r1 = 1.45;
            const rr = r0 + (r1 - r0) * ph;
            const x = cx + Math.cos(ang) * RX * rr, y = cy + Math.sin(ang) * RY * rr;
            const isVapor = mode === "dry";
            return <circle key={k} cx={x} cy={y} r={isVapor ? 18 + ph * 30 : 7 + rnd(k, 24) * 5} fill={isVapor ? "rgba(255,255,255,0.18)" : "#7CCBFF"} opacity={(1 - ph) * (isVapor ? 1 : 0.9)} filter={isVapor ? "url(#brillo)" : undefined} />;
          }) : null}
          {mode === "firm" ? Array.from({ length: 30 }, (_, k) => {
            const a = rnd(k, 31) * Math.PI * 2, rr = 1.01 + rnd(k, 32) * 0.06;
            return <line key={k} x1={cx + Math.cos(a) * RX * rr} y1={cy + Math.sin(a) * RY * rr} x2={cx + Math.cos(a) * RX * (rr + 0.05 * t)} y2={cy + Math.sin(a) * RY * (rr + 0.05 * t)} stroke={C.ice} strokeWidth={3} opacity={t} />;
          }) : null}
        </g>
      </svg>
      {/* rótulos */}
      <div style={{ position: "absolute", left: 90, top: 80, display: "flex", alignItems: "center", gap: 26, transform: `translateX(${(1 - intro) * -80}px)`, opacity: intro }}>
        {number ? <div style={{ width: 118, height: 118, borderRadius: "50%", background: C.mustard, color: C.ink, fontFamily: ANTON, fontSize: 84, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(232,163,23,0.45)" }}>{number}</div> : null}
        <div>
          <div style={{ fontFamily: MONO, fontSize: 36, color: "#7FD1FF", letterSpacing: 4 }}>{eyebrow || "X-RAY · RUSSET POTATO"}</div>
          <div style={{ fontFamily: BEBAS, fontSize: 96, color: "#fff", lineHeight: 0.95, maxWidth: 820 }}>{label}</div>
        </div>
      </div>
      {mode === "water" ? (
        <div style={{ position: "absolute", right: 110, bottom: 90, textAlign: "right" }}>
          <div style={{ fontFamily: ANTON, fontSize: 210, color: "#8FD6FF", lineHeight: 0.9, textShadow: "0 0 50px rgba(58,160,224,0.6)" }}>{pct}%</div>
          <div style={{ fontFamily: BEBAS, fontSize: 52, color: "#DDF3FF", letterSpacing: 3 }}>WATER</div>
        </div>
      ) : null}
      <Grano o={0.06} />
    </AbsoluteFill>
  );
};

// ═══ 4) CRUST METER ══════════════════════════════════════════════════════════════════════════
/** Termómetro de corteza: la aguja sube de "pálida" a "bolsa de papel" mientras la foto se dora en vivo. */
export const CrustMeter: React.FC<{ durationInFrames: number; image: string; label?: string; target?: number; stops?: string[] }> =
  ({ durationInFrames, image, label = "Paper-bag brown", target = 0.82, stops = ["PALE", "GOLDEN", "PAPER BAG", "BURNT"] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const p = interpolate(f, [8, Math.max(20, D * 0.7)], [0, target], { ...CL, easing: Easing.out(Easing.cubic) });
  const done = spring({ frame: f - Math.max(20, D * 0.7), fps, config: { damping: 11 } });
  const kb = interpolate(f, [0, D], [1.05, 1.13], CL);
  const barH = 700;
  const needleY = barH * (1 - p);
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: C.ink }}>
      <AbsoluteFill style={{ left: "38%", overflow: "hidden" }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})`, filter: `saturate(${0.35 + p * 0.9}) brightness(${1.18 - p * 0.28}) sepia(${0.05 + p * 0.25}) contrast(${0.92 + p * 0.18})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(18,14,11,1) 0%, rgba(18,14,11,0) 22%)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 190, width: 90, height: barH, borderRadius: 45, background: "linear-gradient(180deg,#2A1406 0%,#6B3A12 25%,#B8742C 50%,#E0B45A 75%,#F3E7C0 100%)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.18), 0 20px 50px rgba(0,0,0,0.6)" }} />
      {stops.map((s, i) => {
        const y = 190 + barH * (1 - (i + 0.5) / stops.length);
        return <div key={s} style={{ position: "absolute", left: 260, top: y - 22, fontFamily: BEBAS, fontSize: 44, color: "rgba(255,255,255,0.55)", letterSpacing: 3 }}>{s}</div>;
      })}
      <div style={{ position: "absolute", left: 110, top: 190 + needleY - 14, width: 150, height: 28, borderRadius: 14, background: "#fff", boxShadow: "0 0 30px rgba(255,220,150,0.8)" }} />
      <div style={{ position: "absolute", left: 120, top: 70, fontFamily: MONO, fontSize: 38, color: C.mustard, letterSpacing: 4 }}>CRUST CHECK</div>
      <div style={{ position: "absolute", right: 90, bottom: 110, transform: `scale(${0.6 + 0.4 * done}) rotate(-6deg)`, opacity: done, background: C.cream, color: C.ink, padding: "18px 38px", fontFamily: BEBAS, fontSize: 84, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", borderLeft: `14px solid ${C.gold}` }}>{label}</div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 5) SPLIT TEST ═══════════════════════════════════════════════════════════════════════════
/** Pantalla dividida: dos fotos, cronómetros corriendo y un ganador que se enciende. */
export const SplitTest: React.FC<{
  durationInFrames: number; left: { image: string; label: string; sub?: string }; right: { image: string; label: string; sub?: string };
  winner?: "left" | "right"; timer?: boolean; timerTo?: number; title?: string;
}> = ({ durationInFrames, left, right, winner = "right", timer = true, timerTo = 360, title }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const open = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  const judge = Math.max(24, D - 55);
  const w = spring({ frame: f - judge, fps, config: { damping: 12 } });
  const secs = Math.floor(interpolate(f, [8, judge], [0, timerTo], { ...CL, easing: Easing.in(Easing.quad) }));
  const clock = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const side = (s: typeof left, isL: boolean) => {
    const win = (winner === "left") === isL;
    const kb = interpolate(f, [0, D], [1.06, 1.15], CL);
    return (
      <div style={{ position: "absolute", top: 0, bottom: 0, left: isL ? 0 : "50%", width: "50%", overflow: "hidden", transform: `translateX(${(1 - open) * (isL ? -100 : 100)}%)` }}>
        <Img src={staticFile(s.image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})`, filter: win ? `brightness(${1 + w * 0.12}) saturate(${1 + w * 0.2})` : `grayscale(${w * 0.9}) brightness(${1 - w * 0.4})` }} />
        {!win && timer ? Array.from({ length: 9 }, (_, k) => {
          const per = 50 + rnd(k, 3) * 30, ph = ((f + rnd(k, 4) * per) % per) / per;
          return <div key={k} style={{ position: "absolute", left: `${25 + rnd(k, 5) * 50}%`, top: `${75 - ph * 60}%`, width: 200 + ph * 200, height: 200 + ph * 200, marginLeft: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 65%)", opacity: Math.sin(ph * Math.PI) * 0.7 * (1 - w), filter: "blur(8px)" }} />;
        }) : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center" }}>
          <div style={{ display: "inline-block", background: win && w > 0.5 ? C.mustard : "rgba(18,14,11,0.82)", color: win && w > 0.5 ? C.ink : "#fff", padding: "12px 30px 8px", fontFamily: BEBAS, fontSize: 64, lineHeight: 1 }}>{s.label}</div>
          {s.sub ? <div style={{ fontFamily: MONO, fontSize: 36, color: "#fff", marginTop: 8, textShadow: "0 2px 8px #000" }}>{s.sub}</div> : null}
        </div>
        {timer ? (
          <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", background: "#0B0B0B", border: "4px solid #333", borderRadius: 14, padding: "4px 24px", fontFamily: MONO, fontSize: 96, color: win ? "#7CFF8A" : "#FF6B6B", textShadow: `0 0 18px ${win ? "rgba(124,255,138,0.8)" : "rgba(255,107,107,0.8)"}` }}>{clock}</div>
        ) : null}
        {win && w > 0.02 ? (
          <div style={{ position: "absolute", top: "38%", left: "50%", transform: `translate(-50%,-50%) scale(${2 - w}) rotate(-9deg)`, opacity: w, border: `10px solid ${C.mustard}`, color: C.mustard, fontFamily: SLAB, fontSize: 110, padding: "6px 34px", borderRadius: 14, textShadow: "0 4px 18px rgba(0,0,0,0.6)", background: "rgba(18,14,11,0.35)" }}>WINNER</div>
        ) : null}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: C.ink }}>
      {side(left, true)}
      {side(right, false)}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 10, marginLeft: -5, background: `linear-gradient(180deg, ${C.chrome}, #7E878C)`, transform: `scaleY(${open})`, boxShadow: "0 0 30px rgba(0,0,0,0.8)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%) scale(${open})`, width: 150, height: 150, borderRadius: "50%", background: C.red, color: "#fff", fontFamily: ANTON, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", border: `6px solid ${C.chrome}` }}>VS</div>
      {title ? <div style={{ position: "absolute", top: 22, left: 0, right: 0, textAlign: "center", fontFamily: BEBAS, fontSize: 40, color: "rgba(255,255,255,0.8)", letterSpacing: 6, opacity: timer ? 0 : 1 }}>{title}</div> : null}
    </AbsoluteFill>
  );
};

// ═══ 6) MENU BOARD ═══════════════════════════════════════════════════════════════════════════
/** Tablero de fieltro negro con letras blancas que caen una por una (clac), foto del pedido al costado. */
export const MenuBoard: React.FC<{ durationInFrames: number; rows: { text: string; image?: string; mark?: "yes" | "no" }[]; title?: string }> =
  ({ durationInFrames, rows, title = "THE MENU" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const per = Math.max(10, Math.min(26, (D * 0.65) / Math.max(1, rows.length)));
  const cur = Math.min(rows.length - 1, Math.floor(Math.max(0, f - 8) / per));
  const hasImg = rows.some((r) => r.image);
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 50% 40%, #3A0D12 0%, #120407 80%)" }}>
      <div style={{ position: "absolute", left: hasImg ? 90 : 210, top: 110, width: hasImg ? 1060 : 1500, height: 860, borderRadius: 18, border: "22px solid #6E4A2E", background: "#141214", boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 0 60px rgba(0,0,0,0.9)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 3px, transparent 3px, transparent 26px)" }} />
        <div style={{ position: "absolute", top: 30, left: 0, right: 0, textAlign: "center", fontFamily: SCRIPT, fontSize: 78, color: C.pink, textShadow: `0 0 12px ${C.pink}, 0 0 30px rgba(255,62,165,0.6)` }}>{title}</div>
        {rows.map((r, ri) => {
          const a = 8 + ri * per;
          const letters = r.text.toUpperCase().split("");
          return (
            <div key={ri} style={{ position: "absolute", left: 60, right: 60, top: 170 + ri * (620 / Math.max(rows.length, 3)), display: "flex", alignItems: "center", gap: 2 }}>
              {letters.map((ch, li) => {
                const la = a + li * Math.max(0.6, Math.min(1.6, (per * 0.6) / letters.length));
                const s = spring({ frame: f - la, fps, config: { damping: 10, stiffness: 260, mass: 0.5 } });
                const rot = (rnd(ri * 97 + li, 3) - 0.5) * 7;
                return <span key={li} style={{ display: "inline-block", width: ch === " " ? 26 : undefined, fontFamily: BEBAS, fontSize: 82, color: "#F2F0EA", transform: `translateY(${(1 - s) * -60}px) rotate(${rot * (1 - s * 0.6)}deg)`, opacity: f >= la ? 1 : 0, textShadow: "0 3px 0 rgba(0,0,0,0.6)", letterSpacing: 2 }}>{ch}</span>;
              })}
              {r.mark && f > a + per * 0.8 ? <span style={{ marginLeft: 26, fontFamily: SLAB, fontSize: 70, color: r.mark === "yes" ? "#7CFF8A" : "#FF5A5A", transform: `scale(${spring({ frame: f - a - per * 0.8, fps, config: { damping: 9 } })})`, display: "inline-block" }}>{r.mark === "yes" ? "✓" : "✗"}</span> : null}
            </div>
          );
        })}
      </div>
      {hasImg ? rows.map((r, ri) => {
        if (!r.image) return null;
        const a = 8 + ri * per;
        const vis = ri === cur ? 1 : 0;
        const s = spring({ frame: f - a, fps, config: { damping: 14 } });
        return (
          <div key={ri} style={{ position: "absolute", right: 90, top: 190, width: 620, padding: "22px 22px 90px", background: "#FAF7F0", transform: `translateX(${(1 - s) * 400}px) rotate(${(rnd(ri, 8) - 0.5) * 8}deg)`, opacity: vis * s, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <Img src={staticFile(r.image)} style={{ width: "100%", height: 460, objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 56, color: "#222" }}>{r.text}</div>
          </div>
        );
      }) : null}
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 7) BURNED QUOTE ═════════════════════════════════════════════════════════════════════════
/** La frase se marca a fuego en el acero: cada palabra entra al rojo vivo, se enfría a quemado, con
 *  distorsión de calor y brasas subiendo. */
export const BurnedQuote: React.FC<{ durationInFrames: number; words: { text: string; em?: boolean }[]; cite?: string; image?: string; eyebrow?: string }> =
  ({ durationInFrames, words, cite, image, eyebrow }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const per = Math.max(3, Math.min(8, (D * 0.5) / Math.max(1, words.length)));
  const seedT = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#16110E" }}>
      <FondoFoto src={image} dark={0.62} tint="rgba(90,50,20,0.3)" />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 7px)", mixBlendMode: "overlay" }} />
      <svg width="0" height="0">
        <filter id="calor"><feTurbulence type="turbulence" baseFrequency={`0.012 ${0.03 + (seedT % 5) * 0.002}`} numOctaves={2} seed={seedT % 9} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={7} /></filter>
      </svg>
      <div style={{ position: "absolute", left: 140, right: 140, top: 0, bottom: 0, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: "10px 30px", filter: "url(#calor)" }}>
        {eyebrow ? <div style={{ width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 38, letterSpacing: 6, color: "rgba(255,190,120,0.75)", marginBottom: 20 }}>{eyebrow}</div> : null}
        {words.map((w, i) => {
          const a = 6 + i * per;
          const hot = interpolate(f, [a, a + 3, a + 26], [0, 1, 0], CL);
          const vis = interpolate(f, [a, a + 3], [0, 1], CL);
          const s = spring({ frame: f - a, fps, config: { damping: 12, stiffness: 220 } });
          const cold = w.em ? "#FFD08A" : "#F2B866";  // se asienta como hierro todavía caliente: ámbar legible, borde carbonizado
          return (
            <span key={i} style={{ fontFamily: SLAB, fontSize: w.em ? 150 : 120, lineHeight: 1.05, opacity: vis, transform: `scale(${0.8 + 0.2 * s})`, display: "inline-block",
              color: hot > 0.05 ? `rgb(${255},${Math.round(120 + 110 * hot)},${Math.round(40 + 120 * hot)})` : cold,
              WebkitTextStroke: `2px rgba(${Math.round(70 + 185 * hot)},${Math.round(22 + 150 * hot)},6,0.95)`,
              textShadow: `0 0 ${14 + 50 * hot}px rgba(255,120,20,${0.45 + 0.45 * hot}), 0 0 ${4 + 10 * hot}px rgba(255,230,160,${0.25 + 0.75 * hot}), 0 4px 0 rgba(40,12,2,0.9)` }}>{w.text}</span>
          );
        })}
        {cite ? <div style={{ width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 64, color: "#F1C27D", marginTop: 26, opacity: interpolate(f, [6 + words.length * per, 16 + words.length * per], [0, 1], CL) }}>— {cite}</div> : null}
      </div>
      {Array.from({ length: 26 }, (_, k) => {
        const per2 = 55 + rnd(k, 3) * 45, ph = ((f + rnd(k, 4) * per2) % per2) / per2;
        return <div key={k} style={{ position: "absolute", left: `${10 + rnd(k, 5) * 80}%`, top: `${95 - ph * 80}%`, width: 5 + rnd(k, 6) * 5, height: 5 + rnd(k, 6) * 5, borderRadius: "50%", background: "#FFB347", boxShadow: "0 0 12px 4px rgba(255,140,40,0.8)", opacity: Math.sin(ph * Math.PI) * 0.9, transform: `translateX(${Math.sin(f / 9 + k) * 18}px)` }} />;
      })}
      <Grano o={0.09} />
    </AbsoluteFill>
  );
};

// ═══ 8) RECEIPT TIMELINE (polaroids sobre fórmica) ═══════════════════════════════════════════
export const ReceiptTimeline: React.FC<{ durationInFrames: number; events: { year: string; label: string; image?: string }[]; title?: string; eyebrow?: string }> =
  ({ durationInFrames, events, title, eyebrow }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const n = events.length;
  const per = Math.max(10, Math.min(30, (D * 0.6) / Math.max(1, n)));
  const line = interpolate(f, [4, 8 + n * per], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#B91C2B" }}>
      {/* fórmica roja con el patrón "boomerang" de los 50 */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.10) 0 3px, transparent 4px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.12) 0 2px, transparent 3px), radial-gradient(circle at 40% 80%, rgba(255,220,180,0.10) 0 2px, transparent 3px)", backgroundSize: "140px 120px, 90px 110px, 170px 150px" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 640, height: 6, background: C.cream, transformOrigin: "0 50%", transform: `scaleX(${line})`, boxShadow: "0 2px 10px rgba(0,0,0,0.4)" }} />
      {(eyebrow || title) ? <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
        {eyebrow ? <div style={{ fontFamily: MONO, fontSize: 40, color: C.cream, letterSpacing: 6 }}>{eyebrow}</div> : null}
        {title ? <div style={{ fontFamily: SCRIPT, fontSize: 96, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.5)" }}>{title}</div> : null}
      </div> : null}
      {events.map((e, i) => {
        const a = 8 + i * per;
        const s = spring({ frame: f - a, fps, config: { damping: 11, stiffness: 150 } });
        const dev = interpolate(f, [a + 4, a + 30], [0, 1], CL);
        const x = 120 + ((i + 0.5) * (1680 / n)) - 230;
        const rot = (rnd(i, 3) - 0.5) * 14;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 200, width: 460, transform: `translateY(${(1 - s) * -700}px) rotate(${rot * s}deg) scale(${1 + (1 - s) * 0.3})`, opacity: f >= a ? 1 : 0 }}>
            <div style={{ background: "#FBF8F1", padding: "22px 22px 100px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
              <div style={{ width: "100%", height: 340, background: "#3A3530", overflow: "hidden" }}>
                {e.image ? <Img src={staticFile(e.image)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.4 + dev * 0.6}) contrast(${0.6 + dev * 0.45}) saturate(${dev}) sepia(${0.35 - dev * 0.2})`, opacity: 0.25 + dev * 0.75 }} /> : null}
              </div>
              <div style={{ position: "absolute", bottom: 22, left: 26, right: 26 }}>
                <div style={{ fontFamily: HAND, fontSize: 60, color: "#1D1A17", lineHeight: 1 }}>{e.year}</div>
                <div style={{ fontFamily: HAND, fontSize: 38, color: "#3C3631", lineHeight: 1.05 }}>{e.label}</div>
              </div>
            </div>
            <div style={{ position: "absolute", top: -18, left: "50%", marginLeft: -60, width: 120, height: 40, background: "rgba(245,235,200,0.75)", transform: `rotate(${-rot / 2}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
          </div>
        );
      })}
      <Grano o={0.1} />
    </AbsoluteFill>
  );
};

// ═══ 9) KITCHEN TIMER ════════════════════════════════════════════════════════════════════════
/** Timer de cocina cromado: la perilla gira hasta el valor, tiembla al sonar. */
export const KitchenTimer: React.FC<{ durationInFrames: number; value: number; from?: number; unit?: string; label: string; image?: string; max?: number }> =
  ({ durationInFrames, value, from, unit = "MIN", label, image, max = 60 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const s = spring({ frame: f - 4, fps, config: { damping: 18, stiffness: 60, mass: 1.2 } });
  const v = (from ?? 0) + (value - (from ?? 0)) * s;
  const ring = f > D - 42 && f < D - 16 ? Math.sin(f * 2.3) * 4 : 0;
  const ang = (v / max) * 360;
  const R = 330;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.62} />
      <div style={{ position: "absolute", left: 250, top: 540, width: R * 2, height: R * 2, marginTop: -R, transform: `rotate(${ring}deg)` }}>
        <div style={{ position: "absolute", inset: -24, borderRadius: "50%", background: "linear-gradient(145deg,#F4F7F8,#8F989D 45%,#E6EAEC 60%,#6F787D)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFDF6 0%, #EFE7D6 70%, #D8CDB5 100%)" }} />
        <svg width={R * 2} height={R * 2} style={{ position: "absolute", inset: 0, transform: `rotate(${-ang}deg)` }}>
          {Array.from({ length: 60 }, (_, k) => {
            const a = (k / 60) * Math.PI * 2 - Math.PI / 2;
            const big = k % 5 === 0;
            return <line key={k} x1={R + Math.cos(a) * (R - 18)} y1={R + Math.sin(a) * (R - 18)} x2={R + Math.cos(a) * (R - (big ? 58 : 36))} y2={R + Math.sin(a) * (R - (big ? 58 : 36))} stroke={big ? C.red : "#4A4540"} strokeWidth={big ? 7 : 3} />;
          })}
          {Array.from({ length: 12 }, (_, k) => {
            const a = (k / 12) * Math.PI * 2 - Math.PI / 2;
            return <text key={k} x={R + Math.cos(a) * (R - 100)} y={R + Math.sin(a) * (R - 100) + 20} fontFamily={BEBAS} fontSize={58} fill="#2A2522" textAnchor="middle">{Math.round((k * max) / 12)}</text>;
          })}
        </svg>
        <div style={{ position: "absolute", left: R - 16, top: 6, width: 32, height: 80, background: C.red, borderRadius: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: R - 90, top: R - 90, width: 180, height: 180, borderRadius: "50%", background: "linear-gradient(145deg,#FFFFFF,#9CA5AA)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }} />
      </div>
      <div style={{ position: "absolute", right: 150, top: 300, textAlign: "left", width: 820 }}>
        <div style={{ fontFamily: ANTON, fontSize: 250, color: "#fff", lineHeight: 0.9, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>{Math.round(v)}<span style={{ fontFamily: BEBAS, fontSize: 110, color: C.mustard, marginLeft: 18 }}>{unit}</span></div>
        <div style={{ fontFamily: BEBAS, fontSize: 84, color: C.cream, lineHeight: 1, marginTop: 10 }}>{label}</div>
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 10) FROST TIMER ═════════════════════════════════════════════════════════════════════════
/** La escarcha crece desde los bordes (cristales ramificados) y el número se congela. */
export const FrostTimer: React.FC<{ durationInFrames: number; value: number; unit?: string; label: string; image?: string }> =
  ({ durationInFrames, value, unit = "MIN", label, image }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const g = interpolate(f, [0, D * 0.7], [0, 1], { ...CL, easing: Easing.out(Easing.quad) });
  const s = spring({ frame: f - 6, fps, config: { damping: 14 } });
  const v = Math.round(interpolate(f, [6, D * 0.55], [0, value], { ...CL, easing: Easing.out(Easing.cubic) }));
  // cristales: ramas deterministas que nacen de los bordes
  const ramas: React.ReactNode[] = [];
  const rama = (x: number, y: number, a: number, len: number, depth: number, id: string) => {
    if (depth > 3 || len < 12) return;
    const grow = interpolate(g, [depth * 0.15, depth * 0.15 + 0.45], [0, 1], CL);
    const x2 = x + Math.cos(a) * len * grow, y2 = y + Math.sin(a) * len * grow;
    ramas.push(<line key={id} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(235,250,255,0.85)" strokeWidth={4 - depth} strokeLinecap="round" />);
    if (grow > 0.5) { rama(x2, y2, a - 0.6, len * 0.62, depth + 1, id + "a"); rama(x2, y2, a + 0.6, len * 0.62, depth + 1, id + "b"); }
  };
  for (let k = 0; k < 22; k++) {
    const edge = k % 4;
    const p = rnd(k, 1);
    const [x, y, a] = edge === 0 ? [p * width, 0, Math.PI / 2] : edge === 1 ? [p * width, height, -Math.PI / 2] : edge === 2 ? [0, p * height, 0] : [width, p * height, Math.PI];
    rama(x, y, a + (rnd(k, 2) - 0.5) * 0.8, 120 + rnd(k, 3) * 140, 0, "r" + k);
  }
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.5} tint="rgba(120,180,230,0.55)" />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(220,245,255,0) ${60 - g * 25}%, rgba(220,245,255,${0.55 * g}) 100%)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }}>{ramas}</svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.85 + 0.15 * s})` }}>
        <div style={{ fontFamily: MONO, fontSize: 44, letterSpacing: 8, color: "#E8F8FF" }}>FROM THE FREEZER</div>
        <div style={{ fontFamily: ANTON, fontSize: 300, lineHeight: 0.95, color: "#F2FBFF", textShadow: "0 0 30px rgba(170,225,255,0.9), 0 12px 40px rgba(0,40,80,0.6)", WebkitTextStroke: "3px rgba(160,220,255,0.8)" }}>{v}<span style={{ fontFamily: BEBAS, fontSize: 130, marginLeft: 20 }}>{unit}</span></div>
        <div style={{ fontFamily: BEBAS, fontSize: 82, color: "#fff", textShadow: "0 4px 16px rgba(0,40,80,0.6)" }}>{label}</div>
      </div>
      <Grano o={0.06} />
    </AbsoluteFill>
  );
};

// ═══ 11) NEON SIGN (OVERLAY) ═════════════════════════════════════════════════════════════════
/** Letrero de neón de capítulo, arriba a la IZQUIERDA (lejos de la cara de Lou): parpadea al encender. */
export const NeonSign: React.FC<{ durationInFrames: number; text: string; sub?: string; color?: "pink" | "teal" | "amber" }> = ({ durationInFrames, text, sub, color = "pink" }) => {
  const f = useCurrentFrame();
  const D = Math.max(30, durationInFrames);
  const col = color === "teal" ? C.teal : color === "amber" ? "#FFB23F" : C.pink;
  const on = [[0, 2], [5, 7], [10, 13], [16, 999]].some(([a, b]) => f >= a && f < b) ? 1 : 0.12;
  const flick = f > 20 && rnd(Math.floor(f / 3), 5) < 0.04 ? 0.55 : 1;
  const out = interpolate(f, [D - 10, D], [1, 0], CL);
  const glow = on * flick;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", left: 70, top: 60, padding: "26px 46px 30px", borderRadius: 26, background: "rgba(10,8,12,0.72)", border: "3px solid rgba(255,255,255,0.08)", boxShadow: `0 0 ${60 * glow}px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.8)` }}>
        {sub ? <div style={{ fontFamily: BEBAS, fontSize: 38, letterSpacing: 10, color: glow > 0.5 ? "#FFE9F5" : "rgba(255,255,255,0.25)", textShadow: glow > 0.5 ? `0 0 10px ${col}` : "none" }}>{sub}</div> : null}
        <div style={{ fontFamily: SCRIPT, fontSize: 104, lineHeight: 1, color: glow > 0.5 ? "#FFF5FB" : "rgba(255,255,255,0.18)", textShadow: glow > 0.5 ? `0 0 6px #fff, 0 0 14px ${col}, 0 0 30px ${col}, 0 0 60px ${col}, 0 0 90px ${col}` : "none", WebkitTextStroke: glow > 0.5 ? undefined : `1px ${col}` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 12) CASH COUNTER ════════════════════════════════════════════════════════════════════════
/** Visor de caja registradora con tambores de dígitos que giran hasta el número. */
export const CashCounter: React.FC<{ durationInFrames: number; to: number; label: string; caption?: string; prefix?: string; image?: string }> =
  ({ durationInFrames, to, label, caption, prefix = "", image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(30, durationInFrames);
  const op = fadeIO(f, D);
  const s = spring({ frame: f - 4, fps, config: { damping: 30, stiffness: 28, mass: 1.4 } });
  const val = to * s;
  const digits = String(Math.round(to)).length;
  const done = spring({ frame: f - Math.max(20, D - 48), fps, config: { damping: 10 } });
  const col = (place: number) => {
    const d = (val / 10 ** place) % 10;
    return d;
  };
  const CH = 150;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.65} />
      <div style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)", padding: "40px 50px 50px", borderRadius: 30, background: "linear-gradient(160deg,#F6F8F9 0%,#A7B0B5 30%,#E9EDEF 52%,#7A8388 100%)", boxShadow: "0 40px 90px rgba(0,0,0,0.7)" }}>
        <div style={{ fontFamily: BEBAS, fontSize: 40, color: "#3B3F42", letterSpacing: 8, textAlign: "center", marginBottom: 14 }}>LOU'S DINER · TOTAL</div>
        <div style={{ display: "flex", gap: 10, background: "#0E120E", padding: "18px 22px", borderRadius: 12, boxShadow: "inset 0 0 30px rgba(0,0,0,0.9)" }}>
          {prefix ? <div style={{ fontFamily: MONO, fontSize: CH, color: "#9CFFA8", lineHeight: 1 }}>{prefix}</div> : null}
          {Array.from({ length: digits }, (_, k) => {
            const place = digits - 1 - k;
            const d = col(place);
            const sep = place > 0 && place % 3 === 0;
            return (
              <React.Fragment key={k}>
                <div style={{ width: 96, height: CH, overflow: "hidden", position: "relative", background: "linear-gradient(180deg,#050805 0%,#172017 50%,#050805 100%)", borderRadius: 6 }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: -d * CH }}>
                    {Array.from({ length: 11 }, (_, j) => <div key={j} style={{ height: CH, fontFamily: MONO, fontSize: CH * 1.05, lineHeight: `${CH}px`, textAlign: "center", color: "#9CFFA8", textShadow: "0 0 18px rgba(124,255,138,0.8)" }}>{j % 10}</div>)}
                  </div>
                </div>
                {sep ? <div style={{ fontFamily: MONO, fontSize: CH * 0.8, color: "#9CFFA8", alignSelf: "flex-end" }}>,</div> : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ fontFamily: BEBAS, fontSize: 72, color: "#1D2124", textAlign: "center", marginTop: 20, lineHeight: 1 }}>{label}</div>
        {caption ? <div style={{ fontFamily: HAND, fontSize: 52, color: C.red, textAlign: "center", transform: `scale(${done}) rotate(-4deg)`, opacity: done }}>{caption}</div> : null}
      </div>
      <Grano />
    </AbsoluteFill>
  );
};
