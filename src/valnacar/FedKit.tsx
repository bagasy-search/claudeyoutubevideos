// FedKit.tsx — kit "papel clínico" de Dr. Federer (Federer Archivos), portado de src/falifting/Kit.tsx
// para el motor de Valeria (plan → build → cues). Cambios respecto del original:
//  · kickers/etiquetas que venían quemados ("Acrocordón", "Con el médico"…) ahora son props;
//  · el tiempo de cada ítem sale de `hitAt` (segundos desde el inicio del componente, lo calcula el build
//    anclado a la voz); sin hit, escalonado fijo;
//  · nuevos en el mismo lenguaje: FedChapter, FedRecipe, FedFaceZones, FedLamina, FedTalk (overlay sobre avatar).
// Lenguaje Federer: CAMA de foto real luminosa con parallax + TARJETA de papel crema con entrada 3D,
// Oswald (títulos) + Inter (cuerpo), teal clínico, ámbar de acento, rojo SÓLO alerta, SFX por evento.
// ⛔ Sin <Video>. ⛔ Velo CLARO (nunca oscurecer la foto).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {F_INTER, F_OSWALD} from '../VideoEdit/kit/premium/theme';

export const C = {
  paper: '#FBF7EE', paper2: '#F2EAD8', line: '#E3D8C2', ink: '#1D2A2E', ink2: '#4A5A5E',
  teal: '#12B3AE', tealD: '#0C7F7B', tealS: '#E2F4F3', green: '#2F7D5B', greenS: '#E4F2EA', amber: '#E39B2D', amberS: '#FCEBC7', danger: '#C8433A', dangerS: '#F8DAD5',
};
const FPS = 30;
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
export const inA = (f: number, start: number, len = 10) => interpolate(f, [start, start + len], [0, 1], {...cl, easing: ease});
const toneC = (t?: string) => (t === 'danger' ? C.danger : t === 'amber' ? C.amber : t === 'green' ? C.green : C.tealD);
/** cuadro en que aparece el ítem i: su hit (s) si existe, si no base + i*step */
const atH = (hitAt: number[] | undefined, i: number, base = 12, step = 18) => (hitAt && typeof hitAt[i] === 'number' ? Math.max(0, Math.round(hitAt[i] * FPS)) : base + i * step);
const isVid = (s?: string) => !!s && /\.mp4$/i.test(s);
const sf = (p: string) => (/^https?:|^\//.test(p) ? p : staticFile(p));
const useOut = () => { const f = useCurrentFrame(); const {durationInFrames: d} = useVideoConfig(); return interpolate(f, [d - 8, d], [1, 0], cl); };

export const Sfx: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 0.3}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none"><Audio src={staticFile(`sfx/${src}`)} volume={vol} /></Sequence>
);

/** CAMA luminosa: foto real con parallax lento y velo CLARO (no oscurece). */
export const Bed: React.FC<{src?: string; blur?: number; veil?: number}> = ({src, blur = 3, veil = 0.3}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], cl);
  if (!src || isVid(src)) return <AbsoluteFill style={{background: `radial-gradient(120% 100% at 30% 20%, #FFFFFF 0%, ${C.paper2} 70%)`}} />;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: C.paper}}>
      <Img src={sf(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${blur}px)`, transform: `scale(${(1.08 + 0.05 * k).toFixed(4)}) translateX(${(-1 + 2 * k).toFixed(3)}%)`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(251,247,238,${veil}) 0%, rgba(251,247,238,${veil * 0.6}) 50%, rgba(251,247,238,${veil + 0.1}) 100%)`}} />
    </AbsoluteFill>
  );
};

/** Tarjeta de papel con entrada 3D y deriva lenta (nunca quieta). */
export const Card: React.FC<{w: number; h?: number; x?: number; y?: number; delay?: number; children: React.ReactNode; rot?: number; pad?: number}> = ({w, h, x = 50, y = 50, delay = 0, children, rot = 0, pad = 48}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const a = inA(f, delay, 14);
  const drift = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], cl);
  return (
    <div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: w, height: h, perspective: 1600,
      transform: `translate(-50%, -50%) translateY(${((1 - a) * 60).toFixed(1)}px) scale(${(0.985 + 0.02 * drift).toFixed(4)})`, opacity: a}}>
      <div style={{width: '100%', height: '100%', boxSizing: 'border-box', padding: pad, borderRadius: 26, background: `linear-gradient(160deg, #FFFDF8 0%, ${C.paper} 60%, ${C.paper2} 100%)`,
        border: `1.5px solid ${C.line}`, boxShadow: '0 40px 90px rgba(40,34,20,0.28), 0 8px 22px rgba(40,34,20,0.16)',
        transform: `rotateX(${((1 - a) * 14).toFixed(2)}deg) rotateZ(${(rot + (1 - a) * -2).toFixed(2)}deg)`}}>
        {children}
      </div>
    </div>
  );
};

const Kicker: React.FC<{children: React.ReactNode; color?: string; o?: number}> = ({children, color = C.tealD, o = 1}) => (
  <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: 'uppercase', color, opacity: o}}>{children}</div>
);
const Title: React.FC<{children: React.ReactNode; size?: number; color?: string; o?: number}> = ({children, size = 72, color = C.ink, o = 1}) => (
  <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: size, lineHeight: 1.04, color, opacity: o}}>{children}</div>
);
const Underline: React.FC<{p: number; color?: string; w?: number}> = ({p, color = C.teal, w = 260}) => (
  <div style={{height: 6, width: w * p, background: color, borderRadius: 3, marginTop: 14}} />
);
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü0-9]/gi, '');
/** palabras que entran una a una; las de `hot` van subrayadas en teal (o en el color dado). */
const Wordy: React.FC<{text: string; start: number; size?: number; color?: string; per?: number; hot?: string[]; hotColor?: string}> = ({text, start, size = 72, color = C.ink, per = 3, hot = [], hotColor = C.teal}) => {
  const f = useCurrentFrame();
  const H = new Set(hot.map(clean));
  return (
    <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: size, lineHeight: 1.08, color}}>
      {text.split(' ').map((w, i) => {
        const a = inA(f, start + i * per, 8); const isH = H.has(clean(w));
        return <span key={i} style={{display: 'inline-block', marginRight: size * 0.24, opacity: a, transform: `translateY(${((1 - a) * size * 0.4).toFixed(1)}px)`, color: isH ? hotColor : color, boxShadow: isH ? `inset 0 -${Math.round(size * 0.14)}px 0 ${hotColor}33` : undefined}}>{w}</span>;
      })}
    </div>
  );
};
const Polaroid: React.FC<{src?: string; w: number; h: number; rot?: number; o?: number; s?: number}> = ({src, w, h, rot = -3, o = 1, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: w, padding: 16, paddingBottom: 46, background: '#fff', boxShadow: '0 28px 60px rgba(40,34,20,0.3)', transform: `rotate(${rot}deg) scale(${s})`, opacity: o}}>
      <div style={{width: w - 32, height: h, overflow: 'hidden', background: C.paper2}}>
        {src && !isVid(src) ? <Img src={sf(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${(1.04 + f * 0.0006).toFixed(4)})`}} /> : null}
      </div>
    </div>
  );
};
const Fade: React.FC<{children: React.ReactNode}> = ({children}) => { const o = useOut(); return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>; };

// ───────────────────────────── OVERLAYS sobre el avatar ─────────────────────────────
/** FedTalk: título de Federer abajo a la izquierda (placa crema + barra teal), o SELLO rojo si `stamp`. */
export const FedTalk: React.FC<{kicker?: string; title?: string; hot?: string[]; stamp?: string; tone?: string}> = ({kicker = '', title = '', hot = [], stamp, tone}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const out = interpolate(f, [d - 10, d], [1, 0], cl);
  if (stamp) {
    const a = interpolate(f, [4, 12], [0, 1], {...cl, easing: Easing.out(Easing.back(2))});
    const s = interpolate(f, [4, 12, 18], [2.2, 0.94, 1], cl);
    return (
      <AbsoluteFill style={{opacity: out}}>
        <Sfx at={10} src="stinger_hit.mp3" vol={0.32} />
        <div style={{position: 'absolute', left: '6%', bottom: '11%', transform: `rotate(-6deg) scale(${s})`, transformOrigin: 'left bottom', opacity: a}}>
          <div style={{border: `8px solid ${C.danger}`, borderRadius: 18, padding: '18px 36px', background: 'rgba(251,247,238,0.95)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', maxWidth: 980}}>
            <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: 92, color: C.danger, letterSpacing: 2, lineHeight: 1}}>{stamp}</div>
            <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 36, color: C.ink, marginTop: 10, opacity: inA(f, 16, 10)}}>{title}</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const a = inA(f, 2, 12);
  const col = toneC(tone);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Sfx at={3} src="sfx_whoosh_soft.mp3" vol={0.22} />
      <div style={{position: 'absolute', left: 90, bottom: 96, maxWidth: 1000, transform: `translateX(${((1 - a) * -80).toFixed(1)}px)`, opacity: a, display: 'flex', alignItems: 'stretch', boxShadow: '0 24px 60px rgba(0,0,0,0.28)', borderRadius: 16, overflow: 'hidden'}}>
        <div style={{width: 14, background: col}} />
        <div style={{background: 'rgba(251,247,238,0.97)', padding: '20px 36px 24px'}}>
          {kicker ? <Kicker color={col} o={inA(f, 6, 10)}>{kicker}</Kicker> : null}
          <div style={{marginTop: 6}}><Wordy text={title} start={8} size={title.length > 30 ? 54 : 64} per={2} hot={hot} hotColor={tone === 'danger' ? C.danger : C.tealD} /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── PANTALLA COMPLETA ─────────────────────────────
type P = {image?: string; hitAt?: number[]; kicker?: string; title?: string; hot?: string[]};

/** Apertura de sección: número gigante teal + título + sub, sobre cama de foto. */
export const FedChapter: React.FC<P & {index?: string; sub?: string; tone?: string}> = ({image, kicker = '', index = '', title = '', hot = [], sub = '', tone}) => {
  const f = useCurrentFrame();
  const col = tone === 'danger' ? C.danger : C.teal;
  const bar = inA(f, 2, 18);
  return (
    <Fade>
      <Bed src={image} blur={5} veil={0.5} />
      <Sfx at={2} src="cp_whoosh.wav" vol={0.26} />
      <div style={{position: 'absolute', left: 0, top: '50%', height: 380, marginTop: -190, width: `${(bar * 74).toFixed(1)}%`, background: 'rgba(251,247,238,0.96)', boxShadow: '0 40px 90px rgba(40,34,20,0.25)', borderRight: `14px solid ${col}`}} />
      <div style={{position: 'absolute', left: 150, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 56}}>
        <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: 280, color: col, lineHeight: 0.9, opacity: inA(f, 6, 12), transform: `translateY(${((1 - inA(f, 6, 12)) * 40).toFixed(1)}px)`}}>{index}</div>
        <div style={{maxWidth: 900}}>
          <Kicker color={col} o={inA(f, 10, 10)}>{kicker}</Kicker>
          <Wordy text={title} start={14} size={title.length > 22 ? 84 : 100} hot={hot} hotColor={col} />
          <div style={{fontFamily: F_INTER, fontWeight: 600, fontSize: 40, color: C.ink2, marginTop: 10, opacity: inA(f, 30, 12)}}>{sub}</div>
        </div>
      </div>
    </Fade>
  );
};

export const BigNumber: React.FC<P & {value?: string; unit?: string; caption?: string; tone?: string}> = ({image, kicker = '', value = '', unit = '', caption = '', tone}) => {
  const f = useCurrentFrame();
  const col = toneC(tone);
  const wipe = inA(f, 4, 16);
  const pop = interpolate(f, [4, 14, 22], [0.7, 1.05, 1], cl);
  return (
    <Fade>
      <Bed src={image} veil={0.42} />
      <Sfx at={5} src="number_slam.mp3" vol={0.3} />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {kicker ? <div style={{marginBottom: 26, background: 'rgba(251,247,238,0.94)', borderRadius: 12, padding: '8px 26px', opacity: inA(f, 2, 10)}}><Kicker color={col}>{kicker}</Kicker></div> : null}
        <div style={{background: 'rgba(251,247,238,0.92)', borderRadius: 34, padding: '30px 70px', boxShadow: '0 40px 90px rgba(0,0,0,0.25)', transform: `scale(${pop.toFixed(3)})`, textAlign: 'center'}}>
          <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: value.length > 9 ? 170 : 230, color: col, lineHeight: 1, clipPath: `inset(0 ${((1 - wipe) * 100).toFixed(1)}% 0 0)`}}>{value}</div>
          {unit ? <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 70, color: C.ink, opacity: inA(f, 14, 10)}}>{unit}</div> : null}
          <div style={{height: 8, background: col, width: `${(inA(f, 16, 14) * 100).toFixed(0)}%`, margin: '18px auto 0', borderRadius: 4}} />
        </div>
        <div style={{marginTop: 40, fontFamily: F_INTER, fontWeight: 700, fontSize: 48, color: C.ink, background: '#fff', borderRadius: 16, padding: '16px 36px', boxShadow: '0 16px 40px rgba(0,0,0,0.18)', opacity: inA(f, 22, 12), transform: `translateY(${((1 - inA(f, 22, 12)) * 30).toFixed(1)}px)`}}>{caption}</div>
      </AbsoluteFill>
    </Fade>
  );
};

const ListCard: React.FC<P & {footer?: string; items: string[]; mode: 'flag' | 'cross' | 'check'}> = ({image, hitAt, kicker = '', title = '', hot = [], footer = '', items, mode}) => {
  const f = useCurrentFrame();
  const col = mode === 'check' ? C.tealD : C.danger;
  const last = items.length ? atH(hitAt, items.length - 1, 22, 16) : 60;
  return (
    <Fade>
      <Bed src={image} />
      <Card w={1360} h={Math.min(960, 330 + items.length * 118 + (footer ? 70 : 0))}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          {mode === 'flag' && <svg width="62" height="62" viewBox="0 0 100 100" style={{opacity: inA(f, 4)}}><path d="M50 8 L94 88 L6 88 Z" fill={C.danger} /><rect x="46" y="36" width="8" height="28" fill="#fff" /><rect x="46" y="70" width="8" height="8" fill="#fff" /></svg>}
          <Kicker color={col} o={inA(f, 4)}>{kicker}</Kicker>
        </div>
        <Wordy text={title} start={6} size={76} hot={hot} hotColor={col} />
        <Underline p={inA(f, 14, 14)} color={col} w={340} />
        <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 20}}>
          {items.map((it, i) => {
            const s = atH(hitAt, i, 22, 16); const a = inA(f, s, 8); const st = inA(f, s + 6, 10);
            const pulse = mode === 'flag' ? 1 + 0.18 * Math.max(0, Math.sin((f - s) / 4)) * a : 1;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: a, transform: `translateX(${((1 - a) * 60).toFixed(1)}px)`, background: mode === 'flag' ? C.dangerS : '#fff', borderRadius: 16, padding: '16px 26px'}}>
                <div style={{width: 54, height: 54, flex: '0 0 54px', borderRadius: '50%', background: col, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F_OSWALD, fontSize: 36, fontWeight: 700, transform: `scale(${pulse.toFixed(3)})`}}>{mode === 'flag' ? '!' : mode === 'cross' ? '✕' : '✓'}</div>
                <div style={{position: 'relative', fontFamily: F_INTER, fontWeight: 700, fontSize: 46, color: C.ink}}>
                  {it}
                  {mode === 'cross' && <div style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${(st * 100).toFixed(1)}%`, background: C.danger, borderRadius: 3}} />}
                </div>
              </div>
            );
          })}
        </div>
        {footer ? <div style={{marginTop: 26, fontFamily: F_INTER, fontWeight: 700, fontSize: 38, color: C.tealD, opacity: inA(f, last + 18, 12)}}>{footer}</div> : null}
      </Card>
      {items.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 22, 16)} src={mode === 'flag' ? 'node_pop.mp3' : 'sfx_paper_tick.mp3'} vol={0.24} />)}
    </Fade>
  );
};
export const RedFlags: React.FC<any> = (p) => <ListCard {...p} items={p.items || []} mode="flag" />;
export const CrossList: React.FC<any> = (p) => <ListCard {...p} items={p.items || []} mode="cross" />;
export const CheckList: React.FC<any> = (p) => <ListCard {...p} items={p.items || []} mode="check" />;

export const StepsPaper: React.FC<P & {steps?: {title: string; sub?: string}[]}> = ({image, hitAt, kicker = '', title = '', hot = [], steps = []}) => {
  const f = useCurrentFrame();
  const cols = steps.length > 2 ? 2 : steps.length;
  return (
    <Fade>
      <Bed src={image} />
      <Card w={1660} h={steps.length > 2 ? 860 : 640}>
        <Kicker color={C.green} o={inA(f, 4)}>{kicker}</Kicker>
        <Wordy text={title} start={6} size={80} hot={hot} hotColor={C.green} />
        <Underline p={inA(f, 14, 14)} color={C.green} w={320} />
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 28, marginTop: 40}}>
          {steps.map((s, i) => {
            const st = atH(hitAt, i, 20, 22); const a = inA(f, st, 10); const chk = inA(f, st + 8, 8);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, background: '#fff', borderRadius: 20, padding: '22px 28px', border: `3px solid ${C.line}`, opacity: a, transform: `translateY(${((1 - a) * 40).toFixed(1)}px)`}}>
                <div style={{width: 80, height: 80, flex: '0 0 80px', borderRadius: 18, background: C.green, color: '#fff', fontFamily: F_OSWALD, fontWeight: 700, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{chk > 0.5 ? '✓' : i + 1}</div>
                <div><div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 54, color: C.ink, lineHeight: 1}}>{s.title}</div>{s.sub ? <div style={{fontFamily: F_INTER, fontWeight: 600, fontSize: 32, color: C.ink2, marginTop: 6}}>{s.sub}</div> : null}</div>
              </div>
            );
          })}
        </div>
      </Card>
      {steps.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 20, 22)} src="sfx_paper_tick.mp3" vol={0.28} />)}
    </Fade>
  );
};

/** Mito / pregunta que se da vuelta: frente = la creencia (sello `verdict`), dorso = la verdad. Gira en hitAt[0]. */
export const MythFlip: React.FC<P & {statement?: string; truth?: string; verdict?: string; tone?: string}> = ({image, hitAt, kicker = 'MITO', statement = '', truth = '', verdict = 'FALSO', tone}) => {
  const f = useCurrentFrame();
  const s = atH(hitAt, 0, 45, 0);
  const rot = interpolate(f, [s, s + 16], [0, 180], {...cl, easing: ease});
  const strike = inA(f, Math.max(8, s - 14), 10);
  const vc = tone === 'green' ? C.green : tone === 'amber' ? C.amber : C.danger;
  return (
    <Fade>
      <Bed src={image} />
      <div style={{position: 'absolute', left: '50%', top: '52%', width: 1300, height: 640, marginLeft: -650, marginTop: -320, perspective: 2200, opacity: inA(f, 0, 10)}}>
        <div style={{position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${rot.toFixed(1)}deg) translateY(${(Math.sin(f / 25) * 5).toFixed(1)}px)`}}>
          <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 34, background: C.paper, border: `3px solid ${C.line}`, boxShadow: '0 40px 90px rgba(0,0,0,0.25)', padding: 70, boxSizing: 'border-box'}}>
            <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: 52, color: C.tealD, letterSpacing: 6, textTransform: 'uppercase'}}>{kicker}</div>
            <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: statement.length > 34 ? 80 : 96, color: C.ink, lineHeight: 1.05, marginTop: 36}}>«{statement}»</div>
            <div style={{position: 'absolute', right: 70, bottom: 60, fontFamily: F_OSWALD, fontWeight: 800, fontSize: 84, color: vc, border: `8px solid ${vc}`, borderRadius: 14, padding: '0 28px', transform: `rotate(-10deg) scale(${(2 - strike).toFixed(3)})`, opacity: strike, background: 'rgba(255,255,255,0.85)'}}>{verdict}</div>
          </div>
          <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 34, background: '#fff', borderLeft: `26px solid ${C.teal}`, boxShadow: '0 40px 90px rgba(0,0,0,0.25)', padding: 70, boxSizing: 'border-box'}}>
            <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: 52, color: C.tealD, letterSpacing: 6}}>LA VERDAD</div>
            <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: truth.length > 40 ? 78 : 92, color: C.ink, lineHeight: 1.06, marginTop: 36}}>{truth}</div>
          </div>
        </div>
      </div>
      <Sfx at={Math.max(8, s - 14)} src="sfx_text_thud.mp3" vol={0.3} /><Sfx at={s} src="sfx_trans2.mp3" vol={0.3} />
    </Fade>
  );
};

type Side = {label: string; text: string; tone?: string};
export const SplitCompare: React.FC<P & {left?: Side; right?: Side; verdict?: string}> = ({image, hitAt, title = '', left = {label: '', text: ''}, right = {label: '', text: ''}, verdict = ''}) => {
  const f = useCurrentFrame();
  const sb = atH(hitAt, 0, 26, 0), sv = atH(hitAt, 1, 48, 0);
  const a = inA(f, 8, 14), b = inA(f, sb, 14), v = inA(f, sv, 12);
  const Panel: React.FC<{s: Side; p: number; dir: number}> = ({s, p, dir}) => (
    <div style={{width: 720, height: 460, borderRadius: 28, background: '#fff', borderTop: `16px solid ${toneC(s.tone)}`, boxShadow: '0 30px 70px rgba(0,0,0,0.22)', padding: 44, boxSizing: 'border-box', opacity: p, transform: `translateX(${((1 - p) * 140 * dir).toFixed(1)}px) rotate(${(dir * (1 - p) * 4).toFixed(2)}deg)`}}>
      <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 46, color: toneC(s.tone), textTransform: 'uppercase', letterSpacing: 1}}>{s.label}</div>
      <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: s.text.length > 24 ? 70 : 84, color: C.ink, lineHeight: 1.05, marginTop: 30}}>{s.text}</div>
    </div>
  );
  return (
    <Fade>
      <Bed src={image} />
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', opacity: inA(f, 2, 10)}}>
        <span style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 80, color: C.ink, background: 'rgba(251,247,238,0.94)', padding: '6px 34px', borderRadius: 16}}>{title}</span>
      </div>
      <div style={{position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 60}}>
        <Panel s={left} p={a} dir={-1} />
        <div style={{alignSelf: 'center', fontFamily: F_OSWALD, fontWeight: 800, fontSize: 70, color: C.ink2, opacity: b}}>VS</div>
        <Panel s={right} p={b} dir={1} />
      </div>
      <div style={{position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', opacity: v, transform: `translateY(${((1 - v) * 30).toFixed(1)}px)`}}>
        <span style={{fontFamily: F_INTER, fontWeight: 800, fontSize: 50, color: '#fff', background: C.tealD, padding: '16px 40px', borderRadius: 18, boxShadow: '0 18px 40px rgba(0,0,0,0.25)'}}>{verdict}</span>
      </div>
      <Sfx at={8} src="sfx_whoosh_soft.mp3" /><Sfx at={sb} src="sfx_whoosh_soft.mp3" /><Sfx at={sv} src="sfx_chime.mp3" vol={0.2} />
    </Fade>
  );
};

export const FactorChips: React.FC<P & {chips?: string[]}> = ({image, hitAt, title = '', chips = []}) => {
  const f = useCurrentFrame();
  const pos = [[26, 44], [62, 38], [80, 60], [38, 70], [66, 82], [18, 84]];
  return (
    <Fade>
      <Bed src={image} />
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', opacity: inA(f, 2, 10)}}>
        <span style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 92, color: C.ink, background: 'rgba(251,247,238,0.94)', padding: '6px 40px', borderRadius: 18}}>{title}</span>
      </div>
      {chips.map((c, i) => {
        const s = atH(hitAt, i, 16, 22); const a = interpolate(f, [s, s + 10], [0, 1], {...cl, easing: Easing.out(Easing.back(2))}); const [x, y] = pos[i % pos.length];
        return <div key={i} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, whiteSpace: 'nowrap', transform: `translate(-50%,-50%) scale(${a.toFixed(3)}) translateY(${(Math.sin((f + i * 17) / 22) * 8).toFixed(1)}px)`, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 70, color: i === chips.length - 1 ? '#fff' : C.ink, background: i === chips.length - 1 ? C.amber : C.paper, border: `4px solid ${i === chips.length - 1 ? C.amber : C.teal}`, borderRadius: 60, padding: '16px 50px', boxShadow: '0 24px 50px rgba(0,0,0,0.22)'}}>{c}</div>;
      })}
      {chips.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 16, 22)} src="chip_pop3d.mp3" vol={0.24} />)}
    </Fade>
  );
};

export const QuoteCard: React.FC<P & {quote?: string; attrib?: string}> = ({image, quote = '', attrib = ''}) => {
  const f = useCurrentFrame();
  const chars = Math.floor(interpolate(f, [10, 10 + quote.length * 1.1], [0, quote.length], cl));
  return (
    <Fade>
      <Bed src={image} blur={6} />
      <Sfx at={8} src="keyboard_type.mp3" vol={0.16} />
      <div style={{position: 'absolute', left: 150, top: 230, opacity: inA(f, 2, 12)}}><Polaroid src={image} w={560} h={440} rot={-5} s={0.96 + 0.04 * inA(f, 2, 20)} /></div>
      <Card w={1020} h={580} x={63} y={52} delay={4} rot={1.5}>
        <div style={{fontFamily: F_OSWALD, fontSize: 200, color: C.teal, lineHeight: 0.6, height: 90}}>“</div>
        <div style={{fontFamily: F_INTER, fontWeight: 800, fontSize: quote.length > 70 ? 52 : 60, lineHeight: 1.18, color: C.ink}}>{quote.slice(0, chars)}<span style={{opacity: chars < quote.length ? 1 : 0}}>|</span></div>
        <div style={{marginTop: 30, fontFamily: F_INTER, fontWeight: 600, fontSize: 34, color: C.tealD, opacity: inA(f, 12 + quote.length, 12)}}>— {attrib}</div>
      </Card>
    </Fade>
  );
};

export const StoryCard: React.FC<P & {name?: string; age?: string; detail?: string}> = ({image, kicker = 'Una historia', name = '', age = '', detail = ''}) => {
  const f = useCurrentFrame();
  const p = inA(f, 4, 18);
  return (
    <Fade>
      <Bed src={image} blur={6} />
      <Sfx at={4} src="universfield-camera-shutter-199580.mp3" vol={0.3} />
      <div style={{position: 'absolute', left: 180, top: 140, transform: `rotate(${(-8 + 4 * p).toFixed(2)}deg) translateY(${((1 - p) * -200).toFixed(1)}px)`, opacity: p}}>
        <Polaroid src={image} w={820} h={640} rot={0} />
        <div style={{position: 'absolute', top: -26, left: 320, width: 180, height: 56, background: 'rgba(240,226,180,0.85)', transform: 'rotate(-4deg)'}} />
      </div>
      <Card w={720} h={520} x={73} y={55} delay={14} rot={2}>
        <Kicker o={inA(f, 18)}>{kicker}</Kicker>
        <Wordy text={name} start={20} size={88} />
        <Underline p={inA(f, 28, 14)} color={C.amber} w={300} />
        <div style={{display: 'flex', gap: 16, marginTop: 30, flexWrap: 'wrap'}}>
          {[age, detail].filter(Boolean).map((t, i) => { const a = inA(f, 34 + i * 10, 9); return <div key={i} style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 40, background: i ? '#fff' : C.amberS, border: `3px solid ${C.amber}`, borderRadius: 40, padding: '10px 26px', color: C.ink, opacity: a, transform: `scale(${(0.8 + 0.2 * a).toFixed(3)})`}}>{t}</div>; })}
        </div>
      </Card>
    </Fade>
  );
};

export const QuestionCards: React.FC<P & {questions?: string[]}> = ({image, hitAt, kicker = '', title = '', questions = []}) => {
  const f = useCurrentFrame();
  return (
    <Fade>
      <Bed src={image} />
      <div style={{position: 'absolute', left: 140, top: 110, opacity: inA(f, 2, 10)}}>
        <Kicker color={C.tealD}>{kicker}</Kicker>
        <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 84, color: C.ink, background: 'rgba(251,247,238,0.92)', padding: '4px 24px', borderRadius: 14, marginTop: 8}}>{title}</div>
      </div>
      {questions.slice(0, 4).map((q, i) => {
        const s = atH(hitAt, i, 16, 40); const a = interpolate(f, [s, s + 12], [0, 1], {...cl, easing: Easing.out(Easing.back(1.5))});
        return (
          <div key={i} style={{position: 'absolute', left: 180 + i * 150, top: 360 + i * 160, opacity: Math.min(1, a), transform: `scale(${(0.7 + 0.3 * a).toFixed(3)}) translateY(${(Math.sin((f + i * 20) / 26) * 5).toFixed(1)}px)`, transformOrigin: 'left center'}}>
            <div style={{position: 'relative', background: '#fff', borderRadius: 30, padding: '26px 42px', boxShadow: '0 30px 60px rgba(0,0,0,0.22)', display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{width: 66, height: 66, borderRadius: '50%', background: C.teal, color: '#fff', fontFamily: F_OSWALD, fontWeight: 700, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
              <div style={{fontFamily: F_INTER, fontWeight: 800, fontSize: 50, color: C.ink, whiteSpace: 'nowrap'}}>{q}</div>
              <div style={{position: 'absolute', left: 40, bottom: -26, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: '30px solid #fff'}} />
            </div>
          </div>
        );
      })}
      {questions.slice(0, 4).map((_, i) => <Sfx key={i} at={atH(hitAt, i, 16, 40)} src="px_bubble.mp3" vol={0.26} />)}
    </Fade>
  );
};

export const LoopCards: React.FC<P & {cards?: {n: string; label: string}[]}> = ({image, hitAt, title = '', cards = []}) => {
  const f = useCurrentFrame();
  return (
    <Fade>
      <Bed src={image} />
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', opacity: inA(f, 2, 10)}}>
        <span style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 80, color: C.ink, background: 'rgba(251,247,238,0.92)', padding: '8px 36px', borderRadius: 16}}>{title}</span>
      </div>
      <div style={{position: 'absolute', top: 320, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 50, perspective: 1800}}>
        {cards.map((c, i) => {
          const s = atH(hitAt, i, 20, 30); const a = inA(f, 6 + i * 5, 12); const flip = interpolate(f, [s, s + 14], [180, 0], {...cl, easing: ease});
          return (
            <div key={i} style={{width: 420, height: 560, position: 'relative', opacity: a, transform: `translateY(${((1 - a) * 80 + Math.sin((f + i * 20) / 30) * 6).toFixed(1)}px) rotateY(${flip.toFixed(1)}deg)`, transformStyle: 'preserve-3d'}}>
              <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 28, background: C.paper, border: `2px solid ${C.line}`, boxShadow: '0 40px 80px rgba(0,0,0,0.25)', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: 150, color: C.teal, lineHeight: 1}}>{c.n}</div>
                <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: c.label.length > 18 ? 50 : 58, color: C.ink, lineHeight: 1.05}}>{c.label}</div>
              </div>
              <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 28, background: `linear-gradient(150deg, ${C.teal}, ${C.tealD})`, boxShadow: '0 40px 80px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F_OSWALD, fontWeight: 800, fontSize: 220, color: 'rgba(255,255,255,0.9)'}}>?</div>
            </div>
          );
        })}
      </div>
      {cards.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 20, 30)} src="layer_drop.mp3" vol={0.28} />)}
    </Fade>
  );
};

export const DayTimeline: React.FC<P & {days?: {day: string; text: string}[]}> = ({image, hitAt, kicker = '', title = '', days = []}) => {
  const f = useCurrentFrame();
  const n = days.length;
  const lastS = n ? atH(hitAt, n - 1, 20, 40) : 60;
  const prog = interpolate(f, [n ? atH(hitAt, 0, 20, 40) : 0, lastS + 8], [0, 1], cl);
  const W = 1700;
  return (
    <Fade>
      <Bed src={image} />
      <Card w={W} h={660}>
        <Kicker o={inA(f, 4)}>{kicker}</Kicker>
        <Wordy text={title} start={6} size={78} />
        <div style={{position: 'relative', marginTop: 100, height: 280}}>
          <div style={{position: 'absolute', left: 220, right: 220, top: 40, height: 10, background: C.line, borderRadius: 5}} />
          <div style={{position: 'absolute', left: 220, top: 40, height: 10, width: `calc(${(prog * 100).toFixed(1)}% - ${(prog * 440).toFixed(1)}px)`, background: `linear-gradient(90deg, ${C.teal}, ${C.tealD})`, borderRadius: 5}} />
          {days.map((d, i) => {
            const s = atH(hitAt, i, 20, 40); const a = inA(f, s, 9); const col = i === n - 1 ? C.amber : C.teal;
            return (
              <div key={i} style={{position: 'absolute', left: `${(220 + (i * (W - 96 - 440)) / Math.max(1, n - 1)).toFixed(0)}px`, top: 0, width: 0}}>
                <div style={{position: 'absolute', left: -45, top: 0, width: 90, height: 90, borderRadius: '50%', background: col, border: '6px solid #fff', boxShadow: '0 10px 24px rgba(0,0,0,0.2)', transform: `scale(${(0.3 + 0.7 * a).toFixed(3)})`, opacity: a}} />
                <div style={{position: 'absolute', left: -170, width: 340, top: 116, textAlign: 'center', opacity: a}}>
                  <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 40, color: i === n - 1 ? C.amber : C.tealD}}>{d.day}</div>
                  <div style={{fontFamily: F_INTER, fontWeight: 800, fontSize: 40, color: C.ink, lineHeight: 1.15}}>{d.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {days.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 20, 40)} src="node_land.mp3" vol={0.24} />)}
    </Fade>
  );
};

/** Tablero de fotos con sello por tarjeta (verdict + tone: green/amber/danger). Fotos en image, imageA, imageB. */
export const RemedyBoard: React.FC<P & {imageA?: string; imageB?: string; cards?: {name: string; verdict: string; tone?: string}[]}> = ({image, imageA, imageB, hitAt, title = '', cards = []}) => {
  const f = useCurrentFrame();
  const imgs = [imageA, imageB, image];
  return (
    <Fade>
      <Bed />
      <div style={{position: 'absolute', top: 80, width: '100%', textAlign: 'center', opacity: inA(f, 2, 10)}}>
        <span style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 80, color: C.ink, background: 'rgba(251,247,238,0.94)', padding: '6px 36px', borderRadius: 16}}>{title}</span>
      </div>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
        {cards.slice(0, 3).map((c, i) => {
          const a = inA(f, 4 + i * 6, 12); const st = atH(hitAt, i, 30, 30); const b = interpolate(f, [st, st + 8], [0, 1], {...cl, easing: Easing.out(Easing.back(2))});
          const col = c.tone === 'green' ? C.green : c.tone === 'amber' ? C.amber : C.danger; const im = imgs[i];
          return (
            <div key={i} style={{width: 470, background: '#fff', borderRadius: 24, padding: 18, boxShadow: '0 30px 70px rgba(0,0,0,0.22)', opacity: a, transform: `translateY(${((1 - a) * 90 + Math.sin((f + i * 15) / 24) * 6).toFixed(1)}px) rotate(${[-2, 1.5, -1][i]}deg)`}}>
              <div style={{height: 420, borderRadius: 16, overflow: 'hidden', background: C.paper2, position: 'relative'}}>
                {im && !isVid(im) ? <Img src={sf(im)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
                <div style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) rotate(-12deg) scale(${(2.2 - 1.2 * b).toFixed(3)})`, opacity: b, fontFamily: F_OSWALD, fontWeight: 800, fontSize: c.verdict.length > 10 ? 46 : 64, color: col, border: `7px solid ${col}`, background: 'rgba(255,255,255,0.92)', borderRadius: 12, padding: '4px 18px', whiteSpace: 'nowrap'}}>{c.verdict.toUpperCase()}</div>
              </div>
              <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 50, color: C.ink, textAlign: 'center', marginTop: 14}}>{c.name}</div>
            </div>
          );
        })}
      </div>
      {cards.slice(0, 3).map((_, i) => <Sfx key={i} at={atH(hitAt, i, 30, 30)} src="sfx_text_thud.mp3" vol={0.26} />)}
    </Fade>
  );
};

const Icon: React.FC<{k: string; color?: string; size?: number}> = ({k, color = C.ink, size = 150}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
    {k === 'egg' && <path d="M50 12 C30 12 20 44 20 60 C20 78 33 90 50 90 C67 90 80 78 80 60 C80 44 70 12 50 12 Z" />}
    {k === 'bowl' && <><path d="M14 46 L86 46 C86 70 70 84 50 84 C30 84 14 70 14 46 Z" /><path d="M40 46 L70 18" /></>}
    {k === 'brush' && <><path d="M64 14 L86 36 L50 72 L28 50 Z" /><path d="M28 50 C18 60 16 76 14 86 C24 84 40 82 50 72" /></>}
    {k === 'clock' && <><circle cx="50" cy="50" r="36" /><path d="M50 28 L50 50 L66 60" /></>}
    {k === 'drop' && <path d="M50 12 C38 32 26 46 26 62 C26 76 37 88 50 88 C63 88 74 76 74 62 C74 46 62 32 50 12 Z" />}
    {k === 'sun' && <><circle cx="50" cy="50" r="16" /><path d="M50 12 L50 24 M50 76 L50 88 M12 50 L24 50 M76 50 L88 50 M23 23 L31 31 M69 69 L77 77 M23 77 L31 69 M69 31 L77 23" /></>}
    {k === 'moon' && <path d="M66 14 C44 18 30 36 30 56 C30 74 44 88 62 88 C72 88 80 84 86 78 C60 80 44 62 46 42 C47 30 54 20 66 14 Z" />}
    {k === 'hand' && <path d="M30 88 L30 50 C30 44 38 44 38 50 L38 26 C38 20 46 20 46 26 L46 22 C46 16 54 16 54 22 L54 28 C54 22 62 22 62 28 L62 36 C62 30 70 30 70 36 L70 66 C70 80 60 88 48 88 Z" />}
    {k === 'eye' && <><path d="M10 50 C24 28 76 28 90 50 C76 72 24 72 10 50 Z" /><circle cx="50" cy="50" r="11" /></>}
    {k === 'glass' && <><path d="M28 16 L72 16 L66 88 L34 88 Z" /><path d="M30 40 L70 40" /></>}
    {k === 'fridge' && <><rect x="26" y="10" width="48" height="80" rx="6" /><path d="M26 40 L74 40 M34 22 L34 32 M34 50 L34 62" /></>}
    {k === 'cross' && <path d="M24 24 L76 76 M76 24 L24 76" />}
  </svg>
);

export const MethodsTrio: React.FC<P & {methods?: {name: string; desc: string; icon: string}[]}> = ({image, hitAt, kicker = '', title = '', hot = [], methods = []}) => {
  const f = useCurrentFrame();
  return (
    <Fade>
      <Bed src={image} />
      <Card w={1720} h={790}>
        <div style={{textAlign: 'center'}}><Kicker o={inA(f, 4)}>{kicker}</Kicker><Wordy text={title} start={6} size={80} hot={hot} /></div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 44, marginTop: 46}}>
          {methods.map((m, i) => {
            const s = atH(hitAt, i, 18, 26); const a = inA(f, s, 10);
            return (
              <div key={i} style={{width: 470, height: 450, background: '#fff', borderRadius: 26, border: `3px solid ${a > 0.5 ? C.teal : C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.25 + 0.75 * a, transform: `translateY(${((1 - a) * 40).toFixed(1)}px) scale(${(0.94 + 0.06 * a).toFixed(3)})`}}>
                <div style={{width: 190, height: 190, borderRadius: '50%', background: C.tealS, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${((1 - a) * -40).toFixed(1)}deg)`}}><Icon k={m.icon} color={C.tealD} size={130} /></div>
                <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: m.name.length > 14 ? 50 : 60, color: C.ink, marginTop: 24, textAlign: 'center'}}>{m.name}</div>
                <div style={{fontFamily: F_INTER, fontWeight: 600, fontSize: 34, color: C.ink2, marginTop: 6, textAlign: 'center', padding: '0 20px'}}>{m.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>
      {methods.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 18, 26)} src="node_pop.mp3" vol={0.24} />)}
    </Fade>
  );
};

/** Receta: columna de ingredientes con medida grande + pasos numerados que se van tildando con la voz. */
export const FedRecipe: React.FC<P & {ing?: {q: string; t: string}[]; steps?: string[]}> = ({image, hitAt = [], kicker = '', title = '', hot = [], ing = [], steps = []}) => {
  const f = useCurrentFrame();
  // hits: primero los ingredientes, después los pasos
  const ingAt = (i: number) => atH(hitAt, i, 16, 14);
  const stAt = (i: number) => atH(hitAt, ing.length + i, 16 + ing.length * 14 + 12, 22);
  return (
    <Fade>
      <Bed src={image} veil={0.36} />
      <Card w={1740} h={900}>
        <Kicker color={C.amber} o={inA(f, 4)}>{kicker}</Kicker>
        <Wordy text={title} start={6} size={78} hot={hot} />
        <Underline p={inA(f, 14, 14)} color={C.amber} w={320} />
        <div style={{display: 'flex', gap: 46, marginTop: 34}}>
          <div style={{width: 640, display: 'flex', flexDirection: 'column', gap: 18}}>
            <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: C.tealD, opacity: inA(f, 10)}}>NECESITA</div>
            {ing.map((x, i) => { const a = inA(f, ingAt(i), 9); return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, background: '#fff', borderRadius: 18, padding: '16px 24px', borderLeft: `10px solid ${C.teal}`, opacity: a, transform: `translateX(${((1 - a) * -50).toFixed(1)}px)`, boxShadow: '0 10px 24px rgba(0,0,0,0.08)'}}>
                <div style={{fontFamily: F_OSWALD, fontWeight: 800, fontSize: 52, color: C.tealD, minWidth: 150, lineHeight: 1}}>{x.q}</div>
                <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 36, color: C.ink, lineHeight: 1.15}}>{x.t}</div>
              </div>); })}
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16}}>
            <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: C.green, opacity: inA(f, 12)}}>CÓMO SE HACE</div>
            {steps.map((s, i) => { const st = stAt(i); const a = inA(f, st, 9); const chk = inA(f, st + 10, 8); return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: 0.25 + 0.75 * a, transform: `translateY(${((1 - a) * 24).toFixed(1)}px)`}}>
                <div style={{width: 62, height: 62, flex: '0 0 62px', borderRadius: 16, background: chk > 0.5 ? C.green : '#fff', border: `3px solid ${C.green}`, color: chk > 0.5 ? '#fff' : C.green, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{chk > 0.5 ? '✓' : i + 1}</div>
                <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1.15}}>{s}</div>
              </div>); })}
          </div>
        </div>
      </Card>
      {ing.map((_, i) => <Sfx key={`i${i}`} at={ingAt(i)} src="node_pop.mp3" vol={0.22} />)}
      {steps.map((_, i) => <Sfx key={`s${i}`} at={stAt(i)} src="sfx_paper_tick.mp3" vol={0.26} />)}
    </Fade>
  );
};

/** Dónde va: silueta de cara con puntos que laten (x,y en % del dibujo) + flecha de dirección. `no` = zonas prohibidas (✕ roja). */
export const FedFaceZones: React.FC<P & {note?: string; zones?: {label: string; x: number; y: number; no?: boolean}[]}> = ({image, hitAt, kicker = '', title = '', hot = [], note = '', zones = []}) => {
  const f = useCurrentFrame();
  const last = zones.length ? atH(hitAt, zones.length - 1, 20, 16) : 60;
  return (
    <Fade>
      <Bed src={image} />
      <Card w={1680} h={880}>
        <div style={{display: 'flex', height: '100%', gap: 40}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Kicker o={inA(f, 6)}>{kicker}</Kicker>
            <Wordy text={title} start={8} size={84} hot={hot} />
            <Underline p={inA(f, 18, 16)} />
            {note ? <div style={{marginTop: 40, fontFamily: F_INTER, fontWeight: 700, fontSize: 38, color: C.green, background: C.greenS, borderRadius: 14, padding: '18px 26px', opacity: inA(f, last + 24, 12)}}>✓ {note}</div> : null}
          </div>
          <div style={{position: 'relative', width: 640, height: '100%'}}>
            <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: inA(f, 4, 14)}}>
              <path d="M50 8 C28 8 18 26 18 50 C18 78 32 100 50 106 C68 100 82 78 82 50 C82 26 72 8 50 8 Z" fill="#F1DCC9" stroke="#C8AE96" strokeWidth="0.8" />
              <path d="M32 44 Q38 40 44 44 M56 44 Q62 40 68 44" stroke="#8C6E58" strokeWidth="1.4" fill="none" />
              <ellipse cx="38" cy="52" rx="5" ry="2.4" fill="#fff" stroke="#8C6E58" strokeWidth="0.7" /><ellipse cx="62" cy="52" rx="5" ry="2.4" fill="#fff" stroke="#8C6E58" strokeWidth="0.7" />
              <circle cx="38" cy="52" r="1.6" fill="#5B4636" /><circle cx="62" cy="52" r="1.6" fill="#5B4636" />
              <path d="M50 56 L47 70 Q50 72 53 70" stroke="#B08E76" strokeWidth="0.9" fill="none" />
              <path d="M41 82 Q50 87 59 82" stroke="#B5655A" strokeWidth="1.6" fill="none" />
              <path d="M40 106 L38 120 M60 106 L62 120" stroke="#C8AE96" strokeWidth="0.8" />
            </svg>
            {zones.map((z, i) => {
              const s = atH(hitAt, i, 20, 16); const a = inA(f, s, 8); const pulse = 1 + 0.22 * Math.sin((f - s) / 5) * a; const col = z.no ? C.danger : C.teal;
              return (
                <div key={i} style={{position: 'absolute', left: `${z.x}%`, top: `${z.y}%`, opacity: a}}>
                  <div style={{position: 'absolute', width: 40, height: 40, left: -20, top: -20, borderRadius: '50%', background: col, border: '5px solid #fff', transform: `scale(${pulse.toFixed(3)})`, boxShadow: '0 6px 16px rgba(0,0,0,0.3)', color: '#fff', fontFamily: F_OSWALD, fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{z.no ? '✕' : i + 1}</div>
                  <div style={{position: 'absolute', left: z.x > 50 ? 32 : undefined, right: z.x > 50 ? undefined : 32, top: -24, whiteSpace: 'nowrap', fontFamily: F_INTER, fontWeight: 800, fontSize: 32, color: z.no ? C.danger : C.ink, background: '#fff', borderRadius: 10, padding: '6px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.18)'}}>{z.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      {zones.map((_, i) => <Sfx key={i} at={atH(hitAt, i, 20, 16)} src="node_pop.mp3" vol={0.2} />)}
    </Fade>
  );
};

/** LÁMINA: la página del recetario a pantalla completa, zoom punto por punto en cada hit. */
export const FedLamina: React.FC<{image: string; hitAt?: number[]; regions?: {x: number; y: number; s: number}[]}> = ({image, hitAt = [], regions}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: totalF} = useVideoConfig();
  const R = regions || [{x: 0.2, y: 0.4, s: 1.9}, {x: 0.6, y: 0.45, s: 1.6}, {x: 0.86, y: 0.5, s: 2.0}, {x: 0.5, y: 0.88, s: 1.8}];
  const keys: {t: number; x: number; y: number; s: number}[] = [{t: 0, x: 0.5, y: 0.5, s: 1}];
  R.forEach((r, i) => { if (hitAt[i] != null) keys.push({t: Math.max(keys[keys.length - 1].t + 0.8, hitAt[i]), ...r}); });
  const t = frame / FPS;
  let k = 0; while (k + 1 < keys.length && keys[k + 1].t <= t) k++;
  const a = keys[k], prev = keys[Math.max(0, k - 1)];
  const into = k > 0 ? interpolate(t, [a.t, a.t + 1.1], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)}) : 1;
  const cur = {x: prev.x + (a.x - prev.x) * into, y: prev.y + (a.y - prev.y) * into, s: prev.s + (a.s - prev.s) * into};
  const s = cur.s * (1 + 0.012 * Math.sin(frame * 0.03));
  const lim = (v: number) => Math.max(-50 * (s - 1), Math.min(50 * (s - 1), v));
  const tx = lim((0.5 - cur.x) * 100 * s), ty = lim((0.5 - cur.y) * 100 * s);
  const o = Math.min(interpolate(frame, [0, 10], [0, 1], cl), interpolate(frame, [totalF - 8, totalF], [1, 0], cl));
  return (
    <AbsoluteFill style={{background: C.paper2, opacity: o}}>
      <Sfx at={2} src="cam_zoom_punch.mp3" vol={0.24} />
      <AbsoluteFill style={{transform: `translate(${tx}%, ${ty}%) scale(${s})`, transformOrigin: '50% 50%'}}>
        <Img src={sf(image)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 40, bottom: 34, padding: '10px 22px', borderRadius: 30, background: C.tealD, color: '#fff', fontFamily: F_OSWALD, fontWeight: 700, fontSize: 30, letterSpacing: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', opacity: interpolate(frame, [30, 48], [0, 1], cl)}}>📷 SÁQUELE UNA FOTO</div>
    </AbsoluteFill>
  );
};

/** CTA del recetario: tapa en 3D + QR real + las dos vías (televisor / teléfono). */
export const GuideCTA: React.FC<P & {sub?: string; cover?: string; qr?: string; url?: string}> = ({image, kicker = '', title = '', hot = [], sub = '', cover, qr, url = ''}) => {
  const f = useCurrentFrame();
  const c = inA(f, 2, 16), q = inA(f, 12, 14);
  return (
    <Fade>
      <Bed src={image} veil={0.45} />
      <Sfx at={2} src="sfx_whoosh_soft.mp3" /><Sfx at={12} src="layer_drop.mp3" vol={0.28} />
      <div style={{position: 'absolute', left: 120, top: 150, width: 540, transform: `perspective(1600px) rotateY(${(18 - 8 * c + Math.sin(f / 40) * 2).toFixed(2)}deg) translateY(${((1 - c) * 80).toFixed(1)}px)`, opacity: c, boxShadow: '30px 40px 80px rgba(0,0,0,0.35)'}}>
        {cover ? <Img src={sf(cover)} style={{width: '100%', display: 'block', borderRadius: 8}} /> : null}
      </div>
      <Card w={1080} h={800} x={66} y={50} delay={6}>
        <Kicker color={C.amber} o={inA(f, 10)}>{kicker}</Kicker>
        <Wordy text={title} start={12} size={66} hot={hot} hotColor={C.tealD} />
        {sub ? <div style={{fontFamily: F_INTER, fontWeight: 600, fontSize: 34, color: C.ink2, marginTop: 8, opacity: inA(f, 20, 12)}}>{sub}</div> : null}
        <div style={{display: 'flex', gap: 40, marginTop: 30, alignItems: 'center'}}>
          <div style={{width: 400, height: 400, flex: '0 0 400px', background: '#fff', borderRadius: 18, padding: 18, boxSizing: 'border-box', boxShadow: '0 12px 30px rgba(0,0,0,0.18)', transform: `scale(${(0.85 + 0.15 * q).toFixed(3)})`, opacity: q}}>
            {qr ? <Img src={sf(qr)} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} /> : null}
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: C.tealD, opacity: inA(f, 22, 10)}}>EN EL TELEVISOR</div>
            <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 38, color: C.ink, opacity: inA(f, 24, 10)}}>escanee el código</div>
            <div style={{height: 2, background: C.line, margin: '18px 0'}} />
            <div style={{fontFamily: F_OSWALD, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: C.tealD, opacity: inA(f, 30, 10)}}>EN EL TELÉFONO</div>
            <div style={{fontFamily: F_INTER, fontWeight: 700, fontSize: 38, color: C.ink, opacity: inA(f, 32, 10)}}>el enlace está en la descripción</div>
            <div style={{marginTop: 22, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 34, color: '#fff', background: C.tealD, borderRadius: 12, padding: '6px 18px', display: 'inline-block', opacity: inA(f, 38, 12)}}>{url}</div>
          </div>
        </div>
      </Card>
    </Fade>
  );
};
