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

// ── LineaTiempoPiel — la CRONOLOGÍA sobre un riel, con cámara que viaja ──────
//
// Un riel horizontal cruza la pantalla. De él cuelgan tarjetas de FOTO, una por
// hito (a los 25 arranca la caída · en la menopausia se derrumba · a los 60 se
// ve en las manos). La CÁMARA se desplaza lateralmente por el riel y frena en
// cada hito: la tarjeta activa queda centrada, enfocada, elevada y con sombra
// larga; las vecinas quedan chicas, oscurecidas y con blur leve (rack focus).
//
// Profundidad real = DOS capas de parallax a distinta velocidad que el riel:
//   · capa lejana  (0.20×) — trama de fibras muy tenue (dermis / colágeno)
//   · capa media   (0.46×) — degradé de luz que respira
// Sobre el riel corre una BARRA DE AVANCE que se llena entre hito e hito, con
// una cabeza que brilla. Si el hito trae `alert`, el acento vira al CORAL y la
// marca del riel LATE UNA VEZ (anillo que se expande y muere).
//
// Self-contained: SOLO importa de 'react', 'remotion' y @remotion/google-fonts/Inter.
// Determinista (PRNG sembrado, cero Math.random / Date.now).
// Todos los tiempos son FRACCIONES de durationInFrames.
// Como mucho 3 tarjetas con <Img> montadas a la vez (activa + vecinas).

const INTER = loadInter().fontFamily;
const SERIF = "Georgia, 'Times New Roman', serif";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_CAM = Easing.bezier(0.34, 0, 0.1, 1); // travelling: arranca lento, frena largo
const EASE_SOFT = Easing.bezier(0.4, 0, 0.2, 1); // foco / opacidades
const EASE_OUT = Easing.out(Easing.cubic);

/* ------------------------------- color ---------------------------------- */

type RGB = [number, number, number];

const hexRgb = (hex: string): RGB => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2) : h;
  const n = Number.parseInt(full.length === 6 ? full : "000000", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const css = (c: RGB, a = 1): string => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

const lerpRgb = (a: RGB, b: RGB, t: number): RGB => {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
};

const BG = "#0E1D23";
const TEAL = hexRgb("#12B3AE");
const TEAL_HI = hexRgb("#3FE0D6");
const AMBER = hexRgb("#E8B96B");
const AMBER_HI = hexRgb("#F3D9AC");
const CORAL = hexRgb("#E0523E");
const CORAL_HI = hexRgb("#F08C79");
const CREAM = hexRgb("#F3ECDD");
const INK = hexRgb("#0A171C");

/* ------------------------------- helpers -------------------------------- */

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);
const mod = (n: number, m: number): number => ((n % m) + m) % m;
const pad2 = (n: number): string => (n < 10 ? "0" + n : String(n));

// PRNG sembrado (mulberry32) — nunca Math.random() pelado
const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* ------------------------------- layout --------------------------------- */

const W = 1920;
const H = 1080;
const SAFE = 120; // > 90 px pedidos
const RAIL_Y = 856;
const SPACING = 620;
const CARD_W = 470;
const PAD = 14;
const PHOTO_H = 330;
const STRIP_H = 168;
const CARD_H = PAD * 2 + PHOTO_H + STRIP_H; // 526
const STEM = 40;
const CARD_TOP = RAIL_Y - STEM - CARD_H; // 290
const TILE_W = 960;

const INTRO = 0.07; // fracción de la duración para que entren título + riel
const TRAVEL = 0.36; // qué parte de cada tramo es viaje (el resto, reposo)

type Mark = { image?: string; label: string; sub?: string; alert?: boolean };

type Strand = { x: number; y: number; len: number; rot: number; w: number; o: number };

/* ------------------------------ componente ------------------------------ */

export const LineaTiempoPiel: React.FC<{
  durationInFrames: number;
  title?: string;
  marks?: { image?: string; label: string; sub?: string; alert?: boolean }[];
  tone?: "teal" | "warn" | "danger";
}> = ({ durationInFrames, title, marks = [], tone = "teal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const D = Math.max(1, durationInFrames);
  const t = clamp01(frame / D);

  // trama de fibras: se genera UNA vez, sembrada → mismo dibujo en cada frame/máquina
  const strands = React.useMemo<Strand[]>(() => {
    const rnd = mulberry32(70425);
    const out: Strand[] = [];
    for (let i = 0; i < 26; i++) {
      out.push({
        x: rnd() * TILE_W,
        y: rnd() * H,
        len: 240 + rnd() * 560,
        rot: -38 + rnd() * 76,
        w: 1 + rnd() * 1.7,
        o: 0.025 + rnd() * 0.055,
      });
    }
    return out;
  }, []);

  const list: Mark[] = marks;
  const N = list.length;

  // paleta según tone
  const base = tone === "danger" ? CORAL : tone === "warn" ? AMBER : TEAL;
  const baseHi = tone === "danger" ? CORAL_HI : tone === "warn" ? AMBER_HI : TEAL_HI;

  /* ---- cámara: cursor flotante sobre el riel (fracciones, nunca frames) ---- */
  const slot = N > 0 ? (1 - INTRO) / N : 1;

  let cursor = 0;
  if (N > 0) {
    if (t <= INTRO) {
      // asentada de entrada: el riel llega desde la izquierda y frena
      cursor = interpolate(t, [0, INTRO], [-0.3, 0], { ...CLAMP, easing: EASE_OUT });
    } else {
      const raw = (t - INTRO) / slot;
      const j = Math.min(N - 1, Math.floor(raw));
      const local = raw - j;
      const seg = interpolate(local, [0, TRAVEL], [0, 1], { ...CLAMP, easing: EASE_CAM });
      cursor = j === 0 ? 0 : j - 1 + seg;
    }
  }

  // arranque de cada hito, en FRAMES (derivado de fracciones)
  const arriveOf = (j: number): number => D * (j === 0 ? INTRO * 0.55 : INTRO + j * slot + slot * TRAVEL);
  const slotFrames = slot * D;

  // 1 = quieto en un hito, 0 = a mitad de camino
  const settle = 1 - Math.min(1, Math.abs(cursor - Math.round(cursor)) * 2);
  const settleE = interpolate(settle, [0, 1], [0, 1], { ...CLAMP, easing: EASE_SOFT });

  // ¿el hito enfocado es de ALARMA? (mezcla continua, no un salto de color)
  let alertness = 0;
  for (let i = 0; i < N; i++) {
    if (!list[i].alert) continue;
    const f = interpolate(Math.abs(i - cursor), [0, 1], [1, 0], { ...CLAMP, easing: EASE_SOFT });
    if (f > alertness) alertness = f;
  }
  const ACC = lerpRgb(base, CORAL, alertness);
  const ACC_HI = lerpRgb(baseHi, CORAL_HI, alertness);

  /* ---------------------------- cámara / parallax ---------------------------- */
  const railX = W / 2 - cursor * SPACING;
  const parFar = railX * 0.2;
  const parMid = railX * 0.46;

  // push-in lento de toda la escena (nada estático) + asentada inicial
  const introS = spring({ frame, fps, config: { damping: 30, mass: 1.1, stiffness: 62 } });
  const stageScale =
    // techo de zoom acotado: con SAFE=120 el título nunca baja de ~95 px del borde
    interpolate(introS, [0, 1], [1.03, 1], { ...CLAMP }) *
    interpolate(t, [0, 1], [1, 1.025], { ...CLAMP, easing: EASE_SOFT });

  const titleSp = spring({ frame: frame - 3, fps, config: { damping: 26, mass: 1, stiffness: 78 } });
  const railSp = spring({ frame: frame - 6, fps, config: { damping: 34, mass: 1.2, stiffness: 58 } });

  /* ------------------------------- fondo ---------------------------------- */
  const breath = Math.sin(frame / 96);
  const breath2 = Math.sin(frame / 137 + 1.2);

  const background = (
    <>
      <AbsoluteFill style={{ background: BG }} />

      {/* CAPA LEJANA (0.20×) — trama de fibras, tileada, sin costura */}
      <AbsoluteFill
        style={{
          opacity: 0.85 * introS,
          filter: `blur(${0.6 + (1 - settleE) * 1.8}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${mod(parFar, TILE_W) - TILE_W}px)`,
          }}
        >
          {[0, 1, 2, 3].map((tile) => (
            <div key={tile} style={{ position: "absolute", left: tile * TILE_W, top: 0, width: TILE_W, height: H }}>
              {strands.map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: s.x,
                    top: s.y,
                    width: s.len,
                    height: s.w,
                    borderRadius: s.w,
                    transform: `rotate(${s.rot}deg)`,
                    transformOrigin: "left center",
                    background: `linear-gradient(90deg, ${css(CREAM, 0)}, ${css(CREAM, s.o)} 42%, ${css(
                      ACC_HI,
                      s.o * 0.75,
                    )} 68%, ${css(CREAM, 0)})`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* CAPA MEDIA (0.46×) — degradé de luz que respira */}
      <AbsoluteFill
        style={{
          opacity: (0.7 + 0.3 * settleE) * introS,
          filter: `blur(${(1 - settleE) * 4}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -220,
            transform: `translateX(${parMid}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 40,
              width: 1500,
              height: 1500,
              borderRadius: "50%",
              transform: `scale(${1 + breath * 0.05})`,
              background: `radial-gradient(circle at 50% 50%, ${css(ACC, 0.2)} 0%, ${css(ACC, 0.07)} 38%, ${css(
                ACC,
                0,
              )} 68%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 1180,
              top: 320,
              width: 1250,
              height: 1250,
              borderRadius: "50%",
              transform: `scale(${1 + breath2 * 0.06})`,
              background: `radial-gradient(circle at 50% 50%, ${css(AMBER, 0.13)} 0%, ${css(AMBER, 0.045)} 40%, ${css(
                AMBER,
                0,
              )} 70%)`,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* haz de foco: columna de luz donde frena la cámara */}
      <AbsoluteFill
        style={{
          opacity: (0.34 + 0.66 * settleE) * introS,
          background: `radial-gradient(ellipse 620px 780px at ${W / 2}px ${CARD_TOP + CARD_H * 0.42}px, ${css(
            ACC,
            0.16,
          )} 0%, ${css(ACC, 0.05)} 45%, ${css(ACC, 0)} 72%)`,
        }}
      />
    </>
  );

  const foreground = (
    <>
      {/* piso: la sombra del riel derramada hacia abajo */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${css(INK, 0)} ${RAIL_Y - 40}px, ${css(INK, 0.5)} ${RAIL_Y + 120}px, ${css(
            INK,
            0.86,
          )} ${H}px)`,
        }}
      />
      {/* viñeta */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1180px 720px at 50% 46%, ${css(INK, 0)} 0%, ${css(INK, 0.22)} 62%, ${css(
            INK,
            0.62,
          )} 100%)`,
        }}
      />
      {/* grano finísimo (determinista, patrón CSS) */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: `repeating-linear-gradient(37deg, ${css(CREAM, 0.5)} 0px, ${css(
            CREAM,
            0,
          )} 1px, ${css(CREAM, 0)} 3px), repeating-linear-gradient(-53deg, ${css(CREAM, 0.35)} 0px, ${css(
            CREAM,
            0,
          )} 1px, ${css(CREAM, 0)} 4px)`,
        }}
      />
    </>
  );

  /* ------------------------------- título --------------------------------- */
  const titleBlock = title ? (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        top: 112,
        opacity: titleSp,
        transform: `translateY(${interpolate(titleSp, [0, 1], [26, 0], CLAMP)}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: interpolate(titleSp, [0, 1], [0, 54], CLAMP),
            height: 3,
            borderRadius: 2,
            background: css(ACC_HI, 0.95),
          }}
        />
        <div
          style={{
            fontFamily: INTER,
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: css(ACC_HI, 0.92),
          }}
        >
          Línea de tiempo
        </div>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 60,
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: -1,
          color: css(CREAM, 0.98),
          maxWidth: 1180,
          textShadow: `0 12px 34px ${css(INK, 0.65)}`,
        }}
      >
        {title}
      </div>
    </div>
  ) : null;

  /* ---- caso borde: sin marcas → sólo el título, sin explotar ni dividir ---- */
  if (N === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: BG, fontFamily: INTER, overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${stageScale})` }}>
          {background}
          {titleBlock}
        </AbsoluteFill>
        {foreground}
      </AbsoluteFill>
    );
  }

  /* ------------------------------- el riel -------------------------------- */
  const worldLeft = -1700;
  const worldRight = (N - 1) * SPACING + 1700;
  const worldW = worldRight - worldLeft;

  const activeIdx = Math.max(0, Math.min(N - 1, Math.round(cursor)));
  const progressW = Math.max(0, cursor * SPACING + 150);

  const counter = (
    <div
      style={{
        position: "absolute",
        right: SAFE,
        top: 118,
        textAlign: "right",
        opacity: titleSp,
        transform: `translateY(${interpolate(titleSp, [0, 1], [18, 0], CLAMP)}px)`,
        fontFamily: INTER,
      }}
    >
      <div style={{ fontSize: 66, fontWeight: 900, letterSpacing: -2, color: css(ACC_HI, 0.96), lineHeight: 1 }}>
        {pad2(activeIdx + 1)}
        <span style={{ fontSize: 32, fontWeight: 700, color: css(CREAM, 0.4) }}> / {pad2(N)}</span>
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: css(CREAM, 0.42),
        }}
      >
        Hitos
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: INTER, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${stageScale})` }}>
        {background}

        {/* ===================== MUNDO DEL RIEL (viaja) ====================== */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 0,
            height: H,
            transform: `translateX(${railX}px)`,
          }}
        >
          {/* línea base del riel, se dibuja de izquierda a derecha en la entrada */}
          <div
            style={{
              position: "absolute",
              left: worldLeft,
              top: RAIL_Y - 1,
              width: worldW,
              height: 2,
              transform: `scaleX(${railSp})`,
              transformOrigin: `${-worldLeft - 260}px center`,
              background: `linear-gradient(90deg, ${css(CREAM, 0)}, ${css(CREAM, 0.2)} 12%, ${css(
                CREAM,
                0.2,
              )} 88%, ${css(CREAM, 0)})`,
            }}
          />

          {/* marcas menores: la "regla" entre hito e hito */}
          {N > 1
            ? list.slice(0, N - 1).map((_, i) =>
                [0.2, 0.4, 0.6, 0.8].map((f) => (
                  <div
                    key={`m${i}-${f}`}
                    style={{
                      position: "absolute",
                      left: (i + f) * SPACING - 1,
                      top: RAIL_Y + 2,
                      width: 2,
                      height: 11,
                      opacity: 0.22 * railSp,
                      background: css(CREAM, 0.7),
                    }}
                  />
                )),
              )
            : null}

          {/* BARRA DE AVANCE sobre el riel */}
          <div
            style={{
              position: "absolute",
              left: -150,
              top: RAIL_Y - 3,
              width: progressW,
              height: 6,
              borderRadius: 3,
              opacity: railSp,
              background: `linear-gradient(90deg, ${css(ACC, 0)} 0%, ${css(ACC, 0.55)} 22%, ${css(ACC_HI, 1)} 100%)`,
              boxShadow: `0 0 26px ${css(ACC, 0.55)}`,
            }}
          />
          {/* cabeza de la barra */}
          <div
            style={{
              position: "absolute",
              left: cursor * SPACING - 9,
              top: RAIL_Y - 9,
              width: 18,
              height: 18,
              borderRadius: 9,
              opacity: railSp,
              background: css(ACC_HI, 1),
              transform: `scale(${0.86 + settleE * 0.28})`,
              boxShadow: `0 0 30px ${css(ACC_HI, 0.85)}, 0 0 68px ${css(ACC, 0.45)}`,
            }}
          />

          {/* marcas de hito + latido de alarma */}
          {list.map((m, i) => {
            const d = Math.abs(i - cursor);
            const f = interpolate(d, [0, 1], [1, 0], { ...CLAMP, easing: EASE_SOFT });
            const arrive = arriveOf(i);
            const isAlert = m.alert === true;
            // el latido: UNA vez, al llegar
            const pulse = isAlert
              ? interpolate(frame - arrive, [0, 4, 22], [0, 1, 0], { ...CLAMP, easing: EASE_OUT })
              : 0;
            const dotC = lerpRgb(CREAM, isAlert ? CORAL_HI : ACC_HI, f);
            return (
              <div key={`k${i}`} style={{ position: "absolute", left: i * SPACING, top: RAIL_Y, opacity: railSp }}>
                <div
                  style={{
                    position: "absolute",
                    left: -1,
                    top: -22 - 16 * f,
                    width: 2,
                    height: 22 + 16 * f,
                    background: `linear-gradient(180deg, ${css(dotC, 0)}, ${css(dotC, 0.45 + 0.4 * f)})`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: -7 - 3 * f,
                    top: -7 - 3 * f,
                    width: 14 + 6 * f,
                    height: 14 + 6 * f,
                    borderRadius: 20,
                    background: css(dotC, 0.35 + 0.65 * f),
                    transform: `scale(${1 + pulse * 0.55})`,
                    boxShadow: f > 0.02 ? `0 0 ${18 + 26 * f}px ${css(dotC, 0.6 * f)}` : "none",
                  }}
                />
                {pulse > 0.002 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: -13,
                      top: -13,
                      width: 26,
                      height: 26,
                      borderRadius: 26,
                      border: `2px solid ${css(CORAL_HI, 0.9 * pulse)}`,
                      transform: `scale(${1 + (1 - pulse) * 3.4})`,
                    }}
                  />
                ) : null}
              </div>
            );
          })}

          {/* ================= TARJETAS (máximo 3 montadas) ================= */}
          {list.map((m, i) => {
            if (Math.abs(i - activeIdx) > 1) return null;

            const d = Math.abs(i - cursor);
            const f = interpolate(d, [0, 1], [1, 0], { ...CLAMP, easing: EASE_SOFT });
            const vis = interpolate(d, [1, 1.5], [1, 0], CLAMP);

            const arrive = arriveOf(i);
            const arrSp = spring({
              frame: frame - arrive,
              fps,
              config: { damping: 24, mass: 1, stiffness: 84 },
            });
            const lblSp = spring({
              frame: frame - arrive - 5,
              fps,
              config: { damping: 24, mass: 1, stiffness: 92 },
            });
            const subSp = spring({
              frame: frame - arrive - 13,
              fps,
              config: { damping: 25, mass: 1, stiffness: 92 },
            });

            const scale = 0.8 + 0.2 * f;
            const lift = -34 * f - interpolate(arrSp, [0, 1], [46, 0], CLAMP) * f;
            const blur = (1 - f) * 3.6;
            const bright = 0.5 + 0.5 * f;
            const opacity = (0.26 + 0.74 * f) * vis * Math.max(0.001, introS);

            const isAlert = m.alert === true;
            const cardAcc = lerpRgb(base, CORAL, isAlert ? 1 : 0);
            const cardAccHi = lerpRgb(baseHi, CORAL_HI, isAlert ? 1 : 0);

            // Ken Burns lento durante el reposo del hito
            const kb = interpolate(frame, [arrive, arrive + slotFrames], [1.05, 1.13], {
              ...CLAMP,
              easing: EASE_SOFT,
            });

            const hasImg = typeof m.image === "string" && m.image.length > 0;

            return (
              <div
                key={`c${i}`}
                style={{
                  position: "absolute",
                  left: i * SPACING - CARD_W / 2,
                  top: CARD_TOP,
                  width: CARD_W,
                  height: CARD_H,
                  opacity,
                  transform: `translateY(${lift}px) scale(${scale})`,
                  transformOrigin: "center bottom",
                  filter: `blur(${blur}px) brightness(${bright})`,
                }}
              >
                {/* colgadera: del pie de la tarjeta al riel */}
                <div
                  style={{
                    position: "absolute",
                    left: CARD_W / 2 - 1,
                    top: CARD_H,
                    width: 2,
                    height: STEM - lift * 0.9,
                    background: `linear-gradient(180deg, ${css(cardAccHi, 0.7 * f + 0.15)}, ${css(cardAccHi, 0)})`,
                  }}
                />

                {/* cuerpo de la tarjeta */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    padding: PAD,
                    background: `linear-gradient(168deg, ${css(CREAM, 0.1)} 0%, ${css(INK, 0.9)} 26%, ${css(
                      INK,
                      0.97,
                    )} 100%)`,
                    border: `1px solid ${css(isAlert ? CORAL : CREAM, 0.08 + 0.2 * f)}`,
                    boxShadow: `0 ${26 + 34 * f}px ${52 + 56 * f}px ${css(INK, 0.3 + 0.34 * f)}, 0 ${
                      60 + 90 * f
                    }px ${120 + 120 * f}px ${css(INK, 0.2 + 0.24 * f)}`,
                  }}
                >
                  {/* FOTO */}
                  <div
                    style={{
                      position: "relative",
                      width: CARD_W - PAD * 2,
                      height: PHOTO_H,
                      borderRadius: 15,
                      overflow: "hidden",
                      background: `linear-gradient(150deg, ${css(cardAcc, 0.35)}, ${css(INK, 0.95)})`,
                    }}
                  >
                    {hasImg ? (
                      <Img
                        src={staticFile(m.image as string)}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: `scale(${kb})`,
                        }}
                      />
                    ) : (
                      // sin foto: panel de color con el rótulo (NUNCA staticFile(undefined))
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 34px",
                          background: `radial-gradient(ellipse at 30% 20%, ${css(cardAccHi, 0.42)} 0%, ${css(
                            cardAcc,
                            0.24,
                          )} 42%, ${css(INK, 0.92)} 100%)`,
                          transform: `scale(${kb * 0.97})`,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: SERIF,
                            fontSize: 42,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            textAlign: "center",
                            color: css(CREAM, 0.94),
                            textShadow: `0 8px 26px ${css(INK, 0.8)}`,
                          }}
                        >
                          {m.label}
                        </div>
                      </div>
                    )}

                    {/* scrim inferior de la foto (profundidad) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(180deg, ${css(INK, 0)} 46%, ${css(INK, 0.62)} 100%)`,
                      }}
                    />
                    {/* índice */}
                    <div
                      style={{
                        position: "absolute",
                        left: 16,
                        top: 14,
                        padding: "6px 13px",
                        borderRadius: 9,
                        background: css(INK, 0.62),
                        border: `1px solid ${css(cardAccHi, 0.45)}`,
                        fontSize: 19,
                        fontWeight: 900,
                        letterSpacing: 1.6,
                        color: css(cardAccHi, 0.96),
                      }}
                    >
                      {pad2(i + 1)}
                    </div>
                    {/* esquina de alarma (sin texto, sin emoji) */}
                    {isAlert ? (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          width: 96,
                          height: 96,
                          background: `linear-gradient(225deg, ${css(CORAL, 0.9)} 0%, ${css(CORAL, 0.32)} 46%, ${css(
                            CORAL,
                            0,
                          )} 62%)`,
                        }}
                      />
                    ) : null}
                    {/* línea de acento que crece bajo la foto */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        height: 3,
                        width: `${interpolate(lblSp, [0, 1], [0, 100], CLAMP)}%`,
                        background: `linear-gradient(90deg, ${css(cardAccHi, 0.95)}, ${css(cardAcc, 0.35)})`,
                      }}
                    />
                  </div>

                  {/* FRANJA: rótulo + detalle, entrada escalonada */}
                  <div
                    style={{
                      position: "relative",
                      height: STRIP_H,
                      paddingTop: 22,
                      paddingLeft: 20,
                      paddingRight: 16,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 24,
                        width: 4,
                        height: interpolate(lblSp, [0, 1], [0, STRIP_H - 56], CLAMP),
                        borderRadius: 3,
                        background: `linear-gradient(180deg, ${css(cardAccHi, 1)}, ${css(cardAcc, 0.25)})`,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: INTER,
                        fontSize: 37,
                        fontWeight: 900,
                        letterSpacing: -0.6,
                        lineHeight: 1.08,
                        color: css(CREAM, 0.99),
                        opacity: lblSp,
                        transform: `translateY(${interpolate(lblSp, [0, 1], [30, 0], CLAMP)}px)`,
                      }}
                    >
                      {m.label}
                    </div>
                    {m.sub ? (
                      <div
                        style={{
                          marginTop: 12,
                          fontFamily: INTER,
                          fontSize: 24,
                          fontWeight: 500,
                          lineHeight: 1.28,
                          color: css(CREAM, 0.66),
                          opacity: subSp,
                          transform: `translateY(${interpolate(subSp, [0, 1], [22, 0], CLAMP)}px)`,
                        }}
                      >
                        {m.sub}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {titleBlock}
        {counter}
      </AbsoluteFill>
      {foreground}
    </AbsoluteFill>
  );
};
