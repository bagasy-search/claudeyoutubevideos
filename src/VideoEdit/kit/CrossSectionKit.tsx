import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import {
  ParallaxLayer,
  ParticleField,
  GodRays,
  InkDraw,
  SvgFilters,
  PaperGrain,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// CrossSectionKit — GENÉRICO, PROP-DRIVEN. Corte transversal por CAPAS apiladas
// y etiquetadas, con profundidad real (parallax entre estratos + pared 3D +
// borde a pluma + partículas). El TEMA entra por `layers[]` y `figure`:
//   • huerta:      capas de suelo (mantillo, tierra negra, arcilla, roca madre)
//   • reparación:  capas de muro (revoque, ladrillo, aislante, cimiento)
//   • amish:       techo de granero (teja, tabla, viga, aire)
// Se puede incrustar un `figure` (React SVG) hundido en el corte (una olla, una
// raíz, un caño). RENDER-SAFE: todo deriva de useCurrentFrame().
// ═══════════════════════════════════════════════════════════════════════════

export type CrossLayer = { label: string; color?: string; thickness?: number };

export type CrossSectionKitProps = {
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  layers?: CrossLayer[];
  figure?: React.ReactNode;
};

const DEFAULT_LAYERS: CrossLayer[] = [
  { label: "Mantillo / superficie", color: "#6E8B47", thickness: 0.8 },
  { label: "Tierra negra fértil", color: "#5a4326", thickness: 1.4 },
  { label: "Arcilla compacta", color: "#8a5a30", thickness: 1.2 },
  { label: "Roca madre", color: "#6f665c", thickness: 1.0 },
];

// util color helper
const shade = (hex: string, amt: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// borde superior ondulado determinístico para un estrato (línea de tierra)
const wavyTop = (x0: number, x1: number, y: number, amp: number, seed: number): string => {
  const steps = 10;
  let d = `M ${x0} ${y}`;
  for (let i = 1; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const yy = y + Math.sin(i * 1.3 + seed) * amp + (rand(i, seed) - 0.5) * amp;
    d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
};

export const CrossSectionKit: React.FC<CrossSectionKitProps> = ({
  durationInFrames,
  title = "Por dentro, capa por capa",
  subtitle = "corte transversal",
  accent = COLORS.accent,
  layers = DEFAULT_LAYERS,
  figure,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  // geometría del bloque de corte. Lo corremos a la IZQUIERDA para dejar libre
  // la esquina inferior derecha (avatar PiP).
  const BX = 150; // borde izquierdo del bloque
  const BW = 980; // ancho del bloque
  const topY = 250; // arriba del corte
  const botY = 830; // abajo
  const totalH = botY - topY;

  const weights = layers.map((l) => l.thickness ?? 1);
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;

  // altura acumulada por capa
  let acc = topY;
  const bands = layers.map((l, i) => {
    const h = (weights[i] / wsum) * totalH;
    const y0 = acc;
    acc += h;
    return { ...l, y0, y1: acc, h, i, color: l.color ?? DEFAULT_LAYERS[i % DEFAULT_LAYERS.length].color! };
  });

  // cada banda "cae" en su lugar con stagger (spring)
  const bandS = (i: number) =>
    spring({ frame: frame - (6 + i * 6), fps, config: { damping: 20, mass: 1, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="cross" />

      {/* cielo/ambiente arriba con god rays */}
      <ParallaxLayer depth={0.12} driftY={10}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(to bottom, ${COLORS.bg1} 0%, ${COLORS.bg0} 30%, ${COLORS.bg2} 100%)`,
          }}
        />
      </ParallaxLayer>
      <GodRays x={40} y={-18} angle={16} color="rgba(169,121,74,0.18)" rays={7} />

      {/* título */}
      <div
        style={{
          position: "absolute",
          top: 84,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * -16}px)`,
        }}
      >
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: COLORS.amber }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>{title}</div>
      </div>

      <AbsoluteFill>
        <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            {bands.map((b) => (
              <linearGradient key={"grad" + b.i} id={`csLayer${b.i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={shade(b.color, 26)} />
                <stop offset="100%" stopColor={shade(b.color, -30)} />
              </linearGradient>
            ))}
            <linearGradient id="csFace" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
            </linearGradient>
            <clipPath id="csClip">
              <rect x={BX} y={topY} width={BW} height={totalH} rx={8} />
            </clipPath>
          </defs>

          {/* sombra 3D proyectada del bloque */}
          {Array.from({ length: 7 }, (_, i) => (
            <rect
              key={"bsh" + i}
              x={BX + (i + 1) * 4}
              y={topY + (i + 1) * 6}
              width={BW}
              height={totalH}
              rx={8}
              fill="rgba(42,38,32,0.05)"
            />
          ))}

          {/* CARA LATERAL 3D del bloque (extrusión a la derecha) — parallax leve */}
          <g opacity={enter}>
            <path
              d={`M ${BX + BW} ${topY} L ${BX + BW + 60} ${topY - 26} L ${BX + BW + 60} ${botY - 26} L ${BX + BW} ${botY} Z`}
              fill={COLORS.bg2}
              stroke={COLORS.ink}
              strokeWidth={2}
              opacity={0.5}
            />
            {/* tapa superior 3D */}
            <path
              d={`M ${BX} ${topY} L ${BX + 60} ${topY - 26} L ${BX + BW + 60} ${topY - 26} L ${BX + BW} ${topY} Z`}
              fill={shade(bands[0].color, 34)}
              stroke={COLORS.ink}
              strokeWidth={2}
              opacity={0.85}
            />
          </g>

          {/* ESTRATOS (cara frontal) */}
          <g clipPath="url(#csClip)">
            {bands.map((b) => {
              const s = bandS(b.i);
              const yoff = interpolate(s, [0, 1], [-b.h, 0]); // cae desde arriba
              const par = wobble(b.i, frame, 0.6) * (1 + b.i) * 0.8; // parallax por estrato
              return (
                <g key={"band" + b.i} opacity={s} transform={`translate(${par} ${yoff})`}>
                  <rect x={BX - 20} y={b.y0} width={BW + 40} height={b.h + 2} fill={`url(#csLayer${b.i})`} />
                  {/* textura de la capa: motas determinísticas */}
                  {Array.from({ length: 26 }, (_, k) => {
                    const gx = BX + rand(k, b.i) * BW;
                    const gy = b.y0 + rand(k, b.i + 9) * b.h;
                    return (
                      <circle
                        key={"m" + k}
                        cx={gx}
                        cy={gy}
                        r={2 + rand(k, b.i + 3) * 4}
                        fill={shade(b.color, rand(k, b.i) > 0.5 ? 40 : -40)}
                        opacity={0.4}
                      />
                    );
                  })}
                  {/* raicillas en las capas fértiles superiores */}
                  {b.i < 2 &&
                    Array.from({ length: 5 }, (_, k) => {
                      const rx = BX + 80 + k * (BW / 6);
                      return (
                        <path
                          key={"root" + k}
                          d={`M ${rx} ${b.y0} C ${rx + 10} ${b.y0 + b.h * 0.4}, ${rx - 14} ${b.y0 + b.h * 0.6}, ${rx + 6} ${b.y0 + b.h * 0.9}`}
                          fill="none"
                          stroke="#caa46a"
                          strokeWidth={2.5}
                          opacity={0.55}
                        />
                      );
                    })}
                </g>
              );
            })}
            {/* sombreado de cara frontal (luz) */}
            <rect x={BX - 20} y={topY} width={BW + 40} height={totalH} fill="url(#csFace)" />
          </g>

          {/* límites entre capas dibujados a pluma (InkDraw ondulado) */}
          {bands.slice(1).map((b) => (
            <InkDraw
              key={"edge" + b.i}
              d={wavyTop(BX - 20, BX + BW + 20, b.y0, 7, b.i)}
              at={10 + b.i * 6}
              duration={26}
              color={COLORS.ink}
              width={3.5}
              length={BW + 120}
            />
          ))}
          {/* borde superior del suelo (línea de tierra) */}
          <InkDraw
            d={wavyTop(BX - 20, BX + BW + 20, topY, 8, 0)}
            at={6}
            duration={26}
            color={COLORS.ink}
            width={4.5}
            length={BW + 120}
            dropShadow
          />

          {/* marco del bloque */}
          <rect x={BX} y={topY} width={BW} height={totalH} rx={8} fill="none" stroke={COLORS.ink} strokeWidth={4} opacity={enter} />

          {/* figura incrustada (opcional) hundida en el corte */}
          {figure && (
            <g clipPath="url(#csClip)" opacity={enter}>
              {figure}
            </g>
          )}

          {/* partículas de polvo cayendo dentro del corte (profundidad) */}
          <g clipPath="url(#csClip)">
            {Array.from({ length: 14 }, (_, i) => {
              const p = ((frame + rand(i, 2) * 120) % 120) / 120;
              const px = BX + rand(i) * BW;
              const py = topY + p * totalH;
              return <circle key={"d" + i} cx={px + wobble(i, frame) * 8} cy={py} r={2 + rand(i, 4) * 2} fill={COLORS.amber} opacity={(1 - p) * 0.35} />;
            })}
          </g>

          {/* ETIQUETAS a la derecha con líneas guía y cota de espesor */}
          {bands.map((b) => {
            const s = spring({ frame: frame - (20 + b.i * 7), fps, config: { damping: 200, mass: 1, stiffness: 80 } });
            const midY = (b.y0 + b.y1) / 2;
            const lx = BX + BW + 96;
            const tx = interpolate(s, [0, 1], [lx - 40, lx]);
            return (
              <g key={"lab" + b.i} opacity={s}>
                {/* corchete de espesor */}
                <line x1={BX + BW + 70} y1={b.y0 + 4} x2={BX + BW + 70} y2={b.y1 - 4} stroke={accent} strokeWidth={3} strokeLinecap="round" />
                <line x1={BX + BW + 64} y1={b.y0 + 4} x2={BX + BW + 76} y2={b.y0 + 4} stroke={accent} strokeWidth={3} />
                <line x1={BX + BW + 64} y1={b.y1 - 4} x2={BX + BW + 76} y2={b.y1 - 4} stroke={accent} strokeWidth={3} />
                {/* guía al texto */}
                <line x1={BX + BW + 70} y1={midY} x2={tx} y2={midY} stroke={accent} strokeWidth={3} />
                <circle cx={tx} cy={midY} r={7} fill={b.color} stroke={COLORS.ink} strokeWidth={2} />
                <text x={tx + 22} y={midY - 6} fontSize={16} fontWeight={800} fill={accent} fontFamily={FONT_STACK}>
                  {`Capa ${b.i + 1}`}
                </text>
                <text x={tx + 22} y={midY + 24} fontSize={34} fontWeight={800} fill={COLORS.text} fontFamily={FONT_STACK}>
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* niebla/polvo ambiente entre el bloque y el frente */}
      <ParallaxLayer depth={0.5} driftX={18} driftY={8}>
        <ParticleField count={14} kind="dust" rise drift={30} color={COLORS.amber} opacity={0.35} />
      </ParallaxLayer>

      <PaperGrain opacity={0.1} scale={0.9} seed={5} />
    </AbsoluteFill>
  );
};

export default CrossSectionKit;
