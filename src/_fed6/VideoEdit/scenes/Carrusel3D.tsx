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

// ── Carrusel3D ───────────────────────────────────────────────────────────────
// Anillo de tarjetas con FOTO girando en perspectiva real (perspective + rotateY
// + translateZ, sin librerías). Pieza de lucimiento para listas numeradas
// ("los 5 beneficios"). La tarjeta del frente queda enfocada y grande por la
// propia profundidad, con borde de acento y sombra proyectada; las laterales se
// van al fondo, se oscurecen y se desenfocan. Detrás, la misma foto activa a
// pantalla completa, muy blureada, hace de cama y cruza con crossfade.
// 1920x1080 · 30 fps · determinista (cero Math.random / Date.now).
// TODOS los tiempos son FRACCIONES de durationInFrames.

const INTER = loadInter().fontFamily;

const BG = "#0E1D23";
const CREAM = "#F3ECDD";
const TEAL = "#12B3AE";
const TEAL_LIGHT = "#3FE0D6";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

type Tone = "teal" | "warn" | "danger";

const TONES: Record<Tone, { accent: string; light: string }> = {
  teal: { accent: TEAL, light: TEAL_LIGHT },
  warn: { accent: AMBER, light: "#F6DCAB" },
  danger: { accent: CORAL, light: "#F08D78" },
};

// ── geometría del anillo ─────────────────────────────────────────────────────
const CW = 540; // ancho de tarjeta
const CH = 650; // alto de tarjeta
const GAP = 82; // aire entre tarjetas vecinas
const RING_CY = 596; // centro vertical del anillo (deja 96px de título arriba)
const PERSP = 1750; // distancia de cámara

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const rad = (deg: number) => (deg * Math.PI) / 180;

// normaliza un ángulo a [-180, 180]
const norm = (deg: number) => {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
};

// interpolación SIEMPRE con easing y clamp (a prueba de rangos degenerados)
const ez = (
  f: number,
  a: number,
  b: number,
  from: number,
  to: number,
  easing: (n: number) => number = Easing.out(Easing.cubic)
) =>
  interpolate(f, [a, b > a ? b : a + 1], [from, to], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const Carrusel3D: React.FC<{
  durationInFrames: number;
  title?: string;
  items?: { image: string; num?: string; title: string; sub?: string }[];
  focus?: number;
  tone?: "teal" | "warn" | "danger";
}> = ({ durationInFrames, title, items = [], focus, tone = "teal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T = TONES[tone] || TONES.teal;
  const N = items.length;
  const NN = N > 0 ? N : 1;
  const DUR = durationInFrames > 1 ? durationInFrames : 1;

  // ── el anillo reparte el tiempo entre las N tarjetas (fracciones puras) ────
  const segLen = DUR / NN;
  const fixed =
    typeof focus === "number" && isFinite(focus)
      ? Math.min(NN - 1, Math.max(0, Math.round(focus)))
      : null;

  const rawIdx = Math.floor(frame / segLen);
  const actIdx = fixed !== null ? fixed : Math.min(NN - 1, Math.max(0, rawIdx));
  const localFrame = fixed !== null ? frame : frame - actIdx * segLen;

  // giro con spring → easing suave + pequeño overshoot al asentar
  const turn = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, mass: 0.95, stiffness: 92 },
    durationInFrames: Math.max(1, segLen * 0.46),
  });
  // índice angular CONTINUO: el anillo viene girando desde la tarjeta anterior
  const angleIdx = fixed !== null ? fixed : actIdx === 0 ? 0 : actIdx - 1 + turn;

  // separación angular: anillo completo con 5+ tarjetas, arco con menos
  const SPREAD = NN <= 1 ? 0 : Math.min(72, 360 / NN);
  const R =
    NN <= 1
      ? 0
      : Math.min(
          1050,
          Math.max(560, (CW / 2 + GAP) / Math.tan(rad(SPREAD / 2)))
        );

  // ── entrada / salida de la escena ─────────────────────────────────────────
  const intro = ez(frame, DUR * 0.008, DUR * 0.075, 0, 1);
  const outro = ez(frame, DUR * 0.955, DUR, 1, 0, Easing.in(Easing.quad));
  const alive = intro * outro;

  // ── cama de fondo: foto activa muy blureada, con crossfade al girar ───────
  const bgT =
    fixed !== null || actIdx === 0 ? 1 : ez(localFrame, 0, segLen * 0.42, 0, 1);
  const bgScale = 1.16 + ez(frame, 0, DUR, 0, 0.09, Easing.inOut(Easing.quad));
  const cur = N > 0 ? items[actIdx] : undefined;
  const prev = N > 0 && actIdx > 0 ? items[actIdx - 1] : undefined;
  const curSrc = cur && cur.image ? staticFile(cur.image) : null;
  const prevSrc = prev && prev.image ? staticFile(prev.image) : null;

  const bedStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(52px) saturate(0.85) brightness(0.42)",
    transform: `scale(${bgScale})`,
  };

  // ── texto escalonado de la tarjeta del frente (número → título → sub) ─────
  const textF = localFrame - segLen * (fixed !== null ? 0.05 : 0.3);
  const stg = (d: number) => ez(textF, segLen * d, segLen * (d + 0.14), 0, 1);
  const sNum = stg(0);
  const sTit = stg(0.055);
  const sSub = stg(0.11);

  // ── título de la sección ──────────────────────────────────────────────────
  const tIn = ez(frame, 0, DUR * 0.055, 0, 1);

  return (
    <AbsoluteFill
      style={{ background: BG, fontFamily: INTER, overflow: "hidden" }}
    >
      {/* cama de foto — la anterior queda abajo y la actual entra por encima */}
      {prevSrc ? (
        <AbsoluteFill style={{ opacity: alive }}>
          <Img src={prevSrc} style={bedStyle} />
        </AbsoluteFill>
      ) : null}
      {curSrc ? (
        <AbsoluteFill style={{ opacity: alive * bgT }}>
          <Img src={curSrc} style={bedStyle} />
        </AbsoluteFill>
      ) : null}

      {/* velo de marca: la cama nunca compite con las tarjetas */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(14,29,35,0.88) 0%, rgba(14,29,35,0.58) 34%, rgba(14,29,35,0.74) 72%, rgba(14,29,35,0.96) 100%)",
        }}
      />
      {/* viñeta + luz cenital */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 78% at 50% 44%, rgba(255,255,255,0.055) 0%, rgba(0,0,0,0) 52%), radial-gradient(78% 64% at 50% 50%, rgba(0,0,0,0) 40%, rgba(4,12,16,0.74) 100%)",
        }}
      />

      {/* halo de acento detrás de la tarjeta del frente */}
      <AbsoluteFill
        style={{
          opacity: alive * 0.5,
          background: `radial-gradient(38% 34% at 50% ${
            (RING_CY / 1080) * 100
          }%, ${T.accent}44 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      {/* ── ESCENARIO 3D ─────────────────────────────────────────────────── */}
      {N > 0 ? (
        <AbsoluteFill
          style={{
            perspective: `${PERSP}px`,
            perspectiveOrigin: `50% ${(RING_CY / 1080) * 100}%`,
            opacity: alive,
            transform: `scale(${0.9 + 0.1 * intro})`,
          }}
        >
          {/* sombra de contacto en el piso */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: RING_CY + CH / 2 - 8,
              width: CW * 1.3,
              height: 120,
              marginLeft: (-CW * 1.3) / 2,
              borderRadius: "50%",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0) 72%)",
              filter: "blur(10px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: RING_CY,
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
              transform: `translateZ(${-R}px) rotateY(${-angleIdx * SPREAD}deg)`,
            }}
          >
            {items.map((it, i) => {
              const rel = norm(SPREAD * (i - angleIdx));
              const aAbs = Math.abs(rel);
              const front = clamp01(Math.cos(rad(rel)));
              const vis = ez(aAbs, 76, 126, 1, 0, Easing.out(Easing.quad));
              if (vis <= 0.002) return null;

              const isFront = i === actIdx;
              const src = it.image ? staticFile(it.image) : null;
              const blurPx = (1 - front) * 4.2;
              const dim = 0.68 * (1 - front);
              const sc = 0.955 + 0.045 * front;
              const num =
                it.num || (i + 1 < 10 ? "0" : "") + String(i + 1);

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: -CW / 2,
                    top: -CH / 2,
                    width: CW,
                    height: CH,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${i * SPREAD}deg) translateZ(${R}px) scale(${sc})`,
                    opacity: vis,
                  }}
                >
                  {/* el filter vive acá adentro para no aplanar el 3D del padre */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 30,
                      overflow: "hidden",
                      background: "#0A1519",
                      filter: blurPx > 0.05 ? `blur(${blurPx}px)` : "none",
                      border: `${isFront ? 2 : 1}px solid ${
                        isFront ? T.accent : "rgba(243,236,221,0.13)"
                      }`,
                      boxShadow: isFront
                        ? `0 44px 96px rgba(0,0,0,${
                            0.34 + 0.28 * front
                          }), 0 0 0 6px rgba(14,29,35,0.55), 0 0 70px ${T.accent}3A`
                        : `0 26px 60px rgba(0,0,0,${0.2 + 0.24 * front})`,
                    }}
                  >
                    {/* FOTO (recorte cover) */}
                    {src ? (
                      <Img
                        src={src}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: `scale(${1.04 + 0.03 * front})`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(150deg, #14303A 0%, #0A1519 100%)",
                        }}
                      />
                    )}

                    {/* scrim: el texto siempre lee */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(8,18,22,0.62) 0%, rgba(8,18,22,0.04) 34%, rgba(8,18,22,0.72) 66%, rgba(8,18,22,0.96) 100%)",
                      }}
                    />

                    {/* NÚMERO */}
                    <div
                      style={{
                        position: "absolute",
                        top: 26,
                        left: 30,
                        opacity: isFront ? sNum : 1,
                        transform: `translateY(${
                          isFront ? (1 - sNum) * -26 : 0
                        }px)`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 92,
                          fontWeight: 800,
                          lineHeight: 0.9,
                          letterSpacing: -4,
                          color: isFront ? T.light : "rgba(243,236,221,0.72)",
                          textShadow: "0 10px 30px rgba(0,0,0,0.6)",
                        }}
                      >
                        {num}
                      </div>
                      <div
                        style={{
                          width: 54,
                          height: 4,
                          marginTop: 12,
                          borderRadius: 2,
                          background: T.accent,
                          transform: `scaleX(${isFront ? sNum : 1})`,
                          transformOrigin: "left center",
                        }}
                      />
                    </div>

                    {/* TÍTULO + SUBTÍTULO */}
                    <div
                      style={{
                        position: "absolute",
                        left: 34,
                        right: 34,
                        bottom: 38,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 42,
                          fontWeight: 800,
                          lineHeight: 1.1,
                          letterSpacing: -0.6,
                          color: CREAM,
                          textShadow: "0 8px 26px rgba(0,0,0,0.72)",
                          opacity: isFront ? sTit : 1,
                          transform: `translateY(${
                            isFront ? (1 - sTit) * 30 : 0
                          }px)`,
                        }}
                      >
                        {it.title}
                      </div>
                      {it.sub ? (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 25,
                            fontWeight: 500,
                            lineHeight: 1.32,
                            color: "rgba(243,236,221,0.74)",
                            textShadow: "0 6px 20px rgba(0,0,0,0.66)",
                            opacity: isFront ? sSub : 1,
                            transform: `translateY(${
                              isFront ? (1 - sSub) * 22 : 0
                            }px)`,
                          }}
                        >
                          {it.sub}
                        </div>
                      ) : null}
                    </div>

                    {/* oscurecido proporcional al ángulo */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `rgba(4,12,16,${dim})`,
                      }}
                    />

                    {/* brillo especular sutil (fuerte sólo al frente) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: front * 0.5,
                        background:
                          "linear-gradient(118deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 38%)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ── TÍTULO DE LA SECCIÓN ─────────────────────────────────────────── */}
      {title ? (
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 96,
            right: 96,
            opacity: tIn * outro,
            transform: `translateY(${(1 - tIn) * -22}px)`,
          }}
        >
          <div
            style={{
              width: ez(frame, 0, DUR * 0.075, 0, 72),
              height: 5,
              borderRadius: 3,
              background: T.accent,
              boxShadow: `0 0 22px ${T.accent}88`,
            }}
          />
          <div
            style={{
              marginTop: 16,
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: -0.8,
              lineHeight: 1.05,
              color: CREAM,
              textShadow: "0 10px 34px rgba(0,0,0,0.62)",
            }}
          >
            {title}
          </div>
        </div>
      ) : null}

      {/* ── CONTADOR EN PUNTOS (nunca texto) ─────────────────────────────── */}
      {N > 1 ? (
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 92,
            height: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: alive * 0.95,
          }}
        >
          {items.map((_, i) => {
            const near = clamp01(1 - Math.abs(i - angleIdx));
            return (
              <div
                key={i}
                style={{
                  width: 10 + 30 * near,
                  height: 10,
                  borderRadius: 6,
                  marginLeft: i === 0 ? 0 : 14,
                  background: near > 0.02 ? T.accent : "rgba(243,236,221,0.26)",
                  opacity: 0.4 + 0.6 * near,
                  boxShadow: near > 0.5 ? `0 0 18px ${T.accent}AA` : "none",
                }}
              />
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
