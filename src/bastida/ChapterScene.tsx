/**
 * ChapterScene — motor generalizado de CHAPTER como microescena 2.5D dirigida (estándar).
 * Comparte primitivas con ChapterAguaLimon (vidrio negro ahumado + número acrílico + cámara con
 * parallax real perspective+translateZ + focus-pull), pero CADA variante tiene su propia
 * metáfora/material/ilustración/color y su FLOURISH (grains / steam / petals / droplets).
 * No es "el mismo template con texto cambiado": cambia acento, lado del hero, sistema de partículas,
 * tinte del ambiente y la acción semántica.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BAS, FONT_DISPLAY, FONT_SANS, rgba, shade} from './theme';

const easeOut = Easing.out(Easing.cubic);
const easeIO = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Flourish = 'grains' | 'steam' | 'petals' | 'droplets';
export type ChapterSceneProps = {
  number?: string;
  unit?: string;
  subtitle?: string;
  hero?: string; // ilustración PNG (public path)
  heroSide?: 'left' | 'right';
  accent?: string; // color de acento (número, kicker)
  accentDeep?: string;
  ambient?: string; // tinte del halo ambiental
  flourish?: Flourish;
};

/* --------- flourish: sistemas de partículas deterministas por metáfora --------- */
const Flourishes: React.FC<{kind: Flourish; frame: number; fps: number; p: number; accent: string}> = ({kind, frame, fps, p, accent}) => {
  const t = frame / fps;
  if (kind === 'grains') {
    return (
      <>
        {Array.from({length: 16}).map((_, i) => {
          const s = (i * 53.7) % 100;
          const x = 8 + (s / 100) * 84;
          const fall = ((t * (18 + (s % 7)) + s * 4) % 130) - 12;
          const rot = (s * 7 + t * 40) % 360;
          return <div key={i} style={{position: 'absolute', left: `${x}%`, top: `${fall}%`, width: 7, height: 16, borderRadius: '50%', background: `linear-gradient(${rot}deg, #E9CE86, #B98F45)`, transform: `rotate(${rot}deg)`, opacity: 0.5 * p, boxShadow: '0 2px 4px rgba(0,0,0,0.4)'}} />;
        })}
      </>
    );
  }
  if (kind === 'steam') {
    return (
      <>
        {Array.from({length: 7}).map((_, i) => {
          const s = (i * 61) % 100;
          const x = 30 + (s / 100) * 40;
          const rise = 100 - ((t * (10 + (s % 5)) + s * 6) % 120);
          const sway = Math.sin(t * 1.2 + i) * 20;
          return <div key={i} style={{position: 'absolute', left: `calc(${x}% + ${sway}px)`, top: `${rise}%`, width: 40 + (s % 30), height: 120, borderRadius: '50%', background: `radial-gradient(closest-side, ${rgba(accent, 0.14)}, transparent 70%)`, filter: 'blur(14px)', opacity: 0.7 * p}} />;
        })}
      </>
    );
  }
  if (kind === 'petals') {
    return (
      <>
        {Array.from({length: 12}).map((_, i) => {
          const s = (i * 47.3) % 100;
          const x = 6 + (s / 100) * 88;
          const fall = ((t * (12 + (s % 6)) + s * 5) % 130) - 12;
          const rot = (s * 11 + t * 60) % 360;
          const sway = Math.sin(t * 1.4 + i) * 14;
          return <div key={i} style={{position: 'absolute', left: `calc(${x}% + ${sway}px)`, top: `${fall}%`, width: 16, height: 24, borderRadius: '80% 80% 60% 60% / 90% 90% 40% 40%', background: `linear-gradient(${rot}deg, ${shade(accent, 0.3)}, ${shade(accent, -0.2)})`, transform: `rotate(${rot}deg)`, opacity: 0.55 * p, boxShadow: '0 3px 6px rgba(0,0,0,0.35)'}} />;
        })}
      </>
    );
  }
  // droplets
  return (
    <>
      {Array.from({length: 10}).map((_, i) => {
        const s = (i * 71.1) % 100;
        const x = 8 + (s / 100) * 84;
        const y = 12 + (s * 1.6) % 78;
        const r = 5 + (s % 8);
        const long = s % 3 === 0 ? 1.5 : 1;
        const slide = long > 1 ? ((t * 12 + s) % 30) : 0;
        return (
          <div key={i} style={{position: 'absolute', left: `${x}%`, top: `calc(${y}% + ${slide}px)`, width: r * 2, height: r * 2 * long, borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%', background: `radial-gradient(60% 55% at 42% 38%, rgba(255,255,255,0.12), ${rgba(accent, 0.18)} 55%, rgba(0,0,0,0.28) 100%)`, border: `1px solid ${rgba('#ffffff', 0.12)}`, opacity: 0.6 * p, boxShadow: `0 ${r * 0.4}px ${r}px rgba(0,0,0,0.45)`}}>
            <div style={{position: 'absolute', left: r * 0.5, top: r * 0.4, width: r * 0.5, height: r * 0.4, borderRadius: '50%', background: 'radial-gradient(circle, #EAF7FF, transparent 70%)'}} />
          </div>
        );
      })}
    </>
  );
};

export const ChapterScene: React.FC<ChapterSceneProps> = ({
  number = '2',
  unit = 'CEBADA',
  subtitle = 'el agua noble de la abuela',
  hero = 'img/ill/bas_ill_barley.png',
  heroSide = 'right',
  accent = '#D9B36A',
  accentDeep = '#8A6636',
  ambient = 'rgba(217,179,106,0.14)',
  flourish = 'grains',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // cámara
  const camP = interpolate(frame, [0, 55], [0, 1], {...clamp, easing: easeIO});
  const dir = heroSide === 'right' ? 1 : -1;
  const ry = interpolate(camP, [0, 1], [7 * dir, 1.5 * dir]) + Math.sin(frame / fps * 0.5) * 0.3;
  const rx = interpolate(camP, [0, 1], [-4, -1]);
  const dolly = interpolate(camP, [0, 1], [0.965, 1.02]) + interpolate(frame, [55, 95], [0, 0.004], clamp);
  const panX = interpolate(camP, [0, 1], [-14 * dir, 0]) + Math.sin(frame / fps * 0.4) * 2.2;

  // secuencia
  const lightLine = interpolate(frame, [0, 34], [-30, 130], clamp);
  const plateIn = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: easeOut});
  const numP = interpolate(frame, [8, 24], [0, 1], {...clamp, easing: easeOut});
  const unitWipe = interpolate(frame, [17, 35], [0, 1], {...clamp, easing: easeOut});
  const unitBlur = interpolate(frame, [17, 34], [7, 0], clamp);
  const heroP = interpolate(frame, [26, 50], [0, 1], {...clamp, easing: easeIO});
  const subP = interpolate(frame, [50, 66], [0, 1], {...clamp, easing: easeOut});
  const flourP = interpolate(frame, [20, 45], [0, 1], clamp);
  const sweep = ((frame % 130) / 130) * 150 - 25;

  const cx = width / 2, cy = height * 0.5;
  const PW = 1360, PH = 470, L = -PW / 2;
  const Layer: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
    <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</div>
  );

  // el número/título van del lado OPUESTO al hero (hero arriba en su esquina)
  const heroLeftPx = heroSide === 'right' ? 430 : -830;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(80% 90% at 50% 42%, #0C1B27 0%, #071019 55%, #03080C 100%)', perspective: 1500, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(40% 48% at 50% 40%, ${ambient} 0%, transparent 70%)`}} />
      {/* flourish atmosférico detrás */}
      <AbsoluteFill style={{opacity: 0.5}}><Flourishes kind={flourish} frame={frame} fps={fps} p={flourP} accent={accent} /></AbsoluteFill>

      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateX(${panX}px) scale(${dolly})`, transformOrigin: '50% 50%'}}>
        {/* halo cálido detrás del hero */}
        <Layer z={-14} style={{opacity: heroP * 0.8}}>
          <div style={{position: 'absolute', left: heroLeftPx - 40, top: -320, width: 520, height: 460, background: `radial-gradient(closest-side, ${rgba(accent, 0.28)}, transparent 72%)`, filter: 'blur(30px)', mixBlendMode: 'screen'}} />
        </Layer>

        {/* PLACA DE VIDRIO */}
        <Layer z={0} style={{opacity: plateIn}}>
          <div style={{position: 'absolute', left: L + 8, top: -PH / 2 + 14, width: PW, height: PH, borderRadius: 30, background: '#02060A', filter: 'blur(1px)'}} />
          <div style={{position: 'absolute', left: L, top: -PH / 2, width: PW, height: PH, borderRadius: 28,
            background: 'linear-gradient(150deg, rgba(16,22,28,0.84) 0%, rgba(7,11,15,0.92) 55%, rgba(3,6,9,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.16), inset 0 -3px 8px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.5), 0 70px 130px rgba(0,0,0,0.62), 0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", backgroundSize: '140px 140px'}} />
          </div>
          <div style={{position: 'absolute', left: L, top: -PH / 2, width: PW, height: 3, borderRadius: 3, overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, left: `${lightLine}%`, width: '38%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(200,240,255,0.95), transparent)', filter: 'blur(1px)'}} />
          </div>
        </Layer>

        {/* TÍTULO */}
        <Layer z={12}>
          <div style={{position: 'absolute', left: L + 250, top: -74, filter: `blur(${unitBlur}px)`, display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap'}}>
            <div style={{position: 'relative', clipPath: `inset(0 ${(1 - unitWipe) * 100}% 0 0)`}}>
              <span style={{fontFamily: FONT_DISPLAY, fontSize: 106, fontWeight: 700, letterSpacing: 1, color: '#EEF3F6', textShadow: '0 2px 20px rgba(0,0,0,0.6)'}}>{unit}</span>
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 12}%, rgba(255,255,255,0.5) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: 'overlay'}} />
            </div>
          </div>
        </Layer>

        {/* NÚMERO acrílico (color de acento) */}
        <Layer z={64} style={{opacity: numP}}>
          <div style={{position: 'absolute', left: L + 40, top: -175, transform: `translateY(${interpolate(numP, [0, 1], [70, 0])}px) scale(${interpolate(numP, [0, 1], [0.92, 1])})`}}>
            <div style={{position: 'absolute', inset: -10, filter: 'blur(22px)', opacity: 0.5}}><span style={{fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, color: accent}}>{number}</span></div>
            {Array.from({length: 6}).map((_, i) => (
              <span key={i} style={{position: 'absolute', left: -i * 1.6, top: i * 1.6, fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, color: rgba(accentDeep, 0.6 - i * 0.08)}}>{number}</span>
            ))}
            <span style={{position: 'relative', fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, backgroundImage: `linear-gradient(150deg, ${shade(accent, 0.35)} 0%, ${accent} 45%, ${accentDeep} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{number}</span>
            <span style={{position: 'absolute', left: 0, top: 0, fontFamily: FONT_DISPLAY, fontSize: 300, fontWeight: 800, backgroundImage: 'linear-gradient(100deg, transparent 44%, rgba(255,255,255,0.85) 50%, transparent 56%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{number}</span>
          </div>
        </Layer>

        {/* SUBTÍTULO grabado */}
        <Layer z={10} style={{opacity: subP}}>
          <div style={{position: 'absolute', left: L + 254, top: 66, transform: `translateY(${interpolate(subP, [0, 1], [10, 0])}px)`, whiteSpace: 'nowrap'}}>
            <span style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 500, letterSpacing: 5, color: 'rgba(220,235,240,0.55)', textShadow: '0 1px 0 rgba(255,255,255,0.08), 0 -1px 0 rgba(0,0,0,0.6)'}}>{subtitle.toUpperCase()}</span>
          </div>
        </Layer>

        {/* HERO ilustración (objeto protagonista, flota en su esquina) */}
        <Layer z={96} style={{opacity: heroP}}>
          <div style={{position: 'absolute', left: heroLeftPx, top: -360, width: 400, height: 400,
            transform: `translateY(${interpolate(heroP, [0, 1], [50, 0]) + Math.sin(frame / fps * 1.3) * 7}px) rotate(${Math.sin(frame / fps * 0.9) * 1.6}deg) scale(${interpolate(heroP, [0, 1], [0.86, 1])})`,
            filter: 'drop-shadow(0 34px 46px rgba(0,0,0,0.55))'}}>
            <Img src={staticFile(hero)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
        </Layer>

        {/* barrido especular frontal */}
        <Layer z={82}>
          <div style={{position: 'absolute', left: L, top: -PH / 2, width: PW, height: PH, borderRadius: 28, background: `linear-gradient(112deg, transparent ${sweep - 6}%, rgba(255,255,255,0.04) ${sweep}%, transparent ${sweep + 6}%)`, pointerEvents: 'none'}} />
        </Layer>
      </AbsoluteFill>

      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 50% 46%, transparent 54%, rgba(2,7,11,0.62) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ---- configs de las 4 chapters restantes (cada una su metáfora/material/color) ---- */
export const CHAPTER_CONFIGS: Record<string, ChapterSceneProps> = {
  cebada: {number: '2', unit: 'CEBADA', subtitle: 'el agua noble de la abuela', hero: 'img/ill/bas_ill_barley.png', heroSide: 'right', accent: '#E0C070', accentDeep: '#8A6636', ambient: 'rgba(220,180,110,0.14)', flourish: 'grains'},
  jengibre: {number: '3', unit: 'JENGIBRE', subtitle: 'antiinflamatorio natural', hero: 'img/ill/bas_ill_ginger.png', heroSide: 'left', accent: '#F0A23C', accentDeep: '#A85D14', ambient: 'rgba(240,150,60,0.14)', flourish: 'steam'},
  hibisco: {number: '4', unit: 'HIBISCO', subtitle: 'la flor que baja la presión', hero: 'img/ill/bas_ill_hibiscus.png', heroSide: 'right', accent: '#E0577F', accentDeep: '#7A1E3E', ambient: 'rgba(220,70,110,0.13)', flourish: 'petals'},
  agua: {number: '5', unit: 'AGUA', subtitle: 'la más simple y la más poderosa', hero: 'img/ill/bas_ill_water_drop.png', heroSide: 'left', accent: '#34C6E0', accentDeep: '#0E7F97', ambient: 'rgba(52,198,224,0.14)', flourish: 'droplets'},
  teverde: {number: '6', unit: 'TÉ VERDE', subtitle: 'antioxidantes para sus vasos', hero: 'img/ill/bas_ill_greentea.png', heroSide: 'right', accent: '#7FB88A', accentDeep: '#2E6B43', ambient: 'rgba(110,185,130,0.14)', flourish: 'steam'},
  arandano: {number: '7', unit: 'ARÁNDANO ROJO', subtitle: 'protege sus vías urinarias', hero: 'img/ill/bas_ill_cranberry.png', heroSide: 'left', accent: '#E0576A', accentDeep: '#7A1E2E', ambient: 'rgba(220,70,90,0.14)', flourish: 'droplets'},
  // --- VIDEO #2: "la mejor fruta antes de dormir" (arándanos azules = blueberries) ---
  arandanos: {number: '1', unit: 'ARÁNDANOS', subtitle: 'la mejor fruta antes de dormir', hero: 'img/ill/bas_ill_blueberries.png', heroSide: 'right', accent: '#6E7BD6', accentDeep: '#2E3A7A', ambient: 'rgba(110,123,214,0.14)', flourish: 'droplets'},
  // --- VIDEO #4: "3 frutas que puede comer sin riesgo" (openers SÍ; NO=traidoras van con AlertSignals/rojo) ---
  manzana: {number: '1', unit: 'MANZANA', subtitle: 'baja en potasio · fibra pectina', hero: 'img/ill/bas4_ill_manzana.png', heroSide: 'right', accent: '#3FA96B', accentDeep: '#1E6B43', ambient: 'rgba(63,169,107,0.14)', flourish: 'droplets'},
  frutillas: {number: '2', unit: 'FRUTILLAS', subtitle: 'antioxidantes · frenan el óxido', hero: 'img/ill/bas4_ill_frutillas.png', heroSide: 'left', accent: '#E0577F', accentDeep: '#7A1E3E', ambient: 'rgba(224,87,127,0.13)', flourish: 'petals'},
  pina: {number: '3', unit: 'PIÑA', subtitle: 'bromelina · desinflama', hero: 'img/ill/bas4_ill_pina.png', heroSide: 'right', accent: '#E0C070', accentDeep: '#8A6636', ambient: 'rgba(224,192,112,0.14)', flourish: 'droplets'},
  // --- VIDEO #5: "Top 3 Leches para bajar la creatinina" (openers de las 3 SÍ; NO=vaca/condensada/soja van con FoodVerdict rojo) ---
  almendras: {number: '1', unit: 'ALMENDRAS', subtitle: 'sin endulzar · casi sin proteína', hero: 'img/bas5_ill_almendras.png', heroSide: 'right', accent: '#3FA96B', accentDeep: '#1E6B43', ambient: 'rgba(63,169,107,0.14)', flourish: 'grains'},
  arroz: {number: '2', unit: 'ARROZ', subtitle: 'la más baja en fósforo y potasio', hero: 'img/bas5_ill_arroz.png', heroSide: 'left', accent: '#34C6E0', accentDeep: '#0E7F97', ambient: 'rgba(52,198,224,0.14)', flourish: 'grains'},
  avena: {number: '3', unit: 'AVENA', subtitle: 'cremosa · beta-glucano', hero: 'img/bas5_ill_avena.png', heroSide: 'right', accent: '#C9A56A', accentDeep: '#7A5A2E', ambient: 'rgba(201,165,106,0.14)', flourish: 'steam'},
};
