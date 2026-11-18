// Kit de Boone's Dog Yard (formato largo Veo): tipografías, etiqueta de cuero EASE, puerta de luz, fichas, tablero, cápsula, grano.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as loadSans} from '@remotion/google-fonts/Inter';

export const FPS = 24;
export const {fontFamily: SERIF} = loadSerif('normal', {weights: ['400'], subsets: ['latin']});
export const {fontFamily: SERIF_I} = loadSerif('italic', {weights: ['400'], subsets: ['latin']});
export const {fontFamily: SANS} = loadSans('normal', {weights: ['500', '700', '800'], subsets: ['latin']});
export const TINTA = '#2b211a', OCRE = '#a8742f', CREMA = '#F7F3EC', CUERO = '#7a4a28';
export const TIER_COL: Record<string, string> = {S: '#c9962b', A: '#5f8f4e', B: '#3f7f86', C: '#d07a2e', D: '#b5432f'};
const IO = Easing.inOut(Easing.cubic);
export const kf = (s: number, t: number[], v: number[], e = IO) => interpolate(s, t, v, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const sfx = (n: string) => staticFile(`b16/sfx/${n}.mp3`);

// ── Etiqueta de entrenador de cuero: cae colgada de su cordón, rebota y se balancea; «EASE x/5» grabado ──
export const Etiqueta: React.FC<{nota: string; dur: number; x?: number; escala?: number; sonido?: boolean}> = ({nota, dur, x = 1560, escala = 1, sonido = true}) => {
  const f = useCurrentFrame();
  const t = f / FPS, T = dur / FPS;
  const cae = kf(t, [0, 0.42], [0, 1], Easing.out(Easing.back(1.25)));
  const sube = kf(t, [T - 0.45, T], [0, 1], Easing.in(Easing.cubic));
  const y = -620 + cae * 620 - sube * 700;
  const swing = t > 0.42 ? 9 * Math.exp(-(t - 0.42) / 0.9) * Math.sin((t - 0.42) * 7.5) : -14 * (1 - cae);
  const giroY = 18 * Math.exp(-t / 1.2) * Math.sin(t * 4.2);
  const W = 300 * escala, H = 380 * escala;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', perspective: 1600}}>
      <div style={{position: 'absolute', left: x - W / 2, top: y, width: W, transformOrigin: `50% 0px`, transform: `rotateZ(${swing}deg) rotateY(${giroY}deg)`}}>
        {/* cordón */}
        <div style={{margin: '0 auto', width: 6 * escala, height: 120 * escala, background: 'linear-gradient(90deg,#3b2414,#6b4226,#3b2414)', borderRadius: 3}} />
        {/* la etiqueta */}
        <div style={{position: 'relative', width: W, height: H, borderRadius: `${70 * escala}px ${70 * escala}px ${28 * escala}px ${28 * escala}px`,
          background: `radial-gradient(ellipse at 30% 20%, #a8713f 0%, ${CUERO} 45%, #4e2c15 100%)`,
          boxShadow: `0 ${30 * escala}px ${60 * escala}px rgba(30,15,5,.45), inset 0 0 ${30 * escala}px rgba(0,0,0,.45), inset 0 ${4 * escala}px ${6 * escala}px rgba(255,220,170,.25)`}}>
          {/* poro del cuero */}
          <div style={{position: 'absolute', inset: 0, borderRadius: 'inherit', opacity: 0.35, mixBlendMode: 'multiply',
            background: 'repeating-radial-gradient(circle at 37% 61%, rgba(0,0,0,.25) 0 1px, transparent 1px 4px), repeating-radial-gradient(circle at 71% 23%, rgba(0,0,0,.2) 0 1px, transparent 1px 5px)'}} />
          {/* costura */}
          <div style={{position: 'absolute', inset: 16 * escala, borderRadius: `${56 * escala}px ${56 * escala}px ${18 * escala}px ${18 * escala}px`, border: `${3 * escala}px dashed rgba(240,205,150,.75)`}} />
          {/* ojal de bronce */}
          <div style={{position: 'absolute', left: W / 2 - 26 * escala, top: 26 * escala, width: 52 * escala, height: 52 * escala, borderRadius: '50%',
            background: 'radial-gradient(circle, #1a0e06 0 38%, #e2b867 40%, #8a6420 62%, #f3d58e 72%, #6e4c14 100%)', boxShadow: '0 2px 4px rgba(0,0,0,.5)'}} />
          <div style={{position: 'absolute', top: 108 * escala, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40 * escala, letterSpacing: 10 * escala,
            color: '#2a160a', textShadow: '0 1px 0 rgba(255,215,160,.35), 0 -1px 0 rgba(0,0,0,.5)'}}>EASE</div>
          <div style={{position: 'absolute', top: 150 * escala, width: '100%', textAlign: 'center', fontFamily: SERIF_I, fontSize: 150 * escala, lineHeight: 1,
            color: '#2a160a', textShadow: '0 2px 0 rgba(255,215,160,.3), 0 -2px 1px rgba(0,0,0,.55)'}}>{nota}</div>
        </div>
      </div>
      {sonido && <>
        <Sequence from={Math.round(0.36 * FPS)}><Audio src={sfx('tag_cuero')} volume={0.7} /></Sequence>
        <Sequence from={Math.round(0.55 * FPS)}><Audio src={sfx('tag_hebilla')} volume={0.6} /></Sequence>
        <Sequence from={Math.round(0.8 * FPS)}><Audio src={sfx('tag_silbido')} volume={0.32} /></Sequence>
      </>}
    </AbsoluteFill>
  );
};

// ── Puerta de luz: una ranura de luz cálida se abre en el centro y deja ver el Corral ──
export const puerta = (p: number) => ({
  clip: `inset(0 ${(1 - p) * 50}% 0 ${(1 - p) * 50}%)`,
});
export const LuzPuerta: React.FC<{p: number; fade: number}> = ({p, fade}) => {
  if (fade <= 0) return null;
  const w = 40 + p * 1920;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: fade}}>
      <div style={{position: 'absolute', left: 960 - w / 2 - 120, width: w + 240, top: 0, height: 1080,
        background: 'linear-gradient(90deg, transparent 0, rgba(255,236,200,.95) 120px, rgba(255,250,240,.4) 50%, rgba(255,236,200,.95) calc(100% - 120px), transparent 100%)',
        filter: 'blur(30px)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: `rgba(255,246,228,${Math.sin(p * Math.PI) * 0.55})`}} />
    </AbsoluteFill>
  );
};

// ── Número gigante + nombre (va DETRÁS del perro cuando hay recorte) ──
export const Numero: React.FC<{n: number; nombre: string; tier: string; t: number; dur: number}> = ({n, nombre, tier, t, dur}) => {
  const op = Math.min(kf(t, [0.05, 0.6], [0, 1]), kf(t, [dur - 0.4, dur], [1, 0]));
  const sub = kf(t, [0.05, 1.2], [60, 0], Easing.out(Easing.cubic));
  return (
    <div style={{position: 'absolute', left: 90, top: 70, opacity: op, transform: `translateY(${sub}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26}}>
        {tier && TIER_COL[tier] && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: '#fff', background: TIER_COL[tier], borderRadius: 8, padding: '6px 14px', letterSpacing: 3}}>{tier}</div>}
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 9, color: OCRE, fontVariant: 'small-caps', textTransform: 'uppercase', maxWidth: 1100}}>{nombre}</div>
      </div>
      <div style={{fontFamily: SERIF_I, fontSize: 560, lineHeight: 0.8, color: TINTA, opacity: 0.9, letterSpacing: -10}}>{n}</div>
    </div>
  );
};

// ── Fichas: tarjetas de datos a la derecha, entran de a una ──
export type Ficha = {lab: string; val: string; t: number; fuerte?: boolean};
export const Fichas: React.FC<{items: Ficha[]; t: number; dur: number}> = ({items, t, dur}) => (
  <div style={{position: 'absolute', right: 70, top: 170, width: 470, display: 'flex', flexDirection: 'column', gap: 18}}>
    {items.map((it, i) => {
      const k = kf(t, [it.t, it.t + 0.45], [0, 1], Easing.out(Easing.cubic));
      const op = Math.min(k, kf(t, [dur - 0.35, dur], [1, 0]));
      if (op <= 0) return null;
      return (
        <div key={i} style={{opacity: op, transform: `translateX(${(1 - k) * 80}px)`, background: it.fuerte ? 'rgba(122,74,40,.92)' : 'rgba(247,243,236,.86)',
          borderRadius: 14, padding: '14px 24px', boxShadow: '0 10px 30px rgba(60,35,15,.18)', borderLeft: `6px solid ${it.fuerte ? '#e7c08a' : OCRE}`}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: it.fuerte ? '#f3dcb5' : OCRE}}>{it.lab.toUpperCase()}</div>
          <div style={{fontFamily: SERIF, fontSize: 46, lineHeight: 1.05, color: it.fuerte ? '#fff8ec' : TINTA}}>{it.val}</div>
        </div>
      );
    })}
  </div>
);
export const sonidosFichas = (items: Ficha[]) => items.map((it, i) => <Sequence key={'fs' + i} from={Math.max(0, Math.round(it.t * FPS))}><Audio src={sfx('ficha_madera')} volume={0.45} /></Sequence>);

// ── Cápsula «Link in the description ↓» (4 s) ──
export const Capsula: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const k = Math.min(kf(t, [0, 0.4], [0, 1], Easing.out(Easing.back(1.4))), kf(t, [3.6, 4], [1, 0]));
  return (
    <div style={{position: 'absolute', left: 960, bottom: 90, transform: `translateX(-50%) scale(${0.6 + 0.4 * k})`, opacity: k,
      background: 'rgba(247,243,236,.95)', borderRadius: 999, padding: '18px 38px', boxShadow: '0 12px 34px rgba(40,25,10,.3)', display: 'flex', gap: 16, alignItems: 'center'}}>
      <div style={{width: 18, height: 18, borderRadius: 9, background: CUERO}} />
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: TINTA}}>Link in the description <span style={{color: CUERO}}>↓</span></div>
    </div>
  );
};

// ── Tablero de filas S-D con las razas ya puntuadas ──
export type FilaT = {tier: string; razas: string[]};
export const Tablero: React.FC<{filas: FilaT[]; activa?: string; dur: number; lado?: 'der' | 'centro'}> = ({filas, activa, dur, lado = 'der'}) => {
  const f = useCurrentFrame(), t = f / FPS, T = dur / FPS;
  const k = Math.min(kf(t, [0, 0.5], [0, 1], Easing.out(Easing.cubic)), kf(t, [T - 0.4, T], [1, 0]));
  const W = lado === 'centro' ? 1500 : 820;
  let chip = 0;
  return (
    <div style={{position: 'absolute', top: 110, left: lado === 'centro' ? 210 : 60, width: W, opacity: k, transform: `translateX(${(1 - k) * -120}px)`,
      background: 'rgba(247,243,236,.94)', borderRadius: 22, padding: 26, boxShadow: '0 20px 60px rgba(40,25,10,.35)'}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 6, color: OCRE, marginBottom: 14}}>BOONE'S EASE RANKING · AFTER 65</div>
      {filas.map((r) => (
        <div key={r.tier} style={{display: 'flex', alignItems: 'center', gap: 14, minHeight: 92, borderTop: '1px solid rgba(43,33,26,.12)', padding: '8px 0',
          background: r.tier === activa ? 'rgba(201,150,43,.12)' : 'transparent'}}>
          <div style={{width: 74, height: 74, flex: 'none', borderRadius: 12, background: TIER_COL[r.tier], color: '#fff', fontFamily: SERIF, fontSize: 52, display: 'grid', placeItems: 'center'}}>{r.tier}</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {r.razas.map((z) => {
              const tz = 0.45 + (chip++) * 0.12;
              const kz = kf(t, [tz, tz + 0.3], [0, 1], Easing.out(Easing.back(1.5)));
              return <div key={z} style={{transform: `scale(${kz})`, fontFamily: SANS, fontWeight: 700, fontSize: lado === 'centro' ? 28 : 25, color: TINTA, background: '#fff', borderRadius: 999, padding: '8px 16px', border: '1px solid rgba(43,33,26,.15)'}}>{z}</div>;
            })}
          </div>
        </div>
      ))}
      <Sequence from={Math.round(0.4 * FPS)}><Audio src={sfx('tablero_chip')} volume={0.5} /></Sequence>
    </div>
  );
};

// ── Título de sección chico (lower third) ──
export const Rotulo: React.FC<{arriba: string; txt: string; dur: number}> = ({arriba, txt, dur}) => {
  const f = useCurrentFrame(), t = f / FPS, T = dur / FPS;
  const k = Math.min(kf(t, [0, 0.5], [0, 1], Easing.out(Easing.cubic)), kf(t, [T - 0.4, T], [1, 0]));
  return (
    <div style={{position: 'absolute', left: 80, bottom: 110, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, background: 'rgba(247,243,236,.93)', borderRadius: 16, padding: '18px 30px', borderLeft: `8px solid ${CUERO}`, maxWidth: 1100}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 6, color: OCRE}}>{arriba.toUpperCase()}</div>
      <div style={{fontFamily: SERIF_I, fontSize: 58, lineHeight: 1.05, color: TINTA}}>{txt}</div>
    </div>
  );
};

// ── Insignia de cuenta regresiva (arriba a la izquierda, en el campo) ──
export const Insignia: React.FC<{n: number; tier: string}> = ({n, tier}) => (
  <div style={{position: 'absolute', left: 50, top: 44, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(247,243,236,.9)', borderRadius: 14, padding: '8px 16px 8px 8px', boxShadow: '0 6px 18px rgba(30,20,10,.25)'}}>
    <div style={{width: 46, height: 46, borderRadius: 10, background: TIER_COL[tier], color: '#fff', fontFamily: SERIF, fontSize: 32, display: 'grid', placeItems: 'center'}}>{tier}</div>
    <div style={{fontFamily: SERIF_I, fontSize: 40, color: TINTA}}>No. {n}</div>
  </div>
);

// ── Grano de película (filtro SVG, semilla por cuadro) y viñeta ──
export const Grano: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="1920" height="1080" style={{position: 'absolute', opacity: 0.06, mixBlendMode: 'overlay'}}>
        <filter id={`g${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 6} /></filter>
        <rect width="1920" height="1080" filter={`url(#g${f % 6})`} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 62%, rgba(40,25,10,.20) 100%)'}} />
    </AbsoluteFill>
  );
};
