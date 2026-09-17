// Sets.tsx — valnivea: set-pieces NUEVOS en el look Valeria (papel crema · tinta espresso · latón · Playfair/Garamond/Caveat).
// Todos reciben `hitAt` (segundos desde el inicio del componente, calculados por el build contra el mapa de palabras).
// Envoltura común: TransitionShell (whip) + Stage (parallax, motas, viñeta) + PaperGrain.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {VAL, FONT_DISPLAY, FONT_SERIF, FONT_SERIF_FINE, FONT_HAND, FONT_SANS, CLAMP, rgba, CARD_SHADOW, CARD_SHADOW_SOFT, PaperGrain} from '../valeria/theme';
import {Kicker, Words, TransitionShell, Stage} from '../valeria/ValeriaKit';

const sf = (p?: string) => (p ? (/^https?:|^\//.test(p) ? p : staticFile(p)) : undefined);
const EO = Easing.out(Easing.cubic);

const useK = () => {
  const frame = useCurrentFrame();
  const {fps, height, width} = useVideoConfig();
  const u = height / 1080;
  const sp = (sec: number, cfg = {damping: 18, stiffness: 120, mass: 0.8}) => spring({frame: frame - Math.round(sec * fps), fps, config: cfg});
  const lin = (a: number, b: number) => interpolate(frame, [Math.round(a * fps), Math.round(b * fps)], [0, 1], {...CLAMP, easing: EO});
  const t = frame / fps;
  return {frame, fps, u, width, height, sp, lin, t};
};
const hit = (hitAt: number[] | undefined, i: number, fallback: number) => {
  const h = hitAt && hitAt[i] != null ? hitAt[i] : fallback;
  return Math.max(0.45, h - 0.15);
};
const drift = (frame: number, k = 1) => `translate(${(Math.cos(frame * 0.037) * 3 * k).toFixed(2)}px, ${(Math.sin(frame * 0.043) * 4 * k).toFixed(2)}px)`;

const Shell: React.FC<{totalF: number; seed: string; accent?: string; sprigs?: boolean; panDir?: number; children: React.ReactNode}> = ({totalF, seed, accent = VAL.gold, sprigs, panDir = 1, children}) => (
  <AbsoluteFill>
    <TransitionShell accent={accent} totalF={totalF} variant="whip">
      <Stage mood="gold" accent={accent} seed={seed} sprigs={sprigs} panDir={panDir}>
        {() => <AbsoluteFill style={{zIndex: 3}}>{children}</AbsoluteFill>}
      </Stage>
    </TransitionShell>
    <PaperGrain />
  </AbsoluteFill>
);

const Title: React.FC<{kicker?: string; title?: string; hot?: string[]; accent?: string; size?: number; start?: number; width?: string}> = ({kicker, title, hot, accent = VAL.gold, size = 64, start = 0.3, width = '100%'}) => {
  const {u} = useK();
  return (
    <div style={{width}}>
      {kicker ? <Kicker text={kicker} accent={accent} startSec={start} /> : null}
      {title ? (
        <div style={{marginTop: 18 * u, lineHeight: 1.08}}>
          <Words text={title} hot={hot} accent={accent} startSec={start + 0.2} size={Math.round(size * u)} uppercase={false} />
        </div>
      ) : null}
    </div>
  );
};

const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{background: VAL.card, border: `1.5px solid ${VAL.cardEdge}`, borderRadius: 18, boxShadow: CARD_SHADOW, position: 'relative', ...style}}>
    <div style={{position: 'absolute', inset: 8, border: `1px solid ${rgba(VAL.gold, 0.45)}`, borderRadius: 12, pointerEvents: 'none'}} />
    {children}
  </div>
);

const NumDot: React.FC<{n: string | number; size: number; color?: string; p: number}> = ({n, size, color = VAL.gold, p}) => (
  <div style={{width: size, height: size, borderRadius: size, background: color, color: VAL.onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: size * 0.5, transform: `scale(${interpolate(p, [0, 1], [0.3, 1], CLAMP)})`, flexShrink: 0, boxShadow: CARD_SHADOW_SOFT}}>{n}</div>
);

const Mark: React.FC<{ok: boolean; size: number; p: number}> = ({ok, size, p}) => {
  const c = ok ? VAL.sage : VAL.terracotta;
  const L = 30;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{flexShrink: 0, transform: `scale(${interpolate(p, [0, 1], [0.4, 1], CLAMP)})`}}>
      <circle cx={20} cy={20} r={17} fill={rgba(c, 0.14)} stroke={c} strokeWidth={2.5} opacity={Math.min(1, p * 2)} />
      {ok ? <path d="M12 21 L18 27 L29 14" fill="none" stroke={c} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
        : <path d="M13 13 L27 27 M27 13 L13 27" fill="none" stroke={c} strokeWidth={3.4} strokeLinecap="round" strokeDasharray={40} strokeDashoffset={40 * (1 - p)} />}
    </svg>
  );
};

/* ───────────── RECIPE · ficha de receta (ingredientes + pasos numerados que aterrizan por frase) ───────────── */
export const NvRecipe: React.FC<any> = ({totalF, kicker, title, hot, ing = [], steps = [], hitAt = []}) => {
  const {u, sp, frame} = useK();
  const hasIng = ing.length > 0;
  return (
    <Shell totalF={totalF} seed="nv-recipe" sprigs>
      <div style={{position: 'absolute', left: '6%', top: '12%', width: hasIng ? '34%' : '36%', transform: drift(frame)}}>
        <Title kicker={kicker} title={title} hot={hot} size={70} />
        {hasIng ? (
          <Card style={{marginTop: 34 * u, padding: `${28 * u}px ${32 * u}px`}}>
            <div style={{fontFamily: FONT_SANS, fontSize: 20 * u, letterSpacing: '0.22em', color: VAL.goldDark, fontWeight: 700}}>LO QUE NECESITA</div>
            {ing.map((x: string, i: number) => {
              const p = sp(0.8 + i * 0.35);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14 * u, marginTop: 16 * u, opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>
                  <div style={{width: 10 * u, height: 10 * u, borderRadius: 10, background: VAL.gold}} />
                  <div style={{fontFamily: FONT_SERIF, fontSize: 38 * u, color: VAL.ink, fontWeight: 600}}>{x}</div>
                </div>
              );
            })}
          </Card>
        ) : null}
      </div>
      <div style={{position: 'absolute', right: '6%', top: '50%', width: '48%', transform: `translateY(-50%) ${drift(frame, 0.7)}`}}>
        {steps.map((s: string, i: number) => {
          const st = hitAt.length ? (hitAt[i] != null ? hit(hitAt, i, 0) : 0.6 + i * 0.3) : 1.2 + i * 0.55;
          const p = sp(st);
          const on = interpolate(frame, [0, 1], [0, 1]) && p > 0.02;
          return (
            <Card key={i} style={{display: 'flex', alignItems: 'center', gap: 22 * u, padding: `${16 * u}px ${26 * u}px`, marginBottom: 16 * u, opacity: on ? Math.min(1, p * 1.4) : 0, transform: `translateY(${(1 - p) * 30}px) scale(${0.96 + 0.04 * p})`}}>
              <NumDot n={i + 1} size={58 * u} p={p} />
              <div style={{fontFamily: FONT_SERIF, fontSize: 46 * u, color: VAL.ink, fontWeight: 600, lineHeight: 1.12}}>{s}</div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
};

/* ───────────── DOTS · diagrama de la cara: 5 puntitos o flechas de toquecitos ───────────── */
export const NvDots: React.FC<any> = ({totalF, kicker, title, hot, mode = 'dots', hitAt = []}) => {
  const {u, sp, lin, frame} = useK();
  const face = sp(0.35, {damping: 22, stiffness: 90, mass: 1});
  const dots = [
    {x: 200, y: 150, h: 0, l: 'frente'}, {x: 138, y: 262, h: 1, l: 'mejilla'}, {x: 262, y: 262, h: 1, l: 'mejilla'}, {x: 200, y: 245, h: 2, l: 'nariz'}, {x: 200, y: 352, h: 3, l: 'mentón'},
  ];
  const arrowsAt = mode === 'dots' ? hit(hitAt, 4, 5) : hit(hitAt, 0, 1);
  const arrows = mode === 'dots'
    ? [[180, 150, 110, 140], [220, 150, 290, 140], [128, 262, 70, 240], [272, 262, 330, 240], [200, 352, 200, 390]]
    : [[170, 235, 95, 215], [230, 235, 305, 215], [200, 140, 200, 80], [175, 318, 110, 290], [225, 318, 290, 290]];
  const aP = lin(arrowsAt, arrowsAt + 0.9);
  return (
    <Shell totalF={totalF} seed={`nv-dots-${mode}`} sprigs panDir={-1}>
      <div style={{position: 'absolute', left: '7%', top: '50%', width: '36%', transform: `translateY(-50%) ${drift(frame)}`}}>
        <Title kicker={kicker} title={title} hot={hot} size={78} />
        <div style={{marginTop: 30 * u, fontFamily: FONT_HAND, fontSize: 46 * u, color: VAL.goldDark, opacity: aP, transform: `rotate(-2deg) translateY(${(1 - aP) * 12}px)`}}>
          {mode === 'dots' ? 'de adentro hacia afuera, sin frotar' : 'como tocando el piano'}
        </div>
      </div>
      <div style={{position: 'absolute', right: '9%', top: '50%', width: 720 * u, height: 820 * u, transform: `translateY(-50%) scale(${0.9 + 0.1 * face}) ${drift(frame, 0.6)}`, opacity: face}}>
        <Card style={{position: 'absolute', inset: 0}}><div /></Card>
        <svg viewBox="0 0 400 460" style={{position: 'absolute', left: '6%', top: '4%', width: '88%', height: '92%'}}>
          <ellipse cx={200} cy={250} rx={128} ry={172} fill={rgba(VAL.paperWarm, 0.9)} stroke={VAL.ink2} strokeWidth={2.6} strokeDasharray={1100} strokeDashoffset={1100 * (1 - lin(0.3, 1.4))} />
          <path d="M150 208 q18 -12 36 0 M214 208 q18 -12 36 0" stroke={VAL.ink2} strokeWidth={2.4} fill="none" opacity={lin(0.9, 1.4)} />
          <path d="M200 215 L190 262 q10 8 22 0" stroke={VAL.ink2} strokeWidth={2.2} fill="none" opacity={lin(1.0, 1.5)} />
          <path d="M170 312 q30 18 60 0" stroke={VAL.ink2} strokeWidth={2.4} fill="none" opacity={lin(1.1, 1.6)} />
          {mode === 'dots' ? dots.map((d, i) => {
            const p = sp(hit(hitAt, d.h, 1 + i * 0.4), {damping: 9, stiffness: 160, mass: 0.6});
            return <g key={i}><circle cx={d.x} cy={d.y} r={15 * p} fill={VAL.card} stroke={VAL.gold} strokeWidth={3} /><circle cx={d.x} cy={d.y} r={7 * p} fill={VAL.gold} /></g>;
          }) : null}
          {arrows.map((a, i) => {
            const p = lin(arrowsAt + i * 0.12, arrowsAt + 0.7 + i * 0.12);
            const [x1, y1, x2, y2] = a;
            const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
            const ang = Math.atan2(y2 - y1, x2 - x1);
            return (
              <g key={`a${i}`} opacity={p > 0.02 ? 1 : 0}>
                <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={VAL.terracotta} strokeWidth={3.2} strokeLinecap="round" strokeDasharray="7 7" />
                <path d={`M${ex} ${ey} L${ex - 13 * Math.cos(ang - 0.5)} ${ey - 13 * Math.sin(ang - 0.5)} M${ex} ${ey} L${ex - 13 * Math.cos(ang + 0.5)} ${ey - 13 * Math.sin(ang + 0.5)}`} stroke={VAL.terracotta} strokeWidth={3.2} strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      </div>
    </Shell>
  );
};

/* ───────────── REDFLAGS · lista de "nunca" o señales de alarma ───────────── */
export const NvRedFlags: React.FC<any> = ({totalF, kicker, title, items = [], mode = 'never', hitAt = []}) => {
  const {u, sp, frame} = useK();
  const alarm = mode === 'alarm';
  const cols = items.length > 4 ? 2 : 1;
  return (
    <Shell totalF={totalF} seed={`nv-flags-${mode}`} accent={VAL.terracotta}>
      <div style={{position: 'absolute', left: '7%', top: '50%', width: '34%', transform: `translateY(-50%) ${drift(frame)}`}}>
        <div style={{display: 'inline-block', padding: `${8 * u}px ${18 * u}px`, borderRadius: 8, background: VAL.terracotta, color: VAL.onAccent, fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.2em', fontSize: 22 * u, opacity: sp(0.2)}}>{alarm ? '⚠ ATENCIÓN' : 'NUNCA'}</div>
        <div style={{marginTop: 22 * u}}><Title kicker={kicker} title={title} accent={VAL.terracotta} size={72} start={0.35} /></div>
      </div>
      <div style={{position: 'absolute', right: '6%', top: '50%', width: '50%', transform: `translateY(-50%) ${drift(frame, 0.7)}`, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 18 * u}}>
        {items.map((it: string, i: number) => {
          const p = sp(hitAt.length ? hit(hitAt, i, 0.9 + i * 0.5) : 0.9 + i * 0.5, {damping: 13, stiffness: 140, mass: 0.7});
          return (
            <Card key={i} style={{display: 'flex', alignItems: 'center', gap: 20 * u, padding: `${22 * u}px ${24 * u}px`, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 40}px)`, borderColor: rgba(VAL.terracotta, 0.45)}}>
              {alarm ? (
                <svg width={52 * u} height={52 * u} viewBox="0 0 40 40" style={{flexShrink: 0, transform: `scale(${0.5 + 0.5 * p})`}}><path d="M20 4 L37 34 H3 Z" fill={rgba(VAL.terracotta, 0.15)} stroke={VAL.terracotta} strokeWidth={2.6} strokeLinejoin="round" /><path d="M20 14 V24 M20 29 V30" stroke={VAL.terracotta} strokeWidth={3.2} strokeLinecap="round" /></svg>
              ) : <Mark ok={false} size={52 * u} p={p} />}
              <div style={{fontFamily: FONT_SERIF, fontWeight: 600, fontSize: (cols > 1 ? 42 : 50) * u, color: VAL.ink, lineHeight: 1.1}}>{it}</div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
};

/* ───────────── SWAP · antes/ahora (lo que NO → lo que SÍ) ───────────── */
export const NvSwap: React.FC<any> = ({totalF, kicker, a, b, hitAt = []}) => {
  const {u, sp, lin, frame} = useK();
  const tb = hit(hitAt, 0, 2.2);
  const pa = sp(0.45);
  const strike = lin(Math.max(0.9, tb - 0.9), Math.max(1.4, tb - 0.3));
  const pb = sp(tb, {damping: 14, stiffness: 120, mass: 0.8});
  const arrow = lin(tb - 0.4, tb + 0.2);
  const card = (side: any, ok: boolean, p: number, x: string) => (
    <Card style={{position: 'absolute', top: '52%', left: x, width: '36%', padding: `${40 * u}px ${38 * u}px`, transform: `translateY(-50%) translateY(${(1 - p) * 40}px) rotate(${ok ? 1.2 : -1.5}deg) ${drift(frame, ok ? 0.6 : 0.9)}`, opacity: Math.min(1, p * 1.4), borderColor: ok ? rgba(VAL.sage, 0.5) : rgba(VAL.terracotta, 0.4)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16 * u}}>
        <Mark ok={ok} size={50 * u} p={ok ? pb : strike} />
        <div style={{fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.18em', fontSize: 22 * u, color: ok ? VAL.sage : VAL.terracotta, textTransform: 'uppercase'}}>{side.label}</div>
      </div>
      <div style={{position: 'relative', marginTop: 22 * u, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 68 * u, lineHeight: 1.08, color: ok ? VAL.ink : rgba(VAL.ink, 1 - 0.45 * strike)}}>
        {side.text}
        {!ok ? <div style={{position: 'absolute', left: 0, top: '52%', height: 5 * u, width: `${strike * 100}%`, background: VAL.terracotta, borderRadius: 4, transform: 'rotate(-2deg)'}} /> : null}
      </div>
    </Card>
  );
  return (
    <Shell totalF={totalF} seed="nv-swap">
      <div style={{position: 'absolute', left: 0, right: 0, top: '9%', display: 'flex', justifyContent: 'center'}}><Kicker text={kicker} accent={VAL.gold} startSec={0.2} /></div>
      {card(a, false, pa, '8%')}
      <svg viewBox="0 0 120 60" style={{position: 'absolute', left: '45.5%', top: '47%', width: 150 * u, opacity: arrow}}>
        <path d={`M8 30 Q60 ${30 - 20 * arrow} ${8 + 100 * arrow} 30`} stroke={VAL.gold} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M96 18 L110 30 L96 42" stroke={VAL.gold} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
      </svg>
      {card(b, true, pb, '56%')}
    </Shell>
  );
};

/* ───────────── TIN · objeto héroe 2.5D con etiquetas a mano ───────────── */
export const NvTin: React.FC<any> = ({totalF, kicker, title, hot, labels = [], image, hitAt = []}) => {
  const {u, sp, lin, frame} = useK();
  const p = sp(0.25, {damping: 20, stiffness: 70, mass: 1.1});
  const float = Math.sin(frame * 0.05) * 10 * u;
  const rot = interpolate(frame, [0, totalF], [-3, 2]);
  const pos = [{x: '62%', y: '20%'}, {x: '66%', y: '48%'}, {x: '60%', y: '76%'}];
  return (
    <Shell totalF={totalF} seed="nv-tin" sprigs>
      <div style={{position: 'absolute', left: '6%', top: '9%', width: '40%'}}><Title kicker={kicker} title={title} hot={hot} size={64} /></div>
      <div style={{position: 'absolute', left: '8%', top: '34%', width: '46%', aspectRatio: '16/10', transform: `translateY(${float}px) rotate(${rot}deg) scale(${0.85 + 0.15 * p}) perspective(1200px) rotateY(${interpolate(frame, [0, totalF], [8, -6])}deg)`, opacity: p, borderRadius: 22, overflow: 'hidden', boxShadow: CARD_SHADOW, border: `10px solid ${VAL.card}`}}>
        <Img src={sf(image) as string} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(frame, [0, totalF], [1.04, 1.14])})`}} />
      </div>
      {labels.map((l: string, i: number) => {
        const t0 = hit(hitAt, i, 1.2 + i * 1.2);
        const q = sp(t0, {damping: 14, stiffness: 120, mass: 0.7});
        const line = lin(t0 - 0.1, t0 + 0.5);
        return (
          <div key={i} style={{position: 'absolute', left: pos[i % 3].x, top: pos[i % 3].y, opacity: Math.min(1, q * 1.5), transform: `translateX(${(1 - q) * 30}px) ${drift(frame + i * 40, 0.8)}`}}>
            <svg width={120 * u} height={40 * u} viewBox="0 0 120 40" style={{position: 'absolute', left: -128 * u, top: 18 * u}}>
              <path d="M118 20 Q60 4 4 26" stroke={VAL.goldDark} strokeWidth={3} fill="none" strokeDasharray={130} strokeDashoffset={130 * (1 - line)} strokeLinecap="round" />
            </svg>
            <div style={{fontFamily: FONT_HAND, fontSize: 64 * u, color: VAL.ink, whiteSpace: 'nowrap', transform: 'rotate(-2deg)'}}>{l}</div>
            <div style={{height: 3 * u, width: `${line * 100}%`, background: rgba(VAL.gold, 0.8), borderRadius: 3}} />
          </div>
        );
      })}
    </Shell>
  );
};

/* ───────────── LAYERS · capas apiladas (lo que sella va arriba) ───────────── */
export const NvLayers: React.FC<any> = ({totalF, kicker, title, hot, layers = [], hitAt = []}) => {
  const {u, sp, frame} = useK();
  const tones = [rgba('#7FA7B8', 0.55), rgba(VAL.goldLite, 0.55), rgba('#3D63A8', 0.8)];
  return (
    <Shell totalF={totalF} seed="nv-layers" panDir={-1}>
      <div style={{position: 'absolute', left: '7%', top: '50%', width: '34%', transform: `translateY(-50%) ${drift(frame)}`}}><Title kicker={kicker} title={title} hot={hot} size={72} /></div>
      <div style={{position: 'absolute', right: '7%', bottom: '14%', width: '50%', transform: drift(frame, 0.6)}}>
        {[...layers].map((l: string, i: number) => ({l, i})).reverse().map(({l, i}) => {
          const p = sp(hit(hitAt, i, 1 + i * 0.9), {damping: 12, stiffness: 110, mass: 0.9});
          return (
            <div key={i} style={{height: 118 * u, marginTop: 14 * u, borderRadius: 16, background: tones[i % 3], border: `2px solid ${rgba(VAL.ink, 0.18)}`, boxShadow: CARD_SHADOW_SOFT, display: 'flex', alignItems: 'center', gap: 20 * u, padding: `0 ${28 * u}px`, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -160}px)`}}>
              <NumDot n={i + 1} size={54 * u} p={p} color={i === 2 ? VAL.ink : VAL.gold} />
              <div style={{fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 46 * u, color: i === 2 ? VAL.onAccent : VAL.ink}}>{l}</div>
            </div>
          );
        })}
        <div style={{height: 70 * u, marginTop: 14 * u, borderRadius: 14, background: `repeating-linear-gradient(90deg, ${rgba('#D9A58A', 0.8)} 0 40px, ${rgba('#CF9A80', 0.8)} 40px 80px)`, display: 'flex', alignItems: 'center', paddingLeft: 28 * u, fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.2em', fontSize: 22 * u, color: VAL.ink}}>SU PIEL</div>
      </div>
    </Shell>
  );
};

/* ───────────── MEASURE · la medida exacta (un garbanzo sí / una cucharada no) ───────────── */
export const NvMeasure: React.FC<any> = ({totalF, kicker, title, hot, good, bad, hitAt = []}) => {
  const {u, sp, lin, frame} = useK();
  const pg = sp(0.9, {damping: 10, stiffness: 150, mass: 0.6});
  const pb = sp(1.5);
  const note = lin(hit(hitAt, 0, 2.5), hit(hitAt, 0, 2.5) + 0.6);
  return (
    <Shell totalF={totalF} seed="nv-measure" sprigs>
      <div style={{position: 'absolute', left: 0, right: 0, top: '8%', display: 'flex', justifyContent: 'center', textAlign: 'center'}}><Title kicker={kicker} title={title} hot={hot} size={66} width="80%" /></div>
      <Card style={{position: 'absolute', left: '12%', top: '38%', width: '34%', height: '48%', transform: `scale(${0.9 + 0.1 * pg}) ${drift(frame)}`, opacity: pg}}>
        <div style={{position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)', width: 64 * u, height: 58 * u, borderRadius: '50% 50% 46% 54%', background: `radial-gradient(circle at 35% 30%, #fff, ${VAL.card} 55%, #E9E1D2)`, boxShadow: `0 6px 14px ${rgba(VAL.ink, 0.25)}`}} />
        <svg viewBox="0 0 200 200" style={{position: 'absolute', left: '50%', top: '42%', width: 170 * u, transform: 'translate(-50%,-50%)'}}><circle cx={100} cy={100} r={80} fill="none" stroke={VAL.sage} strokeWidth={4} strokeDasharray={503} strokeDashoffset={503 * (1 - lin(1.1, 1.9))} /></svg>
        <div style={{position: 'absolute', bottom: '12%', width: '100%', textAlign: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 50 * u, color: VAL.sage}}>✓ {good}</div>
      </Card>
      <Card style={{position: 'absolute', right: '12%', top: '38%', width: '34%', height: '48%', transform: `scale(${0.9 + 0.1 * pb}) ${drift(frame, 0.7)}`, opacity: pb * (1 - 0.35 * lin(2.2, 2.8))}}>
        <div style={{position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)', width: 250 * u, height: 150 * u, borderRadius: '50% 50% 40% 40%', background: `radial-gradient(circle at 40% 30%, #fff, ${VAL.card} 60%, #E3D9C6)`, boxShadow: `0 10px 24px ${rgba(VAL.ink, 0.25)}`}} />
        <svg viewBox="0 0 200 200" style={{position: 'absolute', left: '50%', top: '42%', width: 280 * u, transform: 'translate(-50%,-50%)'}}><path d="M40 40 L160 160 M160 40 L40 160" stroke={VAL.terracotta} strokeWidth={9} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - lin(2.0, 2.6))} /></svg>
        <div style={{position: 'absolute', bottom: '12%', width: '100%', textAlign: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 50 * u, color: VAL.terracotta}}>✗ {bad}</div>
      </Card>
      <div style={{position: 'absolute', left: '17%', top: '87%', fontFamily: FONT_HAND, fontSize: 48 * u, color: VAL.goldDark, opacity: note, transform: `rotate(-3deg) translateY(${(1 - note) * 10}px)`}}>parece poco… no lo es</div>
    </Shell>
  );
};

/* ───────────── SELFCHECK · la prueba del dedo (✓ / ✗ por frase) ───────────── */
export const NvSelfCheck: React.FC<any> = ({totalF, kicker, title, hot, items = [], hitAt = []}) => {
  const {u, sp, frame} = useK();
  return (
    <Shell totalF={totalF} seed="nv-self" panDir={-1}>
      <div style={{position: 'absolute', left: '7%', top: '50%', width: '32%', transform: `translateY(-50%) ${drift(frame)}`}}>
        <Title kicker={kicker} title={title} hot={hot} size={84} />
        <div style={{marginTop: 26 * u, fontFamily: FONT_HAND, fontSize: 44 * u, color: VAL.goldDark, opacity: sp(1.0)}}>toque la mejilla con el dorso del dedo</div>
      </div>
      <div style={{position: 'absolute', right: '7%', top: '50%', width: '48%', transform: `translateY(-50%) ${drift(frame, 0.7)}`}}>
        {items.map((it: any, i: number) => {
          const p = sp(hit(hitAt, i, 1 + i * 1.2), {damping: 11, stiffness: 150, mass: 0.6});
          return (
            <Card key={i} style={{display: 'flex', alignItems: 'center', gap: 24 * u, padding: `${24 * u}px ${30 * u}px`, marginBottom: 20 * u, opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 50}px)`, borderColor: it.ok ? rgba(VAL.sage, 0.5) : rgba(VAL.terracotta, 0.4)}}>
              <Mark ok={it.ok} size={64 * u} p={p} />
              <div>
                <div style={{fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 52 * u, color: VAL.ink}}>{it.t}</div>
                <div style={{fontFamily: FONT_SANS, fontWeight: 600, letterSpacing: '0.16em', fontSize: 20 * u, color: it.ok ? VAL.sage : VAL.terracotta, marginTop: 4 * u}}>{it.ok ? 'SE PUSO BIEN' : 'SOBRA CREMA'}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
};

/* ───────────── SKINTYPE · tres pieles, una enfocada ───────────── */
export const NvSkinType: React.FC<any> = ({totalF, kicker, title, types = [], focus = 0}) => {
  const {u, sp, frame} = useK();
  return (
    <Shell totalF={totalF} seed={`nv-skin-${focus}`}>
      <div style={{position: 'absolute', left: 0, right: 0, top: '9%', textAlign: 'center', display: 'flex', justifyContent: 'center'}}><Title kicker={kicker} title={title} size={62} width="60%" /></div>
      <div style={{position: 'absolute', left: '6%', right: '6%', top: '36%', display: 'flex', gap: 30 * u, alignItems: 'center'}}>
        {types.map((ty: any, i: number) => {
          const p = sp(0.5 + i * 0.18);
          const f = i === focus ? sp(0.9, {damping: 14, stiffness: 110, mass: 0.8}) : 0;
          return (
            <Card key={i} style={{flex: 1, padding: `${38 * u}px ${30 * u}px`, minHeight: 360 * u, opacity: Math.min(1, p * 1.4) * (i === focus ? 1 : 0.55), transform: `translateY(${(1 - p) * 40 - f * 18}px) scale(${1 + 0.07 * f}) ${drift(frame + i * 30, 0.5)}`, borderColor: i === focus ? VAL.gold : VAL.cardEdge, borderWidth: i === focus ? 3 : 1.5, zIndex: i === focus ? 2 : 1}}>
              <div style={{fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.2em', fontSize: 20 * u, color: VAL.goldDark}}>PIEL</div>
              <div style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 64 * u, color: VAL.ink, marginTop: 8 * u, lineHeight: 1.05}}>{ty.t}</div>
              <div style={{height: 2, width: `${40 + 60 * f}%`, background: VAL.gold, margin: `${22 * u}px 0`}} />
              <div style={{fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 44 * u, color: VAL.ink2, lineHeight: 1.2}}>{ty.r}</div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
};

/* ───────────── TIMELINE · qué esperar, con el cabezal en la etapa que se nombra ───────────── */
export const NvTimeline: React.FC<any> = ({totalF, kicker, marks = [], focus = 0}) => {
  const {u, sp, lin, frame} = useK();
  const n = marks.length;
  const xs = marks.map((_: any, i: number) => 10 + (80 * i) / Math.max(1, n - 1));
  const from = focus > 0 ? xs[focus - 1] : 4;
  const head = from + (xs[focus] - from) * lin(0.4, 1.4);
  const card = sp(1.2, {damping: 15, stiffness: 110, mass: 0.8});
  return (
    <Shell totalF={totalF} seed={`nv-tl-${focus}`}>
      <div style={{position: 'absolute', left: 0, right: 0, top: '8%', display: 'flex', justifyContent: 'center'}}><Kicker text={kicker} accent={VAL.gold} startSec={0.15} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: '30%', height: 6 * u, background: rgba(VAL.ink, 0.12)}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${head}%`, background: VAL.gold}} />
      </div>
      {marks.map((m: any, i: number) => {
        const done = i < focus || (i === focus && lin(1.2, 1.5) > 0.5);
        return (
          <div key={i} style={{position: 'absolute', left: `${xs[i]}%`, top: '30%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
            <div style={{width: (i === focus ? 40 : 26) * u, height: (i === focus ? 40 : 26) * u, borderRadius: 40, margin: '0 auto', background: done ? VAL.gold : VAL.card, border: `3px solid ${VAL.gold}`, boxShadow: CARD_SHADOW_SOFT}} />
            <div style={{position: 'absolute', top: 44 * u, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30 * u, letterSpacing: '0.06em', color: i === focus ? VAL.ink : VAL.inkSoft}}>{m.t}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: `${Math.min(70, Math.max(30, xs[focus]))}%`, top: '64%', transform: `translate(-50%,-50%) translateY(${(1 - card) * 40}px) ${drift(frame)}`, opacity: card}}>
        <Card style={{padding: `${36 * u}px ${56 * u}px`, minWidth: 760 * u, textAlign: 'center'}}>
          <div style={{fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.22em', fontSize: 24 * u, color: VAL.goldDark}}>{String(marks[focus]?.t || '').toUpperCase()}</div>
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 70 * u, color: VAL.ink, marginTop: 10 * u, lineHeight: 1.05}}>{marks[focus]?.d}</div>
        </Card>
      </div>
    </Shell>
  );
};

/* ───────────── MYTH · frase + sello FALSO / VERDAD / A MEDIAS ───────────── */
export const NvMyth: React.FC<any> = ({totalF, kicker, statement, verdict, note, hitAt = []}) => {
  const {u, sp, lin, frame} = useK();
  const c = verdict === 'VERDAD' ? VAL.sage : verdict === 'FALSO' ? VAL.terracotta : VAL.goldDark;
  const ts = hit(hitAt, 0, 2.2);
  const p = sp(0.3);
  const stamp = sp(ts, {damping: 9, stiffness: 190, mass: 0.7});
  const noteP = lin(ts + 0.5, ts + 1.1);
  return (
    <Shell totalF={totalF} seed={`nv-myth-${verdict}`} accent={c}>
      <Card style={{position: 'absolute', left: '50%', top: '47%', width: '64%', padding: `${56 * u}px ${70 * u}px ${70 * u}px`, transform: `translate(-50%,-50%) translateY(${(1 - p) * 40}px) rotate(-0.8deg) ${drift(frame)}`, opacity: p, textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}><Kicker text={kicker || '¿Mito o verdad?'} accent={VAL.gold} startSec={0.3} /></div>
        <div style={{fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 600, fontSize: 70 * u, color: rgba(VAL.ink, 1 - 0.25 * noteP * (verdict === 'FALSO' ? 1 : 0)), marginTop: 28 * u, lineHeight: 1.1}}>«{statement}»</div>
        <div style={{marginTop: 30 * u, fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 40 * u, color: VAL.ink2, opacity: noteP, transform: `translateY(${(1 - noteP) * 12}px)`}}>{note}</div>
      </Card>
      <div style={{position: 'absolute', left: '66%', top: '20%', transform: `rotate(-12deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`, opacity: Math.min(1, stamp * 3), padding: `${12 * u}px ${30 * u}px`, border: `${7 * u}px solid ${c}`, borderRadius: 12, color: c, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 76 * u, letterSpacing: '0.12em', background: rgba(VAL.card, 0.85), boxShadow: CARD_SHADOW_SOFT}}>{verdict}</div>
    </Shell>
  );
};

/* ───────────── LAMINA · la página del recetario a pantalla completa, zoom punto por punto ───────────── */
export const NvLamina: React.FC<any> = ({totalF, image, hitAt = [], regions}) => {
  const {frame, fps, u} = useK();
  const R = regions || [{x: 0.14, y: 0.53, s: 2.0}, {x: 0.5, y: 0.53, s: 1.45}, {x: 0.87, y: 0.53, s: 2.0}, {x: 0.5, y: 0.9, s: 1.75}, {x: 0.5, y: 0.5, s: 1}];
  const keys: {t: number; x: number; y: number; s: number}[] = [{t: 0, x: 0.5, y: 0.5, s: 1}];
  R.forEach((r: any, i: number) => { if (hitAt[i] != null) keys.push({t: Math.max(keys[keys.length - 1].t + 0.8, hitAt[i]), ...r}); });
  const t = frame / fps;
  let k = 0; while (k + 1 < keys.length && keys[k + 1].t <= t) k++;
  const a = keys[k], b = keys[Math.min(k + 1, keys.length - 1)];
  const moveT = 1.1;
  const pr = k + 1 < keys.length ? 0 : 1;
  const into = k > 0 ? interpolate(t, [a.t, a.t + moveT], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) : 1;
  const prev = keys[Math.max(0, k - 1)];
  const cur = {x: prev.x + (a.x - prev.x) * into, y: prev.y + (a.y - prev.y) * into, s: prev.s + (a.s - prev.s) * into};
  void b; void pr;
  const breathe = 1 + 0.012 * Math.sin(frame * 0.03);
  const s = cur.s * breathe;
  const tx = (0.5 - cur.x) * 100 * s, ty = (0.5 - cur.y) * 100 * s;
  const clampT = (v: number) => Math.max(-50 * (s - 1), Math.min(50 * (s - 1), v));
  const enter = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const exit = interpolate(frame, [totalF - 8, totalF], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{background: VAL.paperDeep, opacity: Math.min(enter, exit)}}>
      <AbsoluteFill style={{transform: `translate(${clampT(tx)}%, ${clampT(ty)}%) scale(${s})`, transformOrigin: '50% 50%'}}>
        <Img src={sf(image) as string} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 34 * u, bottom: 28 * u, padding: `${8 * u}px ${18 * u}px`, borderRadius: 30, background: rgba(VAL.ink, 0.72), color: VAL.onAccent, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 22 * u, letterSpacing: '0.14em', opacity: interpolate(frame, [fps * 1, fps * 1.6], [0, 1], CLAMP)}}>📷 SÁQUELE UNA FOTO</div>
    </AbsoluteFill>
  );
};

/* ───────────── QRCTA · página del recetario + QR REAL + las dos vías ───────────── */
export const NvQrCta: React.FC<any> = ({totalF, kicker, title, hot, sub, qr, url, cover, pages = [], variant = 'cover'}) => {
  const {u, sp, frame} = useK();
  const p = sp(0.2, {damping: 20, stiffness: 90, mass: 1});
  const q = sp(0.5, {damping: 16, stiffness: 120, mass: 0.8});
  const imgs = variant === 'pages' ? pages.slice(0, 3) : [cover];
  return (
    <Shell totalF={totalF} seed={`nv-qr-${variant}`} sprigs>
      <div style={{position: 'absolute', left: '5%', top: '50%', width: '34%', height: '78%', transform: `translateY(-50%) ${drift(frame, 0.6)}`}}>
        {imgs.map((im: string, i: number) => {
          const pi = sp(0.35 + i * 0.25);
          const n = imgs.length;
          const rot = n > 1 ? (i - (n - 1) / 2) * 7 : -3;
          const dx = n > 1 ? (i - (n - 1) / 2) * 18 : 0;
          return (
            <div key={i} style={{position: 'absolute', left: '50%', top: '50%', height: '92%', aspectRatio: '0.707', transform: `translate(-50%,-50%) translateX(${dx}%) rotate(${rot * pi}deg) translateY(${(1 - pi) * 60}px)`, opacity: pi, boxShadow: CARD_SHADOW, borderRadius: 6, overflow: 'hidden', background: VAL.card}}>
              <Img src={sf(im) as string} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: '43%', top: '12%', width: '52%', opacity: p}}>
        <Title kicker={kicker} title={title} hot={hot} size={60} />
        {sub ? <div style={{marginTop: 14 * u, fontFamily: FONT_SERIF_FINE, fontStyle: 'italic', fontSize: 36 * u, color: VAL.ink2}}>{sub}</div> : null}
      </div>
      <Card style={{position: 'absolute', left: '43%', top: '44%', width: '52%', height: '46%', display: 'flex', alignItems: 'center', gap: 36 * u, padding: `0 ${40 * u}px`, opacity: q, transform: `translateY(${(1 - q) * 40}px)`}}>
        <div style={{background: '#FFFFFF', padding: 18 * u, borderRadius: 10, flexShrink: 0, boxShadow: CARD_SHADOW_SOFT}}>
          <Img src={sf(qr) as string} style={{width: 380 * u, height: 380 * u, display: 'block', imageRendering: 'pixelated'}} />
        </div>
        <div>
          <div style={{fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.16em', fontSize: 22 * u, color: VAL.goldDark}}>EN EL TELEVISOR</div>
          <div style={{fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 36 * u, color: VAL.ink, marginTop: 4 * u}}>escanee el código</div>
          <div style={{height: 1.5, background: rgba(VAL.ink, 0.15), margin: `${18 * u}px 0`}} />
          <div style={{fontFamily: FONT_SANS, fontWeight: 700, letterSpacing: '0.16em', fontSize: 22 * u, color: VAL.goldDark}}>EN EL TELÉFONO</div>
          <div style={{fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 36 * u, color: VAL.ink, marginTop: 4 * u}}>el enlace está en la descripción</div>
          <div style={{marginTop: 22 * u, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30 * u, color: VAL.ink}}>{url}</div>
        </div>
      </Card>
    </Shell>
  );
};
