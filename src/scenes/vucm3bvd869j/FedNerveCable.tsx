/* ############################################################################
 * FED_NERVE_CABLE — "EL CABLE DE UN METRO" · por qué se apaga LA PUNTA
 *
 *   IDEA: el nervio que llega al pie no es un cablecito; es un CABLE de casi
 *   un metro que sale de la columna baja y termina en la punta de los dedos.
 *   Cuando falta combustible NO se apaga el cable entero: se apaga la PUNTA,
 *   siempre la punta primero, porque es lo último de la línea.
 *   La escena lo hace VER: el pulso viaja de arriba hacia abajo y llega cada
 *   vez más débil; en el último tramo la cubierta se abre y quedan chispazos.
 *
 *   GUION VISUAL (TODO en fracciones del hold = totalF - FED_WHIP_F):
 *     0.00–0.14  fondo dark-cinematic + cabecera (kicker + título con hot)
 *     0.02–0.18  bajan las VÉRTEBRAS de la columna baja, una por una
 *     0.04–0.30  se DIBUJA la silueta de la pierna (traza + relleno)
 *     0.08–0.40  el CABLE se dibuja de la columna a los dedos (reveal por
 *                máscara sobre el propio trazo: recorre el camino real)
 *     0.16–0.36  la REGLA se dibuja al costado, ticks con stagger
 *     0.30–0.44  rótulo de RAÍZ con línea guía fina + marca "≈ 1 m"
 *     0.28–0.99  PULSOS repetidos con estela: cada uno llega MÁS DÉBIL
 *                (decaimiento por pulso × atenuación por distancia)
 *     0.56–0.80  la PUNTA se pela: la cubierta se abre en escamas y la
 *                máscara de la vaina se disuelve en el último ~15%
 *     0.62–1.00  CHISPAZOS cortos e irregulares sobre el tramo pelado
 *     0.70–0.88  rótulo de PUNTA con guía quebrada + sub en serif
 *
 *   CAPAS
 *     L0  moodBg + luz de acento + piso
 *     L1  motas en suspensión (dos profundidades)
 *     L2  resplandor detrás de la pierna
 *     L3  columna (vértebras) + regla de "≈ 1 m" + guías punteadas
 *     L4  silueta de la pierna (relleno + traza + luz de borde)
 *     L5  cable: vaina segmentada (con máscara de pelado) + núcleo
 *     L6  pulsos con estela (copia difusa + copia nítida)
 *     L7  escamas de la cubierta abierta + chispazos
 *     L8  rótulos raíz/punta con líneas guía
 *     L9  bloque de texto (kicker + título hot + regla + sub)
 *     L10 viñeta + grano
 *
 *   Se ve completa con totalF=100 y con totalF=240. Sin archivos de public/.
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
  COOL_BLUE,
  DEFAULT_ACCENT,
  FED_SCENE_F,
  FED_WHIP_F,
  FONT_SANS,
  FONT_SERIF,
  GrainOverlay,
  Kicker,
  MotesLayer,
  TEAL,
  TransitionShell,
  Words,
  makeMotes,
  moodBg,
  rgba,
  type FedMood,
  type FedTransitionVariant,
} from '../../FedererKit';

/* ------------------------------------------------------------------ tipos */

export type FedNerveCableProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  kicker?: string;
  title?: string;
  hot?: string[];
  sub?: string;
  tipLabel?: string;
  rootLabel?: string;
};

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;

/** caja del esquema dentro del escenario (viewBox 1:1 con píxeles) */
const DIA_X = 80;
const DIA_Y = 20;
const DIA_W = 680;
const DIA_H = 1040;

/** el dibujo de la pierna se autoró en coordenadas "crudas" 0..370 × 0..950 */
const LEG_DX = 140;
const LEG_DY = 130;
const LEG_K = 0.8;

/** cruda → svg del esquema */
const sx = (x: number) => LEG_DX + x * LEG_K;
const sy = (y: number) => LEG_DY + y * LEG_K;

/** svg del esquema → escenario */
const gx = (x: number) => DIA_X + x;
const gy = (y: number) => DIA_Y + y;

/* silueta de pierna de perfil, dedos hacia la izquierda. 100% a mano. */
const LEG_D = [
  'M 370 0',
  'C 372 120 360 260 350 380',
  'C 344 430 352 470 362 520',
  'C 372 580 356 660 336 730',
  'C 322 780 308 820 302 862',
  'C 300 890 300 906 298 918',
  'C 296 938 284 950 262 950',
  'L 150 950',
  'C 118 950 92 946 74 938',
  'C 62 932 58 920 70 914',
  'C 92 900 128 886 156 868',
  'C 176 856 186 840 190 820',
  'C 196 760 200 690 206 620',
  'C 210 540 212 470 216 410',
  'C 219 368 214 330 210 300',
  'C 202 200 190 100 176 0',
  'Z',
].join(' ');

/* el nervio: sale por encima de la cadera y muere en la punta del dedo */
const CABLE_D = [
  'M 300 -6',
  'C 296 110 282 250 270 372',
  'C 262 452 256 522 252 600',
  'C 248 690 244 772 240 838',
  'C 236 878 214 906 176 918',
  'C 148 927 122 930 100 932',
].join(' ');

/** puntos MUESTREADOS sobre el último tramo del cable (crudos).
 *  Son el ~15% final: ahí se pela la cubierta y saltan las chispas. */
const TIP_PTS: [number, number][] = [
  [240, 838],
  [232, 860],
  [221, 889],
  [200, 908],
  [176, 918],
  [155, 923],
  [136, 928],
  [116, 930],
  [100, 932],
];

/** ángulo local del cable en cada muestra (grados) */
const TIP_ANG = TIP_PTS.map((p, i) => {
  const q = TIP_PTS[Math.min(TIP_PTS.length - 1, i + 1)];
  const r = TIP_PTS[Math.max(0, i - 1)];
  return (Math.atan2(q[1] - r[1], q[0] - r[0]) * 180) / Math.PI;
});

/* anclas en coordenadas del esquema */
const ROOT_SVG: [number, number] = [sx(300), sy(-6)];
const TIP_SVG: [number, number] = [sx(100), sy(932)];

/* regla lateral */
const RULE_X = 48;
const RULE_Y0 = ROOT_SVG[1];
const RULE_Y1 = TIP_SVG[1];

/* bloque de texto */
const TEXT_X = 880;
const TEXT_W = 960;

const EASE_SOFT = Easing.out(Easing.cubic);
const EASE_MOVE = Easing.bezier(0.24, 0.9, 0.18, 1);

/* ------------------------------------------------------------------ color */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.length === 6 ? full : '000000', 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const hex2 = (v: number) =>
  Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');

const toHex = (c: [number, number, number]) => `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}`;

/** aclara/oscurece devolviendo HEX (shade() del kit devuelve rgb(), y ese
 *  formato ya no se puede volver a pasar por rgba()) */
const tone = (hex: string, f: number): string => {
  const c = toRgb(hex);
  return toHex([c[0] * f, c[1] * f, c[2] * f]);
};

const mixHex = (a: string, b: string, t: number): string => {
  const k = clamp01(t);
  const ca = toRgb(a);
  const cb = toRgb(b);
  return toHex([
    ca[0] + (cb[0] - ca[0]) * k,
    ca[1] + (cb[1] - ca[1]) * k,
    ca[2] + (cb[2] - ca[2]) * k,
  ]);
};

const SKIN_HI = '#16283C';
const SKIN_LO = '#04080F';
const SHEATH_A = '#1E2B3A';
const SHEATH_B = '#40586F';

/* ================================ COMPONENTE ============================== */

export const FedNerveCable: React.FC<FedNerveCableProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'science',
  kicker = 'Anatomía · nervio periférico',
  title = 'El cable que llega al pie mide casi un metro',
  hot = ['casi', 'un', 'metro'],
  sub = 'Cuando falta combustible no se apaga el cable entero: se apaga la punta.',
  tipLabel = 'Se apaga acá primero',
  rootLabel = 'Sale de la columna',
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  const T = Math.max(60, totalF);
  const HOLD = Math.max(40, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const sec = (f: number) => at(f) / fps;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});

  /* ---- ventanas de tiempo (todas fracciones del hold) -------------------- */
  const spineP = ip(0.02, 0.18);
  const legP = ip(0.04, 0.3, EASE_MOVE);
  const legFillP = ip(0.06, 0.34);
  const cableP = ip(0.08, 0.4, EASE_MOVE);
  const sheathP = ip(0.18, 0.44);
  const ruleP = ip(0.16, 0.36, EASE_MOVE);
  const tickP = ip(0.2, 0.42);
  const meterP = ip(0.34, 0.46);
  const rootP = ip(0.3, 0.44);
  const peelP = ip(0.56, 0.8, EASE_MOVE);
  const sparkP = ip(0.62, 0.74);
  const tipP = ip(0.7, 0.88);
  /* el rótulo de la punta entra con snap: es el remate de la escena */
  const tipPop = clamp01(
    spring({
      frame: frame - at(0.7),
      fps,
      config: {damping: 13, stiffness: 155, mass: 0.7},
      durationInFrames: Math.max(12, Math.round(HOLD * 0.18)),
    })
  );
  const textRuleP = ip(0.4, 0.56);
  const subP = ip(0.46, 0.62);

  /* ---- pulsos: cuántos y cuándo, siempre por fracción -------------------- */
  const nPulse = HOLD >= 150 ? 4 : 3;
  const PW0 = 0.28;
  const PW1 = 0.99;
  const travel = Math.min(0.32, ((PW1 - PW0) / nPulse) * 1.5);
  const pStart = (i: number) =>
    PW0 + ((PW1 - PW0 - travel) * i) / Math.max(1, nPulse - 1);

  /** el pulso pierde fuerza con la distancia: al final del cable casi no llega */
  const atten = (pos: number) => 1 - 0.88 * clamp01((pos - 0.34) / 0.52);

  /* ---- cámara ------------------------------------------------------------ */
  const push = interpolate(frame, [0, T], [1.012, 1.052], CLAMP);
  const camX = Math.sin(frame * 0.0138) * 5.2;
  const camY = Math.cos(frame * 0.0181) * 3.8;
  const stageScale = (width / STAGE_W) * push;

  const farMotes = React.useMemo(
    () => makeMotes(14, 'fednerve-far', 4, 10, 0.045, 0.09, 0.1, 0.26),
    []
  );
  const midMotes = React.useMemo(
    () => makeMotes(11, 'fednerve-mid', 2, 5.2, 0.028, 0.07, 0.2, 0.5),
    []
  );
  const moteTint = mood === 'gold' || mood === 'warmdark' ? '240, 208, 150' : '176, 208, 246';

  /* ---- respiración de la pierna (nada queda quieto) ---------------------- */
  const breath = Math.sin(frame * 0.036);

  /* ---- chispazos: ráfagas cortas e irregulares ---------------------------- */
  const burstF = Math.max(2, Math.round(HOLD * 0.035));
  const burst = Math.floor(frame / burstF);
  const burstPh = (frame % burstF) / burstF;
  const burstEnv = Math.sin(burstPh * Math.PI);

  /* ========================= dibujo: pulso con estela ====================== */

  const pulseNodes = React.useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let i = 0; i < nPulse; i++) {
      const s0 = pStart(i);
      const s1 = s0 + travel;
      const head = interpolate(frame, [at(s0), at(s1)], [0, 1], {
        ...CLAMP,
        easing: Easing.bezier(0.32, 0, 0.62, 1),
      });
      if (head <= 0 || head >= 0.999) continue;

      /* cada pulso siguiente sale más flojo que el anterior */
      const decay = Math.max(0.2, 1 - 0.32 * i);
      const born = interpolate(frame, [at(s0), at(s0) + 2], [0, 1], CLAMP);

      const K = 10;
      const seg = 0.015;
      const pieces: React.ReactNode[] = [];
      for (let k = 0; k < K; k++) {
        const pos = head - k * seg * 1.06;
        if (pos < -seg) continue;
        const a = atten(pos) * decay;
        if (a <= 0.012) continue;
        const tail = Math.pow(1 - k / K, 1.7);
        pieces.push(
          <path
            key={`s-${k}`}
            d={CABLE_D}
            pathLength={1}
            fill="none"
            stroke={k === 0 ? mixHex('#FFFFFF', accent, 0.28) : accent}
            strokeWidth={(k === 0 ? 7.4 : 5.6) * (0.45 + 0.55 * tail)}
            strokeLinecap="round"
            strokeDasharray={`${seg.toFixed(4)} ${(1 - seg).toFixed(4)}`}
            strokeDashoffset={-pos}
            opacity={clamp01(tail * a * born)}
          />
        );
      }
      if (pieces.length > 0) out.push(<g key={`pulse-${i}`}>{pieces}</g>);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, nPulse, travel, HOLD, accent]);

  /* ========================= dibujo: escamas del pelado =================== */

  const flakes = TIP_PTS.map((p, i) => {
    /* se abre desde la PUNTA hacia adentro */
    const k = TIP_PTS.length - 1 - i;
    const o = clamp01(
      interpolate(peelP, [k * 0.055, k * 0.055 + 0.45], [0, 1], CLAMP)
    );
    if (o <= 0.01) return null;
    const off = 6 + 10 * o;
    const rot = 16 * o;
    const ang = TIP_ANG[i];
    const shell = 'M -12 0 C -7 -6 7 -6 12 0';
    return (
      <g key={`flake-${i}`} opacity={0.35 + 0.5 * o}>
        <path
          d={shell}
          fill="none"
          stroke={SHEATH_B}
          strokeWidth={4.6}
          strokeLinecap="round"
          transform={`translate(${p[0]} ${p[1]}) rotate(${ang.toFixed(1)}) translate(0 ${(
            -off
          ).toFixed(1)}) rotate(${(-rot).toFixed(1)})`}
        />
        <path
          d={shell}
          fill="none"
          stroke={SHEATH_B}
          strokeWidth={4.6}
          strokeLinecap="round"
          transform={`translate(${p[0]} ${p[1]}) rotate(${ang.toFixed(
            1
          )}) scale(1 -1) translate(0 ${(-off).toFixed(1)}) rotate(${(-rot).toFixed(1)})`}
        />
      </g>
    );
  });

  /* ========================= dibujo: chispazos ============================= */

  const sparks: React.ReactNode[] = [];
  if (sparkP > 0.01) {
    for (let i = 1; i < TIP_PTS.length; i++) {
      const seed = `fednerve-spark-${i}-${burst}`;
      /* más cerca de la punta, más chispa */
      const bias = 0.18 + 0.5 * (i / (TIP_PTS.length - 1));
      if (random(`${seed}-on`) > bias) continue;
      const p = TIP_PTS[i];
      const side = random(`${seed}-side`) > 0.5 ? 1 : -1;
      const dir = TIP_ANG[i] + side * 90 + (random(`${seed}-d`) - 0.5) * 96;
      const len = 12 + random(`${seed}-l`) * 24;
      const n = 4;
      const pts: string[] = ['0,0'];
      for (let k = 1; k <= n; k++) {
        const px = (len * k) / n;
        const py = (random(`${seed}-y${k}`) - 0.5) * len * 0.44;
        pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
      }
      const o = clamp01(sparkP * burstEnv * (0.55 + 0.45 * random(`${seed}-o`)));
      const tr = `translate(${p[0]} ${p[1]}) rotate(${dir.toFixed(1)})`;
      sparks.push(
        <g key={`spk-${i}`} opacity={o}>
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={accent}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
            transform={tr}
          />
          <polyline
            points={pts.join(' ')}
            fill="none"
            stroke={mixHex('#FFFFFF', accent, 0.35)}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={tr}
          />
          <circle cx={p[0]} cy={p[1]} r={3.4} fill={mixHex('#FFFFFF', accent, 0.4)} />
        </g>
      );
    }
  }

  /* ========================= dibujo: regla "≈ 1 m" ========================= */

  const ticks = new Array(11).fill(0).map((_, i) => {
    const y = RULE_Y0 + ((RULE_Y1 - RULE_Y0) * i) / 10;
    const p = clamp01(interpolate(tickP, [i * 0.055, i * 0.055 + 0.3], [0, 1], CLAMP));
    const major = i === 0 || i === 10 || i === 5;
    const w = major ? 20 : 10;
    return (
      <line
        key={`tick-${i}`}
        x1={RULE_X}
        y1={y}
        x2={RULE_X + w * p}
        y2={y}
        stroke={rgba('#C9DAF2', major ? 0.5 : 0.26)}
        strokeWidth={major ? 2 : 1.2}
      />
    );
  });

  /* ================================ RENDER ================================ */

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
        {/* ================= L0 · fondo dark-cinematic ===================== */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(46% 62% at 24% 52%, ${rgba(accent, 0.13)} 0%, transparent 66%)`,
              `radial-gradient(60% 40% at 22% 96%, ${rgba(COOL_BLUE, 0.1)} 0%, transparent 70%)`,
            ].join(', '),
          }}
        />

        {/* ================= L1 · motas ==================================== */}
        <AbsoluteFill style={{filter: 'blur(9px)', opacity: 0.7}}>
          <MotesLayer motes={farMotes} blur={0} scale={1} tint={moteTint} />
        </AbsoluteFill>
        <MotesLayer motes={midMotes} blur={1.4} scale={1} tint={moteTint} />

        {/* ============ ESCENARIO 1920×1080 con cámara suave =============== */}
        <AbsoluteFill
          style={{
            transform: `scale(${stageScale.toFixed(5)}) translate(${camX.toFixed(
              2
            )}px, ${camY.toFixed(2)}px)`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: STAGE_W,
              height: STAGE_H,
              marginLeft: -STAGE_W / 2,
              marginTop: -STAGE_H / 2,
            }}
          >
            {/* ============ L2 · resplandor detrás de la pierna ============ */}
            <div
              style={{
                position: 'absolute',
                left: gx(sx(60)) - 300,
                top: gy(sy(200)) - 300,
                width: 720,
                height: 900,
                borderRadius: '50%',
                background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                  COOL_BLUE,
                  0.14
                )} 0%, transparent 70%)`,
                filter: 'blur(14px)',
                opacity: legFillP,
              }}
            />

            {/* ================= ESQUEMA (todo SVG) ======================= */}
            <div
              style={{
                position: 'absolute',
                left: DIA_X,
                top: DIA_Y,
                width: DIA_W,
                height: DIA_H,
                transform: `translateY(${(breath * 2.4).toFixed(2)}px)`,
                willChange: 'transform',
              }}
            >
              <svg
                width={DIA_W}
                height={DIA_H}
                viewBox={`0 0 ${DIA_W} ${DIA_H}`}
                style={{display: 'block', overflow: 'visible'}}
              >
                <defs>
                  <linearGradient id="fednerve-skin" x1="0" y1="0" x2="1" y2="0.7">
                    <stop offset="0%" stopColor={rgba(SKIN_HI, 0.92)} />
                    <stop offset="58%" stopColor={rgba(mixHex(SKIN_HI, SKIN_LO, 0.6), 0.94)} />
                    <stop offset="100%" stopColor={rgba(SKIN_LO, 0.96)} />
                  </linearGradient>

                  {/* el núcleo pierde brillo hacia abajo: menos señal en la punta */}
                  <linearGradient
                    id="fednerve-core"
                    gradientUnits="userSpaceOnUse"
                    x1={0}
                    y1={sy(-6)}
                    x2={0}
                    y2={sy(932)}
                  >
                    <stop offset="0%" stopColor={rgba(mixHex(TEAL, accent, 0.25), 0.95)} />
                    <stop offset="52%" stopColor={rgba(TEAL, 0.6)} />
                    <stop offset="100%" stopColor={rgba(COOL_BLUE, 0.22)} />
                  </linearGradient>

                  <linearGradient id="fednerve-sheath" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SHEATH_B} />
                    <stop offset="100%" stopColor={SHEATH_A} />
                  </linearGradient>

                  {/* región de filtro FIJA en coordenadas crudas: no depende
                      del bbox de lo que se difumina (evita recortes feos) */}
                  <filter
                    id="fednerve-glow"
                    filterUnits="userSpaceOnUse"
                    x={-80}
                    y={-240}
                    width={560}
                    height={1320}
                  >
                    <feGaussianBlur stdDeviation="7" />
                  </filter>

                  {/* el cable se dibuja recorriendo su propio trazo.
                      OJO: la máscara la referencia un <g> SIN transform, así
                      el espacio de usuario es el crudo y no se aplica dos veces */}
                  <mask
                    id="fednerve-reveal"
                    maskUnits="userSpaceOnUse"
                    x={-300}
                    y={-300}
                    width={1300}
                    height={1700}
                  >
                    <path
                      d={CABLE_D}
                      pathLength={1}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={72}
                      strokeLinecap="butt"
                      strokeDasharray="1 1"
                      strokeDashoffset={1 - cableP}
                    />
                  </mask>

                  {/* la vaina se DISUELVE en el último tramo mientras se pela */}
                  <radialGradient
                    id="fednerve-peelgrad"
                    gradientUnits="userSpaceOnUse"
                    cx={100}
                    cy={932}
                    r={70 + 210 * peelP}
                  >
                    <stop offset="0%" stopColor="#000000" stopOpacity={peelP} />
                    <stop offset="58%" stopColor="#000000" stopOpacity={0.86 * peelP} />
                    <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                  </radialGradient>
                  <mask
                    id="fednerve-peel"
                    maskUnits="userSpaceOnUse"
                    x={-300}
                    y={-300}
                    width={1300}
                    height={1700}
                  >
                    <rect x={-300} y={-300} width={1300} height={1700} fill="#ffffff" />
                    <rect
                      x={-300}
                      y={-300}
                      width={1300}
                      height={1700}
                      fill="url(#fednerve-peelgrad)"
                    />
                  </mask>
                </defs>

                {/* ======= L3 · COLUMNA: vértebras que bajan una por una ==== */}
                <g transform={`translate(${LEG_DX} ${LEG_DY}) scale(${LEG_K})`}>
                  {new Array(4).fill(0).map((_, i) => {
                    const p = clamp01(
                      interpolate(spineP, [i * 0.16, i * 0.16 + 0.5], [0, 1], CLAMP)
                    );
                    const yv = -150 + i * 36;
                    return (
                      <g
                        key={`vert-${i}`}
                        opacity={p}
                        transform={`translate(0 ${((1 - p) * -18).toFixed(1)})`}
                      >
                        <rect
                          x={268}
                          y={yv}
                          width={70}
                          height={26}
                          rx={9}
                          fill={rgba(tone(SKIN_HI, 1.18), 0.95)}
                          stroke={rgba(COOL_BLUE, 0.3)}
                          strokeWidth={1.6}
                        />
                        <path
                          d={`M 268 ${yv + 13} l -22 -6`}
                          stroke={rgba(COOL_BLUE, 0.26)}
                          strokeWidth={3}
                          strokeLinecap="round"
                        />
                        <circle cx={303} cy={yv + 13} r={5} fill={rgba(accent, 0.22 + 0.16 * p)} />
                      </g>
                    );
                  })}
                </g>

                {/* ======= L3 · REGLA "≈ 1 m" que se dibuja sola ============ */}
                <g opacity={ruleP}>
                  <line
                    x1={RULE_X}
                    y1={RULE_Y0}
                    x2={RULE_X}
                    y2={RULE_Y0 + (RULE_Y1 - RULE_Y0) * ruleP}
                    stroke={rgba('#C9DAF2', 0.42)}
                    strokeWidth={1.6}
                  />
                  {ticks}
                  {/* guías punteadas hacia los dos extremos del cable */}
                  <line
                    x1={RULE_X + 22}
                    y1={RULE_Y0}
                    x2={RULE_X + 22 + 96 * ruleP}
                    y2={RULE_Y0}
                    stroke={rgba('#C9DAF2', 0.22)}
                    strokeWidth={1.2}
                    strokeDasharray="3 6"
                  />
                  <line
                    x1={RULE_X + 22}
                    y1={RULE_Y1}
                    x2={RULE_X + 22 + 118 * ruleP}
                    y2={RULE_Y1}
                    stroke={rgba('#C9DAF2', 0.22)}
                    strokeWidth={1.2}
                    strokeDasharray="3 6"
                  />
                  <text
                    x={28}
                    y={(RULE_Y0 + RULE_Y1) / 2}
                    transform={`rotate(-90 28 ${((RULE_Y0 + RULE_Y1) / 2).toFixed(1)})`}
                    textAnchor="middle"
                    fill={rgba('#DCE8FA', 0.68 * meterP)}
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 21,
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ≈ 1 m
                  </text>
                </g>

                {/* ======= L4 · SILUETA DE LA PIERNA ======================== */}
                <g transform={`translate(${LEG_DX} ${LEG_DY}) scale(${LEG_K})`}>
                  <path d={LEG_D} fill="url(#fednerve-skin)" opacity={legFillP * 0.95} />
                  <path
                    d={LEG_D}
                    pathLength={1}
                    fill="none"
                    stroke={rgba(COOL_BLUE, 0.42)}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                    strokeDashoffset={1 - legP}
                  />
                  {/* luz de borde sobre la espinilla y el empeine */}
                  <path
                    d="M 196 760 C 200 690 206 620 210 560"
                    fill="none"
                    stroke={rgba('#BFD8F6', 0.3)}
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    opacity={legFillP}
                  />
                  <path
                    d="M 92 900 C 118 888 142 876 160 864"
                    fill="none"
                    stroke={rgba('#BFD8F6', 0.22)}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    opacity={legFillP}
                  />
                </g>

                {/* ======= L5 · CABLE: vaina + núcleo ======================= */}
                <g transform={`translate(${LEG_DX} ${LEG_DY}) scale(${LEG_K})`}>
                  <g mask="url(#fednerve-reveal)">
                    {/* halo del cable */}
                    <path
                      d={CABLE_D}
                      fill="none"
                      stroke={rgba(TEAL, 0.16)}
                      strokeWidth={26}
                      strokeLinecap="round"
                      filter="url(#fednerve-glow)"
                      opacity={cableP}
                    />
                    {/* vaina segmentada, se disuelve en la punta al pelarse */}
                    <path
                      d={CABLE_D}
                      pathLength={1}
                      fill="none"
                      stroke="url(#fednerve-sheath)"
                      strokeWidth={15 * (0.6 + 0.4 * sheathP)}
                      strokeLinecap="butt"
                      strokeDasharray="0.021 0.0085"
                      opacity={0.92 * sheathP}
                      mask="url(#fednerve-peel)"
                    />
                    {/* núcleo desnudo */}
                    <path
                      d={CABLE_D}
                      fill="none"
                      stroke="url(#fednerve-core)"
                      strokeWidth={4.6}
                      strokeLinecap="round"
                      opacity={cableP}
                    />
                  </g>
                </g>

                {/* ======= L6 · PULSOS (difuso + nítido) ==================== */}
                <g transform={`translate(${LEG_DX} ${LEG_DY}) scale(${LEG_K})`}>
                  <g filter="url(#fednerve-glow)" opacity={0.72}>
                    {pulseNodes}
                  </g>
                  <g>{pulseNodes}</g>
                </g>

                {/* ======= L7 · escamas del pelado + chispazos ============== */}
                <g transform={`translate(${LEG_DX} ${LEG_DY}) scale(${LEG_K})`}>
                  {flakes}
                  <g filter="url(#fednerve-glow)" opacity={0.6}>
                    {sparks}
                  </g>
                  {sparks}
                </g>

                {/* ======= L8 · líneas guía de los rótulos ================== */}
                <g opacity={rootP}>
                  <line
                    x1={412}
                    y1={62}
                    x2={412 + 92 * rootP}
                    y2={62}
                    stroke={rgba('#C9DAF2', 0.4)}
                    strokeWidth={1.4}
                  />
                  <circle cx={412} cy={62} r={3.2} fill={rgba('#C9DAF2', 0.6)} />
                </g>
                <g opacity={tipP}>
                  <polyline
                    points={`${TIP_SVG[0]},${TIP_SVG[1]} ${TIP_SVG[0] + 30},${
                      TIP_SVG[1] + 70
                    } ${TIP_SVG[0] + 30 + 170 * tipP},${TIP_SVG[1] + 70}`}
                    fill="none"
                    stroke={rgba(accent, 0.5)}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={TIP_SVG[0]}
                    cy={TIP_SVG[1]}
                    r={4.4 + 2 * Math.abs(breath)}
                    fill={rgba(accent, 0.85)}
                  />
                </g>
              </svg>
            </div>

            {/* ============ L8 · RÓTULOS (texto en HTML, guías en SVG) ===== */}
            <div
              style={{
                position: 'absolute',
                left: gx(512),
                top: gy(40),
                width: 268,
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.24,
                letterSpacing: 2.4,
                textTransform: 'uppercase',
                color: rgba('#DCE8FA', 0.74),
                opacity: rootP,
                transform: `translateX(${((1 - rootP) * -14).toFixed(1)}px)`,
              }}
            >
              {rootLabel}
            </div>
            <div
              style={{
                position: 'absolute',
                left: gx(TIP_SVG[0] + 40 + 170),
                top: gy(TIP_SVG[1] + 70) - 24,
                width: 340,
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 22,
                lineHeight: 1.22,
                letterSpacing: 2.6,
                textTransform: 'uppercase',
                color: accent,
                textShadow: `0 0 26px ${rgba(accent, 0.4)}, 0 4px 18px rgba(0,0,0,0.6)`,
                opacity: tipP,
                transform: `translateX(${((1 - tipPop) * -22).toFixed(
                  1
                )}px) scale(${(0.9 + 0.1 * tipPop).toFixed(4)})`,
                transformOrigin: '0% 50%',
              }}
            >
              {tipLabel}
            </div>

            {/* ================= L9 · BLOQUE DE TEXTO ===================== */}
            <div
              style={{
                position: 'absolute',
                left: TEXT_X,
                top: 0,
                width: TEXT_W,
                height: STAGE_H,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Kicker text={kicker} accent={accent} startSec={sec(0.04)} />
              <div style={{marginTop: 26}}>
                <Words
                  text={title}
                  hot={hot}
                  accent={accent}
                  startSec={sec(0.1)}
                  size={68}
                  weight={800}
                />
              </div>
              <div
                style={{
                  marginTop: 34,
                  height: 2,
                  width: 300 * textRuleP,
                  borderRadius: 1,
                  background: `linear-gradient(90deg, ${accent}, ${rgba(accent, 0)})`,
                  boxShadow: `0 0 16px ${rgba(accent, 0.4 * textRuleP)}`,
                }}
              />
              <div
                style={{
                  marginTop: 26,
                  width: TEXT_W - 60,
                  fontFamily: FONT_SERIF,
                  fontStyle: 'italic',
                  fontSize: 31,
                  lineHeight: 1.32,
                  color: rgba('#E6EEFB', 0.7),
                  textShadow: '0 4px 18px rgba(0,0,0,0.6)',
                  opacity: subP,
                  transform: `translateY(${((1 - subP) * 14).toFixed(1)}px)`,
                }}
              >
                {sub}
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* ================= L10 · viñeta + grano ========================== */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: [
              'radial-gradient(122% 100% at 46% 46%, transparent 50%, rgba(1, 3, 9, 0.58) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.34), transparent 16%, transparent 84%, rgba(2,4,10,0.46))',
            ].join(', '),
          }}
        />
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

export default FedNerveCable;
