import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import geoRaw from "./geo.json";
import bounds from "./map_bounds.json";
import timemap from "./timemap.json";
import sfxList from "./sfx.json";
import { Counter, GdpChart, Terrain3D, useTerrainTextures } from "./v3";
import words from "./words.json";
import { EvidenceDesk } from "./desk";
import { deskScene, DESK_T0, DESK_T1 } from "./desk_scene";

import { sf } from "./sf";
const Audio = (_: any) => null; // farm: el audio final sale del WAV máster premezclado

const { fontFamily: SANS } = loadFont("normal", { weights: ["700", "800", "900"] });
const { fontFamily: HAND } = loadHand("normal", { weights: ["700"] });
const geo: any = geoRaw;
const FPS = 30;
const W = bounds.W, H = bounds.H, PPD = bounds.PPD;
const P = (lon: number, lat: number): [number, number] => [(lon - bounds.L) * PPD, (bounds.T - lat) * PPD];
const sec = (f: number) => f / FPS;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── CÁMARA: un solo plano-secuencia ─────────────────────────
// [t, lon, lat, zoom, tilt]  — nunca queda quieta: entre llaves cercanas siempre hay deriva.
const KEYS: [number, number, number, number, number][] = [
  [0.0, -80, 2, 0.55, 0],
  [1.4, -70, -18, 0.62, 0],
  [2.6, -64, -36, 0.95, 0],
  [4.0, -63.5, -37, 1.02, 0],
  [4.4, -66, -33, 0.85, 0],
  [7.0, -66.5, -32, 0.9, 0],
  [8.0, -76, 6, 0.27, 0],
  [9.5, -78, 8, 0.29, 0],
  [10.3, -96, 48, 0.5, 0],
  [11.3, -95, 46, 0.58, 0],
  [12.2, -92, 40, 0.44, 0],
  [13.3, -77, 6, 0.29, 0],
  [14.4, -77, 6, 0.3, 0],
  [16.8, -78, 7, 0.32, 0],
  [17.5, -100, 58, 0.62, 0],
  [18.3, -99, 57, 0.66, 0],
  [19.0, -64, -36, 0.95, 0],
  [19.8, -64, -37, 1.0, 0],
  [20.6, -79, 7, 0.3, 0],
  [21.9, -78, 6, 0.31, 0],
  [22.7, -61, -34.5, 1.9, 0],
  [23.7, -61.5, -35, 2.05, 0],
  [24.5, -104, 53, 1.35, 0],
  [25.3, -103, 53, 1.42, 0],
  [26.3, -28, 40, 0.45, 0],
  [27.6, -36, 22, 0.33, 0],
  [29.4, -60, 8, 0.28, 0],
  [30.8, -62, 8, 0.29, 0],
  [31.7, -103, 52, 0.72, 0],
  [32.5, -102, 52, 0.76, 0],
  [33.2, -61, -34, 0.9, 0],
  [33.8, -50, 10, 0.29, 0],
  [34.6, -40, 16, 0.32, 0],
  [35.3, -46, 14, 0.3, 0],
  [37.8, -55, 12, 0.31, 0],
  [38.6, -77, 6, 0.27, 0],
  [41.0, -77, 6, 0.28, 0],
  [42.6, -61, -35, 2.2, 38],
  [44.2, -61.3, -35.4, 2.4, 42],
  [45.1, -106, 53, 1.3, 0],
  [48.6, -106, 52.5, 1.45, 0],
  [51.9, -104, 53, 1.3, 0],
  [53.0, -61, -35, 1.9, 0],
  [54.2, -61, -35.6, 2.1, 40],
  [56.0, -61, -35.3, 2.0, 34],
  [56.7, -61, -35.2, 2.0, 0],
  [59.6, -61, -35, 1.85, 0],
  [60.6, -77, 6, 0.27, 0],
  [66.0, -77, 6, 0.285, 0],
];
function cam(t: number) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const [ax, ay] = P(a[1], a[2]), [bx, by] = P(b[1], b[2]);
  const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
  // en vuelos largos la cámara se aleja un poco a mitad de camino (arco de vuelo)
  const dist = Math.hypot(bx - ax, by - ay) * Math.min(a[3], b[3]);
  const arc = dist > 900 ? 1 - 0.35 * Math.sin(Math.PI * k) : 1;
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, z: z * arc, tilt: a[4] + (b[4] - a[4]) * k, moving: k > 0.02 && k < 0.98 && dist > 300 };
}
const proj = (c: ReturnType<typeof cam>, wx: number, wy: number): [number, number] => [(wx - c.x) * c.z + 960, (wy - c.y) * c.z + 540];

// ───────────────────────── helpers de tiempo ─────────────────────────
let TM: number[][] = timemap as number[][];
function realT(y: number) {
  const M = TM;
  for (let i = 1; i < M.length; i++) if (y <= M[i][1]) { const [a, b] = [M[i - 1], M[i]]; return a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); }
  return M[M.length - 1][0] + (y - M[M.length - 1][1]);
}
function remapT(x: number) {
  const M = TM;
  if (x <= M[0][0]) return M[0][1];
  for (let i = 1; i < M.length; i++) if (x <= M[i][0]) { const [a, b] = [M[i - 1], M[i]]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
  return M[M.length - 1][1] + (x - M[M.length - 1][0]);
}
const pop = (f: number, t0: number, damping = 11) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping, stiffness: 180, mass: 0.6 } });
const fadeOut = (t: number, t1: number, d = 0.35) => interpolate(t, [t1 - d, t1], [1, 0], clamp);
const vis = (t: number, t0: number, t1: number) => t >= t0 - 0.05 && t <= t1 + 0.05;

// ───────────────────────── capas del mundo (dentro de la cámara) ─────────────────────────
const MapSkins: React.FC<{ modern: number }> = ({ modern }) => (
  <>
    <Img src={sf("world_antique.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />
    <Img src={sf("world_modern.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: modern }} />
    {Object.entries(bounds.insets as Record<string, number[]>).map(([n, [l, r, t, b]]) => {
      const [x, y] = P(l, t);
      const st: React.CSSProperties = {
        position: "absolute", left: x, top: y, width: (r - l) * PPD, height: (t - b) * PPD,
        WebkitMaskImage: "radial-gradient(ellipse closest-side at center, #000 55%, transparent 100%)", maskImage: "radial-gradient(ellipse closest-side at center, #000 55%, transparent 100%)",
      };
      return (
        <React.Fragment key={n}>
          <Img src={sf(`${n}_antique.jpg`)} style={st} />
          <Img src={sf(`${n}_modern.jpg`)} style={{ ...st, opacity: modern }} />
        </React.Fragment>
      );
    })}
  </>
);

const Country: React.FC<{ iso: string; color: string; op: number; z: number; glow?: string }> = ({ iso, color, op, z, glow = "#fff" }) =>
  op <= 0.001 ? null : (
    <path d={geo.countries[iso].d} fill={color} fillOpacity={0.74 * op} stroke={glow} strokeOpacity={op} strokeWidth={3.2 / z}
      style={{ filter: `drop-shadow(0 0 ${6 / z}px ${glow})` }} strokeLinejoin="round" />
  );

// extrusión 3D: capas apiladas que suben, cara superior brillante
const Extrude: React.FC<{ iso: string; h: number; z: number; top: string; side: string }> = ({ iso, h, z, top, side }) => {
  if (h <= 0.01) return null;
  const N = 16, step = (h * 26) / N / Math.max(z, 0.3);
  return (
    <g>
      <path d={geo.countries[iso].d} fill="#000" fillOpacity={0.35 * h} transform={`translate(${10 / z},${8 / z})`} style={{ filter: `blur(${8 / z}px)` }} />
      {Array.from({ length: N }).map((_, k) => (
        <path key={k} d={geo.countries[iso].d} fill={side} transform={`translate(0,${-k * step})`} />
      ))}
      <path d={geo.countries[iso].d} fill={top} stroke="#fff8d0" strokeWidth={2.5 / z} transform={`translate(0,${-N * step})`} />
    </g>
  );
};

// cuadrícula de homesteads en las praderas (aparece en ola)
const HomesteadGrid: React.FC<{ t: number; z: number; t0: number }> = ({ t, z, t0 }) => {
  if (t < t0) return null;
  const pr: [number, number][] = geo.prairiesPoly;
  const xs = pr.map((p) => p[0]), ys = pr.map((p) => p[1]);
  const S = 21, cells: React.ReactElement[] = [];
  const [ox, oy] = P(-110, 51.5);
  for (let x = Math.min(...xs); x < Math.max(...xs); x += S)
    for (let y = Math.min(...ys); y < Math.max(...ys); y += S) {
      const d = Math.hypot(x - ox, y - oy);
      const k = interpolate(t - t0 - d / 520, [0, 0.25], [0, 1], clamp);
      if (k <= 0) continue;
      const shade = (Math.floor(x / S) + Math.floor(y / S)) % 2 ? "#f6c945" : "#e9b42c";
      const s = S * (0.4 + 0.6 * k);
      cells.push(<rect key={`${x}_${y}`} x={x + (S - s) / 2} y={y + (S - s) / 2} width={s} height={s} fill={shade} fillOpacity={0.82 * k} stroke="#fff6cf" strokeWidth={1.4 / z} />);
    }
  return (
    <g>
      <clipPath id="prairies"><path d={["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("")} /></clipPath>
      <g clipPath="url(#prairies)">{cells}</g>
    </g>
  );
};

// latifundios: pocas parcelas enormes que se dibujan con trazo grueso
const ESTATES = [
  [-65.8, -30.5, -61.6, -33.2], [-61.6, -29.4, -58.2, -32.8], [-65.8, -33.2, -62.4, -36.4],
  [-62.4, -33.2, -59.6, -35.2], [-59.6, -32.8, -56.8, -35.9], [-66, -36.4, -62.6, -39.6],
  [-62.6, -35.2, -59.4, -37.6], [-59.4, -35.9, -56.8, -39.6], [-62.6, -37.6, -59.4, -39.6],
];
const Estates: React.FC<{ t: number; z: number; t0: number }> = ({ t, z, t0 }) => {
  if (t < t0) return null;
  const tones = ["#b5452b", "#c96a2c", "#9c3a2a", "#d08a3a", "#a9502f", "#c05a32", "#8e3326", "#cf7a34", "#b04a2e"];
  return (
    <g>
      <clipPath id="pampas"><path d={geo.prov.Pampas.d} /></clipPath>
      <g clipPath="url(#pampas)">
        {ESTATES.map(([l, tp, r, b], i) => {
          const k = interpolate(t, [t0 + i * 0.22, t0 + i * 0.22 + 0.55], [0, 1], clamp);
          const [x0, y0] = P(l, tp), [x1, y1] = P(r, b);
          const per = 2 * (x1 - x0 + y1 - y0);
          return (
            <rect key={i} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={tones[i]} fillOpacity={0.62 * k}
              stroke="#3a1d10" strokeWidth={5 / z} strokeDasharray={per} strokeDashoffset={per * (1 - k)} />
          );
        })}
      </g>
      <path d={geo.prov.Pampas.d} fill="none" stroke="#fff3d6" strokeWidth={3 / z} strokeOpacity={interpolate(t, [t0, t0 + 0.4], [0, 1], clamp)} />
    </g>
  );
};

const Region: React.FC<{ d: string; op: number; z: number; color: string }> = ({ d, op, z, color }) =>
  op <= 0.001 ? null : <path d={d} fill={color} fillOpacity={0.55 * op} stroke="#fffbe0" strokeWidth={3 / z} strokeOpacity={op} style={{ filter: `drop-shadow(0 0 ${8 / z}px #ffe27a)` }} />;

// ───────────────────────── capas de pantalla (fuera de la cámara) ─────────────────────────
const Tag: React.FC<{ c: any; f: number; t: number; lon: number; lat: number; t0: number; t1: number; text: string; dy?: number; bg?: string; size?: number }> = ({ c, f, t, lon, lat, t0, t1, text, dy = 0, bg = "#111", size = 30 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, ...P(lon, lat));
  const s = pop(f, t0) * fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x, top: y + dy, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 0.6, padding: "6px 14px 7px", borderRadius: 6, border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 6px 16px rgba(0,0,0,.45)", whiteSpace: "nowrap", textTransform: "uppercase" }}>
      {text}
    </div>
  );
};

const Icon: React.FC<{ c: any; f: number; t: number; src: string; lon: number; lat: number; t0: number; t1: number; size?: number; dx?: number; dy?: number }> = ({ c, f, t, src, lon, lat, t0, t1, size = 110, dx = 0, dy = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, ...P(lon, lat));
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  const bob = Math.sin((f + lon * 7) / 14) * 4;
  const sz = size * Math.min(1.6, Math.max(0.75, Math.sqrt(c.z / 0.6)));
  return <Img src={sf(`icons/${src}.png`)} style={{ position: "absolute", left: x + dx, top: y + dy + bob, width: sz, transform: `translate(-50%,-80%) scale(${s})`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.4))" }} />;
};

const Flag: React.FC<{ c: any; f: number; t: number; cc: string; lon: number; lat: number; t0: number; t1: number; w?: number; dx?: number; dy?: number }> = ({ c, f, t, cc, lon, lat, t0, t1, w = 64, dx = 0, dy = 0 }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, ...P(lon, lat));
  const s = pop(f, t0, 9) * fadeOut(t, t1);
  return <Img src={sf(`flag_${cc}.png`)} style={{ position: "absolute", left: x + dx, top: y + dy, width: w, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, border: "3px solid #fff", borderRadius: 4, boxShadow: "0 6px 14px rgba(0,0,0,.45)" }} />;
};

const BigWord: React.FC<{ f: number; t: number; t0: number; t1: number; text: React.ReactNode; y?: number; size?: number }> = ({ f, t, t0, t1, text, y = 150, size = 120 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 8) * fadeOut(t, t1, 0.25);
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: SANS, fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 2, whiteSpace: "nowrap",
      textShadow: "0 4px 0 #1b1b1b, 0 8px 22px rgba(0,0,0,.55), 0 0 2px #000" }}>{text}</div>
  );
};

const Sticker: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; children: React.ReactNode }> = ({ f, t, t0, t1, x, y, children }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 7) * fadeOut(t, t1, 0.25);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(-7deg) scale(${s})`, background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 84, padding: "4px 30px 10px", border: "6px solid #fff", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>{children}</div>
  );
};

// nota de papel con el año (arriba a la izquierda) + reloj de arena
const YearNote: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const label = t < 7.84 ? "1908" : t < 44.24 ? "Today" : "1880s";
  const swaps = [0.2, 7.84, 44.24];
  const last = Math.max(0, ...swaps.filter((s) => s <= t));
  const s = pop(f, last, 9);
  const flip = interpolate(t - last, [0, 0.5], [180, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={sf("icons/hourglass.png")} style={{ width: 74, transform: `rotate(${flip}deg)`, filter: "drop-shadow(0 6px 8px rgba(0,0,0,.4))" }} />
      <div style={{ transform: `scale(${s}) rotate(-2deg)`, border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,.35)", padding: "0 26px", height: 84, display: "flex", alignItems: "center",
        backgroundImage: "repeating-linear-gradient(transparent 0 26px, rgba(80,110,160,.25) 26px 27px), linear-gradient(#fbf6e6,#efe4c4)", backgroundColor: "#f6efd9", fontFamily: HAND, fontSize: 62, color: "#26314a" }}>{label}</div>
    </div>
  );
};

// rastreador arriba a la derecha: 3 casilleros que se completan (tierra / gente / clientes)
const Tracker: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const items = [["wheat", 35.2], ["people", 36.12], ["ship", 36.98]] as const;
  return (
    <div style={{ position: "absolute", right: 36, top: 30, display: "flex", gap: 12 }}>
      {items.map(([ic, t0]) => {
        const done = t >= t0;
        const s = done ? 1 + 0.25 * Math.max(0, 1 - (t - t0) * 3) : 1;
        return (
          <div key={ic} style={{ width: 66, height: 66, borderRadius: 33, background: done ? "#1d1d1d" : "rgba(20,20,20,.75)", border: `4px solid ${done ? "#ffd23a" : "#fff"}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, boxShadow: "0 6px 14px rgba(0,0,0,.4)", position: "relative" }}>
            {done ? <Img src={sf(`icons/${ic}.png`)} style={{ width: 52 }} /> : <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#ffd23a" }}>?</span>}
            {done && <div style={{ position: "absolute", right: -6, bottom: -6, width: 28, height: 28, borderRadius: 14, background: "#3bb54a", border: "3px solid #fff", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>}
          </div>
        );
      })}
    </div>
  );
};

// barras de riqueza 3D (columna dorada que sube / cae)
const WealthBar: React.FC<{ c: any; t: number; lon: number; lat: number; t0: number; t1: number; from: number; to: number; tEnd: number; color: string; arrow: "up" | "down" }> = ({ c, t, lon, lat, t0, t1, from, to, tEnd, color, arrow }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, ...P(lon, lat));
  const hIn = interpolate(t, [t0, t0 + 0.4], [0, from], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const h = t < t0 + 0.5 ? hIn : interpolate(t, [t0 + 0.5, tEnd], [from, to], { ...clamp, easing: ease });
  const op = fadeOut(t, t1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op }}>
      <div style={{ position: "absolute", left: -26, bottom: 0, width: 52, height: h, background: `linear-gradient(90deg, ${color} 0%, #fff6b0 35%, ${color} 60%, #7a5a08 100%)`, borderRadius: "6px 6px 2px 2px", boxShadow: "0 10px 18px rgba(0,0,0,.45)", border: "2px solid #fff" }} />
      <div style={{ position: "absolute", left: -26, bottom: h - 6, width: 52, height: 14, background: "#fff4a8", borderRadius: "50%", border: "2px solid #fff" }} />
      {t > t0 + 0.6 && (
        <div style={{ position: "absolute", left: 34, bottom: h - 30, fontSize: 56, fontWeight: 900, fontFamily: SANS, color: arrow === "up" ? "#3bd45a" : "#ff3b30", textShadow: "0 3px 0 #000, 0 6px 14px rgba(0,0,0,.5)" }}>{arrow === "up" ? "▲" : "▼"}</div>
      )}
    </div>
  );
};

// rutas punteadas que se dibujan + barco que viaja
function bez(a: [number, number], b: [number, number], bend: number) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny);
  const cx = mx + (nx / L) * bend, cy = my + (ny / L) * bend;
  return (k: number): [number, number] => [(1 - k) ** 2 * a[0] + 2 * (1 - k) * k * cx + k * k * b[0], (1 - k) ** 2 * a[1] + 2 * (1 - k) * k * cy + k * k * b[1]];
}
const Route: React.FC<{ c: any; t: number; f: number; from: [number, number]; to: [number, number]; t0: number; t1: number; dur?: number; bend?: number; ship?: boolean }> = ({ c, t, f, from, to, t0, t1, dur = 1.8, bend = 400, ship = true }) => {
  if (!vis(t, t0, t1)) return null;
  const B = bez(P(...from), P(...to), bend);
  const k = interpolate(t, [t0, t0 + dur], [0, 1], { ...clamp, easing: ease });
  const op = fadeOut(t, t1);
  const N = 46, dots = [];
  for (let i = 0; i <= N * k; i++) { const [x, y] = proj(c, ...B(i / N)); dots.push(<div key={i} style={{ position: "absolute", left: x - 5, top: y - 5, width: 10, height: 10, borderRadius: 5, background: "#fff", boxShadow: "0 0 6px rgba(0,0,0,.5)" }} />); }
  const [sx, sy] = proj(c, ...B(k));
  return (
    <div style={{ opacity: op }}>
      {dots}
      {ship && k < 1 && <Img src={sf("icons/ship.png")} style={{ position: "absolute", left: sx, top: sy + Math.sin(f / 6) * 3, width: 92, transform: "translate(-50%,-75%)", filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }} />}
    </div>
  );
};

// nubes: en el mundo (se mueven con la cámara) + intro atravesando nubes
const CLOUDS: [number, number, string, number][] = [[-128, 22, "cloud1", 0.8], [-28, 30, "cloud2", 0.7], [-24, -24, "cloud1", 0.75], [-108, -22, "cloud2", 0.8]];
const Clouds: React.FC<{ c: any; f: number; t: number }> = ({ c, f }) => (
  <>
    {CLOUDS.map(([lon, lat, src, s], i) => {
      const [x, y] = proj(c, ...P(lon + f * 0.004 * (i % 2 ? 1 : -1), lat));
      const sz = 230 * s * Math.min(2.2, Math.max(0.6, Math.sqrt(c.z / 0.35)));
      return <Img key={i} src={sf(`icons/${src}.png`)} style={{ position: "absolute", left: x, top: y, width: sz, transform: "translate(-50%,-50%)", opacity: 0.95, filter: "drop-shadow(0 26px 16px rgba(0,0,0,.25))" }} />;
    })}
  </>
);
const CloudIntro: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.6) return null;
  const k = interpolate(t, [0, 1.5], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <>
      {[[-200, -120, 1.0], [520, 180, 1.2], [1400, -60, 1.1], [900, 520, 1.3], [-100, 600, 1.2]].map(([x, y, s], i) => (
        <Img key={i} src={sf(`icons/${i % 2 ? "cloud2" : "cloud1"}.png`)} style={{ position: "absolute", left: x + (x - 860) * k * 1.6, top: y + (y - 440) * k * 1.6, width: 1100 * s * (1 + k * 2.2), opacity: 1 - k * 0.9 }} />
      ))}
    </>
  );
};


// ───────────────────────── v2: portales a clips reales, marcador, sfx, avatar ─────────────────────────
// Portal: el clip de archivo se abre en círculo desde un punto del mapa y se vuelve a cerrar (sin cortes)
const PORTALS: { src: string; t0: number; t1: number; lon: number; lat: number; maxR?: number }[] = [
  { src: "ba_avenue", t0: 2.5, t1: 4.4, lon: -55.2, lat: -36.2, maxR: 290 },
  { src: "immigrants", t0: 26.7, t1: 28.7, lon: 5, lat: 47 },
  { src: "grain", t0: 32.3, t1: 33.9, lon: -61, lat: -34 },
  { src: "plow", t0: 50.9, t1: 52.3, lon: -106, lat: 52 },
  { src: "ba_elite", t0: 63.8, t1: 65.6, lon: -62, lat: -35 },
];
const Portal: React.FC<{ c: any; t: number; p: (typeof PORTALS)[number] }> = ({ c, t, p }) => {
  const k = Math.min(interpolate(t, [p.t0, p.t0 + 0.5], [0, 1], { ...clamp, easing: ease }), interpolate(t, [p.t1 - 0.5, p.t1], [1, 0], { ...clamp, easing: ease }));
  if (k <= 0) return null;
  const [cx, cy] = proj(c, ...P(p.lon, p.lat));
  const r = (p.maxR ?? 2300) * k;
  const ring = p.maxR ? 1 : interpolate(k, [0, 0.15, 0.6], [1, 1, 0], clamp);
  const prog = (t - p.t0) / (p.t1 - p.t0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        <OffthreadVideo src={sf(`clips/${p.src}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.14 - 0.1 * prog})` }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.45) 100%)" }} />
      </AbsoluteFill>
      {ring > 0 && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "7px solid #fff", opacity: ring, boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
    </AbsoluteFill>
  );
};

// Línea de tiempo 1880→1914: los dos países se llenan de inmigrantes a la vez
const SameTime: React.FC<{ f: number; t: number; t0: number; t1: number }> = ({ f, t, t0, t1 }) => {
  if (!vis(t, t0, t1)) return null;
  const s = pop(f, t0, 13) * fadeOut(t, t1);
  const k = interpolate(t, [t0 + 0.3, t1 - 0.4], [0, 1], { ...clamp, easing: ease });
  const W = 820;
  const row = (cc: string, col: string, y: number, lag: number) => (
    <div style={{ position: "absolute", left: 0, top: y, width: W, height: 44 }}>
      <div style={{ position: "absolute", left: 80, right: 20, top: 18, height: 8, borderRadius: 4, background: "rgba(255,255,255,.18)" }} />
      <div style={{ position: "absolute", left: 80, top: 18, height: 8, borderRadius: 4, width: (W - 100) * Math.max(0, k - lag), background: col, boxShadow: `0 0 12px ${col}` }} />
      <Img src={sf(`flag_${cc}.png`)} style={{ position: "absolute", left: 10, top: 6, width: 52, borderRadius: 3 }} />
      <Img src={sf("icons/people.png")} style={{ position: "absolute", left: 80 + (W - 100) * Math.max(0, k - lag) - 26, top: -8, width: 52 }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 960 - W / 2, top: 800, width: W, height: 170, transform: `scale(${s})`, background: "rgba(12,14,20,.9)", border: "3px solid rgba(255,255,255,.9)", borderRadius: 14, fontFamily: SANS, fontWeight: 800, color: "#fff" }}>
      {row("ca", "#ffd23a", 30, 0.02)}
      {row("ar", "#ff5a4a", 86, 0)}
      <div style={{ position: "absolute", left: 90, bottom: 6, fontSize: 18, opacity: 0.7 }}>1880</div>
      <div style={{ position: "absolute", right: 24, bottom: 6, fontSize: 18, opacity: 0.7 }}>1914</div>
      <div style={{ position: "absolute", left: "50%", top: -26, transform: "translateX(-50%)", background: "#111", border: "2px solid #fff", borderRadius: 6, padding: "4px 14px", fontSize: 24, textTransform: "uppercase", whiteSpace: "nowrap" }}>Same time</div>
    </div>
  );
};

// Marcador comparativo final
const SCORE: [string, boolean, boolean, number][] = [["Land", true, true, 60.9], ["People", true, true, 61.35], ["Customers", true, true, 61.8], ["Ownership", true, false, 62.5]];
const Scoreboard: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!vis(t, 60.7, 63.9)) return null;
  const s = pop(f, 60.7, 13) * fadeOut(t, 63.9);
  const mark = (ok: boolean, t0: number) => <span style={{ display: "inline-block", width: 74, textAlign: "center", color: ok ? "#3ddc5a" : "#ff3b2f", fontSize: 46, transform: `scale(${pop(f, t0 + 0.1, 8)})` }}>{ok ? "✓" : "✗"}</span>;
  return (
    <div style={{ position: "absolute", left: 1290, top: 250, width: 560, transform: `scale(${s})`, transformOrigin: "50% 0", background: "rgba(14,16,22,.92)", border: "3px solid rgba(255,255,255,.9)", borderRadius: 14, padding: "18px 22px", fontFamily: SANS, fontWeight: 800, color: "#fff", boxShadow: "0 18px 40px rgba(0,0,0,.55)" }}>
      <div style={{ display: "flex", alignItems: "center", paddingBottom: 10, borderBottom: "2px solid rgba(255,255,255,.25)" }}>
        <span style={{ flex: 1 }} />
        <Img src={sf("flag_ca.png")} style={{ width: 54, margin: "0 10px" }} />
        <Img src={sf("flag_ar.png")} style={{ width: 54, margin: "0 10px" }} />
      </div>
      {SCORE.map(([name, a, b, t0], i) => t >= t0 - 0.05 && (
        <div key={i} style={{ display: "flex", alignItems: "center", height: 70, fontSize: 32, textTransform: "uppercase", transform: `translateX(${(1 - pop(f, t0, 12)) * 60}px)`, opacity: Math.min(1, pop(f, t0, 12)), background: i === 3 ? `rgba(227,38,28,${0.35 * Math.min(1, (t - t0) * 3)})` : "transparent", borderRadius: 8, padding: "0 8px", marginTop: 6 }}>
          <span style={{ flex: 1 }}>{name}</span>{mark(a, t0)}{mark(b, t0 + (i === 3 ? 0.35 : 0))}
        </div>
      ))}
    </div>
  );
};

// SFX: cientos de golpes bajos debajo de la voz (la voz manda)
type Ev = [number, string, number, number];
const EXTRA_SFX: Ev[] = [
  ...PORTALS.flatMap((p): Ev[] => [[p.t0 - 0.05, "sw1", 0.16, 1.2], [p.t1 - 0.45, "sw4", 0.11, 0.9]]),
  ...SCORE.map(([, , , t0], i): Ev => [t0, i === 3 ? "im1" : "ck2", i === 3 ? 0.22 : 0.18, i === 3 ? 1.6 : 0.3]),
  [62.85, "st2", 0.18, 0.45], [60.7, "sw6", 0.12, 1.0],
  [2.9, "ck6", 0.12, 1.1], [8.8, "ck6", 0.12, 1.1], [9.2, "ck3", 0.08, 1.0], [37.8, "sw2", 0.14, 0.9], [38.1, "pc1", 0.12, 1.1], [40.6, "sp2", 0.08, 1.2],
  [21.9, "wh5", 0.2, 2.0], [24.3, "wh8", 0.18, 1.4], [41.15, "wh5", 0.2, 2.4], [29.1, "sw3", 0.13, 1.0], [29.4, "tk1", 0.06, 2.0], [11.3, "wh10", 0.12, 0.8],
];
// ducking: mientras suena una palabra los efectos bajan 6 dB (la voz manda)
const W_ = words as number[][];
const duck = (frame: number) => { const x = frame / FPS; for (const [a, b] of W_) { if (x < a - 0.05) break; if (x <= b + 0.08) return 0.5; } return 1; };
const DESK_SFX: Ev[] = [
  [DESK_T0 - 0.1, "wh6", 0.16, 1.2],
  ...deskScene.items.map((it, i): Ev => [it.t0, ["pp1", "pp2", "pp4", "pp3"][i % 4], it.kind === "note" ? 0.1 : 0.14, 0.9]),
  ...deskScene.marks.map((m): Ev => [m.t0, "pc1", 0.15, 0.8]),
  ...deskScene.strings.map((m): Ev => [m.t0, "sw4", 0.09, 0.8]),
  [51.75, "wh2", 0.16, 1.0], [59.4, "wh9", 0.14, 1.4],
];
export const introSfx = (tm: number[][], tEnd: number) => { TM = tm; return [...(sfxList as Ev[]).filter(([t0]) => t0 < DESK_T0 - 0.05 || t0 > DESK_T1), ...EXTRA_SFX, ...DESK_SFX].map(([t0, file, vol, dur]) => [realT(t0), file, vol, dur] as [number, string, number, number]).filter(([t]) => t < tEnd); };
const SfxTrack: React.FC = () => (
  <>
    {[...(sfxList as Ev[]).filter(([t0]) => t0 < DESK_T0 - 0.05 || t0 > DESK_T1), ...EXTRA_SFX, ...DESK_SFX].map(([t0, file, vol, dur], i) => {
      const n = Math.max(4, Math.round(dur * FPS));
      return (
        <Sequence key={i} from={Math.max(0, Math.round(realT(t0) * FPS))} durationInFrames={n} layout="none">
          <Audio src={sf(`sfx/${file}.wav`)} volume={(fr) => vol * duck(Math.round(realT(t0) * FPS) + fr) * interpolate(fr, [n - 6, n], [1, 0], clamp)} />
        </Sequence>
      );
    })}
  </>
);

// Avatar: pantalla completa al arrancar, después circulito abajo a la derecha; vuelve grande en el WHY.
// Se prende cuando llega public/avatar.mp4 (lip-sync con voz_us.wav).
const AVATAR = false;
const AV_FULL: [number, number][] = [[0, 2.3], [40.3, 41.4]];
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  if (!AVATAR) return null;
  const full = Math.max(...AV_FULL.map(([a, b]) => Math.min(a === 0 ? 1 : interpolate(t, [a - 0.4, a], [0, 1], clamp), interpolate(t, [b, b + 0.5], [1, 0], { ...clamp, easing: ease }))));
  const R = 150, sx = 1920 - 60 - R, sy = 1080 - 60 - R;
  const cx = sx + (960 - sx) * full, cy = sy + (540 - sy) * full, rad = R + (1150 - R) * full;
  const sc = 0.42 + 0.58 * full;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ clipPath: `circle(${rad}px at ${cx}px ${cy}px)` }}>
        <OffthreadVideo src={sf("avatar.mp4")} muted style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "50% 40%", transform: `translate(${cx - 960}px,${cy - 540 + 90 * (1 - full)}px) scale(${sc})` }} />
      </AbsoluteFill>
      {full < 0.98 && <div style={{ position: "absolute", left: cx - rad, top: cy - rad, width: 2 * rad, height: 2 * rad, borderRadius: "50%", border: "6px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }} />}
    </AbsoluteFill>
  );
};

// ───────────────────────── composición ─────────────────────────
export const Main: React.FC<{ tm?: number[][]; intro?: boolean }> = ({ tm, intro }) => {
  TM = tm ?? (timemap as number[][]);
  // la voz nueva (Fish fortune_us) es más lenta: el tiempo del guion visual se remapea por palabras
  const terrainTex = useTerrainTextures();
  const tr = useCurrentFrame() / FPS;
  const t = remapT(tr);
  const f = t * FPS;
  const c = cam(t);
  // motion blur direccional proporcional a la velocidad de la cámara
  const c0 = cam(remapT(Math.max(0, tr - 1 / FPS)));
  const vx = Math.abs(c.x - c0.x) * c.z, vy = Math.abs(c.y - c0.y) * c.z, vz = Math.abs(Math.log(c.z / c0.z)) * 900;
  const bz = Math.min(5, vz * 0.25);
  const bx = Math.min(16, vx * 0.3) + bz, by = Math.min(16, vy * 0.3) + bz;
  const blurOn = bx + by > 0.6;
  const modern = interpolate(t, [7.7, 8.3, 43.9, 44.6], [0, 1, 1, 0], clamp);
  const z = c.z;
  const at = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], clamp);
  const off = (t1: number, d = 0.4) => interpolate(t, [t1, t1 + d], [1, 0], clamp);

  // opacidades de países
  const argGold = at(1.0) * off(7.6);
  const canDim = at(7.0) * off(7.9);
  const zoomHide = (1 - at(21.95, 0.3) * off(25.4, 0.5)) * (1 - at(41.2, 0.5) * off(44.0, 0.3));
  const canYellow = at(7.9) * off(44.0) * zoomHide;
  const argRed = at(7.9) * off(44.0) * zoomHide;
  const farm = at(19.9) * off(21.9);
  const extr = interpolate(t, [9.7, 10.4, 12.2, 12.6], [0, 1, 1, 0], { ...clamp, easing: ease });
  const twins = at(14.4) * off(17.2);

  const ARG = geo.countries.ARG.c, CAN = geo.countries.CAN.c;
  return (
    <AbsoluteFill style={{ background: "#2f6fb8", overflow: "hidden" }}>
      {!intro && <Audio src={sf("voz_us.wav")} />}
      <SfxTrack />
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      {/* ── mundo con cámara ── */}
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 40%", filter: blurOn ? "url(#mb)" : undefined }}>
        <AbsoluteFill style={{ transform: `rotateX(${c.tilt}deg)`, transformOrigin: "50% 55%" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(960px,540px) scale(${z}) translate(${-c.x}px,${-c.y}px)` }}>
            <MapSkins modern={modern} />
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <Country iso="ARG" color="#f2b81d" op={argGold} z={z} />
              <Country iso="CAN" color="#8a7a5c" op={canDim} z={z} />
              <Country iso="CAN" color="#f7cd1f" op={canYellow * (1 - extr)} z={z} />
              <Country iso="ARG" color="#e3261c" op={argRed} z={z} />
              <Extrude iso="CAN" h={extr} z={z} top="#ffd83a" side="#b98b06" />
              {twins > 0 && <>
                <path d={geo.countries.CAN.d} fill="none" stroke="#fff" strokeWidth={6 / z} strokeOpacity={twins * (0.6 + 0.4 * Math.sin(f / 4))} style={{ filter: `drop-shadow(0 0 ${14 / z}px #fff)` }} />
                <path d={geo.countries.ARG.d} fill="none" stroke="#fff" strokeWidth={6 / z} strokeOpacity={twins * (0.6 + 0.4 * Math.sin(f / 4))} style={{ filter: `drop-shadow(0 0 ${14 / z}px #fff)` }} />
              </>}
              <Region d={geo.prov.Pampas.d} op={farm + at(22.3) * off(23.7)} z={z} color="#9ad13a" />
              <Region d={["Alberta", "Saskatchewan", "Manitoba"].map((n) => geo.prov[n].d).join("")} op={farm + at(24.2) * off(25.6)} z={z} color="#9ad13a" />
              <HomesteadGrid t={t} z={z} t0={46.1} />
              <Estates t={t} z={z} t0={54.5} />
            </svg>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── capa de pantalla (sigue a la cámara por proyección) ── */}
      {c.tilt < 1 && <>
        <Clouds c={c} f={f} t={t} />
        {/* 1910: Argentina top 10 */}
        <Tag c={c} f={f} t={t} lon={-64} lat={-34} t0={1.1} t1={7.5} text="Argentina" />
        <Icon c={c} f={f} t={t} src="trophy" lon={-66} lat={-29} t0={2.4} t1={7.5} size={120} />
        <Tag c={c} f={f} t={t} lon={-66} lat={-29} t0={2.7} t1={7.5} text="Top 10 richest" dy={34} bg="#b8860b" size={22} />
        <Flag c={c} f={f} t={t} cc="fr" lon={-52} lat={-30} t0={4.6} t1={7.5} />
        <Flag c={c} f={f} t={t} cc="de" lon={-52} lat={-35} t0={5.84} t1={7.5} />
        <Flag c={c} f={f} t={t} cc="ca" lon={-52} lat={-40} t0={7.0} t1={7.5} />
        {[4.6, 5.84, 7.0].map((t0, i) => <Tag key={i} c={c} f={f} t={t} lon={-45.5} lat={-30 - i * 5} t0={t0 + 0.1} t1={7.5} text={["$4,854", "$5,187", "$5,694"][i]} bg="#5a5f6b" size={24} />)}
        {/* hoy: x3 */}
        <Tag c={c} f={f} t={t} lon={-100} lat={60} t0={8.6} t1={14.2} text="Canada" />
        <Tag c={c} f={f} t={t} lon={-64} lat={-36} t0={8.6} t1={14.2} text="Argentina" />
        <Sticker f={f} t={t} t0={10.1} t1={12.3} x={1230} y={170}><span style={{ color: "#ffd23a" }}>×2.5</span></Sticker>
        {/* gemelos */}
        <Flag c={c} f={f} t={t} cc="ca" lon={-100} lat={57} t0={14.6} t1={21.8} w={74} />
        <Flag c={c} f={f} t={t} cc="ar" lon={-65} lat={-33} t0={14.8} t1={21.8} w={74} />
        <Tag c={c} f={f} t={t} lon={-82} lat={10} t0={15.9} t1={17.3} text="= twins?" bg="#111" size={30} />
        <Tag c={c} f={f} t={t} lon={-100} lat={52} t0={17.5} t1={19.8} text="9.98M km²" size={24} dy={40} />
        <Tag c={c} f={f} t={t} lon={-65} lat={-38} t0={17.6} t1={19.8} text="2.78M km²" size={24} dy={40} />
        <Tag c={c} f={f} t={t} lon={-82} lat={10} t0={18.6} t1={19.8} text="Mostly empty" bg="#6b3fa0" size={28} />
        <Icon c={c} f={f} t={t} src="wheat" lon={-61} lat={-34} t0={20.9} t1={23.7} size={110} />
        <Icon c={c} f={f} t={t} src="wheat" lon={-105} lat={52} t0={21.1} t1={25.5} size={110} />
        <Tag c={c} f={f} t={t} lon={-82} lat={10} t0={20.8} t1={21.9} text="Best farmland on Earth" bg="#2a7d2e" size={28} />
        <Tag c={c} f={f} t={t} lon={-61} lat={-36.5} t0={22.6} t1={23.7} text="The Pampas" size={30} />
        <Tag c={c} f={f} t={t} lon={-105} lat={50.6} t0={24.1} t1={25.4} text="The Prairies" size={30} />
        {/* inmigrantes */}
        <Icon c={c} f={f} t={t} src="people" lon={5} lat={47} t0={25.9} t1={29.9} size={130} />
        <Route c={c} t={t} f={f} from={[-3, 46]} to={[-58.4, -34.6]} t0={26.3} t1={29.9} dur={2.2} bend={-500} />
        <Route c={c} t={t} f={f} from={[-3, 49]} to={[-63.6, 44.6]} t0={26.6} t1={29.9} dur={2.0} bend={200} />
        <Tag c={c} f={f} t={t} lon={-30} lat={30} t0={26.2} t1={29.9} text="Millions of immigrants" bg="#111" size={28} />
        {/* granos y carne → Gran Bretaña */}
        <Icon c={c} f={f} t={t} src="wheat" lon={-104} lat={52} t0={32.2} t1={37.6} size={96} dx={-50} />
        <Icon c={c} f={f} t={t} src="cow" lon={-104} lat={52} t0={32.6} t1={37.6} size={110} dx={50} />
        <Icon c={c} f={f} t={t} src="wheat" lon={-61} lat={-34} t0={32.2} t1={37.6} size={96} dx={-50} />
        <Icon c={c} f={f} t={t} src="cow" lon={-61} lat={-34} t0={32.6} t1={37.6} size={110} dx={50} />
        <Route c={c} t={t} f={f} from={[-58.4, -34.6]} to={[-4, 50]} t0={33.0} t1={37.6} dur={1.8} bend={-450} />
        <Route c={c} t={t} f={f} from={[-63.6, 44.6]} to={[-4, 51]} t0={33.2} t1={37.6} dur={1.6} bend={180} />
        <Flag c={c} f={f} t={t} cc="gb" lon={-2} lat={53} t0={34.4} t1={37.6} w={80} />
        <Tag c={c} f={f} t={t} lon={-2} lat={57.5} t0={34.5} t1={37.6} text="Britain" />
        <Tag c={c} f={f} t={t} lon={-38} lat={6} t0={35.2} t1={37.6} text="Same land" bg="#2a7d2e" size={24} />
        <Tag c={c} f={f} t={t} lon={-38} lat={1} t0={36.12} t1={37.6} text="Same people" bg="#2a7d2e" size={24} />
        <Tag c={c} f={f} t={t} lon={-38} lat={-4} t0={36.98} t1={37.6} text="Same customers" bg="#2a7d2e" size={24} />
        {/* sube / cae */}
        <Sticker f={f} t={t} t0={40.4} t1={41.3} x={960} y={190}>WHY<span style={{ color: "#ffd23a" }}>?</span></Sticker>
        {/* Canadá: 160 acres gratis */}
        <Flag c={c} f={f} t={t} cc="ca" lon={-112} lat={58.4} t0={44.5} t1={51.9} w={84} />
        <Tag c={c} f={f} t={t} lon={-104} lat={58.4} t0={45.0} t1={51.9} text="The Prairies" />
        <Tag c={c} f={f} t={t} lon={-106} lat={47.2} t0={47.9} t1={51.9} text="160 acres" bg="#b8860b" size={34} />
        <Tag c={c} f={f} t={t} lon={-99.5} lat={47.2} t0={49.4} t1={51.9} text="Free" bg="#2a9d3a" size={34} />
        {[[-113, 52.5], [-108, 51], [-103, 53.5], [-99, 50.5], [-110, 55]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src={i % 2 ? "farmhouse" : "farmer"} lon={lo} lat={la} t0={50.5 + i * 0.18} t1={51.9} size={70} />)}
        {/* Argentina: latifundios */}
        <Flag c={c} f={f} t={t} cc="ar" lon={-66.4} lat={-29.6} t0={52.3} t1={59.6} w={84} />
        <Tag c={c} f={f} t={t} lon={-61} lat={-29.6} t0={52.6} t1={59.6} text="The Pampas" />
        <Tag c={c} f={f} t={t} lon={-61} lat={-41} t0={57.24} t1={59.6} text="Giant estates" bg="#9c2a1c" size={34} />
        {[[-63.8, -31.6], [-59.8, -34.2], [-64, -38]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src={i === 1 ? "tophat" : "estancia"} lon={lo} lat={la} t0={56.9 + i * 0.4} t1={59.6} size={92} />)}
        <Tag c={c} f={f} t={t} lon={-61} lat={-43} t0={58.24} t1={59.6} text="A few hundred families" bg="#111" size={26} />
        {/* cierre */}
        {[[-112, 54], [-106, 52], [-100, 55], [-95, 51], [-117, 57], [-104, 58], [-110, 50]].map(([lo, la], i) => <Icon key={i} c={c} f={f} t={t} src="farmer" lon={lo} lat={la} t0={60.6 + i * 0.07} t1={66} size={54} />)}
        <Icon c={c} f={f} t={t} src="tophat" lon={-62} lat={-35} t0={62.7} t1={66} size={120} />
      </>}

      {/* contadores reales */}
      <Counter f={f} t={t} t0={2.9} t1={7.5} x={430} y={800} value={5829} label="Argentina · per person · 1908" font={SANS} />
      <Counter f={f} t={t} t0={8.8} t1={12.3} x={1580} y={430} value={45530} label="Canada · today" font={SANS} />
      <Counter f={f} t={t} t0={9.2} t1={12.3} x={1580} y={640} value={18292} label="Argentina · today" color="#ff6a5a" font={SANS} />
      <GdpChart f={f} t={t} t0={37.8} t1={41.3} font={SANS} />
      <SameTime f={f} t={t} t0={29.1} t1={31.6} />
      {/* relieve 3D real */}
      {vis(t, 21.95, 23.85) && <Terrain3D tex={terrainTex} name="andes" t={t} t0={21.95} t1={23.85} label="The Pampas" font={SANS} keys={[[21.95, -74.8, -33.2, 0.85, -69.5, -32.8, 0.55], [23.85, -66.5, -34.6, 1.25, -60, -35.4, 0]]} />}
      {vis(t, 24.35, 25.55) && <Terrain3D tex={terrainTex} name="rockies" t={t} t0={24.35} t1={25.55} label="The Prairies" font={SANS} keys={[[24.35, -121.5, 50.6, 0.75, -115.5, 51.4, 0.45], [25.55, -113, 52, 1.5, -104, 52, 0]]} />}
      {vis(t, 41.2, 44.25) && <Terrain3D tex={terrainTex} name="andes" t={t} t0={41.2} t1={44.25} font={SANS} keys={[[41.2, -58.5, -36.8, 0.6, -69, -33, 0.4], [44.25, -62, -34.4, 0.42, -71, -33, 0.7]]} />}
      <EvidenceDesk scene={deskScene} t={t} f={f} t0={DESK_T0} t1={DESK_T1} tr={tr} />
      <BigWord f={f} t={t} t0={13.5} t1={14.4} text="STRANGE" />
      <BigWord f={f} t={t} t0={41.6} t1={42.8} text={<span>THE SOIL<span style={{ color: "#ffd23a" }}>?</span></span>} size={110} />
      <BigWord f={f} t={t} t0={43.1} t1={44.4} text={<span>WHO <span style={{ color: "#ffd23a" }}>OWNED</span> IT?</span>} size={110} y={190} />

      <Scoreboard f={f} t={t} />
      {PORTALS.map((p, i) => <Portal key={i} c={c} t={t} p={p} />)}
      <YearNote f={f} t={t} />
      <Tracker f={f} t={t} />
      <CloudIntro t={t} />
      <Avatar t={t} />
      {/* viñeta suave como el original */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.28) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// piezas del minuto 1 para los capítulos hechos a mano (src/hand/*)
export { P, proj, pop, fadeOut, vis, ease, clamp, MapSkins, Country, Region, Tag, Icon, Flag, BigWord, Sticker, Route, Clouds, Portal, SANS, HAND, W, H, geo, FPS };
