// BoltDownCut.tsx — CORTE del piso con la caja atornillada (canal Ray Kessler · rkhanger).
// Vista en sección: la caja sobre el entablonado, debajo la viga (joist). Cuatro tirafondos bajan
// GIRANDO (la rosca avanza), muerden la viga, y al final una flecha roja tira hacia arriba y la
// caja NO se mueve (vibra y vuelve). Cámara virtual: entra a la rosca que muerde la viga y sale.
import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, PhotoBed, Keyring, clamp01 } from "./RayStage";

const ez = Easing.bezier(0.3, 0, 0.2, 1);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const BoltDownCut: React.FC<{
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "FIX THREE · ABOUT FOUR DOLLARS",
  title = "Bolt it down",
  caption = "Into the joist, not just the floor.",
  bed,
  durationInFrames = 180,
}) => {
  const f = useCurrentFrame();
  const dur = Math.max(60, durationInFrames);
  const p = f / dur;
  const aHead = ez(seg(p, 0, 0.1));
  const floorY = 560, safeW = 440, safeH = 330, sx = 580;
  const boltsX = [sx + 60, sx + 170, sx + 270, sx + 380];
  const zin = ez(seg(p, 0.42, 0.6)), zout = ez(seg(p, 0.66, 0.78));
  const z = 1 + 0.5 * zin - 0.5 * zout;
  const pull = seg(p, 0.78, 0.96);
  const shake = pull > 0 ? Math.sin(f * 1.7) * 3 * (1 - pull) : 0;
  const aCap = ez(seg(p, 0.8, 0.9));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.8} />
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: "46% 72%" }}>
        <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "100%" }}>
          <defs>
            <pattern id="bdWood" width="40" height="18" patternUnits="userSpaceOnUse">
              <rect width="40" height="18" fill="#3a2a1a" />
              <path d="M0 9 Q10 5 20 9 T40 9" stroke="#5a4128" strokeWidth="2" fill="none" />
            </pattern>
            <pattern id="bdJoist" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="#4a3520" />
              <path d="M0 15 Q8 10 15 15 T30 15" stroke="#6a4c2c" strokeWidth="2" fill="none" />
            </pattern>
          </defs>
          {/* entablonado + viga */}
          <rect x="200" y={floorY} width="1200" height="40" fill="url(#bdWood)" stroke={rgba(V.bone, 0.4)} strokeWidth="2" />
          <rect x="560" y={floorY + 40} width="480" height="200" fill="url(#bdJoist)" stroke={rgba(V.bone, 0.4)} strokeWidth="2" />
          <text x="1060" y={floorY + 150} fontFamily={F_BODY} fontSize="30" fill={V.bone}>joist</text>
          <text x="210" y={floorY + 80} fontFamily={F_BODY} fontSize="28" fill={rgba(V.bone, 0.7)}>subfloor</text>
          {/* caja */}
          <g transform={`translate(${shake.toFixed(2)}, ${(-6 * pull * (1 - pull) * 4).toFixed(2)})`}>
            <rect x={sx} y={floorY - safeH} width={safeW} height={safeH} rx="14" fill={rgba(V.steel, 0.2)} stroke={V.steel} strokeWidth="5" />
            <rect x={sx + 18} y={floorY - safeH + 18} width={safeW - 36} height={safeH - 36} rx="8" fill="none" stroke={rgba(V.steel, 0.6)} strokeWidth="2" />
            <rect x={sx + 60} y={floorY - safeH + 70} width="90" height="110" rx="6" fill="none" stroke={V.bone} strokeWidth="2" />
          </g>
          {/* tirafondos: bajan girando, escalonados */}
          {boltsX.map((x, i) => {
            const d = ez(seg(p, 0.12 + i * 0.07, 0.3 + i * 0.07));
            const len = 230;
            const top = floorY - 30 - 40 * (1 - d);
            const depth = top + len * (0.35 + 0.65 * d);
            const rot = f * 0.9;
            return (
              <g key={i} opacity={clamp01(d * 3)}>
                <rect x={x - 14} y={top - 12} width="28" height="12" rx="3" fill={V.brass} />
                <line x1={x} y1={top} x2={x} y2={depth} stroke={V.bone} strokeWidth="10" />
                {Array.from({ length: 12 }).map((_, k) => {
                  const y = top + 20 + k * 17 + ((rot % 17) * (1 - d));
                  return y < depth ? <line key={k} x1={x - 10} y1={y} x2={x + 10} y2={y + 7} stroke={rgba(V.ink0, 0.9)} strokeWidth="3" /> : null;
                })}
              </g>
            );
          })}
          {/* la mordida en la viga */}
          <circle cx={boltsX[1]} cy={floorY + 130} r={46 + 6 * Math.sin(f / 5)} fill="none" stroke={V.brassSoft} strokeWidth="4" opacity={zin * (1 - zout)} />
          {/* tirón rojo hacia arriba */}
          <g opacity={pull > 0 ? 1 : 0}>
            <line x1={sx + safeW / 2} y1={floorY - safeH - 20} x2={sx + safeW / 2} y2={floorY - safeH - 20 - 150 * pull} stroke={V.danger} strokeWidth="10" />
            <path d={`M ${sx + safeW / 2 - 26} ${floorY - safeH - 150 * pull} L ${sx + safeW / 2} ${floorY - safeH - 40 - 150 * pull} L ${sx + safeW / 2 + 26} ${floorY - safeH - 150 * pull} Z`} fill={V.danger} />
          </g>
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: "5%", top: "7%", opacity: aHead, transform: `translateY(${((1 - aHead) * 14).toFixed(1)}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 72, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>{title}</div>
      </div>
      <div style={{ position: "absolute", right: "5%", bottom: "9%", opacity: aCap, padding: "12px 24px", background: rgba(V.ink0, 0.8), borderRight: `5px solid ${V.brass}` }}>
        <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 36, color: V.white }}>{caption}</div>
      </div>
      <div style={{ position: "absolute", left: "5%", bottom: "7%", opacity: 0.85 * aHead }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
