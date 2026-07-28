/* ############################################################################
 * FED_LAB_RANGE — "LA REGLA DEL LABORATORIO" · rango de referencia horizontal
 *
 *   IDEA: los análisis vienen con rangos ANCHOS. El número del paciente puede
 *   caer "dentro de lo normal" y aun así dejar al nervio a media ración.
 *   La escena dibuja la regla, pinta las zonas, marca los números que hay que
 *   mirar y ATERRIZA el valor del paciente encima, con el color de la zona
 *   donde cayó. Si cae en 'watch' o 'alert', late y sube la nota en serif.
 *
 *   GUION VISUAL (TODO en fracciones del hold = totalF - FED_WHIP_F):
 *     0.00–0.14  fondo dark-cinematic + cabecera (kicker + título con hot)
 *     0.05–0.24  se DIBUJA la barra base de izq. a der., con textura fina
 *                de ticks y un barrido de luz que la recorre
 *     0.22–0.52  ZONAS con stagger: cada una crece desde su borde izquierdo
 *                (ok = teal frío · watch = ámbar del acento · alert = rojo
 *                apagado) y saca su etiqueta chica debajo
 *     0.40–0.62  extremos min/max en los topes de la escala
 *     0.46–0.68  MARCAS: caen desde arriba como líneas finas verticales,
 *                con su número en tipografía tabular debajo
 *     0.62–0.86  VALOR: baja desde arriba con rebote corto, clava la aguja,
 *                deja la pastilla con valueLabel y emite halo + anillo de
 *                impacto del color de la zona donde cayó
 *     0.80–1.00  latido sutil (solo watch/alert) + nota en serif itálica
 *
 *   CAPAS
 *     L0  moodBg + luz de acento
 *     L1  motas / polvo en suspensión
 *     L2  halo de la zona donde cayó el valor (detrás de la regla)
 *     L3  barra base + textura de ticks + zonas + etiquetas de zona
 *     L4  extremos min/max
 *     L5  marcas (línea + número tabular)
 *     L6  aguja + pastilla del valor + anillo de impacto
 *     L7  cabecera (kicker + título) y nota serif
 *     L8  viñeta + grano
 *
 *   Se ve completa con totalF=100 y con totalF=240. Sin archivos de public/.
 * ########################################################################## */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
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

export type FedLabTone = 'ok' | 'watch' | 'alert';

export type FedLabZone = {
  from: number;
  to: number;
  label?: string;
  tone?: FedLabTone;
};

export type FedLabMark = {
  at: number;
  label: string;
};

export type FedLabRangeProps = {
  variant?: FedTransitionVariant;
  totalF?: number;
  accent?: string;
  mood?: FedMood;
  kicker?: string;
  title?: string;
  hot?: string[];
  min?: number;
  max?: number;
  zones?: FedLabZone[];
  value?: number;
  valueLabel?: string;
  marks?: FedLabMark[];
  note?: string;
  unit?: string;
};

/* -------------------------------------------------------------- geometría */

const STAGE_W = 1920;
const STAGE_H = 1080;

const HEAD_X = 150;

const TRACK_X0 = 190;
const TRACK_X1 = 1730;
const TRACK_W = TRACK_X1 - TRACK_X0;

const TRACK_CY = 640; // centro vertical de la regla
const TRACK_H = 26;
const TRACK_TOP = TRACK_CY - TRACK_H / 2;

const ENDS_Y = 566; // etiquetas de los extremos min / max
const MARK_LABEL_Y = 676; // números de las marcas
const ZONE_LABEL_Y = 726; // etiquetas de zona
const PILL_CY = 486; // centro de la pastilla del valor
const PILL_H = 84;
const NOTE_Y = 852;

const EASE_SOFT = Easing.out(Easing.cubic);
const EASE_DRAW = Easing.bezier(0.22, 0.86, 0.2, 1);

/* -------------------------------------------------------------- utilidad */

const ALERT_HEX = '#C4564B'; // rojo apagado, no semáforo
const INK = '#EAF0FA';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = Number.parseInt(full.length === 6 ? full : '000000', 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const hex2 = (v: number) =>
  Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');

const toHex = (c: [number, number, number]) => `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}`;

/** aclara/oscurece devolviendo HEX (shade() del kit devuelve rgb(), no sirve para rgba()) */
const tint = (hex: string, f: number): string => {
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

/** decimales reales del número (tope 2) — evita "6,10" cuando el dato dice 6,1 */
const decimalsOf = (v: number): number => {
  if (!Number.isFinite(v)) return 0;
  if (Number.isInteger(v)) return 0;
  const s = String(v);
  const i = s.indexOf('.');
  return i < 0 ? 0 : Math.min(2, s.length - i - 1);
};

/** formato español: coma decimal */
const fmtEs = (v: number, dec?: number): string => {
  if (!Number.isFinite(v)) return '';
  const d = dec ?? decimalsOf(v);
  return d > 0 ? v.toFixed(d).replace('.', ',') : String(Math.round(v));
};

/* ================================ COMPONENTE ============================== */

export const FedLabRange: React.FC<FedLabRangeProps> = ({
  variant,
  totalF = FED_SCENE_F,
  accent = DEFAULT_ACCENT,
  mood = 'science',
  kicker = 'Hemoglobina glicosilada · A1c',
  title = 'Tu número entró en el rango. El nervio no.',
  hot = ['rango', 'nervio'],
  min = 4,
  max = 10,
  zones = [
    {from: 4, to: 5.7, label: 'normal', tone: 'ok'},
    {from: 5.7, to: 6.5, label: 'prediabetes', tone: 'watch'},
    {from: 6.5, to: 10, label: 'diabetes', tone: 'alert'},
  ],
  value = 6.1,
  valueLabel = '6,1 %',
  marks = [
    {at: 5.7, label: '5,7'},
    {at: 6.5, label: '6,5'},
  ],
  note = '«normal» no es lo mismo que suficiente',
  unit = '%',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  /* ---- reloj: TODO en fracciones del hold ------------------------------- */
  const T = Math.max(40, Math.round(totalF));
  const HOLD = Math.max(28, T - FED_WHIP_F);
  const at = (f: number) => HOLD * f;
  const ip = (a: number, b: number, easing = EASE_SOFT) =>
    interpolate(frame, [at(a), at(b)], [0, 1], {...CLAMP, easing});
  /** duración de spring en frames, siempre proporcional al hold */
  const dur = (f: number) => Math.max(10, Math.round(HOLD * f));

  /* ---- escala (blindada contra datos rotos) ----------------------------- */
  const zoneList = React.useMemo<FedLabZone[]>(
    () =>
      (Array.isArray(zones) ? zones : [])
        .filter((z) => z && Number.isFinite(z.from) && Number.isFinite(z.to))
        .map((z) => ({...z, from: Math.min(z.from, z.to), to: Math.max(z.from, z.to)})),
    [zones]
  );
  const markList = React.useMemo<FedLabMark[]>(
    () => (Array.isArray(marks) ? marks : []).filter((m) => m && Number.isFinite(m.at)),
    [marks]
  );

  const {lo, hi} = React.useMemo(() => {
    const cands: number[] = [];
    if (Number.isFinite(min)) cands.push(min as number);
    if (Number.isFinite(max)) cands.push(max as number);
    zoneList.forEach((z) => cands.push(z.from, z.to));
    markList.forEach((m) => cands.push(m.at));
    if (Number.isFinite(value)) cands.push(value as number);
    if (cands.length === 0) return {lo: 0, hi: 1};
    let a = Math.min(...cands);
    let b = Math.max(...cands);
    if (!(b > a)) {
      const pad = Math.abs(a) > 0 ? Math.abs(a) * 0.1 : 1;
      a -= pad;
      b += pad;
    }
    return {lo: a, hi: b};
  }, [min, max, zoneList, markList, value]);

  const span = hi - lo || 1;
  /** valor de la escala → x en el escenario de 1920 */
  const xOf = (v: number) => TRACK_X0 + ((clamp01((v - lo) / span) * TRACK_W));

  /* ---- color por tono ---------------------------------------------------- */
  const hexOf = (t?: FedLabTone): string =>
    t === 'ok' ? TEAL : t === 'alert' ? ALERT_HEX : t === 'watch' ? accent : mixHex(TEAL, accent, 0.5);

  /* ---- ¿dónde cayó el paciente? ------------------------------------------ */
  const hasValue = Number.isFinite(value);
  const hitIdx = React.useMemo(() => {
    if (!hasValue) return -1;
    const v = value as number;
    const inside = zoneList.findIndex((z) => v >= z.from && v <= z.to);
    if (inside >= 0) return inside;
    // fuera de toda zona: se queda con la más cercana, no rompe
    let best = -1;
    let bestD = Infinity;
    zoneList.forEach((z, i) => {
      const d = v < z.from ? z.from - v : v > z.to ? v - z.to : 0;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }, [hasValue, value, zoneList]);

  const hitZone = hitIdx >= 0 ? zoneList[hitIdx] : undefined;
  const hitTone = hitZone?.tone;
  const hitHex = hexOf(hitTone);
  const isHot = hitTone === 'watch' || hitTone === 'alert';

  const valueX = hasValue ? xOf(value as number) : TRACK_X0 + TRACK_W / 2;
  const label = valueLabel ?? (hasValue ? `${fmtEs(value as number)}${unit ? ` ${unit}` : ''}` : '');

  /* ---- ventanas de tiempo ------------------------------------------------ */
  const headP = ip(0.02, 0.18);
  const trackP = interpolate(frame, [at(0.05), at(0.24)], [0, 1], {
    ...CLAMP,
    easing: EASE_DRAW,
  });
  const endsP = ip(0.4, 0.62);

  const landAt = at(0.62);
  const landSpring = clamp01(
    spring({
      frame: frame - landAt,
      fps,
      config: {damping: 9.6, stiffness: 190, mass: 0.78},
      durationInFrames: dur(0.24),
    })
  );
  const dropRaw = spring({
    frame: frame - landAt,
    fps,
    config: {damping: 9.6, stiffness: 190, mass: 0.78},
    durationInFrames: dur(0.24),
  });
  const impactP = ip(0.7, 0.94, Easing.out(Easing.quad));
  const noteP = ip(0.8, 0.96);

  /* latido: sólo cuando el valor cayó en watch/alert, y sólo tras aterrizar */
  const beat = isHot ? (0.5 + 0.5 * Math.sin(frame * 0.19)) * landSpring : 0;

  /* ---- cámara mínima, escalada al totalF real ---------------------------- */
  const push = interpolate(frame, [0, T], [1.008, 1.038], CLAMP);
  const camX = Math.sin(frame * 0.0138) * 4.2;
  const camY = Math.cos(frame * 0.0186) * 3;
  const stageScale = (width / STAGE_W) * push;

  const motes = React.useMemo(
    () => makeMotes(16, 'fedlabrange-motes', 2, 6, 0.02, 0.06, 0.1, 0.26),
    []
  );
  const moteTint = mood === 'gold' || mood === 'warmdark' ? '240, 208, 150' : '182, 212, 248';

  /* ============================== RENDER ================================= */

  return (
    <TransitionShell accent={accent} totalF={totalF} variant={variant}>
      <AbsoluteFill style={{background: '#04060c', overflow: 'hidden'}}>
        {/* =============== L0 · fondo dark-cinematic del kit =============== */}
        <AbsoluteFill style={{background: moodBg(mood, accent)}} />
        <AbsoluteFill
          style={{
            background: [
              `radial-gradient(58% 44% at 50% 60%, ${rgba(accent, 0.09)} 0%, transparent 68%)`,
              `radial-gradient(90% 60% at 12% 8%, ${rgba('#7FA8D8', 0.06)} 0%, transparent 62%)`,
            ].join(', '),
          }}
        />

        {/* =============== L1 · polvo en suspensión =============== */}
        <MotesLayer motes={motes} blur={1.4} scale={height / 1080} tint={moteTint} />

        {/* ================= ESCENARIO 1920x1080 ================= */}
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
            {/* ============ L2 · HALO de la zona donde cayó el valor ========= */}
            {hasValue ? (
              <div
                style={{
                  position: 'absolute',
                  left: valueX - 420,
                  top: TRACK_CY - 300,
                  width: 840,
                  height: 600,
                  borderRadius: '50%',
                  background: `radial-gradient(50% 50% at 50% 50%, ${rgba(
                    hitHex,
                    0.3 + 0.1 * beat
                  )} 0%, ${rgba(hitHex, 0.09)} 38%, transparent 70%)`,
                  filter: 'blur(22px)',
                  opacity: landSpring * (0.62 + 0.38 * impactP),
                  pointerEvents: 'none',
                }}
              />
            ) : null}

            {/* ================ L3 · BARRA BASE que se dibuja ================ */}
            {/* riel de fondo (recorte a la derecha según trackP) */}
            <div
              style={{
                position: 'absolute',
                left: TRACK_X0,
                top: TRACK_TOP,
                width: TRACK_W * trackP,
                height: TRACK_H,
                borderRadius: TRACK_H / 2,
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${rgba('#0E1926', 0.96)} 0%, ${rgba(
                  '#060B14',
                  0.96
                )} 100%)`,
                boxShadow: [
                  `inset 0 1px 0 ${rgba('#FFFFFF', 0.08)}`,
                  `inset 0 -1px 0 ${rgba('#000000', 0.6)}`,
                  `0 18px 44px ${rgba('#000000', 0.55)}`,
                ].join(', '),
              }}
            >
              {/* textura fina: ticks verticales dentro de la barra */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `repeating-linear-gradient(90deg, ${rgba(
                    INK,
                    0.11
                  )} 0px, ${rgba(INK, 0.11)} 1px, transparent 1px, transparent ${(
                    TRACK_W / 60
                  ).toFixed(3)}px)`,
                  opacity: 0.9,
                }}
              />
              {/* barrido de luz que acompaña el dibujado */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: 190,
                  transform: `translateX(${(TRACK_W * trackP - 150).toFixed(1)}px)`,
                  background: `linear-gradient(90deg, transparent, ${rgba(accent, 0.5)}, transparent)`,
                  opacity: Math.sin(clamp01(trackP) * Math.PI) * 0.9,
                }}
              />
            </div>

            {/* ================ ZONAS con stagger ================ */}
            {zoneList.map((z, i) => {
              const x0 = xOf(z.from);
              const x1 = xOf(z.to);
              const w = Math.max(0, x1 - x0);
              const hexZ = hexOf(z.tone);
              const t0 = 0.22 + i * 0.055;
              const p = interpolate(frame, [at(t0), at(t0 + 0.19)], [0, 1], {
                ...CLAMP,
                easing: EASE_DRAW,
              });
              const lp = interpolate(frame, [at(t0 + 0.12), at(t0 + 0.3)], [0, 1], {
                ...CLAMP,
                easing: EASE_SOFT,
              });
              const isHit = i === hitIdx;
              const glow = isHit ? landSpring : 0;
              // la zona donde cayó el valor gana peso; las otras bajan un punto
              const dim = hitIdx >= 0 && !isHit ? 1 - 0.3 * landSpring : 1;

              return (
                <React.Fragment key={`zone-${i}`}>
                  <div
                    style={{
                      position: 'absolute',
                      left: x0,
                      top: TRACK_TOP,
                      width: w * p,
                      height: TRACK_H,
                      borderRadius: TRACK_H / 2,
                      background: `linear-gradient(180deg, ${rgba(
                        tint(hexZ, 1.12),
                        0.88
                      )} 0%, ${rgba(tint(hexZ, 0.7), 0.86)} 100%)`,
                      boxShadow: [
                        `inset 0 1px 0 ${rgba('#FFFFFF', 0.22)}`,
                        `0 0 ${(14 + 20 * glow).toFixed(1)}px ${rgba(
                          hexZ,
                          0.3 + 0.34 * glow + 0.1 * (isHit ? beat : 0)
                        )}`,
                      ].join(', '),
                      opacity: p * dim,
                    }}
                  />
                  {/* separador fino entre zonas */}
                  <div
                    style={{
                      position: 'absolute',
                      left: x0,
                      top: TRACK_TOP - 4,
                      width: 1,
                      height: TRACK_H + 8,
                      background: rgba('#02060C', 0.75),
                      opacity: i === 0 ? 0 : p,
                    }}
                  />
                  {/* etiqueta chica de la zona, debajo */}
                  {z.label ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: x0 + w / 2 - 200,
                        top: ZONE_LABEL_Y,
                        width: 400,
                        textAlign: 'center',
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 20,
                        letterSpacing: 3.4,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: isHit ? tint(hexZ, 1.14) : rgba(hexZ, 0.62),
                        textShadow: isHit
                          ? `0 0 ${(16 * landSpring).toFixed(1)}px ${rgba(hexZ, 0.5 * landSpring)}`
                          : 'none',
                        opacity: lp * dim,
                        transform: `translateY(${((1 - lp) * 10).toFixed(1)}px)`,
                      }}
                    >
                      {z.label}
                    </div>
                  ) : null}
                  {/* tirante que une la zona con su etiqueta */}
                  <div
                    style={{
                      position: 'absolute',
                      left: x0 + w / 2,
                      top: TRACK_CY + TRACK_H / 2 + 6,
                      width: 1,
                      height: 18 * lp,
                      background: rgba(hexZ, 0.34),
                      opacity: z.label ? lp * dim : 0,
                    }}
                  />
                </React.Fragment>
              );
            })}

            {/* ================ L4 · EXTREMOS de la escala ================ */}
            {[
              {v: lo, x: TRACK_X0, align: 'left' as const},
              {v: hi, x: TRACK_X1, align: 'right' as const},
            ].map((e, i) => (
              <div
                key={`end-${i}`}
                style={{
                  position: 'absolute',
                  left: e.align === 'left' ? e.x : e.x - 320,
                  top: ENDS_Y,
                  width: 320,
                  textAlign: e.align,
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: 21,
                  letterSpacing: 2.6,
                  fontVariantNumeric: 'tabular-nums',
                  color: rgba(INK, 0.34),
                  opacity: endsP,
                  transform: `translateY(${((1 - endsP) * 8).toFixed(1)}px)`,
                }}
              >
                {`${fmtEs(e.v)}${unit ? ` ${unit}` : ''}`}
              </div>
            ))}
            {/* topes verticales de la regla */}
            {[TRACK_X0, TRACK_X1].map((x, i) => (
              <div
                key={`cap-${i}`}
                style={{
                  position: 'absolute',
                  left: x - 1,
                  top: TRACK_TOP - 12,
                  width: 2,
                  height: TRACK_H + 24,
                  background: rgba(INK, 0.26),
                  opacity: i === 0 ? trackP : interpolate(trackP, [0.9, 1], [0, 1], CLAMP),
                }}
              />
            ))}

            {/* ================ L5 · MARCAS que caen ================ */}
            {markList.map((m, i) => {
              const x = xOf(m.at);
              const t0 = 0.46 + i * 0.06;
              const s = clamp01(
                spring({
                  frame: frame - at(t0),
                  fps,
                  config: {damping: 13.5, stiffness: 170, mass: 0.7},
                  durationInFrames: dur(0.2),
                })
              );
              const p = interpolate(frame, [at(t0), at(t0 + 0.05)], [0, 1], CLAMP);
              return (
                <React.Fragment key={`mark-${i}`}>
                  <div
                    style={{
                      position: 'absolute',
                      left: x - 0.5,
                      top: TRACK_TOP - 30,
                      width: 1,
                      height: TRACK_H + 60,
                      background: `linear-gradient(180deg, ${rgba(INK, 0)} 0%, ${rgba(
                        INK,
                        0.58
                      )} 26%, ${rgba(INK, 0.58)} 74%, ${rgba(INK, 0)} 100%)`,
                      opacity: p * 0.95,
                      transform: `translateY(${((1 - s) * -34).toFixed(1)}px) scaleY(${(
                        0.5 +
                        0.5 * s
                      ).toFixed(3)})`,
                      transformOrigin: '50% 0%',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: x - 150,
                      top: MARK_LABEL_Y,
                      width: 300,
                      textAlign: 'center',
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: 26,
                      letterSpacing: 1.2,
                      fontVariantNumeric: 'tabular-nums',
                      color: rgba(INK, 0.8),
                      textShadow: `0 3px 16px ${rgba('#000000', 0.6)}`,
                      opacity: p,
                      transform: `translateY(${((1 - s) * -14).toFixed(1)}px)`,
                    }}
                  >
                    {m.label}
                  </div>
                </React.Fragment>
              );
            })}

            {/* ================ L6 · VALOR que aterriza ================ */}
            {hasValue ? (
              <>
                {/* anillo de impacto sobre la regla */}
                <div
                  style={{
                    position: 'absolute',
                    left: valueX - 130,
                    top: TRACK_CY - 130,
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    border: `2px solid ${rgba(hitHex, 0.5 * (1 - impactP))}`,
                    transform: `scale(${(0.24 + 1.05 * impactP).toFixed(3)})`,
                    opacity: landSpring * (1 - impactP),
                    pointerEvents: 'none',
                  }}
                />
                {/* aguja: baja desde la pastilla y clava en la regla */}
                <div
                  style={{
                    position: 'absolute',
                    left: valueX - 1.5,
                    top: PILL_CY + PILL_H / 2 - 6,
                    width: 3,
                    height: TRACK_CY - (PILL_CY + PILL_H / 2) + 6,
                    background: `linear-gradient(180deg, ${rgba(hitHex, 0.25)} 0%, ${rgba(
                      tint(hitHex, 1.2),
                      0.95
                    )} 100%)`,
                    boxShadow: `0 0 ${(12 + 8 * beat).toFixed(1)}px ${rgba(hitHex, 0.6)}`,
                    transformOrigin: '50% 100%',
                    transform: `scaleY(${clamp01(landSpring * 1.15).toFixed(3)})`,
                    opacity: landSpring,
                  }}
                />
                {/* punta que toca la barra */}
                <div
                  style={{
                    position: 'absolute',
                    left: valueX - 9,
                    top: TRACK_CY - 9,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: tint(hitHex, 1.25),
                    boxShadow: `0 0 ${(20 + 16 * beat).toFixed(1)}px ${rgba(
                      hitHex,
                      0.75
                    )}, 0 0 4px ${rgba('#FFFFFF', 0.8)}`,
                    transform: `scale(${(landSpring * (1 + 0.09 * beat)).toFixed(3)})`,
                    opacity: landSpring,
                  }}
                />
                {/* PASTILLA con el valor: cae desde arriba con rebote corto */}
                <div
                  style={{
                    position: 'absolute',
                    left: Math.min(
                      STAGE_W - 40 - 240,
                      Math.max(40, valueX - 240)
                    ),
                    top: PILL_CY - PILL_H / 2,
                    width: 480,
                    display: 'flex',
                    justifyContent: 'center',
                    transform: `translateY(${((1 - dropRaw) * -260).toFixed(1)}px)`,
                    opacity: interpolate(frame, [landAt, landAt + Math.max(2, dur(0.03))], [0, 1], CLAMP),
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 16,
                      height: PILL_H,
                      padding: '0 34px',
                      borderRadius: PILL_H / 2,
                      background: `linear-gradient(168deg, ${rgba(
                        mixHex('#0A121D', hitHex, 0.16),
                        0.96
                      )} 0%, ${rgba('#05090F', 0.96)} 100%)`,
                      border: `1.5px solid ${rgba(hitHex, 0.55 + 0.25 * beat)}`,
                      boxShadow: [
                        `0 20px 48px ${rgba('#000000', 0.6)}`,
                        `0 0 ${(26 + 22 * beat).toFixed(1)}px ${rgba(
                          hitHex,
                          0.3 + 0.2 * beat
                        )}`,
                        `inset 0 1px 0 ${rgba('#FFFFFF', 0.1)}`,
                      ].join(', '),
                      transform: `scale(${(1 + 0.014 * beat).toFixed(4)})`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: tint(hitHex, 1.2),
                        boxShadow: `0 0 ${(10 + 10 * beat).toFixed(1)}px ${rgba(hitHex, 0.9)}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 800,
                        fontSize: 46,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        fontVariantNumeric: 'tabular-nums',
                        color: INK,
                        textShadow: `0 3px 20px ${rgba('#000000', 0.7)}`,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 700,
                        fontSize: 15,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                        color: rgba(hitHex, 0.85),
                      }}
                    >
                      tu valor
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            {/* ================ L7 · CABECERA ================ */}
            <div style={{position: 'absolute', left: HEAD_X, top: 118}}>
              <Kicker text={kicker} accent={accent} startSec={at(0.03) / fps} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: HEAD_X,
                top: 176,
                width: STAGE_W - HEAD_X * 2,
                opacity: interpolate(headP, [0, 0.2], [0, 1], CLAMP),
              }}
            >
              <Words
                text={title}
                hot={hot}
                accent={accent}
                startSec={at(0.06) / fps}
                size={62}
                weight={800}
                uppercase={false}
                color={INK}
                maxStagger={0.11}
              />
            </div>
            {/* regla fina bajo el título */}
            <div
              style={{
                position: 'absolute',
                left: HEAD_X,
                top: 330,
                width: (STAGE_W - HEAD_X * 2) * headP,
                height: 1,
                background: `linear-gradient(90deg, ${rgba(accent, 0.6)}, ${rgba(INK, 0.06)})`,
              }}
            />

            {/* ================ NOTA en serif itálica ================ */}
            {note ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: NOTE_Y,
                  textAlign: 'center',
                  opacity: noteP * (isHot ? 1 : 0.72),
                  transform: `translateY(${((1 - noteP) * 18).toFixed(1)}px)`,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 18,
                    fontFamily: FONT_SERIF,
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: 40,
                    lineHeight: 1.3,
                    color: isHot ? tint(hitHex, 1.1) : rgba(INK, 0.78),
                    textShadow: isHot
                      ? `0 0 ${(22 * (0.5 + 0.5 * beat)).toFixed(1)}px ${rgba(hitHex, 0.34)}`
                      : `0 3px 18px ${rgba('#000000', 0.6)}`,
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 1,
                      background: rgba(isHot ? hitHex : INK, 0.45),
                      transform: `scaleX(${noteP.toFixed(3)})`,
                      transformOrigin: '100% 50%',
                    }}
                  />
                  {note}
                  <span
                    style={{
                      width: 44,
                      height: 1,
                      background: rgba(isHot ? hitHex : INK, 0.45),
                      transform: `scaleX(${noteP.toFixed(3)})`,
                      transformOrigin: '0% 50%',
                    }}
                  />
                </span>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>

        {/* =============== L8 · viñeta + grano =============== */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: [
              'radial-gradient(122% 100% at 50% 46%, transparent 48%, rgba(1, 3, 9, 0.58) 100%)',
              'linear-gradient(to bottom, rgba(2,4,10,0.34), transparent 20%, transparent 80%, rgba(2,4,10,0.46))',
            ].join(', '),
          }}
        />
        <GrainOverlay />
      </AbsoluteFill>
    </TransitionShell>
  );
};

export default FedLabRange;
