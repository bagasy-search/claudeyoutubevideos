/**
 * ValOneTake — el primer minuto "de una sola toma" (Doctora Valeria, editorial vintage claro).
 *
 *  · OneTake (capa BASE, entre ventanas del avatar): una lista de planos que se encadenan SIN corte
 *    visible. La cámara nunca vuelve a 0: cada plano entra con la velocidad con la que salió el anterior.
 *    Transiciones:  zoom  → se atraviesa el plano (escala + blur) y se aterriza en el siguiente
 *                   whip  → barrido lateral con desenfoque de movimiento, los dos planos a la misma velocidad
 *                   iris  → el siguiente se abre desde un punto con un aro de RODAJA DE PAPA
 *                   drop  → el siguiente cae como una polaroid sobre la mesa y se asienta
 *    Palabras cinéticas integradas a la escena (no carteles): big · strip (tira de papel) · stamp (sello) · hand.
 *  · Continuidad (capa OVER, todo el minuto, también encima del avatar): polvo dorado, grano de papel,
 *    una luz cálida que respira y un destello en cada costura con el avatar, para que el ojo lea UNA toma.
 *
 * Todo es determinista (sin Math.random): el farm rinde en chunks paralelos.
 */
import React from 'react';
import {AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_DISPLAY, FONT_SERIF, FONT_HAND, FONT_SANS, CLAMP, rgba, CARD_SHADOW, PaperGrain} from './theme';
import {MotesLayer, makeMotes} from './ValeriaKit';

type Cam = [number, number, number, number, number, number]; // z0,x0,y0 → z1,x1,y1 (x,y en %)
export type OTShot = {src: string; clip?: boolean; frames?: number; d: number; cam?: Cam; tr?: 'zoom' | 'whip' | 'iris' | 'drop' | 'none'; ix?: number; iy?: number; tone?: 'sepia'};
export type OTWord = {t: number; d: number; text: string; kind?: 'big' | 'strip' | 'stamp' | 'hand'; x?: number; y?: number; hot?: boolean};

const TR = 14; // cuadros de cada transición (centrada en la frontera)
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Media: React.FC<{s: OTShot}> = ({s}) => {
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', filter: s.tone === 'sepia' ? 'sepia(0.55) contrast(0.95)' : undefined};
  const v = s.clip ? <OffthreadVideo src={staticFile(s.src)} muted style={st} /> : <Img src={staticFile(s.src)} style={st} />;
  return s.clip && s.frames && s.frames > 1 ? <Loop durationInFrames={s.frames}>{v}</Loop> : v;
};

/** Un plano con su cámara + lo que le hacen las transiciones de entrada (desde el anterior) y salida. */
const Plano: React.FC<{s: OTShot; f: number; dur: number; trIn?: OTShot['tr']; trOut?: OTShot['tr']; first: boolean; last: boolean; w: number; h: number}> = ({s, f, dur, trIn, trOut, first, last, w, h}) => {
  const cam = s.cam || [1.06, 0, 0, 1.14, 0, 0];
  const p = ease(Math.min(1, Math.max(0, f / Math.max(1, dur))));
  let z = lerp(cam[0], cam[3], p), x = lerp(cam[1], cam[4], p), y = lerp(cam[2], cam[5], p);
  let blur = 0, op = 1, rot = 0, ty = 0, clip: string | undefined;
  const half = TR / 2;
  // ENTRADA (primeros `half` cuadros; en el primer plano, desde el avatar: se aterriza desde un zoom)
  const kin = interpolate(f, [-half, half], [0, 1], CLAMP);
  const inT = first ? 'zoom' : trIn;
  if (kin < 1) {
    const e = Easing.out(Easing.cubic)(kin);
    if (inT === 'zoom') { z *= lerp(1.32, 1, e); blur += (1 - e) * 16; op = Math.min(op, first ? 1 : e * 1.6); }
    if (inT === 'whip') { x += (1 - e) * 55; blur += (1 - e) * 22; }
    if (inT === 'iris') { const r = lerp(0, 150, Easing.in(Easing.quad)(kin)); clip = `circle(${r}% at ${s.ix ?? 50}% ${s.iy ?? 50}%)`; z *= lerp(1.12, 1, e); }
    if (inT === 'drop') { ty = (1 - e) * -h * 1.05; rot = (1 - e) * -5; }
  }
  // SALIDA (últimos `half` cuadros): el plano se va con la velocidad con la que entra el siguiente
  const kout = interpolate(f, [dur - half, dur + half], [0, 1], CLAMP);
  const outT = last ? 'zoom' : trOut;
  if (kout > 0) {
    const e = Easing.in(Easing.cubic)(kout);
    if (outT === 'zoom') { z *= lerp(1, 1.4, e); blur += e * 18; }
    if (outT === 'whip') { x -= e * 55; blur += e * 22; }
    if (outT === 'iris' || outT === 'drop') { z *= lerp(1, 0.94, e); op = Math.min(op, 1 - e * 0.35); }
  }
  // 1,2 % de "respiración" de cámara (mano), para que ningún cuadro esté clavado
  x += Math.sin((f + s.d * 7) * 0.045) * 0.35;
  y += Math.cos((f + s.d * 5) * 0.038) * 0.3;
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: op, clipPath: clip, transform: `translateY(${ty}px) rotate(${rot}deg)`, boxShadow: inT === 'drop' && kin < 1 ? CARD_SHADOW : undefined}}>
      <AbsoluteFill style={{transform: `translate(${x}%, ${y}%) scale(${z})`, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
        <Media s={s} />
      </AbsoluteFill>
      {inT === 'iris' && kin < 1 ? <IrisAro k={kin} ix={s.ix ?? 50} iy={s.iy ?? 50} w={w} h={h} /> : null}
    </AbsoluteFill>
  );
};

/** El aro de la RODAJA DE PAPA que acompaña al iris (piel dorada + pulpa crema), para que el iris sea un objeto. */
const IrisAro: React.FC<{k: number; ix: number; iy: number; w: number; h: number}> = ({k, ix, iy, w, h}) => {
  const R = Math.hypot(w, h) * lerp(0, 1.5, Easing.in(Easing.quad)(k));
  const o = interpolate(k, [0, 0.1, 0.85, 1], [0, 1, 1, 0], CLAMP);
  const cx = (ix / 100) * w, cy = (iy / 100) * h;
  return (
    <div style={{position: 'absolute', left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: '50%', opacity: o, pointerEvents: 'none',
      boxShadow: `0 0 0 ${Math.max(6, R * 0.035)}px ${rgba('#E9D39A', 0.95)}, 0 0 0 ${Math.max(9, R * 0.05)}px ${rgba('#A9803F', 0.9)}, 0 0 ${Math.max(20, R * 0.08)}px ${Math.max(8, R * 0.05)}px ${rgba('#3A2A18', 0.35)}`}} />
  );
};

/** Palabras cinéticas. Viven dentro de la toma (debajo del polvo y la luz, encima de la imagen). */
const Palabra: React.FC<{w: OTWord; f: number; fps: number; W: number; H: number}> = ({w, f, fps, W, H}) => {
  const t0 = Math.round(w.t * fps), t1 = t0 + Math.round(w.d * fps);
  if (f < t0 - 2 || f > t1 + 12) return null;
  const k = spring({frame: f - t0, fps, config: {damping: 14, stiffness: 150, mass: 0.7}});
  const out = interpolate(f, [t1 - 6, t1 + 8], [0, 1], CLAMP);
  const x = (w.x ?? 50) / 100 * W, y = (w.y ?? 50) / 100 * H;
  const base: React.CSSProperties = {position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined, whiteSpace: 'nowrap'};
  const kind = w.kind || 'big';
  if (kind === 'big') {
    const letras = w.text.split('');
    return (
      <div style={{...base, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: H * 0.13, color: VAL.ink, letterSpacing: '0.01em', textShadow: `0 0 18px ${rgba(VAL.card, 0.95)}, 0 0 42px ${rgba(VAL.card, 0.9)}, 0 0 4px ${rgba(VAL.card, 1)}`, perspective: 800}}>
        {letras.map((c, i) => {
          const kk = spring({frame: f - t0 - i * 1.4, fps, config: {damping: 13, stiffness: 170, mass: 0.6}});
          return <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - kk) * H * 0.07}px) rotateX(${(1 - kk) * 70}deg)`, opacity: kk, color: w.hot ? VAL.terracotta : undefined}}>{c === ' ' ? ' ' : c}</span>;
        })}
        <div style={{height: H * 0.006, background: VAL.gold, marginTop: H * 0.008, width: `${interpolate(f, [t0 + 8, t0 + 22], [0, 100], CLAMP)}%`, borderRadius: 4}} />
      </div>
    );
  }
  if (kind === 'strip') {
    const sx = interpolate(k, [0, 1], [-W * 0.4, 0]);
    return (
      <div style={{...base, transform: `translate(calc(-50% + ${sx}px), -50%) rotate(-2.2deg)`, background: VAL.card, padding: `${H * 0.014}px ${W * 0.018}px`, boxShadow: CARD_SHADOW, fontFamily: FONT_SERIF, fontSize: H * 0.05, color: VAL.ink, borderLeft: `6px solid ${w.hot ? VAL.terracotta : VAL.gold}`}}>
        {w.text}
        <div style={{position: 'absolute', top: -10, right: 22, width: 70, height: 22, background: rgba('#F3E7C4', 0.8), transform: 'rotate(6deg)', boxShadow: `0 2px 4px ${rgba(VAL.ink, 0.15)}`}} />
      </div>
    );
  }
  if (kind === 'stamp') {
    const s = interpolate(k, [0, 1], [2.4, 1]);
    return (
      <div style={{...base, transform: `translate(-50%,-50%) scale(${s}) rotate(${lerp(-24, -9, k)}deg)`, width: H * 0.3, height: H * 0.3, borderRadius: '50%', border: `${H * 0.012}px solid ${VAL.terracotta}`, color: VAL.terracotta, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: rgba(VAL.card, 0.9), boxShadow: CARD_SHADOW}}>
        <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: H * 0.1 * Math.min(1, 3.2 / Math.max(1, w.text.split('|')[0].length)), lineHeight: 1}}>{w.text.split('|')[0]}</div>
        {w.text.includes('|') ? <div style={{fontFamily: FONT_SANS, fontWeight: 700, fontSize: H * 0.024, letterSpacing: '0.2em', textTransform: 'uppercase'}}>{w.text.split('|')[1]}</div> : null}
      </div>
    );
  }
  // hand: se escribe a mano (revelado de izquierda a derecha)
  const rev = interpolate(f, [t0, t0 + Math.max(8, w.text.length * 1.6)], [0, 100], CLAMP);
  return (
    <div style={{...base, fontFamily: FONT_HAND, fontSize: H * 0.095, color: w.hot ? VAL.terracotta : VAL.ink, textShadow: `0 0 14px ${rgba(VAL.card, 1)}, 0 0 34px ${rgba(VAL.card, 0.9)}, 0 0 3px ${rgba(VAL.card, 1)}`, clipPath: `inset(-20% ${100 - rev}% -20% -5%)`, transform: `translate(-50%,-50%) rotate(-3deg)`}}>
      {w.text}
    </div>
  );
};

export const OneTake: React.FC<{shots: OTShot[]; words?: OTWord[]}> = ({shots, words = []}) => {
  const f = useCurrentFrame();
  const {fps, width: W, height: H, durationInFrames} = useVideoConfig();
  // los planos se reparten el tramo en proporción a su `d`; el último se estira al final exacto
  const tot = shots.reduce((a, s) => a + s.d, 0) || 1;
  const starts: number[] = [];
  let acc = 0;
  for (const s of shots) { starts.push(Math.round((acc / tot) * durationInFrames)); acc += s.d; }
  return (
    <AbsoluteFill style={{backgroundColor: VAL.paperDeep, overflow: 'hidden'}}>
      {shots.map((s, i) => {
        const a = starts[i], b = i + 1 < shots.length ? starts[i + 1] : durationInFrames;
        if (f < a - TR || f > b + TR) return null;
        return <Plano key={i} s={s} f={f - a} dur={b - a} trIn={shots[i - 1]?.tr} trOut={s.tr} first={i === 0} last={i === shots.length - 1} w={W} h={H} />;
      })}
      {words.map((w, i) => <Palabra key={i} w={w} f={f} fps={fps} W={W} H={H} />)}
    </AbsoluteFill>
  );
};

/** Capa OVER de continuidad (todo el primer minuto, también sobre el avatar). `cuts` en segundos
 *  relativos al inicio de la capa: en cada uno, un destello cálido + un desenfoque de 4 cuadros. */
export const Continuidad: React.FC<{cuts?: number[]}> = ({cuts = []}) => {
  const f = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const motes = React.useMemo(() => makeMotes(16, 'onetake', 2, 6, 0.01, 0.03, 0.06, 0.16), []);
  let flash = 0, blur = 0, dir = 1;
  cuts.forEach((c, i) => {
    const cf = Math.round(c * fps), d = f - cf;
    if (d > -8 && d < 12) {
      flash = Math.max(flash, interpolate(d, [-8, -1, 2, 12], [0, 0.75, 0.55, 0], CLAMP));
      blur = Math.max(blur, interpolate(d, [-3, 0, 3], [0, 7, 0], CLAMP));
      dir = i % 2 ? -1 : 1;
    }
  });
  const band = interpolate(flash, [0, 1], [-60, 160]);
  // luz de ventana que respira (≤0,15 de opacidad: sobre la cara no puede ser un velo)
  const lx = 30 + Math.sin(f * 0.006) * 25, ly = 25 + Math.cos(f * 0.005) * 10;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {blur > 0.3 ? <AbsoluteFill style={{backdropFilter: `blur(${blur.toFixed(1)}px)`}} /> : null}
      <AbsoluteFill style={{background: `radial-gradient(45% 55% at ${lx}% ${ly}%, ${rgba('#FFE7B0', 0.13)}, transparent 70%)`, mixBlendMode: 'screen'}} />
      {flash > 0.01 ? (
        <AbsoluteFill style={{opacity: flash, background: `linear-gradient(${dir > 0 ? 105 : 75}deg, transparent ${band - 40}%, ${rgba('#FFF3D6', 0.95)} ${band}%, transparent ${band + 40}%)`}} />
      ) : null}
      <MotesLayer motes={motes} blur={1.1} scale={H / 1080} />
      <PaperGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
