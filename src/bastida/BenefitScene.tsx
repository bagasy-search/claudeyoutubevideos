/**
 * BenefitScene — micro-escena 2.5D cinematográfica para un beneficio ("sin farmacia", "sin gastar…").
 * NO es un pill con texto NI dibujitos vectoriales: son TARJETAS DE VIDRIO con IMÁGENES REALES
 * (foto), en planos de profundidad, con cámara viva (push-in + drift + parallax + impact-shake),
 * entradas en cascada, y el SLASH rojo con OCLUSIÓN real (por detrás de la tarjeta hero y por
 * delante de otra). Narrativa: presentación → tensión → resolución. El tachado tacha el CONCEPTO
 * negativo (FARMACIA / UNA FORTUNA), y "SIN" valida al final.
 * Variantes: 'farmacia' | 'fortuna'. Imágenes en public/img/ (generadas con Modal).
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
import {BAS, FONT_DISPLAY, FONT_SANS, rgba} from './theme';

const easeOut = Easing.out(Easing.cubic);
const springAt = (frame: number, fps: number, delay: number, damping = 130, mass = 0.85) =>
  spring({frame: frame - delay, fps, config: {damping, mass}});

const VARIANTS = {
  farmacia: {big: 'FARMACIA', small: 'SIN', hero: 'bas_pharmacy', secL: 'bas_pills', secR: 'bas_pillbottle'},
  fortuna: {big: 'UNA FORTUNA', small: 'SIN GASTAR', hero: 'bas_money_cash', secL: 'bas_coins', secR: 'bas_receipts'},
} as const;

const ImgCard: React.FC<{img: string; w: number; h: number; blur?: number; label?: string; dim?: number}> = ({img, w, h, blur = 0, label, dim = 0}) => (
  <div style={{width: w, height: h, borderRadius: 26, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.65)', boxShadow: `0 44px 90px ${rgba('#040f16', 0.55)}, 0 10px 26px ${rgba('#040f16', 0.4)}`, filter: blur ? `blur(${blur}px)` : undefined}}>
    <Img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: dim ? `saturate(${1 - dim * 0.5}) brightness(${1 - dim * 0.25})` : undefined}} />
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${rgba('#ffffff', 0.16)}, transparent 40%)`}} />
    {label && (
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '40px 20px 18px', background: `linear-gradient(transparent, ${rgba('#05161f', 0.78)})`}}>
        <div style={{fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800, letterSpacing: 3, color: '#fff', textAlign: 'center'}}>{label}</div>
      </div>
    )}
  </div>
);

export type BenefitSceneProps = {variant?: 'farmacia' | 'fortuna'};

export const BenefitScene: React.FC<BenefitSceneProps> = ({variant = 'farmacia'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const V = VARIANTS[variant];
  const T = {sec: 6, hero: 12, text: 18, slash: 30, sin: 38};

  // cámara viva
  const push = interpolate(frame, [0, 36], [1, 1.055], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const drift = Math.sin((frame / fps) * 0.5) * 7;
  const st = frame - T.slash;
  const shake = st >= 0 && st < 7 ? Math.sin(st * 2.3) * 3 * (1 - st / 7) : 0;
  const punch = st >= 0 && st < 6 ? Math.sin((st / 6) * Math.PI) * 0.014 : 0;
  const camX = drift + shake;
  const camScale = push + punch;

  const Plane: React.FC<{depth: number; children: React.ReactNode; z?: number}> = ({depth, children, z = 0}) => (
    <div style={{position: 'absolute', inset: 0, zIndex: z, transform: `translateX(${camX * (depth - 0.5) * 26}px) translateY(${shake * (depth - 0.5)}px)`}}>{children}</div>
  );

  const heroS = springAt(frame, fps, T.hero, 120, 0.9);
  const secLS = springAt(frame, fps, T.sec, 120);
  const secRS = springAt(frame, fps, T.sec + 4, 120);
  const wordWipe = interpolate(frame, [T.text, T.text + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const slashDraw = interpolate(frame, [T.slash, T.slash + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const sinS = springAt(frame, fps, T.sin, 130, 0.7);
  const dim = interpolate(frame, [T.slash + 4, T.slash + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const Slash: React.FC<{front?: boolean}> = ({front}) => (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}} viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <path
        d={front ? 'M1150 500 L1470 380' : 'M470 730 L1180 440'}
        fill="none" stroke="#E9403B" strokeWidth={front ? 22 : 26} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - slashDraw}
        style={{filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45)) drop-shadow(0 0 16px rgba(233,64,59,0.65))'}}
      />
    </svg>
  );

  return (
    <AbsoluteFill style={{background: 'radial-gradient(72% 82% at 46% 42%, #123449 0%, #0A2536 55%, #06202F 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: '48% 46%', transform: `scale(${camScale})`}}>
        {/* halo */}
        <Plane depth={0} z={1}>
          <AbsoluteFill style={{background: 'radial-gradient(34% 40% at 48% 44%, rgba(52,198,224,0.16) 0%, transparent 70%)', opacity: interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}} />
        </Plane>

        {/* secundarias (atrás, blur) */}
        <Plane depth={0.35} z={2}>
          <div style={{position: 'absolute', left: 360, top: 430, transform: `translateY(${interpolate(secLS, [0, 1], [50, 0])}px) rotate(-7deg) scale(${interpolate(secLS, [0, 1], [0.9, 1])})`, opacity: secLS}}>
            <ImgCard img={V.secL} w={300} h={390} blur={4} dim={dim} />
          </div>
          <div style={{position: 'absolute', left: 1260, top: 450, transform: `translateY(${interpolate(secRS, [0, 1], [50, 0])}px) rotate(8deg) scale(${interpolate(secRS, [0, 1], [0.9, 1])})`, opacity: secRS}}>
            <ImgCard img={V.secR} w={300} h={390} blur={4} dim={dim} />
          </div>
        </Plane>

        {/* slash DETRÁS de la hero */}
        <Plane depth={0.7} z={3}><Slash /></Plane>

        {/* hero (imagen real) + palabra */}
        <Plane depth={0.7} z={4}>
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div style={{transform: `translateY(${interpolate(heroS, [0, 1], [80, 0])}px) scale(${interpolate(heroS, [0, 1], [0.9, 1])})`, opacity: heroS}}>
              <ImgCard img={V.hero} w={440} h={540} label={V.big} dim={dim} />
            </div>
          </AbsoluteFill>
        </Plane>

        {/* slash DELANTE (lado derecho) */}
        <Plane depth={1} z={6}><Slash front /></Plane>

        {/* "SIN" validación */}
        <Plane depth={1} z={7}>
          <div style={{position: 'absolute', left: '50%', top: 150, transform: `translate(-50%,0) translateY(${interpolate(sinS, [0, 1], [-28, 0])}px)`, opacity: sinS}}>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: BAS.card, borderRadius: 999, padding: '12px 32px', boxShadow: '0 22px 46px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.6)'}}>
              <span style={{width: 16, height: 16, borderRadius: '50%', background: BAS.si}} />
              <span style={{fontFamily: FONT_SANS, fontSize: 44, fontWeight: 800, letterSpacing: 3, color: BAS.brand}}>{V.small}</span>
            </div>
          </div>
        </Plane>
      </div>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 115% at 48% 44%, transparent 56%, rgba(4,23,33,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
