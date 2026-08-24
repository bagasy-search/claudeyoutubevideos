/**
 * MethodStackScene — CTA "qué hay ADENTRO de la guía" (Dr. Bastida · Salud Renal).
 *
 * IDEA VISUAL: no es una lista; es una MESA DE TRABAJO donde el doctor va apoyando, una por una,
 * las PÁGINAS FÍSICAS de su guía (las mismas láminas que se vieron durante el video). Cada módulo
 * es un pliego de papel clínico con grosor real (dos slabs traseros), canto, lomo perforado,
 * sombra de contacto y la lámina fotográfica embebida en su marco. Cuando entra la siguiente
 * página, la anterior NO se va: retrocede en Z, se apaga y se corre a la izquierda-abajo, armando
 * una PILA que crece — al final se ve todo el material junto.
 *
 * PROFUNDIDAD (9 planos): 1 fondo navy · 2 halo aqua que respira · 3 haces de luz · 4 polvo en
 * suspensión · 5 mesa en perspectiva con charco de luz · 6 pila de páginas (cada una multicapa)
 * · 7 cabecera tipográfica (parallax amortiguado) · 8 riel de progreso · 9 grano + viñeta + barrido.
 *
 * CÁMARA: dolly-in de presentación (0→150), luego retroceso lentísimo mientras se acumula material,
 * paneo continuo, micro-rotación senoidal y un IMPULSO de reencuadre en cada entrada.
 *
 * Duración: 1660 frames (55 s @30fps). Entrada escalonada cada `stepFrames` (400 por defecto).
 * Reglas del canal respetadas: SIN precio, SIN URL, SIN la palabra "gratis".
 * Sin backdrop-filter, sin Math.random/Date, todo función pura de useCurrentFrame().
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BAS,
  CARD_SHADOW,
  FONT_DISPLAY,
  FONT_NUM,
  FONT_SANS,
  FONT_SERIF,
  GrainOverlay,
  rgba,
  shade,
} from './../theme';

/* ────────────────────────────────────────────────────────────── tipos (contrato) */

export type MethodRow = {img: string; title: string; sub: string; stat?: string; statLabel?: string};
export type MethodStackSceneProps = {
  title?: string;
  rows?: MethodRow[];
  stepFrames?: number;
};

/* ────────────────────────────────────────────────────────────── utilidades puras */

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EOUT = Easing.out(Easing.cubic);
const EIO = Easing.inOut(Easing.cubic);

const ease = (frame: number, a: number, b: number, e: (n: number) => number = EOUT): number =>
  interpolate(frame, [a, b], [0, 1], {...CL, easing: e});

/** ventana triangular 0→1→0 (para barridos de un solo pase) */
const win = (frame: number, a: number, b: number, c: number, d: number): number =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], CL);

/* ────────────────────────────────────────────────────────────── geometría de la mesa */

const W = 1200; // ancho de la página
const H = 660; // alto de la página
const PERSP = 1850;

/** posición por "edad" en la pila (0 = la que acaba de entrar). x/y son PÍXELES DE PANTALLA. */
const LX = [220, -280, -520, -700];
const LY = [-30, 60, 140, 215];
const LZ = [90, -250, -500, -740];
const LRY = [-5, 11, 17, 21];
const LRX = [1.5, 2.6, 3.2, 3.6];
const LRZ = [-0.6, -2.4, -4.2, -5.6];
const LOP = [1, 0.7, 0.5, 0.36];
const LDIM = [0, 0.3, 0.46, 0.58];
const LBLUR = [0, 1, 1.8, 2.4];
const AGES = [0, 1, 2, 3];

const PAGE_TAG = ['Lámina · Semáforo', 'Lámina · Calendario', 'Lámina · Botiquín', 'Lámina · Laboratorio'];
const RAIL_TAG = ['El semáforo', 'Los 90 días', 'El botiquín', 'Su análisis'];

const DEFAULT_ROWS: MethodRow[] = [
  {
    img: 'img/bas7_lamina_c.jpg',
    title: 'El semáforo renal',
    sub: 'Casi 300 alimentos de la A a la Z, cada uno con su color y su porción exacta. Columna aparte para diabéticos e hipertensos.',
    stat: '300',
    statLabel: 'alimentos, de la A a la Z',
  },
  {
    img: 'img/bas6_p_calendario_pared.jpg',
    title: '90 días para bajar la creatinina',
    sub: 'El plan día por día, semana por semana, hasta su próximo análisis de sangre.',
    stat: '90',
    statLabel: 'días, uno detrás del otro',
  },
  {
    img: 'img/bas7_lamina_b.jpg',
    title: 'El botiquín traicionero',
    sub: '27 pastillas, hierbas y suplementos de uso común, revisados uno por uno.',
    stat: '27',
    statLabel: 'productos revisados',
  },
  {
    img: 'img/bas6_p_analisis_comparar.jpg',
    title: 'Su análisis traducido',
    sub: 'Qué dice cada sigla del papel del laboratorio, explicada en castellano claro.',
  },
];

/* ────────────────────────────────────────────────────────────── atmósfera */

/** Polvo en suspensión sobre la mesa — determinístico (seno + semilla), nunca Math.random. */
const DustLayer: React.FC<{frame: number; fps: number; count?: number}> = ({frame, fps, count = 20}) => {
  const t = frame / fps;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const s = (i * 61.803) % 100;
        const x = 4 + ((s * 1.7) % 92);
        const drift = Math.sin(t * (0.18 + (s % 7) / 46) + i) * (10 + (s % 13));
        const y = 96 - (((t * (2.6 + (s % 5) * 0.5) + s * 1.7) % 118));
        const size = 2 + (s % 5) * 0.8;
        const op = 0.1 + ((s % 23) / 100) * 0.42;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: BAS.aquaLite,
              opacity: op * interpolate(frame, [0, 46], [0, 1], CL),
              transform: `translateX(${drift}px)`,
              boxShadow: `0 0 ${size * 4}px ${rgba(BAS.aqua, 0.55)}`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────── detalles semánticos por módulo */

/** Lente de semáforo (verde / ámbar / rojo) con reflejo especular — material, no ícono plano. */
const Lens: React.FC<{c: string; label: string; p: number}> = ({c, label, p}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: '50%',
        background: `radial-gradient(60% 60% at 34% 28%, ${shade(c, 0.42)} 0%, ${c} 46%, ${shade(c, -0.42)} 100%)`,
        boxShadow: `0 0 ${16 * p}px ${rgba(c, 0.6)}, inset 0 -3px 6px ${rgba('#000000', 0.35)}, 0 3px 6px ${rgba(BAS.ink, 0.28)}`,
        position: 'relative',
      }}
    >
      <div style={{position: 'absolute', top: 7, left: 10, width: 13, height: 8, borderRadius: '50%', background: rgba('#ffffff', 0.62), filter: 'blur(1px)'}} />
    </div>
    <div style={{fontFamily: FONT_SANS, fontSize: 21, fontWeight: 800, letterSpacing: 1.6, color: BAS.ink2}}>{label}</div>
  </div>
);

const Extras: React.FC<{index: number; rel: number; fps: number}> = ({index, rel, fps}) => {
  const pop = (d: number) => spring({frame: rel - d, fps, config: {damping: 150, mass: 0.8}});

  if (index === 0) {
    // SEMÁFORO: las tres lentes + la etiqueta de la porción exacta.
    const chip = pop(96);
    return (
      <div>
        <div style={{display: 'flex', gap: 34, alignItems: 'flex-end'}}>
          <Lens c={BAS.si} label="LIBRE" p={pop(70)} />
          <Lens c={BAS.amber} label="MEDIDO" p={pop(80)} />
          <Lens c={BAS.no} label="EVITAR" p={pop(90)} />
          <div
            style={{
              marginBottom: 6,
              opacity: chip,
              transform: `translateX(${(1 - chip) * -18}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 18px',
              borderRadius: 999,
              background: `linear-gradient(180deg, ${shade(BAS.amber, 0.16)} 0%, ${BAS.amber} 100%)`,
              boxShadow: `0 6px 14px ${rgba(BAS.amberDark, 0.4)}, inset 0 1px 0 ${rgba('#ffffff', 0.5)}`,
            }}
          >
            <div style={{width: 13, height: 13, borderRadius: 3, border: `3px solid ${BAS.onAmber}`}} />
            <div style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 1.4, color: BAS.onAmber}}>PORCIÓN EXACTA</div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    // 90 DÍAS: la tira de días que se va llenando, con marca cada 7 (semana).
    const filled = interpolate(rel, [70, 165], [0, 90], {...CL, easing: EOUT});
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 3, height: 40}}>
          {Array.from({length: 90}).map((_, d) => {
            const on = d < filled;
            const wk = d % 7 === 0;
            const lead = on && d > filled - 3;
            return (
              <div
                key={d}
                style={{
                  width: 4,
                  height: wk ? 38 : 28,
                  borderRadius: 2,
                  background: on
                    ? wk
                      ? BAS.brand
                      : `linear-gradient(180deg, ${BAS.aqua} 0%, ${BAS.aquaDark} 100%)`
                    : rgba(BAS.inkSoft, 0.28),
                  boxShadow: lead ? `0 0 10px ${rgba(BAS.aqua, 0.9)}` : 'none',
                }}
              />
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, width: 90 * 7 - 3}}>
          <div style={{fontFamily: FONT_SANS, fontSize: 21, fontWeight: 700, letterSpacing: 1.2, color: BAS.inkSoft}}>SEMANA 1</div>
          <div style={{fontFamily: FONT_SANS, fontSize: 21, fontWeight: 700, letterSpacing: 1.2, color: BAS.brand}}>SU PRÓXIMO ANÁLISIS</div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    // BOTIQUÍN: 27 blísteres que se van marcando "revisado", uno por uno.
    const done = interpolate(rel, [70, 158], [0, 27], {...CL, easing: EOUT});
    const tag = pop(120);
    return (
      <div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 7, width: 620}}>
          {Array.from({length: 27}).map((_, d) => {
            const on = d < done;
            return (
              <div
                key={d}
                style={{
                  width: 58,
                  height: 17,
                  borderRadius: 9,
                  border: `2px solid ${on ? BAS.amber : rgba(BAS.inkSoft, 0.35)}`,
                  background: on
                    ? `linear-gradient(180deg, ${rgba(BAS.amber, 0.34)} 0%, ${rgba(BAS.amber, 0.12)} 100%)`
                    : rgba(BAS.cardEdge, 0.5),
                  boxShadow: on ? `0 2px 5px ${rgba(BAS.amberDark, 0.22)}` : 'none',
                }}
              />
            );
          })}
        </div>
        <div style={{marginTop: 10, opacity: tag, fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 1.4, color: BAS.amberDark}}>
          REVISADOS UNO POR UNO
        </div>
      </div>
    );
  }

  // SU ANÁLISIS: la sigla del laboratorio traducida al castellano.
  const SIGLAS = [
    ['TFG', 'su filtrado renal'],
    ['CREA', 'creatinina en sangre'],
    ['ALB', 'albúmina en la orina'],
  ];
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>
      {SIGLAS.map((s, k) => {
        const p = pop(64 + k * 16);
        return (
          <div key={s[0]} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateX(${(1 - p) * -22}px)`}}>
            <div
              style={{
                minWidth: 84,
                textAlign: 'center',
                padding: '4px 10px',
                borderRadius: 6,
                background: `linear-gradient(180deg, ${BAS.brandLite} 0%, ${BAS.brand} 100%)`,
                fontFamily: FONT_SANS,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1.6,
                color: '#EAF6FA',
                boxShadow: `0 3px 7px ${rgba(BAS.ink, 0.3)}`,
              }}
            >
              {s[0]}
            </div>
            <div style={{fontFamily: FONT_SANS, fontSize: 24, fontWeight: 800, color: BAS.aquaDark}}>→</div>
            <div style={{fontFamily: FONT_SERIF, fontSize: 26, color: BAS.ink2}}>{s[1]}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────── una PÁGINA de la guía */

const PaperPage: React.FC<{row: MethodRow; index: number; enter: number; ageF: number}> = ({row, index, enter, ageF}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rel = frame - enter;
  if (rel < -6) return null;

  const inP = spring({frame: rel, fps, config: {damping: 200, mass: 1.05, stiffness: 90}});

  // ── colocación en la pila (continua, según cuántas páginas entraron después)
  const x = interpolate(ageF, AGES, LX, CL);
  const y = interpolate(ageF, AGES, LY, CL);
  const z = interpolate(ageF, AGES, LZ, CL);
  const ry = interpolate(ageF, AGES, LRY, CL);
  const rx = interpolate(ageF, AGES, LRX, CL);
  const rz = interpolate(ageF, AGES, LRZ, CL);
  const op = interpolate(ageF, AGES, LOP, CL);
  const dim = interpolate(ageF, AGES, LDIM, CL);
  const bl = interpolate(ageF, AGES, LBLUR, CL);

  // el x/y está en píxeles de PANTALLA → se compensa la escala de perspectiva del translateZ
  const ds = PERSP / (PERSP - z);
  const t = frame / fps;
  const driftX = Math.sin(t * 0.46 + index * 1.7) * 2.4;
  const driftY = Math.cos(t * 0.37 + index * 2.3) * 1.8;
  const driftR = Math.sin(t * 0.31 + index) * 0.35;

  const eX = (1 - inP) * 300;
  const eY = (1 - inP) * 150;

  const glossP = win(rel, 150, 162, 200, 214);
  const glossX = interpolate(rel, [150, 214], [-40, 140], CL);

  const statNum = row.stat ? parseInt(row.stat, 10) : NaN;
  const counted = isNaN(statNum) ? 0 : Math.round(interpolate(rel, [34, 122], [0, statNum], {...CL, easing: EOUT}));
  const statPop = spring({frame: rel - 30, fps, config: {damping: 140, mass: 0.9}});

  const photoP = ease(rel, 10, 52, EIO);
  const titleP = ease(rel, 16, 54, EIO);
  const subP = ease(rel, 32, 66);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: W,
        height: H,
        marginLeft: -W / 2,
        marginTop: -H / 2,
        transformStyle: 'preserve-3d',
        transform:
          `translate3d(${(x + driftX) / ds + eX}px, ${(y + driftY) / ds + eY}px, ${z}px) ` +
          `rotateY(${ry + driftR + (1 - inP) * -14}deg) rotateX(${rx}deg) rotateZ(${rz + (1 - inP) * 3.2}deg) ` +
          `scale(${interpolate(inP, [0, 1], [0.9, 1])})`,
        opacity: op * inP,
        filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
      }}
    >
      {/* sombra de contacto sobre la mesa */}
      <div
        style={{
          position: 'absolute',
          left: '5%',
          right: '3%',
          bottom: -30,
          height: 52,
          borderRadius: '50%',
          background: `radial-gradient(50% 50% at 50% 50%, ${rgba('#000000', 0.62)} 0%, transparent 72%)`,
          filter: 'blur(14px)',
        }}
      />
      {/* GROSOR: dos pliegos debajo, desplazados y más oscuros */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 12, background: shade(BAS.cardWarm, -0.5), transform: 'translate(11px, 14px)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 12, background: shade(BAS.cardWarm, -0.26), transform: 'translate(5px, 7px)'}} />

      {/* PÁGINA */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          overflow: 'hidden',
          background: `linear-gradient(152deg, ${shade(BAS.card, 0.35)} 0%, ${BAS.card} 34%, ${BAS.cardWarm} 100%)`,
          boxShadow: `${CARD_SHADOW}, inset 0 1px 0 ${rgba('#ffffff', 0.85)}, inset 0 -2px 0 ${rgba(BAS.cardEdge, 0.9)}`,
          border: `1px solid ${shade(BAS.cardEdge, -0.06)}`,
          padding: '26px 26px 26px 44px',
          display: 'flex',
          gap: 34,
        }}
      >
        {/* textura de papel impreso (renglones muy tenues) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.32,
            backgroundImage: `repeating-linear-gradient(0deg, ${rgba(BAS.inkSoft, 0.09)} 0px, ${rgba(BAS.inkSoft, 0.09)} 1px, transparent 1px, transparent 26px)`,
          }}
        />
        {/* LOMO perforado a la izquierda */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 30,
            background: `linear-gradient(90deg, ${shade(BAS.cardEdge, -0.2)} 0%, ${BAS.cardWarm} 62%, ${rgba(BAS.cardEdge, 0)} 100%)`,
            boxShadow: `inset -1px 0 0 ${rgba(BAS.cardEdge, 0.9)}`,
          }}
        >
          {[0.2, 0.5, 0.8].map((f) => (
            <div
              key={f}
              style={{
                position: 'absolute',
                left: 8,
                top: `${f * 100}%`,
                marginTop: -8,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: rgba(BAS.bgDeep, 0.55),
                boxShadow: `inset 0 2px 3px ${rgba('#000000', 0.5)}, 0 1px 0 ${rgba('#ffffff', 0.7)}`,
              }}
            />
          ))}
        </div>

        {/* LÁMINA (foto real, enmarcada) */}
        <div style={{flex: '0 0 440px', position: 'relative', zIndex: 2}}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: 9,
              borderRadius: 8,
              background: `linear-gradient(160deg, ${shade(BAS.ink, 0.22)} 0%, ${BAS.ink} 100%)`,
              boxShadow: `0 14px 26px ${rgba(BAS.ink, 0.35)}, inset 0 1px 0 ${rgba('#ffffff', 0.16)}`,
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 4, overflow: 'hidden'}}>
              <Img
                src={staticFile(row.img)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${interpolate(rel, [0, 300], [1.1, 1.02], {...CL, easing: EIO})})`,
                  clipPath: `inset(0% 0% ${(1 - photoP) * 100}% 0%)`,
                }}
              />
              {/* brillo de papel fotográfico + oclusión de bordes */}
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(118deg, ${rgba('#ffffff', 0.2)} 0%, transparent 34%, transparent 74%, ${rgba(BAS.bgDeep, 0.3)} 100%)`}} />
              <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 40px ${rgba(BAS.bgDeep, 0.45)}`}} />
              {/* etiqueta pegada sobre la lámina */}
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 12,
                  opacity: ease(rel, 54, 80),
                  padding: '7px 14px',
                  borderRadius: 5,
                  background: rgba(BAS.card, 0.94),
                  boxShadow: `0 4px 10px ${rgba('#000000', 0.4)}`,
                  fontFamily: FONT_SANS,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  color: BAS.brand,
                }}
              >
                {PAGE_TAG[index] ? PAGE_TAG[index].toUpperCase() : 'LÁMINA'}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DE TEXTO */}
        <div style={{flex: 1, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16}}>
          {/* número de capítulo de la guía */}
          <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: ease(rel, 8, 34)}}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                background: `linear-gradient(170deg, ${BAS.brandLite} 0%, ${BAS.brand} 100%)`,
                borderLeft: `5px solid ${BAS.aqua}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT_NUM,
                fontSize: 26,
                fontWeight: 800,
                color: '#EAF6FA',
                boxShadow: `0 6px 14px ${rgba(BAS.ink, 0.32)}`,
              }}
            >
              {'0' + (index + 1)}
            </div>
            <div style={{fontFamily: FONT_SANS, fontSize: 21, fontWeight: 800, letterSpacing: 3, color: BAS.inkSoft}}>ADENTRO DE LA GUÍA</div>
          </div>

          {/* TÍTULO — revelado por máscara */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 50,
              fontWeight: 700,
              lineHeight: 1.06,
              color: BAS.ink,
              clipPath: `inset(-10% ${(1 - titleP) * 100}% -10% -2%)`,
              transform: `translateY(${(1 - titleP) * 10}px)`,
              textShadow: `0 1px 0 ${rgba('#ffffff', 0.7)}`,
            }}
          >
            {row.title}
          </div>

          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 30,
              lineHeight: 1.34,
              color: BAS.ink2,
              opacity: subP,
              transform: `translateY(${(1 - subP) * 12}px)`,
            }}
          >
            {row.sub}
          </div>

          {/* CIFRA grande con count-up */}
          {row.stat && !isNaN(statNum) ? (
            <div style={{display: 'flex', alignItems: 'baseline', gap: 14, opacity: statPop}}>
              {index === 0 ? (
                <div style={{fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 30, color: BAS.inkSoft, transform: 'translateY(-14px)'}}>casi</div>
              ) : null}
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontSize: 84,
                  fontWeight: 800,
                  lineHeight: 0.95,
                  color: BAS.brand,
                  transform: `scale(${interpolate(statPop, [0, 1], [0.86, 1])})`,
                  transformOrigin: '0% 100%',
                  textShadow: `0 1px 0 ${rgba('#ffffff', 0.9)}, 0 3px 6px ${rgba(BAS.ink, 0.2)}`,
                }}
              >
                {counted}
              </div>
              <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700, color: BAS.ink2}}>{row.statLabel}</div>
            </div>
          ) : null}

          <div style={{height: 2, background: `linear-gradient(90deg, ${rgba(BAS.aqua, 0.75)} 0%, ${rgba(BAS.cardEdge, 0)} 100%)`, width: `${ease(rel, 40, 90, EIO) * 100}%`}} />

          <Extras index={index} rel={rel} fps={fps} />
        </div>

        {/* folio impreso en la esquina */}
        <div style={{position: 'absolute', right: 22, bottom: 12, fontFamily: FONT_SERIF, fontSize: 20, color: BAS.inkSoft, opacity: 0.7}}>
          {'· ' + (index + 1) + ' ·'}
        </div>

        {/* BARRIDO de luz — una sola vez, al terminar de armarse */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            bottom: -80,
            left: `${glossX}%`,
            width: '26%',
            opacity: glossP * 0.55,
            background: `linear-gradient(96deg, transparent 0%, ${rgba('#ffffff', 0.9)} 50%, transparent 100%)`,
            transform: 'rotate(9deg)',
            pointerEvents: 'none',
          }}
        />
        {/* atenuación al retroceder en la pila */}
        <div style={{position: 'absolute', inset: 0, background: rgba(BAS.bgDeep, dim), pointerEvents: 'none'}} />
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────── escena */

export const MethodStackScene: React.FC<MethodStackSceneProps> = ({
  title = 'Lo que hay adentro de la guía',
  rows = DEFAULT_ROWS,
  stepFrames = 400,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const START = 60;
  const enterOf = (i: number) => START + i * stepFrames;
  const list = rows.slice(0, 4);

  /* ── CÁMARA: dolly-in de presentación → retroceso lentísimo + paneo + impulso por entrada */
  let push = 0;
  for (let i = 0; i < list.length; i++) {
    const e = enterOf(i);
    push += interpolate(frame, [e - 6, e + 12, e + 78], [0, 0.036, 0], CL);
  }
  const dolly =
    interpolate(frame, [0, 150], [0.8, 1.045], {...CL, easing: EOUT}) +
    interpolate(frame, [150, 1660], [0, -0.14], {...CL, easing: EIO}) +
    push;
  const panX = interpolate(frame, [0, 1660], [-46, 74], {...CL, easing: EIO}) + Math.sin(t * 0.29) * 7;
  const panY = interpolate(frame, [0, 1660], [30, -20], {...CL, easing: EIO}) + Math.cos(t * 0.23) * 5;
  const camRy = interpolate(frame, [0, 150, 1660], [-9, -2.2, 2.6], {...CL, easing: EIO}) + Math.sin(t * 0.19) * 0.5;
  const camRx = interpolate(frame, [0, 150, 1660], [-5.2, -1.4, -2.8], {...CL, easing: EIO}) + Math.cos(t * 0.17) * 0.3;

  /* ── cabecera: nace grande y centrada, se retira a la esquina cuando entra la primera página */
  const hM = interpolate(frame, [START, START + 78], [1, 0], {...CL, easing: EIO});
  const hKick = ease(frame, 6, 30);
  const hTitle = ease(frame, 14, 62, EIO);
  const hRule = ease(frame, 44, 96, EIO);
  const closing = ease(frame, 1500, 1560, EIO);
  const closeRule = ease(frame, 1524, 1600, EIO);

  /* ── halo aqua que respira + barrido general único al final */
  const breath = 0.5 + 0.5 * Math.sin(t * 0.85);
  const finalSweep = win(frame, 1470, 1500, 1560, 1600);
  const finalSweepX = interpolate(frame, [1470, 1600], [-30, 130], CL);

  return (
    <Sequence durationInFrames={1660}>
      <AbsoluteFill style={{background: `radial-gradient(122% 118% at 62% 16%, ${shade(BAS.aqua, -0.66)} 0%, ${BAS.bgPanel} 42%, ${BAS.bgDeep} 100%)`}}>
        {/* 2 · halo aqua que respira */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(46% 52% at 64% 44%, ${rgba(BAS.aqua, 0.1 + breath * 0.07)} 0%, transparent 72%)`,
            opacity: ease(frame, 0, 50),
          }}
        />
        {/* 3 · haces de luz sobre la mesa */}
        <AbsoluteFill style={{opacity: 0.5 * ease(frame, 6, 70), mixBlendMode: 'screen'}}>
          <div
            style={{
              position: 'absolute',
              top: -300,
              left: '30%',
              width: 620,
              height: 1700,
              background: `linear-gradient(180deg, ${rgba(BAS.aquaLite, 0.16)} 0%, transparent 62%)`,
              transform: `rotate(${13 + Math.sin(t * 0.21) * 1.2}deg)`,
              filter: 'blur(30px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -300,
              left: '62%',
              width: 420,
              height: 1700,
              background: `linear-gradient(180deg, ${rgba(BAS.amber, 0.08)} 0%, transparent 56%)`,
              transform: `rotate(${-9 + Math.cos(t * 0.18) * 1.1}deg)`,
              filter: 'blur(36px)',
            }}
          />
        </AbsoluteFill>
        {/* 4 · polvo en suspensión */}
        <DustLayer frame={frame} fps={fps} />

        {/* 5 + 6 · MESA y PILA de páginas (mundo 3D) */}
        <AbsoluteFill style={{perspective: PERSP, perspectiveOrigin: '52% 44%'}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: `translateX(${panX}px) translateY(${panY}px) scale(${dolly}) rotateY(${camRy}deg) rotateX(${camRx}deg)`,
            }}
          >
            {/* mesa en perspectiva + charco de luz */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 3400,
                height: 1900,
                marginLeft: -1700,
                marginTop: -950,
                transform: 'translate3d(0px, 640px, -360px) rotateX(76deg)',
                background: `radial-gradient(44% 40% at 52% 34%, ${rgba(BAS.aqua, 0.15)} 0%, ${rgba(BAS.bgPanel, 0.5)} 42%, transparent 74%)`,
                opacity: ease(frame, 10, 80, EIO),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 3400,
                height: 1900,
                marginLeft: -1700,
                marginTop: -950,
                transform: 'translate3d(0px, 642px, -362px) rotateX(76deg)',
                background: `repeating-linear-gradient(90deg, ${rgba(BAS.line, 0.22)} 0px, ${rgba(BAS.line, 0.22)} 2px, transparent 2px, transparent 148px)`,
                opacity: 0.34 * ease(frame, 20, 100, EIO),
              }}
            />

            {list.map((row, i) => {
              // edad continua = cuántas páginas entraron DESPUÉS de esta
              let ageF = 0;
              for (let j = i + 1; j < list.length; j++) {
                ageF += interpolate(frame, [enterOf(j) - 4, enterOf(j) + 62], [0, 1], {...CL, easing: EIO});
              }
              return <PaperPage key={row.img + String(i)} row={row} index={i} enter={enterOf(i)} ageF={ageF} />;
            })}
          </div>
        </AbsoluteFill>

        {/* 7 · CABECERA tipográfica (parallax amortiguado respecto de la cámara) */}
        <div
          style={{
            position: 'absolute',
            left: 78,
            top: 62,
            width: 520,
            transformOrigin: '0% 0%',
            transform: `translate(${hM * 300 + panX * 0.3}px, ${hM * 292 + panY * 0.3}px) scale(${1 + hM * 0.5}) rotate(${camRy * 0.1}deg)`,
          }}
        >
          <div style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 3.4, color: BAS.aqua, opacity: hKick}}>
            DR. BASTIDA · SALUD RENAL
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.06,
              color: '#F2F6F7',
              marginTop: 8,
              clipPath: `inset(-12% ${(1 - hTitle) * 100}% -12% -3%)`,
              textShadow: `0 4px 22px ${rgba('#000000', 0.72)}, 0 1px 0 ${rgba('#000000', 0.5)}`,
            }}
          >
            {title}
          </div>
          <div
            style={{
              height: 4,
              marginTop: 14,
              width: `${hRule * 78}%`,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${BAS.aqua} 0%, ${rgba(BAS.aqua, 0)} 100%)`,
              boxShadow: `0 0 16px ${rgba(BAS.aqua, 0.55 + breath * 0.25)}`,
            }}
          />
          {/* cierre — entrega a la escena del código */}
          <div
            style={{
              marginTop: 20,
              opacity: closing,
              transform: `translateY(${(1 - closing) * 14}px)`,
            }}
          >
            <div style={{fontFamily: FONT_SERIF, fontSize: 32, lineHeight: 1.24, color: BAS.onDark, textShadow: `0 3px 14px ${rgba('#000000', 0.75)}`}}>
              Todo esto, adentro de su guía.
            </div>
            <div style={{height: 3, marginTop: 10, width: `${closeRule * 62}%`, background: BAS.amber, boxShadow: `0 0 14px ${rgba(BAS.amber, 0.6)}`, borderRadius: 2}} />
          </div>
        </div>

        {/* 8 · RIEL de progreso (los cuatro bloques de la guía) */}
        <div style={{position: 'absolute', left: 700, right: 110, bottom: 62, transform: `translate(${panX * 0.16}px, ${panY * 0.16}px)`, opacity: ease(frame, 40, 80)}}>
          <div style={{display: 'flex', gap: 22}}>
            {list.map((row, i) => {
              const on = interpolate(frame, [enterOf(i), enterOf(i) + 34], [0, 1], {...CL, easing: EOUT});
              return (
                <div key={row.title} style={{flex: 1}}>
                  <div style={{height: 4, borderRadius: 2, background: rgba(BAS.onDark, 0.2), overflow: 'hidden'}}>
                    <div
                      style={{
                        height: '100%',
                        width: `${on * 100}%`,
                        background: `linear-gradient(90deg, ${BAS.aquaDark} 0%, ${BAS.aqua} 100%)`,
                        boxShadow: `0 0 12px ${rgba(BAS.aqua, 0.5 + breath * 0.25)}`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: FONT_SANS,
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: 1.1,
                      color: on > 0.5 ? BAS.onDark : rgba(BAS.onDark, 0.42),
                      textShadow: `0 2px 10px ${rgba('#000000', 0.7)}`,
                    }}
                  >
                    {RAIL_TAG[i] ? RAIL_TAG[i] : row.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 9 · barrido general (una sola vez) + viñeta + grano */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            bottom: -200,
            left: `${finalSweepX}%`,
            width: '22%',
            opacity: finalSweep * 0.2,
            background: `linear-gradient(96deg, transparent 0%, ${rgba(BAS.aquaLite, 0.85)} 50%, transparent 100%)`,
            transform: 'rotate(10deg)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(128% 112% at 56% 42%, transparent 48%, ${rgba(BAS.bgEdge, 0.62)} 100%)`,
          }}
        />
        <GrainOverlay opacity={0.05} />
      </AbsoluteFill>
    </Sequence>
  );
};

export default MethodStackScene;
