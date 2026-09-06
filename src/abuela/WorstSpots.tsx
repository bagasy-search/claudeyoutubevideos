// WorstSpots.tsx — "los peores escondites": tablero marcado como evidencia.
// Título arriba-izquierda + filas escalonadas, cada una estampada con una ✗ ROJA
// (dos trazos que se cruzan) que SNAPEA. Rojo SÓLO en la ✗.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, rgba, enter, clamp01, PhotoBed, Kick, Head, Keyring } from "./RayStage";

export const WorstSpots: React.FC<{
  spots?: { label: string }[];
  title?: string;
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "WHERE EVERYONE LOOKS",
  title = "The first places he checks",
  spots = [
    { label: "Closet top shelf" },
    { label: "Under the mattress" },
    { label: "Nightstand & dresser drawers" },
    { label: "Behind a picture or mirror" },
    { label: "The toilet tank" },
  ],
  bed,
}) => {
  const frame = useCurrentFrame();
  const titleA = enter(frame, 10);

  const rowStart = 26;
  const rowGap = 13;
  const drift = Math.sin(frame / 170) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.68} />

      {/* viñeta */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 100% at 30% 30%, ${rgba(V.ink0, 0)} 42%, ${rgba(V.ink0, 0.74)} 100%)`,
        }}
      />

      {/* Título arriba-izquierda */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "10%",
          opacity: titleA,
          transform: `translateY(${((1 - titleA) * 16).toFixed(1)}px)`,
          maxWidth: "62%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <Keyring size={34} />
          <Kick color={V.danger}>{kicker}</Kick>
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "12px 26px 16px",
            background: rgba(V.ink0, 0.6),
            borderLeft: `6px solid ${V.brass}`,
            borderRadius: 4,
          }}
        >
          <Head size={74}>{title}</Head>
        </div>
      </div>

      {/* Las filas — tablero de evidencia */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          top: "38%",
          right: "8%",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          transform: `translateX(${drift.toFixed(2)}px)`,
        }}
      >
        {spots.map((s, i) => {
          const start = rowStart + i * rowGap;
          const rowA = enter(frame - start, 9);
          // la ✗ estampa: escala de golpe con un pequeño overshoot
          const stampT = clamp01(
            interpolate(frame, [start + 3, start + 11], [0, 1], {
              easing: Easing.out(Easing.back(2.4)),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          );
          const stampScale = interpolate(stampT, [0, 1], [0.2, 1]);
          const strokeDraw = clamp01(
            interpolate(frame, [start + 3, start + 12], [0, 1], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          );
          const XLEN = 44; // largo aprox de cada trazo de la ✗
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                opacity: rowA,
                transform: `translateX(${((1 - rowA) * -22).toFixed(1)}px)`,
              }}
            >
              {/* la ✗ roja estampada, dentro de una casilla oscura */}
              <div
                style={{
                  position: "relative",
                  width: 76,
                  height: 76,
                  flex: "0 0 auto",
                  borderRadius: 10,
                  background: rgba(V.ink0, 0.78),
                  border: `2px solid ${rgba(V.danger, 0.4)}`,
                  boxShadow: `0 6px 20px ${rgba(V.ink0, 0.7)}`,
                }}
              >
                <svg
                  viewBox="0 0 60 60"
                  width={76}
                  height={76}
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                    transformOrigin: "center",
                    transform: `scale(${stampScale.toFixed(3)}) rotate(${((1 - stampT) * -14).toFixed(1)}deg)`,
                  }}
                >
                  <line
                    x1="14"
                    y1="14"
                    x2="46"
                    y2="46"
                    stroke={V.danger}
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeDasharray={XLEN}
                    strokeDashoffset={XLEN * (1 - strokeDraw)}
                  />
                  <line
                    x1="46"
                    y1="14"
                    x2="14"
                    y2="46"
                    stroke={V.danger}
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeDasharray={XLEN}
                    strokeDashoffset={XLEN * (1 - strokeDraw)}
                  />
                </svg>
              </div>

              {/* la etiqueta del escondite */}
              <div
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: rgba(V.ink0, 0.58),
                  borderRadius: 8,
                  borderBottom: `2px solid ${rgba(V.brass, 0.32)}`,
                }}
              >
                <span
                  style={{
                    fontFamily: F_DISPLAY,
                    fontSize: 44,
                    letterSpacing: "0.008em",
                    color: V.white,
                    textShadow: `0 3px 16px ${rgba(V.ink0, 0.85)}`,
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
