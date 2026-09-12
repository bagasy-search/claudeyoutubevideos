import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  PaperGrain,
  DepthShadow,
  InkDraw,
  WaxSeal,
  Odometer,
  RimLight,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// ChapterMarkerKit — MARCA DE CAPÍTULO de la marca terroso-vintage.
// Genérico y PROP-DRIVEN: número de sección (romano o árabe) + título + subtítulo.
// El número grande se DIBUJA a pluma (romano con InkDraw) o RUEDA como odómetro de
// almanaque (árabe). Un sello de lacre lo remata. Fondo con parallax multicapa y
// rayos cálidos para sensación de tomo antiguo abriéndose.
// Técnica: Odometer/InkDraw del número, WaxSeal opcional, ParallaxLayer de fondo,
//          DepthShadow, GodRays, PaperGrain.
// RENDER-SAFE: todo deriva de useCurrentFrame() (spring/interpolate).
// ═══════════════════════════════════════════════════════════════════════════

const ROMAN: [number, string][] = [
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
const toRoman = (n: number): string => {
  let out = "";
  let v = Math.max(1, Math.min(39, Math.floor(n)));
  // soporte hasta XXXIX (39) — suficiente para capítulos
  const table: [number, string][] = [
    [30, "XXX"], [20, "XX"], [10, "X"], ...ROMAN,
  ];
  for (const [val, sym] of table) {
    while (v >= val) {
      out += sym;
      v -= val;
    }
  }
  return out;
};

export const ChapterMarkerKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  index?: number;
  label?: string;
  roman?: boolean;
}> = ({
  durationInFrames,
  title,
  subtitle,
  accent = COLORS.amber,
  index = 1,
  label = "El comienzo",
  roman = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heading = title ?? label;

  // ── Entradas escalonadas ──────────────────────────────────────────────────
  const enter = spring({ frame, fps, config: { damping: 20, mass: 1, stiffness: 85 } });
  const numIn = spring({ frame: frame - sec(0.3), fps, config: { damping: 16, mass: 0.9, stiffness: 120 } });
  const wordIn = spring({ frame: frame - sec(0.7), fps, config: { damping: 200, stiffness: 55 } });
  const capIn = spring({ frame: frame - sec(0.55), fps, config: { damping: 200, stiffness: 60 } });
  const subIn = spring({ frame: frame - sec(1.15), fps, config: { damping: 200, stiffness: 55 } });

  const outFade = interpolate(
    frame,
    [durationInFrames - sec(0.6), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const breathe = 1 + Math.sin(frame / 100) * 0.005;
  const idleY = wobble(1, frame, 0.45) * 3;

  // numeral romano: trazos por letra dibujados a pluma
  const romanStr = toRoman(index);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg2, fontFamily: FONT_STACK, opacity: outFade }}>
      <SvgFilters prefix="chapter" />

      {/* fondo cálido de tomo antiguo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(110% 100% at 50% 30%, ${COLORS.bg0} 0%, ${COLORS.bg1} 48%, ${COLORS.bg2} 82%, #C6B58F 100%)`,
        }}
      />

      {/* capa lejana: gran numeral fantasma detrás (marca de agua) con parallax */}
      <ParallaxLayer depth={0.18} driftX={22} driftY={12}>
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              fontSize: 720,
              fontWeight: 800,
              color: COLORS.ink,
              opacity: 0.05,
              lineHeight: 1,
              transform: "translateY(-20px)",
              userSelect: "none",
            }}
          >
            {roman ? romanStr : index}
          </div>
        </AbsoluteFill>
      </ParallaxLayer>

      {/* rayos cálidos */}
      <GodRays x={50} y={-16} angle={12} color="rgba(169,121,74,0.18)" intensity={1} rays={7} />

      {/* filete horizontal doble (regla superior e inferior del capítulo) */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${idleY + (1 - enter) * 26}px) scale(${breathe})`, opacity: enter, textAlign: "center", width: 1200 }}>
          {/* CAPÍTULO (label pequeño) */}
          <div
            style={{
              letterSpacing: 12,
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              color: accent,
              opacity: capIn,
              transform: `translateY(${(1 - capIn) * -10}px)`,
              marginBottom: 26,
            }}
          >
            Capítulo
          </div>

          {/* NÚMERO con sello, sobre tarjeta redonda */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
            <DepthShadow layers={5} distance={38} radius={140} color="rgba(42,38,32,0.22)">
              <RimLight color="rgba(169,121,74,0.45)" spread={26} x={0.7} y={0.2}>
                <div
                  style={{
                    position: "relative",
                    width: 240,
                    height: 240,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 38% 32%, ${COLORS.bg0}, ${COLORS.bg1} 60%, ${COLORS.bg2})`,
                    border: `2px solid ${accent}`,
                    boxShadow: "inset 0 3px 0 rgba(255,255,255,0.5), inset 0 -18px 34px rgba(120,90,50,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    opacity: numIn,
                    transform: `scale(${interpolate(numIn, [0, 1], [0.6, 1])})`,
                  }}
                >
                  {/* anillo grabado interior */}
                  <svg viewBox="0 0 240 240" width={240} height={240} style={{ position: "absolute", inset: 0 }}>
                    <circle cx={120} cy={120} r={104} fill="none" stroke={COLORS.ink} strokeOpacity={0.18} strokeWidth={2} />
                    {/* muescas tipo brújula/almanaque */}
                    {Array.from({ length: 24 }, (_, i) => {
                      const a = (i / 24) * Math.PI * 2;
                      const r0 = 108, r1 = i % 6 === 0 ? 96 : 102;
                      return (
                        <line
                          key={i}
                          x1={120 + Math.cos(a) * r0}
                          y1={120 + Math.sin(a) * r0}
                          x2={120 + Math.cos(a) * r1}
                          y2={120 + Math.sin(a) * r1}
                          stroke={accent}
                          strokeOpacity={0.5}
                          strokeWidth={i % 6 === 0 ? 2.5 : 1.2}
                        />
                      );
                    })}
                  </svg>

                  {/* NÚMERO: romano dibujado a pluma ó árabe con odómetro */}
                  {roman ? (
                    <svg viewBox="0 0 240 240" width={240} height={240} style={{ position: "absolute", inset: 0 }}>
                      <RomanInk str={romanStr} color={COLORS.text} accent={accent} />
                    </svg>
                  ) : (
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <Odometer value={index} digits={index >= 10 ? 2 : 1} durationInFrames={sec(1)} size={130} color={COLORS.text} />
                    </div>
                  )}

                  <PaperGrain opacity={0.12} scale={0.9} seed={17} blend="multiply" />
                </div>
              </RimLight>
            </DepthShadow>

            {/* sello de lacre al costado del número */}
            <div style={{ marginLeft: -26, marginTop: 120, zIndex: 3 }}>
              <WaxSeal at={sec(0.9)} size={92} color={COLORS.danger} initials="✦" />
            </div>
          </div>

          {/* TÍTULO de sección */}
          <div
            style={{
              fontSize: heading.length > 24 ? 68 : 88,
              lineHeight: 1.04,
              fontWeight: 800,
              color: COLORS.text,
              letterSpacing: -0.5,
              opacity: wordIn,
              transform: `translateY(${(1 - wordIn) * 20}px)`,
              textShadow: "0 2px 0 rgba(255,255,255,0.45), 0 4px 12px rgba(120,90,50,0.22)",
            }}
          >
            {heading}
          </div>

          {/* filete a pluma bajo el título */}
          <svg viewBox="0 0 1200 60" width={1200} height={60} style={{ display: "block", margin: "8px auto 0" }}>
            <InkDraw
              d="M 340 30 C 480 18, 720 18, 860 30 M 300 30 L 340 30 M 860 30 L 900 30"
              at={sec(1.0)}
              duration={sec(0.8)}
              color={accent}
              width={3}
              length={640}
            />
            <g transform="translate(600 30)">
              <path d="M 0 -8 L 10 0 L 0 8 L -10 0 Z" fill={accent} opacity={interpolate(subIn, [0, 1], [0, 0.85])} />
            </g>
          </svg>

          {/* SUBTÍTULO */}
          {subtitle && (
            <div
              style={{
                marginTop: 20,
                fontSize: 36,
                fontWeight: 500,
                fontStyle: "italic",
                color: COLORS.textSoft,
                opacity: subIn,
                transform: `translateY(${(1 - subIn) * 12}px)`,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* polvo dorado suave */}
      <ParallaxLayer depth={0.6} driftX={16} driftY={10}>
        <ParticleField count={20} kind="dust" rise drift={22} color={accent} width={1600} height={900} opacity={0.4} />
      </ParallaxLayer>

      {/* viñeta */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(120% 90% at 50% 44%, rgba(0,0,0,0) 56%, rgba(60,44,24,0.22) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Numeral romano dibujado a pluma, trazo por letra escalonado.
const RomanInk: React.FC<{ str: string; color: string; accent: string }> = ({ str, color, accent }) => {
  const chars = str.split("");
  const glyphW = 46;
  const total = chars.length * glyphW;
  const startX = 120 - total / 2;
  return (
    <g>
      {chars.map((ch, i) => {
        const gx = startX + i * glyphW + glyphW / 2;
        const at = sec(0.35) + i * sec(0.2);
        // trazos simples de cada letra romana (I, V, X)
        const strokes: { d: string; len: number }[] =
          ch === "I"
            ? [{ d: `M ${gx} 84 L ${gx} 156`, len: 72 }]
            : ch === "V"
            ? [
                { d: `M ${gx - 20} 84 L ${gx} 156`, len: 78 },
                { d: `M ${gx + 20} 84 L ${gx} 156`, len: 78 },
              ]
            : // X
              [
                { d: `M ${gx - 20} 84 L ${gx + 20} 156`, len: 80 },
                { d: `M ${gx + 20} 84 L ${gx - 20} 156`, len: 80 },
              ];
        return (
          <g key={i}>
            {strokes.map((s, k) => (
              <InkDraw
                key={k}
                d={s.d}
                at={at + k * sec(0.08)}
                duration={sec(0.4)}
                color={color}
                width={10}
                length={s.len}
                dropShadow
              />
            ))}
            {/* remate serif inferior */}
            <InkDraw d={`M ${gx - 14} 156 L ${gx + 14} 156`} at={at + sec(0.3)} duration={sec(0.2)} color={accent} width={4} length={28} />
          </g>
        );
      })}
    </g>
  );
};

export default ChapterMarkerKit;
