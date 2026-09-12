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
  WaxSeal,
  SvgFilters,
  PaperGrain,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PartsDiagramKit — GENÉRICO, PROP-DRIVEN. Lámina botánica/técnica de almanaque:
// una FIGURA central grabada a pluma + ETIQUETAS con líneas guía que salen en
// stagger. La misma pieza sirve para 3 nichos según `figure` y `labels`:
//   • huerta:      figure="plant"  → "anatomía de la planta"
//   • reparación:  figure="joint"  → "las partes de una junta / cañería"
//   • amish:       figure="gear"   → "un mecanismo antiguo"
//   • genérico:    figure="generic"
// RENDER-SAFE: todo deriva de useCurrentFrame(). Azar determinístico por índice.
// Coordenadas de labels en el sistema del viewBox 1600x900.
// ═══════════════════════════════════════════════════════════════════════════

export type PartLabel = { text: string; x: number; y: number };

export type PartsDiagramKitProps = {
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  figure?: "plant" | "joint" | "gear" | "generic";
  labels?: PartLabel[];
};

// centro de la figura (dejamos la mitad derecha-baja algo más libre p/ avatar)
const FX = 620;
const FY = 500;

const DEFAULT_LABELS: PartLabel[] = [
  { text: "Parte superior", x: FX + 20, y: FY - 260 },
  { text: "Núcleo / centro", x: FX - 360, y: FY - 30 },
  { text: "Unión intermedia", x: FX + 340, y: FY + 40 },
  { text: "Base de anclaje", x: FX - 40, y: FY + 300 },
];

export const PartsDiagramKit: React.FC<PartsDiagramKitProps> = ({
  durationInFrames,
  title = "Las partes, una por una",
  subtitle = "diagrama anotado",
  accent = COLORS.accent,
  figure = "generic",
  labels = DEFAULT_LABELS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const figS = spring({ frame: frame - 4, fps, config: { damping: 22, mass: 1, stiffness: 90 } });
  const breathe = Math.sin(frame / 52) * 4; // deriva idle vertical

  const INK = COLORS.ink;

  // ── NORMALIZAR coordenadas de las etiquetas ────────────────────────────────
  // Algunas llamadas pasan x/y como PORCENTAJE (0..100) y otras como PÍXELES del
  // viewBox (0..1600 / 0..900). Si TODAS las coords son ≤100 las tratamos como %.
  const asPercent =
    labels.length > 0 && labels.every((l) => l.x <= 100 && l.y <= 100);
  const normLabels: PartLabel[] = labels.map((l) => ({
    text: l.text,
    x: asPercent ? (l.x / 100) * 1600 : l.x,
    y: asPercent ? (l.y / 100) * 900 : l.y,
  }));

  // ── FIGURA central (paths grabados a pluma con InkDraw) ────────────────────
  const Figure: React.FC = () => {
    if (figure === "plant") {
      const stem = `M ${FX} ${FY + 230} C ${FX - 8} ${FY + 120}, ${FX + 6} ${FY - 10}, ${FX} ${FY - 150}`;
      return (
        <g>
          {/* raíces */}
          {[-1, 1].map((s) =>
            [0, 1, 2].map((k) => (
              <InkDraw
                key={`r${s}${k}`}
                d={`M ${FX} ${FY + 230} C ${FX + s * (30 + k * 20)} ${FY + 260 + k * 20}, ${FX + s * (60 + k * 30)} ${FY + 300 + k * 30}, ${FX + s * (50 + k * 40)} ${FY + 360 + k * 30}`}
                at={2 + k * 3}
                duration={22}
                color="#8a6a3e"
                width={4}
                length={200}
              />
            )),
          )}
          {/* tallo */}
          <InkDraw d={stem} at={2} duration={26} color={INK} width={7} length={420} dropShadow />
          {/* hojas */}
          {[
            { y: FY + 60, s: -1 },
            { y: FY - 20, s: 1 },
            { y: FY - 100, s: -1 },
          ].map((h, i) => (
            <InkDraw
              key={"lf" + i}
              d={`M ${FX} ${h.y} C ${FX + h.s * 90} ${h.y - 50}, ${FX + h.s * 130} ${h.y - 20}, ${FX + h.s * 90} ${h.y + 30} C ${FX + h.s * 50} ${h.y + 40}, ${FX + h.s * 20} ${h.y + 20}, ${FX} ${h.y}`}
              at={10 + i * 4}
              duration={24}
              color={accent}
              fill={accent}
              width={3}
              length={360}
            />
          ))}
          {/* flor / capullo */}
          <InkDraw
            d={`M ${FX} ${FY - 150} m -46 0 a 46 46 0 1 0 92 0 a 46 46 0 1 0 -92 0`}
            at={22}
            duration={20}
            color={COLORS.amber}
            fill={COLORS.amber}
            width={4}
            length={300}
          />
          <circle cx={FX} cy={FY - 150} r={18} fill={COLORS.bg0} stroke={INK} strokeWidth={3} opacity={figS} />
        </g>
      );
    }
    if (figure === "joint") {
      return (
        <g>
          {/* dos caños que se unen con codo */}
          <InkDraw d={`M ${FX - 300} ${FY + 30} L ${FX - 40} ${FY + 30}`} at={2} duration={20} color={INK} width={40} length={280} />
          <InkDraw d={`M ${FX} ${FY - 10} L ${FX} ${FY - 250}`} at={8} duration={20} color={INK} width={40} length={260} />
          {/* codo */}
          <InkDraw
            d={`M ${FX - 40} ${FY + 30} Q ${FX} ${FY + 30}, ${FX} ${FY - 10}`}
            at={14}
            duration={16}
            color={COLORS.amber}
            width={44}
            length={120}
          />
          {/* tuerca de unión (hexágono) */}
          {[[FX - 40, FY + 30], [FX, FY - 10]].map(([hx, hy], i) => (
            <InkDraw
              key={"nut" + i}
              d={Array.from({ length: 6 }, (_, k) => {
                const a = (k / 6) * Math.PI * 2 - Math.PI / 2;
                return `${k === 0 ? "M" : "L"} ${(hx as number) + Math.cos(a) * 46} ${(hy as number) + Math.sin(a) * 46}`;
              }).join(" ") + " Z"}
              at={18 + i * 3}
              duration={16}
              color={accent}
              width={5}
              length={280}
            />
          ))}
          {/* rosca / hilos */}
          {[0, 1, 2, 3].map((k) => (
            <line
              key={"th" + k}
              x1={FX - 8}
              y1={FY - 40 - k * 22}
              x2={FX + 8}
              y2={FY - 40 - k * 22}
              stroke={COLORS.textSoft}
              strokeWidth={3}
              opacity={figS}
            />
          ))}
        </g>
      );
    }
    if (figure === "gear") {
      const teeth = 12;
      const rr = 150;
      const spin = (frame / 8) % 360; // giro idle lento
      return (
        <g transform={`rotate(${spin} ${FX} ${FY})`}>
          {/* dientes */}
          {Array.from({ length: teeth }, (_, i) => {
            const a = (i / teeth) * Math.PI * 2;
            const x = FX + Math.cos(a) * (rr + 34);
            const y = FY + Math.sin(a) * (rr + 34);
            return (
              <rect
                key={"g" + i}
                x={x - 20}
                y={y - 16}
                width={40}
                height={32}
                rx={6}
                fill={COLORS.amber}
                stroke={INK}
                strokeWidth={3}
                transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
                opacity={figS}
              />
            );
          })}
          <InkDraw
            d={`M ${FX} ${FY} m -${rr} 0 a ${rr} ${rr} 0 1 0 ${rr * 2} 0 a ${rr} ${rr} 0 1 0 -${rr * 2} 0`}
            at={2}
            duration={30}
            color={INK}
            fill={COLORS.bg1}
            width={7}
            length={950}
            dropShadow
          />
          <InkDraw
            d={`M ${FX} ${FY} m -54 0 a 54 54 0 1 0 108 0 a 54 54 0 1 0 -108 0`}
            at={14}
            duration={20}
            color={accent}
            width={6}
            length={340}
          />
          {/* radios */}
          {[0, 1, 2, 3].map((k) => {
            const a = (k / 4) * Math.PI * 2;
            return (
              <line
                key={"sp" + k}
                x1={FX + Math.cos(a) * 54}
                y1={FY + Math.sin(a) * 54}
                x2={FX + Math.cos(a) * (rr - 8)}
                y2={FY + Math.sin(a) * (rr - 8)}
                stroke={INK}
                strokeWidth={6}
                opacity={figS}
              />
            );
          })}
        </g>
      );
    }
    // generic — cristal/objeto facetado grabado
    return (
      <g>
        <InkDraw
          d={`M ${FX} ${FY - 220} L ${FX + 170} ${FY - 60} L ${FX + 110} ${FY + 200} L ${FX - 110} ${FY + 200} L ${FX - 170} ${FY - 60} Z`}
          at={2}
          duration={30}
          color={INK}
          fill={COLORS.bg1}
          width={7}
          length={1100}
          dropShadow
        />
        <InkDraw d={`M ${FX} ${FY - 220} L ${FX} ${FY + 200}`} at={16} duration={18} color={accent} width={4} length={420} />
        <InkDraw d={`M ${FX - 170} ${FY - 60} L ${FX + 170} ${FY - 60}`} at={20} duration={18} color={accent} width={4} length={340} />
        <InkDraw d={`M ${FX + 170} ${FY - 60} L ${FX - 110} ${FY + 200}`} at={24} duration={16} color={COLORS.amber} width={3} length={420} />
        <InkDraw d={`M ${FX - 170} ${FY - 60} L ${FX + 110} ${FY + 200}`} at={26} duration={16} color={COLORS.amber} width={3} length={420} />
      </g>
    );
  };

  // ── etiqueta con línea guía (stagger) ──────────────────────────────────────
  const Label: React.FC<{ lb: PartLabel; i: number }> = ({ lb, i }) => {
    const at = 26 + i * 8;
    const s = spring({ frame: frame - at, fps, config: { damping: 200, mass: 1, stiffness: 80 } });
    const left = lb.x < FX;
    const anchor: "start" | "end" = left ? "end" : "start";

    // ── CLAMP: la chapa de texto debe entrar COMPLETA en el frame (margen 40px).
    const MARGIN = 40;
    const plateW = lb.text.length * 15 + 24;
    // ancho real ocupado a cada lado del ancla según el anchor
    const leftExtent = anchor === "end" ? plateW : 0;
    const rightExtent = anchor === "end" ? 0 : plateW;
    const lx = Math.min(
      1600 - MARGIN - rightExtent,
      Math.max(MARGIN + leftExtent, lb.x),
    );
    const ly = Math.min(900 - MARGIN - 30, Math.max(MARGIN + 30, lb.y));

    // punto sobre la figura al que apunta (radial hacia el centro), desde la POS clampeada
    const dx = lx - FX;
    const dy = ly - FY;
    const d = Math.max(1, Math.hypot(dx, dy));
    const targetX = FX + (dx / d) * 150;
    const targetY = FY + (dy / d) * 150;
    // codo de la línea guía
    const kneeX = lx + (left ? 26 : -26);
    const curX = interpolate(s, [0, 1], [kneeX, targetX]);
    const curY = interpolate(s, [0, 1], [ly, targetY]);
    return (
      <g>
        <line x1={kneeX} y1={ly} x2={curX} y2={curY} stroke={accent} strokeWidth={3} opacity={s} strokeLinecap="round" />
        <circle cx={curX} cy={curY} r={6} fill={accent} opacity={s} />
        <g opacity={s} transform={`translate(${lx} ${ly + (1 - s) * 10})`}>
          {/* chapa de papel bajo el texto */}
          <rect
            x={anchor === "end" ? -lb.text.length * 15 - 20 : 4}
            y={-30}
            width={lb.text.length * 15 + 20}
            height={46}
            rx={10}
            fill={COLORS.bg0}
            stroke={COLORS.bg2}
            strokeWidth={2}
            opacity={0.9}
          />
          <text
            x={anchor === "end" ? -8 : 14}
            y={2}
            textAnchor={anchor}
            fontSize={34}
            fontWeight={800}
            fill={COLORS.text}
            fontFamily={FONT_STACK}
          >
            {lb.text}
          </text>
          <text
            x={anchor === "end" ? -8 : 14}
            y={2}
            textAnchor={anchor}
            fontSize={14}
            fontWeight={800}
            fill={accent}
            fontFamily={FONT_STACK}
            dy={-24}
          >
            {i + 1}
          </text>
        </g>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="parts" />

      <ParallaxLayer depth={0.14} driftY={12}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(62% 58% at 40% 46%, ${COLORS.bg1} 0%, ${COLORS.bg0} 58%, ${COLORS.bg2} 118%)`,
          }}
        />
      </ParallaxLayer>
      <GodRays x={30} y={-16} angle={18} color="rgba(169,121,74,0.15)" rays={6} />
      <ParallaxLayer depth={0.35} driftX={12}>
        <ParticleField count={16} kind="spores" rise={false} drift={22} color={COLORS.accentSoft} opacity={0.45} />
      </ParallaxLayer>

      {/* título */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * -18}px)`,
        }}
      >
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: COLORS.amber }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, color: COLORS.text, marginTop: 6 }}>{title}</div>
      </div>

      {/* lámina */}
      <AbsoluteFill>
        <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ display: "block" }}>
          {/* halo cálido bajo la figura */}
          <ellipse cx={FX} cy={FY + 40} rx={280} ry={250} fill={accent} opacity={0.08} style={{ filter: "url(#parts-soft)" }} />
          {/* marco de lámina (ficha grabada) */}
          <g opacity={enter * 0.5}>
            <rect x={FX - 340} y={FY - 320} width={680} height={680} rx={18} fill="none" stroke={COLORS.bg2} strokeWidth={3} />
            <rect x={FX - 322} y={FY - 302} width={644} height={644} rx={12} fill="none" stroke={COLORS.textDim} strokeWidth={1.5} strokeDasharray="6 8" />
          </g>

          <g transform={`translate(0 ${breathe}) scale(${interpolate(figS, [0, 1], [0.94, 1])}) translate(${(FX * (1 - 1)) | 0} 0)`} style={{ transformOrigin: `${FX}px ${FY}px` }}>
            <Figure />
          </g>

          {normLabels.map((lb, i) => (
            <Label key={i} lb={lb} i={i} />
          ))}
        </svg>
      </AbsoluteFill>

      {/* sello de lámina en esquina superior izquierda */}
      <div style={{ position: "absolute", left: 70, bottom: 80 }}>
        <WaxSeal at={30} size={116} color={COLORS.danger} initials="✦" />
      </div>

      <PaperGrain opacity={0.1} scale={0.9} seed={11} />
    </AbsoluteFill>
  );
};

export default PartsDiagramKit;
