// HarlanLine.tsx — KIT DEL LINIERO (canal Harlan the Lineman). Piezas hechas a mano en código,
// todas del mismo mundo: la red eléctrica de un pueblo de Ohio en invierno, vista por un liniero
// jubilado. Pueblo que se apaga en cascada, tablero de térmicas, pantalla de despacho, pico de
// corriente al reconectar, relojes de la heladera, moneda en el vaso de hielo, distancia del
// generador, alarma de monóxido, backfeed que sube a 7.200 V, potencial de paso, tarjeta de regla
// con cinta de peligro, sello sobre foto, plano de la casa que se enfría, tablilla de repaso y
// sello de fecha de cámara.
//
// Reglas de oficio (las mismas del kit del diner):
//  · Movimiento subpíxel por CSS/SVG, determinista (rnd con hash entero: el farm rinde en chunks).
//  · Nada de <Video>. Sólo <Img> (y siempre la versión _blur de fondo: la hornea 60_build).
//  · El SONIDO no vive acá: fxpack agenda style.fx.compSfx en la mezcla, alineado a SFX_AT.
//  · Fundido de entrada 6-8 cuadros y de salida 8-10: nunca un corte seco.
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
  ink: "#0A0C0E", night: "#0E1620", steel: "#8E989F", panel: "#B9C0C4", paper: "#F3EEE2",
  hivis: "#F5C400", orange: "#FF6A13", red: "#E0301E", redDeep: "#8C160C", ice: "#BFE3FF",
  cold: "#6FB2E8", warm: "#FFB347", window: "#FFD27A", green: "#58F08A", white: "#F4F6F7",
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
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Golpes de cada pieza (segundos desde el arranque): referencia para style.fx.compSfx. */
export const SFX_AT = {
  GridDown: { apagon: 0.6, hum_off: 0.5 },
  BreakerPanel: { clack: "trip", clack2: "reset" },
  DispatchBoard: { beep: 0.4 },
  LoadSurge: { hum: 0.2, boom: "spike" },
  FridgeClock: { tape: 0.4, tick: 0.8 },
  CoinCup: { ice: 0.2, coin: 1.0 },
  GenDistance: { gen: 0.2, whoosh: 1.0 },
  COAlarm: { alarm: 1.2 },
  BackfeedFlow: { zap: "end-1.2" },
  StepPotential: { zap: 0.3 },
  RuleCard: { stamp: 0.25, boom: 0.25 },
  HazardStamp: { stamp: 0.3 },
  RoomHeat: { wind: 0.0 },
  RecapClipboard: { clack: 0.3 },
  CamStamp: {},
} as const;

// ─── fondos y texturas ───────────────────────────────────────────────────────────────────────
const FondoFoto: React.FC<{ src?: string; dark?: number; seed?: number; tint?: string }> = ({ src, dark = 0.6, seed = 1, tint }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const z = interpolate(f, [0, D], [1.08, 1.16], CL);
  const dx = (rnd(seed, 3) - 0.5) * 3 * interpolate(f, [0, D], [0, 1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      {src ? <Img src={staticFile(blurOf(src))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dx}%)` }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(10,12,14,${dark * 0.55}) 0%, rgba(10,12,14,${Math.min(0.96, dark + 0.25)}) 100%)` }} />
      {tint ? <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} /> : null}
    </AbsoluteFill>
  );
};

const Grano: React.FC<{ o?: number }> = ({ o = 0.07 }) => {
  const f = useCurrentFrame();
  const s = Math.floor(f / 2) % 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%"><filter id={`hg${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={s} /></filter><rect width="100%" height="100%" filter={`url(#hg${s})`} /></svg>
    </AbsoluteFill>
  );
};

/** Nieve cayendo (determinista). */
const Nieve: React.FC<{ n?: number; o?: number }> = ({ n = 70, o = 0.7 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const x = rnd(i, 1) * 1920 + Math.sin((f + i * 13) / 22) * 18;
        const sp = 1.4 + rnd(i, 2) * 2.6;
        const y = ((rnd(i, 3) * 1180 + f * sp) % 1180) - 50;
        const r = 1.5 + rnd(i, 4) * 3.5;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#fff", opacity: 0.35 + rnd(i, 5) * 0.5, filter: r > 4 ? "blur(1px)" : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

/** Cinta de peligro amarilla y negra. */
const Cinta: React.FC<{ top: number; rot?: number; off?: number; h?: number }> = ({ top, rot = -2, off = 0, h = 46 }) => (
  <div style={{ position: "absolute", left: -60, right: -60, top, height: h, transform: `rotate(${rot}deg)`, background: `repeating-linear-gradient(-45deg, ${C.hivis} 0 40px, #111 40px 80px)`, backgroundPosition: `${off}px 0`, boxShadow: "0 8px 22px rgba(0,0,0,0.55)" }} />
);

const Eyebrow: React.FC<{ text?: string; color?: string; op?: number }> = ({ text, color = C.hivis, op = 1 }) =>
  text ? <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 30, letterSpacing: 8, color, opacity: op, textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{text}</div> : null;

// ═══ 1) GRID DOWN ════════════════════════════════════════════════════════════════════════════
/** Un pueblo de noche visto desde arriba: las ventanas se apagan en ola desde la subestación y un contador sube. */
export const GridDown: React.FC<{ durationInFrames: number; to?: number; label?: string; eyebrow?: string; image?: string }> =
  ({ durationInFrames, to = 50000000, label = "WITHOUT POWER", eyebrow, image }) => {
  const f = useCurrentFrame();
  const D = Math.max(45, durationInFrames);
  const op = fadeIO(f, D);
  const cols = 22, rows = 9;
  const ox = 1920 * 0.18, oy = 1080 * 0.78;      // subestación: de ahí parte la ola
  const t0 = 14, wave = Math.min(D * 0.5, 70);
  const cnt = interpolate(f, [t0, t0 + wave + 10], [0, to], { ...CL, easing: Easing.in(Easing.quad) });
  const flick = f > t0 - 4 && f < t0 + 3 ? (f % 2 ? 0.3 : 1) : 1;
  const shake = f > t0 && f < t0 + 8 ? Math.sin(f * 3.3) * (8 - (f - t0)) * 0.9 : 0;
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "#05070A", transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      {image ? <FondoFoto src={image} dark={0.78} /> : null}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="glw"><stop offset="0" stopColor={C.window} stopOpacity="0.9" /><stop offset="1" stopColor={C.window} stopOpacity="0" /></radialGradient>
        </defs>
        {/* calles */}
        {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" x2="1920" y1={180 + i * 190} y2={160 + i * 190} stroke="#1E2A36" strokeWidth="14" />)}
        {Array.from({ length: 7 }, (_, i) => <line key={`v${i}`} y1="0" y2="1080" x1={120 + i * 290} x2={140 + i * 290} stroke="#1E2A36" strokeWidth="14" />)}
        {Array.from({ length: cols * rows }, (_, k) => {
          const c = k % cols, r = Math.floor(k / cols);
          const x = 60 + c * 84 + rnd(k, 1) * 26, y = 90 + r * 104 + rnd(k, 2) * 30;
          const d = Math.hypot(x - ox, y - oy) / 2200;
          const off = t0 + d * wave + rnd(k, 3) * 6;
          const on = f < off ? 1 : f < off + 3 ? (Math.floor(f) % 2 ? 0.25 : 0.8) : 0;
          const w = 34 + rnd(k, 4) * 20, h = 24 + rnd(k, 5) * 12;
          return (
            <g key={k}>
              <rect x={x} y={y} width={w} height={h} fill="#18212B" stroke="#2A3744" strokeWidth="2" />
              {on > 0.3 ? <circle cx={x + w / 2} cy={y + h / 2} r={58} fill="url(#glw)" opacity={0.32 * on * flick} /> : null}
              <rect x={x + 5} y={y + 5} width={12} height={11} fill={C.window} opacity={on * flick * (0.7 + rnd(k, 6) * 0.3)} />
              <rect x={x + w - 17} y={y + 5} width={12} height={11} fill={C.window} opacity={on * flick * (0.5 + rnd(k, 7) * 0.5)} />
            </g>
          );
        })}
        {/* la subestación: chispa */}
        <circle cx={ox} cy={oy} r={interpolate(f, [t0 - 2, t0 + 10], [0, 180], CL)} fill="none" stroke={C.white} strokeWidth={6} opacity={interpolate(f, [t0 - 2, t0 + 12], [0.9, 0], CL)} />
      </svg>
      <Nieve n={60} o={0.5} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", right: 110, bottom: 120, textAlign: "right" }}>
        <Eyebrow text={eyebrow} />
        <div style={{ fontFamily: BEBAS, fontSize: 190, lineHeight: 0.9, color: C.white, textShadow: "0 8px 40px rgba(0,0,0,0.9)", fontVariantNumeric: "tabular-nums" }}>{fmt(cnt)}</div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 46, letterSpacing: 10, color: C.hivis }}>{label}</div>
      </div>
      <Grano o={0.08} />
    </AbsoluteFill>
  );
};

// ═══ 2) BREAKER PANEL ════════════════════════════════════════════════════════════════════════
/** Tablero de térmicas con la puerta abierta; la linterna barre, una térmica queda en el MEDIO, se baja y se sube. */
export const BreakerPanel: React.FC<{ durationInFrames: number; tripped?: number; title?: string; eyebrow?: string; mode?: "reset" | "main"; image?: string }> =
  ({ durationInFrames, tripped = 7, title = "TRIPPED = STUCK IN THE MIDDLE", eyebrow, mode = "reset", image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const n = 16;
  const tOff = 36, tOn = 56;   // fijos: el clack de la mezcla cae en 1,20 s y 1,87 s
  const beamX = interpolate(f, [0, D * 0.4], [-300, 0], { ...CL, easing: easeOut });
  const pos = (i: number) => {
    if (i !== tripped) return 1;
    if (mode === "main") return 0.5;
    if (f < tOff) return 0.5 + Math.sin(f / 3) * 0.02;
    if (f < tOn) return interpolate(f, [tOff, tOff + 5], [0.5, 0], CL);
    return interpolate(f, [tOn, tOn + 5], [0, 1], CL);
  };
  const glow = 0.5 + 0.5 * Math.sin(f / 4);
  const pin = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.8} />
      <div style={{ position: "absolute", left: 250, top: 70, width: 620, height: 940, transform: `translateY(${(1 - pin) * 60}px)`, background: "linear-gradient(135deg,#C7CDD0,#8C959A)", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.8), inset 0 0 0 6px #6E777C" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, bottom: 70, background: "#2A2F33", borderRadius: 6, boxShadow: "inset 0 6px 20px rgba(0,0,0,0.8)" }}>
          <div style={{ position: "absolute", left: "50%", top: 16, width: 180, marginLeft: -90, height: 80, background: "#161A1D", borderRadius: 6, border: "3px solid #444" }}>
            <div style={{ position: "absolute", left: 20, right: 20, top: 16, height: 48, background: "#0B0D0E", borderRadius: 4 }}>
              <div style={{ position: "absolute", left: 6, width: 58, top: 6, height: 36, background: "#DADFE2", borderRadius: 3, transform: `translateX(${mode === "main" ? 42 : 80}px)` }} />
            </div>
          </div>
          {Array.from({ length: n }, (_, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const p = pos(i);
            const isT = i === tripped;
            return (
              <div key={i} style={{ position: "absolute", left: col ? 262 : 26, top: 120 + row * 82, width: 212, height: 64, background: "#15181A", borderRadius: 4, border: `3px solid ${isT && f < tOn ? `rgba(245,196,0,${0.45 + glow * 0.55})` : "#3A4045"}`, boxShadow: isT && f < tOn ? `0 0 ${24 * glow}px rgba(245,196,0,0.7)` : undefined }}>
                <div style={{ position: "absolute", top: 10, left: col ? 12 : undefined, right: col ? undefined : 12, width: 70, height: 38, background: "#EDEFF0", borderRadius: 3, transform: `translateX(${(col ? 1 : -1) * interpolate(p, [0, 1], [0, 62])}px)`, boxShadow: "0 3px 6px rgba(0,0,0,0.6)" }} />
                <div style={{ position: "absolute", top: 18, left: col ? 150 : 14, fontFamily: MONO, fontSize: 20, color: "#9AA3A8" }}>{15 + (i % 3) * 5}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* haz de linterna */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${560 + beamX}px 520px, rgba(255,240,200,0.0) 0px, rgba(255,240,200,0.0) 240px, rgba(0,0,0,0.55) 420px)`, mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 960, top: 300, width: 800 }}>
        <Eyebrow text={eyebrow} />
        <div style={{ fontFamily: BEBAS, fontSize: 104, lineHeight: 0.95, color: C.white, marginTop: 10, opacity: interpolate(f, [10, 22], [0, 1], CL), transform: `translateX(${interpolate(f, [10, 26], [40, 0], { ...CL, easing: easeOut })}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
        {mode === "reset" ? (
          <div style={{ display: "flex", gap: 22, marginTop: 36, fontFamily: OSW, fontWeight: 700, fontSize: 48 }}>
            <span style={{ color: f >= tOff ? C.hivis : "#5A6168" }}>1 · OFF</span>
            <span style={{ color: "#5A6168" }}>→</span>
            <span style={{ color: f >= tOn ? C.green : "#5A6168" }}>2 · ON</span>
          </div>
        ) : (
          <div style={{ marginTop: 36, fontFamily: OSW, fontWeight: 700, fontSize: 48, color: C.red, opacity: interpolate(f, [D * 0.4, D * 0.4 + 8], [0, 1], CL) }}>LEAVE IT OFF · CALL AN ELECTRICIAN</div>
        )}
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 3) DISPATCH BOARD ═══════════════════════════════════════════════════════════════════════
/** La pantalla del despachador: reportes que entran y se agrupan en el mapa hasta señalar el equipo que falló. */
export const DispatchBoard: React.FC<{ durationInFrames: number; title?: string; found?: string; lines?: { text: string }[] }> =
  ({ durationInFrames, title = "OUTAGE REPORTS", found = "FUSE · TRANSFORMER T-114", lines }) => {
  const f = useCurrentFrame();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const L = lines && lines.length ? lines.map((l) => l.text) : ["412 ELM ST", "418 ELM ST", "7 BIRCH CT", "430 ELM ST", "11 BIRCH CT", "402 ELM ST", "15 BIRCH CT", "426 ELM ST"];
  const foundAt = Math.max(60, D - 50);   // fijo contra el final: el sonido va en end-1.67
  const every = Math.max(4, Math.floor((foundAt - 10) / L.length));
  const shown = Math.min(L.length, Math.floor(f / every) + 1);
  const hit = f >= foundAt;
  const pulse = 0.5 + 0.5 * Math.sin(f / 3);
  const cx = 1350, cy = 520;
  return (
    <AbsoluteFill style={{ opacity: op, background: "#030806" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(88,240,138,0.05) 0 2px, transparent 2px 5px)" }} />
      <div style={{ position: "absolute", left: 90, top: 80, fontFamily: MONO, color: C.green, fontSize: 40, letterSpacing: 4, textShadow: "0 0 12px rgba(88,240,138,0.6)" }}>
        {title} <span style={{ opacity: 0.6 }}>· CIRCUIT 12-04</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 170, width: 640, fontFamily: MONO, color: C.green, fontSize: 36, lineHeight: 1.55, textShadow: "0 0 10px rgba(88,240,138,0.5)" }}>
        {L.slice(0, shown).map((t, i) => (
          <div key={i} style={{ opacity: i === shown - 1 ? interpolate(f % every, [0, 3], [0.2, 1], CL) : 0.85 }}>
            {`${String(18 + Math.floor(i / 3)).padStart(2, "0")}:${String(42 + i).padStart(2, "0")}  NO POWER  ${t}`}
          </div>
        ))}
        <div style={{ marginTop: 10, opacity: f % 30 < 15 ? 1 : 0 }}>█</div>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <rect x="860" y="150" width="980" height="760" fill="none" stroke="rgba(88,240,138,0.35)" strokeWidth="2" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={860 + i * 122} x2={860 + i * 122} y1="150" y2="910" stroke="rgba(88,240,138,0.1)" />)}
        {Array.from({ length: 7 }, (_, i) => <line key={`r${i}`} y1={150 + i * 126} y2={150 + i * 126} x1="860" x2="1840" stroke="rgba(88,240,138,0.1)" />)}
        <path d={`M 900 820 L 1150 820 L ${cx} ${cy} L 1700 300`} stroke="rgba(88,240,138,0.55)" strokeWidth="5" fill="none" />
        {L.slice(0, shown).map((_, i) => {
          const a = rnd(i, 9) * Math.PI * 2, r = 40 + rnd(i, 8) * 150;
          const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.8;
          return <circle key={i} cx={x} cy={y} r={11} fill={C.orange} opacity={0.9} />;
        })}
        {hit ? <circle cx={cx} cy={cy} r={60 + pulse * 30} fill="none" stroke={C.red} strokeWidth={6} opacity={0.9} /> : null}
        {hit ? <rect x={cx - 16} y={cy - 16} width={32} height={32} fill={C.red} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 900, bottom: 120, fontFamily: MONO, fontSize: 44, color: hit ? C.red : "transparent", letterSpacing: 3, textShadow: "0 0 14px rgba(224,48,30,0.7)" }}>▶ {found}</div>
      <Grano o={0.06} />
    </AbsoluteFill>
  );
};

// ═══ 4) LOAD SURGE ═══════════════════════════════════════════════════════════════════════════
/** Registrador de corriente: al reconectar, todo arranca junto y la curva rompe la línea de disparo (spike),
 *  o se escalona y queda debajo (stagger). */
export const LoadSurge: React.FC<{ durationInFrames: number; mode?: "spike" | "stagger"; title?: string; eyebrow?: string }> =
  ({ durationInFrames, mode = "spike", title, eyebrow = "COLD LOAD PICKUP" }) => {
  const f = useCurrentFrame();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const W = 1500, H = 560, x0 = 210, y0 = 300;
  const prog = interpolate(f, [8, 128], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });   // fijo: el pico cae en ~1,1 s
  const trip = 0.72;
  const val = (t: number) => {
    if (t < 0.15) return 0.02;
    if (mode === "spike") {
      if (t < 0.22) return interpolate(t, [0.15, 0.22], [0.02, 1.08]);
      if (t < 0.26) return interpolate(t, [0.22, 0.26], [1.08, 0.0]);
      return 0.0;
    }
    const steps = [0.15, 0.3, 0.45, 0.6, 0.75];
    let v = 0.02;
    steps.forEach((s, i) => { if (t > s) v += 0.12 * Math.min(1, (t - s) / 0.02) + (t > s && t < s + 0.04 ? 0.06 * (1 - (t - s) / 0.04) : 0); });
    return v;
  };
  const N = 220;
  const pts = Array.from({ length: N + 1 }, (_, i) => i / N).filter((t) => t <= prog).map((t) => `${x0 + t * W},${y0 + H - val(t) * H * 0.85 + Math.sin(t * 140) * 3}`);
  const tripped = mode === "spike" && prog > 0.2;
  const tt = Math.max(0, f - 8 - 120 * 0.316);
  const flash = tripped ? Math.exp(-tt / 6) : 0;
  return (
    <AbsoluteFill style={{ opacity: op, background: "#0B0F12" }}>
      <AbsoluteFill style={{ background: `rgba(224,48,30,${flash * 0.35})` }} />
      <div style={{ position: "absolute", left: x0, top: 90 }}>
        <Eyebrow text={eyebrow} />
        <div style={{ fontFamily: BEBAS, fontSize: 96, color: C.white, lineHeight: 1 }}>{title || (mode === "spike" ? "EVERYTHING STARTS AT ONCE" : "ONE AT A TIME")}</div>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={x0 + (i * W) / 10} x2={x0 + (i * W) / 10} y1={y0} y2={y0 + H} stroke="rgba(255,255,255,0.06)" />)}
        {Array.from({ length: 6 }, (_, i) => <line key={`h${i}`} y1={y0 + (i * H) / 5} y2={y0 + (i * H) / 5} x1={x0} x2={x0 + W} stroke="rgba(255,255,255,0.06)" />)}
        <line x1={x0} x2={x0 + W} y1={y0 + H - trip * H * 0.85} y2={y0 + H - trip * H * 0.85} stroke={C.red} strokeWidth={4} strokeDasharray="18 12" />
        <text x={x0 + W - 10} y={y0 + H - trip * H * 0.85 - 16} fill={C.red} fontFamily={OSW} fontWeight={700} fontSize={34} textAnchor="end" letterSpacing={4}>TRIP LEVEL</text>
        <polyline points={pts.join(" ")} fill="none" stroke={mode === "spike" ? C.hivis : C.green} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${mode === "spike" ? "rgba(245,196,0,0.8)" : "rgba(88,240,138,0.7)"})` }} />
      </svg>
      {tripped ? (
        <div style={{ position: "absolute", left: x0 + W * 0.3, top: y0 + 80, fontFamily: STENCIL, fontSize: 120, color: C.red, transform: `rotate(-6deg) scale(${interpolate(tt, [0, 6], [1.6, 1], CL)})`, opacity: interpolate(tt, [0, 3], [0, 1], CL), textShadow: "0 0 30px rgba(224,48,30,0.6)" }}>TRIPPED</div>
      ) : null}
      {mode === "stagger" ? (
        <div style={{ position: "absolute", left: x0, bottom: 110, display: "flex", gap: 40, fontFamily: OSW, fontWeight: 600, fontSize: 34, color: C.green, letterSpacing: 3 }}>
          {["FURNACE", "FRIDGE", "FREEZER", "LIGHTS", "TV"].map((s, i) => <span key={s} style={{ opacity: prog > 0.15 + i * 0.15 ? 1 : 0.15 }}>{s}</span>)}
        </div>
      ) : null}
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 5) FRIDGE CLOCK ═════════════════════════════════════════════════════════════════════════
/** Heladera y freezer como relojes de cuenta regresiva; una tira de cinta de pintor cruza las puertas. */
export const FridgeClock: React.FC<{ durationInFrames: number; items?: { label: string; hours: number }[]; tape?: boolean; image?: string; eyebrow?: string }> =
  ({ durationInFrames, items, tape = true, image, eyebrow = "KEEP IT CLOSED" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const I = items && items.length ? items.slice(0, 3) : [{ label: "FRIDGE", hours: 4 }, { label: "FULL FREEZER", hours: 48 }, { label: "HALF FREEZER", hours: 24 }];
  const tapeIn = spring({ frame: f - 60, fps, config: { damping: 16, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.72} />
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center" }}><Eyebrow text={eyebrow} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", justifyContent: "center", gap: 70 }}>
        {I.map((it, i) => {
          const a = 10 + i * 10;
          const s = spring({ frame: f - a, fps, config: { damping: 13, stiffness: 110 } });
          const h = interpolate(f, [a + 6, a + 40], [0, it.hours], { ...CL, easing: easeOut });
          const frac = h / 48;
          const R = 150;
          return (
            <div key={i} style={{ width: 420, height: 640, background: "linear-gradient(180deg,#EDEFEF,#C9CECF)", borderRadius: 26, boxShadow: "0 30px 70px rgba(0,0,0,0.7), inset -10px 0 0 rgba(0,0,0,0.06)", transform: `translateY(${(1 - s) * 80}px)`, opacity: s, position: "relative" }}>
              <div style={{ position: "absolute", right: 26, top: 120, width: 16, height: 200, borderRadius: 8, background: "linear-gradient(90deg,#9BA3A6,#E6E9EA)" }} />
              <svg width="420" height="420" style={{ position: "absolute", top: 60, left: 0 }}>
                <circle cx="210" cy="210" r={R} fill="#1A1F22" />
                <circle cx="210" cy="210" r={R - 12} fill="none" stroke="#2C3337" strokeWidth={18} />
                <circle cx="210" cy="210" r={R - 12} fill="none" stroke={it.hours <= 4 ? C.red : C.cold} strokeWidth={18} strokeDasharray={`${2 * Math.PI * (R - 12) * frac} 9999`} transform="rotate(-90 210 210)" strokeLinecap="round" />
                <text x="210" y="238" textAnchor="middle" fontFamily={BEBAS} fontSize={120} fill={C.white}>{Math.round(h)}</text>
                <text x="210" y="290" textAnchor="middle" fontFamily={OSW} fontWeight={600} fontSize={30} fill="#9FB0B8" letterSpacing={4}>HOURS</text>
              </svg>
              <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: 40, color: "#2A3034", letterSpacing: 3 }}>{it.label}</div>
            </div>
          );
        })}
      </div>
      {tape ? (
        <div style={{ position: "absolute", left: 180, right: 180, top: 560, height: 70, background: "linear-gradient(180deg,#8FD0F5,#62B6E8)", opacity: 0.92, transform: `rotate(-3deg) scaleX(${tapeIn})`, transformOrigin: "0 50%", boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }}>
          <div style={{ fontFamily: HAND, fontSize: 60, color: "#123", textAlign: "center", lineHeight: "70px", opacity: interpolate(tapeIn, [0.7, 1], [0, 1], CL) }}>DON'T OPEN!</div>
        </div>
      ) : null}
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 6) COIN CUP ═════════════════════════════════════════════════════════════════════════════
/** El vaso de hielo con la moneda: arriba = nunca se descongeló; se hunde = se derritió y se volvió a congelar. */
export const CoinCup: React.FC<{ durationInFrames: number; mode?: "safe" | "thawed" | "both"; title?: string }> =
  ({ durationInFrames, mode = "both", title = "THE COIN TELLS THE TRUTH" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const cups = mode === "both" ? ["safe", "thawed"] : [mode];
  const Cup: React.FC<{ k: string; i: number }> = ({ k, i }) => {
    const s = spring({ frame: f - 6 - i * 8, fps, config: { damping: 14, stiffness: 120 } });
    const sink = k === "thawed" ? interpolate(f, [45, 95], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) }) : 0;
    const wob = k === "thawed" ? Math.sin(f / 5) * 8 * (1 - sink) * (sink > 0 ? 1 : 0) : 0;
    const coinY = interpolate(sink, [0, 1], [120, 470]);
    return (
      <div style={{ position: "relative", width: 460, height: 700, transform: `translateY(${(1 - s) * 90}px)`, opacity: s }}>
        <svg width="460" height="620">
          <defs>
            <linearGradient id={`cup${i}`} x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0.35)" /><stop offset="0.5" stopColor="rgba(255,255,255,0.08)" /><stop offset="1" stopColor="rgba(255,255,255,0.3)" /></linearGradient>
            <linearGradient id={`ice${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8F6FF" /><stop offset="1" stopColor="#9CCBEA" /></linearGradient>
          </defs>
          <path d="M 70 100 L 390 100 L 350 590 L 110 590 Z" fill={`url(#ice${i})`} opacity={0.85} />
          {Array.from({ length: 14 }, (_, j) => <line key={j} x1={110 + rnd(j, i) * 240} y1={160 + rnd(j, 3) * 400} x2={140 + rnd(j, 5) * 200} y2={170 + rnd(j, 7) * 400} stroke="rgba(255,255,255,0.6)" strokeWidth={2} />)}
          <path d="M 60 90 L 400 90 L 356 600 L 104 600 Z" fill={`url(#cup${i})`} stroke="rgba(255,255,255,0.7)" strokeWidth={4} />
          <ellipse cx={230 + wob} cy={coinY} rx={62} ry={16} fill="#C9A24A" stroke="#7A5E1E" strokeWidth={4} />
          <ellipse cx={230 + wob} cy={coinY - 4} rx={50} ry={11} fill="#E4C06A" />
        </svg>
        <div style={{ textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: k === "safe" ? C.green : C.red, opacity: k === "thawed" ? interpolate(sink, [0.8, 1], [0, 1], CL) : interpolate(f, [20, 30], [0, 1], CL) }}>
          {k === "safe" ? "COIN ON TOP · SAFE" : "COIN SANK · THROW IT OUT"}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 50% 40%, #1F2A33 0%, #07090B 75%)" }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: BEBAS, fontSize: 92, color: C.white, letterSpacing: 2 }}>{title}</div>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 160 }}>
        {cups.map((k, i) => <Cup key={k} k={k} i={i} />)}
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 7) GEN DISTANCE ═════════════════════════════════════════════════════════════════════════
/** Vista de arriba: el generador sale del garaje (X roja) y se arrastra hasta la marca de 20 pies; el humo apunta lejos. */
export const GenDistance: React.FC<{ durationInFrames: number; feet?: number; title?: string }> =
  ({ durationInFrames, feet = 20, title = "AT LEAST 20 FEET FROM THE HOUSE" }) => {
  const f = useCurrentFrame();
  const D = Math.max(75, durationInFrames);
  const op = fadeIO(f, D);
  const hx = 250, hy = 260, hw = 560, hh = 560;     // casa
  const gx0 = hx + hw - 150, gy = hy + hh - 150;     // generador adentro del garaje
  const gx1 = hx + hw + 620;
  const t = interpolate(f, [30, 90], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const gx = interpolate(t, [0, 1], [gx0, gx1]);
  const bad = t < 0.05;
  const ft = Math.round(interpolate(t, [0, 1], [0, feet]));
  const smoke = (k: number) => {
    const p = ((f + k * 9) % 40) / 40;
    return { x: gx + 60 + (bad ? -p * 240 : p * 260), y: gy + 30 - p * 60 + Math.sin(p * 6 + k) * 12, o: (1 - p) * 0.45, r: 20 + p * 60 };
  };
  return (
    <AbsoluteFill style={{ opacity: op, background: "#E9ECEE" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #F4F6F7 0%, #CDD4D8 100%)" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs><pattern id="gridp" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30,60,90,0.08)" strokeWidth="1" /></pattern></defs>
        <rect width="1920" height="1080" fill="url(#gridp)" />
        <rect x={hx} y={hy} width={hw} height={hh} fill="#FFFFFF" stroke="#2B3A48" strokeWidth={8} />
        <rect x={hx + hw - 260} y={hy + hh - 260} width={260} height={260} fill="#F1F3F4" stroke="#2B3A48" strokeWidth={5} />
        <text x={hx + hw - 130} y={hy + hh - 222} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={28} fill="#2B3A48" letterSpacing={3}>GARAGE</text>
        <text x={hx + 150} y={hy + 90} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={30} fill="#2B3A48" letterSpacing={3}>HOUSE</text>
        {[[hx + 120, hy], [hx + 330, hy], [hx, hy + 250], [hx + hw, hy + 140]].map(([x, y], i) => <rect key={i} x={x - 30} y={y - 8} width={i >= 2 ? 16 : 60} height={i >= 2 ? 60 : 16} fill={C.cold} />)}
        {Array.from({ length: 6 }, (_, k) => { const s = smoke(k); return <circle key={k} cx={s.x} cy={s.y} r={s.r} fill={bad ? "#7A2A20" : "#6C7780"} opacity={s.o} />; })}
        <g transform={`translate(${gx}, ${gy})`}>
          <rect x={0} y={0} width={110} height={80} rx={8} fill={C.orange} stroke="#6A2A00" strokeWidth={5} />
          <rect x={14} y={14} width={82} height={30} rx={4} fill="#2B2B2B" />
          <circle cx={20} cy={86} r={10} fill="#222" /><circle cx={90} cy={86} r={10} fill="#222" />
        </g>
        {bad || t < 0.2 ? (
          <g opacity={interpolate(f, [8, 14], [0, 1], CL) * (1 - t * 5)}>
            <line x1={gx0 - 20} y1={gy - 20} x2={gx0 + 130} y2={gy + 110} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
            <line x1={gx0 + 130} y1={gy - 20} x2={gx0 - 20} y2={gy + 110} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
          </g>
        ) : null}
        {t > 0.02 ? (
          <g>
            <line x1={hx + hw} x2={gx} y1={gy + 170} y2={gy + 170} stroke="#2B3A48" strokeWidth={4} />
            <line x1={hx + hw} x2={hx + hw} y1={gy + 150} y2={gy + 190} stroke="#2B3A48" strokeWidth={4} />
            <line x1={gx} x2={gx} y1={gy + 150} y2={gy + 190} stroke="#2B3A48" strokeWidth={4} />
            <text x={(hx + hw + gx) / 2} y={gy + 240} textAnchor="middle" fontFamily={BEBAS} fontSize={90} fill={t >= 1 ? "#16833E" : "#2B3A48"}>{ft} FT</text>
          </g>
        ) : null}
        {t >= 1 ? <path d={`M ${gx + 120} ${gy + 40} l 140 -40`} stroke="#16833E" strokeWidth={8} markerEnd="" /> : null}
      </svg>
      <div style={{ position: "absolute", left: 250, top: 90, fontFamily: BEBAS, fontSize: 88, color: "#16222D", letterSpacing: 1 }}>{title}</div>
      <div style={{ position: "absolute", left: 1100, top: 300, width: 700, fontFamily: OSW, fontWeight: 600, fontSize: 36, color: "#2B3A48", lineHeight: 1.5, opacity: interpolate(f, [92, 102], [0, 1], CL) }}>
        EXHAUST AWAY FROM<br />DOORS · WINDOWS · VENTS
      </div>
    </AbsoluteFill>
  );
};

// ═══ 8) CO ALARM ═════════════════════════════════════════════════════════════════════════════
/** Detector de monóxido en la pared: el ppm sube, la luz roja late y aparecen los síntomas que "parecen gripe". */
export const COAlarm: React.FC<{ durationInFrames: number; to?: number; symptoms?: ({ text: string } | string)[]; title?: string; image?: string }> =
  ({ durationInFrames, to = 400, symptoms, title = "IT FEELS LIKE THE FLU", image }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const S = symptoms && symptoms.length ? symptoms.map((s) => (typeof s === "string" ? s : s.text)) : ["HEADACHE", "DIZZY", "SICK TO YOUR STOMACH", "SLEEPY"];
  const ppm = interpolate(f, [6, 81], [0, to], { ...CL, easing: Easing.in(Easing.quad) });   // fijo: la alarma arranca en ~1,67 s
  const alarm = ppm > to * 0.35;
  const blink = alarm && Math.floor(f / 5) % 2 === 0;
  const s = spring({ frame: f - 2, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.75} tint={blink ? "rgba(224,48,30,0.35)" : undefined} />
      <div style={{ position: "absolute", left: 260, top: 230, width: 520, height: 620, borderRadius: 60, background: "linear-gradient(160deg,#FAFAF8,#D9DBD8)", boxShadow: "0 40px 90px rgba(0,0,0,0.75)", transform: `scale(${s}) rotate(${alarm ? Math.sin(f * 2.2) * 0.8 : 0}deg)` }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 200, background: "#1C2A1E", borderRadius: 14, boxShadow: "inset 0 4px 16px rgba(0,0,0,0.8)" }}>
          <div style={{ position: "absolute", right: 30, top: 10, fontFamily: MONO, fontSize: 150, color: alarm ? "#FF6D5E" : "#9CF3A8", textShadow: `0 0 20px ${alarm ? "rgba(255,80,60,0.7)" : "rgba(120,240,140,0.5)"}` }}>{Math.round(ppm)}</div>
          <div style={{ position: "absolute", left: 20, bottom: 12, fontFamily: MONO, fontSize: 32, color: "#8FB895" }}>CO PPM</div>
        </div>
        {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 90 + i * 50, top: 330, width: 24, height: 120, borderRadius: 12, background: "#BFC2BF" }} />)}
        <div style={{ position: "absolute", left: "50%", bottom: 60, width: 60, height: 60, marginLeft: -30, borderRadius: 30, background: blink ? "#FF2A1A" : "#6B1A12", boxShadow: blink ? "0 0 60px 20px rgba(255,42,26,0.8)" : undefined }} />
      </div>
      <div style={{ position: "absolute", left: 930, top: 250, width: 900 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 110, color: C.white, lineHeight: 0.95, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
        <div style={{ marginTop: 30 }}>
          {S.map((t, i) => {
            const a = D * 0.3 + i * Math.max(6, D * 0.08);
            const k = interpolate(f, [a, a + 8], [0, 1], { ...CL, easing: easeOut });
            return <div key={i} style={{ fontFamily: OSW, fontWeight: 700, fontSize: 54, color: i === S.length - 1 ? C.red : C.hivis, opacity: k, transform: `translateX(${(1 - k) * 50}px)`, letterSpacing: 3, lineHeight: 1.35 }}>· {t}</div>;
          })}
        </div>
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 9) BACKFEED FLOW ════════════════════════════════════════════════════════════════════════
/** El backfeed: generador → toma del secarropas → tablero → acometida → transformador (240 V sube a 7.200 V) → la línea → el liniero. */
export const BackfeedFlow: React.FC<{ durationInFrames: number; fromV?: number; toV?: number; title?: string }> =
  ({ durationInFrames, fromV = 240, toV = 7200, title = "IT RUNS BACKWARD" }) => {
  const f = useCurrentFrame();
  const D = Math.max(90, durationInFrames);
  const op = fadeIO(f, D);
  const nodes = [
    { x: 190, y: 800, l: "GENERATOR" }, { x: 520, y: 800, l: "DRYER OUTLET" }, { x: 840, y: 700, l: "YOUR PANEL" },
    { x: 1130, y: 500, l: "SERVICE DROP" }, { x: 1400, y: 330, l: "TRANSFORMER" }, { x: 1740, y: 200, l: "THE LINE" },
  ];
  const prog = interpolate(f, [10, 160], [0, nodes.length - 1], { ...CL, easing: Easing.inOut(Easing.quad) });   // fijo: 7.200 V en ~3,75 s
  const seg = Math.floor(prog);
  const volts = prog < 4 ? fromV : interpolate(prog, [4, 4.6], [fromV, toV], CL);
  const hot = volts > 1000;
  const pulse = 0.5 + 0.5 * Math.sin(f / 2.2);
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 60% 40%, #16202A 0%, #06080A 80%)" }}>
      <div style={{ position: "absolute", left: 120, top: 80, fontFamily: BEBAS, fontSize: 100, color: C.white }}>{title}</div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(0, -1).map((n, i) => {
          const m = nodes[i + 1];
          const k = Math.max(0, Math.min(1, prog - i));
          return (
            <g key={i}>
              <line x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke="#2C3A46" strokeWidth={10} strokeLinecap="round" />
              <line x1={n.x} y1={n.y} x2={n.x + (m.x - n.x) * k} y2={n.y + (m.y - n.y) * k} stroke={i >= 4 || (i === 3 && hot) ? C.red : C.hivis} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${8 + pulse * 10}px ${i >= 4 ? "rgba(224,48,30,0.9)" : "rgba(245,196,0,0.8)"})` }} />
            </g>
          );
        })}
        {nodes.map((n, i) => (
          <g key={i} opacity={prog >= i - 0.1 ? 1 : 0.3}>
            <circle cx={n.x} cy={n.y} r={i === 4 ? 46 : 30} fill={i === 4 && hot ? C.red : "#1B2630"} stroke={prog >= i ? (i >= 4 ? C.red : C.hivis) : "#3B4A57"} strokeWidth={6} />
            <text x={n.x} y={n.y + (i % 2 ? -70 : 80)} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={30} fill={C.white} letterSpacing={3}>{n.l}</text>
          </g>
        ))}
        {/* el liniero arriba del poste */}
        <g transform="translate(1740, 200)" opacity={prog > 4.5 ? 1 : 0.35}>
          <line x1={0} y1={30} x2={0} y2={300} stroke="#6B4E2E" strokeWidth={18} />
          <circle cx={-40} cy={20} r={16} fill={hot ? C.red : C.white} />
          <line x1={-40} y1={36} x2={-40} y2={96} stroke={hot ? C.red : C.white} strokeWidth={10} />
          <line x1={-40} y1={50} x2={0} y2={10} stroke={hot ? C.red : C.white} strokeWidth={8} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1200, top: 620, textAlign: "left" }}>
        <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 32, color: "#9FB0B8", letterSpacing: 6 }}>VOLTS ON THE LINE</div>
        <div style={{ fontFamily: BEBAS, fontSize: 200, lineHeight: 0.9, color: hot ? C.red : C.hivis, fontVariantNumeric: "tabular-nums", textShadow: hot ? `0 0 ${30 * pulse}px rgba(224,48,30,0.8)` : undefined }}>{fmt(seg >= 0 ? volts : 0)}</div>
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 10) STEP POTENTIAL ══════════════════════════════════════════════════════════════════════
/** Cable caído en el pasto: anillos de voltaje que se expanden, el círculo de 35 pies y los pies que se arrastran juntos. */
export const StepPotential: React.FC<{ durationInFrames: number; feet?: number; title?: string; image?: string }> =
  ({ durationInFrames, feet = 35, title = "EVERY WIRE IS ALIVE", image }) => {
  const f = useCurrentFrame();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const cx = 700, cy = 600;
  const ring = (k: number) => ((f * 3 + k * 70) % 420);
  const shuffleX = interpolate(f, [D * 0.45, D * 0.9], [0, 380], CL);
  const step = Math.floor(f / 6) % 2;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FondoFoto src={image} dark={0.7} tint="rgba(20,40,20,0.3)" />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 6 }, (_, k) => { const r = ring(k); return <ellipse key={k} cx={cx} cy={cy} rx={r} ry={r * 0.42} fill="none" stroke={C.hivis} strokeWidth={4} opacity={Math.max(0, 1 - r / 420) * 0.8} />; })}
        <ellipse cx={cx} cy={cy} rx={470} ry={197} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="22 14" opacity={interpolate(f, [12, 24], [0, 1], CL)} />
        <path d={`M ${cx - 260} ${cy + 30} C ${cx - 120} ${cy - 30}, ${cx - 40} ${cy + 40}, ${cx + 60} ${cy - 10} S ${cx + 200} ${cy + 20}, ${cx + 250} ${cy - 20}`} stroke="#2A2A2A" strokeWidth={16} fill="none" style={{ filter: "drop-shadow(0 0 6px rgba(245,196,0,0.9))" }} />
        {f % 17 < 3 ? <circle cx={cx + 60} cy={cy - 10} r={18} fill="#FFF7C0" style={{ filter: "blur(2px)" }} /> : null}
        <text x={cx} y={cy + 270} textAnchor="middle" fontFamily={BEBAS} fontSize={80} fill={C.red}>{feet} FT</text>
        {/* pies juntos arrastrándose */}
        <g transform={`translate(${cx + 480 + shuffleX}, ${cy + 40})`} opacity={interpolate(f, [D * 0.4, D * 0.48], [0, 1], CL)}>
          {[0, 46].map((bx, j) => (
            <g key={j} transform={`translate(${bx}, ${(step + j) % 2 ? -5 : 0})`}>
              <rect x={-20} y={-58} width={40} height={70} rx={18} fill={C.white} opacity={0.92} />
              <rect x={-17} y={18} width={34} height={36} rx={14} fill={C.white} opacity={0.92} />
            </g>
          ))}
          <path d="M -80 -10 l -40 0 m 12 -12 l -12 12 l 12 12" stroke={C.hivis} strokeWidth={6} fill="none" transform="scale(-1,1) translate(-60,0)" />
        </g>
      </svg>
      <div style={{ position: "absolute", right: 120, top: 120, textAlign: "right" }}>
        <div style={{ fontFamily: BEBAS, fontSize: 120, color: C.white, lineHeight: 0.95, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 52, color: C.hivis, letterSpacing: 6, marginTop: 14, opacity: interpolate(f, [D * 0.45, D * 0.55], [0, 1], CL) }}>SHUFFLE · FEET TOGETHER</div>
      </div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 11) RULE CARD ═══════════════════════════════════════════════════════════════════════════
/** Tarjeta de capítulo: casco con calcomanías, número en esténcil y cinta de peligro que cruza. */
export const RuleCard: React.FC<{ durationInFrames: number; number: number; title: string; sub?: string; total?: number; image?: string; danger?: boolean }> =
  ({ durationInFrames, number, title, sub, total = 7, image, danger = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(45, durationInFrames);
  const op = fadeIO(f, D, 5, 10);
  const slam = spring({ frame: f - 6, fps, config: { damping: 9, stiffness: 220 } });
  const shake = f > 7 && f < 15 ? Math.sin(f * 4) * (15 - f) * 1.4 : 0;
  const tw = Math.floor(interpolate(f, [14, 14 + title.length * 1.2], [0, title.length], CL));
  const off = f * 3;
  const acc = danger ? C.red : C.hivis;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
      <FondoFoto src={image} dark={0.8} />
      <Cinta top={70} rot={-3} off={off} />
      <Cinta top={940} rot={2} off={-off} />
      <div style={{ position: "absolute", left: 160, top: 250, display: "flex", alignItems: "center", gap: 70 }}>
        <div style={{ position: "relative", width: 380, height: 380, transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])}) rotate(${interpolate(slam, [0, 1], [-14, -4])}deg)`, opacity: interpolate(f, [5, 8], [0, 1], CL) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: acc, boxShadow: "0 30px 70px rgba(0,0,0,0.7), inset 0 0 0 10px rgba(0,0,0,0.85)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: STENCIL, fontSize: 290, color: "#111", lineHeight: 1 }}>{number}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", fontFamily: OSW, fontWeight: 700, fontSize: 34, color: "#111", letterSpacing: 8 }}>RULE</div>
        </div>
        <div style={{ maxWidth: 1100 }}>
          <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: acc, opacity: interpolate(f, [10, 16], [0, 1], CL) }}>{`${number} OF ${total}`}</div>
          <div style={{ fontFamily: BEBAS, fontSize: 150, lineHeight: 0.92, color: C.white, textShadow: "0 8px 40px rgba(0,0,0,0.9)" }}>{title.slice(0, tw)}<span style={{ opacity: tw < title.length ? 1 : 0, color: acc }}>|</span></div>
          {sub ? <div style={{ fontFamily: HAND, fontSize: 64, color: C.paper, marginTop: 14, opacity: interpolate(f, [D * 0.45, D * 0.55], [0, 1], CL), transform: "rotate(-2deg)" }}>{sub}</div> : null}
        </div>
      </div>
      <Grano o={0.09} />
    </AbsoluteFill>
  );
};

// ═══ 12) HAZARD STAMP ════════════════════════════════════════════════════════════════════════
/** La foto se congela, baja a gris frío y cae un sello de inspección. */
export const HazardStamp: React.FC<{ durationInFrames: number; image: string; stamp?: string; title?: string; eyebrow?: string; good?: boolean }> =
  ({ durationInFrames, image, stamp = "NEVER", title, eyebrow, good = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(40, durationInFrames);
  const op = fadeIO(f, D);
  const hit = 9;
  const s = spring({ frame: f - hit, fps, config: { damping: 10, stiffness: 260 } });
  const gray = interpolate(f, [hit, hit + 6], [0, good ? 0 : 0.85], CL);
  const shake = f > hit && f < hit + 8 ? Math.sin(f * 4.1) * (hit + 8 - f) * 1.6 : 0;
  const z = interpolate(f, [0, D], [1.04, 1.12], CL);
  const col = good ? "#1F9E4A" : C.red;
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: C.ink, overflow: "hidden", transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: `grayscale(${gray}) contrast(${1 + gray * 0.1}) brightness(${1 - gray * 0.25})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: "50%", top: "44%", transform: `translate(-50%,-50%) rotate(-9deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`, opacity: interpolate(f, [hit - 1, hit + 1], [0, 0.93], CL), border: `14px solid ${col}`, borderRadius: 18, padding: "10px 60px", fontFamily: STENCIL, fontSize: 180, color: col, letterSpacing: 8, mixBlendMode: "screen", textShadow: `0 0 2px ${col}` }}>{stamp}</div>
      {title ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center" }}>
          <Eyebrow text={eyebrow} />
          <div style={{ fontFamily: BEBAS, fontSize: 96, color: C.white, textShadow: "0 6px 30px rgba(0,0,0,0.95)", opacity: interpolate(f, [hit + 8, hit + 16], [0, 1], CL) }}>{title}</div>
        </div>
      ) : null}
      <Grano o={0.08} />
    </AbsoluteFill>
  );
};

// ═══ 13) ROOM HEAT ═══════════════════════════════════════════════════════════════════════════
/** Plano de la casa: todas las piezas se enfrían a azul y una sola, cerrada y al sur, se queda naranja. */
export const RoomHeat: React.FC<{ durationInFrames: number; warm?: number; cold?: number; title?: string; room?: string }> =
  ({ durationInFrames, warm = 58, cold = 34, title = "ONE ROOM. FIGHT FOR IT.", room = "LIVING ROOM" }) => {
  const f = useCurrentFrame();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const k = interpolate(f, [10, D * 0.7], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const rooms = [
    { x: 300, y: 220, w: 420, h: 300, l: "KITCHEN" }, { x: 720, y: 220, w: 360, h: 300, l: "BEDROOM" }, { x: 1080, y: 220, w: 360, h: 300, l: "BEDROOM" },
    { x: 300, y: 520, w: 520, h: 360, l: room, warm: true }, { x: 820, y: 520, w: 300, h: 360, l: "BATH" }, { x: 1120, y: 520, w: 320, h: 360, l: "HALL" },
  ];
  const mix = (a: string, b: string, t: number) => {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
  };
  return (
    <AbsoluteFill style={{ opacity: op, background: "#0B1117" }}>
      <div style={{ position: "absolute", left: 300, top: 90, fontFamily: BEBAS, fontSize: 96, color: C.white }}>{title}</div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {rooms.map((r, i) => {
          const fill = r.warm ? mix("#6A6F74", "#FF8A2A", k) : mix("#6A6F74", "#2F6FA8", k);
          const t = Math.round(r.warm ? interpolate(k, [0, 1], [64, warm]) : interpolate(k, [0, 1], [64, cold]));
          return (
            <g key={i}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={fill} opacity={0.85} stroke="#E8EEF2" strokeWidth={8} />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 10} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={3}>{r.l}</text>
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 70} textAnchor="middle" fontFamily={BEBAS} fontSize={r.warm ? 110 : 80} fill="#fff">{t}°F</text>
            </g>
          );
        })}
        <text x={1500} y={900} fontFamily={OSW} fontWeight={700} fontSize={40} fill={C.warm} opacity={k}>S ↓ SUN SIDE</text>
      </svg>
      <Nieve n={40} o={0.35 * k} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 14) RECAP CLIPBOARD ═════════════════════════════════════════════════════════════════════
/** La tablilla del capataz con la cinta de peligro: las reglas se tildan con marcador a medida que se nombran. */
export const RecapClipboard: React.FC<{ durationInFrames: number; items: { text: string }[]; title?: string; upto?: number }> =
  ({ durationInFrames, items: IT, title = "THE FIRST HOUR", upto }) => {
  const items = (IT || []).map((x) => x.text);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const op = fadeIO(f, D);
  const n = items.length;
  const U = upto ?? n;
  const s = spring({ frame: f - 2, fps, config: { damping: 15, stiffness: 110 } });
  const every = Math.max(5, (D * 0.7) / Math.max(1, U));
  return (
    <AbsoluteFill style={{ opacity: op, background: "radial-gradient(ellipse at 50% 40%, #2A3036 0%, #0A0C0E 80%)" }}>
      <div style={{ position: "absolute", left: "50%", top: 60, width: 1000, height: 960, marginLeft: -500, transform: `translateY(${(1 - s) * 120}px) rotate(-1.5deg)`, background: "#8B5E34", borderRadius: 26, boxShadow: "0 40px 90px rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 80, bottom: 40, background: C.paper, borderRadius: 6, boxShadow: "inset 0 0 40px rgba(120,90,40,0.25)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 34, background: `repeating-linear-gradient(-45deg, ${C.hivis} 0 30px, #111 30px 60px)` }} />
          <div style={{ padding: "60px 60px 0", fontFamily: BEBAS, fontSize: 80, color: "#1A1A1A" }}>{title}</div>
          {items.map((t, i) => {
            const a = 10 + i * every;
            const on = i < U && f >= a;
            const chk = spring({ frame: f - a, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 60px", height: Math.min(96, 700 / n), opacity: on ? 1 : 0.35 }}>
                <div style={{ width: 56, height: 56, border: "4px solid #1A1A1A", borderRadius: 6, position: "relative", flexShrink: 0 }}>
                  {on ? <div style={{ position: "absolute", left: 6, top: -26, fontFamily: HAND, fontSize: 96, color: C.red, transform: `scale(${chk}) rotate(-6deg)`, lineHeight: 1 }}>✓</div> : null}
                </div>
                <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 42, color: "#1A1A1A" }}><span style={{ color: C.red, marginRight: 14 }}>{i + 1}</span>{t}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: "50%", top: 20, width: 260, height: 90, marginLeft: -130, background: "linear-gradient(180deg,#E3E6E8,#8C959A)", borderRadius: 14, boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }} />
      </div>
      <Grano o={0.06} />
    </AbsoluteFill>
  );
};

// ═══ 15) CAM STAMP (overlay) ═════════════════════════════════════════════════════════════════
/** Sello de cámara de video vieja abajo a la derecha: fecha y lugar de un recuerdo ("FEB 1994 · ICE STORM"). */
export const CamStamp: React.FC<{ durationInFrames: number; text: string; sub?: string }> = ({ durationInFrames, text, sub }) => {
  const f = useCurrentFrame();
  const D = Math.max(30, durationInFrames);
  const op = Math.min(interpolate(f, [0, 4], [0, 1], CL), interpolate(f, [D - 8, D], [1, 0], CL));
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: MONO, fontSize: 44, color: "#F4F4F4", textShadow: "2px 2px 0 rgba(0,0,0,0.8)", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, background: C.red, opacity: blink ? 1 : 0.2 }} /> REC
      </div>
      <div style={{ position: "absolute", right: 80, bottom: 70, textAlign: "right", fontFamily: MONO, color: "#F4F4F4", textShadow: "2px 2px 0 rgba(0,0,0,0.85)" }}>
        <div style={{ fontSize: 54, letterSpacing: 3 }}>{text}</div>
        {sub ? <div style={{ fontSize: 36, opacity: 0.85, letterSpacing: 2 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
