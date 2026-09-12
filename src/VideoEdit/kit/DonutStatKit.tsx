import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  DepthShadow,
  Odometer,
  InkDraw,
  SvgFilters,
  PaperGrain,
  RimLight,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// DonutStatKit — GENÉRICO, PROP-DRIVEN. Anillo/dona que se rellena con un
// porcentaje y una cifra central tipo odómetro. Marca terrosa-vintage (papel
// de almanaque, serif old-style, ámbar/óxido + verde profundo). RENDER-SAFE:
// todo deriva de useCurrentFrame() (spring/interpolate). Azar determinístico.
// El TEMA entra por props: title/subtitle/percent/label/centerText/accent.
//   • huerta:      percent=68 label="germinación"  title="Tasa de germinación"
//   • reparación:  percent=45 label="óxido menos"   title="Superficie tratada"
//   • amish:       percent=90 label="a mano"        title="Hecho sin máquinas"
// ═══════════════════════════════════════════════════════════════════════════

export type DonutStatKitProps = {
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  percent?: number;
  label?: string;
  centerText?: string;
};

// util color helper — mezcla hex con "over" (blanco/negro) sin libs
const shade = (hex: string, amt: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const DonutStatKit: React.FC<DonutStatKitProps> = ({
  durationInFrames,
  title = "El resultado en un dato",
  subtitle = "medido a lo largo de una temporada",
  accent = COLORS.accent,
  percent = 68,
  label = "eficiencia",
  centerText = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pct = Math.max(0, Math.min(100, percent));
  const accentDk = shade(accent, -38);
  const accentLt = shade(accent, 46);

  // ── entrada global
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  // el anillo se "dibuja" con un spring largo (efecto InkDraw sobre el arco)
  const fillS = spring({
    frame: frame - 8,
    fps,
    config: { damping: 60, mass: 1.1, stiffness: 45 },
    durationInFrames: Math.min(durationInFrames - 8, 80),
  });

  // geometría del anillo (viewBox 1600x900), corrido a la izq para dejar
  // libre la esquina inferior derecha (avatar PiP)
  const cx = 640;
  const cy = 460;
  const R = 250; // radio del trazo principal
  const CIRC = 2 * Math.PI * R;
  const drawn = (pct / 100) * fillS; // 0..pct/100
  const startAngle = -90; // arriba

  // idle: leve respiración de la dona
  const breathe = 1 + Math.sin(frame / 46) * 0.008;

  // ticks del borde (marcas tipo cuadrante de almanaque)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = ((i / 60) * 360 - 90) * (Math.PI / 180);
    const major = i % 5 === 0;
    const rin = R + 34;
    const rout = R + (major ? 58 : 46);
    return {
      x1: cx + Math.cos(a) * rin,
      y1: cy + Math.sin(a) * rin,
      x2: cx + Math.cos(a) * rout,
      y2: cy + Math.sin(a) * rout,
      major,
      lit: i / 60 <= drawn,
    };
  });

  // punto/perla en la punta del arco relleno
  const tipA = (startAngle + drawn * 360) * (Math.PI / 180);
  const tipX = cx + Math.cos(tipA) * R;
  const tipY = cy + Math.sin(tipA) * R;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="donut" />

      {/* fondo con profundidad multicapa */}
      <ParallaxLayer depth={0.15} driftY={14}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(60% 55% at 40% 42%, ${COLORS.bg1} 0%, ${COLORS.bg0} 55%, ${COLORS.bg2} 120%)`,
          }}
        />
      </ParallaxLayer>
      <GodRays x={26} y={-14} angle={20} color="rgba(169,121,74,0.16)" rays={7} />
      <ParallaxLayer depth={0.4} driftX={16} driftY={10}>
        <ParticleField count={20} kind="dust" rise drift={26} color={COLORS.amber} opacity={0.5} />
      </ParallaxLayer>

      {/* título superior */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * -18}px)`,
        }}
      >
        <div
          style={{
            letterSpacing: 6,
            fontSize: 22,
            fontWeight: 700,
            textTransform: "uppercase",
            color: COLORS.amber,
          }}
        >
          {subtitle}
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>
          {title}
        </div>
      </div>

      {/* DONA */}
      <AbsoluteFill>
        <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            <radialGradient id="donutFace" cx="42%" cy="38%">
              <stop offset="0%" stopColor={COLORS.bg1} />
              <stop offset="70%" stopColor={COLORS.bg0} />
              <stop offset="100%" stopColor={COLORS.bg2} />
            </radialGradient>
            <linearGradient id="donutArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={accentLt} />
              <stop offset="55%" stopColor={accent} />
              <stop offset="100%" stopColor={accentDk} />
            </linearGradient>
          </defs>

          <g
            transform={`translate(${cx} ${cy}) scale(${enter * breathe}) translate(${-cx} ${-cy})`}
            opacity={enter}
          >
            {/* placa de papel bajo el anillo (sombra 3D vía capas) */}
            {Array.from({ length: 6 }, (_, i) => (
              <circle
                key={"sh" + i}
                cx={cx}
                cy={cy + (i + 1) * 5}
                r={R + 66}
                fill="rgba(42,38,32,0.05)"
              />
            ))}
            <circle cx={cx} cy={cy} r={R + 66} fill="url(#donutFace)" stroke={COLORS.bg2} strokeWidth={2} />

            {/* ticks del cuadrante */}
            {ticks.map((t, i) => (
              <line
                key={"t" + i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.lit ? accent : COLORS.textDim}
                strokeWidth={t.major ? 4 : 2}
                strokeLinecap="round"
                opacity={t.lit ? 0.9 : 0.4}
              />
            ))}

            {/* riel de fondo del anillo (grabado hundido) */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={COLORS.bg2}
              strokeWidth={44}
            />
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="rgba(42,38,32,0.12)"
              strokeWidth={44}
              strokeDasharray="2 14"
            />

            {/* sombra proyectada del arco (profundidad) */}
            <circle
              cx={cx}
              cy={cy + 6}
              r={R}
              fill="none"
              stroke="rgba(42,38,32,0.22)"
              strokeWidth={40}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - drawn)}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: "url(#donut-soft)" }}
            />
            {/* arco relleno principal — se rellena como dibujado a pluma */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="url(#donutArc)"
              strokeWidth={40}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - drawn)}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
            {/* brillo interior del arco */}
            <circle
              cx={cx}
              cy={cy}
              r={R - 12}
              fill="none"
              stroke={accentLt}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * (R - 12)}
              strokeDashoffset={2 * Math.PI * (R - 12) * (1 - drawn)}
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={0.55}
            />

            {/* perla luminosa en la punta */}
            {drawn > 0.004 && (
              <g>
                <circle cx={tipX} cy={tipY} r={30} fill={accent} opacity={0.28} style={{ filter: "url(#donut-soft)" }} />
                <circle cx={tipX} cy={tipY} r={13} fill={accentLt} />
                <circle cx={tipX - 3} cy={tipY - 3} r={4} fill="#fff" opacity={0.85} />
              </g>
            )}

            {/* chispas orbitando la punta (brasas cálidas) */}
            {drawn > 0.02 &&
              Array.from({ length: 6 }, (_, i) => {
                const life = ((frame + rand(i, 2) * 40) % 40) / 40;
                const ang = tipA + (rand(i) - 0.5) * 0.5;
                const rr = 14 + life * 40;
                return (
                  <circle
                    key={"sp" + i}
                    cx={tipX + Math.cos(ang) * rr + wobble(i, frame, 2) * 6}
                    cy={tipY + Math.sin(ang) * rr - life * 22}
                    r={3 + rand(i, 3) * 3}
                    fill={COLORS.amber}
                    opacity={(1 - life) * 0.6}
                  />
                );
              })}
          </g>
        </svg>
      </AbsoluteFill>

      {/* NÚCLEO CENTRAL — cifra odómetro sobre disco de papel elevado */}
      <div
        style={{
          position: "absolute",
          left: `${(cx / 1600) * 100}%`,
          top: `${(cy / 900) * 100}%`,
          transform: `translate(-50%,-50%) scale(${enter})`,
          opacity: enter,
        }}
      >
        <RimLight color={accent} spread={30} x={0.35} y={0.25}>
          <DepthShadow
            layers={6}
            distance={40}
            radius={999}
            color="rgba(42,38,32,0.20)"
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: `radial-gradient(60% 55% at 42% 38%, ${COLORS.bg1}, ${COLORS.bg2})`,
              border: `2px solid ${COLORS.bg2}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", color: accentDk }}>
              <Odometer
                value={pct}
                digits={pct >= 100 ? 3 : pct >= 10 ? 2 : 1}
                durationInFrames={Math.min(durationInFrames - 8, 80)}
                size={128}
                color={accentDk}
              />
              <span style={{ fontSize: 60, fontWeight: 800, marginLeft: 4 }}>%</span>
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: COLORS.textSoft,
              }}
            >
              {centerText || label}
            </div>
          </DepthShadow>
        </RimLight>
      </div>

      {/* subrayado a pluma bajo la etiqueta central (InkDraw), decorativo */}
      <AbsoluteFill>
        <svg viewBox="0 0 1600 900" width="100%" height="100%">
          <InkDraw
            d={`M ${cx - 120} ${cy + 150} C ${cx - 40} ${cy + 162}, ${cx + 40} ${cy + 162}, ${cx + 120} ${cy + 150}`}
            at={26}
            duration={20}
            color={accent}
            width={4}
            length={260}
          />
        </svg>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.9} seed={7} />
    </AbsoluteFill>
  );
};

export default DonutStatKit;
