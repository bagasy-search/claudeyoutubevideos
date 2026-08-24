/**
 * AshFurnaceScene — microescena 2.5D dirigida (estándar `microescenas_2_5d.md`).
 *
 * BEAT: "La proteína es, literalmente, la leña de ese fuego... pero no toda la leña deja la misma
 * ceniza. Hay leña que arde limpia y deja el hogar casi vacío, y hay leña que le deja la chimenea
 * negra de hollín y encima le tapa el tiraje."
 *
 * IDEA VISUAL: DOS HOGARES ENFRENTADOS detrás de dos vidrios ahumados, separados por un pilar de
 * mampostería. Izquierda = fuego vivo, luz cálida que late, chispas doradas, bandeja de ceniza
 * casi vacía. Derecha = hogar muerto, luz fría, lluvia de ceniza, bandeja desbordada y el TIRAJE
 * que se tapa con un tapón de hollín que baja y ahoga el humo.
 *
 * COMPOSICIÓN: familia LATERAL (comparación). 7 planos con translateZ real:
 *   −260 atmósfera · −150 brasas lejanas · −60 pilar · +10 hogar limpio · +54 hogar sucio
 *   +96 rótulos · +118 título · +150 ceniza en primer plano.
 * CÁMARA: dolly-in con easing no constante + drift senoidal + micro rotateY, y un impact-shake
 * corto cuando el hogar sucio irrumpe.
 *
 * Puro `useCurrentFrame()` (el farm rinde en chunks): sin Math.random, sin Date, sin backdrop-filter.
 * Pensada para <Sequence durationInFrames={430}> a 1920×1080 / 30fps.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, CoolVignette, FONT_DISPLAY, FONT_SANS, GrainOverlay, rgba, shade} from './../theme';

export type AshFurnaceSceneProps = {
  leftImg?: string;
  rightImg?: string;
  title?: string;
  leftLabel?: string;
  leftSub?: string;
  rightLabel?: string;
  rightSub?: string;
};

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.cubic);
const easeIO = Easing.bezier(0.4, 0, 0.2, 1);

/* --- geometría del escenario (espacio 1920×1080) --- */
const PERSP = 1600;
const PW = 768; // ancho de cada hogar
const PH = 418; // alto del vidrio del hogar
const LX = 110; // x del hogar limpio
const RX = 1042; // x del hogar sucio
const PTOP = 286;
const METER_Y = PTOP + PH + 24;
const PLINTH_Y = METER_Y + 78;

const WARM = '#FFB258';
const EMBER = '#FF7A2A';
const COLD = '#8FA6B4';
const ASH = '#B9C1C6';

export const AshFurnaceScene: React.FC<AshFurnaceSceneProps> = ({
  leftImg = 'img/bas7_broll_lena_limpia.jpg',
  rightImg = 'img/bas7_broll_hollin.jpg',
  title = 'La misma leña… no la misma ceniza',
  leftLabel = 'ARDE LIMPIA',
  leftSub = 'deja el hogar casi vacío',
  rightLabel = 'DEJA HOLLÍN',
  rightSub = 'y le tapa el tiraje',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  /* ============ ACTOS ============ */
  // (1) ambiente 0–15: RAMPA CORTA (0,5 s). Nunca fundido desde negro: a los 15f ya hay materia
  // en pantalla (pilar + pileta de luz de fuego + el hogar limpio entrando).
  const ambP = interpolate(frame, [0, 14], [0.5, 1], {...CL, easing: easeOut});
  const wallP = interpolate(frame, [0, 10], [0.55, 1], {...CL, easing: easeIO});
  // (2) el hogar limpio ENTRA EN CORTE (ya visible al 58% en el frame 0) y termina de asentarse
  // en 10f; el deslizamiento lateral sigue su propia rampa un poco más larga.
  const leftFade = interpolate(frame, [0, 10], [0.58, 1], {...CL, easing: easeOut});
  const leftP = interpolate(frame, [0, 26], [0, 1], {...CL, easing: easeOut});
  const emberP = interpolate(frame, [8, 40], [0, 1], CL);
  // (3) el hogar sucio IRRUMPE 84–128 (+ golpe de cámara)
  const rightP = spring({frame: Math.max(0, frame - 84), fps, config: {damping: 12, mass: 0.95, stiffness: 132}});
  const hit = interpolate(frame, [92, 100, 128], [0, 1, 0], {...CL, easing: easeOut});
  const sootP = interpolate(frame, [96, 176], [0, 1], {...CL, easing: easeIO});
  const shock = interpolate(frame, [90, 126], [0, 1], CL);
  // (4) rótulos en cascada 124–236
  const lLabP = interpolate(frame, [124, 148], [0, 1], {...CL, easing: easeOut});
  const lSubP = interpolate(frame, [140, 162], [0, 1], {...CL, easing: easeOut});
  const rLabP = interpolate(frame, [152, 176], [0, 1], {...CL, easing: easeOut});
  const rSubP = interpolate(frame, [168, 190], [0, 1], {...CL, easing: easeOut});
  const lFill = interpolate(frame, [150, 200], [0, 0.07], {...CL, easing: easeIO});
  const rFill = interpolate(frame, [164, 222], [0, 0.94], {...CL, easing: easeIO});
  const titleP = interpolate(frame, [196, 226], [0, 1], {...CL, easing: easeOut});
  const titleWipe = interpolate(frame, [198, 236], [0, 1], {...CL, easing: easeIO});
  const flueP = interpolate(frame, [214, 272], [0, 1], {...CL, easing: easeIO}); // el tiraje se tapa
  // (5) hold vivo 272–430: nada se congela (llama, ceniza, parallax, barrido especular)

  /* ============ CÁMARA ============ */
  const camP = interpolate(frame, [0, 92], [0, 1], {...CL, easing: easeIO});
  const shakeX = Math.sin(frame * 2.31) * 11 * hit;
  const shakeY = Math.cos(frame * 3.07) * 6 * hit;
  const ry = interpolate(camP, [0, 1], [-6.6, -1.2]) + Math.sin(t * 0.41) * 0.38 + Math.sin(frame * 2.7) * 0.5 * hit;
  const rx = interpolate(camP, [0, 1], [-3.4, -0.7]) + Math.sin(t * 0.29) * 0.16;
  const dolly =
    interpolate(camP, [0, 1], [0.944, 1.0]) +
    interpolate(frame, [92, 430], [0, 0.026], CL) +
    Math.sin(t * 0.53) * 0.0022 +
    hit * 0.008;
  const panX = interpolate(camP, [0, 1], [30, 0]) + Math.sin(t * 0.36) * 3.2 + shakeX;
  const panY = Math.sin(t * 0.27) * 2.2 + shakeY;

  /* ============ LUZ ============ */
  // fuego: parpadeo determinístico (3 senos batiendo)
  const flick = 0.78 + 0.22 * (Math.sin(t * 7.7) * 0.5 + Math.sin(t * 12.9) * 0.3 + Math.sin(t * 3.3) * 0.2);
  const fire = flick * leftFade;
  const cold = (0.86 + 0.14 * Math.sin(t * 1.05)) * Math.min(1, rightP);
  const sweep = ((frame % 150) / 150) * 150 - 25; // barrido especular del vidrio

  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${z}px) scale(${1 - z / PERSP})`,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );

  /* --- marco de vidrio ahumado con la FOTO REAL adentro --- */
  const Hearth: React.FC<{x: number; src: string; accent: string; warmSide: boolean; reveal: number; kb: number}> = ({
    x,
    src,
    accent,
    warmSide,
    reveal,
    kb,
  }) => (
    <div style={{position: 'absolute', left: x, top: PTOP, width: PW, height: PH}}>
      {/* grosor: copia oscura desplazada detrás */}
      <div style={{position: 'absolute', left: 12, top: 16, width: PW, height: PH, borderRadius: 24, background: '#02070B', opacity: 0.85 * reveal}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          overflow: 'hidden',
          background: `linear-gradient(152deg, ${rgba('#16212B', 0.92)} 0%, ${rgba('#080D12', 0.96)} 58%, ${rgba('#03070A', 0.98)} 100%)`,
          border: `1px solid ${rgba('#FFFFFF', 0.1)}`,
          boxShadow: [
            `inset 0 2px 0 ${rgba('#FFFFFF', 0.17)}`,
            `inset 0 -3px 10px ${rgba('#000000', 0.66)}`,
            `inset 0 0 70px ${rgba('#000000', 0.5)}`,
            `0 60px 120px ${rgba('#000000', 0.62)}`,
            `0 10px 34px ${rgba('#000000', 0.5)}`,
            `0 0 ${warmSide ? 46 + fire * 34 : 30}px ${rgba(accent, warmSide ? 0.1 + fire * 0.16 : 0.12)}`,
          ].join(', '),
        }}
      >
        <div style={{position: 'absolute', inset: 13, borderRadius: 13, overflow: 'hidden', boxShadow: `inset 0 0 44px ${rgba('#000000', 0.72)}`}}>
          <Img
            src={staticFile(src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${kb}) translate(${Math.sin(t * 0.19) * 6}px, ${Math.cos(t * 0.16) * 5}px)`,
              // grado: el hogar vivo satura y calienta; el sucio pierde color y luz (hollín)
              filter: warmSide
                ? `saturate(${1.06 + fire * 0.1}) contrast(1.05) brightness(${0.98 + fire * 0.06})`
                : `saturate(${0.5 - sootP * 0.24}) brightness(${0.78 - sootP * 0.2}) contrast(1.12)`,
              opacity: 0.34 + 0.66 * reveal,
            }}
          />
          {/* grado de luz: cálido vivo / frío muerto */}
          {warmSide ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(78% 86% at 50% 96%, ${rgba(EMBER, 0.42 * fire)} 0%, ${rgba(WARM, 0.16 * fire)} 42%, transparent 74%)`,
                  mixBlendMode: 'screen',
                }}
              />
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 96, background: `linear-gradient(0deg, ${rgba(EMBER, 0.5 * fire)}, transparent)`, mixBlendMode: 'screen'}} />
            </>
          ) : (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, ${rgba('#04070A', 0.78 * sootP)} 0%, ${rgba('#070B0F', 0.28 * sootP)} 46%, ${rgba('#020507', 0.62 * sootP)} 100%)`,
                }}
              />
              <div style={{position: 'absolute', inset: 0, background: `radial-gradient(62% 70% at 50% 24%, ${rgba(COLD, 0.12 * cold)}, transparent 72%)`, mixBlendMode: 'screen'}} />
              {/* costra de hollín en las esquinas altas */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(52% 60% at 6% -6%, ${rgba('#000000', 0.9 * sootP)}, transparent 70%), radial-gradient(52% 60% at 94% -6%, ${rgba('#000000', 0.86 * sootP)}, transparent 70%)`,
                }}
              />
            </>
          )}
          {/* oclusión interna del marco */}
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(120% 110% at 50% 44%, transparent 48%, ${rgba('#000000', 0.6)} 100%)`}} />
        </div>

        {/* reflejo especular que viaja por el cristal */}
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(108deg, transparent ${sweep - 7}%, ${rgba('#FFFFFF', 0.06)} ${sweep}%, transparent ${sweep + 7}%)`}} />
        {/* bisel superior */}
        <div style={{position: 'absolute', left: 22, right: 22, top: 1, height: 2, background: `linear-gradient(90deg, transparent, ${rgba('#FFFFFF', 0.34)}, transparent)`}} />
      </div>
      {/* filo de luz del acento en el canto interior (mira al pilar) */}
      <div
        style={{
          position: 'absolute',
          left: warmSide ? PW - 4 : 1,
          top: 34,
          width: 3,
          height: PH - 68,
          borderRadius: 3,
          background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
          opacity: (warmSide ? 0.24 + fire * 0.4 : 0.3 * cold) * reveal,
          boxShadow: `0 0 20px ${rgba(accent, 0.6)}`,
        }}
      />
    </div>
  );

  /* --- bandeja de ceniza: el medidor semántico (vacío vs desbordado) --- */
  const AshTray: React.FC<{x: number; fill: number; tone: string; grey: boolean; op: number}> = ({x, fill, tone, grey, op}) => (
    <div style={{position: 'absolute', left: x, top: METER_Y, width: PW, height: 46, opacity: op}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: `linear-gradient(180deg, ${rgba('#0A131A', 0.95)}, ${rgba('#04090D', 0.98)})`,
          border: `1px solid ${rgba('#FFFFFF', 0.07)}`,
          boxShadow: `inset 0 2px 6px ${rgba('#000000', 0.8)}, inset 0 -1px 0 ${rgba('#FFFFFF', 0.06)}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fill * 100}%`,
            background: grey
              ? `linear-gradient(180deg, ${rgba('#9CA6AC', 0.62)} 0%, ${rgba('#5D666C', 0.94)} 58%, ${rgba('#3A4247', 0.98)} 100%)`
              : `linear-gradient(180deg, ${rgba(tone, 0.55)}, ${rgba(shade(tone, -0.42), 0.94)})`,
            boxShadow: `inset 0 2px 0 ${rgba('#FFFFFF', 0.18)}, inset 0 -6px 12px ${rgba('#000000', 0.45)}, 0 0 16px ${rgba(grey ? '#8A959B' : tone, 0.38)}`,
            overflow: 'hidden',
          }}
        >
          {/* grano de la ceniza: grumos determinísticos, no una barra plana */}
          {grey
            ? Array.from({length: 34}).map((_, i) => {
                const s = (i * 37.7) % 100;
                return (
                  <div
                    key={`gr${i}`}
                    style={{
                      position: 'absolute',
                      left: `${(s * 1.7) % 100}%`,
                      top: 3 + ((s * 3.1) % 34),
                      width: 3 + (s % 4) * 2,
                      height: 3 + (s % 3) * 2,
                      borderRadius: '50%',
                      background: s % 3 === 0 ? rgba('#20272B', 0.42) : rgba('#D2D9DD', 0.14),
                    }}
                  />
                );
              })
            : null}
        </div>
        {/* frente de la ceniza (montículo que avanza) */}
        <div
          style={{
            position: 'absolute',
            left: `${fill * 100}%`,
            top: 0,
            bottom: 0,
            width: 30,
            transform: 'translateX(-15px)',
            background: `linear-gradient(90deg, transparent, ${rgba(grey ? ASH : tone, 0.4)}, transparent)`,
          }}
        />
        <div style={{position: 'absolute', right: 12, top: 9, height: 28, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 7, background: rgba('#02080C', 0.82), boxShadow: `inset 0 1px 0 ${rgba('#FFFFFF', 0.08)}`}}>
          <span style={{fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, letterSpacing: 5, color: rgba('#DDEAF0', 0.66)}}>CENIZA</span>
        </div>
      </div>
    </div>
  );

  /* --- plinto del rótulo: vidrio + chip de veredicto SÍ/NO --- */
  const Plinth: React.FC<{x: number; accent: string; ink: string; mark: string; label: string; sub: string; p: number; ps: number}> = ({
    x,
    accent,
    ink,
    mark,
    label,
    sub,
    p,
    ps,
  }) => (
    <div style={{position: 'absolute', left: x, top: PLINTH_Y, width: PW, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`}}>
      {/* cama oscura bajo el texto = legibilidad garantizada (+60) */}
      <div style={{position: 'absolute', left: -30, top: -26, width: PW + 60, height: 158, background: `radial-gradient(60% 70% at 40% 50%, ${rgba('#020609', 0.84)}, transparent 76%)`}} />
      <div style={{position: 'absolute', left: 0, top: 8, width: 6, height: 104, borderRadius: 6, background: accent, boxShadow: `0 0 22px ${rgba(accent, 0.75)}`}} />
      <div style={{position: 'absolute', left: 30, top: 0, display: 'flex', alignItems: 'center', gap: 22}}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 16,
            background: `linear-gradient(150deg, ${shade(accent, 0.16)}, ${shade(accent, -0.28)})`,
            boxShadow: `0 10px 24px ${rgba('#000000', 0.6)}, inset 0 2px 0 ${rgba('#FFFFFF', 0.3)}, 0 0 ${18 + p * 14}px ${rgba(accent, 0.5)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
          }}
        >
          <span style={{fontFamily: FONT_SANS, fontSize: 34, fontWeight: 800, color: ink, lineHeight: 1}}>{mark}</span>
        </div>
        <div style={{position: 'relative', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: 1,
              whiteSpace: 'nowrap',
              color: '#F3F8FA',
              textShadow: `0 3px 20px ${rgba('#000000', 0.9)}, 0 0 40px ${rgba(accent, 0.35)}`,
            }}
          >
            {label}
          </span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 116, top: 84, opacity: ps, transform: `translateY(${interpolate(ps, [0, 1], [12, 0])}px)`}}>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: 1.4,
            whiteSpace: 'nowrap',
            color: rgba('#D9EAF2', 0.74),
            textShadow: `0 2px 12px ${rgba('#000000', 0.9)}`,
          }}
        >
          {sub}
        </span>
      </div>
    </div>
  );

  const tIdx = title.indexOf('…');
  const tHead = tIdx < 0 ? title : title.slice(0, tIdx + 1);
  const tTail = tIdx < 0 ? '' : title.slice(tIdx + 1).trim();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(96% 100% at 50% 46%, ${BAS.bgPanel} 0%, ${BAS.bg} 40%, ${BAS.bgDeep} 72%, #020A11 100%)`,
        perspective: PERSP,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) translate(${panX}px, ${panY}px) scale(${dolly})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* ===== PLANO −260 · ATMÓSFERA: calor a la izq / frío muerto y humo a la der ===== */}
        <Layer z={-260}>
          {/* pileta de luz de fuego derramada en el piso, a los pies del hogar limpio */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: ambP,
              background: `radial-gradient(26% 22% at 25% 86%, ${rgba(EMBER, 0.2 * (0.55 + fire * 0.45))} 0%, ${rgba(EMBER, 0.07 * fire)} 46%, transparent 74%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: Math.min(1, rightP),
              background: `radial-gradient(30% 26% at 76% 86%, ${rgba('#0B1218', 0.6)} 0%, transparent 72%)`,
            }}
          />
          {Array.from({length: 7}).map((_, i) => {
            const s = (i * 53.7) % 100;
            const life = ((t * (2.4 + (s % 3) * 0.4) + s * 1.3) % 100) / 100;
            return (
              <div
                key={`sm${i}`}
                style={{
                  position: 'absolute',
                  left: 980 + ((s * 8.1) % 760),
                  top: 900 - life * 820,
                  width: 220 + (s % 5) * 40,
                  height: 220 + (s % 4) * 50,
                  borderRadius: '50%',
                  background: `radial-gradient(closest-side, ${rgba('#4A5A66', 0.14)}, transparent 72%)`,
                  opacity: Math.sin(life * Math.PI) * 0.9 * Math.min(1, rightP),
                }}
              />
            );
          })}
        </Layer>

        {/* ===== PLANO −150 · BRASAS LEJANAS (fuera de foco) ===== */}
        <Layer z={-150} style={{opacity: ambP, transform: `translateZ(-150px) scale(${1 + 150 / PERSP})`}}>
          {Array.from({length: 16}).map((_, i) => {
            const s = (i * 71.3) % 100;
            const life = ((t * (3 + (s % 4)) + s * 2.7) % 100) / 100;
            const sz = 4 + (s % 5);
            return (
              <div
                key={`fe${i}`}
                style={{
                  position: 'absolute',
                  left: 60 + ((s * 9.4) % 820) + Math.sin(life * 5 + s) * 24,
                  top: 940 - life * 700,
                  width: sz,
                  height: sz,
                  borderRadius: '50%',
                  background: WARM,
                  opacity: Math.sin(life * Math.PI) * 0.34 * (0.6 + fire * 0.4),
                  filter: 'blur(1.4px)',
                }}
              />
            );
          })}
        </Layer>

        {/* ===== PLANO −60 · PILAR DE MAMPOSTERÍA entre los dos hogares ===== */}
        <Layer z={-60} style={{opacity: wallP, transform: `translateZ(-60px) scale(${1 + 60 / PERSP})`}}>
          <div
            style={{
              position: 'absolute',
              left: 900,
              top: 150,
              width: 120,
              height: 990,
              borderRadius: '8px 8px 0 0',
              background: `linear-gradient(96deg, ${rgba('#1B2831', 0.96)} 0%, ${rgba('#0B141B', 0.98)} 46%, ${rgba('#141F27', 0.96)} 100%)`,
              boxShadow: `0 40px 90px ${rgba('#000000', 0.7)}, inset 0 2px 0 ${rgba('#FFFFFF', 0.12)}, inset -2px 0 10px ${rgba('#000000', 0.7)}`,
              overflow: 'hidden',
            }}
          >
            {Array.from({length: 15}).map((_, i) => (
              <div key={`br${i}`} style={{position: 'absolute', left: 0, right: 0, top: 18 + i * 66, height: 1, background: rgba('#FFFFFF', 0.05)}} />
            ))}
            {/* el pilar recibe la luz del fuego por la izquierda y el hollín por la derecha */}
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${rgba(EMBER, 0.2 * fire)}, transparent 58%)`, mixBlendMode: 'screen'}} />
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(270deg, ${rgba('#000000', 0.55 * sootP)}, transparent 52%)`}} />
          </div>
        </Layer>

        {/* ===== PLANO +10 · HOGAR LIMPIO ===== */}
        <Layer
          z={10}
          style={{
            opacity: leftFade,
            transform: `translateZ(10px) scale(${1 - 10 / PERSP}) translateX(${interpolate(leftP, [0, 1], [-64, 0])}px)`,
          }}
        >
          <Hearth x={LX} src={leftImg} accent={BAS.si} warmSide reveal={leftFade} kb={interpolate(frame, [0, 430], [1.07, 1.015], CL)} />
          <AshTray x={LX} fill={lFill} tone={BAS.si} grey={false} op={leftFade} />
        </Layer>

        {/* chispas doradas del lado limpio (pocas, nobles) */}
        <Layer z={34} style={{opacity: emberP, transform: `translateZ(34px) scale(${1 - 34 / PERSP})`}}>
          {Array.from({length: 22}).map((_, i) => {
            const s = (i * 61.7) % 100;
            const life = ((t * (9 + (s % 6)) + s * 1.9) % 100) / 100;
            const sz = 2 + (s % 3);
            return (
              <div
                key={`sp${i}`}
                style={{
                  position: 'absolute',
                  left: LX + 54 + ((s * 7.3) % (PW - 120)) + Math.sin(life * 6.2 + s) * 16,
                  top: PTOP + PH - 46 - life * (PH * 0.92),
                  width: sz,
                  height: sz,
                  borderRadius: '50%',
                  background: '#FFD79A',
                  opacity: Math.sin(life * Math.PI) * (0.5 + (s % 40) / 90) * (0.55 + fire * 0.45),
                  boxShadow: `0 0 ${5 + sz * 3}px ${rgba(WARM, 0.9)}`,
                }}
              />
            );
          })}
        </Layer>

        {/* ===== PLANO +54 · HOGAR SUCIO (irrumpe con golpe) ===== */}
        <Layer
          z={54}
          style={{
            opacity: Math.min(1, rightP * 1.15),
            transform: `translateZ(54px) scale(${1 - 54 / PERSP}) translate3d(${(1 - rightP) * 130}px, 0px, ${(1 - rightP) * -340}px)`,
          }}
        >
          <Hearth x={RX} src={rightImg} accent={BAS.no} warmSide={false} reveal={Math.min(1, rightP)} kb={interpolate(frame, [84, 430], [1.015, 1.075], CL)} />
          <AshTray x={RX} fill={rFill} tone={BAS.no} grey op={Math.min(1, rightP)} />

          {/* EL TIRAJE: conducto vertical que se tapa de hollín y ahoga el humo */}
          <div style={{position: 'absolute', left: RX + PW - 118, top: PTOP + 22, width: 74, height: PH - 44, opacity: Math.min(1, rightP)}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${rgba('#0B1319', 0.86)}, ${rgba('#050A0E', 0.9)})`,
                border: `1px solid ${rgba('#FFFFFF', 0.08)}`,
                boxShadow: `inset 0 0 26px ${rgba('#000000', 0.85)}`,
                overflow: 'hidden',
              }}
            >
              {Array.from({length: 12}).map((_, i) => {
                const s = (i * 43.1) % 100;
                const raw = ((t * (5 + (s % 4)) + s * 2.3) % 100) / 100;
                const ceiling = 0.12 + flueP * 0.72; // el tapón le baja el techo al humo
                const life = Math.min(raw, 1 - ceiling);
                return (
                  <div
                    key={`fs${i}`}
                    style={{
                      position: 'absolute',
                      left: 8 + ((s * 3.7) % 52),
                      top: `${(1 - life) * 100 - 4}%`,
                      width: 8 + (s % 4) * 3,
                      height: 8 + (s % 4) * 3,
                      borderRadius: '50%',
                      background: rgba(ASH, 0.22 + (s % 20) / 100),
                      opacity: 0.7 - flueP * 0.15,
                    }}
                  />
                );
              })}
              {/* TAPÓN de hollín */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: `${8 + flueP * 66}%`,
                  background: `linear-gradient(180deg, #010305 0%, ${rgba('#0A0F13', 0.98)} 64%, ${rgba('#141A1E', 0.7)} 100%)`,
                  boxShadow: `0 10px 22px ${rgba('#000000', 0.9)}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${8 + flueP * 66}%`,
                  height: 3,
                  background: rgba(BAS.no, 0.5 + flueP * 0.4),
                  boxShadow: `0 0 14px ${rgba(BAS.no, 0.8)}`,
                }}
              />
            </div>
            <div style={{position: 'absolute', left: -14, top: PH * 0.42, transform: 'rotate(-90deg)', transformOrigin: '100% 50%'}}>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 6,
                  color: rgba('#E4EBEE', 0.62 + flueP * 0.3),
                  textShadow: `0 2px 10px ${rgba('#000000', 0.95)}`,
                  whiteSpace: 'nowrap',
                }}
              >
                TIRAJE
              </span>
            </div>
          </div>
        </Layer>

        {/* GOLPE: reventón de hollín que salta del hogar sucio (sin anillos de plantilla) */}
        <Layer z={70} style={{opacity: interpolate(shock, [0, 0.25, 1], [0, 1, 0], CL), transform: `translateZ(70px) scale(${1 - 70 / PERSP})`}}>
          <div
            style={{
              position: 'absolute',
              left: RX - 40,
              top: PTOP - 30,
              width: PW + 80,
              height: PH + 60,
              borderRadius: 34,
              background: `radial-gradient(58% 62% at 50% 50%, ${rgba('#0A0F13', 0.55)}, transparent 74%)`,
            }}
          />
          {Array.from({length: 18}).map((_, i) => {
            const ang = (i / 18) * Math.PI * 2 + 0.3;
            const d = 60 + shock * (330 + (i % 5) * 46);
            const sz = 5 + (i % 5) * 3;
            return (
              <div
                key={`bu${i}`}
                style={{
                  position: 'absolute',
                  left: RX + PW / 2 + Math.cos(ang) * d * 1.25,
                  top: PTOP + PH / 2 + Math.sin(ang) * d * 0.72,
                  width: sz,
                  height: sz,
                  borderRadius: '50%',
                  background: rgba(ASH, 0.42),
                  opacity: 1 - shock,
                }}
              />
            );
          })}
        </Layer>

        {/* lluvia de ceniza del lado sucio (muchas motas grises cayendo) */}
        <Layer z={86} style={{opacity: Math.min(1, rightP), transform: `translateZ(86px) scale(${1 - 86 / PERSP})`}}>
          {Array.from({length: 38}).map((_, i) => {
            const s = (i * 47.9) % 100;
            const life = ((t * (5 + (s % 5)) + s * 2.1) % 100) / 100;
            const sz = 2 + (s % 4);
            return (
              <div
                key={`as${i}`}
                style={{
                  position: 'absolute',
                  left: RX + 30 + ((s * 7.9) % (PW - 60)) + Math.sin(life * 3.4 + s) * 20,
                  top: PTOP - 26 + life * (PH + 62),
                  width: sz,
                  height: sz,
                  borderRadius: '50%',
                  background: rgba(ASH, 0.5),
                  opacity: Math.sin(life * Math.PI) * (0.35 + (s % 30) / 90),
                }}
              />
            );
          })}
        </Layer>

        {/* ===== PLANO +96 · RÓTULOS (cascada) ===== */}
        <Layer z={96} style={{transform: `translateZ(96px) scale(${1 - 96 / PERSP})`}}>
          <Plinth x={LX} accent={BAS.si} ink={BAS.onSi} mark="✓" label={leftLabel} sub={leftSub} p={lLabP} ps={lSubP} />
          <Plinth x={RX} accent={BAS.no} ink={BAS.onNo} mark="✕" label={rightLabel} sub={rightSub} p={rLabP} ps={rSubP} />
        </Layer>

        {/* ===== PLANO +118 · TÍTULO ===== */}
        <Layer z={118} style={{transform: `translateZ(118px) scale(${1 - 118 / PERSP})`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 74, textAlign: 'center', opacity: titleP}}>
            <div style={{position: 'absolute', left: '50%', top: -36, width: 1240, height: 214, marginLeft: -620, background: `radial-gradient(58% 62% at 50% 50%, ${rgba('#020609', 0.86)}, transparent 74%)`}} />
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16}}>
              <div style={{width: 70, height: 1, background: `linear-gradient(90deg, transparent, ${rgba(BAS.aqua, 0.65)})`}} />
              <span style={{fontFamily: FONT_SANS, fontSize: 21, fontWeight: 800, letterSpacing: 9, color: BAS.aquaLite, textShadow: `0 0 22px ${rgba(BAS.aqua, 0.6)}`}}>LA PROTEÍNA ES LA LEÑA</span>
              <div style={{width: 70, height: 1, background: `linear-gradient(270deg, transparent, ${rgba(BAS.aqua, 0.65)})`}} />
            </div>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                clipPath: `inset(0 ${(1 - titleWipe) * 100}% 0 0)`,
                transform: `translateY(${interpolate(titleP, [0, 1], [18, 0])}px)`,
              }}
            >
              <span style={{fontFamily: FONT_DISPLAY, fontSize: 66, fontWeight: 700, letterSpacing: 0.5, color: '#EEF6F9', textShadow: `0 4px 26px ${rgba('#000000', 0.92)}`}}>{tHead} </span>
              {tTail ? (
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 66,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    color: BAS.amber,
                    // el ámbar respira en el hold (brasa que late, nunca congelado)
                    textShadow: `0 4px 26px ${rgba('#000000', 0.92)}, 0 0 ${34 + Math.sin(t * 1.45) * 14}px ${rgba(BAS.amber, 0.34 + Math.sin(t * 1.45) * 0.12)}`,
                  }}
                >
                  {tTail}
                </span>
              ) : null}
            </div>
          </div>
        </Layer>

        {/* ===== PLANO +150 · CENIZA EN PRIMER PLANO (fuera de foco) ===== */}
        <Layer z={150} style={{opacity: interpolate(frame, [100, 150], [0, 1], CL), transform: `translateZ(150px) scale(${1 - 150 / PERSP})`}}>
          {Array.from({length: 12}).map((_, i) => {
            const s = (i * 83.3) % 100;
            const life = ((t * (3.4 + (s % 3)) + s * 1.7) % 100) / 100;
            const sz = 6 + (s % 6);
            return (
              <div
                key={`fg${i}`}
                style={{
                  position: 'absolute',
                  left: (s * 19.2) % 1920,
                  top: -60 + life * 1220,
                  width: sz,
                  height: sz,
                  borderRadius: '50%',
                  background: rgba(s % 3 === 0 ? WARM : ASH, 0.3),
                  opacity: Math.sin(life * Math.PI) * 0.5,
                  filter: 'blur(2.4px)',
                }}
              />
            );
          })}
        </Layer>
      </AbsoluteFill>

      {/* atmósfera final: golpe de viñeta en el impacto + grano */}
      <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(120% 112% at 50% 48%, transparent ${54 - hit * 12}%, ${rgba('#01060A', 0.68 + hit * 0.16)} 100%)`}} />
      <CoolVignette strength={0.34} />
      <GrainOverlay opacity={0.055} />
    </AbsoluteFill>
  );
};
