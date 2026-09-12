import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  RimLight,
  DepthShadow,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxWaterRevive — PIEZA ÚNICA · truco 7 del video de AGUA OXIGENADA:
// "agua muerta → viva". Un FRASCO de vidrio lleno de agua TURBIA con verdín
// (algas verdes en suspensión, film flotante). Cae UNA gota de peróxido desde
// arriba, y una CASCADA de burbujas de O₂ sube desde el fondo: el líquido pasa
// de turbio-verdoso a CRISTALINO. La refracción del vidrio (feDisplacementMap)
// ondula todo el interior; un rim-light cálido recorta el frasco del fondo.
//
// PROFUNDIDAD REAL: frasco en primer plano con sombra multicapa + rim-light,
// interior refractado por SVG, parallax del verdín contra las burbujas, gota
// con física de resorte + splash, god-rays cálidos detrás. Clímax = el momento
// en que el verde se apaga y el brillo cristalino sube. Esquina inf-der libre.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Determinístico por índice.
// 1920×1080. Texto ES por props con DEFAULT.
// ═══════════════════════════════════════════════════════════════════════════

const GLASS = "#EDE4CE";
const MURKY = "#6b7a3f"; // verdín / agua muerta
const CLEAR = COLORS.cold; // eucalipto = agua viva/clara
const O2 = COLORS.cold;
const DROP = "#EDE4CE";

export const PxWaterRevive: React.FC<{
  durationInFrames: number;
  title?: string;
}> = ({ durationInFrames, title = "Agua muerta → viva" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // ── la GOTA cae desde arriba y toca la superficie a ~1.5s ───────────────────
  const dropStart = sec(0.9);
  const dropDur = sec(0.6);
  const dropP = interpolate(frame - dropStart, [0, dropDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const surfaceY = 300; // superficie del agua dentro del frasco (coords svg 0..900)
  const dropY = interpolate(dropP, [0, 1], [80, surfaceY]);
  const impact = dropP >= 1;
  // splash con resorte al impactar
  const splash = spring({ frame: frame - (dropStart + dropDur), fps, config: { damping: 12, mass: 0.6, stiffness: 200 } });

  // ── la CLARIFICACIÓN: turbio→cristalino, arranca al impacto, sube desde el fondo ─
  const clarify = spring({ frame: frame - (dropStart + dropDur), fps, config: { damping: 200, mass: 1, stiffness: 40 } });
  // frente de clarificación que sube (fondo→superficie)
  const clearFront = interpolate(clarify, [0, 1], [820, surfaceY]);
  const murkOpacity = interpolate(clarify, [0, 1], [0.92, 0.06]);

  const Label: React.FC<{ x: number; y: number; text: string; at: number; color?: string; anchor?: "start" | "middle" | "end"; size?: number }> = ({ x, y, text, at, color = COLORS.text, anchor = "middle", size = 38 }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={size} fontWeight={900} fill={color} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 7 }}>{text}</text>
      </g>
    );
  };

  // geometría del frasco (svg 1600×900) — centrado-izquierda para dejar libre la esquina PiP
  const jarX = 540, jarW = 420, jarTop = 200, jarBot = 820, jarR = 60;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <SvgFilters prefix="water" />
      <TechBackground glowX={40} glowY={40} hue="cold" drift={0.3} />
      <GodRays x={30} y={-10} angle={-14} color="rgba(111,132,120,0.22)" intensity={0.85} rays={6} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      <SfxCue at={dropStart + dropDur} src={SFX.popUp} volume={0.4} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)`, fontFamily: FONT_STACK }}>
          {title && (
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.text }}>{title}</div>
            </div>
          )}

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            <defs>
              {/* clip del interior del frasco (bordes redondeados abajo) */}
              <clipPath id="water-jar">
                <path d={`M ${jarX} ${jarTop} L ${jarX + jarW} ${jarTop} L ${jarX + jarW} ${jarBot - jarR} Q ${jarX + jarW} ${jarBot} ${jarX + jarW - jarR} ${jarBot} L ${jarX + jarR} ${jarBot} Q ${jarX} ${jarBot} ${jarX} ${jarBot - jarR} Z`} />
              </clipPath>
              <linearGradient id="water-clear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CLEAR} stopOpacity={0.18} />
                <stop offset="100%" stopColor={CLEAR} stopOpacity={0.42} />
              </linearGradient>
              <radialGradient id="water-shine" cx="34%" cy="28%">
                <stop offset="0%" stopColor="#fff" stopOpacity={0.5} />
                <stop offset="60%" stopColor="#fff" stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* ═══ GOTA que cae (antes del impacto) ═══ */}
            {!impact && dropP > 0 && (
              <g opacity={enter}>
                <ellipse cx={jarX + jarW / 2} cy={dropY} rx={16} ry={24} fill={DROP} opacity={0.9} />
                <ellipse cx={jarX + jarW / 2 - 5} cy={dropY - 6} rx={5} ry={8} fill="#fff" opacity={0.6} />
                {/* estela */}
                <line x1={jarX + jarW / 2} y1={dropY - 40} x2={jarX + jarW / 2} y2={dropY} stroke={DROP} strokeWidth={4} opacity={0.35 * (1 - dropP)} />
              </g>
            )}

            {/* ═══ INTERIOR DEL FRASCO — refractado por SVG ═══ */}
            <g clipPath="url(#water-jar)">
              <g filter="url(#water-ripple)">
                {/* base de agua clara (siempre debajo) */}
                <rect x={jarX} y={surfaceY} width={jarW} height={jarBot - surfaceY} fill="url(#water-clear)" />

                {/* CAPA TURBIA (verdín) — se apaga con clarify, y el frente sube */}
                <g opacity={murkOpacity}>
                  <rect x={jarX} y={surfaceY} width={jarW} height={jarBot - surfaceY} fill={MURKY} opacity={0.5} />
                  {/* verdín en suspensión (partículas verdes flotando) — parallax lento */}
                  {Array.from({ length: 40 }, (_, i) => {
                    const ax = jarX + 20 + rand(i) * (jarW - 40) + wobble(i, frame, 0.8) * 10;
                    const ay = surfaceY + 30 + rand(i, 2) * (jarBot - surfaceY - 40) + Math.sin(frame / 40 + i) * 6;
                    // el verdín por debajo del frente clarificado se disuelve
                    const below = ay > clearFront ? 1 : 0.15;
                    const ar = 3 + rand(i, 3) * 5;
                    return (
                      <g key={"al" + i} opacity={below}>
                        <ellipse cx={ax} cy={ay} rx={ar} ry={ar * 0.6} fill="#4f6b2a" opacity={0.7} transform={`rotate(${rand(i, 4) * 360} ${ax} ${ay})`} />
                      </g>
                    );
                  })}
                </g>

                {/* film verde flotante en la superficie (se rompe al impactar) */}
                <g opacity={interpolate(clarify, [0, 0.5], [0.7, 0], { extrapolateRight: "clamp" })}>
                  <rect x={jarX} y={surfaceY} width={jarW} height={16} fill="#3f5a20" opacity={0.6} />
                  {Array.from({ length: 8 }, (_, i) => (
                    <circle key={"fm" + i} cx={jarX + 30 + rand(i, 6) * (jarW - 60)} cy={surfaceY + 8} r={10 + rand(i, 7) * 8} fill="#3f5a20" opacity={0.5} />
                  ))}
                </g>

                {/* CASCADA de burbujas de O₂ subiendo desde el fondo (clímax) */}
                {Array.from({ length: 40 }, (_, i) => {
                  const span = 90 + Math.floor(rand(i, 1) * 80);
                  const p = ((frame + rand(i, 2) * span) % span) / span;
                  const bx = jarX + 26 + rand(i) * (jarW - 52) + wobble(i, frame, 1.6) * 10;
                  const by = jarBot - 20 - p * (jarBot - surfaceY - 20);
                  const br = 4 + rand(i, 4) * 9;
                  const op = Math.sin(p * Math.PI) * 0.9 * clarify;
                  return (
                    <g key={"o2" + i} opacity={op}>
                      <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.4} />
                      <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2} />
                      <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.34} ry={br * 0.24} fill="#fff" opacity={0.6} />
                    </g>
                  );
                })}

                {/* onda de superficie por el impacto de la gota */}
                {impact && (
                  <g opacity={interpolate(splash, [0, 1], [0.8, 0])}>
                    {[0, 1, 2].map((k) => (
                      <ellipse key={k} cx={jarX + jarW / 2} cy={surfaceY} rx={40 + splash * (90 + k * 60)} ry={10 + splash * (14 + k * 6)} fill="none" stroke="#fff" strokeWidth={2.5} opacity={0.5} />
                    ))}
                  </g>
                )}

                {/* menisco / superficie del agua */}
                <ellipse cx={jarX + jarW / 2} cy={surfaceY} rx={jarW / 2 - 6} ry={12} fill="none" stroke={CLEAR} strokeWidth={3} opacity={0.5} />
              </g>
            </g>

            {/* ═══ VIDRIO del frasco (por encima del interior) ═══ */}
            <g opacity={enter}>
              <path d={`M ${jarX} ${jarTop} L ${jarX + jarW} ${jarTop} L ${jarX + jarW} ${jarBot - jarR} Q ${jarX + jarW} ${jarBot} ${jarX + jarW - jarR} ${jarBot} L ${jarX + jarR} ${jarBot} Q ${jarX} ${jarBot} ${jarX} ${jarBot - jarR} Z`} fill="none" stroke={GLASS} strokeWidth={10} opacity={0.85} />
              {/* boca del frasco */}
              <rect x={jarX - 24} y={jarTop - 30} width={jarW + 48} height={34} rx={12} fill="none" stroke={GLASS} strokeWidth={10} opacity={0.85} />
              {/* reflejo especular en el vidrio */}
              <rect x={jarX + 30} y={jarTop + 30} width={26} height={jarBot - jarTop - 90} rx={13} fill="url(#water-shine)" opacity={0.8} />
              <ellipse cx={jarX + jarW / 2} cy={jarTop + 40} rx={jarW / 2 - 10} ry={80} fill="url(#water-shine)" opacity={0.3} />
            </g>

            {/* ═══ ETIQUETAS ═══ */}
            <Label x={1180} y={340} text="Turbia · sin oxígeno" at={0.5} color={MURKY} anchor="start" size={40} />
            <Label x={1180} y={640} text="Cristalina · oxigenada" at={2.0} color={CLEAR} anchor="start" size={40} />
            {/* flechita de transición */}
            <g opacity={lab(1.6)}>
              <path d="M 1210 400 C 1240 480, 1240 540, 1210 600" fill="none" stroke={CLEAR} strokeWidth={5} strokeLinecap="round" />
              <path d="M 1210 600 l -14 -20 M 1210 600 l 20 -12" stroke={CLEAR} strokeWidth={5} strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* frasco recortado del fondo con sombra multicapa + rim-light cálido (overlay HTML para profundidad) */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.5 * enter }}>
        <div style={{ position: "absolute", left: "33%", top: "20%", width: "27%", height: "70%" }}>
          <RimLight color={COLORS.amber} spread={34} x={0.2} y={0.2}>
            <DepthShadow layers={5} distance={42} radius={40} color="rgba(30,22,14,0.22)">
              <div style={{ width: "100%", height: "100%", borderRadius: 40 }} />
            </DepthShadow>
          </RimLight>
        </div>
      </AbsoluteFill>

      {/* motas de luz suave flotando para atmósfera */}
      <ParallaxLayer depth={0.7} driftY={14} driftX={20}>
        <ParticleField count={14} kind="bubbles" rise drift={18} opacity={0.3 * enter} />
      </ParallaxLayer>

      <PaperGrain opacity={0.1} />
    </AbsoluteFill>
  );
};

export default PxWaterRevive;
