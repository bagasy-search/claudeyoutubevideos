import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";
import { COLORS, FONT_STACK, sec, glass } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  DepthShadow,
  InkDraw,
  Frame3D,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// EquationKit — ecuación VISUAL de almanaque: A  (+)  B  (=)  RESULTADO.
// Cada término es una "ficha" de pergamino con un ícono/imagen y su rótulo.
// Los términos entran con un POP escalonado (spring), los signos + y = se
// DIBUJAN a pluma (InkDraw) entre ficha y ficha, y el resultado se estampa con
// un aro de tinta y un halo cálido. Sirve para los 3 nichos por PROPS:
//   huerta:      "Semilla + Agua = Brote"
//   reparación:  "Óxido + Vinagre = Metal limpio"
//   amish:       "Leña + Fuego = Calor"
// TODO determinístico (useCurrentFrame). Esquina inf-der libre para el avatar.
// ═══════════════════════════════════════════════════════════════════════════

type Term = { label: string; image?: string; glyph?: string };

const DEFAULT_TERMS: Term[] = [
  { label: "Semilla", glyph: "seed" },
  { label: "Agua", glyph: "drop" },
];
const DEFAULT_RESULT: Term = { label: "Brote", glyph: "sprout" };

// ── Glifos de tinta dibujados a mano (fallback cuando no hay image) ──────────
const Glyph: React.FC<{ kind?: string; color: string; size: number; frame: number; idx: number }> = ({
  kind,
  color,
  size,
  frame,
  idx,
}) => {
  const s = size;
  const breath = 1 + Math.sin(frame / 26 + idx) * 0.03;
  const common = {
    stroke: color,
    strokeWidth: s * 0.05,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 100 100" width={s} height={s} style={{ transform: `scale(${breath})`, transformOrigin: "center" }}>
      {kind === "drop" && (
        <>
          <path d="M50 14 C 68 44, 78 58, 78 68 A 28 28 0 1 1 22 68 C 22 58, 32 44, 50 14 Z" {...common} fill={color} fillOpacity={0.14} />
          <path d="M38 62 A 14 14 0 0 0 44 80" {...common} strokeWidth={s * 0.035} />
        </>
      )}
      {kind === "seed" && (
        <>
          <ellipse cx={50} cy={54} rx={22} ry={32} {...common} fill={color} fillOpacity={0.14} transform="rotate(-18 50 54)" />
          <path d="M50 30 C 44 46, 44 62, 50 78" {...common} strokeWidth={s * 0.03} />
        </>
      )}
      {kind === "sprout" && (
        <>
          <path d="M50 84 L50 44" {...common} />
          <path d="M50 52 C 34 48, 24 34, 30 22 C 44 24, 52 38, 50 52 Z" {...common} fill={color} fillOpacity={0.16} />
          <path d="M50 60 C 66 56, 76 42, 70 30 C 56 32, 48 46, 50 60 Z" {...common} fill={color} fillOpacity={0.12} />
          <path d="M38 84 Q50 78 62 84" {...common} strokeWidth={s * 0.035} />
        </>
      )}
      {kind === "flame" && (
        <>
          <path d="M50 14 C 66 40, 74 52, 66 70 A 22 22 0 1 1 34 70 C 30 60, 36 52, 44 52 C 40 40, 46 26, 50 14 Z" {...common} fill={color} fillOpacity={0.18} />
        </>
      )}
      {kind === "gear" && (
        <>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <rect
                key={i}
                x={46}
                y={8}
                width={8}
                height={16}
                rx={2}
                fill={color}
                fillOpacity={0.5}
                transform={`rotate(${(a * 180) / Math.PI} 50 50)`}
              />
            );
          })}
          <circle cx={50} cy={50} r={26} {...common} fill={color} fillOpacity={0.12} />
          <circle cx={50} cy={50} r={10} {...common} />
        </>
      )}
      {(kind === undefined || kind === "generic") && (
        <>
          <circle cx={50} cy={50} r={30} {...common} fill={color} fillOpacity={0.12} />
          <path d="M38 50 L46 60 L64 40" {...common} strokeWidth={s * 0.06} />
        </>
      )}
    </svg>
  );
};

export const EquationKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  terms?: Term[];
  result?: Term;
}> = ({
  durationInFrames,
  title = "La fórmula simple",
  subtitle,
  accent = COLORS.amber,
  terms = DEFAULT_TERMS,
  result = DEFAULT_RESULT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const outFade = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Secuencia de aparición: cada término y luego el resultado. Ritmo ÁGIL para
  // que la ecuación COMPLETA (incl. resultado) ya esté visible ~1.3s (los stills
  // del preview caen a mitad del clip y antes mostraban solo 2 fichas sueltas).
  const termCount = Math.max(1, terms.length);
  const stepGap = 0.32; // s entre fichas
  const resultAt = 0.35 + termCount * stepGap + 0.25;

  const TILE = 300;

  const Tile: React.FC<{ t: Term; at: number; idx: number; big?: boolean; col: string }> = ({
    t,
    at,
    idx,
    big = false,
    col,
  }) => {
    const s = spring({ frame: frame - sec(at), fps, config: { damping: 12, mass: 0.8, stiffness: 160 } });
    const pop = interpolate(s, [0, 0.7, 1], [0.6, 1.06, 1]);
    const size = big ? TILE * 1.14 : TILE;
    const floaty = wobble(idx, frame, 0.8) * (big ? 5 : 3);
    return (
      <div style={{ opacity: s, transform: `translateY(${(1 - s) * 26 + floaty}px) scale(${pop})`, transformOrigin: "center bottom" }}>
        <DepthShadow
          layers={6}
          distance={big ? 46 : 34}
          radius={26}
          color="rgba(42,38,32,0.20)"
          style={{ ...glass("light"), width: size, height: size * 1.18, borderRadius: 26, position: "relative", overflow: "hidden" }}
        >
          {/* borde interior de tinta */}
          <div
            style={{
              position: "absolute",
              inset: 12,
              borderRadius: 18,
              border: `2px solid ${col}`,
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: 20,
            }}
          >
            <div
              style={{
                width: size * 0.6,
                height: size * 0.6,
                borderRadius: "50%",
                background: `radial-gradient(circle at 40% 35%, ${COLORS.bg0}, ${COLORS.bg2})`,
                boxShadow: `inset 0 4px 14px rgba(42,38,32,0.18), 0 6px 16px rgba(42,38,32,0.10)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {t.image ? (
                <Img src={t.image} style={{ width: "112%", height: "112%", objectFit: "cover" }} />
              ) : (
                <Glyph kind={t.glyph} color={col} size={size * 0.42} frame={frame} idx={idx} />
              )}
            </div>
            <div
              style={{
                fontFamily: FONT_STACK,
                fontWeight: 800,
                fontSize: big ? 40 : 34,
                color: COLORS.text,
                textAlign: "center",
                lineHeight: 1.05,
                letterSpacing: 0.3,
              }}
            >
              {t.label}
            </div>
          </div>
          {/* brillo superior cálido */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "34%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
              pointerEvents: "none",
            }}
          />
        </DepthShadow>
      </div>
    );
  };

  // Signo dibujado a pluma entre fichas (+ o =).
  const Sign: React.FC<{ kind: "plus" | "eq"; at: number; col: string }> = ({ kind, at, col }) => {
    const startF = sec(at);
    const w = 90;
    const cxx = 45;
    const d =
      kind === "plus"
        ? `M ${cxx - 26} 45 L ${cxx + 26} 45 M ${cxx} 19 L ${cxx} 71`
        : `M ${cxx - 28} 34 L ${cxx + 28} 34 M ${cxx - 28} 56 L ${cxx + 28} 56`;
    const s = spring({ frame: frame - startF, fps, config: { damping: 14, mass: 0.7, stiffness: 150 } });
    return (
      <div style={{ width: w, height: 90, opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }), transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})` }}>
        <svg viewBox="0 0 90 90" width={w} height={90}>
          <InkDraw d={d} at={startF} duration={14} color={col} width={11} length={220} dropShadow />
        </svg>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, opacity: outFade }}>
      <SvgFilters prefix="eq" />
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.35} />
      <ParallaxLayer depth={0.25} driftY={14}>
        <GodRays x={62} y={-12} angle={20} intensity={0.9} rays={7} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.9} driftY={26}>
        <ParticleField count={20} kind="dust" rise drift={26} opacity={0.5} />
      </ParallaxLayer>

      <SfxCue at={sec(0.35)} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(0.35 + stepGap)} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(resultAt)} src={SFX.boom1} volume={0.45} />
      <SfxCue at={sec(resultAt)} src={SFX.winnerChime} volume={0.3} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        {/* Título */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 44,
            opacity: enter,
            transform: `translateY(${(1 - enter) * -18}px)`,
            fontFamily: FONT_STACK,
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 800, color: COLORS.text, letterSpacing: 0.4 }}>{title}</div>
          <svg viewBox="0 0 520 26" width={520} height={26} style={{ display: "block", margin: "6px auto 0" }}>
            <InkDraw d="M 20 15 C 160 4, 360 4, 500 15" at={sec(0.3)} duration={26} color={accent} width={6} length={520} />
          </svg>
          {subtitle && <div style={{ fontSize: 27, fontWeight: 600, color: COLORS.textSoft, marginTop: 12, letterSpacing: 3, textTransform: "uppercase" }}>{subtitle}</div>}
        </div>

        {/* Ecuación */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, flexWrap: "nowrap" }}>
          <Frame3D at={2} rotateY={10} rotateX={3} depth={40} perspective={1500} style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {terms.map((t, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Sign kind="plus" at={0.35 + i * stepGap - 0.14} col={accent} />}
                <Tile t={t} at={0.35 + i * stepGap} idx={i} col={i % 2 === 0 ? COLORS.accent : COLORS.amber} />
              </React.Fragment>
            ))}
            <Sign kind="eq" at={resultAt - 0.25} col={COLORS.text} />
            {/* halo del resultado */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -30,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${accent}55, ${accent}00 70%)`,
                  opacity: interpolate(frame - sec(resultAt), [0, 20], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  filter: "blur(6px)",
                }}
              />
              <Tile t={result} at={resultAt} idx={99} big col={COLORS.good} />
              {/* aro de tinta que rodea al resultado */}
              <svg viewBox="0 0 380 440" width={TILE * 1.14} height={TILE * 1.14 * 1.18} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <InkDraw
                  d="M 40 60 C 12 130, 12 320, 60 400 C 180 452, 320 430, 356 360 C 384 250, 372 90, 320 44 C 210 4, 90 12, 40 60"
                  at={sec(resultAt + 0.25)}
                  duration={30}
                  color={COLORS.good}
                  width={7}
                  length={1300}
                />
              </svg>
            </div>
          </Frame3D>
        </div>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.9} seed={5} />
    </AbsoluteFill>
  );
};

export default EquationKit;
