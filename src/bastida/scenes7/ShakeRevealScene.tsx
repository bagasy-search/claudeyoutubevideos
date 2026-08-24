/**
 * ShakeRevealScene — CLÍMAX del video (canal "Dr. Bastida · Salud Renal").
 *
 * EL GIRO: la peor proteína es la que le recomendaron POR SU EDAD — el batido de proteína
 * en polvo. Proteína concentrada, deshidratada, sin agua y sin fibra: una sola medida trae
 * la carga de dos bifes, entrando toda junta en un filtro que ya viene cansado. Y casi todos
 * esos potes traen fosfatos agregados.
 *
 * Puesta en escena (microescena 2.5D dirigida, estándar del canal):
 *   ACTO 1 (0-30)    presentación inocente — el pote iluminado como producto, halo aqua, push-in.
 *   ACTO 2 (30-70)   tensión — la luz se enfría, el halo vira a ámbar, entra lo que PROMETE, vibra.
 *   ACTO 3 (70-95)   EL GOLPE — el pote se corre, entran los dos bifes de golpe, "1 medida ≈ 2 bifes",
 *                    impact-shake (5f decayendo), flash blanco de 3f (op. 0.32) y el halo vira a rojo.
 *   ACTO 4 (95-160)  la descarga — cascada determinística de polvo del pote al riñón-filtro,
 *                    que se satura de ámbar/rojo y late más rápido. Rótulo FOSFATOS AÑADIDOS.
 *   ACTO 5 (160-560) hold vivo — veredicto en tarjeta clínica clara + sello ✕ que golpea una vez,
 *                    y todo sigue respirando (parallax, latido, barridos de luz, polvo lento).
 *
 * Profundidad real: perspective 1600 + 9 planos con translateZ distinto (atmósfera, halo, riñón,
 * cascada trasera, pote hero, bifes, cascada frontal, tipografía, tarjeta/sello).
 * Sin backdrop-filter. Sin Math.random (el farm rinde en chunks paralelos): todo determinístico.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BAS, CARD_SHADOW, FONT_DISPLAY, FONT_SANS, GrainOverlay, rgba, shade} from './../theme';

/* ------------------------------------------------------------------ base */

const W = 1920;
const H = 1080;
const DUR = 560;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.cubic);
const easeQuint = Easing.out(Easing.quint);
const easeIO = Easing.inOut(Easing.quad);
const easeIOc = Easing.inOut(Easing.cubic);
const easeIn = Easing.in(Easing.quad);

/** hash determinístico [0,1) — reemplaza Math.random (PROHIBIDO: el farm rinde en chunks). */
const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Plano 3D: capa a una profundidad fija dentro del stage (parallax real por perspectiva). */
const Plane: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  z,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: W,
      height: H,
      transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Marco de vidrio con FOTO REAL adentro + iluminación de producto (idioma visual del canal). */
const GlassPhoto: React.FC<{
  img: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  accent: string;
  opacity?: number;
  scale?: number;
  rotZ?: number;
  rotY?: number;
  tint?: string;
  tintAmt?: number;
  /** 0..1 = posición del barrido de luz; <0 = apagado */
  sheen?: number;
  glow?: number;
  chill?: number;
}> = ({
  img,
  cx,
  cy,
  w,
  h,
  accent,
  opacity = 1,
  scale = 1,
  rotZ = 0,
  rotY = 0,
  tint,
  tintAmt = 0,
  sheen = -1,
  glow = 0.32,
  chill = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - w / 2,
      top: cy - h / 2,
      width: w,
      height: h,
      opacity,
      transform: `scale(${scale}) rotate(${rotZ}deg) rotateY(${rotY}deg)`,
      transformStyle: 'preserve-3d',
    }}
  >
    {/* halo del acento (detrás del vidrio) */}
    <div
      style={{
        position: 'absolute',
        left: -90,
        top: -80,
        width: w + 180,
        height: h + 160,
        borderRadius: '50%',
        background: `radial-gradient(closest-side, ${rgba(accent, glow)}, transparent 74%)`,
        filter: 'blur(30px)',
      }}
    />
    {/* grosor: copia oscura desplazada */}
    <div
      style={{
        position: 'absolute',
        left: 11,
        top: 17,
        width: w,
        height: h,
        borderRadius: 26,
        background: shade(BAS.bgDeep, -0.45),
        filter: 'blur(2px)',
        opacity: 0.9,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        borderRadius: 24,
        overflow: 'hidden',
        border: `1px solid ${rgba('#FFFFFF', 0.15)}`,
        boxShadow: `inset 0 2px 0 ${rgba('#FFFFFF', 0.2)}, inset 0 -8px 24px ${rgba(
          '#000000',
          0.6
        )}, 0 44px 96px ${rgba('#000000', 0.6)}, 0 10px 30px ${rgba('#000000', 0.45)}`,
      }}
    >
      <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
      {/* enfriamiento de la luz (acto 2) */}
      {chill > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: rgba(BAS.brand, 0.55),
            opacity: chill,
            mixBlendMode: 'multiply',
          }}
        />
      ) : null}
      {/* tinte semántico (alerta) */}
      {tint && tintAmt > 0 ? (
        <div style={{position: 'absolute', inset: 0, background: tint, opacity: tintAmt, mixBlendMode: 'multiply'}} />
      ) : null}
      {/* key light arriba-izq + caída a sombra abajo-der */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(155deg, ${rgba('#FFFFFF', 0.17)} 0%, transparent 36%, ${rgba(
            '#00121C',
            0.58
          )} 100%)`,
        }}
      />
      {/* oclusión de borde (mete la foto DENTRO del vidrio) */}
      <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 90px ${rgba(BAS.bgDeep, 0.8)}`}} />
      {/* reflejo de recorte que barre */}
      {sheen >= 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'screen',
            background: `linear-gradient(102deg, transparent ${sheen * 140 - 46}%, ${rgba('#DFF4FF', 0.24)} ${
              sheen * 140 - 26
            }%, transparent ${sheen * 140 - 6}%)`,
          }}
        />
      ) : null}
    </div>
    {/* barra de acento (luz de mesa bajo el objeto) */}
    <div
      style={{
        position: 'absolute',
        left: 26,
        width: w - 52,
        top: h - 2,
        height: 5,
        borderRadius: 3,
        background: accent,
        boxShadow: `0 0 26px ${rgba(accent, 0.9)}`,
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ props */

export type ShakeRevealSceneProps = {
  potImg?: string;
  meatImg?: string;
  kidneyImg?: string;
  promise?: string;
  equivA?: string;
  equivB?: string;
  verdict?: string;
  note?: string;
};

/* ------------------------------------------------------------------- body */

const Body: React.FC<Required<ShakeRevealSceneProps>> = ({
  potImg,
  meatImg,
  kidneyImg,
  promise,
  equivA,
  equivB,
  verdict,
  note,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const fit = Math.min(width / W, height / H);

  /* ---------------- cámara viva (easing NO constante: 4 tramos + respiración) */
  const camA = interpolate(frame, [0, 32], [0, 1], {...CLAMP, easing: easeOut}); // push-in inocente
  const camB = interpolate(frame, [32, 74], [0, 1], {...CLAMP, easing: easeIO}); // tensión: se acerca más
  const camC = interpolate(frame, [95, 150], [0, 1], {...CLAMP, easing: easeQuint}); // el golpe empuja la cámara atrás
  const camD = interpolate(frame, [160, 250], [0, 1], {...CLAMP, easing: easeIOc}); // se asienta en el veredicto
  const breath = Math.sin(t * 0.62) * 0.0034 + Math.sin(t * 0.29 + 1.1) * 0.0019;

  const hitDecay = interpolate(frame, [95, 100], [1, 0], CLAMP);
  const hitE = hitDecay * hitDecay;
  const sealDecay = interpolate(frame, [196, 200], [1, 0], CLAMP);
  const sealE = sealDecay * sealDecay;

  const shakeX = Math.sin(frame * 5.1) * 19 * hitE + Math.sin(frame * 6.4) * 6 * sealE;
  const shakeY = Math.cos(frame * 6.3) * 13 * hitE + Math.cos(frame * 7.1) * 4 * sealE;
  const shakeR = Math.sin(frame * 4.4) * 0.95 * hitE + Math.sin(frame * 5.8) * 0.3 * sealE;

  const dolly = 0.952 + camA * 0.062 + camB * 0.03 - camC * 0.05 + camD * 0.014 + breath + hitE * 0.012;
  const ry = -7.2 + camA * 5 + camB * 2.6 - camC * 2.3 + Math.sin(t * 0.44) * 0.55 + Math.sin(t * 0.19 + 0.6) * 0.32;
  const rx = -3.6 + camA * 2.2 - camB * 1.1 + camC * 0.9 + Math.sin(t * 0.37 + 2) * 0.3;
  const panX = 30 - camA * 24 - camB * 13 + camC * 9 + Math.sin(t * 0.4) * 2.6 + shakeX;
  const panY = -14 + camA * 10 + camB * 6 - camC * 7 + Math.cos(t * 0.33) * 2.1 + shakeY;

  /* ---------------- color de la escena: aqua → ámbar → rojo */
  const halo = interpolateColors(frame, [18, 62, 96], [BAS.aqua, BAS.amber, BAS.no]);
  const haloAmt =
    interpolate(frame, [0, 26, 70, 96, 130, 220], [0.09, 0.19, 0.25, 0.46, 0.32, 0.28], CLAMP) + hitE * 0.16;
  const chill = interpolate(frame, [30, 68], [0, 0.42], CLAMP) * (1 - interpolate(frame, [96, 118], [0, 0.55], CLAMP));
  const alarm = interpolate(frame, [94, 116], [0, 1], {...CLAMP, easing: easeOut});

  /* ---------------- acto 1-2: el pote inocente */
  const potIn = interpolate(frame, [0, 24], [0, 1], {...CLAMP, easing: easeOut});
  const potRise = interpolate(frame, [0, 30], [86, 0], {...CLAMP, easing: easeOut});
  const move = interpolate(frame, [70, 92], [0, 1], {...CLAMP, easing: easeIOc});
  const potCX = interpolate(move, [0, 1], [960, 566]);
  const potCY = interpolate(move, [0, 1], [498, 424]);
  const potScale = interpolate(move, [0, 1], [1.18, 1]) * (1 + hitE * 0.02);
  const trem = interpolate(frame, [44, 72], [0, 1], CLAMP) * (1 - move * 0.35);
  const tremX = Math.sin(frame * 3.3) * 2.7 * trem;
  const tremY = Math.cos(frame * 4.1) * 1.9 * trem;

  /* ---------------- acto 3: el equivalente, de golpe */
  const meatA = interpolate(frame, [88, 98], [0, 1], {...CLAMP, easing: easeQuint});
  const meatB = interpolate(frame, [93, 104], [0, 1], {...CLAMP, easing: easeQuint});
  const eqP = interpolate(frame, [94, 104], [0, 1], {...CLAMP, easing: easeQuint});
  const eqPop = interpolate(frame, [95, 101, 114], [0, 1, 0], CLAMP);
  const labA = interpolate(frame, [99, 116], [0, 1], {...CLAMP, easing: easeOut});
  const labB = interpolate(frame, [104, 121], [0, 1], {...CLAMP, easing: easeOut});
  const flash = interpolate(frame, [94, 95, 98], [0, 0.32, 0], CLAMP); // ≤3 frames, suave (+60)

  /* ---------------- acto 2/3: la promesa y su tachadura */
  const promP = interpolate(frame, [36, 54], [0, 1], {...CLAMP, easing: easeOut});
  const strike = interpolate(frame, [97, 114], [0, 1], {...CLAMP, easing: easeOut});

  /* ---------------- acto 4: la descarga sobre el filtro */
  const kidneyGhost = interpolate(frame, [10, 40], [0, 0.2], CLAMP);
  const kidneyIn = Math.max(kidneyGhost, interpolate(frame, [92, 128], [0.2, 1], {...CLAMP, easing: easeOut}));
  const loadRamp = interpolate(frame, [96, 152], [0, 1], {...CLAMP, easing: easeOut});
  // latido continuo que ACELERA con la carga (fase integrada: nunca salta)
  const beatPhase = t * Math.PI * 2 * 0.82 + loadRamp * Math.max(0, (frame - 96) / fps) * Math.PI * 2 * 0.5;
  const beat = 0.5 + 0.5 * Math.sin(beatPhase);
  const cascade = interpolate(frame, [96, 112, 214, 268], [0, 1, 1, 0.3], CLAMP);
  const phosP = interpolate(frame, [126, 146], [0, 1], {...CLAMP, easing: easeOut});
  const phosPulse = 0.5 + 0.5 * Math.sin(t * 1.9 + 0.8);

  /* ---------------- acto 5: veredicto + sello */
  const cardP = interpolate(frame, [160, 188], [0, 1], {...CLAMP, easing: easeOut});
  const ruleP = interpolate(frame, [232, 262], [0, 1], {...CLAMP, easing: easeOut});
  const sealP = interpolate(frame, [190, 199], [0, 1], {...CLAMP, easing: easeIn});
  const sealOp = interpolate(frame, [190, 194], [0, 1], CLAMP);
  const sealRing = interpolate(frame, [199, 218], [0, 1], CLAMP);
  const cardSheen = frame > 206 ? ((frame - 206) % 152) / 152 : -1;
  const potSheen = frame > 268 ? ((frame - 268) % 168) / 168 : -1;

  /* ---------------- cascada determinística de polvo/carga (pote → filtro) */
  const FAST = 56;
  const SLOW = 24;
  const mouthY = potCY + 178;

  const dust = (i: number, slow: boolean) => {
    const a = hash(i * 1.7 + (slow ? 41.3 : 3.1));
    const b = hash(i * 2.9 + (slow ? 17.9 : 11.7));
    const c = hash(i * 4.3 + (slow ? 7.7 : 5.5));
    const period = slow ? 108 + a * 62 : 27 + a * 21;
    const start = (slow ? 150 : 96) + b * (slow ? 90 : 15);
    if (frame < start) return null;
    const ph = ((frame - start) / period) % 1;
    const g = ph * ph * 0.74 + ph * 0.26; // gravedad
    const x0 = potCX - 148 + a * 296;
    const y0 = mouthY - 26 + c * 42;
    const x1 = 960 - 138 + c * 276;
    const y1 = 838 + b * 66;
    const x = x0 + (x1 - x0) * g + Math.sin(ph * 6.283 + i * 1.9) * (slow ? 16 : 9) * (1 - ph * 0.6);
    const y = y0 + (y1 - y0) * g;
    const sz = (slow ? 3 : 4) + c * (slow ? 4 : 6);
    const op =
      cascade *
      (slow ? 0.34 : 0.3 + a * 0.6) *
      interpolate(ph, [0, 0.07, 0.8, 1], [0, 1, 1, 0], CLAMP) *
      (slow ? interpolate(frame, [150, 200], [0, 1], CLAMP) : 1);
    const col = interpolateColors(c, [0, 1], [BAS.amber, BAS.no]);
    return (
      <div
        key={`${slow ? 's' : 'f'}${i}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: sz,
          height: sz * (1.3 + g * 1.9),
          borderRadius: '50% 50% 46% 46% / 46% 46% 54% 54%',
          background: col,
          opacity: op,
          boxShadow: `0 0 ${sz * 3.2}px ${rgba(col, 0.8)}`,
          filter: slow ? 'blur(0.8px)' : undefined,
        }}
      />
    );
  };

  const hardShadow = `0 2px 12px ${rgba('#000000', 0.8)}, 0 0 34px ${rgba('#001019', 0.7)}`;

  return (
    <AbsoluteFill style={{background: BAS.bgDeep, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: W,
          height: H,
          transform: `translate(-50%, -50%) scale(${fit})`,
          perspective: 1600,
          perspectiveOrigin: '50% 44%',
          overflow: 'hidden',
          background: `radial-gradient(110% 100% at 50% 34%, ${BAS.bgPanel} 0%, ${BAS.bg} 46%, ${BAS.bgDeep} 78%, ${BAS.bgEdge} 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${shakeR}deg) translateX(${panX}px) translateY(${panY}px) scale(${dolly})`,
            transformOrigin: '50% 46%',
          }}
        >
          {/* ============ z -280 · ATMÓSFERA: haz cenital + polvo suspendido ============ */}
          <Plane z={-280}>
            <div
              style={{
                position: 'absolute',
                left: 360,
                top: -200,
                width: 1200,
                height: 900,
                background: `linear-gradient(180deg, ${rgba('#BEE8F4', 0.1)} 0%, transparent 76%)`,
                filter: 'blur(48px)',
                transform: `translateX(${Math.sin(t * 0.23) * 22}px)`,
              }}
            />
            {Array.from({length: 20}).map((_, i) => {
              const s = hash(i * 9.13 + 1.7);
              const s2 = hash(i * 3.71 + 8.3);
              const y = ((t * (3 + s2 * 4) + s * 120) % 128) - 12;
              const sz = 2 + s2 * 3;
              return (
                <div
                  key={`a${i}`}
                  style={{
                    position: 'absolute',
                    left: `${s * 100}%`,
                    top: `${y}%`,
                    width: sz,
                    height: sz,
                    borderRadius: '50%',
                    background: BAS.aquaLite,
                    opacity: 0.1 + s2 * 0.2,
                    filter: 'blur(0.6px)',
                  }}
                />
              );
            })}
          </Plane>

          {/* ============ z -210 · HALO que vira aqua → ámbar → rojo ============ */}
          <Plane z={-210}>
            <div
              style={{
                position: 'absolute',
                left: 260,
                top: 40,
                width: 1400,
                height: 900,
                borderRadius: '50%',
                background: `radial-gradient(closest-side, ${rgba(halo, haloAmt)} 0%, transparent 72%)`,
                filter: 'blur(26px)',
                transform: `translate(${Math.sin(t * 0.31) * 16}px, ${Math.cos(t * 0.27) * 10}px) scale(${
                  1 + beat * 0.02 * loadRamp
                })`,
              }}
            />
          </Plane>

          {/* ============ z -130 · EL FILTRO (riñón) que recibe la carga ============ */}
          <Plane z={-130} style={{opacity: kidneyIn}}>
            <div
              style={{
                position: 'absolute',
                left: 960 - 330,
                top: 706,
                width: 660,
                height: 400,
                transform: `translateY(${interpolate(kidneyIn, [0.2, 1], [26, 0], CLAMP)}px) scale(${
                  1 + beat * (0.012 + loadRamp * 0.02)
                })`,
                transformOrigin: '50% 20%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 660,
                  height: 400,
                  borderRadius: 40,
                  overflow: 'hidden',
                  maskImage: 'radial-gradient(66% 68% at 50% 40%, #000 46%, transparent 82%)',
                  WebkitMaskImage: 'radial-gradient(66% 68% at 50% 40%, #000 46%, transparent 82%)',
                }}
              >
                <Img
                  src={staticFile(kidneyImg)}
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                <div style={{position: 'absolute', inset: 0, background: rgba(BAS.brand, 0.5), mixBlendMode: 'multiply'}} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(58% 56% at 50% 40%, ${rgba(BAS.amber, 0.5)}, transparent 74%)`,
                    mixBlendMode: 'screen',
                    opacity: loadRamp * (0.5 + beat * 0.5),
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(46% 44% at 50% 42%, ${rgba(BAS.no, 0.62)}, transparent 72%)`,
                    mixBlendMode: 'screen',
                    opacity: loadRamp * (0.28 + beat * 0.52),
                  }}
                />
              </div>
              {/* pulso de saturación alrededor del filtro */}
              <div
                style={{
                  position: 'absolute',
                  left: 120,
                  top: 40,
                  width: 420,
                  height: 300,
                  borderRadius: '50%',
                  background: `radial-gradient(closest-side, ${rgba(
                    BAS.no,
                    0.3 * loadRamp * (0.35 + beat * 0.65)
                  )}, transparent 70%)`,
                  filter: 'blur(30px)',
                }}
              />
            </div>
          </Plane>

          {/* ============ z -50 · cascada TRASERA (polvo lento del hold) ============ */}
          <Plane z={-50}>{Array.from({length: SLOW}).map((_, i) => dust(i, true))}</Plane>

          {/* ============ z 0 · EL POTE (hero) ============ */}
          <Plane z={0}>
            <div style={{position: 'absolute', inset: 0, transform: `translate(${tremX}px, ${potRise + tremY}px)`}}>
              <GlassPhoto
                img={potImg}
                cx={potCX}
                cy={potCY}
                w={470}
                h={430}
                accent={halo}
                opacity={potIn}
                scale={potScale}
                rotZ={interpolate(move, [0, 1], [0, -1.4])}
                rotY={interpolate(move, [0, 1], [0, 3])}
                chill={chill}
                tint={BAS.no}
                tintAmt={alarm * 0.16}
                glow={0.3 + alarm * 0.22 + beat * 0.06 * loadRamp}
                sheen={potSheen}
              />
            </div>
          </Plane>

          {/* ============ z +40 · LOS DOS BIFES (el equivalente) ============ */}
          <Plane z={40}>
            <div style={{opacity: meatA, transform: `translateX(${interpolate(meatA, [0, 1], [300, 0])}px)`}}>
              <GlassPhoto
                img={meatImg}
                cx={1402}
                cy={378}
                w={410}
                h={372}
                accent={BAS.amber}
                rotZ={-4.5}
                rotY={-5}
                scale={interpolate(meatA, [0, 1], [1.14, 0.96])}
                glow={0.24}
              />
            </div>
            <div style={{opacity: meatB, transform: `translateX(${interpolate(meatB, [0, 1], [340, 0])}px)`}}>
              <GlassPhoto
                img={meatImg}
                cx={1318}
                cy={470}
                w={430}
                h={390}
                accent={BAS.no}
                rotZ={3.2}
                rotY={4}
                scale={interpolate(meatB, [0, 1], [1.16, 1])}
                glow={0.3 + alarm * 0.16}
                tint={BAS.no}
                tintAmt={alarm * 0.12}
              />
            </div>
          </Plane>

          {/* ============ z +100 · cascada FRONTAL (el golpe de carga) ============ */}
          <Plane z={100}>{Array.from({length: FAST}).map((_, i) => dust(i, false))}</Plane>

          {/* ============ z +150 · TIPOGRAFÍA ============ */}
          <Plane z={150}>
            {/* kicker */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 62,
                width: W,
                textAlign: 'center',
                fontFamily: FONT_SANS,
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: 12,
                color: interpolateColors(frame, [30, 96], [BAS.aquaLite, BAS.no]),
                opacity: interpolate(frame, [6, 22], [0, 0.95], CLAMP),
                textShadow: hardShadow,
              }}
            >
              PROTEÍNA EN POLVO
            </div>

            {/* lo que PROMETE — pastilla ámbar que después se tacha */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 126,
                transform: `translateX(-50%) translateY(${interpolate(promP, [0, 1], [-22, 0])}px)`,
                opacity: promP,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '13px 40px',
                  borderRadius: 999,
                  border: `2px solid ${rgba(BAS.amber, 0.65)}`,
                  background: `linear-gradient(180deg, ${rgba(BAS.amber, 0.16)}, ${rgba(BAS.bgDeep, 0.55)})`,
                  boxShadow: `0 0 34px ${rgba(BAS.amber, 0.28)}, 0 14px 34px ${rgba('#000000', 0.5)}`,
                  fontFamily: FONT_SANS,
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: '#FBEAD2',
                  whiteSpace: 'nowrap',
                  textShadow: `0 2px 10px ${rgba('#000000', 0.7)}`,
                }}
              >
                {promise}
                <div
                  style={{
                    position: 'absolute',
                    left: 26,
                    top: '52%',
                    height: 5,
                    borderRadius: 3,
                    width: `calc(${strike * 100}% - ${strike * 52}px)`,
                    background: BAS.no,
                    boxShadow: `0 0 20px ${rgba(BAS.no, 0.9)}`,
                    opacity: strike > 0 ? 1 : 0,
                  }}
                />
              </div>
            </div>

            {/* ≈ el equivalente */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 336,
                width: W,
                textAlign: 'center',
                fontFamily: FONT_SANS,
                fontSize: 152,
                fontWeight: 300,
                lineHeight: 1,
                color: BAS.amber,
                opacity: eqP,
                transform: `scale(${interpolate(eqP, [0, 1], [0.5, 1]) + eqPop * 0.16})`,
                textShadow: `0 0 ${26 + eqPop * 48}px ${rgba(BAS.amber, 0.55 + eqPop * 0.45)}, 0 4px 16px ${rgba(
                  '#000000',
                  0.8
                )}`,
              }}
            >
              ≈
            </div>

            {/* 1 medida · 2 bifes */}
            <div
              style={{
                position: 'absolute',
                left: 566 - 340,
                top: 630,
                width: 680,
                textAlign: 'center',
                fontFamily: FONT_DISPLAY,
                fontSize: 96,
                lineHeight: 1,
                fontWeight: 700,
                color: '#F2FAFD',
                opacity: labA,
                transform: `translateY(${interpolate(labA, [0, 1], [26, 0])}px)`,
                textShadow: `0 3px 18px ${rgba('#000000', 0.85)}, 0 0 44px ${rgba(BAS.aqua, 0.3)}`,
                whiteSpace: 'nowrap',
              }}
            >
              {equivA}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 1354 - 340,
                top: 630,
                width: 680,
                textAlign: 'center',
                fontFamily: FONT_DISPLAY,
                fontSize: 96,
                lineHeight: 1,
                fontWeight: 700,
                color: '#FFE9E4',
                opacity: labB,
                transform: `translateY(${interpolate(labB, [0, 1], [26, 0])}px)`,
                textShadow: `0 3px 18px ${rgba('#000000', 0.85)}, 0 0 48px ${rgba(BAS.no, 0.45)}`,
                whiteSpace: 'nowrap',
              }}
            >
              {equivB}
            </div>

            {/* FOSFATOS AÑADIDOS — sobre el filtro */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 756,
                transform: `translateX(-50%) translateY(${interpolate(phosP, [0, 1], [18, 0])}px) scale(${
                  1 + phosPulse * 0.008
                })`,
                opacity: phosP,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  padding: '11px 34px',
                  borderRadius: 12,
                  background: `linear-gradient(180deg, ${BAS.no}, ${BAS.noDark})`,
                  border: `1px solid ${rgba('#FFFFFF', 0.22)}`,
                  boxShadow: `0 0 ${28 + phosPulse * 22}px ${rgba(BAS.no, 0.55)}, 0 16px 36px ${rgba('#000000', 0.6)}`,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{fontFamily: FONT_SANS, fontSize: 40, fontWeight: 800, letterSpacing: 3, color: BAS.onNo}}>
                  FOSFATOS AÑADIDOS
                </span>
                <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 500, color: rgba('#FFECEA', 0.92)}}>
                  · se absorben casi enteros
                </span>
              </div>
            </div>
          </Plane>

          {/* ============ z +230 · VEREDICTO (tarjeta clínica clara) + SELLO ✕ ============ */}
          <Plane z={230}>
            <div
              style={{
                position: 'absolute',
                left: 300,
                top: 846,
                width: 1320,
                height: 196,
                opacity: cardP,
                transform: `translateY(${interpolate(cardP, [0, 1], [80, 0])}px) scale(${
                  interpolate(cardP, [0, 1], [0.96, 1]) + Math.sin(t * 0.7) * 0.002
                })`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 1320,
                  height: 196,
                  borderRadius: 18,
                  overflow: 'hidden',
                  background: `linear-gradient(174deg, ${BAS.card} 0%, ${BAS.cardWarm} 100%)`,
                  border: `1px solid ${BAS.cardEdge}`,
                  boxShadow: CARD_SHADOW,
                }}
              >
                <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 7, background: BAS.no}} />
                <div
                  style={{
                    position: 'absolute',
                    left: 168,
                    top: 40,
                    right: 56,
                    fontFamily: FONT_DISPLAY,
                    fontSize: 62,
                    fontWeight: 700,
                    color: BAS.ink,
                    letterSpacing: -0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {verdict}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 168,
                    top: 124,
                    height: 3,
                    width: ruleP * 300,
                    background: BAS.no,
                    borderRadius: 2,
                    opacity: 0.75,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 168,
                    top: 138,
                    right: 56,
                    fontFamily: FONT_SANS,
                    fontSize: 34,
                    fontWeight: 600,
                    color: BAS.ink2,
                    letterSpacing: 0.4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {note}
                </div>
                {/* barrido de luz sobre el papel (el hold nunca se congela) */}
                {cardSheen >= 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(104deg, transparent ${cardSheen * 150 - 50}%, ${rgba(
                        '#FFFFFF',
                        0.55
                      )} ${cardSheen * 150 - 32}%, transparent ${cardSheen * 150 - 12}%)`,
                      mixBlendMode: 'overlay',
                    }}
                  />
                ) : null}
              </div>

              {/* SELLO ✕ — golpea UNA vez y queda */}
              <div
                style={{
                  position: 'absolute',
                  left: -22,
                  top: 34,
                  width: 132,
                  height: 132,
                  opacity: sealOp,
                  transform: `scale(${interpolate(sealP, [0, 1], [2.5, 1])}) rotate(${interpolate(
                    sealP,
                    [0, 1],
                    [-28, -9]
                  )}deg)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 132,
                    height: 132,
                    borderRadius: '50%',
                    border: `9px solid ${BAS.no}`,
                    background: rgba(BAS.card, 0.92),
                    boxShadow: `0 12px 30px ${rgba('#000000', 0.45)}, inset 0 0 22px ${rgba(BAS.no, 0.2)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 30,
                    top: 61,
                    width: 72,
                    height: 10,
                    borderRadius: 5,
                    background: BAS.no,
                    transform: 'rotate(45deg)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 30,
                    top: 61,
                    width: 72,
                    height: 10,
                    borderRadius: 5,
                    background: BAS.no,
                    transform: 'rotate(-45deg)',
                  }}
                />
                {/* onda del golpe */}
                <div
                  style={{
                    position: 'absolute',
                    left: -66 * sealRing * 1.5,
                    top: -66 * sealRing * 1.5,
                    width: 132 * (1 + sealRing * 1.5),
                    height: 132 * (1 + sealRing * 1.5),
                    borderRadius: '50%',
                    border: `3px solid ${rgba(BAS.no, 0.7 * (1 - sealRing))}`,
                    opacity: sealRing > 0 && sealRing < 1 ? 1 : 0,
                  }}
                />
              </div>
            </div>
          </Plane>
        </div>

        {/* ============ atmósfera de cámara (fuera del stage 3D) ============ */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(128% 118% at 50% 44%, transparent 46%, ${rgba(BAS.bgEdge, 0.74)} 100%)`,
          }}
        />
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(70% 60% at 50% 46%, ${rgba('#FFFFFF', 0.9)}, ${rgba(
              '#FFE9E4',
              0.4
            )} 60%, transparent 78%)`,
            opacity: flash,
            mixBlendMode: 'screen',
          }}
        />
        <GrainOverlay opacity={0.06} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ export */

export const ShakeRevealScene: React.FC<ShakeRevealSceneProps> = ({
  potImg = 'img/bas7_batido.jpg',
  meatImg = 'img/bas7_carne.jpg',
  kidneyImg = 'img/bas6_p_rinon_filtro.jpg',
  promise = 'Se lo recomendaron para no perder músculo',
  equivA = '1 medida',
  equivB = '2 bifes',
  verdict = 'La carga de dos bifes, de golpe',
  note = 'Fosfatos añadidos · consúltelo con su médico',
}) => (
  <Sequence durationInFrames={DUR} name="ShakeReveal · el batido">
    <Body
      potImg={potImg}
      meatImg={meatImg}
      kidneyImg={kidneyImg}
      promise={promise}
      equivA={equivA}
      equivB={equivB}
      verdict={verdict}
      note={note}
    />
  </Sequence>
);

export default ShakeRevealScene;
