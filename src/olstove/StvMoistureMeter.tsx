// StvMoistureMeter — el medidor de humedad de dos clavijas clavado en el centro de un tronco recién partido,
// con la aguja / pantalla que marca «verde» (mojada) vs «seca». PAGO: «under twenty, you're good; way over, it's green wood».
// Props: reads = [{at (s), pct, note?}] (cada lectura mueve la aguja y cambia el tronco); ready = umbral (20). Sin texto quemado.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, LABEL, woodBg, hexA, rnd } from "./OleTheme";

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const c01 = (x: number) => Math.max(0, Math.min(1, x));

/** extremo de un tronco partido: anillos, grietas de secado (más si está seco) y color (más oscuro/húmedo si está verde) */
const LogEnd: React.FC<{ cx: number; cy: number; r: number; wet: number; seed: number }> = ({ cx, cy, r, wet, seed }) => {
  const rings = Array.from({ length: 9 }, (_, i) => r * (0.12 + i * 0.105));
  const cracks = Array.from({ length: 5 }, (_, i) => rnd(seed + i * 4) * Math.PI * 2);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 10} fill="#4C3320" />
      <circle cx={cx} cy={cy} r={r} fill={wet > 0.5 ? "#C9A06B" : "#DDBB8B"} />
      <circle cx={cx} cy={cy} r={r} fill={`rgba(70,90,110,${wet * 0.3})`} />
      {rings.map((rr, i) => <ellipse key={i} cx={cx + (rnd(seed + i) - 0.5) * 6} cy={cy + (rnd(seed + i + 7) - 0.5) * 6} rx={rr} ry={rr * 0.96} fill="none" stroke={`rgba(110,72,38,${0.35 + i * 0.03})`} strokeWidth={2} />)}
      {cracks.map((a, i) => <line key={i} x1={cx + Math.cos(a) * r * 0.1} y1={cy + Math.sin(a) * r * 0.1} x2={cx + Math.cos(a) * r * (0.9 - wet * 0.55)} y2={cy + Math.sin(a) * r * (0.9 - wet * 0.55)} stroke="rgba(50,28,12,0.55)" strokeWidth={wet > 0.5 ? 0 : 3} strokeLinecap="round" />)}
      {wet > 0.5 ? Array.from({ length: 14 }, (_, i) => <circle key={i} cx={cx + (rnd(seed + i * 3) - 0.5) * r * 1.5} cy={cy + (rnd(seed + i * 3 + 1) - 0.5) * r * 1.5} r={3 + rnd(i) * 3} fill="rgba(235,245,255,0.75)" />) : null}
    </g>
  );
};

export const StvMoistureMeter: React.FC<{ reads?: { at: number; pct: number }[]; ready?: number; max?: number; bed?: string }> = ({ reads = [{ at: 0.5, pct: 41 }, { at: 3.4, pct: 16 }], ready = 20, max = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // lectura vigente con transición suave entre lecturas
  let val = 0, idx = 0;
  reads.forEach((r, i) => { if (t >= r.at) { idx = i; } });
  const cur = reads[idx], prev = reads[idx - 1];
  const p = c01((t - cur.at) / 1.1);
  val = interpolate(ease(p), [0, 1], [prev ? prev.pct : 0, cur.pct]);
  const wetNow = val > ready;
  const ang = -120 + (Math.min(val, max) / max) * 240;      // aguja de -120° a +120°
  const arc = (a0: number, a1: number, r: number) => {
    const p0 = [Math.cos((a0 - 90) * Math.PI / 180) * r, Math.sin((a0 - 90) * Math.PI / 180) * r], p1 = [Math.cos((a1 - 90) * Math.PI / 180) * r, Math.sin((a1 - 90) * Math.PI / 180) * r];
    return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1[0]} ${p1[1]}`;
  };
  const readyAng = -120 + (ready / max) * 240;
  const pin = interpolate(t, [Math.max(0, cur.at - 0.4), cur.at + 0.1], [prev ? 0.2 : 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }); // clavijas se clavan cada lectura
  const enter = c01(t / 0.5);
  return (
    <AbsoluteFill style={{ ...woodBg("#B98C5A"), opacity: 1 }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 38%, ${hexA("#FFF4DE", 0.5)}, transparent 62%)` }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <ellipse cx="760" cy="830" rx="560" ry="46" fill="rgba(30,16,6,0.30)" />
        {/* tronco partido, extremo hacia arriba */}
        <g opacity={enter}>
          <LogEnd cx={620} cy={520} r={290} wet={wetNow ? 1 : 0.1} seed={idx * 100 + 7} />
          {/* medidor: cuerpo oscuro + 2 clavijas que se clavan en el centro */}
          <g transform={`translate(${880 + pin * 70}, ${300 - pin * 60}) rotate(${28 - pin * 10})`}>
            <rect x="-50" y="120" width="8" height="210" rx="3" fill="#C9CDD2" transform="translate(-6,0)" />
            <rect x="42" y="120" width="8" height="210" rx="3" fill="#C9CDD2" transform="translate(6,0)" />
            <rect x="-118" y="-150" width="236" height="290" rx="34" fill="#232629" stroke="#0e0f10" strokeWidth="4" />
            <rect x="-90" y="-116" width="180" height="92" rx="12" fill={wetNow ? "#3C6F54" : "#3C8E5A"} />
            <text x="0" y="-45" textAnchor="middle" fontFamily="Oswald, monospace" fontSize="76" fontWeight={700} fill="#EAFBE8">{Math.round(val)}%</text>
            <circle cx="-42" cy="52" r="20" fill="#3A3D40" /><circle cx="42" cy="52" r="20" fill="#3A3D40" />
            <rect x="-70" y="90" width="140" height="10" rx="5" fill={hexA(OLE.ember, 0.9)} />
          </g>
        </g>
        {/* dial / semáforo */}
        <g transform="translate(1440,520)" opacity={enter}>
          <circle r="270" fill={OLE.cream} stroke={OLE.iron} strokeWidth="10" />
          <path d={arc(-120, readyAng, 214)} stroke="#3E8E52" strokeWidth="46" fill="none" strokeLinecap="butt" />
          <path d={arc(readyAng, 120, 214)} stroke="#C0452B" strokeWidth="46" fill="none" strokeLinecap="butt" />
          {Array.from({ length: 9 }, (_, i) => { const a = (-120 + i * 30) * Math.PI / 180 - Math.PI / 2; return <line key={i} x1={Math.cos(a) * 236} y1={Math.sin(a) * 236} x2={Math.cos(a) * 258} y2={Math.sin(a) * 258} stroke={OLE.iron} strokeWidth="6" />; })}
          <g transform={`rotate(${ang})`}><polygon points="-12,20 12,20 4,-200 -4,-200" fill={OLE.iron} /><circle r="26" fill={OLE.iron} /></g>
          <text y="160" textAnchor="middle" fontFamily={LABEL} fontSize="42" letterSpacing="4" fill={wetNow ? "#C0452B" : "#2F7A45"}>{wetNow ? "GREEN WOOD" : "READY TO BURN"}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
export default StvMoistureMeter;
