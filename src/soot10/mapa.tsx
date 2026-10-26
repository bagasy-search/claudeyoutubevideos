import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { C, fontFamily, prog } from "./kit";
import { TINTA } from "./obj";

// Mapa del capitán (Atlántico 1716, dibujado a mano desde lon/lat). Overlay de pantalla con su propia cámara:
// se desenrolla, viaja de pin en pin y se vuelve a enrollar. Proyección equirectangular, 15,45 px por grado.
const PX = 15.45;
export const geo = (lon: number, lat: number): [number, number] => [(lon + 100) * PX, (62 - lat) * PX];
const poly = (pts: number[][]) => pts.map(([lo, la], i) => { const [x, y] = geo(lo, la); return `${i ? "L" : "M"} ${x.toFixed(0)} ${y.toFixed(0)}`; }).join(" ") + " Z";
const AMERICA = [[-60, 80], [-60, 62], [-60, 55], [-56, 52], [-59, 48], [-64, 46], [-66, 44], [-70, 43], [-70.5, 41.7], [-69.9, 41.7], [-70.2, 42.1], [-71, 41.4], [-74, 40.5], [-75, 38.5], [-76, 37], [-75.5, 35.2], [-78, 33.8], [-79.9, 32.8], [-81, 31], [-81.3, 29.5], [-80, 26.8], [-80.4, 25.2], [-81.8, 26.5], [-82.7, 28], [-84, 30], [-87, 30.4], [-89.5, 30], [-90, 29], [-94, 29.6], [-97.2, 27.6], [-97.5, 25], [-97.7, 22], [-97, 20], [-94.8, 18.5], [-91, 18.7], [-90.4, 21], [-87, 21.5], [-87.5, 18.5], [-88.2, 16], [-84, 15.8], [-83.3, 12], [-83.7, 10.8], [-81.5, 8.9], [-79.5, 9.5], [-77, 8.5], [-75.5, 10.5], [-72, 11.8], [-70, 12], [-68, 10.5], [-63, 10.7], [-61, 10], [-60, 8.5], [-57, 6], [-52, 5], [-50, 1], [-48, -1], [-44, -2.5], [-40, -3], [-35, -5.5], [-35, -30], [-71, -30], [-81, -5], [-80, 0], [-78, 2], [-77.5, 7], [-80, 7.5], [-83, 8.5], [-86, 11], [-88, 13.3], [-92, 14.5], [-95, 16], [-98, 16.3], [-104, 19], [-110, 23], [-140, 23], [-140, 80]];
const CUBA = [[-85, 21.9], [-84, 22.7], [-81.5, 23.1], [-79, 22.7], [-77, 21.5], [-74.2, 20.2], [-75, 19.9], [-77.7, 19.8], [-78, 20.7], [-80.5, 22], [-83, 22], [-84.9, 21.8]];
const ESPANOLA = [[-74.4, 18.4], [-72.7, 19.9], [-70, 19.7], [-68.4, 18.6], [-70, 18.2], [-71.5, 17.6], [-74.4, 18.3]];
const JAMAICA = [[-78.3, 18.4], [-77, 18.5], [-76.2, 18], [-77, 17.8], [-78.2, 18.2]];
const PR = [[-67.2, 18.5], [-65.6, 18.4], [-65.7, 18], [-67.2, 18]];
const TERRANOVA = [[-59.3, 47.6], [-56, 49.6], [-55.5, 51.6], [-53, 49.4], [-52.7, 47.5], [-54, 46.8], [-56, 47.6]];
const EUROPA = [[40, 80], [5, 80], [5, 62], [5, 58.5], [8, 56.5], [8, 54], [4.5, 52.5], [2, 51], [-1.5, 49.5], [-4.5, 48.5], [-1.2, 46], [-1.5, 43.5], [-8, 43.7], [-9.3, 43], [-8.8, 40], [-9.5, 38.7], [-8.9, 37], [-6, 36.2], [-5.6, 36], [-2, 36.7], [0.2, 38.8], [-0.3, 39.5], [1, 41], [3.2, 41.9], [3, 43.2], [4.5, 43.5], [7, 43.5], [9, 44.3], [12, 44], [40, 44]];
const AFRICA = [[-5.9, 35.8], [-2, 35.1], [1, 36.4], [10, 37.3], [40, 37.3], [40, -30], [12, -30], [12, -5], [9.5, -1], [9.8, 3], [8.5, 4.5], [6, 4.3], [4.5, 6.3], [1.5, 6.2], [-1.2, 5.1], [-4, 5.2], [-7.5, 4.4], [-11.5, 6.9], [-13.3, 9], [-15, 11], [-16.8, 12], [-17.5, 14.7], [-17, 21], [-13, 27.6], [-9.8, 30.5]];
const BRITANIA = [[-5.7, 50], [-3, 50.6], [1.4, 51.2], [1.7, 52.7], [0, 53.5], [-0.5, 54.5], [-1.6, 55.6], [-2, 57], [-1.8, 57.6], [-4, 58.6], [-5, 58.6], [-6.2, 56.5], [-5.5, 55.3], [-4.8, 54.8], [-3, 54], [-3, 53.3], [-4.6, 53.3], [-4.2, 52.3], [-5.3, 51.8], [-3.2, 51.4], [-4.5, 51.2]];
const IRLANDA = [[-6, 52.1], [-6, 53.9], [-5.5, 54.6], [-7, 55.3], [-8.4, 54.5], [-10, 54], [-9.5, 52.6], [-10.4, 51.7], [-8, 51.6]];
const ISLITAS = [[-61.8, 17.1], [-61.7, 16.2], [-61.1, 14.6], [-61, 13.9], [-61.2, 13.2], [-61.7, 12.1], [-59.5, 13.1], [-77.3, 25], [-76.5, 24.3], [-75.8, 23.5], [-78, 26.6], [-77.5, 26.5], [-74.5, 22.4], [-64.8, 32.3]];
export const LUGAR: Record<string, [number, number]> = {
  jamaica: [-76.8, 17.9], nassau: [-77.3, 25], antigua: [-61.8, 17.1], charleston: [-79.9, 32.8], capecod: [-69.95, 41.9], capecoast: [-1.25, 5.1], londres: [0, 51.5],
  atlantico: [-45, 25], p4: [-52, 21], p5: [-30, 14], isla: [-71, 22.5], africa: [-12, 9],
};
export type Pin = { lugar: string; t0: number; txt?: string; n?: number; c?: string; icono?: "x" | "calavera" | "barco" | "cruz" };
export type CamMapa = [number, number, number, number]; // [t, lon, lat, zoom]

const camM = (t: number, ks: CamMapa[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const u = interpolate(t, [a[0], b[0]], [0, 1], { easing: Easing.inOut(Easing.cubic) });
      return [t, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * u)] as CamMapa;
    }
  }
  return ks[ks.length - 1];
};

export const Mapa: React.FC<{ t: number; t0: number; t1: number; cam: CamMapa[]; pins?: Pin[]; ruta?: { lugares: string[]; t0: number; t1: number; c?: string }[]; titulo?: string; children?: React.ReactNode }> = ({ t, t0, t1, cam, pins = [], ruta = [], titulo, children }) => {
  if (t < t0 || t > t1 + 0.6) return null;
  const abre = interpolate(t, [t0, t0 + 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cierra = interpolate(t, [t1, t1 + 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const w = 1920 * abre * cierra;
  const [, lo, la, z] = camM(t, cam);
  const [cx, cy] = geo(lo, la);
  const s = z * 0.62;
  const tierra = "#e9cf94", tierra2 = "#c9a46a", mar = "#f6e7c4";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 960 - w / 2, top: 0, width: w, height: 1080, overflow: "hidden", background: mar, boxShadow: "inset 0 0 160px rgba(120,70,20,.55)" }}>
        <svg style={{ position: "absolute", left: w / 2 - 960, top: 0 }} width={1920} height={1080}>
          <g transform={`translate(960 540) scale(${s}) translate(${-cx} ${-cy})`}>
            {/* grilla de meridianos */}
            {Array.from({ length: 12 }, (_, i) => -100 + i * 10).map((lon) => { const [x] = geo(lon, 0); return <line key={lon} x1={x} y1={-200} x2={x} y2={1400} stroke="#d9bf8a" strokeWidth={3 / s} strokeDasharray="12 10" />; })}
            {Array.from({ length: 8 }, (_, i) => -10 + i * 10).map((lat) => { const [, y] = geo(0, lat); return <line key={lat} x1={-200} y1={y} x2={2000} y2={y} stroke="#d9bf8a" strokeWidth={3 / s} strokeDasharray="12 10" />; })}
            {[AMERICA, CUBA, ESPANOLA, JAMAICA, PR, TERRANOVA, EUROPA, AFRICA, BRITANIA, IRLANDA].map((p, i) => (
              <g key={i}><path d={poly(p)} fill={tierra2} transform="translate(5 7)" /><path d={poly(p)} fill={tierra} stroke="#8a5a2a" strokeWidth={4 / s} strokeLinejoin="round" /></g>
            ))}
            {ISLITAS.map(([lo2, la2], i) => { const [x, y] = geo(lo2, la2); return <circle key={i} cx={x} cy={y} r={4} fill={tierra} stroke="#8a5a2a" strokeWidth={2 / s} />; })}
            {/* olitas */}
            {[[-50, 40], [-40, 15], [-25, 30], [-60, 28], [-30, 5], [-20, 45]].map(([lo2, la2], i) => { const [x, y] = geo(lo2, la2); return <path key={i} d={`M ${x - 30} ${y} q 15 -14 30 0 q 15 -14 30 0`} stroke="#c9a46a" strokeWidth={4} fill="none" />; })}
            {ruta.map((r, k) => {
              const pts = r.lugares.map((l) => geo(...LUGAR[l]));
              let d = `M ${pts[0][0]} ${pts[0][1]}`;
              for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, e] = pts[i]; d += ` Q ${(a + c) / 2 + (e - b) * 0.25} ${(b + e) / 2 - (c - a) * 0.25} ${c} ${e}`; }
              const u = prog(t, r.t0, r.t1);
              return <path key={k} d={d} stroke={r.c ?? C.rojo} strokeWidth={9 / s} fill="none" strokeDasharray={`${18 / s} ${12 / s}`} pathLength={1000} style={{ strokeDashoffset: 0 }} mask={undefined} opacity={u > 0 ? 1 : 0} clipPath={undefined} strokeLinecap="round" transform="" />;
            })}
            {ruta.map((r, k) => {
              const pts = r.lugares.map((l) => geo(...LUGAR[l]));
              let d = `M ${pts[0][0]} ${pts[0][1]}`;
              for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, e] = pts[i]; d += ` Q ${(a + c) / 2 + (e - b) * 0.25} ${(b + e) / 2 - (c - a) * 0.25} ${c} ${e}`; }
              const u = prog(t, r.t0, r.t1);
              // tapa que se va corriendo: la ruta se "dibuja"
              return <path key={`c${k}`} d={d} stroke={mar} strokeWidth={14 / s} fill="none" pathLength={1000} strokeDasharray={`${(1 - u) * 1000} 1000`} strokeDashoffset={-u * 1000} />;
            })}
            {pins.map((p, i) => {
              if (t < p.t0) return null;
              const [x, y] = geo(...LUGAR[p.lugar]);
              const e = interpolate(t, [p.t0, p.t0 + 0.25, p.t0 + 0.4], [2.4, 0.9, 1], { extrapolateRight: "clamp" });
              const c = p.c ?? C.rojo;
              const k = 1 / s;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${k * e})`}>
                  {p.icono === "barco" ? <g><path d="M -40 0 L 40 0 L 28 22 L -28 22 Z" fill="#5a2d14" /><line x1={0} y1={0} x2={0} y2={-60} stroke="#5a2d14" strokeWidth={6} /><path d="M 4 -56 L 36 -30 L 4 -10 Z" fill="#fff" stroke={TINTA} strokeWidth={4} /><rect x={-4} y={-66} width={28} height={16} fill="#111" /></g>
                    : p.icono === "calavera" ? <g><circle r={34} fill={TINTA} /><path d="M -16 -2 Q -18 -22 0 -22 Q 18 -22 16 -2 Q 14 6 9 7 L 9 13 L -9 13 L -9 7 Q -14 6 -16 -2 Z" fill="#fff3d6" /></g>
                      : p.icono === "cruz" ? <g><circle r={34} fill="#fff" stroke={TINTA} strokeWidth={5} /><rect x={-7} y={-24} width={14} height={48} fill={C.rojo} /><rect x={-24} y={-7} width={48} height={14} fill={C.rojo} /></g>
                        : <g><path d="M -26 -26 L 26 26 M 26 -26 L -26 26" stroke={c} strokeWidth={14} strokeLinecap="round" /></g>}
                  {p.n !== undefined && <g transform="translate(34 -38)"><circle r={24} fill={c} stroke="#fff" strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#fff">{p.n}</text></g>}
                  {p.txt && <text x={0} y={76} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill={TINTA} stroke={mar} strokeWidth={10} paintOrder="stroke">{p.txt}</text>}
                </g>
              );
            })}
          </g>
          {/* rosa de los vientos */}
          <g transform={`translate(1700 860) rotate(${t * 8})`} opacity={0.75}>
            {[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M 0 -110 L 18 0 L -18 0 Z" fill={a === 0 ? C.rojo : "#8a5a2a"} />)}
            {[45, 135, 225, 315].map((a) => <path key={a} transform={`rotate(${a})`} d="M 0 -64 L 12 0 L -12 0 Z" fill="#c9a46a" />)}
            <circle r={14} fill="#f6e7c4" stroke="#8a5a2a" strokeWidth={4} />
          </g>
          {children}
        </svg>
        {titulo && <div style={{ position: "absolute", left: 0, width: w, textAlign: "center", whiteSpace: "nowrap", top: 60, fontFamily, fontWeight: 700, fontSize: 70, color: "#6b3a1f", letterSpacing: 4, opacity: prog(t, t0 + 0.55, t0 + 0.85) * (t > t1 ? 0 : 1) }}>{titulo}</div>}
        {/* rollos de los bordes */}
        {[0, 1].map((k) => <div key={k} style={{ position: "absolute", top: -20, bottom: -20, width: 70, [k ? "right" : "left"]: -10, background: "linear-gradient(90deg,#8a5a2a,#e9cf94,#8a5a2a)", borderRadius: 30, boxShadow: "0 0 30px rgba(60,30,10,.6)" }} />)}
      </div>
    </AbsoluteFill>
  );
};
