/**
 * ============================================================================
 * FED_SPLITFACE — "El camionero del New England Journal of Medicine"
 * ----------------------------------------------------------------------------
 * Caso publicado en 2012: camionero de reparto, 69 años, 25 años manejando con
 * el lado IZQUIERDO de la cara pegado a la ventanilla. El vidrio detiene los
 * UVB (los que queman) pero NO los UVA (los que envejecen). Las dos mitades de
 * la cara no parecen de la misma persona.
 *
 * MULTICAPA (estilo After Effects, piso = FED_OILCAROUSEL):
 *   L0 · fondo por mood + wash cálido + viñeta doble
 *   L1 · bokeh grande de fondo (fuera de foco)
 *   L2 · polvo en suspensión
 *   L3 · plano de VIDRIO semitransparente en 3D (marco, junta, reflejo que barre)
 *   L4 · haces UVA/UVB — pasada TRASERA (UVB rebotan, UVA atraviesan con kink)
 *   L5 · tarjeta de la cara en 3D con marco fino dorado + SPLIT por clip-path
 *        (la mitad izquierda se envejece: contraste, cobre, surcos, poros)
 *   L6 · línea divisoria dorada que barre del centro hacia afuera + 2 flares
 *   L7 · callouts con punto, guía fina y placa + etiquetas por lado (máscara)
 *   L8 · haces UVA/UVB — pasada DELANTERA (luz en el aire) + etiquetas chicas
 *   L9 · placa de fuente (journal + year) + título/subtítulo
 *   L10· GrainOverlay
 *
 * 1920×1080 @ 30fps. Todo el timing es FRACCIÓN de totalF → aguanta cualquier
 * duración. Cámara: push-in + handheld permanentes (nada estático).
 * Sin Math.random()/Date.now(): sólo random('semilla').
 * ============================================================================
 */

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
} from './FedererKit';

/* ------------------------------- contrato -------------------------------- */

export type FedSplitFaceProps = {
  totalF?: number;
  accent?: string; // '#E9B44C'
  mood?: FedMood; // 'warmdark'
  image?: string; // ruta ya resuelta con staticFile por quien lo usa
  title?: string;
  sub?: string;
  leftLabel?: string;
  rightLabel?: string;
  callouts?: string[];
  journal?: string; // 'New England Journal of Medicine'
  year?: string; // '2012'
};

/* ------------------------------ geometría -------------------------------- */

const CARD_W = 560;
const CARD_H = 660;
const CARD_CX = 1150;
const CARD_CY = 560;
const CARD_L = CARD_CX - CARD_W / 2; // 870
const CARD_T = CARD_CY - CARD_H / 2; // 230

const GLASS_L = 92;
const GLASS_W = 430;
const GLASS_T = 210;
const GLASS_H = 730;

const RAY_X0 = -340; // origen de los haces, fuera de cuadro
const GLASS_HIT_X = 320; // x donde el haz toca el plano de vidrio

const GUIDE_END_X = 846; // donde muere la guía del callout (borde izq de la placa)
const CO_LABEL_W = 336;

/* --------------------------- texturas de piel ----------------------------- */

const SURCOS = [
  // surcos profundos (casi horizontales) + trama cruzada fina
  'repeating-linear-gradient(177deg, rgba(0,0,0,0.17) 0px, rgba(0,0,0,0.17) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 6px)',
  'repeating-linear-gradient(96deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 9px)',
].join(', ');

const PORES = 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.26) 0.9px, rgba(0,0,0,0) 1.7px)';

/* ---------------------------- cara / placeholder -------------------------- */

const FacePlaceholder: React.FC<{accent: string}> = ({accent}) => (
  <AbsoluteFill
    style={{
      background: [
        `radial-gradient(46% 30% at 50% 33%, ${rgba(accent, 0.1)} 0%, transparent 72%)`,
        'radial-gradient(70% 34% at 50% 96%, rgba(96, 82, 66, 0.42) 0%, transparent 72%)',
        'linear-gradient(168deg, #191410 0%, #0d0a08 52%, #050403 100%)',
      ].join(', '),
    }}
  >
    <svg viewBox="0 0 560 660" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <radialGradient id="fsfHead" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#3a2f26" />
          <stop offset="62%" stopColor="#231b15" />
          <stop offset="100%" stopColor="#0b0806" />
        </radialGradient>
        <linearGradient id="fsfRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(accent, 0.34)} />
          <stop offset="34%" stopColor={rgba(accent, 0.05)} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      <ellipse cx="280" cy="268" rx="152" ry="196" fill="url(#fsfHead)" />
      <rect x="238" y="418" width="84" height="86" rx="30" fill="#1c1610" />
      <path d="M92 660 C 118 520 200 480 280 480 C 360 480 442 520 468 660 Z" fill="#150f0b" />
      <ellipse cx="280" cy="268" rx="152" ry="196" fill="url(#fsfRim)" />
    </svg>
  </AbsoluteFill>
);

const FaceContent: React.FC<{image?: string; accent: string}> = ({image, accent}) =>
  image ? (
    <Img
      src={image}
      style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
    />
  ) : (
    <FacePlaceholder accent={accent} />
  );

/* -------------------------------- HACES ----------------------------------- */

type RayDef = {
  kind: 'uva' | 'uvb';
  y0: number;
  ang: number;
  thick: number;
  op: number;
  sp: number;
  ph: number;
  delay: number;
};

const makeRays = (): RayDef[] => {
  const out: RayDef[] = [];
  for (let i = 0; i < 9; i++) {
    const kind: 'uva' | 'uvb' = i % 3 === 1 ? 'uvb' : 'uva';
    out.push({
      kind,
      y0: -220 + random(`fsf-ray-y-${i}`) * 980,
      ang: 17 + random(`fsf-ray-a-${i}`) * 15,
      thick: (kind === 'uvb' ? 16 : 22) + random(`fsf-ray-t-${i}`) * 26,
      op: (kind === 'uvb' ? 0.2 : 0.3) + random(`fsf-ray-o-${i}`) * 0.2,
      sp: 0.011 + random(`fsf-ray-s-${i}`) * 0.014,
      ph: random(`fsf-ray-p-${i}`) * Math.PI * 2,
      delay: random(`fsf-ray-d-${i}`) * 0.16,
    });
  }
  return out;
};

const Beam: React.FC<{
  x: number;
  y: number;
  len: number;
  ang: number;
  thick: number;
  tint: string;
  op: number;
  travel: number; // 0..1 fracción dibujada
  pulse: number; // 0..1 posición del paquete de luz
  soft: number;
}> = ({x, y, len, ang, thick, tint, op, travel, pulse, soft}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: len * travel,
      height: thick,
      marginTop: -thick / 2,
      transformOrigin: '0% 50%',
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(tint, 0)} 0%, ${rgba(
        tint,
        op
      )} 16%, ${rgba(tint, op * 0.82)} 62%, ${rgba(tint, 0)} 100%)`,
      filter: `blur(${soft.toFixed(1)}px)`,
      borderRadius: thick,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${(pulse * 118 - 18).toFixed(1)}%`,
        width: '19%',
        background: `linear-gradient(90deg, ${rgba(tint, 0)}, rgba(255,255,255,${(
          op * 0.55
        ).toFixed(3)}), ${rgba(tint, 0)})`,
        filter: 'blur(3px)',
      }}
    />
  </div>
);

const RayField: React.FC<{
  rays: RayDef[];
  accent: string;
  p: number; // avance global de la escena 0..1
  pass: 'back' | 'front';
}> = ({rays, accent, p, pass}) => {
  const frame = useCurrentFrame();
  const front = pass === 'front';

  return (
    <AbsoluteFill
      style={{
        opacity: front ? 0.34 : 1,
        filter: front ? 'blur(16px)' : 'none',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    >
      {rays.map((r, i) => {
        const rad = (r.ang * Math.PI) / 180;
        const inLen = (GLASS_HIT_X - RAY_X0) / Math.cos(rad);
        const hitY = r.y0 + inLen * Math.sin(rad);

        const on = interpolate(p, [r.delay, r.delay + 0.16], [0, 1], CLAMP);
        const flick = 0.62 + 0.38 * Math.sin(frame * r.sp * 3.1 + r.ph);
        const pulse = ((frame * (0.006 + r.sp * 0.35) + r.ph / 6) % 1 + 1) % 1;
        const tint = r.kind === 'uvb' ? TEAL : COOL_BLUE;
        const op = r.op * on * flick;

        return (
          <React.Fragment key={`ray-${i}`}>
            {/* tramo INCIDENTE: del sol al vidrio */}
            <Beam
              x={RAY_X0}
              y={r.y0}
              len={inLen}
              ang={r.ang}
              thick={r.thick}
              tint={tint}
              op={op}
              travel={on}
              pulse={pulse}
              soft={r.thick * 0.34}
            />

            {r.kind === 'uvb' ? (
              <>
                {/* UVB · REBOTA en el vidrio (ángulo espejado) */}
                <Beam
                  x={GLASS_HIT_X}
                  y={hitY}
                  len={430 + r.thick * 4}
                  ang={180 - r.ang}
                  thick={r.thick * 0.85}
                  tint={tint}
                  op={op * 0.72}
                  travel={interpolate(p, [r.delay + 0.1, r.delay + 0.26], [0, 1], CLAMP)}
                  pulse={1 - pulse}
                  soft={r.thick * 0.5}
                />
                {/* punto de impacto */}
                <div
                  style={{
                    position: 'absolute',
                    left: GLASS_HIT_X,
                    top: hitY,
                    width: 15 + r.thick * 0.5,
                    height: 15 + r.thick * 0.5,
                    marginLeft: -(15 + r.thick * 0.5) / 2,
                    marginTop: -(15 + r.thick * 0.5) / 2,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(255,255,255,${(
                      0.5 * on * flick
                    ).toFixed(3)}) 0%, ${rgba(tint, 0.4 * on)} 42%, transparent 74%)`,
                    filter: 'blur(2px)',
                  }}
                />
              </>
            ) : (
              /* UVA · ATRAVIESA el vidrio, con un leve quiebre de refracción */
              <Beam
                x={GLASS_HIT_X}
                y={hitY}
                len={1980}
                ang={r.ang + 2.6}
                thick={r.thick * 1.06}
                tint={i % 2 === 0 ? accent : tint}
                op={op * 0.88}
                travel={interpolate(p, [r.delay + 0.06, r.delay + 0.3], [0, 1], CLAMP)}
                pulse={pulse}
                soft={r.thick * 0.42}
              />
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------ etiqueta chica ---------------------------- */

const MicroTag: React.FC<{
  x: number;
  y: number;
  text: string;
  note: string;
  tint: string;
  r: number;
}> = ({x, y, text, note, tint, r}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity: r,
      transform: `translateY(${((1 - r) * 10).toFixed(1)}px)`,
      clipPath: `inset(0 ${((1 - r) * 100).toFixed(1)}% 0 0)`,
      pointerEvents: 'none',
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: tint,
          boxShadow: `0 0 12px ${rgba(tint, 0.9)}`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: 3.4,
          color: tint,
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}
      >
        {text}
      </div>
    </div>
    <div
      style={{
        marginLeft: 16,
        marginTop: 3,
        fontFamily: FONT_SERIF,
        fontStyle: 'italic',
        fontSize: 16.5,
        color: 'rgba(226,222,214,0.68)',
        textShadow: '0 2px 10px rgba(0,0,0,0.95)',
      }}
    >
      {note}
    </div>
  </div>
);

/* ================================ ESCENA ================================== */

export const FedSplitFace: React.FC<FedSplitFaceProps> = ({
  totalF = FED_SCENE_F * 2,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  image,
  title = 'UNA CARA, DOS EDADES',
  sub = 'Un camionero de 69 años · 25 años con la ventanilla del lado izquierdo',
  leftLabel = '25 años contra la ventanilla',
  rightLabel = 'el otro lado, 69 años normales',
  callouts = [
    'la piel se engrosó y se descolgó',
    'surcos profundos, capa córnea gruesa',
    'poros dilatados, textura de cuero',
    'el vidrio frena los UVB, no los UVA',
  ],
  journal = 'New England Journal of Medicine',
  year = '2012',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  /* ---- reloj de la escena: todo en fracciones de totalF ---- */
  const at = (a: number) => totalF * a;
  const seg = (a: number, b: number, ease = Easing.out(Easing.cubic)) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing: ease});

  const scene = interpolate(frame, [0, totalF], [0, 1], CLAMP);

  // beats
  const cardIn = spring({frame: frame - Math.round(at(0.02)), fps, config: {damping: 17, mass: 0.85}});
  const glassIn = seg(0.0, 0.16);
  const split = seg(0.15, 0.46, Easing.inOut(Easing.cubic)); // barrido de la divisoria
  const age = 0.06 + 0.94 * split; // envejecimiento de la mitad izquierda
  const labL = seg(0.3, 0.42);
  const labR = seg(0.38, 0.5);
  const tagUVB = seg(0.24, 0.34);
  const tagUVA = seg(0.3, 0.4);
  const plate = seg(0.62, 0.74);
  const titleR = seg(0.03, 0.16);
  const subR = seg(0.09, 0.24);

  /* ---- cámara: push-in + handheld (nada estático) ---- */
  const push = interpolate(frame, [0, totalF], [1, 1.062], CLAMP);
  const hx = Math.sin(frame * 0.0192) * width * 0.0021 + Math.sin(frame * 0.0071) * 2.2;
  const hy = Math.cos(frame * 0.0263) * height * 0.0017 + Math.cos(frame * 0.0094) * 1.8;
  const hr = Math.sin(frame * 0.0131) * 0.16;

  /* ---- partículas ---- */
  const bokeh = React.useMemo(
    () => makeMotes(5, 'fsf-bokeh', 120, 250, 0.008, 0.021, 0.045, 0.11),
    []
  );
  const dust = React.useMemo(() => makeMotes(18, 'fsf-dust', 2.4, 8, 0.045, 0.1, 0.1, 0.3), []);
  const nearDust = React.useMemo(
    () => makeMotes(9, 'fsf-near', 5, 13, 0.09, 0.17, 0.06, 0.16),
    []
  );
  const rays = React.useMemo(() => makeRays(), []);

  /* ---- tarjeta 3D ---- */
  const cardRotY = -7 + 4.2 * cardIn + Math.sin(frame * 0.0148) * 0.85;
  const cardRotX = 2.6 - 1.4 * cardIn + Math.cos(frame * 0.0177) * 0.6;
  const cardZ = interpolate(cardIn, [0, 1], [-260, 0], CLAMP);
  const cardBob = Math.sin(frame * 0.0206) * 5;

  /* ---- divisoria ---- */
  const DIV_H = CARD_H + 104;
  const flare = interpolate(split, [0, 0.09, 0.88, 1], [0, 1, 1, 0.42], CLAMP);
  const flarePulse = flare * (0.78 + 0.22 * Math.sin(frame * 0.14));

  const co = callouts.slice(0, 4);
  const DOT_X = [996, 934, 1058, 912];
  const DOT_Y = [382, 470, 558, 648];

  const glassSheen = ((frame * 0.0042 + 0.15) % 1 + 1) % 1;

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF}>
        {/* ============ L0 · fondo por mood + wash + viñeta doble ============ */}
        <AbsoluteFill
          style={{
            background: moodBg(mood, accent),
            transform: `scale(${(1.05 * push).toFixed(4)}) translate(${(hx * 0.4).toFixed(
              1
            )}px, ${(hy * 0.4).toFixed(1)}px)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(48% 62% at 18% 34%, ${rgba(COOL_BLUE, 0.1)} 0%, transparent 66%)`,
              `radial-gradient(46% 56% at 62% 48%, ${rgba(accent, 0.09)} 0%, transparent 68%)`,
              'radial-gradient(126% 104% at 46% 46%, transparent 40%, rgba(1,2,5,0.9) 100%)',
              'linear-gradient(to bottom, rgba(2,3,7,0.62) 0%, transparent 22%, transparent 66%, rgba(2,3,7,0.8) 100%)',
            ].join(', '),
          }}
        />

        {/* ==================== L1 · bokeh grande de fondo ==================== */}
        <AbsoluteFill style={{opacity: 0.85, transform: `scale(${(1.1 * push).toFixed(4)})`}}>
          <MotesLayer motes={bokeh} blur={26} scale={height / 1080} tint="238, 206, 152" />
        </AbsoluteFill>

        {/* ========================= L2 · polvo fino ========================= */}
        <MotesLayer motes={dust} blur={1.3} scale={height / 1080} tint="228, 214, 186" />

        {/* ============= cámara: todo lo demás se mueve en bloque ============ */}
        <AbsoluteFill
          style={{
            transform: `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px) rotate(${hr.toFixed(
              3
            )}deg) scale(${push.toFixed(4)})`,
            willChange: 'transform',
          }}
        >
          {/* ========= L3 · PLANO DE VIDRIO (3D, marco, junta, reflejo) ======= */}
          <div
            style={{
              position: 'absolute',
              left: GLASS_L,
              top: GLASS_T,
              width: GLASS_W,
              height: GLASS_H,
              perspective: 1500,
              perspectiveOrigin: '90% 50%',
              opacity: glassIn,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transform: `rotateY(${(27 - 4 * glassIn + Math.sin(frame * 0.0113) * 0.9).toFixed(
                  2
                )}deg) translateZ(-30px) translateX(${((1 - glassIn) * -70).toFixed(1)}px)`,
              }}
            >
              {/* cuerpo del cristal */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: [
                    `linear-gradient(118deg, ${rgba(COOL_BLUE, 0.14)} 0%, ${rgba(
                      COOL_BLUE,
                      0.04
                    )} 38%, rgba(255,255,255,0.02) 70%, ${rgba(TEAL, 0.07)} 100%)`,
                    'linear-gradient(to bottom, rgba(10,18,30,0.34), rgba(4,8,15,0.5))',
                  ].join(', '),
                  border: `1px solid ${rgba(COOL_BLUE, 0.24)}`,
                  boxShadow: [
                    `inset 0 0 90px ${rgba(COOL_BLUE, 0.1)}`,
                    'inset 0 1px 0 rgba(255,255,255,0.16)',
                    `0 0 70px ${rgba(COOL_BLUE, 0.13)}`,
                    '0 40px 90px rgba(0,0,0,0.6)',
                  ].join(', '),
                }}
              >
                {/* reflejo diagonal fijo */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-30%',
                    bottom: '-30%',
                    left: '-10%',
                    width: '56%',
                    transform: 'skewX(-15deg)',
                    background:
                      'linear-gradient(100deg, transparent 14%, rgba(255,255,255,0.09) 48%, transparent 84%)',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* reflejo que BARRE (loop lento) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-34%',
                    bottom: '-34%',
                    left: 0,
                    width: '44%',
                    transform: `translateX(${(glassSheen * 300 - 70).toFixed(1)}%) skewX(-17deg)`,
                    background: `linear-gradient(100deg, transparent 20%, ${rgba(
                      COOL_BLUE,
                      0.3
                    )} 50%, transparent 80%)`,
                    mixBlendMode: 'screen',
                    opacity: 0.75,
                  }}
                />
                {/* suciedad / micro-rayas del parabrisas */}
                <AbsoluteFill
                  style={{
                    background:
                      'repeating-linear-gradient(104deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 26px)',
                    opacity: 0.7,
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* canto brillante del borde derecho (arista del vidrio) */}
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  bottom: -6,
                  right: -3,
                  width: 5,
                  borderRadius: 4,
                  background: `linear-gradient(to bottom, transparent, ${rgba(
                    COOL_BLUE,
                    0.85
                  )} 18%, rgba(255,255,255,0.9) 50%, ${rgba(COOL_BLUE, 0.85)} 82%, transparent)`,
                  filter: 'blur(1.2px)',
                  boxShadow: `0 0 26px ${rgba(COOL_BLUE, 0.6)}`,
                  mixBlendMode: 'screen',
                }}
              />
              {/* junta de goma del lado izquierdo (marco de la ventanilla) */}
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  bottom: -14,
                  left: -22,
                  width: 22,
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #05070b 0%, #12161e 60%, #080b11 100%)',
                  boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.7)',
                }}
              />
            </div>
          </div>

          {/* ============ L4 · haces UVA/UVB — pasada TRASERA ============ */}
          <RayField rays={rays} accent={accent} p={scene} pass="back" />

          {/* ===== L5 · TARJETA DE LA CARA en 3D + SPLIT por clip-path ===== */}
          <div
            style={{
              position: 'absolute',
              left: CARD_L,
              top: CARD_T,
              width: CARD_W,
              height: CARD_H,
              perspective: 1600,
              perspectiveOrigin: '46% 48%',
              opacity: interpolate(cardIn, [0, 0.35], [0, 1], CLAMP),
            }}
          >
            {/* halo dorado detrás de la tarjeta */}
            <div
              style={{
                position: 'absolute',
                inset: -170,
                background: `radial-gradient(48% 46% at 50% 50%, ${rgba(
                  accent,
                  0.2 + 0.12 * split
                )} 0%, transparent 72%)`,
                filter: 'blur(14px)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transform: [
                  `translateZ(${cardZ.toFixed(1)}px)`,
                  `translateY(${(cardBob + (1 - cardIn) * 46).toFixed(1)}px)`,
                  `rotateY(${cardRotY.toFixed(2)}deg)`,
                  `rotateX(${cardRotX.toFixed(2)}deg)`,
                  `scale(${(0.96 + 0.04 * cardIn).toFixed(4)})`,
                ].join(' '),
                willChange: 'transform',
              }}
            >
              {/* --- media: base + mitad envejecida --- */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#0a0806',
                  boxShadow: [
                    '0 48px 110px rgba(0,0,0,0.8)',
                    `0 0 0 2px ${rgba(accent, 0.5)}`,
                    '0 0 0 3px rgba(0,0,0,0.65)',
                    `0 0 0 4px ${rgba(shade(accent, 0.45), 0.75)}`,
                    `0 0 60px ${rgba(accent, 0.16)}`,
                  ].join(', '),
                }}
              >
                {/* base: el lado sano */}
                <AbsoluteFill
                  style={{
                    filter: `saturate(1.04) contrast(1.04) brightness(${(
                      0.98 + 0.06 * cardIn
                    ).toFixed(3)})`,
                  }}
                >
                  <FaceContent image={image} accent={accent} />
                </AbsoluteFill>

                {/* MITAD IZQUIERDA ENVEJECIDA — se revela del centro hacia afuera */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: `inset(${((1 - split) * 50).toFixed(2)}% 50% ${(
                      (1 - split) *
                      50
                    ).toFixed(2)}% 0)`,
                    overflow: 'hidden',
                  }}
                >
                  {/* piel: contraste + cobre + descuelgue */}
                  <AbsoluteFill
                    style={{
                      transform: `translateY(${(3.2 * age).toFixed(2)}px) scaleY(${(
                        1 + 0.016 * age
                      ).toFixed(4)}) scaleX(${(1 + 0.005 * age).toFixed(4)})`,
                      transformOrigin: '0% 46%',
                      filter: [
                        `contrast(${(1 + 0.36 * age).toFixed(3)})`,
                        `saturate(${(1 - 0.3 * age).toFixed(3)})`,
                        `brightness(${(1 - 0.19 * age).toFixed(3)})`,
                        `sepia(${(0.34 * age).toFixed(3)})`,
                        `hue-rotate(${(-7 * age).toFixed(2)}deg)`,
                      ].join(' '),
                    }}
                  >
                    <FaceContent image={image} accent={accent} />
                  </AbsoluteFill>

                  {/* surcos profundos */}
                  <AbsoluteFill
                    style={{
                      background: SURCOS,
                      opacity: 0.72 * age,
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* poros dilatados */}
                  <AbsoluteFill
                    style={{
                      backgroundImage: PORES,
                      backgroundSize: '7px 7px',
                      opacity: 0.62 * age,
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* tinte cobrizo + sombras más duras */}
                  <AbsoluteFill
                    style={{
                      background:
                        'linear-gradient(118deg, rgba(198,116,56,0.26) 0%, rgba(126,62,26,0.16) 52%, rgba(60,28,12,0.1) 100%)',
                      opacity: age,
                      mixBlendMode: 'overlay',
                    }}
                  />
                  <AbsoluteFill
                    style={{
                      background:
                        'linear-gradient(96deg, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.14) 46%, rgba(0,0,0,0) 78%)',
                      opacity: age,
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* grano fuerte SOLO de este lado */}
                  <svg
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0.17 * age,
                      mixBlendMode: 'overlay',
                      pointerEvents: 'none',
                    }}
                  >
                    <filter id="fsfSkinGrain">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.62"
                        numOctaves="3"
                        stitchTiles="stitch"
                      />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#fsfSkinGrain)" />
                  </svg>
                </div>

                {/* grade general de la tarjeta */}
                <AbsoluteFill
                  style={{
                    background: [
                      'linear-gradient(to bottom, rgba(0,0,0,0) 48%, rgba(2,3,6,0.82) 100%)',
                      `linear-gradient(146deg, ${rgba(accent, 0.12)} 0%, transparent 46%)`,
                      'radial-gradient(112% 96% at 50% 46%, transparent 46%, rgba(0,0,0,0.62) 100%)',
                    ].join(', '),
                    pointerEvents: 'none',
                  }}
                />
                {/* bloom de la divisoria proyectado sobre la piel */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 150,
                    marginLeft: -75,
                    background: `linear-gradient(90deg, transparent, ${rgba(
                      accent,
                      0.26
                    )} 46%, ${rgba(accent, 0.26)} 54%, transparent)`,
                    filter: 'blur(12px)',
                    opacity: 0.5 + 0.5 * split,
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* marco fino dorado: esquinas */}
              {[
                {top: -13, left: -13, bt: 2, bl: 2},
                {top: -13, right: -13, bt: 2, br: 2},
                {bottom: -13, left: -13, bb: 2, bl: 2},
                {bottom: -13, right: -13, bb: 2, br: 2},
              ].map((c, i) => (
                <div
                  key={`corner-${i}`}
                  style={{
                    position: 'absolute',
                    width: 34,
                    height: 34,
                    top: c.top,
                    left: c.left,
                    right: c.right,
                    bottom: c.bottom,
                    borderTop: c.bt ? `2px solid ${rgba(accent, 0.85)}` : undefined,
                    borderBottom: c.bb ? `2px solid ${rgba(accent, 0.85)}` : undefined,
                    borderLeft: c.bl ? `2px solid ${rgba(accent, 0.85)}` : undefined,
                    borderRight: c.br ? `2px solid ${rgba(accent, 0.85)}` : undefined,
                    opacity: interpolate(cardIn, [0.35, 1], [0, 1], CLAMP),
                    boxShadow: `0 0 16px ${rgba(accent, 0.4)}`,
                  }}
                />
              ))}

              {/* ====== L6 · LÍNEA DIVISORIA + FLARES (del centro hacia afuera) ====== */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: -(DIV_H - CARD_H) / 2,
                  height: DIV_H,
                  width: 0,
                  pointerEvents: 'none',
                }}
              >
                {/* halo suave de la línea */}
                <div
                  style={{
                    position: 'absolute',
                    left: -30,
                    width: 60,
                    top: `${(50 - 50 * split).toFixed(2)}%`,
                    height: `${(100 * split).toFixed(2)}%`,
                    background: `linear-gradient(90deg, transparent, ${rgba(
                      accent,
                      0.5
                    )}, transparent)`,
                    filter: 'blur(11px)',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* núcleo */}
                <div
                  style={{
                    position: 'absolute',
                    left: -1.5,
                    width: 3,
                    top: `${(50 - 50 * split).toFixed(2)}%`,
                    height: `${(100 * split).toFixed(2)}%`,
                    background: `linear-gradient(to bottom, ${rgba(accent, 0.5)}, #FFF4DC 26%, ${rgba(
                      accent,
                      0.95
                    )} 50%, #FFF4DC 74%, ${rgba(accent, 0.5)})`,
                    boxShadow: `0 0 18px ${rgba(accent, 0.9)}, 0 0 46px ${rgba(accent, 0.5)}`,
                  }}
                />
                {/* flares en las dos puntas que se separan */}
                {[0, 1].map((k) => {
                  const yPct = 50 + (k === 0 ? -50 : 50) * split;
                  const st = 240 * flarePulse;
                  return (
                    <div
                      key={`flare-${k}`}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: `${yPct.toFixed(2)}%`,
                        width: 0,
                        height: 0,
                        mixBlendMode: 'screen',
                      }}
                    >
                      {/* halo */}
                      <div
                        style={{
                          position: 'absolute',
                          width: 150 * flarePulse,
                          height: 150 * flarePulse,
                          left: -(150 * flarePulse) / 2,
                          top: -(150 * flarePulse) / 2,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, rgba(255,248,232,${(
                            0.72 * flarePulse
                          ).toFixed(3)}) 0%, ${rgba(accent, 0.42 * flarePulse)} 30%, transparent 70%)`,
                          filter: 'blur(5px)',
                        }}
                      />
                      {/* estría anamórfica horizontal */}
                      <div
                        style={{
                          position: 'absolute',
                          width: st,
                          height: 3,
                          left: -st / 2,
                          top: -1.5,
                          background: `linear-gradient(90deg, transparent, ${rgba(
                            accent,
                            0.86 * flarePulse
                          )} 34%, rgba(255,250,238,${(0.95 * flarePulse).toFixed(
                            3
                          )}) 50%, ${rgba(accent, 0.86 * flarePulse)} 66%, transparent)`,
                          filter: 'blur(2.4px)',
                        }}
                      />
                      {/* núcleo caliente */}
                      <div
                        style={{
                          position: 'absolute',
                          width: 12,
                          height: 12,
                          left: -6,
                          top: -6,
                          borderRadius: '50%',
                          background: '#FFFDF6',
                          filter: 'blur(1.5px)',
                          opacity: flarePulse,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======= L7 · CALLOUTS (punto + guía + placa) y ETIQUETAS ======= */}
          {co.map((c, i) => {
            const r = seg(0.44 + i * 0.055, 0.56 + i * 0.055);
            const dx = DOT_X[i % 4];
            const dy = DOT_Y[i % 4];
            const gLen = dx - GUIDE_END_X;
            const ring = 0.55 + 0.45 * Math.sin(frame * 0.11 + i * 1.3);
            return (
              <React.Fragment key={`co-${i}`}>
                {/* punto sobre la mitad envejecida */}
                <div
                  style={{
                    position: 'absolute',
                    left: dx,
                    top: dy,
                    width: 11,
                    height: 11,
                    marginLeft: -5.5,
                    marginTop: -5.5,
                    borderRadius: '50%',
                    background: '#FFF3D8',
                    boxShadow: `0 0 0 ${(3 + 3 * ring).toFixed(1)}px ${rgba(
                      accent,
                      0.22 * r
                    )}, 0 0 20px ${rgba(accent, 0.9 * r)}`,
                    opacity: r,
                    transform: `scale(${(0.5 + 0.5 * r).toFixed(3)})`,
                  }}
                />
                {/* guía fina hacia el borde */}
                <div
                  style={{
                    position: 'absolute',
                    left: dx - gLen * r,
                    top: dy - 0.5,
                    width: gLen * r,
                    height: 1,
                    background: `linear-gradient(90deg, ${rgba(accent, 0.12)}, ${rgba(
                      accent,
                      0.78
                    )})`,
                    boxShadow: `0 0 10px ${rgba(accent, 0.42 * r)}`,
                    opacity: r,
                  }}
                />
                {/* tick terminal */}
                <div
                  style={{
                    position: 'absolute',
                    left: GUIDE_END_X - 1,
                    top: dy - 7,
                    width: 2,
                    height: 14,
                    background: accent,
                    boxShadow: `0 0 12px ${rgba(accent, 0.8)}`,
                    opacity: interpolate(r, [0.75, 1], [0, 1], CLAMP),
                  }}
                />
                {/* placa de texto con reveal por máscara (derecha → izquierda) */}
                <div
                  style={{
                    position: 'absolute',
                    left: GUIDE_END_X - 12 - CO_LABEL_W,
                    top: dy - 22,
                    width: CO_LABEL_W,
                    textAlign: 'right',
                    clipPath: `inset(0 0 0 ${((1 - r) * 100).toFixed(1)}%)`,
                    opacity: interpolate(r, [0, 0.25], [0, 1], CLAMP),
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '7px 13px 8px',
                      borderRadius: 4,
                      background:
                        'linear-gradient(180deg, rgba(9,11,17,0.66), rgba(4,6,11,0.86))',
                      border: `1px solid ${rgba(accent, 0.2)}`,
                      backdropFilter: 'blur(5px)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.62)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: 2.6,
                        color: accent,
                        marginRight: 11,
                      }}
                    >
                      {`0${i + 1}`}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 21,
                        fontWeight: 500,
                        letterSpacing: 0.1,
                        color: 'rgba(242,236,226,0.94)',
                        textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                      }}
                    >
                      {c}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* etiquetas de cada lado, bajo la tarjeta */}
          {[
            {t: leftLabel, r: labL, left: 828, w: 316, tint: accent, mark: 'IZQUIERDA'},
            {
              t: rightLabel,
              r: labR,
              left: 1160,
              w: 316,
              tint: 'rgba(210,222,236,0.9)',
              mark: 'DERECHA',
            },
          ].map((L, i) => (
            <div
              key={`side-${i}`}
              style={{
                position: 'absolute',
                left: L.left,
                top: 902,
                width: L.w,
                textAlign: 'center',
                opacity: interpolate(L.r, [0, 0.2], [0, 1], CLAMP),
                clipPath: `inset(0 ${((1 - L.r) * 50).toFixed(1)}% 0 ${((1 - L.r) * 50).toFixed(
                  1
                )}%)`,
                transform: `translateY(${((1 - L.r) * 12).toFixed(1)}px)`,
              }}
            >
              <div
                style={{
                  width: 46 * L.r,
                  height: 2,
                  margin: '0 auto 9px',
                  background: L.tint,
                  boxShadow: `0 0 12px ${rgba(accent, 0.55)}`,
                }}
              />
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 4.4,
                  color: rgba(accent, i === 0 ? 0.95 : 0.5),
                  marginBottom: 5,
                }}
              >
                {L.mark}
              </div>
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.25,
                  color: i === 0 ? 'rgba(246,238,226,0.96)' : 'rgba(214,222,232,0.74)',
                  textShadow: '0 3px 16px rgba(0,0,0,0.92)',
                }}
              >
                {L.t}
              </div>
            </div>
          ))}

          {/* ====== L8 · haces pasada DELANTERA + etiquetas UVB / UVA ====== */}
          <RayField rays={rays} accent={accent} p={scene} pass="front" />

          <MicroTag
            x={112}
            y={252}
            text="UVB"
            note="rebotan en el vidrio"
            tint={TEAL}
            r={tagUVB}
          />
          <MicroTag
            x={556}
            y={252}
            text="UVA"
            note="lo atraviesan y envejecen"
            tint={COOL_BLUE}
            r={tagUVA}
          />
        </AbsoluteFill>

        {/* ============ L9 · título + subtítulo + placa de fuente ============ */}
        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 58,
            width: 1240,
            transform: `translate(${(hx * 0.55).toFixed(2)}px, ${(hy * 0.55).toFixed(2)}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: titleR,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 62 * titleR,
                height: 3,
                background: accent,
                boxShadow: `0 0 16px ${rgba(accent, 0.7)}`,
              }}
            />
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 6,
                color: rgba(accent, 0.92),
              }}
            >
              CASO DOCUMENTADO
            </div>
          </div>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: -1.1,
              lineHeight: 1.02,
              color: '#F6F0E4',
              textShadow: '0 6px 34px rgba(0,0,0,0.85)',
              clipPath: `inset(0 ${((1 - titleR) * 100).toFixed(1)}% 0 0)`,
              filter: `blur(${((1 - titleR) * 9).toFixed(2)}px)`,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontSize: 27,
              color: 'rgba(226,218,204,0.76)',
              textShadow: '0 3px 18px rgba(0,0,0,0.9)',
              opacity: subR,
              transform: `translateY(${((1 - subR) * 13).toFixed(1)}px)`,
            }}
          >
            {sub}
          </div>
        </div>

        {/* sello de la fuente, abajo a la izquierda */}
        <div
          style={{
            position: 'absolute',
            left: 92,
            bottom: 48,
            opacity: interpolate(plate, [0, 0.25], [0, 1], CLAMP),
            clipPath: `inset(0 ${((1 - plate) * 100).toFixed(1)}% 0 0)`,
            transform: `translate(${(hx * 0.5).toFixed(2)}px, ${(hy * 0.5).toFixed(2)}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '13px 24px 14px',
              borderRadius: 5,
              background: 'linear-gradient(180deg, rgba(10,12,19,0.64), rgba(4,6,11,0.88))',
              border: `1px solid ${rgba(accent, 0.3)}`,
              backdropFilter: 'blur(6px)',
              boxShadow: `0 22px 56px rgba(0,0,0,0.66), inset 0 1px 0 ${rgba(accent, 0.16)}`,
            }}
          >
            <div
              style={{
                width: 3,
                alignSelf: 'stretch',
                background: accent,
                boxShadow: `0 0 14px ${rgba(accent, 0.75)}`,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: 4.6,
                  color: rgba(accent, 0.72),
                  marginBottom: 5,
                }}
              >
                PUBLICADO EN
              </div>
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 23,
                  color: '#EFE7D8',
                  letterSpacing: 0.3,
                }}
              >
                {journal}
              </div>
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 34,
                fontWeight: 800,
                color: accent,
                letterSpacing: 1,
                textShadow: `0 0 26px ${rgba(accent, 0.5)}`,
              }}
            >
              {year}
            </div>
          </div>
        </div>

        {/* polvo cercano fuera de foco (profundidad de campo) */}
        <AbsoluteFill style={{filter: 'blur(9px)', opacity: 0.55, pointerEvents: 'none'}}>
          <MotesLayer motes={nearDust} blur={0} scale={height / 1080} tint="246, 220, 172" />
        </AbsoluteFill>

        {/* viñeta final por encima de todo (menos grano) */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(122% 100% at 50% 50%, transparent 52%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
            opacity: interpolate(frame, [0, FED_WHIP_F], [0.4, 1], CLAMP),
          }}
        />
      </TransitionShell>

      {/* =========================== L10 · grano =========================== */}
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedSplitFace;
