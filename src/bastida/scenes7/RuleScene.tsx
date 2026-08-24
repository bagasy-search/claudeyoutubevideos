/**
 * RuleScene — LA REGLA DE ORO · microescena 2.5D dirigida (estándar `microescenas_2_5d.md`).
 *
 * IDEA VISUAL: la escena es una MESA DE EXAMEN. A un lado, el objeto REAL (foto) montado en una
 * placa de vidrio ahumado que flota adelantada y se "mide" con un calibre de luz; al otro, la
 * PREGUNTA que el espectador se hace frente al plato — escrita palabra por palabra sobre el navy —
 * y, cuando la duda ya pesa, la RESPUESTA aterriza en PAPEL CLÍNICO CLARO, la golpean dos corchetes
 * de acento (sello) y un subrayado a mano se dibuja debajo. La nota entra última, al margen.
 *
 * DRAMATURGIA: presentación (la pregunta) → tensión (el objeto se acerca, el "?" se dibuja, el
 * calibre mide) → resolución (el papel aterriza con golpe de cámara y el subrayado la firma).
 *
 * PROFUNDIDAD REAL: perspective 1600 + `preserve-3d` + 7 planos con translateZ propio
 *   −220 atmósfera · −150 motas · −92 halo del acento · −40 "?" grabado · +34 FOTO en vidrio
 *   (parallax propio, contra-drift) · +76 bloque de texto · +102 papel de la respuesta
 *   · +150 sello/corchetes al frente.
 *
 * PURO: todo sale de `useCurrentFrame()` (el farm rinde en chunks paralelos). Sin `backdrop-filter`.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BAS,
  CARD_SHADOW,
  CoolVignette,
  FONT_DISPLAY,
  FONT_SANS,
  GrainOverlay,
  WaterMotes,
  rgba,
  shade,
} from '../theme';

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.cubic);
const easeCine = Easing.bezier(0.22, 1, 0.3, 1); // arranque rápido, cola larguísima (no constante)
const easeIO = Easing.bezier(0.4, 0, 0.2, 1);

const PERSP = 1600;

/** Actos (frames @ la escena arranca en 0). */
const T = {
  photo: 3, // 0-25  ambiente + foto
  kicker: 18,
  question: 26, // 25-60 la pregunta se escribe con peso
  tension: 60, // 60-95 push de la foto + "?" grabado + calibre
  answer: 95, // 95-130 aterriza el papel + golpe
  bracket: 103,
  underline: 108,
  note: 132, // 130+ hold vivo
};

export type RuleSceneProps = {
  kicker?: string; // 'La regla de oro'
  question: string;
  answer: string;
  note?: string;
  img?: string; // ruta relativa a public/, ej 'img/bas7_broll_palma.jpg'
  accent?: string; // default BAS.aqua
  imgSide?: 'left' | 'right';
};

export const RuleScene: React.FC<RuleSceneProps> = ({
  kicker = 'La regla de oro',
  question,
  answer,
  note,
  img,
  accent = BAS.aqua,
  imgSide = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  const acc = accent;
  const accLite = shade(acc, 0.42);
  const accDeep = shade(acc, -0.5);
  const left = imgSide === 'left';
  const dir = left ? 1 : -1;

  // ---------- geometría (1920×1080 de referencia, escalada al canvas real) ----------
  const K = Math.min(width / 1920, height / 1080);
  const PHOTO_W = 660;
  const PHOTO_H = 800;
  const photoX = left ? 108 : 1920 - 108 - PHOTO_W; // esquina izq. de la placa
  const colX = left ? 848 : 112; // esquina izq. de la columna de texto
  const COL_W = 960;

  // ---------- CÁMARA (push-in con easing no constante + drift senoidal + micro rotateY) ----------
  const camP = interpolate(frame, [0, 74], [0, 1], {...CL, easing: easeCine});
  const settle = interpolate(frame, [74, 300], [0, 0.026], CL); // el push nunca termina del todo
  const sk = frame - T.answer;
  const shake = sk >= 0 && sk < 5 ? Math.sin(sk * 2.55) * 5.4 * (1 - sk / 5) : 0; // impact-shake 4f
  const bk = frame - T.bracket;
  const shake2 = bk >= 0 && bk < 4 ? Math.sin(bk * 3.1) * 2.2 * (1 - bk / 4) : 0;

  const dolly = interpolate(camP, [0, 1], [0.948, 1.022]) + settle + (sk >= 0 && sk < 6 ? Math.sin((sk / 6) * Math.PI) * 0.014 : 0);
  const ry = interpolate(camP, [0, 1], [6.4 * dir, 1.1 * dir]) + Math.sin(t * 0.42) * 0.42;
  const rx = interpolate(camP, [0, 1], [-3.4, -0.75]) + Math.sin(t * 0.29) * 0.22;
  const panX = interpolate(camP, [0, 1], [-22 * dir, 0]) + Math.sin(t * 0.37) * 3.2 + shake + shake2;
  const panY = interpolate(camP, [0, 1], [14, 0]) + Math.sin(t * 0.25) * 2.6 + shake * 0.45;

  /** Plano a profundidad `z`. La escala compensa a medias: queda ganancia de tamaño Y parallax real. */
  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${z}px) scale(${(PERSP - z * 0.55) / PERSP})`,
        ...style,
      }}
    >
      {children}
    </div>
  );

  // ---------- ACTO 1 · ambiente + foto ----------
  const amb = interpolate(frame, [0, 22], [0, 1], {...CL, easing: easeOut});
  const photoS = spring({frame: frame - T.photo, fps, config: {damping: 140, mass: 1.05}});
  const photoBlur = interpolate(frame, [T.photo, T.photo + 22], [9, 0], CL);
  const sweep = ((frame % 168) / 168) * 168 - 34; // barrido de luz sobre el vidrio (permanente)
  const halo = 0.72 + Math.sin(t * 0.85) * 0.16 + (sk >= 0 && sk < 26 ? interpolate(frame, [T.answer, T.answer + 8, T.answer + 26], [0, 0.42, 0], CL) : 0);

  // ---------- ACTO 2 · la pregunta ----------
  const kickP = interpolate(frame, [T.kicker, T.kicker + 12], [0, 1], {...CL, easing: easeOut});
  const kickRule = interpolate(frame, [T.kicker + 4, T.kicker + 24], [0, 1], {...CL, easing: easeIO});
  const words = question.split(' ').filter(Boolean);
  const qSize = question.length <= 32 ? 74 : question.length <= 48 ? 66 : 60;
  // al aterrizar la respuesta, la pregunta cede el foco (focus-pull)
  const qFade = interpolate(frame, [T.answer - 4, T.answer + 12], [1, 0.6], CL);
  const qSoft = interpolate(frame, [T.answer - 4, T.answer + 12], [0, 1.3], CL);

  // ---------- ACTO 3 · tensión ----------
  const hasQ = question.includes('?') || question.includes('¿');
  const markP = interpolate(frame, [T.tension + 2, T.tension + 26], [0, 1], {...CL, easing: easeIO});
  const caliP = interpolate(frame, [T.tension + 4, T.tension + 28], [0, 1], {...CL, easing: easeOut});
  const caliTick = interpolate(frame, [T.tension + 24, T.tension + 32], [0, 1], CL);
  // push del objeto: se acerca en la duda y retrocede un pelo cuando llega la respuesta
  const photoPush =
    interpolate(frame, [T.tension, T.tension + 20], [0, 1], {...CL, easing: easeOut}) * 0.052 -
    interpolate(frame, [T.answer, T.answer + 16], [0, 1], {...CL, easing: easeOut}) * 0.026;
  const kb = 1.06 + interpolate(frame, [0, 420], [0, 0.075], CL) + Math.sin(t * 0.33) * 0.004; // Ken-Burns continuo
  const guideP = interpolate(frame, [T.tension + 16, T.answer - 2], [0, 1], {...CL, easing: easeIO});
  const guideOut = interpolate(frame, [T.answer, T.answer + 10], [1, 0], CL);

  // ---------- ACTO 4 · la respuesta ----------
  const ansS = spring({frame: frame - T.answer, fps, config: {damping: 13, mass: 0.62, stiffness: 130}});
  const ansIn = interpolate(frame, [T.answer, T.answer + 10], [0, 1], {...CL, easing: easeOut});
  const barP = interpolate(frame, [T.answer + 3, T.answer + 17], [0, 1], {...CL, easing: easeIO});
  const braS = spring({frame: frame - T.bracket, fps, config: {damping: 11, mass: 0.5, stiffness: 150}});
  const ring = interpolate(frame, [T.bracket, T.bracket + 16], [0, 1], CL);
  const uP = interpolate(frame, [T.underline, T.underline + 16], [0, 1], {...CL, easing: easeIO});
  const aSize = answer.length <= 24 ? 66 : answer.length <= 34 ? 58 : 52;

  // ---------- ACTO 5 · hold vivo ----------
  const noteS = spring({frame: frame - T.note, fps, config: {damping: 150, mass: 1}});

  const ANS_TOP = 586;
  const NOTE_TOP = 872;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(86% 92% at ${left ? 34 : 66}% 38%, ${shade(acc, -0.66)} 0%, ${BAS.bgPanel} 46%, ${BAS.bgDeep} 100%)`,
        overflow: 'hidden',
        perspective: PERSP,
        perspectiveOrigin: `${left ? 46 : 54}% 46%`,
      }}
    >
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) translate(${panX}px, ${panY}px) scale(${dolly})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* escala de referencia 1920×1080 → canvas real */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 1920,
            height: 1080,
            marginLeft: -960,
            marginTop: -540,
            transform: `scale(${K})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ═══ z −220 · ATMÓSFERA (niebla que respira + suelo) ═══ */}
          <Layer z={-220}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: amb,
                background: `radial-gradient(58% 62% at ${left ? 30 : 70}% ${44 + Math.sin(t * 0.3) * 2}%, ${rgba(acc, 0.16)} 0%, transparent 72%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 420,
                opacity: amb * 0.8,
                background: `linear-gradient(transparent, ${rgba(accDeep, 0.34)})`,
              }}
            />
          </Layer>

          {/* ═══ z −150 · MOTAS / polvo en suspensión (nunca se detiene) ═══ */}
          <Layer z={-150} style={{opacity: 0.9 * amb}}>
            <WaterMotes count={16} frame={frame} fps={fps} />
            {Array.from({length: 9}).map((_, i) => {
              const s = (i * 83.7) % 100;
              const y = ((t * (3 + (s % 4)) + s * 2.4) % 122) - 11;
              const r = 3 + (s % 5);
              return (
                <div
                  key={`d${i}`}
                  style={{
                    position: 'absolute',
                    left: `${(s * 0.86 + 6) % 96}%`,
                    top: `${y}%`,
                    width: r,
                    height: r,
                    borderRadius: '50%',
                    background: accLite,
                    opacity: 0.1 + (s % 24) / 150,
                    filter: 'blur(1px)',
                    boxShadow: `0 0 ${r * 4}px ${rgba(acc, 0.5)}`,
                  }}
                />
              );
            })}
          </Layer>

          {/* ═══ z −92 · HALO DEL ACENTO detrás de la foto (latido) ═══ */}
          <Layer z={-92} style={{opacity: amb}}>
            <div
              style={{
                position: 'absolute',
                left: photoX - 150,
                top: 100,
                width: PHOTO_W + 300,
                height: PHOTO_H + 130,
                borderRadius: '50%',
                background: `radial-gradient(closest-side, ${rgba(acc, 0.34 * halo)}, transparent 74%)`,
                filter: 'blur(46px)',
                mixBlendMode: 'screen',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: photoX + PHOTO_W / 2 - 4,
                top: 150,
                width: 8,
                height: PHOTO_H - 40,
                background: `linear-gradient(transparent, ${rgba(accLite, 0.22 * halo)}, transparent)`,
                filter: 'blur(14px)',
              }}
            />
          </Layer>

          {/* ═══ z −40 · "?" GRABADO en el fondo (solo si la línea es pregunta) ═══ */}
          {hasQ && (
            <Layer z={-40}>
              <div
                style={{
                  position: 'absolute',
                  left: left ? colX + COL_W - 300 : colX - 40,
                  top: 66,
                  clipPath: `inset(0 0 ${(1 - markP) * 100}% 0)`,
                  opacity: 0.85,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    fontFamily: FONT_DISPLAY,
                    fontSize: 420,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `3px ${rgba(acc, 0.42)}`,
                    filter: 'blur(9px)',
                  }}
                >
                  ?
                </span>
                <span
                  style={{
                    position: 'relative',
                    fontFamily: FONT_DISPLAY,
                    fontSize: 420,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'transparent',
                    WebkitTextStroke: `2px ${rgba(accLite, 0.3)}`,
                  }}
                >
                  ?
                </span>
              </div>
            </Layer>
          )}

          {/* ═══ z +34 · FOTO REAL en placa de vidrio ahumado (parallax propio) ═══ */}
          <Layer
            z={34}
            style={{
              // contra-drift: el objeto NO se mueve igual que el texto
              transform: `translateZ(34px) scale(${(PERSP - 34 * 0.55) / PERSP}) translateX(${Math.sin(t * 0.31) * 9 - panX * 0.28}px) translateY(${Math.sin(t * 0.47) * 6}px)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: photoX,
                top: (1080 - PHOTO_H) / 2,
                width: PHOTO_W,
                height: PHOTO_H,
                opacity: photoS,
                filter: photoBlur > 0.05 ? `blur(${photoBlur}px)` : undefined,
                transform: `translateY(${interpolate(photoS, [0, 1], [92, 0])}px) rotate(${(-1.6 + interpolate(photoS, [0, 1], [1.6, 0])) * dir}deg) scale(${interpolate(photoS, [0, 1], [0.9, 1]) + photoPush})`,
                transformOrigin: '50% 55%',
              }}
            >
              {/* grosor: copia oscura detrás, desplazada */}
              <div
                style={{
                  position: 'absolute',
                  left: 10 * dir,
                  top: 16,
                  width: '100%',
                  height: '100%',
                  borderRadius: 34,
                  background: '#02090F',
                  filter: 'blur(2px)',
                  opacity: 0.9,
                }}
              />
              {/* marco de vidrio */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 34,
                  padding: 15,
                  background: `linear-gradient(150deg, ${rgba('#FFFFFF', 0.2)} 0%, ${rgba(accDeep, 0.34)} 46%, ${rgba('#02090F', 0.9)} 100%)`,
                  border: `1px solid ${rgba('#FFFFFF', 0.16)}`,
                  boxShadow: `inset 0 2px 0 ${rgba('#FFFFFF', 0.24)}, inset 0 -4px 12px ${rgba('#000000', 0.6)}, 0 74px 130px ${rgba('#000000', 0.6)}, 0 14px 44px ${rgba('#000000', 0.5)}, 0 0 90px ${rgba(acc, 0.16 * halo)}`,
                }}
              >
                <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden', background: shade(BAS.bgDeep, -0.3)}}>
                  {img ? (
                    <Img
                      src={staticFile(img)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${kb}) translate(${Math.sin(t * 0.21) * 10}px, ${Math.cos(t * 0.17) * 8}px)`,
                        filter: 'saturate(1.04) contrast(1.06) brightness(0.99)',
                      }}
                    />
                  ) : (
                    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${shade(acc, -0.4)}, ${BAS.bgDeep})`}} />
                  )}
                  {/* grado: tinte del acento + luz principal + oclusión inferior */}
                  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(200deg, ${rgba(accLite, 0.16)}, transparent 46%)`, mixBlendMode: 'soft-light'}} />
                  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${rgba('#FFFFFF', 0.14)}, transparent 34%)`}} />
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: `linear-gradient(transparent, ${rgba('#03121A', 0.82)})`}} />

                  {/* CALIBRE DE LUZ — mide el objeto en el acto de tensión */}
                  <div style={{position: 'absolute', left: 54, right: 54, bottom: 92, height: 2, opacity: caliP}}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: 2,
                        width: `${caliP * 100}%`,
                        background: `linear-gradient(90deg, ${rgba(accLite, 0.15)}, ${accLite})`,
                        boxShadow: `0 0 14px ${rgba(acc, 0.9)}`,
                      }}
                    />
                    <div style={{position: 'absolute', left: 0, top: -13, width: 2, height: 28, background: accLite, boxShadow: `0 0 12px ${rgba(acc, 0.9)}`}} />
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: -13,
                        width: 2,
                        height: 28,
                        background: accLite,
                        opacity: caliTick,
                        transform: `scaleY(${interpolate(caliTick, [0, 1], [0.3, 1])})`,
                        boxShadow: `0 0 12px ${rgba(acc, 0.9)}`,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: -5,
                        width: 12,
                        height: 12,
                        marginLeft: -6,
                        borderRadius: '50%',
                        background: accLite,
                        opacity: caliTick,
                        transform: `scale(${interpolate(caliTick, [0, 1], [0.2, 1]) + Math.sin(t * 2.2) * 0.08})`,
                        boxShadow: `0 0 18px ${rgba(acc, 1)}`,
                      }}
                    />
                  </div>

                  {/* barrido especular permanente (el vidrio nunca queda muerto) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(108deg, transparent ${sweep - 9}%, ${rgba('#FFFFFF', 0.11)} ${sweep}%, transparent ${sweep + 9}%)`,
                      mixBlendMode: 'screen',
                    }}
                  />
                </div>
              </div>
              {/* filo de luz que recorre el borde superior de la placa */}
              <div style={{position: 'absolute', left: 18, right: 18, top: 0, height: 3, borderRadius: 3, overflow: 'hidden'}}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${interpolate(frame, [T.photo, T.photo + 34], [-40, 128], CL)}%`,
                    width: '40%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${rgba('#DFF6FF', 0.95)}, transparent)`,
                    filter: 'blur(1px)',
                  }}
                />
              </div>
            </div>
          </Layer>

          {/* ═══ z +76 · BLOQUE DE TEXTO — kicker + PREGUNTA ═══ */}
          <Layer z={76}>
            {/* kicker */}
            <div style={{position: 'absolute', left: colX, top: 252, display: 'flex', alignItems: 'center', gap: 16, opacity: kickP, transform: `translateY(${interpolate(kickP, [0, 1], [14, 0])}px)`}}>
              <span style={{width: 13, height: 13, borderRadius: '50%', background: acc, boxShadow: `0 0 18px ${rgba(acc, 0.95)}`, transform: `scale(${1 + Math.sin(t * 2.1) * 0.1})`}} />
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 27,
                  fontWeight: 800,
                  letterSpacing: 7,
                  textTransform: 'uppercase',
                  color: accLite,
                  textShadow: `0 2px 12px ${rgba('#000000', 0.7)}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {kicker}
              </span>
              <span style={{height: 1, width: 300 * kickRule, background: `linear-gradient(90deg, ${rgba(acc, 0.7)}, transparent)`}} />
            </div>

            {/* PREGUNTA — palabra por palabra, con peso */}
            <div
              style={{
                position: 'absolute',
                left: colX,
                top: 300,
                width: COL_W,
                height: 262,
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'flex-end',
                columnGap: qSize * 0.26,
                rowGap: 2,
                opacity: qFade,
                filter: qSoft > 0.05 ? `blur(${qSoft}px)` : undefined,
              }}
            >
              {words.map((w, i) => {
                const d = T.question + i * 2.6;
                const p = interpolate(frame, [d, d + 13], [0, 1], {...CL, easing: easeOut});
                return (
                  <span
                    key={`${w}-${i}`}
                    style={{
                      display: 'inline-block',
                      fontFamily: FONT_DISPLAY,
                      fontSize: qSize,
                      fontWeight: 700,
                      lineHeight: 1.16,
                      color: '#E9F5FA',
                      opacity: p,
                      clipPath: `inset(0 ${(1 - p) * 102}% -32% 0)`,
                      transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
                      textShadow: `0 4px 22px ${rgba('#000000', 0.85)}, 0 1px 0 ${rgba('#000000', 0.6)}, 0 0 46px ${rgba(acc, 0.22)}`,
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>

            {/* guía vertical: lleva el ojo de la pregunta al papel */}
            <div
              style={{
                position: 'absolute',
                left: colX + 3,
                top: 566,
                width: 3,
                height: 26,
                transformOrigin: '50% 0%',
                transform: `scaleY(${guideP})`,
                opacity: guideOut,
                background: `linear-gradient(${rgba(acc, 0.05)}, ${acc})`,
                boxShadow: `0 0 14px ${rgba(acc, 0.8)}`,
              }}
            />
          </Layer>

          {/* ═══ z +102 · LA RESPUESTA en papel clínico claro ═══ */}
          <Layer z={102}>
            <div
              style={{
                position: 'absolute',
                left: colX,
                top: ANS_TOP,
                width: COL_W,
                opacity: ansIn,
                transform: `translateY(${interpolate(ansS, [0, 1], [56, 0])}px) rotate(${interpolate(ansS, [0, 1], [1.5 * dir, -0.6 * dir])}deg) scale(${interpolate(ansS, [0, 1], [0.9, 1])})`,
                transformOrigin: left ? '12% 50%' : '88% 50%',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: 26,
                  background: `linear-gradient(160deg, ${BAS.card} 0%, ${BAS.cardWarm} 100%)`,
                  border: `1px solid ${rgba('#FFFFFF', 0.7)}`,
                  boxShadow: `${CARD_SHADOW}, 0 0 70px ${rgba(acc, 0.2 * halo)}`,
                  padding: '34px 44px 40px',
                  overflow: 'hidden',
                }}
              >
                {/* barra de acento que se escribe en el filo superior */}
                <div style={{position: 'absolute', left: 0, top: 0, height: 7, width: `${barP * 100}%`, background: `linear-gradient(90deg, ${accDeep}, ${acc} 40%, ${accLite})`}} />
                {/* textura de papel + luz de producto sobre el papel */}
                <div style={{position: 'absolute', inset: 0, background: `linear-gradient(155deg, ${rgba('#FFFFFF', 0.55)}, transparent 42%)`, pointerEvents: 'none'}} />
                <div style={{position: 'absolute', right: -40, bottom: -60, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(closest-side, ${rgba(acc, 0.12)}, transparent 70%)`}} />

                <div
                  style={{
                    position: 'relative',
                    fontFamily: FONT_DISPLAY,
                    fontSize: aSize,
                    fontWeight: 700,
                    lineHeight: 1.14,
                    letterSpacing: -0.4,
                    color: BAS.ink,
                    textShadow: `0 1px 0 ${rgba('#FFFFFF', 0.8)}`,
                  }}
                >
                  {answer}
                </div>

                {/* SUBRAYADO "A MANO" — dos pasadas, se dibuja de izq. a der. */}
                <svg viewBox="0 0 900 34" preserveAspectRatio="none" style={{display: 'block', width: '100%', height: 26, marginTop: 10, overflow: 'visible'}}>
                  <path
                    d="M6 20 C 150 6, 300 30, 452 15 S 760 6, 892 19"
                    fill="none"
                    stroke={rgba(acc, 0.3)}
                    strokeWidth={16}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - uP}
                  />
                  <path
                    d="M6 20 C 150 6, 300 30, 452 15 S 760 6, 892 19"
                    fill="none"
                    stroke={acc}
                    strokeWidth={7}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - uP}
                  />
                </svg>
              </div>
            </div>

            {/* NOTA al margen (entra última, suave) */}
            {note && (
              <div
                style={{
                  position: 'absolute',
                  left: colX + 6,
                  top: NOTE_TOP,
                  width: COL_W - 40,
                  opacity: noteS,
                  transform: `translateY(${interpolate(noteS, [0, 1], [22, 0])}px)`,
                  display: 'flex',
                  gap: 20,
                  alignItems: 'stretch',
                }}
              >
                <div style={{width: 5, borderRadius: 4, background: `linear-gradient(${acc}, ${rgba(acc, 0.06)})`, boxShadow: `0 0 16px ${rgba(acc, 0.55)}`}} />
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 31,
                    fontWeight: 600,
                    lineHeight: 1.34,
                    color: BAS.onDark,
                    textShadow: `0 3px 16px ${rgba('#000000', 0.85)}`,
                    paddingTop: 2,
                  }}
                >
                  {note}
                </div>
              </div>
            )}
          </Layer>

          {/* ═══ z +150 · SELLO al frente: corchetes que golpean + onda de impacto ═══ */}
          <Layer z={150}>
            {[-1, 1].map((s) => (
              <div
                key={s}
                style={{
                  position: 'absolute',
                  left: s < 0 ? colX - 34 : colX + COL_W - 22,
                  top: ANS_TOP - 22,
                  width: 56,
                  height: 96,
                  opacity: braS,
                  transform: `translateX(${interpolate(braS, [0, 1], [34 * s, 0])}px) scale(${interpolate(braS, [0, 1], [1.5, 1])})`,
                  borderTop: `7px solid ${acc}`,
                  borderBottom: 'none',
                  borderLeft: s < 0 ? `7px solid ${acc}` : 'none',
                  borderRight: s > 0 ? `7px solid ${acc}` : 'none',
                  borderTopLeftRadius: s < 0 ? 10 : 0,
                  borderTopRightRadius: s > 0 ? 10 : 0,
                  filter: `drop-shadow(0 6px 14px ${rgba('#000000', 0.6)}) drop-shadow(0 0 16px ${rgba(acc, 0.7)})`,
                }}
              />
            ))}
            {ring > 0 && ring < 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: colX + COL_W / 2 - 260,
                  top: ANS_TOP + 40,
                  width: 520,
                  height: 260,
                  borderRadius: 40,
                  border: `3px solid ${rgba(accLite, (1 - ring) * 0.5)}`,
                  transform: `scale(${0.86 + ring * 0.42})`,
                  filter: 'blur(1px)',
                }}
              />
            )}
          </Layer>
        </div>
      </AbsoluteFill>

      <CoolVignette strength={0.5} />
      <GrainOverlay opacity={0.055} />
    </AbsoluteFill>
  );
};

export default RuleScene;
