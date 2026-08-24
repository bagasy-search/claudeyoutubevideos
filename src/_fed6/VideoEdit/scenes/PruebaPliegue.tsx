import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── PruebaPliegue — comparación cinemática lado a lado con cronómetro ────────
// "La prueba del pliegue": se pellizca la piel del dorso de la mano y se cuenta
// cuánto tarda en volver. A los 30 vuelve al instante; a los 60 y tantos tarda
// segundos. Pantalla partida por una JUNTA DIAGONAL SUAVE (curva, no recta),
// cada mitad con su foto en Ken-Burns opuesto, su rótulo arriba y su cronómetro
// circular abajo. El izquierdo se completa casi al instante y hace TIC; el
// derecho se llena lento contando segundos. Al terminar entra el remate en una
// tarjeta de vidrio que cruza la junta.
//
// Todos los tiempos son FRACCIONES de durationInFrames (nunca frames absolutos).
// Si falta una imagen, esa mitad cae a un panel de color (jamás staticFile(undefined)).

const INTER = loadInter().fontFamily;

const BG = "#0E1D23";
const TEAL = "#12B3AE";
const TEAL_LT = "#3FE0D6";
const CREAM = "#F3ECDD";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IO = Easing.inOut(Easing.quad);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// rampa 0→1 entre dos frames, siempre con easing (nunca lineal)
const ramp = (
  frame: number,
  a: number,
  b: number,
  easing: (n: number) => number = EASE_OUT,
) =>
  interpolate(frame, [a, Math.max(a + 1, b)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// ── Cronómetro circular (SVG, strokeDasharray) ──────────────────────────────
const Dial: React.FC<{
  progress: number; // 0..1 de llenado
  seconds: number; // tope del contador
  color: string;
  appear: number; // 0..1 entrada
  pulse: number; // 0..1 anillo de acento al completar
  breathe: number; // 0..1 latido cuando sigue corriendo
  caption: string;
}> = ({ progress, seconds, color, appear, pulse, breathe, caption }) => {
  const SIZE = 268;
  const R = 104;
  const CIRC = 2 * Math.PI * R;
  const p = clamp01(progress);
  const shown = p >= 1 ? seconds : Math.floor(p * seconds);

  return (
    <div
      style={{
        width: SIZE,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: appear,
        transform: `translateY(${(1 - appear) * 26}px) scale(${0.94 + appear * 0.06})`,
      }}
    >
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {/* disco de fondo */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R + 16}
            fill="rgba(6,16,20,0.52)"
            stroke="rgba(243,236,221,0.10)"
            strokeWidth={1}
          />
          {/* pista */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(243,236,221,0.14)"
            strokeWidth={13}
          />
          {/* anillo de acento al completar (tic) */}
          {pulse > 0 ? (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R + 6 + pulse * 30}
              fill="none"
              stroke={color}
              strokeWidth={4 - pulse * 3}
              opacity={(1 - pulse) * 0.85}
            />
          ) : null}
          {/* llenado */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={`${CIRC * p} ${CIRC}`}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            opacity={0.95}
            style={{
              filter: `drop-shadow(0 0 ${10 + breathe * 14}px ${color})`,
            }}
          />
          {/* marcas cada 30° */}
          {Array.from({ length: 12 }, (_, i) => i).map((i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const r1 = R - 26;
            const r2 = R - 17;
            return (
              <line
                key={i}
                x1={SIZE / 2 + Math.cos(a) * r1}
                y1={SIZE / 2 + Math.sin(a) * r1}
                x2={SIZE / 2 + Math.cos(a) * r2}
                y2={SIZE / 2 + Math.sin(a) * r2}
                stroke="rgba(243,236,221,0.22)"
                strokeWidth={i % 3 === 0 ? 3 : 2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* número */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIZE,
            height: SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: INTER,
                fontSize: 104,
                fontWeight: 800,
                color: CREAM,
                letterSpacing: -4,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                textShadow: "0 6px 26px rgba(0,0,0,0.55)",
              }}
            >
              {shown}
            </span>
            <span
              style={{
                fontFamily: INTER,
                fontSize: 38,
                fontWeight: 700,
                color,
                marginLeft: 6,
                lineHeight: 1,
              }}
            >
              s
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: INTER,
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: 4,
          color: "rgba(243,236,221,0.74)",
          marginTop: 16,
          textAlign: "center",
          whiteSpace: "nowrap",
          textShadow: "0 3px 14px rgba(0,0,0,0.7)",
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// ── Mitad (foto en Ken-Burns o panel de color de respaldo) ──────────────────
const HalfPlate: React.FC<{
  image?: string;
  label: string;
  accent: string;
  zoom: number; // escala Ken-Burns
  panX: number;
  panY: number;
}> = ({ image, label, accent, zoom, panX, panY }) => {
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
      }}
    >
      {image ? (
        <Img
          src={staticFile(image)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: `linear-gradient(150deg, ${accent}2E 0%, #10242B 46%, #08151A 100%)`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: INTER,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -3,
              color: "rgba(243,236,221,0.10)",
              textAlign: "center",
              padding: "0 60px",
              lineHeight: 1.02,
            }}
          >
            {label}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const PruebaPliegue: React.FC<{
  durationInFrames: number;
  leftImage?: string;
  rightImage?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftSeconds?: number;
  rightSeconds?: number;
  verdict?: string;
}> = ({
  durationInFrames,
  leftImage,
  rightImage,
  leftLabel = "A LOS 30",
  rightLabel = "A LOS 60 Y TANTOS",
  leftSeconds = 0,
  rightSeconds = 3,
  verdict = "La malla de abajo perdió el resorte",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const D = Math.max(1, durationInFrames);
  const t = (f: number) => D * f; // fracción → frame

  // ── entradas ──────────────────────────────────────────────────────────────
  const inL = ramp(frame, t(0.0), t(0.16));
  const inR = ramp(frame, t(0.04), t(0.2));
  const labL = ramp(frame, t(0.08), t(0.22));
  const labR = ramp(frame, t(0.12), t(0.26));
  const dialIn = ramp(frame, t(0.16), t(0.3));

  // ── cronómetros ───────────────────────────────────────────────────────────
  // izquierda: se completa casi al instante y se detiene con un tic de acento
  const pLeft = ramp(frame, t(0.3), t(0.35), EASE_OUT);
  const tickPulse = ramp(frame, t(0.35), t(0.45), Easing.out(Easing.quad));
  const tickAlive = frame >= t(0.35) && frame <= t(0.45) ? tickPulse : 0;

  // derecha: se llena lento y sigue corriendo
  const pRight = ramp(frame, t(0.32), t(0.74), EASE_IO);
  const rightDone = pRight >= 1;
  const breathe = rightDone ? 0.5 + 0.5 * Math.sin((frame - t(0.74)) / 6) : 0;

  // ── remate ────────────────────────────────────────────────────────────────
  const verdictSp = spring({
    frame: frame - Math.round(t(0.78)),
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.9 },
    durationInFrames: Math.max(12, Math.round(D * 0.16)),
  });
  const dim = verdictSp * 0.3; // las mitades bajan cuando entra el remate

  // ── junta diagonal suave (curva coseno) + deriva animada ──────────────────
  const drift = Math.sin(frame / 96) * 9 + ramp(frame, t(0.0), t(1.0), EASE_IO) * 14 - 7;
  const mid = width / 2 + drift;
  const TILT = 118;
  const STEPS = 20;
  const seam = Array.from({ length: STEPS + 1 }, (_, i) => {
    const y = (i / STEPS) * height;
    const x = mid + (TILT / 2) * Math.cos((y / height) * Math.PI);
    return { x, y };
  });
  const seamStr = seam.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`);
  const clipLeft = `polygon(0px 0px, ${seamStr.join(", ")}, 0px ${height}px)`;
  const clipRight = `polygon(${width}px 0px, ${width}px ${height}px, ${seamStr
    .slice()
    .reverse()
    .join(", ")})`;
  const seamPoints = seam.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const seamGlow = 0.55 + 0.45 * Math.sin(frame / 22);

  // ── Ken-Burns opuestos ────────────────────────────────────────────────────
  const kb = ramp(frame, 0, D, EASE_IO);
  const zoomL = interpolate(kb, [0, 1], [1.16, 1.05]);
  const panLX = interpolate(kb, [0, 1], [26, -18]);
  const panLY = interpolate(kb, [0, 1], [14, -10]);
  const zoomR = interpolate(kb, [0, 1], [1.05, 1.17]);
  const panRX = interpolate(kb, [0, 1], [-24, 20]);
  const panRY = interpolate(kb, [0, 1], [-12, 12]);

  const LABEL_TOP = 104;
  const DIAL_TOP = 636;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: INTER }}>
      {/* ── mitad izquierda ── */}
      <AbsoluteFill
        style={{
          clipPath: clipLeft,
          opacity: inL,
          transform: `translateX(${(1 - inL) * -52}px)`,
        }}
      >
        <HalfPlate
          image={leftImage}
          label={leftLabel}
          accent={TEAL}
          zoom={zoomL}
          panX={panLX}
          panY={panLY}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg, rgba(9,32,38,0.30) 0%, rgba(9,32,38,0.10) 46%, rgba(6,20,25,0.72) 100%)`,
          }}
        />
      </AbsoluteFill>

      {/* ── mitad derecha ── */}
      <AbsoluteFill
        style={{
          clipPath: clipRight,
          opacity: inR,
          transform: `translateX(${(1 - inR) * 52}px)`,
        }}
      >
        <HalfPlate
          image={rightImage}
          label={rightLabel}
          accent={CORAL}
          zoom={zoomR}
          panX={panRX}
          panY={panRY}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(255deg, rgba(30,14,11,0.30) 0%, rgba(20,12,10,0.12) 46%, rgba(24,10,8,0.74) 100%)`,
          }}
        />
      </AbsoluteFill>

      {/* ── viñeta + gradación oscura hacia el centro y hacia arriba/abajo ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 38%, rgba(3,11,14,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to right, rgba(4,14,18,0) 22%, rgba(4,14,18,0.52) 50%, rgba(4,14,18,0) 78%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,14,18,0.80) 0%, rgba(4,14,18,0.10) 26%, rgba(4,14,18,0.18) 54%, rgba(4,14,18,0.86) 100%)",
        }}
      />

      {/* atenuado global cuando entra el remate */}
      <AbsoluteFill style={{ backgroundColor: `rgba(4,14,18,${dim})` }} />

      {/* ── filete luminoso de la junta ── */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <polyline
          points={seamPoints}
          fill="none"
          stroke="rgba(4,14,18,0.55)"
          strokeWidth={9}
        />
        <polyline
          points={seamPoints}
          fill="none"
          stroke={TEAL_LT}
          strokeWidth={2}
          opacity={0.32 + 0.34 * seamGlow}
          style={{ filter: `drop-shadow(0 0 ${8 + seamGlow * 10}px ${TEAL})` }}
        />
      </svg>

      {/* ── rótulo izquierdo ── */}
      <div
        style={{
          position: "absolute",
          left: 132,
          top: LABEL_TOP,
          width: 600,
          opacity: labL,
          transform: `translateY(${(1 - labL) * 18}px)`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 6,
            color: TEAL_LT,
            marginBottom: 12,
          }}
        >
          PRUEBA DEL PLIEGUE
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 800,
            letterSpacing: -1.5,
            color: CREAM,
            lineHeight: 1.04,
            textShadow: "0 8px 30px rgba(0,0,0,0.72)",
          }}
        >
          {leftLabel}
        </div>
        <div
          style={{
            marginTop: 18,
            height: 4,
            width: 90 + labL * 150,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${TEAL_LT}, rgba(63,224,214,0))`,
          }}
        />
      </div>

      {/* ── rótulo derecho ── */}
      <div
        style={{
          position: "absolute",
          right: 132,
          top: LABEL_TOP,
          width: 600,
          textAlign: "right",
          opacity: labR,
          transform: `translateY(${(1 - labR) * 18}px)`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 6,
            color: AMBER,
            marginBottom: 12,
          }}
        >
          MISMA PRUEBA
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 800,
            letterSpacing: -1.5,
            color: CREAM,
            lineHeight: 1.04,
            textShadow: "0 8px 30px rgba(0,0,0,0.72)",
          }}
        >
          {rightLabel}
        </div>
        <div
          style={{
            marginTop: 18,
            marginLeft: "auto",
            height: 4,
            width: 90 + labR * 150,
            borderRadius: 3,
            background: `linear-gradient(270deg, ${CORAL}, rgba(224,82,62,0))`,
          }}
        />
      </div>

      {/* ── cronómetro izquierdo ── */}
      <div style={{ position: "absolute", left: 300, top: DIAL_TOP }}>
        <Dial
          progress={pLeft}
          seconds={leftSeconds}
          color={TEAL_LT}
          appear={dialIn}
          pulse={tickAlive}
          breathe={0}
          caption="VUELVE AL INSTANTE"
        />
      </div>

      {/* ── cronómetro derecho ── */}
      <div style={{ position: "absolute", right: 300, top: DIAL_TOP }}>
        <Dial
          progress={pRight}
          seconds={rightSeconds}
          color={CORAL}
          appear={dialIn}
          pulse={0}
          breathe={breathe}
          caption={rightDone ? "SIGUE MARCADA" : "TODAVIA MARCADA"}
        />
      </div>

      {/* ── remate en tarjeta de vidrio cruzando la junta ── */}
      {verdictSp > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: width / 2 - 620,
            top: 392,
            width: 1240,
            opacity: Math.min(1, verdictSp * 1.25),
            transform: `translateY(${(1 - verdictSp) * 30}px) scale(${0.965 + verdictSp * 0.035})`,
          }}
        >
          <div
            style={{
              background: "rgba(7,20,25,0.66)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(243,236,221,0.16)",
              borderRadius: 26,
              padding: "42px 60px 46px",
              boxShadow: "0 34px 90px rgba(0,0,0,0.55)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: 6,
                color: AMBER,
                marginBottom: 18,
              }}
            >
              LO QUE ESTA PRUEBA MIDE
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 800,
                letterSpacing: -1.6,
                lineHeight: 1.12,
                color: CREAM,
              }}
            >
              {verdict}
            </div>
            <div
              style={{
                margin: "26px auto 0",
                height: 3,
                width: 120 + verdictSp * 180,
                borderRadius: 3,
                background: `linear-gradient(90deg, rgba(63,224,214,0), ${TEAL}, rgba(224,82,62,0.9))`,
              }}
            />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
