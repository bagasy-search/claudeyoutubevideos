import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
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
  type FedMood,

  type FedTransitionVariant,
} from '../../FedererKit';

/* ############################################################################
 * FED_PAPER — "ACÁ ESTÁ EL ESTUDIO": una página de publicación científica que
 * SE DESLIZA a cuadro y sobre la que alguien pasa un RESALTADOR AMARILLO en vivo.
 *
 * ⚠️ EXCEPCIÓN DELIBERADA al kit dark-cinematic: la hoja es CLARA. El fondo
 * sigue siendo el oscuro del kit (moodBg) para que el papel corte visualmente.
 * Todo el timing sale de `totalF`, así que lee igual a 3s (90f) que a 7s (210f).
 *
 *   L0  · fondo por mood + wash de acento/teal + viñeta
 *   L1  · bokeh grande fuera de foco
 *   L2  · polvo ambiental (dos densidades)
 *   L3  · smear de movimiento + sombra proyectada que se cierra al asentarse
 *   L4  · la hoja: papel procedural (fibras, grano, manchas, pliegues, bordes
 *         desgastados por máscara de ruido, esquinas irregulares)
 *   L5  · encabezado (revista · año · metadatos · filetes)
 *   L6  · cuerpo (título serif, autores, abstract: texto REAL + texto SIMULADO)
 *   L7  · el resaltador amarillo (sangrado + trazo irregular + punta húmeda +
 *         refuerzo de contraste del texto cubierto)
 *   L8  · nota manuscrita al margen + flecha curva que se dibuja
 *   L9  · sello/estampilla discreto (journal + year)
 *   L10 · reflejo/luz de estudio sobre el papel + barrido especular
 *   L11 · viñeta final + GrainOverlay
 * ########################################################################## */

export type FedPaperProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string; // '#E9B44C'
  mood?: FedMood; // 'warmdark' (el fondo detrás de la hoja)
  journal?: string;
  year?: string;
  meta?: string;
  paperTitle?: string;
  authors?: string;
  lines?: string[]; // líneas reales del abstract
  highlight?: number; // índice de la línea a resaltar (-1 = ninguna)
  note?: string; // nota manuscrita al margen
  side?: 'left' | 'right'; // de dónde entra la hoja
};

/* --------------------------------------------------------------- geometría */
const CARD_W = 1390;
const CARD_H = 978;
const PAD = 78;
const USABLE = CARD_W - PAD * 2;
/* el abstract va en columna angosta: el margen derecho es donde vive la nota */
const COL_W = 1010;
const NOTE_X = 1040;
const NOTE_W = 330;

const HEAD_Y = 50;
const RULE1_Y = 108;
const META_Y = 122;
const TITLE_Y = 170;
const TITLE_H = 136;
const AUTH_Y = TITLE_Y + TITLE_H + 12;
const RULE2_Y = 372;
const LABEL_Y = 392;
const ROWS_TOP = 440;
const ROWS_BOT = 862;
const SEAL_Y = 884;

const PRE_FAKE = 2;
const POST_FAKE = 3;

/* --------------------------------------------------------------- paleta */
const PAPER_HI = '#F6EFDD';
const PAPER_MID = '#E9DEC6';
const PAPER_LO = '#D5C8AC';
const INK = '#241B12';
const INK_SOFT = '#4A3E2E';
const INK_FAINT = '#7C6E58';
const HAND_INK = '#22406E';
const MARK_YEL = '#F5D33A';
const MARK_YEL_DEEP = '#E7B417';

/* ancho aproximado de una tirada de texto (no hace falta medir el DOM) */
const estW = (t: string, fs: number, k = 0.48): number => t.length * fs * k;
/** baja el cuerpo hasta que la línea entre en `maxW` */
const fitFs = (t: string, maxW: number, base: number, min: number, k = 0.48): number =>
  estW(t, base, k) <= maxW
    ? base
    : Math.max(min, Math.floor(maxW / Math.max(1, t.length * k)));

/* ============================================================ RESALTADOR ===
 * Se dibuja de izquierda a derecha sobre un <span> inline-block, así que toma
 * el ancho REAL del texto sin medir nada. El borde no es un rectángulo: tres
 * pasadas de distinta altura + feDisplacementMap = fibrón de verdad.
 * ======================================================================== */
const Highlighter: React.FC<{p: number}> = ({p}) => {
  const frame = useCurrentFrame();
  if (p <= 0.001) return null;

  const clip = `inset(0 ${((1 - p) * 100).toFixed(3)}% 0 0)`;
  /* la mano no va perfectamente recta mientras marca */
  const jitter = p < 0.995 ? Math.sin(frame * 0.9) * 0.9 : 0;
  const press = 0.86 + 0.14 * Math.sin(frame * 0.55 + 1.1);

  return (
    <>
      {/* sangrado: la tinta se pasa del trazo */}
      <div
        style={{
          position: 'absolute',
          left: -26,
          right: -30,
          top: -16,
          bottom: -18,
          clipPath: clip,
          WebkitClipPath: clip,
          mixBlendMode: 'multiply',
          opacity: 0.5,
          transform: `translateY(${(jitter * 0.6).toFixed(2)}px)`,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%" style={{display: 'block'}}>
          <rect
            x="1%"
            y="14%"
            width="98%"
            height="70%"
            rx="16"
            fill={rgba(MARK_YEL, 0.85)}
            filter="url(#fpp-bleed)"
          />
        </svg>
      </div>

      {/* trazo principal — tres pasadas, borde comido por ruido */}
      <div
        style={{
          position: 'absolute',
          left: -18,
          right: -22,
          top: -10,
          bottom: -12,
          clipPath: clip,
          WebkitClipPath: clip,
          mixBlendMode: 'multiply',
          transform: `translateY(${jitter.toFixed(2)}px)`,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%" style={{display: 'block'}}>
          <g filter="url(#fpp-rough)">
            <rect x="0.4%" y="10%" width="99.2%" height="76%" rx="11" fill="url(#fpp-yellow)" />
            <rect
              x="1.8%"
              y="24%"
              width="96.4%"
              height="48%"
              rx="9"
              fill={rgba(MARK_YEL, 0.55 * press)}
            />
            <rect
              x="0.9%"
              y="56%"
              width="98.2%"
              height="28%"
              rx="8"
              fill={rgba(MARK_YEL_DEEP, 0.34)}
            />
          </g>
        </svg>
      </div>

      {/* punta húmeda del fibrón: acumulación de tinta + brillo */}
      {p > 0.015 && p < 0.985 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: `${(p * 100).toFixed(2)}%`,
              top: -14,
              bottom: -16,
              width: 34,
              marginLeft: -16,
              borderRadius: 12,
              background: `radial-gradient(60% 52% at 34% 50%, ${rgba(
                MARK_YEL_DEEP,
                0.85
              )} 0%, ${rgba(MARK_YEL, 0.34)} 58%, transparent 78%)`,
              filter: 'blur(3px)',
              mixBlendMode: 'multiply',
              transform: `translateY(${jitter.toFixed(2)}px)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${(p * 100).toFixed(2)}%`,
              top: -18,
              width: 16,
              height: 14,
              marginLeft: -12,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.55)',
              filter: 'blur(4px)',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </>
  );
};

/* ================================================================ ESCENA === */
export const FedPaper: React.FC<FedPaperProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  journal = 'Pediatric Dermatology',
  year = '2013',
  meta = 'Vol. 30 · N.º 1 · pp. 42-50 · ensayo aleatorizado',
  paperTitle = 'Efecto del aceite de oliva y del aceite de girasol sobre la barrera de la piel',
  authors = 'S. G. Danby · T. AlEnezi · A. Sultan · J. Chittock · K. Brown · M. J. Cork',
  lines = [
    'Cuatro semanas de aplicación en un antebrazo.',
    'El aceite de oliva dañó la barrera de la piel sana.',
    'El girasol mantuvo la barrera intacta.',
  ],
  highlight = 1,
  note = 'y era piel sana',
  side = 'right',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const F = Math.max(60, totalF);

  /* ------------------------------------------------ tiempos (todo sobre F) */
  const LAND = Math.round(F * 0.3);
  const ovAt = (f: number): number =>
    interpolate(f, [0, LAND], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.back(1.45)),
    });
  const ov = ovAt(frame);
  const vel = Math.abs(ov - ovAt(frame - 1));
  const settle = interpolate(frame, [0, LAND], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const hp = interpolate(frame, [F * 0.42, F * 0.66], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  /* orden natural: primero se escribe la nota, después se tira la flecha */
  const writeP = interpolate(frame, [F * 0.62, F * 0.8], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const arrowP = interpolate(frame, [F * 0.78, F * 0.9], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const sealP = interpolate(frame, [F * 0.54, F * 0.66], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(2.2)),
  });

  /* ------------------------------------------------------------ partículas */
  const bokeh = React.useMemo(
    () => makeMotes(6, 'fpp-bok', 120, 260, 0.008, 0.024, 0.05, 0.13),
    []
  );
  const dustFar = React.useMemo(
    () => makeMotes(24, 'fpp-far', 2, 7, 0.05, 0.11, 0.1, 0.3),
    []
  );
  const dustNear = React.useMemo(
    () => makeMotes(10, 'fpp-near', 5, 13, 0.11, 0.2, 0.06, 0.18),
    []
  );

  /* ------------------------------------------- manchas de envejecido (fijas) */
  const stains = React.useMemo(
    () =>
      new Array(8).fill(0).map((_, i) => ({
        x: 5 + random(`fpp-st-x-${i}`) * 90,
        y: 5 + random(`fpp-st-y-${i}`) * 90,
        r: 70 + random(`fpp-st-r-${i}`) * 220,
        o: 0.025 + random(`fpp-st-o-${i}`) * 0.05,
      })),
    []
  );

  /* --------------------------------------- filas del abstract (real + falso) */
  const rowsSpec = React.useMemo(() => {
    const arr: {real: boolean; k: number}[] = [];
    for (let i = 0; i < PRE_FAKE; i++) arr.push({real: false, k: i});
    lines.forEach((_, k) => arr.push({real: true, k}));
    for (let i = 0; i < POST_FAKE; i++) arr.push({real: false, k: PRE_FAKE + i});
    return arr;
  }, [lines]);

  const ROW_H = Math.min(60, (ROWS_BOT - ROWS_TOP) / Math.max(1, rowsSpec.length));

  /* segmentos del texto simulado: "palabras" grises de ancho variable */
  const fakeRows = React.useMemo(
    () =>
      new Array(12).fill(0).map((_, r) => {
        const n = 4 + Math.floor(random(`fpp-fn-${r}`) * 3);
        const raw = new Array(n)
          .fill(0)
          .map((_, k) => 0.45 + random(`fpp-fw-${r}-${k}`) * 1.15);
        const sum = raw.reduce((a, b) => a + b, 0);
        return {raw, sum};
      }),
    []
  );

  /* ---------------------------------------------------------- tipografías */
  const titleFs = Math.max(
    36,
    Math.min(56, Math.floor((USABLE * 2) / Math.max(1, paperTitle.length * 0.5)))
  );
  const authFs = fitFs(authors, USABLE, 24, 17, 0.45);
  const lineFs = lines.reduce((acc, t) => Math.min(acc, fitFs(t, COL_W, 36, 25)), 36);

  const hlValid = highlight >= 0 && highlight < lines.length;
  const hlRow = hlValid ? PRE_FAKE + highlight : -1;
  const hlY = ROWS_TOP + hlRow * ROW_H + ROW_H / 2;
  /* 0.435 ≈ ancho medio real de Georgia en español (medido contra el render) */
  const hlEndX = hlValid ? PAD + estW(lines[highlight], lineFs, 0.435) : 0;

  const showNote = hlValid && note.trim().length > 0;
  const noteY = Math.max(RULE2_Y + 14, hlY - 212);
  const noteFs = Math.max(26, Math.min(44, Math.floor(NOTE_W / Math.max(6, note.length * 0.5))));

  /* sello: dos renglones, cuerpo ajustado para que NUNCA se corte */
  const sealW = 430;
  const sealFs = Math.max(12, Math.min(22, Math.floor((sealW - 46) / (journal.length * 0.78))));

  /* -------------------------------------------- cámara: nunca queda quieta */
  const push = interpolate(frame, [0, F], [1.005, 1.062], CLAMP);
  const hx = Math.sin(frame * 0.0192) * width * 0.0022 + Math.sin(frame * 0.071) * 1.5;
  const hy = Math.cos(frame * 0.0168) * height * 0.0018 + Math.cos(frame * 0.059) * 1.2;
  const hr = Math.sin(frame * 0.0131) * 0.3;

  /* -------------------------------------------- entrada 3D de la hoja */
  const dir = side === 'left' ? -1 : 1;
  const tx = (1 - ov) * dir * 1180;
  const ty = (1 - ov) * 250;
  const rotY = -6 + (1 - ov) * dir * 34;
  const rotX = (1 - ov) * -10 + Math.cos(frame * 0.021) * 0.5;
  const rotZ = (1 - ov) * dir * 7.5 + Math.sin(frame * 0.0173) * 0.35;
  const cardScale = interpolate(ov, [0, 1], [0.8, 0.935]);
  const mBlur = Math.min(20, vel * 300);

  const shadowBlur = 104 - 58 * settle;
  const shadowDx = dir * (74 - 48 * settle);
  const shadowDy = 96 - 58 * settle;

  const rowOpacity = (i: number): number =>
    interpolate(
      frame,
      [F * 0.1 + i * F * 0.013, F * 0.1 + i * F * 0.013 + F * 0.075],
      [0, 1],
      CLAMP
    );

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: '#04030a', overflow: 'hidden'}}>
        {/* =========================== L0 · fondo por mood + wash + viñeta */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(62% 56% at 50% 46%, ${rgba(accent, 0.18)} 0%, transparent 68%)`,
              `radial-gradient(44% 40% at 14% 18%, ${rgba(COOL_BLUE, 0.08)} 0%, transparent 70%)`,
              `radial-gradient(40% 38% at 86% 84%, ${rgba(TEAL, 0.06)} 0%, transparent 70%)`,
            ].join(', '),
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(120% 102% at 50% 48%, transparent 34%, rgba(2,2,4,0.92) 100%)',
          }}
        />

        {/* ================================== L1 · bokeh grande fuera de foco */}
        <AbsoluteFill style={{filter: 'blur(30px)', opacity: 0.7}}>
          <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="238, 202, 142" />
        </AbsoluteFill>

        {/* ============================================= L2 · polvo ambiental */}
        <MotesLayer motes={dustFar} blur={1.1} scale={height / 1080} tint="238, 218, 178" />

        {/* ======================== escena 3D: sombra + hoja + nota (una cámara) */}
        <AbsoluteFill
          style={{
            perspective: 2300,
            perspectiveOrigin: '50% 46%',
            transform: `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px) rotate(${hr.toFixed(
              3
            )}deg) scale(${push.toFixed(4)})`,
            willChange: 'transform',
          }}
        >
          {/* ------- L3 · smear de movimiento (estela direccional de la entrada) */}
          {mBlur > 1.2 && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                borderRadius: 8,
                background: rgba(PAPER_MID, 0.5),
                transform: `translate(${(tx + dir * mBlur * 5).toFixed(1)}px, ${(
                  ty +
                  mBlur * 1.2
                ).toFixed(1)}px) rotate(${rotZ.toFixed(2)}deg) scale(${(
                  cardScale * (1 + mBlur * 0.006)
                ).toFixed(4)}, ${cardScale.toFixed(4)})`,
                filter: `blur(${(mBlur * 1.7).toFixed(1)}px)`,
                opacity: Math.min(0.5, mBlur * 0.026),
                pointerEvents: 'none',
              }}
            />
          )}

          {/* ------------- L3b · sombra proyectada que se cierra al asentarse */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: CARD_W,
              height: CARD_H,
              marginLeft: -CARD_W / 2,
              marginTop: -CARD_H / 2,
              borderRadius: 14,
              background: 'rgba(0,0,0,0.86)',
              transform: `translate(${(tx * 0.86 + shadowDx).toFixed(1)}px, ${(
                ty * 0.86 +
                shadowDy
              ).toFixed(1)}px) rotate(${(rotZ * 0.8).toFixed(2)}deg) skewX(${(
                -8 * settle
              ).toFixed(2)}deg) scale(${(cardScale * 0.985).toFixed(4)})`,
              filter: `blur(${shadowBlur.toFixed(1)}px)`,
              opacity: 0.66 * Math.min(1, settle * 2.4),
              pointerEvents: 'none',
            }}
          />

          {/* ============================ L4..L9 · la hoja y todo lo que lleva */}
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
                `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`,
                `rotateY(${rotY.toFixed(2)}deg)`,
                `rotateX(${rotX.toFixed(2)}deg)`,
                `rotateZ(${rotZ.toFixed(2)}deg)`,
                `scale(${cardScale.toFixed(4)})`,
              ].join(' '),
              filter: mBlur > 0.6 ? `blur(${mBlur.toFixed(2)}px)` : 'none',
              opacity: Math.min(1, settle * 3.4),
              willChange: 'transform, filter, opacity',
            }}
          >
            {/* --------------------------------- L4 · el papel (procedural) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                background: `linear-gradient(158deg, ${PAPER_HI} 0%, ${PAPER_MID} 46%, ${PAPER_LO} 100%)`,
                boxShadow: [
                  '0 40px 96px rgba(0,0,0,0.62)',
                  '0 6px 20px rgba(0,0,0,0.4)',
                  `inset 0 0 90px ${rgba(shade(accent, 0.7), 0.18)}`,
                ].join(', '),
                maskImage: 'url(#fpp-edge-mask)',
                WebkitMaskImage: 'url(#fpp-edge-mask)',
              }}
            >
              {/* fibras finas del papel */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.4,
                  mixBlendMode: 'multiply',
                }}
              >
                <filter id="fpp-fiber">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.018 1.05"
                    numOctaves={3}
                    seed={23}
                    stitchTiles="stitch"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.44  0 0 0 0 0.38  0 0 0 0 0.28  0.3 0 0 0 0"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#fpp-fiber)" />
              </svg>
              {/* grano grueso (tooth) */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.16,
                  mixBlendMode: 'multiply',
                }}
              >
                <filter id="fpp-tooth">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.72"
                    numOctaves={2}
                    seed={7}
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#fpp-tooth)" />
              </svg>

              {/* manchitas de envejecido */}
              {stains.map((s, i) => (
                <div
                  key={`fpp-stain-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.r,
                    height: s.r * 0.8,
                    marginLeft: -s.r / 2,
                    marginTop: -s.r * 0.4,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(120,92,48,${s.o}) 0%, transparent 72%)`,
                  }}
                />
              ))}

              {/* pliegue vertical apenas visible */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  bottom: -20,
                  left: '61%',
                  width: 44,
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(96,74,42,0.13) 40%, rgba(255,252,242,0.42) 52%, rgba(96,74,42,0.1) 64%, transparent 100%)',
                }}
              />
              {/* pliegue horizontal aún más tenue */}
              <div
                style={{
                  position: 'absolute',
                  left: -20,
                  right: -20,
                  top: '41%',
                  height: 32,
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(90,68,38,0.08) 44%, rgba(255,252,242,0.28) 54%, transparent 100%)',
                }}
              />
            </div>

            {/* ================================== L5 · encabezado de la revista */}
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: HEAD_Y,
                width: USABLE,
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                opacity: Math.min(1, settle * 2.6),
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 31,
                  fontStyle: 'italic',
                  letterSpacing: '0.05em',
                  color: shade(accent, 0.52),
                }}
              >
                {journal}
              </div>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 27,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: shade(accent, 0.58),
                }}
              >
                {year}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: RULE1_Y,
                width: USABLE,
                height: 2,
                background: `linear-gradient(90deg, ${rgba(INK, 0.5)} 0%, ${rgba(
                  INK,
                  0.14
                )} 78%, transparent 100%)`,
                transform: `scaleX(${Math.min(1, settle * 1.6).toFixed(3)})`,
                transformOrigin: 'left center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: META_Y,
                width: USABLE,
                fontFamily: FONT_SANS,
                fontSize: 21,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: INK_FAINT,
                opacity: Math.min(1, settle * 2.2),
              }}
            >
              {meta}
            </div>

            {/* ============================================ L6 · cuerpo del paper */}
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: TITLE_Y,
                width: USABLE,
                height: TITLE_H,
                fontFamily: FONT_SERIF,
                fontSize: titleFs,
                fontWeight: 700,
                lineHeight: 1.16,
                color: INK,
                opacity: Math.min(1, settle * 2),
              }}
            >
              {paperTitle}
            </div>
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: AUTH_Y,
                width: USABLE,
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: authFs,
                color: INK_SOFT,
                opacity: Math.min(1, settle * 1.9),
              }}
            >
              {authors}
            </div>
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: RULE2_Y,
                width: USABLE,
                height: 1,
                background: rgba(INK, 0.24),
                transform: `scaleX(${Math.min(1, settle * 1.4).toFixed(3)})`,
                transformOrigin: 'left center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: LABEL_Y,
                fontFamily: FONT_SANS,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: '0.34em',
                color: shade(accent, 0.6),
                opacity: Math.min(1, settle * 1.8),
              }}
            >
              RESUMEN
            </div>

            {/* filas del abstract: texto simulado (barras) + texto real */}
            {rowsSpec.map((row, i) => {
              const top = ROWS_TOP + i * ROW_H;
              const op = rowOpacity(i);
              if (row.real) {
                const text = lines[row.k];
                const isHl = hlValid && row.k === highlight;
                return (
                  <div
                    key={`fpp-row-${i}`}
                    style={{
                      position: 'absolute',
                      left: PAD,
                      top,
                      width: COL_W + 40,
                      height: ROW_H,
                      display: 'flex',
                      alignItems: 'center',
                      opacity: op,
                      filter: `blur(${((1 - op) * 5).toFixed(2)}px)`,
                    }}
                  >
                    <span
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        fontFamily: FONT_SERIF,
                        fontSize: lineFs,
                        lineHeight: 1.28,
                        color: INK_SOFT,
                      }}
                    >
                      {text}
                      {/* refuerzo de contraste bajo el resaltador (mismas métricas) */}
                      {isHl && hp > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            whiteSpace: 'nowrap',
                            color: '#160E05',
                            WebkitTextStroke: '0.75px #160E05',
                            clipPath: `inset(0 ${((1 - hp) * 100).toFixed(3)}% 0 0)`,
                            WebkitClipPath: `inset(0 ${((1 - hp) * 100).toFixed(3)}% 0 0)`,
                            pointerEvents: 'none',
                          }}
                        >
                          {text}
                        </span>
                      )}
                      {/* ------------------------------- L7 · el resaltador */}
                      {isHl && <Highlighter p={hp} />}
                    </span>
                  </div>
                );
              }
              const spec = fakeRows[row.k % fakeRows.length];
              const isLast = i === rowsSpec.length - 1;
              const target = COL_W * (isLast ? 0.5 : 0.88 + (row.k % 3) * 0.02);
              const gaps = 18 * (spec.raw.length - 1);
              return (
                <div
                  key={`fpp-row-${i}`}
                  style={{
                    position: 'absolute',
                    left: PAD,
                    top,
                    width: COL_W,
                    height: ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    opacity: op * 0.9,
                  }}
                >
                  {spec.raw.map((w, k) => (
                    <div
                      key={`fpp-seg-${i}-${k}`}
                      style={{
                        width: ((w / spec.sum) * (target - gaps)).toFixed(1) + 'px',
                        height: 13,
                        borderRadius: 7,
                        background: `linear-gradient(90deg, ${rgba(INK, 0.26)} 0%, ${rgba(
                          INK,
                          0.17
                        )} 100%)`,
                      }}
                    />
                  ))}
                </div>
              );
            })}

            {/* ================================ L9 · sello/estampilla discreto */}
            <div
              style={{
                position: 'absolute',
                left: CARD_W - sealW - 74,
                top: SEAL_Y - 10,
                width: sealW,
                height: 92,
                transform: `rotate(-5.5deg) scale(${(0.86 + 0.14 * sealP).toFixed(3)})`,
                opacity: 0.55 * sealP,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                border: `3px solid ${rgba(HAND_INK, 0.85)}`,
                borderRadius: 6,
                boxShadow: `inset 0 0 0 5px ${rgba(PAPER_HI, 0.001)}, inset 0 0 0 7px ${rgba(
                  HAND_INK,
                  0.45
                )}`,
                filter: 'url(#fpp-stamp-rough)',
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: sealFs,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: rgba(HAND_INK, 0.95),
                  whiteSpace: 'nowrap',
                }}
              >
                {journal}
              </div>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: '0.3em',
                  color: rgba(HAND_INK, 0.95),
                  whiteSpace: 'nowrap',
                }}
              >
                {year}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: PAD,
                top: SEAL_Y + 22,
                fontFamily: FONT_SANS,
                fontSize: 17,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: rgba(INK, 0.34),
                opacity: Math.min(1, settle * 1.6),
              }}
            >
              recibido · revisado · aceptado
            </div>

            {/* ============= L8 · nota manuscrita al margen + flecha curva */}
            {showNote && (
              <>
                <svg
                  viewBox={`0 0 ${CARD_W} ${CARD_H}`}
                  width={CARD_W}
                  height={CARD_H}
                  style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
                >
                  <g filter="url(#fpp-hand-rough)">
                    <path
                      d={`M ${NOTE_X + 26} ${noteY + 116} C ${NOTE_X + 176} ${
                        noteY + 182
                      }, ${hlEndX + 236} ${hlY - 46}, ${hlEndX + 26} ${hlY - 6}`}
                      fill="none"
                      stroke={rgba(HAND_INK, 0.88)}
                      strokeWidth={4.2}
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={100 * (1 - arrowP)}
                    />
                    {arrowP > 0.86 && (
                      <path
                        d={`M ${hlEndX + 26} ${hlY - 6} l 34 -18 M ${hlEndX + 26} ${
                          hlY - 6
                        } l 30 22`}
                        fill="none"
                        stroke={rgba(HAND_INK, 0.88)}
                        strokeWidth={4.2}
                        strokeLinecap="round"
                        opacity={interpolate(arrowP, [0.86, 1], [0, 1], CLAMP)}
                      />
                    )}
                  </g>
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    left: NOTE_X,
                    top: noteY,
                    width: NOTE_W,
                    transform: `rotate(-6.5deg)`,
                    transformOrigin: 'left top',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
                      fontSize: noteFs,
                      fontWeight: 700,
                      lineHeight: 1.24,
                      color: HAND_INK,
                      textShadow: `0 0 2px ${rgba(HAND_INK, 0.35)}`,
                      clipPath: `inset(-30% ${((1 - writeP) * 100).toFixed(2)}% -30% -8%)`,
                      WebkitClipPath: `inset(-30% ${((1 - writeP) * 100).toFixed(
                        2
                      )}% -30% -8%)`,
                    }}
                  >
                    {note}
                  </div>
                  <svg
                    width={NOTE_W}
                    height={26}
                    style={{display: 'block', marginTop: 2, overflow: 'visible'}}
                  >
                    <path
                      d={`M 4 12 C ${NOTE_W * 0.26} 3, ${NOTE_W * 0.52} 21, ${NOTE_W * 0.76} 9`}
                      fill="none"
                      stroke={rgba(HAND_INK, 0.7)}
                      strokeWidth={3.4}
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={
                        100 * (1 - interpolate(writeP, [0.45, 1], [0, 1], CLAMP))
                      }
                      filter="url(#fpp-hand-rough)"
                    />
                  </svg>
                </div>
              </>
            )}

            {/* ============== L10 · reflejo / luz de estudio sobre el papel */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: [
                  `linear-gradient(146deg, ${rgba('#FFFBEF', 0.42)} 0%, transparent 36%)`,
                  'linear-gradient(to bottom, transparent 44%, rgba(44,30,12,0.3) 100%)',
                  'radial-gradient(94% 86% at 44% 36%, transparent 44%, rgba(36,24,10,0.26) 100%)',
                  `linear-gradient(252deg, ${rgba(COOL_BLUE, 0.14)} 0%, transparent 32%)`,
                ].join(', '),
                maskImage: 'url(#fpp-edge-mask)',
                WebkitMaskImage: 'url(#fpp-edge-mask)',
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-34%',
                bottom: '-34%',
                left: 0,
                width: '34%',
                transform: `translateX(${interpolate(
                  frame,
                  [0, F],
                  [-40, 210],
                  CLAMP
                ).toFixed(1)}%) skewX(-15deg)`,
                background: `linear-gradient(100deg, transparent 20%, ${rgba(
                  '#FFF6DE',
                  0.5
                )} 50%, transparent 80%)`,
                mixBlendMode: 'screen',
                opacity: 0.06 + 0.32 * Math.sin(Math.min(1, settle) * Math.PI),
                pointerEvents: 'none',
              }}
            />
          </div>
        </AbsoluteFill>

        {/* ============================== polvo cercano (delante de la hoja) */}
        <AbsoluteFill style={{filter: 'blur(2.6px)', opacity: 0.7}}>
          <MotesLayer motes={dustNear} blur={0} scale={height / 1080} tint="255, 238, 206" />
        </AbsoluteFill>

        {/* ==================================== definiciones SVG (no dibujan) */}
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <defs>
            {/* bordes desgastados / esquinas irregulares de la hoja */}
            <filter id="fpp-edge-rough">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.011 0.019"
                numOctaves={4}
                seed={31}
                result="en"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="en"
                scale={18}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="fpp-edge-mask" maskContentUnits="userSpaceOnUse">
              <rect
                x={4}
                y={5}
                width={CARD_W - 8}
                height={CARD_H - 10}
                rx={4}
                fill="#fff"
                filter="url(#fpp-edge-rough)"
              />
            </mask>

            {/* borde del trazo de fibrón: nunca un rectángulo perfecto */}
            <filter id="fpp-rough" x="-8%" y="-45%" width="118%" height="190%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.026 0.11"
                numOctaves={3}
                seed={13}
                result="mk"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="mk"
                scale={13}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dsp"
              />
              <feGaussianBlur in="dsp" stdDeviation="0.9" />
            </filter>

            {/* sangrado del resaltador */}
            <filter id="fpp-bleed" x="-14%" y="-60%" width="128%" height="220%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02 0.08"
                numOctaves={2}
                seed={5}
                result="bn"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="bn"
                scale={16}
                xChannelSelector="R"
                yChannelSelector="G"
                result="bd"
              />
              <feGaussianBlur in="bd" stdDeviation="7" />
            </filter>

            {/* trazo a mano: la línea tiembla como una escrita de verdad */}
            <filter id="fpp-hand-rough" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.014"
                numOctaves={2}
                seed={19}
                result="hn"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="hn"
                scale={6}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* desgaste del sello */}
            <filter id="fpp-stamp-rough" x="-12%" y="-30%" width="124%" height="160%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.09"
                numOctaves={2}
                seed={3}
                result="sn"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="sn"
                scale={4}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* amarillo cálido del fibrón: no es plano, tiene carga de tinta */}
            <linearGradient id="fpp-yellow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rgba('#FFE87A', 0.72)} />
              <stop offset="42%" stopColor={rgba(MARK_YEL, 0.9)} />
              <stop offset="100%" stopColor={rgba(MARK_YEL_DEEP, 0.86)} />
            </linearGradient>
          </defs>
        </svg>

        {/* ================================================= L11 · viñeta final */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(128% 108% at 50% 50%, transparent 50%, rgba(2,2,4,0.62) 100%)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
      <GrainOverlay />
    </TransitionShell>
  );
};

export default FedPaper;
