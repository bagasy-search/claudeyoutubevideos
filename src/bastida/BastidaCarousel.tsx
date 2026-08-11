/**
 * RenalCarousel — el componente HERO del canal Dr. Bastida.
 * Carrusel 3D cinematográfico para el beat "hay 5 bebidas / 5 cultivos…".
 *
 * Coreografía (pedida por el creador, jul 2026):
 *  1) ENTRADA: la 1ª tarjeta sube desde abajo, la cámara hace zoom-in suave y la sigue;
 *     luego se despliegan las otras 4 y el anillo empieza a girar lento.
 *  2) BLOQUEADAS: todas las tarjetas arrancan BORROSAS con un CANDADO (no se ven antes de tiempo),
 *     flotando en distintas CAPAS de profundidad (las de atrás más chicas/borrosas/tenues).
 *  3) REVELADO: cuando el avatar nombra "bebida número N", el anillo gira SUAVE hasta esa tarjeta,
 *     hace un zoom gradual NO constante (realismo de cámara), el CANDADO se abre con una animación
 *     y esa imagen entra en FOCO (blur→0) con un glow.
 *  4) Fondo blanco borroso moderno con bokeh aqua (escena CLARA — contrasta con las depth navy).
 *
 * SFX (el creador los genera): hay puntos de cue documentados en `sfxCues()` — whoosh de entrada,
 * tick suave en cada giro, y "clunk + shimmer" satisfactorio al abrir cada candado.
 *
 * Data-driven: cards[] + reveals[] (frame en que se revela cada tarjeta, en orden).
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba, shade} from './theme';

export type CarouselCard = {name: string; img?: string; tint?: string};
export type RenalCarouselProps = {
  cards: CarouselCard[];
  /** frame en que se revela cada tarjeta, en orden (mismo largo que cards, o menos). */
  reveals?: number[];
  /** duración de la coreografía de entrada, en frames. */
  introDur?: number;
  /** kicker chico arriba (ej "SALUD RENAL · 60+"). */
  kicker?: string;
  /** título grande (ej "5 bebidas que sus riñones necesitan"). */
  title?: string;
  /** índice de una tarjeta BLOQUEADA que PULSA con glow (teaser "una de ellas…"). -1 = ninguna. */
  teaseIndex?: number;
};

const easeIO = Easing.bezier(0.4, 0, 0.2, 1);
const easeOut = Easing.out(Easing.cubic);

/** Devuelve los frames de cue de SFX para este carrusel (para cablear el audio en el beatsheet). */
export const sfxCues = (introDur: number, reveals: number[]) => ({
  whoosh: [Math.round(introDur * 0.15)],
  fanOut: [Math.round(introDur * 0.55)],
  unlock: reveals.slice(),
});

/** Padlock SVG con shackle que se abre. u = progreso de apertura 0..1 */
const Padlock: React.FC<{u: number; size?: number}> = ({u, size = 92}) => {
  const shackleLift = interpolate(u, [0, 0.6], [0, -14], {extrapolateRight: 'clamp'});
  const shackleRot = interpolate(u, [0, 0.6], [0, -32], {extrapolateRight: 'clamp'});
  const bodyOpacity = interpolate(u, [0.5, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pop = interpolate(u, [0, 0.6, 1], [1, 1.12, 1.35]);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity: bodyOpacity, transform: `scale(${pop})`}}>
      {/* shackle */}
      <g style={{transformOrigin: '62px 40px', transform: `translateY(${shackleLift}px) rotate(${shackleRot}deg)`}}>
        <path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke={BAS.brand} strokeWidth={9} strokeLinecap="round" />
      </g>
      {/* body */}
      <rect x="24" y="44" width="52" height="42" rx="10" fill={BAS.aqua} />
      <rect x="24" y="44" width="52" height="42" rx="10" fill="none" stroke={rgba('#ffffff', 0.5)} strokeWidth={1.5} />
      <circle cx="50" cy="62" r="6" fill={BAS.onAqua} />
      <rect x="47.5" y="64" width="5" height="12" rx="2.5" fill={BAS.onAqua} />
    </svg>
  );
};

export const RenalCarousel: React.FC<RenalCarouselProps> = ({
  cards,
  reveals = [],
  introDur = 42,
  kicker = 'Salud renal · 60+',
  title = '5 bebidas que sus riñones necesitan',
  teaseIndex = -1,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const N = cards.length;
  const cx = width / 2;
  const cy = height * 0.54;
  const Rx = width * 0.29;

  // ---- entrada global ----
  const eg = interpolate(frame, [0, introDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // ---- foco actual + índice suave para la rotación del anillo ----
  let focus = -1;
  for (let i = 0; i < reveals.length; i++) if (frame >= reveals[i]) focus = i;
  const TRANS = fps * 0.7; // giro suave entre revelados
  let displayIndex = 0;
  if (focus < 0) {
    if (teaseIndex >= 0) {
      // beat teaser: llevar la tarjeta teaser AL FRENTE y dejarla ahí (pulsando)
      displayIndex = teaseIndex;
    } else {
      // navegando bloqueadas: giro lento y ocioso
      displayIndex = (frame / fps) * 0.12;
    }
  } else {
    const frac = interpolate(frame, [reveals[focus], reveals[focus] + TRANS], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeIO,
    });
    displayIndex = (focus - 1) + frac; // ej: revela 0 → va de -1 a 0
  }

  // ---- zoom de cámara NO constante (respiración + pulso por revelado) ----
  const breathe = Math.sin((frame / fps) * 0.7) * 0.018;
  let zoomPulse = 0;
  if (focus >= 0) {
    const p = interpolate(frame, [reveals[focus], reveals[focus] + fps * 0.6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    zoomPulse = Math.sin(p * Math.PI) * 0.05;
  }
  const introZoom = interpolate(eg, [0, 1], [1.12, 1], {easing: easeOut});
  const stageZoom = introZoom + breathe + zoomPulse;
  const stageDriftX = Math.sin((frame / fps) * 0.4) * 10;
  const stageFollowY = interpolate(eg, [0, 1], [60, 0], {easing: easeOut}); // la cámara "sigue" a la tarjeta que sube

  const anglePer = (Math.PI * 2) / N;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 50% 30%, #FDFEFE 0%, #EEF4F6 55%, #DFEAEE 100%)'}}>
      {/* bokeh aqua borroso (fondo moderno) */}
      {Array.from({length: 7}).map((_, i) => {
        const s = 200 + ((i * 83) % 260);
        const bx = ((i * 137) % 100);
        const by = ((i * 61) % 100);
        const drift = Math.sin((frame / fps) * 0.3 + i) * 20;
        return (
          <div
            key={`bk${i}`}
            style={{
              position: 'absolute',
              left: `${bx}%`,
              top: `${by}%`,
              width: s,
              height: s,
              borderRadius: '50%',
              background: i % 2 ? rgba(BAS.aqua, 0.1) : rgba('#ffffff', 0.7),
              filter: 'blur(60px)',
              transform: `translate(-50%,-50%) translateY(${drift}px)`,
            }}
          />
        );
      })}

      {/* kicker + título */}
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', opacity: interpolate(eg, [0.3, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: BAS.aquaDark}}>
          {kicker}
        </div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 60, fontWeight: 700, color: BAS.brand, marginTop: 6}}>
          {title}
        </div>
      </div>

      {/* STAGE 3D */}
      <AbsoluteFill
        style={{
          transform: `translate(${stageDriftX}px, ${stageFollowY}px) scale(${stageZoom})`,
          transformOrigin: '50% 54%',
          perspective: 1600,
        }}
      >
        {cards.map((card, i) => {
          const theta = (i - displayIndex) * anglePer;
          const sinT = Math.sin(theta);
          const cosT = Math.cos(theta);
          const depth = (cosT + 1) / 2; // 0 atrás, 1 frente
          const x = sinT * Rx;
          const yArc = (1 - cosT) * 26; // leve arco
          const scale = 0.6 + depth * 0.6;
          const depthBlur = (1 - depth) * 9;
          const opacity = 0.32 + depth * 0.68;
          const z = Math.round(depth * 100);
          const tiltY = -sinT * 26; // la tarjeta "mira" al centro

          // entrada por tarjeta (cap <1: con >5 tarjetas, 0.42+i*0.12 pasaba 1 y el
          // inputRange de interpolate quedaba decreciente [1.02,1] → crash. Con ≤5 no cambia.)
          const appearStart = i === 0 ? 0 : Math.min(0.42 + i * 0.12, 0.94);
          const appear = interpolate(eg, [appearStart, Math.min(appearStart + 0.3, 1)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: easeOut,
          });
          const enterY = interpolate(appear, [0, 1], [780, 0]);
          const enterScale = interpolate(appear, [0, 1], [0.82, 1]);

          // revelado / candado
          const revealAt = reveals[i];
          const hasReveal = typeof revealAt === 'number';
          const u = hasReveal
            ? interpolate(frame, [revealAt, revealAt + fps * 0.55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut})
            : 0;
          const revealed = u > 0;
          const lockBlur = interpolate(u, [0, 1], [16, 0]);
          const isFocus = i === focus;
          const focusGlow = isFocus ? interpolate(u, [0, 1], [0, 1]) : 0;
          // teaser: una tarjeta BLOQUEADA que pulsa
          const teasePulse = i === teaseIndex && !revealed ? 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2.4) : 0;

          const tint = card.tint ?? BAS.aqua;
          const imgStyle: React.CSSProperties = card.img
            ? {backgroundImage: `url(${card.img.startsWith('http') ? card.img : staticFile(card.img)})`, backgroundSize: 'cover', backgroundPosition: 'center'}
            : {background: `radial-gradient(120% 120% at 40% 25%, ${shade(tint, 0.35)}, ${shade(tint, -0.25)})`};

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: cx,
                top: cy,
                width: 360,
                height: 460,
                zIndex: z,
                opacity: opacity * appear,
                transform: `translate(-50%,-50%) translate(${x}px, ${yArc + enterY}px) scale(${scale * enterScale}) rotateY(${tiltY}deg)`,
                filter: `blur(${depthBlur}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* tarjeta glass premium */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 30,
                  overflow: 'hidden',
                  boxShadow: `0 40px 80px ${rgba('#12303b', 0.34)}, 0 8px 24px ${rgba('#12303b', 0.24)}${focusGlow ? `, 0 0 0 3px ${rgba(BAS.aqua, 0.9)}, 0 0 60px ${rgba(BAS.aqua, 0.55 * focusGlow)}` : ''}${teasePulse ? `, 0 0 0 ${2 + teasePulse * 2}px ${rgba(BAS.aqua, 0.4 + teasePulse * 0.5)}, 0 0 ${40 + teasePulse * 40}px ${rgba(BAS.aqua, 0.3 + teasePulse * 0.4)}` : ''}`,
                  border: `1px solid ${rgba('#ffffff', 0.7)}`,
                }}
              >
                {/* imagen (se desenfoca si está bloqueada) */}
                <div style={{position: 'absolute', inset: 0, ...imgStyle, filter: `blur(${lockBlur}px) saturate(${0.7 + u * 0.4})`, transform: `scale(${1.06 - u * 0.06})`}} />
                {/* velo frosted mientras está bloqueada (sin backdrop-filter: ×5 el render en el farm) */}
                <div style={{position: 'absolute', inset: 0, background: rgba('#eaf3f5', interpolate(u, [0, 1], [0.42, 0]))}} />
                {/* highlight superior de vidrio */}
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: `linear-gradient(${rgba('#ffffff', 0.5)}, transparent)`}} />
                {/* label del nombre (aparece al revelar) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '38px 24px 22px',
                    background: `linear-gradient(transparent, ${rgba('#06202f', 0.72)})`,
                    opacity: u,
                    transform: `translateY(${interpolate(u, [0, 1], [16, 0])}px)`,
                  }}
                >
                  <div style={{fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: '#ffffff'}}>{card.name}</div>
                </div>
              </div>

              {/* número de orden (chip aqua) */}
              <div
                style={{
                  position: 'absolute',
                  top: -18,
                  left: -18,
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: BAS.aqua,
                  color: BAS.onAqua,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_SANS,
                  fontSize: 28,
                  fontWeight: 800,
                  boxShadow: `0 8px 20px ${rgba(BAS.aqua, 0.5)}`,
                  opacity: appear,
                }}
              >
                {i + 1}
              </div>

              {/* candado (mientras no está revelada / abriéndose) */}
              {u < 1 && (
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
                  <Padlock u={u} />
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
