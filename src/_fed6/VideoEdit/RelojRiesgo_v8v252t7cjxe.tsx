// RelojRiesgo_v8v252t7cjxe.tsx — componente PROPIO del slug (aislado, no toca archivos compartidos).
// Reloj ANALÓGICO de 24 horas: la esfera se dibuja, la franja de 6 a 12 de la mañana se ENCIENDE
// en teal y late, la aguja recorre el cuadrante y, al cruzar la franja, entra el dato gigante a la
// derecha. Todo SVG/CSS puro: cero assets, cero libs externas, cero Math.random/Date.now.
// Look clínico teal del canal (mismos hex que ErrorStinger), tipografía Inter del kit premium.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { F_INTER, SPR } from "./kit/premium/theme";

// Paleta del canal (idéntica a scenes/ErrorStinger.tsx)
const TEAL = "#12B3AE";
const RED = "#E4141B";
const INK = "#0E1B22";
const CREAM = "#F5F9FA";

// Geometría de la esfera (canvas 1920x1080, centrada a la IZQUIERDA)
const CX = 560;
const CY = 540;
const R = 330;
const CIRC = 2 * Math.PI * R;

/** Punto polar de una hora del reloj de 24 h (hora 0 arriba, sentido horario). */
const polar = (hour: number, radius: number) => {
  const a = ((hour / 24) * 360 - 90) * (Math.PI / 180);
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
};

/** Arco SVG entre dos horas (siempre < 12 h, sentido horario). */
const arcPath = (h0: number, h1: number, radius: number) => {
  const a = polar(h0, radius);
  const b = polar(h1, radius);
  const large = h1 - h0 > 12 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y}`;
};

/** Cuña rellena (centro → arco → centro) para leer la franja como bloque horario. */
const wedgePath = (h0: number, h1: number, radius: number) => {
  const a = polar(h0, radius);
  const b = polar(h1, radius);
  const large = h1 - h0 > 12 ? 1 : 0;
  return `M ${CX} ${CY} L ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y} Z`;
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const RelojRiesgoV8: React.FC<{
  durationInFrames: number;
  title?: string;
  stat?: string;
  statUnit?: string;
  note?: string;
  source?: string;
  tone?: "teal" | "warn";
}> = ({
  durationInFrames,
  title = "Cuándo ocurren los infartos",
  stat = "3×",
  statUnit = "más entre las 6 y las 12",
  note = "El pico matutino",
  source,
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? RED : TEAL;
  // rgb del acento para glows sin depender de strings de color externas
  const accentRGB = tone === "warn" ? "228,20,27" : "18,179,174";

  // Escala de tiempo relativa a 30 fps → el ritmo no cambia si el proyecto va a otro fps.
  const f = (n: number) => Math.round((n * fps) / 30);

  const HOUR_FROM = 6;
  const HOUR_TO = 12;
  const HAND_START = f(12);
  const HAND_LEN = f(40);
  const HAND_END_HOUR = 9; // la aguja se planta en el medio de la franja
  const IGNITE = f(10);
  // La aguja cruza la hora 6 acá (easing out cubic resuelto para 6/9 del recorrido).
  const CROSS = HAND_START + Math.round(HAND_LEN * 0.307);

  // ── entrada de la esfera ───────────────────────────────────────────────────
  const dialSp = spring({ frame, fps, config: SPR.settle, durationInFrames: f(20) });
  const dialDraw = interpolate(frame, [f(1), f(16)], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── franja encendida ───────────────────────────────────────────────────────
  const ignite = interpolate(frame, [IGNITE, IGNITE + f(7)], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // latido suave y determinista (sin random, sin reloj del sistema)
  const beat = frame > IGNITE ? (Math.sin((frame - IGNITE) * 0.17) + 1) / 2 : 0;
  const bandGlow = ignite * (0.42 + 0.34 * beat);

  // ── aguja ──────────────────────────────────────────────────────────────────
  const swept = interpolate(frame, [HAND_START, HAND_START + HAND_LEN], [0, HAND_END_HOUR], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = Math.max(0, frame - (HAND_START + HAND_LEN)) * 0.007; // sigue viva, casi imperceptible
  const handHour = Math.min(swept + drift, HOUR_TO - 0.15);
  const handDeg = (handHour / 24) * 360;
  const inBand = handHour >= HOUR_FROM;

  // reloj digital chico dentro de la esfera
  const hh = Math.floor(handHour);
  const mm = Math.floor((handHour - hh) * 60);

  // ── textos ─────────────────────────────────────────────────────────────────
  const titleSp = spring({ frame: frame - f(4), fps, config: SPR.snappy, durationInFrames: f(18) });
  const noteSp = spring({ frame: frame - f(14), fps, config: SPR.snappy, durationInFrames: f(16) });
  const statSp = spring({ frame: frame - CROSS, fps, config: SPR.pop, durationInFrames: f(20) });
  const unitSp = spring({ frame: frame - (CROSS + f(6)), fps, config: SPR.settle, durationInFrames: f(16) });
  const srcSp = spring({ frame: frame - (CROSS + f(16)), fps, config: SPR.soft, durationInFrames: f(14) });
  // flash del dato justo al cruzar (golpe, no fade)
  const hit = interpolate(frame, [CROSS, CROSS + f(6)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // salida: corte limpio, apenas 4 frames de levante
  const out = interpolate(frame, [durationInFrames - f(4), durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hourLabels = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <AbsoluteFill
      style={{
        fontFamily: F_INTER,
        backgroundColor: INK,
        opacity: 1 - out,
        transform: `scale(${1 - out * 0.02})`,
      }}
    >
      {/* degradé sutil + halo del acento detrás de la esfera */}
      <AbsoluteFill
        style={{ background: `linear-gradient(155deg, #142A33 0%, ${INK} 52%, #0A151B 100%)` }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 58% at ${CX}px ${CY}px, rgba(${accentRGB},${(0.1 + 0.07 * beat).toFixed(3)}), transparent 68%)`,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 40%, rgba(4,10,14,0.55))" }}
      />

      {/* ── ESFERA ─────────────────────────────────────────────────────────── */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${interpolate(dialSp, [0, 1], [0.9, 1])})`,
          transformOrigin: `${CX}px ${CY}px`,
          opacity: dialSp,
        }}
      >
        {/* cara apagada */}
        <circle cx={CX} cy={CY} r={R + 46} fill="rgba(255,255,255,0.022)" />
        <circle cx={CX} cy={CY} r={R + 46} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
        <circle cx={CX} cy={CY} r={R} fill="rgba(6,14,19,0.55)" />

        {/* aro base que se dibuja de un saque */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(207,230,228,0.20)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * dialDraw}
          transform={`rotate(-90 ${CX} ${CY})`}
        />

        {/* FRANJA 6–12 encendida: halo ancho + trazo sólido */}
        <path
          d={arcPath(HOUR_FROM, HOUR_TO, R)}
          fill="none"
          stroke={accent}
          strokeWidth={44}
          strokeLinecap="round"
          opacity={bandGlow * 0.35}
          style={{ filter: `blur(14px)` }}
        />
        <path
          d={arcPath(HOUR_FROM, HOUR_TO, R)}
          fill="none"
          stroke={accent}
          strokeWidth={16}
          strokeLinecap="round"
          opacity={ignite * (0.82 + 0.18 * beat)}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - ignite) * 0.25}
        />
        {/* cuña rellena hacia el centro, para que la franja se lea como "bloque horario" */}
        <path
          d={wedgePath(HOUR_FROM, HOUR_TO, R)}
          fill={`rgba(${accentRGB},${(0.1 + 0.06 * beat).toFixed(3)})`}
          opacity={ignite}
        />

        {/* marcas horarias */}
        {Array.from({ length: 24 }).map((_, h) => {
          const major = h % 3 === 0;
          const lit = h >= HOUR_FROM && h <= HOUR_TO;
          const a = polar(h, R - (major ? 34 : 22));
          const b = polar(h, R - 8);
          const tickIn = interpolate(frame, [f(2) + h * 0.5, f(2) + h * 0.5 + f(6)], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={h}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lit ? accent : CREAM}
              strokeWidth={major ? 6 : 3}
              strokeLinecap="round"
              opacity={tickIn * (lit ? 0.35 + 0.55 * ignite : major ? 0.5 : 0.24)}
            />
          );
        })}

        {/* números de hora */}
        {hourLabels.map((h) => {
          const p = polar(h, R - 76);
          const lit = h >= HOUR_FROM && h <= HOUR_TO;
          return (
            <text
              key={h}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={lit ? accent : CREAM}
              opacity={dialSp * (lit ? 0.6 + 0.4 * ignite : 0.42)}
              style={{ fontFamily: F_INTER, fontSize: 40, fontWeight: 800, letterSpacing: 1 }}
            >
              {pad2(h)}
            </text>
          );
        })}

        {/* etiqueta de la franja, apoyada afuera del arco */}
        <g opacity={ignite}>
          <text
            x={polar(9, R + 104).x}
            y={polar(9, R + 104).y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={accent}
            style={{ fontFamily: F_INTER, fontSize: 30, fontWeight: 900, letterSpacing: 8 }}
          >
            LA MAÑANA
          </text>
        </g>

        {/* reloj digital chico adentro */}
        <text
          x={CX}
          y={CY + 128}
          textAnchor="middle"
          dominantBaseline="central"
          fill={inBand ? accent : "rgba(207,230,228,0.45)"}
          opacity={dialSp}
          style={{ fontFamily: F_INTER, fontSize: 46, fontWeight: 800, letterSpacing: 4 }}
        >
          {`${pad2(hh)}:${pad2(mm)}`}
        </text>

        {/* AGUJA */}
        <g transform={`rotate(${handDeg} ${CX} ${CY})`} opacity={dialSp}>
          <line
            x1={CX}
            y1={CY + 62}
            x2={CX}
            y2={CY - (R - 44)}
            stroke={inBand ? accent : CREAM}
            strokeWidth={9}
            strokeLinecap="round"
            style={{ filter: inBand ? `drop-shadow(0 0 16px rgba(${accentRGB},0.85))` : "none" }}
          />
          <circle cx={CX} cy={CY - (R - 44)} r={11} fill={inBand ? accent : CREAM} />
        </g>
        <circle cx={CX} cy={CY} r={20} fill={INK} stroke={inBand ? accent : CREAM} strokeWidth={6} opacity={dialSp} />
      </svg>

      {/* ── COLUMNA DERECHA: el dato ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 0,
          width: 720,
          height: 1080,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* título */}
        <div
          style={{
            opacity: titleSp,
            transform: `translateX(${(1 - titleSp) * 46}px)`,
            color: CREAM,
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -0.5,
            maxWidth: 660,
          }}
        >
          {title}
        </div>

        {/* eyebrow / nota */}
        {note ? (
          <div
            style={{
              marginTop: 26,
              opacity: noteSp,
              transform: `translateX(${(1 - noteSp) * 34}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ width: 54, height: 5, borderRadius: 3, background: accent, opacity: 0.9 }} />
            <div
              style={{
                color: accent,
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: 7,
                textTransform: "uppercase",
              }}
            >
              {note}
            </div>
          </div>
        ) : null}

        {/* dato gigante */}
        <div
          style={{
            marginTop: 34,
            opacity: statSp,
            transform: `translateY(${(1 - statSp) * 26}px) scale(${interpolate(statSp, [0, 1], [1.28, 1])})`,
            transformOrigin: "left center",
            color: CREAM,
            fontSize: 200,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: -6,
            textShadow: `0 0 ${40 + 70 * hit}px rgba(${accentRGB},${(0.35 + 0.5 * hit).toFixed(3)})`,
          }}
        >
          {stat}
        </div>

        {/* unidad / bajada */}
        {statUnit ? (
          <div
            style={{
              marginTop: 18,
              opacity: unitSp,
              transform: `translateY(${(1 - unitSp) * 18}px)`,
              color: "rgba(245,249,250,0.86)",
              fontSize: 46,
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: 640,
            }}
          >
            {statUnit}
          </div>
        ) : null}

        {/* fuente */}
        {source ? (
          <div
            style={{
              marginTop: 40,
              opacity: srcSp * 0.72,
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "rgba(207,230,228,0.9)",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 5, background: accent }} />
            {source}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export default RelojRiesgoV8;
