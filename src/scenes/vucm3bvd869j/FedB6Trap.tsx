/* ############################################################################
 * FED_B6_TRAP — "NADIE SUMA"  ·  kit dark-cinematic Dr. Federer
 * ----------------------------------------------------------------------------
 * CLÍMAX del video: el payoff del loop grande.
 *
 * La gente compra un complejo B "para los nervios". Adentro viene B6
 * (piridoxina). En dosis altas y sostenidas la B6 PRODUCE neuropatía: el frasco
 * que compraste para el hormigueo te lo puede estar DANDO. Y nadie suma —
 * el complejo B, el del pelo, el multivitamínico y la energizante: cada uno
 * parece inocente, los cuatro juntos no lo son.
 *
 * GUION VISUAL (todo en FRACCIONES del hold = totalF - FED_WHIP_F, así se lee
 * completo con totalF=120 y con totalF=300, con 2 a 5 frascos):
 *   1. cabecera: kicker + título (hot en acento)
 *   2. se DIBUJA el riel del marcador y, ARRIBA de él, la AGUJA DEL LÍMITE
 *      (queda puesta antes de que empiece a sumar: el límite ya estaba ahí)
 *   3. entran los FRASCOS uno por uno (SVG: tapa, cuello, cuerpo de vidrio,
 *      líquido y etiqueta con banda, sin texto legible) con su label y su
 *      cifra de mg subiendo con contador
 *   4. el MARCADOR TOTAL (tabular, con ceros fantasma tipo tablero) va SUMANDO
 *      a medida que cada frasco aterriza: se ve cómo lo inocente se acumula
 *   5. cuando el total CRUZA el umbral: el marcador vira a rojo apagado, LATE
 *      UNA VEZ, la barra pasa la aguja y la aguja queda ATRÁS (apagada, con
 *      zona rayada roja a su derecha). Los frascos que caen ya pasados de la
 *      raya se tiñen de rojo.
 *   6. REMATE: sobre los frascos aparece el mismo símbolo del HORMIGUEO
 *      (ondas + chispas finas) que al principio salía del pie. Sin texto.
 *   7. note en serif itálica abajo.
 *
 * CAPAS
 *   L0  fondo por mood + wash de acento + lavado rojo que sube con el exceso
 *   L1  bokeh grande fuera de foco
 *   L2  polvo fino (dentro de la cámara)
 *   L3  piso: sombras proyectadas de los frascos
 *   L4  FRASCOS en SVG puro + rim rojo de los que pasan la raya
 *   L5  símbolo del hormigueo saliendo de los frascos (remate)
 *   L6  labels + cifras de mg por frasco
 *   L7  MARCADOR total (panel, ceros fantasma, pulso al cruzar)
 *   L8  riel + barra + AGUJA DEL LÍMITE + chip
 *   L9  cabecera (kicker, título) + note serif
 *   L10 viñeta + grano
 *
 * 100% SVG/CSS inline: no depende de nada en public/.
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
  shade,
  type FedMood,
  type FedTransitionVariant,
} from '../../FedererKit';

/* =============================== CONTRATO ================================ */

export type FedB6Item = {label: string; mg: number};

export type FedB6TrapProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  kicker?: string;
  title?: string;
  hot?: string[];
  items?: FedB6Item[]; // ej [{label:'Complejo B', mg:50}, ...]
  limitLabel?: string; // ej 'Nadie suma'
  total?: number; // si no viene, se calcula sumando items
  note?: string;
};

/* ============================ GEOMETRÍA (1920×1080) ====================== */

const STAGE_W = 1920;
const CX = STAGE_W / 2;
const HEAD_X = 118;

const BOT_BASE = 512; // piso donde apoyan los frascos
const BOT_W = 145;
const BOT_H = 237;
const BOT_TOP = BOT_BASE - BOT_H;

const LABEL_T = 526;
const MG_T = 578;

const PANEL_T = 626;
const PANEL_H = 176;
const PANEL_W = 760;

const GA_X = 300;
const GA_W = 1320;
const GA_Y = 838; // centro del riel
const CHIP_T = 864;

const NOTE_T = 942;

/* ================================ COLOR ================================== */

const RED = '#C4564B'; // rojo apagado, no semáforo
const INK = '#0A0D14';

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

/** aclara/oscurece devolviendo HEX (shade() del kit devuelve rgb(), no sirve para rgba()) */
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

const EASE_SOFT = Easing.out(Easing.cubic);
const EASE_COUNT = Easing.bezier(0.2, 0.86, 0.24, 1);

/** redondeo "de góndola" para el umbral */
const niceRound = (v: number): number => {
  if (v >= 500) return Math.round(v / 50) * 50;
  if (v >= 100) return Math.round(v / 10) * 10;
  if (v >= 20) return Math.round(v / 5) * 5;
  return Math.max(1, Math.round(v));
};

const DEFAULT_ITEMS: FedB6Item[] = [
  {label: 'Complejo B', mg: 50},
  {label: 'Suplemento para el pelo', mg: 30},
  {label: 'Multivitamínico', mg: 20},
  {label: 'Bebida energizante', mg: 12},
];

/* ============================== EL FRASCO ================================
 * Lienzo local 120 × 196. Tapa, cuello, cuerpo de vidrio con líquido y
 * etiqueta con banda. Nada de texto legible: la "letra chica" son barras.
 * ======================================================================== */

const Bottle: React.FC<{
  w: number;
  h: number;
  uid: string;
  band: string; // color de la banda de la etiqueta
  cap: string; // color de la tapa
  liquid: string;
  hot: number; // 0..1 — cuánto pasó de la raya
}> = ({w, h, uid, band, cap, liquid, hot}) => {
  const body =
    'M46 22 h28 v10 c0 6 22 10 22 28 v112 c0 10-7 16-16 16 H40 c-9 0-16-6-16-16 V60 c0-18 22-22 22-28 z';
  const rim = mixHex('#FFFFFF', RED, hot);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 120 196"
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba('#FFFFFF', 0.16)} />
          <stop offset="24%" stopColor={rgba('#FFFFFF', 0.05)} />
          <stop offset="62%" stopColor={rgba(INK, 0.34)} />
          <stop offset="100%" stopColor={rgba('#FFFFFF', 0.11)} />
        </linearGradient>
        <linearGradient id={`${uid}-liq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(tone(liquid, 1.15), 0.92)} />
          <stop offset="100%" stopColor={rgba(tone(liquid, 0.5), 0.96)} />
        </linearGradient>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E2D4" />
          <stop offset="100%" stopColor="#BFB7A6" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={body} />
        </clipPath>
      </defs>

      {/* tapa + estrías */}
      <rect x="42" y="2" width="36" height="22" rx="5" fill={cap} />
      <rect x="42" y="2" width="36" height="7" rx="4" fill={rgba('#FFFFFF', 0.14)} />
      {[48, 54, 60, 66, 72].map((x) => (
        <rect key={x} x={x} y="10" width="1.6" height="12" fill={rgba(INK, 0.35)} />
      ))}

      {/* cuerpo de vidrio */}
      <path d={body} fill={`url(#${uid}-glass)`} />

      {/* líquido dentro del vidrio */}
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="18" y="104" width="84" height="92" fill={`url(#${uid}-liq)`} />
        <rect x="18" y="104" width="84" height="3" fill={rgba('#FFFFFF', 0.22)} />
        {/* píldoras insinuadas, no dibujadas: sombras internas */}
        <ellipse cx="46" cy="150" rx="13" ry="7" fill={rgba(INK, 0.16)} />
        <ellipse cx="74" cy="168" rx="12" ry="6.5" fill={rgba(INK, 0.13)} />
      </g>

      {/* etiqueta: papel + BANDA + letra chica ilegible (barras) */}
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="22" y="88" width="76" height="66" fill={`url(#${uid}-paper)`} />
        <rect x="22" y="95" width="76" height="15" fill={band} />
        <rect x="22" y="95" width="76" height="4" fill={rgba('#FFFFFF', 0.2)} />
        <rect x="31" y="120" width="58" height="4.4" rx="2.2" fill={rgba(INK, 0.42)} />
        <rect x="31" y="130" width="40" height="3.4" rx="1.7" fill={rgba(INK, 0.26)} />
        <rect x="31" y="138" width="48" height="3.4" rx="1.7" fill={rgba(INK, 0.2)} />
        <rect x="31" y="146" width="26" height="3.4" rx="1.7" fill={rgba(INK, 0.16)} />
      </g>

      {/* reflejos del vidrio */}
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="31" y="44" width="9" height="140" rx="4.5" fill={rgba('#FFFFFF', 0.13)} />
        <rect x="86" y="52" width="4" height="120" rx="2" fill={rgba('#FFFFFF', 0.08)} />
      </g>

      {/* contorno · vira a rojo cuando el frasco cae pasado de la raya */}
      <path
        d={body}
        fill="none"
        stroke={rgba(rim, 0.28 + 0.42 * hot)}
        strokeWidth={1.4 + 1.1 * hot}
      />
    </svg>
  );
};

/* ====================== SÍMBOLO DEL HORMIGUEO (remate) ===================
 * Las mismas ondas + chispas que al principio salían del pie. Ahora salen
 * del frasco. Sin texto, sutil, con parpadeo propio por frasco.
 * ======================================================================== */

const Tingle: React.FC<{p: number; frame: number; phase: number; color: string}> = ({
  p,
  frame,
  phase,
  color,
}) => {
  if (p <= 0.002) return null;
  const rings = [0, 1, 2].map((k) => {
    const t = ((frame * 0.019 + k / 3 + phase) % 1 + 1) % 1;
    const r = 12 + t * 40;
    const o = Math.sin(t * Math.PI) * 0.9;
    return {r, o};
  });
  const sparks = [0, 1, 2, 3, 4].map((k) => {
    const a = (-140 + k * 25) * (Math.PI / 180);
    const t = ((frame * 0.035 + k * 0.19 + phase) % 1 + 1) % 1;
    const r0 = 20 + t * 20;
    const len = 7 + Math.sin(t * Math.PI) * 12;
    return {
      x1: Math.cos(a) * r0,
      y1: Math.sin(a) * r0,
      x2: Math.cos(a) * (r0 + len),
      y2: Math.sin(a) * (r0 + len),
      o: Math.sin(t * Math.PI) * 0.95,
    };
  });
  return (
    <svg
      width={200}
      height={160}
      viewBox="-100 -110 200 160"
      style={{display: 'block', overflow: 'visible', opacity: p}}
    >
      {rings.map((r, i) => (
        <g key={`r-${i}`} opacity={r.o}>
          {/* dos arcos superiores enfrentados: irradia hacia arriba */}
          <path
            d={`M ${-r.r} 0 A ${r.r} ${r.r} 0 0 1 ${(-r.r * 0.28).toFixed(2)} ${(
              -r.r * 0.96
            ).toFixed(2)}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d={`M ${(r.r * 0.28).toFixed(2)} ${(-r.r * 0.96).toFixed(2)} A ${r.r} ${r.r} 0 0 1 ${
              r.r
            } 0`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </g>
      ))}
      {sparks.map((s, i) => (
        <line
          key={`s-${i}`}
          x1={s.x1.toFixed(2)}
          y1={s.y1.toFixed(2)}
          x2={s.x2.toFixed(2)}
          y2={s.y2.toFixed(2)}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={s.o}
        />
      ))}
    </svg>
  );
};

/* ================================ ESCENA ================================= */

export const FedB6Trap: React.FC<FedB6TrapProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'warmdark',
  kicker = 'Vitamina B6 · piridoxina',
  title = 'El frasco que compraste para el hormigueo te lo puede estar dando',
  hot = ['dando', 'hormigueo'],
  items = DEFAULT_ITEMS,
  limitLabel = 'Nadie suma',
  total,
  note = 'Cada frasco parece inocente. Los cuatro juntos, todos los días, no lo son.',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const T = Math.max(60, totalF);
  const HOLD = Math.max(40, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});

  /* ------------------------------- datos -------------------------------- */
  const its = React.useMemo(() => {
    const base = items && items.length > 0 ? items : DEFAULT_ITEMS;
    return base.slice(0, 5).map((it) => ({
      label: it.label,
      mg: Math.max(0, it.mg),
    }));
  }, [items]);
  const n = its.length;

  const sumItems = its.reduce((a, b) => a + b.mg, 0);
  const target = typeof total === 'number' && total > 0 ? total : sumItems;
  /* si el total viene forzado, cada frasco aporta proporcionalmente para que
     el marcador aterrice EXACTO en ese número */
  const kScale = sumItems > 0 ? target / sumItems : 0;
  const limit = Math.min(niceRound(target * 0.68), Math.max(1, target - 1));

  /* ---------------- ventanas por frasco (fracciones del hold) ------------ */
  const BOT_A = 0.24;
  const BOT_B = 0.9;
  const slot = (BOT_B - BOT_A) / Math.max(1, n);
  const winOf = (i: number) => {
    const a = BOT_A + i * slot;
    return {a, b: a + slot * 0.92};
  };

  /** progreso del contador del frasco i EN CUALQUIER frame (función pura) */
  const itemPAt = (i: number, f: number) => {
    const {a, b} = winOf(i);
    return interpolate(f, [at(a), at(b)], [0, 1], {...CLAMP, easing: EASE_COUNT});
  };
  const totalAt = (f: number) =>
    its.reduce((acc, it, i) => acc + it.mg * kScale * itemPAt(i, f), 0);

  /* frame EXACTO del cruce: se busca por barrido (T ≤ 300, es gratis) y así el
     latido cae justo cuando el número pasa la raya, sea cual sea la duración */
  let crossF = -1;
  for (let f = 0; f <= T; f += 1) {
    if (totalAt(f) >= limit) {
      crossF = f;
      break;
    }
  }
  const crossed = crossF >= 0 && frame >= crossF;

  const shown = totalAt(frame);
  const redP =
    crossF >= 0
      ? interpolate(frame, [crossF, crossF + Math.max(4, HOLD * 0.07)], [0, 1], {
          ...CLAMP,
          easing: EASE_SOFT,
        })
      : 0;
  /* un solo latido: sube y baja */
  const beatRaw =
    crossF >= 0
      ? interpolate(frame, [crossF, crossF + Math.max(6, HOLD * 0.1)], [0, 1], CLAMP)
      : 0;
  const beat = crossF >= 0 && frame >= crossF ? Math.sin(clamp01(beatRaw) * Math.PI) : 0;

  /* ------------------------------ tiempos -------------------------------- */
  const railP = ip(0.09, 0.26);
  const needleP = ip(0.14, 0.3); // la aguja YA estaba antes de sumar
  const panelP = ip(0.16, 0.3);
  const tingleP = ip(0.84, 0.97);
  const noteP = ip(0.76, 0.92);

  /* ------------------------------- cámara -------------------------------- */
  const push = interpolate(frame, [0, T], [1, 1.032], CLAMP);
  const kick = 1 + beat * 0.012;
  const camX = Math.sin(frame * 0.016) * width * 0.0015;
  const camY = Math.cos(frame * 0.021) * height * 0.0012;

  /* ----------------------------- partículas ------------------------------ */
  const dust = React.useMemo(() => makeMotes(24, 'b6trap-dust', 2, 6.5, 0.05, 0.11, 0.1, 0.28), []);
  const bokeh = React.useMemo(
    () => makeMotes(5, 'b6trap-bokeh', 120, 250, 0.008, 0.02, 0.04, 0.09),
    []
  );

  /* ------------------------- layout de los frascos ----------------------- */
  const spacing = Math.min(420, 1560 / Math.max(1, n));
  const xOf = (i: number) => CX + (i - (n - 1) / 2) * spacing;

  const bandPalette = [accent, TEAL, COOL_BLUE, mixHex(accent, TEAL, 0.5), mixHex(accent, COOL_BLUE, 0.55)];

  /* estado por frasco */
  const bottles = its.map((it, i) => {
    const {a} = winOf(i);
    const s = spring({
      frame: frame - at(a),
      fps,
      config: {damping: 12.5, stiffness: 170, mass: 0.7},
      durationInFrames: Math.max(10, Math.round(HOLD * 0.14)),
    });
    const pop = clamp01(s);
    const p = itemPAt(i, frame);
    const cum = its.slice(0, i + 1).reduce((acc, x) => acc + x.mg * kScale, 0);
    const over = cum > limit ? 1 : 0;
    const hotB = over * redP * p;
    const breath = Math.sin(frame * 0.036 + i * 1.7);
    return {
      it,
      i,
      pop,
      p,
      hotB,
      breath,
      x: xOf(i),
      band: bandPalette[i % bandPalette.length],
      phase: random(`b6trap-ph-${i}`),
    };
  });

  /* --------------------------- riel del marcador -------------------------- */
  const scaleMax = Math.max(target * 1.16, limit * 1.42, 1);
  const fillFrac = clamp01(shown / scaleMax);
  const limitFrac = clamp01(limit / scaleMax);
  const limitX = GA_X + GA_W * limitFrac;
  const fillW = GA_W * fillFrac * railP;

  /* ---------------------------- marcador total ---------------------------- */
  const digits = String(Math.max(1, Math.round(target))).length;
  const shownStr = String(Math.round(shown)).padStart(digits, '0');
  const firstSig = Math.max(0, shownStr.search(/[1-9]/) < 0 ? digits - 1 : shownStr.search(/[1-9]/));
  const leadZeros = shownStr.slice(0, firstSig);
  const liveDigits = shownStr.slice(firstSig);
  const markColor = mixHex(accent, RED, redP);
  const NUM_SIZE = digits >= 5 ? 96 : digits >= 4 ? 112 : 126;

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
        {/* ============ L0 · fondo por mood + wash + exceso rojo ============ */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(58% 52% at 50% 38%, ${rgba(accent, 0.15)} 0%, transparent 66%)`,
              `radial-gradient(70% 46% at 50% 82%, ${rgba(RED, 0.1 + 0.16 * redP)} 0%, transparent 68%)`,
              'radial-gradient(122% 100% at 50% 46%, transparent 40%, rgba(1,2,6,0.9) 100%)',
            ].join(', '),
          }}
        />

        {/* ============ L1 · bokeh grande fuera de foco ===================== */}
        <AbsoluteFill style={{filter: 'blur(20px)', opacity: 0.55}}>
          <MotesLayer motes={bokeh} blur={0} scale={height / 1080} tint="238, 202, 142" />
        </AbsoluteFill>

        {/* ==================== CÁMARA (todo respira junto) ================= */}
        <AbsoluteFill
          style={{
            transform: `translate(${camX.toFixed(2)}px, ${camY.toFixed(2)}px) scale(${(
              push * kick
            ).toFixed(4)})`,
            willChange: 'transform',
          }}
        >
          {/* ============ L2 · polvo fino ================================== */}
          <MotesLayer motes={dust} blur={1.2} scale={height / 1080} tint="240, 216, 168" />

          {/* escenario fijo 1920×1080 escalado una sola vez */}
          <AbsoluteFill
            style={{
              transform: `scale(${(width / STAGE_W).toFixed(5)})`,
              transformOrigin: '50% 50%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: STAGE_W,
                height: 1080,
                marginLeft: -STAGE_W / 2,
                marginTop: -540,
              }}
            >
              {/* ====== L3 · piso: sombras proyectadas de los frascos ====== */}
              <div
                style={{
                  position: 'absolute',
                  left: GA_X - 60,
                  top: BOT_BASE - 10,
                  width: GA_W + 120,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${rgba(
                    accent,
                    0.16
                  )} 20%, ${rgba(accent, 0.16)} 80%, transparent)`,
                  opacity: railP,
                }}
              />
              {bottles.map((b) => {
                if (b.pop <= 0.004) return null;
                const sw = BOT_W * (1.5 + 0.5 * b.hotB);
                return (
                  <div
                    key={`sh-${b.i}`}
                    style={{
                      position: 'absolute',
                      left: b.x - sw / 2,
                      top: BOT_BASE - 24,
                      width: sw,
                      height: 46,
                      borderRadius: '50%',
                      background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.82) 0%, transparent 72%)`,
                      filter: 'blur(13px)',
                      opacity: b.pop * 0.95,
                    }}
                  />
                );
              })}

              {/* ====== L4 · FRASCOS ====================================== */}
              {bottles.map((b) => {
                if (b.pop <= 0.004) return null;
                const y = (1 - b.pop) * -46 + b.breath * 2.2;
                const rot = (1 - b.pop) * (b.i % 2 === 0 ? -5 : 5);
                const sc = 0.82 + 0.18 * b.pop;
                return (
                  <div
                    key={`bot-${b.i}`}
                    style={{
                      position: 'absolute',
                      left: b.x - BOT_W / 2,
                      top: BOT_TOP,
                      width: BOT_W,
                      height: BOT_H,
                      transform: `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(
                        2
                      )}deg) scale(${sc.toFixed(4)})`,
                      transformOrigin: '50% 100%',
                      opacity: interpolate(b.pop, [0, 0.22], [0, 1], CLAMP),
                      filter: b.hotB
                        ? `drop-shadow(0 0 ${(16 * b.hotB).toFixed(1)}px ${rgba(
                            RED,
                            0.5 * b.hotB
                          )})`
                        : `drop-shadow(0 0 12px ${rgba(accent, 0.14)})`,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <Bottle
                      w={BOT_W}
                      h={BOT_H}
                      uid={`b6trap-${b.i}`}
                      band={mixHex(b.band, RED, b.hotB * 0.55)}
                      cap={shade(mixHex(b.band, '#8A7C5E', 0.45), 0.72)}
                      liquid={mixHex(b.band, '#E4D9BC', 0.35)}
                      hot={b.hotB}
                    />
                  </div>
                );
              })}

              {/* ====== L5 · REMATE: el hormigueo sale de los frascos ====== */}
              {bottles.map((b) => {
                const p = tingleP * clamp01(b.pop);
                if (p <= 0.004) return null;
                return (
                  <div
                    key={`ti-${b.i}`}
                    style={{
                      /* el viewBox pone el origen del símbolo en (100, 110):
                         así las ondas nacen justo en la TAPA del frasco */
                      position: 'absolute',
                      left: b.x - 100,
                      top: BOT_TOP + 10 - 110,
                      width: 200,
                      height: 160,
                      pointerEvents: 'none',
                    }}
                  >
                    <Tingle
                      p={p}
                      frame={frame}
                      phase={b.phase}
                      color={mixHex(accent, RED, redP * 0.7)}
                    />
                  </div>
                );
              })}

              {/* ====== L6 · label + cifra de mg por frasco ================ */}
              {bottles.map((b) => {
                const lp = interpolate(b.pop, [0.12, 0.7], [0, 1], CLAMP);
                const mgNow = Math.round(b.it.mg * b.p);
                const numColor = mixHex('#F2F6FF', RED, b.hotB);
                return (
                  <React.Fragment key={`lb-${b.i}`}>
                    <div
                      style={{
                        position: 'absolute',
                        left: b.x - spacing / 2 + 10,
                        top: LABEL_T,
                        width: spacing - 20,
                        textAlign: 'center',
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: b.it.label.length > 20 ? 18 : 20,
                        lineHeight: 1.2,
                        letterSpacing: 1.6,
                        textTransform: 'uppercase',
                        color: rgba('#C9D4EA', 0.82),
                        opacity: lp,
                        transform: `translateY(${((1 - lp) * 10).toFixed(1)}px)`,
                      }}
                    >
                      {b.it.label}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        left: b.x - spacing / 2,
                        top: MG_T,
                        width: spacing,
                        textAlign: 'center',
                        opacity: lp,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_SANS,
                          fontWeight: 800,
                          fontSize: 34,
                          letterSpacing: '-0.02em',
                          fontVariantNumeric: 'tabular-nums',
                          color: numColor,
                          textShadow: `0 3px 16px ${rgba(b.hotB > 0.3 ? RED : accent, 0.4)}`,
                        }}
                      >
                        {mgNow}
                      </span>
                      <span
                        style={{
                          marginLeft: 4,
                          fontFamily: FONT_SANS,
                          fontWeight: 700,
                          fontSize: 18,
                          letterSpacing: 1,
                          color: rgba('#9FB0CC', 0.8),
                        }}
                      >
                        mg
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* ====== L7 · MARCADOR TOTAL =============================== */}
              <div
                style={{
                  position: 'absolute',
                  left: CX - PANEL_W / 2,
                  top: PANEL_T,
                  width: PANEL_W,
                  height: PANEL_H,
                  borderRadius: 20,
                  background: `linear-gradient(168deg, ${rgba('#0E141F', 0.92)} 0%, ${rgba(
                    '#05080F',
                    0.94
                  )} 100%)`,
                  border: `1px solid ${rgba(markColor, 0.22 + 0.24 * redP)}`,
                  boxShadow: [
                    `inset 0 1px 0 ${rgba('#FFFFFF', 0.06)}`,
                    `inset 0 -30px 60px ${rgba(INK, 0.6)}`,
                    `0 24px 60px rgba(0,0,0,0.6)`,
                    `0 0 ${(34 * (0.25 + 0.75 * redP + beat)).toFixed(1)}px ${rgba(
                      markColor,
                      0.16 + 0.3 * redP + 0.3 * beat
                    )}`,
                  ].join(', '),
                  opacity: panelP,
                  transform: `translateY(${((1 - panelP) * 16).toFixed(1)}px) scale(${(
                    0.97 +
                    0.03 * panelP +
                    0.05 * beat
                  ).toFixed(4)})`,
                  transformOrigin: '50% 50%',
                  overflow: 'hidden',
                }}
              >
                {/* rótulo del marcador */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 18,
                    textAlign: 'center',
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: 5.2,
                    textTransform: 'uppercase',
                    color: rgba(markColor, 0.72),
                  }}
                >
                  Todo junto · por día
                </div>

                {/* cifra grande con ceros fantasma (tablero) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 44,
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{position: 'relative', display: 'inline-block'}}>
                    {/* fantasma de segmentos apagados */}
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        fontFamily: FONT_SANS,
                        fontWeight: 800,
                        fontSize: NUM_SIZE,
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        fontVariantNumeric: 'tabular-nums',
                        color: rgba('#FFFFFF', 0.045),
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {'8'.repeat(digits)}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 800,
                        fontSize: NUM_SIZE,
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{color: rgba(markColor, 0.16)}}>{leadZeros}</span>
                      <span
                        style={{
                          color: markColor,
                          textShadow: `0 6px 30px ${rgba(markColor, 0.4 + 0.3 * beat)}`,
                        }}
                      >
                        {liveDigits}
                      </span>
                    </span>
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 800,
                      fontSize: 40,
                      color: rgba(markColor, 0.78),
                    }}
                  >
                    mg
                  </span>
                </div>

                {/* destello del latido */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(60% 80% at 50% 60%, ${rgba(
                      RED,
                      0.22 * beat
                    )} 0%, transparent 72%)`,
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* ====== L8 · riel + barra + AGUJA DEL LÍMITE =============== */}
              {/* zona de exceso (rayada) a la derecha de la aguja */}
              <div
                style={{
                  position: 'absolute',
                  left: limitX,
                  top: GA_Y - 7,
                  width: (GA_X + GA_W - limitX) * needleP,
                  height: 14,
                  borderRadius: 7,
                  background: `repeating-linear-gradient(115deg, ${rgba(
                    RED,
                    0.16 + 0.16 * redP
                  )} 0px, ${rgba(RED, 0.16 + 0.16 * redP)} 5px, transparent 5px, transparent 11px)`,
                  opacity: needleP,
                }}
              />
              {/* riel */}
              <div
                style={{
                  position: 'absolute',
                  left: GA_X,
                  top: GA_Y - 7,
                  width: GA_W * railP,
                  height: 14,
                  borderRadius: 7,
                  background: rgba('#8FA6C8', 0.12),
                  border: `1px solid ${rgba('#8FA6C8', 0.14)}`,
                  boxSizing: 'border-box',
                }}
              />
              {/* barra que suma */}
              <div
                style={{
                  position: 'absolute',
                  left: GA_X,
                  top: GA_Y - 7,
                  width: fillW,
                  height: 14,
                  borderRadius: 7,
                  background: `linear-gradient(90deg, ${rgba(accent, 0.5)} 0%, ${mixHex(
                    accent,
                    RED,
                    redP
                  )} 100%)`,
                  boxShadow: `0 0 ${(20 + 26 * redP).toFixed(0)}px ${rgba(
                    mixHex(accent, RED, redP),
                    0.4 + 0.3 * redP
                  )}`,
                }}
              />
              {/* cabeza de la barra */}
              <div
                style={{
                  position: 'absolute',
                  left: GA_X + fillW - 3,
                  top: GA_Y - 17,
                  width: 6,
                  height: 34,
                  borderRadius: 3,
                  background: mixHex('#FFFFFF', markColor, 0.45),
                  boxShadow: `0 0 22px ${rgba(markColor, 0.8)}`,
                  opacity: railP,
                }}
              />
              {/* AGUJA DEL LÍMITE: se dibuja ANTES de que empiece a sumar y
                  queda ATRÁS cuando el total la pasa */}
              <div
                style={{
                  position: 'absolute',
                  left: limitX - 1,
                  top: GA_Y - 7 - 44 * needleP,
                  width: 2,
                  height: 44 * needleP + 30,
                  background: `linear-gradient(to bottom, ${rgba(
                    crossed ? '#7C8AA4' : '#E7EEFB',
                    0.15
                  )}, ${rgba(crossed ? '#7C8AA4' : '#E7EEFB', 0.85 - 0.45 * redP)})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: limitX - 7,
                  top: GA_Y - 7 - 44 * needleP - 7,
                  width: 14,
                  height: 14,
                  transform: 'rotate(45deg)',
                  background: crossed ? rgba('#7C8AA4', 0.55) : rgba('#E7EEFB', 0.9),
                  opacity: needleP,
                }}
              />
              {/* chip del límite (debajo del riel) */}
              <div
                style={{
                  position: 'absolute',
                  left: limitX - 220,
                  top: CHIP_T,
                  width: 440,
                  textAlign: 'center',
                  opacity: needleP,
                  transform: `translateY(${((1 - needleP) * -8).toFixed(1)}px)`,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: rgba(crossed ? '#5C687C' : '#C7D3E8', 0.1),
                    border: `1px solid ${rgba(crossed ? '#7C8AA4' : '#C7D3E8', 0.3)}`,
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: rgba(crossed ? '#8B98AE' : '#DDE6F6', 0.92),
                    whiteSpace: 'nowrap',
                    filter: crossed ? 'saturate(0.4)' : 'none',
                  }}
                >
                  {limitLabel}
                  <span style={{opacity: 0.4}}>·</span>
                  <span style={{fontVariantNumeric: 'tabular-nums'}}>{`${limit} mg`}</span>
                </span>
              </div>

              {/* ====== L9 · cabecera + note ============================== */}
              <div style={{position: 'absolute', left: HEAD_X, top: 56}}>
                <Kicker text={kicker} accent={accent} startSec={at(0.02) / fps} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: HEAD_X,
                  top: 96,
                  width: 1320,
                }}
              >
                <Words
                  text={title}
                  hot={hot}
                  accent={accent}
                  startSec={at(0.05) / fps}
                  size={52}
                  weight={800}
                  color="#EEF3FF"
                  maxStagger={Math.min(0.16, (HOLD * 0.34) / fps / Math.max(1, title.split(/\s+/).length))}
                />
              </div>
              {note ? (
                <div
                  style={{
                    position: 'absolute',
                    left: CX - 720,
                    top: NOTE_T,
                    width: 1440,
                    textAlign: 'center',
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 30,
                    lineHeight: 1.34,
                    color: rgba('#D6E1F5', 0.86),
                    textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                    opacity: noteP,
                    transform: `translateY(${((1 - noteP) * 14).toFixed(1)}px)`,
                    filter: `blur(${(Math.max(0, 1 - noteP) * 6).toFixed(2)}px)`,
                  }}
                >
                  {note}
                </div>
              ) : null}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        {/* ============ L10 · viñeta + grano =============================== */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: [
              `radial-gradient(120% 100% at 50% 46%, transparent 52%, rgba(1, 3, 9, 0.62) 100%)`,
              'linear-gradient(to bottom, rgba(2,4,10,0.34), transparent 16%, transparent 84%, rgba(2,4,10,0.44))',
            ].join(', '),
          }}
        />
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

export default FedB6Trap;
