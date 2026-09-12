import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
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
  Odometer,
  InkDraw,
  WaxSeal,
  Frame3D,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// CostTallyKit — libreta de cuentas de almanaque: se anotan renglones de costo
// uno a uno (label ......... $monto) y, tras una LÍNEA DE SUMA dibujada a pluma,
// el TOTAL rueda en un odómetro grande. Cada renglón entra escalonado, con su
// monto rodando, y un puntillado guía el ojo del label al precio.
// PROP-DRIVEN — sirve a los 3 nichos:
//   huerta:      "Semillas $300 · Tierra $500 · Maceta $200 → Total"
//   reparación:  "Masilla $450 · Lija $150 · Barniz $900 → Total"
//   amish:       "Harina $200 · Levadura $80 · Sal $30 → Total"
// Determinístico. Esquina inf-der libre para el avatar PiP.
// ═══════════════════════════════════════════════════════════════════════════

type Line = { label: string; amount: number };

const DEFAULT_LINES: Line[] = [
  { label: "Semillas criollas", amount: 300 },
  { label: "Tierra y compost", amount: 500 },
  { label: "Maceta de barro", amount: 200 },
];

export const CostTallyKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  lines?: Line[];
  currency?: string;
  totalLabel?: string;
}> = ({
  durationInFrames,
  title = "La cuenta final",
  subtitle,
  accent = COLORS.amber,
  lines = DEFAULT_LINES,
  currency = "$",
  totalLabel = "Total",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const outFade = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows = lines.slice(0, 6);
  const total = rows.reduce((a, l) => a + l.amount, 0);
  const totalDigits = Math.max(1, String(Math.floor(total)).length);

  const rowStart = 0.7;
  const rowGap = 0.42;
  const sumAt = rowStart + rows.length * rowGap + 0.25; // línea de suma
  const totalAt = sumAt + 0.35; // odómetro del total

  const Row: React.FC<{ line: Line; i: number }> = ({ line, i }) => {
    const at = rowStart + i * rowGap;
    const s = spring({ frame: frame - sec(at), fps, config: { damping: 16, mass: 0.8, stiffness: 150 } });
    const drift = wobble(i, frame, 0.6) * 1.4;
    const amountDigits = Math.max(1, String(Math.floor(line.amount)).length);
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          opacity: s,
          transform: `translateY(${(1 - s) * 18 + drift}px)`,
          padding: "12px 0",
          gap: 14,
        }}
      >
        {/* nº de renglón */}
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: 26,
            fontWeight: 700,
            color: COLORS.textDim,
            width: 40,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {i + 1}.
        </div>
        {/* label */}
        <div style={{ fontFamily: FONT_STACK, fontSize: 40, fontWeight: 600, color: COLORS.text, flexShrink: 0 }}>{line.label}</div>
        {/* puntillado guía */}
        <div
          style={{
            flex: 1,
            marginBottom: 10,
            borderBottom: `3px dotted ${COLORS.textDim}`,
            opacity: interpolate(s, [0.3, 1], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
        {/* monto rodando */}
        <div style={{ display: "flex", alignItems: "baseline", flexShrink: 0, color: COLORS.text }}>
          <span style={{ fontFamily: FONT_STACK, fontSize: 34, fontWeight: 800, marginRight: 2 }}>{currency}</span>
          <Odometer value={line.amount} digits={amountDigits} durationInFrames={sec(0.8)} size={42} color={COLORS.text} />
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, opacity: outFade }}>
      <SvgFilters prefix="cost" />
      <TechBackground glowX={54} glowY={32} hue="amber" drift={0.3} />
      <ParallaxLayer depth={0.28} driftY={12}>
        <GodRays x={64} y={-14} angle={20} intensity={0.85} rays={6} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.85} driftY={22}>
        <ParticleField count={16} kind="dust" rise drift={22} opacity={0.4} />
      </ParallaxLayer>

      <SfxCue at={sec(0.4)} src={SFX.whoosh} volume={0.35} />
      {rows.map((_, i) => (
        <SfxCue key={i} at={sec(rowStart + i * rowGap)} src={SFX.click} volume={0.35} />
      ))}
      <SfxCue at={sec(sumAt)} src={SFX.lineDraw} volume={0.4} />
      <SfxCue at={sec(totalAt)} src={SFX.boom1} volume={0.45} />
      <SfxCue at={sec(totalAt + 0.05)} src={SFX.winnerChime} volume={0.28} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <Frame3D at={0.2} rotateY={8} rotateX={4} depth={44} perspective={1600} style={{ width: "100%", maxWidth: 1080 }}>
          <DepthShadow
            layers={7}
            distance={54}
            radius={30}
            color="rgba(42,38,32,0.22)"
            style={{ ...glass("light"), borderRadius: 30, position: "relative", overflow: "hidden" }}
          >
            <PaperGrain opacity={0.14} scale={1.1} seed={11} />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "36%",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))",
                pointerEvents: "none",
              }}
            />

            <div style={{ padding: "46px 72px 52px" }}>
              {/* encabezado */}
              <div style={{ marginBottom: 6, opacity: enter, transform: `translateY(${(1 - enter) * -14}px)` }}>
                {subtitle && <div style={{ fontFamily: FONT_STACK, fontSize: 26, fontWeight: 600, color: COLORS.textSoft, letterSpacing: 3, textTransform: "uppercase" }}>{subtitle}</div>}
                <div style={{ fontFamily: FONT_STACK, fontSize: 62, fontWeight: 800, color: COLORS.text, letterSpacing: 0.4 }}>{title}</div>
                <svg viewBox="0 0 560 26" width={560} height={26} style={{ display: "block", marginTop: 2 }}>
                  <InkDraw d="M 8 16 C 180 5, 400 5, 552 15" at={sec(0.4)} duration={26} color={accent} width={6} length={580} />
                </svg>
              </div>

              {/* renglones */}
              <div style={{ marginTop: 20 }}>
                {rows.map((line, i) => (
                  <Row key={i} line={line} i={i} />
                ))}
              </div>

              {/* línea de suma dibujada a pluma (doble raya contable) */}
              <svg viewBox="0 0 940 30" width="100%" height={30} style={{ display: "block", marginTop: 6 }}>
                <InkDraw d="M 6 8 L 934 8" at={sec(sumAt)} duration={18} color={COLORS.text} width={5} length={940} />
                <InkDraw d="M 6 20 L 934 20" at={sec(sumAt + 0.12)} duration={18} color={COLORS.text} width={3} length={940} />
              </svg>

              {/* TOTAL */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  opacity: interpolate(frame - sec(totalAt - 0.2), [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                <div style={{ fontFamily: FONT_STACK, fontSize: 56, fontWeight: 800, color: COLORS.text, letterSpacing: 0.5 }}>{totalLabel}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    background: `linear-gradient(180deg, ${accent}, ${COLORS.amber})`,
                    borderRadius: 18,
                    padding: "8px 28px",
                    boxShadow: `0 12px 30px ${accent}55, inset 0 2px 0 rgba(255,255,255,0.4)`,
                    color: "#fff",
                  }}
                >
                  <span style={{ fontFamily: FONT_STACK, fontSize: 52, fontWeight: 900, marginRight: 4, textShadow: "0 2px 4px rgba(42,38,32,0.4)" }}>{currency}</span>
                  <Odometer value={total} digits={totalDigits} durationInFrames={sec(1.1)} size={72} color="#fff" />
                </div>
              </div>
            </div>

            {/* sello "pagado/final" — esquina superior derecha, lejos del avatar */}
            <div style={{ position: "absolute", top: 28, right: 40, transform: "rotate(-8deg)" }}>
              <WaxSeal at={sec(totalAt + 0.35)} size={116} color={COLORS.danger} initials="$" />
            </div>
          </DepthShadow>
        </Frame3D>
      </AbsoluteFill>

      <PaperGrain opacity={0.08} scale={0.8} seed={4} />
    </AbsoluteFill>
  );
};

export default CostTallyKit;
