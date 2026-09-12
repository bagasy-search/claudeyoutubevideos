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
  InkDraw,
  PaperGrain,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// TimelineKit — LÍNEA DE TIEMPO horizontal de almanaque. Una cinta de tinta se
// DIBUJA de izquierda a derecha sobre el pergamino; a medida que la pluma pasa
// por cada hito, un nodo se estampa (pop de resorte), el AÑO rueda en un odómetro
// y una etiqueta cuelga alternando arriba/abajo del eje. Un "playhead" (pluma con
// gota de tinta) viaja sobre la cinta. GENÉRICO / PROP-DRIVEN: sirve para la
// "historia de una técnica" (huerta), la "cronología del asentamiento" (amish) o
// la "vida útil de una pieza" (reparación) según las props. Defaults sensatos.
// technique: InkDraw de la línea, Odometer de años, DepthShadow de nodos, ParallaxLayer.
// ═══════════════════════════════════════════════════════════════════════════

export type Milestone = { year: string | number; label: string };

const DEFAULT_MILESTONES: Milestone[] = [
  { year: 1840, label: "Los primeros almácigos" },
  { year: 1890, label: "Llega el riego por surco" },
  { year: 1935, label: "El injerto se populariza" },
  { year: 1978, label: "La cosecha récord" },
];

export const TimelineKit: React.FC<{
  durationInFrames: number;
  title?: string;
  subtitle?: string;
  accent?: string;
  milestones?: Milestone[];
}> = ({
  durationInFrames,
  title = "Una línea en el tiempo",
  subtitle = "Cómo fue cambiando, año a año",
  accent = COLORS.amber,
  milestones = DEFAULT_MILESTONES,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── entrada / salida global ────────────────────────────────────────────────
  const enter = spring({ frame, fps, config: { damping: 22, mass: 1, stiffness: 85 } });
  const outScale = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0.94],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const outOp = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── geometría de la cinta (viewBox 1600×900) ───────────────────────────────
  const ms = milestones.slice(0, 6);
  const n = Math.max(1, ms.length);
  const axisY = 470;
  const startX = 190;
  const endX = 1300; // deja libre la esquina inferior derecha (avatar PiP)
  const span = endX - startX;
  const nodeX = (i: number) =>
    n === 1 ? (startX + endX) / 2 : startX + (span * i) / (n - 1);

  // años numéricos → rueda odómetro; si no, texto plano
  const yearNum = (y: string | number) =>
    typeof y === "number" ? y : Number.isFinite(Number(y)) ? Number(y) : null;
  const yearDigits = (y: string | number) => String(y).replace(/\D/g, "").length || 4;

  // ── tiempo: la cinta se traza, luego el playhead recorre; cada hito se
  // enciende cuando la pluma llega a su x ──────────────────────────────────────
  const drawStart = 0.55;
  const drawDur = Math.min(2.6, (durationInFrames / fps) * 0.5);
  const lineProg = interpolate(
    frame - sec(drawStart),
    [0, sec(drawDur)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const playX = startX + lineProg * span;
  // fracción del riel en la que cae cada nodo (para saber cuándo encenderlo)
  const nodeFrac = (i: number) => (nodeX(i) - startX) / span;
  const nodeAt = (i: number) => drawStart + drawDur * nodeFrac(i);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="tml" />

      {/* ── FONDO PROFUNDO: papel + luz cálida de taller + viñeta ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 100% at 42% 22%, ${COLORS.bg0} 0%, ${COLORS.bg1} 55%, ${COLORS.bg2} 100%)`,
        }}
      />
      <ParallaxLayer depth={0.22} driftX={28} driftY={14}>
        <GodRays x={28} y={-16} angle={19} intensity={0.85} color="rgba(169,121,74,0.16)" />
      </ParallaxLayer>
      <ParallaxLayer depth={0.4} driftX={44} driftY={20}>
        <ParticleField count={16} kind="dust" rise={false} drift={24} opacity={0.42} />
      </ParallaxLayer>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(74% 64% at 46% 48%, rgba(0,0,0,0) 56%, rgba(42,38,32,0.22) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── ENCABEZADO ── */}
      <AbsoluteFill style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "86%",
            maxWidth: 1440,
            marginTop: 78,
            opacity: enter,
            transform: `translateY(${(1 - enter) * -22}px)`,
          }}
        >
          <div
            style={{
              letterSpacing: 6,
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              color: COLORS.text,
              lineHeight: 1.05,
              marginTop: 4,
            }}
          >
            {title}
          </div>
        </div>
      </AbsoluteFill>

      {/* ── CINTA DE TIEMPO ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${outScale})`, opacity: outOp }}>
        <ParallaxLayer depth={0.85} driftX={12} driftY={8}>
          <div
            style={{
              width: "90%",
              maxWidth: 1520,
              opacity: enter,
              transform: `translateY(${(1 - enter) * 26}px)`,
            }}
          >
            <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
              <defs>
                <linearGradient id="tmlRibbon" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0.7} />
                </linearGradient>
                <radialGradient id="tmlNode" cx="42%" cy="36%">
                  <stop offset="0%" stopColor="#FFF6E2" />
                  <stop offset="100%" stopColor={COLORS.bg2} />
                </radialGradient>
                <filter id="tmlRough">
                  <feTurbulence baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale={2} />
                </filter>
                <filter id="tmlNodeShadow" x="-60%" y="-60%" width="220%" height="220%">
                  <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#2A2620" floodOpacity="0.32" />
                </filter>
              </defs>

              {/* marcas de escala menores (tics de almanaque) bajo el eje */}
              {Array.from({ length: 25 }, (_, i) => {
                const tx = startX + (span * i) / 24;
                const on = tx <= playX + 2;
                return (
                  <line
                    key={"tic" + i}
                    x1={tx}
                    y1={axisY - 8}
                    x2={tx}
                    y2={axisY + 8}
                    stroke={COLORS.ink}
                    strokeOpacity={on ? 0.28 : 0.1}
                    strokeWidth={i % 6 === 0 ? 3 : 1.5}
                  />
                );
              })}

              {/* sombra de la cinta (profundidad detrás) */}
              <line
                x1={startX}
                y1={axisY + 7}
                x2={endX}
                y2={axisY + 7}
                stroke="rgba(42,38,32,0.16)"
                strokeWidth={16}
                strokeLinecap="round"
              />
              {/* riel guía tenue punteado (dónde irá la tinta) */}
              <line
                x1={startX}
                y1={axisY}
                x2={endX}
                y2={axisY}
                stroke="rgba(42,38,32,0.16)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray="2 20"
              />

              {/* CINTA DE TINTA que se dibuja de izquierda a derecha */}
              <g filter="url(#tmlRough)">
                <InkDraw
                  d={`M ${startX} ${axisY} L ${endX} ${axisY}`}
                  at={sec(drawStart)}
                  duration={sec(drawDur)}
                  color={accent}
                  width={13}
                  length={span}
                  dropShadow
                />
              </g>
              {/* brillo cálido sobre la cinta ya trazada */}
              <line
                x1={startX}
                y1={axisY - 3}
                x2={playX}
                y2={axisY - 3}
                stroke="#FFF6E2"
                strokeOpacity={0.35}
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* flecha final de la cinta (aparece al completar el trazo) */}
              {lineProg > 0.985 && (
                <g opacity={interpolate(lineProg, [0.985, 1], [0, 1])}>
                  <path
                    d={`M ${endX} ${axisY} l -26 -16 l 8 16 l -8 16 z`}
                    fill={accent}
                    filter="url(#tmlRough)"
                  />
                </g>
              )}

              {/* ── HITOS: nodo + año (odómetro) + etiqueta colgante ── */}
              {ms.map((m, i) => {
                const x = nodeX(i);
                const at = nodeAt(i);
                const on = playX >= x - 4;
                const pop = spring({
                  frame: frame - sec(at),
                  fps,
                  config: { damping: 10, mass: 0.6, stiffness: 190 },
                });
                const nodeScale = on ? pop : 0;
                const up = i % 2 === 0; // alterna arriba / abajo
                const bob = wobble(i, frame, 0.6) * 3;
                const stemLen = 96;
                const labelY = up ? axisY - stemLen : axisY + stemLen;
                const nodeR = 30;
                const yn = yearNum(m.year);
                const dg = yearDigits(m.year);

                // ancho de la placa: según el texto PERO clampeado para que dos
                // hitos vecinos NO se encimen (máx = casi el paso entre nodos) y
                // para que la placa entre completa en el frame (margen 24px).
                const slot = n > 1 ? span / (n - 1) : span;
                const maxByNeighbor = slot - 26; // deja aire entre placas contiguas
                const maxByFrame = Math.min(x - 24, 1600 - 24 - x) * 2;
                const labelW = Math.max(
                  180,
                  Math.min(m.label.length * 14 + 60, maxByNeighbor, maxByFrame),
                );
                const labelH = 96;
                // clampeá el borde izq/der de la placa para que no salga del frame
                const plateX = Math.max(24, Math.min(x - labelW / 2, 1600 - 24 - labelW));
                const plateY = up ? labelY - labelH : labelY;
                const cardReveal = spring({
                  frame: frame - sec(at + 0.1),
                  fps,
                  config: { damping: 18, mass: 0.85, stiffness: 130 },
                });

                return (
                  <g key={i}>
                    {/* tallo de tinta del eje a la etiqueta */}
                    {on && (
                      <line
                        x1={x}
                        y1={axisY}
                        x2={x}
                        y2={interpolate(nodeScale, [0, 1], [axisY, labelY])}
                        stroke={accent}
                        strokeOpacity={0.7}
                        strokeWidth={4}
                        strokeLinecap="round"
                      />
                    )}

                    {/* halo de encendido del nodo */}
                    {on && (
                      <circle
                        cx={x}
                        cy={axisY}
                        r={nodeR * (1 + (1 - pop) * 1.8)}
                        fill="none"
                        stroke={accent}
                        strokeOpacity={interpolate(pop, [0, 1], [0.6, 0])}
                        strokeWidth={4}
                      />
                    )}

                    {/* NODO (moneda de pergamino con relieve) */}
                    <g
                      transform={`translate(${x} ${axisY + bob * 0.2}) scale(${nodeScale})`}
                      filter="url(#tmlNodeShadow)"
                    >
                      <circle r={nodeR} fill="url(#tmlNode)" stroke={accent} strokeWidth={5} />
                      <circle r={nodeR - 9} fill="none" stroke={COLORS.ink} strokeOpacity={0.18} strokeWidth={2} />
                      <circle cx={-nodeR * 0.32} cy={-nodeR * 0.34} r={nodeR * 0.22} fill="#fff" opacity={0.55} />
                    </g>

                    {/* ETIQUETA colgante: placa con año (odómetro) + texto */}
                    {on && (
                      <g
                        opacity={cardReveal}
                        transform={`translate(0 ${(1 - cardReveal) * (up ? 14 : -14) + bob})`}
                      >
                        {/* placa de pergamino OPACA (fondo sólido + gradiente encima
                            para que ningún tic/placa vecina se filtre por detrás) */}
                        <clipPath id={`tmlPlate${i}`}>
                          <rect x={plateX} y={plateY} width={labelW} height={labelH} rx={16} />
                        </clipPath>
                        <g filter="url(#tmlRough)">
                          <rect
                            x={plateX}
                            y={plateY}
                            width={labelW}
                            height={labelH}
                            rx={16}
                            fill={COLORS.bg1}
                          />
                          <rect
                            x={plateX}
                            y={plateY}
                            width={labelW}
                            height={labelH}
                            rx={16}
                            fill="url(#tmlNode)"
                            stroke={COLORS.amber}
                            strokeOpacity={0.55}
                            strokeWidth={3}
                          />
                        </g>
                        <rect
                          x={plateX}
                          y={up ? plateY : plateY}
                          width={6}
                          height={labelH}
                          rx={3}
                          fill={accent}
                        />
                        {/* contenido recortado a la placa (año + etiqueta) */}
                        <g clipPath={`url(#tmlPlate${i})`}>
                          {/* AÑO — número estable (el still cae a mitad del odómetro
                              y mostraba años a medio rodar); mostramos el valor fijo */}
                          <text
                            x={plateX + 26}
                            y={plateY + 44}
                            fontSize={34}
                            fontWeight={900}
                            fill={accent}
                            fontFamily={FONT_STACK}
                          >
                            {yn !== null ? String(yn).padStart(dg, "0") : m.year}
                          </text>
                          {/* etiqueta */}
                          <text
                            x={plateX + 26}
                            y={plateY + labelH - 20}
                            fontSize={Math.min(26, ((labelW - 52) / Math.max(1, m.label.length)) * 1.85)}
                            fontWeight={700}
                            fill={COLORS.text}
                            fontFamily={FONT_STACK}
                          >
                            {m.label}
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </ParallaxLayer>
      </AbsoluteFill>

      {/* ── PLAYHEAD: pluma que viaja sobre la cinta con gota de tinta (frente) ── */}
      {lineProg > 0.001 && lineProg < 0.999 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ParallaxLayer depth={1} driftX={4} driftY={3}>
            <div style={{ width: "90%", maxWidth: 1520, position: "relative", opacity: outOp }}>
              <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
                <g transform={`translate(${playX} ${axisY})`}>
                  <RimLightNib color={accent} />
                  {/* chispas de tinta que quedan atrás del nib */}
                  {Array.from({ length: 4 }, (_, k) => {
                    const t = (frame + k * 7) % 26;
                    const life = interpolate(t, [0, 26], [0.7, 0], { extrapolateRight: "clamp" });
                    return (
                      <circle
                        key={k}
                        cx={-8 - (t * 1.5) - rand(k) * 6}
                        cy={2 + wobble(k, frame, 2) * 5}
                        r={2 + rand(k, 1) * 2}
                        fill={accent}
                        opacity={life}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </ParallaxLayer>
        </AbsoluteFill>
      )}

      <PaperGrain opacity={0.13} scale={0.88} seed={6} />
    </AbsoluteFill>
  );
};

// pluma/nib de tinta con brillo de borde — pieza del playhead
const RimLightNib: React.FC<{ color: string }> = ({ color }) => (
  <g style={{ filter: "drop-shadow(0 4px 5px rgba(42,38,32,0.4))" }}>
    {/* cuerpo de la pluma */}
    <path
      d="M 0 -6 L 22 -40 L 30 -34 L 10 2 Z"
      fill="#5A4632"
      stroke={COLORS.ink}
      strokeWidth={2}
    />
    <path d="M 22 -40 L 34 -52 L 40 -46 L 30 -34 Z" fill="#8C6A44" />
    {/* punta de tinta */}
    <circle cx={0} cy={0} r={10} fill={color} />
    <circle cx={-3} cy={-3} r={3} fill="#fff" opacity={0.6} />
  </g>
);

export default TimelineKit;
