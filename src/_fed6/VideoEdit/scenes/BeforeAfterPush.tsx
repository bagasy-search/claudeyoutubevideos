import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Media } from "../components/Media";
import { Dust, Grain, LensVignette } from "../kit/premium/stagecraft";
import { SPR, THEME_MEDICO } from "../kit/premium/theme";
import type { Theme } from "../kit/premium/theme";

/* ============================================================================
 * BeforeAfterPush — ANTES / DESPUÉS cinematográfico · Dr. Federer (_fed6)
 * ----------------------------------------------------------------------------
 * Nada de slider plano de página web. Las dos fotos (mismo encuadre) viven en
 * EL MISMO rectángulo flotante, una encima de la otra, y la cámara hace un
 * PUSH lento y continuo sobre `focus` que NUNCA se detiene — tampoco durante
 * el barrido.
 *
 * La transición es una CORTINA DE LUZ vertical: una banda teal con glow cruza
 * de izquierda a derecha (spring que asienta, no lineal) y a su paso revela el
 * "después" con `clip-path: inset(...)`. Detrás de la banda queda un rastro
 * suave; delante, un labio de sombra. La luz de la cortina también salpica la
 * escena entera.
 *
 * CAPAS: L1 cama · L2 grade · L3 bokeh/polvo · L4 placa flotante + sombra ·
 * L5 antes (push) · L6 después (push + clip) · L7 cortina/rastro/glow ·
 * L8 etiquetas en tarjetas claras · L9 caption escalonado · grano + viñeta.
 * Todo determinista; entrada y SALIDA salen de `durationInFrames`.
 * 1920x1080 @ 30fps.
 * ========================================================================== */

const INTER = loadInter().fontFamily;

/* --------------------------------- paleta -------------------------------- */
const BG = "#0E1D23";
const BG_DEEP = "#08151A";
const TEAL = "#12B3AE";
const TEAL_DEEP = "#063B40";
const TEAL_HI = "#8FF6EE";
const CREAM = "#F5F9FA";
const GOLD = "#E6A23C";
const ALERT = "#E0523E";

const T = THEME_MEDICO;
const T_DARK: Theme = {
  ...T,
  name: "medico-dark-ba",
  mode: "dark",
  color: { ...T.color, gold: TEAL, accent: TEAL, danger: ALERT },
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** azar determinístico por índice (mismo esquema que stagecraft.tsx) */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

/* ------------------------- la placa que flota ---------------------------- */
const FX = 180;
const FY = 116;
const FW = 1560;
const FH = 740;
const RAD = 30;

type Props = {
  durationInFrames: number;
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  focus?: { x: number; y: number };
  bed?: string;
};

export const BeforeAfterPush: React.FC<Props> = ({
  durationInFrames,
  before,
  after,
  beforeLabel = "AL LLEGAR",
  afterLabel = "AÑO Y MEDIO DESPUÉS",
  caption,
  focus = { x: 0.5, y: 0.44 },
  bed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);

  /* — entrada y SALIDA de la escena entera — */
  const inSp = spring({ frame, fps, config: SPR.settle, durationInFrames: 26 });
  const outOp = interpolate(frame, [D - 12, D - 1], [1, 0], CLAMP);
  const outSc = interpolate(frame, [D - 12, D - 1], [1, 0.955], CLAMP);

  /* — L1 · cama: su propio push, más lento que el de las fotos — */
  const bedPush = interpolate(frame, [0, D], [1.08, 1.18], CLAMP);
  const bedDrift = Math.cos(frame / 240) * 12;

  /* — PUSH continuo sobre el punto de interés (nunca se detiene) — */
  const push = interpolate(frame, [0, D], [1.03, 1.17], CLAMP);
  const originX = (focus.x * 100).toFixed(2);
  const originY = (focus.y * 100).toFixed(2);
  /* micro-deriva tipo cámara en mano, sobre la placa (no sobre las fotos) */
  const handX = Math.sin(frame / 118) * 3.2;
  const handY = Math.cos(frame / 141) * 2.4;

  /* — L7 · CORTINA DE LUZ: spring que asienta, no una rampa — */
  const wipeAt = Math.round(D * 0.34);
  const wipeDur = Math.max(30, Math.round(D * 0.3));
  const w = spring({
    frame: frame - wipeAt,
    fps,
    config: { damping: 21, mass: 1.15, stiffness: 74 },
    durationInFrames: wipeDur,
  });
  const wc = Math.min(1, Math.max(0, w));
  const bandX = wc * FW;
  const bandFade = interpolate(wc, [0, 0.05, 0.9, 1], [0, 1, 1, 0], CLAMP);
  /* la luz de la cortina salpica todo el plano */
  const splash = bandFade * 0.5;

  /* — L8 · etiquetas — */
  const befSp = spring({ frame: frame - 14, fps, config: SPR.settle, durationInFrames: 22 });
  const befDim = 1 - 0.66 * wc;
  const aftSp = spring({ frame: frame - (wipeAt + 10), fps, config: SPR.pop, durationInFrames: 24 });

  /* — L9 · caption escalonado por palabra — */
  const capAt = Math.round(D * 0.16);
  const words = (caption ?? "").trim().length ? (caption as string).trim().split(/\s+/) : [];

  const label = (
    text: string,
    accent: string,
    sp: number,
    dim: number,
    pos: React.CSSProperties,
    dir: number,
  ) => (
    <div
      style={{
        position: "absolute",
        ...pos,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: T.color.surfaceStrong,
        borderRadius: 20,
        padding: "18px 30px",
        boxShadow: "0 18px 44px rgba(0,0,0,0.55), 0 44px 96px rgba(0,0,0,0.34)",
        opacity: Math.min(1, sp * 1.6) * dim,
        transform: `translateY(${((1 - sp) * 20 * dir).toFixed(2)}px) scale(${(0.9 + 0.1 * sp).toFixed(3)})`,
        filter: sp < 0.94 ? `blur(${((1 - sp) * 7).toFixed(2)}px)` : undefined,
      }}
    >
      <div style={{ width: 12, height: 34, borderRadius: 6, background: accent, boxShadow: `0 0 18px ${accent}88` }} />
      <span
        style={{
          color: T.color.text,
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: T.labelSpacing - 1,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: INTER,
        backgroundColor: BG_DEEP,
        overflow: "hidden",
        opacity: outOp,
        transform: `scale(${outSc.toFixed(4)})`,
      }}
    >
      {/* ── L1 · CAMA — degradé profundo SIEMPRE debajo, nunca un color plano ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(122% 92% at 30% 14%, ${TEAL_DEEP} 0%, ${BG} 48%, ${BG_DEEP} 100%)`,
        }}
      />
      {bed ? (
        <AbsoluteFill
          style={{
            transform: `scale(${bedPush.toFixed(4)}) translateX(${bedDrift.toFixed(2)}px)`,
            filter: "blur(30px) saturate(0.6) brightness(0.46)",
            opacity: 0.7,
          }}
        >
          <Media src={bed} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}

      {/* ── L2 · GRADE ── */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,21,26,0.9) 0%, rgba(6,59,64,0.38) 40%, rgba(8,21,26,0.95) 100%)",
        }}
      />

      {/* ── L3 · BOKEH de fondo + polvo del kit (ritmos propios) ── */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.45 }}>
        {Array.from({ length: 7 }, (_, i) => {
          const r = 220 + rand(i, 6) * 320;
          const x = 6 + rand(i, 1) * 90 + Math.sin(frame / (270 + i * 31)) * 1.3;
          const y = 8 + rand(i, 2) * 86 + Math.cos(frame / (320 + i * 25)) * 1;
          const pulse = 0.55 + 0.45 * Math.sin(frame / (120 + i * 19) + i * 0.8);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: r,
                height: r,
                marginLeft: -r / 2,
                marginTop: -r / 2,
                borderRadius: "50%",
                background: `radial-gradient(circle at 42% 38%, ${TEAL}1C 0%, ${TEAL}0B 56%, rgba(0,0,0,0) 72%)`,
                filter: `blur(${20 + rand(i, 3) * 24}px)`,
                opacity: pulse * (0.3 + rand(i, 4) * 0.45),
              }}
            />
          );
        })}
      </AbsoluteFill>
      <Dust theme={T_DARK} count={14} opacity={0.3} />

      {/* ── L4 · LA PLACA FLOTANTE ── */}
      <div
        style={{
          position: "absolute",
          left: FX,
          top: FY,
          width: FW,
          height: FH,
          borderRadius: RAD,
          overflow: "hidden",
          boxSizing: "border-box",
          border: "1px solid rgba(245,249,250,0.16)",
          boxShadow: `0 26px 70px rgba(0,0,0,0.6), 0 70px 160px rgba(0,0,0,0.45), 0 0 0 10px rgba(14,29,35,0.55)`,
          opacity: Math.min(1, inSp * 1.6),
          transform: `translate(${handX.toFixed(2)}px, ${(handY + (1 - inSp) * 26).toFixed(2)}px) scale(${(0.965 + 0.035 * inSp).toFixed(4)})`,
          filter: inSp < 0.94 ? `blur(${((1 - inSp) * 9).toFixed(2)}px)` : undefined,
        }}
      >
        {/* L5 · ANTES — con el push */}
        <AbsoluteFill
          style={{ transform: `scale(${push.toFixed(4)})`, transformOrigin: `${originX}% ${originY}%` }}
        >
          <Media src={before} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        {/* grade frío sobre el "antes" — se desvanece al pasar la cortina */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(8,21,26,0.34) 0%, rgba(6,59,64,0.26) 100%)",
            opacity: 1 - wc * 0.75,
          }}
        />

        {/* L6 · DESPUÉS — mismo push, revelado por la cortina */}
        <AbsoluteFill style={{ clipPath: `inset(0px ${((1 - wc) * 100).toFixed(3)}% 0px 0px)` }}>
          <AbsoluteFill
            style={{ transform: `scale(${push.toFixed(4)})`, transformOrigin: `${originX}% ${originY}%` }}
          >
            <Media src={after} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(18,179,174,0.10) 0%, rgba(0,0,0,0) 46%, rgba(8,21,26,0.30) 100%)`,
            }}
          />
        </AbsoluteFill>

        {/* L7 · rastro suave detrás de la banda (lado ya revelado) */}
        <div
          style={{
            position: "absolute",
            left: Math.max(0, bandX - 340),
            top: 0,
            width: 340,
            height: "100%",
            background: `linear-gradient(90deg, rgba(18,179,174,0) 0%, ${TEAL}22 62%, ${TEAL}4D 100%)`,
            mixBlendMode: "screen",
            filter: "blur(14px)",
            opacity: bandFade * 0.85,
            pointerEvents: "none",
          }}
        />
        {/* labio de sombra delante de la banda (lado todavía "antes") */}
        <div
          style={{
            position: "absolute",
            left: bandX,
            top: 0,
            width: 120,
            height: "100%",
            background: "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
            opacity: bandFade,
            pointerEvents: "none",
          }}
        />
        {/* L7 · LA CORTINA DE LUZ */}
        <div
          style={{
            position: "absolute",
            left: bandX - 70,
            top: -20,
            width: 140,
            height: "calc(100% + 40px)",
            background: `linear-gradient(90deg, rgba(18,179,174,0) 0%, ${TEAL}80 34%, ${TEAL_HI} 50%, ${TEAL}80 66%, rgba(18,179,174,0) 100%)`,
            mixBlendMode: "screen",
            filter: "blur(3px)",
            opacity: bandFade,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: bandX - 2,
            top: 0,
            width: 4,
            height: "100%",
            background: CREAM,
            boxShadow: `0 0 26px 8px ${TEAL}CC, 0 0 70px 24px ${TEAL}66`,
            opacity: bandFade,
            pointerEvents: "none",
          }}
        />

        {/* brillo del vidrio de la placa */}
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background:
              "linear-gradient(168deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 30%), radial-gradient(120% 90% at 50% 108%, rgba(8,21,26,0.5) 0%, rgba(0,0,0,0) 58%)",
          }}
        />

        {/* L8 · etiquetas, en esquinas OPUESTAS, dentro de la placa */}
        {label(beforeLabel, ALERT, befSp, befDim, { left: 40, top: 40 }, -1)}
        {label(afterLabel, TEAL, aftSp, 1, { right: 40, bottom: 40 }, 1)}
      </div>

      {/* ── L7b · la luz de la cortina salpica toda la escena ── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "screen",
          background: `radial-gradient(46% 70% at ${(((FX + bandX) / 1920) * 100).toFixed(2)}% 45%, ${TEAL}33 0%, rgba(0,0,0,0) 62%)`,
          opacity: splash,
        }}
      />

      {/* ── L9 · CAPTION abajo, centrado, entrada escalonada ── */}
      {words.length > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: FY + FH + 52,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "0 16px",
            padding: "0 200px",
          }}
        >
          {words.map((word, i) => {
            const sp = spring({
              frame: frame - (capAt + i * 2.5),
              fps,
              config: SPR.settle,
              durationInFrames: 20,
            });
            return (
              <span
                key={i}
                style={{
                  color: CREAM,
                  fontSize: 44,
                  fontWeight: 700,
                  lineHeight: 1.22,
                  letterSpacing: -0.4,
                  opacity: Math.min(1, sp * 1.7),
                  transform: `translateY(${((1 - sp) * 22).toFixed(2)}px)`,
                  filter: sp < 0.92 ? `blur(${((1 - sp) * 6).toFixed(2)}px)` : undefined,
                  textShadow: "0 3px 12px rgba(0,0,0,0.65), 0 20px 48px rgba(0,0,0,0.45)",
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ) : null}

      {/* — línea de marca bajo el caption, dibujándose — */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: FY + FH + 8,
          width: interpolate(frame, [capAt - 6, capAt + 22], [0, 300], CLAMP),
          height: 5,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${TEAL} 0%, ${GOLD} 100%)`,
          boxShadow: `0 0 20px ${TEAL}66`,
          transform: "translateX(-50%)",
        }}
      />

      {/* ── grano + viñeta de lente ── */}
      <Grain theme={T_DARK} amount={0.08} />
      <LensVignette theme={T_DARK} strength={1.2} />
    </AbsoluteFill>
  );
};
