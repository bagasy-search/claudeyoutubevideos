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
  FONT_SANS,
  FONT_SERIF,
  DEFAULT_ACCENT,
  TEAL,
  COOL_BLUE,
  rgba,
  shade,
  makeMotes,
  MotesLayer,
  GrainOverlay,
  TransitionShell,
  moodBg,
  FED_SCENE_F,
  FED_WHIP_F,
  type FedMood,

  type FedTransitionVariant,
} from '../../FedererKit';

/* ############################################################################
 * FED_BLACKLIST — "LA LISTA NEGRA": una ficha de expediente que se SELLA.
 *
 * Multicapa, estilo After Effects. Todo el timing se deriva de `totalF`, así
 * que la escena lee igual a 3s (90f) que a 7s (210f): el sello cae SIEMPRE a
 * ~60% de la escena.
 *
 *   L0 · fondo por mood + wash de acento + viñeta
 *   L1 · bokeh grande de fondo (fuera de foco)
 *   L2 · polvo ambiental (dos densidades)
 *   L3 · sombra proyectada larga de la ficha (blur + skew)
 *   L4 · la ficha: papel procedural (fibras, bordes gastados, pliegue, manchas)
 *   L5 · contenido (nº de expediente, barra del nombre, razón, evidencia, foto)
 *   L6 · el tachado por stroke-dashoffset
 *   L7 · el sello (entra rotado, overshoot, tinta irregular por máscara de ruido)
 *   L8 · polvo/esquirlas del impacto + onda de choque
 *   L9 · flash corto del golpe
 *   L10 · GrainOverlay
 * ########################################################################## */

export type FedBlacklistProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string; // '#E9B44C'
  mood?: FedMood; // 'warmdark'
  index?: string; // '01 / 03'
  name?: string; // 'Aceite de oliva'
  reason?: string;
  evidence?: string;
  stamp?: string; // 'NO SE PONE'
  image?: string; // ruta ya resuelta con staticFile por quien la usa
};

/* rojo apagado, cinematográfico — tinta de sello vieja, nunca rojo puro */
const INK_RED = '#8E3328';
const INK_RED_DEEP = '#4E1A12';

/* geometría de la ficha (coordenadas locales de la tarjeta) */
const CARD_W = 1240;
const CARD_H = 906;
const PAD = 58;
const IMG_BOX = 384;

/* el sello cae sobre la banda baja: pisa el pie de la ficha, no la evidencia */
const STAMP_CX = CARD_W / 2 + 6;
const STAMP_CY = 758;
const STAMP_W = 638;
const STAMP_H = 194;

/* ---------------------------------------------------------------- helpers */

/** oscilación amortiguada: overshoot "físico" sin librerías, determinista */
const damped = (t: number, freq: number, decay: number): number =>
  t <= 0 ? 0 : Math.exp(-t / decay) * Math.cos(t * freq);

/** silueta procedural: frasco gotero — NUNCA un asset del kit */
const BottleSilhouette: React.FC<{accent: string; p: number}> = ({accent, p}) => (
  <svg
    viewBox="0 0 200 200"
    style={{
      position: 'absolute',
      inset: '14%',
      width: '72%',
      height: '72%',
      opacity: 0.34 + 0.24 * p,
    }}
  >
    <defs>
      <linearGradient id="fbl-sil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={rgba(accent, 0.75)} />
        <stop offset="100%" stopColor={rgba(COOL_BLUE, 0.28)} />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#fbl-sil)" strokeWidth={3.2} strokeLinejoin="round">
      {/* gotero */}
      <path d="M92 16 h16 v20 h-16 z" />
      <path d="M86 36 h28 v16 a10 10 0 0 1 -10 10 h-8 a10 10 0 0 1 -10 -10 z" />
      {/* cuerpo del frasco */}
      <path d="M78 62 h44 c10 0 18 9 18 20 v78 c0 12 -9 22 -21 22 h-38 c-12 0 -21 -10 -21 -22 v-78 c0 -11 8 -20 18 -20 z" />
      {/* etiqueta */}
      <path d="M64 104 h72 v42 h-72 z" strokeWidth={2.2} />
      <path d="M76 118 h48 M76 132 h34" strokeWidth={2} opacity={0.7} />
    </g>
    {/* gota que cae */}
    <path
      d="M100 172 c0 0 -9 12 -9 18 a9 9 0 0 0 18 0 c0 -6 -9 -18 -9 -18 z"
      fill={rgba(accent, 0.32)}
      transform={`translate(0 ${(p * 10).toFixed(1)})`}
    />
  </svg>
);

/* ================================================================ COMPONENT */

export const FedBlacklist: React.FC<FedBlacklistProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  index = '01 / 03',
  name = 'Aceite de oliva',
  reason =
    'Aumenta la pérdida de agua de la piel — incluso en piel sana. Deja la barrera más floja que antes de ponértelo.',
  evidence = 'Ensayos con aceite de oliva puro: peor función de barrera y más enrojecimiento que el control.',
  stamp = 'NO SE PONE',
  image,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const F = Math.max(60, totalF);

  /* ---------------------------------------------------- reloj de la escena */
  const inF = Math.max(FED_WHIP_F, Math.round(F * 0.2)); // armado de la ficha
  const stampF = Math.round(F * 0.6); // EL MOMENTO: ~60%
  const dropF = Math.max(5, Math.round(F * 0.1)); // caída del sello
  const imp = frame - stampF; // >0 = después del golpe

  /* ficha: entra desde abajo con un poco de 3D */
  const card = interpolate(frame, [0, inF], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const cardSpr = spring({frame, fps, config: {damping: 17, mass: 0.9, stiffness: 90}});

  /* contenido escalonado, todo relativo a F */
  const rv = (a: number, b: number) =>
    interpolate(frame, [F * a, F * b], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const rIndex = rv(0.04, 0.16);
  const rName = rv(0.08, 0.24);
  const rImg = rv(0.12, 0.3);
  const rReason = rv(0.18, 0.4);
  const rEvid = rv(0.26, 0.5);

  /* sello: descenso → impacto → asentamiento con overshoot */
  const drop = interpolate(frame, [stampF - dropF, stampF], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const settle = damped(imp, 0.72, 4.6);
  const stampOn = frame >= stampF - dropF;
  const stampScale = drop < 1 ? interpolate(drop, [0, 1], [2.55, 1.1], CLAMP) : 1 + 0.11 * settle;
  const stampRot = drop < 1 ? interpolate(drop, [0, 1], [-25, -12], CLAMP) : -12 + 3.4 * settle;
  const stampBlur = drop < 1 ? interpolate(drop, [0, 1], [11, 0], CLAMP) : 0;
  const stampOp = interpolate(drop, [0, 0.45, 1], [0, 0.5, 1], CLAMP);

  /* la ficha acusa el golpe: sacudida + micro-hundida */
  const hit = imp >= 0 ? Math.exp(-imp / 5.2) : 0;
  const shakeX = damped(imp, 1.55, 5.2) * 9;
  const shakeY = damped(imp - 0.6, 1.35, 4.4) * 12;

  /* flash corto */
  const flash = imp >= 0 ? Math.exp(-imp / 2.1) * 0.62 : 0;

  /* tachado sincronizado con el sello */
  const strikeLen = 1080;
  const strike = interpolate(frame, [stampF - 2, stampF + Math.max(6, F * 0.06)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  /* ------------------------------------------------------------ partículas */
  const bokeh = React.useMemo(() => makeMotes(5, 'fbl-bok', 150, 300, 0.008, 0.02, 0.04, 0.1), []);
  const dustFar = React.useMemo(() => makeMotes(20, 'fbl-far', 2, 7, 0.04, 0.1, 0.1, 0.28), []);
  const dustNear = React.useMemo(() => makeMotes(9, 'fbl-near', 5, 13, 0.02, 0.05, 0.06, 0.16), []);

  /* esquirlas del impacto: salen del centro del sello */
  const shards = React.useMemo(
    () =>
      new Array(30).fill(0).map((_, i) => {
        const a = random(`fbl-sh-a-${i}`) * Math.PI * 2;
        return {
          a,
          dist: 90 + random(`fbl-sh-d-${i}`) * 320,
          size: 2 + random(`fbl-sh-s-${i}`) * 7,
          life: 0.55 + random(`fbl-sh-l-${i}`) * 0.6,
          drift: (random(`fbl-sh-w-${i}`) - 0.5) * 1.4,
          warm: random(`fbl-sh-c-${i}`),
        };
      }),
    []
  );

  /* manchas de papel (envejecido) — deterministas */
  const stains = React.useMemo(
    () =>
      new Array(7).fill(0).map((_, i) => ({
        x: 6 + random(`fbl-st-x-${i}`) * 88,
        y: 6 + random(`fbl-st-y-${i}`) * 88,
        r: 60 + random(`fbl-st-r-${i}`) * 190,
        o: 0.03 + random(`fbl-st-o-${i}`) * 0.06,
      })),
    []
  );

  /* --------------------------------------------------- cámara: nunca quieta */
  const push = interpolate(frame, [0, F], [1.012, 1.062], CLAMP) - hit * 0.012;
  const hx = Math.sin(frame * 0.021) * width * 0.0022 + Math.sin(frame * 0.073) * 1.6;
  const hy = Math.cos(frame * 0.0175) * height * 0.0019 + Math.cos(frame * 0.061) * 1.3;
  const hr = Math.sin(frame * 0.0135) * 0.32;

  /* 3D de la ficha */
  const rotY = interpolate(frame, [0, F], [-7.2, -1.6], CLAMP) + Math.sin(frame * 0.018) * 0.7;
  const rotX = (1 - cardSpr) * 12 + Math.cos(frame * 0.023) * 0.55 - hit * 1.4;
  const cardY = (1 - cardSpr) * 190 + shakeY;

  const paperTop = shade('#E8DFCC', 0.94);
  const stampFs = Math.min(84, (STAMP_W - 96) / Math.max(6, stamp.length) * 1.62);

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: '#04030a', overflow: 'hidden'}}>
        {/* ============================ L0 · fondo por mood + wash + viñeta */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(58% 52% at 50% 46%, ${rgba(accent, 0.16)} 0%, transparent 66%)`,
              `radial-gradient(46% 40% at 78% 82%, ${rgba(INK_RED, 0.1 + 0.16 * hit)} 0%, transparent 70%)`,
              `radial-gradient(40% 44% at 12% 16%, ${rgba(COOL_BLUE, 0.07)} 0%, transparent 68%)`,
            ].join(', '),
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(122% 104% at 50% 48%, transparent 38%, rgba(2,2,4,0.9) 100%)',
          }}
        />

        {/* ================================= L1 · bokeh grande fuera de foco */}
        <AbsoluteFill style={{filter: 'blur(26px)', opacity: 0.72}}>
          <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="238, 200, 138" />
        </AbsoluteFill>

        {/* ============================================ L2 · polvo ambiental */}
        <MotesLayer motes={dustFar} blur={1.1} scale={height / 1080} tint="236, 214, 172" />

        {/* ==================== escena 3D: sombra + ficha + sello (una cámara) */}
        <AbsoluteFill
          style={{
            perspective: 2100,
            perspectiveOrigin: '50% 46%',
            transform: `translate(${(hx + shakeX * 0.25).toFixed(2)}px, ${hy.toFixed(
              2
            )}px) rotate(${hr.toFixed(3)}deg) scale(${push.toFixed(4)})`,
            willChange: 'transform',
          }}
        >
          {/* ------------------------ L3 · sombra proyectada larga de la ficha */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: CARD_W,
              height: CARD_H,
              marginLeft: -CARD_W / 2,
              marginTop: -CARD_H / 2,
              transform: `translateY(${(cardY * 0.6 + 64).toFixed(1)}px) translateX(46px) skewX(-11deg) scaleY(0.96) scale(${(
                0.97 +
                0.03 * card
              ).toFixed(4)})`,
              background: 'rgba(0,0,0,0.82)',
              borderRadius: 10,
              filter: `blur(${(52 - 16 * card + hit * 12).toFixed(1)}px)`,
              opacity: 0.62 * card,
            }}
          />

          {/* ================================= L4+L5+L6+L7 · la ficha en 3D */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: CARD_W,
              height: CARD_H,
              marginLeft: -CARD_W / 2,
              marginTop: -CARD_H / 2,
              transformStyle: 'preserve-3d',
              transform: [
                `translateY(${cardY.toFixed(1)}px)`,
                `translateX(${(shakeX * 0.55).toFixed(1)}px)`,
                `rotateY(${rotY.toFixed(2)}deg)`,
                `rotateX(${rotX.toFixed(2)}deg)`,
                `scale(${(0.94 + 0.06 * cardSpr - hit * 0.008).toFixed(4)})`,
              ].join(' '),
              opacity: card,
              filter: `blur(${((1 - card) * 9).toFixed(2)}px)`,
              willChange: 'transform, filter, opacity',
            }}
          >
            {/* ---------------------------------- L4 · papel de expediente */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                overflow: 'hidden',
                background: `linear-gradient(158deg, ${paperTop} 0%, #CFC2A8 44%, #B3A488 100%)`,
                boxShadow: [
                  '0 46px 110px rgba(0,0,0,0.8)',
                  '0 8px 26px rgba(0,0,0,0.52)',
                  `inset 0 0 0 1px ${rgba(accent, 0.34)}`,
                  'inset 0 0 130px rgba(66,46,22,0.5)',
                ].join(', '),
                // bordes gastados: la máscara come el contorno con ruido
                maskImage: 'url(#fbl-edge-mask)',
                WebkitMaskImage: 'url(#fbl-edge-mask)',
              }}
            >
              {/* fibras finas del papel */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.42,
                  mixBlendMode: 'multiply',
                }}
              >
                <filter id="fbl-fiber">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.02 1.1"
                    numOctaves={3}
                    seed={11}
                    stitchTiles="stitch"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.26  0.34 0 0 0 0"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#fbl-fiber)" />
              </svg>
              {/* grano grueso del papel */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.22,
                  mixBlendMode: 'multiply',
                }}
              >
                <filter id="fbl-tooth">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.6"
                    numOctaves={2}
                    seed={4}
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#fbl-tooth)" />
              </svg>

              {/* manchas de envejecido */}
              {stains.map((s, i) => (
                <div
                  key={`stain-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.r,
                    height: s.r * 0.82,
                    marginLeft: -s.r / 2,
                    marginTop: -s.r * 0.41,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(112,84,44,${s.o}) 0%, transparent 70%)`,
                  }}
                />
              ))}

              {/* pliegue apenas visible (vertical, algo a la derecha del centro) */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  bottom: -20,
                  left: '57%',
                  width: 46,
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(90,70,40,0.16) 40%, rgba(255,250,238,0.4) 52%, rgba(90,70,40,0.13) 64%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* pliegue horizontal aún más tenue */}
              <div
                style={{
                  position: 'absolute',
                  left: -20,
                  right: -20,
                  top: '38%',
                  height: 34,
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(84,64,36,0.1) 44%, rgba(255,250,238,0.26) 54%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* luz de estudio sobre el papel + caída a sombra */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: [
                    `linear-gradient(148deg, ${rgba('#FFF6E2', 0.34)} 0%, transparent 38%)`,
                    'linear-gradient(to bottom, transparent 40%, rgba(38,25,10,0.46) 100%)',
                    'radial-gradient(96% 88% at 46% 40%, transparent 46%, rgba(30,20,8,0.34) 100%)',
                    `linear-gradient(255deg, ${rgba(COOL_BLUE, 0.12)} 0%, transparent 34%)`,
                  ].join(', '),
                  pointerEvents: 'none',
                }}
              />
              {/* barrido de luz dorada que cruza al armarse la ficha */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30%',
                  bottom: '-30%',
                  left: 0,
                  width: '44%',
                  transform: `translateX(${interpolate(card, [0, 1], [-70, 200], CLAMP).toFixed(
                    0
                  )}%) skewX(-15deg)`,
                  background: `linear-gradient(100deg, transparent 18%, ${rgba(
                    '#FFF3D6',
                    0.5
                  )} 50%, transparent 82%)`,
                  mixBlendMode: 'screen',
                  opacity: Math.sin(card * Math.PI) * 0.85,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ================================ L5 · contenido del expediente */}
            <div style={{position: 'absolute', inset: PAD}}>
              {/* cabecera: nº de expediente + rótulo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  opacity: rIndex,
                  transform: `translateY(${((1 - rIndex) * -16).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: 9,
                    color: shade(accent, 0.62),
                  }}
                >
                  {index}
                </div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: 7,
                    color: 'rgba(58,44,26,0.56)',
                  }}
                >
                  LISTA NEGRA · EXPEDIENTE
                </div>
              </div>
              {/* filete bajo la cabecera, se dibuja de izq a der */}
              <div
                style={{
                  height: 2,
                  marginTop: 16,
                  background: `linear-gradient(90deg, ${rgba(accent, 0.85)} 0%, rgba(80,60,34,0.42) 70%, transparent 100%)`,
                  transform: `scaleX(${rIndex.toFixed(3)})`,
                  transformOrigin: 'left center',
                }}
              />

              {/* barra del nombre */}
              <div
                style={{
                  position: 'relative',
                  marginTop: 26,
                  height: 112,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 30,
                  background:
                    'linear-gradient(90deg, rgba(24,17,9,0.94) 0%, rgba(28,20,11,0.86) 62%, rgba(30,22,12,0.2) 100%)',
                  borderLeft: `7px solid ${accent}`,
                  boxShadow: '0 16px 34px rgba(52,36,16,0.42)',
                  clipPath: `inset(0 ${((1 - rName) * 100).toFixed(1)}% 0 0)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 70,
                    fontWeight: 800,
                    letterSpacing: -1.4,
                    lineHeight: 1,
                    color: '#F6EFE0',
                    textShadow: `0 3px 18px rgba(0,0,0,0.6), 0 0 ${(26 * hit).toFixed(0)}px ${rgba(
                      INK_RED,
                      0.7 * hit
                    )}`,
                    transform: `translateY(${((1 - rName) * 10).toFixed(1)}px)`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {name}
                </div>

                {/* ------------------------ L6 · el tachado (stroke-dashoffset) */}
                <svg
                  viewBox={`0 0 ${strikeLen} 120`}
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    left: -18,
                    top: 0,
                    width: (CARD_W - 2 * PAD) * 0.74 + 36,
                    height: 112,
                    overflow: 'visible',
                    pointerEvents: 'none',
                  }}
                >
                  <path
                    d={`M 14 74 C ${strikeLen * 0.3} 50, ${strikeLen * 0.62} 84, ${
                      strikeLen - 18
                    } 54`}
                    fill="none"
                    stroke={rgba(INK_RED_DEEP, 0.55)}
                    strokeWidth={13}
                    strokeLinecap="round"
                    strokeDasharray={strikeLen * 1.25}
                    strokeDashoffset={strikeLen * 1.25 * (1 - strike)}
                    style={{filter: 'blur(5px)'}}
                  />
                  <path
                    d={`M 14 74 C ${strikeLen * 0.3} 50, ${strikeLen * 0.62} 84, ${
                      strikeLen - 18
                    } 54`}
                    fill="none"
                    stroke={INK_RED}
                    strokeWidth={7.5}
                    strokeLinecap="round"
                    strokeDasharray={strikeLen * 1.25}
                    strokeDashoffset={strikeLen * 1.25 * (1 - strike)}
                    opacity={0.94}
                  />
                  {/* segunda pasada, más corta: mano que insiste sobre el tachado */}
                  <path
                    d={`M ${strikeLen * 0.08} 62 C ${strikeLen * 0.34} 82, ${
                      strikeLen * 0.58
                    } 52, ${strikeLen * 0.86} 70`}
                    fill="none"
                    stroke={rgba(INK_RED, 0.62)}
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    strokeDasharray={strikeLen}
                    strokeDashoffset={
                      strikeLen *
                      (1 -
                        interpolate(strike, [0.3, 1], [0, 1], {
                          ...CLAMP,
                          easing: Easing.out(Easing.cubic),
                        }))
                    }
                  />
                </svg>
              </div>

              {/* cuerpo: recuadro de imagen + razón/evidencia */}
              <div style={{display: 'flex', gap: 46, marginTop: 40}}>
                {/* recuadro de la foto, con marco fino y sombra propia */}
                <div
                  style={{
                    position: 'relative',
                    width: IMG_BOX,
                    height: IMG_BOX,
                    flex: '0 0 auto',
                    transform: `translateY(${((1 - rImg) * 26).toFixed(1)}px) rotate(${(
                      (1 - rImg) * -2.4 -
                      1.1
                    ).toFixed(2)}deg)`,
                    opacity: rImg,
                  }}
                >
                  {/* sombra propia del recuadro */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 6,
                      transform: 'translate(12px, 16px)',
                      background: 'rgba(58,40,18,0.55)',
                      filter: 'blur(16px)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#14100A',
                      border: `1px solid ${rgba(accent, 0.5)}`,
                      boxShadow: `inset 0 0 0 8px #F1E8D4, inset 0 0 0 9px ${rgba(
                        '#4A371C',
                        0.5
                      )}, 0 10px 26px rgba(40,26,10,0.5)`,
                      overflow: 'hidden',
                    }}
                  >
                    {image ? (
                      <Img
                        src={image}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          filter: `saturate(${(0.62 + 0.3 * rImg).toFixed(2)}) brightness(${(
                            0.74 +
                            0.24 * rImg
                          ).toFixed(2)}) contrast(1.06)`,
                          transform: `scale(${(1.14 - 0.08 * rImg + 0.03 * hit).toFixed(4)})`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(70% 70% at 50% 40%, ${rgba(
                            accent,
                            0.14
                          )} 0%, transparent 72%), linear-gradient(160deg, #191309 0%, #0B0805 100%)`,
                        }}
                      >
                        <BottleSilhouette accent={accent} p={rImg} />
                      </div>
                    )}
                    {/* grade interno del recuadro */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to bottom, rgba(0,0,0,0) 46%, rgba(6,4,2,0.72) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* reflejo de vidrio del portafoto */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-24%',
                        bottom: '-24%',
                        left: 0,
                        width: '46%',
                        transform: `translateX(${interpolate(rImg, [0, 1], [-60, 190], CLAMP).toFixed(
                          0
                        )}%) skewX(-16deg)`,
                        background:
                          'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.16) 50%, transparent 80%)',
                        mixBlendMode: 'screen',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  {/* clip metálico sobre el recuadro */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -16,
                      left: 40,
                      width: 74,
                      height: 30,
                      borderRadius: 4,
                      background: `linear-gradient(150deg, ${rgba('#F3E4C0', 0.92)}, ${rgba(
                        '#7A6538',
                        0.9
                      )})`,
                      boxShadow: '0 4px 12px rgba(30,20,8,0.6)',
                      transform: 'rotate(-6deg)',
                    }}
                  />
                </div>

                {/* razón + evidencia */}
                <div style={{flex: 1, minWidth: 0, paddingTop: 4}}>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: 6,
                      color: rgba(INK_RED, 0.82),
                      marginBottom: 14,
                      opacity: rReason,
                    }}
                  >
                    POR QUÉ NO VA
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 33,
                      fontWeight: 500,
                      lineHeight: 1.36,
                      color: '#241A0E',
                      opacity: rReason,
                      transform: `translateY(${((1 - rReason) * 16).toFixed(1)}px)`,
                      clipPath: `inset(0 0 ${((1 - rReason) * 100).toFixed(1)}% 0)`,
                    }}
                  >
                    {reason}
                  </div>

                  {/* tira de evidencia, borde fino */}
                  <div
                    style={{
                      marginTop: 30,
                      padding: '18px 24px',
                      border: `1px solid ${rgba('#4E3A1C', 0.44)}`,
                      borderLeft: `3px solid ${rgba(TEAL, 0.7)}`,
                      background:
                        'linear-gradient(100deg, rgba(255,250,238,0.5) 0%, rgba(232,222,200,0.16) 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                      opacity: rEvid,
                      transform: `translateY(${((1 - rEvid) * 18).toFixed(1)}px)`,
                      clipPath: `inset(0 ${((1 - rEvid) * 100).toFixed(1)}% 0 0)`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 5,
                        color: 'rgba(48,36,20,0.6)',
                        marginBottom: 8,
                      }}
                    >
                      EVIDENCIA
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SERIF,
                        fontStyle: 'italic',
                        fontSize: 26,
                        lineHeight: 1.34,
                        color: 'rgba(38,28,15,0.9)',
                      }}
                    >
                      {evidence}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================ L7 · EL SELLO */}
            {stampOn && (
              <div
                style={{
                  position: 'absolute',
                  left: STAMP_CX,
                  top: STAMP_CY,
                  width: STAMP_W,
                  height: STAMP_H,
                  marginLeft: -STAMP_W / 2,
                  marginTop: -STAMP_H / 2,
                  transform: `translateZ(26px) rotate(${stampRot.toFixed(2)}deg) scale(${stampScale.toFixed(
                    4
                  )})`,
                  opacity: stampOp,
                  filter: `blur(${stampBlur.toFixed(2)}px) drop-shadow(0 ${(6 + 26 * (1 - drop)).toFixed(
                    0
                  )}px ${(10 + 30 * (1 - drop)).toFixed(0)}px rgba(0,0,0,${(0.55 * (1 - drop) + 0.2).toFixed(
                    2
                  )}))`,
                  willChange: 'transform, filter, opacity',
                }}
              >
                <svg
                  viewBox={`0 0 ${STAMP_W} ${STAMP_H}`}
                  style={{width: '100%', height: '100%', overflow: 'visible'}}
                >
                  <defs>
                    {/* tinta mal cargada: ruido → alfa irregular */}
                    <filter id="fbl-ink-noise" x="-10%" y="-10%" width="120%" height="120%">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.055 0.075"
                        numOctaves={4}
                        seed={23}
                        stitchTiles="stitch"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.1 0 0 0 -0.42"
                      />
                    </filter>
                    {/* desgaste de bordes del sello */}
                    <filter id="fbl-ink-rough">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.09"
                        numOctaves={3}
                        seed={9}
                        result="n"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="n"
                        scale={7}
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                    </filter>
                    <mask id="fbl-ink-mask">
                      <rect
                        x={-20}
                        y={-20}
                        width={STAMP_W + 40}
                        height={STAMP_H + 40}
                        fill="#8a8a8a"
                      />
                      <rect
                        x={-20}
                        y={-20}
                        width={STAMP_W + 40}
                        height={STAMP_H + 40}
                        filter="url(#fbl-ink-noise)"
                      />
                    </mask>
                  </defs>

                  <g mask="url(#fbl-ink-mask)" filter="url(#fbl-ink-rough)">
                    {/* borde doble */}
                    <rect
                      x={7}
                      y={7}
                      width={STAMP_W - 14}
                      height={STAMP_H - 14}
                      rx={10}
                      fill="none"
                      stroke={INK_RED}
                      strokeWidth={11}
                    />
                    <rect
                      x={26}
                      y={26}
                      width={STAMP_W - 52}
                      height={STAMP_H - 52}
                      rx={6}
                      fill="none"
                      stroke={INK_RED}
                      strokeWidth={4.5}
                    />
                    {/* leve tinte de fondo, como tinta que se corrió */}
                    <rect
                      x={26}
                      y={26}
                      width={STAMP_W - 52}
                      height={STAMP_H - 52}
                      rx={6}
                      fill={rgba(INK_RED, 0.12)}
                    />
                    <text
                      x={STAMP_W / 2}
                      y={STAMP_H / 2 + 6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={INK_RED}
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: stampFs,
                        fontWeight: 900,
                        letterSpacing: 5,
                      }}
                    >
                      {stamp}
                    </text>
                  </g>
                </svg>

                {/* onda de choque del sello */}
                {imp >= 0 && imp < 22 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: STAMP_W,
                      height: STAMP_W,
                      marginLeft: -STAMP_W / 2,
                      marginTop: -STAMP_W / 2,
                      borderRadius: '50%',
                      border: `3px solid ${rgba('#FFE9C4', 0.6)}`,
                      transform: `scale(${(0.28 + imp * 0.075).toFixed(3)})`,
                      opacity: Math.max(0, 0.7 - imp * 0.055),
                      filter: 'blur(2px)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* =============================== L8 · polvo/esquirlas del impacto */}
          {imp >= 0 && (
            <AbsoluteFill style={{pointerEvents: 'none'}}>
              {shards.map((s, i) => {
                const t = imp / (Math.max(10, F * 0.3) * s.life);
                if (t > 1) return null;
                const ease = 1 - Math.pow(1 - Math.min(1, t), 2.4);
                const d = s.dist * ease;
                const x = width / 2 + (STAMP_CX - CARD_W / 2) + Math.cos(s.a) * d + s.drift * imp * 3;
                const y =
                  height / 2 +
                  (STAMP_CY - CARD_H / 2) +
                  Math.sin(s.a) * d * 0.62 -
                  ease * 46 +
                  t * t * 62;
                const sz = s.size * (1 - 0.45 * t);
                const tint = s.warm > 0.42 ? '236, 214, 172' : '176, 92, 70';
                return (
                  <div
                    key={`shard-${i}`}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: sz,
                      height: sz,
                      marginLeft: -sz / 2,
                      marginTop: -sz / 2,
                      borderRadius: '50%',
                      background: `rgba(${tint}, ${(0.85 * (1 - t)).toFixed(3)})`,
                      boxShadow: `0 0 ${(sz * 2.4).toFixed(1)}px rgba(${tint}, ${(
                        0.4 *
                        (1 - t)
                      ).toFixed(3)})`,
                      filter: t > 0.5 ? `blur(${((t - 0.5) * 4).toFixed(1)}px)` : undefined,
                    }}
                  />
                );
              })}
            </AbsoluteFill>
          )}
        </AbsoluteFill>

        {/* ================================= L2b · polvo cercano fuera de foco */}
        <AbsoluteFill style={{filter: 'blur(9px)', opacity: 0.6, pointerEvents: 'none'}}>
          <MotesLayer motes={dustNear} blur={0} scale={height / 1080} tint="244, 220, 176" />
        </AbsoluteFill>

        {/* =========================================== L9 · flash corto del golpe */}
        {flash > 0.004 && (
          <AbsoluteFill
            style={{
              background: `radial-gradient(46% 50% at 50% 55%, ${rgba('#FFEFD2', flash)} 0%, ${rgba(
                INK_RED,
                flash * 0.35
              )} 46%, transparent 74%)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* máscara de bordes gastados de la ficha (definición SVG, no dibuja) */}
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <defs>
            <filter id="fbl-edge-rough">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.02"
                numOctaves={4}
                seed={17}
                result="en"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="en"
                scale={16}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="fbl-edge-mask" maskContentUnits="userSpaceOnUse">
              <rect
                x={3}
                y={4}
                width={CARD_W - 6}
                height={CARD_H - 8}
                rx={5}
                fill="#fff"
                filter="url(#fbl-edge-rough)"
              />
            </mask>
          </defs>
        </svg>

        {/* viñeta final, por encima de todo menos el grano */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(130% 110% at 50% 50%, transparent 52%, rgba(2,2,4,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
      <GrainOverlay />
    </TransitionShell>
  );
};

export default FedBlacklist;
