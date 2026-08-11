/**
 * KIT DE COMPONENTES — "Dr. Bastida · Salud Renal"
 * Componentes FIRMA del nicho renal, escritos contra ./theme (nada de color hardcodeado).
 * Todos data-driven, todos self-contained, cada uno registrable como su propia <Composition>
 * con prefijo Bas_ para revisarlo aislado (ver Root_bastida.tsx).
 *
 * Comparten el CONTRATO DE TRANSICIÓN del kit de Federer: cada escena hace su intro con
 * spring + un push-in lento; nada queda quieto > ~1.5s. La arquitectura de AVATAR + escenas
 * de profundidad + whips se REUTILIZA de FedererFluid con el theme BAS (ver SKILL).
 *
 * Componentes:
 *   1. RenalLowerThird — placa del nombre con acento aqua (va sobre el avatar).
 *   2. FoodVerdict     — el split SÍ/NO (ADN del canal: "X que protegen / X que dañan").
 *   3. CreatininaMeter — el medidor que BAJA (arco miedo→alivio, el gancho emocional del nicho).
 *   4. AlertSignals    — las señales de peligro/diálisis (para los títulos de miedo).
 *   5. RenalChapter    — opener de capítulo / número grande ("3 FRUTAS").
 *   + Bas_KitReel       — los encadena para revisar el look de un vistazo.
 */
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BAS,
  FONT_DISPLAY,
  FONT_SANS,
  FONT_NUM,
  FONT_SERIF,
  CLAMP,
  rgba,
  moodBg,
  CARD_SHADOW,
  AQUA_GLOW,
  GrainOverlay,
  CoolVignette,
  WaterMotes,
  type BasMood,
} from './theme';

/* ---------------------------------------------------------------- helpers */

const useIntro = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass: 0.9}});
};

/** Versión PURA de useIntro (no es hook) — usar dentro de .map() para no romper las reglas de hooks. */
const introAt = (frame: number, fps: number, delay = 0, damping = 200) =>
  spring({frame: frame - delay, fps, config: {damping, mass: 0.9}});

/** Fondo de escena de profundidad reutilizable (navy + grano + viñeta + motas de agua). */
const DepthBg: React.FC<{mood?: BasMood}> = ({mood = 'calm'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: moodBg(mood)}}>
      <WaterMotes frame={frame} fps={fps} />
      <CoolVignette />
      <GrainOverlay />
    </AbsoluteFill>
  );
};

/** Kicker de sección (small-caps sobre línea aqua). */
const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: FONT_SANS,
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: 4,
      textTransform: 'uppercase',
      color: BAS.aqua,
    }}
  >
    <span style={{width: 46, height: 3, background: BAS.aqua, boxShadow: AQUA_GLOW}} />
    {children}
  </div>
);

/* ------------------------------------------------------------ 1. LowerThird */

export type RenalLowerThirdProps = {
  name?: string;
  role?: string;
  tag?: string;
  focusX?: number; // 0 izq..1 der: de qué lado está la cara del avatar (la placa va al lado opuesto)
};

/** Placa del nombre sobre el avatar — papel clínico + acento aqua, sombra fuerte para despegar del navy. */
export const RenalLowerThird: React.FC<RenalLowerThirdProps> = ({
  name = 'Dr. Emilio Bastida',
  role = 'Nefrólogo · Salud Renal',
  tag = 'RIÑONES 60+',
  focusX = 0.5,
}) => {
  const p = useIntro(0, 180);
  const y = interpolate(p, [0, 1], [40, 0], CLAMP);
  const alignLeft = focusX >= 0.5; // si la cara está a la derecha, la placa va a la izquierda
  return (
    <AbsoluteFill style={{padding: 64}}>
      <div
        style={{
          position: 'absolute',
          bottom: 72,
          [alignLeft ? 'left' : 'right']: 72,
          transform: `translateY(${y}px)`,
          opacity: p,
        }}
      >
        <div
          style={{
            background: BAS.card,
            borderRadius: 16,
            padding: '18px 30px',
            borderLeft: `6px solid ${BAS.aqua}`,
            boxShadow: CARD_SHADOW,
          }}
        >
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: BAS.brand, letterSpacing: 0.3}}>
            {name}
          </div>
          <div style={{fontFamily: FONT_SANS, fontSize: 20, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: BAS.ink2, marginTop: 2}}>
            {role}
          </div>
        </div>
      </div>
      {/* chip de contexto arriba a la derecha */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          right: 72,
          background: BAS.aqua,
          color: BAS.onAqua,
          fontFamily: FONT_SANS,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 1.5,
          padding: '8px 20px',
          borderRadius: 30,
          opacity: p,
          boxShadow: AQUA_GLOW,
        }}
      >
        {tag}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- 2. FoodVerdict */

export type VerdictItem = {name: string; img?: string};
export type FoodVerdictProps = {
  title?: string;
  goodLabel?: string;
  badLabel?: string;
  good: VerdictItem[];
  bad: VerdictItem[];
  mood?: BasMood;
};

const VerdictColumn: React.FC<{
  label: string;
  items: VerdictItem[];
  tone: 'si' | 'no';
  baseDelay: number;
}> = ({label, items, tone, baseDelay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const color = tone === 'si' ? BAS.si : BAS.no;
  const onColor = tone === 'si' ? BAS.onSi : BAS.onNo;
  const mark = tone === 'si' ? '✓' : '✕';
  const head = introAt(frame, fps, baseDelay, 200);
  return (
    <div
      style={{
        flex: 1,
        background: BAS.card,
        borderRadius: 20,
        borderTop: `8px solid ${color}`,
        boxShadow: CARD_SHADOW,
        padding: '30px 34px',
        transform: `translateY(${interpolate(head, [0, 1], [50, 0], CLAMP)}px)`,
        opacity: head,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: FONT_SANS,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 2,
          color,
          marginBottom: 22,
        }}
      >
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: color,
            color: onColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
          }}
        >
          {mark}
        </span>
        {label}
      </div>
      {items.map((it, i) => {
        const ip = introAt(frame, fps, baseDelay + 8 + i * 7, 220);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '12px 0',
              borderBottom: i < items.length - 1 ? `1.5px solid ${BAS.cardEdge}` : 'none',
              transform: `translateX(${interpolate(ip, [0, 1], [tone === 'si' ? -24 : 24, 0], CLAMP)}px)`,
              opacity: ip,
            }}
          >
            <span style={{fontSize: 26, color, fontWeight: 800, width: 26}}>{mark}</span>
            <span style={{fontFamily: FONT_SERIF, fontSize: 34, color: BAS.ink, fontWeight: 500}}>{it.name}</span>
          </div>
        );
      })}
    </div>
  );
};

/** El split SÍ/NO — el componente firma del canal. Columnas que aterrizan e ítems que entran uno a uno. */
export const FoodVerdict: React.FC<FoodVerdictProps> = ({
  title = 'Riñones en riesgo',
  goodLabel = 'PROTEGEN',
  badLabel = 'DAÑAN',
  good,
  bad,
  mood = 'science',
}) => {
  const t = useIntro(0, 180);
  return (
    <AbsoluteFill>
      <DepthBg mood={mood} />
      <AbsoluteFill style={{padding: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{opacity: t, transform: `translateY(${interpolate(t, [0, 1], [-20, 0], CLAMP)}px)`, marginBottom: 34}}>
          <Kicker>Salud renal · 60+</Kicker>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 68, fontWeight: 700, color: BAS.onDark, marginTop: 12}}>
            {title}
          </div>
        </div>
        <div style={{display: 'flex', gap: 34, alignItems: 'stretch'}}>
          <VerdictColumn label={goodLabel} items={good} tone="si" baseDelay={10} />
          <VerdictColumn label={badLabel} items={bad} tone="no" baseDelay={18} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- 3. CreatininaMeter */

export type CreatininaMeterProps = {
  from?: number; // valor inicial (alto → miedo)
  to?: number; // valor final (baja → alivio)
  unit?: string;
  caption?: string;
  subcaption?: string;
};

/** El medidor que BAJA — arco de aguja que viaja de rojo(alto) a verde(bajo). El gancho emocional del nicho. */
export const CreatininaMeter: React.FC<CreatininaMeterProps> = ({
  from = 2.4,
  to = 1.1,
  unit = 'mg/dL',
  caption = 'Creatinina',
  subcaption = 'en 30 días',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = useIntro(0, 200);
  // la aguja arranca quieta en "from", espera un beat, y baja a "to"
  const drop = spring({frame: frame - fps * 0.9, fps, config: {damping: 60, mass: 1.4}});
  const value = interpolate(drop, [0, 1], [from, to], CLAMP);
  // arco de -120° (izq) a +120° (der). Valor alto = derecha (rojo), bajo = izquierda (verde).
  const vmin = 0.6;
  const vmax = 3.0;
  const norm = interpolate(value, [vmin, vmax], [0, 1], CLAMP);
  const angle = interpolate(norm, [0, 1], [-120, 120]);
  const needleColor = norm < 0.45 ? BAS.si : norm < 0.7 ? BAS.amber : BAS.no;

  const R = 230;
  const cx = 300;
  const cy = 300;
  const polar = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
  };
  const arc = (a0: number, a1: number, r: number) => {
    const s = polar(a0, r);
    const e = polar(a1, r);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const tip = polar(angle, R - 30);

  return (
    <AbsoluteFill>
      <DepthBg mood="alert" />
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 70, opacity: enter}}>
        <svg width={600} height={380} viewBox="0 0 600 380">
          {/* pista */}
          <path d={arc(-120, 120, R)} fill="none" stroke={rgba('#ffffff', 0.14)} strokeWidth={30} strokeLinecap="round" />
          {/* zonas: verde (bajo) / ámbar / rojo (alto) */}
          <path d={arc(-120, -18, R)} fill="none" stroke={BAS.si} strokeWidth={30} strokeLinecap="round" />
          <path d={arc(-18, 46, R)} fill="none" stroke={BAS.amber} strokeWidth={30} />
          <path d={arc(46, 120, R)} fill="none" stroke={BAS.no} strokeWidth={30} strokeLinecap="round" />
          {/* aguja */}
          <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={needleColor} strokeWidth={10} strokeLinecap="round" style={{filter: `drop-shadow(0 0 10px ${rgba(needleColor, 0.7)})`}} />
          <circle cx={cx} cy={cy} r={20} fill={BAS.brand} stroke={BAS.aqua} strokeWidth={4} />
        </svg>
        <div style={{minWidth: 320}}>
          <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: BAS.aqua}}>
            {caption}
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 6}}>
            <span style={{fontFamily: FONT_NUM, fontSize: 150, fontWeight: 800, color: BAS.onDark, lineHeight: 1}}>
              {value.toFixed(1)}
            </span>
            <span style={{fontFamily: FONT_SANS, fontSize: 34, color: BAS.inkSoft}}>{unit}</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14}}>
            <span style={{color: BAS.si, fontSize: 40, transform: `scale(${0.6 + drop * 0.4})`}}>▼</span>
            <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700, color: BAS.si}}>baja</span>
            <span style={{fontFamily: FONT_SERIF, fontSize: 30, color: BAS.inkSoft, marginLeft: 6}}>{subcaption}</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- 4. AlertSignals */

export type AlertSignalsProps = {
  title?: string;
  signals: string[];
  footer?: string;
};

/** Las señales de peligro/diálisis — lista con íconos de alerta que pulsan. Para los títulos de miedo. */
export const AlertSignals: React.FC<AlertSignalsProps> = ({
  title = 'Sus riñones ya están pidiendo ayuda',
  signals,
  footer = 'Si reconoce 2 o más, consulte a su médico',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useIntro(0, 180);
  const pulse = 0.7 + 0.3 * Math.sin((frame / fps) * Math.PI * 2.2);
  return (
    <AbsoluteFill>
      <DepthBg mood="alert" />
      <AbsoluteFill style={{padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{opacity: t, transform: `translateY(${interpolate(t, [0, 1], [-24, 0], CLAMP)}px)`}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 14}}>
            <span style={{fontSize: 40, color: BAS.amber, opacity: pulse}}>⚠</span>
            <span style={{fontFamily: FONT_SANS, fontSize: 28, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: BAS.amber}}>
              Señales de alerta
            </span>
          </div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 62, fontWeight: 700, color: BAS.onDark, marginTop: 10, maxWidth: 1400}}>
            {title}
          </div>
        </div>
        <div style={{marginTop: 44, display: 'flex', flexDirection: 'column', gap: 18}}>
          {signals.map((s, i) => {
            const ip = introAt(frame, fps, 12 + i * 8, 220);
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  background: BAS.card,
                  borderRadius: 14,
                  borderLeft: `6px solid ${BAS.amber}`,
                  boxShadow: CARD_SHADOW,
                  padding: '20px 30px',
                  transform: `translateX(${interpolate(ip, [0, 1], [-40, 0], CLAMP)}px)`,
                  opacity: ip,
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: BAS.amber,
                    color: BAS.onAmber,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT_NUM,
                    fontSize: 26,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{fontFamily: FONT_SERIF, fontSize: 38, color: BAS.ink, fontWeight: 500}}>{s}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 34, fontFamily: FONT_SANS, fontSize: 26, color: BAS.onDark, opacity: 0.85}}>
          {footer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 5. RenalChapter */

export type RenalChapterProps = {
  number?: string; // "3", "7"
  unit?: string; // "FRUTAS", "BEBIDAS"
  subtitle?: string;
  mood?: BasMood;
};

/** Opener de capítulo / número grande — "3 FRUTAS que puede comer sin riesgo". */
export const RenalChapter: React.FC<RenalChapterProps> = ({
  number = '3',
  unit = 'FRUTAS',
  subtitle = 'que puede comer sin riesgo',
  mood = 'water',
}) => {
  const n = useIntro(0, 120);
  const u = useIntro(6, 180);
  const s = useIntro(12, 200);
  return (
    <AbsoluteFill>
      <DepthBg mood={mood} />
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 28}}>
          <span
            style={{
              fontFamily: FONT_NUM,
              fontSize: 340,
              fontWeight: 800,
              color: BAS.aqua,
              lineHeight: 0.9,
              transform: `scale(${interpolate(n, [0, 1], [0.6, 1], CLAMP)})`,
              opacity: n,
              textShadow: AQUA_GLOW,
            }}
          >
            {number}
          </span>
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 130,
              fontWeight: 700,
              letterSpacing: 4,
              color: BAS.onDark,
              transform: `translateX(${interpolate(u, [0, 1], [40, 0], CLAMP)}px)`,
              opacity: u,
            }}
          >
            {unit}
          </span>
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 52,
            color: BAS.onDark,
            opacity: s * 0.92,
            transform: `translateY(${interpolate(s, [0, 1], [20, 0], CLAMP)}px)`,
            marginTop: 12,
          }}
        >
          {subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- Bas_KitReel */

/** Encadena los componentes firma para revisar el look de un vistazo. */
export const BastidaKitReel: React.FC = () => {
  const {fps} = useVideoConfig();
  const d = fps * 3;
  return (
    <AbsoluteFill style={{background: BAS.bgDeep}}>
      <Sequence durationInFrames={d}>
        <RenalChapter number="3" unit="FRUTAS" subtitle="que puede comer sin riesgo" mood="water" />
      </Sequence>
      <Sequence from={d} durationInFrames={d}>
        <FoodVerdict
          title="Riñones en riesgo"
          good={[{name: 'Arándanos'}, {name: 'Coliflor'}, {name: 'Pimiento rojo'}, {name: 'Clara de huevo'}]}
          bad={[{name: 'Embutidos'}, {name: 'Quesos curados'}, {name: 'Refrescos cola'}, {name: 'Enlatados'}]}
        />
      </Sequence>
      <Sequence from={d * 2} durationInFrames={d}>
        <CreatininaMeter from={2.4} to={1.1} />
      </Sequence>
      <Sequence from={d * 3} durationInFrames={d}>
        <AlertSignals
          signals={['Orina espumosa por la mañana', 'Hinchazón en tobillos y párpados', 'Cansancio que no se va', 'Picazón en la piel sin causa']}
        />
      </Sequence>
      <Sequence from={d * 4} durationInFrames={d}>
        <RenalLowerThird />
      </Sequence>
    </AbsoluteFill>
  );
};
