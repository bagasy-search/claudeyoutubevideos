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
// CycleDiagramKit — CICLO CIRCULAR de fases con flechas de arco de tinta.
// Genérico: "ciclo del compost" (huerta), "ciclo de mantenimiento" (reparación)
// o "las cuatro estaciones de la granja" (amish). Las fases se ubican sobre un
// anillo de pergamino; entre fase y fase, un arco de tinta (InkDraw) se traza
// con su punta de flecha; en el centro, un núcleo giratorio determinístico con
// leyenda. Profundidad: parallax multicapa + god rays + esporas flotantes +
// borde rugoso de tinta (SvgFilters) + sombras 3D en cada nodo.
// ═══════════════════════════════════════════════════════════════════════════

type Phase = { label: string };

const DEFAULT_PHASES: Phase[] = [
  { label: "Reunir" },
  { label: "Mezclar" },
  { label: "Reposar" },
  { label: "Cosechar" },
];

// Glifo de tinta por fase (determinístico) para acompañar cada nodo.
const phaseGlyph = (i: number): string => ["✿", "❖", "☀", "❄", "☘", "✦", "◆", "❧"][i % 8];

export const CycleDiagramKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  phases?: Phase[];
  centerLabel?: string;
}> = ({
  durationInFrames,
  title = "Un ciclo que se repite",
  subtitle = "El ritmo de siempre",
  accent = COLORS.accent,
  phases = DEFAULT_PHASES,
  centerLabel = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });

  const VB = 1600;
  const VBH = 900;
  const cx = 720; // corrido a la izq → deja libre esquina inferior-derecha
  const cy = 470;
  const R = 268; // radio del anillo de fases
  const n = Math.max(2, Math.min(phases.length, 8));

  // Ángulo de cada fase: arranca arriba (−90°) y avanza en sentido horario.
  const angleAt = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const pos = (i: number, r = R) => ({
    x: cx + Math.cos(angleAt(i)) * r,
    y: cy + Math.sin(angleAt(i)) * r,
  });

  const nodeAt = (i: number) => sec(0.6) + i * sec(0.7);
  const arcAt = (i: number) => nodeAt(i) + sec(0.3);

  // Rotación determinística lenta del núcleo (idle loop) — NO usa Date/random.
  const coreSpin = (frame / fps) * 8; // grados
  const ringBreathe = interpolate(Math.sin(frame / 60), [-1, 1], [0.985, 1.015]);

  // Arco entre fase i e i+1 (siguiente, cerrando el círculo).
  const arcPath = (i: number) => {
    const gap = 0.26; // hueco alrededor de cada nodo (en radianes)
    const a0 = angleAt(i) + gap;
    const a1 = angleAt((i + 1) % n) - gap + (i + 1 >= n ? Math.PI * 2 : 0);
    const rr = R;
    const large = 0;
    const sweep = 1;
    const x0 = cx + Math.cos(a0) * rr;
    const y0 = cy + Math.sin(a0) * rr;
    const x1 = cx + Math.cos(a1) * rr;
    const y1 = cy + Math.sin(a1) * rr;
    return { d: `M ${x0} ${y0} A ${rr} ${rr} 0 ${large} ${sweep} ${x1} ${y1}`, end: { x: x1, y: y1, a: a1 } };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="cyc" />
      <TechBackground glowX={45} glowY={30} hue="amber" drift={0.35} />

      <ParallaxLayer depth={0.25} driftX={14} driftY={10}>
        <GodRays x={40} y={-12} angle={-18} color="rgba(124,138,90,0.15)" rays={7} intensity={0.9} />
      </ParallaxLayer>
      <ParallaxLayer depth={0.55} driftX={30} driftY={20}>
        <ParticleField count={30} kind="spores" rise drift={30} color={COLORS.accentSoft} opacity={0.55} />
      </ParallaxLayer>

      <SfxCue at={0} src={SFX.whoosh} volume={0.35} />
      {phases.slice(0, n).map((_, i) => (
        <React.Fragment key={"sfx" + i}>
          <SfxCue at={nodeAt(i)} src={SFX.nodeLand} volume={0.28} />
          <SfxCue at={arcAt(i)} src={SFX.lineDraw} volume={0.24} />
        </React.Fragment>
      ))}

      {/* Encabezado */}
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        }}
      >
        <div style={{ letterSpacing: 6, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: accent }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 62, fontWeight: 800, color: COLORS.text, lineHeight: 1.02, marginTop: 4 }}>
          {title}
        </div>
      </div>

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox={`0 0 ${VB} ${VBH}`} width="94%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <radialGradient id="cycCore" cx="42%" cy="34%">
              <stop offset="0%" stopColor="#F6EFDC" />
              <stop offset="70%" stopColor={COLORS.bg2} />
              <stop offset="100%" stopColor="#C9BA98" />
            </radialGradient>
            <linearGradient id="cycNode" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6EFDC" />
              <stop offset="100%" stopColor={COLORS.bg2} />
            </linearGradient>
          </defs>

          {/* Anillo guía tenue (respira) */}
          <g transform={`translate(${cx} ${cy}) scale(${ringBreathe}) translate(${-cx} ${-cy})`}>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(42,38,32,0.14)" strokeWidth={2} strokeDasharray="3 12" opacity={enter} />
          </g>

          {/* ARCOS con flecha entre fases */}
          {phases.slice(0, n).map((_, i) => {
            const { d, end } = arcPath(i);
            const at = arcAt(i);
            const p = interpolate(frame - at, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // punta de flecha tangente al arco (horario → perpendicular hacia adentro-adelante)
            const ta = end.a + Math.PI / 2; // dirección tangente horaria
            const ah = 24;
            const aw = 13;
            const tx = end.x;
            const ty = end.y;
            const head = `M ${tx + Math.cos(ta) * 10} ${ty + Math.sin(ta) * 10}
              L ${tx - Math.cos(ta) * ah - Math.sin(ta) * aw} ${ty - Math.sin(ta) * ah + Math.cos(ta) * aw}
              L ${tx - Math.cos(ta) * ah + Math.sin(ta) * aw} ${ty - Math.sin(ta) * ah - Math.cos(ta) * aw} Z`;
            return (
              <g key={"arc" + i} style={{ filter: "url(#cyc-rough)" }}>
                <path d={d} fill="none" stroke="rgba(42,38,32,0.20)" strokeWidth={8} strokeLinecap="round" transform="translate(2 3)" opacity={p} />
                <InkDraw d={d} at={at} duration={30} color={accent} width={7} length={520} />
                <g opacity={interpolate(frame - at, [24, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                  <path d={head} fill={accent} style={{ filter: "drop-shadow(0 2px 3px rgba(42,38,32,0.3))" }} />
                </g>
              </g>
            );
          })}

          {/* NÚCLEO central giratorio */}
          <g>
            <ellipse cx={cx} cy={cy + 118} rx={130} ry={26} fill="rgba(42,38,32,0.18)" opacity={enter} />
            <g style={{ filter: "drop-shadow(0 16px 26px rgba(42,38,32,0.28))" }}>
              <circle cx={cx} cy={cy} r={118} fill="url(#cycCore)" stroke="rgba(42,38,32,0.2)" strokeWidth={3} />
              {/* rayos grabados que giran (idle determinístico) */}
              <g transform={`rotate(${coreSpin} ${cx} ${cy})`} opacity={0.4}>
                {Array.from({ length: 12 }, (_, k) => {
                  const a = (k / 12) * Math.PI * 2;
                  return (
                    <line
                      key={k}
                      x1={cx + Math.cos(a) * 58}
                      y1={cy + Math.sin(a) * 58}
                      x2={cx + Math.cos(a) * 104}
                      y2={cy + Math.sin(a) * 104}
                      stroke={accent}
                      strokeWidth={k % 3 === 0 ? 4 : 2}
                    />
                  );
                })}
              </g>
              <circle cx={cx} cy={cy} r={72} fill="none" stroke={accent} strokeWidth={3} opacity={0.6} />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={centerLabel ? 40 : 60} fontWeight={900} fill={COLORS.text} fontFamily={FONT_STACK}>
                {centerLabel || "↻"}
              </text>
            </g>
          </g>

          {/* NODOS de fase */}
          {phases.slice(0, n).map((ph, i) => {
            const { x, y } = pos(i);
            const at = nodeAt(i);
            const s = spring({ frame: frame - at, fps, config: { damping: 14, mass: 0.8, stiffness: 140 } });
            const idle = wobble(i, frame, 0.6) * 3;
            const glyph = phaseGlyph(i);
            const r = 74;
            return (
              <g key={"ph" + i} transform={`translate(${x} ${y + idle})`} opacity={interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" })}>
                <g transform={`scale(${interpolate(s, [0, 1], [0.4, 1])})`} style={{ transformOrigin: "0 0" }}>
                  <ellipse cx={0} cy={r + 18} rx={r * 0.85} ry={16} fill="rgba(42,38,32,0.2)" />
                  <g style={{ filter: "drop-shadow(0 12px 20px rgba(42,38,32,0.28))" }}>
                    <circle r={r} fill="url(#cycNode)" stroke="rgba(42,38,32,0.2)" strokeWidth={2.5} />
                    <circle r={r - 9} fill="none" stroke={accent} strokeWidth={2} strokeDasharray="2 8" opacity={0.55} />
                  </g>
                  {/* glifo */}
                  <text x={0} y={-14} textAnchor="middle" dominantBaseline="central" fontSize={40} fill={accent} fontFamily={FONT_STACK} style={{ fontWeight: 900 }}>
                    {glyph}
                  </text>
                  {/* sello de número */}
                  <g transform={`translate(${r * 0.62} ${-r * 0.62})`}>
                    <circle r={19} fill={COLORS.text} />
                    <text textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={900} fill={COLORS.bg0} fontFamily={FONT_STACK}>
                      {i + 1}
                    </text>
                  </g>
                </g>
                {/* etiqueta bajo el nodo */}
                <text
                  x={0}
                  y={r + 44}
                  textAnchor="middle"
                  fontSize={36}
                  fontWeight={800}
                  fill={COLORS.text}
                  fontFamily={FONT_STACK}
                  opacity={interpolate(s, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                  style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}
                >
                  {ph.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      <PaperGrain opacity={0.1} scale={0.85} seed={11} />
    </AbsoluteFill>
  );
};

export default CycleDiagramKit;
