import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  InkDraw,
  SvgFilters,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// FlowArrowsKit — FLUJO POR ETAPAS conectadas con flechas de tinta animadas.
// Genérico y prop-driven: sirve para "semilla → brote → cosecha" (huerta),
// "madera → junta → mueble" (reparación) o "grano → molino → harina" (amish).
// Cada nodo es una ficha de pergamino elevada (DepthShadow) que aterriza con
// spring; entre nodos, una flecha de tinta (InkDraw) se traza y una chispa de
// polvo viaja por ella. Profundidad real: parallax multicapa + god rays +
// campo de partículas + borde rugoso de tinta (SvgFilters). Modo "row" (línea
// horizontal, ideal 3–4 pasos) o "col" (columna vertical).
// ═══════════════════════════════════════════════════════════════════════════

type Step = { label: string; icon?: string };

const DEFAULT_STEPS: Step[] = [
  { label: "Preparar", icon: "✦" },
  { label: "Aplicar", icon: "◆" },
  { label: "Resultado", icon: "✿" },
];

// Glifo de tinta dibujado por índice cuando el paso no trae icono — determinístico.
const inkGlyph = (i: number): string => ["✦", "◆", "✿", "❧", "☘", "✚", "❖"][i % 7];

export const FlowArrowsKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  steps?: Step[];
  direction?: "row" | "col";
}> = ({
  durationInFrames,
  title = "Cómo funciona",
  subtitle = "Tres pasos, de principio a fin",
  accent = COLORS.amber,
  steps = DEFAULT_STEPS,
  direction = "row",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const headSlide = interpolate(enter, [0, 1], [26, 0]);

  const VB_W = 1600;
  const VB_H = 900;
  const n = Math.max(1, Math.min(steps.length, 5));
  const isRow = direction === "row";

  // Geometría de nodos a lo largo del recorrido (deja libre esquina inferior-derecha).
  const nodeW = isRow ? 300 : 520;
  const nodeH = isRow ? 210 : 150;
  const centers = Array.from({ length: n }, (_, i) => {
    if (isRow) {
      const span = 1180;
      const x0 = (VB_W - span) / 2 + nodeW / 2;
      const step = n > 1 ? span / (n - 1) : 0;
      return { x: x0 + i * step, y: 470 };
    }
    const span = 560;
    const y0 = 210 + nodeH / 2;
    const step = n > 1 ? span / (n - 1) : 0;
    return { x: 640, y: y0 + i * step };
  });

  // Timing: cada nodo entra escalonado; la flecha hacia él se traza justo antes.
  const nodeAt = (i: number) => sec(0.5) + i * sec(0.8);
  const arrowAt = (i: number) => nodeAt(i) - sec(0.35);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="flow" />
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.35} />

      {/* Luz volumétrica cálida de taller + polvo suspendido (profundidad de fondo) */}
      <ParallaxLayer depth={0.25} driftX={16} driftY={10}>
        <GodRays x={62} y={-12} angle={20} color="rgba(169,121,74,0.16)" rays={8} intensity={0.95} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.5} driftX={26} driftY={16}>
        <ParticleField count={26} kind="dust" rise drift={26} color={accent} opacity={0.5} />
      </ParallaxLayer>

      <SfxCue at={0} src={SFX.whoosh} volume={0.35} />
      {steps.slice(0, n).map((_, i) => (
        <React.Fragment key={"sfx" + i}>
          {i > 0 && <SfxCue at={arrowAt(i)} src={SFX.lineDraw} volume={0.28} />}
          <SfxCue at={nodeAt(i)} src={SFX.nodeLand} volume={0.3} />
        </React.Fragment>
      ))}

      {/* Encabezado */}
      <div
        style={{
          position: "absolute",
          top: isRow ? 96 : 70,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${headSlide}px)`,
        }}
      >
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: accent }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, color: COLORS.text, lineHeight: 1.02, marginTop: 4 }}>
          {title}
        </div>
        <svg width={360} height={22} style={{ display: "block", margin: "6px auto 0" }} viewBox="0 0 360 22">
          <InkDraw
            d="M 14 12 C 90 3, 270 3, 346 11"
            at={sec(0.35)}
            duration={22}
            color={accent}
            width={5}
            length={360}
            dropShadow
          />
        </svg>
      </div>

      {/* Diagrama de flujo */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="92%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <linearGradient id="flowNodeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6EFDC" />
              <stop offset="100%" stopColor={COLORS.bg2} />
            </linearGradient>
            <radialGradient id="flowNodeGlow" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#fff" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* FLECHAS entre nodos consecutivos */}
          {centers.slice(0, -1).map((c, i) => {
            const a = c;
            const b = centers[i + 1];
            // punto de arranque/final en el borde de cada ficha
            const sx = isRow ? a.x + nodeW / 2 + 8 : a.x;
            const sy = isRow ? a.y : a.y + nodeH / 2 + 8;
            const ex = isRow ? b.x - nodeW / 2 - 34 : b.x;
            const ey = isRow ? b.y : b.y - nodeH / 2 - 34;
            // leve comba orgánica de la flecha
            const mx = (sx + ex) / 2 + (isRow ? 0 : 46);
            const my = (sy + ey) / 2 + (isRow ? -34 : 0);
            const d = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;
            const at = arrowAt(i + 1);
            const p = interpolate(frame - at, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // punta de flecha
            const ang = Math.atan2(ey - my, ex - mx);
            const ah = 26;
            const aw = 15;
            const tipX = ex + Math.cos(ang) * 14;
            const tipY = ey + Math.sin(ang) * 14;
            const arrowHead = `M ${tipX} ${tipY} L ${tipX - Math.cos(ang) * ah - Math.sin(ang) * aw} ${tipY - Math.sin(ang) * ah + Math.cos(ang) * aw} L ${tipX - Math.cos(ang) * ah + Math.sin(ang) * aw} ${tipY - Math.sin(ang) * ah - Math.cos(ang) * aw} Z`;
            // chispa de polvo viajando por la flecha (loop sutil una vez trazada)
            const travel = ((frame - at) % 60) / 60;
            const tx = interpolate(travel, [0, 1], [sx, ex]);
            const tyc = interpolate(travel, [0, 1], [sy, ey]) + Math.sin(travel * Math.PI) * (isRow ? -20 : 0);
            return (
              <g key={"arr" + i} style={{ filter: "url(#flow-rough)" }}>
                {/* sombra de tinta */}
                <path d={d} fill="none" stroke="rgba(42,38,32,0.22)" strokeWidth={9} strokeLinecap="round" transform="translate(2 4)" opacity={p} />
                <InkDraw d={d} at={at} duration={26} color={accent} width={7} length={620} />
                <g opacity={interpolate(frame - at, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                  <path d={arrowHead} fill={accent} style={{ filter: "drop-shadow(0 2px 3px rgba(42,38,32,0.3))" }} />
                </g>
                {p > 0.98 && (
                  <circle cx={tx} cy={tyc} r={6} fill={accent} opacity={0.5 + 0.4 * Math.sin(travel * Math.PI)} />
                )}
              </g>
            );
          })}

          {/* NODOS */}
          {centers.map((c, i) => {
            const step = steps[i] ?? DEFAULT_STEPS[i % DEFAULT_STEPS.length];
            const at = nodeAt(i);
            const s = spring({ frame: frame - at, fps, config: { damping: 15, mass: 0.8, stiffness: 130 } });
            const drop = interpolate(s, [0, 1], [-38, 0]);
            const idle = wobble(i, frame, 0.7) * 3;
            const x = c.x - nodeW / 2;
            const y = c.y - nodeH / 2 + drop + idle;
            const glyph = step.icon ?? inkGlyph(i);
            return (
              <g key={"node" + i} opacity={interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" })} transform={`translate(${x} ${y})`}>
                {/* sombra 3D proyectada bajo la ficha */}
                <ellipse cx={nodeW / 2} cy={nodeH + 26} rx={nodeW * 0.42} ry={22} fill="rgba(42,38,32,0.22)" opacity={s} />
                {/* ficha de pergamino */}
                <g style={{ filter: "drop-shadow(0 18px 26px rgba(42,38,32,0.28))" }}>
                  <rect width={nodeW} height={nodeH} rx={22} fill="url(#flowNodeFill)" stroke="rgba(42,38,32,0.20)" strokeWidth={2} />
                  <rect x={7} y={7} width={nodeW - 14} height={nodeH - 14} rx={17} fill="none" stroke={accent} strokeWidth={2} strokeDasharray="2 8" opacity={0.55} />
                  <rect width={nodeW} height={nodeH * 0.5} rx={22} fill="url(#flowNodeGlow)" />
                </g>
                {/* medallón del glifo/icono */}
                <g transform={`translate(${nodeW / 2} ${isRow ? 66 : nodeH / 2})`}>
                  <circle r={38} fill={accent} opacity={0.16} />
                  <circle r={38} fill="none" stroke={accent} strokeWidth={3} opacity={0.7} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize={40} fill={accent} fontFamily={FONT_STACK} style={{ fontWeight: 900 }}>
                    {glyph}
                  </text>
                </g>
                {/* número de orden en sello */}
                <g transform={`translate(${nodeW - 30} 28)`}>
                  <circle r={22} fill={COLORS.text} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize={26} fontWeight={900} fill={COLORS.bg0} fontFamily={FONT_STACK}>
                    {i + 1}
                  </text>
                </g>
                {/* etiqueta */}
                <text
                  x={nodeW / 2}
                  y={isRow ? nodeH - 34 : nodeH / 2 + 6}
                  textAnchor="middle"
                  dominantBaseline={isRow ? "auto" : "central"}
                  fontSize={isRow ? 40 : 42}
                  fontWeight={800}
                  fill={COLORS.text}
                  fontFamily={FONT_STACK}
                >
                  {step.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Grano de papel al frente (une todo como una lámina impresa) */}
      <PaperGrain opacity={0.1} scale={0.85} seed={5} />
    </AbsoluteFill>
  );
};

export default FlowArrowsKit;
