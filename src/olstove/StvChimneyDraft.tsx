// StvChimneyDraft — la chimenea en corte sobre el techo: regla 3-2-10 (3 pies sobre el techo, 2 pies más que lo que esté a 10 pies),
// el tiraje (el humo sube por el caño tibio) y el sombrero con su malla. PAGO: «at least three feet above the roof… a cap keeps the rain out».
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { StvBed } from "./StvBed";
import { OLE, HAND, woodBg, hexA, rnd } from "./OleTheme";
const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const StvChimneyDraft: React.FC<{ bed?: string;  labels?: { a: string; b: string; c: string; cap: string } }> = ({ bed, labels = { a: "3 ft", b: "2 ft", c: "10 ft", cap: "cap + screen" } }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const m3 = c01((t - 0.8) / 0.8), m2 = c01((t - 1.9) / 0.8), m10 = c01((t - 3.0) / 0.8), cap = c01((t - 4.2) / 0.7);
  const px = 620, roofY = 700, ridgeX = 1400, ridgeY = 470, top = 210;
  const slopeY = (x: number) => roofY - ((x - 260) / (ridgeX - 260)) * (roofY - ridgeY);
  const ry = slopeY(px);
  return (
    <AbsoluteFill style={bed ? undefined : woodBg("#B98C5A")}>
      {bed ? <StvBed src={bed} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 40%, ${hexA("#FFF4DE", 0.5)}, transparent 62%)` }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <polygon points={`260,${roofY + 300} 260,${roofY} ${ridgeX},${ridgeY} ${ridgeX + 620},${roofY + 60} ${ridgeX + 620},${roofY + 300}`} fill="#6B4A2E" />
        <polygon points={`260,${roofY} ${ridgeX},${ridgeY} ${ridgeX + 620},${roofY + 60} ${ridgeX + 620},${roofY + 120} ${ridgeX},${ridgeY + 60} 260,${roofY + 60}`} fill="#3D2A19" />
        <rect x={px - 34} y={top} width="68" height={ry + 130 - top} fill="#2A2725" stroke="#0a0a0a" strokeWidth="5" />
        <rect x={px - 34} y={top} width="14" height={ry + 130 - top} fill="rgba(255,255,255,0.12)" />
        <g opacity={cap}><polygon points={`${px - 74},${top} ${px},${top - 60} ${px + 74},${top}`} fill="#1a1918" stroke="#000" strokeWidth="4" /><rect x={px - 50} y={top} width="100" height="34" fill="none" stroke="#6b665f" strokeWidth="3" strokeDasharray="6 5" />
          <text x={px + 100} y={top - 10} fontFamily={HAND} fontSize="40" fill={OLE.iron} fontWeight={700}>{labels.cap}</text></g>
        {Array.from({ length: 10 }, (_, i) => { const u = ((t * 0.32 + rnd(i * 4)) % 1); return <ellipse key={i} cx={px + Math.sin(u * 6 + i) * 8 + u * 30} cy={ry + 120 - u * (ry + 120 - top + 120)} rx={12 + 26 * u} ry={10 + 22 * u} fill={hexA("#8A857F", 0.5 * (1 - u))} />; })}
        <g opacity={m3}><line x1={px - 90} y1={ry} x2={px - 90} y2={ry - (ry - top) * m3} stroke="#F2C230" strokeWidth="12" /><line x1={px - 110} y1={ry} x2={px - 70} y2={ry} stroke="#111" strokeWidth="5" /><text x={px - 130} y={(ry + top) / 2} textAnchor="end" fontFamily={HAND} fontSize="56" fontWeight={700} fill={OLE.iron}>{labels.a}</text></g>
        <g opacity={m10}><line x1={px + 60} y1={top + 100} x2={px + 60 + (ridgeX - px - 60) * m10} y2={top + 100} stroke="#F2C230" strokeWidth="12" strokeDasharray="22 12" /><text x={(px + ridgeX) / 2} y={top + 80} textAnchor="middle" fontFamily={HAND} fontSize="56" fontWeight={700} fill={OLE.iron}>{labels.c}</text></g>
        <g opacity={m2}><line x1={ridgeX} y1={ridgeY} x2={ridgeX} y2={ridgeY - (ridgeY - top + 20) * m2} stroke="#F2C230" strokeWidth="12" /><text x={ridgeX + 30} y={(ridgeY + top) / 2 + 30} fontFamily={HAND} fontSize="56" fontWeight={700} fill={OLE.iron}>{labels.b}</text></g>
        <line x1={260} y1={top - 60} x2={ridgeX + 620} y2={top - 60} stroke="#F2C230" strokeWidth="3" strokeDasharray="8 10" opacity={m2 * 0.7} />
      </svg>
    </AbsoluteFill>
  );
};
export default StvChimneyDraft;
