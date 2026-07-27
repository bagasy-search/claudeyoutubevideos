import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME_EARTH, SPR } from "../kit/premium";

// ── MATRIZ DE SUPERFICIES ─────────────────────────────────────────────────────
// Tablero de taller: una grilla de 7 superficies (nombre · minutos de contacto ·
// herramienta) que se van ENCENDIENDO una por una, y en la esquina, separada por
// una línea de puntos, la única donde NO se usa: tablaroca empapada, en rojo.
// Todo divs + SVG, cero assets. Determinista frame a frame (nada de random/reloj).

// Paleta: variante NOCHE del THEME_EARTH (mismo dorado terroso, papel oscuro).
const PAPER = "#1b1712";
const PAPER_HI = "#251f18";
const CREAM = "#f4ead8";
const GOLD = "#d99b3e";
const DANGER = "#b4472e";
const GOOD = "#6f8f5a";

const F_SERIF = `${THEME_EARTH.fontDisplay}, "EB Garamond", Georgia, serif`;
const F_SANS = `Inter, system-ui, "Segoe UI", Arial, sans-serif`;

type Cell = { name: string; time: string; tool: string };

const CELLS: Cell[] = [
  { name: "Lechada / junta", time: "30 min", tool: "compresa de papel" },
  { name: "Azulejo y vidrio", time: "10 min", tool: "trapo" },
  { name: "Muro con aplanado", time: "10 min", tool: "atomizador" },
  { name: "Madera", time: "10 min", tool: "con la fibra" },
  { name: "Tela y ropa", time: "Lavadora", tool: "probar color" },
  { name: "Colchón", time: "15 min", tool: "aspirar y secar" },
  { name: "Plástico y hule", time: "30 min", tool: "compresa" },
];

const BAD: Cell = { name: "Tablaroca empapada", time: "NO SE USA", tool: "" };

// Geometría de la grilla (1920×1080)
const PAD_X = 84;
const COL_W = 418;
const COL_STEP = 444; // 418 + 26 de gap
const ROW_H = 352;
const ROW_STEP = 378; // 352 + 26 de gap
const GRID_TOP = 268;

const posOf = (i: number) => ({
  x: PAD_X + (i % 4) * COL_STEP,
  y: GRID_TOP + Math.floor(i / 4) * ROW_STEP,
});

/** Micro-desalineación "a mano", determinista (sin Math.random). */
const jitter = (i: number, amp: number) => Math.sin((i + 1) * 12.9898) * amp;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const MatrizSuperficies: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada del tablero completo (~12 frames) + salida por fade (~12 frames)
  const enter = spring({ frame, fps, config: SPR.settle, durationInFrames: 12 });
  const out = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const boardScale = interpolate(enter, [0, 1], [0.965, 1]);

  // Cabecera
  const head = spring({ frame: frame - 3, fps, config: SPR.snappy });
  const rule = spring({ frame: frame - 8, fps, config: SPR.soft });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        opacity: out * clamp01(enter * 1.6),
        overflow: "hidden",
      }}
    >
      {/* ── superficie de papel/pizarra: viñeta + luz cálida + fibra ───────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 95% at 24% 8%, ${PAPER_HI} 0%, ${PAPER} 58%, #14100c 100%)`,
        }}
      />
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, opacity: 0.07 }}
      >
        <defs>
          <filter id="mtz-fibra" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={3}
              seed={7}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="1920" height="1080" filter="url(#mtz-fibra)" />
      </svg>

      <AbsoluteFill
        style={{
          transform: `scale(${boardScale})`,
          transformOrigin: "50% 46%",
        }}
      >
        {/* ── cabecera ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: PAD_X,
            top: 86,
            opacity: head,
            transform: `translateY(${interpolate(head, [0, 1], [22, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: F_SANS,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 7,
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            Cualquier superficie
          </div>
          <div
            style={{
              fontFamily: F_SERIF,
              fontSize: 84,
              fontWeight: 700,
              color: CREAM,
              lineHeight: 1.02,
              marginTop: 12,
            }}
          >
            Tiempo de contacto
          </div>
        </div>

        {/* regla de tinta bajo el título */}
        <svg
          width={1920}
          height={40}
          viewBox="0 0 1920 40"
          style={{ position: "absolute", left: 0, top: 226 }}
        >
          <path
            d={`M ${PAD_X} 20 L ${1920 - PAD_X} 18`}
            stroke={CREAM}
            strokeOpacity={0.3}
            strokeWidth={3}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - interpolate(rule, [0, 1], [0, 1], {
              easing: Easing.out(Easing.cubic),
            })}
          />
        </svg>

        {/* ── celdas de superficie ─────────────────────────────────────────── */}
        {CELLS.map((c, i) => (
          <SurfaceCell
            key={c.name}
            cell={c}
            index={i}
            frame={frame}
            fps={fps}
            delay={14 + i * 6}
          />
        ))}

        {/* separador de puntos: lo de la derecha va APARTE */}
        <svg
          width={40}
          height={ROW_H + 20}
          viewBox={`0 0 40 ${ROW_H + 20}`}
          style={{
            position: "absolute",
            left: PAD_X + 3 * COL_STEP - 33,
            top: GRID_TOP + ROW_STEP - 10,
            opacity: clamp01(
              spring({ frame: frame - 52, fps, config: SPR.soft }),
            ),
          }}
        >
          <line
            x1={20}
            y1={6}
            x2={20}
            y2={ROW_H + 14}
            stroke={DANGER}
            strokeOpacity={0.75}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="3 16"
          />
        </svg>

        <BadCell frame={frame} fps={fps} delay={58} />

        {/* pie: hairline de cierre del tablero */}
        <div
          style={{
            position: "absolute",
            left: PAD_X,
            right: PAD_X,
            top: 1032,
            height: 2,
            background: `linear-gradient(90deg, ${GOLD}66, ${CREAM}22 60%, transparent)`,
            opacity: rule,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── una superficie que se ENCIENDE ────────────────────────────────────────────
const SurfaceCell: React.FC<{
  cell: Cell;
  index: number;
  frame: number;
  fps: number;
  delay: number;
}> = ({ cell, index, frame, fps, delay }) => {
  const p = spring({ frame: frame - delay, fps, config: SPR.settle });
  const lit = spring({ frame: frame - delay - 4, fps, config: SPR.soft });
  const pop = spring({ frame: frame - delay - 5, fps, config: SPR.pop });
  const { x, y } = posOf(index);

  const draw = interpolate(lit, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: COL_W,
        height: ROW_H,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.94, 1],
        )}) rotate(${jitter(index, 0.35)}deg)`,
      }}
    >
      {/* cara de la celda */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${PAPER_HI} 0%, #1d1813 100%)`,
          border: `2px solid rgba(244,234,216,${0.14 + lit * 0.1})`,
          boxShadow: `inset 0 0 0 1px rgba(27,23,18,0.9), 0 ${
            8 + lit * 6
          }px ${18 + lit * 14}px rgba(0,0,0,0.45)`,
        }}
      />
      {/* brillo de "encendido" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: lit,
          background: `radial-gradient(90% 70% at 12% 0%, rgba(217,155,62,0.20) 0%, rgba(217,155,62,0) 62%)`,
        }}
      />
      {/* barra dorada del borde izquierdo, crece al encender */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 7,
          height: `${draw * 100}%`,
          background: GOLD,
        }}
      />

      {/* contenido */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "26px 28px 24px 34px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: F_SANS,
              fontSize: 30,
              fontWeight: 800,
              color: GOLD,
              letterSpacing: 2,
              opacity: 0.9,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <svg width={30} height={30} viewBox="0 0 30 30" style={{ opacity: lit }}>
            <path
              d="M 6 16 L 12.5 22.5 L 24 8"
              fill="none"
              stroke={GOOD}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
          </svg>
        </div>

        <div
          style={{
            fontFamily: F_SERIF,
            fontSize: 46,
            fontWeight: 700,
            color: CREAM,
            lineHeight: 1.04,
            marginTop: 10,
          }}
        >
          {cell.name}
        </div>

        {/* hairline de tinta que se dibuja */}
        <div
          style={{
            marginTop: 14,
            height: 2,
            width: `${draw * 100}%`,
            background: `rgba(244,234,216,0.3)`,
          }}
        />

        <div style={{ flex: 1 }} />

        <div
          style={{
            fontFamily: F_SERIF,
            fontSize: 66,
            fontWeight: 700,
            color: GOLD,
            lineHeight: 1,
            transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`,
            transformOrigin: "0% 100%",
            opacity: pop,
          }}
        >
          {cell.time}
        </div>
        <div
          style={{
            fontFamily: F_SANS,
            fontSize: 33,
            fontWeight: 600,
            color: `rgba(244,234,216,0.82)`,
            marginTop: 10,
            opacity: pop,
          }}
        >
          {cell.tool}
        </div>
      </div>
    </div>
  );
};

// ── la excepción: en rojo, aparte ─────────────────────────────────────────────
const BadCell: React.FC<{ frame: number; fps: number; delay: number }> = ({
  frame,
  fps,
  delay,
}) => {
  const p = spring({ frame: frame - delay, fps, config: SPR.slam });
  const cross = spring({ frame: frame - delay - 6, fps, config: SPR.settle });
  const { x, y } = posOf(7);
  const draw = interpolate(cross, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: COL_W,
        height: ROW_H,
        opacity: clamp01(p),
        transform: `translateY(${interpolate(p, [0, 1], [34, 0], {
          extrapolateRight: "clamp",
        })}px) scale(${interpolate(p, [0, 1], [0.9, 1], {
          extrapolateRight: "clamp",
        })}) rotate(-1.2deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, #2b1712 0%, #21100d 100%)`,
          border: `3px solid ${DANGER}`,
          boxShadow: `0 14px 34px rgba(0,0,0,0.55), inset 0 0 60px rgba(180,71,46,0.22)`,
        }}
      />
      {/* rayado diagonal de "zona vedada" */}
      <svg
        width={COL_W}
        height={ROW_H}
        viewBox={`0 0 ${COL_W} ${ROW_H}`}
        style={{ position: "absolute", inset: 0, opacity: 0.5 * draw }}
      >
        <defs>
          <pattern
            id="mtz-hatch"
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="26"
              stroke={DANGER}
              strokeOpacity={0.55}
              strokeWidth={3}
            />
          </pattern>
        </defs>
        <rect width={COL_W} height={ROW_H} fill="url(#mtz-hatch)" />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "26px 28px 24px 30px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: F_SANS,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 4,
              color: DANGER,
              textTransform: "uppercase",
            }}
          >
            Única
          </span>
          <svg width={38} height={38} viewBox="0 0 38 38">
            <path
              d="M 9 9 L 29 29"
              stroke={DANGER}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
            <path
              d="M 29 9 L 9 29"
              stroke={DANGER}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - clamp01(draw * 1.6 - 0.6)}
            />
          </svg>
        </div>

        <div
          style={{
            fontFamily: F_SERIF,
            fontSize: 46,
            fontWeight: 700,
            color: CREAM,
            lineHeight: 1.04,
            marginTop: 10,
          }}
        >
          {BAD.name}
        </div>

        <div
          style={{
            marginTop: 14,
            height: 3,
            width: `${draw * 100}%`,
            background: DANGER,
          }}
        />

        <div style={{ flex: 1 }} />

        <div
          style={{
            fontFamily: F_SERIF,
            fontSize: 62,
            fontWeight: 700,
            color: DANGER,
            lineHeight: 1,
            letterSpacing: 1,
            transform: `scale(${interpolate(cross, [0, 1], [0.86, 1], {
              extrapolateRight: "clamp",
            })})`,
            transformOrigin: "0% 100%",
          }}
        >
          {BAD.time}
        </div>
      </div>
    </div>
  );
};
