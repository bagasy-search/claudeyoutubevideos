import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── FdRazonCarousel — opener de capítulo con CARRUSEL 3D ─────────────────────
// Un anillo de tarjetas flotantes (foto + título) gira en perspectiva real
// (rotateY + translateZ + blur/escala por profundidad) y ATERRIZA en la tarjeta
// `focus`, que queda al frente, se agranda, se DESBLOQUEA (velo + candado que se
// disuelven) y canta su título. `intro` hace una vuelta completa la primera vez.
//
// Uso (beat kind "razoncarousel"):
//   { kind:"razoncarousel", cards:[{index:1,name:"LA CAMA",image:"img/fd101.jpg"}, ...],
//     focus:2, intro:false, eyebrow:"RAZÓN 3", kicker:"LA BOLSA DE LAS MEDICINAS" }
//
// Determinista al 100% (nada de Math.random / Date.now): se rendea en 60 chunks.

const C = {
  paper: "#F4F7F9",
  ink: "#14232B",
  teal: "#109C99",
  tealBright: "#12B3AE",
  tealSoft: "#7FC9C6",
  coral: "#E0523E",
};

const INTER = loadInter().fontFamily;
const FONT = INTER + ", 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VIDEO_RE = /\.(mp4|webm|mov)$/i;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// hash determinista (reemplaza Math.random para el polvo en suspensión)
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type CarouselCard = { index: number; name: string; image?: string };

export type FdRazonCarouselProps = {
  durationInFrames: number;
  cards?: CarouselCard[];
  focus?: number;
  intro?: boolean;
  eyebrow?: string;
  kicker?: string;
};

// ── placeholder elegante cuando no hay foto ─────────────────────────────────
const CardPlaceholder: React.FC<{ n: number; k: number }> = ({ n, k }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(158deg, #1D4048 0%, #122C34 48%, #08161C 100%)",
      overflow: "hidden",
    }}
  >
    {/* trama diagonal muy sutil */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "repeating-linear-gradient(122deg, rgba(127,201,198,0.10) 0px, rgba(127,201,198,0.10) 1px, transparent 1px, transparent 15px)",
        opacity: 0.75,
      }}
    />
    {/* halo teal */}
    <div
      style={{
        position: "absolute",
        inset: "-20%",
        background: "radial-gradient(50% 42% at 50% 34%, rgba(18,179,174,0.30), transparent 72%)",
      }}
    />
    {/* silueta "foto" */}
    <svg
      viewBox="0 0 120 96"
      style={{
        position: "absolute",
        left: "50%",
        top: "44%",
        width: 118 * k,
        transform: "translate(-50%,-50%)",
        opacity: 0.5,
      }}
    >
      <rect x="6" y="10" width="108" height="76" rx="9" fill="none" stroke={C.tealSoft} strokeWidth="2.4" />
      <circle cx="38" cy="35" r="9" fill={C.tealSoft} opacity="0.75" />
      <path d="M12 78 L48 44 L70 64 L86 52 L108 78 Z" fill={C.tealSoft} opacity="0.55" />
    </svg>
    {/* número fantasma */}
    <div
      style={{
        position: "absolute",
        right: 16 * k,
        bottom: -18 * k,
        fontSize: 168 * k,
        fontWeight: 900,
        lineHeight: 1,
        color: "rgba(244,247,249,0.07)",
        letterSpacing: -6 * k,
      }}
    >
      {n}
    </div>
  </div>
);

export const FdRazonCarousel: React.FC<FdRazonCarouselProps> = ({
  durationInFrames,
  cards = [],
  focus = 0,
  intro = false,
  eyebrow,
  kicker,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const k = height / 1080;

  // ── datos a prueba de balas ───────────────────────────────────────────────
  const list: CarouselCard[] = cards && cards.length > 0 ? cards : [{ index: 1, name: "" }];
  const N = list.length;
  const fi = clamp(Math.round(isFinite(focus) ? focus : 0), 0, N - 1);
  const hero = list[fi];

  // ── timing derivado 100% de durationInFrames ──────────────────────────────
  const D = Math.max(24, Math.round(durationInFrames));
  const IN = Math.min(18, Math.max(8, Math.round(D * 0.2)));
  const OUT = Math.min(14, Math.max(6, Math.round(D * 0.16)));
  const landStart = Math.round(IN * 0.3);
  const landCap = Math.max(14, D - OUT - landStart - 8);
  const landDur = Math.min(landCap, clamp(Math.round(D * (intro ? 0.5 : 0.38)), 22, intro ? 80 : 56));
  const landEnd = landStart + landDur;
  const revealAt = landStart + Math.round(landDur * 0.66);
  const unlockDur = clamp(Math.round(D * 0.16), 10, 26);

  // ── motor de la rueda ─────────────────────────────────────────────────────
  const step = 360 / N;
  const targetRing = fi * step;
  const startOffset = intro ? 360 + 78 : 76; // vuelta completa sólo la 1ª vez
  const land = spring({
    frame: frame - landStart,
    fps,
    durationInFrames: Math.max(10, landDur),
    config: { damping: 15, mass: 1.05, stiffness: 90 },
  });
  // deriva viva post-aterrizaje: que no quede una foto congelada en tomas largas
  const idle = frame > landEnd ? Math.sin((frame - landEnd) / (fps * 1.9)) * 1.7 : 0;
  const ring = targetRing - startOffset * (1 - land) + idle;

  // ── reveal / desbloqueo ───────────────────────────────────────────────────
  const rev = spring({
    frame: frame - revealAt,
    fps,
    durationInFrames: clamp(Math.round(D * 0.22), 12, 30),
    config: { damping: 16, mass: 0.8, stiffness: 110 },
  });
  const unl = interpolate(frame, [revealAt, revealAt + unlockDur], [0, 1], CLAMP);
  const pop = interpolate(frame, [revealAt, revealAt + 8], [0, 1], CLAMP); // flash del "click"

  // ── entrada / salida globales ─────────────────────────────────────────────
  const inFade = interpolate(frame, [0, Math.max(4, Math.round(IN * 0.65))], [0, 1], CLAMP);
  const out = interpolate(frame, [D - OUT, D - 1], [1, 0], CLAMP);
  const globalOp = Math.min(inFade, out);
  const stageScale = interpolate(inFade, [0, 1], [0.93, 1]) * (1 + (1 - out) * 0.05);

  // ── geometría 3D ──────────────────────────────────────────────────────────
  const R = 640 * k;
  const CW = 372 * k;
  const CH = 486 * k;
  const ringY = height * 0.425;
  const PERSP = 2150 * k;
  const floorY = ringY + CH * 0.54;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: globalOp }}>
      {/* ── FONDO cinematográfico (nunca transparente ni plano) ── */}
      <AbsoluteFill style={{ background: "linear-gradient(178deg, #0E2129 0%, #0A181E 46%, #060F13 100%)" }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(64% 52% at 50% " +
            ((ringY / height) * 100).toFixed(2) +
            "%, rgba(16,156,153,0.26), rgba(6,15,19,0) 68%)",
        }}
      />
      {/* barrido de luz que acompaña el giro */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(104deg, rgba(127,201,198,0) 34%, rgba(127,201,198,0.10) 50%, rgba(127,201,198,0) 66%)",
          transform: "translateX(" + interpolate(land, [0, 1], [-0.34, 0.3]) * width + "px)",
          opacity: 0.85 * (1 - rev * 0.55),
        }}
      />
      {/* polvo en suspensión (determinista) */}
      <AbsoluteFill style={{ opacity: 0.5 }}>
        {Array.from({ length: 34 }).map((_, i) => {
          const sx = rnd(i + 1);
          const sy = rnd(i + 61);
          const sz = 0.35 + rnd(i + 131) * 0.9;
          const drift = (sy + frame / (fps * (16 + rnd(i + 191) * 26))) % 1;
          const s = (1.4 + rnd(i + 251) * 3.4) * k * sz;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: sx * width,
                top: (1 - drift) * height,
                width: s,
                height: s,
                borderRadius: "50%",
                background: i % 4 === 0 ? C.tealSoft : C.paper,
                opacity: 0.1 + rnd(i + 313) * 0.26,
                filter: "blur(" + 0.6 * k * (2 - sz) + "px)",
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* ── ESCENARIO 3D ── */}
      <AbsoluteFill
        style={{
          perspective: PERSP,
          perspectiveOrigin: "50% " + ringY + "px",
          transform: "scale(" + stageScale + ")",
        }}
      >
        {/* pista/anillo del piso */}
        <div
          style={{
            position: "absolute",
            left: width / 2 - R,
            top: floorY - R * 0.92,
            width: R * 2,
            height: R * 1.84,
            borderRadius: "50%",
            border: 2 * k + "px solid rgba(18,179,174,0.26)",
            background:
              "radial-gradient(closest-side, rgba(16,156,153,0.16), rgba(16,156,153,0.03) 62%, transparent 78%)",
            transform: "rotateX(78deg)",
            opacity: 0.55 * land,
          }}
        />
        {/* charco de luz bajo la tarjeta que queda al frente */}
        <div
          style={{
            position: "absolute",
            left: width / 2 - 420 * k,
            top: floorY - 122 * k,
            width: 840 * k,
            height: 250 * k,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(18,179,174,0.34), rgba(18,179,174,0.05) 58%, transparent 76%)",
            filter: "blur(" + 16 * k + "px)",
            opacity: 0.35 + rev * 0.55,
          }}
        />

        {list.map((card, i) => {
          const a = i * step - ring; // ángulo del asiento en el anillo
          const ar = (a * Math.PI) / 180;
          const f = Math.cos(ar); // 1 = al frente, -1 = al fondo
          if (f < -0.72) return null; // los del fondo profundo no aportan nada
          const front = (f + 1) / 2;

          const bornP = spring({
            frame: frame - i * 2,
            fps,
            durationInFrames: Math.max(10, IN),
            config: { damping: 14, mass: 0.6, stiffness: 120 },
          });

          const isHero = i === fi;
          const heroBoost = isHero ? 1 + 0.085 * rev * Math.max(0, f) : 1;
          const zPush = interpolate(bornP, [0, 1], [-330 * k, 0]);
          const yLift = interpolate(bornP, [0, 1], [90 * k, 0]) + (isHero ? -14 * k * rev : 0);

          const depthBlur = (1 - front) * 11 * k;
          const heroSharp = isHero ? (1 - unl) * 5 * k : 0;
          const bright = 0.4 + 0.6 * front + (isHero ? rev * 0.14 : 0);
          const opa = interpolate(f, [-0.72, -0.15, 0.55, 1], [0, 0.34, 0.92, 1], CLAMP) * bornP;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: width / 2 - CW / 2,
                top: ringY - CH / 2 + yLift,
                width: CW,
                height: CH,
                zIndex: Math.round(600 + f * 400),
                transform:
                  "rotateY(" + a + "deg) translateZ(" + (R + zPush) + "px) scale(" + heroBoost + ")",
                borderRadius: 26 * k,
                opacity: opa,
                boxShadow:
                  "0 " +
                  (26 + 52 * front) * k +
                  "px " +
                  (46 + 92 * front) * k +
                  "px rgba(2,10,14," +
                  (0.3 + 0.42 * front).toFixed(3) +
                  "), 0 0 0 " +
                  1.2 * k +
                  "px rgba(127,201,198," +
                  (0.1 + 0.26 * front).toFixed(3) +
                  ")",
              }}
            >
              {/* CARA de la tarjeta */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 26 * k,
                  overflow: "hidden",
                  background: "#0A171D",
                  filter:
                    "blur(" +
                    (depthBlur + heroSharp).toFixed(2) +
                    "px) brightness(" +
                    bright.toFixed(3) +
                    ") saturate(" +
                    (0.72 + front * 0.4).toFixed(3) +
                    ")",
                }}
              >
                {card.image ? (
                  VIDEO_RE.test(card.image) ? (
                    <OffthreadVideo
                      src={staticFile(card.image)}
                      muted
                      playbackRate={0.7}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Img src={staticFile(card.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )
                ) : (
                  <CardPlaceholder n={card.index || i + 1} k={k} />
                )}

                {/* scrim inferior + etiqueta */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "52%",
                    background:
                      "linear-gradient(180deg, rgba(6,15,19,0) 0%, rgba(6,15,19,0.72) 58%, rgba(6,15,19,0.94) 100%)",
                  }}
                />
                <div style={{ position: "absolute", left: 22 * k, right: 22 * k, bottom: 22 * k }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: 5 * k + "px " + 12 * k + "px",
                      borderRadius: 8 * k,
                      background: isHero ? C.tealBright : "rgba(127,201,198,0.20)",
                      color: isHero ? "#04191A" : C.tealSoft,
                      fontSize: 20 * k,
                      fontWeight: 900,
                      letterSpacing: 2 * k,
                      marginBottom: 10 * k,
                    }}
                  >
                    {String(card.index || i + 1)}
                  </div>
                  <div
                    style={{
                      fontSize: 30 * k,
                      fontWeight: 800,
                      lineHeight: 1.08,
                      letterSpacing: -0.4 * k,
                      color: C.paper,
                      textShadow: "0 3px 18px rgba(0,0,0,0.7)",
                      textTransform: "uppercase",
                    }}
                  >
                    {card.name}
                  </div>
                </div>

                {/* brillo de vidrio que cruza según el ángulo */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(" +
                      (104 + a * 0.5).toFixed(2) +
                      "deg, rgba(244,247,249,0.20) 0%, rgba(244,247,249,0) 42%)",
                    opacity: 0.55 * (1 - front * 0.4),
                  }}
                />
              </div>

              {/* marco teal del héroe */}
              {isHero ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 26 * k,
                    border: 3 * k + "px solid " + C.tealBright,
                    opacity: rev * 0.95,
                    boxShadow:
                      "0 0 " +
                      44 * k +
                      "px rgba(18,179,174," +
                      (0.42 * rev).toFixed(3) +
                      "), inset 0 0 " +
                      34 * k +
                      "px rgba(18,179,174," +
                      (0.18 * rev).toFixed(3) +
                      ")",
                  }}
                />
              ) : null}

              {/* VELO + CANDADO: sólo el héroe, y se disuelve al aterrizar */}
              {isHero && unl < 1 ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 26 * k,
                    overflow: "hidden",
                    opacity: interpolate(unl, [0, 0.72, 1], [1, 0.5, 0], CLAMP),
                    clipPath: "inset(0% 0% " + (unl * 100).toFixed(2) + "% 0%)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(8,20,26,0.90) 0%, rgba(8,20,26,0.80) 100%)",
                      backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(127,201,198,0.10) 0px, rgba(127,201,198,0.10) 1px, transparent 1px, transparent 6px)",
                    }}
                  />
                  {/* candado que se abre */}
                  <svg
                    viewBox="0 0 64 74"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 96 * k,
                      transform:
                        "translate(-50%,-50%) scale(" + interpolate(unl, [0, 1], [1, 1.45]).toFixed(3) + ")",
                      opacity: interpolate(unl, [0, 0.8], [1, 0], CLAMP),
                    }}
                  >
                    <g
                      style={{
                        transform: "rotate(" + interpolate(unl, [0.15, 0.75], [0, -34], CLAMP).toFixed(2) + "deg)",
                        transformOrigin: "20px 26px",
                      }}
                    >
                      <path
                        d="M18 30 V20 a14 14 0 0 1 28 0 V30"
                        fill="none"
                        stroke={C.tealSoft}
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </g>
                    <rect x="10" y="30" width="44" height="36" rx="8" fill={C.tealSoft} opacity="0.92" />
                    <circle cx="32" cy="46" r="5" fill="#08161C" />
                    <rect x="30" y="46" width="4" height="11" rx="2" fill="#08161C" />
                  </svg>
                  {/* línea de escaneo mientras está bloqueado */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: (((frame / (fps * 1.6)) % 1) * 100).toFixed(3) + "%",
                      height: 3 * k,
                      background: "linear-gradient(90deg, transparent, " + C.tealBright + ", transparent)",
                      opacity: 0.6,
                    }}
                  />
                </div>
              ) : null}

              {/* pulso del desbloqueo */}
              {isHero && pop > 0 && pop < 1 ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: CW * 0.5,
                    height: CW * 0.5,
                    marginLeft: -CW * 0.25,
                    marginTop: -CW * 0.25,
                    borderRadius: "50%",
                    border: 3 * k + "px solid " + C.tealBright,
                    transform: "scale(" + interpolate(pop, [0, 1], [0.3, 2.2]).toFixed(3) + ")",
                    opacity: (1 - pop) * 0.8,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ── VIÑETA (encima del 3D, debajo del texto) ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 66% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.52) 78%, rgba(0,0,0,0.80) 100%)",
        }}
      />

      {/* ── EYEBROW (RAZÓN N) ── */}
      {eyebrow ? (
        <div
          style={{
            position: "absolute",
            top: 76 * k,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [3, 3 + Math.max(6, Math.round(IN * 0.7))], [0, 1], CLAMP),
            transform:
              "translateY(" +
              interpolate(frame, [3, 3 + Math.max(6, Math.round(IN * 0.7))], [-22 * k, 0], CLAMP) +
              "px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16 * k,
              padding: 11 * k + "px " + 28 * k + "px",
              borderRadius: 999,
              border: 1.5 * k + "px solid rgba(18,179,174,0.55)",
              background: "rgba(8,22,28,0.55)",
              boxShadow: "0 " + 10 * k + "px " + 34 * k + "px rgba(0,0,0,0.42)",
            }}
          >
            <div
              style={{
                width: 10 * k,
                height: 10 * k,
                borderRadius: "50%",
                background: C.coral,
                boxShadow: "0 0 " + 14 * k + "px " + C.coral,
              }}
            />
            <div
              style={{
                fontSize: 27 * k,
                fontWeight: 800,
                letterSpacing: 6 * k,
                color: C.tealSoft,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── KICKER (el título que se desbloqueó) ── */}
      <div
        style={{
          position: "absolute",
          left: 120 * k,
          right: 120 * k,
          top: ringY + CH * 0.62,
          textAlign: "center",
        }}
      >
        <div
          style={{
            clipPath: "inset(0% " + ((1 - rev) * 100).toFixed(2) + "% 0% 0%)",
            transform: "translateY(" + interpolate(rev, [0, 1], [26 * k, 0]) + "px)",
          }}
        >
          <div
            style={{
              fontSize: 74 * k,
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: -1.6 * k,
              color: C.paper,
              textTransform: "uppercase",
              textShadow: "0 " + 6 * k + "px " + 34 * k + "px rgba(0,0,0,0.75)",
            }}
          >
            {kicker || hero.name}
          </div>
        </div>
        {/* subrayado que se dibuja */}
        <div
          style={{
            margin: 22 * k + "px auto 0",
            height: 5 * k,
            borderRadius: 4 * k,
            width: interpolate(rev, [0.25, 1], [0, 300 * k], CLAMP),
            background: "linear-gradient(90deg, " + C.teal + ", " + C.tealSoft + ")",
            boxShadow: "0 0 " + 22 * k + "px rgba(18,179,174,0.55)",
          }}
        />
        {/* progreso de capítulos */}
        {N > 1 ? (
          <div style={{ marginTop: 26 * k, display: "flex", justifyContent: "center", gap: 10 * k, opacity: rev * 0.9 }}>
            {list.map((_, i) => (
              <div
                key={i}
                style={{
                  width: (i === fi ? 40 : 12) * k,
                  height: 6 * k,
                  borderRadius: 999,
                  background: i === fi ? C.tealBright : "rgba(244,247,249,0.26)",
                  boxShadow: i === fi ? "0 0 " + 16 * k + "px rgba(18,179,174,0.7)" : "none",
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
