// LorPotluckTable — la mesa larga del potluck vista desde arriba (mantel gingham): van apareciendo los pies uno a uno,
// la cámara recorre la mesa, y después el año avanza hacia 1970 y cada pie se "desvanece" (queda el círculo vacío
// en el mantel). Reusable: pies[] con nombre+tipo, fadeAt (s), year range.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd } from "./LorTheme";
import type { PieType } from "./LorPie3D";

const FILL: Record<PieType, [string, string]> = {
  chess: ["#EBC25A", "#B9772E"], sugarcream: ["#F5E6BD", "#D7A968"], shoofly: ["#B98348", "#6E3F1D"], meringue: ["#FFF6E2", "#E1B06A"],
  butterscotch: ["#C98A45", "#8E511D"], raisin: ["#FFF3DC", "#D9A765"], mockapple: ["#E8B563", "#B8742E"], cherry: ["#9E2330", "#5E0E18"],
};

export const PieTop: React.FC<{ type: PieType; size: number; seed: number }> = ({ type, size, seed }) => {
  const [a, b] = FILL[type];
  const crimp = Array.from({ length: 28 }).map((_, i) => {
    const an = (i / 28) * Math.PI * 2; return <circle key={i} cx={50 + Math.cos(an) * 45} cy={50 + Math.sin(an) * 45} r={4.4} fill="#D99A4E" stroke="#B87835" strokeWidth={0.6} />;
  });
  const dots = (n: number, col: string, r0: number, r1: number, s: number) => Array.from({ length: n }).map((_, i) => {
    const an = rnd(seed * 7 + i + s) * Math.PI * 2, rr = Math.sqrt(rnd(seed * 11 + i + s)) * 36;
    return <circle key={s + i} cx={50 + Math.cos(an) * rr} cy={50 + Math.sin(an) * rr} r={r0 + rnd(seed + i + s) * (r1 - r0)} fill={col} />;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.25))" }}>
      <defs><radialGradient id={`g${seed}`}><stop offset="0%" stopColor={a} /><stop offset="100%" stopColor={b} /></radialGradient></defs>
      <circle cx={50} cy={50} r={49} fill="#DCEBEE" />
      <circle cx={50} cy={50} r={44} fill={`url(#g${seed})`} />
      {type === "sugarcream" ? dots(80, "#7A4A1C", 0.3, 0.8, 1) : null}
      {type === "shoofly" ? <>{dots(160, "#6E3F1D", 0.8, 2.2, 2)}{dots(120, "#D8A868", 0.6, 1.8, 3)}</> : null}
      {type === "chess" ? dots(60, "#A8652A", 0.5, 1.8, 4) : null}
      {type === "meringue" || type === "raisin" ? dots(40, "#C98A45", 1.5, 3.2, 5) : null}
      {type === "mockapple" ? [0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={50 + Math.cos(k * 1.256) * 16} cy={50 + Math.sin(k * 1.256) * 16} rx={6} ry={1.2} fill="#6B3A15" transform={`rotate(${k * 72} ${50 + Math.cos(k * 1.256) * 16} ${50 + Math.sin(k * 1.256) * 16})`} />) : null}
      {type === "cherry" ? [0, 1, 2, 3, 4].flatMap((k) => [<rect key={"v" + k} x={24 + k * 12} y={8} width={6} height={84} fill="#E7B46C" />, <rect key={"h" + k} x={8} y={24 + k * 12} width={84} height={6} fill="#EDC27A" />]) : null}
      {crimp}
    </svg>
  );
};

export const LorPotluckTable: React.FC<{ pies: { name: string; type: PieType }[]; fadeAt?: number; yearFrom?: number; yearTo?: number; sign?: string }> = ({ pies, fadeAt = 7, yearFrom = 1958, yearTo = 1974, sign = "Church Supper · Everyone Welcome" }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const n = pies.length, gap = 330, tableW = n * gap + 260;
  const appearEach = Math.min(0.55 * fps, (fadeAt * fps - 20) / Math.max(1, n));
  // cámara: recorre la mesa mientras aparecen, y al desvanecer se aleja para ver toda la mesa
  const panEnd = fadeAt * fps;
  const camX = interpolate(f, [0, panEnd, panEnd + 1.5 * fps], [0, -(tableW - 1920) * 0.85, -(tableW - 1920) / 2], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const zoom = interpolate(f, [0, panEnd, panEnd + 1.5 * fps], [1.12, 1.08, 1920 / tableW + 0.02], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const yearP = interpolate(f, [panEnd, Math.max(panEnd + 1, durationInFrames - 1.2 * fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const year = Math.round(yearFrom + (yearTo - yearFrom) * yearP);
  return (
    <AbsoluteFill style={{ backgroundColor: "#6B4A2E", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: tableW, height: 900, translate: `${-960 + camX}px -450px`, scale: String(zoom), transformOrigin: `${960 - camX}px 450px` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, backgroundColor: "#FFFDF7", backgroundImage: `linear-gradient(90deg, rgba(200,50,58,0.5) 50%, transparent 50%), linear-gradient(rgba(200,50,58,0.5) 50%, transparent 50%)`, backgroundSize: "60px 60px", boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }} />
        {pies.map((p, i) => {
          const t0 = 10 + i * appearEach;
          const inP = interpolate(f, [t0, t0 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.3, 0.4, 1) });
          const fadeStart = panEnd + 1.5 * fps + i * ((durationInFrames - panEnd - 2.7 * fps) / n);
          const out = interpolate(f, [fadeStart, fadeStart + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = 130 + i * gap + gap / 2, y = 450 + (i % 2 ? 70 : -70);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", textAlign: "center" }}>
              <div style={{ position: "absolute", left: "50%", top: 130, translate: "-50% -50%", width: 250, height: 250, borderRadius: "50%", border: "3px dashed rgba(59,42,30,0.35)", opacity: out }} />
              <div style={{ scale: String(inP * (1 - out * 0.15)), opacity: inP * (1 - out), filter: `grayscale(${out})` }}>
                <PieTop type={p.type} size={300} seed={i + 3} />
              </div>
              <div style={{ marginTop: 6, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: LOR.ink, background: "rgba(255,253,247,0.92)", padding: "0 14px", borderRadius: 8, opacity: inP * (1 - out * 0.6), textDecoration: out > 0.5 ? "line-through" : "none" }}>{p.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, top: 44, fontFamily: SERIF, fontWeight: 800, fontSize: 44, color: LOR.white, textShadow: "0 3px 10px rgba(0,0,0,0.5)" }}>{sign}</div>
      <div style={{ position: "absolute", right: 70, top: 26, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: yearP > 0 ? LOR.butter : "rgba(255,253,247,0.9)", textShadow: "0 4px 14px rgba(0,0,0,0.5)", fontVariantNumeric: "tabular-nums" }}>{year}</div>
    </AbsoluteFill>
  );
};
