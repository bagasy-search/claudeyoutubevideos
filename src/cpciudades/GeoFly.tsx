// cpciudades · vuelo de mapa sobre rasters NASA GIBS (Blue Marble, dominio público) en plate carrée.
// Cámara por keys [t, lon, lat, ancho en grados]; zoom en log; capas que se funden por ancho visible.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SANS, ROMAN, EMBER, EMBER2, W, H, k01, ease, easeOut, shadow } from "./lib";

// [archivo, oeste, sur, este, norte]
export const RASTERS: Record<string, [string, number, number, number, number]> = {
  world: ["world.jpg", -180, -60, 180, 75],
  caribe: ["caribe.jpg", -92, 2, -56, 26],
  europa: ["europa.jpg", -30, 25, 40, 55],
  jamaica: ["jamaica.jpg", -78.6, 17.0, -75.8, 18.8],
  vargas: ["vargas.jpg", -68.0, 10.2, -66.0, 11.0],
  martinica: ["martinica.jpg", -61.4, 14.3, -60.7, 15.0],
  tolima: ["tolima.jpg", -76.0, 4.2, -74.2, 5.6],
  lisboa: ["lisboa.jpg", -12.5, 35.0, -6.0, 40.0],
  napoles: ["napoles.jpg", 13.6, 40.5, 14.7, 41.1],
  corinto: ["corinto.jpg", 21.5, 37.6, 23.5, 38.6],
};
export type Cam = [number, number, number, number];
export type Mark =
  | { k: "pin"; lon: number; lat: number; label: string; sub?: string; t: number; out?: number; side?: "l" | "r"; red?: boolean }
  | { k: "ring"; lon: number; lat: number; t: number; out?: number; r?: number }
  | { k: "line"; pts: [number, number][]; t: number; out?: number; dur?: number; label?: string; dash?: boolean; red?: boolean; arrow?: boolean }
  | { k: "ruler"; a: [number, number]; b: [number, number]; t: number; out?: number; label: string }
  | { k: "zone"; pts: [number, number][]; t: number; out?: number }
  | { k: "strike"; lon: number; lat: number; label: string; t: number; tStrike: number; out?: number }
  | { k: "title"; text: string; sub?: string; num?: string; t: number; out?: number };

const camAt = (t: number, cams: Cam[]): Cam => {
  if (t <= cams[0][0]) return cams[0];
  for (let i = 1; i < cams.length; i++) if (t <= cams[i][0]) {
    const a = cams[i - 1], b = cams[i], k = ease((t - a[0]) / Math.max(1e-6, b[0] - a[0]));
    const w = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
    // el centro sigue al zoom en log (si no, en un zoom fuerte el punto final "llega" tarde y se ve resbalar)
    const kk = Math.abs(Math.log(b[3] / a[3])) > 0.3 ? (Math.log(a[3]) - Math.log(w)) / (Math.log(a[3]) - Math.log(b[3])) : k;
    return [t, a[1] + (b[1] - a[1]) * kk, a[2] + (b[2] - a[2]) * kk, w];
  }
  return cams[cams.length - 1];
};

export const GeoFly: React.FC<{ t: number; cams: Cam[]; marks?: Mark[]; layers?: string[]; drift?: number }> = ({ t, cams, marks = [], layers = Object.keys(RASTERS), drift = 0.012 }) => {
  const [, lon0, lat0, w0] = camAt(t, cams);
  const w = w0 * (1 - drift * Math.sin(t * 0.4)), lon = lon0, lat = lat0;
  const kx = Math.cos((lat * Math.PI) / 180), ppd = W / w;
  const X = (lo: number) => W / 2 + (lo - lon) * ppd * kx;
  const Y = (la: number) => H / 2 - (la - lat) * ppd;
  const P = (p: [number, number]) => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`;
  const op = (a: number, b?: number, f = 0.45) => Math.min(k01(t, a, a + f), 1 - k01(t, b ?? 1e9, (b ?? 1e9) + f));
  const draw = (a: number, d = 1.4) => ease(k01(t, a, a + d));
  return (
    <AbsoluteFill style={{ background: "#03060c", overflow: "hidden" }}>
      {layers.map((id) => {
        const [src, Wd, S, E, N] = RASTERS[id];
        const left = X(Wd), top = Y(N), width = (E - Wd) * ppd * kx, height = (N - S) * ppd;
        if (left > W || top > H || left + width < 0 || top + height < 0) return null;
        // una capa chica sólo aparece cuando su resolución ya mejora a la de abajo (px de imagen ≥ px de pantalla × 0,5)
        const span = E - Wd, o = id === "world" ? 1 : k01(width / W, span / w > 3 ? 0.9 : 0.35, span / w > 3 ? 1.4 : 0.7);
        if (o <= 0.001) return null;
        return <Img key={id} src={staticFile("cpciudades/maps/" + src)} style={{ position: "absolute", left, top, width, height, opacity: o,
          filter: "contrast(1.08) saturate(1.1)", maskImage: id === "world" ? undefined : "radial-gradient(ellipse at 50% 50%, black 70%, transparent 100%)" }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="gg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <marker id="ga" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={EMBER2} /></marker>
        </defs>
        {marks.map((m, i) => {
          if (m.k === "title") return null;
          const o = op(m.t, m.out); if (o <= 0) return null;
          if (m.k === "pin") {
            const x = X(m.lon), y = Y(m.lat), s = 0.4 + 0.6 * easeOut(k01(t, m.t, m.t + 0.4)), L = m.side === "l", c = m.red ? "#ff4a3d" : EMBER2;
            return <g key={i} opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
              <circle r={9} fill={c} stroke="#000" strokeWidth={3} />
              <circle r={22 + 8 * Math.sin((t - m.t) * 4)} fill="none" stroke={c} strokeWidth={2} opacity={0.6} />
              <text x={L ? -26 : 26} y={4} textAnchor={L ? "end" : "start"} fill="#fff" fontFamily={SANS} fontWeight={800} fontSize={40} letterSpacing={4} stroke="#000" strokeWidth={7} paintOrder="stroke">{m.label}</text>
              {m.sub && <text x={L ? -26 : 26} y={46} textAnchor={L ? "end" : "start"} fill={c} fontFamily={ROMAN} fontWeight={600} fontSize={30} stroke="#000" strokeWidth={6} paintOrder="stroke">{m.sub}</text>}
            </g>;
          }
          if (m.k === "ring") {
            const x = X(m.lon), y = Y(m.lat);
            return <g key={i} opacity={o}>{[0, 0.33, 0.66].map((q, j) => { const ph = ((t - m.t) * 0.7 + q) % 1;
              return <circle key={j} cx={x} cy={y} r={(m.r ?? 180) * ph} fill="none" stroke="#ff4a3d" strokeWidth={5} opacity={1 - ph} />; })}</g>;
          }
          if (m.k === "line") {
            const d = draw(m.t, m.dur ?? 1.4), c = m.red ? "#ff4a3d" : EMBER2, last = m.pts[m.pts.length - 1];
            return <g key={i} opacity={o}>
              <path d={"M" + m.pts.map(P).join("L")} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" pathLength={1} filter="url(#gg)"
                strokeDasharray={m.dash ? "0.015 0.012" : `${d} 1`} opacity={m.dash ? d : 1} markerEnd={m.arrow && d > 0.98 ? "url(#ga)" : undefined} />
              {m.label && <text x={X(last[0]) + 18} y={Y(last[1]) - 14} fill="#fff" fontFamily={SANS} fontWeight={800} fontSize={38} stroke="#000" strokeWidth={7} paintOrder="stroke" opacity={draw(m.t + 0.7, 0.5)}>{m.label}</text>}
            </g>;
          }
          if (m.k === "ruler") {
            const d = draw(m.t, 1.0), x1 = X(m.a[0]), y1 = Y(m.a[1]), x2 = X(m.b[0]), y2 = Y(m.b[1]);
            const xe = x1 + (x2 - x1) * d, ye = y1 + (y2 - y1) * d;
            return <g key={i} opacity={o}>
              <line x1={x1} y1={y1} x2={xe} y2={ye} stroke="#fff" strokeWidth={3} strokeDasharray="12 8" />
              <circle cx={x1} cy={y1} r={7} fill="#fff" /><circle cx={xe} cy={ye} r={7} fill="#fff" />
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 22} textAnchor="middle" fill="#fff" fontFamily={SANS} fontWeight={800} fontSize={54} stroke="#000" strokeWidth={8} paintOrder="stroke" opacity={draw(m.t + 0.6, 0.4)}>{m.label}</text>
            </g>;
          }
          if (m.k === "zone") return <path key={i} d={"M" + m.pts.map(P).join("L") + "Z"} opacity={o * (0.75 + 0.25 * Math.sin((t - m.t) * 5))} fill="rgba(255,60,40,0.30)" stroke="#ff4a3d" strokeWidth={4} />;
          if (m.k === "strike") {
            const x = X(m.lon), y = Y(m.lat), s = draw(m.tStrike, 0.35);
            return <g key={i} opacity={o}>
              <text x={x} y={y} textAnchor="middle" fill="#fff" fontFamily={SANS} fontWeight={800} fontSize={60} letterSpacing={6} stroke="#000" strokeWidth={8} paintOrder="stroke" opacity={1 - 0.55 * s}>{m.label}</text>
              <line x1={x - 260} y1={y - 18} x2={x - 260 + 520 * s} y2={y - 18} stroke="#ff4a3d" strokeWidth={9} strokeLinecap="round" />
            </g>;
          }
          return null;
        })}
      </svg>
      {marks.filter((m) => m.k === "title").map((m, i) => {
        const tt = m as Extract<Mark, { k: "title" }>, o = op(tt.t, tt.out, 0.35), up = easeOut(k01(t, tt.t, tt.t + 0.6));
        if (o <= 0) return null;
        return <AbsoluteFill key={"t" + i} style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 110px 120px", opacity: o }}>
          {tt.num && <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 230, color: EMBER, lineHeight: 0.8, textShadow: shadow, transform: `translateY(${(1 - up) * 40}px)` }}>{tt.num}</div>}
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 92, letterSpacing: 14, color: "#fff", textShadow: shadow, transform: `translateY(${(1 - up) * 60}px)` }}>{tt.text}</div>
          {tt.sub && <div style={{ fontFamily: ROMAN, fontWeight: 600, fontSize: 44, letterSpacing: 6, color: EMBER2, textShadow: shadow, marginTop: 8 }}>{tt.sub}</div>}
        </AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};
