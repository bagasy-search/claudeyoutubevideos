/**
 * ############################################################################
 * FED_LABELSCAN — "LEA LA ETIQUETA"  ·  kit dark-cinematic Dr. Federer
 * ----------------------------------------------------------------------------
 * Las dos botellas dicen "aceite de girasol". Una es ALTO LINOLEICO (sirve para
 * la piel) y la otra ALTO OLEICO (sirve para la sartén). La escena obliga al
 * espectador a ir a la alacena y mirar la etiqueta.
 *
 * MULTICAPA (estilo After Effects, 11 capas reales):
 *   L0  fondo por mood + wash de acento + viñeta
 *   L1  bokeh grande de fondo (fuera de foco)
 *   L2  polvo fino en suspensión
 *   L3  mesa: sombra proyectada + reflejo especular de la botella
 *   L4  botella 3D en SVG puro (vidrio, líquido, tapa, reflejos que giran)
 *   L5  etiqueta con textura de papel + REVEAL por máscara que sigue al haz
 *   L6  retícula técnica (mira, corchetes, ticks, lectura numérica)
 *   L7  línea de escaneo: halo + core + estela de motion blur
 *   L8  barras de composición grasa con conteo numérico
 *   L9  sello de veredicto (tilde/cruz dibujada con stroke-dashoffset)
 *   L10 flash corto del estampado + título/subtítulo
 *   L11 GrainOverlay (afuera del shell)
 * ##########################################################################*/

import React from 'react';
import {
  AbsoluteFill,
  Easing,
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
  COOL_BLUE,
  TEAL,
  GrainOverlay,
  MotesLayer,
  TransitionShell,
  makeMotes,
  moodBg,
  rgba,
  shade,
  type FedMood,
} from './FedererKit';

/* =============================== CONTRATO ================================ */

export type FedLabelScanProps = {
  totalF?: number;
  accent?: string; // '#E9B44C'
  mood?: FedMood; // 'warmdark'
  title?: string;
  sub?: string;
  labelName?: string; // lo que dice la etiqueta, ej 'ACEITE DE GIRASOL'
  labelSub?: string; // ej 'alto linoleico'
  verdict?: 'ok' | 'bad';
  verdictLabel?: string;
  bars?: {label: string; pct: number; tone?: 'good' | 'bad'}[];
  liquid?: string; // color del líquido, ej '#D8A33C'
};

/* ============================ GEOMETRÍA LOCAL ============================
 * Toda la botella se dibuja en un lienzo local de 300 × 640 y después se
 * escala una sola vez: así el haz, la etiqueta y la retícula comparten
 * coordenadas exactas y el reveal cae al píxel.
 * ======================================================================== */

const BW = 300;
const BH = 640;
const STAGE_S = 1.33; // 300×640 → 399×851 en pantalla
const CYL_R = 104; // radio del cilindro donde vive la etiqueta
const PERSP = 1150;
const MAG = PERSP / (PERSP - CYL_R); // magnificación de la etiqueta por perspectiva

const LABEL_Y = 296; // top de la etiqueta en coords locales
const LABEL_H = 196;
const LABEL_W = 208;

const SCAN_FROM = -34;
const SCAN_TO = BH + 26;

const BAD_TONE = '#B96C58';

const path = (parts: string[]) => parts.join(' ');

/* Silueta del vidrio: tapa · cuello · hombro · cuerpo con base redondeada */
const BOTTLE_D = path([
  'M 122 84',
  'L 122 128',
  'C 122 160, 34 176, 31 226',
  'L 31 594',
  'Q 31 622 59 622',
  'L 241 622',
  'Q 269 622 269 594',
  'L 269 226',
  'C 266 176, 178 160, 178 128',
  'L 178 84',
  'Z',
]);

/* ========================= L4 · BOTELLA EN SVG PURO ======================= */

const Bottle: React.FC<{
  uid: string;
  liquid: string;
  accent: string;
  rot: number; // grados de rotación del cilindro
  frame: number;
}> = ({uid, liquid, accent, rot, frame}) => {
  const rad = (rot * Math.PI) / 180;
  // el reflejo especular viaja por la superficie a medida que el vidrio gira
  const specX = 150 + Math.sin(rad + 0.7) * 74;
  const specX2 = 150 + Math.sin(rad - 0.95) * 88;
  const specA = 0.1 + 0.14 * Math.max(0, Math.cos(rad + 0.7));
  const spec2A = 0.05 + 0.09 * Math.max(0, Math.cos(rad - 0.95));
  // el menisco respira apenas (nada estático)
  const surfY = 288 + Math.sin(frame * 0.048) * 1.4;

  return (
    <svg
      width={BW}
      height={BH}
      viewBox={`0 0 ${BW} ${BH}`}
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={`liq-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(liquid, 1.16)} />
          <stop offset="26%" stopColor={liquid} />
          <stop offset="72%" stopColor={shade(liquid, 0.7)} />
          <stop offset="100%" stopColor={shade(liquid, 0.42)} />
        </linearGradient>
        <linearGradient id={`liqx-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
          <stop offset={`${(26 + Math.sin(rad) * 16).toFixed(1)}%`} stopColor="rgba(0,0,0,0)" />
          <stop offset={`${(66 + Math.sin(rad) * 16).toFixed(1)}%`} stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.56)" />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="rgba(150,178,196,0.20)" />
          <stop offset="34%" stopColor="rgba(226,240,248,0.07)" />
          <stop offset="70%" stopColor="rgba(120,144,166,0.10)" />
          <stop offset="100%" stopColor="rgba(74,92,110,0.24)" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(accent, 0.34)} />
          <stop offset={`${(38 + Math.sin(rad) * 20).toFixed(1)}%`} stopColor={shade(accent, 0.94)} />
          <stop offset="100%" stopColor={shade(accent, 0.3)} />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <path d={BOTTLE_D} />
        </clipPath>
      </defs>

      {/* vidrio vacío */}
      <path d={BOTTLE_D} fill={`url(#glass-${uid})`} />

      {/* líquido */}
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="0" y={surfY} width={BW} height={BH - surfY} fill={`url(#liq-${uid})`} />
        {/* sombreado cilíndrico del líquido, ligado a la rotación */}
        <rect x="0" y={surfY} width={BW} height={BH - surfY} fill={`url(#liqx-${uid})`} />
        {/* menisco */}
        <ellipse cx="150" cy={surfY} rx="120" ry="8.5" fill={shade(liquid, 1.34)} opacity="0.85" />
        <ellipse cx="150" cy={surfY + 2.5} rx="120" ry="8.5" fill="rgba(0,0,0,0.34)" />
        {/* caustica caliente en el fondo de la botella */}
        <ellipse
          cx={150 + Math.sin(rad) * 26}
          cy="586"
          rx="82"
          ry="20"
          fill={rgba(accent, 0.3)}
          style={{filter: 'blur(9px)'}}
        />
        {/* reflejo especular principal, viaja con el giro */}
        <rect
          x={specX - 15}
          y={surfY - 6}
          width="30"
          height={BH - surfY}
          rx="15"
          fill={`rgba(255,246,226,${specA.toFixed(3)})`}
          style={{filter: 'blur(5px)'}}
        />
        {/* reflejo secundario, más fino y frío */}
        <rect
          x={specX2 - 5}
          y={surfY + 26}
          width="9"
          height={BH - surfY - 70}
          rx="5"
          fill={`rgba(214,236,248,${spec2A.toFixed(3)})`}
          style={{filter: 'blur(2.4px)'}}
        />
      </g>

      {/* paredes: canto iluminado + canto en sombra */}
      <path d={BOTTLE_D} fill="none" stroke="rgba(232,244,252,0.22)" strokeWidth="1.6" />
      <path
        d={BOTTLE_D}
        fill="none"
        stroke={rgba(accent, 0.16)}
        strokeWidth="5"
        style={{filter: 'blur(4px)'}}
      />

      {/* cuello: anillo de rosca */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="118"
          y={92 + i * 11}
          width="64"
          height="5"
          rx="2.5"
          fill="rgba(210,224,236,0.13)"
        />
      ))}

      {/* tapa metálica */}
      <rect x="113" y="26" width="74" height="58" rx="6" fill={`url(#cap-${uid})`} />
      <rect x="113" y="26" width="74" height="58" rx="6" fill="none" stroke="rgba(0,0,0,0.4)" />
      {new Array(7).fill(0).map((_, i) => (
        <rect
          key={i}
          x={118 + i * 10 + Math.sin(rad) * 3}
          y="31"
          width="2.4"
          height="48"
          fill="rgba(0,0,0,0.2)"
        />
      ))}
      <rect x="110" y="78" width="80" height="9" rx="4" fill={shade(accent, 0.52)} />
      <rect x="110" y="78" width="80" height="3" rx="1.5" fill="rgba(255,240,210,0.28)" />
    </svg>
  );
};

/* ============================ L9 · SELLO DE VEREDICTO ==================== */

const VerdictMark: React.FC<{ok: boolean; draw: number; color: string}> = ({ok, draw, color}) => (
  <svg width="96" height="96" viewBox="0 0 96 96" style={{display: 'block', overflow: 'visible'}}>
    <circle
      cx="48"
      cy="48"
      r="41"
      fill="none"
      stroke={rgba(color, 0.5)}
      strokeWidth="2"
      strokeDasharray={258}
      strokeDashoffset={258 * (1 - draw)}
      transform="rotate(-90 48 48)"
    />
    {ok ? (
      <path
        d="M 26 50 L 42 66 L 72 28"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={78}
        strokeDashoffset={78 * (1 - draw)}
        style={{filter: `drop-shadow(0 0 12px ${rgba(color, 0.85)})`}}
      />
    ) : (
      <g
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        style={{filter: `drop-shadow(0 0 12px ${rgba(color, 0.7)})`}}
      >
        <path d="M 28 28 L 68 68" strokeDasharray={57} strokeDashoffset={57 * (1 - draw)} />
        <path
          d="M 68 28 L 28 68"
          strokeDasharray={57}
          strokeDashoffset={57 * (1 - Math.max(0, (draw - 0.35) / 0.65))}
        />
      </g>
    )}
  </svg>
);

/* ================================ ESCENA ================================= */

export const FedLabelScan: React.FC<FedLabelScanProps> = ({
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  title = 'LEA LA ETIQUETA',
  sub = 'las dos botellas dicen lo mismo',
  labelName = 'ACEITE DE GIRASOL',
  labelSub = 'alto linoleico',
  verdict = 'ok',
  verdictLabel,
  bars = [
    {label: 'Ácido linoleico', pct: 66, tone: 'good'},
    {label: 'Ácido oleico', pct: 22},
    {label: 'Grasas saturadas', pct: 12, tone: 'bad'},
  ],
  liquid = '#D8A33C',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const T = Math.max(45, totalF);
  const at = (f: number) => f * T; // fracción de la escena → frames

  const ok = verdict === 'ok';
  const vColor = ok ? accent : BAD_TONE;
  const vLabel = verdictLabel ?? (ok ? 'PARA LA PIEL' : 'PARA LA SARTÉN');

  /* --------------------------- reloj de la escena ------------------------ */
  const introS = spring({frame: frame - 2, fps, config: {damping: 16, mass: 0.85}});

  // el vidrio gira y ATERRIZA con la etiqueta al frente, después respira
  const land = interpolate(frame, [at(0.02), at(0.36)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rot = interpolate(land, [0, 1], [-116, 0], CLAMP) + Math.sin(frame * 0.021) * 6.2;
  const rad = (rot * Math.PI) / 180;
  const facing = Math.max(0, Math.cos(rad));

  // haz de escaneo
  const scanP = interpolate(frame, [at(0.22), at(0.64)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const scanAlive = frame >= at(0.2) && frame <= at(0.68);
  const scanFade =
    interpolate(frame, [at(0.2), at(0.24)], [0, 1], CLAMP) *
    interpolate(frame, [at(0.62), at(0.68)], [1, 0], CLAMP);
  const scanY = interpolate(scanP, [0, 1], [SCAN_FROM, SCAN_TO], CLAMP);
  // velocidad instantánea → estela de motion blur
  const scanYPrev = interpolate(
    interpolate(frame - 1, [at(0.22), at(0.64)], [0, 1], {
      ...CLAMP,
      easing: Easing.inOut(Easing.quad),
    }),
    [0, 1],
    [SCAN_FROM, SCAN_TO],
    CLAMP
  );
  const scanVel = Math.abs(scanY - scanYPrev);

  // la etiqueta vive en z = CYL_R: su caja en pantalla está magnificada
  const labTopScr = BH / 2 + (LABEL_Y - BH / 2) * MAG;
  const labHScr = LABEL_H * MAG;
  const reveal = interpolate(scanY, [labTopScr, labTopScr + labHScr], [0, 1], CLAMP);

  // retícula
  const retIn = interpolate(frame, [at(0.12), at(0.24)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const retOut = interpolate(frame, [at(0.7), at(0.82)], [1, 0], CLAMP);
  const ret = retIn * retOut;

  // veredicto
  const stampF = Math.round(at(0.7));
  const stamp = spring({
    frame: frame - stampF,
    fps,
    config: {damping: 9.5, stiffness: 150, mass: 0.7},
  });
  const draw = interpolate(frame, [stampF + 2, stampF + Math.round(T * 0.16)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const flash = interpolate(frame, [stampF, stampF + Math.round(T * 0.06)], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

  // texto
  const tIn = interpolate(frame, [FED_WHIP_F * 0.3, at(0.14)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const sIn = interpolate(frame, [at(0.08), at(0.22)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // el instrumento de la derecha se enciende antes que los datos: nada de vacío
  const panelIn = interpolate(frame, [at(0.08), at(0.18)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  /* ------------------------------ partículas ----------------------------- */
  const dust = React.useMemo(() => makeMotes(26, 'labelscan-dust', 2, 7, 0.05, 0.12, 0.1, 0.3), []);
  const bokeh = React.useMemo(
    () => makeMotes(6, 'labelscan-bokeh', 120, 260, 0.008, 0.022, 0.04, 0.1),
    []
  );
  // fibras del papel de la etiqueta (procedural, sin imágenes)
  const fibers = React.useMemo(
    () =>
      new Array(30).fill(0).map((_, i) => ({
        x: random(`fiber-x-${i}`) * 100,
        y: random(`fiber-y-${i}`) * 100,
        w: 4 + random(`fiber-w-${i}`) * 20,
        r: random(`fiber-r-${i}`) * 180,
        o: 0.05 + random(`fiber-o-${i}`) * 0.13,
      })),
    []
  );

  /* --------------------------- cámara (nada quieto) ---------------------- */
  const push = interpolate(frame, [0, T], [1, 1.05], CLAMP);
  const camX = Math.sin(frame * 0.017) * width * 0.0016;
  const camY = Math.cos(frame * 0.023) * height * 0.0013;

  const stageW = BW * STAGE_S;
  const stageH = BH * STAGE_S;
  const stageL = 606 - stageW / 2;
  const stageT = 118;

  const maxPct = bars.reduce((m, b) => Math.max(m, b.pct), 0);
  const COL_L = 1128;
  const COL_W = 636;

  return (
    <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF}>
        {/* L0 · fondo por mood + wash + viñeta ---------------------------- */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(46% 60% at ${((stageL + stageW / 2) / 19.2).toFixed(1)}% 52%, ${rgba(
                accent,
                0.16
              )} 0%, transparent 66%)`,
              `radial-gradient(70% 60% at 76% 40%, ${rgba(TEAL, 0.05)} 0%, transparent 62%)`,
              'radial-gradient(120% 100% at 50% 48%, transparent 40%, rgba(1,2,6,0.9) 100%)',
            ].join(', '),
          }}
        />

        {/* L1 · bokeh grande de fondo ------------------------------------- */}
        <AbsoluteFill style={{filter: 'blur(20px)', opacity: 0.6}}>
          <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="238, 202, 142" />
        </AbsoluteFill>

        {/* cámara: todo lo que sigue respira junto ------------------------ */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX.toFixed(2)}px, ${camY.toFixed(2)}px) scale(${push.toFixed(
              4
            )})`,
          }}
        >
          {/* L2 · polvo fino ---------------------------------------------- */}
          <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="240, 216, 168" />

          {/* L3 · mesa: sombra proyectada + reflejo ------------------------ */}
          <div
            style={{
              position: 'absolute',
              left: stageL - 130,
              top: stageT + stageH - 46,
              width: stageW + 260,
              height: 150,
              background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.86) 0%, transparent 72%)`,
              filter: 'blur(16px)',
              opacity: introS * 0.95,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: stageL - 40,
              top: stageT + stageH - 26,
              width: stageW + 80,
              height: 26,
              background: `radial-gradient(50% 60% at 50% 40%, ${rgba(
                accent,
                0.34
              )} 0%, transparent 74%)`,
              filter: 'blur(7px)',
              opacity: introS,
            }}
          />
          {/* reflejo especular (copia espejada, difuminada y enmascarada) */}
          <div
            style={{
              position: 'absolute',
              left: stageL,
              top: stageT + stageH - 6,
              width: stageW,
              height: stageH * 0.42,
              overflow: 'hidden',
              opacity: introS * 0.28,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 72%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 72%)',
              filter: 'blur(5px)',
              transform: 'scaleY(-1)',
              transformOrigin: 'center top',
            }}
          >
            <div
              style={{
                width: BW,
                height: BH,
                transform: `scale(${STAGE_S}) translateY(${-BH + BH * 0.42}px)`,
                transformOrigin: 'top left',
              }}
            >
              <Bottle uid="ref" liquid={liquid} accent={accent} rot={rot} frame={frame} />
            </div>
          </div>

          {/* ================= ESCENARIO 3D DE LA BOTELLA ================== */}
          <div
            style={{
              position: 'absolute',
              left: stageL,
              top: stageT,
              width: stageW,
              height: stageH,
              perspective: PERSP,
              perspectiveOrigin: '50% 50%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transform: `scale(${STAGE_S}) translateY(${((1 - introS) * 90).toFixed(
                  1
                )}px) rotateX(${((1 - introS) * -9).toFixed(2)}deg)`,
                transformOrigin: 'top left',
                width: BW,
                height: BH,
                opacity: introS,
              }}
            >
              {/* halo detrás del vidrio */}
              <div
                style={{
                  position: 'absolute',
                  left: -110,
                  top: 120,
                  width: BW + 220,
                  height: BH - 60,
                  background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                    accent,
                    0.2 + 0.1 * facing
                  )} 0%, transparent 70%)`,
                  filter: 'blur(24px)',
                }}
              />

              {/* L4 · la botella ---------------------------------------- */}
              <div style={{position: 'absolute', inset: 0}}>
                <Bottle uid="main" liquid={liquid} accent={accent} rot={rot} frame={frame} />
              </div>

              {/* L5 · ETIQUETA sobre el cilindro, reveal por máscara ----- */}
              <div
                style={{
                  position: 'absolute',
                  left: BW / 2 - LABEL_W / 2,
                  top: LABEL_Y,
                  width: LABEL_W,
                  height: LABEL_H,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${rot.toFixed(2)}deg) translateZ(${CYL_R}px)`,
                  opacity: facing > 0.02 ? Math.min(1, facing * 1.9) : 0,
                  clipPath: `inset(0 0 ${((1 - reveal) * 100).toFixed(2)}% 0)`,
                }}
              >
                {/* papel */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 3,
                    background: [
                      'linear-gradient(178deg, #F3E9D6 0%, #E7DAC2 52%, #D9C9AC 100%)',
                    ].join(', '),
                    boxShadow: `0 6px 22px rgba(0,0,0,0.55), inset 0 0 0 1px ${rgba(
                      accent,
                      0.35
                    )}`,
                    overflow: 'hidden',
                  }}
                >
                  {/* fibras del papel (procedural) */}
                  {fibers.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        width: f.w,
                        height: 1,
                        background: `rgba(96,74,44,${f.o})`,
                        transform: `rotate(${f.r}deg)`,
                      }}
                    />
                  ))}
                  {/* sombreado cilíndrico: se corre con el giro */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(90deg, rgba(28,18,6,0.5) 0%, rgba(28,18,6,0) ${(
                        22 +
                        Math.sin(rad) * 12
                      ).toFixed(1)}%, rgba(28,18,6,0) ${(
                        76 +
                        Math.sin(rad) * 12
                      ).toFixed(1)}%, rgba(28,18,6,0.56) 100%)`,
                    }}
                  />
                  {/* filete dorado arriba y abajo */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      top: 13,
                      height: 2,
                      background: shade(accent, 0.72),
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: 13,
                      height: 2,
                      background: shade(accent, 0.72),
                    }}
                  />

                  {/* contenido impreso */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '24px 15px 22px',
                      textAlign: 'center',
                      color: '#2A1E0D',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 8.5,
                        letterSpacing: 3.4,
                        fontWeight: 700,
                        color: shade(accent, 0.5),
                      }}
                    >
                      PRIMERA PRENSADA
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: labelName.length > 20 ? 17 : 20,
                        fontWeight: 800,
                        letterSpacing: -0.2,
                        lineHeight: 1.06,
                        marginTop: 8,
                      }}
                    >
                      {labelName}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_SERIF,
                        fontStyle: 'italic',
                        fontSize: 15,
                        color: '#6B4B1C',
                        marginTop: 5,
                      }}
                    >
                      {labelSub}
                    </div>
                    <div
                      style={{
                        height: 1,
                        background: 'rgba(70,50,20,0.32)',
                        margin: '10px 22px',
                      }}
                    />
                    {bars.slice(0, 3).map((b, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: FONT_SANS,
                          fontSize: 8.4,
                          letterSpacing: 0.6,
                          color: 'rgba(44,32,14,0.86)',
                          padding: '0 4px',
                          marginTop: 3,
                          fontWeight: b.pct === maxPct ? 800 : 500,
                        }}
                      >
                        <span>{b.label.toUpperCase()}</span>
                        <span>{b.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* borde caliente del reveal: la fila que el haz acaba de tocar */}
                {reveal > 0.001 && reveal < 0.999 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: -4,
                      right: -4,
                      top: `${(reveal * 100).toFixed(2)}%`,
                      height: 4,
                      marginTop: -3,
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      boxShadow: `0 0 22px 6px ${rgba(accent, 0.8)}`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* L6 · RETÍCULA TÉCNICA (2D, misma caja que la botella) ----- */}
            {ret > 0.004 && (
              <svg
                width={stageW}
                height={stageH}
                viewBox={`0 0 ${BW} ${BH}`}
                style={{position: 'absolute', inset: 0, opacity: ret, overflow: 'visible'}}
              >
                {/* corchetes en las cuatro esquinas, con overshoot de entrada */}
                {[
                  [-52, 132, 1, 1],
                  [BW + 52, 132, -1, 1],
                  [-52, BH - 24, 1, -1],
                  [BW + 52, BH - 24, -1, -1],
                ].map(([x, y, sx, sy], i) => {
                  const o = (1 - retIn) * 30;
                  return (
                    <path
                      key={i}
                      d={`M ${x + sx * (34 + o)} ${y + sy * o} L ${x + sx * o} ${y + sy * o} L ${
                        x + sx * o
                      } ${y + sy * (34 + o)}`}
                      fill="none"
                      stroke={rgba(accent, 0.9)}
                      strokeWidth="2.4"
                    />
                  );
                })}
                {/* ejes de mira */}
                <line
                  x1={-64}
                  y1={BH / 2}
                  x2={BW + 64}
                  y2={BH / 2}
                  stroke={rgba(TEAL, 0.24)}
                  strokeWidth="1"
                  strokeDasharray="7 9"
                />
                <line
                  x1={BW / 2}
                  y1={110}
                  x2={BW / 2}
                  y2={BH + 10}
                  stroke={rgba(TEAL, 0.2)}
                  strokeWidth="1"
                  strokeDasharray="7 9"
                />
                {/* regla de ticks a la izquierda */}
                {new Array(17).fill(0).map((_, i) => {
                  const y = 150 + i * 28;
                  const long = i % 4 === 0;
                  const jit = random(`tick-${i}`) * 2;
                  return (
                    <g key={i}>
                      <line
                        x1={-52}
                        y1={y}
                        x2={-52 + (long ? 20 : 10) + jit}
                        y2={y}
                        stroke={rgba(accent, long ? 0.72 : 0.32)}
                        strokeWidth={long ? 1.8 : 1}
                      />
                      {long && (
                        <text
                          x={-78}
                          y={y + 3.5}
                          fill={rgba(accent, 0.6)}
                          fontFamily={FONT_SANS}
                          fontSize="9"
                          letterSpacing="1"
                          textAnchor="end"
                        >
                          {String(100 - i * 6).padStart(3, '0')}
                        </text>
                      )}
                    </g>
                  );
                })}
                {/* caja de análisis alrededor de la etiqueta */}
                <rect
                  x={BW / 2 - LABEL_W / 2 - 10}
                  y={labTopScr - 10}
                  width={LABEL_W + 20}
                  height={labHScr + 20}
                  fill="none"
                  stroke={rgba(accent, 0.3)}
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <text
                  x={BW / 2 + LABEL_W / 2 + 18}
                  y={labTopScr - 16}
                  fill={rgba(accent, 0.8)}
                  fontFamily={FONT_SANS}
                  fontSize="12"
                  letterSpacing="3"
                >
                  ETIQUETA
                </text>
              </svg>
            )}

            {/* L7 · HAZ DE ESCANEO: estela + halo + core ------------------ */}
            {scanAlive && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: stageW,
                  height: stageH,
                  opacity: scanFade,
                }}
              >
                {/* estela de motion blur, se estira con la velocidad */}
                <div
                  style={{
                    position: 'absolute',
                    left: -0.42 * stageW,
                    width: stageW * 1.84,
                    top: scanY * STAGE_S - (10 + scanVel * 2.6) * STAGE_S,
                    height: (20 + scanVel * 5.2) * STAGE_S,
                    background: `linear-gradient(to bottom, transparent, ${rgba(
                      accent,
                      0.34
                    )}, transparent)`,
                    filter: 'blur(9px)',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* halo ancho */}
                <div
                  style={{
                    position: 'absolute',
                    left: -0.32 * stageW,
                    width: stageW * 1.64,
                    top: scanY * STAGE_S - 26,
                    height: 52,
                    background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                      accent,
                      0.55
                    )} 0%, transparent 72%)`,
                    filter: 'blur(6px)',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* core nítido */}
                <div
                  style={{
                    position: 'absolute',
                    left: -0.34 * stageW,
                    width: stageW * 1.68,
                    top: scanY * STAGE_S - 1,
                    height: 2.2,
                    background: `linear-gradient(90deg, transparent 2%, ${rgba(
                      accent,
                      0.95
                    )} 22%, #FFF6E2 50%, ${rgba(accent, 0.95)} 78%, transparent 98%)`,
                    boxShadow: `0 0 18px 3px ${rgba(accent, 0.85)}`,
                  }}
                />
                {/* cabezal + lectura numérica que viaja con el haz */}
                <div
                  style={{
                    position: 'absolute',
                    left: stageW + 26,
                    top: scanY * STAGE_S - 13,
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    letterSpacing: 4,
                    fontWeight: 700,
                    color: accent,
                    textShadow: `0 0 16px ${rgba(accent, 0.7)}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`${String(Math.round(scanP * 100)).padStart(3, '0')} %`}
                </div>
              </div>
            )}
          </div>

          {/* L8 · BARRAS DE COMPOSICIÓN ---------------------------------- */}
          <div style={{position: 'absolute', left: COL_L, top: 268, width: COL_W}}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 15,
                letterSpacing: 8,
                fontWeight: 700,
                color: rgba(accent, 0.85),
                opacity: panelIn,
                marginBottom: 26,
              }}
            >
              PERFIL DE GRASAS
            </div>
            {bars.map((b, i) => {
              const s0 = at(0.34) + i * Math.max(3, T * 0.05);
              const g = interpolate(frame, [s0, s0 + Math.max(8, T * 0.2)], [0, 1], {
                ...CLAMP,
                easing: Easing.out(Easing.cubic),
              });
              const dom = b.pct === maxPct;
              const col = dom
                ? accent
                : b.tone === 'good'
                ? shade(accent, 0.82)
                : b.tone === 'bad'
                ? COOL_BLUE
                : 'rgba(216,206,188,0.5)';
              const rowIn = interpolate(
                frame,
                [at(0.1) + i * Math.max(2, T * 0.03), at(0.2) + i * Math.max(2, T * 0.03)],
                [0, 1],
                {...CLAMP, easing: Easing.out(Easing.cubic)}
              );
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: 30,
                    opacity: Math.max(rowIn * 0.46, Math.min(1, g * 2.4)),
                    transform: `translateX(${((1 - rowIn) * 34).toFixed(1)}px)`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: 9,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 25,
                        fontWeight: dom ? 800 : 500,
                        letterSpacing: 0.4,
                        color: dom ? '#F6EFE2' : 'rgba(228,220,206,0.68)',
                        textShadow: '0 3px 16px rgba(0,0,0,0.7)',
                      }}
                    >
                      {dom ? '▸ ' : ''}
                      {b.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: dom ? 42 : 32,
                        fontWeight: 800,
                        color: col,
                        letterSpacing: -1,
                        textShadow: dom ? `0 0 26px ${rgba(accent, 0.55)}` : 'none',
                      }}
                    >
                      {Math.round(b.pct * g)}
                      <span style={{fontSize: dom ? 22 : 18, opacity: 0.7}}>%</span>
                    </span>
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      height: dom ? 15 : 10,
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.07)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: `${(b.pct * g).toFixed(2)}%`,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${shade(
                          col.startsWith('#') ? col : accent,
                          0.55
                        )}, ${col})`,
                        boxShadow: dom ? `0 0 24px ${rgba(accent, 0.6)}` : 'none',
                      }}
                    />
                    {/* brillo que corre por la barra dominante */}
                    {dom && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: 60,
                          left: `${(
                            ((frame * 1.7) % (COL_W + 120)) / (COL_W + 120) *
                            100
                          ).toFixed(2)}%`,
                          background:
                            'linear-gradient(90deg, transparent, rgba(255,248,230,0.55), transparent)',
                          mixBlendMode: 'screen',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* L9 · SELLO DE VEREDICTO ------------------------------------- */}
          {stamp > 0.001 && (
            <div
              style={{
                position: 'absolute',
                left: COL_L,
                top: 726,
                width: COL_W,
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '22px 30px',
                borderRadius: 8,
                background: 'linear-gradient(180deg, rgba(24,17,9,0.72), rgba(8,5,3,0.92))',
                border: `1px solid ${rgba(vColor, 0.42)}`,
                boxShadow: `0 26px 70px rgba(0,0,0,0.68), 0 0 ${(46 * stamp).toFixed(
                  0
                )}px ${rgba(vColor, 0.28 * stamp)}`,
                transform: `scale(${(0.72 + 0.28 * stamp).toFixed(4)}) rotate(${(
                  (1 - stamp) *
                  -3.4
                ).toFixed(2)}deg)`,
                transformOrigin: 'left center',
                opacity: Math.min(1, stamp * 2.2),
              }}
            >
              <VerdictMark ok={ok} draw={draw} color={vColor} />
              <div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 14,
                    letterSpacing: 7,
                    fontWeight: 700,
                    color: rgba(vColor, 0.85),
                    marginBottom: 7,
                  }}
                >
                  VEREDICTO
                </div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: vLabel.length > 16 ? 46 : 58,
                    fontWeight: 800,
                    letterSpacing: -1,
                    lineHeight: 1,
                    color: '#F6EFE2',
                    textShadow: `0 0 34px ${rgba(vColor, 0.5)}, 0 5px 24px rgba(0,0,0,0.8)`,
                    clipPath: `inset(0 ${((1 - Math.min(1, stamp * 1.3)) * 100).toFixed(1)}% 0 0)`,
                  }}
                >
                  {vLabel}
                </div>
              </div>
            </div>
          )}

          {/* L10a · título + subtítulo ----------------------------------- */}
          <div style={{position: 'absolute', left: 116, top: 74, width: 900}}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 15,
                letterSpacing: 9,
                fontWeight: 700,
                color: rgba(accent, 0.9),
                opacity: tIn,
                transform: `translateX(${((1 - tIn) * -26).toFixed(1)}px)`,
                marginBottom: 12,
              }}
            >
              ALACENA · CONTROL
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 74,
                fontWeight: 800,
                letterSpacing: -1.4,
                lineHeight: 0.98,
                color: '#F6EFE2',
                textShadow: '0 6px 34px rgba(0,0,0,0.85)',
                opacity: tIn,
                transform: `translateY(${((1 - tIn) * 22).toFixed(1)}px)`,
                clipPath: `inset(0 ${((1 - tIn) * 100).toFixed(1)}% 0 0)`,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: 31,
                color: 'rgba(230,222,208,0.72)',
                marginTop: 14,
                opacity: sIn,
                transform: `translateY(${((1 - sIn) * 14).toFixed(1)}px)`,
              }}
            >
              {sub}
            </div>
            <div
              style={{
                width: interpolate(tIn, [0, 1], [0, 260], CLAMP),
                height: 2,
                marginTop: 20,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
              }}
            />
          </div>
        </AbsoluteFill>

        {/* L10b · flash corto del estampado ----------------------------- */}
        {flash > 0.004 && (
          <AbsoluteFill
            style={{
              background: `radial-gradient(60% 60% at 72% 74%, ${rgba(
                vColor,
                0.42 * flash
              )} 0%, transparent 68%)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        )}
      </TransitionShell>

      {/* L11 · grano */}
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedLabelScan;
