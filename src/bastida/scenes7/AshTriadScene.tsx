/**
 * AshTriadScene — microescena 2.5D dirigida: LA ANATOMÍA DE LA CENIZA.
 *
 * Beat del guion: "¿Y qué es esa ceniza, en concreto? Tres cosas: fósforo, sal y acidez."
 * Familia de composición: ENSAMBLAJE (3 piezas que forman al villano) sobre un RIEL DE VIDRIO.
 *
 * Idea visual: una repisa de laboratorio en penumbra. Cae ceniza. Uno por uno bajan tres
 * MÓDULOS (foto real dentro de un marco de vidrio biselado + etiqueta de papel clínico),
 * su sombra ATERRIZA sobre el riel y una vena de luz ámbar se extiende por el riel hasta
 * el nodo del módulo recién montado: la ceniza se va armando delante del espectador.
 *
 * Cámara dirigida: dolly-in no lineal (1.075 → 1.0) que revela el riel, micro-empujón en
 * cada montaje, paneo/rotateY que SIGUE al módulo que "está hablando", y pull-back final
 * que abre el retrato de familia. RACK FOCUS REAL: el módulo activo se adelanta en Z,
 * se endereza (rotateY→0), sube a opacidad 1 y su foto se enfoca; los otros retroceden,
 * se atenúan a ~0.58 y se desenfocan (blur 1.8px).
 *
 * Planos (≥5): ceniza lejana −340 · halo/atmósfera −240 · riel + sombras de contacto −60 ·
 * módulos 0/±150 (activo adelantado) · ceniza cercana +190 · título +250.
 *
 * Determinístico (Math.sin, sin Math.random) — el farm rinde en chunks paralelos.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, GrainOverlay, rgba, shade} from './../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.cubic);
const easeIO = Easing.bezier(0.4, 0, 0.2, 1);
const PERSP = 1650;
const START = 44; // frame en que baja el primer módulo

/** hash determinístico [0,1) — reemplaza Math.random (prohibido: el farm rinde en chunks) */
const R1 = (n: number): number => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const sat = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export type AshTriadItem = {img: string; name: string; sub: string; accent?: string};
export type AshTriadSceneProps = {title?: string; items?: AshTriadItem[]; stepFrames?: number};

const DEFAULT_ITEMS: AshTriadItem[] = [
  {img: 'img/bas6_broll_sarro.jpg', name: 'FÓSFORO', sub: 'sarro en sus arterias, calcio robado al hueso', accent: BAS.amber},
  {img: 'img/bas6_p_tensiometro.jpg', name: 'SAL', sub: 'retiene agua y le sube la presión', accent: BAS.no},
  {img: 'img/bas6_p_rinon_filtro.jpg', name: 'ACIDEZ', sub: 'el filtro compensando todo el día', accent: BAS.aqua},
];

/** Capa de ceniza cayendo. Va en su propio translateZ → parallax real con la cámara. */
const AshLayer: React.FC<{frame: number; fps: number; count: number; z: number; op: number; seed: number; big: number}> = ({
  frame,
  fps,
  count,
  z,
  op,
  seed,
  big,
}) => {
  const t = frame / fps;
  const k = (PERSP - z) / PERSP; // compensa el encogimiento por perspectiva
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: op, transform: `translateZ(${z}px) scale(${k})`, transformOrigin: '50% 50%'}}>
      {Array.from({length: count}).map((_, i) => {
        const a = R1(i + seed);
        const b = R1(i * 2.7 + seed + 11);
        const c = R1(i * 5.3 + seed + 29);
        const speed = 3.4 + b * 7.5;
        const y = ((a * 145 + t * speed) % 145) - 22;
        const sway = Math.sin(t * (0.32 + b * 0.55) + i * 1.7) * (9 + b * 20);
        const s = big * (0.55 + a * 0.95);
        const warm = c > 0.72;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${c * 100}%`,
              top: `${y}%`,
              width: s,
              height: s * (0.66 + b * 0.6),
              borderRadius: '50%',
              transform: `translateX(${sway}px) rotate(${(t * 22 + i * 37) % 360}deg)`,
              background: warm ? rgba(BAS.amber, 0.5) : rgba('#E6D9C6', 0.46),
              boxShadow: `0 0 ${s * 3}px ${rgba(warm ? BAS.amber : '#CBB89A', 0.32)}`,
              opacity: 0.5 + 0.5 * Math.sin(t * (0.75 + c) + i),
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
    </div>
  );
};

export const AshTriadScene: React.FC<AshTriadSceneProps> = ({
  title = '¿Qué es esa ceniza?',
  items = DEFAULT_ITEMS,
  stepFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  const n = items.length;
  const step = stepFrames;
  const lastEnd = START + n * step; // arranca el "retrato de familia"

  // ---------- geometría ----------
  const PITCH = 524;
  const W = 470; // ancho del módulo
  const PH = 300; // alto de la foto
  const cx = width / 2;
  const cyM = height * 0.585;
  const railY = cyM + 330;
  const RW = PITCH * (n - 1) + W + 90;
  const xs = items.map((_, i) => (i - (n - 1) / 2) * PITCH);

  // ---------- foco (rack focus de composición) ----------
  const finale = interpolate(frame, [lastEnd, lastEnd + 36], [0, 1], {...clamp, easing: easeIO});
  const focus = items.map((_, i) => {
    const t0 = START + i * step;
    const up = interpolate(frame, [t0 + 2, t0 + 22], [0, 1], {...clamp, easing: easeIO});
    const down = interpolate(frame, [t0 + step, t0 + step + 24], [1, 0], {...clamp, easing: easeIO});
    return up * down;
  });
  const camTarget = xs.reduce((acc, x, i) => acc + x * focus[i], 0);

  // ---------- cámara dirigida ----------
  const camIn = interpolate(frame, [0, 72], [0, 1], {...clamp, easing: easeIO});
  const bump = items.reduce((acc, _, i) => {
    const f = frame - (START + i * step);
    return acc + interpolate(f, [0, 10, 36], [0, 0.016, 0], clamp);
  }, 0);
  const dolly =
    interpolate(camIn, [0, 1], [1.075, 1.0]) +
    bump +
    interpolate(frame, [lastEnd, lastEnd + 70], [0, -0.05], {...clamp, easing: easeIO}) +
    Math.sin(t * 0.31) * 0.0035;
  const ry = interpolate(camIn, [0, 1], [-6.5, -1.2]) + camTarget * 0.0055 + Math.sin(t * 0.44) * 0.35;
  const rx =
    interpolate(camIn, [0, 1], [-5, -1.6]) +
    interpolate(frame, [lastEnd, lastEnd + 70], [0, 0.9], {...clamp, easing: easeIO}) +
    Math.sin(t * 0.27) * 0.18;
  const panX = -camTarget * 0.13 + Math.sin(t * 0.33) * 3;
  const panY = interpolate(camIn, [0, 1], [-20, 0]) + Math.cos(t * 0.29) * 2.4;

  // ---------- riel: la vena de luz que se extiende con cada montaje ----------
  let fill = 0;
  items.forEach((_, i) => {
    const p = sat((frame - (START + i * step) - 6) / 26);
    fill = Math.max(fill, p * ((xs[i] + W / 2 + 34 + RW / 2) / RW));
  });
  const railIn = interpolate(frame, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const beat = 0.5 + 0.5 * Math.sin(t * 1.55); // latido ámbar
  const beatF = 0.5 + 0.5 * Math.sin(t * 2.1); // latido rápido del cierre

  // ---------- título ----------
  const titIn = interpolate(frame, [4, 26], [0, 1], {...clamp, easing: easeOut});
  const titBlur = interpolate(frame, [4, 30], [8, 0], clamp); // focus-pull
  const kickIn = interpolate(frame, [16, 38], [0, 1], {...clamp, easing: easeOut});
  const titSweep = ((frame % 190) / 190) * 150 - 25;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(105% 105% at 50% 8%, ${shade(BAS.amber, -0.74)} 0%, ${BAS.bgPanel} 40%, ${BAS.bg} 66%, ${BAS.bgDeep} 100%)`,
        perspective: PERSP,
        perspectiveOrigin: '50% 44%',
        overflow: 'hidden',
      }}
    >
      {/* bruma baja: la ceniza ya asentada */}
      <AbsoluteFill style={{background: `radial-gradient(70% 42% at 50% 92%, ${rgba(BAS.amber, 0.1)} 0%, transparent 72%)`}} />

      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateX(${panX}px) translateY(${panY}px) scale(${dolly})`,
          transformOrigin: '50% 46%',
        }}
      >
        {/* ===== PLANO −340: ceniza lejana ===== */}
        <AshLayer frame={frame} fps={fps} count={26} z={-340} op={0.5} seed={3} big={4} />

        {/* ===== PLANO −240: halo ámbar que SIGUE al módulo que habla ===== */}
        <div
          style={{
            position: 'absolute',
            left: cx + camTarget * 0.9,
            top: cyM - 30,
            width: 980,
            height: 760,
            transform: `translate(-50%,-50%) translateZ(-240px) scale(${1 + beat * 0.05})`,
            background: `radial-gradient(closest-side, ${rgba(BAS.amber, 0.19 + beat * 0.07)}, transparent 70%)`,
            filter: 'blur(38px)',
            mixBlendMode: 'screen',
            opacity: 0.55 + finale * 0.25,
          }}
        />

        {/* ===== PLANO −60: RIEL DE VIDRIO + vena de luz + sombras de contacto ===== */}
        <div style={{position: 'absolute', left: cx, top: railY, transform: 'translate(-50%,-50%) translateZ(-60px)', transformStyle: 'preserve-3d'}}>
          {/* sombras de contacto de cada módulo (aterrizan al montarse) */}
          {items.map((it, i) => {
            const land = interpolate(frame, [START + i * step, START + i * step + 30], [0, 1], {...clamp, easing: easeOut});
            const acc = it.accent || BAS.amber;
            return (
              <React.Fragment key={`sh${i}`}>
                <div
                  style={{
                    position: 'absolute',
                    left: xs[i],
                    top: -14,
                    width: W * 0.94,
                    height: 40,
                    transform: `translate(-50%,-50%) scaleX(${0.62 + land * 0.38})`,
                    borderRadius: '50%',
                    background: `radial-gradient(closest-side, ${rgba('#000000', 0.72)}, transparent 72%)`,
                    filter: `blur(${interpolate(land, [0, 1], [28, 9])}px)`,
                    opacity: land * 0.9,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: xs[i],
                    top: -6,
                    width: W * 0.7,
                    height: 26,
                    transform: 'translate(-50%,-50%)',
                    borderRadius: '50%',
                    background: `radial-gradient(closest-side, ${rgba(acc, 0.5)}, transparent 74%)`,
                    filter: 'blur(16px)',
                    mixBlendMode: 'screen',
                    opacity: land * (0.42 + focus[i] * 0.5 + beat * 0.12),
                  }}
                />
              </React.Fragment>
            );
          })}

          {/* cuerpo del riel (vidrio ahumado biselado) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: RW,
              height: 16,
              transform: `translate(-50%,-50%) scaleX(${railIn})`,
              borderRadius: 8,
              background: `linear-gradient(180deg, ${rgba('#FFFFFF', 0.16)} 0%, ${rgba(BAS.bgPanel, 0.85)} 22%, ${rgba('#02090F', 0.95)} 100%)`,
              border: `1px solid ${rgba('#FFFFFF', 0.12)}`,
              boxShadow: `inset 0 1px 0 ${rgba('#FFFFFF', 0.24)}, inset 0 -4px 8px ${rgba('#000000', 0.6)}, 0 24px 46px ${rgba('#000000', 0.5)}`,
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent ${titSweep - 10}%, ${rgba('#DCF3FA', 0.35)} ${titSweep}%, transparent ${titSweep + 10}%)`}} />
          </div>

          {/* vena de luz ámbar: se extiende hasta el módulo recién montado */}
          <div style={{position: 'absolute', left: -RW / 2, top: -3, width: RW * fill, height: 6, borderRadius: 4}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${rgba(BAS.amberDark, 0.7)}, ${rgba(BAS.amber, 0.95)})`,
                boxShadow: `0 0 ${14 + beat * 12}px ${rgba(BAS.amber, 0.55 + finale * 0.2)}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -6,
                top: -5,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: shade(BAS.amber, 0.35),
                boxShadow: `0 0 26px ${rgba(BAS.amber, 0.9)}`,
                opacity: fill > 0.02 && fill < 0.995 ? 1 : 0.35,
              }}
            />
          </div>

          {/* nodos del riel (uno por módulo) */}
          {items.map((it, i) => {
            const p = sat((frame - (START + i * step) - 10) / 22);
            const acc = it.accent || BAS.amber;
            return (
              <div
                key={`nd${i}`}
                style={{
                  position: 'absolute',
                  left: xs[i],
                  top: 0,
                  width: 22,
                  height: 22,
                  transform: `translate(-50%,-50%) scale(${p * (1 + (1 - p) * 0.9) + 0.001})`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 38% 34%, ${shade(acc, 0.5)}, ${acc} 55%, ${shade(acc, -0.5)} 100%)`,
                  boxShadow: `0 0 ${16 + beat * 10}px ${rgba(acc, 0.75)}, inset 0 -2px 4px ${rgba('#000000', 0.5)}`,
                  opacity: p,
                }}
              />
            );
          })}
        </div>

        {/* ===== PLANO 0 / ±150: LOS TRES MÓDULOS ===== */}
        {items.map((it, i) => {
          const acc = it.accent || BAS.amber;
          const t0 = START + i * step;
          const f = frame - t0;
          const enter = spring({frame: f, fps, config: {damping: 14, mass: 0.95, stiffness: 105}});
          const entOp = interpolate(f, [0, 14], [0, 1], {...clamp, easing: easeOut});
          const land = interpolate(f, [0, 30], [0, 1], {...clamp, easing: easeOut});
          const photoR = interpolate(f, [10, 36], [0, 1], {...clamp, easing: easeIO});
          const labelS = spring({frame: f - 16, fps, config: {damping: 17, mass: 0.8, stiffness: 130}});
          const subOp = interpolate(f, [30, 52], [0, 1], {...clamp, easing: easeOut});
          const fo = focus[i];

          const restOp = 0.58 + finale * 0.42;
          const op = entOp * (restOp + (1 - restOp) * fo);
          const sc = 0.955 + finale * 0.03 + fo * 0.085;
          const z = -34 + finale * 26 + fo * 150;
          const tilt = -(xs[i] / PITCH) * 5.5 * (1 - fo * 0.9);
          const floatY = Math.sin(t * 0.62 + i * 2.1) * 3.4 * land;
          const blurPh = (1 - fo) * 1.8 * (1 - finale * 0.75);
          const spec = (((frame + i * 95) % 200) / 200) * 165 - 32;
          const imgScale = interpolate(photoR, [0, 1], [1.16, 1.045]) + Math.sin(t * 0.34 + i * 1.9) * 0.016;

          return (
            <div
              key={`mod${i}`}
              style={{
                position: 'absolute',
                left: cx + xs[i],
                top: cyM,
                width: W,
                transform: `translate(-50%,-50%) translateZ(${z}px) translateY(${(1 - enter) * 132 + floatY}px) rotateY(${tilt}deg) rotateX(${(1 - enter) * -7}deg) scale(${sc})`,
                transformStyle: 'preserve-3d',
                opacity: op,
              }}
            >
              {/* --- MARCO DE VIDRIO con la FOTO REAL --- */}
              <div style={{position: 'relative', width: W, height: PH, transformStyle: 'preserve-3d'}}>
                {/* copia desplazada = grosor del vidrio */}
                <div style={{position: 'absolute', left: 7, top: 10, width: W, height: PH, borderRadius: 22, background: '#02080D', filter: 'blur(1px)', transform: 'translateZ(-10px)'}} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 22,
                    overflow: 'hidden',
                    border: `1px solid ${rgba('#FFFFFF', 0.2)}`,
                    boxShadow: `0 ${interpolate(land, [0, 1], [104, 34])}px ${interpolate(land, [0, 1], [128, 62])}px ${rgba('#000000', 0.2 + land * 0.38)}, inset 0 2px 0 ${rgba('#FFFFFF', 0.26)}, inset 0 -3px 10px ${rgba('#000000', 0.62)}, 0 0 ${34 + fo * 26 + beat * 10}px ${rgba(acc, 0.16 + fo * 0.22)}`,
                    background: '#050C12',
                  }}
                >
                  {/* la foto real, revelada con cortina y con deriva permanente (nada congelado) */}
                  <div style={{position: 'absolute', inset: 0, clipPath: `inset(0% 0% ${(1 - photoR) * 100}% 0%)`}}>
                    <Img
                      src={staticFile(it.img)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${imgScale}) translateX(${Math.sin(t * 0.26 + i) * 6}px)`,
                        filter: `blur(${blurPh}px) saturate(${0.86 + fo * 0.2}) contrast(${1.04 + fo * 0.06}) brightness(${0.72 + fo * 0.28})`,
                      }}
                    />
                  </div>
                  {/* grade navy + tinte del acento (la foto nunca compite con el texto) */}
                  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(BAS.bgDeep, 0.1)} 0%, ${rgba(BAS.bgDeep, 0.36)} 62%, ${rgba('#02080D', 0.82)} 100%)`}} />
                  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(90% 80% at 50% 0%, ${rgba(acc, 0.16)}, transparent 68%)`, mixBlendMode: 'screen', opacity: 0.6 + fo * 0.4}} />
                  {/* specular del cristal que barre */}
                  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(108deg, transparent ${spec - 9}%, ${rgba('#FFFFFF', 0.13)} ${spec}%, transparent ${spec + 9}%)`}} />
                  {/* grano dentro del vidrio */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.055,
                      mixBlendMode: 'overlay',
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                      backgroundSize: '140px 140px',
                    }}
                  />
                  {/* oclusión interna */}
                  <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 70px ${rgba('#000000', 0.55)}`}} />
                </div>
                {/* índice grabado en el bisel */}
                <div style={{position: 'absolute', right: 20, top: 14, transform: 'translateZ(6px)', opacity: entOp * (0.5 + fo * 0.5)}}>
                  <span style={{fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: shade(acc, 0.3), textShadow: `0 2px 6px ${rgba('#000000', 0.8)}`}}>{`0${i + 1}`}</span>
                </div>
              </div>

              {/* --- ETIQUETA DE PAPEL CLÍNICO (alto contraste +60), montada sobre el marco --- */}
              <div
                style={{
                  position: 'relative',
                  marginTop: -18,
                  marginLeft: 16,
                  width: W - 32,
                  transform: `translateZ(30px) translateY(${(1 - labelS) * 26}px) scale(${0.94 + labelS * 0.06})`,
                  opacity: labelS,
                  borderRadius: 16,
                  background: `linear-gradient(168deg, ${BAS.card} 0%, ${BAS.cardWarm} 100%)`,
                  border: `1px solid ${BAS.cardEdge}`,
                  boxShadow: `${CARD_SHADOW}, inset 0 1px 0 ${rgba('#FFFFFF', 0.9)}`,
                  overflow: 'hidden',
                  padding: '22px 24px 24px',
                }}
              >
                {/* filo de acento arriba */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: 7,
                    background: `linear-gradient(90deg, ${shade(acc, -0.2)}, ${acc} 55%, ${shade(acc, 0.35)})`,
                    transform: `scaleX(${labelS})`,
                    transformOrigin: '0% 50%',
                  }}
                />
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.02, color: BAS.ink, marginTop: 6}}>{it.name}</div>
                <div style={{width: interpolate(subOp, [0, 1], [0, 76]), height: 4, borderRadius: 2, background: acc, margin: '12px 0', opacity: 0.9}} />
                <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 500, lineHeight: 1.3, color: BAS.ink2, opacity: subOp, transform: `translateY(${(1 - subOp) * 8}px)`}}>{it.sub}</div>
                {/* fibra del papel */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: 0.05,
                    mixBlendMode: 'multiply',
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='1'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\")",
                    backgroundSize: '120px 120px',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* ===== PLANO +190: ceniza cercana (pasa por delante de los módulos) ===== */}
        <AshLayer frame={frame} fps={fps} count={16} z={190} op={0.5} seed={77} big={7} />

        {/* ===== PLANO +250: TÍTULO al frente ===== */}
        <div style={{position: 'absolute', left: cx, top: 196, transform: 'translate(-50%,-50%) translateZ(250px)', textAlign: 'center', whiteSpace: 'nowrap'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: kickIn, marginBottom: 16}}>
            <div style={{width: interpolate(kickIn, [0, 1], [0, 78]), height: 1, background: `linear-gradient(90deg, transparent, ${rgba(BAS.aqua, 0.8)})`}} />
            <span style={{fontFamily: FONT_SANS, fontSize: 26, fontWeight: 700, letterSpacing: 9, color: BAS.aquaLite, textShadow: `0 0 18px ${rgba(BAS.aqua, 0.55)}, 0 2px 6px ${rgba('#000000', 0.8)}`}}>EN CONCRETO</span>
            <div style={{width: interpolate(kickIn, [0, 1], [0, 78]), height: 1, background: `linear-gradient(90deg, ${rgba(BAS.aqua, 0.8)}, transparent)`}} />
          </div>
          <div style={{position: 'relative', display: 'inline-block', filter: `blur(${titBlur}px)`, opacity: titIn, transform: `translateY(${(1 - titIn) * 16}px)`}}>
            <span style={{fontFamily: FONT_DISPLAY, fontSize: 82, fontWeight: 800, letterSpacing: 0.5, color: '#F2F7FA', textShadow: `0 3px 26px ${rgba('#000000', 0.85)}, 0 0 60px ${rgba(BAS.amber, 0.22)}`}}>{title}</span>
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(102deg, transparent ${titSweep - 11}%, ${rgba('#FFFFFF', 0.42)} ${titSweep}%, transparent ${titSweep + 11}%)`, mixBlendMode: 'overlay'}} />
          </div>
        </div>

        {/* pulso ámbar del cierre: el villano ya está armado */}
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: railY,
            width: RW + 120,
            height: 220,
            transform: 'translate(-50%,-50%) translateZ(-100px)',
            background: `radial-gradient(closest-side, ${rgba(BAS.amber, 0.2 + beatF * 0.12)}, transparent 72%)`,
            filter: 'blur(30px)',
            mixBlendMode: 'screen',
            opacity: finale * 0.85,
          }}
        />
      </AbsoluteFill>

      {/* viñeta fría + grano, fuera del espacio 3D */}
      <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(122% 116% at 50% 46%, transparent 52%, ${rgba(BAS.bgEdge, 0.72)} 100%)`}} />
      <GrainOverlay opacity={0.06} />
    </AbsoluteFill>
  );
};

export default AshTriadScene;
