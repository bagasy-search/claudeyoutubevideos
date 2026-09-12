/**
 * ChapterAguaLimon — REFERENCIA DE CALIDAD (nuevo estándar): microescena 2.5D dirigida.
 * Vidrio negro ahumado biselado + número "1" escultórico en acrílico + gotas macro sobre el cristal
 * + rodaja de limón translúcida asomando detrás + iluminación de producto + cáustica cálida.
 * Cámara: arranca ~7° a un costado y ~4° arriba, dolly-in + micro-órbita a casi frontal con
 * PARALLAX REAL (perspective + translateZ por capa), focus-pull, y hold con micro-movimiento vivo.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS} from './theme';

const easeOut = Easing.out(Easing.cubic);
const easeIO = Easing.bezier(0.4, 0, 0.2, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Drop: React.FC<{x: number; y: number; r: number; long?: number; warm?: boolean; slide?: number}> = ({x, y, r, long = 1, warm = false, slide = 0}) => {
  const hi = warm ? '#FFF6DF' : '#EAF7FF';
  const tint = warm ? 'rgba(210,180,90,0.20)' : 'rgba(150,200,230,0.18)';
  return (
    <div style={{position: 'absolute', left: x, top: y + slide, width: r * 2, height: r * 2 * long, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%', boxShadow: `0 ${r * 0.5}px ${r * 0.9}px rgba(0,0,0,0.5)`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%', background: `radial-gradient(60% 55% at 42% 38%, rgba(255,255,255,0.12), ${tint} 55%, rgba(0,0,0,0.30) 100%)`, border: '1px solid rgba(255,255,255,0.12)'}} />
      <div style={{position: 'absolute', left: r * 0.5, top: r * 0.4, width: r * 0.5, height: r * 0.4, borderRadius: '50%', background: `radial-gradient(circle, ${hi}, transparent 70%)`, opacity: 0.95}} />
    </div>
  );
};

export const ChapterAguaLimon: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // cámara
  const camP = interpolate(frame, [0, 55], [0, 1], {...clamp, easing: easeIO});
  const ry = interpolate(camP, [0, 1], [-7, -1.5]) + Math.sin(frame / fps * 0.5) * 0.3;
  const rx = interpolate(camP, [0, 1], [-4, -1]);
  const dolly = interpolate(camP, [0, 1], [0.965, 1.02]) + interpolate(frame, [55, 95], [0, 0.004], clamp);
  const panX = interpolate(camP, [0, 1], [16, 0]) + Math.sin(frame / fps * 0.4) * 2.2;

  // secuencia
  const lightLine = interpolate(frame, [0, 34], [-30, 130], clamp);
  const plateIn = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeOut});
  const numP = interpolate(frame, [8, 24], [0, 1], {...clamp, easing: easeOut});
  const aguaWipe = interpolate(frame, [17, 35], [0, 1], {...clamp, easing: easeOut});
  const aguaBlur = interpolate(frame, [17, 34], [7, 0], clamp);
  const plusP = interpolate(frame, [30, 40], [0, 1], {...clamp, easing: easeOut});
  const plusPulse = interpolate(frame, [36, 42, 50], [0, 1, 0], clamp);
  const limonP = interpolate(frame, [35, 55], [0, 1], {...clamp, easing: easeOut});
  const subP = interpolate(frame, [50, 66], [0, 1], {...clamp, easing: easeOut});
  const dropSlide = interpolate(frame, [60, 95], [0, 24], {...clamp, easing: Easing.in(Easing.quad)});
  const sweep = ((frame % 130) / 130) * 150 - 25;

  const cx = width / 2;
  const cy = height * 0.5;
  const PW = 1360;
  const PH = 470;
  const L = -PW / 2;

  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
  );

  return (
    <AbsoluteFill style={{background: 'radial-gradient(80% 90% at 50% 42%, #0C1B27 0%, #071019 55%, #03080C 100%)', perspective: 1500, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(38% 46% at 50% 40%, rgba(52,198,224,0.13) 0%, transparent 70%)'}} />
      {Array.from({length: 14}).map((_, i) => {
        const s = (i * 61.3) % 100;
        const dz = ((frame / fps) * (4 + (s % 4)) + s * 3) % 130 - 15;
        return <div key={`p${i}`} style={{position: 'absolute', left: `${s}%`, top: `${(100 + dz) % 115 - 8}%`, width: 2 + (s % 3), height: 2 + (s % 3), borderRadius: '50%', background: 'rgba(180,220,235,0.5)', opacity: 0.22 + (s % 30) / 130, filter: 'blur(0.5px)'}} />;
      })}

      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateX(${panX}px) scale(${dolly})`, transformOrigin: '50% 50%'}}>

        {/* cáustica/halo cálido detrás del vaso (lado LIMÓN) */}
        <Layer z={-14} style={{opacity: limonP * 0.8}}>
          <div style={{position: 'absolute', left: 300, top: -300, width: 520, height: 460, background: 'radial-gradient(closest-side, rgba(240,210,120,0.30), transparent 72%)', filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        </Layer>

        {/* ===== PLACA DE VIDRIO NEGRO AHUMADO ===== */}
        <Layer z={0} style={{opacity: plateIn}}>
          <div style={{position: 'absolute', left: L + 8, top: -PH / 2 + 14, width: PW, height: PH, borderRadius: 30, background: '#02060A', filter: 'blur(1px)'}} />
          <div style={{position: 'absolute', left: L, top: -PH / 2, width: PW, height: PH, borderRadius: 28,
            background: 'linear-gradient(150deg, rgba(16,22,28,0.84) 0%, rgba(7,11,15,0.92) 55%, rgba(3,6,9,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.16), inset 0 -3px 8px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.5), 0 70px 130px rgba(0,0,0,0.62), 0 12px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", backgroundSize: '140px 140px'}} />
            {/* condensación fría lado AGUA */}
            <div style={{position: 'absolute', left: 0, top: 0, width: '42%', height: '100%', background: 'radial-gradient(70% 60% at 24% 42%, rgba(200,230,245,0.06), transparent 70%)'}} />
          </div>
          {/* línea de luz que recorre el borde superior */}
          <div style={{position: 'absolute', left: L, top: -PH / 2, width: PW, height: 3, borderRadius: 3, overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, left: `${lightLine}%`, width: '38%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(200,240,255,0.95), transparent)', filter: 'blur(1px)'}} />
          </div>
        </Layer>

        {/* ===== TÍTULO (izq-anclado, después del número) ===== */}
        <Layer z={12}>
          <div style={{position: 'absolute', left: L + 250, top: -74, filter: `blur(${aguaBlur}px)`, display: 'flex', alignItems: 'baseline', gap: 22, whiteSpace: 'nowrap'}}>
            <div style={{position: 'relative', clipPath: `inset(0 ${(1 - aguaWipe) * 100}% 0 0)`}}>
              <span style={{fontFamily: FONT_DISPLAY, fontSize: 106, fontWeight: 700, letterSpacing: 1, color: '#EAF3F7', textShadow: '0 2px 20px rgba(0,0,0,0.6)'}}>AGUA</span>
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 12}%, rgba(255,255,255,0.5) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: 'overlay'}} />
            </div>
            <span style={{fontFamily: FONT_SANS, fontSize: 80, fontWeight: 300, color: '#CFE9F2', opacity: plusP, transform: `scale(${1 + plusPulse * 0.14})`, textShadow: `0 0 ${8 + plusPulse * 24}px rgba(120,220,240,${0.5 + plusPulse * 0.5})`, display: 'inline-block'}}>+</span>
            <span style={{fontFamily: FONT_DISPLAY, fontSize: 106, fontWeight: 700, letterSpacing: 1, color: '#F1ECDC', opacity: limonP, transform: `translateX(${interpolate(limonP, [0, 1], [36, 0])}px)`, textShadow: '0 2px 22px rgba(60,40,0,0.5), 0 0 34px rgba(230,200,110,0.20)'}}>LIMÓN</span>
          </div>
          {/* reflejo tenue del título, corto y sutil, justo debajo */}
          <div style={{position: 'absolute', left: L + 250, top: 44, transform: 'scaleY(-1)', opacity: 0.08, filter: 'blur(1px)', maskImage: 'linear-gradient(transparent 30%, black)', WebkitMaskImage: 'linear-gradient(transparent 30%, black)', display: 'flex', gap: 22}}>
            <span style={{fontFamily: FONT_DISPLAY, fontSize: 106, fontWeight: 700, color: '#EAF3F7'}}>AGUA</span>
          </div>
        </Layer>

        {/* gotas macro (lado AGUA) */}
        <Layer z={34} style={{opacity: aguaWipe}}>
          <Drop x={L + 210} y={-40} r={22} />
          <Drop x={L + 330} y={64} r={14} long={1.4} slide={dropSlide} />
          <Drop x={L + 180} y={80} r={10} />
          <Drop x={L + 420} y={-92} r={8} />
        </Layer>
        {/* microgotas cítricas (lado LIMÓN) */}
        <Layer z={34} style={{opacity: limonP}}>
          <Drop x={330} y={70} r={11} warm />
          <Drop x={440} y={-30} r={7} warm />
        </Layer>

        {/* ===== NÚMERO "1" acrílico (hero, izquierda, adelante) ===== */}
        <Layer z={64} style={{opacity: numP}}>
          <div style={{position: 'absolute', left: L + 40, top: -175, transform: `translateY(${interpolate(numP, [0, 1], [70, 0])}px) scale(${interpolate(numP, [0, 1], [0.92, 1])})`}}>
            <div style={{position: 'absolute', inset: -10, filter: 'blur(22px)', opacity: 0.5}}>
              <span style={{fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, color: BAS.aqua}}>1</span>
            </div>
            {Array.from({length: 6}).map((_, i) => (
              <span key={i} style={{position: 'absolute', left: -i * 1.6, top: i * 1.6, fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, color: `rgba(10,80,95,${0.6 - i * 0.08})`}}>1</span>
            ))}
            <span style={{position: 'relative', fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, backgroundImage: 'linear-gradient(150deg, #9BE9F5 0%, #35C6E0 45%, #1892AB 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>1</span>
            <span style={{position: 'absolute', left: 0, top: 0, fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, backgroundImage: 'linear-gradient(100deg, transparent 44%, rgba(255,255,255,0.85) 50%, transparent 56%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>1</span>
          </div>
        </Layer>

        {/* ===== SUBTÍTULO grabado (una línea, debajo del título) ===== */}
        <Layer z={10} style={{opacity: subP}}>
          <div style={{position: 'absolute', left: L + 254, top: 66, transform: `translateY(${interpolate(subP, [0, 1], [10, 0])}px)`, whiteSpace: 'nowrap'}}>
            <span style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 500, letterSpacing: 5, color: 'rgba(220,235,240,0.55)', textShadow: '0 1px 0 rgba(255,255,255,0.08), 0 -1px 0 rgba(0,0,0,0.6)'}}>EN AYUNAS, APENAS SE LEVANTA</span>
          </div>
        </Layer>

        {/* VASO DE AGUA CON LIMÓN — ilustración real (objeto protagonista), flota arriba-derecha */}
        <Layer z={96} style={{opacity: limonP}}>
          <div style={{position: 'absolute', left: 430, top: -360, width: 400, height: 400,
            transform: `translateY(${interpolate(limonP, [0, 1], [50, 0]) + Math.sin(frame / fps * 1.3) * 7}px) rotate(${Math.sin(frame / fps * 0.9) * 1.6}deg) scale(${interpolate(limonP, [0, 1], [0.86, 1])})`,
            filter: 'drop-shadow(0 34px 46px rgba(0,0,0,0.55))'}}>
            <Img src={staticFile('img/ill/bas_ill_lemon_water.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
        </Layer>

        {/* highlight frontal móvil (reflejo del cristal) — sutil */}
        <Layer z={82}>
          <div style={{position: 'absolute', left: L, top: -PH / 2, width: PW, height: PH, borderRadius: 28, background: `linear-gradient(112deg, transparent ${sweep - 6}%, rgba(255,255,255,0.04) ${sweep}%, transparent ${sweep + 6}%)`, pointerEvents: 'none'}} />
        </Layer>
      </AbsoluteFill>

      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 50% 46%, transparent 54%, rgba(2,7,11,0.62) 100%)'}} />
    </AbsoluteFill>
  );
};
