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

// ── ListaFlotante — puntos como TARJETAS FLOTANTES CON PROFUNDIDAD ───────────
// No es una lista con viñetas: es un PILÓN en diagonal con perspectiva real.
// La última tarjeta que entró queda ARRIBA del pilón (cerca, grande, nítida) y
// las anteriores quedan DEBAJO (más chicas, con blur de 1-3px, más apagadas).
// Cuando entra una nueva, las viejas se corren y se alejan; nunca saltan.
// Pensado para +60: tipografía grande, aire, márgenes seguros de 90px.

const INTER = loadInter().fontFamily;

const BASE = "#0E1D23";
const TEAL = "#12B3AE";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";
const CREAM = "#F3ECDD";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

type ItemState = "ok" | "warn" | "danger";
type Tone = "teal" | "warn" | "danger";

const TONE_COLOR: Record<Tone, string> = {
  teal: TEAL,
  warn: AMBER,
  danger: CORAL,
};

const STATE_COLOR: Record<ItemState, string> = {
  ok: TEAL,
  warn: AMBER,
  danger: CORAL,
};

const TONE_TO_STATE: Record<Tone, ItemState> = {
  teal: "ok",
  warn: "warn",
  danger: "danger",
};

// ── Geometría de tarjeta (todo en px de la comp 1920x1080) ───────────────────
const COMP_W = 1920;
const CARD_W = 1300;
const CARD_X = (COMP_W - CARD_W) / 2; // 310 → muy por dentro del margen de 90
const BAR_W = 7;
const PAD_X_L = 44;
const PAD_X_R = 50;
const PAD_Y = 32;
const ICON_W = 78;
const ICON_GAP = 30;
const TEXT_W = CARD_W - PAD_X_L - PAD_X_R - ICON_W - ICON_GAP - BAR_W;

// Zona vertical donde vive el pilón (título arriba, etiqueta abajo).
const STACK_TOP = 214;
const STACK_BOTTOM = 952;
const STACK_AVAIL = STACK_BOTTOM - STACK_TOP;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Cuerpo más chico cuanto más largo el texto y cuantos más puntos haya.
const fontSizeFor = (len: number, n: number) => {
  const base = len <= 46 ? 42 : len <= 72 ? 38 : 34;
  const k = n >= 5 ? 0.86 : n >= 4 ? 0.93 : 1;
  return Math.round(base * k);
};

// Estimación CONSERVADORA de líneas (se reserva de más, nunca de menos).
const linesFor = (len: number, fs: number) => {
  const perLine = (TEXT_W / (fs * 0.545)) * 0.88;
  const l = Math.ceil(len / Math.max(1, perLine));
  return l < 1 ? 1 : l > 3 ? 3 : l;
};

// ── Íconos de estado dibujados en SVG (se trazan al entrar) ──────────────────
const StateIcon: React.FC<{ state: ItemState; color: string; p: number }> = ({
  state,
  color,
  p,
}) => {
  const draw = clamp01(interpolate(p, [0.15, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const off = (1 - draw) * 100;
  const common = {
    stroke: color,
    strokeWidth: 4.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
    pathLength: 100,
    strokeDasharray: 100,
    strokeDashoffset: off,
  };
  return (
    <svg width={44} height={44} viewBox="0 0 48 48">
      {state === "ok" ? (
        <path d="M 11 25 L 20.5 34.5 L 37 14.5" {...common} />
      ) : state === "warn" ? (
        <>
          <path d="M 24 11 L 24 29" {...common} />
          <circle
            cx={24}
            cy={37.5}
            r={3.1}
            fill={color}
            opacity={draw}
            transform={`translate(24 37.5) scale(${0.4 + draw * 0.6}) translate(-24 -37.5)`}
          />
        </>
      ) : (
        <>
          <path d="M 14 14 L 34 34" {...common} />
          <path d="M 34 14 L 14 34" {...common} />
        </>
      )}
    </svg>
  );
};

export const ListaFlotante: React.FC<{
  durationInFrames: number;
  title?: string;
  image?: string;
  items?: { text: string; state?: ItemState }[];
  prompt?: string;
  tone?: Tone;
}> = ({
  durationInFrames,
  title = "Ten esto en cuenta",
  image,
  items = [],
  prompt,
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = TONE_COLOR[tone];
  const fallbackState = TONE_TO_STATE[tone];
  const n = items.length;

  // ── Fondo: foto muy desenfocada con Ken-Burns lentísimo ───────────────────
  const src =
    image && image.trim().length > 0
      ? image.startsWith("http")
        ? image
        : staticFile(image)
      : null;
  const kb = interpolate(frame, [0, Math.max(1, durationInFrames)], [1.08, 1.19], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const kbX = interpolate(frame, [0, Math.max(1, durationInFrames)], [-16, 16], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // ── Tiempos: TODO como fracción de durationInFrames ───────────────────────
  const enterLen = Math.max(6, Math.round(durationInFrames * 0.14));
  const titleSp = spring({
    frame,
    fps,
    config: { damping: 20, mass: 1, stiffness: 92 },
    durationInFrames: Math.max(6, Math.round(durationInFrames * 0.1)),
  });

  const ps: number[] = [];
  for (let i = 0; i < n; i++) {
    const delay = Math.round(durationInFrames * (0.08 + (0.55 * i) / Math.max(1, n)));
    ps.push(
      spring({
        frame: frame - delay,
        fps,
        config: { damping: 13, mass: 0.9, stiffness: 118 },
        durationInFrames: enterLen,
      })
    );
  }

  // ── Layout del pilón (alturas reservadas → nunca se pisan) ────────────────
  const gap = n >= 4 ? 26 : 34;
  const metrics = items.map((it) => {
    const len = (it.text ?? "").length;
    const fs = fontSizeFor(len, n);
    const lh = Math.round(fs * 1.3);
    const lines = linesFor(len, fs);
    const h = Math.max(116, PAD_Y * 2 + lines * lh);
    return { fs, lh, lines, h };
  });
  const totalH =
    metrics.reduce((a, m) => a + m.h, 0) + (n > 0 ? gap * (n - 1) : 0);
  const fit = totalH > 0 ? Math.min(1, STACK_AVAIL / totalH) : 1;
  const stackTop = STACK_TOP + (STACK_AVAIL - totalH) / 2;

  const tops: number[] = [];
  let cursor = 0;
  for (let i = 0; i < n; i++) {
    tops.push(cursor);
    cursor += metrics[i].h + gap;
  }

  // Profundidad CONTINUA: cuánto se alejó cada tarjeta al entrar las siguientes.
  const depthOf = (i: number) => {
    let d = 0;
    for (let j = i + 1; j < n; j++) d += clamp01(ps[j]);
    return d;
  };

  const promptP = prompt
    ? clamp01(
        interpolate(
          frame,
          [durationInFrames * 0.72, durationInFrames * 0.82],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
        )
      )
    : 0;

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: BASE }}>
      {/* FONDO */}
      {src ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translateX(${kbX}px) scale(${kb})`,
              filter: "blur(26px) brightness(0.44) saturate(0.88)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: `linear-gradient(150deg, #14303A 0%, ${BASE} 52%, #0A161B 100%)`,
            transform: `scale(${kb})`,
          }}
        />
      )}
      {/* Tinte + brillo de acento + viñeta */}
      <AbsoluteFill style={{ background: "rgba(14,29,35,0.58)" }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 60% at 22% 18%, ${accent}22, rgba(0,0,0,0) 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(122% 86% at 50% 46%, rgba(14,29,35,0) 38%, rgba(6,14,18,0.78) 100%)",
        }}
      />

      {/* TÍTULO */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 92,
          width: COMP_W - 192,
          opacity: titleSp,
          transform: `translateY(${interpolate(titleSp, [0, 1], [22, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: (title ?? "").length > 44 ? 52 : 60,
            fontWeight: 900,
            color: CREAM,
            letterSpacing: -0.8,
            lineHeight: 1.06,
            textShadow: "0 6px 26px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 18,
            height: 6,
            width: interpolate(titleSp, [0, 1], [0, 208]),
            borderRadius: 3,
            background: accent,
            boxShadow: `0 0 22px ${accent}88`,
          }}
        />
      </div>

      {/* PILÓN DE TARJETAS */}
      {n > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: stackTop,
            width: COMP_W,
            height: totalH,
            transform: `scale(${fit})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: 1700,
              perspectiveOrigin: "50% 38%",
            }}
          >
            {items.map((it, i) => {
              const m = metrics[i];
              const p = ps[i];
              const d = depthOf(i);
              const st: ItemState = it.state ?? fallbackState;
              const c = STATE_COLOR[st];

              const near = d < 0.5;
              const scale = 1 - 0.052 * d;
              const blur = Math.min(3, 0.95 * d);
              const op = clamp01(1 - 0.13 * d) * clamp01(p);
              const dx = -20 * d;
              // deriva vertical mínima al alejarse + flotación suave (determinista)
              const float = Math.sin(frame / fps + i * 1.7) * 2.4;
              const dy = -8 * d + float;
              const rotX = d * 1.4;
              const rotZ = -d * 0.22;

              const enterY = (1 - p) * 92;
              const enterZ = (1 - p) * -320;

              const shadow = near
                ? `0 24px 54px rgba(0,0,0,0.58), 0 4px 12px rgba(0,0,0,0.42)`
                : `0 ${Math.round(18 + d * 16)}px ${Math.round(
                    42 + d * 28
                  )}px rgba(0,0,0,${Math.max(0.24, 0.5 - d * 0.07).toFixed(2)})`;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: CARD_X + dx,
                    top: tops[i] + dy,
                    width: CARD_W,
                    height: m.h,
                    opacity: op,
                    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none",
                    transform: `translate3d(0px, ${enterY}px, ${enterZ}px) rotateX(${rotX}deg) rotate(${rotZ}deg) scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: ICON_GAP,
                      paddingLeft: PAD_X_L,
                      paddingRight: PAD_X_R,
                      borderRadius: 26,
                      overflow: "hidden",
                      background:
                        "linear-gradient(180deg, rgba(20,40,48,0.74), rgba(11,24,30,0.62))",
                      border: "1px solid rgba(243,236,221,0.16)",
                      backdropFilter: "blur(14px) saturate(122%)",
                      boxShadow: near ? `${shadow}, inset 0 0 0 1px ${c}26` : shadow,
                    }}
                  >
                    {/* filete de acento vertical */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: BAR_W,
                        background: c,
                        boxShadow: `0 0 18px ${c}77`,
                        transform: `scaleY(${clamp01(
                          interpolate(p, [0, 0.6], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                          })
                        )})`,
                        transformOrigin: "center top",
                      }}
                    />
                    {/* ícono de estado */}
                    <div
                      style={{
                        flex: "0 0 auto",
                        width: ICON_W,
                        height: ICON_W,
                        borderRadius: 24,
                        background: `${c}1F`,
                        border: `1px solid ${c}5C`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StateIcon state={st} color={c} p={p} />
                    </div>
                    {/* texto — alto FIJO reservado, recorte a 3 líneas: no desborda */}
                    <div
                      style={{
                        width: TEXT_W,
                        height: m.lines * m.lh,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: m.lines,
                        overflow: "hidden",
                        fontSize: m.fs,
                        lineHeight: `${m.lh}px`,
                        fontWeight: 700,
                        color: CREAM,
                        letterSpacing: -0.2,
                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      {it.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ETIQUETA FINAL */}
      {prompt && promptP > 0.001 ? (
        <div
          style={{
            position: "absolute",
            right: 96,
            bottom: 96,
            opacity: promptP,
            transform: `translateY(${interpolate(promptP, [0, 1], [18, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "13px 26px",
              borderRadius: 999,
              background: `${accent}1E`,
              border: `1px solid ${accent}66`,
              boxShadow: `0 14px 40px rgba(0,0,0,0.45)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: accent,
                boxShadow: `0 0 16px ${accent}`,
              }}
            />
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {prompt}
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
