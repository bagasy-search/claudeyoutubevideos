/**
 * SplitFoodScene — EL CORTE (microescena 2.5D, familia "transformación / lateral").
 *
 * Idea visual: UN alimento entra ENTERO (una sola foto, en un marco de vidrio con canto y sombra
 * de contacto). Una HOJA DE LUZ cruza el encuadre y, en el frame exacto en que toca el centro,
 * el objeto SE PARTE: las dos mitades se apartan con inercia (overshoot + rebote), cada una
 * arrastrando su propia sombra, y cada una se convierte en su propio alimento — la mitad buena
 * a la izquierda (clima VERDE, limpio y aireado) y la que carga a la derecha (clima ROJO/ÁMBAR,
 * denso, con motas de hollín). El fondo se abre en dos detrás de ellas. Al final, el remate cae
 * en la herida que dejó el corte: una tarjeta de papel clínico CLARO, por delante de las dos
 * mitades (oclusión real), con la frase que el paciente se tiene que llevar.
 *
 * Material protagonista: VIDRIO (bisel, canto, especular que barre) + LUZ (la hoja del corte).
 * Los alimentos NUNCA se dibujan: son fotos reales dentro del vidrio.
 *
 * Profundidad — 7 planos con translateZ propio (parallax real por rotación de cámara):
 *   −300 atmósfera que se abre en dos · −170 halos+clima por lado · −45 sombras que viajan
 *      0 las dos mitades · +70 rótulos · +150 remate (papel claro) · +250 hoja de luz y motas
 *
 * Cámara: push-in no lineal + drift senoidal + micro rotateY/rotateX; impact-shake de 4 frames
 * en el corte y un reencuadre suave (pull-back) que recentra las dos mitades.
 *
 * Determinista: todo es función pura de useCurrentFrame() (partículas por índice con sin/cos).
 * Sin Math.random(), sin backdrop-filter, sin librerías externas.
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
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, GrainOverlay, rgba, shade} from './../theme';

/* ─────────────────────────── contrato ─────────────────────────── */

export type SplitFoodSceneProps = {
  wholeImg?: string; // 'img/bas7_broll_yema.jpg'
  goodImg?: string; // 'img/bas7_clara.jpg'
  badImg?: string; // 'img/bas7_broll_yema.jpg'
  goodLabel?: string; // 'LA CLARA'
  goodSub?: string; // 'la proteína que su músculo aprovecha entera'
  badLabel?: string; // 'LA YEMA'
  badSub?: string; // 'casi todo el fósforo del huevo'
  punchline?: string; // 'Muchas claras, poca yema'
  cutAt?: number; // frame del corte, default 60
};

/* ─────────────────────────── geometría / helpers ─────────────────────────── */

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const PERSP = 1600; // perspectiva de la escena
const CARD_W = 820; // ancho del objeto entero
const CARD_H = 520;
const HALF_W = CARD_W / 2;
const CARD_TOP = 180;
const CX = 960; // centro del encuadre
const SEP = 230; // cuánto se aparta cada mitad
const L_CX = CX - HALF_W / 2 - SEP; // centro final de la mitad buena  (525)
const R_CX = CX + HALF_W / 2 + SEP; // centro final de la mitad que carga (1395)

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Un plano de profundidad. La escala compensa la perspectiva para que el layout no cambie. */
const Plane: React.FC<{
  z: number;
  camX: number;
  camY: number;
  pf?: number;
  zIndex?: number;
  children: React.ReactNode;
}> = ({z, camX, camY, pf = 0, zIndex = 0, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex,
      transformStyle: 'preserve-3d',
      transform: `translate3d(${camX * pf}px, ${camY * pf}px, ${z}px) scale(${(PERSP - z) / PERSP})`,
    }}
  >
    {children}
  </div>
);

/** Marca de veredicto (SÍ / NO) — glifo dibujado, nunca un ícono stock. */
const Mark: React.FC<{kind: 'si' | 'no'; color: string; size?: number}> = ({kind, color, size = 22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {kind === 'si' ? (
      <path d="M4 12.6 L9.6 18.2 L20 5.8" stroke={color} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <>
        <path d="M6.2 6.2 L17.8 17.8" stroke={color} strokeWidth={3.6} strokeLinecap="round" />
        <path d="M17.8 6.2 L6.2 17.8" stroke={color} strokeWidth={3.6} strokeLinecap="round" />
      </>
    )}
  </svg>
);

type Side = 'L' | 'R';

/** Una mitad del objeto: marco de vidrio + la foto entera recortada + la foto del lado en crossfade. */
const HalfPanel: React.FC<{
  side: Side;
  wholeImg: string;
  sideImg: string;
  tx: number;
  ty: number;
  ry: number;
  rz: number;
  sc: number;
  sep: number;
  cross: number;
  climate: number;
  ignite: number;
  accent: string;
  frame: number;
}> = ({side, wholeImg, sideImg, tx, ty, ry, rz, sc, sep, cross, climate, ignite, accent, frame}) => {
  const isL = side === 'L';
  const innerR = interpolate(sep, [0, 1], [5, 22], CL);
  const outerR = 26;
  const shAlpha = 0.12 + 0.32 * clamp01(sep * 2);

  // especular que barre el vidrio (vuelve cada 108 frames — puro, sin random)
  const swp = ((frame + (isL ? 0 : 54)) % 108) / 108;
  const swpOp = swp < 0.3 ? Math.sin((swp / 0.3) * Math.PI) * 0.17 : 0;

  // el grado de color se separa en dos climas
  const gradeL = `saturate(${1 + 0.14 * climate}) brightness(${1 + 0.09 * climate}) contrast(${1 + 0.03 * climate})`;
  const gradeR = `saturate(${1 - 0.16 * climate}) brightness(${1 - 0.16 * climate}) sepia(${0.16 * climate})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: (isL ? CX - HALF_W : CX) + tx,
        top: CARD_TOP + ty,
        width: HALF_W,
        height: CARD_H,
        transformStyle: 'preserve-3d',
        transform: `perspective(1200px) rotateY(${ry}deg) rotate(${rz}deg) scale(${sc})`,
        transformOrigin: isL ? '86% 50%' : '14% 50%',
      }}
    >
      {/* marco de vidrio */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderTopLeftRadius: isL ? outerR : innerR,
          borderBottomLeftRadius: isL ? outerR : innerR,
          borderTopRightRadius: isL ? innerR : outerR,
          borderBottomRightRadius: isL ? innerR : outerR,
          borderTop: `1px solid ${rgba('#ffffff', 0.42)}`,
          borderBottom: `1px solid ${rgba('#ffffff', 0.16)}`,
          ...(isL
            ? {borderLeft: `1px solid ${rgba('#ffffff', 0.34)}`}
            : {borderRight: `1px solid ${rgba('#ffffff', 0.34)}`}),
          boxShadow: `0 ${18 + 16 * sep}px ${40 + 34 * sep}px ${rgba('#02121b', shAlpha)}, inset 0 1px 0 ${rgba(
            '#ffffff',
            0.3,
          )}, inset 0 -22px 40px ${rgba('#02121b', 0.34)}`,
          background: BAS.bgDeep,
        }}
      >
        {/* la foto ENTERA, recortada por mitad: las dos juntas forman UNA sola imagen */}
        <Img
          src={staticFile(wholeImg)}
          style={{
            position: 'absolute',
            top: 0,
            left: isL ? 0 : -HALF_W,
            width: CARD_W,
            height: CARD_H,
            objectFit: 'cover',
          }}
        />

        {/* la foto del LADO — entra en crossfade con un micro Ken-Burns */}
        <Img
          src={staticFile(sideImg)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: cross,
            transform: `scale(${interpolate(cross, [0, 1], [1.07, 1.0], CL)})`,
            filter: isL ? gradeL : gradeR,
          }}
        />

        {/* clima de luz dentro del vidrio */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isL
              ? `radial-gradient(88% 74% at 46% 24%, ${rgba(BAS.si, 0.3 * climate)} 0%, transparent 72%), linear-gradient(196deg, ${rgba(
                  '#ffffff',
                  0.2,
                )} 0%, transparent 44%)`
              : `radial-gradient(92% 80% at 54% 74%, ${rgba(BAS.no, 0.34 * climate)} 0%, transparent 74%), linear-gradient(158deg, ${rgba(
                  BAS.amber,
                  0.18 * climate,
                )} 0%, transparent 48%)`,
            mixBlendMode: 'screen',
          }}
        />
        {/* el lado que carga se pone DENSO */}
        {!isL && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(120% 110% at 50% 60%, transparent 34%, ${rgba('#1A0B06', 0.5 * climate)} 100%)`,
            }}
          />
        )}

        {/* especular del vidrio */}
        <div
          style={{
            position: 'absolute',
            top: -CARD_H * 0.3,
            bottom: -CARD_H * 0.3,
            left: `${interpolate(swp, [0, 0.3], [-40, 130], CL)}%`,
            width: '26%',
            background: `linear-gradient(100deg, transparent, ${rgba('#ffffff', 0.85)}, transparent)`,
            opacity: swpOp,
            transform: 'rotate(14deg)',
            mixBlendMode: 'screen',
          }}
        />

        {/* bisel superior del vidrio */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${rgba('#ffffff', 0.5)}, transparent)`,
          }}
        />
      </div>

      {/* FILO DEL CORTE — el canto recién partido, se enciende en el frame del corte */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          bottom: 2,
          ...(isL ? {right: -1} : {left: -1}),
          width: 4,
          borderRadius: 2,
          background: `linear-gradient(${rgba('#ffffff', 0)} 0%, ${rgba('#ffffff', 0.92)} 16%, ${accent} 50%, ${rgba(
            '#ffffff',
            0.86,
          )} 84%, ${rgba('#ffffff', 0)} 100%)`,
          opacity: ignite,
          boxShadow: `0 0 ${10 + 26 * ignite}px ${rgba(accent, 0.9 * ignite)}`,
        }}
      />
    </div>
  );
};

/* ─────────────────────────── la escena ─────────────────────────── */

export const SplitFoodScene: React.FC<SplitFoodSceneProps> = ({
  wholeImg = 'img/bas7_broll_yema.jpg',
  goodImg = 'img/bas7_clara.jpg',
  badImg = 'img/bas7_broll_yema.jpg',
  goodLabel = 'LA CLARA',
  goodSub = 'la proteína que su músculo aprovecha entera',
  badLabel = 'LA YEMA',
  badSub = 'casi todo el fósforo del huevo',
  punchline = 'Muchas claras, poca yema',
  cutAt = 60,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const C = cutAt;

  /* ── beats ── */
  const B = {
    card: 8,
    kick: 17,
    sub: 24,
    blade: C - 16,
    labelL: C + 14,
    subL: C + 21,
    labelR: C + 25,
    subR: C + 32,
    punch: C + 66,
  };

  /* ── el corte ── */
  const st = frame - C;
  const shake = st >= 0 && st < 4 ? Math.sin(st * 2.6) * (1 - st / 4) : 0;
  const flash = st >= 0 && st < 3 ? Math.sin(((st + 0.4) / 3) * Math.PI) * 0.3 : 0;
  const jolt = st >= 0 && st < 7 ? Math.sin((st / 7) * Math.PI) * 0.013 : 0;

  // separación con inercia: spring subamortiguado → overshoot ~11% y rebote leve
  const sep = spring({frame: frame - C, fps, config: {damping: 10, mass: 0.85, stiffness: 92}});
  const cross = interpolate(frame, [C + 3, C + 19], [0, 1], {...CL, easing: easeOut});
  const climate = interpolate(frame, [C, C + 28], [0, 1], CL);
  const ignite = interpolate(frame, [C - 2, C + 1, C + 16], [0, 1, 0.32], CL);
  const antic = interpolate(frame, [C - 9, C - 1, C], [0, 1, 0], CL); // anticipación: se comprime
  const preOpa = interpolate(frame, [C - 4, C + 8], [1, 0], CL); // lo que vivía antes del corte

  /* ── hoja de luz ── */
  const bladeOn = interpolate(frame, [C - 16, C - 11, C + 9, C + 15], [0, 1, 1, 0], CL);
  const bladeX =
    frame < C
      ? interpolate(frame, [C - 16, C], [-240, CX], {...CL, easing: Easing.in(Easing.quad)})
      : interpolate(frame, [C, C + 15], [CX, 2200], {...CL, easing: Easing.out(Easing.quad)});

  /* ── cámara viva ── */
  const enter = spring({frame: frame - B.card, fps, config: {damping: 120, mass: 0.95}});
  const push = interpolate(frame, [0, 54], [0.945, 1.032], {...CL, easing: easeOut});
  const reframe = interpolate(frame, [C + 4, C + 36], [0, 1], {...CL, easing: easeOut}); // recentra las dos mitades
  const camScale = push - 0.052 * reframe + jolt;
  const camX = Math.sin(t * 0.55) * 9 + shake * 7;
  const camY = Math.cos(t * 0.41) * 5 + shake * 5 - 12 * reframe;
  const camRY = interpolate(frame, [0, 56], [-5.2, -1.1], {...CL, easing: easeOut}) + Math.sin(t * 0.33) * 0.5 + reframe * 0.8;
  const camRX = interpolate(frame, [0, 56], [-3.2, -0.8], {...CL, easing: easeOut}) + Math.sin(t * 0.27) * 0.32;

  /* ── transformación de cada mitad ── */
  const bob = (ph: number) => Math.sin(t * 0.9 + ph) * 3;
  const drift = (ph: number) => Math.sin(t * 1.05 + ph) * 2.2 * clamp01(sep);
  const half = (dir: number, ph: number) => ({
    tx: dir * SEP * sep + drift(ph),
    ty: dir * 8 * sep + bob(ph) * clamp01(sep),
    ry: dir * 6 * sep,
    rz: dir * 1.6 * sep,
    sc: interpolate(sep, [0, 1], [1, 0.94], CL) * interpolate(enter, [0, 1], [0.9, 1], CL),
  });
  const HL = half(-1, 0);
  const HR = half(1, 1.7);

  /* ── entradas de rótulos y remate ── */
  const sp = (delay: number, damping = 120, mass = 0.9) =>
    spring({frame: frame - delay, fps, config: {damping, mass}});
  const labL = sp(B.labelL, 16, 0.9);
  const subLs = sp(B.subL, 120);
  const labR = sp(B.labelR, 16, 0.9);
  const subRs = sp(B.subR, 120);
  const punchS = sp(B.punch, 15, 0.95);
  const punchBreath = 1 + Math.sin(t * 0.85) * 0.004;
  const sheen = ((frame + 30) % 132) / 132;
  const sheenOp = sheen < 0.26 ? Math.sin((sheen / 0.26) * Math.PI) * 0.5 : 0;

  /* ── entrada del objeto entero ── */
  const enterY = interpolate(enter, [0, 1], [86, 0], CL);
  const groupScale = `scaleX(${1 - 0.017 * antic}) scaleY(${1 + 0.021 * antic})`;

  /* ── rótulos: bloque por lado ── */
  const LabelBlock: React.FC<{
    cx: number;
    label: string;
    sub: string;
    accent: string;
    kind: 'si' | 'no';
    inLab: number;
    inSub: number;
  }> = ({cx, label, sub, accent, kind, inLab, inSub}) => (
    <div style={{position: 'absolute', left: cx - 270, top: 726, width: 540, textAlign: 'center'}}>
      {/* chip de veredicto */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: `radial-gradient(70% 70% at 40% 30%, ${shade(accent, 0.28)}, ${accent})`,
          boxShadow: `0 10px 24px ${rgba('#02121b', 0.5)}, 0 0 22px ${rgba(accent, 0.5)}, inset 0 1px 0 ${rgba(
            '#ffffff',
            0.5,
          )}`,
          opacity: inLab,
          transform: `scale(${interpolate(inLab, [0, 1], [0.5, 1], CL)})`,
        }}
      >
        <Mark kind={kind} color={kind === 'si' ? BAS.onSi : BAS.onNo} size={22} />
      </div>

      {/* nombre grande */}
      <div
        style={{
          marginTop: 12,
          fontFamily: FONT_DISPLAY,
          fontSize: 60,
          fontWeight: 700,
          letterSpacing: 1.5,
          lineHeight: 1.02,
          color: shade(BAS.onDark, 0.5),
          textShadow: `0 2px 0 ${rgba('#02121b', 0.42)}, 0 16px 34px ${rgba('#02121b', 0.55)}`,
          opacity: inLab,
          transform: `translateY(${interpolate(inLab, [0, 1], [26, 0], CL)}px)`,
        }}
      >
        {label}
      </div>

      {/* filete del lado */}
      <div
        style={{
          margin: '14px auto 0',
          height: 3,
          width: interpolate(inLab, [0, 1], [0, 230], CL),
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 16px ${rgba(accent, 0.7)}`,
        }}
      />

      {/* línea de detalle */}
      <div
        style={{
          margin: '14px auto 0',
          maxWidth: 470,
          fontFamily: FONT_SANS,
          fontSize: 31,
          fontWeight: 500,
          lineHeight: 1.32,
          color: rgba(BAS.onDark, 0.9),
          textShadow: `0 6px 18px ${rgba('#02121b', 0.6)}`,
          opacity: inSub,
          transform: `translateY(${interpolate(inSub, [0, 1], [16, 0], CL)}px)`,
        }}
      >
        {sub}
      </div>
    </div>
  );

  return (
    <Sequence durationInFrames={420} layout="none" name="SplitFoodScene">
      <AbsoluteFill
        style={{
          background: `radial-gradient(78% 88% at 50% 40%, ${BAS.bgPanel} 0%, ${BAS.bg} 52%, ${BAS.bgDeep} 100%)`,
          overflow: 'hidden',
        }}
      >
        <AbsoluteFill style={{perspective: PERSP, perspectiveOrigin: '50% 44%'}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 44%',
              transform: `translate3d(${camX}px, ${camY}px, 0) rotateY(${camRY}deg) rotateX(${camRX}deg) rotate(${
                shake * 0.5
              }deg) scale(${camScale})`,
            }}
          >
            {/* ── PLANO 1 · atmósfera: el fondo se abre en dos ── */}
            <Plane z={-300} camX={camX} camY={camY} pf={-0.55} zIndex={1}>
              <AbsoluteFill
                style={{
                  background: `radial-gradient(34% 42% at 50% 42%, ${rgba(BAS.aqua, 0.16)} 0%, transparent 72%)`,
                  opacity: interpolate(frame, [0, 14], [0, 1], CL) * preOpa,
                }}
              />
              <AbsoluteFill
                style={{
                  background: `radial-gradient(58% 78% at 24% 46%, ${rgba(BAS.si, 0.2)} 0%, transparent 70%)`,
                  opacity: climate,
                }}
              />
              <AbsoluteFill
                style={{
                  background: `radial-gradient(58% 82% at 76% 50%, ${rgba(BAS.no, 0.19)} 0%, transparent 68%), radial-gradient(46% 46% at 82% 76%, ${rgba(
                    BAS.amber,
                    0.14,
                  )} 0%, transparent 72%)`,
                  opacity: climate,
                }}
              />
              {/* la costura oscura entre los dos climas, que se abre */}
              <AbsoluteFill
                style={{
                  background: `linear-gradient(90deg, transparent ${46 - 5 * sep}%, ${rgba(
                    BAS.bgEdge,
                    0.62,
                  )} 50%, transparent ${54 + 5 * sep}%)`,
                  opacity: climate,
                }}
              />
              {/* piso */}
              <AbsoluteFill
                style={{
                  background: `linear-gradient(0deg, ${rgba(BAS.bgEdge, 0.75)} 0%, transparent 26%)`,
                }}
              />
            </Plane>

            {/* ── PLANO 2 · halos por lado + partículas de cada clima ── */}
            <Plane z={-170} camX={camX} camY={camY} pf={-0.28} zIndex={2}>
              {/* haces limpios del lado bueno */}
              {[0, 1, 2].map((i) => (
                <div
                  key={`shaft${i}`}
                  style={{
                    position: 'absolute',
                    left: `${8 + i * 11 + Math.sin(t * 0.3 + i) * 0.8}%`,
                    top: '-20%',
                    width: 120 + i * 40,
                    height: '140%',
                    background: `linear-gradient(180deg, ${rgba(BAS.si, 0.14)} 0%, transparent 68%)`,
                    transform: 'rotate(9deg)',
                    opacity: climate * (0.5 + 0.2 * Math.sin(t * 0.5 + i * 1.3)),
                    mixBlendMode: 'screen',
                  }}
                />
              ))}
              {/* chispas limpias (izquierda) */}
              {Array.from({length: 18}).map((_, i) => {
                const s1 = (i * 41.7) % 100;
                const s2 = (i * 73.3) % 100;
                const speed = 4 + (s2 % 5);
                const p = ((t * speed + s1 * 1.9) % 130) / 130;
                const size = 2 + (s2 % 3);
                return (
                  <div
                    key={`sp${i}`}
                    style={{
                      position: 'absolute',
                      left: `${3 + (s1 / 100) * 40}%`,
                      top: `${106 - p * 122}%`,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: shade(BAS.si, 0.55),
                      opacity: Math.sin(p * Math.PI) * (0.22 + (s1 % 24) / 100) * climate,
                      boxShadow: `0 0 ${size * 4}px ${rgba(BAS.si, 0.8)}`,
                    }}
                  />
                );
              })}
              {/* hollín denso (derecha) */}
              {Array.from({length: 26}).map((_, i) => {
                const s1 = (i * 57.9) % 100;
                const s2 = (i * 31.4) % 100;
                const speed = 2 + (s2 % 4);
                const p = ((t * speed + s1 * 2.4) % 150) / 150;
                const size = 3 + (s2 % 5);
                return (
                  <div
                    key={`du${i}`}
                    style={{
                      position: 'absolute',
                      left: `${55 + (s1 / 100) * 42 + Math.sin(t * 0.45 + i) * 0.7}%`,
                      top: `${-8 + p * 118}%`,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: s2 % 3 === 0 ? rgba(BAS.amber, 0.85) : rgba('#3A2A22', 0.9),
                      filter: s2 % 4 === 0 ? 'blur(1.4px)' : undefined,
                      opacity: Math.sin(p * Math.PI) * (0.2 + (s1 % 30) / 100) * climate,
                    }}
                  />
                );
              })}
            </Plane>

            {/* ── PLANO 3 · sombras que viajan con cada mitad ── */}
            <Plane z={-45} camX={camX} camY={camY} pf={-0.05} zIndex={3}>
              {/* sombra del objeto ENTERO (antes del corte) */}
              <div
                style={{
                  position: 'absolute',
                  left: CX - CARD_W / 2 + 26,
                  top: CARD_TOP + CARD_H - 54 + enterY * 0.35,
                  width: CARD_W - 52,
                  height: 96,
                  borderRadius: '50%',
                  background: `radial-gradient(50% 50% at 50% 50%, ${rgba('#010A11', 0.82)} 0%, transparent 72%)`,
                  filter: 'blur(24px)',
                  opacity: (1 - clamp01(sep * 4)) * enter,
                }}
              />
              {/* sombra propia de cada mitad */}
              {[
                {h: HL, dir: -1, cx: CX - HALF_W / 2},
                {h: HR, dir: 1, cx: CX + HALF_W / 2},
              ].map(({h, dir, cx}, i) => (
                <div
                  key={`sh${i}`}
                  style={{
                    position: 'absolute',
                    left: cx - (HALF_W - 46) / 2 + h.tx + dir * 12 * sep,
                    top: CARD_TOP + CARD_H - 58 + h.ty,
                    width: HALF_W - 46,
                    height: 86,
                    borderRadius: '50%',
                    background: `radial-gradient(50% 50% at 50% 50%, ${rgba('#010A11', 0.8)} 0%, transparent 72%)`,
                    filter: `blur(${20 + 10 * sep}px)`,
                    opacity: clamp01(sep * 4) * 0.95,
                  }}
                />
              ))}
              {/* la HERIDA: la columna de luz que queda en el hueco del corte */}
              <div
                style={{
                  position: 'absolute',
                  left: CX - 26,
                  top: CARD_TOP - 40,
                  width: 52,
                  height: CARD_H + 80,
                  background: `linear-gradient(180deg, transparent 0%, ${rgba(BAS.aquaLite, 0.5)} 24%, ${rgba(
                    BAS.aqua,
                    0.42,
                  )} 62%, transparent 100%)`,
                  filter: 'blur(14px)',
                  opacity:
                    interpolate(frame, [C - 1, C + 2, C + 26], [0, 1, 0.34], CL) *
                    (0.75 + 0.25 * Math.sin(t * 1.6)) *
                    (1 - 0.55 * punchS),
                  mixBlendMode: 'screen',
                }}
              />
            </Plane>

            {/* ── PLANO 4 · LAS DOS MITADES ── */}
            <Plane z={0} camX={camX} camY={camY} pf={0.1} zIndex={4}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformStyle: 'preserve-3d',
                  transformOrigin: `${CX}px ${CARD_TOP + CARD_H / 2}px`,
                  transform: `translateY(${enterY}px) ${groupScale}`,
                  opacity: enter,
                }}
              >
                <HalfPanel
                  side="L"
                  wholeImg={wholeImg}
                  sideImg={goodImg}
                  tx={HL.tx}
                  ty={HL.ty}
                  ry={HL.ry}
                  rz={HL.rz}
                  sc={HL.sc}
                  sep={sep}
                  cross={cross}
                  climate={climate}
                  ignite={ignite}
                  accent={shade(BAS.si, 0.4)}
                  frame={frame}
                />
                <HalfPanel
                  side="R"
                  wholeImg={wholeImg}
                  sideImg={badImg}
                  tx={HR.tx}
                  ty={HR.ty}
                  ry={HR.ry}
                  rz={HR.rz}
                  sc={HR.sc}
                  sep={sep}
                  cross={cross}
                  climate={climate}
                  ignite={ignite}
                  accent={shade(BAS.no, 0.34)}
                  frame={frame}
                />
              </div>
            </Plane>

            {/* ── PLANO 5 · rótulos ── */}
            <Plane z={70} camX={camX} camY={camY} pf={0.34} zIndex={5}>
              {/* kicker de apertura (antes del corte) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 60,
                  textAlign: 'center',
                  opacity: preOpa * interpolate(frame, [B.kick, B.kick + 10], [0, 1], CL),
                  transform: `translateY(${interpolate(frame, [B.kick, B.kick + 14], [14, 0], {...CL, easing: easeOut})}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: 9,
                    color: BAS.aqua,
                    textShadow: `0 0 22px ${rgba(BAS.aqua, 0.5)}`,
                  }}
                >
                  EL MISMO ALIMENTO
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: FONT_DISPLAY,
                    fontSize: 44,
                    fontWeight: 600,
                    color: shade(BAS.onDark, 0.42),
                    opacity: interpolate(frame, [B.sub, B.sub + 12], [0, 1], CL),
                    textShadow: `0 10px 26px ${rgba('#02121b', 0.6)}`,
                  }}
                >
                  dos alimentos distintos
                </div>
              </div>

              {/* después del corte: la orden */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 72,
                  textAlign: 'center',
                  opacity: interpolate(frame, [C + 10, C + 24], [0, 1], CL),
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '9px 30px',
                    borderRadius: 999,
                    border: `1px solid ${rgba(BAS.aqua, 0.5)}`,
                    background: rgba(BAS.bgDeep, 0.55),
                    fontFamily: FONT_SANS,
                    fontSize: 25,
                    fontWeight: 800,
                    letterSpacing: 8,
                    color: BAS.aquaLite,
                    textShadow: `0 0 20px ${rgba(BAS.aqua, 0.55)}`,
                  }}
                >
                  SEPÁRELOS
                </span>
              </div>

              <LabelBlock
                cx={L_CX}
                label={goodLabel}
                sub={goodSub}
                accent={BAS.si}
                kind="si"
                inLab={labL}
                inSub={subLs}
              />
              <LabelBlock cx={R_CX} label={badLabel} sub={badSub} accent={BAS.no} kind="no" inLab={labR} inSub={subRs} />
            </Plane>

            {/* ── PLANO 6 · REMATE: papel clínico claro en la herida del corte ── */}
            <Plane z={150} camX={camX} camY={camY} pf={0.5} zIndex={6}>
              <div
                style={{
                  position: 'absolute',
                  left: CX - 270,
                  top: 296,
                  width: 540,
                  borderRadius: 24,
                  padding: '32px 38px 36px',
                  background: `linear-gradient(168deg, ${BAS.card} 0%, ${BAS.cardWarm} 100%)`,
                  border: `1px solid ${BAS.cardEdge}`,
                  boxShadow: CARD_SHADOW,
                  textAlign: 'center',
                  overflow: 'hidden',
                  opacity: punchS,
                  transformOrigin: '50% 100%',
                  transform: `translateY(${interpolate(punchS, [0, 1], [74, 0], CL)}px) rotateX(${interpolate(
                    punchS,
                    [0, 1],
                    [20, 0],
                    CL,
                  )}deg) scale(${interpolate(punchS, [0, 1], [0.92, 1], CL) * punchBreath})`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: 7,
                    color: BAS.inkSoft,
                  }}
                >
                  RECUERDE
                </div>
                <div
                  style={{
                    margin: '14px auto 18px',
                    width: 64,
                    height: 3,
                    borderRadius: 2,
                    background: BAS.aqua,
                    boxShadow: `0 0 14px ${rgba(BAS.aqua, 0.7)}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 46,
                    fontWeight: 700,
                    lineHeight: 1.14,
                    color: BAS.ink,
                  }}
                >
                  {punchline}
                </div>
                {/* brillo que barre el papel en el hold */}
                <div
                  style={{
                    position: 'absolute',
                    top: -120,
                    bottom: -120,
                    left: `${interpolate(sheen, [0, 0.26], [-30, 120], CL)}%`,
                    width: '30%',
                    background: `linear-gradient(100deg, transparent, ${rgba('#ffffff', 0.7)}, transparent)`,
                    opacity: sheenOp * punchS,
                    transform: 'rotate(12deg)',
                  }}
                />
              </div>
            </Plane>

            {/* ── PLANO 7 · la HOJA DE LUZ y el destello del corte ── */}
            <Plane z={250} camX={camX} camY={camY} pf={0.9} zIndex={7}>
              <div
                style={{
                  position: 'absolute',
                  left: bladeX - 90,
                  top: -140,
                  width: 180,
                  height: '150%',
                  opacity: bladeOn,
                  transform: 'rotate(4deg)',
                  mixBlendMode: 'screen',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(90deg, transparent 0%, ${rgba(BAS.aqua, 0.24)} 44%, ${rgba(
                      BAS.aquaLite,
                      0.42,
                    )} 50%, ${rgba(BAS.aqua, 0.24)} 56%, transparent 100%)`,
                    filter: 'blur(10px)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 87,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: `linear-gradient(180deg, transparent, ${rgba('#ffffff', 0.95)} 22%, #ffffff 50%, ${rgba(
                      '#ffffff',
                      0.95,
                    )} 78%, transparent)`,
                    boxShadow: `0 0 26px ${rgba(BAS.aquaLite, 0.95)}`,
                  }}
                />
              </div>

              {/* destello del corte — 3 frames, suave */}
              <AbsoluteFill
                style={{
                  background: `radial-gradient(38% 46% at 50% 44%, ${rgba(BAS.aquaLite, 0.9)} 0%, ${rgba(
                    BAS.aqua,
                    0.3,
                  )} 42%, transparent 74%)`,
                  opacity: flash,
                  mixBlendMode: 'screen',
                }}
              />

              {/* esquirlas de luz que salen del corte */}
              {Array.from({length: 12}).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const life = interpolate(frame, [C, C + 22], [0, 1], CL);
                const d = 40 + life * (170 + (i % 4) * 46);
                return (
                  <div
                    key={`shard${i}`}
                    style={{
                      position: 'absolute',
                      left: CX + Math.cos(a) * d * 1.5 - 2,
                      top: CARD_TOP + CARD_H / 2 + Math.sin(a) * d - 2,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: shade(BAS.aquaLite, 0.4),
                      opacity: (1 - life) * 0.9 * (life > 0 ? 1 : 0),
                      boxShadow: `0 0 12px ${rgba(BAS.aquaLite, 0.9)}`,
                    }}
                  />
                );
              })}
            </Plane>
          </div>
        </AbsoluteFill>

        {/* viñeta fría + grano */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(126% 114% at 50% 44%, transparent 54%, ${rgba(BAS.bgEdge, 0.62)} 100%)`,
          }}
        />
        <GrainOverlay opacity={0.05} />
      </AbsoluteFill>
    </Sequence>
  );
};

export default SplitFoodScene;
