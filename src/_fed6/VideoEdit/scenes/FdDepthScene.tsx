import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/* ============================================================================
 * FdDepthScene — ESCENA DE PROFUNDIDAD (beats de MECANISMO) · look clínico _fed6
 * ----------------------------------------------------------------------------
 * Tres capas REALES con parallax independiente (lo que en AE serían tres nulos a
 * distinta Z), no un fondo con un texto encima:
 *
 *   (1) FONDO   — foto a pantalla completa, blureada + oscurecida, push-in lento.
 *                 Deriva HORIZONTAL lenta (la capa más lejana se mueve menos).
 *   (2) MEDIO   — TARJETA FLOTANTE con la foto principal: sombra profunda, borde
 *                 de vidrio (doble inset: highlight arriba, sombra abajo), su
 *                 propio ken-burns adentro y un BARRIDO DE LUZ cálido que la cruza
 *                 UNA sola vez. Flota con un bob sinusoidal determinista.
 *   (3) FRENTE  — eyebrow + título grande + línea de apoyo, con scrim de tinta
 *                 atrás (legibilidad para público mayor) y parallax MÁS RÁPIDO.
 *                 Al entrar el texto se hace RACK-FOCUS: el fondo se desenfoca
 *                 más y la tarjeta termina de "encontrar foco" (blur → 0).
 *
 * Todo el timing sale de durationInFrames (entrada ~16f, salida ~12f) y aguanta
 * de 4s a 14s. Cero Math.random()/Date.now(): el seed sale del texto+ruta, así
 * los 60 chunks del render distribuido dan exactamente lo mismo.
 * 1920×1080 @ 30fps. Sin dependencias fuera de react/remotion/google-fonts.
 * ========================================================================== */

const INTER = loadInter().fontFamily;
const FONT = `${INTER}, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

/* --------------------------------- paleta -------------------------------- */
const C = {
  paper: "#F4F7F9",
  ink: "#14232B",
  teal: "#109C99",
  tealBright: "#12B3AE",
  coral: "#E0523E",
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TAU = Math.PI * 2;

const VIDEO_RE = /\.(mp4|webm|mov)$/i;

/** hash determinista de un string → entero estable (mismo valor en cada chunk) */
const hashOf = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

/** Img o clip, ya resuelto con staticFile(). Nunca deja hueco: si no hay src,
 *  el llamador dibuja el fallback (gradiente + textura), no este helper. */
const Layer: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => {
  if (VIDEO_RE.test(src)) {
    return <OffthreadVideo src={staticFile(src)} style={style} muted playbackRate={0.6} />;
  }
  return <Img src={staticFile(src)} style={style} />;
};

/** Fallback elegante: gradiente clínico + textura de grilla + halo del acento.
 *  Se usa cuando falta la foto — jamás un rectángulo negro. */
const FallbackSurface: React.FC<{ accent: string; dark?: boolean; style?: React.CSSProperties }> = ({
  accent,
  dark = false,
  style,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: dark
        ? `linear-gradient(150deg, ${C.ink} 0%, #0C171D 58%, #081116 100%)`
        : `linear-gradient(150deg, #FFFFFF 0%, ${C.paper} 55%, #DCE6EA 100%)`,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(120% 90% at 28% 22%, ${accent}${dark ? "3A" : "2E"}, rgba(0,0,0,0) 62%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: dark
          ? "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)"
          : "linear-gradient(rgba(20,35,43,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,43,0.06) 1px, transparent 1px)",
        backgroundSize: "54px 54px",
        opacity: 0.85,
      }}
    />
  </div>
);

export type FdDepthProps = {
  durationInFrames: number;
  image: string; // foto principal ("img/fd123.png" | "vid/fd123.mp4")
  back?: string; // foto de fondo; si falta se reusa `image`
  eyebrow?: string;
  title: string;
  sub?: string;
  side?: "left" | "right"; // de qué lado va la tarjeta
  tone?: "teal" | "warn";
};

export const FdDepthScene: React.FC<FdDepthProps> = ({
  durationInFrames,
  image,
  back,
  eyebrow,
  title,
  sub,
  side = "right",
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = tone === "warn" ? C.coral : C.tealBright;
  const accentDeep = tone === "warn" ? "#B83F2E" : C.teal;

  const D = Math.max(24, durationInFrames);
  const IN = 16;
  const OUT = 12;

  // seed estable (texto + rutas) → varía fase del bob y origen de cámara sin azar
  const seed = hashOf(`${title}|${image}|${back || ""}`);
  const phase = ((seed % 360) / 360) * TAU;
  const dir = side === "right" ? 1 : -1; // hacia dónde "viaja" la cámara

  /* ------------------------------ tiempos ------------------------------- */
  const tEyebrow = 6;
  const tTitle = 12;
  const tSub = 22;
  // el rack-focus acompaña la entrada del título
  const rackFrom = tTitle;
  const rackTo = tTitle + 18;
  // barrido de luz: cruza UNA vez, en el primer tercio útil, con largo relativo
  const sweepLen = Math.max(26, Math.min(46, Math.round(D * 0.3)));
  const sweepStart = Math.min(IN + 12, Math.max(10, Math.round(D * 0.18)));
  const sweepEnd = sweepStart + sweepLen;

  /* ---------------------- progreso global (nunca quieto) ----------------- */
  const t = interpolate(frame, [0, D], [0, 1], CLAMP); // 0→1 en toda la escena
  const outP = interpolate(frame, [D - OUT, D], [0, 1], CLAMP);
  const inP = interpolate(frame, [0, IN], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const alive = 1 - outP;

  /* -------------------------- (1) FONDO — capa lejana -------------------- */
  const backSrc = back || image;
  const bgScale = interpolate(t, [0, 1], [1.14, 1.26]); // push-in lento continuo
  const bgX = interpolate(t, [0, 1], [0, -30 * dir]); // parallax MÁS LENTO
  const bgY = interpolate(t, [0, 1], [0, -12]);
  // RACK-FOCUS: el fondo pierde foco cuando entra el texto
  const bgBlur = interpolate(frame, [0, rackFrom, rackTo], [9, 9, 22], CLAMP);
  const bgDark = interpolate(frame, [0, rackFrom, rackTo], [0.5, 0.5, 0.64], CLAMP);
  const bgOp = interpolate(inP, [0, 1], [0, 1]) * alive;

  /* -------------------------- (2) MEDIO — la tarjeta --------------------- */
  const CARD_W = 806;
  const CARD_H = 908;
  const cardX = side === "right" ? 1920 - CARD_W - 96 : 96;
  const cardY = (1080 - CARD_H) / 2;

  const cardS = spring({ frame: frame - 3, fps, config: { damping: 17, mass: 0.85, stiffness: 108 } });
  const cardIn = interpolate(cardS, [0, 1], [86 * dir, 0]);
  const cardPar = interpolate(t, [0, 1], [0, -58 * dir]); // parallax MEDIO
  const bob = Math.sin(phase + t * TAU * 0.85) * 9; // flotación viva, determinista
  const cardTilt = interpolate(cardS, [0, 1], [1.6 * dir, 0]) + Math.sin(phase + t * TAU * 0.6) * 0.22;
  const cardScale = interpolate(cardS, [0, 1], [0.94, 1]) * interpolate(outP, [0, 1], [1, 0.965]);
  const cardBlur = interpolate(frame, [rackFrom - 4, rackTo], [5, 0], CLAMP); // encuentra foco
  const cardOp = cardS * alive;

  // ken-burns PROPIO adentro de la tarjeta (más rápido que el fondo)
  const kbScale = interpolate(t, [0, 1], [1.08, 1.19]);
  const kbX = interpolate(t, [0, 1], [0, 26 * dir]);
  const kbY = interpolate(t, [0, 1], [8, -14]);

  const sweepP = interpolate(frame, [sweepStart, sweepEnd], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const sweepOp = interpolate(sweepP, [0, 0.12, 0.82, 1], [0, 0.9, 0.72, 0], CLAMP);

  /* -------------------------- (3) FRENTE — el texto ---------------------- */
  const TEXT_W = 760;
  const textX = side === "right" ? 110 : 1920 - TEXT_W - 110;
  const textPar = interpolate(t, [0, 1], [0, -96 * dir]); // parallax MÁS RÁPIDO

  const eyeS = spring({ frame: frame - tEyebrow, fps, config: { damping: 19, mass: 0.6, stiffness: 130 } });
  const titS = spring({ frame: frame - tTitle, fps, config: { damping: 18, mass: 0.7, stiffness: 118 } });
  const subS = spring({ frame: frame - tSub, fps, config: { damping: 20, mass: 0.6, stiffness: 126 } });

  const len = title.length;
  const titleSize = len > 74 ? 58 : len > 52 ? 68 : len > 34 ? 78 : 88;

  const scrimEdge = side === "right" ? "to right" : "to left";

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, fontFamily: FONT, overflow: "hidden" }}>
      {/* ═══════════ (1) FONDO ═══════════ */}
      <AbsoluteFill
        style={{
          opacity: bgOp,
          transform: `translate3d(${bgX}px, ${bgY}px, 0) scale(${bgScale})`,
          filter: `blur(${bgBlur}px) saturate(0.86)`,
        }}
      >
        {backSrc ? (
          <Layer src={backSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <FallbackSurface accent={accent} dark />
        )}
      </AbsoluteFill>
      {/* oscurecido + tinte clínico del fondo */}
      <AbsoluteFill style={{ background: `rgba(9,20,26,${bgDark})`, opacity: alive }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 70% at ${side === "right" ? "26%" : "74%"} 46%, ${accentDeep}22, rgba(0,0,0,0) 64%)`,
          opacity: alive * 0.9,
        }}
      />

      {/* ═══════════ (2) MEDIO — halo de separación + TARJETA ═══════════ */}
      <div
        style={{
          position: "absolute",
          left: cardX - 120,
          top: cardY - 90,
          width: CARD_W + 240,
          height: CARD_H + 180,
          borderRadius: 999,
          background: `radial-gradient(closest-side, ${accent}26, rgba(0,0,0,0) 72%)`,
          filter: "blur(28px)",
          opacity: cardOp * 0.85,
          transform: `translate3d(${cardPar * 0.7}px, ${bob * 0.5}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: CARD_W,
          height: CARD_H,
          opacity: cardOp,
          transform: `translate3d(${cardIn + cardPar}px, ${bob}px, 0) scale(${cardScale}) rotate(${cardTilt}deg)`,
          borderRadius: 34,
          overflow: "hidden",
          background: C.paper,
          boxShadow: [
            "0 60px 120px rgba(4,12,17,0.62)",
            "0 18px 44px rgba(4,12,17,0.44)",
            `0 0 0 1px ${accent}55`,
          ].join(", "),
          filter: cardBlur > 0.05 ? `blur(${cardBlur}px)` : undefined,
        }}
      >
        {/* foto principal con ken-burns propio */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate3d(${kbX}px, ${kbY}px, 0) scale(${kbScale})`,
            }}
          >
            {image ? (
              <Layer src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <FallbackSurface accent={accent} />
            )}
          </div>
        </div>

        {/* pie de la tarjeta: degradado que la asienta (y da aire al borde) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 240,
            background: "linear-gradient(180deg, rgba(9,20,26,0) 0%, rgba(9,20,26,0.46) 100%)",
          }}
        />

        {/* BORDE DE VIDRIO: highlight arriba-izq + sombra interior abajo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 34,
            boxShadow: [
              "inset 0 2px 0 rgba(255,255,255,0.55)",
              "inset 2px 0 0 rgba(255,255,255,0.22)",
              "inset 0 -2px 0 rgba(9,20,26,0.35)",
              "inset 0 0 90px rgba(9,20,26,0.30)",
            ].join(", "),
            border: "1px solid rgba(255,255,255,0.34)",
          }}
        />

        {/* BARRIDO DE LUZ CÁLIDO — cruza UNA sola vez */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: `${interpolate(sweepP, [0, 1], [-46, 116])}%`,
            width: "34%",
            height: "180%",
            transform: "rotate(14deg)",
            opacity: sweepOp,
            background:
              "linear-gradient(90deg, rgba(255,240,214,0) 0%, rgba(255,240,214,0.42) 42%, rgba(255,255,255,0.72) 52%, rgba(255,240,214,0.34) 62%, rgba(255,240,214,0) 100%)",
            mixBlendMode: "screen",
            filter: "blur(6px)",
          }}
        />

        {/* filete de acento sobre el borde inferior (progreso vivo del beat) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 7,
            width: `${interpolate(t, [0.05, 0.96], [0, 100], CLAMP)}%`,
            background: `linear-gradient(90deg, ${accentDeep}, ${accent})`,
          }}
        />
      </div>

      {/* ═══════════ (3) FRENTE — scrim + texto ═══════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${scrimEdge}, rgba(9,20,26,0.90) 0%, rgba(9,20,26,0.78) 34%, rgba(9,20,26,0.28) 60%, rgba(9,20,26,0) 78%)`,
          opacity: interpolate(frame, [0, IN], [0, 1], CLAMP) * alive,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: textX,
          top: 0,
          width: TEXT_W,
          height: 1080,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transform: `translate3d(${textPar}px, 0, 0)`,
          opacity: alive,
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 22,
              opacity: eyeS,
              transform: `translateY(${interpolate(eyeS, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                width: interpolate(eyeS, [0, 1], [0, 56]),
                height: 6,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${accent}, ${accentDeep})`,
              }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: accent,
                textShadow: "0 2px 16px rgba(0,0,0,0.7)",
              }}
            >
              {eyebrow}
            </div>
          </div>
        ) : null}

        <div
          style={{
            fontSize: titleSize,
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: -1,
            color: C.paper,
            textShadow: "0 6px 34px rgba(4,12,17,0.85), 0 2px 6px rgba(4,12,17,0.6)",
            opacity: titS,
            transform: `translate3d(${interpolate(titS, [0, 1], [-34 * dir, 0])}px, ${interpolate(titS, [0, 1], [22, 0])}px, 0)`,
          }}
        >
          {title}
        </div>

        {sub ? (
          <div
            style={{
              marginTop: 26,
              paddingLeft: 22,
              borderLeft: `6px solid ${accent}`,
              fontSize: 36,
              fontWeight: 500,
              lineHeight: 1.32,
              color: "rgba(244,247,249,0.90)",
              textShadow: "0 3px 20px rgba(4,12,17,0.8)",
              opacity: subS,
              transform: `translateY(${interpolate(subS, [0, 1], [20, 0])}px)`,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>

      {/* viñeta + grano fino (cierra la profundidad; no tapa el texto) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 92% at 50% 46%, rgba(0,0,0,0) 52%, rgba(4,12,17,0.58) 100%)",
          opacity: alive,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.045) 0 1px, rgba(0,0,0,0) 1px 3px)",
          backgroundSize: "3px 3px",
          opacity: 0.5 * alive,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
