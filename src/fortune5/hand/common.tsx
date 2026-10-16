// piezas compartidas por los capítulos hechos a mano
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, interpolate, Easing } from "remotion";
import { P, proj, pop, fadeOut, vis, ease, clamp, MapSkins, SANS, HAND, W, H } from "../Main";

import { sf } from "../sf";
export type K = [number, number, number, number]; // t, lon, lat, zoom
export type Cam = { x: number; y: number; z: number; tilt: number; moving: boolean };
export const camOf = (keys: K[], t: number): Cam => {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1];
  const k = ease(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  const [ax, ay] = P(a[1], a[2]), [bx, by] = P(b[1], b[2]);
  const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
  const dist = Math.hypot(bx - ax, by - ay) * Math.min(a[3], b[3]);
  const arc = dist > 900 ? 1 - 0.35 * Math.sin(Math.PI * k) : 1;
  const zz = z * arc;
  // nunca mostrar el borde del mapa
  const hw = 960 / zz, hh = 540 / zz;
  const x = Math.min(W - hw, Math.max(hw, ax + (bx - ax) * k)), y = Math.min(H - hh, Math.max(hh, ay + (by - ay) * k));
  return { x, y, z: zz, tilt: 0, moving: false };
};
export const blurOf = (keys: K[], t: number, fps: number) => {
  const c = camOf(keys, t), c0 = camOf(keys, t - 1 / fps);
  return Math.min(10, (Math.hypot(c.x - c0.x, c.y - c0.y) * c.z + Math.abs(Math.log(c.z / c0.z)) * 900) * 0.25);
};

export const World: React.FC<{ c: Cam; modern: number; children?: React.ReactNode }> = ({ c, modern, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(960px,540px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)` }}>
    <MapSkins modern={modern} />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>
  </div>
);

// nota de papel con el año (arriba a la izquierda), da vuelta al cambiar
export const YearCorner: React.FC<{ f: number; t: number; marks: [number, string][] }> = ({ f, t, marks }) => {
  const cur = [...marks].reverse().find(([t0]) => t >= t0);
  if (!cur) return null;
  const s = pop(f, cur[0], 9);
  const flip = interpolate(t - cur[0], [0, 0.5], [180, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={sf("icons/hourglass.png")} style={{ width: 74, transform: `rotate(${flip}deg)`, filter: "drop-shadow(0 6px 8px rgba(0,0,0,.4))" }} />
      <div style={{ transform: `scale(${s}) rotate(-2deg)`, border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,.35)", padding: "0 26px", height: 84, display: "flex", alignItems: "center",
        backgroundImage: "repeating-linear-gradient(transparent 0 26px, rgba(80,110,160,.25) 26px 27px), linear-gradient(#fbf6e6,#efe4c4)", backgroundColor: "#f6efd9", fontFamily: HAND, fontSize: 62, color: "#26314a" }}>{cur[1]}</div>
    </div>
  );
};

// portal circular desde un punto del mapa a una foto (con zoom lento continuo) o a un clip
export const Portal2: React.FC<{ c: Cam; t: number; lon: number; lat: number; t0: number; t1: number; src: string; video?: boolean; maxR?: number; caption?: string; dx?: number; dy?: number }> = ({ c, t, lon, lat, t0, t1, src, video, maxR = 330, caption, dx = 0, dy = 0 }) => {
  const k = Math.min(interpolate(t, [t0, t0 + 0.5], [0, 1], { ...clamp, easing: ease }), interpolate(t, [t1 - 0.45, t1], [1, 0], { ...clamp, easing: ease }));
  if (k <= 0) return null;
  const [px, py] = proj(c, ...P(lon, lat));
  const cx = px + dx, cy = py + dy;
  const r = maxR * k;
  const prog = (t - t0) / (t1 - t0);
  const full = maxR > 1500;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {!full && <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={px} y1={py} x2={cx} y2={cy} stroke="#fff" strokeWidth={5} opacity={k} /><circle cx={px} cy={py} r={9 * k} fill="#fff" /></svg>}
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        <div style={full ? { position: "absolute", inset: 0, overflow: "hidden" } : { position: "absolute", left: cx - maxR * 1.25, top: cy - maxR * 1.25, width: maxR * 2.5, height: maxR * 2.5, overflow: "hidden" }}>
          {video
            ? <OffthreadVideo src={sf(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.16 - 0.12 * prog})` }} />
            : <Img src={sf(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: full ? `scale(${1.06 + 0.3 * prog}) translateX(${(prog - 0.5) * 7}%)` : `scale(${1.08 + 0.16 * prog}) translateX(${(prog - 0.5) * 4}%)` }} />}
        </div>
      </AbsoluteFill>
      {!full && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "7px solid #fff", boxShadow: "0 0 30px rgba(0,0,0,.5)" }} />}
      {caption && k > 0.6 && <div style={{ position: "absolute", left: cx, top: cy + r + 10, transform: `translateX(-50%) scale(${k})`, background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 30, padding: "6px 16px", borderRadius: 6, border: "2px solid #fff", textTransform: "uppercase", whiteSpace: "nowrap" }}>{caption}</div>}
    </AbsoluteFill>
  );
};

// barra que crece desde un país (con valor odómetro)
export const MapBar: React.FC<{ c: Cam; f: number; t: number; lon: number; lat: number; t0: number; t1: number; value: number; max: number; color: string; label: string }> = ({ c, f, t, lon, lat, t0, t1, value, max, color, label }) => {
  if (!vis(t, t0, t1)) return null;
  const [x, y] = proj(c, ...P(lon, lat));
  const k = interpolate(t, [t0, t0 + 1.0], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) * fadeOut(t, t1);
  const h = 360 * (value / max) * k;
  return (
    <div style={{ position: "absolute", left: x - 50, top: y - h, width: 100, height: h }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${color}, ${color}cc)`, border: "4px solid #fff", borderBottom: "none", borderRadius: "10px 10px 0 0", boxShadow: "0 10px 26px rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", left: 50, top: -64, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>${Math.round(value * k).toLocaleString("en-US")}</div>
      <div style={{ position: "absolute", left: 50, top: h + 8, transform: "translateX(-50%)", background: "#111", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 24, padding: "4px 12px", borderRadius: 6, border: "2px solid #fff", whiteSpace: "nowrap", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

// texto escrito a mano que aparece letra por letra
export const HandNote: React.FC<{ f: number; t: number; t0: number; t1: number; x: number; y: number; text: string; size?: number; color?: string; rot?: number }> = ({ f, t, t0, t1, x, y, text, size = 80, color = "#fff", rot = -3 }) => {
  if (!vis(t, t0, t1)) return null;
  const n = Math.floor(interpolate(t, [t0, t0 + Math.min(1.2, text.length * 0.045)], [0, text.length], clamp));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, opacity: fadeOut(t, t1), fontFamily: HAND, fontSize: size, color, textShadow: "0 4px 14px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>
      {text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

// vía de tren dibujándose sobre el mapa (en coordenadas de mapa), con durmientes
export const Rail: React.FC<{ pts: [number, number][]; t: number; t0: number; dur: number; z: number; op?: number; color?: string }> = ({ pts, t, t0, dur, z, op = 1, color = "#2b2b2b" }) => {
  const k = interpolate(t, [t0, t0 + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  if (k <= 0 || op <= 0) return null;
  const xy = pts.map(([lo, la]) => P(lo, la));
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  let L = 0; for (let i = 1; i < xy.length; i++) L += Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke="#fff" strokeWidth={9 / z} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} />
      <path d={d} fill="none" stroke={color} strokeWidth={5 / z} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} />
      <path d={d} fill="none" stroke={color} strokeWidth={13 / z} strokeDasharray={`${2 / z} ${9 / z}`} strokeLinejoin="round" opacity={interpolate(k, [0.85, 1], [0, 1], clamp)} />
    </g>
  );
};
// punto a lo largo de una polilínea (para trenes que recorren la vía)
export const along = (pts: [number, number][], k: number): [number, number] => {
  const xy = pts.map(([lo, la]) => P(lo, la));
  const seg: number[] = []; let L = 0;
  for (let i = 1; i < xy.length; i++) { const s = Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]); seg.push(s); L += s; }
  let d = L * Math.max(0, Math.min(1, k));
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const u = d / seg[i]; return [xy[i][0] + (xy[i + 1][0] - xy[i][0]) * u, xy[i][1] + (xy[i + 1][1] - xy[i][1]) * u]; } d -= seg[i]; }
  return xy[xy.length - 1];
};

export const Vignette = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.28) 100%)", pointerEvents: "none" }} />;
