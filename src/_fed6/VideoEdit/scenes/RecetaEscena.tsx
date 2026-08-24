import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const INTER = loadInter().fontFamily;

/* ============================================================================
 * RecetaEscena — la RECETA paso a paso como SECUENCIA EDITADA · Dr. Federer
 * ----------------------------------------------------------------------------
 * N pasos (típico 5) repartidos en durationInFrames. Cada paso ocupa la pantalla
 * con su FOTO y un Ken-Burns lento (1.06 -> 1.00 + micro-paneo que ALTERNA de
 * dirección para que no se sienta repetido). Entre paso y paso NO hay corte
 * seco ni fade plano: hay un WHIP lateral — la saliente se va de costado
 * recediendo, la entrante llega desde el lado opuesto sobreescalada, ambas con
 * un desenfoque de movimiento simulado (blur que sube y baja) y un destello
 * que barre la costura.
 *
 * Encima: tarjeta flotante de VIDRIO (blur + borde 1px + sombra larga) con el
 * número, el título y el detalle del paso; alterna abajo-izquierda /
 * abajo-derecha según el índice. Arriba, barra de progreso fina que se llena;
 * a la izquierda, columna de puntos con el paso activo agrandado y en acento.
 * El rótulo de sección queda toda la escena en opacidad baja.
 *
 * SOLO DOS FOTOS MONTADAS A LA VEZ (la saliente y la entrante).
 * 1920x1080 @ 30fps · todo el timing sale de fracciones de durationInFrames.
 * Determinista: cero Math.random(), cero Date.now(), cero frames absolutos.
 * ========================================================================== */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* --------------------------------- paleta -------------------------------- */
const BG = "#0E1D23";
const BG_DEEP = "#081317";
const TEAL = "#12B3AE";
const TEAL_BRIGHT = "#3FE0D6";
const CREAM = "#F3ECDD";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

/* ------------------------------- geometría ------------------------------- */
const W = 1920;
const H = 1080;
const SAFE = 96; // margen seguro real (> 90px pedidos)
const RAIL_X = 108; // columna de puntos
const CARD_W = 792;
const CARD_BOTTOM = 108;

/* ------------------------------- utilidades ------------------------------ */
const rgba = (hex: string, alpha: number): string => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_SOFT = Easing.bezier(0.33, 0, 0.2, 1);

const twoDigits = (n: number): string => (n < 10 ? "0" + n : "" + n);

type Step = { image: string; num?: string; title: string; desc?: string };
type Tone = "teal" | "warn" | "danger";

type Accent = { hot: string; cool: string };

const ACCENTS: { teal: Accent; warn: Accent; danger: Accent } = {
  teal: { hot: TEAL_BRIGHT, cool: TEAL },
  warn: { hot: AMBER, cool: "#C58F3E" },
  danger: { hot: CORAL, cool: "#A8341F" },
};

/* ============================== FOTO (plate) ============================== */
/* Una sola foto con su Ken-Burns + el desplazamiento/escala/blur que le manda
 * la transición. El contenedor interno va sobredimensionado 108% para que el
 * micro-paneo NUNCA descubra un borde. */
const PhotoPlate: React.FC<{
  src: string | null;
  kb: number; // 0..1 progreso de Ken-Burns (ya con easing)
  panSign: number; // +1 / -1 -> alterna la dirección del paneo
  offsetX: number; // px de la transición
  scaleMul: number; // multiplicador de la transición
  blur: number; // px de motion-blur simulado
  opacity: number;
  fallback: string;
}> = ({ src, kb, panSign, offsetX, scaleMul, blur, opacity, fallback }) => {
  const scale = (1.06 - 0.06 * kb) * scaleMul;
  const px = panSign * (kb * 30 - 15);
  const py = -panSign * (kb * 14 - 7);

  return (
    <AbsoluteFill
      style={{
        opacity,
        filter: `blur(${blur.toFixed(2)}px) saturate(1.06) contrast(1.04)`,
        willChange: "transform, filter, opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-4%",
          top: "-4%",
          width: "108%",
          height: "108%",
          transform: `translate3d(${(offsetX + px).toFixed(2)}px, ${py.toFixed(
            2
          )}px, 0) scale(${scale.toFixed(4)})`,
          transformOrigin: "50% 50%",
        }}
      >
        {src ? (
          <Img
            src={src}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `radial-gradient(120% 90% at 50% 35%, ${rgba(
                fallback,
                0.28
              )} 0%, ${BG} 58%, ${BG_DEEP} 100%)`,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ============================ TARJETA DE VIDRIO =========================== */
const GlassCard: React.FC<{
  numLabel: string;
  title: string;
  desc?: string;
  side: "left" | "right";
  enter: number; // 0..1
  exit: number; // 0..1
  accent: Accent;
}> = ({ numLabel, title, desc, side, enter, exit, accent }) => {
  const y = (1 - enter) * 54 + exit * 42;
  const op = enter * (1 - exit);
  const scale = 0.985 + 0.015 * enter;

  return (
    <div
      style={{
        position: "absolute",
        bottom: CARD_BOTTOM,
        left: side === "left" ? SAFE + 54 : undefined,
        right: side === "right" ? SAFE + 54 : undefined,
        width: CARD_W,
        opacity: op,
        transform: `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(
          4
        )})`,
        transformOrigin: side === "left" ? "0% 100%" : "100% 100%",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          padding: "30px 44px 32px 40px",
          borderRadius: 24,
          background: `linear-gradient(180deg, ${rgba(
            "#0F2028",
            0.66
          )} 0%, ${rgba("#071318", 0.78)} 100%)`,
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: `1px solid ${rgba(CREAM, 0.17)}`,
          boxShadow: `0 40px 96px rgba(0,0,0,0.58), 0 12px 30px rgba(0,0,0,0.34), inset 0 1px 0 ${rgba(
            CREAM,
            0.09
          )}`,
        }}
      >
        {/* número */}
        <div style={{ flex: "0 0 auto", textAlign: "center", minWidth: 96 }}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 5,
              color: rgba(CREAM, 0.42),
              marginBottom: 4,
            }}
          >
            PASO
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 0.92,
              color: accent.hot,
              letterSpacing: -3,
              textShadow: `0 0 34px ${rgba(accent.hot, 0.4)}`,
            }}
          >
            {numLabel}
          </div>
        </div>

        {/* filete */}
        <div
          style={{
            flex: "0 0 auto",
            width: 2,
            alignSelf: "stretch",
            borderRadius: 1,
            background: `linear-gradient(180deg, ${rgba(
              accent.hot,
              0
            )} 0%, ${rgba(accent.hot, 0.55)} 34%, ${rgba(
              CREAM,
              0.14
            )} 100%)`,
          }}
        />

        {/* texto */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -0.8,
              color: CREAM,
            }}
          >
            {title}
          </div>
          {desc ? (
            <div
              style={{
                fontFamily: INTER,
                fontSize: 25,
                fontWeight: 500,
                lineHeight: 1.34,
                letterSpacing: 0.1,
                color: rgba(CREAM, 0.68),
                marginTop: 10,
              }}
            >
              {desc}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/* ================================ ESCENA ================================= */
export const RecetaEscena: React.FC<{
  durationInFrames: number;
  title?: string;
  steps?: { image: string; num?: string; title: string; desc?: string }[];
  tone?: "teal" | "warn" | "danger";
}> = ({ durationInFrames, title, steps = [], tone = "teal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent: Accent = ACCENTS[tone as Tone] || ACCENTS.teal;
  const list: Step[] = Array.isArray(steps) ? steps : [];
  const n = list.length;
  const total = durationInFrames > 1 ? durationInFrames : 1;

  /* ---- rótulo de sección (siempre presente, opacidad baja) ---- */
  const labelIn = interpolate(frame, [0, total * 0.045], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const labelOut = interpolate(
    frame,
    [total * 0.955, total],
    [1, 0],
    { ...CLAMP, easing: EASE_SOFT }
  );

  /* ================= CASO VACÍO: no puede explotar ================= */
  if (n === 0) {
    const soloIn = interpolate(frame, [0, total * 0.12], [0, 1], {
      ...CLAMP,
      easing: EASE_OUT,
    });
    const soloDrift = interpolate(frame, [0, total], [10, -10], {
      ...CLAMP,
      easing: Easing.linear,
    });
    return (
      <AbsoluteFill style={{ backgroundColor: BG }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 100% at 50% 34%, ${rgba(
              accent.cool,
              0.16
            )} 0%, ${BG} 56%, ${BG_DEEP} 100%)`,
          }}
        />
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${SAFE + 40}px`,
          }}
        >
          <div
            style={{
              fontFamily: INTER,
              fontSize: 66,
              fontWeight: 800,
              letterSpacing: -1,
              color: CREAM,
              textAlign: "center",
              opacity: soloIn * labelOut,
              transform: `translate3d(0, ${(
                soloDrift +
                (1 - soloIn) * 26
              ).toFixed(2)}px, 0)`,
              textShadow: "0 18px 50px rgba(0,0,0,0.55)",
            }}
          >
            {title || ""}
          </div>
          <div
            style={{
              width: 200,
              height: 3,
              borderRadius: 2,
              marginTop: 34,
              opacity: soloIn * labelOut,
              transform: `scaleX(${soloIn.toFixed(3)})`,
              background: `linear-gradient(90deg, ${rgba(
                accent.hot,
                0
              )}, ${accent.hot}, ${rgba(accent.hot, 0)})`,
            }}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background: `radial-gradient(130% 100% at 50% 50%, transparent 52%, rgba(0,0,0,0.5) 100%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  /* ===================== REPARTO DEL TIEMPO (fracciones) ===================== */
  const slot = total / n;
  const trans = slot * 0.2; // duración de la transición
  const idx = Math.min(n - 1, Math.max(0, Math.floor(frame / slot)));
  const local = frame - idx * slot;
  const p = clamp01(local / slot);

  const inTrans = idx > 0 && local < trans;
  const tRaw = inTrans ? clamp01(local / trans) : 1;
  const t = interpolate(tRaw, [0, 1], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });

  // dirección del whip: alterna por índice
  const dir = idx % 2 === 0 ? 1 : -1;

  /* ------------------------ foto ENTRANTE (paso idx) ------------------------ */
  const kbIn = interpolate(p, [0, 1], [0, 1], { ...CLAMP, easing: EASE_SOFT });
  const inOffset = inTrans ? (1 - t) * dir * 640 : 0;
  const inScaleMul = inTrans ? 1 + (1 - t) * 0.14 : 1;
  const inOpacity = inTrans
    ? interpolate(tRaw, [0, 0.3], [0, 1], { ...CLAMP, easing: EASE_SOFT })
    : 1;
  const blurT = inTrans ? Math.sin(Math.PI * tRaw) : 0;

  /* ------------------------ foto SALIENTE (paso idx-1) ---------------------- */
  const prev = inTrans ? list[idx - 1] : null;
  const pPrev = inTrans ? clamp01((slot + local) / slot) : 0;
  const kbOut = interpolate(pPrev, [0, 1], [0, 1], {
    ...CLAMP,
    easing: EASE_SOFT,
  });
  const outOffset = -t * dir * 520;
  const outScaleMul = 1 - t * 0.08;
  const outOpacity = interpolate(tRaw, [0.5, 1], [1, 0], {
    ...CLAMP,
    easing: EASE_SOFT,
  });

  /* ------------------------------ TARJETA ---------------------------------- */
  const cardStart = idx === 0 ? slot * 0.05 : trans * 0.55;
  const enter = spring({
    frame: local - cardStart,
    fps,
    durationInFrames: Math.max(1, Math.round(slot * 0.26)),
    config: { damping: 200, mass: 0.62, stiffness: 108 },
  });
  const exit = interpolate(
    local,
    [slot - trans * 0.9, slot - trans * 0.12],
    [0, 1],
    { ...CLAMP, easing: EASE_SOFT }
  );
  const cur = list[idx];
  const numLabel = cur && cur.num ? cur.num : twoDigits(idx + 1);
  const side: "left" | "right" = idx % 2 === 0 ? "left" : "right";

  /* --------------------------- BARRA DE PROGRESO ---------------------------- */
  const pEased = interpolate(p, [0, 1], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const overall = clamp01((idx + pEased) / n);
  const railW = W - SAFE * 2;
  const barIn = interpolate(frame, [0, total * 0.04], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });

  /* ------------------------------ puntos (rail) ----------------------------- */
  const dotGap = 46;
  const railTop = H / 2 - ((n - 1) * dotGap) / 2;

  const srcOf = (s: Step | null): string | null =>
    s && typeof s.image === "string" && s.image.length > 0
      ? staticFile(s.image)
      : null;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* fondo base (queda debajo si alguna foto no cubre) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${BG} 0%, ${BG_DEEP} 100%)`,
        }}
      />

      {/* ------- SOLO 2 FOTOS MONTADAS: la saliente y la entrante ------- */}
      {prev ? (
        <PhotoPlate
          src={srcOf(prev)}
          kb={kbOut}
          panSign={(idx - 1) % 2 === 0 ? 1 : -1}
          offsetX={outOffset}
          scaleMul={outScaleMul}
          blur={blurT * 16}
          opacity={outOpacity}
          fallback={accent.cool}
        />
      ) : null}

      <PhotoPlate
        src={srcOf(cur || null)}
        kb={kbIn}
        panSign={idx % 2 === 0 ? 1 : -1}
        offsetX={inOffset}
        scaleMul={inScaleMul}
        blur={blurT * 13}
        opacity={inOpacity}
        fallback={accent.cool}
      />

      {/* destello que barre la costura de la transición */}
      {inTrans ? (
        <AbsoluteFill
          style={{ overflow: "hidden", mixBlendMode: "screen", opacity: blurT }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              bottom: -40,
              width: 380,
              left: 0,
              transform: `translate3d(${(dir > 0
                ? -420 + t * (W + 840)
                : W + 420 - t * (W + 840)
              ).toFixed(2)}px, 0, 0)`,
              background: `linear-gradient(90deg, ${rgba(
                accent.hot,
                0
              )} 0%, ${rgba(accent.hot, 0.14)} 42%, ${rgba(
                CREAM,
                0.1
              )} 58%, ${rgba(accent.hot, 0)} 100%)`,
              filter: "blur(6px)",
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* ------------------------- GRADO / SCRIMS ------------------------- */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${rgba(
            "#061115",
            0.72
          )} 0%, ${rgba("#061115", 0.16)} 16%, transparent 30%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(0deg, ${rgba(
            "#061115",
            0.88
          )} 0%, ${rgba("#061115", 0.42)} 26%, transparent 54%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${rgba(
            "#061115",
            0.44
          )} 0%, transparent 24%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(128% 100% at 50% 48%, transparent 50%, rgba(0,0,0,0.52) 100%)",
        }}
      />

      {/* -------------------------- BARRA DE PROGRESO -------------------------- */}
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 98,
          width: railW,
          height: 3,
          borderRadius: 2,
          background: rgba(CREAM, 0.14),
          opacity: barIn * labelOut,
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: (railW * overall).toFixed(2) + "px",
            borderRadius: 2,
            background: `linear-gradient(90deg, ${rgba(accent.cool, 0.7)} 0%, ${
              accent.hot
            } 100%)`,
            boxShadow: `0 0 18px ${rgba(accent.hot, 0.55)}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -3.5,
            left: (railW * overall - 5).toFixed(2) + "px",
            width: 10,
            height: 10,
            borderRadius: 5,
            background: accent.hot,
            boxShadow: `0 0 22px ${rgba(accent.hot, 0.85)}`,
          }}
        />
      </div>

      {/* --------------------------- RÓTULO DE SECCIÓN -------------------------- */}
      {title ? (
        <div
          style={{
            position: "absolute",
            left: SAFE,
            top: 126,
            fontFamily: INTER,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 6.5,
            color: CREAM,
            opacity: 0.34 * labelIn * labelOut,
            transform: `translate3d(0, ${((1 - labelIn) * 14).toFixed(
              2
            )}px, 0)`,
            textShadow: "0 6px 22px rgba(0,0,0,0.6)",
          }}
        >
          {title.toUpperCase()}
        </div>
      ) : null}

      {/* --------------------------- COLUMNA DE PUNTOS -------------------------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          opacity: barIn * labelOut,
        }}
      >
        {list.map((_s, i) => {
          const active = i === idx;
          const done = i < idx;
          const pulse = active
            ? interpolate(p, [0, 1], [1, 0.86], { ...CLAMP, easing: EASE_SOFT })
            : 1;
          const size = active ? 15 * pulse + 3 : done ? 9 : 7;
          const color = active
            ? accent.hot
            : done
            ? rgba(CREAM, 0.42)
            : rgba(CREAM, 0.17);
          return (
            <div
              key={"dot-" + i}
              style={{
                position: "absolute",
                left: RAIL_X - size / 2,
                top: railTop + i * dotGap - size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                background: color,
                boxShadow: active
                  ? `0 0 20px ${rgba(accent.hot, 0.75)}`
                  : "none",
              }}
            />
          );
        })}
        {/* hilo vertical que une los puntos */}
        <div
          style={{
            position: "absolute",
            left: RAIL_X - 0.5,
            top: railTop,
            width: 1,
            height: Math.max(0, (n - 1) * dotGap),
            background: `linear-gradient(180deg, ${rgba(
              CREAM,
              0.06
            )} 0%, ${rgba(CREAM, 0.18)} 50%, ${rgba(CREAM, 0.06)} 100%)`,
          }}
        />
      </div>

      {/* ------------------------------- TARJETA -------------------------------- */}
      {cur ? (
        <GlassCard
          numLabel={numLabel}
          title={cur.title}
          desc={cur.desc}
          side={side}
          enter={clamp01(enter)}
          exit={clamp01(exit)}
          accent={accent}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export default RecetaEscena;
