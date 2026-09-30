// StvDamperDial — el regulador (damper) del caño: la manija de hierro que GIRA por cuartos, el dial de aire
// (ahogado · fuego bueno · rugiendo) y la llama + el vidrio de la puerta que responden. PAGO: «close it down a little at a time…
// if the glass blackens, open the air». Props: stops = [{at (s), deg}] (0° = todo cerrado, 90° = todo abierto).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { StvBed } from "./StvBed";
import { OLE, LABEL, woodBg, hexA } from "./OleTheme";

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const c01 = (x: number) => Math.max(0, Math.min(1, x));

export const StvDamperDial: React.FC<{ bed?: string;  stops?: { at: number; deg: number }[]; sootWord?: string }> = ({ bed, sootWord = "Open the air", stops = [{ at: 0, deg: 90 }, { at: 1.6, deg: 62 }, { at: 3.0, deg: 34 }, { at: 4.4, deg: 5 }] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const deg = interpolate(t, stops.map((s) => s.at).concat([stops[stops.length - 1].at + 1]), stops.map((s) => s.deg).concat([stops[stops.length - 1].deg]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const air = deg / 90;                                   // 0..1
  const zone = air < 0.22 ? "STARVED" : air < 0.75 ? "GOOD FIRE" : "ROARING";
  const zc = air < 0.22 ? "#C0452B" : air < 0.75 ? "#2F7A45" : "#D9772B";
  const soot = c01((0.32 - air) / 0.25) * c01(0.4 + t * 0.05);   // el vidrio se ennegrece cuando se ahoga
  const flameH = 60 + 210 * Math.min(1, air * 1.15), flameW = 90 + 60 * air;
  const fl = (i: number) => 0.85 + 0.25 * Math.sin(t * 9 + i * 2.1);
  const arc = (a0: number, a1: number, r: number) => {
    const P = (a: number) => [Math.cos((a - 90) * Math.PI / 180) * r, Math.sin((a - 90) * Math.PI / 180) * r];
    const p0 = P(a0), p1 = P(a1);
    return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
  };
  return (
    <AbsoluteFill style={bed ? undefined : woodBg("#B98C5A")}>
      {bed ? <StvBed src={bed} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 35% 40%, ${hexA("#FFF4DE", 0.5)}, transparent 60%)` }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* caño con la manija */}
        <g transform="translate(360,540)">
          <rect x="-95" y="-560" width="190" height="1120" fill="#2A2725" />
          <rect x="-95" y="-560" width="34" height="1120" fill="rgba(255,255,255,0.10)" />
          <rect x="-95" y="-560" width="190" height="1120" fill="none" stroke="#111" strokeWidth="6" />
          <circle r="66" fill="#3A3733" stroke="#0e0d0c" strokeWidth="6" />
          {/* manija: varilla larga que gira en el eje del caño */}
          <g transform={`rotate(${-deg})`}>
            <rect x="-14" y="-15" width="250" height="30" rx="14" fill="#151413" stroke="#000" strokeWidth="3" />
            <circle cx="238" cy="0" r="40" fill="#151413" stroke="#000" strokeWidth="4" />
            <circle cx="238" cy="0" r="14" fill="#3A3733" />
            <rect x="60" y="-8" width="150" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
          </g>
          <circle r="26" fill="#0e0d0c" />
        </g>
        {/* dial de aire */}
        <g transform="translate(1020,520)">
          <path d={arc(-110, -110 + 0.22 * 220, 210)} stroke="#C0452B" strokeWidth="44" fill="none" />
          <path d={arc(-110 + 0.22 * 220, -110 + 0.75 * 220, 210)} stroke="#3E8E52" strokeWidth="44" fill="none" />
          <path d={arc(-110 + 0.75 * 220, 110, 210)} stroke="#D9772B" strokeWidth="44" fill="none" />
          <g transform={`rotate(${-110 + air * 220})`}><polygon points="-11,20 11,20 4,-180 -4,-180" fill={OLE.iron} /><circle r="24" fill={OLE.iron} /></g>
          <text y="190" textAnchor="middle" fontFamily={LABEL} fontSize="46" letterSpacing="5" fill={zc}>{zone}</text>
        </g>
        {/* ventanilla de la estufa con la llama y el hollín */}
        <g transform="translate(1500,470)">
          <rect x="-190" y="-250" width="380" height="500" rx="26" fill="#1E1C1A" stroke="#0a0a0a" strokeWidth="8" />
          <rect x="-150" y="-210" width="300" height="420" rx="14" fill="#2A1508" />
          <g transform="translate(0,190)">
            {[0, 1, 2, 3].map((i) => {
              const w = flameW * (0.5 + 0.28 * i) / 2, h = flameH * (0.6 + 0.4 * (i % 2)) * fl(i);
              return <path key={i} d={`M ${-30 - i * 6 + i * 12} 0 C ${-w} ${-h * 0.4}, ${-w * 0.3} ${-h * 0.8}, ${(i - 1.5) * 10} ${-h} C ${w * 0.3} ${-h * 0.8}, ${w} ${-h * 0.4}, ${30 + i * 6 - i * 12} 0 Z`} fill={i % 2 ? "#F5B04A" : "#E7601F"} opacity={0.85} />;
            })}
          </g>
          <rect x="-150" y="-210" width="300" height="420" rx="14" fill={`rgba(8,6,5,${soot * 0.93})`} />
          {soot > 0.3 ? <text y="0" textAnchor="middle" fontFamily={LABEL} fontSize="36" letterSpacing="4" fill="rgba(255,240,220,0.75)">{sootWord.toUpperCase()}</text> : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
export default StvDamperDial;
