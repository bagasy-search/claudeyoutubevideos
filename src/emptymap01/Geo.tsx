import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing } from "remotion";
import { sf, FPS, FONT, ACC, RED } from "./common";
import geo from "./geo.json";

// Rasters NASA GIBS (dominio público) en plate carrée: [archivo, oeste, sur, este, norte]
export const RASTERS: Record<string, [string, number, number, number, number]> = {
  world: ["maps/world.jpg", -180, -60, 180, 75],
  africa: ["maps/africa.jpg", -20, -36, 60, 42],
  basin: ["maps/basin.jpg", 22, -4, 42, 33],
  day: ["maps/day_eg.jpg", 24, 21, 37.5, 33],
  relief: ["maps/relief_eg.jpg", 24, 21, 37.5, 33],
  modis: ["maps/delta_modis.jpg", 29, 29, 33, 31.8],
  nightw: ["maps/night_world.jpg", -20, -36, 60, 42],
  night: ["maps/night_eg.jpg", 24, 21, 37.5, 33],
  lights: ["maps/night_lights.jpg", 24, 21, 37.5, 33],
};

export type Cam = [number, number, number, number]; // t(s), lon, lat, ancho visible en grados
export type Key = [number, number]; // t(s), valor

const ease = Easing.bezier(0.45, 0, 0.25, 1);
export const kv = (t: number, keys: Key[]) => {
  if (!keys.length) return 1;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1]; const [t1, v1] = keys[i];
      return v0 + (v1 - v0) * ease((t - t0) / Math.max(1e-6, t1 - t0));
    }
  }
  return keys[keys.length - 1][1];
};
const camAt = (t: number, cams: Cam[]) => {
  if (t <= cams[0][0]) return cams[0];
  for (let i = 1; i < cams.length; i++) {
    if (t <= cams[i][0]) {
      const a = cams[i - 1], b = cams[i];
      const k = ease((t - a[0]) / Math.max(1e-6, b[0] - a[0]));
      // zoom en log para que el viaje se sienta parejo
      const w = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
      return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, w] as Cam;
    }
  }
  return cams[cams.length - 1];
};

export const KX = Math.cos((26.5 * Math.PI) / 180); // corrección de aspecto de la plate carrée a la latitud de Egipto

export type El =
  | { k: "border"; c: string; t: number; color?: string; w?: number; fill?: string; out?: number }
  | { k: "river"; r: string; t: number; color?: string; w?: number; dur?: number; out?: number }
  | { k: "line"; pts: [number, number][]; t: number; out?: number; color?: string; w?: number; dash?: boolean; dur?: number; label?: string }
  | { k: "poly"; pts: [number, number][]; t: number; out?: number; color?: string; fill?: string; dash?: boolean }
  | { k: "pin"; lon: number; lat: number; label: string; t: number; out?: number; color?: string; side?: "l" | "r"; big?: boolean }
  | { k: "area"; lon: number; lat: number; label: string; sub?: string; t: number; out?: number; size?: number; color?: string }
  | { k: "band"; lat1: number; lat2: number; t: number; out?: number; labels?: boolean }
  | { k: "hadley"; t: number; out?: number }
  | { k: "ring"; lon: number; lat: number; t: number; out?: number; color?: string; r?: number }
  | { k: "us"; t: number; out?: number }
  | { k: "lake"; t: number; out?: number }
  | { k: "flow"; r: string; t: number; out?: number; color?: string };

type Props = { from: number; cams: Cam[]; layers: { id: string; op?: Key[]; blend?: string; filter?: string }[]; els?: El[]; dim?: Key[]; tint?: { color: string; op: Key[]; box: [number, number, number, number] } };

export const GeoShot: React.FC<Props> = ({ from, cams, layers, els = [], dim, tint }) => {
  const f = useCurrentFrame();
  const t = from + f / FPS;
  const [, lon, lat, w] = camAt(t, cams);
  const ppd = 1920 / w; // px por grado (latitud)
  const X = (lo: number) => 960 + (lo - lon) * ppd * KX;
  const Y = (la: number) => 540 - (la - lat) * ppd;
  const P = (p: [number, number]) => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`;
  const path = (pts: [number, number][], close = false) => "M" + pts.map(P).join("L") + (close ? "Z" : "");
  const op = (a: number, b?: number, fade = 0.5) =>
    interpolate(t, [a, a + fade, b ?? 1e9, (b ?? 1e9) + fade], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const draw = (a: number, dur = 1.6) => interpolate(t, [a, a + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

  const img = (id: string) => {
    const [src, W, S, E, N] = RASTERS[id];
    return { src: sf(src), left: X(W), top: Y(N), width: (E - W) * ppd * KX, height: (N - S) * ppd };
  };
  const C: any = geo;
  return (
    <AbsoluteFill style={{ background: "#05060a", overflow: "hidden" }}>
      {layers.map((L, i) => {
        const g = img(L.id);
        const o = L.op ? kv(t, L.op) : 1;
        if (o <= 0.001) return null;
        if (g.left > 1920 || g.top > 1080 || g.left + g.width < 0 || g.top + g.height < 0) return null;
        return (
          <Img key={i} src={g.src} style={{ position: "absolute", left: g.left, top: g.top, width: g.width, height: g.height, opacity: o, mixBlendMode: (L.blend as any) || "normal", filter: L.filter }} />
        );
      })}
      {tint && kv(t, tint.op) > 0.001 && (
        <div style={{ position: "absolute", left: X(tint.box[0]), top: Y(tint.box[3]), width: (tint.box[2] - tint.box[0]) * ppd * KX, height: (tint.box[3] - tint.box[1]) * ppd,
          background: `radial-gradient(ellipse at 50% 50%, ${tint.color} 0%, ${tint.color} 45%, transparent 72%)`, mixBlendMode: "multiply", opacity: kv(t, tint.op) }} />
      )}
      {dim && <AbsoluteFill style={{ background: "#000", opacity: kv(t, dim) }} />}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#fff" /></marker>
        </defs>
        {els.map((e, i) => {
          if (e.k === "border") {
            const o = op(e.t, e.out); if (!o) return null;
            const rings: [number, number][][] = C.countries[e.c] || [];
            const d = draw(e.t, 2.2);
            return <g key={i} opacity={o} filter="url(#glow)">{rings.map((r, j) => <path key={j} d={path(r, true)} fill={e.fill ? e.fill : "none"} stroke={e.color || "#fff"} strokeWidth={e.w || 3} pathLength={1} strokeDasharray={`${d} 1`} strokeLinejoin="round" />)}</g>;
          }
          if (e.k === "river" || e.k === "flow") {
            const o = op(e.t, e.out); if (!o) return null;
            const ls: [number, number][][] = C.rivers[e.r] || [];
            const d = e.k === "river" ? draw(e.t, (e as any).dur || 2.5) : 1;
            const off = e.k === "flow" ? -((t - e.t) * 0.25) % 1 : 0;
            return <g key={i} opacity={o} filter="url(#glow)">{ls.map((r, j) => <path key={j} d={path(r)} fill="none" stroke={e.color || "#4fc3ff"} strokeWidth={(e as any).w || 4} strokeLinecap="round" pathLength={1}
              strokeDasharray={e.k === "flow" ? "0.04 0.06" : `${d} 1`} strokeDashoffset={off} />)}</g>;
          }
          if (e.k === "line") {
            const o = op(e.t, e.out); if (!o) return null;
            const d = draw(e.t, e.dur || 1.4);
            const mid = e.pts[Math.floor(e.pts.length / 2)];
            const last = e.pts[e.pts.length - 1];
            return <g key={i} opacity={o}>
              <path d={path(e.pts)} fill="none" stroke={e.color || ACC} strokeWidth={e.w || 4} strokeLinecap="round" pathLength={1} strokeDasharray={e.dash ? `0.012 0.012` : `${d} 1`} filter="url(#glow)" opacity={e.dash ? d : 1} />
              {e.label && <text x={X((mid[0] + last[0]) / 2) + 14} y={Y((mid[1] + last[1]) / 2)} fill="#fff" fontFamily={FONT} fontWeight={800} fontSize={44} stroke="#000" strokeWidth={7} paintOrder="stroke" opacity={draw(e.t + 0.6, 0.6)}>{e.label}</text>}
            </g>;
          }
          if (e.k === "poly") {
            const o = op(e.t, e.out, 0.8); if (!o) return null;
            return <path key={i} d={path(e.pts, true)} opacity={o} fill={e.fill || "rgba(255,211,77,0.18)"} stroke={e.color || ACC} strokeWidth={3} strokeDasharray={e.dash ? "10 8" : undefined} />;
          }
          if (e.k === "pin") {
            const o = op(e.t, e.out, 0.35); if (!o) return null;
            const x = X(e.lon), y = Y(e.lat); const s = interpolate(t, [e.t, e.t + 0.35], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
            const L = e.side === "l";
            const fs = e.big ? 58 : 42;
            return <g key={i} opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
              <circle r={e.big ? 13 : 9} fill={e.color || ACC} stroke="#000" strokeWidth={3} />
              <circle r={(e.big ? 13 : 9) + 10 + 8 * Math.sin((t - e.t) * 4)} fill="none" stroke={e.color || ACC} strokeWidth={2} opacity={0.6} />
              <text x={L ? -22 : 22} y={fs * 0.35} textAnchor={L ? "end" : "start"} fill="#fff" fontFamily={FONT} fontWeight={800} fontSize={fs} stroke="#000" strokeWidth={7} paintOrder="stroke">{e.label}</text>
            </g>;
          }
          if (e.k === "area") {
            const o = op(e.t, e.out, 0.6); if (!o) return null;
            const x = X(e.lon), y = Y(e.lat); const sz = (e.size || 54) * 1.3;
            return <g key={i} opacity={o}>
              <text x={x} y={y} textAnchor="middle" fill={e.color || "#fff"} fontFamily={FONT} fontWeight={900} fontSize={sz} letterSpacing={sz * 0.12} stroke="#000" strokeWidth={8} paintOrder="stroke">{e.label}</text>
              {e.sub && <text x={x} y={y + sz * 0.95} textAnchor="middle" fill={ACC} fontFamily={FONT} fontWeight={800} fontSize={sz * 0.75} stroke="#000" strokeWidth={7} paintOrder="stroke">{e.sub}</text>}
            </g>;
          }
          if (e.k === "band") {
            const o = op(e.t, e.out, 0.8); if (!o) return null;
            const y1 = Y(e.lat2), y2 = Y(e.lat1);
            return <g key={i} opacity={o}>
              <rect x={0} y={y1} width={1920} height={y2 - y1} fill="rgba(255,120,40,0.20)" />
              {[e.lat1, e.lat2].map((la, j) => <g key={j}><line x1={0} x2={1920 * draw(e.t, 1.2)} y1={Y(la)} y2={Y(la)} stroke={ACC} strokeWidth={3} strokeDasharray="14 10" />
                {e.labels !== false && <text x={30} y={Y(la) - 12} fill={ACC} fontFamily={FONT} fontWeight={800} fontSize={34} stroke="#000" strokeWidth={6} paintOrder="stroke">{la}°N</text>}</g>)}
            </g>;
          }
          if (e.k === "hadley") {
            const o = op(e.t, e.out, 0.8); if (!o) return null;
            // celda de Hadley: sube en el ecuador, viaja al norte por arriba, baja hacia los ~25-30°N
            const ph = ((t - e.t) * 0.35) % 1;
            const ys = Y(2), yn = Y(27), yTop = Y(14) - 330;
            const xs = [700, 960, 1220];
            return <g key={i} opacity={o}>
              {xs.map((x0, j) => {
                const d = `M${x0 - 90},${ys} C${x0 - 90},${yTop} ${x0 + 60},${yTop} ${x0 + 60},${yn}`;
                return <g key={j}>
                  <path d={d} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} />
                  <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray="0.08 0.92" strokeDashoffset={-ph} markerEnd="url(#arr)" filter="url(#glow)" />
                </g>;
              })}
              <text x={1500} y={yn - 30} fill="#ffb26b" fontFamily={FONT} fontWeight={900} fontSize={40} stroke="#000" strokeWidth={7} paintOrder="stroke">SINKING DRY AIR</text>
              <text x={1500} y={ys + 10} fill="#9fd8ff" fontFamily={FONT} fontWeight={900} fontSize={40} stroke="#000" strokeWidth={7} paintOrder="stroke">RISING WET AIR</text>
            </g>;
          }
          if (e.k === "ring") {
            const o = op(e.t, e.out, 0.3); if (!o) return null;
            const x = X(e.lon), y = Y(e.lat);
            return <g key={i} opacity={o}>{[0, 0.33, 0.66].map((k, j) => {
              const ph = (((t - e.t) * 0.7 + k) % 1);
              return <circle key={j} cx={x} cy={y} r={(e.r || 160) * ph} fill="none" stroke={e.color || RED} strokeWidth={5} opacity={1 - ph} />;
            })}</g>;
          }
          if (e.k === "us") {
            const o = op(e.t, e.out, 0.6); if (!o) return null;
            const d = draw(e.t, 1.8);
            return <g key={i} opacity={o} filter="url(#glow)">
              {[...C.tx, ...C.nm].map((r: any, j: number) => <path key={j} d={path(r, true)} fill="rgba(80,160,255,0.22)" stroke="#7cc4ff" strokeWidth={4} pathLength={1} strokeDasharray={`${d} 1`} />)}
              <text x={X(29.0)} y={Y(26.2)} textAnchor="middle" fill="#cfe8ff" fontFamily={FONT} fontWeight={900} fontSize={40} stroke="#000" strokeWidth={7} paintOrder="stroke" opacity={draw(e.t + 1, 0.6)}>TEXAS</text>
              <text x={X(24.6)} y={Y(29.6)} textAnchor="middle" fill="#cfe8ff" fontFamily={FONT} fontWeight={900} fontSize={34} stroke="#000" strokeWidth={7} paintOrder="stroke" opacity={draw(e.t + 1.2, 0.6)}>NEW MEXICO</text>
            </g>;
          }
          if (e.k === "lake") {
            const o = op(e.t, e.out, 0.6); if (!o) return null;
            return <g key={i} opacity={o} filter="url(#glow)">{C.lakes.filter((l: any) => l.name !== "Lake Tana").map((l: any, j: number) => <path key={j} d={path(l.pts, true)} fill="rgba(79,195,255,0.35)" stroke="#4fc3ff" strokeWidth={3} />)}</g>;
          }
          return null;
        })}
      </svg>
    </AbsoluteFill>
  );
};
