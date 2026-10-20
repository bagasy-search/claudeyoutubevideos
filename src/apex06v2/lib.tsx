// apex06 v2 · "un solo plano" — núcleo del mundo continuo copiado de cgordie1 (src/cg1/lib.tsx), adaptado al mundo entero:
// un mapa vector (world.json, equirectangular K px/°), una cámara que viaja todo el video, capas de pantalla proyectadas
import tilesRaw from "./world_tiles.json";
const WT = tilesRaw as { T: number; tiles: { x: number; y: number; l: string; c: string; b: string }[] };
// desde lon/lat y portales a clips/fotos reales. Todo anclado a la PALABRA (words.json = ASR Groq de la narración).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import worldRaw from "./world.json";
import wordsRaw from "./words.json";

export const { fontFamily: SANS } = loadFont("normal", { weights: ["700", "800", "900"] });
export const FPS = 30;
export const G = 28.3; // gancho "vos estás ahí" (gancho.tsx, voz propia de 26,8 s): la narración arranca en el segundo 28,3
export const sf = (p: string) => staticFile("apex06/" + p);
export const WD: any = worldRaw;
export const K: number = WD.K;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const RED = "#e3261c", GOLD = "#ffd23a", ORANGE = "#ff8a2a", INK = "#f4efe6";

// ───────── proyección: px del mundo (equirectangular) ─────────
export const P = (lon: number, lat: number): [number, number] => [(lon + 180) * K, (90 - lat) * K];

// ───────── tiempo anclado a la palabra (devuelve segundos del VIDEO: narración + G) ─────────
type Wd = { text: string; startMs: number; endMs: number };
const WORDS = (wordsRaw as Wd[]).map((w) => ({ n: w.text.toLowerCase().replace(/[^a-z0-9]/g, ""), s: w.startMs / 1000 + G, e: w.endMs / 1000 + G }));
const memo = new Map<string, number>();
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
export const atEnd = (phrase: string, after = 0): number => {
  const s = at(phrase, after); const n = phrase.trim().split(/\s+/).length;
  const i = WORDS.findIndex((w) => w.s === s); return WORDS[Math.min(WORDS.length - 1, i + n - 1)].e;
};
export const speaking = (x: number) => { for (const w of WORDS) { if (x < w.s - 0.05) return false; if (x <= w.e + 0.08) return true; } return false; };

// ───────── cámara: [t, lon, lat, span°] (span = grados de longitud que entran en los 1920 px) ─────────
export type Key = [number, number, number, number];
export type Cam = { x: number; y: number; z: number };
const zOf = (span: number) => 1920 / (span * K);
export const makeCam = (KEYS: Key[]) => (t: number): Cam => {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const [ax, ay] = P(a[1], a[2]), [bx, by] = P(b[1], b[2]);
  const za = zOf(a[3]), zb = zOf(b[3]);
  const z = Math.exp(Math.log(za) + (Math.log(zb) - Math.log(za)) * k);
  const dist = Math.hypot(bx - ax, by - ay) * Math.min(za, zb);
  const arc = dist > 900 ? 1 - Math.min(0.45, dist / 7000) * Math.sin(Math.PI * k) : 1; // arco de vuelo en traslados largos
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, z: z * arc };
};
export const proj = (c: Cam, wx: number, wy: number): [number, number] => [(wx - c.x) * c.z + 960, (wy - c.y) * c.z + 540];
export const pj = (c: Cam, lon: number, lat: number) => proj(c, ...P(lon, lat));

export const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });
export const fadeOut = (t: number, t1: number, d = 0.35) => interpolate(t, [t1 - d, t1], [1, 0], clamp);
export const vis = (t: number, t0: number, t1: number) => t >= t0 - 0.05 && t <= t1 + 0.05;
export const ramp = (t: number, t0: number, d = 0.4) => interpolate(t, [t0, t0 + d], [0, 1], { ...clamp, easing: ease });
export const win = (t: number, t0: number, t1: number, d = 0.4) => Math.min(ramp(t, t0, d), 1 - ramp(t, t1 - d, d));

// ───────── el mundo (vector, dentro de la cámara) ─────────
// el mundo en baldosas de 15° (world_tiles.json, sale de D:/rtmp/apex/apex06/v2/tiles.py): sólo se dibujan las que ve la
// cámara. Con el path entero de 700 KB ampliado ×3-4 el farm (swangle) tardaba ~25 s por cuadro.
export const WorldBase: React.FC<{ c: Cam }> = ({ c }) => {
  const z = c.z, zs = 1 / z;
  const vis = visTiles(c);
  return (
    <>
      {Array.from({ length: 25 }, (_, j) => <line key={"m" + j} x1={j * 15 * K} y1={0} x2={j * 15 * K} y2={180 * K} stroke="#fff" strokeOpacity={0.05} strokeWidth={1.2 * zs} />)}
      {Array.from({ length: 13 }, (_, j) => <line key={"p" + j} x1={0} y1={j * 15 * K} x2={360 * K} y2={j * 15 * K} stroke="#fff" strokeOpacity={0.05} strokeWidth={1.2 * zs} />)}
      <g transform={`translate(${6 * zs} ${8 * zs})`} opacity={0.6}>{vis.map((tl, i) => tl.l ? <path key={i} d={tl.l} fill="#06121b" /> : null)}</g>
      {vis.map((tl, i) => tl.l ? <path key={i} d={tl.l} fill="#c98a4a" /> : null)}
      {vis.map((tl, i) => tl.c ? <path key={i} d={tl.c} fill="none" stroke="#f3d3a6" strokeOpacity={0.55} strokeWidth={1.6 * zs} strokeLinejoin="round" /> : null)}
      {vis.map((tl, i) => tl.b ? <path key={i} d={tl.b} fill="none" stroke="#7a4e24" strokeOpacity={0.5} strokeWidth={1.3 * zs} strokeLinejoin="round" /> : null)}
    </>
  );
};
export const Country: React.FC<{ name: string; z: number; op: number; fill?: string }> = ({ name, z, op, fill = "#ffb05c" }) =>
  // sin filtros CSS (un drop-shadow sobre el país ampliado tardaba ~25 min por tramo en el farm): el brillo es un trazo ancho y tenue
  op <= 0.001 ? null : (
    <g>
      <path d={WD.hl[name]} fill="none" stroke="#fff" strokeOpacity={0.22 * op} strokeWidth={12 / z} strokeLinejoin="round" />
      <path d={WD.hl[name]} fill={fill} fillOpacity={0.55 * op} stroke="#fff" strokeOpacity={op} strokeWidth={3 / z} strokeLinejoin="round" />
    </g>
  );
// zona de distribución (anillos lon/lat), crece desde un punto, borde blando
export const ringPath = (r: number[][]) => "M" + r.map(([lo, la]) => P(lo, la).join(",")).join("L") + "Z";
export const Range: React.FC<{ id: string; rings: number[][][]; from: [number, number]; k: number; op?: number; color?: string }> = ({ id, rings, from, k, op = 1, color = "#ff5a2a" }) => {
  if (k <= 0 || op <= 0) return null;
  const [cx, cy] = P(...from);
  // sin filtros (blur ampliado = lento en el farm): relleno + borde claro, recortado por la tierra visible (landclip de Main)
  return (
    <g opacity={op}>
      <clipPath id={`rg_${id}`}><circle cx={cx} cy={cy} r={110 * K * k} /></clipPath>
      <g clipPath={`url(#rg_${id})`}><g clipPath="url(#landclip)">
        {rings.map((r, j) => <path key={j} d={ringPath(r)} fill={color} fillOpacity={0.5} stroke="#ffe2b8" strokeOpacity={0.9} strokeWidth={2.5 * K / 20} strokeDasharray="10 7" strokeLinejoin="round" />)}
      </g></g>
    </g>
  );
};
// trazo que se dibuja (ferrocarril, persecución, frontera cruzada): puntos lon/lat, k = 0→1
export const Trail: React.FC<{ pts: [number, number][]; k: number; z: number; color?: string; w?: number; dash?: boolean; op?: number }> = ({ pts, k, z, color = "#fff", w = 5, dash, op = 1 }) => {
  if (k <= 0 || op <= 0) return null;
  const d = "M" + pts.map(([lo, la]) => P(lo, la).join(",")).join("L");
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={(w + 4) / z} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`} />
      <path d={d} fill="none" stroke={color} strokeWidth={w / z} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`} />
      {dash && <path d={d} fill="none" stroke="#111" strokeWidth={(w * 0.5) / z} strokeDasharray={`${8 / z} ${8 / z}`} opacity={0.8} />}
    </g>
  );
};
export const visTiles = (c: Cam) => {
  const hw = 960 / c.z + 40 / c.z, hh = 540 / c.z + 40 / c.z;
  return WT.tiles.filter((tl) => tl.x < c.x + hw && tl.x + WT.T > c.x - hw && tl.y < c.y + hh && tl.y + WT.T > c.y - hh);
};

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
export const Pin: React.FC<C & { lon: number; lat: number; t0: number; t1: number; label?: string; side?: "r" | "l" | "t" | "b"; color?: string; size?: number }> = ({ c, f, t, lon, lat, t0, t1, label, side = "r", color = RED, size = 34 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  const pulse = ((t - t0) * 1.2) % 1;
  const off = { r: [22, 0, "0%"], l: [-22, 0, "-100%"], t: [0, -36, "-50%"], b: [0, 36, "-50%"] }[side] as [number, number, string];
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `3px solid ${color}`, opacity: (1 - pulse) * s, transform: `scale(${0.3 + pulse})` }} />
      <div style={{ position: "absolute", left: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: color, border: "3px solid #fff", transform: `scale(${s})`, boxShadow: "0 3px 8px rgba(0,0,0,.5)" }} />
      {label && <div style={{ position: "absolute", left: off[0], top: off[1], transform: `translate(${off[2]},-50%) scale(${s})`, transformOrigin: side === "l" ? "100% 50%" : "0 50%", fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 1, textShadow: "0 2px 0 #000, 0 0 12px rgba(0,0,0,.85)" }}>{label}</div>}
    </div>
  );
};
// recorte (PNG sin fondo) de un felino parado sobre un punto del mapa
export const Cat: React.FC<C & { src: string; lon: number; lat: number; t0: number; t1: number; h?: number; grey?: number; flip?: boolean }> = ({ c, f, t, src, lon, lat, t0, t1, h = 120, grey = 0, flip }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = pj(c, lon, lat);
  const s = pop(f, t0, 10) * fadeOut(t, t1);
  return <Img src={sf(`cut/${src}.png`)} style={{ position: "absolute", left: x, top: y, height: h, transform: `translate(-50%,-92%) scale(${flip ? -s : s},${s})`, filter: `drop-shadow(0 10px 10px rgba(0,0,0,.5)) grayscale(${grey}) brightness(${1 - grey * 0.4})` }} />;
};
export const BigWord: React.FC<{ f: number; t: number; t0: number; t1: number; text: React.ReactNode; y?: number; x?: number; size?: number }> = ({ f, t, t0, t1, text, y = 150, x = 960, size = 120 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 8) * fadeOut(t, t1, 0.25);
  return <div style={{ zIndex: 20, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 4px 0 #1b1b1b, 0 8px 22px rgba(0,0,0,.55), 0 0 2px #000" }}>{text}</div>;
};
export const Sticker: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; rot?: number; size?: number; bg?: string; children: React.ReactNode }> = ({ f, t, t0, t1, x, y, rot = -7, size = 84, bg = "#111", children }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 7) * fadeOut(t, t1, 0.25);
  return <div style={{ zIndex: 30, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, background: bg, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: size, padding: "4px 30px 10px", border: "6px solid #fff", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{children}</div>;
};
// número que rueda en caja (anclado a pantalla)
export const Num: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; value: number; prefix?: string; label?: string; color?: string; size?: number; dur?: number; prog?: number }> = ({ f, t, t0, t1, x, y, value, prefix = "", label, color = GOLD, size = 64, dur = 1.1, prog }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1);
  const p = prog ?? interpolate(t, [t0 + 0.05, t0 + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ zIndex: 20, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: "rgba(12,14,20,.9)", border: "3px solid rgba(255,255,255,.9)", borderRadius: 12, padding: "8px 26px 12px", boxShadow: "0 10px 26px rgba(0,0,0,.5)", textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", lineHeight: 1.1 }}>{prefix}{Math.round(value * p).toLocaleString("en-US")}</div>
      {label && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size * 0.34, color: "#fff", letterSpacing: 1, textTransform: "uppercase", opacity: 0.9, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};
// puntos (una persona = un punto) que se van sumando sobre el mapa
export const Dots: React.FC<C & { pts: number[][]; k: number; op?: number; color?: string }> = ({ c, pts, k, op = 1, color = "#ff2a12" }) => {
  if (k <= 0 || op <= 0) return null;
  // un solo <svg> con círculos (antes: 436 <div> con box-shadow → ~25 min por tramo en el farm); el brillo es un círculo tenue
  const nOn = Math.floor(pts.length * k), r = Math.max(2.4, Math.min(5, K * c.z * 0.12));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      {pts.slice(0, nOn).map(([lo, la], j) => {
        const [x, y] = pj(c, lo, la), age = (nOn - j) / 14, sc = Math.min(1, age) * (1 + 0.8 * Math.max(0, 1 - age));
        return <g key={j}><circle cx={x} cy={y} r={r * sc * 1.9} fill={color} fillOpacity={0.28} /><circle cx={x} cy={y} r={r * sc} fill={color} /></g>;
      })}
    </svg>
  );
};

// Portal: clip o foto real que se abre en círculo desde un punto del mapa y se vuelve a cerrar (nunca un corte).
// maxR = portal chico (ventana redonda con borde); sin maxR = se abre a pantalla completa.
export type PortalSpec = { src: string; t0: number; t1: number; lon: number; lat: number; maxR?: number; video?: boolean; zoom?: [number, number]; pan?: [number, number]; credit?: string; label?: string; startFrom?: number; dx?: number; dy?: number; sx?: number; sy?: number; noOpen?: boolean; dc?: number };
export const Portal: React.FC<{ c: Cam; t: number; f: number; p: PortalSpec }> = ({ c, t, f, p }) => {
  const dc = p.dc ?? 0.55;
  const k = Math.min(p.noOpen ? 1 : interpolate(t, [p.t0, p.t0 + 0.55], [0, 1], { ...clamp, easing: ease }), interpolate(t, [p.t1 - dc, p.t1], [1, 0], { ...clamp, easing: ease }));
  const mounted = t >= p.t0 - 0.4 && t <= p.t1 + 0.1; // preroll: el clip ya está montado (decodificado) antes de abrirse
  if (!mounted) return null;
  const [cx0, cy0] = p.sx != null ? [p.sx, p.sy!] : pj(c, p.lon, p.lat);
  const cx = Math.max(-200, Math.min(2120, cx0 + (p.dx ?? 0) * k)), cy = Math.max(-200, Math.min(1280, cy0 + (p.dy ?? 0) * k));
  const r = Math.max(0.01, (p.maxR ?? 2300) * k);
  const ring = p.maxR ? 1 : interpolate(k, [0, 0.15, 0.6], [1, 1, 0], clamp);
  const prog = (t - p.t0) / (p.t1 - p.t0);
  const [z0, z1] = p.zoom ?? [1.12, 1.02];
  const [px, py] = p.pan ?? [0, 0];
  const tr = `scale(${z0 + (z1 - z0) * prog}) translate(${px * prog}px,${py * prog}px)`;
  // ventana chica: la toma se encuadra en el círculo (antes se estiraba a pantalla completa y el círculo mostraba sólo un recorte)
  const box: React.CSSProperties = p.maxR ? { position: "absolute", left: cx - p.maxR, top: cy - p.maxR, width: 2 * p.maxR, height: 2 * p.maxR, objectFit: "cover", transform: tr } : { position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: tr };
  // preroll de hasta 12 cuadros: el Sequence arranca antes y el clip retrocede lo mismo → en t0 se ve exactamente startFrom
  const sF = Math.round((p.startFrom ?? 0) * FPS), pre = Math.min(12, sF, Math.round(p.t0 * FPS));
  const from = Math.round(p.t0 * FPS) - pre;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 10, opacity: k > 0 ? 1 : 0 }}>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        {p.video ? (
          <Sequence from={from} layout="none">
            <OffthreadVideo src={sf(p.src)} muted startFrom={sF - pre} style={box} />
          </Sequence>
        ) : <Img src={sf(p.src)} style={box} />}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.4) 100%)" }} />
        {p.label && <div style={{ position: "absolute", left: 60, bottom: 70, transform: `scale(${pop(f, p.t0 + 0.35)})`, transformOrigin: "0 100%", background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: "8px 22px", borderRadius: 8, border: "3px solid #fff", textTransform: "uppercase", letterSpacing: 1.5 }}>{p.label}</div>}
        {p.credit && <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: SANS, fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,.75)", textShadow: "0 1px 2px #000" }}>{p.credit}</div>}
      </AbsoluteFill>
      {ring > 0 && k > 0 && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "7px solid #fff", opacity: ring, boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
    </AbsoluteFill>
  );
};

export type Chapter = {
  T0: number; T1: number;
  keys: Key[];
  World?: React.FC<{ t: number; z: number; f: number }>;
  Screen: React.FC<C>;
  sfx?: [number, string, number, number][]; // [t, archivo en public/sfx, volumen, duración]
  amb?: [number, number, string, number][]; // audio real de los clips de portal: [t0, t1, clip, startFrom]
  portals?: PortalSpec[]; // los dibuja Main; los .mp4 suman su audio real a la mezcla (amb) solos
};
// atajo de portal: pv("atk/x.mp4", t0, t1, lon, lat, {…})
export const pv = (src: string, t0: number, t1: number, lon: number, lat: number, o: Partial<PortalSpec> = {}): PortalSpec =>
  ({ src, t0, t1, lon, lat, video: src.endsWith(".mp4"), ...o });
// número tachado que cambia por otro (135 → 35)
export const Swap: React.FC<{ f: number; t: number; t0: number; tx: number; t1: number; x: number; y: number; a: string; b: string; label?: string; size?: number }> = ({ f, t, t0, tx, t1, x, y, a, b, label, size = 96 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 12) * fadeOut(t, t1), k = ramp(t, tx, 0.35), nb = pop(f, tx + 0.3, 9);
  return (
    <div style={{ zIndex: 20, position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: "rgba(12,14,20,.9)", border: "3px solid rgba(255,255,255,.9)", borderRadius: 12, padding: "8px 30px 12px", boxShadow: "0 10px 26px rgba(0,0,0,.5)", textAlign: "center" }}>
      <div style={{ display: "flex", gap: 34, alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.1 }}>
        <span style={{ position: "relative", color: k > 0.5 ? "#8a8f99" : GOLD }}>{a}<span style={{ position: "absolute", left: -8, top: "52%", height: 10, width: `calc(${k * 100}% + 16px)`, background: RED, borderRadius: 5, transform: "rotate(-8deg)" }} /></span>
        {tx < t && <span style={{ color: "#ff5a3a", transform: `scale(${nb})`, display: "inline-block" }}>{b}</span>}
      </div>
      {label && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size * 0.32, color: "#fff", letterSpacing: 1, textTransform: "uppercase", opacity: 0.9, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};
