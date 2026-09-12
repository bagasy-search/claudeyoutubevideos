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

// ── MitoRevelado ─────────────────────────────────────────────────────────────
// El momento MITO → VERDAD como REVELACIÓN CINEMÁTICA por capas.
//   1. Fase MITO   : foto desaturada + Ken-Burns, la frase como CITA (comillas
//                    SVG gigantes detrás), filete coral por debajo.
//   2. El TACHADO  : una línea coral se dibuja de izquierda a derecha sobre cada
//                    renglón (strokeDasharray) y el bloque se va hacia atrás en Z.
//   3. Fase VERDAD : la foto RECUPERA color con una máscara que se abre desde el
//                    centro; el texto entra escalonado por renglón, con acento
//                    teal, sobre un panel de vidrio.
//   4. Etiquetas   : arriba a la izquierda, coral o teal, NUNCA las dos a la vez.
// Todo el conjunto vive dentro de un push-in lentísimo (cámara única).
// 1920x1080 · 30 fps · determinista (cero random, cero fechas).

const INTER = loadInter().fontFamily;

const BG = "#0E1D23";
const TEAL = "#12B3AE";
const TEAL_LIGHT = "#3FE0D6";
const CREAM = "#F3ECDD";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

const W = 1920;
const H = 1080;
const SAFE = 90;

// Ancho medio de carácter en Inter 800/900, como fracción del fontSize.
const CHAR_W = 0.55;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_SOFT = Easing.bezier(0.4, 0, 0.2, 1);

// Comilla dibujada a mano (un solo "6"); el par forma la comilla completa.
const QUOTE_PATH =
  "M 62 6 C 33 14 10 36 6 62 C 2 84 15 96 33 96 C 49 96 61 84 61 68 C 61 53 50 42 36 42 C 32 42 28 43 25 45 C 31 30 45 18 66 12 Z";

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

const isText = (s?: string) => typeof s === "string" && s.replace(/\s+/g, "").length > 0;

/** Corte de renglones balanceado y determinista, con tope de líneas. */
const wrapBalanced = (text: string, target: number, maxLines: number): string[] => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length === 0) return [];
  const words = clean.split(" ");
  let lineCount = Math.ceil(clean.length / target);
  if (lineCount < 1) lineCount = 1;
  if (lineCount > maxLines) lineCount = maxLines;
  const width = Math.ceil(clean.length / lineCount);
  const lines: string[] = [];
  let cur = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const candidate = cur.length === 0 ? w : cur + " " + w;
    if (cur.length > 0 && candidate.length > width && lines.length < lineCount - 1) {
      lines.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  }
  if (cur.length > 0) lines.push(cur);
  return lines;
};

/** Elige el fontSize más grande que entra en la caja, nunca desborda. */
const fitFont = (lines: string[], base: number, maxW: number, maxH: number) => {
  let longest = 1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > longest) longest = lines[i].length;
  }
  const byWidth = maxW / (CHAR_W * longest);
  const byHeight = maxH / (Math.max(1, lines.length) * 1.16);
  const size = Math.max(26, Math.min(base, byWidth, byHeight));
  return { size, longest };
};

// ── Etiqueta de fase (coral o teal) ──────────────────────────────────────────
const PhaseTag: React.FC<{
  text: string;
  color: string;
  glow: string;
  opacity: number;
  shift: number;
}> = ({ text, color, glow, opacity, shift }) => {
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE + 42,
        top: 130,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity,
        transform: `translateX(${shift}px)`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 40,
          borderRadius: 3,
          background: color,
          boxShadow: `0 0 26px ${glow}`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 22px 10px 18px",
          borderRadius: 999,
          border: `1.5px solid ${color}66`,
          background: "rgba(10,22,28,0.52)",
        }}
      >
        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: 3,
            background: color,
            boxShadow: `0 0 16px ${glow}`,
          }}
        />
        <div
          style={{
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 5.5,
            textTransform: "uppercase",
            color: CREAM,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

// ── Comillas gigantes en SVG, detrás del texto ───────────────────────────────
const QuoteMark: React.FC<{
  size: number;
  color: string;
  opacity: number;
  closing?: boolean;
}> = ({ size, color, opacity, closing }) => (
  <svg
    width={size * 1.76}
    height={size}
    viewBox="0 0 176 100"
    style={{ transform: closing ? "rotate(180deg)" : undefined, opacity }}
  >
    <g fill={color}>
      <path d={QUOTE_PATH} />
      <path d={QUOTE_PATH} transform="translate(80 0)" />
    </g>
  </svg>
);

export const MitoRevelado: React.FC<{
  durationInFrames: number;
  myth?: string;
  truth?: string;
  image?: string;
  flipAt?: number;
  mythLabel?: string;
  truthLabel?: string;
}> = ({
  durationInFrames,
  myth,
  truth,
  image,
  flipAt,
  mythLabel = "EL MITO",
  truthLabel = "LO QUE PASA DE VERDAD",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dur = Math.max(30, Math.round(durationInFrames || 0));
  const hasMyth = isText(myth);
  const hasTruth = isText(truth);

  // ── Frame del cambio de fase, clampeado a un rango sano ────────────────────
  const requested = typeof flipAt === "number" && isFinite(flipAt) ? Math.round(flipAt) : Math.round(dur * 0.42);
  let flip = clamp(requested, Math.round(dur * 0.2), Math.round(dur * 0.75));
  if (!hasMyth) flip = 0; // sin mito: arranca ya en la verdad
  if (!hasTruth) flip = dur + 60; // sin verdad: nunca cambia de fase

  // ── Cámara: un solo push-in, lentísimo, sobre TODO el conjunto ─────────────
  const cam = interpolate(frame, [0, dur], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  const camDrift = interpolate(frame, [0, dur], [6, -6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });

  // ── Ken-Burns de la foto (idéntico en las dos capas para que casen) ────────
  const kbScale = interpolate(frame, [0, dur], [1.1, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  const kbX = interpolate(frame, [0, dur], [-16, 16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  const kbY = interpolate(frame, [0, dur], [10, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SOFT,
  });
  const kbTransform = `translate3d(${kbX}px, ${kbY}px, 0) scale(${kbScale})`;

  // ── Barrido de color: la máscara se abre desde el centro ───────────────────
  const wipe = hasTruth
    ? interpolate(frame, [flip, flip + 30], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_IN_OUT,
      })
    : 0;
  const wipeEdge = interpolate(wipe, [0, 0.08, 0.88, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const halfWipe = (wipe * W) / 2;

  // ── Texto del MITO ─────────────────────────────────────────────────────────
  const mythBlockW = 1500;
  const mythLines = React.useMemo(
    () => (hasMyth ? wrapBalanced(myth as string, 30, 4) : []),
    [hasMyth, myth]
  );
  const mythFit = React.useMemo(
    () => fitFont(mythLines, 84, mythBlockW, 420),
    [mythLines]
  );
  const mythLH = mythFit.size * 1.16;
  const mythH = mythLines.length * mythLH;

  // ── Texto de la VERDAD ─────────────────────────────────────────────────────
  const truthBlockW = 1440;
  const truthLines = React.useMemo(
    () => (hasTruth ? wrapBalanced(truth as string, 34, 4) : []),
    [hasTruth, truth]
  );
  const truthFit = React.useMemo(
    () => fitFont(truthLines, 74, truthBlockW, 360),
    [truthLines]
  );
  const truthLH = truthFit.size * 1.17;
  const truthH = truthLines.length * truthLH;

  // ── Entrada del mito ───────────────────────────────────────────────────────
  const mythIn = spring({ frame, fps, config: { damping: 20, stiffness: 88, mass: 1 } });

  // ── Tachado: se dibuja de izquierda a derecha, renglón por renglón ─────────
  const strikeStart = clamp(flip - 26, 8, Math.max(9, dur - 4));
  const strikeSpan = 13;

  // ── Retroceso en Z del bloque del mito ─────────────────────────────────────
  const recede = hasTruth
    ? interpolate(frame, [flip, flip + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_IN_OUT,
      })
    : 0;
  const mythScale = interpolate(mythIn, [0, 1], [0.955, 1]) * interpolate(recede, [0, 1], [1, 0.8]);
  const mythZ = interpolate(recede, [0, 1], [0, -260]);
  const mythOpacity = mythIn * (1 - recede);
  const mythBlur = Math.max(0, interpolate(mythIn, [0, 1], [10, 0]) + recede * 16);
  const mythSat = interpolate(recede, [0, 1], [1, 0.1]);

  // ── Entrada de la verdad ───────────────────────────────────────────────────
  const truthStart = flip + 5;
  const panelS = spring({
    frame: frame - truthStart,
    fps,
    config: { damping: 21, stiffness: 92, mass: 1 },
  });
  const panelW = Math.min(1620, truthBlockW + 130);
  const panelH = Math.min(H - SAFE * 2 - 150, truthH + 130);

  const showMythLayer = hasMyth && mythOpacity > 0.003;
  const showTruthLayer = hasTruth && panelS > 0.003;

  // ── Etiquetas: nunca las dos a la vez ──────────────────────────────────────
  // Se construye con DOS rampas independientes (cada rango siempre creciente),
  // así ningún `flipAt` raro rompe el interpolate.
  const tagMythOp = hasMyth
    ? interpolate(frame, [4, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT,
      }) *
      interpolate(frame, [flip, flip + 7], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT,
      })
    : 0;
  const tagTruthOp = hasTruth
    ? interpolate(frame, [flip + 8, flip + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT,
      })
    : 0;
  const tagMythShift = interpolate(tagMythOp, [0, 1], [-22, 0]);
  const tagTruthShift = interpolate(tagTruthOp, [0, 1], [-22, 0]);

  const src = isText(image) ? staticFile(image as string) : null;

  const photoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: kbTransform,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: INTER, overflow: "hidden" }}>
      {/* ── CÁMARA ÚNICA: push-in lentísimo sobre todo el conjunto ─────────── */}
      <AbsoluteFill
        style={{
          overflow: "hidden",
          transform: `scale(${cam}) translateY(${camDrift}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* ── FONDO base: apagado, desaturado ─────────────────────────────── */}
        <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
          {src ? (
            <Img
              src={src}
              style={{ ...photoStyle, filter: "saturate(0.16) brightness(0.42) contrast(1.06)" }}
            />
          ) : (
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 34%, #1B333B 0%, #12242B 46%, #0A161B 100%)",
                transform: kbTransform,
              }}
            />
          )}
        </AbsoluteFill>

        {/* ── FONDO revelado: color y luz, con máscara que se abre del centro ─ */}
        <AbsoluteFill
          style={{
            overflow: "hidden",
            clipPath: `inset(0% ${(1 - wipe) * 50}% 0% ${(1 - wipe) * 50}%)`,
          }}
        >
          {src ? (
            <Img
              src={src}
              style={{ ...photoStyle, filter: "saturate(1.14) brightness(0.86) contrast(1.04)" }}
            />
          ) : (
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 34%, #1D4C50 0%, #12333A 48%, #0C1E25 100%)",
                transform: kbTransform,
              }}
            />
          )}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(18,179,174,0.16) 0%, rgba(14,29,35,0.05) 42%, rgba(14,29,35,0.55) 100%)`,
            }}
          />
        </AbsoluteFill>

        {/* Filos luminosos de la máscara mientras barre */}
        {wipeEdge > 0.01 ? (
          <AbsoluteFill style={{ opacity: wipeEdge * 0.9 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: W / 2 - halfWipe - 2,
                width: 4,
                background: TEAL_LIGHT,
                boxShadow: `0 0 60px 12px ${TEAL}88`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: W / 2 + halfWipe - 2,
                width: 4,
                background: TEAL_LIGHT,
                boxShadow: `0 0 60px 12px ${TEAL}88`,
              }}
            />
          </AbsoluteFill>
        ) : null}

        {/* Grado + viñeta + textura fina (determinista) */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(78% 62% at 50% 48%, rgba(14,29,35,0) 0%, rgba(9,18,23,0.62) 72%, rgba(6,13,17,0.9) 100%)`,
          }}
        />
        <AbsoluteFill
          style={{
            opacity: 0.06,
            background:
              "repeating-linear-gradient(0deg, rgba(243,236,221,0.5) 0px, rgba(243,236,221,0.5) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)",
          }}
        />

        {/* ── CONTENIDO ───────────────────────────────────────────────────── */}
        <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 50%" }}>
          {/* ── FASE MITO ─────────────────────────────────────────────────── */}
          {showMythLayer ? (
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                opacity: mythOpacity,
                filter: `blur(${mythBlur}px) saturate(${mythSat})`,
                transform: `translateZ(${mythZ}px) scale(${mythScale})`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: mythBlockW,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Comillas gigantes, tenues, DETRÁS del texto */}
                <div
                  style={{
                    position: "absolute",
                    left: 4,
                    top: -112,
                    pointerEvents: "none",
                  }}
                >
                  <QuoteMark size={200} color={AMBER} opacity={0.1 * mythIn} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 4,
                    top: Math.max(60, mythH - 128),
                    pointerEvents: "none",
                  }}
                >
                  <QuoteMark size={200} color={CORAL} opacity={0.11 * mythIn} closing />
                </div>

                {/* Renglones del mito */}
                <div style={{ position: "relative", width: "100%" }}>
                  {mythLines.map((ln, i) => {
                    const s = spring({
                      frame: frame - i * 4,
                      fps,
                      config: { damping: 22, stiffness: 92, mass: 1 },
                    });
                    return (
                      <div
                        key={`m-${i}`}
                        style={{
                          height: mythLH,
                          lineHeight: `${mythLH}px`,
                          textAlign: "center",
                          fontSize: mythFit.size,
                          fontWeight: 900,
                          letterSpacing: -0.6,
                          color: CREAM,
                          opacity: s,
                          transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
                          textShadow: "0 18px 46px rgba(0,0,0,0.72)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ln}
                      </div>
                    );
                  })}

                  {/* EL TACHADO: se dibuja de izquierda a derecha, renglón a renglón */}
                  <svg
                    width={mythBlockW}
                    height={Math.max(1, mythH)}
                    viewBox={`0 0 ${mythBlockW} ${Math.max(1, mythH)}`}
                    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
                  >
                    {mythLines.map((ln, i) => {
                      const lw = Math.min(
                        mythBlockW,
                        ln.length * CHAR_W * mythFit.size + 26
                      );
                      const x1 = (mythBlockW - lw) / 2;
                      const y = i * mythLH + mythLH * 0.54;
                      const p = interpolate(
                        frame,
                        [strikeStart + i * 4, strikeStart + i * 4 + strikeSpan],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
                      );
                      if (p <= 0.001) return null;
                      return (
                        <line
                          key={`s-${i}`}
                          x1={x1}
                          y1={y + 3}
                          x2={x1 + lw}
                          y2={y - 3}
                          stroke={CORAL}
                          strokeWidth={Math.max(5, mythFit.size * 0.1)}
                          strokeLinecap="round"
                          strokeDasharray={lw}
                          strokeDashoffset={lw * (1 - p)}
                          opacity={0.96}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Filete coral por debajo de la cita */}
                <div
                  style={{
                    marginTop: 40,
                    width: Math.min(
                      mythBlockW,
                      mythFit.longest * CHAR_W * mythFit.size * 0.72 + 120
                    ),
                    height: 5,
                    borderRadius: 3,
                    background: `linear-gradient(90deg, rgba(224,82,62,0) 0%, ${CORAL} 22%, ${CORAL} 78%, rgba(224,82,62,0) 100%)`,
                    boxShadow: `0 0 34px ${CORAL}70`,
                    transform: `scaleX(${interpolate(mythIn, [0, 1], [0.22, 1])})`,
                    opacity: mythIn,
                  }}
                />
              </div>
            </AbsoluteFill>
          ) : null}

          {/* ── FASE VERDAD ───────────────────────────────────────────────── */}
          {showTruthLayer ? (
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                opacity: Math.min(1, panelS * 1.15),
                transform: `translateZ(${interpolate(panelS, [0, 1], [-170, 0])}px) scale(${interpolate(
                  panelS,
                  [0, 1],
                  [0.94, 1]
                )})`,
              }}
            >
              <div style={{ position: "relative", width: panelW, height: panelH }}>
                {/* Panel de vidrio que separa el texto del fondo */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 34,
                    background:
                      "linear-gradient(158deg, rgba(243,236,221,0.11) 0%, rgba(14,29,35,0.5) 58%, rgba(10,22,27,0.66) 100%)",
                    border: `1.5px solid ${TEAL}4D`,
                    boxShadow: `0 46px 130px rgba(0,0,0,0.58), inset 0 1px 0 rgba(243,236,221,0.16)`,
                    backdropFilter: "blur(20px) saturate(1.18)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.18)",
                    transform: `scaleY(${interpolate(panelS, [0, 1], [0.9, 1])})`,
                  }}
                />
                {/* Filete teal superior del panel */}
                <div
                  style={{
                    position: "absolute",
                    left: 60,
                    right: 60,
                    top: 0,
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, rgba(63,224,214,0) 0%, ${TEAL_LIGHT} 50%, rgba(63,224,214,0) 100%)`,
                    opacity: panelS,
                    transform: `scaleX(${interpolate(panelS, [0, 1], [0.3, 1])})`,
                  }}
                />

                {/* Renglones de la verdad, escalonados */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 64px",
                  }}
                >
                  {truthLines.map((ln, i) => {
                    const s = spring({
                      frame: frame - (truthStart + 4 + i * 5),
                      fps,
                      config: { damping: 21, stiffness: 96, mass: 1 },
                    });
                    return (
                      <div
                        key={`t-${i}`}
                        style={{
                          height: truthLH,
                          lineHeight: `${truthLH}px`,
                          textAlign: "center",
                          fontSize: truthFit.size,
                          fontWeight: 800,
                          letterSpacing: -0.4,
                          color: CREAM,
                          opacity: s,
                          filter: `blur(${Math.max(0, interpolate(s, [0, 1], [9, 0]))}px)`,
                          transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                          textShadow: "0 16px 40px rgba(0,0,0,0.6)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ln}
                      </div>
                    );
                  })}
                </div>

                {/* Acento teal a la izquierda del panel */}
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    top: panelH * 0.24,
                    width: 5,
                    height: panelH * 0.52,
                    borderRadius: 3,
                    background: `linear-gradient(180deg, ${TEAL_LIGHT}, ${TEAL})`,
                    boxShadow: `0 0 30px ${TEAL}88`,
                    opacity: panelS,
                    transform: `scaleY(${interpolate(panelS, [0, 1], [0.2, 1])})`,
                  }}
                />
              </div>
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>

        {/* ── ETIQUETAS DE FASE (nunca las dos a la vez) ───────────────────── */}
        <AbsoluteFill>
          <PhaseTag
            text={mythLabel}
            color={CORAL}
            glow={`${CORAL}80`}
            opacity={tagMythOp}
            shift={tagMythShift}
          />
          <PhaseTag
            text={truthLabel}
            color={TEAL_LIGHT}
            glow={`${TEAL}88`}
            opacity={tagTruthOp}
            shift={tagTruthShift}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Viñeta final, fuera de la cámara: sella los bordes del cuadro */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(96% 76% at 50% 50%, rgba(0,0,0,0) 58%, rgba(4,10,13,0.55) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export default MitoRevelado;
