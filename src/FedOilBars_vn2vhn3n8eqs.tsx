/* ############################################################################
 * FED_OILBARS — "la tabla que decide todo"
 *
 * Tabla animada tipo informe médico premium: una fila por aceite, barra doble
 * apilada (LINOLEICO dorado = repara la barrera · OLEICO frío = la desordena),
 * contadores numéricos que suben con la barra, línea de corte punteada que se
 * dibuja con stroke-dashoffset y destaque de la fila condenada (oliva 83% oleico).
 *
 * Capas (estilo After Effects, todas vivas — nada estático):
 *   L0  fondo por mood + wash de acento + viñeta + deriva de cámara
 *   L1  grilla técnica muy tenue (drift lento, enmascarada por radial)
 *   L2  bokeh grande fuera de foco
 *   L3  polvo fino
 *   L4  placa de encabezado: título + subtítulo serif + leyendas con chips
 *   L5  eje porcentual + gridlines de datos + hairline divisoria
 *   L6  filas: entrada escalonada con blur→foco + barras dobles apiladas
 *       (cada tramo con gradiente propio, borde interno, glow y specular móvil)
 *   L7  contadores numéricos con líder al tramo
 *   L8  línea de corte punteada (reveal por stroke-dashoffset + dashes que marchan)
 *   L9  destaque de la fila `highlight`: placa encendida + barrido dorado
 *   L10 placa de pie en serif itálica
 *   L11 GrainOverlay
 * ########################################################################## */

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
} from './FedererKit';

export type FedOilBarRow = {
  name: string;
  linoleic: number;
  oleic: number;
  bad?: boolean;
};

export type FedOilBarsProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  title?: string;
  sub?: string;
  legendA?: string;
  legendB?: string;
  rows?: FedOilBarRow[];
  highlight?: string;
  cutoff?: number;
  cutoffLabel?: string;
  foot?: string;
};

/* ------------------------------- geometría ------------------------------- */

const PAD_L = 96;
const NAME_X = 96;
const NAME_W = 424;
const TRACK_X = 548;
const TRACK_W = 1272;

const HEAD_Y = 54;
const DIV_Y = 202;
const ROWS_TOP = 244;
const ROW_H = 94;
const BAR_H = 42;
const BAR_DY = 34; // offset del tope de la barra dentro de la fila
const AXIS_Y = 912;
const FOOT_Y = 964;

const pxOf = (pct: number): number => (Math.max(0, pct) / 100) * TRACK_W;
const mod = (n: number, m: number): number => ((n % m) + m) % m;

/* `shade()` del kit devuelve `rgb(...)`, que NO se puede volver a meter en
 * rgba()/shade() (esperan hex y caen a negro). `tone()` hace lo mismo pero
 * devuelve HEX, así que compone. */
const tone = (hex: string, f: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.length === 6 ? full : '000000', 16);
  const ch = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * f)))
      .toString(16)
      .padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
};

const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

const DEFAULT_ROWS: FedOilBarRow[] = [
  {name: 'Girasol alto linoleico', linoleic: 60, oleic: 25},
  {name: 'Rosa mosqueta', linoleic: 45, oleic: 15},
  {name: 'Sésamo', linoleic: 40, oleic: 38},
  {name: 'Coco', linoleic: 2, oleic: 6},
  {name: 'Jojoba', linoleic: 0, oleic: 10},
  {name: 'Almendras', linoleic: 20, oleic: 72, bad: true},
  {name: 'Oliva', linoleic: 10, oleic: 75, bad: true},
];

/* ============================== UNA FILA =============================== */

const BarRow: React.FC<{
  row: FedOilBarRow;
  i: number;
  n: number;
  accent: string;
  cool: string;
  totalF: number;
  cutoff: number;
  isHi: boolean;
  anyHi: boolean;
  hl: number;
}> = ({row, i, n, accent, cool, totalF, cutoff, isHi, anyHi, hl}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const F = (f: number) => f * totalF;

  /* fase propia de cada fila (determinista, NUNCA Math.random) */
  const ph = random(`fedoilbars-${row.name}-${i}`) * Math.PI * 2;
  const spd = 0.86 + random(`fedoilbars-spd-${row.name}`) * 0.4;

  /* --- entrada escalonada desde la izquierda, blur → foco --- */
  const stag = Math.min(0.032, 0.22 / Math.max(1, n));
  const inStart = F(0.1 + i * stag);
  const s = spring({
    frame: frame - inStart,
    fps,
    config: {damping: 17, mass: 0.62, stiffness: 120},
    durationInFrames: Math.max(16, Math.round(F(0.2))),
  });
  const enter = interpolate(s, [0, 1], [0, 1], CLAMP);
  const rowX = (1 - enter) * -84;
  const rowBlur = (1 - enter) * 15;

  /* --- crecimiento de la barra --- */
  const growStart = inStart + F(0.035);
  const grow = interpolate(
    frame,
    [growStart, growStart + Math.max(14, F(0.22))],
    [0, 1],
    {...CLAMP, easing: Easing.out(Easing.cubic)}
  );

  const lPx = pxOf(row.linoleic) * grow;
  const oPx = pxOf(row.oleic) * grow;

  const lVal = Math.round(row.linoleic * grow);
  const oVal = Math.round(row.oleic * grow);

  /* --- posiciones de los contadores (se separan si los tramos son finos) --- */
  const bothShown = row.linoleic > 0 && row.oleic > 0;
  let cA = lPx / 2;
  let cB = lPx + oPx / 2;
  const MINSEP = 86;
  if (bothShown && cB - cA < MINSEP) {
    const mid = (cA + cB) / 2;
    cA = mid - MINSEP / 2;
    cB = mid + MINSEP / 2;
  }
  cA = Math.max(30, cA);
  cB = bothShown ? Math.max(cA + MINSEP, cB) : Math.max(30, cB);

  /* --- apagado de las filas que NO son la destacada --- */
  const dim = anyHi && !isHi ? hl : 0;
  const rowOpacity = enter * (1 - 0.48 * dim);
  const rowSat = 1 - 0.5 * dim;

  /* --- la destacada se agranda; el origen es la línea de corte para que la
         intersección con la punteada NO se desalinee --- */
  const CUT_X = TRACK_X + pxOf(cutoff);
  const hiScale = isHi ? 1 + 0.045 * hl : 1;
  const hiLift = isHi ? -3 * hl : 0;

  /* --- tachado de las filas malas --- */
  const badStart = growStart + F(0.14);
  const strike = row.bad
    ? interpolate(frame, [badStart, badStart + Math.max(9, F(0.1))], [0, 1], {
        ...CLAMP,
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  /* --- respiración permanente del glow (nada estático) --- */
  const puls = 0.5 + 0.5 * Math.sin(frame * 0.055 * spd + ph);
  const glowL = (0.2 + 0.16 * puls) * grow * (isHi ? 1.5 : 1);

  /* --- specular que recorre el tramo dorado --- */
  const specSpan = lPx + 260;
  const specX = specSpan > 0 ? mod(frame * 3.4 * spd + ph * 34, specSpan) - 170 : -999;

  /* --- barrido dorado que cruza la fila destacada --- */
  const sweepP = interpolate(hl, [0.15, 0.95], [0, 1], CLAMP);
  const sweepA = isHi ? Math.sin(sweepP * Math.PI) : 0;
  const sweepX = interpolate(sweepP, [0, 1], [-32, 108], CLAMP);

  const nameCol = isHi
    ? '#FBF6EC'
    : row.bad
    ? `rgba(206, 198, 188, ${0.5 + 0.12 * enter})`
    : 'rgba(238, 232, 222, 0.9)';

  const accHi = tone(accent, 1.28);
  const accLo = shade(accent, 0.62); // stop de gradiente: uso directo, no compone
  const coolHi = tone(cool, 1.25);
  const coolLo = shade(cool, 0.55);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: ROWS_TOP + i * ROW_H,
        height: ROW_H,
        opacity: rowOpacity,
        filter: `blur(${rowBlur.toFixed(2)}px) saturate(${rowSat.toFixed(2)})`,
        transform: `translate(${rowX.toFixed(1)}px, ${hiLift.toFixed(1)}px) scale(${hiScale.toFixed(4)})`,
        transformOrigin: `${CUT_X}px 50%`,
        willChange: 'transform, filter, opacity',
      }}
    >
      {/* ---------- placa de destaque + barrido ---------- */}
      {isHi && hl > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: NAME_X - 30,
            right: 68,
            top: 8,
            bottom: 4,
            borderRadius: 12,
            overflow: 'hidden',
            background: `linear-gradient(96deg, ${rgba(accent, 0.13 * hl)} 0%, ${rgba(
              accent,
              0.04 * hl
            )} 46%, rgba(0,0,0,0) 100%)`,
            border: `1px solid ${rgba(accent, 0.16 + 0.34 * hl)}`,
            boxShadow: `0 0 ${(46 * hl).toFixed(0)}px ${rgba(
              accent,
              0.2 * hl
            )}, inset 0 1px 0 ${rgba(accent, 0.16 * hl)}`,
            pointerEvents: 'none',
          }}
        >
          {sweepA > 0.01 && (
            <div
              style={{
                position: 'absolute',
                top: '-40%',
                bottom: '-40%',
                left: 0,
                width: '34%',
                transform: `translateX(${sweepX.toFixed(1)}%) skewX(-15deg)`,
                background: `linear-gradient(100deg, transparent 18%, ${rgba(
                  accent,
                  0.5
                )} 50%, transparent 82%)`,
                mixBlendMode: 'screen',
                opacity: sweepA,
              }}
            />
          )}
        </div>
      )}

      {/* ---------- marcador de fila (barrita a la izquierda del nombre) ---------- */}
      <div
        style={{
          position: 'absolute',
          left: NAME_X - 20,
          top: BAR_DY + 4,
          width: 3,
          height: BAR_H - 8,
          borderRadius: 2,
          background: row.bad
            ? rgba(cool, 0.42)
            : `linear-gradient(180deg, ${rgba(accent, 0.9)}, ${rgba(accent, 0.15)})`,
          boxShadow: isHi ? `0 0 12px ${rgba(accent, 0.6 * hl)}` : 'none',
          opacity: enter,
        }}
      />

      {/* ---------- nombre ---------- */}
      <div
        style={{
          position: 'absolute',
          left: NAME_X,
          top: BAR_DY - 6,
          width: NAME_W,
          height: BAR_H + 12,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            position: 'relative',
            fontFamily: FONT_SANS,
            fontSize: isHi ? 37 : 35,
            fontWeight: row.bad ? 500 : 600,
            letterSpacing: -0.4,
            lineHeight: 1.06,
            color: nameCol,
            textShadow: isHi
              ? `0 2px 18px rgba(0,0,0,0.8), 0 0 ${(20 * hl).toFixed(0)}px ${rgba(accent, 0.4 * hl)}`
              : '0 2px 14px rgba(0,0,0,0.75)',
          }}
        >
          {row.name}
          {/* tachado que se dibuja */}
          {row.bad && strike > 0.001 && (
            <span
              style={{
                position: 'absolute',
                left: -6,
                right: -6,
                top: '52%',
                height: 3,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${rgba(coolHi, 0.95)}, ${rgba(
                  coolHi,
                  0.62
                )})`,
                boxShadow: `0 0 12px ${rgba(coolHi, 0.55)}, 0 1px 3px rgba(0,0,0,0.8)`,
                transform: `scaleX(${strike.toFixed(3)})`,
                transformOrigin: '0% 50%',
              }}
            />
          )}
        </span>
      </div>

      {/* ---------- pista de la barra ---------- */}
      <div
        style={{
          position: 'absolute',
          left: TRACK_X,
          top: BAR_DY,
          width: TRACK_W,
          height: BAR_H,
          borderRadius: 7,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* rayado técnico dentro de la pista */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 42px)',
            opacity: 0.5,
            transform: `translateX(${(mod(frame * 0.22, 42) - 42).toFixed(2)}px)`,
          }}
        />

        {/* ---------- tramo LINOLEICO (dorado, repara) ---------- */}
        {lPx > 0.5 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: BAR_H,
              width: lPx,
              borderRadius: '7px 3px 3px 7px',
              overflow: 'hidden',
              background: `linear-gradient(180deg, ${accHi} 0%, ${accent} 42%, ${accLo} 100%)`,
              boxShadow: `inset 0 1px 0 ${rgba('#FFFFFF', 0.42)}, inset 0 -2px 6px ${rgba(
                '#000000',
                0.32
              )}, inset 0 0 0 1px ${rgba(accHi, 0.55)}, 0 0 ${(26 * glowL + 8).toFixed(
                0
              )}px ${rgba(accent, glowL)}`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                bottom: '-50%',
                left: 0,
                width: 120,
                transform: `translateX(${specX.toFixed(1)}px) skewX(-16deg)`,
                background:
                  'linear-gradient(100deg, transparent 12%, rgba(255,248,228,0.55) 50%, transparent 88%)',
                mixBlendMode: 'screen',
                opacity: 0.75,
              }}
            />
          </div>
        )}

        {/* ---------- tramo OLEICO (frío, desordena) ---------- */}
        {oPx > 0.5 && (
          <div
            style={{
              position: 'absolute',
              left: lPx,
              top: 0,
              height: BAR_H,
              width: oPx,
              borderRadius: lPx > 0.5 ? '3px 7px 7px 3px' : '7px',
              overflow: 'hidden',
              background: `linear-gradient(180deg, ${coolHi} 0%, ${cool} 46%, ${coolLo} 100%)`,
              boxShadow: `inset 0 1px 0 ${rgba('#FFFFFF', 0.22)}, inset 0 -2px 6px ${rgba(
                '#000000',
                0.4
              )}, inset 0 0 0 1px ${rgba(coolHi, 0.38)}, 0 0 ${(14 * grow).toFixed(
                0
              )}px ${rgba(cool, 0.16 * grow)}`,
            }}
          >
            {/* textura de "láminas desordenadas" */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'repeating-linear-gradient(114deg, rgba(255,255,255,0.09) 0px, rgba(255,255,255,0.09) 2px, transparent 2px, transparent 11px)',
                transform: `translateX(${(mod(frame * 0.5, 11) - 11).toFixed(2)}px)`,
                opacity: 0.85,
              }}
            />
          </div>
        )}

        {/* cabeza luminosa del frente de la barra mientras crece */}
        {grow > 0.02 && grow < 0.995 && (
          <div
            style={{
              position: 'absolute',
              left: lPx + oPx - 2,
              top: -4,
              width: 4,
              height: BAR_H + 8,
              background: 'rgba(255,255,255,0.85)',
              boxShadow: `0 0 22px 5px ${rgba(oPx > 0.5 ? cool : accent, 0.75)}`,
              opacity: interpolate(grow, [0.9, 0.995], [1, 0], CLAMP),
            }}
          />
        )}
      </div>

      {/* ---------- contadores numéricos ---------- */}
      {row.linoleic > 0 && (
        <Counter
          x={TRACK_X + cA}
          v={lVal}
          color={tone(accent, 1.2)}
          glow={rgba(accent, 0.55)}
          opacity={enter * Math.min(1, grow * 3)}
          big={isHi}
          leaderH={BAR_DY - 30}
        />
      )}
      {row.oleic > 0 && (
        <Counter
          x={TRACK_X + cB}
          v={oVal}
          color={tone(cool, 1.35)}
          glow={rgba(cool, 0.4)}
          opacity={enter * Math.min(1, grow * 3)}
          big={isHi}
          leaderH={BAR_DY - 30}
        />
      )}
    </div>
  );
};

/* ---------------------------- contador + líder ---------------------------- */

const Counter: React.FC<{
  x: number;
  v: number;
  color: string;
  glow: string;
  opacity: number;
  big: boolean;
  leaderH: number;
}> = ({x, v, color, glow, opacity, big, leaderH}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 0,
      width: 0,
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: -70,
        width: 140,
        top: 0,
        textAlign: 'center',
        fontFamily: FONT_SANS,
        fontSize: big ? 28 : 25,
        fontWeight: 700,
        letterSpacing: 0.2,
        color,
        textShadow: `0 2px 12px rgba(0,0,0,0.85), 0 0 16px ${glow}`,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}
    >
      {v}
      <span style={{fontSize: big ? 18 : 16, opacity: 0.72, marginLeft: 2}}>%</span>
    </div>
    <div
      style={{
        position: 'absolute',
        left: -0.5,
        top: big ? 32 : 30,
        width: 1,
        height: Math.max(2, leaderH),
        background: `linear-gradient(180deg, ${glow}, rgba(255,255,255,0))`,
      }}
    />
  </div>
);

/* ============================ COMPONENTE PRINCIPAL ======================== */

export const FedOilBars: React.FC<FedOilBarsProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'science',
  title = 'La tabla que lo decide todo',
  sub = 'No es el precio ni la marca: es la proporción entre dos grasas',
  legendA = 'Linoleico · repara',
  legendB = 'Oleico · desordena',
  rows = DEFAULT_ROWS,
  highlight = 'Oliva',
  cutoff = 35,
  cutoffLabel = 'mínimo útil',
  foot = 'Cuanto más linoleico, mejor arma el remache de la barrera.',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const F = (f: number) => f * totalF;
  const cool = tone(COOL_BLUE, 0.68); // frío y apagado: el que desordena

  const data = rows.length ? rows : DEFAULT_ROWS;
  const n = data.length;
  const hiKey = highlight ? norm(highlight) : '';
  const hiIdx = hiKey ? data.findIndex((r) => norm(r.name).includes(hiKey)) : -1;
  const anyHi = hiIdx >= 0;

  /* --------- cámara: push-in lentísimo + micro deriva (nada estático) ------- */
  const push = interpolate(frame, [0, totalF], [1.012, 1.038], CLAMP);
  const camX = Math.sin(frame * 0.017) * width * 0.0016;
  const camY = Math.cos(frame * 0.0225) * height * 0.0013;

  /* ------------------------------ tiempos --------------------------------- */
  const head = interpolate(frame, [F(0.02), F(0.15)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const legend = interpolate(frame, [F(0.06), F(0.2)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const axis = interpolate(frame, [F(0.12), F(0.28)], [0, 1], CLAMP);
  const draw = interpolate(frame, [F(0.3), F(0.48)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cutChip = interpolate(frame, [F(0.4), F(0.52)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const hl = anyHi
    ? interpolate(frame, [F(0.58), F(0.76)], [0, 1], {
        ...CLAMP,
        easing: Easing.inOut(Easing.cubic),
      })
    : 0;
  const footP = interpolate(frame, [F(0.76), F(0.88)], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  /* ----------------------------- partículas -------------------------------- */
  const bokeh = React.useMemo(
    () => makeMotes(6, 'oilbars-bok', 130, 280, 0.008, 0.022, 0.035, 0.085),
    []
  );
  const dust = React.useMemo(
    () => makeMotes(22, 'oilbars-dust', 2, 7, 0.05, 0.11, 0.1, 0.3),
    []
  );

  /* ------------------------------ geometría -------------------------------- */
  const rowsBottom = ROWS_TOP + n * ROW_H;
  const CUT_X = TRACK_X + pxOf(cutoff);
  const cutTop = ROWS_TOP - 22;
  const cutBot = rowsBottom + 4;
  const cutLen = cutBot - cutTop;

  const TICKS = [0, 20, 40, 60, 80, 100];

  const accBright = tone(accent, 1.2);

  return (
    <AbsoluteFill style={{background: '#04070d', overflow: 'hidden'}}>
      <TransitionShell accent={accent} totalF={totalF} variant={variant}>
        {/* ===================== L0 · fondo + wash + viñeta ===================== */}
        <AbsoluteFill style={{background: '#04070d', overflow: 'hidden'}}>
        <AbsoluteFill
          style={{
            background: moodBg(mood, accent),
            transform: `scale(${push.toFixed(4)}) translate(${(camX * 2).toFixed(
              1
            )}px, ${(camY * 2).toFixed(1)}px)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(58% 46% at 22% 24%, ${rgba(accent, 0.12)} 0%, transparent 64%)`,
              `radial-gradient(52% 42% at 84% 78%, ${rgba(TEAL, 0.075)} 0%, transparent 66%)`,
              'radial-gradient(126% 104% at 50% 46%, transparent 40%, rgba(1,3,8,0.9) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.55) 0%, transparent 20%, transparent 74%, rgba(2,4,10,0.8) 100%)',
            ].join(', '),
          }}
        />

        {/* =================== L1 · grilla técnica muy tenue =================== */}
        <AbsoluteFill
          style={{
            backgroundImage: [
              'linear-gradient(to right, rgba(180,208,232,0.06) 1px, transparent 1px)',
              'linear-gradient(to bottom, rgba(180,208,232,0.05) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '72px 72px, 72px 72px',
            transform: `translate(${(mod(frame * 0.16, 72) - 72).toFixed(2)}px, ${(
              mod(-frame * 0.1, 72) - 72
            ).toFixed(2)}px)`,
            WebkitMaskImage:
              'radial-gradient(78% 66% at 50% 46%, rgba(0,0,0,0.95) 0%, transparent 82%)',
            maskImage:
              'radial-gradient(78% 66% at 50% 46%, rgba(0,0,0,0.95) 0%, transparent 82%)',
            opacity: 0.55 + 0.12 * Math.sin(frame * 0.031),
            pointerEvents: 'none',
          }}
        />

        {/* ========================== L2 · bokeh ============================== */}
        <MotesLayer motes={bokeh} blur={26} scale={height / 1080} tint="238, 206, 148" />

        {/* ========================== L3 · polvo ============================== */}
        <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="228, 216, 190" />

        {/* ====== contenido: leve parallax opuesto al fondo (profundidad) ====== */}
        <AbsoluteFill
          style={{
            transform: `translate(${(-camX * 0.9).toFixed(1)}px, ${(-camY * 0.9).toFixed(
              1
            )}px)`,
          }}
        >
          {/* ============ L4 · placa de encabezado + leyendas ============ */}
          <div
            style={{
              position: 'absolute',
              left: PAD_L - 30,
              top: HEAD_Y - 14,
              width: 1920 - 2 * (PAD_L - 30),
              height: DIV_Y - HEAD_Y - 10,
              borderRadius: 14,
              background:
                'linear-gradient(160deg, rgba(12,20,30,0.5) 0%, rgba(4,8,14,0.24) 62%, rgba(4,8,14,0) 100%)',
              border: `1px solid ${rgba(accent, 0.1 + 0.06 * head)}`,
              boxShadow: '0 24px 60px rgba(0,0,0,0.42)',
              opacity: head,
              transform: `translateY(${((1 - head) * -16).toFixed(1)}px)`,
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* título — reveal por máscara horizontal */}
          <div
            style={{
              position: 'absolute',
              left: PAD_L,
              top: HEAD_Y,
              width: 1080,
              clipPath: `inset(0 ${((1 - head) * 100).toFixed(1)}% 0 0)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 55,
                fontWeight: 700,
                letterSpacing: -1,
                lineHeight: 1.04,
                color: '#F5F0E6',
                textShadow: `0 4px 26px rgba(0,0,0,0.8), 0 0 40px ${rgba(accent, 0.16)}`,
                transform: `translateY(${((1 - head) * 12).toFixed(1)}px)`,
              }}
            >
              {title}
            </div>
          </div>

          {/* subtítulo serif itálica */}
          <div
            style={{
              position: 'absolute',
              left: PAD_L,
              top: HEAD_Y + 74,
              width: 1080,
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontSize: 28,
              lineHeight: 1.24,
              color: 'rgba(226, 218, 205, 0.74)',
              opacity: interpolate(head, [0.35, 1], [0, 1], CLAMP),
              transform: `translateY(${((1 - head) * 10).toFixed(1)}px)`,
              textShadow: '0 2px 14px rgba(0,0,0,0.8)',
            }}
          >
            {sub}
          </div>

          {/* ================= L4b · leyendas con chip de color ================= */}
          <div
            style={{
              position: 'absolute',
              right: PAD_L,
              top: HEAD_Y + 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'flex-end',
            }}
          >
            {[
              {t: legendA, c: accent, i: 0},
              {t: legendB, c: cool, i: 1},
            ].map((lg) => {
              const p = interpolate(legend, [lg.i * 0.28, 0.72 + lg.i * 0.28], [0, 1], CLAMP);
              const pulse = 0.5 + 0.5 * Math.sin(frame * 0.06 - lg.i * 1.7);
              return (
                <div
                  key={lg.i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    opacity: p,
                    transform: `translateX(${((1 - p) * 34).toFixed(1)}px)`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 23,
                      fontWeight: 600,
                      letterSpacing: 1.4,
                      textTransform: 'uppercase',
                      color:
                        lg.i === 0 ? rgba(accBright, 0.96) : 'rgba(186, 202, 224, 0.7)',
                      textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lg.t}
                  </div>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 5,
                      background: `linear-gradient(160deg, ${tone(lg.c, 1.3)}, ${shade(
                        lg.c,
                        0.58
                      )})`,
                      boxShadow:
                        lg.i === 0
                          ? `inset 0 1px 0 rgba(255,255,255,0.45), 0 0 ${(
                              10 +
                              12 * pulse
                            ).toFixed(0)}px ${rgba(lg.c, 0.35 + 0.25 * pulse)}`
                          : 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 10px rgba(0,0,0,0.5)',
                      flexShrink: 0,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* ============ L5 · hairline divisoria + gridlines + eje ============ */}
          <div
            style={{
              position: 'absolute',
              left: PAD_L - 30,
              top: DIV_Y,
              height: 1,
              width: (1920 - 2 * (PAD_L - 30)) * interpolate(head, [0.2, 1], [0, 1], CLAMP),
              background: `linear-gradient(90deg, ${rgba(accent, 0.55)} 0%, ${rgba(
                accent,
                0.16
              )} 46%, rgba(255,255,255,0.05) 100%)`,
              boxShadow: `0 0 14px ${rgba(accent, 0.22)}`,
            }}
          />

          {TICKS.map((t, k) => {
            const x = TRACK_X + pxOf(t);
            const p = interpolate(axis, [k * 0.1, 0.5 + k * 0.1], [0, 1], CLAMP);
            return (
              <React.Fragment key={t}>
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: ROWS_TOP - 8,
                    width: 1,
                    height: (rowsBottom - ROWS_TOP + 6) * p,
                    background:
                      'linear-gradient(180deg, rgba(190,214,236,0.13), rgba(190,214,236,0.03))',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: x - 40,
                    width: 80,
                    top: AXIS_Y,
                    textAlign: 'center',
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: 1.6,
                    color: 'rgba(196, 210, 228, 0.4)',
                    opacity: p,
                  }}
                >
                  {t}
                  {t === 100 ? '%' : ''}
                </div>
              </React.Fragment>
            );
          })}
          {/* línea base del eje */}
          <div
            style={{
              position: 'absolute',
              left: TRACK_X,
              top: AXIS_Y - 12,
              height: 1,
              width: TRACK_W * axis,
              background:
                'linear-gradient(90deg, rgba(190,214,236,0.22), rgba(190,214,236,0.05))',
            }}
          />

          {/* ===================== L6+L7 · filas con barras ===================== */}
          {data.map((r, i) => (
            <BarRow
              key={r.name + i}
              row={r}
              i={i}
              n={n}
              accent={accent}
              cool={cool}
              totalF={totalF}
              cutoff={cutoff}
              isHi={i === hiIdx}
              anyHi={anyHi}
              hl={hl}
            />
          ))}

          {/* ============ L8 · línea de corte (stroke-dashoffset) ============ */}
          <svg
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible'}}
          >
            <defs>
              {/* el reveal REAL: una línea sólida que se dibuja por dashoffset
                  y hace de máscara sobre la punteada visible */}
              <mask id="fedOilBarsCutMask" maskUnits="userSpaceOnUse">
                <line
                  x1={CUT_X}
                  y1={cutTop}
                  x2={CUT_X}
                  y2={cutBot}
                  stroke="#fff"
                  strokeWidth={64}
                  strokeDasharray={`${cutLen} ${cutLen}`}
                  strokeDashoffset={cutLen * (1 - draw)}
                />
              </mask>
              {/* userSpaceOnUse: en una línea VERTICAL el bounding box tiene
                  ancho 0 y un gradiente objectBoundingBox no pinta nada */}
              <linearGradient
                id="fedOilBarsCutGrad"
                gradientUnits="userSpaceOnUse"
                x1={CUT_X}
                y1={cutTop}
                x2={CUT_X}
                y2={cutBot}
              >
                <stop offset="0%" stopColor={accBright} stopOpacity={1} />
                <stop offset="55%" stopColor={accent} stopOpacity={0.85} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.45} />
              </linearGradient>
            </defs>

            {/* halo suave de la línea */}
            <g mask="url(#fedOilBarsCutMask)">
              <line
                x1={CUT_X}
                y1={cutTop}
                x2={CUT_X}
                y2={cutBot}
                stroke={rgba(accent, 0.3)}
                strokeWidth={9}
                style={{filter: 'blur(7px)'}}
              />
              {/* la punteada: los guiones MARCHAN por dashoffset (siempre viva) */}
              <line
                x1={CUT_X}
                y1={cutTop}
                x2={CUT_X}
                y2={cutBot}
                stroke="url(#fedOilBarsCutGrad)"
                strokeWidth={2.6}
                strokeDasharray="13 12"
                strokeDashoffset={-mod(frame * 0.5, 25)}
                strokeLinecap="round"
              />
            </g>

            {/* cabeza luminosa que baja mientras se dibuja */}
            {draw > 0.005 && draw < 0.995 && (
              <circle
                cx={CUT_X}
                cy={cutTop + cutLen * draw}
                r={4.5}
                fill="#FFF6E2"
                opacity={interpolate(draw, [0, 0.06, 0.9, 0.995], [0, 1, 1, 0], CLAMP)}
                style={{filter: `drop-shadow(0 0 12px ${rgba(accent, 0.95)})`}}
              />
            )}
          </svg>

          {/* chip de la línea de corte, montado sobre la divisoria */}
          <div
            style={{
              position: 'absolute',
              left: CUT_X,
              top: DIV_Y - 15,
              transform: `translateX(-50%) translateY(${((1 - cutChip) * -10).toFixed(1)}px)`,
              opacity: cutChip,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '5px 15px 6px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
              background:
                'linear-gradient(180deg, rgba(14,22,32,0.94), rgba(5,9,16,0.96))',
              border: `1px solid ${rgba(accent, 0.42)}`,
              boxShadow: `0 8px 26px rgba(0,0,0,0.7), 0 0 ${(
                16 +
                10 * (0.5 + 0.5 * Math.sin(frame * 0.07))
              ).toFixed(0)}px ${rgba(accent, 0.24)}`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: accBright,
                boxShadow: `0 0 10px ${rgba(accent, 0.9)}`,
              }}
            />
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: 2.6,
                textTransform: 'uppercase',
                color: rgba(accBright, 0.94),
              }}
            >
              {cutoffLabel}
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 19,
                fontWeight: 700,
                color: 'rgba(226,220,208,0.5)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(cutoff)}%
            </div>
          </div>

          {/* ==================== L10 · placa de pie (serif) ==================== */}
          {foot ? (
            <div
              style={{
                position: 'absolute',
                left: PAD_L - 30,
                right: PAD_L - 30,
                top: FOOT_Y,
                display: 'flex',
                justifyContent: 'center',
                opacity: footP,
                transform: `translateY(${((1 - footP) * 16).toFixed(1)}px)`,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '13px 40px 15px 46px',
                  borderRadius: 10,
                  background:
                    'linear-gradient(180deg, rgba(10,17,26,0.62), rgba(4,8,14,0.84))',
                  border: `1px solid ${rgba(accent, 0.2)}`,
                  boxShadow: '0 18px 46px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  clipPath: `inset(0 ${((1 - footP) * 50).toFixed(1)}% 0 ${(
                    (1 - footP) *
                    50
                  ).toFixed(1)}% round 10px)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 14,
                    bottom: 14,
                    width: 3,
                    borderRadius: 2,
                    background: `linear-gradient(180deg, ${rgba(accent, 0.95)}, ${rgba(
                      accent,
                      0.15
                    )})`,
                    boxShadow: `0 0 12px ${rgba(accent, 0.5)}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontSize: 29,
                    lineHeight: 1.24,
                    color: 'rgba(232, 225, 212, 0.88)',
                    textShadow: '0 2px 14px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {foot}
                </div>
              </div>
            </div>
          ) : null}
        </AbsoluteFill>

          {/* bokeh de primer plano fuera de foco (profundidad real) */}
          <AbsoluteFill style={{filter: 'blur(20px)', opacity: 0.38, pointerEvents: 'none'}}>
            <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="246, 218, 168" />
          </AbsoluteFill>
        </AbsoluteFill>
      </TransitionShell>

      {/* ============================ L11 · grano ============================ */}
      <GrainOverlay />
    </AbsoluteFill>
  );
};

export default FedOilBars;
