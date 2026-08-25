/**
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *  MovTruck.tsx — MOVIMIENTO 4 del video `mdbleach` (canal Mike Dalton, EN)
 *  «WATER IS THE TRUCK» · LA OBJECIÓN · ~1260 frames @ 30 fps (42 s)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 *  ── LA IDEA ────────────────────────────────────────────────────────────────────────────────
 *  DOS ENTREGAS IDÉNTICAS SALEN AL MISMO TIEMPO. Una se consume en la entrada de la casa; la
 *  otra atraviesa la película y entra. El agua no es el contenido: es el CAMIÓN. La única
 *  pregunta es qué viaja adentro y si sigue vivo cuando llega.
 *  Por eso NO hay texto flotando solo: todo es OBJETO. El agua se muestra con el chorro real,
 *  los dos platitos y el frasco; y la escala viaja de la mesada al MACRO de la película.
 *  El movimiento cierra con la corrección honesta: la mano que APAGA el ventilador.
 *
 *  ── UN MOVIMIENTO, NO SEIS COMPONENTES ─────────────────────────────────────────────────────
 *  · UNA atmósfera (`<Atmos>` + `<Motes>`) montada UNA vez en el frame 0 y jamás remontada.
 *  · UNA cámara: `stageCam(p, 4)` en la raíz (⛔ ningún acto la reinicia) + `RIG()`, que es UNA
 *    función continua del frame GLOBAL — el acto 4 hereda la inercia del 3 porque literalmente
 *    es la misma curva. `RIG()` decae a 0 en los últimos 44 frames para ATERRIZAR EXACTO en
 *    `CAM_ARC[4].to` y no pisarle la entrada a MovRefill.
 *  · UNA luz: `movLight(4, p)` — viene 'warm' de MovLetter y muere 'cold'. La key VIAJA de
 *    0.72 a 0.24 (de la derecha cálida de la cocina al frío de arriba-izquierda).
 *  · MATERIA QUE CRUZA CADA FRONTERA (ver tabla). Nunca hay un objeto que "aparezca de la nada".
 *  · El TEXTO vive en una capa de ESPACIO DE PANTALLA acoplada a la cámara con parallax ×0.18.
 *    (La perspectiva AGRANDA lo que vive en un plano con translateZ alto: un titular anclado
 *    dentro del rig se sale de la safe area. Los objetos van en el rig; los títulos, no.)
 *
 *  ════════════════════════════════════════════════════════════════════════════════════════════
 *  TABLA DE HANDOFF   (fracciones de `durationInFrames`; frames de referencia para D = 1260)
 *  ════════════════════════════════════════════════════════════════════════════════════════════
 *
 *  ACTO 1 · «LA OBJECIÓN» · 0.000 → 0.150 (f0 → f189)   [ÚNICO acto con el AVATAR VISIBLE]
 *    enterFrom  cam  CAM_ARC[4].from {z .34, panX 96, panY 30, ry 4, rz .4} — RIG en 0 exacto
 *               luz  'warm' heredada de MovLetter (t≈0), key a la derecha (0.72)
 *               mat  — (entra el estante: `h38_twoshelves`, tercio derecho, fuera de la cara)
 *    exitTo     cam  RIG {px≈+22, py≈−4, z≈+62} ya viajando
 *               luz  t≈0.15
 *               mat  LA TARJETA DEL ESTANTE, ya en movimiento hacia el centro
 *    ── FRONTERA A @ 0.150 · OCLUSIÓN ──────────────────────────────────────────────────────
 *       Banda `Occluder` (300 % de pantalla). BAJO COBERTURA TOTAL se enciende la atmósfera y
 *       desaparece el avatar. Es la única costura que puede tapar un cambio de FONDO.
 *
 *  ACTO 2 · «EL AGUA ES EL CAMIÓN» · 0.150 → 0.360 (f189 → f454)
 *    enterFrom  cam  exactos los del acto 1 (misma función, sin corte)
 *               luz  t≈0.15
 *               mat  la MISMA tarjeta del estante: se convierte en panel ancho (match-shape
 *                    inline sobre `GlassPlate`, con control de x/y — la materia no se reemplaza)
 *    exitTo     cam  RIG {px≈−19, z≈+87}
 *               luz  t≈0.36
 *               mat  DOS TARJETAS IDÉNTICAS del chorro (`h39_watertruck`), nacidas de UNA sola
 *                    (a `split = 0` están superpuestas): las dos entregas que salen a la vez
 *    ── FRONTERA B @ 0.360 · ZOOM-THROUGH ──────────────────────────────────────────────────
 *       La cámara ENTRA por la tarjeta IZQUIERDA (la del cloro) en [34 %, 47 %] ×9.
 *
 *  ACTO 3 · «SE LO COMEN EN LA ENTRADA» · 0.360 → 0.575 (f454 → f724)
 *    enterFrom  cam  sin salto; salimos DENTRO del camión → escala macro
 *               luz  t≈0.36, la key ya cruzó el centro
 *               mat  el camión del cloro por dentro (`h20_bleachintofull`) nace EXACTAMENTE
 *                    en la coordenada donde entró el zoom (x −300) y arranca a alejarse
 *    exitTo     cam  RIG con el SWING lateral ya andando (−120 px sostenidos)
 *               luz  t≈0.58
 *               mat  la tarjeta del PERÓXIDO, estacionada a la derecha, esperando
 *    ── FRONTERA C @ 0.575 · MATCH-MOVE ────────────────────────────────────────────────────
 *       La cámara sigue su vector (paneo sostenido a la izquierda): el cloro muerto sale por
 *       izquierda y el peróxido entra al centro DENTRO del mismo movimiento. Sin tapar nada.
 *
 *  ACTO 4 · «ENTRA CAMINANDO» · 0.575 → 0.775 (f724 → f977)
 *    enterFrom  cam  RIG con la inercia del swing (no vuelve a 0)
 *               luz  t≈0.58 → 0.78
 *               mat  la tarjeta del peróxido, que GIRA sobre su eje: cara A = el chorro (el
 *                    camión), cara B = el frasco en la palma (`h05_bottlepalm`, lo que viaja
 *                    adentro). Después SE METE detrás del muro de la mancha: z real, no truco.
 *    exitTo     cam  RIG {px≈−140}
 *               luz  t≈0.78
 *               mat  la cara B (el frasco) queda como carta delantera del abanico
 *    ── FRONTERA D @ 0.775 · WIPE POR MATERIA ──────────────────────────────────────────────
 *       `VaporWipe`: el vapor/espuma que acaba de nacer DENTRO de la película cruza el cuadro
 *       y detrás ya está la mesada con el abanico.
 *
 *  ACTO 5 · «SÍ, ES UNA LEJÍA» · 0.775 → 0.895 (f977 → f1128)
 *    enterFrom  cam  sin salto
 *               luz  t≈0.78 → 0.90
 *               mat  `Fan3D` que arranca CERRADO (open 0 = las tres cartas superpuestas: se lee
 *                    como la MISMA tarjeta que venía) y se abre con desfase por carta.
 *                    Carta delantera = `h05_bottlepalm`, la materia que cruzó la frontera D.
 *    exitTo     cam  RIG {px≈−110}
 *               luz  t≈0.90
 *               mat  la carta delantera, en su caja EXACTA (420×270 @ x+300, y+12, z+27, ry−9)
 *    ── FRONTERA E @ 0.895 · CORTE EN EL BEAT ──────────────────────────────────────────────
 *       Corte seco en "One more…". La primera tarjeta del acto 6 nace en la caja IDÉNTICA de
 *       la carta delantera: mismo encuadre, misma escala, misma luz → sólo cambia el material.
 *       Un golpe de cámara amortiguado (arranca en 0, así que es continuo) firma el corte.
 *
 *  ACTO 6 · «NO LE APUNTES UN VENTILADOR» · 0.895 → 1.000 (f1128 → f1260)
 *    enterFrom  cam  RIG con el golpe del corte
 *               luz  t≈0.90 → 1.00 ('cold' puro)
 *               mat  la MANCHA: el muro de `h46_patchymold` que veníamos atravesando es la
 *                    pared manchada a la que Mike le apunta el ventilador en `h40_fanoff`
 *    exitTo     cam  RIG → 0 en los últimos 44 f ⇒ `stageCam` aterriza SOLA en
 *                    CAM_ARC[4].to {z .18, panX −34, panY −12, ry −5, rz −.3}
 *               luz  'cold'
 *               mat  la tapa/el tanque: MovRefill abre levantando la tapa, con la luz ya fría
 *
 *  COSTURAS USADAS: OCLUSIÓN · ZOOM-THROUGH · MATCH-MOVE · WIPE POR MATERIA · CORTE EN EL BEAT.
 *  ⛔ Ningún fade en ninguna frontera · ⛔ dos fronteras seguidas nunca repiten costura.
 *
 *  ── MATERIAL REAL HARDCODEADO (⚠️ el build tiene que sumar estas rutas al tarball) ─────────
 *    broll/mdbleach_h38_twoshelves.mp4      broll/mdbleach_h05_bottlepalm.mp4
 *    broll/mdbleach_h20_bleachintofull.mp4  broll/mdbleach_h39_watertruck.mp4
 *    broll/mdbleach_h40_fanoff.mp4
 *    img/mdbleach_h02_labbeaker.jpg         img/mdbleach_h46_patchymold.jpg
 *    img/mdbleach_h41_dehumidifier.jpg      img/mdbleach_lam_whybleach.jpg
 *  CLIP donde el GESTO **es** el movimiento: el chorro que se abre al caer (h39, «el agua es
 *  el camión») y las aspas frenando bajo su dedo (h40, el acto 6 entero).
 *  FOTO donde hace falta quietud, o donde el clip no pasó auditoría: la mancha (es la CAMA del
 *  movimiento, vive >1000 frames), el deshumidificador (carta satélite que se lee mientras el
 *  ojo está en las aspas) y los dos platitos (clip rechazado, severidad 9: "scene teleport").
 *
 *  ── CONTRATO TÉCNICO ───────────────────────────────────────────────────────────────────────
 *  ⛔ Math.random / Date.now / new Date → todo sale de `rnd(i)` y de `useCurrentFrame()`.
 *  ⛔ backdrop-filter · ⛔ blur grande a pantalla completa.
 *  ⛔ Easing.quint (no existe) → Easing.poly(5). ⛔ Easing.out(undefined).
 *  ⚠️ Los clips duran 5,04 s (151 f). Cualquier tarjeta con .mp4 va dentro de `<Loop>` (una
 *     `Sequence` que reinicia el frame local cada 148 f) y el reinicio queda TAPADO por el
 *     barrido especular de esa misma tarjeta.
 *  ⛔ DENTRO de un `<Loop>` el `sheenAt` se mide en frames LOCALES (128-138), NUNCA globales:
 *     un `sheenAt={A6 + 96}` no dispara jamás porque el frame local no llega nunca a 1224.
 *     Las FOTOS no van en `<Loop>`: el `drift` del `Material` del Stage ya las mantiene vivas.
 *  ⚠️ UN solo `Space3D`: el movimiento es UN cuarto, no seis. Los grupos llevan `zIndex`
 *     explícito, y los objetos que tienen que ordenarse por profundidad de verdad (el peróxido
 *     metiéndose DETRÁS del muro de la mancha) viven en el MISMO grupo `preserve-3d`.
 *     Por eso ningún plano que deba ordenarse en 3D usa la propiedad `opacity` (aplana el
 *     subárbol): se oscurecen con un velo negro interno.
 *  Imports SÓLO de `remotion`, `react` y `./Stage`. Safe area 60 px. Rampa de entrada ≤15 f.
 */

import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  MD,
  F_SANS,
  rgba,
  lerp,
  clamp01,
  eio,
  rnd,
  Atmos,
  Motes,
  glassStyle,
  Sheen,
  Kicker,
  Title,
  Em,
  TextBed,
  Occluder,
  VaporWipe,
  ZoomThrough,
  stageCam,
  movLight,
  Space3D,
  Material,
  GlassPlate,
  Fan3D,
} from "./Stage";

/* ════════════════════════════════════════════════════════════════════════════════════════════
   UTILIDADES PURAS
   ════════════════════════════════════════════════════════════════════════════════════════════ */
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E_OUT = Easing.out(Easing.cubic);
const E_SOFT = Easing.inOut(Easing.quad);
const E_DEEP = Easing.bezier(0.2, 0.72, 0.1, 1);
const E_DIVE = Easing.in(Easing.poly(3)); // ⚠️ poly(n), NUNCA Easing.quint (no existe)

const seg = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
const es = (f: number, a: number, b: number, easing: (x: number) => number = E_SOFT) =>
  interpolate(seg(f, a, b), [0, 1], [0, 1], { easing, ...CL });
const mv = (
  f: number,
  a: number,
  b: number,
  v0: number,
  v1: number,
  easing: (x: number) => number = E_SOFT,
) => lerp(v0, v1, es(f, a, b, easing));

/* ── RUTAS DE MATERIAL REAL (⛔ un 404 mata el chunk entero) ──────────────────────────────── */
const M = {
  shelves: "broll/mdbleach_h38_twoshelves.mp4", // la jarra blanca y el frasco marrón en el estante
  truck: "broll/mdbleach_h39_watertruck.mp4", // el chorro que SE ABRE al caer en la fuente
  bottle: "broll/mdbleach_h05_bottlepalm.mp4", // el frasco marrón girando en la palma
  // ⛔ `h02_labbeaker` va en FOTO a propósito: el clip lo rechazó el auditor de movimiento con
  // severidad 9 ("scene teleport") — es un plano casi sin acción y el modelo se inventa cambios.
  // Como carta de un abanico tampoco necesita moverse: la acción es la del abanico abriéndose.
  dishes: "img/mdbleach_h02_labbeaker.jpg", // dos platitos idénticos: uno claro, uno turbio
  bleach: "broll/mdbleach_h20_bleachintofull.mp4", // la jarra volcando en la taza LLENA
  // la mancha también se queda en FOTO: es la CAMA del movimiento (vive >1000 frames detrás de
  // todo) y en clip obligaría a 7 reinicios de loop, robándole la lectura a lo que pasa delante.
  mold: "img/mdbleach_h46_patchymold.jpg", // MACRO de la mancha negra irregular
  fanoff: "broll/mdbleach_h40_fanoff.mp4", // las aspas FRENANDO cuando su dedo mueve la perilla
  // el deshumidificador se queda en FOTO: es la carta satélite que se lee mientras el ojo está
  // en las aspas frenando. Dos movimientos compitiendo en el mismo acto se anulan.
  dehum: "img/mdbleach_h41_dehumidifier.jpg", // Mike en cuclillas sobre el deshumidificador
  sheet: "img/mdbleach_lam_whybleach.jpg", // la lámina "why bleach"
} as const;

/* ════════════════════════════════════════════════════════════════════════════════════════════
   LOOP DE MATERIAL — los clips duran 151 frames; los actos, hasta 270.
   Una `Sequence` cuyo `from` se recalcula por frame reinicia el frame LOCAL cada `len`.
   La geometría de la tarjeta se calcula SIEMPRE afuera, con el frame global, así que el
   reinicio no toca ni la posición ni la escala: sólo rebobina el material.
   ════════════════════════════════════════════════════════════════════════════════════════════ */
const Loop: React.FC<{ start: number; len?: number; children: React.ReactNode }> = ({
  start,
  len = 148,
  children,
}) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.floor((frame - start) / len));
  return (
    <Sequence from={start + k * len} durationInFrames={len} layout="none">
      {children}
    </Sequence>
  );
};

/* ── Rótulo-objeto: chip de vidrio anclado a una tarjeta (no es "texto flotando") ─────────── */
const Chip: React.FC<{ children: React.ReactNode; tone?: "red" | "white" | "dim"; show?: number }> = ({
  children,
  tone = "white",
  show = 1,
}) => {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  const c = tone === "red" ? MD.redHot : tone === "dim" ? rgba(MD.bone, 0.6) : MD.white;
  return (
    <div
      style={{
        display: "inline-block",
        ...glassStyle({ radius: 999, lit: 0.9 }),
        padding: "9px 20px",
        transform: `translateY(${((1 - s) * 14).toFixed(1)}px) scale(${(0.9 + s * 0.1).toFixed(3)})`,
        clipPath: `inset(0 ${((1 - s) * 100).toFixed(1)}% 0 0 round 999px)`,
      }}
    >
      <span
        style={{
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: 21,
          letterSpacing: 2.6,
          textTransform: "uppercase",
          color: c,
          whiteSpace: "nowrap",
          textShadow: "0 2px 10px rgba(0,0,0,.9)",
        }}
      >
        {children}
      </span>
    </div>
  );
};

/* ── Bloque semántico de texto: NO aparece con opacidad, se DESCUBRE con un filo rojo que va
      3-4 frames adelante de las letras (el marcador abre el camino, la escritura lo sigue). ── */
const Blk: React.FC<{ f: number; at: number; dur?: number; dy?: number; children: React.ReactNode }> = ({
  f,
  at,
  dur = 15,
  dy = 22,
  children,
}) => {
  const e = es(f, at, at + dur, E_OUT);
  if (e <= 0) return null;
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: 4,
        transform: `translateY(${((1 - e) * dy).toFixed(2)}px)`,
      }}
    >
      {/* el padding + margin negativo mete la SOMBRA del titular DENTRO de la caja de recorte:
          el filo rojo descubre también el halo y no corta el texto en seco.
          Y evita `inset()` con porcentajes negativos, que no todos los motores respetan. */}
      <div
        style={{
          padding: "26px 10px 22px 10px",
          margin: "-26px -10px -22px -10px",
          clipPath: `inset(0 ${((1 - e) * 102).toFixed(1)}% 0 0)`,
        }}
      >
        {children}
      </div>
      {e > 0 && e < 1 && (
        <div
          style={{
            position: "absolute",
            top: "-6%",
            bottom: "-2%",
            left: `${(e * 100).toFixed(1)}%`,
            width: 5,
            background: MD.red,
            boxShadow: `0 0 26px ${rgba(MD.red, 0.95)}`,
          }}
        />
      )}
    </div>
  );
};

/* ── Regla roja que se dibuja (estructura, no protagonista) ───────────────────────────────── */
/* ── Cama oscura en GRADIENTE LATERAL. Cumple la misma regla que `TextBed` (⛔ nunca texto
      claro y fino sobre material claro) pero con OTRA forma, para que las camas del movimiento
      no se lean como el mismo rectángulo repetido acto tras acto. ───────────────────────────── */
const SideBed: React.FC<{ half: "top" | "bottom"; strength?: number }> = ({ half, strength = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: "42%",
      top: half === "top" ? 0 : "38%",
      bottom: half === "top" ? "38%" : 0,
      background:
        `linear-gradient(90deg, ${rgba("#06060A", 0.9 * strength)} 0%, ${rgba("#06060A", 0.74 * strength)} 46%, rgba(0,0,0,0) 100%), ` +
        `linear-gradient(${half === "top" ? "180deg" : "0deg"}, ${rgba("#06060A", 0.5 * strength)} 0%, rgba(0,0,0,0) 100%)`,
    }}
  />
);

const Rule: React.FC<{ p: number; w?: number; color?: string }> = ({ p, w = 430, color = MD.red }) => (
  <div
    style={{
      width: w * clamp01(p),
      height: 4,
      marginTop: 20,
      background: `linear-gradient(90deg, ${color} 0%, ${rgba(color, 0.15)} 100%)`,
      boxShadow: `0 0 22px ${rgba(color, 0.75)}`,
    }}
  />
);

/* ════════════════════════════════════════════════════════════════════════════════════════════
   EL MURO DE LA MANCHA — la materia más persistente del movimiento.
   Es el destino del acto 3, la superficie que el peróxido ATRAVIESA en el 4, y la pared
   manchada a la que Mike le apunta el ventilador en el 6.
   ⛔ Sin `opacity`: se oscurece con un velo interno para no aplanar el subárbol 3D (si se
   aplana, el peróxido no puede quedar DETRÁS de él y el acto 4 pierde su único truco real).
   ════════════════════════════════════════════════════════════════════════════════════════════ */
const Wall: React.FC<{
  w: number;
  h: number;
  z: number;
  dark: number; // 0 = a plena luz · 1 = negro
  x?: number;
  y?: number;
  clean?: number;
  bloom?: number;
}> = ({ w, h, z, dark, x = 0, y = 0, clean = 0, bloom = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: w,
      height: h,
      transform: `translate(-50%,-50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`,
      transformStyle: "preserve-3d",
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "inset 0 0 200px rgba(0,0,0,.9), 0 60px 140px rgba(0,0,0,.75)",
    }}
  >
    <Material src={M.mold} drift={0.12} focusX={52} focusY={48} />
    {/* la mancha nunca se lee plana: viñeta propia + tinte verde-moho del canal */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(72% 62% at 50% 50%, rgba(0,0,0,0) 0%, ${rgba(MD.mold, 0.28)} 58%, rgba(0,0,0,.86) 100%)`,
      }}
    />
    {clean > 0 && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "screen",
          background: `radial-gradient(42% 44% at 52% 50%, ${rgba(MD.white, 0.6 * clean)} 0%, rgba(255,255,255,0) 74%)`,
        }}
      />
    )}
    {bloom > 0 && (
      <div
        style={{
          position: "absolute",
          left: "52%",
          top: "50%",
          width: 380 * bloom,
          height: 380 * bloom,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          mixBlendMode: "screen",
          background: `radial-gradient(circle, ${rgba(MD.white, 0.78 * bloom)} 0%, ${rgba(MD.cold, 0.22 * bloom)} 46%, rgba(255,255,255,0) 70%)`,
        }}
      />
    )}
    {/* velo de oscuridad (en vez de opacity) */}
    <div style={{ position: "absolute", inset: 0, background: rgba(MD.ink0, clamp01(dark)) }} />
  </div>
);

/* ── LA ENTRADA DE LA CASA: líneas de suelo que se van en profundidad. Estructura pura ────── */
const Driveway: React.FC<{ f: number; on: number }> = ({ f, on }) => {
  const a = clamp01(on);
  if (a <= 0.01) return null;
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const z = 200 - i * 148;
        const flow = ((f * 1.6 + i * 90) % 1200) / 1200;
        const k = 1 - i / 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 1560,
              height: 2,
              transform: `translate(-50%,-50%) translate3d(0px, ${330 + i * 4}px, ${z}px)`,
              background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(
                MD.cold,
                (0.05 + 0.12 * k) * a * (0.5 + 0.5 * Math.sin(flow * Math.PI)),
              )} 40%, ${rgba(MD.cold, 0.02 * a)} 100%)`,
            }}
          />
        );
      })}
    </>
  );
};

/* ── Partículas: lo que se le arranca al cloro mientras viaja (acto 3) ───────────────────── */
const Torn: React.FC<{ f: number; from: number; amount: number; x: number; y: number }> = ({
  f,
  from,
  amount,
  x,
  y,
}) => {
  const a = clamp01(amount);
  if (a <= 0.02) return null;
  return (
    <>
      {Array.from({ length: 26 }, (_, i) => {
        const s = rnd(i * 5.3);
        const s2 = rnd(i * 9.1);
        const k = (((f - from) / (52 + s * 60) + s2) % 1 + 1) % 1;
        const size = 3 + s * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: `translate(-50%,-50%) translate3d(${(x - 260 + s * 520 - k * 190).toFixed(
                1,
              )}px, ${(y - 180 + s2 * 360 - k * 90).toFixed(1)}px, ${(120 + k * 340).toFixed(1)}px)`,
              background: rgba(MD.redHot, (1 - k) * 0.5 * a),
              boxShadow: `0 0 ${12 * (1 - k)}px ${rgba(MD.red, (1 - k) * 0.55 * a)}`,
            }}
          />
        );
      })}
    </>
  );
};

/* ── Esporas: lo que el ventilador manda a toda la habitación (acto 6) ───────────────────── */
const Spores: React.FC<{ f: number; from: number; blow: number }> = ({ f, from, blow }) => {
  const b = clamp01(blow);
  if (b <= 0.02) return null;
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => {
        const s = rnd(i * 4.7);
        const s2 = rnd(i * 12.9);
        const k = (((f - from) * (0.006 + s * 0.008) * (0.25 + 0.75 * b) + s2) % 1 + 1) % 1;
        const size = 2 + s * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: `translate(-50%,-50%) translate3d(${(-700 + k * 1420).toFixed(1)}px, ${(
                -300 +
                s2 * 620 +
                Math.sin((f + i * 20) / 34) * 22
              ).toFixed(1)}px, ${(-120 + s * 420).toFixed(1)}px)`,
              background: rgba(MD.moldLit, (0.18 + s * 0.3) * b),
              boxShadow: `0 0 ${8 * b}px ${rgba(MD.mold, 0.4 * b)}`,
            }}
          />
        );
      })}
    </>
  );
};

/* ── Velo interno para apagar una tarjeta sin usar `opacity` (no aplana el 3D) ───────────── */
const Veil: React.FC<{ dark?: number; red?: number; rise?: number }> = ({ dark = 0, red = 0, rise = 0 }) => (
  <>
    {red > 0 && (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: `${clamp01(rise) * 100}%`,
          background: `linear-gradient(0deg, ${rgba(MD.red, 0.62 * red)} 0%, ${rgba(
            MD.red,
            0.16 * red,
          )} 62%, rgba(0,0,0,0) 100%)`,
        }}
      />
    )}
    {dark > 0 && <div style={{ position: "absolute", inset: 0, background: rgba(MD.ink0, clamp01(dark)) }} />}
  </>
);

/* ════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ════════════════════════════════════════════════════════════════════════════════════════════ */
export const MovTruck: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = Math.max(240, durationInFrames);
  const f = Math.min(frame, D - 1);
  const p = clamp01(f / D);

  // ── ACTOS COMO FRACCIONES (±20 % de la duración nominal) ─────────────────────────────────
  const A2 = Math.round(D * 0.15);
  const A3 = Math.round(D * 0.36);
  const A4 = Math.round(D * 0.575);
  const A5 = Math.round(D * 0.775);
  const A6 = Math.round(D * 0.895);

  /* ── LA CÁMARA ─────────────────────────────────────────────────────────────────────────────
     Raíz = `stageCam(p, 4)`: entra en CAM_ARC[4].from y aterriza en CAM_ARC[4].to. Ningún acto
     la toca. Encima, RIG: UNA curva continua del frame GLOBAL (todos los términos valen 0 en
     f=0 y el `settle` los devuelve a 0 en los últimos 44 f). El `swing` es el vector sostenido
     que hace posible el MATCH-MOVE de la frontera C.                                         */
  const cam = stageCam(p, 4);
  const settle = 1 - es(f, D - 44, D, E_SOFT);
  const swing = es(f, D * 0.515, D * 0.635, E_DEEP);
  const impact =
    f >= A6 ? Math.exp(-(f - A6) / 8) * Math.sin((f - A6) / 2.4) * 5.5 * settle : 0;

  const rigX =
    (-46 * Math.sin(p * Math.PI * 0.9) + 38 * Math.sin(p * Math.PI * 2.4) - 120 * swing) * settle;
  const rigY =
    (-28 * (1 - Math.cos(p * Math.PI * 1.7)) * 0.5 + 13 * Math.sin(p * Math.PI * 3.1)) * settle;
  const rigZ = (88 * Math.sin(p * Math.PI * 1.35) - 38 * Math.sin(p * Math.PI * 2.9)) * settle;
  const rigRY = -2.6 * Math.sin(p * Math.PI * 1.1) * settle;
  const rigRX = 2.0 * (Math.cos(p * Math.PI * 0.8) - 1) * settle;
  const bx = (Math.sin(f / 53) * 2.2 + Math.sin(f / 121) * 1.3) * settle;
  const by = Math.cos(f / 67) * 1.8 * settle;

  const rigTransform =
    `translate3d(${(rigX + bx + impact).toFixed(2)}px, ${(rigY + by).toFixed(2)}px, ${rigZ.toFixed(2)}px) ` +
    `rotateY(${rigRY.toFixed(3)}deg) rotateX(${rigRX.toFixed(3)}deg)`;

  // ── LA LUZ: viene 'warm' de MovLetter, muere 'cold'. La key VIAJA de derecha a izquierda. ──
  const tint = movLight(4, p);
  const keyFrom = lerp(0.72, 0.24, eio(0, 1, p));

  // ── EL AVATAR: sólo se ve en el acto 1 (la pregunta del espectador). La atmósfera se
  //    enciende EXACTAMENTE en el frame en que la banda del `Occluder` cubre el 100 %.
  const OCC_A = A2 - 9;
  const atmosOn = f >= A2 ? 1 : 0;

  /* ══════════════════════════════════════════════════════════════════════════════════════════
     ACTO 1 + ACTO 2 · la tarjeta del estante y las dos entregas
     ══════════════════════════════════════════════════════════════════════════════════════════ */
  // la tarjeta del estante: entra en 14 frames por la derecha, cruza la FRONTERA A viajando
  // y se convierte en panel ancho (match-shape inline: la misma materia cambia de caja).
  const shelfIn = es(f, 4, 18, E_OUT);
  const shelfX = mv(f, A2 - 26, A2 + 64, 430, -40, E_DEEP) + (1 - shelfIn) * 520;
  const shelfY = mv(f, A2 - 26, A2 + 64, -190, -20, E_DEEP);
  const shelfW = mv(f, A2 - 26, A2 + 64, 520, 1080, E_DEEP);
  const shelfH = mv(f, A2 - 26, A2 + 64, 330, 640, E_DEEP);
  const shelfRY = mv(f, A2 - 26, A2 + 64, -9, 5, E_DEEP);
  const shelfR = mv(f, A2 - 26, A2 + 64, 16, 22, E_DEEP);
  const shelfOut = es(f, A2 + 96, A2 + 158, E_DEEP); // se va EN PROFUNDIDAD, no con un fade
  const shelfZ = mv(f, A2 - 26, A2 + 64, 90, 10, E_DEEP) - shelfOut * 560;

  // el chorro: sube desde abajo de cuadro (entra en el espacio, no en opacidad)
  const pourIn = es(f, A2 + 88, A2 + 142, E_DEEP);
  const pourY = lerp(880, -18, pourIn);
  const pourW = lerp(680, 880, pourIn);
  const pourH = lerp(430, 556, pourIn);
  const pourZ = lerp(-140, 40, pourIn);
  // el SPLIT: a `split = 0` las dos tarjetas están superpuestas → se leen como UNA sola
  const split = es(f, A3 - 74, A3 - 26, E_DEEP);
  const labels12 = es(f, A3 - 46, A3 - 22, E_OUT);

  /* ══════════════════════════════════════════════════════════════════════════════════════════
     ACTO 3 + ACTO 4 · los dos camiones (viven en el MISMO grupo: la materia no se duplica)
     ══════════════════════════════════════════════════════════════════════════════════════════ */
  // CLORO: nace en la coordenada exacta donde entró el zoom-through y se va por la entrada
  const clX = mv(f, A3 - 4, A3 + 150, -300, -70, E_DEEP) - mv(f, A4 - 40, A4 + 40, 0, 350, E_DEEP);
  const clZ = mv(f, A3 - 4, A3 + 206, 240, -520, E_DEEP) + mv(f, A4 - 40, A4 + 40, 0, 230, E_SOFT);
  const clW = mv(f, A4 - 40, A4 + 40, 1080, 520, E_DEEP);
  const clH = mv(f, A4 - 40, A4 + 40, 620, 320, E_DEEP);
  const clRY = mv(f, A3 + 40, A4, 0, -9, E_SOFT);
  const eaten = es(f, A3 + 44, A3 + 196, E_SOFT); // se lo comen en la entrada
  const clDead = es(f, A3 + 150, A4 + 20, E_SOFT);

  // PERÓXIDO: entra estacionando por la derecha, espera, y en la frontera C se viene al centro
  const pxIn = es(f, A3 + 34, A3 + 62, E_OUT);
  const pxX = lerp(920, 545, pxIn) + mv(f, A4 - 40, A4 + 34, 0, -505, E_DEEP);
  const pxZ = mv(f, A4 - 40, A4 + 34, -260, 40, E_DEEP);
  const pxW = mv(f, A4 - 40, A4 + 34, 340, 880, E_DEEP);
  const pxH = mv(f, A4 - 40, A4 + 34, 220, 552, E_DEEP);
  const pxY = mv(f, A4 - 40, A4 + 34, 150, -12, E_DEEP);
  // el GIRO: cara A = el chorro (el camión) · cara B = el frasco (lo que viaja adentro)
  const flip = mv(f, A4 + 46, A4 + 96, -24, 180, E_DEEP);
  const showBack = Math.cos((flip * Math.PI) / 180) < 0;
  // y después SE METE: cruza el z del muro (z −420) → el muro lo tapa de verdad
  const dive = es(f, A4 + 112, A5 - 22, E_DIVE);
  const pxZFinal = pxZ - dive * 700;
  const wallDark = f < A3 ? 0.9 : lerp(0.9, 0.26, es(f, A3, A3 + 130, E_SOFT));
  const bloom = es(f, A4 + 168, A5 - 30, E_OUT) * (1 - es(f, A5 + 40, A5 + 90, E_SOFT));
  const clean = es(f, A4 + 190, A5 + 30, E_SOFT);

  /* ══════════════════════════════════════════════════════════════════════════════════════════
     ACTO 5 · el abanico  ·  ACTO 6 · la corrección
     ══════════════════════════════════════════════════════════════════════════════════════════ */
  const fanOpen = es(f, A5 + 14, A5 + 76, E_DEEP);
  // caja EXACTA de la carta delantera del abanico (n=3, i=2) → la costura E calza al pixel
  const FRONT = { w: 420, h: 270, x: 300 * fanOpen, y: 12 * fanOpen, z: 26.7 * fanOpen, ry: -9 * fanOpen };

  const grow = es(f, A6 + 4, A6 + 34, E_DEEP);
  const fanX = lerp(FRONT.x, -180, grow);
  const fanY = lerp(FRONT.y, -130, grow);
  const fanW = lerp(FRONT.w, 880, grow);
  const fanH = lerp(FRONT.h, 550, grow);
  const fanZ = lerp(FRONT.z, 40, grow);
  const fanRY = lerp(FRONT.ry, 3, grow);
  const dehumIn = es(f, A6 + 46, A6 + 84, E_DEEP);
  const blow = 1 - es(f, A6 + 52, A6 + 78, E_OUT); // la mano APAGA: las esporas frenan

  /* ── LA CAPA DE TEXTO vive en ESPACIO DE PANTALLA (safe area garantizada) ────────────────── */
  const textParallax = `translate3d(${(rigX * 0.18 + cam.state.panX * 0.1).toFixed(2)}px, ${(
    rigY * 0.18 +
    cam.state.panY * 0.1
  ).toFixed(2)}px, 0)`;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: montada UNA vez, jamás remontada. En el acto 1 está apagada para que
             se vea el avatar; se enciende BAJO la banda del Occluder, nunca con un fade. ── */}
      <AbsoluteFill style={{ opacity: atmosOn }}>
        <Atmos tint={tint} keyFrom={keyFrom} intensity={lerp(0.94, 1.08, Math.sin(p * Math.PI))} />
      </AbsoluteFill>
      {/* el polvo del cuarto está en pantalla DESDE EL FRAME 0 (también sobre el avatar) */}
      <AbsoluteFill style={{ opacity: atmosOn ? 1 : 0.5 }}>
        <Motes n={40} tint={atmosOn ? MD.cold : MD.bone} speed={0.85} />
      </AbsoluteFill>

      {/* ══ EL ESPACIO: UN solo Space3D. El movimiento es UN cuarto, no seis. ══ */}
      <Space3D depth={1800}>
        <AbsoluteFill style={{ transform: cam.transform, transformStyle: "preserve-3d" }}>
          <AbsoluteFill style={{ transform: rigTransform, transformStyle: "preserve-3d" }}>
            {/* ── GRUPO 10 · el muro de la mancha fuera del tramo en que hay que ordenarlo ── */}
            {f >= A2 && f < A3 - 4 && (
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", zIndex: 10 }}>
                <Wall w={1500} h={880} z={-420} dark={0.9} />
              </div>
            )}
            {f >= A5 && (
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", zIndex: 10 }}>
                <Wall
                  w={1500}
                  h={880}
                  z={-420}
                  dark={lerp(0.26, 0.72, es(f, A5, A5 + 90, E_SOFT))}
                  clean={clean}
                  bloom={bloom}
                />
              </div>
            )}

            {/* ══ GRUPO 20 · ACTO 1 + ACTO 2 ══════════════════════════════════════════════
                 FRONTERA B = ZOOM-THROUGH: la cámara entra por la tarjeta IZQUIERDA. */}
            {f < A3 && (
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", zIndex: 20 }}>
                <ZoomThrough at={A3 - 20} dur={20} into={[34, 47]} scale={9}>
                  <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
                    {/* EL ESTANTE — protagonista del acto 1, materia que cruza la FRONTERA A */}
                    {f < A2 + 162 && (
                      <Loop start={0}>
                        <GlassPlate
                          src={M.shelves}
                          w={shelfW}
                          h={shelfH}
                          x={shelfX}
                          y={shelfY}
                          z={shelfZ}
                          ry={shelfRY}
                          rz={mv(f, A2 - 26, A2 + 64, 1.4, -0.6, E_DEEP)}
                          radius={shelfR}
                          lit={lerp(0.55, 0.85, es(f, A2 - 20, A2 + 60, E_SOFT))}
                          sheenAt={138}
                          focusX={54}
                          focusY={50}
                          label={
                            f < A2 + 70 ? (
                              <Chip tone="dim" show={es(f, 26, 44, E_OUT) * (1 - es(f, A2 + 40, A2 + 66, E_SOFT))}>
                                both mostly water
                              </Chip>
                            ) : undefined
                          }
                        >
                          <Veil dark={shelfOut * 0.55} />
                        </GlassPlate>
                      </Loop>
                    )}

                    {/* EL CHORRO — protagonista del acto 2. Nace UNO y se vuelve DOS. */}
                    {f >= A2 + 80 && (
                      <Loop start={A2 + 80}>
                        <GlassPlate
                          src={M.truck}
                          w={lerp(pourW, 640, split)}
                          h={lerp(pourH, 400, split)}
                          x={lerp(260, -310, split)}
                          y={lerp(pourY, -10, split)}
                          z={lerp(pourZ, 10, split)}
                          ry={lerp(0, 8, split)}
                          rz={lerp(0, 1.1, split)}
                          radius={20}
                          lit={0.72}
                          sheenAt={130}
                          focusX={48}
                          focusY={44}
                          label={<Chip tone="red" show={labels12}>chlorine</Chip>}
                        />
                        <GlassPlate
                          src={M.truck}
                          w={lerp(pourW, 640, split)}
                          h={lerp(pourH, 400, split)}
                          x={lerp(260, 330, split)}
                          y={lerp(pourY, -10, split)}
                          z={lerp(pourZ, 10, split)}
                          ry={lerp(0, -8, split)}
                          rz={lerp(0, -1.1, split)}
                          radius={20}
                          lit={0.72}
                          sheenAt={136}
                          focusX={48}
                          focusY={44}
                          label={<Chip tone="white" show={labels12}>peroxide</Chip>}
                        />
                      </Loop>
                    )}
                  </AbsoluteFill>
                </ZoomThrough>
              </div>
            )}

            {/* ══ GRUPO 30 · LOS DOS CAMIONES (actos 3 y 4) ═══════════════════════════════
                 El muro vive ACÁ dentro para que el peróxido pueda quedar DETRÁS de él. */}
            {f >= A3 - 4 && f < A5 && (
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", zIndex: 30 }}>
                <Driveway f={f} on={es(f, A3 + 10, A3 + 70, E_SOFT) * (1 - es(f, A5 - 90, A5, E_SOFT))} />
                <Wall w={1500} h={880} z={-420} dark={wallDark} clean={clean} bloom={bloom} />

                {/* CLORO — nunca llega: se lo comen en la entrada */}
                <Loop start={A3 - 4}>
                  <GlassPlate
                    src={M.bleach}
                    w={clW}
                    h={clH}
                    x={clX}
                    y={mv(f, A3, A4 + 40, 0, 86, E_SOFT)}
                    z={clZ}
                    ry={clRY}
                    rz={mv(f, A3 + 60, A4 + 40, 0, 2.6, E_SOFT)}
                    radius={20}
                    lit={lerp(0.85, 0.2, eaten)}
                    sheenAt={138}
                    focusX={50}
                    focusY={46}
                    label={
                      <Chip tone="red" show={es(f, A3 + 22, A3 + 44, E_OUT)}>
                        chlorine · 6%
                      </Chip>
                    }
                  >
                    <Veil dark={clDead * 0.62} red={eaten} rise={0.2 + eaten * 0.85} />
                  </GlassPlate>
                </Loop>
                <Torn f={f} from={A3 + 44} amount={eaten * (1 - clDead * 0.6)} x={clX} y={40} />

                {/* PERÓXIDO — espera, entra al centro con la cámara, GIRA y se mete */}
                {f >= A3 + 30 && (
                  <>
                    {!showBack && (
                      <Loop start={A3 + 30}>
                        <GlassPlate
                          src={M.truck}
                          w={pxW}
                          h={pxH}
                          x={pxX}
                          y={pxY}
                          z={pxZFinal}
                          ry={flip}
                          rz={mv(f, A4 - 40, A4 + 34, -2.4, 0, E_DEEP)}
                          radius={20}
                          lit={lerp(0.3, 0.9, es(f, A4 - 40, A4 + 34, E_SOFT))}
                          sheenAt={132}
                          focusX={48}
                          focusY={44}
                          label={
                            f < A4 + 30 ? (
                              <Chip tone="white" show={es(f, A3 + 52, A3 + 76, E_OUT)}>
                                still waiting
                              </Chip>
                            ) : undefined
                          }
                        >
                          <Veil dark={(1 - es(f, A4 - 40, A4 + 20, E_SOFT)) * 0.42} />
                        </GlassPlate>
                      </Loop>
                    )}
                    {showBack && (
                      <Loop start={A4 + 69}>
                        <GlassPlate
                          src={M.bottle}
                          w={pxW}
                          h={pxH}
                          x={pxX}
                          y={pxY}
                          z={pxZFinal}
                          ry={flip + 180}
                          radius={20}
                          lit={0.92}
                          sheenAt={138}
                          focusX={50}
                          focusY={48}
                          label={
                            dive < 0.25 ? (
                              <Chip tone="white" show={es(f, A4 + 100, A4 + 124, E_OUT)}>
                                what rides inside
                              </Chip>
                            ) : undefined
                          }
                        />
                      </Loop>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ══ GRUPO 40 · ACTO 5 · el abanico. Arranca CERRADO: se lee como la misma
                 tarjeta que venía. La carta delantera es el frasco que acaba de entrar. ══ */}
            {f >= A5 - 8 && f < A6 && (
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", zIndex: 40 }}>
                <Loop start={A5 - 8}>
                  <Fan3D
                    items={[
                      { src: M.dishes, label: <Chip tone="dim">two bleaches</Chip> },
                      { src: M.sheet, label: <Chip tone="dim">oxidizing</Chip> },
                      { src: M.bottle, label: <Chip tone="white">no chlorine</Chip> },
                    ]}
                    open={fanOpen}
                    w={420}
                    h={270}
                    spread={300}
                    arc={9}
                    z={0}
                    sheenAt={138}
                  />
                </Loop>
              </div>
            )}

            {/* ══ GRUPO 50 · ACTO 6 · la corrección honesta. La primera tarjeta nace en la
                 caja EXACTA de la carta delantera del abanico: corte seco en el beat. ══ */}
            {f >= A6 && (
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", zIndex: 50 }}>
                <Spores f={f} from={A6} blow={blow} />
                <Loop start={A6}>
                  <GlassPlate
                    src={M.fanoff}
                    w={fanW}
                    h={fanH}
                    x={fanX}
                    y={fanY}
                    z={fanZ}
                    ry={fanRY}
                    rz={lerp(0, -0.8, grow)}
                    radius={lerp(18, 22, grow)}
                    lit={0.9}
                    sheenAt={128}
                    focusX={52}
                    focusY={52}
                    label={
                      <Chip tone="red" show={es(f, A6 + 30, A6 + 52, E_OUT)}>
                        fan off
                      </Chip>
                    }
                  />
                </Loop>
                {f >= A6 + 40 && (
                  <GlassPlate
                    src={M.dehum}
                    w={360}
                    h={232}
                    x={lerp(900, 470, dehumIn)}
                    y={lerp(170, 110, dehumIn)}
                    z={lerp(-360, -110, dehumIn)}
                    ry={lerp(-30, -14, dehumIn)}
                    rz={lerp(-3, -1.2, dehumIn)}
                    radius={16}
                    lit={0.6}
                    focusX={50}
                    focusY={50}
                    label={
                      <Chip tone="white" show={es(f, A6 + 78, A6 + 98, E_OUT)}>
                        dry it instead
                      </Chip>
                    }
                  />
                )}
              </div>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      </Space3D>

      {/* ══════════════════════════════════════════════════════════════════════════════════
           TEXTO · espacio de pantalla, acoplado a la cámara con parallax ×0.18.
           Una idea por acto, titular ≤7 palabras, detalle ≥30 px, cama oscura donde cae
           sobre material. ⛔ En el acto 1 NADA por encima de y=790: no se tapa ni la boca
           ni el mentón del avatar, y todo va con cama oscura sobre ropa clara.
         ══════════════════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: textParallax, pointerEvents: "none" }}>
        {/* ACTO 1 · la pregunta del espectador (tercio inferior izquierdo) */}
        {f < A2 && (
          <div style={{ position: "absolute", left: 84, bottom: 76, width: 812 }}>
            <TextBed pad={26} w="100%">
              <Blk f={f} at={10} dur={12} dy={10}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Kicker>the objection</Kicker>
                  <div
                    style={{
                      width: 13,
                      height: 24,
                      background: MD.red,
                      opacity: Math.floor(f / 11) % 2 === 0 ? 0.95 : 0.12,
                    }}
                  />
                </div>
              </Blk>
              <div style={{ height: 12 }} />
              <Blk f={f} at={26} dur={17}>
                <Title size={50}>MIKE, PEROXIDE IS MOSTLY WATER TOO.</Title>
              </Blk>
              <div style={{ height: 10 }} />
              <Blk f={f} at={62} dur={15}>
                <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 32, color: MD.bone }}>
                  So what exactly are you <Em>selling</Em> here?
                </div>
              </Blk>
            </TextBed>
          </div>
        )}

        {/* ACTO 2 · el agua es el camión */}
        {f >= A2 + 6 && f < A3 - 6 && (
          <div style={{ position: "absolute", left: 84, bottom: 96, width: 792 }}>
            <TextBed pad={28} w="100%">
              <Blk f={f} at={A2 + 22} dur={12} dy={10}>
                <Kicker color={MD.bone}>the honest answer</Kicker>
              </Blk>
              <div style={{ height: 14 }} />
              <Blk f={f} at={A2 + 40} dur={17}>
                <Title size={62}>WATER IS NOT THE WEAPON.</Title>
              </Blk>
              <div style={{ height: 6 }} />
              <Blk f={f} at={A2 + 74} dur={19}>
                <Title size={86}>
                  <Em>water is the truck</Em>
                </Title>
              </Blk>
              <Rule p={es(f, A2 + 104, A2 + 148, E_OUT)} w={430} />
              <Blk f={f} at={A2 + 130} dur={15}>
                <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, color: MD.bone, marginTop: 16 }}>
                  What matters is what rides in it — and whether it is still alive on arrival.
                </div>
              </Blk>
            </TextBed>
          </div>
        )}

        {/* ACTO 3 · se lo comen en la entrada */}
        {f >= A3 + 4 && f < A4 + 6 && (
          <div style={{ position: "absolute", left: 84, top: 132, width: 720 }}>
            <TextBed pad={28} w="100%">
              <Blk f={f} at={A3 + 16} dur={12} dy={10}>
                <Kicker>the driveway</Kicker>
              </Blk>
              <div style={{ height: 14 }} />
              <Blk f={f} at={A3 + 34} dur={17}>
                <Title size={60}>CHLORINE DOES NOT ARRIVE.</Title>
              </Blk>
              <div style={{ height: 6 }} />
              <Blk f={f} at={A3 + 70} dur={19}>
                <Title size={76}>
                  <Em>it gets eaten in the driveway</Em>
                </Title>
              </Blk>
              {/* medidor: estructura dibujada, no protagonista */}
              <div style={{ marginTop: 22, width: 430, height: 8, background: rgba(MD.white, 0.1), borderRadius: 99 }}>
                <div
                  style={{
                    width: `${(eaten * 100).toFixed(1)}%`,
                    height: "100%",
                    borderRadius: 99,
                    background: `linear-gradient(90deg, ${MD.red}, ${MD.redHot})`,
                    boxShadow: `0 0 20px ${rgba(MD.red, 0.8)}`,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: F_SANS,
                  fontWeight: 800,
                  fontSize: 30,
                  letterSpacing: 1.4,
                  color: eaten > 0.85 ? MD.redHot : MD.bone,
                  marginTop: 12,
                }}
              >
                {`SPENT ON THE WAY IN — ${Math.round(eaten * 100)}%`}
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 4 · entra caminando (sobre negro: sin cama, con sombra fuerte) */}
        {f >= A4 + 22 && f < A5 - 4 && (
          <>
            <SideBed half="bottom" strength={es(f, A4 + 22, A4 + 40, E_OUT)} />
            <div style={{ position: "absolute", left: 88, bottom: 104, width: 760 }}>
            <Blk f={f} at={A4 + 30} dur={12} dy={10}>
              <Kicker>the honest trade</Kicker>
            </Blk>
            <div style={{ height: 14 }} />
            <Blk f={f} at={A4 + 50} dur={16}>
              <Title size={58}>WEAKER KILLER.</Title>
            </Blk>
            <div style={{ height: 4 }} />
            <Blk f={f} at={A4 + 78} dur={18}>
              <Title size={58}>BUT IT WALKS ALL THE WAY IN.</Title>
            </Blk>
            <div style={{ height: 8 }} />
            <Blk f={f} at={A4 + 122} dur={20}>
              <Title size={78}>
                <Em>into the film — not onto it</Em>
              </Title>
            </Blk>
              <Rule p={es(f, A4 + 152, A5 - 40, E_OUT)} w={470} />
            </div>
          </>
        )}

        {/* ACTO 5 · sí, es una lejía (arriba a la izquierda: el abanico manda el centro) */}
        {f >= A5 + 6 && f < A6 && (
          <>
            <SideBed half="top" strength={es(f, A5 + 6, A5 + 24, E_OUT) * 0.92} />
            <div style={{ position: "absolute", left: 88, top: 108, width: 700 }}>
            <Blk f={f} at={A5 + 14} dur={12} dy={10}>
              <Kicker color={MD.bone}>and yes —</Kicker>
            </Blk>
            <div style={{ height: 12 }} />
            <Blk f={f} at={A5 + 30} dur={17}>
              <Title size={56}>PEROXIDE IS TECHNICALLY A BLEACH.</Title>
            </Blk>
            <div style={{ height: 6 }} />
            <Blk f={f} at={A5 + 66} dur={19}>
              <Title size={74}>
                <Em>just no chlorine in it</Em>
              </Title>
            </Blk>
            <Blk f={f} at={A5 + 104} dur={15}>
                <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 31, color: MD.bone, marginTop: 18 }}>
                  Which is why it is the one you can use in a bowl with urine in it.
                </div>
              </Blk>
            </div>
          </>
        )}

        {/* ACTO 6 · la corrección */}
        {f >= A6 + 8 && (
          <div style={{ position: "absolute", left: 84, bottom: 74, width: 800 }}>
            <TextBed pad={26} w="100%">
              <Blk f={f} at={A6 + 12} dur={11} dy={9}>
                <Kicker>a correction — mine included</Kicker>
              </Blk>
              <div style={{ height: 12 }} />
              <Blk f={f} at={A6 + 28} dur={16}>
                <Title size={58}>DO NOT POINT A FAN AT IT.</Title>
              </Blk>
              <div style={{ height: 4 }} />
              <Blk f={f} at={A6 + 62} dur={18}>
                <Title size={72}>
                  <Em>you will seed the whole room</Em>
                </Title>
              </Blk>
              <Rule p={es(f, A6 + 92, A6 + 124, E_OUT)} w={420} />
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {/* ══ COSTURAS ══════════════════════════════════════════════════════════════════════
           A · OCLUSIÓN     (única costura que puede tapar el cambio de fondo: se va el avatar)
           B · ZOOM-THROUGH (arriba, envolviendo el grupo 20)
           C · MATCH-MOVE   (no lleva helper: la hace la cámara con el `swing`)
           D · WIPE POR MATERIA
           E · CORTE EN EL BEAT (no lleva helper: cajas idénticas + golpe de cámara)          */}
      <Occluder at={OCC_A} dur={18} color={MD.ink1} angle={7} />
      <VaporWipe at={A5 - 11} dur={22} />
      {/* hold VIVO del último acto: el barrido cruza la escena mientras la cámara aterriza */}
      <Sheen at={A6 + 88} dur={34} angle={14} />
    </AbsoluteFill>
  );
};

export default MovTruck;
