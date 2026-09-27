// TfbLayerCut — CORTE / SECCIÓN animado de un piso, dibujado frame a frame: las capas entran de abajo hacia arriba
// (base vieja con grietas → agua que la satura → puente de adherencia → carpeta con granos de arena → rayado de escoba).
// Modo "absorb": la base SECA le chupa el agua a la lechada (gotas que bajan), la unión se vuelve polvo y la carpeta
// se levanta en placa. Todo por props (etiquetas, tiempos, colores): sirve para cualquier "capas sobre capas".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, CAVEAT, INTER, TFB, clamp, easeInOut, easeOut, outro, pop } from "./theme";

export type CutLayer = { key: string; label: string; color: string; h: number; at: number; grain?: boolean; grooves?: boolean; wet?: boolean; cracked?: boolean; thin?: boolean };
export const TfbLayerCut: React.FC<{
  dur: number; layers: CutLayer[]; title?: string; mode?: "stack" | "absorb"; absorbAt?: number; peelAt?: number;
  badLabel?: string; dim?: number; scale?: number;
}> = ({ dur, layers, title, mode = "stack", absorbAt = 60, peelAt = 110, badLabel, dim = 0.62, scale = 1.5 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 9) * interpolate(f, [0, 8], [0, 1], clamp);
  const W = 1080, X0 = 200, BASE = 820;
  // geometría: cada capa se apoya en la anterior
  let y = BASE + 60; const geo = layers.map(l => { const top = y - l.h * scale; const g = { ...l, top, bot: y }; y = top; return g; });
  // rótulos sin pisarse: de abajo hacia arriba, separación mínima 66 px
  const ly: number[] = []; geo.forEach((g, i) => { const c = (g.top + g.bot) / 2; ly.push(i === 0 ? c : Math.min(c, ly[i - 1] - 66)); });
  const rnd = (i: number, s: number) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); };
  const absorb = mode === "absorb" ? interpolate(f, [absorbAt, absorbAt + 45], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  const peel = mode === "absorb" ? interpolate(f, [peelAt, peelAt + 30], [0, 1], { ...clamp, easing: easeOut }) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(12,12,12,${dim}) 0%, rgba(0,0,0,${Math.min(0.92, dim + 0.22)}) 75%)` }} />
      {title && (() => { const p = pop(f, fps, 2, 12, 0.6); return (
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: ANTON, fontSize: 84, color: TFB.white, letterSpacing: 1,
          textTransform: "uppercase", transform: `translateY(${(1 - p) * -40}px)`, opacity: p, textShadow: "0 6px 0 rgba(0,0,0,0.45)" }}>{title}</div>); })()}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="lc-clip"><rect x={X0} y={0} width={W} height={1080} /></clipPath>
          <linearGradient id="lc-shade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.16" /><stop offset="1" stopColor="#000" stopOpacity="0.22" /></linearGradient>
        </defs>
        <g clipPath="url(#lc-clip)">
          {geo.map((l, i) => {
            const t = interpolate(f, [l.at, l.at + 16], [0, 1], { ...clamp, easing: easeOut });
            if (t <= 0) return null;
            const isTop = i === geo.length - 1, lift = isTop || l.key === "carpeta" ? peel : 0;
            const dy = (1 - t) * -60 - lift * 26, rot = lift * -2.2;
            // capa: rectángulo con borde superior irregular (hecho a mano) y textura propia
            const n = 40, pts: string[] = [];
            for (let k = 0; k <= n; k++) { const px = X0 + (W * k) / n; const py = l.top + (l.thin ? 0 : (rnd(k, i) - 0.5) * 6); pts.push(`${px.toFixed(1)},${py.toFixed(1)}`); }
            const d = `M${X0},${l.bot} L${pts.join(" L")} L${X0 + W},${l.bot} Z`;
            const powder = l.key === "puente" ? absorb : 0;
            return (
              <g key={l.key} transform={`translate(0 ${dy}) rotate(${rot} ${X0 + W} ${l.bot})`} opacity={t}>
                <path d={d} fill={powder > 0 ? mix(l.color, "#d9d2c3", powder) : l.color} />
                <path d={d} fill="url(#lc-shade)" />
                {l.cracked && Array.from({ length: 7 }).map((_, k) => {
                  const cx = X0 + 90 + k * 160 + rnd(k, 3) * 60; let p = `M${cx},${l.top + 2}`; let yy = l.top + 2, xx = cx;
                  for (let s = 0; s < 5; s++) { xx += (rnd(k * 7 + s, 5) - 0.5) * 34; yy += l.h / 6; p += ` L${xx.toFixed(1)},${yy.toFixed(1)}`; }
                  return <path key={k} d={p} stroke="#2a2724" strokeWidth={2.4} fill="none" opacity={0.7} strokeDasharray={400} strokeDashoffset={400 * (1 - t)} />;
                })}
                {l.grain && Array.from({ length: 170 }).map((_, k) => (
                  <circle key={k} cx={X0 + rnd(k, 11) * W} cy={l.top + 6 + rnd(k, 17) * (l.h - 10)} r={1.4 + rnd(k, 23) * 2.6} fill={rnd(k, 29) > 0.5 ? "#8d8374" : "#b7ad9b"} opacity={0.85} />
                ))}
                {l.wet && Array.from({ length: 24 }).map((_, k) => {
                  const ph = (f * 0.9 + rnd(k, 31) * 90) % 90;
                  return <ellipse key={k} cx={X0 + rnd(k, 37) * W} cy={l.top - 18 + ph} rx={4} ry={7} fill="#6fb7ff" opacity={interpolate(ph, [0, 20, 70, 90], [0, 0.85, 0.6, 0], clamp) * t} />;
                })}
                {l.grooves && Array.from({ length: 58 }).map((_, k) => {
                  const gx = X0 + 8 + k * (W / 58); const gp = interpolate(f, [l.at + 8 + k * 0.5, l.at + 16 + k * 0.5], [0, 1], clamp);
                  return <path key={k} d={`M${gx},${l.top - 1} q4,${7 * gp} 8,0`} stroke="#5e584f" strokeWidth={2.2} fill="none" opacity={gp} />;
                })}
              </g>
            );
          })}
          {/* absorción: gotas que la base seca le roba a la lechada */}
          {mode === "absorb" && (() => { const pb = geo.find(g => g.key === "puente"), base = geo[0]; if (!pb) return null;
            return Array.from({ length: 30 }).map((_, k) => { const ph = ((f - absorbAt) * 1.3 + rnd(k, 41) * 60); if (f < absorbAt || f > peelAt + 20) return null;
              const yy = pb.top + 4 + (ph % 70) * ((base.bot - pb.top) / 70);
              return <ellipse key={k} cx={X0 + 30 + rnd(k, 43) * (W - 60)} cy={yy} rx={3.4} ry={6} fill="#6fb7ff" opacity={0.8 * (1 - (ph % 70) / 70)} />; }); })()}
        </g>
        {/* borde de la sección */}
        <rect x={X0} y={geo[geo.length - 1].top - 30} width={W} height={BASE - geo[geo.length - 1].top + 30} fill="none" stroke="rgba(255,255,255,0.0)" />
      </svg>
      {/* etiquetas a la derecha, con línea guía */}
      {geo.map((l, i) => {
        const p = pop(f, fps, l.at + 6, 14, 0.6); if (p <= 0.01) return null;
        const yy = ly[i];
        return (
          <div key={l.key} style={{ position: "absolute", left: X0 + W + 28, top: yy, transform: `translate(${(1 - p) * 40}px,-50%)`, opacity: p, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 34, height: 4, background: TFB.yellow, borderRadius: 2 }} />
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: TFB.white, textTransform: "uppercase", letterSpacing: 0.5, textShadow: "0 3px 10px rgba(0,0,0,0.7)", maxWidth: 520, lineHeight: 1.05 }}>{l.label}</div>
          </div>
        );
      })}
      {mode === "absorb" && badLabel && (() => { const p = pop(f, fps, peelAt + 8, 10, 0.6); const pb = geo.find(g => g.key === "puente");
        return <div style={{ position: "absolute", left: X0 - 20, top: (pb?.top ?? 600) - 150, transform: `rotate(-4deg) scale(${interpolate(p, [0, 1], [1.6, 1])})`, opacity: p,
          fontFamily: CAVEAT, fontSize: 64, fontWeight: 700, color: TFB.red, textShadow: "0 3px 0 rgba(0,0,0,0.6)" }}>{badLabel}</div>; })()}
    </AbsoluteFill>
  );
};
function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
