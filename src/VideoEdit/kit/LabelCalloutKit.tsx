import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParticleField,
  GodRays,
  InkDraw,
  PaperGrain,
  SvgFilters,
  RimLight,
  wobble,
} from "./depth";

// ─────────────────────────────────────────────────────────────────────────────
// LabelCalloutKit — ETIQUETA/CALLOUT suelta que APUNTA a un punto de la escena con
// una línea de tinta y un pico. Genérico y PROP-DRIVEN: el texto y el punto entran
// por props (x/y en % del frame, `from` = de dónde llega la etiqueta).
//   • Huerta:     text="Nudo de la raíz"   x=42 y=58 from="left"
//   • Reparación: text="Grieta de fatiga"  x=64 y=40 from="right"
//   • Amish:      text="Muesca del engranaje" x=50 y=70 from="bottom"
// Se muestra sobre un objetivo (target) con un pin pulsante; la línea guía se DIBUJA
// a tinta (InkDraw) desde el pin hasta la etiqueta, que aparece con pop (spring),
// RimLight, sombra 3D y un tick suave. Loop idle: la etiqueta respira apenas.
// RENDER-SAFE: todo desde useCurrentFrame(). El movimiento idle es determinístico.
// Deja libre la esquina inferior derecha (default apunta al centro-izquierda).
// ─────────────────────────────────────────────────────────────────────────────

type From = "top" | "bottom" | "left" | "right";

export const LabelCalloutKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  text?: string;
  x?: number; // % del ancho (punto señalado)
  y?: number; // % del alto
  from?: From;
}> = ({
  durationInFrames,
  title = "Mirá este detalle",
  subtitle = "el punto exacto",
  accent = COLORS.amber,
  text = "Acá",
  x = 44,
  y = 52,
  from = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 } });

  // viewBox 1600x900 → coords del punto señalado
  const W = 1600;
  const H = 900;
  const tx = (x / 100) * W;
  const ty = (y / 100) * H;

  // El bloque de etiqueta se ubica en función de `from` (offset desde el target)
  const OFFSETS: Record<From, [number, number]> = {
    top: [0, -300],
    bottom: [0, 300],
    left: [-420, -40],
    right: [420, -40],
  };
  const [ox, oy] = OFFSETS[from];
  const lx = tx + ox; // ancla de la etiqueta
  const ly = ty + oy;

  // idle: respiración muy sutil del bloque de etiqueta (determinístico)
  const idle = wobble(0, frame, 0.6) * 4 * enter;

  // línea guía como un ligero codo (elbow) de tinta desde target hasta etiqueta
  const midX = from === "left" || from === "right" ? tx + ox * 0.55 : tx;
  const midY = from === "top" || from === "bottom" ? ty + oy * 0.55 : ty;
  const leadPath = `M ${tx} ${ty} Q ${midX} ${midY} ${lx} ${ly + idle}`;
  const leadLen = Math.hypot(lx - tx, ly - ty) + 200;

  // pin/objetivo: aparece primero, luego pulsa
  const pinS = spring({ frame: frame - 6, fps, config: { damping: 10, mass: 0.7, stiffness: 170 } });
  const pulse = interpolate(Math.sin((frame - 20) / 9), [-1, 1], [0.85, 1.25]);
  const ring = ((frame - 20) % 46) / 46; // onda expansiva en loop

  // etiqueta: pop tras dibujarse la línea
  const LABEL_AT = 22;
  const labelS = spring({ frame: frame - LABEL_AT, fps, config: { damping: 12, mass: 0.7, stiffness: 160 } });

  // dimensiones estimadas del bloque (para dibujar la caja en SVG)
  const boxW = Math.min(560, 190 + text.length * 26);
  const boxH = 118;
  const anchorRight = from === "left";
  // caja centrada en (lx, ly); ajusta cuando llega de left/right para no tapar el target
  const boxCx = lx;
  const boxCy = ly + idle;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="callout" />
      <TechBackground glowX={x} glowY={y} hue="amber" drift={0.3} />
      <GodRays x={62} y={-14} angle={20} color="rgba(169,121,74,0.14)" intensity={0.9} rays={6} />
      <ParticleField count={16} kind="spores" rise drift={20} opacity={0.4} />
      <SfxCue at={6} src={SFX.popUp} volume={0.3} />
      <SfxCue at={LABEL_AT - 6} src={SFX.lineDraw} volume={0.28} durationInFrames={30} />
      <SfxCue at={LABEL_AT} src={SFX.click} volume={0.3} />

      {/* título opcional (arriba, no tapa la esquina PiP) */}
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center", opacity: enter, fontFamily: FONT_STACK }}>
        <div style={{ letterSpacing: 6, fontSize: 20, fontWeight: 700, textTransform: "uppercase", color: accent }}>{subtitle}</div>
        <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.text, marginTop: 2 }}>{title}</div>
      </div>

      <AbsoluteFill style={{ opacity: enter }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            <radialGradient id="calloutPin" cx="40%" cy="34%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.6} />
              <stop offset="45%" stopColor={accent} />
              <stop offset="100%" stopColor="#5a3f24" />
            </radialGradient>
          </defs>

          {/* ── onda expansiva del objetivo (loop) ── */}
          <circle
            cx={tx}
            cy={ty}
            r={20 + ring * 60}
            fill="none"
            stroke={accent}
            strokeWidth={3}
            opacity={(1 - ring) * 0.5 * pinS}
          />
          <circle
            cx={tx}
            cy={ty}
            r={20 + ((ring + 0.5) % 1) * 60}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            opacity={(1 - ((ring + 0.5) % 1)) * 0.35 * pinS}
          />

          {/* ── línea guía de tinta (con leve sombra) ── */}
          <InkDraw d={leadPath} at={12} duration={16} color={COLORS.ink} width={5} length={leadLen} dropShadow />
          {/* micro-punto donde nace la línea */}
          <circle cx={lx} cy={boxCy} r={6} fill={COLORS.ink} opacity={interpolate(frame, [26, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

          {/* ── PIN sobre el objetivo ── */}
          <g transform={`translate(${tx} ${ty}) scale(${pinS * pulse})`}>
            <circle r={26} fill="url(#calloutPin)" stroke="#2a1c10" strokeWidth={3} />
            <circle r={11} fill={COLORS.bg0} />
            <circle r={5} fill={accent} />
            <circle cx={-7} cy={-8} r={5} fill="#fff" opacity={0.5} />
          </g>

          {/* ── CAJA de la etiqueta, dibujada en SVG (con emboss + pico) ── */}
          <g
            transform={`translate(${boxCx} ${boxCy}) scale(${0.7 + labelS * 0.3})`}
            opacity={interpolate(labelS, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}
          >
            {/* sombra 3D bajo la caja (apilada) */}
            {Array.from({ length: 5 }, (_, i) => {
              const t = (i + 1) / 5;
              return (
                <rect
                  key={"cs" + i}
                  x={-boxW / 2}
                  y={-boxH / 2 + t * 16}
                  width={boxW}
                  height={boxH}
                  rx={16}
                  fill={`rgba(42,38,32,${0.05})`}
                />
              );
            })}
            {/* cuerpo de papel */}
            <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx={16} fill="#F3EAD3" stroke="#2a1c10" strokeWidth={3} />
            {/* franja de acento a la izquierda */}
            <rect x={-boxW / 2} y={-boxH / 2} width={16} height={boxH} rx={8} fill={accent} />
            {/* highlight superior */}
            <rect x={-boxW / 2 + 4} y={-boxH / 2 + 4} width={boxW - 8} height={16} rx={8} fill="#fff" opacity={0.35} />
            {/* pico que apunta hacia el target (según from) */}
            {(() => {
              const p = 22; // media base del pico
              if (from === "bottom") return <polygon points={`0,${-boxH / 2 - 20} ${-p},${-boxH / 2} ${p},${-boxH / 2}`} fill="#F3EAD3" stroke="#2a1c10" strokeWidth={3} />;
              if (from === "top") return <polygon points={`0,${boxH / 2 + 20} ${-p},${boxH / 2} ${p},${boxH / 2}`} fill="#F3EAD3" stroke="#2a1c10" strokeWidth={3} />;
              if (from === "left") return <polygon points={`${boxW / 2 + 20},0 ${boxW / 2},${-p} ${boxW / 2},${p}`} fill="#F3EAD3" stroke="#2a1c10" strokeWidth={3} />;
              return <polygon points={`${-boxW / 2 - 20},0 ${-boxW / 2},${-p} ${-boxW / 2},${p}`} fill="#F3EAD3" stroke="#2a1c10" strokeWidth={3} />;
            })()}
            {/* texto */}
            <text
              x={anchorRight ? -boxW / 2 + 40 : 12}
              y={12}
              textAnchor={anchorRight ? "start" : "middle"}
              fontSize={44}
              fontWeight={800}
              fill={COLORS.text}
              fontFamily={FONT_STACK}
            >
              {text}
            </text>
          </g>
        </svg>
      </AbsoluteFill>

      {/* halo cálido detrás de la etiqueta para levantarla del papel */}
      <div
        style={{
          position: "absolute",
          left: `${((boxCx) / W) * 100}%`,
          top: `${(boxCy / H) * 100}%`,
          transform: "translate(-50%,-50%)",
          width: 10,
          height: 10,
          pointerEvents: "none",
        }}
      >
        <RimLight color={accent} spread={2} x={0.5} y={0.5}>
          <div style={{ width: 1, height: 1 }} />
        </RimLight>
      </div>

      <PaperGrain opacity={0.1} scale={0.85} />
    </AbsoluteFill>
  );
};

export default LabelCalloutKit;
