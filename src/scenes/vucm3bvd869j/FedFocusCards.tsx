/* ############################################################################
 * FED_FOCUS_CARDS — "EL ABANICO" · tarjetas numeradas flotando, una en FOCO
 *
 *   Componente OBLIGATORIO del canal para los RECAPS NUMERADOS: cuando el
 *   presentador enumera ("uno... dos... tres..."), NO se corta a una imagen
 *   suelta: quedan a la vista TODAS las tarjetas, borrosas, y la que toca en
 *   ese momento se ENFOCA. El espectador nunca pierde el mapa de la lista.
 *
 *   La MISMA escena se instancia varias veces cambiando SOLO `focus`:
 *     focus = -1  → estado de reposo: las N tarjetas en abanico, todas suaves
 *     focus = i   → la tarjeta i pierde el blur, gana borde de acento, escala,
 *                   sube, se ilumina y muestra su `sub`; el resto se hunde
 *                   (más borrosa, más chica, más apagada, un poco más atrás)
 *   Como el reposo es el mismo en todas las instancias, los cortes entre
 *   escenas leen como UN movimiento continuo del foco, no como cortes nuevos.
 *
 *   GUION VISUAL (todo en fracciones del hold = totalF - FED_WHIP_F):
 *     0.00-0.10  entra la cabecera (kicker + título)
 *     0.03-0.30  las tarjetas suben al abanico, escalonadas desde el centro
 *     0.20-0.48  spring del FOCO: blur → 0, escala, elevación, borde y halo
 *     0.34-0.60  baja el `sub` de la tarjeta enfocada
 *     0.55-0.74  aparece el footer en serif itálica
 *   + flotación continua e independiente en TODAS las tarjetas (nada quieto)
 *
 *   CAPAS
 *     L0  Stage del kit: mood dark-cinematic, motas, parallax, viñeta
 *     L1  halo de acento detrás de la tarjeta enfocada
 *     L2  abanico de tarjetas (sombra proyectada + marco + media + textos)
 *     L3  cabecera (kicker + título) y footer serif
 *     L4  grano
 *
 *   Robusto con 3, 4 o 5 items, con `focus` fuera de rango y sin imágenes
 *   (placeholder de gradiente + silueta SVG). Escala de 90f a 240f+.
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {
  CLAMP,
  DEFAULT_ACCENT,
  FED_SCENE_F,
  FED_WHIP_F,
  FONT_SANS,
  FONT_SERIF,
  GrainOverlay,
  Kicker,
  Stage,
  TransitionShell,
  Words,
  rgba,
  shade,
  type FedMood,
  type FedTransitionVariant,
} from '../../FedererKit';

/* ------------------------------------------------------------------ tipos */

export type FedFocusCard = {
  n: number;
  label: string;
  sub?: string;
  image?: string; // ruta YA resuelta (staticFile) por quien instancia la escena
};

export type FedFocusCardsProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  kicker?: string;
  title?: string;
  hot?: string[];
  items?: FedFocusCard[];
  focus?: number;
  footer?: string;
};

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;
const CX = STAGE_W / 2;

const HEAD_X = 118;
const FAN_CY = 616; // centro vertical del abanico

const INK = '#f4f7ff';

const EASE_SOFT = Easing.out(Easing.cubic);

/** medidas del abanico según cuántas tarjetas hay (3 a 5) */
const fanSpec = (n: number) => {
  if (n <= 3) return {w: 400, gap: 432, rot: 4.4};
  if (n === 4) return {w: 352, gap: 374, rot: 3.6};
  return {w: 312, gap: 322, rot: 3.0};
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

/* --------------------------------------------------------- placeholder SVG */

/** silueta de busto: se usa cuando la tarjeta no trae `image` */
const Silhouette: React.FC<{tint: string}> = ({tint}) => (
  <svg
    viewBox="0 0 120 150"
    preserveAspectRatio="xMidYMax meet"
    style={{position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block'}}
  >
    <g fill={tint}>
      <circle cx="60" cy="58" r="25" />
      <path d="M60 90c-24 0-42 15-45 37l-3 23h96l-3-23c-3-22-21-37-45-37z" />
    </g>
  </svg>
);

/* ================================ COMPONENTE ============================== */

const DEFAULT_ITEMS: FedFocusCard[] = [
  {n: 1, label: 'Aceite de girasol', sub: 'Sella la barrera en veinte minutos'},
  {n: 2, label: 'Avena coloidal', sub: 'Calma la picazón sin cortisona'},
  {n: 3, label: 'Vaselina simple', sub: 'La capa que no deja escapar el agua'},
  {n: 4, label: 'Agua tibia', sub: 'Nunca caliente: el error de todos los días'},
];

export const FedFocusCards: React.FC<FedFocusCardsProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  kicker = 'Repaso',
  title = 'Las cuatro cosas que sí funcionan',
  hot = ['cuatro'],
  items,
  focus = -1,
  footer = 'Ninguna cuesta más de lo que ya tiene en casa',
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  /* ---- tiempo: TODO como fracción del hold ------------------------------ */
  const T = Math.max(40, totalF);
  const HOLD = Math.max(24, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});

  /* ---- datos: 3 a 5 tarjetas, siempre algo que dibujar ------------------ */
  const cards = React.useMemo(() => {
    const src = items && items.length > 0 ? items : DEFAULT_ITEMS;
    return src.slice(0, 5).map((it, i) => ({
      n: typeof it.n === 'number' ? it.n : i + 1,
      label: it.label ?? '',
      sub: it.sub,
      image: it.image,
    }));
  }, [items]);

  const N = cards.length;
  const {w: CARD_W, gap: GAP, rot: ROT} = fanSpec(N);
  const CARD_H = Math.round(CARD_W * 1.24);

  /** índice enfocado, saneado: cualquier cosa fuera de rango = reposo */
  const fi =
    typeof focus === 'number' && Number.isFinite(focus) && Math.round(focus) >= 0 &&
    Math.round(focus) < N
      ? Math.round(focus)
      : -1;

  /* ---- springs globales -------------------------------------------------- */
  const focusP = clamp01(
    spring({
      frame: frame - at(0.2),
      fps,
      config: {damping: 15, stiffness: 120, mass: 0.9},
      durationInFrames: Math.max(12, Math.round(HOLD * 0.3)),
    })
  );
  const focusOn = fi >= 0 ? focusP : 0;

  const subP = ip(0.34, 0.6);
  const footP = ip(0.55, 0.74);

  /* ---- semillas por tarjeta (flotación independiente) ------------------- */
  const seeds = React.useMemo(
    () =>
      cards.map((c, i) => ({
        phase: random(`fedfocus-ph-${c.n}-${i}`) * Math.PI * 2,
        speed: 0.028 + random(`fedfocus-sp-${c.n}-${i}`) * 0.016,
        drift: 0.7 + random(`fedfocus-dr-${c.n}-${i}`) * 0.6,
      })),
    [cards]
  );

  const S = width / STAGE_W;

  /* ---- estado por tarjeta ------------------------------------------------ */
  const states = cards.map((card, i) => {
    const c = i - (N - 1) / 2; // -1.5 .. +1.5
    const half = Math.max(1, (N - 1) / 2);
    const depth = Math.abs(c) / half; // 0 centro, 1 costados
    const isFocus = i === fi;
    const sd = seeds[i];

    /* entrada escalonada desde el centro hacia los costados */
    const born = at(0.03 + 0.05 * Math.abs(c));
    const enter = clamp01(
      spring({
        frame: frame - born,
        fps,
        config: {damping: 14, stiffness: 150, mass: 0.75},
        durationInFrames: Math.max(10, Math.round(HOLD * 0.24)),
      })
    );

    /* reposo del abanico: los costados más chicos, más abajo y más apagados */
    const restScale = 1 - 0.085 * depth;
    const restY = 26 * depth;
    const restOpacity = 0.94 - 0.16 * depth;
    const restRot = c * ROT;
    const REST_BLUR = 5.4;

    /* destino según el foco de ESTA instancia */
    const tScale = isFocus ? 1.13 : restScale * 0.94;
    const tY = isFocus ? -40 : restY + 18;
    const tOpacity = isFocus ? 1 : restOpacity * 0.58;
    const tRot = isFocus ? restRot * 0.25 : restRot * 1.16;
    const tBlur = isFocus ? 0 : 8.6;

    const k = focusOn;
    const pf = isFocus ? focusOn : 0; // 0..1 sólo en la enfocada

    const flt = Math.sin(frame * sd.speed + sd.phase) * sd.drift;
    const floatY = flt * 5.4 * (1 - 0.35 * pf);
    const floatRot = Math.cos(frame * sd.speed * 0.78 + sd.phase) * 0.42 * sd.drift;

    return {
      card,
      i,
      depth,
      isFocus,
      pf,
      x: CX + c * GAP,
      y:
        FAN_CY +
        mix(restY, tY, k) +
        floatY +
        (1 - enter) * 74,
      scale: mix(restScale, tScale, k) * mix(0.87, 1, enter),
      rot: mix(restRot, tRot, k) + floatRot * (1 - 0.4 * pf),
      blur: mix(REST_BLUR, tBlur, k),
      opacity: mix(restOpacity, tOpacity, k) * enter,
      z: isFocus ? 40 : Math.round(12 - depth * 5),
      enter,
    };
  });

  const focusState = fi >= 0 ? states[fi] : null;

  /* ------------------------------ una tarjeta ---------------------------- */
  const renderCard = (s: (typeof states)[number]) => {
    const {card, pf, isFocus} = s;
    if (s.enter <= 0.004) return null;

    const kb = 1.16 + 0.03 * Math.sin(frame * 0.021 + s.i);
    const ring = 1 + 1.5 * pf;
    const numColor = isFocus ? accent : rgba(INK, 0.62);
    const labelLong = card.label.length > 17;

    return (
      <div
        key={`card-${s.i}`}
        style={{
          position: 'absolute',
          left: s.x - CARD_W / 2,
          top: s.y - CARD_H / 2,
          width: CARD_W,
          zIndex: s.z,
          opacity: s.opacity,
          transform: `scale(${s.scale.toFixed(4)}) rotate(${s.rot.toFixed(2)}deg)`,
          transformOrigin: '50% 62%',
          willChange: 'transform, opacity',
        }}
      >
        {/* sombra proyectada: despega del fondo, más marcada en la enfocada */}
        <div
          style={{
            position: 'absolute',
            left: CARD_W * 0.1,
            top: CARD_H - 16,
            width: CARD_W * 0.8,
            height: 46,
            borderRadius: '50%',
            background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,${(
              0.5 +
              0.22 * pf
            ).toFixed(3)}) 0%, transparent 72%)`,
            filter: 'blur(14px)',
          }}
        />

        {/* marco fino con la media adentro */}
        <div
          style={{
            position: 'relative',
            width: CARD_W,
            height: CARD_H,
            borderRadius: 22,
            overflow: 'hidden',
            border: `1px solid ${rgba(INK, 0.1 + 0.06 * pf)}`,
            background: '#06090f',
            boxShadow: [
              `0 0 0 ${ring.toFixed(2)}px ${rgba(accent, 0.1 + 0.62 * pf)}`,
              `0 26px 56px rgba(0,0,0,${(0.46 + 0.2 * pf).toFixed(3)})`,
              `0 0 ${(70 * pf).toFixed(0)}px ${rgba(accent, 0.34 * pf)}`,
            ].join(', '),
          }}
        >
          {/* --- media: ES LA ÚNICA CAPA QUE SE DESENFOCA --- */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              filter: `blur(${s.blur.toFixed(2)}px) brightness(${(0.66 + 0.42 * pf).toFixed(
                3
              )}) saturate(${(0.74 + 0.4 * pf).toFixed(3)})`,
              transform: `scale(${kb.toFixed(4)})`,
              willChange: 'filter, transform',
            }}
          >
            {card.image ? (
              <Img
                src={card.image}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: [
                    `radial-gradient(80% 60% at 50% 22%, ${rgba(accent, 0.26)} 0%, transparent 64%)`,
                    `linear-gradient(168deg, ${shade(accent, 0.34)} 0%, #0b1018 52%, #05070c 100%)`,
                  ].join(', '),
                }}
              >
                <div style={{position: 'absolute', inset: '18% 16% 0 16%'}}>
                  <Silhouette tint={rgba(INK, 0.13)} />
                </div>
              </div>
            )}
          </div>

          {/* scrims: arriba para el número, abajo para la pastilla */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'linear-gradient(160deg, rgba(3,6,12,0.82) 0%, transparent 42%)',
                'linear-gradient(to top, rgba(3,6,12,0.92) 0%, rgba(3,6,12,0.35) 26%, transparent 52%)',
              ].join(', '),
              pointerEvents: 'none',
            }}
          />

          {/* barrido de luz sobre la que entra en foco */}
          {isFocus ? (
            <div
              style={{
                position: 'absolute',
                top: '-25%',
                bottom: '-25%',
                left: 0,
                width: '52%',
                transform: `translateX(${interpolate(pf, [0, 1], [-90, 220], CLAMP).toFixed(
                  0
                )}%) skewX(-16deg)`,
                background: `linear-gradient(100deg, transparent 18%, ${rgba(
                  accent,
                  0.26
                )} 50%, transparent 82%)`,
                mixBlendMode: 'screen',
                opacity: Math.sin(pf * Math.PI),
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* NÚMERO grande arriba a la izquierda, tabular (nunca borroso) */}
          <div
            style={{
              position: 'absolute',
              left: Math.round(CARD_W * 0.055),
              top: Math.round(CARD_W * 0.018),
              fontFamily: FONT_SANS,
              fontWeight: 800,
              fontSize: Math.round(CARD_W * 0.3),
              lineHeight: 1,
              letterSpacing: '-0.05em',
              fontVariantNumeric: 'tabular-nums',
              color: numColor,
              textShadow: isFocus
                ? `0 4px 26px ${rgba(accent, 0.5 * pf)}, 0 2px 10px rgba(0,0,0,0.6)`
                : '0 2px 10px rgba(0,0,0,0.6)',
            }}
          >
            {card.n}
          </div>
          {/* subrayado del número: sólo se dibuja en la enfocada */}
          <div
            style={{
              position: 'absolute',
              left: Math.round(CARD_W * 0.06),
              top: Math.round(CARD_W * 0.018 + CARD_W * 0.3 + 8),
              width: Math.round(CARD_W * 0.22) * pf,
              height: 3,
              borderRadius: 2,
              background: accent,
              boxShadow: `0 0 12px ${rgba(accent, 0.6 * pf)}`,
              opacity: pf,
            }}
          />

          {/* pastilla con el label corto, abajo */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              right: 12,
              bottom: 14,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                maxWidth: '100%',
                padding: '7px 14px',
                borderRadius: 999,
                textAlign: 'center',
                background: isFocus ? rgba(accent, 0.14 * pf + 0.06) : 'rgba(6,10,18,0.6)',
                border: `1px solid ${
                  isFocus ? rgba(accent, 0.24 + 0.4 * pf) : rgba(INK, 0.12)
                }`,
                backdropFilter: 'blur(4px)',
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: Math.round(CARD_W * (labelLong ? 0.058 : 0.07)),
                lineHeight: 1.14,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                color: isFocus ? mixInk(accent, pf) : rgba(INK, 0.72),
              }}
            >
              {card.label}
            </span>
          </div>
        </div>

      </div>
    );
  };

  /* el `sub` va FUERA de la tarjeta (capa del escenario): así no lo escala el
     spring del foco y se puede acotar para que nunca se salga del cuadro */
  const SUB_W = 820;
  const subLeft = focusState
    ? Math.max(72, Math.min(STAGE_W - 72 - SUB_W, focusState.x - SUB_W / 2))
    : 0;
  const subTop = FAN_CY - 40 + CARD_H * 0.566 + 26;

  /* ============================== RENDER ================================= */

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      {/* seed SIN el foco: todas las instancias comparten cámara y abanico,
          así el corte entre escenas lee como un solo movimiento del foco */}
      <Stage mood={mood} accent={accent} seed={`fedfocus-${N}`} pushTo={1.032}>
        {(cam) => (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              transform: `translate(${(cam.px * 0.6).toFixed(2)}px, ${(cam.py * 0.6).toFixed(
                2
              )}px)`,
            }}
          >
            {/* escenario 1920x1080 escalado al ancho real */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: STAGE_W,
                height: STAGE_H,
                marginLeft: -STAGE_W / 2,
                marginTop: -STAGE_H / 2,
                transform: `scale(${S.toFixed(5)})`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* ---- L1 · halo detrás de la enfocada ---- */}
              {focusState ? (
                <div
                  style={{
                    position: 'absolute',
                    left: focusState.x - CARD_W * 1.15,
                    top: FAN_CY - CARD_H * 0.92,
                    width: CARD_W * 2.3,
                    height: CARD_H * 1.84,
                    background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                      accent,
                      0.2 * focusOn
                    )} 0%, transparent 68%)`,
                    filter: 'blur(28px)',
                    opacity: focusOn,
                    pointerEvents: 'none',
                  }}
                />
              ) : null}

              {/* ---- L2 · abanico ---- */}
              {states.map((s) => renderCard(s))}

              {/* ---- L2 · `sub` de la tarjeta enfocada ---- */}
              {focusState && focusState.card.sub ? (
                <div
                  style={{
                    position: 'absolute',
                    left: subLeft,
                    top: subTop,
                    width: SUB_W,
                    zIndex: 41,
                    textAlign: 'center',
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: 26,
                    lineHeight: 1.24,
                    letterSpacing: 0.6,
                    color: rgba(INK, 0.84),
                    opacity: subP * focusOn,
                    transform: `translateY(${((1 - subP) * 14).toFixed(1)}px)`,
                    textShadow: '0 2px 12px rgba(0,0,0,0.75)',
                  }}
                >
                  {focusState.card.sub}
                </div>
              ) : null}

              {/* ---- L3 · cabecera ---- */}
              <div style={{position: 'absolute', left: HEAD_X, top: 76}}>
                <Kicker text={kicker} accent={accent} startSec={at(0.015) / fps} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: HEAD_X,
                  top: 118,
                  width: 1280,
                  color: INK,
                }}
              >
                <Words
                  text={title}
                  hot={hot}
                  accent={accent}
                  startSec={at(0.05) / fps}
                  size={52}
                  weight={800}
                  uppercase
                  /* en escenas cortas el título tiene que terminar de entrar
                     mucho antes del whip de salida */
                  maxStagger={Math.min(0.26, (HOLD / fps) * 0.07)}
                />
              </div>

              {/* ---- L3 · footer serif itálica ---- */}
              {footer ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 986,
                    textAlign: 'center',
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontSize: 29,
                    lineHeight: 1.2,
                    color: rgba(INK, 0.56),
                    opacity: footP,
                    transform: `translateY(${((1 - footP) * 12).toFixed(1)}px)`,
                  }}
                >
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Stage>

      {/* ---- L4 · grano ---- */}
      <AbsoluteFill style={{opacity: 0.5, pointerEvents: 'none', zIndex: 9}}>
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

/* el label enfocado va casi blanco con un lavado del acento */
function mixInk(accent: string, p: number): string {
  return p > 0.5 ? rgba(accent, 0.98) : rgba(INK, 0.92);
}

export default FedFocusCards;
