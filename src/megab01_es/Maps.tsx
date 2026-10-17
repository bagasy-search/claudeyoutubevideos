// megab01 · mapas y gráficos vectoriales (contornos Natural Earth 1:50m, dominio público)
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import GEO from "./geo.json";
import { C, FONTS } from "./theme";

const W = 1920, H = 1080;
type V = { lon: number; lat: number; sc: number };
const CHINA: V = { lon: 104, lat: 36, sc: 28 };
const TAKLA: V = { lon: 82.6, lat: 39.1, sc: 112 };
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const lerpV = (a: V, b: V, t: number): V => ({ lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t, sc: a.sc * Math.pow(b.sc / a.sc, t) });
const P = (v: V) => (lon: number, lat: number): [number, number] => [W / 2 + (lon - v.lon) * v.sc * Math.cos((v.lat * Math.PI) / 180), H / 2 - (lat - v.lat) * v.sc];
const path = (v: V, pts: number[][], close = true) => { const p = P(v); return pts.map((q, i) => (i ? "L" : "M") + p(q[0], q[1]).map((n) => n.toFixed(1)).join(",")).join("") + (close ? "Z" : ""); };
const plen = (v: V, pts: number[][]) => { const p = P(v); let L = 0; for (let i = 1; i < pts.length; i++) { const a = p(pts[i - 1][0], pts[i - 1][1]), b = p(pts[i][0], pts[i][1]); L += Math.hypot(b[0] - a[0], b[1] - a[1]); } return L; };
const G = GEO as unknown as Record<string, number[][][]>;

// muro (aprox. del trazado del programa Three-North, oeste → este)
const BELT = [[75.9, 39.5], [80.2, 41.2], [84.0, 41.9], [86.2, 41.8], [89.5, 42.6], [93.5, 42.8], [94.7, 40.4], [98.5, 39.9], [100.5, 39.0], [102.6, 38.1], [105.2, 37.6], [106.3, 38.6], [108.0, 40.0], [110.0, 40.7], [111.7, 40.9], [114.9, 41.0], [117.5, 41.9], [118.9, 42.4], [122.3, 43.8], [122.8, 45.6], [124.0, 47.4], [126.0, 48.6]];
// región del programa (recorte al norte de esta línea)
const REG = [[72, 34.6], [80, 35.4], [90, 36.0], [96, 36.4], [100, 35.4], [104, 34.4], [108, 34.8], [111, 35.8], [114, 37.8], [117.5, 38.8], [120, 39.6], [124, 39.6], [131, 42.0], [136, 42], [136, 56], [72, 56]];
// Taklamakan: anillo empezando en el extremo este del hueco de Yutian, en sentido horario; el hueco va al final
const RING = [[83.2, 37.3], [84.5, 37.8], [86.0, 38.3], [87.8, 38.6], [88.8, 39.2], [88.6, 40.2], [87.0, 41.0], [85.0, 41.4], [82.5, 41.3], [80.0, 40.9], [77.8, 40.2], [76.5, 39.3], [77.3, 38.0], [78.5, 37.3], [80.0, 36.95]];
const GAP = [[80.0, 36.95], [81.0, 36.85], [81.67, 36.86], [82.4, 37.0], [83.2, 37.3]];
const DESERT = [...RING, ...GAP.slice(1, -1)];
const CEN = [82.6, 39.1];
const RAIL = [...RING, ...GAP.slice(1)].map(([x, y]) => [CEN[0] + (x - CEN[0]) * 1.13, CEN[1] + (y - CEN[1]) * 1.16]);

const Base: React.FC<{ v: V; china?: number }> = ({ v, china = 1 }) => {
  const p = P(v);
  const grid: string[] = [];
  for (let lon = 60; lon <= 150; lon += 10) { const a = p(lon, 10), b = p(lon, 60); grid.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`); }
  for (let lat = 10; lat <= 60; lat += 10) { const a = p(60, lat), b = p(150, lat); grid.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`); }
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1a2018 0%, #0b0d09 75%)" }} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <path d={grid.join("")} stroke="#ffffff" strokeOpacity={0.05} strokeWidth={1} fill="none" />
        {Object.entries(G).filter(([n]) => n !== "China").map(([n, rings]) => rings.map((r, i) => <path key={n + i} d={path(v, r)} fill="#191c15" stroke="#3a3f33" strokeWidth={1.2} />))}
        {G.China.map((r, i) => <path key={"c" + i} d={path(v, r)} fill="#3b3423" fillOpacity={china} stroke={C.sand} strokeOpacity={0.55 * china} strokeWidth={1.6} />)}
      </svg>
    </>
  );
};
const Tag: React.FC<{ x: number; y: number; t: string; a: number; color?: string; size?: number; dot?: boolean }> = ({ x, y, t, a, color = C.white, size = 30, dot = true }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a, transform: "translate(-8px,-50%)", display: "flex", alignItems: "center" }}>
    {dot ? <div style={{ width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 18px ${color}`, marginRight: 14 }} /> : null}
    <div style={{ fontFamily: FONTS.INT, fontWeight: 700, fontSize: size, letterSpacing: 4, color, textShadow: "0 2px 10px #000" }}>{t}</div>
  </div>
);
const Big: React.FC<{ t: string; s?: string; a: number; x?: number; y?: number; align?: "left" | "right" }> = ({ t, s, a, x = 110, y = 120, align = "left" }) => (
  <div style={{ position: "absolute", [align]: x, top: y, opacity: a, transform: `translateY(${(1 - a) * 20}px)`, textAlign: align } as React.CSSProperties}>
    <div style={{ fontFamily: FONTS.OSW, fontWeight: 700, fontSize: 132, color: C.white, lineHeight: 1, letterSpacing: 2, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{t}</div>
    {s ? <div style={{ fontFamily: FONTS.INT, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: C.sand, marginTop: 12 }}>{s}</div> : null}
  </div>
);
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");

const MapBelt: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = lerpV({ ...CHINA, sc: 25 }, CHINA, ramp(f, 0, dur));
  const L = plen(v, BELT), t = ramp(f, 6, dur * 0.85);
  const p = P(v), bj = p(116.4, 39.9);
  return (
    <AbsoluteFill>
      <Base v={v} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <path d={path(v, BELT, false)} fill="none" stroke={C.green} strokeOpacity={0.35} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} style={{ filter: "blur(8px)" }} />
        <path d={path(v, BELT, false)} fill="none" stroke={C.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} />
      </svg>
      <Tag x={bj[0]} y={bj[1]} t="PEKÍN" a={ramp(f, 10, 25)} />
      <Big t={(t > 0.98 ? "4.500+ KM" : fmt(4500 * t) + " KM")} s="UN MURO DE ÁRBOLES VIVOS" a={ramp(f, 0, 12)} />
    </AbsoluteFill>
  );
};
const RegionFill: React.FC<{ v: V; a: number }> = ({ v, a }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <defs><clipPath id="reg"><path d={path(v, REG)} /></clipPath></defs>
    <g clipPath="url(#reg)">{G.China.map((r, i) => <path key={i} d={path(v, r)} fill={C.green} fillOpacity={0.42 * a} stroke={C.green} strokeOpacity={a} strokeWidth={2} />)}</g>
  </svg>
);
const MapRegion: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = CHINA, a = ramp(f, 0, 30);
  return (
    <AbsoluteFill>
      <Base v={v} />
      <RegionFill v={v} a={a} />
      <Big t="4.000.000 KM²" s="ÁREA DEL PROYECTO" a={ramp(f, dur * 0.27, dur * 0.27 + 14)} x={90} y={720} align="right" />
      <Big t="≈ 42%" s="DE TODA CHINA" a={ramp(f, dur * 0.55, dur * 0.55 + 14)} x={90} y={90} />
      <Big t="13" s="PROVINCIAS" a={ramp(f, dur * 0.8, dur * 0.8 + 14)} x={90} y={90} align="right" />
    </AbsoluteFill>
  );
};
const MapSpan: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = CHINA, p = P(v);
  const A = p(80, 41.5), B = p(127.5, 47.5), t = ramp(f, 10, dur * 0.7);
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  return (
    <AbsoluteFill>
      <Base v={v} />
      <RegionFill v={v} a={1} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={C.white} strokeWidth={6} strokeDasharray={`${L * t} ${L}`} strokeLinecap="round" />
      </svg>
      <Tag x={A[0]} y={A[1] + 50} t="XINJIANG" a={ramp(f, 0, 12)} color={C.sand} size={40} />
      <Tag x={B[0] - 230} y={B[1] - 50} t="HEILONGJIANG" a={ramp(f, dur * 0.65, dur * 0.65 + 12)} color={C.sand} size={40} />
    </AbsoluteFill>
  );
};
const Desert: React.FC<{ v: V; a: number }> = ({ v, a }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <path d={path(v, DESERT)} fill={C.sand} fillOpacity={0.55 * a} stroke={C.sand} strokeOpacity={a} strokeWidth={2} />
    {v.sc > 60 ? <text x={P(v)(CEN[0], CEN[1])[0]} y={P(v)(CEN[0], CEN[1])[1]} textAnchor="middle" dominantBaseline="middle" fill={C.ink} fillOpacity={0.75 * a} style={{ fontFamily: FONTS.OSW, fontWeight: 700, fontSize: 64, letterSpacing: 10 }}>TAKLAMAKÁN</text> : null}
  </svg>
);
const MapTakla: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = lerpV(CHINA, TAKLA, ramp(f, 0, Math.min(45, dur * 0.5)));
  return (
    <AbsoluteFill>
      <Base v={v} />
      <Desert v={v} a={ramp(f, 10, 35)} />
      <Big t="337.000 KM²" s="CASI EL TAMAÑO DE ALEMANIA" a={ramp(f, Math.min(45, dur * 0.5), Math.min(45, dur * 0.5) + 12)} y={80} />
    </AbsoluteFill>
  );
};
const Ring: React.FC<{ v: V; t: number; gap: number; red?: number }> = ({ v, t, gap, red = 0 }) => {
  const L = plen(v, RING), LG = plen(v, GAP);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <path d={path(v, RING, false)} fill="none" stroke={C.green} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} />
      {red > 0 ? <path d={path(v, GAP, false)} fill="none" stroke={C.red} strokeOpacity={red} strokeWidth={16} strokeDasharray="22 12" strokeLinecap="round" /> : null}
      <path d={path(v, GAP, false)} fill="none" stroke={C.green} strokeWidth={16} strokeLinecap="round" strokeDasharray={LG} strokeDashoffset={LG * (1 - gap)} />
    </svg>
  );
};
const MapRail: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = TAKLA, L = plen(v, RAIL), t = ramp(f, 4, dur * 0.85);
  return (
    <AbsoluteFill>
      <Base v={v} />
      <Desert v={v} a={1} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <path d={path(v, RAIL, false)} fill="none" stroke={C.white} strokeWidth={7} strokeDasharray={L} strokeDashoffset={L * (1 - t)} strokeLinejoin="round" />
        <path d={path(v, RAIL, false)} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="10 16" strokeOpacity={t > 0.01 ? 1 : 0} style={{ clipPath: "none" }} />
      </svg>
      <Big t={(t > 0.98 ? "2.700+ KM" : fmt(2700 * t) + " KM")} s="ANILLO FERROVIARIO DEL DESIERTO" a={ramp(f, 0, 12)} y={70} />
    </AbsoluteFill>
  );
};
const MapGap: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = TAKLA, p = P(v), y = p(81.67, 36.86);
  const pulse = 0.8 + 0.2 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <Base v={v} />
      <Desert v={v} a={1} />
      <Ring v={v} t={ramp(f, 0, dur * 0.4)} gap={0} red={ramp(f, dur * 0.4, dur * 0.4 + 10) * pulse} />
      <Tag x={y[0] - 120} y={y[1] + 70} t="CONDADO DE YUTIAN" a={ramp(f, dur * 0.55, dur * 0.55 + 12)} color={C.red} size={36} dot={false} />
      <Big t="285 KM" s="EL ÚLTIMO HUECO" a={ramp(f, dur * 0.42, dur * 0.42 + 12)} y={70} />
    </AbsoluteFill>
  );
};
const MapRing: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const v = TAKLA, g = ramp(f, 8, dur * 0.45);
  const n = ramp(f, 8, dur * 0.6);
  return (
    <AbsoluteFill>
      <Base v={v} />
      <Desert v={v} a={1} />
      <Ring v={v} t={1} gap={g} red={1 - g} />
      <Big t={fmt(2761 + 285 * n)} s="KM · EL ANILLO SE CERRÓ" a={ramp(f, 0, 10)} y={70} />
    </AbsoluteFill>
  );
};
// ── línea de tiempo y barras
const Timeline: React.FC<{ dur: number; mode: "1978" | "73" | "2050" }> = ({ dur, mode }) => {
  const f = useCurrentFrame();
  const x0 = 260, x1 = 1660, y = 600;
  const X = (yr: number) => x0 + ((yr - 1978) / (2050 - 1978)) * (x1 - x0);
  const fill = mode === "1978" ? ramp(f, 30, dur * 0.85) : mode === "73" ? 1 : ramp(f, 0, 25) * ((2026 - 1978) / 72);
  const tick = (yr: number, t: string, a: number, up = true) => (
    <div key={yr} style={{ position: "absolute", left: X(yr), top: up ? y - 150 : y + 40, opacity: a, transform: "translateX(-50%)", textAlign: "center" }}>
      <div style={{ fontFamily: FONTS.OSW, fontWeight: 700, fontSize: up ? 96 : 54, color: C.white }}>{t}</div>
    </div>
  );
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Base v={CHINA} china={0.35} />
      <AbsoluteFill style={{ background: "rgba(8,10,6,0.55)" }} />
      <div style={{ position: "absolute", left: x0, top: y - 6, width: x1 - x0, height: 12, background: "#2b3027", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: x0, top: y - 6, width: (x1 - x0) * fill, height: 12, background: C.green, borderRadius: 6, boxShadow: `0 0 24px ${C.green}` }} />
      {tick(1978, "1978", ramp(f, 0, 12))}
      {tick(2050, mode === "2050" ? "2050?" : "2050", mode === "1978" ? ramp(f, dur * 0.45, dur * 0.45 + 12) : 1)}
      {mode === "2050" ? tick(2026, "HOY", ramp(f, 10, 25), false) : null}
      {mode === "2050" ? <div style={{ position: "absolute", left: X(2050) - 14, top: y - 14, width: 28, height: 28, borderRadius: 14, background: C.sand, opacity: pulse }} /> : null}
      {mode === "73" ? <div style={{ position: "absolute", top: 700, width: "100%", textAlign: "center", fontFamily: FONTS.OSW, fontWeight: 700, fontSize: 150, color: C.sand, opacity: ramp(f, 0, 12) }}>73 AÑOS</div> : null}
      {mode === "1978" ? <div style={{ position: "absolute", top: 700, width: "100%", textAlign: "center", fontFamily: FONTS.INT, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: C.sand, opacity: ramp(f, 20, 35) }}>PROGRAMA DE BOSQUES PROTECTORES DE LOS TRES NORTES</div> : null}
    </AbsoluteFill>
  );
};
const PctCover: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bars = [{ y: "1978", v: 5, a: 0.05 }, { y: "2023", v: 13.84, a: 0.3 }, { y: "META 2050", v: 15, a: 0.6 }];
  const base = 860, maxH = 560, bw = 260, gap = 170, left = (1920 - (3 * bw + 2 * gap)) / 2;
  return (
    <AbsoluteFill>
      <Base v={CHINA} china={0.3} />
      <AbsoluteFill style={{ background: "rgba(8,10,6,0.6)" }} />
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONTS.INT, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: C.sand }}>COBERTURA FORESTAL · REGIÓN DE LOS TRES NORTES</div>
      {bars.map((b, i) => {
        const t = ramp(f, dur * b.a, dur * b.a + 24), h = (b.v / 15) * maxH * t, x = left + i * (bw + gap);
        const target = i === 2;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: base - h, width: bw, height: h, background: target ? "transparent" : C.green, border: target ? `5px dashed ${C.sand}` : "none", boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: x, top: base - h - 120, width: bw, textAlign: "center", fontFamily: FONTS.OSW, fontWeight: 700, fontSize: 100, color: C.white, opacity: t }}>{(b.v * t).toFixed(b.v % 1 ? 1 : 0).replace(".", ",")}%</div>
            <div style={{ position: "absolute", left: x - 40, top: base + 24, width: bw + 80, textAlign: "center", fontFamily: FONTS.INT, fontWeight: 700, fontSize: 36, letterSpacing: 4, color: C.sand, opacity: ramp(f, dur * b.a - 6, dur * b.a + 6) }}>{b.y}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export const MapShot: React.FC<{ kind: string; dur: number }> = ({ kind, dur }) => {
  switch (kind) {
    case "map_belt": return <MapBelt dur={dur} />;
    case "map_region": return <MapRegion dur={dur} />;
    case "map_span": return <MapSpan dur={dur} />;
    case "map_taklamakan": return <MapTakla dur={dur} />;
    case "map_rail": return <MapRail dur={dur} />;
    case "map_gap": return <MapGap dur={dur} />;
    case "map_ring": return <MapRing dur={dur} />;
    case "timeline_1978": return <Timeline dur={dur} mode="1978" />;
    case "timeline_73": return <Timeline dur={dur} mode="73" />;
    case "timeline_2050": return <Timeline dur={dur} mode="2050" />;
    case "pct_cover": return <PctCover dur={dur} />;
  }
  return null;
};
