// Canada with Gordie — núcleo del "mundo continuo" (estilo minuto 1 de Fortune): un solo mapa, una cámara que viaja,
// capas de pantalla proyectadas desde lon/lat, portales a fotos/clips reales. Todo se ancla a la PALABRA (words.json).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import geoRaw from "./geo.json";
import bc from "./bc_bounds.json";
import wide from "./wide_bounds.json";
import wordsRaw from "./words.json";

export const { fontFamily: SANS } = loadFont("normal", { weights: ["700", "800", "900"] });
export const { fontFamily: HAND } = loadHand("normal", { weights: ["700"] });
export const FPS = 30;
export const sf = (p: string) => staticFile("cgordie1/" + p);
export const geo: any = geoRaw;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);

// ───────── proyección: px del mundo = px del mapa de BC (160 px/° de lon, 276 px/° de lat) ─────────
export const PPD = bc.PPD, PPDY = bc.PPDY;
export const P = (lon: number, lat: number): [number, number] => [(lon - bc.L) * PPD, (bc.T - lat) * PPDY];
export const PL = (name: string): [number, number] => { const ll = geo.ll[name]; if (!ll) throw new Error("lugar sin coordenadas: " + name); return ll; };

// ───────── tiempo anclado a la palabra ─────────
type Wd = { text: string; startMs: number; endMs: number };
const WORDS = (wordsRaw as Wd[]).map((w) => ({ n: w.text.toLowerCase().replace(/[^a-z0-9]/g, ""), s: w.startMs / 1000, e: w.endMs / 1000 }));
const memo = new Map<string, number>();
// at("frase", desde) → segundo en que EMPIEZA esa frase (primera aparición después de `desde`). Si no está, rompe el still.
export const at = (phrase: string, after = 0): number => {
  const k = phrase + "@" + after;
  const m = memo.get(k); if (m !== undefined) return m;
  const toks = phrase.toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9]/g, "")).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (WORDS[i + j]?.n !== toks[j]) { ok = false; break; }
    if (ok) { memo.set(k, WORDS[i].s); return WORDS[i].s; }
  }
  throw new Error(`frase no encontrada en words.json: "${phrase}" después de ${after}`);
};
// fin de la frase (fin de su última palabra)
export const atEnd = (phrase: string, after = 0): number => {
  const s = at(phrase, after); const n = phrase.trim().split(/\s+/).length;
  const i = WORDS.findIndex((w) => w.s === s); return WORDS[Math.min(WORDS.length - 1, i + n - 1)].e;
};
export const speaking = (x: number) => { for (const w of WORDS) { if (x < w.s - 0.05) return false; if (x <= w.e + 0.08) return true; } return false; };

// ───────── cámara: [t, lon, lat, zoom, tilt] (zoom = px de pantalla por px del mundo) ─────────
export type Key = [number, number, number, number, number];
export type Cam = { x: number; y: number; z: number; tilt: number };
export const makeCam = (KEYS: Key[]) => (t: number): Cam => {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const [ax, ay] = P(a[1], a[2]), [bx, by] = P(b[1], b[2]);
  const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
  const dist = Math.hypot(bx - ax, by - ay) * Math.min(a[3], b[3]);
  const arc = dist > 900 ? 1 - 0.3 * Math.sin(Math.PI * k) : 1; // arco de vuelo en traslados largos
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, z: z * arc, tilt: a[4] + (b[4] - a[4]) * k };
};
export const proj = (c: Cam, wx: number, wy: number): [number, number] => [(wx - c.x) * c.z + 960, (wy - c.y) * c.z + 540];
export const pj = (c: Cam, lon: number, lat: number) => proj(c, ...P(lon, lat));

export const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });
export const fadeOut = (t: number, t1: number, d = 0.35) => interpolate(t, [t1 - d, t1], [1, 0], clamp);
export const vis = (t: number, t0: number, t1: number) => t >= t0 - 0.05 && t <= t1 + 0.05;
export const ramp = (t: number, t0: number, d = 0.4) => interpolate(t, [t0, t0 + d], [0, 1], { ...clamp, easing: ease });
export const win = (t: number, t0: number, t1: number, d = 0.4) => Math.min(ramp(t, t0, d), 1 - ramp(t, t1 - d, d));

// ───────── mundo (dentro de la cámara) ─────────
const WX = (wide.L - bc.L) * PPD, WY = (bc.T - wide.T) * PPDY;
export const MapWorld: React.FC = () => (
  <>
    <Img src={sf("wide_modern.jpg")} style={{ position: "absolute", left: WX, top: WY, width: wide.W * wide.S, height: wide.H * wide.S }} />
    <Img src={sf("bc_modern.jpg")} style={{ position: "absolute", left: 0, top: 0, width: bc.W, height: bc.H,
      WebkitMaskImage: "linear-gradient(90deg,transparent 0,#000 4%,#000 96%,transparent 100%),linear-gradient(transparent 0,#000 4%,#000 96%,transparent 100%)",
      WebkitMaskComposite: "source-in", maskComposite: "intersect" } as React.CSSProperties} />
  </>
);
export const Prov: React.FC<{ name: string; z: number; op?: number; fill?: string; fillOp?: number; stroke?: string; w?: number; glow?: boolean }> = ({ name, z, op = 1, fill = "none", fillOp = 0, stroke = "#fff", w = 2.4, glow }) =>
  op <= 0.001 ? null : <path d={geo.prov[name]} fill={fill} fillOpacity={fillOp * op} stroke={stroke} strokeOpacity={op} strokeWidth={w / z} strokeLinejoin="round" style={glow ? { filter: `drop-shadow(0 0 ${8 / z}px ${stroke})` } : undefined} />;

// ───────── capas de pantalla (siguen a la cámara por proyección) ─────────
type C = { c: Cam; f: number; t: number };
export const Tag: React.FC<C & { lon: number; lat: number; t0: number; t1: number; text: React.ReactNode; dy?: number; dx?: number; bg?: string; size?: number; color?: string }> = ({ c, f, t, lon, lat, t0, t1, text, dy = 0, dx = 0, bg = "#111", size = 30, color = "#fff" }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const s = pop(f, t0) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 0.6, padding: "6px 14px 7px", borderRadius: 6, border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 6px 16px rgba(0,0,0,.45)", whiteSpace: "nowrap", textTransform: "uppercase" }}>{text}</div>
  );
};
// punto de lugar con pulso + nombre
export const Pin: React.FC<C & { lon: number; lat: number; t0: number; t1: number; label?: string; side?: "r" | "l" | "t" | "b"; color?: string; size?: number }> = ({ c, f, t, lon, lat, t0, t1, label, side = "r", color = "#e3261c", size = 26 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  const pulse = ((t - t0) * 1.2) % 1;
  const off = { r: [20, 0, "0%"], l: [-20, 0, "-100%"], t: [0, -34, "-50%"], b: [0, 34, "-50%"] }[side] as [number, number, string];
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `3px solid ${color}`, opacity: (1 - pulse) * s, transform: `scale(${0.3 + pulse})` }} />
      <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: color, border: "3px solid #fff", transform: `scale(${s})`, boxShadow: "0 3px 8px rgba(0,0,0,.5)" }} />
      {label && <div style={{ position: "absolute", left: off[0], top: off[1], transform: `translate(${off[2]},-50%) scale(${s})`, transformOrigin: side === "l" ? "100% 50%" : "0 50%", fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 1, textShadow: "0 2px 0 #000, 0 0 10px rgba(0,0,0,.8)" }}>{label}</div>}
    </div>
  );
};
export const Icon: React.FC<C & { src: string; lon: number; lat: number; t0: number; t1: number; size?: number; dx?: number; dy?: number; grey?: number }> = ({ c, f, t, src, lon, lat, t0, t1, size = 120, dx = 0, dy = 0, grey = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  const bob = Math.sin((f + lon * 7) / 14) * 4;
  return <Img src={sf(`icons/${src}.png`)} style={{ position: "absolute", left: x + dx, top: y + dy + bob, width: size * 1.55, transform: `translate(-50%,-80%) scale(${s})`, filter: `drop-shadow(0 10px 10px rgba(0,0,0,.4)) grayscale(${grey}) brightness(${1 - grey * 0.45})` }} />;
};
export const BigWord: React.FC<{ f: number; t: number; t0: number; t1: number; text: React.ReactNode; y?: number; x?: number; size?: number }> = ({ f, t, t0, t1, text, y = 150, x = 960, size = 120 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 8) * fadeOut(t, t1, 0.25);
  return <div style={{ zIndex: 20, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 4px 0 #1b1b1b, 0 8px 22px rgba(0,0,0,.55), 0 0 2px #000" }}>{text}</div>;
};
export const Sticker: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; rot?: number; size?: number; children: React.ReactNode }> = ({ f, t, t0, t1, x, y, rot = -7, size = 84, children }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 7) * fadeOut(t, t1, 0.25);
  return <div style={{ zIndex: 20, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: size, padding: "4px 30px 10px", border: "6px solid #fff", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{children}</div>;
};
// nota de papel arriba a la izquierda (año / capítulo)
export const Note: React.FC<{ f: number; t: number; t0: number; t1: number; text: string }> = ({ f, t, t0, t1, text }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  return (
    <div style={{ zIndex: 20, position: "absolute", left: 40, top: 34, transform: `scale(${s}) rotate(-2deg)`, transformOrigin: "0 0", border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,.35)", padding: "0 26px", height: 84, display: "flex", alignItems: "center",
      backgroundImage: "repeating-linear-gradient(transparent 0 26px, rgba(80,110,160,.25) 26px 27px), linear-gradient(#fbf6e6,#efe4c4)", backgroundColor: "#f6efd9", fontFamily: HAND, fontSize: 62, color: "#26314a", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// línea que se dibuja sobre el mapa (ruta, frontera, río) — puntos lon/lat, sólida o punteada, con vehículo opcional
const polyLen = (pts: [number, number][]) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
const along = (pts: [number, number][], d: number): [number, number, number] => {
  for (let i = 1; i < pts.length; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= L || i === pts.length - 1) { const k = L ? Math.min(1, d / L) : 0; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k, Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]; } d -= L; }
  return [pts[0][0], pts[0][1], 0];
};
export const Line: React.FC<C & { pts: [number, number][]; t0: number; t1: number; dur?: number; color?: string; w?: number; icon?: string; iconSize?: number; reverse?: boolean; glow?: boolean }> = ({ c, f, t, pts, t0, t1, dur = 1.6, color = "#ffd23a", w = 7, icon, iconSize = 90, reverse, glow = true }) => {
  if (!vis(t, t0, t1)) return null;
  const sp = pts.map(([lo, la]) => pj(c, lo, la));
  const L = polyLen(sp);
  const k = interpolate(t, [t0, t0 + dur], [0, 1], { ...clamp, easing: ease });
  const op = fadeOut(t, t1);
  const d = "M" + sp.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L");
  const [ix, iy] = along(sp, L * (reverse ? 1 - k : k));
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - k)} />
        <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - k)} style={{ filter: glow ? `drop-shadow(0 0 6px ${color})` : undefined }} />
      </svg>
      {icon && k > 0 && k < 1 && <Img src={sf(`icons/${icon}.png`)} style={{ position: "absolute", left: ix, top: iy + Math.sin(f / 5) * 2, width: iconSize, transform: "translate(-50%,-70%)", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }} />}
    </AbsoluteFill>
  );
};
// ruta punteada que crece (estilo Fortune) — los puntos aparecen hasta el avance
export const Dots: React.FC<C & { pts: [number, number][]; t0: number; t1: number; dur?: number; color?: string; icon?: string; iconSize?: number; gap?: number }> = ({ c, f, t, pts, t0, t1, dur = 1.8, color = "#fff", icon, iconSize = 92, gap = 26 }) => {
  if (!vis(t, t0, t1)) return null;
  const sp = pts.map(([lo, la]) => pj(c, lo, la));
  const L = polyLen(sp);
  const k = interpolate(t, [t0, t0 + dur], [0, 1], { ...clamp, easing: ease });
  const op = fadeOut(t, t1);
  const n = Math.floor((L * k) / gap);
  const dots = [];
  for (let i = 0; i <= n; i++) { const [x, y] = along(sp, i * gap); dots.push(<div key={i} style={{ position: "absolute", left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: color, boxShadow: "0 0 6px rgba(0,0,0,.6)" }} />); }
  const [ix, iy] = along(sp, L * k);
  return (
    <div style={{ opacity: op }}>
      {dots}
      {icon && k < 1 && k > 0 && <Img src={sf(`icons/${icon}.png`)} style={{ position: "absolute", left: ix, top: iy + Math.sin(f / 6) * 3, width: iconSize, transform: "translate(-50%,-75%)", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }} />}
    </div>
  );
};
// círculo de radio real (km) alrededor de un punto
export const Radius: React.FC<C & { lon: number; lat: number; km: number; t0: number; t1: number; color?: string; label?: string }> = ({ c, f, t, lon, lat, km, t0, t1, color = "#ff3b30", label }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const rx = (km / (111.32 * Math.cos((lat * Math.PI) / 180))) * PPD * c.z, ry = (km / 110.6) * PPDY * c.z;
  const k = interpolate(t, [t0, t0 + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x - rx * k, top: y - ry * k, width: 2 * rx * k, height: 2 * ry * k, borderRadius: "50%", border: `5px dashed ${color}`, background: `${color}22`, boxShadow: `0 0 24px ${color}66` }}>
      {label && <div style={{ position: "absolute", left: "50%", top: -8, transform: `translate(-50%,-100%) scale(${pop(f, t0 + 0.5)})`, background: color, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 30, padding: "4px 14px", borderRadius: 6, border: "2px solid #fff", whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};

// Portal: foto o clip real que se abre en círculo desde un punto del mapa y se vuelve a cerrar (sin cortes)
export type PortalSpec = { src: string; t0: number; t1: number; lon: number; lat: number; maxR?: number; video?: boolean; zoom?: [number, number]; pan?: [number, number]; credit?: string; label?: string; startFrom?: number };
export const Portal: React.FC<{ c: Cam; t: number; f: number; p: PortalSpec }> = ({ c, t, f, p }) => {
  const k = Math.min(interpolate(t, [p.t0, p.t0 + 0.5], [0, 1], { ...clamp, easing: ease }), interpolate(t, [p.t1 - 0.5, p.t1], [1, 0], { ...clamp, easing: ease }));
  if (k <= 0) return null;
  const [cx0, cy0] = pj(c, p.lon, p.lat);
  const cx = Math.max(-200, Math.min(2120, cx0)), cy = Math.max(-200, Math.min(1280, cy0));
  const r = (p.maxR ?? 2300) * k;
  const ring = p.maxR ? 1 : interpolate(k, [0, 0.15, 0.6], [1, 1, 0], clamp);
  const prog = (t - p.t0) / (p.t1 - p.t0);
  const [z0, z1] = p.zoom ?? [1.12, 1.02];
  const [px, py] = p.pan ?? [0, 0];
  const tr = `scale(${z0 + (z1 - z0) * prog}) translate(${px * prog}px,${py * prog}px)`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 10 }}>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        {p.video ? <OffthreadVideo src={sf(p.src)} muted startFrom={Math.round((p.startFrom ?? 0) * FPS)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: tr }} />
          : <Img src={sf(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: tr }} />}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.4) 100%)" }} />
        {p.label && <div style={{ position: "absolute", left: 60, bottom: 70, transform: `scale(${pop(f, p.t0 + 0.35)})`, transformOrigin: "0 100%", background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: "8px 22px", borderRadius: 8, border: "3px solid #fff", textTransform: "uppercase", letterSpacing: 1.5 }}>{p.label}</div>}
        {p.credit && <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: SANS, fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,.75)", textShadow: "0 1px 2px #000" }}>{p.credit}</div>}
      </AbsoluteFill>
      {ring > 0 && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "7px solid #fff", opacity: ring, boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
    </AbsoluteFill>
  );
};

// Foto enmarcada (polaroid) clavada a un punto del mapa con una línea
export const PhotoPin: React.FC<C & { src: string; lon: number; lat: number; t0: number; t1: number; x: number; y: number; w?: number; rot?: number; caption?: string }> = ({ c, f, t, src, lon, lat, t0, t1, x, y, w = 520, rot = -3, caption }) => {
  if (!vis(t, t0, t1)) return null;
  const [px, py] = pj(c, lon, lat);
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const prog = (t - t0) / (t1 - t0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={px} y1={py} x2={x} y2={y} stroke="#fff" strokeWidth={4} strokeOpacity={s} strokeDasharray="10 8" /></svg>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, background: "#fbfaf5", padding: "14px 14px 0", boxShadow: "0 18px 40px rgba(0,0,0,.55)" }}>
        <div style={{ width: w, height: w * 0.6, overflow: "hidden" }}><Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - 0.06 * prog})` }} /></div>
        <div style={{ height: caption ? 62 : 18, fontFamily: HAND, fontSize: 42, color: "#26314a", textAlign: "center", lineHeight: "60px" }}>{caption}</div>
      </div>
    </AbsoluteFill>
  );
};

// pictograma de gente (1 de 20 resaltado)
export const People: React.FC<{ f: number; t: number; t0: number; t1: number; n: number; hi: number; x: number; y: number; label?: string }> = ({ f, t, t0, t1, n, hi, x, y, label }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: "rgba(12,14,20,.9)", border: "3px solid rgba(255,255,255,.9)", borderRadius: 14, padding: "18px 24px", boxShadow: "0 18px 40px rgba(0,0,0,.55)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 46px)", gap: 6 }}>
        {Array.from({ length: n }).map((_, i) => {
          const on = i < hi && t > t0 + 0.6;
          const k = pop(f, t0 + 0.05 * i, 12);
          return <svg key={i} width={46} height={70} viewBox="0 0 46 70" style={{ transform: `scale(${k})` }}><circle cx={23} cy={13} r={11} fill={on ? "#ffd23a" : "#8a8f99"} /><path d="M6 68 L6 38 Q6 27 23 27 Q40 27 40 38 L40 68 Z" fill={on ? "#ffd23a" : "#8a8f99"} /></svg>;
        })}
      </div>
      {label && <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: "#fff", textAlign: "center", textTransform: "uppercase" }}>{label}</div>}
    </div>
  );
};

// viñeta + blur de movimiento se arman en Main
export type Chapter = {
  T0: number; T1: number;
  keys: Key[];
  World?: React.FC<{ t: number; z: number; f: number }>;
  Screen: React.FC<C>;
  full?: number[]; // t0 de ventanas de avatar que van a pantalla completa (el resto = círculo)
  sfx?: [number, string, number, number][];
};

// número que rueda (odómetro simple) en caja, anclado a pantalla
export const Num: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; value: number; prefix?: string; suffix?: string; label?: string; color?: string; size?: number; dur?: number }> = ({ f, t, t0, t1, x, y, value, prefix = "", suffix = "", label, color = "#ffd23a", size = 64, dur = 1.1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const p = interpolate(t, [t0 + 0.05, t0 + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const v = Math.round(value * p).toLocaleString("en-US");
  return (
    <div style={{ zIndex: 20, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: "rgba(12,14,20,.9)", border: "3px solid rgba(255,255,255,.9)", borderRadius: 12, padding: "8px 22px 10px", boxShadow: "0 10px 26px rgba(0,0,0,.5)", textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", lineHeight: 1.1 }}>{prefix}{v}{suffix}</div>
      {label && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size * 0.34, color: "#fff", letterSpacing: 1, textTransform: "uppercase", opacity: 0.88, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};
