// FloridaDropMap — el mapa real de Florida (Natural Earth) inclinado en 3D, con las oficinas de la FWC que
// recibieron iguanas: un pin por sede, una columna de luz que crece hasta su cantidad (escala honesta) y el
// contador de cada una; al final el total. Las sedes en 0 se muestran apagadas (dato, no se esconde).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { GEO } from "./floridaGeo";
import { SANS, SERIF, MONO, HK, clamp, ease, easeInOut, rnd } from "../theme";

type Site = { name: string; lon: number; lat: number; value: number; sub?: string };
const BB = { lon0: -87.8, lon1: -79.6, lat0: 24.3, lat1: 31.2 };
const W = 1500, H = W * ((BB.lat1 - BB.lat0) / (BB.lon1 - BB.lon0)) * 1.12;
const px = (lon: number, lat: number): [number, number] => [((lon - BB.lon0) / (BB.lon1 - BB.lon0)) * W, (1 - (lat - BB.lat0) / (BB.lat1 - BB.lat0)) * H];
const path = (ring: [number, number][]) => ring.map(([x, y], i) => { const [a, b] = px(x, y); return `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`; }).join(" ") + "Z";

export const FloridaDropMap: React.FC<{ sites: Site[]; title?: string; totalLabel?: string; unit?: string; source?: string }> = ({
  sites, title = "WHERE THE ICED IGUANAS WENT", totalLabel = "IGUANAS TURNED IN · FEB 1-2, 2026", unit = "iguanas", source = "Source: FWC, Feb 4, 2026",
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const t = f / Math.max(1, D - 1);
  const draw = ease(clamp(t / 0.22));                        // el contorno se dibuja
  const max = Math.max(...sites.map((s) => s.value), 1);
  const order = [...sites].sort((a, b) => a.value - b.value); // de menor a mayor: el golpe grande al final
  const total = sites.reduce((a, s) => a + s.value, 0);
  const paths = useMemo(() => ({ fl: GEO.Florida.map(path), ga: GEO.Georgia.map(path), al: GEO.Alabama.map(path) }), []);
  // cámara: inclinación 3D y leve empuje hacia el sudeste (donde está casi todo)
    // cámara: el estado entero → acercamiento al sudeste (donde está casi todo) mientras suben las columnas
  const z = easeInOut(clamp((t - 0.2) / 0.6));
  const h0 = H + 160, h1 = H * 0.64, hh = h0 + (h1 - h0) * z, ww = hh * 1180 / 900;
  const y0 = -80 + (H * 0.37 + 80) * z, x0 = (W / 2 - ww / 2) + ((W + 80 - ww) - (W / 2 - ww / 2)) * z;
  const vb = `${x0} ${y0} ${ww} ${hh}`;
  const siteT = (i: number) => clamp((t - 0.24 - i * 0.12) / 0.14);
  const totalOn = ease(clamp((t - 0.24 - order.length * 0.12 - 0.02) / 0.08));

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 55%, #10302E 0%, #071514 60%, #030909 100%)", overflow: "hidden" }}>
      {/* mapa plano en su zona (izquierda) con leve respiración; columnas en SVG con cara lateral y tapa */}
      <div style={{ position: "absolute", left: 40, top: 110, width: 1180, height: 900, overflow: "hidden" }}>
        <svg width={1180} height={900} viewBox={vb} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2F4A2C" /><stop offset="1" stopColor="#223A22" /></linearGradient>
            <linearGradient id="colF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={HK.orange} /><stop offset="1" stopColor="#FFD39A" /></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          {Array.from({ length: 16 }, (_, k) => <line key={k} x1={-600} x2={W + 600} y1={(k / 15) * H} y2={(k / 15) * H} stroke="rgba(120,200,190,0.07)" strokeWidth={2} />)}
          {[...paths.ga, ...paths.al].map((d, k) => <path key={"n" + k} d={d} fill="#162A18" stroke="rgba(241,235,221,0.18)" strokeWidth={2} opacity={draw} />)}
          {paths.fl.map((d, k) => <path key={"g" + k} d={d} fill="none" stroke={HK.orange} strokeWidth={10} opacity={0.25 * draw} filter="url(#glow)" />)}
          {paths.fl.map((d, k) => <path key={"f" + k} d={d} fill="url(#land)" fillOpacity={draw} stroke={HK.bone} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />)}
          {order.map((st, i) => {
            const [x, y] = px(st.lon, st.lat); const on = siteT(i); const h = 420 * (st.value / max) * ease(on);
            const zero = st.value === 0; const w = 34, dx = 14, dy = -9;
            return (
              <g key={st.name} opacity={ease(on * 3)}>
                <ellipse cx={x} cy={y} rx={30 + 16 * ((f / 24 + i * 0.3) % 1)} ry={(30 + 16 * ((f / 24 + i * 0.3) % 1)) * 0.5} fill="none" stroke={zero ? "rgba(241,235,221,0.4)" : HK.orange} strokeWidth={3} opacity={1 - ((f / 24 + i * 0.3) % 1)} />
                <circle cx={x} cy={y} r={8} fill={zero ? "#777" : HK.orange} />
                {h > 1 ? (<>
                  <rect x={x - w / 2} y={y - h} width={w} height={h} fill="url(#colF)" />
                  <path d={`M${x + w / 2} ${y} l ${dx} ${dy} l 0 ${-h} l ${-dx} ${-dy} Z`} fill="#B34E0C" />
                  <path d={`M${x - w / 2} ${y - h} l ${dx} ${dy} l ${w} 0 l ${-dx} ${-dy} Z`} fill="#FFE2B8" />
                  <rect x={x - w / 2 - 10} y={y - h - 10} width={w + dx + 20} height={h + 20} fill={HK.orange} opacity={0.12} filter="url(#glow)" />
                </>) : null}
              </g>
            );
          })}
        </svg>
      </div>
      {/* rótulos en 2D (legibles), al lado de cada sede, en orden de aparición */}
      <div style={{ position: "absolute", right: 70, top: 170, width: 560 }}>
        {order.map((st, i) => {
          const on = siteT(i); const v = Math.round(st.value * easeInOut(clamp(on * 1.2)));
          return (
            <div key={st.name} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(241,235,221,0.18)", opacity: ease(on * 2), transform: `translateX(${(1 - ease(on * 2)) * 40}px)` }}>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 6, color: st.value ? HK.bone : "rgba(241,235,221,0.5)" }}>{st.name}</div>
                {st.sub ? <div style={{ fontFamily: MONO, fontSize: 18, color: "rgba(241,235,221,0.6)" }}>{st.sub}</div> : null}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 64, color: st.value ? HK.orange : "rgba(241,235,221,0.45)", fontVariantNumeric: "tabular-nums" }}>{v.toLocaleString("en-US")}</div>
            </div>
          );
        })}
        <div style={{ marginTop: 22, opacity: totalOn, transform: `scale(${1.1 - 0.1 * totalOn})`, transformOrigin: "right center", textAlign: "right" }}>
          <div style={{ fontFamily: SERIF, fontSize: 130, lineHeight: 1, color: HK.bone }}>{total.toLocaleString("en-US")}</div>
          <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 6, color: HK.bone, opacity: 0.85 }}>{totalLabel}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: SANS, fontSize: 36, letterSpacing: 10, color: HK.bone, opacity: ease(f / 14) }}>{title}</div>
      <div style={{ position: "absolute", left: 70, bottom: 50, fontFamily: MONO, fontSize: 20, color: HK.bone, opacity: 0.6 * ease(f / 20) }}>{source} · map: Natural Earth</div>
      <AbsoluteFill style={{ background: "#000", opacity: clamp((f - (D - 10)) / 10), pointerEvents: "none" }} />
      {void unit}{void rnd}
    </AbsoluteFill>
  );
};
