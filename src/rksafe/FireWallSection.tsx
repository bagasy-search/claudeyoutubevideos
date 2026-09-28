// FireWallSection.tsx — CORTE DE PARED: caja "fire safe" vs caja de robo (canal Ray Kessler · rkhanger).
// Izquierda: chapa fina + capa gruesa de "cemento" con agua. El calor (flechas naranjas) llega, la
// capa suelta VAPOR y adentro el papel queda frío. Derecha: acero grueso. Después una palanca
// (flecha roja) empuja las dos paredes: la chapa fina se DOBLA, el acero grueso no.
// Las dos mitades se construyen trazo a trazo y se transforman con el tiempo relativo a la duración.
import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, PhotoBed, Keyring, clamp01, rnd } from "./RayStage";

const ez = Easing.bezier(0.3, 0, 0.2, 1);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const FireWallSection: React.FC<{
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Two different tests",
  leftLabel = "Fire safe: heat",
  rightLabel = "Burglar safe: attack",
  bed,
  durationInFrames = 210,
}) => {
  const f = useCurrentFrame();
  const dur = Math.max(60, durationInFrames);
  const p = f / dur;
  const aHead = ez(seg(p, 0, 0.1));
  const build = ez(seg(p, 0.04, 0.25));
  const heat = seg(p, 0.25, 0.55);
  const pry = ez(seg(p, 0.6, 0.8));
  const bend = pry;
  const aR = ez(seg(p, 0.55, 0.65));

  const Wall = ({ x, thin }: { x: number; thin: boolean }) => {
    const h = 460 * build;
    const y = 250;
    const bx = thin ? 26 * bend : 0;
    return (
      <g>
        {thin ? (
          <>
            {/* chapa exterior fina que se dobla */}
            <path d={`M ${x} ${y} Q ${x + bx} ${y + h / 2} ${x} ${y + h}`} stroke={V.steel} strokeWidth="8" fill="none" />
            {/* capa de cemento con agua */}
            <rect x={x + 6} y={y} width="120" height={h} fill={rgba("#9a948a", 0.55)} />
            {Array.from({ length: 22 }).map((_, i) => (
              <circle key={i} cx={x + 18 + rnd(i * 7) * 96} cy={y + 20 + rnd(i * 13) * Math.max(1, h - 40)} r={4 + rnd(i) * 4} fill={rgba("#6fb0d8", 0.7 * (1 - heat * 0.8))} />
            ))}
            <line x1={x + 130} y1={y} x2={x + 130} y2={y + h} stroke={V.steel} strokeWidth="5" />
            {/* papel adentro */}
            <rect x={x + 170} y={y + 140} width="110" height="150" fill={V.white} opacity={build} />
            <line x1={x + 185} y1={y + 175} x2={x + 265} y2={y + 175} stroke={V.bone} strokeWidth="4" opacity={build} />
            <line x1={x + 185} y1={y + 205} x2={x + 255} y2={y + 205} stroke={V.bone} strokeWidth="4" opacity={build} />
            {/* vapor */}
            {Array.from({ length: 6 }).map((_, i) => {
              const k = ((f * 1.6 + i * 40) % 240) / 240;
              return <circle key={i} cx={x + 60 + Math.sin(k * 6 + i) * 20} cy={y - 10 - k * 160} r={14 + k * 26} fill={rgba(V.white, 0.28 * heat * (1 - k))} />;
            })}
          </>
        ) : (
          <>
            <rect x={x} y={y} width="70" height={h} fill={rgba(V.steel, 0.75)} stroke={V.white} strokeWidth="2" />
            <rect x={x + 110} y={y + 140} width="110" height="150" fill={V.white} opacity={build} />
          </>
        )}
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.8} />
      <svg viewBox="0 0 1600 900" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <line x1="800" y1="200" x2="800" y2="760" stroke={rgba(V.bone, 0.25)} strokeWidth="2" strokeDasharray="8 10" />
        <Wall x={330} thin />
        <Wall x={1060} thin={false} />
        {/* calor: flechas naranjas que llegan a la pared fina */}
        {Array.from({ length: 4 }).map((_, i) => {
          const k = ((f * 2 + i * 30) % 120) / 120;
          const y = 320 + i * 100;
          return <path key={i} d={`M ${180 + k * 120} ${y} l 30 -12 l 0 24 z M ${120 + k * 120} ${y} L ${180 + k * 120} ${y}`} stroke="#E8762B" fill="#E8762B" strokeWidth="6" opacity={heat * (1 - pry)} />;
        })}
        {/* palanca: flecha roja contra las dos paredes */}
        {[330, 1060].map((x, i) => (
          <g key={x} opacity={pry > 0 ? 1 : 0}>
            <line x1={x - 200 + 150 * pry * (i === 0 ? 1 : 0.55)} y1="480" x2={x - 60 + 150 * pry * (i === 0 ? 1 : 0.55) - 60} y2="480" stroke={V.danger} strokeWidth="14" strokeLinecap="round" />
            <path d={`M ${x - 60 + 150 * pry * (i === 0 ? 1 : 0.55) - 60} 456 l 40 24 l -40 24 z`} fill={V.danger} />
          </g>
        ))}
        {/* veredicto */}
        <text x="330" y="800" fontFamily={F_DISPLAY} fontWeight={700} fontSize="46" fill={V.dangerSoft} opacity={pry}>✕</text>
        <text x="1060" y="800" fontFamily={F_DISPLAY} fontWeight={700} fontSize="46" fill={V.ok} opacity={pry}>✓</text>
      </svg>
      <div style={{ position: "absolute", left: "5%", top: "7%", opacity: aHead }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 68, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>{title}</div>
      </div>
      <div style={{ position: "absolute", left: "16%", top: "19%", opacity: build, fontFamily: F_BODY, fontWeight: 700, fontSize: 38, color: V.brassSoft, padding: "6px 14px", background: rgba(V.ink0, 0.7) }}>{leftLabel}</div>
      <div style={{ position: "absolute", left: "62%", top: "19%", opacity: aR, fontFamily: F_BODY, fontWeight: 700, fontSize: 38, color: V.white, padding: "6px 14px", background: rgba(V.ink0, 0.7) }}>{rightLabel}</div>
      <div style={{ position: "absolute", right: "5%", bottom: "6%", opacity: 0.85 * aHead }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
