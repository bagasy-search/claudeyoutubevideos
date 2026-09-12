// MovFourInches.tsx — MOVIMIENTO 1 del video `mddrain` (canal Mike Dalton, EN).
// EL HOOK: 1884 frames (62,8 s) @30 fps. Arranca en el frame 0 del video.
//
// LA TESIS, en UNA sola escena continua de 62 s: el olor NO sube de la cloaca. Crece en CUATRO
// PULGADAS de pared de caño, arriba del agua. La máquina del plomero hace un agujero por el
// CENTRO y pasa de largo por esa pared. La máquina funciona perfecto. La factura se paga.
// Y el olor sigue ahí.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// ACTO 1 · f0-348 · "THE ADDRESS" — protagonista: CLIP h01_smellnight dentro de vidrio.
//   cámara  enterFrom z=-230 (lejos, negro casi total)      exitTo z≈-115, empujando al óvalo
//   luz     enterFrom FRÍA pura (heat 0), key arriba-izq    exitTo FRÍA (heat 0), key 0.30
//   materia enterFrom el óvalo frío del colador, chico      exitTo el óvalo tragando el cuadro
//                                                            + la tarjeta h02 ya nacida al fondo
// ACTO 2 · f348-768 · "FOUR INCHES" — protagonista: CLIP h02_fourinches dentro de vidrio.
//   cámara  enterFrom z≈-115 (hereda, no resetea)           exitTo z≈+15, retrocede del corte
//   luz     enterFrom fría                                  exitTo heat 0.42 (empieza a virar)
//   materia enterFrom la tarjeta h02 que venía del acto 1   exitTo la película de la pared
//                                                            + la tarjeta h40 ya montada
// ACTO 3 · f768-1104 · "THE BLACK SKIN" — protagonista: CLIP h39_scrapefilm (macro) en vidrio.
//   cámara  enterFrom z≈+15                                 exitTo z≈+95
//   luz     enterFrom heat 0.42                             exitTo heat 0.72
//   materia enterFrom la película que barre el cuadro       exitTo la tarjeta h03_pipesection
//                                                            empujada al frente (entra al abanico)
// ACTO 4 · f1104-1500 · "THE MACHINE" — protagonista: ABANICO 3D de 4 piezas reales.
//   cámara  enterFrom z≈+95                                 exitTo z≈+185
//   luz     enterFrom heat 0.72                             exitTo heat 1 (roja de alerta)
//   materia enterFrom h03 llega como carta del abanico      exitTo la carta delantera
//                                                            (h05_feedcable) queda de frente
// ACTO 5 · f1500-1746 · "IT MISSES" — protagonista: el CABLE bajando por el centro, en capas.
//   cámara  enterFrom z≈+185                                exitTo z≈+228
//   luz     enterFrom heat 1 (roja)                         exitTo heat 1, muy baja
//   materia enterFrom el rectángulo de la carta delantera   exitTo la boca del caño, el cable
//           que se estira y SE VUELVE el corte del caño      fuera de cuadro, la franja encendida
// ACTO 6 · f1746-1884 · "STILL SMELLS" — protagonista: CLIP h06_stillsmells a sangre.
//   cámara  enterFrom z≈+228                                exitTo z≈+240 (empuje final)
//   luz     enterFrom roja                                  exitTo FRÍA otra vez (heat 0.10)
//   materia enterFrom el corte con la franja roja           exitTo Mike en la pileta de noche,
//                                                            luz fría → b-roll dedo+papel
//
// ── COSTURAS (una distinta por frontera, ⛔ ningún fade) ────────────────────────────────────
// 1→2 f348  ZOOM-THROUGH      la cámara atraviesa el óvalo del colador (crece a 2680 px y traga)
// 2→3 f768  WIPE POR MATERIA  la película negra del caño barre la pantalla; detrás ya está el macro
// 3→4 f1104 OCLUSIÓN          el cuerpo del cable de acero cruza y tapa el 100% ~8 frames
// 4→5 f1500 MATCH-SHAPE       el rectángulo de la carta delantera se estira y ES el corte del caño
// 5→6 f1746 CORTE EN EL BEAT  corte seco + chispa de acero de 2 frames, a Mike en la pileta
//
// ── CONTRATO TÉCNICO ────────────────────────────────────────────────────────────────────────
// Sin Math.random / Date.now (todo sale de rnd()). Sin backdrop-filter. Sin blur grande sobre
// imagen full-screen (la cama usa el `_blur.jpg` horneado, con blur 0). Easing.poly(5) en vez de
// quint. Todos los inputRange son constantes literales estrictamente crecientes.
// Clips: 121 frames @24 fps. Cada ventana cumple startFrom + ceil(len*0.8) + 2 <= 121.
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import {
  MD,
  F_SANS,
  rgba,
  lerp,
  clamp01,
  rnd,
  cam,
  light,
  Atmos,
  glassStyle,
  Sheen,
  Occluder,
  Kicker,
  Title,
  Em,
  TextBed,
} from "../mdmold/Stage";
import { PipeWall, Cable, DR } from "./Pipe";

const PERSP = 1400; // la misma perspectiva que usa cam()

const LIN = (x: number) => x;
const EO = Easing.bezier(0.22, 0.61, 0.28, 1);    // entrada rápida, salida larga
const EIO = Easing.bezier(0.5, 0, 0.2, 1);        // in-out, para los morphs
const EBACK = Easing.bezier(0.18, 1.06, 0.32, 1); // asentado con un pelo de rebote
const EDROP = Easing.poly(5);                     // ⛔ Easing.quint NO existe

const ip = (f: number, r: number[], o: number[], e?: (t: number) => number) =>
  interpolate(f, r, o, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e ?? LIN,
  });

// ── PLANO DE PROFUNDIDAD ────────────────────────────────────────────────────────────────────
// Cada capa vive a su propio translateZ dentro del preserve-3d de la cámara, así el paneo, la
// rotación y la deriva de cam() la mueven DISTINTO que a sus vecinas: parallax real, no
// posiciones distintas. `counter` compensa el agrandamiento de la perspectiva para las capas que
// tienen que conservar su tamaño en pantalla (la cama, los HUD, el remate a sangre) sin perder
// el parallax. `drift` es la respiración propia de la capa.
const Plane: React.FC<{
  z: number;
  camZ: number;
  counter?: boolean;
  drift?: number;
  seed?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ z, camZ, counter = false, drift = 0, seed = 1, style, children }) => {
  const frame = useCurrentFrame();
  const s = rnd(seed);
  const k = counter ? Math.max(0.2, (PERSP - camZ - z) / PERSP) : 1;
  const dx = drift ? Math.sin(frame / (63 + s * 40) + s * 6) * drift : 0;
  const dy = drift ? Math.cos(frame / (89 + s * 55) + s * 4) * drift * 0.6 : 0;
  return (
    <AbsoluteFill
      style={{
        transformStyle: "preserve-3d",
        transform:
          `translateZ(${z.toFixed(2)}px) ` +
          `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) ` +
          `scale(${k.toFixed(4)})`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ── TARJETA CON MATERIAL REAL ADENTRO ───────────────────────────────────────────────────────
// La regla que más pesa del canal: NINGUNA tarjeta es forma + texto. Adentro va la foto del
// momento y, en la ventana del beat, se le monta ENCIMA el CLIP del mismo momento (mismo
// encuadre, mismo Mike), con un barrido especular tapando el relevo. Marco de vidrio, bisel,
// rim de luz arriba y sombra de contacto que aterriza.
const RealCard: React.FC<{
  frame: number;
  w: number;
  h: number;
  photo: string;        // "img/mddrain_h01_smellnight.jpg"
  clip?: string;        // "broll/mddrain_h01_smellnight.mp4"
  clipFrom?: number;    // frame GLOBAL del movimiento donde arranca el clip
  clipLen?: number;     // largo en frames @30 → startFrom + ceil(len*0.8) + 2 <= 121
  startFrom?: number;   // frame de entrada DENTRO del clip (24 fps de origen)
  radius?: number;
  pad?: number;
  seed?: number;
  kb?: number;          // amplitud del Ken-Burns de la foto
  kbPush?: number;      // empuje extra (para el remate a sangre)
  lit?: number;
  shadow?: number;
  dim?: number;
}> = ({
  frame,
  w,
  h,
  photo,
  clip,
  clipFrom = 0,
  clipLen = 0,
  startFrom = 0,
  radius = 16,
  pad = 10,
  seed = 1,
  kb = 0.05,
  kbPush = 0,
  lit = 1,
  shadow = 1,
  dim = 0.12,
}) => {
  const s = rnd(seed);
  // la foto NUNCA queda quieta (hold vivo): respiración lenta y propia por tarjeta
  const kbs = 1.05 + kbPush + kb * (0.5 + 0.5 * Math.sin(frame / (150 + s * 90) + s * 6));
  const kbx = Math.sin(frame / (190 + s * 70) + s * 3) * 9;
  const kby = Math.cos(frame / (233 + s * 60) + s * 2) * 6;

  const hasClip = !!clip && clipLen > 8;
  const blend = hasClip
    ? Math.min(
        ip(frame, [clipFrom - 2, clipFrom + 7], [0, 1], EIO),
        ip(frame, [clipFrom + clipLen - 9, clipFrom + clipLen], [1, 0], EIO),
      )
    : 0;

  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* sombra de contacto: la tarjeta aterriza, no flota en el vacío */}
      {shadow > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: "7%",
            right: "7%",
            bottom: -Math.round(h * 0.07),
            height: Math.round(h * 0.18),
            borderRadius: "50%",
            background: `radial-gradient(closest-side, rgba(0,0,0,${(0.78 * shadow).toFixed(3)}) 0%, rgba(0,0,0,0) 100%)`,
            filter: "blur(13px)",
          }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, padding: pad, ...glassStyle({ radius: radius + pad, lit }) }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: radius,
            overflow: "hidden",
            backgroundColor: "#0A0A0C",
            boxShadow: `inset 0 0 0 1px ${rgba(MD.white, 0.1 * lit)}, inset 0 24px 60px rgba(0,0,0,0.5)`,
          }}
        >
          <Img
            src={staticFile(photo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${kbs.toFixed(4)}) translate3d(${kbx.toFixed(2)}px, ${kby.toFixed(2)}px, 0)`,
            }}
          />
          {hasClip && blend > 0.004 && (
            <div style={{ position: "absolute", inset: 0, opacity: blend }}>
              <Sequence from={clipFrom} durationInFrames={clipLen} layout="none">
                <OffthreadVideo
                  src={staticFile(clip as string)}
                  muted
                  startFrom={startFrom}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Sequence>
            </div>
          )}
          {/* grade del canal: viraje rojo muy leve + negro levantado + viñeta interna */}
          <AbsoluteFill style={{ background: "rgba(228,50,42,0.06)", mixBlendMode: "soft-light" }} />
          <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
          <AbsoluteFill
            style={{ background: "radial-gradient(88% 76% at 50% 44%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.56) 100%)" }}
          />
          {/* rim de la ventanita fría, arriba */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, ${rgba(MD.cold, 0.16 * lit)} 0%, rgba(255,255,255,0) 24%)`,
              mixBlendMode: "screen",
            }}
          />
          {/* el barrido especular tapa el relevo foto→clip y clip→foto */}
          {hasClip && <Sheen at={clipFrom - 6} dur={24} />}
          {hasClip && <Sheen at={clipFrom + clipLen - 14} dur={24} angle={-14} />}
        </div>
      </div>
    </div>
  );
};

// ── POLVO Y GRASA EN SUSPENSIÓN ─────────────────────────────────────────────────────────────
const Motes: React.FC<{ n?: number; tint?: string; seed?: number; size?: number; op?: number }> = ({
  n = 26,
  tint = MD.cold,
  seed = 3,
  size = 1,
  op = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 3.13 + seed);
        const b = rnd(i * 7.77 + seed * 2);
        const raw = (b * 118 - frame / (5 + a * 11)) % 118;
        const y = (raw < 0 ? raw + 118 : raw) - 9;
        const r = (1.6 + a * 5.2) * size;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(a * 104 - 2).toFixed(2)}%`,
              top: `${y.toFixed(2)}%`,
              width: r,
              height: r,
              borderRadius: "50%",
              background: `radial-gradient(circle at 38% 34%, ${rgba(MD.white, 0.6)} 0%, ${rgba(tint, 0.28)} 60%, rgba(0,0,0,0) 100%)`,
              opacity: (0.14 + b * 0.4) * op,
              transform: `translateX(${(Math.sin(frame / (44 + a * 60) + i) * 16).toFixed(2)}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── COSTURA 2→3 · WIPE POR MATERIA ──────────────────────────────────────────────────────────
// La película negra del caño barre la pantalla. No es un fade: es la MATERIA del video la que
// pasa por delante, y detrás ya está el macro del acto 3.
const FilmWipe: React.FC<{ at: number; dur?: number }> = ({ at, dur = 30 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const left = interpolate(p, [0, 1], [130, -230], { easing: EIO });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "-24%",
          height: "148%",
          left: `${left.toFixed(2)}%`,
          width: "190%",
          transform: "rotate(-2.6deg)",
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(DR.film, 0.72)} 7%, ${DR.film} 20%, #171614 50%, ${DR.film} 80%, ${rgba(DR.film, 0.72)} 93%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 0 140px 50px ${rgba(DR.film, 0.6)}`,
        }}
      />
      {/* grumos de grasa montados sobre el barrido: la materia se lee, no es una banda plana */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = rnd(i * 5.9);
        const b = rnd(i * 2.3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(left + 12 + a * 150).toFixed(2)}%`,
              top: `${(-6 + b * 104).toFixed(2)}%`,
              width: 30 + a * 190,
              height: 16 + b * 120,
              borderRadius: "46%",
              background: `radial-gradient(circle at 38% 32%, ${DR.filmWet} 0%, ${DR.film} 58%, rgba(0,0,0,0) 100%)`,
              opacity: 0.5 + b * 0.42,
              filter: "blur(1.4px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LA MARCA DE LAS CUATRO PULGADAS ─────────────────────────────────────────────────────────
// Diagrama, no protagonista: se apoya sobre la franja roja y la MIDE.
const Bracket4: React.FC<{ p: number; frame: number }> = ({ p, frame }) => {
  const o = clamp01(p);
  const grow = ip(o, [0, 1], [0, 1], EBACK);
  const pulse = 0.82 + Math.sin(frame / 17) * 0.18;
  const tick = (top: number) => (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: 46,
        height: 3,
        background: MD.redHot,
        boxShadow: `0 0 16px ${rgba(MD.redHot, 0.9)}`,
        transform: `scaleX(${grow.toFixed(3)})`,
        transformOrigin: "left center",
      }}
    />
  );
  return (
    <div style={{ opacity: o, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 46, height: 268 }}>
        <div
          style={{
            position: "absolute",
            left: 21,
            top: 0,
            width: 4,
            height: 268,
            background: `linear-gradient(180deg, ${MD.redHot} 0%, ${rgba(MD.redHot, 0.35)} 100%)`,
            boxShadow: `0 0 22px ${rgba(MD.redHot, 0.7 * pulse)}`,
            transform: `scaleY(${grow.toFixed(3)})`,
            transformOrigin: "top center",
          }}
        />
        {tick(0)}
        {tick(265)}
      </div>
      <div>
        <div
          style={{
            fontFamily: F_SANS,
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 0.92,
            letterSpacing: -3,
            color: MD.white,
            textShadow: "0 6px 30px rgba(0,0,0,0.92)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          4&quot;
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: F_SANS,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: MD.redHot,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
          }}
        >
          Always wet
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: F_SANS,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: rgba(MD.white, 0.66),
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
          }}
        >
          Never scrubbed
        </div>
      </div>
    </div>
  );
};

// ── COSTILLA DE CAÑO EN PRIMER PLANO (acto 5) ───────────────────────────────────────────────
// El lado CERCANO del caño. Vive más adelante que el cable, así el cable baja ENTRE las paredes
// de verdad (capas, no un dibujito): la costilla lo encuadra y el parallax la mueve más que a él.
const NearRib: React.FC<{ side: "l" | "r"; red: number; frame: number }> = ({ side, red, frame }) => {
  const breathe = 0.9 + Math.sin(frame / 67 + (side === "l" ? 0 : 1.7)) * 0.1;
  return (
    <div
      style={{
        position: "relative",
        width: 154,
        height: 1180,
        background:
          side === "l"
            ? `linear-gradient(90deg, #4C4A45 0%, ${DR.pvcDark} 26%, ${DR.pvc} 74%, #F3F1EB 100%)`
            : `linear-gradient(270deg, #4C4A45 0%, ${DR.pvcDark} 26%, ${DR.pvc} 74%, #F3F1EB 100%)`,
        boxShadow: "inset 0 0 70px rgba(0,0,0,0.55), 0 0 90px rgba(0,0,0,0.75)",
      }}
    >
      {/* la película pegada a la cara interna */}
      <div
        style={{
          position: "absolute",
          top: 0,
          [side === "l" ? "right" : "left"]: 0,
          width: 40,
          height: "100%",
          background:
            side === "l"
              ? `linear-gradient(270deg, ${DR.film} 0%, ${DR.filmWet} 55%, rgba(0,0,0,0) 100%)`
              : `linear-gradient(90deg, ${DR.film} 0%, ${DR.filmWet} 55%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {/* la franja de las 4 pulgadas, encendida */}
      <div
        style={{
          position: "absolute",
          top: "11%",
          left: 0,
          right: 0,
          height: "30%",
          background: `linear-gradient(180deg, ${rgba(MD.red, 0.06 * red)} 0%, ${rgba(MD.red, 0.42 * red * breathe)} 42%, ${rgba(MD.red, 0.06 * red)} 100%)`,
          borderTop: `2px solid ${rgba(MD.redHot, 0.85 * red)}`,
          borderBottom: `2px solid ${rgba(MD.redHot, 0.85 * red)}`,
          boxShadow: `inset 0 0 60px ${rgba(MD.redHot, 0.4 * red)}`,
        }}
      />
      {/* grumos determinísticos: el plástico no se lee plano */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = rnd(i * 4.4 + (side === "l" ? 0 : 31));
        const b = rnd(i * 8.8 + (side === "l" ? 5 : 17));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${(b * 96).toFixed(1)}%`,
              [side === "l" ? "right" : "left"]: 4 + a * 34,
              width: 8 + a * 26,
              height: 6 + b * 22,
              borderRadius: "44%",
              background: `radial-gradient(circle at 40% 34%, ${DR.filmLit} 0%, ${DR.film} 72%)`,
              opacity: 0.34 + a * 0.4,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
};

// ── EL MOVIMIENTO ───────────────────────────────────────────────────────────────────────────
export const MovFourInches: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  // UNA cámara para los 62,8 s. Función del frame GLOBAL: ningún acto la reinicia en 0.
  const c = cam(frame, { z0: -230, z1: 240, panX: -46, panY: -30, rx: 1.7, ry: 0, dur: D });
  const camZ = c.z;
  // respiración de encuadre por acto — continua, con easing NO constante, nunca vuelve al inicio
  const push = ip(
    frame,
    [0, 348, 768, 1104, 1500, 1746, 1884],
    [1.16, 1.0, 1.07, 0.95, 1.03, 0.99, 1.11],
    EIO,
  );

  // la luz VIAJA: fría (la ventanita de la cocina) → roja de alerta → fría otra vez en el remate
  const heat = ip(frame, [468, 808, 1500, 1746, 1790, 1884], [0, 0.5, 1, 1, 0.26, 0.1], EO);
  const tint = light(heat, "cold", "red");

  const vis = (a: number, b: number, inD = 18, outD = 18) =>
    Math.min(
      ip(frame, [a, a + inD], [0, 1], EO),
      ip(frame, [Math.max(b - outD, a + inD + 1), b], [1, 0], EO),
    );

  // ── ACTO 1 · el óvalo del colador ─────────────────────────────────────────────────────────
  const ovalP = ip(frame, [30, 358], [0, 1], EDROP);
  const ovalSize = lerp(300, 2680, ovalP);
  const ovalO = ip(frame, [16, 46, 288, 362], [0, 1, 1, 0], EO);
  const cardA = vis(52, 344, 26, 40); // h01_smellnight
  const cardAz = ip(frame, [290, 348], [0, -300], EIO);

  // ── tarjeta que CRUZA la frontera 1→2 (h02_fourinches) ────────────────────────────────────
  const cardB = vis(212, 762, 30, 44);
  const cardBt = ip(frame, [212, 396], [0, 1], EIO); // de semilla al fondo → héroe del acto 2
  const cardBw = lerp(300, 700, cardBt);
  const cardBx = lerp(430, -380, cardBt);
  const cardBy = lerp(214, -104, cardBt);
  const cardBz = lerp(-330, 128, cardBt);
  const cardBry = lerp(-19, -7, cardBt);

  // ── ACTO 2 · el corte del caño ────────────────────────────────────────────────────────────
  const wallIn = ip(frame, [336, 452], [0, 1], EO);
  const wallScale = ip(frame, [336, 470, 768, 1104], [0.44, 1, 1.1, 0.5], EIO);
  const wallO = ip(frame, [336, 400, 700, 800], [0, 1, 1, 0.16], EO);
  const wallRy = ip(frame, [336, 1104], [7, -4], EIO);
  const filmT = ip(frame, [372, 560], [0.18, 1], EO);
  const redZone = ip(frame, [556, 664], [0, 1], EO);
  const bracket2 = vis(596, 772, 30, 34);

  // ── tarjeta que CRUZA la frontera 2→3 (h40_lookinpipe) ────────────────────────────────────
  const cardC = vis(468, 892, 28, 42);
  const cardCt = ip(frame, [468, 800], [0, 1], EIO);

  // ── ACTO 3 · el macro de la película ──────────────────────────────────────────────────────
  const cardD = vis(776, 996, 22, 42); // h39_scrapefilm — protagonista
  const cardDx = ip(frame, [776, 930, 996], [-40, -108, -880], EIO);
  const cardDry = ip(frame, [776, 996], [9, 24], EIO);
  const cardDrz = ip(frame, [776, 996], [-2.2, 1.6], EIO);

  // ── tarjeta que CRUZA la frontera 3→4 (h03_pipesection) ───────────────────────────────────
  const cardE = ip(frame, [872, 906], [0, 1], EO);
  const cardEt = ip(frame, [872, 1002, 1096], [0, 1, 1], EIO);

  // ── ACTO 4 · el abanico 3D ────────────────────────────────────────────────────────────────
  const fanIn = ip(frame, [1100, 1128], [0, 1], EO);
  const fanOut = ip(frame, [1472, 1479], [1, 0], LIN);
  const fanO = Math.min(fanIn, fanOut);
  const carT = ip(frame, [1150, 1302], [0, 1], EIO);
  const sway = Math.sin(frame / 97) * 0.11;

  // ── ACTO 5 · match-shape y el cable ───────────────────────────────────────────────────────
  const morph = ip(frame, [1476, 1546], [0, 1], EIO);
  const morphIn = ip(frame, [1472, 1479], [0, 1], LIN);
  const boreO = Math.min(morphIn, ip(frame, [1730, 1746], [1, 0], LIN));
  const ribsIn = ip(frame, [1526, 1580], [0, 1], EO);
  const cableP = ip(frame, [1556, 1706], [0, 1], EIO);
  const bracket5 = vis(1594, 1744, 26, 26);
  const witness = vis(1560, 1740, 26, 26);

  // ── ACTO 6 · el remate ────────────────────────────────────────────────────────────────────
  const endIn = ip(frame, [1746, 1758], [0, 1], EO);
  const endW = ip(frame, [1752, 1858], [1250, 2060], EIO);
  const endPad = ip(frame, [1760, 1846], [12, 0], EIO);
  const endRad = ip(frame, [1760, 1846], [20, 0], EIO);
  const endShadow = ip(frame, [1752, 1822], [1, 0], EO);
  const endPush = ip(frame, [1780, 1884], [0, 0.09], EO);
  const spark = ip(frame, [1746, 1750], [0.2, 0], LIN);

  // geometría de una carta del abanico: la DELANTERA viaja mucho más que la trasera
  const slot = (u: number) => {
    const a = u * 0.44;
    const near = u < 0 ? -u : 0;
    const back = Math.max(0, u);
    return {
      x: Math.sin(a) * 540 - near * 540,
      y: -near * 46,
      z: 130 - (1 - Math.cos(a)) * 900 + near * 430,
      ry: -a * 24,
      sc: 1 / (1 + back * 0.15),
      op: clamp01(1 - near * 1.7) * clamp01(1.3 - Math.max(0, back - 2.5) * 2.2),
    };
  };

  const FAN: {
    photo: string;
    clip?: string;
    clipFrom?: number;
    clipLen?: number;
    startFrom?: number;
  }[] = [
    {
      photo: "img/mddrain_h04_machinefloor.jpg",
      clip: "broll/mddrain_h04_machinefloor.mp4",
      clipFrom: 1122,
      clipLen: 126,
      startFrom: 8,
    },
    {
      photo: "img/mddrain_h05_feedcable.jpg",
      clip: "broll/mddrain_h05_feedcable.mp4",
      clipFrom: 1256,
      clipLen: 126,
      startFrom: 12,
    },
    { photo: "img/mddrain_h03_pipesection.jpg" },
    { photo: "img/mddrain_h40_lookinpipe.jpg" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca ──────────────────────────── */}
      <Atmos
        tint={tint}
        keyFrom={ip(frame, [0, 1884], [0.18, 0.64], LIN)}
        intensity={ip(frame, [0, 14, 600, 1884], [0.5, 1, 1, 0.88], EO)}
      />

      {/* ── LA ESCENA: una sola cámara, ocho planos de profundidad ────────────────────────── */}
      <AbsoluteFill style={{ perspective: `${PERSP}px` }}>
        <AbsoluteFill
          style={{ transform: `${c.transform} scale(${push.toFixed(4)})`, transformStyle: "preserve-3d" }}
        >
          {/* PLANO −620 · LA CAMA: el cuarto real, ya horneado en `_blur.jpg` (blur 0) */}
          <Plane z={-620} camZ={camZ} counter drift={5} seed={11}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <Img
                src={staticFile("img/mddrain_h01_smellnight_blur.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: ip(frame, [0, 14, 1700, 1884], [0.1, 0.34, 0.34, 0.06], EO),
                  transform: `scale(${(1.16 + ip(frame, [0, 1884], [0, 0.16], LIN)).toFixed(4)})`,
                }}
              />
              <AbsoluteFill
                style={{
                  background: `radial-gradient(80% 70% at 50% 46%, ${rgba(MD.red, 0.1 * heat)} 0%, rgba(0,0,0,0) 72%)`,
                }}
              />
            </AbsoluteFill>
          </Plane>

          {/* PLANO −300 · EL ÓVALO DEL COLADOR — abre el video y nos traga (costura 1→2) */}
          {ovalO > 0.005 && (
            <Plane
              z={-300}
              camZ={camZ}
              drift={3}
              seed={2}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ position: "relative", width: ovalSize, height: ovalSize * 0.44, opacity: ovalO }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `${lerp(12, 82, ovalP).toFixed(1)}px solid ${rgba(DR.pvc, 0.86)}`,
                    boxShadow: `0 0 ${lerp(60, 220, ovalP).toFixed(0)}px ${rgba(MD.cold, 0.4)}, inset 0 0 ${lerp(90, 300, ovalP).toFixed(0)}px rgba(0,0,0,0.94)`,
                    background: `radial-gradient(60% 80% at 50% 6%, ${rgba(MD.cold, 0.18)} 0%, rgba(0,0,0,0.94) 62%)`,
                  }}
                />
                {/* las ranuras del colador, girando lentísimo */}
                {Array.from({ length: 9 }, (_, i) => {
                  const a = (i / 9) * Math.PI * 2 + frame / 260;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${(50 + Math.cos(a) * 31).toFixed(2)}%`,
                        top: `${(50 + Math.sin(a) * 29).toFixed(2)}%`,
                        width: lerp(16, 120, ovalP),
                        height: lerp(6, 44, ovalP),
                        borderRadius: 40,
                        background: "rgba(0,0,0,0.86)",
                        boxShadow: `0 0 ${lerp(8, 40, ovalP).toFixed(0)}px ${rgba(MD.cold, 0.24)}`,
                        transform: `translate(-50%,-50%) rotate(${((a * 180) / Math.PI).toFixed(1)}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </Plane>
          )}

          {/* PLANO −40 · LA ESTRUCTURA: el corte del caño (acto 2) */}
          {wallO > 0.01 && (
            <Plane
              z={-40}
              camZ={camZ}
              drift={2}
              seed={5}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  opacity: wallO,
                  transform: `scale(${(wallScale * lerp(0.94, 1, wallIn)).toFixed(4)}) rotateY(${wallRy.toFixed(2)}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <PipeWall
                  w={470}
                  h={1010}
                  filmT={filmT}
                  lit={1 - heat * 0.36}
                  redZone={redZone}
                  zoneTop={9}
                  zoneH={31}
                />
              </div>
            </Plane>
          )}

          {/* PLANO −150 · tarjeta h40_lookinpipe — nace en el acto 2 y CRUZA al acto 3 */}
          {cardC > 0.005 && (
            <Plane
              z={-150}
              camZ={camZ}
              drift={7}
              seed={8}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  opacity: cardC,
                  transform:
                    `translate3d(${lerp(690, 486, cardCt).toFixed(1)}px, ${lerp(-140, 196, cardCt).toFixed(1)}px, 0) ` +
                    `rotateY(${lerp(-21, -12, cardCt).toFixed(2)}deg) rotateZ(${lerp(2.4, -1.6, cardCt).toFixed(2)}deg) ` +
                    `scale(${lerp(0.82, 1.04, cardCt).toFixed(3)})`,
                  transformStyle: "preserve-3d",
                }}
              >
                <RealCard
                  frame={frame}
                  w={500}
                  h={282}
                  photo="img/mddrain_h40_lookinpipe.jpg"
                  seed={4}
                  kb={0.06}
                  lit={0.8}
                  dim={0.2}
                />
              </div>
            </Plane>
          )}

          {/* PLANO +128 · tarjeta h01_smellnight — héroe del acto 1, con CLIP adentro */}
          {cardA > 0.005 && (
            <Plane
              z={128}
              camZ={camZ}
              drift={5}
              seed={1}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  opacity: cardA,
                  transform:
                    `translate3d(${ip(frame, [52, 348], [-88, -168], EIO).toFixed(1)}px, ${(ip(frame, [52, 120], [120, -34], EBACK) + Math.sin(frame / 74) * 7).toFixed(1)}px, ${cardAz.toFixed(1)}px) ` +
                    `rotateY(${ip(frame, [52, 348], [11, 3], EIO).toFixed(2)}deg) ` +
                    `rotateX(${ip(frame, [52, 130], [9, 1.4], EBACK).toFixed(2)}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <RealCard
                  frame={frame}
                  w={784}
                  h={441}
                  photo="img/mddrain_h01_smellnight.jpg"
                  clip="broll/mddrain_h01_smellnight.mp4"
                  clipFrom={96}
                  clipLen={132}
                  startFrom={6}
                  seed={2}
                  kb={0.05}
                  dim={0.1}
                />
              </div>
            </Plane>
          )}

          {/* PLANO móvil · tarjeta h02_fourinches — CRUZA la frontera 1→2 y se vuelve el héroe */}
          {cardB > 0.005 && (
            <Plane
              z={cardBz}
              camZ={camZ}
              drift={4}
              seed={6}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  opacity: cardB,
                  transform:
                    `translate3d(${cardBx.toFixed(1)}px, ${(cardBy + Math.sin(frame / 81) * 6).toFixed(1)}px, 0) ` +
                    `rotateY(${cardBry.toFixed(2)}deg) rotateZ(${lerp(3.2, -1.2, cardBt).toFixed(2)}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <RealCard
                  frame={frame}
                  w={cardBw}
                  h={cardBw * 0.5625}
                  photo="img/mddrain_h02_fourinches.jpg"
                  clip="broll/mddrain_h02_fourinches.mp4"
                  clipFrom={400}
                  clipLen={130}
                  startFrom={12}
                  seed={7}
                  kb={0.045}
                  lit={lerp(0.7, 1, cardBt)}
                  dim={lerp(0.24, 0.1, cardBt)}
                />
              </div>
            </Plane>
          )}

          {/* PLANO +160 · tarjeta h39_scrapefilm — el MACRO, protagonista del acto 3 */}
          {cardD > 0.005 && (
            <Plane
              z={160}
              camZ={camZ}
              drift={6}
              seed={9}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  opacity: cardD,
                  transform:
                    `translate3d(${cardDx.toFixed(1)}px, ${(-52 + Math.sin(frame / 69) * 9).toFixed(1)}px, 0) ` +
                    `rotateY(${cardDry.toFixed(2)}deg) rotateZ(${cardDrz.toFixed(2)}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <RealCard
                  frame={frame}
                  w={860}
                  h={484}
                  photo="img/mddrain_h39_scrapefilm.jpg"
                  clip="broll/mddrain_h39_scrapefilm.mp4"
                  clipFrom={800}
                  clipLen={132}
                  startFrom={10}
                  seed={3}
                  kb={0.07}
                  dim={0.08}
                />
              </div>
            </Plane>
          )}

          {/* PLANO −60 · tarjeta h03_pipesection — nace atrás en el acto 3 y CRUZA al abanico */}
          {cardE > 0.005 && fanO < 0.99 && (
            <Plane
              z={-60}
              camZ={camZ}
              drift={5}
              seed={12}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  opacity: cardE * (1 - fanO),
                  transform:
                    `translate3d(${lerp(560, 300, cardEt).toFixed(1)}px, ${(lerp(210, 44, cardEt) + Math.sin(frame / 77) * 7).toFixed(1)}px, ${lerp(-180, 60, cardEt).toFixed(1)}px) ` +
                    `rotateY(${lerp(-24, -14, cardEt).toFixed(2)}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <RealCard
                  frame={frame}
                  w={lerp(452, 610, cardEt)}
                  h={lerp(254, 343, cardEt)}
                  photo="img/mddrain_h03_pipesection.jpg"
                  seed={5}
                  kb={0.05}
                  lit={lerp(0.72, 1, cardEt)}
                  dim={lerp(0.22, 0.12, cardEt)}
                />
              </div>
            </Plane>
          )}

          {/* PLANO 0 · EL ABANICO 3D (acto 4) — 4 piezas reales, la delantera viaja más */}
          {fanO > 0.005 && (
            <Plane
              z={0}
              camZ={camZ}
              drift={3}
              seed={14}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ position: "relative", width: 0, height: 0, transformStyle: "preserve-3d" }}>
                {FAN.map((cd, i) => {
                  const u = i - carT + sway * (1 - i * 0.22);
                  const g = slot(u);
                  if (g.op <= 0.004) return null;
                  const bob = Math.sin(frame / (54 + i * 19) + i * 1.7) * (11 - i * 2.3);
                  const rz = Math.sin(frame / (91 + i * 23) + i) * (1.8 - i * 0.35);
                  return (
                    <div
                      key={cd.photo}
                      style={{
                        position: "absolute",
                        left: -280,
                        top: -158,
                        opacity: g.op * fanO,
                        transform:
                          `translate3d(${g.x.toFixed(1)}px, ${(g.y + bob).toFixed(1)}px, ${g.z.toFixed(1)}px) ` +
                          `rotateY(${g.ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) ` +
                          `scale(${g.sc.toFixed(3)})`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <RealCard
                        frame={frame}
                        w={560}
                        h={315}
                        photo={cd.photo}
                        clip={cd.clip}
                        clipFrom={cd.clipFrom}
                        clipLen={cd.clipLen}
                        startFrom={cd.startFrom}
                        seed={20 + i * 3}
                        kb={0.05}
                        lit={1 - i * 0.16}
                        dim={0.1 + i * 0.06}
                        shadow={1 - i * 0.22}
                      />
                    </div>
                  );
                })}
              </div>
            </Plane>
          )}

          {/* MATCH-SHAPE 4→5: el rectángulo de la carta delantera SE VUELVE el corte del caño */}
          {boreO > 0.005 && (
            <Plane
              z={lerp(130, -40, morph)}
              camZ={camZ}
              drift={2}
              seed={15}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  position: "relative",
                  width: lerp(560, 486, morph),
                  height: lerp(315, 1180, morph),
                  opacity: boreO,
                  borderRadius: lerp(26, 3, morph),
                  overflow: "hidden",
                  boxShadow: `0 40px 90px rgba(0,0,0,${(0.62 * (1 - morph * 0.4)).toFixed(2)})`,
                  border: `${lerp(10, 0, morph).toFixed(1)}px solid ${rgba(MD.white, 0.2 * (1 - morph))}`,
                  transform: `rotateY(${lerp(-2, 0, morph).toFixed(2)}deg)`,
                }}
              >
                {/* la foto de la carta se va mientras el corte del caño ya está debajo */}
                <AbsoluteFill style={{ opacity: 1 - clamp01(morph * 2.1) }}>
                  <Img
                    src={staticFile("img/mddrain_h05_feedcable.jpg")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <AbsoluteFill style={{ background: "rgba(228,50,42,0.06)", mixBlendMode: "soft-light" }} />
                </AbsoluteFill>
                <AbsoluteFill
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: clamp01((morph - 0.18) * 1.6),
                  }}
                >
                  <PipeWall w={486} h={1180} filmT={1} lit={0.72} redZone={1} zoneTop={11} zoneH={30} />
                </AbsoluteFill>
              </div>
            </Plane>
          )}

          {/* PLANO +46 · EL CABLE — baja por el CENTRO, en su propio plano, delante de la pared */}
          {cableP > 0.002 && boreO > 0.005 && (
            <Plane
              z={46}
              camZ={camZ}
              drift={2}
              seed={16}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ position: "relative", width: 486, height: 1180, opacity: boreO }}>
                <Cable p={cableP} w={34} twist={1.15} />
                {/* el cabezal: gira, muerde el aire, y no toca nada */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: `${(32 + cableP * 120).toFixed(2)}%`,
                    width: 56,
                    height: 56,
                    marginLeft: -28,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 36% 30%, #E9EDF0 0%, ${DR.steel} 46%, #5E6469 100%)`,
                    boxShadow: `0 0 34px rgba(0,0,0,0.8), 0 0 26px ${rgba(MD.cold, 0.4)}`,
                    transform: `rotate(${(frame * 11).toFixed(1)}deg) scaleX(${(0.9 + Math.sin(frame / 6) * 0.1).toFixed(3)})`,
                    opacity: cableP > 0.02 ? 1 : 0,
                  }}
                />
              </div>
            </Plane>
          )}

          {/* PLANO +200 · LAS COSTILLAS CERCANAS — el cable pasa ENTRE ellas, por capas reales */}
          {ribsIn > 0.005 && boreO > 0.005 && (
            <Plane
              z={200}
              camZ={camZ}
              drift={9}
              seed={17}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div
                style={{
                  position: "relative",
                  width: 0,
                  height: 0,
                  transformStyle: "preserve-3d",
                  opacity: ribsIn * boreO,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: lerp(-250, -318, ribsIn),
                    top: -590,
                    transform: "rotateY(15deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <NearRib side="l" red={1} frame={frame} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: lerp(96, 164, ribsIn),
                    top: -590,
                    transform: "rotateY(-15deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <NearRib side="r" red={1} frame={frame} />
                </div>
              </div>
            </Plane>
          )}

          {/* PLANO +40 · EL REMATE a sangre: Mike en la pileta, de noche, luz fría (acto 6) */}
          {endIn > 0.005 && (
            <Plane
              z={40}
              camZ={camZ}
              counter
              drift={3}
              seed={19}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ opacity: endIn, transform: `translate3d(0px, ${(Math.sin(frame / 88) * 5).toFixed(1)}px, 0)` }}>
                <RealCard
                  frame={frame}
                  w={endW}
                  h={endW * 0.5625}
                  photo="img/mddrain_h06_stillsmells.jpg"
                  clip="broll/mddrain_h06_stillsmells.mp4"
                  clipFrom={1748}
                  clipLen={136}
                  startFrom={8}
                  radius={endRad}
                  pad={endPad}
                  seed={13}
                  kb={0.03}
                  kbPush={endPush}
                  shadow={endShadow}
                  dim={0.1}
                />
              </div>
            </Plane>
          )}

          {/* PLANO +330 · DIAGRAMA: la marca de las 4 pulgadas (acto 2 y acto 5) */}
          {(bracket2 > 0.005 || bracket5 > 0.005) && (
            <Plane z={330} camZ={camZ} counter drift={4} seed={21}>
              <div
                style={{
                  position: "absolute",
                  right: bracket5 > bracket2 ? 132 : 168,
                  top: bracket5 > bracket2 ? 168 : 120,
                }}
              >
                <Bracket4 p={Math.max(bracket2, bracket5)} frame={frame} />
              </div>
            </Plane>
          )}

          {/* PLANO +256 · EL TESTIGO REAL del acto 5: su mano metiendo el cable, en vidrio */}
          {witness > 0.005 && (
            <Plane z={256} camZ={camZ} counter drift={6} seed={22}>
              <div
                style={{
                  position: "absolute",
                  right: 108,
                  bottom: 96,
                  opacity: witness,
                  transform: `translateY(${ip(frame, [1560, 1600], [46, 0], EBACK).toFixed(1)}px) rotateY(-11deg) rotateZ(1.4deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <RealCard
                  frame={frame}
                  w={436}
                  h={245}
                  photo="img/mddrain_h05_feedcable.jpg"
                  clip="broll/mddrain_h05_feedcable.mp4"
                  clipFrom={1544}
                  clipLen={120}
                  startFrom={20}
                  seed={17}
                  kb={0.05}
                  lit={0.9}
                  dim={0.16}
                />
              </div>
            </Plane>
          )}

          {/* PLANO +460 · PRIMER PLANO: polvo y grasa en suspensión (nunca hay nada quieto) */}
          <Plane z={460} camZ={camZ} drift={12} seed={23}>
            <Motes n={20} tint={heat > 0.5 ? MD.redHot : MD.cold} seed={9} size={1.5} op={0.7} />
          </Plane>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── UNA IDEA DE TEXTO POR ACTO (titular ≤7 palabras, la emocional en serif itálica) ── */}
      <div style={{ position: "absolute", left: 108, bottom: 116, width: 960, height: 300 }}>
        {vis(72, 330, 20, 28) > 0.005 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              opacity: vis(72, 330, 20, 28),
              transform: `translateY(${ip(frame, [72, 104], [26, 0], EO).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Two a.m. · your kitchen</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                That smell has an <Em>address</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {vis(430, 750, 20, 28) > 0.005 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              opacity: vis(430, 750, 20, 28),
              transform: `translateY(${ip(frame, [430, 462], [26, 0], EO).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Above the water line</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                Four inches you <Em>never</Em> touch
              </Title>
            </TextBed>
          </div>
        )}
        {vis(820, 1086, 20, 26) > 0.005 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              opacity: vis(820, 1086, 20, 26),
              transform: `translateY(${ip(frame, [820, 852], [26, 0], EO).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>What you scrape off</Kicker>
              <div style={{ height: 14 }} />
              <Title size={70}>
                This black skin is <Em>the stench</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {vis(1176, 1470, 20, 26) > 0.005 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              opacity: vis(1176, 1470, 20, 26),
              transform: `translateY(${ip(frame, [1176, 1208], [26, 0], EO).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Three hundred dollars</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                The machine works <Em>perfectly</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {vis(1618, 1740, 20, 22) > 0.005 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              opacity: vis(1618, 1740, 20, 22),
              transform: `translateY(${ip(frame, [1618, 1650], [26, 0], EO).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>And that is the problem</Kicker>
              <div style={{ height: 14 }} />
              <Title size={72}>
                It bores a hole and <Em>misses</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {vis(1778, 1866, 18, 20) > 0.005 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              opacity: vis(1778, 1866, 18, 20),
              transform: `translateY(${ip(frame, [1778, 1806], [26, 0], EO).toFixed(1)}px)`,
            }}
          >
            <TextBed>
              <Kicker>Machine gone. Bill paid.</Kicker>
              <div style={{ height: 14 }} />
              <Title size={74}>
                And it <Em>still</Em> smells
              </Title>
            </TextBed>
          </div>
        )}
      </div>

      {/* ── COSTURAS ─────────────────────────────────────────────────────────────────────── */}
      {/* 2→3 · WIPE POR MATERIA: la película negra cruza; detrás ya está el macro del acto 3 */}
      <FilmWipe at={756} dur={30} />
      {/* 3→4 · OCLUSIÓN: el cuerpo del cable de acero tapa el 100% mientras cambia el encuadre */}
      <Occluder at={1094} dur={18} color="#6E7378" angle={4} />
      {/* 5→6 · CORTE EN EL BEAT: corte seco + chispa de acero de 2 frames */}
      {spark > 0.004 && (
        <AbsoluteFill style={{ background: `rgba(233,237,240,${spark.toFixed(3)})`, pointerEvents: "none" }} />
      )}

      {/* ── EL VELO DE ALERTA: vive sobre la MISMA atmósfera, no es un fondo nuevo ────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(72% 62% at 50% 42%, ${rgba(MD.red, 0.15 * heat)} 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(96% 82% at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
