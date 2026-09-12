import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── ScalpDive — el BUCEO tallo→raíz (hero del hook de PELO) ───────────────────
// Firma visual del canal para "tu pelo ya está muerto — lo vivo está en la raíz".
// La cámara arranca en los TALLOS (arriba, se tachan: DEAD), se zambulle hacia
// abajo atravesando el cuero cabelludo y aterriza en el FOLÍCULO vivo latiendo
// (glow dorado, capilar que pulsa). 100% dibujado (SVG) → sin assets, sin 404.
// Data-driven: labelTop / labelRoot / tone. Self-contained.

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", CREAM = "#F5F9FA", GOLD = "#E9C46A", DANGER = "#E4141B";

export const ScalpDive: React.FC<{
  durationInFrames: number;
  labelTop?: string;
  labelRoot?: string;
  tone?: "teal";
}> = ({ durationInFrames, labelTop = "The strand you brush is DEAD", labelRoot = "The only living part is HERE" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = durationInFrames;

  // ── cámara: viaja hacia abajo por el "core sample" (0 → -1820px) con leve zoom ──
  const travel = interpolate(frame, [0, D * 0.62, D], [0, -1520, -1820], { extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const zoom = interpolate(frame, [0, D], [1.0, 1.16], { extrapolateRight: "clamp" });

  // pulso del folículo / capilar
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 1.6);
  const glow = interpolate(frame, [D * 0.5, D * 0.72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // labels
  const topSp = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 120 } });
  const topOut = interpolate(frame, [D * 0.34, D * 0.44], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strike = spring({ frame: frame - 24, fps, config: { damping: 18, stiffness: 120 } });
  const rootSp = spring({ frame: frame - Math.round(D * 0.6), fps, config: { damping: 18, stiffness: 120 } });

  // partículas (oxígeno/nutrientes subiendo por el capilar)
  const motes = Array.from({ length: 10 }, (_, i) => {
    const p = ((frame / fps) * 0.35 + i / 10) % 1;
    return { x: 970 + Math.sin((i + p) * 6) * 26, y: 1760 - p * 240, o: Math.sin(p * Math.PI) * 0.8 };
  });

  return (
    <AbsoluteFill style={{ fontFamily: INTER, background: "radial-gradient(120% 90% at 50% 20%, #12242B 0%, #0A171C 60%, #060F13 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="sd_strand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7C5A3A" /><stop offset="1" stopColor="#3A2A1C" />
            </linearGradient>
            <linearGradient id="sd_skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E8C4A6" /><stop offset="0.5" stopColor="#C98F6E" /><stop offset="1" stopColor="#8A5540" />
            </linearGradient>
            <radialGradient id="sd_bulb" cx="0.5" cy="0.42" r="0.6">
              <stop offset="0" stopColor="#FFE9A8" /><stop offset="0.5" stopColor={GOLD} /><stop offset="1" stopColor="#9A6B12" />
            </radialGradient>
            <radialGradient id="sd_glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={GOLD} stopOpacity="0.55" /><stop offset="1" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <filter id="sd_soft"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>

          {/* ====== todo el "core" se mueve con la cámara ====== */}
          <g transform={`translate(0 ${travel})`}>
            {/* ---- ZONA 1: TALLOS (aire, arriba de la piel) y=0..640 ---- */}
            {Array.from({ length: 13 }, (_, i) => {
              const x = 250 + i * 118;
              const sway = Math.sin((frame / fps) * 0.8 + i) * 6;
              const dead = i === 6;
              return (
                <path key={i} d={`M ${x} 40 C ${x + sway} 220, ${x - sway} 430, ${x + sway * 1.4} 640`}
                  stroke={dead ? "#6E5236" : "url(#sd_strand)"} strokeWidth={dead ? 15 : 11} fill="none" strokeLinecap="round" opacity={dead ? 1 : 0.82} />
              );
            })}
            {/* tacha DEAD sobre el tallo central */}
            <g transform="translate(0 0)" opacity={strike}>
              <line x1={640} y1={300} x2={1290} y2={300} stroke={DANGER} strokeWidth={12} strokeLinecap="round" transform="rotate(-6 965 300)" />
            </g>

            {/* ---- ZONA 2: SUPERFICIE DEL CUERO CABELLUDO y=640..760 ---- */}
            <rect x={0} y={640} width={1920} height={130} fill="url(#sd_skin)" />
            <rect x={0} y={640} width={1920} height={10} fill="#F0D3B6" opacity={0.7} />
            {Array.from({ length: 24 }, (_, i) => (
              <ellipse key={i} cx={70 + i * 78} cy={700} rx={7} ry={4} fill="#7A4A34" opacity={0.5} />
            ))}

            {/* ---- ZONA 3: DERMIS (bajo la piel) y=760..1900 ---- */}
            <rect x={0} y={760} width={1920} height={1200} fill="#2A1A14" />
            <rect x={0} y={760} width={1920} height={1200} fill="url(#sd_skin)" opacity={0.12} />

            {/* el folículo central, hundido en la dermis, con su tallo entrando desde la piel */}
            <path d={`M 965 660 C 965 900, 965 1200, 965 1560`} stroke="#5B4026" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.9} />

            {/* halo/glow del folículo vivo */}
            <circle cx={965} cy={1620} r={360} fill="url(#sd_glow)" opacity={glow * (0.6 + pulse * 0.4)} />

            {/* capilar (vaso sanguíneo) que abraza el bulbo y pulsa */}
            <path d={`M 720 1980 C 780 1760, 900 1700, 965 1690 C 1030 1700, 1150 1760, 1210 1980`}
              stroke="#C0304A" strokeWidth={10 + pulse * 6} fill="none" strokeLinecap="round" opacity={0.5 + glow * 0.5} />
            <path d={`M 760 1980 C 820 1800, 905 1740, 965 1735 C 1025 1740, 1110 1800, 1170 1980`}
              stroke="#E4586E" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.4 + glow * 0.5} />

            {/* BULBO del folículo (onion) — vivo, dorado, latiendo */}
            <g transform={`translate(965 1640) scale(${1 + pulse * 0.05 * glow})`}>
              <path d="M -120 -150 C -150 40, -95 175, 0 190 C 95 175, 150 40, 120 -150 C 70 -95, -70 -95, -120 -150 Z" fill="url(#sd_bulb)" filter="url(#sd_soft)" opacity={0.35 + glow * 0.65} />
              <path d="M -120 -150 C -150 40, -95 175, 0 190 C 95 175, 150 40, 120 -150 C 70 -95, -70 -95, -120 -150 Z" fill="none" stroke={GOLD} strokeWidth={4} opacity={glow} />
              {/* papila dérmica */}
              <ellipse cx={0} cy={120} rx={54} ry={40} fill="#B3421E" opacity={0.55 + glow * 0.45} />
              <circle cx={0} cy={40} r={16} fill="#FFF3CC" opacity={glow} />
            </g>

            {/* motas de oxígeno/nutrientes subiendo */}
            {motes.map((m, i) => (
              <circle key={i} cx={m.x} cy={m.y} r={5} fill={GOLD} opacity={m.o * glow} />
            ))}
          </g>
        </svg>
      </AbsoluteFill>

      {/* viñeta */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.6)" }} />

      {/* etiqueta TALLO (DEAD) — arriba, temprano */}
      {labelTop && (
        <div style={{ position: "absolute", left: "50%", top: 150, transform: `translateX(-50%) translateY(${(1 - topSp) * 20}px)`, opacity: topSp * topOut }}>
          <div style={{ background: "rgba(11,20,24,0.9)", border: `1px solid ${DANGER}66`, borderRadius: 16, padding: "16px 34px", boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
            <span style={{ fontSize: 46, fontWeight: 900, color: CREAM }}>{labelTop}</span>
          </div>
        </div>
      )}

      {/* etiqueta RAÍZ (viva) — abajo, tardía, con flecha al bulbo */}
      {labelRoot && (
        <div style={{ position: "absolute", left: "50%", bottom: 140, transform: `translateX(-50%) translateY(${(1 - rootSp) * 20}px)`, opacity: rootSp }}>
          <div style={{ background: "rgba(11,20,24,0.92)", border: `1px solid ${GOLD}`, borderRadius: 18, padding: "18px 40px", boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${GOLD}44`, textAlign: "center" }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: GOLD, letterSpacing: 2, display: "block", marginBottom: 4 }}>THE FOLLICLE</span>
            <span style={{ fontSize: 48, fontWeight: 900, color: CREAM }}>{labelRoot}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
